import { useToast } from '@/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postTransaction } from '@/services/Transactions'
import { useNavigate } from 'react-router-dom'
import useCartStore from '@/store/cartStore'
import { useUser } from './useUser'

export const useMutateTransaction = () => {
  const { toast } = useToast()
  const { user } = useUser()
  const navigate = useNavigate()
  const { reset: resetCart } = useCartStore()
  const queryClient = useQueryClient()

  const {
    mutateAsync: mutateTransaction,
    isPending: isPendingTransaction
  } = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['user'] })
      toast({
        variant: 'success',
        title: 'Compra realizada correctamente.'
      })
      resetCart()
      navigate('/user/payment')
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
    }
  })

  const handleBuyClick = (id: number) => {
    if (user === undefined) {
      toast({
        title: 'Por favor inicie sesión para realizar su compra.'
      })
      navigate('/login')
    } else {
      try {
        void mutateTransaction({ course_id: id })
      } catch (e) {
        console.log(e)
      }
    }
  }

  return ({ mutateTransaction, isPendingTransaction, resetCart, handleBuyClick })
}
