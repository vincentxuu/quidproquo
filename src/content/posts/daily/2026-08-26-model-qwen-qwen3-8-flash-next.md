---
title: "模型卡｜Qwen3.8-Flash-Next"
date: 2026-08-26
category: daily
tags: [ai-agent, model-release, daily, qwen, model-family-qwen]
lang: zh-TW
description: "阿里通義千問釋出 Qwen3.8-Flash-Next——Qwen4 架構首次公開預覽，125B 參數只活躍 6B，靠 QSA 稀疏注意力與 N-gram Embedding 把長 context agent 任務的推理成本壓到 Qwen3.7-Plus 的訓練成本九分之一"
tldr: "Qwen3.8-Flash-Next：Qwen4 架構開放權重預覽、125B 總參數僅活躍 6B（另加 51B N-gram embedding）、262K 原生 context 可擴展到 1M、Qwen Community License 1.0（非 Apache 2.0）、官方 benchmark 顯示 Agentic coding（DeepSWE 1.1）58.7 分超越自家 27B 稠密模型與 397B 的 Qwen3.7-Plus、CoWorkBench 長時序辦公任務 73.9 分為表列最高，但目前仍無正式 API 定價與第三方獨立測試"
series:
  name: "AI Model Tracker"
  order: 7
glossary:
  - term: "Qwen"
    def: "阿里巴巴通義千問（Tongyi Qianwen）開發的大型語言模型家族"
---

> 🌏 [English version](/en/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Qwen/Qwen3.8-Flash-Next` |
| 廠商 | 阿里巴巴（Alibaba，通義千問 Qwen 團隊） |
| 參數量 | 125B 總參數，6B 活躍參數；另有 51B N-gram embedding 參數與 4B MTP 層（BF16 權重合計約 180B） |
| Context Window | 262,144 tokens 原生，可擴展至 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | 尚無官方 API 定價（開放權重預覽版，暫無 Qwen Cloud 託管端點） |
| Output 定價 (USD/1M tokens) | 尚無官方 API 定價（同上；生產對應版本 Qwen3.8-Flash 官方列價約 $0.16 input／$0.47 output，但架構是否完全相同官方未說明） |
| 開源 | 是（Qwen Community License 1.0，非 Apache 2.0，非純量化衍生版另有各自條款） |
| 發布日 | 2026-08-26 |
| 官方公告 | [Qwen3.8-Flash-Next Model Card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) |
| HuggingFace | [Qwen/Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) |
| 家族 | Qwen4 架構預覽（技術路線圖，非現有 Qwen3.x 世代的直接衍生版） |

## 能力亮點

- 首次公開釋出 Qwen4 世代架構：以 Qwen Sparse Attention（QSA，在 micro-block 層級運作而非逐 token 選取）取代原本 Gated DeltaNet + Gated Attention 組合中的 Gated Attention，官方稱可顯著降低長 context 延遲
- 新增 Gated Residual 機制，用 per-branch 的 read/write gate 調節加寬後的殘差流，在不增加太多推理開銷下提升深層網路的表達力與訓練穩定性
- 引入 51B 參數的 N-gram Embedding（以 bigram/trigram 索引），把部分參數量擴張轉移到比 MoE 更省算力、更適合記憶體受限硬體 offload 的軸線上
- 官方稱訓練成本僅約 Qwen3.7-Plus 的九分之一，卻在多項 coding／agent benchmark 打平或超越 397B 參數的 Qwen3.7-Plus

## Benchmark 表現

| Benchmark | Qwen3.8-Flash-Next | Qwen3.8-27B（自家稠密模型） | Qwen3.7-Plus（前代，397B） | 競品最強（DeepSeek-V4-Flash-0731 / Claude-Opus-4.6） |
|---|---|---|---|---|
| Agentic coding（DeepSWE 1.1） | 58.7 | 42.2 | 16.5 | DeepSeek-V4-Flash-0731 54.4 |
| Agentic coding（SWE-bench Pro） | 62.5 | 61.7 | 55.8 | Claude-Opus-4.6 53.4 |
| 長時序辦公任務（CoWorkBench） | 73.9 | 70.7 | 65.1 | Claude-Opus-4.6 68.2 |
| 真實工具使用（Toolathlon Verified Pass@1） | 73.5 | 67.1 | 50.6 | DeepSeek-V4-Flash-0731 70.3 |
| 前緣 agent 任務（Agents' Last Exam Pass@1） | 24.3 | 20.4 | 13.2 | DeepSeek-V4-Flash-0731 25.2 |

⚠️ 以上皆為 Qwen 官方模型卡自測結果（部分項目採 Claude Code／mini-SWE-agent 等第三方 harness 評測，但仍由 Qwen 團隊執行與彙整），截至發文尚未見獨立第三方複現或標準化排行榜收錄。

## 與前代/競品比較

跟自家 397B 參數的 Qwen3.7-Plus 比，Qwen3.8-Flash-Next 只用 6B 活躍參數就在 DeepSWE 1.1（58.7 vs 16.5）、CoWorkBench（73.9 vs 65.1）等 agent 導向 benchmark 上大幅領先，這不是單純堆參數的結果，而是官方強調的「架構效率」路線：同樣的算力預算，用 QSA 稀疏注意力和 Gated Residual 換到更高的長 context 有效利用率。有趣的是它甚至在多數項目上贏過自家 27B 稠密模型 Qwen3.8-27B，顯示 MoE + 稀疏注意力的組合在 agent 任務上不只是省成本，還可能是實質的能力提升路線。

跟閉源前緣模型比，Toolathlon 真實工具使用（73.5 vs Claude-Opus-4.6 未列、DeepSeek-V4-Flash-0731 70.3）與 CoWorkBench（73.9 vs 68.2）都優於或接近表列對手，但 Agents' Last Exam 這類更前緣、更需要通用推理的任務上（24.3 vs DeepSeek 25.2）仍落後，說明架構效率的提升目前主要反映在「已知任務類型的執行力」，而非全面性推理能力的躍進。

定價策略目前是最大的不確定因素：Flash-Next 本身作為開放權重架構預覽，官方尚未公布 Qwen Cloud 託管定價；唯一有公開列價的是「生產對應版本」Qwen3.8-Flash（預設 1M context、內建工具），列在 ¥1/¥3 每百萬 tokens（約 $0.16/$0.47），但官方沒有說明兩者是否共用完全相同的架構與參數量，兩者不能直接劃上等號。

## 對 Agent 開發的意義

QSA 稀疏注意力搭配 Gated DeltaNet 的組合，目標明確是壓低長 context agent 工作負載的延遲與成本——這正是目前多數 agent 框架的痛點：context 越長，每一輪工具呼叫的延遲與費用都跟著疊加。N-gram Embedding 把部分知識容量搬到比 MoE 更省算力的軸線，理論上讓小型團隊也有機會在有限硬體上跑接近前緣的 agent 能力。

- 如果你在做長時序、多工具呼叫的 agent（例如 CoWorkBench 類型的辦公自動化任務）：Qwen3.8-Flash-Next 的官方分數目前是同量級模型裡最亮眼的，值得排進自架或私有部署的評測清單
- 如果你在做本地／私有化部署且對記憶體敏感：6B 活躍參數＋N-gram Embedding 的 offload 友善設計，理論上比同級稠密模型更容易塞進受限硬體，但要注意權重 BF16 總量仍達約 180B，實際部署仍需高階硬體或量化
- 不適合：需要立即穩定 API 服務的正式產品線——目前只有開放權重與社群端點，沒有官方 SLA，且官方自己都標注「這是實驗性架構預覽」，distinct from Qwen3.8-Flash 的正式服務版本

## 今日收穫

以前看到「Qwen4 架構預覽」這種說法容易當成行銷詞，但這次 Qwen 團隊把完整的架構細節（QSA、Gated Residual、N-gram Embedding 的具體參數配置）連同官方 benchmark 一次放出來，比起「先發預告、之後補文件」的常見做法更少見。這也提醒一個查證教訓：Flash-Next（開放權重架構預覽）跟 Qwen3.8-Flash（Qwen Cloud 託管的生產版本）名字很像但官方未確認架構完全相同，兩者的定價、SLA、甚至能力都不能互相套用，寫模型卡時必須把「同名不同物」的模型分開處理，不能因為名字像就假設規格相同。

## 參考資料

- [Qwen3.8-Flash-Next Model Card — Hugging Face](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Unite.AI：Qwen3.8-Flash-Next Previews Qwen4 Architecture With 6B Active Parameters](https://www.unite.ai/qwen3-8-flash-next-previews-qwen4-architecture-with-6b-active-parameters/)
- [Startup Fortune：Alibaba's Qwen3.8-Flash-Next Gives Builders An Early Look At Qwen4](https://startupfortune.com/alibabas-qwen38-flash-next-gives-builders-an-early-look-at-qwen4/)
- [byteiota：Qwen 3.8-Flash-Next: Inside the Qwen4 Architecture Preview](https://byteiota.com/qwen-38-flash-next-qwen4-architecture-preview/)
- [OrcaRouter：Qwen3.8-Flash-Next Is Out — Qwen4 Architecture Confirmed（含 Qwen3.8-Flash 生產版定價）](https://www.orcarouter.ai/blog/qwen-3-8-flash-next-leak)
- [Baekpica/Qwen3.8-Flash-Next-GGUF（確認 Qwen Community License 1.0 授權條款）](https://huggingface.co/Baekpica/Qwen3.8-Flash-Next-GGUF)
