import React from 'react'
import type { DeployTask } from '/modules/deploy-tasks/schema'
import { Link } from 'react-router-dom'
import { Flex, Paper, Text, Anchor } from '@mantine/core'
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
      <Flex justify='space-between' align='center' gap='sm'>
        <Flex direction='column' gap='xs'>
          <Anchor component={Link} to={AppRoutes.BuildDetails(projectName, task._id)} c='white'>
            <Flex direction='row' align='center' gap='xs'>
              <GitCommitIcon size={16} />
              <Text size='sm' fw={600}>
                {task.commitDescription}
              </Text>
            </Flex>
          </Anchor>
          <RecentBuildItemStatus status={task.status} />
        </Flex>
        <Flex direction='column' gap='xs' align='flex-end'>
          <Text size='sm' fw={400} c='white'>
            {task.createdAt.toDateString()}
          </Text>

          <Flex direction='row' gap='md'>
            <Flex direction='row' align='center' gap='xs'>
              <GitBranchIcon size={16} />

              <Text size='md' fw={400} c='white'>
                {task.repository.branch}
              </Text>
            </Flex>

            {task.deployUrl && (
              <Link to={task.deployUrl} target='_blank' rel='noreferrer'>
                <Flex direction='row' align='center' gap='xs'>
                  <ExternalLinkIcon color='white' size={16} />

                  <Text size='md' fw={400} c='white'>
                    Preview
                  </Text>
                </Flex>
              </Link>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Paper>
  )
}
