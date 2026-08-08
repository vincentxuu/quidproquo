---
title: "Frequency Hopping Is Not Encryption: Reading the ExpressLRS Source, and Finding That Taiwan Turns Channel Count Into a Power Ceiling"
date: 2026-08-08
type: deep-dive
category: tech
tags: [drone, rf-link, expresslrs, fhss, lora]
lang: en
tldr: "The control link is one of three modules Taiwan's drone cybersecurity spec names by hand, yet almost nothing written in Chinese explains how it works. ExpressLRS is open source, so you can just read it: the hop sequence comes from a binding phrase, MD5'd into a UID and fed to a linear congruential generator with a=214013, c=2531011. Fully reproducible — I ported it to Python and diffed it against the original C, bit-identical across all seven channel counts. The link itself carries no encryption at all, only a 14-bit CRC. And Taiwan's LP0002 has a neat quirk: a 2.4 GHz hopping system using 75 or more channels may transmit up to 1 W, while fewer than 75 caps you at 0.125 W. ExpressLRS uses 80. Channel count is not just an anti-jam parameter — it sets your legal power. Meanwhile the clause literally titled 'model aircraft radio control' only offers 27/72 MHz and permits one-way control only, so today's bidirectional transmitters do not go through it."
description: "Taking the drone control link apart through the ExpressLRS source: how the hop sequence derives from the binding phrase (with a reproducible port and cross-check), the sensitivity price of each LoRa and FLRC rate, how the Listen Before Talk threshold is computed; then comparing against Taiwan's LP0002 low-power RF specification to show how channel count sets the legal power ceiling and why the 'model toy radio control' clause does not fit modern transmitters."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-08-drone-radio-link)

The [spec-sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) unpacked how Taiwan's *Remotely Piloted Aircraft Cybersecurity Testing Specification* defines a product series — **identical flight-control, communications and satellite-positioning chip modules**. Of those three, flight control got taken apart in the [previous post](/posts/tech/2026-08-08-px4-vs-ardupilot-en). This one takes the second: communications.

And the [counter-drone piece](/posts/tech/2026-08-07-counter-drone-why-hard-en) turned on one proposition — electronic warfare needs a signal to attack. What it did not say is what that signal actually looks like. This fills that in.

Same method as last time: **ExpressLRS is open source** (GPLv3, on GitHub), so this needs no oscilloscope, no spectrum analyser, and no transmitter purchase. Every number below comes from HEAD on 2026-07-31, commit `5909f77`.

## 1. The hop sequence is entirely determined by one phrase

ExpressLRS users configure exactly one thing: the **binding phrase**. Type the same words into the transmitter and the receiver and they pair. What that phrase does is four steps in the source.

**Step one: the phrase becomes six bytes.** `src/python/binary_configurator.py` line 43:

```python
uid = hashlib.md5(('-DMY_BINDING_PHRASE="' + phrase + '"').encode()).digest()[0:6]
```

**Step two: the UID becomes a random seed.** `src/lib/OTA/OTA.cpp` line 41:

```cpp
uint32_t OtaGetUidSeed()
{
    return ((uint32_t)UID[2] << 24) + ((uint32_t)UID[3] << 16) +
           ((uint32_t)UID[4] << 8) + (UID[5]^OTA_VERSION_ID);
}
```

**Step three: the seed feeds a linear congruential generator.** `src/lib/FHSS/random.cpp` is this short in its entirety:

```cpp
uint16_t rng(void) {
    const uint32_t m = 2147483648;
    const uint32_t a = 214013;
    const uint32_t c = 2531011;
    seed = (a * seed + c) % m;
    return seed >> 16;
}
```

**Step four: that shuffles a 256-slot hop sequence.** The comment in `src/lib/FHSS/FHSS.cpp` states four requirements outright: the sync channel every n hops, no repeat within a block, each channel used as evenly as possible, pseudorandom.

The chain is fully deterministic. To be sure I had read it correctly, I ported it to Python, then copied the two original C functions **verbatim** into a standalone C program, fed both the same seed, and diffed:

```
$ diff <(python3 hop.py) <(./xcheck)
(no output)
```

Bit-identical across all seven channel counts (3, 4, 8, 13, 20, 40, 80). So what follows is not my inference, it is what the algorithm actually produces:

```
phrase "taipei-2026" / FCC915
  UID  c8:fd:28:08:da:63   seed 0x2808da67   sync channel 20
  first 16 hops (channel) [20, 0, 3, 37, 8, 7, 16, 34, 2, 6, 14, 5, 15, 13, 30, 33]
  first 6 hops (MHz)      [915.5, 903.5, 905.3, 925.7, 908.3, 907.7]

phrase "taipei-2027" / FCC915
  UID  49:b6:e8:ba:bf:8c   seed 0xe8babf88   sync channel 20
  first 16 hops (channel) [20, 13, 24, 10, 19, 27, 15, 2, 37, 16, 29, 31, 1, 4, 34, 32]
```

One character of difference in the phrase gives a completely different sequence — which is MD5 behaving as it should. And note that **the same phrase yields the same seed on 900 MHz and on 2.4 GHz** (the seed calculation does not look at the band); it is simply applied to a channel table of a different size.

## 2. So "binding" is not encryption

Worth stating plainly, because the two get conflated.

The ExpressLRS link carries **no encryption whatsoever**. Searching `src/lib` and `src/src`, the only thing touching the RF packet is a 14-bit CRC (polynomial `0x2E57`, its initialiser also derived from the UID). The binding phrase does three things: it picks the hop sequence, it sets the CRC initialiser, and it lets the receiver discard packets not meant for it.

**It solves "the pilot next to me is also flying," not "someone wants to take me down."** Those look similar and are not:

- Several aircraft at once: different phrases → different hop sequences → low collision probability, and the occasional collision gets filtered by CRC. Hopping is very effective here.
- Deliberate jamming: an adversary who does not care about spectral efficiency simply floods 2400–2483.5 MHz, and which channel you hopped to is irrelevant. Hopping does not help here.

This is the other half the [counter-drone piece](/posts/tech/2026-08-07-counter-drone-why-hard-en) left unexplored. Electronic warfare still works against most consumer and commercial drones not because it defeats frequency hopping but because **it never needs to** — broadband suppression is channel-agnostic. And fibre-optic guidance is unanswerable because that link emits no electromagnetic signal to suppress. Everything in between — encrypted links, cognitive hopping, directional antennas — is where the actual contest is.

To be fair to the project: ExpressLRS is a control link, designed for **low latency and high reliability**, not for resisting deliberate attack, and it never claims otherwise. Treating it as a security mechanism is a user's misunderstanding, not a flaw in it. But if you are building a product that must pass cybersecurity testing, the "communications module" box is asking about exactly this.

## 3. Rate for sensitivity: the price is marked in the source

`src/src/common.cpp` holds two tables side by side — one of modulation parameters, one called `ExpressLRS_AirRateRFperf` whose second field is receiver sensitivity in dBm. Laid out:

**2.4 GHz (SX1280)**

| Mode | Packet interval | Packets per hop | Dwell/channel | Sensitivity |
|---|---|---|---|---|
| FLRC 1000Hz | 1000 µs | 2 | 2.0 ms | −104 dBm |
| LoRa 500Hz | 2000 µs | 4 | 8.0 ms | −105 dBm |
| LoRa 250Hz | 4000 µs | 4 | 16.0 ms | −108 dBm |
| LoRa 150Hz | 6666 µs | 4 | 26.7 ms | −112 dBm |
| LoRa 50Hz | 20000 µs | 2 | 40.0 ms | −115 dBm |

**900 MHz (SX127x)**

| Mode | Sensitivity |
|---|---|
| LoRa 200Hz | −112 dBm |
| LoRa 100Hz | −117 dBm |
| LoRa 50Hz | −120 dBm |
| LoRa 25Hz | −123 dBm |

On the same chip, dropping from 500 Hz to 50 Hz buys 10 dB; on 900 MHz, 200 Hz down to 25 Hz buys 11 dB. And the two extremes across bands — 2.4 GHz at 500 Hz, −105 dBm, versus 900 MHz at 25 Hz, −123 dBm — differ by **18 dB**. In free space roughly 6 dB is a doubling of distance, so that is **about eight times the range**, paid for by dropping the control update rate from 500 per second to 25.

"Use 900 MHz at a low rate for long range" usually gets passed around as a rule of thumb. It is in fact an engineering trade you can read straight off a table, with numbers on both sides.

## 4. Taiwan: channel count sets how much power you may legally transmit

Now put the NCC's [Low-Power Radio-Frequency Devices Technical Specification](https://ib-lenhardt.com/assets/pdf/archive/%E4%BD%8E%E5%8A%9F%E7%8E%87%E5%B0%84%E9%A0%BB%E5%99%A8%E6%9D%90%E6%8A%80%E8%A1%93%E8%A6%8F%E7%AF%84%E5%85%A8%E6%96%87.pdf) (LP0002, 1 July 2020 edition) next to it.

**§4.10.1.2, peak conducted output power, operating in 2400–2483.5 MHz:**

> (A) Hopping systems using at least 75 hopping channels: 1 W or less.
> (B) Other than (A), hopping systems under 4.10.1.6(1)(A)(a): **0.125 W or less**.

And §4.10.1.6 requires a hopping system to "use at least 15 non-overlapping channels."

So 2.4 GHz hopping devices come in two tiers: **15–74 channels, ceiling 125 mW; 75 or more, ceiling 1 W.** A 9 dB difference.

How many channels does the ExpressLRS `ISM2G4` domain use? From `src/lib/FHSS/FHSS.cpp`:

```cpp
{"ISM2G4", 2400400000, 2479400000, 80, 2440000000}
```

**Eighty.** Just over that threshold of 75.

I do not know whether this was deliberate (the FCC rules carry the same 75-channel threshold, so following US rules is the likelier explanation), but the effect is the same: **channel count here is not merely an anti-jam parameter, it is the switch that sets your power ceiling.** Use five fewer channels and legal power falls from 1 W to 125 mW — roughly a third of the range.

The same section also caps dwell time: within a period of 0.4 seconds multiplied by the number of hopping channels, average occupancy of any one frequency must not exceed 0.4 seconds. The slowest row in the table above dwells 40 ms, a factor of ten under. This one will not be the binding constraint.

(In passing: the `PowerLevels_e` enum runs all the way to `PWR_2000mW`. Two watts is above the 1 W ceiling LP0002 sets for 2.4 GHz — what the firmware offers and what is legal where you are standing are two different things, and that is the user's responsibility.)

## 5. The clause literally titled "model aircraft radio control" does not govern today's transmitters

LP0002 §5.3 has a whole section called "radio remote controls," and §5.3.1 is "model toy radio remote controls," with *aircraft device* written in the parentheses. It looks like the clause a drone transmitter should use.

Open it and read the frequencies it grants:

> (1) The following frequencies are available to any form of remote control: 26.995 MHz, 27.045 MHz … 27.245 MHz.
> (2) The following band is limited to model aircraft remote controls: **72.00–72.99 MHz**, channel spacing 20 kHz.
> (3) The following band is limited to surface model remote controls: 75.41–75.99 MHz.

Effective radiated power 0.75 W, bandwidth within 8 kHz. Then §5.3.1.7, restrictions, item one:

> **(1) One-way control only.**

These are the specifications of a 1990s crystal-oscillator transmitter. Those four words, *one-way control only*, exclude every modern transmitter that reports battery, RSSI or GPS back — and returning telemetry is exactly what ExpressLRS does every 16 to 128 packets (the `TLMinterval` column in the 2.4 GHz table runs from `TLM_RATIO_1_16` to `TLM_RATIO_1_128`).

So the 2.4 GHz transmitters sold in Taiwan today do not go through that clause. They go through §4.10, "operating frequency 2400–2483.5 MHz … employing frequency hopping or digital modulation" — a generic spread-spectrum clause shared with Bluetooth, Wi-Fi and wireless mice.

**This is the fourth time this series has hit the same shape: the clause named after a thing is not the clause that governs the thing.** [The drone chapter has no privacy provision](/posts/policy/2026-08-07-drone-privacy-taiwan-en); [the cybersecurity spec defines a "series" by hardware module, not firmware](/posts/tech/2026-08-08-px4-vs-ardupilot-en); [the exam's meteorology subject tests manned-aviation meteorology](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en); and now "model aircraft radio control" grants only 72 MHz and forbids two-way. When reading regulations, **checking whether a clause's name matches its contents matters more than finding the clause**.

That said, LP0002 does stitch the two regimes together in one place. §3.8.3:

> Use for the remote control of remotely piloted aircraft or similar equipment shall comply with the competent authority's regulations governing remotely piloted aircraft.

And the [draft explanatory memorandum in the Executive Yuan Gazette](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg026086/ch06/type3/gov53/num15/images/Eg01.pdf) says why it changed: "§3.8.3 amends 'model aircraft' to 'remotely piloted aircraft' per the definitions in the Civil Aviation Act, and deletes redundant wording." **The NCC deliberately aligned its terminology with aviation law in 2020.** The spectrum regulator pointing at the aviation regulator is explicit, in writing.

## 6. There is no room for ExpressLRS on 900 MHz in Taiwan

ExpressLRS has eight sub-GHz domains, of which the most used, `FCC915`, spans 903.5–926.9 MHz across 40 channels.

How much of that has Taiwan opened? Per the NCC's inspection-consistency meeting records, the Ministry of Transportation and Communications amended the *Republic of China Radio Frequency Allocation Table* on 22 February 2017 (document 交郵字第10650017402號), **adding 920–925 MHz for low-power IoT devices on a secondary basis**.

That is 5 MHz, and secondary — a secondary user must accept interference from primary users and must not interfere with them. None of the ExpressLRS sub-GHz domains fits inside 5 MHz.

(On 433 MHz, the same meeting record notes that "per §3.4.2 of the low-power RF specification, the 433 MHz band may be used to transmit control signals." ExpressLRS has `EU433`, `AU433` and `US433` domains, but I did not find the full text of §3.4.2's limits, so I am not drawing a conclusion.)

The practical takeaway is blunt: **in Taiwan, 2.4 GHz is the path with a clear clause behind it; sub-GHz is not.**

## 7. Listen Before Talk: an EU rule compiled into the code

One more thing worth noticing. All of `src/lib/LBT` sits inside `#if defined(Regulatory_Domain_EU_CE_2400)` — **only the EU build compiles it in**.

The thresholds are not arbitrary; the comment cites the formula's origin:

```
// Calculated from EN 300 328, adjusted for 800kHz BW for sx1280
// TL = -70 dBm/MHz + 10*log10(0.8MHz) + 10 × log10 (100 mW / Pout)
```

So the threshold moves with transmit power: −61 dBm at 10 mW, −65 at 25 mW, −68 at 50 mW, −71 at 100 mW. The louder you speak, the more sensitive you must be to everyone else.

There is a nice engineering detail too: how long you must wait before an RSSI reading is valid varies with spreading factor — on the SX1280, 100 µs for SF5, 141 µs for SF6, 218 µs for SF7, and 480 µs measured for SF8. The comment explains this as "60 µs TX→RX switch time plus one LoRa symbol time," and notes that the SF8 figure was found empirically rather than calculated.

**A regulatory clause becoming a constant with units in a source file is what "compliance" looks like at its most concrete.** The previous post discussed BSD-3 versus GPLv3, which is compliance at the licensing layer. This is compliance at the RF layer. Both are visible in the source.

## What this post does not answer

- **Nothing was measured.** This is all source code and regulatory text. Real transmit power, spurious emissions and actual jamming resistance need a spectrum analyser and an anechoic chamber — that is the testing laboratory's job.
- **Video downlink is not covered.** The control link and the video transmitter are separate systems with different bands, powers and rules. The status of 5.8 GHz video in Taiwan deserves its own piece.
- **Other control protocols are not covered.** TBS Crossfire, FrSky ACCST/ACCESS and Spektrum DSMX are all closed; DJI's OcuSync more so. I can only read the open-source one, so these conclusions do not generalise automatically.
- **No testing body was consulted.** The reading of LP0002 above is a literal reading of the text. How a designated laboratory treats a given module in practice, and whether a firmware change triggers a retest, is a question for that laboratory.

---

## References

**Primary: source code (ExpressLRS `5909f77`, retrieved 2026-07-31)**

- [ExpressLRS/ExpressLRS — GitHub](https://github.com/ExpressLRS/ExpressLRS) (GPLv3; the nine regulatory domain tables and sequence builder in `src/lib/FHSS/FHSS.cpp`; the LCG in `src/lib/FHSS/random.cpp`; `OtaGetUidSeed()` in `src/lib/OTA/OTA.cpp`; the binding-phrase MD5 in `src/python/binary_configurator.py`; the rate and sensitivity tables in `src/src/common.cpp`; the EN 300 328 thresholds in `src/lib/LBT/LBT.cpp`; the power levels in `src/lib/POWERMGNT/POWERMGNT.h`)
- [FHSS.cpp — ExpressLRS](https://github.com/ExpressLRS/ExpressLRS/blob/master/src/lib/FHSS/FHSS.cpp) (the original comment listing the four requirements of the hop sequence)
- [common.cpp — ExpressLRS](https://github.com/ExpressLRS/ExpressLRS/blob/master/src/src/common.cpp) (`ExpressLRS_AirRateConfig` and `ExpressLRS_AirRateRFperf`; every sensitivity and dwell figure here is computed from these two tables)

**Primary: Taiwanese regulation**

- [Low-Power Radio-Frequency Devices Technical Specification LP0002 (1 July 2020 edition), full text](https://ib-lenhardt.com/assets/pdf/archive/%E4%BD%8E%E5%8A%9F%E7%8E%87%E5%B0%84%E9%A0%BB%E5%99%A8%E6%9D%90%E6%8A%80%E8%A1%93%E8%A6%8F%E7%AF%84%E5%85%A8%E6%96%87.pdf) (§3.8.3 on remotely piloted aircraft; the 75-channel power threshold in §4.10.1.2; the minimum 15 channels and dwell limit in §4.10.1.6; the 27/72/75 MHz allocations and "one-way control only" in §5.3.1)
- [Draft explanatory memorandum for the specification — Executive Yuan Gazette, Vol. 026 No. 086](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg026086/ch06/type3/gov53/num15/images/Eg01.pdf) (why §3.8.3 changed "model aircraft" to "remotely piloted aircraft")
- [NCC inspection-consistency meeting records, sessions 1–81](https://www.tuv.com/content-media-files/taiwan/pdfs/ncc-telecom-end-equipment-meeting-minutes/ncc%E5%AF%A9%E9%A9%97%E4%B8%80%E8%87%B4%E6%80%A7%E6%9C%83%E8%AD%B0%E8%A8%98%E9%8C%84%E7%B8%BD%E5%BD%99%E6%95%B4-(1-81%E6%AC%A1).pdf) (MOTC document 交郵字第10650017402號 of 22 February 2017 adding 920–925 MHz for low-power IoT on a secondary basis; 433 MHz permitted for control signals)
- [Remotely Piloted Aircraft Cybersecurity Testing Specification — Executive Yuan Gazette](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032077/ch05/type2/gov87/num15/Eg.pdf) (the "communications module" in the product-series definition)

**On this site**

- [PX4 or ArduPilot: the EKF derivation lives in the other project's repo, and the real fork is the licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [Why Countering Drones Is Hard: Jamming Is Failing, and Taiwan's Problem Isn't Only Technical](/posts/tech/2026-08-07-counter-drone-why-hard-en)
- [The Drone Chapter Has No Privacy Provision: If You're the One Being Flown Over, You Fall Back on the Criminal Code](/posts/policy/2026-08-07-drone-privacy-taiwan-en)
- [The CAA Published the Entire Question Bank: What Four Exam Subjects Reveal About the Regulator](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en)
