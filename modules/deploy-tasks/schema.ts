import z from 'zod'

const statusSchema = z.enum(['pending', 'running', 'success', 'error'])
export type Step = 'clone' | 'install' | 'build' | 'deploy'
export const StepOrders = ['clone', 'install', 'build', 'deploy'] as const

export const DeployTaskSchema = z.object({
  _id: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: statusSchema,

  commitSha: z.string(),
  commitDescription: z.string().optional(),
  error: z.string().optional(),

  userId: z.string(),
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

  logGroups: z
    .object({
      clone: z.string().optional(),
      install: z.string().optional(),
      build: z.string().optional(),
      deploy: z.string().optional(),
    })
    .optional(),

  stepsStatus: z
    .object({
      clone: statusSchema.optional(),
      install: statusSchema.optional(),
      build: statusSchema.optional(),
      deploy: statusSchema.optional(),
    })
    .optional(),

  deployUrl: z.string().optional(),
  bucketName: z.string().optional(),
})

export type DeployTask = z.infer<typeof DeployTaskSchema>
