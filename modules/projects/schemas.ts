import { z } from 'zod'
import { slugify } from '/server/utils'

export const ProjectSchema = z.object({
  _id: z.string(),
  name: z.string().transform((name) => slugify(name)),
  cloneUrl: z.string().optional(),

  method: z.enum(['github', 'manual']),

  repositoryName: z.string().optional(),
  branchName: z.string().optional(),

  outDir: z.string().optional(),
  buildScript: z.string().optional(),

  assetId: z.string().optional(),
  deployedUrl: z.string().url().optional(),

  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Project = z.infer<typeof ProjectSchema>

export const CreateProjectSchema = ProjectSchema.pick({
  name: true,
  cloneUrl: true,
  assetId: true,
  branchName: true,
  repositoryName: true,
  method: true,
  buildScript: true,
  outDir: true,
})
