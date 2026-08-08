---
title: "BVLOS in Three Jurisdictions: The US Hasn't Published, the EU Already Flies, Taiwan Has No Framework At All"
date: 2026-08-06
type: deep-dive
category: tech
tags: [drone, regulation, bvlos, uav, taiwan]
lang: en
tldr: "The EU has had a workable path since the end of 2020 — the Specific category grants an operational authorisation based on risk assessment, with U-space Regulation (EU) 2021/664 rolling out on top. The US Part 108 rule was still at OIRA and unpublished as of July 2026. Taiwan doesn't have the framework at all: its regulations offer 'extended visual line of sight' (900m, 400ft, observer required), while true BVLOS runs on per-activity permits valid for three months."
description: "Comparing beyond-visual-line-of-sight regimes across the US, EU, and Taiwan: Part 107 waivers and Part 108's actual progress, the EASA three-category structure and Specific category authorisation, Taiwan's extended-VLOS and case-by-case permit model, and what the gap means for delivery and long-range inspection business models."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-06-bvlos-three-jurisdictions)

[The industry map](/posts/tech/2026-08-06-drone-industry-map-en) listed BVLOS regulation as one of two ceilings on drone scaling. This piece lays three jurisdictions side by side, and the spread is wider than I expected: **the EU can already fly, the US is waiting on a last mile, and Taiwan hasn't built the framework.**

Definition first. **BVLOS — beyond visual line of sight — means flying past where the operator can see the aircraft.** It's a ceiling because without it, the unit economics of delivery and long-range inspection never close: the labor you save gets eaten by stationing an observer along every leg.

## United States: Part 107 is a waiver model, Part 108 hasn't landed

Part 107 **prohibits** BVLOS but permits case-by-case waivers. The problem with that model isn't whether you can get one — it's that **each approval covers one operation**, so repeated fixed-route work never scales.

Part 108 exists to replace one-waiver-at-a-time with a standardized framework. The timeline, per [Airdata's summary](https://airdata.com/blog/2026/part-108):

| Date | Event |
|---|---|
| 2025-06-06 | Executive Order 14307 directs the FAA to publish a final rule within 240 days of the NPRM |
| 2026-02-01 | Original deadline |
| ~2026-03-16 | Deadline after a 43-day government shutdown |
| 2026-07-10 | Rule reaches OIRA for final review (significant-rule review can run 90 days) |
| Late 2026–early 2027 | Estimated publication, followed by a 6–12 month transition |

In other words: **five years of US industry talk about routine BVLOS, and as of August 2026 it still has not landed.**

## European Union: not "opening BVLOS" — BVLOS was always inside the framework

This is the biggest conceptual difference of the three. The EU has no rule called "the BVLOS rule," because its structure was never organized around whether you can see the aircraft. It's organized around **risk**.

Per [EASA](https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone), [Regulation (EU) 2019/947](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2019947) (together with 2019/945) has been **applicable in all EU Member States since 31 December 2020**, sorting all civil drone operations into three categories:

| Category | Risk | What it requires |
|---|---|---|
| **Open** | Low | No operational authorisation; comply with built-in subcategory limits (A1/A2/A3) |
| **Specific** | Medium | An **operational authorisation** from the national competent authority, granted on the basis of the operator's own **risk assessment** |
| **Certified** | High | Certification of both aircraft and operator, plus a licensed remote pilot |

**BVLOS sits in the Specific category.** EASA's own wording:

> The 'specific' category covers riskier civil drone operations, where safety is ensured by the drone operator by obtaining an operational authorisation from the national competent authority before starting the operation.

The critical difference: **this authorises a type of operation, not a single activity.** Once granted, flights matching the described operation can continue without reapplying each time. That is exactly what the US wants Part 108 to achieve and has not yet achieved.

Traffic management is handled separately by [Regulation (EU) 2021/664](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2021664) — the U-space regulation adopted in April 2021 — establishing digital traffic services in airspace expected to carry heavier drone traffic, such as urban areas.

**So the EU's position is: a workable path existed five years ago, and what's being solved now is scale and airspace integration, not permission.**

## Taiwan: there is "extended visual line of sight," but that isn't BVLOS

This was the most surprising finding once I read the statutory text.

The Remotely Piloted Drone Management Regulations **contain no BVLOS regime**. What they contain is **extended visual line of sight**, defined in Article 2:

> Extended VLOS flight: an operating method in which the operator is beyond visual range and a visual observer within a 300-meter radius of the operator maintains direct visual contact with the drone and provides the operator with necessary flight information; the maximum extended-VLOS range is a 900-meter radius from the operator, at no more than 400 feet above ground or water.

Three constraints, unpacked:

1. **A human still has to see the aircraft** — the eyes just moved from the operator to an observer
2. **300-meter observer radius, 900-meter overall radius**
3. **400-foot ceiling**

**That is EVLOS, not BVLOS**, and the distinction is substantive: extended VLOS still depends on human eyes, so its cost structure matches VLOS. Want to inspect 10 kilometers of pipeline? Station observers along the route. The "nobody on site" economics that delivery and long-range inspection need is precisely what extended VLOS cannot provide.

So what about actual beyond-visual-range flight? Under Article 99-14 of the Civil Aviation Act, "operating within visual line of sight" is one of eight restrictions that **can be waived** — but the conditions stack tightly:

- Only **government agencies, schools, and legal entities** may apply (individuals cannot, even with an advanced licence)
- The operator must hold **professional advanced G1** (covering BVLOS, night flight, and above 400 feet)
- An activity plan must be filed with the CAA **15 days before the activity**
- **The permit is valid for 3 months** (6 months for agriculture-registered entities in specified activities; 1 year for agencies performing official duties)

This is a **case-by-case permit model** with a one-quarter validity. It sits at the same level as the US Part 107 waiver — the level the US is trying to leave.

## Three-way comparison

| | United States | European Union | Taiwan |
|---|---|---|---|
| **Legal position of BVLOS** | Prohibited under Part 107, waiverable | Routine operation in the Specific category | One of eight restrictions, waiverable case by case |
| **Standardized framework** | Part 108 (**not yet published**) | Yes (2019/947, applicable 2020-12-31) | **None** |
| **What gets authorised** | A single operation | **A type of operation** (continuing) | A single activity, 3-month permit |
| **Lead time** | Case dependent | Risk assessment | 15 days before the activity |
| **Who may apply** | Operators | Operators | **Legal entities / agencies / schools only** |
| **Traffic management** | UTM in development | U-space Regulation (EU) 2021/664 | No corresponding regulation |
| **Intermediate tier** | — | — | Extended VLOS (900m / 400ft / observer) |

## What the gap actually means

**First, Taiwan's "low-altitude economy" rhetoric runs ahead of its regulation.** Delivery drones, long-range pipeline inspection, cross-county logistics — under the current framework all of these can only run as demonstration operations under per-activity permits with three-month validity. They cannot become scalable business models. **Technology isn't the bottleneck; the institution is.**

**Second, this is less damaging to Taiwan's export orientation than it sounds.** [Roughly 80% of Taiwan's drone output comes from public procurement and exports are just 22.9%](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en), with the Czech Republic, Poland, and the US as the main markets. **Exporting airframes and modules means selling into someone else's regulatory environment, not your own.** Taiwanese manufacturers are hurt less by the domestic BVLOS gap than you'd assume.

Who genuinely suffers is the **domestic service layer** — inspection DaaS, delivery operators, survey firms, the Layer 5 businesses. Their ceiling is Taiwanese regulation, not technology.

**Third, building the framework is faster than building the technology — but there's no shortcut.** The EU went from publication in 2019 to applicability at the end of 2020, with a complete risk assessment methodology and national authority capacity built underneath. Taiwan currently sets even its intermediate tier far more conservatively than the EU's Specific category. Moving up requires more than drafting: detect-and-avoid capability criteria, command-link reliability requirements, and review capacity at the regulator.

## One sentence

**The EU is solving how to fly safely, the US is solving when it can publish a rule, and Taiwan is one step before deciding whether to build the framework at all.** When judging any drone service company's growth ceiling, ask which jurisdiction it operates in first — that variable currently outweighs its technical capability.

## References

**United States**

- [Airdata — FAA Part 108 Explained: Everything Drone Operators Need to Know in 2026](https://airdata.com/blog/2026/part-108) (EO 14307, deadline slippage, OIRA review)
- [FAA — Unmanned Aircraft Systems](https://www.faa.gov/uas)

**European Union**

- [EASA — Operating a drone](https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone) (three categories and Specific category authorisation)
- [EASA — Rules & Standards](https://www.easa.europa.eu/en/domains/drones-air-mobility/rules-standards)
- [Commission Implementing Regulation (EU) 2019/947 — EASA](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2019947)
- [Commission Implementing Regulation (EU) 2021/664 (U-space) — EASA](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2021664)
- [EASA — Civil Drones](https://www.easa.europa.eu/en/domains/civil-drones)

**Taiwan** (in Chinese)

- [Remotely Piloted Drone Management Regulations — Laws & Regulations Database](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0090083) (Art. 2 extended VLOS definition, Art. 29 operating limits, Art. 32 activity permits)
- [CAA — Drone section](https://www.caa.gov.tw/article.aspx?a=188&lang=1)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [Taiwan's Drone Rules in Plain Language](/posts/policy/2026-08-06-taiwan-drone-regulation-guide-en)
