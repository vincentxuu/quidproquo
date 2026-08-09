---
title: "The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild"
date: 2026-08-06
type: deep-dive
category: tech
tags: [drone, uav, supply-chain, taiwan, hardware, defense-tech]
lang: en
tldr: "The global drone market is roughly US$69B in 2026 (IDTechEx). China holds about 80% of it (CSIS) and DJI over 70% of multi-rotor. The FCC put every foreign-made drone on its Covered List in December 2025; Taiwan's drone output jumped from NT$5.0B to NT$12.9B in one year, and Q1 2026 exports already beat all of 2025. This piece breaks down the five-layer supply chain, the four demand blocks, and the two ceilings holding back scale."
description: "A full map of the drone industry: supply chain layers, why market-size estimates differ by 10x, the military / agriculture / logistics / inspection demand blocks, Chinese supply chain dominance and export controls, US NDAA and FCC policy leverage, the BVLOS regulatory bottleneck, and where Taiwan actually sits — strengths and gaps included."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-06-drone-industry-map)

The most counterintuitive thing about the drone industry is that it looks like consumer electronics but behaves like semiconductors — highly concentrated, with a handful of countries controlling the critical links, and geopolitics deciding who can buy which parts. Since September 2024, when China restricted exports of flight controllers, carbon frames, motors, and radio modules to both Ukraine and Russia, that has stopped being an analyst's framing and become a procurement manager's daily problem.

This article covers five things: what the industry actually sells, why market-size estimates differ by an order of magnitude, where demand comes from, what is blocking scale, and where Taiwan currently sits.

## The supply chain: five layers, unevenly valuable

A drone's bill of materials is not long. Take apart a commercial quadcopter and you get roughly five layers:

```
Layer 5  Data & services       Mapping software, inspection AI, DaaS operators
           ↑ highest margin, hardest to scale
Layer 4  Airframe integration  DJI / Skydio / Autel / Anduril / Taiwanese OEMs
           ↑ brand and certification decided here
Layer 3  Critical modules      Flight computer, comms link, EO/IR payload, battery pack
           ↑ the real bottleneck
Layer 2  Core components       Motors, ESCs, IMUs, GNSS modules, image sensors
           ↑ where China's grip is tightest
Layer 1  Materials & silicon   Carbon fiber, magnets, SoC / FPGA / RF chips, cells
```

Three structural facts:

First, **value concentrates in Layers 3 and 5**. Airframe assembly has a low barrier — which is exactly why Ukraine spawned hundreds of airframe manufacturers in wartime. What is genuinely hard to substitute is the flight controller silicon, jam-resistant comms modules, high-end EO/IR payloads, and the software that turns flight data into a usable conclusion.

Second, **Layers 1 and 2 are where China is deepest**. CSIS estimates China controls roughly 80% of the global drone market, and the weight of that number is in components, not airframes. [The CSIS analysis](https://www.csis.org/analysis/why-chinas-uav-supply-chain-restrictions-weaken-ukraines-negotiating-power) notes that the September 2024 export restrictions on Ukraine and Russia covered "flight controllers, carbon frames, motors, radio modules, and navigation cameras" — essentially the full Layer 1–2 list. That October, China cut off drone battery supply to [Skydio](https://www.skydio.com/) over its sales to Taiwan, forcing the largest US commercial drone maker to ration batteries into spring 2025. An American company bottlenecked by a battery cell did more to shift industry psychology than any market report.

Third, **Layer 4 concentration is abnormal**. [IMARC's industry analysis](https://www.imarcgroup.com/drones-market) puts DJI at over 70% of the global consumer and commercial multi-rotor market, with an even higher share in consumer. A single vendor holding that kind of position in a hardware category has almost no precedent in a mature industry.

## Market size: why the estimates differ by 10x

Google "drone market size" and you get a pile of contradictory numbers. Nobody is lying; the definitions differ:

| Firm | 2026 size | Outlook | Scope |
|---|---|---|---|
| [IDTechEx](https://www.idtechex.com/en/research-report/drones-market/1142) | US$69B | US$147.8B by 2036, 7.9% CAGR | Commercial + consumer, incl. sensing and autonomy |
| [Fortune Business Insights](https://www.fortunebusinessinsights.com/drone-market-116193) | US$100.74B | US$210.26B by 2034, 9.63% CAGR | Civil + military combined |
| [Drone Industry Insights](https://droneii.com/product/drone-market-report) | — | Civil drones 7.2% CAGR, 2026–2035 | Civil only |

The spread comes from three cuts: does military count, do services and software count, do consumer toys count. **Ask those three questions before accepting any drone market number**, or it isn't comparable to anything.

Capital flows track real momentum better. Per [Drone Industry Insights' 2026–2035 report](https://www.unmannedairspace.info/uncategorized/new-commercial-drone-market-forecasts-suggest-huge-potential-but-regulations-continue-to-hamper-growth) (via Unmanned Airspace):

> "Growth in funding has shifted dramatically. After dropping 52% in 2024, drone investment hit a record USD3.86 billion in 2025 — with 77% flowing to dual-use companies. And the first two months of 2026? Already USD1.7 billion invested…. But challenges remain. BVLOS regulation is still slow. Compliance costs are high. The recreational market is flat. Growth is being driven almost entirely by commercial and dual-use applications."

That paragraph is the whole state of the industry: the money is in dual-use, growth is bound by regulation, and consumer is no longer the story.

## Where demand comes from: four blocks at very different maturities

**Military / dual-use — the current engine.** The war in Ukraine turned small drones from auxiliary equipment into consumables. Ukraine produced roughly 4 million unmanned systems in 2025 and targets over 7 million in 2026; [the CFR analysis](https://www.cfr.org/articles/how-ukraines-drone-innovation-reversed-russias-momentum) puts the US at about 100,000 military drones per year for comparison. That is not a technology gap, it is an industrial-model gap — Ukraine builds drones like ammunition, the US still builds them like aircraft.

**Agriculture — the most mature, most boring, most profitable.** Valour Consultancy notes DJI alone reports a fleet of over 300,000 spray drones, with the Chinese market already saturated. Agricultural spraying is one of the few applications that needs no BVLOS, has clear per-aircraft daily output, and a payback period you can actually compute.

**Logistics — only cleared the bar in 2025.** [Zipline](https://www.flyzipline.com/) announced in January 2026 that it had passed 2 million commercial deliveries, alongside a $600M raise at a $7.6B valuation, and disclosed that US deliveries had grown roughly 15% week-over-week for seven straight months. Going from 1 million (April 2024) to 2 million took under two years. It is one of the few companies in the sector that can show a compounding curve.

**Inspection and surveying — steady demand, stuck on compliance.** Utility, oil and gas, rail, and construction inspection demand has existed for years. The pain point is not technology but the one-waiver-at-a-time approval model, which prevents repeated fixed-route work from scaling.

## Two ceilings

### Ceiling one: BVLOS regulation

Without beyond-visual-line-of-sight approval, the unit economics of delivery and long-range inspection never close — the labor you save gets eaten by "one visual observer per kilometer."

Part 108 in the US is the closest thing to a breakthrough so far. Per [Airdata's timeline](https://airdata.com/blog/2026/part-108): Executive Order 14307, signed June 6, 2025, directed the FAA to publish a final rule within 240 days of the NPRM, setting a February 1, 2026 deadline; a 43-day government shutdown pushed that to roughly March 16, 2026; on July 10, 2026 the rule reached OIRA for final review, and OIRA review of significant rules can run up to 90 days. As of July 2026 the final rule is still unpublished, with realistic publication in late 2026 or early 2027, followed by a 6–12 month transition period.

In other words: **the industry has been promising routine BVLOS for five years, and the moment the business models actually change has not arrived yet.**

### Ceiling two: supply chain and geopolitics

US policy leverage has now run a complete cycle, and it is worth seeing in full:

1. **December 23, 2024**: Section 1709 of the FY2025 NDAA takes effect, giving a US national security agency one year to complete a formal security audit of DJI and Autel. If no audit is completed, they are automatically added to the FCC Covered List.
2. **December 23, 2025**: The deadline passes with no federal agency having taken up the audit.
3. **December 22, 2025**: The FCC goes further than expected — instead of adding only DJI and Autel, it adds **all foreign-produced UAS and critical components** to the Covered List, blocking new equipment authorizations.
4. **January 7, 2026**: The FCC issues a Public Notice (DA 26-22) applying the brakes. Per [Holland & Knight's summary](https://www.hklaw.com/en/insights/publications/2026/01/fcc-exempts-certain-drones-from-covered-list), the Department of War determined two categories pose no unacceptable risk and exempted them through January 1, 2027: products on the Blue UAS Cleared List, and products meeting the Buy American "domestic end product" threshold (US-manufactured content exceeding 65% of total cost).
5. **May 8, 2026**: The FCC extends a waiver letting already-deployed Covered List devices keep receiving firmware and security updates through at least January 1, 2029 — avoiding hundreds of thousands of unpatchable devices in the field.

Note the asymmetry: **new authorizations blocked, installed base grandfathered**. For component makers in Taiwan, Japan, and Europe this is an unambiguous signal — the ticket into the US market has shifted from specs and price to certification and provenance.

China's side of the move is symmetric. On June 5, 2026 China's General Administration of Customs issued Announcements No. 77 and No. 78, [tightening export declaration requirements for machine tools and drone-related products effective June 30, 2026](https://www.bhfs.com/insight/china-tightens-export-declaration-criteria-for-machine-tools-and-drone-related-products), covering drones, key components, and counter-drone systems. Both sides are now using the supply chain as leverage.

## Counter-UAS: the symmetric other half

The direct consequence of cheap drones is that every airport, power plant, military base, and large gathering becomes a target for a low-cost threat. [MarketsandMarkets estimates](https://www.marketsandmarkets.com/Market-Reports/counter-cuas-systems-market-4197284.html) the C-UAS market at US$9.17B in 2026, growing to US$29.70B by 2031 at a 26.5% CAGR — roughly triple the growth rate of the drone market itself.

Technically, defending is harder than it looks. Classic soft kill relies on jamming GPS and the command link, and both paths are being routed around: fiber-optic drones trail a physical spool and are immune to electronic jamming — frontline researcher Rob Lee observes that [30–50% of FPVs in some Russian units are fiber-guided](https://euromaidanpress.com/2026/01/26/ukraine-aims-to-build-7-million-drones-in-2026-70-times-more-than-the-us/), against roughly 15% on the Ukrainian side. AI terminal guidance lets a drone finish its attack after losing the link entirely.

The result is a shift in emphasis from jamming to interception — using cheap interceptor drones against cheap attack drones. That is why C-UAS is now treated as its own industry rather than a drone accessory.

## Where Taiwan sits

Taiwan is one of the clearest beneficiaries of this reshuffle, and the growth is real rather than a base-effect artifact.

Per an Executive Yuan statement in March 2026, Taiwan's drone industry output [grew from NT$5.0 billion in 2024 to NT$12.9 billion in 2025](https://www.ey.gov.tw/Page/9277F759E41CCD91/0bc0abcb-fbf3-4c42-819f-3288f891207f), more than 2.5x; complete-airframe export value jumped from NT$140 million to NT$2.95 billion, a 21x increase. The Czech Republic, Poland, and the US account for over 90% of those exports. (in Chinese)

The 2026 slope is steeper. In a July 30 Executive Yuan cabinet report, the Ministry of Economic Affairs noted that [airframe exports reached US$115 million in January–March 2026, exceeding the US$93 million total for all of 2025](https://www.ey.gov.tw/PageRedirect.aspx?l=7c2b2995-19fe-4fad-8490-8d57900f7a78) — **one quarter beating the entire prior year**. (in Chinese)

The policy scaffolding is in place:

- **The Unmanned Vehicle Industry Development Program**: NT$44.2 billion from 2025 to 2030, targeting NT$40 billion in output by 2030 and positioning Taiwan as the Asia-Pacific hub of the non-Chinese drone supply chain.
- **Technology focus on "three chips, two software"**: the three chips are flight control, communications, and satellite positioning modules; the two software items are flight control and ground control. This is an honest selection — it maps exactly onto the Layer 3 bottleneck described above.
- **Demand-side pull**: public-sector procurement of over 100,000 aircraft is planned across the next three years (50,898 commercial-government units, 48,750 defense units). The Executive Yuan has also proposed a special statute for defense-autonomous unmanned vehicle procurement with an NT$210 billion special budget, still under legislative review.
- **Certification alignment**: Taiwan is the first country outside the US to receive Green UAS certification authorization, and Thunder Tiger's FPV line has obtained US DoD [Blue UAS](https://www.diu.mil/blue-uas) certification.

But look closely at the gaps. Per [CNA reporting in July 2026](https://www.cna.com.tw/news/afe/202607150278.aspx), the Ministry of Economic Affairs puts localization rates at roughly **70% for small drones, 60% for medium, and 30% for large**. Industry accounts are more specific: airframe manufacturing capacity has risen substantially, but flight controller silicon, long-range comms modules, and high-end EO/IR and radar payloads are still bought in. (in Chinese)

That maps precisely onto Layer 3. Taiwan's current strength is fast, flexible airframe and module manufacturing — capability spilling over from its semiconductor and ICT supply chains. Its weakness is high-end payloads and long-range links, which happen to be the hardest-to-substitute, highest-margin part of the stack. Whether the 267 firms in the sector (164 in the north, 57 in the center, 46 in the south) can climb from contract manufacturing into that layer is the real dividing line for the next five years.

## The bottom line

The state of the drone industry compresses into three sentences:

1. **The growth money is in dual-use, not consumer.** 77% of 2025 investment went to dual-use companies, and that ratio is not reversing soon.
2. **Supply chain restructuring is policy-driven, not market-driven.** Who gets to sell into the US now depends on certification and provenance, not just specs and price — a structural window for non-Chinese suppliers, but a window with an expiry date (the FCC exemptions currently run only to January 1, 2027).
3. **The real ceiling is BVLOS regulation, not technology.** Until Part 108 lands, scaling delivery and long-range inspection is a paper exercise; once it does, the unit economics of both get recomputed within a year.

If you want one question to judge any drone company: **is it in Layer 3 or Layer 4?** Layer 4 airframe assembly eventually gets competed down to commodity margins; the moat lives in Layer 3 — flight control, links, and payloads. Taiwan's policy bets its resources on "three chips, two software," which is the right target. Whether it gets built is a separate question.

## Further reading

This article is the overview for the drone series. Thirty-two companion pieces go deeper in six directions:

**Taiwan's supply chain**

- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) — the five-layer framework applied to Taiwan, using a manufacturer's published BOM split to confirm the gap sits at Layer 3

**Regulation**

- [Taiwan's Drone Rules in Plain Language](/posts/policy/2026-08-06-taiwan-drone-regulation-guide-en) — built from the currently effective statutory text, flagging which circulated rules are already outdated
- [Getting a Taiwanese Drone Licence: Tiers, the No-Skipping Rule, Fees, and Timeline](/posts/policy/2026-08-06-taiwan-drone-license-guide-en) — three licence classes, the G1/G2/G3 groups, statutory fees, full timeline
- [BVLOS in Three Jurisdictions: The US Hasn't Published, the EU Already Flies, Taiwan Has No Framework At All](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en) — this article's first ceiling, compared across three regimes
- [The Drone Chapter Has No Privacy Provision: If You're the One Being Flown Over, You Fall Back on the Criminal Code](/posts/policy/2026-08-07-drone-privacy-taiwan-en) — why the chapter omits privacy, what the Criminal Code reaches, how courts define it, and why evidence is the real bottleneck
- [Why Countering Drones Is Hard: Jamming Is Failing, and Taiwan's Problem Isn't Only Technical](/posts/tech/2026-08-07-counter-drone-why-hard-en) — detection blind spots, how fiber and autonomy bypass electronic warfare, and the authorization problem a Control Yuan report exposes

**Industry judgment**

- [Drone Industry Cycles: How the 2016 Bubble Burst, and What's Different This Time](/posts/tech/2026-08-06-drone-industry-cycle-history-en) — last cycle's wreckage, three structural differences and three identical warning signs
- [Four Drone Business Models, and Why Selling Airframes Is the Worst One](/posts/product/2026-08-06-drone-business-models-en) — margin, cash conversion, and what limits each model's scale
- [After "NT$2M a Year Flying Drones": Taiwan's Only Application With Computable ROI Has Already Run a Full Cycle](/posts/product/2026-08-07-agri-drone-unit-economics-en) — real rates and entry costs in ag spraying, and the structural causes of price collapse and the regulatory ceiling
- [Search and Rescue Drones: The One Application Whose ROI Isn't Money — and the Easiest Budget to Cut](/posts/product/2026-08-07-drone-sar-value-en) — agriculture's counterpart: terrain writes the specification, drones fill the gap helicopters can't reach, and the budget problem of being uncomputable
- [Inspection Is Taiwan's Furthest-Along Drone Application — Because It Routed Around BVLOS](/posts/product/2026-08-07-drone-inspection-taiwan-en) — quantified results from bridge, transmission tower, and rail viaduct inspection, and why segmented work routes around visual-line-of-sight rules
- [Taiwan Already Has 24 Drone Logistics Corridors — It Didn't Take the Wait-for-Regulation Route](/posts/product/2026-08-07-drone-logistics-taiwan-en) — six years of phased progress, and why case-by-case approval works for logistics but obstructs inspection

**People and careers**

- [The Drone Industry Job Map: Eleven Roles, and Which Ones a Software Person Can Actually Enter](/posts/career/2026-08-06-drone-industry-job-map-en) — job roles back inside the five-layer framework, tagged with software transferability
- [From Software into Drones: Use the PX4 Architecture Diagram as a Job Map](/posts/career/2026-08-06-software-to-drone-transition-en) — how much friction each of the three transition paths carries, and the order for proving capability with SITL and real logs
- [Four Ways to Learn Drones in Taiwan: Universities, Licences, Competitions, and Vocational Training](/posts/education/2026-08-06-taiwan-drone-education-paths-en) — the course system, competition design, and advice by situation
- [Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You](/posts/career/2026-08-06-drone-market-entry-mechanics-en) — alliance membership, R&D grants, certification order, and tender mechanics, plus what public data cannot answer

**Reading the public record yourself**

- [How to Read a Drone Spec Sheet: Which Lines Regulation Turned Into Boundaries](/posts/tech/2026-08-07-drone-spec-sheet-reading-en) — five weight thresholds, the three modules regulation uses to decide two drones are the same drone, and three public registries worth checking
- [The Anatomy of a Crash: Two TTSB Reports, and Neither Was the Operator's Fault](/posts/tech/2026-08-07-drone-crash-anatomy-en) — what the 25 kg statistical threshold means, the failure chains in both occurrences, and which PX4 log signals to read
- [The CAA Published the Entire Question Bank: What Four Exam Subjects Reveal About the Regulator](/posts/policy/2026-08-07-caa-drone-exam-question-bank-en) — the policy shift behind 1,420 published questions, and the regulatory mental model the content exposes
- [PX4 or ArduPilot: the EKF derivation lives in the other project's repo, and the real fork is the licence](/posts/tech/2026-08-08-px4-vs-ardupilot-en) — numbers from building both flight stacks once: licensing, extension point, board coverage, twelve months of contributor structure, and what an in-house flight controller actually means
- [Frequency Hopping Is Not Encryption: Reading the ExpressLRS Source, and Finding That Taiwan Turns Channel Count Into a Power Ceiling](/posts/tech/2026-08-08-drone-radio-link-en) — how the hop sequence derives from a binding phrase (with a reproducible cross-check), the real cost of trading rate for sensitivity, and how LP0002's 75-channel threshold sets legal power
- [The Video Link Has No Clause to Walk Through: Taiwan's 5.8 GHz Is Open Only to Frequency Hoppers, and Analogue FPV Doesn't Hop](/posts/tech/2026-08-08-fpv-video-link-taiwan-en) — matching the consumer FPV channel table against Taiwan's 125 MHz window channel by channel (only twenty-four of forty fit), and why analogue video gets through neither §4.10 nor §5.7
- [There Is No Swarm in a Drone Light Show: Two Hundred Aircraft Share One Integer, and Taiwan's Swarm Security Chapter Tests Nothing on the Aircraft](/posts/tech/2026-08-09-drone-swarm-light-show-en) — proving zero inter-drone coordination across 9,199 lines of Skybrush's open-source light-show firmware, then matching Chapter 7's twelve items to show why the "drone" column is a dash all the way down
- [Payload Price Is Not a Smooth Function of Performance: The Drone Thermal Camera Cost Step Sits at 111,000 Pixels and 2 mrad](/posts/tech/2026-08-09-drone-payload-cost-export-control-en) — the two export-control thresholds on thermal cameras matched against common sensor formats, FLIR Boson's four same-generation price pairs, and Taiwan's unit price solved from two fire-service programmes
- [The Public Evidence of a Production Ramp Isn't in the Factory — It's in the Failed-to-Award Notices](/posts/tech/2026-08-09-drone-production-ramp-procurement-en) — rebuilding the 88+88 fire-service programme county by county: uniform central pricing, six failed tenders, every award at exactly 100% of budget, and a correction to the previous post's unit prices
- [The Seven Seconds After GPS Jamming Starts: How a Flight Controller Notices, What It Decides, and Why Jamming Detection Is Off by Default](/posts/tech/2026-08-08-gps-jamming-flight-controller-en) — switching jamming on in a simulator and recording the full timeline, PX4's twelve GNSS gates, and why jamming detection ships off while spoofing detection ships on
- [Taking Apart Taiwan's Drone Cybersecurity Testing Specification: The Five Items That Actually Test Resilience Are All Optional](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en) — only three of seven mandatory items apply to the aircraft, communications security passes on disclosure rather than encryption, firmware security tests the update path, and Chapter 8's optional items are what a buyer should be asking about
- [Why Drones Only Fly for 30 to 45 Minutes: One Equation Gives the Answer, and the Cell Is Made in Taiwan](/posts/tech/2026-08-08-drone-endurance-physics-en) — from momentum theory: the 1.5-power law, the closed-form 2/3 optimum battery fraction, minutes traded per kilogram of payload, and the one BOM layer where Taiwan leads
- [From 40 Minutes to 6 Hours: The Endurance Ladder Is Not About Batteries but Configuration and Energy Source](/posts/tech/2026-08-08-drone-airframe-configurations-en) — why fixed-wing range is independent of speed, how a VTOL trades a quarter of its range for not needing a runway, how one large rotor doubles hover time, and Taiwan's domestic aircraft at every rung

**Frameworks and money**

- [The Drone Supply Chain Against a Four-Criteria Framework](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en) — one ruler applied to the sector, plus three concrete risk categories
- [Following Taiwan's Drone Defense Money: Three Budgets and a Bill Stuck for Two Months](/posts/investing/2026-08-06-drone-defense-budget-map-en) — grants, procurement, and annual budgets compared on nature and certainty
- ["What's the Actual Margin on a Defense Tender?" — The Filings Answered What I Assumed Needed an Interview](/posts/investing/2026-08-07-drone-maker-financials-en) — 38% gross margin but three straight quarters of operating loss, 385 days of inventory, capacity funded by equity, and the cost of a failed acceptance

Every post in the series carries the `drone` tag — browse them all at [#drone](/tags/drone).

## References

**Market and industry data**

- [IDTechEx — Drones Market 2026-2036: Technologies, Markets, and Opportunities](https://www.idtechex.com/en/research-report/drones-market/1142)
- [Fortune Business Insights — Drone Market Size, Share, Industry Report 2026-2034](https://www.fortunebusinessinsights.com/drone-market-116193)
- [Drone Industry Insights — Drone Market Report](https://droneii.com/product/drone-market-report)
- [Unmanned Airspace — New commercial drone market forecasts suggest huge potential but regulations continue to hamper growth](https://www.unmannedairspace.info/uncategorized/new-commercial-drone-market-forecasts-suggest-huge-potential-but-regulations-continue-to-hamper-growth)
- [IMARC Group — Drones Market Size, Growth & Industry Forecast to 2034](https://www.imarcgroup.com/drones-market)
- [MarketsandMarkets — Counter-UAS System (C-UAS) Market](https://www.marketsandmarkets.com/Market-Reports/counter-cuas-systems-market-4197284.html)

**Supply chain and geopolitics**

- [CSIS — Why China's UAV Supply Chain Restrictions Weaken Ukraine's Negotiating Power](https://www.csis.org/analysis/why-chinas-uav-supply-chain-restrictions-weaken-ukraines-negotiating-power)
- [Brownstein — China Tightens Export Declaration Criteria for Machine Tools and Drone-Related Products](https://www.bhfs.com/insight/china-tightens-export-declaration-criteria-for-machine-tools-and-drone-related-products)
- [Holland & Knight — FCC Exempts Certain Drones from Covered List](https://www.hklaw.com/en/insights/publications/2026/01/fcc-exempts-certain-drones-from-covered-list)
- [DRONELIFE — FCC Updates Covered List to Exempt Blue UAS and Qualified Domestic Products](https://dronelife.com/2026/01/07/cc-covered-list-blue-uas-buy-american-exemptions-2027/)
- [Council on Foreign Relations — How Ukraine's Drone Innovation Reversed Russia's Momentum](https://www.cfr.org/articles/how-ukraines-drone-innovation-reversed-russias-momentum)
- [Euromaidan Press — Ukraine aims to build 7 million drones in 2026](https://euromaidanpress.com/2026/01/26/ukraine-aims-to-build-7-million-drones-in-2026-70-times-more-than-the-us/)

**Regulation**

- [Airdata — FAA Part 108 Explained: Everything Drone Operators Need to Know in 2026](https://airdata.com/blog/2026/part-108)
- [FAA — Unmanned Aircraft Systems](https://www.faa.gov/uas)
- [DIU — Blue UAS](https://www.diu.mil/blue-uas)

**Taiwan** (sources in Chinese)

- [Executive Yuan — Drone budgets are critical to democratic supply chain strategy and military capability](https://www.ey.gov.tw/Page/9277F759E41CCD91/0bc0abcb-fbf3-4c42-819f-3288f891207f) (in Chinese)
- [Executive Yuan — Premier Cho: NT$44.2 billion from 2025–2030 to strengthen drone industry capacity and supply chain resilience](https://www.ey.gov.tw/PageRedirect.aspx?l=7c2b2995-19fe-4fad-8490-8d57900f7a78) (in Chinese)
- [CNA — Legislature reviews drone statute; MOEA urges support for the Executive Yuan version](https://www.cna.com.tw/news/afe/202607150278.aspx) (in Chinese)
- [CNA — Taiwan builds a democratic drone supply chain; AIDC and Thunder Tiger push for US certification](https://www.cna.com.tw/news/afe/202510190031.aspx) (in Chinese)
- [Asia UAV AI Innovation Application R&D Center](https://spacechiayi.tw/) (in Chinese)

**Companies**

- [Zipline](https://www.flyzipline.com/)
- [Skydio](https://www.skydio.com/)
- [DRONELIFE — Zipline Surpasses 2 Million Deliveries with Expansion to Houston and Phoenix](https://dronelife.com/2026/01/21/zipline-surpasses-2-million-deliveries-with-expansion-to-houston-and-phoenix/)
