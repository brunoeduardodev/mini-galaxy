import which from 'which'
import { runCommand } from '/server/cli/run-command'

export const loadDependencies = async () => {
  const [hasYarnResult, hasPnpmResult] = await Promise.allSettled([which('yarn'), which('pnpm')])
  const packagesToInstall = []
  if (hasYarnResult.status === 'rejected' || !hasYarnResult.value) {
    packagesToInstall.push('yarn')
  }

  if (hasPnpmResult.status === 'rejected' || !hasPnpmResult.value) {
    packagesToInstall.push('pnpm')
  }

  if (packagesToInstall.length === 0) {
    console.log('Yarn and pnpm are already installed.')
    return
  }

  console.log(`Installing ${packagesToInstall.join(' and ')}`)

  runCommand({
    command: 'npm',
    args: ['install', '-g', ...packagesToInstall],
    cwd: process.cwd(),
    onStdout: (data) => {
      console.log(data)
    },
    onStderr: (data) => {
      console.error(data)
    },
  })
}
