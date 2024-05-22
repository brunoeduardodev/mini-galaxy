import React from 'react'
import { api } from '/client/api'
import { GitBranchIcon } from 'lucide-react'
import { Repository } from '../types/repository'
import { SelectInput } from '../../shared/components/SelectInput'

type Props = {
  repository: Repository
  value?: string
  onChange: (branch: string) => void
}

export function BranchesSelect({ repository, value, onChange }: Props) {
  const { data: repositoryInfo } = api.github.getRepositoryAndBranches.useQuery({
    name: repository.name,
  })
  const { branches } = repositoryInfo

  const branchOptions = branches.map((branch) => ({
    id: branch.name,
    label: branch.name,
  }))

  return (
    <SelectInput
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
