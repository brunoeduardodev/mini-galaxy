import React from 'react'
import { Button, Flex, Text } from '@mantine/core'
import { AlertTriangleIcon } from 'lucide-react'
import { FallbackProps } from 'react-error-boundary'

export function LoggableErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Flex direction='row' align='center' gap='sm'>
      <AlertTriangleIcon color='#ffff00' />
      <Text>{error.message}</Text>

      <Button ml='auto' onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Flex>
  )
}
