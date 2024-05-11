import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { usePendingTransactions } from './useTransactions'
import { deleteUser } from '@/services/User'

export function useMutateDeleteUsers () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { refetch } = usePendingTransactions()
  const { mutateAsync: mutateDeleteUser, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        variant: 'success',
        title: 'Transacción Eliminada Correctamente.'
      })
      void refetch()
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

  return ({ mutateDeleteUser, isPending })
}
