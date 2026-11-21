---
title: "Managing Convenience-Store Food Waste Without Code: AppSheet, Google Sheets, Looker Studio, and Shrinkage Rate"
date: 2026-11-12
category: product
type: guide
tags: [low-code, appsheet, looker-studio, google-sheets, retail, analytics]
lang: en
tldr: "Google Sheets as the database, AppSheet as the store-staff app, Looker Studio as the HQ dashboard. Food-waste logging turns from typing into confirming, and stores with a shrinkage rate above 10% are flagged red automatically."
description: "Using convenience-store fresh-food waste as the example: how AppSheet, Google Sheets, and Looker Studio split the work, the column and formula setup, the insights and actions the dashboard surfaces, and where AI fits in."
series:
  name: "No-Code Tools in Practice"
  order: 2
glossary:
  - term: "Slice"
    definition: "A filtered subset of a table in AppSheet, similar to a spreadsheet filter, which can serve as the data source for a view."
    context: "This post uses one to list only the waste items that haven't been confirmed yet."
    links:
      - label: "Slices: The Essentials - AppSheet Help"
        url: "https://support.google.com/appsheet/answer/10106592?hl=en"
  - term: "Shrinkage rate"
    definition: "(Expected waste − actual waste) ÷ expected waste. The system calculates how many items should be left; if the shelf has fewer, the gap is shrinkage."
    context: "This post uses it to tell over-ordering apart from missing stock."
draft: false
---

> 🌏 [中文版](/posts/product/2026-11-12-no-code-food-waste-appsheet-looker)

Convenience stores pull fresh food off the shelf when it expires unsold. Many stores still report this waste on paper or over LINE, and headquarters gets a summary at the end of the month. This post builds a small system out of three Google tools: store staff confirm waste in a phone app, the data lands in a spreadsheet, and HQ opens a dashboard that shows which store to investigate and which items to order less of.

No code is involved, and it takes about half a day. The data is simulated; the point is the approach and the judgment calls, not the numbers. This is part 2 of the "No-Code Tools in Practice" series; the tools and comparison dimensions are laid out in the [series introduction](/posts/product/2026-11-12-no-code-tools-series-intro-en).

## What each tool does

| Tool | Role | Used by |
|---|---|---|
| [Google Sheets](https://workspace.google.com/products/sheets/) | Database that stores every record | Nobody needs to touch it directly |
| [AppSheet](https://about.appsheet.com/) | Reads the sheet and turns it into a phone app | Store staff, store managers |
| [Looker Studio](https://lookerstudio.google.com/) | Builds a dashboard from the same sheet | HQ, area managers |

```text
Staff phone (AppSheet) ──writes──> Google Sheets ──reads──> HQ dashboard (Looker Studio)
```

All three read and write the same data. No exports, no emailed Excel files. Looker Studio's interface now shows a new name, and Google's [help pages](https://support.google.com/looker-studio/answer/6299685?hl=en) are titled Data Studio; it is the same product.

## What the first version got wrong

My first build was a "sales log": staff add a row, pick the store, product, and quantity, and the app calculates revenue. Only after finishing it did I see the problem: **the POS already records every sale at checkout**. Asking staff to type it again just adds work.

The principle I took from this:

- Data the POS or ERP already has goes straight into the dashboard. Stores don't re-enter it.
- AppSheet is for processes the systems don't capture and that still run on paper or LINE: waste, equipment repairs, store audits, fridge temperature logs.

## Waste logging is confirming, not typing

The next question: if expired, unsold food has to be thrown out, can't the system calculate it on its own?

What it can calculate is the **expected** number:

```text
expected waste = units received − units sold at the POS
```

The **actual** count on the shelf often doesn't match. Theft, items damaged and pulled early, staff eating stock: all of these make the actual count lower than expected. That gap is shrinkage, and it is what loss management is really after.

So the flow became confirmation-based:

| Fields | Handled by |
|---|---|
| Product name, unit price, expected waste, expiry time, store | Pre-filled by the system |
| Actual waste count, reason, photo | Confirmed by staff; if the count matches, just save |
| Shortage, waste value, status, confirmed by, confirmed at | Calculated automatically |

Staff do two or three things per item. The photo is audit evidence, so nobody can confirm without actually counting.

## Google Sheets: two tables

**Product master** (simulating a POS export): barcode, product name, category, unit price.

**Waste log**: waste ID, expiry time, store, barcode, product name, expected waste, actual waste, shortage, waste value, status, reason, photo, confirmed by, confirmed at.

One rule to follow: the first row holds column names, one row per record, no merged cells. I simulated 5 stores and 96 records, 10 of them "pending" for today.

## AppSheet: turning the sheet into a staff app

In the spreadsheet, choose Extensions → AppSheet → Create an app, and AppSheet generates an app from the columns. Everything after that happens under Data and Views in the editor:

| Setting | How | Effect |
|---|---|---|
| Barcode as **Ref** | References the product master ([References between tables](https://support.google.com/appsheet/answer/10106510?hl=en)) | Like VLOOKUP: the barcode looks up name and price |
| Barcode marked **Scannable** | Column properties → Other Properties | A scan icon appears and the phone camera reads barcodes ([barcode scanner](https://support.google.com/appsheet/answer/10106618?hl=en)) |
| Product master **Read-Only** | Chosen when adding the table | Staff can't edit master data |
| Photo as **Image** | Column type | Becomes a camera button |
| **App formulas** | See below | Staff don't fill these in |
| **Slice** "pending waste" | Condition `ISBLANK([實際報廢數量])` | Lists only unconfirmed items |
| **View** "today's pending" | Data source set to the slice | Staff open the app to a to-do list |
| **Format rule** | Condition `[短少數量] > 0`, red text | Records with a shortage show in red |

The formulas (column names are the Chinese ones from the sheet):

```text
商品名稱 = [商品條碼].[商品名稱]                    # product name
報廢金額 = [實際報廢數量] * [商品條碼].[單價]        # waste value
短少數量 = [應報廢數量] - [實際報廢數量]            # shortage
狀態     = IF(ISBLANK([實際報廢數量]), "待確認", "已確認")  # status: pending / confirmed
確認人   = USEREMAIL()                              # confirmed by
確認時間 = NOW()                                    # confirmed at
```

I confirmed one loaf of milk bread as a staff member: tapped + to set the actual count to 1 and picked "expired unsold". Product name, a value of 29, shortage 0, confirmer, and time all filled in automatically, and the row was written back to the sheet on save.

**Small things to know**:

- Opened in a desktop browser, the app shows a two-pane layout with the list on the left and details on the right; on a phone it shows one screen at a time. For a demo, use a phone or the phone preview inside the editor so it looks like what staff actually see.
- Before the app is deployed, the owner sees a "Preview of your app" banner at the top. That is prototype mode, not a bug.
- Writing the confirmer and time with formulas has a catch: editing the same row again overwrites them. In production, write them with a button (an Action) instead.

## Looker Studio: from four charts to a dashboard people can act on

The first dashboard had a total, a bar chart, a pie chart, and a trend line. Anyone opening it asked two questions: "What period is this?" and "So what should we do?" The second version answers both:

1. **State the data period and source**: a line under the title reads "Period 11/01–11/11 (confirmed waste only, excluding today's pending) | source | refresh frequency", and a date range control in the corner defaults to the same range.
2. **Calculated field**: add `短少率 (shrinkage rate) = SUM(短少數量) / SUM(應報廢數量)` and set its type to percent ([About calculated fields](https://support.google.com/looker-studio/answer/6299685?hl=en)).
3. **Conditional formatting**: in the store ranking table, rows with a shrinkage rate above 10% turn red ([Table reference](https://docs.cloud.google.com/looker/docs/studio/table-reference)).
4. **Chart titles as questions**: "Highest-waste products (adjust orders first)" reads better than "product name × waste value".
5. **Conclusions on top**: a "key findings and actions" card sits above the KPIs, so managers read the conclusion before the detail.
6. **Colors that mean something**: one main color for regular data, one accent for conclusions, red only for anomalies.

One limitation I ran into: Looker's scorecard (KPI card) uses a single font color for both the label and the number. To get a colored number with a gray label, turn on "hide field name" and add your own label with a text box.

Also, the data source refreshes every 15 minutes by default, so a record staff just confirmed won't appear on the dashboard right away.

## The insights and actions the dashboard surfaces

Two stores can both have "a lot of waste" and need completely different fixes. Stores are anonymized here:

| Store | Waste value | Shrinkage rate | Reading | Action |
|---|---|---|---|---|
| Store A | 3,383 | **16.42%** | 2.5× the 6.46% average: stock is going missing | Area manager reviews stock counts and confirmation times; target below 8% within 4 weeks |
| Store B | **3,813** (highest) | 2.41% | Almost no shrinkage: it is over-ordering | Cut orders for the top 3 wasted items by 10–20% and track out-of-stocks |
| Store C | 2,848 | 0% | Zero shrinkage is itself suspicious | Spot-check whether items are actually counted; require photos |

Three more findings:

- **Expired-unsold makes up about 80% of waste value**: the root cause is a mismatch between orders and demand. Short term, discount items 3 hours before expiry; medium term, bring in demand forecasting.
- **Boxed meals have the highest waste value**: one boxed meal costs about as much as three rice balls, so adjusting orders for high-price items pays off first.
- **What the dashboard can't show**: bigger stores naturally waste more, so a fair comparison needs waste value ÷ goods received. Watching waste alone pushes managers to under-order and run out of stock, so waste rate and out-of-stock rate need to be watched together.

## Where AI fits

Starting from "which step does AI go into, and whose pain does it solve" is more useful than starting from "which AI features exist":

| Step | Pain point | How AI helps | Feasibility |
|---|---|---|---|
| Ordering | Relies on the manager's gut | Forecast orders from weekday, weather, local events | Needs a data team; hardest, biggest payoff |
| Near-expiry | Noticed too late | Predict unsold units and push discount suggestions early | Write forecasts to the sheet, notify via AppSheet |
| Waste logging | Typing, picking reasons | Recognize item and count from a photo | Needs a paid plan, see below |
| Audits | Fake waste is hard to spot | Shrinkage anomaly detection | Rules first, a model later |
| HQ analysis | Reading charts and writing weekly reports | Auto-generate the "key findings" summary | The current card is hand-written, so this is the natural next step |

The first two steps mean **less** waste, the third makes logging **faster**, the last two make management **more accurate**.

Photo recognition uses AppSheet's AI Tasks (Extract and Categorize). The official help page says they are [available to AppSheet Enterprise Plus accounts only](https://support.google.com/appsheet/answer/16045284?hl=en), and they became [generally available in July 2025](https://workspaceupdates.googleblog.com/2025/07/appsheet-extract-and-categorize-with-gemini-generally-available.html). Taking photos as evidence costs nothing. Without upgrading, there are two options: use barcode scanning instead of recognition, or save photos to Drive and have Apps Script call the Gemini API and write the results back to the sheet.

I also tried AppSheet's natural-language rule builder. I typed "show waste records with a shortage above 0 in red text" (in Chinese), and it created an empty rule; I ended up writing the condition by hand.

AppSheet's own pricing: prototypes are free, with up to 10 invited test users; production use needs a license, and the [official pricing page](https://about.appsheet.com/pricing/) says some Google Workspace subscriptions include AppSheet Core.

## Showing the demo to a manager or team

Tell it as a story rather than a feature tour. About 6–8 minutes:

1. **The pain (30 seconds)**: waste is logged every day, mostly on paper, and HQ can't tell waste from theft.
2. **Staff side (2 minutes)**: open "today's pending", deliberately enter one fewer than expected, pick a reason, take a photo, save, and show the record turning red in the list.
3. **The sheet (20 seconds)**: the record you just saved is already there.
4. **HQ side (2 minutes)**: start with the findings card, then the KPIs and the store ranking: Store A needs a loss investigation, Store B needs smaller orders.
5. **Closing the loop (1 minute)**: back in the app, search for Store A and look at who confirmed and the photos. Spotting the problem and tracing it happen in the same set of tools.
6. **Next steps (1 minute)**: get the rules running first, then talk about demand forecasting and AI recognition.

Before the demo, prepare a confirmed record ahead of time and check that the dashboard's date range covers it, so the 15-minute refresh delay doesn't leave you looking for missing data.

## What isn't done yet

- **Automatic alerts**: emailing the store manager when a confirmation has a shortage needs AppSheet Automation, which I didn't build this time.
- **The findings card is hand-written**: it needs rewriting whenever the data changes.
- **The data is simulated**: Store A's anomaly was designed to demonstrate the reasoning.

This post covers the "on-site confirmation and reporting" task type. Upcoming posts move on to requests and approvals, sign-ups and rosters, inventory and assets, and inspections and audits, testing Power Apps, Glide, and Airtable on the same dimensions; the list is in the [series introduction](/posts/product/2026-11-12-no-code-tools-series-intro-en).

## References

- [AppSheet official site](https://about.appsheet.com/)
- [AppSheet Pricing](https://about.appsheet.com/pricing/)
- [References between tables - AppSheet Help](https://support.google.com/appsheet/answer/10106510?hl=en)
- [Slices: The Essentials - AppSheet Help](https://support.google.com/appsheet/answer/10106592?hl=en)
- [Use a barcode scanner - AppSheet Help](https://support.google.com/appsheet/answer/10106618?hl=en)
- [Configure column properties - AppSheet Help](https://support.google.com/appsheet/answer/10106509?hl=en)
- [Overview of AI in automations - AppSheet Help](https://support.google.com/appsheet/answer/16045284?hl=en)
- [Extract and categorize data in AppSheet with Gemini (GA announcement)](https://workspaceupdates.googleblog.com/2025/07/appsheet-extract-and-categorize-with-gemini-generally-available.html)
- [About calculated fields - Looker Studio / Data Studio Help](https://support.google.com/looker-studio/answer/6299685?hl=en)
- [Table reference - Data Studio](https://docs.cloud.google.com/looker/docs/studio/table-reference)
- [Looker Studio](https://lookerstudio.google.com/)
- [Google Sheets](https://workspace.google.com/products/sheets/)
- [No-Code Tools in Practice: series introduction](/posts/product/2026-11-12-no-code-tools-series-intro-en)
