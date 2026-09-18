import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mockApiRequest } from '../utils/api'
import TokenInspector from '../components/TokenInspector'

export default function Dashboard() {
  const { user, token } = useAuth()
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(false)

  const callProtectedApi = async () => {
    setLoading(true)
    const result = await mockApiRequest('/api/profile')
    setLog(result)
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome back, {user.name.split(' ')[0]}</h1>
        <p>You're signed in as <span className={`badge badge-${user.role}`}>{user.role}</span> via a stateless JWT session.</p>
      </div>

      <div className="grid-2">
        <section className="card">
          <h2>Simulate an authenticated request</h2>
          <p className="muted">
            Every request attaches the token from storage as a Bearer header,
            exactly as the "attach token to requests" step in Experiment 1.3.1 describes.
          </p>
          <button className="btn btn-primary" onClick={callProtectedApi} disabled={loading}>
            {loading ? 'Sending…' : 'Call GET /api/profile'}
          </button>

          {log && (
            <div className={`api-log ${log.ok ? 'api-log-ok' : 'api-log-fail'}`}>
              <div className="api-log-row">
                <span>Status</span>
                <strong>{log.status} {log.ok ? 'OK' : 'Unauthorized'}</strong>
              </div>
              <div className="api-log-row">
                <span>Authorization header</span>
                <code>{log.request.headers.Authorization?.slice(0, 28)}…</code>
              </div>
              <pre className="api-log-body">{JSON.stringify(log.ok ? log.data : { error: log.error }, null, 2)}</pre>
            </div>
          )}
        </section>

        <TokenInspector token={token} />
      </div>
    </div>
  )
}
