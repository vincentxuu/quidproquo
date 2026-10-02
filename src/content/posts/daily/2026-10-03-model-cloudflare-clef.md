---
title: "模型卡｜Clef（Cloudflare）"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, model-release, daily, cloudflare, model-family-clef]
lang: zh-TW
description: "Cloudflare 開源決策模型 Clef 與 Clef-flash——用非自回歸的機率打分取代逐字生成，BFCL／BANKING77 等基準全面超越 Typesafe Jev，是一週內第三家推出「決策模型」的廠商"
tldr: "Clef（27B，基於 Qwen3.8-27B 後訓練）與 Clef-flash（9B，基於 Qwen3.5-9B）：64k context window、支援圖片/影片輸入、Clef 定價 $0.24/1M input tokens（Clef-flash $0.09，無 output 計費)、BFCL case exact 98.5%、BANKING77 macro-F1 94.2%、CLINC150+OOS macro-F1 97.4% 均超越 Typesafe Jev；架構上以 prefill-only 打分取代逐 token 生成，接在 Typesafe Jev、OpenAI Decisions API、Amazon Strands Decider 2B 之後，是一週內第三個登場的「決策模型」"
series:
  name: "AI Model Tracker"
  order: 38
glossary:
  - term: "Clef"
    def: "Cloudflare 自研的開源決策模型家族，以 Qwen 為骨幹後訓練、非自回歸架構，一次前向傳遞就能對多個型別化問題輸出機率分佈"
---

> 🌏 [English version](/en/posts/daily/2026-10-03-model-cloudflare-clef-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `@cf/cloudflare/clef`（另有輕量版 `@cf/cloudflare/clef-flash`） |
| 廠商 | Cloudflare（Workers AI 團隊） |
| 參數量 | Clef 27B（後訓練自 Qwen/Qwen3.8-27B）；Clef-flash 9B（後訓練自 Qwen/Qwen3.5-9B） |
| Context Window | 65,536 tokens |
| Input 定價 (USD/1M tokens) | Clef $0.24；Clef-flash $0.09 |
| Output 定價 (USD/1M tokens) | 不適用——模型不生成文字，只回傳每個問題選項的機率，官方未提供獨立 output 計費 |
| 開源 | 是（Apache-2.0，權重與推理程式碼皆公開） |
| 發布日 | 2026-10-01 |
| 官方公告 | [Cloudflare Blog：Introducing Clef](https://blog.cloudflare.com/clef-decision-models) |
| HuggingFace | [Cloudflare/clef](https://huggingface.co/Cloudflare/clef)、[Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash) |
| 家族 | Clef（Cloudflare 首個自研 ML 模型家族） |

## 能力亮點

- **架構上跳脫逐 token 生成**：Clef 用 Qwen backbone 做一次 prefill，再用一個獨立的「joint schema head」對所有合法選項平行打分，整個決策是非自回歸的——沒有中間文字生成，也沒有輸出解析這一步
- **原生支援多模態輸入**：接受文字、JSON、圖片（最多 4 張）、影片，這是 Clef 相對 Jev（純文字）的差異化賣點，官方以網域威脅分類（結合 Browser Rendering）為實測案例，2.2 秒完成抓取＋渲染＋分類，比自家最快的通用 LLM gpt-oss-120b（4.7 秒、且只回兩個分類）快超過 2 倍
- **在多數分類型基準上超越 Jev**：BANKING77 macro-F1 94.2%（Jev 79.7%）、CLINC150+OOS macro-F1 97.4%（Jev 89.3%）、Home appliance 模拟器 case exact 準確率 83.0%／Clef-flash 97.7%（Jev 52.3%）
- **託管在 Cloudflare 邊緣 GPU 上**：透過 Workers AI 部署，官方強調低網路延遲，可以把 Clef 放進 Agent 決策的 hot path，再接另一個 Workers AI 上的 LLM 執行動作

## Benchmark 表現

| Benchmark | Clef | Clef-flash | 競品最強（Jev） |
|---|---|---|---|
| BFCL（case exact accuracy） | 98.5% | **98.8%** | 95.8% |
| BANKING77（macro-F1） | **94.2%** | 90.9% | 79.7% |
| CLINC150+OOS（macro-F1） | **97.4%** | 66.8% | 89.3% |
| ToolRet（nDCG@10） | **69.2** | 66.4 | 65.3 |
| Median latency（ms，越低越好） | 209.3 | **38.8** | 524.1 |

⚠️ 以上均為 Cloudflare 官方跑的內部 Decision Index 0.2.1 測試集，尚無獨立第三方覆現；其中 GPQA Diamond、MMLU-Pro、BBH 等需要深度推理的測試上 Clef 反而明顯落後 Jev（例如 BBH：Clef 73.7% vs Jev 92.9%），顯示 Clef 犧牲了部分通用推理能力去換取分類任務的速度與精準度。

## 與前代/競品比較

Clef 是 Cloudflare 的第一個自研 ML 模型，沒有「前代」可比，只能放進決策模型這個新類別裡看。跟目前唯一有公開基準對照的對手 Typesafe Jev 比，Clef 在偏「分類」的任務（BANKING77、CLINC150、Home appliance 模擬器）全面領先，但在偏「深度推理判斷」的任務（BBH、MMLU-Pro、GPQA Diamond）反而輸給 Jev 兩位數百分點——這呼應了兩家模型選擇的 backbone 不同：Jev 架構未公開，Clef 直接站在 Qwen3.8-27B／Qwen3.5-9B 上後訓練，繼承了 Qwen 在分類任務的優勢，但也繼承了它在某些推理基準上的弱點。

定價策略上 Clef（$0.24/1M input）比 Jev（$0.042/1M input）貴了近 6 倍，但 Clef 開源、Jev 目前僅開放 API 搶先體驗；Clef 多了圖片／影片輸入能力，Jev 目前仍只支援文字。

值得注意的時間點：Cloudflare 公告當天，Amazon 也發佈了自己的決策模型 Strands Decider 2B，OpenAI 兩天前才上線 Decisions API 限量預覽——三家平台廠商在一週內各自推出「決策模型」，顯示這已經從單一新創（Typesafe）的概念驗證，變成巨頭們認定值得卡位的新產品線。

## 對 Agent 開發的意義

Clef 把自己定位成 Agent 工作流裡的「路由層」，而不是取代生成式 LLM。

- 如果你在用 Cloudflare Workers 做 Agent：Clef 已經原生整合進 Workers AI（`env.AI.run("@cf/cloudflare/clef", ...)`），不需要額外串接第三方 API，而且 API 格式與 Jev／SystemOne 相容，兩者可以互換測試
- 如果你的 Agent 需要對圖片或影片內容做分類路由（如客訴附圖判斷優先級、合規稽核影像篩選）：這是目前唯一同時開源、支援多模態、API 相容 Jev 的決策模型，Jev 做不到這一步
- 如果你本來就在用 LLM 做純文字分類（情緒標註、工單分派、意圖判斷）：BANKING77／CLINC150 等基準顯示 Clef 準確率明顯優於 Jev，且因為開源，可以自行用 RL 微調（Cloudflare 同步推出的 fine-tuning 服務）貼合自己的標籤體系
- 不適合：需要深度多步推理才能下判斷的場景（法律文件因果推論、複雜財報分析），BBH／GPQA Diamond 的落差說明 Clef 的「快」是用犧牲深推理能力換來的；也不適合已經鎖定 Jev 生態、且不需要圖片輸入的團隊——純文字分類兩者基準互有勝負，換模型的遷移成本不一定划算

## 今日收穫

一週內 Typesafe、OpenAI、Amazon、Cloudflare 四家各自端出「決策模型」，但 Clef 的基準數據也同時暴露了這類模型的共同取捨：分類類基準分數全面提升，深推理類基準分數反而全面下滑。這提醒我，評估「決策模型」不能只看官方主打的分類準確率，要先確認自己的 Agent 工作流屬於哪一類判斷，再挑對應強項的模型。

## 參考資料

- [Cloudflare Blog：Introducing Clef: our open-source decision models, and new RL fine-tuning platform](https://blog.cloudflare.com/clef-decision-models)
- [HuggingFace：Cloudflare/clef](https://huggingface.co/Cloudflare/clef)
- [HuggingFace：Cloudflare/clef-flash](https://huggingface.co/Cloudflare/clef-flash)
- [Cloudflare Workers AI 文件：clef 模型頁（定價／參數）](https://developers.cloudflare.com/workers-ai/models/clef)
- [Cloudflare Workers AI 文件：clef-flash 模型頁（定價／參數）](https://developers.cloudflare.com/workers-ai/models/clef-flash)
- [Clef Decision Index 即時基準展示站](https://clef-evals.workers-ai-mle.workers.dev/)
- [flaviocopes.com：A deep dive into Clef, Cloudflare's decision model](https://flaviocopes.com/clef)
- [AI Weekly：Cloudflare Open-Sources Clef, Beats Jev Latency on Edge GPUs](https://aiweekly.co/alerts/cloudflare-open-sources-clef-beats-jev-latency-on-edge-gpus)
- [本站模型卡：Jev（TypeSafe AI）](/posts/daily/2026-09-19-model-typesafe-ai-jev)
