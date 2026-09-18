/**
 * Mock JWT utility
 * ------------------------------------------------------------------
 * Experiment 1.3.1 asks for a *conceptual* JWT implementation that can
 * run entirely in the browser without a backend. Real JWT signing
 * requires a secret key that must live on a server — never in client
 * code — so this module simulates the three-part header.payload.signature
 * structure using Base64URL encoding and a simple hash "signature" so
 * students can see exactly how a token is built, stored, decoded and
 * expired. Swap `createToken`/`verifyToken` for a real backend call
 * (e.g. POST /api/login) in a production app.
 * ------------------------------------------------------------------
 */

const MOCK_SECRET = 'experiment-1.3.1-mock-secret' // conceptual only, never do this for real

function base64UrlEncode(obj) {
  const json = JSON.stringify(obj)
  const base64 = btoa(unescape(encodeURIComponent(json)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - (str.length % 4)) % 4, '=')
  const json = decodeURIComponent(escape(atob(padded)))
  return JSON.parse(json)
}

// A tiny non-cryptographic hash standing in for HMAC-SHA256, purely so
// the token has a verifiable "signature" segment for teaching purposes.
function mockHash(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

export function createToken(payload, expiresInSeconds = 60 * 60) {
  const header = { alg: 'MOCK-HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds }

  const encodedHeader = base64UrlEncode(header)
  const encodedPayload = base64UrlEncode(fullPayload)
  const signature = mockHash(`${encodedHeader}.${encodedPayload}.${MOCK_SECRET}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function decodeToken(token) {
  if (!token || token.split('.').length !== 3) return null
  const [encodedHeader, encodedPayload] = token.split('.')
  try {
    return {
      header: base64UrlDecode(encodedHeader),
      payload: base64UrlDecode(encodedPayload),
    }
  } catch {
    return null
  }
}

export function verifyToken(token) {
  if (!token || token.split('.').length !== 3) {
    return { valid: false, reason: 'MALFORMED' }
  }
  const [encodedHeader, encodedPayload, signature] = token.split('.')
  const expectedSignature = mockHash(`${encodedHeader}.${encodedPayload}.${MOCK_SECRET}`)

  if (signature !== expectedSignature) {
    return { valid: false, reason: 'BAD_SIGNATURE' }
  }

  const decoded = decodeToken(token)
  const now = Math.floor(Date.now() / 1000)
  if (!decoded || decoded.payload.exp < now) {
    return { valid: false, reason: 'EXPIRED' }
  }

  return { valid: true, payload: decoded.payload }
}
