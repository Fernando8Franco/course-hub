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
import { useState } from 'react'
import { useCourses } from '@/hooks/useCourses'
import useSchoolStore from '@/store/schoolStore'

export default function Filter () {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const { courses } = useCourses()
  const { setSelectedSchool } = useSchoolStore()

  const uniqueSchools: string[] = Array.from(new Set(courses?.map(course => course.school_name)))

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
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
        <DropdownMenuLabel className='text-center'>Filtar por escuela</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
            checked={selectedFilter === 'All'}
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
              checked={selectedFilter === school}
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
