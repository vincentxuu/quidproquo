---
title: "Stanford CS229 Lecture 15：Self-Supervised Learning 如何從資料自己產生標籤"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, self-supervised-learning, language-models]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 16
tldr: "Self-supervised learning 隱藏、修改或配對資料的一部分，讓輸入本身產生 pretext task；word2vec、GPT 與 BERT 分別用鄰近詞、下一詞與遮罩詞建立可轉移的表示。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 15：pretext task、word2vec、GPT、BERT，以及自我監督模型在偏見、事實記憶與符號推理上的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-15-self-supervised-learning-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 16 篇，對應 **Stanford CS229, Spring 2021, Lecture 15**。課程表日期是 2021 年 5 月 17 日，官方題目是 **Self-supervised learning (Language Models & Image Models)**。本文實際使用該學期的 *Self-Supervised Learning* 投影片；錄影在 Canvas，沒有作為來源。

Self-supervised learning 的關鍵不是「完全沒有 supervision」，而是**標籤不由人工逐筆提供**。系統隱藏或修改輸入的一部分，再要求模型復原、辨識或預測它。這個人為設計的 pretext task 提供訓練訊號，學到的表示再轉移到真正的 downstream task。

## Pretext task 決定模型被迫學什麼

圖片可以旋轉後要求模型判斷角度，也可以製作兩個 augmentation，要求同一張圖片的表示靠近。文字則天然帶有順序與上下文，因此可把鄰近詞、下一個詞或被遮住的詞當作答案。

一個 pretext task 有用，不是因為它難，而是因為解題所需資訊與下游任務重疊。辨識圖片旋轉角度可能迫使模型理解物體方向；預測下一個詞可能迫使模型捕捉語法、語意與長距依賴。若模型能靠捷徑解題，表示未必會學到預期內容。

## word2vec：從局部共現學靜態詞向量

word2vec 的 CBOW 用上下文預測中心詞，skip-gram 反過來用中心詞預測鄰近詞。以 skip-gram 為例，中心詞 `w_t` 與上下文詞 `w_{t+j}` 的機率可寫成 softmax：

```text
p(wₒ | wᵢ) = exp(uₒᵀvᵢ) / Σ_w exp(u_wᵀvᵢ)
```

內積大代表兩個詞在語料中常出現在相似位置。對滑動視窗內的真實詞對最大化 log likelihood，會把可互相預測的詞拉近。這讓稀疏 one-hot 表示變成稠密向量，也產生可用 cosine similarity 比較的幾何結構。

限制是每個詞只有一個向量。`ship` 作名詞和動詞時共享同一表示，句子裡的具體上下文只能交給後續模型處理。

## GPT：把整個模型預訓練成下一詞預測器

自回歸 language model 用 chain rule 分解序列機率：

```text
p(w₁, …, w_T) = Π_t p(w_t | w₁, …, w_{t-1})
```

GPT 以 Transformer decoder 最大化這些條件機率。與只預訓練第一層詞向量不同，它先訓練整套 contextual representation，再加一個任務層做 finetuning。下一詞預測只看左側內容，適合生成，也因此是單向表示。

公式的直覺是：每個位置都由原始文字自動提供一筆訓練案例。大量語料帶來大量訊號，不需要另外建立標註表。

## BERT：遮住答案，才能同時看左右文

若模型同時看到左右文又直接預測原位置，它會偷看答案。Masked language modeling 先選部分 token，以 `[MASK]`、隨機詞或原詞替代，再對被選中的位置計算 cross-entropy：

```text
L_MLM = - Σ_{t ∈ M} log p(w_t | corrupted sequence)
```

BERT 使用 Transformer encoder，因此被遮住位置的表示可以結合兩側資訊。投影片說明其 masking 配方，也點出取捨：遮得多會減少可用上下文，遮得少則每個序列產生的預測訊號較少。

## 三個成功案例不等於問題已解完

Lecture 15 把限制收在三類：

- **偏見**：表示會吸收訓練語料中的刻板關聯，並轉移到下游任務。
- **事實知識**：模型可能輸出型別合理但事實錯誤的答案；稀有、未見或換個問法的事實尤其脆弱。
- **符號推理**：在年齡、大小、否定與頻率等任務上，表面成功可能依賴訓練分布中的模式，而不是可組合的抽象規則。

這些限制共同提醒：pretext loss 衡量的是 pretext task，不是「理解」的總分。模型在 downstream benchmark 變好，也不能自動證明它以人類預期的方式推理。

## 這一講在十八講裡的位置

Lecture 14 的 weak supervision 仍由人設計 labeling functions；Lecture 15 則從資料內部製造預測目標。兩者都處理標籤昂貴的問題，但 self-supervision 將重心從「合併多個有噪音來源」移到「設計能學到可轉移表示的任務」。

下一講回到 ML 專案全生命週期。那裡的問題不再是預訓練目標怎麼寫，而是資料、規格、切分、監控與迭代是否讓模型真的可用。

## 延伸

評估一個新的 pretext task 時，不要只看它自己的 loss。先列出希望下游表示保留的資訊，再設計至少一個不共享訓練捷徑的 probing 或 downstream test。若 pretext 分數提高、真正任務沒有變好，就要重新檢查訓練訊號是否對準目標。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 15 Self-Supervised Learning slides](https://cs229.stanford.edu/notes2021spring/notes2021spring/cs229_lecture_selfsupervision_final.pdf)
