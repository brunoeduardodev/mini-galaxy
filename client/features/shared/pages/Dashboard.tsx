import { Button, Flex, Input, Loader } from '@mantine/core'
import React, { Suspense } from 'react'
import { SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProjectsList } from '../../projects/components/ProjectsList'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { AppRoutes } from '/client/Router'

export function DashboardPage() {
  return (
    <DashboardLayout title='Your Projects'>
      <Flex gap='sm'>
        <Input flex={1} placeholder='Search projects' leftSection={<SearchIcon size={16} />} />
        <Link to={AppRoutes.CreateProject}>
          <Button>Add Project</Button>
        </Link>
      </Flex>
      <Suspense fallback={<Loader m='auto' />}>
        <ProjectsList />
      </Suspense>
    </DashboardLayout>
  )
}
