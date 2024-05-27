import { Meteor } from 'meteor/meteor'
import { ProjectsCollection } from '/modules/projects/collection'
import type { PushEvent } from '@octokit/webhooks-types'
import { githubApi } from '../api'
import { deployTasksServices } from '/modules/deploy-tasks/services'

type EventOptions = {
  payload: PushEvent
}

export const handlePushWebhook = async (event: EventOptions) => {
  const [project] = await ProjectsCollection.rawDatabase()
    .collection('projects')
    .aggregate([
      {
        $match: {
          'repository.fullname': event.payload.repository.full_name,
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'user',
          localField: 'userId',
          foreignField: '_id',
        },
      },
    ])
    .toArray()

  if (!project) {
    console.log('No project found')
    return
  }

  const targetBranch = event.payload.ref.split('/').slice(2).join('/')

  if (targetBranch !== project.repository.branch) {
    console.log('Ignoring push event for branch other than the project branch')
    return
  }

  const user = project.user[0]

  if (!user.services?.github?.accessToken) {
    throw new Meteor.Error('User doesnt have a GitHub access token')
  }

  const commit = await githubApi.getCommitDetails({
    accessToken: user.services?.github?.accessToken,
    owner: project.repository.owner,
    repo: project.repository.name,
    commitSha: event.payload.after,
  })

  deployTasksServices.addTaskToQueue({
    projectId: project._id,
    build: {
      script: project.build.script,
      outDir: project.build.outDir,
    },
    repository: {
      name: project.repository.name,
      owner: project.repository.owner,
      branch: project.repository.branch,
      cloneUrl: project.repository.cloneUrl,
      fullname: project.repository.fullname,
    },
    userId: user._id,
    commitSha: event.payload.after,
    commitDescription: commit.commit.message,
  })
}
