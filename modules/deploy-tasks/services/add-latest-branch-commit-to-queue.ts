import { Meteor } from 'meteor/meteor'
import { deployTasksServices } from '.'
import { AddTaskToQueueInput } from './add-task-to-queue'
import { githubApi } from '/server/apis/github/api'

export type AddLatestBranchCommitToQueueInput = Omit<
  AddTaskToQueueInput,
  'commitSha' | 'commitDescription'
>

export const addLatestBranchCommitToQueue = async ({
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
}
