import { addLatestBranchCommitToQueue } from './add-latest-branch-commit-to-queue'
import { addTaskToQueue } from './add-task-to-queue'
import { rebuildLatestTask } from './rebuild-latest-task'

export const deployTasksServices = {
  addLatestBranchCommitToQueue,
  addTaskToQueue,
  rebuildLatestTask,
}
