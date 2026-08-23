---
title: "CS336 Lecture 1：從位元組到 tokenizer，先決定什麼值得隨規模成長"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm, tokenization, bpe, stanford]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 2
tldr: "CS336 第一講不把「從零打造語言模型」理解成重做所有舊技術，而是先區分 mechanics、mindset 與 intuitions，再用 BPE 示範如何把原始位元組轉成可訓練的 token。"
description: "Stanford CS336 Spring 2026 Lecture 1 完整導讀：課程為何存在、哪些知識能轉移到 frontier scale、語言模型的發展主線，以及 byte-level BPE tokenizer 的訓練與取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-overview-tokenization-en)

本篇對應 Stanford **CS336 Spring 2026 Lecture 1: Overview, tokenization**，2026 年 3 月 30 日由 Percy Liang 主講。主要來源是官方的可執行講義 [`lecture_01.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py)，不是用前一學期影片重建當期內容。

這一講做兩件事。前半先回答「為什麼在已有 GPT、Claude、Gemini API 的年代，還要從零打造語言模型」；後半從原始位元組開始，實作 byte-level BPE tokenizer。兩段其實是同一件事：先找出會限制規模化的抽象，再親手拆開它。

## 課程不是反對抽象，而是提醒抽象會漏

Liang 把研究者與底層技術的距離排成一條時間線：早期研究者自己實作並訓練模型，後來下載 BERT 微調，現在則向 API 模型下 prompt。抽象層升高讓產出更快，但語言模型的抽象仍會漏出底層細節；想做基礎研究的人，不能只會呼叫最上層介面。

這不是「每個人都該自己訓練 frontier model」的口號。第一講直接承認，最前沿模型需要的資源與不透明度已超出一般研究者能重現的範圍。課程真正要保留的是三種知識：

- **Mechanics**：Transformer、tokenizer、模型平行等機制怎麼運作。
- **Mindset**：把硬體、資料和時間當成有限預算，持續追問效率。
- **Intuitions**：哪些資料與架構選擇可能改善品質。

前兩項較能跨規模轉移；第三項最危險，因為小模型上的直覺不一定能外推到大模型。這個區分替後面十六講立了一條界線：課程會教你可驗證的機制和計算方式，但不會把小規模實驗包裝成 frontier scale 的定律。

## Bitter lesson 真正留下的是效率

講義把 bitter lesson 的常見誤讀寫得很直接：不是「規模最重要，演算法不重要」，而是**能隨規模成長的演算法才重要**。課堂用一個簡潔的乘法來表達：

```text
accuracy = efficiency × resources
```

資源增加時，浪費也會一起放大，所以效率反而更重要。這讓「從零開始」有了實際判準：不是為了手刻而手刻，而是要知道一項設計如何改變計算、記憶體、資料需求與最終品質。

第一講回顧的歷史也沿著這條線前進：n-gram 到神經語言模型，LSTM 到 Transformer，再到 GPT-3 的 in-context learning。後面接著 scaling laws、Chinchilla、開放權重與開放訓練模型。年份和模型名稱很多，但主脊只有一條：每次進步都同時改變「模型能做什麼」與「資源怎麼換成能力」。

## 語言模型先看到 token，不是文字

語言模型對 token 序列建模，而 tokenizer 決定原始文字如何變成那個序列。最直覺的字元切分會遇到巨大字集與未知字元；按單字切分則讓詞彙表膨脹，還會把罕見字詞拆得很糟。CS336 採用 byte-level BPE：先把輸入編成 UTF-8 位元組，再反覆合併最常見的相鄰 token pair。

BPE 訓練可以濃縮成四步：

1. 以 256 種 byte value 作為初始詞彙表。
2. 掃描訓練語料，統計相鄰 token pair 的出現次數。
3. 把最常見的 pair 合併成新 token，記錄合併規則。
4. 重複直到詞彙表達到預定大小。

推論時不能重新統計。編碼器必須依訓練時學到的 merge 順序套用規則，否則同一段文字會得到不同 tokenization。這也是作業不只要求「輸出看起來合理」的原因：資料結構、tie-breaking、特殊 token 與 pre-tokenization 都會影響能否重現。

## 詞彙表大小沒有免費午餐

詞彙表太小，序列變長，Transformer 要處理更多位置；詞彙表太大，embedding 與輸出矩陣變大，罕見 token 也較難學好。壓縮率因此只是其中一個觀察值，不是唯一目標。

Byte-level 起點解決了 unknown token：任何 UTF-8 輸入最後都能拆成 bytes。不過「能編碼」不等於「切得好」。不同語言、程式碼、數字與特殊符號會得到不同壓縮效率；訓練語料的組成會直接寫進 tokenizer 的偏好。Tokenizer 看似只是前處理，實際上已經決定模型後面看到的基本單位與序列成本。

## 這一講要你真的做什麼

如果只是讀懂 BPE 定義，最容易漏掉的是效率與邊界條件。可以用小語料做一個縮小版練習：

1. 從 byte vocabulary 開始，不使用現成 tokenizer library。
2. 實作 pair counting、merge selection 與 merge application。
3. 用訓練語料以外的中文、英文、程式碼各測一次 round trip。
4. 比較不同 vocabulary size 的 token 數與 embedding 參數量。

最後一項把 tokenizer 接回課程主題：每少一個 token，後面的模型少處理一個位置；每多一個 vocabulary entry，輸入與輸出矩陣則多一列。你不是在挑一個漂亮的切字法，而是在分配整個訓練系統的成本。

## 材料完整度

本講有 Spring 2026 官方 schedule、完整可執行講義與官方課程錄影清單，足以對回當期講次。本文以講義為主；沒有把 Spring 2025 的影片、作業內容或後來的模型發展混進本講。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 1 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py)
- [CS336 Spring 2026 官方 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV)
- [Assignment 1: Basics](https://github.com/stanford-cs336/assignment1-basics)
