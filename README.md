# Partt website

A responsive implementation of the supplied Partt concepts and 21.5-second motion film, with real content and photographs imported from `C:/Dev/partt-nextjs`. The closing section and footer match that website. Uses local artwork and fonts, vanilla HTML/CSS/JavaScript, and no production dependencies.

## Open

Run `npm start`, then visit **http://localhost:5173**. The site can also be opened directly through `index.html`.

The homepage plays the logo intro on entry. Press Escape or **Skip intro** to skip it. Scroll to see the name lock, service cards, process line, and real projects. Navigation plays the red cross transition. Operating-system reduced-motion preferences skip the choreography. The team portraits and client-logo wall were removed from Home and About at the user's request.

The homepage portfolio matches the old project's “Made together.” section: original introduction, four featured projects (LÉVO, DWEGO, OLVY, Incharge), staggered two-column layout, 5:4 photos, numbered captions, alternate images on hover or keyboard focus, and an All work link. All work opens the full project list. The section becomes a single column at 820px and below.

The entrance follows the film's timeline: pinwheel/counter through 1.6 seconds, split letters and masked “par” reveal, returning red t and streak at 3.1 seconds, then the logo flies into navigation from 3.4 to 3.95 seconds. The hero reveals its headline in masked lines. The name section pins on larger screens while scrolling joins the two t shapes, then types its closing line. The process line draws in sequence; portfolio images wipe upward; navigation uses a one-second red cross that separates into quarters. Services light up in sequence after the page reveal.

## Pages

- Home: `#/`
- Services: `#/services`; four detail pages such as `#/services/strategy-brand`
- Work: `#/work`; eight complete portfolio pages with photographs and galleries
- About: `#/about`
- Contact: `#/contact`
- Resources: `#/privacy-policy`, `#/cookie-policy`, `#/terms-and-conditions`
- Unknown routes display the not-found page.

Hash routes work on ordinary static hosting without server rewrites.

## Build and host

Publish the contents of `dist/` only, at the site root. Do not upload the project folder.

```sh
npm run build
npm run test:deploy
```

`test:deploy` rebuilds `dist/`, then checks asset references, security headers, caching, the production process, and a path redirect for every page. Hash routes such as `/#/work` work on a static host with no rewrite rules. `dist/` also contains a real folder for each existing path (`work/olvy/index.html` and the other pages). Those files redirect to the hash route, so a link such as `/work/olvy` still opens. Unknown paths use `dist/404.html`.

Search engines get one indexable URL, `https://www.parttagency.com/`. The path files are `noindex` redirects. Canonical and social tags use that same origin.

`dist/_headers` sets the security and cache headers for Netlify and Cloudflare Pages. `vercel.json` does the same for Vercel.

Vercel project settings, if the dashboard does not take them from `vercel.json`:

- Framework preset: Other
- Install command: `npm install --omit=dev`
- Build command: `npm run build`
- Output directory: `dist`

A Node host can serve the same folder:

```sh
npm run build
npm run start:prod
```

`start:prod` listens on `0.0.0.0` and `PORT` (default 5173) and refuses to start when `dist/index.html` is missing. `npm start` stays the local preview: `127.0.0.1` and the source files.

The contact form prepares an email to info@parttagency.com. Publishing does not add a form backend.

## Checks

```sh
npm install
npx playwright install chromium
npm start
# In another terminal:
npm test
npm run test:motion
npm run test:deploy
```

An existing Chromium executable can be used with the `PLAYWRIGHT_CHROMIUM_EXECUTABLE` environment variable. `TEST_URL` defaults to `http://localhost:5173`. Tests cover 320, 390, 768, 1024 and 1440px widths, every project gallery, original-image links, footer resources, menu keyboard behavior, sector filters, form drafts, reduced motion, intro, scroll joins and page transitions. The content verification also compares source file hashes, copied originals and text parity. It expects the source folder to remain available. Verification screenshots are written to `.verification/`.

The focused motion check additionally verifies measured red t positions against film timestamps, exact navigation-logo landing on desktop/phone/tablet, skip behavior, pointer response, pinned scroll progress, typing, process drawing, image reveals, service hover spacing, cross/quarter phases and changing reduced-motion preferences. Its screenshots are in `.verification/motion/`.

## Content and contact

The existing website's `src/content/` modules are now the content source. Imported projects: Salt Beach, LÉVO Café, INCHARGE, DWEGO, DTALE, Dead Sea Tourist Beach, OLVY and Dead Sea Corniche. Their brand descriptions, statements, approaches, executions, outcomes, alt text and galleries are preserved. INCHARGE's concept imagery remains labeled as such. Empty years, challenges and service credits are not invented. Work filters use the actual client sectors.

All 66 public image files were copied byte-for-byte to `assets/client-media/`. The 51 images referenced by current projects also have responsive WebP copies in `assets/optimized/`. Galleries link to their original images. Seven client logos remain in the asset library; the visible logo wall and team sections were removed as requested.

The four source service groups, complete bullet lists, five-step process, official about copy, contact facts, and footer/resource pages are included. Privacy and cookie wording was adjusted to describe the current email-draft flow and absence of browser storage. Source files and existing source edits remain untouched; credentials and private data were not imported.

The contact form validates and prepares a reviewable email addressed to **info@parttagency.com**. It does not claim to send anything. The visitor can open their mail app or copy the message. A live submission backend requires a separate service connection.

Arabic translation, unconfirmed social handles, exact office pin, invented budget ranges and unsupported company milestones are omitted. The form includes the source site's optional free-text budget field. No analytics or advertising trackers are included.

## Files

- `index.html`: shell, accessible navigation, intro and transition layers.
- `styles.css`: brand tokens, responsive layouts, native motion.
- `app.js`: page templates, routing, interactions and contact email preparation.
- `content.js`: imported structured public content, ready for static hosting.
- `assets/`: source artwork, imported originals, optimized project photos, vectors and local fonts.
- `scripts/prepare-assets.py`: reproducible extraction utility; development only, requires Pillow, NumPy and OpenCV. Original reference files are untouched.
- `scripts/import-existing-content.mjs`: repeatable public-content import; requires Node 24 for TypeScript type stripping.
- `scripts/prepare-client-media.py`: responsive WebP generation and static content bundle; requires Pillow. Run after the import script, with `PYTHONPATH=.tools` for this workspace's installed tools.
- `scripts/verify-content.mjs`: original-file hashes and public-content parity checks.
- `.planning/`: implementation plan and verification record.
- `STATE.md`: shared-agent project state.

Fonts: Bebas Neue and Poppins, distributed under the SIL Open Font License. Source artwork belongs to its respective owners and is reused from the supplied design folder.

The pre-import site files are backed up under `.local/backups/before-content-import/`. The source manifest, media map, and migration record are in `.planning/quick/20261116-import-existing-content/`.
