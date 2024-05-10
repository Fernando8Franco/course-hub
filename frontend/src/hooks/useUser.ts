import { useQuery } from '@tanstack/react-query'
import { userInfo } from '@/services/User'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export const useUser = () => {
  const navigate = useNavigate()
  const { data: user, isError, error, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userInfo,
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
        Cookies.remove('SJSWSTN')
        return
      }
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: error.message
      })
      if (error.message === 'La sesión a caducado.') Cookies.remove('SJSWSTN')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  return { user, isLoading }
}
