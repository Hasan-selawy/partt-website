---
status: diagnosed
trigger: Homepage hydration warning containing bis_skin_checked, bis_register, and __processed_* attributes
created: 2026-10-18
updated: 2026-10-18
---

## Objective

Resolve the reported homepage console warning while preserving the approved design.

## Symptoms

- Expected: homepage hydrates without console errors.
- Actual: React reports extra attributes throughout the server-rendered tree.
- Reported attributes: `bis_skin_checked`, `bis_register`, and `__processed_8a085634-01ae-43be-a7cd-13558deeb7b9__`.
- Reproduction: load `/` in the user's browser. Browser extension configuration is unknown.
- Timeline: reported 2026-10-18; start date unknown.

## Current Focus

- Hypothesis: a browser extension changes the DOM before React hydration.
- Test: inspect the installed extension's source and verify the actual site hydrates in a clean browser.
- Next action: restrict Urban VPN's access to localhost in the user's Chrome profile, then reload and confirm the warning clears.

## Evidence

- Confirmed project: `C:\Users\hasan\Downloads\partt-nextjs`, branch `main`; existing uncommitted design/content/assets changes predate this task.
- Port 3000 belongs to this project's Next.js dev server.
- Project source does not contain `bis_skin_checked`, `bis_register`, or `__processed_`.
- Playwright clean-browser load of `http://localhost:3000/` reports zero console errors and zero warnings.
- Existing root `suppressHydrationWarning` covers the deliberate motion boot script's changes to the HTML element only.
- The installed Chrome extension `eppiocemhmnlbhjplcgkofciiegomcon` is Urban VPN 5.14.4. Its `ad-blocker/content.js` contains both `bis_skin_checked` and `bis_register`; the extension ID matches the beginning of the registration payload in the user's error.
- The real site's nav has React fiber properties and its theme effect runs in the clean browser, confirming hydration completes.
- A synthetic response-rewrite experiment was inconclusive: the modified response did not reach the expected hydrated nav state. The route interception was removed and the original homepage restored in the test browser. This experiment does not count as a reproduced warning.

## Resolution

Root cause diagnosed as Urban VPN's DOM injection. The user must restrict that extension's access to localhost and reload to verify the local warning clears. No browser settings or website source files were changed. No broad warning suppression was added.
