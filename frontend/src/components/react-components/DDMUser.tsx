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
import { useUser } from '@/hooks/useUser'
import Cookies from 'js-cookie'

export default function DDMUser () {
  const { user } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      {
        user !== undefined
          ? <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to='/user/settings'>
            <DropdownMenuItem className='cursor-pointer'>Ajustes</DropdownMenuItem>
          </Link>
          <Link to='/user/orders'>
            <DropdownMenuItem className='cursor-pointer'>Pedidos</DropdownMenuItem>
          </Link>
          <Link to='/user/payment'>
            <DropdownMenuItem className='cursor-pointer'>Formas de pago</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer'
          onClick={() => {
            Cookies.remove('SJSWSTN')
            window.location.reload()
          }}>
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
          : <DropdownMenuContent align="end">
          <Link to='/login'>
            <DropdownMenuItem className='flex gap-2 justify-between cursor-pointer'>
              Iniciar sesión
              <LogIn className="h-5 w-5" />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator/>
          <Link to='/register'>
            <DropdownMenuItem className='flex justify-between cursor-pointer'>
              Registrarse
              <UserRoundPlus className="h-5 w-5" />
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      }
    </DropdownMenu>
  )
}
