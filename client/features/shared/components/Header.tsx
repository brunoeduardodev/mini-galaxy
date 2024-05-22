import { Button, Flex, Image } from '@mantine/core'
import { Link } from 'react-router-dom'

import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { AppRoutes } from '/client/Router'

export function Header() {
  const { user } = useCurrentUser()

  const handleLogout = () => {
    Meteor.logout()
  }

  return (
    <Flex component='header' align='center' justify='space-between' py='sm' px='sm'>
      <Link to={AppRoutes.Home}>
        <Image src='/images/mini-galaxy.png' width={100} style={{ width: 160 }} />
      </Link>

      {user ? (
        <Button color='dark' onClick={handleLogout}>
          Log out
        </Button>
      ) : (
        <Link to={AppRoutes.Login}>
          <Button color='dark'>Login</Button>
        </Link>
      )}
    </Flex>
  )
}
