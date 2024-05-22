import { mkdtemp, access } from 'fs/promises'
import os from 'os'
import path from 'path'
import { spawn } from 'child_process'
import { Meteor } from 'meteor/meteor'
import { DeployTask } from './schema'
import { logGroupService } from '../log-group/services'
import { logService } from '../log/services'
import { deployTasks } from './services'
import { s3Api } from '/server/s3/client'
import { projects } from '../projects/services'

const runnerLogger = (logGroupId: string) => ({
  log: (message: string) => {
    console.log(message)
    logService.addLog(logGroupId, message, 'log')
  },
  error: (message: string) => {
    console.error(message)
    logService.addLog(logGroupId, message, 'error')
  },
})

type RunGitCloneOptions = {
  tempDir: string
  logGroupId: string
  cloneUrl: string
}

type Options = {
  cwd: string
  command: string
  args: string[]

  onStdout: (data: string) => void
  onStderr: (data: string) => void
}
async function runCommand({ cwd, command, args, onStdout, onStderr }: Options) {
  return new Promise<void>((resolve, reject) => {
    const spawnedCone = spawn(command, args, {
      cwd,
    })

    spawnedCone.stdout.on('data', (data) => {
      onStdout(data.toString())
    })

    spawnedCone.stderr.on('error', (data) => {
      onStderr(data.toString())
    })

    spawnedCone.on('close', (res) => {
      if (res !== 0) {
        reject(new Meteor.Error('Closed with non-zero code'))
        return
      }
      resolve()
    })
  })
}

async function runGitClone({ cloneUrl, tempDir, logGroupId }: RunGitCloneOptions) {
  return runCommand({
    cwd: tempDir,
    command: 'git',
    args: ['clone', cloneUrl, '.'],
    onStdout: (data) => {
      logService.addLog(logGroupId, data, 'log')
    },
    onStderr: (data) => {
      logService.addLog(logGroupId, data, 'error')
    },
  })
}

type RunGitCheckoutOptions = {
  tempDir: string
  logGroupId: string
  commitSha: string
}

async function runGitCheckout({ tempDir, logGroupId, commitSha }: RunGitCheckoutOptions) {
  return runCommand({
    cwd: tempDir,
    command: 'git',
    args: ['checkout', commitSha],
    onStdout: (data) => {
      logService.addLog(logGroupId, data, 'log')
    },
    onStderr: (data) => {
      logService.addLog(logGroupId, data, 'error')
    },
  })
}

async function checkIfFileExists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch (err) {
    return false
  }
}

type RunInstallStepOptions = {
  tempDir: string
  logGroupId: string
}

async function runInstallStep({ tempDir, logGroupId }: RunInstallStepOptions) {
  const isNpm = await checkIfFileExists(path.join(tempDir, 'package-lock.json'))
  if (isNpm) {
    console.log('installing with npm')
    await runCommand({
      cwd: tempDir,
      command: 'npm',
      args: ['install'],
      onStdout: (data) => {
        logService.addLog(logGroupId, data, 'log')
      },
      onStderr: (data) => {
        logService.addLog(logGroupId, data, 'error')
      },
    })
    return
  }

  const isPnpm = await checkIfFileExists(path.join(tempDir, 'pnpm-lock.yaml'))
  if (isPnpm) {
    console.log('installing with pnpm')
    await runCommand({
      cwd: tempDir,
      command: 'pnpm',
      args: ['install'],
      onStdout: (data) => {
        logService.addLog(logGroupId, data, 'log')
      },
      onStderr: (data) => {
        logService.addLog(logGroupId, data, 'error')
      },
    })
    return
  }

  const isYarn = await checkIfFileExists(path.join(tempDir, 'yarn.lock'))
  if (isYarn) {
    console.log('installing with yarn')
    await runCommand({
      cwd: tempDir,
      command: 'yarn',
      args: ['install'],
      onStdout: (data) => {
        logService.addLog(logGroupId, data, 'log')
      },
      onStderr: (data) => {
        logService.addLog(logGroupId, data, 'error')
      },
    })
    return
  }

  throw new Meteor.Error('Could not find a package manager')
}

export class Runner {
  status: 'pending' | 'running' = 'pending'

  constructor() {
    this.status = 'pending'
  }

  async run(task: DeployTask) {
    this.status = 'running'
    try {
      await deployTasks.updateTaskStatus(task._id, 'running')
      const cloneLogGroupId = await logGroupService.addLogGroup('Cloning project')
      const cloneLogger = runnerLogger(cloneLogGroupId)

      cloneLogger.log('Creating temporary directory')

      const tempDir = await mkdtemp(path.join(os.tmpdir(), 'mini-galaxy-'))

      cloneLogger.log(`Created temporary directory: ${tempDir}`)
      if (!task.cloneUrl) {
        throw new Meteor.Error('No clone url')
      }

      cloneLogger.log('Cloning project')

      await runGitClone({
        cloneUrl: task.cloneUrl,
        tempDir,
        logGroupId: cloneLogGroupId,
      })

      cloneLogger.log('Cloned project')

      cloneLogger.log(`Checking out commit #${task.commitSha}`)

      if (!task.commitSha) {
        console.log('no commit sha')
        throw new Meteor.Error('No commit sha')
      }

      await runGitCheckout({
        tempDir,
        logGroupId: cloneLogGroupId,
        commitSha: task.commitSha!,
      })

      cloneLogger.log('Checked out commit')

      if (task.buildStep) {
        const installStepLogGroupId = await logGroupService.addLogGroup('Installing dependencies')
        const installStepLogger = runnerLogger(installStepLogGroupId)

        installStepLogger.log('Installing dependencies')

        await runInstallStep({
          tempDir,
          logGroupId: installStepLogGroupId,
        })

        cloneLogger.log('Installed dependencies')
      }

      if (task.buildStep) {
        const buildStepLogGroupId = await logGroupService.addLogGroup('Building project')
        const buildStepLogger = runnerLogger(buildStepLogGroupId)

        buildStepLogger.log('Building project')

        const command = task.buildStep.split(' ')[0]
        const args = task.buildStep.split(' ').slice(1)

        runCommand({
          cwd: tempDir,
          command,
          args,
          onStdout: (data) => {
            buildStepLogger.log(data)
          },
          onStderr: (data) => {
            buildStepLogger.error(data)
          },
        })
      }

      const uploadLoggerGroupId = await logGroupService.addLogGroup('Uploading to S3')
      const uploadLogger = runnerLogger(uploadLoggerGroupId)

      uploadLogger.log('Started uploading to S3')

      const bucketName = `${task.projectId}-${task.branchName}-${task.commitSha}`.toLowerCase()
      uploadLogger.log(`Creating S3 bucket ${bucketName}`)

      await s3Api.createBucket(bucketName)

      uploadLogger.log(`S3 bucket ${bucketName} created`)

      uploadLogger.log('Setting S3 settings as site bucket')
      await s3Api.setS3SettingsAsSiteBucket(bucketName)
      uploadLogger.log('S3 settings set as site bucket')

      const outDir = task.outDir || ''
      const finalFolder = path.join(tempDir, outDir)

      uploadLogger.log(`Uploading ${finalFolder} to S3`)
      await s3Api.syncBucketWithFolder({
        bucketName,
        localFolder: finalFolder,
        onProgress: (progress: any) => {
          const percentage = Math.round((progress.size.current / progress.size.total) * 100)
          cloneLogger.log(`Syncing ${percentage}%`)
        },
      })
      uploadLogger.log('Uploaded to S3')

      const finalUrl = `http://${bucketName}.s3-website-us-east-1.amazonaws.com`

      await Promise.all([
        deployTasks.updateTaskStatus(task._id, 'success'),
        deployTasks.setDeployTaskUrl(task._id, finalUrl),
        projects.setMostRecentUrl(task.projectId, finalUrl),
      ])
    } catch (err) {
      console.error(err)
      await deployTasks.updateTaskStatus(task._id, 'error')
    } finally {
      this.status = 'pending'
    }
  }
}
