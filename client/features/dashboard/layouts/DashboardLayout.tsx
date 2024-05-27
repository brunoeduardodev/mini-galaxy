import { Group, Stack, Title } from '@mantine/core'
import React, { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode

  action?: ReactNode
}
export function DashboardLayout({ title, children, action }: Props) {
  return (
    <Stack flex={1} gap='md' maw='75rem' mx='auto' w='100%' pt='lg'>
      <Group justify='space-between' align='center' gap='sm'>
        <Title order={3} c='white'>
          {title}
        </Title>

        {action}
      </Group>

      <Stack flex={1} gap='md'>
        {children}
      </Stack>
    </Stack>
  )
}
