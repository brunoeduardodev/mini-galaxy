import { Meteor } from 'meteor/meteor'
import { DeployTasksCollection } from './collection'
import { githubApi } from '/server/github/api'

type AddLatestBranchCommitToQueueInput = {
  repository: {
    name: string
    owner: string
    branch: string
    cloneUrl: string
    fullname: string
  }
  build: {
    script?: string
    outDir?: string
  }
  projectId: string
  userId: string
}

type AddTaskToQueueInput = AddLatestBranchCommitToQueueInput & {
  commitSha: string
  commitDescription: string
}

export const deployTasksServices = {
  addLatestBranchCommitToQueue: async ({
    repository,
    build,
    projectId,
    userId,
  }: AddLatestBranchCommitToQueueInput) => {
    const user = await Meteor.users.findOneAsync(userId)
    if (!user) {
      throw new Meteor.Error('User not found')
    }

    const accessToken = user.services?.github?.accessToken
    if (!accessToken) {
      throw new Meteor.Error(`User doesn't have a GitHub access token`)
    }

    const branches = await githubApi.getRepositoryBranches({
      accessToken,
      owner: repository.owner,
      repo: repository.name,
    })

    const targetBranch = branches.find((branch) => branch.name === repository.branch)
    if (!targetBranch) {
      throw new Meteor.Error('Branch not found')
    }

    const commit = await githubApi.getCommitDetails({
      accessToken,
      owner: repository.owner,
      repo: repository.name,
      commitSha: targetBranch.commit.sha,
    })

    return deployTasksServices.addTaskToQueue({
      projectId,
      userId,
      commitSha: targetBranch.commit.sha,
      commitDescription: commit.commit.message,
      build: {
        script: build.script,
        outDir: build.outDir,
      },
      repository: {
        name: repository.name,
        branch: repository.branch,
        fullname: repository.fullname,
        cloneUrl: repository.cloneUrl,
        owner: repository.owner,
      },
    })
  },
  addTaskToQueue: async ({
    repository,
    build,
    projectId,
    userId,
    commitSha,
    commitDescription,
  }: AddTaskToQueueInput) => {
    const deployTaskId = await DeployTasksCollection.insertAsync({
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
      userId,
      commitSha,
      commitDescription,
      build: {
        script: build.script,
        outDir: build.outDir,
      },
      repository: {
        name: repository.name,
        branch: repository.branch,
        fullname: repository.fullname,
        cloneUrl: repository.cloneUrl,
        owner: repository.owner,
      },
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
