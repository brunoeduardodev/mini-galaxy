import React from 'react'
import type { DeployTask } from '/modules/deploy-tasks/schema'
import { Link } from 'react-router-dom'
import { Paper, Text, Anchor, Group, Stack } from '@mantine/core'
import { ExternalLinkIcon, GitBranchIcon, GitCommitIcon } from 'lucide-react'
import { RecentBuildItemStatus } from './RecentBuildItemStatus'
import { AppRoutes } from '/client/Router'

type Props = {
  task: DeployTask
  projectName: string
}

export function RecentBuildItem({ task, projectName }: Props) {
  return (
    <Paper p='md' shadow='md' withBorder>
      <Group justify='space-between' align='center' gap='sm'>
        <Stack gap='xs'>
          <Anchor component={Link} to={AppRoutes.BuildDetails(projectName, task._id)} c='white'>
            <Group align='center' gap='xs'>
              <GitCommitIcon size={16} />
              <Text size='sm' fw={600}>
                {task.commitDescription}
              </Text>
            </Group>
          </Anchor>
          <RecentBuildItemStatus status={task.status} />
        </Stack>
        <Stack gap='xs' align='flex-end'>
          <Text size='sm' fw={400} c='white'>
            {task.createdAt.toDateString()}
          </Text>

          <Group gap='md'>
            <Group align='center' gap='xs'>
              <GitBranchIcon size={16} />

              <Text size='md' fw={400} c='white'>
                {task.repository.branch}
              </Text>
            </Group>

            {task.deployUrl && (
              <Link to={task.deployUrl} target='_blank' rel='noreferrer'>
                <Group align='center' gap='xs'>
                  <ExternalLinkIcon color='white' size={16} />

                  <Text size='md' fw={400} c='white'>
                    Preview
                  </Text>
                </Group>
              </Link>
            )}
          </Group>
        </Stack>
      </Group>
    </Paper>
  )
}
