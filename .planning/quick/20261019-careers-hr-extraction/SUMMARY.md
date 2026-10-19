---
status: complete
date: 2026-10-19
---

# Careers and HR extraction

## Delivered

- `exports/careers-hr.zip`: 81 entries, 164,051 bytes. Includes 34 original recruitment feature files, 40 original host/integration references, feature specification, porting guide, archive README, source manifest, and three non-sensitive evidence reports.
- `exports/careers-hr-manifest.json`: external copy of the archive manifest, identifying source categories, byte lengths, SHA-256 hashes and 107 local import edges.
- `specs/partt_careers_hr_reverse_spec.md`: complete observed public Careers, application, HR, staff, security, data-model/API and operational behavior, missing features, and rebuild acceptance criteria.
- `docs/careers-hr-porting-guide.md`: dependencies/config/layout integration, brand and host coupling, fresh setup, migration handling, verification-script assumptions, and an implementation prompt for the destination project.

Archive SHA-256: `79b2974530b37d1e22095617839136e2f5150aad8cd26a7cbf4ee123cec7fe5b`.

## Verification

- Read the user's shared/project instructions and existing root STATE before task work. No HANDOFF file was present.
- Reviewed the feature models, access controls, routes, UI, validation, settings, migrations, generated types/dependency structure, setup/recovery and existing verification scripts. Read relevant installed Next route-group/route-handler documentation.
- Signed into the current local HR system with existing private credentials, inspected authorized access, and signed out. No credential values, tokens, applicant records, or CSV contents were saved to the export.
- 15 current read-only HTTP checks passed: open-only public API, public Careers, anonymous application/export denial, administrator login and session recognition, HR overview/actions, authorized applicant/CSV access, private caching, robots exclusions, sign-out and revoked-session denial. See `verification-results.json`.
- Initial Node-cookie probes omitted Origin/fetch metadata and were correctly treated as unauthenticated by the installed Payload CSRF strategy. Read installed `extractJWT.js`; final checks supply allowed Origin. No application fix was required.
- `npm run typecheck -- --incremental false`: exit 0. No production build or mutation-based lifecycle scripts were run for this documentation/source extraction.
- ZIP CRC check passed; all 80 payload-file hashes match the manifest. Manifest copy matches archive bytes. Both generated documents match workspace bytes. All 107 local import edges and 42 Markdown links resolve inside the archive. See `archive-results.json` and `final-verification.json`.
- Every one of the 34 recruitment feature files remained byte-identical to the initial scan. Private/runtime paths were excluded by allowlist and archive checks. Actual known local password/secret values were checked in memory and are absent; none were printed.
- The earlier implementation's 35 lifecycle checks and production-bootstrap report were included as dated historical evidence, not claimed as newly rerun.

## Shared-workspace changes

During extraction, external work changed four host references: `src/components/layout/Nav.tsx`, `src/components/ui/ClosingMark.tsx`, `src/lib/motion/ticker.ts`, and `src/styles/home.css`. Their edits were preserved. Refreshed the supporting-source snapshot and dependency edges before packaging. No application source was edited by this extraction task.

The archive contains a recorded point-in-time source snapshot, including existing uncommitted recruitment source. Subsequent shared-workspace edits do not rewrite the archive.

## Scope and decisions

- This is a recruitment Careers/HR module, not payroll or employee management. Documented manual status selection, absence of LinkedIn import/email/scheduling/AI, and self-only staff-directory access for regular HR.
- Extraction provides original source plus a stack-independent specification. The destination project was not supplied, so installation/deployment there is outside the completed extraction and remains unverified.
- Credentials, local environment files, database/CVs, applicant/session records, screenshots, build output and dependencies are excluded. No external services, messages, commits or deployment were performed.
- Applied Superpowers, Caveman, Ponytail and Spec Miner. Full GSD quick workflow could not initialize because this checkout has no `.planning/ROADMAP.md`; used inline plan/summary/state records without creating a roadmap or overwriting shared work.
- Five-hour allowance information is unavailable. No usage percentage or monitoring claim was made.

## Next

Use the archive, feature specification and porting guide in the target project. Adapt its branding/origins/auth/data storage, merge migrations and run isolated acceptance checks there.
