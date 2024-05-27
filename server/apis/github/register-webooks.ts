import octokit, { createNodeMiddleware } from 'octokit'
import { envs } from '/server/envs'
import { WebApp } from 'meteor/webapp'
import { handlePushWebhook } from './webhooks/push'

const githubApp = new octokit.App({
  appId: envs.githubApp.appId,
  privateKey: envs.githubApp.privateKey,
  oauth: {
    clientId: envs.packages['service-configuration'].github.clientId,
    clientSecret: envs.packages['service-configuration'].github.secret,
  },
  webhooks: {
    secret: envs.githubApp.webhookSecret,
  },
})

githubApp.webhooks.on('push', handlePushWebhook)

WebApp.handlers.use(createNodeMiddleware(githubApp, { pathPrefix: envs.githubApp.webhookPrefix }))
