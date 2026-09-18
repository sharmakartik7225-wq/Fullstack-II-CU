import { verifyToken } from './jwt'

const TOKEN_KEY = 'jwt_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Simulates an authenticated API request. No real network call is made —
 * this exists to demonstrate "attach token to requests" from the
 * experiment procedure: every call reads the stored JWT and sends it as
 * a Bearer Authorization header, exactly like a real fetch/axios call
 * to a protected backend route would.
 */
export async function mockApiRequest(path, { method = 'GET' } = {}) {
  const token = getStoredToken()
  const request = {
    method,
    url: path,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  }

  await new Promise((resolve) => setTimeout(resolve, 250)) // fake latency

  const result = verifyToken(token)
  if (!result.valid) {
    return { ok: false, status: 401, request, error: result.reason }
  }
  return { ok: true, status: 200, request, data: { message: `Authorized response from ${path}`, user: result.payload } }
}
