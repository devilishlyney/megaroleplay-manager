import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../controller/context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Loading...<br />Note : If you are seeing this for a long time, please check your internet connection and refresh the page.</p>
  }

  if (!user) { // if user is not logged in
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}