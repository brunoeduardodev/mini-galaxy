import { Button, Flex, Input, Loader } from '@mantine/core'
import React, { Suspense } from 'react'
import { SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useField } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { ProjectsList } from '../../projects/components/ProjectsList'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { AppRoutes } from '/client/Router'

export function DashboardPage() {
  const search = useField({
    initialValue: '',
  })

  const [debouncedSearch] = useDebouncedValue(search.getValue(), 200)
  const isDebouncing = search.getValue() !== debouncedSearch

  return (
    <DashboardLayout title='Your Projects:'>
      <Flex gap='sm'>
        <Input
          {...search.getInputProps()}
          flex={1}
          placeholder='Search projects'
          leftSection={<SearchIcon size={16} />}
          rightSection={isDebouncing ? <Loader color='dark.0' size='xs' /> : null}
        />
        <Link to={AppRoutes.CreateProject}>
          <Button>Add Project</Button>
        </Link>
      </Flex>
      <Suspense fallback={<Loader m='auto' />}>
        <ProjectsList search={debouncedSearch} />
      </Suspense>
    </DashboardLayout>
  )
}
