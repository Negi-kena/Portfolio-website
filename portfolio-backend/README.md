# Portfolio Backend

Node.js + Express + TypeScript + Prisma + MySQL API for Negaso Kena's portfolio site.

## Stack

- **Runtime:** Node.js, Express, TypeScript
- **Database:** MySQL (via Prisma ORM) — designed for [Aiven's free MySQL tier](https://aiven.io/free-mysql-database)
- **Auth:** JWT (bcryptjs + jsonwebtoken)
- **Uploads:** multer (images, resume PDF)
- **Email:** nodemailer with console-fallback when SMTP isn't configured
- **Security:** helmet, cors, express-rate-limit
- **Validation:** zod

## Data model

- `User` — single admin account
- `Project` — portfolio projects (title, summary, description, links, tags, featured flag)
- `BlogPost` — blog articles (draft/published, tags)
- `Tag` — shared many-to-many tag table for projects & posts
- `Message` — contact form submissions
- `SiteSettings` — singleton row for hero copy, bio, resume link, social links

## 1. Set up MySQL on Aiven (free)

1. Sign up at [aiven.io](https://aiven.io) — no credit card required.
2. Create a new service → **MySQL** → select the **Free** plan.
3. Once it's running, open the service overview and copy the **Service URI** (looks like `mysql://avnadmin:xxxx@mysql-xxxx.aivencloud.com:12345/defaultdb?sslaccept=strict`).
4. Paste it into `.env` as `DATABASE_URL`.

> Aiven may power off a free service after a period of inactivity — just reopen the dashboard and click "power on" if a connection ever times out.

## 2. Local setup

```bash
cp .env.example .env
# edit .env: set DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

npm install
npx prisma generate
npx prisma migrate dev --name init   # creates tables on your Aiven MySQL instance
npm run seed                          # creates your admin user + starter content
npm run dev                           # starts the API on http://localhost:5000
```

## 3. Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start in watch mode (ts-node-dev) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run prisma:studio` | Visual DB browser at localhost |
| `npm run prisma:migrate` | Create/apply a new migration |
| `npm run seed` | Re-run the seed script |

## 4. API overview

All routes are prefixed with `/api`.

**Public**
- `POST /auth/login`
- `GET /projects`, `GET /projects/:slug`
- `GET /blog`, `GET /blog/:slug`
- `POST /contact`
- `GET /settings`

**Admin** (require `Authorization: Bearer <token>` from `/auth/login`)
- `GET /auth/me`
- `POST/PUT/DELETE /projects`
- `GET/POST/PUT/DELETE /admin/blog`
- `GET/PATCH/DELETE /admin/messages`
- `PUT /admin/settings`
- `POST /admin/upload` (multipart `file` field)

## 5. Notes on this sandbox build

`npx prisma generate` could not download its query-engine binary in the build sandbox (no access to `binaries.prisma.sh`), so the Prisma client here is an unconfigured stub — that's expected and matches what happens in any offline environment. Everything type-checks cleanly except two lines that reference Prisma's generated types (`Role`, `PrismaClientKnownRequestError`), which will resolve the moment you run `npx prisma generate` with real internet access against your `DATABASE_URL`.

## 6. Deploying

Any Node host works (Render, Railway, Fly.io, a VPS, etc.). Set the same env vars as `.env`, run `npm run build && npm start`, and point `CLIENT_URL` at your deployed frontend's origin for CORS.

## 7. Deploying to Render (free tier)

A ready-to-use `render.yaml` blueprint is included at the project root.

1. Push this backend to its own GitHub repo (or a `portfolio-backend/` subfolder of a monorepo — the blueprint's `rootDir` already points there).
2. In the Render dashboard: **New → Blueprint**, connect the repo. Render reads `render.yaml` automatically and proposes the service.
3. Fill in the env vars marked `sync: false` in the dashboard (`DATABASE_URL` from Aiven, `JWT_SECRET`, `CLIENT_URL` = your Netlify URL, SMTP creds if you have them).
4. Deploy. Render runs `npm install && npx prisma generate && npm run build`, then on start applies pending migrations (`prisma migrate deploy`) before launching the server.
5. Your API is live at `https://portfolio-backend-xxxx.onrender.com`. Point your frontend's `VITE_API_URL` (or equivalent) at it.

**Important caveat — uploads on free tier:** Render's free web services use ephemeral disk, meaning anything written to `/uploads` (resume PDF, project images uploaded via the admin panel) is wiped on every redeploy or restart. Two options:
- Fine for now: keep using `git`-committed images/PDF in the repo for anything permanent, and treat runtime uploads as temporary/replaceable.
- Better long-term: swap the upload destination from local disk to a free object-storage service (e.g. Cloudinary's free tier) — a small change since uploads already go through one `upload.controller.ts` file. Happy to do this whenever you're ready.

**Keeping it awake:** free services sleep after 15 minutes idle (30-60s cold start on the next request). To avoid that, set up a free [UptimeRobot](https://uptimerobot.com) monitor pinging `https://your-service.onrender.com/health` every 10 minutes — well within Render's free hour budget for a 24/7-awake service.

