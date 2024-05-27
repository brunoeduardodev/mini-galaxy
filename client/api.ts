import * as grubba from 'grubba-rpc'
import type { Api } from '/server/rpc'

export const api = grubba.createClient<Api>()
