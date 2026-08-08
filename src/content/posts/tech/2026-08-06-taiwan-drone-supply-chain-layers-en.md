---
title: "Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On"
date: 2026-08-06
type: deep-dive
category: tech
tags: [drone, taiwan, supply-chain, uav, hardware, defense-tech]
lang: en
tldr: "Of the 267 companies the Ministry of Economic Affairs counted, 164 are in northern Taiwan. But geography is not division of labor — Thunder Tiger's published bill of materials shows motors, batteries, frames, and propellers sourced locally, while flight control, comms/GPS, and camera modules go to US, European, and Japanese partners. Exports were only 23% of 2025's NT$12.9B output, and 88.1% of export value sits in the 2–7 kg weight band per Ministry of Finance statistics."
description: "Breaking Taiwan's 267 drone companies down by supply chain layer: county-level distribution, the 70/60/30 percent localization gap by airframe size, the real gap revealed by Thunder Tiger's published BOM, an industry sustained 80 percent by domestic procurement, and what Green UAS and Blue UAS certification actually covers."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)

"Taiwan has 267 drone companies" has been quoted endlessly over the past six months. Very few people ask the follow-up: what are those 267 companies actually doing?

This piece fills in the gap I deliberately left in [the drone industry map](/posts/tech/2026-08-06-drone-industry-map-en). That article broke the global supply chain into five layers and argued the value concentrates in Layer 3 — flight control, comms links, and EO/IR payloads. This one puts Taiwan into the same framework to see which cell it actually occupies.

## Where the 267 companies are

The Ministry of Economic Affairs published a county-level breakdown on June 24, 2026 ([MOEA Facebook](https://www.facebook.com/moea.gov.tw/posts/1457377933100578)):

| Region | Count | By county |
|---|---|---|
| North | 164 | New Taipei 52, Taipei 43, Taoyuan 33, Hsinchu City 21, Hsinchu County 11, Yilan 3, Keelung 1 |
| Central | 57 | Taichung 40, Changhua 8, Nantou 6, Miaoli 3 |
| South | 45 | Tainan 25, Kaohsiung 15, Chiayi County 5 |
| East | 1 | Hualien 1 |

([CNA's report](https://www.cna.com.tw/news/afe/202607150278.aspx) on the MOEA's written statement gives "164 north, 57 central, 46 south," folding the east into the south. Same total.) (in Chinese)

Two observations:

**The north holds 61%, concentrated in New Taipei, Taipei, Taoyuan, and Hsinchu.** That axis is Taiwan's ICT and semiconductor corridor. It tells you the industry's talent and technology did not grow out of aerospace — it spilled over from electronics. That determines what Taiwan is good at and what it isn't.

**Taichung's 40 dominate the center.** Taichung is a precision machinery and model-toy cluster; Thunder Tiger has been building radio-controlled model aircraft there since 1979. It is one of the few places in Taiwan with a genuine manufacturing tradition in things that fly.

**Chiayi has only 5.** This deserves a pause. The government's flagship cluster, the Asia UAV AI Innovation Application R&D Center, sits in Puzi, Chiayi County, and [its first building has attracted 52 industry, government, and academic tenants](https://www.ey.gov.tw/PageRedirect.aspx?l=7c2b2995-19fe-4fad-8490-8d57900f7a78). But "tenant at an R&D center" and "company registered locally" are different things. The center is a test and validation site, not a manufacturing base; the actual production lines are still in the north and center. **Treating it as the industry's center of gravity is a misreading.** (in Chinese)

## Geography is not division of labor

The biggest problem with "267" is that it flattens everyone onto one plane. A carbon-fiber frame shop and a flight control software team both count as one, but their positions and substitutability differ by an order of magnitude.

Applying the five-layer framework from the map article, Taiwan distributes roughly like this:

```
Layer 5  Data & services     A few startups, all small
Layer 4  Airframe integration AIDC (fixed-wing / defense bids), Thunder Tiger
                             (rotary + FPV), NCSIST, GEOSAT   ← few firms, most visible
Layer 3  Critical modules     Flight computer, comms link, EO/IR payload  ← the gap
Layer 2  Core components      Motors, ESCs, frames, propellers, battery packs ← strongest
Layer 1  Materials & silicon  Carbon fiber, MCUs, RF chips
```

The SEF cross-strait trade portal compiled a [Taiwan drone ecosystem role table](https://www.seftb.org/cp-4-2750-634d3-1.html) splitting firms into system integrators (AIDC), brand developers (Thunder Tiger), agile startups (Aeroeye), group vertical integration (Csimtec), specialist components (BizLink), and corporate VC (Qisda, via investments in Chin-Rang and Sunlight Aerospace). More informative than "267," but it still doesn't tell you where the gap is. (in Chinese)

## An actual bill of materials

The most convincing evidence comes from Thunder Tiger itself. In [an interview](https://www.cio.com.tw/107121), general manager Su Sheng-chieh disclosed which parts of the Blue UAS–certified Overkill FPV drone are sourced in Taiwan and which are not: (in Chinese)

> Battery modules, controllers, motors and ESC modules, engine power modules, propellers, and frames are all supplied and manufactured by domestic Taiwanese firms. As for the comms/GPS module, flight control module, and camera module — although Taiwanese suppliers are capable of providing them, considering quality and reliability, Thunder Tiger chose to work with major US, European, and Japanese vendors, with production still in Taiwan.

Map that onto the layer diagram and the line is startlingly clean:

| Sourced in Taiwan | Layer |
|---|---|
| Battery modules, controllers, motors + ESCs, power modules, propellers, frames | **Layer 2** (core components) |

| Sourced from US / EU / Japan partners | Layer |
|---|---|
| Comms and GPS module, flight control module, camera module | **Layer 3** (critical modules) |

**That is Taiwan's real coordinate.** A company that cleared Blue UAS certification — the only one in Asia to do so — is fully self-sufficient at Layer 2 and still buys in at Layer 3. Note the phrasing: "Taiwanese suppliers are capable of providing them, but considering quality and reliability." That is not "cannot build it," it is "what we build isn't good enough yet." The distinction matters: the first is a technology gap, the second is a maturity gap, and maturity gaps close with time and order volume.

The government's "three chips, two software" program — flight control, comms, and satellite positioning chip modules, plus flight control and ground control software — targets exactly this cell. The target selection is right.

## Localization rate: 70%, 60%, 30%

Based on its inventory of militarized-commercial prototypes, the MOEA puts localization at [roughly 70% for small drones, 60% for medium, and 30% for large](https://www.cna.com.tw/news/afe/202607150278.aspx). (in Chinese)

The declining curve is itself the answer. Bigger airframes mean more complex missions, which mean long-range comms links, high-end EO/IR or radar payloads, and higher flight-control reliability — all Layer 3. A small drone can be assembled from Layer 2 components plus a simple flight controller. A large one cannot.

**So "70% localized" has to be paired with "which size."** Using the small-drone figure to describe the whole industry badly overstates autonomy.

## The number that deserves the most attention: exports are only 20%

This is the figure most easily lost in the growth narrative.

Taiwan's 2025 drone output was NT$12.9 billion, of which complete-airframe exports were NT$2.95 billion — **22.9%**. The remaining ~80% is domestic public-sector and Ministry of National Defense procurement. [PeoPo's citizen journalism series](https://www.peopo.org/news/851559) names the structure directly: (in Chinese)

> Officials themselves acknowledge that the industry currently runs on a "domestic demand carries the load" model. Which means the "export miracle" widely read into the numbers is in fact only a small piece of total industry output; what actually keeps domestic production lines running is policy-allocated defense budget.

This doesn't make the growth fake. NT$2.95B against NT$140M is 21x, and Q1 2026 airframe exports of US$115 million already beat all of 2025's US$93 million. The slope is real. But **"Taiwanese drones have broken into international markets" and "Taiwan's drone industry lives off international markets" are different claims**, and only the first currently holds.

The implication for judgment: budget continuity matters more to near-term survival than international orders. The defense special statute is still in the legislature, and [the Armaments Bureau has planned procurement of nearly 50,000 airframes worth NT$50 billion](https://www.cio.com.tw/107121) — when those land determines the stability of 80% of industry output. (in Chinese)

## Reverse-engineering what Taiwan actually sells

The most direct evidence comes from [the Ministry of Finance's statistical bulletin](https://service.mof.gov.tw/public/Data/statistic/bulletin/114/2025_22_UAV.PDF), which breaks 2025 January–October drone exports down **by takeoff weight**:

| Takeoff weight | Share of export value |
|---|---|
| **2–7 kg** | **88.1%** |
| 15–25 kg | 9.2% |
| Under 250 g | 1.3% |
| Over 25 kg | 1.1% |

**Nearly 90% of export value sits in the 2–7 kg band.** That is the weight class of battlefield-consumable FPVs and small reconnaissance aircraft — what Taiwan exports in volume is low-cost, consumable small airframes, not high-value medium or large systems.

The same bulletin gives destinations more precisely than "top three at 90%": for January–October 2025, **Poland 39.3%, Czechia 32.7%, the US 15.9%, Austria 4.7%, Germany 3.4%** — the top two alone exceed 70%, both in Eastern Europe, which is where consumable demand points.

Average unit price is computable too. The PeoPo report notes 2025 export unit volume grew 35x to 123,000 airframes ([TechNews](https://technews.tw/2026/03/18/taiwanese-drone-export-takes-off/) cites the same figure); divide that into NT$2.95 billion of export value:

```
NT$2.95B ÷ 123,000 units ≈ NT$24,000 per unit (about US$760)
```

(My own calculation from two public figures, not an official unit price. But the MOF bulletin's US$54.8 million of January–October exports divided by same-period volume lands in the same order of magnitude, so the two corroborate.)

No judgment implied. Ukraine proved consumables are the main body of modern drone warfare. But if the target is NT$40 billion of output by 2030, getting there at NT$24,000 per unit requires 1.66 million airframes. The arithmetic doesn't work. **There is a gap between the output target and the unit-price structure, and the only way to close it is to climb to Layer 3.**

## Certification is the new moat — but check its boundaries

Taiwan's certification progress over the past year is real, though media descriptions run consistently broader than the actual scope. Two things to separate:

**Green UAS.** ITRI signed with AUVSI in January 2026, and [Taiwanese media generally rendered this as "the first Green UAS assessment body outside the US"](https://money.udn.com/money/amp/story/5612/9546215). But [AUVSI's own press release](https://www.auvsi.org/news/auvsi-and-taiwans-itri-sign-agreement-in-washington-dc-as-itri-joins-green-uas-program-as-recognized-cybersecurity-assessor) is more precise: (first link in Chinese)

> ITRI will join AUVSI's Green UAS program as a Recognized Assessor **focused on cybersecurity testing**, expanding in-country support for penetration testing and technical cyber evaluation.

The subheading is more direct still: **"AUVSI retains U.S.-based supply chain verification authority."**

So what ITRI holds is authorization for the **cybersecurity and penetration testing** segment, not full Green UAS certifying authority. That still has value — ITRI says it can cut assessment time by more than half, and over 10 companies have already registered — but what it shortens is the process, not the bar.

**Blue UAS.** Thunder Tiger's Overkill FPV cleared Blue UAS certification on September 21, 2025, the first from Taiwan and [still the only one in Asia](https://www.cio.com.tw/107121). Roughly 35–40 platforms worldwide are on that list. (in Chinese)

Put differently: **Taiwan's entire drone industry currently holds one seat on the US military's procurement allowlist.** 267 companies, NT$44.2 billion committed, 21x export growth — all true. "One seat" is also true. Both belong in the same frame.

(Green UAS and Blue UAS are a ladder: [AUVSI states that as of July 16, 2025, DIU recognizes Green UAS certification as an authorized pathway to Blue UAS Cleared status](https://www.auvsi.org/certification-training/green-uas). So the practical meaning of ITRI's in-country cybersecurity channel is that Taiwanese firms no longer need to fly to the US for the first rung.)

## International scale

One comparison, to keep growth rates from being read as scale.

The PeoPo report cites Turkey's Baykar at roughly US$2.2 billion in 2025 exports (about NT$70 billion) — **a single company's exports exceeding the NT$40 billion total output target the Taiwanese government set for its entire industry by 2030**. Ukraine's annual drone procurement budget over the same period ran about US$18.5 billion.

Taiwan's position: very low base, very fast growth, strong policy support, certification just beginning. This is an early-stage transitional industry with a geopolitical opening — not a mature strategic asset. Bringing semiconductor-scale expectations to it leads to disappointment.

## The bottom line

Three judgments:

1. **Taiwan is strong at Layer 2 and short at Layer 3, and the industry says so itself.** Thunder Tiger's BOM split is the most honest self-assessment available: capable, but choosing not to use its own. That is a maturity gap rather than a technology break — closable, but it needs time and order volume.
2. **The industry runs on domestic demand; 80% of output is public-sector and defense procurement.** Judging near-term survival means watching budget continuity, not export growth rates.
3. **Certification seats track real progress better than output does.** NT$44.2 billion and 267 companies sound large, but Taiwan holds one seat on the US allowlist. The next metric worth tracking is not output — it is when the second seat appears.

If I could follow only one number, it would be **exports as a share of total output**. Rising from 23% means Taiwan is genuinely holding ground internationally. Flat or falling means the industry is still living on budget.

## References

**Official and policy** (sources in Chinese)

- [Ministry of Finance statistical bulletin — drone exports, January–October 2025](https://service.mof.gov.tw/public/Data/statistic/bulletin/114/2025_22_UAV.PDF) (export structure by takeoff weight and destination)
- [Executive Yuan — Taiwan drone industry status and progress](https://www.ey.gov.tw/Page/448DE008087A1971/e687d387-4bb4-4cd7-9b7d-cbeb83970623)
- [Executive Yuan — Drone budgets are critical to democratic supply chain strategy and military capability](https://www.ey.gov.tw/Page/9277F759E41CCD91/0bc0abcb-fbf3-4c42-819f-3288f891207f)
- [Executive Yuan — Premier Cho: NT$44.2 billion from 2025–2030 to strengthen drone industry capacity and supply chain resilience](https://www.ey.gov.tw/PageRedirect.aspx?l=7c2b2995-19fe-4fad-8490-8d57900f7a78)
- [MOEA — Drone companies across Taiwan (county-level counts, 2026-06-24)](https://www.facebook.com/moea.gov.tw/posts/1457377933100578)
- [CNA — Legislature reviews drone statute; MOEA urges support for the Executive Yuan version (localization rates, regional distribution)](https://www.cna.com.tw/news/afe/202607150278.aspx)
- [CNA — Taiwan builds a democratic drone supply chain; AIDC and Thunder Tiger push for US certification](https://www.cna.com.tw/news/afe/202510190031.aspx)

**Industry structure and critical reporting** (sources in Chinese)

- [TechNews — Taiwan drone exports surge 35x](https://technews.tw/2026/03/18/taiwanese-drone-export-takes-off/) (export unit volume)
- [PeoPo — At the crossroads of the non-red supply chain: Taiwan's drone industry, part one](https://www.peopo.org/news/851559)
- [SEF Cross-Strait Trade — Global drone industry trends and Taiwan's positioning](https://www.seftb.org/cp-4-2750-634d3-1.html)
- [CIO Taiwan — From AI recognition to edge computing: Taiwan's drone supply chain goes international](https://www.cio.com.tw/113483)

**Certification**

- [CIO Taiwan — Thunder Tiger obtains Blue UAS certification (includes the in-house vs. sourced BOM breakdown)](https://www.cio.com.tw/107121) (in Chinese)
- [AUVSI — AUVSI and Taiwan's ITRI Sign Agreement as ITRI Joins Green UAS Program as Recognized Cybersecurity Assessor](https://www.auvsi.org/news/auvsi-and-taiwans-itri-sign-agreement-in-washington-dc-as-itri-joins-green-uas-program-as-recognized-cybersecurity-assessor)
- [AUVSI — Green UAS](https://www.auvsi.org/certification-training/green-uas)
- [Economic Daily News — ITRI becomes the first Green UAS assessment body outside the US](https://money.udn.com/money/amp/story/5612/9546215) (in Chinese)
- [ITRI — Partnering with AUVSI on Green UAS recognized assessment](https://www.itri.org.tw/ListStyle.aspx?DisplayStyle=01_content&SiteID=1&MmmID=1036276263153520257&MGID=115060416135089097) (in Chinese)

**On this site**

- [The Drone Industry Map: Components, Regulatory Ceilings, and the Non-Chinese Supply Chain Rebuild](/posts/tech/2026-08-06-drone-industry-map-en)
