import { CircleUser, LogIn, UserRoundPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import useUserStore from '@/store/userStore'

export default function DDMUser () {
  const { isLogIn } = useUserStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      {
        isLogIn
          ? <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to='/login'>
            <DropdownMenuItem className='cursor-pointer'>Ajustes</DropdownMenuItem>
          </Link>
          <Link to='/pedidos'>
            <DropdownMenuItem className='cursor-pointer'>Pedidos</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
          : <DropdownMenuContent align="end">
          <Link to='/login'>
            <DropdownMenuItem className='flex gap-2 justify-between'>
              Iniciar sesión
              <LogIn className="h-5 w-5" />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator/>
          <Link to='/register'>
            <DropdownMenuItem className='flex justify-between'>
              Registrarse
              <UserRoundPlus className="h-5 w-5" />
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      }
    </DropdownMenu>
  )
}
