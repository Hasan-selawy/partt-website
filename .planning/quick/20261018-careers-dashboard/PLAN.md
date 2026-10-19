# Careers and HR dashboard

## Approved scope

The user approved the full dashboard on 18 October 2026: HR manages job openings and applicants; candidates apply on the website; HR shares the website's job links on LinkedIn. No LinkedIn API integration or external account creation is included.

## Implementation

1. Integrate Payload's established authentication, admin UI, and access controls with a persistent SQLite database. Separate the public and HR root layouts using Next route groups, preserving public URLs and existing page source.
2. Configure protected staff, job, and application collections. Only authenticated HR can see candidate data or CVs; only administrators manage staff. Public APIs expose only open jobs. Block public staff registration and create the owner through a local bootstrap command.
3. Build branded Careers and job-detail pages, PDF CV application form, validation, consent recording, upload limits, abuse throttling, and closed-role enforcement.
4. Add dashboard counts, application review statuses, internal notes, CSV export, and private downloads. Add footer navigation, sitemap entries, and accurate policy updates.
5. Verify HR login, role lifecycle, application submission/review/download, access denial, file limits, restart persistence, responsive pages, and TypeScript/production build. Remove test records. Document local access and deployment requirements.

## Storage and operational decisions

- Development and single-node hosting use a private data directory outside `public`, containing SQLite and CVs. A persistent volume and backups are required for deployment; ephemeral serverless storage is not supported by this default setup.
- SQLite adapter also accepts a configured libSQL URL/token if remote database storage is chosen later. Private file storage remains a required deployment consideration.
- Credentials and data are gitignored. No secrets appear in task notes, screenshots, or output.
- Applications accept PDF CVs up to 5 MB. No user-uploaded HTML or rich text is rendered.
- Existing public site design, policy pages, footer, imagery, and previous pending changes are preserved.

## Quality gates

Use actual local HTTP/browser flows, not mock-only checks. Test anonymous applicant/CV access, public staff registration, unsafe uploads/URLs, closed-job submission, session/logout, staff permissions, and data persistence. Keep test data separate from real applicant records and remove it after verification.
