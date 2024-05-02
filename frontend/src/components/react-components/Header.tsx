import { Link } from 'react-router-dom'
import { GraduationCap, CircleUser, ShoppingCart, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useTheme } from './ThemeProvider'
import useCartStore from '@/store/cartStore'
import EmptyCart from './EmptyCart'
import Cart from './Cart'
import { useEffect, useState } from 'react'

export default function Header () {
  const { setTheme } = useTheme()
  const { cart } = useCartStore()
  const [open, setOpen] = useState(false)

  const handleOpenChange = (nextOpenState: boolean) => {
    setOpen(nextOpenState)
  }

  useEffect(() => {
    if (cart !== null) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [cart])

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <GraduationCap className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
      </nav>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to='/ajustes'>
              <DropdownMenuItem className='cursor-pointer'>Ajustes</DropdownMenuItem>
            </Link>
            <Link to='/pedidos'>
              <DropdownMenuItem className='cursor-pointer'>Pedidos</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
              (cart != null) ? <Cart course={cart}/> : <EmptyCart/>
            }
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setTheme('light') }}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme('dark') }}>
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme('system') }}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
