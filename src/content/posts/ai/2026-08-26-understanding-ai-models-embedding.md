---
title: "Embedding：模型怎麼把文字變成可以計算的向量"
date: 2026-08-26
category: ai
type: deep-dive
tags: [embedding, vector, cosine-similarity, nlp, rag, ai-model]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 3
tldr: "模型不懂文字，只懂數字。Embedding 把每個 token 對應到一組幾百維的向量，意思相近的詞在向量空間裡距離相近。這是搜尋、RAG、分類背後共用的基礎機制。"
description: "Embedding 入門：從 one-hot 到 dense vector、cosine similarity 怎麼衡量相似度、embedding 在搜尋與 RAG 的實際應用，以及 embedding model 和 LLM 的差別。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-embedding-en)

上一篇我們知道模型會先把文字切成 token。但 token 只是切法——模型拿到一串 token 之後，要怎麼「理解」它們？

答案是：不理解。模型從頭到尾只做數學運算。所以第一步，是把每個 token 變成一組數字。

## 電腦不會讀字

人看到「貓」這個字，腦中浮現毛茸茸的四腳動物。電腦看到「貓」，什麼也不會浮現——它只能處理數字。要讓模型對文字做任何事（比較、分類、生成），前提是把文字轉成數字。

最直覺的做法叫 **one-hot encoding**。假設我們的詞彙表只有五個詞：

| 詞 | 向量 |
|---|---|
| 貓 | `[1, 0, 0, 0, 0]` |
| 狗 | `[0, 1, 0, 0, 0]` |
| 魚 | `[0, 0, 1, 0, 0]` |
| 車 | `[0, 0, 0, 1, 0]` |
| 船 | `[0, 0, 0, 0, 1]` |

每個詞佔一個位置，自己那格填 1，其餘填 0。

這個方法有兩個致命問題：

1. **太稀疏。** 現代模型的詞彙表動輒十萬個 token，每個向量就有十萬維，其中只有一個 1，其餘全是 0。浪費空間，也浪費算力。
2. **沒有意義。** 在 one-hot 裡，「貓」和「狗」的距離，跟「貓」和「車」的距離一模一樣。模型無法從這些向量中看出任何語意關係。

## 從稀疏到稠密：Embedding 的核心想法

Embedding 的做法完全不同。它把每個 token 對應到一組**稠密向量（dense vector）**——幾百個維度，每個維度都是一個有意義的浮點數。

舉例來說，一個 3 維的簡化 embedding 可能長這樣：

| 詞 | 向量 |
|---|---|
| 貓 | `[0.82, -0.15, 0.41]` |
| 狗 | `[0.79, -0.12, 0.38]` |
| 魚 | `[0.45, 0.60, 0.22]` |
| 車 | `[-0.70, 0.30, 0.85]` |
| 船 | `[-0.65, 0.35, 0.80]` |

注意幾件事：

- **「貓」和「狗」的數字很接近**——因為它們在語意上相關（都是寵物、都是動物）。
- **「車」和「船」也彼此接近**——都是交通工具。
- **「貓」和「車」差很遠**——語意上沒什麼關聯。

這些數字不是人手動填的，而是模型在大量文本上訓練出來的。每個維度不一定對應人類能命名的概念，但整體效果是：**意思相近的詞，在向量空間裡距離相近。**

## 怎麼衡量「距離相近」

兩個向量之間的距離有很多種算法，NLP 裡最常用的是**餘弦相似度（cosine similarity）**。

它不看向量的長度，只看方向。想像兩支箭從原點射出去——如果方向幾乎一致，餘弦相似度接近 1；方向垂直是 0；方向相反是 -1。

```
cosine_similarity(A, B) = (A · B) / (|A| × |B|)
```

用上面的例子算：

- `cosine(貓, 狗)` ≈ 0.99 — 非常相似
- `cosine(貓, 車)` ≈ -0.38 — 不相似
- `cosine(車, 船)` ≈ 0.99 — 非常相似

這就是模型「知道」貓和狗比較像的方式——它不需要理解什麼是貓，它只需要看向量方向夠不夠接近。

## 視覺直覺：向量空間裡的地圖

雖然真正的 embedding 是幾百維，但壓到 2D 來看會很直觀。想像一張平面地圖：

- 左上角聚了一堆動物詞：貓、狗、兔子
- 右下角聚了一堆交通工具：車、船、飛機
- 食物詞可能在另一個角落

更有趣的是，embedding 會捕捉到**關係的平行性**。經典的例子：

```
king - man + woman ≈ queen
```

「king」到「queen」的方向，和「man」到「woman」的方向幾乎一致。模型從來沒有被明確教過「國王的女性版本是女王」，但因為這些詞在大量文本中的使用脈絡類似，訓練出來的向量自然帶有這個結構。

Word2Vec 在 2013 年第一次展示這個現象時，整個 NLP 社群為之震驚——幾百維的浮點數裡，居然藏著人類語言的邏輯結構。

## Embedding 的實際用途

### 語意搜尋

傳統搜尋靠關鍵字比對：你打「如何修理水龍頭」，系統找包含這些字的文件。但如果文件寫的是「水龍頭漏水的處理方法」，關鍵字對不上就找不到。

語意搜尋的做法是：把查詢和所有文件都轉成 embedding，然後找向量最接近的。因為「修理水龍頭」和「水龍頭漏水的處理方法」的 embedding 方向相近，即使字面不同也能找到。

### RAG（檢索增強生成）

RAG 是目前讓 LLM 回答「它沒見過的資料」最主流的方法。流程是：

1. 事先把所有文件切成段落，每段算出 embedding 存進向量資料庫
2. 使用者提問時，把問題也算成 embedding
3. 從向量資料庫裡找出最接近的幾段文件
4. 把這些文件塞進 prompt，讓 LLM 根據它們回答

第 1 到 3 步全靠 embedding——沒有 embedding，RAG 就不存在。

### 分類與聚類

把大量文件轉成 embedding 之後，你可以把它們丟進分類器（這篇客訴是關於退貨還是品質？），或者做聚類分析（這幾千則回饋自然分成哪幾群？）。

## Embedding Model 和 LLM 的差別

這裡要區分兩種模型：

| | Embedding Model | LLM |
|---|---|---|
| 輸入 | 一段文字 | 一段文字（prompt） |
| 輸出 | 一組固定長度的向量 | 新的文字（生成） |
| 參數量 | 通常幾億（較小） | 幾十億到上兆（大得多） |
| 用途 | 搜尋、比對、分類 | 對話、摘要、翻譯、推理 |
| 成本 | 便宜 | 貴 |

像 OpenAI 的 `text-embedding-3-small` 或 BAAI 的 `bge-m3` 就是 embedding model——它們不會「說話」，只會把你給它的文字變成一組數字。而 GPT-4 或 Claude 是 LLM——它們內部也有 embedding 層，但最終目的是生成文字。

換句話說：**每個 LLM 裡面都有 embedding，但 embedding model 不是 LLM。**

## 銜接下一篇

現在我們知道了：模型把 token 轉成向量，向量之間的距離代表語意的遠近。但這些向量的數值從哪來？模型怎麼知道「貓」的向量該長什麼樣子？

答案是：透過訓練。而訓練需要一個目標——一個數學函數告訴模型「你做對了」還是「你做錯了」。

下一篇，我們來看這個函數：**loss function**。

## 參考資料

- Mikolov, T. et al. (2013). *Efficient Estimation of Word Representations in Vector Space*. [https://arxiv.org/abs/1301.3781](https://arxiv.org/abs/1301.3781)
- Reimers, N. & Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*. [https://arxiv.org/abs/1908.10084](https://arxiv.org/abs/1908.10084)
- Google. *What Are Word and Sentence Embeddings?* Machine Learning Crash Course. [https://developers.google.com/machine-learning/crash-course/embeddings](https://developers.google.com/machine-learning/crash-course/embeddings)
