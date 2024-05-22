import { Meteor } from 'meteor/meteor'
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'

export const useCurrentUser = () => {
  const isLoading = useSubscribe('userData')
  const user = useTracker(() => {
    return Meteor.user()
  })

  return {
    user,
    isReady: !isLoading(),
  }
}
