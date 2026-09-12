---
title: "模型卡｜Agnes 3.0 Flash"
date: 2026-09-13
category: daily
type: digest
tags: [ai-agent, model-release, daily, agnes-ai, model-family-agnes]
lang: zh-TW
description: "新加坡 Sapiens AI 的 Agnes 3.0 Flash 在 Artificial Analysis 指數上追平 DeepSeek V4 Pro，定價只要八分之一、速度快三倍，但同名字底下藏著兩顆完全不同的模型"
tldr: "Agnes 3.0 Flash（API model：agnes-3.0-flash，廠商 Agnes AI／新加坡 Sapiens AI）：2026-09-09 上線，512K context，input $0.05／output $0.15／cache $0.005（每 1M tokens，目前促銷期全免費）；Artificial Analysis Intelligence Index v4.3 拿 36 分追平 DeepSeek V4 Pro，但輸出速度 235-252.7 tokens/s 是 V4 Pro（72 t/s）的 3 倍以上；閉源、不可自架；同名字另有一顆開源 Preview checkpoint（33B、262K context、Apache 2.0），架構與分數都跟 API 版不同，需注意混淆"
series:
  name: "AI Model Tracker"
  order: 22
glossary:
  - term: "Agnes AI"
    def: "新加坡新創 Sapiens AI（創辦人 Bruce Yang）旗下的商業品牌，以單一 omni-modal API 同時提供文字、圖像、影片模型"
---

> 🌏 [English version](/en/posts/daily/2026-09-13-model-agnes-ai-agnes-3-0-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `agnes-3.0-flash`（API 呼叫用；HuggingFace 上另有一顆同名但規格不同的開源 Preview checkpoint，見下方說明） |
| 廠商 | Agnes AI（新加坡 Sapiens AI 旗下品牌） |
| 參數量 | 官方未公開（API／生產版）；開源 Preview checkpoint 為 33B，混合注意力架構（72 層中 54 層為 gated delta rule 遞迴層、18 層為標準全域注意力，僅這 18 層的 KV cache 會隨 context 增長） |
| Context Window | 512K tokens（API／生產版，官方文件標示）；開源 Preview checkpoint 為 262,144 tokens |
| Input 定價 (USD/1M tokens) | 牌價 $0.05；促銷期間全免費（$0） |
| Output 定價 (USD/1M tokens) | 牌價 $0.15；促銷期間全免費（$0） |
| 開源 | 否（API／生產版為閉源，僅能透過 Agnes AI 官方 API 使用）；另有 Apache-2.0 授權的開源 Preview checkpoint，但參數量與分數均與生產版不同 |
| 發布日 | 2026-09-09（API／生產版上線；HuggingFace 開源 Preview checkpoint 於 2026-09-11 上架） |
| 官方公告 | [Agnes AI 官方文件：Agnes 3.0 Flash](https://www.agnes-ai.com/en/docs/agnes-30-flash) |
| HuggingFace | [Agnes-AI/Agnes-3.0-Flash](https://huggingface.co/Agnes-AI/Agnes-3.0-Flash)（僅為開源 Preview checkpoint，非生產版） |
| 家族 | Agnes 系列（前代為 Agnes 2.5 Pro Beta，兩者皆維持在線） |

## 能力亮點

- Artificial Analysis Intelligence Index v4.3 拿下 36 分，在同量級 61 個模型中排名第 1，與 DeepSeek V4 Pro（同為 36 分）打平，但定價只要 V4 Pro 的約八分之一（input）到六分之一（output）
- 官方文件與第三方測試皆顯示輸出速度落在 235～252.7 tokens/s 區間，是 DeepSeek V4 Pro（72 t/s）的 3 倍以上，僅次於 Google Gemini 3.8 Flash（267.2 t/s）
- 開源 Preview checkpoint 採混合注意力（hybrid-attention）解碼器：每 4 層只有 1 層跑標準全域注意力、其餘 3 層跑 gated delta rule 遞迴層，72 層中僅 18 層的 KV cache 會隨 context 增長，理論上大幅壓低長 context 的記憶體開銷
- 主打「可信賴交付」：官方強調強化事實根據、結果驗證與工具呼叫穩定度，減少「宣稱完成但實際沒做到」與內部推理過程外洩的問題

## Benchmark 表現

| Benchmark | Agnes 3.0 Flash | DeepSeek V4 Pro | DeepSeek V4.1 Flash |
|---|---|---|---|
| AA Intelligence Index v4.3 | 36 | 36 | 40 |
| AutomationBench-AA（agentic SaaS 工作流） | 51% | 57% | 68.9% |
| Terminal-Bench v4.0（agentic 終端操作） | 7% | 14% | 26.8% |
| AA-LCR v1.1（長 context 推理） | 81% | 80% | 84.0% |
| AA-Omniscience Accuracy（事實知識） | 25% | 49% | 46% |

⚠️ 以上為 Artificial Analysis v4.3 對 API／生產版 Agnes 3.0 Flash 的測試結果（截至 2026-09-11 存取，官方標注為「估計值，等待獨立覆現」），HuggingFace 開源 Preview checkpoint 的 benchmark 數字與此不同、不可互相引用。DeepSeek V4.1 Flash 資料取自昨日（2026-09-12）已發表之模型卡。

## 與前代/競品比較

跟自家前代 Agnes 2.5 Pro Beta（Intelligence Index 35）比，3.0 Flash 只多 1 分，但輸出速度從 159.5 t/s 拉到 235+ t/s，進步集中在「更快」而非「更聰明」。

跟同分的 DeepSeek V4 Pro 比，Agnes 3.0 Flash 的定價與速度優勢明顯：input 便宜約 8.7 倍、output 便宜約 5.8 倍、輸出速度快 3.3 倍。但拆開子項目看，兩者的 36 分其實代表完全不同的能力輪廓——Agnes 在 SciCode、長 context 推理小幅領先，在 AutomationBench-AA（agentic SaaS 工作流）與 Terminal-Bench v4.0（agentic 終端操作）明顯落後 V4 Pro，AA-Omniscience 事實準確率更只有 25%，遠低於 V4 Pro 的 49%。換句話說，同一個綜合分數底下，Agnes 3.0 Flash 是「便宜、快、但不夠可靠」，V4 Pro 是「貴、慢、但更會做多步驟 agent 任務、也更少講錯事實」。

唯一在 Intelligence Index 上贏過 Agnes 3.0 Flash 的是 DeepSeek V4.1 Flash（40 分），但 V4.1 Flash 的 output 定價是 Agnes 的 4 倍，agentic benchmark（AutomationBench-AA 68.9%、Terminal-Bench v4.0 26.8%）也大幅領先——如果預算允許，V4.1 Flash 目前仍是這三者中最均衡的選擇。

## 對 Agent 開發的意義

如果你在做互動式 coding agent 或需要大量生成輸出的場景（output token 量主導帳單）：Agnes 3.0 Flash 的低價 + 高速組合很有吸引力，尤其目前還在免費促銷期，適合拿來做原型驗證或壓測，不需要一開始就付 DeepSeek 或 Gemini 等級的價錢。

如果你在做需要高事實準確度或多步驟自主 agentic 工作流（terminal 操作、SaaS 工作流自動化）的系統：AA-Omniscience 25% 準確率與明顯落後的 AutomationBench-AA／Terminal-Bench 分數，代表這類任務目前仍建議用 DeepSeek V4 Pro 或 V4.1 Flash，不要只看 Intelligence Index 總分就直接替換。

不適合：需要自架部署或資料不能離開自己基礎設施的場景——生產版 Agnes 3.0 Flash 完全閉源，只能透過官方 API 使用；也不適合長 context、高快取命中率的重複性 agent 工作（例如反覆重放同一份系統提示或整個 codebase），因為 Agnes 的快取輸入定價（$0.005/1M）比 DeepSeek（$0.003）與小米 MiMo（$0.0028）都貴。

## 今日收穫

這次最值得記下來的不是分數本身，而是「同名字、不同模型」這件事：HuggingFace 上的 `Agnes-AI/Agnes-3.0-Flash` 是一顆 33B、262K context 的開源 Preview checkpoint，跟 Agnes AI 官方 API 與 Artificial Analysis 測試的生產版 Agnes 3.0 Flash（512K context、參數量未公開）是完全不同的兩顆模型，連 benchmark 分數都不能互相引用——這個混淆連 Agnes AI 自己都在 HuggingFace model card 上特別加了一段「版本澄清」來說明。之後看到任何廠商同時發布「開源版」跟「API 版」用同一個名字時，都該先確認兩者是不是真的同一顆權重，而不是預設它們只是部署方式不同而已。

## 參考資料

- [Agnes AI 官方文件：Agnes 3.0 Flash](https://www.agnes-ai.com/en/docs/agnes-30-flash)
- [HuggingFace：Agnes-AI/Agnes-3.0-Flash（開源 Preview checkpoint）](https://huggingface.co/Agnes-AI/Agnes-3.0-Flash)
- [Artificial Analysis：Agnes 3.0 Flash 模型頁](https://artificialanalysis.ai/models/agnes-3-0-flash)
- [Intelligent Living：Agnes 3.0 Flash: Free Singapore AI Matches DeepSeek V4 Pro](https://www.intelligentliving.co/agnes-3-0-flash-matches-deepseek/)
- [NanoGPT／Sulat：Agnes 3.0 Flash 模型資訊（標注 2026-09-09 發布）](https://models.sulat.com/models/nano-gpt-agnes-30-flash-597606fc)
