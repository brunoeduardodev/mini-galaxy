import { Meteor } from 'meteor/meteor'
import { DeployTasksCollection } from '../collection'
import { deployTasksServices } from '.'

export const rebuildLatestTask = async () => {
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
}
