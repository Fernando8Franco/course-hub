import { useCourses } from '@/hooks/useCourses'
import Curso from './Course'
import { SkeletonCard } from './SkeletonCard'
import useSchoolStore from '@/store/schoolStore'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'

export default function Cursos () {
  const { isLoading, isError, courses } = useCourses()
  const { selectedSchool } = useSchoolStore()
  const { toast } = useToast()

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

  const filteredCourses = (selectedSchool === 'All')
    ? courses
    : courses?.filter(course => course.school_name === selectedSchool)

  if (isLoading) return <SkeletonCard/>

  if (!isLoading && !isError && filteredCourses?.length === 0) {
    return (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex align-center">
            No hay cursos disponibles
      </h1>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {
        filteredCourses?.map(course => (
          <Curso key={course.id} course={course}/>
        ))
      }
    </div>
  )
}
