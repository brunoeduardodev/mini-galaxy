import { Meteor } from 'meteor/meteor'
import { Octokit } from 'octokit'

export const githubApi = {
  getUserRepositories: async (accessToken: string) => {
    const octokit = new Octokit({ auth: accessToken })
    const result = await octokit.request('GET /user/repos', { per_page: 100 })
    if (result.status !== 200) {
      throw new Meteor.Error('Error getting user repositories')
    }

    return result.data
  },
  getRepository: async (accessToken: string, owner: string, repo: string) => {
    const octokit = new Octokit({ auth: accessToken })
    const result = await octokit.request(`GET /repos/{owner}/{repo}`, {
      owner,
      repo,
    })

    if (result.status !== 200) {
      throw new Meteor.Error('Error getting repository')
    }

    return result.data
  },
  getRepositoryBranches: async (accessToken: string, owner: string, repo: string) => {
    const octokit = new Octokit({ auth: accessToken })
    const result = await octokit.request(`GET /repos/{owner}/{repo}/branches`, {
      owner,
      repo,
    })

    if (result.status !== 200) {
      throw new Meteor.Error('Error getting repository branches')
    }

    return result.data
  },
  getRepositoryAndBranches: async (accessToken: string, owner: string, repo: string) => {
    const [getRepositoryResult, getBranchesResult] = await Promise.allSettled([
      githubApi.getRepository(accessToken, owner, repo),
      githubApi.getRepositoryBranches(accessToken, owner, repo),
    ])

    if (getRepositoryResult.status === 'rejected') {
      throw new Meteor.Error('Error getting repository', getRepositoryResult.reason?.message)
    }

    const repository = getRepositoryResult.value

    if (getBranchesResult.status === 'rejected') {
      return {
        repository,
        branches: [
          {
            name: repository.default_branch,
          },
        ],
      }
    }

    return {
      repository,
      branches: getBranchesResult.value,
    }
  },
}
