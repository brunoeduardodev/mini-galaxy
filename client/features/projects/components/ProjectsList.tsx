import React from 'react'
import { Button, Flex, Text } from '@mantine/core'
import { api } from '../../../api'

export function ProjectsList() {
  const projects = api.projects.listOwnProjects.useQuery({})

  if (!projects.data.length) {
    return (
      <Flex direction='column' m='auto' gap='sm'>
        <Text>You don&apos;t have any projects yet</Text>
        <Button>Deploy First Project</Button>
      </Flex>
    )
  }

  return projects.data.map((project) => {
    return <div key={project._id}>{project.name}</div>
  })
}