import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/services/Courses'

export const useCourses = () => {
  const { isLoading, isError, data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  })

  return {
    isLoading,
    isError,
    courses
  }
}
