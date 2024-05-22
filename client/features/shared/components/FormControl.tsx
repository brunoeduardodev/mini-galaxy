import { Flex, Text } from '@mantine/core'
import React, { ReactNode } from 'react'

type Props = {
  label: string
  name: string
  children: ReactNode
}

export function FormControl({ label, name, children }: Props) {
  return (
    <Flex direction='column' gap='xs' w='100%'>
      <Text component='label' fz='sm' fw={500} htmlFor={name}>
        {label}
      </Text>

      {children}
    </Flex>
  )
}
