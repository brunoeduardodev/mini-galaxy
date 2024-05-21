import * as grubba from 'grubba-rpc'
import { projects } from './projects'
import { user } from './user'

const apiModule = grubba.createModule().addSubmodule(projects).addSubmodule(user).build()

export type Api = typeof apiModule
