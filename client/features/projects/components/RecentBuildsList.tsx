import React from 'react'
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { Stack } from '@mantine/core'
import { Loader } from 'lucide-react'
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
    return <Loader size='md' />
  }

  if (!deployTasks.length) {
    return <div>No recent builds</div>
  }

  return (
    <Stack gap='sm'>
      {deployTasks.map((task) => (
        <RecentBuildItem task={task} projectName={projectName} key={task._id} />
      ))}
    </Stack>
  )
}
