import { Group, Loader, Text } from '@mantine/core'
import { Check, X } from 'lucide-react'
import React, { useMemo } from 'react'

type Props = {
  status: 'pending' | 'running' | 'success' | 'error'
}

const StatusTextColor = {
  pending: 'white',
  running: 'indigo',
  success: 'green',
  error: 'red',
}

const StatusIcon = {
  pending: <Loader size='xs' color={StatusTextColor.pending} />,
  running: <Loader size='xs' color={StatusTextColor.running} />,
  success: <Check size={16} color={StatusTextColor.success} />,
  error: <X size={16} color={StatusTextColor.error} />,
}

const StatusText = {
  pending: 'Pending',
  running: 'Running',
  success: 'Success',
  error: 'Error',
}

export function RecentBuildItemStatus({ status }: Props) {
  const Icon = useMemo(() => {
    return StatusIcon[status]
  }, [status])

  const text = useMemo(() => {
    return StatusText[status]
  }, [status])

  const color = useMemo(() => {
    return StatusTextColor[status]
  }, [status])

  return (
    <Group gap='sm' align='center'>
      {Icon}
      <Text size='sm' c={color}>
        {text}
      </Text>
    </Group>
  )
}
