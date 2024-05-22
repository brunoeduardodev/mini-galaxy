import { Flex, Title } from '@mantine/core'
import React, { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}
export function DashboardLayout({ title, children }: Props) {
  return (
    <Flex flex={1} direction='column' gap='md' maw='75rem' mx='auto' w='100%' pt='lg'>
      <Title order={3} c='white'>
        {title}
      </Title>

      <Flex flex={1} direction='column' gap='md'>
        {children}
      </Flex>
    </Flex>
  )
}
