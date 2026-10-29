# Project State: Life Cover Needs Finder

Last updated: 2026-10-29 (bank-style redesign built on the rolled-back version)
Rule: this file is updated at every milestone, then copied to GitHub, Google Drive and the Claude Project.

## ROLLED BACK on 2026-10-28 (read this first)
- At your request the app was put back to the 2026-10-24 version (commit dc571e4): all 7 languages, plan recommendations visible with "Show plans", NO needs analysis phase 2 and plans NOT hidden.
- Everything built after that point was discarded from the live app: plans-off switch (PLANS_ON), assumptions card, age goals, retirement corpus, invest tables, education and marriage suggestions.
- Safe rollback points on GitHub (branches, nothing was deleted):
  - `stable-2026-10-24` = this version. To come back to it later: restore its files into main with `git checkout stable-2026-10-24 -- .`, commit and push.
  - `backup-phase2-2026-10-25` = the full phase 2 work (plans hidden, 331,018 bytes). To bring it back: `git checkout backup-phase2-2026-10-25 -- .`, commit and push.
- The Claude artifact (v40), the Project copy and the live site are the rolled-back version. The Google Drive part files and joiner (17 parts, fingerprint 4f4f0692) now match the redesigned app.

## What it is
A single-file web app (needs-finder.html) that helps advisors work out a customer's life cover gap and goals, and suggests Canara HSBC Life Insurance plans. For internal training use only.

## Where everything lives
- Live site: https://life-cover-needs-finder.vercel.app (Vercel, deploys from GitHub main)
- GitHub: kevincaiado-stack/life-cover-needs-finder (branch main). Project notes are in the `docs/` folder.
- Google Drive: folder "Needs Finder" (full app as 17 part files + joiner page, live-link file, these notes; the parts and joiner match the redesign, SHA 4f4f0692)
- Claude Project: "Needs Calculator App" (folder `needs-finder/`: this file, rules doc, app copy)
- Claude artifact: published copy of the app (updated with the redesign)

## Current status (latest milestone)
- Milestone 8 (2026-10-29): bank-style redesign on top of the rolled-back version. NOT the phase 2 work.
  - One step per screen with progress bar and Back/Next: 1 About you, 2 What you owe and have, 3 Retirement, 4 Your goals, 5 Summary. Total need and cover gap stay in a bottom bar. Clean navy/white theme, dark mode follows the phone.
  - New Retirement step: working years left are worked out automatically (age you stop working minus current age). Inflation starts at 5.54% = India retail inflation (CPI) for September 2026, MoSPI, released 12 Oct 2026 (constant INFL / INFL_ON in the code; update when asked). Advisor can change it. Shows monthly expenses after those years = expenses today x (1 + inflation)^years. Example: Rs 75,000, 20 years, 5.54% = Rs 2,20,497 a month. Also shown in the Summary.
  - 14 new translated lines (the 4 retirement lines reused from phase 2). Plans are visible again (plan recommendations were not touched).
  - Rollback: branch stable-2026-10-24 (before the redesign).
- Milestone 7: all 7 languages done (English, Hindi, Gujarati, Tamil, Malayalam, Kannada, Marathi), including plan panels. Plan names stay in English.
- Previous (rolled-back) app: commit dc571e4, 261,987 bytes, SHA-256 24e60472e014a9ad4939c89a2d069cebbc417c71d0dbbb35cb0ee40a82a5389e. Current app: see the latest commit on main (redesign).
- Deployed on Vercel (READY), Claude artifact v40 and Project copy. Drive full copy re-made on 2026-10-29 for the redesign (17 parts + joiner, SHA 4f4f0692).

## Milestones
1. First version: needs calculator (income value, loans, savings, cover, gap).
2. Goals as tap-to-open cards: home/wealth, retirement, child education and marriage.
3. Plan recommendation rules and plan facts added (see rules doc).
4. Charts and printable/downloadable summary.
5. Plan recommendations hidden until "Show plans"; immediate-income rule for market based plans.
6. Language dropdown added.
7. All 7 languages translated, deployed everywhere. Drive full copy as parts + joiner.

## Open items
- Native speakers should review all translations. Review sheet: docs/translation-review.csv (211 lines x 6 languages, with a Reviewer notes column). Automatic check done 2026-10-24: all 197 lines x 6 languages keep their {0} placeholders, bold tags and numbers, and none is left in English. No change to the app was needed. A native speaker still needs to check the wording.
- Check the live site language dropdown on a phone and a laptop.
- Drive: done for the redesign (SHA 4f4f0692...152f). If the app changes, re-make the Drive parts and change EXPECT in the joiner.
- Next step: user checks the redesign on a phone, then asks for changes one at a time. Drive copy now matches the redesign.

## Routine after every change
1. Edit the app. 2. Push to GitHub. 3. Deploy to Vercel. 4. Update Google Drive. 5. Republish the Claude artifact. 6. Replace the Project copy. 7. Update this file and the rules doc.

## Related files
- needs-finder-rules-and-status.md: plan facts, business rules, routine.
