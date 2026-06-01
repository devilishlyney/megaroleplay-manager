import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './view/page/Home'
import ProtectedRoute from './view/component/ProtectedRoute'
import Login from './view/page/Login'
import Dashboard from './view/page/Dashboard' // You'll create this
import CharacterCreator from './view/page/CharacterCreator' // Your wizard

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
        {/* Add more protected routes here */}
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App