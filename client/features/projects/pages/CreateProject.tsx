import React from 'react'
import { Flex, Text, TextInput } from '@mantine/core'
import { Form } from 'react-router-dom'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { RepositoryPicker } from '../components/RepositoryPickerInput'

export function CreateProjectPage() {
  return (
    <DashboardLayout title='Create Project'>
      <Form>
        <Flex direction='column' gap='sm'>
          <TextInput label='Project Name' placeholder='My Awesome Project' />
          <Flex direction='column' gap='sm'>
            <Text component='label'>Github Repository</Text>
            <RepositoryPicker />
          </Flex>
        </Flex>
      </Form>
    </DashboardLayout>
  )
}
