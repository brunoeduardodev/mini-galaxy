import { Button, Checkbox, Flex, TextInput } from '@mantine/core'
import React from 'react'
import z from 'zod'
import { Form } from '@mantine/form'
import { ConnectedToGithubOnly } from './ConnectedToGithubOnly'
import { SuspenseAndErrorBoundary } from '../../shared/components/SuspenseAndErrorBoundary'
import { RepositorySelect } from './RepositoriesSelect'
import { useZodForm } from '../../shared/hooks/useZodForm'
import { Project } from '/modules/projects/schemas'
import { BranchesSelect } from './BranchesSelect'
import { HStack } from '../../shared/components/HStack'

const upsertProjectFormSchema = z.object({
  name: z.string().min(3),
  repository: z.object({
    id: z.number(),
    full_name: z.string(),
    name: z.string().min(3),
    clone_url: z.string().url(),
    owner: z.object({
      login: z.string().nullish(),
    }),
  }),
  hasBuildScript: z.boolean(),
  buildScript: z.string().optional(),
  outDir: z.string().optional(),
  branch: z.string().min(1),
})

export type UpsertProjectFormValues = z.infer<typeof upsertProjectFormSchema>

type Props = {
  project?: Project
  onSubmit: (project: UpsertProjectFormValues) => void
  onDelete?: () => void
  isLoading?: boolean
}
export function UpsertProjectForm({ project, onSubmit, isLoading, onDelete }: Props) {
  const form = useZodForm({
    schema: upsertProjectFormSchema,
    initialValues: {
      name: project?.name || '',
      repository: {
        id: 0,
        full_name: project?.repository.fullname || '',
        name: project?.repository.name || '',
        clone_url: project?.repository.cloneUrl || '',
        owner: {
          login: project?.repository.owner || '',
        },
      },
      branch: project?.repository?.branch || '',
      hasBuildScript: !!project?.build?.script || false,
      buildScript: project?.build?.script || '',
      outDir: project?.build?.outDir || '',
    },
  })

  console.log(form.values)
  const { repository } = form.values

  return (
    <Form form={form} onSubmit={onSubmit}>
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

        <HStack gap='xl'>
          <Button type='submit' color='indigo' maw='12.5rem' loading={isLoading}>
            {project ? 'Update Project' : 'Create Project'}
          </Button>

          {onDelete && (
            <Button variant='outline' color='indigo' onClick={onDelete}>
              Delete Project
            </Button>
          )}
        </HStack>
      </Flex>
    </Form>
  )
}
