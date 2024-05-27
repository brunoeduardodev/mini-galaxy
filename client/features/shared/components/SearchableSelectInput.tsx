import React, { useRef } from 'react'
import { Combobox, Text, TextInput, useCombobox } from '@mantine/core'
import { useField } from '@mantine/form'
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
export function SearchableSelectInput({
  label,
  name,
  options,
  leftIcon,
  placeholder,
  onSelect,
  selected,
}: Props) {
  const search = useField({
    initialValue: '',
  })

  const searchInputRef = useRef<HTMLInputElement>(null)

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const selectedOption = options.find((option) => option.id === selected)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.getValue().toLowerCase()),
  )

  return (
    <FormControl label={label} name={name}>
      <Combobox
        store={combobox}
        onOptionSubmit={(option) => {
          onSelect(option)
          search.setValue('')
          combobox.closeDropdown()
        }}
      >
        <Combobox.Target>
          <TextInput
            id='branch'
            ref={searchInputRef}
            leftSection={leftIcon}
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents='none'
            onClick={() => combobox.openDropdown()}
            placeholder={placeholder}
            onChange={(e) => {
              combobox.openDropdown()
              search.setValue(e.target.value)
              onSelect('')
            }}
            value={selectedOption ? selectedOption.label : search.getValue()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          {filteredOptions.length === 0 && (
            <Text size='md' p='md' ta='center'>
              No results found
            </Text>
          )}
          <Combobox.Options mah='400px' style={{ overflow: 'auto' }}>
            {filteredOptions.map((option) => (
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
