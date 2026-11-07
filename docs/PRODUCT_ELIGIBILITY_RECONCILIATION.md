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
