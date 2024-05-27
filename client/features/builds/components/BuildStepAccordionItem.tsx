import { Accordion, CheckIcon, Group, Loader, Text } from '@mantine/core'
import React from 'react'
import { Clock12Icon, XCircleIcon } from 'lucide-react'
import { LogsList } from './LogsList'
import { DeployTask } from '/modules/deploy-tasks/schema'

type Props = {
  step: 'clone' | 'install' | 'build' | 'deploy'
  task: DeployTask
}

const IconPerStatus = {
  pending: <Clock12Icon color='white' size={16} />,
  running: <Loader c='white' size={16} />,
  success: <CheckIcon color='green' size={16} />,
  error: <XCircleIcon color='red' size={16} />,
}

const StepText = {
  clone: 'Cloning',
  install: 'Installing',
  build: 'Building',
  deploy: 'Deploying',
}

export function BuildStepAccordionItem({ task, step }: Props) {
  const status = task.stepsStatus?.[step]

  if (!status) return null
  const Icon = IconPerStatus[status]

  const logGroupId = task.logGroups?.[step]

  return (
    <Accordion.Item value={step}>
      <Accordion.Control>
        <Group align='center' gap='xs'>
          {Icon}

          <Text size='sm' fw={400} c='white'>
            {StepText[step]}
          </Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>{logGroupId && <LogsList logGroupId={logGroupId} />}</Accordion.Panel>
    </Accordion.Item>
  )
}
