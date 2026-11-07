# AI Handover — Life Cover Needs Finder

Updated: 2026-11-07 (M39 added)
Repository: https://github.com/kevincaiado-stack/life-cover-needs-finder
Production: https://life-cover-needs-finder.vercel.app/
Canonical branch: main

## Standing instructions from the user (Kevin) — READ FIRST (added by Claude, 2026-11-07)
1. **Before building anything:** fetch GitHub main, read this file and docs/PROJECT_STATE.md, update this file if anything is missing, then proceed.
2. **After every change** update, in this order: docs/AI_HANDOVER.md, docs/PROJECT_STATE.md (milestone entry, rollback branch), docs/translation-review.csv (new translated lines), GitHub main, a rollback branch, and the Claude copies (Claude artifact https://claude.ai/artifact/ANuVBdzZuozqm3bKmsezaJ and the Claude Project folder needs-finder/ which holds needs-finder.html, PROJECT_STATE.md, translation-review.csv). Vercel deploys from GitHub main (https://life-cover-needs-finder.vercel.app) and must be checked separately.
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

## Monthly official CPI recalculation validation — 2026-11-07
- Confirmed existing client flow: on each visit loadInfl() calls /api/inflation with no-store and cache-busting; when an official response has a valid reporting period >= saved baseline, it updates INFL/INFL_ON, saves them and calls render(). The retirement inflation projections recompute with the applied rate. An intentional higher user scenario rate is preserved.
- Added Chromium regression checks: changing CPI changes retirement-expense projection (passed, run 42279236271); a new test stubs the official endpoint response and asserts loadInfl() updates month, rate, live state and visible projections (run pending verification).
- **External blocker remains**: production official-only endpoint returned ok:false; a MoSPI eSankhyiki homepage KPI is not reliably exposed as server-readable HTML. Official documented CPI API is advertised at https://esankhyiki.mospi.gov.in/macroindicators?product=cpi&tab=api (GET /api/cpi/getCPIData). Its request parameters and response schema have not been validated; do not substitute an invented API integration.
- Preserve government-only source policy. Do not claim end-to-end automatic new-month detection is operational until Vercel live response returns ok:true with a verified latest All-India Combined General CPI inflation rate.

## Official-only inflation on each website visit — 2026-11-07
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

## Inflation source attribution follow-up — 2026-11-07
- Verified official MoSPI/PIB September 2026 all-India combined CPI inflation: 5.54% (published 12 October 2026). October 2026 CPI is scheduled for release on 12 November 2026. Official reference: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3
- Updated all seven existing live-rate labels to identify **Trading Economics (MoSPI CPI data)** rather than imply a direct MoSPI connection. Saved official September 2026 baseline and fallback messages remain unchanged.
- Evaluated MoSPI eSankhyiki CPI catalogue: https://esankhyiki.mospi.gov.in/catalogue-main/catalogue?product=CPI . It exposes official releases, but no stable documented public API contract was verified in this task. Do not switch to an untested endpoint or scrape official PDFs in production.
- Follow-up: integrate a verified official structured API when access/schema/uptime and regression fixtures can be validated; consider native-speaker sign-off for revised attribution translations.
- App layout, inflation arithmetic, product rules, and supported languages were not changed.

## Latest engineering update — Phase 2 (2026-11-07)
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
