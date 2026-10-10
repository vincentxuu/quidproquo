---
title: "台大 ADL 2025 第 2 講：神經網路與反向傳播"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, deep-learning, neural-networks, backpropagation]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 2
tldr: "ADL Fall 2025 的 NN Basics 與 Backpropagation 兩份講義，把「訓練一個模型」拆成三個問題：模型是什麼（一層層的神經元，每層是 z = Wa + b 再過非線性）、什麼叫好的函數（loss 越小越好）、怎麼挑出最好的（gradient descent，實務上用 mini-batch SGD）。上百萬個參數的梯度靠 backpropagation 有效率地算：forward pass 存下每層輸出，backward pass 從輸出層往回傳誤差訊號 δ，兩者相乘就是每個權重的梯度。"
description: "導讀台大陳縕儂 ADL Fall 2025 的 NN Basics（93 頁）與 Backpropagation（33 頁）講義及影片 2.1–2.5：訓練的三個問題、單一神經元與 bias、perceptron 與 XOR、多層感知器、activation 為什麼要非線性、loss function、gradient descent、SGD 與 mini-batch、訓練技巧、learning recipe，以及用 chain rule 推出的反向傳播。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 2 篇。ADL Fall 2025（114-1，2025/09/01–12/15）把這兩份講義和[第 1 篇](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)的 Introduction 一起放在「自學／先修」列，是選課前就要看完的 HW0 內容。

**本文依據**：[NN Basics 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf)（93 頁）、[Backpropagation 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Backprop.pdf)（33 頁），以及五支影片：

| 影片 | 長度 | 對應講義 |
|---|---|---|
| [2.1 How to Train a Model? 如何訓練模型?](https://youtu.be/YfNmHxDHE-M) | 4:41 | NN Basics 第 4–7 頁 |
| [2.2 What is a Model? 模型是甚麼?](https://youtu.be/AySPuO7vOvA) | 46:40 | NN Basics 第 8–44 頁 |
| [2.3 What does the "Good" Function Mean? 什麼叫做好的Function呢?](https://youtu.be/OjX-O9uuug8) | 8:41 | NN Basics 第 45–52 頁 |
| [2.4 How can we Pick the "Best" Function? 如何找出最好的Function](https://youtu.be/Uo3ZavxQyCs) | 57:29 | NN Basics 第 53–93 頁 |
| [2.5 Backpropagation 效率地計算大量參數](https://youtu.be/BHgssEwMxsY) | — | Backpropagation 全份 |

講義在 2026-09-30 打開核對。2.5 有掛在課程頁上，但不在 [2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)裡，只照清單看會漏掉；表中的頁碼範圍是依講義裡的章節標題頁對應，不是影片時間軸。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=YfNmHxDHE-M
title: ADL 2.1: How to Train a Model?（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=AySPuO7vOvA
title: ADL 2.2: What is a Model?（YouTube）
```

原始影片：[ADL 2.1: How to Train a Model?（YouTube）](https://www.youtube.com/watch?v=YfNmHxDHE-M)、[ADL 2.2: What is a Model?（YouTube）](https://www.youtube.com/watch?v=AySPuO7vOvA)、[ADL 2.3: What does the "Good" Function Mean?（YouTube）](https://www.youtube.com/watch?v=OjX-O9uuug8)、[ADL 2.4: How can we Pick the "Best" Function?（YouTube）](https://www.youtube.com/watch?v=Uo3ZavxQyCs)、[ADL 2.5: Backpropagation（YouTube）](https://www.youtube.com/watch?v=BHgssEwMxsY)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

## 訓練一個模型＝回答三個問題

第 1 篇的機器學習框架說：訓練就是從一組候選函數裡挑出最好的 f*。NN Basics 第 6 頁把它拆成三個問題，整份講義就照這三題走：

1. **Q1 模型是什麼？**（候選函數的集合長什麼樣）→ 模型架構
2. **Q2 什麼叫「好」的函數？** → loss function 設計
3. **Q3 怎麼挑出「最好」的函數？** → 最佳化

## Q1：模型是什麼

### 先把輸入和輸出變成向量

第 10–14 頁先限定範圍：分類任務，並假設輸入 x 和輸出 y 都能表示成固定長度的向量，f: R^N → R^M。兩個例子：

- **手寫數字**：16×16 的圖，每個像素一維，有墨水是 1、沒有是 0，共 256 維；輸出 10 維，每一維代表「是不是這個數字」。
- **情緒分析**：輸入是一個詞，向量長度等於詞彙表大小，只有該詞那一維是 1；輸出 3 維，對應正面、負面、中立。

第 10 頁也提醒：有些任務不容易寫成分類問題。

### 一個神經元、一層神經元

第 16–21 頁從單一神經元開始：輸入 x1…xN 各乘上權重 w1…wN，加上 bias b 得到 z，再經過 sigmoid σ(z) = 1 / (1 + e^(−z)) 輸出 y。w 和 b 就是這個神經元的參數。

- **bias** 是一個「永遠開著」的特徵，第 18 頁說它提供類別的先驗（class prior）。
- **單一神經元只能做二元分類**：y > 0.5 判成「是 2」，否則「不是 2」。
- **一層神經元可以做多類別**：手寫數字用 10 個神經元，各自判斷「是不是 1」「是不是 2」…，最後看哪個最大。

### perceptron 的極限：XOR

第 23–25 頁講 perceptron（單層神經元）：每個輸出單元各自運作、不共享權重，調整權重等於移動一道「懸崖」的位置、方向與陡度。它能表示 AND、OR、NOT，**但表示不了 XOR**，因為它本質上是一條線性分界。

解法是疊起來。A xor B = AB' + A'B：先用幾個單元算出中間結果，再組合。**多個操作疊加，就能產生更複雜的輸出。**

### 多層感知器與符號

第 27–29 頁把單層擴成多層感知器（MLP）。第 28 頁用圖說明表達力怎麼長出來：兩層可以把兩個方向相反的門檻函數組成一道「脊」，三層可以把兩道垂直的脊組成一個「凸塊」，再把大小、位置不同的凸塊加起來，就能逼近任意曲面。有多個 hidden layer 的全連接前饋網路就是 DNN。

第 30–40 頁定義符號，最後收成一條關係式，這條在反向傳播還會用到：

```text
z^l = W^l a^(l-1) + b^l      # 上一層輸出乘權重矩陣、加 bias 向量
a^l = σ(z^l)                 # 逐元素過 activation
```

<details>
<summary>符號對照（NN Basics 第 30–34 頁）</summary>

- `a_i^l`：第 l 層第 i 個神經元的輸出；整層輸出是向量 `a^l`。
- `w_ij^l`：從第 l−1 層神經元 j 連到第 l 層神經元 i 的權重；兩層之間的權重是矩陣 `W^l`。
- `b_i^l`：第 l 層神經元 i 的 bias；整層是向量 `b^l`。
- `z_i^l`：第 l 層神經元 i 的 activation 輸入；整層是向量 `z^l`。

整個網路就是把 `x = a^0` 一層層套這兩條式子，直到輸出層 `y = a^L`。

</details>

### 為什麼 activation 一定要非線性

第 43 頁列出常用的三種：sigmoid、tanh、ReLU。第 44 頁說明理由：**沒有非線性，疊再多層都等同於一個線性函數**；有了非線性，層數越多才能逼近越複雜的函數。

## Q2：什麼叫好的函數

第 48 頁把「挑函數」換成「挑參數」：W 和 b 不同，就是不同的函數，所以挑一個函數 f 等於挑一組模型參數 θ。

第 50 頁定義兩種衡量方式：loss（或 cost、error）函數 C(θ) 衡量 θ 有多差，要最小化；objective 或 reward 函數 O(θ) 衡量 θ 有多好，要最大化。第 51 頁給一個例子：把所有訓練樣本的誤差加總。第 52 頁列出常見的 loss：square loss、hinge loss、logistic loss、cross entropy loss。

## Q3：怎麼挑出最好的函數

### gradient descent

第 55 頁先排除兩條路：窮舉所有 θ 不可能；直接用微積分解，又不知道 C(θ) 在整個空間長什麼樣。

第 57–61 頁的方法是 gradient descent，比喻是「丟一顆球，看它滾到哪裡停」。從隨機的 θ⁰ 出發，算出該點的梯度，往反方向走一步，步長由 learning rate η 控制，重複直到參數不再變化。參數有兩個以上時，就對每一維各算偏微分，組成梯度向量。

第 64–69 頁拿只有三個參數（w1、w2、b）的單一神經元加 square error loss 手算一遍。第 71 頁點出真正的問題：神經網路的梯度牽涉上百萬個參數，**要有效率地算，就要用反向傳播**。

### SGD 與 mini-batch

第 72 頁指出 gradient descent 的另一個問題：要看完所有訓練樣本才更新一次，太慢。

| 方法 | 每次更新用多少樣本 | 講義的說法 |
|---|---|---|
| Gradient descent | 全部 K 筆 | 看完所有樣本才更新，慢 |
| SGD | 1 筆 | 看一筆就能更新，比 gradient descent 更快接近目標 |
| Mini-batch SGD | B 筆（batch size） | 訓練速度 mini-batch > SGD > gradient descent |

第 75 頁定義 epoch：看完一輪所有訓練資料。第 82 頁解釋為什麼 mini-batch 比 SGD 快：現代電腦做矩陣乘矩陣比做矩陣乘向量快，一次處理 B 筆比做 B 次單筆划算。

### 實務技巧與 learning recipe

第 83–87 頁提醒幾件事：

- 神經網路不保證找到全域最佳解（local optima）。
- 初始化不同，訓練出的模型就不同；參數不要設成一樣，要隨機設。
- learning rate 要小心設，太大會發散。
- mini-batch 訓練：每個 epoch 前先打亂樣本，避免網路記住順序；每個 epoch 用固定的 batch size；batch size 變成 K 倍時，理論上 learning rate 也可以變成 K 倍。

第 88–92 頁的 learning recipe 是除錯順序：先看訓練集表現好不好。不好的話，可能是候選函數裡根本沒有好的（改模型架構），或是找不到（改訓練策略）。訓練集好但驗證集差，就是 overfitting，可以加訓練資料或用 dropout 等技巧。

## 反向傳播：怎麼有效率地算梯度

Backpropagation 講義第 12 頁先分清楚兩個方向：

- **forward propagation**：資訊從輸入 x 往前流到輸出 y；訓練時一路算到一個純量 cost C(θ)。
- **back-propagation**：讓 cost 的資訊往回流，算出梯度。講義特別註明它能套用在任何函數上，不限神經網路。

第 13 頁的核心工具是 chain rule：forward 算 cost，backward 算梯度。

直覺是這樣：一個權重 `w_ij^l` 對 cost 的影響，要先經過它所在的 `z_i^l`，再經過後面每一層。講義把這條鏈拆成兩段相乘：

```text
∂C/∂w_ij^l = ∂z_i^l/∂w_ij^l  ×  ∂C/∂z_i^l
           = a_j^(l-1)        ×  δ_i^l
```

- 前一段就是上一層的輸出 `a_j^(l-1)`（第一層則是輸入 `x_j`），**forward pass 時已經算好了**。
- 後一段 `δ_i^l` 是傳到第 l 層的誤差訊號。講義第 20 頁的關鍵觀察是：**從輸出層 δ^L 一層層往回算到 δ^1，比對每個參數各自展開整條鏈有效率得多**，因為第 l 層的 δ 可以直接由第 l+1 層的 δ 算出。

第 32 頁的結語就是這一句：每個梯度都由兩個預先算好的量組成，一個來自 backward pass，一個來自 forward pass。

<details>
<summary>δ 的遞推（Backpropagation 第 20–30 頁）</summary>

**初始化：輸出層 δ^L。** 對輸出層第 n 個神經元：

```text
δ_n^L = ∂C/∂z_n^L = σ'(z_n^L) × ∂C/∂y_n
```

其中 `∂C/∂y_n` 取決於用哪個 loss function。寫成向量：`δ^L = σ'(z^L) ⊙ ∇_y C`（⊙ 是逐元素相乘）。

**遞推：由 δ^(l+1) 算 δ^l。** `z_i^l` 的變化先改變 `a_i^l`，再透過權重影響下一層每一個 `z_k^(l+1)`，所以要把所有路徑加總：

```text
δ_i^l = σ'(z_i^l) × Σ_k  w_ki^(l+1) × δ_k^(l+1)
δ^l   = σ'(z^l) ⊙ (W^(l+1))^T δ^(l+1)
```

講義第 26–27 頁把這條式子畫成一個「反向的網路」：δ^(l+1) 當作輸入，乘上轉置的權重矩陣 (W^(l+1))^T，再乘上一個常數 σ'(z_i^l)。因為 forward pass 已經算出 z，σ'(z) 在 backward 時就是已知的常數。

**展開來看**（第 28 頁）：

```text
δ^l = σ'(z^l) ⊙ (W^(l+1))^T [ σ'(z^(l+1)) ⊙ … (W^L)^T [ σ'(z^L) ⊙ ∇_y C ] ]
```

**合起來**（第 29–31 頁）：

1. forward pass：由輸入算出每層的 z^l 與 a^l，存下來。
2. backward pass：由 ∇_y C 算出 δ^L，再一路往回算到 δ^1。
3. 每個權重的梯度 = a_j^(l-1) × δ_i^l；bias 的梯度就是 δ_i^l（因為 ∂z/∂b = 1）。
4. 用這些梯度做一次 gradient descent 更新。

</details>

**今晚就能做的事**：拿一個 2 層、每層 2 個神經元的網路，隨便給一組權重與一筆輸入，手算一次 forward（記下每層的 z 和 a），再用上面的遞推算出 δ² 和 δ¹，得到每個權重的梯度。接著把某一個權重加減 0.0001，看 loss 的變化除以 0.0002 是不是接近你算出的梯度。對得上，就代表你真的懂了 backprop。

## 延伸閱讀

- [CS224N 第 3 講：矩陣微積分與反向傳播](/posts/ai/2026-08-22-cs224n-backprop-neural-nets)：同一套 chain rule，用計算圖與矩陣形狀的角度講，也講 gradient checking。
- [CMU 11-785 Lecture 4：梯度下降](/posts/ai/2026-08-22-cmu-11785-04-gradient-descent)與[Lecture 5：反向傳播](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)：推導更完整，也延伸到其他 optimizer。
- 這一講的 PyTorch 實作，可以對照 ADL 的 Dev Infra 助教課，見本系列[第 18 篇](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)。

上一篇：[什麼是機器學習與深度學習](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)
下一篇：[詞向量、語言模型與 RNN](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。

## 參考資料

- [ADL Fall 2025 NN Basics 講義（250901_NNBasics.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf)
- [ADL Fall 2025 Backpropagation 講義（250901_Backprop.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Backprop.pdf)
- [ADL 2.1: How to Train a Model?（YouTube）](https://youtu.be/YfNmHxDHE-M)
- [ADL 2.2: What is a Model?（YouTube）](https://youtu.be/AySPuO7vOvA)
- [ADL 2.3: What does the "Good" Function Mean?（YouTube）](https://youtu.be/OjX-O9uuug8)
- [ADL 2.4: How can we Pick the "Best" Function?（YouTube）](https://youtu.be/Uo3ZavxQyCs)
- [ADL 2.5: Backpropagation（YouTube）](https://youtu.be/BHgssEwMxsY)
- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
