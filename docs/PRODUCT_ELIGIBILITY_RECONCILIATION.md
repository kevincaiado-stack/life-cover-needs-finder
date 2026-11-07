# M57 / Priority 10 — Product eligibility and multilingual disclosure reconciliation

Date: 2026-11-07. Status: **partially audited; authoritative product-brochure verification and compliance approval pending**.

## Gate evidence
User-provided GitHub Actions screenshots show latest successful green runs on `main`: M54 savings edge #2, M55 income suitability #2, and M56 eligibility boundary #3. M56 initial #1 failed, but #2 and #3 succeeded following test correction. This clears the user's Priority 7–9 CI gate.

## Repository inventory (not authoritative insurer eligibility)
| Product/variant | Current app-listed entry ages | Additional terms | Reconciliation status |
|---|---|---|---|
| Wealth Edge Invest Plus | 0–65 | 10–30 years | Official current brochure pending |
| Wealth Edge Life Plus | 18–65 | default to age 100 | Pending |
| Wealth Edge Premium Plus | 18–50 | 10–30 years; PPC | Pending |
| Secure Invest Choice / Forever | 18–55 | 20–40 years / to age 85 | Pending |
| iSelect Guaranteed Future Plus Endowment / Regular Income / Long Term ROP | 0–65 | maximum 20 / up to 40 / 15,20,30,40 years | PPC eligibility 18–55; pending |
| Income Now Early / Step Up | 0–50 | 20–40 years / maximum 80 years; Step Up special terms | Recommendation's global 18–65 gate prevents recommendations under 18; pending |
| Promise4Life variants | 0–65 | variant-specific income periods | Pending |
| Promise4Future Savings4Future | 0–60 | maximum term 70 years | Generic recommendation gate extends to 65; pending |
| Promise4Future Income4Future | 0–55 | maximum term 70 years | Generic recommendation gate extends to 65; pending |
| Young Term | 18–60 | up to 99 years; conditions apply | Pending |

## Confirmed code observations
- `rec0` globally returns no recommendation for age under 18 or above 65. This can be a deliberate advisor-user gate, but it is **not** equivalent to every product's insured-life entry-age rules.
- The Promise4Future recommendation branches do not independently enforce the Savings4Future 60 or Income4Future 55 upper entry ages shown in `PD`. **Potentially ineligible recommendations require compliance confirmation.**
- The Wealth Edge and iSelect PPC text uses separate age ranges. The insured/proposer same-person requirement appears in selected text. These must be validated against the applicable product version.
- `PD` and some recommendation strings are authored in English; the translation helper `tx` falls back to English for missing keys. Product detail HTML and training disclaimer should undergo native-language review in all seven locales; do not treat mere fallback as verified translation.
- The training-only disclaimer exists in `DISC` and is appended to product recommendations with recognized recommendation spans. Other informational and error branches may not use this wrapper. Customer-facing publication remains blocked pending compliance review.

## External source research limitation
The insurer's public site was consulted, but this session did not locate a current version-controlled official brochure for each named product and variant with matching UIN/version. **No official age, term, or premium claim is certified from the general insurer website.** The inventory above is extracted from repository text only, not independently validated.

## Decision / change control
No product eligibility logic, financial calculations, recommendation wording, language copy or customer-facing app HTML changed. Obtain insurer-approved brochure PDFs with UIN, variant and effective date; map each requirement to a citation and verify all seven locales. Only then propose precise corrections for user approval and run cross-language regression tests.

Rollback branch: `stable-2026-11-07-pre-m57-product-reconciliation`.

## M58 / Priority 11 — Official Canara HSBC Life evidence (2026-11-07)
Official insurer source of truth is **Canara HSBC Life Insurance**, not Axis Max Life. Official product registry: https://www.canarahsbclife.com/product-list . Confirmed UINs from that registry: iSelect Guaranteed Future Plus 136N098V06, Young Term 136N087V03, Wealth Edge 136L085V04, SecureInvest 136L092V02, Promise4Future 136N119V01, Promise4Life 136N120V01, IncomeNow 136N121V01. Historical withdrawn versions must not be used as current evidence (https://www.canarahsbclife.com/download-centre/product-closed-for-sale).

### Verified insurer evidence and discrepancy register
1. **IncomeNow 136N121V01**: official brochure https://www.canarahsbclife.com/content/dam/chli/pdfs/products/savings-and-investment/incomenow/english/product-brochure.pdf confirms entry age 0–50, maturity age 18–80; Early Income PPT 2/3/4/5/7/10/12 with different terms and minimum premiums; Step-up PPT 5/7/8/10/12 and term 3×PPT; Early Income income advance/arrears, Step-up advance only. Current app PD says minimum premium ₹50,000 for all variants, which omits Early Income PPT 2 (₹500,000) and PPT 3/4 (₹200,000) exceptions. App recommendation gate 18–65 prevents child-life suggestions despite insurer 0–50 entry. Do not alter without explicit approval.
2. **Promise4Future 136N119V01**: official https://www.canarahsbclife.com/savings-and-investment-plans/promise4future confirms Savings4Future age max 60 in annual mode and 50 non-annual, max maturity 75 annual/70 non-annual; Income4Future separate age/maturity restrictions. Current app PD shows age 0–60 for Savings and 0–55 for Income, but omits premium-mode and maturity constraints; generic 18–65 recommendation gate can over-recommend. Verify exact Income4Future age limit from variant brochure before changing.
3. **Promise4Life 136N120V01**: official https://www.canarahsbclife.com/savings-and-investment-plans/promise4life and https://www.canarahsbclife.com/content/dam/chli/pdf/product/promise4life/english/product-brochure.pdf confirm max entry age depends on PPT: 50 (PPT5), 60 (PPT7), 65 (PPT10/12); Assured Term Income minimum annual premium ₹36,000, unlike app PD blanket ₹50,000 for all variants. App simplified 0–65 entry without PPT caveat.
4. **Current UIN registry** provides identifiers but does not by itself validate all variants' age/term tables. Need brochure version-by-version evidence for Wealth Edge, SecureInvest, iSelect Guaranteed Future Plus and Young Term; no unverified values should be marked approved.

### Seven-language review
Source app contains en, hi, gu, ta, ml, kn, mr. Product detail markup is predominantly English; translation helper returns English when key missing. This is **not seven-language product-disclosure parity**. Native-language regulatory wording review and translation coverage testing pending. No insurer-approved translations were available in this audit.

### Change control / deployment
No approved financial calculations, recommendation eligibility logic, translations or app HTML changed. All suggested corrections require user's approval and compliance signoff. Prior M54–M57 Actions passed per screenshots. Vercel production previously READY at commit 259d3c21 but main had moved to b1cb760; Vercel status on latest commit showed build-rate-limit failure (upgradeToPro=build-rate-limit). Rate-limit is account/platform quota, not application test failure. Avoid repeated no-op deploys; inspect deployment quota in Vercel dashboard and wait for quota reset or seek explicit user authorization for plan changes. Do not claim resolution or exact production HEAD until verified. Rollback branch stable-2026-11-07-pre-m58-brochure-evidence.

## M59 — approved IncomeNow and Promise4Life copy corrections (2026-11-07)
- User explicitly approved **only** officially supported product-detail corrections, not recommendation-rule or financial-formula changes. Updated `needs-finder.html` `PD.inn` to replace misleading blanket ₹50,000 minimum with Early Income PPT2 ₹5,00,000, PPT3/4 ₹2,00,000, and reference to current brochure for other terms/Step up. Updated `PD.p4l` to replace blanket ₹50,000 with Assured Term Income minimum annual ₹36,000 and variant/PPT-specific caveat; added maximum entry ages PPT5=50, PPT7=60, PPT10/12=65. Source links and outstanding eligibility uncertainties remain in `docs/PRODUCT_ELIGIBILITY_RECONCILIATION.md`.
- App commit `edd4b6b4af05c2d85748099d18f56027709cfca8`; tests commit `54aa2c91d264c4eb48242661b3a9007bf686bb7e`; workflow commit `24f7622d8944e8aae88135b9bfedfe4de00cb4d3`. Rollback branch `stable-2026-11-07-pre-m59-approved-product-copy`.
- Six new tests in `tests/approved-product-copy.test.cjs` and GitHub Actions `.github/workflows/approved-product-copy.yml` run both new and M54–M57 tests. **CI run result not yet independently verified**.
- Seven language identifiers remain; only English insurer-approved product wording changed. No native-language financial copy fabricated; fallback remains English. Native-speaker and compliance signoff pending. No eligibility or calculation changes.
- Vercel subscription unchanged. Deployment build-rate-limit previously observed; production HEAD may lag latest GitHub commit. Verify latest workflow green and production SHA before calling release synchronized. Avoid further no-op deployments.
