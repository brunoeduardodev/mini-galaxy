import { Link, useNavigate, useParams } from 'react-router-dom'
import React from 'react'
import { ActionIcon, Button, Flex, Text, Title } from '@mantine/core'
import { ExternalLinkIcon, GitBranchIcon, GithubIcon, SettingsIcon } from 'lucide-react'
import { Meteor } from 'meteor/meteor'
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { api } from '/client/api'
import { RecentBuildsList } from '../components/RecentBuildsList'
import { ProjectsCollection } from '/modules/projects/collection'
import { Project } from '/modules/projects/schemas'
import { PageLoading } from '../../shared/components/PageLoading'
import { HStack } from '../../shared/components/HStack'
import { AppRoutes } from '/client/Router'
import { showErrorToast } from '/client/utils/showErrorToast'

type ProjectDetailsPageContentProps = {
  project: Project
}

function ProjectDetailsPageContent({ project }: ProjectDetailsPageContentProps) {
  const { projectName } = useParams()

  const repository = api.github.getRepositoryAndBranches.useQuery({
    repo: project?.repository.name || '',
    owner: project?.repository.owner || '',
  })
  const navigate = useNavigate()

  const rebuildLatestTaskMutation = api.deployTasks.rebuildLatestTask.useMutation()

  const onRebuildLatestTask = async () => {
    if (!projectName) return

    try {
      const result = await rebuildLatestTaskMutation.mutateAsync({})

      navigate(AppRoutes.BuildDetails(projectName, result))
    } catch (error) {
      showErrorToast(error)
    }
  }

  return (
    <DashboardLayout
      title={`${projectName} details`}
      action={
        <Link to={AppRoutes.EditProject(projectName || '')}>
          <ActionIcon variant='transparent' c='gray' size={24}>
            <SettingsIcon size={24} />
          </ActionIcon>
        </Link>
      }
    >
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
              {project.repository.branch}
            </Text>
          </Flex>

          {project.deployedUrl && (
            <a href={project.deployedUrl} target='_blank' rel='noreferrer'>
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
          <HStack align='center' justify='space-between' gap='md'>
            <Title order={3}>Recent Builds</Title>
            <Button
              onClick={onRebuildLatestTask}
              loading={rebuildLatestTaskMutation.isPending}
              color='dark'
            >
              Rebuild
            </Button>
          </HStack>
          <RecentBuildsList projectName={project.name} projectId={project._id} />
        </Flex>
      </Flex>
    </DashboardLayout>
  )
}

export function ProjectDetailsPage() {
  const { projectName } = useParams()
  if (!projectName) {
    throw new Meteor.Error('Project not found')
  }
  const isProjectLoading = useSubscribe('projectByName', projectName)
  const [project] = useTracker(() => {
    return ProjectsCollection.find({ name: projectName }).fetch()
  })

  if (isProjectLoading()) {
    return <PageLoading />
  }

  if (!project) {
    throw new Meteor.Error('Project not found')
  }

  return <ProjectDetailsPageContent project={project} />
}
