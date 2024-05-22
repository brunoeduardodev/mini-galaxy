import { ProjectsCollection } from './collection'

export const projects = {
  setMostRecentUrl: (projectId: string, url: string) => {
    ProjectsCollection.updateAsync(projectId, {
      $set: {
        deployedUrl: url,
      },
    })
  },
}
