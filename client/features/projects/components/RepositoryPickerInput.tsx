import React from 'react'
import { Button, Flex, Text } from '@mantine/core'
import { Meteor } from 'meteor/meteor'
import { useCurrentUser } from '../../shared/hooks/useCurrentUser'
import { showErrorToast } from '/client/utils/showErrorToast'
import { RepositoryPickerSelect } from './RepositoryPickerSelect'

export function RepositoryPicker() {
  const user = useCurrentUser()
  if (!user) return null

  if (!user.services?.github?.id) {
    return (
      <Flex bg='dark.8' direction='column' p='lg' gap='lg' justify='center' align='center'>
        <Text>You need to connect to GitHub to use this feature</Text>
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
      </Flex>
    )
  }

  return (
    <Flex bg='dark.8' direction='column' p='lg' gap='lg' justify='center' align='center'>
      <RepositoryPickerSelect />
    </Flex>
  )
}
