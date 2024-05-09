import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formResetPasswordShema = z.object({
  token: z.string(),
  password: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,80}/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  }),
  confirmPassword: z.string().min(5, {
    message: 'Contraseña muy corta.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  }).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,80}/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  })
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contraseñas no coinciden.'
})

export default function useResetPasswordForm (token: string | undefined) {
  const formResetPassword = useForm<z.infer<typeof formResetPasswordShema>>({
    resolver: zodResolver(formResetPasswordShema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: ''
    }
  })

  return ({ formResetPasswordShema, formResetPassword })
}
