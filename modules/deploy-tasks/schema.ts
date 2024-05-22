import z from 'zod'

export const DeployTaskSchema = z.object({
  _id: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['pending', 'running', 'success', 'error']),
  commitSha: z.string().optional(),
  error: z.string().optional(),
  cloneUrl: z.string().optional(),
  branchName: z.string().optional(),
  repositoryName: z.string().optional(),
  outDir: z.string().optional(),
  buildStep: z.string().optional(),
  userId: z.string(),
})

export type DeployTask = z.infer<typeof DeployTaskSchema>
