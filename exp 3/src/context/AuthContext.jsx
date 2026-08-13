import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createToken, verifyToken } from '../utils/jwt'
import { findUser, ROLE_PERMISSIONS } from '../utils/mockUsers'
import { getStoredToken, setStoredToken, clearStoredToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authenticated | unauthenticated
  const [error, setError] = useState('')

  // Rehydrate session from localStorage on load — this is what makes
  // the auth "stateless": the server holds nothing, the client's token
  // is the entire proof of the session.
  useEffect(() => {
    const stored = getStoredToken()
    if (stored) {
      const result = verifyToken(stored)
      if (result.valid) {
        setToken(stored)
        setUser(result.payload)
        setStatus('authenticated')
        return
      }
      clearStoredToken()
    }
    setStatus('unauthenticated')
  }, [])

  const login = useCallback((username, password) => {
    setError('')
    const found = findUser(username, password)
    if (!found) {
      setError('Invalid username or password.')
      return false
    }

    const payload = {
      sub: found.id,
      username: found.username,
      name: found.name,
      role: found.role,
      permissions: ROLE_PERMISSIONS[found.role],
    }
    const newToken = createToken(payload, 60 * 30) // 30 minute expiry

    setStoredToken(newToken)
    setToken(newToken)
    setUser(payload)
    setStatus('authenticated')
    return true
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const hasRole = useCallback((...roles) => !!user && roles.includes(user.role), [user])
  const hasPermission = useCallback((perm) => !!user?.permissions?.includes(perm), [user])

  const value = { token, user, status, error, login, logout, hasRole, hasPermission }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
