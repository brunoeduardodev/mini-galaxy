import React from 'react'
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { Flex, Loader, Paper, Text } from '@mantine/core'
import { Check, GitBranch, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../../shared/components/LoadingSpinner'
import { DeployTasksCollection } from '/modules/deploy-tasks/collection'
import { AppRoutes } from '/client/Router'

type Props = {
  projectId: string
  projectName: string
}
export function RecentBuildsList({ projectId, projectName }: Props) {
  const isReady = useSubscribe('deployTasksForProject', projectId)

  const deployTasks = useTracker(() => {
    return DeployTasksCollection.find({ projectId }).fetch()
  })

  if (!isReady) {
    return <LoadingSpinner />
  }

  if (!deployTasks.length) {
    return <div>No recent builds</div>
  }
  console.log(deployTasks)

  return (
    <Flex direction='column' gap='sm'>
      {deployTasks.map((task) => (
        <Link to={AppRoutes.BuildDetails(projectName, task._id)} key={task._id}>
          <Paper p='md' shadow='md' withBorder>
            <Flex justify='space-between' align='center' gap='sm'>
              <Flex direction='column' gap='xs'>
                <Text size='sm' fw={400} c='white'>
                  Status
                </Text>

                <Text size='md' fw={400} c='white'>
                  {task.status === 'pending' ? (
                    <Flex gap='sm' align='center'>
                      <Loader size='xs' color='white' />
                      <Text size='sm'>Pending</Text>
                    </Flex>
                  ) : task.status === 'running' ? (
                    <Flex gap='sm' align='center'>
                      <Loader size='xs' color='indigo' />
                      <Text size='sm'>Running</Text>
                    </Flex>
                  ) : task.status === 'success' ? (
                    <Flex gap='sm' align='center'>
                      <Text size='xs' c='green'>
                        <Check size={16} />
                      </Text>
                      <Text size='sm'>Success</Text>
                    </Flex>
                  ) : (
                    <Flex gap='sm' align='center'>
                      <Text size='xs' c='red'>
                        <X size={16} />
                      </Text>
                      <Text size='sm'>Error</Text>
                    </Flex>
                  )}
                </Text>
              </Flex>
              <Flex direction='column' gap='xs' align='flex-end'>
                <Text size='sm' fw={400} c='white'>
                  {task.createdAt.toDateString()}
                </Text>

                <Flex direction='row' align='center' gap='xs'>
                  <GitBranch size={16} />

                  <Text size='md' fw={400} c='white'>
                    {task.branchName}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Paper>
        </Link>
      ))}
    </Flex>
  )
}
