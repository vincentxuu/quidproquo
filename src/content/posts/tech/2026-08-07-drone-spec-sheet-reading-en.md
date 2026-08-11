---
title: "How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries"
date: 2026-08-07
type: deep-dive
category: tech
tags: [drone, taiwan, uav, hardware, regulation]
lang: en
tldr: "The three most important lines on a drone spec sheet are exactly the three lines spec sheets don't print. Taiwan's Drone Cybersecurity Testing Specification defines a product 'series' as units whose flight control, communications, and satellite positioning chip modules are all identical — regulation decides whether two drones are the same drone by those three modules, not by looks or endurance. And the weight field isn't a marketing number either: 250 g, 1 kg, 2 kg, 15 kg, and 25 kg are five separate legal thresholds."
description: "Mapping every line of a drone spec sheet onto supply chain layers and regulatory thresholds: which fields are legal boundaries, which reveal supply chain provenance, and which critical facts the spec sheet omits but public registries answer. A reading method from someone who has never flown one."
draft: false
series:
  name: "Drone Teardown"
  order: 23
---

> 🌏 [中文版](/posts/tech/2026-08-07-drone-spec-sheet-reading)

**Boundary first: I have never flown a drone, and this piece recommends no models.**

It does something else — maps every line of a spec sheet onto [the industry map's](/posts/tech/2026-08-06-drone-industry-map-en) five layers and Taiwan's regulatory thresholds, then asks a question unboxing posts don't: **what is this line actually telling you?**

The conclusion up front: most spec sheet fields are marketing fields. The ones that actually determine what a drone is fall into three classes — legal boundary fields, supply chain provenance fields, and **fields the spec sheet omits but that are public elsewhere**.

## Weight isn't a spec, it's a classification

The first line is usually weight. It looks like a parameter. In Taiwan it is five legal thresholds.

Per the [Regulations Governing Remotely Piloted Aircraft](https://law.moj.gov.tw/lawclass/LawAll.aspx?pcode=K0090083):

| Threshold | What it triggers | Article |
|---|---|---|
| **250 g** | Individually owned units must be registered with the CAA, with the registration number marked conspicuously on the airframe | Art. 6 |
| **1 kg** (with navigation equipment) | Must carry a geofencing map software system | Art. 12 |
| **2 kg** (with navigation equipment) | Operator must hold a licence; public sale requires type inspection | Arts. 19, 13 |
| **15 kg** | Individually owned units require a licensed operator regardless of navigation equipment; also the ceiling for a general licence | Arts. 19, 20 |
| **25 kg** | The owner must additionally apply for **physical inspection**; the certificate is valid three years | Art. 15 |

Note these thresholds are different in kind. 250 g is a **registration** duty, 2 kg is a qualification on the **person**, 25 kg is a second round of inspection on the **machine**. When a manufacturer pins maximum takeoff weight at 249 g or 1.99 kg, it isn't chasing lightness — it's removing a procedural step for the buyer. **That is the most common regulation-driven design decision visible on a spec sheet.**

One provision that only took effect in 2026 is easy to miss: Article 12(2) requires that drones **registered from ROC year 115 (2026) onward** with navigation equipment carry geofencing map data covering not only prohibited zones, restricted zones, and airport surroundings but also **zones prohibited or restricted by municipal and county governments**. The same model registered in 2025 and in 2026 faces different map requirements. "Supports geofencing" on a spec sheet does not answer this.

## How regulation decides two drones are the same drone

This was the most surprising thing I found.

The [Drone Cybersecurity Testing Specification](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf), issued by the Ministry of Digital Affairs jointly with the Ministry of Transportation and Communications, defines a product "series" — units that may reuse a test result — as follows:

> Units meeting the series definition in the CAA's "Application Guide and Inspection Procedures for Remotely Piloted Aircraft with Maximum Takeoff Weight of 2 to 25 kg," and whose **flight control, communications, and satellite positioning chip modules are all identical**.

**Regulation decides whether two drones are the same drone by looking at flight control, communications, and satellite positioning.** Not appearance, not weight, not endurance, not camera resolution.

That sentence is worth sitting with, because it coincides exactly with Layer 3 of [the industry map](/posts/tech/2026-08-06-drone-industry-map-en), and exactly with what Taiwan's industrial policy bet on — "three chips, two software" (flight control, communications, and satellite positioning chip modules, plus flight control and ground control software). The regulator, the industrial policy, and supply chain analysis each started somewhere different and pointed at the same place.

Which gives you the reading method: **find those three lines first.** If you can't, that means the three most important decisions about this machine are ones the manufacturer isn't telling you.

And usually you can't. Consumer spec sheets say "20 km transmission range," not whose transmission chipset; they say "GPS / GLONASS / Galileo supported," not the positioning module part number; the flight controller is almost always just a proprietary name.

## Three classes of field

Reclassified, a spec sheet looks like this:

**Class one: legal boundary fields** — maximum takeoff weight, presence of navigation equipment, remote ID capability, geofencing map system. These determine which procedural track you're on, and misreading them carries administrative liability.

**Class two: supply chain provenance fields** — flight controller, communications link, satellite positioning, electro-optical payload, battery module. These correspond to [Layers 2 and 3](/posts/tech/2026-08-06-drone-industry-map-en) and set the machine's capability ceiling and repairability. [The Taiwan supply chain piece](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) unpacked Thunder Tiger's published bill of materials: motors, batteries, frames, and propellers made in-house; flight control, comms/GPS, and camera modules bought in — **Layer 2 domestic, Layer 3 imported, a split visible in an airframe maker's own filings**.

**Class three: silent fields** — whether firmware is modifiable, where data is uploaded, how long spare parts are supported, whether it passed cybersecurity testing. Spec sheets almost never carry these, but some are answerable from public registries (next section).

Interestingly, this classification closely tracks how the CAA's own exam question bank frames Chapter 2. The bank asks which system handles command, control, and data link work; what method control links have universally adopted for confidentiality and jamming resistance; what the main data transmission modes for video downlink are — **the system boundaries the regulator expects an operator to understand are the same set of fields a spec sheet reader should look for.** [The question bank piece](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en) develops this.

## Not on the spec sheet, but on the record

Taiwan maintains three public registries that fill in some silent fields:

- **[The register of drones over 2 kg that have passed type inspection or recognition](https://drone.caa.gov.tw/Default/DataDetail3/10220)** (CAA, updated periodically). Whether a model is legally eligible for public sale in Taiwan is answered directly here.
- **The cybersecurity testing pass list** (CAA's drone management information system). The Telecom Technology Center separately publishes a [vendor-consented pass list](https://www.ttc.org.tw/Service/info_1?id=990ca9aa29494d9fafe150a19c7afe10).
- **Type inspection certificate numbers**, formatted `CAA-UAVTIC-XXXXXXXX`. These appear on formal documents — in [the TTSB report on the Tamsui estuary crash](/posts/tech/2026-08-07-drone-crash-anatomy-en), the accident aircraft's certificate number, issue and expiry dates, airframe serial, motor model and serial, and manufacture date are all recorded. **A spec sheet gives you marketing language; an accident report gives you an identity document.**

Inspection requirements are themselves tiered, per the CAA's [inspection FAQ](https://www.caa.gov.tw/Article.aspx?a=2427&lang=1):

```
Under 2 kg, or no navigation equipment  → exempt (product information registration only)
Under 25 kg (with navigation)           → type inspection
25 kg and above (with navigation)       → type + physical + special physical inspection
```

Personal imports get an allowance too: within 12 months of first customs release, up to 5 units in the 2–15 kg band and 2 units in the 15–25 kg band are exempt from inspection or recognition.

## What cybersecurity testing actually covers

Since "passed cybersecurity testing" is a checkable field, it's worth knowing its scope. Per the Drone Cybersecurity Testing Specification (Ministry of Digital Affairs jointly with MOTC; V1.0 issued 26 December 2024, with **V2.0 in force since 30 April 2026**), testing covers four areas — **system security, software security, communications security, and firmware security** — across the aircraft itself, the ground control station, and any network-capable payload. Swarm systems get their own chapter covering vulnerability scanning, transmission encryption, sensitive information protection, passcode protection, web application security, and authorization and authentication mechanisms.

The practical significance for spec sheet reading: **"passed cybersecurity testing" is not a marketing phrase — it has specific chapters and test items**, and when government agencies, schools, or juridical persons procure drones with navigation equipment, Articles 31 and 32 make a compliance report **mandatory**.

It is also the first rung of the certification ladder described in [the market entry piece](/posts/career/2026-08-06-drone-market-entry-mechanics-en): cybersecurity testing → Green UAS → Blue UAS Cleared.

## How far this gets someone who has never flown

Honestly, this reading method has a hard ceiling.

**It answers**: which regulatory band the machine falls in, which procedural track applies, who made the key modules (where discoverable), whether it passed inspection and cybersecurity testing, which supply chain layer it belongs to.

**It does not answer**: how the machine actually handles, whether wind resistance matches the spec, firmware update cadence and quality, whether after-sales support and spares are any good, how the vendor behaves when something goes wrong. **Only people who have flown it, repaired it, and argued with the manufacturer know those.**

So the positioning is clear: this is the **first filter** in choosing a machine, not the last. Use public data to eliminate the non-compliant, the module-opaque, and the uninspected — what survives still has to be flown.

## Three judgments

1. **The weight field reads as regulation, not performance.** The difference between 249 g and 251 g isn't flight behavior, it's whether you register. Manufacturers' weight design is regulatory arbitrage; seeing that keeps "light and portable" from steering you.
2. **Regulation has already marked the important lines for you.** The cybersecurity specification defines a series by "identical flight control, communications, and satellite positioning modules" — those three lines are the point of a spec sheet, and spec sheets usually omit them. Absence is itself an answer.
3. **Public registries cover some of the silent fields.** The type inspection register, the cybersecurity pass list, and certificate numbers are free and authoritative. Checking before buying costs ten minutes.

## References

**Regulation (primary)**

- [Regulations Governing Remotely Piloted Aircraft — Laws & Regulations Database](https://law.moj.gov.tw/lawclass/LawAll.aspx?pcode=K0090083) (in Chinese; Arts. 6, 10, 12, 13, 15, 19, 20 — registration, geofencing, inspection, licence thresholds)
- [Drone Cybersecurity Testing Specification — Executive Yuan Gazette](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (in Chinese; series definition, four testing areas, swarm chapter)
- [CAA — Article 99-11, Inspection](https://www.caa.gov.tw/Article.aspx?a=2427&lang=1) (in Chinese; inspection tier table, personal import allowance, standards referencing ASTM and JARUS)
- [CAA — General public FAQ](https://www.caa.gov.tw/Article.aspx?a=3005&lang=1) (in Chinese; registration, product listing, FPV rules)

**Public registries**

- [CAA — Register of drones over 2 kg that passed type inspection or recognition](https://drone.caa.gov.tw/Default/DataDetail3/10220) (in Chinese)
- [Telecom Technology Center — Drone cybersecurity testing services and pass list](https://www.ttc.org.tw/Service/info_1?id=990ca9aa29494d9fafe150a19c7afe10) (in Chinese; joint verification laboratory, Drone Cybersecurity Assurance Specification v2.0)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [Taking Apart Two TTSB Crash Reports: Neither Was the Operator's Fault](/posts/tech/2026-08-07-drone-crash-anatomy-en)
- [The CAA Published the Entire Question Bank: What Four Exam Subjects Reveal About the Regulator](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en)
- [Four Gates into Taiwan's Drone Industry](/posts/career/2026-08-06-drone-market-entry-mechanics-en)

> **Update, 2026-08-08**: I later read the whole specification and wrote it up in [the cybersecurity spec breakdown](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en). Two corrections and additions: first, the version in force is V2.0 (effective 2026-04-30); December 2024 above was V1.0. Second, **the "passed cybersecurity testing" field does not tell you which tests were run** — the five items that actually test jamming, link loss and position spoofing all sit in Chapter 8, and Chapter 8 is optional. That post covers what to ask and how.
