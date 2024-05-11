import { GraduationCap, Home, PackageSearch, Users, BookCopy, University } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'

const navLinks = [
  {
    link: '/admin/dashboard',
    name: 'Dashboard',
    icon: <Home className="h-5 w-5" />
  },
  {
    link: '/admin/dashboard/transactions',
    name: 'Pedidos',
    icon: <PackageSearch className="h-5 w-5" />
  },
  {
    link: '/admin/dashboard/users',
    name: 'Usuarios',
    icon: <Users className="h-5 w-5" />
  },
  {
    link: '/admin/dashboard/courses',
    name: 'Cursos',
    icon: <BookCopy className="h-5 w-5" />
  },
  {
    link: '/admin/dashboard/schools',
    name: 'Escuelas',
    icon: <University className="h-5 w-5" />
  }
]

export default function NavigationAdmin () {
  return (
    <>
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          to="/admin/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <GraduationCap className="h-4 w-4 transition-all group-hover:scale-110" />
        </Link>
        {
          navLinks.map((navLink) => {
            return (
              <Tooltip key={navLink.link}>
                <TooltipTrigger asChild>
                  <Link
                    to={navLink.link}
                    className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                  >
                    {navLink.icon}
                    <span className="sr-only">{navLink.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{navLink.name}</TooltipContent>
              </Tooltip>
            )
          })
        }
      </nav>
    </aside>
    </>
  )
}
