---
title: "模型卡｜Gemini 4 Argon"
date: 2026-10-05
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: zh-TW
description: "Google 發佈新旗艦 Gemini 4 Argon——DeepSWE v1.1 77.9% 刷新 SOTA、輸出上限衝到 1M tokens，但目前只開放給受信任資安夥伴，連 API Model ID 都還沒公開"
tldr: "Gemini 4 Argon：2026-09-30 發佈，官方只公布輸出上限 1M tokens（前代 64K），input context window 未公開（第三方傳 2M 但無法追溯到 Google 來源）；促銷價 input $2.00／output $10.00，promo 結束後倍增為 $4.00／$20.00（USD/1M tokens）；DeepSWE v1.1 77.9% 刷新 SOTA（Opus 5.5 74.2%、GPT-6 Astra 74.1%），但 FrontierSWE v2 只有 55%、輸給 GPT-6 Astra 65.5%；目前僅透過 Fairwind Program 開放給受信任資安夥伴，一般開發者、企業、消費者都還拿不到"
series:
  name: "AI Model Tracker"
  order: 40
glossary:
  - term: "Gemini"
    def: "Google DeepMind 開發的大型語言模型家族，Argon 為其最新旗艦分支"
---

> 🌏 [English version](/posts/daily/2026-10-05-model-google-gemini-4-argon-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | 未公開（API 尚未開放，Gemini API 定價頁與 changelog 均無 Argon 條目） |
| 廠商 | Google DeepMind |
| 參數量 | 未公開 |
| Context Window | 官方僅公布輸出上限 1,000,000 tokens（前代 64,000 tokens）；input context window 未公開——多家外媒（NeuralTrust、The Rundown）查證指出「2M tokens」的傳言無法追溯到 Google 官方來源 |
| Input 定價 (USD/1M tokens) | $2.00（促銷價，無到期日），promo 結束後 $4.00 |
| Output 定價 (USD/1M tokens) | $10.00（促銷價，無到期日），promo 結束後 $20.00 |
| 開源 | 否（閉源，Google 專有） |
| 發布日 | 2026-09-30 |
| 官方公告 | [Google Blog：Gemini 4 Argon: our next era of frontier intelligence](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon) |
| HuggingFace | 不適用（閉源模型） |
| 家族 | Gemini 4.x |

## 能力亮點

- DeepSWE v1.1（長程真實世界軟體工程任務）拿下 77.9%，刷新 SOTA，超過 Claude Opus 5.5（74.2%）與 GPT-6 Astra（74.1%）
- 輸出 token 上限從前代的 64,000 一口氣拉到 1,000,000，官方強調這讓模型能在單次推理裡維持長程推理，不必中斷重啟
- 在 Zapier 的 AutomationBench（端到端商業流程執行）排名第一，51.3%；LVBench（長影片理解）91.7%，同樣是目前最高分
- CWE-bench v1（真實資安漏洞修復）68%，與 GPT-6 Astra 並列第一，官方表示將對受信任資安夥伴開放「無資安護欄」版本以發揮完整防禦能力

## Benchmark 表現

| Benchmark | 分數 | 競品最強 |
|---|---|---|
| DeepSWE v1.1 | 77.9% | Claude Opus 5.5 74.2%、GPT-6 Astra 74.1% |
| FrontierSWE v2 | 55% | GPT-6 Astra 65.5%、Claude Opus 5.5 62.3% |
| CWE-bench v1（漏洞修復） | 68%（並列第一） | GPT-6 Astra 68%、Claude Opus 5.5 67% |
| AutomationBench（Zapier） | 51.3%（第一） | 未列出次高分 |
| LVBench（長影片理解） | 91.7%（SOTA） | 未列出次高分 |
| Artificial Analysis Intelligence Index | 53 | GPT-6.1 Sol 54、Claude Opus 5.5 58 |

⚠️ 以上除 Artificial Analysis 外均為 Google 官方自測，尚無第三方獨立複現；DeepSWE v1.1／CWE-bench 分數來自官方部落格圖表，FrontierSWE v2 數字來自第三方整理（AIFire）。注意 Argon 並非每項都領先——FrontierSWE v2、Artificial Analysis Intelligence Index 兩項都輸給至少一個競品，顯示這是「特定場景領先」而非全面碾壓。

## 與前代/競品比較

跟自家前代比，Argon 最大的進步是輸出上限暴增 15.6 倍（64K → 1M），這讓需要長推理鏈的任務（長程 coding、法律/財務多輪研究）可以在一次呼叫裡完成，不必像過去那樣被截斷後重新拼接上下文。但官方公告從頭到尾沒提input context window，這跟多數廠商「先秀 context window 數字」的慣例相反，也讓外部分析（NeuralTrust、The Rundown、Vallettasoftware）不約而同把「Google 沒公布 input 上限」當成報導重點。

跟競品比，Argon 在長程軟體工程（DeepSWE v1.1）、商業流程自動化（AutomationBench）、長影片理解（LVBench）三項建立領先，但在 FrontierSWE v2（另一套 coding 評測）明顯落後 GPT-6 Astra 10.5 個百分點，Artificial Analysis 的綜合智能分數也排在 Opus 5.5 之後。這代表 Argon 的強項集中在「長程、多步驟、需要持續輸出」的任務類型，不是全面刷新所有 coding benchmark。

定價上，促銷價 $2/$10 精準卡在 Sonnet 5.5、GPT-6 Sol 的價位帶，promo 結束後的 $4/$20 則落到 Opus 5.5 的價位帶——等於用「先打平中階模型的價格換採用」的策略上市，但官方沒公布促銷到期日（見 [10-04 定價追蹤](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing)），規劃長期成本時不能只看促銷價。

## 對 Agent 開發的意義

Argon 目前最大的限制不是能力，是存取權——只開放給 Fairwind Program 裡的受信任資安夥伴，一般開發者連 API Model ID 都看不到。

- 如果你在做需要長推理鏈、單次呼叫要產出大量內容的 agent（長程 code migration、完整審計報告、多檔案 patch）：1M 輸出上限是目前業界最大的，等公開 API 後值得優先評估，但要先確認 input context window 實際多大，不要用網路傳言的 2M 當依據
- 如果你在做資安防禦類 agent（漏洞挖掘、自動修補）：CWE-bench v1 並列第一加上「無護欄版本」的規劃，顯示 Google 把這條產品線定位成資安團隊的專用工具，但一般開發者短期內拿不到
- 不適合：現在就把 Argon 寫進生產架構——目前僅限受信任測試者，一般 API 存取時程未定，且 FrontierSWE v2 的落後說明它不是所有 coding 場景都最強
- 如果你在比較 Gemini／Claude／GPT 的旗艦模型：Argon 的定位更接近「特定長程任務的專家模型」，不是全面取代 Sonnet 5.5 或 GPT-6 Astra 的日常選項

## 今日收穫

這是近期少見的「公告了定價、卻沒公告 API 存取」的發佈——多數廠商先開放測試、再公布定價，Argon 反過來，定價已經寫進部落格文章的註腳，但 Model ID、input context window、實際開放時程全部缺席。這提醒我看模型公告時要分清楚「官方確認的數字」和「官方沒否認的傳言」：output 1M tokens 是 Google 自己寫的，input context window 的「2M」只是外媒猜測，兩者在模型卡裡不該用同一種確信度呈現。

## 參考資料

- [Google Blog：Gemini 4 Argon: our next era of frontier intelligence](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon)
- [NeuralTrust：Gemini 4 Argon: Benchmarks, Pricing & Security (2026)](https://neuraltrust.ai/blog/gemini-4-argon)
- [AIFire：Gemini 4 Argon Benchmarks vs GPT And Claude Performance](https://www.aifire.co/p/gemini-4-argon-benchmarks-vs-gpt-and-claude-performance)
- [quidproquo：定價追蹤｜Gemini 4 Argon 促銷價 $2/$10](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing)
