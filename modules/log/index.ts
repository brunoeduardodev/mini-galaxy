import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { LogCollection } from './collection'

Meteor.startup(() => {
  if (!Meteor.isServer) return

  Meteor.publish('logsForGroup', (groupId: string) => {
    check(groupId, String)
    return LogCollection.find({ logGroupId: groupId })
  })
})
