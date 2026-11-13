## CPI October 2026 production correction (2026-11-13)
- Official MoSPI/PIB release dated 12 Nov 2026: October All-India Combined CPI General year-on-year **6.09%** (base 2024=100), https://www.pib.gov.in/PressReleasePage.aspx?PRID=2335416&lang=1&reg=3.
- Production initially returned September 5.54% (`09/2026`) despite October release. Root cause: discovery depends on PIB ministry listing, which can lag or omit the latest release. Added October official verified URL to checked fallbacks while retaining older verified release and live discovery for future months; added regression test for empty listing. No financial calculations changed.
- GitHub main code commit `d68fc8a`, regression test commit `f48d5a2`. Vercel production deployment `dpl_6Gdziw5GyCBoei3FS191y36AqHWg` READY on `f48d5a2`. Live `/api/inflation` confirmed HTTP 200 `ok:true`, `rate:6.09`, `on:10/2026`, correct official `sourceUrl`, `stale:false` at 2026-11-13 17:46 IST.
- Regression test added but automated test execution/Actions conclusion not independently observed in this run; follow up CI verification. Future monthly release discovery still requires monitoring.

# AI Handover

## M77 user acceptance + safe rollback point (2026-11-08, 20:21 IST)
- User checked on a real iPhone: the translated **Download summary PDF** button, tip line and messages work in the selected language ("Yes it works"). M77 is **accepted by the user**. Native-speaker approval of the 8 new texts (`docs/native-review-buttons-M75-M77.csv`) is still pending.
- **Safe rollback point:** branch `stable-2026-11-08-m77-user-accepted` at commit `7e5aa5b` (app code from M77 `26f5553` plus a test-pattern fix). Previous accepted point: `stable-2026-11-08-m76-user-accepted`.
- Documentation-only checkpoint; no app code changed.

## M77 — Download summary PDF button translated in all 7 languages (Claude, 2026-11-08)
- User asked that buttons change with the selected language. Audit (Hindi, Tamil, then all 7): the Fit page/Larger/Largest buttons and Print button already translated; only **Download summary PDF**, its tip line (`#dlHint`, contains `<b>`) and the three status messages (preparing / requested / could not be prepared with `{0}`) were hard-coded English. Added 5 `AR` rows (tag DLPDF in `translation-review.csv`) and wrapped the messages in `tx()`/`fmt()`. No layout, PDF, formula or privacy change.
- Verified in Chromium for en/hi/gu/ta/ml/kn/mr: button, hint (bold kept) and messages show the right language, no page errors; all 18 test files pass (`tests/pdf-download.test.cjs` now 8 tests).
- Note: a status message already on screen does not re-translate until the next click (minor, accepted).
- Review list for native speakers: `docs/native-review-buttons-M75-M77.csv` (8 rows: READVIEW 3 + DLPDF 5). **Pending native-speaker approval.** Rollback: `stable-2026-11-08-pre-dltr` (before) and `stable-2026-11-08-m76-user-accepted` (last accepted).

## M75/M76 user acceptance + safe rollback point (2026-11-08, 20:14 IST)
- User tested on a real iPhone: saved-summary **Fit page / Larger / Largest** works (M75), and the sharper **Download summary PDF** (M76, capture scale 3) is "perfect". Treat both as **accepted by the user**. This closes the phone-read-view and PDF-sharpness requests only; native-speaker review of the 3 new button labels (READVIEW rows in `translation-review.csv`), compliance sign-off and all-7-language real-device checks remain open.
- Verified: GitHub `main` = `02d756aa024fd88aaa5e7408ac170a8fb8910c7b`; Vercel production deployment `dpl_6kQbPSsXo39u33ynYUUYU7AiBfjw` is READY on the **same SHA**; all 17 test files pass (M75b).
- **Safe rollback point:** branch `stable-2026-11-08-m76-user-accepted` at `02d756a`. Do not modify it. Earlier points: `stable-2026-11-08-pre-sharppdf`, `stable-2026-11-08-readview`, `stable-2026-11-08-pre-readview`, `stable-2026-11-08-m66-user-accepted-pdf`.
- Only documentation changed in this checkpoint; no app code.

## M76 — Sharper downloaded PDF (Claude, 2026-11-08)
- User confirmed Larger/Largest works on the saved summary page, but asked for the same on "Download summary PDF". A PDF image cannot hold buttons, so (user chose "Sharper PDF") html2canvas capture scale raised 2 -> 3 (line ~1373) so pinch-zoom on a phone stays crisp. Same 3 pages, same layout, jsPDF/CDN flow unchanged. Test added in `tests/pdf-download.test.cjs` (7 tests).
- Not verified: real iPhone PDF (could not run html2canvas offline here). Expected page canvas ~3190x2190 px (~7M px, under iOS canvas limit) but if download fails on iPhone, set scale back to 2 (rollback branch `stable-2026-11-08-pre-sharppdf`). Other options offered but not chosen: phone-size PDF; button opening Larger view.

## M75 — Phone read view for the saved summary, same layout (Claude, 2026-11-08)
- User asked: "add a phone friendly view but ensure the layout stays identical." Built on top of M62/M63 (3 fixed A4-landscape sheets, viewport width=1062) and merged with the other AI's M64–M74 (all auto-merged, no conflicts).
- Change (only inside the saved-summary export, `SUM_CSS` + summary script + summary body HTML): a bottom toolbar `#viewBar` with three buttons **Fit page** (default, whole sheet fits phone), **Larger**, **Largest**. Shown only on touch devices with screen <900px; hidden in print/PDF (`.tb{display:none!important}`). `setView(n)` swaps `<meta viewport>` between `width=1062` and `width=device-width,initial-scale=1`, adds `body.rd`, sets stage zoom = clientWidth/1062 × 2.2 (Larger) or 3.2 (Largest); `.vp` wrapper scrolls sideways. Sheets, panels, order and print/PDF output are unchanged (same 3 sheets; Chromium check: sheet width/height ratio identical, PDF still 3 pages, no `{n}` placeholders).
- 3 new labels in 7 languages (rows in `AR`, tag READVIEW in `docs/translation-review.csv`) — **native-speaker review pending**.
- Test added to `tests/summary-layout.test.cjs` (8 tests). Rollback branches: `stable-2026-11-08-pre-readview` (before this change) and `stable-2026-11-08-readview` (after).
- **Not verified:** real iPhone Safari (dynamic viewport-meta switching is only tested in Chromium emulation). If Larger/Largest do not zoom on a real iPhone, fall back to zoom only (keep width=1062) and scroll in `.vp`. The M66 html2canvas PDF capture is untouched (toolbar is outside the sheets); source tests pass but a fresh iPhone PDF check is advised.
- **M75b fixes (2026-11-08):** all 17 test files now pass. (1) `tests/mobile-smoke.test.cjs` test 6: mock CPI response lacked `sourceUrl`, which the app now (correctly) requires — mock updated, app unchanged. (2) `tests/cpi-rollover-m71.test.cjs`: stray `});` syntax error removed. (3) `api/inflation.js` `valid()`: changed `k<=n` to `k<n` so the current, not-yet-published month is rejected (matches the M71 test intent: future months rejected). Re-check this API rule if CPI rollover misbehaves.

# AI Handover — Life Cover Needs Finder

## M63 current-state verification — ChatGPT, 2026-11-08 14:10 IST
- Read current GitHub `main` handover before writing. GitHub HEAD `6272f589456510771d57bdcb42c80493fc0305fa` is M63 phone viewport/shrink-to-fit. Connected Vercel production deployment reports `READY` at the **same SHA**, so the prior M60 build-rate-limit / older-production-commit blocker is superseded and no redeployment is required at this time.
- **Canonical current design is M62/M63**, not M60: saved HTML and Print/PDF share three fixed A4 landscape sheets; M63 uses 1062px viewport for full-sheet visibility on phones, with JS zoom fallback. Do **not** reapply M60 responsive single-column styles or its dynamic appendix approach over M63.
- M62 handover reports all nine test files green and seven-language three-sheet/three-PDF-page checks; M63 handover reports Chromium emulation on iPhone 14, Pixel 7 and iPad Mini. These are **prior recorded test claims**, not fresh tests run during this verification. Physical iPhone Safari download/open, pinch-zoom and iOS Print/PDF parity remain unverified. The M60 GitHub Actions workflow status was not independently retrieved in this check and should not be used to overturn the newer M62/M63 test report.
- Next action: user opens a **newly generated** saved HTML summary on a physical iPhone and checks (1) all three sheets fully visible without horizontal clipping, (2) pinch zoom legible, (3) Print/PDF exactly three A4 landscape pages, (4) all financial panels/charts and appendix preserved, and (5) no advisor-only content in customer export. Collect screenshots or precise failure description before any further layout edit.
- No application code, financial formulas, eligibility guidance, translations, Vercel subscription, or deployment settings changed in this documentation-only update. Formal compliance and native-speaker review remain pending. Future changes should first refresh HEAD and deployment SHA because Claude and ChatGPT share the same `main` branch.

## M63 — Phone fix for the M62 saved summary (Claude, 2026-11-08)
- User report: on a phone the saved summary opened partially and most information was not visible. Cause: M62 relied on `width=device-width` plus JS zoom; the fixed 281mm sheets were wider than the phone viewport and `body{overflow-x:hidden}` hid the rest.
- Fix: the saved HTML now uses `<meta name="viewport" content="width=1062">` (281mm at 96dpi) and `body{min-width:1062px}`, so phone browsers scale the WHOLE page to fit the screen (like a PDF) and the user can pinch to zoom; no horizontal clipping. JS stage zoom stays only as a fallback for browsers that ignore the viewport meta. Checked in Chromium device emulation (iPhone 14, Pixel 7, iPad Mini): innerWidth 1062, sheet fully inside viewport. Real iPhone Safari NOT verified: user must re-check.
- Added a test in tests/summary-layout.test.cjs. Rollback: `stable-2026-11-08-pre-phonefix` (before), `stable-2026-11-08-phonefix` (after). If text is too small on phones, the next option is a separate phone-readable view, but the user asked for identical layouts.

## M62 — Saved summary and Print/PDF now share ONE layout (Claude, 2026-11-08)
- User report: "Save summary" file and "Print or save as PDF" looked different. Causes found: the saved HTML re-laid itself out for phones (single column) while print used landscape; two conflicting `@page` margins (8mm and 9mm); print let boxes split across pages and put the priority chart on a 4th page; overflow was moved by JS into an "appendix" differently on screen and print.
- Fix (only `SUM_CSS` and the tail of `buildSummary` in needs-finder.html): the export is now THREE fixed A4-landscape sheets (281mm x 193mm) inside `.stage`: sheet 1 `#summaryPage` (header, disclaimer, 3 key figures, `#summaryDashboard` with Your numbers); sheet 2 `#summaryAppendix` (protected %, how long family can manage, timeline, next steps `finBox`); sheet 3 `#summaryDetail` (More detail: cost of waiting + charts). Same sheets on every screen; on narrow screens the whole stage is scaled down (CSS zoom) like a PDF viewer, so layout is identical (pinch to zoom). Print: one sheet per page, `@page{size:A4 landscape;margin:8mm}` only, zoom 1.
- `summaryDashboardLayout()` is now shrink-to-fit per sheet (content is scaled, never split or dropped; min 35%). Old appendix JS (`appendixGrid`, `overflowNotice`) removed. Phone-only CSS (max-width:700/850) removed from SUM_CSS. Panel allowlist and privacy exclusions unchanged.
- Tests rewritten to the new design: summary-layout (6) and mobile-smoke (20, incl. new test "screen and print share one layout" comparing panel positions and PDF page count = sheets). Three tests that were failing on main before this change (M47 dense, M52 overflow, summary-layout disclaimer regex) now pass. All 9 test files green.
- Checked in 7 languages: 3 sheets, 3 PDF pages, no advisor content. Not verified: physical iPhone Safari and real printer; user must re-check (phone shows the whole page scaled, pinch to zoom). Supersedes the M60 "responsive single column on phone" decision, by the user's request that both outputs be the same.
- Rollback: `stable-2026-11-08-pre-sheets` (before), `stable-2026-11-08-sheets` (after).

## M61 — Claude sync of M47-M60 (Claude, 2026-11-08 11:5x IST)
- Claude pulled GitHub main (other AI's M47-M60, head `4fa3bea`) and synced: Claude artifact, Claude Project copies (needs-finder.html, AI_HANDOVER.md, PROJECT_STATE.md, PENDING_WORK.md, translation-review.csv). No app code changed by Claude in this step.
- Vercel finding: the last production deployment before this step was commit `164b8c8` (M59 docs). M60 commits (`985f691` summary alignment app change, tests, docs) had NOT been deployed (no Vercel deployments after M59; consistent with the earlier build-rate-limit note). This docs commit was pushed once, on a new day, to trigger one deployment of HEAD. Verify production SHA matches main before claiming M60 live.
- Claude's earlier work (M42-M46: UX1-UX8, objection no-gap wording, rollback branches `stable-2026-11-07-ux1..ux9`, `-pre-ux`, `-pre-obj0`) is part of main; see the M45/M46 sections.
- Still open: native-speaker review of M45/M46 strings (review CSV), compliance sign-off, physical iPhone check of M60 summary print/PDF, Vercel quota.

## M56 — Priority 9 eligibility and disclosure audit (2026-11-07)
- Audited `rec0` and product details (`PD`) in `needs-finder.html`. Existing global recommendation age gate is 18–65, while product detail tables include child entry ages (e.g. Income Now Early Income 0–50) and differing Promise4Future variants (Savings4Future 0–60, Income4Future 0–55). These are **potential scope/eligibility mismatches**, not confirmed product errors; do not change without current insurer brochures and compliance approval.
- Current guaranteed immediate-income recommendation includes age 50 and excludes 51; PPC display ages 18–50 for Wealth Edge and 18–55 for iSelect wording. Short education goal <5 years suppresses recommendation; exactly 5 years triggers Wealth Edge. Training-only disclosure text exists in the source. No app HTML, approved business rules, formulas, or translations changed.
- Added seven focused regression cases in `tests/eligibility-boundaries.test.cjs` and `.github/workflows/eligibility-boundaries.yml`. Rollback branch `stable-2026-11-07-pre-m56-eligibility`; commits `04b0312fd3538dc95bb2a767945b1af3fd5db61b`, `da23d89fb12634dbc319bbe29dad9a81a2355704`.
- Priority 7 and 8 CI verification attempted through GitHub commit workflow runs endpoint, but it only exposes PR-triggered runs and returned empty for both; public Actions workflow pages could not be fetched. Therefore CI remains **unverified**, not failed or passed. Priority 9 CI also unverified. No assertion of successful regression execution.
- Pending: obtain authoritative insurer brochure/eligibility matrix and compliance sign-off, verify Actions run outcomes for M54/M55/M56, and independently confirm production HEAD. Next Priority 10 proposed: full age/term/product eligibility matrix reconciliation against approved official brochures and consistency across all seven languages, subject to Start/Skip.


## M55 — Priority 8 immediate-income suitability audit (2026-11-07)
- Reviewed `pcat(t)` in `needs-finder.html`: retirement timeline `t.y<=2` selects `Suggested: Immediate income plan`; `t.y>2` selects `Suggested: Endowment plan to build a corpus, or an Income at a later stage plan`. Explanation distinguishes corpus, deferred income and immediate income. Other `gap`, `edu`, `mar`, `home` categories remain independent.
- No approved cutoff, product guidance, financial formulas, seven-language translations, or application HTML changed. Product suitability and insurer-specific eligibility still require human/compliance review; timeline suggestions are not personalized eligibility decisions.
- Added `tests/income-suitability.test.cjs` with six test scenarios for 0/1/2-year boundary, >2 years, explanation, term protection separation, unknown type and other goal categories. Added `.github/workflows/income-suitability.yml` to run Node tests on `main` and manual dispatch.
- Rollback branch `stable-2026-11-07-pre-m55-income-suitability`. Commits `26423070676603717e13fa1a310dc42daadb8d4f` and `e22b40f00979025e75e2a411fc3d51eede1d3527`. CI result and production final HEAD need verification; do not claim test success until observed.
- Priority 7 GitHub Actions CI remains unverified in this session; keep pending. Next Priority 9 proposed: product eligibility / age-band boundaries and disclosure consistency, subject to Start/Skip and formal compliance review.


## M54 — Priority 7 savings edge audit (2026-11-07)
- Reviewed `savingsSplit` in `needs-finder.html`: future eligible goals have y>0 and v>0, weighted by v/(12*y). Monthly budget is proportionally split, goal credit capped at target, remaining nonnegative and percent capped at 100. No financial formulas changed.
- Added six focused Node tests `tests/savings-edge.test.cjs` for zero/past-due goals, fully funded goal caps, zero savings, maximum custom monthly value, fractional allocation sum tolerance, and no eligible goals. Added `.github/workflows/savings-edge.yml` to run on main changes and manual dispatch.
- Important pre-existing product decision: unused savings budget from already-funded goals is not redistributed to other goals. This is explicitly deferred and must not be changed without user approval; capped displayed contributions can therefore be lower than nominal monthly allocations.
- Rollback `stable-2026-11-07-pre-m54-savings-edge`. Commits `74606e50c93f19c96adfbe7df0b9949bb68cb4b0` (tests), `6e53c2fa3a8d47ae2e1e31bfe50e8ae3798be670` (CI). GitHub Actions test result remains to be verified; do not claim passing tests without run evidence.
- Next Priority 8 proposed: validate the two-year immediate-income product suggestion cutoff and product-suitability wording, with explicit business approval before changing guidance. Start/Skip.


## M53 — Priority 6 CPI audit (2026-11-07)
- Official September 2026 All-India Combined General CPI 5.54% confirmed against MoSPI/PIB release (12 October 2026); next October release scheduled 12 November 2026. No newer official release verified at audit time.
- Identified API validation bug: valid official zero or negative inflation was rejected. Fixed validation to permit rates strictly between -25% and +25%; existing CPI extraction and calculations unchanged. Explicit `stale` boolean added to API success/failure payload. Added focused regression cases for deflation and unavailable official data.
- Fallback remains government-only: verified September release if listing unavailable; if both fail API returns ok:false, stale:true. Listing lag and real new-month rollover still require live verification. No third-party substitution or silent claim of current data.
- Pre-change rollback `stable-2026-11-07-pre-m53-cpi`. Application commit `ee51d93299bb9dc29a0ee1009ed92df8afbe0197`; test commit `3ac379f141df4d44587562ea3253e96c7c206e8d`. Test execution and production SHA alignment require separate verification. Formal compliance and native-speaker approvals remain open.
- Next Priority 7 proposed: savings allocation edge-case validation (zero-year goals, fully funded goals, custom extremes), subject to Start/Skip.


> **Manual QA update:** 2026-11-07 — User-reported manual QA confirmation: all five Priority 5 physical iPhone Safari checks PASSED. Scope reported as the five requested checks; no screenshots, iOS build, or independent reproduction supplied. M52 automated Chromium 19/19 previously passed. Close user manual QA checklist only; formal compliance/privacy/native-language approvals remain open. Next: Priority 6 official CPI freshness, stale/offline fallback and recalculation (Start/Skip).

Updated: 2026-11-08 (M52 iPhone/print; M51 language; M50 export privacy)
Repository: https://github.com/kevincaiado-stack/life-cover-needs-finder
Production: https://life-cover-needs-finder.vercel.app/
Canonical branch: main

## M52 — Priority 5 A4 landscape dashboard and mobile export hardening (2026-11-08)
- Fixed hard-coded 690px saved-summary overflow test: now uses rendered dashboard bottom against A4 landscape **194mm printable height**; overflow panels move to a conditional appendix without dropping any content. Print width is **281mm**; appendix prints in one column and allows long content to continue across pages.
- App Print/PDF now waits for standalone document fonts, recalculates dashboard layout, then prints. Seven-language customer-safe export retained. No financial calculations, language translations or privacy allowlists changed.
- M52 Chromium tests include 95-line oversized summary, first-page fit, appendix preservation, PDF generation and seven-language export. **19/19 passed**. Physical iPhone Safari / iOS print PDF and WhatsApp sign-off remains OPEN. See `docs/IPHONE_PRINT_AUDIT_M52.md`.
- Rollback before M52: `stable-2026-11-08-pre-m52-iphone-print`. Next Priority 6: CPI source freshness and fallback, Start/Skip.

## M51 — Priority 4 translation audit and review-register reconciliation (2026-11-08)
- Audited 468 runtime translation keys in English + six Indian languages. No blank translations or numbered-placeholder mismatches found. Added automated runtime dictionary/CSV parity and language formatting checks.
- Reconciled `docs/translation-review.csv`: updated obsolete source/translations for IDs **213** (official CPI), **360** and **378** (runway objection variants), **389** (shared decision objection), and registered missing **468** (joint-decision objection). Existing app translations copied unchanged; no new translation invented. M44 savings, M45 UX and M46 zero-gap scripts remain flagged for native-speaker review. See `docs/LANGUAGE_AUDIT_M51.md`.
- **P0 native-speaker and compliance sign-off remains OPEN**, including English-only M47/M49 newly authored content. Financial calculations, claim ratios and privacy/export logic unchanged. Next Priority 5: real iPhone Safari / print dashboard QA, with Start/Skip.
- Pre-change rollback: `stable-2026-11-08-pre-m51-language-audit`.

## M50 — Priority 3 export privacy audit and direct-print fix (2026-11-08)
- **Found/fixed:** Browser direct print of the live advisor workspace bypassed the standalone saved-summary allowlist. App print CSS now suppresses the live workspace and instructs users to use the in-app Print or save as PDF action, which prints the sanitized landscape dashboard with overflow appendix.
- M48 strict six-panel HTML allowlist retained; WhatsApp uses separate fixed-field `sumText()` allowlist. Added M50 Chromium tests for seven languages × advisor/customer modes, injected advisor-only markers, disclaimer, and print-media isolation. See `docs/EXPORT_PRIVACY_AUDIT_M50.md`.
- **Not fully closed:** physical iPhone Safari, actual exported PDF pages and external WhatsApp app require manual review. Formal privacy/compliance sign-off remains open. Financial calculations unchanged. Next Priority 4: native-language reviewer sign-off (Start/Skip).
- Pre-M50 rollback: `stable-2026-11-08-pre-m50-export-privacy`.

## M49 — Priority 2 claim-ratio primary-source correction (2026-11-07)
- Official insurer homepage identifies **99.52% FY2025–26 individual death claims settled**, versus FY26 press release's separate **99.6%** statement. The discrepancy is not safely explained as rounding; do not conflate metrics. FY2024–25 annual report confirms **99.43% individual** versus **99.38% combined individual/group**. Display now compares 99.52% to 99.43% as individual claim metrics, with explicit source/definition caveats. See `docs/CLAIMS_SOURCE_AUDIT_M49.md`.
- M49 regression test added; no financial calculations or customer/advisor export rules changed. IRDAI official workbook independent reconciliation and compliance approval of wording remain open. Next priority: P0 export privacy review, with Start/Skip choice.
- Pre-change rollback: `stable-2026-11-07-pre-m49-claims-primary-sources`.

## M48 — P0 compliance remediation follow-up (2026-11-07)
- Technical C06 mitigation committed: strict customer-summary export allowlist for six customer-facing panels; advisor objection, talking points, product suggestions, quick-start and voice UI excluded; training disclaimer retained. New regression tests exercise populated advisor-only panels and training warning.
- `docs/COMPLIANCE_AUDIT_M47.md` updated with remediation ledger and explicit outstanding approvals. M46 no-gap objection fix and M47 landscape dashboard already implemented. No business formulas, claim figures, suitability rules or translations changed. P0 external approval remains **OPEN**; C01 primary-source claims verification is next priority, not silently treated as completed.
- Pre-M48 rollback `stable-2026-11-07-pre-m48-compliance-remediation`. Confirm latest Actions and Vercel matching SHA after docs commit; physical print/PDF/WhatsApp QA still pending.

## M47 — P0 compliance audit and saved-summary dashboard (2026-11-07)
- **P0 compliance audit performed, not approved:** Findings C01–C09, required evidence, reviewers and hold decision documented in `docs/COMPLIANCE_AUDIT_M47.md`. External/customer-facing or sales use remains prohibited; training-only restriction unchanged. Next priority: C01 official claim-settlement evidence, user may Start or Skip.
- **Saved summary layout:** `buildSummary()` now creates a landscape A4 financial dashboard with three KPI tiles, side-by-side financial/runway/goals/charts panels, and a detailed appendix for panels that exceed the first-page height. Saved HTML and Print/PDF button use the same dashboard. Overflow panels move (not disappear); no underlying calculation changed. Advisor-only sections `tpBox`, `objBox`, `ccBox`, `.pcat`, tips and actions remain excluded. The appendix can span more than one page if many goals are entered; the dashboard first page is prioritized.
- **Automated checks:** M47 browser smoke tests for dashboard, excluded advisor sections and overflow appendix were added. Final Vercel/CI verification and physical iPhone/PDF print checks must be tracked separately. Mobile saved HTML uses fixed landscape canvas (horizontal scrolling on narrow screens) to retain A4 layout.
- Pre-change rollback `stable-2026-11-07-pre-m47-dashboard-compliance`; M46 app baseline `1fd25417900e` prior to M47. Do not treat audit as regulatory approval.

## CURRENT AUTHORITATIVE BASELINE — M46 (2026-11-07)

**GitHub main application SHA:** `1fd25417900e7cb0b3d1e478e6ac574f2063ee5c`. **Vercel production:** READY and matched this SHA on verification. **GitHub Actions:** latest M46 mobile Chromium and runway test workflows completed successfully. This is the current feature baseline; later documentation-only commits will have newer SHAs without changing the application. Older 'current M43/M44/M45', planned UX1–UX8, or pending-release statements below are historical, not the active status.

**Completed and tested:**
- M44: monthly savings presets and custom amount; one proportional monthly budget shared among future goals, no double counting; zero-return nominal contribution illustration.
- M45 UX1–UX8: Customer screen hides advisor-only guidance and enables Simple view; sticky key numbers; collapsible Your numbers / Talking points / More detail; improved Enter navigation, language selector, colour/tap/readability; print/saved-summary date and customer heading with disclaimer and A4 formatting. **Saved summary is multi-page (roughly 3–4 pages for an example family), not a guaranteed one-page handout.**
- M46 UX9: objection responses adapt to a fully covered customer with zero cover gap; 'Returns are poor' explanation refined. New OBJ0 translations added in seven languages, but native-speaker sign-off for these strings is **not documented**.
- Official-only CPI via MoSPI PIB release, last production-verified 09/2026 at 5.54%; real next-month discovery not yet verified. Existing runway formula unchanged.

**Verification distinctions:** A user-reported iPhone Safari check passed for savings controls, Simple-view timeline and Hindi on 2026-11-07 at 19:22 IST. This does **not** establish a complete seven-language, UX1–UX9, export/print/WhatsApp physical-device audit. A user-reported native-speaker review is recorded but the precise language/string scope and reviewer evidence are not documented; do **not** mark the new M45 or M46 strings as individually signed off. Compliance and source-document verification remain pending. See `docs/PENDING_WORK.md` for prioritized work and acceptance criteria.

**Workflow:** GitHub `main` is the only source of truth. Read `docs/AI_HANDOVER.md`, `docs/PROJECT_STATE.md` and `docs/PENDING_WORK.md` before work; create rollback branch, test, commit, verify Vercel SHA, and update all three files. Do not modify intentionally frozen Google Drive (`e5a2eff`). Claude Project/artifact mirrors are not verified synchronized. Pre-reconciliation rollback: `stable-2026-11-07-pre-m46-doc-reconcile`.

### Historical milestone and planning notes below
Earlier entries are retained for traceability; interpret any prior 'latest/current', UX1–UX8 'planned', native-language 'verified', or CPI failure notes in their dated context. This section and `PENDING_WORK.md` override conflicting historical status labels.

## M46: objection answers when cover gap is zero (Claude, 2026-11-07)
- Bug from user screenshot: with a fully covered customer (gap Rs 0) answers said "protect the gap of Rs 0". Fix: each affected objection in OBJS now has an optional `z` object (no-gap wording for d/e/x/w); renderObj uses it when CC.gap<=0 (Object.assign merge). Objections with z: too expensive, think about it, already have insurance, mutual funds, spouse/parents (w only), liquidity, returns are poor. Others never mention the gap.
- "Returns are poor" was also improved for gap>0: cover gives a fixed sum; growing money is spread part safe, part growing. No-gap version: protection is done, safe money grows slowly and growing money is not safe, spread by years left. No returns promised.
- 18 new strings x 7 languages (translation-review.csv, tag OBJ0); native-speaker review pending. Old Returns d/x rows are now unused (harmless).
- Rollback: stable-2026-11-07-pre-obj0 (before), stable-2026-11-07-ux9 (after).

## M45: UX1-UX8 DONE (Claude, 2026-11-07) - read this before touching the UI
- Rollback: `stable-2026-11-07-pre-ux` (before all), plus `-pre-uxN` / `-uxN` per step. Tests green at each step (runway 9, inflation 5, mobile-smoke 8).
- UX1+UX4: header button #custBtn "Customer screen" -> class html.cust (+ turns on Simple view, saved in localStorage ncCust). Hides #tpBox (Talking points: What-to-say + objections + CC), .pcat, .ptip, #raBox. Simple view makes the runway sentence (18px) and gap larger.
- UX2: sticky strip #ksBox (cover gap, protected %, family can manage) filled by renderKs() in the render chain; hidden in print; removed in buildSummary. Also toggles .gap.ok.
- UX3: result cards wrapped in <details class="sec">: #nmBox "Your numbers", #tpBox "Talking points" (advisor-only, removed in buildSummary, hidden in print), #mdBox "More detail" (hidden in Simple view). Summary labels are set from data-sec in applyTr().
- UX5: Enter key moves to the next box, then to Next; enterkeyhint=next. Progress line, inputmode and placeholders already existed.
- UX6: language select 44px high, 16px font, globe icon, names in own script (already so).
- UX7: tokens --bad/--good (+ dark); gap is red, turns green when covered; 44px taps on touch screens; Indic line spacing. Saved summary gap colours match.
- UX8: saved summary header "Prepared for <name> · Prepared on <date>", disclaimer at top, A4 compact print CSS, More detail starts on a new page. NOT a strict one-pager (example family = about 3-4 pages).
- New strings (all 7 languages, rows appended to translation-review.csv): Customer screen, Protected, Family can manage, Your numbers, Talking points, More detail, Prepared for {0}. Native-speaker review pending for these.
- Not verified: real iPhone Safari for the new UI (user should recheck: header wrap, sticky strip, Enter key behaviour).

## HISTORICAL PLAN — UI/UX program UX1-UX8 (subsequently completed in M45)
Rollback: pre-ux branch `stable-2026-11-07-pre-ux` = state before this program; each step gets its own `stable-2026-11-07-uxN` branch. All new text needs 7 languages + translation-review.csv rows. No financial-rule changes. Advisor-only content stays out of print, saved summary and WhatsApp.
1. UX1 Advisor / customer split: a "Customer screen" toggle hides advisor-only cards (objections, product suggestions on timeline) on screen, not just in print.
2. UX2 Sticky key-numbers strip: cover gap, protection %, how long the family can last, always visible at top of results.
3. UX3 Collapsible sections: group result cards (Your numbers, Your timeline, Talking points) with headings.
4. UX4 Simple View is the default for the customer screen; key sentence in large text.
5. UX5 Guided form: progress line (Step x of y), numeric keyboard (inputmode) on money/age fields, friendly example placeholders.
6. UX6 Language switcher at top, language names in own script (English, हिन्दी, ગુજરાતી, தமிழ், മലയാളം, ಕನ್ನಡ, मराठी).
7. UX7 Polish: same colour = same meaning (red gap, green covered), tap targets >= 44px, contrast, readable Indic font sizes.
8. UX8 Saved summary as one-page handout: header with date and customer name, training disclaimer visible.
Status log: see PROJECT_STATE.md (entries UX1..UX8). If a step is not marked done there, it is not built.

## User confirmation — native-speaker review (2026-11-07, 19:14 IST)
- The user (Kevin) stated that the native-speaker review is verified. Exact scope (which languages/rows) was not specified; treat as verified per the user's statement. Real-iPhone Safari check: PASSED, reported by the user on 2026-11-07 19:22 IST (savings buttons, custom box, Simple View timeline, Hindi). Compliance sign-off remains open. 

## M44 GitHub/Vercel synchronization — 2026-11-07
- Monthly savings presets, custom input and proportional split across goals are committed to GitHub main and deployed to Vercel. New regression test covers allocation without double counting and interactive controls.
- Browser test originally failed because synthetic goals were reset by the normal render() after clicking a preset; regression fixture corrected in commit `92baa9cd2565d44938e821542a596a7c6fe70919`. Actions run `42360399150` completed **successfully** (8 mobile Chromium browser tests including new M44 scenarios).
- Vercel READY on `92baa9cd2565d44938e821542a596a7c6fe70919` was confirmed. Documentation-only follow-up commits will update the production SHA without changing app code.
- Outstanding: physical iPhone Safari, six native-language reviews, compliance sign-off for allocation illustration and overflow/fully-funded-goal behavior; see PENDING_WORK.md.

## M44 — Savings scenario (2026-11-07)
- Replaced monthly savings slider with presets ₹5,000, ₹10,000, ₹15,000, ₹20,000, ₹25,000, ₹50,000 and custom input (0–1,000,000).
- One monthly budget split proportionally across future goals by goal amount / months remaining. Shares sum to selected monthly amount. Show monthly share, nominal contributions capped at goal, percentage and remaining gap. No investment returns, inflation growth, or double counting; life cover separate.
- Seven-language strings added; native review pending. Browser tests added. M43 is previous baseline. Pre-change rollback stable-2026-11-07-pre-savings-buttons.

## HISTORICAL BASELINE — M43 (superseded by M44–M46)

**Source of truth:** GitHub `main`; application HEAD `02e969152f2cc2e996436b7b39d26197de709842` (M43). Production Vercel READY at this same SHA. The latest M43 GitHub Actions mobile Chromium and runway test runs both passed. This section supersedes any older 'LATEST', pending verification or live CPI failure statements below; historical entries are retained for traceability.

**Active features:** M39 inflation-adjusted runway; M40 timeline visible in Simple view; M41 seven-language runway-duration sentences and removal of unused Customer-card functions; M43 removed the M42 'Rethink your strategy' card. M42 is **RETIRED**; its R32 translation rows are historical and must not be treated as active UI strings. Preserve M38 base runway formula, seven languages, advisor-only export exclusions, and training-only disclaimer.

**Official CPI production:** `/api/inflation` returned `{ok:true,rate:5.54,on:"09/2026",source:"MoSPI via PIB"}` in a fresh production check on 2026-11-07; official release https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3 . On each page load the app requests the uncached API, and valid newer CPI is applied to inflation-dependent calculations. A simulated newer-month browser regression passed; **the first real new-month auto-detection remains unverified** until the next official CPI release. The PIB listing may lag publication; no third-party fallback. Older entries saying Trading Economics is current or that production still returns `ok:false` are superseded.

**Workflow:** Read this file, PROJECT_STATE.md, and PENDING_WORK.md before changes. Create a pre-change rollback branch, make scoped changes, test, commit to GitHub main, verify Vercel source SHA and API where relevant, update both state files and PENDING_WORK.md, and record the post-change rollback ref. Update translation-review.csv only when translated UI strings change. **Google Drive is frozen intentionally at e5a2eff; do not update without user instruction.** Claude artifact/Project copies are external mirrors: synchronization is **not verified**; do not claim they were updated unless access and confirmation are available. GitHub remains authoritative.

**Verified rollback references:** `stable-2026-11-07-pre-rk-remove` = `969105aaa093` (M42), `stable-2026-11-07-rk-removed` and `stable-2026-11-07-safe` = `02e969152f2c` (M43). A pre-document-cleanup branch `stable-2026-11-07-pre-handover-cleanup` was created from M43. See PENDING_WORK.md for all deferred work, owners, priorities, and acceptance checks.

### Historical record notice
All dated milestone/phase entries below document decisions at the time they were written. They may contain superseded labels, unverified historical claims, and earlier CPI integration failures. For present-day status use CURRENT AUTHORITATIVE BASELINE — M46 and PENDING_WORK.md, not older 'next steps'.

## Standing instructions from the user (Kevin) — READ FIRST (added by Claude, 2026-11-07)
1. **Before building anything:** fetch GitHub main, read this file and docs/PROJECT_STATE.md, update this file if anything is missing, then proceed.
2. **After every change:** update docs/AI_HANDOVER.md, docs/PROJECT_STATE.md and docs/PENDING_WORK.md as applicable; update docs/translation-review.csv only for new or changed translations; commit to GitHub main and verify Vercel separately. Create a pre-change rollback branch and record a post-change rollback ref. Claude artifact and Claude Project copies are external mirrors, not automatically synchronized; verify access and sync explicitly before claiming they match GitHub.
3. **Rollback points:** make a branch before each change (naming used: stable-YYYY-MM-DD-name, plus a pre- branch for the version before the change). Never rewrite history.
4. **Google Drive is intentionally NOT updated** (frozen at commit e5a2eff). Do not update it unless the user asks.
5. **The user is a beginner who learns fast.** Explain in simple words (like to a 10-year-old), step by step, ask ONE question at a time, do not assume. Confirm understanding before building anything that is ambiguous; show a mock first when the user asks for ideas ("don't build yet").
6. **Honesty / compliance rules:** the app is for internal advisor training only (disclaimer under 'Your summary': "This is Strictly for Internal Training Purposes only. These are purely illustrative values and not for Sale"). No invented statistics, customer stories or false deadlines; urgency only from true things (age-based price rise, health change, goal dates). No promised returns, no premium amounts (the app has no premium rates). Compliance must approve wording before real use; native speakers must review the six non-English languages.
7. **Advisor-only content must never appear in the printed summary, saved summary file, WhatsApp text:** objection answers (Feel-Felt-Found, 9 objections, multi-select, claim settlement ratio box on 'I don't trust claims'), product-type suggestions on the life timeline, tips. The Customer card was removed in M34. Goal text keeps the person's name ('Aarav: education (in 12 yrs)') — the user rejected a cleaner version.
8. **Runway rule is the user's own, stated in words twice:** (savings + existing cover - loans) divided by MONTHLY expenses, shown in months/years; may exceed working years; bar caps at 100%. Inflation line (M39) is an addition, not a replacement.
9. **Translations:** 7 languages (English, Hindi, Gujarati, Tamil, Malayalam, Kannada, Marathi). Any new text needs all 7 (AR rows in needs-finder.html, translation blocks near the end of the script, plus docs/translation-review.csv). fmt() only replaces {0}-{9}.
10. **Testing:** tests/*.test.cjs (node). Browser tests need a Chromium: set CHROME_BIN to a Playwright Chromium path (e.g. /opt/pw-browsers/chromium-1194/chrome-linux/chrome) and NODE_PATH to the global node_modules. Keep rwY()/renderRw() free of globals other than $, tx, fmt, rs (tests run them in a VM; infl is read only if it exists).
11. **Milestones M30-M39 (all in PROJECT_STATE.md):** M30 multi-select objections; M31 claim settlement ratio box (99.6% FY2025-26 company press release, 99.43% FY2024-25 company page; official PDFs could not be opened by Claude, links and definition unverified); M32 Simple view keeps Show plans and runway box; M33 product-type suggestions on timeline (Term / ULIP + Par/Non-Par / Endowment or Income plans; 2-year cut-off to Immediate income is Claude's choice, to confirm); M34 Customer card removed; M35-M38 runway rule iterations; M39 runway with inflation.
12. **Discussed but NOT built (user has not approved):** allocation guide by goal type with percentages, a 'Rethink your strategy' card, optional 'how money is placed today' tap, premium estimate from insurer rate tables, saving customers (login/DB/admin/DPDP), a 'How we worked this out' page.

## M43: Rethink your strategy card REMOVED (Claude, 2026-11-07)
- The user asked to remove the M42 card and all its details because the same guidance is already on the life timeline (product suggestions). M42 code (rkBox, renderRk, CC.ret, R32 translations) is gone from needs-finder.html; do not rebuild it unless the user asks again.
- Rollback: stable-2026-11-07-rethink still holds M42; stable-2026-11-07-pre-rk-remove is the state just before removal.

## HISTORICAL ONLY — M42 (REMOVED in M43): "Rethink your strategy" card (Claude, 2026-11-07)
- New advisor-only card #rkBox (class "obj", under the objection card), built by renderRk() (called after renderObj in render()). Words only: no percentages, no returns, no premiums.
- One row per goal: Extra cover needed = "Pure protection" (keep separate, low cost); each goal by years left (<=5 "Mostly guaranteed", <=10 "Guaranteed + market-based", >10 "More market-based"); Retirement = "Guaranteed". Then a wealth-creation note (fully market-based), a question to ask the customer, and the standard "guide for discussion" line.
- CC.ret was added in the render chain so renderRk knows the retirement age.
- Never printed or saved: .obj is hidden in print, "rkBox" is removed in buildSummary, and sumText (WhatsApp) does not include it. Checked in a real browser.
- 12 new translated strings (R32 rows 441-452 in docs/translation-review.csv, 7 languages). Native-speaker and compliance review pending.
- Rollback branches: stable-2026-11-07-pre-rethink (before) and stable-2026-11-07-rethink (after). Drive is NOT updated, on purpose.
- Tests green: runway 9/9, inflation 5/5, mobile-smoke 6/6.

## M41: pending checks fixed (Claude, 2026-11-07)
- The M38 runway sentence was English-only in the six other languages: renderRw now uses four fully translated sentences (years / months / 1 month / under a month). The duration is no longer a separate English phrase. Do not reintroduce `fmt(sentence, "about N months")` with an English duration.
- Removed unused drawCard(), shareCard() and wrapT() (Customer card removed in M34). #ccBox stays hidden because renderCard still fills the global CC used by the objection answers.
- Regression checked in a real browser: Simple view keeps timeline and runway; saved summary has the timeline but not .pcat product suggestions, objection cards or Customer card; print hides .pcat and #objBox; 7 languages show no unresolved {n}. tests: runway 9/9, inflation 5/5, mobile-smoke 6/6.
- Still open from the audit queue: native-speaker and compliance review (R29-R31 and earlier), confirm Vercel deployed this commit, dead translation rows (harmless), Drive/Claude copies may be stale by design (Drive frozen). Rollback: stable-2026-11-07-pre-checks.

## M40: timeline visible in Simple view (Claude, 2026-11-07)
- User: on the final summary, tapping Simple view hid 'Your life timeline'; it must stay visible whether or not Simple view is on. Removed `html.simple #tlBox` from the Simple-view CSS (line ~102). Still hidden in Simple view: small grey helper text (.hint/.sub), #charts, #wtBox (The cost of waiting). Product-type suggestions (.pcat) remain advisor-only: hidden in print and removed from the saved summary. Rollback: stable-2026-11-07-pre-tl.
- Queue the user approved next, in order: (1) pending checks from the handover list (translate runway time wording, remove unused Customer-card code and dead translation rows, regression re-test), (2) build the advisor-only 'Rethink your strategy' card.

## M39: runway with inflation (Claude, 2026-11-07)
- User asked to also show how many years the money would last with current inflation counted. Added a bold line under the M38 runway: yearly expenses grow at infl() (live official CPI, 5.54% on 09/2026), the lump sum (savings + cover - loans) pays them with no investment return, n = ln(1+M*g/E)/ln(1+g). Example: 2.80 Cr, 7.2 L a year, 5.54% -> about 21.3 years (38.9 with no price rise). Shown in months if under a year; hidden if about 1 month or less.
- M38 formula and rwY() are unchanged and still pure; tests/runway.test.cjs passes 9/9 (one test added), tests/inflation.test.cjs 5/5, tests/mobile-smoke.test.cjs 6/6 (run locally with CHROME_BIN pointing at Playwright's Chromium).
- Merged on top of the ChatGPT live-CPI commits through 055a413 without touching api/ or the inflation source. Rollback: stable-2026-11-07-pre-infl.
- Needs: native-speaker review of the 3 new R30 lines; compliance review of the wording; check Vercel deployed this commit.
- Note for the next assistant: the ChatGPT duration phrase in renderRw ('about N months') is inserted into translated sentences in English; it is not translated in the six other languages. Not changed here.

## Official CPI production recovery — 2026-11-07
- Production Vercel /api/inflation returned **ok:true, rate:5.54, on:09/2026**, sourced directly from the official Government of India PIB release at https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3. No third-party CPI data used.
- The official MoSPI eSankhyiki API at api.mospi.gov.in failed TLS fetch from Vercel; the eSankhyiki homepage was client-rendered and could not be parsed server-side. Replaced failing endpoint with official PIB publication discovery plus government release-page verification. PIB ministry release listing was lagging (listed August 2026) when checked; known verified September 2026 PIB release acts as an official fallback. Newer releases appearing in the government listing are preferred by reporting month.
- Every page visit fetches /api/inflation without browser/server cache; accepted official rates update INFL, INFL_ON, saved local rate and call render() to recalculate projections. Browser regression verifies new official response triggers recalculation.
- API tests passed at b88a674a. Production direct API smoke succeeded. Browser source link now points to the actual official PIB release. Browser and runway tests on the latest UI commit need confirmation.
- **Caveat:** Government PIB listing publication latency and source availability are outside application control; do not guarantee same-minute detection of a release or permanent 100% uptime. Monitor the next CPI publication (expected 12 Nov 2026) and verify a new official month is discovered without code changes.
- Temporary CPI diagnostic endpoint removed after testing. Financial formulas and plan suitability unchanged.

## HISTORICAL — superseded CPI integration blocker — Monthly official CPI recalculation validation — 2026-11-07
- Confirmed existing client flow: on each visit loadInfl() calls /api/inflation with no-store and cache-busting; when an official response has a valid reporting period >= saved baseline, it updates INFL/INFL_ON, saves them and calls render(). The retirement inflation projections recompute with the applied rate. An intentional higher user scenario rate is preserved.
- Added Chromium regression checks: changing CPI changes retirement-expense projection (passed, run 42279236271); a new test stubs the official endpoint response and asserts loadInfl() updates month, rate, live state and visible projections (run pending verification).
- **External blocker remains**: production official-only endpoint returned ok:false; a MoSPI eSankhyiki homepage KPI is not reliably exposed as server-readable HTML. Official documented CPI API is advertised at https://esankhyiki.mospi.gov.in/macroindicators?product=cpi&tab=api (GET /api/cpi/getCPIData). Its request parameters and response schema have not been validated; do not substitute an invented API integration.
- Preserve government-only source policy. Do not claim end-to-end automatic new-month detection is operational until Vercel live response returns ok:true with a verified latest All-India Combined General CPI inflation rate.

## HISTORICAL — superseded failed MoSPI homepage attempt — Official-only inflation on each website visit — 2026-11-07
- Replaced Trading Economics entirely in api/inflation.js with a direct MoSPI eSankhyiki homepage CPI KPI fetch. Every API invocation requests the government page with no-store; browser requests /api/inflation with a cache-busting timestamp on each page initialization.
- Official-only parser requires explicit "Inflation [Month] [Year] [Rate]% Consumer Price Index" context; validates value and report period. API includes source and sourceUrl; returns ok:false rather than accepting any third-party rate when unavailable.
- Updated all seven existing live-rate labels to MoSPI eSankhyiki and added clickable government source link beside inflation note. Financial formulas and plan rules unchanged.
- Regression tests updated to assert government-only fetch, no-store, stale/future/invalid rejection, and failed response fallback. GitHub Actions inflation tests passed at cfa5ba35; later browser and runway tests need verification.
- **LIVE LIMITATION:** production /api/inflation returned {ok:false,reason:"official-data-unavailable"} on 2026-11-07 despite HTTP 200. The website therefore uses its labelled saved official baseline (September 2026 5.54%) and is **NOT YET VERIFIED to automatically obtain newer MoSPI figures**. Do not describe this feature as fully complete until official API integration returns live data on production.
- Next engineering step: integrate documented MoSPI eSankhyiki structured CPI API (/api/cpi/getCPIData), validate the All-India Combined general CPI rate against official press release, add real integration checks, and then verify live Vercel response. Do not use third-party data.

## Phase 3 verified browser regression finding — 2026-11-07
- GitHub Actions mobile Chromium browser suite PASSED at application commit f6bf9b4965574db27effe03453214fdec6b89c61 (run 42278203460). M38 runway suite also PASSED (run 42278203511).
- Browser suite initially detected a **real production-blocking JavaScript parse error**: the Phase 2 inflation period regex had doubled backslashes, yielding "Invalid regular expression flags" and preventing all main script initialization. Fixed the regex in commit f6bf9b49; test now confirms page initializes.
- Browser tests cover mobile viewport overflow, seven-language switching, M38 sample inputs, standalone saved summary, and Simple view runway visibility. They use desktop Chromium emulating mobile dimensions, NOT physical iOS Safari.
- Keep automated browser suite mandatory for any future HTML changes. Remaining manual checks: actual iPhone Safari, printing/PDF rendering, WhatsApp sharing, full multi-step advisor journey and native-speaker translations.
- No financial formulas or plan rules changed in the fix.

## Phase 3 browser regression automation — 2026-11-07
- Added tests/mobile-smoke.test.cjs and .github/workflows/mobile-smoke.yml. Automated mobile-sized Chromium checks cover viewport overflow, seven language switching, M38 runway and standalone saved-summary HTML, and Simple view runway visibility.
- Browser checks run against local repository HTML with external requests blocked, so they are deterministic; they do **not** establish production Safari behavior, external font loading, actual PDF print rendering, or physical iPhone compatibility.
- First workflow run failed at the Playwright browser dependency installation step before tests could execute; changed workflow to install Chromium without system apt dependencies. Verify latest run outcome and fix any actual test failures before declaring Phase 3 complete.
- No production application code or financial rules changed in this phase. Follow-up: test actual iOS Safari and full customer navigation/print/WhatsApp flows.

## HISTORICAL — superseded third-party attribution — Inflation source attribution follow-up — 2026-11-07
- Verified official MoSPI/PIB September 2026 all-India combined CPI inflation: 5.54% (published 12 October 2026). October 2026 CPI is scheduled for release on 12 November 2026. Official reference: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3
- Updated all seven existing live-rate labels to identify **Trading Economics (MoSPI CPI data)** rather than imply a direct MoSPI connection. Saved official September 2026 baseline and fallback messages remain unchanged.
- Evaluated MoSPI eSankhyiki CPI catalogue: https://esankhyiki.mospi.gov.in/catalogue-main/catalogue?product=CPI . It exposes official releases, but no stable documented public API contract was verified in this task. Do not switch to an untested endpoint or scrape official PDFs in production.
- Follow-up: integrate a verified official structured API when access/schema/uptime and regression fixtures can be validated; consider native-speaker sign-off for revised attribution translations.
- App layout, inflation arithmetic, product rules, and supported languages were not changed.

## HISTORICAL — superseded Phase 2 engineering update (2026-11-07)
- Added inflation API regression tests and GitHub Actions workflow; test cases include recent, stale, future, malformed, invalid-range and HTTP error responses.
- api/inflation.js now checks HTTP status and freshness (at most four calendar months old, never future) and clears timeout on failure.
- needs-finder.html now refuses API reports older than the saved/bundled inflation period.
- M38 runway formula and all plan rules remain unchanged. Phase 1 already fixed zero/short duration display and added runway tests.
- The source is still a third-party Trading Economics page. The app's existing MoSPI attribution needs review: the endpoint is **not** a direct MoSPI source. Avoid claiming an official live feed.
- Next assistant: verify current GitHub Actions results, Vercel production SHA and runtime API response before further edits.

## Purpose
Claude and ChatGPT alternate work on this project. GitHub main is the source of truth for code, decisions, and handover notes. Vercel deploys from GitHub. Never assume prior AI chats, Claude artifacts or Google Drive copies reflect the latest code.

## Start-of-session checklist
1. Read main HEAD and recent commits.
2. Read docs/AI_HANDOVER.md, docs/PROJECT_STATE.md and docs/needs-finder-rules-and-status.md. The latter is older and may be superseded.
3. Inspect needs-finder.html and relevant docs/translation-review.csv rows.
4. Check Vercel deployment status and verify the source commit matches the intended GitHub commit.
5. Identify outstanding risks, confirm scope, and avoid overwriting the other assistant's work.

## Current application baseline — Milestone 39 (M38 runway + inflation line)
M38 details follow; M39 only adds the inflation line described in the M39 section at the top.

### M38 details
As documented in docs/PROJECT_STATE.md, latest application milestone M38 was committed on 2026-11-06 at 313cf4c79a3a854feaa5e39db7b1484f420e2195.

The 'How long could your family manage?' runway is (savings and investments + existing life cover - loans) / monthly expenses = months, then months / 12 = years. When loans exceed resources, show a no-runway message. Objection responses reuse the positive runway. Duration can exceed working years, but the comparison bar caps at 100%. No inflation or investment returns are counted. Test zero or missing monthly expenses and rounding. Relevant functions: rwY(), rwTxt(r), renderRw(a,ret,A,B,C,D,ex). R29 translations cover seven languages. Pre-M38 rollback: stable-2026-11-06-pre-runway4.

Other recent milestones: M34 removed the visible Customer card; M33 added advisor timeline product-type suggestions; M32 fixed Simple view plan toggles; M31 added a claim-ratio information box. See PROJECT_STATE.md for exact details and rollback branches. Experimental Phase 2 changes were rolled back in October; do not restore without approval.

## GitHub-first workflow for both assistants
1. Refresh main before any edits.
2. Keep changes scoped and preserve rollback references.
3. Test financial calculations and edge cases, mobile layout, Simple view, seven-language content, plan suitability, printed and saved summaries.
4. Commit approved changes to GitHub. Update PROJECT_STATE.md and this handover for behavior changes.
5. Verify Vercel build, source SHA, production availability and key mobile flows. A GitHub push alone is not deployment verification.
6. Hand over changed files, commit SHA, test evidence, deployment status, open issues and next recommended task.

## Pending audit findings / validation queue
These are candidates for investigation, NOT confirmed defects. A complete code audit and production smoke test are still pending.

- P0 — Validate M38 runway math, negative net resources, zero/blank expenses, month/year units, rounding and objection-answer consistency. Keep runway distinct from the cover-gap/protection meter.
- P0 — Review plan suitability, 'MUST BE OFFERED' wording, training-only illustrative disclaimers, claim-ratio sources and compliance.
- P1 — Regression-test Simple view, plan controls, timeline suggestions, removed Customer card, printing/PDF and saved summaries.
- P1 — Native-speaker and compliance review for Hindi, Gujarati, Tamil, Malayalam, Kannada and Marathi, especially R29.
- P1 — Confirm Vercel production deploys the intended GitHub commit without build/runtime regressions.
- P2 — Review unused Customer-card functions, dead translation rows, single-file maintainability and test coverage.
- P2 — Label Google Drive and Claude copies as potentially stale; update only when explicitly needed.

## Handover verification
Prepared using GitHub main's PROJECT_STATE.md, needs-finder-rules-and-status.md and recent commit history. This handover changes documentation only; no application code is modified. Vercel deployment status is not verified by this note and must be checked separately.

### Priority 6 regression verification — 2026-11-07
- Executed local Node.js `node --test tests/inflation.test.cjs` using a reconstructed copy of the current committed `api/inflation.js` and `tests/inflation.test.cjs` fetched from GitHub. **7 tests passed, 0 failed**, ~0.17s. This is not a GitHub Actions CI run; repository checkout was blocked by container DNS, so do not present it as a checked-out-repository CI pass.
- Scenarios: official parsing, source checks, simulated newer month, third-party rejection, future/stale rejection, zero/negative CPI, unavailable official fallback.
- Official MoSPI September 2026 CPI 5.54% remains the latest verified; October release is scheduled 2026-11-12 and real rollover remains pending. Priority 7 may be offered; ongoing CPI release monitoring remains open.

### M54 verification addendum
- Six focused allocation assertions passed in local Node.js execution of the exact `savingsSplit` function copied from `needs-finder.html`: zero-year exclusions, funded cap, zero budget, maximum budget, proportional rounding tolerance, no eligible goals. The committed `tests/savings-edge.test.cjs` has NOT yet been independently observed passing in GitHub Actions; CI verification remains open.
- Vercel production was observed READY during documentation updates; final HEAD SHA matching requires a fresh check after all documentation commits. No application code changed in M54.

## M56 CI gate correction (2026-11-07)
- During Priority 7–9 push/verification, found a syntax error in the newly added M56 test's literal HTML regex. Fixed the test-only syntax in commit `0b4459e0a72c128d44d34be41f84aa62846d7c13`; no application code or product guidance changed.
- Priority 7, 8, 9 test files and workflows are already pushed to `main`. The available connected GitHub workflow-run lookup filters PR-triggered runs and returned no evidence for these main-branch push runs; public GitHub Actions pages were not accessible in this session. **CI success is not verified**. Do not start Priority 10 until all three workflows show successful results or an independently equivalent verified run is available.

## M57 Priority 10 — official eligibility and seven-language reconciliation (2026-11-07)
- User screenshots confirmed latest successful GitHub Actions on `main`: M54 #2, M55 #2, M56 #3. Gate cleared; M56 #1 failed historically, followed by successful #2 and #3.
- Created `docs/PRODUCT_ELIGIBILITY_RECONCILIATION.md`: repository catalog of age bands and policy terms, mismatch register (Income Now child-age description versus adult recommendation gate; Promise4Future 55/60 versus general 65 gate), PPC and language/disclosure risks. Current official insurer brochure versions/UINs not established; **no authoritative product validation or native-speaker approval claimed**.
- Added `tests/product-catalog-consistency.test.cjs` (six source-invariant checks) and `.github/workflows/product-catalog-consistency.yml`. M57 CI success still pending verification.
- Rollback branch `stable-2026-11-07-pre-m57-product-reconciliation`. No financial calculations, business rules, recommendation text, or app HTML changed. Compliance signoff remains mandatory before customer-facing use.
- Next priority proposed: M58 evidence-backed insurer brochure/UIN matrix, variant-specific rule changes only after explicit approval, full seven-language review; user must select Start/Skip.

## M58 Priority 11 official insurer reconciliation (2026-11-07)
- Verified Canara HSBC Life official product registry/UINs and brochures; see `docs/PRODUCT_ELIGIBILITY_RECONCILIATION.md` M58 section with URLs and source-specific findings. Official evidence confirms IncomeNow PPT-specific minimum premium exceptions and Promise4Life Assured Term Income ₹36k minimum versus app's blanket ₹50k; Promise4Future premium-mode and maturity-age restrictions omitted. **No business rule changes authorized**; compliance review and seven-language translation signoff pending.
- Existing M54–M57 GitHub Actions verified green from user screenshots. No app HTML or formulas changed in M58. Rollback branch `stable-2026-11-07-pre-m58-brochure-evidence`.
- Vercel build-rate-limit on latest HEAD previously observed; avoid excess deployment attempts. Last confirmed production READY may lag GitHub HEAD. Resolve quota through Vercel account dashboard/reset or approved plan change; do not claim fixed.
- Next: obtain user approval for specific eligibility and premium text corrections after verifying full current brochure matrix; independently test all seven languages; only then modify app.

## M59 — approved IncomeNow and Promise4Life copy corrections (2026-11-07)
- User explicitly approved **only** officially supported product-detail corrections, not recommendation-rule or financial-formula changes. Updated `needs-finder.html` `PD.inn` to replace misleading blanket ₹50,000 minimum with Early Income PPT2 ₹5,00,000, PPT3/4 ₹2,00,000, and reference to current brochure for other terms/Step up. Updated `PD.p4l` to replace blanket ₹50,000 with Assured Term Income minimum annual ₹36,000 and variant/PPT-specific caveat; added maximum entry ages PPT5=50, PPT7=60, PPT10/12=65. Source links and outstanding eligibility uncertainties remain in `docs/PRODUCT_ELIGIBILITY_RECONCILIATION.md`.
- App commit `edd4b6b4af05c2d85748099d18f56027709cfca8`; tests commit `54aa2c91d264c4eb48242661b3a9007bf686bb7e`; workflow commit `24f7622d8944e8aae88135b9bfedfe4de00cb4d3`. Rollback branch `stable-2026-11-07-pre-m59-approved-product-copy`.
- Six new tests in `tests/approved-product-copy.test.cjs` and GitHub Actions `.github/workflows/approved-product-copy.yml` run both new and M54–M57 tests. **CI run result not yet independently verified**.
- Seven language identifiers remain; only English insurer-approved product wording changed. No native-language financial copy fabricated; fallback remains English. Native-speaker and compliance signoff pending. No eligibility or calculation changes.
- Vercel subscription unchanged. Deployment build-rate-limit previously observed; production HEAD may lag latest GitHub commit. Verify latest workflow green and production SHA before calling release synchronized. Avoid further no-op deployments.

## M60 — Saved summary alignment (2026-11-07)
- User approved applying aligned example (`life-cover-needs-summary-aligned.html`) to future saved HTML / print/PDF exports. Changed only `SUM_CSS` and `buildSummary` export layout script in `needs-finder.html` (app commit `985f69165d6728a1c62ca9aa374bd76e76ed5964`). Responsive mobile single-column layout, tabular aligned financial amounts, full-width key figures, readable chart legends, A4 landscape print rules. Detailed `mdBox` moved to appendix, additional overflow panels moved without removal. The summary export's existing explicit privacy allowlist remains unchanged. No financial calculations or product guidance altered.
- Rollback branch `stable-2026-11-07-pre-m60-summary-layout`. Added six source-level regression tests `tests/summary-layout.test.cjs` (commit `628be890d5e75930d0e45e0301644950264ebb35`) and `.github/workflows/summary-layout.yml` (commit `c66f2f03425e56afda36a7070d7a06e2df828706`), also runs M54–M59 tests.
- **Verification caveat:** source tests check layout invariants but are not physical iPhone Safari or real print/PDF screenshot proof. Confirm GitHub Actions green, Vercel production HEAD alignment, and user iPhone print preview including full appendix. If overflow remains in printed output, revise after screenshot before signoff.

## M64 — iPhone saved HTML cannot open (2026-11-08)
- User reported downloaded saved `.html` summary shows unsupported/cannot-open in iPhone Files. This is consistent with iOS Files/Quick Look HTML handling; the exact OS error and physical reproduction are not independently verified.
- **Targeted app change** `f704b47e4edfba837daf95c96839c58ac427cab0`: on iPhone/iPad, Save summary file opens the identical `buildSummary()` three-sheet HTML in a synchronous new browser tab, avoiding an unsupported local HTML file. The new tab has the existing Print or save as PDF control. Desktop HTML downloads continue; Blob URLs now revoked after 60s. The button message explains PDF-to-Files workflow. Existing print button, financial formulas, M62/M63 sheet CSS/viewport, product rules, language dictionaries, and export privacy allowlist were not changed.
- Rollback `stable-2026-11-08-pre-m64-ios-summary-open`. Added `tests/ios-summary-open.test.cjs` and `.github/workflows/ios-summary-open.yml` (including previous regression suites). **CI result, production SHA and real iPhone Safari open/print remain to verify.** Note: pop-up blocking in embedded browsers can still prevent preview; use Safari directly. The iOS Save button intentionally previews for PDF export rather than writing a locally reopenable HTML file.

## M65 — Restore direct browser PDF download (2026-11-08)
- User clarified Save summary previously downloaded a PDF directly to browser Downloads; M64 HTML preview did not meet this expectation. M65 supersedes M64's iOS preview behavior.
- App commit `f14432df1fad17a5a1139f5838c84480787bd03c`: renamed button **Download summary PDF**; generates the same three `buildSummary()` sheets inside a local hidden same-origin iframe, rasterizes each sheet via pinned html2canvas 1.4.1, writes three A4 landscape pages via pinned jsPDF 2.5.2, and requests `life-cover-needs-summary.pdf` as a Blob download. No customer data is uploaded by this code. PDF libraries are loaded from jsDelivr CDN at runtime, so **internet access to the CDN is required**. Safari may show a PDF preview instead of automatically placing it in Downloads depending on browser settings. Failure is reported in the summary hint; separate Print/PDF action remains as fallback.
- Existing financial formulas, business rules, panel privacy allowlist, M62/M63 three-sheet HTML layout and print stylesheet unchanged. Rollback `stable-2026-11-08-pre-m65-direct-pdf-download`. Added `tests/pdf-download.test.cjs`, updated superseded M64 test, and `.github/workflows/pdf-download.yml`. These tests are **source invariants**, not proof of real iOS PDF download or visual pagination. Physical iPhone Safari QA and CI confirmation remain pending. Verify production SHA matches final GitHub HEAD before claiming live.

## M66 — iPhone PDF text overlap mitigation (2026-11-08)
- User supplied actual iPhone screenshot showing M65 downloaded PDF with overlapping text on all three sheets. PDF download succeeded, but visual QA **FAILED**; do not describe M65 PDF as acceptable.
- Root-cause hypothesis: html2canvas rasterized M62/M63 sheets with nested CSS `zoom`, causing glyph placement/overlap on iOS. App commit `b467433005443437f583a550dbc281c89e541e95` now resets stage, sheet and inner `.si` zoom/transform, captures unzoomed inner content at scale 2, then aspect-fits the PNG into 281×193mm A4 landscape printable area. Three-page PDF download, customer privacy allowlist, formulas and HTML/print layout preserved. Test updated in `tests/pdf-download.test.cjs` to assert unzoomed capture.
- Rollback `stable-2026-11-08-pre-m66-pdf-overlap-fix`. **Not yet physically verified on iPhone**; request a fresh PDF/screenshot. If overlap persists, stop relying on html2canvas for iOS and implement/test a native-print or alternate PDF renderer; do not mark issue resolved based only on source assertions. Confirm latest GitHub HEAD vs production SHA and CI.

## M66 user acceptance update — 2026-11-08
- After M66 was deployed, the user retested the newly downloaded summary PDF on their iPhone and explicitly confirmed **“Works now.”** Treat the reported iPhone PDF download/text-overlap defect as **resolved by user acceptance**. This supersedes the earlier M66 “not yet physically verified” status for that specific defect; retain the original failure screenshot and root-cause notes as history.
- Scope of acceptance: successful user-reported iPhone PDF workflow following M66. The user did **not** separately provide independent evidence of exact page count, printer output, all seven languages, advisor-content privacy, or automated CI pass; those broader checks remain open where applicable. Do not infer full compliance signoff.
- No additional application code, formulas, translations, export layout, or deployment settings changed in this documentation-only update. The canonical working implementation remains M66 unzoomed PDF capture, three A4 landscape sheets, direct PDF download. GitHub `main` remains source of truth for both Claude and ChatGPT.

## M66 release checkpoint and safe rollback — 2026-11-08
- User explicitly requested GitHub synchronization, a safe rollback point, refreshed Markdown handover, and Vercel update after confirming M66 iPhone PDF download works.
- Verified GitHub `main` at `625358cd0fb39f0dc9db3025d1158529fb1697f2`; Vercel production was `READY` on **the same SHA** (deployment `dpl_fx9rxszPJU2NwJGrcDsAfF2i5XKQ`). Thus application code and previously committed M66 acceptance documentation were already live before this checkpoint.
- Created immutable-intent rollback branch `stable-2026-11-08-m66-user-accepted-pdf` at exactly `625358cd0fb39f0dc9db3025d1158529fb1697f2`. This is a branch reference and can be used to restore the user-accepted M66 version if later changes regress. Do not modify this branch during routine development.
- M66 acceptance: user confirmed “Works now” after retesting iPhone PDF download. This closes the reported download/text-overlap defect only; broader compliance, seven-language native-speaker signoff, independent CI and print QA remain separate.
- This checkpoint modifies only documentation on `main`. No app code, PDF generator, financial formulas, product guidance, translation, Vercel plan or configuration changed. After docs commit, recheck production SHA; if Vercel deploys documentation automatically, a new READY deployment matching latest HEAD is sufficient, with no forced rebuild required.

## M67 — Ordered claims + Priority 1–4 evidence checkpoint (2026-11-08)
- User requested claims IRDAI reconciliation and formal approval first, then export privacy, product/claims, language, CPI sequentially. Full evidence and boundaries: `docs/M67_SEQUENTIAL_AUDIT_EVIDENCE.md`.
- FY2024-25 insurer annual report independently opened: 99.43% individual, 99.38% overall; 2,785 newly received, 2,771 paid, 16 repudiated. Two IRDAI-derived secondary reproductions give 2,787 total incl. 2 opening claims, 2,771 paid = 99.43%. **Original IRDAI Table 15 ZIP could not be retrieved (HTTP 403); independent regulator-original check remains OPEN. Formal compliance approval must come from authorized insurer/legal reviewer and is NOT granted.** No change to existing FY2025-26 99.52% insurer-source value.
- Priority 1 source audit reconfirmed PDF uses `buildSummary()` six-panel allowlist, not advisor DOM; WhatsApp uses fixed `sumText()` and disclaimer. Real seven-language, two-mode, zero-gap export/WhatsApp privacy sign-off remains OPEN; user acceptance of M66 PDF readability does not constitute privacy approval.
- Priority 2 insurer brochure evidence and M59 copy corrections reviewed; further eligibility/term/threshold changes require user and compliance approval. Priority 3 named six-language native review OPEN. Priority 4 October CPI release expected Nov 12; cannot verify before publication. All four remain evidence/approval gated; no fictitious completion.
- Rollback `stable-2026-11-08-pre-m67-audit-sequence`. This checkpoint changes docs only, no financial formulas, product rules, translations, exports or deployment settings. Refresh GitHub and Vercel SHA after final docs commit.

## M68 — Priority 1 export privacy source hardening (2026-11-08)
- User explicitly deferred original IRDAI workbook reconciliation; **do not treat the claim as regulator-original verified or insurer/legal approved**. Continued with Priority 1 export privacy in the approved sequence.
- Inspected current `needs-finder.html`: `buildSummary()` clones results then removes advisor IDs and nested recommendation/tip elements, uses the exact six-panel financial allowlist; `downloadSummaryPdf()` renders `buildSummary()` into a temporary iframe and rasterizes its three sheets; `sumText()` constructs WhatsApp text from a fixed list of financial fields plus training-only disclaimer. Direct printing of live workspace is blocked with a privacy-safe instruction. No new code leak was confirmed by this source inspection.
- Added `tests/export-privacy-m68.test.cjs` (seven locale presence, panel allowlist, advisor exclusion, mode independence, PDF sanitized source, WhatsApp construction, direct-print block) and `.github/workflows/export-privacy-m68.yml` to execute the new test plus M66 PDF invariants on main and manual dispatch. **Workflow result not yet independently verified**; source assertions are not equivalent to actual seven-language × two-mode PDF/WhatsApp visual or content tests.
- **Remaining Priority 1 gates:** browser-generated outputs with injected advisor markers and representative zero-gap/long-goal cases across seven locales and two screen modes; physical iPhone PDF/WhatsApp review; named legal/privacy approval. M66 user acceptance only established PDF readability, not privacy compliance. Maintain internal-training-only restriction.
- Rollback `stable-2026-11-08-pre-m68-export-privacy`. No financial formulas, business rules, PDF layout, product guidance, translation strings or Vercel settings changed. Priority 2 product/claims, Priority 3 native-language signoff, Priority 4 post-Nov-12 CPI rollover remain queued in that order.

## M69 — Priority 2 product and claims audit (2026-11-08)
- Detailed report: `docs/M69_PRODUCT_CLAIMS_AUDIT.md`. Audited current `CSR`, `CSRL`, `csrBox()`, `PD`, `rec0()`, and `pcat()` against M49/M58/M59 documented insurer evidence. Claims 99.52% FY26 individual and 99.43% FY25 individual unchanged; distinct 99.6% FY26 press release and 99.38% FY25 combined explicitly distinguished. IRDAI original Table 15 check deferred per user; formal insurer/legal signoff OPEN.
- M59-approved IncomeNow PPT-specific minimum premiums and Promise4Life Assured Term Income ₹36k/PPT-age restrictions preserved. Promise4Future mode/maturity age restrictions and global 18–65 recommendation gate mismatch remain product-approval gates; two-year retirement immediate-income threshold remains unchanged pending business approval. No unapproved product/financial rule changes.
- Added `tests/product-claims-m69.test.cjs` (six source-invariant tests) and `.github/workflows/product-claims-m69.yml` (also runs existing product/eligibility/suitability tests). CI pass not yet independently confirmed. Source tests do not establish insurer approval.
- Rollback `stable-2026-11-08-pre-m69-product-claims-audit`. No application HTML, calculations, translations, export or Vercel configuration changed. Next in user-approved order: Priority 3 language audit, then Priority 4 official CPI rollover after 2026-11-12 publication.

## M70 — Priority 3 seven-language audit (2026-11-08)
- Report: `docs/M70_LANGUAGE_GAP_AUDIT.md`. Inspected seven locale selectors, M51 468-row dictionary and CSV, `tx()` fallback, `csrBox()`, and `PD` product detail text. M51 recorded structural parity, but **claims explanatory text and M59-approved product details are authored in English outside the translation register**, so full six-language product/compliance disclosure coverage is NOT established.
- Added `tests/language-gaps-m70.test.cjs` and `.github/workflows/language-gaps-m70.yml` for seven locales, dictionary completeness, placeholder parity, review register coverage, English-only gap inventory and fallback behavior. GitHub Actions success not independently observed; no native-speaker sign-off implied.
- No new translations invented, and no application code, financial calculations, claims values, product rules, or PDF layout changed. Required: insurer-approved localized claims/product copy, named qualified reviewers for six non-English locales, actual rendered PDF/WhatsApp checks. **Priority 3 formal approval remains OPEN.**
- Rollback `stable-2026-11-08-pre-m70-language-audit`. Next user-approved Priority 4: official October CPI publication rollover, scheduled 2026-11-12, cannot be verified before publication.

## M71 — Priority 4 CPI rollover readiness (2026-11-08)
- Report `docs/M71_CPI_ROLLOVER_READINESS.md`. Audited `api/inflation.js` and frontend `loadInfl()`/inflation controls. API uses official PIB sources and accepts zero/negative CPI; frontend `rate>0` checks reject these official values. Cached newer `ncInfl` stores month/rate but not the matching official source URL; when API fails attribution can remain pinned to September. PIB listing anchor discovery also depends on exact label. **No rate/formula changes made without approval.**
- Added `tests/cpi-rollover-m71.test.cjs` (six source and discrepancy checks) and `.github/workflows/cpi-rollover-m71.yml` to run with M53 inflation tests. CI success not independently confirmed. Synthetic 5.81% in test is not real October data.
- Real October 2026 official CPI rollover expected on 2026-11-12; cannot claim verified before release. After publication check source, rate/month, projections, stale fallback, iPhone, PDF and languages. Existing daily official CPI monitoring automation retained; no duplicate scheduled.
- Rollback `stable-2026-11-08-pre-m71-cpi-rollover-audit`. September 2026 official 5.54% baseline and all financial calculations, app/API code, product guidance, translations and Vercel settings unchanged. Priority 4 readiness audited; live rollover remains OPEN.

## M72 — approved automatic CPI rate + source-link rollover (2026-11-08)
- User explicitly requested automatic replacement of CPI rate and **matching official source link only when a new official release is published**, otherwise preserve prior official rate and source.
- Updated `needs-finder.html` `loadInfl()` to validate the official PIB release URL, update rate/month/link together on a successful non-stale API observation, cache all three together, and restore only cached entries with valid official source URLs. Unattributed legacy cache entries are ignored rather than showing a new rate with the old September source. Failed/stale/older API responses leave the last verified observation untouched. Current September 2026 5.54% baseline and its original PIB link remain until a newer release is detected.
- Added six runtime-simulated tests `tests/cpi-source-link-m72.test.cjs` covering newer official release, older response, offline cache, legacy cache, invalid non-PIB URL, and no new release. Workflow `.github/workflows/cpi-source-link-m72.yml` runs M72/M71/M53 tests. CI result not independently verified at writing.
- Zero/negative rate handling remains a separate documented decision: the frontend continues to accept positive CPI rates only, preserving existing financial floor behavior. No formulas or product logic changed. The October official release is not yet published/verified; synthetic October test rates are not live data.
- Rollback `stable-2026-11-08-pre-m72-auto-cpi-source-link`. Browser live endpoint, Safari cache, and October release verification remain pending after publication. No new recurring automation created; existing daily official CPI monitor retained.

## M73 — Full regression audit and unified CI (2026-11-08)
- Detailed evidence `docs/M73_FULL_REGRESSION_AUDIT.md`. Corrected verified M70 test defect: only 116 base `ROWS` entries were counted although 468 runtime keys are assembled with `AR` and `AL`. Updated test to evaluate complete dictionary in Node vm. Independent V8 inspection confirmed 468 assembled keys, no empty locale values, no placeholder mismatches, and all source keys registered in CSV.
- Added `.github/workflows/full-regression-m73.yml` for syntax validation and `node --test tests/*.test.cjs` plus required file checks. GitHub Actions results cannot be independently read with currently available workflow endpoints; local git clone blocked by DNS. **Full test suite pass remains UNVERIFIED**, not failed or passed. Source-level audit is not end-to-end browser/physical iPhone verification.
- Customer export injected-marker E2E, legal/privacy signoff, native-speaker review, insurer/legal approval, IRDAI original workbook (user deferred), CPI release verification and physical Safari acceptance remain OPEN.
- Rollback `stable-2026-11-08-pre-m73-full-regression`. No app code, financial formulas, product guidance, translations or PDF layouts changed. Next: offer M74 CPI automation verification.

## M74 — CPI automation verification and official source integrity (2026-11-08)
- Report: `docs/M74_CPI_AUTOMATION_VERIFICATION.md`. Verified September 2026 5.54% official MoSPI/PIB source, October publication expected 12 Nov 2026. Live October rate not yet available/verified.
- Fixed a verified API parser attribution bug: CPI headline month/year and rate sentence month/year must match, preventing a new-month headline from being paired with an older month's rate. Added `tests/cpi-live-readiness-m74.test.cjs` (six cases), read-only live `tests/cpi-production-smoke-m74.cjs`, and `.github/workflows/cpi-verification-m74.yml`.
- Executed actual GitHub API parser/handler and frontend `loadInfl()` code with mocked official HTML, network and cache in JavaScript sandbox. Matching newer rate/month/link, mismatched fallback to September, no newer release, cached-offline source retention, old API response rejection and legacy cache rejection behaved as intended. Synthetic October 6.21% was only a test fixture.
- **Live endpoint direct HTTP unverified:** execution container DNS blocked, web fetch inaccessible. GitHub Actions remote smoke test result not independently observed; do not mark live CPI endpoint or full suite green. Vercel deployment SHA verification separately recorded.
- Rollback `stable-2026-11-08-pre-m74-cpi-verification`. No financial formulas, inflation floor, app HTML, translations, claims/product rules or PDF changed. Official October release rollover, physical iPhone, source click-through and zero/negative CPI frontend policy remain pending.

## M74 follow-up — deployment quota and CI verification (2026-11-08)
- Rechecked canonical GitHub `main` at `ab0b1f9f1db394da6b8a329c717ea4d62cb9efbe`; Vercel production alias is READY at `0324c955d44ebdee9d40c24e41cc03dea2c64eef`, so latest M74 tests/workflow/docs are not yet deployed. Parser correction itself is in the READY deployment.
- Explicit attempt to deploy GitHub HEAD using connected Vercel create_deployment failed with **HTTP 402 `api-deployments-free-per-day`**, with `retryAfter: 86400` seconds and user-action-required billing/plan remedy. Build-rate limit is **not cleared**. Do not loop retries, upgrade plan, or alter billing without user action.
- GitHub combined commit status for `ab0b1f9f` reports Vercel failure and a build-rate-limit upgrade URL. Connected `fetch_commit_workflow_runs` returned zero runs, but that endpoint only lists PR-triggered runs; absence is **not evidence that push CI failed or passed**. GitHub Actions outcome remains unverified.
- Follow-up: after Vercel daily quota resets, deploy latest GitHub HEAD and confirm production alias commit matches; separately inspect Actions UI for M73 full regression and M74 CPI tests/live smoke. Keep existing 5.54% September 2026 CPI and its official source until October official release is verified. No financial calculations changed.
