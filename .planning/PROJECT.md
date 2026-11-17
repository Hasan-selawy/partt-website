# Partt website
Implement the supplied approved visual direction as a functioning responsive agency site. Reference sources: desktop/, mobile/, boards/, motion/, notes/partt_placeholders.md, and attached MP4.

The supplied design controls colors, typography, layout, and choreography. UI/UX Pro Max guidance applies to focus, touch targets, reduced motion, contrast, and responsive behavior; its unrelated generated palette is not used.

Architecture: static index.html, styles.css, app.js; local fonts and extracted image assets; Node static development server; Playwright development checks. Hash routing supports hosting without rewrite configuration and direct file opening.

2026-11-16 content migration: real content now comes from C:/Dev/partt-nextjs (read-only source), exported to content.js. Eight projects and their galleries, four service groups, five process steps, company copy, resource policies and exact source footer replace the initial placeholder material. All 66 public images are preserved; 51 referenced photos have responsive WebP variants. The source footer design overrides the concept footer. Team and client-logo wall sections are removed from Home/About at the user's explicit request.
