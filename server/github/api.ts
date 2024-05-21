import { Meteor } from 'meteor/meteor'
import { Octokit } from 'octokit'

export const getUserRepositories = async (accessToken: string) => {
  console.log('getUserRepositories')
  console.log('Octokit')

  const octokit = new Octokit({ auth: accessToken })
  console.log({ accessToken })
  const result = await octokit.request('GET /user/repos')
  console.log(result)
  if (result.status !== 200) {
    throw new Meteor.Error('Error getting user repositories')
  }

  return result.data
}
