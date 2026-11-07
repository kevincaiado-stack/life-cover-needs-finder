# P0 Compliance Audit — Life Cover Needs Finder (M47)

Date: 2026-11-07
Status: **Preliminary code/content audit completed; formal compliance approval NOT granted.**
Scope: GitHub `main` application (M46 baseline, followed by M47 saved-summary layout-only change), advisor guidance, financial illustrations, protection/goal language, disclosure, source references, export controls. This review is not legal, regulatory, actuarial or insurer compliance certification.

## M49 C01 primary-source reconciliation update (2026-11-07)
- Displayed FY2025–26 claim ratio corrected from 99.6% to **99.52% individual death claims** per official insurer website. FY2024–25 **99.43% individual** confirmed in official insurer annual report. FY26 press release's 99.6% statement lacks the same explicit denominator/category and cannot be assumed to be a simple rounding of 99.52%; FY25 **99.38%** is a different overall individual+group measure.
- **C01 insurer-primary-source verification complete for displayed figures; independent IRDAI workbook reconciliation and compliance/legal wording sign-off remain OPEN.** Details and links in `docs/CLAIMS_SOURCE_AUDIT_M49.md`. No formal regulatory approval claimed.

## M48 remediation and closure evidence (2026-11-07)

**Remediated in code, pending real-output QA:** C06 — saved-summary HTML now exports an explicit allowlist of six customer-visible sections (`nmBox`, `rwBox`, `pmBox`, `tlBox`, `mdBox`, `finBox`) instead of indiscriminately serializing any new section. The advisor-only `tpBox`, `objBox`, `ccBox`, `sayBox`, `qsBox`, voice controls, suggestions and product category blocks are excluded. Training-only disclaimer remains visible. M48 automated regression tests cover populated advisor sections and disclaimer. This is a **technical mitigation**, not a compliance sign-off; real iPhone print, HTML, PDF and WhatsApp inspection is still needed.

**Already implemented in M46/M47:** C03 zero-gap objection variants; C04 proportional savings split without double counting; C08 landscape first-page dashboard with overflow appendix. The financial formulas and unapproved wording have **not** been changed. These remain subject to suitability, presentation and native-language approval.

**Cannot be independently closed by development:** C01 official claim-ratio primary-source/definition verification (next Priority 2); C02 product suitability and two-year cutoff; C03 legal/linguistic approval of objection scripts; C04 financial-methodology approval; C05 legal disclaimer approval; C07 named native-speaker approvals; C09 next official CPI rollover. The application must continue to be labelled **internal training only**. None of these should be marked approved or verified without evidence from the responsible authority.

**Remediation decision:** Technical export leakage risk reduced; **P0 compliance approval remains OPEN**, not completed. User can defer the external approvals, but should not use the material for regulated advice or sales until signed off.

## Findings and action register (highest risk first)

| ID | Priority | Evidence in current application | Risk / required action | Approval owner | Status |
|---|---|---|---|---|---|
| C01 | P0 | `csrBox()` shows Canara HSBC Life claim settlement ratios **99.6% FY2025-26** and **99.43% FY2024-25** using `CSR` and `CSRL`. Wording calls these claims approved out of claims received. | Verify each official insurer/IRDAI primary document, numerator/denominator, individual vs group, number vs benefit amount, FY period and publication date. Confirm links work and wording is approved. Until verified, figures must not be quoted to customers. | Insurer compliance + product/legal | Open — primary-source reconciliation pending |
| C02 | P0 | `renderTl()` and `pcat()` offer term / market-linked / traditional product-type suggestions, and retirement `t.y<=2` switches to immediate-income suggestion. | Suitability is not determined solely by years to goal. Confirm customer profile, risk appetite, liquidity, product disclosures and 2-year threshold with approved product guidance. No advice for external use until signed off. | Product + compliance | Open |
| C03 | P0 | `renderObj()` generates Feel–Felt–Found/close/urgency language; M46 zero-gap variants are active. | Review every objection in all seven languages for fair treatment, absence of undue pressure or misleading assurances, suitability, claims statements and unsupported urgency. Require sign-off on exact strings. | Compliance + language reviewers | Open |
| C04 | P0 | `renderRw()` and `rwY()` show family runway; `renderTl()` allocates one monthly savings budget across future goals, assumes zero returns and does not reallocate surplus. | Validate presentation of assumptions, protection vs investment distinction, nominal vs inflation-adjusted values, edge cases and whether "remaining gap" could be misread as guaranteed goal shortfall. Existing business formulas unchanged in M47. | Financial planning/product + compliance | Open |
| C05 | P0 | `#sumDisc` says "Strictly for Internal Training Purposes only. These are purely illustrative values and not for Sale". Summary builder retains disclaimer. | Confirm exact capitalization/wording and its visibility in print, HTML download and WhatsApp. Restrict customer/external use until approval. | Legal/compliance | Open |
| C06 | P0 | `buildSummary()` excludes `tpBox`, `objBox`, `ccBox`, `raBox`, `.pcat`, `.ptip`, etc. M47 retains those exclusions. | Run real-device and automated regression tests across all languages for HTML, print/PDF and WhatsApp, including zero-gap case. Confirm no advisor-only content leaks. | Privacy + QA + compliance | Automated tests partial; manual sign-off open |
| C07 | P0 | Seven-language translations include M44 savings, M45 UX and M46 OBJ0 additions. | Reviewer name, locale, row IDs, date and exact approved strings required; earlier user-reported review had unspecified scope. | Native reviewers + compliance | Open |
| C08 | P1 | Saved summary was 3–4 A4 pages in example. M47 replaces it with landscape KPI dashboard and moves overflow panels to a detailed appendix. | Verify readable one-page overview and lossless overflow for many goals, seven-language scripts, browsers and physical iPhone; appendix may exceed one page if content requires it. Confirm whether this presentation is approved for training use. | UX + QA + compliance | Implementation under verification |
| C09 | P1 | Official CPI comes from MoSPI via PIB and is displayed in inflation-sensitive projections. | Verify new-month publication detection and attribution on first real release; don't imply official live data is newer than the source month. | Data QA | Open |

## Approval checklist

- [ ] **Insurer compliance owner** signs off C01, C02, C03, C05 and the approved version/date.
- [ ] **Product/financial planning owner** confirms C02 (including the 2-year cutoff) and C04 assumptions.
- [ ] **Legal/privacy reviewer** confirms training-only restriction and C06 export exclusions for real output artifacts.
- [ ] **Native-language reviewers** sign off active text in Hindi, Gujarati, Tamil, Malayalam, Kannada and Marathi, specifically M44–M46 changes.
- [ ] **QA reviewer** supplies real-device PDF/HTML/WhatsApp evidence for C06/C08.
- [ ] **Project owner** decides whether the appendix is acceptable and whether summary may be shared beyond internal training (currently: **no**).

## Audit outcome

**Decision: HOLD for external/customer-facing deployment or sales use.** The production application remains an **internal-training-only illustrative tool**. This audit is an evidence-based issue register, not a regulator or insurer approval. No business formulas, financial rules, claim figures, product advice or translation content were changed as part of the M47 layout implementation.

## Priority navigation

After this P0 compliance audit, next item in order is **P0 claim-settlement ratio primary-source verification (C01)**. User may explicitly choose **Start** or **Skip for now**; skipped items remain open in `docs/PENDING_WORK.md`.
