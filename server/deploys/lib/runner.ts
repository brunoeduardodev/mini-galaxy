import { mkdtemp, access } from 'fs/promises'
import os from 'os'
import path from 'path'
import { Meteor } from 'meteor/meteor'
import { runCommand } from '/server/cli/run-command'
import { logServices } from '/modules/log/services'
import { DeployTask, Step, StepOrders } from '/modules/deploy-tasks/schema'
import { DeployTasksCollection } from '/modules/deploy-tasks/collection'
import { logGroupServices } from '/modules/log-group/services'
import { s3Api } from '../../apis/s3/api'
import { projectsServices } from '/modules/projects/services'

const makeLogger = (logGroupId: string) => ({
  log: (content: string) => {
    console.log(content, { logGroupId })
    logServices.createLog({
      logGroupId,
      content,
      type: 'log',
    })
  },
  error: (content: string) => {
    console.error(content, { logGroupId })
    logServices.createLog({
      logGroupId,
      content,
      type: 'error',
    })
  },
})

type RunGitCloneOptions = {
  tempDir: string
  logGroupId: string
  cloneUrl: string
}

async function runGitClone({ cloneUrl, tempDir, logGroupId }: RunGitCloneOptions) {
  const logger = makeLogger(logGroupId)
  return runCommand({
    cwd: tempDir,
    command: 'git',
    args: ['clone', cloneUrl, '.'],
    onStdout: logger.log,
    onStderr: logger.error,
  })
}

type RunGitCheckoutOptions = {
  tempDir: string
  logGroupId: string
  commitSha: string
}

async function runGitCheckout({ tempDir, logGroupId, commitSha }: RunGitCheckoutOptions) {
  const logger = makeLogger(logGroupId)

  return runCommand({
    cwd: tempDir,
    command: 'git',
    args: ['checkout', commitSha],
    onStdout: logger.log,
    onStderr: logger.error,
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
  const logger = makeLogger(logGroupId)
  const isNpm = await checkIfFileExists(path.join(tempDir, 'package-lock.json'))
  if (isNpm) {
    console.log('installing with npm')
    await runCommand({
      cwd: tempDir,
      command: 'npm',
      args: ['install'],
      onStdout: logger.log,
      onStderr: logger.error,
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
      onStdout: logger.log,
      onStderr: logger.error,
    })
    return
  }

  const isYarn = await checkIfFileExists(path.join(tempDir, 'yarn.lock'))
  if (isYarn) {
    await runCommand({
      cwd: tempDir,
      command: 'yarn',
      args: ['install'],
      onStdout: logger.log,
      onStderr: logger.error,
    })
    return
  }

  throw new Meteor.Error('Could not find a package manager')
}

export const getStepsStatusByFailedStep = (failedStep: Step) => {
  const failIndex = StepOrders.indexOf(failedStep)
  if (failIndex === -1) return {}

  const errors: { [key in Step]?: 'success' | 'error' } = {}
  StepOrders.forEach((step, index) => {
    if (index < failIndex) {
      errors[step] = 'success'
      return
    }

    if (index === failIndex) {
      errors[step] = 'error'
    }
  })

  return errors
}

export class Runner {
  status: 'pending' | 'running' = 'pending'

  step: Step = 'clone'

  constructor() {
    this.status = 'pending'
  }

  async run(task: DeployTask) {
    this.status = 'running'
    try {
      const cloneLogGroupId = await logGroupServices.createLogGroup({ name: 'Cloning project' })
      DeployTasksCollection.updateAsync(task._id, {
        $set: {
          'logGroups.clone': cloneLogGroupId,
          status: 'running',
          stepsStatus: {
            clone: 'running',
            deploy: 'pending',
            ...(task.build.script ? { build: 'pending', install: 'pending' } : {}),
          },
        },
      })

      const cloneLogger = makeLogger(cloneLogGroupId)
      cloneLogger.log('Creating temporary directory')

      const tempDir = await mkdtemp(path.join(os.tmpdir(), 'mini-galaxy-'))
      cloneLogger.log(`Created temporary directory: ${tempDir}`)

      if (!task.repository.cloneUrl) {
        throw new Meteor.Error('No clone url')
      }

      cloneLogger.log('Cloning project')

      await runGitClone({
        cloneUrl: task.repository.cloneUrl,
        tempDir,
        logGroupId: cloneLogGroupId,
      })

      cloneLogger.log('Cloned project')

      cloneLogger.log(`Checking out commit #${task.commitSha}`)

      if (!task.commitSha) {
        throw new Meteor.Error('No commit sha')
      }

      await runGitCheckout({
        tempDir,
        logGroupId: cloneLogGroupId,
        commitSha: task.commitSha!,
      })

      cloneLogger.log('Checked out commit')

      if (task.build.script) {
        this.step = 'install'
        const installStepLogGroupId = await logGroupServices.createLogGroup({
          name: 'Installing dependencies',
        })
        DeployTasksCollection.updateAsync(task._id, {
          $set: {
            'logGroups.install': installStepLogGroupId,
            'stepsStatus.clone': 'success',
            'stepsStatus.install': 'running',
          },
        })
        const installStepLogger = makeLogger(installStepLogGroupId)

        installStepLogger.log('Installing dependencies')

        await runInstallStep({
          tempDir,
          logGroupId: installStepLogGroupId,
        })

        cloneLogger.log('Installed dependencies')

        this.step = 'build'
        const buildStepLogGroupId = await logGroupServices.createLogGroup({
          name: 'Building project',
        })

        DeployTasksCollection.updateAsync(task._id, {
          $set: {
            'logGroups.build': buildStepLogGroupId,
            'stepsStatus.install': 'success',
            'stepsStatus.build': 'running',
          },
        })

        const buildStepLogger = makeLogger(buildStepLogGroupId)

        buildStepLogger.log('Building project')

        const command = task.build.script.split(' ')[0]
        const args = task.build.script.split(' ').slice(1)

        await runCommand({
          cwd: tempDir,
          command,
          args,
          shell: true,
          env: {
            ...process.env,
            NODE_ENV: 'production',
          },
          onStdout: (data) => {
            buildStepLogger.log(data)
          },
          onStderr: (data) => {
            buildStepLogger.error(data)
          },
        })
      }

      this.step = 'deploy'

      const uploadLoggerGroupId = await logGroupServices.createLogGroup({
        name: 'Uploading to S3',
      })
      const uploadLogger = makeLogger(uploadLoggerGroupId)

      DeployTasksCollection.updateAsync(task._id, {
        $set: {
          'logGroups.deploy': uploadLoggerGroupId,
          'stepsStatus.deploy': 'running',
          'stepsStatus.clone': 'success',
          ...(task.build.script ? { 'stepsStatus.build': 'success' } : {}),
        },
      })

      uploadLogger.log('Started uploading to S3')

      const bucketPrefix =
        `${task.repository.owner}-${task.repository.name}-${task.repository.branch}`.slice(0, 40)

      const bucketName = `${bucketPrefix}-${task.commitSha.slice(0, 10)}`
        .toLowerCase()
        .replace(/\//g, '-')
      uploadLogger.log(`Creating S3 bucket ${bucketName}`)

      await s3Api.createBucket(bucketName)

      uploadLogger.log(`S3 bucket ${bucketName} created`)

      uploadLogger.log('Setting S3 settings as site bucket')
      await s3Api.setS3SettingsAsSiteBucket(bucketName)
      uploadLogger.log('S3 settings set as site bucket')

      const outDir = task.build.outDir || ''
      const finalFolder = path.join(tempDir, outDir)

      uploadLogger.log(`Uploading ${finalFolder} to S3`)
      await s3Api.syncBucketWithFolder({
        bucketName,
        localFolder: finalFolder,
        onProgress: (progress: any) => {
          const percentage = Math.round((progress.size.current / progress.size.total) * 100)
          uploadLogger.log(`Syncing ${percentage}%`)
        },
      })
      uploadLogger.log('Uploaded to S3')

      const finalUrl = `http://${bucketName}.s3-website-us-east-1.amazonaws.com`

      await Promise.all([
        DeployTasksCollection.updateAsync(task._id, {
          $set: {
            deployUrl: finalUrl,
            bucketName,
            status: 'success',
            'stepsStatus.deploy': 'success',
          },
        }),
        projectsServices.setMostRecentUrl({ projectId: task.projectId, url: finalUrl }),
      ])
    } catch (err) {
      await DeployTasksCollection.updateAsync(task._id, {
        $set: {
          status: 'error',
          stepsStatus: getStepsStatusByFailedStep(this.step),
        },
      })
    } finally {
      this.status = 'pending'
    }
  }
}
