---
title: "Search and Rescue Drones: The One Application Whose ROI Isn't Money — and the Easiest Budget to Cut"
date: 2026-08-07
type: deep-dive
category: product
tags: [drone, taiwan, uav, public-safety, unit-economics]
lang: en
tldr: "Agricultural spraying runs NT$150–300 per fen, computable to the decimal. Search and rescue has no such number, because a life recovered has no price. That difference determines two things: first, the specification is written by terrain rather than performance — the defining feature of Taiwan's fire agency drones is that they do NOT depend on GPS, because mountain signal drops and they must thread through trees; second, when the legislature moved to cut the budget, the ministry could only point to one man pulled from a flooded river in June. Defending a budget with an anecdote is fragile, and this application has no better weapon."
description: "Taiwan's disaster response and mountain search-and-rescue drone deployment, procurement scale, and technical specifications; why its value resists unit-economics measurement, and how being uncomputable puts it at a structural disadvantage in budget review."
draft: false
series:
  name: "Drone Teardown"
  order: 20
---

> 🌏 [中文版](/posts/product/2026-08-07-drone-sar-value)

[The agricultural spraying piece](/posts/product/2026-08-07-agri-drone-unit-economics-en) concluded that agriculture is the only drone application with computable ROI, and that being computable is both why it scaled and why its prices collapsed.

This is its counterpart. **Search and rescue sits at the other extreme — it doesn't even have a denominator.**

The consequences of that are more concrete than you'd expect.

## No substitute price means no ROI

Agricultural spraying computes because it has a publicly priced substitute: manual spraying at roughly NT$200 per fen. You simply compare.

Rescue has nothing equivalent. **The cost of "not sending a drone" isn't a sum of money, it's a set of uncertain outcomes**: the search team spends a few more hours, rescuers make a few more exposed approaches, or the person isn't found. None of those has a market price, and the third cannot be converted into units of the first two.

So this application permanently occupies an awkward position: **the effect is obvious and the number doesn't exist.**

And things without numbers are weak in budget review. That isn't hypothetical — it happened in July 2026.

## Deployment: less money than you'd think

Start with scale. This is the smallest pot of money in the entire series.

The **National Fire Agency** runs an "AI intelligent search and rescue dispatch system" mid-term program building a "drone search and rescue imagery management platform." Per [a June 2025 Ministry of the Interior briefing](https://www.cna.com.tw/news/ahel/202506260327.aspx), it expected to complete procurement of **44** complex-terrain drones by the end of 2025 and the full system by the end of 2026. The [second-phase procurement for portable complex-terrain drones](https://pcc.mlwmlw.org/tender/%E5%85%A7%E6%94%BF%E9%83%A8%E6%B6%88%E9%98%B2%E7%BD%B2/H113-016-02) was tendered at **NT$18,425,000** (awarded May 2025).

On the **National Police Agency** side, the same briefing notes that Taipei, New Taipei, Taoyuan, Taichung, Tainan, Kaohsiung, Keelung, and Yunlin — **8 municipal and county police departments — have established drone units**.

**The Ministry of the Interior overall** sought **NT$620 million over 3 years** under the uncrewed vehicle industry development program, for **636** drones and associated services across disaster response and territorial monitoring, public order, and operator training; the 2026 allocation was **NT$185 million for a planned 327 aircraft**.

Set against other pieces in this series, the gap is stark:

| Contract | Amount |
|---|---|
| Army's 26 fixed counter-drone systems ([terminated in full](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en)) | NT$987.81 million |
| NPA's 50 counter-drone systems for critical infrastructure ([graded award](/posts/career/2026-08-06-drone-market-entry-mechanics-en)) | NT$3.67 billion (total budget) |
| **MOI's three years: disaster + public order + training** | **NT$620 million** |
| **Fire agency's 44 complex-terrain drones (phase 2)** | **NT$18.4 million** |

**The application with the broadest public support receives the least money.** That isn't anyone's fault; it is the direct consequence of having no ROI to state. Counter-drone systems can be argued as "protecting N critical facilities." Rescue can only be argued as "might save someone."

## Terrain writes the specification, not performance

This is the technically most interesting part, and it locks directly onto [the spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en).

Per [TVBS in February 2026](https://news.tvbs.com.tw/local/3131121), fire agency senior inspector Ma Wu-hsiung described these portable complex-terrain drones this way:

> The defining feature of this drone is that it carries an NVIDIA chip, so it can compute and fly visually, **without depending on GPS**. In mountain search and rescue, terrain is complex and GPS signal may drop out, and inside a forest it must thread between obstacles, so omnidirectional automatic obstacle avoidance is required, and imagery can be relayed live to the 119 command centre.

**Notice that the logic of this specification runs backwards.**

An ordinary spec sheet competes on endurance in minutes, transmission range in kilometres, camera resolution in megapixels. The core specification here is **the absence of a capability** — no GPS dependence. The reason isn't technical showmanship, it's that **mountain signal drops**. Omnidirectional avoidance isn't a bonus feature either; it's that **you must thread through trees**.

[The spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) quoted the Drone Cybersecurity Testing Specification defining a product series by "flight control, communications, and satellite positioning modules." Mountain rescue hands those three modules a hard exam: **the satellite positioning cell may be empty in this environment, and flight control has to carry it alone.** Which is precisely the companion computer layer from [the software transition piece](/posts/career/2026-08-06-software-to-drone-transition-en) — visual positioning, edge inference, live relay, all of it landing on that side of the architecture.

The same report records other tested characteristics: after a night launch the controller shows a full 360-degree view; a person in the water appears immediately in thermal mode; a person on grassland is identified at once. New Taipei emergency rescue association team leader Yang Min-cheng adds that within effective range it distinguishes body shapes, tents, and color blocks, and that **AI recognition serves to assist human judgment — because "the human eye is affected by environmental factors."**

That sentence is worth keeping: **AI here is not replacing interpretation, it is extending how long interpretation stays accurate.** Searching is work that runs until human eyes lose focus.

## It fills the gap helicopters can't reach

To understand where drones sit in this system, look at what stands next to them.

Per [Ministry of the Interior statistics from May 2026](https://www.cna.com.tw/news/aipl/202605010083.aspx), the National Airborne Service Corps has flown over 120,000 missions in its 20 years and rescued 8,866 people. Over the past 5 years its five mission types totalled 3,782 sorties, of which **aerial rescue was the largest at 49.0%**, mainly maritime rescue and mountain search; aerial observation and patrol was 19.9% and medical transport 14.6%. As of March 2026 it operated 14 Black Hawks, 9 Dauphins, and 1 fixed-wing aircraft.

And the corps' own description of the Black Hawk contains a key limitation: its strengths are high-altitude and maritime work, **but its large airframe and strong downwash make it unsuitable for operating and landing in confined areas.**

That is exactly the gap drones fill. **They are not a helicopter substitute; they are the forward element for places helicopters cannot reach.** And the direction runs the opposite way from what people assume — not sending a drone to save a helicopter sortie, but **sending a drone to decide whether to launch the helicopter, and where.**

Which explains why the fire agency program's centre of gravity isn't the aircraft but the "**drone search and rescue imagery management platform**" and the AI dispatch system. **The value of this application lives in dispatch decisions, not in flying.** In [the industry map's](/posts/tech/2026-08-06-drone-industry-map-en) framework it is natively a Layer 5 problem — data and services — that happens to be procured under a Layer 4 line item.

## And then the budget was targeted

In July 2026 the Kuomintang legislative caucus moved for the Executive Yuan to suspend the uncrewed vehicle industry development program and cut the year's related budget.

[The Ministry of the Interior's response](https://www.cna.com.tw/news/aipl/202607210388.aspx) rested almost entirely on one case:

> Take the site supervisor swept away when the Mataian River flooded in Hualien this June — it was a drone carrying a thermal imager and AI human-form recognition, launched to search, that got to him in time.

The argument that followed: halting the program abruptly would disrupt planned deployment and professional training, and could **force front-line personnel to carry out missions at higher risk.**

**That defense is fragile, and it has no better option.**

Why fragile: if the reason is "we saved someone this June," what about a year with no such case? An anecdote proves the thing has been used; it cannot prove it is worth the amount. Any argument sustaining a recurring budget on a single success will be disarmed in the first year without one.

Why there's no better option: **the benefits of this application are fundamentally not additive.** You cannot say "this NT$620 million is expected to save N lives" — that N is not computable, and even if it were, converting lives into money is politically unavailable. The ministry's second argument (reducing front-line risk exposure) is actually sturdier than the first, but it has no number either.

Against agriculture: an operator can compute "NT$1.3 million of equipment, NT$6,000 a day, payback in N years." Rescue can compute none of the corresponding lines. **The two applications have exactly inverted difficulties — spraying was competed down because it is too computable; rescue has no chips at the budget table because it isn't computable at all.**

## Three judgments

1. **This is the one application where the evaluation logic has to be swapped out.** Don't ask for ROI; ask three verifiable things instead. Did it enter somewhere a helicopter couldn't? Did it shorten the decision? How many steps did it move people back from the dangerous site? All three have concrete evidence; none has a dollar figure.
2. **The specification was written by the terrain.** "No GPS dependence," "omnidirectional avoidance," and "live relay to 119" are not marketing points — they are direct translations of signal dropout, threading through forest, and a command centre that has to see it simultaneously. When buying for this category, **describe the hardest real site first, then go back to the spec sheet.** Reversing that order buys machines with beautiful parameters that cannot get in.
3. **Applications without ROI need a different form of accountability.** Defending a budget with anecdotes works in good years and fails in bad ones. The workable substitute is building quantifiable intermediate measures — sorties flown, average time to locate, reduction in personnel exposure hours. The fire agency is already building the imagery management platform, which is exactly where such data would come from; **once it exists, this application will finally have an argument more durable than one news story.**

## References

**Deployment and procurement**

- [CNA — Interior Ministry advances tech-enabled enforcement and rescue; 8 city and county police departments form drone units](https://www.cna.com.tw/news/ahel/202506260327.aspx) (in Chinese; the AI dispatch mid-term program, 44-aircraft timeline, imagery management platform, the 8 police drone units)
- [Open Government Tenders — NFA portable complex-terrain drone procurement (H113-016-02)](https://pcc.mlwmlw.org/tender/%E5%85%A7%E6%94%BF%E9%83%A8%E6%B6%88%E9%98%B2%E7%BD%B2/H113-016-02) (in Chinese; phase 2 tendered at NT$18,425,000, awarded May 2025)
- [TVBS — Fire agency buys AI drones; thermal imaging pinpoints bodies for mountain rescue](https://news.tvbs.com.tw/local/3131121) (in Chinese; the NVIDIA chip, visual flight without GPS dependence, omnidirectional avoidance, thermal testing, two units per county, AI assisting human interpretation)
- [CNA — Opposition moves to cut uncrewed vehicle budget; Interior Ministry warns of higher front-line risk](https://www.cna.com.tw/news/aipl/202607210388.aspx) (in Chinese; the reduction motion, MOI's 3-year NT$620M / 636 aircraft and 2026 NT$185M / 327 aircraft, the Mataian River case)
- [Liberty Times — Drones matter for disaster response and front-line safety; Interior Ministry seeks legislative support](https://news.ltn.com.tw/news/politics/breakingnews/5513062) (in Chinese; second report on the same episode)

**The aerial rescue system**

- [CNA — Rescue accounts for half of the airborne corps' major missions over 5 years](https://www.cna.com.tw/news/aipl/202605010083.aspx) (in Chinese; 120,000+ sorties and 8,866 rescued over 20 years, 3,782 sorties and mission mix over 5 years, fleet composition)
- [National Airborne Service Corps](https://www.nasc.gov.tw/) (in Chinese; five mission definitions, the official note that the Black Hawk's size and downwash make it unsuitable for confined areas, cumulative performance statistics)

**On this site**

- [After "NT$2M a Year Flying Drones": Agricultural Spraying Has Run a Full Cycle](/posts/product/2026-08-07-agri-drone-unit-economics-en)
- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [From Software into Drones: Use the PX4 Architecture Diagram as a Job Map](/posts/career/2026-08-06-software-to-drone-transition-en)
- [The Drone Supply Chain Against a Four-Criteria Framework: Only One of Four Holds](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en)
- [Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You](/posts/career/2026-08-06-drone-market-entry-mechanics-en)
