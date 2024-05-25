import React, { forwardRef } from 'react'
import { Flex, FlexProps } from '@mantine/core'

export const VStack = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  return <Flex direction='column' {...props} ref={ref} />
})

VStack.displayName = 'VStack'
