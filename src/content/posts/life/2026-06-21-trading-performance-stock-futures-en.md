---
title: "Understanding a Trading Post from Scratch: Warrants, Stock Futures, and Maintenance Ratio Explained"
date: 2026-06-21
category: life
tags: [stock-futures, trading, warrants, portfolio-management, margin]
lang: en
tldr: "Saw a trading post about going from NT$150k to NT$2.4M in half a year. Didn't understand a word of it — warrants, stock futures, maintenance ratio — so I looked them all up."
description: "Starting from a post about a 16x return in six months, this explains what warrants, stock futures, maintenance margin ratio, and position scaling actually mean."
glossary:
  - term: "股期"
    aliases: ["股票期貨"]
    definition: "以個別股票為標的的期貨合約，可做多也可做空，保證金比股票低，槓桿比權證小且不會歸零。"
    definition_en: "Futures contracts based on individual stocks. Can be long or short; margin requirements are lower than stocks, with less leverage than warrants and no risk of going to zero."
    context: "本文從外行人角度解釋這個詞。"
    context_en: "This post explains this term from a non-trader's perspective."
  - term: "維持率"
    aliases: ["保證金維持率"]
    definition: "帳戶淨值除以未平倉部位所需保證金的比例。低於 100% 會被追繳保證金；實務上通常保持在 150% 以上當緩衝。"
    definition_en: "Account equity divided by the margin required for open positions. Falls below 100% triggers a margin call; in practice, keeping above 150% provides a safety buffer."
    context: "本文從外行人角度解釋這個詞。"
    context_en: "This post explains this term from a non-trader's perspective."
  - term: "權證"
    aliases: ["認購權證", "認售權證"]
    definition: "由券商發行的選擇權型商品，可以用低成本押注股票方向，但有時間值損耗，且流動性通常較差。"
    definition_en: "Option-like instruments issued by brokerages, allowing low-cost directional bets on stocks, but with time decay and typically poor liquidity."
    context: "本文從外行人角度解釋這個詞。"
    context_en: "This post explains this term from a non-trader's perspective."
---

> 🌏 [中文版](/posts/life/2026-06-21-trading-performance-stock-futures)

I recently came across a post where someone said they went from NT$150,000 to NT$2,400,000 in six months of trading.

My first reaction wasn't envy — it was that I had no idea what they were talking about.

Warrants, stock futures, maintenance ratio, scaling positions — each term vaguely rang a bell, but how any of it added up to a 16x return was beyond me. So I went and looked it all up. Here's what I found, for anyone else who was equally lost.

## What warrants are, and why he switched away from them

In Taiwan's stock market, shares are traded in units called "lots" (張). One lot equals 1,000 shares. Many popular stocks cost tens of thousands — sometimes over NT$100,000 — for a single lot, which puts them out of reach for small investors.

Warrants exist to solve this problem. Issued by brokerages, they let you bet on whether a stock will rise or fall using just a few hundred to a few thousand NT dollars. If you bet correctly, your percentage return is far higher than if you'd bought the stock outright.

Appealing, but there are three real problems:

- **Time value decays every day**: Warrants have expiry dates. Even if the stock you're betting on doesn't move, the warrant itself loses value as expiry approaches.
- **Buying and selling is awkward**: When you want to exit, you might not find a buyer, or the price you get is far below what you expected. This is what "poor liquidity" means — not enough people in the market willing to trade with you at a fair price.
- **Being right doesn't mean profiting much**: This was the post author's core frustration. Even when he called the direction correctly, the amount he could invest upfront was so small that the actual profit was tiny relative to the time and effort involved.

That's why he switched to stock futures.

## What stock futures and the maintenance ratio are

Stock futures (股票期貨) are futures contracts where the underlying asset is an individual stock.

A futures contract is an agreement to buy or sell something at a fixed price at a future date. For Taiwan stock futures, one contract represents 2,000 shares. The key difference from buying shares directly: you don't pay the full price up front. You put up a fraction of the value as "margin," and that lets you hold the contract. For Taiwan stock futures, the margin is roughly 13% of the underlying stock's value — meaning NT$130,000 in margin controls a NT$1,000,000 stock position. (A "position" is just how many contracts you currently hold.)

Compared to warrants, stock futures have no time decay, better liquidity, and the ability to "go short" — meaning if you think a stock will fall, you can enter a trade that profits from that decline.

---

**Maintenance ratio** is the most important number in futures trading.

Maintenance ratio = Account equity ÷ Margin required for your current positions

Example: your account has NT$200,000, and your open contracts require NT$100,000 in margin. Your maintenance ratio is 200%.

If this ratio drops below 100%, your broker will demand you add money immediately — this is called a "margin call." If you can't top it up in time, the broker will forcibly close your contracts regardless of whether you're up or down. This is called "forced liquidation," and it means you lose all control at the worst possible moment.

So the higher your maintenance ratio, the larger your safety buffer. The post author's rule: keep it above 150% before market close, and raise that threshold even higher on days when the broader market looks weak — by closing some contracts and reducing exposure. The goal is always to have room left to breathe.

## What position scaling means, and why he couldn't do it before

"Scaling up" means adding to your position. "Scaling down" means reducing it. A "stop-loss" means accepting the loss and closing everything out.

The logic sounds obvious: add when you're right, cut when you're wrong.

But the post author said he "couldn't do this at all" when trading warrants. Time decay meant every day of waiting cost him money, so he couldn't hold calmly and wait for the market to confirm a direction before adding more. Poor liquidity made entering and exiting clunky. The whole setup wasn't built for flexible, incremental adjustment.

With stock futures, he could: start with a small position, add more once the market confirmed his view, scale down if wrong, and stop out completely if necessary. Trading went from "place a bet and hope" to "adjust based on what the market is telling you" — and that's where consistent performance came from.

His final point was "futures aren't scary — understand them and you can use them well." After going through all this, I get it: the risk isn't the instrument itself. It's operating without understanding the maintenance ratio, without a stop-loss plan, running your margin down to zero. Manage the ratio, manage your position size, and futures are just a more flexible tool.
