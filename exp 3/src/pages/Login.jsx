import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_USERS } from '../utils/mockUsers'

export default function Login() {
  const { login, status } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    if (!username || !password) {
      setLocalError('Enter both a username and a password.')
      return
    }
    const success = login(username, password)
    if (success) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    }
  }

  const fillDemo = (u) => {
    setUsername(u.username)
    setPassword(u.password)
    setLocalError('')
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="brand-mark large">◈</span>
          <h1>Sign in</h1>
          <p>Stateless JWT authentication — Experiment 1.3.1</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {localError && <p className="form-error">{localError}</p>}

          <button type="submit" className="btn btn-primary btn-block">
            Generate token &amp; sign in
          </button>
        </form>

        <div className="demo-users">
          <p>Try a demo role:</p>
          <div className="demo-user-list">
            {MOCK_USERS.map((u) => (
              <button key={u.id} type="button" className="demo-user-chip" onClick={() => fillDemo(u)}>
                <span className={`badge badge-${u.role}`}>{u.role}</span>
                <span>{u.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
