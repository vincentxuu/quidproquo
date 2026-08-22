---
title: "CMU 07-280 Lecture 1 導讀：AI、機器學習與表示學習的共同問題"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, machine-learning, representation-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 1
tldr: "Lecture 1 用 alien autoencoder、AI／ML 範圍與 AI 發展史建立全課座標：智慧系統不是模型清單，而是在不確定下把輸入表示成可計算決策。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 1：課程範圍、autoencoder 表示空間、AI 與 ML 的關係、發展週期，以及前八講的學習入口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-01-introduction-en)

這是 **CMU 07-280 Spring 2026 Lecture 1：Introduction**。它不是一堂把 AI 名詞排成時間線的暖身課。整份投影片反覆追問：當輸入太複雜，不能直接手寫規則時，系統如何建立可用的表示，再據此做預測或行動？

## 官方材料與讀取範圍

本文完整讀取 [Lecture 1 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec1_Intro.pdf)、[Notation Guide](https://www.cs.cmu.edu/~07280/notes/07280_Notation_Guide.pdf)與[Math Background notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Math_Background.pdf)。官方沒有匿名公開這一講的錄影或逐字稿，因此本文只解讀文件，不會補寫講者口述、現場活動結果或問答。

Spring 2026 的題名只有 **Introduction**。Fall 2026 首頁後來加入 alignment 與 safety，不屬於本篇版本。

## 承上問題：為什麼搜尋與 GPT-2 能放在同一門課

07-280 後面會先教搜尋、CSP，再教迴歸、神經網路、語言模型與強化學習。Lecture 1 並未用「它們都很熱門」來連接，而是把 AI 畫成較大的問題空間。Search、planning、logic 與 optimization 都在不確定下完成任務。Probabilistic graphical models、machine learning 與 reinforcement learning 也在這張圖裡；deep learning 只是 ML 的一部分。

這個分類很重要。若把 AI 等同深度學習，A* 或 CSP 看起來像歷史包袱。若把 AI 理解成「如何讓系統在限制與不確定下表現良好」，後續每種方法就是對不同資訊條件的解法。

## 完整概念脈絡：先有表示，才有學習

投影片先用 alien autoencoder 活動處理「表示」：人把外星人圖畫放到二維座標，再讓另一個人只看座標重畫。座標若保留了形狀、大小或肢體等重要變化，重建就比較接近原圖；座標選得不好，資訊會在壓縮時消失。

Autoencoder 把同一問題改成可學習系統：輸入影像經 encoder 壓成低維向量 `z`，decoder 再從 `z` 重建輸入。投影片的數字示例把 `28 × 28 = 784` 個像素壓到兩個 latent coordinates，再展開回 784 維。兩維不是「真正的外星人意義」，而是一個受重建目標約束的表示空間。

接著課程區分四種任務語言：

- **search**：在初始狀態到目標狀態之間找路徑；
- **optimization**：在限制下找最大或最小值；
- **machine learning**：從例子辨識規律；
- **reinforcement learning**：從獎勵與懲罰學會行動。

它們共享的前置工作，是決定什麼資訊要成為 state、feature、objective 或 reward。Lecture 1 因而不是先教模型，而是先讓讀者對表示方式保持警覺。

## 可重做的小例子：兩維 bottleneck 保留了什麼

假設每張外星人圖只有三個可觀察因素：眼睛數 `e ∈ {1,2,3}`、身高 `h ∈ [0,1]`、有無觸角 `a ∈ {0,1}`。你硬要只用兩個座標：

```text
z1 = h
z2 = e + 0.25a
```

身高可由 `z1` 完整還原；`z2` 多半能分出眼睛數，也用小數部分記錄觸角。但若 `e=2, a=0` 與 `e=1, a=4` 都被允許，就可能碰撞。這個玩具例子揭示 bottleneck 的代價：低維表示必須選擇保留哪些差異，而訓練目標決定哪些差異會被視為重要。

今晚重做時，不必訓練網路。拿十個日常物件，先自行定義兩個座標，再請另一個人只看座標猜物件特徵；猜不回來的部分就是表示丟掉的資訊。

## Recitation／HW 對應

Lecture 1 的 HW0 是 Gradescope online-only，校外無法匿名讀到題面或評分回饋。公開材料仍能支援兩項準備。先用 Notation Guide 統一向量、集合、機率與微分記號，再用 Math Background notes 檢查線代、微積分與機率是否足以支撐後續推導。

[Recitation 1](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)已經轉向 search formulation。這個安排延續本講的核心：先決定狀態如何表示，再談演算法。若 Tower of Hanoi 的 state、action、cost 與 goal test 寫不清楚，搜尋演算法再快也不知道自己在搜什麼。

## 延伸對照：AI 冬夏不是單一模型勝負

投影片把 AI 發展整理成多次「夏天／冬天」。路徑經過早期神經模型與 perceptron、承諾落空、expert systems、backpropagation 復興、SVM 與深度網路低潮，再到 2010 年代。這段不是要背年份，而是提醒讀者：方法能否成功，同時受表示、最佳化、資料與運算條件影響。

因此後面讀到 closed-form linear regression 或 CSP 時，不要用「是不是最新模型」評價它。先問：它假設你知道什麼、輸出什麼、如何計算好壞？這才是 07-280 的共同語言。

## 今晚可以做的動作

1. 讀 Notation Guide，把不熟的五個符號抄成自己的速查表。
2. 用「輸入、表示、輸出、好壞標準」四欄重寫一個熟悉的 AI 應用。
3. 打開 Recitation 1，只做 Tower of Hanoi 的 state 與 action 定義；不要先看 solution。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 1 — Introduction](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec1_Intro.pdf)
- [07-280 Notation Guide](https://www.cs.cmu.edu/~07280/notes/07280_Notation_Guide.pdf)
- [07-280 Spring 2026 Math Background](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Math_Background.pdf)
- [07-280 Spring 2026 Recitation 1](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
