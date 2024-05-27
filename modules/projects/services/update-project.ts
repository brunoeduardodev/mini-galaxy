import z from 'zod'
import { CreateProjectSchema } from './create-project'
import { Meteor } from 'meteor/meteor'
import { ProjectsCollection } from '../collection'
import { deployTasksServices } from '/modules/deploy-tasks/services'
import { githubApi } from '/server/apis/github/api'

export const UpdateProjectSchema = CreateProjectSchema.extend({ projectId: z.string() })
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>

export const updateProject = async ({ projectId, ...data }: UpdateProjectInput) => {
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
}
