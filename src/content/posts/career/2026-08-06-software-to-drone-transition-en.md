---
title: "From Software into Drones: Use the PX4 Architecture Diagram as a Job Map"
date: 2026-08-06
type: deep-dive
category: career
tags: [drone, career, software-engineering, uav, px4]
lang: en
tldr: "PX4's own architecture docs say the companion computer runs Linux because 'Linux is a much better platform for general software development than NuttX; there are many more Linux developers.' That sentence is the entry point. The three transition paths differ sharply in friction — CV and MAVLink work on the companion computer transfers almost directly, flight controller firmware means learning RTOS and work-queue constraints, and estimation and control means quaternions and Kalman filters."
description: "Using PX4's layered architecture as a map: three paths for software engineers moving into drones, what each requires, how much friction each carries, how to prove capability with SITL and real logs, and which layer actual job descriptions are asking for."
draft: false
series:
  name: "Drone Teardown"
  order: 4
---

> 🌏 [中文版](/posts/career/2026-08-06-software-to-drone-transition)

[The job map](/posts/career/2026-08-06-drone-industry-job-map-en) placed the software entry point at Layer 3 of the supply chain but didn't answer "what's the first step." This piece takes that down to specific modules and parameters.

**One caveat first: this is a skill-adjacency analysis derived from the technology stack and job descriptions, not an interview report.** I haven't interviewed anyone who made this transition, so "what interviewers actually screen for" and "how to negotiate salary" are outside what I can answer. What I can answer is which skills carry over, which need relearning, and what counts as knowing them.

## The PX4 architecture diagram is the job map

[PX4's architecture documentation](https://docs.px4.io/main/en/concept/architecture) splits the system into two layers:

```
Flight Controller                        Companion Computer
├─ RTOS: NuttX                          ├─ OS: Linux (sometimes Android)
├─ flight stack                         ├─ Computer vision
│   Estimator (EKF2)                    ├─ Image processing
│   Position / attitude / rate control  ├─ Cloud integration
│   Control allocation (mixing)         └─ High-level mission logic
├─ middleware                                    ↕ MAVLink
│   Sensor drivers, uORB message bus
└─ Hardware interfaces (I2C/SPI/CAN/UART)
```

And when PX4's docs explain why the companion computer runs Linux, they write this:

> Linux is a much better platform for "general" software development than NuttX; there are many more Linux developers and a lot of useful software has already been written (e.g. for computer vision, communications, cloud integrations, hardware drivers).

**That sentence is the answer.** The industry admits it: the right-hand column is for general software developers, the left-hand column isn't. The friction difference across the three paths comes entirely from which column you land in.

## Path one: the companion computer (lowest friction)

**What you do**: obstacle avoidance and object detection, image stabilization, model compression and latency optimization for onboard inference, mission logic, ground station data pipelines.

**Why it transfers**: this layer runs Linux, uses Python or C++, and lets you keep your entire toolchain. If you've done CV or model deployment, what changes is the application domain, not the skill tree.

**What you actually need to add is short**:

- **The MAVLink protocol** — the language between flight controller and companion computer, essentially a defined set of binary messages. A day with the docs gets you moving.
- **Power and latency budgets** — this is the real difference. Your inference must finish inside tens of watts and tens of milliseconds, and failure means a crash. Not new knowledge, new constraints.
- **Coordinate frame transforms** — body, inertial, and geographic frames. The most common bug source in this layer.

**In one line**: if you've done anything resembling "run a model on a resource-constrained device," the barrier here is mostly recalibrating constraints.

## Path two: flight controller firmware (medium friction)

**What you do**: sensor drivers, module development, fail-safe logic, hardware interfacing.

This layer runs NuttX (a BSD-licensed RTOS), modules communicate through the **uORB** publish/subscribe message bus, and the entire middleware runs in a **single address space** — memory is shared across all modules.

**What to add** (per PX4's docs):

- **Real-time thinking.** Modules run either as their own task (own stack and priority) or on a **work queue** (shared stack, less RAM, but **not allowed to sleep, not allowed to poll on a message, not allowed to do blocking IO**). That constraint overturns a lot of application-layer habits.
- **Fixed-size stacks.** Every task and thread has a fixed stack, and a periodic task checks remaining space via stack coloring. Nothing grows dynamically.
- **Timing awareness.** IMU drivers sample at 1kHz, integrate, and publish at 250Hz; the rate controller runs at 800Hz by default; EKF2's delayed-time filter is hardcoded to 100Hz. **Which frequency your code hangs off determines how it can be written.**

**In one line**: a natural extension for C/C++ embedded or real-time backgrounds; pure application-layer developers must first accept "no malloc, no waiting."

## Path three: estimation and control (highest friction)

**What you do**: EKF2 tuning and extension, sensor fusion, controller design and tuning.

The barrier here isn't engineering, it's mathematics. One look at PX4's multicopter control cascade makes that clear:

```
Position setpoint → [position controller, P]  → velocity setpoint
                  → [velocity controller, PID] → acceleration setpoint
                  → [attitude controller, quaternion] → rate setpoint
                  → [rate controller, PI] → torque command
                  → [control allocation / mixing] → per-motor output
```

**What to add**:

- **Cascaded control and how PID actually behaves** — not the formula, but what integrator windup looks like and why anti-reset windup needs clamping
- **Quaternions.** PX4's attitude controller uses quaternions rather than Euler angles to avoid gimbal lock. This is something you only know after working through it.
- **The Kalman filter family.** EKF2 is the core of this layer; understanding its state vector and observation model is the entry barrier.
- **Control allocation.** Mixing is essentially solving a matrix pseudo-inverse (Moore-Penrose) — translating a torque demand like "yaw right" into per-motor speeds while respecting limits.

**In one line**: the highest-return path ([the job map](/posts/career/2026-08-06-drone-industry-job-map-en) puts it among the least substitutable Layer 3 cells), but if you haven't touched control theory or state estimation since university, budget in quarters, not weeks.

## Proving capability: three stages

There is no LeetCode here; you prove it with work. And it's cheaper than you'd think.

**Stage one: SITL (software in the loop)**
PX4's middleware includes a simulation layer letting flight code run on a desktop OS and control a simulated vehicle. **You can modify code, fly missions, and inspect results without buying any hardware.** This is the most software-friendly fact about the field — the marginal cost of starting is near zero.

**Stage two: read real logs**
PX4's `logger` module writes uORB topics into ULog files, uploadable to Flight Review for analysis. **Being able to read "why this flight oscillated" out of a log is more persuasive than reciting control theory** — and public logs are everywhere, so you don't need your own aircraft.

**Stage three: actually fly**
Only here do you need hardware and a [licence](/posts/policy/2026-08-06-taiwan-drone-license-guide-en). As [the job map](/posts/career/2026-08-06-drone-industry-job-map-en) noted, an engineer who can fly their own tests has a debug loop one round shorter — and that's hard to fake on a CV.

**The order is one, two, three — not three, one, two.** Many people assume they need hardware first; the first two stages already produce demonstrable work.

## Against an actual job description

Taking [a public drone engineer listing](https://www.yourator.co/companies/valtec/jobs/37748):

| Requirement | Corresponding layer |
|---|---|
| Proficient in C/C++, Python | All three paths |
| Familiar with drone comms protocols (e.g. MAVLink) and sensor tech | Paths one and two |
| Familiar with flight principles, dynamics, control systems | **Path three** |
| Writing and debugging embedded software | **Path two** |
| Participating in flight testing, collecting and analyzing data | Stages two and three |
| Developing autonomous navigation, obstacle avoidance, precision landing | Paths one and three |

**Note that this JD asks for all three paths at once.** That's normal here — teams are small, so a single opening covers more ground than at a large company. For a career changer that means: **you don't need all three, but you need to articulate which one you're deep in and how much of the other two you understand.**

## Three honest caveats

**One: scale.** [The job map](/posts/career/2026-08-06-drone-industry-job-map-en) ran the numbers — Taiwan's entire aviation industry projects roughly 267–296 new specialist positions a year, and drones are a slice of that. Good opportunity, small absolute volume. Don't picture internet-industry job density.

**Two: transferability matters more than industry outlook.** Path one (CV/edge AI) and path three (estimation and control) apply across robotics, automotive, and industrial control; path two's RTOS and driver experience does too. **Pick what you can carry out, not what only pays inside drones.**

**Three: policy risk is real.** [Roughly 80% of output comes from public-sector and defense procurement](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en), so budget rhythm propagates into headcount. Asking an interviewer what share of revenue comes from public tenders is both reasonable and necessary.

## References

**Flight control technology**

- [PX4 — Architectural Overview](https://docs.px4.io/main/en/concept/architecture) (two layers, uORB, NuttX, task vs. work queue)
- [PX4 — System Architecture](https://docs.px4.io/main/en/concept/px4_systems_architecture) (flight controller vs. companion computer, and why the latter runs Linux)
- [PX4 — Controller Diagrams](https://docs.px4.io/main/en/flight_stack/controller_diagrams) (multicopter cascade, quaternion attitude control, TECS)
- [PX4 — uORB Messaging](https://docs.px4.io/main/en/middleware/uorb)
- [PX4 — Overview of multicopter control from sensors to motors (Developer Summit slides)](https://px4.io/wp-content/uploads/2020/10/PX4-Developer-Summit-2020-Overview-of-multicopter-control-from-sensors-to-motors.pdf) (full data flow with source paths)
- [ArduPilot](https://ardupilot.org/)

**Job listing**

- [Yourator — Drone engineer listing (Valtec)](https://www.yourator.co/companies/valtec/jobs/37748) (in Chinese)

**On this site**

- [The Drone Industry Job Map: Eleven Roles, and Which Ones a Software Person Can Actually Enter](/posts/career/2026-08-06-drone-industry-job-map-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [Getting a Taiwanese Drone Licence: Tiers, the No-Skipping Rule, Fees, and Timeline](/posts/policy/2026-08-06-taiwan-drone-license-guide-en)
