import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const INITIAL_ARTICLES = [
  { id: 1, title: 'Onboarding guide draft', status: 'Draft' },
  { id: 2, title: 'Q3 release notes', status: 'Published' },
  { id: 3, title: 'API migration checklist', status: 'Draft' },
]

// Experiment 1.3.2 — "Conditionally render UI elements (buttons, pages)"
// Editors and Admins can edit; Viewers see a read-only list.
export default function Content() {
  const { hasPermission } = useAuth()
  const [articles, setArticles] = useState(INITIAL_ARTICLES)
  const canEdit = hasPermission('edit_content')

  const togglePublish = (id) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'Draft' ? 'Published' : 'Draft' } : a))
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Content library</h1>
        <p>{canEdit ? 'You can edit and publish articles.' : 'Read-only — ask an editor or admin for changes.'}</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              {canEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>
                  <span className={`status-pill ${a.status === 'Published' ? 'status-live' : 'status-draft'}`}>
                    {a.status}
                  </span>
                </td>
                {canEdit && (
                  <td className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => togglePublish(a.id)}>
                      {a.status === 'Draft' ? 'Publish' : 'Unpublish'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
