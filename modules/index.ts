import * as grubba from 'grubba-rpc'
import { projects } from './projects'
import { github } from './github'

const apiModule = grubba.createModule().addSubmodule(projects).addSubmodule(github).build()

export type Api = typeof apiModule
