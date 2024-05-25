import { Anchor, Flex, Title } from '@mantine/core'
import { ChevronLeftIcon } from 'lucide-react'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HStack } from '../../shared/components/HStack'

type Props = {
  projectName: string
  title: string
  children: ReactNode
}
export function ProjectPageLayout({ title, projectName, children }: Props) {
  return (
    <Flex flex={1} direction='column' gap='md' maw='75rem' mx='auto' w='100%' pt='lg'>
      <Anchor component={Link} to={`/dashboard/projects/${projectName}`} c='white'>
        <Flex direction='row' align='center' gap='sm'>
          <ChevronLeftIcon size={20} />
          <Title order={3}>{projectName}</Title>
        </Flex>
      </Anchor>

      <HStack justify='space-between' align='center' gap='sm'>
        <Title order={4} c='white'>
          {title}
        </Title>
      </HStack>

      <Flex flex={1} direction='column' gap='md'>
        {children}
      </Flex>
    </Flex>
  )
}
