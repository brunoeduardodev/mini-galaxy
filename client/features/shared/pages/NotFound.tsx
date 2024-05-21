import { Button, Flex, Title } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { AppRoutes } from '/client/Router'

export function NotFoundPage() {
  return (
    <Flex direction='column' align='center' flex={1} gap='md'>
      <Title order={3} mt='xl'>
        Oops, we could not find this page
      </Title>
      <Link to={AppRoutes.Home}>
        <Button>Go to home</Button>
      </Link>
    </Flex>
  )
}
