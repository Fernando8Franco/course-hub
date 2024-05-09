import { useToast } from '@/components/ui/use-toast'
import { postImageTransaction } from '@/services/Transactions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function useMutateImageTransaction () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: mutateTransaction, isPending } = useMutation({
    mutationFn: postImageTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        variant: 'success',
        title: 'Recibo enviado correctamente'
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

  return ({ mutateTransaction, isPending })
}
