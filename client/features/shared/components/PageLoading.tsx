import React from 'react'
import { Flex, Loader } from '@mantine/core'

export function PageLoading() {
  return (
    <Flex flex={1} justify='center' align='center' gap='md'>
      <Loader size='md' p='4' />
    </Flex>
  )
}
