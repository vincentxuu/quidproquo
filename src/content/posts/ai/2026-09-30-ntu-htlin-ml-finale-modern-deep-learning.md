---
title: "Finale：整門課收成三類技巧｜台大林軒田 機器學習技法 第 16 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, deep-learning, optimization, regularization]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 33
tldr: "技法第 16 堂沒有新模型，它把前 15 堂的模型改用三個問題重新分類：特徵藏在哪裡（kernel、aggregation、extraction、低維投影）、誤差怎麼降下來（梯度、等價問題、拆成多步）、模型太強時怎麼踩煞車（正則化、驗證）。本文用八個點把 PCA 加 AdaBoost-Stump 從頭算完，三個問題各對一次答案；最後保留 Fall 2024 校內課補上的 ReLU、Xavier／He 初始化、momentum、RMSProp 與 Adam。"
description: "台大林軒田機器學習技法第 16 堂 Finale 導讀：特徵利用、誤差最佳化、消除過擬合三類技巧的分類表與四題 Fun Time，八個點的 PCA 加 AdaBoost-Stump 完整算例，四屆 KDD Cup 冠軍模型與 ICDM 十大演算法，以及 Fall 2024 補充投影片 302u、303u、mlmai.ics、1126。"
draft: false
glossary:
  - term: "He 初始化"
    aliases: ["He initialization", "Kaiming initialization"]
    definition: "ReLU 網路的權重初始化：零平均、變異數 2/d^(ℓ−1)，讓每層分數的變異數大致維持不變。Xavier 初始化是 tanh 網路的對應版本，變異數取 2/(d^(ℓ−1)+d^(ℓ))。"
    context: "林軒田 Fall 2024 補充投影片 302u 的最後三頁推導。"
    links:
      - label: "302u 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf"
  - term: "Adam"
    aliases: ["Adaptive Moment Estimation"]
    definition: "SGD 的變形：用梯度的指數移動平均當方向（momentum），用梯度平方的移動平均調整每個分量的步長（RMSProp），再加上全域衰減。"
    context: "林軒田 Fall 2024 補充投影片 303u 把它寫成「momentum + RMSProp + global decay」。"
    links:
      - label: "303u 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf"
  - term: "多階段最佳化"
    aliases: ["multi-stage optimization"]
    definition: "把變數分成幾組，先解完一組並固定，再解下一組，不回頭。probabilistic SVM、linear blending、stacking、RBF 網路、深度網路的逐層 pre-training 都是這種做法。"
    context: "技法第 16 堂講義第 9 頁「拆成多步」三種做法中的第一種。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [216_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/21 到 21/21），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 16 堂，也是兩門課 32 堂的最後一堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧：Embedding Numerous Features（kernel 模型）、Combining Predictive Features（aggregation 模型）、Distilling Implicit Features（extraction 模型）。這堂排在第三種底下，接在[技法第 15 堂：矩陣分解](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization)後面，但它不教新模型。課堂上開場的說法是：今天不從模型出發，改看這些模型背後的技巧可以從哪些面向串起來。面向有三個：怎麼利用特徵、怎麼做最佳化、怎麼避免過擬合；最後一支影片再看這些技巧在比賽裡怎麼組合。

先備是技法前 15 堂。每個模型的推導不必都記得，但名字要認得；本文在每張表裡標了該回哪一堂複習。讀完之後，你應該能對任何一個學過的模型回答三個問題（它的特徵從哪裡來、它的誤差怎麼降、它靠什麼不過擬合），並且能把本文那個八個點的例子自己重算一遍。

講義的四節講完之後，本文多留一個段落給 Fall 2024 校內課補充的四份投影片。那些內容不在 MOOC 第 16 堂裡，會另外標明。

## 特徵藏在哪裡：kernel、aggregation、extraction 與低維投影

```youtube
url: https://www.youtube.com/watch?v=WeLobtIDBzI
title: Finale :: Feature Exploitation Techniques @ Machine Learning Techniques (機器學習技法)
```

（影片 00:18–01:42 回顧上一堂並預告這堂的三個面向，01:42–04:20 是 kernel，04:20–09:24 是 aggregation，09:24–12:53 是 extraction，12:53–15:31 是低維投影，之後是 Fun Time。）

課堂上先用一句話回顧上一堂：矩陣分解從電影的角度看是一堆線性模型，作用在萃取出來的使用者特徵上；電影和使用者是對稱的，反過來說也成立。最常用的最佳化方法是隨機梯度下降（SGD）。

要做非線性的事情就需要特徵轉換 $\boldsymbol{\Phi}$。講義第 2 到 5 頁用四張表回答同一個問題：這個 $\boldsymbol{\Phi}$ 藏在哪裡。前三張跟著課程的三個部分走，第四張照課堂上的說法，是各種模型共同用到、卻常被忽略的一種。

### Kernel：把大量特徵埋進內積

講義第 2 頁的標題列寫：numerous features within some $\boldsymbol{\Phi}$，embedded in kernel $K_{\boldsymbol{\Phi}}$ with inner product operation。也就是

$$
K_{\boldsymbol{\Phi}}(\mathbf{x}, \mathbf{x}') = \boldsymbol{\Phi}(\mathbf{x})^\top \boldsymbol{\Phi}(\mathbf{x}')
$$

課堂上的講法是：kernel 把「做特徵轉換」和「在轉換後的空間做內積」兩個動作包成一次運算，特徵的數量可以非常多。投影片用一條橫線把內容分成上下兩半，上半是六種 kernel，下半是用得上 kernel 的模型。

| 講義上的格子 | 講義的說明 | 課堂上補的話 | 複習 |
|---|---|---|---|
| Polynomial Kernel | 'scaled' polynomial transforms | 裡面是多項式轉換，要靠特別的放縮才讓 kernel 好算 | [技法第 3 堂](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm) |
| Gaussian Kernel | infinite-dimensional transforms | 裡面有無限多維的特徵轉換 | 技法第 3 堂 |
| Stump Kernel | decision-stumps as transforms | 作業裡推導過，把很多 decision stump 埋在裡面，文獻上叫 stump kernel | 作業 |
| Sum of Kernels | transform union | 兩個 kernel 相加還是 kernel，意思是把兩種轉換混在一起 | 技法第 3 堂與作業 |
| Product of Kernels | transform combination | 相乘也還是 kernel，各自埋的轉換組合成更複雜的轉換 | 同上 |
| Mercer Kernels | transform implicitly | 滿足 Mercer's condition 的函數裡都埋著某個轉換，即使我們寫不出它的樣子 | 技法第 3 堂 |

橫線以下的模型有五個：SVM（[技法第 1 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)到[第 4 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm)）、SVR 與 kernel ridge regression（[技法第 6 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression)）、kernel logistic regression 與 probabilistic SVM（[技法第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)）。投影片把五個並列，課堂上則把 kernel ridge regression 與 kernel logistic regression 歸在「比較少用」的那一邊。這些模型配上上半部的 kernel，原本的線性模型就能做很複雜的非線性邊界。

頁尾的黃色框寫 possibly Kernel PCA, Kernel k-Means。課堂上的理由是：PCA 與 k-means 的運算裡都只有線性與內積的動作，所以也能換成 kernel 的版本。

**本文補充：相加是聯集、相乘是組合，用數字看一次。** 以下是本文自擬的例子，不在講義上。取兩個很小的轉換 $\boldsymbol{\Phi}_1(\mathbf{x}) = (x_1, x_2)$ 與 $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1)$，兩個點 $\mathbf{x} = (1, 2)$、$\mathbf{x}' = (3, 1)$。

- $K_1 = (1)(3) + (2)(1) = 5$，$K_2 = (1)(1) + (1)(3) = 4$。
- 把兩個轉換接在一起，$\boldsymbol{\Phi}(\mathbf{x}) = (x_1, x_2, 1, x_1)$。$\mathbf{x}$ 變成 $(1, 2, 1, 1)$，$\mathbf{x}'$ 變成 $(3, 1, 1, 3)$，內積是 $3 + 2 + 1 + 3 = 9 = K_1 + K_2$。接在一起就是講義說的 union。
- 把兩個轉換的分量兩兩相乘，$\boldsymbol{\Phi}(\mathbf{x}) = (x_1 \cdot 1,\ x_1 \cdot x_1,\ x_2 \cdot 1,\ x_2 \cdot x_1)$。$\mathbf{x}$ 變成 $(1, 1, 2, 2)$，$\mathbf{x}'$ 變成 $(3, 9, 1, 3)$，內積是 $3 + 9 + 2 + 6 = 20 = K_1 \times K_2$。兩兩相乘就是 combination。

一般的情形只是把這兩行寫成加總。相加：$[\boldsymbol{\Phi}_1; \boldsymbol{\Phi}_2]$ 的內積拆成前半與後半，各自是 $K_1$ 與 $K_2$。相乘：

$$
\sum_{i}\sum_{j} \phi_{1,i}(\mathbf{x})\,\phi_{2,j}(\mathbf{x})\,\phi_{1,i}(\mathbf{x}')\,\phi_{2,j}(\mathbf{x}') = \Big(\sum_i \phi_{1,i}(\mathbf{x})\phi_{1,i}(\mathbf{x}')\Big)\Big(\sum_j \phi_{2,j}(\mathbf{x})\phi_{2,j}(\mathbf{x}')\Big) = K_1 K_2
$$

### Aggregation：把每個 g 當成一個特徵

講義第 3 頁的標題列是 predictive features within some $\boldsymbol{\Phi}$，底下只有一行式子：

$$
\phi_t(\mathbf{x}) = g_t(\mathbf{x})
$$

課堂上的說法是：我們常看到的那些 hypothesis 也可以當成特徵轉換，它們本身就能幫忙預測輸出；把一堆不同的 $g_t$ 當成特徵，可能做出更好的 $G$。投影片分兩層，上層是常拿來當 $g_t$ 的三種基本單元：

| 基本單元 | 講義的說明 | 課堂上補的話 | 複習 |
|---|---|---|---|
| Decision Stump | simplest perceptron; simplest DecTree | 可以看成只有垂直線與水平線的 perceptron，也可以看成只有一個分支的決策樹 | [技法第 8 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting) |
| Decision Tree | branching (divide) + leaves (conquer) | 用 stump 之類的方式把資料切開，切到不能再切，再把一小塊一小塊合起來 | [技法第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt) |
| (Gaussian) RBF | prototype (center) + influence | 靠「跟我相近的代表」以及這個代表的影響力來預測 | [技法第 14 堂](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization) |

下層是把 $g_t$ 合起來的三種方式：

| 合的方式 | 講義列的模型 | 課堂上的說明 | 複習 |
|---|---|---|---|
| Uniform | Bagging; Random Forest | 手上沒有 $g_t$ 時，用 bagging 做出一堆不一樣的 $g_t$ 再平均或投票；配上決策樹就是隨機森林 | [技法第 7 堂](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)、[第 10 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest) |
| Non-Uniform | AdaBoost; GradientBoost | 一步一步找出很不一樣的 $g_t$ 再合起來 | 技法第 8 堂、[第 11 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree) |
| Conditional | Decision Tree; Nearest Neighbor | 用切割找出不同區域裡不同的 $g_t$，有條件地合起來 | 技法第 9 堂、第 14 堂 |

表裡有兩個位置課堂上特別解釋：

- **Nearest Neighbor 為什麼算 conditional。** 是我的鄰居就讓他投票，不是就不讓他投；「是不是鄰居」就是條件，每一票代表一個常數的 $g$。課堂上說，這個模型雖然是在課程後面另一個地方講到的，回頭看它做的事跟決策樹很像。
- **probabilistic SVM 為什麼出現在這頁。** 投影片把它單獨放在 Non-Uniform 那一欄的下面。技法第 5 堂的做法是先解出一個 SVM，再把 SVM 的分數乘上一個係數 $A$、加上平移 $B$，讓輸出貼近機率。課堂上的解讀是：這等於把 SVM 的結果和一個常數模型（代表平移）做線性融合，第二階段的學習跟 blending 裡「已經有一堆 $g_t$，再學一個線性模型把它們變成 $G$」是同一件事。

頁尾寫 possibly Infinite Ensemble Learning, Decision Tree SVM。課堂上各用一句話說明它們怎麼來的：要合無限多個 $g_t$，看起來做不到，但把無限多個 decision stump 放進 kernel（談 kernel 時提到的 stump kernel），SVM 解出來的東西裡面就像有無限多個 stump 合在一起；決策樹分支時用的是很簡單的 stump，換成 SVM 來切，搞不好也可以。課堂上說講這麼多是希望大家體會模型之間都有關聯，融會貫通之後常常可以變出很不一樣的模型。

### Extraction：把特徵當成要學的變數

講義第 4 頁的標題列是 hidden features within some $\boldsymbol{\Phi}$：as hidden variables to be 'jointly' optimized with usual weights，possibly with the help of unsupervised learning。課堂上的講法是：寫下模型的時候，不要把特徵轉換想成已經給定，或已經埋在某個 kernel 裡；把它想成變數，跟線性模型裡的權重一樣要做最佳化，然後兩者一起解。

| 模型 | 被萃取出來的東西（講義） | 複習 |
|---|---|---|
| Neural Network; Deep Learning | neuron weights | [技法第 12 堂](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)、[第 13 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning) |
| RBF Network | RBF centers | 技法第 14 堂 |
| Matrix Factorization | user/movie factors | 技法第 15 堂 |
| AdaBoost; GradientBoost | $g_t$ parameters | 技法第 8 堂、第 11 堂 |
| k-Means | cluster centers | 技法第 14 堂 |
| Autoencoder; PCA | 'basis' directions | 技法第 13 堂 |

上面三列是監督式的模型，下面三列裡 k-means、autoencoder 與 PCA 是標題列說的「非監督式的幫手」。課堂上的配對是：RBF 網路常用 k-means 找群中心；神經網路常用 autoencoder 或 PCA 幫忙，它們萃取出來的是好的投影方向、好的基底方向，而且跟矩陣分解很有關係。

AdaBoost 與 GradientBoost 在上一張表才出現過，這裡又出現一次。課堂上的解釋是：boosting 每一輪找一個 $g_t$、給它一個線性的權重，所以也可以把這些 $g_t$ 想成隱藏的特徵，每一輪在做的是把 $g_t$ 的參數找出來（例如 decision stump 切在哪裡）。同一個模型可以放進不只一張表，這四張表是四種看法，彼此不互斥。

頁尾寫 possibly GradientBoosted Neurons, NNet on Factorized Features。課堂上的說明：做神經網路時，可以用 gradient boosting 把神經元一個一個找出來；矩陣分解萃取出特徵之後，不一定要用原來的向量內積做預測，可以把特徵再餵進神經網路。

### 低維投影：最容易被忽略的一張表

講義第 5 頁的標題列是 low-dimensional features within some $\boldsymbol{\Phi}$：compressed from original features。課堂上說前三頁大致跟著課程的流程走，這一頁是另外補的：資料原本的維度比較高時，我們常設法把它轉成低維度的資料，在低維度上操作，手段是壓縮或投影。

| 模型 | 講義的說明 | 課堂上補的話 |
|---|---|---|
| Decision Stump; DecTree Branching | 'best' naïve projection to $\mathbb{R}$ | stump 是非常低維度的投影；決策樹每次分支都是在某個很低維的投影上做決定 |
| Random Forest Tree Branching | 'random' low-dim. projection | 隨機森林常先把原來的特徵做低維度的隨機投影，再在上面切 stump，讓長出來的樹更不一樣 |
| Autoencoder; PCA | info.-preserving compression | 找出最能保存資料特性的投影方向 |
| Matrix Factorization | projection from abstract to concrete | 把使用者那個只有一個 1、維度非常高的抽象向量，投影到比較具體的向量上 |
| Feature Selection | 'most-helpful' low-dimensional projection | 在原來的特徵裡找出幾個有用的維度，這也是從高維到低維的轉換；講隨機森林時講過 |

頁尾寫 possibly other 'dimension reduction' models。課堂上的評語是降維在實務上非常有用，之後看新模型時可以多問一句：它裡面用了什麼降維方式，還有哪些降維方式可以搭配。

### Fun Time：PCA 之後跑 AdaBoost-Stump，得到什麼

**題目（第 6 頁）：** 在 PCA 前處理過的資料上跑 AdaBoost-Stump。用原始特徵 $\mathbf{x}$ 來看，最後的 hypothesis $G(\mathbf{x})$ 長什麼樣子？

1. 隱藏層神經元用 $\tanh(\cdot)$ 的神經網路
2. 隱藏層神經元用 $\text{sign}(\cdot)$ 的神經網路
3. 一棵決策樹
4. 一個隨機森林

**答案：2。** 講義的解答是：PCA 是對 $\mathbf{x}$ 做線性轉換，在轉換後的資料上切 decision stump，就像在原始資料上用了一個 perceptron，所以 $G$ 是 perceptron 的線性組合。講義只有這幾句話，下面的式子與各選項的說明是本文補充。技法第 13 堂的 PCA 回傳 $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{W}(\mathbf{x} - \bar{\mathbf{x}})$，第 $i$ 個新特徵是 $z_i = \mathbf{w}_i^\top(\mathbf{x} - \bar{\mathbf{x}})$。在 $z_i$ 上的 stump 是

$$
g_t(\mathbf{x}) = s_t \cdot \text{sign}(z_{i_t} - \theta_t) = \text{sign}\Big( (s_t\mathbf{w}_{i_t})^\top \mathbf{x} - s_t\big(\theta_t + \mathbf{w}_{i_t}^\top\bar{\mathbf{x}}\big) \Big)
$$

第二個等號用到 $s_t = \pm 1$ 可以搬進 sign 裡面。括號裡是 $\mathbf{x}$ 的一次式，這就是一個 perceptron：權重是 $s_t\mathbf{w}_{i_t}$，門檻那一項是 $-s_t(\theta_t + \mathbf{w}_{i_t}^\top\bar{\mathbf{x}})$。AdaBoost 最後回傳

$$
G(\mathbf{x}) = \text{sign}\Big( \sum_{t=1}^{T} \alpha_t\, g_t(\mathbf{x}) \Big)
$$

外層是一個線性組合再取 sign，內層是 $T$ 個取 sign 的 perceptron。對照技法第 12 堂的神經網路，這是一個輸入層、一層 $T$ 個隱藏神經元、一個輸出的網路，隱藏層的轉換函數是 sign，輸出層的權重是 $\alpha_t$。

其他選項錯在哪：

- 選項 1：stump 的輸出只有 $\pm 1$，是硬的 sign，不是平滑的 tanh。
- 選項 3：決策樹是有條件的組合，一個點只走一條路徑、只由一片葉子決定；這裡每個點都要把 $T$ 個 $g_t$ 全部算完再加權相加。
- 選項 4：隨機森林是 bagging 出來的樹做均勻投票；這裡的 $g_t$ 是 stump，票數 $\alpha_t$ 也不均勻。

課堂上對答案的講法比講義保守一點：一堆 perceptron 線性地 aggregate 起來，跟一個神經網路是類似的。

本文補充：這個網路跟一般訓練出來的神經網路有兩個差別。隱藏神經元的方向只能是 PCA 的那幾個方向 $\pm\mathbf{w}_i$，不是任意方向；權重也不是用 backprop 一起調的，而是 PCA 先定方向，AdaBoost 再一輪一個地決定門檻與 $\alpha_t$。這兩點在後面談最佳化時會再用到。

### 把 Fun Time 算一遍：八個點的例子

以下是本文自擬的例子，不在講義上。用到的工具只有技法第 13 堂的 PCA 與第 8 堂的 AdaBoost-Stump。

**資料。** 八個二維的點：

| $n$ | $\mathbf{x}_n$ | $y_n$ | $\mathbf{x}_n - \bar{\mathbf{x}}$ | $p_n$ | $q_n$ |
|---|---|---|---|---|---|
| 1 | $(3, 1)$ | $-1$ | $(-1, -3)$ | $-4$ | $2$ |
| 2 | $(1, 3)$ | $-1$ | $(-3, -1)$ | $-4$ | $-2$ |
| 3 | $(3, 3)$ | $+1$ | $(-1, -1)$ | $-2$ | $0$ |
| 4 | $(6, 2)$ | $+1$ | $(2, -2)$ | $0$ | $4$ |
| 5 | $(2, 6)$ | $+1$ | $(-2, 2)$ | $0$ | $-4$ |
| 6 | $(5, 5)$ | $+1$ | $(1, 1)$ | $2$ | $0$ |
| 7 | $(7, 5)$ | $-1$ | $(3, 1)$ | $4$ | $2$ |
| 8 | $(5, 7)$ | $+1$ | $(1, 3)$ | $4$ | $-2$ |

最後兩欄 $p_n$、$q_n$ 是下一步 PCA 算出來的，先留著位置。

**第一步：PCA。** 照技法第 13 堂的三個步驟。平均是 $\bar{\mathbf{x}} = (32/8,\ 32/8) = (4, 4)$，減掉之後是表中第四欄。接著算 $\mathrm{X}^\top\mathrm{X}$，$\mathrm{X}$ 的每一列是一個減過平均的點：

$$
\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 1+9+1+4+4+1+9+1 & 3+3+1-4-4+1+3+3 \\ 3+3+1-4-4+1+3+3 & 9+1+1+4+4+1+1+9 \end{bmatrix} = \begin{bmatrix} 30 & 6 \\ 6 & 30 \end{bmatrix}
$$

特徵值滿足 $(30 - \lambda)^2 - 36 = 0$，得 $\lambda = 36$ 與 $\lambda = 24$。$\lambda = 36$ 的特徵向量解 $-6v_1 + 6v_2 = 0$，是 $\mathbf{w}_1 = \frac{1}{\sqrt{2}}(1, 1)$；$\lambda = 24$ 的是 $\mathbf{w}_2 = \frac{1}{\sqrt{2}}(1, -1)$。這裡兩個方向都留下來，PCA 只是把座標軸轉 45 度：

$$
z_1 = \mathbf{w}_1^\top(\mathbf{x} - \bar{\mathbf{x}}) = \frac{x_1 + x_2 - 8}{\sqrt{2}}, \qquad z_2 = \mathbf{w}_2^\top(\mathbf{x} - \bar{\mathbf{x}}) = \frac{x_1 - x_2}{\sqrt{2}}
$$

為了不必一直寫 $\sqrt{2}$，令 $p = \sqrt{2}\,z_1 = x_1 + x_2 - 8$、$q = \sqrt{2}\,z_2 = x_1 - x_2$，就是表中最後兩欄。在 $z_1$ 上切在 $\theta$ 的 stump，等於在 $p$ 上切在 $\sqrt{2}\,\theta$。

**第二步：AdaBoost-Stump 跑三輪。** 照技法第 8 堂：每一輪在所有的 stump 裡挑加權錯誤率 $\epsilon_t$ 最低的，令 $\blacklozenge_t = \sqrt{(1 - \epsilon_t)/\epsilon_t}$，$\alpha_t = \ln \blacklozenge_t$；分錯的點權重乘上 $\blacklozenge_t$，分對的除以 $\blacklozenge_t$。stump 的門檻取相鄰兩個值的中點：$p$ 上可以切在 $-3$、$-1$、$1$、$3$，$q$ 上可以切在 $-3$、$-1$、$1$、$3$，另外各有一個「全部判同一邊」的常數 stump。權重只有比例有意義，下面寫的是除以總和之後的比例，比較好算。

第 1 輪，每個點的權重都是 $\frac{1}{8}$。

- 最好的 stump：$g_1 = \text{sign}(p + 3)$，$p > -3$ 判正。只有第 7 點（$p = 4$、$y = -1$）被分錯。
- $\epsilon_1 = \frac{1}{8}$，$\blacklozenge_1 = \sqrt{7} \approx 2.646$，$\alpha_1 = \ln\sqrt{7} \approx 0.973$。
- 新的權重比例：第 7 點 $\frac{1}{8}\sqrt{7}$，其餘 $\frac{1}{8}/\sqrt{7}$，比是 $7 : 1$。正規化後第 7 點是 $\frac{7}{14} = \frac{1}{2}$，其餘七個點各 $\frac{1}{14}$。分錯的點合起來剛好占一半，這是技法第 8 堂「讓 $g_t$ 在新權重下看起來像亂猜」的結果。

第 2 輪。

- 最好的 stump：$g_2 = -\text{sign}(q - 1)$，$q < 1$ 判正。第 7 點（$q = 2$）這次判對了。分錯的是第 2 點（$q = -2$、$y = -1$）與第 4 點（$q = 4$、$y = +1$）。
- $\epsilon_2 = \frac{1}{14} + \frac{1}{14} = \frac{1}{7}$，$\blacklozenge_2 = \sqrt{6} \approx 2.449$，$\alpha_2 = \ln\sqrt{6} \approx 0.896$。
- 新的權重比例：第 2、4 點各 $\frac{1}{4}$（兩個合起來一半），第 7 點 $\frac{1}{2} \times \frac{7}{12} = \frac{7}{24}$，其餘五個點各 $\frac{1}{14} \times \frac{7}{12} = \frac{1}{24}$。其中 $\frac{7}{12}$ 是把分對的總權重 $\frac{6}{7}$ 縮成 $\frac{1}{2}$ 的倍數。

第 3 輪。

- 最好的 stump：$g_3 = \text{sign}(q - 3)$，$q > 3$ 判正。只有第 4 點判正，第 2、7 點都判對。分錯的是第 3、5、6、8 點，四個都是權重最小的 $\frac{1}{24}$。
- $\epsilon_3 = \frac{4}{24} = \frac{1}{6}$，$\blacklozenge_3 = \sqrt{5} \approx 2.236$，$\alpha_3 = \ln\sqrt{5} \approx 0.805$。

三輪的次佳 stump 錯誤率分別是 $\frac{1}{4}$、$\frac{3}{14}$、$\frac{7}{24}$，都比選中的高，所以每一輪的選擇沒有平手的問題。

**第三步：換回原始座標。** 把 $p = x_1 + x_2 - 8$、$q = x_1 - x_2$ 代回去：

$$
g_1(\mathbf{x}) = \text{sign}(x_1 + x_2 - 5), \qquad g_2(\mathbf{x}) = \text{sign}(-x_1 + x_2 + 1), \qquad g_3(\mathbf{x}) = \text{sign}(x_1 - x_2 - 3)
$$

$$
G(\mathbf{x}) = \text{sign}\big( 0.973\, g_1(\mathbf{x}) + 0.896\, g_2(\mathbf{x}) + 0.805\, g_3(\mathbf{x}) \big)
$$

三個 $g_t$ 都是斜的直線，沒有一條是水平或垂直的。$G$ 是一個 2–3–1 的神經網路：隱藏層三個 sign 神經元，權重分別是 $(1, 1)$、$(-1, 1)$、$(1, -1)$（方向就是 $\pm\mathbf{w}_1$、$\pm\mathbf{w}_2$ 乘上 $\sqrt{2}$，sign 不受正的倍數影響），輸出層的權重是 $(0.973, 0.896, 0.805)$。Fun Time 的答案在這裡看得到實物。

**第四步：檢查。**

| $n$ | $y_n$ | $g_1$ | $g_2$ | $g_3$ | $\sum_t \alpha_t g_t$ | $G$ |
|---|---|---|---|---|---|---|
| 1 | $-1$ | $-$ | $-$ | $-$ | $-2.674$ | $-1$ |
| 2 | $-1$ | $-$ | $+$ | $-$ | $-0.882$ | $-1$ |
| 3 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |
| 4 | $+1$ | $+$ | $-$ | $+$ | $0.882$ | $+1$ |
| 5 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |
| 6 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |
| 7 | $-1$ | $+$ | $-$ | $-$ | $-0.728$ | $-1$ |
| 8 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |

八個點全部分對。只用 $g_1$ 時 $E_{\text{in}} = \frac{1}{8}$；加上 $g_2$ 之後第 7 點的分數是 $0.973 - 0.896 = 0.077$，仍然是正的，$E_{\text{in}}$ 還是 $\frac{1}{8}$；第三輪才降到 0。拿一個沒看過的點試試：$\mathbf{x} = (8, 4)$，三個神經元的輸出是 $(+, -, +)$，分數是 $0.973 - 0.896 + 0.805 = 0.882$，判成 $+1$。

**這個結果代表什麼。** 同一組數字可以放進這一節的四張表：

- **Aggregation**：表中 $g_1$、$g_2$、$g_3$ 三欄就是每個點的新特徵 $\boldsymbol{\Phi}(\mathbf{x}_n) = (g_1, g_2, g_3)$，$G$ 是在這三個特徵上、權重為 $\alpha_t$ 的線性分類器。這正是講義那一行 $\phi_t(\mathbf{x}) = g_t(\mathbf{x})$。
- **Extraction**：三條線切在哪裡（$-5$、$+1$、$-3$）沒有人事先給，是三輪一個一個找出來的參數，也就是講義表上寫的 $g_t$ parameters。
- **低維投影**：每個 stump 只看 $p$ 或 $q$ 其中一個數，是投影到 $\mathbb{R}$。
- **壓縮的代價**：如果 PCA 只留第一個方向（$\tilde{d} = 1$），每個點只剩 $p$。第 7、8 兩點的 $p$ 都是 4，標籤卻相反，任何只看 $p$ 的分類器至少錯一個，$E_{\text{in}}$ 降不到 $\frac{1}{8}$ 以下。本文實際讓 AdaBoost 在只有 $p$ 的資料上多跑幾輪，$E_{\text{in}}$ 一直停在 $\frac{1}{8}$。PCA 保留的是資料散得最開的方向，它不看標籤，丟掉的方向可能剛好是分類需要的。

PCA 在這個例子裡的用處也看得到：不做 PCA、直接在 $x_1$、$x_2$ 上切 stump，最好的單一 stump 要錯兩個點（$\epsilon = \frac{1}{4}$），轉 45 度之後最好的只錯一個。

## 誤差怎麼降下來：梯度、等價問題、拆成多步

```youtube
url: https://www.youtube.com/watch?v=En-EyzFipaw
title: Finale :: Error Optimization Techniques @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:31 是梯度下降一家，02:31–04:47 是換成等價的問題，04:47–08:07 是拆成多步，之後是 Fun Time。）

知道特徵從哪裡來之後，還要把模型裡的變數解出來。講義第 7 到 9 頁把課程用過的最佳化做法分成三種。

### 梯度下降一家：有梯度就走一小步

講義第 7 頁的標題列：when $\nabla E$ 'approximately' defined, use it for 1st order approximation：

$$
\text{new variables} = \text{old variables} - \eta\,\nabla E
$$

這條式子怎麼來的，[基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)推過一次，這裡重走一遍。往單位方向 $\mathbf{v}$ 走一小步 $\eta$，用一階泰勒展開：

$$
E(\mathbf{w} + \eta\mathbf{v}) \approx E(\mathbf{w}) + \eta\,\mathbf{v}^\top\nabla E(\mathbf{w})
$$

要讓右邊最小，就要讓內積 $\mathbf{v}^\top\nabla E(\mathbf{w})$ 最小。兩個向量的內積在方向相反時最小，所以 $\mathbf{v} = -\nabla E(\mathbf{w})/\lVert\nabla E(\mathbf{w})\rVert$，把長度併進 $\eta$ 就是上面那一行。課堂上的說法是：只要有梯度的方向，或者大概算得出某個梯度的方向，就把它當成誤差函數的一次逼近，結論是往負梯度的方向走一小步。標題列的 'approximately' 就是指「大概算得出」。

投影片分三欄：

| 做法 | 講義列的模型 | 課堂上的說明 |
|---|---|---|
| SGD／Minibatch／GD | (Kernel) LogReg; Neural Network [backprop]; Matrix Factorization; Linear SVM (maybe) | SGD 是隨機抽一個點、照那個點的錯誤方向走；minibatch 是隨機抽一把點、照那一把點合起來的方向走 |
| Steepest Descent | AdaBoost; GradientBoost | 不只在那個方向上走一小步，而是走一大步，看那一步怎樣把在意的誤差降到最低 |
| Functional GD | AdaBoost; GradientBoost | 走的方向是一個函數，不是一個向量 |

第一欄有兩個標註。Neural Network 後面的 [backprop] 是配合的技巧：課堂上說它幫忙快速算出梯度。Linear SVM 後面的 (maybe) 講義沒有解釋，課堂上的說明是：這門課沒有時間講，但實際上很多線性 SVM 的解法是用 SGD 設計的。

AdaBoost 與 GradientBoost 同時出現在後兩欄，因為它們兩件事都做：方向是函數，步長是最佳的。

本文補充：「方向是一個函數」可以用八個點的例子看。這時被更新的變數不是權重向量，而是八個點各自的分數 $s_n = \sum_\tau \alpha_\tau g_\tau(\mathbf{x}_n)$。加進一個新的 $g_t$、走 $\eta$ 這麼遠，每個點的分數就變成 $s_n + \eta\,g_t(\mathbf{x}_n)$；$g_t$ 在八個點上的輸出 $(\pm 1, \ldots, \pm 1)$ 扮演的角色，就是一般梯度下降裡的方向向量 $\mathbf{v}$。技法第 11 堂推過，讓指數誤差降最快的方向，正好是加權錯誤率 $\epsilon_t$ 最低的那個 $g_t$，所以 AdaBoost 每一輪「挑最好的 stump」就是在找方向。

方向定了，再用同一個例子把「最佳的步長」算一次。技法第 11 堂把 AdaBoost 看成在最小化指數誤差；方向 $g_t$ 定了之後，步長 $\eta$ 要最小化

$$
\widehat{E}_{\text{ADA}}(\eta) = \sum_{n=1}^{N} u_n^{(t)} \exp\big(-\eta\, y_n g_t(\mathbf{x}_n)\big)
$$

分對的點 $y_n g_t(\mathbf{x}_n) = +1$，分錯的點是 $-1$。用正規化的權重，分對的合計 $1 - \epsilon_t$，分錯的合計 $\epsilon_t$：

$$
\widehat{E}_{\text{ADA}}(\eta) = (1 - \epsilon_t)\,e^{-\eta} + \epsilon_t\,e^{\eta}
$$

對 $\eta$ 微分等於 0：$-(1 - \epsilon_t)e^{-\eta} + \epsilon_t e^{\eta} = 0$，移項得 $e^{2\eta} = (1 - \epsilon_t)/\epsilon_t$，所以

$$
\eta_t = \ln\sqrt{\frac{1 - \epsilon_t}{\epsilon_t}} = \alpha_t
$$

最佳的步長剛好就是 AdaBoost 的票數。代回去，最小值是 $2\sqrt{\epsilon_t(1 - \epsilon_t)}$。例子的第 1 輪 $\epsilon_1 = \frac{1}{8}$：

| 步長 $\eta$ | $\frac{7}{8}e^{-\eta} + \frac{1}{8}e^{\eta}$ |
|---|---|
| $0$（不走） | $1$ |
| $0.1$（固定的一小步） | $0.930$ |
| $\ln\sqrt{7} \approx 0.973$（最佳） | $\frac{\sqrt{7}}{4} \approx 0.661$ |

同樣一個方向，走一小步只把指數誤差降 7%，走到最佳步長降 34%。三輪下來，指數誤差的總和依序是 $1 \to 0.661 \to 0.463 \to 0.345$，每一輪乘上 $2\sqrt{\epsilon_t(1 - \epsilon_t)}$（分別是 $0.661$、$0.700$、$0.745$）。指數誤差是 0/1 誤差的上界，上界一路往下壓，$E_{\text{in}}$ 也就跟著降到 0。

頁尾寫 possibly 2nd order techniques, GD under constraints。課堂上的說明：梯度下降是一次逼近，改用二次逼近會得到牛頓法之類的方法；梯度下降原本是為沒有限制式的情況設計的，有限制式時要做一些變化。很多更進階的方法，就是把學過的模型搭配上不同的最佳化方式。

### 換成等價的問題：原問題不會解，就找一個會解的

講義第 8 頁：when difficult to solve original problem, seek for equivalent solution。課堂上說技法課慢慢出現一些乍看不知道怎麼下手的最佳化問題，常常要靠數學推導把它變形成會解的問題。

| 模型 | 講義寫的等價關係 | 做了什麼（本文整理） | 複習 |
|---|---|---|---|
| Dual SVM | equivalence via convex QP | 原始問題的變數個數綁在特徵維度上；換成對偶問題，變數只剩 $N$ 個，才接得上 kernel | [技法第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm) |
| Kernel LogReg; Kernel RidgeReg | equivalence via representer | representer theorem 保證最佳的 $\mathbf{w}$ 可以寫成 $\sum_n \beta_n \mathbf{z}_n$，把它代進去，變數從 $\mathbf{w}$ 換成 $\boldsymbol{\beta}$，式子裡只剩 kernel | 技法第 5 堂、第 6 堂 |
| PCA | equivalence to eigenproblem | 看起來很複雜的最佳化問題，最後只要解特徵值問題 | 技法第 13 堂 |

PCA 那一列可以用例子驗證。只找一個方向時，線性 autoencoder 要最大化投影後的平方和，限制 $\mathbf{w}$ 是單位向量：

$$
\max_{\mathbf{w}} \ \sum_{n=1}^{N} \big(\mathbf{w}^\top\mathbf{x}_n\big)^2 = \mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\,\mathbf{w} \qquad \text{subject to} \quad \mathbf{w}^\top\mathbf{w} = 1
$$

（$\mathbf{x}_n$ 已經減過平均。）本文補充一個短的推導：用拉格朗日乘數 $\lambda$ 處理限制式，對 $\mathbf{w}$ 微分得 $\mathrm{X}^\top\mathrm{X}\mathbf{w} = \lambda\mathbf{w}$，所以最佳解一定是特徵向量；這時目標函數的值是 $\mathbf{w}^\top(\lambda\mathbf{w}) = \lambda$，要最大就挑特徵值最大的那一個。

例子裡 $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 30 & 6 \\ 6 & 30 \end{bmatrix}$。不靠特徵值，直接把原問題解一次：二維的單位向量寫成 $\mathbf{w} = (\cos\theta, \sin\theta)$，

$$
\mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\,\mathbf{w} = 30\cos^2\theta + 12\cos\theta\sin\theta + 30\sin^2\theta = 30 + 6\sin 2\theta
$$

$\sin 2\theta$ 最大是 1，發生在 $\theta = 45°$，這時值是 36、方向是 $\frac{1}{\sqrt{2}}(1, 1)$。跟前面解特徵值問題得到的 $\lambda = 36$、$\mathbf{w}_1$ 完全一樣；最小值 24 發生在 $\theta = 135°$，對應另一個特徵值與 $\mathbf{w}_2$ 的方向。二維還能這樣直接解，維度一高就寫不出這種式子，特徵值問題則有現成的解法可用，這就是「等價」帶來的好處。

課堂上對這一類做法的提醒是：問題的轉化常牽涉比較深的數學，想更了解機器學習模型的話，線性代數與最佳化文獻裡的相關數學可以多讀一些。頁尾的 some other boosting models and modern solvers of kernel models rely on such a technique heavily，課堂上的說明是：有些課堂上沒講的 boosting 模型是照這種方式設計的，kernel 模型的一些解法也大量用到「能不能轉成等同但比較好解的形式」。

### 拆成比較容易的子問題

講義第 9 頁：when difficult to solve original problem, seek for 'easier' sub-problems。三欄是三種拆法。

**Multi-Stage（多階段）。** 變數分成幾組，解完一組就固定，再解下一組。課堂上逐個說明講義列的五個模型：

- probabilistic SVM：kernel logistic regression 很難解，所以先解 SVM，把 SVM 固定之後再做第二階段的微調。
- linear blending 與 stacking：第一階段得到 $g_t$，第二階段得到 $G$。
- RBF Network：第一階段先找中心，第二階段再把它們合起來。
- DeepNet pre-training：先做一層的 pre-training 並固定，再做下一層。

**Alternating Optim.（交替最佳化）。** 兩組變數放在一起不會解時，先解一組、固定另一組，再反過來，交替做到滿意為止。講義列 k-Means（技法第 14 堂）與 alternating LeastSqr（技法第 15 堂矩陣分解的交替最小平方法）。它跟多階段的差別在於會回頭：多階段每一組只解一次，交替最佳化來回好幾趟。

講義在這一欄最後加了一個括號裡的 (steepest descent)。課堂上的解釋是：steepest descent 先找一個方向，再想辦法走最大的一步，然後找下一個方向、再走最大的一步；裡面有方向的最佳化與步伐的最佳化兩個動作，所以可以看成交替最佳化的一個延伸的例子。八個點的例子就是這樣：每一輪先選 $g_t$（方向），再算 $\alpha_t$（步伐）。

**Divide & Conquer（分而治之）。** 講義只列 decision tree。課堂上的說法是：要找出全域最好的決策樹很困難，所以先切開，兩邊各自找決策樹再合起來；資料切得夠小、夠純的時候，回傳一個常數就可以。

頁尾寫 useful for complicated models。課堂上說大家未來會接觸愈來愈複雜的模型，那些模型裡很多時候要靠對最佳化的了解，才真的找得出好的參數。

### Fun Time：在 PCA 過的資料上跑 DeepNet

**題目（第 10 頁）：** 把 Lecture 213（講義的編號，就是技法第 13 堂）介紹的 DeepNet 演算法用在 PCA 前處理過的資料上，用到了哪種最佳化技巧？

1. 梯度下降的變形
2. 找等價的解
3. 多階段最佳化
4. 以上皆是

**答案：4。** 講義的解答一行對一個：訓練用 minibatch GD；PCA 用特徵值問題這個等價解；pre-training 是多階段。以下逐項的說明是本文補充：

- 選項 1：技法第 13 堂的 DeepNet 在 pre-training 之後還要用 backprop 微調整個網路，那是梯度下降一家。
- 選項 2：資料先經過 PCA，PCA 的解法就是「換成等價的問題」裡的那個特徵值問題。
- 選項 3：pre-training 一層一層做，做完一層就固定，是多階段。再往外看一層，「先 PCA、再 pre-training、最後微調」這個流程本身也是多階段。

三項都成立，所以單選 1、2、3 都不完整。課堂上講答案時用詞比較鬆：訓練時可能用到梯度下降，做 PCA 時可能用到解特徵值的問題，pre-training 時用到很多層的最佳化。

本文補充：八個點的例子也是三種都用到。PCA 是等價解，AdaBoost 是函數版的梯度下降加上最佳步長，「PCA 先做完並固定，再跑 AdaBoost」是多階段。跟一般神經網路比，同樣是 2–3–1 的網路，backprop 是把所有權重一起用梯度調，這裡是拆成三個階段、每個階段各用自己會解的方法。

## 模型太強時怎麼辦：煞車與儀表板

```youtube
url: https://www.youtube.com/watch?v=b6t22jVVC0s
title: Finale :: Overfitting Elimination Techniques @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–04:57 是正則化，04:57–06:21 是驗證，之後是 Fun Time。）

課堂上這一節的開場是：有很多特徵、又會做最佳化，乍看之下就能解出 $E_{\text{in}}$ 很小的 $g$；但 $E_{\text{in}}$ 小不是最重要的，這些 $g$ 常常會過擬合，所以要想辦法踩煞車，而且模型愈複雜，煞車愈重要。

### 正則化：八種煞車

講義第 11 頁的標題列：when model too 'powerful': add brakes somewhere。底下八個格子：

| 煞車 | 講義列的模型 | 課堂上的說明 | 複習 |
|---|---|---|---|
| large-margin | SVM; AdaBoost (indirectly) | SVM 推導了很多 large margin 的概念；AdaBoost 最佳化的東西跟 margin 也有關係，間接達到胖邊界的效果 | 技法第 1 堂、第 11 堂 |
| L2 | SVR; kernel models; NNet [weight-decay] | 用 representer theorem 推出來的 kernel 方法裡都有 L2 正則化；SVR 的 $\mathbf{w}$ 長度平方那一項也是 | 技法第 5、6、12 堂 |
| voting/averaging | uniform blending; Bagging; Random Forest | 多數人說對，就能修正少數人做得不夠好的地方，模型不會對少數人那麼敏感 | 技法第 7 堂、第 10 堂 |
| denoising | autoencoder | 要抗雜訊，就把雜訊餵進去 | 技法第 13 堂 |
| weight-elimination | NNet | 不只做 L2，還想辦法讓權重變少 | 技法第 12 堂 |
| constraining | autoenc. [weights]; RBF [# centers] | 設定模型時就先減少參數量或加上條件：autoencoder 要求編碼與解碼的權重相同，RBF 網路限制中心的個數 | 技法第 13 堂、第 14 堂 |
| pruning | decision tree | 砍樹：讓模型的複雜度不要那麼高 | 技法第 9 堂 |
| early stopping | NNet (any GD-like) | 提早停下來，用到的模型複雜度就少一些；任何梯度系列的方法都可以套 | 技法第 12 堂 |

課堂上對 denoising autoencoder 用了一個比喻：就像打疫苗，先把活性比較弱的病毒注射到體內，產生抗體之後，真正的病毒來了就不怕。

頁尾寫 arguably most important techniques。課堂上把這句話講得更白：前面談怎麼用特徵、怎麼最佳化，篇幅比較多，但最重要的其實是煞車，不是油門。開車時油門讓你開得愉快，緊急的時候保命的是煞車。

表裡有兩種煞車可以用很少的算術看出它為什麼有效。

**weight decay 就是 L2。** [基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的 $E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$，對它做一步梯度下降：

$$
\mathbf{w} \leftarrow \mathbf{w} - \eta\Big(\nabla E_{\text{in}}(\mathbf{w}) + \frac{2\lambda}{N}\mathbf{w}\Big) = \Big(1 - \frac{2\eta\lambda}{N}\Big)\mathbf{w} - \eta\,\nabla E_{\text{in}}(\mathbf{w})
$$

每一步先把舊的權重乘上一個略小於 1 的數，再照原本的梯度走。例如 $\eta = 0.1$、$\lambda/N = 0.05$ 時倍數是 $0.99$。課堂上的講法是：做梯度下降時每次把權重縮一點點，做的事就是 L2 正則化。

**投票平均為什麼有煞車的效果。** 技法第 7 堂在講 uniform blending 時推過一條恆等式。固定一個點 $\mathbf{x}$，$G$ 是 $T$ 個 $g_t$ 的平均，$f$ 是目標值，則

$$
\underset{t}{\text{avg}}\,\big(g_t - f\big)^2 = \underset{t}{\text{avg}}\,\big(g_t - G\big)^2 + \big(G - f\big)^2
$$

推導只有一步：把 $g_t - f$ 拆成 $(g_t - G) + (G - f)$ 再平方，交叉項是 $2(G - f)\cdot\text{avg}(g_t - G)$，而 $\text{avg}(g_t - G) = G - G = 0$，交叉項消失。以下數字是本文自擬的：某個點的 $f = 1$，三個 $g_t$ 分別預測 $0.4$、$1.3$、$1.6$。

- $G = (0.4 + 1.3 + 1.6)/3 = 1.1$。
- 左邊：$(0.36 + 0.09 + 0.36)/3 = 0.27$，這是三個 $g_t$ 的平均誤差。
- 右邊第一項：$(0.49 + 0.04 + 0.25)/3 = 0.26$，這是三個 $g_t$ 彼此意見分歧的程度。
- 右邊第二項：$(1.1 - 1)^2 = 0.01$，這是 $G$ 的誤差。
- $0.26 + 0.01 = 0.27$，等式成立。

三個各自都不準的 $g_t$（平均誤差 $0.27$），平均之後誤差只剩 $0.01$；被消掉的 $0.26$ 就是它們之間的分歧。$g_t$ 之間差異愈大，平均能消掉的愈多，這是隨機森林拚命讓每棵樹不一樣的理由。

### 驗證：開車要看儀表板

講義第 12 頁的標題列：when model too 'powerful': check performance carefully and honestly。課堂上延續開車的比喻：正則化是煞車，驗證是儀表板，讓你檢查現在的表現到底怎樣。[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)講的是一般的驗證，技法另外介紹了三種：

| 做法 | 講義列的模型 | 課堂上的說明 | 複習 |
|---|---|---|---|
| # SV | SVM/SVR | 支援向量的個數大概告訴你模型用了多少複雜度，可以拿來當檢查的機制 | 技法第 4 堂 |
| OOB | Random Forest | bagging 的抽樣自然會留下一些沒抽到的點，可以拿來做類似驗證的事 | 技法第 10 堂 |
| Internal Validation | blending; DecTree pruning | 驗證不只用來看最後的表現，做 blending、砍樹這些內部操作時，也常用驗證資料做更明智的決定 | 技法第 7 堂、第 9 堂 |

本文補充兩個數字，讓前兩列具體一點。技法第 4 堂的結論是 SVM 的 leave-one-out 交叉驗證誤差不超過支援向量的比例 $\#\text{SV}/N$；以技法第 2 堂 Fun Time 的數字為例，$5566$ 筆資料、$1126$ 個支援向量，上界是 $1126/5566 \approx 0.202$。技法第 10 堂算過，$N$ 很大時一個點在某一輪 bagging 裡完全沒被抽到的機率是 $(1 - 1/N)^N \approx 1/e \approx 0.368$，所以每棵樹大約有三分之一的資料可以當它的 OOB 資料。

頁尾寫 simple but necessary。課堂上的建議是：做機器學習不要蒙著眼睛做，開車不會不看儀表板；要時時刻刻透過乾淨的資料了解現在的表現。

回到八個點的例子：$E_{\text{in}} = 0$ 只說明三條線記住了這八個點。例子裡沒有留任何驗證資料，所以它對 $E_{\text{out}}$ 什麼都沒說。真的要用，至少要留一部分資料來決定跑幾輪（$T$ 是這個模型的煞車之一）以及 PCA 留幾個方向。

### Fun Time：隨機森林靠什麼消除過擬合

**題目（第 13 頁）：** 隨機森林裡消除過擬合的主要技巧是哪一個？

1. voting/averaging
2. pruning
3. early stopping
4. weight-elimination

**答案：1。** 講義的解答：隨機森林以 uniform blending 為基礎，靠投票與平均來做正則化。其他選項錯在哪（本文補充）：

- 選項 2：技法第 10 堂對隨機森林的定義是 bagging 加上 fully-grown 的 C&RT 決策樹，每棵樹長到底，不砍。單一棵完全長成的樹很容易過擬合，隨機森林靠的是很多棵樹平均。
- 選項 3：early stopping 是梯度系列方法的煞車，隨機森林的樹不是用梯度下降訓練的。
- 選項 4：weight-elimination 是神經網路的正則化項，隨機森林沒有那樣的權重。

uniform blending 那條恆等式就是這題的數字版：每個 $g_t$ 各自過擬合到不同的方向，平均之後分歧被消掉。

## 實務上怎麼組合：KDD Cup 冠軍模型與十大演算法

```youtube
url: https://www.youtube.com/watch?v=jIpwy-mPvIA
title: Finale :: Machine Learning in Practice @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–06:40 是四屆 KDD Cup，06:40–09:33 是 ICDM 十大演算法，09:33–10:30 是 Machine Learning Jungle，10:30–10:58 是 Fun Time，之後是整堂的總結。）

課堂上對這一節的開場白是：說是看模型在實務上的使用，其實是要自吹自擂，帶大家看台大隊伍在 KDD Cup 裡用過哪些模型。

### 四屆 KDD Cup 冠軍模型

講義第 14 到 17 頁各一屆。每一頁的第一行是該隊的論文標題與作者，下面是模型的組成。

| 屆次（論文） | 講義上的模型組成 | 課堂上補的話 |
|---|---|---|
| KDD Cup 2010（Yu et al.，*Feature engineering and classifier ensemble for KDD Cup 2010*） | linear blending of：Logistic Regression + many rawly encoded features；Random Forest + human-designed features | logistic regression 用的編碼方式跟矩陣分解那堂的 binary vector encoding 很接近，原始資料編碼後得到一長串特徵；隨機森林那一邊不用那麼原始的資料，改用人對問題的了解設計出來的特徵 |
| KDD Cup 2011 Track 1（Chen et al.，*A linear ensemble of individual and blended models for music rating prediction*） | NNet, DecTree-like, and then linear blending of：Matrix Factorization variants（含 probabilistic PCA）、Restricted Boltzmann Machines、k Nearest Neighbors、Probabilistic Latent Semantic Analysis、linear regression, NNet, & GBDT | 先做非線性的融合，最後才做線性的融合；題目是音樂的推薦系統 |
| KDD Cup 2012 Track 2（Wu et al.，*A two-stage ensemble of diverse models for advertisement ranking in KDD Cup 2012*） | NNet, GBDT-like, and then linear blending of：Linear Regression variants（含 linear SVR）、Logistic Regression variants、Matrix Factorization variants、… | 用 NNet 與類 GBDT 的方法來融合，是因為文獻上這類方法對那次比賽的資料相對有用 |
| KDD Cup 2013 Track 1（Li et al.，*Combination of feature engineering and ranking models for paper-author identification in KDD Cup 2013*） | linear blending of：Random Forest with many many many trees、GBDT variants；with tons of efforts in designing features | 講隨機森林那一堂提過這一屆用了非常多棵樹，讓模型比較穩定；比賽牽涉文字性特徵的處理，花了非常大的力氣了解比賽的目標，用人的腦力設計特徵 |

每一頁最下面有一句評語，四句連起來是這一節的論點：

1. 2010：yes, you've learned everything! 課堂上對著聽眾問：logistic regression 學過沒有？隨機森林學過沒有？用的東西不特別複雜，要配合的是對模型的了解，知道它為什麼適合、適合搭配哪些特徵。
2. 2011：yes, you can 'easily' understand everything! 這一屆有兩個課堂上沒教的模型，講義各給一句定位，課堂上再補說明。Restricted Boltzmann Machines 是 'extended' autoencoder，課堂上說可以看成比較複雜的 autoencoder，有機會讀到時不妨從這個角度切入。Probabilistic Latent Semantic Analysis 在講義上是 an extraction model that has 'soft clusters' as hidden variables，課堂上說它做的事跟 k-means 類似，只是不要求每個點只屬於一個群，改用機率分布去找潛在的群。課堂上還說，以修完這門課的程度去讀這些論文，應該都能看懂。
3. 2012：'key' is to blend properly without overfitting。課堂上說常有人問台大隊伍的祕訣，那幾年成功的關鍵之一是很有系統地做好 blending。
4. 2013：'another key' is to construct features with domain knowledge。課堂上說另一個關鍵是了解比賽要做的事。

課堂上把 blending 叫「打果汁」：一堆模型丟進果汁機，打幾次之後出來最後的模型；2011 與 2012 兩屆都是先打非線性的、最後再打線性的。講義把 2011 的 linear regression、NNet、GBDT 與其他材料並列，課堂上則說這三樣在那一屆是比較沒有那麼重要的材料。

關於領域知識，課堂上有一段提醒：實務上使用模型時，不要幻想把資料丟給機器、人就可以去睡覺。好的機器學習常常要靠好的人類學習配合。人能做的是把自己對問題的了解告訴機器：哪些特徵比較適合，或者至少給機器一個好的特徵轉換模型（課堂上舉的例子是深度學習）。有了好的特徵，機器才可能學到好的權重。

**本文整理：把 2010 的模型放進特徵、最佳化、過擬合三組表。** 以下的歸類是本文做的，依據是講義第 2 到 12 頁的表。

| 組成 | 特徵 | 最佳化 | 過擬合 |
|---|---|---|---|
| Logistic Regression + 原始編碼特徵 | 人做的編碼（binary vector encoding 一類） | 梯度下降一家 | 講義第 11 頁沒有列 logistic regression；基石第 14 堂的 L2 可以用在它身上 |
| Random Forest + 人工設計特徵 | 人設計的特徵，再加 aggregation（uniform）與隨機的低維投影 | 每棵樹分而治之 | 投票平均；OOB |
| 最後的 linear blending | aggregation：兩個模型的輸出當特徵 | 多階段 | internal validation |

這張表也是讀其他三屆模型的方法：每個方塊問三個問題。

### ICDM 2006 的十大資料探勘演算法

講義第 18 頁列出 ICDM（課堂上說明是 International Conference on Data Mining）2006 年列的十大資料探勘演算法。課堂上逐個對到這門課：

| 名次 | 演算法 | 講義的註記 | 課堂上的說明 |
|---|---|---|---|
| 1 | C4.5 | another decision tree | 課堂上教的是 C&RT，了解 C&RT 之後去看 C4.5 不難 |
| 2 | k-Means | | 教過，是分群的方法 |
| 3 | SVM | | 裡面有 kernel、有 large margin |
| 4 | Apriori | for frequent itemset mining | 找資料裡常出現、常一起出現的東西；不太算機器學習的問題，這門課接觸比較少 |
| 5 | EM | 'alternating optimization' algorithm for some models | 可以看成交替最佳化的特例，用在機率模型上 |
| 6 | PageRank | for link-analysis, similar to matrix factorization | Google 最早用來分析網站重不重要的方法；細節跟矩陣分解長得很像，最後也是解一個很大的特徵值問題 |
| 7 | AdaBoost | | 學過 |
| 8 | k Nearest Neighbor | | 學過 |
| 9 | Naive Bayes | a simple linear model with 'weights' decided by data statistics | 沒有真的教，可以看成很特別的線性模型，權重由資料的統計特性決定，不是由最佳化決定 |
| 10 | C&RT | | 學過；前十名裡有兩個決策樹演算法 |

十個裡面，這門課直接教過的有 k-Means、SVM、AdaBoost、k Nearest Neighbor、C&RT 五個，另外四個（C4.5、EM、PageRank、Naive Bayes）講義各用一句話接回學過的東西，只有 Apriori 沒有對應。課堂上提醒這份名單是資料探勘領域的看法；基石課說過資料探勘與機器學習兩個領域常互相交流方法，所以它只代表一個面向。

講義在頁尾列了 personal view of five missing ML competitors：LinReg、LogReg、Random Forest、GBDT、NNet。課堂上的說法是：這五個是學過的工具裡很適合使用、卻沒列在十大裡的，其中神經網路與深度學習在錄這支影片的時候才剛開始流行起來。講義四節之後的補充段落會接上這條線。

### Machine Learning Jungle

講義第 19 頁是一整頁散開的名詞：bagging、decision tree、support vector machine、neural network、kernel、sparsity、autoencoder、functional gradient、AdaBoost、dual、uniform blending、deep learning、nearest neighbor、decision stump、aggregation、large-margin、prototype、quadratic programming、SVR、kernel LogReg、GBDT、PCA、random forest、matrix factorization、Gaussian kernel、RBF network、probabilistic SVM、soft-margin、k-means、OOB error。頁面標題是 Machine Learning Jungle，最下面一行是 welcome to the jungle!

這張圖不是第一次出現。[基石第 16 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles)講義第 23 頁有同一種排法的名詞頁，底下那行是 ready for the jungle!，當時這些名詞幾乎都還沒教。課堂上說：叢林不是隨機森林的那個森林，叢林裡老虎猛獸很多；以前在基石看到這張圖可能覺得可怕，怎麼有這麼多沒看過的名詞。課堂沒辦法包山包海，希望大家以後遇到新的應用、新的方法時，能把它跟學過的這些關鍵概念連上關係，在叢林裡不會迷路。

**怎麼做：** 拿一張紙，把這堂的三個問題當欄位（特徵從哪裡來、誤差怎麼降、靠什麼不過擬合），把這一頁的每個模型名稱填進去。填不出來的格子就是該回頭重看的堂次。

### Fun Time：這門課的幸運數字

**題目（第 20 頁）：** 下面哪一個是這門課官方的幸運數字？

1. 9876
2. 1234
3. 1126
4. 6211

**答案：3。** 講義的解答只有一句 May the luckiness always be with you!。課堂上說這是最後一個練習，讓他無厘頭一下，問的是課程裡反覆出現的那個數字。這題沒有推導可做，但回頭翻前面的講義就找得到這個數字。例如技法第 2 堂的 Fun Time 是 5566 筆資料、1126 個支援向量；技法第 8 堂講重新加權時，分錯的點權重總和是 1126、分對的是 6211。選項 4 的 6211 就是 1126 倒過來寫，也在那一頁出現過；選項 1 的 9876 則是技法第 8 堂另一題 Fun Time 的資料筆數。

### 這堂課的總結

講義第 21 頁把四節各收成一行：

- Feature Exploitation Techniques：kernel, aggregation, extraction, low-dimensional
- Error Optimization Techniques：gradient, equivalence, stages
- Overfitting Elimination Techniques：(lots of) regularization, validation
- Machine Learning in Practice：welcome to the jungle

最後一行不再是下一堂的預告，寫的是 next: happy learning!。課堂上的結語是：正則化避免機器去鑽牛角尖，驗證讓你時時知道自己的表現；希望大家不害怕地走進機器學習的叢林，不管是人類學習還是機器學習，都能繼續快樂地學下去。兩門課加起來是 32 堂。

## Fall 2024 校內課的補充投影片：不在 MOOC 第 16 堂裡的現代深度學習

**這一段不是 MOOC 第 16 堂的內容，也沒有對應的影片。** MOOC 的深度學習只講到技法第 13 堂的 pre-training 與 autoencoder。林軒田在 [Fall 2024 校內課](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)的最後三週另外放了四份投影片，補上 ReLU、初始化、momentum、Adam 這些後來成為標準配備的做法。以下內容依那四份投影片整理：[302u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf)、[303u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf)、[mlmai.ics.handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf)、[1126_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf)。四份都能直接下載，但只有投影片，沒有錄影。這一段出現的頁碼是各份補充投影片自己的頁碼。

放在這篇是因為它們接的正是這堂那幾張表：ReLU 與初始化接「怎麼利用特徵」裡的神經網路，momentum 與 Adam 接「梯度下降一家」，1126 則是另一種整理全課程的方式。

### 三個版本的收尾各不相同

同一門課的結尾，三個版本排得不一樣：

| 版本 | 最後幾週的內容 |
|---|---|
| MOOC | 技法第 13 堂 deep learning（pre-training 與 autoencoder）→ 第 14 堂 RBF 網路 → 第 15 堂矩陣分解 → 第 16 堂 Finale |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13（11/25）212u、213u → W14（12/02）modern deep learning：302u、303u → W15（12/09）停課，放 mlmai.ics 投影片 → W16（12/16）finale：1126 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W13（12/02）停課，放 mlmai.ics → W14（12/09）期末考 → W15（12/16）212u、213u → W16（12/23）modern deep learning 與 finale：302u、303u、1126 |

有兩件事值得注意。第一，兩個校內學期都沒有用 MOOC 的 216 講義，finale 那週用的是 1126。第二，Fall 2026 的 302u、303u、1126、mlmai.ics 路徑在 2026-10-13 打開都是 404，要等排定的週次才會公開，所以這一段以 Fall 2024 版為準。Fall 2026 的課程頁寫明有公開同步直播，但直播是否留下完整錄影，本文沒有逐支核對。

Fall 2024 的 HW7 在 W14 公布，題目涵蓋到技法第 12 堂的神經網路，沒有考 302u／303u 的內容。也就是說這一段沒有對應的作業可以練，要練得自己動手，下面兩處「怎麼做」是本文的建議。

### 302u：活化函數與初始化

302u 的封面寫的是「Machine Learning Soundings（機器學習深測）Lecture 2: Activation and Initialization」，課程頁則標為「deep learning activation」。它接在 212u／213u（技法第 12、13 堂的校內版）後面，從 tanh 網路的 backprop 講起。

**梯度消失**（第 3–6 頁）：backprop 的 $\delta^{(1)}$ 是 $\delta^{(L)}$ 乘上一長串權重和 $\phi'(s)$。tanh 在 $\lvert s \rvert$ 大時飽和，$\phi'(s) = 1 - \tanh^2(s)$ 趨近 0，前面幾層的梯度就小到幾乎不更新，深的網路因此訓練不動。本文補一個數字：$s = 2$ 時 $\tanh(2) \approx 0.964$，$\phi'(2) \approx 0.071$；先不管權重，光是五層的 $\phi'$ 連乘就是 $0.071^5 \approx 1.8 \times 10^{-6}$。第 6 頁列了六種對策：skip connection、小的隨機初始化、逐層 pre-training（技法第 13 堂）、內部正規化、梯度正規化，以及換更好的活化函數。

**ReLU 家族**（第 7–10 頁）：

- **ReLU**，$\phi(s) = \max(s, 0)$：正區間導數為 1，大約一半的時間不會梯度消失；每筆資料只啟動部分神經元，計算也快。投影片說它可以說是深度學習最常用的活化函數。
- **dead neuron**：如果某個神經元對每一筆資料的 $s$ 都小於 0，它的輸出和梯度都是 0，從此不再更新。例如一次很大的梯度步把偏差推到很負，或輸入全為正（沒平移過的影像）又配上負權重。
- **Leaky ReLU**，$\phi(s) = \max(s, 0.01s)$：負區間留一點斜率，比較不會出現 dead neuron。投影片自己問：為什麼是 0.01？
- **Parametric ReLU**，$\phi(\alpha, s) = \max(s, \alpha \cdot s)$：把 $\alpha$ 也當參數用 backprop 學。投影片的結論是「anything (loosely) differentiable is learnable」。

Parametric ReLU 跟講義第 4 頁的 extraction 是同一個想法：連活化函數的形狀都當成要學的變數。

**初始化**（第 11–14 頁）：全 0 對 tanh 太對稱、對 ReLU 不可微；全部同一個常數會讓神經元變成複製品；太大則 tanh 飽和、ReLU 部分死掉。所以要**小的零平均隨機值**。接著推導變異數該取多少，$d^{(\ell-1)}$ 與 $d^{(\ell)}$ 是這一層的輸入與輸出個數：

- tanh 前向傳遞想讓各層輸出變異數維持不變，得到 $\text{var}(w) = 1/d^{(\ell-1)}$；反向傳遞則要 $1/d^{(\ell)}$。**Xavier 初始化**取兩者折衷，$\text{var}(w) = 2/(d^{(\ell-1)} + d^{(\ell)})$。
- ReLU 只保留一半，$\mathbb{E}(x^2)$ 是 $s$ 變異數的一半，所以要乘回 2：**He 初始化**，$\text{var}(w) = 2/d^{(\ell-1)}$。

本文代一組數字：某一層有 256 個輸入、128 個輸出。Xavier 的變異數是 $2/384 \approx 0.0052$，標準差約 $0.072$；He 的變異數是 $2/256 \approx 0.0078$，標準差約 $0.088$。兩者都遠小於 1，而且層愈寬，初始權重愈小。

課程頁附的原始論文：ReLU 是 [Glorot, Bordes & Bengio](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf)，Leaky ReLU 是 [Maas, Hannun & Ng](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf)，Parametric ReLU 是 [He, Zhang, Ren & Sun](https://arxiv.org/abs/1502.01852)。

### 303u：深度學習的最佳化

303u 是同一系列的 Lecture 3: Optimization in Deep Learning，篇幅很短。它接的是講義第 7 頁「梯度下降一家」的第一欄。

第 2 頁先描述誤差曲面：local minima 沒有想像中糟；saddle point 和 local maxima 用 SGD 容易逃出；plateau 需要較大的 $\eta$；ravine 要避免來回震盪。backprop 算梯度很慢，所以用 minibatch SGD，代價是梯度估計不穩定。想穩定，就平均。

- **Momentum**（第 3–5 頁）：用 $M$ 個 minibatch 平均要多花 $M$ 倍計算，重用過去的梯度就不用。均勻權重的滑動視窗不夠好，改成指數衰減的移動平均 $\mathbf{v}_t = \beta\mathbf{v}_{t-1} + (1 - \beta)\boldsymbol{\Delta}_t$，$\beta = 0$ 就退回原本的 SGD。好處是抵消部分變異、壓住峽谷裡的震盪、逃出淺的區域最佳與鞍點。
- **RMSProp**（第 6–8 頁）：希望梯度大的分量步子小一點。只有隨機梯度可用，就對 $\boldsymbol{\Delta}_t \odot \boldsymbol{\Delta}_t$ 做移動平均 $\mathbf{u}_t$，每個分量的步長是 $\eta \cdot (u_t + \epsilon)^{-1/2}$。
- **Adam**（第 9 頁）：約等於 momentum 加 RMSProp 再加全域衰減。投影片的提醒是 Adam 通常比原始 SGD 更積極，但也可能更快過擬合。

本文用四步看 momentum 怎麼壓住震盪。假設某個分量的梯度在峽谷兩側來回跳：$+1, -1, +1, -1$，取 $\beta = 0.9$、$v_0 = 0$：

| $t$ | $\Delta_t$ | $v_t = 0.9\,v_{t-1} + 0.1\,\Delta_t$ |
|---|---|---|
| 1 | $+1$ | $0.1$ |
| 2 | $-1$ | $0.09 - 0.1 = -0.01$ |
| 3 | $+1$ | $-0.009 + 0.1 = 0.091$ |
| 4 | $-1$ | $0.0819 - 0.1 = -0.0181$ |

原本每一步都是大小為 1 的來回，平均之後最大只有 $0.1$。如果梯度一直是 $+1$，$v_t$ 會慢慢爬到接近 1，方向一致的分量不會被壓掉。

投影片對 Adam 的那句提醒，可以對回正則化那張表：最佳化做得愈積極，煞車（early stopping、L2）就愈不能省。

課程頁附的論文：backprop 的 [Rumelhart, Hinton & Williams](https://rdcu.be/b4ocH)、momentum 的 [Qian](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf)、[Adam（Kingma & Ba）](https://arxiv.org/pdf/1412.6980.pdf)。

**怎麼做：** 用 numpy 寫一個兩層 ReLU 網路，在同一份資料上比較三種初始化（全 0、標準常態、He）與三種最佳化器（SGD、momentum、Adam），每種組合畫一條訓練 loss 曲線。九條線放一張圖，就是 302u 加 303u 的完整實驗版。

### mlmai.ics：一場演講的投影片

Fall 2024 的 W15 因為老師要出席 ACML 2024 與 NeurIPS 2024 而停課，課程頁放上 mlmai.ics 投影片代替。這份投影片是林軒田 2020-12-17 在 International Computer Symposium 2020 暨教育部人工智慧技術及應用人才培育計畫成果發表會上的主題演講「Machine Learning for Modern Artificial Intelligence」。

演講分三段：

1. **ML for (Modern) AI**：他對現代 AI 的定義是「intelligently ≈ easily」，也就是 application intelligence；機器學習是把大數據「煮」成 AI 的工具，而且一開始常常要借重人的領域知識。例子是用 CNN 估計颱風強度。
2. **ML Research for Modern AI**：三個研究案例。cost-sensitive 多類別分類（不同誤判的代價不同，例如把 COVID-19 誤判成健康），active learning by learning（用 bandit 挑選 active learning 策略，開源成 [libact](https://github.com/ntucllab/libact)），以及颱風強度估計。每個案例都附一段「做得更實際了嗎？」的反省，例如 libact 最常被回報的問題是在 Windows／Mac 上難安裝。
3. **ML for Future AI**：更有創意、更可解釋、更能互動，對應贏得人類的尊重、信任與喜愛。

這份投影片的價值在於示範課本上的東西怎麼變成研究題目：cost-sensitive 誤差出自[基石第 8 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)，bandit 則是基石 HW2 的 slot machine 題。第一段「要借重人的領域知識」，跟 MOOC 第 16 堂對 KDD Cup 2013 的評語是同一個意思。

### 1126：超短總整理

1126 的封面寫的是「Machine Learning Foundations, Lecture 1126: Super Short Summary」。編號就是上面 Fun Time 裡的「official lucky number of this class」。它把整學期濃縮成 11 個模型，每個模型用同一組欄位描述：err、演算法用的誤差、最佳化方式、Φ、正則化／驗證、參數、實務用途。

| # | 模型 | 投影片寫的實務用途 |
|---|---|---|
| 1 | PLA | online learning 與教學 |
| 2 | ridge linear regression | 當作還不錯的 baseline |
| 3 | logistic regression | 硬分類與軟分類的 baseline |
| 4 | ridge polynomial regression | 常用在一維迴歸 |
| 5 | soft-margin linear SVM | 大規模分類 |
| 6 | soft-margin kernel SVM | 中等規模分類 |
| 7 | AdaBoost | 「boost」決策樹或 stump |
| 8 | decision tree | 可解釋的非線性模型 |
| 9 | bagging／random forest | 讓任何模型或樹更穩定 |
| 10 | GBDT | 資訊檢索與競賽 |
| 11 | neural networks／deep learning | 視覺與語音 |

第 11 個模型的描述直接把 302u、303u 接進來：用 Adam 做 GD／SGD、Xavier／He 初始化、ReLU 或 tanh 神經元、以 early stopping、L1／L2 與 dropout 正則化。

1126 的欄位裡，最佳化方式、Φ、正則化／驗證三欄正好是 MOOC 第 16 堂的三個問題。兩份材料的差別在整理的方向：1126 是按模型一列一列寫，216 講義是按技巧一張表一張表寫。

**怎麼做：** 把這張表和這堂的分類表對照著看。11 個模型當列、三個問題當欄，交叉起來就是整門課的索引。

## 自我檢查

**1. 八個點的例子裡，假設第 1 輪沒有挑到最好的 stump，而是挑了一個加權錯誤率 $\epsilon_1 = \frac{1}{4}$ 的。這一輪的 $\alpha_1$ 是多少？指數誤差的總和從 1 降到多少？跟原本的 $\epsilon_1 = \frac{1}{8}$ 比起來如何？**

答案：$\blacklozenge_1 = \sqrt{(3/4)/(1/4)} = \sqrt{3}$，$\alpha_1 = \ln\sqrt{3} \approx 0.549$。指數誤差的總和乘上 $2\sqrt{\epsilon_1(1 - \epsilon_1)} = 2\sqrt{3/16} = \frac{\sqrt{3}}{2} \approx 0.866$。原本是 $0.661$。方向愈準（$\epsilon$ 愈小），最佳的步長愈大，同一輪能降掉的誤差也愈多。

**2. 把 RBF Network 放進這堂的三組表：它的特徵從哪裡來？用了哪些最佳化技巧？煞車是什麼？**

判準：三項都要對到講義的表。特徵：基本單元是 Gaussian RBF（第 3 頁），中心是萃取出來的隱藏變數、由 k-means 提供（第 4 頁）。最佳化：整體是多階段，先找中心再做線性組合；其中找中心的 k-means 是交替最佳化（第 9 頁）。煞車：限制中心的個數（第 11 頁 constraining 那一格）。只答「RBF Network 是 extraction 模型」不算完整。

**3. 某份減過平均的二維資料算出 $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 5 & 3 \\ 3 & 5 \end{bmatrix}$。不解特徵值問題，直接對 $\mathbf{w} = (\cos\theta, \sin\theta)$ 最大化 $\mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w}$；再解特徵值問題，確認兩個答案一樣。**

答案：$\mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w} = 5\cos^2\theta + 6\cos\theta\sin\theta + 5\sin^2\theta = 5 + 3\sin 2\theta$，最大值 8，發生在 $\theta = 45°$，方向 $\frac{1}{\sqrt{2}}(1, 1)$。特徵值問題：$(5 - \lambda)^2 - 9 = 0$，$\lambda = 8$ 或 $2$；$\lambda = 8$ 的特徵向量解 $-3v_1 + 3v_2 = 0$，同樣是 $\frac{1}{\sqrt{2}}(1, 1)$。最大的特徵值就是目標函數的最大值。

**4. 某個點的目標值 $f = 5$，三個 $g_t$ 分別預測 2、3、7。算出 uniform blending 的 $G$、三個 $g_t$ 的平均平方誤差、$G$ 的平方誤差，並用恆等式說明差額是什麼。**

答案：$G = (2 + 3 + 7)/3 = 4$。平均平方誤差是 $(9 + 4 + 4)/3 = \frac{17}{3} \approx 5.67$。$G$ 的平方誤差是 $(4 - 5)^2 = 1$。差額 $\frac{17}{3} - 1 = \frac{14}{3}$ 應該等於 $g_t$ 對 $G$ 的平均平方差：$(4 + 1 + 9)/3 = \frac{14}{3}$，吻合。差額是三個 $g_t$ 之間的分歧，平均把它消掉了。

**5. 例子裡如果 PCA 只留第一個方向，為什麼不管 AdaBoost 跑幾輪，$E_{\text{in}}$ 都到不了 0？這說明講義第 5 頁 info.-preserving compression 的什麼限制？**

判準：答案要指出第 7 點 $(7, 5)$ 與第 8 點 $(5, 7)$ 投影後的 $p$ 都是 4，但標籤相反，只看 $p$ 的任何函數對這兩點的輸出一定相同，至少錯一個，所以 $E_{\text{in}} \ge \frac{1}{8}$。限制是：PCA 保存的是資料本身的變異（$\lambda = 36$ 對 $24$），過程中不看 $y$，被丟掉的方向可能正好帶著分類需要的資訊。留幾個方向應該用驗證來決定。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)的 finale 排在 W16（12/16），用的投影片是 1126，不是 MOOC 的 216；[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)排在 W16（12/23），與 modern deep learning 同一週。細節見上面「三個版本的收尾各不相同」。

**作業。** 這堂沒有專屬的作業。Fall 2024 最後一份作業 HW7 涵蓋到技法第 12 堂的神經網路，它與期末專題的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。這堂最好的練習是三件事：把八個點的例子自己重算一遍；照「Machine Learning Jungle」那一小節的做法填一張三欄的表；做 303u 後面那個九條曲線的實驗。

**延伸閱讀。** 302u／303u 只是深度學習的入口。想往下走，本站有 [CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview)（其中[動量與損失曲面](/posts/ai/2026-08-22-cmu-11785-06-loss-surfaces-momentum)、[最佳化器與正則化](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization)兩堂正好接 303u）、[MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)，以及台大另一條路線[李宏毅 ML 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview)。

**下一篇。** 這是最後一堂，沒有下一堂。系列接下來是[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)；想回頭查某一堂，從[課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)找。

## 課程影片來源

原始影片：[Feature Exploitation Techniques](https://www.youtube.com/watch?v=WeLobtIDBzI)、[Error Optimization Techniques](https://www.youtube.com/watch?v=En-EyzFipaw)、[Overfitting Elimination Techniques](https://www.youtube.com/watch?v=b6t22jVVC0s)、[Machine Learning in Practice](https://www.youtube.com/watch?v=jIpwy-mPvIA)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。Fall 2024 的四份補充投影片沒有對應的錄影。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-13：全系列改為一堂一篇。這篇原本就只寫技法第 16 堂，這次依 216 講義與四支影片的逐字稿把講義四節重寫，補上四題 Fun Time 的解釋與八個點的算例；Fall 2024 補充投影片的內容保留，移到講義四節之後。

## 參考資料

- [技法第 16 堂講義 216_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf)：本文前四節的主要底本，各張分類表、四題 Fun Time、KDD Cup 與 ICDM 的內容都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [基石第 16 堂講義 16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf)：第 23 頁的「ready for the jungle!」名詞頁，用來對照這堂第 19 頁。
- [技法第 7 堂講義 207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf)：uniform blending 的恆等式（第 9 頁）。
- [技法第 8 堂講義 208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf)：算例用的 AdaBoost 重新加權規則，以及 1126、6211、9876 三個數字的出處。
- [技法第 11 堂講義 211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf)：AdaBoost 的指數誤差與最佳步長 ηₜ = αₜ。
- [技法第 13 堂講義 213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf)：算例用的 PCA 三步驟。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：最後四週的排程、HW7 的範圍與補充投影片的連結。
- [Fall 2024 302u：Activation and Initialization](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf)：梯度消失、ReLU 家族、Xavier／He 初始化。
- [Fall 2024 303u：Optimization in Deep Learning](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf)：momentum、RMSProp、Adam。
- [Fall 2024 mlmai.ics：Machine Learning for Modern Artificial Intelligence](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf)：2020 年演講的三段內容。
- [Fall 2024 1126：Super Short Summary](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf)：11 個模型的總整理表。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：Fall 2026 最後四週的排程。
- [Deep Sparse Rectifier Neural Networks（Glorot, Bordes & Bengio）](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf)：302u 課程頁附的 ReLU 論文。
- [Rectifier Nonlinearities Improve Neural Network Acoustic Models（Maas, Hannun & Ng）](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf)：Leaky ReLU 論文。
- [Delving Deep into Rectifiers（He, Zhang, Ren & Sun）](https://arxiv.org/abs/1502.01852)：Parametric ReLU 與 He 初始化的論文。
- [Learning representations by back-propagating errors（Rumelhart, Hinton & Williams）](https://rdcu.be/b4ocH)：303u 課程頁附的 backprop 論文。
- [On the Momentum Term in Gradient Descent Learning Algorithms（Qian）](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf)：momentum 論文。
- [Adam: A Method for Stochastic Optimization（Kingma & Ba）](https://arxiv.org/pdf/1412.6980.pdf)：Adam 論文。
- [libact](https://github.com/ntucllab/libact)：mlmai.ics 演講提到的 active learning 開源套件。
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)：官方勘誤頁。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
