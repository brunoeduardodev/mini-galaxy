import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { githubApi } from '/server/apis/github/api'

export const GetRepositoryAndBranchesSchema = z.object({ repo: z.string(), owner: z.string() })
export type GetRepositoryAndBranchesInput = z.infer<typeof GetRepositoryAndBranchesSchema>

export const getRepositoryAndBranches = async ({ repo, owner }: GetRepositoryAndBranchesInput) => {
  const userId = Meteor.userId()
  if (!userId) {
    throw new Meteor.Error('Unauthenticated')
  }

  const currentUser = await Meteor.userAsync()
  if (!currentUser) {
    throw new Meteor.Error('Unauthenticated')
  }

  if (!currentUser.services?.github?.id) {
    throw new Meteor.Error('User not connected to GitHub')
  }

  const accessToken = currentUser.services?.github?.accessToken
  if (!accessToken) {
    throw new Meteor.Error('User doesnt have a GitHub access token')
  }

  const repository = await githubApi.getRepositoryAndBranches({ accessToken, owner, repo })

  return repository
}
