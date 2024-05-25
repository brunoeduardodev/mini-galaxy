import { Meteor } from 'meteor/meteor'
import { Octokit } from 'octokit'
import { envs } from '../envs'

type GetUsersRepositoriesInput = {
  accessToken: string
}

type GetRepositoryInput = {
  accessToken: string
  owner: string
  repo: string
}

type GetRepositoryBranchesInput = {
  accessToken: string
  owner: string
  repo: string
}

type GetRepositoryAndBranchesInput = {
  accessToken: string
  owner: string
  repo: string
}

type AddPushWebhookInput = {
  accessToken: string
  owner: string
  repo: string
}

type GetCommitDetailsInput = {
  accessToken: string
  owner: string
  repo: string
  commitSha: string
}

export const githubApi = {
  getUserRepositories: async ({ accessToken }: GetUsersRepositoriesInput) => {
    const octokit = new Octokit({ auth: accessToken })
    const result = await octokit.request('GET /user/repos', { per_page: 100 })
    if (result.status !== 200) {
      throw new Meteor.Error('Error getting user repositories')
    }

    return result.data
  },
  getRepository: async ({ accessToken, owner, repo }: GetRepositoryInput) => {
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

  getRepositoryBranches: async ({ accessToken, owner, repo }: GetRepositoryBranchesInput) => {
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

  getRepositoryAndBranches: async ({ accessToken, owner, repo }: GetRepositoryAndBranchesInput) => {
    const [getRepositoryResult, getBranchesResult] = await Promise.allSettled([
      githubApi.getRepository({ accessToken, owner, repo }),
      githubApi.getRepositoryBranches({ accessToken, owner, repo }),
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

  addPushWebhook: async ({ accessToken, owner, repo }: AddPushWebhookInput) => {
    const octokit = new Octokit({ auth: accessToken })

    console.log('Adding webhook', { owner, repo })

    try {
      const result = await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: `${envs.http.domain}${envs.githubApp.webhookPrefix}/webhooks`,
          content_type: 'json',
          secret: envs.githubApp.webhookSecret,
        },
        events: ['push'],
      })

      if (result.status !== 201) {
        throw new Meteor.Error('Error adding webhook')
      }

      return result.data
    } catch (error) {
      console.error(error)
      throw new Meteor.Error('Error adding webhook')
    }
  },

  getCommitDetails: async ({ accessToken, owner, repo, commitSha }: GetCommitDetailsInput) => {
    const octokit = new Octokit({ auth: accessToken })
    const commit = await octokit.rest.repos.getCommit({ owner, repo, ref: commitSha })

    return commit.data
  },
}
