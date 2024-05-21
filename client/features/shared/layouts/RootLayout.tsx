import React from 'react'
import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export function RootLayout() {
  return (
    <Flex direction='column' flex={1}>
      <Header />
      <Flex flex={1} direction='column' gap='md' p='md'>
        <Outlet />
      </Flex>
    </Flex>
  )
}
