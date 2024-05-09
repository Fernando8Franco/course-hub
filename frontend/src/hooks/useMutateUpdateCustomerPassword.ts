import { useToast } from '@/components/ui/use-toast'
import { updatePassword } from '@/services/User'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function useMutateUpdateCustomerPassword () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: mutateUpdateCustomerPassword, isPending, isSuccess } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        variant: 'success',
        title: 'La contraseña fue actualizada correctamente.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJSWSTN')
        navigate('/login')
      }
    }
  })

  return ({ mutateUpdateCustomerPassword, isPending, isSuccess })
}
