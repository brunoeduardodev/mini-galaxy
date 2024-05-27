import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { UserSchema } from './schemas'

const getEmailFromUser = (user: Meteor.User) => {
  if (user.services?.github?.email) return user.services.github.email

  return user.emails?.[0].address
}

const getUsernameFromUser = (user: Meteor.User) => {
  if (user.username) return user.username
  if (user.services?.github?.username) return user.services.github.username
}

const formatCreatedUserDocument = (user: Meteor.User, profile: unknown) => {
  return {
    ...user,
    username: getUsernameFromUser(user),
    email: getEmailFromUser(user),
    profile,
  }
}

Accounts.onCreateUser((options, user) => {
  const userDocument = formatCreatedUserDocument(user, options.profile)

  const parseResult = UserSchema.safeParse(userDocument)
  if (!parseResult.success) {
    throw new Meteor.Error('Invalid user', parseResult.error.message)
  }

  return userDocument
})
