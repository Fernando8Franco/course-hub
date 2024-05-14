import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { activateUser, deleteUser } from '@/services/User'

export function useMutateDeleteUsers () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateDeleteUser, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        variant: 'success',
        title: 'Usuario Eliminado Correctamente.'
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login', { replace: true })
      }
    }
  })

  return ({ mutateDeleteUser, isPendingDelete })
}

export function useMutateActivateUsers () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateActivateUser, isPending: isPendingActivate } = useMutation({
    mutationFn: activateUser,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      let message = ''
      if (data.message === 'User activated correctly') {
        message = 'Usuario activado correctamente.'
      } else {
        message = 'Usuario desactivado correctamente.'
      }
      toast({
        variant: 'success',
        title: message
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login', { replace: true })
      }
    }
  })

  return ({ mutateActivateUser, isPendingActivate })
}
