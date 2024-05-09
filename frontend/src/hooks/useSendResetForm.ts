import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formSendResetShema = z.object({
  email: z.string().email({
    message: 'Email no válido.'
  }).max(60, {
    message: 'Email muy largo.'
  })
})

export default function useSendResetForm () {
  const formSendReset = useForm<z.infer<typeof formSendResetShema>>({
    resolver: zodResolver(formSendResetShema),
    defaultValues: {
      email: ''
    }
  })

  return ({ formSendResetShema, formSendReset })
}
