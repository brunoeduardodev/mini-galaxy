import { Runner } from './runner'
import { DeployTask } from './schema'

export class RunnerPool {
  runners: Runner[]

  constructor(private count: number) {
    this.runners = Array.from({ length: this.count }, () => new Runner())
  }

  isFull() {
    return !this.runners.find((runner) => runner.status === 'pending')
  }

  async addTaskToQueue(task: DeployTask) {
    if (this.isFull()) {
      return false
    }
    const availableRunner = this.runners.find((runner) => runner.status === 'pending')

    if (!availableRunner) {
      return false
    }

    availableRunner.run(task)

    return true
  }
}
