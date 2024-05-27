import * as grubba from 'grubba-rpc'
import { deployTasksServices } from './services'
import { RebuildLatestTaskSchema } from './services/rebuild-latest-task'

export const deployTasksRpc = grubba
  .createModule('deployTasks')
  .addMethod('rebuildLatestTask', RebuildLatestTaskSchema, deployTasksServices.rebuildLatestTask)
  .buildSubmodule()
