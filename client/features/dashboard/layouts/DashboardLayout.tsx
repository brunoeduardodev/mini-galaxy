import { Flex, Title } from '@mantine/core'
import React, { ReactNode } from 'react'
import { HStack } from '../../shared/components/HStack'

type Props = {
  title: string
  children: ReactNode

  action?: ReactNode
}
export function DashboardLayout({ title, children, action }: Props) {
  return (
    <Flex flex={1} direction='column' gap='md' maw='75rem' mx='auto' w='100%' pt='lg'>
      <HStack justify='space-between' align='center' gap='sm'>
        <Title order={3} c='white'>
          {title}
        </Title>

        {action}
      </HStack>

      <Flex flex={1} direction='column' gap='md'>
        {children}
      </Flex>
    </Flex>
  )
}
