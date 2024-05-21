import React, { ReactNode } from 'react'
import { Flex, Paper, Title } from '@mantine/core'

type Props = {
  title: string
  children: ReactNode
}

export function AuthCard({ title, children }: Props) {
  return (
    <Flex direction='column' align='center' justify='center' flex={1}>
      <Paper shadow='md' p='md' bg='dark.8' miw={400}>
        <Flex flex={1} direction='column' align='center' justify='center' gap='lg'>
          <Title order={4}>{title}</Title>

          {children}
        </Flex>
      </Paper>
    </Flex>
  )
}
