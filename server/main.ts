import { Meteor } from 'meteor/meteor'
import octokit, { createNodeMiddleware } from 'octokit'
import { WebApp } from 'meteor/webapp'

import { envs } from './envs'
import '/modules'
import '/modules/auth'
import '/modules/deploy-tasks'
import '/modules/projects'
import '/modules/log'
import { ProjectsCollection } from '/modules/projects/collection'
import { deployTasksServices } from '/modules/deploy-tasks/services'
import { githubApi } from './github/api'

const githubApp = new octokit.App({
  appId: envs.githubApp.appId,
  privateKey: envs.githubApp.privateKey,
  oauth: {
    clientId: envs.packages['service-configuration'].github.clientId,
    clientSecret: envs.packages['service-configuration'].github.secret,
  },
  webhooks: {
    secret: envs.githubApp.webhookSecret,
  },
})

Meteor.startup(async () => {
  const { data } = await githubApp.octokit.request('GET /app')
  console.log(`Authenticated as ${data?.name}`)
})

githubApp.webhooks.on('push', async (event) => {
  console.log(event.payload.repository.full_name)
  console.log('Received a push event!!!')

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

  const user = project.user[0]

  if (!user.services?.github?.accessToken) {
    throw new Meteor.Error('User doesnt have a GitHub access token')
  }

  console.log('commits:', event.payload.commits)
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
})

WebApp.handlers.use(createNodeMiddleware(githubApp, { pathPrefix: envs.githubApp.webhookPrefix }))
