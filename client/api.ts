import * as grubba from 'grubba-rpc'
import type { Api } from '/modules'

export const api = grubba.createClient<Api>()
