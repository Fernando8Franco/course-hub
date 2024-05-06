import Header from '../components/react-components/Header'
import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'

export default function Layout () {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header/>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Outlet/>
        <Toaster />
      </main>
    </div>
  )
}
