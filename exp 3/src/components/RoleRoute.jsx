import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Guards a route behind authentication AND role membership
// (Experiment 1.3.2). Wraps ProtectedRoute so an unauthenticated user
// is sent to /login, while an authenticated user with the wrong role
// is sent to /unauthorized instead.
export default function RoleRoute({ allowedRoles, children }) {
  const { hasRole } = useAuth()

  return (
    <ProtectedRoute>
      {hasRole(...allowedRoles) ? children : <Navigate to="/unauthorized" replace />}
    </ProtectedRoute>
  )
}
