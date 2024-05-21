import { z } from 'zod'

export const ProjectSchema = z.object({
  _id: z.string(),
  name: z.string(),
  githubUrl: z.string().optional(),
  assetId: z.string().optional(),

  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Project = z.infer<typeof ProjectSchema>

export const CreateProjectSchema = ProjectSchema.pick({
  name: true,
  githubUrl: true,
  assetId: true,
})
