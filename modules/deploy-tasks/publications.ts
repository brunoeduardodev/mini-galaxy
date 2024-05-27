import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import { DeployTasksCollection } from './collection'

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
