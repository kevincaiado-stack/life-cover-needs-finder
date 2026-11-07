# Deferred Work Register — Life Cover Needs Finder

Updated: 2026-11-07 | Current application milestone: **M43** | Source of truth: GitHub `main`

This is the **authoritative future-work queue** shared by Claude and ChatGPT. Read alongside `docs/AI_HANDOVER.md` and `docs/PROJECT_STATE.md`. No item below is permission to change financial rules or publish unapproved advice. Update status and evidence links as tasks are completed. Priorities reflect risk, not a commitment to build without user approval.

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
