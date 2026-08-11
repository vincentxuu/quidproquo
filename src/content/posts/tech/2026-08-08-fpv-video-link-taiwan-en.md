---
title: "Analogue FPV Video Links Have No Clause to Walk Through in Taiwan"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, fpv, vtx, spectrum, taiwan]
lang: en
tldr: "Analogue FPV video in Taiwan has two separate problems: LP0002's 5.8 GHz window is only 125 MHz wide while the market's standard channel table spans 300 MHz, leaving eighteen of the forty classic channels inside the window once transmit width is counted. The harder one is that §4.10.1.1 recognises only frequency-hopping transmitters at 5.8 GHz, and analogue video is fixed-frequency — it doesn't violate a clause so much as fail to match any clause in the document."
description: "Picking up where the RC-link post left off, this covers the other half of the radio problem: comparing LP0002 §4.10 and §5.7 as the two possible paths, matching the consumer FPV channel table channel by channel against Taiwan's 5725–5850 MHz window, and explaining why analogue video fits neither path — plus what the CAA itself told a government-commissioned study about FPV pilots and Taiwan's RF weakness."
draft: false
series:
  name: "Taiwan's Drone Industry, Taken Apart"
  order: 28
---

> 🌏 [中文版](/posts/tech/2026-08-08-fpv-video-link-taiwan)

[The RC-link post](/posts/tech/2026-08-08-drone-radio-link-en) ended with a debt written in plain sight:

> **This didn't touch the video downlink.** The control link (RC link) and the video downlink (VTX) are two different systems — different bands, different power limits, different rules. What 5.8 GHz video looks like in Taiwan deserves its own post.

This pays it off. And the convenient part: while researching 2.4 GHz for that post I had already read all of LP0002 §4.10 — **the 5.8 GHz half was sitting in the same section, and I saw it without thinking about it**. Thinking about it produced a harder conclusion than the 2.4 GHz half did.

## 1. The video link and the control link are two different things

Worth separating first, because discussion routinely blends them:

| | Control link (RC link) | Video link (VTX) |
|---|---|---|
| Direction | Mostly downlink control, a little uplink telemetry | One-way video uplink |
| Bandwidth | Packets of a few bytes | ~20 MHz analogue, more for digital |
| Band | 2.4 GHz or sub-GHz | Mostly 5.8 GHz |
| Goal | Low latency, high reliability | Low latency, good enough to see |
| If it drops | Loss of control | You go blind, but the aircraft is still flying |

[The previous post](/posts/tech/2026-08-08-drone-radio-link-en) took apart the left column. This one is the right.

## 2. Taiwan's 5.8 GHz window is only 125 MHz wide

From the [Technical Specification for Low-power Radio-frequency Devices](https://ib-lenhardt.com/assets/pdf/archive/%E4%BD%8E%E5%8A%9F%E7%8E%87%E5%B0%84%E9%A0%BB%E5%99%A8%E6%9D%90%E6%8A%80%E8%A1%93%E8%A6%8F%E7%AF%84%E5%85%A8%E6%96%87.pdf) (LP0002, the 1 July 2020 edition), §4.10.1.1:

> **Operating frequency:**
> (1) 2400 MHz–2483.5 MHz. (Transmitters using frequency hopping or digital modulation)
> (2) **5725 MHz–5850 MHz. (Transmitters using frequency hopping)**

Start with the frequency alone. **5725 to 5850 is 125 MHz.**

The channel table on consumer FPV video transmitters looks like this (per [Oscar Liang's channel chart](https://oscarliang.com/fpv-channels), the reference everyone in this hobby uses):

| Band | CH1 | CH2 | CH3 | CH4 | CH5 | CH6 | CH7 | CH8 |
|---|---|---|---|---|---|---|---|---|
| A | 5865 | 5845 | 5825 | 5805 | 5785 | 5765 | 5745 | 5725 |
| B | 5733 | 5752 | 5771 | 5790 | 5809 | 5828 | 5847 | 5866 |
| E | 5705 | 5685 | 5665 | 5645 | 5885 | 5905 | 5925 | 5945 |
| F | 5740 | 5760 | 5780 | 5800 | 5820 | 5840 | 5860 | 5880 |
| R (Raceband) | 5658 | 5695 | 5732 | 5769 | 5806 | 5843 | 5880 | 5917 |

**The whole table spans 5645 to 5945 MHz — 300 MHz, more than twice Taiwan's window.**

Cell by cell:

| Band | Carriers inside 5725–5850 | Channels outside the window |
|---|---|---|
| A | 7 / 8 | 5865 |
| B | 7 / 8 | 5866 |
| E | **0 / 8** | all eight |
| F | 6 / 8 | 5860, 5880 |
| R | 4 / 8 | 5658, 5695, 5880, 5917 |

**Of the forty classic channels, twenty-four have carriers inside the window (60%). Band E has none.**

And that counts carrier centres only. An analogue video channel is about 20 MHz wide; if the whole emission has to sit inside the window, the carrier must fall between 5735 and 5840 — **which leaves eighteen channels (45%)**.

## 3. The real problem isn't frequency, it's the parenthesis

That first half is manageable: trim the channel table to twenty-four cells. The parenthesis in §4.10.1.1(2) is the part that isn't.

**(1) 2.4 GHz reads "transmitters using frequency hopping **or digital modulation**."**
**(2) 5.8 GHz reads only "transmitters using frequency hopping."**

Same clause, same section, adjacent subparagraphs. 2.4 GHz admits two emission types; 5.8 GHz admits one.

And §4.10.1.6 says this about 5.8 GHz hopping systems:

> (b) Frequency-hopping spread-spectrum systems operating in 5725 MHz–5850 MHz **shall use at least 75 hopping channels**, and **the 20 dB bandwidth of each hopping channel shall be no greater than 1 MHz**. The average time of occupancy on any frequency shall be no greater than 0.4 seconds within a 30-second period.

Now hold an analogue FPV video transmitter up against it:

| What the rule requires | Analogue FPV video |
|---|---|
| Uses frequency hopping | **Does not hop** — pick a channel and transmit on it |
| At least 75 hopping channels | Uses one at a time |
| 20 dB bandwidth per channel ≤ 1 MHz | About **20 MHz** — twenty times over |
| Average occupancy on any frequency ≤ 0.4 s per 30 s | Sits on the same cell for the entire flight |

**All four fail, and not marginally — by an order of magnitude.**

What about digital video? DJI O3/O4, HDZero and Walksnail are all digitally modulated — but §4.10.1.1(2) opens 5.8 GHz to **hopping** only. Digital modulation isn't written into that subparagraph.

## 4. There's a second path, and it doesn't take analogue either

LP0002 §5.7 is the other candidate:

> **Unlicensed National Information Infrastructure devices: using wideband digital modulation techniques** to provide high-data-rate mobile and fixed communications for individuals, businesses and institutions.
> 5.7.1 Operating frequency ranges: 5.15 GHz–5.25 GHz, 5.25 GHz–5.35 GHz, 5.470 GHz–5.725 GHz and **5.725 GHz–5.85 GHz**.

This one does cover 5.725–5.85, and what it requires is **wideband digital modulation** (§5.7.5: 6 dB bandwidth of at least 500 kHz).

So the two doors look like this:

| Path | Frequency | What it admits |
|---|---|---|
| §4.10 | 5725–5850 | **Frequency hopping only** (≥75 channels, ≤1 MHz each) |
| §5.7 | 5.725–5.85 GHz | **Wideband digital modulation only** |

**Analogue FPV video neither hops nor is digitally modulated. It gets through neither door.**

Digital video has a plausible case for §5.7 — it genuinely is wideband digital modulation. But §5.7's definition says "high-data-rate mobile and fixed communications," and whether a one-way video downlink counts as an "information transmission device" is a question for the testing body, not something reading the text settles.

## 5. This one is a different shape

This series has now hit four cases of "the clause's name doesn't match what it governs": [the drone chapter has no privacy provision](/posts/policy/2026-08-07-drone-privacy-taiwan-en), [the cybersecurity spec defines a 'series' by hardware module and ignores firmware](/posts/tech/2026-08-08-px4-vs-ardupilot-en), [the exam's meteorology section tests crewed-aviation weather theory](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en), and [the "model aircraft transmitter" clause gives you 72 MHz and one direction](/posts/tech/2026-08-08-drone-radio-link-en).

**This one is different. It isn't that the name mismatches the contents — it's that no clause in the document is shaped like this thing at all.**

The reason isn't hard to guess. LP0002 §4.10 and §5.7 were written for the world of spread-spectrum and digital communications: Bluetooth, Wi-Fi, wireless mice, U-NII. An analogue FPV video transmitter is an analogue FM transmitter that puts a camera signal straight onto a carrier — genealogically closer to an early wireless TV sender. **The rules don't exclude it; the rules were written before anyone was thinking about it.**

To be explicit: this is **a literal reading of the text, not legal advice**. How these devices are actually classified, how import and retail inspection handles them, whether the user side is enforced at all — none of that is answerable by reading the specification, and I found no enforcement cases. **But on the face of the text, those four requirements do not match the physics of analogue video, and that much is clear.**

## 6. The CAA already knows FPV pilots are its loudest objectors

The Institute of Transportation's [*Preliminary Research Plan for Promoting Taiwan's Drone Technology Industry*](https://www.iot.gov.tw/uploads/asset/data/66195b36367376304acd4c8b/%E6%8E%A8%E5%8B%95%E6%88%91%E5%9C%8B%E7%84%A1%E4%BA%BA%E6%A9%9F%E7%A7%91%E6%8A%80%E7%94%A2%E6%A5%AD%E7%99%BC%E5%B1%95%E5%85%88%E6%9C%9F%E7%A0%94%E7%A9%B6%E8%A6%8F%E5%8A%83) attaches a record of an interview with the Civil Aeronautics Administration dated 16 March 2021. One line:

> The applications whose users push back hardest against the drone regulations are agricultural spraying and **FPV (racing drone)** users, who find the airspace application process and the visual-line-of-sight rules hardest to accept.

**The regulator itself recorded FPV as one of the two loudest constituencies.** That record is about airspace and line-of-sight rules, not frequency — but read it next to the section above and the FPV community turns out to be stuck in two entirely separate systems at once: aviation law governs how they fly, telecom regulation governs their equipment, and the latter has no clause for it.

Incidentally, the same interview record contains a line that happens to check this series' earlier reasoning:

> **Flight control and RF are the weak links in Taiwan's drone supply chain.** For flight control, domestic firms mostly use the open-source PX4 or ArduPilot; Yuhuan does RF work (2.4G), but there are few vendors overall.

That is the CAA speaking in 2021. And [the supply-chain layers post](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) concluded the gap is at layer 3, while [the flight-stack post](/posts/tech/2026-08-08-px4-vs-ardupilot-en) concluded Taiwanese vendors run American and European open-source projects — **which is exactly what the regulator wrote five years ago**. I got there from source code and financial filings; it was written down plainly in the interview appendix of a government-commissioned study. **The series' conclusions and the official ones agree, and they were reached independently.**

## 7. So what should a buyer or a pilot actually check?

No legal advice — just three things you can verify yourself:

1. **Look for the NCC certification label and ID on the box.** A label means the device went through some certification path. No label means it didn't. That's the most direct cell in the table.
2. **Look at the channel table.** If the video transmitter covers Band E or the upper Raceband channels (above 5880), those channels are outside Taiwan's 5725–5850 window.
3. **Look at the power steps.** [The RC-link post](/posts/tech/2026-08-08-drone-radio-link-en) noted that ExpressLRS firmware goes to 2 W while Taiwan's 2.4 GHz ceiling is 1 W. The same problem is more common on the video side — consumer VTX power steps routinely go past 1 W, and **the steps your firmware or menu offers are not the same thing as the steps that are legal where you are**.

## What this post does not answer

- **No enforcement cases found.** I couldn't find public penalty or enforcement records aimed at FPV video transmitters, so I genuinely don't know how this is handled in practice. Absence of cases is not evidence either way.
- **I didn't ask a testing body.** Whether digital video can go through §5.7, and how analogue video is classified in practice, are questions for the accredited testing labs.
- **No international comparison.** The US puts analogue 5.8 GHz FPV under Part 97 amateur radio (licence required) or Part 15 low power; the EU has its own regime. A three-way comparison is worth writing, but it needs a clause-by-clause read of two more rulebooks.
- **Nothing on 1.2/1.3 GHz video.** Long-range pilots use lower bands, and those sit in a completely different cell of Taiwan's frequency allocation table.

---

## References

**Primary: regulation**

- [Technical Specification for Low-power Radio-frequency Devices, LP0002 (1 July 2020 edition), full text](https://ib-lenhardt.com/assets/pdf/archive/%E4%BD%8E%E5%8A%9F%E7%8E%87%E5%B0%84%E9%A0%BB%E5%99%A8%E6%9D%90%E6%8A%80%E8%A1%93%E8%A6%8F%E7%AF%84%E5%85%A8%E6%96%87.pdf) (§4.10.1.1 operating frequency — 2.4 GHz admits "frequency hopping or digital modulation" while 5.8 GHz admits "frequency hopping" only; §4.10.1.2(2) all hopping systems in 5725–5850 capped at 1 W; §4.10.1.6(1)(A)(b) at least 75 hopping channels, 20 dB bandwidth ≤1 MHz per channel, average occupancy ≤0.4 s on any frequency per 30 s; §5.7 U-NII frequency ranges and the wideband-digital-modulation definition; §5.7.5 6 dB bandwidth of at least 500 kHz)

**Primary: government-commissioned study**

- [Preliminary Research Plan for Promoting Taiwan's Drone Technology Industry — Institute of Transportation, MOTC](https://www.iot.gov.tw/uploads/asset/data/66195b36367376304acd4c8b/%E6%8E%A8%E5%8B%95%E6%88%91%E5%9C%8B%E7%84%A1%E4%BA%BA%E6%A9%9F%E7%A7%91%E6%8A%80%E7%94%A2%E6%A5%AD%E7%99%BC%E5%B1%95%E5%85%88%E6%9C%9F%E7%A0%94%E7%A9%B6%E8%A6%8F%E5%8A%83) (appendix interview record, CAA interview of 16 March 2021: "the applications whose users push back hardest are agricultural spraying and FPV users"; "flight control and RF are the weak links in Taiwan's drone supply chain; for flight control domestic firms mostly use the open-source PX4 or ArduPilot")

**Channel reference**

- [5.8GHz FPV Channels & Frequency Chart — Oscar Liang](https://oscarliang.com/fpv-channels) (the full frequency table for Bands A/B/E/F/R; the channel-by-channel comparison in this post is computed from that table and LP0002's 5725–5850 window)

**On this site**

- [Hopping Is Not Encryption: Reading the ExpressLRS Source, and Finding That Taiwan's Rules Turn Channel Count Into a Power Ceiling](/posts/tech/2026-08-08-drone-radio-link-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [PX4 or ArduPilot: The EKF Derivation Lives in the Other Project's Repo, and the Real Fork Is the Licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en)
- [The Drone Chapter Has No Privacy Provision: If You're Overflown, You're Back to the Criminal Code](/posts/policy/2026-08-07-drone-privacy-taiwan-en)
- [How to Read a Drone Spec Sheet: Which Lines the Regulations Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
