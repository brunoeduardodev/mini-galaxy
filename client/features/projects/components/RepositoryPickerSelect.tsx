import React from 'react'
import { api } from '/client/api'

export function RepositoryPickerSelect() {
  const { data } = api.user.getUserRepositories.useQuery({})
  console.log({ data })
  return <div>RepositoryPickerSelect</div>
}
