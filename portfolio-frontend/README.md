# Portfolio Frontend

React + TypeScript + Tailwind CSS v4 client for Negaso Kena's portfolio, built against the `portfolio-backend` API.

## Stack

- **Build tool:** Vite
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-based `@theme` config, no `tailwind.config.js` needed)
- **Routing:** React Router v7
- **HTTP:** Axios, with a JWT interceptor for admin routes
- **Markdown:** react-markdown + remark-gfm (renders project/blog content)
- **Icons:** lucide-react

## Design system

- **Palette:** deep space-navy background (`#0A0E27`), purple-magenta accent (`#A63FEA`), sea-teal accent (`#2DD4BF`), paper-white text (`#F4F2F8`) — see `src/index.css` `@theme` block.
- **Type:** Space Grotesk (headings), IBM Plex Sans (body), IBM Plex Mono (labels, tags, nav, timestamps).
- **Signature element:** an animated purple-to-teal signal waveform in the hero, echoed as the small loading indicator.
- **Structural device:** `CornerFrame` — bracket corners on cards, a carried-over identity element from the site's earlier design pass.

## Pages

**Public:** Home, Projects (search + tag filter), Project detail, Blog (search + tag filter), Post detail, Contact.
**Admin** (`/admin`, JWT-protected): Overview, Projects CRUD, Blog CRUD (draft/publish), Messages inbox, Site settings editor. All writes go through the same Express/Prisma API you already deployed.

## 1. Local setup

```bash
cp .env.example .env
# for local dev, defaults are already correct if your backend runs on :5000

npm install
npm run dev        # http://localhost:5173, proxies /api and /uploads to VITE_API_PROXY_TARGET
```

The dev proxy (`vite.config.ts`) means you don't need CORS configured for local development — only for production, where `CLIENT_URL` on the backend must match this site's deployed origin.

## 2. Production build

```bash
npm run build       # outputs to dist/
npm run preview     # sanity-check the production build locally
```

Before building for a real deployment, set `VITE_API_URL` in `.env` (or your host's env vars) to your live backend's full API URL, e.g.:

```
VITE_API_URL=https://portfolio-backend.onrender.com/api
```

## 3. Deploying to Netlify

1. Push this frontend to its own repo (or a `portfolio-frontend/` folder in a monorepo).
2. In Netlify: **Add new site → Import an existing project**, connect the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add an environment variable: `VITE_API_URL` = your Render backend's API URL (see above).
5. Because this is a client-side-routed SPA, add a `public/_redirects` file (included) so refreshing `/projects/some-slug` doesn't 404.
6. Deploy. On the backend side, set `CLIENT_URL` to this Netlify site's URL so CORS allows it.

## 4. Admin access

Log in at `/admin/login` with the admin email/password you set in the backend's `.env` and created via `npm run seed`.
