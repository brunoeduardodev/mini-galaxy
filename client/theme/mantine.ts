import { Group, Stack, TextInput, createTheme } from '@mantine/core'

export const mantine = createTheme({
  spacing: {
    xxs: '0.25rem',
  },
  components: {
    Stack: Stack.extend({
      defaultProps: {
        gap: '0',
      },
    }),
    Group: Group.extend({
      defaultProps: {
        gap: '0',
      },
    }),
    TextInput: TextInput.extend({
      styles: (theme) => ({
        root: {
          minWidth: '20rem',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
        },
      }),
    }),
  },
})
