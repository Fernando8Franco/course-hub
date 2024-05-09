import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formVerificationShema = z.object({
  verification_code: z.string().min(6, {
    message: 'Código no es válido.'
  }),
  email: z.string().email({
    message: 'Email no válido.'
  }).max(60, {
    message: 'Email muy largo.'
  })
})

interface Props {
  email: string
}

export default function useVerficationForm ({ email }: Props) {
  const formVerification = useForm<z.infer<typeof formVerificationShema>>({
    resolver: zodResolver(formVerificationShema),
    defaultValues: {
      verification_code: '',
      email
    }
  })

  return ({ formVerificationShema, formVerification })
}
