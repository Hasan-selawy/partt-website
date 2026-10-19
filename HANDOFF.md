# Handoff: Partt Group Careers

## Objective

Implement the user's Partt Group Careers build instructions in this repository, starting from the existing Careers/HR module. Partt is the central hub; other group websites consume its public jobs API and submit applications to it.

## Current stopping point

Update, 19 October 2026: the complete ten-phase instructions are available in the project-root `career site enhance.txt` and have been read. This supersedes the earlier missing-instructions stopping point. Some copied paths, commands, package names and code punctuation are flattened; report genuine exact-name/API conflicts before implementing, as the document requires. Phase 8 specifies four public integration environment variables, superseding the earlier two-variable overview.

The user's current request is to save the current project to GitHub before enhancement implementation. A baseline checkpoint is being prepared on `main` in the existing private `Hasan-selawy/partt-website` repository, with restore tag `pre-group-careers-20261019`. Task record: `.planning/quick/20261019-github-checkpoint/`. Fresh TypeScript and isolated production build both pass. Candidate-file secret scan has no findings; private environment, credential, database and CV files remain ignored.

No Group Careers implementation phase has started. The existing single-company SQLite/local-storage module and all previously approved website work are preserved. No application source, dependencies, external accounts, recruiting records or deployment were changed by this checkpoint task. See the latest STATE entry and checkpoint summary for the verified GitHub commit after the push.

## User requirements already supplied

- Partt at `www.parttagency.com` hosts `/hr`, its own Careers pages, public jobs APIs, applicant submission and staff CSV export.
- Each company website is a separate Vercel project with no HR code. It shows its own open jobs first, followed by "Explore other roles in our group" with company badges.
- Group-role links point to the owning company's canonical role page. Job slugs remain globally unique.
- New companies should require one Company record and the integration kit, with no changes to existing sites. The complete Phase 8 specifies four public environment variables.
- Replace SQLite with Neon Postgres using `@payloadcms/db-postgres`.
- Replace local CV files with private S3-compatible storage (Cloudflare R2 or AWS S3) using `@payloadcms/storage-s3`. Keep Payload file access control. No Vercel Blob.
- Reduce CV limit from 5 MB to 4 MB for Vercel request/download limits.
- Replace process-local throttling with Upstash Redis and `@upstash/ratelimit`; use `ipAddress()` from `@vercel/functions` for client IP.
- Shared HR initially sees all companies. Add per-company staff scope, default "all", using the exact fields still to be supplied.
- Vercel functions in `fra1`, Neon in `aws-eu-central-1`, R2 EU jurisdiction where available.
- CMS CORS/CSRF remain Partt-origin-only. Allow company origins only on custom public Careers routes, never `/api/cms`.
- Public routes named so far: `GET /api/careers/jobs?company=<slug>`, `GET /api/careers/jobs/<jobSlug>`, `POST /api/careers/apply`, and staff-only `GET /api/careers/export`.
- Work phase by phase in the supplied order. Finish each phase, run `npm run typecheck` and `npm run build`, then commit before the next phase.
- Keep `payload` and all `@payloadcms/*` packages exactly `3.91.0`. Run `hr:types` and `hr:importmap` after collection/field/relation/auth/admin-path changes.
- Preserve security rules from section 8 of the current reverse spec unless explicitly replaced.
- Do not touch unrelated home/work/services/motion/nav code except as explicitly allowed by a phase.
- Never commit secrets, `.env*.local`, databases, CVs or credential files.
- If the instructions conflict with actual code or an API differs, stop and report; do not guess.

## Preflight findings

- Branch: `main`, workspace `C:/Users/hasan/Downloads/partt-nextjs`.
- The working tree has extensive preexisting uncommitted Careers, policy, image and motion changes. Preserve them. Do not commit or discard unrelated work. A clean committed baseline for the existing module does not yet exist.
- Current source matches the stated starting point: Next 16.4.0, Payload 3.91.0, SQLite adapter, private local CV files, 5 MiB limit, process-local throttle, no Company collection or staff company scope.
- All seven top-level Payload-family packages in the lockfile are exactly 3.91.0. A first inspection accidentally counted nested `scheduler`; a corrected package-name filter confirmed version consistency. There is no Payload mismatch to report.
- npm registry read-only checks confirm `@payloadcms/db-postgres@3.91.0` and `@payloadcms/storage-s3@3.91.0` exist and both declare `payload: 3.91.0` as peer dependency.
- Target Postgres/S3/Upstash/Vercel-functions packages are not installed. No install was attempted.
- `.planning/ROADMAP.md` is absent. Full GSD phase planning cannot initialize from an existing roadmap yet; do not invent the user's missing phase sequence.
- Read the shared/root agent instructions, current STATE, relevant original spec/porting-guide sections, config, collections, settings, apply endpoint/validation, and installed Next route-handler/route-group guides.
- Inspected migration, brainstorming, writing-plans and GSD plan-phase skills. The user's supplied implementation instructions and explicit workflow govern execution; this is not a request to restart already-made architecture decisions.

## Sources checked for later implementation

Primary documentation only; verify pinned 3.91.0 source/types before coding adapter details:

- Payload storage adapters: https://payloadcms.com/docs/upload/storage-adapters
- Payload Postgres: https://payloadcms.com/docs/database/postgres
- Vercel function body limits: https://vercel.com/docs/functions/limitations
- Upstash rate-limit setup: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted
- Upstash failure/timeout behavior: https://upstash.com/docs/redis/sdks/ratelimit-ts/features

Current Upstash documentation describes timeout fail-open behavior by default. When implementing the supplied security rules, inspect and explicitly handle the selected library's failure/timeout semantics rather than silently weakening throttling.

## Files changed by this preflight

- `HANDOFF.md`: this continuation record.
- `STATE.md`: appended preflight status; prior entries preserved.

The previous completed extraction is under `exports/`, `specs/partt_careers_hr_reverse_spec.md`, `docs/careers-hr-porting-guide.md`, and `.planning/quick/20261019-careers-hr-extraction/`.

## Running operations

No command from this preflight remains running. The existing localhost dev server was present during the earlier extraction; its current process was not changed or checked in this preflight.

## Usage allowance

The current five-hour allowance is unavailable in this interface. No percentage, reset time, or active quota monitoring is claimed. This handoff is for missing instructions, not a triggered 5% quota handoff. No `/init` command was exposed or run, and `AGENTS.md` was not modified.

## Next steps

1. Verify the requested baseline checkpoint in GitHub using the latest STATE entry and `.planning/quick/20261019-github-checkpoint/SUMMARY.md`.
2. Use the complete `career site enhance.txt` for schemas, environment variables and ordered phases. Report genuine code/API conflicts or ambiguous formatting as the user requires.
3. Future enhancement commits should contain only the relevant phase changes; the user's whole-project baseline checkpoint separately captures all earlier approved website work.
4. Follow the supplied phases, regenerate types/import map when required, verify security and external-service integrations, run typecheck/build and commit each completed phase.
5. Never record actual secrets in planning, logs, handoffs or commits.
