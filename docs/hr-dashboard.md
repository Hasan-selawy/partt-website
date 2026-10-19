# Partt Careers & HR

## Open it locally

- Public Careers: http://localhost:3000/careers
- Private HR dashboard: http://localhost:3000/hr
- This computer's initial administrator details: `.local/hr-access.txt`. Keep the file private and change the password in **Account** after signing in.

The local owner uses `info@parttagency.com`. This is a login identity; it does not configure email delivery. No jobs are prefilled. HR enters the real vacancies.

On another checkout, use Node 20.19+ (this implementation was verified on Node 24), then:

```sh
npm install
npm run hr:setup
npm run dev
```

Setup generates a private secret in `.env.local`, creates private local storage, and creates the first administrator only if no staff exist. Rerunning it preserves existing users and passwords. Do not replace `.env.local` after setup. Add other environment settings to it as needed. `.local/` and `.env*.local` are gitignored.

## Hiring workflow

1. Open **Job openings → Create new**. Enter the title, unique URL slug, department, location, employment type, workplace, summary, responsibilities, and requirements. Put one responsibility/requirement on each line.
2. Save as **Draft** while writing. Set **Status → Open**, then Save to publish immediately. No rebuild needed.
3. Open the role on Careers (or use its **Preview** control). Copy `/careers/your-slug` and share the full website URL in a LinkedIn post. LinkedIn applications are not automatically imported.
4. Applicants submit their name, email, PDF CV (maximum 5 MB), consent, and optional phone/portfolio/message. A success message appears only after the record and CV are saved.
5. In **Applications**, search names/emails and filter by job or status. Open a record to download its private CV, assign a staff member, add internal notes, or change its status: New → Reviewing → Shortlisted → Interview → Hired/Rejected. Save changes.
6. The dashboard shows open-role, new-application, and total-application counts, recent submissions, and an authenticated **Export applications (CSV)** link.
7. Set a role to **Closed** to stop new submissions and remove its public page/listing. Existing applicants remain available. Reopen it later if appropriate. A role with applicants cannot be deleted until those records are removed.

Deleting an application also deletes its CV. Closing/rejecting does not delete it. The team must adopt a retention period and routinely delete records when no longer needed, including copies in backups and CSV exports. Applicants can request corrections/withdrawal through `info@parttagency.com`.

## Staff accounts & password help

Administrators can create HR users, change their role, set passwords, and remove other users. HR users can manage recruitment and their own account but cannot create staff or promote themselves. Public registration is disabled, including first-user registration through the CMS API. Keep at least one administrator.

Passwords use Payload's established authentication. Sessions last eight hours, support sign-out/revocation, and lock after five failed attempts for 15 minutes. Cookies are HttpOnly, SameSite=Lax, and Secure in production.

Password reset emails and candidate email notifications are **not enabled**. The application is saved directly to the dashboard; HR should check it regularly. An administrator can change another user's password in **HR users**. For local/server recovery:

```sh
npm run hr:reset -- info@parttagency.com
```

The replacement password is written only to `.local/hr-recovery.txt`; existing sessions are revoked. SMTP can be added later when a provider is selected. The default email adapter deliberately refuses delivery and never logs reset links or tokens.

## Data & hosting

This is a working local application. It has not been deployed.

The default deployment is a **single Node server with persistent private disk**:

- `CAREERS_DATA_DIR`: absolute private directory outside the public/web root; defaults locally to `.local/careers`.
- Database: `careers.db` in that directory. CVs: its `cvs/` subdirectory. Both must survive deploys/restarts and be backed up together, using a consistent database snapshot while writes are paused. Keep backups private.
- `PAYLOAD_SECRET`: a long random secret, generated locally by setup. Preserve it across restarts; provide it securely on the production host.
- `NEXT_PUBLIC_SERVER_URL`: exact external origin, e.g. `https://www.parttagency.com`, supplied before building. It controls CMS URLs, same-origin checks, and CSRF/CORS. Production defaults to the current site URL.
- Use HTTPS. The production sign-in cookie is Secure.
- Set `TRUST_PROXY=true` only behind a reverse proxy that **replaces** incoming `X-Forwarded-For`. Otherwise it stays off. The apply endpoint has per-email throttling and a process-level ceiling; a trusted proxy enables per-IP throttling. Multi-instance hosting needs a shared limiter.
- Optional `DATABASE_URI` and `DATABASE_AUTH_TOKEN` configure a libSQL database. This changes database storage only; CVs still require durable private file storage.

Do not deploy this default local-disk setup to ephemeral/serverless storage. Choose a persistent host/volume first, or configure managed database and private object storage. Do not serve `.local`, the database, CV directory, or credential files as static assets. They are excluded from Next's file tracing. Restrict filesystem access to the server account.

An initial migration is included in `src/migrations`. For a fresh production database, set the target environment and run `npm run hr:migrate` before `npm run hr:setup` and starting the server. Before later updates, back up database/CVs, create a migration during development with `npm run hr:migrate:create -- descriptive_name`, review it, then apply it on the target host with `npm run hr:migrate`. Development schema push does not replace production migrations. Do not apply the initial CREATE-table migration over a development database whose tables already exist. See [Payload migrations](https://payloadcms.com/docs/database/migrations) and [SQLite adapter](https://payloadcms.com/docs/database/sqlite).

Set `NODE_ENV=production` for production CLI migration/bootstrap commands as well as the running server. Schema creation and trusted bootstrap were verified on a separate fresh production database, then those test files were removed.

Hosting, processing locations, mail delivery, and a fixed applicant-retention period remain owner decisions. Privacy/Cookie/Terms wording now describes recruitment and the staff session cookie; finish those operational details before publishing the site.

## Verification

`scripts/verify-careers.mjs` performs the actual local HTTP lifecycle and access checks with explicitly marked test records. It needs the initial local credential file and a running dev server. It leaves its temporary role for browser verification. After testing, remove only those marked fixtures:

```sh
node --env-file=.env.local --import tsx scripts/cleanup-careers-verification.ts
```

Test evidence is under `.planning/quick/20261018-careers-dashboard/`. Never run fixture scripts against a live recruiting site.

## Dependency audit

The audit has no high or critical findings. Five moderate advisories remain in the SQLite adapter's Drizzle schema-tooling dependency chain (`@esbuild-kit` → esbuild 0.18). The reported issue concerns esbuild's development HTTP server; this application does not start that server. The installed adapter currently offers no upstream resolution for that chain. Track the dependency update rather than forcing an unverified loader replacement. The vulnerable Sass watcher and DOMPurify versions were replaced with compatible overrides; final typecheck and production build pass.
