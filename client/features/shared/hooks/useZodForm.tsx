import { UseFormInput, useForm, zodResolver } from '@mantine/form'
import { ZodObject, z } from 'zod'

type UseZodFormOptions<T extends ZodObject<any>> = {
  schema: T
} & Omit<UseFormInput<z.infer<T>>, 'validate'>

export const useZodForm = <T extends ZodObject<any>>({ schema, ...rest }: UseZodFormOptions<T>) => {
  return useForm({
    validate: zodResolver(schema),
    ...rest,
  })
}
