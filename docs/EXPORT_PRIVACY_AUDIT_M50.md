# M50 — P0 Customer Export Privacy Audit

Date: 2026-11-08. Scope: standalone HTML summary, print/PDF workflow and WhatsApp summary text in all seven app languages, advisor and customer screen modes.

## Findings and fixes

| ID | Channel | Finding | Remediation | Evidence |
|---|---|---|---|---|
| P3-01 | Saved HTML | M48 strict six-panel allowlist already excludes advisor objection/talking-point/product UI, but the privacy guarantee needed mode/language regression coverage | Retain allowlist; add tests for seven languages × two screen modes with deliberately populated advisor-only sections | `tests/mobile-smoke.test.cjs` M50 |
| P3-02 | Print/PDF | **Direct browser Print / Ctrl+P of the live advisor page could print the workspace rather than the sanitized standalone summary.** The live page print CSS hid several advisor elements, but it was not the same strict allowlist and could expose future unclassified sections | Block live workspace printing and show a privacy-safe instruction. The app's **Print or save as PDF** button opens `buildSummary()` in a separate print document, preserving landscape A4 dashboard and conditional appendix | Print CSS and M50 Chromium print-media test |
| P3-03 | WhatsApp | `sumText()` constructs a fixed list of financial figures, goal names and training disclaimer, not HTML/DOM advisor content | Preserve allowlisted text generator; test seven languages × two screen modes with injected advisor-only markers | M50 browser tests |
| P3-04 | Customer/advisor modes | Customer screen toggles Simple view but export must not depend on the screen mode | Export code is mode-independent; test 14 combinations | M50 browser tests |
| P3-05 | Training disclaimer | Training-only warning must appear in saved HTML and WhatsApp | Existing disclaimer preserved and regression tested | M48/M50 browser tests |

## Explicit export contract

Standalone HTML and app-button PDF include **only** six result panels when visible: `nmBox` (numbers and goals), `rwBox` (runway), `pmBox` (protection), `tlBox` (timeline), `mdBox` (charts/details), `finBox` (general family next steps). Nested product suggestion elements `.pcat` and buttons are removed. No unknown sections are automatically exported. WhatsApp uses `sumText()`, not the advisor DOM. Both outputs retain internal-training-only disclaimer. **No financial calculations changed.**

## Limitations and sign-off

- Automated Chromium checks validate DOM/print-media rules and WhatsApp text construction. They do **not** prove native iPhone Safari print, final rendered PDF page-by-page inspection, or WhatsApp's external UI.
- Complex goals and translated scripts may trigger appendix pages. Confirm real output is legible, complete and free of advisor-only content.
- **Technical privacy mitigation implemented; manual privacy/compliance sign-off still OPEN**. Formal insurer/legal approval of customer-facing use has not been granted.
- Direct browser print intentionally displays instructions instead of the live page. Use the in-app **Print or save as PDF** button for a customer-safe dashboard.

## Next decision

**Priority 4 — P0 native-language sign-off.** Review M44–M46 translations, especially new objection scripts, with named reviewers and evidence. Offer Start or Skip. No reviewer approval can be fabricated.
