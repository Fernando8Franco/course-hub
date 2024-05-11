import { useToast } from '@/components/ui/use-toast'
import { login } from '@/services/User'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function useMutateLogin () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.status === 'CUSTOMER') {
        Cookies.set('SJSWSTN', data.message)
        void queryClient.invalidateQueries({ queryKey: ['user'] })
        toast({
          variant: 'success',
          title: 'Sesión iniciada correctamente'
        })
        navigate('/', { replace: true })
      }
      if (data.status === 'ADMIN') {
        Cookies.set('SJASWDSTMN', data.message)
        void queryClient.invalidateQueries({ queryKey: ['user'] })
        toast({
          variant: 'success',
          title: 'Sesión iniciada correctamente'
        })
        navigate('/admin/dashboard', { replace: true })
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  return ({ mutateLogin, isPendingLogin })
}
