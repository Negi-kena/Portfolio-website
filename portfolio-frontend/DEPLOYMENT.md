# Production deployment: Netlify + Render

This frontend is intentionally separate from the Express backend.

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Node: 22.x
- Environment variable:
  - `VITE_API_URL=https://<your-render-service>.onrender.com/api`
- The included `netlify.toml` and `public/_redirects` keep React Router URLs working on refresh.

## Render backend

Set these backend environment variables:

- `DATABASE_URL` — MySQL connection string
- `JWT_SECRET` — long random secret
- `CLIENT_URL` — exact Netlify origin, e.g. `https://your-site.netlify.app`
- SMTP variables if contact-email notifications are desired

The backend must expose `/health` and `/api`.

## Local development

1. Run the backend on `http://localhost:5000`.
2. Keep `VITE_API_URL=/api`.
3. Vite proxies `/api` and `/uploads` to `VITE_API_PROXY_TARGET` (default `http://localhost:5000`).
4. Run `npm run dev`.

## Important upload limitation

The current backend stores uploaded files on its local filesystem. Render free web-service storage is ephemeral, so uploaded images/resume files should eventually move to object storage (Cloudinary, S3-compatible storage, etc.) if they must survive restarts and deployments.
