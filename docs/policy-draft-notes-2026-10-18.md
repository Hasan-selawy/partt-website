# Policy draft notes — 18 October 2026

## Delivered

Three policy pages with original, readable text replace the supplied Lorem Ipsum reference:

- `/privacy-policy`
- `/cookie-policy`
- `/terms-and-conditions`

Wording lives in `src/content/policies.ts`; all three routes use `src/views/PolicyView.tsx`. The existing footer links to each page. Existing navigation, homepage content, project imagery, and contact-form behavior were preserved.

The user confirmed `info@parttagency.com` as the address to use for now. It is used for the inquiry/privacy contact. This confirmation does not configure the contact form to deliver email: the existing API still needs a working `CONTACT_WEBHOOK_URL` to deliver submissions.

## Verified site behavior

- The inquiry form requests name, email, and project message; company, phone, service, and budget are optional.
- `src/app/api/contact/route.ts` validates submissions and forwards them to a configured webhook. There is no application database or account system.
- No analytics, advertising pixels, newsletter signup, or cookie-setting code were found in the application.
- The only application local-storage preference is `partt-motion`, written as `on` when a visitor chooses to override reduced motion. It has no application-set expiry and is not included in the inquiry payload.
- Brand fonts are downloaded by `next/font` and served locally; project images are served by the site.

## Recruitment implementation update

Careers/HR was added after the initial audit, then removed from Partt on 19 October 2026 at the user's request. Privacy, Cookie, and Terms content now describes the website without recruitment submissions, staff accounts, or HR cookies. The original module and its operating guide are preserved in `exports/careers-hr.zip` for reuse elsewhere. Private local recruitment records and credentials were retained, not deleted or included in the source archive. The remaining hosting/provider and inquiry-retention confirmations below still apply.

## Basis for privacy wording

The Ministry of Digital Economy and Entrepreneurship publishes Jordan's [Personal Data Protection Law No. 24 of 2023](https://www.modee.gov.jo/EBV4.0/Root_Storage/EN/1/PDP_Law_-_English_Version-_officail_translation.pdf) and its [current laws, regulations, instructions, and forms](https://modee.gov.jo/EN/List/The_law_regulations_and_instructions).

The draft's rights summary and statements about purpose, retention, and service providers use those primary materials as references. The implemented storage and form descriptions come from this project's source, rather than generic tracking claims. No blanket legal-compliance guarantee is made.

## Business details requiring confirmation before publication

The user has confirmed only the contact email. The following are still unconfirmed:

- The registered operator's full legal name and address, if different from the existing site content (`partt agency`, Amman, Jordan).
- The hosting provider, email provider, contact-form delivery provider, processing locations, and actual server-log practices.
- A defined inquiry-retention period and how deletion, backups, consent where required, and privacy requests will be handled operationally.
- Whether the draft's access controls, deletion commitments, non-sale commitment, and Jordanian-law term match the agency's adopted practices.

The law's notice and consent provisions address processor identity and processing duration. This draft uses general purpose-based wording rather than inventing a processor or a fixed period. Complete those details and confirm the processing/consent arrangements before treating the privacy notice as publication-ready. Do not describe `info@parttagency.com` as a provider name or processing location.

If tracking, third-party embeds, newsletter signup, an account system, or a different form provider is added later, review both policies and any required controls at that time.

## Verification

- `npm run typecheck`: passed.
- All three routes returned HTTP 200 at 1440×900 and 390×844, with correct titles, descriptions, canonical URLs, section headings, and active policy links.
- All six browser loads: no console errors, no warnings, no duplicate IDs, no Lorem Ipsum, and no horizontal overflow.
- Homepage footer links worked through actual clicks on desktop and phone; contact-page footer links also render correctly.
- `/sitemap.xml` returned HTTP 200 and includes all three policy URLs.
- Desktop/phone screenshots are saved in `.planning/quick/20261018-policy-pages/` and were visually inspected.
- Production build was not run while the user's development server was using `.next`; TypeScript and real dev-server checks were used for this static-page addition.
