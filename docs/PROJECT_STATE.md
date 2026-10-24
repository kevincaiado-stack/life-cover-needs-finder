# Project State: Life Cover Needs Finder

Last updated: 2026-10-25 (plans hidden, focus on needs analysis)
Rule: this file is updated at every milestone, then copied to GitHub, Google Drive and the Claude Project.

## What it is
A single-file web app (needs-finder.html) that helps advisors work out a customer's life cover gap and goals, and suggests Canara HSBC Life Insurance plans. For internal training use only.

## Where everything lives
- Live site: https://life-cover-needs-finder.vercel.app (Vercel, deploys from GitHub main)
- GitHub: kevincaiado-stack/life-cover-needs-finder (branch main). Project notes are in the `docs/` folder.
- Google Drive: folder "Needs Finder" (full app as 14 part files + joiner page, live-link file, these notes)
- Claude Project: "Needs Calculator App" (folder `needs-finder/`: this file, rules doc, app copy)
- Claude artifact: published copy of the app (version 36)

## Current status (latest milestone)
- Milestone 8: ALL plan recommendations and plan questions are hidden (flag PLANS_ON=false in needs-finder.html). All plan details and rules stay in the code. Set PLANS_ON=true to bring them back.
- Current focus: build and harden the NEEDS ANALYSIS section first. No plan will be recommended until the user says so.
- App file: 262319 bytes, SHA-256 ec7fc9f76d1b3e26952b28812f85f164e1e8fbb10366c14caa72a1d080883bb0 (commit after 66bd1c2; see git log)
- Languages: 7 done (Milestone 7).
- Drive: the 14 part files + joiner are for the OLD version b8304b5 (not refreshed for Milestone 8). Live site and GitHub are current.

## Milestones
1. First version: needs calculator (income value, loans, savings, cover, gap).
2. Goals as tap-to-open cards: home/wealth, retirement, child education and marriage.
3. Plan recommendation rules and plan facts added (see rules doc).
4. Charts and printable/downloadable summary.
5. Plan recommendations hidden until "Show plans"; immediate-income rule for market based plans.
6. Language dropdown added.
7. All 7 languages translated, deployed everywhere. Drive full copy as parts + joiner.
8. Plan recommendations and plan questions hidden; needs analysis is the focus.

## Open items
- Native speakers should review all translations. Review sheet: docs/translation-review.csv (197 lines x 6 languages, with a Reviewer notes column). Automatic check done 2026-10-24: all 197 lines x 6 languages keep their {0} placeholders, bold tags and numbers, and none is left in English. No change to the app was needed. A native speaker still needs to check the wording.
- Check the live site language dropdown on a phone and a laptop.
- Drive parts and joiner are still for b8304b5. Re-make them at the next big milestone.
- Decide what to add to the needs analysis section (waiting for the user).

## Routine after every change
1. Edit the app. 2. Push to GitHub. 3. Deploy to Vercel. 4. Update Google Drive. 5. Republish the Claude artifact. 6. Replace the Project copy. 7. Update this file and the rules doc.

## Related files
- needs-finder-rules-and-status.md: plan facts, business rules, routine.
