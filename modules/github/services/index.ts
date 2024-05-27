import { getRepositoryAndBranches } from './get-repository-and-branches'
import { getUserRepositories } from './get-user-repositories'

export const githubServices = {
  getUserRepositories,
  getRepositoryAndBranches,
}
