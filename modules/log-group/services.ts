import { LogGroupCollection } from './collection'

export const logGroupService = {
  addLogGroup: async (name: string) => {
    const logGroupId = await LogGroupCollection.insertAsync({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return logGroupId
  },
}
