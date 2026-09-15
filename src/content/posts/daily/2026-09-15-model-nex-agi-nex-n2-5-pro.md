---
title: "模型卡｜Nex-N2.5-Pro"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, model-release, daily, nex-agi, model-family-nex]
lang: zh-TW
description: "Nex AGI 全開源 Nex-N2.5 家族的中量級成員 Nex-N2.5-Pro：沿用 397B（A17B）MoE 規格，OSWorld-G 定位分數 87.4 分超車 Claude Opus 5 與 GPT-5.6 Sol，單一 8×H100 節點即可部署"
tldr: "Nex-N2.5-Pro（HuggingFace：nex-agi/Nex-N2.5-Pro）：沿用前代 Nex-N2-Pro 的 397B 總參數 MoE（約 17B 啟用，建於 Qwen3.5-397B-A17B）架構，262,144 tokens context、236K 最大輸出，Apache-2.0 開源，單一 8×H100 節點可跑；OpenRouter 免費層 Input/Output 皆 $0.00；Terminal-Bench 2.1 從前代 N2-Pro 的 75.3 分進步到 82.7 分（+7.4pp），OSWorld-G 電腦操作定位分數 87.4 分是官方對照表中最高，贏過 Claude Opus 5 的 76.8 分；跟同家族 mini 版一樣主打「視覺回饋自我修正」的長時程 agent 迴圈"
series:
  name: "AI Model Tracker"
  order: 114
glossary:
  - term: "Nex-N2.5"
    def: "Nex AGI 開發的開源 agentic 模型家族，分 mini／Pro／Max 三個量級，主打長時程任務中的電腦操作、瀏覽器操作與視覺回饋自我修正能力"
---

> 🌏 [English version](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `nex-agi/Nex-N2.5-Pro`（HuggingFace）；OpenRouter 免費層 `nex-agi/nex-n2.5-pro:free` |
| 廠商 | Nex AGI |
| 參數量 | 官方 N2.5-Pro model card 未重新公布數字；沿用前代 Nex-N2-Pro 的 397B 總參數（約 17B 啟用）MoE，建於 `Qwen3.5-397B-A17B`（官方稱 N2.5-mini／Pro 延續 Nex-N2 的多模態基礎後訓練而成） |
| Context Window | 262,144 tokens（最大輸出約 236K tokens） |
| Input 定價 (USD/1M tokens) | $0.00（OpenRouter 免費層；官方尚未公布正式商用 API 定價） |
| Output 定價 (USD/1M tokens) | $0.00（OpenRouter 免費層；官方尚未公布正式商用 API 定價） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-09-08 |
| 官方公告 | [Nex-N2.5 — Vision into Action](https://nex-agi.com/) |
| HuggingFace | [nex-agi/Nex-N2.5-Pro](https://huggingface.co/nex-agi/Nex-N2.5-Pro) |
| 家族 | Nex-N2.5（mini／Pro／Max 三個量級，Max 為 1.6T 參數純文字 MoE，首次完成兆參數規模的完整後訓練） |

## 能力亮點

- Terminal-Bench 2.1（Pass@1）從前代 Nex-N2-Pro 的 75.3 分進步到 82.7 分（+7.4pp），SWE-Bench Pro 從 58.8 分進步到 61.2 分
- OSWorld-G（電腦操作定位）拿下 87.4 分，是官方對照表中所有列出模型裡最高的一個，贏過 Claude Opus 5 的 76.8 分與 GPT-5.6 Sol 的 77.7 分
- 跟 mini 版共用「視覺回饋自我修正」的設計：可操作電腦與瀏覽器、執行並測試程式，發現結果不符預期時能自行診斷、修正並重跑，而不是一次性給答案
- 硬體部署門檻比同家族 Max 版低很多：單一 8×H100 節點即可服務，不需要 Max 版要求的 2 節點、16×H200 叢集

## Benchmark 表現

| Benchmark | 分數 | 前代 (Nex-N2-Pro) | 競品最強 |
|---|---|---|---|
| Terminal-Bench 2.1 (Pass@1) | 82.7 | 75.3 | Claude Opus 5：89.1 |
| SWE-Bench Pro | 61.2 | 58.8 | Claude Opus 5：79.2 |
| BrowseComp | 89.7 | 83.7 | Claude Opus 5：90.8 |
| OSWorld-G（電腦操作定位） | 87.4 | N/A（前代未列入此項評測） | Qwen3.8-Max：84.9（本表次高） |
| DeepSWE（v1.1） | 55.8 | 33.6（舊版 DeepSWE，非 v1.1） | Claude Opus 5：73.7 |

⚠️ 以上為 Nex AGI 官方以自家 NexAU／NexCUA harness 自測（`temperature=0.7`、`top_p=0.95`、`top_k=40`），發布當日數據，尚無獨立第三方複現。前代 Nex-N2-Pro 分數取自官方 GitHub（`nex-agi/Nex-N2`），DeepSWE 新舊版本評測基準可能不完全一致，僅供級距參考。

## 與前代/競品比較

跟前代 Nex-N2-Pro 比，這次進步最明顯的是 coding 與 agentic 兩個面向同步提升：Terminal-Bench 2.1 拉了 7.4pp，BrowseComp 拉了 6.0pp，而不是單一 benchmark 的個案突破。值得注意的是官方沒有重新公布參數規模，也沒有提到換了新的基座模型——這代表這次的進步主要來自後訓練資料與方法的改良，而不是把模型做大。

跟閉源旗艦比，Nex-N2.5-Pro 在大多數 coding 與 agentic benchmark 上仍落後 Claude Opus 5（SWE-Bench Pro 61.2 vs 79.2、Terminal-Bench 82.7 vs 89.1），但在 OSWorld-G 這個電腦操作定位任務上反而超車所有列出的競品，包含 Claude Opus 5 與 GPT-5.6 Sol。這跟 mini 版的模式一致：Nex AGI 把訓練資源集中在「視覺 grounding + 自我修正」這個特定能力面，而非全面對齊頂尖閉源模型的每一項分數。

定價策略上，Nex-N2.5-Pro 跟 mini 版一樣走「全開源 + OpenRouter 免費層」路線，跟需要付費 API key 才能測試的 Claude Opus 5、GPT-5.6 Sol 形成對比。差別在於 Pro 版的部署門檻明顯更高——需要單一 8×H100 節點，而不是 mini 版的 2×H100，這代表免費層更像是「先讓開發者試用」的入口，真正想自架部署仍需要一定規模的硬體投入。

## 對 Agent 開發的意義

Nex-N2.5-Pro 補上了 mini 版與 Max 版之間的中間選項：比 mini（35B-A3B）能力更完整，又不需要 Max 版的多節點叢集，用一台 8×H100 機器就能跑一個在電腦操作定位上超越多數閉源旗艦的 agent 骨幹模型。

- 如果你在做需要較高精確度的 computer-use 或 browser-use agent：OSWorld-G 87.4 分是目前官方對照表中的最高分，且比 mini 版的 82.9 分再進一步，適合對操作定位精確度要求較高、但還沒到需要 Max 版文字推理能力的場景
- 如果你的團隊有能力自架單機 8×H100，又不想被綁定在單一閉源 API：Apache-2.0 開源加上跟前代一脈相承的部署腳本（sglang fork），可以直接沿用既有的 Nex-N2 部署經驗升級
- 不適合：需要頂尖 coding 精確度的正式生產環境（SWE-Bench Pro 61.2 分仍落後 Claude Opus 5 近 18pp），或需要正式商用 SLA 與明確定價保證的場景——官方目前僅公布 OpenRouter 免費層，尚未有獨立的商用 API 定價

## 今日收穫

Nex-N2.5-Pro 這次沒有重新公布參數規模，也沒有換基座模型，卻在 Terminal-Bench、BrowseComp 這些 benchmark 上有兩位數百分點級的進步——這提醒我看模型卡不能只看「有沒有變大」，後訓練方法與資料策略本身就能撐起這麼大的進步空間，尤其在 agentic 這種高度依賴訓練環境覆蓋率的能力面上更明顯。

## 參考資料

- [Nex-N2.5 — Vision into Action（官方網站）](https://nex-agi.com/)
- [HuggingFace model card: nex-agi/Nex-N2.5-Pro](https://huggingface.co/nex-agi/Nex-N2.5-Pro)
- [Nex-N2.5-Pro (free) — API Pricing & Providers | OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-pro:free)
- [Nex-N2.5-Pro - API, Specs, Playground & Pricing | Puter Developer](https://developer.puter.com/ai/nex-agi/nex-n2.5-pro/)
- [GitHub: nex-agi/Nex-N2（前代 Nex-N2 家族 benchmark 與基座模型規格）](https://github.com/nex-agi/Nex-N2)
- [Nex-N2.5: Nex-AGI's Mini, Pro, and Trillion-Param Max Agentic Models | MindStudio](https://www.mindstudio.ai/blog/nex-n2-5-agentic-model-family)
