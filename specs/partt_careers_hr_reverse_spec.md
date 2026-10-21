# Careers and HR: extracted feature specification

Archive status, 19 October 2026: Careers and HR have been removed from the active Partt website. This specification describes the preserved module in [the source archive](../exports/careers-hr.zip) for reuse in another system.

Extracted on 19 October 2026 from the current working tree of `partt-nextjs`, branch `main`. This describes the implemented recruitment module, including uncommitted source. It is not a specification for a general employee-management system.

Use this document to rebuild the behavior in any stack. For the original Next.js/Payload source and integration steps, see [the porting guide](../docs/careers-hr-porting-guide.md) and `exports/careers-hr.zip`.

## 1. Scope and actors

| Actor | Implemented capabilities |
|---|---|
| Visitor / candidate | Browse open roles, read details, submit a PDF CV with contact details and consent. No candidate account is required. |
| HR user | Manage roles and applications, review CVs, change application status, record notes, use assignment, export applications, and edit their own account. |
| Administrator | All recruitment capabilities plus staff-account creation, role management, password administration, and deletion of other staff accounts. |
| Server operator | Initialize private storage and the first administrator, apply migrations, recover passwords, and manage backups. |

All HR users can access all applications. Assignment is organizational metadata, not an access boundary. Staff accounts represent recruiters, not the company's employee directory. There is no tenant/company separation.

Evidence: [access helpers](../src/cms/access.ts), [staff collection](../src/cms/Staff.ts), [applications collection](../src/cms/Applications.ts).

## 2. Architecture and source map

The installed app uses Next.js 16.4.0, React 19, TypeScript, Payload 3.91.0, the Payload SQLite adapter, and Zod. `package.json` permits Next `^16.0.0`; the included lockfile records the extracted dependency graph. The database defaults to a private SQLite file; CVs are private filesystem uploads. No external ATS is called.

| Source | Responsibility |
|---|---|
| `payload.config.ts` | Collections, database, `/hr`, `/api/cms`, origin allowlists, upload size, disabled mail adapter, generated types. |
| `src/cms/Staff.ts`, `access.ts` | Authentication, administrator/HR authorization, trusted bootstrap, administrator preservation. |
| `src/cms/Jobs.ts` | Vacancy fields, publication state, public read filter, first-published timestamp, deletion guard. |
| `src/cms/Applications.ts` | Applicant fields, workflow metadata, private PDF storage, consent, uniqueness, open-role hook. |
| `src/lib/careers/` | Public queries, labels, private-storage settings, validation, multipart bounds, in-process throttling. |
| `src/app/(site)/careers/` | Dynamic listing/detail routes and metadata. |
| `src/views/CareersView.tsx`, `JobView.tsx` | Candidate-facing pages. |
| `src/components/careers/ApplicationForm.tsx` | Client form, upload check, request lifecycle, accessible result feedback. |
| `src/app/api/careers/apply/route.ts` | Validated anonymous application creation. |
| `src/app/api/careers/export/route.ts` | Authenticated CSV generation. |
| `src/app/(cms)/` | Payload root layout, dashboard routes, REST integration, generated component map. |
| `src/components/hr/` | Dashboard summary, brand, login note, password-help view. |
| `src/styles/careers.css`, `hr.css` | Public recruitment and custom dashboard styling. |
| `src/migrations/` | Initial schema migration, snapshot, migration registry. |
| `scripts/*careers*`, `create-hr-admin.ts`, `reset-hr-password.ts` | Setup, recovery, fixture verification, cleanup. |

Public page reads query only open jobs with access controls enabled. Submission validates the request, confirms that the job is public/open, checks duplicates, and creates one private application with its PDF. Payload's collection hook rechecks the role and consent. Staff authentication then permits application review and download. Public pages and HR have separate root layouts.

Evidence: [configuration](../payload.config.ts), [queries](../src/lib/careers/queries.ts), [submission](../src/app/api/careers/apply/route.ts), [CMS layout](../src/app/(cms)/layout.tsx).

## 3. Public Careers features

These are observed requirements, written as behavior to preserve.

| ID | Requirement | Evidence |
|---|---|---|
| CAR-01 | The system shall serve a public Careers page at `/careers`, with an introduction, openings anchor, role count, role links, and site footer. | `CareersView.tsx` |
| CAR-02 | When a visitor requests Careers, the system shall list only jobs whose status is `open`, newest first by `publishedAt`. | `queries.ts` |
| CAR-03 | For each listing, the system shall display title, optional department, location, employment type, and workplace arrangement. | `CareersView.tsx` |
| CAR-04 | While no roles are open, the system shall display an explicit empty state and a contact email. | `CareersView.tsx` |
| CAR-05 | When a visitor opens `/careers/{slug}`, the system shall display an open role's summary, responsibilities, requirements, metadata, back link, and application form. | `JobView.tsx` |
| CAR-06 | When a role does not exist or is draft/closed, the public detail route shall return the site's not-found behavior. | `careers/[slug]/page.tsx` |
| CAR-07 | The role page shall turn nonempty responsibility/requirement lines into bullet items, trimming whitespace and leading dash/bullet markers. | `JobView.tsx` |
| CAR-08 | When HR saves an open role or closes it, the next public request shall reflect the current database state without a website rebuild. | `force-dynamic` route exports, `queries.ts` |
| CAR-09 | The system shall generate page titles, descriptions, canonical/share metadata, and sitemap entries for open roles. Closed roles shall be omitted from the dynamic sitemap. | Public route wrappers, `seo.ts`, `sitemap.ts` |
| CAR-10 | The website footer shall link to Careers and the privacy/cookie/terms pages. The robots file shall exclude `/hr` and `/api/`. | `Closing.tsx`, `robots.ts` |

The public list has no candidate search box, department/location filters, pagination, saved jobs, or job alerts. It shows all open roles. Job pages have ordinary share metadata; there is no job-specific `JobPosting` structured-data implementation.

Evidence: [listing](../src/views/CareersView.tsx), [detail](../src/views/JobView.tsx), [public routes](../src/app/(site)/careers/page.tsx), [role route](../src/app/(site)/careers/[slug]/page.tsx), [sitemap](../src/app/sitemap.ts).

## 4. Candidate application features

### Form and record contract

| Multipart field | Required | Implemented rule |
|---|---|---|
| `job` | Yes | Coerced to a positive integer. Hidden form value; the server verifies job availability. |
| `fullName` | Yes | Trimmed, 2–120 characters. |
| `email` | Yes | Valid email, maximum 254 characters, lowercased before persistence. The public schema does not explicitly trim email. |
| `phone` | No | Empty string accepted; trimmed, maximum 40 characters. |
| `portfolioUrl` | No | Empty string or an HTTP/HTTPS URL, maximum 500 characters. Label accepts a portfolio or LinkedIn profile URL. |
| `coverNote` | No | Empty string accepted; trimmed, maximum 4,000 characters. |
| `cv` | Yes | One nonempty PDF, maximum 5,242,880 bytes; label says 5 MB. |
| `privacyConsent` | Yes | Must be the form value `on`. The saved value is server-set `true`. |
| `companyWebsite` | Must be empty | Hidden honeypot; a nonempty value rejects the request. |

The current schema expects the three optional text controls to be present as strings, even if empty. A custom client should send `phone`, `portfolioUrl`, and `coverNote` as empty strings when omitted by the candidate.

| ID | Requirement | Evidence |
|---|---|---|
| APP-01 | The system shall let a candidate apply without signing in. | `ApplicationForm.tsx`, apply route |
| APP-02 | When submitting, the form shall disable its controls, show a sending label, and prevent a second in-flight submission. | `ApplicationForm.tsx` |
| APP-03 | Before upload, the form shall reject an absent, empty, oversized, or non-PDF file and focus the CV input. | `ApplicationForm.tsx` |
| APP-04 | The server shall validate the form independently of client controls, reject unsafe URL schemes, and bound multipart parsing. | `validation.ts` |
| APP-05 | The server shall check PDF MIME type, `%PDF-` signature, and a `%%EOF` marker within the last 1,024 bytes. | `validateCV` |
| APP-06 | When a role is unavailable/closed, submission shall fail with HTTP 410, including a collection-level create check. | Apply route, `Applications.ts` |
| APP-07 | When the same lowercased email has already applied to the same role, the system shall reject the duplicate with HTTP 409. A unique database index shall also enforce the pair. | Apply route, collection index |
| APP-08 | On a successful public submission, the system shall set status `new`, record consent time and policy version, and store the CV with a generated UUID filename. | Apply route |
| APP-09 | Only after the record/upload creation completes shall the API return HTTP 201 with `{ "ok": true }`; it shall not return the applicant record. | Apply route |
| APP-10 | On success, the form shall reset and display a confirmation with the role title and a link back to openings. On failure, it shall display the returned error or connection message. | `ApplicationForm.tsx` |
| APP-11 | The form shall provide explicit labels, native required/length/type checks, autocomplete hints, a file hint, a consent/privacy link, live status feedback, and focus management. | `ApplicationForm.tsx` |

Candidates cannot view their saved application, edit it through a portal, withdraw it themselves, or see pipeline status. The contact email is the manual correction/withdrawal channel. A different role accepts the same email. Reapplication to the same role remains blocked while the original record exists, including after rejection or closure.

The PDF checks are format checks, not antivirus scanning or full PDF parsing. Optional field validation and request throttles below apply to the public submit endpoint; staff collection CRUD does not call that entire public validation path.

Evidence: [form](../src/components/careers/ApplicationForm.tsx), [validation](../src/lib/careers/validation.ts), [submission](../src/app/api/careers/apply/route.ts), [application rules](../src/cms/Applications.ts).

### Submission errors

Every custom submit response sets `Cache-Control: no-store` and uses JSON.

| HTTP | Condition | Shape |
|---|---|---|
| 201 | Record and CV creation succeeded | `{ "ok": true }` |
| 400 | Invalid fields/consent/file, filled honeypot, malformed multipart, or mapped collection validation error | `{ "error": "human-readable message" }` |
| 403 | Supplied Origin differs from configured website origin | Same error shape |
| 409 | Duplicate application or mapped uniqueness error | Same error shape |
| 410 | Role unavailable or no longer accepting applications | Same error shape |
| 413 | Multipart request exceeds the configured parsing bound | Same error shape |
| 429 | Network/process or email throttle reached | Same error shape; wait 15 minutes |
| 500 | Other save failure | Generic retry/contact message; server logs only the error name |

An oversize CV may produce 400 when the parsed file exceeds the CV limit, or 413 when the whole request exceeds the multipart bound.

## 5. HR dashboard features

| ID | Requirement | Evidence |
|---|---|---|
| HR-01 | The system shall provide a protected staff interface at `/hr`, with branded login, a dashboard, Job openings, Applications, HR users, and account controls. | `payload.config.ts`, `(cms)`, collections |
| HR-02 | The overview shall display counts of open roles, new applications, and all applications. | `HROverview.tsx` |
| HR-03 | The overview shall show the latest five applications, newest first, linking each to its record with job title and status. | `HROverview.tsx` |
| HR-04 | The overview shall provide Create an opening, new-applicant filter, public Careers, and CSV actions, plus an empty state and workflow guidance. | `HROverview.tsx` |
| HR-05 | Staff shall be able to create, edit, open, close, reopen, and delete eligible job records through Payload's collection UI. | `Jobs.ts` |
| HR-06 | For an open job, Preview shall expose its public role URL for manual sharing, including on LinkedIn. Draft/closed roles shall not have a public preview URL. | `Jobs.ts` |
| HR-07 | Staff shall be able to use Payload's application list/search/filter/sort UI, with default columns name, job, status, email, and creation time. | `Applications.ts`, Payload UI |
| HR-08 | Staff shall be able to read applicant details, download the CV, set status, use a staff assignment relation, and save internal notes. | `Applications.ts` |
| HR-09 | While a job has applications, deleting it shall fail with a message directing staff to close it instead. | `Jobs.ts` before-delete hook |
| HR-10 | Closing a job shall preserve its applications and CVs. Deleting an application shall use Payload's associated-upload deletion behavior. | Collections and Payload upload lifecycle |
| HR-11 | Authenticated staff shall be able to export all applications as a downloadable CSV. Anonymous export shall return 401. | Export route |
| HR-12 | Only administrators shall create staff accounts, change roles, or delete other staff accounts. An HR user shall read/update only their own staff record. | `Staff.ts` |

The original list/search experience is provided by Payload, rather than a custom ATS table or Kanban board. Name is the application title field; email, job, and status are stored fields that can be filtered. There is no custom cross-field search configuration in the collection.

Assignment caveat: the relation targets `staff`, while HR users can read only their own staff record. Administrators can access the team directory; regular HR relationship choices/display may be limited by staff read access. Do not assume an unrestricted team picker for regular HR or add one without deciding the target project's permission policy.

Evidence: [overview](../src/components/hr/HROverview.tsx), [jobs](../src/cms/Jobs.ts), [applications](../src/cms/Applications.ts), [staff](../src/cms/Staff.ts), [CSV](../src/app/api/careers/export/route.ts).

### Job and application lifecycles

Job statuses are `draft` (default), `open`, and `closed`. HR selects any allowed status; no transition graph is enforced. The first save with `status: open` sets `publishedAt` if the previous record has none. Reopening retains the previous first-published date, which affects list order. Only open jobs are publicly readable.

Application statuses are `new` (default), `reviewing`, `shortlisted`, `interview`, `hired`, and `rejected`. The intended order is a human workflow; the software allows any allowed status to be selected directly, including reversal. Selecting Interview does not schedule anything. Selecting Hired does not create an employee. Selecting Rejected does not send an email or delete data.

### CSV contract

Columns, in order: `Name`, `Email`, `Phone`, `Job`, `Status`, `Portfolio`, `Applied at`.

The export traverses all application pages in batches of 100, newest first, resolving the related job's title. It exports every application accessible to the staff user, irrespective of the current dashboard filters. It omits CV files, internal notes, assignment, and consent fields. Cells are quoted, quotes are doubled, formula-like leading characters are prefixed with an apostrophe, rows use CRLF, and the response includes a UTF-8 BOM. Default filename: `partt-applications.csv`.

The response sets a private/no-store cache policy, attachment disposition, and `nosniff`. CSV content is accumulated in memory rather than streamed.

## 6. Data model

Payload adds IDs, creation/update timestamps, auth/session fields, upload metadata, and CMS supporting tables. The following tables describe the domain fields.

### Staff (`staff`)

| Field | Type | Rules |
|---|---|---|
| `id` | Integer ID | Generated by SQLite adapter. |
| `name` | Text | Required, maximum 120. |
| `email` | Auth email | Managed by Payload; unique database index. |
| `password` | Auth input | Handled by Payload; stored as authentication hash/salt, not a domain plaintext field. |
| `role` | Enum | `admin` or `hr`; required, default `hr`, saved to JWT; only admin may update it. |
| `sessions` | Auth session records | Server-side sessions used for token validation and revocation. |

An administrator cannot delete their own account. Demoting the only administrator is rejected. Public collection creation is denied, and a hook also blocks first-register bypasses on an empty database unless a trusted server call supplies `context.bootstrapStaff: true` and there are zero staff.

### Job (`jobs`)

| Field | Type | Rules/default |
|---|---|---|
| `title` | Text | Required; maximum 140. |
| `slug` | Text | Required, unique, indexed; maximum 100; lowercase letters/numbers separated by single hyphens. Entered manually. |
| `status` | Enum | Required; `draft`, `open`, `closed`; default `draft`; indexed. |
| `department` | Text | Optional; maximum 100. |
| `location` | Text | Required; maximum 140; default `Amman, Jordan`. |
| `employmentType` | Enum | Required; `full-time`, `part-time`, `contract`, `internship`; default `full-time`. |
| `workplace` | Enum | Required; `on-site`, `hybrid`, `remote`; default `on-site`. |
| `summary` | Textarea | Required; maximum 2,000. |
| `responsibilities` | Textarea | Required; maximum 8,000; one item per line. |
| `requirements` | Textarea | Required; maximum 8,000; one item per line. |
| `publishedAt` | Date | Set by first-open hook; displayed read-only in admin UI. |
| `createdAt`, `updatedAt` | Timestamps | Generated. |

### Application (`applications`, also upload collection)

| Field | Type | Rules/default |
|---|---|---|
| `fullName` | Text | Required; maximum 120. Public endpoint additionally enforces minimum 2. |
| `email` | Email | Required; trimmed/lowercased by collection hook; unique together with job. |
| `phone` | Text | Optional; maximum 40. |
| `job` | Relation to `jobs` | Required, indexed; must be open at application creation. |
| `portfolioUrl` | Text | Optional; maximum 500; HTTP/HTTPS only. |
| `coverNote` | Textarea | Optional; maximum 4,000; labelled Applicant message. |
| `status` | Enum | Required; six statuses above; default `new`; indexed. |
| `assignedTo` | Relation to `staff` | Optional; no applicant visibility restriction follows from this field. |
| `internalNotes` | Textarea | Optional; maximum 10,000; staff-only because the collection is private. |
| `privacyConsent` | Checkbox | Required; checked true at creation. Admin UI marks it read-only. |
| `consentedAt` | Date | Required; generated by public endpoint; read-only in admin UI. |
| `privacyPolicyVersion` | Text | Required; copied from policy date; read-only in admin UI. |
| `filename`, `mimeType`, `filesize`, `url`, etc. | Upload metadata | Managed by Payload. UUID filename on public submissions. |
| `createdAt`, `updatedAt` | Timestamps | Generated. |

The application itself owns its CV upload; there is no separate CV domain collection. One application relates to one job and at most one assignee. A job can have many applications. A staff account can be assigned many applications.

Read-only admin fields are a UI setting, not a separately implemented immutable audit trail. There is no domain event log, version history, retention deadline field, or automated data-erasure job.

Evidence: [Staff](../src/cms/Staff.ts), [Jobs](../src/cms/Jobs.ts), [Applications](../src/cms/Applications.ts), [generated types](../src/payload-types.ts), [migration](../src/migrations/20261018_104955_initial_careers.ts).

## 7. Routes and API surface

### Pages

| Path | Access | Purpose |
|---|---|---|
| `/careers` | Public | Open-role listing. |
| `/careers/{slug}` | Public, open role only | Detail and application form. |
| `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions` | Public | Existing notices include recruitment and staff sessions. |
| `/hr` | Staff | Dashboard. Anonymous requests may receive an HTML shell that navigates to login. |
| `/hr/login` | Public entry | Staff login. |
| `/hr/account` | Staff | Own account. |
| `/hr/forgot` | Public entry | Administrator-assisted password-help view. |
| `/hr/collections/jobs`, `/create`, `/{id}` | Staff | Job lists and record editing. |
| `/hr/collections/applications`, `/{id}` | Staff | Application list and review. |
| `/hr/collections/staff`, `/create`, `/{id}` | Subject to staff access rules | Staff account administration. |

Collection suffixes above are relative to the indicated collection path, for example `/hr/collections/jobs/create`.

### Custom endpoints

| Method and path | Access | Behavior |
|---|---|---|
| `POST /api/careers/apply` | Public, validated | Multipart contract and status codes in section 4. |
| `GET /api/careers/export` | Staff | CSV contract in section 5; anonymous JSON error, HTTP 401. |

### Payload REST endpoints

The catch-all at `src/app/(cms)/api/cms/[...slug]/route.ts` delegates GET, POST, DELETE, PATCH, PUT, and OPTIONS to Payload and adds `Cache-Control: private, no-store`. Payload controls supported operations and response envelopes per endpoint; exporting a method does not make every operation valid on every path.

| Endpoint family | Operations and access |
|---|---|
| `/api/cms/jobs`, `/api/cms/jobs/{id}` | List/read open jobs publicly; staff can read every status and perform collection CRUD. |
| `/api/cms/applications`, `/api/cms/applications/{id}` | Staff-only collection CRUD, including applicant fields and attached CV metadata. Anonymous collection listing returns 403 in current checks. |
| `/api/cms/applications/file/{filename}` | Staff-only private PDF delivery, attachment and no-store headers. |
| `/api/cms/staff`, `/api/cms/staff/{id}` | Admin creates; admins read/update all; HR reads/updates self; admins delete other staff. |
| `/api/cms/staff/login` | POST email/password; Payload response includes user and auth token; sets staff cookie. |
| `/api/cms/staff/me` | GET current authenticated user, or no authenticated user. |
| `/api/cms/staff/logout` | POST sign-out and session revocation. |
| `/api/cms/staff/refresh-token` | Payload session/token refresh. |
| `/api/cms/staff/first-register` | Public first-user creation blocked by hook, including an empty database. |
| `/api/cms/staff/forgot-password`, `/reset-password`, `/unlock`, `/init`, `/verify/{id}` | Framework auth handlers exist; this app adds no custom email-recovery workflow or email verification feature. Mail delivery is deliberately disabled. |
| `/api/cms/access` and CMS support endpoints | Payload access/UI infrastructure, preferences and document locks. They are framework services rather than additional recruitment features. |

Payload REST supports query filters such as `where[status][equals]=new`, pagination (`limit`, `page`), relationship depth, and sorting. JSON create/update envelopes are framework-provided, commonly `{ doc, message }`; find results contain `docs`, pagination information, and `totalDocs`.

Cookie-authenticated non-browser clients must send an allowed `Origin` or appropriate `Sec-Fetch-Site` context. With configured CSRF origins, the installed Payload version rejects cookie authentication from requests missing both headers. `Authorization: JWT <token>` is also accepted by its auth strategy. This matters for ported HTTP tests and integrations.

GraphQL is disabled in `payload.config.ts`; no GraphQL route is part of this extraction.

## 8. Security and operational behavior

| Area | Observed implementation |
|---|---|
| Staff authentication | Payload email/password auth; server sessions; 8-hour token expiration. |
| Login lockout | Five failed attempts, 15-minute lock duration. |
| Cookies | Payload HttpOnly cookie; SameSite=Lax; Secure in production. |
| Origins | CMS CORS and CSRF allow the configured site origin. Public apply rejects a supplied nonmatching Origin; absent Origin is not categorically rejected by that endpoint. |
| Application reads | Public application/file access denied; staff-only CRUD. Local privileged server calls deliberately use access overrides only where necessary. |
| Upload handling | Nonempty PDF up to 5 MiB; bounded body at 5 MiB + 64 KiB (5,308,416 bytes); header and streamed byte-count checks; generated public-submission filename. |
| Upload delivery | Outside `public`; authenticated attachment response with private/no-store and `nosniff`; no inline document preview. Bulk uploads and paste-from-URL disabled. |
| Throttling | In-process 15-minute buckets: 8 validated-file attempts per hashed email; 120 process/network attempts when proxy trust is off; 20 per forwarded client IP when explicitly on. Rejected attempts can consume quotas. |
| Limiter bounds | Expired entries removed on calls; new keys refused after the map exceeds 10,000 entries. Restart clears limits. Multiple processes do not share state. |
| Proxy trust | `X-Forwarded-For` used only with `TRUST_PROXY=true`; first forwarded address used. Host must replace untrusted incoming headers. |
| Duplicate handling | Friendly precheck plus unique `(job,email)` database index; mapped race errors become 409. |
| Rendering | Plain React text for vacancy/applicant content; no applicant-supplied HTML rendering. |
| CSV | Formula-prefix mitigation, quoted cells, private attachment. |
| Secret/data location | `.env.local`, `.local/`, or explicitly configured private storage; build tracing excludes local private data/environment files. |
| Mail | Adapter throws instead of sending or logging reset tokens. No application notifications or acknowledgments by email. |
| Retention | Manual deletion; closing/rejecting preserves records. Backups and downloaded exports require separate handling. |

Defaults support a single persistent Node server. The database path is `<CAREERS_DATA_DIR>/careers.db`, with CVs under `<CAREERS_DATA_DIR>/cvs`. Optional `DATABASE_URI`/`DATABASE_AUTH_TOKEN` change SQLite/libSQL database connectivity, not file storage. The SQLite adapter has a 5,000 ms busy timeout. There is no configured private object-storage adapter, distributed throttle, scheduled job, or queue.

Public layout styling uses the host website's fonts/tokens/shared form classes. Career layouts stack below 820 px; custom HR overview adjustments apply below 700 px. Reduced-motion handling removes the role-link arrow transition. Prior responsive/browser evidence exists; this extraction's current checks are HTTP/source checks, not a new full browser audit.

Evidence: [staff auth](../src/cms/Staff.ts), [settings](../src/lib/careers/settings.ts), [validation/throttle](../src/lib/careers/validation.ts), [upload access](../src/cms/Applications.ts), [configuration](../payload.config.ts), [Next settings](../next.config.ts), [operations guide](../docs/hr-dashboard.md).

## 9. Setup and recovery features

- `npm run hr:setup` creates local directories, adds a random secret only when absent, and creates the first administrator only when there are no staff. The initial credentials are written to a private local file. Rerunning does not replace an existing account/password.
- `HR_ADMIN_EMAIL` and `HR_ADMIN_PASSWORD` optionally override first-user defaults. The default email/name are Partt-specific; they must be adapted in another project.
- `npm run hr:reset -- <email>` performs local/server-side recovery, generates a replacement password, clears sessions and lockout, and writes recovery details privately. It does not email the user.
- `hr:migrate`, `hr:migrate:create`, `hr:types`, and `hr:importmap` operate the Payload schema, generated types, and custom component map.
- The initial migration creates recruitment/auth tables and Payload supporting tables. Its down migration drops those tables. It is not an incremental migration for a preexisting Payload installation.

Evidence: [initializer](../scripts/init-careers.mjs), [bootstrap](../scripts/create-hr-admin.ts), [recovery](../scripts/reset-hr-password.ts), [scripts](../package.json), [migration registry](../src/migrations/index.ts).

## 10. Missing features and open decisions

These are not implemented and must not be represented as existing capabilities:

- Employee profiles, payroll, attendance, leave, benefits, expenses, performance reviews, onboarding, or offboarding.
- Candidate login, status tracking, self-service edits, talent pool/general applications, saved jobs, or alerts.
- LinkedIn job synchronization, Easy Apply import, CV parsing, AI ranking, matching, or automated screening.
- Interview/calendar scheduling, offer letters, e-signatures, email templates, candidate notifications, or SMTP password recovery.
- Enforced sequential pipeline transitions, per-stage automations, custom analytics/funnels, a Kanban board, or a domain audit trail.
- Multi-company isolation, per-assignee access control, SSO, or a custom MFA flow.
- Configured antivirus scanning, automated retention/deletion, remote private file storage, or shared throttling.
- Role salary ranges, closing dates, headcount, hiring manager, approval workflow, or `JobPosting` structured data.

The target project, technology stack, branding, staff identities, domain, storage host, mail provider, data-retention policy, and permission changes are not provided. This extraction does not select or configure them. Existing policy text is Partt/Jordan-specific source material, not ready-made policy for another organization.

## 11. Acceptance checklist for a rebuild

The following criteria are derived from the observed implementation. Run them in the target project with isolated fixtures.

1. Given a draft role, anonymous listing/detail/API reads do not expose it; publishing makes it visible without a rebuild.
2. Given open roles, the list shows required metadata and first-publication ordering; with none, it displays an explicit empty state.
3. Given an open role and valid fields/PDF/consent, submission returns 201, creates one private record/CV, and records status, consent time, and policy version.
4. Invalid fields, missing consent, honeypot values, wrong origin, disguised/truncated/oversized files, and malformed bodies fail without creating a successful application.
5. Repeating the same role/email, including a case variant or concurrent request, cannot create a second record; a different role may accept it.
6. Closing a role removes its public detail/listing/sitemap entry and makes a new submission return 410, while preserving existing records.
7. Anonymous requests cannot read applications, CVs, or CSV exports, create jobs/staff, or exploit empty-database first-register.
8. Staff can review details, download private PDF attachments, change status, save notes, and use assignment within staff-read permissions.
9. Admins can manage staff; regular HR cannot create staff, promote their own role, or read another user's staff profile. The last admin cannot be demoted; self-deletion is blocked.
10. Staff login/session expiry/lockout/logout behave as configured. A signed-out session loses application access. Server recovery revokes prior sessions.
11. CSV export contains the stated columns and all accessible applications, with escaping, formula mitigation, and private attachment headers.
12. Deleting a role with applications fails. Deleting a test application removes its associated private CV through the configured upload lifecycle.
13. Database and CVs survive server restart; deployment builds do not contain runtime secrets or private records.
14. Mobile pages and the form remain usable, errors/success are announced, keyboard focus is visible, and reduced-motion behavior remains usable.

## 12. Evidence and confidence

Source review covered 34 feature files and 40 supporting references. All resolved local import targets are included. The source manifest records dependency edges and exact extracted bytes with SHA-256 hashes. Supporting website files were refreshed after external edits during extraction; recruitment feature files were unchanged from the initial scan.

On 19 October 2026, 15 current HTTP checks passed against the running local app: public open-role access, candidate-data denial, staff login/session recognition, dashboard actions, authorized applicant/CSV access, private caching, robots rules, and logout revocation. No jobs, applications, or CVs were created, changed, or deleted for this inspection. Existing records were not copied into the export.

The earlier implementation evidence dated 18 October reports 35 full lifecycle HTTP checks plus browser/persistence/production-bootstrap checks. Those are historical results, not newly rerun for this extraction. The extraction avoids the mutation-based fixture scripts against the current recruiting store.

Destination-project installation, deployment, and browser acceptance remain unverified because no destination project was supplied. The archive is an integration kit with original source and host references, not a standalone published package.
