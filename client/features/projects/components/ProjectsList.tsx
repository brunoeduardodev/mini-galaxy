import React from 'react'
import { Anchor, Button, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { api } from '../../../api'
import { AppRoutes } from '/client/Router'

type Props = {
  search: string
}

export function ProjectsList({ search }: Props) {
  const projects = api.projects.listOwnProjects.useQuery({ search })

  if (!projects.data.length) {
    return (
      <Stack m='auto' gap='sm'>
        <Text>{search ? 'No projects found' : "You don't have any projects yet"}</Text>
        {!search && (
          <Button component={Link} to={AppRoutes.CreateProject}>
            Deploy First Project
          </Button>
        )}
      </Stack>
    )
  }

  return projects.data.map((project) => {
    return (
      <Anchor
        component={Link}
        c='white'
        key={project._id}
        to={AppRoutes.ProjectDetails(project.name)}
      >
        {project.name}
      </Anchor>
    )
  })
}
