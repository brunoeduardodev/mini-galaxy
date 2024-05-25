import { Meteor } from 'meteor/meteor'
import z from 'zod'

export const envsSchema = z.object({
  packages: z.object({
    'service-configuration': z.object({
      github: z.object({
        clientId: z.string().min(1, 'Client ID is required'),
        secret: z.string().min(1, 'Secret is required'),
      }),
    }),
  }),
  aws: z.object({
    accessKeyId: z.string().min(1, 'Access Key ID is required'),
    secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  }),
  githubApp: z.object({
    appId: z.string().min(1, 'App ID is required'),
    privateKey: z.string().min(1, 'Private Key is required'),
    webhookSecret: z.string().min(1, 'Webhook Secret is required'),
    webhookPrefix: z.string().min(1, 'Webhook Prefix is required'),
  }),
  http: z.object({
    domain: z.string().min(1, 'Domain is required'),
  }),
})

export const getSafeEnvs = () => {
  const parseResult = envsSchema.safeParse(Meteor.settings)
  if (!parseResult.success) {
    console.error('⚠️ Missing or invalid environment variables:')
    parseResult.error.issues.forEach((issue) => {
      console.error(`Meteor.settings.${issue.path.join('.')}: ${issue.message}`)
    })
    process.exit(1)
  }

  return parseResult.data
}

export const envs = getSafeEnvs()
