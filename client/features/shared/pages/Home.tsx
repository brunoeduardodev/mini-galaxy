import { Button, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      <div className='star' />
      <Stack gap='lg' maw='48rem' mx='auto' mt='xl' px='lg' py='xl'>
        <Title order={1} size='3rem' c='white' ta='center'>
          Deploy, scale, and monitor your Static apps with ease
        </Title>
        <Text size='xl' c='white' ta='center'>
          Enjoy simple deployment, seamless scaling, detailed monitoring, unified database
          solutions, global distribution, and support from experts.
        </Text>

        <Button size='lg' color='indigo' mx='auto' component={Link} to='/login'>
          Get Started
        </Button>
      </Stack>
    </div>
  )
}
