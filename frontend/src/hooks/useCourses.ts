import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/services/Courses'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

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
