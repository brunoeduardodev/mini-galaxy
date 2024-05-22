import { LogCollection } from './collection'

export const logService = {
  addLog: async (logGroupId: string, content: string, type: 'error' | 'log') => {
    const logId = await LogCollection.insertAsync({
      logGroupId,
      content,
      type,
      createdAt: new Date(),
    })

    return logId
  },
}
