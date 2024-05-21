import React from 'react'
import { Button, Divider, Flex, TextInput } from '@mantine/core'
import { Form } from '@mantine/form'
import { Meteor } from 'meteor/meteor'
import { notifications } from '@mantine/notifications'
import { PasswordLogin, PasswordLoginSchema } from '/modules/auth/schemas'
import { showErrorToast } from '/client/utils/showErrorToast'
import { useZodForm } from '../../shared/hooks/useZodForm'
import { AuthCard } from '../components/AuthCard'
import { AuthCardFooter } from '../components/AuthCardFooter'

export function LoginPage() {
  const form = useZodForm({
    schema: PasswordLoginSchema,
    initialValues: { email: '', password: '' },
  })

  const onSignIn = (values: PasswordLogin) => {
    Meteor.loginWithPassword({ email: values.email }, values.password, (err) => {
      if (!err) return

      if (err instanceof Meteor.Error) {
        if (err.error === 403) {
          notifications.show({
            color: 'red',
            title: 'Invalid email or password',
            message: 'Please check your email and password',
          })
        }

        return
      }

      showErrorToast(err)
    })
  }

  const onGithubLogin = () => {
    Meteor.loginWithGithub(
      {
        requestPermissions: ['user', 'repo'],
        loginStyle: 'popup',
      },
      (err) => {
        console.log(err)
      },
    )
  }

  return (
    <AuthCard title='Login'>
      <Form
        form={form}
        onSubmit={onSignIn}
        style={{ flexDirection: 'column', display: 'flex', flex: 1, width: '100%' }}
      >
        <Flex direction='column' gap='md' w='100%'>
          <TextInput
            label='Email'
            {...form.getInputProps('email')}
            type='email'
            placeholder='brunomedeiros@gmail.com'
          />
          <TextInput
            label='Password'
            {...form.getInputProps('password')}
            type='password'
            placeholder='********'
          />

          <AuthCardFooter type='login' />
        </Flex>
      </Form>
      <Divider />
      <Flex direction='column' gap='md' w='100%'>
        <Button variant='outline' color='indigo' onClick={onGithubLogin}>
          Sign In with Github
        </Button>
      </Flex>
    </AuthCard>
  )
}
