import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { DeployTasksCollection } from './collection'
import { startDeployTaskScheduler } from './scheduler'

Meteor.publish('deployTasksForProject', (projectId: string) => {
  check(projectId, String)
  return DeployTasksCollection.find({ projectId }, { sort: { createdAt: -1 } })
})

Meteor.startup(() => {
  startDeployTaskScheduler()
})
