import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'
import { updateTransactionState } from '@/services/Transactions'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

interface Props {
  transactionId: string
}

export default function ActionsPendingTransaction ({ transactionId }: Props) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: mutateTransactionState, isPending } = useMutation({
    mutationFn: updateTransactionState,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['pending-transactions', 'transactions', 'schools', 'courses'] })
      if (data.message === '2') {
        toast({
          variant: 'success',
          title: 'Transacción Aceptada Correctamente.'
        })
      } else if (data.message === '3') {
        toast({
          variant: 'destructive',
          title: 'Transacción Cancelada Correctamente.'
        })
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') {
        Cookies.remove('SJASWDSTMN')
        navigate('/login')
      }
    }
  })

  const handleCompleted = () => {
    try {
      void mutateTransactionState({ transactionId, status: 2 })
    } catch (e) {
      console.log(e)
    }
  }

  const handleCanceled = () => {
    try {
      void mutateTransactionState({ transactionId, status: 3 })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='flex flex-row gap-4'>
      <Button variant='success' onClick={handleCompleted} disabled={isPending}>
        Aceptar
      </Button>
      <Button variant='destructive' onClick={handleCanceled} disabled={isPending}>
        Cancelar
      </Button>
    </div>
  )
}
