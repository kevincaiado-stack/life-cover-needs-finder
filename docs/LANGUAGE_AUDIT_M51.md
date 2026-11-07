# M51 — Priority 4 language consistency and review audit

Date: 2026-11-08. Seven languages: English (source), Hindi, Gujarati, Tamil, Malayalam, Kannada and Marathi.

## Automated findings and remediation

| ID | Finding | Remediation / evidence |
|---|---|---|
| L01 | 468 runtime translation keys; no missing language value in any of the six translated columns | M51 browser test checks all runtime `TD` entries and seven-language switching |
| L02 | No mismatched numbered placeholders among the runtime dictionary keys or the CSV review register | M51 browser test checks exact placeholder multisets and sample `fmt()` substitution; no calculation changes |
| L03 | Review register had 467 active entries, while runtime had 468: three review rows used obsolete source/translation wording and one current objection response was missing entirely | Updated CSV IDs **213 (official CPI attribution), 360 and 378 (runway objection variants), 389 (shared decision objection)** to match the deployed dictionary; added ID **468 (joint-decision objection)** with existing deployed translations. All four flagged for native-speaker/compliance review. No new translation was invented or substituted into application code |
| L04 | Risk of future drift between code and translation review register | New automated test compares the English source keys bidirectionally, requiring no unregistered runtime entries or obsolete register entries |
| L05 | M44 savings instructions, M45 customer/UX labels and M46 zero-gap objections are already populated in all six translated languages, but review metadata still indicates pending native-speaker sign-off | Preserve reviewer notes and keep P0 sign-off OPEN; especially 18 OBJ0 rows, savings allocation wording and UX1–UX8 labels |

## Audit scope and limits

The automated checks validate structural completeness, consistent placeholders, runtime language switching and source-register parity. They **do not** certify idiomatic translation, financial/legal appropriateness, cultural suitability or the correctness of the original English advice. Existing translations were copied exactly from the current runtime dictionary into the review register; **application financial calculations, claim figures, language text and advisor/customer privacy rules were not modified**.

M49 claims box and M47 dashboard contain some English-authored explanatory text that is not part of the established translation dictionary. Do not claim full seven-language coverage of all newly authored content; audit and obtain compliance-reviewed translations before release outside internal training.

## Sign-off still required

Assign a qualified native speaker for each of Hindi, Gujarati, Tamil, Malayalam, Kannada and Marathi, and a compliance reviewer for financial/product/objection statements. For each row record reviewer name, language, row ID, review date, approved or requested change, and evidence/reference. In particular review M44 savings, M45 UX, M46 OBJ0, CPI source wording and any untranslated M47/M49 text. **No native-speaker or legal approval is asserted by this automated audit.**

## Next priority

**Priority 5 — P1 real iPhone Safari UX / saved-summary print QA.** Offer Start or Skip. Retain formal P0 language approval as open until recorded.
