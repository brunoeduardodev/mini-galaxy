import * as grubba from 'grubba-rpc'
import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { githubApi } from '/server/github/api'

export const github = grubba
  .createModule('github')
  .addMethod('getUserRepositories', z.object({}), async () => {
    const userId = Meteor.userId()
    if (!userId) {
      return []
    }

    const currentUser = await Meteor.userAsync()
    if (!currentUser) {
      return []
    }
    if (!currentUser.services?.github?.id) {
      throw new Meteor.Error('User not connected to GitHub')
    }

    const accessToken = currentUser.services?.github?.accessToken
    if (!accessToken) {
      throw new Meteor.Error('User doesnt have a GitHub access token')
    }

    const repositories = await githubApi.getUserRepositories(accessToken)
    return repositories
  })

  .addMethod('getRepositoryAndBranches', z.object({ name: z.string() }), async ({ name }) => {
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

    const repository = await githubApi.getRepositoryAndBranches(
      accessToken,
      currentUser.services.github.username,
      name,
    )

    return repository
  })
  .buildSubmodule()
