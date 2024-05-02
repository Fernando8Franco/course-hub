import { useCourses } from '@/hooks/useCourses'
import Curso from './Course'
import { SkeletonCard } from './SkeletonCard'
import useSchoolStore from '@/store/schoolStore'

export default function Cursos () {
  const { isLoading, isError, courses } = useCourses()
  const { selectedSchool } = useSchoolStore()
  const filteredCourses = (selectedSchool === 'All')
    ? courses
    : courses?.filter(course => course.school_name === selectedSchool)

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {
        filteredCourses?.map(course => (
          <Curso key={course.id} course={course}/>
        ))
      }
      {isLoading && <SkeletonCard/>}
      {isError && <p>Error</p>}
    </div>
  )
}
