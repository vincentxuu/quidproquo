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

Warrants are products issued by brokerages that let you bet on a stock's direction using much less money than buying the stock outright. The concept is "small money, big bet" — if a stock costs NT$100,000 per lot, you might only need NT$3,000 to buy a call warrant on it. If the stock rises, your percentage return is much higher than if you'd bought the stock directly.

Sounds appealing, but there are three problems: **time value decays every day** (warrants have expiry dates, and their value shrinks naturally as expiry approaches), **poor liquidity** (when you want to sell, you might not be able to, or the price is far below what you expected), and the core frustration the post's author described — **even when you get the direction right, you can't meaningfully scale up your position when things are going well**.

That's why he switched to stock futures.

## What stock futures and the maintenance ratio are

Stock futures (股票期貨, abbreviated 股期) are futures contracts where the underlying asset is an individual stock. A futures contract is an agreement to buy or sell something at a fixed price at a future date — for Taiwan stock futures, one contract typically represents 2,000 shares.

The key difference from buying stock directly: you don't pay the full price. You put up a fraction of the value as "margin." For Taiwan stock futures, this is roughly 13% of the underlying stock's value. Compared to warrants, stock futures have no time decay, better liquidity, and let you go short.

**Maintenance ratio** is the risk management number at the heart of this: maintenance ratio = account equity ÷ margin required for open positions. If it falls below 100%, your broker demands you add money (a margin call). If you can't top it up, they close your positions by force.

The post's author kept a rule: **maintenance ratio must stay above 150% before market close**, raised higher on weak market days. In short: never open positions so large that a sudden drop leaves no room to react.

## What scaling positions means, and why he couldn't do it before

Scaling up means adding to a position; scaling down means reducing it; a stop-loss means accepting a loss and getting out. The logic sounds obvious: add when right, cut when wrong.

But he said he "couldn't do this at all" when trading warrants — because of time decay and liquidity constraints, once you're in, you're basically committed. You can't easily add or reduce, and the initial position size on small capital is too small to make adding more meaningful.

With stock futures, he could: start with a partial position, add once the direction confirmed, reduce first if wrong, then cut completely. Trading went from "place a bet and hope" to a flexible, adjustable process — and that's when consistent returns started showing up.

His final point was "futures aren't scary, understand them and you can use them well." I take that to mean: the risk isn't the product itself, it's using it without understanding the maintenance ratio or when to cut losses, and running your margin down to nothing. Understand how to control the ratio and scale positions, and futures are just a more flexible tool.
