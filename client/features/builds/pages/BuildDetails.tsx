import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { DeployTasksCollection } from '/modules/deploy-tasks/collection'
import { Paper, Text, Anchor, Divider, Accordion, Flex, Loader } from '@mantine/core'
import { BoxIcon, Clock12Icon, ExternalLinkIcon, GitBranchIcon, GitCommitIcon } from 'lucide-react'
import { ProjectPageLayout } from '../../dashboard/layouts/ProjectPageLayout'
import { PageLoading } from '../../shared/components/PageLoading'
import { RecentBuildItemStatus } from '../../projects/components/RecentBuildItemStatus'
import { HStack } from '../../shared/components/HStack'
import { VStack } from '../../shared/components/VStack'
import { BuildStepAccordionItem } from '../components/BuildStepAccordionItem'

export function BuildDetailsPage() {
  const { projectName, buildId } = useParams()

  const isBuildLoading = useSubscribe('deployTask', buildId)

  const [build] = useTracker(() => {
    return DeployTasksCollection.find({ _id: buildId }).fetch()
  })

  const [accordionValues, setAccordionValues] = useState<string[]>([])

  const activeLogGroups = Object.entries(build?.logGroups || {})
    .filter(([, value]) => value !== undefined)
    .map(([key]) => key)
    .join(',')

  useEffect(() => {
    if (!build?.status || build.status === 'success' || build.status === 'error') return

    setAccordionValues(activeLogGroups.split(','))
  }, [activeLogGroups, build?.status])

  if (isBuildLoading()) {
    return <PageLoading />
  }

  if (!build) {
    throw new Meteor.Error('Build not found', `We couldn't find a build with the id ${buildId}`)
  }

  return (
    <ProjectPageLayout projectName={projectName!} title='Build Details'>
      <Paper p='md' shadow='md' withBorder>
        <HStack gap='xl'>
          <VStack gap='xs'>
            <Text size='sm' fw={400} c='white'>
              Status
            </Text>

            <RecentBuildItemStatus status={build.status} />
          </VStack>

          <Divider orientation='vertical' />

          <VStack gap='xs'>
            <Text size='sm' fw={400} c='white'>
              Repository
            </Text>
            <Anchor
              c='white'
              component='a'
              href={build.repository.cloneUrl}
              target='_blank'
              rel='noreferrer'
            >
              <HStack align='center' gap='xs'>
                <BoxIcon size={16} />
                <Text size='sm' fw={400} c='white'>
                  {build.repository.fullname}
                </Text>
              </HStack>
            </Anchor>
          </VStack>

          <Divider orientation='vertical' />

          <VStack gap='xs'>
            <Text size='sm' fw={400} c='white'>
              Branch
            </Text>
            <Anchor
              c='white'
              href={`${build.repository.cloneUrl.replace('.git', '')}/tree/${build.repository.branch}`}
              target='_blank'
              rel='noreferrer'
            >
              <HStack align='center' gap='xs'>
                <GitBranchIcon size={16} />
                <Text size='sm' fw={400} c='white'>
                  {build.repository.branch}
                </Text>
              </HStack>
            </Anchor>
          </VStack>

          <Divider orientation='vertical' />

          <VStack gap='xs'>
            <Text size='sm' fw={400} c='white'>
              Commit
            </Text>
            <Anchor
              c='white'
              component='a'
              href={`${build.repository.cloneUrl.replace('.git', '')}/commit/${build.commitSha}`}
              target='_blank'
              rel='noreferrer'
            >
              <HStack align='center' gap='xs'>
                <GitCommitIcon size={16} />
                <Text size='sm' fw={400} c='white'>
                  {build.commitDescription}
                </Text>
              </HStack>
            </Anchor>
          </VStack>

          <Divider orientation='vertical' />

          <VStack gap='xs'>
            <Text size='sm' fw={400} c='white'>
              Created At
            </Text>

            <HStack align='center' gap='xs'>
              <Clock12Icon size={16} />
              <Text size='sm' fw={400} c='white'>
                {build.createdAt.toDateString()}
              </Text>
            </HStack>
          </VStack>

          <VStack gap='xs'>
            <Text size='sm' fw={400} c='white'>
              Deploy
            </Text>
            <Anchor c='white' href={build.deployUrl} target='_blank' rel='noreferrer'>
              <HStack align='center' gap='xs'>
                <ExternalLinkIcon size={16} />
                <Text
                  size='sm'
                  fw={400}
                  c='white'
                  lineClamp={1}
                  style={{ wordBreak: 'break-all' }}
                  maw={100}
                >
                  See Preview
                </Text>
              </HStack>
            </Anchor>
          </VStack>
        </HStack>
      </Paper>

      {build.status === 'pending' ? (
        <Paper shadow='md' withBorder>
          <Flex justify='center' align='center' mih={200}>
            <Loader size='sm' />
          </Flex>
        </Paper>
      ) : (
        <Paper shadow='md' withBorder>
          <Accordion multiple value={accordionValues} onChange={(e) => setAccordionValues(e)}>
            <BuildStepAccordionItem step='clone' task={build} />
            <BuildStepAccordionItem step='install' task={build} />
            <BuildStepAccordionItem step='build' task={build} />
            <BuildStepAccordionItem step='deploy' task={build} />
          </Accordion>
        </Paper>
      )}
    </ProjectPageLayout>
  )
}
