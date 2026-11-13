---
title: "融資速報｜Bay Series A $37M（總募資 $50M，Battery Ventures 領投）"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, funding, daily, bay, agent-security]
lang: zh-TW
description: "特拉維夫 AI agent 安全公司 Bay 從隱身模式現身，合併公布 $37M Series A 與先前未揭露的 $13M 種子輪，總募資 $50M，由 Battery Ventures 領投，主打 5 分鐘部署、毫秒級決策的 agent 行為控管"
tldr: "Bay 合併公布 $37M Series A（Battery Ventures 領投）與先前未揭露的 $13M 種子輪，總募資 $50M，成立不到一年、35 人團隊，客戶包括 Micron、Peloton、ClickUp、Wix。這筆錢代表的訊號：agent 安全已經是一個擠滿玩家的領域，Bay 靠「不裝額外 endpoint agent、5 分鐘部署」的技術路線去搶位置。"
series:
  name: "AI Agent Funding"
  order: 133
---

> 🌏 [English version](/posts/daily/2026-11-14-funding-bay-en)


## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Bay（以色列，特拉維夫） |
| 輪次 | Series A（合併公布先前未揭露的種子輪） |
| 金額 | $37M（Series A）+ $13M（種子輪）＝ $50M |
| 領投 | Battery Ventures（Series A）；YL Ventures、Striker Venture Partners（種子輪） |
| 跟投 | Micron Ventures、M12（Microsoft 創投基金）、Assaf Rappaport（Wiz CEO，個人跟投 Series A） |
| 估值 | 未揭露 |
| 累計融資 | $50M |
| 成立年份 | 2026 年（公布時成立剛滿 9 個月） |
| 員工數 | ~35 人，多數在以色列（Pomegra 報導） |

## 這家公司做什麼

Bay 是做 AI agent 執行層安全的公司——核心主張是企業不缺「要不要讓 agent 做事」的意願，缺的是「agent 做錯事之前能攔下來」的控管層。公司創辦的起點是一次內部事故：工程師的 coding agent 在跑測試時試圖把一個雲端環境開放給公開網路存取，agent 本身沒有被入侵，只是用合法權限朝著危險方向執行了一個合法目標。

產品把每一個 agent 提出的動作放進整個 session 的上下文判斷，在毫秒內決定允許、擋下或轉交人工審核，涵蓋員工裝置、雲端基礎設施和 SaaS 應用，號稱 5 分鐘內可部署完成,不需要額外安裝常駐的 endpoint agent、kernel driver 或網路 proxy。目前客戶包含 Micron、Peloton、ClickUp、Wix 等企業,公司自己宣稱有 Fortune 100 客戶把 agent 用量在導入後翻三倍,但這個數字是公司自報、未經第三方驗證。

三位創辦人都有情報或資安老兵背景:CEO Yuval Zacharia 曾在以色列情報單位 8200 部隊帶領 50 人團隊,退伍後轉戰資安公司 Hunters 擔任研究與 AI 總監;CPO Aner Morag 是 Noname Security 早期員工,一路做到 VP of Product;VP of R&D Boris Danilovich 曾在 CrowdStrike 帶 90 人工程團隊,是該公司端點安全產品線的核心負責人之一。

## 這筆融資的信號

### 對 Agent 生態的意義

Agent 安全在 2026 年已經不是空白領域——同期還有 Zenity 的 $125M Series C、Straiker 的 $64M Series A、NeuralTrust 的 $20M 種子輪、Asymptote Labs 的 $5.5M 種子輪在搶類似的位置（Pomegra 統計）。Bay 在這個已經擠滿玩家的場子裡,選的差異化路線是「不裝額外 agent、5 分鐘上線」,對比同類產品常見的常駐 endpoint 代理或網路 proxy 架構,目標是把導入摩擦壓到最低,搶企業在還沒有定案資安採購標準前的早期導入位置。

### 投資人在賭什麼

Battery Ventures 合夥人 Dharmesh Thakker 的理由是「Bay 已經在早期階段就贏得企業客戶,技術路線有差異化」;YL Ventures 管理合夥人 Yoav Leitersdorf 講得更直接——「我們評估過一整群做 agent 安全的公司,Bay 能從端點到雲端理解並控制個別 agent 動作,還能嵌進企業既有基礎設施」,並直言期待 Bay 變成「像網路防火牆在網路時代一樣」的基礎設施。Wiz 創辦人 Assaf Rappaport 以個人身份跟投 Series A,這在以色列資安圈是一種同業背書訊號,本身不是機構資金但會影響其他投資人與潛在客戶的觀感。

### 值得觀察的數字

```diagram
title: Agent 安全領域 5 家公司累計募資規模
desc: Bay 的 $50M 介於 Asymptote Labs 的 $5.5M 種子輪和 Zenity 的 $125M Series C 之間，屬於中段規模。
caption: 數字來自 Pomegra（2026-11-13）彙整各公司公開募資公告。換算：基線 x = 160，每 $1M 約 2.93 單位（k = 440 ÷ 150），橫軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">累計募資（$M）</text>
  <line class="dg-grid" x1="307" y1="40" x2="307" y2="312"/>
  <line class="dg-grid" x1="453" y1="40" x2="453" y2="312"/>
  <text class="dg-small" x="307" y="326" text-anchor="middle">50</text>
  <text class="dg-small" x="453" y="326" text-anchor="middle">100</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="160" y="46" width="367" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="102" width="188" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="214" width="59" height="28"/>
    <rect class="dg-bar dg-bar--soft" x="160" y="270" width="16" height="28"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="160" y="158" width="147" height="28"/>
  <line class="dg-axis" x1="160" y1="40" x2="160" y2="312"/>

  <text class="dg-sub" x="535" y="60" dominant-baseline="central">$125M</text>
  <text class="dg-sub" x="356" y="116" dominant-baseline="central">$64M</text>
  <text class="dg-label dg-text--accent" x="315" y="172" dominant-baseline="central">$50M</text>
  <text class="dg-sub" x="227" y="228" dominant-baseline="central">$20M</text>
  <text class="dg-sub" x="184" y="284" dominant-baseline="central">$5.5M</text>

  <text class="dg-sub" x="148" y="60" text-anchor="end" dominant-baseline="central">Zenity</text>
  <text class="dg-sub" x="148" y="116" text-anchor="end" dominant-baseline="central">Straiker</text>
  <text class="dg-label dg-text--accent" x="148" y="172" text-anchor="end" dominant-baseline="central">Bay</text>
  <text class="dg-sub" x="148" y="228" text-anchor="end" dominant-baseline="central">NeuralTrust</text>
  <text class="dg-sub" x="148" y="284" text-anchor="end" dominant-baseline="central">Asymptote Labs</text>
</svg>
```

- 成立 9 個月就合併公布兩輪、總額 $50M,團隊規模只有約 35 人——募資速度明顯快於團隊擴張速度,顯示 VC 搶進意願大於等公司把人力和產品先跑出成熟度
- Bay 的 $50M 在五家對照公司裡排第三,還沒有拉開對 Straiker（$64M）和 Zenity（$125M）的差距,也還領先 NeuralTrust 和 Asymptote Labs 兩家更早期的公司
- 「Fortune 100 客戶用量翻三倍」是公司自己的新聞稿數字,沒有第三方稽核或客戶具名佐證,這類成立不到一年公司常見的成長敘事,讀者要跟實際客戶名單（Micron、Peloton、ClickUp、Wix）分開看

## Watchlist 狀態

Bay 尚未在 watchlist 中。建議加入 section B7（Agent 安全/治理/資安技術),與 Zenity、Protect AI、Lakera、WitnessAI 等同場競爭者並列追蹤,觀察重點放在「5 分鐘部署、無額外 endpoint」這個差異化主張能否在企業實際導入後站得住。

## 今日收穫

Bay 把種子輪和 Series A 一次性合併公布,種子輪金額在這之前完全沒曝光過——這種「先隱身、募資到一定規模才一次性亮兩輪」的做法,代表的不是技術已經成熟到能公開展示,而是公司判斷在 agent 安全這個擠滿玩家的領域裡,一次性曝光比分階段曝光更能製造聲量上的存在感。

## 參考資料

- [Bay raises $50m for AI agent security after nine months in stealth](https://thenextweb.com/news/bay-50m-ai-agent-security-stealth-battery-ventures)
- [Bay Emerges From Stealth With $50M After Fortune 100 Companies Used Its Platform to Triple Autonomous AI Agent Use](https://finance.yahoo.com/technology/ai/articles/bay-emerges-stealth-50m-fortune-130000718.html)
- [Bay Raises $50M to Police Enterprise AI Agents in 2026](https://pomegra.io/startups/bay-raises-50m-to-police-enterprise-ai-agents-in-2026-2026-11-13)
- [Israeli AI security startup Bay emerges from stealth with $50M in funding to stop rogue AI agents before they cause damage](https://techstartups.com/2026/11/10/israeli-ai-security-startup-bay-emerges-from-stealth-with-50m-in-funding-to-stop-rogue-ai-agents-before-they-cause-damage/)
