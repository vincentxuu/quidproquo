---
title: "CMU 07-280 Lecture 11：從 Logistic Regression 組出第一個 Neural Network"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, neural-network, representation-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 11
type: deep-dive
tldr: "Lecture 11 把單一 logistic neuron 擴成多層網路：linear layer 產生 z、activation 產生 a，多個 neuron 共同學出 feature transform，再以 loss 和 gradient descent 訓練權重。"
description: "逐講導讀 CMU 07-280 Spring 2026 Lecture 11：神經元、activation、多層網路、參數計數、forward pass 與 scalar backprop。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-11-neural-networks-en)

第 11 講 **Neural Networks** 在 2026 年 2 月 17 日進行。它沒有把神經網路當成全新的神祕模型，而是從已學過的 linear／logistic regression 往上堆：每個 neuron 都先做加權和，再套 activation；多個 neuron 組合後，feature transform 不再由人手寫。沒有公開逐講錄影，本文只讀文字材料。

## 官方材料與讀取範圍

主要來源是 [Lecture 11 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec11_Neural_Networks_I.pdf)、[Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)、[Recitation 6 解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf)與 HW6。Slides 包含互動 demo 的課堂活動提示，但沒有公開投票結果；本文不把空白投影片補成講者答案。

## 承上問題：如果 φ(x) 也能從資料學出來呢

Lecture 10 的 polynomial feature 是人指定 `φ(x)=[1,x,x²,…]`。這在低維資料很好用，影像或語言卻沒有明顯的完整特徵清單。Neural network 把 transform 本身參數化：前層輸出成為後層特徵，所有層一起針對最終 loss 調整。

單一 neuron 可寫成：

```text
z = wᵀx + b
a = g(z)
```

`g` 若是 identity，就是 linear regression；若是 sigmoid，就是 logistic unit；若是 step function，則接近 perceptron。新東西不在單顆 neuron，而在可微分單元的組合。

## 完整概念脈絡：z、a、layer 與可學表示

課程刻意分開 `z` 和 `a`。`z` 是 linear layer 的 pre-activation，`a=g(z)` 是送往下一層的表示。以兩個 hidden neurons 的 regression network 為例：

```text
z1 = W1 x + b1
a1 = ReLU(z1)
ŷ  = W2 a1 + b2
```

ReLU `max(0,z)` 讓不同 neuron 各自形成一段線性片段，組合後能擬合彎曲函數。若每層只做線性轉換，無論堆幾層都可合併成一個矩陣，深度沒有增加表達力；nonlinearity 才讓 composition 產生新函數。

參數計數也必須從 shape 出發。若一層有 `d_in` 個輸入、`d_out` 個輸出，linear layer 有：

```text
d_out × d_in + d_out
```

個參數，後一項是 bias。Activation 沒有可學參數。把 activation 也算成 weights，會在後續 CNN 與 transformer 架構中一路算錯。

訓練仍是 ERM。Regression 可用 squared error，classification 常用 softmax cross-entropy；gradient descent 只更新 `W` 與 `b`，不更新輸入 `x`、中間 activation 或標籤。中間量會參與求導，但不是 model parameters。

## 可重做小例子：兩顆 ReLU 組一個帳篷

令輸入是一維，hidden units 為：

```text
a1 = ReLU(x)
a2 = ReLU(x-1)
ŷ  = a1 - 2a2
```

分段計算：`x<0` 時兩者皆 0；`0≤x<1` 時 `ŷ=x`；`x≥1` 時 `ŷ=x-2(x-1)=2-x`。兩顆 ReLU 已經組出先上升再下降的折線。這說明 network 的「feature」不是預先命名的欄位，而是由 weights 和 biases 決定的可用區域。

再數參數：第一層兩個 weights、兩個 biases，輸出層兩個 weights 加一個 bias，共 7 個。即使某個數值手動設為 0，只要它是可學位置，仍要算參數。

## Recitation／HW 對應

Recitation 6 給出一個 `2→2→1` 網路，要求逐步算 `z1`、ReLU 後的 `a`、`z2`、sigmoid output、loss 與參數量。這正是本講最重要的讀圖能力：先看 tensor shape，再看每個 layer 做什麼。

HW6 進一步要求 linear、sigmoid、softmax-cross-entropy 各層的反向公式；那主要屬於 Lecture 12，但也反過來驗證 Lecture 11 的 forward notation 是否清楚。公開 PDF 能手算，完整 autograder 與回饋仍受限。

## 延伸對照：手工 feature 與 representation learning

多項式 feature 先固定 basis，再只學最後權重；neural network 連 basis 都一起學。代價是 objective 通常不再凸，參數有對稱性，結果對初始化與最佳化更敏感。表達力提高並沒有取消 Lecture 10 的 model selection，而是讓它更重要。

Lecture 12 接著回答實作核心：每個參數的梯度若都展開成一條長 chain rule，計算會大量重複。Backpropagation 會沿 computation graph 反向重用局部導數。

## 今晚可以做的動作

在紙上畫一個 `2→3→2` 網路，替每個 `W`、`b`、`z`、`a` 標 shape，算出總參數量。接著任選一個二維輸入與小整數權重，完整算一次 forward pass；最後只對其中一個輸出層 weight 手算 loss derivative，為下一講預熱。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec11_Neural_Networks_I.pdf)
- [Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)
- [Recitation 6 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf)
- [HW6 written component](https://www.cs.cmu.edu/~07280/assignments/hw6_blank.pdf)
