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
      Cookies.set('SJSWSTN', data.message)
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        variant: 'success',
        title: 'Sesión iniciada correctamente'
      })
      navigate('/')
    },
    onError: (error) => {
      let message = 'Hubo un problema con la solicitud.'
      if (error.message === 'Wrong password or email') message = 'Correo o contraseña incorrectos.'
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: message
      })
    }
  })

  return ({ mutateLogin, isPendingLogin })
}
