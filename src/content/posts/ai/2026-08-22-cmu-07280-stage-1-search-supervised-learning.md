---
title: "CMU 07-280 階段複習一：從搜尋問題走到監督式學習"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, search, supervised-learning, machine-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 25
type: deep-dive
tldr: "第一階段把 Lectures 1–12 串成同一條決策鏈：先定義狀態、動作與目標，再用 heuristic、loss、regularization 與 backpropagation 控制龐大搜尋空間。"
description: "複習 CMU 07-280 Spring 2026 前十二講，整理搜尋、CSP、決策樹、迴歸、最佳化與神經網路之間的共同結構。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-stage-1-search-supervised-learning-en)

07-280 的前十二講看起來像兩門課硬接在一起：Lecture 2–4 是傳統 AI 搜尋，Lecture 5–12 則轉進監督式學習與神經網路。真正連接兩段的不是「都叫 AI」，而是同一個工程問題：**你如何表示候選解，如何衡量它，如何在不可能窮舉的空間裡找到夠好的答案？**

這篇是第一階段整合，不取代逐講文章。它把 Spring 2026 syllabus 的 Search Fundamentals 與 ML Fundamentals 放在同一張圖上，讓你檢查自己是否只記得演算法名稱，還是真的能把問題寫成可計算的形式。官方沒有完整逐講公開錄影，因此以下只根據 syllabus、公開講義、recitation 與 homework 規格重建。

## 同一條主線：表示、評分、移動

搜尋問題先明定 state、action、transition、goal test 與 path cost。監督式學習換了一套詞：輸入特徵是表示，模型參數決定候選函數，loss 評分候選解，optimizer 則決定如何移動。CSP 的 variable／domain／constraint，也能讀成另一種表示與評分介面。

```text
搜尋：state ──action──> next state ──cost/heuristic──> priority
學習：weights ─gradient─> new weights ─────loss──────> priority
```

差別在搜尋空間的結構。A* 在明確圖上展開節點；gradient descent 在連續參數空間裡沿局部斜率移動；decision tree 則在離散 split 空間裡貪婪選擇。把三者都叫 optimization 不代表它們能互換，卻能提醒你每次都要問：候選解是什麼、一步怎麼走、停止條件是什麼？

## Heuristic 與 feature 都是有意義的壓縮

Heuristic search 不可能先算完所有未來，只能用 `h(n)` 壓縮「距離目標還有多遠」。監督式模型也不直接理解原始世界，而是透過 feature 把輸入壓成能計算的座標。兩者的品質都取決於壓縮後保留了什麼。

以格點搜尋為例，Manhattan distance 忽略障礙物，卻能提供便宜的方向感。以垃圾郵件分類為例，字詞計數忽略語序，卻可能已足以分辨大量樣本。好的表示不等於資訊最多；它要在計算成本與決策能力之間取得平衡。

今晚可以做一個對照練習：拿同一個路徑規劃問題，先寫出 A* 的 `h(n)`，再假設你有歷史路徑資料，列出一個 learned heuristic 會用的三個 feature。接著問每個 feature 是否可能高估剩餘成本；如果會，就不能直接沿用 A* 最佳性保證。

## 從 tree depth 到 model capacity

Adversarial search 的 depth limit 與監督式學習的 model capacity 處理相似風險：算得越深、模型越大，表達能力越高，成本與錯誤來源也跟著增加。Minimax 搜得不夠深會受 evaluation function 偏差支配；決策樹長得太深則會記住訓練資料的偶然分支。

Regularization 不是「讓模型比較簡單」這句口號而已。它把偏好直接寫進目標函數：

```text
J(w) = data_loss(w) + λ · penalty(w)
```

`λ` 增大時，模型更願意犧牲訓練誤差來換取受限制的參數。這和 alpha-beta pruning 不同：pruning 在不改 minimax 結果的條件下跳過不影響答案的分支；regularization 會改變選出的解。兩者都減少有效搜尋，但保證完全不同。

## Backpropagation 是計算圖上的責任分配

Linear regression、logistic regression 與 neural networks 的差別，不只在函數長得更複雜。神經網路把函數拆成多層可微運算，而 backpropagation 用 chain rule 把最後的 loss 責任逐層分回參數。

對 `y = (wx + b)^2`，令 `z = wx + b`，就有：

```text
dy/dw = (dy/dz)(dz/dw) = 2z · x
dy/db = (dy/dz)(dz/db) = 2z
```

真正重要的是中間值 `z` 可以被重用。自動微分框架儲存計算圖與局部導數，不必為每個新模型手寫整條導數。這一點會直接接到下一階段的 AlexNet：卷積網路不是另一種魔法，而是把可微部件放進更深、更有結構的圖。

## 作業如何檢查這段主線

[07-280 官方作業表](https://www.cs.cmu.edu/~07280/)把 HW1 放在 heuristic search，HW2 接 adversarial search 與 CSP；之後逐步進入線性／logistic regression、regularization 與 neural networks。作業同時包含 written、programming 與 online components，表示「能推導」和「程式能跑」是兩個不同檢查面。

校外讀者拿不到完整 Gradescope feedback，但可保留同一驗收方式：每個主題至少交付一頁手算與一個可執行例子。搜尋段用節點展開順序與最終路徑；學習段用 loss curve、validation metric 與一次錯誤分析。只有 notebook 跑完，還不能證明你知道為什麼。

## 第一階段的通關條件

你應該能從自然語言題目寫出 representation、objective 與 update rule；能說清楚 heuristic、feature、loss 與 regularizer 各自壓縮或偏好什麼；也能手算一次 backpropagation。如果其中一項只能背定義，就回到對應逐講文章與 recitation worksheet，不要急著進 AlexNet。

下一階段會把這些零件裝進三個具體系統：CNN 讓影像表示具有空間結構，GPT-2 讓序列表示透過 attention 互動，而訓練框架負責把計算圖真正跑在硬體上。

## 參考資料

- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [Spring 2026 Midterm 1 learning objectives](https://www.cs.cmu.edu/~07280/07280_S26_Learning_Objectives_Midterm_1.pdf)
- [Recitation 1: Search](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
- [Recitation 6: Neural Networks](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6.pdf)
