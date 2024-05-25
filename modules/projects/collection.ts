import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { Project } from './schemas'

export const ProjectsCollection = new Mongo.Collection<Project>('projects')

Meteor.startup(() => {
  if (!Meteor.isServer) return

  // There should be only one project per repository
  ProjectsCollection.createIndexAsync(
    {
      'repository.fullname': 1,
    },
    { unique: true, name: 'projects_repository_name_index' },
  )

  // There should be only one project per name
  ProjectsCollection.createIndexAsync(
    {
      name: 1,
    },
    { unique: true, name: 'projects_name_index' },
  )

  // Improves performance to list projects for a user
  ProjectsCollection.createIndexAsync(
    {
      userId: 1,
    },
    { name: 'projects_user_id_index' },
  )
})
