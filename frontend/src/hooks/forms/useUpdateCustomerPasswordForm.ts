import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const formUpdateCustomerPasswordSchema = z.object({
  password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }),
  new_password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,80}/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  })
})

export default function useUpdateCustomerPasswordForm () {
  const formUpdateCustomerPassword = useForm<z.infer<typeof formUpdateCustomerPasswordSchema>>({
    resolver: zodResolver(formUpdateCustomerPasswordSchema),
    defaultValues: {
      password: '',
      new_password: ''
    }
  })

  const handleReset = () => {
    console.log('xd')
    formUpdateCustomerPassword.reset()
  }

  return ({ formUpdateCustomerPasswordSchema, formUpdateCustomerPassword, handleReset })
}
