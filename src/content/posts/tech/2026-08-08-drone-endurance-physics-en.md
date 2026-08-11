---
title: "Why Drones Only Fly 30 to 45 Minutes: One Equation Gives the Answer"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, battery, physics, molicel, supply-chain]
lang: en
tldr: "Hover power scales with takeoff weight to the 1.5 power while battery energy scales linearly, and that one exponent gap makes added battery hit diminishing returns fast — the optimum battery fraction solves to two-thirds of takeoff weight, independent of rotor diameter, rotor count, efficiency and energy density. What actually caps endurance is payload, not the regulatory weight thresholds: 60 minutes needs a 314 Wh/kg cell, and the best high-rate cell today is 242 Wh/kg."
description: "Computing multirotor hover endurance from momentum theory: the 1.5-power law, the collapse of returns on added battery, the closed-form optimum battery fraction, what regulatory weight thresholds and payload each actually do, and how much energy density 60 minutes would need — ending on the one layer of the drone BOM where Taiwan genuinely leads."
draft: false
series:
  name: "Drone Teardown"
  order: 26
---

> 🌏 [中文版](/posts/tech/2026-08-08-drone-endurance-physics)

The last several posts in this series have all been about institutions — regulations, tenders, testing specifications, licences. This one touches no legal text at all. It computes one thing: **why does multirotor endurance land almost universally between 30 and 45 minutes?**

Not 10 minutes, not 3 hours. The band is suspiciously narrow, and it has barely moved in a decade. One equation gives the reason, and working it through produced several conclusions I had not expected.

The model, the constants and every parameter are listed at the end, so all the numbers can be recomputed.

## 1. One equation: power goes as weight to the 1.5

A hovering rotor has to push air downward. Momentum theory gives the ideal hover power:

```
P_ideal = T^1.5 / sqrt(2 · ρ · A)
```

- `T` is total thrust, which in hover equals weight, `m·g`
- `A` is total disk area (rotor count × the area of one propeller circle)
- `ρ` is air density, 1.225 kg/m³ at sea level and 15 °C

Real electrical power divides by two more efficiencies: the rotor's **figure of merit** (roughly 0.55–0.75 for small propellers) and the combined motor and ESC efficiency (roughly 0.8–0.85).

The whole story is in that **3/2 exponent**. Double the weight and hover power rises by 2^1.5 = 2.83.

Battery energy, meanwhile, is **linear**: one more kilogram of battery gives you one more kilogram × energy density.

**Endurance = energy ÷ power ∝ battery mass ÷ takeoff weight^1.5.** A linear term divided by a 1.5-power term — the answer to the whole question lives in that exponent gap.

## 2. Returns on more battery collapse faster than you would think

Take a 7-inch class quadcopter: 0.6 kg of airframe including motors and ESCs, 7-inch propellers, figure of merit 0.70, electrical efficiency 0.80, cells at the Molicel P45B level (242 Wh/kg), about 85% of that surviving into a finished pack after case, wiring and BMS, and 85% of the pack's energy actually usable (never fly lithium to empty).

| Battery | Takeoff weight | Hover power | Endurance |
|---|---|---|---|
| 0.5 kg | 1.10 kg | 128 W | 40.9 min |
| 1.0 kg | 1.60 kg | 225 W | 46.7 min |
| 1.5 kg | 2.10 kg | 338 W | 46.6 min |
| 2.0 kg | 2.60 kg | 466 W | 45.1 min |
| 3.0 kg | 3.60 kg | 759 W | 41.5 min |
| 4.0 kg | 4.60 kg | 1096 W | 38.3 min |

Isolating what doubling the battery buys:

- 0.3 → 0.6 kg: 33.2 → 43.1 min, **+30%**
- 0.6 → 1.2 kg: 43.1 → 46.9 min, **+9%**
- 1.2 → 2.4 kg: 46.9 → 43.6 min, **−7%**

**The third doubling is negative.** The extra battery consumes the extra energy it brought and then some.

This explains a common misconception. People assume short endurance means the battery is too small, but most well-designed aircraft are already deep in the diminishing-returns region, where more battery does nothing noticeable. Endurance is not a capacity problem, it is a **mass** problem.

## 3. The optimal battery fraction is two-thirds — and it depends on nothing

That table peaks near 1.2 kg. Not a coincidence; it can be solved.

Let `M₀` = airframe + payload (excluding battery) and `m_b` = battery mass. Endurance is proportional to

```
m_b / (M₀ + m_b)^1.5
```

Differentiate with respect to `m_b` and set to zero:

```
(M₀ + m_b)^1.5 = 1.5 · m_b · (M₀ + m_b)^0.5
        M₀ + m_b = 1.5 · m_b
             m_b = 2 · M₀
```

So **the optimal battery mass is twice the airframe-plus-payload mass**, which is to say **battery is two-thirds of takeoff weight**.

It is worth pausing on what that result **cancelled out**: air density, disk area, rotor count, figure of merit, electrical efficiency, and battery energy density. All of them are constants in the proportionality and vanish under differentiation.

**As long as hover power goes as weight to the 1.5, the optimal battery fraction is 2/3, regardless of which battery, propeller or motor you use.** The 1.20 kg the table found numerically is exactly 2 × 0.60.

(Nobody actually builds at 2/3 in practice. You need payload, structural margin, thermal headroom, a cost target. But the number gives you a ruler: what fraction of your takeoff weight is battery? The further from 2/3, the less you have optimised for endurance — which may be entirely correct, but you should know where you are.)

## 4. I assumed the weight thresholds would cap endurance. The maths says no

The [spec-sheet post](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) laid out Taiwan's five weight thresholds: 250 g for registration, 1 kg for map data, 2 kg for a licence plus type inspection, then 15 kg and 25 kg for physical inspection.

My assumption was that since battery wants to be 2/3 of takeoff weight, a weight cap is a battery cap, so the thresholds should bite directly into endurance. **Computing it showed the assumption was wrong.**

Designing each class at its optimum, with propellers scaled to the airframe:

| Threshold | Takeoff weight | Battery | Propeller | Hover power | Endurance |
|---|---|---|---|---|---|
| 250 g | 0.25 kg | 0.17 kg | 5 in | 21 W | 84.6 min |
| 1 kg | 1.00 kg | 0.67 kg | 7 in | 118 W | 59.2 min |
| 2 kg | 2.00 kg | 1.33 kg | 10 in | 234 W | 59.8 min |
| 15 kg | 15.0 kg | 10.0 kg | 21 in | 2288 W | 45.9 min |
| 25 kg | 25.0 kg | 16.7 kg | 30 in | 3446 W | 50.7 min |

**The theoretical ceiling is roughly the same across weight classes, all landing between 45 and 60 minutes.**

The reason is not hard to see. Hover power is `m^1.5 / sqrt(A)`, and disk area grows roughly with the square of linear size while mass grows with the cube, so the two largely cancel. **Going bigger does not buy you flight time, and neither does going smaller.**

(The 84 minutes in the 250 g row is optimistic extrapolation. Small propellers drop below 0.5 figure of merit, and fixed avionics draw is an enormous share of the total on an aircraft that hovers on 21 W — add just 6 W of fixed load and it falls to 65 minutes, and a real aircraft would be lower still.)

**This overturned my own assumption, and it did so cleanly: not data contradicting me, an equation contradicting me.**

## 5. What actually caps endurance is payload

Same aircraft, takeoff weight fixed at 25 kg, airframe 6 kg, and the remaining mass split between payload and battery:

| Payload | Battery | Endurance |
|---|---|---|
| 0 kg | 19.0 kg | 55.9 min |
| 4 kg | 15.0 kg | 44.1 min |
| 8 kg | 11.0 kg | 32.4 min |
| 12 kg | 7.0 kg | 20.6 min |
| 16 kg | 3.0 kg | 8.8 min |

**With takeoff weight fixed, endurance is linear in battery mass** — power is pinned by the takeoff weight and no longer varies. So every kilogram of payload costs a fixed number of minutes: on this aircraft, **about 2.9 minutes per kilogram**.

The same holds on a 2 kg machine, where each 100 g of payload eats roughly 4.1 minutes.

This is exactly the working rhythm the [agricultural spraying post](/posts/product/2026-08-07-agri-drone-unit-economics-en) described. A sprayer carrying a dozen-plus kilograms of chemical has almost nothing left for battery, so a sortie lasts ten-odd minutes before it comes back to swap batteries and refill. **That is not a bad battery, it is mass spent elsewhere.** A spray drone's short endurance and its large payload are two faces of one fact.

Look at the [search-and-rescue](/posts/product/2026-08-07-drone-sar-value-en) aircraft the other way round: it carries a thermal camera and a compute module, a few hundred grams, so it can spend its mass on battery. **Same physics, different trade.**

## 6. What 60 minutes would require

Fixing a design (0.9 kg pack, 7-inch class airframe) and asking what pack energy density each endurance target needs:

| Target | Pack needs | At cell level |
|---|---|---|
| 30 min | 133 Wh/kg | 157 Wh/kg |
| 45 min | 200 Wh/kg | 235 Wh/kg |
| **60 min** | **267 Wh/kg** | **314 Wh/kg** |
| 90 min | 400 Wh/kg | 471 Wh/kg |

And the best high-drain cylindrical cells actually usable on a drone today sit here:

| Cell | Capacity | Max discharge | Weight | Energy density |
|---|---|---|---|---|
| Molicel INR21700-P45B | 4.5 Ah / 16.2 Wh | 45 A | ~70 g | **242 Wh/kg** |
| Molicel INR21700-P42A | 4.2 Ah / 15.5 Wh | 45 A | ~70 g | 230 Wh/kg |

**The 235 Wh/kg that 45 minutes requires is almost exactly today's best high-drain cell.** That is where the "30 to 45 minutes" band comes from — not engineers slacking, but a direct consequence of current cell chemistry.

Sixty minutes needs 314 Wh/kg, about 30% better than today. Ninety minutes needs 471 Wh/kg, close to double.

There is a constraint here that gets overlooked. A drone does not need the *highest energy density* cell, it needs one that survives **high-rate discharge**. The 280–300 Wh/kg cells in phones and electric cars cannot deliver 45 A. **The bottleneck is not the frontier of battery technology, it is the trade between high power and high energy.**

## 7. That cell is made in Taiwan

Both cells above carry the brand **Molicel**. The company is **E-One Moli Energy**, founded in 1998, and [its own website](https://www.molicel.com/cn/about) states that it belongs to TCC Group Holdings — Taiwan's first listed company.

This deserves its own section, because it cuts against this series' main theme.

The [supply chain post](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) concluded that Taiwan's gap sits at Layer 3 — flight controllers, links, payloads, the critical components. The recent posts kept reinforcing it: the flight stacks are [American and European open-source projects](/posts/tech/2026-08-08-px4-vs-ardupilot-en), the mainstream [control links are foreign](/posts/tech/2026-08-08-drone-radio-link-en), and the [satellite positioning chips](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) more so.

**Cells are the exception.** Molicel's customer list includes Archer Aviation's Midnight eVTOL (which holds an FAA special airworthiness certificate), Vertical Aerospace, Uber Elevate back in 2018, and every bike in the 2023–2026 MotoE World Championship. TCC's own public statement says Molicel cells have "passed the stringent international aviation certifications of the FAA, EASA and the UK CAA alongside these premium customers."

**In the drone BOM, this is one of the few layers where Taiwan does not merely manufacture but is bought from.**

It also just demonstrated how fragile that position is. On 14 July 2025 a fire broke out at the Xiaogang cell plant of Molie Quantum Energy, a TCC subsidiary, in Kaohsiung. Per [TCC's own board report](https://www.molicel.com/cn/newsroom/%E4%B8%89%E5%85%83%E8%83%BD%E6%BA%90%E7%A7%91%E6%8A%80%E9%AB%98%E9%9B%84%E5%BB%A0%E7%81%AB%E7%81%BD%E4%BA%8B%E4%BB%B6%E6%BB%BF%E6%9C%88%E5%A0%B1%E5%91%8A):

- Book value of scrapped plant, equipment and inventory plus known demolition and repair costs: about **NT$16.4 billion**
- Property insurance totalling about NT$21.9 billion in cover, but a **per-event cap of NT$3 billion**, at a 75.5% insured ratio
- After estimated recoveries, and at the 78.1% indirect shareholding, the estimated hit to TCC's profit is about **NT$11 billion**
- **Three months of suspended operations** by government order
- Before the fire, both plants held orders into 2026 at **more than double their combined capacity**

The report's account of the cause is worth reading too: three supposedly independent safety systems failed in sequence — a heat source triggering a chain reaction in the ageing area, the automatic fire-suppression system failing to activate in time, and then a grid outage disabling the backup.

**Orders at twice capacity, and one fire burned a year of profit.** That is the same shape as the failure chains in the [crash anatomy post](/posts/tech/2026-08-07-drone-crash-anatomy-en): not a single cause, but several independent defences failing together.

(Incidentally, E-One Moli's planned NT$25.5 billion battery plant in Canada was suspended in November 2024. This post makes no investment judgement; it records the public facts about this layer.)

## 8. Back-testing against a real aircraft, and reading the fine print

Take an aircraft whose specifications are fully published. From DJI's [Matrice 350 RTK specs page](https://enterprise.dji.com/matrice-350-rtk/specs):

- **6.47 kg** with two TB65 batteries
- TB65: 5880 mAh / 44.76 V / **263.2 Wh** each, about **1.35 kg** each (526.4 Wh total)
- 21-inch propellers
- **Max flight time 55 minutes**

Two incidental numbers first. TB65 pack energy density is 263.2 ÷ 1.35 = **195 Wh/kg**, almost exactly the "cell value × 85%" (206 Wh/kg) I assumed above — that assumption holds. And 2.7 kg of battery on a 6.47 kg aircraft is **42%** of takeoff weight, far from the 2/3 optimum, confirming that nobody builds there.

Now the 55 minutes. My model with default parameters gives 610 W of hover power and **44 minutes**, apparently 20% short. But DJI prints a line of fine print under that number:

> Measured with Matrice 350 RTK flying at approximately **8 m/s** without payloads in a windless environment **until the battery level reached 0%**.

Three conditions: **8 m/s forward flight, no payload, no wind, drained to 0%**.

- Forward flight is not hover. A multirotor with forward speed gains translational lift and needs less power.
- "To 0%" is not the 85% usable I assumed.

Change usable energy to 100% and the same model gives **52 minutes** — within 5% of the published 55, and the remainder is exactly what forward flight saves over hover.

**So the model was not wrong; I was, for reading "max flight time" as a hover figure.** Which is the same point the [spec-sheet post](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) makes: nearly every number on a spec sheet comes with test conditions, and the conditions usually matter more than the number. **Next time you see "flight time XX minutes," go find the fine print: hover or forward flight, drained to what percentage, with or without payload.**

As for how the model behaves on small aircraft, I should say plainly that it runs optimistic. Small propellers drop to a figure of merit just above 0.5, and fixed draw from camera, gimbal and video transmitter is a large share on an aircraft that hovers on tens of watts — neither of which appears on a spec sheet. So:

**Use this model for trends and ratios, not to predict a specific aircraft's minutes.** The 1.5-power law, the diminishing returns, the 2/3 optimum, the minutes-per-kilogram of payload — those are robust, because they depend only on that exponent. The absolute values are not.

## What this post does not answer

- **No forward flight.** Everything above is hover. Fixed-wing and VTOL aircraft generate lift from a wing in cruise, with a completely different power structure and endurance running to hours — that belongs to another post (the airframe-configuration cell).
- **No hydrogen fuel cells or hybrids.** Those are the two routes around the lithium energy-density ceiling, each with its own trades.
- **No temperature effects.** Cold cuts usable capacity substantially; heat accelerates degradation under high-rate discharge. Mountain rescue and summer spraying are very different battery duty cycles.
- **No data on which cells Taiwanese manufacturers actually use.** Molicel is a publicly documented world-class supplier, but which cells Taiwanese airframe makers actually buy is not in the public record, and I am not inventing it.

---

## References

**Computation**

Every number here follows from the constants and equations stated in the text. Model and parameters: momentum-theory hover power `P = T^1.5 / sqrt(2ρA)` (ρ = 1.225 kg/m³), divided by figure of merit (0.55–0.72 by propeller size) and electrical efficiency (0.80–0.85); pack energy density taken as 85% of cell value, usable energy 85% (changed to 100% for the Matrice 350 back-test, to match DJI's stated test condition); the optimal battery fraction is the analytic extremum of `m_b / (M₀+m_b)^1.5`.

**Primary: aircraft specifications**

- [DJI Matrice 350 RTK — Specs](https://enterprise.dji.com/matrice-350-rtk/specs) (6.47 kg with two TB65; TB65 at 5880 mAh / 44.76 V / 263.2 Wh / approx. 1.35 kg each; max flight time 55 minutes and its fine print: approx. 8 m/s forward flight, no payload, no wind, drained to 0%)

**Primary: cell specifications and company records**

- [Molicel INR21700-P45B product page](https://www.molicel.com/inr-21700-p45b) (4.5 Ah / 16.2 Wh, 45 A max discharge, 242 Wh/kg, 643 Wh/L, 13.8 mΩ max internal resistance)
- [Molicel — About](https://www.molicel.com/cn/about) (founded 1998, part of TCC Group Holdings, and the eVTOL and motorsport customer timeline: Uber Elevate 2018, Vertical Aerospace 2022, Archer Midnight's FAA special airworthiness certificate 2023, MotoE 2023–2026) (in Mandarin)
- [One-month report on the Molie Quantum Energy Kaohsiung plant fire — Molicel newsroom](https://www.molicel.com/cn/newsroom/%E4%B8%89%E5%85%83%E8%83%BD%E6%BA%90%E7%A7%91%E6%8A%80%E9%AB%98%E9%9B%84%E5%BB%A0%E7%81%AB%E7%81%BD%E4%BA%8B%E4%BB%B6%E6%BB%BF%E6%9C%88%E5%A0%B1%E5%91%8A) (TCC's full board report: NT$16.4 bn book loss, NT$21.9 bn cover with a NT$3 bn per-event cap, roughly NT$11 bn profit impact, 78.1% indirect shareholding, three months suspended, the sequence of three failed safety systems, orders at more than double capacity) (in Mandarin)
- [Progress report on the Xiaogang plant fire — TCC Group Holdings](https://www.tccgroupholdings.com/news/688741ca3dea1) (the official account of the three anomalies: heat source in the ageing area, automatic fire suppression not activating, grid outage disabling backup power) (in Mandarin)

**On this site**

- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [After "NT$2M a Year Flying Drones": Agricultural Spraying Has Run a Full Cycle](/posts/product/2026-08-07-agri-drone-unit-economics-en)
- [Search and Rescue Drones: The One Application Whose ROI Isn't Money — and the Easiest Budget to Cut](/posts/product/2026-08-07-drone-sar-value-en)
- [Taking Apart Two TTSB Crash Reports: Neither Was the Operator's Fault](/posts/tech/2026-08-07-drone-crash-anatomy-en)
