import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './view/page/Home'
import ProtectedRoute from './view/component/ProtectedRoute'
import Login from './view/page/Login'
import Dashboard from './view/page/Dashboard' // You'll create this
import CharacterCreator from './view/page/CharacterCreator' // Your wizard
import UserProfile from './view/page/UserProfile'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CharacterCreator />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App