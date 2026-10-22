---
title: "決策模型怎麼選：Jev、Decider、d1-ultra、mammoth-1 與其他十幾家"
date: 2026-10-22
category: tech
type: deep-dive
tags: [decision-model, model-selection, agent-evaluation, open-weights]
lang: zh-TW
tldr: "決策模型把一般 LLM 的「生成一段文字、你再自己解析」換成「你先把選項列好，模型直接回每個選項的機率」。TypeSafe 在 2026-09-15 提出 System One 之後，一個多月裡這類模型從一家變成十幾家：Jev 1.14、OpenAI Decisions API、Perplexity Decider v1.2、Microsoft-Decision-1、Liquid d1-ultra、Base Labs mammoth-1、vLLM d3、StartLux、Fastino GLiDE、Celeris-1 Decision、Inception Mercury Decide、Cloudflare Clef。兩張榜單給的答案幾乎相反——社群 Jev Decision Index 0.4.1 冠軍是 GLiDE V1.2（71.5），獨立 Artificial Analysis Decision Index 冠軍是 d1-ultra（65.2）、Jev 1.14 只有 57.1。決策模型贏在分類與工具選擇，輸在知識與推理，而且普遍過度自信。"
description: "決策模型（decision model）選型指南：十幾家模型的版本矩陣、Jev Decision Index 與 Artificial Analysis Decision Index 兩張榜單的差異、成本與延遲、授權與自架門檻，以及接進 Agent 後真正會出事的三個地方——包括 prompt injection 與過度自信的門檻設定。"
draft: false
series:
  name: "AI 模型家族"
  order: 33
glossary:
  - term: "決策模型（decision model）"
    definition: "吃一個狀態與一組型別化問題，回傳每個合法選項的機率，而不是生成文字。2026 年 9 月 TypeSafe 把它命名為 System One 模型類別，接著一個多月就變成獨立品類。"
  - term: "System One API"
    definition: "決策模型的事實標準請求格式：POST /v1/systemone，body 是 state 加上 questions，每題用 type 指定 choice、noul 或 score，答案是每個選項的機率。各家另有自己的 confidence 欄位，定義並不一致。"
  - term: "校準（calibration）"
    definition: "模型給的機率與它實際答對的比率是否一致。決策模型拿來設自動放行門檻，所以校準比平均準確率更關鍵；常見指標是 ECE（期望校準誤差）與 Brier score。"
---

> 🌏 [English version](/posts/tech/2026-10-22-ai-model-family-decision-models-en)

決策模型（decision model）把一般 LLM 的「生成一段文字，你再自己寫 parser」換成「你先把選項列好，模型直接回每個選項的機率」。TypeSafe 在 2026 年 9 月 15 日提出 System One 之後，到 10 月 21 日，這個類別已經從一家變成十幾家：[Jev 1.14](https://docs.typesafe.ai/models)、[OpenAI 的 Decisions API](https://developers.openai.com/api/docs/guides/decisions)、[Perplexity Decider v1.2](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)、[Microsoft-Decision-1](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/)、[Liquid d1-ultra](https://www.liquid.ai/blog/d1-ultra)、[Base Labs 的 mammoth-1](https://huggingface.co/baselabs/mammoth-1)、[vLLM 的 d3](https://huggingface.co/vllm-sr/d3)、[StartLux-Decision](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)、[Fastino GLiDE](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model)、[Celeris-1 Decision](https://celeris.ai/pricing)、[Inception Mercury Decide](https://docs.inceptionlabs.ai/get-started/models)、[Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models)。

如果你做的是「有限選項的判斷」——工單派給哪一隊、這段文字是不是垃圾、這個工具呼叫能不能放行——這批模型值得看；如果你要的是知識與推理，榜單數字會直接告訴你別用。這篇給的是版本矩陣、兩張不能混著看的榜單各在量什麼、以及接進去之後真正會出事的三個地方。

## 決策模型是什麼：把「生成文字」換成「回傳機率」

[TypeSafe 在 2026 年 9 月 15 日提出 System One 模型](https://typesafe.ai/blog/introducing-system-one-models-and-jev)時的說法是：結構化的程式狀態進去，有型別、有機率的決策出來。Jev 是第一個實作，後來整個類別都沿用同一套介面。

一次請求長這樣——[System One API](https://docs.typesafe.ai/models) 的 body 是 `state` 加上一組 `questions`，每題用 `type` 指定要什麼答案：

```json
{
  "model": "jev-1.14.0",
  "state": "我這個月被扣款兩次，請退其中一次。",
  "questions": {
    "team": {
      "type": "choice",
      "instructions": "這張工單該交給哪一隊？",
      "criteria": { "billing": "金流與退款", "technical": "產品故障", "other": "以上都不是" }
    },
    "refund": { "type": "noul", "instructions": "客戶在要求退款嗎？" },
    "urgency": {
      "type": "score",
      "instructions": "多急？",
      "criteria": ["可以等", "本週內要處理", "今天要處理"]
    }
  }
}
```

回應不長這樣：

```json
{
  "answers": {
    "team": { "type": "choice", "choice": "billing", "probabilities": { "billing": 0.8, "technical": 0.15, "other": 0.05 }, "confidence": 0.7 },
    "refund": { "type": "noul", "noul": 0.97 },
    "urgency": { "type": "score", "score": 1.7, "confidence": 0.55, "legend": { "0": "可以等", "1": "本週內要處理", "2": "今天要處理" }, "probabilities": { "0": 0.1, "1": 0.1, "2": 0.8 } }
  },
  "usage": { "input_tokens": 120, "output_tokens": 12 }
}
```

三個重點決定了它跟 LLM 的差別。第一，**輸出是固定欄位，不是自由文字**——沒有東西要 parse，也沒有「型別不符」這種失敗模式，你寫的 schema 跟模型輸出的型別天生一致；而 output token 也不計價，TypeSafe 官方寫得很直白：「You pay per input token. Output tokens are free.」[OpenAI 的 Decisions API](https://developers.openai.com/api/docs/guides/decisions) 同樣沒有 output 與 cache 費用。（順帶一提，常見的誤解是「output token 是零」：TypeSafe 官方範例裡 `usage.output_tokens` 是 12，d3 的範例才是 0。真正值得記的是「不計價」，不是「是零」。）第二，**每個選項都有分數**，所以你可以設門檻：0.9 以上自動放行、以下轉人工。第三，**三種題型有明確分工**：`choice` 從有限選項挑一個、`noul` 是某個陳述為真的機率、`score` 回傳有序尺度上的機率加權位置（所以分數可以落在兩個級別之間）。

**但 `confidence` 這個欄位跨廠不一致，這是最容易踩的坑。** TypeSafe 跟 Baseten 的 `confidence` 是「正規化集中度」：choice 的公式是 `(p_max − 1/n) / (1 − 1/n)`，上面那個三選一的例子 p_max = 0.8，所以 confidence = (0.8 − 1/3) / (1 − 1/3) = 0.7；`noul` **完全沒有** confidence 欄位；`score` 的 confidence 算的是離散程度（MAD），不是機率。vLLM 的 [d3](https://huggingface.co/vllm-sr/d3) 走的是另一套：`confidence` 就是被選中那一項的機率本身，而且它的 noul 會多回 `probabilities: {yes, no}`。OpenAI 的 choice／score 有回 confidence，但公式沒有公開。

所以實務結論只有一句：**門檻掛在 `probabilities[choice]`，不要掛在 `confidence`。** Baseten 的文件也是這樣寫：「To apply a probability threshold to a choice, use `probabilities[choice]`」。

為什麼是現在？[Microsoft 的說法最直白](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/)：一條流程裡有二十個連續判斷，每個多 100 毫秒就是多兩秒。這種「小決定」以前只能用前沿 LLM 做，等於每次都花生成一整段文字的錢去換一個是非題。決策模型把這段成本砍掉，換來的代價是——它只會在有限選項裡選，不會寫理由，也不會自己推理。

## 十幾家決策模型，長什麼樣

分成兩類看會比一張大表有用：**有權重可以自己養的**，跟**只能走託管 API 的**。後者的成本是固定的服務費，前者的成本是 GPU。

**開源權重、可自架**

| 模型 | 底盤與參數 | 模態 | 授權 | input 價 | 關鍵差異 |
|---|---|---|---|---|---|
| [Decider v1.2 (27B)](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) | Qwen3.8-27B | 文字＋圖片（≤1.6MP） | Apache-2.0 | $0.02/1M | 支援 joint request：一段序列問完所有題，每題在 marker token 讀出；模型卡自曝有拿官方 benchmark 的 training split 訓練（已與 test 去污染） |
| [Decider Flash v1.2 (4B)](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) | Qwen3.5-4B | 文字＋圖片 | Apache-2.0 | $0.01/1M | 從 27B 蒸餾，學的是完整機率分佈；決策模型裡 input 單價最低的一檔 |
| [d3（Decision 3.0）](https://huggingface.co/vllm-sr/d3) | Qwen3.8-27B，含 0.46B vision | 文字／JSON＋圖片＋影片 | Apache-2.0 | 自架 | 讀影片（2 fps、全片最多 32 幀、每幀 ≤0.2MP）；vLLM v0.32.0（10-18）已內建 `/v1/systemone` 且預設開啟，官方點名跑的是 clef-omni、d1-3B、DiffusionGemma；d3 自己那筆合併（10-14 進 main）不在 v0.32.0 這條線上，跑 d3 仍要 nightly |
| [StartLux-Decision v1.1](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) | 0.8B–27B，Instant 與 AutoThink 兩種 | 文字（可＋圖） | **CC BY-NC 4.0**（商用要另外談） | 自架 | AutoThink 會在沒把握時先寫一段思考再重新評分；單次讀取最多 26 個選項 |
| [mammoth-1 (27B)](https://huggingface.co/baselabs/mammoth-1) | Qwen3.5-27B 全參數微調 | 文字 | 模型卡標 MIT（但 repo 內沒有 LICENSE 檔） | Baseten 託管試用一週 | 訓練目標含 Brier 校正項，並且真的教會模型回答「我不知道」；訓練資料未公開 |
| [elephant-1 (9B)](https://huggingface.co/baselabs/elephant-1) | Qwen3.5-9B 全參數微調 | 文字 | 模型卡標 MIT（同樣沒有 LICENSE 檔） | Baseten 託管試用一週 | 9B 級；作者自陳訓練用了 Decision Index 的 train split |
| [d1-3B](https://huggingface.co/LiquidAI/d1-3B) | LFM2.5-VL-3B | 文字＋圖片 | LFM Open License | 自架 | 邊緣單題 16 毫秒（Jetson AGX Thor）、GPU 單題 8 毫秒（RTX 4090）；模型卡語言欄列了 16 種、含中文 |
| [Strands Decider 2B](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21) | Qwen3.5-2B + LoRA + 讀出頭 | 文字（視覺是選用套件） | Apache-2.0 | 自架 | 訓練配方、資料清單與評測都開在 GitHub，適合當改模型的起點；本機約 115 毫秒 |
| [Clef 家族](https://blog.cloudflare.com/clef-decision-models) | 27B／9B／30B-A3B | 文字／JSON＋圖片＋影片＋音訊 | Apache-2.0 | $0.24／$0.038／$0.15 | Workers AI 託管同時開源；細節見[另篇](/posts/tech/2026-10-22-ai-model-family-cloudflare) |

**只有託管 API**

| 模型 | 廠商 | 模態 | input 價 | 關鍵差異 |
|---|---|---|---|---|
| [Jev 1.14](https://docs.typesafe.ai/models) | TypeSafe | 文字 | $0.042/1M | 每請求 64k、每題 32k；開 long-context header 兩者都到 262k，但官方說更慢也更不準；英文是主要訓練語言，CJK 可用但不等好 |
| [gpt-6-luna (Decisions API)](https://developers.openai.com/api/docs/guides/decisions) | OpenAI | 文字＋圖片 | $0.10/1M | 10-06 開放 public beta，目前只有這顆模型；無 output 與 cache 費用；支援 ZDR 與 HIPAA，資料落地美國與歐洲（EEA 與瑞士） |
| [Microsoft-Decision-1](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/) | Microsoft | 文字 | $0.042/1M | 後訓練 Qwen3.5-9B；OpenRouter 上的 id 是 `microsoft/microsoft-decision-1`，走 alpha decisions 端點而非一般 chat API；官方自報 36 個基準、近 15 萬題盲測最高分、量測中最快，並說未來會 rebase 到 MAI 與 OpenAI 的模型 |
| [d1-ultra](https://www.liquid.ai/blog/d1-ultra) | Liquid | 文字＋圖片 | $0.042/1M | 基於較大的開放權重底盤加客製；每題各自計價（圖片按 32×32 patch 算 1.5 token，1024×1024 是 1536 token）；只有 API |
| [GLiDE](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model) | Fastino | 文字＋JSON | $0.15/1M | 會思考的決策模型：不確定時才多算；context 40k，超長直接拒絕不截斷；底盤未公開、權重也還沒放出來 |
| [Celeris-1 Decision](https://celeris.ai/pricing) | Celeris | 文字＋結構化＋圖片 | $0.04/1M | 明說可以附一句話解釋（要另外指定才有） |
| [Mercury Decide](https://docs.inceptionlabs.ai/get-started/models) | Inception | 文字／JSON／圖片 | $0.02/1M（牌價 $0.04） | 端點是 Inception 自己的 `POST /v1/decisions`、model `mercury-decide`，比 System One 多一種 `extract` 題型（抽原文片段）；OpenRouter 頁面寫「每秒最多 14 個決策」、2026-09-30 上線、66K context |

價格單位都是每百萬 input token、output 不計價，這是整個類別共同的定價結構：**你買的是輸入的 token，不是模型寫出來的字**。[Perplexity 的模型卡](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)另外寫了一句值得記在選型表裡的話：他們把官方 benchmark 的 training split 一起訓練進去（已與 test set 去污染），理由是「不這樣做的模型在榜單上會被不公平地比下去」。這是廠商自己寫的，你該知道它在比什麼。

## 兩套榜單，答案幾乎相反

現在有兩個東西都叫「決策模型榜單」，量的東西不同、跑出來的名次也幾乎相反。**它們的分數不能互換、不能加總、不能拿來說「誰比較強」。**

**社群 Jev Decision Index 0.4.1**——[Hugging Face 上由社群維護的 Space](https://huggingface.co/spaces/multimodalart/jev-decision-index)，追的是「TypeSafe 的 Jev 被各路開源重現成什麼樣子」。2026-10-22 05:40 UTC 的資料快照：226 列模型（其中 224 列是第三方重現，Jev 1.13 與 1.14 是原廠對照列）、42 個基準（其中 37 個進公開面板）、五個領域、11 萬次請求（10 萬 9,759 次可計分），全部跑在一張 RTX PRO 6000 上。頭條的 Full score 是 60% 私有同技能測試加 40% 私有新領域任務，再映射回公開尺度；公開基準照跑但不計分，私有測試從不公開。這是社群維護的 Space，**不是 TypeSafe 官方，也不是 Jev 的正式榜單**。

榜單的名次用 0.9 分的同分帶，所以並列會共用一個名次（站上顯示成 `=3`、`=10`）：

| 榜單名次 | 模型 | Full score | 公開子集 |
|---|---|---|---|
| 1 | Fastino GLiDE V1.2 | 71.52 | 71.99 |
| 2 | Jeffan-31b-1710 | 69.75 | 73.13 |
| =3 | baselabs mammoth-1 (27B) | 68.44 | 75.34 |
| =3 | Perplexity Decider v1.2 (27B) | 67.98 | 67.74 |
| =3 | AutoTrust-JEV-27B v1.1 | 67.95 | 67.32 |
| =3 | StartLux-Decision v1.1 27B | 67.92 | 72.88 |
| =4 | vLLM-SR d3-turbo v1.1 (27B) | 67.31 | 71.62 |
| =4 | vLLM-SR d3 (27B) | 67.15 | 65.45 |
| =10 | baselabs elephant-1 (9B) | 60.26 | 72.24 |
| =10 | Jev 1.14（榜單參照） | 60.24 | 60.70 |
| =15 | Cloudflare clef | 54.92 | 61.71 |
| =43 | Strands Decider 2B | 20.72 | 25.41 |

這張表的兩個重點。第一，**開源重現的整體水準已經高過原始的 Jev**——226 列裡有 40 列的分數比 Jev 1.14 高，而榜單上排第一的 GLiDE V1.2 是 27.8B 全參數微調、底盤未公開、權重也還沒放出來（模型庫是私有的，實驗室是用作者分享的權重跑的）。第二，**公開子集和 Full score 的名次幾乎不一樣**：mammoth-1 的公開子集 75.34 排第一，Full score 卻掉到 =3。廠商模型卡上寫的「Decision Index 0.3 公開子集 72.83／68.09」這類數字，跟 0.4.1 的 Full score 根本不是同一個東西——[d3 的卡](https://huggingface.co/vllm-sr/d3)說自己在 0.3.2 版「66.3、官方文字榜第一」，那是 10-12 的快照，榜單版本一換就沒有意義了。

**Artificial Analysis Decision Index v1.0**——[獨立第三方](https://artificialanalysis.ai/articles/artificial-analysis-decision-index)，10-13 上線，四個評測各佔 25%：知識與幻覺（AA-Omniscience-Decision，正確率與不亂猜率各佔一半）、推理（HLE-MultiChoice）、工具選擇（When2Call）、安全分類（WildGuardTest）。它的母體跟社群榜不同：榜上有託管-only 的模型（gpt-6-luna、d1-ultra、Microsoft-Decision-1、Mercury Decide、Celeris-1 Decision），也有 Baseten 託管的 Elephant 9B；但沒有 StartLux、d3、mammoth-1。

| 模型 | DI | 知識 | 不亂猜 | 推理 | 工具 | 分類 |
|---|---|---|---|---|---|---|
| d1-ultra | 65.2 | 31.6 | 84.5 | 15.0 | 92.6 | 95.4 |
| Elephant 9B | 64.7 | 11.6 | 93.2 | 18.3 | 94.8 | 93.3 |
| Jev 1.13 | 57.5 | 34.6 | 35.2 | 20.9 | 80.7 | 93.6 |
| Jev 1.14 | 57.1 | 33.8 | 37.2 | 18.9 | 80.8 | 93.1 |
| Decider v1.2 | 56.2 | 39.4 | 16.5 | 14.6 | 87.7 | 94.4 |
| Decider v1.1 27B | 53.1 | 39.8 | 13.3 | 15.4 | 76.5 | 93.8 |
| GLiDE | 53.9 | 36.4 | 16.4 | 10.5 | 83.7 | 95.1 |
| Microsoft-Decision-1 | 53.8 | 28.2 | 39.8 | 10.9 | 81.9 | 88.2 |
| Mercury Decide | 52.7 | 35.0 | 32.0 | 10.1 | 79.3 | 88.0 |
| Celeris-1 Decision | 52.3 | 37.8 | 0.0 | 13.3 | 83.7 | 93.3 |
| d1 | 50.3 | 41.0 | 1.7 | 11.5 | 77.4 | 90.9 |
| Decider Flash v1.2 | 50.2 | 35.2 | 6.5 | 12.1 | 74.4 | 93.3 |
| Clef | 48.6 | 39.0 | 4.3 | 11.1 | 71.0 | 90.7 |
| gpt-6-luna (Decisions) | 48.5 | 40.6 | 10.1 | 11.7 | 74.1 | 82.8 |
| Clef-Flash | 45.8 | 32.6 | 2.7 | 10.3 | 64.4 | 90.9 |
| Clef-Omni | 44.3 | 36.0 | 1.6 | 9.0 | 62.1 | 87.2 |
| Claude Opus 5.5 (Max) | 79.0 | 93.4 | 30.3 | 70.2 | 90.5 | 93.5 |
| Claude Haiku 5.5 (Low) | 60.6 | 52.4 | 54.6 | 23.6 | 72.6 | 92.6 |
| GPT-6 Luna (Low) | 55.2 | 66.0 | 0.0 | 22.2 | 77.0 | 88.5 |

（知識與不亂猜是百分比，其餘是準確率或 F1；決策模型 16 列、語言模型 15 列，分數取自 2026-10-22 的榜單頁面，榜單會動。）

兩張榜單的落差，來自它們問的問題不同：社群榜問「重現 Jev 這種模型能做到多好」，Artificial Analysis 問「拿去做分類、工具選擇、知識問答、安全判斷各是什麼水準」。第三個數字是廠商自報，而它最容易過期：[Base Labs 在 10-21 的部落格](https://www.baseten.co/blog/the-best-decision-models-in-the-world-mammoth-1-and-elephant-1/)說 mammoth-1 在 Jev Decision Index 0.4 是 208 個模型中的第一（71.24 分），在 Artificial Analysis Decision Index 上是 65.9、elephant-1 是 65.2 並與 d1-ultra 並列第一。10-22 的兩個榜單頁面對不上：社群榜 0.4.1 已經有 226 列、冠軍換成 GLiDE V1.2，mammoth-1 掉到 =3；Artificial Analysis 榜上根本沒有 mammoth-1 那一列，Elephant 9B 是 64.69、d1-ultra 是 65.25，也不是並列。**同一顆模型換一個評測就換一個名次，所以能帶走的結論只有一個：用哪個評測，決定你看到什麼。**

## 能力邊界：分類贏、知識輸、而且普遍過度自信

把 Artificial Analysis 的四個子評測分開看，輪廓很清楚。

**分類與工具選擇，決策模型贏。** 安全分類（WildGuardTest）上，d1-ultra 95.4、GLiDE 95.1、Decider v1.2 94.4，都高於 Claude Haiku 5.5 (Low) 的 92.6 與 GPT-6 Luna (Low) 的 88.5。工具選擇（When2Call）差距更大：Elephant 9B 94.8、d1-ultra 92.6、Decider v1.2 87.7，而 Haiku (Low) 只有 72.6、Luna (Low) 77.0。這兩件事正是決策模型被設計出來的地方。

**知識與推理，決策模型輸。** 知識題（AA-Omniscience-Decision）上決策模型落在 11.6 到 41.0 之間，Claude Haiku 5.5 (Low) 是 52.4、GPT-6 Luna (Low) 66.0、Claude Opus 5.5 (Max) 93.4。推理題（HLE-MultiChoice）上最好的決策模型是 Jev 1.13 的 20.9，Haiku (Low) 23.6、Luna (Low) 22.2、Opus (Max) 70.2。**要知識、要推理，就用 LLM。**

**而且它們普遍過度自信。** 這是 [Artificial Analysis 自己的結論](https://artificialanalysis.ai/articles/artificial-analysis-decision-index)：幾乎所有決策模型給的機率都高於它實際的正確率，而且集中在知識與推理兩項；工具選擇與安全分類兩項相對校準得好。廠商自己也知道：[Perplexity 的模型卡](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)說他們用 1.382 的溫度在保留資料上校正過，開發集上 ECE 0.014、Brier 0.134，但換到沒見過的決策資料上 ECE 大約 0.05——「對我們量過的每一個模型都一樣」。[StartLux 的卡](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)講得更直接：用來挑選或路由的信心值會高估準確率，所以門檻要設在自己政策回傳的答案上，不是設在模型的自信上。

**「我不知道」是這個類別最近最重要的進展，但要先搞懂那一欄是什麼。** AA 的定義是：「hallucination rate 是答錯的題目裡、被用錯答案回答（而不是回『我不知道』）的比例」，所以「不亂猜」講的是**在它答錯的題目裡，有多少比例是坦白說不知道**。把這一欄跟「知識」欄換算成絕對比例，你會得到三個桶：答對、回「我不知道」、以及**自信答錯**——這是本文的換算，AA 沒有公布這個欄位：

| 模型 | 知識答對 | 回「我不知道」 | 自信答錯 |
|---|---|---|---|
| d1-ultra | 31.6 | 57.8 | 10.6 |
| Elephant 9B | 11.6 | 82.4 | 6.0 |
| Jev 1.14 | 33.8 | 24.6 | 41.6 |
| Decider v1.2 | 39.4 | 10.0 | 50.6 |
| Celeris-1 Decision | 37.8 | 0.0 | 62.2 |
| d1（Liquid） | 41.0 | 1.0 | 58.0 |
| Claude Haiku 5.5 (Low) | 52.4 | 26.0 | 21.6 |
| GPT-6 Luna (Low) | 66.0 | 0.0 | 34.0 |

幾個結論直接從這張表出來。**Elephant 9B 的高「不亂猜」不是本事，是它有 82.4% 的知識題直接放棄回答**——正確率只有 11.6，是全表最低。**Celeris-1 Decision 的 0.0 意思是它答錯時從不回「我不知道」**，等於 62.2% 的知識題是自信答錯；d1 也一樣，58% 自信答錯。**而語言模型也會說不知道**：Claude Haiku 5.5 (Low) 有 26% 的題目回「我不知道」，但正確率 52.4；GPT-6 Luna (Low) 從不回，卻有 66% 正確率。

10-13 上線當天，榜單寫的是「除了 Microsoft-Decision-1 的 40%、Jev 1.13 的 35%、Mercury Decide 的 32%，其他決策模型都不到 17%」。但 10-14 的 Jev 1.14（37.2）、10-15 的 d1-ultra（84.5）、10-21 的 Elephant 9B（93.2）上榜後，這句話就不成立了。真正的原因是**有模型開始把「不知道」放進訓練目標**。[Base Labs 的訓練配方](https://huggingface.co/baselabs/mammoth-1)裡寫得很直接：把「回答不知道」放進訓練目標，cross-entropy 之外加 Brier 校正項。

對你來說這是選型的硬條件：**如果你要用信心值設自動放行門檻，「會說不知道」的模型比「什麼都敢答」的安全一個數量級。** 但要挑的是「願意承認不知道又還答得對」的那個，不是「什麼都說不知道」的那個。

## 成本與延遲：省下的是哪一段

Artificial Analysis 用「跑完自己那套評測的平均每題成本」換算成每百萬題多少美元，這不是你自己工作流的成本，但橫向比較同一張表內的模型是有效的。

| 模型 | 每百萬題 | 每題中位時間 |
|---|---|---|
| Decider Flash v1.2 | $8 | 110 ms |
| Elephant 9B | $8 | 165 ms |
| Decider v1.2 | $15 | 206 ms |
| d1 | $15 | 299 ms |
| Mercury Decide | $15 | 500 ms |
| Decider v1.1 27B | $17 | 170 ms |
| Microsoft-Decision-1 | $31 | 207 ms |
| Celeris-1 Decision | $32 | 63 ms |
| d1-ultra | $32 | 93 ms |
| Clef-Flash | $32 | 298 ms |
| Jev 1.13 | $42 | 127 ms |
| Jev 1.14 | $42 | 78 ms |
| gpt-6-luna (Decisions) | $79 | 168 ms |
| GLiDE | $119 | 217 ms |
| Clef-Omni | $123 | 172 ms |
| Clef | $199 | 309 ms |
| GPT-6 Luna (Non-reasoning) | $88 | 1136 ms |
| GPT-6 Luna (Low) | $131 | 1500 ms |
| Claude Haiku 5.5 (Low) | $184 | 1434 ms |
| Gemma 4 31B (Reasoning) | $624 | 14388 ms |
| Claude Opus 5.5 (Max) | $51,295 | 3571 ms |

三個可以直接拿去用的結論。**一是量級差**：最便宜的決策模型（Decider Flash v1.2 與 Elephant 9B，各 $8）比最便宜的語言模型對照（GPT-6 Luna Non-reasoning，$88）便宜 11 倍，比 Opus (Max) 便宜六千多倍。**二是「決策模型一定比較便宜」不成立**：最貴的決策模型 Clef 每百萬題 $199，比 Claude Haiku 5.5 (Low) 的 $184 還貴，也比 GPT-6 Luna (Low) 的 $131 貴；貴的原因是牌價——Clef 的 input 單價 $0.24/1M 就是全表最貴那一檔，而 Decider Flash 的 $0.01/1M 讓它落在最便宜的位置。**三是延遲是全面獲勝**：決策模型 63–500 ms，語言模型 1,136–14,388 ms。

但這兩欄不是同一個基準，AA 自己寫了：「Decision models are billed for input tokens only, and language models for input and output tokens」——語言模型那欄把輸出文字的錢算進去了，所以它比「做同一個決策」要貴。

自架的錢算在別的欄位。[d3 的卡](https://huggingface.co/vllm-sr/d3)寫著單一副本在 MI325X 上吃 65.4 GiB 顯存；[StartLux](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) 的 27B BF16 要一張 H200，但 4-bit MLX 版能在 64 GB 的 M5 Pro 上跑——代價是同樣 1,024 token 的提示，H200 上 vLLM BF16 是 98 毫秒，M5 Pro 上 MLX 4-bit 是 3,308 毫秒（約 34 倍），而 MLX 的 BF16 在 64 GB 根本放不下；[d1-3B](https://huggingface.co/LiquidAI/d1-3B) 在 Jetson AGX Thor 上單題 16 毫秒、三題 20 毫秒，RTX 4090 上單題 8 毫秒。如果你的量是「每分鐘幾百次」，託管 API 的帳單通常還是比一張 GPU 便宜；如果是「每秒幾百次」或資料不能離開機器，自架才划算。

## 接進 Agent：三個實作重點

先看整體路由長什麼樣。決策模型接進 Agent 的標準形狀是：把狀態與型別化問題送出去，拿回每題的機率分佈，然後**由你的政策**決定要不要自動放行：

```diagram
title: 決策模型的門檻路由
desc: 送出狀態與型別化問題，模型回傳每題的機率分佈，再依門檻分成自動放行與轉人工複核兩條路，最後都留下可稽核的決策紀錄。
caption: 簡化示意：門檻值與「轉人工」的條件都是應用端的政策，不是模型決定的。
step: 送出 state 與型別化問題
step: 模型回傳每題的機率分佈
step: 跟門檻比：過了就自動放行，沒過就轉人工
step: 兩邊都留下可稽核的決策紀錄
---
<svg viewBox="0 0 640 528">
  <path class="dg-line" d="M280 34V48" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 104V120" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 180V196" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line dg-line--accent" d="M376 244H420" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line dg-line--warn" d="M280 288V316" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M280 376V420" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M512 272V416Q512 424 504 424H284" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M280 428V448" marker-end="url(#arrow)" data-step="4"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="52" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="70" text-anchor="middle" dominant-baseline="central">送出 state 與 questions</text>
    <text class="dg-sub" x="280" y="90" text-anchor="middle" dominant-baseline="central">choice / noul / score</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="160" y="124" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="142" text-anchor="middle" dominant-baseline="central">模型回傳每題的機率</text>
    <text class="dg-sub" x="280" y="162" text-anchor="middle" dominant-baseline="central">每題各有一組分佈</text>
  </g>

  <g data-step="3">
    <path class="dg-box" d="M280 200L376 244L280 288L184 244Z"/>
    <text class="dg-label" x="280" y="238" text-anchor="middle" dominant-baseline="central">機率 ≥ 門檻？</text>
    <text class="dg-sub" x="280" y="258" text-anchor="middle" dominant-baseline="central">看最高那一項</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="424" y="216" width="176" height="52" rx="6"/>
    <text class="dg-label" x="512" y="234" text-anchor="middle" dominant-baseline="central">自動放行</text>
    <text class="dg-sub" x="512" y="254" text-anchor="middle" dominant-baseline="central">套用你的政策</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="160" y="320" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="338" text-anchor="middle" dominant-baseline="central">轉人工複核</text>
    <text class="dg-sub" x="280" y="358" text-anchor="middle" dominant-baseline="central">門檻以下的案例</text>
  </g>

  <circle class="dg-dot" cx="280" cy="424" r="4" data-step="4"/>

  <g data-step="4">
    <rect class="dg-box" x="160" y="452" width="240" height="52" rx="6"/>
    <text class="dg-label" x="280" y="470" text-anchor="middle" dominant-baseline="central">記下這次決策</text>
    <text class="dg-sub" x="280" y="490" text-anchor="middle" dominant-baseline="central">題目・選項・機率・門檻</text>
  </g>

  <text class="dg-edge" x="398" y="232" text-anchor="middle" dominant-baseline="central" data-step="3">是</text>
  <text class="dg-edge dg-text--warn" x="290" y="302" text-anchor="start" dominant-baseline="central" data-step="3">否</text>
</svg>
```

**一、一次呼叫問完所有題，但不要把互相競爭的選項塞在一起——而且這是 27B 的專長，不是通則。** [Perplexity 27B 的 joint request](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) 是這批模型裡最有工程價值的一個設計：所有問題共用一段序列，每題在一個 marker token 上讀出，所以問三題跟問一題差不多貴，問題之間還可以互相看見。官方文件給了什麼時候該合併的判準：同一個決策的不同面向要合併（官方量到的 SATA-Bench +11.3、ACOS +7.8、PhishNChips +5.1），互相競爭的候選要分開送（BFCL −1.1、BRIGHT −2.9、ToolRet −4.8）。同一段 request 裡放「這張單要退多少錢」跟「這張單該退還是不退」，模型會互相影響。**但 4B 的 Flash 正好相反**：官方說它「more accurate with one question per request」，公開分數也是一題一送 60.05 高於 joint 的 58.88，而且 Flash 多題併送會讓 state 重複計費（10,000 token 的 state 問三題會算成約 30,000 input token）。Flash 就照一題一送送。

**二、門檻與人工複核是你的政策，不是模型的。** 決策模型只給分數，「多少分才自動放行」是應用端決定的。[Baseten 的文件](https://docs.baseten.co/inference/model-apis/decision-models)直接給了範例：選項機率 ≥ 0.9 就派工，否則丟人工複核。

```bash
curl -s https://inference.baseten.co/v1/systemone -H 'content-type: application/json' -d '{
  "model": "decision-models/baseten-elephant-9b-latest",
  "state": {"ticket": "我這個月被扣款兩次，請退其中一次。"},
  "questions": {
    "team": {"type": "choice", "instructions": "這張工單該交給哪一隊？",
             "criteria": {"billing": "金流與退款", "technical": "產品故障"}}
  }
}' | jq -r '
  .answers.team |
  if .probabilities[.choice] >= 0.9 then .choice else "manual_review" end
'
```

注意 jq 掛的是 `probabilities[.choice]` 而不是 `confidence`——就是前面講的那件事。

這段程式碼是 Baseten 文件的改寫（我改用中文工單內容與託管端點），本站沒有實際部署這個請求。

還有一個版本陷阱：[Jev 的 `jev-latest` 目前指向 1.13.0，`jev-preview` 才是 1.14.0](https://docs.typesafe.ai/models)，而官方明講「An alias moves when a new release ships, so its answers can change without any change to your code」——如果你照著某個版本調過門檻，就把版本 ID 寫死，不要用 alias。

**三、換廠商的成本很低，但 OpenAI 是例外。** 因為大多數廠商都吃 System One 這套 schema（`state` 加 `questions`，`type` 用 `choice`／`noul`／`score`），換模型通常只改 `model` 欄位。例外是 OpenAI：它叫 `predicate`、端點是 `/v1/decisions`、`questions` 是陣列而且每題要有 `name`、狀態欄位叫 `input`、選項是 `choices` 陣列（`{value, description}`）而不是 `criteria` map、有 `refusal` 這種回應型別。要在同一個 codebase 裡放多家，包一層 adapter 是最省事的做法。

另外三個容量限制記一下：StartLux 單次讀取最多 26 個選項，超過會分組；Perplexity 允許 255 個；[Jev 每請求 64k、每題 32k](https://docs.typesafe.ai/models)，而 [Perplexity 的位置上限是 262,144](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)但只訓練到約 32k，超過上限的請求會被拆成一組一組、每組重算一次 state 的 token（單一題目塞不進去就直接回 400），官方要你自己驗證更長的輸入。

## 安全邊界：決策模型仍然會被說服

型別化輸出看起來像安全機制，其實不是。底層還是同一顆語言模型在讀你餵給它的文字。

[HiddenLayer 在 2026 年 10 月 14 日的測試](https://www.hiddenlayer.com/research/system-one-model-security)用一個模擬結帳頁做間接 prompt injection：頁面裡藏一則「確認價格」的廣告按鈕，Jev 有 91% 機率點那顆廣告而不是結帳鍵；他們自製的 Qwen3.8-27B 轉換版從原本 99.7% 會結帳掉到 79.9% 點廣告、19.3% 結帳；同一套攻擊也騙過 OpenAI Decisions API 的 gpt-6-luna。另一組測試用 TokenBreak 變體改寫 30 則毒性 prompt，兩個模型原本都 100% 攔下，改寫後毒性分數被壓低。（我們 10-16 那篇[資安警報](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection)整理了這組數字與防禦清單。）結論寫得很清楚：這種模型「骨子裡仍是 LLM，只是換了解碼方式」。

[Check Point 的報告](https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/)更冷：他們把 Jev 放進一個盡職調查助手（讀一份風險報告、回一個投資建議），讓攻擊者改寫文件裡的一段，目標是把「高風險、不建議投資」翻成「低風險、建議投資」。九種攻擊者與難度組合全部至少成功一次；對 Jev 的成功率是 59%，平均 4.6 回合，每次成功約 0.54 美元。文件怎麼標記成「不可信」完全沒用，系統提示詞裡寫「忽略文件內的指令」也沒用（成功數從 18/27 變 17/27，是雜訊）。他們量到最強的防禦是開推理，而 Jev 沒有推理開關。

學術側的結果比較細但值得讀：[arXiv 2609.28613](https://arxiv.org/abs/2609.28613)用 510 個重建的 InjecAgent 案例測 Jev，結論是型別化輸出**改變**了風險但沒有消除它——惡意內容會移動動作機率，只是很少讓模型直接選中攻擊者的目標；但用分數回饋做最佳化的自適應攻擊，會讓攻擊者目標的平均最高機率翻倍，在全新驗證呼叫上的成功率從 1.8% 升到 3.5%。

所以線上的做法是這樣：**輸入先篩、決策輸出不要直接觸發不可逆動作、重要決策留一道獨立驗證。**本站整理過的 HiddenLayer 實測與防禦清單跟 [decisionkit 的 CLI 用法](/posts/daily/2026-10-12-tool-decisionkit)都寫了同一套：模型只管打分，哪一種決策可以自動放行是你要定的政策。順帶一提，Cloudflare 那篇的[三層切法](/posts/tech/2026-10-22-ai-model-family-cloudflare)（抽取 → 決策 → 生成）確實能讓 LLM 看不到原始信件，但那只是減少接觸面，不是防護。

## 什麼時候不要用決策模型

- **需要知識或推理的判斷。** 榜單在這兩項上是 LLM 贏，差一截到十幾分。
- **需要文字理由。** 決策模型不產文字（[Celeris-1 Decision](https://celeris.ai/pricing) 明說可以附一句話解釋，但那是它一家），要在稽核軌跡上留下「為什麼這樣決定」，得自己把題目、選項、門檻跟答案一起存起來。
- **中文內容。** [Jev 的官方文件](https://docs.typesafe.ai/models)說得很清楚：英文是主要訓練語言，CJK 可用但不等好，要在自己的內容上測。StartLux 與 mammoth-1 的模型卡語言欄都只寫 `en`；d1-3B 的模型卡列了 16 種語言、含中文，但那張卡寫的是底盤的語言支援，不是決策品質的量測。英文流量跟中文流量的決策模型不是同一個問題。
- **高風險動作直接自動執行。** Check Point 與 HiddenLayer 的結果擺在這裡；把決策模型的輸出直接接到「扣款」「放行」「刪資料」上，等於把一個 59% 可被說服的模型接到鉸鏈上。
- **選項會爆炸。** 超過 26 個選項，StartLux 的讀取就得分組；超過 255 個，Perplexity 的接口本身不收。

## 選型速查

| 你的狀況 | 先看哪幾個 |
|---|---|
| 量大、要最便宜、可以自架 | Decider Flash v1.2（$0.01/1M，每百萬題 $8）、d1-3B（邊緣單題 16 毫秒） |
| 想今天就上線、不想養 GPU | gpt-6-luna Decisions、Jev 1.14、Microsoft-Decision-1、Celeris-1 Decision（$0.04）、Decider v1.2（$0.02） |
| 輸入有圖或影片 | d3（圖＋影片）、Decider v1.2 與 d1-ultra（圖）、clef-omni（圖＋影片＋音訊） |
| 判斷本身很難、要先算再答 | GLiDE（會思考，$119 是同類第二貴）、StartLux AutoThink、mammoth-1（Base Labs 說它偏知識、elephant 偏快推） |
| 要用信心值設自動放行門檻 | 先看「自信答錯」那一欄：Celeris-1 Decision 62.2%、d1 58.0% 都不會說不知道；d1-ultra 10.6%、Elephant 9B 6.0% 會，但 Elephant 的知識正確率只有 11.6 |
| 商用授權要 Apache 或 MIT | d3、Decider v1.2／Flash、Strands Decider 2B；**StartLux 是 CC BY-NC，商用要另外談**；mammoth-1／elephant-1 的模型卡標 MIT，但 repo 裡沒有 LICENSE 檔，授權要自己向廠商確認 |
| 已經在用某家的 System One | 換 `model` 欄位就能換；OpenAI 的命名不同，包一層 adapter；Jev 用 alias 會被新版本換掉，寫死版本 ID |

三件上線前一定要做的事：**在自己的資料上量一次 ECE 與不亂猜率**（榜單分數是別人的流量）；**門檻用自己量到的曲線設，不要用 0.9 這個通用值**，而且掛在 `probabilities[choice]` 不是 `confidence`；以及**高風險路徑保留人工複核**，因為你手上有的是一個會被說服的模型。

## 參考資料

- [TypeSafe：Introducing System One Models & Jev（2026-09-15）](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe Docs：Models（Jev 1.14、context、長上下文標頭、alias、語言支援）](https://docs.typesafe.ai/models)
- [TypeSafe Docs：Confidence（各題型的 confidence 定義）](https://docs.typesafe.ai/confidence)
- [OpenAI Docs：Decisions API（提問型態、定價、門檻建議、落地與 ZDR）](https://developers.openai.com/api/docs/guides/decisions)
- [OpenAI Changelog：v1/decisions 於 2026-10-06 開放 beta](https://developers.openai.com/api/docs/changelog)
- [Perplexity Docs：Changelog（Decider v1.2 $0.02、Flash v1.2 $0.01）](https://docs.perplexity.ai/docs/resources/changelog)
- [Hugging Face：pplx-decider-v1.2 模型卡（joint request、校正、訓練資料揭露）](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)
- [Hugging Face：pplx-decider-flash-v1.2 模型卡（蒸餾、一題一送、Decision Index 0.3 公開分數）](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2)
- [Microsoft：Introducing Microsoft-Decision-1（2026-10-09）](https://commandline.microsoft.com/microsoft-decision-1-model-foundry/)
- [OpenRouter：microsoft/microsoft-decision-1（alpha decisions 端點）](https://openrouter.ai/microsoft/microsoft-decision-1)
- [Liquid AI：d1-ultra（2026-10-15）](https://www.liquid.ai/blog/d1-ultra)
- [Hugging Face Blog：Multimodal open d1 decision models for the edge（2026-10-07）](https://huggingface.co/blog/LiquidAI/open-d1)
- [Liquid AI Docs：Decision Models（題型、影像計價、什麼時候用 LLM）](https://docs.liquid.ai/lfm/models/decision-models)
- [Base Labs / Baseten：mammoth-1 模型卡（訓練配方、Brier 校正、「我不知道」選項）](https://huggingface.co/baselabs/mammoth-1)
- [Base Labs：The top ranked decision models in the world（2026-10-21）](https://www.baseten.co/blog/the-best-decision-models-in-the-world-mammoth-1-and-elephant-1/)
- [Baseten Docs：Decision models（門檻分流範例）](https://docs.baseten.co/inference/model-apis/decision-models)
- [vLLM Semantic Router：d3 模型卡（影片輸入、vLLM 支援、速度、顯存）](https://huggingface.co/vllm-sr/d3)
- [vLLM v0.32.0 Release Notes（`/v1/systemone` 端點）](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)
- [StartLux-Decision v1.1 模型卡（Instant／AutoThink、授權、門檻、延遲表）](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)
- [arXiv 2610.17309：StartLux-Decision 技術報告](https://arxiv.org/abs/2610.17309)
- [Fastino：Introducing GLiDE（2026-09-30）](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model)
- [Fastino Docs：GLiDE（定價、context）](https://docs.fastino.ai/concepts/glide)
- [Celeris：Pricing（Celeris-1 Decision）](https://celeris.ai/pricing)
- [Inception Docs：Models（Mercury Decide、v1/decisions 端點）](https://docs.inceptionlabs.ai/get-started/models)
- [Inception Docs：Decisions（extract 題型與限制）](https://docs.inceptionlabs.ai/capabilities/decisions)
- [Strands Decider 2B 模型卡（Apache-2.0、公開訓練資料）](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21)
- [Hugging Face Space：Jev Decision Index（社群榜 0.4.1 與資料）](https://huggingface.co/spaces/multimodalart/jev-decision-index)
- [Artificial Analysis：Decision Index v1.0（2026-10-13，方法與結論）](https://artificialanalysis.ai/articles/artificial-analysis-decision-index)
- [Artificial Analysis：Decision Index 榜單頁（2026-10-22 分數、成本與延遲定義）](https://artificialanalysis.ai/evaluations/artificial-analysis-decision-index)
- [Artificial Analysis：Decision Index 方法學（不亂猜率定義）](https://artificialanalysis.ai/methodology/decision-index)
- [HiddenLayer：Jevil in the details（2026-10-14）](https://www.hiddenlayer.com/research/system-one-model-security)
- [Check Point：A Decision Model Breaks Like Any Other Language Model（2026-09-24）](https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/)
- [arXiv 2609.28613：Decision Hijacking（型別化輸出的注入風險）](https://arxiv.org/abs/2609.28613)
- [Cloudflare：Introducing Clef（2026-10-01）](https://blog.cloudflare.com/clef-decision-models)
- 本站：[Cloudflare 模型家族：Clef 決策模型與 Clairic 抽取模型怎麼選](/posts/tech/2026-10-22-ai-model-family-cloudflare)
- 本站：[資安警報｜決策式模型 Jev 也躲不過 Prompt Injection](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection)
- 本站：[工具推薦｜decisionkit](/posts/daily/2026-10-12-tool-decisionkit)
- 本站：[模型卡｜Jev（TypeSafe AI）](/posts/daily/2026-09-19-model-typesafe-ai-jev)
