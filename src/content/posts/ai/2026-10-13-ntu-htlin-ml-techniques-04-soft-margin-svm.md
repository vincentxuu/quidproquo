---
title: "軟邊界 SVM：允許犯錯之後怎麼選 C｜台大林軒田 機器學習技法 第 4 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, model-selection, cross-validation]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 21
tldr: "hard-margin SVM 堅持把資料完全分開，所以會去擬合雜訊。這堂課替每個點加一個違反量 ξₙ，用參數 C 權衡邊界寬度與違反總量，得到 soft-margin SVM；它的對偶問題和 hard-margin 只差 αₙ 多了上界 C。αₙ 的值把資料分成非支援向量、free SV、bounded SV 三類，算 b 要用 free SV；C 與 γ 用交叉驗證選，支援向量的比例 #SV/N 是 leave-one-out 誤差的上界。"
description: "台大林軒田機器學習技法第 4 堂 Soft-Margin Support Vector Machine 導讀：違反量 ξₙ 與參數 C、soft-margin 對偶問題的完整推導、用 free SV 算 b、αₙ 的三種情形、交叉驗證與支援向量個數做模型選擇，附一組六個點的手算例子。"
draft: false
glossary:
  - term: "soft-margin SVM"
    aliases: ["軟邊界 SVM", "soft-margin support vector machine"]
    definition: "允許部分資料違反胖邊界的 SVM：替每個點加一個違反量 ξₙ，最小化 ½wᵀw + C·Σξₙ。"
    context: "技法第 4 堂的主題；資料不能完全分開時仍然有解。"
  - term: "違反量"
    aliases: ["margin violation", "ξₙ"]
    definition: "第 n 個點的 yₙ(wᵀzₙ + b) 比 1 少了多少；沒有少就是 0。大於 1 表示這個點被分錯。"
    context: "soft-margin SVM 懲罰的是違反量的總和，不是分錯的個數。"
  - term: "free SV"
    aliases: ["free support vector", "自由支援向量"]
    definition: "soft-margin SVM 中 0 < αₙ < C 的支援向量。它的 ξₙ = 0，剛好落在胖邊界上。"
    context: "技法第 4 堂用它算出唯一的 b。"
  - term: "bounded SV"
    aliases: ["bounded support vector", "有界支援向量"]
    definition: "soft-margin SVM 中 αₙ = C 的支援向量，ξₙ 等於它違反胖邊界的量。"
    context: "技法第 4 堂用 αₙ 的值把訓練點分成三類；只有 bounded SV 可能被分錯。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [204_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 4 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂仍在第一種 Embedding Numerous Features: Kernel Models 裡面。同一頁對上一堂[技法第 3 堂：Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)的總結是：kernel 是「轉換加內積」的捷徑，SVM 因此不再依賴轉換後的維度 $\tilde{d}$，可以從簡單的線性模型一路用到無限維的 Gaussian kernel。上一堂講 Gaussian kernel 時留了一句警告：SVM 還是會過擬合。這堂處理的就是這件事。

先備是[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)的整套推導（拉格朗日函數、對 $b$ 與 $\mathbf{w}$ 偏微分、KKT 條件、互補鬆弛）、上一堂的 kernel 函數 $K(\mathbf{x}, \mathbf{x}')$，以及[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)的交叉驗證。讀完之後，你應該能自己寫出 soft-margin SVM 的原始問題並推到對偶問題，說明 $\alpha_n$ 的上界 $C$ 從哪裡來，由解出來的 $\boldsymbol{\alpha}$ 判斷每個點落在哪裡、用哪些點算 $b$，並解釋支援向量的個數為什麼能當模型選擇時的安全檢查。

這堂的四節依序回答四個問題：

1. 資料分不開、或不該硬分開時，問題要怎麼改寫。
2. 改寫之後對偶問題長什麼樣子。
3. 解出 $\boldsymbol{\alpha}$ 之後怎麼算 $b$，$\alpha_n$ 的值代表什麼。
4. 多出來的參數 $C$（以及 kernel 的參數）怎麼選。

## 為什麼要允許犯錯：堅持分開的代價，以及違反量 ξ 與參數 C

```youtube
url: https://www.youtube.com/watch?v=K7ZcAYXuU_A
title: Soft-Margin Support Vector Machine :: Motivation and Primal @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:12 複習上一堂，01:12–03:00 講 hard-margin 的毛病，03:00–06:39 把 pocket 與 hard-margin 合起來，06:39–08:54 講合體的兩個問題，08:54–13:50 是違反量與參數 $C$，之後是 Fun Time。）

### hard-margin SVM 的毛病

講義第 2 頁把上一堂的警告拆成兩個原因。SVM 會過擬合，一部分是因為轉換 $\boldsymbol{\Phi}$ 太強，另一部分是因為 hard-margin 堅持資料要完全分開（separable）。課堂上對第一個原因的說法是：有的轉換能力太強，就算有 large margin 也救不回來。

這一頁放了兩張圖，用的是同一組資料。左圖標 $\boldsymbol{\Phi}_1$，一條直線把圈圈和叉叉大致分開，有幾個點落在錯的一邊。右圖標 $\boldsymbol{\Phi}_4$，用四次多項式轉換之後，一條彎來彎去的邊界把每個點都分對。課堂上的評語是：看左圖會覺得用一條線、犯一點錯是合理的假說；如果堅持每個圈圈叉叉都要分對，就會走到右圖，得到的雖然是 large-margin 的邊界，卻不見得是對這份資料最合理的解釋。

講義的結論寫成一行：如果永遠堅持 separable（也就是 shatter），就有能力去擬合雜訊。課堂上補了中間那一步：不管來的是什麼樣的圈圈叉叉組合都要能完全分開，這正是[基石第 5 堂：訓練與測試](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)說的 shatter；什麼標記都做得出來，雜訊當然也照單全收。

### 把 pocket 和 hard-margin SVM 合起來

講義第 3 頁的標題是 Give Up on Some Examples：想放棄一些有雜訊的資料。課堂上回頭找以前怎麼處理雜訊，找到的是[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 pocket：找不到一條線把資料分開時，改找犯錯最少的線，那些分不對的點就算了。兩個舊方法並排：

| | 最小化什麼 | 限制式 |
|---|---|---|
| pocket | 分錯的個數 $\sum_{n=1}^{N} [\![ y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{z}_n + b) ]\!]$ | 沒有 |
| hard-margin SVM | $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ | 每個 $n$ 都要 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$ |

$[\![\cdot]\!]$ 是基石用過的記號，括號裡的敘述成立時值是 1，不成立是 0。講義把兩者合成一個問題：

$$
\begin{aligned}
\min_{b,\mathbf{w}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\cdot\sum_{n=1}^{N} [\![ y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{z}_n + b) ]\!] \\
\text{subject to}\quad & y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 \quad \text{for correct } n \\
& y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge -\infty \quad \text{for incorrect } n
\end{aligned}
$$

分對的點照舊要離邊界夠遠。分錯的點寫成「大於等於負無限大」，課堂上解釋這就是沒有條件、不管它。只放寬限制式還不夠：課堂上指出，如果做錯也沒關係，機器乾脆全部做錯就好，所以目標函數要像 pocket 一樣把分錯的個數加進去，能不犯錯就不犯錯。

目標函數現在有兩項，一項要 $\mathbf{w}$ 短（邊界胖），一項要錯誤少，兩者的相對重要性由參數 $C$ 決定。講義的說法是 $C$: trade-off of large margin & noise tolerance。$C$ 大代表比較在意不要犯錯，$C$ 小代表比較在意分對的那些點邊界要寬。課堂上把這個新問題稱為 hard-margin SVM 與 pocket 的合體。

### 合體的兩個問題

講義第 4 頁先把兩條限制式併成一條：

$$
y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \infty\cdot[\![ y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{z}_n + b) ]\!]
$$

分對時右邊是 1，分錯時右邊是負無限大。接著列出這個寫法的兩個毛病。

**第一，它不是 QP。** $[\![\cdot]\!]$ 是「對或錯」的布林運算，不是線性的。[技法第 1 堂：線性 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)說過，二次規劃要求目標函數是二次式、限制式是一次式；現在兩邊都出現了既不是一次也不是二次的東西。課堂上說這代表之前推導的對偶、kernel 那些機制通通用不上。課堂上還提了一句，pocket 本身就是 NP-hard 的問題，這個合體同樣不好解。

**第二，它分不出小錯和大錯。** 講義的寫法是 small error（slightly away from fat boundary）與 large error（a...w...a...y... from fat boundary）。課堂上舉的數字是：一個該是圈圈的點，分數是 $-0.001$，幾乎就要對了；另一個同樣該是圈圈，分數是 $-1126$，離邊界非常遠。在上面的式子裡，這兩個點都只算「一個錯誤」。

### 改記違反量：soft-margin SVM

解法是替每個點多設一個變數 $\xi_n \ge 0$，記錄它的 margin violation（本文譯為違反量）。課堂上的定義是：我們想要 $y_n$ 乘上分數至少是 1，$\xi_n$ 記的是這個點離「1」還差多少。差得少是小錯，差得多是大錯。然後把懲罰的對象從「錯了幾個」換成「總共違反多少」，講義稱為 penalize with margin violation instead of error count：

$$
\begin{aligned}
\min_{b,\mathbf{w},\boldsymbol{\xi}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\cdot\sum_{n=1}^{N}\xi_n \\
\text{subject to}\quad & y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n \ \text{ and } \ \xi_n \ge 0 \quad \text{for all } n
\end{aligned}
$$

這就是 soft-margin SVM。課堂上對名字的解釋是：對 margin 的要求不再是 hard、強硬不可更改，而是 soft，允許一些違反。兩個毛病都處理掉了：

- **限制式是一次式。** $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n$ 對 $(b, \mathbf{w}, \xi_n)$ 是線性的，$\xi_n \ge 0$ 也是。
- **目標函數是二次式。** 課堂上的講法是原本有 $\mathbf{w}$ 的二次式，加上 $\xi_n$ 的一次式，合起來是 $(\mathbf{w}, \boldsymbol{\xi})$ 的二次式。所以它仍然是 QP。
- **大錯小錯分得出來。** 課堂上說，錯誤不再非黑即白，容許灰色地帶，大錯小錯各自算好再加起來當作懲罰。

講義第 5 頁的圖畫了一條綠色的胖邊界，有一個藍點落在帶子裡面，旁邊標著 violation，並畫出它到帶子邊緣的那一段。課堂上說這個點落在胖邊界裡面，所以違規了，它和胖邊界邊緣的距離就是違規的量。本文補充：嚴格說，$\xi_n$ 是用「分數」的單位量的，幾何上的距離是 $\xi_n / \lVert\mathbf{w}\rVert$，兩者差一個固定的倍數。

同一頁整理參數 $C$ 的意思，現在是 trade-off of large margin & margin violation：

- **$C$ 大：** 想要違反少。課堂上的說法是寧可邊界瘦一點，也不要有違反的地方。
- **$C$ 小：** 想要邊界胖。很多點違反就算了。

最後數一下這個 QP 的大小。變數有 $b$、$\mathbf{w}$ 的 $\tilde{d}$ 個分量、$N$ 個 $\xi_n$，共 $\tilde{d}+1+N$ 個。限制式每個點兩條，共 $2N$ 條；課堂上說多出來的 $N$ 條就是 $\xi_n \ge 0$，因為違反量只在有違反時才記，不能是負的。變數個數裡還有 $\tilde{d}$，所以下一步和前兩堂一樣：推對偶問題，把 $\tilde{d}$ 拿掉。

### 數值例子：六個點，分不開

以下是本文自擬的例子，不在講義上；後面三節會一直沿用它。資料是一維的，不做特徵轉換，$z_n = x_n$：

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $0$ | $-1$ |
| 2 | $3$ | $-1$ |
| 3 | $4$ | $+1$ |
| 4 | $6$ | $-1$ |
| 5 | $7$ | $+1$ |
| 6 | $10$ | $+1$ |

大致上左邊是負例、右邊是正例，但第 3 點和第 4 點的位置對調了：正例在 4，負例在 6。

**hard-margin SVM 沒有解。** 第 3 點要求 $4w + b \ge 1$，第 4 點要求 $6w + b \le -1$，兩式相減得 $2w \le -2$，也就是 $w \le -1$。第 2 點要求 $3w + b \le -1$，第 5 點要求 $7w + b \ge 1$，相減得 $4w \ge 2$，也就是 $w \ge \frac{1}{2}$。兩個要求互相矛盾，沒有任何 $(b, w)$ 滿足全部限制式。

**soft-margin 的目標函數怎麼評分。** 對一組給定的 $(b, w)$，每個 $\xi_n$ 要滿足 $\xi_n \ge 1 - y_n(wx_n + b)$ 與 $\xi_n \ge 0$，而目標函數希望它愈小愈好，所以 $\xi_n$ 會取兩個下限裡比較大的那個（這也是這一節 Fun Time 的重點）。拿四組候選來算：

| 候選 | $(w, b)$ | 邊界 | 胖邊界兩緣 | $(\xi_1, \dots, \xi_6)$ | $\sum\xi_n$ | 分錯幾個 |
|---|---|---|---|---|---|---|
| 甲 | $(\frac{1}{2}, -\frac{5}{2})$ | $x = 5$ | $x = 3$、$x = 7$ | $(0, 0, \frac{3}{2}, \frac{3}{2}, 0, 0)$ | $3$ | 2 |
| 乙 | $(1, -5)$ | $x = 5$ | $x = 4$、$x = 6$ | $(0, 0, 2, 2, 0, 0)$ | $4$ | 2 |
| 丙 | $(\frac{1}{5}, -1)$ | $x = 5$ | $x = 0$、$x = 10$ | $(0, \frac{3}{5}, \frac{6}{5}, \frac{6}{5}, \frac{3}{5}, 0)$ | $\frac{18}{5}$ | 2 |
| 丁 | $(2, -7)$ | $x = 3.5$ | $x = 3$、$x = 4$ | $(0, 0, 0, 6, 0, 0)$ | $6$ | 1 |

以候選甲的第 3 點為例：$y_3(wx_3 + b) = (+1)(\frac{1}{2}\cdot 4 - \frac{5}{2}) = -\frac{1}{2}$，離 1 差了 $1 - (-\frac{1}{2}) = \frac{3}{2}$，所以 $\xi_3 = \frac{3}{2}$。候選丙的第 2 點：$y_2(wx_2 + b) = (-1)(\frac{3}{5} - 1) = \frac{2}{5}$，分對了但落在胖邊界裡面，$\xi_2 = \frac{3}{5}$。違反量小於 1 的點還在正確的一邊，大於 1 的點已經被分錯。

再把 $\frac{1}{2}w^2 + C\sum\xi_n$ 算出來：

| 候選 | $\frac{1}{2}w^2$ | $C = 1$ 的目標值 | $C = \frac{1}{20}$ 的目標值 |
|---|---|---|---|
| 甲 | $\frac{1}{8}$ | $\frac{1}{8} + 3 = 3.125$ | $\frac{1}{8} + \frac{3}{20} = 0.275$ |
| 乙 | $\frac{1}{2}$ | $\frac{1}{2} + 4 = 4.5$ | $\frac{1}{2} + \frac{4}{20} = 0.7$ |
| 丙 | $\frac{1}{50}$ | $\frac{1}{50} + \frac{18}{5} = 3.62$ | $\frac{1}{50} + \frac{18}{100} = 0.2$ |
| 丁 | $2$ | $2 + 6 = 8$ | $2 + \frac{6}{20} = 2.3$ |

**這個結果代表什麼。**

- $C = 1$ 時甲的目標值最低，$C = \frac{1}{20}$ 時丙最低。丙的胖邊界半寬是 $1/w = 5$，甲只有 2；丙的違反總量 $\frac{18}{5}$ 比甲的 3 多。$C$ 變小，換來的是比較胖的邊界與比較多的違反，和講義第 5 頁說的方向一致。這兩組也真的是各自的最佳解：本文用 $w$ 與 $b$ 各以 $\frac{1}{40}$ 為間隔的格點把目標函數掃過一遍，並在後面「數值例子：六個點的對偶問題」與「數值例子：六個點的 b 與 KKT」兩段用對偶解與 KKT 條件確認。
- 候選丁只分錯一個點，是這份資料能做到的最少錯誤數（正例在 4、負例在 6，左邊判負、右邊判正的門檻不管放哪裡都至少分錯其中一個；反過來左正右負的話，兩端的四個點會全錯）。但在 soft-margin SVM 的評分裡，它在兩個 $C$ 底下都是最差的：邊界很瘦，而且第 4 點離它想要的位置非常遠，$\xi_4 = 6$。把 $C$ 調到 100 也一樣，甲是 $\frac{1}{8} + 300$，丁是 $2 + 600$。soft-margin SVM 最小化的是違反量的總和，和「分錯的個數最少」是兩個不同的目標。
- 對照講義第 3 頁那個數錯誤個數的合體：甲的目標值是 $\frac{1}{8} + 2C$，丁是 $2 + C$。$C = 1$ 時甲比較好（$2.125$ 對 $3$），$C = 10$ 時丁比較好（$20.125$ 對 $12$）。兩種寫法在同一份資料上會選出不同的線。
- 甲和乙的邊界都在 $x = 5$，乙的胖邊界比較瘦，違反量反而比較大（2 對 $\frac{3}{2}$）。原因是 $\xi_n$ 用分數的單位量：$w$ 愈大，同一段距離換算成的分數差愈大。

### Fun Time：違反量是多少

**題目（第 6 頁）：** 在 soft-margin SVM 原始問題的最佳解上，假設 $y_1(\mathbf{w}^\top\mathbf{z}_1 + b) = -10$。對應的 $\xi_1$ 是多少？

1. $1$
2. $11$
3. $21$
4. $31$

**答案：2。** 講義的解答是：$y_1(\mathbf{w}^\top\mathbf{z}_1 + b) \le 1$ 時，$\xi_1$ 就是 $1 - y_1(\mathbf{w}^\top\mathbf{z}_1 + b)$。課堂上的講法更短：我們要的是 1，現在是 $-10$，差了 11。

推理補完整：限制式要求 $\xi_1 \ge 1 - (-10) = 11$，以及 $\xi_1 \ge 0$。目標函數裡 $\xi_1$ 的係數是 $C > 0$，最佳解不會讓它比必要的還大，所以 $\xi_1 = 11$。一般的寫法是 $\xi_n = \max\big(0,\ 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big)$。選項 1 不滿足限制式（$1 < 11$）；選項 3 與 4 滿足限制式，但白白多付了 $10C$ 與 $20C$ 的懲罰，不會是最佳解。

## 推對偶問題：多一組乘數，結果只多一個上界

```youtube
url: https://www.youtube.com/watch?v=fTHTqW5Uq4U
title: Soft-Margin Support Vector Machine :: Dual Problem @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:02 寫拉格朗日函數，02:02–04:55 消去 $\xi_n$ 與 $\beta_n$，04:55–06:10 其餘的化簡，06:10–07:10 標準對偶問題，之後是 Fun Time。）

### 兩組限制式，兩組乘數

做法和技法第 2 堂完全相同：先寫拉格朗日函數，每條限制式配一個乘數。現在限制式有兩組（講義第 7 頁用紅色與藍色區分），所以乘數也有兩組：

- $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n$ 配 $\alpha_n$。移項成「小於等於 0」的形式是 $1 - \xi_n - y_n(\mathbf{w}^\top\mathbf{z}_n + b) \le 0$。
- $\xi_n \ge 0$ 配 $\beta_n$。移項後是 $-\xi_n \le 0$。

課堂上特別提醒要注意符號，每條都要先移成小於等於 0 的那一邊。拉格朗日函數是目標函數加上「乘數乘以該條限制式」：

$$
\mathcal{L}(b, \mathbf{w}, \boldsymbol{\xi}, \boldsymbol{\alpha}, \boldsymbol{\beta}) = \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\cdot\sum_{n=1}^{N}\xi_n + \sum_{n=1}^{N}\alpha_n\big(1 - \xi_n - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) + \sum_{n=1}^{N}\beta_n(-\xi_n)
$$

要解的拉格朗日對偶問題是

$$
\max_{\alpha_n \ge 0,\ \beta_n \ge 0}\ \Big( \min_{b,\mathbf{w},\boldsymbol{\xi}}\ \mathcal{L}(b, \mathbf{w}, \boldsymbol{\xi}, \boldsymbol{\alpha}, \boldsymbol{\beta}) \Big)
$$

本文補充：講義在這裡直接寫「want: Lagrange dual」，沒有重講為什麼可以改解對偶問題。理由和技法第 2 堂一樣，需要強對偶的三個條件：原始問題是凸的、限制式是線性的、原始問題有解。前兩個一看就成立。第三個在 hard-margin 時要求資料可分，soft-margin 則永遠成立：取 $\mathbf{w} = \mathbf{0}$、$b = 0$、每個 $\xi_n = 1$，所有限制式都滿足。這就是講義第 12 頁說 soft-margin 的原始與對偶問題 always solvable 的原因。

### 先消去 ξ 和 β

內層的 $\min$ 對 $(b, \mathbf{w}, \boldsymbol{\xi})$ 沒有任何限制，最小值的地方偏微分是 0。講義第 8 頁從新的變數 $\xi_n$ 下手。$\mathcal{L}$ 裡含某一個特定 $\xi_n$ 的地方有三處，課堂上一處一處找：目標函數裡的 $C\xi_n$、$\alpha_n$ 那一項裡的 $-\alpha_n\xi_n$、$\beta_n$ 那一項的 $-\beta_n\xi_n$。所以

$$
\frac{\partial\mathcal{L}}{\partial\xi_n} = C - \alpha_n - \beta_n = 0
$$

也就是在最佳解上，$\alpha_n$ 和 $\beta_n$ 加起來剛好是 $C$。講義接著說，把 $\beta_n = C - \alpha_n$ 當成隱含的限制來解，不會損失最佳性，於是 $\beta_n$ 可以整個換掉。換掉之前要確認原本對兩組乘數的要求還在：

- $\alpha_n \ge 0$：照舊。
- $\beta_n \ge 0$：換成 $C - \alpha_n \ge 0$，也就是 $\alpha_n \le C$。

所以只要要求 $0 \le \alpha_n \le C$，$\beta_n$ 就自動大於等於 0，課堂上說從此完全不用再考慮 $\beta$。**$\alpha_n$ 的上界 $C$ 就是從這裡來的**：它是「$\beta_n$ 不能是負的」換了一個寫法。

本文補充一個看法，說明為什麼加這條限制不損失最佳性。把 $\mathcal{L}$ 裡含 $\xi_n$ 的項收在一起是 $(C - \alpha_n - \beta_n)\,\xi_n$，對 $\xi_n$ 是一次式。係數只要不是 0，內層的 min 就能把 $\xi_n$ 往正確的方向推到無限遠，讓 $\mathcal{L}$ 變成 $-\infty$。外層在找最大值，不會選這種 $(\boldsymbol{\alpha}, \boldsymbol{\beta})$，所以只需要考慮係數是 0 的情形。這和技法第 2 堂處理 $b$ 的理由相同。

把 $\beta_n = C - \alpha_n$ 代進去之後，含 $\xi_n$ 的項是

$$
\sum_{n=1}^{N}\big(C - \alpha_n - \beta_n\big)\,\xi_n = \sum_{n=1}^{N}\big(C - \alpha_n - (C - \alpha_n)\big)\,\xi_n = 0
$$

投影片把這一項整個劃掉。課堂上說這次消去有兩個效果：$\beta_n$ 不見了，更重要的是所有 $\xi_n$ 也不見了，就像 hard-margin 時把 $b$ 消掉一樣。剩下的問題是

$$
\max_{0 \le \alpha_n \le C,\ \beta_n = C - \alpha_n}\ \bigg( \min_{b,\mathbf{w}}\ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) \bigg)
$$

### 剩下的和 hard-margin 一模一樣

講義第 9 頁在這個式子旁邊寫了「familiar? :-)」。括號裡的內層問題和技法第 2 堂 hard-margin 的內層問題完全相同，差別只在外面 $\alpha_n$ 多了上界。課堂上說這些步驟兩堂之前都做過，細節不再重做，不確定的人回去看第 2 堂。這裡把步驟補齊。

**對 $b$ 偏微分。** $\mathcal{L}$ 裡含 $b$ 的部分是 $-b\sum_n\alpha_n y_n$，所以

$$
\frac{\partial\mathcal{L}}{\partial b} = -\sum_{n=1}^{N}\alpha_n y_n = 0
$$

加上 $\sum_n\alpha_n y_n = 0$ 這條限制之後，含 $b$ 的項消失。

**對 $\mathbf{w}$ 偏微分。** 第 $i$ 個分量：$\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ 微分得 $w_i$，$-\alpha_n y_n\mathbf{w}^\top\mathbf{z}_n$ 微分得 $-\alpha_n y_n z_{n,i}$，所以

$$
\frac{\partial\mathcal{L}}{\partial w_i} = w_i - \sum_{n=1}^{N}\alpha_n y_n z_{n,i} = 0 \quad\Longrightarrow\quad \mathbf{w} = \sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n
$$

**代回去。** $b$ 的項已經消掉，剩下 $\sum_n\alpha_n(1 - y_n\mathbf{w}^\top\mathbf{z}_n) = \sum_n\alpha_n - \mathbf{w}^\top\big(\sum_n\alpha_n y_n\mathbf{z}_n\big) = \sum_n\alpha_n - \mathbf{w}^\top\mathbf{w}$，內層的最小值是

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\mathbf{w} = -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 + \sum_{n=1}^{N}\alpha_n
$$

### 標準的 soft-margin 對偶問題

把範數的平方展開成雙重加總，再乘上 $-1$ 把 max 換成 min，就是講義第 10 頁的 standard soft-margin SVM dual：

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}}\quad & \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y_n y_m\mathbf{z}_n^\top\mathbf{z}_m - \sum_{n=1}^{N}\alpha_n \\
\text{subject to}\quad & \sum_{n=1}^{N} y_n\alpha_n = 0; \\
& 0 \le \alpha_n \le C,\quad n = 1, 2, \dots, N
\end{aligned}
$$

另外有兩條隱含的關係，不是對 $\boldsymbol{\alpha}$ 的限制，但之後會用到：$\mathbf{w} = \sum_n\alpha_n y_n\mathbf{z}_n$，以及 $\beta_n = C - \alpha_n$。

講義在式子下面寫：和 hard-margin 唯一的差別是 $\alpha_n$ 有上界。課堂上的說法是，會解 hard-margin 的對偶，現在這個也會解，只是 $\alpha$ 不再毫無上限。這仍然是凸的 QP，變數 $N$ 個；限制式照課堂上的數法，是一條等式，加上每個 $\alpha_n$ 的下限 0 與上限 $C$ 各一條，共 $2N + 1$ 條。變數與限制式的數量都和 $\tilde{d}$ 無關，$\mathbf{z}_n^\top\mathbf{z}_m$ 也可以照上一堂換成 kernel。

和原始問題並排看：

| | 原始問題 | 對偶問題 |
|---|---|---|
| 變數 | $\tilde{d} + 1 + N$ 個 | $N$ 個 |
| 限制式 | $2N$ 條 | $2N + 1$ 條 |
| $C$ 出現在哪裡 | 目標函數裡 $\sum\xi_n$ 的係數 | $\alpha_n$ 的上界 |
| $\xi_n$ | 是變數 | 消掉了，事後再算 |

### 數值例子：六個點的對偶問題

沿用前面的六個點（本文自擬）。一維的情況下 $w = \sum_n\alpha_n y_n x_n$ 是一個數：

$$
w(\boldsymbol{\alpha}) = -0\cdot\alpha_1 - 3\alpha_2 + 4\alpha_3 - 6\alpha_4 + 7\alpha_5 + 10\alpha_6
$$

對偶問題是最小化 $\frac{1}{2}w(\boldsymbol{\alpha})^2 - \sum_n\alpha_n$，限制式是 $-\alpha_1 - \alpha_2 + \alpha_3 - \alpha_4 + \alpha_5 + \alpha_6 = 0$ 與 $0 \le \alpha_n \le C$。

**先看沒有上界會怎樣。** 取 $\boldsymbol{\alpha} = (0, \frac{t}{2}, t, t, \frac{t}{2}, 0)$，$t \ge 0$。等式限制：$-\frac{t}{2} + t - t + \frac{t}{2} = 0$，成立。$w = -\frac{3t}{2} + 4t - 6t + \frac{7t}{2} = 0$。目標函數是 $0 - 3t$。$t$ 愈大目標值愈低，沒有下限。hard-margin 的原始問題在這份資料上沒有解，反映到對偶問題就是目標函數可以無限制地往下掉。加上 $\alpha_n \le C$ 之後，$t$ 最多只能到 $C$，這個方向就被擋住了。

**解 $C = 1$。** 六個變數的 QP 直接手解很繁，這裡用「先猜型態、再求解、最後驗證」的做法。原始問題那邊的候選甲暗示：第 1、6 點離胖邊界很遠，第 3、4 點違反胖邊界，第 2、5 點剛好在邊緣上。猜 $\alpha_1 = \alpha_6 = 0$，$\alpha_3 = \alpha_4 = 1$（頂到上界；為什麼違反的點會頂到上界，後面「α 的值把資料分成三類」那一段說明）。等式限制變成 $-\alpha_2 + 1 - 1 + \alpha_5 = 0$，所以 $\alpha_2 = \alpha_5$，記成 $a$。這時

$$
w = -3a + 4 - 6 + 7a = 4a - 2, \qquad \text{objective} = \frac{1}{2}(4a - 2)^2 - 2 - 2a
$$

對 $a$ 微分：$4(4a - 2) - 2 = 16a - 10 = 0$，$a = \frac{5}{8}$，落在 0 與 1 之間。所以

$$
\boldsymbol{\alpha} = \Big(0,\ \frac{5}{8},\ 1,\ 1,\ \frac{5}{8},\ 0\Big), \qquad w = \frac{1}{2}, \qquad \text{objective} = \frac{1}{8} - \frac{13}{4} = -\frac{25}{8}
$$

**驗證這真的是最佳解。** 把對偶問題寫回 max 的形式，這組 $\boldsymbol{\alpha}$ 的值是 $\frac{25}{8} = 3.125$。技法第 2 堂的弱對偶說，任何一組合法的 $\boldsymbol{\alpha}$ 給出的值都不會超過原始問題的最佳值；而候選甲 $(w, b) = (\frac{1}{2}, -\frac{5}{2})$ 在原始問題的目標值正好也是 $3.125$。下界和一個實際做得到的值相等，所以甲是原始問題的最佳解，這組 $\boldsymbol{\alpha}$ 是對偶問題的最佳解，強對偶在這個例子上看得到。

注意 $w$ 是從 $\boldsymbol{\alpha}$ 算出來的 $\frac{1}{2}$，和候選甲一致；$b$ 則還沒出現，對偶問題裡沒有它。

### Fun Time：C 加 2，對偶問題怎麼變

**題目（第 11 頁）：** 在 soft-margin SVM 裡，想把參數 $C$ 增加 2。對應的對偶問題該怎麼改？

1. $\alpha_n$ 的上界減半
2. $\alpha_n$ 的上界減少 2
3. $\alpha_n$ 的上界增加 2
4. $\alpha_n$ 的上界加倍

**答案：3。** 講義的解答是：$C$ 就是 $\alpha_n$ 的上界，原始問題的 $C$ 加 2，等於對偶問題的上界加 2。課堂上舉的例子是 $C$ 從 10 變成 12，$\alpha_n$ 的上限也從 10 變成 12。

從推導看，上界來自 $\beta_n = C - \alpha_n \ge 0$，$C$ 原封不動地出現在右邊，沒有被乘或除過，所以是「加多少就加多少」。選項 1 與 2 的方向反了。選項 4 只有在 $C$ 剛好從 2 變成 4 時才碰巧說對。對偶問題的目標函數與等式限制裡都沒有 $C$，不需要改。

## 解出 α 之後：怎麼算 b，每個點的 α 透露什麼

```youtube
url: https://www.youtube.com/watch?v=5z7ujI3YBBE
title: Soft-Margin Support Vector Machine :: Messages @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:55 是 kernel soft-margin SVM 演算法，01:55–05:47 算 $b$，05:47–08:28 看不同 $C$ 的 Gaussian SVM，08:28–12:32 講 $\alpha_n$ 的物理意義，之後是 Fun Time。）

### Kernel soft-margin SVM 演算法

講義第 12 頁把上一堂的 kernel hard-margin SVM 演算法改了一個地方：

1. 算 $q_{n,m} = y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)$，$\mathbf{p} = -\mathbf{1}_N$，以及表示等式、下界、**上界**三類限制式的 $(A, \mathbf{c})$。
2. $\boldsymbol{\alpha} \leftarrow \text{QP}(Q_D, \mathbf{p}, A, \mathbf{c})$。
3. $b \leftarrow\ ?$
4. 回傳支援向量、它們的 $\alpha_n$ 與 $b$。對新的 $\mathbf{x}$，

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV indices } n}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\Big)
$$

第 1 步多的是上界那一組限制式，課堂上說它來自參數 $C$。本文補充：用技法第 1 堂 QP 解算器只收「$\ge$」的格式來寫，上界 $\alpha_n \le C$ 要寫成 $-\alpha_n \ge -C$。

講義對這個演算法的評語有兩點。它和 hard-margin 幾乎一樣；而且更有彈性，原始與對偶問題永遠有解。課堂上的說法是：hard-margin 要資料可分才有解，現在不用，總會得到一個解，還可以用 $C$ 調整比較在乎胖的邊界還是比較在乎少犯錯；soft-margin 是實務上比較常用的 SVM 形式。這一節後面，課堂上乾脆直接把 soft-margin SVM 叫作 SVM。

剩下的問題是第 3 步。QP 換了，KKT 條件也跟著變，$b$ 還能照以前的方式算嗎？

### 算 b 要用 free SV

先列出互補鬆弛。技法第 2 堂的規則是：每條限制式和它的乘數，至少有一個是 0（課堂上沿用哈利波特與佛地魔不能同時活著的比喻）。hard-margin 只有一條：

$$
\alpha_n\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) = 0
$$

soft-margin 有兩組限制式，所以有兩條（講義第 13 頁）：

$$
\alpha_n\big(1 - \xi_n - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) = 0, \qquad (C - \alpha_n)\,\xi_n = 0
$$

第二條原本是 $\beta_n\cdot(-\xi_n) = 0$。課堂上說明，$\beta_n$ 已經知道是 $C - \alpha_n$，負號不影響「乘起來是 0」，所以直接寫成 $(C - \alpha_n)\xi_n = 0$。

照 hard-margin 的做法，找一個支援向量 $(\mathbf{z}_s, y_s)$，$\alpha_s > 0$。第一條逼得括號是 0：

$$
1 - \xi_s - y_s(\mathbf{w}^\top\mathbf{z}_s + b) = 0 \quad\Longrightarrow\quad y_s(\mathbf{w}^\top\mathbf{z}_s + b) = 1 - \xi_s
$$

兩邊同乘 $y_s$（$y_s^2 = 1$）：$\mathbf{w}^\top\mathbf{z}_s + b = y_s - y_s\xi_s$，所以

$$
b = y_s - y_s\xi_s - \mathbf{w}^\top\mathbf{z}_s
$$

比 hard-margin 多了一項 $y_s\xi_s$。麻煩在於 $\xi_s$ 是違反量，要先知道 $b$ 才算得出來。課堂上說這變成雞生蛋、蛋生雞，算不完。

解法是想辦法讓那一項是 0。第二條互補鬆弛說，只要 $C - \alpha_s \ne 0$，也就是 $\alpha_s < C$，就有 $\xi_s = 0$。同時滿足 $0 < \alpha_s < C$ 的支援向量叫 **free SV**；課堂上解釋 free 是自由自在、沒有被 $C$ 綁住的意思。對 free SV，

$$
b = y_s - \mathbf{w}^\top\mathbf{z}_s = y_s - \sum_{\text{SV indices } n}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)
$$

和 hard-margin 的式子一樣，內積照樣由 kernel 算。課堂上說任何一個 free SV 都會給出同一個 $b$。

沒有 free SV 的時候呢？講義只寫了一句「range of $b$ otherwise」。課堂上的補充是：這種情形很少見，但會發生；這時 $b$ 只能由一組不等式限制，可能有不只一個答案，只要滿足所有 KKT 條件的 $b$ 都可以。細節課堂上沒有講，下面的例子會遇到一次。

### 數值例子：六個點的 b 與 KKT

（本文自擬，接續前面的六個點。）$C = 1$ 時 $\boldsymbol{\alpha} = (0, \frac{5}{8}, 1, 1, \frac{5}{8}, 0)$、$w = \frac{1}{2}$。free SV 是第 2、5 點：

- 用第 2 點：$b = y_2 - wx_2 = -1 - \frac{3}{2} = -\frac{5}{2}$。
- 用第 5 點：$b = y_5 - wx_5 = 1 - \frac{7}{2} = -\frac{5}{2}$。

兩個 free SV 給出同一個 $b$。如果誤用 $\alpha_3 = C$ 的第 3 點代 hard-margin 的式子，會得到 $b = 1 - 2 = -1$，是錯的；用完整的式子 $b = y_3 - y_3\xi_3 - wx_3 = 1 - \frac{3}{2} - 2 = -\frac{5}{2}$ 才對，但那需要先知道 $\xi_3 = \frac{3}{2}$。

有了 $b$，每個點的 $\xi_n = \max(0, 1 - y_n(wx_n + b))$ 就算得出來，兩條互補鬆弛可以逐點檢查：

| $n$ | $x_n$ | $y_n$ | $\alpha_n$ | $y_n(wx_n + b)$ | $\xi_n$ | $\alpha_n(1 - \xi_n - y_n(wx_n + b))$ | $(C - \alpha_n)\xi_n$ | 類別 |
|---|---|---|---|---|---|---|---|---|
| 1 | $0$ | $-1$ | $0$ | $\frac{5}{2}$ | $0$ | $0$ | $0$ | 非支援向量 |
| 2 | $3$ | $-1$ | $\frac{5}{8}$ | $1$ | $0$ | $0$ | $0$ | free SV |
| 3 | $4$ | $+1$ | $1$ | $-\frac{1}{2}$ | $\frac{3}{2}$ | $0$ | $0$ | bounded SV |
| 4 | $6$ | $-1$ | $1$ | $-\frac{1}{2}$ | $\frac{3}{2}$ | $0$ | $0$ | bounded SV |
| 5 | $7$ | $+1$ | $\frac{5}{8}$ | $1$ | $0$ | $0$ | $0$ | free SV |
| 6 | $10$ | $+1$ | $0$ | $\frac{5}{2}$ | $0$ | $0$ | $0$ | 非支援向量 |

其餘的條件也成立：$\sum_n y_n\alpha_n = -\frac{5}{8} + 1 - 1 + \frac{5}{8} = 0$，每個 $\alpha_n$ 都在 0 與 1 之間，每個點都滿足 $y_n(wx_n + b) \ge 1 - \xi_n$。分類器是 $g(x) = \text{sign}(\frac{1}{2}x - \frac{5}{2})$，邊界在 $x = 5$，胖邊界從 3 到 7。

**換幾個 $C$ 看看。** 同樣的做法（猜型態、求解、驗 KKT，數字另外用程式以分數精確計算核對過）得到：

| $C$ | $\boldsymbol{\alpha}$ | $w$ | 胖邊界半寬 $1/w$ | $b$ | $\sum\xi_n$ | free SV | bounded SV |
|---|---|---|---|---|---|---|---|
| $\frac{1}{20}$ | $(\frac{1}{100}, \frac{1}{20}, \frac{1}{20}, \frac{1}{20}, \frac{1}{20}, \frac{1}{100})$ | $\frac{1}{5}$ | $5$ | $-1$ | $\frac{18}{5}$ | 第 1、6 點 | 第 2、3、4、5 點 |
| $\frac{1}{5}$ | $(0, \frac{1}{5}, \frac{1}{5}, \frac{1}{5}, \frac{1}{5}, 0)$ | $\frac{2}{5}$ | $\frac{5}{2}$ | $-\frac{11}{5}$ 到 $-\frac{9}{5}$ | $\frac{16}{5}$ | 沒有 | 第 2、3、4、5 點 |
| $1$ | $(0, \frac{5}{8}, 1, 1, \frac{5}{8}, 0)$ | $\frac{1}{2}$ | $2$ | $-\frac{5}{2}$ | $3$ | 第 2、5 點 | 第 3、4 點 |
| $100$ | $(0, \frac{401}{8}, 100, 100, \frac{401}{8}, 0)$ | $\frac{1}{2}$ | $2$ | $-\frac{5}{2}$ | $3$ | 第 2、5 點 | 第 3、4 點 |

這張表有三件事可以看：

- **$C$ 變大，邊界變瘦、違反變少。** $C$ 從 $\frac{1}{20}$ 到 1，胖邊界半寬從 5 縮到 2，違反總量從 $\frac{18}{5}$ 降到 3，bounded SV 從四個減到兩個。
- **$C = \frac{1}{5}$ 沒有 free SV。** 照 $C = 1$ 的型態解會得到 $a = \frac{C}{2} + \frac{1}{8} = \frac{9}{40}$，超過上界 $\frac{1}{5}$，所以第 2、5 點也頂到上界，四個支援向量全是 bounded。這時 $b$ 只受不等式限制：第 2 點是 bounded，要求 $y_2(wx_2 + b) \le 1$，即 $-(\frac{6}{5} + b) \le 1$，$b \ge -\frac{11}{5}$；第 5 點要求 $\frac{14}{5} + b \le 1$，$b \le -\frac{9}{5}$。這個範圍裡的每個 $b$ 目標值都是 $\frac{18}{25}$，都是最佳解。這就是講義那句「range of $b$ otherwise」。
- **$C$ 從 1 加到 100，分類器沒有變。** 第 3、4 點的位置對調，任何一條線都救不回來，$C$ 再大也只是讓 $\alpha$ 跟著變大。在這個例子裡，只要 $C \ge \frac{1}{4}$，$a = \frac{C}{2} + \frac{1}{8}$ 就不超過上界，解出來的都是 $w = \frac{1}{2}$、$b = -\frac{5}{2}$，$C$ 再調大也不會有不同的分類器。講義接下來的圖用的是 Gaussian kernel，邊界可以一直彎，情況不同。

### 不同 C 的 Gaussian SVM

講義第 14 頁用同一組資料、Gaussian kernel，放了 $C = 1$、$10$、$100$ 三張圖。課堂上先說明圖怎麼讀：黑線是邊界，上面是藍色區域、下面是紅色區域；灰色的地方是 margin，也就是 $\mathcal{Z}$ 空間裡那條胖邊界對回 $\mathcal{X}$ 空間的樣子。

- **$C = 1$：** 邊界平緩，灰色區域寬。課堂上指出這張圖裡有不少違反：有紅色的點落在藍色區域（分錯），也有藍色的點雖然在對的那一邊，卻落在灰色區域裡。
- **$C = 10$：** 邊界開始彎，灰色區域變窄，違反變少。課堂上舉了一個剛才分錯的藍點，現在到了對的那一邊，只是還在灰色區域裡，從大錯變成小錯。
- **$C = 100$：** 邊界更曲折，圖的上方甚至圍出一小圈，把一個孤立的叉叉也分對了。

講義的註解是 large $C$ ⟹ less noise tolerance ⟹ 'overfit'?，並再寫一次 warning: SVM can still overfit。課堂上對 $C = 100$ 那張圖的反問是：有必要做到這麼複雜嗎，上面那個叉叉會不會根本只是雜訊。$C$ 沒調好，soft-margin SVM 對雜訊的容忍度不夠，一樣會過擬合。所以講義的結論是 Gaussian soft-margin SVM 要仔細選 $(\gamma, C)$；課堂上補充，多項式 kernel 要選的參數更多。

### α 的值把資料分成三類

講義第 15 頁的標題是 Physical Meaning of $\alpha_n$。同樣的兩條互補鬆弛，依 $\alpha_n$ 的值分三種情形：

| 類別 | $\alpha_n$ | 互補鬆弛推出什麼 | $\xi_n$ | 位置 | 圖上的標記 |
|---|---|---|---|---|---|
| 非支援向量 | $0$ | $C - \alpha_n = C \ne 0$，第二條逼得 $\xi_n = 0$ | $0$ | 在胖邊界外側，少數剛好在邊緣上 | 沒有 |
| free SV | $0 < \alpha_n < C$ | 第二條給 $\xi_n = 0$；第一條給 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1$ | $0$ | 剛好在胖邊界的邊緣上 | 方框 |
| bounded SV | $C$ | $\alpha_n \ne 0$，第一條給 $\xi_n = 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ | 違反量 | 違反胖邊界，少數剛好在邊緣上 | 三角形 |

三列各補一點說明：

- **非支援向量。** $\xi_n = 0$ 加上原始問題的限制式，得到 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$，沒有違反。講義寫 'away from'/on fat boundary；課堂上說這些點大部分離胖邊界還有一段距離，極少數會剛好落在邊緣上。
- **free SV。** 講義寫 on fat boundary, locates $b$。它們就是用來算 $b$ 的點。
- **bounded SV。** $\xi_n$ 剛好記下這個點違反了多少。課堂上把違反再分成兩種：小小的違反沒有跨過中間那條線，不造成分類錯誤；大大的違反跨到另一邊去，是嚴重的錯誤。兩種都有 $\alpha_n = C$。課堂上也提到，極少數剛好在邊緣上的點也可能 $\alpha_n = C$，但大部分情況下，看到 $\alpha_n = C$ 就知道這個點違反了胖邊界。

這也回答了前面例子裡的猜法：有違反（$\xi_n > 0$）的點，第二條互補鬆弛逼得 $C - \alpha_n = 0$，所以 $\alpha_n$ 一定頂到上界。

講義的結論是 $\alpha_n$ 可以拿來做資料分析（data analysis）。課堂上的說法是，做完 SVM 之後看 $\alpha$ 的值就能把手上的點分成三種：哪些可能有雜訊，哪些有幫助，哪些可有可無。六個點的例子裡，$C = 1$ 時頂到上界的正是位置對調的第 3、4 點。

### Fun Time：從支援向量的數量估 E_in

**題目（第 16 頁）：** 一份 10000 筆的資料，解完 SVM 之後有 1126 個支援向量，其中 1000 個是 bounded。以 0/1 錯誤衡量，$E_{\text{in}}(g_{\text{SVM}})$ 可能的範圍是？

1. $0.0000 \le E_{\text{in}}(g_{\text{SVM}}) \le 0.1000$
2. $0.1000 \le E_{\text{in}}(g_{\text{SVM}}) \le 0.1126$
3. $0.1126 \le E_{\text{in}}(g_{\text{SVM}}) \le 0.5000$
4. $0.1126 \le E_{\text{in}}(g_{\text{SVM}}) \le 1.0000$

**答案：1。** 講義的解答是：只有 bounded SV 可能違反胖邊界。$\xi_n \ge 1$ 的違反會造成 0/1 錯誤；$\xi_n < 1$ 的違反不會。課堂上用最好與最壞的情況來講：最好的情況是 1000 個 bounded SV 其實都剛好在胖邊界上，沒有任何錯誤，$E_{\text{in}} = 0$；最壞的情況是 1000 個都越過了邊界，$E_{\text{in}} = 1000 / 10000 = 0.1$。

把推理接起來：非支援向量與 free SV 的 $\xi_n = 0$，所以 $y_n \cdot \text{score} \ge 1 > 0$，一定分對。會分錯的點只可能在 1000 個 bounded SV 裡，上限是 $0.1$。下限是 0，因為 bounded SV 的 $\xi_n$ 可以全部小於 1。選項 2 把下限設成 $0.1$，等於假設每個 bounded SV 都分錯，並把 126 個 free SV 也算成可能出錯。選項 3 與 4 的下限 $0.1126$ 假設所有支援向量都分錯，更不對。

在六個點的例子裡，$C = 1$ 時 bounded SV 有 2 個，$E_{\text{in}} = \frac{2}{6}$，剛好碰到上限；$C = \frac{1}{20}$ 時 bounded SV 有 4 個，其中第 2、5 點的 $\xi_n = \frac{3}{5} < 1$ 沒有分錯，$E_{\text{in}}$ 還是 $\frac{2}{6}$，低於上限 $\frac{4}{6}$。

## C 和 γ 怎麼選：交叉驗證，以及支援向量個數給的上界

```youtube
url: https://www.youtube.com/watch?v=ahogAa5Rnmc
title: Soft-Margin Support Vector Machine :: Model Selection @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:08 講用交叉驗證選參數，02:08–05:30 是 leave-one-out 與支援向量個數的關係，05:30–07:28 用支援向量個數做選擇，07:28–08:10 是 Fun Time，之後是總結。）

### 參數一多，就要做模型選擇

講義第 17 頁放了一張九宮格：九張圖全部用 Gaussian kernel，各配一組不同的 $(C, \gamma)$。課堂上說明橫軸是不同的 $C$，縱軸是不同的 $\gamma$。九張圖的邊界差很多，最上面一列彎得很厲害，最下面一列接近直線。講義的說法是，光是 Gaussian SVM 的 $(C, \gamma)$ 就已經夠複雜，把其他 kernel 或其他參數算進來，組合更多。

怎麼選？講義只寫了一個字：validation。課堂上說這是基石唯一給過的肯定答案，最簡單也最好用的工具就是驗證。

### 用交叉驗證選

講義第 18 頁在同一張九宮格上標出每一格的交叉驗證誤差 $E_{\text{cv}}$：

| | 左 | 中 | 右 |
|---|---|---|---|
| 上列 | $0.3500$ | $0.3250$ | $0.3250$ |
| 中列 | $0.2000$ | $0.2250$ | $0.2750$ |
| 下列 | $0.1750$ | $0.2250$ | $0.2000$ |

最小的是左下角的 $0.1750$，投影片把它標成橘色。課堂上指出，上面那一列看起來很過擬合的邊界，$E_{\text{cv}}$ 也確實比較大。

講義提醒兩件事：

- $E_{\text{cv}}(C, \gamma)$ 是 $(C, \gamma)$ 的「不平滑」函數，很難直接最佳化。課堂上的說法是，每一組 $(C, \gamma)$ 送進去會得到一個值，但沒辦法像梯度下降那樣對 $C$ 與 $\gamma$ 求最佳，通常只能送幾組不同的值進去比較。
- 所以實際的做法是在 $(C, \gamma)$ 的少數幾個格點上做 $V$-fold 交叉驗證，挑 $E_{\text{cv}}$ 最小的。

講義的評語是 $E_{\text{cv}}$ 是 soft-margin SVM 非常常用的選擇標準。

### leave-one-out 誤差不會超過支援向量的比例

講義第 19 頁先回顧：$E_{\text{loocv}}$ 就是切成 $N$ 份的 $E_{\text{cv}}$，每次留一筆資料做驗證，其餘拿去訓練。接著宣稱 SVM 有一個特別的結果：

$$
E_{\text{loocv}} \le \frac{\#\text{SV}}{N}
$$

課堂上舉的數字是：一萬筆資料裡有 100 個支援向量，leave-one-out 誤差就不會超過 $100 / 10000 = 1\%$。

證明分三步。

**第一步：拿掉一個非支援向量，剩下的 $\boldsymbol{\alpha}$ 仍是最佳解。** 假設用全部 $N$ 筆資料解出的最佳解裡，第 $N$ 筆的 $\alpha_N = 0$。把 $(\mathbf{x}_N, y_N)$ 拿掉，只用剩下 $N - 1$ 筆資料解 SVM。講義宣稱 $(\alpha_1, \alpha_2, \dots, \alpha_{N-1})$ 仍是這個小問題的最佳解，並提示關鍵是問：如果有更好的呢？課堂上把反證法講完了：假如小問題有一組更好的 $N - 1$ 個 $\alpha$，把被拿掉的那個點加回去、配上 $\alpha_N = 0$，就得到原本 $N$ 筆問題的一組更好的解，和「原本的已經是最佳解」矛盾。

本文把中間省略的檢查補上。原本的 $(\alpha_1, \dots, \alpha_{N-1})$ 在小問題裡是合法的，而且目標值不變，因為 $\alpha_N = 0$ 的那一項在等式限制 $\sum_n y_n\alpha_n = 0$、在雙重加總、在 $\sum_n\alpha_n$ 裡都沒有貢獻。反過來，小問題的任何一組合法解補上 $\alpha_N = 0$，也是大問題的合法解，目標值相同。所以小問題若有目標值更低的解，大問題也會有，這就是矛盾的來源。

**第二步：$g^- = g$。** 記拿掉那一筆之後學到的分類器為 $g^-$。$\boldsymbol{\alpha}$ 沒有變，$\mathbf{w} = \sum_n\alpha_n y_n\mathbf{z}_n$ 與由 free SV 算出的 $b$ 也就沒有變，所以 $g^-$ 和原本的 $g$ 是同一個。講義寫成 SVM: $g^- = g$ when leaving out non-SV。課堂上說這是之前講 hard-margin 時那個觀察（技法第 2 堂講義的 only SV needed）在最佳化上的解釋：非支援向量拿掉之後，胖邊界一點都不受影響。講義第 19 頁右邊放的也是 hard-margin 那四個點的圖，註明 motivation from hard-margin SVM: only SVs needed。

本文補充：這一步用了兩個講義沒有明說的前提。一是小問題的最佳 $\boldsymbol{\alpha}$ 只有這一組，或者解算器回傳的剛好是這一組；二是 $b$ 由 free SV 唯一決定。沒有 free SV 時 $b$ 只確定在一個範圍內，拿掉一個點等於少了幾條限制，這個範圍只會不變或變寬，$g^-$ 就不一定和 $g$ 完全相同。講義與課堂都沒有處理這些邊角情形，所以這三步是證明的主要想法，還不是每種情形都顧到的嚴格證明。

**第三步：逐點算誤差。** 第 $n$ 筆資料對 $E_{\text{loocv}}$ 的貢獻是 $e_n = \text{err}(g^-, (\mathbf{x}_n, y_n))$。

- 非支援向量：$e_{\text{non-SV}} = \text{err}(g^-, \text{non-SV}) = \text{err}(g, \text{non-SV}) = 0$。最後一個等號是因為非支援向量的 $\xi_n = 0$，沒有違反胖邊界，$g$ 一定把它分對。
- 支援向量：拿掉之後 $g^-$ 可能改變，分對分錯都有可能，只知道 $e_{\text{SV}} \le 1$。

平均起來，

$$
E_{\text{loocv}} = \frac{1}{N}\sum_{n=1}^{N} e_n \le \frac{1}{N}\big(0\cdot\#\text{non-SV} + 1\cdot\#\text{SV}\big) = \frac{\#\text{SV}}{N}
$$

講義的總結是 scaled #SV bounds leave-one-out CV error。

### 數值例子：六個點的 leave-one-out

（本文自擬，接續前面的六個點，$C = 1$。）支援向量有 4 個，上界是 $\frac{4}{6}$。實際把每個點輪流拿掉，用剩下五個點重解：

| 拿掉的點 | 在完整問題裡的類別 | 剩下五點的解 | 對被拿掉的點的分數 | $e_n$ |
|---|---|---|---|---|
| 第 1 點（$x = 0$，$-1$） | 非支援向量 | $w = \frac{1}{2}$、$b = -\frac{5}{2}$，不變 | $-\frac{5}{2}$，判成 $-1$ | $0$ |
| 第 2 點（$x = 3$，$-1$） | free SV | $w = \frac{2}{7}$、$b = -1$ | $\frac{6}{7} - 1 = -\frac{1}{7}$，判成 $-1$ | $0$ |
| 第 3 點（$x = 4$，$+1$） | bounded SV | $w = 1$、$b$ 在 $-7$ 到 $-6$ 之間 | $-3$ 到 $-2$ 之間，判成 $-1$ | $1$ |
| 第 4 點（$x = 6$，$-1$） | bounded SV | $w = 1$、$b$ 在 $-4$ 到 $-3$ 之間 | $2$ 到 $3$ 之間，判成 $+1$ | $1$ |
| 第 5 點（$x = 7$，$+1$） | free SV | $w = \frac{2}{7}$、$b = -\frac{13}{7}$ | $2 - \frac{13}{7} = \frac{1}{7}$，判成 $+1$ | $0$ |
| 第 6 點（$x = 10$，$+1$） | 非支援向量 | $w = \frac{1}{2}$、$b = -\frac{5}{2}$，不變 | $\frac{5}{2}$，判成 $+1$ | $0$ |

拿掉第 2 點的那一列可以手算核對。剩下 $x = 0, 4, 6, 7, 10$：猜 $x = 0$ 與 $x = 7$ 是 free SV，$x = 4$ 與 $x = 6$ 頂到上界 1，$x = 10$ 是 0。兩個 free SV 給 $0\cdot w + b = -1$ 與 $7w + b = 1$，所以 $b = -1$、$w = \frac{2}{7}$。等式限制讓兩個 free SV 的 $\alpha$ 相等，記成 $a$：$w = 4 - 6 + 7a = \frac{2}{7}$，$a = \frac{16}{49}$，在 0 與 1 之間。再檢查其餘三點：$x = 10$ 的 $y\cdot\text{score} = \frac{13}{7} \ge 1$；$x = 4$ 是 $\frac{1}{7} \le 1$；$x = 6$ 是 $-\frac{5}{7} \le 1$，都和各自的類別相符。

拿掉第 3 點的那一列沒有 free SV：剩下的資料變成可分，但 hard-margin 的解需要 $\alpha = 2$，超過上界，於是 $x = 6$ 與 $x = 7$ 兩點都頂在 $C = 1$，$b$ 只確定在一個範圍內。範圍裡的每個 $b$ 都把 $x = 4$ 判成 $-1$，所以 $e_3 = 1$ 沒有疑義。

**這個結果代表什麼。** $E_{\text{loocv}} = \frac{0 + 0 + 1 + 1 + 0 + 0}{6} = \frac{2}{6}$，確實不超過 $\frac{4}{6}$。兩個非支援向量拿掉之後解完全不變，貢獻是 0，和證明的第一、二步一致。四個支援向量拿掉之後解都變了，但只有兩個因此被分錯，另外兩個的貢獻還是 0。上界把每個支援向量都當成「會錯」來算，所以通常比實際的 $E_{\text{loocv}}$ 寬鬆。

### 用支援向量的個數做安全檢查

講義第 20 頁在同一張九宮格上改標每一格的支援向量個數 nSV：

| | 左 | 中 | 右 |
|---|---|---|---|
| 上列 | $38$ | $37$ | $37$ |
| 中列 | $27$ | $21$ | $17$ |
| 下列 | $21$ | $18$ | $19$ |

課堂上指出，上面那三個比較糟的例子支援向量很多，下面比較簡單的例子相對少。講義提醒三件事：

- $\text{nSV}(C, \gamma)$ 同樣是不平滑的函數，很難最佳化。
- 它只是上界（just an upper bound!）。課堂上的說法是，我們不知道實際的 leave-one-out 誤差是多少，只能從支援向量的個數估一個上限；對上限做最佳化，可能只是把上限做到最好，不代表把真正的誤差做到最好。
- 所以它的用途是排除危險的模型：在幾個格點上看 nSV，把支援向量特別多的排除掉。

本文對照兩張表：nSV 最小的是中列右邊那一格（17，投影片標成橘色），它的 $E_{\text{cv}}$ 是 $0.2750$，在九格裡由小到大排第六；$E_{\text{cv}}$ 最小的左下角（$0.1750$），nSV 是 21。照 nSV 挑和照 $E_{\text{cv}}$ 挑會選到不同的格子。另一方面，nSV 最大的上列三格（38、37、37）也正是 $E_{\text{cv}}$ 最大的三格。這兩張表剛好示範了講義的用法：nSV 用來排除，不用來做最後的決定。

講義的結論是，nSV 常在計算 $E_{\text{cv}}$ 太花時間時當作安全檢查（safety check）。課堂上補充了兩點：支援向量的個數在訓練完就有了，不用額外計算；排除掉危險的組合之後，可以在剩下的組合上再做交叉驗證，選出更合適的參數。

### Fun Time：哪個不可能是 leave-one-out 誤差

**題目（第 21 頁）：** 一份 10000 筆的資料，用某組參數解完 SVM 之後有 1126 個支援向量，其中 1000 個是 bounded。下面哪一個不可能是這組參數的 $E_{\text{loocv}}$？

1. $0.0000$
2. $0.0805$
3. $0.1111$
4. $0.5566$

**答案：4。** 講義的解答只有一句：$E_{\text{loocv}}$ 的上界是 $0.1126$。它的來源是 $\#\text{SV} / N = 1126 / 10000 = 0.1126$。前三個選項都不超過 $0.1126$，上界排除不了它們；$0.5566$ 超過了，不可能。

本文補充：這題和「從支援向量的數量估 E_in」那題 Fun Time 用的是同一組數字，上限卻不一樣。$E_{\text{in}}$ 的上限是 bounded SV 的比例 $0.1$，$E_{\text{loocv}}$ 的上限是全部支援向量的比例 $0.1126$。差別在 free SV：在 $g$ 底下它們剛好在胖邊界上，一定分對；可是把一個 free SV 拿掉之後重新訓練，$g^-$ 可能改變，就不保證還分得對。所以題目裡「1000 個是 bounded」這個資訊在這一題用不到。

### 這堂的總結

講義第 22 頁把四節各收成一句：原始問題加上違反量 $\xi_n$；對偶問題替 $\alpha_n$ 加上上界 $C$；bounded 與 free SV 可以拿來做資料分析；模型選擇用交叉驗證，或用 nSV 近似。課堂上說，從 hard-margin、對偶、kernel 一路推到 soft-margin，這四堂是最流行的 soft-margin SVM 的完整介紹。講義對下一堂的預告是 other kernel models for soft binary classification。

## 自我檢查

**1. 分類器是 $g(\mathbf{x}) = \text{sign}(x_1 - x_2 - 1)$，也就是 $\mathbf{w} = (1, -1)$、$b = -1$。四個點：$(3, 1)$ 標 $+1$、$(2, \frac{1}{2})$ 標 $+1$、$(1, 1)$ 標 $+1$、$(0, 2)$ 標 $-1$。各自的 $\xi_n$ 是多少？哪些違反胖邊界，哪些被分錯？**

答案：四個點的 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 依序是 $1$、$\frac{1}{2}$、$-1$、$3$，所以 $\xi_n$ 依序是 $0$、$\frac{1}{2}$、$2$、$0$，總和 $\frac{5}{2}$。第二個點違反胖邊界但沒有分錯（$\xi < 1$）；第三個點違反而且分錯（$\xi > 1$）；第一個點剛好在邊緣上；第四個點在胖邊界外側。

**2. 兩筆一維資料：$x_1 = 1$ 標 $+1$，$x_2 = -1$ 標 $-1$。分別對 $C = 1$ 與 $C = \frac{1}{4}$ 解 soft-margin 對偶問題，求 $\boldsymbol{\alpha}$、$w$、$b$。**

答案：等式限制給 $\alpha_1 = \alpha_2 = \alpha$，$w = \alpha\cdot 1 - \alpha\cdot(-1) = 2\alpha$，目標函數是 $\frac{1}{2}(2\alpha)^2 - 2\alpha = 2\alpha^2 - 2\alpha$，沒有上界時最小值在 $\alpha = \frac{1}{2}$。$C = 1$ 時 $\frac{1}{2} < C$，兩個點都是 free SV，$w = 1$，$b = y_1 - wx_1 = 0$，和 hard-margin 的解相同。$C = \frac{1}{4}$ 時 $\frac{1}{2}$ 超過上界，目標函數在 $[0, \frac{1}{4}]$ 上遞減，所以 $\alpha = \frac{1}{4}$，兩個點都是 bounded SV，$w = \frac{1}{2}$。沒有 free SV，$b$ 只能定出範圍：$\xi_1 = 1 - (w + b) \ge 0$ 給 $b \le \frac{1}{2}$，$\xi_2 = 1 - (w - b) \ge 0$ 給 $b \ge -\frac{1}{2}$。範圍內原始問題的目標值都是 $\frac{1}{8} + \frac{1}{4}(2 - 2w) = \frac{3}{8}$，等於對偶的 $\sum\alpha_n - \frac{1}{2}w^2 = \frac{1}{2} - \frac{1}{8} = \frac{3}{8}$。

**3. 用自己的話說明：$\alpha_n \le C$ 這條限制是哪一步推出來的？如果某個 $\alpha_n > C$，內層的 $\min_{b,\mathbf{w},\boldsymbol{\xi}}\mathcal{L}$ 是多少？**

判準：答案要提到 $\mathcal{L}$ 對 $\xi_n$ 是一次式，係數是 $C - \alpha_n - \beta_n$；對 $\xi_n$ 偏微分為 0 給出 $\beta_n = C - \alpha_n$，而 $\beta_n \ge 0$ 就是 $\alpha_n \le C$。若 $\alpha_n > C$，因為 $\beta_n \ge 0$，係數 $C - \alpha_n - \beta_n$ 一定是負的，把 $\xi_n$ 推向正無限大，內層的 min 是 $-\infty$，外層的 max 不會選它。

**4. $C = 2$，解完 SVM 得到 8 個點的 $\alpha_n$ 依序是 $0, 0, 0, 0.4, 1.6, 2, 2, 2$。哪些點可以拿來算 $b$？$E_{\text{in}}$ 與 $E_{\text{loocv}}$ 各自最多是多少？**

答案：第 4、5 點是 free SV（$0 < \alpha_n < 2$），可以算 $b$。前三點是非支援向量，後三點是 bounded SV。只有 bounded SV 可能分錯，$E_{\text{in}} \le \frac{3}{8}$。支援向量共 5 個，$E_{\text{loocv}} \le \frac{5}{8}$。

**5. 講義第 18 頁與第 20 頁的兩張九宮格裡，nSV 最小的那一格 $E_{\text{cv}}$ 是 $0.2750$，$E_{\text{cv}}$ 最小的那一格 nSV 是 21。有人主張「直接挑 nSV 最小的參數就好，省掉交叉驗證」。這個主張哪裡有問題？nSV 該怎麼用？**

判準：答案要說出 $\#\text{SV}/N$ 只是 $E_{\text{loocv}}$ 的上界，上界最小不代表誤差最小，這兩張表就是反例；nSV 的用途是排除支援向量特別多的危險組合（例如上列的 38、37、37），剩下的再用交叉驗證選。能進一步說出「支援向量的貢獻可能是 0 也可能是 1，上界把它們全算成 1」更好。

## 練習與對應閱讀

**動手做。** 用 [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) 或 scikit-learn 的 `SVC` 在任何一份二元分類資料上跑 $3 \times 3$ 的 $(C, \gamma)$ 格點，同時記下 5-fold 交叉驗證誤差與 $\#\text{SV}/N$。看 $\#\text{SV}/N$ 最大的格點，交叉驗證誤差是不是也偏高；再看兩者各自最小的格點是不是同一個。這就是自己重做講義第 18 頁與第 20 頁的兩張表。

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把 kernel SVM 與 soft-margin SVM 排在同一週（W10，11/04），這堂的投影片代號是 `204u`。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W10（11/11）。本文只用 MOOC 版講義。

**教科書。** 兩份課程頁把這一週標在 [Learning from Data](http://amlbook.com)（LFD）的 e-8.3 與 e-8.4，soft margin 對應 e-8.4。e-Chapter 8 是 LFD 的線上章節。

**作業。** [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止，12 題加 1 題 bonus，沒有官方解答）和這堂相關的題目：

| 題 | 主題 | 對應這堂的哪裡 |
|---|---|---|
| Q2 | 所有點都是 bounded SV 時，最小的 $b^*$ 是多少 | 算 $b$ 要用 free SV；沒有 free SV 時 $b$ 是一個範圍 |
| Q5 | 把常數 1 補進 $\mathbf{x}_n$ 再解 soft-margin SVM，解是否不變 | 原始問題與對偶問題 |
| Q6 | 用原點當錨點的 one-class SVM，推對偶問題 | 對偶推導的四個步驟 |
| Q10 | MNIST 3 對 7，多項式 kernel，$C \in \{0.1, 1, 10\}$、$Q \in \{2, 3, 4\}$ 的支援向量個數 | $C$ 與 nSV |
| Q11 | 同資料，Gaussian kernel，$C$ 與 $\gamma$ 各取 $\{0.1, 1, 10\}$，算 margin $1/\lVert\mathbf{w}\rVert$ | 不同 $C$ 的 Gaussian SVM |
| Q12 | 固定 $C = 1$，隨機抽 200 筆當驗證資料選 $\gamma$，重複 128 次畫頻率圖 | 用驗證選參數 |
| Q13（bonus） | 推導 soft-margin SVM 對偶問題的對偶，和原始問題比較 | 對偶推導 |

程式題的資料是 LIBSVM 網站上的 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)。題目建議用 LIBSVM，並提醒兩件事：不要讓套件自動縮放資料，否則等於換了 kernel；要自己確認套件解的是課堂上的對偶形式，數值精度也夠。Q10 到 Q12 可以用兩個套件（例如 LIBSVM 與 scikit-learn 的 `SVC`，後者底層也是 LIBSVM）交叉比對支援向量個數與 margin。做 Q2 之前，先把自我檢查第 2 題 $C = \frac{1}{4}$ 的情形自己算一遍。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**延伸閱讀。** [CS229 主講義第 6 章](https://cs229.stanford.edu/main_notes.pdf)用另一套記號寫支援向量機，可以和這堂對照。[Caltech Learning from Data](https://work.caltech.edu/telecourse) 是同一本教科書的英文課。

**下一堂。** [技法第 5 堂：Kernel 邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression) 從這堂的 $\xi_n = \max(0, 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b))$ 出發，把 soft-margin SVM 重新讀成一個正則化模型。

## 課程影片來源

原始影片：[Motivation and Primal Problem](https://www.youtube.com/watch?v=K7ZcAYXuU_A)、[Dual Problem](https://www.youtube.com/watch?v=fTHTqW5Uq4U)、[Messages behind Soft-Margin SVM](https://www.youtube.com/watch?v=5z7ujI3YBBE)、[Model Selection](https://www.youtube.com/watch?v=ahogAa5Rnmc)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：改為一堂一篇，這篇只寫技法第 4 堂，依講義與影片逐字稿重寫。

## 參考資料

- [技法第 4 堂講義 204_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time、第 18 頁與第 20 頁兩張九宮格的數字都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、投影片代號與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次與 LFD 章節。
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)：Q2、Q5、Q6、Q10 到 Q13 的題目內容與作業提醒。
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)：作業建議使用的 SVM 套件，也是動手做練習的工具。
- [LIBSVM Data：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)：HW6 程式題的資料。
- [Learning from Data 教科書網站](http://amlbook.com)：e-8.4 的出處。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：延伸閱讀，第 6 章的支援向量機。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：延伸閱讀，同一本教科書的英文課。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
