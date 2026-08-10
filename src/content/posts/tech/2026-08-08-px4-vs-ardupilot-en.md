---
title: "PX4 or ArduPilot: The Real Fork Is the Licence"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, flight-controller, px4, ardupilot, open-source]
lang: en
tldr: "Six posts in this series mention PX4 and ArduPilot; none of them says which to pick. After cloning both and building each once on a laptop, three things did not match what I assumed. First, the header of ArduPilot's EKF3 points straight at https://github.com/PX4/ecl for its derivation, and Paul Riseborough — who converted it from MATLAB to C++ — is listed as a maintainer on both projects. The two stacks share their hardest layer. Second, the contributor structure is the inverse of the stereotype: PX4's last twelve months come from company domains (Auterion alone accounts for 380 commits), ArduPilot's from personal mailboxes, and ArduPilot is far more concentrated (one person, 1,589 commits, 37%). Third, what actually decides the choice is not performance. It is BSD-3 versus GPLv3, and which layer you intend to modify — ArduPilot lets you change behaviour by dropping a .lua file on the SD card; PX4 expects you to talk to it from outside over ROS 2."
description: "Cloning PX4 and ArduPilot, building each on a laptop and flying one SITL sortie, then comparing the two flight stacks on reproducible numbers: licensing, extension point, board and driver coverage, twelve months of contributor structure and release cadence — plus what building your own flight controller actually means."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-08-px4-vs-ardupilot)

Twenty-three posts into this series, PX4 shows up in six of them and ArduPilot in three — the [industry map](/posts/tech/2026-08-06-drone-industry-map-en), the [job map](/posts/career/2026-08-06-drone-industry-job-map-en), the [software-to-drone transition piece](/posts/career/2026-08-06-software-to-drone-transition-en), the [education paths](/posts/education/2026-08-06-taiwan-drone-education-paths-en), the [crash anatomy](/posts/tech/2026-08-07-drone-crash-anatomy-en), and the [search-and-rescue piece](/posts/product/2026-08-07-drone-sar-value-en) (the three ArduPilot mentions sit inside those same six). **Six posts, and not one of them explains how the two differ or which to choose.**

This is also the topic where I have the least excuse. Some earlier pieces waited on government data or tender records. This one needs neither: both are open-source projects, the source is on GitHub, the licence sits in the repo root, the maintainer list is a plain text file, and a year of commit history is one `git log` away. If I left it sitting, it was probably because some part of me filed "technical topic" under "needs hardware."

That assumption was wrong. This post is the record of taking it apart.

## Get both running first: two-and-a-bit minutes each, on a four-core box

Every number below comes from HEAD on 2026-08-08 — PX4-Autopilot `9673ae5`, ArduPilot `a4da362`. All of it is reproducible.

ArduPilot:

```bash
git clone --depth 1 https://github.com/ArduPilot/ardupilot.git
cd ardupilot && git submodule update --init --recursive --depth 1
./waf configure --board sitl && ./waf copter
```

The result is a 5.7 MB `arducopter` binary, **2 min 46 s** wall clock (9 min 06 s of CPU across four cores). On the PX4 side, `make px4_sitl_default` — 1,185 ninja targets, **2 min 09 s** wall (6 min 15 s CPU).

What actually got in the way was not compilation, it was Python dependencies: `empy==3.3.4` will not build a wheel on Python 3.11, and I ended up dropping the single `em.py` file from the sdist into site-packages by hand; ArduPilot's `AP_Networking` will not compile until every submodule is initialised; PX4 stops at the configure step without `kconfiglib`. **That is the real barrier here — not hardware, dependencies.**

With it running, I connected to TCP 5760 with pymavlink and flew a sortie: arm, climb to 20 m, translate 200 m north, switch to LAND, touch down and disarm. One stretch of what the flight controller reported is worth reading:

```
[FC] EKF3 IMU0 initialised
[FC] AHRS: EKF3 active
[FC] Arm: Need Position Estimate
[FC] PreArm: Need Position Estimate
[FC] EKF3 IMU0 is using GPS
[FC] Arming motors
```

It refused to arm until EKF3 had a position estimate. That is the same thing the [crash anatomy piece](/posts/tech/2026-08-07-drone-crash-anatomy-en) called Layer 2 — the safety interlock is not a bolt-on, it is the aircraft refusing to enter the next state.

Peak ground speed during the flight was **10.1 m/s**. Asking the flight controller for the parameter: `WP_SPD = 10.0`. It flew at exactly its default. And `PARAM_REQUEST_LIST` on a stock SITL copter reports **1,408 parameters** — probably the most direct measure there is of how large a flight stack's configuration surface really is.

(Incidentally, the master build I ran reports firmware 4.8.0 while the newest stable tag is Copter-4.7.0; this version renamed `WPNAV_SPEED` to `WP_SPD` and changed the units from cm/s to m/s. That rename comes back later, in the section on building your own.)

## Finding one: ArduPilot's EKF derivation lives in PX4's repo

Open `libraries/AP_NavEKF3/AP_NavEKF3.h`. Lines one through five read:

```
/*
  24 state EKF based on the derivation in https://github.com/PX4/ecl/
  blob/master/matlab/scripts/Inertial%20Nav%20EKF/GenerateNavFilterEquations.m

  Converted from Matlab to C++ by Paul Riseborough
```

The same URL appears once each in `AP_NavEKF3_MagFusion.cpp`, `AP_NavEKF3_PosVelFusion.cpp`, `AP_NavEKF3_AirDataFusion.cpp` and `AP_NavEKF3_OptFlowFusion.cpp`. Which is to say: **ArduPilot's state estimator has its derivation script hosted in PX4's repo.**

And Paul Riseborough, the person who converted that MATLAB to C++, appears on both maintainer lists — PX4's `MAINTAINERS.md` lists him under State Estimation, ArduPilot's `README.md` lists him under `AP_NavEKF2` and `AP_NavEKF3`.

This reframed the whole topic for me. Outside coverage tends to write PX4 versus ArduPilot as two camps in opposition, but at the **hardest layer in the entire stack** — fusing IMU, GPS, magnetometer, barometer and optical flow into one position and attitude estimate — the two are common-descent, with the same person credited on both sides.

So "which one flies more accurately" probably answers to "about the same, because that part is the same mathematics." The real differences are somewhere else.

## Finding two: the contributor structure is the inverse of the stereotype

The usual line is that PX4 is the commercial one and ArduPilot is the community one. I pulled twelve months of commits, 2025-08-01 to 2026-08-08, and counted:

| | PX4-Autopilot | ArduPilot |
|---|---|---|
| Commits in 12 months | 2,983 (645 of them build bots) | 4,245 (no bot commits) |
| Human commits, bots removed | 2,326 | 4,245 |
| Distinct authors | 254 (human) | 243 |
| Top-5 share | 44.7% | **63.9%** |
| Top-10 share | 56.2% | **74.3%** |
| Largest single author | Jacob Dahl, 383 | **Peter Barker, 1,589 (37.4%)** |

Removing the bots matters: PX4 has two build-bot accounts contributing 645 commits, 22% of its total; ArduPilot has none. **Any leaderboard that compares raw commit counts gives the wrong answer here.**

The author email domains say more still.

PX4's leaders: `px4.io` 653, **`auterion.com` 380**, `nxp.com` 46, `modalai.com` 43, `arkelectron.com` 22, `rigi.tech` 23, `cuav.net` 14.

ArduPilot's leaders: `barker.dropbear.id.au` 1,590, `gmail.com` 1,019, `yahoo.com` 336, `icloud.com` 281, `andypiper.com` 215, `hotmail.co.uk` 136, `tridgell.net` 96.

Company domains on one side, personal mailboxes on the other. PX4's README says "vendor neutral governance" and "No single vendor controls the roadmap" — and at the governance layer that holds: the project sits under the Dronecode Foundation (a Linux Foundation collaborative project), which holds the trademarks. But **the hands writing the code are not neutral**: one company, Auterion, across 28 distinct author identities, accounts for 16% of human commits.

The two structures carry risk in different directions, and both risks are real:

- Depend on ArduPilot and your exposure is to **individuals** — one person is 37% of the top five. That is a textbook bus-factor problem.
- Depend on PX4 and your exposure is to **one company's willingness to keep investing** — if Auterion changes strategy, 16% of output goes, concentrated in the architecture layer.

Worth noting in passing: `modalai.com` and `arkelectron.com` both appear in PX4's commit log. Products from both companies are on the US Department of Defense's Blue UAS list — the list the [industry map](/posts/tech/2026-08-06-drone-industry-map-en) covered. The same log also contains `cuav.net`, a Chinese flight-controller maker. Open-source contributor lists do not cut along supply-chain political lines.

## The real fork, part one: BSD-3 versus GPLv3

If you remember one thing, make it this.

- **PX4-Autopilot** — `LICENSE`, first line: `BSD 3-Clause License`, `Copyright (c) 2012 - 2025, PX4 Development Team`.
- **ArduPilot** — `COPYING.txt`: `GNU GENERAL PUBLIC LICENSE Version 3`. The README's License section confirms it.

What those two demand of "modify it, then sell it" differs at the root. BSD-3 asks you to retain the copyright notice. GPLv3 requires that when you distribute the binary, you offer the corresponding source under the same licence — including your own changes.

For three roles that means three different things:

| Who you are | BSD-3 (PX4) | GPLv3 (ArduPilot) |
|---|---|---|
| Flying it yourself, shipping nothing | No difference | No difference |
| Selling hardware with modified firmware | No source obligation | Must offer modified source to the buyer |
| Selling to government or defence | No source obligation | Same, and the recipient may redistribute |

I want to be careful not to overstate this. **GPLv3 does not forbid commercial use, and it does not require you to publish to the world** — it requires you to supply the people who received the binary. A lot of GPL fear is inflated. But for a company whose differentiation is firmware changes, "the changes must go to the customer" and "the changes can stay in-house" are two different business models, and that gets decided before the first line of code is written.

Which is why "which one performs better" is almost never the actual decision point. By the time you can measure a performance difference, the licence has already cut your options in half.

## The real fork, part two: which layer you intend to modify

The second fork is closer to daily work. Say you want the aircraft to do something it does not ship with — trigger an external device at a waypoint, change the mission when the battery drops below a threshold, adjust the route from a payload's telemetry. Where does that get written?

**ArduPilot's answer is Lua, inside the flight controller.** Under `libraries/AP_Scripting` there are 50 applets, 161 examples and 15 drivers written in Lua. The mechanism, per its own README: put the `.lua` file in the SD card's `APM/scripts` folder, set the `SCR_ENABLE` parameter to 1, reboot. Boards with more than 1 MB of flash have scripting compiled in by default.

I tried it. A 12-line Lua file in the SITL working directory, `SCR_ENABLE=1`, reboot, and the flight controller emits:

```
[FC] ArduPilot Ready
[FC] hello.lua loaded
[FC] lua tick 1: no position yet
[FC] EKF3 IMU0 initialised
[FC] lua tick 3: alt 584.1 m, batt 12.6 V
```

No compiler, no reflash, no C++. To change behaviour, change one file.

**PX4's answer is ROS 2, outside the flight controller.** PX4 has no scripting layer. The `uxrce_dds_client` module bridges uORB topics to DDS, and `dds_topics.yaml` defines the external interface: **32 published topics and 38 subscribed** (`/fmu/out/*` and `/fmu/in/*`). Your logic runs on a companion computer as ROS 2 nodes, talking to the flight controller across those 70 topics.

The two designs reflect different architectural beliefs, and you can see the difference in the shape of the source:

- PX4 is **pub/sub**. Sixty modules under `src/modules` exchange 224 message types over uORB. Modules do not call each other directly; each is a parallel task. Those 60 modules have 61 Kconfig switches, and the drivers add 230 more — you can switch off what you do not need, one item at a time.
- ArduPilot is **a schedule table**. `ArduCopter/Copter.cpp` holds a 56-entry `SCHED_TASK` table, each row naming the function, the rate in Hz, the maximum permitted execution time in microseconds, and the priority: `SCHED_TASK(rc_loop, 250, 130, 3)`. The entire aircraft's time budget fits in one readable file.

Which is better? It depends on what you are building. **For a not-too-heavy piece of logic inside the flight controller, the Lua route is far faster; for computer vision, SLAM or learned planning — none of which fits on a flight controller MCU anyway — PX4's ROS 2 interface is designed for exactly that.** (ArduPilot has `AP_DDS` too, but at much smaller scale; PX4's Lua equivalent does not exist.)

## Coverage: ArduPilot supports more boards than PX4

Each project's own code, submodules excluded, raw line counts including comments and blanks:

| | PX4-Autopilot | ArduPilot |
|---|---|---|
| Main body | `src/` 736,894 lines | `libraries/` 733,635 lines |
| Breakdown | modules 337,642 / drivers 284,447 / lib 89,276 | 153 libraries |
| Vehicle layer | split by module (multirotor / fixed-wing / VTOL / rover / spacecraft) | ArduCopter 30,114 lines, ArduPlane 31,438 |
| Platform layer | `platforms/` 105,196 lines | 6 HAL backends (ChibiOS / Linux / ESP32 / QURT / SITL / Empty) |
| Board configs | 291 `.px4board` files, 44 vendor directories | **457 ChibiOS hwdef directories** |
| Submodules | 35 | 15 |

The scale is remarkably close, which was itself unexpected. The difference is shape: PX4 makes vehicle type a module (hence a spacecraft module), ArduPilot makes it six separate vehicle directories. On **board support** ArduPilot leads clearly — 457 to 291.

Release cadence is nearly identical too. Taking the commit date of each project's major tags:

| PX4 | Date | ArduPilot Copter | Date |
|---|---|---|---|
| v1.13.0 | 2022-06-04 | Copter-4.3.0 | 2022-10-31 |
| v1.14.0 | 2023-08-10 | Copter-4.4.0 | 2023-08-18 |
| v1.15.0 | 2024-08-23 | Copter-4.5.0 | 2024-04-02 |
| v1.16.0 | 2025-08-05 | Copter-4.6.0 | 2025-05-20 |
| v1.17.0 | 2026-01-16 | Copter-4.7.0 | 2026-07-14 |

Roughly one major release a year on both sides. **"Which project is more active" is not a question release frequency can answer.**

## So what about building your own?

When people in Taiwan talk about an in-house flight controller, they rarely mean starting from an empty file. Going by the numbers above, writing a production-grade stack from scratch means matching: two hundred-plus contributors producing two to four thousand commits a year, seven hundred thousand-plus lines of code, support for four hundred-plus boards, and a state estimator validated across hundreds of thousands of flight hours. That is not a budget problem, it is a time problem.

In practice "in-house" means a **fork**, and a fork's cost is in maintenance, not in the first version:

1. **Merge conflicts compound.** Upstream moves two to four thousand commits a year. The deeper your changes, the more each sync costs.
2. **Small things like renames bite.** Copter 4.8 renamed `WPNAV_SPEED` to `WP_SPD` and changed the units from cm/s to m/s. Your ground station, your parameter files, your factory-configuration scripts all have to follow.
3. **The licence forks with you.** Anything forked from ArduPilot is still GPLv3. Forking does not wash off the obligation.
4. **You inherit the whole driver chain.** Upstream supports 457 boards not because it is clever but because 457 groups of people maintain their own. After a fork, only you maintain yours.

The genuinely sensible version of "in-house" is usually three much smaller things: **your own board** (a hwdef or px4board — upstream is built to support exactly this), **your own driver** (for your own payload), and **your own mode or script** (a Lua applet or a PX4 module). None of those requires a fork, and between them they cover most of what "we need our own flight controller" is actually trying to achieve.

## Back to Taiwan: the cybersecurity spec governs modules, not firmware

The [spec-sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) unpacked how the *Remotely Piloted Aircraft Cybersecurity Testing Specification* defines a "product series":

> Meeting the series definition in the CAA's "Application Guide and Inspection Procedure for Remotely Piloted Aircraft with 2–25 kg Maximum Take-off Weight", **with identical flight-control, communications and satellite-positioning chip modules**.

The phrase is "chip modules." **The text describes hardware and never mentions firmware.** Read literally, flashing PX4 or ArduPilot onto the same flight-control board does not make two series under this definition.

I want to mark this clearly as **a literal reading of the text, not a conclusion**. Cybersecurity testing covers firmware aspects by design, and how a designated testing body actually treats a firmware swap — whether it triggers a retest — is a question for that body, not something reading the regulation can answer. I include it because it extends the [spec-sheet piece's](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) conclusion: the regulation has already marked the three modules it cares about, and firmware is not one of them.

## What this post does not answer

- **Nothing flew on real hardware.** All of the above is SITL. A simulator is worth something for validating logic and parameters, and nothing for vibration, electromagnetic interference, temperature or battery ageing — the two TTSB reports in the [crash anatomy piece](/posts/tech/2026-08-07-drone-crash-anatomy-en) failed in ways no simulator would catch.
- **No comparison of flight quality.** Comparing PID tuning, attitude-loop response or wind rejection needs the same airframe flown on both firmwares. I do not have an airframe.
- **No third option covered.** Beyond these two there is Betaflight/INAV (the racing and FPV branch, a completely different use case from this post) and various closed commercial flight controllers. This post covers open-source autopilots only.
- **No adoption data for Taiwanese makers.** Who uses which is not in the public record, and I am not inventing it.

---

## References

**Primary: source code (retrieved 2026-08-08, PX4 `9673ae5` / ArduPilot `a4da362`)**

- [PX4/PX4-Autopilot — GitHub](https://github.com/PX4/PX4-Autopilot) (`LICENSE` BSD 3-Clause; `MAINTAINERS.md` Code Owners split; the Dronecode governance section of `README.md`; 60 modules under `src/modules`; 224 uORB types in `msg/`; 291 configs under `boards/`)
- [ArduPilot/ardupilot — GitHub](https://github.com/ArduPilot/ardupilot) (`COPYING.txt` GPLv3; the maintainer list in `README.md`; 153 libraries under `libraries/`; 457 boards under `AP_HAL_ChibiOS/hwdef`; the 56-entry SCHED_TASK table in `ArduCopter/Copter.cpp`)
- [AP_NavEKF3.h — ArduPilot](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_NavEKF3/AP_NavEKF3.h) (header points directly at the PX4/ecl MATLAB derivation script; converted by Paul Riseborough)
- [PX4/ecl — GitHub](https://github.com/PX4/ecl) (the repo hosting the derivation script ArduPilot's EKF3 header cites; PX4 has since merged the EKF into `src/modules/ekf2/EKF`)
- [AP_Scripting README — ArduPilot](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Scripting/README.md) (scripts in the SD card's `APM/scripts`, `SCR_ENABLE=1`, compiled in by default above 1 MB of flash)
- [dds_topics.yaml — PX4](https://github.com/PX4/PX4-Autopilot/blob/main/src/modules/uxrce_dds_client/dds_topics.yaml) (32 published and 38 subscribed topics exposed to ROS 2)

**Licences**

- [BSD 3-Clause License — Open Source Initiative](https://opensource.org/license/bsd-3-clause)
- [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)
- [ArduPilot — Licensing overview](https://ardupilot.org/dev/docs/license-gplv3.html) (the project's own account of its GPLv3 obligations)

**Documentation**

- [PX4 — uORB Messaging](https://docs.px4.io/main/en/middleware/uorb.html)
- [PX4 — ROS 2 User Guide](https://docs.px4.io/main/en/ros2/user_guide.html)
- [ArduPilot — SITL Simulator](https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html)
- [Remotely Piloted Aircraft Cybersecurity Testing Specification — Executive Yuan Gazette](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (product-series definition)

**On this site**

- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [Taking Apart Two TTSB Crash Reports: Neither Was the Operator's Fault](/posts/tech/2026-08-07-drone-crash-anatomy-en)
- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [The Drone Industry Job Map: Eleven Roles, and Which Ones a Software Person Can Actually Enter](/posts/career/2026-08-06-drone-industry-job-map-en)
- [From Software into Drones: Use the PX4 Architecture Diagram as a Job Map](/posts/career/2026-08-06-software-to-drone-transition-en)
