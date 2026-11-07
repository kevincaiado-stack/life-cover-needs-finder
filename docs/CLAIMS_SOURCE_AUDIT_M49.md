# M49 — Primary-source verification of claim settlement ratios

Date: 2026-11-07. Scope: Canara HSBC Life Insurance, individual death claim settlement by **number**, FY2025–26 and FY2024–25.

## Verified findings

1. **FY2025–26 — 99.52%**: Insurer's current official homepage explicitly labels **99.52% Claims Settled — Individual Death Claims settled for FY 2025–2026**. Primary source: https://www.canarahsbclife.com/ (accessed 2026-11-07).
2. **FY2025–26 — 99.6%**: Insurer's 28 April 2026 FY26 press release says “best-ever claims settlement ratio at 99.6%”, but does not provide the precise category and denominator in that statement. Primary source: https://www.canarahsbclife.com/content/dam/chli/pdfs/investor-relations/financials/quarterly-financial-results/3/canara-hsbc-life-fy-2025-26-financial-results-press-release.pdf . **Do not substitute this rounded figure for the explicitly defined 99.52% individual-claim figure.** It may be based on a different measure or reporting convention; do not assume a rounding relationship, because 99.52% would ordinarily round to 99.5% to one decimal.
3. **FY2024–25 — 99.43%**: Insurer's FY2024–25 annual report says 2,785 individual death claims were received, 2,771 were settled/paid and 16 repudiated, and reports **99.43% individual death claim settlement** as at 31 March 2025. The insurer also reports **99.38% overall individual + group settlement**, which must not be compared directly with the individual-only rate. Primary source: https://www.canarahsbclife.com/content/dam/chli/pdf/public-disclosure/other-disclosure/annual-report/13/annual-report-2024-25.pdf . The reported 99.43% may include opening pending claims in the denominator; 2,771/2,785 alone is approximately 99.50%, so avoid claiming that 2,785 is the complete denominator.
4. IRDAI 2024–25 handbook Table 15 is the relevant regulator benchmark for individual death claims, but the official regulator workbook was **not independently retrieved and reconciled in this review**. Do not claim IRDAI sign-off or independent 2025–26 regulatory validation. Insurer primary-source verification is complete for displayed figures.

## Change in M49

- Changed displayed FY2025–26 value from **99.6%** to **99.52%**, explicitly identified as **individual death claims settled by number** per insurer website.
- Kept FY2024–25 **99.43%** from the insurer's annual report; added distinction from overall 99.38% individual+group.
- Added explanation of the separate 99.6% press release statement and warnings against mixing categories or treating historical ratios as individual-claim guarantees.
- Source links now point directly to insurer homepage, annual report and FY26 press release. No claim calculation, insurance coverage formula, financial recommendation, language dictionary or privacy rule changed.
- New M49 browser regression test verifies values, metric label and links.

## Remaining approval

Insurer compliance/legal owner must approve exact customer-facing wording and metric definition; official IRDAI workbook independent reconciliation is outstanding. The site remains **internal training only**. Do not close P0 compliance sign-off merely because the figures were corrected.

## Next priority

**Priority 3 — P0 export privacy:** Inspect saved HTML, PDF/print and WhatsApp for advisor-only information across screen modes and languages. Offer **Start** or **Skip for now**.
