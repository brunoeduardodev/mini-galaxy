import z from 'zod'

export const LogSchema = z.object({
  _id: z.string(),
  logGroupId: z.string(),
  content: z.string(),
  createdAt: z.date(),
  type: z.enum(['error', 'log']),
})

export type Log = z.infer<typeof LogSchema>
