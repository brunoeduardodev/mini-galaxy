import React from 'react'
import { Stack, TextInput } from '@mantine/core'
import { Form } from '@mantine/form'
import { Accounts } from 'meteor/accounts-base'
import { SignupUser, SignupUserSchema } from '/modules/auth/schemas'
import { useZodForm } from '../../shared/hooks/useZodForm'
import { showErrorToast } from '/client/utils/showErrorToast'
import { AuthCard } from '../components/AuthCard'
import { AuthCardFooter } from '../components/AuthCardFooter'

export function SignUpPage() {
  const form = useZodForm({
    schema: SignupUserSchema,
    initialValues: { email: '', password: '', name: '', username: '' },
  })

  const onSignUp = (values: SignupUser) => {
    Accounts.createUser(
      {
        email: values.email,
        password: values.password,
        username: values.username,
        profile: {
          name: values.name,
        },
      },
      (err) => {
        if (!err) return
        showErrorToast(err)
      },
    )
  }

  return (
    <AuthCard title='Sign Up'>
      <Form
        form={form}
        onSubmit={onSignUp}
        style={{ flexDirection: 'column', display: 'flex', flex: 1, width: '100%' }}
      >
        <Stack gap='md' w='100%'>
          <TextInput label='Name' {...form.getInputProps('name')} placeholder='Bruno Medeiros' />
          <TextInput
            label='Username'
            placeholder='brunoeduardodev'
            {...form.getInputProps('username')}
          />
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
          <AuthCardFooter type='signup' />
        </Stack>
      </Form>
    </AuthCard>
  )
}
