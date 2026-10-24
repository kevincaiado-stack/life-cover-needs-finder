# Life Cover Needs Finder: rules and status

Last updated: 2026-10-21. Build: GitHub commit b8304b5 (main). Live: https://life-cover-needs-finder.vercel.app

**Every plan recommendation shows:** "This is Strictly for Internal Training Purposes only. These are purely illustrative values and not for Sale"

## Where things live
- Code: GitHub kevincaiado-stack/life-cover-needs-finder, single file `needs-finder.html`
- Public website: Vercel (production, from GitHub main)
- Google Drive folder: holds a FULL copy as 14 part files (`needs-finder.part01.txt` to `part14.txt`, byte-exact split of needs-finder.html at commit b8304b5) plus `needs-finder-joiner.html` (open it, select all 14 parts, it rebuilds needs-finder.html and checks it). Also `life-cover-needs-finder-live-link.html` (opens the live site) and `OLD-2026-10-21-life-cover-needs-finder.html` (old, no new languages). After any later change the parts must be re-made, or the joiner check will say the file differs.
- Claude artifact: same build (version 36), private
- Project file `needs-finder.html` in this project is a copy of the latest build

## Languages (added 2026-10-21)
- A "Language" dropdown sits under the page heading: English (default), Hindi, Gujarati, Tamil, Malayalam, Kannada, Marathi.
- The choice is remembered on the device (browser storage key "ncLang").
- Everything on the page is translated: headings, labels, buttons, notes, summary, charts, the saved summary file, AND the plan recommendation panels (suggested plans, variants, alerts, plan details, training notice).
- Plan names (Wealth Edge, Secure Invest, Promise4Life, Promise4Future, Iselect Guaranteed Future Plus, Income Now, Young Term) and short terms (PPC, PPT, ROP, ADB, ATPD) stay in English on purpose.
- Checked by computer: no English text left over in any language across ages, gaps and goal choices, no errors, dropdown switching works.
- **Still to do by people:** a native speaker of each language should read the translations, especially the compliance wording (training notice and "MUST BE OFFERED" alerts).

## How the page works (what the sales team sees)
1. **About you:** age (or date of birth), yearly income, monthly fixed expenses (yearly savings are worked out), age when you stop working (default 60).
2. **What you owe and what you have:** loans (B), savings and investments (C), existing life cover (D).
3. **Your goals:** one section. Every goal is a card that opens when tapped. A closed card is not counted, so the form stays short.
   - Child cards: "Child 1" has an age box, a "Child education" card (money needed at age 18) and a "Child marriage" card (money needed at age 25). "Add another child" adds more; "Remove" appears when there are two or more children.
   - "Home or Wealth Creation" card (needs the number of years; counted only if 10 or more years away).
   - "Passive Income or Retirement" card (years left come from age and stop-working age).
   - Each card: "I know the amount" or "Help me work it out" (today's cost plus optional yearly price rise %).
   - Choices sit side by side as round buttons: Lumpsum / Income based / Both; Market based / Guaranteed / Based on bonus; Immediate / At a later stage (shown only for Income based or Both).
   - **Immediate income is hidden when Market based is chosen** (it cannot be offered with market based plans, with Income based or Both). A short note explains this, and any earlier "Immediate" pick is cleared. Immediate is available only with Guaranteed or Based on bonus.
   - Home and marriage are Lumpsum only (the question is not shown).
4. **Summary (right side; on phones a bar at the bottom shows Total need and Cover gap, with a "View summary" link):** yearly figures, A to D, cover gap, priority order, total need, three charts.
5. **Plan recommendations are hidden until the advisor taps "Show plans"** (a Hide / Show plans switch above the priority list, visible once an age is entered). Only then do the gap plan and the goal plans appear, with the details described below.
6. Buttons: Print or save as PDF, Save summary file (the saved file leaves out the switch and buttons and uses the chosen language), Start over.

## How the numbers work
- Human Life Value (A) = (stop-working age minus current age) x yearly income
- Cover gap = (A + B) - (C + D), where B = loans, C = savings and investments, D = existing cover. Never below zero.
- A child goal is not counted if less than 5 years away or already past.
- Priority order: insurance gap first, then goals by how soon they are due.
- Total need = cover gap + all counted goals.
- Charts: need vs have bars, donut of total need, priority bars.

## Cover gap rules (plan offered for the gap)
- Age under 18 or over 65: no plan.
- Age 61 to 65: only Promise4Life, Century Milestone variant, red alert "MUST BE OFFERED". No Young Term.
- Gap below Rs 25 lakh (age 18 to 64): Promise4Life Century Milestone, red alert "MUST BE OFFERED". No Young Term at any age.
- Gap Rs 25 lakh or more: Young Term (age 18 to 60). Alert "Young Term plan MUST BE OFFERED" below age 55.
- Gap Rs 25 to 50 lakh and age 50 or more: Century Milestone also offered with Young Term.
- Gap above Rs 50 lakh: Young Term only.
- Century Milestone note: purely for legacy creation, not income replacement. Ideal for customers above 50 with a gap near Rs 50 lakh.
- Young Term key features: riders ADB and ATPD, increase cover at the same rate with Block Your Premium, Child Care Benefit, add your partner in the same policy.

## Goal plan rules (short version)
- Education or marriage under 5 years away: no plan. 5 to under 10 years: Wealth Edge.
- Market based, 10+ years: Wealth Edge or Secure Invest. Immediate income is not offered with market based plans.
- Bonus based: Promise4Future (lumpsum, or income later) or Promise4Life (income now). Lumpsum needs 12+ years.
- Guaranteed: Iselect Guaranteed Future Plus ("PPC MUST BE OPTED" up to age 55) or Income Now (ages 18 to 50, income now).
- Immediate income is possible only with Bonus based or Guaranteed plans.
- Income based or Both: the page also says to build a corpus with a lumpsum and use Systematic Withdrawals for regular income (market based).
- Child under 18: Wealth Edge Invest Plus can be in the child's name. Secure Invest cannot (minimum entry age 18). PPC under Premium Plus needs Life Assured and Proposer to be the same person.

## Plan details (shown under each suggestion)
- Wealth Edge: Invest Plus ideal age 0 to 65, term 10 to 30 yrs. Life Plus 18 to 65, term by default to 100. Premium Plus 18 to 50, term 10 to 30, offers PPC. Minimum premium Rs 1.25 lakh.
- Secure Invest: Choice 18 to 55, term 20 to 40. Forever 18 to 55, term by default to 85 (confirmed by the user on 2026-10-16). Minimum premium Rs 50,000.
- Iselect Guaranteed Future Plus: Endowment 0 to 65, max term 20. Regular Income 0 to 65, max term 40 by PPT. Long Term Income with ROP 0 to 65, term 15/20/30/40. PPC if Life Assured and Proposer same, ages 18 to 55, max term 85. Minimum premium Rs 1 lakh.
- Income Now: Early Income 0 to 50, income for 20 to 40 yrs, max term 80. Step up Income 0 to 50, income rises 100/150/200%, max term 80 (PPT x 3). Minimum premium Rs 50,000.
- Young Term: 18 to 60, max term 99*. Other conditions may apply.
- Promise4Life: Forever Income, Century Milestone, Assured Term Income all 0 to 65 (Assured Term Income pays in arrears, max 30 yrs). Minimum premium Rs 50,000.
- Promise4Future: Savings4Future 0 to 60 (max term 70). Income4Future 0 to 55 (max term 70). Minimum premium Rs 24,000.

## Routine after every change
1. Edit `needs-finder.html` and test it.
2. Push to GitHub (main).
3. Deploy on Vercel and check the live link.
4. Drive: the file is too big for one upload, so the full copy is kept as 14 parts + joiner (see Drive folder above). Re-split and re-upload after changes if a fresh full copy is wanted.
5. Republish the Claude artifact and replace the Project copy of `needs-finder.html`.

## Open items
- Native speakers should review the Hindi, Gujarati, Tamil, Malayalam, Kannada and Marathi wording, especially compliance lines.
- Decide whether to refresh the Drive parts after the next change (the joiner's check code is for b8304b5).
- Note: a gap of exactly Rs 25 lakh counts as "25 lakh or more". A red Century Milestone note for under-50s with a Rs 40 to 50 lakh gap was dropped earlier.
