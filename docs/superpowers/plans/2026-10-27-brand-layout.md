# Apply NTNU brand layout refresh

User direction: recreate the website layout around the supplied brand files in Downloads/files. Existing features and Norwegian content remain functional.

Reference: overlapping circles, bold compact type, deep purple #1e1450, violet #4b2bd6, lavender #eeeaff, dark accent #9c88ff. Use the actual supplied logos, adapting their presentation with CSS, and derive code-native circle decoration/favicon. Do not fabricate people, event dates, statistics or testimonials.

- [x] Shared foundation: accessible light/dark tokens, supplied wordmark, text navigation with account/admin/theme controls, footer and favicon. Owner brand_foundation.
- [x] Homepage: large poster-like headline and circle motif; clear signup/events actions; editorial benefit sections, database-backed event area and branded closing invitation. Owner parent.
- [x] Shared subpage headers, event rows/filters and CTA sections; style account/admin surfaces through tokens and preserve all logic. Owner parent.
- [x] Informational page layout refinement. Owner brand_inner_pages.
- [x] Verify typecheck, existing tests and production build. Browser-check homepage, events, forms, admin, mobile navigation and theme persistence using disposable data. Inspect screenshots and independent review, fix findings.
- [x] Commit completed layout changes and show the refreshed local preview. No deployment or backend redesign.

Verification: all 31 existing tests pass, TypeScript passes, and the production build passes. Browser checks covered the homepage at desktop and 320/390px widths, mobile navigation, event filters, light/dark persistence, admin forms, signup and expanded FAQ. Independent review found no actionable regressions. Preview uses the persistent project database at localhost:3000; test data stayed in the disposable database.
