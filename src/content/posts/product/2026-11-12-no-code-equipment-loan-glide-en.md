---
title: "Building Equipment Checkout and Return Without Code: Glide Generates Barcode Checkout and an Overdue List"
date: 2026-11-12
category: product
type: guide
tags: [low-code, glide, mobile, workflow-automation]
lang: en
tldr: "Starting from an Excel file of equipment and loan records, I asked Glide in plain Chinese for an equipment checkout app: entering a barcode pulls up the item, checkouts and returns update the status automatically, and the admin page lists overdue items. The overdue count matches the actual data. There is a \"camera scan\" button, but I only previewed on a computer and didn't test it on a phone."
description: "Part 5 of the No-Code Tools in Practice series covers inventory and asset tracking tasks. It uses Glide to build equipment checkout: barcode checkout and return, automatic status updates, an overdue list, and available counts by category, and notes how the AI ran its own tests and what to watch out for."
series:
  name: "No-Code Tools in Practice"
  order: 5
draft: false
---

> 🌏 [中文版](/posts/product/2026-11-12-no-code-equipment-loan-glide)

A club's projector, a school's laptops, a company's cameras: once they're lent out, people often forget who has them and when they're due back. A paper loan log is only as good as whoever remembered to fill it in, and finding out "what's overdue right now" means flipping through it page by page.

This is part 5 of the No-Code Tools in Practice series, and the task type is **inventory and asset tracking**. The comparison method is described in the [series intro](/posts/product/2026-11-12-no-code-tools-series-intro-en). The previous post used [Glide](https://www.glideapps.com/) for [event sign-ups](/posts/product/2026-11-12-no-code-event-signup-glide-en). This one uses the same tool for a different task to see how it handles "scan, update status, find what's overdue". The data is simulated: 12 pieces of equipment and 20 loan records.

## Scenario: who uses it and how the flow works

| Role | What they do |
|---|---|
| Borrower | Borrow and return equipment |
| Equipment admin | Log checkouts and returns, chase people with overdue items |
| Person in charge | See how many items in each category are available |

```text
Available ──Check out (scan, enter borrower and due date)──> On loan ──Return (scan)──> Available
                                                               └── Past due date ──> Overdue
```

Taking 2026-11-12 as today, the data has 6 items on loan, 5 of which are past their due date. That number is the baseline for checking whether the app calculates correctly.

## How I built it

### 1. Writing the brief in Chinese

I uploaded `equipment.xlsx` (12 pieces of equipment with barcode, category, and storage location; 20 loan records) and entered a four-point brief:

1. The equipment list shows status (available / on loan) and storage location.
2. Checkout: scan the equipment barcode with a phone, or pick it manually; enter the borrower and due date, and the item automatically changes to on loan.
3. Return: scan or pick from a list, and the status goes back to available.
4. An admin page lists items that are overdue and not yet returned, plus available counts by category. Treat 2026-11-12 as today, and use Traditional Chinese for the interface.

Glide produced an app called "器材借用" (Equipment Checkout) with four tabs: 器材 (Equipment), 借出 (Check out), 歸還 (Return), and 管理 (Admin).

### 2. Checking each page

| Page | What's there | Test |
|---|---|---|
| Equipment | Search (name, ID, barcode), filters for status and category; items on loan show the borrower and due date | Status matches the source data ✅ |
| Check out | A barcode input box with "確認" (confirm) and a "相機掃描" (camera scan) button; available equipment is listed below and fills in with one tap; borrowers can be picked from a list of frequent names | Checked out the DSLR camera, due 11/19 → "借出完成" (checkout complete), and the available list went from 6 to 5 ✅ |
| Return | Barcode input, camera scan, a list of items on loan, with overdue due dates marked in red | Entered a barcode → it showed the borrower, checkout date, and due date → pressed return → "已歸還，已改為可借" (returned, now available), and on-loan items went from 7 to 6 ✅ |
| Admin | Four cards: overdue, available equipment, total equipment, and today's date; the overdue list shows "逾期 N 天" (N days overdue); available counts by category | 5 overdue items, as expected ✅ |

### 3. The AI ran its own round of tests

What was different from the previous post: after building the app, Glide's AI ran 31 commands of its own for an end-to-end test, including checking out an item, trying to check out the same item again (which was blocked), returning it, and finally deleting the test record.

Its report was also candid. It said it "hasn't tested barcode scanning with a real phone camera yet" and asked me to try a scan myself, and that "today" was fixed at 2026-11-12 for now, so I should tell it when to switch to the real date.

## Where I got stuck

| Issue | Impact | Workaround |
|---|---|---|
| Camera scanning wasn't tested | I only previewed on a computer, so I can't say how fast or accurately a phone camera reads barcodes | Before real use, scan a few barcode labels with a phone |
| "Today" is hard-coded as 2026-11-12 | After that date, overdue calculations will be wrong | Ask the AI to switch to the system date (it suggested this itself) |
| Tapping a card in the return page's list does nothing | Returns only work by entering or scanning a barcode | Ask the AI to make the cards tappable, or stick with the scan flow |
| The preview reloads while the app is still being changed | I got sent back to the home page partway through | Wait for the AI's progress in the left panel to finish before testing |
| A new conversation was put into the previous post's project | One project ended up with two apps and four tables | Start a new project for each app with a different purpose |
| The free plan can't publish | The admin doesn't get a version they can use on a phone | At least the Basic plan (US$25 per month, can publish to a team) |

## Cost

The plans are the same as in the [previous post](/posts/product/2026-11-12-no-code-event-signup-glide-en) (as shown in the interface on 2026-11-12; flat monthly prices): Basic US$25, Plus US$50, Pro US$125. See the [Glide pricing page](https://www.glideapps.com/pricing) for current prices.

Equipment checkout is only for internal staff, so it doesn't need a public app, and Basic's "personal and team apps" are enough. US$25 a month for a loan log that doesn't miss entries and shows what's overdue at any time isn't expensive for a group that lends out equipment often.

## Public case study

A Glide [customer story](https://www.glideapps.com/customers/shelf-engine) describes how Shelf Engine, which does order forecasting for grocery stores, used Glide and Google Sheets to build an internal app for its 25-person field sales team to record store inventory. The app also served as a check-in tool for store visits and a route map. Glide says it saves about US$50,000 a year in labor and software costs. This is a vendor-written case study, and the figures are self-reported.

Shelf Engine tracks products on store shelves and this post tracks equipment, but the structure is the same: an items table, a transactions table, and a screen for updating them on a phone in the field.

## Who it's for

- **Glide**: teams with anywhere from dozens to a few hundred pieces of equipment, frequent loans, and a need to log them on a phone on the spot, such as clubs, university departments, and photography or event companies.
- **Check these first**: whether phone scanning can read your barcode labels, and whether the data needs to end up back in a spreadsheet (Glide doesn't write back to Excel after import; see the [previous post](/posts/product/2026-11-12-no-code-event-signup-glide-en)).
- Against the series' three principles: "let the system calculate first" is done, with days overdue and available counts calculated automatically. "Give the conclusion first" is partly done too: the first thing on the admin page is "5 items overdue" and the list of names, so you know who to chase.

## References

- [Glide](https://www.glideapps.com/)
- [Glide Pricing](https://www.glideapps.com/pricing)
- [Build Equipment Tracking Software With AI - Glide](https://www.glideapps.com/use-cases/inventory-management/equipment-tracking-software)
- [Shelf Engine Customer Story - Glide](https://www.glideapps.com/customers/shelf-engine)
- [No-Code Tools in Practice: Series Intro](/posts/product/2026-11-12-no-code-tools-series-intro-en)
- [Building Community Event Sign-Up and Check-In Without Code (Part 4 of this series)](/posts/product/2026-11-12-no-code-event-signup-glide-en)
