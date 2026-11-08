# M73 — Full regression audit and CI gate (2026-11-08)

## Scope and execution evidence
Reviewed latest GitHub main application, CPI tests, product/claims tests, privacy tests, translation tests, and previous M68–M72 handover. Created rollback branch `stable-2026-11-08-pre-m73-full-regression` before changes.

**Verified technical failure and fix:** M70's `tests/language-gaps-m70.test.cjs` inspected only the initial `ROWS` array (116 rows), then asserted it contained >=468 dictionary entries. Actual runtime dictionary is assembled through 33 `AR` blocks and language `AL` patches. This was a guaranteed false failure. Fixed the test to evaluate the entire dictionary initialization in a sandboxed Node `vm` context and inspect `Object.values(TD)`. Independent JavaScript inspection of the same source in the connected-tool runtime confirmed **468 assembled dictionary entries, zero empty/missing locale values, zero placeholder mismatches, and zero source keys missing from the translation-review CSV**. This validates structural parity only, not native translation quality.

**Unified test gate:** `.github/workflows/full-regression-m73.yml` checks syntax of `api/inflation.js` and all `tests/*.test.cjs`, runs `node --test tests/*.test.cjs`, and asserts critical source/handover files exist. Existing narrower CI workflows remain intact. **GitHub Actions execution outcome is not independently observable through the available connected workflow endpoints**; do not claim full Node suite passed. Attempt to clone the repository into local execution container failed due DNS/network restriction. This is a verification limitation, not evidence that application tests failed.

## Functional coverage and remaining gates
- Financial calculations, savings and income suitability: existing tests included in full-suite glob; formulas and product rules unchanged. Actual Node suite pass pending.
- Insurer claim figures and product details: M69 guards included; formal insurer/legal approval and original IRDAI workbook comparison (user deferred) remain open.
- Customer export privacy: M68 static allowlist and PDF checks included; injected-marker browser PDF/WhatsApp/print end-to-end checks and legal privacy approval still open.
- Seven locales: corrected full 468-key runtime dictionary parity check, but English-only claims/product disclosures remain; native-speaker/compliance signoff and rendered export review still open.
- CPI: M53/M71/M72 checks included; live October rollover cannot be verified before official publication, and zero/negative CPI frontend mismatch remains separate approval decision.
- Physical iPhone Safari saved-summary and WhatsApp review remains a human-device acceptance gate. Previously accepted M66 PDF fix unchanged.

## Change control
No changes to `needs-finder.html`, `api/inflation.js`, financial formulas, eligibility rules, claims numbers, language strings, PDF layout, or production settings. Changes confined to test correction, consolidated CI workflow and documentation. Do not mark M73 as a green release gate until the GitHub Actions run is independently confirmed.

## Next
Offer **M74 — CPI automation verification** with official release and source-link acceptance checks; do not invent the October CPI value or silently change the inflation floor.
