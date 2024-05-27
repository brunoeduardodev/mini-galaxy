import React from 'react'
import { api } from '/client/api'
import { GitBranchIcon } from 'lucide-react'
import { Repository } from '../types/repository'
import { SearchableSelectInput } from '../../shared/components/SearchableSelectInput'

type Props = {
  repository: Repository
  value?: string
  onChange: (branch: string) => void
}

export function BranchesSelect({ repository, value, onChange }: Props) {
  const { data: repositoryInfo } = api.github.getRepositoryAndBranches.useQuery({
    repo: repository.name,
    owner: repository.owner?.login || '',
  })
  const { branches } = repositoryInfo

  const branchOptions = branches.map((branch) => ({
    id: branch.name,
    label: branch.name,
  }))

  return (
    <SearchableSelectInput
      label='Deploy Branch'
      name='branch'
      options={branchOptions}
      onSelect={onChange}
      leftIcon={<GitBranchIcon />}
      placeholder='Select a branch'
      selected={value}
    />
  )
}
