import z from 'zod'

export const LogGroupSchema = z.object({
  _id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type LogGroup = z.infer<typeof LogGroupSchema>
