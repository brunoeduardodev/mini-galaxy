import React, { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { ActionIcon, Flex, Group, Loader, Stack, Text, Tooltip } from '@mantine/core'
import { CopyIcon } from 'lucide-react'
import { useSubscribe, useTracker } from 'meteor/react-meteor-data'
import { LogCollection } from '/modules/log/collection'
import { notifications } from '@mantine/notifications'

type Props = {
  logGroupId: string
}
export function LogsList({ logGroupId }: Props) {
  const isLoading = useSubscribe('logsForGroup', logGroupId)

  const scrollDivRef = useRef<HTMLDivElement>(null)

  const logs = useTracker(() => {
    return LogCollection.find({ logGroupId }).fetch()
  })

  useEffect(() => {
    if (!scrollDivRef.current) return

    scrollDivRef.current.lastElementChild?.scrollIntoView()
  }, [logs])

  if (isLoading()) {
    return (
      <Flex flex={1} justify='center' align='center' mih={200}>
        <Loader size='md' />
      </Flex>
    )
  }

  return (
    <Stack flex={1} style={{ overflow: 'auto' }} mah={300} ref={scrollDivRef}>
      {logs.map((log) => (
        <Group
          key={log._id}
          w='100%'
          p='xxs'
          pos='relative'
          gap='xs'
          align='center'
          wrap='nowrap'
          classNames={{
            root: 'hover:bg-white/5 group min-h-8',
          }}
        >
          <Tooltip label={format(log.createdAt, 'MMM dd, yyyy h:mm:ss a')} fz='xs'>
            <Text
              size='xs'
              fw={600}
              c={log.type === 'error' ? 'red' : 'white'}
              className='tabular-nums text-nowrap'
            >
              {log.createdAt.toISOString()}
            </Text>
          </Tooltip>

          <Text
            size='sm'
            fw={400}
            c={log.type === 'error' ? 'red' : 'white'}
            className='text-nowrap'
          >
            {log.content}
          </Text>

          <button
            className='hidden absolute right-4 top-1/2 -translate-y-1/2 group-hover:flex'
            type='button'
            onClick={() => {
              navigator.clipboard.writeText(log.content)
              notifications.show({
                title: 'Copied to clipboard',
                message: 'The log has been copied to your clipboard',
              })
            }}
          >
            <ActionIcon variant='transparent' c='gray' size={16} component='div'>
              <CopyIcon size={16} />
            </ActionIcon>
          </button>
        </Group>
      ))}
    </Stack>
  )
}
