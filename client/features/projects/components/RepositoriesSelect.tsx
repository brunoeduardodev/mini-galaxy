import React from 'react'
import { api } from '/client/api'
import { BoxIcon } from 'lucide-react'
import { Repository } from '../types/repository'
import { SearchableSelectInput } from '../../shared/components/SearchableSelectInput'

type Props = {
  value?: Repository
  onChange: (repository: Repository) => void
}
export function RepositorySelect({ value, onChange }: Props) {
  const { data: repositories } = api.github.getUserRepositories.useQuery({})

  const repositoriesOptions = repositories.map((repository) => ({
    id: repository.name,
    label: repository.full_name,
  }))

  return (
    <SearchableSelectInput
      label='Select Repository'
      name='branch'
      options={repositoriesOptions}
      onSelect={(repositoryName) => {
        const newSelectedRepository = repositories.find(
          (repository) => repository.name === repositoryName,
        )!
        onChange(newSelectedRepository)
      }}
      leftIcon={<BoxIcon />}
      placeholder='Select a repository'
      selected={value?.name}
    />
  )
}
