---
title: "Why Countering Drones Is Hard: Jamming Is Failing, and Taiwan's Problem Isn't Only Technical"
date: 2026-08-07
type: deep-dive
category: tech
tags: [drone, taiwan, uav, counter-uas, defense-tech]
lang: en
tldr: "Electronic warfare has one structural limitation: it needs a signal to attack. Fiber-optic control emits no radio, satellite links bypass ground jammers, and AI terminal guidance needs no link at all for the final leg — three methods systematically defeating jamming, which is why defense is shifting toward interception. Taiwan carries an extra layer: a Control Yuan investigation documents the Ministry of National Defense revising its drone response SOP three times in two months, from \"may shoot down\" to \"flare warning only, first shot requires the Minister's authorization\" and back to \"shoot down with 7.62mm or smaller.\" That is not a technology problem."
description: "Unpacking both halves of counter-drone work — four detection modalities and their blind spots, the soft-to-hard kill spectrum — and why electronic warfare is failing; then using a Control Yuan report and Taiwan's Civil Aviation Act to show how much of the difficulty is technical and how much is authorization and legal basis."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-07-counter-drone-why-hard)

This series has brushed against counter-drone three times: [the industry map](/posts/tech/2026-08-06-drone-industry-map) sized the market, [the four-criteria piece](/posts/investing/2026-08-06-drone-supply-chain-four-criteria) dissected the Army contract that was terminated in full, and [the market entry piece](/posts/career/2026-08-06-drone-market-entry-mechanics) dissected the National Police Agency's graded award. **Three times, and never a dedicated piece.**

Here it is. One question: **what actually makes countering drones hard?**

The answer has two layers. The technical layer is "jamming is being bypassed," which is universal. Taiwan has a second layer, and it has nothing to do with technology.

## Counter-drone is really two jobs

A counter-UAS system always has two halves: **you have to see it before processing it is even a conversation.** The difficulty is asymmetric — seeing is usually harder than defeating.

**Detection has four modalities**, each with its own blind spot:

| Modality | Principle | Blind spot |
|---|---|---|
| Radar | Detects movement and size | Small slow targets have tiny radar cross sections, easily lost in ground clutter |
| RF analysis | Analyzes control and video downlink signals | Useless against anything that emits no signal |
| Electro-optical (EO/IR) | Visual and thermal signature | Limited by weather, light, and obstruction; usually confirmation, not search |
| Acoustic | Propeller noise signature | Short range, drowned out by ambient noise |

In practice only **multi-sensor fusion** works, because each modality's blind spot is too obvious alone. And the blind spot in the RF row becomes the centre of this article shortly.

For how hard detection is, the military's own words are direct. After Chinese drones filmed Kinmen's Dadan and Erdan islands in April 2024, Army Command chief of staff Chen Chien-yi [told reporters](https://www.cna.com.tw/news/aipl/202404030232.aspx): **"Drones can now fly as high as 6,000 metres, and with ambient background noise masking them, they're actually not easy to detect."**

Worth remembering: **before debating whether to shoot it down, you have to find it.**

**Defeat is a spectrum**, soft to hard:

```
Soft kill ─── RF jamming (sever control and video links, force failsafe)
          ├── GNSS spoofing (feed false position, steer it elsewhere)
          └── Cyber takeover (seize control outright)
Hard kill ─── Nets (ground- or air-launched)
          ├── Interceptor drones (cheap against cheap)
          ├── High-power microwave, HPM (one shot, many targets — for autonomous swarms)
          └── High-energy laser, HEL (low cost per shot, precise; limited by weather and power)
```

How big is this market? The Pentagon's Counter-UAS Marketplace currently catalogs **over 1,600 items** for expedited military procurement. That count alone says something: **nobody has found a general solution**, so everyone is selling their own slice.

## Why jamming is failing

Now the core.

Electronic warfare has long been the workhorse — cheap, repeatable, no falling debris. But it has a structural weakness, stated precisely in [drone-warfare.com's EW analysis](https://drone-warfare.com/counter-uas/electronic-warfare):

> EW's central limitation is that it requires a signal to attack.

And three methods are now **systematically removing that signal**:

**One: fiber-optic control.** The drone trails a physical fiber; control signals travel through glass, not air, making it **completely immune to electronic jamming**. This is not a laboratory concept — [the industry map](/posts/tech/2026-08-06-drone-industry-map) cited frontline researcher Rob Lee's observation that **30–50% of FPVs in some Russian units are fiber-guided**, with the Ukrainian figure around 15%.

**Two: satellite communications.** The link goes overhead; a ground jammer's power never reaches it.

**Three: AI autonomous terminal guidance.** The nastiest of the three — on the final leg of an attack the drone **needs no external link at all**. Cut its link and it has already locked the target and will fly the last mile itself.

What all three share is that they aren't "a stronger signal," they are **no signal**. No amount of jammer power reaches something that isn't there.

The same analysis's conclusion is pointed:

> Systems procured today must be evaluated against the autonomous, satellite-connected threats of 2028, not the RF-dependent drones of 2022.

And on speed: **attackers iterate in weeks; defenders evolve over months to years.** That asymmetry is the counter-drone industry's real structural problem — not that it can't win, but that it **can't keep up**.

## So defense shifts to interception, which has its own costs

The direct consequence of failing jamming is that defensive architecture is pushed toward hard kill. The layered logic becomes: RF detection and multi-sensor fusion find and track; EW engages first as the low-cost, high-volume answer to the majority of threats that still use radio; when EW fails (fiber, satellite, autonomous), kinetic defeat and directed energy take over; high-power microwave handles the autonomous swarms nothing else can stop at scale.

But hard kill has two problems soft kill doesn't:

**Cost exchange ratio.** Firing an expensive interceptor at a few-hundred-dollar attack drone loses on arithmetic. Which is why "cheap interceptor drones against cheap attack drones" became the mainstream direction — and why C-UAS is now treated as its own industry rather than a drone accessory.

**Falling debris.** Whatever you shoot down lands somewhere. On a battlefield that's minor; around a city, an airport, or a power plant it isn't. Taiwan's own regulations show this constraint unusually clearly, as we'll see.

The market numbers reflect the shift. [MarketsandMarkets estimates](https://www.marketsandmarkets.com/Market-Reports/counter-cuas-systems-market-4197284.html) the C-UAS market at US$9.17B in 2026 growing to US$29.7B by 2031 — **a 26.5% CAGR, three times the growth rate of the drone market itself.**

## Taiwan's first layer: writing a specification isn't meeting one

Back to the contract dissected in [the four-criteria piece](/posts/investing/2026-08-06-drone-supply-chain-four-criteria). Twenty-six fixed counter-drone systems for the Army, awarded at NT$987.81 million, specified to **detect a 10 cm² target at 6 km and jam at 4 km**. Acceptance testing and two re-tests all failed; the contract was terminated in full with no payment and roughly NT$98.78 million in performance bond forfeited.

Put that specification against the detection difficulties above and its severity is clear: 10 cm² at 6 km is roughly a palm-sized object six kilometres away — an extreme demand on radar cross section, electro-optical resolution, and clutter rejection all at once. **A specification is one static line of text; meeting it is a moving engineering problem.**

The National Police Agency contract from [the market entry piece](/posts/career/2026-08-06-drone-market-entry-mechanics) took the opposite approach: 50 systems for critical infrastructure, NT$3.67 billion total, graded A/B/C by the **functional scope** that passed verification, top three in each grade delivering proportionally, up to 9 vendors winning.

Side by side, these are two answers to the same question: **facing a technology area with no general solution, do you bet on one vendor meeting the full specification, or spread across several each covering a segment?** The Army's outcome goes some way to explaining why the police graded theirs.

## Taiwan's second layer: what actually jams is authorization

The technical difficulty is universal. Taiwan has another layer, and it is documented unusually completely in public records.

The Control Yuan's [investigation report 112國調0010](https://www.cy.gov.tw/public/Data/113mo/112%B0%EA%BD%D50010.pdf) records the full evolution of the Ministry of National Defense's drone response SOP:

| Date | Key provision |
|---|---|
| 2016-12-16 | Capture guns at low altitude; above a set altitude, jammers first — **or defensive weapons may be used to shoot it down** |
| 2022-07-29 | Whistle alarm, then a designated unit **fires one signal flare as warning**; **beyond flares, the first shot requires the Minister's authorization; no weapon may return fire** |
| 2022-08-29 | After confirming firing angle and impact area are safe, **shoot down with 7.62mm or smaller small arms**, without harming residents or their property |
| 2022-09-01 | Use jamming guns or small arms as appropriate, **combining soft and hard kill** (first round warning shot, second round for effect) |

**Three revisions in two months.**

And the reasons, also recorded, are all non-technical: at a March 2022 legislative interpellation the Premier explained that "Taiwan's difficulty is not firing the first shot; the government will not lightly start a war except as an absolute last resort." During the Han Kuang 38 exercise in late July, China probed the military's response by flying a drone over Dongyin — so on 29 July the flare-only order was issued. Then from August, small Chinese drones repeatedly harassed the offshore islands with footage uploaded to media, and on 29 August the order reverted to permitting shoot-downs.

In between sits the widely reported incident: on 16 August 2022 on Kinmen's Erdan island, troops responded to a drone by throwing rocks at it.

The Control Yuan's findings are precise: the sergeant who threw rocks acted **on personal initiative, under no one's order**; the garrison commander firing a warning flare **complied with the SOP then in force** (since beyond flares the first shot required the Minister's authorization). But the report's overall conclusion is critical:

> Small drones are compact and highly maneuverable; by the time the garrison arrived with flare guns and jamming guns, the drone had already completed its reconnaissance and departed. Post personnel failing to make full immediate use of the weapons they carried was clearly inappropriate … it highlights that the military's response remains conservative and outdated, unable to keep pace with technological change.

**To be clear about what happened**: it wasn't that soldiers didn't know what to do. **The rules at that moment said exactly that.** And the rules said that because "don't fire the first shot" is a strategic constraint sitting above any technical consideration.

Which is the real shape of the counter-drone problem in Taiwan: **the technical question is "can you hit it," the institutional question is "who has authority to decide to,"** and the latter was escalated to the Minister, if not higher. A drone goes from entering view to finishing its reconnaissance and departing in a few minutes. That timescale and that authorization level are incompatible.

The report also notes the military has an established program for a remotely piloted aircraft defense system, fielding a validation batch before procuring enough for island-wide deployment (quantities redacted in the public version).

## The legal basis exists; the execution is fragmented

A common misconception is that Taiwan lacks legal authority to bring down a drone. Authority is not what's missing — integration is.

Article 99-13 of the Civil Aviation Act divides enforcement finely — **note these are four different executing bodies**:

| Where it intruded | Who handles it |
|---|---|
| Prohibited or restricted zones | The zone's **administrator** takes appropriate measures to stop or remove it; if necessary, notifies the CAA to enforce jointly with police |
| Within a set distance of airports or airfields | The airport or airfield's **operator or administrator, jointly with the Aviation Police Bureau** |
| Outside zones and times announced by local government | The **municipal or county government**; police assistance may be requested |
| Inside a government agency's premises | That **agency** may take appropriate measures to stop or remove it |

Article 118-1 of the same act permits confiscation of an offending drone. The Fortress and Garrison Area Act separately prohibits photography, sketching, and other military reconnaissance in its Articles 4 and 5, with Article 13 permitting seizure of the aircraft. For Chinese civil aircraft, Article 41 of the Enforcement Rules of the Act Governing Relations Between the People of the Taiwan Area and the Mainland Area sets a graduated response by distance — beyond 30 nautical miles, intercept and identify then expel or guide to landing; within 30 to 12, warning shots, forced expulsion, or guided landing; within 12, warning shots, forced expulsion, or compelled landing. For the offshore island restricted areas it is identification and close surveillance, **with warning, forced expulsion, or compelled landing when necessary**.

National Taiwan University law professor Chiang Huang-chih drew a distinction worth noting in [a commentary](https://talk.ltn.com.tw/article/paper/1639489). At the time the defense ministry had characterized Chinese drones as gray-zone harassment and said it would respond under a "self-defense" principle. Chiang's argument is that **the right basis is law enforcement, not self-defense**:

> International law equally permits a state, under the principle of territorial sovereignty, to take all necessary "law enforcement actions" against aircraft intruding into its airspace, including shooting them down … while law enforcement does involve physical force, it does not fall within the UN Charter's prohibition on the use of force, requires no justification through self-defense, and does not place the states concerned into a state of belligerency.

The practical difference is real: **invoking self-defense concedes that an armed attack occurred, placing both sides in belligerency under the law of armed conflict; invoking enforcement is the ordinary exercise of sovereignty on your own territory, and does not escalate.** And he considers the domestic legal basis already sufficient — the Civil Aviation Act, the Fortress and Garrison Area Act, the Military Camp Security Maintenance Act, and the drone intrusion SOPs, all of which apply to aircraft of any nationality, not only the mainland's.

**So the problem isn't missing authority. It's four bodies of law, four executing agencies, and a military authorization escalated to the Minister — which together cannot produce a process that acts within minutes.**

## Three judgments

1. **Detection is harder than defeat, and there is no single answer.** Each of the four detection modalities has a clear blind spot, so fusion is mandatory; the Pentagon's catalog of 1,600-plus items is itself evidence that no general solution exists. When evaluating any counter-drone proposal, ask how the detection chain is assembled before asking what it shoots with.
2. **Buying a counter-drone system is buying something that expires.** EW needs a signal, and fiber, satellite, and AI terminal guidance are removing the signal. With attackers iterating in weeks and defenders in months to years, **procurement specifications have to target the threat three to five years out**, not the threat on the day of the tender — which is why software updatability in this category is not a bonus feature but a requirement.
3. **Taiwan's most expensive lesson isn't technical.** The NT$988 million termination taught that specifications must be self-verifiable before bidding. But the Control Yuan report exposes something more fundamental — **three SOP revisions in two months, and a first shot requiring the Minister's authorization.** That is an incompatibility between authorization level and threat timescale. You can buy the technology; you cannot buy the decision process.

## References

**Counter-drone technology**

- [drone-warfare.com — Counter-UAS Electronic Warfare: Jamming, Spoofing & Defeat](https://drone-warfare.com/counter-uas/electronic-warfare) (EW needs a signal; the fiber/satellite/autonomous bypasses; layered architecture; the attacker-defender iteration gap)
- [Robin Radar — 10 Types of Counter-drone Technology](https://www.robinradar.com/resources/10-counter-drone-technologies-to-detect-and-stop-drones-today) (full taxonomy of four detection modalities and six defeat categories)
- [Dedrone — Countering UAS Threats (white paper)](https://www.dedrone.com/white-papers/countering-uas-threats) (why multi-sensor fusion is necessary, including against fiber-tethered and waypoint-autonomous targets)
- [Airsight — Anti-Drone Systems: What Works at Every Protection Level](https://www.airsight.com/blog/anti-drone-systems-protection-levels) (the Pentagon's Counter-UAS Marketplace, 1,600-plus items)
- [Unmanned Airspace — The Counter UAS Directory and Buyer's Guide](https://www.unmannedairspace.info/wp-content/uploads/2022/06/Counter-UAS-directory.-June-2022.v1.pdf) (actual HPM and HEL effector specifications and vendor listings)
- [MarketsandMarkets — Counter-UAS Systems Market](https://www.marketsandmarkets.com/Market-Reports/counter-cuas-systems-market-4197284.html) (US$9.17B in 2026, US$29.7B by 2031, 26.5% CAGR)

**Taiwan's institutions and legal basis (primary)**

- [Control Yuan — Investigation Report 112國調0010](https://www.cy.gov.tw/public/Data/113mo/112%B0%EA%BD%D50010.pdf) (in Chinese; the four SOP revisions in full with dates, the Erdan island findings, the stated reasons, and the drone defense system program)
- [Civil Aviation Act, Article 99-13 — Laws & Regulations Database](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=99-13) (in Chinese; enforcement responsibility across four zone types)
- [Enforcement Rules of the Act Governing Relations Between the People of the Taiwan Area and the Mainland Area, Article 41](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=41&pcode=Q0010002) (in Chinese; graduated response by distance for mainland civil aircraft)
- [Chiang Huang-chih — The legal basis for "law enforcement action" against intruding Chinese drones](https://talk.ltn.com.tw/article/paper/1639489) (in Chinese; enforcement versus self-defense, and an inventory of domestic legal bases)
- [CNA — Army: shots will be fired at drones within range](https://www.cna.com.tw/news/aipl/202404030232.aspx) (in Chinese; the Army chief of staff on detection difficulty — 6,000 metre altitudes and background noise masking)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map)
- [The Drone Supply Chain Against a Four-Criteria Framework: Only One of Four Holds](/posts/investing/2026-08-06-drone-supply-chain-four-criteria)
- [Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You](/posts/career/2026-08-06-drone-market-entry-mechanics)
- [Taiwan's Drone Rules in Plain Language: What Needs Registering, What Needs a Licence, What Gets You Fined](/posts/policy/2026-08-06-taiwan-drone-regulation-guide)
