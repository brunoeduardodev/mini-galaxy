import z from 'zod'
import { ProjectsCollection } from '../collection'

export const SetMostRecentUrlSchema = z.object({
  projectId: z.string(),
  url: z.string(),
})

export type SetMostRecentUrlInput = z.infer<typeof SetMostRecentUrlSchema>

export const setMostRecentUrl = ({ projectId, url }: SetMostRecentUrlInput) => {
  return ProjectsCollection.updateAsync(projectId, {
    $set: {
      deployedUrl: url,
    },
  })
}
