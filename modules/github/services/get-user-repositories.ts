import { Meteor } from 'meteor/meteor'
import { githubApi } from '/server/apis/github/api'

export const getUserRepositories = async () => {
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

  const repositories = await githubApi.getUserRepositories({ accessToken })
  return repositories
}
