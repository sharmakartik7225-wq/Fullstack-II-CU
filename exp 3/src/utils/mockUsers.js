// Mock user "database". In a real system this lives on the server and
// passwords are hashed (bcrypt/argon2) — never compared in plain text.
export const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Aditi Rao', role: 'admin' },
  { id: 2, username: 'editor', password: 'editor123', name: 'Rahul Mehta', role: 'editor' },
  { id: 3, username: 'viewer', password: 'viewer123', name: 'Sana Iyer', role: 'viewer' },
]

export function findUser(username, password) {
  return MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  )
}

export const ROLE_PERMISSIONS = {
  admin: ['view_dashboard', 'manage_users', 'edit_content', 'view_content'],
  editor: ['view_dashboard', 'edit_content', 'view_content'],
  viewer: ['view_dashboard', 'view_content'],
}
