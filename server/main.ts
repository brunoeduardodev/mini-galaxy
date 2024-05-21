import { Meteor } from 'meteor/meteor'
import '/modules'
import '/modules/auth'

Meteor.startup(async () => {
  console.log('Starting server')
})
