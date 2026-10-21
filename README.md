# partt website

The partt agency website: Next.js (App Router), React and TypeScript.

## Run it

You need Node.js 20.19 or newer (verified with Node 24).

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build: run this before every deploy
npm run start      # serve the production build locally
npm run typecheck  # TypeScript only
```

To test the contact form locally, copy `.env.example` to `.env.local` and set `CONTACT_WEBHOOK_URL`. If `.env.local` already exists, edit it without overwriting other settings.

Careers and HR were removed from this website on 19 October 2026. Their original source and integration references are preserved in [the reuse archive](exports/careers-hr.zip), with [a feature specification](specs/partt_careers_hr_reverse_spec.md) and [a porting guide](docs/careers-hr-porting-guide.md). The existing Git tag `pre-group-careers-20261019` also preserves the full original website. Private local data and credentials remain untouched and are excluded from the archive. This website requires no recruitment database or staff setup.

## Pages

| Address | What it is | File |
| --- | --- | --- |
| `/` | Homepage scroll film | `src/app/(site)/page.tsx` → `src/views/HomeView.tsx` |
| `/work` | All projects | `src/app/(site)/work/page.tsx` → `src/views/WorkView.tsx` |
| `/work/[slug]` | One case study per project | `src/app/(site)/work/[slug]/page.tsx` → `src/views/CaseStudyView.tsx` |
| `/services` | The four services and the process | `src/app/(site)/services/page.tsx` → `src/views/ServicesView.tsx` |
| `/about` | Story, approach, pillars, team | `src/app/(site)/about/page.tsx` → `src/views/AboutView.tsx` |
| `/contact` | Project form and direct details | `src/app/(site)/contact/page.tsx` → `src/views/ContactView.tsx` |
| `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions` | Website policies | `src/content/policies.ts` → `src/views/PolicyView.tsx` |
| `/api/contact` | Receives the form | `src/app/api/contact/route.ts` |
| `/sitemap.xml`, `/robots.txt` | Generated | `src/app/sitemap.ts`, `src/app/robots.ts` |

## Structure

```
src/
  app/          routes only: metadata plus one view per page
  views/        the page layouts
  components/
    layout/     Nav, Closing (call to action + footer), SiteShell, MotionProvider
    ui/         Button, Media (all photos), PageHero, Reveal, MarkPiece, Wordmark, Placeholder
    home/       the homepage scenes: Hero, Statement, ClientMarquee, SelectedWork, ServicesStack
    services/   ServiceSheet (used on the homepage stack and the services page), ProcessSteps
    work/       ProjectTile
    contact/    ContactForm
  content/      every word and image reference on the site (see below)
  lib/
    motion/     the scroll engine (ticker.ts), the homepage film (homeChoreography.ts), helpers
    contact/    form rules shared by the browser and the server
    seo.ts      page titles, descriptions, canonical links, share previews
  styles/       base.css (tokens, type, buttons), layout.css (nav, footer), home.css, pages.css
public/
  img/logos/    client logos, one colour
  img/work/     project photos, one folder per project
```

## Changing content

All content lives in `src/content/`. Pages only read from these files, so a CMS can replace them later
without touching the layouts.

- `site.ts`: name, domain, email, phone, navigation, the one call-to-action label.
- `projects.ts`: every project, once. The homepage, the work page, the case studies, the sitemap and the
  share previews all read from here. To add a project, add its photos to `public/img/work/<slug>/` and one
  entry to this file. Its case study page and sitemap entry appear automatically.
- `services.ts`: the four services and the process steps.
- `clients.ts`: the logos in the moving rows on the homepage.
- `home.ts`: homepage copy.
- `about.ts`: the about page.

### Content that is still missing

Fields that are waiting for real content are `null` (or an empty list) in the content files. On the page
they show as a dashed "Content needed" box, so nothing is invented and nothing is forgotten. Fill the field
and the box is replaced by the real content. The boxes only show in development (`npm run dev`); the
production build hides them (`showPlaceholders` in `src/content/site.ts`).

## Contact form

The form checks its fields in the browser and again on the server with the same rules
(`src/lib/contact/validate.ts`). The server then forwards the message as JSON to the address in the
`CONTACT_WEBHOOK_URL` environment variable.

Until that variable is set, the server answers "not connected" and the form tells the visitor so, with the
email address and phone number as the way to reach partt. It never shows a success message for a message
that was not delivered.

Any service that accepts a JSON webhook works (Formspree, Make, Zapier, n8n, a Slack workflow, your own
endpoint). To send email directly instead (Resend, Postmark, SMTP), replace the `fetch` call in
`src/app/api/contact/route.ts`. Nothing else needs to change.

The JSON sent: `name`, `company`, `email`, `phone`, `service`, `budget`, `message`, `source`, `sentAt`.

## Motion

- One animation loop for the whole site (`src/lib/motion/ticker.ts`). Scenes subscribe to it and are
  removed when their page is left, so nothing keeps running after a route change.
- Pinning is plain CSS (`position: sticky`). JavaScript only turns scroll position into transforms.
- The homepage film is `src/lib/motion/homeChoreography.ts`: the hero, the logo rows and the services cards.
  The statement and Selected Work are static sections.
- Selected Work shows the projects listed in `workShowcase` in `src/content/home.ts`, each with its own layout.
- Visitors whose device asks for reduced motion get a static version of every page, with a small bar
  offering to turn motion on. Two parts work the same either way, as the client asked: the client logo rows
  loop like a video (with a Pause button), and the services cards still stack, without their slide-ins.
  Without JavaScript the pages also fall back to the static version.

## Before launch

1. Confirm the domain in `src/content/site.ts` (`url`). Canonical links, the sitemap and share previews use it.
2. Set `CONTACT_WEBHOOK_URL` on the host and send a test message.
3. Fill the remaining "Content needed" fields (they are hidden in production either way).
4. Run `npm run build` and fix anything it reports.
5. Replace `public/og.png` if you want a different share image.
6. Commit the `package-lock.json` that the first `npm install` creates, so every install uses the same versions.

The build downloads the two brand fonts (Bebas Neue, Poppins) from Google Fonts once and then serves them
from this site. The machine that runs `npm run build` needs internet access for that.
