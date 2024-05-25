import React from 'react'
import { Flex, Loader } from '@mantine/core'
import { Header } from './Header'

export function RootPageLoading() {
  return (
    <Flex direction='column' flex={1}>
      <Header />
      <Flex flex={1} justify='center' align='center' gap='md'>
        <Loader size='md' p='4' />
      </Flex>
    </Flex>
  )
}
