import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="status-screen">
      <span className="status-icon">◈</span>
      <h1>404 — Page not found</h1>
      <p>That route doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
    </div>
  )
}
