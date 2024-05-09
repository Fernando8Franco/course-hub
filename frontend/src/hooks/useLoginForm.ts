import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formLoginSchema = z.object({
  email: z.string().email({
    message: 'Email no válido.'
  }).max(60, {
    message: 'Email muy largo.'
  }),
  password: z.string().min(1, {
    message: 'Contraseña no valida.'
  }).max(80, {
    message: 'Contraseña muy larga.'
  })
})

export default function useLoginForm () {
  const formLogin = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return ({ formLoginSchema, formLogin })
}
