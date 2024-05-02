import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { ThemeProvider } from './components/react-components/ThemeProvider.tsx'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
      errorElement: <NotFoundPage />
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
