---
title: "模型卡｜Liquid AI LFM3-1.7B"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, liquid-ai, model-family-liquid-ai]
lang: zh-TW
description: "Liquid AI 發佈新一代 LFM3 家族：六個模型共用同一個 1.7B 骨幹，文字模型 LFM3-1.7B 用 35% 更少參數打贏前代，在網頁 agent benchmark 贏過參數量多五倍的 Qwen3.5-9B"
tldr: "LFM3-1.7B：2026-10-27 發佈，1.73B 參數、256K context，LFM Open License v1.0（年營收 $10M 以下免費商用）。tri-hybrid 架構（13 短卷積＋5 滑動窗注意力＋6 全域注意力）把 KV cache 壓到標準 transformer 約 27%。WebArena-Verified 38.42 分，贏過前代 LFM2.5-2.6B 的 3.02 分與參數量多五倍的 Qwen3.5-9B（28.94 分），但長文本理解（AA-LCR）與知識密集題（GPQA Diamond）仍落後 Qwen3.5-9B。官方明講不適合 agentic coding 或複雜多步推理。Liquid Console API：input $0.08／output $0.20（快取 input $0.02）／1M tokens。同系列另有 VL／Audio／Omni／兩個決策模型，共用同一骨幹。"
series:
  name: "AI Model Tracker"
  order: 61
glossary:
  - term: "LFM3"
    def: "Liquid AI 的第三代邊緣推理模型家族，文字／視覺／語音／全模態／決策六個模型共用同一個 1.7B 骨幹"
  - term: "tri-hybrid 架構"
    def: "同時混用短卷積層、滑動窗注意力層與全域注意力層的模型架構，目的是用更少記憶體換取接近全注意力的能力"
---

> 🌏 [English version](/posts/daily/2026-10-28-model-liquid-ai-lfm3-1-7b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `LiquidAI/LFM3-1.7B` |
| 廠商 | Liquid AI |
| 參數量 | 1.73B（文字模型，24 層：13 短卷積／5 滑動窗注意力／6 全域注意力） |
| Context Window | 256,000 tokens（input + output） |
| Input 定價 (USD/1M tokens) | $0.08（快取 input $0.02，Liquid Console API） |
| Output 定價 (USD/1M tokens) | $0.20 |
| 開源 | 是（LFM Open License v1.0：免費下載／微調／商用，年營收超過 $10M 須另洽商業授權） |
| 發布日 | 2026-10-27 |
| 官方公告 | [Liquid AI Blog：Introducing LFM3](https://www.liquid.ai/blog/lfm3) |
| HuggingFace | [LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B) |
| 家族 | LFM3（繼 LFM2.5 之後的新一代，六個模型共用同一個 `LFM3-1.7B-Base` 骨幹：文字、視覺 LFM3-VL-2B、語音 LFM3-Audio-2B、全模態 LFM3-Omni-2B、兩個決策模型） |

## 能力亮點

- WebArena-Verified 拿 38.42 分，比參數量多五倍的 Qwen3.5-9B（28.94 分）還高；LiveClaw agent benchmark 45.60 分也贏過 Qwen3.5-9B 的 35.77 分
- 用比前代 LFM2.5-2.6B 少 35% 的參數（1.73B 對 2.6B），在官方列出的全部對照 benchmark 上都更強
- Edge 推理在三款測試裝置（AMD Ryzen AI Max+ 395、Apple M5 Max、iPhone 17 Pro）上，32K context 下 prefill 至少快 2.5 倍、decode 至少快 1.8 倍，且用最少記憶體；4-bit 精度僅需約 1GB
- tri-hybrid 架構把 KV cache 壓到標準 24 層 transformer 約 27%，讓同等記憶體可以撐到 256K context，官方訓練資料共 22T tokens

## Benchmark 表現

| Benchmark | LFM3-1.7B | 前代（LFM2.5-2.6B） | 競品最強（Qwen3.5-9B，5 倍大） |
|---|---|---|---|
| WebArena-Verified | 38.42 | 3.02 | 28.94 |
| LiveClaw | 45.60 | 14.70 | 35.77 |
| BFCL V4（工具呼叫） | 71.39 | 55.89 | 62.83 |
| IFEval（指令遵循） | 96.66 | 95.39 | 92.08 |
| AA-LCR（長文本理解） | 52.83 | 6.00 | **62.00** |

⚠️ 以上皆為 Liquid AI 官方自測（vLLM BF16，完整 context 長度跑分），截至發佈時尚無第三方獨立複現；多家媒體（VentureBeat、TechTimes）亦指出此為廠商自評數字。

## 與前代/競品比較

跟前代 LFM2.5-2.6B 比，LFM3-1.7B 不只是參數變少——架構整個換了：前代沒有的 tri-hybrid 設計（13 短卷積＋5 滑動窗注意力＋6 全域注意力）取代原本的結構,預訓練資料量也拉到 22T tokens。結果是前代在 WebArena-Verified 近乎答不出來（3.02 分）,LFM3-1.7B 卻拿下 38.42 分,等於是整整一個世代的能力跳級,而不是微調。

跟 Qwen3.5-9B（參數量多五倍）比,LFM3-1.7B 在偏「agent 動手做」的任務（WebArena-Verified、LiveClaw、BFCL V4 工具呼叫）全部贏,平均分數 49.37 對 47.24 也小贏;但在長文本理解（AA-LCR 52.83 對 62.00）與知識密集題（GPQA Diamond 63.37 對 80.40、Humanity's Last Exam 全面落後）上仍輸給大五倍的對手。這代表 LFM3-1.7B 是刻意為「動手做」而不是「博學」優化的模型。

定價策略上也有明顯轉向：Liquid Console API 的 $0.08/1M input、$0.20/1M output,比第三方彙整站記錄的前代 LFM2.5-2.6B 的 $0.35/$0.50 便宜許多（VentureBeat 引用需登入才能看到的官方控制台報價;LFM2.5-2.6B 數字引自 pricepertoken.com）。小模型＋低價格,搭配開放權重可在裝置端免費跑,是這次最直接的商業訊號。

## 對 Agent 開發的意義

tri-hybrid 架構把 KV cache 壓到約 27%,這代表同一份記憶體預算下可以撐更長的 context,也是官方敢把文字模型的 context window 直接拉到 256K 的原因。這對「常駐型」本地 agent（手機、筆電上一直跑著、累積對話歷史）特別有意義——不需要頻繁清空上下文,也不用靠雲端 API 補記憶。

- 如果你在做裝置端或企業內控（資料不出裝置）的常駐 agent：LFM3-1.7B 在 4-bit 精度下約 1GB 記憶體即可跑,256K context＋官方支援 Hermes Agent、Pi、OpenClaw 等 agent harness,官方公告也點名 Mercedes-Benz（探索 MBUX 車載助理）與 Shopify 為搶先測試夥伴
- 如果你在做高併發雲端工具呼叫服務：單張 NVIDIA B300 可在 1,024 併發下達到 36 億 tokens/天,加上比 Qwen3.5-9B 少五分之四參數卻贏多項 agentic benchmark,值得納入成本敏感場景的候選名單
- 不適合：HuggingFace 官方模型卡自己寫明「不建議用於 agentic coding 或複雜多步推理」(SWE-bench Verified 僅 43.40,輸給 Qwen3.5-9B 的 51.20),以及需要大量內建知識、不搭配檢索的場景

## 今日收穫

這次最有意思的不是「小模型贏大模型」這個常見敘事,而是 Liquid AI 把「犧牲什麼」講得很清楚：LFM3-1.7B 在工具呼叫與網頁操作類任務上贏過五倍大的對手,代價是長文本理解與知識密集題全面讓步,官方自己的模型卡甚至直接勸退 agentic coding 用途。LFM3 家族還同時發布了兩個「決策模型」（d1 系列）,回傳結構化答案而非對話式文字——這提醒我們,不是所有 agent 任務都需要一個會聊天的模型,有些場景要的只是一個可靠的分類器。

## 參考資料

- [Liquid AI Blog：Introducing LFM3 — Every Modality for Specialized Intelligence（官方發佈文章）](https://www.liquid.ai/blog/lfm3)
- [HuggingFace 官方模型卡：LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B)
- [VentureBeat：Liquid AI's new LFM3 models put browser agents, voice commands, and image recognition onto enterprise-controlled devices（含 Liquid Console API 定價）](https://venturebeat.com/technology/liquid-ais-new-lfm3-models-put-browser-agents-voice-commands-and-image-recognition-onto-enterprise-controlled-devices)
- [TechTimes：Liquid AI Releases LFM3 — Six Open-Weight Models Fuse Text, Vision, Audio, One 2B Backbone（tri-hybrid 架構與 KV cache 細節）](https://www.techtimes.com/articles/329588/20261028/liquid-ai-releases-lfm3-six-open-weight-models-fuse-text-vision-audio-one-2b-backbone.htm)
- [startupfortune.com：Liquid AI releases LFM3 models small enough to run on a phone（LFM3-VL-2B／LFM3-Audio-2B 細節）](https://startupfortune.com/liquid-ai-releases-lfm3-models-small-enough-to-run-on-a-phone/)
- [pricepertoken.com：Liquid AI API Pricing（LFM2.5-2.6B 定價對照）](https://pricepertoken.com/pricing-page/provider/liquid)
- [本站 Liquid AI／LFM 家族導讀](/posts/tech/2026-10-10-ai-model-family-liquid-ai)
- [本站模型卡：Liquid AI LFM2.5-24B-A2B（前篇）](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b)

```diagram
title: WebArena-Verified：LFM3-1.7B 對前代與競品
desc: LFM3-1.7B 在 WebArena-Verified 拿 38.42 分，比前代 LFM2.5-2.6B 的 3.02 分高逾 12 倍，也贏過參數量多五倍的 Qwen3.5-9B（28.94 分）。
caption: 資料來自 LiquidAI/LFM3-1.7B 官方 HuggingFace 模型卡 benchmark 表（Liquid AI 自測，vLLM BF16），尚待第三方獨立複現。換算：基線 y=300，繪圖區頂 y=60，數值網域 0–45，k=240/45=5.333（y = 300 − 數值 × 5.333）。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分數</text>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">15</text>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">30</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="140" y="283.9" width="64" height="16.1"/>
    <rect class="dg-bar dg-bar--soft" x="480" y="145.7" width="64" height="154.3"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="310" y="95.1" width="64" height="204.9"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="172" y="274" text-anchor="middle" dominant-baseline="central">3.02</text>
  <text class="dg-label dg-text--accent" x="342" y="85" text-anchor="middle" dominant-baseline="central">38.42</text>
  <text class="dg-sub" x="512" y="136" text-anchor="middle" dominant-baseline="central">28.94</text>

  <text class="dg-sub" x="172" y="320" text-anchor="middle" dominant-baseline="central">LFM2.5-2.6B（前代）</text>
  <text class="dg-label dg-text--accent" x="342" y="320" text-anchor="middle" dominant-baseline="central">LFM3-1.7B</text>
  <text class="dg-sub" x="512" y="320" text-anchor="middle" dominant-baseline="central">Qwen3.5-9B（5 倍大）</text>
</svg>
```
