import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp, signIn } from '../../controller/service/authService'
import { useAuth } from '../../controller/context/AuthContext'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect if already logged in
  if (user) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isLogin) {
      const validUsername = username.trim()
      const usernamePattern = /^[a-z0-9._]+$/ // regex for lowercase letters, numbers, periods, and underscores

      if (!usernamePattern.test(validUsername)) {
        setError('Username can only contain lowercase letters, numbers, periods, and underscores.')
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        await signIn(email, password)
        navigate('/')
      } else {
        const data = await signUp(email, password, username)
        if (data?.user) {
          alert('Check your email for the confirmation link!')
          setIsLogin(true) // Switch back to login
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return ( // Page layout
    <div className="container">
      <div className="card">
        <h2>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        {error && <div>{error}</div>}
        
        <form onSubmit={handleSubmit}> 
          {!isLogin && (
            <input 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required={!isLogin}
              minLength={3}
              maxLength={30}
              pattern="[a-z0-9._]+"
              title="Use only lowercase letters, numbers, periods, and underscores."
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="login-signup-btn"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="have-account">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="login-signup-btn"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}