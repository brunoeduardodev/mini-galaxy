import { Meteor } from 'meteor/meteor'
import { DeployTasksCollection } from './collection'
import { githubApi } from '/server/github/api'

type AddTaskToQueueInput = {
  projectId: string
  cloneUrl?: string
  branchName?: string
  repositoryName?: string
  userId: string
}

export const deployTasks = {
  addTaskToQueue: async ({
    branchName,
    cloneUrl,
    repositoryName,
    projectId,
    userId,
  }: AddTaskToQueueInput) => {
    const user = await Meteor.users.findOneAsync(userId)
    if (!user) {
      throw new Meteor.Error('User not found')
    }

    const accessToken = user.services?.github?.accessToken
    if (!accessToken) {
      throw new Meteor.Error(`User doesn't have a GitHub access token`)
    }
    const githubUsername = user.services?.github?.username
    if (!githubUsername) {
      throw new Meteor.Error(`User doesn't have a GitHub username`)
    }

    if (!repositoryName) {
      throw new Meteor.Error('No repository name')
    }

    const branches = await githubApi.getRepositoryBranches(
      accessToken,
      githubUsername,
      repositoryName,
    )

    const targetBranch = branches.find((branch) => branch.name === branchName)
    if (!targetBranch) {
      throw new Meteor.Error('Branch not found')
    }

    const deployTaskId = await DeployTasksCollection.insertAsync({
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
      userId,
      branchName,
      commitSha: targetBranch.commit.sha,
      cloneUrl,
      repositoryName,
    })

    return {
      _id: deployTaskId,
    }
  },
  setDeployTaskUrl: async (deployTaskId: string, url: string) => {
    await DeployTasksCollection.updateAsync(deployTaskId, {
      $set: {
        url,
      },
    })
  },
  updateTaskStatus: async (
    deployTaskId: string,
    status: 'pending' | 'running' | 'success' | 'error',
  ) => {
    await DeployTasksCollection.updateAsync(deployTaskId, {
      $set: {
        status,
      },
    })
  },
}
