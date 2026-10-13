---
title: "Kernel 邏輯迴歸：SVM 其實是正則化模型｜台大林軒田 機器學習技法 第 5 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods, logistic-regression]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 22
tldr: "soft-margin SVM 的 ξₙ 可以直接寫成 max(1 − yₙ(wᵀzₙ + b), 0)，整個問題就變成 ½wᵀw 加上 C 乘以 hinge 誤差的總和，是一個 L2 正則化模型，C 對應 1/(2λ)。hinge 誤差和邏輯迴歸的 cross-entropy 都是 0/1 誤差的凸上界，所以 SVM 近似於 L2 正則化邏輯迴歸。要機率輸出有兩條路：Platt 的兩層學習只多學兩個數字 A 與 B；representer theorem 則保證最佳的 w 是 zₙ 的線性組合，可以直接在 Z 空間做 kernel 邏輯迴歸，代價是 N 個 βₙ 通常都不是 0。"
description: "台大林軒田機器學習技法第 5 堂 Kernel Logistic Regression 導讀：soft-margin SVM 的無限制形式、hinge 誤差與 cross-entropy 的比較、Platt 的機率化 SVM、representer theorem 的證明與 kernel 邏輯迴歸，並用六個點把每一步算出來。"
draft: false
glossary:
  - term: "hinge 誤差"
    aliases: ["hinge error", "hinge loss"]
    definition: "err(s, y) = max(1 − ys, 0)。soft-margin SVM 改寫成無限制形式後用的誤差，是 0/1 誤差的凸上界。"
    context: "技法第 5 堂用它把 SVM 接回基石的正則化模型。"
  - term: "機率化 SVM"
    aliases: ["probabilistic SVM", "Platt's model", "Platt scaling"]
    definition: "先跑 SVM 得到分數，再用只有 A、B 兩個變數的邏輯迴歸把分數縮放、平移成機率：g(x) = θ(A·(SVM 分數) + B)。"
    context: "技法第 5 堂稱為兩層學習（two-level learning）。"
  - term: "representer theorem"
    aliases: ["表示定理"]
    definition: "任何 L2 正則化線性模型的最佳解 w* 都可以寫成訓練資料轉換後 zₙ 的線性組合 Σ βₙzₙ，因此都能 kernel 化。"
    context: "技法第 5 堂用它推出 kernel 邏輯迴歸，第 6 堂再用它推出 kernel ridge regression。"
  - term: "kernel 邏輯迴歸"
    aliases: ["kernel logistic regression", "KLR"]
    definition: "把 w = Σ βₙzₙ 代進 L2 正則化邏輯迴歸，改成對 N 個 βₙ 做沒有限制式的最佳化；式子裡只出現 kernel 的值。"
    context: "技法第 5 堂的 Kernel Logistic Regression 一節；係數 βₙ 通常都不是 0。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf) 與四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/20 到 20/20），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 5 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂仍在第一種 Embedding Numerous Features: Kernel Models 裡面。上一堂[技法第 4 堂：軟邊界 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm)在同一頁上的摘要是：允許一些 margin violation $\xi_n$，用 $C$ 來罰，結果等於替對偶問題的 $\alpha_n$ 加上上限 $C$。

SVM 講到上一堂已經完整了。這堂換一個方向：SVM 只回答圈圈或叉叉，[基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)回答的是「是圈圈的機率有多少」。課堂上開場就說，這堂要看邏輯迴歸和 kernel 結合起來會變出什麼方法。四節依序做四件事：

1. 把 soft-margin SVM 改寫成沒有限制式的形式，認出它是 L2 正則化。
2. 比較 SVM 用的誤差和邏輯迴歸用的誤差，說明兩個模型為什麼相近。
3. 利用這個相近，讓 SVM 輸出機率（Platt 的兩層學習）。
4. 證明 representer theorem，直接在 kernel 的 Z 空間做邏輯迴歸。

先備是上一堂的 soft-margin SVM 原始與對偶問題、[技法第 3 堂：Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)的 kernel trick、基石第 10 堂的邏輯迴歸與梯度下降，以及[基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的 L2 正則化。讀完之後，你應該能把 soft-margin SVM 寫成無限制形式並說出 $C$ 與 $\lambda$ 的對應、解釋 hinge 誤差和 cross-entropy 在兩端為什麼長得像、照三個步驟做出機率化 SVM、自己證一次 representer theorem，並寫出 kernel 邏輯迴歸要最小化的式子。

全篇共用一組本文自擬的六個一維資料點（不在講義上），每一節都拿它算一次，數字都用 Python 驗算過。台大的實體課兩個學期都沒有完整排這一堂，對應情形放在文末的「練習與對應閱讀」。

## 把 ξ 收進目標函數：軟邊界 SVM 就是 L2 正則化

```youtube
url: https://www.youtube.com/watch?v=Bc8bg5ZkRdk
title: Kernel Logistic Regression :: Soft-Margin SVM as Regularized @ Machine Learning Techniques (機器學習技法)
```

（影片 00:18–03:20 複習前四堂並介紹兩套軟體，03:20–07:06 把 $\xi_n$ 寫成 max，07:06–10:00 和正則化對照，10:00–12:42 是 SVM 在正則化模型裡的位置，之後是 Fun Time。）

### 前四堂的四個問題

講義第 2 頁把前四堂收成一張表。$Q$ 是技法第 2 堂的那個矩陣，元素是 $q_{n,m} = y_n y_m \mathbf{z}_n^\top\mathbf{z}_m$，技法第 3 堂之後內積改用 kernel 算。

| | 原始（primal） | 對偶（dual） |
|---|---|---|
| hard-margin | $\min_{b,\mathbf{w}} \frac{1}{2}\mathbf{w}^\top\mathbf{w}$，限制 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$ | $\min_{\boldsymbol{\alpha}} \frac{1}{2}\boldsymbol{\alpha}^\top Q\boldsymbol{\alpha} - \mathbf{1}^\top\boldsymbol{\alpha}$，限制 $\mathbf{y}^\top\boldsymbol{\alpha} = 0$、$0 \le \alpha_n$ |
| soft-margin | $\min_{b,\mathbf{w},\boldsymbol{\xi}} \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_n \xi_n$，限制 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n$、$\xi_n \ge 0$ | 同一個目標函數，限制 $\mathbf{y}^\top\boldsymbol{\alpha} = 0$、$0 \le \alpha_n \le C$ |

兩個對偶問題只差 $\alpha_n$ 有沒有上限 $C$。頁尾寫 soft-margin preferred in practice，線性的用 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)，非線性的用 [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)。課堂上補充：實務上很少人真的用 hard-margin；這兩套開源軟體都出自台大林智仁老師的實驗室，全球有很多人在用；LIBLINEAR 解的 SVM 和這門課教的形式有一點點不同，但表現不會差太多。

### ξ 不必當變數

第 3 頁回頭看 soft-margin 的原始問題：

$$
\min_{b,\mathbf{w},\boldsymbol{\xi}} \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\xi_n \qquad \text{subject to} \quad y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n,\quad \xi_n \ge 0
$$

這一頁右上角的圖畫了一條胖邊界，有一個點落在邊界裡面，旁邊標著 violation。講義說，對任何一組 $(b, \mathbf{w})$，$\xi_n$ 就是那個點的 margin violation：

$$
\xi_n = \max\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b),\ 0\big)
$$

課堂上分兩種情形講。點違反了胖邊界時，$\xi_n$ 記的是 $y_n$ 乘上分數離我們想要的 1 還差多少，也就是 $1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$，這個數是正的。點沒有違反時，$\xi_n$ 記 0，而這時 $1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ 小於等於 0。兩種情形都是「兩個數裡比較大的那個」，所以寫成一個 max。

講義沒有寫為什麼 $\xi_n$ 一定取這個值，本文補上。先把 $(b, \mathbf{w})$ 固定，只看 $\boldsymbol{\xi}$：

- 目標函數裡跟 $\boldsymbol{\xi}$ 有關的只有 $C\sum_n \xi_n$。$C > 0$，所以每個 $\xi_n$ 都是愈小愈好。
- 限制式一條只管一個 $\xi_n$：它要同時滿足 $\xi_n \ge 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ 與 $\xi_n \ge 0$。
- 同時不小於兩個數，最小只能取到兩個數裡較大的那個，就是上面的 max。

所以「對 $(b, \mathbf{w}, \boldsymbol{\xi})$ 一起最小化」可以分兩層做：內層先對 $\boldsymbol{\xi}$ 最小化，答案已經知道，代回去之後外層只剩 $(b, \mathbf{w})$，限制式也全部用掉了。講義把結果叫 soft-margin SVM 的 unconstrained form：

$$
\min_{b,\mathbf{w}} \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\max\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b),\ 0\big)
$$

課堂上的說法是：$\xi_n$ 不再是變數，它是由 $b$ 和 $\mathbf{w}$ 算出來的結果；最佳化的時候只要把 $b$ 和 $\mathbf{w}$ 動來動去，看哪一組最好。

### 和基石的 L2 正則化擺在一起

第 4 頁在這個式子旁邊問了一句 familiar?，然後把兩個式子並排：

$$
\underbrace{\min \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum \widehat{\mathrm{err}}}_{\text{soft-margin SVM}} \qquad\qquad \underbrace{\min \ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum \mathrm{err}}_{\text{L2 regularization}}
$$

右邊是基石第 14 堂的 augmented error：一項管 $\mathbf{w}$ 的長度，一項管誤差。左邊的結構完全一樣。講義列了三個差別：with shorter $\mathbf{w}$, another parameter, and special err。

- **比較短的 $\mathbf{w}$**：課堂上解釋，SVM 把 $w_0$ 獨立出來寫成 $b$，所以被正則化的 $\mathbf{w}$ 少一個分量，$b$ 不受罰。
- **另一個參數**：用 $C$，不用 $\lambda$。
- **特別的誤差**：$\widehat{\mathrm{err}}$ 是剛才那個 max。帽子表示它是演算法用的替代誤差，「hinge 誤差和邏輯迴歸的誤差有多像」那一節會仔細看它。

兩個參數怎麼換算？講義只在這一節 Fun Time 的解答裡給出結論，換算的過程是本文補的。把右邊整個式子乘上正數 $\frac{N}{2\lambda}$，最小值的位置不變：

$$
\frac{N}{2\lambda}\Big(\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum \mathrm{err}\Big) = \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \frac{1}{2\lambda}\sum \mathrm{err}
$$

和左邊逐項對照，$C$ 對應 $\frac{1}{2\lambda}$。$C$ 愈大，$\lambda$ 愈小，正則化愈弱。這也符合上一堂對 $C$ 的理解：$C$ 大表示比較在意違反量，寧可邊界窄一點（$\mathbf{w}$ 長一點）。

### 為什麼前幾堂不直接解這個形式

既然 SVM 就是正則化模型，為什麼不一開始就這樣介紹？第 4 頁下方給了兩個理由：

- **not QP, no (?) kernel trick**：課堂上說，這個新問題乍看沒有限制式，但它也不是「二次的目標函數配一次的限制式」，所有東西都塞進要最小化的式子裡。它不是二次規劃，之前為 QP 推導的對偶與 kernel 就沒那麼容易用上。
- **$\max(\cdot, 0)$ not differentiable, harder to solve**：兩個數取 max 的函數有不能微分的點，直接拿來做最佳化不容易。

所以課堂上交代，前幾堂是順著二次規劃這條路，從 hard-margin 一路推過來的。本文補充：講義在 kernel trick 前面打了一個問號，這個問號要到「在 Z 空間直接做邏輯迴歸：representer theorem」那一節才有答案，那裡會證明任何 L2 正則化的線性模型都能用 kernel。

### SVM 在正則化模型裡的位置

第 5 頁的表把四個模型排在一起：

| 模型 | 最小化 | 限制式 |
|---|---|---|
| 以限制式做正則化 | $E_{\text{in}}$ | $\mathbf{w}^\top\mathbf{w} \le C$ |
| hard-margin SVM | $\mathbf{w}^\top\mathbf{w}$ | $E_{\text{in}} = 0$ [and more] |
| L2 正則化 | $\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + E_{\text{in}}$ | 無 |
| soft-margin SVM | $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + CN\widehat{E}_{\text{in}}$ | 無 |

前兩列是「一個當目標、一個當限制」，而且兩者把角色對調了：第一列在長度受限的 $\mathbf{w}$ 裡找最小的 $E_{\text{in}}$；hard-margin SVM 在 $E_{\text{in}} = 0$ 的 $\mathbf{w}$ 裡找最短的。括號裡的 and more，課堂上只說它實際上加了更多的條件；本文補充：hard-margin 要的不只是分得開，還要每個點都滿足 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$。後兩列把限制式搬進目標函數，變成兩項相加。第四列的 $\widehat{E}_{\text{in}} = \frac{1}{N}\sum_n \widehat{\mathrm{err}}$，乘上 $N$ 就是誤差的總和。

講義從這張表讀出三句話：

- large margin ⟺ fewer hyperplanes ⟺ L2 regularization of short $\mathbf{w}$。要求邊界胖，可以選的超平面就少，這和要求 $\mathbf{w}$ 短是同一件事。
- soft margin ⟺ special $\widehat{\mathrm{err}}$。允許違反並且罰違反量，等於選了一種特別的誤差。
- larger $C$ or $C$ ⟺ smaller $\lambda$ ⟺ less regularization。這裡有兩個 $C$，投影片用不同顏色區分：第一列的 $C$ 是 $\mathbf{w}$ 長度的上限，第四列的 $C$ 是違反量的罰金。課堂上說，不管是哪一個 $C$，它變大都對應比較小的 $\lambda$。

為什麼要花一節換這個觀點？講義的回答是：把 SVM 看成正則化模型，就能把它延伸、連接到其他學習模型。課堂上講得更具體：接下來想把 SVM 延伸到邏輯迴歸與一般的迴歸問題，先看清楚這些關聯，延伸的時候才看得出該怎麼做。

### 數值例子：六個點、兩種 C

以下是本文自擬的例子，不在講義上。六個一維的點，不做特徵轉換（$z_n = x_n$），所以 $w$ 是一個數：

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $x_n$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
| $y_n$ | $-1$ | $-1$ | $+1$ | $-1$ | $+1$ | $+1$ |

左邊多半是負例、右邊多半是正例，但第 3、4 點的標籤「站錯邊」，任何一個門檻都分不乾淨。hard-margin SVM 在這組資料上沒有解，只能用 soft-margin。

**先體會 $\xi_n$ 是算出來的。** 隨便取 $(b, w) = (-\frac{1}{2}, 1)$，分數是 $s_n = x_n - \frac{1}{2}$。六個 $y_n s_n$ 依序是 $2.5, 1.5, -0.5, -0.5, 1.5, 2.5$，所以 $\xi_n = \max(1 - y_n s_n, 0)$ 依序是 $0, 0, 1.5, 1.5, 0, 0$。不需要解任何問題，代公式就有。$C = 1$ 時目標值是 $\frac{1}{2}(1)^2 + 1 \times 3 = 3.5$。

**再把最佳解找出來。** 這組資料有一個對稱性：把每個點 $(x, y)$ 換成 $(1 - x, -y)$，六個點會對回同一組資料（例如 $(-2, -1)$ 換成 $(3, +1)$）。對任何 $(b, w)$，把它換成 $(-w - b, w)$，在鏡射後的點上會得到同樣的 $y s$，所以兩者的目標值相同。目標函數是凸的（$\frac{1}{2}w^2$ 是凸函數，每個 max 是兩個一次函數取大，也是凸的），兩組一樣好的解取平均不會變差，而平均是 $(-\frac{w}{2}, w)$。因此只要考慮 $b = -\frac{w}{2}$，也就是邊界在 $x = \frac{1}{2}$ 的分類器。這時 $y_n s_n$ 依序是 $2.5w, 1.5w, -0.5w, -0.5w, 1.5w, 2.5w$，問題剩一個變數（$w < 0$ 時外側四個點全部違反，六個違反量的總和超過 6，目標值比 $w = 0$ 還大，不必考慮）：

$$
f(w) = \frac{1}{2}w^2 + 2C\Big[\max(1 - 2.5w,\ 0) + \max(1 - 1.5w,\ 0) + (1 + 0.5w)\Big], \qquad w \ge 0
$$

兩個 max 分別在 $w = 0.4$ 與 $w = \frac{2}{3}$ 轉折，分三段看：

| $w$ 的範圍 | $f(w)$ | $f'(w)$ |
|---|---|---|
| $0 \le w \le 0.4$ | $\frac{1}{2}w^2 + 2C(3 - 3.5w)$ | $w - 7C$ |
| $0.4 \le w \le \frac{2}{3}$ | $\frac{1}{2}w^2 + 2C(2 - w)$ | $w - 2C$ |
| $w \ge \frac{2}{3}$ | $\frac{1}{2}w^2 + 2C(1 + 0.5w)$ | $w + C$ |

- **$C = 1$**：前兩段的斜率 $w - 7$、$w - 2$ 都是負的，第三段的斜率是正的，最低點在轉折處 $w = \frac{2}{3}$，$b = -\frac{1}{3}$，$f = \frac{2}{9} + \frac{8}{3} = \frac{26}{9} \approx 2.889$。
- **$C = 0.1$**：第一段的斜率 $w - 0.7$ 是負的，第二段的斜率 $w - 0.2$ 在 $w \ge 0.4$ 時是正的，最低點在轉折處 $w = 0.4$，$b = -0.2$，$f = 0.08 + 0.32 = 0.4$。

兩個最佳解都落在不能微分的轉折點上，那裡的導數不存在，「令導數為 0」這招用不上，這就是講義說 harder to solve 的地方。$C = 1$ 的解逐點列出來：

| $n$ | $x_n$ | $y_n$ | $s_n = \frac{2}{3}x_n - \frac{1}{3}$ | $y_n s_n$ | $\xi_n$ |
|---|---|---|---|---|---|
| 1 | $-2$ | $-1$ | $-\frac{5}{3}$ | $\frac{5}{3}$ | $0$ |
| 2 | $-1$ | $-1$ | $-1$ | $1$ | $0$ |
| 3 | $0$ | $+1$ | $-\frac{1}{3}$ | $-\frac{1}{3}$ | $\frac{4}{3}$ |
| 4 | $1$ | $-1$ | $\frac{1}{3}$ | $-\frac{1}{3}$ | $\frac{4}{3}$ |
| 5 | $2$ | $+1$ | $1$ | $1$ | $0$ |
| 6 | $3$ | $+1$ | $\frac{5}{3}$ | $\frac{5}{3}$ | $0$ |

第 2、5 點剛好在胖邊界上，第 3、4 點違反，第 1、6 點在邊界外。幾組 $(b, w)$ 的目標值放在一起比：

| $(b, w)$ | $\sum_n \xi_n$ | $C = 1$ 的目標值 | $C = 0.1$ 的目標值 |
|---|---|---|---|
| $(0, 0)$ | $6$ | $6$ | $0.6$ |
| $(-0.2, 0.4)$ | $3.2$ | $3.28$ | $0.4$（最小） |
| $(-\frac{1}{3}, \frac{2}{3})$ | $\frac{8}{3}$ | $2.889$（最小） | $0.489$ |
| $(-\frac{1}{2}, 1)$ | $3$ | $3.5$ | $0.8$ |
| $(-1, 2)$ | $4$ | $6$ | $2.4$ |

**這個結果代表什麼。** $C = 1$ 對應 $\lambda = \frac{1}{2C} = 0.5$，解是 $w = \frac{2}{3}$，胖邊界的半寬是 $\frac{1}{w} = 1.5$，從 $x = -1$ 到 $x = 2$。$C = 0.1$ 對應 $\lambda = 5$，正則化強了十倍，解變成 $w = 0.4$，$w$ 比較短，半寬 $2.5$，從 $x = -2$ 到 $x = 3$，違反量的總和從 $\frac{8}{3}$ 增加到 $3.2$。$C$ 小就是 $\lambda$ 大，寧可多違反一點，也要 $w$ 短。本文另外用數值最佳化（SciPy 的 SLSQP）解原本帶 $\xi_n$ 與限制式的問題，也在 $(b, w)$ 平面上對無限制形式做格點搜尋，兩種做法得到的都是上面這組解。

### Fun Time：C 變大代表什麼

**題目（第 6 頁）：** 把 soft-margin SVM 看成正則化模型時，比較大的 $C$ 對應到

1. 比較大的 $\lambda$，也就是比較強的正則化
2. 比較小的 $\lambda$，也就是比較強的正則化
3. 比較大的 $\lambda$，也就是比較弱的正則化
4. 比較小的 $\lambda$，也就是比較弱的正則化

**答案：4。** 講義的解答是比較第 4 頁的兩個式子，$C$ 對應 $\frac{1}{2\lambda}$；推導就是前面「乘上 $\frac{N}{2\lambda}$」那一步。$C$ 和 $\lambda$ 成反比，$C$ 大則 $\lambda$ 小；$\lambda$ 乘在 $\mathbf{w}^\top\mathbf{w}$ 前面，小的 $\lambda$ 對長的 $\mathbf{w}$ 罰得輕，正則化弱。選項 1、3 把 $C$ 與 $\lambda$ 的方向弄反；選項 2 方向對了，但把小的 $\lambda$ 說成強的正則化。上面的例子就是實例：$C$ 從 $0.1$ 升到 $1$，$\lambda$ 從 $5$ 降到 $0.5$，$w$ 從 $0.4$ 變長到 $\frac{2}{3}$。

## hinge 誤差和邏輯迴歸的誤差有多像

```youtube
url: https://www.youtube.com/watch?v=5K44AgZvcDk
title: Kernel Logistic Regression :: SVM versus Logistic Regression @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:15 畫出 SVM 的誤差，03:15–06:33 和邏輯迴歸的誤差比較，06:33–08:34 是三種線性分類模型，08:34–09:32 提出反方向的問題，之後是 Fun Time。）

### SVM 用的誤差：hinge

無限制形式裡的 $\widehat{\mathrm{err}}$ 只跟 $y$ 乘上分數有關。第 7 頁照[基石第 11 堂：線性分類模型](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)的做法，令分數 $s = \mathbf{w}^\top\mathbf{z}_n + b$，以 $ys$ 為橫軸、誤差為縱軸，把誤差畫出來比：

$$
\mathrm{err}_{0/1}(s, y) = \llbracket ys \le 0 \rrbracket, \qquad \widehat{\mathrm{err}}_{\text{SVM}}(s, y) = \max(1 - ys,\ 0)
$$

圖上 0/1 誤差是階梯：$ys \le 0$ 時是 1，$ys > 0$ 時是 0。SVM 的誤差是兩段直線：$ys < 1$ 時是斜率 $-1$ 的直線 $1 - ys$，$ys \ge 1$ 時貼在 0。課堂上舉了兩個數字：$ys = 0.4$ 時還差 $0.6$ 才到 1，違反量記 $0.6$；$ys = -10$ 時記 $11$。

講義說 $\widehat{\mathrm{err}}_{\text{SVM}}$ 是 $\mathrm{err}_{0/1}$ 的上界，分兩種情形就能確認：

- $ys \le 0$：$1 - ys \ge 1$，hinge 至少是 1，而 0/1 誤差是 1。
- $ys > 0$：max 的結果不會是負的，hinge 至少是 0，而 0/1 誤差是 0。

這個誤差通常叫 hinge error measure。課堂上說它看起來很像把兩片門連起來的那種東西（hinge 這個字是鉸鏈的意思）。講義還強調它是凸的上界（convex upper bound）。本文補充理由：$1 - ys$ 與 $0$ 都是 $ys$ 的一次函數，兩個一次函數取大的結果是凸函數。課堂上說，凸讓它在最佳化上有好的性質可用。

講義把 $\widehat{\mathrm{err}}_{\text{SVM}}$ 稱為 algorithmic error measure，是演算法為了好解而用的誤差。課堂上回顧基石的做法：有了 0/1 誤差的上界，就可以把上界做小，間接把 0/1 誤差做好。SVM 做的也是這件事。

### 邏輯迴歸的誤差是另一個上界

第 8 頁把邏輯迴歸的誤差加進同一張圖。基石用的 cross-entropy 誤差是 $\ln(1 + \exp(-ys))$，這裡用的是換成以 2 為底的版本，講義叫 scaled cross-entropy：

$$
\mathrm{err}_{\text{SCE}}(s, y) = \log_2\big(1 + \exp(-ys)\big)
$$

課堂上只說這是技術細節，要小心換底。本文補上原因：$ys = 0$ 時 $\ln(1 + e^0) = \ln 2 \approx 0.693$，比 0/1 誤差的 1 小，自然對數的版本在那附近不是上界。除以 $\ln 2$ 之後，$ys = 0$ 的值剛好是 1。確認它是上界：

- $ys \le 0$：$\exp(-ys) \ge 1$，所以 $\log_2(1 + \exp(-ys)) \ge \log_2 2 = 1$。
- $ys > 0$：$1 + \exp(-ys) > 1$，對數是正的，大於 0。

圖上它是一條平滑的曲線，蓋在階梯上方。

### 兩端的行為

講義在圖下方列了一張小表，比較 $ys$ 往兩端走時的行為：

| | $ys \to -\infty$ | $ys \to +\infty$ |
|---|---|---|
| $\widehat{\mathrm{err}}_{\text{SVM}}(s, y)$ | $\approx -ys$ | $= 0$ |
| $(\ln 2)\cdot\mathrm{err}_{\text{SCE}}(s, y)$ | $\approx -ys$ | $\approx 0$ |

第二列乘上 $\ln 2$ 是把底換回自然對數，$(\ln 2)\cdot\mathrm{err}_{\text{SCE}} = \ln(1 + \exp(-ys))$。四格各自的理由：

- hinge、$ys \to +\infty$：$ys \ge 1$ 之後就是 0，是等號。
- hinge、$ys \to -\infty$：值是 $1 - ys$。課堂上的說法是 $-ys$ 很大的時候，那個 1 微不足道。
- cross-entropy、$ys \to +\infty$：$\exp(-ys) \to 0$，$\ln(1 + 0) = 0$，是趨近，不會真的到 0。
- cross-entropy、$ys \to -\infty$：令 $t = -ys$，$t$ 很大。$\ln(1 + e^{t}) = \ln\big(e^{t}(1 + e^{-t})\big) = t + \ln(1 + e^{-t})$，後面那一項趨近 0，所以整個約等於 $t = -ys$。課堂上的講法是 log 和 exponential 幾乎可以合在一起，因為那個 1 變得微不足道。

兩個誤差在錯得很離譜的那一端都隨 $-ys$ 線性成長，在對得很有把握的那一端都（幾乎）是 0，差別集中在中間。講義於是下結論：

$$
\text{SVM} \approx \text{L2-regularized logistic regression}
$$

課堂上把這句話拆成兩半：SVM 的目標函數裡有 $\mathbf{w}$ 長度那一項，所以它像 L2 正則化；它用的誤差又和邏輯迴歸的很接近。

### 數值例子：三種誤差並排

下表是本文算的。最後一欄是自然對數的版本，用來對照上面那張小表。

| $ys$ | $\mathrm{err}_{0/1}$ | hinge | $\mathrm{err}_{\text{SCE}}$ | $\ln(1 + e^{-ys})$ |
|---|---|---|---|---|
| $-3$ | $1$ | $4$ | $4.398$ | $3.049$ |
| $-1$ | $1$ | $2$ | $1.895$ | $1.313$ |
| $-\frac{1}{3}$ | $1$ | $1.333$ | $1.260$ | $0.874$ |
| $0$ | $1$ | $1$ | $1$ | $0.693$ |
| $0.5$ | $0$ | $0.5$ | $0.684$ | $0.474$ |
| $1$ | $0$ | $0$ | $0.452$ | $0.313$ |
| $\frac{5}{3}$ | $0$ | $0$ | $0.250$ | $0.173$ |
| $3$ | $0$ | $0$ | $0.070$ | $0.049$ |

每一列的 hinge 與 $\mathrm{err}_{\text{SCE}}$ 都不小於 0/1 誤差。最後一欄在 $ys = 0$ 與 $ys = -\frac{1}{3}$ 小於 1，不是上界，換底就是為了修這個。$ys = -3$ 時最後一欄是 $3.049$，已經很接近 $-ys = 3$；$ys = 3$ 時是 $0.049$，接近 0。兩個誤差最大的差別在 $ys \ge 1$ 之後：hinge 完全是 0，cross-entropy 還留著一點正的值。這個差別到「代價：β 通常都不是 0」會變成「係數是不是 0」的差別。

套到那六個點、$C = 1$ 的 SVM 解上（$y_n s_n$ 是 $\frac{5}{3}, 1, -\frac{1}{3}, -\frac{1}{3}, 1, \frac{5}{3}$）：0/1 誤差的總和是 2（第 3、4 點分錯），hinge 的總和是 $\frac{8}{3} \approx 2.667$，$\mathrm{err}_{\text{SCE}}$ 的總和是 $3.924$。兩個上界都比 2 大。

再直接驗證「正則化邏輯迴歸 ≈ SVM」。把無限制形式裡的 hinge 換成 $\ln(1 + \exp(-ys))$，其他不動，$C$ 仍取 1：

$$
\min_{b, w} \ \frac{1}{2}w^2 + \sum_{n=1}^{6}\ln\big(1 + \exp(-y_n(w x_n + b))\big)
$$

這個問題處處可微，本文用數值方法（BFGS）解，得到 $w \approx 0.767$、$b \approx -0.384$，邊界在 $x = 0.5$。SVM 的解是 $w = \frac{2}{3} \approx 0.667$、$b = -\frac{1}{3}$，邊界同樣在 $x = 0.5$。兩者的方向與邊界位置一樣，$w$ 的大小差了大約 15%。在這個例子上，兩個模型給的分類器確實很接近，但不是同一個。

### 三種線性分類模型

第 9 頁把到目前為止能做二元分類的線性模型排在一起：

| | PLA | soft-margin SVM | 用於分類的正則化邏輯迴歸 |
|---|---|---|---|
| 做法 | 用特別的方式最小化 $\mathrm{err}_{0/1}$ | 用 QP 最小化正則化的 $\widehat{\mathrm{err}}_{\text{SVM}}$ | 用 GD、SGD 等最小化正則化的 $\mathrm{err}_{\text{SCE}}$ |
| 優點 | 線性可分時有效率 | 最佳化「容易」，有理論保證 | 最佳化「容易」，有正則化保護 |
| 缺點 | 只在線性可分時有用，否則要 pocket | $ys$ 很負時，是 $\mathrm{err}_{0/1}$ 很鬆的上界 | $ys$ 很負時，是 $\mathrm{err}_{0/1}$ 很鬆的上界 |

課堂上逐欄的說法：PLA 直接攻擊 0/1 誤差，但只有線性可分時好做。邏輯迴歸的函數平滑，最佳化相對容易，加上 L2 正則化之後在模型複雜度上有一些保護。SVM 的理論保證來自它是從胖邊界推導出來的。後兩者的共同缺點是，最佳化的對象只是 0/1 誤差的上界。「很鬆」從前面的表看得出來：$ys = -3$ 的點在 0/1 誤差下只算錯 1，在 hinge 下算 4，一個錯得很離譜的點會被罰得很重。

頁尾有兩行。第一行是 regularized LogReg ⟹ approximate SVM：解了正則化邏輯迴歸，就幾乎解了 SVM。第二行反過來，後面帶一個問號：SVM ⟹ approximate LogReg (?)。課堂上說這是要顛覆大家想法的地方：邏輯迴歸原本要的是機率，不是圈圈叉叉。解完 SVM 得到的東西，能不能也當成每個點是圈圈的機率的某種衡量？「讓 SVM 輸出機率」那一節回答。

### Fun Time：上界什麼時候是緊的

**題目（第 10 頁）：** 我們知道 $\widehat{\mathrm{err}}_{\text{SVM}}(s, y)$ 是 $\mathrm{err}_{0/1}(s, y)$ 的上界。這個上界什麼時候是緊的，也就是什麼時候 $\widehat{\mathrm{err}}_{\text{SVM}}(s, y) = \mathrm{err}_{0/1}(s, y)$？

1. $ys \ge 0$
2. $ys \le 0$
3. $ys \ge 1$
4. $ys \le 1$

**答案：3。** 講義的解答說看圖就知道，兩者相等的充要條件是 $ys \ge 1$，這時兩個都是 0；課堂上的說法是那一段兩條線疊在一起。逐段檢查：

- $ys \ge 1$：0/1 誤差是 0，hinge 是 $\max(1 - ys, 0) = 0$，相等。
- $0 < ys < 1$：0/1 誤差是 0，hinge 是 $1 - ys > 0$，不相等。選項 1 與選項 4 都包含這一段，所以不對。
- $ys < 0$：0/1 誤差是 1，hinge 是 $1 - ys > 1$，不相等。選項 2 與選項 4 都包含這一段，所以不對。

本文補充一個小地方：照第 7 頁的定義 $\mathrm{err}_{0/1} = \llbracket ys \le 0 \rrbracket$，$ys$ 剛好等於 0 時 0/1 誤差是 1，hinge 是 $\max(1 - 0, 0) = 1$，所以除了 $ys \ge 1$ 這一段之外，兩者在 $ys = 0$ 這個孤立的點上也相等（第 7 頁的圖上，hinge 的斜線剛好通過階梯在 $ys = 0$、高度 1 的轉角）。這不影響選擇題的答案：四個選項裡只有選項 3 描述的範圍內處處相等。

## 讓 SVM 輸出機率：先跑 SVM，再學兩個數字

```youtube
url: https://www.youtube.com/watch?v=pNfvZYH5iFg
title: Kernel Logistic Regression :: SVM for Soft Binary @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:30 是兩個直覺做法，02:30–06:15 是兩層學習的模型，06:15–08:14 是 Platt 的三個步驟，08:14–08:59 說明這只是近似解，之後是 Fun Time。）

### 兩個直覺做法各缺一邊

soft binary classification 要的是 0 到 1 之間的機率值。第 11 頁先列兩個簡單的想法。

**Naïve Idea 1。** 跑 SVM 得到 $(b_{\text{SVM}}, \mathbf{w}_{\text{SVM}})$，直接套上基石第 10 堂的 logistic 函數 $\theta(s) = \frac{1}{1 + e^{-s}}$，回傳

$$
g(\mathbf{x}) = \theta\big(\mathbf{w}_{\text{SVM}}^\top\mathbf{x} + b_{\text{SVM}}\big)
$$

講義的評語是：直接利用兩個模型的相似性，效果還可以（works reasonably well），但是 no LogReg flavor。課堂上說這個做法實務上通常表現還不錯，缺點是邏輯迴歸原本推導的 maximum likelihood 幾乎都沒用上。

**Naïve Idea 2。** 跑 SVM，把 $(b_{\text{SVM}}, \mathbf{w}_{\text{SVM}})$ 當成邏輯迴歸的起點 $\mathbf{w}_0$，再跑邏輯迴歸，回傳邏輯迴歸的解。講義的評語是：並沒有比原本的邏輯迴歸「容易」，而且 SVM flavor (kernel?) lost。課堂上的解釋是，邏輯迴歸是凸的問題，通常有唯一的解，從哪裡出發，最後得到的解都差不多，那就和完全不用 SVM、直接跑邏輯迴歸一樣；想用 kernel SVM 的非線性能力，這個做法也接不上。

講義的結論：want flavors from both sides。

### 兩層學習：SVM 定方向，邏輯迴歸調刻度

第 12 頁提出的模型是

$$
g(\mathbf{x}) = \theta\Big(A\cdot\big(\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}) + b_{\text{SVM}}\big) + B\Big)
$$

括號裡是 SVM 算出來的分數。課堂上的說法是，在這個分數上多給兩個自由度：$A$ 是放縮，$B$ 是平移。

- **SVM flavor**：超平面的方向由 $\mathbf{w}_{\text{SVM}}$ 固定，所以 kernel 可以照用。課堂上從幾何講：SVM 找出分隔線的法向量，法向量不動。對偶、kernel 這些 SVM 的工具全都能用，因為第一步就是原封不動的 SVM。
- **LogReg flavor**：用 $A$ 與 $B$ 微調，讓結果符合 maximum likelihood。

講義附了兩個預期：$\mathbf{w}_{\text{SVM}}$ 夠好的話，通常 $A > 0$；$b_{\text{SVM}}$ 夠好的話，通常 $B \approx 0$。課堂上解釋：$A$ 小於 0 代表方向反過來，那表示 SVM 一開始就在亂做；$B$ 會很接近 0，但不見得剛好是 0，因為有自由度可以調整。

$A$ 與 $B$ 怎麼學？把基石第 10 堂的 cross-entropy 誤差套上去，$\mathbf{w}_{\text{SVM}}$ 與 $b_{\text{SVM}}$ 已經是固定的數：

$$
\min_{A, B} \ \frac{1}{N}\sum_{n=1}^{N}\log\bigg(1 + \exp\Big(-y_n\big(A\cdot\underbrace{(\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}_n) + b_{\text{SVM}})}_{\Phi_{\text{SVM}}(\mathbf{x}_n)} + B\big)\Big)\bigg)
$$

講義在分數底下標了 $\Phi_{\text{SVM}}(\mathbf{x}_n)$。課堂上換一個高度看：這個分數可以當成 SVM 告訴你的一個特別的轉換，把多維的 $\mathbf{x}$ 轉成一個數字。第二階段解的只是一個一維資料、兩個變數的邏輯迴歸。講義把整件事稱為 two-level learning：LogReg on SVM-transformed data。

### Platt 的機率化 SVM

第 13 頁把它寫成三步，標題是 Platt's Model of Probabilistic SVM for Soft Binary Classification。課堂上說，這個方法是一位叫 John Platt 的人提出的，所以一般叫 Platt 的模型，在 SVM 領域非常常用。

1. 在 $\mathcal{D}$ 上跑 SVM，得到 $(b_{\text{SVM}}, \mathbf{w}_{\text{SVM}})$ 或等價的 $\boldsymbol{\alpha}$，把每個點轉換成 $z'_n = \mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}_n) + b_{\text{SVM}}$。
2. 在 $\{(z'_n, y_n)\}_{n=1}^{N}$ 上跑邏輯迴歸，得到 $(A, B)$。
3. 回傳 $g(\mathbf{x}) = \theta\big(A\cdot(\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}) + b_{\text{SVM}}) + B\big)$。

講義在前兩步各加了一行灰字：實際的模型做第 1 步的方式比較複雜；實際的模型在第 2 步加了特別的正則化。課堂上沒有展開細節，只說加一點正則化是為了讓這個問題比較不容易過擬合，並提到 LIBSVM 這類套件裡有這個方法。

這一頁還有兩個重點：

- **機率化 SVM 的邊界不一定和原本的 SVM 一樣，原因是 $B$。** $g(\mathbf{x}) = \frac{1}{2}$ 發生在 $A\cdot(\text{分數}) + B = 0$，也就是分數等於 $-\frac{B}{A}$ 的地方；SVM 的邊界在分數等於 0 的地方。$B \ne 0$ 時兩者就錯開了。課堂上說，平移之後不一定和 SVM 一樣，但可能比較符合 maximum likelihood 的要求。
- **第 2 步怎麼解：GD、SGD，或更好的方法，因為只有兩個變數。** 課堂上說甚至可以用更簡單的方法。

頁尾留下這一節的定位與接下來要回答的問題：kernel SVM ⟹ approx. LogReg in $\mathcal{Z}$-space；exact LogReg in $\mathcal{Z}$-space? 課堂上說得很清楚：這樣做沒有真的在 Z 空間裡解邏輯迴歸，只是靠 SVM 加上 $A$、$B$ 的微調找到一個還不錯的解，它不是 Z 空間裡最好的邏輯迴歸解。

### 數值例子：替六個點的 SVM 分數配上 A 與 B

以下是本文自擬的例子。沿用前面 $C = 1$ 的 SVM 解 $w_{\text{SVM}} = \frac{2}{3}$、$b_{\text{SVM}} = -\frac{1}{3}$。

**第一步：轉換。** $z'_n = \frac{2}{3}x_n - \frac{1}{3}$，六個值是 $-\frac{5}{3}, -1, -\frac{1}{3}, \frac{1}{3}, 1, \frac{5}{3}$，標籤仍是 $-1, -1, +1, -1, +1, +1$。

**第二步：兩個變數的邏輯迴歸。** 要最小化 $E(A, B) = \frac{1}{6}\sum_n \ln(1 + \exp(-y_n(A z'_n + B)))$。對 $u$ 微分 $\ln(1 + e^{-yu})$ 得到 $-y\,\theta(-yu)$，再用連鎖律：

$$
\frac{\partial E}{\partial A} = \frac{1}{N}\sum_{n=1}^{N}\theta\big(-y_n(A z'_n + B)\big)\,(-y_n z'_n), \qquad \frac{\partial E}{\partial B} = \frac{1}{N}\sum_{n=1}^{N}\theta\big(-y_n(A z'_n + B)\big)\,(-y_n)
$$

這和基石第 10 堂的梯度是同一個式子，只是「特徵」換成 $(z'_n, 1)$。從 Naïve Idea 1 的位置 $(A, B) = (1, 0)$ 出發做梯度下降。第一步的六個 $\theta(-y_n z'_n)$ 是 $0.159, 0.269, 0.583, 0.583, 0.269, 0.159$，對應的 $-y_n z'_n$ 是 $-\frac{5}{3}, -1, \frac{1}{3}, \frac{1}{3}, -1, -\frac{5}{3}$，所以

$$
\frac{\partial E}{\partial A} = \frac{1}{6}\cdot 2\big(0.159\cdot(-\tfrac{5}{3}) + 0.269\cdot(-1) + 0.583\cdot\tfrac{1}{3}\big) \approx -0.113
$$

而 $\frac{\partial E}{\partial B}$ 裡的六項兩兩抵消（第 1 與第 6 點的 $\theta$ 相同、$-y_n$ 反號，其餘兩對也是），等於 0。學習率取 1，$A$ 從 $1$ 走到 $1.113$，$B$ 留在 0。照這樣總共走 116 步之後，兩個偏微分的絕對值都小於 $10^{-6}$，停在

$$
A \approx 1.821, \qquad B = 0
$$

$B$ 剛好是 0 是因為這組資料對稱，一般不會這麼整齊。$A > 0$、$B \approx 0$，和講義的預期一致。

**第三步：輸出機率。**

| $x_n$ | $y_n$ | SVM 分數 $z'_n$ | Naïve Idea 1：$\theta(z'_n)$ | 機率化 SVM：$\theta(1.821\,z'_n)$ |
|---|---|---|---|---|
| $-2$ | $-1$ | $-1.667$ | $0.159$ | $0.046$ |
| $-1$ | $-1$ | $-1$ | $0.269$ | $0.139$ |
| $0$ | $+1$ | $-0.333$ | $0.417$ | $0.353$ |
| $1$ | $-1$ | $0.333$ | $0.583$ | $0.647$ |
| $2$ | $+1$ | $1$ | $0.731$ | $0.861$ |
| $3$ | $+1$ | $1.667$ | $0.841$ | $0.954$ |

**這個結果代表什麼。** 兩個做法的排序和邊界都一樣，差在刻度。Naïve Idea 1 對最左邊的點只敢說「是正例的機率 0.159」，機率化 SVM 說 0.046。平均的 cross-entropy 誤差從 $0.453$（$A = 1$）降到 $0.413$（$A = 1.821$），後者比較符合 maximum likelihood。本文的解讀：SVM 分數的刻度是由「胖邊界上的點分數剛好是 ±1」決定的，這個刻度和機率沒有關係，所以需要 $A$ 重新調整。

這個例子的資料只有一維，$A z'_n + B$ 已經涵蓋所有 $x$ 的一次函數，第二階段其實等於直接對 $x$ 做沒有正則化的邏輯迴歸。資料是多維的時候，$\mathbf{w}_{\text{SVM}}$ 的方向固定不動，只剩兩個數字可以調，兩層學習和完整的邏輯迴歸才會不同。

**$B$ 不是 0 的情況。** 加第七個點 $(x, y) = (4, +1)$。它的 $y s = \frac{2}{3}\cdot 4 - \frac{1}{3} = \frac{7}{3} \ge 1$，hinge 誤差是 0。新的目標函數等於舊的加上這一點的 hinge，處處不小於舊的，而在舊的最佳解上兩者相等，所以 SVM 的解完全不變，邊界仍在 $x = 0.5$。邏輯迴歸那一步卻會變：對七個點重解，得到 $A \approx 1.876$、$B \approx 0.016$。機率 $\frac{1}{2}$ 的位置移到分數 $-\frac{B}{A} \approx -0.0085$，換回 $x$ 是 $0.487$，和 SVM 的邊界 $0.5$ 差了一點。$B$ 很接近 0 但不是 0，這就是講義說兩者邊界不一定相同的意思。它同時顯示兩種誤差的差別：邊界外的點對 hinge 沒有任何影響，對 cross-entropy 還是有一點影響。

### Fun Time：把 kernel 的分數代進去

**題目（第 14 頁）：** kernel SVM 的分數是 $\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}) + b_{\text{SVM}} = \sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}$。把 kernel SVM 和 $(A, B)$ 接起來做成機率化 SVM，得到的 $g(\mathbf{x})$ 是哪一個？

1. $\theta\big(\sum_{\text{SV}} B\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}\big)$
2. $\theta\big(\sum_{\text{SV}} B\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + Bb_{\text{SVM}} + A\big)$
3. $\theta\big(\sum_{\text{SV}} A\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}\big)$
4. $\theta\big(\sum_{\text{SV}} A\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + Ab_{\text{SVM}} + B\big)$

**答案：4。** 講義只說把分數的 kernel 寫法代進 $g(\mathbf{x})$。代入並把 $A$ 乘進去：

$$
A\cdot\Big(\sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}\Big) + B = \sum_{\text{SV}} A\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + Ab_{\text{SVM}} + B
$$

$A$ 要乘到整個分數上，包括 $b_{\text{SVM}}$；$B$ 加在最外面。選項 3 忘了把 $A$ 乘到 $b_{\text{SVM}}$，也沒有 $B$。選項 2 把 $A$ 與 $B$ 的角色對調。選項 1 兩種錯都犯。這題也說明預測時不需要 $\mathbf{w}_{\text{SVM}}$ 本身：只要支援向量的 $\alpha_n$、kernel，以及 $A$、$B$、$b_{\text{SVM}}$ 三個數。

## 在 Z 空間直接做邏輯迴歸：representer theorem

```youtube
url: https://www.youtube.com/watch?v=AbaIkcQUQuo
title: Kernel Logistic Regression :: Kernel Logistic Regression @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:05 找出 kernel trick 的關鍵，03:05–08:23 是 representer theorem 與證明，08:23–10:57 推出 kernel 邏輯迴歸，10:57–13:49 是另一個看法，13:49–14:27 談係數不稀疏，之後是 Fun Time 與總結。）

### kernel trick 靠的是哪一件事

機率化 SVM 只是近似。課堂上接著機率化 SVM 結尾留下的問題：想真的在 Z 空間裡做邏輯迴歸，不要近似解。麻煩在於 SVM 的 kernel 是從 QP 的對偶問題來的，而邏輯迴歸的式子裡有 log、有 exponential，根本不是二次規劃，那條路走不通。

所以要回頭想 kernel trick 為什麼會成立。課堂上的分析是：kernel trick 把 Z 空間的內積換成能在 X 空間輕鬆算的函數；訓練時要算內積，預測時也要算 $\mathbf{w}$ 和 $\mathbf{z}$ 的內積。如果 $\mathbf{w}$ 可以寫成那些已經看過的 $\mathbf{z}_n$ 的線性組合，預測時的內積才換得成 kernel。第 15 頁把這件事寫成一行：

$$
\mathbf{w}_* = \sum_{n=1}^{N}\beta_n\mathbf{z}_n \quad\Longrightarrow\quad \mathbf{w}_*^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n\mathbf{z}_n^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})
$$

講義接著列了三個已經見過的例子，三者的 $\mathbf{w}$ 都寫成 $\sum_{n}(\alpha_n y_n)\mathbf{z}_n$：

| 模型 | $\alpha_n$ 從哪裡來 |
|---|---|
| SVM | 對偶問題的解 |
| PLA | 第 $n$ 筆資料被拿來修正錯誤的次數 |
| 用 SGD 解的邏輯迴歸 | 第 $n$ 筆資料累計的 SGD 移動量 |

第三個可以直接驗證（以下驗證是本文補的）。邏輯迴歸的 SGD 每次挑一筆資料，更新是 $\mathbf{w} \leftarrow \mathbf{w} + \eta\,\theta(-y_n\mathbf{w}^\top\mathbf{z}_n)\,(y_n\mathbf{z}_n)$。從 $\mathbf{w} = \mathbf{0}$ 出發，每一步都是加上某個正數乘以 $y_n\mathbf{z}_n$，所以不管走幾步，$\mathbf{w}$ 都是 $y_n\mathbf{z}_n$ 的線性組合，第 $n$ 筆的係數是它每次被挑到時那個 $\eta\,\theta(\cdot)$ 的總和。[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)已經把這個現象叫作 $\mathbf{w}$「由資料表示」（represented by data）。

三個例子都成立，但它們各有各的理由，而且後兩個說的是演算法跑出來的 $\mathbf{w}$。講義要問的是更一般的問題：最佳解 $\mathbf{w}_*$ 什麼時候一定能用 $\mathbf{z}_n$ 表示？

### representer theorem 與它的證明

第 16 頁的主張：對任何 L2 正則化的線性模型

$$
\min_{\mathbf{w}} \ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\mathrm{err}(y_n, \mathbf{w}^\top\mathbf{z}_n)
$$

最佳解都滿足 $\mathbf{w}_* = \sum_{n=1}^{N}\beta_n\mathbf{z}_n$。「線性模型」在這裡的意思，課堂上說是誤差只透過分數 $\mathbf{w}^\top\mathbf{z}_n$ 來算；err 是什麼函數都可以。課堂上說這個結果包山包海，基石講過的 ridge regression、L2 正則化的邏輯迴歸都在裡面。

證明用反證法，講義只有四行，下面把每一步補齊。

**第一步：把最佳解拆成兩部分。** 令 $\mathbf{w}_* = \mathbf{w}_{\parallel} + \mathbf{w}_{\perp}$，其中 $\mathbf{w}_{\parallel} \in \text{span}(\mathbf{z}_n)$，是 $\mathbf{z}_1, \dots, \mathbf{z}_N$ 的某個線性組合；$\mathbf{w}_{\perp} \perp \text{span}(\mathbf{z}_n)$，和每一個 $\mathbf{z}_n$ 都垂直。這是線性代數裡把向量投影到子空間的分解，任何向量都拆得出來。課堂上把 $\mathbf{w}_{\perp}$ 比喻成餘數：$\mathbf{z}_n$ 展得出來的部分拿掉之後剩下的東西。我們要證的是 $\mathbf{w}_{\perp} = \mathbf{0}$。

**第二步：假設 $\mathbf{w}_{\perp} \ne \mathbf{0}$，拿 $\mathbf{w}_{\parallel}$ 來和 $\mathbf{w}_*$ 比。**

誤差那一項，兩者一樣。對每個 $n$，

$$
\mathbf{w}_*^\top\mathbf{z}_n = (\mathbf{w}_{\parallel} + \mathbf{w}_{\perp})^\top\mathbf{z}_n = \mathbf{w}_{\parallel}^\top\mathbf{z}_n + \underbrace{\mathbf{w}_{\perp}^\top\mathbf{z}_n}_{=\,0} = \mathbf{w}_{\parallel}^\top\mathbf{z}_n
$$

$\mathbf{w}_{\perp}$ 和每個 $\mathbf{z}_n$ 垂直，內積是 0。分數一樣，$\mathrm{err}(y_n, \cdot)$ 就一樣，$N$ 項加起來也一樣。

正則化那一項，$\mathbf{w}_{\parallel}$ 比較小：

$$
\mathbf{w}_*^\top\mathbf{w}_* = \mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel} + 2\,\mathbf{w}_{\parallel}^\top\mathbf{w}_{\perp} + \mathbf{w}_{\perp}^\top\mathbf{w}_{\perp} > \mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel}
$$

交叉項是 0，因為 $\mathbf{w}_{\parallel}$ 是 $\mathbf{z}_n$ 的線性組合，而 $\mathbf{w}_{\perp}$ 和每個 $\mathbf{z}_n$ 垂直。$\mathbf{w}_{\perp}^\top\mathbf{w}_{\perp}$ 是 $\mathbf{w}_{\perp}$ 長度的平方，$\mathbf{w}_{\perp} \ne \mathbf{0}$ 時嚴格大於 0。

**第三步：矛盾。** $\mathbf{w}_{\parallel}$ 的誤差項和 $\mathbf{w}_*$ 一樣，正則化項嚴格比較小，整個目標值比 $\mathbf{w}_*$ 低。可是 $\mathbf{w}_*$ 是最佳解。投影片上 $\mathbf{w}_*$ 是黑色、$\mathbf{w}_{\parallel}$ 是紅色，課堂上說紅色的比黑色的還強，就像有人考得比第一名還高，可是不會有第 0 名。所以假設不成立，$\mathbf{w}_{\perp} = \mathbf{0}$，$\mathbf{w}_* = \mathbf{w}_{\parallel}$ 是 $\mathbf{z}_n$ 的線性組合。

課堂上說這個證明有點繞圈圈，重要的是結論。講義把結論寫在頁尾：any L2-regularized linear model can be kernelized!

本文補充三點，都是從證明裡讀出來的：

- 證明要 $\lambda > 0$。$\lambda = 0$ 時正則化項不見了，上面只能說明 $\mathbf{w}_{\parallel}$ 和 $\mathbf{w}_*$ 一樣好，推不出矛盾。
- 證明只用到兩件事：誤差只看 $\mathbf{w}^\top\mathbf{z}_n$，以及正則化項是 $\mathbf{w}^\top\mathbf{w}$。第二件事用在「長度的平方可以拆成兩個垂直分量各自的平方和」，這是 L2 才有的性質。
- 講義這一頁的分數沒有寫 $b$。如果另外加一個不受正則化的 $b$，分數是 $\mathbf{w}^\top\mathbf{z}_n + b$，把 $\mathbf{w}_*$ 換成 $\mathbf{w}_{\parallel}$ 時分數同樣不變，同一個證明仍然成立。

**小例子（本文自擬）。** Z 空間是二維，只有兩筆資料 $\mathbf{z}_1 = (1, 1)$、$\mathbf{z}_2 = (3, 3)$，它們只展得出 $(1, 1)$ 這個方向。取 $\mathbf{w} = (2, 0)$，拆成 $\mathbf{w}_{\parallel} = (1, 1)$ 與 $\mathbf{w}_{\perp} = (1, -1)$。分數：$\mathbf{w}^\top\mathbf{z}_1 = 2$、$\mathbf{w}^\top\mathbf{z}_2 = 6$；$\mathbf{w}_{\parallel}^\top\mathbf{z}_1 = 2$、$\mathbf{w}_{\parallel}^\top\mathbf{z}_2 = 6$，完全一樣，所以不管用哪一種 err，兩者的誤差都相同。長度的平方：$\mathbf{w}^\top\mathbf{w} = 4$，$\mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel} = 2$，少掉的 2 正是 $\mathbf{w}_{\perp}^\top\mathbf{w}_{\perp}$。$(2, 0)$ 不可能是最佳解，因為 $(1, 1)$ 永遠比它好。

### 套到邏輯迴歸：把 w 換成 β

第 17 頁把定理用在 L2 正則化的邏輯迴歸上：

$$
\min_{\mathbf{w}} \ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\log\Big(1 + \exp\big(-y_n\mathbf{w}^\top\mathbf{z}_n\big)\Big)
$$

最佳解一定是 $\mathbf{w}_* = \sum_n \beta_n\mathbf{z}_n$，所以講義說可以不失一般性地改成解最佳的 $\boldsymbol{\beta}$。課堂上的說法是：既然一定是這個形式，就不要去求那個長長的 $\mathbf{w}$，專心把線性組合的係數求出來。代入的兩個地方（為了和外層的 $n$ 區分，內層的加總改用 $m$）：

$$
\mathbf{w}^\top\mathbf{w} = \Big(\sum_{n=1}^{N}\beta_n\mathbf{z}_n\Big)^\top\Big(\sum_{m=1}^{N}\beta_m\mathbf{z}_m\Big) = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m\,\mathbf{z}_n^\top\mathbf{z}_m = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

$$
\mathbf{w}^\top\mathbf{z}_n = \Big(\sum_{m=1}^{N}\beta_m\mathbf{z}_m\Big)^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m\,\mathbf{z}_m^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m K(\mathbf{x}_m, \mathbf{x}_n)
$$

兩處的內積都換成 kernel，得到 kernel 邏輯迴歸（kernel logistic regression，KLR）：

$$
\min_{\boldsymbol{\beta}} \ \frac{\lambda}{N}\sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m) + \frac{1}{N}\sum_{n=1}^{N}\log\bigg(1 + \exp\Big(-y_n\sum_{m=1}^{N}\beta_m K(\mathbf{x}_m, \mathbf{x}_n)\Big)\bigg)
$$

變數是 $N$ 個 $\beta_n$。課堂上強調，這個數目和資料量一樣，跟 Z 空間的維度沒有關係了。怎麼解？講義寫 GD/SGD/... for unconstrained optimization：它沒有任何限制式，基石學過的方法都能用。課堂上對照了兩種求係數的方式：SVM 的 $\boldsymbol{\alpha}$ 是透過一個特別的對偶問題解出來的，KLR 的 $\boldsymbol{\beta}$ 是代進去之後直接做最佳化。預測時用第 15 頁那一行：

$$
g(\mathbf{x}) = \theta\Big(\sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})\Big)
$$

本文補上梯度下降需要的梯度。把 kernel 矩陣記成 $\mathrm{K}$（$\mathrm{K}_{nm} = K(\mathbf{x}_n, \mathbf{x}_m)$，對稱），第 $n$ 個點的分數是 $s_n = \sum_m \beta_m \mathrm{K}_{mn}$。對 $\beta_k$ 偏微分：

$$
\frac{\partial}{\partial\beta_k} = \frac{2\lambda}{N}\sum_{m=1}^{N}\mathrm{K}_{km}\beta_m - \frac{1}{N}\sum_{n=1}^{N}\mathrm{K}_{kn}\,y_n\,\theta(-y_n s_n) = \frac{1}{N}\sum_{n=1}^{N}\mathrm{K}_{kn}\Big(2\lambda\beta_n - y_n\,\theta(-y_n s_n)\Big)
$$

第一項來自二次式 $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ 的微分 $2\mathrm{K}\boldsymbol{\beta}$；第二項和「數值例子：替六個點的 SVM 分數配上 A 與 B」裡的微分一樣，多乘一個 $\frac{\partial s_n}{\partial\beta_k} = \mathrm{K}_{kn}$。

### 另一個看法：β 的線性模型

第 18 頁換一個角度讀同一個式子。課堂上的引子是：假如沒人告訴你前面繞去 Z 空間的那一大段，光看這個式子，你會看到什麼？

- $\sum_{m}\beta_m K(\mathbf{x}_m, \mathbf{x}_n)$ 是 $\boldsymbol{\beta}$ 和一個向量的內積，那個向量是 $\big(K(\mathbf{x}_1, \mathbf{x}_n), K(\mathbf{x}_2, \mathbf{x}_n), \dots, K(\mathbf{x}_N, \mathbf{x}_n)\big)$。也就是說，kernel 在做一個轉換：把 $\mathbf{x}_n$ 換成它和 $N$ 個訓練點各自的相似度（課堂上提醒 kernel 就是一種相似性）。$\boldsymbol{\beta}$ 扮演的是這個 $N$ 維空間裡權重 $\mathbf{w}$ 的角色。
- $\sum_n\sum_m \beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m) = \boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ 是一個特別的正則化項。課堂上說，以前習慣的正則化項是 $\boldsymbol{\beta}$ 和自己的內積，現在中間多了一個 $\mathrm{K}$。

所以 KLR 有兩種讀法，講義並列：

| | 是誰的線性模型 | 轉換 | 正則化項 |
|---|---|---|---|
| 讀法一 | $\boldsymbol{\beta}$ | kernel 本身當轉換 | kernel regularizer $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ |
| 讀法二 | $\mathbf{w}$ | 藏在 kernel 裡的轉換 $\boldsymbol{\Phi}$ | L2 regularizer $\mathbf{w}^\top\mathbf{w}$ |

講義補一句 similar for SVM。課堂上舉 Gaussian kernel 的 SVM 為例：它的結果是一堆 Gaussian 的線性組合，可以看成 Gaussian 這些轉換上的線性模型，也可以看成無限多維 Z 空間裡的線性模型。

### 代價：β 通常都不是 0

這一頁最後是一個警告框：unlike coefficients $\alpha_n$ in SVM, coefficients $\beta_n$ in KLR often non-zero! 課堂上解釋：SVM 的 $\alpha_n$，落在胖邊界外的點都是 0，只有支援向量不是 0；KLR 解出來的 $\beta_n$ 大部分都不是 0。在解有沒有很多 0（sparsity）這一點上，兩者很不一樣。總結時課堂上把它稱為代價：很多 $\beta_n$ 不是 0，計算上就要多付出。本文補充這個代價落在哪裡：預測一個新的點時，每個 $\beta_n \ne 0$ 的訓練點都要算一次 kernel。

講義沒有說為什麼，本文用上面的梯度補一個解釋。最佳解的梯度是 0。$\mathrm{K}$ 可逆的時候（例如資料點兩兩不同的 Gaussian kernel），梯度為 0 逼得括號裡每一項都是 0：

$$
\beta_n = \frac{1}{2\lambda}\,y_n\,\theta(-y_n s_n)
$$

$\theta$ 的值永遠在 0 與 1 之間，不會剛好是 0，所以每個 $\beta_n$ 都不是 0。$y_n s_n$ 很大的點（分得很對的點）$\theta(-y_n s_n)$ 很小，$\beta_n$ 接近 0 但不是 0。這正是「數值例子：三種誤差並排」那張表上看到的差別：cross-entropy 在 $ys \ge 1$ 之後仍是正的、仍有斜率，每個點都還在出力；hinge 在 $ys > 1$ 之後是平的，那些點對解沒有影響，$\alpha_n$ 是 0。

### 數值例子：六個點的 kernel 邏輯迴歸

以下是本文自擬的例子。同樣的六個點，kernel 用技法第 3 堂的 Gaussian kernel，取 $\gamma = 1$：$K(x, x') = \exp(-(x - x')^2)$。$\lambda = 0.5$，對應前面的 $C = 1$。

**kernel 矩陣。** 相距 1 的點是 $e^{-1} \approx 0.368$，相距 2 的是 $e^{-4} \approx 0.018$，相距 3 的是 $e^{-9} \approx 0.0001$，更遠的四捨五入後是 0：

$$
\mathrm{K} \approx \begin{bmatrix} 1 & 0.368 & 0.018 & 0.000 & 0.000 & 0.000 \\ 0.368 & 1 & 0.368 & 0.018 & 0.000 & 0.000 \\ 0.018 & 0.368 & 1 & 0.368 & 0.018 & 0.000 \\ 0.000 & 0.018 & 0.368 & 1 & 0.368 & 0.018 \\ 0.000 & 0.000 & 0.018 & 0.368 & 1 & 0.368 \\ 0.000 & 0.000 & 0.000 & 0.018 & 0.368 & 1 \end{bmatrix}
$$

**解 $\boldsymbol{\beta}$。** 從 $\boldsymbol{\beta} = \mathbf{0}$ 出發，用上面的梯度做梯度下降（另外用 BFGS 再解一次，結果相同）：

| $n$ | $x_n$ | $y_n$ | $\beta_n$ | 分數 $s_n = \sum_m \beta_m \mathrm{K}_{mn}$ | $g(x_n) = \theta(s_n)$ |
|---|---|---|---|---|---|
| 1 | $-2$ | $-1$ | $-0.374$ | $-0.515$ | $0.374$ |
| 2 | $-1$ | $-1$ | $-0.406$ | $-0.381$ | $0.406$ |
| 3 | $0$ | $+1$ | $0.464$ | $0.145$ | $0.536$ |
| 4 | $1$ | $-1$ | $-0.464$ | $-0.145$ | $0.464$ |
| 5 | $2$ | $+1$ | $0.406$ | $0.381$ | $0.594$ |
| 6 | $3$ | $+1$ | $0.374$ | $0.515$ | $0.626$ |

驗算其中一個分數：$s_1 = 1\cdot(-0.374) + 0.368\cdot(-0.406) + 0.018\cdot 0.464 + \dots \approx -0.374 - 0.149 + 0.008 = -0.515$。再驗算 $\beta_n = \frac{1}{2\lambda}y_n\theta(-y_n s_n)$：$\lambda = 0.5$ 時係數是 1，$\beta_1 = -\theta(-0.515) = -0.374$，$\beta_3 = +\theta(-0.145) = 0.464$，都對得上。

**這個結果代表什麼。**

- 六個 $\beta_n$ 沒有一個是 0，連離邊界最遠的第 1、6 點都有 $\pm 0.374$。同樣 $C = 1$ 的線性 SVM，對偶解是 $\boldsymbol{\alpha} = (0, \frac{5}{9}, 1, 1, \frac{5}{9}, 0)$：違反邊界的第 3、4 點頂到上限 $C$，邊界上的第 2、5 點在 0 與 $C$ 之間，邊界外的第 1、6 點是 0。（驗算：$\sum_n \alpha_n y_n x_n = \frac{5}{9} + 0 - 1 + \frac{10}{9} = \frac{2}{3} = w$，$\sum_n \alpha_n y_n = -\frac{5}{9} + 1 - 1 + \frac{5}{9} = 0$。）
- 這兩組係數的 kernel 不同，不算公平的比較。要公平，可以回到「數值例子：三種誤差並排」裡 $C = 1$ 的線性正則化邏輯迴歸（$w \approx 0.767$、$b \approx -0.384$）。它的梯度為 0 給出 $w = \sum_n \theta(-y_n s_n)\,y_n x_n$，六個係數 $\theta(-y_n s_n)$ 是 $0.128, 0.240, 0.595, 0.595, 0.240, 0.128$。同一組資料、同一個線性模型、同一個 $C$：SVM 的係數有兩個 0，邏輯迴歸的六個都不是 0。
- 也要說清楚，SVM 的稀疏不是保證。在這六個點上改用同一個 Gaussian kernel、$C = 1$ 解 SVM 的對偶問題，本文得到 $\boldsymbol{\alpha} \approx (0.650, 1, 1, 1, 1, 0.650)$，六個點全是支援向量。資料這麼少、kernel 這麼窄的時候，沒有點落在胖邊界外。差別在於 SVM 的 $\alpha_n$ 可以是 0，只要有點落在胖邊界外，它的 $\alpha_n$ 就是 0；KLR 的 $\beta_n$ 照上面的公式不會是 0。
- Gaussian kernel 讓模型有彈性：六個點的分數正負號都和標籤一致，第 3、4 點也分對了，這是一維的線性模型做不到的。機率都離 $0.5$ 不遠，是因為 $\lambda = 0.5$ 的正則化很強。把 $\lambda$ 降到 $0.05$（對應 $C = 10$），$\boldsymbol{\beta}$ 變成 $(-1.272, -1.912, 2.682, -2.682, 1.912, 1.272)$，六個機率變成 $0.127, 0.191, 0.732, 0.268, 0.809, 0.873$。$\lambda$ 小，正則化弱，係數變大，模型對訓練資料更有把握，和「把 ξ 收進目標函數」那一節的結論一致。
- 預測新的點要用到全部六個訓練點。例如 $x = 1.5$：它和六個點的 kernel 值是 $(0.000, 0.002, 0.105, 0.779, 0.779, 0.105)$，分數是這個向量和 $\boldsymbol{\beta}$ 的內積，約 $0.042$，$g(1.5) = \theta(0.042) \approx 0.511$。這個六維向量就是「另一個看法」裡說的轉換後的資料。

### Fun Time：β 的線性模型在幾維的空間

**題目（第 19 頁）：** 把 KLR 看成 $\boldsymbol{\beta}$ 的線性模型（kernel 當轉換、配上 kernel regularizer），這個線性模型作用的 Z 空間是幾維？

1. $d$，原本 X 空間的維度
2. $N$，訓練資料的筆數
3. $\tilde{d}$，藏在 kernel 裡的特徵轉換 $\boldsymbol{\Phi}(\mathbf{x})$ 的維度
4. $\lambda$，正則化參數

**答案：2。** 講義的解答：對任何 $\mathbf{x}$，轉換後的資料是 $\big(K(\mathbf{x}_1, \mathbf{x}), K(\mathbf{x}_2, \mathbf{x}), \dots, K(\mathbf{x}_N, \mathbf{x})\big)$，有 $N$ 個分量。課堂上把題目多講成一個問法：這個線性模型有多少個參數？答案一樣，$N$ 個 $\beta_n$。在六個點的例子裡，每個 $x$ 都被轉成六維的向量，$\boldsymbol{\beta}$ 也是六維。

選項 1 是轉換前的維度（例子裡是 1）。選項 3 是讀法二的維度：把 KLR 看成 $\mathbf{w}$ 的線性模型時，$\mathbf{w}$ 住在 $\tilde{d}$ 維的空間，Gaussian kernel 的 $\tilde{d}$ 是無限大。題目問的是讀法一。選項 4 是一個參數的值，不是維度。

第 20 頁的總結把四節各收成一句：soft-margin SVM 是配上 hinge 誤差的 L2 正則化；它近似於 L2 正則化的邏輯迴歸；要 soft binary classification，常見的做法是兩層學習；kernel 邏輯迴歸是把 representer theorem 用在 L2 正則化的邏輯迴歸上。下一堂的預告是 kernel models for regression。

## 自我檢查

**1. 沿用六個點，取 $(b, w) = (-\frac{3}{2}, 1)$。算出六個 $\xi_n$ 與 $C = 1$ 時無限制形式的目標值。它比 $(-\frac{1}{3}, \frac{2}{3})$ 好還是差？**

答案：分數 $s_n = x_n - 1.5$ 依序是 $-3.5, -2.5, -1.5, -0.5, 0.5, 1.5$，$y_n s_n$ 是 $3.5, 2.5, -1.5, 0.5, 0.5, 1.5$，$\xi_n = \max(1 - y_n s_n, 0)$ 是 $0, 0, 2.5, 0.5, 0.5, 0$，總和 $3.5$。目標值 $\frac{1}{2}(1)^2 + 3.5 = 4$，比最佳解的 $\frac{26}{9} \approx 2.889$ 差。注意第 4、5 點分對了（$y_n s_n > 0$），$\xi_n$ 仍是正的：hinge 罰的是「沒有超過 1」，不只是「分錯」。

**2. 一個 L2 正則化模型用 $\lambda = 0.125$。把它看成 SVM 的寫法時 $C$ 是多少？如果想讓 $\mathbf{w}$ 更短，$C$ 該調大還是調小？**

答案：$C = \frac{1}{2\lambda} = \frac{1}{0.25} = 4$。要 $\mathbf{w}$ 更短就是要更強的正則化，$\lambda$ 要調大，$C$ 要調小。

**3. 沒有換底的 $\ln(1 + \exp(-ys))$ 在哪個範圍的 $ys$ 上比 0/1 誤差小？這說明了什麼？**

答案：$ys > 0$ 時 0/1 誤差是 0，不會比它小。$ys \le 0$ 時 0/1 誤差是 1，$\ln(1 + e^{-ys}) < 1$ 等價於 $e^{-ys} < e - 1$，也就是 $ys > -\ln(e - 1) \approx -0.541$。所以在 $-0.541 < ys \le 0$ 這一段它比 0/1 誤差小，不是上界。除以 $\ln 2$ 換成以 2 為底之後，$ys = 0$ 的值從 $0.693$ 變成 1，整條曲線才蓋在 0/1 誤差上方。判準：要能指出問題出在 $ys = 0$ 附近，並算出 $\ln 2 < 1$。

**4. 某個機率化 SVM 學到 $A = 2$、$B = -1$，底下的 SVM 是六個點例子裡的 $w_{\text{SVM}} = \frac{2}{3}$、$b_{\text{SVM}} = -\frac{1}{3}$。它判斷機率剛好 $\frac{1}{2}$ 的位置在哪個 $x$？$g(2)$ 是多少？**

答案：$A\cdot s + B = 0$ 給出分數 $s = \frac{1}{2}$；$\frac{2}{3}x - \frac{1}{3} = \frac{1}{2}$ 給出 $x = 1.25$，和 SVM 的邊界 $x = 0.5$ 不同，這就是 $B \ne 0$ 的效果。$x = 2$ 的分數是 1，$g(2) = \theta(2\cdot 1 - 1) = \theta(1) \approx 0.731$。

**5. Z 空間是二維，$\mathbf{z}_1 = (1, 2)$、$\mathbf{z}_2 = (2, 4)$。有人宣稱某個 L2 正則化線性模型（$\lambda > 0$）的最佳解是 $\mathbf{w} = (3, 1)$。用 representer theorem 的證明說明這不可能，並找出一個更好的 $\mathbf{w}$。**

答案：兩個 $\mathbf{z}_n$ 只展得出 $(1, 2)$ 的方向。把 $\mathbf{w}$ 投影上去：$\mathbf{w}_{\parallel} = \frac{(3, 1)\cdot(1, 2)}{(1, 2)\cdot(1, 2)}(1, 2) = \frac{5}{5}(1, 2) = (1, 2)$，$\mathbf{w}_{\perp} = (3, 1) - (1, 2) = (2, -1)$，和 $(1, 2)$ 的內積是 $2 - 2 = 0$。$\mathbf{w}_{\parallel}$ 的分數和 $\mathbf{w}$ 相同（對 $\mathbf{z}_1$ 都是 5，對 $\mathbf{z}_2$ 都是 10），誤差一樣；$\mathbf{w}^\top\mathbf{w} = 10$，$\mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel} = 5$，正則化項比較小。所以 $(1, 2)$ 比 $(3, 1)$ 好，$(3, 1)$ 不會是最佳解。延伸：$(1, 2) = \beta_1\mathbf{z}_1 + \beta_2\mathbf{z}_2$ 的 $\boldsymbol{\beta}$ 不只一組（$(1, 0)$ 與 $(0, \frac{1}{2})$ 都可以），因為兩個 $\mathbf{z}_n$ 線性相依；定理保證的是 $\boldsymbol{\beta}$ 存在，沒有保證唯一。

## 練習與對應閱讀

**兩個學期的對應週次。** 台大的實體課沒有完整排這一堂，所以這篇只能以 MOOC 的講義與影片為準。[Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)在 W11（11/11）上了 [205u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf)，標題改成 SVM for Soft Binary Classification，它的 Summary 只列這堂的前三節，沒有 Kernel Logistic Regression 那一節；同一週就接著講 blending 與 bagging。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)在 W10 講完 kernel 與 soft-margin SVM 之後，W11（11/18）直接進入 blending、bagging 與 AdaBoost，沒有排這一堂。以上是 2026-09-30 查核的結果。只想跟台大課堂進度的人，前三節是重點；想把 kernel 模型看完整的人，representer theorem 那一節是下一堂的基礎。

**作業。** 這堂沒有專屬的公開作業。[Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止）的 Q3 碰到相關主題，是自動批改的選擇題，沒有官方解答：把 soft-margin SVM 的違反量懲罰從 $\sum_n \xi_n$ 改成 $\sum_n \xi_n^2$（squared hinge），題目給出它的對偶問題，問解出 $\boldsymbol{\alpha}^*$ 之後怎麼算回最佳的 $\boldsymbol{\xi}^*$。這題練上一堂的對偶推導，也練這堂「ξ 不必當變數」的觀點：$\xi_n$ 就是誤差，換掉懲罰的方式就是換掉誤差函數。建議先自己從拉格朗日函數推一次對偶，確認和題目給的形式相同，再回答 $\boldsymbol{\xi}^*$ 的問題；可以用小資料集和通用的 QP 套件分別解原始與對偶問題，驗證自己的公式。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**動手做。** 把這篇的六個點照打一次：用格點搜尋找無限制形式的最小值，確認 $C = 1$ 與 $C = 0.1$ 的解；再寫一個兩個變數的梯度下降，從 $(A, B) = (1, 0)$ 出發，確認會停在 $A \approx 1.821$。兩段都只需要純 Python。

**延伸閱讀。**

- Fall 2024 課程頁在 205u 旁邊列了延伸閱讀 [A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf)（Lin、Weng、Lin），討論的正是講義那兩行灰字提到的「實際的模型」。本文沒有逐頁讀這篇論文，沒有引用它的內容。
- [CS229 主講義第 5 章](https://cs229.stanford.edu/main_notes.pdf)用另一種方式推導 kernel 方法，可以和這堂的 representer theorem 對照。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)是同一本教科書的英文課。

**下一堂。** [技法第 6 堂：支援向量迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression)把 representer theorem 用在迴歸上，先得到有解析解的 kernel ridge regression，再處理這堂留下的問題：怎麼讓係數像 SVM 一樣稀疏。

## 課程影片來源

原始影片：[Soft-Margin SVM as Regularized Model](https://www.youtube.com/watch?v=Bc8bg5ZkRdk)、[SVM versus Logistic Regression](https://www.youtube.com/watch?v=5K44AgZvcDk)、[SVM for Soft Binary Classification](https://www.youtube.com/watch?v=pNfvZYH5iFg)、[Kernel Logistic Regression](https://www.youtube.com/watch?v=AbaIkcQUQuo)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。第一、三支影片在 YouTube 上的標題是縮短的寫法（Soft-Margin SVM as Regularized、SVM for Soft Binary），講義上的節名是完整的。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-13：原本與技法第 6 堂合為一篇，改為一堂一篇，這篇只寫技法第 5 堂，依講義與影片逐字稿重寫。

## 參考資料

- [技法第 5 堂講義 205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf)：本文的主要底本，四節的推導、表格與四題 Fun Time 都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [基石第 14 堂講義 14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)：L2 正則化的 augmented error，「和基石的 L2 正則化擺在一起」拿來和無限制形式對照。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：W11 的排課與延伸閱讀清單。
- [Fall 2024 的 205u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf)：實體課版本的標題與 Summary，用來說明它只涵蓋前三節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：確認這一堂沒有排進課程。
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)：Q3 的題目內容。
- [Lin, Weng, Lin：A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf)：Fall 2024 課程頁列的延伸閱讀，本文只指出它的存在。
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)：講義第 2 頁點名的非線性 SVM 軟體。
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)：講義第 2 頁點名的線性 SVM 軟體。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：延伸閱讀，第 5 章的 kernel 方法。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：延伸閱讀。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
