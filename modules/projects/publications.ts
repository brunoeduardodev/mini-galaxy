import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import { ProjectsCollection } from './collection'

Meteor.publish('projectByName', (projectName: string) => {
  check(projectName, String)

  const userId = Meteor.userId()
  if (!userId) {
    return []
  }

  return ProjectsCollection.find({ name: projectName, userId })
})
