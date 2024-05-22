import React from 'react'
import { Combobox, Input, InputBase, useCombobox } from '@mantine/core'
import { FormControl } from './FormControl'

type Props = {
  label: string
  name: string
  selected?: string
  onSelect: (option: string) => void
  options: {
    label: string
    id: string
  }[]

  leftIcon?: React.ReactNode
  placeholder?: string
}
export function SelectInput({
  label,
  name,
  options,
  leftIcon,
  placeholder,
  onSelect,
  selected,
}: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const selectedOption = options.find((option) => option.id === selected)

  return (
    <FormControl label={label} name={name}>
      <Combobox
        store={combobox}
        onOptionSubmit={(option) => {
          onSelect(option)
          combobox.closeDropdown()
        }}
      >
        <Combobox.Target>
          <InputBase
            w='100%'
            id='branch'
            component='button'
            type='button'
            pointer
            leftSection={leftIcon}
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents='none'
            onClick={() => combobox.toggleDropdown()}
          >
            {selectedOption?.label || (
              <Input.Placeholder>{placeholder || 'Select an option'}</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options mah='400px' style={{ overflow: 'auto' }}>
            {options.map((option) => (
              <Combobox.Option key={option.id} value={option.id}>
                {option.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </FormControl>
  )
}
