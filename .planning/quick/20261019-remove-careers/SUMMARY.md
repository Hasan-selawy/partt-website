---
status: complete
date: 2026-10-19
---

# Careers and HR removed from Partt

The user's removal request supersedes the previous Group Careers enhancement objective. The recruitment system is preserved for reuse, and the active Partt website no longer contains its implementation.

## Changes

- Saved `exports/careers-hr.zip` (181,024 bytes), its source manifest, and archive verification. Includes all 34 recruitment source files, host integration references, original dependency/configuration files, migration/schema, setup/verification scripts, specifications/guides, historical evidence, and the unimplemented enhancement plan recovered from Git. Verified all 82 file hashes and ZIP CRC. SHA-256: `92a7d0adf48cb78d0a2562936f1cea7ae0abed2818344d997158f0178e6ee811`.
- Removed all 34 recruitment implementation files: public pages, HR/CMS/API routes, collections/access rules, application form/dashboard, database migrations, generated types, styles, and administrative scripts/config.
- Removed Payload, SQLite adapter, GraphQL, Zod, Sass, tsx, their dedicated commands/overrides, Next wrapper and TypeScript alias. Updated the lockfile and pruned 251 installed packages. Existing Next/React/TypeScript and type-package versions are unchanged.
- Removed Careers footer/sitemap links; sitemap now uses static site/project/policy content. Removed stale HR robots entry. Retained the existing route group, site layout and global 404.
- Removed recruitment-specific privacy/terms/cookie text and dated the policies 19 October 2026. Updated README, archival documentation notices, and stale handoff instructions.
- Kept private database/CVs, administrator credentials, and `.env.local` untouched and excluded from the archive. Kept the independently deleted `career site enhance.txt` absent from the working tree; its original Git version is available only as an archived historical plan.

## Verification

- `NEXT_BUILD_DIR=.next-build npm run build`: exit 0, 23 static outputs, only `/api/contact` remains a dynamic application endpoint. No recruitment/CMS routes in the build manifest.
- `npm run typecheck`: exit 0. Regenerated stale local route types after removal; removed an incidental duplicate include generated during type refresh.
- `node .planning/quick/20261019-remove-careers/verify.mjs`: all 30 production HTTP checks pass. All 16 sitemap pages, including eight case studies and three policies, return 200; none advertises the retired system. Ten retired page/API requests return 404, including POST application/login requests. Contact malformed/invalid submissions preserve 400/422 behavior without sending messages. Robots and security headers pass.
- Archive CRC, all 82 payload hashes, exclusion of private runtime paths, and actual known local credential scan pass. External manifest matches archive payload inventory.
- All 26 unchanged archived host source references match their original hashes. Private environment, administrator-access file, and two recruitment runtime files match local fingerprints after verification.
- `npm ls --depth=0`: only Next, React, React DOM, TypeScript and their type packages remain. No Payload packages remain in the lockfile. Source/config search found no active recruitment references.
- `git diff --check`: pass after removing an extra blank line from `.env.example`.

The temporary production server on port 3100 was stopped after verification. No running development server was present before this task. No commit, push, deployment, remote change, actual email/webhook message, or recruiting-data mutation was performed.

## Workflow and next steps

Applied Superpowers, GSD quick, Ponytail, Caveman and verification-before-completion. GSD initialization succeeded but reported no ROADMAP, so the full quick workflow was unavailable; tracked and executed the work inline without spawning agents or creating a roadmap. Five-hour allowance information is unavailable.

Removal is complete. When requested, integrate the archived module into the destination system using the porting guide. The existing `pre-group-careers-20261019` tag also preserves the original complete website. Do not resume the old Group Careers enhancement plan without a new user request.
