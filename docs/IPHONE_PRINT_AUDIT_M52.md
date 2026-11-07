# M52 — Priority 5 iPhone Safari and A4 landscape saved-summary audit

Date: 2026-11-08. Status: **automated browser remediation implemented and passing; physical iPhone sign-off OPEN**.

## Verified issues and changes

| ID | Issue | Change / evidence |
|---|---|---|
| P5-01 | The saved dashboard used `scrollHeight > 690` pixels to move panels to the appendix. The hard-coded threshold did not track the actual A4 landscape printable area and could cause overflow or premature moves. | Measure the dashboard's rendered bottom against the first page's A4 landscape printable height: 210 mm page height minus 8 mm margins at top/bottom = **194 mm**. Move panels in priority order to the appendix until the dashboard fits. Preserve all panel DOM nodes, including long goal lists, rather than deleting or truncating them. |
| P5-02 | Print stylesheet relied on responsive width and grid fragmentation, risking extra page breaks and difficult-to-read appendix. | Set explicit printable width **281 mm** (297 mm minus 16 mm margins), remove print padding, preserve a two-column first-page dashboard, and use a single-column, breakable appendix for long content. |
| P5-03 | App print button waited a fixed 450 ms before printing; could fire before fonts/layout settled. | Wait for standalone summary document's `document.fonts.ready`, re-run pagination, then invoke print. Browser popup blocking continues to show the existing Save summary fallback message. |
| P5-04 | Print and export regressions were not exercised with deliberately oversized detail. | New Chromium tests inject 95 additional detail lines, confirm the first-page dashboard fits within 194 mm, verify the content survives in the appendix, generate a nonempty PDF, and repeat the summary export/privacy check across all seven languages. |

## What is preserved

- Existing `buildSummary()` customer-only six-panel allowlist, training disclaimer, three KPIs and conditional appendix.
- Original savings, inflation, cover-gap, runway, retirement and goals calculations; no financial formulas changed.
- The privacy-safe print/export path introduced in M50; advisor objection and product/talking-point sections remain excluded.
- WhatsApp summary construction and all seven runtime translations unchanged.

## Test evidence

GitHub Actions workflow `Phase 3 mobile browser smoke` for M52 app/test commit **5d38731beda7a26145ee1ff850830d6101352879**: **19 passed, 0 failed**. Includes generated Chromium PDF and oversized appendix checks. This is a simulated mobile viewport in Chromium, **not physical Safari**.

## Physical iPhone Safari sign-off checklist (user action required)

1. On iPhone Safari open https://life-cover-needs-finder.vercel.app/ and select **Customer screen**, then **Advisor screen**. Enter a realistic test case; verify no sideways scrolling of the application, sticky figures and 44px-class tap targets.
2. Tap **Print or save as PDF** in the app, not Safari's page-level Print. In the opened summary, confirm a **landscape A4 dashboard** with the three KPIs, date, disclaimer and readable panels. On the iOS Share/Print sheet, inspect the PDF preview and save it to Files.
3. Repeat with multiple goals and long details. Confirm that the first page remains the dashboard, the appendix starts only when needed, and no goal or figure is missing or clipped.
4. Check Hindi, Gujarati, Tamil, Malayalam, Kannada and Marathi for script clipping and readability. No native-speaker linguistic sign-off is implied.
5. Verify the saved HTML opens on iPhone, and WhatsApp sharing shows only customer-safe information and the training disclaimer. Do not share any real customer data while testing.
6. If the print window is blocked, use **Save summary file** and open the saved HTML in Safari; then print from the summary itself. Record iOS version, Safari behavior, language, case complexity and screenshots with personal data hidden.

## Limitations

Chromium PDF generation proves export works in CI, but does not establish exact page count for every possible input, nor native Safari PDF behavior. Very long sections can span additional appendix pages; this is intentional to preserve all information. Formal privacy/compliance and native-language sign-off from earlier priorities remain open.

## Next priority

**Priority 6 — P1 CPI source freshness and fallback behavior**: verify MoSPI/PIB-only updates, stale/offline behavior, month label and projection recalculation. Offer Start or Skip. Do not change CPI floor/financial rules without explicit approval.
