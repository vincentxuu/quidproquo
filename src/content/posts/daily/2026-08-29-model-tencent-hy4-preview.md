---
title: "模型卡｜Tencent Hy4 Preview"
date: 2026-08-29
category: daily
tags: [ai-agent, model-release, daily, tencent, model-family-hunyuan]
lang: zh-TW
description: "騰訊混元開源 Hy4 preview——770B 總參數／49B 活躍的 MoE 旗艦，1M context，首度讓模型參與自己的訓練與推理優化，端到端吞吐量因此提升 31.8%"
tldr: "Tencent Hy4 preview：770B 總參數／49B 活躍參數（MoE，78 層），Context Window 1,048,576 tokens；API 定價 input $0.834／output $2.501（每 100 萬 tokens，cache hit $0.042）；Apache 2.0 開源權重已上 HuggingFace；163 位工程師盲測 2.99/4.00 些微領先 GLM-5.3（2.92）與 Kimi K3（2.94）；第三方 BenchLM 綜合評分 79.2/100，全站排名第 7（228 個模型中）；官方首度揭露模型參與自己的訓練優化與推理系統調校，吞吐量提升 31.8%"
series:
  name: "AI Model Tracker"
  order: 9
glossary:
  - term: "Hunyuan（混元）"
    def: "騰訊開發的大型語言模型家族，Hy 系列（如 Hy3、Hy4）是其最新一代開源旗艦模型代號"
---

> 🌏 [English version](/en/posts/daily/2026-08-29-model-tencent-hy4-preview-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `tencent/Hy4-preview`（部署別名 `hy4-preview`） |
| 廠商 | Tencent（騰訊混元 Hunyuan） |
| 參數量 | 770B 總參數，49B 活躍參數（MoE，78 層；另有 10B 總參數／0.7B 活躍的原生 MTP 層做投機解碼） |
| Context Window | 1,048,576 tokens（1M） |
| Input 定價 (USD/1M tokens) | $0.834 |
| Output 定價 (USD/1M tokens) | $2.501（cache hit $0.042） |
| 開源 | 是（Apache License 2.0，另提供 FP8 量化版 `Hy4-preview-FP8`） |
| 發布日 | 2026-08-28 |
| 官方公告 | [Tencent 官方新聞稿](https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/) |
| HuggingFace | [tencent/Hy4-preview](https://huggingface.co/tencent/Hy4-preview) |
| 家族 | Tencent Hunyuan Hy 系列（Hy3 preview → Hy4 preview） |

## 能力亮點

- 架構融合 DeepSeek 與 GLM 兩家思路：注意力模組採 Gated DeepSeek Sparse Attention（Gated DSA）搭配 IndexCache 做跨層稀疏索引重用，殘差路徑用 iHC（identity Hyper-Connections）擴大層間資訊流動
- 內部盲測小幅領先兩大開源對手：163 位工程師針對 203 個工程任務評分，Hy4 preview 平均 2.99/4.00，些微領先 GLM-5.3（2.92）與 Kimi K3（2.94）
- 首次讓模型參與自己的開發流程：Hy4 preview 參與訓練方法、資料策略、評估框架與底層算子的自動化優化實驗，形成早期的遞歸自我改進迴圈
- 模型自主分析並優化了自己的推理系統（算子融合、通訊優化），端到端吞吐量比基準提升 31.8%，在不同 context 長度與併發下都有一致增益

## Benchmark 表現

| Benchmark | Hy4 preview | 前代（Hy3 preview） | 競品參考 |
|---|---|---|---|
| SWE-bench Pro | 65.7% | — | Claude Mythos 5：80.3%（BenchLM 收錄最高分） |
| Terminal-Bench 2.1 | 85.4% | 54.4%（Terminal-Bench 2.0，版本不同不宜直接比較） | GLM-5.3：88.2% |
| SWE-bench Multilingual | 82.9% | — | Claude Opus 5：89.5% |
| GPQA Diamond | 92.3% | — | Sakana Fugu-Ultra：95.5% |
| HLE（Humanity's Last Exam） | 55.4% | — | Claude Opus 5：64.7% |

⚠️ 上列分數出自 Tencent 官方 Hy4-preview 模型卡的 Benchmark Appendix，屬官方自測；「競品參考」欄與 BenchLM 綜合評分（79.2/100，Agentic 類第 9／140、94th percentile，Coding 類第 11／146、93rd percentile）為第三方聚合平台數據，尚待更多獨立複現。Hy3 preview 的官方自測另有 SWE-bench Verified 74.4%、BrowseComp 67.1%，但 Hy4 preview 官方公開的是 SWE-bench Pro／Multilingual 兩個不同子集，兩代之間除 Terminal-Bench 外多數指標無法直接對齊。

## 與前代/競品比較

跟 Hy3 preview（295B 總參數／21B 活躍、256K context）比，Hy4 preview 在模型規模（770B/49B）、context window（1M，擴大 4 倍）與訓練資料量三個面向同時擴大，官方稱這是「量測到的世代間最大進步」。更值得注意的是流程本身的變化：Hy3 preview 是純粹的訓練成果，Hy4 preview 則首次把「模型自己」放進訓練與推理優化的迴圈裡，官方將 31.8% 的推理吞吐量提升直接歸功於模型自主找到並修復的算子瓶頸。

跟同期開源旗艦比，內部盲測 2.99 分只比 GLM-5.3（2.92）與 Kimi K3（2.94）高一點點，差距在誤差範圍內；BenchLM 的第三方綜合排名把 Hy4 preview 放在 Agentic 與 Coding 兩類的前 10% 左右（94th／93rd percentile），屬於開源第一梯隊但未全面登頂——例如 GPQA Diamond 的 92.3% 仍落後 Sakana Fugu-Ultra 的 95.5%。定價 input $0.834／output $2.501 介於同期 GLM-5.3 旗艦（$1.40/$4.40）與其開源分支 GLM-5.3-Flash（$0.15/$0.50）之間，走的是「規模與能力優先、價格中等」的路線，而非像 GLM-5.3-Flash 那樣主打極致性價比。

## 對 Agent 開發的意義

1M context 搭配 Gated DSA 稀疏注意力，理論上可以把完整中大型程式碼庫或長 agent session 直接塞進單次呼叫，減少 chunking 與檢索帶來的資訊斷裂；SWE-bench Pro／Multilingual 兩項分數顯示這個組合在實際軟體工程任務上有一定水準，但還沒到接近前緣閉源模型的程度。

- 如果你在做長時序 coding agent（大型 repo 理解、跨檔案重構、多語言程式碼庫）：Hy4 preview 的 1M context 與 Apache 2.0 開源權重值得排進評測清單，尤其是需要自架部署、不想受限於單一 API 廠商的團隊
- 如果你在做辦公自動化或跨文件分析型 agent：官方特別強調文件／試算表／簡報產出與財務分析場景的改善，屬於針對性優化，可對照自己的實際工作流測試
- 不適合：官方自己在 Known Limitations 裡承認的「過度推理」與「過度驗證自身結果」問題會拉長延遲，加上這是標示為 preview 的早期版本，官方明白表示還有很大改進空間——需要低延遲即時回應，或已上生產環境穩定性要求高的場景，宜先觀察後續正式版

## 今日收穫

Hy4 preview 官方揭露的「模型參與自己訓練與推理優化」流程，比起單純的 benchmark 分數更值得留意：不只是自動化建議訓練方法與評估框架，還包含模型自主分析推理系統瓶頸、做算子融合與通訊優化，並且量化出 31.8% 的吞吐量提升。這代表「AI 協助訓練下一代 AI」正在從論文裡的概念驗證，變成大廠實際生產流程的一部分——而且第一個公開講出具體數字的不是矽谷大廠，是騰訊。

## 參考資料

- [Tencent 官方新聞稿：Tencent Releases and Open-Sources Tencent Hy4 preview](https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/)
- [HuggingFace 模型卡：tencent/Hy4-preview](https://huggingface.co/tencent/Hy4-preview)
- [GitHub：Tencent-Hunyuan/Hy4-preview](https://github.com/Tencent-Hunyuan/Hy4-preview)
- [TechNode：Tencent open-sources Hy4 preview with 770B parameters and a 1M-token context](https://technode.com/2026/08/28/tencent-open-sources-hy4-preview-with-770b-parameters-and-a-1m-token-context/)
- [BenchLM.ai：Hy4 preview Benchmarks & Context](https://benchlm.ai/models/hy4-preview)
- [HuggingFace 模型卡：tencent/Hy3-preview（前代對照）](https://huggingface.co/tencent/Hy3-preview)
- [Toolworthy：Tencent Hy3 / Hy4 Preview Review（SWE-bench Verified、Terminal-Bench 2.0 前代分數來源）](https://www.toolworthy.ai/tool/tencent-hy)
