import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { ProjectsCollection } from '../collection'

export const GetProjectByNameSchema = z.object({ name: z.string() })
export type GetProjectByNameInput = z.infer<typeof GetProjectByNameSchema>

export const getProjectByName = async ({ name }: GetProjectByNameInput) => {
  const userId = Meteor.userId()
  if (!userId) {
    throw new Meteor.Error('You need to be logged in to get a project')
  }

  const project = await ProjectsCollection.findOneAsync({
    name,
    userId,
  })

  if (!project) {
    throw new Meteor.Error('Project not found', `We couldn't find a project with the name ${name}`)
  }

  return project
}
