import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { ProjectsCollection } from '../collection'

export const DeleteProjectSchema = z.object({ projectId: z.string() })
export type DeleteProjectInput = z.infer<typeof DeleteProjectSchema>

export const deleteProject = async ({ projectId }: DeleteProjectInput) => {
  const userId = Meteor.userId()
  if (!userId) {
    throw new Meteor.Error('User not logged in')
  }

  const project = await ProjectsCollection.findOneAsync({ _id: projectId })
  if (!project) {
    throw new Meteor.Error('Project not found')
  }

  await ProjectsCollection.removeAsync(projectId)

  return {
    _id: projectId,
    name: project.name,
  }
}
