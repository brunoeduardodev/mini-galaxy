import { Link, useParams } from 'react-router-dom'
import React from 'react'
import { Flex, Text, Title } from '@mantine/core'
import { ExternalLinkIcon, GitBranchIcon, GithubIcon } from 'lucide-react'
import { Meteor } from 'meteor/meteor'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { api } from '/client/api'
import { RecentBuildsList } from '../components/RecentBuildsList'

export function ProjectDetailsPage() {
  const { projectName } = useParams()
  if (!projectName) {
    throw new Meteor.Error('Project not found')
  }
  const project = api.projects.getProjectByName.useQuery({ name: projectName as string })
  const repository = api.github.getRepositoryAndBranches.useQuery({
    name: project.data.repositoryName!,
  })

  return (
    <DashboardLayout title={`${projectName} details`}>
      <Flex direction='column' gap='xl'>
        <Flex direction='row' align='center' gap='md'>
          <Flex gap='sm' align='center'>
            <GithubIcon size={20} />
            <Link to={repository.data.repository.html_url}>
              <Text size='lg' fw={400} c='white'>
                {repository.data.repository.name}
              </Text>
            </Link>
          </Flex>

          <Flex gap='sm' align='center'>
            <GitBranchIcon size={20} color='white' />
            <Text size='lg' fw={400} c='white'>
              {project.data.branchName}
            </Text>
          </Flex>

          {project.data.deployedUrl && (
            <a href={project.data.deployedUrl} target='_blank' rel='noreferrer'>
              <Flex gap='sm' align='center'>
                <ExternalLinkIcon size={20} color='white' />
                <Text size='lg' fw={400} c='white'>
                  Deploy
                </Text>
              </Flex>
            </a>
          )}
        </Flex>

        <Flex direction='column' gap='md'>
          <Title order={3}>Recent Builds</Title>
          <RecentBuildsList projectName={projectName} projectId={project.data._id} />
        </Flex>
      </Flex>
    </DashboardLayout>
  )
}
