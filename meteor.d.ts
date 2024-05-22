/* eslint-disable no-unused-vars */
declare module 'meteor/react-meteor-data' {
  export const useTracker: <T>(callback: () => T, deps?: any[]) => T
  export const useSubscribe: (name: string, ...args: any[]) => () => boolean
  export const useFind: <T extends object>(fetcher: () => any) => T[]
}

declare module 'meteor/meteor' {
  namespace Meteor {
    export function linkWithGithub(
      options: Meteor.LoginWithExternalServiceOptions,
      callback?: (error?: Meteor.Error | Meteor.TypedError) => void,
    ): void
  }
}
