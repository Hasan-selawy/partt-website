# Add Partt policy pages

## Objective

Add Privacy Policy, Terms & Conditions, and Cookie Policy pages with real, readable wording. Reuse the approved website design and add links in the existing footer.

## Decisions

- The user explicitly requested real policy text instead of the supplied Lorem Ipsum.
- Follow the existing route, `pageMeta`, `PageHero`, content-module, and `Closing` patterns.
- Describe the implemented contact form and `partt-motion` local-storage preference. No analytics, advertising trackers, newsletter signup, or account system are present in the source.
- Draft operational statements without inventing provider names, fixed retention periods, company registration details, or guaranteed legal compliance. Record the facts requiring the owner's confirmation before publication.
- Use an inline GSD task record: this existing project has no `.planning/ROADMAP.md`, so the full quick workflow's project prerequisite is absent. Preserve existing uncommitted work; do not initialize a new roadmap or include other changes in commits.

## Tasks

1. Inspect actual data handling and consult the Jordanian Ministry's current personal-data-protection materials.
2. Create central policy content, one shared server-rendered view, three static routes, footer links, and sitemap entries.
3. Run TypeScript and verify page headings, metadata, links, and desktop/mobile rendering in the existing dev server. Save a summary and append to root `STATE.md`.

## Verification

Use the real local server on port 3000. Check all three policy routes, the shared footer on the homepage/contact page, console output, and horizontal overflow at desktop and phone widths. Avoid replacing the running development server's `.next` output with a production build.
