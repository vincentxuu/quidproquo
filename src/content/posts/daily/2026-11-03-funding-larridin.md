---
title: "融資速報｜Larridin Series A $30M（幫企業稽核 AI 支出有沒有用，Pelion Ventures 領投）"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, funding, daily, larridin, agent-observability]
lang: zh-TW
description: "企業 AI 支出稽核平台 Larridin 完成 $30M Series A，由 Pelion Ventures 領投，把「花在 AI 上的錢有沒有用」變成可以量化的指標"
tldr: "Larridin 完成 $30M Series A，由 Pelion Ventures 領投，a16z、Gradient Ventures 等跟投,累計融資 $47M。這筆錢的信號：當企業把 AI 從「小額雜支」燒成「前五大支出項目」,市場終於需要一個第三方稽核層,告訴老闆這些錢花在人跟 Agent 身上到底值不值。"
series:
  name: "AI Agent Funding"
  order: 120
---

> 🌏 [English version](/posts/daily/2026-11-03-funding-larridin-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Larridin（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $30M |
| 領投 | Pelion Ventures |
| 跟投 | Andreessen Horowitz, Gradient Ventures, GFT Ventures, W23, Thayer Investment Partners, DG Daiwa Ventures, Alumni Ventures, Cougar Capital |
| 估值 | 未揭露 |
| 累計融資 | $47M（種子輪 $17M + Series A $30M） |
| 成立年份 | 2024 |
| 員工數 | 20 人，Series A 後計畫倍增至約 40 人 |

## 這家公司做什麼

Larridin 是做企業 AI 支出稽核與生產力量測的公司——當公司把錢砸進一堆 AI 工具跟模型,Larridin 要回答的問題是「這些錢到底花得值不值」。

核心產品是一個量測平台,整合企業內部系統,分析員工跟各種 AI 工具的互動(包括他們下的 prompt),判斷誰用 AI 用得有效、誰需要更多訓練、省下多少時間。共同創辦人兼 CTO Ameya Kanitkar 特別強調平台只分析互動、不儲存內容,改用產生分數跟高層級洞察的方式保護員工隱私。

客戶成長速度是這輪募資的關鍵論據：從去年 12 月只有 1 家企業客戶,成長到現在 50 家,CEO Russell Fradin 說業務是從今年第二季、企業開始正視 AI 成本之後才真正加速。

## 這筆融資的信號

### 對 Agent 生態的意義

2026 年企業的 AI 支出行為經歷了一次明顯轉向：年初是「tokenmaxxing」當道，企業鼓勵員工盡量燒 token、把 AI 用量當績效指標(Duolingo 甚至把 AI 使用列入考核,Uber CTO 還公開說過 Claude Code 預算提前燒完);年中開始出現「modelmaxxing」,企業改成把 prompt 動態路由到不同模型省錢,也更多改用中國實驗室的開源模型。Larridin 瞄準的正是這個轉向之後的空缺——當省錢跟衡量 ROI 變成顯學,企業需要一個不屬於任何模型供應商的第三方稽核層。

### 投資人在賭什麼

領投的 Pelion Ventures 合夥人 Jeff Kearl 出身消費品牌(Skullcandy、Stance 創辦人/CEO),不是典型的企業軟體背景,這次下注的邏輯更像「每當一個新類別燒進大錢,就會有人做第三方稽核平台」——Fradin 本人正是從媒體廣告稽核公司 Comscore 出來創業,把 Larridin 類比成 AI 時代的 Comscore、Nielsen、Datadog。a16z 合夥人 Alex Rampell 則提出「AI boss」的說法：企業需要有人(或有系統)告訴員工在 AI 上該做什麼、不該做什麼,而不是放任每個人各自用 AI 卻沒人知道效果。

### 值得觀察的數字

- 企業客戶數 11 個月內從 1 家成長到 50 家,是這輪估值說服力的主要依據
- 種子輪 $17M 到 Series A $30M,漲幅約 1.76 倍,屬於穩健擴張而非狂熱追價
- 20 人團隊服務 50 家企業客戶,人力槓桿偏高,是 Series A 後計畫把團隊倍增到 40 人的主要理由
- 現有 AI 成本管理市場已分裂成三塊：基礎設施端(CloudZero、Vantage 管 GPU/雲端算力)、API 端(LangSmith、Helicone 管 token 用量),而 Larridin 卡在更上層的「企業內 AI 使用生產力稽核」,目前沒有直接同類對手

## Watchlist 狀態

Larridin 尚未在 watchlist 中。建議加入 section B6(Agent 可觀測性 / 評估),但需註記：現有 B6 名單(Arize、Braintrust、Langfuse、AgentOps 等)都是面向工程師的開發 / 除錯可觀測性,Larridin 的受眾是企業管理層跟 HR,量的是「人跟 Agent 的 AI 使用生產力」而不是模型輸出品質,是同一個 ring 下的不同子類,未來若這類公司變多可考慮獨立拆出。

## 今日收穫

Larridin 的成長曲線剛好對上企業 AI 支出心態的轉折點——不是「AI 太貴所以要稽核」,而是「先狂買、才想到要稽核」跟上一波雲端支出的劇本完全一樣。真正值錢的不是稽核工具本身,而是它卡在企業終於願意付錢的那個時間點：Q2 之前這類需求幾乎不存在,Q2 之後業務量直接起飛,說明這類基礎設施型公司的募資時機往往比產品本身更關鍵。

## 參考資料

- [AI Bills Are Piling up. This Startup Raised $30 Million to Help.](https://www.businessinsider.com/larridin-ai-spending-measurement-series-a-30-million-2026-11)
- [Russell Fradin：Larridin 完成 $30M Series A 公告](https://www.linkedin.com/posts/rfradin_larridin-raises-30-million-in-series-a-to-activity-7523072767014002688-rN7c)
- [Larridin raises $30M to audit corporate America's ballooning AI bills](https://dealroom.co/news/168892-larridin-raises-30m-to-audit-corporate-americas-ballooning-ai-bills)
