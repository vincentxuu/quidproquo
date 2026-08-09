---
title: "A Flight Controller's Autonomy Has a Complete List — 56 Entries, and Exactly One Is About an Opportunity"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, autonomy, ardupilot, px4, machine-learning]
lang: en
tldr: "\"Autonomy evolves: waypoint → learned → end-to-end\" is the standard line on every drone technology roadmap, and it assumes a continuous spectrum. The source says otherwise. ArduPilot has an enum called ModeReason, and every time the aircraft changes its own flight mode it must supply one — so that enum is the exhaustive list of on-board autonomous decisions. Fifty-six values, no more. Classified: 9 are human commands, 4 are boot states, and the remaining 43 are the aircraft deciding for itself. Of those, 21 are 'something dangerous was detected' (failsafes, fence, EKF failure, battery, crash, forced landing), 16 are procedural state transitions (mission end, flip complete, RTL switching to landing) and 6 are soaring. **In the whole list, exactly one — SOARING_THERMAL_DETECTED — is the aircraft changing behaviour because it found an opportunity. Every other autonomous act is because it found a problem.** As for end-to-end: PX4 mainline genuinely has one, mc_nn_control, 15 inputs and 4 outputs, publishing straight to actuator_motors and bypassing the entire cascaded PID stack — with a TensorFlow Lite Micro tensor arena of 10 KB and a Kconfig default of n. ArduPilot mainline has none. So in the mainline the 'spectrum' is really two separate things sitting side by side: 56 rule-based decisions almost entirely built for safety, and one ten-kilobyte module that ships switched off."
description: "Classifying every entry in ArduPilot's ModeReason enum to show that flight-controller autonomy is almost entirely safety decisions rather than mission decisions, then reading PX4's mc_nn_control end-to-end neural network module to show that waypoint-to-end-to-end is not a continuous spectrum in mainline code."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-09-drone-autonomy-modereason)

This is the last cell in the drone series' technical block, and the topic was originally written as "autonomy evolves: waypoint → learned → end-to-end."

Before writing it I asked one question, because the topic itself smuggles in an assumption: **it assumes waypoint-to-end-to-end is a continuous spectrum with many rungs in between.** Is that right?

Reading the source, no. And the way it's wrong is more concrete than I expected.

## 1. First, a definition of "autonomy" you can count

"Autonomy" is a slippery word. In ArduPilot it has a very hard definition, because every time the aircraft changes its own flight mode it must supply a **reason**:

```c
// libraries/AP_Vehicle/ModeReason.h
enum class ModeReason : uint8_t {
  UNKNOWN = 0,
  RC_COMMAND = 1,
  GCS_COMMAND = 2,
  RADIO_FAILSAFE = 3,
  ...
  FENCE_REENABLE = 55,
};
```

It's the second argument to `set_mode()`. So this enum is not documentation and not a design diagram — **it is the exhaustive list of reasons this aircraft will change its own behaviour**, and the compiler guarantees there is no fifty-seventh.

Quoting ArduPilot mainline: `ModeReason.h` currently holds **56 values** (0 through 55).

## 2. Classifying all 56

Going through them one at a time, they fall into five piles:

| Category | Count | Contents |
|---|---|---|
| **Human commands** (not autonomy) | 9 | `RC_COMMAND`, `GCS_COMMAND`, `MISSION_CMD`, `AUX_FUNCTION`, `SCRIPTING`, `DDS_COMMAND`, `FRSKY_COMMAND`, `SERVOTEST`, `TOY_MODE` |
| Boot / state | 4 | `UNKNOWN`, `INITIALISED`, `STARTUP`, `UNAVAILABLE` |
| **Danger detected → failsafe** | **21** | `RADIO_FAILSAFE`, `BATTERY_FAILSAFE`, `GCS_FAILSAFE`, `EKF_FAILSAFE`, `GPS_GLITCH`, `FENCE_BREACHED`, `TERRAIN_FAILSAFE`, `CRASH_FAILSAFE`, `LEAK_FAILSAFE`, `BAD_DEPTH`, `DEADRECKON_FAILSAFE`, `AVOIDANCE`, `TERMINATE`… |
| Procedural state transitions | 16 | `MISSION_END`, `FLIP_COMPLETE`, `THROW_COMPLETE`, `RTL_COMPLETE_SWITCHING_TO_VTOL_LAND_RTL`, `QLAND_INSTEAD_OF_RTL`… |
| Soaring | 6 | `SOARING_THERMAL_DETECTED`, `SOARING_ALT_TOO_HIGH`, `SOARING_ALT_TOO_LOW`, `SOARING_DRIFT_EXCEEDED`… |

Subtracting human commands and boot states, **43 entries are the aircraft deciding for itself, and 21 of them — nearly half — are "danger detected."**

And those 16 procedural transitions aren't really judgements: the mission finished, the flip completed, RTL arrived overhead so it switches to landing. That's a state machine advancing, not an aircraft weighing anything.

So what the aircraft actually judges for itself lands almost entirely in the danger pile.

## 3. Exactly one entry isn't about avoiding harm

Lay out the six soaring entries:

| Value | What it means |
|---|---|
| `SOARING_ALT_TOO_HIGH` | too high, stop circling |
| `SOARING_ALT_TOO_LOW` | too low, give up |
| `SOARING_DRIFT_EXCEEDED` | drifted too far, give up |
| `SOARING_THERMAL_ESTIMATE_DETERIORATED` | the thermal estimate got worse, give up |
| `SOARING_FBW_B_WITH_MOTOR_RUNNING` | motor still running, wrong state |
| **`SOARING_THERMAL_DETECTED`** | **found a thermal, go use it** |

The first five are constraints and abort conditions. Only the last one is something else:

```c
// ArduPlane/soaring.cpp
// Test for switch into THERMAL mode
if (g2.soaring_controller.check_thermal_criteria()) {
    gcs().send_text(MAV_SEVERITY_INFO, "Soaring: Thermal detected, entering %s", mode_thermal.name());
    set_mode(mode_thermal, ModeReason::SOARING_THERMAL_DETECTED);
```

**Across 56 reasons, `SOARING_THERMAL_DETECTED` is the only one where the aircraft changes behaviour because it found an opportunity.** Every other act of autonomy is because it found a problem.

That sentence is worth pausing on:

> **Open-source flight-controller autonomy is almost entirely "don't crash" autonomy, not "do the mission better" autonomy.**

And the single exception is glider-specific — it serves endurance, which in a sense is still about not coming down.

This explains something I kept hitting in this series. [The light-show post](/posts/tech/2026-08-09-drone-swarm-light-show-en) found zero coordination between two hundred aircraft and zero on-board decision-making, which felt surprising at the time; [the GPS-jamming post](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) measured the flight controller switching itself to LAND, which was a genuine decision. **Now it's clear why the latter exists: it belongs to those 21 entries, as `EKF_FAILSAFE`. The decisions a flight controller is willing to make on its own are that kind.**

## 4. What about end-to-end? Mainline really has one

That was the rule-based end. What about the other end?

I expected to write "mainline has nothing." It does have something — **but only in PX4, and its scale will recalibrate how you picture this topic.**

```
px4/src/modules/mc_nn_control/
px4/src/lib/tensorflow_lite_micro/
```

That's a negative result plus a positive one, so here is the search, written out so it can be rerun (restricted to source extensions, to avoid false positives from images and `.mat`/`.slx` binaries):

```bash
grep -rilE "tflite|tensorflow|onnxruntime|libtorch|MicroInterpreter|kTensorArena|neural.?net"   <repo> --include=*.cpp --include=*.h --include=*.hpp --include=*.c | wc -l
```

```
ArduPilot (libraries + ArduCopter/Plane/Sub/Rover):    0
PX4 (src/):                                         420
```

**Not one file in ArduPilot mainline. PX4 mainline has TensorFlow Lite Micro vendored wholesale into the flight code**, plus a module.

The module's own description reads:

```
### Description
Multicopter Neural Network Control module.
This module is an end-to-end neural network control system for multicopters.
It takes in 15 input values and outputs 4 control actions.
Inputs: [pos_err(3), att(6), vel(3), ang_vel(3)]
Outputs: [Actuator motors(4)]
```

**Fifteen inputs, four outputs. In: position error, attitude, velocity, angular velocity. Out: four motors.**

What it publishes shows how total that is:

```c
// mc_nn_control.hpp
// Publications
#include <uORB/topics/actuator_motors.h>
```

It publishes `actuator_motors` — **the lowest level there is. It bypasses the position loop, the velocity loop, the attitude loop and the rate loop; the entire cascaded PID stack is skipped.** This is end-to-end in the literal sense.

Then its size:

```c
// mc_nn_control.cpp
constexpr int kTensorArenaSize = 10 * 1024;
static uint8_t tensor_arena[kTensorArenaSize];
_interpreter = new tflite::MicroInterpreter(control_model, resolver, tensor_arena, kTensorArenaSize);
```

**A ten-kilobyte tensor arena.**

And whether it's on by default:

```
# mc_nn_control/Kconfig
menuconfig MODULES_MC_NN_CONTROL
	bool "mc_nn_control"
	default n
```

**`default n`.**

## 5. So what does that "spectrum" actually look like?

Side by side:

| | The rule-based end | The learned end |
|---|---|---|
| Where | ArduPilot + PX4, core of mainline | PX4 only, `default n` |
| Scale | 56 enumerated reasons, failsafe logic across dozens of files | 10 KB tensor arena |
| What it decides | almost entirely "danger detected → change mode" | 15-dimensional state → 4 motors |
| Relationship | — | **none**: one changes flight modes, the other writes motor outputs directly |

**This is not a spectrum. It is two different things standing next to each other.**

The rule-based end will not "evolve into" the learned end — they aren't solving the same layer of problem. `EKF_FAILSAFE` decides whether to abandon the mission; `mc_nn_control` decides how fast four motors spin this millisecond. The thing everyone pictures in between — learned navigation, learned mission planning — **is in neither mainline flight stack.**

If anything lives in the middle it's `SCRIPTING`, ArduPilot's Lua extension point. But that proves the point: **the middle layer isn't something the flight stack grew, it's a hole left for someone else to fill.**

I want the scope of this post stated plainly: **this is "what is in mainline flight-controller source," not "where the field has got to."** Academia, individual vendors and research programmes obviously have more advanced work — but that work is not in PX4/ArduPilot mainline, and therefore not in the firmware most people actually fly. This post can only claim the former.

## 6. Taiwan: how the regulations define autonomy

Three Taiwanese provisions are relevant, and they take rather different attitudes.

**First, "autopilot operation" is a drone by definition.** Article 2(26) of the Civil Aviation Act:

> Remotely piloted drone: an unmanned aircraft controlled in flight from remote equipment via a signal link, **or operated by autopilot**, or otherwise announced by the CAA.

So autonomous flight isn't outside the rules; it's in the definition from the start.

**Second, the cybersecurity spec permits "keep flying after link loss."** Item 8.1.4, wireless communication failure handling, taken apart in [that post](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en), passes on any one of three criteria:

> (1) the unit under test **maintains its original flight path**;
> (2) the unit under test enters return-to-home or forced-landing mode;
> (3) the ground control station displays an abnormal signal state.

**Criterion (1) explicitly accepts "carry on along the planned route after losing the link" as a pass.** Compare section 3: that is exactly what the light-show firmware does (link loss during a show is "quite common" and "usually not a problem"), and exactly what ArduPilot's 21 failsafes do **not** mandate — what `RADIO_FAILSAFE` does is a parameter.

**Third, what is actually being procured is AI dispatch, not AI flight.** From the Ministry of the Interior's [June 2025 ministerial meeting](https://www.moi.gov.tw/Common/EpaperClick.ashx?p=D3C50BA14D2E597DBF5BA233B2670F24E65203E80CE503D13003C306C4ECC0A73685AEC600EFED6F0506D615E724558F4C6A6AAC5F3F11AEC08D2A6F321312DD&esq=%40EpaperSendQueueSN): the National Fire Agency is running an "AI intelligent search-and-rescue dispatch system" programme building a "drone search-and-rescue imagery management platform," with 44 complex-terrain drones to be procured by end-2025 and the whole system complete by end-2026.

**Note that the AI in that system's name is in dispatch and image recognition, not flight control.** Which matches section 5: the autonomy that actually ships lands in the payload and on the ground, not in the flight loop.

## 7. If you remember one thing

Back to "waypoint → learned → end-to-end." Having read the source, I'd rewrite it as:

> **Flight-controller autonomy is not a road of evolution. It is a set of rules each added to avoid a specific disaster — so many that it takes a 56-entry enum to count them, and exactly one of them is about seizing an opportunity.**
>
> **And end-to-end isn't the end of that road. It's a separate ten-kilobyte hole cut beside it, shipped switched off.**

If you're evaluating any drone's "autonomy," the useful question isn't "does it have AI." It's: **which situations will it change its own behaviour in, who wrote that list, how long is it, and what does each entry do?** On an open flight stack you can read that list to the end. On a closed product, that list is the thing to demand.

## What this post does not answer

- **I didn't read PX4's equivalent enumeration.** PX4's commander and navigator have their own failsafe state machine, structured differently from ArduPilot's `ModeReason`, so there's no clean entry-by-entry comparison. The 56-item classification holds for ArduPilot only.
- **I didn't run `mc_nn_control`.** I read its source, its inputs and outputs and its tensor arena size, but did not build it, fly it in SITL, or assess how well it flies. "10 KB, off by default" is a fact about its scale and status, not a judgement about its performance.
- **Nothing on how the model is trained.** `control_net.cpp` holds an already-converted model; the training pipeline isn't in the flight-controller repo. That's the genuinely interesting other half of this topic and it needs different material.
- **No comparison with closed systems.** DJI's and Skydio's autonomy (Skydio's visual obstacle avoidance especially) clearly exceeds mainline open-source flight stacks, but those are black boxes and this post's method doesn't work on them.
- **Nothing on "perceptual autonomy."** What this post counts is decisions that *change flight mode*. Visual obstacle avoidance and target tracking adjust continuously *within* a mode and never generate a `ModeReason`, so they aren't in this list — that's the boundary of the counting method and it needs saying.

---

## References

**Primary: source code**

- [ArduPilot `libraries/AP_Vehicle/ModeReason.h`](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Vehicle/ModeReason.h) (the 56 entries and the classification above come entirely from this file)
- [ArduPilot `ArduPlane/soaring.cpp`](https://github.com/ArduPilot/ardupilot/blob/master/ArduPlane/soaring.cpp) (when `check_thermal_criteria()` holds, `set_mode(mode_thermal, ModeReason::SOARING_THERMAL_DETECTED)`)
- ArduPilot mainline files that change flight mode autonomously: `ArduCopter/ekf_check.cpp`, `events.cpp`, `fence.cpp`, `avoidance_adsb.cpp`, `afs_copter.cpp`, `mode.cpp`
- [PX4 `src/modules/mc_nn_control/`](https://github.com/PX4/PX4-Autopilot/tree/main/src/modules/mc_nn_control) (module description "end-to-end neural network control system," 15 inputs and 4 outputs, publishes `actuator_motors`, `kTensorArenaSize = 10 * 1024`, Kconfig `default n`)
- [PX4 `src/lib/tensorflow_lite_micro/`](https://github.com/PX4/PX4-Autopilot/tree/main/src/lib) (TensorFlow Lite Micro vendored into the flight-controller source)

**Primary: regulation and policy**

- Civil Aviation Act Article 2(26) (the definition of a remotely piloted drone includes "operated by autopilot")
- [Cybersecurity Testing Specification for Drones V2.0](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (item 8.1.4, wireless communication failure handling; criterion (1) "the unit under test maintains its original flight path")
- [Ministry of the Interior: promoting drone use and technology-assisted law enforcement](https://www.moi.gov.tw/Common/EpaperClick.ashx?p=D3C50BA14D2E597DBF5BA233B2670F24E65203E80CE503D13003C306C4ECC0A73685AEC600EFED6F0506D615E724558F4C6A6AAC5F3F11AEC08D2A6F321312DD&esq=%40EpaperSendQueueSN) (the National Fire Agency's "AI intelligent search-and-rescue dispatch system," 44 complex-terrain drones by end-2025)

**On this site**

- [PX4 or ArduPilot: The EKF Derivation Lives in the Other Project's Repo, and the Real Fork Is the Licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en)
- [The Seven Seconds After GPS Jamming Starts: How a Flight Controller Notices, What It Decides, and Why Jamming Detection Is Off by Default](/posts/tech/2026-08-08-gps-jamming-flight-controller-en)
- [There Is No Swarm in a Drone Light Show: Two Hundred Aircraft Share One Integer](/posts/tech/2026-08-09-drone-swarm-light-show-en)
- [Taking Apart Taiwan's Drone Cybersecurity Testing Specification: The Five Items That Actually Test Resilience Are All Optional](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en)
