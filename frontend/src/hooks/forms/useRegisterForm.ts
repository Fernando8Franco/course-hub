import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formRegisterSchema = z.object({
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
  birthday: z.date({
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
  }),
  password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,80}/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  })
})

export default function useRegisterForm () {
  const formRegister = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      name: '',
      father_last_name: '',
      mother_last_name: '',
      phone_number: '',
      email: '',
      password: ''
    }
  })

  return ({ formRegisterSchema, formRegister })
}
