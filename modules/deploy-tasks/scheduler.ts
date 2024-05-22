import { DeployTasksCollection } from './collection'
import { RunnerPool } from './runner-pool'

const getNextDeployTasks = async (size: number) => {
  const nextTasks = await DeployTasksCollection.find(
    { status: 'pending' },
    { sort: { createdAt: 1 }, limit: size },
  ).fetchAsync()

  return nextTasks
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const startDeployTaskScheduler = () => {
  const pool = new RunnerPool(5)
  async function getNextBatch() {
    try {
      const nextTasks = await getNextDeployTasks(5)
      for (const task of nextTasks) {
        if (pool.isFull()) {
          continue
        }

        pool.addTaskToQueue(task)
      }
    } catch (err) {
      console.error(err)
    }

    await sleep(5000)
    process.nextTick(() => {
      getNextBatch()
    })
  }

  getNextBatch()
}
