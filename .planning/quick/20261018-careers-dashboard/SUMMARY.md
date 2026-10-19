# Careers & full HR dashboard — complete locally

## Delivered

- `/careers` and `/careers/[slug]` follow the existing Partt typography, palette, marks, and footer. No invented vacancies remain.
- `/hr` has authenticated staff access, branded overview counts, job creation/editing/publishing/closure, applicant search/filter/review statuses, assignment, internal notes, private PDF download, CSV export, and administrator-managed staff accounts.
- Payload 3.91 uses private persistent SQLite and CV storage, server sessions, lockout, administrator/HR access controls, and no public registration. The empty-database first-register bypass is guarded by a server-only bootstrap hook.
- Public submissions validate bounded multipart bodies, PDFs up to 5 MB, fields/URLs, consent, job availability, duplicates, and throttling. Private API/download responses use no-store; CVs download as attachments.
- Updated footer Careers link, sitemap/robots, recruitment privacy/terms and staff-cookie notice. Separate public/CMS roots preserve public URLs. Global unmatched URLs reuse the existing branded 404 through Next's documented global-not-found convention.
- Included initial production migration, idempotent owner setup, private credential file, local password recovery, and operating/deployment guide: `docs/hr-dashboard.md`.

## Verification

- 35 actual HTTP integration checks pass: `integration-results.json`.
- Fresh production migration, denied untrusted first-user creation on an empty database, and privileged bootstrap pass: `bootstrap-results.json`.
- Browser sign-in, job creation/publishing, PDF application submission/success, applicant review status/notes save/reload, actual CSV download, logout/password-help, private PDF retrieval after server restart, and public link navigation pass.
- Careers/job/HR desktop and phone views checked; no horizontal overflow, including public Careers at 320px. Existing pages `/`, `/about`, `/services`, `/work`, `/work/levo`, `/contact`, and all policies return 200. Custom missing-page UI returns 404. Final browser console: zero errors/warnings.
- Impeccable detector: zero findings after removing an unnecessary side accent. Screenshots are in this folder.
- `npm run typecheck` passes. Final `NEXT_BUILD_DIR=.next-build npm run build` passes with no warnings; active dev output was preserved. File traces do not include private `.local` or `.env.local` data.
- A screenshot taken before form hydration initially caused Playwright's temporary caret styles to appear in a hydration warning. Clean navigation after hydration, with screenshots preserving the caret, is clean. No hydration warnings were suppressed.
- Owner setup rerun preserves credentials and exits normally while the dev server runs. CLI tools disable Payload's development HMR connection so they do not stay attached to the server.
- All temporary roles/applications and their CVs were deleted; live recruitment store contains no fixtures. The isolated production verification database was removed with explicit file paths. No real business records were deleted.
- Dependency audit: 0 high/critical, 5 moderate transitive schema-tooling advisories; see guide and `dependency-audit.json`.

## Access & remaining operations

- Server running: http://localhost:3000 (Next dev, exec session 21289).
- Public: http://localhost:3000/careers. HR: http://localhost:3000/hr.
- Initial owner credentials remain only in gitignored `.local/hr-access.txt`; change the password after login.
- No deployment, external services, LinkedIn API sync, or emails were sent. Applications save to the dashboard. SMTP notifications/recovery are not configured.
- Owner still chooses persistent hosting, processing/provider details, and applicant retention. These are documented, not invented. Public policy drafts still need those details before publication.
- No commits made. Earlier website/content/image edits are preserved. Five-hour allowance information was unavailable; no percentage was inferred.
