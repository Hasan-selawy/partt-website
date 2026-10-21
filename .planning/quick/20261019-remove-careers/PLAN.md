# Remove Careers and HR from Partt

## Objective

Remove the currently unneeded recruitment system from Partt. Preserve its source and integration instructions for reuse in another system. This request supersedes the previous Group Careers enhancement objective.

## Workflow

Applied Superpowers, GSD quick, Ponytail, Caveman, and verification-before-completion. GSD initialization reports no `.planning/ROADMAP.md`, so its full quick workflow cannot run; execute inline with plan, evidence, summary, and shared-state records. No new roadmap, agents, deployment, or remote changes are needed.

1. Recreate `exports/careers-hr.zip` from the existing extraction manifest using current original file bytes; include specification, porting guide, setup docs, configuration, dependencies, and evidence. Verify ZIP integrity and SHA-256 hashes before removing source. Keep private runtime data and credentials untouched and excluded from the archive.
2. Remove Careers pages, HR/CMS/API routes, recruitment source/styles/types/migrations/scripts, Payload integration and exclusive dependencies. Remove Careers footer/sitemap links and outdated recruitment policy text. Keep the existing website layout, content, motion, contact endpoint, and policy routes.
3. Run an isolated production build and TypeScript check, verify public pages and contact validation, and confirm retired URLs return 404. Check the dependency tree and source for remaining recruitment integration. Record results in SUMMARY.md, append STATE.md, and update stale HANDOFF.md.

## Acceptance

- No active Careers, HR, CMS, application submission, CSV export, or recruitment database dependency remains in Partt.
- Existing site and contact behavior still work; public policy text describes current site features.
- The original module remains recoverable from the verified local archive and existing `pre-group-careers-20261019` Git tag.
- No jobs, applicants, CVs, local credentials, or environment values are deleted or exported.
- Preserve the independently deleted `career site enhance.txt`; do not restore it to the working tree.

## Usage

Five-hour usage information is unavailable; no usage percentage or monitoring claim is made.
