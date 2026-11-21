---
title: "Building Community Event Sign-Up and Check-In Without Code: Glide Turns a Plain-Language Brief into a Sign-Up App"
date: 2026-11-12
category: product
type: guide
tags: [low-code, glide, mobile, workflow-automation]
lang: en
tldr: "Upload an Excel file of events and registrations, write a four-point brief in Chinese, and in about 1.5 minutes Glide produces a mobile app with four pages (events, sign-up, check-in, stats): remaining spots count down automatically, full events can't be selected, and ticking attendees off calculates the attendance rate. The free plan can't publish; going live starts at US$25 per month."
description: "Part 4 of the No-Code Tools in Practice series covers sign-up and attendee-list tasks. It uses the new Glide to build sign-ups, capacity limits, on-site check-in, and attendance stats for community events, and notes how the AI generated the app, where the data lives, and the limits of the free plan."
series:
  name: "No-Code Tools in Practice"
  order: 4
draft: false
---

> 🌏 [中文版](/posts/product/2026-11-12-no-code-event-signup-glide)

The usual toolkit for running events is a Google Form for sign-ups, a spreadsheet for the attendee list, and a printed sign-in sheet on the day. The form doesn't know how many spots are left, so people keep signing up after the event is full. After check-in, someone has to type the names back into the spreadsheet one by one before anyone can work out the attendance rate.

This is part 4 of the No-Code Tools in Practice series, and the task type is **sign-ups and attendee lists**. The comparison method is described in the [series intro](/posts/product/2026-11-12-no-code-tools-series-intro-en). This post builds it in [Glide](https://www.glideapps.com/). The data is simulated: 3 events and 58 registrations, with made-up names and every email at `example.com`.

## Scenario: who uses it and how the flow works

| Role | What they do |
|---|---|
| Registrant | Browse events, pick one, fill in details to sign up |
| Event lead | Check how many spots are left, run on-site check-in on the day |
| Organizer | See capacity usage and attendance rate for each event |

| Event | Capacity | Registrations |
|---|---|---|
| EV01 Book club (online) | 30 | 24 |
| EV02 Crafts workshop (Location B) | 15 | 15 (full) |
| EV03 Community mixer (Location A) | 40 | 19 |

This kind of task comes down to two things: spots have to count down in real time so nobody can sign up once an event is full, and check-in has to work on a phone, ticking people off one at a time with the numbers updating as you go.

## How I built it

### 1. Upload the Excel file and write the brief in Chinese

The new Glide (officially called GlideOS) has a home page with just one input box and "Drop a spreadsheet or build something new". I uploaded `events.xlsx` (two sheets: events and registrations) and entered a four-point brief:

1. The event list shows date, location, and remaining spots, and marks events that are full.
2. Sign-up form: remaining spots are visible when choosing an event, and full events can't be selected.
3. Check-in page: after choosing an event, list its registrants and let staff tick off who attended.
4. Stats page: capacity usage and attendance rate for each event. Use Traditional Chinese for the interface.

About 1.5 minutes later, Glide produced an app called "社群活動報名" (Community Event Sign-Up) with four tabs: 活動 (Events), 報名 (Sign up), 簽到 (Check-in), and 統計 (Stats). While it worked, the AI listed the commands it ran and the tables it created in the left panel, and at the end it suggested next steps on its own, such as sending an automatic reminder the day before an event and automatically starting a waitlist once an event fills up.

### 2. Checking each page

| Page | What's there | Test |
|---|---|---|
| Events | Three events with remaining spots (6/30, 0/15, 21/40), a red label for full events and a green label for open ones, plus search | Numbers match the source data ✅ |
| Sign up | Name, email, event picker (the dropdown shows remaining spots), ticket type | The full workshop is grayed out in the dropdown and can't be selected ✅; after submitting, it shows "報名成功" (sign-up successful) and the book club's remaining spots go from 6 to 5 ✅ |
| Check-in | After choosing an event, four cards appear (checked in, registrations, capacity, attendance rate), and each name on the list has a circle to tick | Ticked 3 people for the book club: checked in 3, attendance rate 13% (3/24) ✅ |
| Stats | 3 events, 58 total registrations, overall attendance rate; capacity usage per event of 48%/100%/80% | Usage matches the source data ✅ |

The mobile preview has a bottom navigation bar, so all four tabs are within thumb reach.

### 3. Where the data lives

The uploaded Excel file is **copied** into Glide's built-in tables, Events and Registrations, and the column names are changed to English (`event_date`, `capacity`, and so on). Sign-ups and check-ins made in the app after that are written only to Glide's tables. They are **not written back to the original Excel file**.

Connect, in the top right, can generate a read-only or read-write connection so external tools can read this data. If your team is used to looking at the list in a spreadsheet, you'll need to handle syncing separately, or start from Google Sheets instead (according to the official docs, apps connected to Google Sheets are limited to 25,000 rows, and sync is only available on paid plans; see the [integration page](https://www.glideapps.com/data-sources/google-sheets)).

## Where I got stuck

| Issue | Impact | Workaround |
|---|---|---|
| On the free plan, clicking Publish shows "Upgrade to publish" | You can only preview in the editor; registrants never get a link | Upgrade for real use |
| The Excel file is imported once and never written back | The spreadsheet and the app drift apart | Start from Google Sheets, or use Connect so external tools can read the data |
| Column names are changed to English | When editing the tables later, you have to map Chinese and English column names | Rename the columns back to Chinese on the data page |
| Automatic reminders and the waitlist weren't built | The AI suggested them, but I didn't implement them | A next step could be asking the AI to add them, in Chinese |

I didn't hit any case where the AI misunderstood the brief. All four points were implemented, down to details like "full events can't be selected".

## Cost

The plan table that pops up when you click Publish (as shown in the interface on 2026-11-12; flat monthly prices, not per user):

| Plan | Per month | Highlights |
|---|---|---|
| Free | Free | Build and preview apps, but can't publish |
| Basic | US$25 | 100 credits, 2 published apps, 10 projects, 1 workflow |
| Plus | US$50 | 250 credits, can publish public apps, 5 apps, 5 workflows, version history |
| Pro | US$125 | 500 credits, 5 members, unlimited apps and workflows, daily backups |

See the [Glide pricing page](https://www.glideapps.com/pricing) for current prices. A sign-up form that anyone can fill in needs a "public app", which starts at the Plus plan. For a community that runs a dozen or so events a year, US$50 a month has to be weighed against sticking with Google Forms and paper sign-in sheets.

## Public case study

A Glide [customer story](https://www.glideapps.com/customers/tedx-lisboa) describes how TEDxLisboa, run entirely by volunteers, used Glide to build an event app. Attendees installed it by scanning a QR code at check-in, and it included the agenda, speaker bios, a venue map, and a way to message volunteers directly. Glide says 620 attendees logged in and the app took about 3 days to build. This is a vendor-written case study, and the figures are self-reported.

That case is an "information app for attendees", while this post covers "sign-up and check-in". They are the before and after of the same event.

## Who it's for

- **Glide**: communities or small organizations that want a mobile sign-up and check-in tool quickly and are willing to pay monthly to publish it. It got from brief to usable version faster than any other tool in this series.
- **Not a fit**: teams whose data has to stay in their own spreadsheet, or who don't plan to pay; on the free plan only you can preview the app.
- Against the series' three principles: "let the system calculate first" is done well, with remaining spots and attendance rates calculated automatically. "Give the conclusion first" is only half done: the stats page has numbers, but no prompts like "which event has low attendance".

## References

- [Glide](https://www.glideapps.com/)
- [Glide Pricing](https://www.glideapps.com/pricing)
- [Glide Google Sheets Integration](https://www.glideapps.com/data-sources/google-sheets)
- [TEDxLisboa Customer Story - Glide](https://www.glideapps.com/customers/tedx-lisboa)
- [How to build a custom event attendee app using no-code - Glide Blog](https://www.glideapps.com/blog/event-attendee-app)
- [No-Code Tools in Practice: Series Intro](/posts/product/2026-11-12-no-code-tools-series-intro-en)
- [Building an Equipment Repair Request and Approval Flow Without Code (Part 3 of this series)](/posts/product/2026-11-12-no-code-approval-airtable-power-apps-en)
