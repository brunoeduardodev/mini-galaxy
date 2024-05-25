import React, { forwardRef } from 'react'
import { Flex, FlexProps } from '@mantine/core'

export const HStack = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  return <Flex {...props} ref={ref} />
})

HStack.displayName = 'VStack'
