---
title: "模型卡｜Muse Spark Open"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta, model-family-muse-spark]
lang: zh-TW
description: "Meta 首次公開旗艦模型權重——816B/42B MoE、1M context，agentic 測試官方表格最高分，但 AA Intelligence Index 落後 GLM 5.3 與 Kimi K3"
tldr: "Muse Spark Open：2026-10-15 公開權重，816B 總參數／42B 啟用的 MoE＋原生多模態 Perception Encoder，1,048,576 tokens context；第三方平台 API 定價 input $1.25／output $4.25（快取 input $0.15），跟兩個月前的閉源 Muse Spark 1.2 完全相同；Meta 官方比較表中，Muse Spark Open 在 JobBench（61.8）、MCP-Atlas（89.2）兩項 agentic 測試是所有列出模型裡最高分，但 AA Intelligence Index 僅 39 分，落後 GLM 5.3（45）與 Kimi K3（44）；可在兩台 Apple M5 Ultra Mac Studio 用 MLX 跑滿整個模型，是該規格第一款做到這件事的模型。"
series:
  name: "AI Model Tracker"
  order: 48
glossary:
  - term: "Muse Spark Open"
    def: "Meta Superintelligence Labs 於 2026 年 10 月 15 日公開權重的旗艦模型，816B 總參數／42B 啟用，是 Muse 家族首款公開權重的大型模型"
  - term: "Artificial Analysis Intelligence Index"
    def: "第三方評測機構 Artificial Analysis 綜合多項 benchmark 算出的模型智能綜合分數；題庫與模型池會隨時間持續校正，不同時間點的分數不能直接跨期比較"
---

> 🌏 [English version](/posts/daily/2026-10-16-model-meta-muse-spark-open-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | 無單一官方 ID，各推理平台路由名稱不同（如 OpenRouter `meta/muse-spark-open`、HuggingFace `meta-models/Muse-Spark-Open-816B-A42B`） |
| 廠商 | Meta（Meta Superintelligence Labs） |
| 參數量 | 816B 總參數／42B 啟用（Mixture-of-Experts，256 專家、每次啟用 8 個） |
| Context Window | 1,048,576 tokens |
| Input 定價 (USD/1M tokens) | $1.25（快取 input $0.15） |
| Output 定價 (USD/1M tokens) | $4.25 |
| 開源 | 是（Muse Model License，自訂條款：年營收超過 2,000 萬美元的 Model-as-a-Service 須另與 Meta 簽約，其餘用途含商業使用皆免費） |
| 發布日 | 2026-10-15 |
| 官方公告 | [Meta AI Research：Introducing Muse Spark Open](https://research.meta.ai/blog/muse-spark-open) |
| HuggingFace | [meta-models/Muse-Spark-Open-816B-A42B](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B) |
| 家族 | Muse（前代閉源旗艦 Muse Spark 1.2 → 本代首款公開權重版本 Spark Open；同期另有閉源前沿線 Muse Wonder／Wonder Full） |

## 能力亮點

- 816B／42B MoE 搭配原生多模態 Perception Encoder（1.8B 參數，支援文字、圖片、影片、音訊輸入），Meta 稱其為「美國目前最強的開放權重模型」
- Meta 官方比較表中，JobBench（61.8）與 MCP-Atlas（89.2）兩項 agentic 測試是表中所有模型（含閉源 Kimi K3、GLM 5.3）裡最高分
- 首款做到可在兩台 Apple M5 Ultra Mac Studio 用 MLX 跑滿整個模型的同規格模型，靠 1.2TB/s 記憶體頻寬與合計 1TB 統一記憶體把兩台機器當成一台跑
- 安全後訓練效果明顯：對內部網路安全越獄測試拒絕率 99.2%，整合 PolyGuard／RedCode／CyberBench 2024 後仍有 94.8%，遠高於同表 Kimi K3 的 75.5%／70.2%

## Benchmark 表現

| Benchmark | Muse Spark Open | 前代／對照 | 競品最強（Meta 官方表格） |
|---|---|---|---|
| AA Intelligence Index | 39 | 閉源 Muse Spark 1.2：57（⚠️ 見下方說明，不可直接比較） | GLM 5.3 45 |
| JobBench（agentic） | **61.8** | 未測 | Kimi K3 54.3（Muse Spark Open 自己最高） |
| MCP-Atlas（agentic） | **89.2** | 未測 | Kimi K3 82.3（Muse Spark Open 自己最高） |
| Terminal-Bench 2.1 | 76.4 | 閉源 Muse Spark 1.2 的 Terminal-Bench v2.1：80%（不同 agent harness，僅供參考） | Kimi K3 85.0 |
| StrongREJECT v2（越獄測試，分數越低越安全） | **0.5** | 未測 | Kimi K3 66.6 |

⚠️ AA Intelligence Index 由 Artificial Analysis 持續校正題庫與模型池，Muse Spark 1.2 的 57 分（2026-08）與 Muse Spark Open 的 39 分（2026-10）相隔近兩個月、題庫版本不同，不能直接解讀為「退步 18 分」。以上均為 Meta 自測或 Artificial Analysis 既有公開分數，尚待第三方針對 Muse Spark Open 本身重新複現。

## 與前代/競品比較

Muse Spark Open 不是單純的「下一代升級」，而是 Meta 第一次把大型旗艦模型的權重整個公開。跟同期發布的閉源前沿線 Muse Wonder／Wonder Full（10/12 發布，1M context、$4/$20）比，兩者定位不同：Wonder 系列主打最高智能，Spark Open 主打「開放下載、可以在自己的機器上跑」，參數量也公開了一個量級的細節（Wonder 未公開參數量，Spark Open 公開 816B/42B）。

跟其他開放權重模型比，AA Intelligence Index 39 分落後 GLM 5.3（45）、Kimi K3（44），甚至低於 Qwen3.8-2.4T-A95B（40），代表就「單題智能」而言它不是開放權重裡最強的。但在 agentic 測試上反而是 Meta 官方表格裡所有模型最高分，顯示這一代的訓練重心明顯放在「長任務 agent 執行」而非「單題正確率」。安全性上差距更明顯：網路安全越獄拒絕率 99.2%／94.8%，遠勝 Kimi K3 的 75.5%／70.2%，StrongREJECT v2 只有 0.5 分（分數越低越安全），遠低於表中其他模型的 62.9–86.4。

定價方面，透過 Together AI、OpenRouter 等第三方平台提供的 API 費率是入 $1.25／出 $4.25（快取 input $0.15），跟兩個月前閉源的 Muse Spark 1.2 完全相同——Meta 把原本閉源產品的費率原封不動套用到開放權重版本上，對已經在用 Spark 線的開發者沒有轉換成本。

## 對 Agent 開發的意義

如果你在做需要自建或地端部署的 agent（資料隱私、法規限制場景）：Muse Spark Open 目前是 agentic benchmark 分數最高的開放權重選項（JobBench／MCP-Atlas 官方表格最高分），搭配 Muse Model License 的商業條款（年營收超過 2,000 萬美元才需另簽約），對中小規模企業部署幾乎沒有授權負擔。

如果你在做長任務、多步驟的 coding agent：Terminal-Bench 2.1 76.4、DeepSWE 1.1 60 分雖不是開放權重裡最高分（Kimi K3 更高），但原生支援 SGLang、vLLM、TensorRT-LLM、llama.cpp 等主流推理框架，還有自家 Helion GPU kernel 優化（NVIDIA／AMD 加速 1.03–3.95 倍），落地門檻相對低。

如果你追求的是純智能評測導向的應用（需要最高單題正確率）：AA Intelligence Index 39 分落後 GLM 5.3、Kimi K3，不是首選；Meta 自己也建議搭配額外的 guardrail 系統部署，不建議當獨立模型直接對外服務。

不適合：消費級硬體。即使是 NVFP4 量化版本仍需 700GB VRAM，BF16 版本要 2TB，MLX 方案也得兩台頂規 Mac Studio（合計成本可觀），對個人開發者或小團隊門檻仍高。

## 今日收穫

開放權重模型的「最強」宣稱常常只在特定維度成立——Muse Spark Open 在 agentic 測試（JobBench／MCP-Atlas）拿下 Meta 官方表格最高分，但原始智能分數（AA Intelligence Index 39）卻輸給 GLM 5.3 和 Kimi K3。看到「最強開放權重模型」這類宣稱時，要先確認「哪個維度最強」，而不是假設所有維度都領先。

## 參考資料

- [Meta AI Research：Introducing Muse Spark Open, The Most Capable US Open-Weight Model to Date](https://research.meta.ai/blog/muse-spark-open)
- [HuggingFace：meta-models/Muse-Spark-Open-816B-A42B 模型卡](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B)
- [Unite.AI：Meta's 816B-Parameter Muse Spark Open Weights Are Now Public](https://www.unite.ai/metas-816b-parameter-muse-spark-open-weights-are-now-public/)
- [VentureBeat：Meta unveils Muse Spark Open, the new top U.S. open weights model](https://venturebeat.com/technology/meta-unveils-muse-spark-open-the-new-top-u-s-open-weights-model-and-it-runs-on-two-paired-mac-desktops)
- [TechCrunch：Meta launches an open-weight AI model that runs on Macs](https://techcrunch.com/2026/10/15/meta-launches-an-open-weight-model-that-runs-on-macs/)
- [OpenRouter：Muse Spark Open API Pricing & Providers](https://openrouter.ai/meta/muse-spark-open)
- [quidproquo：模型卡｜Muse Spark 1.2（前代閉源版本）](/posts/daily/2026-08-24-model-meta-muse-spark-1-2)
