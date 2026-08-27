---
title: "Stanford CS229 Spring 2021 Lecture 8：從 Logistic Regression 組成第一個神經網路"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, neural-networks, deep-learning]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 9
tldr: "神經網路把仿射轉換 z=Wᵀa+b 與非線性 activation 重複堆疊；前向傳播定義預測，mini-batch gradient descent 負責更新參數，而 hidden units 讓模型能共同學出中間表示。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 8：mini-batch SGD、logistic regression、softmax、多層神經網路記號與向量化前向傳播。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-08-neural-networks-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 9 篇，對應 **Stanford CS229, Spring 2021, Lecture 8**。課程表日期是 2021 年 4 月 21 日，官方題目是 **Neural Networks 1.**；本文實際使用當學期的 Live Lecture Notes 與 Deep Learning 共用講義。錄影沒有作為來源。

這堂課沒有從龐大的深度學習架構開始，而是把 logistic regression 拆成「線性計算加 activation」，再一層一層堆起來。這條主線很重要：神經網路不是另一套完全不同的數學，而是把熟悉的預測單元組合成可共同訓練的計算圖。

## 先把最佳化問題留在桌上

對資料 `{(xᵢ,yᵢ)}` 與單筆損失 `ℓ(hθ(xᵢ),yᵢ)`，經驗風險是

```text
J(θ) = (1/n) Σᵢ ℓ(hθ(xᵢ), yᵢ)
```

全批次 gradient descent 每一步計算所有樣本的梯度。Stochastic gradient descent 每次抽一筆，更新便宜但雜訊大。Lecture 8 把 mini-batch 放在兩者之間：每次抽 `B` 筆，平均它們的梯度後更新。

```text
g = (1/B) Σⱼ ∇θ ℓ(hθ(xⱼ), yⱼ)
θ ← θ - ηg
```

講義指出，一批梯度的矩陣運算通常比逐筆執行更能利用硬體。不過它沒有宣稱某個 batch size 永遠最佳；記憶體、計算吞吐與梯度雜訊之間仍要取捨。

## Logistic regression 已經是一個 neuron

二元分類先計算

```text
z = wᵀx + b
a = σ(z)
```

其中 `σ` 把分數轉成 `0` 到 `1` 之間的輸出。交叉熵損失可寫為

```text
L(a,y) = -y log a - (1-y) log(1-a)
```

把 `wᵀx+b` 看成線性部件、`σ` 看成 activation，logistic regression 就是一個最小的神經元。Lecture 8 接著問：如果不是只辨認「有沒有貓」，而要分辨多個動物類別，輸出應該怎麼改？

對互斥的多類別輸出，softmax 把每個類別分數 `zₖ` 正規化：

```text
aₖ = exp(zₖ) / Σⱼ exp(zⱼ)
```

搭配 one-hot label，cross-entropy 只會挑出正確類別的 `-log aᵧ`。這裡的假設是每張圖只有一個互斥類別。若多個標籤可以同時成立，就不能直接把這個設定當成同一問題。

## Hidden layer 在學什麼

多層網路把上一層輸出當成下一層輸入：

```text
z^[l] = W^[l] a^[l-1] + b^[l]
a^[l] = g^[l](z^[l])
```

輸入層 `a^[0]=x`，最後一層 `a^[L]` 是預測。中間 hidden layer 的每個 unit 都讀取上一層的輸出，形成新的表示。房價例子中，原始特徵可能先組合成家庭大小、地段或生活品質之類的中間訊號，再交給輸出層；這些名稱是直覺圖示，不是講義證明每個神經元必然得到可命名概念。

沒有非線性 activation 時，多層仿射轉換仍可合併成一層：

```text
W₂(W₁x+b₁)+b₂ = W'x+b'
```

因此深度本身不夠，非線性才讓組合後的函數超出單一線性模型。講義列出 sigmoid、tanh 與 ReLU，並把不同 activation 的細部訓練問題留到下一講。

## 向量化不是只為了記號漂亮

對一批 `n` 個樣本，把每個 `xᵢ` 放成矩陣 `X` 的欄，便可一次計算

```text
Z^[l] = W^[l] A^[l-1] + b^[l]
A^[l] = g^[l](Z^[l])
```

其中 `b^[l]` 會沿 batch 維度廣播。這個表示同時解決兩件事：公式不必對每個樣本重寫，實作也能交給高效率矩陣乘法。維度檢查則是最直接的除錯工具：若第 `l` 層有 `n_l` 個 units，`W^[l]` 應把 `n_{l-1}` 維輸入映到 `n_l` 維輸出。

Lecture 8 到這裡只完成 forward propagation。它定義了模型如何從 `x` 算到 `ŷ`，也定義了要最小化的 loss，卻還沒有回答每一層梯度如何有效取得。那正是 Lecture 9 的入口。

## 這一講的限制

公開講義以全連接網路為主，沒有在這一講展開 convolution、attention 或深層架構的工程細節。它也沒有給出「神經元一定會學出某種語意」的保證。Hidden representation 是模型可學習的中間變換；它是否可解釋、是否泛化，仍取決於資料、目標、架構與最佳化。

Mini-batch 向量化也不等於已解決最佳化。非凸目標可能有不同的 stationary points，batch 大小與 learning rate 會改變訓練路徑。Lecture 8 建立的是計算框架，不是收斂保證。

## 這一講在十八講裡的位置

Lecture 7 使用預先選定的 kernel 隱含指定特徵空間；Lecture 8 改成由多層參數共同學習表示。下一講會沿著今天的計算圖反向傳遞導數，再處理 activation、初始化、梯度消失或爆炸與 momentum。

最好的自我檢查是畫一個兩層網路，替每個 `W`、`b`、`z`、`a` 標上矩陣形狀，然後手算一個樣本的 forward pass。形狀若對不上，通常不是矩陣乘法「差一個 transpose」而已，而是你還沒說清楚每一層把什麼映到什麼。

## 延伸

可以把同一個 forward pass 寫成逐樣本迴圈與矩陣版，先確認數值相同，再量測 batch 增大時的差異。這個練習能把「向量化比較快」拆成可檢查的實作事實，也會讓 broadcasting 出錯時的形狀問題變得具體。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 8 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture8_live.pdf)
- [Deep Learning notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/deep_learning_notes.pdf)
