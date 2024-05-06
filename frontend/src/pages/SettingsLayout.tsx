import { NavLink, Outlet } from 'react-router-dom'
import { UserCog } from 'lucide-react'

const navLinks = [
  {
    link: '/user/settings',
    name: 'Ajustes'
  },
  {
    link: '/user/password',
    name: 'Contraseña'
  },
  {
    link: '/user/orders',
    name: 'Pedidos'
  },
  {
    link: '/user/payments',
    name: 'Formas de Pago'
  }
]

export default function SettingsLayout () {
  return (
    <>
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <nav className="grid gap-4 text-sm text-muted-foreground">
        <div className='flex justify-center'>
          <UserCog className="h-8 w-8"/>
        </div>
        {
          navLinks.map((navLink) => {
            return (
              <NavLink key={navLink.link} to={navLink.link} className={({ isActive }) => { return isActive ? 'font-semibold text-primary' : '' }}>
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  {navLink.name}
                </h4>
              </NavLink>
            )
          })
        }
      </nav>
      <Outlet/>
    </div>
    </>
  )
}
