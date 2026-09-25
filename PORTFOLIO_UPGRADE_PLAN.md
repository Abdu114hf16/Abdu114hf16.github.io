# Portfolio revision — current plan and checks

This revision supersedes the earlier plan. Previous internal-project detail and obsolete review artifacts are removed rather than retained in the public repository.

- Working folder: `C:\Learning\Official_Portfolio`
- Branch: `feat/minimal-portfolio-upgrade`
- Production baseline: `68714ab99445bdb8779fa94794abfa632bf33404`
- Owner's original icon edits remain in stash `cb9611f4c8392a1e9a13702f6b74676078194d9c`.
- Production deployment requires owner approval.

## Approved revision

1. Keep the current brand and hero; simplify Home to compact selected projects, a separate About Me section, and a separate Areas of Practice section.
2. Put Data Engineering & Databases first in Areas of Practice.
3. Keep four Home projects: Olist, Medical Cost, Donor Outreach, and Income/Inflation.
4. Remove confidential employment work from the project registry, report routes, search metadata, KPI tiles, documents, and generated artifacts. Describe responsibilities only at a high level on Experience and CV.
5. Use a dedicated `/experience` page. Remove the duplicate Experience, credential preview, KPI strip, and additional contact panel from Home.
6. Use Projects/View project wording. Use domain-only catalog filters, with source/course attribution inside project details.
7. Prioritize substantial data and software projects. Put PlayStation sentiment, Boolean search, digit recognition, and the Arabic numeral prototype at the end.
8. Add DataCamp Data Engineer Associate with the verified credential URL and a small official badge inside its CV card.

## Phases

| Phase | Scope | State | Gate |
|---|---|---|---|
| R1 | Privacy, data model, Experience route, source verification | Complete | PASS — lint, 10 tests, build, metadata and privacy checks |
| R2 | Compact Home, Olist report/media, catalog order, DataCamp card | Complete | PASS — responsive visual and browser checks |
| R3 | Build, privacy, routes, keyboard, visual/accessibility and performance checks | Complete | PASS — all required local checks passed |

### R1 — privacy and structure

- [x] Inspect current work without discarding the existing upgrade.
- [x] Verify Olist against its public repository and the provided local SQL/assets.
- [x] Verify the DataCamp certificate identity/title and inspect the supplied badge.
- [x] Remove withdrawn project content and all public references; scrub old documentation and generated review artifacts.
- [x] Add a dedicated Experience page containing only generic responsibilities.
- [x] Adjust typed project ranking and independent Home selection; keep provenance accurate.
- [x] Gate: lint, tests, build, metadata parity, and source/build privacy checks pass.

### R2 — focused presentation

- [x] Separate About Me and Areas of Practice into full-width sections.
- [x] Make Data Engineering the first practice item.
- [x] Replace the withdrawn Home project with Olist and shorten all four selected cards.
- [x] Add Olist's public warehouse description, ERD and screenshots.
- [x] Prioritize Olist and substantial software/data projects; move the four smaller projects to the end.
- [x] Remove context filters and use Projects terminology throughout the interface and SEO.
- [x] Add the verified DataCamp credential and small badge.
- [x] Gate: check card height reduction, Home section hierarchy, project order, badge rendering, image loading, and responsive screenshots.

### R3 — verification and review

- [x] Run `npm run lint`, `npm test`, `npm run build`, and `npm run check:built`.
- [x] Run privacy checks across source, generated HTML/JavaScript, public assets, and documentation.
- [x] Run route/metadata, 320px overflow, keyboard, theme, gallery, and contact checks.
- [x] Verify the old Experience anchor routes to the new Experience page.
- [x] Check Olist resources and the DataCamp certificate link.
- [x] Run accessibility and production-build performance diagnostics.
- [x] Refresh screenshots and the handoff with the actual results.
- [x] Gate: all required local checks pass; any external availability issue is identified explicitly.

## Evidence and constraints

- Olist public/source revision: `ff33c00dfc4acf37ddc9197105c80eb0edfc882f`.
- Verified Olist scope: four dimensions, one order-item fact table, five quality queries, and two SQL reporting views.
- Olist currently uses full reloads. Incremental loading, slowly changing dimensions, orchestration, and a quantified performance improvement are not claimed.
- Olist's closing validation file is reserved; reported quality outcomes come from the existing documented checks, not a fresh database run in this website task.
- DataCamp credential: <https://www.datacamp.com/certificate/DEA0016972420970>.
- Melbourne remains unpublished pending accessible evidence and a contribution statement.
- A rebuilt CV PDF and missing credential verification links remain separate follow-ups.

## Execution record

Record each phase's commands, results, screenshots, and unresolved issues here before marking its gate complete. Failed or unavailable checks are never recorded as passes.

### R1 — PASS

- Removed withdrawn report code and metadata entirely; no draft or redirect advertises it. Removed the Home KPI strip and scrubbed old plan/handoff text and generated review/build artifacts.
- Created `/experience`, reused a high-level employment summary on CV, and retained compatibility for the previous Home experience anchor.
- Verified Olist's local/public source and DataCamp's certificate identity. Added the public Olist project and separated Home selection from catalog priority.
- Checks passed: `npm run lint`, `npm test` (10/10), `npm run build` (18 canonical routes), `npm run check:built`, and `npm run check:privacy` (152 text/source/build/documentation files).
- Original owner files, public source project repositories, and certification originals were not modified.

### R2 — PASS

- Home now has four compact project cards followed by separate full-width About Me and Areas of Practice sections. The desktop page height is 2,234px, reduced from the earlier 3,262px review build.
- Olist leads the Home and catalog selections. Data Engineering & Databases leads the practice list, and the four smaller projects are ordered last.
- Olist media, its report, and the DataCamp badge render across desktop and mobile checks. Final responsive screenshots are in `.qa/revision-final-browser/`.
- Public copy and metadata contain no obsolete Case Study, Guided, or Use Case terminology.

### R3 — PASS

- Static gates passed: lint, 10/10 tests, production build, 18-route metadata/schema/sitemap validation, privacy checks across 152 files, and `git diff --check`.
- Browser matrix passed 108 route/theme/viewport checks, 36 WCAG audits, and completeness checks for all 12 published reports. No horizontal overflow, missing image, browser error, or accessibility violation was found.
- Eight interaction groups and 21 dashboard accessibility states passed, including legacy navigation, keyboard, gallery, filtering, contact, theme, and history behavior.
- Development real-scroll checks passed on 18 routes and 58 image instances, including client metadata and print visibility.
- Link/media validation checked 134 rendered targets; 132 passed. DataCamp returned an automation-only 403 and the FRED page timed out, so neither external page is recorded as locally verified. Their URLs remain unchanged and the pinned inflation CSV is available as the data-source fallback.
- Mobile Lighthouse scores were 94–98 for performance and 100 for accessibility, best practices, and SEO across Home, Experience, CV, Projects, Contact, and Olist. All audited routes had zero cumulative layout shift.

## Release gate

- [x] Owner reviewed the revised preview.
- [x] Owner explicitly approved production deployment.
- [ ] Approved deployment completed and production routes/media were checked.
