import { SkeletonCard } from './SkeletonCard'
import CourseCard from './CourseCard'
import useSchoolStore from '@/store/schoolStore'
import { useCourses } from '@/hooks/useCourses'

export default function Courses () {
  const { selectedSchool } = useSchoolStore()
  const { isLoading, isError, courses } = useCourses()

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
          <CourseCard key={course.id} course={course}/>
        ))
      }
    </div>
  )
}
