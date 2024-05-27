import { spawn } from 'child_process'
import { Meteor } from 'meteor/meteor'

type Options = {
  cwd: string
  command: string
  shell?: boolean
  args: string[]
  env?: Record<string, string>

  onStdout: (data: string) => void
  onStderr: (data: string) => void
}

export async function runCommand({ cwd, command, args, onStdout, onStderr, shell, env }: Options) {
  return new Promise<void>((resolve, reject) => {
    const spawnedCommand = spawn(command, args, {
      cwd,
      shell,
      env,
    })

    spawnedCommand.stdout.on('data', (data) => {
      onStdout(data.toString())
    })

    spawnedCommand.stderr.on('data', (data) => {
      onStderr(data.toString())
    })

    spawnedCommand.on('close', (res) => {
      if (res !== 0) {
        reject(new Meteor.Error('Closed with non-zero code'))
        return
      }
      resolve()
    })
  })
}
