# Homepage portfolio matched to the old project

Completed 2026-11-16.

Replaced the concept's “04 / Work / Selected work” block with the source project's “Made together.” heading, original introduction and five featured projects in their original order. Copied the source section's spacing, typography, 5:4 photo ratio, staggered two-column grid, numbered captions, metadata, statements, alternate-photo hover and bottom All work link. The 820px breakpoint produces a single column. Reveal motion follows the source; keyboard focus also activates the photo preview, and reduced motion leaves all content visible.

Changed app.js and styles.css; updated README.md and STATE.md. Rebuilt dist/. The full Work page, footer and previously removed team/logo sections retain their requested behavior. C:/Dev/partt-nextjs remains unchanged.

The focused link check exposed an existing navigation issue: returning from a project to the bare homepage URL changed the hash to empty without rendering Home. The hash listener now handles an empty hash as Home while continuing to ignore ordinary section anchors.

Verification:
- node --check app.js: pass.
- npm run build: pass.
- npm test: 293 content/asset checks and 333 browser checks pass.
- Temporary .local/verify-selected-work.mjs: 47 checks pass at 320, 390, 820, 821, 1024 and 1440px. Verified source copy/order, grid geometry, loaded images, hover/focus, project and All work links, Back navigation, reduced motion, reveal and absence of browser errors.
- Desktop and mobile section screenshots reviewed in .verification/selected-work-1440.png and selected-work-390.png. Fixed navigation was hidden only in section screenshots to prevent screenshot capture artifacts; production navigation is unchanged.

Local website remains available at http://localhost:5173. No deployment or commit. Five-hour usage allowance is unavailable; no percentage asserted. Next: user review.
