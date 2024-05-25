import * as grubba from 'grubba-rpc'
import { z } from 'zod'
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ProjectsCollection } from './collection'
import { CreateProjectSchema, ProjectSchema } from './schemas'
import { deployTasksServices } from '../deploy-tasks/services'
import { githubApi } from '/server/github/api'

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

    const user = await Meteor.userAsync()
    if (!user) {
      throw new Meteor.Error('User not found')
    }

    const accessToken = user.services?.github?.accessToken
    if (!accessToken) {
      throw new Meteor.Error('User doesnt have a GitHub access token')
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

    try {
      await githubApi.addPushWebhook({
        accessToken,
        owner: project.repository.owner,
        repo: project.repository.name,
      })
    } catch (error) {
      console.error(error)
    }

    deployTasksServices.addLatestBranchCommitToQueue({
      userId,
      build: {
        script: project.build.script,
        outDir: project.build.outDir,
      },
      repository: {
        name: project.repository.name,
        owner: project.repository.owner,
        branch: project.repository.branch,
        cloneUrl: project.repository.cloneUrl,
        fullname: project.repository.fullname,
      },
      projectId,
    })

    return {
      _id: projectId,
      name: project.name,
    }
  })
  .addMethod(
    'updateProject',
    CreateProjectSchema.extend({ projectId: z.string() }),
    async ({ projectId, ...data }) => {
      const userId = Meteor.userId()
      if (!userId) {
        throw new Meteor.Error('User not logged in')
      }

      const currentProject = await ProjectsCollection.findOneAsync({ _id: projectId })
      if (!currentProject) {
        throw new Meteor.Error('Project not found')
      }

      await ProjectsCollection.updateAsync(projectId, {
        $set: {
          updatedAt: new Date(),
          ...data,
        },
      })

      if (currentProject.repository.fullname !== data.repository.fullname) {
        await githubApi.addPushWebhook({
          accessToken: currentProject.userId,
          owner: currentProject.repository.owner,
          repo: currentProject.repository.name,
        })
      }

      if (
        currentProject.repository.branch !== data.repository.branch ||
        currentProject.repository.cloneUrl !== data.repository.cloneUrl ||
        currentProject.build.script !== data.build.script ||
        currentProject.build.outDir !== data.build.outDir
      ) {
        deployTasksServices.addLatestBranchCommitToQueue({
          userId,
          build: {
            script: data.build.script,
            outDir: data.build.outDir,
          },
          repository: {
            name: data.repository.name,
            owner: data.repository.owner,
            branch: data.repository.branch,
            cloneUrl: data.repository.cloneUrl,
            fullname: data.repository.fullname,
          },
          projectId,
        })
      }

      return {
        _id: projectId,
        name: data.name,
      }
    },
  )
  .addMethod('deleteProject', z.object({ projectId: z.string() }), async ({ projectId }) => {
    const userId = Meteor.userId()
    if (!userId) {
      throw new Meteor.Error('User not logged in')
    }

    const project = await ProjectsCollection.findOneAsync({ _id: projectId })
    if (!project) {
      throw new Meteor.Error('Project not found')
    }

    await ProjectsCollection.removeAsync(projectId)

    // TODO: Cleanup webhooks, s3 buckets.

    return {
      _id: projectId,
      name: project.name,
    }
  })
  .buildSubmodule()

Meteor.publish('projectByName', (projectName: string) => {
  check(projectName, String)

  const userId = Meteor.userId()
  if (!userId) {
    return []
  }

  return ProjectsCollection.find({ name: projectName, userId })
})
