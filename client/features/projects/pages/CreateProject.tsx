import React from 'react'
import { Button, Checkbox, Flex, TextInput } from '@mantine/core'
import z from 'zod'
import { Form } from '@mantine/form'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { ConnectedToGithubOnly } from '../components/ConnectedToGithubOnly'
import { SuspenseAndErrorBoundary } from '../../shared/components/SuspenseAndErrorBoundary'
import { RepositorySelect } from '../components/RepositoriesSelect'
import { BranchesSelect } from '../components/BranchesSelect'
import { useZodForm } from '../../shared/hooks/useZodForm'
import { api } from '/client/api'
import { showErrorToast } from '/client/utils/showErrorToast'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '/client/Router'

const createProjectFormSchema = z.object({
  name: z.string().min(3),
  repository: z.object({
    id: z.number(),
    full_name: z.string(),
    name: z.string().min(3),
    clone_url: z.string().url(),
  }),
  hasBuildScript: z.boolean(),
  buildScript: z.string().optional(),
  outDir: z.string().optional(),
  branch: z.string().min(1),
})

type CreateProjectForm = z.infer<typeof createProjectFormSchema>

export function CreateProjectPage() {
  const navigate = useNavigate()
  const form = useZodForm({
    schema: createProjectFormSchema,
    initialValues: {
      name: '',
      repository: {
        id: 0,
        full_name: '',
        name: '',
        clone_url: '',
      },
      branch: '',
      hasBuildScript: false,
      buildScript: '',
      outDir: '',
    },
  })

  const createProjectMutation = api.projects.createProject.useMutation()

  const onCreateProject = async (values: CreateProjectForm) => {
    try {
      const result = await createProjectMutation.mutateAsync({
        name: values.name,
        method: 'github',
        repositoryName: values.repository.name,
        branchName: values.branch,
        cloneUrl: values.repository.clone_url,
      })

      navigate(AppRoutes.ProjectDetails(result.name))
    } catch (error) {
      showErrorToast(error)
    }
  }

  const { repository } = form.values

  return (
    <DashboardLayout title='Create Project'>
      <Form form={form} onSubmit={onCreateProject}>
        <Flex direction='column' gap='md'>
          <TextInput
            {...form.getInputProps('name')}
            label='Project Name'
            placeholder='My Awesome Project'
          />
          <ConnectedToGithubOnly>
            <SuspenseAndErrorBoundary>
              <RepositorySelect {...form.getInputProps('repository')} />
            </SuspenseAndErrorBoundary>

            {repository?.name && (
              <SuspenseAndErrorBoundary>
                <BranchesSelect {...form.getInputProps('branch')} repository={repository} />
              </SuspenseAndErrorBoundary>
            )}
          </ConnectedToGithubOnly>

          <Checkbox {...form.getInputProps('hasBuildScript')} label='Has Build Step?' />

          {form.values.hasBuildScript && (
            <>
              <TextInput
                {...form.getInputProps('buildScript')}
                label='Build Script'
                placeholder='npm run build'
              />

              <TextInput
                {...form.getInputProps('outDir')}
                label='Output Directory'
                placeholder='build'
              />
            </>
          )}

          <Button
            type='submit'
            color='indigo'
            maw='12.5rem'
            loading={createProjectMutation.isPending}
          >
            Create Project
          </Button>
        </Flex>
      </Form>
    </DashboardLayout>
  )
}
