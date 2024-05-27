import { DeployTasksCollection } from '../collection'

export type AddTaskToQueueInput = {
  repository: {
    name: string
    owner: string
    branch: string
    cloneUrl: string
    fullname: string
  }
  build: {
    script?: string
    outDir?: string
  }
  projectId: string
  userId: string
  commitSha: string
  commitDescription: string
}

export const addTaskToQueue = async ({
  repository,
  build,
  projectId,
  userId,
  commitSha,
  commitDescription,
}: AddTaskToQueueInput) => {
  const deployTaskId = await DeployTasksCollection.insertAsync({
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'pending',
    userId,
    commitSha,
    commitDescription,
    build: {
      script: build.script,
      outDir: build.outDir,
    },
    repository: {
      name: repository.name,
      branch: repository.branch,
      fullname: repository.fullname,
      cloneUrl: repository.cloneUrl,
      owner: repository.owner,
    },
  })

  return {
    _id: deployTaskId,
  }
}
