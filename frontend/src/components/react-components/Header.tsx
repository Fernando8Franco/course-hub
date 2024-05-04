import { GraduationCap } from 'lucide-react'
import DDMCart from './DDMCart'
import DDMUser from './DDMUser'
import DDMTheme from './DDMTheme'
import { Link } from 'react-router-dom'
import useSchoolStore from '@/store/schoolStore'

export default function Header () {
  const { setSelectedSchool } = useSchoolStore()
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          onClick={() => { setSelectedSchool('All') }}
        >
          <GraduationCap className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
      </nav>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DDMTheme/>
        <DDMUser/>
        <DDMCart/>
      </div>
    </header>
  )
}
