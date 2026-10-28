# Project State: Life Cover Needs Finder

Last updated: 2026-10-28 (rolled back to the 2026-10-24 version)
Rule: this file is updated at every milestone, then copied to GitHub, Google Drive and the Claude Project.

## ROLLED BACK on 2026-10-28 (read this first)
- At your request the app was put back to the 2026-10-24 version (commit dc571e4): all 7 languages, plan recommendations visible with "Show plans", NO needs analysis phase 2 and plans NOT hidden.
- Everything built after that point was discarded from the live app: plans-off switch (PLANS_ON), assumptions card, age goals, retirement corpus, invest tables, education and marriage suggestions.
- Safe rollback points on GitHub (branches, nothing was deleted):
  - `stable-2026-10-24` = this version. To come back to it later: restore its files into main with `git checkout stable-2026-10-24 -- .`, commit and push.
  - `backup-phase2-2026-10-25` = the full phase 2 work (plans hidden, 331,018 bytes). To bring it back: `git checkout backup-phase2-2026-10-25 -- .`, commit and push.
- Google Drive part files and the Claude artifact may still hold the phase 2 version until refreshed (see Open items).

## What it is
A single-file web app (needs-finder.html) that helps advisors work out a customer's life cover gap and goals, and suggests Canara HSBC Life Insurance plans. For internal training use only.

## Where everything lives
- Live site: https://life-cover-needs-finder.vercel.app (Vercel, deploys from GitHub main)
- GitHub: kevincaiado-stack/life-cover-needs-finder (branch main). Project notes are in the `docs/` folder.
- Google Drive: folder "Needs Finder" (full app as 14 part files + joiner page, live-link file, these notes)
- Claude Project: "Needs Calculator App" (folder `needs-finder/`: this file, rules doc, app copy)
- Claude artifact: published copy of the app (version 36)

## Current status (latest milestone)
- Milestone 7: all 7 languages done (English, Hindi, Gujarati, Tamil, Malayalam, Kannada, Marathi), including plan panels. Plan names stay in English.
- App code is the same as commit b8304b5 / dc571e4. App file: 261,987 bytes, SHA-256 24e60472e014a9ad4939c89a2d069cebbc417c71d0dbbb35cb0ee40a82a5389e
- Deployed on Vercel (READY), Claude artifact v36, Project copy, Drive full copy (parts + joiner).

## Milestones
1. First version: needs calculator (income value, loans, savings, cover, gap).
2. Goals as tap-to-open cards: home/wealth, retirement, child education and marriage.
3. Plan recommendation rules and plan facts added (see rules doc).
4. Charts and printable/downloadable summary.
5. Plan recommendations hidden until "Show plans"; immediate-income rule for market based plans.
6. Language dropdown added.
7. All 7 languages translated, deployed everywhere. Drive full copy as parts + joiner.

## Open items
- Native speakers should review all translations. Review sheet: docs/translation-review.csv (197 lines x 6 languages, with a Reviewer notes column). Automatic check done 2026-10-24: all 197 lines x 6 languages keep their {0} placeholders, bold tags and numbers, and none is left in English. No change to the app was needed. A native speaker still needs to check the wording.
- Check the live site language dropdown on a phone and a laptop.
- If the app changes, re-make the Drive parts (the joiner check code is for the 24e60472 version).
- Next step: wait for the user's screenshot and instructions for the rework of the look and the maths. Confirm understanding before building anything.

## Routine after every change
1. Edit the app. 2. Push to GitHub. 3. Deploy to Vercel. 4. Update Google Drive. 5. Republish the Claude artifact. 6. Replace the Project copy. 7. Update this file and the rules doc.

## Related files
- needs-finder-rules-and-status.md: plan facts, business rules, routine.
