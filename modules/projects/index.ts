import * as grubba from 'grubba-rpc'
import { z } from 'zod'
import { Meteor } from 'meteor/meteor'
import { ProjectsCollection } from './db'
import { CreateProjectSchema } from './schemas'

console.log('Projects module')

export const projects = grubba
  .createModule('projects')
  .addMethod('listOwnProjects', z.object({}), async () => {
    const userId = Meteor.userId()
    if (!userId) {
      return []
    }

    const projectsCursor = ProjectsCollection.find({
      userId,
    }).fetch()

    return projectsCursor
  })
  .addMethod('createProject', CreateProjectSchema, async function (project) {
    const { userId } = this
    if (!userId) {
      throw new Meteor.Error('User not logged in')
    }

    const projectId = ProjectsCollection.insertAsync({
      ...project,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return projectId
  })
  .buildSubmodule()
