import React from 'react'
import { Button, Flex, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { AppRoutes } from '/client/Router'

type Props = {
  type: 'login' | 'signup'
}
export function AuthCardFooter({ type }: Props) {
  return (
    <Flex direction='column' gap='md' align='center'>
      <Button type='submit' color='indigo' mt='md' fullWidth>
        {type === 'login' ? 'Login' : 'Sign Up'}
      </Button>
      <Text ta='center' size='sm'>
        {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
      </Text>
      <Link to={type === 'login' ? AppRoutes.SignUp : AppRoutes.Login} style={{ width: '100%' }}>
        <Button color='indigo' variant='outline' size='xs' fullWidth>
          {type === 'login' ? 'Sign Up' : 'Login'}
        </Button>
      </Link>
    </Flex>
  )
}
