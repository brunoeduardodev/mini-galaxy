import * as grubba from 'grubba-rpc'
import { projectsRpc } from '/modules/projects/rpc'
import { githubRpc } from '/modules/github/rpc'
import { deployTasksRpc } from '/modules/deploy-tasks/rpc'

const apiModule = grubba
  .createModule()
  .addSubmodule(projectsRpc)
  .addSubmodule(githubRpc)
  .addSubmodule(deployTasksRpc)
  .build()

export type Api = typeof apiModule
