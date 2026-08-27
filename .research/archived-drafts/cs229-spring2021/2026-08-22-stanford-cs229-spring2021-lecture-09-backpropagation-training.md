---
title: "Stanford CS229 Spring 2021 Lecture 9：Backpropagation 如何把一個 loss 傳回每一層"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, neural-networks, backpropagation]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 10
tldr: "Backpropagation 不是另一個最佳化器，而是沿計算圖反向套用 chain rule，重用每層的誤差信號來求所有參數梯度；activation、初始化與 momentum 則決定這些梯度能否穩定傳遞。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 9：反向傳播、chain rule、ReLU、Xavier/He 初始化、梯度消失與爆炸，以及 momentum。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-09-backpropagation-training-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 10 篇，對應 **Stanford CS229, Spring 2021, Lecture 9**。課程表日期是 2021 年 4 月 26 日，官方題目是 **Neural Networks 2. Backpropagation.**；本文實際使用當學期的 Live Lecture Notes 與 Deep Learning 共用講義。錄影沒有作為來源。

Lecture 8 已經定義 forward pass：每一層先做仿射轉換，再套 activation。Lecture 9 反過來問，單一 loss 已經算出後，如何有效得到每一層 `W` 與 `b` 的梯度？答案不是逐一重算導數，而是沿同一張計算圖反向傳遞共用的中間量。

## Backpropagation 是 chain rule 的動態規劃

對第 `l` 層：

```text
z^[l] = W^[l]a^[l-1] + b^[l]
a^[l] = g^[l](z^[l])
```

定義反向訊號

```text
δ^[l] = ∂L / ∂z^[l]
```

若已知下一層的 `δ^[l+1]`，chain rule 給出

```text
δ^[l] = (W^[l+1])ᵀδ^[l+1] ⊙ g'^[l](z^[l])
```

其中 `⊙` 是逐元素相乘。接著參數梯度是

```text
∂L/∂W^[l] = δ^[l](a^[l-1])ᵀ
∂L/∂b^[l] = δ^[l]
```

真正的效率來自重用。`δ^[l]` 一旦算好，就同時服務該層權重、偏差與更前一層的梯度；不必為每個參數各走一次完整 chain rule。這種「先存 forward 中間量，再反向重用」很像計算圖上的動態規劃。

## Logistic output 為何讓梯度變簡單

對 sigmoid output 與 binary cross-entropy，複雜的分式會相消，最後得到

```text
δ^[L] = a^[L] - y
```

這不是任意 loss 都有的魔法，而是 sigmoid 與 cross-entropy 的特定配對。接著只要把這個 output error 乘上權重矩陣並套每層 activation derivative，就能逐層往回傳。

對 mini-batch，單筆外積改成矩陣乘法，梯度再對 batch 平均。向量化沒有改變 chain rule，只是把多個樣本的同一組運算併在一起。

## Activation 會改變梯度通道

Sigmoid 在 `|z|` 很大時接近飽和，導數靠近零；多層連乘後，前面層的梯度可能快速縮小。Tanh 的輸出以零為中心，但同樣會飽和。ReLU

```text
g(z) = max(0,z)
```

在正半軸的導數是 `1`，能減輕部分梯度衰減問題；負半軸導數是 `0`，也可能讓單元不再更新。講義在這一講把 ReLU 當成常見改善，不把它寫成解決所有訓練問題的保證。

更一般地，若每層反覆乘上權重與 activation derivative，乘積的尺度可能趨近零，也可能快速放大。前者是 vanishing gradients，後者是 exploding gradients。兩者都不是 loss 表面的一個單點問題，而是訊號跨越多層時的尺度問題。

## Xavier 與 He 初始化在控制什麼

如果每個 unit 接收 `n_in` 個近似獨立的輸入，權重太大會讓 activation 或 gradient 的變異一路放大，太小則會一路縮減。講義給出的初始化直覺，是讓權重變異隨 fan-in 縮小：

```text
Var(w) ≈ 1 / n_in       # Xavier，常搭配 tanh
Var(w) ≈ 2 / n_in       # He，常搭配 ReLU
```

這些比例是在簡化的獨立與尺度假設下維持訊號變異，不是對任何架構的收斂證明。它們解決的是「一開始就讓尺度失控」的風險；資料分布、深度、activation 與最佳化設定仍會影響訓練。

初始化也不能把所有權重設成同一值。若同一層 units 起點與輸入完全相同，它們的梯度也相同，之後仍學成同一個 unit。隨機初始化的基本作用之一，就是打破這種對稱。

## Momentum 如何平滑更新方向

普通 gradient descent 直接用當前梯度更新。Momentum 先維護一個移動平均：

```text
v_t = βv_{t-1} + (1-β)g_t
θ_t = θ_{t-1} - ηv_t
```

當連續梯度方向一致，速度會累積；當梯度在某個方向來回震盪，平均會削弱震幅。它不是改變 backpropagation 算出的導數，而是改變最佳化器如何使用導數。把「求梯度」與「用梯度更新」分開，是這堂課很重要的概念界線。

公開講義列出 gradient descent、SGD、mini-batch 與 momentum，但沒有在這一講建立統一的收斂率比較。因此本文不替它們排一個不分情境的優劣順序。

## 這一講的限制

手寫講義用小型全連接網路推導反向傳播，沒有處理自動微分框架、數值穩定技巧、normalization、residual connections 或 adaptive optimizers。它也沒有證明非凸神經網路一定找到 global optimum。這一講支持的是梯度的計算方法與尺度直覺，不是完整的深度學習工程手冊。

Backpropagation 只保證依照計算圖與 chain rule 計算導數。模型規格錯了、loss 不合任務、資料有偏差，導數仍可能完全正確；梯度正確不等於建模決策正確。

## 這一講在十八講裡的位置

Lecture 8 建立 forward computation，Lecture 9 補上 backward computation 與訓練穩定性，完成 CS229 Spring 2021 的兩講神經網路段落。Lecture 10 會從單次訓練跳到模型選擇：同一個學習程序換一批訓練資料後會變多少，以及正則化如何在偏差與變異之間取捨。

可以用 gradient check 檢查理解：選一個很小的網路，以有限差分近似某個權重的導數，再跟 backpropagation 的值比較。這只能驗證實作是否符合微分，不能驗證模型是否適合任務，但正好對應這一講的範圍。

### 延伸

實驗時把每層 activation 與 gradient 的平均尺度畫出來，再分別使用過大、過小、Xavier 或 He 初始化。不要只看最終 loss；逐層曲線會直接顯示訊號在哪裡開始消失或爆炸，讓初始化的作用從一句口訣變成可觀察現象。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 9 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture9_live.pdf)
- [Deep Learning notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/deep_learning_notes.pdf)
