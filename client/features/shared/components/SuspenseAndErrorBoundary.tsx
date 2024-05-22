import React, { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { LoggableErrorFallback } from './LoggableErrorFallback'
import { LoadingSpinner } from './LoadingSpinner'

type Props = {
  children: ReactNode
}

export function SuspenseAndErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary FallbackComponent={LoggableErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
