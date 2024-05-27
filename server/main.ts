import { Meteor } from 'meteor/meteor'

import '/modules/auth/publications'
import '/modules/auth/hooks'
import '/modules/deploy-tasks/publications'
import '/modules/projects/publications'
import '/modules/log/publications'

import './rpc'

import { startDeployTaskScheduler } from './deploys/lib/scheduler'
import { loadDependencies } from './deploys/lib/load-dependencies'

Meteor.startup(() => {
  loadDependencies()
})

Meteor.startup(() => {
  startDeployTaskScheduler()
})
