import { Mongo } from 'meteor/mongo'
import { Log } from './schema'

export const LogCollection = new Mongo.Collection<Log>('logs')
