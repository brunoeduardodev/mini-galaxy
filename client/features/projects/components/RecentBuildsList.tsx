import React from 'react'
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { Flex } from '@mantine/core'
import { LoadingSpinner } from '../../shared/components/LoadingSpinner'
import { DeployTasksCollection } from '/modules/deploy-tasks/collection'
import { RecentBuildItem } from './RecentBuildItem'

type Props = {
  projectId: string
  projectName: string
}
export function RecentBuildsList({ projectId, projectName }: Props) {
  const isReady = useSubscribe('deployTasksForProject', projectId)

  const deployTasks = useTracker(() => {
    return DeployTasksCollection.find({ projectId }, { sort: { createdAt: -1 } }).fetch()
  })

  if (!isReady) {
    return <LoadingSpinner />
  }

  if (!deployTasks.length) {
    return <div>No recent builds</div>
  }

  return (
    <Flex direction='column' gap='sm'>
      {deployTasks.map((task) => (
        <RecentBuildItem task={task} projectName={projectName} key={task._id} />
      ))}
    </Flex>
  )
}
