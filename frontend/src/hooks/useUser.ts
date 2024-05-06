import { useQuery } from '@tanstack/react-query'
import { userInfo } from '@/services/User'
import { useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export const useUser = () => {
  const navigate = useNavigate()
  const { data: user, isError, error, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userInfo,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (error.message === 'No token') return false
      if (error.message === 'Expired token') return false
      if (failureCount >= 3) return false
      return true
    }
  })

  useEffect(() => {
    if (isError) {
      if (error.message === 'No token') return
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

  return { user, isLoading }
}
