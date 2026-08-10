---
title: "From 40 Minutes to 6 Hours: It's the Airframe, Not the Battery"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, airframe, vtol, fuel-cell, taiwan]
lang: en
tldr: "The previous post computed hover and left a line saying fixed-wing power structure is completely different. Working it out, the gap is large: the same 5 kg aircraft with the same 2 kg pack needs 512 W to hover for 41 minutes as a multirotor, or 128 W to cruise for 164 minutes and 197 km as a fixed wing. And fixed-wing range is independent of cruise speed — speed cancels out of the equation, the second result in this series after the 2/3 battery optimum where every parameter disappears. A VTOL's cost is not the energy burned in transition (2.4%) but that it must carry both a rotor system and a wing, and the extra structure eats about a quarter of the range. A single-rotor helicopter beats a multirotor on disk area alone: at 25 kg with the same 8 kg battery, a quad on 24-inch propellers flies 22 minutes while a 2.5 m single rotor flies 45. Taiwan builds something at every rung of that ladder, from 40-minute electric multirotors up to a 6-hour piston helicopter."
description: "Following the endurance post, computing the three configurations beyond hover: the fixed-wing cruise power equation and why range is independent of speed, the VTOL mass penalty, and the disk-loading advantage of a single large rotor — plus Taiwan's full endurance ladder from electric multirotor through helicopter, tiltrotor and fuel cell to internal combustion, with a domestic aircraft at each rung."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-08-drone-airframe-configurations)

The [previous post](/posts/tech/2026-08-08-drone-endurance-physics-en) computed multirotor hover endurance and closed with a debt:

> **No forward flight.** Everything above is hover. Fixed-wing and VTOL aircraft generate lift from a wing in cruise, with a completely different power structure and endurance running to hours — that belongs to another post (the airframe-configuration cell).

This pays it. And the Taiwanese half turned out richer than I expected.

## 1. Two completely different power laws

A hovering multirotor generates all of its lift by pushing air:

```
P_hover = (m·g)^1.5 / sqrt(2·ρ·A) / (FM · η)
```

A fixed wing in level flight gets lift from the wing, so thrust only has to overcome drag — and drag equals weight divided by the lift-to-drag ratio:

```
P_cruise = (m·g / (L/D)) · v / (η_prop · η_elec)
```

**The first goes as mass to the 1.5, the second as mass to the first power.** And the second carries an extra divisor: L/D, which for small unmanned aircraft runs roughly 8 to 16.

Same 5 kg aircraft, same 2 kg pack (206 Wh/kg pack, 85% usable, 350 Wh):

| Configuration | Condition | Power | Endurance | Range |
|---|---|---|---|---|
| Multirotor | hover, 17-inch props | **512 W** | 41 min | 0 (station keeping) |
| Multirotor | 15 m/s forward | about the same | ~41 min | ~37 km |
| Fixed wing | L/D 8, 20 m/s | 192 W | 109 min | 131 km |
| Fixed wing | L/D 12, 20 m/s | **128 W** | 164 min | 197 km |
| Fixed wing | L/D 16, 20 m/s | 96 W | 218 min | 262 km |

**Four times the power, four times the endurance, five times the range.** Same weight, same battery.

This is not "fixed wings are better." The two are **doing different things**. What the multirotor buys with that 512 W is *staying on this spot*, which the fixed wing simply cannot do.

## 2. Fixed-wing range does not depend on how fast you fly

There is something easy to miss in that table: at L/D 8, whether you fly 15, 20 or 25 m/s, **the range is 131 km**.

Not a coincidence. Expand it:

```
range = speed × time = v × E / P
      = v × E / [ (m·g/(L/D)) · v / η ]
      = E · (L/D) · η / (m·g)
```

**The speed `v` cancels.** Fly faster and power rises proportionally while time falls proportionally; the two offset exactly.

This is the second result in this series, after the [2/3 battery optimum](/posts/tech/2026-08-08-drone-endurance-physics-en), where **every parameter cancels out**. An electric fixed wing's range depends on exactly four things: how much energy it carries, how good its L/D is, how efficient its propulsion is, and how heavy it is. **How fast you fly does not affect how far you can go.**

(The honest caveat: real L/D varies with speed and peaks somewhere, falling off if you fly too slow or too fast. So in practice there is still a best cruise speed. But within the range where L/D is roughly flat, "flying faster saves time, not energy" holds.)

## 3. A VTOL's cost is not the transition, it is carrying two systems

A VTOL wants both: vertical takeoff with no runway, and fixed-wing cruise efficiency. Where does it pay?

**Intuition says the energy burned in transition.** Compute it: the 5 kg aircraft above hovers on 512 W, and if takeoff and landing transitions total 60 seconds, that is 8.5 Wh — **2.4%** of a 350 Wh pack. Negligible.

**The real cost is mass.** A VTOL must carry both a rotor system (motors, ESCs, propellers) and a wing, so its structure is heavier than a pure fixed wing's. Same 5 kg takeoff weight, same 1.5 kg payload, with the VTOL airframe 0.5 kg heavier:

| Configuration | Airframe | Battery | Result |
|---|---|---|---|
| Pure multirotor | 1.5 kg | 2.0 kg | hover 41 min |
| Pure fixed wing | 1.5 kg | 2.0 kg | cruise 164 min, 197 km |
| VTOL | 2.0 kg | **1.5 kg** | cruise 123 min, **148 km** |

**That extra 0.5 kg of structure comes straight out of the battery, and range drops 25%.**

So the right way to understand a VTOL is not "both worlds" but **trading roughly a quarter of your range for not needing a runway**. Whether that is a good deal depends entirely on whether you have a runway — in Taiwan's mountains, outlying islands, and on ships, that quarter usually buys very well.

## 4. Why a single-rotor helicopter beats a multirotor: disk area

In hover, a helicopter's endurance is clearly better than a multirotor's. The reason is the denominator of the first equation: `sqrt(2ρA)`. **`A` is disk area, and bigger is cheaper.**

A 25 kg aircraft carrying the same 8 kg battery:

| Configuration | Disk area | Hover power | Endurance |
|---|---|---|---|
| Quad, 24-inch props | 1.17 m² | 3815 W | 22 min |
| Octo, 24-inch props | 2.33 m² | 2697 W | 31 min |
| Quad, 30-inch props | 1.82 m² | 3052 W | 28 min |
| Single rotor, 2.0 m | 3.14 m² | 2325 W | 36 min |
| **Single rotor, 2.5 m** | **4.91 m²** | **1860 W** | **45 min** |

**Same weight, same battery — swapping four small propellers for one large rotor doubles the endurance.**

The price is mechanical complexity: a collective-pitch main rotor, a tail rotor to counter torque, and a drivetrain full of parts that wear. The two TTSB occurrences taken apart in the [crash anatomy post](/posts/tech/2026-08-07-drone-crash-anatomy-en) failed exactly there — once in the main rotor servo's electrical system, once in a **fractured tail-rotor pitch link**. A multirotor has none of those parts because it has none of those mechanisms.

**Endurance and mechanical simplicity are a trade, and those two accident reports are the bill for it.**

## 5. Taiwan's endurance ladder: from AXH-E230RS to T-400, a domestic aircraft at every rung

Before writing this I assumed Taiwanese drones were nearly all multirotors. They are not — there is a domestic aircraft at every rung, and the way the ladder climbs maps exactly onto the two variables computed above: **disk area** and **energy source**.

| Aircraft | Maker | Configuration | Takeoff weight | Endurance | Range / control distance |
|---|---|---|---|---|---|
| (typical electric quad) | — | multirotor | — | ~40 min | short |
| **AXH-E230RS** | AVIX Tech | electric single-rotor helicopter | over 25 kg | **~60 min** | ~30 km control distance |
| **DRAGONFLY** | Zang Shi Technology | electric twin tiltrotor | 13 kg | **1.8 h** | 150 km range |
| **Fuel-cell twin helicopter** | ITRI | hydrogen fuel cell | 63 kg | **2 h** | — |
| **Fuel-cell light helicopter** | ITRI × AVIX Tech | hydrogen fuel cell | **24.9 kg** | **3 h** | — |
| **T-400** | Thunder Tiger | Rotax 912 piston engine | 180 kg | **6 h** | 250 km control distance |

(The "over 25 kg" for the AXH-E230RS is an inference, not a published figure — it appears in the TTSB accident statistics, and [that statistic's threshold](/posts/tech/2026-08-07-drone-crash-anatomy-en) is "maximum takeoff weight exceeding 25 kg." The remaining electric figures are manufacturer-published; the fuel-cell and T-400 figures come from a [Ministry of Economic Affairs Department of Industrial Technology exhibition report](https://www.moea.gov.tw/MNS/doit/industrytech/IndustryTech.aspx?menu_id=13545&it_id=506), sourced to ITRI's ITIS research team in September 2023, so a snapshot of that date.)

Three things worth separating out.

**First, DRAGONFLY validates the previous section's model.** I computed 148 km for a 5 kg VTOL; this 13 kg aircraft is rated at 150 km. The orders of magnitude line up, and its method is exactly tiltrotor — propellers pointing up for takeoff and hover, rotating forward for cruise once at altitude.

**Second, fuel cells buy a factor of three.** The previous post said hydrogen fuel cells were out of scope; here is the answer. In the same 25 kg class, an electric single-rotor helicopter does about 60 minutes; on a fuel cell it does **3 hours**. ITRI also flew real long-range validations — Magong to Wang'an and back, 34 km with a 6.6 kg payload; supplies to the Xinda mountain hut at 3,200 m; and Tainan to Dongji Island and back, **88 km across open water**.

**Third, the piston rung is different physics.** Thunder Tiger's T-400 uses an Austrian Rotax 912 aero engine, a 4.4 m main rotor, and flies 6 hours. Gasoline's energy density is roughly forty times a lithium cell's, and even at 30% engine efficiency what remains still dwarfs the battery. **To reach the "hours" scale, what you change is the energy source, not the battery.** (Thunder Tiger is the company whose [public filings](/posts/investing/2026-08-07-drone-maker-financials-en) an earlier post took apart.)

## 6. That 24.9 kg

The ITRI and AVIX Tech fuel-cell light helicopter lists a maximum takeoff weight of **24.9 kg**.

The [spec-sheet post](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) noted manufacturers pinning weights at 249 g and 1.99 kg, because 250 g and 2 kg are each a legal threshold. **24.9 kg is the same behaviour pressed up against the 25 kg line** — above 25 kg requires physical inspection, and is also what enters the TTSB accident statistics.

This is not a problem in itself; if anything it shows the regime working. **Regulatory thresholds really do reach back and shape a machine's design parameters**, right down to a national research institute's development platform. A difference of 0.1 kg puts you under an entirely different inspection procedure.

## 7. So why are Taiwan's applications almost all multirotor?

Physics gives fixed wings a five-fold coverage advantage, yet the Taiwanese applications this series has taken apart — [agricultural spraying](/posts/product/2026-08-07-agri-drone-unit-economics-en), [inspection](/posts/product/2026-08-07-drone-inspection-taiwan-en), [search and rescue](/posts/product/2026-08-07-drone-sar-value-en), [logistics](/posts/product/2026-08-07-drone-logistics-taiwan-en) — use rotorcraft almost exclusively. Two reasons, neither of them preference.

**First, mission shape determines configuration.** A fixed wing's advantage is covering large areas, and the shape of these missions is "go to a point and stay there": bridges want stationary photography, transmission towers want orbiting, fields want slow low passes, mountain rescue wants threading through trees, island delivery is a few-kilometre hop. **Not one of them is "sweep 200 km² of open country"** — which is where fixed wings actually win, and which Taiwan's terrain and application structure naturally produce very little of.

**Second, regulation eats the fixed wing's advantage.** A fixed wing exists for that 197 km of range, but the [BVLOS post](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en) concluded Taiwan has no beyond-visual-line-of-sight framework, so genuinely long flights only happen through case-by-case approval. **You cannot fly the 197 km, so the 197 km is not worth anything.** Whereas a multirotor's "stay on this spot" works perfectly within visual line of sight — which is exactly what the [inspection post](/posts/product/2026-08-07-drone-inspection-taiwan-en) meant by routing around BVLOS, because that work segments naturally.

**So "Taiwan uses a lot of multirotors" is not evidence of falling behind, it is the reasonable outcome of mission structure plus regulatory structure.** And the fuel-cell and piston rungs appearing mainly on research platforms and defence models follows the same logic: the buyers for that capability are the public sector and defence, not commercial applications.

## What this post does not answer

- **No climb or wind performance.** Everything above is level cruise or stationary hover. Climbing to 3,000 m, or holding position in a force 6 wind, has a different power structure — and Taiwan's mountain and coastal missions involve both.
- **No test conditions for the aircraft cited.** The endurance and range figures above are manufacturer or research-institute published values, and the [previous post](/posts/tech/2026-08-08-drone-endurance-physics-en) just demonstrated how much the fine print under "max flight time" can matter. Without test conditions these cannot be compared to each other, and I do not have their fine print.
- **No costs.** The endurance fuel cells and piston engines buy is real, but unit price, maintenance, and the logistics of hydrogen or fuel are entirely uncosted. Three hours of endurance paired with a site that cannot source hydrogen is three hours on paper.
- **No tethered aircraft.** Run a power cable up and it flies for a very long time. That is a fifth answer, at the price of not being able to move at all.

---

## References

**Computation**

Hover power `P = (m·g)^1.5 / sqrt(2ρA) / (FM·η)`, cruise power `P = (m·g/(L/D))·v / (η_prop·η_elec)`, ρ = 1.225 kg/m³. Parameters: FM 0.70, motor and ESC efficiency 0.80–0.85, propeller efficiency 0.75, L/D at 8 / 12 / 16; pack 206 Wh/kg, 85% usable. Range's independence from speed follows directly from `R = E·(L/D)·η/(m·g)`.

**Primary: aircraft specifications**

- [AXH-E230RS unmanned helicopter — Wikipedia](https://zh.wikipedia.org/zh-hant/AXH-E230RS_%E7%84%A1%E4%BA%BA%E7%9B%B4%E5%8D%87%E6%A9%9F) (AVIX Tech; single main rotor plus tail rotor, electric brushless motors; the article cites manufacturer-published data: about 30 km maximum control distance, about 85 km/h cruise, about 4.6 kg maximum external payload, up to about 60 minutes endurance, operable up to Beaufort force 6) (in Mandarin)
- [Ministry of Economic Affairs, Department of Industrial Technology — technology briefing on unmanned aerial vehicles](https://www.moea.gov.tw/MNS/doit/industrytech/IndustryTech.aspx?menu_id=13545&it_id=506) (ITRI fuel-cell twin helicopter at 63 kg / 10 kg payload / 2 hours; the ITRI and AVIX Tech fuel-cell light helicopter at 24.9 kg / 5 kg payload / 3 hours; validation flights Magong–Wang'an 34 km round trip, Xinda hut at 3,200 m, Tainan–Dongji 88 km round trip; Zang Shi Technology's DRAGONFLY twin tiltrotor at 1.5 m span / 13 kg / 150 km / 1.8 hours; Thunder Tiger's T-400 with a 4.4 m main rotor / Rotax 912 / 180 kg / 250 km control distance / 6 hours. Sourced to ITRI's ITIS research team, September 2023) (in Mandarin)

**On this site**

- [Why Drones Only Fly 30 to 45 Minutes: One Equation Gives the Answer](/posts/tech/2026-08-08-drone-endurance-physics-en)
- [Taking Apart Two TTSB Crash Reports: Neither Was the Operator's Fault](/posts/tech/2026-08-07-drone-crash-anatomy-en)
- [BVLOS in Three Jurisdictions: The US Hasn't Published, the EU Already Flies, Taiwan Has No Framework At All](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en)
- [Inspection Is Taiwan's Furthest-Along Drone Application — Because It Routed Around BVLOS](/posts/product/2026-08-07-drone-inspection-taiwan-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- ["What's the Actual Margin on a Defense Tender?" — The Filings Answered What I Assumed Needed an Interview](/posts/investing/2026-08-07-drone-maker-financials-en)
