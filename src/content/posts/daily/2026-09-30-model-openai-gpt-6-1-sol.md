---
title: "模型卡｜GPT-6.1 Sol"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 在 DevDay 2026 發佈 GPT-6.1 Sol——比旗艦 Astra 便宜五倍卻在多項 agent 任務逼近其表現，同時把快取輸入定價再砍半到 $0.10"
tldr: "GPT-6.1 Sol（`gpt-6.1-sol`）：2026-09-29 DevDay 上線，1,050,000 tokens context window（最大輸入 922,000、輸出上限 128,000，與 GPT-6 Sol 同級）；定價維持 input $2.00／output $10.00，但快取輸入從 GPT-6 Sol 的 $0.20 再砍半到 $0.10（比標準輸入價低 95%）；DeepSWE v1.1 上以約 1/5 Astra 成本追平 Astra 表現，比 GPT-6 Sol 最高分高 6.4 個百分點；AutomationBench medium effort 贏 Claude Opus 5.5 2.2 個百分點且成本僅其約 1/3；同一週 OpenAI 也因安全疑慮擱置了旗艦升級版 GPT-6.1 Astra，未發佈"
series:
  name: "AI Model Tracker"
  order: 35
glossary:
  - term: "GPT"
    def: "OpenAI 開發的大型語言模型家族，Sol 是旗艦 Astra 之下、鎖定日常複雜工作的中價位分支"
---

> 🌏 [English version](/en/posts/daily/2026-09-30-model-openai-gpt-6-1-sol-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6.1-sol` |
| 廠商 | OpenAI |
| 參數量 | 未公開 |
| Context Window | 1,050,000 tokens（最大輸入 922,000 tokens、輸出上限 128,000 tokens） |
| Input 定價 (USD/1M tokens) | $2.00（cached $0.10、cache write $2.50） |
| Output 定價 (USD/1M tokens) | $10.00 |
| 開源 | 否 |
| 發布日 | 2026-09-29 |
| 官方公告 | [OpenAI：Introducing GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/) |
| 家族 | GPT-6.x（GPT-6 Sol／Luna 2026-09-22 發佈；旗艦 GPT-6 Astra 2026-09-03 發佈；同期擱置的旗艦升級版 GPT-6.1 Astra 未發佈） |

## 能力亮點

- 快取輸入定價從 GPT-6 Sol 的 $0.20 再砍半到 $0.10／1M tokens，比標準輸入價低 95%，讓需要反覆重用長 context 的 agent 執行成本明顯下降
- DeepSWE v1.1（真實程式庫的軟體工程任務）以約 1/5 Astra 的成本追平 Astra 表現，同時比 GPT-6 Sol 最高分高 6.4 個百分點，且用了更低的 reasoning effort
- AutomationBench medium effort 拿下比 Claude Opus 5.5 高 2.2 個百分點的分數，成本卻只要對方約 1/3；同設定下也比 GPT-6 Sol 高 4.8 個百分點
- 低 reasoning effort 下的事實錯誤率從 GPT-6 Sol 的 11.4% 降到 7.7%（降幅約 32%），且各 reasoning effort 設定下錯誤率都與 Astra 相差在 1.9 個百分點內，成本卻不到 Astra 的 1/5

## Benchmark 表現

| Benchmark | 分數 | 前代 (GPT-6 Sol) | 競品最強 |
|---|---|---|---|
| Terminal-Bench Science 0.1（max effort，任務均價） | $5.47／task | 官方稱「分數翻倍以上，成本降逾一半」，前代具體均價未公開 | Claude Opus 5.5 $23.21／task；GPT-6 Astra $23.80／task（Astra 準確率最高 68.1%，仍是最難科研任務首選） |
| DeepSWE v1.1（agentic 軟體工程） | 追平 Astra（約 1/5 Astra 成本） | 68.8%（見 2026-09-25 模型卡） | 追平 GPT-6 Astra（Astra 具體分數官方未在本文列出） |
| AutomationBench（medium effort） | 高於 Opus 5.5 +2.2pp（成本約其 1/3） | 高於 GPT-6 Sol 同設定 +4.8pp | Claude Opus 5.5（medium effort，具體分數未公開） |
| OSWorld 2.0 offline set（max effort） | 高於 GPT-6 Sol +7pp（成本不到其一半） | 60.5%（xhigh effort，見 2026-09-25 模型卡） | 落後 GPT-6 Astra 2.1pp（成本僅約其 1/7） |
| 事實錯誤率（low effort，越低越好） | 7.7% | 11.4% | 與 GPT-6 Astra 相差 &lt;1.9pp（Astra 成本逾 5 倍） |

⚠️ 以上均為 OpenAI 官方自測與自選競品評測條件（各自設定的 reasoning effort），尚待第三方獨立複現；多數表格為官方公佈的「相對差距」而非雙方絕對分數，Astra／Opus 5.5 部分具體數字官方未在本次公告中完整列出。

## 與前代/競品比較

跟一週前才發佈的 GPT-6 Sol 比，這次沒有換模型定位，而是同一價位帶內的實力加強：DeepSWE v1.1 提升 6.4 個百分點、OSWorld 2.0 提升 7 個百分點、事實錯誤率降低約三成，且多數改善發生在較低的 reasoning effort，代表同樣任務可以用更少運算換到更好結果。標準 API 價格（input $2／output $10）維持不變，唯一調整的是快取輸入從 $0.20 腰斬到 $0.10——這對 agent 場景的意義比表面上的 benchmark 分數更大，因為 agent 通常在多輪工具呼叫間重複餵入同一段系統提示與長 context。

跟 Claude 競品比，Sol 在 AutomationBench（medium effort）小贏 Opus 5.5 2.2 個百分點，成本只要對方三分之一；Terminal-Bench Science 0.1 上以每任務 $5.47 對比 Opus 5.5 的 $23.21，成本差距逾四倍。但這些都是「同分或小贏、成本大勝」的敘事，不是分數天花板的突破——OpenAI 自己在公告裡也承認 GPT-6 Astra 在 Terminal-Bench Science 0.1 上仍以 68.1% 領先所有受測模型。

值得注意的時間點是：OpenAI 同一週先擱置了旗艦升級版 GPT-6.1 Astra（官方理由是未達內部安全標準），才在 DevDay 上改推 GPT-6.1 Sol 當作當週的主要發佈。這意味著這次沒有推出新的分數天花板，OpenAI 選擇把資源投在「用更低成本逼近既有旗艦」而非挑戰更高分數。

## 對 Agent 開發的意義

這次發布延續了 GPT-6 Sol／Luna 的「性價比優先」路線，但快取輸入砍半到 $0.10 是專門針對 agent 工作負載的調整。

- 如果你在做多輪工具呼叫的 agent（同一個 system prompt／長 context 反覆重用）：快取輸入 $0.10 讓重複餵入的成本幾乎可以忽略，值得重新算一次現有 pipeline 的實際單位成本
- 如果你在做 coding agent 或需要接近旗艦水準但預算有限的場景：DeepSWE v1.1 追平 Astra、成本卻只要 1/5，是目前這條產品線裡最值得優先測試替換 Sol 舊版的理由
- 不適合：需要頂尖科研推理能力的場景——Terminal-Bench Science 0.1 上 Astra 的 68.1% 仍是目前最高分，Sol 系列本身也還沒補上這個差距
- 具體架構建議：留意官方即將推出的 GPT-6.1 Sol Ultrafast（Codex 中 token 生成速度最高提升 8 倍），對互動式開發工作流（tab completion、即時 diff 建議）的延遲敏感場景可以優先評估

## 今日收穫

同一週擱置旗艦升級版、卻把資源投到中價位模型的快取定價與可靠性上，說明 OpenAI 現階段更在意「同一個价位帶的性價比曲線往哪裡移動」，而不是急著推出新的分數天花板。快取輸入砍半這種看似不起眼的定價調整，對長期跑 agent pipeline 的實際成本影響，可能比 benchmark 表上的百分點差距更直接。

## 參考資料

- [OpenAI：Introducing GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/)
- [OpenAI API Docs：GPT-6.1 Sol model details](https://developers.openai.com/api/docs/models/gpt-6.1-sol)
- [OpenAI Deployment Safety：Addendum to GPT-6 Astra System Card — GPT-6.1 Sol](https://deploymentsafety.openai.com/gpt-6-1-sol)
- [TheNextWeb：OpenAI releases GPT-6.1 Sol at a fifth of GPT-6 Astra's token prices](https://thenextweb.com/news/openai-gpt-6-1-sol-price-astra-devday)
- [Neowin：OpenAI launches GPT-6.1 Sol with near-Astra performance at one-fifth the price](https://www.neowin.net/news/openai-launches-gpt-61-sol-with-near-astra-performance-at-one-fifth-the-price/)
- [DataCamp：GPT-6.1 Sol: Features, Benchmarks, Pricing, and Access](https://www.datacamp.com/blog/gpt-6-1-sol)
