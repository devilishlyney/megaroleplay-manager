import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './view/page/Home'
import ProtectedRoute from './view/component/ProtectedRoute'
import Login from './view/page/Login'
import CharacterCreator from './view/page/CharacterCreator'
import CharacterEditor from './view/page/CharacterEditor'
import UserProfile from './view/page/UserProfile'
import UserCharacters from './view/page/UserCharacters'
import Friends from './view/page/Friends'
import Profile from './view/page/Profile'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CharacterCreator />} />
        <Route path="/characters/:id/edit" element={<CharacterEditor />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/characters" element={<UserCharacters />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App