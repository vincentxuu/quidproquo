---
title: "The Seven Seconds After GPS Jamming Starts: How a Flight Controller Notices, What It Decides, and Why Jamming Detection Is Off by Default"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, gnss, ekf, px4, ardupilot]
lang: en
tldr: "Taiwan's drone cybersecurity spec names three modules; the previous two posts took apart flight control and communications, so this one takes satellite positioning. I flew a SITL copter to 28 m, then switched on the simulator's built-in GPS jamming — about 7 seconds of simulated time later the flight controller declared EKF failure, switched itself to LAND, touched down and disarmed. It neither flew away nor crashed. And reading the PX4 source turned up something counterintuitive: EKF2_GPS_CHECK has twelve gates, bit 9 is Spoofing and bit 11 is Jamming, but the default of 2047 only enables bits 0–10 — jamming detection ships off. The reason turns out to be sound: the estimator can catch jamming by itself, because the variances blow up. It cannot catch spoofing; only the receiver can tell it."
description: "Switching on GPS jamming in an ArduPilot SITL flight and recording the full event timeline, then reading PX4 EKF2's twelve GNSS quality gates and ArduPilot's three-source-set switching to explain how a flight controller reasons when satellite positioning fails; compared against the third module in Taiwan's cybersecurity spec and the fire agency's GPS-independent search-and-rescue drone."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-08-gps-jamming-flight-controller)

Taiwan's *Remotely Piloted Aircraft Cybersecurity Testing Specification* names three modules when it defines a product series: **flight control, communications, and the satellite-positioning chip module**. The [flight control post](/posts/tech/2026-08-08-px4-vs-ardupilot-en) and the [communications post](/posts/tech/2026-08-08-drone-radio-link-en) covered the first two. This is the third.

The [search-and-rescue piece](/posts/product/2026-08-07-drone-sar-value-en) also left a question hanging. The core specification of the fire agency's mountain-rescue drones is that they **do not depend on GPS**, because mountain terrain drops the signal. I wrote at the time that "the satellite-positioning box may simply be empty in this environment, and the flight controller has to carry it" — without saying how the flight controller actually carries it. This fills that in.

Same method as before: read the open source, plus one thing that is possible this time — **actually switch the jamming on in a simulator and watch**.

## 1. Switch the jamming on: the full event timeline

ArduPilot's SITL has GPS jamming built in (`SIM_GPS1_JAM`). I flew a quadcopter to 28 m, held position in GUIDED, and flipped that parameter from 0 to 1. What the flight controller said, with nothing removed:

```
[  21.8s] at 28.2 m, holding
[  29.9s] === switching SIM_GPS1_JAM on ===
[  32.0s] JAM [FC] GPS Glitch or Compass error
[  32.3s] JAM MODE -> LAND
[  32.3s] JAM [FC] EKF variance: over thresholds
[  32.3s] JAM [FC] EKF Failsafe: changed to Land Mode
[  33.7s] JAM [FC] EKF Failsafe
[  34.8s] JAM [FC] EKF3 lane switch 1
[  34.8s] JAM [FC] EKF3 primary changed:1
[  34.9s] JAM [FC] EKF3 lane switch 0
[  36.1s] JAM [FC] Vibration compensation ON
[  45.4s] JAM [FC] SIM Hit ground at 0.453997 m/s
[  46.2s] JAM [FC] Disarming motors
```

SITL was running at 3× speed, so 2.4 seconds of wall clock is **about 7 seconds of simulated time**. Within those seven seconds the flight controller detected the anomaly, declared EKF failure, switched itself to LAND, descended and disarmed. Touchdown at 0.45 m/s.

**It did not fly away and it did not crash.** Worth saying plainly, because "GPS jammed means drone out of control" is a common picture. For a correctly configured autopilot, GPS failure means **it lands where it stands**.

Two constants explain those seven seconds. The SITL jamming model in `libraries/SITL/SIM_GPS.cpp` is explicit:

```cpp
if (now_ms - jam.jam_start_ms < unsigned(1000U+(get_random16()%5000))) {
    // total loss of signal for a period at the start is common
    d.num_sats = 0;
    d.have_lock = false;
}
```

One to six seconds of total signal loss first, and only then the phase where satellite count bounces between 2 and 16, position wanders by ±200 m and velocity by ±400 m/s. On the ArduCopter side, the threshold in `ekf_check.cpp` is:

```cpp
#define EKF_CHECK_ITERATIONS_MAX 10  // 1 second (ie. 10 iterations at 10hz) of bad variances signals a failure
```

**A full second of bad variances is required.** Several seconds of blackout plus that second gives seven. The delay is not sluggishness, it is deliberate — without it, one ordinary signal wobble would bring the aircraft down.

Two more details. First, `EKF3 lane switch` and `primary changed` appear repeatedly: ArduPilot runs several EKF instances (lanes), and when the primary looks wrong it tries another. **It changes lanes before it hits the brakes.** Second, `EKF Failsafe` and `EKF Failsafe Cleared` alternate more than a dozen times during the jamming — because jamming is not a clean outage, it is **intermittent**, and intermittent is harder to handle than simply gone.

## 2. How the flight controller knows: PX4's twelve gates

ArduPilot uses variance as a composite indicator. PX4 takes another route: an explicit row of gates the data must pass before it enters the filter.

In `src/modules/ekf2/params_gnss.yaml`, `EKF2_GPS_CHECK` is a bitmask:

| Bit | Check | Threshold parameter |
|---|---|---|
| 0 | Satellite count | `EKF2_REQ_NSATS` (default 6) |
| 1 | PDOP | `EKF2_REQ_PDOP` |
| 2 | Horizontal accuracy EPH | `EKF2_REQ_EPH` (default 3.0 m) |
| 3 | Vertical accuracy EPV | `EKF2_REQ_EPV` (default 5.0 m) |
| 4 | Speed accuracy | `EKF2_REQ_SACC` (default 0.5 m/s) |
| 5 | Horizontal position drift | `EKF2_REQ_HDRIFT` |
| 6 | Vertical position drift | `EKF2_REQ_VDRIFT` |
| 7 | Horizontal speed offset | `EKF2_REQ_HDRIFT` |
| 8 | Vertical speed offset | `EKF2_REQ_VDRIFT` |
| **9** | **Spoofing** | — |
| 10 | GPS fix type | `EKF2_REQ_FIX` |
| **11** | **Jamming** | — |

Bits 5 through 8 carry a note in the documentation: they **run only when the vehicle is on the ground and stationary** — because there should be no drift when parked, so any drift means the GPS is lying. That is an elegant design: **using "I know I am not moving" as the reference that validates the sensor.**

## 3. The surprise: jamming detection is off by default

The default for `EKF2_GPS_CHECK` sits in the same file:

```yaml
default: 2047
```

2047 is 2¹¹ − 1 — **bits 0 through 10 on, bit 11 off**.

Against the table above: bit 9, Spoofing, is **on**. Bit 11, Jamming, is **off**.

My first reaction was that this must be backwards — jamming is far more common than spoofing. Opening the implementation explains it. Two lines in `EKF/aid_sources/gnss/gnss_checks.cpp`:

```cpp
_check_fail_status.flags.spoofed = gnss.spoofed;
_check_fail_status.flags.jammed  = gnss.jammed;
```

Neither flag is computed by the estimator. Both are **reported by the receiver**. Following it up to `EKF2.cpp`:

```cpp
.spoofed = vehicle_gps_position.spoofing_state == sensor_gps_s::SPOOFING_STATE_DETECTED,
.jammed  = vehicle_gps_position.jamming_state  == sensor_gps_s::JAMMING_STATE_DETECTED,
```

And above that, the GPS driver parsing a four-state field out of UBX messages (`UNKNOWN` / `OK` / `MITIGATED` / `DETECTED`).

Which makes the design choice make sense:

- **Jamming is something the estimator can catch on its own.** When the signal is suppressed, satellite count falls, accuracy blows out, position and velocity residuals diverge — the nine gates from bit 0 to bit 8 all fire. Enabling bit 11 adds one more source of information, and on a cheap receiver that source is often `UNKNOWN`, so switching it on can cause false positives.
- **Spoofing is something the estimator cannot catch.** A well-forged signal set has a normal satellite count, beautiful accuracy figures and clean residuals — every gate waves it through. **The only thing that might notice is the receiver itself** (anomalous signal power, clock jumps, inconsistent multi-constellation solutions). That bit has to be on, because there is no substitute.

**A good general rule falls out of this: what a system can infer for itself needs no dedicated flag; what it cannot infer is exactly what someone else has to tell it.** Jamming is loud, spoofing is quiet — and the quiet one is the one that needs its own detection bit.

## 4. ArduPilot's other route: three source sets, switch instead of fail

PX4's approach is to keep bad GPS outside the door. ArduPilot adds a layer: **define the fallback in advance, then switch to it**.

`libraries/AP_NavEKF/AP_NavEKF_Source.cpp` defines three complete source sets (`EK3_SRC1_*`, `EK3_SRC2_*`, `EK3_SRC3_*`), each specifying where five things come from:

| Parameter | Available sources |
|---|---|
| `n_POSXY` horizontal position | None / GPS / Beacon / ExternalNav |
| `n_VELXY` horizontal velocity | None / GPS / Beacon / **OpticalFlow** / ExternalNav / WheelEncoder |
| `n_POSZ` vertical position | None / **Baro** / RangeFinder / GPS / Beacon / ExternalNav |
| `n_VELZ` vertical velocity | None / Baro / RangeFinder / GPS / Beacon / ExternalNav |
| `n_YAW` heading | compass / GPS / ExternalNav and others |

Set one defaults to `POSXY=GPS`, `VELXY=GPS`, `POSZ=Baro`. Sets two and three can be swapped wholesale to optical flow or external navigation, and **an RC switch moves between them**.

This is what "does not depend on GPS" from the [search-and-rescue piece](/posts/product/2026-08-07-drone-sar-value-en) looks like at the code level: not removing GPS, but **having a GPS-free source combination ready in advance**. Horizontal position from external navigation (onboard visual positioning), horizontal velocity from optical flow, vertical position left to barometer and rangefinder.

Note that one box is already not GPS by default: **`POSZ` defaults to the barometer**. Even with GPS perfectly healthy, altitude does not trust it — GNSS vertical accuracy is inherently worse than horizontal (which is also why `EKF2_REQ_EPV` defaults to 5.0 m against 3.0 m horizontal). **"GPS-independent" is not a switch, it is replacing one box at a time.**

## 5. Back to Taiwan: the third module and the exam it faces

Three posts in, all three modules the cybersecurity spec names have had a pass, and they turn out to be quite different in nature:

| Module | Open-source readability | What this series found |
|---|---|---|
| Flight control | High (PX4 and ArduPilot fully open) | Common descent at the EKF layer; the real fork is the licence |
| Communications | Medium (ExpressLRS open, mainstream commercial closed) | No link encryption; channel count sets the legal power ceiling |
| Satellite positioning | Low (chip firmware closed, only the interface is visible) | The flight controller can only believe the flag the receiver reports |

The third is the least readable, and that is the point. Following the spoofing flag upward above ends at the door of the GPS module's firmware — **the flight controller cannot see inside, it can only take the receiver's word**. Listing "the satellite-positioning chip module" as one of three criteria for identifying a product series looks reasonable from here: that chip is the one link in the chain the flight controller cannot verify.

As for those fire-agency drones, [the TVBS report](https://news.tvbs.com.tw/local/3131121) describes the specification as "carrying an NVIDIA chip for onboard computation, flying visually, with no dependence on GPS." Translated through the framework above: switch `POSXY` from GPS to ExternalNav, with the ExternalNav supplied by visual positioning running on that NVIDIA chip. **The extra chip is not there to run AI recognition — it is there to replace the satellites.**

## 6. One line worth keeping

Reporting on GPS jamming in the Middle East, [BBC Chinese](https://www.bbc.com/zhongwen/articles/c80jnnpgev2o/trad) quoted Ramsey Faragher, director of the Royal Institute of Navigation:

> Soon, when we look back at this era of still using open GNSS signals, we will think: my god, we were mad.

His analogy is Wi-Fi — from fully open to universally encrypted. Civil GNSS signals carry no authentication and no encryption; anyone can generate a set that looks legitimate. That was not an oversight at design time, it was the default assumption of that era. And drones, ships and grid timing now all hang off it.

This is the third time this series has hit the same shape — an institution that has not kept up with how the thing is used. [The drone chapter has no privacy provision](/posts/policy/2026-08-07-drone-privacy-taiwan-en); [the "model aircraft radio control" clause offers only 72 MHz and one-way control](/posts/tech/2026-08-08-drone-radio-link-en); and now a positioning signal designed in the 1970s is carrying critical infrastructure in 2026.

## What this post does not answer

- **No spoofing experiment.** Only jamming was switched on. Simulating a signal set that looks entirely normal while carrying a false position, and watching the filter get fooled, is technically within the simulator's reach — but the output of that experiment reads more like an attack recipe than an explanation, so I did not run it. Everything said about spoofing here comes from the detection logic in the source.
- **No data from a real jamming environment.** The SITL jamming model is a developer's simplification, not a measured waveform. A real emitter's power, bandwidth and path loss would all change the conclusions.
- **No Taiwanese official record found.** I could not find any published CAA or NCC report or statistic on GNSS interference affecting drones. The Middle East and Ukraine have extensive public reporting; for Taiwan I have no primary source to cite, so I am not writing one.
- **Military signals are out of scope.** M-code, Galileo PRS and similar encrypted authorised signals are not civil, and not something a Taiwanese civil drone can use.

---

## References

**Primary: source code**

- [PX4/PX4-Autopilot — GitHub](https://github.com/PX4/PX4-Autopilot) (the twelve-bit `EKF2_GPS_CHECK` bitmask and its 2047 default plus the `EKF2_REQ_*` thresholds in `src/modules/ekf2/params_gnss.yaml`; the gate implementation in `src/modules/ekf2/EKF/aid_sources/gnss/gnss_checks.cpp` and `gnss_checks.hpp`; the receiver spoofing/jamming state conversion in `src/modules/ekf2/EKF2.cpp`; the four-state definitions in `msg/SensorGps.msg`)
- [ArduPilot/ardupilot — GitHub](https://github.com/ArduPilot/ardupilot) (`EKF_CHECK_ITERATIONS_MAX` and `failsafe_ekf_event()` in `ArduCopter/ekf_check.cpp`; the three source sets and their available sources in `libraries/AP_NavEKF/AP_NavEKF_Source.cpp`; `simulate_jamming()` and the `SIM_GPS1_JAM` parameter in `libraries/SITL/SIM_GPS.cpp`)
- [SIM_GPS.cpp — ArduPilot](https://github.com/ArduPilot/ardupilot/blob/master/libraries/SITL/SIM_GPS.cpp) (the jamming model: 1–6 seconds of total loss first, then satellite count, velocity, position and accuracy each drifting at their own rates)

**Background**

- [BBC Chinese — GPS jamming: the invisible battlefield in the Middle East](https://www.bbc.com/zhongwen/articles/c80jnnpgev2o/trad) (merchant AIS positions clustering into circles, European civil aviation affected, encrypted military M-code being far more jam-resistant, and the Royal Institute of Navigation director's remark on open GNSS) (in Mandarin)
- [TVBS — the fire agency's AI drone procurement](https://news.tvbs.com.tw/local/3131121) (the "NVIDIA chip, visual flight, no dependence on GPS" specification) (in Mandarin)
- [Remotely Piloted Aircraft Cybersecurity Testing Specification — Executive Yuan Gazette](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (the "satellite-positioning chip module" in the product-series definition) (in Mandarin)

**On this site**

- [PX4 or ArduPilot: the EKF derivation lives in the other project's repo, and the real fork is the licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en)
- [Frequency Hopping Is Not Encryption: Reading the ExpressLRS Source, and Finding That Taiwan Turns Channel Count Into a Power Ceiling](/posts/tech/2026-08-08-drone-radio-link-en)
- [Search and Rescue Drones: The One Application Whose ROI Isn't Money — and the Easiest Budget to Cut](/posts/product/2026-08-07-drone-sar-value-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [Why Countering Drones Is Hard: Jamming Is Failing, and Taiwan's Problem Isn't Only Technical](/posts/tech/2026-08-07-counter-drone-why-hard-en)
