---
title: "Taiwan Already Has 24 Drone Logistics Corridors — It Didn't Take the Wait-for-Regulation Route"
date: 2026-08-07
type: deep-dive
category: product
tags: [drone, taiwan, uav, logistics, unit-economics]
lang: en
tldr: "I assumed Taiwan had no real drone logistics because it has no BVLOS framework. Wrong: the CAA has approved 10 cases across 24 flight corridors, and the Institute of Transportation has run a six-year PoC → PoS → PoB path since 2020, entering commercial validation in 2025. The way it routes around regulation is the mirror image of inspection — inspection cuts work down to within visual line of sight, logistics gets corridors approved one at a time. And its value isn't being cheaper than a boat: during the typhoon sailing suspensions at Liuqiu, a drone made the crossing in a bit over ten minutes, which is what you have when the boats don't run."
description: "Six years and three phases of Taiwan's remote-area drone logistics program, the distribution and cargo of its 24 corridors, the statutory thresholds for routine commercial operation, and why case-by-case approval works for logistics but obstructs inspection."
draft: false
---

> 🌏 [中文版](/posts/product/2026-08-07-drone-logistics-taiwan)

At the end of [the inspection piece](/posts/product/2026-08-07-drone-inspection-taiwan-en) I offered a guess: logistics was probably "no real commercial case in Taiwan, and the reason is that BVLOS door."

**Wrong again.** And this time more interestingly — because the way logistics routes around that door is the mirror image of inspection.

## The numbers first: 10 cases, 24 corridors

Per [the CAA in May 2026](https://www.cna.com.tw/news/ahel/202605260341.aspx), drone logistics in Taiwan remains at an early stage, but over recent years **the CAA has approved 10 logistics cases using a cumulative 24 drone flight corridors.**

The distribution and cargo are specific:

| Item | Detail |
|---|---|
| Locations | Mountain areas of Taoyuan and Hsinchu, urban Chiayi, Pingtung, Hualien, and the offshore island of Liuqiu |
| Cargo | Postal items, daily necessities, medical supplies |
| Next | The health ministry's remote-area drone medical delivery program is expected to expand from Hualien to selected hospitals in Hsinchu |

This isn't a concept demonstration. Behind it is a six-year policy path with explicit milestones.

## Six years, three phases, and it followed the white paper

The Ministry of Transportation's Institute of Transportation (IOT) has run the "Drone Logistics Service Project for Remote Areas" since 2020. [Per the IOT's own account](https://www.cna.com.tw/news/ahel/202509260319.aspx), it advanced in three phases:

```
PoC  Technical verification  2020–2022  Donggang–Liuqiu (Pingtung), Lalashan (Taoyuan)
                             → verify maritime crossing and mountain flight
PoS  Service verification    2023–2025  Kiwit and Dali indigenous communities, Hualien
                             → extended field operation, operational experience, reliability
PoB  Commercial validation   2025 on    With Chunghwa Post and public-private partners
                             → build a sustainable operating model, normalize the service
```

And that cadence wasn't back-fitted. [The IOT's project record](https://www.iot.gov.tw/zh_tw/about/projects/p5/-42456265) notes that the ministry's drone technology industry group set the milestone in the *2021 Transportation Technology Industry White Paper*: **complete PoC and PoS for remote and offshore areas before 2024, and PoB in 2025.** Actual progress matches that five-year-old plan.

The three application modes the project defined are worth recording, because they explain everything that follows:

- **Daily service**: **two-way** movement of daily necessities and agricultural produce for remote residents
- **Emergency support**: time-sensitive items such as medicines and medical equipment
- **Disaster response**: when a remote area is cut off by disaster, **the daily logistics drone immediately converts to relief use**

The third is the design core, which the IOT summarizes in one line: **"accumulate capacity through commercial operations during peacetime, and deploy immediately for support during disasters."**

## It routes around regulation the opposite way from inspection

Now the question.

[The inspection piece](/posts/product/2026-08-07-drone-inspection-taiwan-en) concluded that inspection routes around BVLOS by **cutting work into units completable within visual line of sight** — one bridge, one line segment, one 2-to-3 km round trip.

Logistics cannot cut that way. Delivering from A to B while you can't see it is the definition of last-mile.

So it took the other route: **one corridor at a time, approved case by case.**

Twenty-four corridors across 10 approvals — which is precisely the "one waiver at a time" model [the industry map](/posts/tech/2026-08-06-drone-industry-map-en) criticized when discussing inspection, saying it "prevents repeated fixed-route work from scaling."

**That criticism holds for inspection and fails for remote-area logistics**, and the difference is the shape of the demand:

| | Inspection | Remote logistics |
|---|---|---|
| Demand distribution | Spread across **tens of thousands** of assets (22,000 bridges, ~20,000 towers) | Concentrated on **a few fixed routes** (one strait, a few communities) |
| Effect of case-by-case approval | Every new site reruns the process → gridlock | Approve once, use indefinitely → **just enough** |

**The same regime is an obstacle to coverage-shaped demand and a viable path for route-shaped demand.** Remote logistics demand was always concentrated on a handful of lines that break when the boat doesn't sail, so 24 corridors isn't a compromise — it's close to the whole thing.

That also explains the corridor locations: mountain communities, offshore islands, remote areas — **all places where one route failing means there is no alternative.**

## Liuqiu: the value isn't being cheap, it's flying when boats don't

July 2026 at Liuqiu demonstrated this more clearly than any planning document.

The situation: [Liuqiu shipping was disrupted by Typhoon Bavi](https://news.ltn.com.tw/news/life/breakingnews/5505447), suspended from the afternoon of 9 July through the 12th and resuming only on the 13th; that same afternoon a high wind warning suspended sailings again for the next day. **Supplies on the island were running short**, and commuters were caught out.

And the commercial validation was already running there. The Pingtung county government's account: as long as wind isn't excessive, **a drone reaches the Liuqiu helipad from the Xinyuan shipping centre in a bit over ten minutes.**

But the line worth quoting is the [honest description](https://news.pts.org.tw/article/817983) from Chiang Chieh-lun, director of NPUST's uncrewed vehicle applications R&D centre:

> With current aircraft, above 10 metres per second of wind the flight risk increases, and during a typhoon it may not fly either. **But at night, when there are no sailings, if you need to move emergency supplies or medical items, a drone is genuinely useful.**

That places the value of logistics drones very precisely: **it isn't replacing the boat, it's covering the boat's gaps.**

The aircraft NPUST's team is testing carries about 4 to 5 kg and crosses from Yanpu to Liuqiu in about 20 minutes. Four or five kilograms will never beat a vessel's capacity — but during the hours or days with no vessel, it is **the only thing still moving.**

The county government's fuller framing: when swells prevent a rescue boat from sailing, in the stage before "emergency helicopter evacuation or naval transfer" becomes necessary, a drone balances the logistics team's risk, cost, and timeliness at once.

**This is a value logic different from all three previous pieces.** Lined up:

| Application | Source of value |
|---|---|
| [Ag spraying](/posts/product/2026-08-07-agri-drone-unit-economics-en) | Cheaper than manual (NT$150–300 per fen versus NT$200) |
| [Inspection](/posts/product/2026-08-07-drone-inspection-taiwan-en) | Cheaper **and** safer (60% of cost, no traffic control) |
| [Disaster response](/posts/product/2026-08-07-drone-sar-value-en) | Saves lives, no price |
| **Logistics** | **In the windows when the alternative is unavailable, it is the only thing available** |

Logistics sells marginal availability, not cost advantage. And that value exists only where the alternative is interrupted — offshore islands, mountain communities, typhoon season. Where the alternative is reliable (urban delivery), the same aircraft has almost no footing.

One detail with an image to it: Liuqiu briefly had a private airport in 1975, which closed quickly for poor economics. Fifty years later, that apron **has been reactivated as a drone logistics landing site.**

## The CAA has quantified the threshold for routine operation

From "24 approved corridors" to "routine commercial operation" is still a distance, and the CAA has put numbers on it. Per the same briefing:

**On the aircraft** — regardless of weight, type inspection of the airframe must be completed (see the inspection tiers in [the spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)). For drones **over 25 kg**, the aircraft must additionally pass **seven system reviews covering propulsion, communications, flight control, and performance, and complete 50 hours of test flight** before entering logistics service.

**On the airspace** — the CAA has defined a **standard "cargo corridor" width of 100 metres**, and advises planners to avoid airport zones and local government red zones where possible, which substantially reduces air traffic coordination costs.

Several things there are worth pausing on:

**One: 50 hours of test flight is a real cost barrier.** Against the cash structure computed in [the financials piece](/posts/investing/2026-08-07-drone-maker-financials-en) — assets paid first, revenue collected later — 50 test hours are pure outlay that must complete before any revenue exists. For a small vendor that is a substantive capital barrier.

**Two: "avoiding red zones substantially reduces coordination costs" is a genuinely useful sentence.** It tells operators that **the first variable in corridor planning is airspace class, not shortest path** — directly connected to the red/yellow/green zones in [the plain-language regulation piece](/posts/policy/2026-08-06-taiwan-drone-regulation-guide-en).

**Three: the 25 kg line appears again.** [The crash anatomy piece](/posts/tech/2026-08-07-drone-crash-anatomy-en) established that the TTSB's major occurrence threshold is "over 25 kg substantially damaged"; [the spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) established that over 25 kg requires additional physical inspection; and now logistics hangs its seven system reviews and 50 test hours on the same line. **25 kg is the single most consequential boundary in Taiwanese drone regulation, and it has now shown up once in each of four separate regimes.**

## Three judgments

1. **Rather than "is there regulation," ask whether the regime's granularity fits the demand's shape.** Taiwan has no general BVLOS rule, but 24 case-approved corridors are nearly sufficient for remote logistics, because the demand was always concentrated on a few fixed routes. The same regime obstructs inspection — the difference isn't regulatory permissiveness, it's whether demand is dispersed or concentrated.
2. **Logistics drones sell marginal availability, not cost advantage.** Four or five kilograms will never beat a vessel, but when the vessel doesn't sail it is the only option. **That means the market exists natively where the alternative gets interrupted**, not where the alternative is expensive — two things routinely conflated.
3. **From approval to routine, the threshold is computable: type inspection + seven system reviews + 50 test hours + a 100-metre corridor.** That isn't a vague "waiting on regulation," it's a list you can cost and schedule. Anyone entering this business should treat it as a project plan, not a grievance.

## References

**Policy and overall progress**

- [CNA — CAA: Taiwan has accumulated 24 drone logistics corridors](https://www.cna.com.tw/news/ahel/202605260341.aspx) (in Chinese; 10 cases across 24 corridors, locations and cargo, type inspection plus seven system reviews plus 50 test hours for routine operation, the 100-metre cargo corridor standard, expansion of remote medical delivery)
- [CNA — IOT's remote-area drone logistics enters commercial operation validation](https://www.cna.com.tw/news/ahel/202509260319.aspx) (in Chinese; PoC/PoS/PoB phases and years, the three application modes, the Chunghwa Post partnership)
- [Institute of Transportation, MOTC — Drone logistics service verification project](https://www.iot.gov.tw/zh_tw/about/projects/p5/-42456265) (in Chinese; the 2021 white paper milestones, site selection and inspection procedures)
- [Institute of Transportation, MOTC — Drone Logistics Service Project for Remote Areas](https://www.iot.gov.tw/en/more_announcement/IOT-Completes-Field-Operation-Trials-of-Drone-Logistics-Services-in-Remote-Areas-Assisting-the-MOTC-to-Become-a-Deliverer-of-Hope-and-Well-Being-98604016) (English account of the same program with phase-by-phase sites)

**Pingtung commercial validation (PoB)**

- [CNA — Pingtung drone logistics commercial validation: cross-strait and campus delivery](https://www.cna.com.tw/news/aloc/202607070216.aspx) (in Chinese; the two flagship corridors, participating institutions, May 2026 approval of the CAA drone logistics operations manual)
- [Liberty Times — Commercial drone logistics validation begins at Liuqiu and NPUST](https://news.ltn.com.tw/news/life/breakingnews/5496908) (in Chinese; the NPUST–7-Eleven corridor and the Yanpu–Liuqiu corridor with Chunghwa Post)
- [Liberty Times — Drones resupply an isolated Liuqiu: medicine and supplies tested in poor weather](https://news.ltn.com.tw/news/life/breakingnews/5505447) (in Chinese; the July 2026 typhoon suspension timeline, island supply conditions, the ten-minute crossing, positioning when rescue boats cannot sail)
- [PTS News — Remote drone logistics begins commercial testing; Liuqiu apron reactivated as a landing site](https://news.pts.org.tw/article/817983) (in Chinese; the 1975 airport closure and apron reactivation, 4–5 kg payload and 20-minute crossing, the 10 m/s wind risk explanation, two further Hualien corridors)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [BVLOS in Three Jurisdictions: Taiwan Has No Framework At All](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en)
- [Inspection Is Taiwan's Furthest-Along Drone Application — Because It Routed Around BVLOS](/posts/product/2026-08-07-drone-inspection-taiwan-en)
- [After "NT$2M a Year Flying Drones": Agricultural Spraying Has Run a Full Cycle](/posts/product/2026-08-07-agri-drone-unit-economics-en)
- [Search and Rescue Drones: The One Application Whose ROI Isn't Money — and the Easiest Budget to Cut](/posts/product/2026-08-07-drone-sar-value-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [The Filings Answered What I Assumed Needed an Interview](/posts/investing/2026-08-07-drone-maker-financials-en)
