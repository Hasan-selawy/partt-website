# Porting the Careers and HR module

This guide accompanies [the complete feature specification](../specs/partt_careers_hr_reverse_spec.md) and [the source archive](../exports/careers-hr.zip). Careers and HR were removed from Partt on 19 October 2026. All source paths and implementation details below describe the archived module for reuse in another project, not the active Partt website. Start with `ARCHIVE-README.md` and `SOURCE-MANIFEST.json` inside the ZIP for its current inventory.

## What is in the ZIP

- `README.md`: export overview and entry points.
- `specs/partt_careers_hr_reverse_spec.md`: public Careers, candidate submissions, HR operations, fields, permissions, API contracts, limits, missing features, and acceptance checklist.
- `docs/careers-hr-porting-guide.md`: this guide.
- `SOURCE-MANIFEST.json`: original source paths, categories, byte lengths, SHA-256 hashes, and local dependency edges.
- Original files at their original relative paths: 34 feature files and 40 host/integration references. Their bytes are unchanged.
- `evidence/`: the current non-sensitive HTTP-check report and selected historical verification results, clearly dated.

No `.env.local`, passwords, session tokens, private-access files, database files, CV uploads, applicant records, screenshots containing staff/applicant information, `node_modules`, or build output are included. `.env.example` has blank/example configuration only. Source references to private paths explain the implementation; the private files themselves are absent.

The ZIP is an integration kit. It deliberately includes relevant code from an existing website, not an entire deployable copy of that website. No existing jobs or staff accounts are migrated. Public brand assets/project photos and unrelated website routes are not part of the source kit; replace their references when using host examples.

## Choose the porting approach

| Target | Approach |
|---|---|
| Next.js App Router with Payload, SQLite/libSQL | Reuse the core collections/routes/validation and adapt site integration. This is the closest match. |
| Next.js App Router without Payload | Integrate Payload and its SQLite adapter, or use the spec to rebuild on the target's established auth/database/admin system. |
| Existing Payload app | Merge collections, custom views and endpoints into its configuration. Preserve its auth model, routes, schema/migration history, and collection names deliberately. |
| Another frontend/backend stack | Use the feature spec as the behavior contract. Recreate models, file storage, authentication, endpoints, and screens in the target's existing stack. TSX/Next route files are reference material. |

The destination project was not supplied, so this delivery does not claim compatibility with its dependency versions or perform an installation there.

## 1. Identify the core files

The manifest labels these as `feature-source`:

```text
payload.config.ts
src/cms/                         Staff, Jobs, Applications, access helpers
src/lib/careers/                 settings, queries, validation, labels
src/app/(site)/careers/          public list and slug routes
src/app/api/careers/             apply and CSV endpoints
src/app/(cms)/                  HR root, catch-all page, REST API, import map
src/components/careers/         application form
src/components/hr/              custom overview and brand/help components
src/views/CareersView.tsx
src/views/JobView.tsx
src/styles/careers.css
src/styles/hr.css
src/payload-types.ts             generated; regenerate after merging
src/migrations/                 initial SQLite schema and migration registry
scripts/init-careers.mjs
scripts/create-hr-admin.ts
scripts/reset-hr-password.ts
scripts/verify-careers.mjs
scripts/verify-careers-bootstrap.ts
scripts/cleanup-careers-verification.ts
```

`payload.config.ts`, `importMap.ts`, generated types and migrations are core context, but must be merged/regenerated rather than blindly overwriting equivalents in an existing application.

The `host-reference` files provide all statically resolved local imports plus site integration examples: layout, navigation/footer, page hero, marks, CSS, SEO, policies, sitemap/robots, config, dependency manifests, and the existing operating guide. Many are needed only if keeping the original Partt presentation.

## 2. Merge dependencies and configuration

The extracted project uses these dependency declarations:

```json
{
  "dependencies": {
    "@payloadcms/db-sqlite": "3.91.0",
    "@payloadcms/next": "3.91.0",
    "graphql": "16.11.0",
    "next": "^16.0.0",
    "payload": "3.91.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "zod": "4.4.0"
  },
  "devDependencies": {
    "sass": "^1.105.2",
    "tsx": "^4.23.15"
  },
  "overrides": {
    "@payloadcms/next": { "sass": "$sass" },
    "monaco-editor": { "dompurify": "3.4.17" }
  }
}
```

Next 16.4.0 is installed in the source checkout. Node's declared minimum is 20.19.0; the original implementation was verified on Node 24. `graphql` remains a Payload dependency even though application GraphQL access is disabled. The included `package.json` also provides the full TypeScript tooling declarations, and the lockfile records the exact extracted resolution. These versions describe this source snapshot, not a claim about the latest compatible versions for another project.

Merge the needed entries into the target package manifest. Preserve its unrelated dependencies and lockfile; resolve/install in the target rather than replacing an established lockfile with this website's.

Merge the following TypeScript aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./payload.config.ts"]
    }
  }
}
```

Wrap the target Next configuration with `withPayload` as shown in `next.config.ts`. Preserve target config. Bring over the relevant security headers and private-data tracing exclusions, adjusting for the chosen storage location. If private data lives elsewhere inside the project, exclude that directory too. The extracted image settings and work-photo cache rules belong to the Partt website and are not recruitment requirements.

Before changing Next integration, read the destination's installed `node_modules/next/dist/docs/` for route handlers, route groups, async route parameters, and root layouts. This checkout's instructions specifically require its installed documentation.

## 3. Integrate layouts and routes

The original app has separate public and CMS root layouts:

```text
src/app/
  (site)/
    layout.tsx
    careers/page.tsx
    careers/[slug]/page.tsx
  (cms)/
    layout.tsx
    hr/[[...segments]]/page.tsx
    hr/importMap.ts
    api/cms/[...slug]/route.ts
  api/careers/apply/route.ts
  api/careers/export/route.ts
```

Route-group parentheses do not appear in public URLs. Preserve the target's existing public URLs and avoid duplicate routes across groups. Plan the root-layout boundary before copying `(cms)`: the public site's shell/CSS should not wrap Payload's own root layout. If the target already has a top-level root layout, restructure or integrate according to its installed Next/Payload setup instead of nesting two independent document roots.

Copy/adapt the core route files. If the target uses `app/` without `src/`, update aliases, imports, component registrations, migration paths and generated import-map location consistently. Keep the apply/export runtime as Node; this implementation uses filesystem storage, Buffers, crypto, and SQLite.

The sample global-not-found/404 files are host references. The original enables `experimental.globalNotFound`; adopt that only if the target needs and supports the same layout arrangement.

## 4. Rebrand and replace host dependencies

| Source coupling | Action in target |
|---|---|
| `CareersView` imports `PageHero` and `Closing` | Use the target's page hero/footer, or copy the referenced components and dependencies. |
| `JobView` imports `Closing` | Use target footer and retain the role/application content. |
| Careers route wrappers import `pageMeta` | Use target SEO helper or adapt the included `seo.ts`. |
| `HRBrand` imports `src/content/mark.ts` | Replace the Partt logo/icon with target branding; update Payload component registrations. |
| Apply endpoint imports `policyUpdated` from `content/policies.ts` | Supply the target's current privacy-policy version; it can be a small dedicated constant. The entire Partt policy/motion module is not required for this value. |
| `careers.css` uses host tokens/shared classes | Supply target tokens, typography, button, form, field, status, and visually hidden/honeypot styles. |
| Source sitemap imports `content/projects.ts` | Merge only careers/open-role entries into the target sitemap; unrelated portfolio data is host context. |
| Source site shell has About/Work/Services/Contact links | Replace these with actual target routes. |

Search for `partt`, `Partt`, `parttagency`, `info@parttagency.com`, `Amman`, and `Jordan` throughout the imported files. Update page copy, login/help copy, consent text, support email/error messages, admin title suffix, CSV filename, setup/recovery labels, default location, site facts and policy notices.

The production origin fallback in `src/lib/careers/settings.ts` is hardcoded to Partt, separately from `src/content/site.ts`. Update both the recruitment origin and the site's metadata/sitemap origin. Set `NEXT_PUBLIC_SERVER_URL` explicitly; it also controls Origin checks, CMS CORS/CSRF and preview URLs.

Shared CSS dependencies include `--ink`, `--paper`, `--red`, `--orange`, `--mute`, `--line`, `--pad`, `--rad`, `--nh`, `.disp`, `.ph*`, `.btn`, `.form`, `.form-grid`, `.fld`, `.wide`, `.opt`, `.hint`, `.trap`, `.form-end`, and `.form-status`. The host CSS files are included as references, but replacing these with the target design is usually less work than importing the agency site's entire styling/motion system.

The supplied logo paths are inline SVG source. `/og.png`, portfolio photos and unrelated public assets are not packaged; use the destination's assets. The core career pages do not need portfolio photos.

## 5. Preserve model rules and permissions

Merge the three collections and access helpers. If the target already has an authenticated users collection, decide whether to reuse it or retain recruitment-specific `staff`. Adjust `admin.user`, relation targets, collection checks, auth routes and role logic together. Preserve an equivalent protected first-user bootstrap if public registration must remain disabled.

Keep these invariants:

1. Anonymous visitors read only open jobs and use the validated apply endpoint; they cannot directly read/create applications or download CVs through CMS APIs.
2. Only staff manage recruitment. Only administrators manage other staff and roles.
3. Initial admin creation uses a trusted server context and an empty-staff check. Public first-register remains blocked.
4. Job slug is unique; `(job,email)` is unique after email normalization.
5. A new application requires an open job and true consent, including direct staff creation paths.
6. The public endpoint sets status/consent metadata itself, uses bounded parsing, and rechecks duplicate/availability conditions.
7. Jobs with applications cannot be deleted; closing preserves recruiting records.
8. CV storage and delivery remain private. API and CSV responses remain non-cacheable where configured.
9. Last-admin demotion and administrator self-deletion remain blocked.

Status progression is manual and unrestricted between valid enum values. Assignment does not restrict application access. Regular HR staff-directory access is self-only; choose deliberately if the target needs broader team assignment choices.

The public form sends optional text controls as empty strings. Preserve that contract or adapt `applicationSchema` when writing a different client. Uploading directly through staff CMS CRUD does not run the public endpoint's full PDF-content/throttle pipeline; consider that distinction when exposing other entry points.

## 6. Configure storage and environment

Create new target secrets and staff accounts. Do not copy the original project's `.env.local`, private access files, database or CV directory.

| Setting | Purpose |
|---|---|
| `PAYLOAD_SECRET` | Required secret; setup generates a random value if absent. Preserve the chosen value across restarts. |
| `NEXT_PUBLIC_SERVER_URL` | Exact target origin, including scheme and port locally; used by auth/origin checks and CMS URLs. Supply before the production build. |
| `CAREERS_DATA_DIR` | Absolute persistent private directory. Local default `.local/careers`. Contains SQLite and `cvs/` by default. |
| `DATABASE_URI` | Optional SQLite/libSQL connection URL. Default is the file in `CAREERS_DATA_DIR`. |
| `DATABASE_AUTH_TOKEN` | Optional remote libSQL token. |
| `TRUST_PROXY` | Default off. Enable only when a trusted proxy replaces incoming forwarded-IP headers. |
| `HR_ADMIN_EMAIL` | Optional first-administrator login identity. Defaults to Partt email until adapted. |
| `HR_ADMIN_PASSWORD` | Optional initial password; otherwise generated. Keep server-only. |
| `NEXT_BUILD_DIR` | Optional source-config build directory override; useful for a separate production check alongside dev. |

Use one persistent Node process and private durable disk for the extracted defaults. SQLite/libSQL remote configuration alone does not make CV files persistent. For a target with ephemeral/serverless/multiple-instance hosting, integrate durable private file storage and shared throttling before treating it as equivalent to this implementation.

Back up the database and CVs consistently and protect those backups. There is no automatic retention scheduler. The target owner must choose record retention and manual deletion procedures, including exported CSV copies. Review the source policy notices against the target's actual organization/providers; they are references, not a legal-policy template to publish unchanged.

## 7. Merge scripts and initialize a fresh development instance

The source `package.json` contains these commands; merge them after adapting paths:

```json
{
  "hr:setup": "node scripts/init-careers.mjs && node --env-file=.env.local --import tsx scripts/create-hr-admin.ts",
  "hr:types": "node --env-file=.env.local node_modules/payload/bin.js generate:types",
  "hr:importmap": "node --env-file=.env.local node_modules/payload/bin.js generate:importmap",
  "hr:reset": "node --env-file=.env.local --import tsx scripts/reset-hr-password.ts",
  "hr:migrate": "node --env-file=.env.local node_modules/payload/bin.js migrate",
  "hr:migrate:create": "node --env-file=.env.local node_modules/payload/bin.js migrate:create"
}
```

In a new development instance with the source-style setup:

```sh
npm install
npm run hr:setup
npm run hr:types
npm run hr:importmap
npm run dev
```

Set the target administrator/origin before bootstrap if using different defaults. The initializer creates `.env.local` if needed; add other settings without replacing its secret. The bootstrap writes initial credentials to `.local/hr-access.txt` and does not change an existing user. Update the login URL and labels written by that script when the destination uses a different local port/path.

After changing collection fields, relations, component locations or auth configuration, regenerate types and the import map. If changing storage/adapter, generate and review the appropriate target migrations.

## 8. Handle migrations separately from copying code

The extracted initial SQLite migration creates staff/auth, jobs, applications, indexes, and Payload infrastructure. Its rollback drops the tables. Do not run it over a populated target database or an existing Payload migration history as an ordinary incremental migration.

For a fresh production database using this source schema, prepare target secrets/origin/storage first, then use `NODE_ENV=production` for the migration/bootstrap/server commands. Apply migrations before bootstrap. The source initializer can generate the secret independently before the full setup command:

```sh
node scripts/init-careers.mjs
# Add target server/storage settings to .env.local, preserving PAYLOAD_SECRET.
# Set NODE_ENV=production in the deployment environment before the next commands.
npm run hr:migrate
npm run hr:setup
npm run hr:types
npm run hr:importmap
npm run build
npm run start
```

For an existing Payload project, keep its migration registry, merge the collections, and generate a new reviewed migration against its schema. For a different database adapter, generate migrations for that adapter. Development schema push is not a substitute for production migration management.

## 9. Verify the destination with isolated fixtures

Use the acceptance checklist in the feature specification. At minimum, verify publish/close behavior, valid/duplicate/invalid submissions, anonymous applicant/file/export denial, staff permissions, first-user registration denial, logout, persistent CV storage, and mobile form usability.

The included original verification scripts are useful references but have source-project assumptions:

- `verify-careers.mjs` targets `http://localhost:3000`, reads the source-style private credential file, writes evidence under `.planning/quick/20261018-careers-dashboard/`, and creates temporary jobs/applications/staff. It leaves its marked role for browser verification.
- `verify-careers-bootstrap.ts` requires the isolated `.local/production-verification` path and an empty migrated database. It also writes to the original evidence directory.
- `cleanup-careers-verification.ts` deletes explicitly marked verification roles/applications and their CVs. It is a mutation tool, not a read-only smoke test.

Adapt the base URL, credential mechanism, output directories and fixture guards before running them. Create the expected output directory if keeping the scripts unchanged. Run them only against a disposable target test store, then verify fixture cleanup. Do not point them at a live recruiting database.

Cookie-based HTTP tests must send the configured Origin or browser-equivalent `Sec-Fetch-Site`. Without either, the installed Payload CSRF handling ignores the cookie. Preserve actual cookie attributes and confirm logout invalidates the session.

For this extraction, 15 current read-only HTTP checks passed; the original 35 lifecycle checks are historical evidence dated 18 October. Current source TypeScript and archive integrity results are recorded in the extraction task summary. No new target-project or deployment tests have been run.

## 10. Implementation prompt for the next project

Use this prompt with the extracted kit in the destination:

> Read `specs/partt_careers_hr_reverse_spec.md`, `docs/careers-hr-porting-guide.md`, and `SOURCE-MANIFEST.json`. Inspect this destination project's framework, auth, database, admin UI, design system, deployment storage and agent instructions. Implement the observed Careers and recruitment HR features using existing project patterns. Preserve open-only public jobs, anonymous validated PDF application submission, consent metadata, per-role/email uniqueness, private CV access, staff/admin permissions, manual statuses/notes/assignment, dashboard counts/recent applications, CSV export, trusted bootstrap/recovery, and persistence. Adapt branding, support contacts, origins, policies and routes. Merge existing config/migrations rather than overwriting them. Treat the extracted source as a reference; do not copy credentials or recruiting data. Do not add employee/payroll, LinkedIn sync, notifications, scheduling or AI screening unless requested. Verify the acceptance checklist using isolated fixtures and report any behavior differences.
