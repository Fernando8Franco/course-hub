import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/services/Courses'

export const useCourses = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    refetchOnWindowFocus: false
  })

  return {
    isLoading,
    isError,
    courses: data
  }
}
