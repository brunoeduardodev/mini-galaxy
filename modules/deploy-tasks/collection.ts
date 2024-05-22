import { Mongo } from 'meteor/mongo'
import { DeployTask } from './schema'

export const DeployTasksCollection = new Mongo.Collection<DeployTask>('deploy-tasks')
