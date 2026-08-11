---
title: "Production Ramp Evidence Isn't in the Factory, It's in Failed-to-Award Notices"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, manufacturing, procurement, taiwan, supply-chain]
lang: en
tldr: "The public evidence of a production ramp isn't in the factory but in the government e-procurement system: the fire service's 88 thermal drone sets were priced centrally, six fire departments' first tenders drew no qualifying bidder, all seven awards I pulled equal the budget to the dollar, and the bidder pool is about six firms. A control group added afterwards — aerial ladder trucks, at 0.54 failed-to-awarded versus the drones' 0.33 — refutes this post's original first conclusion: failed tenders are the norm in Taiwanese fire-service procurement."
description: "Rebuilding Taiwan's 88+88 fire-service unmanned systems procurement county by county from award and failed-to-award records: uniform central pricing, six failed tenders, every award at exactly 100% of budget, delivery windows halved — and a correction to the unit prices derived in the previous post."
draft: false
series:
  name: "Drone Teardown"
  order: 37
---

> 🌏 [中文版](/posts/tech/2026-08-09-drone-production-ramp-procurement)

Two cells remained in this series' technical block, and "[manufacturing and production ramp](/posts/tech/2026-08-06-drone-industry-map-en)" was the one I had flagged from the beginning as **probably needing factory access** — the last topic in the whole series still carrying a "needs non-public material" label.

[The previous post](/posts/tech/2026-08-09-drone-payload-cost-export-control-en) taught a lesson: I had filed payload as a market question (go collect quotes) and it turned out to be a clause question. The general form of that mistake is **"I assume up front that this topic needs something I can't get."** So this time I asked first:

> **Does a production ramp really require seeing the line, or did I write the topic so that it requires the line?**

It does not. **The public evidence of a ramp is lead time and failed tenders — "delivery promised in three months, actually delivered in how many" and "did anyone show up to bid." All of that is published in the government e-procurement system, every entry dated.**

And there happens to be a case that comes close to laboratory conditions.

## 1. A procurement with almost every variable controlled

[The payload post](/posts/tech/2026-08-09-drone-payload-cost-export-control-en) worked through the fire service's 2024 programme: NT$660 million approved by the Executive Yuan, fully funding 22 municipal fire departments to buy 88 infrared thermal imaging drone sets and 88 rescue robots.

For observing a ramp this is nearly ideal:

- **Same point in time** (all in the first half of 2024)
- **Same specification** (point 3 of the [implementing directions](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040131054600-1130216) prescribes the required capabilities uniformly)
- **Same money** (fully funded from the central special tax allocation)
- **Twenty-two independent buyers**, each issuing its own tender

In other words: demand, specification, budget and timing are all fixed, and only the buyer varies. **Any variation comes from the supply side.**

The data source is the [g0v mirror of Taiwan's e-procurement system](https://pcc-api.openfun.app/) (maintained by ronnywang, scraped from the [Government e-Procurement System](https://web.pcc.gov.tw/)). Every date, amount and bidder count below can be looked back up case by case.

## 2. Priced centrally, copied locally

Start with the budgets. County by county:

| Fire department | Item | Budget | Per unit |
|---|---|---|---|
| Hsinchu City | 4 thermal drone sets | NT$4,000,000 | NT$1M each |
| Miaoli County | thermal drones | NT$4,000,000 | NT$1M each |
| Yunlin County | 4 thermal drone sets | NT$4,000,000 | NT$1M each |
| Keelung City | thermal drone sets | NT$4,000,000 | NT$1M each |
| Taoyuan City | thermal drone sets | NT$4,000,000 | NT$1M each |
| Hsinchu City | 4 rescue robots | NT$26,000,000 | NT$6.5M each |
| Taichung City | 4 rescue robots | NT$26,000,000 | NT$6.5M each |

**Identical.** Five counties budget NT$4M for four drone sets; two counties budget NT$26M for four robots.

Checking against the central totals:

```
NT$1M (drone) + NT$6.5M (robot) = NT$7.5M
NT$7.5M × 88 = NT$660M                              ✓
Hsinchu City alone: NT$4M + NT$26M = NT$30M
Changhua's reported 4 robots + 4 drones = NT$30M    ✓
```

Exact. **This is not twenty-two counties negotiating separately; it is a central unit price that local authorities copied.**

That in itself isn't surprising — a fully funded central allocation normally comes with a fixed per-unit ceiling. What happened next is.

## 3. Six fire departments couldn't award on the first attempt

Turning to the failed-to-award notices. For the drone half in 2024:

| Fire department | Failed | Reason | Re-awarded | Gap |
|---|---|---|---|---|
| Hsinchu City | 05-07 | no bidder, or fewer than the statutory number to open | 06-12 | 36 days |
| Changhua County | 05-29 | — | 07-12 | 44 days |
| Miaoli County | 06-05 | no bidder, or fewer than the statutory number to open | 07-04 | 29 days |
| Yunlin County | 06-06 | no bidder, or fewer than the statutory number to open | 07-05 | 29 days |
| Keelung City | 06-11 | tender annulled | 06-25 | 14 days |
| Lienchiang County | 06-26 | — | 08-09 | 44 days |

**Of twenty-two buyers, at least six failed to award on the first attempt.** And the reason isn't a price disagreement — it's that **no vendor bid, or too few bid to legally open the tender**.

The money was fully central, the specification uniform, the budget published. The first notice went out, and nobody came.

The robot half is starker. In the same year, rescue robot procurements by fire agencies produced **nine failed-to-award notices**, across Taichung (2), Chiayi County, Kaohsiung, Hsinchu City, Lienchiang, Changhua, Chiayi City and Tainan.

**Fifteen failed-to-award notices in total, inside a single 88-plus-88 unit programme.**

## 4. Every award equals the budget exactly

So what happened on the retries? Here are the seven awards for which I could pull complete data:

| Fire department | Item | Budget | Total award | Ratio | Bidders |
|---|---|---|---|---|---|
| Hsinchu City | 4 drone sets | 4,000,000 | 4,000,000 | **100%** | 2 |
| Miaoli County | drones | 4,000,000 | 4,000,000 | **100%** | 2 |
| Yunlin County | 4 drone sets | 4,000,000 | 4,000,000 | **100%** | **1** |
| Keelung City | drone sets | 4,000,000 | 4,000,000 | **100%** | 4 |
| Taoyuan City | drone sets | 4,000,000 | 4,000,000 | **100%** | 3 |
| Hsinchu City | 4 robots | 26,000,000 | 26,000,000 | **100%** | 2 |
| Taichung City | 4 robots | 26,000,000 | 26,000,000 | **100%** | 2 |

**Seven for seven at 100%. Not a dollar shaved.**

All seven used the "most advantageous tender" method, so price was never the primary award criterion — that method weighs technical merit, delivery capability and service, with price typically only required to sit inside the ceiling. Even so, **all seven landing exactly on the budget figure**, rather than slightly under it, is a telling distribution.

Yunlin's especially: **a single bidder, awarded at 100% of budget.**

Let me be clear about what I am not claiming. I am not alleging any impropriety — awarding at the budget figure is permitted under this method, and continuing with a single bidder after a failed tender is lawful (Article 48 of the Government Procurement Act). **My claim is only this: in this market the centrally-set price was not competed down, because there were not enough competitors to compete it down.**

## 5. The bidder pool is six companies, one of them a security firm

Merging the bidder lists from the five drone tenders, the entire pool looks like this:

| Company | Appearances |
|---|---|
| Dragonfly UAS (翔隆航太) | 3 (Yunlin, Keelung, Taoyuan) |
| Taiwan Secom (中興保全科技) | 3 (Miaoli, Keelung, Taoyuan) |
| Avilon (奧榮科技) | 2 (Miaoli, Keelung) |
| Hangjian Technology (航見科技) | 2 (Hsinchu City, Keelung) |
| Hsuan Yuan Tech (璿元科技) | 1 (Taoyuan) |
| Yongyi Safety Technology (永翌安全科技) | 1 (Hsinchu City) |

**Six companies, four of which appear more than once.** Keelung was the only tender with four bidders because all four regulars happened to turn up at once.

Worth noting is **Taiwan Secom** — a security services company, not a drone manufacturer. It is named as the awardee in the English notice for Taoyuan's tender. That's not a problem in itself (systems integrators bid all the time), but it characterises the pool: **this is not six drone makers competing; it is a few airframe builders plus a few integrators and resellers.**

And the robot bidder list doesn't overlap at all: Zhenhe Enterprise, Yijun Industrial, Fire Wolf (力中國際), Foreman Enterprise (北盟事業) — firefighting equipment suppliers with no intersection with the drone group. Reasonable, but it means the NT$660M split into two small markets that don't talk to each other.

## 6. Taichung: the time a failed tender eats comes out of the delivery window

The most complete single-county timeline is Taichung's robot tender:

```
2024-05-22  Tender issued        Delivery by 20 Sep 2024
2024-06-07  Failed to award      no bidder, or fewer than the statutory number
2024-06-07  Re-tendered          Delivery by 20 Sep 2024 (unchanged)
2024-07-23  Failed to award      award cancelled or contract terminated
2024-07-24  Third tender         Delivery by 10 Oct 2024 (extended 20 days)
2024-08-19  Awarded              2 bidders, NT$26M = 100% of budget
                                 Performance period 13 Aug – 10 Oct 2024
```

Look at the last two lines. The first tender allowed from late May to 20 September — **about 121 days**. After three tenders, the actual performance period was 13 August to 10 October: **58 days**.

**The two months the failed tenders ate came entirely out of the delivery window. The money didn't move, the quantity didn't drop, the specification didn't change.**

And the 23 July notice gives its reason as **"award cancelled or contract terminated"** — meaning that round had reached award and then lost it. So Taichung didn't only fail to attract bidders; it attracted one and then lost it.

That is what a production ramp looks like in procurement records. It doesn't take the shape of a capacity curve. It takes the shape of **a chain of moves that push risk onto the lead time.**

## 7. What this data actually shows

Four things.

**First, ~~at this point in 2024 Taiwan did not have a supply side that could reliably answer a uniform-specification open tender.~~ This one was refuted by my own control group — see section 9.** The direct cause of the six failed drone tenders was indeed insufficient bidders, but failed tenders are themselves the norm in Taiwanese fire-service equipment procurement, not a drone-specific signal.

**Second, the price was not competed down.** All seven awards equalled the budget. That doesn't mean vendors made a killing — it's normal under this award method, and NT$1M for a thermal imaging drone set is not expensive internationally. What it means is that **this market's price is set by policy, not discovered by the market.** That's an important qualifier on the "demand-side pull" described in [the industry-map post](/posts/tech/2026-08-06-drone-industry-map-en): the demand is real, but it isn't yet large enough to generate price competition.

**Third, the cost of the ramp lands on lead time.** Taichung went from 121 days to 58. For a supplier, that means **the real production window after winning is much shorter than the contract's face value** — and the part that vanished wasn't lost to slowness, it was lost to two prior failed tenders. That's the other side of the "385 days of inventory" computed in [the financials post](/posts/investing/2026-08-07-drone-maker-financials-en): you have to stock materials before you dare bid on a job with two months left on the clock.

**Fourth, this cell never needed a factory.** That's this post's methodological conclusion, and the record of my sixth time falling into the same hole: **I filed "production ramp" as requiring a view of the line, when it was in the procurement system all along — and more checkable than a line, because every entry carries a publication date, a case number and an agency code that anyone can look up.**

## 8. Correction: I had the unit prices backwards in the previous post

Now the unpleasant part.

In [the payload post](/posts/tech/2026-08-09-drone-payload-cost-export-control-en) I had no line-item prices, so I solved a simultaneous equation from two programme totals:

```
88D + 88R = 660,000,000   (2024 programme)
72D + 33R = 460,800,000   (2025–2029 programme)
→ D ≈ 5,469,231 (drone set)
  R ≈ 2,030,769 (rescue robot)
```

The procurement records in section 2 of this post show the real figures are:

```
D = 1,000,000    (drone set, consistent across five counties)
R = 6,500,000    (rescue robot, consistent across two counties)
```

**The direction is reversed, and the magnitude is off by more than fivefold.**

I did flag the assumption in that post ("assumes identical unit prices across two programmes four years apart"), and I did note that "the robot figure it produces looks low" — that instinct was correct, but I didn't chase it. **I marked the uncertainty and then failed to remove it, when the data to remove it had been public the whole time.**

How much does that damage the post's conclusions? Its closing section said a FLIR Boson 640 core (about NT$114,000) is roughly **2.1%** of a NT$5.47M delivered set. Recomputing on the correct NT$1M:

```
113,856 ÷ 1,000,000 ≈ 11.4%
```

**It's 11.4%, not 2.1%.**

That post's central argument — a single component holding a veto over the whole contract — is unaffected, and arguably strengthened: a component that is an eighth of the delivered price is simultaneously the export-control gate. But **the neat line about "a two percent part deciding a hundred percent of the deal" was wrong and has to be withdrawn.**

Both language versions of that post now carry a correction. The lesson matters more than the number:

> **Solving two aggregates simultaneously looks like derivation, but it's guessing. When the line-item record exists, it isn't an alternative check — it is the only thing you should be using.**

## 9. I ran the control group, and it refuted the first conclusion in section 7

The original draft closed by saying "no control group … that's an important comparison and I did not make it." I made it the same day, and the result went against me.

Same year, same class of agency (fire departments), same database, different item: **aerial ladder trucks**. That is about as mature a category as exists — domestic and foreign suppliers going back decades, stable specifications, nothing "emerging industry" about it.

| Item | 2024 awards | 2024 failed-to-award | Failed / awarded |
|---|---|---|---|
| **Aerial ladder trucks** | 13 | 7 | **0.54** |
| Rescue robots | 17 | 9 | 0.53 |
| Thermal imaging drones | 15 | 5 | **0.33** |

**Aerial ladder trucks fail to award at a higher rate than thermal imaging drones — appreciably higher.**

So the inference in section 7's first point does not hold. I went from "six failed tenders" to "Taiwan lacks a supply side that can answer an open tender," but the control group shows that **in Taiwanese fire-service equipment procurement, failing to award is simply normal**. The drone half failed less often than a category with decades of established suppliers.

What do failed tenders reflect, then? I don't know, and this post can't answer it — it could be a gap between budgeted and market prices, the evaluation thresholds of the most-advantageous-tender method, publication periods that are too short, or a shared structural feature of fire equipment procurement. Distinguishing those needs different material. **What is certain is that it is not evidence that the drone industry hasn't matured.**

Which conclusions are unaffected?

- **Central pricing copied locally** (section 2): a direct comparison of line-item budget figures, not a rate-based inference.
- **All seven awards equal to budget** (section 4): same. Though I did not run the same check on aerial ladder trucks, so "is a 100% award also normal?" is now an open question — a newly created gap.
- **A bidder pool of six** (section 5): a roll-call count, not a rate.
- **Taichung's window compressed from 121 to 58 days** (section 6): a specific timeline.

**The lesson worth writing down: one of the gaps I honestly listed under "what this post does not answer" directly refuted this post's first conclusion.** Listing gaps is a good habit, but listing is not handling — [the payload post](/posts/tech/2026-08-09-drone-payload-cost-export-control-en) had just made the same mistake (flagging uncertainty without removing it), and this is the second instance in two days. **Next time I write "I did not do X," the question to ask first is: could X refute what I am writing? If it could, X is not future work — it is prerequisite work for this post.**

## What this post does not answer

- **I pulled complete award data for seven tenders, not all twenty-two counties.** Some counties may have bundled drones into other tenders or used different tender titles (I searched titles for "thermal imaging drone" and "rescue robot"). So "six failed tenders" is **at least six**, not exactly six.
- **I didn't check performance outcomes.** Whether deliveries were on time, extended, or failed acceptance testing is mostly not published. Point 7 of the implementing directions requires each county to file a monthly progress report with the National Fire Agency — that document is the real ramp data, and it isn't public.
- **I didn't distinguish manufacturers from resellers among the winners.** The Taiwan Secom case flags the issue, but tracing each company's factory registration and product origin wasn't done here. That bears directly on how much of this fleet was actually built in Taiwan.
- ~~**No control group.**~~ **Now run — see section 9, and it refuted section 7's first conclusion.** The new gap it opens: are aerial ladder truck awards also routinely equal to budget? I didn't check.
- **No actual production metrics.** Yield, takt time, supplier qualification cycles, tooling amortisation — those genuinely are known only to the manufacturer. **This post argues that a ramp has a public face, not that a ramp can be fully seen from outside.**

---

## References

**Primary: procurement records**

- [Government e-Procurement tender API (g0v, maintained by ronnywang)](https://pcc-api.openfun.app/) (source of every award and failed-to-award record here; the underlying data comes from the [Government e-Procurement System](https://web.pcc.gov.tw/). Title searches returned 74 records for "thermal imaging drone" and 100 for "rescue robot"; this post uses the 2024 fire-agency subset)
- Case-by-case records (agency codes and case numbers are re-lookupable via the API above): Hsinchu City Fire Department A113019 (drones, NT$4M budget, failed 2024-05-07, awarded 2024-06-12 at NT$4M with 2 bidders) and A113017 (robots, NT$26M budget, failed 2024-04-26, awarded 2024-05-21 at NT$26M with 2 bidders); Miaoli County Government 113114B; Yunlin County Fire Department 113042 (1 bidder); Keelung City Fire Department 113B018 (annulled 2024-06-11, 4 bidders); Taoyuan City Fire Department W113-31 (3 bidders); Taichung City Fire Department 113AC077 (failed 2024-06-07, "award cancelled or contract terminated" 2024-07-23, awarded 2024-08-19)

**Primary: programme basis**

- [Implementing directions for the fire-service unmanned rescue equipment funding programme (16 February 2024)](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040131054600-1130216) (point 2: NT$660M for 88 drone sets and 88 robots; point 3: uniform capability requirements and "give priority to domestically manufactured"; point 7: monthly progress reports)
- [Ministry of the Interior press release: Executive Yuan approves NT$660M for rescue drones and robots](https://www.moi.gov.tw/News_Content.aspx?n=2&s=312624)
- [Commercial Times: Executive Yuan approves over NT$600M to help local governments buy drones](https://www.ctee.com.tw/news/20240215700719-430101) (the 2025–2029 follow-on of 72 drones and 33 robots for NT$460.8M — section 8 shows that solving these two totals simultaneously produces wrong unit prices)

**On this site**

- [Why Drone Thermal Camera Prices Jump: The Cost Steps Export Control Draws](/posts/tech/2026-08-09-drone-payload-cost-export-control-en) (section 8 here corrects that post's unit-price estimate)
- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [What Is the Margin on a Government Contract, Really: The Filings Answered What I Assumed Needed Interviews](/posts/investing/2026-08-07-drone-maker-financials-en)
- [Four Doors Into Taiwan's Drone Industry: What Public Records Tell You About Getting In](/posts/career/2026-08-06-drone-market-entry-mechanics-en)
