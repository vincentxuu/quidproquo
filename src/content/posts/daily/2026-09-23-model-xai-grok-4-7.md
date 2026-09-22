---
title: "模型卡｜Grok 4.7"
date: 2026-09-23
category: daily
type: digest
tags: [ai-agent, model-release, daily, xai, model-family-grok]
lang: zh-TW
description: "xAI 發佈 Grok 4.7——換上更大的新 base model，Terminal-Bench 4.0 官方自測從 20.3% 跳到 38.0%，但第三方獨立複測只有 26%，定價維持 $2/$6 不變且同步全面上線 GitHub Copilot"
tldr: "Grok 4.7：2026-09-21 上線，`grok-4.7`；換上更大的新 base model＋更長 RL 訓練；500K context window；API 定價維持 input $2.00／output $6.00 per 1M tokens（≥200K tokens 時漲到 $4.00／$12.00）；官方自測 Terminal-Bench 4.0 從前代 20.3% 跳升到 38.0%，但 Artificial Analysis 獨立複測僅 26%，落後 GPT-6 Astra（60%）與 Claude Fable 5.1（55%）；同日上線 GitHub Copilot 全方案；對 Agent 開發的意義是提供便宜 3-8 倍的 agentic coding 選項，但複雜自主終端操作仍建議先用獨立評測把關"
series:
  name: "AI Model Tracker"
  order: 29
glossary:
  - term: "Grok"
    def: "xAI（SpaceXAI）開發的大型語言模型家族，主打與 X（Twitter）即時資訊整合"
  - term: "Terminal-Bench"
    def: "評測模型在真實終端機環境中自主執行多步驟指令、除錯、完成任務能力的 benchmark，被視為 agentic coding 的重要指標"
---

> 🌏 [English version](/en/posts/daily/2026-09-23-model-xai-grok-4-7-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `grok-4.7` |
| 廠商 | xAI（SpaceXAI） |
| 參數量 | 約 2.1 trillion（第三方報導引述，官方未在規格頁公開確切數字） |
| Context Window | 500,000 tokens |
| Input 定價 (USD/1M tokens) | $2.00（< 200K prompt tokens）／$4.00（≥ 200K） |
| Output 定價 (USD/1M tokens) | $6.00（< 200K prompt tokens）／$12.00（≥ 200K） |
| 開源 | 否 |
| 發布日 | 2026-09-21 |
| 官方公告 | [xAI News：Introducing Grok 4.7](https://x.ai/news/grok-4-7) |
| 家族 | Grok 4.x（Grok 4.5 → Grok 4.6 → Grok 4.7，本次） |

## 能力亮點

- Terminal-Bench 4.0 官方自測從前代 Grok 4.6 的 20.3% 跳升到 38.0%（+17.7pp），是這次所有 benchmark 裡漲幅最大的一項
- EEBench（電機工程任務）達到 64.0%，不只贏過前代（53.0%，+11.0pp），也贏過 GPT-5.6 Sol Max（39.4%）與 Claude Fable 5.1 Max（56.4%），是三家最強
- 換上全新且更大的 base model，搭配更長的強化學習訓練與更高比例的高難度長任務資料，官方強調訓練目標是「把任務做完」而非「把任務答得好看」
- 內建全新重建的 safeguard stack：HackerBench v0.3（惡意網路任務）危險雙用途提示通過率壓到僅 3.3%，LatchBio 生物安全 benchmark 拿下 62.4% 全場最高

## Benchmark 表現

| Benchmark | Grok 4.7 | 前代 (Grok 4.6) | 競品最強 |
|---|---|---|---|
| CursorBench 4.0 | 46.3% | 40.4% | Claude Fable 5.1 Max 51.8% |
| DeepSWE v1.1（high） | 71.0% | 65.2% | GPT-5.6 Sol Max 72.7% |
| Terminal-Bench 4.0（xAI 自測） | 38.0% | 20.3% | Claude Fable 5.1 Max 57.9% |
| EEBench | 64.0% | 53.0% | Grok 4.7 全場最高（GPT-5.6 Sol Max 39.4%） |
| Artificial Analysis Intelligence Index（第三方獨立評測） | 46 | 無可比直接前代分數 | Claude Fable 5.1／GPT-6 並列 53 |
| Terminal-Bench 4.0（Artificial Analysis 獨立複測，標準化條件） | 26% | — | GPT-6 Astra 60%、Claude Fable 5.1 55% |

⚠️ 上表除 Artificial Analysis 兩列為第三方獨立評測外，其餘均為 xAI／各廠商自測，採各自最高 reasoning effort（high／max）設定，非同一標準下的直接比較，尚待更多第三方覆現。

## 與前代/競品比較

跟 Grok 4.6 比，Grok 4.7 進步最明顯的是 agentic coding 相關項目：CursorBench 4.0（+5.9pp）、DeepSWE v1.1（+5.8pp），尤其 Terminal-Bench 4.0 官方自測幾乎翻倍（20.3% → 38.0%）。xAI 表示這來自換掉更大的新 base model，並針對可能耗時數小時才能完成的高難度任務加重訓練權重。

跟競品比，情況比較分裂。官方自報的 CursorBench 4.0 與 EEBench 上 Grok 4.7 都贏過 GPT-5.6 Sol Max，DeepSWE v1.1 也小贏 Claude Fable 5.1 Max；但 Terminal-Bench 4.0 官方自測仍落後 Fable 5.1 Max 近 20 個百分點。更值得注意的是，Artificial Analysis 用標準化條件獨立複測 Terminal-Bench 4.0，Grok 4.7 只拿到 26%，比官方自報的 38.0% 低了 12 個百分點，也遠落後 GPT-6 Astra 的 60% 與 Claude Fable 5.1 的 55%；同一機構的綜合 Intelligence Index 上，Grok 4.7 以 46 分落後並列第一的 Claude Fable 5.1／GPT-6（53 分）達 7 分，落在前沿模型群組的中段。

定價策略維持不變：$2/$6（< 200K tokens 時）跟 Grok 4.5、4.6 完全一樣。這讓 Grok 4.7 的 output 定價只有 GPT-5.6 Sol 的三分之一、Claude Fable 5.1 的八分之一，在強調長鏈推理的 agentic 場景中，成本優勢會隨輸出 token 量放大。

## 對 Agent 開發的意義

Grok 4.7 這次把訓練重點放在「撐住長任務」與「加強自我驗證」，同時原生理解 xAI 自家的 Grok Bot harness 結構，這對已經在用 Grok 生態的 agent 開發者有直接幫助；但官方自測與 Artificial Analysis 獨立複測在 Terminal-Bench 4.0 上出現 12 個百分點的落差，代表官方數字對真實自主終端操作場景可能偏樂觀。

- 如果你在做成本敏感的 agentic coding 產品（如大量跑 coding agent 的 SaaS）：$2/$6 的定價搭配 CursorBench、DeepSWE 上不輸甚至小贏 GPT-5.6 Sol／Fable 5.1 的分數，值得評估用 Grok 4.7 取代部分高成本呼叫，尤其是已經接了 GitHub Copilot、Cursor 或 Grok Build 的團隊，發布當天就能直接切換
- 如果你在做電機工程或垂直領域知識工作 agent：EEBench 全場最高分是個訊號，可以優先在這類垂直場景做 A/B 測試
- 不適合：需要高可靠度的複雜自主終端操作場景（多步驟 shell 指令、持續處理未預期錯誤）——Artificial Analysis 標準化複測顯示這裡跟 GPT-6 Astra、Claude Fable 5.1 仍有明顯差距，直接套用 xAI 官方自報的 38.0% 做容量規劃可能過於樂觀，建議先用自己的任務集做獨立驗證再決定要不要重度依賴

## 今日收穫

Grok 4.7 的 Terminal-Bench 4.0 分數，官方自測是 38.0%，Artificial Analysis 用標準化條件獨立複測卻只有 26%——同一個 benchmark 名稱，兩種跑法可以差到 12 個百分點。這提醒了一件事：看模型發佈公告時，「官方自報的 benchmark 分數」跟「第三方在統一條件下複測的分數」不是同一件事，尤其是 agentic／終端操作類評測，測試環境（工具版本、超時設定、reasoning effort 等級）的差異足以左右結論；選型時能拿到獨立複測數據，就不該只看廠商自己公布的表格。

## 參考資料

- [xAI News：Introducing Grok 4.7](https://x.ai/news/grok-4-7)
- [xAI Developer Docs：Grok 4.7](https://docs.x.ai/developers/grok-4-7)
- [xAI Model Card PDF：Grok 4.7（2026-09-21）](https://media.x.ai/v1/website/4p7card-5eccc980.pdf)
- [iWeaver：Grok 4.7 Benchmarks, Specs, and Grok 4.6 Comparison](https://www.iweaver.ai/blog/grok-4-7/)
- [XenoSpectrum：xAI Launches Grok 4.7 at $2 per Million Tokens, Rolls Out Instantly to GitHub Copilot](https://xenospectrum.com/en/xai-grok-4-7-pricing-copilot/)
- [Decrypt：xAI Launches Grok 4.7. It's Bigger, But Late to the AI Frontier Party](https://decrypt.co/378824/xai-launches-grok-4-7)
