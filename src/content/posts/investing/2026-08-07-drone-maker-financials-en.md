---
title: "The Filings Answered What I Assumed Needed an Interview"
date: 2026-08-07
type: deep-dive
category: investing
tags: [drone, taiwan, uav, investing-framework, financials]
lang: en
tldr: "I had filed \"what's the real margin on military-grade-commercial tenders, and how long is the cash cycle\" under questions requiring interviews. The published filings answer both, more precisely: gross margin runs 35–39%, normal for hardware; but operating expenses consume it, and operating income has been negative for three straight quarters while reported net income came from non-operating items. The real constraint is inventory — roughly 385 days of it, producing a cash conversion cycle near 377 days. The money in this business isn't stuck in margin, it's stuck in inventory."
description: "Using public filings to unpack the economics of a Taiwanese drone manufacturer: gross margin, opex erosion, inventory days and cash conversion cycle, contract liability size, how capacity expansion is funded, and how these numbers explain the lethality of a failed tender acceptance. Contains no buy or sell judgment."
draft: false
---

> 🌏 [中文版](/posts/investing/2026-08-07-drone-maker-financials)

**Three boundaries first.**

One, **this is not stock picking.** This series' investing line was scoped from the start to frameworks and risk — no ticker lists, no buy or sell calls, no price levels. The company and figures below serve as a worked example of what this business looks like, not as a recommendation or a warning.

Two, **everything comes from public filings.** No inside information, no interviews, no rumors. Anyone can recompute it.

Three, **the sample is one company.** A single company's numbers can't represent an industry, but they can demonstrate a method — and the method transfers to any company you want to examine.

## I assumed this needed an interview

Writing [the market entry piece](/posts/career/2026-08-06-drone-market-entry-mechanics-en), I closed with six questions "public data cannot answer." The first two:

> What are **actual gross margins** on military-grade-commercial tenders? How far off commercial orders?
> What is the **real cycle** from submission to cash received? How heavy is the receivables burden?

And then I filed them under "needs an industry interview."

That was wrong. **Both are filing questions.** Taiwanese listed companies publish quarterly income statements, balance sheets, and cash flow statements. Gross margin computes directly; the cash cycle follows from receivables, inventory, and payables. I had misread "I don't have these numbers" as "these numbers aren't public."

More awkwardly: I had already used this method in [the business models piece](/posts/product/2026-08-06-drone-business-models-en) — comparing India's Garuda at 351 days of cash conversion against defense-focused peers at 597. **I knew the method. It just didn't occur to me to run it on a Taiwanese company.**

So here it is.

## Gross margin: normal, even decent

Take a listed company whose operations centre on drones, uncrewed surface vessels, and uncrewed ground vehicles, over four quarters (NT$ thousands):

| Quarter | 2025Q2 | 2025Q3 | 2025Q4 | 2026Q1 |
|---|---|---|---|---|
| Revenue | 419,235 | 324,974 | 344,596 | 375,050 |
| Gross profit | 164,148 | 112,913 | 123,496 | 143,311 |
| **Gross margin** | **39.2%** | **34.7%** | **35.8%** | **38.2%** |

35–39%. That's interesting because it lands squarely inside the band [the business models piece](/posts/product/2026-08-06-drone-business-models-en) established: **35–55% for hardware, 60–80% for software and DaaS.** Which is to say, a Taiwanese manufacturer's margin on defense-grade hardware is not fundamentally different from global hardware norms — **no imagined windfall, and no imagined sweatshop either**.

So far, the answer is "margin's fine."

## But operating expenses eat it

Add the operating expense line and the picture changes:

| Quarter | 2025Q2 | 2025Q3 | 2025Q4 | 2026Q1 |
|---|---|---|---|---|
| Gross profit | 164,148 | 112,913 | 123,496 | 143,311 |
| Operating expenses | 126,865 | 141,450 | 162,130 | 145,945 |
| **Operating income** | **+37,283** | **−28,537** | **−38,634** | **−2,634** |
| Net income | 66,847 | 4,366 | −29,781 | 50,721 |

**Operating income has been negative for three consecutive quarters.** And 2026Q1's positive net income of NT$50,721 thousand did not come from the core business — it came from non-operating items.

Breaking down opex shows why: 2026Q1 administrative expenses NT$85,028 thousand, R&D NT$44,581 thousand, selling NT$15,416 thousand. R&D is about 11.9% of revenue; administrative expenses are **22.7%**. For a company with under NT$400 million in quarterly revenue, that is a heavy fixed cost base.

This isn't necessarily bad — a company converting from model aircraft into an uncrewed systems integrator, while building production lines, running certifications, and bidding tenders, will reasonably carry elevated R&D and administrative costs. **The point isn't criticism, it's seeing the current shape clearly: the margin is healthy, but the scale doesn't yet carry the expense base.**

One media observation worth noting: coverage of this same quarter reported "consolidated revenue NT$375 million, gross profit NT$143 million, net income NT$52 million, EPS NT$0.34, a record for the comparable quarter." **Revenue, gross profit, and net income are all there. Operating income is not.** That line was negative.

Nobody falsified anything; this is standard financial-press practice. But the reader's takeaway is direct: **when you see "record profit," subtract operating expenses from gross profit yourself.**

## Where the money sits: inventory

Now the second question — the cash cycle.

The same company's balance sheet (NT$ hundred millions):

| Quarter | 2024Q4 | 2025Q2 | 2025Q4 | 2026Q1 |
|---|---|---|---|---|
| Accounts receivable | 1.17 | 1.64 | 1.50 | 1.61 |
| Receivables (related parties) | 0.19 | 0.29 | 0.18 | 0.28 |
| **Inventory** | **7.98** | **8.18** | **9.50** | **9.91** |
| Accounts payable | 1.25 | 1.13 | 0.95 | 1.38 |
| Contract liabilities (current) | 0.21 | 0.25 | 0.49 | 0.40 |

**Inventory is NT$991 million, 25.6% of total assets, and it has climbed steadily from NT$798 million over about a year.**

Working from 2026Q1 (COGS = revenue 375,050 − gross profit 143,311 = 231,739 thousand):

```
Days sales outstanding   ≈ (161 + 28) / 375 × 90 ≈  45 days
Days inventory           ≈  991       / 232 × 90 ≈ 385 days
Days payable outstanding ≈  138       / 232 × 90 ≈  54 days
────────────────────────────────────────────────────────────
Cash conversion cycle    ≈ 45 + 385 − 54          ≈ 377 days
```

**About 377 days.** From paying for materials to collecting from the customer, you fund more than a year.

Against the international figures in [the business models piece](/posts/product/2026-08-06-drone-business-models-en) — Garuda at 351 days on a DaaS-led model, defense-focused peers at 597 — 377 sits in between and behaves like the latter.

And days sales outstanding is only 45. **That matters: the problem is not slow-paying customers.** Public sector payment is actually not slow. The money is stuck in inventory.

As for why inventory runs so heavy, the tender structure explains itself: specifications are fixed by the solicitation, so you must buy materials, build, and submit for acceptance first, and **revenue recognition waits on acceptance passing**. Every cost in between is yours to carry.

## Small contract liabilities means nobody pays you up front

The last row above is contract liabilities — customer prepayments — at NT$39.5 million in 2026Q1, up 77.66% year over year. The growth rate looks good, but **the absolute figure is about a tenth of one quarter's revenue.**

What this line means matters more than its size: **customers in this business essentially do not prepay.** You don't receive money to buy materials with; you spend your own, build, submit for acceptance, and only then collect.

Put that alongside the Army counter-drone case from [the four-criteria piece](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en) and the lethality becomes clear: awarded at NT$987.81 million, specified to detect a 10 cm² target at 6 km and jam at 4 km; acceptance and two re-tests all failed; **the contract was terminated in full with no payment, and roughly NT$98.78 million in performance bond forfeited.**

Translated into the language of the filings: **you carried more than a year of inventory, the revenue matching that inventory is zero, and you additionally forfeit 10% of the award.** That isn't "earning less" — it's burning a year of working capital and then paying on top.

I originally wrote that a bidder "must be able to verify the specification themselves before bidding." That was common sense at the time. Seeing the cash cycle is what gave the sentence its weight.

## Where the expansion money comes from

Finally, the cash flow statement (NT$ thousands):

| Quarter | Operating | Investing | Financing |
|---|---|---|---|
| 2025Q1 | −54,028 | −32,665 | +529,967 |
| 2025Q2 | −12,955 | −51,923 | −131,912 |
| 2025Q3 | −48,716 | −73,217 | −156,791 |
| 2025Q4 | +62,298 | −143,824 | +55,802 |
| 2026Q1 | +46,119 | −674,415 | +711,866 |

2026Q1 shows NT$674 million out through investing and NT$712 million in through financing. Public disclosure matches: the company ran a 2026 cash capital increase, issuing 12 million new shares at NT$108, with proceeds including land, buildings, and line equipment for uncrewed systems capacity.

**Capacity, in other words, was built with shareholders' money, not with money the operations earned.**

That's the third structural feature, and it links to the first two: orders come from tenders, tenders require existing capacity and track record, and capacity has to be paid for first — **capital expenditure must run ahead of orders.** With operating cash flow negative in three quarters of 2025, that rhythm can only be funded by raising equity.

Which loops back to why [the defense budget piece](/posts/investing/2026-08-06-drone-defense-budget-map-en) insisted on distinguishing the three funding pools: for a company that must build capacity first, "grants" (funded but not orders) and "procurement" (orders, but not passed yet) mean entirely different things on a cash flow statement.

## A contrast case

That high gross margin doesn't equal profit is clearest against an extreme comparison.

Over the same period, an AI server contract manufacturer posted gross margins of 7.2–8.8% — apparently thin. But its operating expenses run only 1.5–1.7% of revenue, so its operating margin is **5.6–7.3%**, consistently positive.

The drone manufacturer here has gross margins of 35–39%, four to five times higher, and a negative operating margin.

The difference isn't what business they're in — it's **whether scale absorbs the expense base**. That was the more abstract part of [the business models piece](/posts/product/2026-08-06-drone-business-models-en) on conditions for scaling; two income statements side by side make it concrete: **gross margin sets your ceiling, expense structure determines where you currently stand.**

## What this method answers, and what it doesn't

**It answers**: roughly what the margin is, what the expense structure looks like, which stage the cash is stuck in, how long you carry it, where expansion money comes from, and how large the financial impact of a failed acceptance is. All of it in public documents, and all of it things I had assumed required asking someone.

**It doesn't answer**: what the non-operating items consist of (that needs the notes), the exact share of drones in total revenue (that needs segment and product-mix disclosure), how far tender margins diverge from commercial-order margins (filings don't disaggregate that far), and most importantly — **why this company chose this path.**

And the sample caveat again: **this is one company.** An established listed company in transition, a five-person startup, and a second-tier module maker may have entirely different economics. Talking about the industry would mean running this on every one of [the 267 companies](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en) with public filings — that's a different article.

What genuinely remains for interviews is small: motive, decision process, how relationships work, what happens when you're turned down. **Numbers can't answer "why," but "how much" doesn't require asking anyone.**

## Three judgments

1. **"What's the margin" was the wrong question.** A 35–39% gross margin is normal; what matters is that operating expenses consume it. For a hardware business, operating margin is far more informative than gross margin — and it's precisely the line financial coverage most often omits.
2. **The money is stuck in inventory, not receivables.** 45 days outstanding isn't slow; 385 days of inventory is the driver, and it follows directly from the tender structure of build first, submit for acceptance, recognize later. A failed acceptance is devastating because it turns a full year of carry into zero.
3. **Capital expenditure runs ahead of orders.** Capacity is built by raising equity because operating cash flow can't carry it, which makes policy rhythm — grants versus procurement versus annual budgets — not background context but cash flow scheduling.

## References

**Financial data (public)**

- [Market Observation Post System](https://mops.twse.com.tw/) (primary source for all Taiwanese listed company filings)
- [StatementDog — 8033 income statement](https://statementdog.com/analysis/8033/income-statement) (in Chinese; quarterly revenue, gross profit, selling/administrative/R&D expenses, operating expenses, pre-tax and net income)
- [StatementDog — 8033 contract liabilities growth](https://statementdog.com/analysis/8033/current-contract-liabilities-growth-rate) (in Chinese)
- [Goodinfo — 8033 quarterly balance sheet](https://goodinfo.tw/tw/StockFinDetail.asp?RPT_CAT=BS_M_QUAR&STOCK_ID=8033) (in Chinese; receivables, inventory, payables, contract liabilities and their share of total assets)
- [Thunder Tiger — investor presentations and financial reports](https://ttg.thundertiger.com/stock/) (in Chinese; consolidated balance sheet, company's own operational disclosure)
- [Economic Daily News — Thunder Tiger Q1 EPS NT$0.34](https://money.udn.com/money/amp/story/5710/9488857) (in Chinese; capital increase terms, tender values, expansion plans; also the coverage referenced above that omits operating income)
- [Wiwynn — investor relations, quarterly consolidated results](https://www.wiwynn.com/zh/investors) (the contrast case's gross margin and opex ratio)

**On this site**

- [Four Drone Business Models, and Why Selling Airframes Is the Worst One](/posts/product/2026-08-06-drone-business-models-en)
- [The Drone Supply Chain Against a Four-Criteria Framework: Only One of Four Holds](/posts/investing/2026-08-06-drone-supply-chain-four-criteria-en)
- [Following Taiwan's Drone Defense Money: Three Budgets and a Bill Stuck for Two Months](/posts/investing/2026-08-06-drone-defense-budget-map-en)
- [Four Gates into Taiwan's Drone Industry: The Entry Mechanics Public Records Can Tell You](/posts/career/2026-08-06-drone-market-entry-mechanics-en)
- [Taiwan's Drone Supply Chain: Where the 267 Companies Are, and Which Layer They're Stuck On](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers-en)
