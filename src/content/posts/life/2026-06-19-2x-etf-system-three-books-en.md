---
title: "I Saw This 2x ETF System on Threads — It Comes From 3 Books"
date: 2026-06-19
category: life
tags: [leveraged-etf, index-investing, asset-allocation, rebalancing, books]
lang: en
description: "A Threads post by @jj.investnote laid out a 2x leveraged ETF system built on three books: 60% 2x ETF + 40% cash, Beta=1.2 target, ±10% rebalancing trigger, and a crash protocol."
---

> 🌏 [中文版](/posts/life/2026-06-19-2x-etf-system-three-books)

I came across a post by [@jj.investnote](https://www.threads.com/@jj.investnote) on Threads describing a long-term leveraged ETF system.

His framing: "I don't predict the market. I don't try to call tops and bottoms. I don't chase hot stocks. I just designed a system that keeps running regardless of what the market does, then let time grow my assets."

The system wasn't invented from scratch — it was assembled from three books. Each one answers a different question: what to hold, how to accelerate, how to avoid being wiped out. Rebalancing ties all three answers into a mechanism that keeps running on its own.

---

## [*A Random Walk Down Wall Street*](https://en.wikipedia.org/wiki/A_Random_Walk_Down_Wall_Street) — Hold the Index, Because Stock Picking Is a Trap

Burton Malkiel's core argument: markets are efficient (the Efficient Market Hypothesis). At any given moment, stock prices already reflect all publicly available information. This doesn't mean markets are always rational — it means that whatever you can see, the market has already seen; whatever undervaluation you spot, so has your competition.

The conclusion is uncomfortable: **most active managers can't beat the index over the long run — not because they're incompetent, but because markets are smarter than any individual.**

The implication for investors: stop picking stocks, and instead hold a low-cost fund that tracks the entire market. In Taiwan's case, 0050 has delivered an annualized return of roughly 12.81% since inception in 2003 — through the 2008 financial crisis, the 2020 pandemic, and everything in between. Hold for 22 years, and the cumulative return exceeds 13x.

This book settles the question of *what* to hold. But it also settles the question of *when* to trade — the answer being: never try to time the market. If even professional stock pickers can't consistently outperform, there's no basis for believing you can identify the right moments to move in and out of a 2x leveraged position. The correct approach is to hold and let a mechanism do the work.

---

## [*The Leveraged ETF Investing Method*](https://www.books.com.tw/products/0010953374) — Understand How 正2 Actually Behaves

Lin Cheng-hua's book (《槓桿ETF投資法》) is the first dedicated analysis of 00631L published in Taiwan. Using over 170,000 words and hundreds of charts, it unpacks two core questions about leveraged ETFs: why they decay, and why that decay doesn't matter as much as critics claim.

### Volatility Decay Is Real

The most common criticism of leveraged ETFs is volatility decay — the daily reset mechanism means they bleed value in choppy, sideways markets, even if prices eventually return to the same level.

The math is concrete: start at 100, go up 10% then down 10%, and you land at 99 (a 1% loss). With 2x leverage: up 20% then down 20%, you land at 96 (a 4% loss). Same price path, four times the damage.

This isn't a scam. It's arithmetic.

### In a Trending Market, Compounding Overwhelms the Decay

Now flip the scenario: if the market keeps going up, up 10% then up 10% again, the unleveraged version reaches 121 (+21%). The 2x leveraged version reaches 144 (+44%) — more than double the gain, because compounding amplifies the uptrend.

Taiwan's market has been exactly this kind of trending market. From 00631L's launch in October 2014 through March 2026, its cumulative return reached **2,016%** — while the Taiwan 50 Index's total return over the same period was approximately **352%**. That's **5.7x**, not 2x.

### The Downside Is Real Too

The maximum historical drawdown for 00631L is around -83%, compared to roughly -50% for 0050. Annualized volatility runs near 43%. During the April 2025 tariff shock, 00631L fell from approximately 250 to 125 — a 50% drop in a matter of weeks.

This is why going all-in is a trap. The book recommends pairing 正2 with a low-volatility buffer. In this particular system, the implementation uses **60% 正2 + 40% cash**.

---

## [*The Psychology of Money*](https://en.wikipedia.org/wiki/The_Psychology_of_Money) — Stay Alive Long Enough to Compound

The most important idea in Morgan Housel's book isn't "how to earn more." It's "how to avoid being knocked out of the game."

### Room for Error Is About Survival

Housel argues: **smart planning isn't about being more precise — it's about deliberately building in room for error.**

In investing, this means: don't design a plan that only works if everything goes right. You don't know when the next crash will come, or what mental state you'll be in when it does. So don't bet on scenarios where the plan only works under favorable conditions.

Compounding requires longevity. The investors who went all-in on stocks in 2008 and sold at the bottom never got the recovery. With a potential -83% drawdown, holding 00631L at full position is psychologically nearly impossible for most people — not because they lack discipline, but because the plan itself is unreasonable.

### What the Buffer Actually Does

The 40% cash position isn't just there to "reduce risk" in the abstract. It serves two concrete functions: it keeps you from being forced to sell during a crash, and it gives you dry powder to buy more at the lows.

With a 60:40 allocation, if 正2 drops 50%, the total portfolio falls about 30% (0.6 × 50%). That still hurts — but compared to an -83% drawdown on a full position, the psychological gap is enormous. You still have 40% in cash; you know you won't be forced out.

In this system, the 40% cash is explicitly sized to cover **four years of living expenses**. That's not an arbitrary number — the point is that no matter what the market does, real life stays unaffected. Protect your life, and you protect your ability to hold.

---

## The Execution Mechanism: Rebalancing

The three books provide the philosophy. Rebalancing provides the execution — and it does more than just "reset the ratios."

### How Rebalancing Automatically Buys Low and Sells High

This system targets **Beta = 1.2** (60% × 2x leverage = 1.2), with ±10% as the rebalancing trigger:

- **Beta > 1.32 (+10%)**: 正2 has run up too much — system triggers, sell 正2, buy cash, restore 60:40
- **Beta < 1.08 (−10%)**: 正2 has dropped too much — system triggers, sell cash, buy 正2, restore 60:40

No market calls required. The mechanism does the buying and selling for you — driven by data, not intuition.

### Rebalancing Produces Returns That Exceed Expectations

Lin's back-test data illustrates this concretely: starting with 1 million NTD, going all-in on 0050 ended with a profit of roughly 570,000 NTD. Using 正2 paired with cash and executing three rebalances along the way ended with roughly 880,000 NTD — lower risk (with cash still in hand), higher return.

This is the **volatility harvesting** effect: the asset's volatility itself becomes a source of returns.

---

## The System's Core Assumption — and Its Limits

Every investment system rests on assumptions. This one rests on one: **Taiwan's stock market trends upward over the long run.**

If that assumption holds, volatility decay gets overwhelmed by trend compounding, and rebalancing keeps accumulating through the swings.

If it doesn't — if Taiwan experiences something like Japan's lost three decades after 1989, where the index was essentially flat for thirty years — then the volatility decay eats into principal indefinitely, and rebalancing can't rescue it.

The system's underlying belief is built on TSMC and the semiconductor supply chain's global moat, the connection between Taiwan's export-driven economy and global tech demand, and the inherent diversification of a 50-company index. But that's a reasoned bet, not a guarantee.

Acknowledging this limit isn't meant to undermine the system. It's about being clear on what the system requires to work — and knowing when to revisit it.

---

## The Original Poster's System in Detail

[@jj.investnote](https://www.threads.com/@jj.investnote) laid out the full execution details across three Threads posts.

**Allocation**: 60% 正2 + 40% cash, targeting Beta = 1.2, spread across three positions:
- **00631L**: highest trading volume, primary vehicle for rebalancing operations
- **00685L**: lowest expense ratio, suited for long-term holding
- **QLD**: US 2x leveraged ETF, diversifying exposure to the US market

**Ongoing rebalancing**: Beta ±10% triggers the rebalance automatically. The 40% cash sits in a high-yield savings account otherwise.

**Crash protocol**: When the broader market drops more than 20% from its peak, deploy additional cash to buy 正2 or Taiwan index futures. Sell when the market makes a new high again. These opportunities are rare — August 2024 and April 2025 are the recent examples — but having the cash ready to act is what makes the system feel like "happy when it goes up, even happier when it goes down."

**Starting point**: If leverage makes you nervous, read Lin's book first to build conviction, then start with 30% in 正2 to test how you handle the volatility. You need to be able to sleep soundly before you can talk about returns.

---

## Why These Three Books Form a System

Each book answers a different question:

| Question | Book | Answer |
|----------|------|--------|
| What to hold | *A Random Walk Down Wall Street* | Total market index ETF |
| How to accelerate | *The Leveraged ETF Investing Method* | 60% 正2 (00631L / 00685L / QLD) |
| How to avoid being wiped out | *The Psychology of Money* | 40% cash = four years of living expenses |
| How to execute | All three together | Beta ±10% trigger; automatic buy-low-sell-high |

Remove any one piece and the system breaks down: holding the index without leverage leaves returns mediocre; adding leverage without a risk buffer means one crash could end the game; without room for error, you'll be forced into the worst decision at the worst moment; without rebalancing, there's no automatic mechanism to buy low and sell high.

Together, the three books form an investment system that requires **no market prediction, no willpower, and no daily monitoring**.

---

## References

- [@jj.investnote — The 3 books behind the system (Threads)](https://www.threads.com/@jj.investnote/post/DZv9iK3mAU7)
- [@jj.investnote — 正2 + cash rebalancing plan explained (Threads)](https://www.threads.com/@jj.investnote/post/DYgBNXakhGP)
- [@jj.investnote — Crash protocol and real-world execution (Threads)](https://www.threads.com/@jj.investnote/post/DZlkZhPEkJq)
- [*A Random Walk Down Wall Street* — Burton Malkiel](https://en.wikipedia.org/wiki/A_Random_Walk_Down_Wall_Street)
- [*The Leveraged ETF Investing Method* (《槓桿ETF投資法》) — Lin Cheng-hua, books.com.tw](https://www.books.com.tw/products/0010953374)
- [Lin Cheng-hua's blog "淺談保險觀念" (Leveraged ETF Investing)](https://letf.com.tw)
- [*The Psychology of Money* — Morgan Housel](https://en.wikipedia.org/wiki/The_Psychology_of_Money)
- [00631L cumulative return 2,016% vs Taiwan 50 Index 352% (5.7x) since inception — Liberty Times](https://ec.ltn.com.tw/article/breakingnews/5408625)
