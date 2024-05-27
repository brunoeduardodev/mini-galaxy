import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { ProjectsCollection } from '../collection'

export const ListOwnProjectsSchema = z.object({ search: z.string() })
export type ListOwnProjectsInput = z.infer<typeof ListOwnProjectsSchema>

export const listOwnProjects = async ({ search }: ListOwnProjectsInput) => {
  const userId = Meteor.userId()
  if (!userId) {
    return []
  }

  const projectsCursor = ProjectsCollection.find({
    userId,
    $or: [
      { name: { $regex: new RegExp(search, 'i') } },
      { repository: { name: { $regex: new RegExp(search, 'i') } } },
    ],
  }).fetch()

  return projectsCursor
}
