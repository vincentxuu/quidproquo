---
title: "There Is No Swarm in a Drone Light Show: 200 Aircraft Share One Integer"
date: 2026-08-09
type: deep-dive
category: tech
tags: [drone, swarm, light-show, ardupilot, taiwan, cybersecurity]
lang: en
tldr: "I pulled down the whole of Skybrush's open-source light-show firmware — the CollMot branch of ArduPilot — and grepped all 9,199 lines for neighbour, peer, collision, avoidance, swarm. Not one aircraft knows another aircraft exists. Each drone carries a show.skyb file on its own SD card, syncs to GPS time, and replays its own trajectory at 10 Hz. The entire content of what two hundred aircraft synchronise is one GPS time-of-week integer plus a millisecond offset. The only thing resembling collision avoidance, the 'bubble fence', measures how far the drone is from its own commanded position (10 m by default), and the default action is 1 = report only. Collision avoidance was settled on the ground, in the choreography software. On the Taiwan side: Chapter 7 of the Cybersecurity Testing Specification for Drones is the swarm chapter, twelve test items, and the 'drone' column is a dash the whole way down — what gets tested is switches, routers, firewalls, Wi-Fi access points and web management interfaces, against the IoT Field Security Assessment Guideline and the Wireless Broadband Router Security Test Specification. It isn't testing the swarm; it's testing the server room you need to run one. Meanwhile the legislative rationale says interference could 'cause the drones to lose control and crash' — and the single point of failure in that chain is GNSS, which appears only in Chapter 8, which is optional and not part of swarm compliance. The shape has a paper trail: a 2022-11-11 Executive Yuan meeting record explicitly asked for 'swarm mission software testing' to be included, and four years later Chapter 7 has no mission-software item at all."
description: "Proving from the source of Skybrush's open-source light-show firmware that a light show has no inter-drone coordination, then matching Chapter 7 of Taiwan's drone cybersecurity testing specification item by item to explain why that chapter is shaped like a network audit, and how its shape was set by the 2022 National Day controversy."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-09-drone-swarm-light-show)

[The cybersecurity-spec post](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en) left a second debt in print:

> **The swarm chapter only got a passing mention.** Chapter 7 has twelve test items and applies above 200 aircraft under simultaneous control — that's the light-show industry's problem, and it deserves its own post.

This pays it off. It was harder to write than expected, because digging in turned out to require answering a prior question: **what actually passes between two hundred light-show drones?**

The answer surprised me: **almost nothing.**

## 1. Take the word "swarm" apart first

"Swarm" covers two structurally different things. Telling them apart takes two questions:

| Question | Light show | What people picture when they say "battlefield swarm" |
|---|---|---|
| When does coordination happen? | **Design time** (computed on the ground) | **Runtime** (decided in the air) |
| Does drone A's state change drone B's behaviour? | **No** | Yes — that's the whole point |

Both questions can be answered by reading source, without taking anyone's word for it. So I read it.

## 2. The material: light-show firmware that actually flies

[Skybrush](https://skybrush.io/), by the Hungarian company CollMot Robotics, is the only fully open-source light-show system I could find, and the airborne half is [a fork of ArduPilot](https://github.com/skybrush-io/ardupilot) (GPLv3) on a branch called `CMCopter-4.6` (CM = CollMot). It isn't a toy: it's a complete ArduCopter flight mode plus a whole library.

```
ArduCopter/mode_drone_show.cpp                    1,128 lines
libraries/AC_DroneShowManager/   (27 files)
libraries/AC_BubbleFence/
--------------------------------------------------------
flight mode + library + headers, total            9,199 lines
```

Everything quoted here is from `09abd331` (2026-06-26).

## 3. In 9,199 lines, no aircraft knows another aircraft exists

The first thing to do is grep. Every plausible term at once:

```bash
grep -rniE "neighbou?r|peer|collision|avoid(ance)?|separation|formation|\
consensus|flock|other (drone|vehicle|aircraft)|inter.?drone|sysid|proximity" \
  libraries/AC_DroneShowManager/ libraries/AC_BubbleFence/ \
  ArduCopter/mode_drone_show.cpp ArduCopter/bubble_fence.cpp
```

Seventeen hits. Going through them one by one:

- **Sixteen are `formation` matching inside `information`** (my regex was loose — saying so plainly).
- One is `mavlink_system.sysid`, which is the drone's **own** system ID, used in a light-status packet.

Grepping `swarm` separately gives two hits: one comment, and `LightEffectPriority_Broadcast`, documented as "preferred swarm-level color sent from GCS" — the ground station broadcasting one colour to everyone, not drones talking to each other.

**Zero. Not one line in nine thousand lets an aircraft read another aircraft's state.**

So how do they avoid hitting each other?

## 4. The entire coordination payload: one GPS time-of-week second

Every drone carries one file on its own SD card:

```c
// DroneShow_Constants.h
#define SHOW_FILE (HAL_BOARD_COLLMOT_DIRECTORY "/show.skyb")
```

It holds **this one aircraft's** trajectory and lights. Once the show starts, the drone does the same thing ten times a second: work out how long it has been since the show began, look up where it should be at that instant in its own file, and feed that in as a guided-mode setpoint.

```c
// DroneShow_Constants.h
#define DEFAULT_UPDATE_RATE_HZ 10
```

And "how long since the show began" is computed like this:

```c
// AC_DroneShowManager_Timing.cpp
int64_t AC_DroneShowManager::get_elapsed_time_since_start_usec() const
{
    if (uses_gps_time_for_show_start()) {
        now = get_gps_timestamp_usec();
        reference = _start_time_unix_usec;
    } else {
        now = AP_HAL::micros64();
        reference = _start_time_on_internal_clock_usec;
    }
    // ... returns now - reference
}
```

Where does `reference` come from? A parameter:

```c
// @Param: START_TIME
// @Description: Start time of drone show as a GPS time of week timestamp (sec),
//               negative if unset. See also SHOW_START_MSEC.
AP_GROUPINFO("START_TIME", 1, ..., _params.start_time_gps_sec, -1),

// @Param: START_MSEC
// @Description: Number of milliseconds to add to the start time of the show
AP_GROUPINFO("START_MSEC", 40, ..., _params.start_time_gps_msec_offset, 0),
```

**For a two-hundred-drone light show, the entire content of inter-drone "coordination" is that every aircraft receives the same GPS time-of-week second (an integer between 0 and 604799) plus a millisecond offset.** After that each one watches its own GPS clock, reads its own file, and flies.

The parameter comment even explains why it's a GPS week-second rather than a Unix timestamp:

> Note that we cannot use UNIX timestamps here because ArduPilot treats incoming parameter values from MAVLink `PARAM_SET` messages as floats (irrespectively of the internal storage format), so setting the start time via MAVLink would round it off to the nearest integer that _is_ representable accurately as a float.

**That is a data type chosen because of float precision.** The synchronisation of the entire "swarm" hangs off it.

## 5. What about collision avoidance? It was settled on the ground

The only airborne thing that looks like collision avoidance is the bubble fence. Look at what it measures:

```c
// AC_BubbleFence.h
// Notifies the bubble fence about the distance to the desired position
// of the drone
FenceAction notify_distance_from_desired_position(Vector3f& distance);
```

**"Distance from its own desired position," not "distance from other drones."** The implementation confirms it:

```c
// AC_DroneShowManager.cpp
void AC_DroneShowManager::get_distance_from_desired_position(Vector3f& vec) const
{
    ...
    vec -= (_last_setpoint.pos / 100.0f);   // subtract its own setpoint
}
```

Parameters and defaults:

| Parameter | Meaning | Default |
|---|---|---|
| `BFENCE_DXY` | Horizontal deviation allowed from its own path | **10 m** |
| `BFENCE_DZ` | Vertical deviation allowed | **10 m** |
| `BFENCE_TO` | How long a breach must last to count | **5 s** |
| `BFENCE_ACT` | What to do on a breach | **1 = report only** |

`BFENCE_ACT`'s options are `0:None, 1:Report only, 2:Flash lights, 3:RTL, 4:Land, 5:Disarm`. **The default is "report only" — the one line of defence on the aircraft ships configured to do nothing but increment a counter.**

That isn't an oversight; it follows from the architecture. The same constants file also has:

```c
#define DEFAULT_XY_PLACEMENT_ERROR_METERS 3.0f  // won't take off if misplaced
#define DEFAULT_MAX_XY_DRIFT_METERS       3.0f  // trajectory drift tolerance
#define DEFAULT_MAX_Z_DRIFT_METERS        3.0f
```

**Every threshold compares the drone to its own commanded value.** Before takeoff it checks it is standing on its own square (3 m); in flight it checks it hasn't drifted off its own line (3 m); the bubble fence is the outer layer (10 m). **"Two aircraft won't get too close" is guaranteed by the choreography software when it computes the trajectories** — the aircraft never knows this is a concern.

## 6. And one comment says it better than I can

The lighting logic has a passage explaining when to flash red:

```c
// * We do not trigger the red light for radio or GCS failsafes because
//   both are quite common during a show when the drone is far from the
//   GCS and/or the pilot, but these usually do not represent a problem.
//
// * We do not trigger the red light for ADSB or terrain failsafes
//   either; we do not use terrain following during a show and we do
//   not use ADSB either at the moment.
```

**Losing the radio link or the ground station during a show is "quite common" and "usually does not represent a problem."**

On a normal drone, losing the control link is an emergency. On a light-show drone it's a Tuesday — because **during the performance it doesn't need that link at all**. Everything it needs is already on the SD card and in the GPS.

Note also the explicit "we do not use ADSB either." The ability to see whether another aircraft is nearby is simply not switched on anywhere in this system.

## 7. So what is the actual single point of failure?

Putting it together, a light-show drone mid-performance depends on three things:

1. `show.skyb` on the SD card (written before takeoff; can't be cut)
2. **GPS time** (which decides what second of the show it's playing)
3. **EKF position**, whose primary source is also **GPS**

The control link is not on that list. The ground station is not on that list. The network is not on that list.

**Position and time both enter through the same door. GNSS is the single point of this architecture.**

[The GPS-jamming post](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) measured what happens to one aircraft jammed in SITL: EKF failure, an automatic switch to LAND, touchdown, disarm — about seven seconds. For a single aircraft that's a successful failsafe. **For a formation of two hundred spaced a dozen metres apart, two hundred aircraft simultaneously deciding to find somewhere to land is a different proposition entirely** — and not one of them knows anybody else is there.

I did not run that experiment (see "What this post does not answer"), so I'm not drawing a conclusion. **But where the risk chain points is clear.**

## 8. Taiwan's swarm chapter: twelve items, none on the aircraft

Now the regulation. Chapter 7 of the [Cybersecurity Testing Specification for Drones](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) V2.0 (in force 30 April 2026) is the swarm chapter, authorised by the 200-aircraft threshold in Article 32(1) of the Remotely Piloted Drone Regulations.

Table 3 has seven columns: the drone, network-capable payload, ground control station, switch/router/firewall, other equipment (Wi-Fi access point), wireless interface, web management interface.

Where the twelve swarm items land:

| Item | Drone | Applies to |
|---|---|---|
| 7.1.1 Swarm system vulnerability scanning | **-** | payload / switch-router-firewall / AP |
| 7.1.2 Swarm system network service ports | **-** | same |
| 7.1.3 Swarm system remote login access management | **-** | same |
| 7.1.4 Swarm system remote login content protection | **-** | same |
| 7.1.5 Swarm system high-risk service management | **-** | same |
| 7.1.6 Swarm system web application testing | **-** | web interface only |
| 7.1.7 Swarm system authentication mechanism | **-** | payload / network gear |
| 7.1.8 Swarm system password strength and protection | **-** | same |
| 7.1.9 Swarm system web transport security | **-** | web interface only |
| 7.1.10 Swarm system web authorisation management | **-** | web interface only |
| 7.1.11 Swarm system wireless network security | **-** | wireless interface only |
| 7.1.12 Swarm system physical security | **-** | payload / network gear |

**Twelve items, and the "drone" column is a dash from top to bottom.**

Look at what those twelve actually test: known vulnerabilities scoring CVSS 7.0 or above, TCP/UDP port scans, whether Telnet or FTP is open, the cipher algorithms on SSH/RDP/VNC/SMB, whether UPnP or WPS is enabled, OWASP Top 10, password complexity, HTTP PUT/TRACE/DELETE, TLSv1.2 or better, directory traversal, WPA2-CCMP, and whether USB and RJ45 ports are physically protected.

**Not one item has anything to do with flying.** No trajectory, no time sync, no GNSS, no collision, no failsafe landing, and nothing about how the `show.skyb` file gets onto the aircraft or whether it's verified.

And the specification says plainly in Appendix B what it's built on:

> 7.1.1–7.1.12: TAICS TR-0022 v2.0:2023 **IoT Field Security Protection Assessment Guideline** v2; TAICS TS-0041 v1.0 **Wireless Broadband Router Security Test Specification**

**The swarm chapter's two cited standards are an IoT field-assessment guideline and a Wi-Fi router test spec.** It isn't testing the swarm; it's testing the server room you need to run one — and it never pretended otherwise.

## 9. But the legislative rationale isn't about server rooms

Here's the problem. The [legislative rationale](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040110100008800-1131114) for adding the 200-aircraft threshold to Article 32 says:

> Given that central government agencies, local governments and private organisations widely use drone swarm activities during festivals and promotional events … considering that such flight activities involve large numbers of drones over wide areas, **should they suffer malicious information and communications interference, the drones could lose control and crash**, posing a great threat to the safety of people and property on the ground. Accordingly the latter part of paragraph 1 is added…

**What the rationale fears is: interference → loss of control → crash → someone gets hit.**

Per the architecture read above, the interference that could bring two hundred down at once is GNSS. The specification does have GNSS items:

| Item | Chapter | Mandatory? |
|---|---|---|
| 8.1.1 GNSS hardening (spoofing) | Chapter 8 | **Optional** |
| 8.1.2 GNSS interference handling | Chapter 8 | **Optional** |
| 8.1.4 Wireless communication failure handling | Chapter 8 | **Optional** |

And swarm compliance is defined in 5.1.2:

> 5.1.2 Where the unit under test is a drone swarm system, it shall comply with Chapter 5.1.1 and Chapter 7, Drone Swarm System Cybersecurity Testing.
> 5.1.3 Vendors **may optionally select** Chapter 8, Additional Drone Cybersecurity Testing, according to their needs.

**Chapter 8 is not part of swarm compliance.** A swarm system can lawfully obtain a swarm cybersecurity pass report without anyone ever having tested what it does when its GPS is spoofed.

To put it precisely: this is not a "loophole" in the specification. It's that **what the specification tests and what the legislative rationale fears are two different things**. Chapter 7 tests "can someone break into this system"; the rationale worries about "will the aircraft fall out of the sky." One is a security question and the other is a safety question, and in the swarm cell they don't meet.

## 10. That shape isn't an accident — it's the chapter's parentage

Why is the swarm chapter shaped like a network audit? Rewind.

On 8 November 2022, legislator Lu Ming-che asked in the Legislative Yuan whether the drone show at the National Day fireworks gala used products from the Chinese firm EMO. The Control Yuan's subsequent [investigation report](https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/68870) (approved 9 April 2024) went through the whole thing and concluded: the DSE225 that actually flew used non-Chinese flight-control software, ground-control software and communications modules; but the same vendor's DSG330 did use a Shanghai SIMcom 4G communications chipset, and 440 fully imported Chinese-brand small aircraft were sitting in its warehouse. The procuring agency was the National Palace Museum; the contract was the "2022 NPM Southern Branch Water Dance and Drone Swarm Performance Professional Services" case, 500 aircraft.

**From beginning to end, the controversy was about which country the chips came from, whether the vendor had registered properly, and whether the tender clauses were strict enough. No aircraft fell out of the sky.**

Over the following month the Executive Yuan convened eleven meetings, and twenty by June 2023. The report's appended meeting records show how the framing was set:

- **2022/11/11** (chaired by Minister Wu Tsung-tsong of the Office of Science and Technology): "The Ministry of Digital Affairs is asked to establish a Joint Testing Laboratory for Unmanned Vehicle Cybersecurity … focusing on **communications, chips and software**."
- **2022/11/17**: "Plugging the security gap: **three chip modules and two software items** get priority control." (Footnote: chips include positioning, flight control, avionics and communications; software includes flight control, avionics and communications.)
- **2023/01/04**: the Public Construction Commission updated its model tender instructions, adding (4-1-2-3): "**Swarm activities shall pass a drone flight-field information security protection assessment and testing.**"

That last line is the answer. **"Flight-field information security protection assessment" — the field, not the aircraft.** That phrase went into tender boilerplate in January 2023, and two years later Chapter 7 faithfully implemented it as twelve network tests, citing — precisely — the *IoT **Field** Security Protection Assessment Guideline*.

**Chapter 7 didn't forget to test the aircraft. It was never born to test the aircraft.** It is the offspring of a chip-origin controversy, so it grew up as a supply-chain and network audit.

## 11. Someone did ask for mission-software testing, and it didn't make it in

The last finding came out of the Control Yuan report. The 11 November 2022 meeting's conclusions include, right after the line quoted above:

> (3) The Ministry of Digital Affairs is asked to assess testing capacity and, beyond the test items currently planned, to **include swarm mission software testing** and cybersecurity monitoring of retrofits and modifications (sampling is acceptable).

**"Swarm mission software" is exactly what sections 3 through 5 of this post read: the trajectory file, the time sync, the playback logic, the fence actions.**

That request is in a November 2022 meeting record. V2.0, published four years later in April 2026, has no mission-software item among Chapter 7's twelve. V2.0's own revision log lists what changed — a new Chapter 5 on product testing criteria, CNS 18031-1 and Green UAS added, revised criteria for 6.4.1, 6.5.1, 7.1.4, 8.1.1, 8.1.2, 8.1.4 and others — and **within 7.1 it revised only 7.1.4's test method and pass criteria. No items were added.**

The Control Yuan itself listed "**loose management of swarm activity fields**" as one of the blind spots of the period.

I don't know why it didn't make it in. It could be testing capacity; it could be that mission software is mostly vendor-written or open-source-derived and hard to write general criteria for; it could be simple prioritisation. **But that somebody asked for it explicitly in 2022 is a matter of record.**

## 12. So what's different about a "battlefield swarm"?

Back to the two questions from section 1. The light show's answers are "design time" and "no." Turning it into the other thing means flipping both — and that needs not better choreography software but three things on the aircraft: the ability to sense others, runtime decision logic, and a coordination protocol that still converges when some nodes drop out.

I'll stick to code facts here and skip the military speculation. The closest thing in mainline ArduPilot to "one aircraft can see another" is `AP_Follow`:

```c
// AP_Follow.h
AP_Int16 _sysid;   // MAVLink system ID of the target (0 = auto-select first sender)
```

**One `_sysid`. It follows one aircraft.** There is nothing N-to-N in mainline.

So the distance between these two things isn't a matter of tuning parameters; it's an architectural gap. **Calling both of them by the same word — swarm — is the main source of confusion on this topic**, and possibly why a specification written for light shows gets expected to answer a question it structurally cannot.

## 13. So who should ask what?

**Agencies procuring shows**: the model tender clause (4-1-2-3) asks for a "flight-field information security protection assessment and testing." A Chapter 7 pass report means the vendor's ground network passed. **It does not mean anyone tested how that fleet behaves when its GPS is jammed.** For that, you have to ask for Chapter 8's 8.1.1 and 8.1.2 specifically.

**Buyers of swarm systems**: three questions. First, how does the trajectory file get onto the aircraft, and is it signed or checksummed? Second, what are the "what happens if I drift off my path" parameters actually set to (the open-source default is report only)? Third, does time sync run off GPS or off a ground-station countdown — the former's failure mode is the whole fleet being wrong together.

**People who write specifications**: this is my judgement, not a fact — Chapter 7 tests the right things, but its name ("swarm system cybersecurity testing") is bigger than its contents (a ground-network audit). The three items that actually correspond to the legislative rationale are sitting in Chapter 8, optional.

## What this post does not answer

- **No multi-vehicle SITL experiment.** I read the code but did not run two hundred SITL instances to see what a simultaneous GPS loss does. It's doable (ArduPilot supports multi-vehicle SITL), but the machine resources and tuning time were beyond this post's scope — and not doing it means not doing it.
- **I didn't read the `.skyb` file format.** How trajectories are encoded and whether there's any integrity protection means reading `libskybrush`. That bears directly on what "mission software testing" would even test, and deserves its own post.
- **Nothing on commercial closed-source systems.** EMO, Intel (now discontinued), Verge Aero and others are closed. The conclusions here support "Skybrush works this way," not "all light shows work this way" — though the architectural reason (ground choreography, airborne playback) is general.
- **I didn't check which Taiwanese vendors have passed Chapter 7.** The pass list the Telecom Technology Center publishes is for single aircraft under the "Drone Cybersecurity Assurance Specification v2.0"; I found no public list of swarm systems.
- **No technical survey of the battlefield-swarm side.** That needs a different body of material (academic literature and public demonstrations) and slides easily into speculation. This post deliberately covers only what the difference *is*, not who has achieved what.

---

## References

**Primary: source code**

- [skybrush-io/ardupilot, branch `CMCopter-4.6`](https://github.com/skybrush-io/ardupilot) (GPLv3; quotations from commit `09abd331`, 2026-06-26. `ArduCopter/mode_drone_show.cpp`; all 27 files of `libraries/AC_DroneShowManager/`, including `AC_DroneShowManager_Timing.cpp`'s `get_elapsed_time_since_start_usec()`, `AC_DroneShowManager_Parameters.cpp`'s `START_TIME`/`START_MSEC`/`BFENCE_*`, `DroneShow_Constants.h`'s `SHOW_FILE`/`DEFAULT_UPDATE_RATE_HZ`/drift thresholds, `DroneShow_Enums.h`'s state machine and authorisation enums, and `AC_DroneShowManager_Lights.cpp`'s comments on radio/GCS failsafes and ADSB; `libraries/AC_BubbleFence/AC_BubbleFence.h`'s `notify_distance_from_desired_position()` and `FenceAction`)
- [Mainline ArduPilot `AP_Follow`](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Follow/AP_Follow.h) (`_sysid` is a single target)
- [Skybrush](https://skybrush.io/)

**Primary: regulation**

- [Cybersecurity Testing Specification for Drones V2.0, full text (Executive Yuan Gazette, 30 April 2026)](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (5.1.2 and 5.1.3 swarm compliance conditions; Chapter 7 and Table 3's twelve swarm items and which equipment each applies to; test methods for 7.1.1–7.1.12; Chapter 8 general requirements are optional, including 8.1.1 GNSS spoofing, 8.1.2 GNSS interference and 8.1.4 comms failure; Appendix B citing TAICS TR-0022 and TS-0041 for the swarm items; Appendix D the swarm self-declaration form)
- [Article 32 of the Remotely Piloted Drone Regulations and its legislative rationale](https://www.rootlaw.com.tw/LawArticle.aspx?LawID=A040110100008800-1131114) (the 200-aircraft threshold in paragraph 1; the rationale's "should they suffer malicious information and communications interference, the drones could lose control and crash")

**Primary: Control Yuan investigation**

- [National Day fireworks display, suspected use of Chinese-made drones, and its information security (Control Yuan investigation report, approved 9 April 2024)](https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/68870) (case chronology; the DSE225 and DSG330 findings; 500 aircraft at the NPM Southern Branch; the 2022-11-11 meeting's "include swarm mission software testing"; the 2022-11-17 "three chips, two software"; the 2023-01-04 model tender clause (4-1-2-3) "swarm activities shall pass a drone flight-field information security protection assessment and testing"; the finding of "loose management of swarm activity fields")
- [Control Yuan press release on the 2022 National Day drone controversy](https://www.cy.gov.tw/News_Content.aspx?n=640&s=29771)

**On this site**

- [Taiwan's Drone Security Spec: The Five Items That Test Resilience Are Optional](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en)
- [The Seven Seconds After GPS Jamming: How It Notices, and Why Detection Is Off](/posts/tech/2026-08-08-gps-jamming-flight-controller-en)
- [PX4 or ArduPilot: The EKF Derivation Lives in the Other Project's Repo, and the Real Fork Is the Licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en)
- [Hopping Is Not Encryption: Reading the ExpressLRS Source, and Finding That Taiwan's Rules Turn Channel Count Into a Power Ceiling](/posts/tech/2026-08-08-drone-radio-link-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
