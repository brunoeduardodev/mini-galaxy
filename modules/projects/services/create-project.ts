import { Meteor } from 'meteor/meteor'
import z from 'zod'
import { MongoInternals } from 'meteor/mongo'
import { ProjectSchema } from '../schemas'
import { ProjectsCollection } from '../collection'
import { githubApi } from '/server/apis/github/api'
import { deployTasksServices } from '/modules/deploy-tasks/services'

const { MongoServerError } = MongoInternals.NpmModules.mongodb.module

export const CreateProjectSchema = ProjectSchema.pick({
  name: true,
  repository: true,
  build: true,
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>

export const createProject = async (project: CreateProjectInput) => {
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
    if (error instanceof MongoServerError) {
      if (error.code === 11000 && error.message.includes('repository.fullname')) {
        throw new Meteor.Error(
          'Project repository already being used',
          "There's already a project using the selected github repository.",
        )
      }
    }
    console.error(error)
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
}
