---
title: "Fine-tuning vs RAG：什麼時候該教模型、什麼時候該幫模型查資料"
date: 2026-08-26
category: ai
type: deep-dive
tags: [fine-tuning, rag, retrieval-augmented-generation, llm, ai-model, vector-database]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 13
tldr: "資料常更新、需要引用來源 → RAG。需要統一風格、要跑在小裝置上 → fine-tuning。實務上很多系統兩者都用：fine-tune 一個懂你領域語言的小模型，再用 RAG 補上最新資料。"
description: "Fine-tuning 與 RAG 的選擇指南：各自的適用情境、成本結構、風險，以及實務中常見的混合架構。附決策流程圖。"
draft: false
glossary:
  - term: "Fine-tuning"
    def: "微調——在預訓練模型的基礎上，用自己的資料繼續訓練，讓模型學會特定領域的知識或風格"
  - term: "RAG"
    def: "Retrieval-Augmented Generation，檢索增強生成——查詢時先從知識庫檢索相關文件，塞進 prompt 讓模型參考後回答"
  - term: "Catastrophic Forgetting"
    def: "災難性遺忘——fine-tuning 時模型學會新知識但忘掉原本會的東西"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag-en)

你有一堆公司內部文件，想讓模型回答相關問題。你面前有兩條路：把資料餵進去重新訓練（fine-tuning），或是在使用者問問題時即時查資料塞給模型（RAG）。

這兩條路解決的問題不一樣，成本不一樣，適合的場景也不一樣。

## Fine-tuning：教模型說你的語言

Fine-tuning（微調）是在一個已經預訓練好的模型上，用你自己的資料繼續訓練。模型的權重會被更新，等於把知識「烤進」模型裡面。

### 怎麼做

1. 準備訓練資料——通常是 prompt-completion 配對，幾百到幾萬筆
2. 選一個基礎模型（例如 Llama 3、Mistral、GPT-4o mini）
3. 跑幾個 epoch 的訓練，更新模型的部分或全部權重
4. 驗證效果，部署新模型

### 什麼時候適合

- **風格統一**：你要模型用特定格式回答，例如永遠用三個步驟回覆客服問題
- **行為改變**：你要模型拒絕某些問題、用特定口吻說話
- **小模型 + 專業領域**：把一個 7B 或 8B 的小模型調教成某個領域的專家，跑在手機或邊緣裝置上
- **效率**：fine-tuned 模型不需要在每次推論時處理額外的文件，延遲更低

### 成本

- **GPU 時間**：即使用 LoRA 這類參數高效微調（PEFT）方法，也要花幾小時到幾天的 GPU 時間
- **資料準備**：整理高品質的訓練資料往往是最耗時的部分
- **版本管理**：資料更新就要重新訓練，每個版本都是一個新模型

### 風險

- **災難性遺忘（Catastrophic Forgetting）**：模型學了新東西可能忘掉舊的能力。你教它寫法律文書，它可能變得不會聊天了
- **過擬合（Overfitting）**：訓練資料太少或太同質，模型只會照搬訓練資料，碰到沒見過的問題就亂答
- **幻覺沒有改善**：fine-tuning 教的是「怎麼說」，不是「說的對不對」——模型可能用你教的風格，自信地說出錯誤的事

## RAG：幫模型查資料

RAG（Retrieval-Augmented Generation，檢索增強生成）不改模型本身。它在使用者提問時，先從知識庫裡搜尋相關文件，把搜到的內容塞進 prompt 裡，讓模型「看著答案本作答」。

### 怎麼做

1. 把文件切成小段（chunks），用 embedding 模型轉成向量
2. 存進向量資料庫（例如 Pinecone、Qdrant、Weaviate、Cloudflare Vectorize）
3. 使用者提問時，把問題也轉成向量，找出最相似的幾段文件
4. 把搜到的文件和問題一起塞進 prompt，送給模型

### 什麼時候適合

- **資料頻繁更新**：產品文件、政策法規、價格表——更新文件就好，不用重新訓練模型
- **需要引用來源**：你可以告訴使用者「這個答案來自哪份文件第幾頁」
- **知識量大**：公司有幾萬份文件，全部塞進模型權重不切實際，但搜出最相關的五段就夠了
- **用通用模型就好**：不需要改變模型的行為，只需要讓它看到正確資料

### 成本

- **Embedding 管線**：每份文件都要 embed，新文件進來要及時處理
- **向量資料庫**：要維運一個向量 DB，有儲存和查詢成本
- **檢索延遲**：每次查詢多一個搜尋步驟，通常增加 100-500ms
- **Token 消耗**：搜到的文件佔 context window 的空間，推論成本更高

### 風險

- **檢索失敗**：搜不到正確的文件，模型就只能用自己的知識猜——通常就是幻覺
- **Context window 限制**：搜到太多文件塞不進去，搜太少又怕漏掉重要資訊
- **文件品質**：如果知識庫裡的文件本身有錯，模型會「認真引用錯誤資料」

## 決策框架

選 fine-tuning 還是 RAG 不是二選一。以下是一個簡單的判斷流程：

```
你要解決什麼問題？
│
├─ 資料會頻繁更新？ ──→ RAG
│
├─ 需要附上引用來源？ ──→ RAG
│
├─ 要統一回答風格或格式？ ──→ Fine-tuning
│
├─ 要在小裝置上跑？ ──→ Fine-tune 小模型
│
├─ 以上都要？ ──→ Fine-tuning + RAG
│
└─ 不確定？ ──→ 先試 RAG（成本低、可逆）
```

一個實用的經驗法則：**先試 RAG**。RAG 的進入門檻低，改起來快，搞砸了不會毀掉模型。如果 RAG 解決不了的問題——通常是風格、格式、或特定行為——再考慮 fine-tuning。

## 實務案例

### 客服機器人 → RAG

一家電商想讓 AI 回答退換貨問題。退換貨政策每季更新，新產品不斷上線。

用 RAG：把客服知識庫和產品目錄 embed 進向量資料庫。政策更新時換文件就好，不用重新訓練模型。回答時附上來源文件連結，客服主管可以稽核。

### 程式碼補全模型 → Fine-tuning

一間公司想訓練一個自動補全內部程式碼的工具。內部程式碼有自己的框架、命名慣例、API 風格。

用 Fine-tuning：拿內部 codebase 微調一個 code 模型（例如 CodeLlama 或 StarCoder）。模型學會公司的命名風格和 API 用法，補全時不需要每次搜尋 codebase。

### 法律研究助理 → Fine-tuning + RAG

一間法律事務所想做一個可以回答法規問題的 AI 助理。法條更新頻繁，但法律文書的寫作風格很固定。

混合架構：fine-tune 一個模型讓它學會法律文書的語言和引用格式，再用 RAG 搜尋最新的法條和判例。模型用法律人聽得懂的方式回答，同時確保引用的法條是最新版。

## 小結

| | Fine-tuning | RAG |
|---|---|---|
| 改的是 | 模型本身（權重更新） | 模型的輸入（塞文件進 prompt） |
| 擅長 | 風格、格式、行為、小模型特化 | 即時知識、頻繁更新、引用來源 |
| 資料更新 | 重新訓練 | 更新知識庫 |
| 進入門檻 | 較高（GPU、資料工程） | 較低（向量 DB、embedding） |
| 風險 | 災難性遺忘、過擬合 | 檢索失敗、context 爆滿 |

實務上，先試 RAG 解決「知識」問題，解決不了再考慮 fine-tuning 處理「行為」問題。很多正式環境是兩者並用。

## 參考資料

- Lewis, P. et al. ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks."](https://arxiv.org/abs/2005.11401) NeurIPS, 2020.
- Hu, E. J. et al. ["LoRA: Low-Rank Adaptation of Large Language Models."](https://arxiv.org/abs/2106.09685) ICLR, 2022.
- Gao, Y. et al. ["Retrieval-Augmented Generation for Large Language Models: A Survey."](https://arxiv.org/abs/2312.10997) arXiv:2312.10997, 2024.
- OpenAI. ["Fine-tuning — OpenAI API Documentation."](https://platform.openai.com/docs/guides/fine-tuning) 2024.
- Anthropic. ["Retrieval Augmented Generation (RAG) — Anthropic Documentation."](https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation) 2024.
