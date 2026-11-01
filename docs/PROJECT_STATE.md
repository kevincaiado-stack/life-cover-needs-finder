# Project State: Life Cover Needs Finder

Last updated: 2026-11-01 (everything synced except Drive)
Rule: this file is updated at every milestone, then copied to GitHub, Google Drive and the Claude Project.

## ROLLED BACK on 2026-10-28 (read this first)
- At your request the app was put back to the 2026-10-24 version (commit dc571e4): all 7 languages, plan recommendations visible with "Show plans", NO needs analysis phase 2 and plans NOT hidden.
- Everything built after that point was discarded from the live app: plans-off switch (PLANS_ON), assumptions card, age goals, retirement corpus, invest tables, education and marriage suggestions.
- Safe rollback points on GitHub (branches, nothing was deleted):
  - `stable-2026-10-24` = this version. To come back to it later: restore its files into main with `git checkout stable-2026-10-24 -- .`, commit and push.
  - `backup-phase2-2026-10-25` = the full phase 2 work (plans hidden, 331,018 bytes). To bring it back: `git checkout backup-phase2-2026-10-25 -- .`, commit and push.
- The Claude artifact (v40), the Project copy and the live site are the rolled-back version. The Google Drive part files and joiner (18 parts, fingerprint ff0c5004) are one version behind the current app (user chose not to update them on 2026-11-01).

## What it is
A single-file web app (needs-finder.html) that helps advisors work out a customer's life cover gap and goals, and suggests Canara HSBC Life Insurance plans. For internal training use only.

## Where everything lives
- Live site: https://life-cover-needs-finder.vercel.app (Vercel, deploys from GitHub main)
- GitHub: kevincaiado-stack/life-cover-needs-finder (branch main). Project notes are in the `docs/` folder.
- Google Drive: folder "Needs Finder" (full app as 18 part files + joiner page, these notes; the parts and joiner match commit e5a2eff, SHA ff0c5004...cf8e)
- Claude Project: "Needs Calculator App" (folder `needs-finder/`: this file, rules doc, app copy)
- Claude artifact: published copy of the app (updated with the redesign)

## Current status (latest milestone)
- Sync check (2026-11-01): GitHub main = commit 362f643 and later notes commit, Claude artifact v49, Project copy (app, state, rules, translation review sheet) all match the current app (SHA-256 fe600396...a940, 291,xxx bytes). Vercel deploys from GitHub by itself; I could not read the live deployment from here to confirm. Google Drive NOT updated (by choice): it still holds commit e5a2eff. Translation review sheet now has 226 lines (15 new lines added).
- Milestone 17 (2026-11-01): every course in the Course drop-down shows its range (Average of top courses Rs 8 lakh to 1.58 crore, IIT Rs 8 to 10 lakh, IIM Rs 17 to 27.5 lakh, top private engineering Rs 7.8 to 24 lakh, MBBS government up to Rs 10 lakh, MBBS private Rs 54 lakh to 1.58 crore), translated. Selecting a course fills the typical cost, editable. Updated: GitHub, Vercel, artifact, Project. Drive NOT updated (by choice).
- Milestone 16 (2026-11-01): the Course drop-down now shows the range for private MBBS: "MBBS (private): Rs 54 lakh to Rs 1.58 crore" (translated). Selecting it fills Rs 1 crore, which can be edited. Updated: GitHub, Vercel, artifact, Project. Drive NOT updated (by choice).
- Milestone 15 (2026-11-01): education and wedding costs re-checked against the latest 2026 sources. Education default now Rs 31 lakh (IIT 9 lakh, IIM 22, top private engineering 15.5, MBBS government 10, MBBS private 1 crore because 2026 deemed-college fees rose); wedding stays Rs 39.5 lakh (no newer all-India figure). The hints now say "Checked Nov 2026". These costs are fixed numbers: re-check them whenever the goals are touched. Updated: GitHub, Vercel, artifact, Project. Drive NOT updated (by choice).
- Milestone 14 (2026-11-01): Summary page: "1. Insurance gap (immediately)" and "Monthly expenses at retirement (in N yrs)", matching the goals that already show (in N yrs). 1 new translated line ("immediately"). Updated: GitHub, Vercel (auto), artifact, Project. Drive NOT updated (by choice).
- Milestone 13 (2026-11-01): child education and marriage goals now open in "Help me work it out" with researched defaults: education Rs 24 lakh (average of IIT B.Tech, IIM MBA, top private engineering, MBBS government and private; a Course drop-down lets the advisor pick one), marriage Rs 39.5 lakh (WedMeGood 2025-26). Future cost = cost today x (1 + inflation)^years, using the same live rate and floor as page 1 (read-only in the goal). Sources and numbers are in the rules doc. 8 new translated lines (R8). Rollback: commit bfb37fd. Updated: GitHub, Vercel (auto), artifact, Project. Drive NOT updated (one version behind, by choice, now two changes behind).
- Milestone 12 (2026-11-01): the app now remembers the last live inflation rate in the browser (key ncInfl). If the helper cannot answer, it shows that remembered rate (if newer than the saved 5.54%, 09/2026) and says "Could not get the live rate". Commit bfb37fd, 282,310 bytes, SHA-256 fd9df18f75eff8f75b0743cd2277aff728f3a461684b07798e2509e7845b6c98. Updated: GitHub, Vercel (auto), Claude artifact, Project copy. NOT updated on purpose (user's choice): Google Drive parts and joiner, which still hold commit e5a2eff (SHA ff0c5004).
- Milestone 11 (2026-10-31): Google Drive rebuilt. 18 part files (needs-finder.part01.txt to part18.txt, 9,734 bytes each except where shorter) + joiner page (N=18) now match the current app (commit e5a2eff, 281,994 bytes, SHA-256 ff0c50047a2b0937451a4143074c19db2264ffa20bc4057a7919332495d0cf8e). The joiner has not been tested by the user yet.
- Milestone 10 (2026-10-31): live inflation rate.
  - A small helper on the Vercel site, `api/inflation.js` (URL: /api/inflation), reads the latest India CPI (year on year) from tradingeconomics.com and returns the rate and month. It checks the number is sensible (0 to 25%). Answers are cached for 6 hours.
  - The app asks the helper when it opens (8 second limit). If it answers, that rate becomes the floor and the starting value. If it cannot (no internet, helper down, page changed), the app shows the last saved rate (5.54%, 09/2026) and says so.
  - The rate box is now editable: type a number, or use + and - (steps of 0.5). Anything below the floor snaps back to the floor; up to 30% is allowed.
  - The saved fallback is still typed in the app (INFL, INFL_ON). Refresh it now and then. Test the helper any time by opening /api/inflation?debug=1.
  - Risk: the helper depends on one public page. If that page changes its wording, the app quietly falls back to the saved rate. Tell me if the note says "Could not get the live rate".
  - 2 new translated lines. Rollback: branch stable-2026-10-30-onepage (before the live rate).
- Milestone 9 (2026-10-30): Retirement is no longer a separate page. It sits at the bottom of page 1 (About you), under Yearly savings. Steps are now 4: About you, What you owe and have, Your goals, Summary.
  - Inflation uses a minus / plus control (steps of 0.5). It starts at the latest India CPI (5.54%, Sept 2026) and can never go below it; it can go up to 30%.
  - The result shows: Monthly expenses today, Years left until you stop working, and the big blue box with the monthly expenses after those years. Also in the Summary.
  - The latest rate is typed in the code (INFL, INFL_ON); it is not a live feed. Update it when the next CPI is released (about 12 Nov 2026) or when asked.
  - 3 new translated lines. Rollback: branch stable-2026-10-29-redesign (the 5-step version).
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
- Check the live inflation note on the live site (should say "Live rate").
- Check the live site language dropdown on a phone and a laptop.
- Drive is one version behind (commit e5a2eff, before the remembered-rate change). Done for commit e5a2eff (SHA ff0c5004...cf8e). If the app changes, re-make the Drive parts and change EXPECT and N in the joiner. User still to test the joiner.
- Next step: user checks the redesign on a phone, then asks for changes one at a time. Drive copy is one version behind by choice.

## Routine after every change
1. Edit the app. 2. Push to GitHub. 3. Deploy to Vercel. 4. Update Google Drive. 5. Republish the Claude artifact. 6. Replace the Project copy. 7. Update this file and the rules doc.

## Related files
- needs-finder-rules-and-status.md: plan facts, business rules, routine.
