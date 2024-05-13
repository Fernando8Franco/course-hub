import { useQuery } from '@tanstack/react-query'
import { getCourses, getCoursesAdmin } from '@/services/Courses'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export const useCourses = () => {
  const { toast } = useToast()
  const { isLoading, isError, data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  })

  useEffect(() => {
    if (isError) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar los cursos',
        description: 'Hubo un error al cargar lo cursos'
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  return {
    isLoading,
    isError,
    courses
  }
}

export const useCoursesAdmin = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: coursesAdmin, isError, error, isLoading, isSuccess } = useQuery({
    queryKey: ['courses-admin'],
    queryFn: getCoursesAdmin,
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

  return { coursesAdmin, isLoading, isSuccess }
}
