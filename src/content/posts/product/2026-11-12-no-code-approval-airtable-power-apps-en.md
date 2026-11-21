---
title: "Building an Equipment Repair Request and Approval Flow Without Code: Airtable Interfaces, an Approve Button, and How Power Apps Compares"
date: 2026-11-12
category: product
type: guide
tags: [low-code, airtable, power-apps, workflow-automation, analytics]
lang: en
tldr: "Equipment repair dispatch in Airtable: paste a table to import it, describe a formula in plain language and get a correct one, then approve requests from a Kanban board with an Approve button. Conditional button visibility requires the Business plan. Power Apps needs a work or school account, so this post compares it using official docs and case studies."
description: "Part 3 of the No-Code Tools in Practice series covers request-and-approval tasks. Using equipment repairs as the example, it builds Airtable tables, linked fields, an AI-generated formula, an Interface Kanban board, and an Approve button, notes where the free plan falls short, and compares the approval approach in Power Apps."
series:
  name: "No-Code Tools in Practice"
  order: 3
draft: false
---

> 🌏 [中文版](/posts/product/2026-11-12-no-code-approval-airtable-power-apps)

Reporting broken equipment is a process every organization with physical locations runs into: the fridge at a store, the air conditioner at a school, the printer at the office. A common approach is to message a manager on LINE, the manager calls a vendor, and a few days later nobody remembers whether it got fixed.

This is part 3 of the No-Code Tools in Practice series, and the task type is **request and approval**. The comparison method is described in the [series intro](/posts/product/2026-11-12-no-code-tools-series-intro-en). This post builds the flow once in [Airtable](https://www.airtable.com/), then compares it with the official Power Apps approach. The data is simulated: 3 locations, 8 pieces of equipment, and 24 repair requests.

## Scenario: who uses it and how the flow works

| Role | What they do |
|---|---|
| Requester (location staff) | Submit a repair request: which equipment, what the problem is, how urgent |
| Manager | Review pending requests and approve or reject them |
| Repair vendor | Update repair progress |
| Headquarters | See which equipment types break most often and how long repairs take on average |

```text
Pending ──Approve──> Approved ──> In repair ──> Completed
   └──Reject──> Rejected
```

An approval flow is the best test of whether a tool really handles multiple roles: the same data has to show different screens and allow different actions for requesters, managers, and headquarters.

## How I built it

### 1. Tables: paste to import

Two tables: **Equipment** (equipment ID, name, category, location) and **Repair requests** (request number, equipment, problem description, priority, status, requester, request date, approval date, completed date, repair vendor).

"Paste data" in Airtable's left panel lets you paste spreadsheet content directly. The import detects field types automatically: category, location, status, and priority become single-select fields, and date columns become date fields. This step needs no manual setup.

### 2. Linked field: connecting equipment ID to the equipment table

Change the repair request's "equipment ID" field to **Link to another record**, point it at the Equipment table, and turn off "Allow linking to multiple records" (each request maps to one piece of equipment). After the conversion, Airtable asks whether you want to add **Lookup** fields. Check equipment name, category, and location, and the repair request shows those details automatically.

This is the same idea as the Ref column in the [AppSheet post](/posts/product/2026-11-12-no-code-food-waste-appsheet-looker-en), but Airtable goes one step further and prompts you to add the Lookup fields.

### 3. Generating a "repair days" formula with AI

When adding a formula field, there is a "Create formula with AI" option. I typed, in Chinese, "calculate the number of days from the request date to the completed date, and leave it blank if not yet completed." It produced:

```text
IF({狀態} = "已完成", DATETIME_DIFF({完成日期}, {申請日期}, 'days'), BLANK())
```

Field names in the formula: 狀態 = status, 完成日期 = completed date, 申請日期 = request date, "已完成" = completed.

The preview for the first record showed 3 days (requested 11/01, completed 11/04), which is correct. In the previous post, building a rule in AppSheet from natural language produced only an empty rule. For the same kind of feature, this one worked on the first try.

### 4. Interface: approval board and Approve button

[Interface Designer](https://www.airtable.com/platform/interface-designer) is where Airtable lets you build screens for different roles. I built an "Equipment Repair Center" with two pages:

**Approval board** (Kanban, grouped by status)

- Cards show equipment name, problem, priority, location, and request date.
- Turning on "Add records through a form" adds an "Add record" button in the top right, which requesters use to submit requests.
- Turning on "Click into record details" lets you click a card to see its full details.
- The detail page gets a button: set the action to **Update record** and set status to "Approved". After you press it, the button turns green and shows "Approved".

Test: I opened R023 (Pending) and pressed "Approve". The card moved to the "Approved" column right away, and the Pending count on the board went from 4 to 3.

The board's column order follows the order of the options in the "status" single-select field. To get Pending → Approved → In repair → Completed → Rejected, you have to drag the options in the table's field settings.

**Management overview** (Dashboard)

- Average repair days (completed requests): about 3 days.
- A bar chart of "which equipment types get reported most": refrigeration equipment leads with 9, followed by beverage equipment with 7.

The dashboard has few components and lacks the conditional formatting of Looker Studio, but it lives in the same place as the data, so you don't need to connect a separate data source.

## Where I got stuck

| Issue | Impact | Workaround |
|---|---|---|
| Conditional button visibility (show only when Pending) requires the **Business plan** | Approved requests still show the "Approve" button | On the free plan, rely on the button's "Approved" state, or use an Automation |
| The button can only set dates to a fixed value | It can't record the "approval date" automatically | Use an Automation to write the date when the status changes |
| The form lists every field | Requesters can see "status" and "approval date" | Adjust the form fields and default status to "Pending" |
| The primary field is a manually typed request number | Request numbers can collide | Switch to an Autonumber field |
| Dragging cards between columns | Dragging didn't work when I tried it through automated browser control; cause unknown | Change the status with the button or dropdown on the detail page |
| Promotions for the Team trial and AI features kept popping up when opening a new base | Distracting the first time | Close them; they don't affect the free plan |

I didn't build an Automation this time. The free plan includes 100 automation runs per month (see Cost below).

## Cost

When I clicked into paid features during the build, Airtable's upgrade dialog listed the following (as shown in the interface on 2026-11-12):

| Plan | Price | Key limits |
|---|---|---|
| Free | Free | 1,000 records per base, 1GB attachments, 100 automation runs per month, 500 AI credits per user per month |
| Business | US$45 per user per month | 125,000 records per base, 100,000 automation runs per month, 20,000 AI credits per user per month, free read-only users |

When creating a base, a separate prompt offered a 14-day free trial of the Team plan (normally US$20 per user per month). See the [Airtable pricing page](https://airtable.com/pricing) for current prices.

For 3 locations and a few dozen repair requests a month, the free plan's record limit is enough. What holds you back are workflow features like button conditions and automation run limits.

## AI features

| Feature | Status |
|---|---|
| Create formula with AI | ✅ Tested and worked; Chinese prompts are fine |
| Link field "Use AI to show top matches" | Saw the option, didn't test |
| Field agents (Analyze attachment, Generate content, Deep match, etc.) | Saw the options, didn't test; they consume AI credits |
| Omni (build apps and generate reports with AI) | Saw the entry point, didn't test |

**Analyze attachment** can analyze attachments such as photos of broken equipment. That matches the photo recognition AppSheet only offers on Enterprise Plus. The difference is that Airtable's free plan gives each user 500 AI credits per month to try it, though I didn't measure how many credits one analysis uses.

## Comparison: how Power Apps handles approvals (not tested)

The free Power Apps [Developer Plan](https://learn.microsoft.com/en-us/power-platform/developer/plan) only accepts work or school accounts managed by Microsoft Entra ID. Personal accounts can't sign up, so I didn't build this part. The following is drawn from official docs and case studies.

- **Approvals run in Power Automate**: [Power Automate approvals](https://learn.microsoft.com/en-us/power-automate/get-started-approvals) come in four types: "everyone must approve", "first to respond", and two versions with custom response options. After a requester submits, the approvers get a notification.
- **Approving in Teams**: [Approvals in Microsoft Teams](https://learn.microsoft.com/en-us/power-automate/teams/native-approvals-in-teams) lets you start and handle approvals from a chat, a channel, or the Approvals app.
- **Public case study**: A Microsoft [customer story](https://www.microsoft.com/en/customers/story/24543-oklahoma-city-fire-department-microsoft-power-platform) says the Oklahoma City Fire Department built inspections, records, and approvals into 15 Power Apps integrated with SharePoint and Teams, alongside Power BI dashboards, and cut manual work by 40%. This is a vendor-written case study, and the figures are self-reported.

The two differ in how deep the approval goes. In Airtable, approving means changing a field value. In Power Automate, an approval is a separate flow with multi-person sign-off, waiting for responses, and notifications. If a company already uses Microsoft 365 and Teams and needs multi-level sign-off, Power Apps plus Power Automate is the better fit.

## Who it's for

- **Airtable**: smaller teams with one or two approval levels that want to stand up "tables + board + dashboard" quickly. Data, screens, and charts live in one place, so it's the fastest to learn.
- **Power Apps + Power Automate**: organizations that already have Microsoft 365 and need multi-person sign-off, Teams notifications, and SharePoint integration.
- Back to the series' three principles: "let the system calculate first" worked this time (repair days, Lookup fields filled in automatically). "Give the conclusion first" was only half done: the dashboard shows numbers and charts, and people still have to read the conclusion themselves.

## References

- [Airtable](https://www.airtable.com/)
- [Airtable Interface Designer](https://www.airtable.com/platform/interface-designer)
- [Getting started with Airtable Interface Designer](https://support.airtable.com/articles/8078126534-getting-started-with-airtable-interface-designer)
- [Airtable Pricing](https://airtable.com/pricing)
- [Power Apps Developer Plan - Microsoft Learn](https://learn.microsoft.com/en-us/power-platform/developer/plan)
- [Get started with Power Automate approvals - Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/get-started-approvals)
- [Approvals in Microsoft Teams - Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/teams/native-approvals-in-teams)
- [OKCFD transforms operations with Power Apps (Microsoft customer story)](https://www.microsoft.com/en/customers/story/24543-oklahoma-city-fire-department-microsoft-power-platform)
- [No-Code Tools in Practice: Series Intro](/posts/product/2026-11-12-no-code-tools-series-intro-en)
- [Managing Store Fresh-Food Waste with No-Code Tools (Part 2 of this series)](/posts/product/2026-11-12-no-code-food-waste-appsheet-looker-en)
