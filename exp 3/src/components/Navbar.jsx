import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_STYLES = {
  admin: { label: 'Admin', className: 'badge badge-admin' },
  editor: { label: 'Editor', className: 'badge badge-editor' },
  viewer: { label: 'Viewer', className: 'badge badge-viewer' },
}

export default function Navbar() {
  const { user, status, logout } = useAuth()
  const navigate = useNavigate()

  if (status !== 'authenticated') return null

  const roleMeta = ROLE_STYLES[user.role]

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark">◈</span>
        <span>SecureAuth</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Dashboard
        </NavLink>
        <NavLink to="/content" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Content
        </NavLink>
        {(user.role === 'admin') && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Admin
          </NavLink>
        )}
      </nav>

      <div className="navbar-user">
        <span className={roleMeta.className}>{roleMeta.label}</span>
        <span className="navbar-username">{user.name}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  )
}
