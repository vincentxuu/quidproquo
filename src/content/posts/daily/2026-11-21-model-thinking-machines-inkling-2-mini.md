---
title: "模型卡｜Inkling 2 Mini"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, thinking-machines, model-family-inkling]
lang: zh-TW
description: "Thinking Machines Lab 發布 Inkling 2 Mini——業界首個公開發布的 looped transformer，26B 權重、5.4B 有效運算量，agentic coding 打贏五倍參數的 Qwen3.8-27B，20GB 就能跑在 MacBook 上"
tldr: "Inkling 2 Mini（thinkingmachines/Inkling-2-Mini）：2026-11-20 Thinking Machines Lab 發布，Apache 2.0；26.4B 總參數、3.4B 原生 active、中間 12 層循環執行 3 次等效 5.4B 推理運算量；1M context；Tinker 官方定價 input $0.15／output $0.50／cache hit $0.015（每 1M tokens）；DeepSWE v1.1 48.2% 打贏 Qwen3.8-27B 的 42.2%，SWE-bench Pro v2 Hard 77.9% 贏 73.8%；首次公開研究 looped transformer 對 CoT 可監控性的影響，結論是循環本身沒有讓監控明顯變差"
series:
  name: "AI Model Tracker"
  order: 79
glossary:
  - term: "looped transformer"
    def: "重複執行同一組權重層以加深序列運算深度的架構，不增加儲存參數量；跟一般 transformer 每層只跑一次不同"
---

> :globe: [English version](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `thinkingmachines/Inkling-2-Mini` |
| 廠商 | Thinking Machines Lab |
| 參數量 | 26.4B 總參數、3.4B 原生 active；中間 12 層循環執行 3 次，等效 5.4B active（24 層儲存權重跑出 48 次層運算） |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | $0.15（Tinker 平台官方定價） |
| Output 定價 (USD/1M tokens) | $0.50（Tinker 平台官方定價，cache hit $0.015） |
| 開源 | 是（Apache License 2.0） |
| 發布日 | 2026-11-20 |
| 官方公告 | [Introducing Inkling 2 Mini（Thinking Machines Lab）](https://thinkingmachines.ai/news/inkling-2-mini/) |
| HuggingFace | [thinkingmachines/Inkling-2-Mini](https://huggingface.co/thinkingmachines/Inkling-2-Mini) |
| 家族 | Inkling（新一代 looped 架構，與既有的 Inkling 2 Small 同期訓練管線） |

## 能力亮點

- **業界首個公開發布的 looped transformer**：24 層中間 2 個 block（12 層）循環執行 3 次，共 48 次層運算只儲存 24 層權重，讓模型「多想而不多寫」
- **agentic coding 打贏五倍參數的開源競品**：DeepSWE v1.1 48.2%（Qwen3.8-27B 42.2%）、SWE-bench Pro v2 Hard 77.9%（Qwen3.8-27B 73.8%），而 Inkling 2 Mini 的有效 active 參數只有 5.4B，約 Qwen3.8-27B 的五分之一
- **20GB 就能跑在筆電上**：權重以訓練時的原生精度（20 層 NVFP4、4 層 MXFP8）直接部署，無量化轉換損失，32GB 記憶體的 MacBook、Mac mini 或 1 張 NVIDIA DGX Spark 就能本地推理
- **單位能耗算力領先**：Stanford Hazy Research 實測 DGX Spark 上「每焦耳智能」指標達 0.703，對比 Qwen3.6-35B-A3B 的 0.430、Gemma-4-26B-A4B 的 0.159
- **同步公開研究 looping 對 CoT 可監控性的影響**：釋出可變循環次數的研究模型 TML-d24-varloop-research，實測循環次數增加不會讓模型在代理環境中更難被監控側任務

## Benchmark 表現

```diagram
title: Inkling 2 Mini 用五分之一有效參數打贏 Qwen3.8-27B 三項 agentic coding 評測
desc: 官方 Hugging Face 模型卡公布的評測數據顯示，Inkling 2 Mini（5.4B 等效 active 參數）在 DeepSWE v1.1、SWE-bench Pro v2 Hard、SWE-bench Verified 三項 agentic coding 評測上，分數都高於參數量約五倍的 Qwen3.8-27B（27B active）。
caption: 數字取自 Thinking Machines Lab 官方 Hugging Face 模型卡。換算：基線 y=300，繪圖區頂 y=60，網域 0–80 分，k=(300−60)÷80=3（每分 3 單位），長條頂 y=300−分數×3。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分數</text>
  <line class="dg-grid" x1="72" y1="240" x2="612" y2="240"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="120" x2="612" y2="120"/>
  <text class="dg-small" x="64" y="240" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="120" text-anchor="end" dominant-baseline="central">60</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-s1"><text class="dg-text--series" x="350" y="18" text-anchor="start" dominant-baseline="central">Qwen3.8-27B</text></g>
  <g class="dg-c-accent"><text class="dg-text--series" x="520" y="18" text-anchor="start" dominant-baseline="central">Inkling 2 Mini</text></g>

  <rect class="dg-bar dg-c-s1" x="114" y="173" width="44" height="127"/>
  <rect class="dg-bar dg-c-accent" x="166" y="155" width="44" height="145"/>
  <rect class="dg-bar dg-c-s1" x="294" y="79" width="44" height="221"/>
  <rect class="dg-bar dg-c-accent" x="346" y="66" width="44" height="234"/>
  <rect class="dg-bar dg-c-s1" x="474" y="67" width="44" height="233"/>
  <rect class="dg-bar dg-c-accent" x="526" y="62" width="44" height="238"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="163" text-anchor="middle" dominant-baseline="central">42.2</text>
  <text class="dg-label dg-text--accent" x="188" y="145" text-anchor="middle" dominant-baseline="central">48.2</text>
  <text class="dg-sub" x="316" y="69" text-anchor="middle" dominant-baseline="central">73.8</text>
  <text class="dg-label dg-text--accent" x="368" y="56" text-anchor="middle" dominant-baseline="central">77.9</text>
  <text class="dg-sub" x="496" y="57" text-anchor="middle" dominant-baseline="central">77.8</text>
  <text class="dg-label dg-text--accent" x="548" y="52" text-anchor="middle" dominant-baseline="central">79.2</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">DeepSWE v1.1</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">SWE-bench Pro v2 Hard</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">SWE-bench Verified</text>
</svg>
```

| Benchmark | 分數（Inkling 2 Mini） | 前代 | 競品最強（Qwen3.8-27B） |
|---|---|---|---|
| DeepSWE v1.1 | 48.2% | 無直接前代（首款公開 looped transformer） | 42.2% |
| SWE-bench Pro v2 Hard | 77.9% | 無 | 73.8% |
| SWE-bench Verified | 79.2% | 無 | 77.8% |
| Vals Index v2.2 | 46.5% | 無 | 未提供分數 |
| AA Index v5.0（Artificial Analysis） | 20.1 | 無 | 20.1（打平） |
| ComplexConstraints v1.1 | 33.4% | 無 | 35.6%（Inkling 落後） |

以上均為 Thinking Machines Lab 官方 Hugging Face 模型卡自測結果，Artificial Analysis 的 AA Index 與每任務成本／耗時數字已由第三方獨立量測。

## 與前代/競品比較

Inkling 2 Mini 沒有同代前作可比——這是 Thinking Machines Lab 首次公開發布 looped transformer，官方拿來對照的是「有循環 vs 無循環」的內部實驗：在相同訓練運算量下，不循環的版本訓練成本少 7.5%，但要多花 140% 的推理運算量才能在 51.2 萬 token 的 agentic trace 上追平循環版本的 loss。這代表「循環」換來的不是訓練便宜，而是推理時用更少 token 達到同等推理深度。

跟競品 Qwen3.8-27B 比，Inkling 2 Mini 用五分之一的有效 active 參數（5.4B vs 27B）在三項 agentic coding 評測全部領先：DeepSWE v1.1 贏 6 個百分點、SWE-bench Pro v2 Hard 贏 4.1 個百分點、SWE-bench Verified 贏 1.4 個百分點。但 Terminal-Bench v2.1（71.6% vs 73.0%）、MultiChallenge 多輪對話（50.0% vs 更高分）、ComplexConstraints v1.1（33.4% vs 35.6%）這幾項需要長指令遵循或多輪穩定性的評測，Qwen3.8-27B 仍略勝一籌——官方自己在限制段落也點名這是 Inkling 2 Mini 的弱項。

定價策略上，Thinking Machines Lab 直接給出 Tinker 平台官方價格（input $0.15／output $0.50／cache hit $0.015，每 1M tokens），這不是「開源模型沒有官方 API」的常見模式，而是直接打出極低定價參與競爭：Artificial Analysis 實測同一組 Intelligence Index 任務，Inkling 2 Mini 平均成本 $0.59、耗時 9.0 分鐘，Qwen3.8-27B 則要 $3.53、38.2 分鐘——換算下來便宜約 6 倍、快約 4 倍。

## 對 Agent 開發的意義

Context window 1M tokens 加上「20GB 就能跑在筆電上」，讓 Inkling 2 Mini 的定位很明確：不是跟大模型拼知識廣度，而是拼「本地、低延遲、可離線跑多個常駐 agent」。官方自己的示範（一台離線 MacBook 跑完 20 個村民角色的小鎮模擬）就是這個定位的直接展示。

- 如果你在做本地或邊緣部署的 coding agent：DeepSWE、SWE-bench 系列評測全面贏過 27B 等級的開源競品，且權重本身就是訓練時的原生精度，不用自己處理量化轉換損失，是目前同尺寸最適合的候選
- 如果你在做需要大量常駐 agent 實例、但預算有限的場景：Tinker 官方定價比 Qwen3.8-27B 便宜約 6 倍，加上本地推理選項，同時壓低 API 成本與基礎設施成本兩個維度
- 不適合：知識密集型問答——官方明確說循環架構不會讓模型「記住更多事實」，AA-Omniscience 等知識型評測只跟總參數量相關，跟循環次數無關；也不適合需要嚴格多輪指令遵循的場景，ComplexConstraints 與 MultiChallenge 都落後 Qwen3.8-27B；長程 agentic 任務建議設定輸出 token 與 agent 回合數上限，官方自己提到測試中觀察到模型會卡在重複推理迴圈裡

## 今日收穫

一直以為「要讓小模型推理更強，只能靠拉長思維鏈（更多可見的 CoT token）」，但 Inkling 2 Mini 證明還有第二條路：讓同一組權重在內部多跑幾次（循環），在不增加參數、不增加輸出 token 的前提下買到更多「看不見」的運算深度。更意外的是，官方實測這種「看不見的運算」在目前規模下並沒有讓模型更難被監控——這跟直覺上「推理過程藏起來等於更難稽核」的擔心正好相反，但官方也坦承這只是初步實驗，規模再放大之後結論可能不一樣。

## 參考資料

- [Introducing Inkling 2 Mini（Thinking Machines Lab 官方公告）](https://thinkingmachines.ai/news/inkling-2-mini/)
- [Inkling 2 Mini Model Card（Thinking Machines Lab）](https://thinkingmachines.ai/model-card/inkling-2-mini/)
- [thinkingmachines/Inkling-2-Mini（Hugging Face 模型頁）](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [Thinking Machines has released Inkling 2 Mini（Artificial Analysis 獨立評測與定價分析）](https://artificialanalysis.ai/articles/inkling-2-mini)
- [Thinking Machines releases Inkling 2 Mini, an open looped model that runs on a laptop（MLQ.ai）](https://mlq.ai/news/thinking-machines-releases-inkling-2-mini-an-open-looped-model-that-runs-on-a-laptop/)
