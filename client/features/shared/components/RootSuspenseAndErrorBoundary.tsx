import React, { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Flex, Loader } from '@mantine/core'
import { RootErrorFallback } from './RootErrorFallback'
import { Header } from './Header'

type Props = {
  children: ReactNode
}

export function RootSuspenseAndErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <Suspense
        fallback={
          <Flex direction='column' flex={1}>
            <Header />
            <Flex flex={1} justify='center' align='center' gap='md'>
              <Loader size='md' p='4' />
            </Flex>
          </Flex>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
