import { z } from 'zod'

export const PasswordLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type PasswordLogin = z.infer<typeof PasswordLoginSchema>

export const SignupUserSchema = z.object({
  name: z.string().min(3).max(20),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string(),
})

export type SignupUser = z.infer<typeof SignupUserSchema>

export const UserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  profile: z.object({
    name: z.string().min(3).max(200),
  }),
})
