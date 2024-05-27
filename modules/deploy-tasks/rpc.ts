import * as grubba from 'grubba-rpc'
import z from 'zod'
import { deployTasksServices } from './services'

export const deployTasksRpc = grubba
  .createModule('deployTasks')
  .addMethod('rebuildLatestTask', z.object({}), deployTasksServices.rebuildLatestTask)
  .buildSubmodule()
