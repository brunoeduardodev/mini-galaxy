import { Meteor } from 'meteor/meteor'
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'

export const useCurrentUser = () => {
  useSubscribe('userData')
  const user = useTracker(() => {
    return Meteor.user()
  })

  return user
}
