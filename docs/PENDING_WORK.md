# Deferred Work Register — Life Cover Needs Finder

> **Manual QA update:** 2026-11-07 — User-reported manual QA confirmation: all five Priority 5 physical iPhone Safari checks PASSED. Scope reported as the five requested checks; no screenshots, iOS build, or independent reproduction supplied. M52 automated Chromium 19/19 previously passed. Close user manual QA checklist only; formal compliance/privacy/native-language approvals remain open. Next: Priority 6 official CPI freshness, stale/offline fallback and recalculation (Start/Skip).

Updated: 2026-11-07 | Current application milestone: **M52** | Source of truth: GitHub `main`

This is the **authoritative future-work queue** shared by Claude and ChatGPT. Read alongside `docs/AI_HANDOVER.md` and `docs/PROJECT_STATE.md`. No item below is permission to change financial rules or publish unapproved advice. Update status and evidence links as tasks are completed. Priorities reflect risk, not a commitment to build without user approval.

## M52 — Priority 5 iPhone/print QA: automated fixes complete, physical sign-off open
- **P1 IPHONE / PRINT technical remediation DONE:** A4 landscape first page measured at 194mm printable height; 281mm width, conditional appendix retaining every panel, font-ready print, PDF regression and seven-language export checks. **19/19 Chromium tests passed.** See `docs/IPHONE_PRINT_AUDIT_M52.md`.
- **P1 physical iPhone Safari verification OPEN:** customer/advisor modes, tap targets, real iOS print preview/PDF, saved HTML, WhatsApp external UI, long multi-goal appendix and Indic-script clipping. Require screenshots without customer data and iOS version. Do not call this complete until actual device review.
- **Next Priority 6 — P1 CPI:** verify official MoSPI/PIB freshness, stale/offline behavior, month label and recalculation, Start or Skip. Do not change financial rules without approval.

## M51 — Priority 4 language audit: structural fix completed, approvals open
- **P0 LANGUAGE automated integrity: DONE.** 468 runtime keys checked across six translations; no blanks or placeholder mismatches. CSV review register reconciled (IDs 213, 360, 378, 389 updated, 468 added), automated source-key parity test added. See `docs/LANGUAGE_AUDIT_M51.md`.
- **P0 LANGUAGE formal approval: OPEN.** Qualified native-speaker review for M44 savings, M45 UX and M46 OBJ0 objections (18 flagged rows), plus older flagged product/compliance copy and untranslated M47/M49 explanatory content. Capture named reviewer, language, row ID, date and evidence. Do not mark signed off based on automated checks.
- **Next Priority 5 — P1 IPHONE:** physical Safari customer/advisor UX, saved landscape A4 first-page dashboard, conditional appendix, PDF/WhatsApp output; Start or Skip for now.

## M50 — Priority 3 privacy remediation, next Priority 4
- **P0 EXPORT-PRIVACY technical fix IMPLEMENTED:** direct browser print now blocks the live advisor workspace and directs users to sanitized in-app Print/PDF; HTML export uses six-panel allowlist; WhatsApp text uses explicit fields. Seven languages × customer/advisor modes have automated privacy regression tests. See `docs/EXPORT_PRIVACY_AUDIT_M50.md`.
- **P0 privacy final sign-off OPEN:** inspect real iPhone Safari saved HTML, generated PDF pages, print and WhatsApp external UI, especially translated and complex-goal cases. Compliance/legal must approve any external sharing.
- **Next Priority 4 — P0 LANGUAGE:** native-speaker sign-off for M44–M46 additions and current seven-language content, with reviewer name, language, row IDs and date. Offer Start or Skip; do not invent approvals.

## M49 — Priority 2 claim verification results and next action
- **P0 CLAIMS primary insurer verification: DONE for displayed values.** FY2025–26 99.52% individual death claims from official insurer website; FY2024–25 99.43% individual death claims from insurer annual report. Press release's 99.6% is a separate insufficiently defined claim and not safely interchangeable; FY2024–25 combined individual+group 99.38% is distinct. See `docs/CLAIMS_SOURCE_AUDIT_M49.md`.
- **Still OPEN:** direct IRDAI Table 15 workbook reconciliation; compliance/legal sign-off of exact customer-facing wording and definitions. Do not treat this as formal compliance approval.
- **Next Priority 3 — P0 EXPORT-PRIVACY:** verify real saved HTML, PDF/print and WhatsApp across advisor/customer modes, zero-gap, all languages; Start or Skip for now.

## M48 remediation status — P0 compliance remains open
- **C06 technical fix implemented:** explicit allowlist for customer HTML/PDF print summary, excludes advisor-only sections, preserves training disclaimer; automated regression coverage added. **Do not close privacy sign-off** until saved HTML, real PDF/print and WhatsApp are reviewed on real devices.
- **C01/C02/C03/C04/C05/C07/C09 still require external or primary-source evidence.** Formal compliance approval cannot be self-issued. No business rules or claims statistics changed. Full ledger: `docs/COMPLIANCE_AUDIT_M47.md`.
- **Next choice remains Priority 2 — claim-settlement ratio source verification**. Offer Start or Skip for now. Skipping leaves C01 P0 open.

## M47 priority progress and next decision (2026-11-07)
- **P0 COMPLIANCE — preliminary audit DONE, formal sign-off OPEN.** See `docs/COMPLIANCE_AUDIT_M47.md` findings C01–C09 and named approval roles. HOLD for external/customer-facing use.
- **P1 PRINT/DASHBOARD — implementation DONE, QA OPEN.** Landscape A4 dashboard, KPI tiles, two-column layout, conditional appendix; test HTML/PDF on real iPhone and desktop, all languages, long goal lists, print pagination and legibility. Print/export advisor-only exclusions require manual validation. Fixed landscape canvas may scroll horizontally on phones when previewing saved HTML.
- **Next priority decision: P0 CLAIMS / C01** — validate FY2025-26 99.6% and FY2024-25 99.43% against original insurer/IRDAI publications, definitions and links. Offer **Start** or **Skip for now**; skip does not close the risk.
- **P0 COMPLIANCE stays OPEN** until authorized reviewer signs off on the exact version, objections, suitability, training disclaimer and translations. Initial audit alone does not satisfy approval.
- Rollback before M47: `stable-2026-11-07-pre-m47-dashboard-compliance`.

## M46 verification ledger and prioritized next work

**Current baseline:** M46 app SHA `1fd25417900e7cb0b3d1e478e6ac574f2063ee5c`; Vercel READY on matching SHA; latest mobile Chromium and runway workflows passed. M45 UX1–UX8 and M46 UX9 are **implemented**, not still planned. M44 savings scenario remains active. Older dated sections below are historical details; this ledger governs current status.

| Priority | ID | Open task | Verified vs outstanding / closure evidence |
|---|---|---|---|
| P0 | COMPLIANCE | Approve suitability, objection wording (including M46), financial illustrations and internal-training disclaimer before external use | Reviewer and exact approved version recorded; currently **not approved** |
| P0 | CLAIMS | Verify 99.6% FY2025-26 / 99.43% FY2024-25 claims figures, metric definitions and primary insurer/IRDAI disclosures | Official source PDFs, year and metric reconciled; currently **unverified** |
| P0 | EXPORT-PRIVACY | Ensure no advisor-only objections, product guidance or tips appear in saved summary, WhatsApp, print/PDF across both screen modes | Automated UI tests passed; **real exported files/messages still need manual audit** |
| P0 | LANGUAGE | Review active translations, specifically M45 UX labels and M46 18 OBJ0 strings (plus M44 strings) | User-reported native-speaker verification exists but exact scope unspecified; record reviewer/language/row and sign-off. Do not treat M46 as reviewed |
| P1 | IPHONE | Full real iPhone Safari UX1–UX9 and seven-language audit, customer mode, sticky strip, Enter behavior, saved summary | User-reported partial pass (savings, Simple view, Hindi), **not full coverage** |
| P1 | CPI | Verify next genuine MoSPI/PIB monthly release automatically updates site and calculations; handle PIB listing lag | September 2026 5.54% was live-verified; next release rollover **not yet proven** |
| P1 | INCOME | Confirm two-year immediate-income suggestion cutoff | User/product expert approval and regression tests |
| P1 | SAVINGS | Check full-funding overflow, zero-year goals, custom input extremes and proportionate split behavior | M44 browser tests passed; edge cases and business acceptance remain |
| P1 | PRINT | Clarify desired saved-summary length: current A4 output is multi-page, approximately 3–4 pages in sample | User approves multi-page or separately requests a true one-page redesign; test on mobile and desktop |
| P2 | MIRRORS | Confirm Claude artifact/Project mirror sync to GitHub M46 | External copies not verified; GitHub remains authoritative; Google Drive frozen |
| P2 | CLEANUP | Archive retired M42 strings and unused old Returns translations without losing audit history | Check live references and retain history; do not change product rules |

**Completed (do not reopen without a regression):** M44 savings presets and custom input; M45 UX1–UX8; M46 no-gap objections; GitHub/Vercel deployment match and automated M46 workflow success.

**Documentation-only reconciliation rollback:** `stable-2026-11-07-pre-m46-doc-reconcile`. No app code, product rules or translations changed during reconciliation.

### Historical backlog below
Items below were written during M44/M45 and may repeat the current ledger or contain obsolete 'pending UX build', 'one-page' and review labels. Update or close items against this ledger, not by interpreting historical headings as current instructions.

## HISTORICAL M45 program record — UX1–UX8 completed (not still executing)
Rollback: pre-ux branch `stable-2026-11-07-pre-ux` = state before this program; each step gets its own `stable-2026-11-07-uxN` branch. All new text needs 7 languages + translation-review.csv rows. No financial-rule changes. Advisor-only content stays out of print, saved summary and WhatsApp.
1. UX1 Advisor / customer split: a "Customer screen" toggle hides advisor-only cards (objections, product suggestions on timeline) on screen, not just in print.
2. UX2 Sticky key-numbers strip: cover gap, protection %, how long the family can last, always visible at top of results.
3. UX3 Collapsible sections: group result cards (Your numbers, Your timeline, Talking points) with headings.
4. UX4 Simple View is the default for the customer screen; key sentence in large text.
5. UX5 Guided form: progress line (Step x of y), numeric keyboard (inputmode) on money/age fields, friendly example placeholders.
6. UX6 Language switcher at top, language names in own script (English, हिन्दी, ગુજરાતી, தமிழ், മലയാളം, ಕನ್ನಡ, मराठी).
7. UX7 Polish: same colour = same meaning (red gap, green covered), tap targets >= 44px, contrast, readable Indic font sizes.
8. UX8 Saved summary with header, date and disclaimer; actual output can span multiple A4 pages (not a strict one-pager).
Status log: see PROJECT_STATE.md (entries UX1..UX8). If a step is not marked done there, it is not built.

## M44 GitHub/Vercel synchronization — 2026-11-07
- Monthly savings presets, custom input and proportional split across goals are committed to GitHub main and deployed to Vercel. New regression test covers allocation without double counting and interactive controls.
- Browser test originally failed because synthetic goals were reset by the normal render() after clicking a preset; regression fixture corrected in commit `92baa9cd2565d44938e821542a596a7c6fe70919`. Actions run `42360399150` completed **successfully** (8 mobile Chromium browser tests including new M44 scenarios).
- Vercel READY on `92baa9cd2565d44938e821542a596a7c6fe70919` was confirmed. Documentation-only follow-up commits will update the production SHA without changing app code.
- Outstanding: physical iPhone Safari, six native-language reviews, compliance sign-off for allocation illustration and overflow/fully-funded-goal behavior; see PENDING_WORK.md.

## M44 savings scenario follow-ups (2026-11-07)
- **P0:** Native-speaker review of savings strings (translation-review.csv rows 440–442); compliance approval of illustrative goal allocations.
- **P1:** Real iPhone Safari checks of presets, custom keyboard, seven languages and goal allocations; validate due-now goals and custom extremes.
- **P2:** Proportional allocation does not reallocate surplus after a goal is fully funded. Consider priority-based/user-defined splits only with explicit approval.

## P0 — must address before external/customer-facing use

| ID | Work | Status | Completion / acceptance check |
|---|---|---|---|
| P0-01 | Compliance approval of insurance plan suitability, objection responses, financial illustrations and training-only disclaimer | Pending external sign-off | Compliance reviewer signs off exact approved wording; preserve internal-training-only restriction until then |
| P0-02 | Validate claim-settlement-ratio box: FY2025-26 99.6% and FY2024-25 99.43%, definition (number/amount, claim type), official insurer/IRDAI source documents and link validity | Pending evidence | Read primary PDFs, verify scope and date; remove/qualify unsupported figures before external use |
| P0-03 | Customer-output privacy and advisor-only content exclusion across print/PDF, saved summary and WhatsApp | Automated partial coverage; manual QA pending | Test real outputs in all supported flows; objection answers, plan-type suggestions and other advisor-only material must not leak |
| P0-04 | Native-speaker sign-off for Hindi, Gujarati, Tamil, Malayalam, Kannada, Marathi (active R24-R31 and earlier text; exclude retired R32 unless revived) | Pending | Reviewer initials/date, issues and approved corrections recorded per active row in translation-review.csv |

## P1 — high priority reliability / real-device verification

| ID | Work | Status | Completion / acceptance check |
|---|---|---|---|
| P1-01 | Verify automatic detection of the first *newly published* official monthly CPI release, expected 12 Nov 2026 | Pending real release | Compare official MoSPI/PIB release, production /api/inflation month/rate/sourceUrl and displayed recalculated projections; no manual code change, no third-party source |
| P1-02 | Official CPI discovery resilience when PIB ministry listing lags | Known risk | Confirm newer release is discoverable promptly via reliable government-only listing/API; tests for lag, downtime, fallback, new-month rollover; don't imply immediate update if listing is stale |
| P1-03 | Actual iPhone Safari end-to-end check | Pending | Check all seven languages, mobile layout, input editing, plan toggles, timeline, Simple view, summary, source link and recalculation on physical iPhone |
| P1-04 | Print/PDF and WhatsApp real-world QA | Pending | Verify layout, figures, language rendering and advisor-only exclusions on iOS and desktop |
| P1-05 | Confirm two-year cutoff for suggesting immediate income products | Pending business approval | User/product specialist explicitly approves or changes the cutoff; add tests and translations if adjusted |

## P2 — workflow / maintenance

| ID | Work | Status | Completion / acceptance check |
|---|---|---|---|
| P2-01 | Synchronize Claude artifact and Claude Project copies against GitHub M43 | Not verified; access-dependent | Confirm matching file contents or record that mirrors are intentionally stale. Never assume sync. GitHub main is authoritative |
| P2-02 | Clean obsolete/dead translation rows and retired R32 M42 rows | Deferred, low risk | Identify active references first; archive retired rows without losing audit history; avoid removing active translations |
| P2-03 | Improve single-file maintainability and expand browser/edge-case coverage | Deferred | Scope separately; preserve formulas, languages and advisor-only restrictions; all tests green |
| P2-04 | Confirm rollback branches after each future change | Ongoing workflow | Record pre/post branch names and exact SHAs in handover; no force-push/rewrite |
| P2-05 | Audit product brochure links, annual claim figures and time-sensitive regulatory language periodically | Deferred periodic review | Revalidate against current official documents and record date/evidence |

## Explicitly not approved / not in active scope

- Goal-type allocation percentages, a replacement 'Rethink your strategy' card, 'how money is placed today' controls, insurer premium estimates, customer accounts/database/DPDP work, and a 'How we worked this out' page. Discuss and obtain approval before building.
- M42 'Rethink your strategy' card was removed by user request in M43; do **not** restore it as a backlog task.
- Google Drive remains deliberately frozen at `e5a2eff`; do not update without an explicit request.

## Verification snapshot — 2026-11-07

- M43 application SHA: `02e969152f2cc2e996436b7b39d26197de709842`.
- Vercel production was READY on this SHA; mobile Chromium and runway workflows passed on this SHA.
- Production `/api/inflation` returned `5.54%`, reporting `09/2026`, source `MoSPI via PIB`, official source URL https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3 .
- Automated checks are not equivalent to native-speaker, compliance, iPhone Safari, real print/PDF or WhatsApp verification.
- CPI monitoring automation is scheduled to check from 2026-11-12 at 18:00 Asia/Kolkata. Monitoring does not itself prove successful detection of a future release.

## Workflow for the next assistant

1. Read current GitHub `main` and the three documents; identify current SHA, tests, deployment and highest pending item.
2. Ask for approval before changing unapproved financial/product guidance; otherwise execute explicitly requested maintenance tasks.
3. Create a pre-change rollback branch, make the scoped change, run tests, update these documents, commit main and verify production.
4. Move completed items to a dated completed section with proof; do not silently delete them.
