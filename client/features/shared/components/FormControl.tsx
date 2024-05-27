import { Stack, Text } from '@mantine/core'
import React, { ReactNode } from 'react'

type Props = {
  label: string
  name: string
  children: ReactNode
}

export function FormControl({ label, name, children }: Props) {
  return (
    <Stack gap='xs' align='flex-start'>
      <Text component='label' fz='sm' fw={500} htmlFor={name}>
        {label}
      </Text>

      {children}
    </Stack>
  )
}
