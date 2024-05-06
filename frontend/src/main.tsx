import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { ThemeProvider } from './components/react-components/ThemeProvider.tsx'
import LoginPage from './pages/LoginPage.tsx'
import Layout from './pages/Layout.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import SettingsLayout from './pages/SettingsLayout.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import OrdersPage from './pages/OrderPage.tsx'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: '/',
          element: <HomePage/>
        },
        {
          path: '/login',
          element: <LoginPage/>
        },
        {
          path: '/register',
          element: <RegisterPage/>
        },
        {
          path: '/user',
          element: <SettingsLayout/>,
          children: [
            {
              path: '/user/settings',
              element: <SettingsPage/>
            },
            {
              path: '/user/orders',
              element: <OrdersPage/>
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
