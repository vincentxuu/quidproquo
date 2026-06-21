---
title: "看到有人半年從 15 萬做到 240 萬，我去查了他說的那些詞"
date: 2026-06-21
category: life
tags: [stock-futures, trading, warrants, portfolio-management, margin]
lang: zh-TW
tldr: "看到一篇交易紀錄貼文，裡面全是我不懂的詞：權證、股期、維持率。查了一圈，整理給同樣看不懂的人。"
description: "從一篇半年 16 倍報酬的貼文出發，解釋權證、股票期貨、維持率、加減碼是什麼意思。"
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

> 🌏 [English version](/posts/life/2026-06-21-trading-performance-stock-futures-en)

最近看到一篇貼文，有人說他年初操盤 15 萬，半年後變成 240 萬。

我的第一反應不是羨慕，是完全看不懂他說的那些詞。

權證、股期、維持率、加減碼——每個詞單獨拆開好像有點印象，但他怎麼用這些東西做到 16 倍，我一點概念都沒有。於是去查了一圈，整理出來給同樣看不懂的人。

## 權證是什麼，他為什麼換掉它

權證是券商發行的商品，讓你用比較少的錢去押某支股票會漲或會跌。概念類似「用小錢下大注」——假設某股票一張要 10 萬，你可能只要 3,000 元就能買到對應的認購權證，如果股票漲了，獲利比例比直接買股票高很多。

聽起來不錯，但有三個問題：**時間值每天在消耗**（有到期日，越接近到期價值自然縮水）、**流動性差**（想賣的時候賣不掉，或賣出價遠低於預期）、還有他說的核心困境——**就算判斷方向對了，也沒辦法在對的時候把資金真正放大**。

所以他後來轉到股期。

## 股期和維持率是什麼

股期是股票期貨的簡稱。期貨是一種合約：你和對方約定在未來某個時間，以現在談好的價格買賣某支股票，一口合約通常對應 2,000 股。

跟直接買股票的差別是，你不需要付全額，只要付一部分「保證金」就能持有部位，台股股期大概是標的市值的 13% 左右。跟權證比，它沒有時間值損耗、流動性更好、也可以做空。

**維持率**就是這裡的風控關鍵：維持率 = 帳戶淨值 ÷ 持有部位所需保證金。掉到 100% 以下，券商會追繳保證金，補不進去就強制平倉。所以維持率越高，緩衝越大。

貼文作者的規則是收盤前至少維持 150% 以上，大盤不好時拉更高——本質上就是不要把倉開太滿，永遠留空間應對突發下跌。

## 加減碼是什麼，為什麼換了商品才做得到

加碼是加大部位，減碼是縮小，停損是認賠出場。這套邏輯說起來很基本：看對就加，看錯就減。

但他說以前用權證時「完全做不到」——因為權證有時間值和流動性限制，進場就是押一個方向，沒辦法靈活追加或縮減，而且初始部位小，就算對了也很難在中間繼續放大。

換成股期之後，他可以：先進一部分，方向確認後再加，看錯了先減再停損。操作從「押一把」變成「有彈性的流程」，績效才開始穩定出來。

最後他說「期貨不可怕，只要懂它就能好好利用」——我理解是：期貨的風險不是產品本身，是不懂維持率、不懂停損、把保證金開到快見底的用法。懂得控制維持率、懂得加減碼，它就只是一個更靈活的工具。
