import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function useLoginForm () {
  const formLoginSchema = z.object({
    email: z.string().email({
      message: 'Email no válido.'
    }).max(60, {
      message: 'Email muy largo.'
    }),
    password: z.string().min(5, {
      message: 'Contraseña muy corta.'
    }).max(80, {
      message: 'Contraseña muy larga.'
    })
  })

  const formLogin = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return ({ formLoginSchema, formLogin })
}
