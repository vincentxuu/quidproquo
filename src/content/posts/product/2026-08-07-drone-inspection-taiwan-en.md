---
title: "Inspection Is Taiwan's Furthest-Along Drone Application — Because It Routed Around BVLOS"
date: 2026-08-07
type: deep-dive
category: product
tags: [drone, taiwan, uav, inspection, unit-economics]
lang: en
tldr: "I assumed inspection was blocked by beyond-visual-line-of-sight rules the way logistics is. It isn't. Bridge, transmission tower, and high-speed rail viaduct inspection are all running with hard numbers: one bridge went from 8 inspectors, 4 vehicles and 2 days to 5 people, 1 vehicle and half a day with no traffic control at all, at 60% of conventional cost; high-speed rail crews covered at most 700 metres a day on foot and now save 3–5x; a private power plant cut headcount by three quarters and cost by half with no outage required. The reason is that all of these are segmented, fixed-point tasks completable within visual line of sight. What BVLOS actually blocks is continuous long-range routes, not 'inspection' as a category."
description: "Taiwan's deployed drone inspection of bridges, transmission towers, and rail viaducts with quantified results; why this application routes around visual-line-of-sight regulation, why safety rather than cost drives adoption, and why it is the only application that has genuinely reached Layer 5."
draft: false
---

> 🌏 [中文版](/posts/product/2026-08-07-drone-inspection-taiwan)

After [agricultural spraying](/posts/product/2026-08-07-agri-drone-unit-economics-en) and [disaster response](/posts/product/2026-08-07-drone-sar-value-en), I had planned to combine inspection, logistics, and surveying into one piece called "three applications stuck behind the same door" — because [the industry map](/posts/tech/2026-08-06-drone-industry-map-en) said inspection had "steady demand, stuck on compliance," and [the BVLOS piece](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en) established that Taiwan has no BVLOS framework at all.

**After the research that piece no longer exists.** Inspection isn't stuck in Taiwan; it is the furthest along of the three application areas, with numbers hard enough not to need any rhetoric.

Numbers first, then why it moves while logistics doesn't.

## Three sets of real numbers

**Bridges: the Highway Bureau, unveiled January 2026**

Taiwan has roughly 22,000 road bridges; the Ministry of Transportation's Highway Bureau administers about 3,348 of them. Its Central Region Maintenance Office has worked since 2019 with Li Ming Engineering Consultants, ITRI, and Delta Electronics on a "drone AI intelligent bridge inspection system," and [has now completed field inspection of 14 river-crossing and tidal-reach bridges](https://www.cna.com.tw/news/ahel/202601160313.aspx) in Miaoli, Changhua, and Nantou.

The manpower comparison is the cleanest set of numbers in this piece. Li Ming vice president Lee Kun-che:

> Conventional manual inspection required at minimum **8 inspectors and 4 vehicles over 2 days**. With drones and AI, one bridge now takes **1 vehicle, 1 drone, and 5 people, roughly half a day** — and crucially, **no traffic control at all**.

Other quantified results: the AI identifies concrete cracking, spalling, efflorescence, water seepage, steel plate and bolt corrosion, and paint peeling, at a **detection accuracy above 78%**, trained on over 20,000 images; **operating cost is about 60% of conventional bridge inspection**.

**Rail: Taiwan High Speed Rail, in development since 2017**

THSR runs 350 km, of which **252 km (73%) is bridge and elevated structure, requiring inspection every 2 years.**

Per [a briefing in late 2023](https://www.cna.com.tw/news/ahel/202312210109.aspx), project control manager Chen Wen-tse noted that inspection had always been manual, covering **at most 700 metres a day**. With drones, each sortie runs 20 to 25 minutes over a 2 to 3 km round trip, **saving 3 to 5 times the manpower and time.**

He also noted something manual work simply cannot do: **piers under riverbeds or beneath highways previously had to be examined through binoculars, sometimes without a clear view.** High-resolution drone imagery shows directly whether bearing pads have shifted or steel spans have cracked.

**Transmission towers: Taipower and Chia Hui Power**

Taiwan has nearly 20,000 transmission towers carrying over 13,000 km of line. Taipower first introduced drones in 2019; [the previous method](https://www.cna.com.tw/news/ahel/202001130289.aspx) had staff carry an infrared imager on foot to beneath the line to take temperatures, then bring the records back to the office to interpret. With a small infrared imager on a drone, nobody has to go to the site — and **the measurement angle is better**.

The private-sector numbers are more complete. Far Eastern group's Chia Hui Power announced in October 2024 [the country's first fully automated drone inspection power plant](https://www.cna.com.tw/news/afe/202410300213.aspx), combining a FarEasTone 5G private network with AI. General manager Chen Kuang-tai projected **a 75% reduction in manpower and a 50% reduction in inspection cost**, with equipment inspection compressed from 2 days to 1. The most consequential line: **inspection requires no power outage.**

## Why it moves while logistics doesn't

Now the question. The answer is far more precise than the word "compliance."

**All three of these are segmented tasks, not continuous long-range routes.**

- A bridge is a fixed point: fly to it, circle it, done
- Towers run along a line but can be flown in segments, with the operator moving along
- Each THSR sortie is a 2–3 km round trip in 20–25 minutes: one work unit, not a journey

What [the BVLOS piece](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en) documented about Taiwan's regime is that it blocks **genuine beyond-visual-line-of-sight** — the kind requiring juridical-person status, an application 15 days in advance, and a three-month permit. Segmented fixed-point inspection can be completed within visual line of sight or within observer coverage, **and never has to enter that door at all.**

Logistics has no such option. Last-mile delivery is by definition "fly from A to B while you can't see it." **The same regulatory threshold is barely an obstacle to segmentable work and a total blockade to work that cannot be segmented.**

So the industry map's "inspection is stuck on compliance" needs refining: **what's blocked is continuous long-range inspection — an entire pipeline or trunk line in one flight. Segmented fixed-point inspection isn't, and every working Taiwanese example falls in the latter category.**

That also explains why the benefit narratives are always "one bridge," "one line segment," "one sortie." It isn't conservatism — it is **cutting the work to the granularity regulation allows**, then maximizing efficiency inside that granularity.

## Safety drives adoption, not cost

The cost figures are attractive (60%, half, three quarters), but after reading all the coverage, **what actually pushed these programs through is that people die.**

The Highway Bureau report says it most directly: conventional road bridge inspection requires staff to walk the bridge shoulder on foot, and **an inspector has previously been struck and killed**. The ministry's statistic:

> From 2022 to 2025, roughly **454 incidents** of national highway work vehicles or crash cushion trucks being struck — **one every three days on average.**

One every three days. That number is more persuasive than any ROI calculation, and it explains why Lee singled out "no traffic control at all" as the crucial point — **no lane closure, no exposure to being hit.**

The tower side is the same thing in a different shape. Chia Hui's Chen described maintenance staff as working "like Spider-Man, having to climb towers and work at height," where the conventional method means **risking their lives on a de-energized line, then climbing and walking it to inspect.**

Taipower's trigger was a systemic failure: on 30 July 2017 Typhoon Nesat collapsed a transmission tower serving the Hoping power plant in Hualien, and **cumulative outages reached 580,000 households nationwide.**

Lined up, the three applications form a spectrum of value:

| Application | Can the benefit be converted to money? |
|---|---|
| [Ag spraying](/posts/product/2026-08-07-agri-drone-unit-economics-en) | Entirely (NT$150–300 per fen against NT$200 manual) |
| **Inspection** | **Half yes** (cost to 60%, headcount to a quarter) **and half no** (fewer strike incidents) |
| [Disaster response](/posts/product/2026-08-07-drone-sar-value-en) | Not at all (a life recovered has no price) |

**Inspection sits at the midpoint of that spectrum, and the midpoint is the easiest position to sell** — it has enough numbers to persuade finance and enough lives to persuade leadership. Spraying only has the first; rescue only has the second.

## It is the only application that genuinely reached Layer 5

[The industry map](/posts/tech/2026-08-06-drone-industry-map-en) put value at Layers 3 and 5, with Layer 5 being "turning flight data into a usable conclusion." Of Taiwan's three applications, **only inspection is actually doing this, and has been for years.**

- **Highway Bureau**: over 20,000 training images behind the AI degradation analysis, generating inspection reports automatically
- **THSR**: a digital imagery management system that screens large photo sets, annotates anomalies, generates inspection reports automatically, and applies automated degradation analysis to flag potential problem areas early
- **Chia Hui Power**: all imagery and data accumulating into a **maintenance history database**
- **Taipower**: a "drone management system" built in 2021 integrating operating manuals, professional licence issuance and expiry dates, and insurance details, with an **alerting function** (for instance, warning before a licence's expiry), plus records of each aircraft's sortie count and flight log alongside prohibited zone boundaries and flight application procedures

Taipower's system deserves a second look because what it manages **isn't data, it's compliance.** Section chief Hsu Yi-feng acknowledged that before it, drone records were "managed in something like Excel form, fairly scattered."

Past a certain fleet size, **licence expiry, airspace applications, and insurance status become operational risk** — which is what the compliance cost from [the market entry piece](/posts/career/2026-08-06-drone-market-entry-mechanics-en) looks like on the enterprise side. A spraying operator can skip it (and become one of the unlicensed). Taipower cannot.

**Inspection reaches Layer 5 because it repeats.** The same bridge is photographed every two years, the same tower flown several times a year; a time series forms naturally, and only then is there degradation to compare. Spraying leaves nothing behind once the pass is done; rescue is a sparse event whose sample takes many years to build.

## Two details that lock onto other pieces

**One: Taipower's fleet was replaced, and policy did the replacing.**

Per [CNA in 2021](https://www.cna.com.tw/news/afe/202108150023.aspx), Taipower supply section chief Hsu Yi-feng explained that the utility had once operated as many as **65** drones across its 6 regional supply offices; **government cybersecurity policy then ended the use of Chinese-made aircraft, and 12 US-made units were purchased instead**; in 2021 it planned to expand with **44 Taiwan-made drones**.

65 → 12 → 44. That is the industry map's "non-Chinese supply chain rebuild" in miniature at a single large user, and the cost is plain: **the fleet briefly shrank to under a fifth of its original size.**

The same theme surfaced in bridge inspection — ITRI staff emphasized at the demonstration that the aerial drones used **must be "non-red supply chain" and domestically made.**

**Two: the high-mountain tower inspection used the model that has crashed.**

In 2021 Hung Kuang University associate professor Chang Cheng-jung led a team that, [working with Taipower and engineers from AVIX Technology, flew an AVIX AXH-E230 single-rotor helicopter across the Central Mountain Range](https://www.cna.com.tw/news/aloc/202203210061.aspx), covering **46.5 km in one hour and inspecting 79 high-voltage towers**, climbing from around 800 metres to over 3,000.

The AXH-E230 is exactly the model in both TTSB investigations from [the crash anatomy piece](/posts/tech/2026-08-07-drone-crash-anatomy-en). That isn't coincidence — it is one of the few large unmanned helicopters in Taiwan capable of this class of mission. **The same aircraft appearing in both a "first of its kind" story and an accident report is itself a statement about the industry's maturity.**

And Chang's description of the method belongs to the same terrain-driven specification family as the "no GPS dependence" in [the rescue piece](/posts/product/2026-08-07-drone-sar-value-en):

> There is no wireless coverage in the high mountains and no way to monitor continuously, so the only option is **"silent flight"** — the drone navigates autonomously with the link down, then flies back once the mission is complete.

The same team also worked with ITRI's materials institute on a hydrogen fuel cell unmanned helicopter dropping medical supplies at the Xinda mountain hut — **8 hours on foot, 18 minutes by air.**

## Three judgments

1. **"Blocked by regulation" requires asking which kind of work is blocked.** Taiwan having no BVLOS framework is a fact, but what it blocks is unsegmentable long-range routing. Segmented fixed-point inspection routes around it, and already has. **When evaluating any application described as "waiting on regulation," first ask whether it can be cut into within-line-of-sight work units** — the ones that can usually aren't waiting.
2. **Safety arguments move adoption further than cost arguments.** One strike incident every three days, the "Spider-Man" tower climbers, 580,000 households without power — those are why budgets pass; cost savings ride along. Inspection's advantage is that it **has both kinds of argument**, which is exactly what spraying and rescue each half-lack.
3. **Repetition is the precondition for reaching Layer 5.** Inspection grows databases and AI models (20,000 training images, automated degradation analysis, maintenance histories) because the same object gets photographed again and again. To judge whether a drone application has a Layer 5 at all, one question suffices: **will it photograph the same thing a second time?**

## References

**Bridges and rail**

- [CNA — Highway Bureau deploys AI vehicles and drone bridge inspection to reduce inspector risk](https://www.cna.com.tw/news/ahel/202601160313.aspx) (in Chinese; 3,348 administered bridges, 14 field inspections, 78% detection accuracy, cost at 60%, 8 people/4 vehicles/2 days versus 5 people/1 vehicle/half a day, 454 highway strike incidents)
- [Liberty Times — AI drone and bridge inspection vehicle unveiled](https://news.ltn.com.tw/news/life/breakingnews/5312649) (in Chinese; same demonstration, 20,000 training images, the degradation types the AI identifies, ITRI on the non-red supply chain and domestic requirement)
- [CNA — Drone screening saves 3 to 5 times the effort on high-speed rail bridge inspection](https://www.cna.com.tw/news/ahel/202312210109.aspx) (in Chinese; 252 of 350 km on structure, biennial inspection, 700 m/day manual, 20–25 minute sorties, 4 teams of 9 total)

**Power infrastructure**

- [CNA — Taipower deploys drones to inspect transmission towers](https://www.cna.com.tw/news/ahel/202001130289.aspx) (in Chinese; ~20,000 towers and 13,000 km of line, how infrared temperature measurement changed, the 2017 Hoping tower collapse and 580,000 affected households)
- [CNA — Taipower's drone management system enters service](https://www.cna.com.tw/news/afe/202108150023.aspx) (in Chinese; the 65 → 12 US-made → 44 Taiwan-made fleet transition under cybersecurity policy, the management system's compliance alerting)
- [CNA — No more Spider-Man on the towers: Chia Hui Power launches fully automated drone inspection](https://www.cna.com.tw/news/afe/202410300213.aspx) (in Chinese; first fully automated inspection plant, 75% headcount and 50% cost reduction, no outage required, maintenance history database, 5G private network)
- [CNA — Hung Kuang University inspects high-mountain towers by drone](https://www.cna.com.tw/news/aloc/202203210061.aspx) (in Chinese; AXH-E230 across the Central Mountain Range, 46.5 km and 79 towers in one hour, "silent flight" autonomous navigation with the link down, hydrogen fuel cell medical resupply)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [BVLOS in Three Jurisdictions: Taiwan Has No Framework At All](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en)
- [After "NT$2M a Year Flying Drones": Agricultural Spraying Has Run a Full Cycle](/posts/product/2026-08-07-agri-drone-unit-economics-en)
- [Search and Rescue Drones: The One Application Whose ROI Isn't Money — and the Easiest Budget to Cut](/posts/product/2026-08-07-drone-sar-value-en)
- [Taking Apart Two TTSB Crash Reports: Neither Was the Operator's Fault](/posts/tech/2026-08-07-drone-crash-anatomy-en)
- [Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You](/posts/career/2026-08-06-drone-market-entry-mechanics-en)
