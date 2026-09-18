import { useState } from 'react'
import { MOCK_USERS } from '../utils/mockUsers'

// Only reachable by the "admin" role — enforced by RoleRoute in App.jsx.
export default function Admin() {
  const [roles, setRoles] = useState(
    Object.fromEntries(MOCK_USERS.map((u) => [u.id, u.role]))
  )

  const changeRole = (id, role) => {
    setRoles((prev) => ({ ...prev, [id]: role }))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin — user &amp; role management</h1>
        <p>This route is protected by RBAC: only the <span className="badge badge-admin">admin</span> role can reach it.</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td><code>{u.username}</code></td>
                <td>
                  <select
                    value={roles[u.id]}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted small">
          Changes here are local UI state only — wire this to a real
          <code> PATCH /api/users/:id/role</code> backend call to persist them.
        </p>
      </div>
    </div>
  )
}
