import * as grubba from 'grubba-rpc'
import z from 'zod'
import { GetRepositoryAndBranchesSchema } from './services/get-repository-and-branches'
import { getUserRepositories } from './services/get-user-repositories'
import { githubServices } from './services'

export const githubRpc = grubba
  .createModule('github')
  .addMethod('getUserRepositories', z.object({}), getUserRepositories)
  .addMethod(
    'getRepositoryAndBranches',
    GetRepositoryAndBranchesSchema,
    githubServices.getRepositoryAndBranches,
  )
  .buildSubmodule()
