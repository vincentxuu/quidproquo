---
title: "The CAA Published the Entire Question Bank: What Four Exam Subjects Reveal About the Regulator"
date: 2026-08-07
type: deep-dive
category: policy
tags: [drone, taiwan, regulation, uav, education]
lang: en
tldr: "In 2022 Taiwan's Ministry of Transportation issued a press release titled 'Drone Licensing Overhaul! Obscure Questions Removed, Question Banks Fully Published,' putting all 1,420 questions online — 388 general, 588 professional, 324 renewal, 120 simplified renewal. The stated reason was candid: candidates said it was too hard. And the published bank became a policy document in its own right — the meteorology subject imports the manned-aviation syllabus wholesale, and flight principles lean heavily on fixed-wing aerodynamics, while most candidates fly multirotors."
description: "Reading the CAA's published drone written-exam question bank as a policy text: the structure of the four subjects, the 2022 policy shift and its stated reasons, what the regulations actually specify (only the pass mark and the subjects, not the question count), and what download counts reveal about real demand."
draft: false
series:
  name: "Taiwan's Drone Industry, Taken Apart"
  order: 15
---

> 🌏 [中文版](/posts/policy/2026-08-07-caa-drone-exam-question-bank)

**Boundary first: I have not sat this exam, and this is not a study report.**

[The licence piece](/posts/policy/2026-08-06-taiwan-drone-license-guide-en) already unpacked the system — tiers, the no-skipping rule, fees, and timelines. This piece does something else: **it reads the question bank as a text.**

The reason is that Taiwan's civil aviation regulator published all 1,420 questions, with answers, on its own website. That is unusual transparency in the regulatory world, and since everything is public, **the distribution of questions amounts to the regulator announcing where it thinks beginners are most likely to get into trouble.**

## The 2022 policy shift

The bank was not fully public from the start.

The Ministry of Transportation and Communications' 15 July 2022 press release was titled ["Drone Licensing Overhaul! Obscure Questions Removed, Question Banks Fully Published"](https://www.motc.gov.tw/ch/app/data/view?id=14&module=news&serno=202207150005), and it was quite direct about why:

> Since the drone written test began, sample questions had been released in part … but because the released questions were not arranged in the chapter order of the "Drone Written Test Guide," and because candidates found some questions overly obscure, the CAA adopted candidate feedback and made adjustments.

Two problems: **the questions didn't line up with the guide**, and **they were too hard**. The fix was to publish everything.

Post-adjustment counts:

| Question bank | Questions |
|---|---|
| General licence | 388 |
| Professional licence | 588 |
| Professional licence renewal | 324 |
| Renewal (simplified) | 120 |
| **Total** | **1,420** |

The same adjustment did two more things. First, for agricultural and fishery operators specifically, it recalibrated renewal difficulty by **removing the more complex material on air traffic control, altitude and latitude/longitude arithmetic, and guidance-and-control theory** — worth noting because the basis for tiering is **operational risk profile**, not the licence holder's status. A crop sprayer doesn't need coordinate conversion because their work doesn't involve that risk. Second, English translations were prepared, and the site does carry *Drone Remote Pilot License Written Test (Examples)* and its renewal counterpart.

## The regulations specify only two things; the rest lives in AC 107-004B

Circulating guides disagree on question counts and pass marks — some say 20 questions in 30 minutes for the general licence, others 40 in 40 minutes; some say the pass mark is 80, others 70.

Going back to the source settles it. [Annex 9](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg027130/ch06/type1/gov50/num10/images/Eg01.pdf) of the Regulations Governing Remotely Piloted Aircraft, Table 2, specifies exactly two things about the written test:

> The maximum written test score is one hundred points, with a passing standard of eighty points. Test subjects are: (1) the Civil Aviation Act and related regulations; (2) basic flight principles; (3) meteorology; (4) emergency handling and flight decision-making.

**The pass mark is 80, and that is set in regulation** — so any source stating "70 to pass" contradicts Annex 9. As for **question counts and per-subject weighting, Annex 9 says nothing**; those live one level down, in the advisory circular [AC 107-004B, Drone Written Test Specification](https://www.caa.gov.tw/Article.aspx?a=3718&lang=1). That also explains why online claims about question counts contradict each other and are hard to adjudicate: the number isn't in the regulation, it moves with the circular, and different guides copied different vintages.

One more easily overlooked fact: **in Annex 9's Table 2, the written-test text for the general licence and the professional licence is identical.** Same four subjects, same pass mark. The difference is not what is tested but **the depth of the bank, the number of questions, and the fact that the professional licence additionally requires a practical test and a medical examination.**

## What the four subjects reveal

Now the content. The chapter structure of the test guide in AC 107-004B, Appendix 1:

```
Ch. 2  Civil Aviation Act and related regulations
Ch. 3  Basic flight principles      3.1–3.8
       └ fixed-wing / helicopter / multirotor, each with principles and control
Ch. 4  Meteorology                  4.1–4.16
Ch. 5  Emergency handling and flight decision-making
```

**The meteorology chapter is the one to stop at.** Its sixteen sections run: introduction, density altitude, measuring atmospheric pressure, wind effects, obstacle effects on wind, wind shear, atmospheric stability, temperature inversion, temperature and dew point, cloud systems, air masses, fronts, mountain flying, icing, the thunderstorm life cycle, aviation weather services.

This is the **aviation meteorology syllabus for manned aircraft pilots**, almost unchanged. Fronts, air masses, inversions, icing, thunderstorm life cycles — concepts whose scale is hundreds to thousands of metres of altitude and tens to hundreds of kilometres of width, while general licence holders may only fly in green zones, below 400 feet, between sunrise and sunset, within visual line of sight.

I don't think it's wrong (wind shear and obstacle turbulence genuinely kill small multirotors, and density altitude directly affects battery and motor output), but it reveals something: **the regulator is managing drones inside a manned-aviation frame.** That shows up beyond meteorology — [the BVLOS piece](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en) reached the same conclusion from the other side: Taiwan has no standalone BVLOS framework, and flying beyond visual line of sight requires juridical-person status plus advance application plus permission, which is essentially the manned-aviation case-by-case permit regime carried across.

**Flight principles leans the same way.** In the published general-licence bank, this chapter is dominated by Bernoulli's principle, the continuity equation, angle of attack and the critical angle, chord and wing area, parasitic drag (skin friction, form, and interference), induced drag, wave drag, tail surfaces, landing gear, and the design basis for propeller blade angles — **this is fixed-wing aerodynamics**. The guide does give fixed-wing, helicopter, and multirotor a section each, but the bank's centre of mass sits clearly on fixed-wing.

And the overwhelming majority of people taking the general licence fly multirotors.

## But one stretch is unexpectedly practical

Reading only the two sections above, it's easy to conclude the bank is detached from practice. That's incomplete.

The first two dozen or so questions in the flight principles chapter aren't aerodynamics at all — they're **system composition**. A sample:

- Which major subsystems does a drone system comprise?
- What hardware does the ground control station include?
- What does a complete flight control system consist of, and what functions does it enable?
- What are the two main types of navigation system? What are the drawbacks of non-autonomous (e.g. GPS) navigation? Of autonomous (inertial) navigation?
- Which system handles command, control, and data link work?
- What method have control links universally adopted for confidentiality and jamming resistance?
- What are the main data transmission modes for video downlink?
- As onboard sensor precision and mission complexity rise, which onboard processor requirement rises with them?

Lined up, that list is **flight control, navigation, links, video downlink, and onboard compute** — precisely Layer 3 of [the industry map](/posts/tech/2026-08-06-drone-industry-map-en), and precisely the lines [the spec sheet piece](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) identifies as most important and least printed.

**The system boundaries the regulator expects an operator to understand are the same set a supply chain analyst should be looking at.** I did not expect that.

(Corroborating: the Drone Cybersecurity Testing Specification, issued by the Ministry of Digital Affairs jointly with MOTC, defines a product "series" as units whose "flight control, communications, and satellite positioning chip modules are all identical" — regulation, licensing, and industry analysis all point at the same three modules.)

## What the download counts show

The CAA's question bank page also publishes each file's download count. PDF figures as retrieved in August 2026:

| Question bank | PDF downloads |
|---|---|
| Professional licence | 29,318 |
| General licence | 10,939 |

(docx and odt are counted separately, in similar proportion. These are live cumulative counters and keep moving.)

**The professional bank is downloaded roughly three times as often as the general one**, even though the general licence has a far lower bar — pass the written test and you're done, no practical exam, no medical.

That ratio is consistent with the industry structure found in [the supply chain piece](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en): roughly 80% of Taiwan's drone output value comes from public sector and defense procurement. **The professional licence is the ticket into that market** — per the ministry's explanation, only professional licence holders may operate above 400 feet in manned airspace and undertake beyond-visual-line-of-sight, night, and over-crowd operations that lift standard restrictions, subject to written, practical, and medical examination plus periodic renewal. Recreational flyers may be more numerous, but **the people serious enough to download the official PDF are mostly the people who need it for work.**

## Three judgments

1. **Publishing the whole bank deserves acknowledgment.** A regulator that responds to "this is too obscure" by putting 1,420 questions and their answers online, and writing the reason into the press release, is not common practice in Taiwanese regulation. Concede that before criticizing anything else.
2. **Exam content is a fossil of a mental model.** Meteorology imported wholesale from manned aviation, flight principles skewed to fixed-wing — this isn't oversight, it's a consistent expression of managing drones inside a manned-aviation frame, the same root as Taiwan's lack of a standalone BVLOS framework.
3. **The system composition stretch spans licensing and industry.** Flight control, navigation, links, video downlink, onboard compute — what candidates memorize, what buyers check, and what investors ask about are the same set of modules. That is one of the few places in this series where three lines converge.

## References

**Question bank and test specification (primary)**

- [CAA — Drone written test question banks](https://www.caa.gov.tw/Article.aspx?a=3833&lang=1) (five full banks plus English versions, with per-file download counts)
- [CAA — AC 107-004B, Drone Written Test Specification (2022-07-13)](https://www.caa.gov.tw/Article.aspx?a=3718&lang=1) (in Chinese; Appendix 1 test guide, Appendix 2 renewal test guide)
- [Regulations Governing Remotely Piloted Aircraft, Annex 9 — Executive Yuan Gazette](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg027130/ch06/type1/gov50/num10/images/Eg01.pdf) (in Chinese; Table 2: the 80-point pass mark and four test subjects)
- [CAA — Article 99-10, Registration and Licensing](https://www.caa.gov.tw/Article.aspx?a=2425&lang=1) (in Chinese; licence classes and test subject comparison table)

**Policy shift**

- [MOTC — Drone Licensing Overhaul! Obscure Questions Removed, Question Banks Fully Published (2022-07-15)](https://www.motc.gov.tw/ch/app/data/view?id=14&module=news&serno=202207150005) (in Chinese; four bank counts, reasons for removal, agricultural/fishery difficulty adjustment, test centre numbers)

**On this site**

- [Getting a Taiwanese Drone Licence: Tiers, the No-Skipping Rule, Fees, and Timeline](/posts/policy/2026-08-06-taiwan-drone-license-guide-en)
- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en)
- [BVLOS in Three Jurisdictions: Taiwan Has No Framework At All](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
