import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import * as grubba from 'grubba-rpc'
import z from 'zod'
import { DeployTasksCollection } from './collection'
import { startDeployTaskScheduler } from './scheduler'
import { deployTasksServices } from './services'

Meteor.publish('deployTasksForProject', (projectId: string) => {
  check(projectId, String)
  return DeployTasksCollection.find({ projectId }, { sort: { createdAt: -1 } })
})

Meteor.publish('deployTask', (taskId: string) => {
  check(taskId, String)
  const userId = Meteor.userId()

  if (!userId) {
    return []
  }

  return DeployTasksCollection.find({ _id: taskId, userId })
})

export const deployTasks = grubba
  .createModule('deployTasks')
  .addMethod('rebuildLatestTask', z.object({}), async ({}) => {
    const userId = Meteor.userId()
    if (!userId) {
      throw new Meteor.Error('User not authenticated')
    }

    const latestTask = await DeployTasksCollection.findOneAsync(
      { userId },
      { sort: { createdAt: -1 } },
    )

    if (!latestTask) throw new Meteor.Error('No latest task found')

    const result = await deployTasksServices.addTaskToQueue({
      userId,
      build: latestTask.build,
      repository: latestTask.repository,
      projectId: latestTask.projectId,
      commitSha: latestTask.commitSha,
      commitDescription: latestTask.commitDescription || 'N/A',
    })

    return result._id
  })
  .buildSubmodule()

Meteor.startup(() => {
  startDeployTaskScheduler()
})
