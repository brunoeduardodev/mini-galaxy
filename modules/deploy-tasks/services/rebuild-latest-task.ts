import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { DeployTasksCollection } from '../collection'
import { deployTasksServices } from '.'

export const RebuildLatestTaskSchema = z.object({
  projectId: z.string(),
})

export type RebuildLatestTaskInput = z.infer<typeof RebuildLatestTaskSchema>

export const rebuildLatestTask = async ({ projectId }: RebuildLatestTaskInput) => {
  const userId = Meteor.userId()
  if (!userId) {
    throw new Meteor.Error('User not authenticated')
  }

  const latestTask = await DeployTasksCollection.findOneAsync(
    { userId, projectId },
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
