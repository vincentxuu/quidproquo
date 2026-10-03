---
title: "模型卡｜Kolibri 1"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, model-release, daily, aleph-alpha, model-family-kolibri]
lang: zh-TW
description: "Aleph Alpha 在德國統一日發佈開源主權模型 Kolibri——78B 總參數／3.46B 活躍 MoE，Apache 2.0 全開源，用 Merlin-Arthur 拒答機制和德英雙語訓練瞄準歐盟受監管產業"
tldr: "Kolibri 1（`Aleph-Alpha/Kolibri-1`，FP8；`Aleph-Alpha/Kolibri-1-BF16` 為全精度版）：2026-10-03 開源，78.1B 總參數／3.46B 活躍參數 MoE（384 個 experts 選 6 個＋1 共享），context window 最高驗證 1,048,576 tokens（建議 ≤262,144）；Apache 2.0 全開源權重，無官方 API 定價，自架為主；AIME 2025 96.9%（前代 Kolibri Origin 81.9%，未公開發布）、GPQA Diamond（EN）84.3%、τ³-bench Banking 38.1%（遠超競品最強 15.5%）；用 Merlin-Arthur 協定訓練拒答能力，context 不支援答案時主動說不知道；德國訓練、德英雙語，瞄準公部門／工業／航太等受歐盟 AI Act 與 GDPR 規範的場景"
series:
  name: "AI Model Tracker"
  order: 39
glossary:
  - term: "Kolibri"
    def: "Aleph Alpha 開發的德英雙語 MoE reasoning 模型家族，主打歐洲「主權 AI」（sovereign AI）與受監管產業部署"
---

> 🌏 [English version](/en/posts/daily/2026-10-04-model-aleph-alpha-kolibri-1-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Aleph-Alpha/Kolibri-1`（FP8，預設版本）／`Aleph-Alpha/Kolibri-1-BF16`（全精度） |
| 廠商 | Aleph Alpha（德國） |
| 參數量 | 78.1B 總參數／3.46B 活躍參數（MoE，50 層，384 個 experts 選 6 個＋1 個共享 expert） |
| Context Window | 原生 262,144 tokens，已驗證可延伸至 1,048,576 tokens（建議延遲敏感場景 ≤262,144） |
| Input 定價 (USD/1M tokens) | 無官方 API，開源權重需自架 |
| Output 定價 (USD/1M tokens) | 無官方 API，開源權重需自架 |
| 開源 | 是（Apache 2.0） |
| 發布日 | 2026-10-03 |
| 官方公告 | [Aleph Alpha Blog：Kolibri Has Landed](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/) |
| HuggingFace | [Aleph-Alpha/Kolibri-1](https://huggingface.co/Aleph-Alpha/Kolibri-1)、[Aleph-Alpha/Kolibri-1-BF16](https://huggingface.co/Aleph-Alpha/Kolibri-1-BF16) |
| 家族 | Kolibri 1.x（首次公開發布，前代 Kolibri Origin 僅作內部驗證、未公開） |

## 能力亮點

- 3.46B 活躍參數打平甚至超越活躍參數高達 4 倍的模型（如 Nemotron 3 Super 120B-A12B），官方稱站上「品質 vs. 推理成本」的 Pareto frontier
- τ³-bench Banking（金融客服多輪代理任務）拿下 38.1%，遠超第二名 Nemotron 3 Super 的 15.5% 與 Qwen3.6-35B-A3B 的 10.6%，是目前已知差距最大的單項優勢
- 用 Merlin-Arthur 協定訓練「拒答」能力：context 裡沒有答案依據時，模型會主動回答不知道，而非編造——這是官方特別標註、持續追蹤的能力，不是附帶效果
- 德英雙語原生訓練（非英文模型補譯德文）：21.3% 預訓練 token 是原生德文、僅 6% 來自翻譯，GPQA Diamond 德文版拿下 81.3%，英文版拿下 84.3%，兩語言差距小

## Benchmark 表現

| Benchmark | 分數 | 前代（Kolibri Origin，未公開發布） | 競品最強 |
|---|---|---|---|
| AIME 2025 | 96.9% | 81.9% | Nemotron 3 Super 91.7% |
| GPQA Diamond（EN） | 84.3% | 68.1% | Qwen3.6-35B-A3B 83.4% |
| τ³-bench（Banking） | 38.1% | 5.7% | Nemotron 3 Super 15.5% |
| BrowseComp | 29.4% | 4.4% | Nemotron 3 Super 29.1% |
| SWE-Bench Verified | 69.2% | 未測 | Qwen3.6-35B-A3B 73.8% |

⚠️ 以上均為 Aleph Alpha 官方自測，尚無第三方獨立複現。SWE-Bench Verified 是少數 Kolibri 落後的項目，coding 並非這次訓練重點。

## 與前代/競品比較

跟內部前代 Kolibri Origin（30.6B 總參數／3.27B 活躍，從未公開發布）比，Kolibri 在三個月內完成總參數翻倍（30B→78B）、context 從 64K 拉到 256K 原生／1M 驗證、預訓練 token 從 7.5T 增至 20T，AIME 2025 從 81.9% 跳到 96.9%（+15 個百分點）。官方強調活躍參數幾乎沒變（3.27B→3.46B），進步主要來自資料量、架構調整（attention 改為 sliding window + 每 5 層全注意力、expert 數從 128 增至 384）與訓練管線的疊代速度。

跟同量級開源模型比，Kolibri 的差異化不在「誰的平均分最高」，而在兩個刻意選擇的方向：一是金融/客服類多輪代理任務（τ³-bench banking 38.1% 比第二名高出超過 1 倍），二是拒答而非幻覈的 grounding 能力。代價是 coding 類任務（SWE-Bench Verified、LiveCodeBench v6）略輸給 Qwen3.6-35B-A3B，顯示這次訓練資源明確傾斜向 agentic／grounding，而非泛用 coding。

定價策略上 Kolibri 完全不走 API 計費這條路：Apache 2.0 全開源權重、無官方託管 API，官方的商業模式是賣「主權」——客戶自己部署、資料不離開自己的基礎設施，這跟多數閉源模型打 API 價格戰是完全不同的競爭維度。

## 對 Agent 開發的意義

Kolibri 把自己定位成「歐盟受監管產業專用的 agent 底座」，而不是另一個泛用聊天模型。

- 如果你在做資料不能離開歐盟/德國的 agent（公部門、工業、航太、金融等受 EU AI Act／GDPR 規範的場景）：Kolibri 原生支援 on-prem 自架，3.46B 活躍參數讓推理成本可控，且官方強調整條訓練管線（資料、預訓練、後訓練、評測）都在德國/歐洲境內完成，供應鏈透明度本身就是賣點
- 如果你在做 RAG 或需要「寧可不答也不要編造」的 agent：Merlin-Arthur 協定訓練出的拒答能力，加上 τ³-bench banking 的大幅領先，說明這個模型在「context 沒有答案就承認不知道」這件事上投入了專門訓練，值得在高風險客服/金融場景替代現有方案做 A/B 測試
- 不適合：純 coding agent（SWE-Bench、LiveCodeBench 略輸 Qwen3.6-35B-A3B）；也不適合德英以外的多語言場景——官方明講這是刻意的「深度優於廣度」選擇，只做兩個語言
- 如果你在評估是否要换成自架模型：78B 總參數全精度需要約 156GB 記憶體（4×A100 80GB 或等效），门槛不算低，但 3.46B 活躍參數帶來的吞吐量/延遲優勢在長期自架成本上可能比總參數更小的密集模型划算

## 今日收穫

多數模型卡比的是「哪個分數更高」，但 Kolibri 把競爭維度換成了「誰擁有訓練基礎設施與資料主權」——德國訓練、歐盟法規合規、透明供應鏈本身就是賣點，不是免責聲明。這提醒我：開源權重模型的差異化，正在從「benchmark 排名」延伸到「你能不能證明這個模型是怎麼來的」。

## 參考資料

- [Aleph Alpha Blog：Kolibri Has Landed: A Sovereign Open-Weight Model](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/)
- [HuggingFace：Aleph-Alpha/Kolibri-1](https://huggingface.co/Aleph-Alpha/Kolibri-1)
- [HuggingFace：Aleph-Alpha/Kolibri-1-BF16（含完整 Model Card／Evaluation 表）](https://huggingface.co/Aleph-Alpha/Kolibri-1-BF16)
- [Aleph Alpha Kolibri 技術報告（PDF）](https://aleph-alpha.com/downloads/tech-report.pdf)
- [Aleph Alpha：Kolibri 產品頁](https://aleph-alpha.com/en/kolibri/)
