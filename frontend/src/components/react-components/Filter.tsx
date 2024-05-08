import { ListFilter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useCourses } from '@/hooks/useCourses'
import useSchoolStore from '@/store/schoolStore'

export default function Filter () {
  const { courses } = useCourses()
  const { selectedSchool, setSelectedSchool } = useSchoolStore()

  const uniqueSchools: string[] = Array.from(new Set(courses?.map(course => course.school_name)))

  const handleFilterChange = (filter: string) => {
    setSelectedSchool(filter)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Escuela
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className='text-center'>Filtrar por escuela</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
            checked={selectedSchool === 'All'}
            onSelect={() => { handleFilterChange('All') }}
            className='text-center'
          >
            Todas
        </DropdownMenuCheckboxItem>
        {
          uniqueSchools?.map((school, index) => (
            <div key={index}>
            <DropdownMenuSeparator/>
            <DropdownMenuCheckboxItem key={school}
              checked={selectedSchool === school}
              onSelect={() => { handleFilterChange(school) }}
              className='text-center'
            >
              {school}
            </DropdownMenuCheckboxItem>
            </div>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
