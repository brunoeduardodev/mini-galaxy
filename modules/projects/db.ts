import { Mongo } from 'meteor/mongo'
import { Project } from './schemas'

export const ProjectsCollection = new Mongo.Collection<Project>('projects')
