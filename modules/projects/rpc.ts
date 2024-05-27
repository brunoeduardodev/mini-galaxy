import * as grubba from 'grubba-rpc'

import { GetProjectByNameSchema } from './services/get-project-by-name'
import { projectsServices } from './services'
import { ListOwnProjectsSchema } from './services/list-own-projects'
import { CreateProjectSchema } from './services/create-project'
import { UpdateProjectSchema } from './services/update-project'
import { DeleteProjectSchema } from './services/delete-project'

export const projectsRpc = grubba
  .createModule('projects')
  .addMethod('getProjectByName', GetProjectByNameSchema, projectsServices.getProjectByName)
  .addMethod('listOwnProjects', ListOwnProjectsSchema, projectsServices.listOwnProjects)
  .addMethod('createProject', CreateProjectSchema, projectsServices.createProject)
  .addMethod('updateProject', UpdateProjectSchema, projectsServices.updateProject)
  .addMethod('deleteProject', DeleteProjectSchema, projectsServices.deleteProject)
  .buildSubmodule()
