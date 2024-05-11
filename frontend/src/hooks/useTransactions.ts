import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { getPendingTransactions, getTransactions } from '@/services/Transactions'

export const usePendingTransactions = () => {
  const navigate = useNavigate()
  const { data: pendingTransactions, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['pending-transactions'],
    queryFn: getPendingTransactions,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (error.message === 'No token') return false
      if (error.message === 'La sesión a caducado.') return false
      if (error.message === 'Token no valido.') return false
      if (failureCount >= 3) return false
      return true
    }
  })

  useEffect(() => {
    if (isError) {
      if (error.message === 'No token') return
      if (error.message === 'Token no valido.') {
        navigate('/')
        Cookies.remove('SJASWDSTMN')
        return
      }
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') Cookies.remove('SJASWDSTMN')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  return { pendingTransactions, isLoading, isSuccess }
}

export const useTransactions = (status: string) => {
  const navigate = useNavigate()
  const { data: transactions, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['transactions', { status }],
    queryFn: async () => await getTransactions(status),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (error.message === 'No token') return false
      if (error.message === 'La sesión a caducado.') return false
      if (error.message === 'Token no valido.') return false
      if (failureCount >= 3) return false
      return true
    }
  })

  useEffect(() => {
    if (isError) {
      if (error.message === 'No token') return
      if (error.message === 'Token no valido.') {
        navigate('/')
        Cookies.remove('SJASWDSTMN')
        return
      }
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') Cookies.remove('SJASWDSTMN')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  return { transactions, isLoading, isSuccess }
}
