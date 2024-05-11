import { useToast } from '@/components/ui/use-toast'
import { deleteTransaction, updateTransactionState } from '@/services/Transactions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { usePendingTransactions, useTransactions } from './useTransactions'

export function useMutatePendingTransactions () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { refetch } = useTransactions()
  const { mutateAsync: mutateTransactionState, isPending } = useMutation({
    mutationFn: updateTransactionState,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['pending-transactions'] })
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

  return ({ mutateTransactionState, isPending })
}

export function useMutateDeleteTransactions () {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { refetch } = usePendingTransactions()
  const { mutateAsync: mutateTransactionState, isPending } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['transactions'] })
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

  return ({ mutateTransactionState, isPending })
}
