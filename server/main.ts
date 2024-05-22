import { Meteor } from 'meteor/meteor'
import '/modules'
import '/modules/auth'
import '/modules/deploy-tasks'
import '/modules/projects'

Meteor.startup(async () => {
  console.log('Starting server')
})
