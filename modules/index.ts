import * as grubba from 'grubba-rpc'
import { projects } from './projects'
import { github } from './github'
import { deployTasks } from './deploy-tasks'

const apiModule = grubba
  .createModule()
  .addSubmodule(projects)
  .addSubmodule(github)
  .addSubmodule(deployTasks)
  .build()

export type Api = typeof apiModule
