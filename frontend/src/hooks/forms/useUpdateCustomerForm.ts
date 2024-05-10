import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUser } from '../useUser'
import { useEffect } from 'react'

export const formUpdateCustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, {
    message: 'Nombre muy corto.'
  }).max(40, {
    message: 'Nombre muy largo.'
  }),
  father_last_name: z.string().min(2, {
    message: 'Appellido paterno muy corto.'
  }).max(40, {
    message: 'Appellido paterno muy largo.'
  }),
  mother_last_name: z.string().min(2, {
    message: 'Appellido materno muy corto.'
  }).max(40, {
    message: 'Appellido materno muy largo.'
  }),
  birthday: z.coerce.date({
    required_error: 'Se requiere la fecha de nacimiento.'
  }),
  phone_number: z.string().regex(/^\d+$/, {
    message: 'Solo se pueden ingresar números.'
  }).min(10, {
    message: 'Número de teléfono muy corto.'
  }).max(15, {
    message: 'Número de teléfono muy largo.'
  }),
  email: z.string().email({
    message: 'Email no valido.'
  }).max(60, {
    message: 'Email muy largo.'
  })
})

export default function useUpdateCustomerForm () {
  const { user, isLoading } = useUser()

  const formUpdateCustomer = useForm<z.infer<typeof formUpdateCustomerSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formUpdateCustomerSchema),
    defaultValues: {
      name: '',
      father_last_name: '',
      mother_last_name: '',
      phone_number: '',
      birthday: user?.birthday,
      email: ''
    }
  })

  useEffect(() => {
    if (!isLoading && (user != null)) {
      formUpdateCustomer.reset(user)
    }
  }, [user, isLoading, formUpdateCustomer])

  return ({ formUpdateCustomerSchema, formUpdateCustomer })
}
