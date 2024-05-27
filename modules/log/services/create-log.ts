import z from 'zod'
import { LogCollection } from '../collection'

export const CreateLogSchema = z.object({
  logGroupId: z.string(),
  content: z.string(),
  type: z.enum(['error', 'log']),
})

export type CreateLogInput = z.infer<typeof CreateLogSchema>

export const createLog = async ({ logGroupId, content, type }: CreateLogInput) => {
  const logId = await LogCollection.insertAsync({
    logGroupId,
    content,
    type,
    createdAt: new Date(),
  })

  return logId
}
