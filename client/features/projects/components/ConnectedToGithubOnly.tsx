import React, { PropsWithChildren } from 'react'
import { useCurrentUser } from '../../shared/hooks/useCurrentUser'
import { Button, Stack, Text } from '@mantine/core'
import { Meteor } from 'meteor/meteor'
import { showErrorToast } from '/client/utils/showErrorToast'

export function ConnectedToGithubOnly({ children }: PropsWithChildren) {
  const { user } = useCurrentUser()

  if (!user) return null
  if (!user.services?.github?.id) {
    return (
      <Stack bg='dark.8' p='lg' gap='lg' justify='center' align='center' maw='20rem'>
        <Text ta='center'>You need to connect to GitHub to use this feature</Text>
        <Button
          onClick={() => {
            Meteor.linkWithGithub(
              { requestPermissions: ['user', 'repo'], loginStyle: 'popup' },
              (err) => {
                if (!err) return
                showErrorToast(err)
              },
            )
          }}
        >
          Connect to GitHub
        </Button>
      </Stack>
    )
  }

  return children
}
