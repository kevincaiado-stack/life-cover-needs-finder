# M74 — CPI automation verification and source-link safety (2026-11-08)

## Scope and authoritative publication status
- Checked official MoSPI/PIB September 2026 CPI release: All-India Combined General CPI inflation **5.54%**, published 12 October 2026, original PIB URL `https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3`. Official release schedules October 2026 CPI publication on **12 November 2026** or next working day. As of 2026-11-08, **do not invent or pre-populate an October CPI rate**.
- Inspected GitHub `main` `api/inflation.js`, frontend `loadInfl()`, `tests/inflation.test.cjs`, `tests/cpi-rollover-m71.test.cjs`, `tests/cpi-source-link-m72.test.cjs`, and latest Vercel production deployment.

## Verified defect and narrow fix
- **CPI-M74-01**: original `parseRelease()` required a CPI release headline but could extract a rate from a sentence referring to a different month/year. For example, an October headline plus a September rate sentence would be accepted and wrongly labelled October. Updated API to capture the rate sentence's month/year and require exact match to headline before accepting it. No financial formulas, thresholds, rate baseline, or frontend rendering changed.
- Added `tests/cpi-live-readiness-m74.test.cjs`: six cases for official September parsing, month mismatch, year mismatch, correctly matched newer release, fallback on mismatched newer release, and no-store source fetches.
- Added `tests/cpi-production-smoke-m74.cjs` (read-only, verifies live endpoint response shape, official PIB source URL, month monotonicity and explicit unavailable status) and `.github/workflows/cpi-verification-m74.yml` to run M53/M71/M72/M74 tests and the live smoke. GitHub Actions success **not independently observed** at authoring.

## Executed source-level scenarios (actual GitHub code in JS sandbox)
- Executed `parseRelease()` from the latest repository source with real-shaped September, synthetic October, and mismatched month fixtures: September **5.54%** accepted; synthetic October **6.21%** accepted only when headline/rate month match; mismatched month rejected. **6.21% is a synthetic test fixture, not official data**.
- Executed actual exported serverless handler with mocked official PIB HTML fetches: newer matching October response returned month/rate/source URL together; mismatched October returned pinned September **5.54%** and September PIB link; unchanged official listing returned September. All requests set `cache:'no-store'`.
- Executed actual frontend `loadInfl()` code with mocked fetch/localStorage: newer verified rate/month/link saved together; offline cached newer observation preserved its matching source link; older API response did not overwrite newer verified cache; legacy cache lacking source link ignored to prevent mismatched attribution.

## Live verification limitation and remaining gates
- Vercel production deployment status and Git SHA are verifiable through connected Vercel tools. However, direct HTTPS request to `https://life-cover-needs-finder.vercel.app/api/inflation` could not be completed from the execution container (DNS resolution failed), and web fetch returned an inaccessible endpoint error. **Do not claim actual live endpoint response or live smoke passed.** CI workflow provides a remote network-enabled smoke test; its result must be inspected before closing this gate.
- Actual October release, live API detection, displayed rate/month/link, iPhone Safari, and official source-link click-through must be checked after 2026-11-12 publication. If official discovery fails, retain the last verified observation and investigate PIB listing changes.
- Server accepts official zero/negative CPI but frontend continues positive-only gating, a separate product/financial floor decision. No implicit change approved.

## Change control
- Rollback branch `stable-2026-11-08-pre-m74-cpi-verification` created before edits. No app HTML, financial formulas, source rate, product rules, translations, PDF layout or customer export changes. Only narrow API parser correction, regression tests, CI and handover documentation.
