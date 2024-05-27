import React, { ReactNode } from 'react'
import { Paper, Stack, Title } from '@mantine/core'

type Props = {
  title: string
  children: ReactNode
}

export function AuthCard({ title, children }: Props) {
  return (
    <Stack align='center' justify='center' flex={1}>
      <Paper shadow='md' p='md' bg='dark.8' miw={400}>
        <Stack flex={1} align='center' justify='center' gap='lg'>
          <Title order={4}>{title}</Title>

          {children}
        </Stack>
      </Paper>
    </Stack>
  )
}
