# Motion audit and corrections

Completed by Codex, 2026-11-16, continuing Claude's interrupted motion work.

## Recovered state

The previous run had already rebuilt the intro markup, added four pinwheel SVG pieces, a cream first t, split footer watermark vectors, masked headline markup, a pinned name track, typewriter effect, process drawing, portfolio image wipes, and cross/quarter transitions. Runtime files contained its earlier motion CSS. Its final measured intro corrections were staged only in .local/motion/intro.css and had not reached styles.css.

No HANDOFF.md was present. Existing STATE.md was read. Thread recovery and the shared browser returned Authentication required; continued using the supplied history, local files, film and installed Chromium. GSD resume initialized successfully; this repository uses root STATE.md rather than .planning/STATE.md. No subagents or source-project writes. Five-hour allowance unavailable.

## Changes

- Applied and refined the staged native entrance choreography: staggered pinwheel pieces, rotation and 1.3-second eased counter; loader shrink/turn; split t growth; masked/scaled par reveal; measured red t trajectory; independent streak; pulse/ring; flight to the actual navigation logo bounds from 3.4 to 3.95 seconds.
- Corrected the streak's DOM parent so its coordinates belong to the logo stage, rather than the moving red t.
- Aligned masked hero headline timing and sequenced hero copy, actions, navigation and mark entrance. Services headings begin as the quarters clear; the service list starts afterward.
- Preserved and checked cursor response, sticky scroll join/overshoot, typed punchline, staggered service cards, process drawing, portfolio image wipes/hover, footer wordmark lock, cross fill and quarter exit, and service-row hover.
- Finishing a typewriter animation with reduced motion now restores the complete text immediately.
- Reserved space for the expanded service action, preventing overlap with longer imported content. Titles wrap safely at the 1101px desktop boundary. The action also opens on keyboard focus.
- Updated the smoke test to scroll through the new pinned track before expecting a completed join. Added scripts/verify-motion.mjs and npm run test:motion.

Primary runtime files: index.html, app.js, styles.css, package.json. Supporting changes: scripts/smoke.mjs, scripts/verify-motion.mjs, README.md, STATE.md and this plan/summary. Existing motion assets retained: pinwheel-1.svg through pinwheel-4.svg, t-first-cream.svg, wordmark-base.svg and wordmark-t2.svg. dist/ rebuilt.

The original film and C:/Dev/partt-nextjs remain unchanged. Existing client content, old-project Selected Work/footer layout and team/logo-wall removals are preserved. Motion is adapted to the real four services/five process steps and portfolio/footer content; removed concept sections and the film's editorial ending are not introduced as website pages.

## Verification

- node --check app.js and node --check scripts/verify-motion.mjs: pass.
- npm run build: pass; final runtime copied to dist/.
- npm test: 293 source/content/asset checks and 333 browser checks pass.
- npm run test:motion: 55 checks pass. Includes film-measured red t positions, exact logo landing at 1440/768/390/320px, skip/unlock, pointer response, pinned progress, typed copy, cards, process line, image wipe and alternate photo, footer, service sequence/hover, full cross at 650ms, quarter exit, and reduced-motion checks across five widths. No page or asset errors.
- Additional service-row geometry inspected at 1101/1280/1440px; titles, bullets and expanded action stay separated after the spacing correction.
- Compared film/site stills at matching timestamps, including 0.2/0.65/1.15/1.45/1.9/2.3/2.35/2.75/3.1/3.35/3.6/4.3 seconds. Reviewed name/process/footer/service/cross/quarter screenshots.

Comparison helpers and temporary frames are in .local/motion/. Production styles.css is authoritative; earlier staging/patch scripts in .local are historical and should not be rerun over the final files. Motion checks and screenshots are reproducible with scripts/verify-motion.mjs. Backups exist in .local/backups/before-motion-match/ and .local/backups/resume-motion/.

Website remains running at http://localhost:5173. No commit, deployment or external publication. No project-local Git repository; ancestor home-directory repository left untouched. Next: user review.
