---
title: "CMU 07-280 Lecture 12：Backpropagation 如何重用 Chain Rule"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, backpropagation, neural-network]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 12
type: deep-dive
tldr: "Lecture 12 把神經網路視為 computation graph：forward pass 保存中間量，backward pass 從 loss 開始傳遞 upstream gradient，並用線性層、activation 與 softmax 的局部規則一次算出全部參數梯度。"
description: "詳細導讀 CMU 07-280 Spring 2026 Lecture 12：universal approximation、computation graph、vectorized backprop 與 softmax-cross-entropy 梯度。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-12-backpropagation-en)

Spring 2026 第 12 講的官方題名是 **Neural Networks (cont.)**，日期為 2 月 19 日；本文標題用 Backpropagation，是因為公開 slides 的主體正是向量化反向傳播。Fall 2026 把該講直接改名 Backpropagation，但本文的版本與材料仍鎖定 Spring。課程沒有公開逐講錄影。

## 官方材料與讀取範圍

本文使用 [Lecture 12 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec12_Neural_Networks_II.pdf)、[Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)、[Recitation 6 解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf)及 [HW6](https://www.cs.cmu.edu/~07280/assignments/hw6_blank.pdf)。Slides 先談 universal approximation，再用 scalar 與 matrix calculus 展開 backprop；本文不把 theorem 誤讀成「任何網路都容易訓練」。

## 承上問題：會表示，不等於算得出梯度

Lecture 11 已定義 multilayer network。若為每個 weight 個別展開 chain rule，同一段路徑的導數會重算很多次。Backprop 的關鍵不是新微積分，而是 dynamic programming：一個節點先彙總下游傳回的 gradient，再把結果分配給它的輸入與參數。

Universal approximation theorem 只說適當寬度的網路能近似廣泛函數；它不保證有限資料下會 generalize、不保證 gradient descent 找到那組參數，也不說所需網路很小。表達能力與可訓練性是兩個問題。

## 完整概念脈絡：forward 保存值，backward 傳遞敏感度

對一層 `z=Wa+b`，若 backward 收到 `δz=∂J/∂z`，局部規則是：

```text
∂J/∂a = Wᵀ δz
∂J/∂W = δz aᵀ
∂J/∂b = δz
```

第一式把 sensitivity 傳回前層；後兩式產生本層參數梯度。對 element-wise sigmoid：

```text
δz = δa ⊙ a ⊙ (1-a)
```

對 ReLU，正的 pre-activation 讓 gradient 通過，負值把它截成零。Forward pass 因此要保存 `a` 或 `z`，backward 才能使用局部 derivative。

Softmax 單獨求 Jacobian 看似複雜，但和 cross-entropy 合併後，logits 的梯度簡化為：

```text
∂J/∂z = ŷ - y
```

這和 Lecture 9 的 logistic gradient 是同一個結構：預測機率減去真實 one-hot。HW6 特別要求推導這個結果，因為實作時合併 layer 能避免建立完整 `K×K` Jacobian。

## 可重做推導：兩層線性網路的一個 backward pass

令：

```text
x=[2,1]ᵀ, W=[3,-1], b=0
z=Wx=5, J=(z-y)², y=4
```

先從 loss 開始：`∂J/∂z=2(z-y)=2`。套線性層規則：

```text
∂J/∂W = 2 xᵀ = [4,2]
∂J/∂b = 2
∂J/∂x = Wᵀ 2 = [6,-2]ᵀ
```

這個例子很小，卻完整展示 upstream gradient 的角色。若前面再接一層，`∂J/∂x` 就不是拿來更新資料，而是作為前一層收到的 gradient。

## Recitation／HW 對應

Recitation 6 以具體 `2→2→1` 網路手算兩個 weight derivatives，要求把 chain expression 一段一段寫出。HW6 再把相同工作向量化：linear layer 的 input、weight、bias gradients，sigmoid 的 Hadamard product，以及 softmax-cross-entropy 的 `ŷ-y`。

這份 HW 是目前公開材料中最接近「自己實作 autograd primitive」的部分。不過只有 written PDF 並不包含完整 autograder 與 staff feedback；匿名自學應另外寫 finite-difference gradient check。

## 延伸對照：backprop 與 gradient descent 不是同一件事

Backprop 計算 `∇θJ`；gradient descent 決定怎麼用它更新 `θ`。前者是 efficient differentiation，後者是 optimization rule。SGD、momentum 或 Adam 都能使用 backprop 產生的 gradient。把兩者混成一個名詞，會無法定位問題到底出在 derivative、learning rate 還是 optimizer state。

下一講暫停模型推導，改問更高一層的問題：即使我們能有效最佳化 objective，那個 objective 是否真的代表人類想要的結果？

## 今晚可以做的動作

實作 `linear_forward` 與 `linear_backward`，再用中央差分檢查一個 weight：`(J(w+ε)-J(w-ε))/(2ε)`。讓 analytic 與 numerical gradient 的相對誤差低於你設定的容忍值，再加入 sigmoid。最後用一筆三類 one-hot 資料驗證 softmax-cross-entropy 對 logits 的 gradient 是 `ŷ-y`。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 12 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec12_Neural_Networks_II.pdf)
- [Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)
- [Recitation 6 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf)
- [HW6：Backpropagation in Neural Network Layers](https://www.cs.cmu.edu/~07280/assignments/hw6_blank.pdf)
