import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout'
import { api } from '/client/api'
import { showErrorToast } from '/client/utils/showErrorToast'
import { AppRoutes } from '/client/Router'
import { UpsertProjectForm, UpsertProjectFormValues } from '../components/UpsertProjectForm'

export function CreateProjectPage() {
  const navigate = useNavigate()

  const createProjectMutation = api.projects.createProject.useMutation()

  const onCreateProject = async (values: UpsertProjectFormValues) => {
    try {
      const result = await createProjectMutation.mutateAsync({
        name: values.name,
        build: {
          script: values.buildScript,
          outDir: values.outDir,
        },
        repository: {
          name: values.repository.name,
          fullname: values.repository.full_name,
          branch: values.branch,
          cloneUrl: values.repository.clone_url,
          owner: values.repository.owner?.login || '',
        },
      })

      navigate(AppRoutes.ProjectDetails(result.name))
    } catch (error) {
      showErrorToast(error)
    }
  }

  return (
    <DashboardLayout title='Create Project'>
      <UpsertProjectForm onSubmit={onCreateProject} />
    </DashboardLayout>
  )
}
