---
title: "模型卡｜Tencent Hy4 flash"
date: 2026-11-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-hunyuan]
lang: zh-TW
description: "騰訊混元開源 Hy4 flash——224B 總參數、12B 活躍參數、1M context，WorkIndex 任務成本只要 DeepSeek-V4.1-Flash-1017 的 1/8、旗艦 Hy4 的 1/20"
tldr: "Hy4 flash（`tencent/Hy4-flash`）：224B 總參數（含 64B Engram）、12B 活躍參數、1M context，2026-11-17 開源（Tencent Hy License）；官方定價 input $0.070／output $0.281／cache $0.003 per 1M tokens；WorkIndex 任務品質（42.1）小勝前代 Hy4 Preview（39.7），但每任務成本只要 Hy4 Preview 的 1/13、旗艦 Hy4 的 1/20、DeepSeek-V4.1-Flash-1017 的 1/8；盲測使用者滿意度 2.79/4 貼近 Claude Haiku 5.5 的 2.81/4，但成本只要後者的 1/18"
series:
  name: "AI Model Tracker"
  order: 76
glossary:
  - term: "Engram"
    def: "Hy4 flash 新增的 N-gram 查表式嵌入模組，用雜湊查表取出 bigram／trigram 表徵，不佔用 attention 運算但吃掉大量儲存參數"
---

> :globe: [English version](/posts/daily/2026-11-19-model-tencent-hy4-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `tencent/Hy4-flash`（另有 `tencent/Hy4-flash-FP8` 量化版、`tencent/Hy4-flash-base` 預訓練版） |
| 廠商 | Tencent（騰訊混元 / Hy 團隊） |
| 參數量 | 224B 總參數（含 64B Engram 查表參數）、12B 活躍參數／token（文字 11.3B + 視覺 0.43B） |
| Context Window | 1,048,576 tokens（1M） |
| Input 定價 (USD/1M tokens) | $0.070 |
| Output 定價 (USD/1M tokens) | $0.281（cache hit 另計 $0.003/1M tokens） |
| 開源 | 是（Tencent Hy License，自訂條款） |
| 發布日 | 2026-11-17 |
| 官方公告 | [Tencent PR Newswire](https://www.prnewswire.co.uk/news-releases/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows-302941888.html) |
| HuggingFace | [tencent/Hy4-flash](https://huggingface.co/tencent/Hy4-flash) |
| 家族 | Tencent Hunyuan Hy 系列（Hy4 旗艦的輕量 flash 分支，前代為 2026-08-29 的 Hy4 preview） |

## 能力亮點

- **效率優先的三項架構變更**：相對旗艦 Hy4，Hy4 flash 把 sparse attention 與 sliding-window attention 以 1:3 交錯（hybrid attention）、路由專家搬進低維 latent 空間（LatentMoE，512 選 16）、再加 Engram 這個用雜湊查表取 bigram/trigram 表徵的模組，三者合力把 KV cache 壓到 Hy3 的 1/24、Hy4 的 1/6
- **成本效率是賣點，不是智能上限**：內部 WorkIndex（PPT 製作/編輯、文件編修、試算表修復、音訊影片處理等 8 項任務）整體分數 42.1，只小贏前代 Hy4 Preview 的 39.7，但每任務成本是 Hy4 Preview 的 1/13、旗艦 Hy4 的 1/20、DeepSeek-V4.1-Flash-1017（Max tier）的 1/8
- **DFly2 投機解碼**：5 層、0.85B 參數的草稿模型直接共用主模型的 KV cache 與 sparse attention 索引選取結果，草稿 token 固定只看最多 2,048 個 key，不隨 context 長度增加成本，搭配 4-bit 量化讓解碼速度超過 150 tokens/s
- **盲測貼近 Claude Haiku 5.5，成本差 18 倍**：85 位騰訊 WorkBuddy 內部使用者、259 個任務的盲測中，Hy4 flash 使用者滿意度 2.79/4（Claude Haiku 5.5 為 2.81/4），但每任務成本僅 RMB 0.26，對比 Claude Haiku 5.5 的 RMB 4.73

## Benchmark 表現

| Benchmark | Hy4 flash | 前代/旗艦 Hy4 | 競品最強 |
|---|---|---|---|
| WorkIndex（內部任務綜合分） | 42.1 | Hy4 Preview 39.7 ／ 旗艦 Hy4 51.4 | — |
| DeepSWE v1.1 | 64.6 | 旗艦 Hy4 74.9 | — |
| Terminal-Bench 4.0 | 19.2 | 旗艦 Hy4 44.4 | — |
| 使用者盲測滿意度（4 分制） | 2.79 | — | Claude Haiku 5.5　2.81 |
| 每任務成本（WorkIndex，相對值） | 1× | 旗艦 Hy4　20× | DeepSeek-V4.1-Flash-1017（Max tier）　8× |

:warning: 以上除使用者盲測外均為 Tencent 官方自測；DeepSWE／Terminal-Bench 4.0 數字取自官方附錄圖表，經第三方聚合站（LLMLearner、DataLearnerAI）交叉核對一致，尚未見獨立團隊重現。

## 與前代/競品比較

跟自家旗艦 Hy4 比，Hy4 flash 在長程軟體工程類任務（Terminal-Bench 4.0 19.2 vs 44.4、ProgramBench 16.0 vs 30.0）明顯落後，Tencent 官方也直接建議複雜 coding 任務改用旗艦 Hy4，Hy4 flash 只打「日常工作」這個定位：深度搜尋、文件處理、PPT 生成、簡單前端畫面、computer use。

跟 DeepSeek-V4.1-Flash-1017 比，Hy4 flash 的差異化純粹在成本——WorkIndex 任務成本只要對方的 1/8，但 Tencent 沒有公開兩者在同一組 benchmark 上的直接分數對照，只給了成本倍數，所以「划算」能確認，「哪個更聰明」目前答不出來。

定價策略很直白：Hy4 flash 的官方定價是旗艦 Hy4 的 1/12（input）、1/9（output）、1/15（cache），而且 2026-11-30 前在 Tencent Cloud TokenHub 再打五折——這跟 Qwen、DeepSeek 近期的「旗艦打智能、flash 打價格」兩層產品線策略是同一套打法，差別在 Tencent 把 Engram 這個查表式參數也算進「總參數」，224B 的數字裡有 64B 根本不吃 attention 運算，換算活躍參數其實只有 12B，比帳面數字看起來精簡。

## 對 Agent 開發的意義

Hy4 flash 的 DFly2 投機解碼值得單獨注意：草稿模型直接共用主模型的 sparse attention 索引選取結果（Index Share）而不是重新算一次，这代表它能在長 context 場景維持投機解碼的加速效果而不會隨 context 長度增加額外開銷——對需要長 context 的 Agent 任務（讀整個 repo、長文件問答）是比單純堆大 context window 更實際的工程選擇。

- 如果你在做高頻、低複雜度的 Agent 任務（表單填寫、文件轉換、簡單網頁操作）：Hy4 flash 的成本結構（旗艦 1/20、DeepSeek flash 1/8）讓它適合當「先篩一輪」的前置模型，複雜案例再升級到旗艦模型
- 如果你在做長程 coding agent：Terminal-Bench 4.0 與 ProgramBench 都明顯輸旗艦 Hy4，不要把 Hy4 flash 當 coding agent 的主模型用
- 不適合：需要可驗證、獨立重現的 benchmark 數字做決策依據的場景——目前 Open Benchmarks 只有圖表沒有官方數字表，得靠第三方聚合站讀圖還原

## 今日收穫

之前看「總參數量」會直接拿來估算模型的運算成本,但 Hy4 flash 的 224B 裡有 64B 是 Engram 這種查表式參數,不吃 attention 運算,活躍參數只有 12B——這提醒我往後看 MoE/查表混合架構的模型,「總參數」跟「推理成本」已經是兩個要分開看的數字,光看帳面參數量會嚴重高估真實算力需求。

## 參考資料

- [Tencent Launches Hy4 flash to Power High-Speed, Cost-Efficient AI Deployment for Everyday Workflows（PR Newswire 官方公告，2026-11-17）](https://www.prnewswire.co.uk/news-releases/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows-302941888.html)
- [tencent/Hy4-flash · Hugging Face（模型卡、架構規格、benchmark 附錄圖表）](https://huggingface.co/tencent/Hy4-flash)
- [Tencent-Hunyuan/Hy4-flash · GitHub](https://github.com/Tencent-Hunyuan/Hy4-flash)
- [Hy4 Flash: Benchmarks, Pricing & Specs | LLMLearner（Open Agent Benchmarks 數字還原）](https://llmlearner.com/models/hy4-flash)
