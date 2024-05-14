import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { getSchools } from '@/services/Schools'

export const useSchools = () => {
  const navigate = useNavigate()
  const { data: schools, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['schools'],
    queryFn: getSchools,
    refetchOnWindowFocus: false,
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
        navigate('/login', { replace: true })
        Cookies.remove('SJASWDSTMN')
        return
      }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  return { schools, isLoading, isSuccess }
}
