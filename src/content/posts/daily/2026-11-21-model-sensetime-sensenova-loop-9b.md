---
title: "模型卡｜SenseNova Loop-9B（正式版）"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, sensetime, model-family-sensenova]
lang: zh-TW
description: "商湯把 SenseNova Loop-9B 從 Preview 升級成正式版——GAIA 從 37.86 衝到 69.90，context window 翻倍到 512K，官方同時放出 AWQ 4-bit 量化與寒武紀 MLU day-0 支援"
tldr: "SenseNova Loop-9B 正式版（`sensenova/SenseNova-Loop-9B`）：2026-11-17 商湯（SenseTime）發布，取代 2026-10-30 的 Preview，Apache 2.0；~9B 儲存參數／~14.6B 等效推理運算量，context window 從 Preview 的 262K 翻倍到 512K tokens；官方自測 GAIA 37.86→69.90、Terminal-Bench 2.1 40.45→59.55、AutomationBench 14.33→36.67（打平 Qwen3.8-27B 的 36.67）；NL2Repo 41.36 落後 Qwen3.8-27B 的 44.60；開源無官方 API；同步放出官方 AWQ 4-bit 量化與寒武紀（Cambricon）MLU day-0 支援"
series:
  name: "AI Model Tracker"
  order: 78
glossary:
  - term: "SenseNova Loop"
    def: "商湯探索計算深度與參數效率的架構分支：用循環執行共享權重層換取更深的有效運算路徑，不增加儲存參數量"
---

> :globe: [English version](/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `sensenova/SenseNova-Loop-9B` |
| 廠商 | SenseTime（商湯） |
| 參數量 | ~9B 儲存參數；~14.6B 等效推理運算量（32 個獨立解碼器層中，第 4–27 層權重被重複執行兩次，共 56 次層運算，只儲存 32 組權重） |
| Context Window | 512,000 tokens（官方 HuggingFace 模型卡標示的訓練／支援上限，較 Preview 的 262,144 tokens 翻倍） |
| Input 定價 (USD/1M tokens) | 未提供（僅開放權重，無官方託管 API） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 是（Apache License 2.0） |
| 發布日 | 2026-11-17 |
| 官方公告 | [SenseNova-Loop-9B 模型卡（Hugging Face）](https://huggingface.co/sensenova/SenseNova-Loop-9B) |
| HuggingFace | [sensenova/SenseNova-Loop-9B](https://huggingface.co/sensenova/SenseNova-Loop-9B) |
| 家族 | SenseNova Loop（[Preview](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview) 2026-10-30 開源後 18 天的正式版） |

## 能力亮點

- **GAIA 從 37.86 衝到 69.90**：官方 HuggingFace 模型卡「From Preview to Release」benchmark 圖顯示七項評測正式版全面超過 Preview，GAIA 漲幅最大（+32.04 分，接近翻倍）
- **Terminal-Bench 2.1 從 40.45 升到 59.55、AutomationBench 從 14.33 升到 36.67**：後者正好打平參數量約三倍的 Qwen3.8-27B（同為 36.67）
- **Context window 從 262,144 翻倍到 512,000 tokens**：同時維持循環架構（32 個獨立解碼器層執行 56 次、two-stream mHC）不變
- **官方同步放出 AWQ 4-bit 量化與 GGUF 權重**：4-bit 量化後模型權重約 4.9GB，256K context 多模態推理估計只需約 15GiB GPU 記憶體（8-bit KV cache）
- **寒武紀（Cambricon）day-0 MLU 支援**：用 `vllm_mlu` 把循環架構靜態展開成 56 個序列執行槽位，重用 vLLM 既有排程與 KV cache 機制，但 Pandaily 報導指出這組產能數字未經第三方獨立驗證

## Benchmark 表現

```diagram
title: SenseNova Loop-9B 正式版在三項評測大幅拉開與 Preview 的差距
desc: 官方 HuggingFace 模型卡「Model Performance: From Preview to Release」圖表顯示，SenseNova Loop-9B 正式版（2026-11-17）在 GAIA、Terminal-Bench 2.1、AutomationBench 三項評測上，分數都遠高於 2026-10-30 公開的 Preview 版本。
caption: 數字取自 SenseTime 官方 HuggingFace 模型卡。換算：基線 y=300，繪圖區頂 y=60，網域 0–80 分，k=(300−60)÷80=3（每分 3 單位），長條頂 y=300−分數×3。
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

  <g class="dg-c-s1"><text class="dg-text--series" x="380" y="32" text-anchor="start" dominant-baseline="central">Preview</text></g>
  <g class="dg-c-accent"><text class="dg-text--series" x="520" y="32" text-anchor="start" dominant-baseline="central">正式版</text></g>

  <rect class="dg-bar dg-c-s1" x="114" y="186" width="44" height="114"/>
  <rect class="dg-bar dg-c-accent" x="166" y="90" width="44" height="210"/>
  <rect class="dg-bar dg-c-s1" x="294" y="179" width="44" height="121"/>
  <rect class="dg-bar dg-c-accent" x="346" y="121" width="44" height="179"/>
  <rect class="dg-bar dg-c-s1" x="474" y="257" width="44" height="43"/>
  <rect class="dg-bar dg-c-accent" x="526" y="190" width="44" height="110"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="176" text-anchor="middle" dominant-baseline="central">37.86</text>
  <text class="dg-label dg-text--accent" x="188" y="80" text-anchor="middle" dominant-baseline="central">69.90</text>
  <text class="dg-sub" x="316" y="169" text-anchor="middle" dominant-baseline="central">40.45</text>
  <text class="dg-label dg-text--accent" x="368" y="111" text-anchor="middle" dominant-baseline="central">59.55</text>
  <text class="dg-sub" x="496" y="247" text-anchor="middle" dominant-baseline="central">14.33</text>
  <text class="dg-label dg-text--accent" x="548" y="180" text-anchor="middle" dominant-baseline="central">36.67</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">GAIA</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">Terminal-Bench 2.1</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">AutomationBench</text>
</svg>
```

| Benchmark | 分數（正式版） | 前代（Preview） | 競品最強（Qwen3.8-27B） |
|---|---|---|---|
| GAIA | 69.90 | 37.86 | 66.99 |
| Terminal-Bench 2.1 | 59.55 | 40.45 | 未提供 |
| AutomationBench | 36.67 | 14.33 | 36.67（打平） |
| AIDABench | 65.31 | 未提供 | 65.01 |
| NL2Repo | 41.36 | 未提供 | 44.60（落後） |
| BIRD | 72.34 | 71.38 | 未提供 |

以上均為 SenseTime 官方 HuggingFace 模型卡自測結果，尚無獨立第三方復現。Qwen3.8-27B 參數量約為 Loop-9B 正式版等效推理運算量（~14.6B）的近兩倍。

## 與前代/競品比較

跟 Preview 比，正式版進步最大的是 GAIA（+32.04 分，接近翻倍）與 Terminal-Bench 2.1（+19.1 分）——這兩項都是需要多步驟工具鏈與複雜任務規劃的評測，說明 18 天的迭代主要補強的是 agentic 能力，不是單純沖高分數的小修小補。AutomationBench 從落後 Qwen3.8-27B 的 10.2（Preview 版對 Qwen3.5-27B 的舊比較基準）進步到直接打平 36.67，是本次最具體的「以小勝大」證據。

跟競品 Qwen3.8-27B 比，AutomationBench 打平、AIDABench 小贏（65.31 vs 65.01，差距在誤差範圍內），但 NL2Repo 落後 3.24 分（41.36 vs 44.60）——程式碼生成相關任務仍是 Loop-9B 的弱項，跟 Preview 時期「Terminal Bench、金融業務場景落後大模型」的模式一致。

定價面沒有變化：正式版跟 Preview 一樣只開放權重、沒有官方 API，走的不是價格競爭路線。但這次新增的官方 AWQ 4-bit 量化與寒武紀 day-0 支援，降的是「自架部署」的門檻成本——4.9GB 的量化權重 + 約 15GiB GPU 記憶體（256K context）讓消費級硬體更容易跑起來，這是比「定價策略」更實際的成本訊號。

## 對 Agent 開發的意義

Context window 翻倍（262K→512K）加上 agentic 評測大幅進步，讓 Loop-9B 正式版比 Preview 更接近「可以真的拿來跑 agent」的門檻，而不只是架構效率的展示品。

- 如果你在消費級或邊緣 GPU 上跑 agent：官方 AWQ 4-bit 量化（~4.9GB）+ 256K context 約 15GiB GPU 記憶體的組合，比 Preview 時期多了「官方驗證過的量化路徑」，少走自己摸索量化精度的風險
- 如果你在做需要長上下文的多步驟任務（文件分析、長對話 agent）：512K context 搭配 GAIA、Terminal-Bench 2.1 的大幅進步，值得納入評估——但官方自己的「已知限制」段落點名「複雜工具定義 + 多重限制的指令遵循」與「長程 coding/agent 任務一致性」仍不穩定，建議先用小範圍任務驗證
- 不適合：需要穩定公開 API、SLA 保證的場景——依然只有開放權重，沒有官方託管服務；也不建議直接信任寒武紀 MLU 的產能數字做容量規劃，Pandaily 報導明確指出這些是廠商自己的說法，未經獨立驗證

## 今日收穫

Preview 到正式版只隔 18 天，但 GAIA 幾乎翻倍、AutomationBench 從落後變成打平 27B 等級的競品——這代表「先開源 Preview 收集社群回饋，再快速迭代出正式版」正在變成中國開源模型圈的標準節奏，不是商湯特例（Tencent Hy4 flash、MiniMax 等近期案例都是同樣路數）。但官方自己在「已知限制」段落老實列出長程任務仍不穩定、Pandaily 也主動標注寒武紀的產能數字未經獨立驗證——這種「進步很快但自己劃清驗證邊界」的揭露方式，比單純的 benchmark 漲幅更值得注意。

## 參考資料

- [SenseNova-Loop-9B 模型卡（Hugging Face，正式版）](https://huggingface.co/sensenova/SenseNova-Loop-9B)
- [SenseTime Releases Final SenseNova-Loop-9B With Cambricon Day-0 Support（Pandaily，2026-11-17）](https://pandaily.com/sensetime-sensenova-loop-9b-final-cambricon-mlu-support)
- [IT Home：SenseNova-Loop-9B 正式版發布報導](https://www.ithome.com/1/028/534.htm)
- [IT Home：寒武紀 MLU 適配報導](https://www.ithome.com/1/028/568.htm)
- [SenseNova-Loop-9B-Preview 模型卡（本站 2026-10-31 報導）](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview)
