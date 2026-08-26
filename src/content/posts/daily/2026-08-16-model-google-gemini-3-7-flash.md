---
title: "模型卡｜Gemini 3.7 Flash"
date: 2026-08-16
category: daily
tags: [ai-agent, model-release, daily, google]
lang: zh-TW
description: "Google 發佈 Gemini 3.7 Flash——沿用 3.6 Flash 定價，DeepSWE v1.1 從 48.6% 衝上 65.3%，主打企業級 agentic coding 與長流程自動化"
tldr: "Gemini 3.7 Flash（API ID：gemini-3.7-flash）：1M input／64k output context，input $0.75、output $3.75 per 1M tokens（優惠價至 2026-12-31，之後回到 $1.50／$7.50，與前代 3.6 Flash 同價）；DeepSWE v1.1 65.3%（前代 48.6%）、AutomationBench 30.4%（前代 17.0%）、FrontierCode 1.1 43.6%，多項 agentic/企業自動化 benchmark 超越 Claude Sonnet 5 與 GPT-5.6 Terra"
series:
  name: "AI Model Tracker"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-08-16-model-google-gemini-3-7-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gemini-3.7-flash` |
| 廠商 | Google（Google DeepMind） |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens（input）／64,000 tokens（output） |
| Input 定價 (USD/1M tokens) | $0.75（優惠價，至 2026-12-31；之後回到 $1.50） |
| Output 定價 (USD/1M tokens) | $3.75（優惠價，至 2026-12-31；之後回到 $7.50） |
| 開源 | 否 |
| 發布日 | 2026-08-13 |
| 官方公告 | [Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/) |

## 能力亮點

- DeepSWE v1.1（長週期軟體工程 benchmark）達 65.3%，較前代 Gemini 3.6 Flash 的 48.6% 提升 16.7 個百分點
- AutomationBench（企業工作流程自動化私有測試集）從 17.0% 跳到 30.4%，接近翻倍
- FrontierCode 1.1（正式環境程式碼品質）由 34.4% 提升到 43.6%，同代際模型中進步最明顯
- 新增原生 computer use 工具模式，OSWorld-2.0（agentic 電腦操作）從 33.8% 提升到 47.9%
- 支援 function calling、search-as-a-tool、computer use 三種 tool use 模式，並可透過 Gemini App、Google Antigravity、Gemini Enterprise Agent Platform 等多種介面存取

## Benchmark 表現

| Benchmark | Gemini 3.7 Flash | 前代（3.6 Flash） | 競品最強 |
|---|---|---|---|
| DeepSWE v1.1（長週期 SWE） | 65.3% | 48.6% | GPT-5.6 Terra 69.6% |
| FrontierCode 1.1（正式環境程式碼品質） | 43.6% | 34.4% | Claude Sonnet 5 42.7% |
| Terminal-bench 2.1（agentic 終端操作） | 85.8% | 78.0% | GPT-5.6 Terra 87.4% |
| AutomationBench（企業工作流程自動化） | 30.4% | 17.0% | GPT-5.6 Terra 23.6% |
| GDM-MRCR v2（128k 長上下文） | 97.0% | 91.8% | GPT-5.6 Terra 93.5% |
| HLE-Verified（跨領域專家推理） | 53.6% | 51.2% | GPT-5.6 Terra 51.1% |

⚠️ 以上為 Google 官方公佈的內部評測結果（含跨廠商模型比較），非各廠商自行公佈的第三方複現數據，實際表現可能因評測環境而異。

## 與前代/競品比較

跟 Gemini 3.6 Flash 比，進步最大的不是程式碼生成本身，而是「企業自動化」與「長週期 agent 任務」：AutomationBench 幾乎翻倍（17.0% → 30.4%），DeepSWE v1.1 也拉開 16.7 個百分點的差距，代表在多步驟、需要持續執行的企業場景中可靠度明顯提升。

跟競品比，Gemini 3.7 Flash 在 FrontierCode、AutomationBench、GDM-MRCR、HLE-Verified 四項都領先 Claude Sonnet 5 與 GPT-5.6 Terra，但在 DeepSWE v1.1 與 Terminal-bench 2.1 兩項純程式碼/終端操作 benchmark 上仍落後 GPT-5.6 Terra 約 2-4 個百分點；在知識工作類的 GDPVal-AA（Elo 1525）也低於 Claude Sonnet 5（1598）與 Muse Spark 1.2（1628）。

定價維持 3.6 Flash 的優惠價 $0.75/$3.75（每 1M tokens），在能力顯著提升的前提下等於隱性降價。相比 Claude Sonnet 5 的 $2.00/$10.00 與 GPT-5.6 Terra 的 $2.00/$12.00，Gemini 3.7 Flash 的 input 價格便宜約 63%、output 價格便宜約 63-69%。Browser Use 的實測回饋也指出，換成 3.7 Flash 後 agent 端到端成本再降低 35%（來自更高的 prompt cache 命中率與更少的工具呼叫錯誤，而非 token 單價變動）。

## 對 Agent 開發的意義

原生 computer use 工具模式加上 OSWorld-2.0 從 33.8% 跳到 47.9%，是這次對 agent 架構最直接的影響——過去 Flash 等級模型在「操作真實桌面/瀏覽器環境」的可靠度明顯落後 Pro/frontier 模型，這個差距在 3.7 Flash 上大幅縮小。

- 如果你在做 coding agent 或 SWE agent：DeepSWE 65.3% + Terminal-bench 2.1 85.8%，代表可以用 Flash 定價跑接近 frontier 等級的程式碼/終端自動化，明顯壓低長時間跑批的成本
- 如果你在做企業工作流程自動化（合約審核、報表產出、多步驟表單處理）：AutomationBench 30.4%（近乎前代兩倍）加上 1M input context，適合處理長文件驅動的企業流程 agent
- 不適合：需要最高精度知識工作判斷的場景（如法律/財務盡職調查），GDPVal-AA 上 Claude Sonnet 5（Elo 1598）與 Muse Spark 1.2（Elo 1628）仍領先 3.7 Flash（Elo 1525），這類任務建議搭配 frontier tier 模型或人工複核

## 今日收穫

過去預設「Flash 等級」模型就是用能力換速度/成本，agentic 能力理論上會明顯落後同代 Pro/frontier 模型。但 Gemini 3.7 Flash 的官方評測顯示，它在 AutomationBench、FrontierCode、GDM-MRCR、HLE-Verified 上直接贏過定價高出 2-3 倍的 Claude Sonnet 5 與 GPT-5.6 Terra——「Flash vs Pro」的分野正在從「能力落差」轉變成「context 上限與延遲取捨」，尤其在企業自動化這類需要大量長流程執行的場景更明顯。

## 參考資料

- [Gemini 3.7 Flash: our most intelligent workhorse model — Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
- [Gemini 3.7 Flash — Google DeepMind（benchmark 表與模型資訊）](https://deepmind.google/models/gemini/flash/)
- [Gemini 3.7 Flash Model Card — Google DeepMind](https://deepmind.google/models/model-cards/gemini-3-7-flash/)
- [Gemini Developer API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Models | Gemini API — Google AI for Developers](https://ai.google.dev/gemini-api/docs/models)
