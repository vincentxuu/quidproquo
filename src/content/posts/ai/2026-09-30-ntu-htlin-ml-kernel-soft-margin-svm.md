---
title: "Kernel SVM：不算高維特徵也能算內積｜台大林軒田 機器學習技法 第 3 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 20
tldr: "對偶 SVM 的變數個數已經和特徵維度 d̃ 無關，但 Q 矩陣的每個元素還是一次 d̃ 維內積。這堂課把「轉換＋內積」合成一個 kernel 函數 K(x, x′)，二次轉換的內積只要 O(d) 就能算完；訓練、算 b、預測三個地方全部換成 K 之後，SVM 不再碰 Z 空間。同一招推到極限，Gaussian kernel 對應無限多維的轉換，代價是 γ 選太大照樣過擬合。"
description: "台大林軒田機器學習技法第 3 堂 Kernel Support Vector Machine 導讀：kernel trick 的推導、kernel hard-margin SVM 演算法、多項式 kernel 的 (γ, ζ, Q)、Gaussian kernel 的無限維轉換、三種 kernel 的取捨與 Mercer 條件，並把三個點的 kernel SVM 手算解完。"
draft: false
glossary:
  - term: "kernel 函數"
    aliases: ["kernel function", "核函數"]
    definition: "把特徵轉換 Φ 與內積合成的函數 K(x, x′) = Φ(x)ᵀΦ(x′)。輸入是原始空間的兩個點，輸出是它們轉換後在 Z 空間的內積。"
    context: "技法第 3 堂的主角；每個轉換 Φ 對應一個 kernel 函數。"
  - term: "kernel trick"
    aliases: ["核技巧", "kernel 技巧"]
    definition: "把演算法裡所有「先轉換、再做內積」的地方換成一個算得快的 kernel 函數，讓只用到內積的演算法（例如對偶 SVM）擺脫轉換後的維度 d̃。"
    context: "技法第 3 堂用它把對偶 SVM 變成 kernel SVM。"
  - term: "Gaussian kernel"
    aliases: ["RBF kernel", "高斯 kernel", "Radial Basis Function kernel"]
    definition: "K(x, x′) = exp(−γ‖x − x′‖²)，γ 大於 0。它對應一個無限多維的轉換；γ 愈大，高斯愈尖。"
    context: "技法第 3 堂用泰勒展開說明它是無限維向量的內積。"
  - term: "Mercer 條件"
    aliases: ["Mercer's condition"]
    definition: "一個函數要成為合法 kernel 的充要條件：對稱，而且任意一組資料算出來的 kernel 矩陣都是半正定。"
    context: "技法第 3 堂用它說明「任意相似度」不一定是合法 kernel。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [203_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf) 與四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 3 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂仍在第一種 Embedding Numerous Features: Kernel Models 裡面。同一頁對上一堂[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)的總結是：對偶 SVM 是另一個 QP，帶有幾何上的訊息，而且「almost no dependence on $\tilde{d}$」。almost 那個字在投影片上是灰色的，這堂課要做的事就是把它拿掉。

先備是上一堂的對偶問題、從 $\boldsymbol{\alpha}$ 算回 $\mathbf{w}$ 與 $b$ 的兩條式子、支援向量的定義，以及[基石第 12 堂：非線性轉換](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)的多項式轉換。Gaussian kernel 那一節會用到指數函數的泰勒展開。讀完之後，你應該能自己推出二次轉換的 kernel、寫出 kernel hard-margin SVM 的四個步驟並對一組小資料手算、說明 Gaussian kernel 為什麼是無限維向量的內積，以及用一個 2×2 矩陣判斷某個函數不是合法的 kernel。

整堂課的走法：

1. **找出瓶頸**：對偶問題的 $Q_D$ 還要算 $\tilde{d}$ 維的內積。
2. **二次轉換的捷徑**：轉換和內積合起來算，$O(d)$ 就夠。
3. **kernel trick**：對偶 SVM 裡三個用到內積的地方都換成 kernel 函數。
4. **多項式 kernel**：在轉換裡加縮放，得到 $(\zeta + \gamma\mathbf{x}^\top\mathbf{x}')^Q$。
5. **Gaussian kernel**：同一招推到無限多維。
6. **比較與限制**：三種 kernel 的取捨，以及什麼函數才算 kernel。

## 轉換和內積能不能合起來算：kernel trick

```youtube
url: https://www.youtube.com/watch?v=oOi7kqUTqxw
title: Kernel Support Vector Machine :: Kernel Trick @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:33 複習上一堂並指出瓶頸，03:33–10:47 推導二次轉換的快速內積，10:47–17:41 定義 kernel 函數並套進對偶 SVM 的三個地方，17:41–19:55 是完整的演算法與計算量，之後是 Fun Time。）

### 上一堂留下的瓶頸

講義第 2 頁把上一堂的對偶問題重抄一次，標題旁寫著 half-way done：

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}}\quad & \frac{1}{2}\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} - \mathbf{1}^\top\boldsymbol{\alpha} \\
\text{subject to}\quad & \mathbf{y}^\top\boldsymbol{\alpha} = 0; \\
& \alpha_n \ge 0,\quad n = 1, 2, \dots, N
\end{aligned}
$$

變數是 $N$ 個、限制式是 $N+1$ 條，兩個數字都和 $\tilde{d}$ 無關。$\tilde{d}$ 躲在 $Q_D$ 的元素裡：

$$
q_{n,m} = y_n y_m\,\mathbf{z}_n^\top\mathbf{z}_m, \qquad \mathbf{z}_n^\top\mathbf{z}_m = \boldsymbol{\Phi}(\mathbf{x}_n)^\top\boldsymbol{\Phi}(\mathbf{x}_m)
$$

這是 $\mathbb{R}^{\tilde{d}}$ 裡的內積。課堂上舉的數字是：在一萬維的空間做內積，照定義算要一萬步；十萬維就要十萬步。而且這些係數沒算出來，後面的 QP 根本無從解起，所以課堂上把這一步稱為整個求解過程的瓶頸。講義把需求寫成一行：$\mathbf{z}_n^\top\mathbf{z}_m$ 要能算得比 $O(\tilde{d})$ 快。

課堂上接著把這個內積拆成兩個動作來看。從 X 空間的角度，$\mathbf{z}_n^\top\mathbf{z}_m$ 是先把兩個 $\mathbf{x}$ 各自轉換，再做內積。轉換到一萬維要花一萬的力氣，在一萬維做內積又要花一萬的力氣，兩步分開做，怎樣都省不掉。林軒田在這裡用了台語的「偷吃步」：兩個步驟能不能合起來，一起算得快一點？

### 二次轉換的內積可以在 O(d) 算完

講義第 3 頁拿二次多項式轉換當例子。這裡的 $\boldsymbol{\Phi}_2$ 和基石第 12 堂的寫法有一點不同：

$$
\boldsymbol{\Phi}_2(\mathbf{x}) = (1,\ x_1, x_2, \dots, x_d,\ x_1^2, x_1x_2, \dots, x_1x_d,\ x_2x_1, x_2^2, \dots, x_2x_d,\ \dots,\ x_d^2)
$$

$x_1x_2$ 和 $x_2x_1$ 是同一個值，卻兩個都放進去。投影片的註解是 for 'simplicity'，課堂上直說這是在「灌水」，目的是讓接下來的式子整理起來比較簡潔。這樣數下來，$\boldsymbol{\Phi}_2(\mathbf{x})$ 有 $1 + d + d^2$ 個分量：一個常數、$d$ 個一次項、$d^2$ 個二次項（每一組 $(i, j)$ 一個 $x_ix_j$）。

現在拿兩個點 $\mathbf{x}$ 與 $\mathbf{x}'$，照定義把轉換後的向量一格一格對應相乘再加起來：

$$
\boldsymbol{\Phi}_2(\mathbf{x})^\top\boldsymbol{\Phi}_2(\mathbf{x}') = \underbrace{1 \cdot 1}_{\text{constant}} + \underbrace{\sum_{i=1}^{d} x_i x_i'}_{\text{1st order}} + \underbrace{\sum_{i=1}^{d}\sum_{j=1}^{d} x_i x_j\, x_i' x_j'}_{\text{2nd order}}
$$

麻煩的是最後那個雙重加總，它有 $d^2$ 項。課堂上的做法是把跟 $i$ 有關的因子集中到一邊、跟 $j$ 有關的集中到另一邊。每一項都是四個數相乘，$x_i x_i'$ 不含 $j$，可以從內層的加總提出去：

$$
\sum_{i=1}^{d}\sum_{j=1}^{d} x_i x_j\, x_i' x_j' = \sum_{i=1}^{d} x_i x_i' \Big(\sum_{j=1}^{d} x_j x_j'\Big) = \Big(\sum_{i=1}^{d} x_i x_i'\Big)\Big(\sum_{j=1}^{d} x_j x_j'\Big)
$$

第二個等號是因為括號裡的加總不含 $i$，對外層來說是常數。兩個括號都是原始空間的內積 $\mathbf{x}^\top\mathbf{x}'$，所以

$$
\boldsymbol{\Phi}_2(\mathbf{x})^\top\boldsymbol{\Phi}_2(\mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2
$$

右邊的算法是：先花 $O(d)$ 算一次 $\mathbf{x}^\top\mathbf{x}'$，再平方、相加。講義的結論是，對 $\boldsymbol{\Phi}_2$ 來說，「轉換＋內積」可以在 $O(d)$ 做完，不必花 $O(d^2)$。課堂上特別加了一句但書：把兩步合起來不是一定能算得比較快，只是在這個特殊的例子裡可以。

本文自擬一個小例子驗證（不在講義上）。取 $d = 2$，$\mathbf{x} = (1, 2)$、$\mathbf{x}' = (3, 1)$。

- **照定義算**：$\boldsymbol{\Phi}_2(\mathbf{x}) = (1,\ 1, 2,\ 1, 2, 2, 4)$，$\boldsymbol{\Phi}_2(\mathbf{x}') = (1,\ 3, 1,\ 9, 3, 3, 1)$，各有 $1 + 2 + 4 = 7$ 個分量。內積是 $1 + 3 + 2 + 9 + 6 + 6 + 4 = 31$。
- **走捷徑**：$\mathbf{x}^\top\mathbf{x}' = 3 + 2 = 5$，$1 + 5 + 5^2 = 31$。

兩邊一樣。$d = 2$ 時看不出差別，把 $d$ 換成 100 就明顯了：照定義要先各自展開成 $1 + 100 + 100^2 = 10{,}101$ 維再內積，捷徑只要一次 100 維的內積加兩個運算。

### Kernel 函數：把轉換包在裡面

講義第 4 頁給這條捷徑一個名字。每個轉換 $\boldsymbol{\Phi}$ 對應一個 kernel 函數：

$$
K_{\boldsymbol{\Phi}}(\mathbf{x}, \mathbf{x}') \equiv \boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}')
$$

剛才的結果寫成 $K_{\boldsymbol{\Phi}_2}(\mathbf{x}, \mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$，下標標明它對應哪個轉換。課堂上強調 kernel 函數吃進去的是原始的 $\mathbf{x}$：它直接拿 X 空間的東西做一些運算，就代表了「轉換、再到 Z 空間做內積」這兩步，轉換的動作被包在函數裡面。心裡的期待當然是這個函數要算得快。

接著把對偶 SVM 裡用到 Z 空間的地方一個一個找出來換掉。一共三處。

**第一處，二次項係數。** 這是瓶頸本身，直接代換：

$$
q_{n,m} = y_n y_m\,\mathbf{z}_n^\top\mathbf{z}_m = y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

**第二處，算 $b$。** 上一堂的做法是挑一個支援向量 $(\mathbf{x}_s, y_s)$，用 $b = y_s - \mathbf{w}^\top\mathbf{z}_s$。這裡出現的是 $\mathbf{w}$ 和 $\mathbf{z}_s$ 的內積，$\mathbf{w}$ 是一個 $\tilde{d}$ 維的向量，課堂上先替學生說出疑問：乍看之下它不是兩個 $\mathbf{z}$ 的內積，沒辦法用 kernel。解法是上一堂的另一條 KKT 條件 $\mathbf{w} = \sum_n \alpha_n y_n \mathbf{z}_n$：$\mathbf{w}$ 本身是一堆 $\mathbf{z}_n$ 的線性組合。代進去，內積對加法可以分配：

$$
b = y_s - \mathbf{w}^\top\mathbf{z}_s = y_s - \Big(\sum_{n=1}^{N}\alpha_n y_n \mathbf{z}_n\Big)^\top\mathbf{z}_s = y_s - \sum_{n=1}^{N}\alpha_n y_n\,\mathbf{z}_n^\top\mathbf{z}_s = y_s - \sum_{n=1}^{N}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)
$$

**第三處，預測。** 對新的輸入 $\mathbf{x}$，分類器是 $\text{sign}(\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x}) + b)$。$\boldsymbol{\Phi}(\mathbf{x})$ 就是一個 $\mathbf{z}$，用同一招：

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\big(\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x}) + b\big) = \text{sign}\Big(\sum_{n=1}^{N}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\Big)
$$

三處換完，課堂上回頭檢查了一遍：整個流程有沒有任何一刻真的在 Z 空間做內積？沒有。$\mathbf{w}$ 從頭到尾沒有被算出來，它只以「跟某個 $\mathbf{z}$ 做內積」的形式出現，而每次出現都被換成 kernel。講義把這件事稱為 kernel trick：代入算得快的 kernel 函數，避開對 $\tilde{d}$ 的依賴。

### Kernel hard-margin SVM 演算法

講義第 5 頁把上一堂的對偶 SVM 改寫成 Kernel Hard-Margin SVM Algorithm。步驟和上一堂相同，只是所有 Z 空間的內積都換成 $K$：

1. 算 $q_{n,m} = y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)$，$\mathbf{p} = -\mathbf{1}_N$，再依等式限制 $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ 與邊界限制 $\alpha_n \ge 0$ 準備 $(A, \mathbf{c})$。
2. $\boldsymbol{\alpha} \leftarrow \text{QP}(Q_D, \mathbf{p}, A, \mathbf{c})$。
3. 挑一個支援向量 $(\mathbf{x}_s, y_s)$，$b \leftarrow y_s - \sum_{\text{SV}} \alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)$。
4. 回傳支援向量、它們的 $\alpha_n$ 與 $b$。對新的 $\mathbf{x}$，$g_{\text{SVM}}(\mathbf{x}) = \text{sign}\big(\sum_{\text{SV}} \alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\big)$。

第 3、4 步的加總只對支援向量做，因為 $\alpha_n = 0$ 的項沒有貢獻。課堂上對第 3 步補了一個實務做法：數學上一個支援向量就夠，也可以多挑幾個各算一次 $b$ 再取平均，數值上比較穩定。

講義列出各步的計算量：

| 步驟 | 計算量 | 與 $\tilde{d}$ 的關係 |
|---|---|---|
| 1 | $O(N^2)$ 次 kernel 計算 | kernel 算得快就無關 |
| 2 | $N$ 個變數、$N+1$ 條限制式的 QP | 無關 |
| 3、4 | $O(\#\text{SV})$ 次 kernel 計算 | kernel 算得快就無關 |

講義的總結是：kernel SVM 用計算上的捷徑避開 $\tilde{d}$，而且只靠支援向量做預測。本文補充一個容易忽略的後果：訓練完要存下來的東西變了。原始 SVM 存的是 $(b, \mathbf{w})$，kernel SVM 沒有 $\mathbf{w}$ 可存，存的是支援向量本身、它們的 $\alpha_n$（與 $y_n$）和 $b$。每預測一筆新資料，就要和每個支援向量各算一次 kernel。

### 數值例子：三個點的 kernel SVM

以下是本文自擬的例子，不在講義上。目的是把上面四個步驟完整走一遍，並看到 kernel 算出來的結果和「真的轉換到 Z 空間」是同一個答案。

資料是一維的三個點：

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $-1$ | $+1$ |
| 2 | $0$ | $-1$ |
| 3 | $1$ | $+1$ |

負例夾在兩個正例中間，在數線上找不到一個切點把它們分開，線性的 hard-margin SVM 無解。kernel 用下一節才正式介紹的 $K_2(x, x') = (1 + xx')^2$（先當成一個給定的函數；它對應的轉換是 $\boldsymbol{\Phi}(x) = (1, \sqrt{2}x, x^2)$，因為 $1 + 2xx' + x^2x'^2 = (1 + xx')^2$）。

**第一步：算 kernel 矩陣與 $Q_D$。** 例如 $K(x_1, x_3) = (1 + (-1)(1))^2 = 0$，$K(x_1, x_2) = (1 + 0)^2 = 1$，$K(x_1, x_1) = (1 + 1)^2 = 4$。全部算完，再乘上 $y_n y_m$：

$$
K = \begin{bmatrix} 4 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 4 \end{bmatrix}, \qquad Q_D = \begin{bmatrix} 4 & -1 & 0 \\ -1 & 1 & -1 \\ 0 & -1 & 4 \end{bmatrix}
$$

$Q_D$ 裡變號的是 $(1,2)$、$(2,1)$、$(2,3)$、$(3,2)$ 四格，因為第 2 點的標籤和另外兩點相反。

**第二步：解對偶問題。** 等式限制是 $\alpha_1 - \alpha_2 + \alpha_3 = 0$，所以 $\alpha_2 = \alpha_1 + \alpha_3$。把 $Q_D$ 展開：

$$
\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = 4\alpha_1^2 + \alpha_2^2 + 4\alpha_3^2 - 2\alpha_1\alpha_2 - 2\alpha_2\alpha_3 = 4\alpha_1^2 + 4\alpha_3^2 + \alpha_2\big(\alpha_2 - 2(\alpha_1 + \alpha_3)\big)
$$

代入 $\alpha_2 = \alpha_1 + \alpha_3$，最後一項變成 $-(\alpha_1 + \alpha_3)^2$，整個二次項是 $3\alpha_1^2 + 3\alpha_3^2 - 2\alpha_1\alpha_3$。而 $\sum_n \alpha_n = 2(\alpha_1 + \alpha_3)$。目標函數成為

$$
\frac{1}{2}\big(3\alpha_1^2 + 3\alpha_3^2 - 2\alpha_1\alpha_3\big) - 2\alpha_1 - 2\alpha_3
$$

對 $\alpha_1$、$\alpha_3$ 偏微分設為 0：$3\alpha_1 - \alpha_3 - 2 = 0$ 與 $3\alpha_3 - \alpha_1 - 2 = 0$。兩式相減得 $\alpha_1 = \alpha_3$，代回得 $\alpha_1 = \alpha_3 = 1$，於是 $\alpha_2 = 2$。三個都是正的，沒有違反 $\alpha_n \ge 0$：

$$
\boldsymbol{\alpha} = (1, 2, 1), \qquad \text{objective} = \frac{1}{2}(3 + 3 - 2) - 4 = -2
$$

**第三步：算 $b$。** 三個點都是支援向量，各算一次：

- 用第 1 點：$b = 1 - \big[(1)(+1)(4) + (2)(-1)(1) + (1)(+1)(0)\big] = 1 - 2 = -1$
- 用第 2 點：$b = -1 - \big[(1)(+1)(1) + (2)(-1)(1) + (1)(+1)(1)\big] = -1 - 0 = -1$
- 用第 3 點：和第 1 點對稱，$b = -1$

**第四步：寫出分類器。**

$$
g_{\text{SVM}}(x) = \text{sign}\big((1 - x)^2 - 2 \cdot 1 + (1 + x)^2 - 1\big) = \text{sign}\big(2x^2 - 1\big)
$$

中間那個 $-2 \cdot 1$ 來自第 2 點：$K(0, x) = 1$，不管 $x$ 是多少。邊界在 $x = \pm\frac{1}{\sqrt{2}} \approx \pm 0.707$，中間判成 $-1$，兩側判成 $+1$。三個訓練點的分數是 $2 - 1 = 1$、$0 - 1 = -1$、$2 - 1 = 1$，乘上各自的 $y_n$ 都剛好是 1，三個點都在胖邊界上，KKT 的四條全部成立。

**對照：真的到 Z 空間去算。** 用 $\boldsymbol{\Phi}(x) = (1, \sqrt{2}x, x^2)$，三個點變成 $\mathbf{z}_1 = (1, -\sqrt{2}, 1)$、$\mathbf{z}_2 = (1, 0, 0)$、$\mathbf{z}_3 = (1, \sqrt{2}, 1)$。

$$
\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n = (1, -\sqrt{2}, 1) - 2(1, 0, 0) + (1, \sqrt{2}, 1) = (0, 0, 2)
$$

$\mathbf{w}^\top\boldsymbol{\Phi}(x) + b = 2x^2 - 1$，和 kernel 那條路算出來的一模一樣。Z 空間的 margin 是 $1/\lVert\mathbf{w}\rVert = \frac{1}{2}$。

**這個結果代表什麼。** kernel 那條路從頭到尾只用到 $x_n$ 之間的 9 個 kernel 值（實際上 6 個，因為對稱），沒有寫出任何一個 $\mathbf{z}_n$，也沒有算出 $\mathbf{w}$，卻得到同一條邊界。這個例子的 $\tilde{d}$ 只有 2（扣掉常數），省不到什麼；但同樣的四個步驟，把 kernel 換成 10 次多項式或 Gaussian，流程一個字都不用改。這組資料在後面兩節還會再用。

### Fun Time：內積是 10 的兩個點

**題目（第 6 頁）：** 有兩筆資料 $\mathbf{x}$ 與 $\mathbf{x}'$，$\mathbf{x}^\top\mathbf{x}' = 10$。$K_{\boldsymbol{\Phi}_2}(\mathbf{x}, \mathbf{x}')$ 是多少？

1. $1$
2. $11$
3. $111$
4. $1111$

**答案：3。** 直接代公式：$1 + 10 + 10^2 = 111$。選項 1 只算了常數項，選項 2 漏了二次項，選項 4 多加了一個 $10^3$，那是三次轉換才會有的項。

這題沒有給 $\mathbf{x}$ 的維度，也沒有給 $\mathbf{x}$ 和 $\mathbf{x}'$ 各是多少。答案只需要原始空間的內積這一個數字，這正是 kernel 的意思：$\mathbf{x}$ 是 3 維還是 3,000 維，$\boldsymbol{\Phi}_2$ 展開後有幾項，都不影響答案。

## 同樣是二次轉換，係數不同就是不同的 kernel：多項式 kernel

```youtube
url: https://www.youtube.com/watch?v=Fb-WSBvsPak
title: Kernel Support Vector Machine :: Polynomial Kernel @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:50 在二次轉換裡加縮放，03:50–05:48 看三種二次 kernel 的結果，05:48–09:18 推廣到 Q 次，09:18–11:29 是 linear kernel，之後是 Fun Time。）

### 在轉換裡加縮放

剛才的 $\boldsymbol{\Phi}_2$ 是唯一的二次轉換嗎？課堂上的回答是否定的：二次轉換有很多種，有的容易寫出好算的 kernel，有的不行。講義第 7 頁列了三種，差別只在各項前面的常數。投影片把二次項寫成 $x_1^2, \dots, x_d^2$，沒有另外說明；對照同一列右邊的 kernel 裡有 $(\mathbf{x}^\top\mathbf{x}')^2$，可以確定那是全部 $d^2$ 個 $x_ix_j$ 的簡寫（這是本文的判讀）。

**原版。** $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, \dots, x_d, x_1^2, \dots, x_d^2)$，對應 $K_{\boldsymbol{\Phi}_2}(\mathbf{x}, \mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$。

**一次項乘上 $\sqrt{2}$。** 轉換是 $(1, \sqrt{2}x_1, \dots, \sqrt{2}x_d, x_1^2, \dots, x_d^2)$。兩個向量做內積時，一次項那一段變成 $\sum_i (\sqrt{2}x_i)(\sqrt{2}x_i') = 2\,\mathbf{x}^\top\mathbf{x}'$，其他不變：

$$
K_2(\mathbf{x}, \mathbf{x}') = 1 + 2\,\mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2 = (1 + \mathbf{x}^\top\mathbf{x}')^2
$$

多出來的 2 剛好讓三項湊成完全平方。課堂上說這就是乘 $\sqrt{2}$ 的好處。

**再加一個縮放參數 $\gamma$。** 轉換是 $(1, \sqrt{2\gamma}x_1, \dots, \sqrt{2\gamma}x_d, \gamma x_1^2, \dots, \gamma x_d^2)$。一次項的內積是 $\sum_i (\sqrt{2\gamma}x_i)(\sqrt{2\gamma}x_i') = 2\gamma\,\mathbf{x}^\top\mathbf{x}'$；二次項的內積是 $\sum_i\sum_j (\gamma x_ix_j)(\gamma x_i'x_j') = \gamma^2(\mathbf{x}^\top\mathbf{x}')^2$，後面這個等號用的是 kernel trick 那一節拆雙重加總的同一步。合起來：

$$
K_2(\mathbf{x}, \mathbf{x}') = 1 + 2\gamma\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2 = (1 + \gamma\,\mathbf{x}^\top\mathbf{x}')^2, \qquad \gamma > 0
$$

講義對這個 $K_2$ 的評語是比 $K_{\boldsymbol{\Phi}_2}$ 稍微「好算」一點，也是比較常用的形式；課堂上補充它也比較容易延伸到更高次。

投影片上原版的 $\boldsymbol{\Phi}_2$ 是藍色的，只乘 $\sqrt{2}$ 的是紅色的，加了 $\gamma$ 的是綠色的；講義那一行 equivalent power 比的是藍色與綠色這兩個。課堂上替學生問：藍色和綠色到底哪裡不一樣？答案分兩層。

- **一樣的地方：** 兩者都是二次轉換，對應到同一個空間。在那個空間做線性運算時，這些縮放最後都會被線性的係數 $\tilde{\mathbf{w}}$ 吸收掉，所以能表示的邊界是同一批。講義的用詞是 equivalent power。
- **不一樣的地方：** 它們定義了不同的內積。課堂上的推論鏈是：不同的內積代表不同的距離，SVM 是靠距離決定 margin 的演算法，所以幾何性質不同、算出來的 margin 不同，最後可能得到不同的邊界。講義寫成 different inner product ⟹ different geometry。

### 換 kernel 就是換 margin 的定義

講義第 8 頁用同一組二維資料跑三次 SVM，三張圖並排。圖上沒有標哪一類是正例，照這門課一貫的畫法，藍圈是正例、紅叉是負例；方框圈起來的是支援向量：

| 圖 | kernel | 邊界的樣子 |
|---|---|---|
| 左 | $(1 + 0.001\,\mathbf{x}^\top\mathbf{x}')^2$ | 只有一條開口朝上的曲線，把上方的藍圈和下方的紅叉分開 |
| 中 | $1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$ | 上方的曲線之外，圖的底部偏右又冒出一塊判成藍色的區域 |
| 右 | $(1 + 1000\,\mathbf{x}^\top\mathbf{x}')^2$ | 上方的曲線和中圖相近，底部同樣多出一塊藍色區域，位置比中圖偏中間 |

三條都是二次曲線，三個都把資料完全分開。課堂上指出左圖的邊界看起來比較簡單，不像中間那張底部多一塊；三張圖支援向量的數量也不完全一樣（本文從圖上數到的方框依序是 4、5、6 個）。底部那塊藍色區域裡沒有任何訓練點；本文的解讀是，它是同一條二次曲線的另一支，下面自擬的例子會算出同樣的現象。講義的兩個結論：

- $g_{\text{SVM}}$ 不同，支援向量不同，而且在學習之前很難說哪個比較好。課堂上的說法是三者各有各的 margin 定義，在不同的定義下不容易互相比較。
- 換 kernel 等於換 margin 的定義。所以 kernel 需要選擇，就像以前要選轉換 $\boldsymbol{\Phi}$ 一樣；轉換現在包在 kernel 裡面，選 kernel 就是在選轉換。

**本文自擬的例子：兩個點，γ 把邊界推到哪裡。** 講義的圖沒有給資料座標，沒辦法照著算。這裡用最小的資料把「同一個 kernel 家族、不同 $\gamma$、邊界不同」算出來。一維的兩個點：$x_1 = 0$ 標 $-1$，$x_2 = 1$ 標 $+1$；kernel 是 $K_2(x, x') = (1 + \gamma xx')^2$。

kernel 值：$K(x_1, x_1) = 1$、$K(x_1, x_2) = 1$、$K(x_2, x_2) = (1 + \gamma)^2$（$x_1 = 0$ 讓前兩個值都是 1）。等式限制 $-\alpha_1 + \alpha_2 = 0$ 給出 $\alpha_1 = \alpha_2 = \alpha$。$Q_D$ 的元素是 $q_{1,1} = 1$、$q_{1,2} = -1$、$q_{2,2} = (1 + \gamma)^2$，目標函數是

$$
\frac{1}{2}\alpha^2\big(1 - 2 + (1 + \gamma)^2\big) - 2\alpha = \frac{1}{2}\alpha^2\,\gamma(2 + \gamma) - 2\alpha
$$

微分設為 0 得 $\alpha = \dfrac{2}{\gamma(2 + \gamma)}$。用第 1 點算 $b$：$b = -1 - \alpha\big[(-1)(1) + (+1)(1)\big] = -1$。分類器是

$$
g_{\text{SVM}}(x) = \text{sign}\Big(\alpha\big[(1 + \gamma x)^2 - 1\big] - 1\Big)
$$

邊界滿足 $(1 + \gamma x)^2 - 1 = \frac{1}{\alpha} = \frac{\gamma(2 + \gamma)}{2}$。展開左邊、兩邊同除以 $\gamma$，得到 $\gamma x^2 + 2x - \big(1 + \frac{\gamma}{2}\big) = 0$，解是 $x = \dfrac{-1 \pm \sqrt{1 + \gamma(1 + \gamma/2)}}{\gamma}$。代幾個 $\gamma$：

| $\gamma$ | $\alpha$ | 邊界（兩個根） | Z 空間的 margin |
|---|---|---|---|
| $0.001$ | $999.5$ | $0.5001$ 與 $-2000.5$ | $0.022$ |
| $0.1$ | $9.524$ | $0.512$ 與 $-20.5$ | $0.229$ |
| $1$ | $0.667$ | $0.581$ 與 $-2.581$ | $0.866$ |
| $10$ | $0.0167$ | $0.681$ 與 $-0.881$ | $5.48$ |
| $1000$ | $2.0 \times 10^{-6}$ | $0.7068$ 與 $-0.7088$ | $500.5$ |

兩個根之間判成 $-1$，外側判成 $+1$。margin 那一欄是 $1/\lVert\mathbf{w}\rVert$，由 $\lVert\mathbf{w}\rVert^2 = \boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = 2\alpha$ 算出。

這張表可以讀出三件事。第一，$\gamma$ 很小時，左邊的根跑到 $-2000$，在資料附近只看得到 $x \approx 0.5$ 這一個切點，也就是兩個點的中點，行為幾乎和線性 SVM 一樣；因為 $\gamma$ 小的時候，轉換裡的二次項 $\gamma x^2$ 比一次項 $\sqrt{2\gamma}x$ 小得多。第二，$\gamma$ 很大時，邊界趨近 $\pm\frac{1}{\sqrt{2}}$，對原點對稱，二次項主導，連離資料很遠的負半邊都畫出一個正例區。同樣是二次的 kernel，同樣兩個點，$x = 0.6$ 在 $\gamma = 1$ 時判成 $+1$，在 $\gamma = 10$ 時判成 $-1$。第三，margin 從 0.022 變到 500，這些數字各自量的是不同 Z 空間裡的距離，不能拿來互比，這就是課堂上說「不容易比較哪個好」的原因。

### 一般的多項式 kernel

講義第 9 頁再加一個參數 $\zeta$，並把次數推廣：

$$
\begin{aligned}
K_2(\mathbf{x}, \mathbf{x}') &= (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2 \\
K_3(\mathbf{x}, \mathbf{x}') &= (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^3 \\
&\ \ \vdots \\
K_Q(\mathbf{x}, \mathbf{x}') &= (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^Q
\end{aligned}
\qquad \gamma > 0,\ \zeta \ge 0
$$

三個參數各管一件事，課堂上的說明是：$\gamma$ 控制原始內積的縮放；$\zeta$ 控制常數項，以及它和各次項係數之間的搭配；$Q$ 是多項式的次數。講義說這個 kernel 把一個 $Q$ 次轉換 $\boldsymbol{\Phi}_Q$ 連同由 $(\gamma, \zeta)$ 決定的特定係數嵌在裡面。$\zeta$ 具體怎麼進到轉換的係數裡，是這一節 Fun Time 的題目。

重點在計算量。$Q$ 可以是 2、3、10，課堂上甚至說 100、1000 都沒問題，花的力氣都是一次原始空間的內積，再加一點點運算。本文用基石第 12 堂的公式換算：$d = 10$ 個輸入特徵做 10 次多項式轉換，去掉重複後的維度是 $\binom{20}{10} - 1 = 184{,}755$；用 kernel 算，仍然是一次 10 維的內積，加一次加法、一次乘法與一次 10 次方。課堂上的說法是，現在做 10 次轉換幾乎和做 2 次轉換一樣簡單。

次數這麼高會不會過擬合？課堂上的回答是有可能，但在 SVM 裡還有 large margin 這個幫手來控制複雜度。第 9 頁右邊的圖是一個例子：一組二維資料用 10 次多項式 kernel 跑出來的邊界是一條彎了幾次的曲線，圖下標著 10-th order polynomial with margin 0.1。課堂上的評語是，雖然對應到 10 次的轉換，這條邊界不算糟，支援向量也不算多。講義把 SVM 配上多項式 kernel 稱為 polynomial SVM。

### 特例：linear kernel

講義第 10 頁回到最簡單的情況：$Q = 1$、$\gamma = 1$、$\zeta = 0$。

$$
K_1(\mathbf{x}, \mathbf{x}') = (0 + 1 \cdot \mathbf{x}^\top\mathbf{x}')^1 = \mathbf{x}^\top\mathbf{x}'
$$

這就是原始空間的內積，稱為 linear kernel，對應的是不做任何轉換。課堂上解釋了為什麼這兩個參數可以這樣設：$\gamma$ 只是在縮放原始資料，資料如果已經處理好，取 1 就可以；常數項的角色已經由 SVM 的 $b$ 處理掉，所以 $\zeta$ 取 0。

講義說這種情況 even easier：常常直接解原始問題（primal）就很有效率，不一定要走對偶。投影片右邊放的是一條直線配上灰色的胖邊界，課堂上說這是剛開始介紹 SVM 時看過的圖：回去解當初那個找最胖邊界的原始問題就好；真的要走對偶，把 linear kernel 塞進去也可以。

這一頁最下面是 linear first, remember? 課堂上把它講成一個操作順序：資料先拿 linear SVM 試，做得夠好就不必再試多項式；覺得不夠好，再往多項式走。這是從基石就一路提醒的事。

### Fun Time：一般二次 kernel 對應哪個轉換

**題目（第 11 頁）：** 一般的二次多項式 kernel 是 $K_2(\mathbf{x}, \mathbf{x}') = (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2$。下面哪個轉換可以導出這個 kernel？

1. $\boldsymbol{\Phi}(\mathbf{x}) = (1, \sqrt{2\gamma}x_1, \dots, \sqrt{2\gamma}x_d, \gamma x_1^2, \dots, \gamma x_d^2)$
2. $\boldsymbol{\Phi}(\mathbf{x}) = (\zeta, \sqrt{2\gamma}x_1, \dots, \sqrt{2\gamma}x_d, x_1^2, \dots, x_d^2)$
3. $\boldsymbol{\Phi}(\mathbf{x}) = (\zeta, \sqrt{2\gamma\zeta}x_1, \dots, \sqrt{2\gamma\zeta}x_d, x_1^2, \dots, x_d^2)$
4. $\boldsymbol{\Phi}(\mathbf{x}) = (\zeta, \sqrt{2\gamma\zeta}x_1, \dots, \sqrt{2\gamma\zeta}x_d, \gamma x_1^2, \dots, \gamma x_d^2)$

**答案：4。** 先把目標展開：

$$
(\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2 = \zeta^2 + 2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2
$$

講義的解答說，零次項要湊出 $\zeta^2$，一次項要湊出 $2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}'$，二次項要湊出 $\gamma^2(\mathbf{x}^\top\mathbf{x}')^2$。轉換裡某一段乘上常數 $c$，那一段的內積就乘上 $c^2$，所以三段的常數依序要是 $\zeta$、$\sqrt{2\gamma\zeta}$、$\gamma$。逐一算四個選項的內積：

| 選項 | 內積 | 和目標比 |
|---|---|---|
| 1 | $1 + 2\gamma\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2$ | 只有 $\zeta = 1$ 時相同 |
| 2 | $\zeta^2 + 2\gamma\,\mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$ | 一次項少了 $\zeta$，二次項少了 $\gamma^2$ |
| 3 | $\zeta^2 + 2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$ | 二次項少了 $\gamma^2$ |
| 4 | $\zeta^2 + 2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2$ | 相同 |

本文用 $\gamma = 0.7$、$\zeta = 1.3$ 和兩個隨機的三維向量把四個轉換實際展開算過，只有選項 4 的內積和 $(\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2$ 相等。

本文補充：這題順便解釋了講義為什麼要求 $\zeta \ge 0$。選項 4 的一次項係數是 $\sqrt{2\gamma\zeta}$，$\gamma > 0$ 時，$\zeta$ 是負的就開不了根號，這個轉換就寫不出實數的版本。課堂上沒有推這個條件，只說回頭去推導就能得到；口頭說的是 $\zeta$ 要大於 0，投影片寫的是 $\zeta \ge 0$，本文以投影片為準，因為 $\zeta = 0$ 時選項 4 的轉換仍然寫得出來（常數項與一次項變成 0），linear kernel 用的也正是 $\zeta = 0$。$\zeta$ 是負數時會出什麼事，比較 kernel 那一節的 Fun Time 有一個具體的例子。

## 無限多維的轉換也算得出內積：Gaussian kernel

```youtube
url: https://www.youtube.com/watch?v=_-fIkbSBdF8
title: Kernel Support Vector Machine :: Gaussian Kernel @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–07:21 推導無限維的轉換，07:21–09:27 是 Gaussian SVM 的 hypothesis 與 RBF 這個名字，09:27–11:27 回顧 support vector 機制，11:27–13:59 看三個 γ 的結果，之後是 Fun Time。）

### 一維的推導

課堂上用「一個非常瘋狂的想法」開場：既然 kernel 可以讓我們假裝在 Z 空間做了轉換和內積，把這個偷吃步推到極限，能不能用無限多維的轉換？以前要把 Z 空間的每個分量算出來再內積，無限多維想都不敢想。講義第 12 頁的回答是：可以，只要 $K(\mathbf{x}, \mathbf{x}')$ 算得出來。

為了看清楚，先讓輸入只有一維，$\mathbf{x} = (x)$，考慮這個函數：

$$
K(x, x') = \exp\big(-(x - x')^2\big)
$$

它是一個高斯函數。這次的方向和多項式 kernel 相反：多項式那邊是先有轉換、再整理出 kernel；這裡是先有函數，再找出它是哪個轉換的內積。推導分四步。

**第一步，展開平方。** $-(x - x')^2 = -x^2 - x'^2 + 2xx'$，指數相加等於相乘：

$$
K(x, x') = \exp(-x^2)\,\exp(-x'^2)\,\exp(2xx')
$$

前兩個因子一個只含 $x$、一個只含 $x'$，已經分開了。投影片用藍色標只含 $x$ 的部分、紅色標只含 $x'$ 的部分。第三個因子 $\exp(2xx')$ 兩者混在一起，課堂上說它是「紫色」的，接下來的工作就是把紫色拆成藍色和紅色。

**第二步，泰勒展開。** 指數函數的展開式是 $\exp(a) = \sum_{i=0}^{\infty} \frac{a^i}{i!}$。取 $a = 2xx'$：

$$
\exp(2xx') = \sum_{i=0}^{\infty}\frac{(2xx')^i}{i!} = \sum_{i=0}^{\infty}\frac{2^i}{i!}\,x^i\,x'^i
$$

**第三步，把係數平分給兩邊。** 每一項裡 $x^i$ 歸藍色、$x'^i$ 歸紅色，剩下的係數 $\frac{2^i}{i!}$ 哪邊都不屬於。課堂上的做法是「分家」：一個數要平分給兩邊，就各拿它的平方根。這和多項式 kernel 那邊設定 $\sqrt{2}$ 是同一件事，只是方向反過來：那邊是選好轉換的係數再看 kernel 長怎樣，這裡是係數已經在了，要分回兩邊。把前面兩個因子也移進加總裡：

$$
K(x, x') = \sum_{i=0}^{\infty}\Big(\exp(-x^2)\sqrt{\frac{2^i}{i!}}\,x^i\Big)\Big(\exp(-x'^2)\sqrt{\frac{2^i}{i!}}\,x'^i\Big)
$$

**第四步，認出內積。** 兩個括號長得一模一樣，只差在一個放 $x$、一個放 $x'$，代表它們是同一個轉換的第 $i$ 個分量。對 $i$ 從 0 加到無限大，就是兩個無限維向量的內積：

$$
K(x, x') = \boldsymbol{\Phi}(x)^\top\boldsymbol{\Phi}(x'), \qquad \boldsymbol{\Phi}(x) = \exp(-x^2)\cdot\Big(1,\ \sqrt{\frac{2}{1!}}\,x,\ \sqrt{\frac{2^2}{2!}}\,x^2,\ \dots\Big)
$$

$\boldsymbol{\Phi}(x)$ 的分量是所有次數的 $x^i$ 各乘上一個係數，前面再共同乘上 $\exp(-x^2)$。所以高斯函數裡藏著一個無限多維的轉換，而算它只要一次減法、一次平方和一次指數。

**本文的數值驗證（不在講義上）。** 取 $x = 1$、$x' = 0.5$，$K = \exp(-0.25) = 0.778801$。把 $\boldsymbol{\Phi}(1)$ 與 $\boldsymbol{\Phi}(0.5)$ 的分量一個一個乘起來累加：

| 加到第 $i$ 項 | $\boldsymbol{\Phi}(1)$ 的第 $i$ 個分量 | $\boldsymbol{\Phi}(0.5)$ 的第 $i$ 個分量 | 累計的內積 |
|---|---|---|---|
| 0 | $0.3679$ | $0.7788$ | $0.2865$ |
| 1 | $0.5203$ | $0.5507$ | $0.5730$ |
| 2 | $0.5203$ | $0.2753$ | $0.7163$ |
| 4 | $0.3004$ | $0.0397$ | $0.7760$ |
| 6 | $0.1097$ | $0.0036$ | $0.77874$ |
| 8 | $0.0293$ | $0.0002$ | $0.77880$ |

只取前 3 個分量時內積是 0.7163，離真正的值還差 8%；加到第 8 項才對到小數第五位。無限維的向量確實每一維都有貢獻，只是愈後面愈小。

講義最後一行說「more generally」，多維輸入、加上縮放參數的版本就是 Gaussian kernel：

$$
K(\mathbf{x}, \mathbf{x}') = \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2\big), \qquad \gamma > 0
$$

講義沒有推導這個一般式，課堂上只說可以證明它裡面同樣埋了一個無限多維的轉換。本文補充推導的大意。一維加上 $\gamma$ 時，四個步驟完全相同，只是 $2xx'$ 換成 $2\gamma xx'$，得到 $\boldsymbol{\Phi}(x) = \exp(-\gamma x^2)\big(1, \sqrt{\frac{2\gamma}{1!}}x, \sqrt{\frac{(2\gamma)^2}{2!}}x^2, \dots\big)$。多維時，$\lVert\mathbf{x} - \mathbf{x}'\rVert^2 = \mathbf{x}^\top\mathbf{x} - 2\,\mathbf{x}^\top\mathbf{x}' + \mathbf{x}'^\top\mathbf{x}'$，混在一起的因子變成 $\exp(2\gamma\,\mathbf{x}^\top\mathbf{x}') = \sum_i \frac{(2\gamma)^i}{i!}(\mathbf{x}^\top\mathbf{x}')^i$。其中 $(\mathbf{x}^\top\mathbf{x}')^i$ 是 $\zeta = 0$、$\gamma = 1$ 的 $i$ 次多項式 kernel，本身就是所有 $i$ 次單項式排成的向量的內積；把每個 $i$ 的向量各乘上 $\sqrt{(2\gamma)^i/i!}$ 再接成一長串，就是那個無限維的 $\boldsymbol{\Phi}$。

### Gaussian SVM 的 hypothesis 長什麼樣

有了 kernel，直接丟進 kernel trick 那一節的四步演算法。講義第 13 頁把最後的分類器寫出來：

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\Big) = \text{sign}\Big(\sum_{\text{SV}}\alpha_n y_n \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2\big) + b\Big)
$$

把 $\mathbf{x}$ 當變數看，$\exp(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2)$ 是一個中心在 $\mathbf{x}_n$ 的高斯函數。所以 $g_{\text{SVM}}$ 是一堆高斯函數的線性組合，每個高斯的中心都在一個支援向量上，係數是 $\alpha_n y_n$。

Gaussian kernel 的另一個名字 Radial Basis Function（RBF）kernel 就是從這個樣子來的。課堂上拆開解釋：radial 指的是像高斯這樣、從某個中心往外擴散出去的函數；basis function 指的是拿來做線性組合的函數。課堂上也提到，有些 SVM 軟體裡看到的 RBF kernel 指的就是它。

同一個分類器於是有兩種讀法，課堂上兩種都講了：

- **從過程看：** 把資料映射到無限多維的空間，在那裡找一個最胖的超平面。
- **從結果看：** SVM 幫你決定用哪些高斯（中心在哪些支援向量上）以及怎麼組合它們（$\alpha_n$；$y_n$ 是資料本來就有的）。

講義的總結把兩者合在一句：Gaussian SVM 找出 $\alpha_n$ 來組合中心在 $\mathbf{x}_n$ 的高斯，並且在無限維空間達到 large margin。

### Support vector 機制到這裡湊齊了

講義第 14 頁回顧技法前三堂合起來做到的事。表格只有兩列：

| | large-margin 超平面 + 用 kernel trick 做高次轉換 |
|---|---|
| 邊界的數量 | 不多 |
| 邊界的形狀 | 複雜 |

large margin 讓可以選的邊界變少，轉換讓邊界夠複雜。技法第 1 堂講義第 26 頁已經把這個組合列為 a new possibility（large-margin 超平面加上大量的特徵轉換：數量不多、邊界複雜），這一頁的表格是那張表的同一欄，轉換的部分改寫成 higher-order transforms with kernel trick。當時缺的是計算上的可行性，現在由兩個替換補上：

- 轉換後的向量 $\mathbf{z} = \boldsymbol{\Phi}(\mathbf{x})$ 換成算得快的 kernel $K(\mathbf{x}, \mathbf{x}')$。
- 儲存最佳的 $\mathbf{w}$ 換成儲存少數幾個支援向量與 $\alpha_n$。

課堂上的講法是我們「不再執著」於兩件事：不再執著於把 $\mathbf{z}$ 算出來，也不再執著於把 Z 空間的 $\mathbf{w}$ 存下來，只存它的表示方式。講義說 Gaussian SVM 帶來一個新的可能：無限維的線性分類，泛化由 large margin「把關」。

### γ 太大會怎樣

故事有這麼美好嗎？課堂上自己問了這一句，接著看講義第 15 頁的三張圖。同一組資料、同樣是 Gaussian kernel，只換 $\gamma$：

| $\gamma$ | 邊界的樣子 | 課堂上的形容 |
|---|---|---|
| $1$ | 一條平滑的曲線，紅叉都在曲線下方 | 看起來還不錯，large margin 有發揮效果 |
| $10$ | 邊界多出好幾個凹凸，紅色區域伸出觸角 | 像變形蟲 |
| $100$ | 紅叉外面各包一個小圈（靠得很近的幾個連成一塊），其餘全是藍色 | 每個叉叉都是一座小島，各自為政 |

為什麼會這樣？課堂上的解釋：$\gamma$ 變大相當於高斯的標準差變小，高斯變尖；分類器是一堆高斯的線性組合，高斯都變尖了，組合出來就是一座一座的小島。講義寫成 large $\gamma$ ⟹ sharp Gaussians ⟹ 'overfit'?，下面一行是紅字的 warning: SVM can still overfit。

課堂上對這件事講得很直白：在無限多維的空間裡，SVM「自我感覺良好」，覺得自己找到了最胖的邊界；但那個胖對應回原來的空間不見得夠。large margin 的保護夠不夠強，還要看轉換本身，兩者相輔相成。所以講義的結論是 Gaussian SVM 需要小心選 $\gamma$，課堂上的建議是通常不要用太大的 $\gamma$。

**本文自擬的例子：三個點上的小島。** 回到 kernel trick 那一節的三個點（$-1$、$0$、$1$，標籤 $+1$、$-1$、$+1$），kernel 換成 $\exp(-\gamma(x - x')^2)$，四個步驟照舊。相鄰兩點距離 1，kernel 值記成 $k = e^{-\gamma}$；兩端的點距離 2，記成 $m = e^{-4\gamma}$；自己和自己是 1。

$$
Q_D = \begin{bmatrix} 1 & -k & m \\ -k & 1 & -k \\ m & -k & 1 \end{bmatrix}
$$

同樣用 $\alpha_2 = \alpha_1 + \alpha_3$ 消去 $\alpha_2$，記 $s = \alpha_1 + \alpha_3$，目標函數是 $\frac{1}{2}\big(\alpha_1^2 + \alpha_3^2 + 2m\alpha_1\alpha_3 + (1 - 2k)s^2\big) - 2s$。對 $\alpha_1$ 與 $\alpha_3$ 偏微分：

$$
\alpha_1 + m\alpha_3 + (1 - 2k)s - 2 = 0, \qquad \alpha_3 + m\alpha_1 + (1 - 2k)s - 2 = 0
$$

兩式相減得 $(1 - m)(\alpha_1 - \alpha_3) = 0$，所以 $\alpha_1 = \alpha_3 = a$、$s = 2a$。代回去：$a\,(1 + m + 2 - 4k) = 2$，

$$
\alpha_1 = \alpha_3 = \frac{2}{3 - 4k + m}, \qquad \alpha_2 = 2\alpha_1
$$

用第 2 點算 $b$：$b = -1 - \big[a k - 2a + a k\big] = -1 + 2a(1 - k)$。分類器是

$$
g_{\text{SVM}}(x) = \text{sign}\Big(a\,e^{-\gamma(x+1)^2} - 2a\,e^{-\gamma x^2} + a\,e^{-\gamma(x-1)^2} + b\Big)
$$

三個高斯，中心各在一個支援向量上，中間那個係數是負的。代三個 $\gamma$：

| $\gamma$ | $k = e^{-\gamma}$ | $m = e^{-4\gamma}$ | $\alpha_1 = \alpha_3$ | $\alpha_2$ | $b$ | 判成 $-1$ 的範圍 |
|---|---|---|---|---|---|---|
| $1$ | $0.3679$ | $0.0183$ | $1.2930$ | $2.5860$ | $0.6347$ | $\lvert x\rvert < 0.588$ |
| $10$ | $4.5 \times 10^{-5}$ | $4.2 \times 10^{-18}$ | $0.6667$ | $1.3334$ | $0.3334$ | $\lvert x\rvert < 0.367$ |
| $100$ | $3.7 \times 10^{-44}$ | 約 $0$ | $0.6667$ | $1.3333$ | $0.3333$ | $\lvert x\rvert < 0.118$ |

三個 $\gamma$ 都把訓練資料完全分對，三個訓練點的 $y_n \times$ 分數都是 1（本文逐一驗算過）。差別在負例周圍那塊區域的大小：$\gamma = 1$ 時寬 1.18，$\gamma = 100$ 時只剩 0.24。在 $\gamma = 100$ 的分類器眼中，只有緊貼著 $x = 0$ 的點才是負的。$x = 0.2$ 離負例 0.2、離最近的正例 0.8，卻被判成 $+1$，原因是三個高斯在那裡都已經衰減到幾乎是 0，分數只剩 $b = \frac{1}{3}$。這就是講義圖上「小島」的一維版本：離開每個訓練點一小段距離，分類器就只剩一個常數在作主。相較之下，多項式 kernel 在同一組資料上給的負例區是 $\lvert x\rvert < 0.707$。

只有三個點，談不上哪個 $\gamma$ 才對。這個例子要看的是機制：$\gamma$ 愈大，每個支援向量能影響的範圍愈小。

### Fun Time：γ 趨近無限大時的 kernel

**題目（第 16 頁）：** Gaussian kernel $K(\mathbf{x}, \mathbf{x}') = \exp(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2)$。$\gamma \to \infty$ 時，它收斂到哪個函數？（$[\![\cdot]\!]$ 是條件成立為 1、不成立為 0 的指示函數。）

1. $K_{\lim}(\mathbf{x}, \mathbf{x}') = 0$
2. $K_{\lim}(\mathbf{x}, \mathbf{x}') = [\![\mathbf{x} = \mathbf{x}']\!]$
3. $K_{\lim}(\mathbf{x}, \mathbf{x}') = [\![\mathbf{x} \ne \mathbf{x}']\!]$
4. $K_{\lim}(\mathbf{x}, \mathbf{x}') = 1$

**答案：2。** 分兩種情況。$\mathbf{x} = \mathbf{x}'$ 時距離是 0，$\exp(0) = 1$，和 $\gamma$ 無關。$\mathbf{x} \ne \mathbf{x}'$ 時距離的平方是某個正數 $c$，$\exp(-\gamma c)$ 在 $\gamma \to \infty$ 時趨近 0。講義的解答說這個極限是一個 impulse function，是高斯隨 $\gamma$ 變尖的極端情況。

選項 1 漏了 $\mathbf{x} = \mathbf{x}'$ 的情況；選項 3 把兩種情況弄反；選項 4 是另一個方向的極限，$\gamma \to 0$ 時 kernel 才處處趨近 1。

課堂上對這個極限的評語是，這個 kernel 只是在辨認每一筆資料是不是它自己，可以想像它對量測誤差的容忍度非常低。上面三個點的例子正好看得到這個極限：$k$ 與 $m$ 都變成 0，$Q_D$ 變成單位矩陣，解是 $\boldsymbol{\alpha} = (\frac{2}{3}, \frac{4}{3}, \frac{2}{3})$、$b = \frac{1}{3}$，表中 $\gamma = 100$ 那一列已經和它幾乎相同。這時分類器只在三個訓練點本身給出 $1$、$-1$、$1$，其他地方一律輸出 $\text{sign}(\frac{1}{3}) = +1$：訓練資料全對，但它學到的只有「背下這三個點」。

## 三種 kernel 怎麼選，什麼函數才算 kernel

```youtube
url: https://www.youtube.com/watch?v=sacJmcs8TKE
title: Kernel Support Vector Machine :: Comparison of Kernels @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:51 是 linear kernel，01:51–04:47 多項式 kernel，04:47–06:53 Gaussian kernel，06:53–11:16 談其他合法的 kernel 與 Mercer 條件，11:16–11:52 Fun Time，之後是整堂的總結。）

### 三種 kernel 的優缺點

講義第 17 到 19 頁各用一頁列一種 kernel 的 Cons 與 Pros。先合成一張表，再補課堂上的說明。

| kernel | 缺點 | 優點 | 講義的一句話 |
|---|---|---|---|
| linear：$\mathbf{x}^\top\mathbf{x}'$ | 受限，資料不一定線性可分 | 安全；快，原始問題有專門的 QP 解算器；容易解釋，$\mathbf{w}$ 與支援向量都說得出意義 | 重要的基本工具 |
| 多項式：$(\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^Q$ | $Q$ 大時數值困難；三個參數 $(\gamma, \zeta, Q)$ 較難選 | 限制比 linear 少；$Q$ 有明確的物理意義 | 大概只用小的 $Q$ |
| Gaussian：$\exp(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2)$ | 沒有 $\mathbf{w}$，難以解釋；比 linear 慢；可能太強 | 比前兩者更有表達力；值有界，數值困難比多項式少；只有一個參數 | 最常用之一，但要小心用 |

**linear kernel。** 「快」的理由課堂上講得比較細：因為不牽涉任何轉換，可以針對原始問題設計專門的 QP 解算器，通常比走對偶快，走對偶光是算 $Q_D$ 就要花很大的力氣。「容易解釋」指的是 $\mathbf{w}$ 的每個分量是對應特徵的權重，支援向量則告訴你機器認為哪些點重要。缺點那一格，投影片放了一張圖：紅叉分布在外圍、藍圈在中間，一條直線分不開。課堂上的定位是：要用 SVM，linear 是應該先試的工具。

**多項式 kernel。** 數值困難的來源，講義寫了兩行：$\lvert\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}'\rvert < 1$ 時 $K \to 0$，大於 1 時 $K$ 變得很大。課堂上用 20 次方當例子；本文算一下：$0.5^{20} \approx 9.5 \times 10^{-7}$，$2^{20} = 1{,}048{,}576$，底數只差 4 倍，kernel 值差了 12 個數量級。課堂上說數值範圍這麼大，對一般的 QP 解算器是困難的工作，也比較容易解得不準。「物理意義」的例子是：如果你認為特徵之間最多是三次方的關係，可以直接用 $Q = 3$ 表達這個想像。參數多的代價是，把 $(\gamma, \zeta, Q)$ 的各種組合都試過要花很多時間。

講義頁尾有一句容易略過的話：多項式 kernel 有時用 linear on $\boldsymbol{\Phi}_Q(\mathbf{x})$ 做比較有效率。課堂上展開說明：次數很低（例如二次、三次）而且 $\tilde{d}$ 還不太大時，直接把轉換展開、用解 linear SVM 原始問題的專門解算器去解，有時反而比較快；不必認定多項式轉換就一定要走 kernel。

**Gaussian kernel。** 「值有界」是因為高斯函數的值落在 0 到 1 之間，不會像多項式那樣爆掉。「難以解釋」課堂上用了一個場景：老闆問你這個模型怎麼做分類，你回答先到無限多維的空間、找出一個最胖的東西、再回來，老闆聽到第二句就恍神了。「比 linear 慢」是因為必須解對偶問題、要把 $Q_D$ 算出來。「太強」就是 Gaussian kernel 那一節的小島。課堂上的總結是它大概是最常用的 SVM kernel 之一，代價是參數要小心選、計算要等，而且你不完全知道分類是怎麼做出來的。

講義第 22 頁把這一節收成一句：linear for efficiency or Gaussian for power。

### 其他函數能不能當 kernel：Mercer 條件

只能用這三種嗎？講義第 20 頁從 kernel 的意義談起：kernel 代表一種特殊的相似度，也就是 $\boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}')$。課堂上解釋內積為什麼是相似度：兩個向量垂直時內積是 0，可以說它們很不相似；方向相反時內積是負的。

那麼隨便拿一個相似度函數當 kernel 丟進 SVM 可以嗎？講義的回答是 not really。kernel 是一種相似度，但它是「Z 空間裡向量內積」這種特定的相似度，不是每一種相似度都能寫成某個空間的內積。課堂上說，要用自己的 kernel，就得想辦法說明它為什麼是個 kernel。

先看必要條件：如果 $K$ 真的是某個 $\boldsymbol{\Phi}$ 的內積，它一定有哪些性質？

**對稱。** 向量內積是對稱的，$\boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}') = \boldsymbol{\Phi}(\mathbf{x}')^\top\boldsymbol{\Phi}(\mathbf{x})$，所以 $K(\mathbf{x}, \mathbf{x}') = K(\mathbf{x}', \mathbf{x})$。

**kernel 矩陣半正定。** 任取 $N$ 個點 $\mathbf{x}_1, \dots, \mathbf{x}_N$，把 $k_{ij} = K(\mathbf{x}_i, \mathbf{x}_j)$ 排成 $N \times N$ 的矩陣，講義也把這個矩陣記成 $K$：

$$
K = \begin{bmatrix} \boldsymbol{\Phi}(\mathbf{x}_1)^\top\boldsymbol{\Phi}(\mathbf{x}_1) & \boldsymbol{\Phi}(\mathbf{x}_1)^\top\boldsymbol{\Phi}(\mathbf{x}_2) & \cdots & \boldsymbol{\Phi}(\mathbf{x}_1)^\top\boldsymbol{\Phi}(\mathbf{x}_N) \\ \boldsymbol{\Phi}(\mathbf{x}_2)^\top\boldsymbol{\Phi}(\mathbf{x}_1) & \boldsymbol{\Phi}(\mathbf{x}_2)^\top\boldsymbol{\Phi}(\mathbf{x}_2) & \cdots & \boldsymbol{\Phi}(\mathbf{x}_2)^\top\boldsymbol{\Phi}(\mathbf{x}_N) \\ \vdots & \vdots & \ddots & \vdots \\ \boldsymbol{\Phi}(\mathbf{x}_N)^\top\boldsymbol{\Phi}(\mathbf{x}_1) & \boldsymbol{\Phi}(\mathbf{x}_N)^\top\boldsymbol{\Phi}(\mathbf{x}_2) & \cdots & \boldsymbol{\Phi}(\mathbf{x}_N)^\top\boldsymbol{\Phi}(\mathbf{x}_N) \end{bmatrix}
$$

每一格左邊的因子只跟列有關，右邊的因子只跟行有關（投影片上分別是藍色與紅色）。把 $\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n)$ 當成列，疊成一個矩陣 $Z$，整個矩陣就是

$$
K = \begin{bmatrix} \mathbf{z}_1 & \mathbf{z}_2 & \cdots & \mathbf{z}_N \end{bmatrix}^\top \begin{bmatrix} \mathbf{z}_1 & \mathbf{z}_2 & \cdots & \mathbf{z}_N \end{bmatrix} = ZZ^\top
$$

講義說 $ZZ^\top$ 一定是半正定（positive semi-definite）的，課堂上說這是線性代數裡很基本的結果。本文把這一步補上：對任意向量 $\mathbf{v} \in \mathbb{R}^N$，

$$
\mathbf{v}^\top K\mathbf{v} = \mathbf{v}^\top ZZ^\top\mathbf{v} = (Z^\top\mathbf{v})^\top(Z^\top\mathbf{v}) = \Big\lVert\sum_{n=1}^{N} v_n\mathbf{z}_n\Big\rVert^2 \ge 0
$$

一個向量的長度平方不會是負的，這就是半正定的定義。

這兩條合稱 Mercer 條件（Mercer's condition）。講義寫的是 necessary & sufficient：它們不只是必要條件，也是充分條件。滿足這兩條的函數，一定存在某個 $\boldsymbol{\Phi}$ 讓它等於 $\boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}')$。課堂上交代，充分性是數學家證明的，比較難，這門課不講。

用法有兩個方向，難度差很多。要否定一個函數，只要找到一組資料讓矩陣不是半正定就夠了，下面的 Fun Time 就是這樣做。要肯定一個函數，得證明任意一組資料、任意的 $N$ 算出來的矩陣都半正定，課堂上說這其實沒有那麼容易。講義的評語是：自己定義 kernel 做得到，但很難。課堂上的建議是，哪天真的要定義自己的 kernel，把這個條件放在心上。

本文補充它和 SVM 的關係。[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)那篇補充過，對偶問題是凸的，靠的是 $\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = \lVert\sum_n \alpha_n y_n\mathbf{z}_n\rVert^2 \ge 0$。換成 kernel 之後，$\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = \sum_n\sum_m (\alpha_n y_n)(\alpha_m y_m)K(\mathbf{x}_n, \mathbf{x}_m)$，就是取 $v_n = \alpha_n y_n$ 的 $\mathbf{v}^\top K\mathbf{v}$。kernel 矩陣半正定，$Q_D$ 才半正定，QP 才是凸的。丟一個不合法的函數進去，背後沒有任何 Z 空間，交給 QP 解算器的也可能不再是凸問題。

### Fun Time：哪一個不是合法的 kernel

**題目（第 21 頁）：** 下面哪一個不是合法的 kernel？（提示：考慮兩個一維向量 $\mathbf{x}_1 = (1)$ 與 $\mathbf{x}_2 = (-1)$，檢查 Mercer 條件。）

1. $K(\mathbf{x}, \mathbf{x}') = (-1 + \mathbf{x}^\top\mathbf{x}')^2$
2. $K(\mathbf{x}, \mathbf{x}') = (0 + \mathbf{x}^\top\mathbf{x}')^2$
3. $K(\mathbf{x}, \mathbf{x}') = (1 + \mathbf{x}^\top\mathbf{x}')^2$
4. $K(\mathbf{x}, \mathbf{x}') = (-1 - \mathbf{x}^\top\mathbf{x}')^2$

**答案：1。** 照提示把四個 2×2 矩陣算出來。兩個點的內積是 $\mathbf{x}_1^\top\mathbf{x}_1 = 1$、$\mathbf{x}_1^\top\mathbf{x}_2 = -1$、$\mathbf{x}_2^\top\mathbf{x}_2 = 1$。

| 選項 | 對角線：$K(\mathbf{x}_1, \mathbf{x}_1) = K(\mathbf{x}_2, \mathbf{x}_2)$ | 非對角線：$K(\mathbf{x}_1, \mathbf{x}_2)$ | 特徵值 |
|---|---|---|---|
| 1 | $(-1 + 1)^2 = 0$ | $(-1 - 1)^2 = 4$ | $4$ 與 $-4$ |
| 2 | $(0 + 1)^2 = 1$ | $(0 - 1)^2 = 1$ | $2$ 與 $0$ |
| 3 | $(1 + 1)^2 = 4$ | $(1 - 1)^2 = 0$ | $4$ 與 $4$ |
| 4 | $(-1 - 1)^2 = 4$ | $(-1 + 1)^2 = 0$ | $4$ 與 $4$ |

2×2 的對稱矩陣，對角線都是 $p$、非對角線都是 $q$ 時，特徵值是 $p + q$ 與 $p - q$（特徵向量是 $(1, 1)$ 與 $(1, -1)$）。選項 1 的矩陣是

$$
K = \begin{bmatrix} 0 & 4 \\ 4 & 0 \end{bmatrix}
$$

它有一個負的特徵值，不是半正定。直接驗也可以：取 $\mathbf{v} = (1, -1)$，$\mathbf{v}^\top K\mathbf{v} = 0 - 4 - 4 + 0 = -8 < 0$。一組資料就足以否定它。

其他三個選項，這兩個點的矩陣都半正定，但這只說明它們通過了這一次測試，不能當成合法的證明。講義的解答給的是真正的理由：選項 2 與 3 本來就是多項式 kernel（$\zeta = 0$ 與 $\zeta = 1$，$\gamma = 1$，$Q = 2$），有明確的轉換；選項 4 因為 $(-1 - t)^2 = (1 + t)^2$，和選項 3 是同一個函數。

本文補充兩個看法。第一，選項 1 就是 $\zeta = -1$ 的「多項式 kernel」，違反了講義要求的 $\zeta \ge 0$，接上了多項式 kernel 那一節 Fun Time 留下的問題。第二，不算特徵值也看得出矛盾：$K(\mathbf{x}_1, \mathbf{x}_1) = 0$ 代表 $\lVert\boldsymbol{\Phi}(\mathbf{x}_1)\rVert^2 = 0$，$\boldsymbol{\Phi}(\mathbf{x}_1)$ 只能是零向量；零向量和任何向量的內積都是 0，$K(\mathbf{x}_1, \mathbf{x}_2)$ 卻是 4。

把它硬丟進 SVM 會怎樣？本文試算：令 $\mathbf{x}_1$ 標 $+1$、$\mathbf{x}_2$ 標 $-1$，$Q_D$ 的對角線是 0，非對角線是 $(+1)(-1)(4) = -4$。等式限制給 $\alpha_1 = \alpha_2 = a$，目標函數是 $\frac{1}{2}(-8a^2) - 2a = -4a^2 - 2a$，$a$ 愈大值愈小，沒有最小值。對偶問題直接壞掉。

### 這堂課的總結與下一堂

講義第 22 頁把四節各收成一句：kernel 是「轉換＋內積」的捷徑；多項式 kernel 嵌入了帶特定縮放的多項式轉換；Gaussian kernel 嵌入了無限維的轉換；要效率選 linear，要表達力選 Gaussian。

課堂上最後指出一件到目前為止一直沒鬆口的事：從技法第 1 堂到現在，我們都堅持資料在 Z 空間要線性可分。這個堅持可能讓 SVM 去擬合雜訊，Gaussian kernel 那一節看到的過擬合就和它有關。講義預告下一堂要處理的是 avoiding overfitting in Gaussian (and other kernels)。

## 自我檢查

**1. $\mathbf{x} = (1, 2)$、$\mathbf{x}' = (2, 0)$。算出四個 kernel 值：$K_{\boldsymbol{\Phi}_2}$；$\gamma = 1$ 的 $K_2 = (1 + \gamma\,\mathbf{x}^\top\mathbf{x}')^2$；$\zeta = 2$、$\gamma = 0.5$、$Q = 3$ 的多項式 kernel；$\gamma = 0.5$ 的 Gaussian kernel。**

答案：$\mathbf{x}^\top\mathbf{x}' = 2$，$\lVert\mathbf{x} - \mathbf{x}'\rVert^2 = (-1)^2 + 2^2 = 5$。依序是 $1 + 2 + 4 = 7$；$(1 + 2)^2 = 9$；$(2 + 0.5 \times 2)^3 = 27$；$\exp(-2.5) \approx 0.0821$。四個數字都只用到原始空間的內積或距離。

**2. 在三個點的例子裡（多項式 kernel $K_2 = (1 + xx')^2$，$\boldsymbol{\alpha} = (1, 2, 1)$，$b = -1$），不要用 $2x^2 - 1$ 這條整理過的式子，只用 kernel 值預測 $x = 0.6$ 的標籤。**

答案：$K(-1, 0.6) = (1 - 0.6)^2 = 0.16$，$K(0, 0.6) = 1$，$K(1, 0.6) = (1 + 0.6)^2 = 2.56$。分數是 $(1)(+1)(0.16) + (2)(-1)(1) + (1)(+1)(2.56) - 1 = -0.28$，預測 $-1$。用 $2 \times 0.36 - 1 = -0.28$ 檢查，一致。

**3. kernel SVM 訓練完之後沒有 $\mathbf{w}$。那 $b$ 是怎麼算出來的？預測時又是怎麼算 $\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x})$ 的？**

判準：答案要說出 $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$ 是支援向量的線性組合；$\mathbf{w}$ 只以「和某個 $\mathbf{z}$ 做內積」的形式出現，代入後變成 $\sum_n \alpha_n y_n\,\mathbf{z}_n^\top\mathbf{z}$，每一項都是兩個 $\mathbf{z}$ 的內積，可以換成 $K(\mathbf{x}_n, \mathbf{x})$；所以 $b = y_s - \sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)$，預測用 $\sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b$。只說「用 kernel 算」而沒提到 $\mathbf{w}$ 是線性組合，不算答對。

**4. $K(\mathbf{x}, \mathbf{x}') = -\mathbf{x}^\top\mathbf{x}'$ 是不是合法的 kernel？$K(\mathbf{x}, \mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}'$ 呢？**

答案：第一個不是。它對稱，但只取一個點 $\mathbf{x}_1 = (1)$，1×1 的矩陣是 $[-1]$，不是半正定；換個說法，$K(\mathbf{x}, \mathbf{x})$ 是 $\lVert\boldsymbol{\Phi}(\mathbf{x})\rVert^2$，不能是負的。第二個是：它是 $\zeta = 1$、$\gamma = 1$、$Q = 1$ 的多項式 kernel，對應的轉換是 $\boldsymbol{\Phi}(\mathbf{x}) = (1, x_1, \dots, x_d)$，直接寫得出來。

**5. $N = 10{,}000$ 筆資料、$d = 100$ 個特徵，想用 10 次多項式轉換訓練 SVM。走原始問題要面對幾個變數？走 kernel 的話，準備 $Q_D$ 大約要多少計算？**

答案：10 次多項式轉換去掉重複後的維度是 $\binom{110}{10} - 1 \approx 4.7 \times 10^{13}$，原始問題的變數個數就是這個數字加 1，連一個 $\mathbf{z}_n$ 都存不下來。走 kernel：$Q_D$ 有 $10^8$ 個元素（利用對稱性約一半），每個是一次 100 維的內積加幾個運算，總共約 $10^{10}$ 次乘法，一般的電腦做得到。代價是 $Q_D$ 本身有 $10^8$ 個元素要存，以及預測時每筆新資料要和每個支援向量各算一次 kernel。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把 kernel SVM 與 soft-margin SVM 排在同一週（W10，11/04），這堂的投影片代號是 `203u`。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W10（11/11），兩堂一起上。Fall 2026 的 `203u_handout.pdf` 連結在 2026-09-30 打開是 404，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 e-8.3。e-Chapter 8 是 LFD 的線上章節，不在紙本書裡。

**作業。** 相關的題目在 [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止），沒有官方解答：

| 題 | 內容 | 對應這堂的哪裡 |
|---|---|---|
| Q1 | 把 kernel trick 套到 PLA：維護 $\boldsymbol{\alpha}$ 而不是 $\mathbf{w}$ | 算 $b$ 與預測時「$\mathbf{w}$ 是 $\mathbf{z}_n$ 的線性組合」那一步 |
| Q7 | $\gamma$ 夠大時，Gaussian kernel 可以讓 $E_{\text{in}} = 0$ | Gaussian kernel 那一節的 Fun Time 與三個點的例子 |
| Q8 | 證明 $\exp(2\cos(x - x') - 2)$ 是合法的 kernel | Mercer 條件與 Gaussian kernel |
| Q10 | MNIST 3 對 7，多項式 kernel，比較不同 $C$ 與 $Q$ 的支援向量數 | 多項式 kernel（$C$ 是下一堂的參數） |
| Q11 | 同一份資料，Gaussian kernel，比較不同 $C$ 與 $\gamma$ 的 margin | Gaussian kernel（$C$ 是下一堂的參數） |

Q10、Q11 用到 soft-margin 的參數 $C$，讀完下一堂再做。程式題的資料是 LIBSVM 網站上的 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)，題目建議用 [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)，並提醒兩件事：不要讓套件自動縮放資料，否則等於換了 kernel；以及要自己確認套件解的是課堂上的對偶形式，數值精度也夠。第一點和這堂的內容直接相關（以下是本文的說明）：把所有特徵同乘一個常數 $c$，$\mathbf{x}^\top\mathbf{x}'$ 與 $\lVert\mathbf{x} - \mathbf{x}'\rVert^2$ 都變成 $c^2$ 倍，效果等於把 $\gamma$ 換成 $c^2\gamma$；每個特徵各自縮放不同的倍數，則是換成另一個 kernel。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**動手做。** 把三個點的例子換一個 kernel 重做一次：用 $K_{\boldsymbol{\Phi}_2}(x, x') = 1 + xx' + (xx')^2$，照四個步驟解出 $\boldsymbol{\alpha}$、$b$ 與邊界。本文算過，答案仍是 $\boldsymbol{\alpha} = (1, 2, 1)$、$b = -1$、邊界 $2x^2 - 1 = 0$。想一想為什麼在這組資料上兩個 kernel 給出同一個答案（提示：兩個轉換只差在一次項的係數，而最佳的 $\mathbf{w}$ 在一次項上的分量是多少）。

**延伸閱讀。** [CS229 主講義第 5 章](https://cs229.stanford.edu/main_notes.pdf)用另一種順序介紹 kernel 方法，可以和這堂的寫法對照。[Caltech Learning from Data](https://work.caltech.edu/telecourse) 是同一本教科書的英文課。

**下一堂。** [技法第 4 堂：軟邊界 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm) 放寬「資料一定要完全分開」的要求，處理這堂在 Gaussian kernel 看到的過擬合。

## 課程影片來源

原始影片：[Kernel Trick](https://www.youtube.com/watch?v=oOi7kqUTqxw)、[Polynomial Kernel](https://www.youtube.com/watch?v=Fb-WSBvsPak)、[Gaussian Kernel](https://www.youtube.com/watch?v=_-fIkbSBdF8)、[Comparison of Kernels](https://www.youtube.com/watch?v=sacJmcs8TKE)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：原本與第 4 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [技法第 3 堂講義 203_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time、第 8、9、15 頁的圖與三種 kernel 的優缺點都出自這份講義。
- [技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)：對偶問題、KKT 條件與從 α 算回 w 與 b 的式子，這堂直接沿用。
- [基石第 12 堂：非線性轉換](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)：Q 次多項式轉換的維度公式，用來換算 d̃。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次與 LFD 章節。
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)：Q1、Q7、Q8、Q10、Q11 的題目內容。
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)：HW6 程式題建議使用的套件。
- [LIBSVM Data：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)：HW6 程式題的資料。
- [Learning from Data 教科書網站](http://amlbook.com)：e-8.3 的出處。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：延伸閱讀，第 5 章的 kernel 方法。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：延伸閱讀，同一本教科書的英文課。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
