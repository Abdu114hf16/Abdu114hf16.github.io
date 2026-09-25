# Portfolio revision handoff

Status: local implementation and verification complete; production deployment approved by the owner.

## Scope

- Simplified Home with separate About Me and Areas of Practice sections.
- Four compact selected project cards, led by Olist.
- Dedicated Experience page with generic professional responsibilities only.
- Data/software-first catalog order and domain-only filtering.
- Projects terminology throughout the public interface and metadata.
- Verified DataCamp Data Engineer Associate credential and official badge.

## Verification

- `npm run lint`, `npm test` (10/10), `npm run build`, `npm run check:built`, and `npm run check:privacy` passed.
- The production build contains 18 canonical routes; privacy checks covered 152 source, public, built, and documentation files.
- The browser matrix passed 108 route/theme/viewport checks and 36 accessibility audits for 12 complete project reports.
- Eight interaction groups and 21 dashboard accessibility states passed.
- Development media checks passed on 18 routes and 58 image instances.
- Link checks covered 134 rendered links, assets, and anchors. The 132 locally verifiable targets passed; DataCamp blocked the automated request with 403 and FRED timed out.
- Mobile Lighthouse performance scores ranged from 94 to 98. Accessibility, best practices, and SEO scored 100 on all six audited routes, with zero cumulative layout shift.
- Final browser evidence is in `.qa/revision-final-browser/`; Lighthouse reports are in `.qa/revision-final-lighthouse/`.

The local production preview is <http://localhost:4175>. See `PORTFOLIO_UPGRADE_PLAN.md` for the execution record and `docs/VERIFICATION.md` for reproducible commands.

Production deployment uses the existing GitHub Pages workflow triggered by `main`.
