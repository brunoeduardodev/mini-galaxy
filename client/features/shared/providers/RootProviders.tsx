import React, { PropsWithChildren } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'

import { Notifications } from '@mantine/notifications'
import { theme } from '/client/theme/mantine'

const queryClient = new QueryClient()

export function RootProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme='dark'>
        <Notifications />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  )
}
