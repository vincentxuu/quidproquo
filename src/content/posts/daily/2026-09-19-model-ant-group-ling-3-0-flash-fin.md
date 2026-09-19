---
title: "模型卡｜Ling-3.0-flash-Fin"
date: 2026-09-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, ant-group, model-family-ling, finance, moe]
lang: zh-TW
description: "蚂蚁百靈首款金融增強模型 Ling-3.0-flash-Fin，124B 總參數／5.1B 啟用，MIT 開源；聚焦投研、估值建模與財報分析，在 FinFIRST 等七個金融基準上測試，AA Intelligence Index 從 38 提升到 41"
tldr: "Ling-3.0-flash-Fin（Ant Group 蚂蚁百靈）：2026-09-09 外灘大會發佈，124B 總參數／5.1B 啟用，256K context（可擴至 1M），MIT 開源；沿用 Ling-3.0-flash 的 MoE 架構與長上下文能力，透過金融語料持續預訓練與領域後訓練強化財務能力，在 FinFIRST、FinSearchComp Verified、FinCRAFT、Finance Agent、APEX-Agents、SpreadsheetBench、τ³-Banking 七個金融基準上測試，AA Intelligence Index v4.1.1 從 38 提升至 41 分；模型權重已上線 Hugging Face 與 ModelScope，OpenRouter 提供一個月限免 API"
series:
  name: "AI Model Tracker"
  order: 25
glossary:
  - term: "Ling"
    def: "蚂蚁集團（Ant Group）旗下百靈大模型家族，包含通用與垂直領域版本，以 MoE 架構實現高效推理"
  - term: "FinFIRST"
    def: "蚂蚁集團聯合中金公司開發的金融評測基準，50+ 金融專業人士參與設計，從結果、過程與證據三層面評估答案準確性與可追溯性"
---

> 🌏 [English version](/en/posts/daily/2026-09-19-model-ant-group-ling-3-0-flash-fin-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Ling-3.0-flash-Fin` |
| 廠商 | Ant Group（蚂蚁集團），聯合中金公司與行業專家 |
| 參數量 | 124B 總參數，5.1B 啟用參數（per token） |
| Context Window | 256K tokens，可擴展至 1M tokens |
| 架構 | 原生混合推理 MoE，KDA + MLA 交替（5:1），MoE 專家激活比 1/64 |
| 開源 | 是，MIT License（權重已開源） |
| 發布日 | 2026-09-09（外灘大會 Inclusion·Conference on the Bund 宣布開源） |
| 權重位置 | [Hugging Face](https://huggingface.co/inclusionAI/Ling-3.0-flash-Fin) · [ModelScope](https://modelscope.ai/models/inclusionAI/Ling-3.0-flash-Fin) |
| API | [OpenRouter](https://openrouter.ai/inclusionai/ling-3.0-flash-fin:free)（限免一個月） · Vercel AI Gateway |
| 家族 | Ling 3.0 系列（Ling-3.0-flash、Ling-3.0-tiny、Ling-3.0-flash-Fin） |
| 基礎模型 | Ling-3.0-flash（124B / 5.1B，2026-07-27 發佈） |
| 授權 | MIT |

## 能力亮點

- **金融領域專業增強**：在 Ling-3.0-flash 基礎上透過金融語料持續預訓練與領域後訓練強化，針對年報、財務工作簿、多份研究材料等複雜金融內容進行優化，同時兼顧部署效率
- **端到端投研流程**：串聯資訊檢索 → 證據審核 → 計算建模 → 報告撰寫，不是把各環節當成孤立任務
- **來源可追溯的金融檢索**：優先定位官方、一手及高可信資料，開源評測基準 [FinFIRST](https://huggingface.co/datasets/inclusionAI/FinFIRST) 與模型同步釋出
- **多文件財務推理**：能協調不同報告期間、定義、假設與衝突數據（年報、財報、監管文件、研究材料）
- **估值與試算表工作流**：理解 Excel 公式、實際 vs 預估更新、跨表依賴、平衡檢查、情境分析，輸出可編輯的財務模型
- **AA Intelligence Index v4.1.1**：從通用版的 38 分提升至 **41 分**，顯示金融增強未犧牲通用能力

## Benchmark 表現

Ling-3.0-flash-Fin 在以下金融智慧體基準上進行了測試（官方未公布具體分數曲線，定位為「與同等尺寸模型及更大尺寸通用模型相比具有競爭力」）：

| 基準 | 測試面向 |
|---|---|
| **FinFIRST** | 來源導向檢索（50+ 金融專業人士設計，結果／過程／證據三層評估） |
| **FinSearchComp Verified** | 金融搜索驗證 |
| **FinCRAFT** | 金融任務執行 |
| **Finance Agent** | 金融 Agent 工作流 |
| **APEX-Agents** | 金融 Agent 評測 |
| **SpreadsheetBench** | 試算表操作與估值建模 |
| **τ³-Banking** | 銀行業務應用 |

⚠️ 官方僅定性描述「在多項金融基準上展現較强競爭力」，未公佈完整量化分數表。FinFIRST 將於近期開源，為金融搜索領域提供透明基準。模型在 AA Intelligence Index v4.1.1 的 41 分為目前唯一公開的量化指標。

## 與 Ling 3.0 系列比較

| 項目 | Ling-3.0-tiny | Ling-3.0-flash | Ling-3.0-flash-Fin |
|---|---|---|---|
| 總參數 | 7.9B | 124B | 124B |
| 激活參數 | 1.3B | 5.1B | 5.1B |
| 定位 | 純本地離線任務 | 生產級 Agent 執行節點 | 金融增強 Agent |
| Context | 未公開 | 256K → 1M | 256K → 1M |
| 開源 | 是 | 是 | 是（MIT） |
| 特色 | 資源敏感部署 | 混合推理、1/64 稀疏 MoE | 金融領域微調 |

與基礎版 Ling-3.0-flash 相比，flash-Fin 共享同一架構與上下文能力，主要差異在金融領域適配——適合需要專業財務知識的場景；純通用任務則仍以 Ling-3.0-flash 為主。

## 架構細節

Ling-3.0-flash-Fin 沿用 Ling-3.0-flash 的核心架構：

- **原生混合線性注意力**：KDA（Kimi Delta Attention）與 MLA 層以 5:1 比例交替，KDA 從 Lightning Attention 升級，引入細粒度對角門控（diagonal gating），在處理長文檔與大量程式碼時更精確地保留關鍵資訊
- **1/64 稀疏 MoE**：專家激活比例從上一代的 1/32 壓縮至 1/64，顯著提升「效率槓桿」
- **256K → 1M context**：原生支援 256K，可無縫擴展至 1M tokens
- **TTFT 優化**：集群層級分層快取（SGLang HiCache + Mooncake），長輸入場景下 Time-to-First-Token 減少 60%–80%

## 對 Agent 開發的意義

如果你在做金融研究、投資分析、財報解讀或估值建模相關的 Agent：Ling-3.0-flash-Fin 目前是最適合的開源選擇之一——MIT 授權意味著可以自架部署，124B/5.1B 的配置在消費級硬體上也有可能運行（參考同系列的 Edge0 框架在 Mac mini M4 Pro 上跑 35B MoE 僅需 2.9 GiB），加上 OpenRouter 的限免 API 方便快速驗證。

如果你在做一般性的 Agent 任務（coding、搜尋、一般推理）：Ling-3.0-flash 或 Ling-3.0-tiny 可能更適合，flash-Fin 的金融領域微調帶來的優勢在非金融場景中不會體現。

不適合：需要 100% 確定性的生產金融決策——官方明確聲明「關鍵假設、估值結果與投資結論需要專業審閱，不構成投資建議」，且作為首個金融增強版本，在複雜長程工作流中仍需進一步驗證。

## 今日收穫

這篇值得記下來的是「金融增強模型」這個範疇的首次開源嘗試——大多數廠商的做法是把通用模型掛上金融 API 收費，而 Ant Group 直接把整個模型權重（MIT）加上專屬評測基準（FinFIRST）一起打開。這與 Ling 3.0 系列的「規劃-執行分離」哲學一脈相承：Ling-3.0-flash 負責高速執行，flash-Fin 在此基礎上疊加領域深度。後續觀察重點是 FinFIRST 开源後能否成為金融 AI 領域的事實標準。

## 參考資料

- [Ant Group 官方公告：Open-Sources Ling-3.0-flash-Fin for Real-World Financial Workflows](https://www.antgroup.com/en/news-media/press-releases/1788944400000)
- [Hugging Face：inclusionAI/Ling-3.0-flash-Fin](https://huggingface.co/inclusionAI/Ling-3.0-flash-Fin)
- [ModelScope：Ling-3.0-flash-Fin](https://modelscope.ai/models/inclusionAI/Ling-3.0-flash-Fin)
- [BusinessWire：Ant Group Unveils Ling-3.0-Flash Delivering Top-Tier Performance at a Fraction of the Parameter Scale（2026-07-27）](https://www.businesswire.com/news/home/20260726584441/en/)
- [FinFIRST（Hugging Face Dataset）](https://huggingface.co/datasets/inclusionAI/FinFIRST)
- [OpenRouter：Ling-3.0-flash-Fin:free](https://openrouter.ai/inclusionai/ling-3.0-flash-fin:free)
- [developer.ant-ling.com：Ling-3.0-flash 發佈公告（繁中）](https://developer.ant-ling.com/zh-CN/blogs/ling-3.0-flash-release)
- [IT之家：蚂蚁百灵推出金融增强模型 Ling-3.0-flash-Fin（繁中）](https://www.ithome.com/0/995/464.htm)
