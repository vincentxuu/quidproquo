---
title: "Why Drone Thermal Camera Prices Jump: The Cost Steps Export Control Draws"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, payload, thermal, export-control, taiwan, supply-chain]
lang: en
tldr: "Thermal camera prices jump in steps because ECCN 6A003.b.4.b splits control on 111,000 focal-plane elements: 384×288 clears it by 408 pixels, 640×512 is three times over, nothing common sits between, and FLIR prices the Boson 640 at 2.04–2.31× the 320. The Note 3.b carve-out then limits not resolution but focal length — you may have a thermal camera, just not a telephoto one."
description: "Reading the two thresholds in ECCN 6A003.b.4.b (111,000 elements, 2 mrad IFOV) against FLIR Boson's actual pricing and the common sensor formats, to explain why drone EO/IR payload cost is a staircase rather than a curve — and using Taiwanese fire-service procurement records to establish the actual unit price of a thermal drone."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-09-drone-payload-cost-export-control)

[The supply-chain layers post](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) concluded that Taiwan's gap is at layer 3 — flight control, comms link, EO/IR payload. Flight control [got written](/posts/tech/2026-08-08-px4-vs-ardupilot-en), the link [got written](/posts/tech/2026-08-08-drone-radio-link-en), payload never moved.

The reason was that I had filed it as a "market question" — go collect quotes, build a cost table. Actually looking turned out otherwise. **Payload price is not a smooth function of performance. There's a step in the middle, and where that step sits is written into the US Commerce Control List as two specific numbers.**

This post first works out what Taiwan actually paid, then explains why that money lands at that order of magnitude.

## 1. Start with Taiwan's numbers

On 29 December 2023 the Executive Yuan approved a programme to equip municipal fire departments with unmanned rescue systems. Per the [Ministry of the Interior's release](https://www.moi.gov.tw/News_Content.aspx?n=2&s=312624) and the [National Fire Agency's implementing directions](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040131054600-1130216):

> **Funding:** the programme allocates NT$660 million from the central special tax allocation fund to purchase **88 sets of infrared thermal imaging drones and 88 disaster-response robots**.

Eighty-eight sets paired with eighty-eight robots, NT$660M total. So:

```
660,000,000 ÷ 88 = 7,500,000
```

**One thermal drone set plus one rescue robot: NT$7.5 million.**

That figure can be independently checked. [Changhua County's January 2025 demonstration](https://www.thehubnews.net/archives/472460) is explicit: four new rescue robots and four drones, "NT$30 million of advanced equipment, fully funded by the central government."

```
30,000,000 ÷ 4 = 7,500,000   ✓
```

Exact. **This is a procurement priced centrally and executed locally, case by case.**

How does that split between the drone and the robot? A second programme lets you solve it. [The Commercial Times, citing the Ministry of the Interior](https://www.ctee.com.tw/news/20240215700719-430101): a 2025–2029 resilience programme will buy **72 thermal imaging drones and 33 rescue robots for NT$460.8 million**.

Two equations, two unknowns:

```
Let D = price per thermal drone set, R = price per rescue robot

88D + 88R = 660,000,000    →  D + R = 7,500,000
72D + 33R = 460,800,000

Substituting: 72D + 33(7,500,000 − D) = 460,800,000
              39D = 213,300,000
              D ≈ 5,469,231
              R ≈ 2,030,769

Check: 72 × 5,469,231 + 33 × 2,030,769 = 460,800,000  ✓
```

**About NT$5.47M per thermal drone set, and NT$2.03M per rescue robot.**

> ⚠️ **Correction (2026-08-09): the simultaneous solve above is wrong.** Pulling the line-item records from Taiwan's government e-procurement system afterwards shows each county's budget was **NT$4M for 4 drone sets (NT$1M each) and NT$26M for 4 rescue robots (NT$6.5M each)** — the opposite direction from this solve, and off by more than fivefold. **The correct figures are D = NT$1M and R = NT$6.5M** (1M + 6.5M = 7.5M ✓). Section 8 below is recomputed accordingly. The full line-item evidence and a post-mortem on this error are in [the production-ramp post](/posts/tech/2026-08-09-drone-production-ramp-procurement-en). The lesson: **solving two aggregates simultaneously looks like derivation but is guessing; when the line-item record exists, it isn't an alternative check — it is the only thing you should use.**

(The original text is kept below for comparison.) The assumption needs stating plainly: **this assumes unit prices are identical across two programmes four years and one legal basis apart.** That may not hold, and the robot figure it produces (NT$2.03M for a remotely-driven platform with a 4,800 L/min water cannon and a five-gas detector) looks low — **that instinct was right, and I did not chase it.**

On the corrected figures, **a fire-service thermal drone set delivers at NT$1M**, about US$31,000 — roughly what a commercial inspection-grade thermal multirotor costs with spares, training and warranty.

Hold that order of magnitude; section 8 comes back to it.

## 2. The price list: same vendor, same generation, same pixel pitch

Now the component. Teledyne FLIR's Boson is one of the most common longwave infrared (LWIR) cores in drone payloads: a 12 µm pitch vanadium oxide microbolometer, available in exactly two resolutions, 320×256 and 640×512. Same product line, same generation, same pixel pitch — the cleanest comparison available.

List prices (starting, without lens or interface board) from the distributors [GroupGets](https://groupgets.com/collections/boson) and [OEMCameras](https://www.oemcameras.com/products/flir-boson-320x256-no-lens-htm):

| Model | 320×256 | 640×512 | Ratio |
|---|---|---|---|
| Boson | $1,539 | $3,558 | **2.31×** |
| Boson+ | $1,923 | $4,448 | **2.31×** |
| Radiometric Boson | $2,123 | $4,334 | **2.04×** |
| Radiometric Boson+ | $2,628 | $5,393 | **2.05×** |

And the pixel-count ratio:

```
640 × 512 = 327,680
320 × 256 =  81,920
327,680 ÷ 81,920 = 4.00
```

**Four times the pixels, a bit over twice the price.** All four matched pairs land between 2.04 and 2.31 — very consistent. That's ordinary silicon scaling: quadruple the area and price rises slower than area, because of yield and wafer utilisation.

Up to here everything is smooth. Price is a sublinear function of performance, as intuition expects.

**But those two cores are not in the same box on the US control list.**

## 3. The step: 111,000

Open the Commerce Control List entry for ECCN 6A003 in the [Export Administration Regulations](https://www.federalregister.gov/documents/2024/02/23/2024-03661/revision-of-license-requirements-of-certain-cameras-systems-or-related-components) and read the reasons-for-control table:

> RS applies to 6A003.b.3, 6A003.b.4.a, 6A003.b.4.c and to items controlled in 6A003.b.4.b that have **a frame rate greater than 60 Hz** or that incorporate **a focal plane array with more than 111,000 elements**, or to items in 6A003.b.4.b when being exported or reexported to be embedded in a civil product. — **RS Column 1**
>
> RS applies to items controlled in 6A003.b.4.b that have a frame rate of 60 Hz or less and that incorporate a focal plane array with **not more than 111,000 elements** if not being exported or reexported to be embedded in a civil product. — **RS Column 2**

Same ECCN, same class of device, and the Regional Stability control level splits on two numbers: **60 Hz frame rate, and 111,000 focal plane array elements.**

Lay out the common thermal sensor formats and see where that line falls:

| Format | Elements | vs 111,000 |
|---|---|---|
| 160×120 | 19,200 | under |
| 256×192 | 49,152 | under |
| 320×256 | 81,920 | under |
| **384×288** | **110,592** | **under, by 408** |
| 640×480 | 307,200 | 2.8× over |
| 640×512 | 327,680 | 3.0× over |
| 1280×1024 | 1,310,720 | 11.8× over |

**384×288 = 110,592. That is 408 pixels below the threshold — 0.37%.**

The next rung up is 640×480 = 307,200. **Between 110,592 and 307,200 there is no common thermal format.** FLIR's Boson is exactly this: 320×256 and 640×512, with nothing in between.

So the threshold isn't drawn on a rung of the product ladder. It's drawn in the **gap** — clearing the rung below by 0.37% and sitting three times under the rung above.

I don't know whether the threshold accommodated the existing formats or the formats accommodated the threshold, and this post doesn't speculate about causation. But the consequence is unambiguous: **you cannot step across this line by de-rating slightly. You pick the 320 class or the 640 class, and on the control list those are two different worlds.**

Look back at the price table in section 2. That 2.31× gap reads, in a catalogue, as merely "the more expensive model." What you're actually buying is four times the pixels **and a different export-control treatment**.

## 4. There's a second threshold, and it governs the lens

Section 3 was about control *level*. What takes a thermal camera out of 6A003.b.4.b altogether is Note 3:

> **Note 3:** 6A003.b.4.b does not control imaging cameras having any of the following:
> a. A maximum frame rate equal to or less than 9 Hz;
> b. Having all of the following:
> 　1. Having a minimum horizontal or vertical `Instantaneous-Field-of-View (IFOV)' of at least **2 mrad** (milliradians);
> 　2. Incorporating a **fixed focal-length lens that is not designed to be removed**;
> 　3. **Not** incorporating a `direct view' display; and
> 　4. Having any of the following:
> 　　a. No facility to obtain a viewable image of the detected field-of-view; or
> 　　b. The camera is designed for a single kind of application and designed not to be user modified;

Note 3.b requires all four. The first one settles everything. The text supplies its own definition of IFOV:

> `Horizontal IFOV' = horizontal Field-of-View (FOV) / number of horizontal detector elements

**IFOV is field of view divided by pixel count — the angle one pixel subtends.** At a fixed pixel pitch, that quantity is determined by focal length and nothing else.

Substituting Boson's specs:

```
pixel pitch p = 12 µm
IFOV ≈ p / f            (f = focal length)

For IFOV ≥ 2 mrad:
  f ≤ 12 µm / 0.002 = 6 mm

Using the regulation's own FOV/N definition (accounting for the tangent) on 640×512:
  sensor width = 640 × 12 µm = 7.68 mm
  required HFOV ≥ 640 × 2 mrad = 1.28 rad = 73.3°
  2·atan(3.84 / f) = 1.28 rad  →  f ≈ 5.2 mm
```

**A 640×512, 12 µm thermal camera keeps this carve-out only if its horizontal field of view is about 73 degrees wide.**

FLIR's catalogue Boson 640 telephoto option is 13.5° horizontal (a 32 mm lens):

```
IFOV = 13.5° ÷ 640 = 0.2356 rad ÷ 640 = 0.368 mrad
```

**One fifth of the threshold.** Nowhere near.

Now convert 2 mrad into something on the ground. One pixel covers `0.002 × R` metres at range R:

| Range | One pixel covers | Pixels on a 1.7 m person |
|---|---|---|
| 100 m | 0.2 m | 8.5 |
| 300 m | 0.6 m | 2.8 |
| 500 m | 1.0 m | 1.7 |

Applying the conventional Johnson-criteria rule of thumb (roughly 2 pixels across the target's critical dimension to detect, 8 to recognise, 13 to identify, with a standing human's critical dimension taken as about 0.75 m — an industry heuristic, not a specification), at the 2 mrad line:

```
detect    (2 px):  0.002R = 0.375  →  R ≈ 190 m
recognise (8 px):  0.002R = 0.094  →  R ≈  47 m
identify (13 px):  0.002R = 0.058  →  R ≈  29 m
```

**At the edge of the carve-out, you can recognise that something is a person from about forty-odd metres.** Typical drone inspection and search-and-rescue working altitude is around a hundred.

So the practical meaning of Note 3.b is this:

> **It doesn't limit resolution. It limits focal length. You may have a thermal camera; you may not have a telephoto one.**

Add sub-paragraph 2 — the lens must be fixed focal length **and designed not to be removed** — and the logic closes: not only no telephoto now, but no fitting a longer lens later. What's being controlled is the ability to identify a specific target from a distance, which is more or less the definition of a reconnaissance payload.

This is a literal reading of the text, not export-control legal advice. Actual classification goes through BIS (a CCATS request), and sub-paragraph 4's "single kind of application, not user modified" conditions are ultimately determined by the agency.

## 5. 9 Hz: a product SKU that exists because of a clause

Note 3.a is shorter: a maximum frame rate of 9 Hz or less takes the camera out of 6A003.b.4.b entirely.

You can see the effect in the catalogue. FLIR's own [Boson comparison table](https://oem.flir.com/products/boson?vertical=lwir&segment=oem):

| | Boson | Boson+ |
|---|---|---|
| Frame Rate | **60 Hz & 9 Hz** | 60 Hz default; 30 Hz runtime selectable |

**There is no engineering reason for a 9 Hz option to exist.** A microbolometer's thermal time constant is on the order of 10 ms, so 60 Hz presents no physical obstacle, and a slower readout isn't cheaper. The only reason it exists is that line of Note 3.a.

This is another instance of the observation from [the RC-link post](/posts/tech/2026-08-08-drone-radio-link-en): **a regulation turning into a constant with units — in code, or here in a catalogue — is the most concrete form compliance takes.** There it was ExpressLRS encoding EN 300 328's thresholds as dBm constants. Here it's a SKU.

Incidentally, Boson+ has no 9 Hz option, only 60/30 Hz. The same company's newer line abandoned that carve-out path.

## 6. The 2024 relaxation, and the reason BIS gave for it

The text quoted above is current, and it was amended recently. BIS's [final rule](https://www.federalregister.gov/documents/2024/02/23/2024-03661/revision-of-license-requirements-of-certain-cameras-systems-or-related-components) (published 23 February 2024, effective 8 March 2024) changed §744.9's military-end-user clause:

| | Before | After |
|---|---|---|
| §744.9(a)(1)(ii) licence required for | all destinations except **Canada** | all destinations except those in **Country Group A:1** |

And the reason BIS wrote into the rule is remarkably direct, worth quoting in full:

> As stated above, the items controlled by § 744.9 have become mainstream commercial products. … BIS also notes the increased commercial availability of the items listed in § 744.9. … **These items are now manufactured and widely available outside the United States, including in China.** The combined impact of the expanded controls and growing global manufacturing of the items has resulted in **restricted exports of U.S.-origin products and increased competition from non-U.S.-origin products.** … This rule ensures that U.S. companies are operating on a level playing field with foreign competitors when selling to end users in County Group A:1 countries.

**The regulator itself concedes that the practical effect of the control was to hand business to non-US suppliers, China included.** That's the same policy lever [the industry-map post](/posts/tech/2026-08-06-drone-industry-map-en) described, seen from the other side: a control is both a barrier and a cost, and costs route around.

BIS's other stated reason is worth keeping too. The 2009 gate existed to give BIS "visibility into their use by military end users," and over the following decade BIS "has approved thousands of license applications for these items to Country Group A:1 countries," with an "absence of denials." **A review that approves essentially everything puts all its cost into process and produces almost no information.**

## 7. Is Taiwan in A:1? No

So who is A:1? Footnote 1 to the EAR's [Country Groups table](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/appendix-Supplement%20No.%201%20to%20Part%20740) is explicit:

> Country Group A:1 is a list of the **Wassenaar Arrangement Participating States**, except for Malta, Russia and Ukraine.

**A:1 is the Wassenaar Arrangement participating states. Taiwan is not a Wassenaar participant.**

In that same table, Taiwan's row carries an X only in the final column, A:6; A:1 through A:5 are blank. Japan, South Korea, most EU members and Türkiye are all in A:1. Taiwan and Singapore are not.

(Taiwan is not without preferential treatment elsewhere: §740.11's License Exception GOV names "the national governments of countries listed in Country Group A:1 **and the national governments of Singapore and Taiwan**" as cooperating governments. Taiwan is singled out by name in other clauses — just not in this box.)

Joining that to the previous section:

> **The 2024 relaxation moved §744.9's military-end-user licence requirement from "everywhere except Canada" to "everywhere except Wassenaar members." Taiwan was on the licence-required side before and after.**

The scope needs stating precisely: §744.9 is an **end-user** clause, triggered when the exporter knows or is informed that the item is intended for a "military end-user." It does not affect a fire department buying thermal drones, nor ordinary inspection or agricultural spraying. It affects Taiwan's military-grade-commercial-spec programmes, NCSIST-related contracts, and any procurement whose buyer falls inside that definition — **which happens to be the fastest-growing part of Taiwan's output.**

### Addendum (2026-08-09): the RS columns are now verified, and the answer is blunter than expected

The first draft of this post said Taiwan's RS Column 1 / Column 2 status was unverified. I subsequently retrieved [the Commerce Country Chart](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-738/appendix-Supplement%20No.%201%20to%20Part%20738) (Supplement No. 1 to 15 CFR Part 738) and read Taiwan's row column by column:

| | CB1 | CB2 | CB3 | NP1 | NP2 | NS1 | NS2 | MT1 | **RS1** | **RS2** | FC1 | CC1 | CC2 | CC3 | AT1 | AT2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Taiwan** | X | X | X | X | | X | X | X | **X** | **X** | | X | | X | | |
| Japan | X | | | | | X | | X | **X** | | | | | | | |

(The column alignment can be checked against Canada's row, which carries exactly two X's — CB1 and FC1 — matching the well-known position.)

**Taiwan is checked in both RS Column 1 and Column 2. Japan is checked in Column 1 only.**

The consequence is concrete:

> **For Japan (and other Wassenaar members), the 111,000 line is a genuine gate — below it the item falls to RS Column 2 and needs no licence; above it, Column 1 applies and it does.**
> **For Taiwan, both columns are checked, so the line changes nothing about whether a licence is required — it is required either way.**

In other words, the number that shapes the entire thermal product ladder **draws no line at all around Taiwan's access**. It still determines price (the table in section 2) and still determines what products exist (section 3), but it does not determine whether you file for a licence.

Incidentally, footnote 7 to the same chart is written specifically for India: "Note that a license is still required for items controlled under ECCNs 6A003.b.4.b and 9A515.e for RS column 2 reasons when destined to India." India's Column 2 cell is blank, so the footnote reinstates 6A003.b.4.b separately. **The existence of that footnote confirms the reading of the column semantics above.**

## 8. Joining the ends: a 2% part decides 100% of the deal

Back to section 1. Per the line-item procurement record, a fire-service infrared thermal drone set is budgeted and awarded at **NT$1 million** (identical across counties), with NT$7.5M being the central paired price for a set plus a robot.

A FLIR Boson 640 core lists from US$3,558 — about NT$114,000.

```
113,856 ÷ 1,000,000 ≈ 11.4%
```

**The thermal core is about eleven percent of the delivered price of the set.**

The other eighty-nine percent is airframe, gimbal, visible camera, controller, batteries, ground station, training, warranty, systems integration, acceptance testing, and the tender margin. That's normal — [the financials post](/posts/investing/2026-08-07-drone-maker-financials-en) worked through the margin structure of Taiwanese integrators, and this ratio is no surprise.

**But what decides whether the whole set can be sold is that eleven percent.**

That core's resolution decides which side of 111,000 it falls on. Its lens focal length decides whether Note 3.b's carve-out holds. The buyer's identity decides whether §744.9 requires a licence. Fail any one of those and the remaining ninety-eight percent — capacity, supply chain, certifications, the whole bid document — is unusable.

This is what [the supply-chain post's](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) layer 3 looks like on a cost sheet: **it isn't expensive per unit; it's expensive because it's a gate.** A component worth two percent of the bill of materials holds a veto over the entire contract. Taiwan's "roughly 70% domestic content on small drones, 30% on large" gap isn't about the weight of that 70% — it's about whether the remaining 30% contains a gate.

## 9. Other payloads have differently-shaped costs

This whole post is about thermal, because its cost step is the clearest and the most checkable. But layer 3 isn't only thermal, and the other payload types have completely different cost drivers. A Ministry of Economic Affairs study prepared by the Metal Industries Research and Development Centre, [*Drone Optical Measurement Payloads: Applications and Development Trends*](https://service.moea.gov.tw/EE514/wSite/public/Attachment/00104/f1739253609792.pdf), compiles a comparison; in summary:

| Payload | Main cost driver | Typical detection range |
|---|---|---|
| Electro-optical (EO) | Lens and stabilisation; sensors are commoditised | 50 m – 5 km (focal-length dependent) |
| LWIR (longwave IR) | **Focal plane array** (this post's subject) | 50 m – 3 km |
| MWIR (midwave IR) | **Cryogenic cooler** (Stirling cooler) | 500 m – 15 km |
| LiDAR | Laser source, scanning mechanism, weight and power | 50 m – 5 km |
| Multispectral | Filter sets; relatively low cost | 20 m – 500 m (3–12 bands) |
| Hyperspectral | Dispersive optics and data processing | 50 m – 2 km (100–300 narrow bands) |

Note the **MWIR row in particular: its cost is not in the sensor, it's in the cooler.** Midwave infrared has to operate below 80 K, which means a Stirling cooler — adding 500 g to 2 kg, consuming substantial power, and being a **mechanical** part with a finite service life rather than an electronic one. So MWIR's cost step is a mechanical-reliability problem, not the silicon-area problem LWIR has.

That also explains why fire services use LWIR: what a fire ground needs is body and structure temperatures (−40 °C to 200 °C), and LWIR is uncooled, compact and cheap. MWIR's 150 °C to 3,000 °C range is for high-temperature industrial and military work.

Hyperspectral is a third story again: short detection range (fly low), expensive equipment, complex processing — cost in the back end rather than the front. **Four things called "payload," four entirely different cost physics.** That deserves its own post; this one doesn't open it.

## 10. So what should a buyer ask?

No legal advice — only things you can check or ask yourself:

1. **Ask for the sensor format, not the "thermal resolution."** Both 384×288 and 640×512 read as "high-resolution thermal" in a catalogue, but one is 110,592 elements and the other is 327,680. The difference isn't only image quality.
2. **Ask for the horizontal field of view, and whether the lens is removable.** That's sharper than asking about zoom. IFOV = HFOV ÷ horizontal pixel count, which you can compute yourself, and it decides whether you can recognise a person from a hundred metres up.
3. **Ask whether the frame rate is 9 Hz.** If a quotation says 9 Hz, that is probably not an engineering choice.
4. **Ask how the end user will be declared.** §744.9 is an end-user clause; the same core sold to a fire department and to a defence programme travels different paths. Settle this before the bid, not before delivery.
5. **Ask about second sources.** That's this post's policy conclusion: a component worth two percent of the BOM holding a veto means it is a single point. Whether Taiwan has an alternative matters more than how much cheaper one is.

## What this post does not answer

- ~~**Taiwan's RS Column 1 / Column 2 status is not verified.**~~ **Now filled**: see the addendum at the end of section 7 — Taiwan is checked in both columns, so the 111,000 line does not change whether a licence is required for Taiwan.
- **I have never filed a classification request.** A literal reading of the text is not a BIS determination. How Note 3.b's "single kind of application, designed not to be user modified" conditions get assessed in practice is known only to people who have been through CCATS.
- **Thermal core prices are distributor list prices, not volume OEM prices.** GroupGets and OEMCameras starting prices reflect small-quantity buying. An integrator's real cost is lower — but the **ratios** across the four matched pairs (2.04–2.31×) should be more robust than the absolute figures.
- ~~**The NT$5.47M figure carries an assumption.**~~ **Corrected**: the line-item procurement record shows NT$1M per drone set and NT$6.5M per robot; the simultaneous solve was reversed and off by fivefold. See the correction box in section 1 and [the production-ramp post](/posts/tech/2026-08-09-drone-production-ramp-procurement-en).
- **Nothing on the EU or Japanese equivalents.** The Wassenaar list is multilateral and members transpose it into national law separately. The EU's dual-use list (Regulation 2021/821) has a corresponding entry, but the wording and the carve-out details need not match. A three-way comparison deserves its own post.
- **No assessment of domestic Taiwanese thermal progress.** The Thermal Imaging Industry Alliance (TIIA), Innolux's far-infrared thermal imager, and Crystalwise Optronics' thermal chip work with NCSIST are things I have only seen in press coverage, with no verifiable specifications or production status. That is the line most worth chasing in this cell for Taiwan, but I don't yet have the material.

---

## References

**Primary: US export control**

- [15 CFR Part 738, Supplement No. 1: Commerce Country Chart — eCFR](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-738/appendix-Supplement%20No.%201%20to%20Part%20738) (Taiwan is checked in both RS Column 1 and Column 2; Japan in Column 1 only; footnote 7 reinstates the RS Column 2 requirement for 6A003.b.4.b to India)

- [Revision of License Requirements of Certain Cameras, Systems, or Related Components — Federal Register, 89 FR 13590 (published 2024-02-23, effective 2024-03-08)](https://www.federalregister.gov/documents/2024/02/23/2024-03661/revision-of-license-requirements-of-certain-cameras-systems-or-related-components) (the full ECCN 6A003 text and reasons-for-control table: RS Column 1 vs Column 2 splitting on 60 Hz and 111,000 focal plane array elements; Note 3's carve-outs including 9 Hz and 2 mrad IFOV, with the technical note defining IFOV = FOV ÷ number of detector elements; §744.9(a)(1)(ii) changing from "except Canada" to "except Country Group A:1"; BIS's stated rationale, including "now manufactured and widely available outside the United States, including in China" and "increased competition from non-U.S.-origin products")
- [15 CFR Part 740, Supplement No. 1: Country Groups — eCFR](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/appendix-Supplement%20No.%201%20to%20Part%20740) (footnote 1: A:1 is the Wassenaar participating states less Malta, Russia and Ukraine; Taiwan appears in A:6, not A:1)
- [15 CFR 743.3, Thermal imaging camera reporting — eCFR](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-743/section-743.3) (exports of more than 100 cameras controlled by 6A003.b.4.b to Country Group A:1 must be reported to BIS)

**Primary: Taiwanese procurement**

- [Implementing directions for the fire-service unmanned rescue equipment funding programme (16 February 2024)](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040040131054600-1130216) (point 2: NT$660M for 88 infrared thermal imaging drone sets and 88 rescue robots; point 3: required capabilities and "give priority to domestically manufactured" thermal drone sets)
- [Ministry of the Interior press release: Executive Yuan approves NT$660M for rescue drones and robots](https://www.moi.gov.tw/News_Content.aspx?n=2&s=312624)
- [Commercial Times: Executive Yuan approves over NT$600M to help local governments buy drones](https://www.ctee.com.tw/news/20240215700719-430101) (the 2025–2029 resilience programme: 72 thermal imaging drones and 33 rescue robots for NT$460.8M; 261 drones and 34 rescue robots in service nationally at the time)
- [TheHubNews: Changhua County smart firefighting](https://www.thehubnews.net/archives/472460) (four rescue robots and four drones, NT$30M, fully centrally funded — used here to cross-check the NT$7.5M per pair figure)

**Primary: government-commissioned study**

- [Drone Optical Measurement Payloads: Applications and Development Trends — Ministry of Economic Affairs (Metal Industries Research and Development Centre, September 2024)](https://service.moea.gov.tw/EE514/wSite/public/Attachment/00104/f1739253609792.pdf) (principles, advantages, detection ranges and application matrix for EO / MWIR / LWIR / laser / LiDAR / multispectral / hyperspectral; the cooled-versus-uncooled cost distinction between MWIR and LWIR)

**Product specifications and pricing**

- [Teledyne FLIR Boson product page](https://oem.flir.com/products/boson?vertical=lwir&segment=oem) (12 µm pixel pitch, 320×256 and 640×512 only, Frame Rate row reading "60 Hz & 9 Hz")
- [Teledyne FLIR Boson+ product page](https://oem.flir.com/products/boson-plus?vertical=lwir&segment=oem) (model table including Boson Plus 640 at 13.5° HFOV / 32 mm and 320 at 92° HFOV / 2.3 mm)
- [GroupGets — Teledyne FLIR Boson series list prices](https://groupgets.com/collections/boson) (source of the four 320/640 starting-price pairs used here)
- [OEMCameras — FLIR Boson 320×256 Lensless](https://www.oemcameras.com/products/flir-boson-320x256-no-lens-htm) (Consumer / Professional / Industrial NEDT grade pricing)

**On this site**

- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [Hopping Is Not Encryption: Reading the ExpressLRS Source, and Finding That Taiwan's Rules Turn Channel Count Into a Power Ceiling](/posts/tech/2026-08-08-drone-radio-link-en)
- [What Is the Margin on a Government Contract, Really: The Filings Answered What I Assumed Needed Interviews](/posts/investing/2026-08-07-drone-maker-financials-en)
- [How to Read a Drone Spec Sheet: Which Lines the Regulations Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
