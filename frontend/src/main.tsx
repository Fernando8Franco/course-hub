/* eslint-disable react-refresh/only-export-components */
import ReactDOM from 'react-dom/client'
import { Suspense, lazy } from 'react'
import { Skeleton } from './components/ui/skeleton.tsx'
import { ThemeProvider } from './components/react-components/ThemeProvider.tsx'
import TestPage from './pages/TestPage.tsx'
import HomePageSkeleton from './pages/Skeletons/HomePageSkeleton.tsx'
import UserPageSkeleton from './pages/Skeletons/UserPageSkeleton.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

const NotFoundPage = lazy(async () => await import('./pages/NotFoundPage.tsx'))
const Layout = lazy(async () => await import('./pages/Layouts/Layout.tsx'))
const HomePage = lazy(async () => await import('./pages/HomePage.tsx'))
const LoginPage = lazy(async () => await import('./pages/LoginPage.tsx'))
const SendResetPage = lazy(async () => await import('./pages/SendResetPage.tsx'))
const ResetPasswordPage = lazy(async () => await import('./pages/ResetPasswordPage.tsx'))
const RegisterPage = lazy(async () => await import('./pages/RegisterPage.tsx'))
const SettingsLayout = lazy(async () => await import('./pages/Layouts/SettingsLayout.tsx'))
const SettingsPage = lazy(async () => await import('./pages/SettingsPage.tsx'))
const UpdatePasswordPage = lazy(async () => await import('./pages/UpdatePasswordPage.tsx'))
const OrdersPage = lazy(async () => await import('./pages/OrderPage.tsx'))
const PaymentPage = lazy(async () => await import('./pages/PaymentPage.tsx'))

const router = createBrowserRouter(
  [
    {
      path: '/',
      element:
      <Suspense>
        <Layout />
      </Suspense>,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: '/',
          element:
          <Suspense fallback={<HomePageSkeleton />}>
            <HomePage />
          </Suspense>
        },
        {
          path: '/login',
          element:
          <Suspense fallback={<Skeleton className='mx-auto my-auto w-[385px] h-[405px]' />}>
            <LoginPage />
          </Suspense>
        },
        {
          path: '/send-reset',
          element:
          <Suspense fallback={<Skeleton className='mx-auto my-auto w-[385px] h-[295px]' />}>
            <SendResetPage />
          </Suspense>
        },
        {
          path: '/reset-password/:token',
          element:
          <Suspense fallback={<Skeleton className='mx-auto my-auto w-[385px] h-[350px]' />}>
            <ResetPasswordPage />
          </Suspense>
        },
        {
          path: '/register',
          element:
          <Suspense fallback={<Skeleton className='mx-auto my-auto w-[385px] h-[495px]' />}>
            <RegisterPage />
          </Suspense>
        },
        {
          path: '/test',
          element: <TestPage />
        },
        {
          path: '/user',
          element:
          <Suspense fallback={<UserPageSkeleton />}>
            <SettingsLayout />
          </Suspense>,
          children: [
            {
              path: '/user/settings',
              element:
              <Suspense fallback={<Skeleton className='mx-auto w-full gap-2 h-[410px]' />}>
                <SettingsPage />
              </Suspense>
            },
            {
              path: '/user/password',
              element:
              <Suspense fallback={<Skeleton className='mx-auto w-full gap-2 h-[330px]' />}>
                <UpdatePasswordPage />
              </Suspense>
            },
            {
              path: '/user/orders',
              element:
              <Suspense fallback={<Skeleton className='mx-auto w-full gap-2 h-[480px]' />}>
                <OrdersPage/>
              </Suspense>
            },
            {
              path: '/user/payment',
              element:
              <Suspense fallback={<Skeleton className='mx-auto w-full gap-2 h-[520px]' />}>
                <PaymentPage/>
              </Suspense>
            }
          ]
        }
      ]
    }
  ],
  {
    basename: '/course-hub'
  }
)

const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router}/>
    </ThemeProvider>
  </QueryClientProvider>
)
