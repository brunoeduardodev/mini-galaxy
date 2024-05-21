import { notifications } from '@mantine/notifications'
import { Meteor } from 'meteor/meteor'

export const showErrorToast = (error: unknown) => {
  console.log(error)
  if (error instanceof Meteor.Error) {
    notifications.show({
      color: 'red',
      title: error.error,
      message: error.reason,
    })
    return
  }

  notifications.show({
    color: 'red',
    title: 'Error',
    message: error instanceof Error ? error.message : String(error),
  })
}
