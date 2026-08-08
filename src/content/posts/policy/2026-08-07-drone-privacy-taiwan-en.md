---
title: "The Drone Chapter Has No Privacy Provision: If You're the One Being Flown Over, You Fall Back on the Criminal Code"
date: 2026-08-07
type: deep-dive
category: policy
tags: [drone, taiwan, uav, privacy, regulation]
lang: en
tldr: "Taiwan's Civil Aviation Act drone chapter regulates flight safety, not the people being flown over — and that isn't my commentary, it's the Legislative Yuan's own 2020 research report: the chapter 'contains no specific provision on the privacy management that matters most to the public.' So privacy falls back on Article 315-1 of the Criminal Code and the Personal Data Protection Act, and case law shows that catches part of it: pointing a drone at a hot spring room drew an indictment, raising a phone to a window drew four months. What it doesn't catch is evidence — the report's own words: 'by the time the victim notices it, it may already have vanished.'"
description: "The legal position on drone privacy in Taiwan: why the Civil Aviation Act's drone chapter has no privacy provision, which conduct the Criminal Code and data protection law actually reach, how courts define non-public activity and dragnet surveillance, and why evidence-gathering is the real bottleneck."
draft: false
---

> 🌏 [中文版](/posts/policy/2026-08-07-drone-privacy-taiwan)

**Twenty-two pieces into this series, all of them share one vantage point.**

Which supply chain layer, who makes money, how regulation blocks scale, how to read a spec sheet, why a contract was terminated in full — all of it about **the people operating drones and the industry around them**. Not one piece about **the people being flown over.**

That gap reads as a gap, so here is the missing piece. Scope is one cell only: privacy. Noise, criminal misuse, and autonomous weapons ethics are separate topics and this piece doesn't skim them.

## The chapter has no privacy provision, and the legislature said so

The key fact first, and it isn't my commentary.

The Legislative Yuan's Legal Affairs Bureau published a research report in March 2020, [*Examining Drone Regulation from the Perspective of Privacy*](https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=6590&pid=192528), which states it plainly:

> In the drone chapter of the Civil Aviation Act passed on 3 April 2018, **there is no specific provision on the privacy management that matters most to the public** — only Article 99-14, which prohibits drone flight over gatherings of people or outdoor assemblies and processions, and requires preventing proximity to or collision with other aircraft, buildings, or obstacles.

The same report is more explicit still: "although the amendment established a dedicated drone chapter, it is **primarily concerned with flight safety and national security**."

Set that beside what this series has already established. [The plain-language regulation piece](/posts/policy/2026-08-06-taiwan-drone-regulation-guide-en) catalogued what the chapter governs — registration, licensing, prohibited zones, altitude limits, penalties; [the spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) unpacked how weight thresholds decide your procedural track. **What that whole regime protects is property on the ground, other aircraft in the air, and national security. About the person behind the window, the chapter is silent.**

So privacy falls back on general law. And that reaches part of it.

## The Criminal Code does catch part of it

Practice runs mainly on Article 315-1 of the Criminal Code (violation of secrecy): using tools or equipment without cause to **peer at** another's non-public activity, or without cause **recording** another's non-public activity, punishable by up to three years' imprisonment, detention, or a fine up to NT$300,000. Article 315-3 adds that the medium and items carrying the recorded content are **forfeited regardless of whose property they are**.

For drones specifically, one case is frequently cited. Per [ETtoday in August 2022](https://www.ettoday.net/news/20220804/2309043.htm), a man serving as CEO of a semiconductor company visited a hot spring hotel in Wulai, New Taipei, in January 2022, flew a drone outdoors for a loop, and on the return leg its camera captured a woman leaning naked against the glass window of the adjacent room. He claimed he only wanted to look at the night view.

The Taipei District Prosecutors Office reasoned that every room in the hotel has glass windows precisely so guests can bathe privately while looking out; flying a camera-equipped drone outside them anyway constituted **dolus eventualis — indirect intent to film covertly**. It indicted him for violation of secrecy and asked the court to forfeit the drone, controller, and batteries.

(This piece goes only as far as indictment, because that is where the public reporting ends; the trial outcome is outside what I verified.)

**"Indirect intent" is the part of this case worth remembering.** It means you don't have to prove the operator aimed for that window. Knowing the setting would capture private activity and flying a camera there anyway is enough to indict. That's a hard threshold for the "I was only shooting scenery" defense.

## How courts define "non-public activity"

To see how far this route goes, look at how courts define the term. Taipei District Court's [judgment 113-Yi-850](https://taiwanopendata.com/law/iG7g4177w38xlXQx76Vf9d1Y8.html) is the most complete — not a drone case, but a man raising a phone to a ground-floor window to look inside, sentenced to **four months**:

> "Non-public activity" under Article 315-1 means activity where the actor **subjectively holds an expectation or intention of conducting it privately without disclosure** (subjective expectation of privacy), and where **the surroundings or equipment objectively suffice to secure that privacy** (objective privacy environment).

The judgment disposed of two defenses that map directly onto drones:

**One: an open window makes no difference.** The defendant argued the window was open and the room easily visible from outside. The court disagreed: the window's height already secured a degree of privacy against ordinary sight lines, and "**that privacy is unrelated to whether the window was open.**"

**Two: not seeing the person is still a completed offence.** The defendant argued he never actually saw her, so at most this was an unpunished attempt. The court disagreed again — using a tool to extend one's vision into non-public activity completes the offence, and "even though the defendant did not actually see A herself, this still revealed private information about her whereabouts and daily activity."

Translated into drone terms: **flying over to look can be a crime even if the curtains were open and even if nobody was captured.** And the test for "expectation of privacy" is whether an ordinary person would need a tool to see in — a fifteenth-floor living room, a walled courtyard, a mountainside hot spring room all fit that description.

One addition: a 2020 [technology law note](https://www.taipeilaw.com/zh_TW/posts/454) from Taipeilaw Attorneys makes the same two-track point — pointing a camera at someone's home can constitute violation of secrecy, while non-compliant flight separately carries administrative liability under Article 118-1 of the Civil Aviation Act: **revocation of the operator licence, a fine of NT$300,000 to NT$1.5 million, and possible confiscation of the drone.**

## An AirTag judgment already wrote the doctrine; nobody has applied it to drones

This was the most surprising thing I found reading judgments.

New Taipei District Court's [judgment 113-Jian-3595](https://taiwanopendata.com/law/M157UQ27kY4jO743x42W0T5b0.html) concerned someone planting an Apple AirTag on another person's car to track their movements. The issue: a car driving on public roads — how is that "non-public activity"?

The court's reasoning is thorough:

> Although each individual movement of the vehicle is public in nature … using a satellite tracker to follow a vehicle's routes and stopping points continuously, around the clock, over many days allows exhaustive long-term knowledge of another's movements. Through such **dragnet surveillance**, mass collection and comparison of location data gives individual activities an internal coherence in aggregate, forcing a person's movements to disclose an unknown picture of their private life in a **point → line → plane** near-total manner … the body may formally remain alone, but **the psychological state of retaining privacy in solitude has been thoroughly destroyed.**

The core of that doctrine: **individually public facts, accumulated, become a non-public picture.**

And it is ready-made for drones. Photographing a street once is public; but a drone flying over the same neighbourhood at the same time each day, accumulating a comparable time series, falls within "dragnet surveillance" on this reasoning.

Notably, that is exactly the property [the inspection piece](/posts/product/2026-08-07-drone-inspection-taiwan-en) treated as a virtue — **repetition**. That piece concluded that "will it photograph the same thing a second time" determines whether an application can reach Layer 5. The same property, viewed from privacy, is the source of the risk: **what can grow a database can grow surveillance.**

The constitutional groundwork was laid long ago too. Per the [Legal Affairs Bureau report's](https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=6590&pid=192528) summary, **Interpretation No. 603** confirmed that privacy, though not enumerated in the Constitution, is protected under Article 22 as indispensable to human dignity and personal autonomy, dividing into "spatial privacy" and "intimate privacy"; **Interpretation No. 689** goes further — an individual **even in public space** enjoys, by ordinary social understanding, a sphere of private activity and informational autonomy free from persistent watching, monitoring, listening, or approach by others.

"Even in public space" is the most important phrase in the whole drone privacy question.

## The real bottleneck is evidence

Whether the provisions suffice isn't actually the biggest problem here. The report identified the real one:

> Given a multirotor's mobility and capability, **by the time the victim notices it (in reality, notices the operator), it may already have vanished** — let alone report it to the authorities and wait for a response.

That describes a structural asymmetry. The Wulai case reached indictment only through a chain of coincidences: another guest witnessed it, the hotel called police, officers **quickly traced which room the drone had flown from**, and the onboard recording still existed. Remove any one of those and there is no case.

From the resident's side, when a drone appears outside your window there is very little you can do: you don't know whose it is, where it took off, whether it's recording; you can't capture identifying footage in time; and by the time police arrive it is gone. **The law protects proven intrusions, and the hardest part of this kind of intrusion is exactly the proving.**

The bureau's recommendations at the time were all, in substance, attempts to close that gap:

- **Mandate transponders** reporting flight position and parameters continuously, with central and local authorities operating a tower-like mechanism, and the NCC setting a national transponder standard
- **Build a nationwide flight information app** so the public can check whether a drone is flying near their home
- Strengthen public education on where to report non-compliant flight

The second deserves attention, because the report also identified the current problem: although Article 31(3) of the management regulations requires operators of permitted activities to log flight information in the CAA's designated system before and after, "**that system is a controlled system that ordinary members of the public cannot enter** in order to learn about a multirotor flying near their home."

Put plainly: **flight information is logged; the people who can look it up don't include the people being flown over.**

That contrasts pointedly with the transparency in [the question bank piece](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en) — the same regulator published all 1,420 exam questions with answers, yet provides no interface for a member of the public to check what is flying above their home. **The transparency exists; it faces candidates, not neighbours.**

## What this piece doesn't cover

Marking the boundary honestly. Four other social-impact cells go untouched here:

- **Noise and NIMBY effects**: multirotor noise has a spectrum unlike ordinary ambient sound, and perceived intrusiveness doesn't track decibels linearly
- **Criminal misuse**: smuggling, prison deliveries, stalking and harassment
- **Autonomous weapons ethics**: this series' [counter-drone](/posts/tech/2026-08-07-counter-drone-why-hard-en) and [defense budget](/posts/investing/2026-08-06-drone-defense-budget-map-en) pieces both stepped around the ethical dispute over AI terminal guidance
- **Environmental and social costs of the industry's growth**

Of these, "criminal misuse" has public judgments available and is the same class of material as this piece; the other two need a different kind of evidence.

## Three judgments

1. **The drone chapter is not a privacy statute, and that is design rather than oversight.** Its protected interests are flight safety and national security, as the Legal Affairs Bureau wrote in 2020. Anyone seeking a privacy remedy starts at Article 315-1 and the data protection act, not the Civil Aviation Act — although non-compliant flight does carry parallel administrative liability under Article 118-1 (a NT$300,000–1.5 million fine and possible confiscation).
2. **Courts read "non-public activity" more broadly than most people assume.** An open window doesn't matter, not capturing the person doesn't matter; the test is whether an ordinary person would need a tool to see in. Conversely, for operators the practical implication is that **"I was only shooting scenery" is not a safe defense** — the Wulai indictment rested precisely on indirect intent.
3. **What's missing isn't provisions, it's accessible information.** Flight data is logged, but the system is controlled and the public cannot enter it; the transponder and lookup-app recommendations are six years old, and they are exactly what would turn "vanished without a trace" into "traceable to someone." **Until then, the practical threshold for this remedy is luck — whether there was a witness, whether a file survived.**

## References

**Legal analysis (primary)**

- [Legislative Yuan Legal Affairs Bureau — Examining Drone Regulation from the Perspective of Privacy](https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=6590&pid=192528) (in Chinese; the drone chapter's lack of privacy provisions, the scope of privacy under Interpretations 603 and 689, evidentiary difficulty, transponder and lookup-app recommendations, the inaccessibility of the Article 31 logging system)
- [Taipeilaw Attorneys — Filmed by a drone on the 25th floor](https://www.taipeilaw.com/zh_TW/posts/454) (in Chinese; criminal liability alongside Article 118-1 administrative liability)

**Judicial reasoning**

- [Taipei District Court, judgment 113-Yi-850](https://taiwanopendata.com/law/iG7g4177w38xlXQx76Vf9d1Y8.html) (in Chinese; the two-part test for non-public activity, the open-window and no-person-seen defenses both rejected)
- [New Taipei District Court, judgment 113-Jian-3595](https://taiwanopendata.com/law/M157UQ27kY4jO743x42W0T5b0.html) (in Chinese; the AirTag tracking case and the "dragnet surveillance" / "point → line → plane" doctrine, public movements aggregating into a non-public picture)
- [ETtoday — Semiconductor CEO's Wulai "night view" drone flight captures a bather at the window](https://www.ettoday.net/news/20220804/2309043.htm) (in Chinese; indictment for violation of secrecy, the finding of indirect intent, requested forfeiture of drone, controller, and batteries)

**On this site**

- [Taiwan's Drone Rules in Plain Language: What Needs Registering, What Needs a Licence, What Gets You Fined](/posts/policy/2026-08-06-taiwan-drone-regulation-guide-en)
- [The CAA Published the Entire Question Bank: What Four Exam Subjects Reveal About the Regulator](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [Inspection Is Taiwan's Furthest-Along Drone Application — Because It Routed Around BVLOS](/posts/product/2026-08-07-drone-inspection-taiwan-en)
- [Why Countering Drones Is Hard: Jamming Is Failing, and Taiwan's Problem Isn't Only Technical](/posts/tech/2026-08-07-counter-drone-why-hard-en)
- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
