---
title: "模型卡｜KRAFTON Raon-1 mini"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, model-release, daily, krafton, model-family-raon]
lang: zh-TW
description: "南韓遊戲公司 KRAFTON 從零訓練的首款語言模型 Raon-1 mini——30B-A4B MoE、262K context、Apache 2.0 開源，韓語口語對話大幅領先同量級模型"
tldr: "Raon-1 mini preview：PUBG 開發商 KRAFTON 旗下 KRAFTON AI 從零訓練的 28.8B 總參數／4.3B 活化參數 MoE 模型，262,144 tokens context，Apache 2.0 開源權重；混合注意力架構（Raon Delta Attention + Gated MLA）把 KV cache 壓到每 token 約 8 KiB，自帶 DFlash2 投機解碼草稿模型在 B300 上最高提升 2.18 倍吞吐量；韓語口語對話內部基準 92.9 分大幅領先同量級 Qwen3.6-35B-A3B（74.5）與 Gemma 4 26B-A4B（90.6），但 MMLU-Pro、BFCL 工具呼叫基準落後 Qwen3.6-35B-A3B；尚無官方 API 定價，僅開放權重與限時免費 playground。"
series:
  name: "AI Model Tracker"
  order: 56
glossary:
  - term: "Raon"
    def: "KRAFTON AI 推出的開源語言／語音模型家族，Raon-1 mini 是其首款從零訓練的通用 LLM"
---

> 🌏 [English version](/posts/daily/2026-10-23-model-krafton-raon-1-mini-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `KRAFTON/Raon-1-mini-preview` |
| 廠商 | KRAFTON AI（《PUBG》開發商 KRAFTON 旗下 AI 研究部門） |
| 參數量 | 28.8B 總參數／4.3B 活化參數（30B-A4B 級 MoE，128 個路由專家中每 token 啟用 6 個 + 1 個共享專家） |
| Context Window | 262,144 tokens |
| Input 定價 (USD/1M tokens) | 未提供（僅開放權重 preview，尚無官方或第三方代管 API 定價） |
| Output 定價 (USD/1M tokens) | 未提供（同上；playground 限時免費試用，不計入 API 定價） |
| 開源 | 是（Apache 2.0；代管 API／playground 另受獨立服務條款約束，不在 Apache 2.0 範圍內） |
| 發布日 | 2026-10-21（preview） |
| 官方公告 | [KRAFTON/Raon-1-mini-preview（Hugging Face 模型卡）](https://huggingface.co/KRAFTON/Raon-1-mini-preview) |
| HuggingFace | [KRAFTON/Raon-1-mini-preview](https://huggingface.co/KRAFTON/Raon-1-mini-preview) |
| 家族 | Raon（KRAFTON AI 2026 年 4 月建立的開源模型品牌，此前已釋出語音 LLM、即時語音對話、TTS、視覺編碼器四款模型；Raon-1 mini 是該家族首款通用文字 LLM） |

## 能力亮點

- **韓語口語對話**：內部基準 Chatbot Korean 達 92.9 分，大幅領先同量級 MoE 模型 Qwen3.6-35B-A3B（74.5 分），也勝過 Gemma 4 26B-A4B（90.6 分）
- **混合注意力架構**：25 層中 18 層為自研 Raon Delta Attention（線性注意力，狀態大小固定）、7 層為 Gated MLA（保留 KV cache），將每 token KV cache 壓到約 8 KiB（BF16），原生支援 262,144 tokens context
- **內建投機解碼加速**：隨模型釋出 DFlash2 草稿模型，在單張 NVIDIA B300 上於多項基準實測輸出吞吐量最高提升 2.18 倍
- **邊緣部署門檻降低**：NVFP4 量化版本可在單張 NVIDIA RTX 5090（32GB VRAM）上完整跑推理，另提供 MXFP8、GGUF、MLX 格式

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 同量級 MoE 最強競品 |
|---|---|---|---|
| Chatbot Korean（內部，韓語口語） | 92.9 | —（首款模型） | Gemma 4 26B-A4B 90.6（Qwen3.6-35B-A3B 僅 74.5） |
| SWE-bench Verified | 70.8 | —（首款模型） | Qwen3.6-35B-A3B 63.2（參考：dense Qwen3.8-27B 74.6） |
| AIME 2026 | 93.3 | —（首款模型） | Qwen3.6-35B-A3B 92.9 |
| MMLU Pro | 76.5 | —（首款模型） | Qwen3.6-35B-A3B 85.9（Raon-1 mini 在通用知識基準明顯落後） |
| BFCL v4 Overall（工具呼叫） | 59.8 | —（首款模型） | Qwen3.6-35B-A3B 64.7（參考：dense Qwen3.8-27B 72.4） |

⚠️ 以上均為 KRAFTON 自測（評審模型 gpt-5.6-luna），尚待外部複現；Chatbot Korean 是未公開發布的內部基準，無法由第三方直接驗證。官方也註明這是 preview 版本，正式版規格與分數可能調整。

```diagram
title: Raon-1 mini 與 Qwen3.6-35B-A3B 四項基準比較
desc: Raon-1 mini 在 SWE-bench Verified 與韓語對話基準大幅領先同量級 Qwen3.6-35B-A3B，AIME 2026 打平，但在 MMLU-Pro 通用知識基準落後。
caption: 資料來源：KRAFTON 官方 Hugging Face 模型卡自測（評審模型 gpt-5.6-luna），韓語對話為未公開的內部基準。縱軸 0–100 分，基線 y=300、繪圖區頂 y=60，每分 2.4 單位（y = 300 − 分數 × 2.4）。
---
<svg viewBox="0 0 640 360">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分數</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <g class="dg-c-accent">
    <rect class="dg-bar" x="94" y="130" width="44" height="170"/>
    <rect class="dg-bar" x="234" y="76" width="44" height="224"/>
    <rect class="dg-bar" x="374" y="116" width="44" height="184"/>
    <rect class="dg-bar" x="514" y="77" width="44" height="223"/>
    <text class="dg-text--series" x="116" y="44" text-anchor="middle" dominant-baseline="central">Raon-1 mini</text>
  </g>
  <g class="dg-c-s1">
    <rect class="dg-bar" x="150" y="148" width="44" height="152"/>
    <rect class="dg-bar" x="290" y="77" width="44" height="223"/>
    <rect class="dg-bar" x="430" y="94" width="44" height="206"/>
    <rect class="dg-bar" x="570" y="121" width="44" height="179"/>
    <text class="dg-text--series" x="172" y="44" text-anchor="middle" dominant-baseline="central">Qwen3.6-35B-A3B</text>
  </g>

  <text class="dg-sub" x="116" y="120" text-anchor="middle" dominant-baseline="central">70.8</text>
  <text class="dg-sub" x="172" y="138" text-anchor="middle" dominant-baseline="central">63.2</text>
  <text class="dg-sub" x="256" y="66" text-anchor="middle" dominant-baseline="central">93.3</text>
  <text class="dg-sub" x="312" y="67" text-anchor="middle" dominant-baseline="central">92.9</text>
  <text class="dg-sub" x="396" y="106" text-anchor="middle" dominant-baseline="central">76.5</text>
  <text class="dg-sub" x="452" y="84" text-anchor="middle" dominant-baseline="central">85.9</text>
  <text class="dg-sub" x="536" y="67" text-anchor="middle" dominant-baseline="central">92.9</text>
  <text class="dg-sub" x="592" y="111" text-anchor="middle" dominant-baseline="central">74.5</text>

  <text class="dg-sub" x="144" y="320" text-anchor="middle" dominant-baseline="central">SWE-bench</text>
  <text class="dg-sub" x="284" y="320" text-anchor="middle" dominant-baseline="central">AIME 2026</text>
  <text class="dg-sub" x="424" y="320" text-anchor="middle" dominant-baseline="central">MMLU-Pro</text>
  <text class="dg-sub" x="564" y="320" text-anchor="middle" dominant-baseline="central">韓語對話</text>
</svg>
```

## 與前代/競品比較

Raon-1 mini 是 Raon 家族的首款通用 LLM，沒有「前代」可比，比較對象是同量級的 MoE 模型。跟 Qwen3.6-35B-A3B 相比，Raon-1 mini 在韓語口語（92.9 vs 74.5）與 SWE-bench Verified（70.8 vs 63.2）上明顯領先，但在 MMLU-Pro（76.5 vs 85.9）和 BFCL 工具呼叫（59.8 vs 64.7）上落後——這代表它的訓練重心放在韓語對話品質與軟體工程 agent 任務，而非通用世界知識覆蓋。

定價策略上，KRAFTON 目前完全走開放權重＋限時免費 playground 的路線，沒有公布任何代管 API 定價，跟多數閉源大廠「先定價、再逐步開源舊版」的順序相反。這比較像是用一次性的技術信號建立開發者關注度，而不是急著變現。

更值得注意的是釋出者本身：KRAFTON 是遊戲公司，不是傳統 AI 大廠，卻選擇從零訓練一個 30B 級 MoE 基礎模型，而不是直接調用或微調既有開源模型。這代表「自研基礎模型」的門檻已經下沉到遊戲產業這類垂直領域的大型公司也負擔得起、也認為值得投入的程度。

## 對 Agent 開發的意義

- 如果你在做需要道地韓語口語的客服或遊戲內 NPC 對話 agent：Raon-1 mini 的韓語基準大幅領先同量級模型，是目前少見「原生針對韓語對話調優」的開源選項，不必再拿大模型硬調韓語語氣。
- 如果你在做邊緣部署或自架、低延遲的 agent：NVFP4 量化版本可在單張 RTX 5090 跑，加上 DFlash2 投機解碼最高 2.18 倍吞吐量提升，適合不想依賴雲端 API、又要求回應速度的場景。
- 不適合：需要廣泛世界知識或複雜多工具鏈調用的場景——MMLU-Pro 與 BFCL 都是同量級最弱，這類任務建議用 Qwen3.6-35B-A3B 或更大的 dense 模型。preview 階段的規格與表現也可能在正式版前變動，生產環境先別壓寶。

## 今日收穫

以前以為自研基礎大模型的軍備競賽只發生在傳統 AI 大廠和中國廠商之間，遊戲公司 KRAFTON 從零訓練並開源一個 30B 級 MoE 模型，說明「誰有資格做基礎模型」的邊界已經下沉——不是調用別人的 API 包裝，而是真的自己設計注意力機制變體（Raon Delta Attention）從頭訓練。垂直產業的大型公司現在也能、也願意跨進基礎模型研發這一層。

## 參考資料

- [KRAFTON/Raon-1-mini-preview（Hugging Face 模型卡）](https://huggingface.co/KRAFTON/Raon-1-mini-preview)
- [KRAFTON AI 官方網站](https://krafton.ai/en/)
- [Raon-1 mini playground](https://raon-mini.krafton.ai/en)
- [Seoul Economic Daily：Krafton Releases Raon-1 Mini, Its In-House AI Language Model](https://en.sedaily.com/technology/2026/10/21/krafton-releases-raon-1-mini-its-in-house-ai-language-model)
- [Digital Today：Krafton unveils 30B-class LLM 'Raon-1 Mini' to boost cost efficiency](https://www.digitaltoday.co.kr/en/view/117657/krafton-unveils-30b-class-llm-raon-1-mini-to-boost-cost-efficiency)
- [Seoul Economic Daily：Krafton Launches AI Model Brand 'Raon,' Releases Four Open-Source Models](https://en.sedaily.com/technology/2026/04/02/krafton-launches-ai-model-brand-raon-releases-four-open)
