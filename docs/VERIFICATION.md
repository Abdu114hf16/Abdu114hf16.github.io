# Verification and preview

## Application checks

Use Node 22.18+ (Node 24 was used during this implementation) and the existing npm lockfile:

```bash
npm ci
npm run lint
npm test
npm run build
npm run check:built
npm run check:privacy
npm run preview -- --host 0.0.0.0 --port 4175 --strictPort
```

The production preview for this session is <http://localhost:4175>. Development runs at <http://localhost:5175>.

`npm run sitemap` updates `public/sitemap.txt` from shared metadata after publication changes. The build independently checks parity. `npm run og-card` regenerates the share card.

## Optional browser checks

Browser tools are isolated from application dependencies. Install Playwright, axe, and Lighthouse in a tooling directory, install its Chromium browser, and point `QA_TOOL_ROOT` at that directory. In this session the tooling directory is `/tmp/opencode`.

```bash
npm install --prefix /tmp/opencode playwright @axe-core/playwright lighthouse
/tmp/opencode/node_modules/.bin/playwright install chromium

QA_TOOL_ROOT=/tmp/opencode npm run check:browser
QA_TOOL_ROOT=/tmp/opencode npm run check:interactions
QA_TOOL_ROOT=/tmp/opencode npm run check:dev-media
QA_TOOL_ROOT=/tmp/opencode npm run check:links
QA_TOOL_ROOT=/tmp/opencode npm run check:lighthouse
```

Set `PREVIEW_URL`, `DEV_URL`, and `QA_OUTPUT` to override their defaults. Outputs go under `.qa/` and are ignored by Git. `check:browser -- --quick` performs the mobile route/accessibility checks without the full screenshot matrix.

On this WSL instance, Chromium's missing system libraries were extracted into `/tmp/opencode/browser-libs` without a system installation. The actual browser commands also used:

```bash
LD_LIBRARY_PATH=/tmp/opencode/browser-libs/usr/lib/aarch64-linux-gnu
```

Normal environments with browser prerequisites installed do not need this workaround. The supplied DevTools connection was unavailable; the recorded browser checks used actual headless Chromium instead.

### Coverage

- Published route, title, heading, canonical, social metadata and structured-data consistency.
- 1440/390/320px, light/dark themes, real-scroll image loading and overflow.
- WCAG 2.2 tagged axe checks on all canonical routes; additional dashboard theme/accent states.
- Cold and client-side anchors, skip links, Back/Forward positions and persisted theme.
- Domain-only filtering, editorial ordering, Home selection and draft exclusion.
- Native gallery keyboard containment, navigation, Escape and focus restoration.
- Dashboard filter counts, zero results and accessible data tables.
- Contact honeypot/timing guard, pending, accepted, rejected, offline and unconfirmed responses. All submissions are mocked; no test emails are sent.
- Reduced-motion behavior, separate Home sections, compact cards, credential badge and print visibility.
- Rendered internal/external links, media, reports, credentials and anchors. Blocked or timed-out external requests are recorded as unverified rather than successes.
- Mobile Lighthouse on Home, Experience, CV, Projects, Contact and the Olist project.

## Media regeneration

For the Olist screenshots and DataCamp badge, set `OLIST_DIR` to the provided public-project folder and `DATACAMP_BADGE` to the official local badge PNG, then run `npm run olist-media`. These source folders are read-only; optimized copies are added to the portfolio with a provenance entry.

Website builds use committed optimized images and require no network/Python media step. To deliberately regenerate public figures, install PyMuPDF in a tooling environment, then run:

```bash
MEDIA_CACHE=/tmp/opencode/media-source PYTHONPATH=/tmp/opencode/pydeps npm run project-media
```

The script downloads only pinned public project artifacts, extracts selected public figures, validates the inflation-source scope, and writes the provenance manifest. The original Arabic interface capture is a separate static, script-disabled artifact; its source revision is recorded in the evidence register. To refresh the PlayStation dashboard excerpt from a running preview:

```bash
QA_TOOL_ROOT=/tmp/opencode node scripts/capture-project-interface.mjs
```

Rerun media preparation afterward to compose the 16:9 cover. Review every regenerated image and its caption before accepting it. Media preparation uses public project artifacts only.

## Release

Review the preview and phase log before approving deployment. The separate release gate in `PORTFOLIO_UPGRADE_PLAN.md` requires explicit owner approval and post-deployment route/media checks. No commit, push, or production deployment is part of the current local implementation run.
