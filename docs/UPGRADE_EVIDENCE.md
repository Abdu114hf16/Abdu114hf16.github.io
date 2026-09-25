# Portfolio upgrade — evidence register

The portfolio baseline is production commit `68714ab99445bdb8779fa94794abfa632bf33404`. Other local portfolio editions were not used as implementation sources.

## Public project sources

### New additions

- **Olist E-Commerce Data Warehouse:** local folder `C:\Learning\olist-data-warehouse` matches public revision `ff33c00dfc4acf37ddc9197105c80eb0edfc882f` at <https://github.com/Abdu114hf16/olist-data-warehouse>. `02_create_warehouse.sql` defines the order-item grain, four dimensions, role-playing dates, keys and constraints. `05_data_quality.sql` contains five annotated checks. `08_views.sql` defines two reporting views. `09_final_validation.sql` is empty/reserved. This version does not implement incremental loads or slowly changing dimensions, and no speedup figure is claimed.
- **DataCamp Data Engineer Associate:** the provided verification page identifies Abdullah Alshammari and the credential title: <https://www.datacamp.com/certificate/DEA0016972420970>. The official badge supplied by the owner is resized, not redrawn or restyled. No credential dates are inferred.
- **Current presentation:** the catalog uses domain filters only. The original course provenance remains in project details, while cards and SEO use Projects terminology.

Repository names below belong to `https://github.com/Abdu114hf16/`. Revisions were resolved with `git ls-remote <repository> HEAD` during implementation. Inspect files at the pinned revision when reproducing this review.

| Repository | Revision | Primary evidence |
|---|---|---|
| medical-insurance-cost-prediction | `e94b26b303dcba2a53848a8b71eeafb72030641f` | README results and evaluation disclosures; `medical-cost-prediction.ipynb`; `data/insurance.csv` |
| Optimizing_Donors_Outreach | `a38c3cfd1999cb1050e4aa6b0614a9eb20b004af` | Saved outputs in `finding_donors_report.html`; notebook preprocessing and split |
| MacroEconomic-Analysis-PowerBi | `4bb516f0a35b340b2cab2b0fa688f343aaea749f` | `Datasets/Inflation_fred_dataset.csv`, `Datasets/Industry Earnings.xlsx`, `Dashboard_Preview.pdf`, README source attribution |
| boolean-search-engine | `426e0b1dcb6c63df69d51dc43fb2f132d45eb3c8` | `docs/project_deck.pptx`, `search_engine.py`, `demo.py`, README |
| Commercial_Flights_Delays_Analysis | `045ac9022bf61df596fc19f7aa494bb6cb37b1b8` | README scenario/coverage/limitations; existing production `public/docs/CFD_Report.pdf` and six dashboard captures |
| Naive_Bayes_SMS_Classifier | `12a34e7222d3e66e281f5469e3c679e1056f0468` | `Naive_bayes.ipynb`, dataset scope, course attribution, baseline methodology |
| Ensemble_SMS_Classifier | `56c7027f0c8154315bdc848f8cb01683946813b6` | README comparison table and split; `Spam_&_Ensembles.ipynb` |
| Handwritten_digit_recognition | `b06196097e90c8de923f6aee2eb8013c44a276b7` | `Handwritting_Recognition.ipynb`, `demo_screenshot.png` |
| Eventia_Software | `6cd49882235f9cf093adfa66f604d6710729c42c` | README team/contribution/demo status; existing production report and UI captures |
| interactive-ksa-discovery | `0617ad322169721e549e71b1972d39636dcc47a4` | README individual-work attribution; redacted `Report.pdf`/`Presentation.pptx`; source workflows |
| ArabicOCR-NumToSpeech | `26995c1e149819554dc9387879c29b8076728223` | README manual-path scope, unavailable backend and privacy behavior; `index.html` |

The macroeconomic repository now resolves to `MacroEconomic-Analysis-PowerBi`; the older `MicroEconomic-Analysis-PowerBi` URL redirects there. No external repository was renamed by this implementation.

## Claim decisions

- **Employment confidentiality:** internal work is excluded from the public project catalog. Experience and CV contain only high-level responsibilities. Earlier project-level findings, descriptions, and generated review artifacts have been withdrawn.
- **Donor outreach:** saved report output gives 45,222 records (36,177 training and 9,045 testing), not approximately 32K. The reported 85.68% accuracy and 0.7223 F0.5 remain. Pre-split scaling and repeated test use are disclosed. Attribution to the Udacity exercise remains inside the project report.
- **Medical cost:** reported holdout results are baseline 0.807/$5,956, interaction-aware regression 0.909/$4,085, random forest 0.882/$4,664; cards round R² to 0.91. The public dataset has 1,338 records. Educational-use restrictions are explicit.
- **Income and Inflation:** FRED source `FPCPITOTLZGUSA` covers annual US inflation in 1960–2024 and peaks at 13.549201974968399% in 1980. Earnings cover four snapshots: 1990/2000/2010/2020. The unverified two-sector >35% workforce-share claim is omitted. Owner selected Independent with explicit Udacity scenario/data attribution.
- **Boolean:** presentation supports 209,527 indexed news records, using headlines and short descriptions. Several presentation queries exceed 100 microseconds; benchmark artifacts also differ in implementation. No universal sub-100-microsecond, exact vocabulary-size, or build-time claim is published.
- **SMS:** the two public repositories explicitly describe a Udacity exercise and its extension. Course attribution and personal implementation remain in the project report. The unified table preserves the four documented test-split comparisons, not a guarantee of future precision.
- **Digit recognition:** README 99.04% is not substantiated by a separate saved evaluation; the notebook's 98.93% is monitored validation during training. Neither is promoted as an untouched final holdout figure.
- **PlayStation:** production `src/pages/dashboard/ps-dash.json` gives 35,707 negative, 15,190 neutral, 5,780 positive (56,677 total), and Jul 1/Jul 2 day labels. Net sentiment is approximately -0.53, computed from class shares. The earlier -0.44 probability-based mean cannot be reconstructed from this label-only export and is not reused. The source post is collection context, not independent verification of a product announcement.
- **Eventia:** four-person team; backend/relational-database work and supporting AI integration are attributed using the public README. No authorized authority integration, production-scale operation, or assistant benchmark is claimed. The unverified hosting-transition demo is omitted.
- **Saudi Discovery:** public README identifies individually completed coursework and an offline original demo. Linked report is the repository's redacted version.
- **Arabic numeral prototype:** manual composition is documented for 0–1,000,000; image extraction depends on an unavailable external service. No image upload, recognition score, or unverified demo is embedded.

## Deferred evidence

- **Melbourne segmentation:** supplied public repository returned 404 again during implementation. No route, card, or sitemap entry is published. An accessible source and individual contribution statement are required.
- **New credential URLs:** no credential buttons are invented for Google Advanced Data Analytics, Predictive Analytics for Business, or McKinsey Forward. The completed programs appear as text; the four existing URLs undergo the final link audit.
- **CV PDF:** a separate approved rebuild is required before restoring download actions.

## Verification and media provenance

Per-phase results are recorded in `PORTFOLIO_UPGRADE_PLAN.md`. Media provenance, input hashes, actual dimensions, and derivation notes are in `docs/media-manifest.json`. Public repository plots/screenshots are kept distinct from explanatory diagrams or charts regenerated from documented results. No inferred chart metric is treated as a new measured result.

- Donor plots: four embedded PNG outputs from the pinned HTML report, optimized to WebP; the comparison chart uses the reported tuning table.
- Income: the public inflation CSV is plotted directly with checks for 65 observations and the 1980/13.55% maximum. Dashboard page 2 is a labeled excerpt excluding its top KPI row; page 3 retains source-snapshot context. The data-flow illustration is explicitly schematic.
- Boolean: diagrams show illustrative posting sets, not fabricated benchmark results.
- SMS: the repository's teaching matrix and a chart of the documented recall values accompany the full HTML comparison table.
- Digits: the original interface capture and two saved notebook images are paired with an explanatory preprocessing diagram. Example confidence is not described as benchmark accuracy.
- Saudi: seven UI screenshots extracted from the already-redacted report, excluding cover, account tables, identifiers, and code pages.
- Arabic prototype: static capture of the original public HTML with scripts disabled; no image was uploaded. The speech-flow diagram describes only the documented manual path.
- PlayStation: the cover contains an actual local render of the interactive dashboard's KPI and chart panels using the production dataset.
- FRED URL availability remains an external check: both direct requests and web retrieval timed out during verification. The pinned source CSV is accessible and is linked as an alternative resource.
