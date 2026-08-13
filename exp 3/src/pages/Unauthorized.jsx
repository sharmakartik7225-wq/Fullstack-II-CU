import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="status-screen">
      <span className="status-icon">🔒</span>
      <h1>403 — Access denied</h1>
      <p>Your role doesn't have permission to view this page.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
    </div>
  )
}
