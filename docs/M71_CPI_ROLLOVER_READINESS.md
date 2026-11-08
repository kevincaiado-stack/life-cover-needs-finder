# M71 — Priority 4 official CPI rollover readiness (2026-11-08)

## Scope
Audited `api/inflation.js`, the app's `loadInfl()` / `infl()` / `stepInfl()` / `renderRet()` path, and `tests/inflation.test.cjs`. User requested this audit before the scheduled October 2026 official release on **2026-11-12**. **No actual October release rate is asserted.**

## Verified code behavior
- Serverless API fetches only official PIB CPI listing and a pinned verified September release. It parses the MoSPI CPI 2024=100 headline, month/year and all-India general year-on-year rate; rejects malformed/future/stale observations, and selects the newest valid candidate. It reports source URL and `stale` flag; when both official sources fail it reports `ok:false`, `stale:true`. The source's `valid()` permits zero and negative rates between -25% and +25%.
- Frontend starts at September 2026 5.54% with a PIB link. `loadInfl()` checks cached and API observations, updates the displayed source month and redraws inflation-sensitive results for an accepted newer rate. User adjustment is floored at the accepted `INFL` benchmark. These formulas remain unchanged.

## Findings requiring future decision
1. **CPI-01 (P1): server/client validity mismatch.** API accepts an official 0% or negative CPI but frontend `loadInfl()` explicitly requires `rate>0`, and `infl()` floors the user setting to baseline `INFL`. A valid zero/negative official release would therefore not roll over. Fix requires an explicit decision about baseline/slider behavior and regression of financial illustrations; no formula changed without approval.
2. **CPI-02 (P1): cached source provenance.** `ncInfl` stores only rate and month; if a later-month cached observation is used while the official API is unavailable, the app's initial `INFL_SOURCE` can still point at September's pinned release. The display's `LIVE` flag remains false until successful API retrieval. Store/validate source URL with cache and distinguish stale cache from verified live data in a future approved implementation.
3. **CPI-03 (P1): official listing discovery is brittle.** `candidates()` recognizes links whose visible label exactly resembles the CPI 2024=100 headline; if PIB changes its markup/label, the API falls back to September. Inspect official October publication on/after 12 Nov and verify `/api/inflation` returns `on:10/2026`, correct official rate and matching PIB source URL. Do not silently substitute an unofficial source.
4. **CPI-04: actual October rollover cannot yet be certified.** Check rate, month, source link, updated financial illustrations, user-adjustment minimum, caching, offline/failed-API fallback, seven languages, iPhone Safari and PDF/WhatsApp summaries once released.

## New regression coverage
- `tests/cpi-rollover-m71.test.cjs` contains six checks: October official headline parsing, future-month rejection, official listing candidate filtering, zero/negative API support, frontend positive-only discrepancy guardrail, and official-only fallback. Synthetic 5.81% is **a test fixture, not an official CPI claim**.
- `.github/workflows/cpi-rollover-m71.yml` runs M71 and prior M53 inflation tests. Workflow success not independently confirmed at authoring.

## Release control
Rollback `stable-2026-11-08-pre-m71-cpi-rollover-audit`. No application, API, formula, rate, source link, translations, or production configuration changed; only tests, CI workflow and documentation. Existing official September 2026 rate **5.54%** remains current baseline until a newer official release is verified. The user already has a daily official CPI monitoring automation; retain it rather than creating a duplicate.
