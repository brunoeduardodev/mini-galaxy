import { Loader, TextInput } from '@mantine/core'
import React from 'react'

type Props = {
  label: string
  placeholder: string
}

export function LoadingInput({ label, placeholder }: Props) {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      leftSection={<Loader size={16} color='dark.0' />}
      disabled
    />
  )
}
