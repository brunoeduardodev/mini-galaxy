import React, { ReactNode, Suspense } from 'react'
import { LoadingInput } from './LoadingInput'

type Props = {
  label: string
  placeholder: string
  children: ReactNode
}

export function InputSuspense({ placeholder, label, children }: Props) {
  return (
    <Suspense fallback={<LoadingInput label={label} placeholder={placeholder} />}>
      {children}
    </Suspense>
  )
}
