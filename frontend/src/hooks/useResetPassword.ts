import { useToast } from '@/components/ui/use-toast'
import { sendResetPassword } from '@/services/User'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function useResetPassword () {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutateAsync: mutateResetPassword, isPending: isPendingResetPassword } = useMutation({
    mutationFn: sendResetPassword,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Contraseña cambiada correctamente.'
      })
      navigate('/login')
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  return ({ mutateResetPassword, isPendingResetPassword })
}
