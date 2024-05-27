import { createProject } from './create-project'
import { deleteProject } from './delete-project'
import { getProjectByName } from './get-project-by-name'
import { listOwnProjects } from './list-own-projects'
import { setMostRecentUrl } from './set-most-recent-url'
import { updateProject } from './update-project'

export const projectsServices = {
  setMostRecentUrl,
  getProjectByName,
  listOwnProjects,
  createProject,
  updateProject,
  deleteProject,
}
