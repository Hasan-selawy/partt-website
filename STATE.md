# STATE

## Goal
partt agency website (Next.js 16.4, React 19, TS, plain CSS). Homepage refinement per `Downloads\Design Ref.txt`.

## Done
- [claude 2026-10-11] Read the whole codebase. No git repo here yet. node_modules installed, Node 24.
- [claude 2026-10-11] Design Ref steps 1-5 done. Backup of the old src: `Downloads\partt-nextjs-src-backup-2026-10-11`.
  - Statement: static text, no pinning, no word reveal (`Statement.tsx`, `home.css`).
  - Colours: one navy block (statement + logos, no red ground), paper for work + services, deep navy closing.
  - Selected Work: vertical index of featured projects, links to case studies (`SelectedWork.tsx`, `.pj*` in `home.css`).
    Horizontal journey removed from `homeChoreography.ts`, `home.ts`, `ticker.ts` (TOUCH_WALK_QUERY), `math.ts` (mixHex).
  - Projects: new `execution` field (null) + "Creative execution" block on case study pages.
  - Services: contained sticky cards, stepped tops (`--k`, `--step`), calmer motion; non-pinned on phones <= 740px tall.
  - Checked: typecheck, build, Playwright screenshots at 1440x900, 820x1180, 390x844, 375x667, reduced motion. No console errors, no horizontal overflow.

- [claude 2026-10-11] Second refinement (intro + Selected Work), using impeccable + taste-skill.
  - Intro: editorial spread. Main statement large, supporting sentence apart, assembling mark (`ClosingMark`) as anchor, "About partt" link. Copy split into `statement.main` / `statement.sub` in `home.ts`, wording unchanged.
  - Selected Work: `workShowcase` in `home.ts` sets order, layout (feature, pair, inset, triptych, strip) and photos per project. One entrance: photos unclip upward. Name link covers the whole project.
    `featured` field removed from `projects.ts` (unused). `Shot.zoom/origin` crops into brand-guideline files.
  - `salt-beach/01.jpg` is a tiny original upscaled (blocky). Homepage uses Salt Beach pattern + logo tile instead. Still used on /work, the case study hero and share image.
  - Skip link: hidden (1px clip) until focused.
  - Checked: typecheck, build, impeccable detect (0 findings), screenshots 1440x900 + 390x844, skip link keyboard test.

- [claude 2026-10-11] Third pass: every brand looks the same; site-wide polish.
  - `components/work/WorkGrid.tsx`: one tile system (hero photo, gallery[0] on hover, number, name, type, line), 2 columns, right column half a tile lower. Used by homepage (`workShowcase` = list of slugs) and /work. `ProjectTile` and old `.tile*` CSS deleted; per-layout `.pj--*` and `Shot` zoom code deleted.
  - Salt Beach hero is now `salt-beach/04.jpg` (pattern cropped from 02.jpg, real asset). 01.jpg and 02.jpg are no longer referenced.
  - Services page: contained cards like the homepage stack.
  - Case study: one compact "content needed" note; empty meta rows hidden. `showPlaceholders` = dev only (production hides them).
  - `::selection`, caret and accent colours themed.
  - Checked: typecheck, build, impeccable detect (0), screenshots of /, /work, /work/salt-beach, /work/dtale, /services, /about, /contact at 1440 and 390.

- [claude 2026-10-11] Saved restore point: `Downloads\partt-nextjs-snapshot-2026-10-11.zip` (whole project minus node_modules/.next, verified identical after extracting).

- [claude 2026-10-11] Motion-off exceptions, as the user asked (only these two):
  - Logo rows: CSS loop (`@keyframes mq`, `--mq-dur` 56s desktop / 40s phone), plays with reduced motion too, Pause/Play button (`ClientMarquee.tsx`, now a client component). JS row code removed from `homeChoreography.ts`.
  - Services cards stack (sticky) with reduced motion; only slide-ins are skipped. `StackFit.tsx` sets `--h` so a card taller than the screen pins by its bottom edge. `MotionProvider` sets `--rmbar` (bar height) so pinned cards end above the bar. Phone bar made compact. Old "short phones unpin" rule removed.
  - Checked: build, impeccable detect (0), Playwright with reducedMotion reduce/no-preference: logos move 64px/s desktop, 43px/s phone, pause stops them; every card fully readable at 1440x900, 414x896, 390x844, 375x812, 360x780.

## Next
- User to clarify "PART + PARTNER = PARTT ... make it as Partner in every Part" (hero equation). Hero untouched until then.
- User review in browser at localhost:3000.
- Get a high-resolution Salt Beach product photo to replace `public/img/work/salt-beach/01.jpg`.

## Decisions
- [claude 2026-10-11] No git for now (user's call). Init only when user asks.
- [claude 2026-10-11] Homepage work classes are `.pj*` because `.wk` is taken by the /work page.
- [claude 2026-10-11] Logo files are white, so the logo rows stay on navy.
