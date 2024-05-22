import React from 'react'
import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { RootSuspenseAndErrorBoundary } from '../components/RootSuspenseAndErrorBoundary'

export function RootLayout() {
  return (
    <RootSuspenseAndErrorBoundary>
      <Flex direction='column' flex={1}>
        <Header />
        <Flex flex={1} direction='column' gap='md' p='md'>
          <Outlet />
        </Flex>
      </Flex>
    </RootSuspenseAndErrorBoundary>
  )
}
