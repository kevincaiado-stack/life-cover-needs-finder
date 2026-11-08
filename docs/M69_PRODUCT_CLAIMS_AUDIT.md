# M69 — Priority 2 product and claims audit (2026-11-08)

## Scope and decision
Reviewed latest GitHub main claims/objection copy, product details, recommendation gates and prior M49/M58/M59 evidence. User instructed that retrieval of original IRDAI 2024–25 Table 15 workbook is **skipped for now**. This does not waive formal insurer/legal approval. **No business-rule, financial-calculation or application HTML changes authorized or made.**

## Claims findings
- Current app `CSR`: FY2025–26 **99.52%** and FY2024–25 **99.43%**, labelled **individual death claims settled by number**. The claim objection card explicitly distinguishes FY2025–26 insurer press-release **99.6%** (unmatched measure) and FY2024–25 **99.38%** overall individual+group. Primary insurer homepage, annual report and press-release URLs remain in `CSRL`.
- M49 independently reconciled insurer primary-source values. M67 secondary IRDAI-derived cross-check supports FY2024–25 99.43%, but original regulator workbook was inaccessible and user deferred it. **No regulator-original verification, FY2025–26 IRDAI certification, or compliance approval is claimed.**
- Current explanatory sentence “Claim settlement ratio means claims approved out of claims received” is a simplified training phrase; it should not be treated as a regulator-approved definition of the exact paid/settled denominator. Compliance should review exact wording before customer-facing use. Do not change without authorized approval.

## Product findings
- `PD.inn` preserves M59-approved IncomeNow Early Income PPT2 ₹5,00,000 and PPT3/4 ₹2,00,000 minimums; other PPT/Step-up refer to official brochure.
- `PD.p4l` preserves M59-approved Promise4Life Assured Term Income minimum annual ₹36,000 and PPT-specific maximum entry ages 50 (PPT5), 60 (PPT7), 65 (PPT10/12).
- `PD.p4f` still simplifies Savings4Future entry age to 0–60 and Income4Future to 0–55 without all premium-mode and maturity-age restrictions. M58 evidence indicates Savings4Future non-annual maximum 50 and annual 60; no user approval to change logic/copy. **Risk: recommendation age gate 18–65 does not enforce variant-specific maximum entry ages.**
- `rec0` globally gates recommendation ages 18–65; that gate is not a comprehensive insurer eligibility check. `pcat` uses retirement `t.y<=2` immediate-income suggestion. Both remain subject to product/suitability approval; do not present suggestions as personalized suitability determinations.
- Product detail strings remain predominantly English in the seven-language application; native reviewer and insurer-approved translation parity are Priority 3, not a completed compliance check.

## Automated guardrails
- Added `tests/product-claims-m69.test.cjs` with six source-invariant cases: claims figures/definitions, insurer URLs, IncomeNow and Promise4Life approved exceptions, recommendation gate/retirement cutoff, and exclusion of objection cards from customer summary.
- Added `.github/workflows/product-claims-m69.yml` to run new cases plus existing approved-product-copy, eligibility and income-suitability tests. Workflow run success **not independently observed at time of authoring**. Source-invariant checks are not official product certification or formal sign-off.

## Open approval gates
1. Insurer compliance/legal: exact claims statement and source definition, objections, training-only disclaimer, customer-sharing authorization.
2. Product owner: approved age/PPT/maturity matrix by UIN/version, recommendation eligibility gates, two-year retirement suitability cutoff.
3. Independent original IRDAI Table 15 workbook comparison: **deferred at user's instruction**, not completed.
4. Qualified native reviewers: six non-English languages, current product disclosures and all active strings.

## Release controls
Rollback branch `stable-2026-11-08-pre-m69-product-claims-audit`. App logic, values, PDFs, translations, formulas and deployment configuration untouched. Next approved work in sequence: Priority 3 language audit, then Priority 4 official October CPI release verification on/after scheduled 2026-11-12 publication.
