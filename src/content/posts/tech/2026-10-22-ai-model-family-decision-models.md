---
title: "決策模型怎麼選：Gemini Decision 1、d1.2-ultra、Drex、Decider 與其他二十家"
date: 2026-10-22
category: tech
type: deep-dive
tags: [decision-model, model-selection, agent-evaluation, open-weights]
lang: zh-TW
tldr: "決策模型把一般 LLM 的「生成一段文字、你再自己解析」換成「你先把選項列好，模型直接回每個選項的機率」。TypeSafe 在 2026-09-15 提出 System One 之後，兩個月內這類模型擴到二十家以上，Google 也在 11-11 推出 Gemini Decision 1。Artificial Analysis 在 11 月把榜單改成 v2，改用同時看對錯與信心的 Decision Score；2026-11-20 的 v2.1 榜上決策模型第一是 Liquid d1.2-ultra（74.8），Gemini Decision 1 是 66.0，但讓語言模型也回機率之後，Claude Haiku 5.5 (Max) 拿到 76.5，高過所有決策模型，代價是每百萬題貴 47 倍、慢 150 倍。決策模型贏在速度、成本與工具選擇，輸在知識與推理。"
description: "決策模型（decision model）選型指南：二十幾家模型的版本矩陣、Artificial Analysis Decision Index v2.1 與社群 Jev Decision Index 兩張榜單的差異、成本與延遲、授權與自架門檻，以及接進 Agent 後真正會出事的三個地方——包括 prompt injection 與過度自信的門檻設定。"
draft: false
series:
  name: "AI 模型家族"
  order: 33
glossary:
  - term: "決策模型（decision model）"
    definition: "吃一個狀態與一組型別化問題，回傳每個合法選項的機率，而不是生成文字。2026 年 9 月 TypeSafe 把它命名為 System One 模型類別，接著兩個月就變成獨立品類。"
  - term: "System One API"
    definition: "決策模型的事實標準請求格式：POST /v1/systemone，body 是 state 加上 questions，每題用 type 指定 choice、noul 或 score，答案是每個選項的機率。各家另有自己的 confidence 欄位，定義並不一致。"
  - term: "校準（calibration）"
    definition: "模型給的機率與它實際答對的比率是否一致。決策模型拿來設自動放行門檻，所以校準比平均準確率更關鍵；常見指標是 ECE（期望校準誤差）與 Brier score。"
  - term: "Decision Score"
    definition: "Artificial Analysis Decision Index v2 的主指標：每題得分 50 ×（1 + c −（p − c）²），p 是模型給選中答案的機率，c 是答對與否。答對在 50 到 100 之間、答錯在 0 到 50 之間，越有把握的錯誤扣越多；整體等於 50 ×（1 + 準確率 − Brier score）。"
---

> :globe: [English version](/posts/tech/2026-10-22-ai-model-family-decision-models-en)

決策模型（decision model）把一般 LLM 的「生成一段文字，你再自己寫 parser」換成「你先把選項列好，模型直接回每個選項的機率」。TypeSafe 在 2026 年 9 月 15 日提出 System One 之後，到 11 月 20 日，這個類別已經從一家變成二十家以上：[Jev 1.14](https://docs.typesafe.ai/models)、[Google Gemini Decision 1](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)、[OpenAI 的 Decisions API](https://developers.openai.com/api/docs/guides/decisions)、[Perplexity Decider v1.3](https://docs.perplexity.ai/docs/decisions/quickstart)、[Microsoft-Decision-1.1](https://commandline.microsoft.com/microsoft-decision-model-ga/)、[Liquid d1.2-ultra](https://www.liquid.ai/blog/d1-2)、[Nace.AI Drex](https://www.nace.ai/drex/decision-index)、[Subquadratic SubQ Snap](https://docs.subq.ai/using-the-api/models/)、[Base Labs 的 mammoth-1](https://huggingface.co/baselabs/mammoth-1)、[vLLM 的 d3](https://huggingface.co/vllm-sr/d3)、[StartLux-Decision](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)、[Fastino GLiDE](https://fastino.ai/blog/introducing-glide-the-first-thinking-decision-model)、[Celeris-1.1 Decision](https://celeris.ai/pricing)、[Inception Mercury Decide](https://docs.inceptionlabs.ai/get-started/models)、[Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models)。

如果你做的是「有限選項的判斷」——工單派給哪一隊、這段文字是不是垃圾、這個工具呼叫能不能放行——這批模型值得看；如果你要的是知識與推理，榜單數字會直接告訴你別用。這篇給的是版本矩陣、兩張不能混著看的榜單各在量什麼、以及接進去之後真正會出事的三個地方。

本文首版寫於 10-22；11-20 這一版把版本矩陣、榜單與成本換成 11 月的資料，10 月的舊數字與為什麼換掉，寫在文末更新紀錄。

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

## 二十幾家決策模型，長什麼樣

分成兩類看會比一張大表有用：**有權重可以自己養的**，跟**只能走託管 API 的**。後者的成本是固定的服務費，前者的成本是 GPU。不少廠商兩邊都有：權重開放、同時提供託管 API，下表依「能不能自架」分。價格是 2026-11-20 讀各家官方頁面的每百萬 input token 牌價，output 一律不計價。

**開源權重、可自架**

| 模型 | 底盤與參數 | 模態 | 授權 | 託管 input 價 | 關鍵差異 |
|---|---|---|---|---|---|
| [Decider v1.3 (27B)](https://docs.perplexity.ai/docs/decisions/quickstart) | Qwen3.8-27B | 文字＋圖片 | Apache-2.0 | $0.02/1M | 11-09 上架，新增 `locate` 題型（從 state 找出符合描述的片段）；context 256K；`pplx-decider-latest` 已指向 1.3 |
| [Decider Flash v1.3 (4B)](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.3) | 4B | 文字＋圖片 | Apache-2.0 | $0.01/1M | 決策模型裡 input 單價最低的一檔；1.2 版官方說一題一送比較準，1.3 改成可以併題 |
| [d3（Decision 3.0）](https://huggingface.co/vllm-sr/d3) | Qwen3.8-27B，含 0.46B vision | 文字／JSON＋圖片＋影片 | Apache-2.0 | 自架 | 讀影片（2 fps、全片最多 32 幀、每幀 ≤0.2MP）；vLLM v0.32.0 起內建 `/v1/systemone` 端點；同系列另有 d3-ultra、turbo、flash、mini 等尺寸 |
| [GLiDE 27B](https://huggingface.co/fastino/GLiDE-27B) | Qwen 系底盤全參數微調 | 文字＋JSON | fastino-community（自訂） | Fastino API | 會思考的決策模型：不確定時才多算；10 月時權重還沒放出來，10-19 起上架 HuggingFace |
| [Drex v2.0](https://huggingface.co/nace-ai/drex-v2.0) | Qwen3.6-35B-A3B | 文字 | Nace.AI Open RAIL-M（自訂，附使用限制） | $0.03/1M | 同家另有 Drex Max v1 權重 repo；目前的 Drex Max v1.1 走託管，見下表 |
| [StartLux-Decision v1.1](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) | 0.8B–27B，Instant 與 AutoThink 兩種 | 文字（可＋圖） | **CC BY-NC 4.0**（商用要另外談） | 自架 | AutoThink 會在沒把握時先寫一段思考再重新評分；單次讀取最多 26 個選項 |
| [mammoth-1 (27B)](https://huggingface.co/baselabs/mammoth-1) | Qwen3.5-27B 全參數微調 | 文字 | 模型卡標 MIT（但 repo 內沒有 LICENSE 檔） | Baseten 託管 | 訓練目標含 Brier 校正項，並且真的教會模型回答「我不知道」；訓練資料未公開 |
| [elephant-1 (9B)](https://huggingface.co/baselabs/elephant-1) | Qwen3.5-9B 全參數微調 | 文字 | 模型卡標 MIT（同樣沒有 LICENSE 檔） | Baseten 託管 | 9B 級；作者自陳訓練用了 Decision Index 的 train split |
| [d1-2B／d1-Omni-2B](https://huggingface.co/LiquidAI/d1-2B) | LFM3-1.7B 骨幹 | 文字＋圖片（Omni 另加音訊） | LFM Open License（年營收 1,000 萬美元以上商用要另談） | 自架 | 10-24 隨 LFM3 釋出，取代較早的 d1-3B；細節見 [Liquid AI 家族文](/posts/tech/2026-10-10-ai-model-family-liquid-ai) |
| [Strands Decider 2B](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v21) | Qwen3.5-2B + LoRA + 讀出頭 | 文字（視覺是選用套件） | Apache-2.0 | 自架 | 訓練配方、資料清單與評測都開在 GitHub，適合當改模型的起點；本機約 115 毫秒 |
| [Clef 家族](https://blog.cloudflare.com/clef-decision-models) | 27B／9B／30B-A3B | 文字／JSON＋圖片＋影片＋音訊 | Apache-2.0 | $0.24／$0.038／$0.15 | Workers AI 託管同時開源；細節見[另篇](/posts/tech/2026-10-22-ai-model-family-cloudflare) |

**只有託管 API**

| 模型 | 廠商 | 模態 | input 價 | 關鍵差異 |
|---|---|---|---|---|
| [Gemini Decision 1](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) | Google | 文字＋圖片＋音訊＋影片＋PDF | $0.10/1M | 11-11 上線；一次請求最多 1,000 題、共用輸入只計一次費、輸入上限 256K；AI Studio 有免費層；請求欄位叫 `input` 不是 `state` |
| [d1.2-ultra／d1.2](https://docs.liquid.ai/lfm/models/d1) | Liquid | 文字＋圖片＋音訊 | $0.042／$0.02 | 11-16 上線，多了讀值、找段落、框物件、估數字、複選五種新題型；d1-ultra、d1.1、d1 已標停用 |
| [Drex Max v1.1](https://www.nace.ai/drex/decision-index) | Nace.AI | 文字 | $0.03/1M | Artificial Analysis 註明它的成本是限時上市價，恢復原價後約加倍 |
| [SubQ Snap 1.2](https://docs.subq.ai/using-the-api/models/) | Subquadratic | 文字＋圖片 | $0.04/1M | context 384K，主打長 context 決策；1.1 版已在 11-11 關閉 |
| [Microsoft-Decision-1.1](https://commandline.microsoft.com/microsoft-decision-model-ga/) | Microsoft | 文字＋圖片 | $0.042/1M（Global） | 11-17 GA，比 1.0 快兩倍以上、新增圖片輸入；US／EU／APAC 資料區價格較高；也在 OpenRouter 與 Vercel |
| [Jev 1.14](https://docs.typesafe.ai/models) | TypeSafe | 文字＋圖片 | $0.042/1M | 每請求 64k、每題 32k，開 long-context header 兩者都到 262k 但更慢也更不準；1.14 新增 `box` 題型；英文是主要訓練語言 |
| [gpt-6-luna (Decisions API)](https://developers.openai.com/api/docs/guides/decisions) | OpenAI | 文字＋圖片 | $0.10/1M | 10-06 開放 public beta；無 output 與 cache 費用；支援 ZDR 與 HIPAA，資料落地美國與歐洲 |
| [Celeris-1.1 Decision](https://docs.celeris.ai/pricing) | Celeris | 文字＋結構化＋圖片 | $0.004/1M | 牌價最低的託管決策模型；可免費附一句話解釋 |
| [Mercury Decide](https://docs.inceptionlabs.ai/get-started/models) | Inception | 文字／JSON／圖片 | $0.02/1M（牌價 $0.04） | 端點是 Inception 自己的 `POST /v1/decisions`，比 System One 多一種 `extract` 題型 |
| [GLiDE（託管）](https://docs.fastino.ai/concepts/glide) | Fastino | 文字＋JSON | $0.15/1M | context 40k，超長直接拒絕不截斷 |

價格單位都是每百萬 input token、output 不計價，這是整個類別共同的定價結構：**你買的是輸入的 token，不是模型寫出來的字**。但牌價不等於每題成本：題目怎麼併、圖片怎麼算 token、有沒有長 context 加價，各家不同，下面成本那節用 Artificial Analysis 的「每百萬題」比較。

[Perplexity 的模型卡](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)另外寫了一句值得記在選型表裡的話：他們把官方 benchmark 的 training split 一起訓練進去（已與 test set 去污染），理由是「不這樣做的模型在榜單上會被不公平地比下去」。這是廠商自己寫的，你該知道它在比什麼。

## 兩套榜單，量的東西不一樣

現在有兩個東西都叫「決策模型榜單」，量的東西不同、名次也對不上。**它們的分數不能互換、不能加總、不能拿來說「誰比較強」。**

**Artificial Analysis Decision Index v2.1**——[獨立第三方](https://artificialanalysis.ai/evaluations/artificial-analysis-decision-index)，每個模型都由 Artificial Analysis 自己跑。10-13 上線的 v1.0 只有四個評測；[11-08 的 v2](https://artificialanalysis.ai/articles/decision-index-v2) 整個改版，私有資料集從 25% 提高到 45%，用來防刷榜：

| 評測 | 量什麼 | 權重 |
|---|---|---|
| AA-Paperclip（私有） | 1,500 份履歷、收據發票、論文，每份 5 個決策＋10 個抽取，15 題全對才算對 | 30% |
| EvalSafe-O*NET-AA | 職場文件的判斷 | 15% |
| When2Call | 該不該呼叫工具 | 10% |
| AA-Omniscience-Decision v1.1（私有） | 知識與幻覺，「我不知道」有十種措辭 | 15% |
| HLE-MultiChoice v1.1 | 推理，可以選擇不答 | 15% |
| AA-Symmetry v1.1 | 選項換順序、換措辭、問題改成否定句之後，答案與機率還穩不穩 | 15% |

主指標也換了：v2 用 **Decision Score**，每題 50 ×（1 + c −（p − c）²），答對落在 50 到 100、答錯落在 0 到 50，越有把握的錯誤扣越多。等於把「準確率」與「校準」合成一個數字，直接對應決策模型的用法——信心過門檻就放行，沒過就轉人工。v2 也拿掉已經飽和的 WildGuardTest，並讓語言模型也對每個選項回機率，兩類模型第一次可以在同一個分數上比。

2026-11-20 從榜單頁讀到的 18 個現役決策模型與 4 個語言模型對照（各子項是 Decision Score，AA-Symmetry 是 Symmetry Score）：

| 模型 | 廠商 | DI | Paperclip | O*NET | When2Call | 知識 | 推理 | Symmetry |
|---|---|---|---|---|---|---|---|---|
| d1.2-ultra | Liquid | **74.8** | **75.8** | 89.5 | **96.5** | 60.8 | 46.4 | 86.3 |
| Drex Max v1.1 | Nace.AI | 72.6 | 72.8 | 88.3 | 95.3 | 60.3 | 46.6 | 79.8 |
| SubQ Snap 1.2 | Subquadratic | 72.6 | 71.6 | 88.6 | 96.1 | 61.0 | 45.6 | 81.4 |
| GLiDE v1.2 | Fastino | 72.5 | 71.4 | 89.7 | 95.1 | 60.9 | 44.6 | 82.1 |
| Mammoth 27B | Base Labs | 71.4 | 64.2 | 88.8 | 95.8 | 58.9 | 47.4 | **88.2** |
| Decider v1.3 | Perplexity | 70.4 | 68.7 | 89.1 | 94.6 | 58.9 | 42.9 | 77.9 |
| d1.2 | Liquid | 68.7 | 62.6 | 86.6 | 96.1 | 60.9 | 44.7 | 76.5 |
| Microsoft-Decision-1.1 | Microsoft | 67.8 | 58.7 | 88.8 | 95.1 | 60.5 | 46.1 | 75.7 |
| Elephant 9B | Base Labs | 66.4 | 52.4 | 87.4 | 95.5 | 56.0 | 45.8 | 84.9 |
| Jev 1.14 | TypeSafe | 66.2 | 57.5 | **91.1** | 84.4 | 60.1 | 44.5 | 74.5 |
| Gemini Decision 1 | Google | 66.0 | 56.8 | 87.1 | 80.5 | **66.3** | **48.7** | 70.5 |
| Decider Flash v1.3 | Perplexity | 64.1 | 53.2 | 84.1 | 90.1 | 55.4 | 40.7 | 80.4 |
| Mercury Decide | Inception | 62.1 | 56.9 | 86.6 | 81.4 | 56.7 | 34.8 | 67.6 |
| Celeris-1.1 Decision | Celeris | 62.0 | 54.5 | 84.6 | 88.7 | 57.6 | 40.3 | 62.5 |
| Drex 2.0 | Nace.AI | 61.6 | 51.9 | 81.9 | 88.7 | 60.5 | 47.1 | 58.1 |
| Clef | Cloudflare | 60.3 | 54.4 | 85.7 | 77.2 | 57.1 | 42.6 | 56.6 |
| gpt-6-luna (Decisions) | OpenAI | 60.2 | 52.9 | 85.2 | 79.5 | 60.2 | 42.6 | 54.9 |
| Clef-Omni | Cloudflare | 57.8 | 50.6 | 81.0 | 70.7 | 56.8 | 42.4 | 56.4 |
| Claude Haiku 5.5 (Max) | Anthropic | 76.5 | 82.7 | — | 84.3 | 74.4 | 54.9 | 68.5 |
| GPT-6 Luna (Max) | OpenAI | 75.7 | 86.9 | — | 82.5 | 66.4 | 44.7 | 72.3 |
| GPT-6 Luna (Low) | OpenAI | 68.8 | 72.9 | — | 81.2 | 67.9 | 34.5 | 69.5 |
| Claude Haiku 5.5 (Low) | Anthropic | 67.2 | 68.7 | — | 76.6 | 68.3 | 46.7 | 63.7 |

（語言模型的 O*NET 欄本文沒有讀到數字，以「—」表示。榜單會動，Drex Max v1.1 與 SubQ Snap 1.2 四捨五入後同為 72.6，未四捨五入前 Drex 略高。）

這張表的三個重點：

- **語言模型在 v2 反而排在最前面。** 讓 Claude Haiku 5.5 與 GPT-6 Luna 也回機率之後，開到最高推理強度的兩者分數高過所有決策模型，主要贏在文件題 Paperclip（82.7、86.9 對 d1.2-ultra 的 75.8）與知識題。決策模型的賣點不是「比較準」，是下一節的速度與成本。
- **Google 的新模型不在前段。** Gemini Decision 1 的知識（66.3）與推理（48.7）是決策模型裡最高，但工具選擇（80.5）與 Symmetry（70.5）拖低總分，排第 11。Google 官方部落格說它在自家選的評測套件「全面領先、校準誤差最低」，跟獨立榜單的結論不一致。
- **Symmetry 分數高可能只是常說「不知道」。** [Artificial Analysis 自己指出](https://artificialanalysis.ai/articles/decision-index-v2)，Base Labs 兩顆模型 Symmetry 領先，主要因為它們常以高信心回「我不知道」，換措辭也照樣回「不知道」，自然很一致。

**社群 Jev Decision Index 0.4.1**——[Hugging Face 上由社群維護的 Space](https://huggingface.co/spaces/multimodalart/jev-decision-index)，追的是「TypeSafe 的 Jev 被各路開源重現成什麼樣子」，**不是 TypeSafe 官方，也不是 Jev 的正式榜單**。頭條的 Full score 是 60% 私有同技能測試加 40% 私有新領域任務，公開基準照跑但不計分，全部跑在一張 RTX PRO 6000 上。2026-11-19 的資料快照有 326 列可計分模型，其中 70 列的分數高於 Jev 1.14 的 60.24；榜首是 karpo-decision-31B（73.86），GLiDE 27B（73.37）緊追。

| 模型 | Full score | 公開子集 |
|---|---|---|
| karpo-decision-31B | 73.86 | 75.05 |
| GLiDE 27B | 73.37 | 72.49 |
| vLLM-SR d3-ultra (27B) | 70.18 | 71.57 |
| baselabs mammoth-1 (27B) | 68.44 | 75.34 |
| Perplexity Decider v1.2 (27B) | 67.98 | 67.74 |
| StartLux-Decision v1.1 27B | 67.92 | 72.88 |
| Perplexity Decider v1.3 (27B) | 67.67 | 69.72 |
| baselabs elephant-1 (9B) | 60.26 | 72.24 |
| Jev 1.14（榜單參照） | 60.24 | 60.70 |
| Cloudflare clef | 54.92 | 61.71 |
| Strands Decider 2B | 20.72 | 25.41 |

兩個觀察：這個榜只收能拿到權重或重現的模型，所以 Gemini、d1.2-ultra、Drex Max 這些託管模型不在上面；而在這個榜上，Decider v1.3 的 Full score 還略低於 v1.2，跟 Artificial Analysis 上 v1.3 比 v1.2 高的方向相反。**同一顆模型換一個評測就換一個名次，所以能帶走的結論只有一個：用哪個評測，決定你看到什麼。** 廠商公告裡引用的榜單分數也最容易過期，引用前要對回榜單本身的日期與版本。

## 能力邊界：工具選擇贏、文件與知識輸、而且會自信答錯

**工具選擇，決策模型贏。** When2Call 的 Decision Score，前段決策模型都在 94 到 96.5，語言模型對照組只有 76.6 到 84.3。這是決策模型最穩的強項。

**文件、知識與推理，最好的語言模型仍然贏。** Paperclip 要求一份文件 15 題全對，[Artificial Analysis 的說明](https://artificialanalysis.ai/articles/decision-index-v2)指出 Drex Max v1.1 單題答對 97%，跟 Claude Haiku 5.5 (Max) 的 99% 很近，但整份全對只有 63%、Haiku 是 92%；決策模型多半輸在決策題，不是抽取題。知識題的 Decision Score，決策模型最高是 Gemini Decision 1 的 66.3，Claude Haiku 5.5 (Max) 是 74.4。**要知識、要長文件的完整正確，就用 LLM 或在決策模型前面接檢索。**

**「我不知道」是這個類別最重要的變數，但要先搞懂那一欄是什麼。** Artificial Analysis 的「不亂猜率」（non-hallucination rate）定義是：在答錯的題目裡，有多少比例是回「我不知道」而不是給錯答案。把它跟知識題正確率換算成絕對比例，就得到三個桶：答對、回「我不知道」、**自信答錯**——這是本文的換算，榜單沒有公布這個欄位：

| 模型 | 知識答對 | 回「我不知道」 | 自信答錯 |
|---|---|---|---|
| Gemini Decision 1 | 44.8 | 27.4 | 27.8 |
| Decider v1.3 | 40.6 | 4.0 | 55.4 |
| Microsoft-Decision-1.1 | 33.2 | 33.0 | 33.8 |
| Jev 1.14 | 31.6 | 32.6 | 35.8 |
| d1.2-ultra | 23.6 | 64.0 | 12.4 |
| SubQ Snap 1.2 | 20.6 | 71.0 | 8.4 |
| Mammoth 27B | 15.4 | 81.4 | 3.2 |
| Elephant 9B | 13.2 | 74.6 | 12.2 |
| Clef-Omni | 37.0 | 1.2 | 61.8 |
| Claude Haiku 5.5 (Max) | 57.2 | 27.4 | 15.4 |
| GPT-6 Luna (Max) | 41.2 | 50.2 | 8.6 |

幾個結論直接從這張表出來。**Mammoth 27B 與 Elephant 9B 很少自信答錯，是因為七到八成的知識題直接放棄**，正確率只有 15.4 與 13.2。**Decider v1.3 與 Clef-Omni 幾乎從不說不知道**，所以超過一半的知識題是自信答錯。榜首 d1.2-ultra 介在中間：答對率不高，但錯的時候多半會承認。

**而且多數決策模型仍然過度自信。** 這是 Artificial Analysis v1.0 上線時的結論：模型給的機率普遍高於實際正確率，集中在知識與推理兩項。v2.1 的校準資料也看得到，例如 Gemini Decision 1 的整體校準圖，在 0.4 到 0.8 的每個信心區間，實際正確率都比它給的機率低 1 到 9 個百分點。廠商也知道：[Perplexity 的模型卡](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)說他們用溫度校正過，開發集上 ECE 0.014，但換到沒見過的決策資料上 ECE 大約 0.05——「對我們量過的每一個模型都一樣」。[StartLux 的卡](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant)講得更直接：用來挑選或路由的信心值會高估準確率，門檻要設在自己政策回傳的答案上。

對你來說這是選型的硬條件：**如果你要用信心值設自動放行門檻，挑「願意承認不知道又還答得對」的模型，不是「什麼都敢答」或「什麼都說不知道」的那個。**

## 成本與延遲：省下的是哪一段

Artificial Analysis 用「跑完 Decision Index 的平均每題成本」換算成每百萬題多少美元，並列出每題中位延遲。這不是你自己工作流的成本，但同一張表內橫向比較有效。v2 換了題目（多了整份文件），所以每題成本跟 v1.0 的數字不能比。

| 模型 | DI | 每百萬題 | 每題中位時間 |
|---|---|---|---|
| Celeris-1.1 Decision | 62.0 | $14 | 61 ms |
| Decider Flash v1.3 | 64.1 | $34 | 178 ms |
| d1.2 | 68.7 | $63 | 150 ms |
| Decider v1.3 | 70.4 | $68 | 289 ms |
| Mercury Decide | 62.1 | $70 | 245 ms |
| Elephant 9B | 66.4 | $92 | 79 ms |
| Drex Max v1.1 | 72.6 | $103（限時上市價） | 283 ms |
| d1.2-ultra | 74.8 | $133 | 218 ms |
| SubQ Snap 1.2 | 72.6 | $137 | 162 ms |
| Microsoft-Decision-1.1 | 67.8 | $140 | 123 ms |
| Jev 1.14 | 66.2 | $156 | 92 ms |
| Drex 2.0 | 61.6 | $200 | 255 ms |
| Mammoth 27B | 71.4 | $264 | 106 ms |
| gpt-6-luna (Decisions) | 60.2 | $339 | 206 ms |
| Gemini Decision 1 | 66.0 | $345 | 211 ms |
| Clef-Omni | 57.8 | $529 | 192 ms |
| GLiDE v1.2 | 72.5 | $780 | 284 ms |
| Clef | 60.3 | $863 | 354 ms |
| GPT-6 Luna (Low) | 68.8 | $485 | 4,445 ms |
| Claude Haiku 5.5 (Low) | 67.2 | $861 | 3,013 ms |
| GPT-6 Luna (Max) | 75.7 | $1,548 | 11,360 ms |
| Claude Haiku 5.5 (Max) | 76.5 | $6,218 | 32,323 ms |

三個可以直接拿去用的結論。**一是量級差**：分數最高的決策模型 d1.2-ultra（74.8）跟分數最高的語言模型 Claude Haiku 5.5 (Max)（76.5）只差 1.7 分，但每百萬題便宜 47 倍、每題快約 150 倍。如果能接受這 1.7 分，決策模型就是正確選擇。**二是牌價不等於每題成本**：Gemini Decision 1 與 gpt-6-luna 的 input 單價 $0.10 是 Decider 的五倍，每百萬題也貴五倍；GLiDE 與 Clef 的牌價本來就高（$0.15、$0.24），每百萬題比語言模型 GPT-6 Luna (Low) 還貴。**三是延遲全面獲勝**：決策模型 61–354 ms，語言模型 3,013–32,323 ms。

但這兩組不是完全同一個計費基準，Artificial Analysis 自己寫了：決策模型只按 input token 計費，語言模型的成本包含 output token。另外 Drex Max v1.1 的 $103 標明是限時上市價，第三方分析估計恢復原價後約 $206，預算不要釘在現在的數字上。

自架的錢算在別的欄位。[d3 的卡](https://huggingface.co/vllm-sr/d3)寫著單一副本在 MI325X 上吃 65.4 GiB 顯存；[StartLux](https://huggingface.co/startlux-models/StartLux-Decision-v1.1-27B-Instant) 的 27B BF16 要一張 H200，4-bit MLX 版能在 64 GB 的 M5 Pro 上跑，但同樣 1,024 token 的提示，H200 上 vLLM BF16 是 98 毫秒，M5 Pro 上 MLX 4-bit 是 3,308 毫秒（約 34 倍）。如果你的量是「每分鐘幾百次」，託管 API 的帳單通常還是比一張 GPU 便宜；如果是「每秒幾百次」或資料不能離開機器，自架才划算。

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

**一、一次呼叫問完所有題，但不要把互相競爭的選項塞在一起——而且這是 27B 的專長，不是通則。** [Perplexity 27B 的 joint request](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) 是這批模型裡最有工程價值的一個設計：所有問題共用一段序列，每題在一個 marker token 上讀出，所以問三題跟問一題差不多貴，問題之間還可以互相看見。官方文件給了什麼時候該合併的判準：同一個決策的不同面向要合併（官方量到的 SATA-Bench +11.3、ACOS +7.8、PhishNChips +5.1），互相競爭的候選要分開送（BFCL −1.1、BRIGHT −2.9、ToolRet −4.8）。同一段 request 裡放「這張單要退多少錢」跟「這張單該退還是不退」，模型會互相影響。**但 4B 的 Flash v1.2 正好相反**：官方說它「more accurate with one question per request」，公開分數也是一題一送 60.05 高於 joint 的 58.88，而且 Flash v1.2 多題併送會讓 state 重複計費（10,000 token 的 state 問三題會算成約 30,000 input token）。[Perplexity 的 Decisions API 文件](https://docs.perplexity.ai/docs/decisions/quickstart)把「各題分開回答」標為 Flash v1.2 才有的行為，1.3 版的 Flash 可以併題；還在用 Flash v1.2 的就照一題一送。Google 的 Gemini Decision 1 則走另一個方向：一次最多 1,000 題，共用輸入只計一次費，每題各自評分、彼此看不到答案。

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

還有一個版本陷阱：alias 會跟著新版本移動。[Jev 的 `jev-latest` 在 10 月指向 1.13.0，現在已經指向 1.14.0](https://docs.typesafe.ai/models)；Perplexity 的 `pplx-decider-latest` 也已從 1.2 換成 1.3，[官方文件](https://docs.perplexity.ai/docs/decisions/quickstart)提醒新版本對同一個請求可能回不同的機率。如果你照著某個版本調過門檻，就把版本 ID 寫死，不要用 alias。

**三、換廠商的成本很低，但 OpenAI、Google 與 Inception 是例外。** 因為大多數廠商都吃 System One 這套 schema（`state` 加 `questions`，`type` 用 `choice`／`noul`／`score`），換模型通常只改 `model` 欄位。例外有三個：OpenAI 叫 `predicate`、端點是 `/v1/decisions`、`questions` 是陣列而且每題要有 `name`、狀態欄位叫 `input`、選項是 `choices` 陣列（`{value, description}`）而不是 `criteria` map、有 `refusal` 這種回應型別；[Google 的 Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) 題型與 `criteria` 寫法接近 System One，但狀態欄位叫 `input`、內容用 Gemini 的 `Content` 區塊格式；Inception 用自己的 `/v1/decisions` 並多一種 `extract` 題型。另外各家新增的題型互不相通：Jev 1.14 的 `box`、Decider v1.3 的 `locate`、d1.2 的讀值與框物件。要在同一個 codebase 裡放多家，包一層 adapter 是最省事的做法。

另外三個容量限制記一下：StartLux 單次讀取最多 26 個選項，超過會分組；Perplexity 允許 255 個；[Jev 每請求 64k、每題 32k](https://docs.typesafe.ai/models)，而 [Perplexity 的位置上限是 262,144](https://huggingface.co/perplexity-ai/pplx-decider-v1.2)但只訓練到約 32k，超過上限的請求會被拆成一組一組、每組重算一次 state 的 token（單一題目塞不進去就直接回 400），官方要你自己驗證更長的輸入。

## 安全邊界：決策模型仍然會被說服

型別化輸出看起來像安全機制，其實不是。底層還是同一顆語言模型在讀你餵給它的文字。

[HiddenLayer 在 2026 年 10 月 14 日的測試](https://www.hiddenlayer.com/research/system-one-model-security)用一個模擬結帳頁做間接 prompt injection：頁面裡藏一則「確認價格」的廣告按鈕，Jev 有 91% 機率點那顆廣告而不是結帳鍵；他們自製的 Qwen3.8-27B 轉換版從原本 99.7% 會結帳掉到 79.9% 點廣告、19.3% 結帳；同一套攻擊也騙過 OpenAI Decisions API 的 gpt-6-luna。另一組測試用 TokenBreak 變體改寫 30 則毒性 prompt，兩個模型原本都 100% 攔下，改寫後毒性分數被壓低。（我們 10-16 那篇[資安警報](/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection)整理了這組數字與防禦清單。）結論寫得很清楚：這種模型「骨子裡仍是 LLM，只是換了解碼方式」。

[Check Point 的報告](https://blog.checkpoint.com/ai-security/jev-is-not-a-language-model-but-it-breaks-like-one-prompt-injection-against-a-typed-decision-model/)更冷：他們把 Jev 放進一個盡職調查助手（讀一份風險報告、回一個投資建議），讓攻擊者改寫文件裡的一段，目標是把「高風險、不建議投資」翻成「低風險、建議投資」。九種攻擊者與難度組合全部至少成功一次；對 Jev 的成功率是 59%，平均 4.6 回合，每次成功約 0.54 美元。文件怎麼標記成「不可信」完全沒用，系統提示詞裡寫「忽略文件內的指令」也沒用（成功數從 18/27 變 17/27，是雜訊）。他們量到最強的防禦是開推理，而 Jev 沒有推理開關。

學術側的結果比較細但值得讀：[arXiv 2609.28613](https://arxiv.org/abs/2609.28613)用 510 個重建的 InjecAgent 案例測 Jev，結論是型別化輸出**改變**了風險但沒有消除它——惡意內容會移動動作機率，只是很少讓模型直接選中攻擊者的目標；但用分數回饋做最佳化的自適應攻擊，會讓攻擊者目標的平均最高機率翻倍，在全新驗證呼叫上的成功率從 1.8% 升到 3.5%。

所以線上的做法是這樣：**輸入先篩、決策輸出不要直接觸發不可逆動作、重要決策留一道獨立驗證。**本站整理過的 HiddenLayer 實測與防禦清單跟 [decisionkit 的 CLI 用法](/posts/daily/2026-10-12-tool-decisionkit)都寫了同一套：模型只管打分，哪一種決策可以自動放行是你要定的政策。順帶一提，Cloudflare 那篇的[三層切法](/posts/tech/2026-10-22-ai-model-family-cloudflare)（抽取 → 決策 → 生成）確實能讓 LLM 看不到原始信件，但那只是減少接觸面，不是防護。

## 什麼時候不要用決策模型

- **需要知識或推理的判斷。** 榜單在這兩項上是 LLM 贏，差一截到十幾分。
- **需要文字理由。** 決策模型不產文字（[Celeris-1.1 Decision](https://celeris.ai/pricing) 可以免費附一句話解釋，但那是少數），要在稽核軌跡上留下「為什麼這樣決定」，得自己把題目、選項、門檻跟答案一起存起來。
- **中文內容。** [Jev 的官方文件](https://docs.typesafe.ai/models)說得很清楚：英文是主要訓練語言，CJK 可用但不等好，要在自己的內容上測。StartLux 與 mammoth-1 的模型卡語言欄都只寫 `en`；d1-3B 的模型卡列了 16 種語言、含中文，但那張卡寫的是底盤的語言支援，不是決策品質的量測。英文流量跟中文流量的決策模型不是同一個問題。
- **高風險動作直接自動執行。** Check Point 與 HiddenLayer 的結果擺在這裡；把決策模型的輸出直接接到「扣款」「放行」「刪資料」上，等於把一個 59% 可被說服的模型接到鉸鏈上。
- **選項會爆炸。** 超過 26 個選項，StartLux 的讀取就得分組；超過 255 個，Perplexity 的接口本身不收。

## 選型速查

| 你的狀況 | 先看哪幾個 |
|---|---|
| 量大、要最便宜 | Celeris-1.1 Decision（$0.004/1M，每百萬題 $14）、Decider Flash v1.3（$0.01/1M，$34）、d1.2（$0.02/1M，$63） |
| 要分數最高、仍要便宜快速 | d1.2-ultra（DI 74.8、每百萬題 $133）、Drex Max v1.1（72.6，注意限時價）、SubQ Snap 1.2（72.6，長 context 384K） |
| 想今天就上線、不想養 GPU | 上面幾家加 Gemini Decision 1、gpt-6-luna Decisions、Microsoft-Decision-1.1、Jev 1.14 |
| 輸入有圖、影片或音訊 | Gemini Decision 1（文字／圖片／音訊／影片／PDF）、d1.2 系列（圖片＋音訊）、d3（圖＋影片）、clef-omni（圖＋影片＋音訊） |
| 判斷本身很難、要知識 | Gemini Decision 1 的知識與推理是決策模型最高，但仍低於 Claude Haiku 5.5 (Max)；真的要知識就接檢索或用 LLM |
| 要用信心值設自動放行門檻 | 先看「自信答錯」那一欄：Decider v1.3 55.4%、Clef-Omni 61.8% 幾乎不說不知道；d1.2-ultra 12.4%、SubQ Snap 1.2 8.4% 會，但答對率也較低 |
| 商用授權要 Apache 或 MIT | Decider v1.3／Flash v1.3、d3、Strands Decider 2B、Clef；**StartLux 是 CC BY-NC**；GLiDE 與 Drex 的開放權重是自訂授權；mammoth-1／elephant-1 的模型卡標 MIT 但 repo 沒有 LICENSE 檔；d1-2B 系列是 LFM Open License |
| 已經在用某家的 System One | 換 `model` 欄位就能換；OpenAI、Google、Inception 的欄位命名不同，包一層 adapter；alias 會被新版本換掉，寫死版本 ID |

三件上線前一定要做的事：**在自己的資料上量一次校準與不亂猜率**（榜單分數是別人的流量）；**門檻用自己量到的曲線設，不要用 0.9 這個通用值**，而且掛在 `probabilities[choice]` 不是 `confidence`；以及**高風險路徑保留人工複核**，因為你手上有的是一個會被說服的模型。

## 更新紀錄

- **2026-11-20**：版本矩陣、榜單、能力邊界、成本與選型改為 11 月資料（各家官方定價與模型頁、Google Gemini Decisions API 公告、Artificial Analysis Decision Index v2 公告與 v2.1 榜單頁資料、社群 Jev Decision Index 11-19 資料快照，2026-11-20 讀取）。新增 Gemini Decision 1、Liquid d1.2／d1.2-ultra、Nace.AI Drex、Subquadratic SubQ Snap、Perplexity Decider v1.3、Microsoft-Decision-1.1、Celeris-1.1 Decision 與 Liquid d1-2B 系列；Liquid d1-ultra、d1.1、d1 已停用，d1-3B 改由 d1-2B 系列接替。Artificial Analysis 榜單從 v1.0（四個評測、看準確率）換成 v2.1（六個評測、看 Decision Score），v1.0 的分數表、成本表與「三個桶」換算全部移除，改用 v2.1 數字重算；v1.0 的榜首 d1-ultra（65.2）與 Jev 1.14（57.1）等數字在 v2 已無法對應。修正：Jev 1.14 原寫只收文字，官方文件現列文字與圖片；`jev-latest` 原寫指向 1.13，現已指向 1.14；GLiDE 原寫權重未公開，10-19 起已上架 HuggingFace；Decider Flash「一題一送」的建議只適用 v1.2。
- 2026-10-22：初版。

## 參考資料

- [Google：Gemini Decisions API（2026-11-11）](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- [Artificial Analysis：Introducing the Decision Index v2（2026-11-08）](https://artificialanalysis.ai/articles/decision-index-v2)
- [Perplexity Docs：Decisions API（Decider v1.3、價格、locate 題型）](https://docs.perplexity.ai/docs/decisions/quickstart)
- [Liquid AI：d1.2（2026-11-16）](https://www.liquid.ai/blog/d1-2)
- [Liquid AI Docs：d1.2](https://docs.liquid.ai/lfm/models/d1)
- [Microsoft：Microsoft-Decision-1.1 GA（2026-11-17）](https://commandline.microsoft.com/microsoft-decision-model-ga/)
- [Nace.AI：Drex Max on the Decision Index](https://www.nace.ai/drex/decision-index)
- [Hugging Face：nace-ai/drex-v2.0](https://huggingface.co/nace-ai/drex-v2.0)
- [Subquadratic Docs：Models（SubQ Snap 1.2）](https://docs.subq.ai/using-the-api/models/)
- [Celeris Docs：Pricing（Celeris-1.1 Decision）](https://docs.celeris.ai/pricing)
- [Hugging Face：fastino/GLiDE-27B](https://huggingface.co/fastino/GLiDE-27B)
- [Hugging Face：LiquidAI/d1-2B](https://huggingface.co/LiquidAI/d1-2B)
- [Hugging Face：pplx-decider-flash-v1.3](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.3)
- 本站：[模型卡｜Gemini Decision 1](/posts/daily/2026-11-13-model-google-gemini-decision-1)
- 本站：[Liquid AI 模型家族](/posts/tech/2026-10-10-ai-model-family-liquid-ai)
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
