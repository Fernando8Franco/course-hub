import { useUser } from '@/hooks/useUser'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const ProtectedRouteCustomer = () => {
  const navigate = useNavigate()
  const cookie = Cookies.get('SJSWSTN')
  const { user, isSuccess } = useUser()

  useEffect(() => {
    if (isSuccess && user?.user_type !== 'CUSTOMER') {
      navigate('/', { replace: true })
    }
  }, [isSuccess])

  if (cookie === undefined) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRouteCustomer
