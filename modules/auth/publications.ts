import { Meteor } from 'meteor/meteor'

Meteor.publish('userData', function () {
  if (!this.userId) {
    this.ready()
    return
  }

  return Meteor.users.find(
    { _id: this.userId },
    {
      fields: {
        createdAt: 1,
        'services.github.id': 1,
      },
    },
  )
})
