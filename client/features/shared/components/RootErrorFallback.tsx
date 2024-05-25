import React from 'react'
import { Button, Flex, Text, Title } from '@mantine/core'
import { FallbackProps } from 'react-error-boundary'
import { Meteor } from 'meteor/meteor'
import { Header } from './Header'
import { Link } from 'react-router-dom'
import { AppRoutes } from '/client/Router'

export function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Flex direction='column' flex={1}>
      <Header />
      <Flex flex={1} justify='center' align='center'>
        <Flex direction='column' gap='md' p='md' align='center'>
          <Title order={2}>
            {error instanceof Meteor.Error ? error.error : 'Ooops, something went wrong'}
          </Title>
          <Text>{error instanceof Meteor.Error ? error.reason : String(error)}</Text>
          <Link to={AppRoutes.Home}>
            <Button onClick={resetErrorBoundary}>Go to home</Button>
          </Link>
          <Button variant='outline' maw='12.5rem' onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
