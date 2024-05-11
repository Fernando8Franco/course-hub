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
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <Outlet/>
        </main>
        <Toaster />
      </div>
    </div>
  )
}
