# JWT Authentication & RBAC — Experiments 1.3.1 & 1.3.2

A single React app that implements **both** experiments:

- **1.3.1** — Stateless JWT-based login, token generation, storage, and
  request attachment.
- **1.3.2** — Role-based access control (RBAC), protected routes, and
  permission-driven UI rendering.

## Run it

You need [Node.js](https://nodejs.org) (v18+) installed.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## Demo logins

| Username | Password    | Role   |
|----------|-------------|--------|
| admin    | admin123    | admin  |
| editor   | editor123   | editor |
| viewer   | viewer123   | viewer |

The login page also has one-click buttons that fill these in for you.

## How it maps to the experiment procedure

**1.3.1 — Authentication**
- `src/pages/Login.jsx` — the login form UI.
- `src/utils/mockUsers.js` — the mock/static credential check.
- `src/utils/jwt.js` — builds a real three-part `header.payload.signature`
  token (Base64URL-encoded, with a demonstration hash as the
  "signature") and can decode/verify it. This is a **client-side
  simulation for learning purposes** — in production, tokens are always
  signed on the server with a secret that never reaches the browser.
- `src/utils/api.js` — stores the token in `localStorage` and shows how
  it gets attached as an `Authorization: Bearer <token>` header on every
  request (`src/pages/Dashboard.jsx` has a live "Call GET /api/profile"
  button that exercises this).
- `src/context/AuthContext.jsx` — rehydrates the session from the stored
  token on page load (no server session needed — that's what makes it
  "stateless") and exposes `login()` / `logout()`.
- `src/components/TokenInspector.jsx` — decodes and displays the token's
  header, payload, and signature live, like a mini jwt.io.

**1.3.2 — Authorization / RBAC**
- Roles (`admin`, `editor`, `viewer`) and their permissions are defined
  in `src/utils/mockUsers.js` (`ROLE_PERMISSIONS`) and embedded in the
  JWT payload at login.
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if there's
  no valid session.
- `src/components/RoleRoute.jsx` — additionally redirects to
  `/unauthorized` if the signed-in user's role isn't allowed on that
  route. Used to guard `/admin` in `src/App.jsx`.
- `src/components/Navbar.jsx` — only renders the "Admin" nav link for
  admins.
- `src/pages/Content.jsx` — renders edit/publish controls only when
  `hasPermission('edit_content')` is true (editors and admins), while
  viewers get a read-only table.
- `src/pages/Admin.jsx` — an admin-only page for managing user roles.

## Project structure

```
src/
  components/     ProtectedRoute, RoleRoute, Navbar, TokenInspector
  context/        AuthContext.jsx (stateless session state)
  pages/          Login, Dashboard, Content, Admin, Unauthorized, NotFound
  utils/          jwt.js, mockUsers.js, api.js
  App.jsx         route definitions
  main.jsx        entry point
  index.css       styling
```

## Notes for a real backend

To turn this into a real app, replace two things:
1. `login()` in `AuthContext.jsx` — call `POST /api/login` instead of
   checking `mockUsers.js` client-side, and use the token the server
   returns.
2. `mockApiRequest()` in `api.js` — call `fetch()`/`axios` against your
   real API; the server verifies the JWT signature with its secret on
   every request.
