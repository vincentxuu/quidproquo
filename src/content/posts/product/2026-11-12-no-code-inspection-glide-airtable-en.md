---
title: "Building Store Equipment Inspections Without Code: The Same Brief Given to Glide and Airtable Omni"
date: 2026-11-12
category: product
type: guide
tags: [low-code, glide, airtable, mobile, workflow-automation]
lang: en
tldr: "The same inspection data and the same brief in Chinese, given to both Glide and Airtable's Omni. Both built three pages (inspection, follow-up tracking, pass-rate overview) and got the numbers right. Airtable added summary cards and required-field validation prompts; Glide was faster and came with a ready-made mobile layout. Both also made the same mistake: two inspections on the same day were counted as one, and the root cause was in the data design."
description: "Part 6 of the No-Code Tools in Practice series covers inspection and audit tasks. Using store equipment inspections across 3 locations and 8 check items as the example, it gives Glide and Airtable Omni the same data and prompt, then compares the apps they produce, with test results, the mistake they shared, and each tool's limits."
series:
  name: "No-Code Tools in Practice"
  order: 6
draft: false
---

> 🌏 [中文版](/posts/product/2026-11-12-no-code-inspection-glide-airtable)

Every week, stores have to check refrigerator temperatures, fire extinguishers, and emergency exits. The usual approach is a paper form hanging in the back room that the manager flips through on a store visit. Paper can record a "fail", but it struggles to answer two questions: which store has been getting worse lately, and has the problem found last time been fixed?

This is part 6 of the No-Code Tools in Practice series, and the task type is **inspections and audits**. The comparison method is described in the [series intro](/posts/product/2026-11-12-no-code-tools-series-intro-en). The previous two posts both used [Glide](https://www.glideapps.com/) ([event sign-ups](/posts/product/2026-11-12-no-code-event-signup-glide-en) and [equipment loans](/posts/product/2026-11-12-no-code-equipment-loan-glide-en)), and [part 3](/posts/product/2026-11-12-no-code-approval-airtable-power-apps-en) built the interface by hand in [Airtable](https://www.airtable.com/). This post compares differently: **the same data and the same brief in Chinese** go to both Glide and Airtable's AI building tool, [Omni](https://www.airtable.com/platform/app-building), to see what each one builds.

## Scenario: who uses it and how the flow works

| Role | What they do |
|---|---|
| Inspector (store staff or manager) | Mark each item pass or fail on site; a fail needs a reason and a photo |
| Area manager | See which store has the lowest pass rate and whether it's better or worse than last time |
| Person responsible for fixes | Check the list of items needing fixes and mark them once fixed |

Simulated data: 3 locations, 8 check items (covering temperature control, fire safety, environment, and electrical), inspected once on 11/05 and once on 11/12, for 48 records in total.

| Location | 11/05 pass rate | 11/12 pass rate | Needs fixing as of 11/12 |
|---|---|---|---|
| A | 87.5% | 100% | — |
| B | 100% | 87.5% | Emergency lighting |
| C | 87.5% | 75% | Floor drain, emergency exit |

This table is the acceptance test: the overview page has to put C first and show 3 items needing fixes.

## How I built it

Both tools got exactly the same brief, word for word:

1. Inspection page: after choosing a location, list the 8 check items with their pass criteria. Mark each item pass or fail; a fail requires a note, and photos can be taken.
2. Follow-up page: list every item marked "needs fixing" (location, item, date found, inspector), and allow marking it as fixed.
3. Overview page: each location's pass rate from its most recent inspection, compared with the previous one, with the lowest-scoring location first.
4. Treat 2026-11-12 as today, and use Traditional Chinese for the interface.

### Glide: upload the Excel file and the brief, get an app in minutes

Same as the previous two posts: upload `inspection.xlsx` on the home page and paste in the brief. This time Glide started a new project on its own and produced an app called "門市設備點檢" (Store Equipment Inspection) with three tabs: 總覽 (Overview), 點檢 (Inspect), and 改善追蹤 (Follow-up).

The AI's report was clear: the preview works, but "submitting an inspection, taking photos, and marking items as fixed haven't been tested yet". It added the photo column on its own.

### Airtable: import the Excel file, then ask Omni to build the interface

Import, at the bottom left of the Airtable home page, can pick Microsoft Excel directly. After upload it previews both sheets and imports them in one go, and location, result, and fix status all automatically become single-select fields. That's less work than the paste import used in part 3.

Next, in Interfaces, I clicked "Try building with AI" and pasted the same brief into Omni's chat box. Omni wrote out its reasoning in the conversation:

- It decided that "standard dashboard elements can't calculate the comparison between the most recent and previous pass rates, and can't sort dynamically by pass rate", so it switched to a code-based [custom element](https://support.airtable.com/articles/6845086569-ai-generated-interface-elements-in-airtable).
- Before adding a "現場照片" (on-site photo) attachment field, it popped up an Approve/Deny prompt to ask me first.
- During the build it got a package version format wrong, noticed on its own, fixed it, and rebuilt.

The result was "門市設備點檢系統" (Store Equipment Inspection System) with three pages: 點檢作業 (Inspection), 點檢總覽 (Inspection Overview), and 改善追蹤 (Follow-up). The whole process took longer than Glide, by roughly a few extra minutes.

## Item-by-item test

| Test | Glide | Airtable Omni |
|---|---|---|
| Overview: C 75%, B 87.5%, A 100%, C listed first | ✅ with "比上次 ±12.5" (vs. last time ±12.5) | ✅ with "比上次 ±12.5%", and C labeled "優先改善" (fix first) |
| Overview: summary cards | Today's date, number of items needing fixes | Overall average 87.5%, 3 items needing fixes, lowest location, best location |
| Inspect: note required on fail | Choosing fail shows a required note field; the submit button stays gray until all 8 items are filled in | Choosing fail shows a red outline; submitting without a note is blocked with a prompt |
| Inspect: photos | A "拍照上傳" (take photo and upload) button | A "拍照或上傳照片" (take or upload a photo) section |
| Inspect: mark all as pass in one tap | No | Yes |
| Submit an inspection for location A (emergency lighting fails) | ✅ Items needing fixes 3→4 | ✅ Items needing fixes 3→4, with auto-numbering continuing at C049 |
| Follow-up: mark as fixed | ✅ 4→3 | ✅ 4→3, plus a "已改善記錄" (fixed items) view |
| Mobile | Built-in mobile preview in the editor | Not tested this time |

Both tools delivered everything in the brief. The differences are in the details: Airtable's overview page adds "conclusion first" cards and a "fix first" label, and its inspection page adds "mark all as pass"; Glide's interface is leaner, and the mobile preview is ready out of the box.

## Both tools made the same mistake

I submitted a second inspection for location A on 11/12 (7 items pass, 1 fails), expecting A's most recent pass rate to be 87.5%. Both overviews showed **93.8% (15/16)**: they had merged the two inspections from the same day.

The cause wasn't the AI; it was my data. The records table only has "inspection date" and no ID for "this particular inspection", so both AIs could only treat the same day as the same inspection. For real use you need an extra "inspection batch" column (for example, location plus date plus time) so the overview can tell one inspection from the next.

This is the first time in the series that two tools made the same mistake, and it shows something: AI can turn a brief into screens, but it won't necessarily tell you what's missing from your tables.

## Where I got stuck

| Issue | Tool | Workaround |
|---|---|---|
| Multiple inspections on the same day are merged | Both | Add an "inspection batch" column to the table, then ask the AI to group by batch instead |
| "Today" and the comparison dates are hard-coded | Both (Omni's plan explicitly compares 11-12 with 11-05) | Ask the AI to use the system date and find the previous inspection automatically |
| Photo capture not tested | Both | I worked on a computer; take real photos on a phone before going live |
| The free plan can't publish | Glide | Basic plan at minimum |
| The interface wasn't published | Airtable | Once published, it's only available to base collaborators (see [part 3](/posts/product/2026-11-12-no-code-approval-airtable-power-apps-en)); for external or large numbers of users, check the plans |
| Toast notifications cover the bottom navigation | Glide | Wait for them to disappear before tapping |

## Cost

- **Glide**: the free plan lets you build and preview but not publish; Basic starts at US$25 per month (as shown in the interface on 2026-11-12). See the [Glide pricing page](https://www.glideapps.com/pricing).
- **Airtable**: the free plan allows 1,000 records per base and 500 AI credits per person per month. After building the entire interface with Omni, the AI credits panel still showed 500 available, so it looks like nothing was deducted, or the deduction hadn't shown up yet. Inspection records run 24 a week, about 1,250 a year, which exceeds the free plan's 1,000-record limit; for real use you'd need to upgrade or archive old records regularly. See the [Airtable pricing page](https://airtable.com/pricing).

## Public case study

A Glide [customer story](https://www.glideapps.com/customers/champion-industries) describes how Champion Industries, which supplies and services commercial dishwashers in North Carolina, used Glide to replace handwritten factory test checklists: each machine is checked item by item against its serial number, and the results are stored so technicians can look them up later during repairs. Glide says more than 370 machines have been tested and that it saved US$120,000 compared with traditional development. This is a vendor-written case study, and the figures are self-reported.

That case is a "factory quality check", while this post covers "routine store inspections", but the structure is the same: a table of check items, a table of records for each inspection, and a screen for ticking items off one by one on site.

## Who it's for

- **Glide**: teams that want a usable mobile inspection app as fast as possible, where inspectors mostly work on phones.
- **Airtable + Omni**: teams whose inspection data also needs to connect to other tables (equipment lists, repair requests), or who want an overview page that gives the conclusion directly.
- **Whichever you pick**: think the tables through before handing them to the AI, especially how a single inspection is identified.
- Against the series' three principles: both tools manage "let the system calculate first". Airtable did "give the conclusion first" more fully this time: the overview page shows at first glance which store to deal with first.

## References

- [Glide](https://www.glideapps.com/)
- [Glide Pricing](https://www.glideapps.com/pricing)
- [Airtable](https://www.airtable.com/)
- [Airtable Omni](https://www.airtable.com/platform/app-building)
- [Using Omni AI in Airtable](https://support.airtable.com/articles/1744327578-using-omni-ai-in-airtable)
- [AI-generated interface elements in Airtable](https://support.airtable.com/articles/6845086569-ai-generated-interface-elements-in-airtable)
- [Airtable Pricing](https://airtable.com/pricing)
- [Champion Industries Customer Story - Glide](https://www.glideapps.com/customers/champion-industries)
- [No-Code Tools in Practice: Series Intro](/posts/product/2026-11-12-no-code-tools-series-intro-en)
- [Building an Equipment Repair Request and Approval Flow Without Code (Part 3 of this series)](/posts/product/2026-11-12-no-code-approval-airtable-power-apps-en)
- [Building Equipment Checkout and Return Without Code (Part 5 of this series)](/posts/product/2026-11-12-no-code-equipment-loan-glide-en)
