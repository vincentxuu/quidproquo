---
title: "OLMo：唯一連訓練資料都開源的語言模型家族"
date: 2026-08-26
category: ai
type: deep-dive
tags: [llm, open-source, olmo, allen-ai, training-data, dolma]
lang: zh-TW
tldr: "Allen AI 的 OLMo 是目前唯一把權重、訓練資料（Dolma，9.3 兆 token）、訓練程式碼、所有中間 checkpoint 和評估工具全部公開的語言模型家族。OLMo 3 的 32B Think 模型在 MATH 跑到 96.1%，同時你可以用 OlmoTrace 追溯任何輸出回到訓練資料的哪一段。"
description: "Allen AI OLMo 模型家族深入介紹：從 Dolma 資料集到 OLMo 3 的完整 model flow，為什麼訓練資料開源在研究上有不可替代的意義。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en)

Llama 開源了權重，Mistral 開源了權重和部分架構細節，但它們的訓練資料都是黑箱。OLMo 把這最後一塊也打開了——你不只能用這個模型，還能看到它是怎麼被訓練出來的，用了哪些資料，每一個中間 checkpoint 長什麼樣子。

## Allen AI 是誰

Allen Institute for Artificial Intelligence（Ai2）是已故微軟共同創辦人 Paul Allen 於 2014 年成立的非營利 AI 研究機構，總部在西雅圖。它不賣模型、不賣 API，使命是「AI for the Common Good」。Semantic Scholar（學術搜尋引擎）也是 Ai2 的產品。

OLMo（Open Language Model）是 Ai2 從 2023 年開始的旗艦專案，目標是建造一個**真正完全開源**的語言模型——不是 Meta 那種「權重開放但訓練資料保密」的 open-weight，而是從資料到權重到程式碼到評估全部公開。

## 「完全開源」到底開了什麼

OLMo 跟其他「開源」模型的差異，用一張表最清楚：

| 開放項目 | Llama 3 | Mistral | Qwen 2.5 | OLMo 3 |
|---|---|---|---|---|
| 模型權重 | ✅ | ✅ | ✅ | ✅ |
| 訓練程式碼 | ❌ | ❌ | 部分 | ✅（OLMo-core） |
| 預訓練資料 | ❌ | ❌ | ❌ | ✅（Dolma 3，9.3T tokens） |
| 後訓練資料（SFT/DPO/RL） | ❌ | ❌ | ❌ | ✅（Dolci） |
| 中間 checkpoint | ❌ | ❌ | ❌ | ✅ |
| 資料處理工具 | ❌ | ❌ | ❌ | ✅ |
| 輸出→訓練資料溯源 | ❌ | ❌ | ❌ | ✅（OlmoTrace） |

這不是程度的差別，是**性質的差別**。只開放權重，你能用模型但不能理解模型；開放訓練資料和中間 checkpoint，你能研究模型是怎麼學會某個能力的、某個偏誤是從哪段資料來的、訓練到第幾步開始出現湧現行為。

## Model Flow：不只是一個模型，是一條生產線

Ai2 用「model flow」這個詞來描述 OLMo 的開放方式：不是丟一個最終權重檔給你，而是把**整條生產線**攤開。

```
Dolma 3（9.3T tokens 預訓練資料）
  ↓ 預訓練（1,024 × H100）
OLMo 3 Base（7B / 32B）
  ↓ Dolmino Mix（100B tokens 中訓練）
  ↓ Longmino（50B tokens 長上下文訓練）
  ↓ Dolci（後訓練：SFT → DPO → RLVR）
OLMo 3 Instruct / Think / RL Zero
```

每一個箭頭之間的 checkpoint 都可以下載。這意味著你可以：

- 從 Base 開始，注入自己的領域資料做中訓練
- 跳過 Ai2 的後訓練，用自己的 SFT/DPO 資料集
- 拿不同階段的 checkpoint 做 ablation study

對研究者來說，這比拿到一個黑箱的最終模型有用得多。

## Dolma：9.3 兆 token 的開放資料集

Dolma 是 OLMo 的預訓練資料集，目前到第三版（Dolma 3），規模 9.3 兆 token。組成包括：

- 經過品質篩選和去重的網頁內容
- 程式碼
- 科學論文 PDF
- 數學題目
- 百科全書內容
- 書籍

Dolma 不只是一個資料集——Ai2 同時開源了整套資料處理工具鏈：

| 工具 | 功能 |
|---|---|
| **datamap-rs** | 資料清理與品質篩選 |
| **duplodocus** | 大規模去重 |
| **decon** | 測試集污染移除 |

這讓其他研究團隊可以用同樣的工具處理自己的資料，或者在 Dolma 的基礎上加減內容。

另一個獨特的工具是 **OlmoTrace**：給定模型的某段輸出，它可以追溯到訓練資料裡的對應來源。這對研究模型幻覺、版權問題、資料偏誤都極有價值。

## OLMo 3 的效能表現

OLMo 的目標不是打榜冠軍，但 OLMo 3 的表現已經不是「學術玩具」等級：

### OLMo 3 Base（32B）

在同規模的完全開源模型中排第一，跟 Qwen 2.5、Gemma 3 競爭，優於 Marin 32B 和 Apertus 70B。

### OLMo 3 Think（32B）

這是目前最強的完全開源 thinking model：

| Benchmark | OLMo 3 Think 32B | Qwen 3 32B |
|---|---|---|
| MATH | 96.1% | 96.7% |
| HumanEvalPlus | 91.4% | 91.2% |
| IFEval | 89.0% | — |
| BigBenchHard | 89.8% | — |

跟 Qwen 3 幾乎打平——但 Qwen 3 的訓練資料是保密的，OLMo 3 的每一個 token 都可以追溯。

### OLMo 3 Instruct（7B）

跟同規模的 Qwen 2.5 7B、Gemma 3 7B、Llama 3.1 8B 競爭，適合資源有限的部署場景。

## 四種模型變體

| 變體 | 用途 |
|---|---|
| **Base** | 預訓練基底，適合繼續訓練或研究 |
| **Instruct** | 對話與工具使用，適合一般應用 |
| **Think** | 推理鏈模型，適合數學、程式、複雜推理 |
| **RL Zero** | 純 RL 訓練路徑，供強化學習研究者使用 |

## 為什麼訓練資料開源重要

這不只是「開放精神」的問題，有幾個實際的研究意義：

**可重現性。** 沒有訓練資料，你無法重現一個模型的訓練過程。依據 Ai2 的說法，目前主流「開源」模型（Llama、Mistral、Qwen）都不滿足科學可重現性的最低標準。

**偏誤溯源。** 模型輸出偏見時，你能追問「這個偏見是從哪段訓練資料學來的」。有 OlmoTrace，這不是假設性問題，是可以跑出答案的查詢。

**資料合規。** 歐盟 AI Act 等法規越來越要求 AI 系統的資料透明度。訓練資料完全公開的模型在合規上有天然優勢。

**學術研究基建。** 理解 scaling law、湧現行為、in-context learning 等現象，都需要存取中間 checkpoint 和訓練資料。OLMo 是目前唯一能支撐這類研究的模型家族。

## 適合與不適合的場景

**適合：**
- 需要訓練資料透明度的學術研究
- 需要從 base model 繼續訓練的領域適配
- 需要資料合規的企業部署
- 需要追溯模型輸出來源的應用（版權、幻覺檢測）

**不適合：**
- 追求最強絕對效能（Claude、GPT-4o 仍然領先）
- 需要多模態（OLMo 目前只有文字）
- 需要超大上下文窗口（OLMo 3 支援約 65K token，不是百萬級）

## 整體來說

OLMo 在「開源」這個被用到氾濫的詞上，畫了一條清楚的線：**如果訓練資料不公開，那就不是真正的開源，只是 open-weight。** 它不是效能最強的模型，但它是唯一一個讓你能問「為什麼」而不只是「怎麼用」的模型家族。

對做 AI 研究的人來說，這不是一個可選項，而是唯一選項——因為沒有別的模型能讓你看到訓練過程的全貌。

## 參考資料

- [OLMo 官方頁面 — Allen AI](https://allenai.org/olmo)
- [OLMo 3: Charting a path through the model flow — Allen AI Blog](https://allenai.org/blog/olmo3)
- [OLMo 2: The best fully open language model to date — Allen AI Blog](https://allenai.org/blog/olmo2)
- [Dolma 資料集 — Hugging Face](https://huggingface.co/datasets/allenai/dolma)
- [allenai/dolma — GitHub（資料處理工具）](https://github.com/allenai/dolma)
- [Dolma, OLMo, and the Future of Open-Source LLMs — Cameron R. Wolfe](https://cameronrwolfe.substack.com/p/dolma-olmo-and-the-future-of-open)
- [OLMo 3: America's truly open reasoning models — Interconnects AI](https://www.interconnects.ai/p/olmo-3-americas-truly-open-reasoning)
- [OLMo 2 32B — OpenRouter](https://openrouter.ai/allenai/olmo-2-0325-32b-instruct)
