import NavigationAdmin from '@/components/react-components/NavigationAdmin'
import SideBarAdmin from '@/components/react-components/SideBarAdmin'
import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'

export default function LayoutAdminPage () {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavigationAdmin />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <SideBarAdmin/>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet/>
        </main>
        <Toaster />
      </div>
    </div>
  )
}
