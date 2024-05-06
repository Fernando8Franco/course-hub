import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getCustomerTransactions } from '@/services/Transactions'

export const useTransactions = () => {
  const navigate = useNavigate()
  const { data: transactions, isError, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getCustomerTransactions,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  })

  useEffect(() => {
    if (isError) {
      if (error.message === 'Expired token') {
        Cookies.remove('SJSWSTN')
        toast({
          title: 'Oh no!',
          description: 'La sesión a caducado. Por favor vuelve a iniciar sesión'
        })
        navigate('/login')
        return
      }
      toast({
        variant: 'destructive',
        title: 'Oh no!, Hubo un error al cargar los datos',
        description: error.message
      })
    }
  }, [isError])

  return { transactions, isLoading }
}
