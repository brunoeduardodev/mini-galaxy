import { Mongo } from 'meteor/mongo'
import { LogGroup } from './schemas'

export const LogGroupCollection = new Mongo.Collection<LogGroup>('log-groups')
