---
title: "模型卡｜Nex-N2.5-mini"
date: 2026-09-11
category: daily
type: digest
tags: [ai-agent, model-release, daily, nex-agi, model-family-nex]
lang: zh-TW
description: "Nex AGI 全開源釋出 Nex-N2.5 家族，35B（A3B）的 mini 版主打「視覺回饋自我修正」的電腦操作 agent，DeepSWE 分數比前代 N2-mini 暴衝 4.5 倍，還能在 OpenRouter 掛免費層"
tldr: "Nex-N2.5-mini（HuggingFace：nex-agi/Nex-N2.5-mini）：35B 總參數 MoE（約 3B 啟用，基於 Qwen3.5-35B-A3B-Base 後訓練），262,144 tokens context、235.9K 最大輸出，Apache-2.0 開源；OpenRouter 免費層 Input/Output 皆 $0.00；DeepSWE v1.1 從前代 N2-mini 的 8.0 分跳到 36.1 分（+28.1pp），Terminal-Bench 2.1 從 60.7 到 73.4；核心賣點是「視覺回饋自我修正」的電腦操作與長時程 agent 迴圈，OSWorld-G 82.9 分"
series:
  name: "AI Model Tracker"
  order: 20
glossary:
  - term: "Nex-N2.5"
    def: "Nex AGI 開發的開源 agentic 模型家族，分 mini／Pro／Max 三個量級，主打長時程任務中的電腦操作、瀏覽器操作與視覺回饋自我修正能力"
---

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `nex-agi/Nex-N2.5-mini`（HuggingFace）；OpenRouter 免費層 `nex-agi/nex-n2.5-mini:free` |
| 廠商 | Nex AGI |
| 參數量 | 35B 總參數（A3B，約 3B 啟用），MoE，基於 Qwen3.5-35B-A3B-Base 後訓練 |
| Context Window | 262,144 tokens（最大輸出 235.9K tokens） |
| Input 定價 (USD/1M tokens) | $0.00（OpenRouter 免費層；官方尚未公布正式商用 API 定價） |
| Output 定價 (USD/1M tokens) | $0.00（OpenRouter 免費層；官方尚未公布正式商用 API 定價） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-09-08 |
| 官方公告 | [Nex-N2.5 — Vision into Action](https://nex-agi.com/) |
| HuggingFace | [nex-agi/Nex-N2.5-mini](https://huggingface.co/nex-agi/Nex-N2.5-mini) |
| 家族 | Nex-N2.5（mini／Pro／Max 三個量級，Max 為 1.6T 參數純文字 MoE，首次完成兆參數規模的完整後訓練） |

## 能力亮點

- DeepSWE v1.1 從前代 Nex-N2-mini 的 8.0 分躍升到 36.1 分，幾乎是 4.5 倍；Terminal-Bench 2.1 從 60.7 分進步到 73.4 分（+12.7pp）
- 核心設計是「視覺回饋自我修正」：模型能操作電腦與瀏覽器、執行並測試程式，觀察到結果與預期不符時可自行診斷、修正並重測，而不是一次性作答
- OSWorld-G（電腦操作定位）82.9 分，優於 Claude Opus 5 的 76.8 分與 GPT-5.6 Sol 的 77.7 分
- 全家族（mini／Pro／Max）皆以 Apache-2.0 開源釋出，mini 版同時在 OpenRouter 提供免費層，降低了社群測試 agentic 工作流的門檻

## Benchmark 表現

| Benchmark | 分數 | 前代 (Nex-N2-mini) | 競品最強 |
|---|---|---|---|
| Terminal-Bench 2.1 (Pass@1) | 73.4 | 60.7 | Claude Opus 5：89.1 |
| DeepSWE v1.1 (Resolved) | 36.1 | 8.0 | Claude Opus 5：73.7 |
| BrowseComp | 83.4 | 74.1 | Claude Opus 5：90.8 |
| AutomationBench v1.0.6 (Pass@1) | 32.3 | N/A（前代未列入此版本評測） | Claude Opus 5：50.3 |
| SWE-Bench Pro | 43.8 | N/A（前代未公布對應分數） | Claude Opus 5：79.2 |

⚠️ 以上為 Nex AGI 官方以自家 NexAU／NexCUA harness 自測（`temperature=0.7`、`top_p=0.95`、`top_k=40`），發布當日數據，尚無獨立第三方複現。前代 Nex-N2-mini 的 DeepSWE、Terminal-Bench、BrowseComp 分數取自官方 GitHub 與第三方評測站，評測版本可能與本表不完全一致，僅供級距參考。

## 與前代/競品比較

跟 Nex-N2-mini 比，這次進步最大的是複雜軟體工程任務：DeepSWE v1.1 從 8.0 分跳到 36.1 分，代表多檔案重構、架構決策這類需要長時間規劃的任務，成功率有結構性提升，而不只是小幅調參。Terminal-Bench 與 BrowseComp 也都有兩位數百分點的進步，說明整個 agentic 能力面是同步升級，而非單一 benchmark 的個案突破。

跟閉源旗艦比，Nex-N2.5-mini 作為 35B（A3B）小模型，在多數 benchmark 上仍明顯落後 Claude Opus 5、GPT-5.6 Sol 等百億啟用參數以上的模型（SWE-Bench Pro 43.8 vs Opus 5 的 79.2），但在 OSWorld-G 這類電腦操作定位任務上反而超車，顯示 Nex AGI 把訓練資源集中在「視覺 grounding＋自我修正」這個特定能力面，而非追求全面對齊頂尖閉源模型。

定價策略上，Nex-N2.5 全系列開源，mini 版還額外掛上 OpenRouter 免費層——跟需要付費 API key 才能測試的 Claude Opus 5、GPT-5.6 Sol 形成明顯對比，這是主打「先讓開發者免費試」的打法，而不是靠 benchmark 數字硬打價格戰。

## 對 Agent 開發的意義

Nex-N2.5-mini 的定位很明確：不是通用聊天模型，是給「需要操作電腦、瀏覽器，並透過畫面回饋自我修正」的長時程 agent 用的骨幹模型，35B（A3B）的規模讓它可以在單機 2×H100 這種可控硬體上部署，不需要大規模叢集。

- 如果你在做 computer-use 或 browser-use agent 的原型：OSWorld-G 82.9 分優於多數閉源競品，加上 OpenRouter 免費層可以直接接入測試，很適合驗證「視覺回饋自我修正」這類迴圈設計是否可行，不必一開始就綁定付費 API
- 如果你在做需要自架部署、且對硬體規模有限制的 agent 服務：35B（A3B）在 2×H100 上就能跑，比起需要更大叢集的 Pro／Max 版本或閉源旗艦，是成本與部署門檻都更低的選擇
- 不適合：需要高精確度的正式生產環境 coding agent（SWE-Bench Pro 只有 43.8 分，遠落後同家族 Max 版的 65.7 分與 Claude Opus 5 的 79.2 分），或需要正式商用 SLA 與明確定價保證的場景——目前官方尚未公布獨立於 OpenRouter 免費層之外的商用 API 定價

## 今日收穫

以前預設「免費層」的模型多半是閹割版，主要用途是行銷噱頭。Nex-N2.5-mini 打破了這個預設——同一個 mini 版本，DeepSWE 分數比前代暴衝 4.5 倍，還能掛在 OpenRouter 免費層讓人直接試用。這說明「免費」與「能力升級」並不互斥，尤其對還在驗證 agent 架構可行性、還沒到大規模商用階段的團隊，這種全開源＋免費層的組合反而比付費閉源模型更適合拿來做早期原型測試。

## 參考資料

- [Nex-N2.5 — Vision into Action（官方網站）](https://nex-agi.com/)
- [HuggingFace model card: nex-agi/Nex-N2.5-mini](https://huggingface.co/nex-agi/Nex-N2.5-mini)
- [Nex-N2.5-Mini (free) — API Pricing & Providers | OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-mini:free)
- [Nex-N2.5-Mini (free) by Nex AGI | Krater](https://krater.ai/models/nex-n2-5-mini-free)
- [GitHub: nex-agi/Nex-N2（前代 Nex-N2 家族 benchmark）](https://github.com/nex-agi/Nex-N2)
- [Nex-N2-mini: A 35B Model Built for Autonomous Agents — HackerNoon](https://hackernoon.com/nex-n2-mini-a-35b-model-built-for-autonomous-agents)
