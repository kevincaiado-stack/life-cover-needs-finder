# Project State: Life Cover Needs Finder

Last updated: 2026-10-25 (needs analysis phase 2 built, Drive copy refreshed)
Rule: this file is updated at every milestone, then copied to GitHub, Google Drive and the Claude Project.

## What it is
A single-file web app (needs-finder.html) that helps advisors work out a customer's life cover gap and goals, and suggests Canara HSBC Life Insurance plans. For internal training use only.

## Where everything lives
- Live site: https://life-cover-needs-finder.vercel.app (Vercel, deploys from GitHub main)
- GitHub: kevincaiado-stack/life-cover-needs-finder (branch main). Project notes are in the `docs/` folder.
- Google Drive: folder "Needs Finder" (full app as 17 part files + joiner page, live-link file, these notes)
- Claude Project: "Needs Calculator App" (folder `needs-finder/`: this file, rules doc, app copy)
- Claude artifact: published copy of the app (version 39)

## Current status (latest milestone)
- Milestone 9: needs analysis phase 2 (plans stay hidden, flag PLANS_ON=false).
  - New card "Your assumptions": retirement price rise (default 5%, minimum 5%), goal price rise (default 6%, minimum 6%), FD rate for the corpus (default 6%), expected investment return (5, 6, 7, 8, 10, 12, 15 or above 15; default 5%).
  - New card "Goals people your age usually plan for": general guidance by age band (18-25, 26-35, 36-45, 46-55, 56-64, 65+).
  - New card "Your expenses at retirement": monthly expense today x (1 + 5%)^years to retirement (retirement age from the form, default 60), yearly expense, corpus = yearly expense / FD rate, and an invest table.
  - Every goal with "Help me work it out" uses a 6%+ price rise and shows an invest table: monthly SIP and one-time amount today for 5, 7 and 10 years (only those shorter than the goal) plus "until the goal". SIP = FV x i / (((1+i)^n - 1) x (1+i)), i = rate/12 (paid at start of month); one-time = FV / (1+rate)^years.
  - Passive Income or Retirement goal: asks the monthly amount needed today, inflates it, and the goal amount is the corpus (future yearly expense / FD rate).
  - Child education suggested starting cost Rs 12,50,000 = about Rs 9 lakh average 4-year course fee at 9 top IITs (2025 fee lists, studycafe.in) + about Rs 3.4 lakh hostel and mess (IIT Bombay 2026-27: hostel 19,950 + mess 22,500 per semester x 8). Marriage suggested Rs 30,00,000 = middle of the Rs 10-50 lakh range for a traditional wedding (bajajfinserv.in; WedMeGood's 2025 platform average is 39.5 lakh, a higher-end reference). Both are editable and are filled in only when the user opens "Help me work it out".
  - All new text translated into the 6 languages (67 new lines; needs native review).
- App file: 331018 bytes, SHA-256 4cdd9b95df08eab4b1491645fc94f7780a1bd7e8553ec242c415c16629da0bff
- Drive: the 17 part files + joiner now match the current app (SHA-256 above). Everything is current: live site, GitHub, Project, artifact and Drive.

## Milestones
1. First version: needs calculator (income value, loans, savings, cover, gap).
2. Goals as tap-to-open cards: home/wealth, retirement, child education and marriage.
3. Plan recommendation rules and plan facts added (see rules doc).
4. Charts and printable/downloadable summary.
5. Plan recommendations hidden until "Show plans"; immediate-income rule for market based plans.
6. Language dropdown added.
7. All 7 languages translated, deployed everywhere. Drive full copy as parts + joiner.
8. Plan recommendations and plan questions hidden; needs analysis is the focus.
9. Needs analysis phase 2: assumptions, age goals, retirement expense and corpus, invest tables, education and marriage benchmarks.

## Open items
- Native speakers should review all translations. Review sheet: docs/translation-review.csv (197 lines x 6 languages, with a Reviewer notes column). Automatic check done 2026-10-24: all 197 lines x 6 languages keep their {0} placeholders, bold tags and numbers, and none is left in English. No change to the app was needed. A native speaker still needs to check the wording.
- Check the live site language dropdown on a phone and a laptop.
- Drive parts + joiner re-made on 2026-10-25 for the 331,018-byte version. Re-make at the next big milestone. Old part01 (b8304b5) could not be moved by the Drive connector and may still sit in the Trash or folder; ignore any file marked OLD.
- User to review the new numbers (education 12.5 lakh and marriage 30 lakh suggestions) and decide the next needs analysis improvements.
- The 67 new translated lines need native review; docs/translation-review.csv is refreshed.

## Routine after every change
1. Edit the app. 2. Push to GitHub. 3. Deploy to Vercel. 4. Update Google Drive. 5. Republish the Claude artifact. 6. Replace the Project copy. 7. Update this file and the rules doc.

## Related files
- needs-finder-rules-and-status.md: plan facts, business rules, routine.
