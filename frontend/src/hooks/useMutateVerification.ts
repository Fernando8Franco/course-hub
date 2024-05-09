import { useToast } from '@/components/ui/use-toast'
import { resendVerificationCode, verification } from '@/services/User'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function useMutateVerification () {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { mutateAsync: mutateVerification, isPending: isPendingVerification } = useMutation({
    mutationFn: verification,
    onSuccess: () => {
      toast({
        title: 'El usuario fue validado correctamente.'
      })
      navigate('/login')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'Codigo no válido.'
      })
    }
  })

  const { mutateAsync: mutateSendVerification, isPending: isPendingSendVerification } = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: () => {
      toast({
        title: 'El email fue reenviado.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  return ({ mutateVerification, isPendingVerification, mutateSendVerification, isPendingSendVerification })
}
