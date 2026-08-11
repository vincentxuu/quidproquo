---
title: "Taking Apart Two TTSB Crash Reports: Neither Was the Operator's Fault"
date: 2026-08-07
type: deep-dive
category: tech
tags: [drone, taiwan, uav, safety, hardware]
lang: en
tldr: "Only four drone occurrences have entered Taiwan's official aviation safety statistics — because the threshold is 'substantial damage to a drone over 25 kg.' A hobbyist crash never enters the count. The two published investigation reports are the same model, the same manufacturer, and the same agency, and both probable causes were hardware failures: main rotor servo electrical failure in one, a fractured tail rotor pitch link in the other. In both, the flight control computer and the operator were explicitly cleared."
description: "Working through two TTSB drone investigation reports: timelines, attitude data, damage sequence analysis, and final conclusions; how the 25 kg statutory threshold produces the figure 'four occurrences in Taiwan'; and where to look for the world below 25 kg."
draft: false
series:
  name: "Taiwan's Drone Industry, Taken Apart"
  order: 22
---

> 🌏 [中文版](/posts/tech/2026-08-07-drone-crash-anatomy)

**Boundary first: I have never crashed a drone. Every crash here is someone else's.**

That isn't purely a weakness. A first-hand crash has a sample size of one, while a published investigation report is the product of more than a year of work, disassembled down to gear teeth and linkages. **If the goal is understanding how drones lose control, the information density of reading someone else's report far exceeds crashing your own.**

This piece works through two formal reports from Taiwan's Transportation Safety Board (TTSB), plus where to look for everything under 25 kg.

## Start with the number: why Taiwan has only four

Per the TTSB's [Taiwan Aviation Safety Statistics 2015-2024](https://www.ttsb.gov.tw/media/9223/台灣飛安統計報告2015-2024.pdf), from April 2019 — when drones were brought into scope — through the end of 2024, there were **4 major aviation occurrences: 3 hull losses, 1 missing aircraft, no injuries**.

Four. Taiwan has tens of thousands of registered drones.

That number doesn't mean Taiwan's drones rarely crash. "Major aviation occurrence" has a statutory threshold. Per the [Executive Yuan Gazette](https://gazette2.nat.gov.tw/EG_FileManager/eguploadpub/eg025245/ch06/type1/gov52/num15/Eg.htm) notice effective 1 August 2019, for drones it means an occurrence between the moment the propulsion system is started for flight and the moment it is shut down at the end of flight, meeting one of:

1. Causing death or injury to a person
2. **Substantial damage to a drone with maximum takeoff weight exceeding 25 kilograms**
3. Other occurrences with major impact on life or property that the TTSB determines warrant investigation

Clause 2 is the one that matters. **Over 25 kg only.** Your camera drone splitting in half at the riverside park isn't in this statistic; nor is a government agency's mid-size aircraft, as long as it stayed under 25 kg and hurt nobody.

So "four" reads like this: **it is the complete list of large drone failures in Taiwan, not the list of Taiwanese drone crashes.** And precisely because the threshold is high and the sample is government-operated heavy equipment, the investigative depth of these four far exceeds any ordinary crash post-mortem.

The institutional timeline is worth noting: the TTSB brought drones into scope via the amended Transportation Occurrence Investigation Act promulgated 24 April 2019, then issued the Regulations Governing Investigation Procedures for Major Drone Aviation Occurrences on 4 March 2020, specifying reporting duties for owners, operators, and government agencies.

## Report one: Tamsui estuary, 60 metres to 4 metres in under 3 seconds

[Investigation report TTSB-AOR-22-05-001](https://www.ttsb.gov.tw/media/5334/ttsb-aor-22-05-001.pdf), released 20 May 2022.

**Setting**: On 9 March 2021 the Coast Guard Administration's Northern Branch First Drone Squadron was searching for people in the water after a fishing boat capsized — flown during the window while a National Airborne Service Corps helicopter returned to Songshan Airport to refuel. The aircraft was an AVIX Technology AXH-E230RS unmanned helicopter, registration B-AAA01408.

Weather was not a factor. The Tamsui weather station recorded, at 0900 that day, wind from 360 degrees at 1.9 m/s with maximum gusts of 4.2 m/s, temperature 20°C, dew point 17°C, zero precipitation; the crew's own pre-flight check logged 2.3 m/s and clear skies.

**Timeline** (the report records to the second):

```
0851      Takeoff, search begins along the near shore, cruise ~11 m/s
0909:54   Planned route complete, entering GPS mode
          → ground control station shows attitude deviating, altitude not holding
0910:00   Operator engages return to launch (RTL)
          → attitude continues deviating, altitude dropping fast
0910:05   Data link ceases, video downlink cuts out
```

The last data the ground station received: RTL mode, speed 7 m/s, altitude 4 m, pitch down 9.8 degrees, **right bank 108 degrees**, link quality 0%.

A right bank of 108 degrees means the helicopter had rolled past vertical. The operator's account: the aircraft rolled 180 degrees, and altitude went from 60 metres to the 4 metres on the final frame in **under 3 seconds**.

**Elimination**:

- The occurrence happened in automatic mode with no manual intervention → unrelated to the operator
- Power output and main rotor speed were normal before impact → propulsion and transmission were sound
- The flight control computer (FCC) issued **correct** PWM correction commands based on attitude; the left servo arm should have pushed to its upper limit — **but the aircraft's attitude did not respond**
- Main rotor assembly damage was confirmed by damage sequence analysis to have been caused by the sea impact, not to be the cause of the loss of control

In other words: **the brain issued the right command and the muscle did not execute it.** The report's phrasing is that the aircraft suffered an asymmetric failure in roll control and could not effectively execute the roll-right command, while pitch and yaw attitude remained within the FCC's controllable range.

**Where it converges**: the mechanisms linking the three main rotor servos to the swashplate were undamaged and the motors ran normally, so the anomaly converged onto either the gear train or the electrical system. AVIX's inspection found the right servo's gear train normal, while the left servo's first-stage gear was noticeably raised with the motor slightly sunk, producing misaligned free-spinning. But the report judged gear train failure unlikely for three reasons: no non-destructive examination was performed before disassembly; the gear chamber's internal geometry leaves very little room for the first-stage gear to rise; and no gear showed abnormal tooth wear or debris from improper meshing.

**Final conclusion**: the probable cause was **electrical failure in the left or right main rotor servo**, leading to loss of control and the crash. The report also honestly records the limits of verification — the servos may have been powered when they entered the water, sharply raising the risk of internal short circuit in a non-freshwater environment, and seawater then contaminated the electrical components; on re-powering, the unit produced uncommanded actuation, and functional testing could never be completed.

**One easily missed detail**: the aircraft had accumulated 121 hours 52 minutes of flight time, while the maintenance manual specifies servo replacement **every 150 flight hours**. It had not yet reached the manufacturer's own replacement interval.

## Report two: Dulan beach, the linkage broke

The second occurrence is registration **B-AAA01397**; the [TTSB's English executive summary](https://www.ttsb.gov.tw/media/7645/b-aaa01397-executive-summary.pdf) and [ETtoday's Chinese report](https://www.ettoday.net/news/20240713/2776637.htm) can be cross-checked.

At 0939 on 17 January 2023, an AXH-E230RS belonging to the Coast Guard's **Eastern Branch** crashed on the beach beside the Dulan coastal viewing platform in Taitung County while returning from a flight test. No casualties. The TTSB investigated for over a year, published in July 2024, and issued 3 conclusions and 2 safety recommendations.

**Conclusion**: the aircraft's **tail rotor pitch links fractured in flight**, making attitude control impossible; no evidence pointed to the flight control computer or human operation.

**One level up**: the tail rotor slider assembly may have suffered from **poor manufacturing and assembly quality in the old-model slider and other components**, causing friction and obstruction during rotation, deforming the linked pitch control yoke and fracturing the pitch links, ultimately causing the loss of control.

**One level further up** — the most valuable sentence in the report: before the occurrence, the manufacturer **had already redesigned the slider specification because of production line assembly problems, but failed to evaluate the suitability of old-model parts still in stock and in service**, which posed a flight safety risk.

The safety recommendations therefore split across two addressees: AVIX, to strengthen design, manufacturing, and assembly quality control and to **evaluate the suitability of stocked and in-service old-model parts after a design change**; and the CAA, to supervise AVIX's design and modification work so that applicable inspection standards are actually met.

## The two reports side by side

Placed next to each other, the commonalities are too many to look like coincidence:

| | B-AAA01408 | B-AAA01397 |
|---|---|---|
| Date | 2021-03-09 | 2023-01-17 |
| Agency | Coast Guard, Northern Branch | Coast Guard, Eastern Branch |
| Model | AXH-E230RS (AVIX Technology) | AXH-E230RS (AVIX Technology) |
| Phase | Search and rescue mission | Returning from flight test |
| Failed component | Main rotor servo (electrical) | Tail rotor pitch link |
| Flight control computer | Commands correct | Not implicated |
| Operator | Not implicated | Not implicated |

**Three observations:**

**One: neither was "poor piloting."** The flight control computer was normal both times and the operator was explicitly cleared both times. That runs against most people's instinct about crashes, which is to blame the pilot first. In this sample at least, the loss of control came from mechanisms and electrical systems.

An honest caveat: **the sample bias is structural.** The 25 kg threshold filters out consumer and small commercial aircraft, leaving only large government-operated platforms whose operators all hold professional licences and train within an organization. What the failure distribution looks like for ordinary flyers, these four cannot say.

**Two: both failures sit in Layer 2.** Servos, pitch links, sliders, yokes — these are the [industry map's](/posts/tech/2026-08-06-drone-industry-map-en) Layer 2 core components, not the Layer 3 flight control and comms links everyone talks about. That contrast is worth pausing on: **industry discussion locates the bottleneck at Layer 3, but these two aircraft were brought down by Layer 2 manufacturing quality.**

**Three: the second one's root cause was a process, not a part.** "Failed to evaluate stocked and in-service old-model parts after a design change" is a gap in quality management, not a bad component. It won't show up on a spec sheet and it won't show up in flight testing — it shows up when one batch of old stock goes onto one aircraft and flies for a while. [The spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) talks about "silent fields"; this is the most silent one.

## Below 25 kg: go read logs

Small aircraft failures don't enter the TTSB statistics, but they aren't undocumented — **the open-source flight stack ecosystem made this public**.

[PX4's Flight Review](https://docs.px4.io/main/en/log/flight_review) is the official log analysis tool: the `logger` module writes uORB topics into ULog files, uploadable for analysis and markable as public. [The software transition piece](/posts/career/2026-08-06-software-to-drone-transition-en) noted that reading "why this flight oscillated" out of a log is more persuasive than reciting control theory — here is what to actually read.

Per PX4's [flight log analysis guidance](https://docs.px4.io/main/en/log/flight_log_analysis), the three opening questions are:

1. If this is post-malfunction analysis, **did the log capture the crash or did it stop mid-air**?
2. Did all controllers track their references? The easiest check is comparing attitude roll and pitch rates against their setpoints
3. Does the sensor data look valid?

And the single most common multirotor problem is **vibration**. PX4's docs are blunt: high vibration can cause sensor clipping or failure, which in turn causes estimation failures and fly-aways. Some directly usable criteria:

- Raw acceleration peak-to-peak **above 2–3 m/s²** counts as strong vibration
- In the spectral density plot, if the **z-axis curve touches the x/y-axis curves** during hover or slow flight, vibration is too high
- The default filter sits at 80 Hz, so **vibration around 50 Hz is not filtered out** — and that lands right in the vehicle's own dynamics band, which is dangerous
- If actuator controls sit at maximum for extended periods, the controller is saturating. At full throttle that's expected; mid-mission it usually means **the vehicle is overweight for the thrust it can provide**

This is a clean example of where first-hand experience and public data divide: **"how to tell vibration is too high" is publicly learnable; "why this machine started shaking after I fitted these landing legs" is known only to the person who fitted them.**

## Update: that line about reading logs — I went and read one

> **Update, 2026-08-09.** The previous section said that below 25 kg you have to go read logs, and at the time I had not read a single one. Here it is — with the scope stated up front.

**How to get one (reproducible)**: `review.px4.io` is unreachable from my environment (the proxy returns 403), so I used the PX4 project's own test logs:

```bash
pip install pyulog
curl -O https://raw.githubusercontent.com/PX4/pyulog/main/test/sample.ulg
curl -O https://raw.githubusercontent.com/PX4/pyulog/main/test/sample_log_small.ulg
```

**What is actually inside one** (numbers from pyulog):

| | `sample.ulg` | `sample_log_small.ulg` |
|---|---|---|
| File size | 4.0 MB | 921 KB |
| Message types (topics) | 15 | **70** |
| Total samples | **64,542** | — |
| Total fields | 300 | — |
| Duration | 181.5 s | — |
| Boot parameter snapshot | **493 parameters** | — |
| Text messages from the flight controller | 4 | 3 |

Those 70 topics include `vehicle_gps_position`, `sensor_baro`, `sensor_mag`, `vehicle_imu`, `estimator_innovations`, `estimator_innovation_test_ratios`, `actuator_outputs`, `input_rc`, `battery_status`, `wind_estimate`, `vehicle_land_detected` and more — **the EKF's innovations and their test ratios are in there**, which is exactly the decision material [the GPS jamming post](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) took apart, recorded sample by sample.

And all four text messages in `sample.ulg` are the same line:

```
t=158.22s [ERROR] [sensors] no barometer found on /dev/baro0 (2)
t=162.07s [ERROR] [sensors] no barometer found on /dev/baro0 (2)
t=171.62s [ERROR] [sensors] no barometer found on /dev/baro0 (2)
t=176.41s [ERROR] [sensors] no barometer found on /dev/baro0 (2)
```

**That is the point.** An airframe under 25 kg will never get an investigation report, but while it runs it writes tens of thousands of samples, a complete parameter snapshot, and **its own four lines of complaint that a sensor had gone missing** into one file. The TTSB's two reports are a few dozen pages of narrative; a 921 KB log has 70 topics. **The evidence asymmetry runs the other way: the big aircraft get a report and no public log, the small ones get no report but the log is in the pilot's own hands.**

**What this did and did not establish (important)**: all three are PX4 test files — `nav_state` is 0 throughout and `vehicle_local_position.z` never goes above −1.18 m, so **they are bench or barely-off-the-ground recordings, not a real flight and certainly not a crash**. So the above establishes *what a log records*, **not how a log reconstructs an accident**. That still needs a real crash log, and the public crash-log archive (review.px4.io) is unreachable from here. The gap is therefore half closed, and I know where the other half is stuck.

## A number I could not explain

While writing this I hit something I can't account for, listed here as an honest footnote.

Registered drone counts as recorded in successive TTSB statistical reports:

| Date | Registered drones |
|---|---|
| End of 2021 | 75,240 |
| End of 2022 | 40,134 |
| End of 2024 | 38,683 (10,176 institutional, 28,507 individual) |

Thirty-five thousand aircraft disappeared within one year.

**The plausible inference** is that the counting basis shifted from cumulative registrations to currently valid ones: Article 10 of the Regulations Governing Remotely Piloted Aircraft states that "the validity period of a registration number is two years, and the owner may apply for extension within thirty days before expiry," and the regulations took effect on 31 March 2020, so the first registration wave expired in 2022. If many owners didn't renew, the number would drop exactly like this.

But **that is an inference, not a conclusion.** The TTSB reports don't state the counting basis, and I have not found a CAA explanation of the gap. Until then, this section carries the series and the statute, not a causal claim.

## Three judgments

1. **Read the threshold definition before the statistic.** "Taiwan has had only 4 major drone occurrences" is true, but its definition is "over 25 kg and substantially damaged." Any argument about drone safety built on that number has skipped the definition.
2. **Public accident reports have extraordinary information density.** An investigation running over a year, examining whether gear teeth carried debris, is a depth no individual reaches by crashing a hundred aircraft. To understand failure modes, this is the cheapest route.
3. **Failures often aren't in the layer you're watching.** Industry discussion concentrates on flight control and links (Layer 3), but these two were servo electrical failure and a fractured linkage (Layer 2) — and one of them traced back to not clearing old stock after a design change, a management process problem.

## References

**Accident investigation (primary)**

- [TTSB — B-AAA01408 Drone Occurrence Investigation Report (TTSB-AOR-22-05-001)](https://www.ttsb.gov.tw/media/5334/ttsb-aor-22-05-001.pdf) (in Chinese; timeline, attitude data, servo and damage sequence analysis, conclusion)
- [TTSB — B-AAA01397 Drone Occurrence Investigation, Executive Summary](https://www.ttsb.gov.tw/media/7645/b-aaa01397-executive-summary.pdf) (pitch link fracture, slider assembly quality, design change without old-part evaluation)
- [TTSB — Taiwan Aviation Safety Statistics 2015-2024](https://www.ttsb.gov.tw/media/9223/台灣飛安統計報告2015-2024.pdf) (in Chinese; four occurrences, registration counts, statutory basis and timeline)
- [TTSB — Aviation safety statistics archive](https://www.ttsb.gov.tw/1133/1150/1151/) (in Chinese)
- [Executive Yuan Gazette — Scope of Major Transportation Occurrences (effective 2019-08-01)](https://gazette2.nat.gov.tw/EG_FileManager/eguploadpub/eg025245/ch06/type1/gov52/num15/Eg.htm) (in Chinese; the 25 kg drone threshold)
- [ETtoday — TTSB report finds Coast Guard drone crash unrelated to the operator](https://www.ettoday.net/news/20240713/2776637.htm) (in Chinese; B-AAA01397 coverage and safety recommendations)

**Regulation**

- [Regulations Governing Remotely Piloted Aircraft — Laws & Regulations Database](https://law.moj.gov.tw/lawclass/LawAll.aspx?pcode=K0090083) (in Chinese; Art. 10, two-year registration validity)
- [CAA — Drone safety voluntary reporting](https://www.caa.gov.tw/article.aspx?a=4153&lang=1) (in Chinese; non-punitive reporting system for latent risk)

**Log analysis**

- [PX4 — Log Analysis using Flight Review](https://docs.px4.io/main/en/log/flight_review) (vibration criteria, spectral density plots, controller saturation)
- [PX4 — Flight Log Analysis](https://docs.px4.io/main/en/log/flight_log_analysis) (the three opening questions)
- [PX4 — Vibration Isolation](https://docs.px4.io/main/en/assembly/vibration_isolation) (sensor clipping and fly-aways)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [From Software into Drones: Use the PX4 Architecture Diagram as a Job Map](/posts/career/2026-08-06-software-to-drone-transition-en)
