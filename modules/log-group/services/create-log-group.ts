import z from 'zod'
import { LogGroupCollection } from '../collection'

export const CreateLogGroupSchema = z.object({ name: z.string() })
export type CreateLogGroupInput = z.infer<typeof CreateLogGroupSchema>

export const createLogGroup = async ({ name }: CreateLogGroupInput) => {
  const logGroupId = await LogGroupCollection.insertAsync({
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return logGroupId
}
