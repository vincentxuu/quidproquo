---
title: "Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You"
date: 2026-08-06
type: deep-dive
category: career
tags: [drone, taiwan, startup, uav, procurement]
lang: en
tldr: "TEDIBOA has grown from 50 founding members to over 260, but since 1 July 2025 you must first be a full member of the Defense Industry Development Association before you can even apply. R&D grants under the Industrial Innovation Platform cap out at 50% of total project cost, three concurrent cases per company, three years maximum — and explicitly ban red-supply-chain components while requiring joint cybersecurity lab testing. This piece covers only what public documents can actually establish."
description: "Four gates into Taiwan's drone industry, reconstructed from public documents: the industry alliance's membership prerequisite, the rules and limits on R&D grants, the fixed order of Green and Blue UAS certification, and how government tenders are bid and accepted — plus an explicit list of the questions public data cannot answer."
draft: false
---

> 🌏 [中文版](/posts/career/2026-08-06-drone-market-entry-mechanics)

**A boundary statement first.**

When I set out to write about starting a company or taking contract work in this sector, I assumed it was unwritable without interviews. It turned out to split in two. **The mechanics are heavily documented** — alliance membership rules, grant application notices, procurement records, public reporting on acceptance disputes. **The lived experience is not** — actual margins, hidden costs, how the first order really landed, how much relationships matter.

This piece covers only the first half. **Anything I could only write with "roughly" or "reportedly" is left out.** The last section lists what public data cannot answer.

## Gate one: the association comes before the alliance

Overseas opportunities for Taiwanese drone firms flow mainly through the **Taiwan Excellence Drone International Business Opportunity Alliance (TEDIBOA)** — established in September 2024 under the Ministry of Economic Affairs, with the chairman of Aerospace Industrial Development Corporation elected alliance chair.

[Per CNA's January 2026 report](https://www.cna.com.tw/news/afe/202601220198.aspx), membership grew from 50 founding companies to **over 260** in a little over a year, with alliance agreements signed across **7 countries and 11 drone organizations**. Alliance chair Tsao Chin-ping's framing is blunt: the alliance represents the industry side, handles international negotiation, and pursues government-to-government (G2G) orders.

But the entry rule changed in 2025. [TEDIBOA's own announcement page](https://www.tediboa.com.tw/Announcement) states it plainly:

> Effective 1 July 2025, applicants to TEDIBOA must be full members of the Defense Industry Development Association in order to qualify for TEDIBOA application and review. Drone-related business opportunity information will henceforth be published through the association's platforms.

The same announcement gives the reason: **the alliance has never charged members any fee and runs on limited resources**, so information distribution and membership administration were consolidated onto the association's platform.

**What this means in practice**: to receive the alliance's opportunity notices and trade show slots, the order is "join the Defense Industry Development Association → then apply to TEDIBOA," not the other way around. This gate is administrative rather than technical, but miss it and the information never reaches you.

The alliance does one other thing useful to newcomers: it maintains a **catalogue** of firms that have completed capability assessment, spanning full-aircraft assembly, module manufacturing, and component manufacturing. If you want to know which cell of the supply chain you occupy and who sits upstream and downstream, that's the public starting point.

## Gate two: what the R&D grant rules actually say

The Ministry of Economic Affairs' **Industrial Innovation Platform program** is the main channel for drone R&D grants — [the Industrial Development Administration says 31 cases passed between 2024 and 2025](https://www.cio.com.tw/113483), covering full aircraft, flight guidance and control, communications, payloads, and AI autonomous recognition.

The [application notice](https://eii.nat.gov.tw/tiip/FilesSummernote/News/files/%E8%BB%8D%E6%B0%91%E9%80%9A%E7%94%A8%E7%84%A1%E4%BA%BA%E6%A9%9F%E8%83%BD%E9%87%8F%E7%B1%8C%E5%BB%BA%E8%A8%88%E7%95%AB_%E7%94%B3%E8%AB%8B%E9%A0%88%E7%9F%A5.pdf) is specific. The conditions that materially affect planning:

| Item | Rule |
|---|---|
| Grant share | **No more than 50% of total project cost** |
| Concurrent cases | **No more than 3** per company or per representative at one time |
| Duration | **3 years maximum** |
| Eligible subject | Only **undeveloped** R&D projects; already-developed or in-production technology does not qualify |
| Scope per case | In principle, **one development target per case** |
| Budget scale | Should be commensurate with the company's R&D spending over the past 3 years, or proportionate to revenue |

**Only seven expense categories may be budgeted**: personnel costs for innovation or R&D staff, consumable equipment and raw materials, equipment usage and maintenance fees, intangible asset acquisition, commissioned research or verification, travel, and patent application. **Note that "equipment usage and maintenance" is not "buying equipment"** — that distinction matters a great deal for cash flow planning.

Two further conditions are the program's explicitly political ones:

- **Building a non-red supply chain**: developed aircraft and key modules are **prohibited from using red-supply-chain components**; full aircraft and any module with a cybersecurity dimension must additionally pass testing at the **Drone Cybersecurity Joint Verification Laboratory**
- **Priority funding** goes to drone requirements raised at the Ministry of National Defense's "industrialization roundtable"

That last point is the important one: **grant priority is defined by defense demand, not market demand.** Whether your topic lands on that requirements list directly affects your odds.

One easily missed provision: if a company's net worth is negative at application but it has already completed a capital increase and its interim financials have turned positive, attaching a capital verification report and post-increase audited financials can be treated as meeting eligibility.

## Gate three: the certification order is fixed

[The supply chain piece](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) argued certification is the only moat in this industry that actually holds. For a newcomer, what matters is the **order**:

```
Cybersecurity testing (body recognized by the Ministry of Digital Affairs)
      ↓
Green UAS (commercial grade, AUVSI)
      ↓
Blue UAS Cleared (military grade, DCMA)
```

[AUVSI states that as of 16 July 2025, DIU recognizes Green UAS as an authorized pathway to Blue UAS Cleared](https://www.auvsi.org/certification-training/green-uas) — so Green is not "a different certification," it is Blue's prerequisite.

TEDIBOA made this its primary goal for 2026 with two strategies: **building an authorization channel** (bringing the US certification mechanism into Taiwan) and **guidance rather than subsidy**. The reasoning behind the second is worth noting — per CNA's reporting, guidance is preferred over subsidy specifically to avoid the US finding dumping or unfair competition and imposing sanctions. **That is a design favorable to applicants that is routinely misread as "the government isn't paying."**

On local testing: after ITRI became an AUVSI Recognized Assessor for cybersecurity testing, it said verification timelines could be **cut by more than half**. But remember [the verified boundary from that piece](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) — what ITRI obtained covers the cybersecurity testing segment; supply chain traceability review authority remains in the US.

## Gate four: tender mechanics and tender risk

Roughly 80% of the domestic market is public procurement, so tendering capability is close to operating capability. Three things public records can tell you:

**One: specifications are proven by test, not by paperwork.**
[The four-criteria piece](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en) covered the Army's 26 fixed counter-drone systems in detail: awarded at NT$987.81 million, specified to detect a 10 cm² target at 6 km and jam at 4 km. Acceptance testing and two re-tests all failed. The contract was **terminated in full with no payment made, and roughly NT$98.78 million in performance bond forfeited** (10% of the award), with late-delivery penalties assessed separately up to 20% and the vendor suspended and blacklisted.

For a newcomer the lesson is: **you must be able to verify the specification yourself before bidding, not wait for the military to test it.** That cost belongs in the bid/no-bid decision.

**Two: award design may be deliberately distributed.**
The [National Police Agency's procurement of 50 counter-drone systems for critical infrastructure](https://www.upmedia.mg/tw/investigation/military/263412) (NT$3.67 billion total budget) grades bidders A, B, or C by the functional scope that passed verification testing, taking the top three in each grade with proportional delivery — **up to 9 vendors can win**. NCSIST serves as project manager but may not bid.

For large firms that compresses revenue upside. **For newcomers it is an opening** — the graded structure means you don't have to beat everyone, only place top three within one functional grade.

**Three: budget rhythm is not yours to control.**
[The defense budget piece](/posts/investing/2026-08-06-drone-defense-budget-map-en) unpacked the nature of the three funding pools. The practical implication for founders: **the NT$44.2 billion coordination program is grant money (funded but not orders), the NT$210 billion special statute is procurement (orders, but not passed yet), and annual agency budgets are the most fragmented but the most certain.** Cash flow planning should be built on the third and treat the first two as upside.

## What public data cannot answer

This is where the public record stops. I have no answers to the following, and I list them because **knowing what you don't know beats pretending you do**:

- What are **actual gross margins** on military-grade-commercial tenders? How far off commercial orders?
- What is the **real cycle** from submission to cash received? How heavy is the receivables burden?
- When a small or mid-sized firm wins its first tender, what usually does it — technology, price, or an existing relationship?
- What is the **actual acceptance rate** for Industrial Innovation Platform grants? Those 31 approvals were selected from how many applications?
- What does joining the Defense Industry Development Association and TEDIBOA **actually cost** in fees, time, and headcount?
- For a Taiwanese manufacturer, how different are the returns between contract manufacturing for a foreign brand and building an own brand through TEDIBOA?

These need someone inside the industry. If you're in it and willing to talk, I'm interested — that would be the one piece in this series with first-hand material.

## Three judgments

1. **The first gate is administrative, not technical.** Joining the association before the alliance is not hard, but skip it and the opportunity notices never arrive. Settle the membership question before anything else.
2. **Grant priority is defined by defense demand.** The Industrial Innovation Platform explicitly prioritizes items raised at the Ministry of National Defense's industrialization roundtable — pick a topic off that list and the road gets considerably harder.
3. **Bidding capability includes self-verification capability.** An NT$988 million contract ultimately booked at zero, and the difference was whether the specification could be confirmed achievable before bidding. That is the internal capability newcomers should build first.

## References

**Industry alliance**

- [Taiwan Excellence Drone International Business Opportunity Alliance (TEDIBOA)](https://www.tediboa.com.tw/) (in Chinese)
- [TEDIBOA — Announcements (membership eligibility change)](https://www.tediboa.com.tw/Announcement) (in Chinese)
- [TEDIBOA — About the alliance](https://www.tediboa.com.tw/About) (in Chinese)
- [CNA — Taiwan drone alliance passes 260 members, targets US certification this year](https://www.cna.com.tw/news/afe/202601220198.aspx) (in Chinese; membership growth, international alliances, certification strategy)

**R&D grants**

- [Ministry of Economic Affairs — Application notice, dual-use drone capability building program](https://eii.nat.gov.tw/tiip/FilesSummernote/News/files/%E8%BB%8D%E6%B0%91%E9%80%9A%E7%94%A8%E7%84%A1%E4%BA%BA%E6%A9%9F%E8%83%BD%E9%87%8F%E7%B1%8C%E5%BB%BA%E8%A8%88%E7%95%AB_%E7%94%B3%E8%AB%8B%E9%A0%88%E7%9F%A5.pdf) (in Chinese; grant share, case limits, expense categories, non-red supply chain requirement)
- [CIO Taiwan — From AI recognition to edge computing, Taiwan's drone supply chain accelerates internationally](https://www.cio.com.tw/113483) (in Chinese; 31 approved cases)

**Certification**

- [AUVSI — Green UAS](https://www.auvsi.org/certification-training/green-uas) (Green as the authorized pathway to Blue)
- [AUVSI — ITRI joins the Green UAS program as a Recognized Cybersecurity Assessor](https://www.auvsi.org/news/auvsi-and-taiwans-itri-sign-agreement-in-washington-dc-as-itri-joins-green-uas-program-as-recognized-cybersecurity-assessor)

**Tenders**

- [Liberty Times Defense — Army terminates counter-drone system contract with vendor](https://def.ltn.com.tw/article/breakingnews/5525072) (in Chinese)
- [UP Media — 50 counter-drone systems for critical infrastructure, NPA tender opened 24 July](https://www.upmedia.mg/tw/investigation/military/263412) (in Chinese)

**On this site**

- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
- [The Drone Supply Chain Against a Four-Criteria Framework: Only One of Four Holds](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en)
- [Following Taiwan's Drone Defense Money: Three Budgets and a Bill Stuck for Two Months](/posts/investing/2026-08-06-drone-defense-budget-map-en)
