---
title: "MiniMax：聊天機器人公司做出的 Coding 模型，性價比碾壓閉源"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, moe, code-model, benchmark, pricing, china-ai, agentic-coding]
lang: zh-TW
series:
  name: "AI 模型家族"
  order: 14
tldr: "MiniMax 從消費級聊天 App 起家，M2.5 在 SWE-bench Verified 拿 80.2% 但 API 價格只有 Claude Opus 的 1/10-1/20；M3（456B 總量 / 45.9B 啟用）是首個在 SWE-bench Pro 突破 59% 的開源權重模型，還有 1M context。"
description: "MiniMax 模型家族深入介紹：從消費 AI 到 coding 黑馬的轉型故事、M2.5/M2.7/M3 規格與 benchmark 對比、MiniMax Sparse Attention 技術解析、定價策略與開源生態定位。"
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts，混合專家架構——模型有多組參數但每次只啟用一部分，兼顧能力和效率"
  - term: "MSA"
    def: "MiniMax Sparse Attention，MiniMax 自研的稀疏注意力機制，用 KV-block 選擇取代全注意力，長上下文推論成本降到約 1/20"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark，用真實 GitHub issue 測量模型解決軟體工程問題能力的標準測試集"
---

> 🌏 [English version](/en/posts/tech/2026-08-26-minimax-model-family-en)

MiniMax 不是一家模型公司——至少一開始不是。它做的是角色聊天 App（[Talkie](https://www.talkie-ai.com/)）和影片生成（[Hailuo AI](https://hailuoai.video/)），是中國「AI 六小虎」之一。但在 2026 年 2 月，它發布的 M2.5 在 [SWE-bench Verified](https://www.swebench.com/) 拿到 80.2%，跟當時的 Claude Opus 4.6 只差 0.6 個百分點——API 價格卻只有十分之一到二十分之一。這篇整理 MiniMax 怎麼從聊天機器人跨到 coding 前沿的。

## 公司背景

MiniMax 於 2021 年 12 月在上海成立，創辦人閆俊杰來自商湯科技（SenseTime）的電腦視覺團隊。公司名取自博弈論的 [Minimax 演算法](https://en.wikipedia.org/wiki/Minimax)——考量對手最佳回應後做出最優決策。

截至 2025 年，公司約 415 人，營收約 7,900 萬美元，但仍處於虧損狀態（營業虧損 18.7 億美元）。融資歷程：2024 年 3 月阿里巴巴領投 6 億美元（估值 25 億），2026 年 1 月在港交所上市，2026 年 7 月再融 20 億美元。

一家消費 AI 公司為什麼要做 coding 模型？MiniMax 的邏輯是：要讓 AI 產品（對話、角色扮演、影片）真正好用，底層模型的推理和工具使用能力就得夠強。coding 能力是 agentic 能力的基礎——寫得好程式的模型，通常也能用好工具。

## 模型家族

| 模型 | 發布 | 架構 | 總參數 | 每 token 啟用 | 上下文 | 亮點 |
|---|---|---|---|---|---|---|
| M2.5 | 2026-02 | MoE | ~229B | 未公開 | — | SWE-bench 80.2%，性價比標竿 |
| M2.5-Lightning | 2026-02 | MoE | ~229B | 未公開 | — | 2 倍吞吐（100 tok/s） |
| M2.7 | 2026-03 | MoE | — | ~10B | — | 極小啟用量，SWE-bench 78% |
| M3 | 2026-06 | MoE + MSA | 456B | 45.9B | 1M | 開源權重旗艦 |

### M2.5：性價比炸裂

M2.5 的核心故事不是分數最高，而是**用多少成本達到這個分數**。

| 指標 | M2.5 | Claude Opus 4.6（同期）|
|---|---|---|
| SWE-bench Verified | 80.2% | 80.8% |
| API 價格（input / output） | $0.15 / $1.20 per M tokens | ~$15 / $75 per M tokens |
| 價差 | — | 約 10-60 倍 |

依 MiniMax 官方說法，「$1 可以在 100 tok/s 的速度下連續跑 1 小時」。四個 M2.5 實例全天候跑一年的成本約 $10,000。

M2.5 在訓練過程中出現了一個有趣的**湧現行為**：模型會自發地在寫程式之前先撰寫架構規格（spec-writing tendency）。這不是人工設計的行為，而是在大量 RL 訓練中自然出現的。

### M3：技術上的飛躍

M3 是 MiniMax 迄今最大的模型，也是他們的技術旗艦。

依 MiniMax 官方技術報告，M3 的核心創新是 **MiniMax Sparse Attention（MSA）**：用 KV-block 選擇取代全注意力運算，讓長上下文推論的每 token 計算量降到前一代的約 1/20。這使得 1M context window 在成本上變得可行。

M3 也是原生多模態模型，支援文字、圖片和影片輸入。

## Benchmark 對比

所有數據來自 MiniMax 官方發布。

### M2.5 vs 同期競爭者

| Benchmark | M2.5 | Claude Opus 4.6 |
|---|---|---|
| SWE-bench Verified | **80.2%** | 80.8% |
| Multi-SWE-Bench | **51.3%** | — |
| BrowseComp（含 context mgmt） | **76.3%** | — |

M2.5 的表現只比當時最強的 Opus 4.6 低 0.6 個百分點，但成本低了一個數量級。

### M3 vs 開源 / 閉源旗艦

| Benchmark | M3 | GPT-5.5 | Ornith 1.5-397B |
|---|---|---|---|
| SWE-bench Pro | **59.0%** | 58.6% | — |
| GPQA Diamond | **92.9%** | — | 92.8 |
| HLE | **39.0%** | — | 44.6 |

M3 是首個在 SWE-bench Pro 超越 GPT-5.5 的開源權重模型。跟同為 MoE 的 [Ornith 1.5-397B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 相比，兩者在 GPQA Diamond 上幾乎打平，但走的技術路線完全不同：Ornith 靠 self-improvement RL，MiniMax 靠大規模環境 RL。

### M2.7：被忽略的效率選手

M2.7 值得特別提一下：每 token 只啟用約 10B 參數，SWE-bench Verified 卻拿到 78%——跟 Ornith 1.5-35B-A3B 的 79% 在同一個水準，但啟用量更大（10B vs 3B）。兩者是同一條「用 MoE 壓低推論成本」賽道上的不同選手。

## 訓練方法

MiniMax 的 RL 訓練跟 Ornith 的 self-improvement loop 走不同路線。

依 MiniMax 官方說明，M2.5 在「超過 200,000 個複雜真實世界環境」中進行 RL 訓練，涵蓋 10 種以上語言。這些不是合成的練習題，而是從真實軟體專案中抽取的環境——模型在這些環境裡嘗試解決問題，成功與否作為獎勵訊號。

M3 引入了 **interactive user-simulator framework**：在多輪對話場景中，用模擬使用者的方式訓練模型的協作能力。這跟多數 coding 模型只訓練單輪解題不同——M3 也在學怎麼跟人互動、問問題、迭代修改。

## 定價策略

MiniMax 的定價是它最鮮明的差異化。

| 模型 | Input | Output | 速度 |
|---|---|---|---|
| M2.5 | $0.15/M | $1.20/M | 標準 |
| M2.5-Lightning | $0.30/M | $2.40/M | 100 tok/s |
| M3 | $0.60/M | $2.40/M | — |

跟閉源旗艦的價差在 10-60 倍之間。這個定價讓「把 coding agent 跑在 MiniMax 上」成為很多團隊認真考慮的選項——特別是需要大量 API 呼叫的 batch processing 場景。

## 值不值得關注

**值得，原因有三：**

1. **成本結構的示範**——M2.5 證明 frontier coding 不一定要 frontier 價格。對開發團隊來說，10 倍的價差不是省一點錢，是整個使用場景的可行性邊界在移動
2. **MSA 的工程意義**——1M context 不是新鮮事，但用 1/20 的計算量做到才是。如果 MSA 的品質損失真如官方宣稱那麼小，這個技術方向值得追蹤
3. **消費 AI 反哺基礎模型**——MiniMax 的使用者基礎（2 億+）提供了其他純模型公司沒有的訓練訊號。interactive user-simulator 框架可能就是這個優勢的體現

**需要保留的地方：**

- 公司仍然大幅虧損（營業虧損 $18.7 億），定價可能有補貼成分
- M3 是開源權重但訓練資料和程式碼未公開，不是完全開源
- Benchmark 數據來自官方自測，獨立大規模複現尚在進行
- 中國 AI 公司的地緣政治風險對某些使用場景是考量因素

## 參考資料

- [MiniMax 官網](https://www.minimaxi.com/)
- [MiniMax M3 技術報告](https://www.minimaxi.com/m3)
- [MiniMax HuggingFace](https://huggingface.co/MiniMaxAI)
- [SWE-bench 排行榜](https://www.swebench.com/)
- [Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) — 本站
