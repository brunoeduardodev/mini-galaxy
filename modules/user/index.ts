import * as grubba from 'grubba-rpc'
import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { getUserRepositories } from '/server/github/api'

export const user = grubba
  .createModule('user')
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

    const repositories = await getUserRepositories(accessToken)
    return repositories
  })
  .buildSubmodule()
