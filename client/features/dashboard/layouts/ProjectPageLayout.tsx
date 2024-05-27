import { Anchor, Group, Stack, Title } from '@mantine/core'
import { ChevronLeftIcon } from 'lucide-react'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  projectName: string
  title: string
  children: ReactNode
}
export function ProjectPageLayout({ title, projectName, children }: Props) {
  return (
    <Stack flex={1} gap='md' maw='75rem' mx='auto' w='100%' pt='lg'>
      <Anchor component={Link} to={`/dashboard/projects/${projectName}`} c='white'>
        <Group align='center' gap='sm'>
          <ChevronLeftIcon size={20} />
          <Title order={3}>{projectName}</Title>
        </Group>
      </Anchor>

      <Group justify='space-between' align='center' gap='sm'>
        <Title order={4} c='white'>
          {title}
        </Title>
      </Group>

      <Stack flex={1} gap='md'>
        {children}
      </Stack>
    </Stack>
  )
}
