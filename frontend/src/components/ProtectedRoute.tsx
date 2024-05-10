import Cookies from 'js-cookie'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoute = () => {
  const cookie = Cookies.get('SJSWSTN')
  const navigate = useNavigate()

  if (cookie === undefined) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
