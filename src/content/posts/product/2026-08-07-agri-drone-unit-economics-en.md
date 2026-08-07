---
title: "After \"NT$2M a Year Flying Drones\": Taiwan's Only Application With Computable ROI Has Already Run a Full Cycle"
date: 2026-08-07
type: deep-dive
category: product
tags: [drone, taiwan, uav, agriculture, unit-economics]
lang: en
tldr: "Agricultural spraying is the one drone application whose unit economics are fully transparent: the billing unit is the fen (about 970 m²), rates run NT$150–300, spraying one fen takes about two minutes, equipment costs NT$300–500k, and even the substitute's price is public (manual spraying, roughly NT$200 per fen). And precisely because anyone can run the arithmetic, everyone did — operators who entered in 2018 sprayed over a thousand hectares a year and cleared over a million; later entrants broke even after two or three years and quit. Licensed operators charge NT$300 per fen; unlicensed ones undercut to NT$150. This is the industry cycle in miniature, compressed into about six years."
description: "Unpacking the unit economics of agricultural drone spraying in Taiwan: why this is the only application with computable ROI, actual rates and productivity, the cost of entry in equipment and licences, the structural causes of price collapse, and how regulation locks the market to a narrow list of crops."
draft: false
---

> 🌏 [中文版](/posts/product/2026-08-07-agri-drone-unit-economics)

[The industry map](/posts/tech/2026-08-06-drone-industry-map) called agriculture "the most mature, most boring, most profitable" of the four demand blocks, because it is "one of the few applications that needs no BVLOS, has clear per-aircraft daily output, and a payback period you can actually compute."

This piece tests that sentence. The conclusion is more complicated than the sentence: **agricultural spraying really is the only application with computable ROI — and being computable is exactly its problem.**

## Why only agriculture yields an ROI number

Of the four demand blocks, spraying is the only one where all four variables are simultaneously quantifiable:

| Variable | Ag spraying | Logistics / inspection |
|---|---|---|
| Billing unit | The *fen* (≈ 970 m²), used nationwide | Per trip? Per kilometre? Per asset? No standard |
| Time per unit | About 2 minutes per fen | Highly site-dependent |
| Equipment cost | NT$300,000–500,000 per agricultural drone | Varies enormously with payload |
| **Price of the substitute** | **Manual spraying, roughly NT$200 per fen — a public rate** | No clean comparison |

The fourth row is the one that matters. **Agriculture has a ready, public, clearly priced substitute**, so "is switching to a drone worth it" is elementary arithmetic, not a consulting engagement. Logistics and inspection don't get that luxury — their comparison is "the entire existing workflow," and that has no sticker price.

The productivity gap has been measured, too. Per [AgriHarvest, citing Chiang Chih-min of the Taiwan Agricultural Chemicals and Toxic Substances Research Institute](https://www.agriharvest.tw/archives/58197): on a 5-fen plot, conventional ground spraying takes 3 people dragging hoses for 40 minutes; a drone takes 2 people and 10 minutes — **six times the efficiency**. An earlier [Ministry of Agriculture knowledge portal report](https://kmweb.moa.gov.tw/theme_data.php?theme=technology_news&id=8611) offers another pair of figures: manual spraying covers 2 to 3 hectares per person per day; a spray drone covers 10 to 20.

Converted into money it is very direct. Per [CommonWealth Magazine](https://www.cw.com.tw/article/5122714), the market rate per fen runs **NT$150 to NT$300** depending on crop and location, and spraying one fen takes an operator two minutes — **spray five *jia* (50 fen) in a day and daily earnings can exceed NT$10,000**. The same report says that with good scheduling, operators earning over NT$2 million a year are not exceptional, and cites a customer who saved a down payment for a house in central Taiwan within a year of starting.

And the demand is real. The same report estimates that **roughly 80% of Taiwan's crop area is sprayed by drone operators**.

## The cost of entry is public too

Another feature of this business: the barrier is computable as well.

**Two licences, both mandatory**: the CAA's professional remotely piloted aircraft licence (see [the licence piece](/posts/policy/2026-08-06-taiwan-drone-license-guide)) plus a pesticide contract-spraying technician certificate from the Ministry of Agriculture's research institute. After both, an operator must still **join a registered agricultural juridical entity and register** before legally taking contract work.

**Equipment**: NT$300,000–500,000 for the aircraft, plus a truck to carry it, batteries, and a generator. CommonWealth cites Pingtung operator Lo Jui-hao's conservative estimate of **at least NT$1.3 million**. Both operators interviewed by the United Daily News also put their outlay above a million.

**Consumables are the hidden cost**: as far back as 2017, farmers were already computing that each lithium battery cost NT$18,000, ran about 15 minutes, and was spent after roughly 200 cycles.

**Subsidy**: per a [vendor profile in the Ministry of Agriculture's smart agriculture service directory](https://www.intelligentagri.com.tw/smartagrilist/Producer/producer_more?id=a8a812c4695046e198dc854e63d89872), operators who obtain both licences and the associated qualifications may apply for a NT$200,000 subsidy from the Agriculture and Food Agency.

Put together: **about NT$1.3 million to enter, over NT$10,000 a day in peak season, published unit rates, and demand that is already the market norm.** Anyone can compute that this looks like a good business.

Which is precisely the problem.

## What happens when everyone can run the numbers

Per [the United Daily News](https://udn.com/news/story/7266/9090858), Changhua County has 95 registered aerial pesticide contractors, behind only Yunlin and Tainan. Two individual cases in that report tell the six-year arc completely:

**A 40-year-old who entered the market in 2018**, when "there wasn't much competition," sprayed over a thousand hectares in a year and cleared over a million NT dollars. His own arithmetic was clear: "A drone runs about NT$500,000, far better value than conventional farm machinery at over a million."

**A 45-year-old with dual master's degrees in rural planning and soil and water conservation** started later on the strength of the market. Working full-time about 6 hours a day he could take NT$6,000 in daily revenue, bought a drone and truck by the book, and invested over a million. Working mainly rice contract spraying, **after two or three years his income only broke even**, with workdays often starting at four or five in the morning. He left.

The first operator eventually left too — for real estate. His comment: "You're at the mercy of the weather and people call you 'the guy who sprays.' It isn't as high-tech as outsiders think."

**Same business, same arithmetic, and within six years it went from "buy a house in a year" to "break even in three."** Three things happened in between, and none of them is technological.

## Three structural causes

**One: the entry barrier is low for farm machinery.** Conventional farm machinery runs over a million; an agricultural drone runs NT$500,000. That gap pulls capital in fast — a low barrier is an advantage when you're buying and a liability when you're competing, because **your barrier being low means everyone's is.**

**Two: compliance cost can be avoided, so it is.** CommonWealth puts it bluntly: a Pingtung farmer observed that local licensed operators charged about NT$300 per fen, **while unlicensed operators coming down from central Taiwan could push it to NT$150** — and the report cites an estimate that around 90% of operators fly unlicensed.

Where does the gap come from? From compliance itself. A properly affiliated operator must apply to the CAA for airspace 15 days before flying, manage traffic around the site as conditions require, and file a report afterward. **None of those steps affects spray quality; all of them affect cost.** The result is a textbook lemons problem: the compliant operator's cost structure cannot beat the non-compliant one's, and farmers mostly cannot tell the difference.

**Three: regulation locks the addressable range very narrow.** This is the least discussed and most consequential point. What a drone may spray is determined not by the drone's capability but by **the application methods approved on the pesticide's label.**

The research institute ran three years of rice spray safety evaluation, verifying 20 rice pesticides as effective, 9 of them at half dose. But as of that 2021 report, **the only crop approved for drone spraying was rice, with 5 approved pesticides for rice blast.**

(The approved list has expanded since; check the [pesticide information service](https://pesticide.aphia.gov.tw) and the [drone contract-spraying registration system](https://uav.aphia.gov.tw) for current scope. The point here isn't that number, it's **the nature of the bottleneck**: every crop and every chemical requires individual safety evaluation and approval, and evaluation moves far slower than equipment adoption.)

The consequence is structural: **every operator is squeezed onto the same crop.** When the serviceable market is locked by regulation while supply expands behind a NT$500,000 barrier, price collapse is inevitable rather than accidental.

## This is the industry cycle in miniature

Compressed into one sentence: technology arrives → early entrants earn excess returns → the low barrier attracts capital → supply expands past what regulation has opened → prices collapse → shakeout.

[The industry cycles piece](/posts/tech/2026-08-06-drone-industry-cycle-history) traced the global 2015 consumer bubble into the 2016 shakeout. **Agricultural spraying in Taiwan ran the same cycle in roughly six years — and did it inside a market where demand is genuine and the product genuinely works.**

That deserves emphasis: ag spraying is not a fake need. Eighty percent of crop area sprayed by operators, six times the efficiency of manual work, sharply lower pesticide exposure for farmers — all real. **An application can be genuinely useful and unprofitable at the same time; those two things do not contradict each other.**

Set against two other pieces in this series, the same disease appears in two forms:

- [The business models piece](/posts/product/2026-08-06-drone-business-models) put software and DaaS margins at 60–80%. Contract spraying is a service business through and through, and its margin was competed away — **high-margin models are not automatic; they require something that holds competitors off.**
- [The financials piece](/posts/investing/2026-08-07-drone-maker-financials) computed a cash conversion cycle near 377 days for a manufacturer: assets paid first, revenue collected later. The operator's version is NT$1.3 million of equipment up front against revenue concentrated in a short season, at the mercy of weather, at falling unit prices. **The scale differs by orders of magnitude; the structure is identical.**

## So what would hold competitors off

If the root of price collapse is "everyone can compute it, so everyone enters," only three things can hold:

**One: compliance itself, if it is enforced.** Per the UDN report, the Changhua county government has scheduled inspections of aerial contractors operating in its jurisdiction. The regulator also runs a [drone contract-spraying registration system](https://uav.aphia.gov.tw) with a public directory of licensed contractors — **farmers can look up who is legal.** For compliance to become a moat, non-compliance has to carry real cost; how that develops determines the licensed operator's position.

**Two: service, not flying.** In the CommonWealth report, facing DJI's share of the Taiwanese market at one point around 80%, domestic maker EarthGen chose to differentiate not on specification but on support — fast repair, and **a loaner aircraft while yours is being fixed.** In an industry where the operating window is a few days long, "how long until I'm flying again" is worth more than a parameter.

**Three: move up, don't stay in the spraying cell.** The same report describes the maker's ambition to build a "flight operator Uber" dispatch platform and use it to collect spraying data across regions. That is exactly Layer 5 of [the industry map](/posts/tech/2026-08-06-drone-industry-map) — **spraying is Layer 4 labour and will be competed to the floor; what was sprayed, where, and with what result is Layer 5.**

## Three judgments

1. **"Computable ROI" is both the advantage and the curse.** Ag spraying scaled precisely because its unit economics are transparent, and its prices collapsed for precisely the same reason. When evaluating any drone application, hold both facts together — **a business you can compute is usually one you cannot defend.**
2. **Unenforced compliance cost is a reverse subsidy.** The gap between NT$300 and NT$150 per fen is not technological, it is whether you follow the rules. When violations carry no real cost, the market systematically rewards the non-compliant and pushes the compliant out. That is the same problem facing any drone business built on certification advantage (see the certification ladder in [the market entry piece](/posts/career/2026-08-06-drone-market-entry-mechanics)).
3. **The real ceiling is the approved crop list, not aircraft performance.** Every crop and chemical requires separate evaluation and approval, and evaluation lags adoption badly. **The size of the market is set by the regulator's approval throughput** — structurally identical to logistics being blocked by regulation in [the BVLOS piece](/posts/tech/2026-08-06-bvlos-three-jurisdictions), with a different agency in the way.

## References

**Industry conditions and operator economics**

- [CommonWealth Magazine — NT$2 million a year flying drones? Who are the operators?](https://www.cw.com.tw/article/5122714) (in Chinese; the NT$150–300 per-fen rate, two-minute cycle time, ~NT$1.3M entry cost, licensed-versus-unlicensed price gap, the 90% unlicensed estimate, EarthGen's service differentiation and dispatch platform)
- [United Daily News — Drone spraying turns red ocean, operators exit](https://udn.com/news/story/7266/9090858) (in Chinese; Changhua's 95 registered contractors, actual income for a 2018 entrant versus a later one, county inspections, reasons for leaving)
- [AgriHarvest — Over 500 dual-licensed drone spraying operators](https://www.agriharvest.tw/archives/58197) (in Chinese; measured efficiency and ROI comparison, the 3 m/s wind limit, the dual-licence and juridical-entity registration system, rice pesticide safety evaluation and approved scope at the time)
- [Ministry of Agriculture knowledge portal — Drone spraying covers 20 hectares a day](https://kmweb.moa.gov.tw/theme_data.php?theme=technology_news&id=8611) (in Chinese; manual versus drone daily coverage, battery consumable costs)
- [MOA Smart Agriculture service directory — EarthGen Technology](https://www.intelligentagri.com.tw/smartagrilist/Producer/producer_more?id=a8a812c4695046e198dc854e63d89872) (in Chinese; actual chemical volume and cycle time versus a spray vehicle, the NT$200,000 subsidy)

**Regulator systems (for current status)**

- [APHIA — Drone pesticide contract-spraying registration system](https://uav.aphia.gov.tw) (in Chinese; licensed contractor directory, regulations, training)
- [APHIA — Pesticide information service](https://pesticide.aphia.gov.tw) (in Chinese; registered pesticide and permit lookup)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map)
- [Four Drone Business Models, and Why Selling Airframes Is the Worst One](/posts/product/2026-08-06-drone-business-models)
- [Drone Industry Cycles: How the 2016 Bubble Burst, and What's Different This Time](/posts/tech/2026-08-06-drone-industry-cycle-history)
- ["What's the Actual Margin on a Defense Tender?" — The Filings Answered What I Assumed Needed an Interview](/posts/investing/2026-08-07-drone-maker-financials)
- [Getting a Taiwanese Drone Licence: Tiers, the No-Skipping Rule, Fees, and Timeline](/posts/policy/2026-08-06-taiwan-drone-license-guide)
- [BVLOS in Three Jurisdictions: The US Hasn't Published, the EU Already Flies, Taiwan Has No Framework At All](/posts/tech/2026-08-06-bvlos-three-jurisdictions)
