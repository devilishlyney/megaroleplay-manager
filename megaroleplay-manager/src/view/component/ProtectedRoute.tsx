import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../controller/context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...<br />Note : If you are seeing this for a long time, please check your internet connection and refresh the page.</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}