# M67 — Claims reconciliation and sequential audit evidence (2026-11-08)

## Gate 0 — IRDAI claims reconciliation (requested first)
- Official regulator index: https://irdai.gov.in/handbook-of-indian-insurance — Handbook 2024-25, published 2026-02-03, offered as a 6.3MB ZIP of Excel workbooks. Direct download of the official ZIP returned HTTP 403 in the web retrieval environment; **the original IRDAI Table 15 workbook was not independently opened**. Do not claim regulator-original verification or sign-off.
- Official insurer annual report: https://www.canarahsbclife.com/content/dam/chli/pdf/public-disclosure/other-disclosure/annual-report/13/annual-report-2024-25.pdf , pages 53 and 59: retail/individual FY2024-25 ratio **99.43%**; 2,785 new claims, 2,771 paid, 16 repudiated. Its 99.38% **overall individual+group** is a separate measure. 2,785 new claims is not the denominator for the reported ratio because 2 opening claims also existed.
- Two independent secondary reproductions explicitly attributed to IRDAI Table 15 report **2,787 total individual death claims and 2,771 paid = 99.4259%, rounded 99.43%**: https://www.rakshitinsurance.com/insurer-claim-settlement-ratio/canara-hsbc-life and https://www.rakshitinsurance.com/irdai-handbook . These are **secondary cross-checks, not substitute original workbook**. By amount FY2024-25 99.08% is a different metric.
- FY2025-26 99.52% remains insurer-source-supported per M49; separate 99.6% press release is not interchangeable. FY2025-26 original IRDAI table not established.
- Decision: **Numerical cross-check supported; regulator-original reconciliation BLOCKED on access; formal insurer/legal approval NOT granted.** Preserve existing app figures and internal-training-only restriction. Request original official ZIP/Part I Table 15 workbook from authorized source and named compliance sign-off before closing C01.

## Priority 1 — customer export privacy
- Prior M48/M50 audits document strict HTML/PDF allowlist (nmBox, rwBox, pmBox, tlBox, mdBox, finBox) and WhatsApp fixed text generator, with advisor-only sections excluded. M65/M66 direct PDF renders the output of the same buildSummary() method rather than the live advisor DOM. This is a **source-level architecture review**; no new browser/physical-device execution or screenshot verification in M67.
- **Pending acceptance:** actual PDFs and WhatsApp share sheets across seven languages, advisor/customer screen modes, zero-gap and long-goal cases; named legal/privacy reviewer approval. Technical safeguard remains implemented; final privacy sign-off OPEN.

## Priority 2 — product and claims
- Product brochure/UIN matrix in PRODUCT_ELIGIBILITY_RECONCILIATION.md M58 and approved narrow M59 copy changes remain authoritative. Do not change product age/premium/term gates or 2-year immediate-income recommendation threshold without user/product/compliance approval. Remaining claims evidence gate described above. No formulas changed.

## Priority 3 — language review
- Seven locales en/hi/gu/ta/ml/kn/mr exist; M51 dictionary parity audit and translation-review.csv register exist. Named native-speaker sign-off for six non-English languages, active M44–M46 and subsequent product/summary text, remains OPEN. English fallback is not native-language certification.

## Priority 4 — CPI
- Scheduled October 2026 CPI release is 2026-11-12, later than this audit date. A real new-month rollover cannot yet be tested. Existing official-only monitoring and production /api/inflation checks are documented in M53; verify fresh release, month label, attribution and recalculation after publication. Do not invent the new rate or silently change assumptions.

## Release discipline
- Pre-audit rollback: stable-2026-11-08-pre-m67-audit-sequence. This is a documentation/evidence checkpoint only. No app code, financial calculations, product rules, translations, privacy allowlist, or Vercel configuration changed. Claims original workbook, named approvals, actual cross-mode/locale export evidence and post-release CPI rollover are outstanding and cannot be marked complete without the evidence.
