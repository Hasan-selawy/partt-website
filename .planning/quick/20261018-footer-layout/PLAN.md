# Make the footer immediately recognizable

## Objective

Refine the shared footer into a familiar layout while keeping Partt's existing palette, typography, slogan, and wordmark. The user requested clearer footer recognition, rather than another large content scene.

## Approach

- Separate the footer from the preceding project invitation with its own navy surface.
- Use a brand summary and three labeled columns: Quick links, Resources, and Contact.
- Give copyright and back-to-top navigation a distinct bottom row.
- Retain the oversized wordmark as a quiet background signature instead of the main reading focus.
- Reflow into two link columns on phones, with full-width brand and contact groups.
- Use existing content and working destinations. No newsletter, careers, social accounts, or other unsupported destinations are added.

## Scope

`src/components/layout/Closing.tsx` and `src/styles/layout.css`, plus task notes and the append-only state log. Preserve prior policy/content/image edits.

## Verification

One batched browser review at desktop, intermediate, and phone widths, covering the homepage's CTA variant and the contact/policy footer-only variant. Check actual link clicks, back-to-top behavior, readable contrast, keyboard focus, target dimensions, and horizontal overflow. Run TypeScript and the Impeccable detector. Fix concrete findings together, then confirm once if needed. Preserve the running development server's build output.
