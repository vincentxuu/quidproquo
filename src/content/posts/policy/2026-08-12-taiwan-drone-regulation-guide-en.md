---
title: "Taiwan's Drone Rules in Plain Language: What Needs Registering, What Needs a Licence, What Gets You Fined"
date: 2026-08-12
type: guide
category: policy
tags: [drone, taiwan, regulation, uav, aviation-law]
lang: en
tldr: "Register anything 250g or heavier; the registration number expires after 2 years. Individuals only need a licence at 2kg–15kg with navigation equipment. The licence term is now 3 years, not 2, and the student licence age dropped to 14, not 16. This piece covers only the currently effective text of the Remotely Piloted Drone Management Regulations, and flags the three most common outdated claims circulating online."
description: "A plain-language guide to Taiwan's currently effective drone regulations: registration thresholds, licence tiers and privileges, operating limits, corporate activity applications, incident reporting, and penalties — plus which widely circulated rules are already outdated or not yet in force."
draft: false
---

> 🌏 [中文版](/posts/policy/2026-08-12-taiwan-drone-regulation-guide)

There is no shortage of Taiwanese drone regulation explainers. The problem is that **they mix three different things**: currently effective provisions, rules that have already been amended away, and draft amendments not yet in force. Blended together, a reader has no way to tell which sentence is usable today.

This piece does one thing: it reports what the [currently effective text of the Remotely Piloted Drone Management Regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0090083) says (amended 14 November 2024, effective 1 December 2024 except for provisions with separately designated dates). At the end I flag the claims I confirmed are outdated. (in Chinese)

This is the regulation entry in the [drone series](/tags/drone), following [the industry map](/posts/tech/2026-08-06-drone-industry-map) and [the Taiwan supply chain breakdown](/posts/tech/2026-08-09-taiwan-drone-supply-chain-layers).

## 1. Registration: the line is 250 grams

**Individuals**: maximum takeoff weight of **250g or above** must be registered.
**Government agencies, schools, and legal entities**: **all drones regardless of weight**.

The CAA issues a registration number that must be marked in a conspicuous place on the airframe before you may operate. The marking rules are specified: label, engraving, or paint are all acceptable, but it must be on the external fixed structure, in a color that clearly contrasts with the background, legible to the naked eye, and secure enough not to detach in flight.

Two details that get missed:

- **The registration number is valid for 2 years**, renewable within 30 days before expiry. This is a different clock from the licence — don't conflate them.
- **Individual owners must be at least 14 years old**; those under 18 need a guardian's consent letter.

Self-built drones (including model aircraft) also require registration, entered under a self-assigned model name in the management system.

## 2. Licensing: weight, navigation equipment, and who owns it

Article 19 lists three cases where a licence is mandatory:

1. Drones owned by government agencies, schools, or legal entities (**any weight**)
2. Individually owned drones of **2kg up to but not including 15kg with navigation equipment**
3. Individually owned drones of **15kg or above**

Inverted: **if you are an individual, your drone is under 2kg, and you fly recreationally, no licence is required.** Most consumer camera drones sit in this cell (flagship models generally come in under 250g or under 1kg).

But "no licence needed" does not mean "no registration needed" — the 250g line still applies.

**Note how sharp point 1 is**: any drone owned by a company, *however light*, requires its operator to hold a professional licence. Flying the company's 249g mini drone to shoot company products and flying your own at a riverside park are legally two entirely different activities.

## 3. Three licence classes

| Class | Age | Requirements | Scope |
|---|---|---|---|
| Student | **14** | Issued on application, no test | Must fly under direct supervision of a general or professional licence holder; **under 25kg** |
| General | 18 | Pass the **written test** | Individually owned, 2kg to under 15kg with navigation equipment |
| Professional | 18 | Experience prerequisites + **medical exam** + **written and practical tests** | Drones owned by government agencies / schools / legal entities, and individually owned drones of 15kg and above |

**The licence is valid for 3 years** (Article 23). This matters because a great many articles online still say "2 years" — that was the rule before the 1 December 2024 amendment. The text includes a transitional clause: licences obtained before the amendment took effect keep the old term. So whether yours runs 2 or 3 years depends on its issue date.

Other timing rules:

- The **practical test must be completed within one year** of passing the written test, or the written result lapses.
- You must apply for issuance **within 30 days** of passing; one **30-day extension** is available.
- Failed practical sections may be retested **30 days after** receiving results.
- Renewal is filed **within 3 months before expiry**. Professional licences require a fresh medical exam and a renewal test; per CAA guidance, general licence renewal **requires no retest**.

For professional licences the medical exam follows the **standard passenger-car driving licence** criteria (using the car licence registration form — **not the motorcycle one**), at a medical institution designated by the highway monitoring authority. Only operators of drones 150kg and above need the Class B aviation personnel medical standard.

## 4. What you may not do in flight

Article 29's operating limits, in plain language:

- Stay **at least 30 meters clear** of freeways, expressways, railways, elevated railways, mass rapid transit systems, buildings, and obstacles
- **Do not** operate from a moving aircraft, vehicle, or vessel
- Under 25kg with navigation equipment: maximum speed **87 knots (160 km/h)**
- Extended visual line of sight is capped at **900 meters radius** from the operator and **400 feet** above ground or water, with a visual observer maintaining visual contact

Two more from the general provisions: blood alcohol must not exceed 0.02% (0.1 mg/L exhaled), and operators must not be impaired by psychoactive substances. Where there are two or more operators, one must be designated as the decision authority before flight — no designation, no flight.

Separately, Article 99-14 of the Civil Aviation Act lists eight operating restrictions (400-foot ceiling, visual line of sight, no dropping or spraying, no night flight, no flight over crowds, and others). **Only government agencies, schools, and legal entities can apply to have these waived** — per CAA guidance, private individuals cannot obtain waivers for crowd overflight or night flying, nor apply to fly in red zones.

## 5. Extra obligations for legal entities

If a company wants to use drones for business, the bar is considerably higher:

- File registration documents, a drone system inventory, an operator roster, and an **operations manual** for CAA approval; approval is valid **2 years**
- Activity in prohibited zones, restricted zones, or around airports requires application **15 days in advance**; **30 days** if military aviation authority areas are involved
- Waiving any of the eight operating restrictions likewise requires an activity plan filed **15 days in advance**
- Swarm displays controlling **200 or more** aircraft simultaneously require a cybersecurity assessment report for the swarm system
- Activity records (registration number, date, area, time, altitude, continuous position log, flight time, operator name, maintenance records) must be **kept for 2 years**

One date worth marking: **from 1 December 2027**, drones with navigation equipment used by legal entities in these activities must carry a **cybersecurity assessment report** from a body recognized by the Ministry of Digital Affairs, plus a commodity inspection certificate (under 2kg) or CAA type certification (2kg and above). In practice this excludes Chinese-made drones from corporate operations.

## 6. Sellers have obligations too

Article 17 governs manufacturers and importers, **effective 1 December 2025**: before public sale, they must register brand and model, maximum takeoff weight, cybersecurity assessment report, NCC radio frequency certification, and either commodity inspection (under 2kg) or type certification (2kg and above) in the CAA's designated system — and mark that information on the product or packaging.

E-commerce listings must also carry Chinese-language text stating the manufacturer's name, that drones 250g and above require registration, and that operators must observe zone and operating rules before flying.

**What this means as a buyer**: check new hardware for a cybersecurity report number, NCC marking, and a type or commodity inspection mark. Without them you may get stuck at registration.

## 7. Reporting incidents

Article 36 requires filing a report with the CAA **within 24 hours** of occurrence or becoming aware, covering:

- Drone flight occurrences as defined by the Transportation Occurrence Investigation Act
- Substantial damage to or loss of a drone 2kg or above with navigation equipment
- Substantial damage to or loss of a drone operating within prohibited or restricted zones
- Near misses or collisions with other aircraft or obstacles

## 8. Penalties

Penalties live in the Civil Aviation Act rather than the Management Regulations. Two brackets are commonly cited in practice: **NT$60,000–300,000 for unlicensed operation**, and **NT$300,000–1,500,000 for entering a prohibited zone**, with forfeiture of the drone.

I have not verified every cell of the penalty schedule, so I only give orders of magnitude here. **To confirm what a specific violation costs, consult the CAA's published penalty standards table** rather than a blog figure.

## The three most common outdated claims

While writing this I found several circulating claims that no longer match the current text. Each comparison below is from the current text on the law database plus the CAA's official FAQ:

| Common claim | Current provision |
|---|---|
| Licence valid **2 years** | **3 years** (Art. 23). Two years was the pre-December-2024 rule |
| Student licence requires age **16** | **14** (Art. 20) |
| Student licence covers under **15kg** | **Under 25kg** (Art. 20) |

There is also a circulating set of "six 2026 amendments" (general licence extended to 25kg, merged weight brackets for advanced licences, elimination of the spraying group, a new hybrid airframe category, and others). **I could not find any of this in the current text on the law database.** The database page does carry the note "some or all provisions of this regulation are not yet in force; final effective date: undetermined," so further amendments are plausibly in progress — but **until formally promulgated and in force, they should not be cited as current rules.**

Which is the general principle I'd suggest: **treat the [Drone Management Information System](https://drone.caa.gov.tw/) and the [CAA drone section](https://www.caa.gov.tw/article.aspx?a=188&lang=1) as authoritative over any explainer, including this one.** Regulations get amended faster than blogs get updated. (both in Chinese)

## Three sentences

1. **250g and above must be registered; the registration number expires in 2 years.** This is the floor for everyone, licence or not.
2. **Individuals under 2kg flying recreationally need no licence; legal entities need a professional licence at any weight.** This line determines which rulebook applies to you.
3. **The licence term is 3 years, not 2, and the student licence age is 14, not 16.** If an article still prints the old numbers, treat the rest of it with suspicion too.

## References

**Statutory text** (in Chinese)

- [Remotely Piloted Drone Management Regulations — Laws & Regulations Database](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0090083) (amended 14 November 2024)
- [Civil Aviation Act — Laws & Regulations Database](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0090001) (Chapter 9-2 is the drone chapter)

**Regulator** (in Chinese)

- [CAA — Drone section](https://www.caa.gov.tw/article.aspx?a=188&lang=1)
- [CAA — FAQ for the general public](https://www.caa.gov.tw/Article.aspx?a=3005&lang=1) (licence term, medical exam, renewal, FPV practice)
- [Drone Management Information System](https://drone.caa.gov.tw/) (registration, inspection, test booking, activity applications)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-09-taiwan-drone-supply-chain-layers)
