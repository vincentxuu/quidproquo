---
title: "Taiwan's Drone Security Spec: The Five Items That Test Resilience Are Optional"
date: 2026-08-08
type: deep-dive
category: policy
tags: [drone, cybersecurity, taiwan, compliance, regulation]
lang: en
tldr: "Reading the whole specification turns up three counter-intuitive things: of the seven mandatory items only three sit on the aircraft and the rest on the ground control station; an unencrypted link still passes, as long as the manual or the box states the reason or the risk — the rule asks for disclosure, not encryption; and the five items that actually test resilience (spoofing, jamming, link loss, known firmware vulnerabilities, app certification) are all in Chapter 8, which is optional."
description: "A chapter-by-chapter reading of Taiwan's Drone Cybersecurity Testing Specification V2.0 (in force 30 April 2026): how the seven mandatory items divide between aircraft and ground station, the disclosure-based pass criterion for communications security, what firmware security actually tests, the retest scope for series products, and why Chapter 8's optional items are where the substance is — checked against the source-code findings of the previous three posts."
draft: false
series:
  name: "Taiwan's Drone Industry, Taken Apart"
  order: 24
---

> 🌏 [中文版](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec)

This series has cited the *Remotely Piloted Aircraft Cybersecurity Testing Specification* four times — the [spec-sheet post](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) used its "product series" definition, the [flight control post](/posts/tech/2026-08-08-px4-vs-ardupilot-en) asked whether changing firmware creates a new series, and the [RF link post](/posts/tech/2026-08-08-drone-radio-link-en) and [GNSS post](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) each took apart one of the modules it names.

**Four citations, and not once did I read it end to end.** This post does.

One correction first. The [spec-sheet post](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) said "effective December 2024" — that was V1.0 (26 December 2024). **The version in force is V2.0, effective 30 April 2026** (MODA 數位韌性字第1155000517號 jointly with MOTC 交航字第11500099111號), and V2.0 added an entire new Chapter 5, "Product Testing Criteria." Half of the most important findings below come from that chapter.

## 1. Who has to test

The specification lists its own legal basis, all four provisions in the *Regulations Governing Remotely Piloted Aircraft*:

- **Art. 17(1)(5)**: manufacturers and importers must register a passing cybersecurity test report in the CAA's designated information system **before public sale**.
- **Art. 31(6) and Art. 32(4)**: government agencies, schools and juridical persons conducting flight activities must hold a passing report for aircraft **fitted with navigation equipment**.
- **Art. 32(1), latter part**: controlling **200 or more aircraft** simultaneously in a display requires an additional swarm-system test report.

So the scope is narrower and more precise than it sounds: **sellers always have to test; among flyers, only the public sector, schools and juridical persons, and only when the aircraft carries navigation equipment**. An individual pilot buying an already-tested machine is not covered by any of these.

## 2. Seven mandatory items — the aircraft carries only three

Table 2 of Chapter 6 assigns seven security requirements across two units under test. Reproduced:

| Security dimension | Requirement | Aircraft | Ground control station |
|---|---|---|---|
| 6.2 System security | 6.2.1 Identity authentication | — | **V** |
| | 6.2.2 Network service port testing | — | **V** |
| | 6.2.3 System anomalous traffic | **V** | **V** |
| 6.3 Software security | 6.3.1 Malware | — | **V** |
| | 6.3.2 Vulnerability scanning | — | **V** |
| 6.4 Communications security | 6.4.1 Wireless communications security | **V** | **V** |
| 6.5 Firmware security | 6.5.1 Firmware update security | **V** | — |

**The aircraft itself is tested on three items**: anomalous traffic, wireless communications security, and firmware update security. Identity authentication, network ports, malware and vulnerability scanning — all four land on the ground control station.

At first glance that looks like a gap. It is not. A ground control station is usually a Windows or Android machine with a full network stack, a login interface and a real chance of hosting malware; the thing on the aircraft is typically an MCU running NuttX or ChibiOS, with no account to brute-force and no web interface. **Putting the tests on the side with the attack surface is sound.**

But it does mean one sentence needs rereading: "this drone passed cybersecurity testing" mostly means **the ground station it ships with** passed most of the items.

## 3. Communications security can be passed without encryption

The pass criterion in §6.4.1.3 reads:

> §6.4.1.3 Pass criteria: passing requires meeting **one** of the following.
> (1) The wireless transmission uses an encryption mechanism conforming to international norms.
> (2) Where, owing to the product's design purpose, operating-environment requirements or technical limitations, the wireless transmission cannot be encrypted or evidence of implemented encryption cannot be provided, **the user manual or the packaging shall clearly state the cybersecurity risk arising from unencrypted wireless transmission, or the reason it is unencrypted**.

**No encryption passes, as long as you say so.**

That lines up exactly with the [RF link post](/posts/tech/2026-08-08-drone-radio-link-en). Searching the ExpressLRS source turned up no encryption on the RF link at all, only a 14-bit CRC. I wrote then that "if you are building a product that must pass cybersecurity testing, the communications module box is asking about exactly this" — and now the specific form of the answer is clear: **not adding encryption, but printing it on the box.**

Choosing disclosure over a mandate is defensible. Control links are designed for low latency, encryption adds computation and packet overhead, and C2 packets are only a few bytes, so the relative cost is high. But the consequence is that **a buyer has to go read the manual to learn whether that aircraft's control link is in the clear.**

## 4. Firmware security tests the update path, not the firmware

The stated purpose of §6.5.1 is direct: "verify whether the flight control module has a firmware update mechanism, and confirm whether the firmware has the ability to verify against replacement." Four pass criteria:

1. The firmware has update capability.
2. If there is an online firmware update channel, the source shall provide **checksums** matching the downloaded firmware for verification.
3. The firmware update **has the ability to verify against replacement**.
4. The manual or packaging states the software update channel.

**It tests whether that update channel can have something pushed into it, not what the firmware itself contains.**

This answers half of the question I left hanging in the [flight control post](/posts/tech/2026-08-08-px4-vs-ardupilot-en). Reading that the "product series" definition mentions only identical flight-control, communications and satellite-positioning **chip modules**, I noted that the text governs hardware and never mentions firmware, while "firmware security" is plainly one of the four testing dimensions — and the two seemed not to line up.

They do line up. **Firmware security governs the integrity of the update path, which is a property of the hardware and the boot flow; swapping one flight stack for another does not change that path's properties, so it does not affect series identification.**

## 5. But a series product does have to retest one item

Chapter 5, new in V2.0, closes the other half. §5.2.1 defines the application conditions — the sentence I have quoted four times, about identical flight-control, communications and satellite-positioning chip modules. §5.2.2 then says:

> The unit under test shall meet one of the following:
> (1) Where the original product obtained its passing report under Chapter 6, its series products **must pass the test item in §6.3.2**.
> (2) Where the original product obtained its report under CNS 18031-1, its series products must pass that standard's GEC-1 test items.
> (3) Where the original product was certified under AUVSI Green UAS, its series products shall meet that framework's security maintenance and testing requirements.

**§6.3.2 is vulnerability scanning.** So a series product is not exempt; it retests that single item.

And per Table 2, §6.3.2 is marked for the **ground control station**. Read together, the literal sense is that series identity is determined by the three chip modules on the aircraft while the retest lands on the ground station's vulnerability scan. That reading is a literal combination of two clauses, and how a testing laboratory handles it in practice is still a question for them — but at least the question is now precise, rather than the "you'd have to ask" I could only offer in the previous two posts.

## 6. The "one of three" in §5.1.1 flattens the certification ladder

§5.1.1:

> Where the unit under test is a drone, it shall comply with **one** of the following:
> (1) Chapter 6, drone cybersecurity testing.
> (2) CNS 18031-1.
> (3) **AUVSI Green UAS testing requirements.**

The [market-entry post](/posts/career/2026-08-06-drone-market-entry-mechanics-en) described certification as a fixed-order ladder: domestic cybersecurity testing → Green UAS → Blue UAS Cleared.

**This clause lets you skip the first rung.** A manufacturer that already holds Green UAS need not go through the domestic Chapter 6 at all. For anyone selling internationally that is a real administrative saving; for a domestic-only manufacturer, Chapter 6 remains the shortest path. The order is not wrong, but it is not the only route.

## 7. The five items that actually test resilience are all optional

Chapter 8 opens with one sentence: "**This chapter is optional**; manufacturers may elect to test the items in this chapter as required."

Then Table 4:

| Additional requirement | Aircraft | Ground station |
|---|---|---|
| 8.1.1 **Satellite positioning hardening** | **V** | — |
| 8.1.2 **Satellite positioning jamming response** | **V** | — |
| 8.1.3 Mobile app basic security label | — | V |
| 8.1.4 **Wireless link loss handling** | **V** | **V** |
| 8.1.5 **Known firmware vulnerability testing** | **V** | — |

Put this table beside Chapter 6's and the structure emerges: **the mandatory part guards against data leakage and malicious use; the optional part is where the aircraft is tested for whether it holds up under attack.**

And the optional items' methods are highly specific. §8.1.1, satellite positioning hardening:

> (1) With the unit's flight control system in flight mode, use an external satellite positioning signal generator to produce an anomalous positioning signal **more than 100 km away from the current position**, and transmit it to the unit to spoof its position.
>
> Pass criteria: passing requires meeting **one** of the following.
> (1) The unit's satellite position remains correct.
> (2) **The unit enters forced-landing or return mode.**
> (3) The unit's ground control station displays an abnormal signal state (with supporting evidence of the response).

§8.1.2 applies the same criteria to jamming, with the method changed to "use an external satellite positioning jammer." §8.1.4, link loss, is "the ground control station switches off wireless communications," passing on one of: maintains its original route, enters return or forced-landing mode, or the ground station displays the anomaly.

**The second criterion stopped me.** In the [previous post](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) I switched on GPS jamming in SITL and recorded the flight controller taking LAND by itself after about seven seconds of simulated time, touching down at 0.45 m/s. That was not merely "a reasonable response" — **it is pass criterion (2) of §8.1.2 of this specification.**

I had worked it out backwards from ArduPilot's `ekf_check.cpp` with no idea it would land on a Taiwanese testing clause. The convergence is not a coincidence: open-source failsafe behaviour and national testing standards have been converging on each other, and PX4's and ArduPilot's defaults are what standards of this kind expect. **So "use the PX4 or ArduPilot defaults" has real meaning in this box — the default is already close to the pass line.**

As for why these five are optional, the specification gives no reason. Cost is the plausible guess: §8.1.1 needs a satellite signal generator and §8.1.2 needs a jammer, both operated in an environment where transmitting is lawful, and not every laboratory has that. **The price is that a drone that "passed cybersecurity testing" may never have been tested for what it does when jammed.**

## 8. So the spec-sheet post's advice needs an upgrade

The [spec-sheet post](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) said "passed cybersecurity testing" is a checkable field. After reading the whole text, that needs a caveat: **the field does not tell you which tests were run.**

Three questions can now be asked precisely:

1. **Was it obtained under Chapter 6, CNS 18031-1, or Green UAS?** (§5.1.1 offers three routes with different content.)
2. **Which Chapter 8 items were elected — particularly 8.1.1, 8.1.2 and 8.1.4?** (Not elected means jamming and link loss were never tested.)
3. **Did §6.4.1 pass via encryption or via disclosure?** (If disclosure, the reason it is unencrypted is on the manual or the box, and you can ask to see it.)

The first two should be answerable from the test report; the third should be on the packaging.

## What this post does not answer

- **I have not seen an actual test report.** Everything above is the specification's text. What a report looks like, how much it discloses, and whether a buyer can obtain one — I have no sample.
- **No comparison of stringency against international standards.** The specification cites ANSI/CTA-2088.1, UL 2900-1, NIST SP 800-53 and TAICS TR-0022 among others, but a clause-by-clause comparison would need its own post.
- **No statistics on who has passed.** How many models and manufacturers have completed registration in the CAA system, I could not find compiled publicly.
- **The swarm chapter only gets a mention.** Chapter 7 has twelve test items and applies above 200 simultaneously controlled aircraft — that is the light-show industry's question and deserves its own piece.

---

## References

**Primary: regulation**

- [Remotely Piloted Aircraft Cybersecurity Testing Specification — Executive Yuan Gazette, Vol. 032 No. 077](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (V2.0, MODA 數位韌性字第1155000517號 jointly with MOTC 交航字第11500099111號, in force 30 April 2026. Cited here: the three compliance routes in §5.1.1; the series-product criteria in §5.2 and the §6.3.2 retest; the seven mandatory items and their division in Table 2; the disclosure-based pass criterion in §6.4.1.3; the four firmware-update criteria in §6.5.1; Chapter 8's optional status and Table 4; the methods and pass criteria of §8.1.1, §8.1.2 and §8.1.4; and the revision history) (in Mandarin)
- [Regulations Governing Remotely Piloted Aircraft — Laws & Regulations Database](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0090083) (Art. 17(1)(5) pre-sale registration; Art. 31(6) and Art. 32(4) public-sector and juridical-person aircraft; Art. 32(1) swarms of 200 or more. The article text quoted here is as reproduced at the head of Chapters 6 and 7 of the specification) (in Mandarin)

**On this site**

- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [PX4 or ArduPilot: The Real Fork Is the Licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en)
- [Frequency Hopping Is Not Encryption, and Taiwan Caps Power by Channel Count](/posts/tech/2026-08-08-drone-radio-link-en)
- [The Seven Seconds After GPS Jamming: How It Notices, and Why Detection Is Off](/posts/tech/2026-08-08-gps-jamming-flight-controller-en)
- [Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You](/posts/career/2026-08-06-drone-market-entry-mechanics-en)
