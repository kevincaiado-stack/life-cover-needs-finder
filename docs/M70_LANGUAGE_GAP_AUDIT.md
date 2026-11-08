# M70 — Priority 3 seven-language audit (2026-11-08)

## Scope and evidence
- Latest GitHub `main` source `needs-finder.html`, `docs/translation-review.csv`, and M51 report inspected. Supported locales: en, hi, gu, ta, ml, kn, mr. M51 documented 468 runtime dictionary rows, complete six translated columns, matching placeholder multisets, and synchronized active English keys after fixing review rows 213, 360, 378, 389 and adding 468. These are **M51 recorded test findings**, not a new native-speaker review.
- New M70 static inspection found a **material completeness gap outside the dictionary**: `csrBox()` builds English-only Canara HSBC Life claims figures, definition/press-release comparison and explanatory warning; these sentences are not entries in the CSV review register. Product `PD` details for IncomeNow and Promise4Life include English-only M59-approved premium/eligibility explanations not registered as translated rows. Other product details also remain English-authored. The `tx(s)` helper returns English for unknown keys, so selecting Hindi/Gujarati/Tamil/Malayalam/Kannada/Marathi does **not** guarantee full product/compliance-copy translation.
- Saved summary header/disclaimer/financial panel strings are assembled from translated UI plus some authored content; WhatsApp uses `tx()` for known labels. The M70 source audit does not establish rendered-script legibility or all-language export parity, which remain separate browser/physical-device acceptance checks.

## Work committed
- `tests/language-gaps-m70.test.cjs`: five tests for seven locale selectors and runtime dictionary completeness, placeholder multiset parity, active English source-key registration, explicit English-only product/claims disclosure gap inventory, and fallback semantics.
- `.github/workflows/language-gaps-m70.yml`: run Node regression on changes to language source, CSV or tests, and manual dispatch. **CI run success not independently observed at authoring.** Tests intentionally track untranslated financial disclosure gaps rather than pretending they are translated.
- **No speculative translations created.** No app code, financial calculations, claims figures, product rules, PDF export or existing translations changed. Preserve M59 approved English wording until compliance-reviewed translations are supplied.

## Priority 3 acceptance still OPEN
1. Qualified native speakers review all active UI strings, especially M44 savings, M45 UX, M46 objection responses and M51 flagged rows, with name, language, row ID, date and evidence.
2. Insurer compliance/product/legal owners approve localized claims definitions and current product brochure wording. Translate `csrBox()` and product `PD` content into all six non-English languages only from reviewed wording; register source keys and placeholders, then run regression tests.
3. Run seven-language rendered summary PDF/HTML and WhatsApp checks, including Indic font shaping and zero-gap/long-goal cases. Technical dictionary parity alone is not localization sign-off.

## Release control and next priority
Rollback `stable-2026-11-08-pre-m70-language-audit`. Priority 3 technical gap inventory completed; **full language localization and named native-speaker/compliance sign-off remain OPEN**. Next approved sequence item is Priority 4: official October 2026 CPI rollover, expected publication 2026-11-12; cannot assert release-specific success before publication.
