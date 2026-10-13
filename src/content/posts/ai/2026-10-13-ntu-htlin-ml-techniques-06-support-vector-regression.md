---
title: "支援向量迴歸：把 kernel 與稀疏解帶到迴歸｜台大林軒田 機器學習技法 第 6 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods, kernel-regression]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 23
tldr: "用 representer theorem 把 ridge regression 換成解 β，得到 kernel ridge regression 的解析解 β = (λI + K)⁻¹y，但 N 個 βₙ 幾乎都不是 0。把平方誤差換成 ε-insensitive 的管狀誤差，照 soft-margin SVM 的路線寫成 QP 再取對偶，就得到支援向量迴歸（SVR）：對偶有 2N 個變數，嚴格落在管子裡的點 βₙ 一定是 0。"
description: "台大林軒田機器學習技法第 6 堂 Support Vector Regression 導讀：kernel ridge regression 的解析解、LSSVM 的稠密係數、tube regression、SVR 原始問題與對偶問題的完整推導、稀疏性的來源、線性與 kernel 模型總整理，附手算例子與四題 Fun Time 解說。"
draft: false
glossary:
  - term: "representer theorem"
    aliases: ["表示定理"]
    definition: "任何 L2 正則化線性模型的最佳解 w* 都可以寫成訓練資料轉換後 zₙ 的線性組合 Σ βₙzₙ，因此都能 kernel 化。"
    context: "技法第 5 堂證明；第 6 堂用它把 ridge regression 變成 kernel ridge regression。"
  - term: "kernel ridge regression"
    aliases: ["KRR", "核嶺迴歸"]
    definition: "把 w = Σ βₙzₙ 代進 ridge regression 後改解 β 的迴歸模型，解析解是 β = (λI + K)⁻¹y。"
    context: "技法第 6 堂的第一個結果；係數 β 是稠密的，拿來做分類時叫 LSSVM。"
  - term: "ε-insensitive 誤差"
    aliases: ["epsilon-insensitive error", "tube error", "管狀誤差"]
    definition: "err(y, s) = max(0, |s − y| − ε)：預測與目標的差距在 ε 以內不算錯，超出才按超出的距離計算。"
    context: "技法第 6 堂用它取代平方誤差，推出係數稀疏的支援向量迴歸。"
  - term: "支援向量迴歸"
    aliases: ["Support Vector Regression", "SVR"]
    definition: "最小化 ½wᵀw 加上 C 乘以管狀違反量總和的迴歸模型。對偶問題是和 SVM 對偶類似的 QP，只有落在管壁上或管子外的點係數不為 0。"
    context: "技法第 6 堂的主角，也是 kernel 模型這一段的最後一個模型。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/23 到 23/23），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 6 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂是第一種 Embedding Numerous Features: Kernel Models 的最後一堂。同一頁對上一堂[技法第 5 堂：Kernel 邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)的摘要是：要做軟性分類，可以用兩層學習得到像 SVM 一樣稀疏的模型，也可以用 representer theorem 配上正則化的邏輯誤差，得到稠密的模型。這堂把同一套工具搬到迴歸：輸出是實數時，怎麼用 kernel，又怎麼讓係數保持稀疏。

先備有四項：[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的解析解、[基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的 ridge regression、[技法第 4 堂：軟邊界 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm)的對偶推導，以及上一堂的 representer theorem。讀完之後，你應該能自己推出 kernel ridge regression 的解析解，從管狀誤差一路寫到 SVR 的對偶問題，用互補鬆弛解釋哪些點的係數是 0，並且對三筆資料手算出兩種模型的係數來比較。

整堂課的路線先列出來：

1. **Kernel ridge regression**：把 $\mathbf{w} = \sum_n \beta_n\mathbf{z}_n$ 代進 ridge regression，解出 $\boldsymbol{\beta}$。
2. **發現問題**：$\boldsymbol{\beta}$ 是稠密的，預測時每筆訓練資料都要用到。
3. **換誤差**：平方誤差換成管狀誤差。
4. **SVR 原始問題**：照 soft-margin SVM 的寫法改成 QP。
5. **SVR 對偶問題**：擺脫特徵維度，並由互補鬆弛得到稀疏性。
6. **總整理**：把基石與技法前六堂的線性模型、kernel 模型排成一張地圖。

## 把 ridge regression 接上 kernel：解析解還在不在

```youtube
url: https://www.youtube.com/watch?v=5uUob0VX83Y
title: Support Vector Regression :: Kernel Ridge Regression @ Machine Learning Techniques (機器學習技法)
```

（影片 00:19–01:58 複習上一堂與 representer theorem，01:58–08:49 把問題改寫成 $\boldsymbol{\beta}$ 的形式，08:49–14:36 求解，14:36–16:49 比較線性與 kernel，之後是 Fun Time。）

### 從 representer theorem 出發

講義第 2 頁先回顧上一堂的結論。任何 L2 正則化的線性模型

$$
\min_{\mathbf{w}}\ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\text{err}(y_n, \mathbf{w}^\top\mathbf{z}_n)
$$

的最佳解都能寫成 $\mathbf{w}_* = \sum_{n=1}^{N}\beta_n\mathbf{z}_n$，所以都能 kernel 化。上一堂把 err 換成邏輯迴歸的 cross-entropy。這堂換成迴歸的平方誤差 $\text{err}(y, \mathbf{w}^\top\mathbf{z}) = (y - \mathbf{w}^\top\mathbf{z})^2$，也就是基石教過的 ridge regression。

ridge regression 在基石有解析解，課堂上稱為「一步登天的解」。講義在這一頁底下提的問題是：加上 kernel 之後，解析解還在不在？

### 把 w 換成 β

第 3 頁的做法是直接代入。既然最佳的 $\mathbf{w}$ 一定是 $\mathbf{z}_n$ 的線性組合，講義說不失一般性，可以改成找最佳的 $\boldsymbol{\beta}$。逐項代入 $\mathbf{w} = \sum_m \beta_m\mathbf{z}_m$：

**正則化項。** 兩個 $\mathbf{w}$ 各帶一個加總，課堂上說第一個加總來自前面的 $\mathbf{w}$，第二個來自後面的 $\mathbf{w}$：

$$
\mathbf{w}^\top\mathbf{w} = \Big(\sum_{n=1}^{N}\beta_n\mathbf{z}_n\Big)^\top\Big(\sum_{m=1}^{N}\beta_m\mathbf{z}_m\Big) = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m\,\mathbf{z}_n^\top\mathbf{z}_m = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

最後一步是 kernel trick：$\mathbf{z}_n^\top\mathbf{z}_m$ 換成 $K(\mathbf{x}_n, \mathbf{x}_m)$，不必真的算出 $\mathbf{z}$。

**誤差項裡的分數。** 第 $n$ 筆資料的預測是

$$
\mathbf{w}^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m\,\mathbf{z}_m^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

合起來就是講義上的式子：

$$
\min_{\boldsymbol{\beta}}\ \frac{\lambda}{N}\sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m) + \frac{1}{N}\sum_{n=1}^{N}\Big(y_n - \sum_{m=1}^{N}\beta_m K(\mathbf{x}_n, \mathbf{x}_m)\Big)^2
$$

講義在兩項底下各加了一行註解：前一項是 regularization of $\boldsymbol{\beta}$ on $K$-based regularizer，後一項是 linear regression of $\boldsymbol{\beta}$ on $K$-based features。課堂上的解釋和上一堂談 kernel 邏輯迴歸時相同：這個問題也可以看成 $\boldsymbol{\beta}$ 的線性模型，資料先用 kernel 轉換過（第 $n$ 筆資料的新特徵是它和每筆訓練資料的 kernel 值），正則化項則是一個和 $K$ 有關的特別版本。

### 寫成矩陣

雙重加總不好微分，講義改用矩陣。令 $\mathrm{K}$ 是 $N \times N$ 的 kernel 矩陣，第 $(n, m)$ 個元素是 $K(\mathbf{x}_n, \mathbf{x}_m)$。

- 雙重加總就是 $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$。課堂上舉的例子：前面來一個 $\beta_3$、後面來一個 $\beta_5$，乘在它們上面的係數就是 $\mathrm{K}$ 的第 3 列第 5 行。
- $\sum_m \beta_m K(\mathbf{x}_n, \mathbf{x}_m)$ 是向量 $\mathrm{K}\boldsymbol{\beta}$ 的第 $n$ 個分量，所以平方和是 $\lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2$。課堂上提醒這和基石推線性迴歸時「把一串平方的加總寫成向量長度的平方」是同一招。

把長度的平方展開：

$$
\lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2 = (\mathbf{y} - \mathrm{K}\boldsymbol{\beta})^\top(\mathbf{y} - \mathrm{K}\boldsymbol{\beta}) = \boldsymbol{\beta}^\top\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta} - 2\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y} + \mathbf{y}^\top\mathbf{y}
$$

交叉項可以寫成 $\mathbf{y}^\top\mathrm{K}\boldsymbol{\beta}$ 或 $\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y}$，兩者是同一個數，課堂上說順著寫、反著寫都一樣。整個目標函數是

$$
E_{\text{aug}}(\boldsymbol{\beta}) = \frac{\lambda}{N}\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta} + \frac{1}{N}\Big(\boldsymbol{\beta}^\top\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta} - 2\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y} + \mathbf{y}^\top\mathbf{y}\Big)
$$

講義把這個模型叫 **kernel ridge regression**：用 representer theorem 在 ridge regression 上做 kernel trick。

### 解出 β

$E_{\text{aug}}$ 是 $\boldsymbol{\beta}$ 的二次式，沒有限制式，做法是找梯度為 0 的地方（第 4 頁）。三項分別微分：

- $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ 的梯度是 $2\mathrm{K}\boldsymbol{\beta}$。課堂上用單變數類比：$\frac{1}{2}ax^2$ 對 $x$ 微分是 $ax$，$\mathrm{K}$ 扮演 $a$，$\boldsymbol{\beta}$ 扮演 $x$。本文補充：這條規則要求中間的矩陣對稱，$\mathrm{K}$ 的確對稱，因為 $K(\mathbf{x}_n, \mathbf{x}_m) = \mathbf{z}_n^\top\mathbf{z}_m = K(\mathbf{x}_m, \mathbf{x}_n)$。
- $\boldsymbol{\beta}^\top\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta}$ 也是二次式，中間的 $\mathrm{K}^\top\mathrm{K}$ 同樣對稱，梯度是 $2\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta}$。
- $-2\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y}$ 是一次式，梯度是係數 $-2\mathrm{K}^\top\mathbf{y}$。常數項 $\mathbf{y}^\top\mathbf{y}$ 的梯度是 0。

合起來：

$$
\nabla E_{\text{aug}}(\boldsymbol{\beta}) = \frac{2}{N}\Big(\lambda\mathrm{K}^\top\mathrm{I}\boldsymbol{\beta} + \mathrm{K}^\top\mathrm{K}\boldsymbol{\beta} - \mathrm{K}^\top\mathbf{y}\Big) = \frac{2}{N}\mathrm{K}^\top\Big((\lambda\mathrm{I} + \mathrm{K})\boldsymbol{\beta} - \mathbf{y}\Big)
$$

第一項本來是 $\lambda\mathrm{K}\boldsymbol{\beta}$，講義寫成 $\lambda\mathrm{K}^\top\mathrm{I}\boldsymbol{\beta}$。課堂上說明這是「偷偷」做的兩件事：$\mathrm{K}$ 對稱，加上轉置不影響結果；再塞一個單位矩陣 $\mathrm{I}$，也不影響結果。目的是讓三項都以 $\mathrm{K}^\top$ 開頭，可以整個提出來。

要讓梯度是 $\mathbf{0}$，一個辦法是讓括號裡的向量就是 $\mathbf{0}$：

$$
(\lambda\mathrm{I} + \mathrm{K})\boldsymbol{\beta} = \mathbf{y} \quad\Longrightarrow\quad \boldsymbol{\beta} = (\lambda\mathrm{I} + \mathrm{K})^{-1}\mathbf{y}
$$

講義對這個解講了兩件事。

**反矩陣一定存在。** 只要 $\lambda > 0$ 就成立，理由是 $\mathrm{K}$ 半正定，這是[技法第 3 堂：Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm) 的 Mercer 條件。課堂上的講法是：合法的 kernel 給出半正定的 $\mathrm{K}$，在對角線上再加一個不是 0 的 $\lambda$，就一定可逆。本文把中間那一步補上：對任何非零向量 $\mathbf{v}$，

$$
\mathbf{v}^\top(\lambda\mathrm{I} + \mathrm{K})\mathbf{v} = \lambda\lVert\mathbf{v}\rVert^2 + \mathbf{v}^\top\mathrm{K}\mathbf{v} \ \ge\ \lambda\lVert\mathbf{v}\rVert^2 \ >\ 0
$$

所以 $(\lambda\mathrm{I} + \mathrm{K})\mathbf{v}$ 不可能是 $\mathbf{0}$，這個矩陣可逆。

**計算量是 $O(N^3)$。** 要求反矩陣的是 $N \times N$ 的矩陣，而且是稠密的。課堂上的理由和對偶 SVM 那堂談 $Q_D$ 時一樣：kernel 值大多不是 0，除非兩個向量剛好垂直。

本文補充兩點。第一，梯度為 0 的地方為什麼是最小值：$\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta} \ge 0$ 與 $\lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2$ 都是開口向上的二次函數，相加之後仍是凸函數，梯度為 0 的點就是全域最小。第二，講義的用字是 one analytic solution。$\mathrm{K}$ 不可逆時，還有別的 $\boldsymbol{\beta}$ 也讓梯度為 0：把解加上任何滿足 $\mathrm{K}\mathbf{v} = \mathbf{0}$ 的 $\mathbf{v}$ 即可。不過 $\lVert\sum_n v_n\mathbf{z}_n\rVert^2 = \mathbf{v}^\top\mathrm{K}\mathbf{v} = 0$，這些 $\boldsymbol{\beta}$ 對應的 $\mathbf{w}$ 完全相同，選哪一個都得到同一個模型。

講義在這一頁的結論是：現在可以「輕鬆地」做非線性迴歸了。課堂上補充，以前做非線性迴歸是先做特徵轉換、再跑線性迴歸；現在多了一條路，直接透過 kernel 去解藏在 $\mathcal{Z}$ 空間裡的迴歸問題。

### 數值例子：三個點的二次 kernel

以下是本文自擬的例子，不在講義上。三筆一維資料：

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $-1$ | $1$ |
| 2 | $0$ | $0$ |
| 3 | $1$ | $1$ |

kernel 用技法第 3 堂的二次多項式 $K(x, x') = (1 + xx')^2$，$\lambda = 1$。

**第一步：算 $\mathrm{K}$。** 例如 $K(x_1, x_1) = (1 + 1)^2 = 4$、$K(x_1, x_2) = (1 + 0)^2 = 1$、$K(x_1, x_3) = (1 - 1)^2 = 0$：

$$
\mathrm{K} = \begin{bmatrix} 4 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 4 \end{bmatrix}, \qquad \lambda\mathrm{I} + \mathrm{K} = \begin{bmatrix} 5 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 5 \end{bmatrix}
$$

**第二步：解 $(\lambda\mathrm{I} + \mathrm{K})\boldsymbol{\beta} = \mathbf{y}$。** 三條方程式是 $5\beta_1 + \beta_2 = 1$、$\beta_1 + 2\beta_2 + \beta_3 = 0$、$\beta_2 + 5\beta_3 = 1$。第一條減第三條得到 $\beta_1 = \beta_3$，代進第二條得 $\beta_2 = -\beta_1$，再代回第一條得 $4\beta_1 = 1$：

$$
\boldsymbol{\beta} = \Big(\frac{1}{4},\ -\frac{1}{4},\ \frac{1}{4}\Big)
$$

**第三步：寫出 $g$。** 用這一節 Fun Time 的結論 $g(x) = \sum_n \beta_n K(x_n, x)$：

$$
g(x) = \frac{1}{4}(1 - x)^2 - \frac{1}{4}\cdot 1 + \frac{1}{4}(1 + x)^2 = \frac{1}{4} + \frac{1}{2}x^2
$$

**這個結果代表什麼。** 三筆資料其實落在 $y = x^2$ 上，學到的卻是 $\frac{1}{4} + \frac{1}{2}x^2$，在三個訓練點上的預測是 $0.75$、$0.25$、$0.75$。差距來自正則化：$\lambda = 1$ 對三筆資料來說很重，把曲線壓平了。另外，三個 $\beta_n$ 沒有一個是 0。

**和 $\mathcal{Z}$ 空間的 ridge regression 對一次。** 這個 kernel 對應的轉換是 $\boldsymbol{\Phi}(x) = (1, \sqrt{2}x, x^2)$，因為 $1 + 2xx' + x^2x'^2 = (1 + xx')^2$。用 $\mathbf{w} = \sum_n \beta_n\mathbf{z}_n$ 算回去：

$$
\mathbf{w} = \frac{1}{4}(1, -\sqrt{2}, 1) - \frac{1}{4}(1, 0, 0) + \frac{1}{4}(1, \sqrt{2}, 1) = \Big(\frac{1}{4},\ 0,\ \frac{1}{2}\Big)
$$

$\mathbf{w}^\top\boldsymbol{\Phi}(x) = \frac{1}{4} + \frac{1}{2}x^2$，和上面一致。直接在 $\mathcal{Z}$ 空間用線性 ridge regression 的公式 $\mathbf{w} = (\lambda\mathrm{I} + \mathrm{Z}^\top\mathrm{Z})^{-1}\mathrm{Z}^\top\mathbf{y}$ 也得到 $(0.25, 0, 0.5)$。兩條路解的是同一個問題，只差在要求反矩陣的那個矩陣是 $\tilde{d} \times \tilde{d}$ 還是 $N \times N$。本文用 Python 的 `fractions` 與 numpy 各算過一遍，結果相同。

### 線性與 kernel 的取捨

第 5 頁把兩種 ridge regression 並排，上方各有一張圖：同一組資料，左邊的線性 ridge regression 畫出一條直線，右邊的 kernel ridge regression 畫出一條彎曲的線，資料點到線的垂直紅線段是誤差。

| | 線性 ridge regression | kernel ridge regression |
|---|---|---|
| 解 | $\mathbf{w} = (\lambda\mathrm{I} + \mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathbf{y}$ | $\boldsymbol{\beta} = (\lambda\mathrm{I} + \mathrm{K})^{-1}\mathbf{y}$ |
| 彈性 | 較受限 | 靠 $K$ 得到彈性 |
| 訓練 | $O(d^3 + d^2N)$ | $O(N^3)$ |
| 預測 | $O(d)$ | $O(N)$ |
| 講義的評語 | $N \gg d$ 時有效率 | 資料量大時吃力 |

線性那一欄的 $d^2N$ 是算 $\mathrm{X}^\top\mathrm{X}$ 的時間，$d^3$ 是對 $d \times d$ 矩陣求逆的時間。課堂上的說明是：線性的 $\mathbf{w}$ 長度是 $d$，預測只要 $d$ 的時間；用了 kernel，訓練與預測就都跟資料量 $N$ 綁在一起，資料一多就不適合。課堂上還回頭連到前幾堂 SVM 談過的事：線性模型的優點除了效率，還有模型複雜度比較容易控制；問題比較複雜、又負擔得起計算時，才換成 kernel。講義把這頁總結成一句：線性與 kernel 之間是效率與彈性的取捨。

### Fun Time：解出 β 之後的 g

**題目（第 6 頁）：** 用某個 kernel 函數 $K$ 做 kernel ridge regression，得到最佳的 $\boldsymbol{\beta}$ 之後，$g(\mathbf{x})$ 是哪一個？

1. $\sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})$
2. $\sum_{n=1}^{N} y_n\beta_n K(\mathbf{x}_n, \mathbf{x})$
3. $\sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x}) + \lambda$
4. $\sum_{n=1}^{N} y_n\beta_n K(\mathbf{x}_n, \mathbf{x}) + \lambda$

**答案：1。** 講義的解答是把兩條式子接起來：representer theorem 給 $\mathbf{w} = \sum_n \beta_n\mathbf{z}_n$，迴歸的輸出是 $g(\mathbf{x}) = \mathbf{w}^\top\mathbf{z}$，所以

$$
g(\mathbf{x}) = \Big(\sum_{n=1}^{N}\beta_n\mathbf{z}_n\Big)^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n\,\mathbf{z}_n^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})
$$

其他選項錯在哪裡，以下是本文的說明。選項 2 多了 $y_n$，那是 SVM 的寫法 $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$；這裡的線性組合係數就是 $\beta_n$ 本身，$y_n$ 的資訊已經在解 $\boldsymbol{\beta} = (\lambda\mathrm{I} + \mathrm{K})^{-1}\mathbf{y}$ 時用掉了。選項 3 與 4 多加了 $\lambda$。$\lambda$ 只在訓練時決定 $\boldsymbol{\beta}$ 是多少，不會出現在預測的式子裡；這一節的模型也沒有另外的常數項 $b$。上面的數值例子就是照選項 1 算的，而且和 $\mathcal{Z}$ 空間的結果對得上。

## 稠密的 β 是個問題：換成管狀誤差，寫出 SVR 的原始問題

```youtube
url: https://www.youtube.com/watch?v=rMTD31FFY3g
title: Support Vector Regression :: Support Vector Regression Primal @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:33 是 LSSVM 與稠密的 $\boldsymbol{\beta}$，03:33–07:35 管狀誤差，07:35–09:25 與平方誤差比較，09:25–12:14 模仿 SVM 改寫，12:14–16:17 引進違反量，16:17–18:04 參數與 QP 的大小，之後是 Fun Time。）

### LSSVM：邊界差不多，支援向量多很多

基石教過線性迴歸可以拿來做分類。kernel ridge regression 也可以，這個用法有個名字叫 least-squares SVM（LSSVM）。課堂上解釋，least-squares 這個字是在強調它用的是迴歸的平方誤差。

講義第 7 頁放了兩張圖，同一組二元分類資料，左邊跑 soft-margin Gaussian SVM，右邊跑 Gaussian LSSVM，支援向量用方框標出來。兩張圖的分類邊界差不多。差別在方框：左圖只有一部分的點有方框，右圖幾乎每個點都有。

原因在 $\boldsymbol{\beta}$ 是怎麼算出來的。課堂上的說法是，$\boldsymbol{\beta}$ 是求反矩陣算出來的，沒有什麼理由讓其中某些分量剛好是 0，所以每一筆資料都是支援向量。剛才三個點的例子也是如此，三個 $\beta_n$ 都不是 0。

支援向量多的代價在預測。$g(\mathbf{x}) = \sum_n \beta_n K(\mathbf{x}_n, \mathbf{x})$ 裡，每個非零的 $\beta_n$ 都要算一次 kernel。講義寫的是 slower prediction、dense $\boldsymbol{\beta}$（BIG $g$），課堂上說這樣的 $g$ 很「肥大」。講義接著分兩類：

- **稠密的 $\boldsymbol{\beta}$**：LSSVM、kernel 邏輯迴歸。
- **稀疏的 $\boldsymbol{\alpha}$**：標準的 SVM，大部分的 $\alpha_n$ 是 0，這是 KKT 條件給的性質。

這一節的目標就此定下來：做迴歸，但要得到像標準 SVM 那樣稀疏的 $\boldsymbol{\beta}$。

### 管狀誤差：差一點點就不算錯

講義第 8 頁的做法是換誤差函數，稱為 **tube regression**。圖上在迴歸線的上下各畫出一段藍色的帶狀區域（管子）：

- 資料點落在管子裡：不算錯。
- 資料點落在管子外：錯誤是它到管子邊緣的距離。

課堂上把管子叫「中立區」：預測和目標差得很少時，就當作沒錯，不扣分；超出中立區的才扣，而且只扣超出的那一段。寫成式子，$s$ 是預測的分數，$y$ 是目標：

$$
\text{err}(y, s) = \max\big(0,\ \lvert s - y\rvert - \epsilon\big)
$$

- $\lvert s - y\rvert \le \epsilon$ 時，第二項不大於 0，max 取 0。
- $\lvert s - y\rvert > \epsilon$ 時，第二項是正的，誤差是 $\lvert s - y\rvert - \epsilon$。

這個誤差通常叫 **$\epsilon$-insensitive error**，$\epsilon > 0$。講義把 $\epsilon$ 稱為管子的垂直寬度；課堂上說得更細，$\epsilon$ 是從線往上或往下各能容忍的距離，整個中立區的高度是 $2\epsilon$。

課堂上還點出為什麼挑這個形式：soft-margin SVM 的 hinge 誤差裡也有一個「和 0 取 max」，誤差長得像，後面的推導就能照著 SVM 走，也才有機會得到 SVM 那種稀疏的解。

### 管狀誤差與平方誤差

第 9 頁上方把兩種迴歸的圖並排：左邊有藍色管子，只算超出管子的紅線長度；右邊是平方誤差，沒有管子，算的是整段紅線長度的平方。課堂上說平方誤差有點像管子很小很小的情況，差別在紅線還要再平方。下方把兩種誤差對 $s$ 畫在同一張圖上：平方誤差是拋物線，管狀誤差在 $y$ 附近有一段平的，兩側是斜率固定的直線。講義的結論是 $\lvert s - y\rvert$ 小的時候兩者差不多，而管狀誤差比較不受離群值（outliers）影響。課堂上的解釋用的字是雜訊：離得遠時平方誤差長得很快，模型會為了遷就少數幾個差很遠的點而改變整條線；管狀誤差長得平緩，這個問題比較輕。

下表是本文算的，取 $\epsilon = 0.5$，看差距變大時兩種誤差各是多少：

| $\lvert s - y\rvert$ | 管狀誤差 | 平方誤差 |
|---|---|---|
| $0.2$ | $0$ | $0.04$ |
| $0.5$ | $0$ | $0.25$ |
| $1$ | $0.5$ | $1$ |
| $3$ | $2.5$ | $9$ |
| $10$ | $9.5$ | $100$ |

差距從 3 變成 10，管狀誤差多了 7，平方誤差多了 91。一筆差得很遠的資料，在平方誤差底下的份量大得多。

### 模仿 SVM：把正則化的管狀迴歸改寫

第 10 頁先寫出 L2 正則化的 tube regression：

$$
\min_{\mathbf{w}}\ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\max\big(0,\ \lvert\mathbf{w}^\top\mathbf{z}_n - y_n\rvert - \epsilon\big)
$$

然後和標準 SVM 對照：

| | 正則化的 tube regression | 標準 SVM |
|---|---|---|
| 形式 | $\min \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum$ 管狀違反量 | $\min \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum$ 邊界違反量 |
| 怎麼解 | 沒有限制式，但 max 不可微分 | 也不可微分，但可以寫成 QP |
| 怎麼 kernel 化 | 可以用 representer theorem，但看不出稀疏性 | 用對偶問題；KKT 條件帶出稀疏性 |

左邊的兩個「但」就是不直接解它的理由。講義的決定是模仿標準 SVM 的推導。課堂上說，為了長得跟 SVM 愈像愈好，做了幾件小事：參數從 $\lambda$ 換成 SVM 慣用的 $C$；$\mathbf{w}^\top\mathbf{w}$ 前面放 $\frac{1}{2}$；把常數項從 $\mathbf{w}$ 裡獨立出來寫成 $b$。結果是

$$
\min_{b,\mathbf{w}}\ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\max\big(0,\ \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert - \epsilon\big)
$$

本文補充兩種參數的關係：把上一個式子的目標函數整個乘上 $\frac{N}{2\lambda}$（正數，不改變最小值的位置），就得到 $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \frac{1}{2\lambda}\sum_n \max(\cdot)$，所以 $C$ 對應 $\frac{1}{2\lambda}$。$C$ 愈大，$\lambda$ 愈小，正則化愈弱，這和上一堂看 soft-margin SVM 時的結論相同。

### 從 max 與絕對值到線性的限制式

第 11 頁分兩步把它變成 QP。

**第一步：照 SVM 的做法引進 $\xi_n$。** soft-margin SVM 用一個變數 $\xi_n$ 記錄每筆資料違反了多少，這裡照做：

$$
\begin{aligned}
\min_{b,\mathbf{w},\boldsymbol{\xi}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\xi_n \\
\text{s.t.}\quad & \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert \le \epsilon + \xi_n, \qquad \xi_n \ge 0
\end{aligned}
$$

課堂上的說法是：我們希望分數和 $y_n$ 的差距在 $\epsilon$ 之內，超出去的部分就要「收 $\xi_n$ 的錢」。本文把等價的理由寫出來：固定 $(b, \mathbf{w})$ 時，限制式要求 $\xi_n \ge \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert - \epsilon$ 而且 $\xi_n \ge 0$；目標函數希望 $\xi_n$ 愈小愈好，所以最佳的 $\xi_n$ 剛好是這兩個下界裡比較大的那個，也就是 $\max(0, \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert - \epsilon)$。

**第二步：拆掉絕對值。** 這還不是 QP，因為限制式裡的絕對值不是線性運算。絕對值代表兩種情況：$y_n$ 比分數高，或 $y_n$ 比分數低。講義把一個 $\xi_n$ 拆成兩個，$\xi_n^{\wedge}$ 記上方的違反量（upper tube violation），$\xi_n^{\vee}$ 記下方的違反量（lower tube violation）：

$$
\begin{aligned}
\min_{b,\mathbf{w},\boldsymbol{\xi}^{\vee},\boldsymbol{\xi}^{\wedge}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\big(\xi_n^{\vee} + \xi_n^{\wedge}\big) \\
\text{s.t.}\quad & -\epsilon - \xi_n^{\vee} \ \le\ y_n - \mathbf{w}^\top\mathbf{z}_n - b \ \le\ \epsilon + \xi_n^{\wedge} \\
& \xi_n^{\vee} \ge 0,\quad \xi_n^{\wedge} \ge 0
\end{aligned}
$$

右邊的不等式管上方：$y_n$ 比分數高出超過 $\epsilon$ 時，$\xi_n^{\wedge}$ 必須補上超出的量。左邊的不等式管下方。課堂上對著圖講：資料點在線的上方、超出藍色管子的那一段紅線長度是 $\xi_n^{\wedge}$；在下方超出去的那一段是 $\xi_n^{\vee}$。把所有紅線的長度加起來，再加上正則化項，就是要最小化的東西。

這就是講義所說的 standard Support Vector Regression（SVR）primal：最小化正則化項，加上上下兩種管狀違反量。現在目標函數是 $\mathbf{w}$ 的二次式加 $\xi$ 的一次式，所有限制式對 $(b, \mathbf{w}, \xi)$ 都是一次的，是 QP。

本文補充：同一筆資料的兩個違反量不會同時是正的。$\xi_n^{\wedge} > 0$ 需要 $y_n$ 比分數高出超過 $\epsilon$，$\xi_n^{\vee} > 0$ 需要 $y_n$ 比分數低超過 $\epsilon$，兩件事不可能同時發生。所以最佳解上 $\xi_n^{\vee} + \xi_n^{\wedge}$ 就等於原本的那一個 $\xi_n$，拆開沒有改變問題。

### 兩個參數與 QP 的大小

第 12 頁整理這個 QP：

- **參數 $C$**：正則化與管狀違反之間的取捨。課堂上對照 SVM：SVM 的 $C$ 管的是在乎犯錯多一點、還是在乎邊界胖一點；這裡是在乎違反量少一點、還是正則化強一點。
- **參數 $\epsilon$**：管子的垂直寬度，也就是多寬容。講義特別標了一句 one more parameter to choose。課堂上說這是 SVR 和 SVM 顯著不同的地方，SVR 無論如何都比 SVM 多一個要選的參數。
- **大小**：變數有 $b$ 一個、$\mathbf{w}$ 的 $\tilde{d}$ 個、兩組 $\xi$ 各 $N$ 個，共 $\tilde{d} + 1 + 2N$ 個。限制式有管子的上下兩邊 $2N$ 條，加上 $\xi \ge 0$ 的 $2N$ 條，共 $4N$ 條。

變數個數裡又出現 $\tilde{d}$。和 SVM 那幾堂一樣，下一步是轉成對偶問題再用 kernel trick，把 $\tilde{d}$ 拿掉。

### Fun Time：算兩個違反量

**題目（第 13 頁）：** 用 $\epsilon = 0.05$ 解 SVR。在最佳解上，假設 $\mathbf{w}^\top\mathbf{z}_1 + b = 1.234$，而 $y_1 = 1.126$。$\xi_1^{\vee}$ 與 $\xi_1^{\wedge}$ 各是多少？

1. $\xi_1^{\vee} = 0.108$，$\xi_1^{\wedge} = 0.000$
2. $\xi_1^{\vee} = 0.000$，$\xi_1^{\wedge} = 0.108$
3. $\xi_1^{\vee} = 0.058$，$\xi_1^{\wedge} = 0.000$
4. $\xi_1^{\vee} = 0.000$，$\xi_1^{\wedge} = 0.058$

**答案：3。** 先算 $y_1 - \mathbf{w}^\top\mathbf{z}_1 - b = 1.126 - 1.234 = -0.108$。目標比分數低，而且低了 $0.108$，超過 $\epsilon = 0.05$。下方的限制式 $-\epsilon - \xi_1^{\vee} \le -0.108$ 要求 $\xi_1^{\vee} \ge 0.108 - 0.05 = 0.058$，最小化會讓它剛好等於 $0.058$。上方的限制式 $-0.108 \le 0.05 + \xi_1^{\wedge}$ 在 $\xi_1^{\wedge} = 0$ 時就成立了。講義的解答說，某筆資料有下方違反時，顯然不會有上方違反。

選項 1 的 $0.108$ 是分數和目標的差距，忘了扣掉管子免費容忍的 $0.05$。選項 4 的數字對了，但放錯邊：$y_1$ 在分數的下方，違反的是下管壁。選項 2 兩個錯都犯了。

## 取對偶：擺脫特徵維度，並且看到哪些點的 β 是 0

```youtube
url: https://www.youtube.com/watch?v=0ZIKMdSAJio
title: Support Vector Regression :: Support Vector Regression Dual @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–04:26 是拉格朗日乘數與幾條 KKT 條件，04:26–09:25 對照 SVM 與 SVR 的對偶，09:25–12:38 稀疏性，之後是 Fun Time。）

### 兩組拉格朗日乘數

SVR 的原始問題有兩組管壁的限制式，第 14 頁各配一組乘數：

- $\alpha_n^{\wedge}$ 配上方的限制式 $y_n - \mathbf{w}^\top\mathbf{z}_n - b \le \epsilon + \xi_n^{\wedge}$。
- $\alpha_n^{\vee}$ 配下方的限制式 $-\epsilon - \xi_n^{\vee} \le y_n - \mathbf{w}^\top\mathbf{z}_n - b$。

$\xi_n^{\wedge} \ge 0$ 與 $\xi_n^{\vee} \ge 0$ 照理也各要一組乘數。課堂上說明為什麼講義沒寫：推 soft-margin SVM 時已經看過，這類乘數最後都能用 $\alpha$ 表示，所以只盯著 $\alpha$。

講義在這一頁只列出「部分的 KKT 條件」，完整的推導留給讀者，頁尾寫 standard dual can be derived using the same steps as Lecture 4。課堂上的說法是幾乎重複一次技法第 2 堂或第 4 堂做過的所有事，只是變數多一些，鼓勵大家拿一張紙花十到十五分鐘自己寫一遍。下面把這張紙寫出來；講義列出的結果會標明，其餘步驟是本文照[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm) 與技法第 4 堂的做法補的。

### 把對偶推出來

**寫拉格朗日函數。** 每條限制式移項成「某個量 $\le 0$」，乘上自己的乘數加到目標函數上。$\xi \ge 0$ 的乘數記成 $\gamma_n^{\wedge}$ 與 $\gamma_n^{\vee}$（這兩個記號是本文取的），所有乘數都不是負的：

$$
\begin{aligned}
\mathcal{L} = {} & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\big(\xi_n^{\vee} + \xi_n^{\wedge}\big) \\
& + \sum_{n=1}^{N}\alpha_n^{\wedge}\big(y_n - \mathbf{w}^\top\mathbf{z}_n - b - \epsilon - \xi_n^{\wedge}\big) + \sum_{n=1}^{N}\alpha_n^{\vee}\big(\mathbf{w}^\top\mathbf{z}_n + b - y_n - \epsilon - \xi_n^{\vee}\big) \\
& - \sum_{n=1}^{N}\gamma_n^{\wedge}\xi_n^{\wedge} - \sum_{n=1}^{N}\gamma_n^{\vee}\xi_n^{\vee}
\end{aligned}
$$

和技法第 2 堂一樣，原始問題等於 $\min_{b,\mathbf{w},\xi}\max_{\alpha,\gamma \ge 0}\mathcal{L}$，強對偶讓 min 與 max 可以對調，內層對 $(b, \mathbf{w}, \xi)$ 沒有限制式，所以各個偏微分都要是 0。

**對 $\xi_n^{\wedge}$ 與 $\xi_n^{\vee}$ 偏微分。**

$$
\frac{\partial\mathcal{L}}{\partial\xi_n^{\wedge}} = C - \alpha_n^{\wedge} - \gamma_n^{\wedge} = 0, \qquad \frac{\partial\mathcal{L}}{\partial\xi_n^{\vee}} = C - \alpha_n^{\vee} - \gamma_n^{\vee} = 0
$$

所以 $\gamma_n^{\wedge} = C - \alpha_n^{\wedge}$、$\gamma_n^{\vee} = C - \alpha_n^{\vee}$，這就是課堂上說的「可以用 $\alpha$ 表示」。$\gamma \ge 0$ 於是變成 $\alpha_n^{\wedge} \le C$ 與 $\alpha_n^{\vee} \le C$。把 $\gamma$ 代回去，$\mathcal{L}$ 裡 $\xi_n^{\wedge}$ 的係數是 $C - \alpha_n^{\wedge} - \gamma_n^{\wedge} = 0$，$\xi_n^{\vee}$ 同理，所有含 $\xi$ 的項都消失。

**對 $b$ 偏微分。** $b$ 在 $\alpha_n^{\wedge}$ 那一項的係數是 $-1$，在 $\alpha_n^{\vee}$ 那一項是 $+1$：

$$
\frac{\partial\mathcal{L}}{\partial b} = -\sum_{n=1}^{N}\alpha_n^{\wedge} + \sum_{n=1}^{N}\alpha_n^{\vee} = 0 \quad\Longrightarrow\quad \sum_{n=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big) = 0
$$

這是講義第 14 頁列的第二條。加上它之後，含 $b$ 的項也消失。

**對 $\mathbf{w}$ 偏微分。**

$$
\frac{\partial\mathcal{L}}{\partial w_i} = w_i - \sum_{n=1}^{N}\alpha_n^{\wedge}z_{n,i} + \sum_{n=1}^{N}\alpha_n^{\vee}z_{n,i} = 0 \quad\Longrightarrow\quad \mathbf{w} = \sum_{n=1}^{N}\underbrace{\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)}_{\beta_n}\mathbf{z}_n
$$

這是講義列的第一條。$\mathbf{w}$ 又是 $\mathbf{z}_n$ 的線性組合，係數 $\beta_n = \alpha_n^{\wedge} - \alpha_n^{\vee}$ 就是 SVR 版本的 $\beta_n$。課堂上指出 $\mathbf{z}_n$ 是從限制式裡的 $\mathbf{w}^\top\mathbf{z}_n$ 微分跑出來的，和 soft-margin SVM 的情況類似。

**代回去。** 消掉 $\xi$ 與 $b$ 之後，$\mathcal{L}$ 剩下

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} - \mathbf{w}^\top\sum_{n=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)\mathbf{z}_n + \sum_{n=1}^{N}\alpha_n^{\wedge}(y_n - \epsilon) - \sum_{n=1}^{N}\alpha_n^{\vee}(y_n + \epsilon)
$$

第二項的加總就是 $\mathbf{w}$，所以前兩項合成 $-\frac{1}{2}\mathbf{w}^\top\mathbf{w}$。對偶問題是在 $\boldsymbol{\alpha}$ 上取 max：

$$
\max_{\boldsymbol{\alpha}^{\wedge},\boldsymbol{\alpha}^{\vee}}\ -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)\mathbf{z}_n\Big\rVert^2 - \sum_{n=1}^{N}\Big((\epsilon - y_n)\alpha_n^{\wedge} + (\epsilon + y_n)\alpha_n^{\vee}\Big)
$$

乘上 $-1$ 改成 min，把長度的平方展開成雙重加總，內積換成 kernel，就是講義第 15 頁右下角的 SVR 對偶，其中 $k_{n,m}$ 是 $K(\mathbf{x}_n, \mathbf{x}_m)$ 的簡寫：

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}^{\wedge},\boldsymbol{\alpha}^{\vee}}\quad & \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)\big(\alpha_m^{\wedge} - \alpha_m^{\vee}\big)k_{n,m} + \sum_{n=1}^{N}\Big((\epsilon - y_n)\cdot\alpha_n^{\wedge} + (\epsilon + y_n)\cdot\alpha_n^{\vee}\Big) \\
\text{s.t.}\quad & \sum_{n=1}^{N}1\cdot\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big) = 0 \\
& 0 \le \alpha_n^{\wedge} \le C,\quad 0 \le \alpha_n^{\vee} \le C
\end{aligned}
$$

式子裡只剩 kernel 值，$\tilde{d}$ 不見了。

### 不重推也能對出來：SVM 與 SVR 的對照

課堂上沒有帶這段推導，改用第 15 頁的四種顏色說明「對偶問題的長相是有跡可循的」。投影片把 soft-margin SVM 與 SVR 的原始問題、對偶問題排成兩欄，同一種顏色的東西會跑到同一個位置：

| 原始問題裡的東西 | 跑到對偶的哪裡 | soft-margin SVM | SVR |
|---|---|---|---|
| 限制式裡乘在 $\mathbf{w}$ 上的 $\mathbf{z}_n$（與它的係數） | 二次項的係數 | $y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)$ | $k_{n,m}$，係數是 $\pm 1$ |
| 限制式裡的常數 | 一次項的係數 | $-1$（來自 $\ge 1 - \xi_n$ 的 1） | $\epsilon - y_n$ 與 $\epsilon + y_n$ |
| 對 $b$ 偏微分 | 一條等式 | $\sum_n y_n\alpha_n = 0$ | $\sum_n 1\cdot(\alpha_n^{\wedge} - \alpha_n^{\vee}) = 0$ |
| $C\sum\xi$ 與 $\xi \ge 0$ | 乘數的上界 | $0 \le \alpha_n \le C$ | $0 \le \alpha_n^{\wedge} \le C$、$0 \le \alpha_n^{\vee} \le C$ |

投影片為了讓對照看得出來，把 SVR 的兩條限制式寫成 $1\cdot(y_n - \mathbf{w}^\top\mathbf{z}_n - b) \le \epsilon + \xi_n^{\wedge}$ 與 $1\cdot(\mathbf{w}^\top\mathbf{z}_n + b - y_n) \le \epsilon + \xi_n^{\vee}$，那個 1 就站在 SVM 的 $y_n$ 的位置。課堂上說，掌握這四種顏色，只要知道哪個係數跑到哪裡，就能從原始問題寫出對偶。

講義這一頁的結論是 similar QP, solvable by similar solver。課堂上補充它的實際意義：為 soft-margin SVM 設計的又快又好的解法，可以用類似的方式套到 SVR 上。

### 稀疏性：管子裡的點 β 是 0

花這麼多力氣，是為了確認 SVR 有沒有 SVM 那種稀疏性。第 16 頁用的工具是互補鬆弛。講義第 14 頁列的兩條是

$$
\begin{aligned}
\alpha_n^{\wedge}\big(\epsilon + \xi_n^{\wedge} - y_n + \mathbf{w}^\top\mathbf{z}_n + b\big) &= 0 \\
\alpha_n^{\vee}\big(\epsilon + \xi_n^{\vee} + y_n - \mathbf{w}^\top\mathbf{z}_n - b\big) &= 0
\end{aligned}
$$

每條都是「乘數」乘上「對應限制式的餘裕」，兩者至少一個是 0。技法第 2 堂的課堂上把這個關係比喻成哈利波特與佛地魔，兩個不能同時活下來；這堂的課堂上沒有再提這兩個名字，只沿用同一種講法：括號活下來，乘數就得掛掉。

考慮一筆嚴格落在管子裡的資料，$\lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert < \epsilon$，講義的推論分四步：

1. 它沒有任何違反，所以 $\xi_n^{\wedge} = 0$、$\xi_n^{\vee} = 0$。
2. 兩個括號變成 $\epsilon - (y_n - \mathbf{w}^\top\mathbf{z}_n - b)$ 與 $\epsilon + (y_n - \mathbf{w}^\top\mathbf{z}_n - b)$。差距的絕對值嚴格小於 $\epsilon$，所以兩個括號都嚴格大於 0。
3. 括號不是 0，互補鬆弛逼得 $\alpha_n^{\wedge} = 0$、$\alpha_n^{\vee} = 0$。
4. $\beta_n = \alpha_n^{\wedge} - \alpha_n^{\vee} = 0$。

這筆資料對 $\mathbf{w}$ 沒有貢獻。反過來說，$\beta_n \ne 0$ 的支援向量只會是落在管壁上或管子外面的點（講義：on or outside tube）。講義的結論用字是 SVR allows sparse $\boldsymbol{\beta}$：管子裡的點愈多，$\boldsymbol{\beta}$ 愈稀疏。

本文再補三件從這些條件直接推得出來的事，講義沒有寫：

- **管子外的點，乘數頂到 $C$。** 上方違反時 $\xi_n^{\wedge} > 0$。$\xi_n^{\wedge} \ge 0$ 這條限制式也有自己的互補鬆弛 $\gamma_n^{\wedge}\xi_n^{\wedge} = 0$，所以 $\gamma_n^{\wedge} = 0$，也就是 $\alpha_n^{\wedge} = C$。下方違反同理得到 $\alpha_n^{\vee} = C$。
- **同一筆資料的兩個乘數不會都是正的。** 如果都是正的，兩個括號都得是 0；兩個括號相加是 $2\epsilon + \xi_n^{\wedge} + \xi_n^{\vee}$，在 $\epsilon > 0$ 時一定是正的，不可能兩個都是 0。所以 $\beta_n$ 不是 $\alpha_n^{\wedge}$ 就是 $-\alpha_n^{\vee}$，大小介於 0 和 $C$ 之間。
- **$b$ 怎麼算。** 找一筆 $0 < \alpha_n^{\wedge} < C$ 的資料：$\alpha_n^{\wedge} < C$ 表示 $\gamma_n^{\wedge} > 0$，所以 $\xi_n^{\wedge} = 0$；$\alpha_n^{\wedge} > 0$ 表示括號是 0。兩者合起來得到 $b = y_n - \mathbf{w}^\top\mathbf{z}_n - \epsilon$，這筆資料剛好在上管壁。用 $0 < \alpha_n^{\vee} < C$ 的資料則是 $b = y_n - \mathbf{w}^\top\mathbf{z}_n + \epsilon$。這和技法第 4 堂用 free support vector（$0 < \alpha_n < C$ 的支援向量）算 $b$ 是同一個做法。

三種位置整理成一張表：

| 資料的位置 | 違反量 | 乘數 | $\beta_n$ |
|---|---|---|---|
| 嚴格在管子裡 | 都是 0 | 都是 0 | $0$ |
| 剛好在上管壁／下管壁 | 都是 0 | $0 \le \alpha_n^{\wedge} \le C$／$0 \le \alpha_n^{\vee} \le C$ | 介於 $0$ 與 $C$／介於 $-C$ 與 $0$ |
| 在管子上方／下方 | $\xi_n^{\wedge} > 0$／$\xi_n^{\vee} > 0$ | $\alpha_n^{\wedge} = C$／$\alpha_n^{\vee} = C$ | $C$／$-C$ |

### 數值例子：三個點的 SVR，原始與對偶都解完

以下是本文自擬的例子，不在講義上。三筆一維資料落在同一條直線上，不做特徵轉換（$z_n = x_n$，kernel 是 $K(x, x') = xx'$），取 $\epsilon = 0.5$、$C = 1$：

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $1$ | $1$ |
| 2 | $2$ | $2$ |
| 3 | $3$ | $3$ |

**第一步：解原始問題。** 記 $r_n = y_n - wx_n - b$。第 3 點的上方違反量至少是 $r_3 - \epsilon$，第 1 點的下方違反量至少是 $-r_1 - \epsilon$，所以違反量的總和至少是

$$
(r_3 - \epsilon) + (-r_1 - \epsilon) = (3 - 3w - b) - (1 - w - b) - 2\epsilon = 1 - 2w
$$

違反量也不會是負的，所以目標函數至少是 $\frac{1}{2}w^2 + C\max(0, 1 - 2w)$，這個下界和 $b$ 無關。$w \ge \frac{1}{2}$ 時它是 $\frac{1}{2}w^2$，最小在 $w = \frac{1}{2}$，值是 $\frac{1}{8}$。$w < \frac{1}{2}$ 時它是 $\frac{1}{2}w^2 + 1 - 2w$，微分是 $w - 2 < 0$，$w$ 愈小值愈大，所以比 $\frac{1}{8}$ 大。下界的最小值是 $\frac{1}{8}$，發生在 $w = \frac{1}{2}$。

接著確認這個下界做得到。$w = \frac{1}{2}$ 而且完全不違反，需要第 1 點 $\lvert\frac{1}{2} + b - 1\rvert \le \frac{1}{2}$ 與第 3 點 $\lvert\frac{3}{2} + b - 3\rvert \le \frac{1}{2}$，也就是 $b \le 1$ 與 $b \ge 1$，所以 $b = 1$。最佳解是

$$
w = \frac{1}{2},\qquad b = 1,\qquad \text{所有 } \xi_n^{\vee} = \xi_n^{\wedge} = 0,\qquad \text{目標值} = \frac{1}{8}
$$

**第二步：看每筆資料在管子的哪裡。**

| $n$ | 分數 $wx_n + b$ | $r_n = y_n - $ 分數 | 位置 |
|---|---|---|---|
| 1 | $1.5$ | $-0.5$ | 剛好在下管壁 |
| 2 | $2$ | $0$ | 嚴格在管子裡 |
| 3 | $2.5$ | $+0.5$ | 剛好在上管壁 |

**第三步：由 KKT 條件算乘數。** 第 2 點嚴格在管子裡，兩個乘數都是 0。第 1 點在下管壁，上方的括號是 $\epsilon - r_1 = 1 \ne 0$，所以 $\alpha_1^{\wedge} = 0$，只有 $\alpha_1^{\vee}$ 可能是正的。第 3 點同理只有 $\alpha_3^{\wedge}$ 可能是正的。剩下兩條等式：

$$
\sum_n \big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big) = \alpha_3^{\wedge} - \alpha_1^{\vee} = 0, \qquad w = \sum_n \big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)x_n = 3\alpha_3^{\wedge} - \alpha_1^{\vee} = \frac{1}{2}
$$

解得 $\alpha_3^{\wedge} = \alpha_1^{\vee} = \frac{1}{4}$，都在 0 與 $C = 1$ 之間。所以

$$
\boldsymbol{\beta} = \Big(-\frac{1}{4},\ 0,\ \frac{1}{4}\Big), \qquad g(x) = \sum_n \beta_n K(x_n, x) + b = \Big(-\frac{1}{4}\cdot 1 + \frac{1}{4}\cdot 3\Big)x + 1 = \frac{1}{2}x + 1
$$

$b$ 也可以用上面補充的公式算：第 3 點 $b = 3 - 1.5 - 0.5 = 1$，第 1 點 $b = 1 - 0.5 + 0.5 = 1$，一致。

**第四步：檢查對偶的目標值。** 二次項是 $\frac{1}{2}\lVert\sum_n\beta_n x_n\rVert^2 = \frac{1}{2}w^2 = \frac{1}{8}$。一次項是 $(\epsilon - y_3)\alpha_3^{\wedge} + (\epsilon + y_1)\alpha_1^{\vee} = (-2.5)(0.25) + (1.5)(0.25) = -\frac{1}{4}$。合計 $-\frac{1}{8}$，正好是原始最佳值 $\frac{1}{8}$ 的負號（對偶乘過 $-1$ 才寫成 min），強對偶成立。

**這個結果代表什麼。**

- 三筆資料只有兩筆是支援向量，中間那筆的 $\beta_2 = 0$，預測時用不到它。
- 資料其實在 $y = x$ 上，SVR 卻學到斜率 $\frac{1}{2}$ 的線。管子容忍 $0.5$ 的誤差，正則化項又偏好小的 $w$，所以它挑了「剛好還能把三個點都收進管子」的最平的線。$\epsilon$ 相對於資料的範圍選得太大，模型就會偏平，這是多出來的那個參數要付的代價。
- 拿同一組資料跑 kernel ridge regression（同一個 kernel，$\lambda = 1$）：$\mathrm{K} = \mathbf{x}\mathbf{x}^\top$、$\mathbf{y} = \mathbf{x}$、$\lVert\mathbf{x}\rVert^2 = 14$。試 $\boldsymbol{\beta} = c\,\mathbf{x}$，$(\mathrm{I} + \mathbf{x}\mathbf{x}^\top)c\,\mathbf{x} = c(1 + 14)\mathbf{x}$，要等於 $\mathbf{x}$ 就是 $c = \frac{1}{15}$，所以 $\boldsymbol{\beta} = (\frac{1}{15}, \frac{2}{15}, \frac{3}{15})$，三個都不是 0，$g(x) = \frac{14}{15}x$。兩個模型一稀疏一稠密的差別，在三筆資料上就看得到。

本文用 Python 驗算過：以 scipy 的數值最佳化分別解原始與對偶問題，得到 $w = 0.5$、$b = 1$、$\alpha_3^{\wedge} = \alpha_1^{\vee} = 0.25$、目標值 $0.125$ 與 $-0.125$；scikit-learn 的 `SVR(kernel='linear', C=1, epsilon=0.5)` 回報的支援向量是第 1、3 筆，係數 $-0.25$ 與 $0.25$，截距 $1$。

### Fun Time：SVR 對偶有幾個變數

**題目（第 17 頁）：** SVR 對偶的 QP 有幾個變數？

1. $\tilde{d} + 1$
2. $\tilde{d} + 1 + 2N$
3. $N$
4. $2N$

**答案：4。** 講義的解答：$\boldsymbol{\alpha}^{\vee}$ 有 $N$ 個變數，$\boldsymbol{\alpha}^{\wedge}$ 另有 $N$ 個。

其他選項各是另一個問題的答案（本文的對照）：$\tilde{d} + 1$ 是 hard-margin SVM 原始問題的變數個數；$\tilde{d} + 1 + 2N$ 是 SVR 原始問題的；$N$ 是 SVM 對偶的。SVR 的對偶比 SVM 的對偶多一倍變數，因為每筆資料有上下兩條管壁。

## 六堂課的 kernel 模型放在一張地圖上

```youtube
url: https://www.youtube.com/watch?v=9OBWkHnzr2k
title: Support Vector Regression :: Summary of Kernel Models @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:25 是線性模型的地圖，02:25–04:05 加上 kernel 模型，04:05–05:47 談哪些實務上常用，05:47–06:44 是 kernel 的威力與責任，06:44–07:20 是 Fun Time，之後是總結與下一堂預告。）

### 線性模型有五個

講義第 18 頁先整理線性模型。基石教了三個：PLA／pocket 做分類，線性（ridge）迴歸做實數的迴歸，邏輯迴歸做軟性分類。技法在分類那一欄加了線性 soft-margin SVM，這堂又在迴歸那一欄加了線性 SVR。課堂上說明排版的邏輯：解同一種問題的模型排在同一欄。

### 加上 kernel 之後的完整地圖

第 19 頁往下長出兩列 kernel 模型。課堂上的總綱是：線性模型只要有正則化，就有機會延伸到 kernel。合起來是四列三欄，下表的欄名是本文依課堂上的說明加的，格子裡的做法照講義：

| 列 | 分類 | 迴歸 | 軟性分類 |
|---|---|---|---|
| 1 | PLA／pocket：用特別的方式最小化 0/1 誤差 | 線性 SVR：用 QP 最小化正則化的管狀誤差 | |
| 2 | 線性 soft-margin SVM：用 QP 最小化正則化的 hinge 誤差 | 線性 ridge regression：用解析解最小化正則化的平方誤差 | 正則化邏輯迴歸：用 GD／SGD 最小化正則化的 cross-entropy |
| 3 | | kernel ridge regression：把線性 ridge regression kernel 化 | kernel 邏輯迴歸：把正則化邏輯迴歸 kernel 化 |
| 4 | SVM：用 QP 解 SVM 對偶 | SVR：用 QP 解 SVR 對偶 | 機率化 SVM：在 SVM 轉換後的分數上跑邏輯迴歸 |

第 3 列靠的是 representer theorem，第 4 列靠的是對偶問題（機率化 SVM 是上一堂的兩階段做法）。

### 哪些常用，哪些少用

講義第 18 到 20 頁對四列各有一句評語：

| 列 | 講義的評語 | 課堂上的理由 |
|---|---|---|
| 1 | 比較少用，因為表現較差 | PLA／pocket 比不上 soft-margin SVM：後者能處理線性不可分的資料，解起來也有效率。在意平方誤差時，線性 ridge regression 通常比線性 SVR 表現好 |
| 2 | [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 裡常用 | 這三個模型是 LIBLINEAR 實作的核心，另有一些變化形式 |
| 3 | 比較少用，因為 $\boldsymbol{\beta}$ 稠密 | 預測要多花很多力氣，又沒有額外的好處。很多人會選 SVR 而不選 kernel ridge regression，選機率化 SVM 而不選 kernel 邏輯迴歸 |
| 4 | [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) 裡常用 | 三個模型在 LIBSVM 裡都有實作 |

課堂上提到這兩套軟體都是在台大開發的，LIBSVM 是非常多人使用的 SVM 軟體。

### 威力愈大，責任愈大

第 21 頁把 kernel 模型收成一句話：可以選的 kernel 有多項式、Gaussian，或自己設計的（要滿足 Mercer 條件），配上第 3、4 列那五個模型，是線性模型很強大的延伸。講義接著引了電影《蜘蛛人》的台詞：with great power comes great responsibility。

課堂上把這句話講白了。Gaussian kernel 對應無限多維的轉換，威力很大；基石談特徵轉換時就提醒過，有了這種力量要小心。具體的責任是小心選參數、小心做驗證，確保這些威力不會被誤用在過擬合上。

### Fun Time：哪個模型比較少用

**題目（第 22 頁）：** 下列哪一個模型在實務上比較少用？

1. pocket
2. ridge regression
3. （線性或 kernel 的）soft-margin SVM
4. 正則化邏輯迴歸

**答案：1。** 講義的解答是 pocket 演算法一般來說不會比線性 soft-margin SVM 表現好，所以比較少用。對照上面的地圖：pocket 在第 1 列；ridge regression 與正則化邏輯迴歸在第 2 列，是 LIBLINEAR 裡常用的；soft-margin SVM 的線性版在第 2 列、kernel 版在第 4 列，兩個都在常用的那幾列。

第 23 頁的總結把四節各收成一句：kernel ridge regression 是 representer theorem 用在 ridge regression 上；SVR 的原始問題是最小化正則化的管狀誤差；SVR 的對偶是和 SVM 對偶類似的 QP；kernel 模型威力大、責任也大。下一堂的預告是 making cocktail from learning models，課堂上的比喻是調雞尾酒或打綜合果汁，把不同方法的長處混在一起。

## 自我檢查

**1. 兩筆資料 $x_1 = -1$、$y_1 = -1$；$x_2 = 1$、$y_2 = 1$。用 $K(x, x') = (1 + xx')^2$、$\lambda = 1$ 做 kernel ridge regression，求 $\boldsymbol{\beta}$ 與 $g(x)$。**

答案：$K(x_1, x_1) = K(x_2, x_2) = 4$，$K(x_1, x_2) = 0$，所以 $\lambda\mathrm{I} + \mathrm{K}$ 是對角線為 5 的對角矩陣，$\boldsymbol{\beta} = (-\frac{1}{5}, \frac{1}{5})$。$g(x) = -\frac{1}{5}(1 - x)^2 + \frac{1}{5}(1 + x)^2 = \frac{4}{5}x$，在 $x = 1$ 預測 $0.8$，比目標 $1$ 小，是正則化的效果。

**2. $\epsilon = 0.2$。某筆資料的分數是 $3.0$、目標是 $3.5$；另一筆的分數是 $3.0$、目標是 $2.9$。各自的 $\xi^{\vee}$、$\xi^{\wedge}$、管狀誤差與平方誤差是多少？**

答案：第一筆 $y - s = 0.5 > 0.2$，目標在分數上方，$\xi^{\wedge} = 0.3$、$\xi^{\vee} = 0$，管狀誤差 $0.3$，平方誤差 $0.25$。第二筆 $\lvert y - s\rvert = 0.1 \le 0.2$，在管子裡，兩個違反量與管狀誤差都是 0，平方誤差是 $0.01$。

**3. 為什麼嚴格落在管子裡的點 $\beta_n$ 一定是 0？$\beta_n \ne 0$ 的點一定在管子外面嗎？**

判準：第一問要用到互補鬆弛，說出管子裡的點兩個違反量都是 0、兩個括號都嚴格大於 0，所以兩個乘數都是 0。第二問的答案是不一定：剛好在管壁上的點也可以有非零的 $\beta_n$，本文三個點的例子裡，兩個支援向量都在管壁上，沒有任何一點在管子外面。

**4. 在三個點的 SVR 例子裡，把 $C$ 改成 $0.1$（$\epsilon$ 仍是 $0.5$），最佳的 $w$ 與目標值是多少？改成 $\epsilon = 0$、$C = 1$ 呢？**

答案：沿用例子裡的下界 $\frac{1}{2}w^2 + C\max(0, 1 - 2w)$。$C = 0.1$ 時，$w < \frac{1}{2}$ 那一段的微分是 $w - 2C = w - 0.2$，在 $w = 0.2$ 最小，值是 $0.02 + 0.1 \times 0.6 = 0.08$，比不違反的 $0.125$ 小。違反量變便宜之後，模型寧可讓頭尾兩點超出管子共 $0.6$，換一條更平的線；這兩點的乘數都頂到 $C = 0.1$，$w = 0.1 \times 3 - 0.1 \times 1 = 0.2$ 對得上。這時 $b$ 不唯一：要讓第 3 點在上管壁或更上方、第 1 點在下管壁或更下方、第 2 點留在管子裡，需要 $1.3 \le b \le 1.9$，這個範圍裡的每個 $b$ 都給出同樣的違反量總和 $0.6$ 與同樣的目標值。原因是沒有任何一筆資料的乘數嚴格介於 0 和 $C$ 之間，稀疏性那一小節「$b$ 怎麼算」的公式找不到可以用的點；技法第 4 堂的講義對 soft-margin SVM 也寫了同一件事：沒有 free support vector 時，只能得到 $b$ 的範圍。$\epsilon = 0$ 時，違反量總和的下界變成 $2 - 2w$，目標函數的下界是 $\frac{1}{2}w^2 + \max(0, 2 - 2w)$：$w < 1$ 時微分 $w - 2 < 0$，所以最小在 $w = 1$，此時 $b = 0$、目標值 $0.5$，三個點都在直線上。管子沒有寬度時，SVR 把資料完全配適。兩個答案本文都用數值最佳化驗算過。

**5. $N = 10{,}000$ 筆資料，特徵轉換後 $\tilde{d} = 10^6$。SVR 的原始與對偶 QP 各有幾個變數？改用 kernel ridge regression 要對多大的矩陣求逆？**

答案：原始問題 $\tilde{d} + 1 + 2N = 1{,}020{,}001$ 個變數、$4N = 40{,}000$ 條限制式。對偶 $2N = 20{,}000$ 個變數，和 $\tilde{d}$ 無關。kernel ridge regression 要對 $10{,}000 \times 10{,}000$ 的稠密矩陣求逆，有 $10^8$ 個元素，$O(N^3)$ 是 $10^{12}$ 的量級，而且解出來的 $\boldsymbol{\beta}$ 一萬個幾乎都不是 0。

## 練習與對應閱讀

**兩個學期的實體課都沒有排這堂。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)在 W11（11/11）上了改寫過的第 5 堂（投影片 `205u`），同一週就接著講 blending 與 bagging，第 6 堂沒排。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)在 W10 講完 kernel 與 soft-margin SVM 之後，W11（11/18）直接進入 blending、bagging 與 AdaBoost，第 5、6 堂都沒排。所以這堂只能以 MOOC 的講義與影片為準，兩者都免費公開。只想跟台大實體課進度的人可以先跳過這堂；想把 kernel 模型看完整的人，這堂補上了迴歸這一塊。

**作業。** 這堂沒有對應的公開作業題。技法其他堂的作業對照見[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**自己動手。** 拿一份迴歸資料，用 scikit-learn 的 `KernelRidge` 與 `SVR` 配同一個 RBF kernel 各跑一次。比較兩者的測試誤差，再數 `SVR` 的 `support_` 有幾個元素、`KernelRidge` 的 `dual_coef_` 有幾個不是 0，就能在真實資料上看到這堂講的稀疏與稠密。接著把 `epsilon` 調大、調小，觀察支援向量的數量怎麼變。

**延伸閱讀。** [CS229 主講義第 5 章](https://cs229.stanford.edu/main_notes.pdf)用另一種方式推導 kernel 方法；[Caltech Learning from Data](https://work.caltech.edu/telecourse) 是同一本教科書的英文課。

**下一堂。** [技法第 7 堂：Blending 與 Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost) 進入技法的第二種技巧 Combining Predictive Features: Aggregation Models：手上有好幾個模型時，怎麼把它們合起來。

## 課程影片來源

原始影片：[Kernel Ridge Regression](https://www.youtube.com/watch?v=5uUob0VX83Y)、[Support Vector Regression Primal](https://www.youtube.com/watch?v=rMTD31FFY3g)、[Support Vector Regression Dual](https://www.youtube.com/watch?v=0ZIKMdSAJio)、[Summary of Kernel Models](https://www.youtube.com/watch?v=9OBWkHnzr2k)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：改為一堂一篇，這篇只寫技法第 6 堂，依講義與影片逐字稿重寫。

## 參考資料

- [技法第 6 堂講義 206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time 與模型地圖都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：確認這堂在 Fall 2024 沒有排進課程計畫。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：確認這堂在 Fall 2026 沒有排進課程計畫。
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)：講義模型地圖第 2 列提到的線性模型軟體。
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)：講義模型地圖第 4 列提到的 kernel 模型軟體。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：延伸閱讀，第 5 章的 kernel 方法。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：延伸閱讀，同一本教科書的英文課。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
