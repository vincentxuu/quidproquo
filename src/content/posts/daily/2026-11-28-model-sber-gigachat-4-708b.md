---
title: "模型卡｜GigaChat 4 (708B-A41B)"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, sber, model-family-gigachat]
lang: zh-TW
description: "Sber 旗艦模型 GigaChat 4 以 MIT 授權全開源——708B 參數、1M context、單一 checkpoint 切換 instant/reasoning，工具呼叫 BFCL v4 拿下對照表最高分，但長程軟體工程任務明顯落後 DeepSeek"
tldr: "GigaChat 4（ai-sage/GigaChat4-708B-A41B）：Sber 於 2026-11-26 以 MIT 授權開源，708B 總參數、41B 活躍參數，1,048,576 tokens context，同一個 checkpoint 支援 instant/reasoning 雙模式；SWE-bench Verified 80.89%（前代 64.70%）、BFCL v4 工具呼叫 79.55% 是對照表最高分，但 DeepSWE 僅 35.40%，遠低於 DeepSeek 4.1 的 74.34%。"
series:
  name: "AI Model Tracker"
  order: 115
glossary:
  - term: "GigaChat"
    def: "Sber（俄羅斯最大銀行）旗下的大型語言模型家族與對話助理品牌"
---

> :globe: [English version](/posts/daily/2026-11-28-model-sber-gigachat-4-708b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `ai-sage/GigaChat4-708B-A41B` |
| 廠商 | Sber（俄羅斯最大銀行，GigaChat 開發商） |
| 參數量 | 708B 總參數、41B 活躍參數（MoE，256 個 routed experts 每 token 選 8 個 + 1 個 shared expert） |
| Context Window | 1,048,576 tokens |
| Input 定價 (USD/1M tokens) | 未提供官方 API 定價（僅發布開源權重；現行 GigaChat API 費率表尚未列出 GigaChat 4 專屬 tier） |
| Output 定價 (USD/1M tokens) | 未提供官方 API 定價（同上） |
| 開源 | 是（MIT License；同時發布的 37B-A4B 小模型採非商用個人授權） |
| 發布日 | 2026-11-26 |
| 官方公告 | [GigaChat 4（Sber GigaChat Blog）](https://giga.chat/blog/en/posts/gigachat-4) |
| HuggingFace | [ai-sage/GigaChat4-708B-A41B](https://huggingface.co/ai-sage/GigaChat4-708B-A41B) |
| 家族 | GigaChat 4.x |

## 能力亮點

- 同一個 checkpoint 內建 instant／reasoning 雙模式，依請求切換，不像前代 GigaChat 3.5 要拆成兩個獨立權重部署
- 1,048,576 tokens context window，混合 Gated DeltaNet 與 DeepSeek Sparse Attention（DSA）兩種注意力層，比例 3:1，DSA 每次查詢只挑 2,048 個先前 token，兼顧長上下文與推論成本
- 工具呼叫基準 BFCL v4 拿下 79.55 分，是官方對照表中所有列出模型（含 DeepSeek V4.1、GLM-5.3、Mistral 4 Large）裡最高分
- 支援兩種投機解碼：複用單一預測層的 recurrent MTP，與獨立 5 層 BF16 drafter DFlash2，官方並提供 Pi、Codex CLI、DeepSeek Harness 三種 agent harness 的對接範例

## Benchmark 表現

| Benchmark | GigaChat 4 708B（reasoning 模式） | GigaChat 3.5 Ultra 432B（前代） | 競品最強 |
|---|---|---|---|
| SWE-bench Verified | 80.89% | 64.70% | GLM-5.3 86.67% |
| LiveCodeBench v6 | 88.82% | 85.40% | DeepSeek 4.1 1017 90.14% |
| Terminal-Bench 2.0 | 71.26% | 30.30% | Mistral 4 Large 77.78% |
| BFCL v4（工具呼叫） | 79.55% | 58.59% | DeepSeek V4 Flash 0731 73.12%（GigaChat 4 為對照表最高） |
| DeepSWE（長程軟體工程） | 35.40% | 未提供 | DeepSeek 4.1 1017 74.34% |

以上為 Sber 官方自測結果，獨立複現尚未發布；DeepSWE 一項明顯落後 DeepSeek，第三方報導（TechTimes）已點出這個落差。

```diagram
title: GigaChat 4 對前代 GigaChat 3.5 Ultra 的四項關鍵指標對照
desc: GigaChat 4 在四項官方自測指標上全面超越前代 GigaChat 3.5 Ultra，進步幅度最大的是 Terminal-Bench 2.0，最小的是 LiveCodeBench v6。
caption: 數值來自 ai-sage/GigaChat4-708B-A41B 的 Hugging Face 模型卡（reasoning 模式）；x 座標 = 200 + 分數(%) × 4，0% 對應 x=200、100% 對應 x=600。列按 GigaChat 4 相對 3.5 Ultra 的進步幅度由大到小排序。
---
<svg viewBox="0 0 680 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">Terminal-Bench 2.0</text>
  <line class="dg-axis" x1="321" y1="90" x2="485" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="321" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="485" cy="90" r="6"/>
  <text class="dg-sub" x="309" y="90" text-anchor="end" dominant-baseline="central">30.3%</text>
  <text class="dg-label dg-text--accent" x="497" y="90" text-anchor="start" dominant-baseline="central">71.3%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">BFCL v4（工具呼叫）</text>
  <line class="dg-axis" x1="434" y1="170" x2="518" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="434" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="518" cy="170" r="6"/>
  <text class="dg-sub" x="422" y="170" text-anchor="end" dominant-baseline="central">58.6%</text>
  <text class="dg-label dg-text--accent" x="530" y="170" text-anchor="start" dominant-baseline="central">79.6%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">SWE-bench Verified</text>
  <line class="dg-axis" x1="459" y1="250" x2="524" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="459" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="524" cy="250" r="6"/>
  <text class="dg-sub" x="447" y="250" text-anchor="end" dominant-baseline="central">64.7%</text>
  <text class="dg-label dg-text--accent" x="536" y="250" text-anchor="start" dominant-baseline="central">80.9%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">LiveCodeBench v6</text>
  <line class="dg-axis" x1="542" y1="330" x2="555" y2="330"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="542" cy="330" r="6"/>
  <circle class="dg-point dg-c-accent" cx="555" cy="330" r="6"/>
  <text class="dg-sub" x="530" y="330" text-anchor="end" dominant-baseline="central">85.4%</text>
  <text class="dg-label dg-text--accent" x="567" y="330" text-anchor="start" dominant-baseline="central">88.8%</text>

  <line class="dg-rule" x1="20" y1="356" x2="660" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">圖例</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">GigaChat 3.5 Ultra</text>
  <circle class="dg-point dg-c-accent" cx="330" cy="382" r="6"/>
  <text class="dg-small" x="346" y="382" dominant-baseline="central">GigaChat 4</text>
</svg>
```

## 與前代/競品比較

跟 GigaChat 3.5 Ultra 比，Terminal-Bench 2.0 從 30.30% 跳到 71.26%，是官方表裡進步最大的一項，代表終端多步驟操作能力大幅提升；BFCL v4 的工具呼叫分數也從 58.59% 拉到 79.55%，超越所有列入對照的競品（包括 DeepSeek 4.1、GLM-5.3、Mistral 4 Large）。

跟同期開源競品比，GigaChat 4 的程式碼生成（LiveCodeBench、SWE-bench Verified）介於 DeepSeek 4.1 與 GLM-5.3 之間，不是最強；但長程軟體工程任務 DeepSWE 只拿 35.40%，遠低於 DeepSeek 4.1 的 74.34%，TechTimes 的報導特別點出這個落差，提醒「1M context」的宣傳數字不代表所有長任務都強。

定價策略上，Sber 把 708B 旗艦模型整顆用 MIT 授權開源，37B-A4B 小模型反而用非商用個人授權——這跟多數大廠「旗艦模型收費、小模型開源練生態」的常見策略相反，反映 Sber 想先用旗艦模型搶開發者生態，商業變現留在既有的 GigaChat API（按字元計費）那條線。

## 對 Agent 開發的意義

GigaChat 4 把「選 instant 還是 reasoning」從部署時決定（兩個權重）變成每次請求決定（一個 checkpoint），對要同時處理即時客服和深度分析任務的 Agent 系統來說，可以省掉維護兩套模型的成本。

- 如果你在做需要大量工具呼叫的 Agent：BFCL v4 79.55% 是目前公開對照表裡最高分，且官方直接給了 Pi、Codex CLI、DeepSeek Harness 的接法範例，上手成本低
- 如果你在做長程自動化任務（多步驟 debug、跨檔案重構）：DeepSWE 35.40% 明顯偏弱，這類場景目前還是 DeepSeek 4.1 或 GLM-5.3 更可靠
- 不適合中小型團隊自架：708B FP8 版本最低要兩個節點、每節點 8×H100 80GB（TP16）才能部署，是面向有大規模推理基礎設施的團隊

## 今日收穫

多數大廠的開源策略是「小模型開源練生態、旗艦模型收費變現」，GigaChat 4 反過來把 708B 旗艦整顆開源（MIT），37B 小模型才限制非商用——這提醒我「開源規模」和「商業定位」不必然綁在一起，開不開源更多是公司當下想搶哪個生態位置決定的，不是模型越大就越該收費。

## 參考資料

- [GigaChat 4（Sber GigaChat 官方 Blog）](https://giga.chat/blog/en/posts/gigachat-4)
- [ai-sage/GigaChat4-708B-A41B（Hugging Face 模型卡）](https://huggingface.co/ai-sage/GigaChat4-708B-A41B)
- [Sber releases GigaChat 4 as open weights（Little Wolf Labs）](https://news.littlewolflabs.com/posts/2026-11-26-gigachat-4-open-weights)
- [Sber Releases GigaChat 4 With 1M-Token Window but Lists 35% on Coding Test Where DeepSeek Gets 74%（Tech Times）](https://techtimes.com/articles/331654/20261127/sber-releases-gigachat-4-1m-token-window-lists-35-coding-test-where-deepseek-gets-74.htm)
- [Sber GigaChat 4: agentic models, open weights and licenses（Magica）](https://magica.com/news/sber-gigachat-4-agentic-models-open-weights-split-licenses)
