import { z } from 'zod'
import { slugify } from '/server/utils'

export const ProjectSchema = z.object({
  _id: z.string(),
  name: z.string().transform((name) => slugify(name)),

  repository: z.object({
    name: z.string(),
    fullname: z.string(),
    branch: z.string(),
    cloneUrl: z.string(),
    owner: z.string(),
  }),

  build: z.object({
    script: z.string().optional(),
    outDir: z.string().optional(),
  }),

  deployedUrl: z.string().url().optional(),

  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Project = z.infer<typeof ProjectSchema>
