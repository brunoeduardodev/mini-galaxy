import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { ProjectPageLayout } from '../../dashboard/layouts/ProjectPageLayout'
import { UpsertProjectForm, UpsertProjectFormValues } from '../components/UpsertProjectForm'
import { api } from '/client/api'
import { AppRoutes } from '/client/Router'
import { showErrorToast } from '/client/utils/showErrorToast'

export function EditProjectPage() {
  const { projectName } = useParams()
  const navigate = useNavigate()

  if (!projectName) {
    throw new Meteor.Error('Project not found')
  }

  const updateProjectMutation = api.projects.updateProject.useMutation()
  const deleteProjectMutation = api.projects.deleteProject.useMutation()

  const { data: project } = api.projects.getProjectByName.useQuery({ name: projectName })

  const onUpdateProject = async (values: UpsertProjectFormValues) => {
    try {
      const result = await updateProjectMutation.mutateAsync({
        projectId: project._id,
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

  const onDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync({ projectId: project._id })
      navigate(AppRoutes.Dashboard)
    } catch (error) {
      showErrorToast(error)
    }
  }
  return (
    <ProjectPageLayout title='Edit Project' projectName={projectName}>
      <UpsertProjectForm project={project} onSubmit={onUpdateProject} onDelete={onDeleteProject} />
    </ProjectPageLayout>
  )
}
