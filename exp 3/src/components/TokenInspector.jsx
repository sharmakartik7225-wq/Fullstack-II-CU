import { decodeToken } from '../utils/jwt'

export default function TokenInspector({ token }) {
  const decoded = decodeToken(token)
  if (!decoded) return null

  const [h, p, s] = token.split('.')
  const expiresAt = new Date(decoded.payload.exp * 1000)

  return (
    <div className="token-inspector">
      <div className="token-inspector-header">
        <span className="chip-icon">⛓</span>
        <div>
          <h3>Token inspector</h3>
          <p>What the client actually stores &amp; sends with every request</p>
        </div>
      </div>

      <div className="token-raw">
        <span className="seg seg-header">{h}</span>.
        <span className="seg seg-payload">{p}</span>.
        <span className="seg seg-signature">{s}</span>
      </div>

      <div className="token-parts">
        <div className="token-part">
          <span className="part-label seg-header-text">HEADER</span>
          <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
        </div>
        <div className="token-part">
          <span className="part-label seg-payload-text">PAYLOAD</span>
          <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
        </div>
        <div className="token-part">
          <span className="part-label seg-signature-text">SIGNATURE</span>
          <pre>mockHash(header + payload + secret)</pre>
        </div>
      </div>

      <div className="token-meta">
        <span>Expires: {expiresAt.toLocaleTimeString()}</span>
        <span>Storage: localStorage["jwt_token"]</span>
      </div>
    </div>
  )
}
