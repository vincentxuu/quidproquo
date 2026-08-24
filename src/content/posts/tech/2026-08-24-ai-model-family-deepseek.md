---
title: "DeepSeek——從 MoE 實驗室到 OpenRouter 用量第一的開源王者"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, deepseek, open-source, model-family-deepseek, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "DeepSeek 用 MLA + MoE 兩項架構創新把推論成本壓到業界最低，V4 Flash 以 13B 活躍參數跑出接近前端模型的品質，成為 OpenRouter 用量第一。這篇追蹤從 V1 到 V4 的演化、R1 推理線的分叉、以及每個版本該怎麼選。"
description: "DeepSeek 模型家族完整介紹：V1→V4 演化脈絡、MLA 與 DeepSeekMoE 架構創新、R1 推理線、V4 Pro vs Flash 選型指南、定價與 benchmark 數據"
series:
  name: "AI 模型家族"
  order: 1
draft: false
glossary:
  - term: "MLA"
    def: "Multi-head Latent Attention，DeepSeek 發明的注意力機制——把 KV cache 壓縮成低維度潛在向量，推論時記憶體用量減少 93%"
  - term: "KV cache"
    def: "推論時儲存已處理 token 的 Key-Value 向量的快取，是長序列推論的主要記憶體瓶頸"
  - term: "DSpark"
    def: "DeepSeek 的投機解碼模組，內建在 V4 模型中，加速推論"
---

2026 年 8 月，DeepSeek V4 Flash 以 11.6T tokens 的處理量穩坐 OpenRouter 用量第一；DeepSeek-R1 在 HuggingFace 拿下全站 text-generation 最高的 13,585 個 likes；所有模型全部 MIT 授權。這個從複製 Llama-2 起家的中國團隊，用兩年半的時間走出了一條獨特的技術路線——不拚最大規模，拚最聰明的架構。這篇追蹤 DeepSeek 從 V1 到 V4 的完整演化、R1 推理線的分叉、核心架構創新、以及每個版本該怎麼選。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第一篇家族深度介紹。

## 家族演化時間線

| 版本 | 發佈 | 總參數 | 活躍參數 | Context | 關鍵創新 |
|---|---|---|---|---|---|
| DeepSeek LLM 67B | 2024-01 | 67B | 67B (Dense) | 4K | Llama-2 架構複製起點 |
| DeepSeek-MoE | 2024-01 | 145B | 22B | 4K | 首次引入 fine-grained MoE |
| DeepSeek-V2 | 2024-05 | 236B | 21B | 128K | **MLA + DeepSeekMoE 確立** |
| DeepSeek-V3 | 2024-12 | 671B | 37B | 128K | 去輔助損失負載平衡、MTP、FP8 訓練 |
| DeepSeek-R1 | 2025-01 | 671B | 37B | 128K | 純 RL 推理、R1-Zero |
| DeepSeek-V3-0324 | 2025-03 | 671B | 37B | 128K | V3 更新版 |
| DeepSeek-R1-0528 | 2025-05 | 671B | 37B | 128K | R1 更新版 |
| DeepSeek-V3.2 | 2025-12 | 671B | 37B | 128K | Thinking/Chat 雙模式統一 |
| DeepSeek-V4 Flash | 2026-04 | 284B | 13B | 1M | CSA+HCA 混合注意力、1M 真實 context |
| DeepSeek-V4 Pro | 2026-04 | 1.6T | 49B | 1M | 旗艦級，MoE 6 experts/token |
| V4-Flash-0731 | 2026-07 | 284B | 13B | 1M | 重新 post-training，agentic 能力大幅提升 |
| V4-Pro-0813 | 2026-08 | 1.6T | 49B | 1M | GA 版本，SWE-bench Verified 96.4% |

兩年半、12 個里程碑。每一代都不只是「更大」，而是帶著明確的架構改進。V2 是轉折點——MLA 和 DeepSeekMoE 在那一代定型，之後的每一代都在這個基礎上疊加。

## 兩條主線：通用線 vs 推理線

DeepSeek 的模型分成兩條平行演進的主線：

**通用線**（V1 → V2 → V3 → V3.2 → V4）：針對一般對話、coding、工具呼叫做最佳化，核心目標是效率和成本。從 V2 開始確立 MLA + MoE 架構，V3 把訓練成本壓到 2.788M H800 GPU 小時（同級模型中最低），V4 把 context window 拉到 1M 並分出 Flash/Pro 雙版本。

**推理線**（R1 → R1-0528）：專攻長鏈思考。R1 的突破在 R1-Zero——這個模型完全用強化學習訓練，沒有任何 SFT 資料，卻自發展現出推理能力。這證明了推理可以單純從獎勵訊號中湧現。之後 DeepSeek 把推理能力蒸餾回 Qwen 和 Llama 架構的小模型，讓社群也能用小模型跑推理。

早期的 DeepSeek-Coder 是獨立的程式碼模型線，但從 V3 開始併入通用線——V3 本身的 coding 能力已經強到不需要分開訓練。類似的情況也發生在 DeepSeek-Math 和 Prover 系列，數學推理能力逐步整合進主線模型。

## 架構創新：為什麼 DeepSeek 這麼便宜

DeepSeek 的定價是業界最低（V4 Flash output $0.28/1M tokens，約 Claude Opus 的 1/90），但品質不差。這不是犧牲品質換價格，而是兩項架構創新帶來的結構性成本優勢。

### MLA：把記憶體瓶頸壓縮 93%

標準的多頭注意力（MHA）在推論時有一個痛點：每處理一個 token，就要把之前所有 token 的 Key 和 Value 向量存起來（KV cache）。128 個注意力頭、每個頭 128 維，一個 token 要存 32,768 個浮點數。當 context 拉長到數萬或數十萬 token 時，KV cache 佔的記憶體比模型本身還大。

MLA（Multi-head Latent Attention）的解法很直覺：既然每個頭的 K 和 V 之間有大量冗餘，那就壓縮它們。MLA 把所有頭的 K 和 V 壓進一個 512 維的「潛在向量」——相當於把 32,768 個數字壓成 512 個。推論時只存這個潛在向量，需要哪個頭的 K 或 V 再即時從潛在向量算出來。

效果：KV cache 減少 93.3%，記憶體讀取量減少 28 倍。代價是每次注意力計算的運算量增加約 4 倍——但注意力的瓶頸是記憶體頻寬而非運算量，所以這是淨贏。

這也是 DeepSeek 能提供 1M context 且價格不爆炸的原因。傳統架構下，1M context 的 KV cache 會吃掉數十 GB 記憶體；MLA 把它壓到可控範圍。

### DeepSeekMoE：671B 參數只啟用 37B

傳統的 Mixture of Experts 用 8 個大專家，每次選 1-2 個。DeepSeek 反過來做——把專家切得非常細：

- **V3**：1 個共享專家 + 256 個路由專家，每個 token 只啟用 8 個路由專家
- **V4 Pro**：規模更大，1.6T 總參數但只啟用 49B

細粒度專家分割的好處是「組合爆炸」——從 256 個專家中選 8 個的組合數遠大於從 8 個中選 2 個，模型能學到更精細的知識分工。

共享專家隔離則解決了另一個問題：路由專家之間容易有知識重複（每個專家都學「the」怎麼接下一個字）。把通用知識交給永遠啟用的共享專家，路由專家就能專心學專業知識。

V3 還引入了**去輔助損失的負載平衡**。傳統 MoE 用一個額外的損失函數懲罰不平衡的專家分配，但這個懲罰會干擾主要的訓練目標。DeepSeek 改用動態偏置（bias）——某個專家過載就降低它的偏置，空閒就提高，完全不影響主要損失函數。

### 工程層面的降本

架構創新之外，DeepSeek 在工程上也做了極致的最佳化：

- **FP8 訓練**：V3 全程用 FP8 精度訓練（混合 FP4 給專家層），記憶體和吞吐量雙贏
- **DualPipe**：把前向/反向計算和 MoE 的跨節點通訊重疊執行，減少 GPU 閒置
- **PTX 級 GPU 最佳化**：在比 CUDA 更底層的 PTX 指令級別手動調校 warp 排程

V3 的 671B 參數只用了 2.788M H800 GPU 小時完成訓練——這個數字在同級模型中低得驚人。對比之下，同期的其他 600B+ 模型通常需要十倍以上的算力。

## V4 Pro vs V4 Flash：怎麼選

V4 有兩個版本，選錯會浪費錢或犧牲品質。以下是截至 2026 年 8 月的完整比較：

| 項目 | V4 Flash 0731 | V4 Pro 0813 |
|---|---|---|
| 總參數 | 284B | 1.6T |
| 活躍參數 | 13B | 49B |
| Context | 1M | 1M |
| 定價 input ($/1M tokens) | $0.14 | $0.435（離峰）/ $1.32（尖峰）|
| 定價 output ($/1M tokens) | $0.28 | $0.87（離峰）/ $3.96（尖峰）|
| Cache hit input | $0.0028 | $0.003625 |
| [SWE-bench Verified](https://www.swebench.com) | 79% | 96.4%（[Vals AI](https://vals.ai) 獨立測試）|
| [LiveBench](https://livebench.ai) global | 74.17 | 77.44 |
| LiveBench agentic coding | 46.77 | 54.95 |
| Terminal-Bench 2.1 | 82.7 | — |
| SimpleQA-Verified | 34.1 | 57.9 |
| MRCR 1M（長 context 檢索）| 78.7 | 83.5 |
| 並行數限制 | 2,500 | 500 |
| 開源權重 | ✓（167GB，MIT）| ✓（893GB，MIT）|
| Vision | ✓（experimental）| ✗ |

### 怎麼選

- **如果你的場景是高吞吐量的分類、提取、摘要** → Flash。$0.14/1M input、2,500 並行、13B 活躍參數，成本和延遲都是最優選
- **如果你在做 coding agent 修 bug** → Pro。SWE-bench Verified 96.4% 幾乎追平 Claude Opus 5（97.0%），但 output 定價只有 Opus 的 1/28
- **如果你需要精準的事實回答** → Pro。SimpleQA-Verified 57.9 vs Flash 34.1（+24pp），BrowseComp 83.4 vs 73.2（+10pp）
- **如果你需要長文精準檢索** → Pro。MRCR 1M 83.5 vs 78.7
- **如果你要本地部署** → Flash。167GB MIT 授權，社群有 57+ 量化版本。Pro 的 893GB 在大多數硬體上不可行
- **如果你在做多步驟自主 Agent** → 注意 agentic 分數。Flash 的 LiveBench agentic coding 46.77、Pro 54.95，都落後 Claude Opus 5 的 65.20 約 10-20pp

一個反直覺的事實：V4 Flash 0731 的 post-training 更新讓它在所有 9 項 agentic benchmark 上反超了（舊版的）Pro preview。DeepSWE 從 7.3% 跳到 54.4%，架構完全沒變，只改了 post-training。這說明 post-training 的重要性可能不亞於 pre-training。Pro 0813 GA 版本縮小了部分差距，但 Flash 在多數 agentic 任務上仍然有競爭力。

## 子線與生態系

DeepSeek 除了主線之外，還有幾條值得注意的支線：

- **DeepSeek-Coder / Coder-V2**：早期的專用程式碼模型，從 V3 起併入通用線。如果你看到有人還在用 DeepSeek-Coder，它已經被 V4 取代
- **DeepSeek-Math / Prover**：數學推理專線，已演化到 V2 版本，專攻數學證明
- **DeepSeek-OCR**：獨立的視覺 OCR 模型，MIT 授權，HuggingFace 3,347 likes。不依賴 V4 架構
- **V4-Flash-Vision-Exp**：2026 年 8 月 21 日發佈的實驗性多模態模型，基於 Flash（不是 Pro），圖片以最多 384 tokens 編碼。標記為 experimental，不建議用於 production
- **R1 蒸餾版**：DeepSeek 把 R1 的推理能力蒸餾到 Qwen 和 Llama 架構的小模型上（1.5B 到 70B），讓社群可以在消費級硬體上跑推理模型。這可能是 R1 對開源生態影響最大的貢獻

## 跟競品的位置

把 V4 Pro 放到前端模型的座標系裡看：

| 指標 | DeepSeek V4 Pro 0813 | Claude Opus 5 | GPT-5.6 Sol |
|---|---|---|---|
| SWE-bench Verified | 96.4% | 97.0% | ~95% |
| LiveBench agentic coding | 54.95 | 65.20 | 56.21 |
| [HLE](https://www.lastexam.ai) w/ tools | 60.0% | 64.7% | — |
| Output 定價 ($/1M) | $0.87 | ~$25 | ~$30 |
| 開源 | ✓ MIT | ✗ | ✗ |

數字說的很清楚：DeepSeek 在 SWE-bench Verified 上距離 Claude Opus 5 只差 0.6pp，但 output 定價便宜 28 倍。然而在需要多步驟自主規劃的 agentic 任務上，差距擴大到 10pp 以上。

一篇 [Codersera 的分析](https://codersera.com/blog/deepseek-v4-pro-0813-guide-2026/)精準總結了這個定位：「V4 Pro 是 patch-fixing specialist，不是 autonomous agent。」如果你的 pipeline 是「給一個明確的 bug，修好它」，DeepSeek 幾乎跟 Claude 一樣強；如果你需要 agent 自己規劃多步驟、自己決定用什麼工具，Claude 和 GPT 仍然領先。

## 對 Agent 開發者的意義

- **如果你在做 coding agent 的 bug fix pipeline** → V4 Pro 的 SWE-bench 96.4% 幾乎追平 Claude Opus，成本只有 1/28。對「已知有 bug，修好它」這類明確任務，這是目前最好的價效比
- **如果你在做高吞吐量處理** → V4 Flash，$0.14/1M input，2,500 並行上限。分類、提取、摘要這些任務不需要旗艦級品質
- **如果你要自架模型** → V4 Flash 167GB MIT 授權，vLLM 和 SGLang 都支援，社群有 57+ 量化版。這是目前最實際的開源自架選項
- **如果你要 Agent 做多步驟自主任務** → DeepSeek 的 agentic 分數仍落後 Claude/GPT 約 10pp。考慮混用：用 DeepSeek 處理明確的子任務，用 Claude 做頂層編排
- **MLA 對架構選型的意義** → 1M context + 低價讓「全文塞進去取代 RAG」成為更多場景的可行策略。如果你的文件總量在 1M token 以內，直接塞進 context 可能比建 RAG pipeline 更簡單、更準

## 整體來說

DeepSeek 證明了一件事：前端模型的競爭力可以來自聰明的架構，而非單純的算力堆疊。MLA 和 DeepSeekMoE 不是權宜之計——它們是真正的技術創新，解決了推論成本的結構性問題。V4 Flash 的 post-training 故事（DeepSWE 從 7.3% 跳到 54.4%，架構完全不變）則說明 post-training 的重要性可能被低估了。

對 Agent 開發者來說：Flash 處理量、Pro 處理精度、agentic 任務跟 Claude/GPT 混用。這不是「選一個模型打天下」的時代——而是「每個任務選最適合的模型」的時代。

---

## 參考資料

- [DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434)
- [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437)
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948)
- [DeepSeek-V4 Technical Report (arXiv:2606.19348)](https://arxiv.org/abs/2606.19348)
- [Revisit DeepSeek Key Papers — 13 篇論文的完整技術脈絡](https://binghe2727.github.io/Revisit-DeepSeek-Key-Papers/)
- [The Inner Workings of MLA — Chris McCormick](https://mccormickml.com/2025/04/26/inner-workings-of-mla/)
- [The DeepSeek Series: A Technical Overview — Martin Fowler](https://martinfowler.com/articles/deepseek-papers.html)
- [A Review of DeepSeek Models' Key Innovative Techniques (arXiv:2503.11486)](https://arxiv.org/abs/2503.11486)
- [OpenRouter Rankings](https://openrouter.ai/rankings) — DeepSeek V4 Flash 用量第一（截至 2026-08-23）
- [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
- [DeepSeek V4-Pro 0813 GA: Benchmarks & Pricing — Codersera](https://codersera.com/blog/deepseek-v4-pro-0813-guide-2026/)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
