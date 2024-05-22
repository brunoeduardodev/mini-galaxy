import * as grubba from 'grubba-rpc'
import { z } from 'zod'
import { Meteor } from 'meteor/meteor'
import { ProjectsCollection } from './collection'
import { CreateProjectSchema, ProjectSchema } from './schemas'
import { deployTasks } from '../deploy-tasks/services'

export const projects = grubba
  .createModule('projects')
  .addMethod('getProjectByName', z.object({ name: z.string() }), async ({ name }) => {
    const userId = Meteor.userId()
    if (!userId) {
      throw new Meteor.Error('You need to be logged in to get a project')
    }

    const project = await ProjectsCollection.findOneAsync({
      name,
      userId,
    })

    if (!project) {
      throw new Meteor.Error(
        'Project not found',
        `We couldn't find a project with the name ${name}`,
      )
    }

    return project
  })
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
    const userId = Meteor.userId()
    if (!userId) {
      throw new Meteor.Error('User not logged in')
    }

    let projectId: string
    try {
      const newProject = ProjectSchema.omit({ _id: true }).parse({
        ...project,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      projectId = await ProjectsCollection.insertAsync(newProject)
    } catch (error) {
      throw new Meteor.Error('Could not create project')
    }

    await deployTasks.addTaskToQueue({
      projectId,
      cloneUrl: project.cloneUrl,
      branchName: project.branchName,
      repositoryName: project.repositoryName,
      userId,
    })
  })
  .buildSubmodule()
