---
title: "融資速報｜Phonic Series A $27.5M（speech-to-speech 語音 agent 模型，First Round 領投）"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, funding, daily, phonic, voice-agent]
lang: zh-TW
description: "原生 speech-to-speech 語音 agent 模型公司 Phonic 完成 $27.5M Series A，First Round 領投，同步推出 Phonic-1 模型登上 Artificial Analysis 語音評測榜首"
tldr: "Phonic 完成 $27.5M Series A，由 First Round 領投，累計融資 $31.5M，同步發布 speech-to-speech 模型 Phonic-1，在盲測中贏過 GPT-Live-1、Grok Voice 3、Eleven v4 Turbo 三個對手，但仍輸真人配音員。這筆錢的信號：語音 agent 的競爭正從「串接三個模型」轉向「原生端到端模型」。"
series:
  name: "AI Agent Funding"
  order: 118
---

> 🌏 [English version](/posts/daily/2026-10-31-funding-phonic-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Phonic（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $27.5M |
| 領投 | First Round Capital |
| 跟投 | Lux Capital, Felicis, Definition, Essence VC |
| 估值 | 未揭露 |
| 累計融資 | $31.5M（此前種子輪 $4M + Series A $27.5M） |
| 成立年份 | 2024（創辦團隊自述「兩年多前」創立） |
| 員工數 | 約 10 人（MIT、史丹佛、CMU 背景的研究/工程團隊） |

## 這家公司做什麼

Phonic 是做語音 agent 底層模型的公司——它不是在既有的語音辨識(STT)+大型語言模型(LLM)+語音合成(TTS)串接管線上疊加一層,而是直接訓練一個原生端到端的 speech-to-speech 模型,讓語音 agent 能聽懂語氣、停頓、情緒,而不只是聽懂轉成文字後的語意。

差異化在於「邊聽邊做」：多數語音 agent 得等使用者講完一句話、說「我查一下」才呼叫工具;Phonic-1 能在使用者還在說話的同時就先呼叫工具,等對方講完就立刻有答案。公司示範過一通 44 分鐘、123 次工具呼叫的訂房電話,橫跨英語與葡萄牙語無縫切換。模型也支援 50 種以上語言,可在同一通電話中途切換語言並保持同一個「聲音」。目前客戶包括 Ashby(用於 25 個國家的 AI 面試排程)、Maven AGI、Rho,以及一家 Fortune 50 IT 基礎設施公司,底層跑在 Together AI 的算力上。

Phonic-1(High)在 Artificial Analysis 的 Speech-to-Speech Index 拿下第一名(87.1 分,小幅超過 Grok Voice 3.0 的 86.9 分),在前五名模型中擁有最快的首次回應時間(0.61 秒)。在 Sierra 的多語言全雙工基準 τ³-Voice 上拿 83.2 分,高於 GPT-Live-1 的 79.9 分與 Gemini 3.8 Live 的 68.5 分。

## 這筆融資的信號

### 對 Agent 生態的意義

語音 agent 的技術瓶頸正從「怎麼串接三個模型」轉向「要不要直接訓練一個原生端到端模型」。Phonic 主打的「邊聽邊做」直接點出串接式(cascaded)架構在真實客服通話中的兩個老問題：延遲(等對方說完才開始處理)與情緒流失(轉成文字的過程會丟掉語氣、停頓、情緒)。這代表下一輪語音 agent 的競爭,很可能會在模型層而不是在 orchestration(工具呼叫、記憶管理)層決勝負。

### 投資人在賭什麼

First Round 領投,但這輪角投名單更值得注意的是一群重量級開發者工具天使：Vercel 的 Guillermo Rauch、Replit 的 Amjad Masad、Hugging Face 的 Clement Delangue、Modal 的 Erik Bernhardsson、AngelList 的 Naval Ravikant 都個人參投。這份名單更像是「開發者基礎設施生態圈」集體押注語音會成為下一個 agent 介面,而不只是單純的財務投資人在賭一個市場規模。

### 值得觀察的數字

```diagram
title: Phonic-1 盲測偏好度：贏三個 AI 模型，輸真人配音員
desc: 第三方 Podonos 執行的盲測配對比較中，Phonic-1 以 61.5% 對 32.0% 贏過 GPT-Live-1、以 66.5% 對 26.5% 贏過 Grok Voice 3、以 78.0% 對 14.0% 贏過 Eleven v4 Turbo；但對上真人配音員時，Phonic-1 僅拿 32.0%、真人配音員拿 57.0%。
caption: 數字來自 Phonic 官方部落格（phonic.ai/blog/phonic-1，2026-10-29），Podonos 執行的盲測配對比較；數值軸 0–100%，x=200+數值×4。藍色實心點固定代表 Phonic-1 分數，灰色空心點代表對照模型／真人分數。
---
<svg viewBox="0 0 640 360">
  <text class="dg-label" x="180" y="80" text-anchor="end" dominant-baseline="central">vs GPT-Live-1</text>
  <line class="dg-axis" x1="328" y1="80" x2="446" y2="80"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="328" cy="80" r="6"/>
  <circle class="dg-point dg-c-accent" cx="446" cy="80" r="6"/>
  <text class="dg-sub" x="316" y="80" text-anchor="end" dominant-baseline="central">32.0%</text>
  <text class="dg-sub dg-text--accent" x="458" y="80" dominant-baseline="central">61.5%</text>

  <text class="dg-label" x="180" y="150" text-anchor="end" dominant-baseline="central">vs Grok Voice 3</text>
  <line class="dg-axis" x1="306" y1="150" x2="466" y2="150"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="306" cy="150" r="6"/>
  <circle class="dg-point dg-c-accent" cx="466" cy="150" r="6"/>
  <text class="dg-sub" x="294" y="150" text-anchor="end" dominant-baseline="central">26.5%</text>
  <text class="dg-sub dg-text--accent" x="478" y="150" dominant-baseline="central">66.5%</text>

  <text class="dg-label" x="180" y="220" text-anchor="end" dominant-baseline="central">vs Eleven v4 Turbo</text>
  <line class="dg-axis" x1="256" y1="220" x2="512" y2="220"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="256" cy="220" r="6"/>
  <circle class="dg-point dg-c-accent" cx="512" cy="220" r="6"/>
  <text class="dg-sub" x="244" y="220" text-anchor="end" dominant-baseline="central">14.0%</text>
  <text class="dg-sub dg-text--accent" x="524" y="220" dominant-baseline="central">78.0%</text>

  <text class="dg-label" x="180" y="290" text-anchor="end" dominant-baseline="central">vs 真人配音員</text>
  <line class="dg-axis" x1="328" y1="290" x2="428" y2="290"/>
  <circle class="dg-point dg-c-accent" cx="328" cy="290" r="6"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="428" cy="290" r="6"/>
  <text class="dg-sub dg-text--accent" x="316" y="290" text-anchor="end" dominant-baseline="central">32.0%</text>
  <text class="dg-sub" x="440" y="290" dominant-baseline="central">57.0%</text>
</svg>
```

- 多語言全雙工基準 τ³-Voice 得分 83.2,比 GPT-Live-1(79.9)高 3.3 分、比 Gemini 3.8 Live(68.5)高 14.7 分
- 在前五名模型中擁有最快首次回應時間 0.61 秒,是「智能與延遲同時最佳」的少數案例
- 累計融資僅 $31.5M 就做出登上榜首的前沿模型,團隊規模僅約 10 人,資本效率在這波動輒上億美元的語音 AI 融資中相對精簡

## Watchlist 狀態

Phonic 尚未在 watchlist 中。建議加入 section C5(語音 AI / Voice Agent)——現有名單(Vapi、Retell、Bland AI、ElevenLabs、PolyAI、Parloa、Synthflow、Cartesia、LiveKit)皆為串接式或平台型方案,Phonic 的差異化在於原生 speech-to-speech 模型本身,追蹤重點：邊聽邊做工具呼叫(可在使用者講話中途執行動作)、$27.5M Series A、First Round 領投。

## 今日收穫

Phonic 公開揭露自己在盲測裡輸給真人配音員(32.0% vs 57.0%),而不是只秀贏過其他 AI 模型的三個對比——這種「連自己輸多少都講清楚」的揭露方式,反而比純行銷語言更值得信任。這也點出語音 agent 現在真正的競爭基準不是「打敗其他 AI」,而是「縮小跟真人的差距」,這個差距還有 25 個百分點要補。

## 參考資料

- [Introducing Phonic-1 and our $27.5M Series A](https://phonic.ai/blog/phonic-1)
- [MIT-Founded Phonic Beats Grok and GPT With Fastest Voice AI Response](https://alphasignal.ai/news/mit-founded-phonic-beats-grok-and-gpt-with-fastest-voice-ai-response)
- [Phonic Raises $27.5M to Launch Phonic-1 Agentic Speech AI Model](https://huggingnews.com/ai/phonic-raises-275m-to-launch-phonic-1-agentic-speech-ai-model-96dfbe61)
- [Why Big Tech earnings are a crucial report card for the AI boom](https://fortune.com/2026/10/30/why-big-tech-earnings-are-a-crucial-report-card-for-the-ai-boom-and-its-future/)
