# AeroBMSCE

Marketing site, sponsor conversion page, and an authenticated team-progress
dashboard for **AeroBMSCE** — the aerospace & UAV club of BMS College of
Engineering.

> _Above Gravity, Beyond Limits._

- **Public** — landing (`/`), sponsor / partner page (`/sponsor`), login (`/login`).
- **Authenticated** — team-lead board (`/dashboard`) and an all-teams overview
  (`/dashboard/overview`), protected by edge proxy + Postgres RLS.

---

## Tech stack

| Layer    | Choice                                                        |
| -------- | ------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router) · TypeScript · Tailwind CSS 3         |
| Auth     | Supabase Auth (email/password, **invite-only**)              |
| Database | Supabase Postgres with Row Level Security                    |
| Storage  | Supabase Storage (private `progress` bucket for attachments) |
| Hosting  | Vercel (frontend) + Supabase (backend)                       |

Fonts: **Exo 2** (headings) + **DM Sans** (body) via `next/font/google`.

---

## Prerequisites

- Node.js 20+ and npm
- A [Supabase](https://supabase.com) project (free tier is fine)

---

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy the template and fill it in from **Supabase → Project Settings → API**:

```bash
cp .env.example .env.local
```

| Variable                          | Where it's used      | Notes                                            |
| --------------------------------- | -------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`        | client + server      | Project URL                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | client + server      | Anon/public key                                  |
| `SUPABASE_SERVICE_ROLE_KEY`       | **server only**      | Secret — bypasses RLS. Never expose to a browser |
| `NEXT_PUBLIC_SITE_URL`            | metadata / redirects | `http://localhost:3000` in dev                   |

## 3. Database — run the migrations

Open **Supabase → SQL Editor** and run the files in
[`supabase/migrations/`](supabase/migrations) **in order**:

| Order | File                | What it does                                            |
| ----- | ------------------- | ------------------------------------------------------- |
| 1     | `0001_schema.sql`   | Tables, enums, helper functions, auto-profile trigger   |
| 2     | `0002_rls.sql`      | Row Level Security policies for every table             |
| 3     | `0003_storage.sql`  | Private `progress` bucket + storage RLS                 |
| 4     | `0004_seed.sql`     | Seeds the 9 teams; documents admin + invite SQL         |

> Using the Supabase CLI instead? `supabase db push` will apply the same files.

## 4. Create the first admin + invite team leads

There is **no public signup**. Accounts are created by an admin.

**Bootstrap your first admin:**

1. **Supabase → Authentication → Users → "Add user"** — set an email + password
   and tick **Auto Confirm User**. A `profiles` row is auto-created by a trigger.
2. Promote it to admin in the SQL editor (replace the email):

   ```sql
   update public.profiles p
   set    role = 'admin',
          full_name = 'Core Admin',
          team_id = (select id from public.teams where slug = 'aerobmsce-core')
   from   auth.users u
   where  u.id = p.id and u.email = 'aerobmsce@bmsce.ac.in';
   ```

**Invite a team lead:**

1. **Authentication → Users → "Invite user"** (or "Add user"). Enter their email.
2. Assign their role + team:

   ```sql
   update public.profiles p
   set    role = 'team_lead',
          full_name = 'Their Name',
          team_id = (select id from public.teams where slug = 'design')
   from   auth.users u
   where  u.id = p.id and u.email = 'lead@example.com';
   ```

For a **Management Collective** member (read-all, no edit) set `role = 'management'`.

## 5. Run it

```bash
npm run dev          # http://localhost:3000
```

---

## Roles & access (enforced in Postgres RLS, not just the UI)

| Role         | Progress updates                          | Teams / users      |
| ------------ | ----------------------------------------- | ------------------ |
| `team_lead`  | Create / read / **update own team only**  | —                  |
| `management` | Read **all** teams (no edit)              | —                  |
| `admin`      | Read all teams                            | Manage teams/users |

- A team lead can only see, post to, and edit **their own team's** updates.
- Uploads land in `progress/{team_id}/{update_id}/…`; storage RLS blocks any
  cross-team read/write. Upload **type** (images/PDF) and **size** (< 10 MB) are
  also validated server-side in `app/dashboard/actions.ts`.
- The service-role key is only ever imported in server code
  (`lib/supabase/admin.ts`, guarded by `import 'server-only'`).

---

## Project structure

```
app/
  page.tsx                 # landing
  sponsor/page.tsx         # conversion page
  login/                   # sign-in page + server actions (no signup)
  dashboard/
    layout.tsx             # auth shell (requireAuth)
    page.tsx               # team-lead board
    overview/page.tsx      # admin/management all-teams view
    actions.ts             # create/edit update + validated uploads
components/                # site, ui, auth, dashboard components
lib/
  content.ts               # ALL marketing copy (single source of truth)
  supabase/                # client / server / admin / proxy helpers
  auth.ts                  # getSessionProfile / requireAuth / requireRole
  progress.ts              # update fetching + signed attachment URLs
proxy.ts                   # protects /dashboard/* (Next 16 proxy convention)
supabase/migrations/       # SQL: schema, RLS, storage, seed
public/                    # logo + drop-in photos/partner logos (see README there)
```

Editing site copy? It all lives in [`lib/content.ts`](lib/content.ts).

---

## Assets

`public/logo.svg` and `public/favicon.svg` are branded placeholders. Real photos
and partner logos can be dropped into `/public` at the paths listed in
[`public/README.md`](public/README.md) — the UI shows a graceful placeholder
until each file exists, so no code changes are needed.

---

## Deploy

### Backend — Supabase
Already live once you've run the migrations (steps 3–4).

### Frontend — Vercel
1. Import the repo into Vercel.
2. Add the four environment variables from step 2 (set `NEXT_PUBLIC_SITE_URL` to
   your production URL).
3. In **Supabase → Authentication → URL Configuration**, add your Vercel domain
   to the allowed redirect/site URLs.
4. Deploy. `npm run build` is the default build command.

---

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Local dev server           |
| `npm run build` | Production build (+ tsc)   |
| `npm run start` | Serve the production build |
