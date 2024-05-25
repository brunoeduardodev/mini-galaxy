import React, { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RootErrorFallback } from './RootErrorFallback'
import { RootPageLoading } from './RootPageLoading'

type Props = {
  children: ReactNode
}

export function RootSuspenseAndErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <Suspense fallback={<RootPageLoading />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
