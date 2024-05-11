import { GraduationCap, Home, PackageSearch, Users, BookCopy, University, PanelLeft } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import DDMUser from './DDMUser'

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

export default function SideBarAdmin () {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/admin/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
            </Link>
            {
              navLinks.map((navLink) => {
                return (
                  <Link
                    key={navLink.link}
                    to={navLink.link}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {navLink.icon}
                    {navLink.name}
                  </Link>
                )
              })
            }
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0"></div>
      <DDMUser/>
    </header>
  )
}
