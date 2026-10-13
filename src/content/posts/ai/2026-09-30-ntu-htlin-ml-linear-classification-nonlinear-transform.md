---
title: "線性分類模型：三種誤差、SGD 與多類別｜台大林軒田 機器學習基石 第 11 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, classification, sgd, logistic-regression]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 11
tldr: "PLA、線性迴歸、邏輯迴歸都先算分數 s = wᵀx，三種誤差都能寫成 ys 的函數。平方誤差與換成 log₂ 的 cross-entropy 都壓在 0/1 誤差上面，所以把迴歸的 E_in 做小，分類的 E_out 也跟著有保證。接著把梯度裡的 N 筆平均換成隨機抽一筆，得到每步 O(1) 的 SGD；再用 OVA（K 個分類器、取分數最高）與 OVO（K(K−1)/2 個分類器、投票）把二元分類器組成多類別分類器。"
description: "台大林軒田機器學習基石第 11 堂 Linear Models for Classification 導讀：三種誤差函數改寫成 ys、scaled cross-entropy 上界與 VC bound 的銜接、隨機梯度下降與 PLA 的關係、OVA 與 OVO 兩種多類別拆解，四題 Fun Time 逐題解釋，並用五筆資料把三種模型與 SGD 算過一遍。"
draft: false
glossary:
  - term: "scaled cross-entropy"
    aliases: ["err_SCE", "縮放後的 cross-entropy"]
    definition: "把 cross-entropy 誤差的 ln 換成 log₂，也就是除以 ln 2：log₂(1 + exp(−ys))。它在 ys = 0 時剛好是 1，而且對所有 ys 都不小於 0/1 誤差。"
    context: "基石第 11 堂用它當 0/1 誤差的上界，說明邏輯迴歸可以拿來做分類。"
  - term: "隨機梯度下降"
    aliases: ["stochastic gradient descent", "SGD"]
    definition: "每一步隨機抽一筆資料，只用這一筆的誤差梯度來更新 w。這個隨機梯度的期望值等於真正的梯度，每步的計算量與資料筆數 N 無關。"
    context: "基石第 11 堂用它把邏輯迴歸每步的計算量從 O(N) 降到 O(1)。"
  - term: "OVA decomposition"
    aliases: ["one-versus-all", "一對其餘"]
    definition: "把 K 類分類拆成 K 個「是第 k 類或不是」的二元問題，各自訓練一個軟性分類器（如邏輯迴歸），預測時取分數最高的類別。"
    context: "基石第 11 堂的第一種多類別 meta-algorithm。"
  - term: "OVO decomposition"
    aliases: ["one-versus-one", "一對一"]
    definition: "對每一對類別 (k, ℓ) 只取這兩類的資料訓練二元分類器，共 K(K−1)/2 個，預測時讓所有分類器投票，選出「錦標賽冠軍」。"
    context: "基石第 11 堂的第二種多類別 meta-algorithm，用來緩解 OVA 的類別不平衡。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/25 到 25/25），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 11 堂。講義第 1 頁的 Roadmap 把它放在四大問題的第三個「How Can Machines Learn?」底下。上一堂[基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)在同一頁上只留一行：對 cross-entropy 誤差做梯度下降，得到好的 logistic 假說。到這裡基石已經教了三個線性模型：做分類的 PLA 與 pocket、有解析解的線性迴歸、用梯度下降解的邏輯迴歸。課堂上開場說，這堂要先把這三個模型整合起來，再延伸到更複雜的分類問題。

整堂課回答三個問題：

1. 線性迴歸與邏輯迴歸比 0/1 誤差的分類好解得多，能不能借來做二元分類？
2. 邏輯迴歸每一步要掃過全部 $N$ 筆資料，能不能像 PLA 一樣每步只看一筆？
3. 類別不只兩種時，手上的二元分類工具怎麼用？

先備是 [基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的修正規則與 pocket、[基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)的 VC bound、[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的平方誤差與解析解，以及上一堂的 cross-entropy 誤差與它的梯度。讀完之後，你應該能自己把三種誤差改寫成 $ys$ 的函數並證明哪些是 0/1 誤差的上界、推出 SGD 的更新式並說出它和 PLA 差在哪、對一個測試點手算 OVA 與 OVO 的預測，並估計兩種拆法各要花多少訓練成本。

## 迴歸能不能拿來做分類：三種誤差放在同一張圖上

```youtube
url: https://www.youtube.com/watch?v=qXfDVHVzI38
title: Linear Models for Classification :: Binary Classification @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:08 回顧三個線性模型，03:08–09:38 把誤差改寫成 $ys$ 的函數，09:38–14:26 把幾種誤差的曲線畫在同一張圖上，14:26–17:52 是上界的理論意義，17:52–20:55 談實務上怎麼選，之後是 Fun Time。）

### 三個模型共用一個分數

講義第 2 頁把三個模型並排。它們都先算同一個線性分數 $s = \mathbf{w}^\top\mathbf{x}$，差別在分數算出來之後怎麼用：

| | 線性分類 | 線性迴歸 | 邏輯迴歸 |
|---|---|---|---|
| 假說 | $h(\mathbf{x}) = \text{sign}(s)$ | $h(\mathbf{x}) = s$ | $h(\mathbf{x}) = \theta(s)$ |
| 講義選的誤差 | 0/1（plausible） | 平方（friendly） | cross-entropy（plausible） |
| $E_{\text{in}}(\mathbf{w})$ 的性質 | 離散，最小化是 NP-hard | 二次的凸函數，有解析解 | 平滑的凸函數，梯度下降 |

plausible 與 friendly 是[基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)的用語：前者指這個誤差說得出道理，後者指它容易最佳化。

這一頁最底下問的是：can linear regression or logistic regression help linear classification? 課堂上的鋪陳是，線性分類的最佳化很難，另外兩個模型要把 $E_{\text{in}}$ 做小卻容易得多，那能不能借它們當分類的替代工具。借法很直接：把標籤限制在 $y \in \{-1, +1\}$，照樣跑迴歸。課堂上說，邏輯迴歸拿到的資料本來就和二元分類的資料一樣；對線性迴歸來說，$-1$ 與 $+1$ 只是兩個特別的實數，所以也能直接拿來用。

問題是這樣做有沒有道理。要回答，得先把三種誤差放到同一個座標上比。

### 把三種誤差都寫成 ys 的函數

第 3 頁做的事，課堂上說是把三個模型的誤差函數整合起來：原本算誤差有兩步，先由分數算出 $h(\mathbf{x})$，再拿 $h(\mathbf{x})$ 與 $y$ 比。現在把第一步也收進誤差函數，直接寫成分數 $s$ 與標籤 $y$ 的函數 $\text{err}(s, y)$。

**0/1 誤差。** 代入 $h(\mathbf{x}) = \text{sign}(s)$：

$$
\text{err}_{0/1}(s, y) = \llbracket \text{sign}(s) \ne y \rrbracket = \llbracket \text{sign}(ys) \ne 1 \rrbracket
$$

第二個等號用到 $y \in \{-1, +1\}$。$y = +1$ 時 $ys = s$，兩個條件一模一樣；$y = -1$ 時 $ys = -s$，「$\text{sign}(s) \ne -1$」和「$\text{sign}(-s) \ne 1$」也是同一件事。課堂上的說法是偷偷把 $y$ 乘進去。

**平方誤差。** 代入 $h(\mathbf{x}) = s$，再乘上 $y^2 = 1$：

$$
\text{err}_{\text{SQR}}(s, y) = (s - y)^2 = y^2(s - y)^2 = (ys - y^2)^2 = (ys - 1)^2
$$

**cross-entropy 誤差。** 上一堂推出邏輯迴歸的逐點誤差是 $-\ln h(y\mathbf{x})$，代入 $h(y\mathbf{x}) = \theta(y\mathbf{w}^\top\mathbf{x}) = \theta(ys)$ 與 $\theta(u) = \frac{1}{1 + e^{-u}}$：

$$
\text{err}_{\text{CE}}(s, y) = -\ln\frac{1}{1 + \exp(-ys)} = \ln\big(1 + \exp(-ys)\big)
$$

這一條本來就含 $ys$，前兩條的改寫是為了向它看齊。

三個式子裡只剩同一個量 $ys$。講義把它叫作 classification correctness score，課堂上拆開來解釋：$s$ 是分數，乘上 $y$ 是在看它對 $y$ 來說正不正確。$ys$ 是正的，代表分數的正負號與標籤相同，分對了；$ys$ 愈大，表示分對而且離分界愈遠；$ys$ 是負的就是分錯。

### 四條曲線的形狀

第 4 頁以 $ys$ 為橫軸、誤差為縱軸，分四張把曲線疊上去：先畫 0/1，再加上平方誤差，再加上 cross-entropy，最後一張把 cross-entropy 那條線換成 scaled cross-entropy，所以圖上同時最多只有三條線。scaled cross-entropy 是把 $\ln$ 換成 $\log_2$：

$$
\text{err}_{\text{SCE}}(s, y) = \log_2\big(1 + \exp(-ys)\big) = \frac{1}{\ln 2}\,\text{err}_{\text{CE}}(s, y)
$$

圖的內容用數字列出來（本文計算，四捨五入到小數第四位）：

| $ys$ | $\text{err}_{0/1}$ | $\text{err}_{\text{SQR}}$ | $\text{err}_{\text{CE}}$ | $\text{err}_{\text{SCE}}$ |
|---|---|---|---|---|
| $-3$ | 1 | 16 | 3.0486 | 4.3982 |
| $-2$ | 1 | 9 | 2.1269 | 3.0685 |
| $-1$ | 1 | 4 | 1.3133 | 1.8946 |
| $-0.5$ | 1 | 2.25 | 0.9741 | 1.4053 |
| $0$ | 1 | 1 | 0.6931 | 1 |
| $0.5$ | 0 | 0.25 | 0.4741 | 0.6839 |
| $1$ | 0 | 0 | 0.3133 | 0.4519 |
| $2$ | 0 | 1 | 0.1269 | 0.1831 |
| $3$ | 0 | 4 | 0.0486 | 0.0701 |

講義對四條線各有一句評語，配上課堂上的解釋：

- **0/1**：$ys \le 0$ 時是 1，其餘是 0，是一個階梯。
- **平方**：頂點在 $ys = 1$ 的拋物線。$ys \ll 1$ 時很大，這和分類的直覺一致，課堂上說誤差函數就是在扣分，錯得多本來就該多扣。但 $ys \gg 1$ 時它也很大，講義寫 over-charge。課堂上指著圖的右邊說，那裡是 0/1 誤差視為很好的情形（分對而且分數很高），硬用線性迴歸卻會被當成很不好。表上 $ys = 3$ 那一列就是：0/1 誤差是 0，平方誤差是 4。不過只要一筆資料的平方誤差很小，$ys$ 就在 1 附近，0/1 誤差一定是 0，所以講義寫 small $\text{err}_{\text{SQR}}$ → small $\text{err}_{0/1}$，箭頭只有一個方向。
- **cross-entropy**：隨 $ys$ 單調遞減的平滑曲線，$ys$ 很大時趨近 0，$ys$ 很負時愈來愈高。講義寫 small $\text{err}_{\text{CE}}$ ↔ small $\text{err}_{0/1}$，箭頭是雙向的。課堂上講反方向時語氣有保留，只說從某種角度來看也成立。本文補充這個保留的意思：0/1 誤差是 0 時 $ys > 0$，cross-entropy 一定小於 $\ln 2 \approx 0.693$，有上限，卻不保證接近 0。
- **scaled cross-entropy**：課堂上解釋換底的目的。在 $ys = 0$ 這一點，$\log_2(1 + e^0) = \log_2 2 = 1$，曲線剛好碰到 0/1 誤差的階梯頂端；整條線於是壓在 0/1 誤差上面，講義稱它是 a proper upper bound of 0/1。從最佳化的角度看只是除以一個常數 $\ln 2$，最小值的位置不變。

頁尾的結論是：上界對設計演算法用的誤差 $\widehat{\text{err}}$ 很有用。$\widehat{\text{err}}$ 是基石第 8 堂的記號，指演算法實際拿來最佳化的誤差，不一定等於應用真正在意的那一個。

**本文補充：兩個上界的證明。** 講義用圖說明，這裡把式子補上。分兩種情況：

- $ys \le 0$：0/1 誤差是 1。平方誤差 $(ys - 1)^2$ 裡，$ys - 1 \le -1$，平方之後至少是 1。scaled cross-entropy 裡，$\exp(-ys) \ge 1$，所以 $\log_2(1 + \exp(-ys)) \ge \log_2 2 = 1$。
- $ys > 0$：0/1 誤差是 0，另外兩個都不是負數。

所以平方誤差與 scaled cross-entropy 在每個 $ys$ 上都不小於 0/1 誤差。沒有縮放的 cross-entropy 做不到：$ys = 0$ 時它只有 $\ln 2 \approx 0.693$，比 1 小。解 $\ln(1 + e^{-ys}) < 1$ 得到 $ys > -\ln(e - 1) \approx -0.541$，所以在 $-0.541 < ys \le 0$ 這一段，cross-entropy 低於 0/1 誤差。

### 上界怎麼接到 VC bound

第 5 頁把逐點的不等式變成對 $E_{\text{out}}$ 的保證。起點是對任何 $ys$ 都成立的

$$
\text{err}_{0/1}(s, y) \le \text{err}_{\text{SCE}}(s, y) = \frac{1}{\ln 2}\,\text{err}_{\text{CE}}(s, y)
$$

$E_{\text{in}}$ 是 $N$ 筆資料上的誤差平均，每一筆都滿足這個不等式，平均之後照樣成立。$E_{\text{out}}$ 是對整個分布取期望，課堂上說就是對無限多筆做平均，道理相同。用上標標示量的是哪一種誤差：

$$
E_{\text{in}}^{0/1}(\mathbf{w}) \le E_{\text{in}}^{\text{SCE}}(\mathbf{w}) = \frac{1}{\ln 2}E_{\text{in}}^{\text{CE}}(\mathbf{w}), \qquad E_{\text{out}}^{0/1}(\mathbf{w}) \le E_{\text{out}}^{\text{SCE}}(\mathbf{w}) = \frac{1}{\ln 2}E_{\text{out}}^{\text{CE}}(\mathbf{w})
$$

接下來講義給兩條路，都通到同一個結論。

**左邊的路：VC on 0/1。** 先用基石第 7 堂的 VC bound，它講的是 0/1 誤差，$\Omega^{0/1}$ 是模型複雜度那一項；再把 $E_{\text{in}}^{0/1}$ 換成它的上界：

$$
E_{\text{out}}^{0/1}(\mathbf{w}) \le E_{\text{in}}^{0/1}(\mathbf{w}) + \Omega^{0/1} \le \frac{1}{\ln 2}E_{\text{in}}^{\text{CE}}(\mathbf{w}) + \Omega^{0/1}
$$

**右邊的路：VC-Reg on CE。** 先把 $E_{\text{out}}^{0/1}$ 換成 cross-entropy 版的上界，再對 cross-entropy 這種實數值的誤差用迴歸版的 VC bound：

$$
E_{\text{out}}^{0/1}(\mathbf{w}) \le \frac{1}{\ln 2}E_{\text{out}}^{\text{CE}}(\mathbf{w}) \le \frac{1}{\ln 2}E_{\text{in}}^{\text{CE}}(\mathbf{w}) + \frac{1}{\ln 2}\Omega^{\text{CE}}
$$

課堂上坦白說，右邊用到的那個 bound 這門課沒有實際教過；如果相信這類推導有道理，就會得到這一行。左邊那條路用到的都是教過的東西。

兩條路的右手邊都是「cross-entropy 的 $E_{\text{in}}$ 加上一個複雜度項」。講義的結論寫在黃框裡：small $E_{\text{in}}^{\text{CE}}(\mathbf{w})$ ⟹ small $E_{\text{out}}^{0/1}(\mathbf{w})$，所以邏輯迴歸可以拿來做線性分類。課堂上接著說，把 cross-entropy 換成平方誤差也行，因為平方誤差同樣是 0/1 誤差的上界，只是比較寬鬆；這就是黃框裡 logistic/linear reg. 兩個字並列的原因。

本文補充：平方誤差那一版不必除以 $\ln 2$，左邊的路寫出來是 $E_{\text{out}}^{0/1}(\mathbf{w}) \le E_{\text{in}}^{\text{SQR}}(\mathbf{w}) + \Omega^{0/1}$。另外要注意這些都是上界：$E_{\text{in}}^{\text{CE}} = 0.3$ 時，$E_{\text{in}}^{0/1} \le 0.3 / \ln 2 \approx 0.433$，這個保證有內容；$E_{\text{in}}^{\text{CE}} = 0.8$ 時上界是 1.154，比 0/1 誤差的最大值 1 還大，等於什麼都沒保證。上界只在 cross-entropy 真的被壓小之後才有用。

### 三個模型在實務上怎麼選

第 6 頁先把做法寫成兩步，講義稱為 regression for classification：

1. 在 $y_n \in \{-1, +1\}$ 的資料 $\mathcal{D}$ 上跑邏輯迴歸或線性迴歸，得到 $\mathbf{w}_{\text{REG}}$。
2. 回傳 $g(\mathbf{x}) = \text{sign}(\mathbf{w}_{\text{REG}}^\top\mathbf{x})$。

然後是三欄比較：

| | PLA | 線性迴歸 | 邏輯迴歸 |
|---|---|---|---|
| 優點 | 資料線性可分時有效率，而且有很強的保證 | 最佳化「最容易」 | 最佳化「容易」 |
| 缺點 | 只在線性可分時有效，否則要靠 pocket | $\lvert ys \rvert$ 大的時候，是 $\text{err}_{0/1}$ 很鬆的上界 | $ys$ 很負的時候，是 $\text{err}_{0/1}$ 很鬆的上界 |

「鬆」有多鬆，可以回去看前面的表：$ys = -3$ 時 0/1 誤差是 1，scaled cross-entropy 是 4.40，平方誤差是 16；$ys = 3$ 時 0/1 誤差是 0，scaled cross-entropy 是 0.07，平方誤差卻是 4。邏輯迴歸只在分錯很多的那一側鬆，線性迴歸兩側都鬆。課堂上對 PLA 的評語是：它表現好的時候只有線性可分的時候，如果不知道資料是不是線性可分，就得用 pocket，好處相對變小。

頁尾是兩個實務建議：

- **線性迴歸有時拿來設定 $\mathbf{w}_0$。** 課堂上說，PLA、pocket、邏輯迴歸都需要一個起點，以前都設成零向量或隨機值；線性迴歸一步就算得出來，雖然上界太鬆、不適合直接當答案，拿它的解當 $\mathbf{w}_0$ 再繼續最佳化，是常見的做法。
- **邏輯迴歸通常比 pocket 受歡迎。** 課堂上的理由是兩者每一輪花的力氣差不多，而邏輯迴歸的最佳化性質比較好，所以實務上大部分的人用邏輯迴歸做二元分類。

### 數值例子：同一份資料，三個 w 各贏一種誤差

以下是本文自擬的例子，不在講義上，數字用 Python 驗算過。資料沿用基石第 10 堂導讀的五位病人：$x_1$ 是某項檢驗值標準化後的分數，$y = +1$ 代表後來心臟病發，$\mathbf{x} = (1, x_1)$。五筆資料依序是 $(x_1, y) = (-2, -1)$、$(-1, -1)$、$(0, +1)$、$(1, -1)$、$(2, +1)$。這份資料不是線性可分的，最好的門檻也會分錯一筆。

**線性迴歸。** 用基石第 9 堂的解析解。$x_1$ 的平均是 0，所以 $w_0$ 就是 $y$ 的平均 $-0.2$，$w_1 = \frac{\sum_n x_{n,1}y_n}{\sum_n x_{n,1}^2} = \frac{2 + 1 + 0 - 1 + 2}{10} = 0.4$，$\mathbf{w}_{\text{LIN}} = (-0.2, 0.4)$。

**邏輯迴歸。** 上一堂用梯度下降跑到谷底的結果是 $\mathbf{w}_{\text{LOG}} \approx (-0.6227, 1.0904)$。

**直接看 0/1 誤差。** 把門檻放在 $x_1 = -0.5$，也就是 $\mathbf{w} = (0.5, 1)$，只會分錯第 4 筆。

以 $\mathbf{w}_{\text{LIN}}$ 為例把每一筆算出來：

| $n$ | $x_1$ | $y_n$ | $s = \mathbf{w}_{\text{LIN}}^\top\mathbf{x}_n$ | $y_ns$ | $\text{err}_{0/1}$ | $\text{err}_{\text{SQR}}$ | $\text{err}_{\text{SCE}}$ |
|---|---|---|---|---|---|---|---|
| 1 | $-2$ | $-1$ | $-1.0$ | $1.0$ | 0 | 0 | 0.4519 |
| 2 | $-1$ | $-1$ | $-0.6$ | $0.6$ | 0 | 0.16 | 0.6312 |
| 3 | $0$ | $+1$ | $-0.2$ | $-0.2$ | 1 | 1.44 | 1.1515 |
| 4 | $1$ | $-1$ | $0.2$ | $-0.2$ | 1 | 1.44 | 1.1515 |
| 5 | $2$ | $+1$ | $0.6$ | $0.6$ | 0 | 0.16 | 0.6312 |

每一列的平方誤差與 scaled cross-entropy 都不小於 0/1 誤差，平均起來也是：$E_{\text{in}}^{0/1} = 0.4$、$E_{\text{in}}^{\text{SQR}} = 0.64$、$E_{\text{in}}^{\text{SCE}} = 0.8034$。三個 $\mathbf{w}$ 的四種 $E_{\text{in}}$ 整理如下：

| $\mathbf{w}$ | $E_{\text{in}}^{0/1}$ | $E_{\text{in}}^{\text{SQR}}$ | $E_{\text{in}}^{\text{CE}}$ | $E_{\text{in}}^{\text{SCE}}$ |
|---|---|---|---|---|
| $\mathbf{w}_{\text{LIN}} = (-0.2, 0.4)$ | 0.4 | **0.64** | 0.5569 | 0.8034 |
| $\mathbf{w}_{\text{LOG}} \approx (-0.6227, 1.0904)$ | 0.4 | 1.7720 | **0.4844** | 0.6988 |
| $(0.5, 1)$ | **0.2** | 1.85 | 0.5860 | 0.8454 |

**這個結果代表什麼。**

- 每一列都滿足 $E_{\text{in}}^{0/1} \le E_{\text{in}}^{\text{SQR}}$ 與 $E_{\text{in}}^{0/1} \le E_{\text{in}}^{\text{SCE}}$，第 5 頁的不等式在這份資料上成立。
- 三個 $\mathbf{w}$ 各自在一種誤差上最小。線性迴歸與邏輯迴歸都把門檻放在 $x_1 = 0.5$ 與 $0.571$ 附近，分錯第 3、4 兩筆；0/1 誤差最小的那條線只分錯一筆，它的平方誤差與 cross-entropy 反而比較大，因為第 4 筆的 $ys = -1.5$ 被兩種迴歸誤差重罰。
- 所以 regression for classification 給的是保證，不是最佳解：把上界壓小，0/1 誤差不會超過它，但不保證壓到最低。這也是講義說線性迴歸適合當 $\mathbf{w}_0$、再交給 pocket 或邏輯迴歸繼續做的原因。
- 邏輯迴歸那一列的平方誤差高達 1.77，其中最大的一項來自第 1 筆：$ys = 2.80$，分得很對，平方誤差卻是 3.25。這就是講義說的 over-charge。

### Fun Time：哪一個不是 0/1 誤差的上界

**題目（第 7 頁）：** 照這堂課的定義，$y \in \{-1, +1\}$ 時，下面哪一個不一定大於等於 $\text{err}_{0/1}(y, s)$？

1. $\text{err}_{0/1}(y, s)$
2. $\text{err}_{\text{SQR}}(y, s)$
3. $\text{err}_{\text{CE}}(y, s)$
4. $\text{err}_{\text{SCE}}(y, s)$

**答案：3。** 講義的解答只說「太簡單了吧」，並提醒 $\text{err}_{0/1}$ 當然是自己的上界，所以選項 1 不對。選項 2 與 4 是上界，證明在「四條曲線的形狀」那一小節的補充裡。選項 3 的反例是 $ys = 0$：cross-entropy 是 $\ln 2 \approx 0.693$，0/1 誤差是 1。課堂上的說明是，從圖上看得出 cross-entropy 沒有真的壓在 0/1 誤差上面，要做一次縮放才會。

## 邏輯迴歸每一步只看一筆資料：隨機梯度下降

```youtube
url: https://www.youtube.com/watch?v=9HL3YvmrovQ
title: Linear Models for Classification :: Stochastic Grad. Descent @ Machine Learning Foundations (機器學習基石)
```

（影片 00:01–01:39 比較兩種迭代方法每一輪的成本，01:39–04:12 是隨機梯度的想法，04:12–06:27 是 SGD 的優缺點與更新式，06:27–08:37 和 PLA 對照，08:37–10:30 講兩個經驗法則，之後是 Fun Time。）

### 兩種迭代法，每一輪的成本差 N 倍

第 8 頁把 PLA 和邏輯迴歸放進同一個框架。兩者都是迭代最佳化：對 $t = 0, 1, \dots$ 反覆做

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\mathbf{v}
$$

停下來時回傳最後的 $\mathbf{w}$ 當作 $g$。差別在每一輪看多少資料：

| | PLA | 邏輯迴歸（pocket 也是） |
|---|---|---|
| 每一輪怎麼決定 $\mathbf{w}_{t+1}$ | 挑一筆 $(\mathbf{x}_n, y_n)$，只靠這一筆 | 看過整個 $\mathcal{D}$，靠全部的資料 |
| 每一輪的時間 | $O(1)$ | $O(N)$ |

這一頁左下角放的是基石第 2 堂講義裡 PLA 示範的其中一張（標著 update: 2 的那張）：一個分錯的點把 $\mathbf{w}_t$ 修正成 $\mathbf{w}_{t+1}$。課堂上說，PLA 不管有一千筆還是一萬筆資料，每一輪都只看其中一筆；邏輯迴歸每一輪要把所有點對梯度的貢獻算出來再平均，目前和 pocket 一樣慢，因為 pocket 每一輪也要看過 $N$ 筆才知道要不要換掉口袋裡的 $\hat{\mathbf{w}}$。這一頁最後問的是：能不能有每一輪 $O(1)$ 的邏輯迴歸？

### 把平均看成期望值

第 9 頁先把上一堂的更新式寫出來：

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\underbrace{\frac{1}{N}\sum_{n=1}^{N}\theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(y_n\mathbf{x}_n\big)}_{-\nabla E_{\text{in}}(\mathbf{w}_t)}
$$

我們要的更新方向 $\mathbf{v}$ 要接近 $-\nabla E_{\text{in}}(\mathbf{w}_t)$，因為上一堂的推導說明了 $\eta$ 夠小時它是好方向；但又只想用一筆 $(\mathbf{x}_n, y_n)$ 來算。麻煩的是前面那個 $\frac{1}{N}\sum_{n=1}^{N}$。

講義的技巧是把它看成期望值：從 $1$ 到 $N$ 均勻地隨機抽一個 $n$，每個 $n$ 被抽中的機率是 $\frac{1}{N}$。把單筆誤差的梯度 $\nabla_{\mathbf{w}}\,\text{err}(\mathbf{w}, \mathbf{x}_n, y_n)$ 叫作隨機梯度（stochastic gradient），它的期望值就是

$$
\mathop{\mathcal{E}}_{\text{random } n}\nabla_{\mathbf{w}}\,\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = \sum_{n=1}^{N}\frac{1}{N}\nabla_{\mathbf{w}}\,\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = \nabla_{\mathbf{w}}\Big(\frac{1}{N}\sum_{n=1}^{N}\text{err}(\mathbf{w}, \mathbf{x}_n, y_n)\Big) = \nabla_{\mathbf{w}}E_{\text{in}}(\mathbf{w})
$$

第一個等號是期望值的定義，第二個等號是把梯度和加總對調（有限項的和可以逐項微分），第三個等號是 $E_{\text{in}}$ 的定義。中間兩步是本文補上的，講義只寫頭尾。

課堂上用抽樣解釋：有一萬個數字要算平均，不想認真全部加起來，就隨機抽幾個出來平均，當作估計。這裡只是做得很極端，只抽一個。

### SGD：隨機梯度等於真梯度加上平均為零的雜訊

第 10 頁第一行換一個方式講同一件事：

$$
\text{隨機梯度} = \text{真正的梯度} + \text{平均為零的「雜訊」方向}
$$

課堂上的比喻是喝醉酒：真正想走的是梯度那個方向，因為隨機抽樣，這一步往左偏一點、下一步往右偏一點，但期望值上和原本要走的方向差不多。

隨機梯度下降（stochastic gradient descent，SGD）的做法就是把真梯度換成隨機梯度，講義列了四點：

- **想法**：用隨機梯度取代真正的梯度。
- **依據**：走了夠多步之後，真梯度的平均 ≈ 隨機梯度的平均。課堂上說這跟平常做抽樣的道理類似。
- **優點**：簡單，計算便宜。適合大資料，也適合 online learning。課堂上回顧[基石第 3 堂：學習的種類](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning)的設定：資料如果本來就是一筆一筆來的，這個方法可以直接套上去。
- **缺點**：本質上比較不穩定。課堂上補充，$\eta$ 太大時更不穩定：這一步踏出去，到底是踏到比較低還是比較高的地方，並不知道。

邏輯迴歸的單筆誤差是 $\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = \ln(1 + \exp(-y_n\mathbf{w}^\top\mathbf{x}_n))$。上一堂用連鎖律算過它的梯度，是 $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)(-y_n\mathbf{x}_n)$。所以 SGD 版的邏輯迴歸就是把原本更新式裡的 $\frac{1}{N}\sum$ 拿掉：

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\underbrace{\theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(y_n\mathbf{x}_n\big)}_{-\nabla\text{err}(\mathbf{w}_t, \mathbf{x}_n, y_n)}
$$

講義在式子旁邊畫了一個笑臉：looks familiar?

### 和 PLA 並排：軟的 PLA

第 11 頁把兩個更新式上下排在一起：

$$
\begin{aligned}
\text{SGD 邏輯迴歸：}\quad & \mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta \cdot \theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(y_n\mathbf{x}_n\big) \\
\text{PLA：}\quad & \mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + 1 \cdot \llbracket y_n \ne \text{sign}(\mathbf{w}_t^\top\mathbf{x}_n) \rrbracket\big(y_n\mathbf{x}_n\big)
\end{aligned}
$$

兩者都往 $y_n\mathbf{x}_n$ 的方向修正，只有前面的係數不同。PLA 的係數是 0 或 1：分錯才更新，分對就不動。SGD 邏輯迴歸的係數是 $\theta(-y_n\mathbf{w}_t^\top\mathbf{x}_n)$，介於 0 與 1 之間的連續值。講義的兩句結論：

- **SGD 邏輯迴歸 ≈「軟的」PLA。** 課堂上的說法是，它看的是錯多少：錯得多就多更新一點，錯得少就少更新一點。
- **$\mathbf{w}_t^\top\mathbf{x}_n$ 很大時，PLA ≈ $\eta = 1$ 的 SGD 邏輯迴歸。** 課堂上解釋，分數的絕對值很大時，$\theta$ 不是很接近 0 就是很接近 1。本文把兩種情況拆開：分對時 $y_ns$ 是很大的正數，$\theta(-y_ns) \approx 0$，幾乎不更新；分錯時 $y_ns$ 是很負的數，$\theta(-y_ns) \approx 1$，更新量幾乎就是 $y_n\mathbf{x}_n$。這正是 PLA 的行為。

同一頁還有兩個實務上的經驗法則：

- **什麼時候停？** $t$ 夠大就停。課堂上解釋為什麼不檢查梯度：梯度下降可以看真梯度是不是接近零，但 SGD 本來就是為了省掉算真梯度的力氣，再去算它，剛才省的就白省了。所以大部分的人就是跑夠久，然後相信自己已經到谷底附近；課堂上強調這只是一種相信，跑得夠久並不保證到得了谷底。
- **$\eta$ 取多少？** $\mathbf{x}$ 的範圍合適時，取 0.1。課堂上說這是他經驗上的小秘密，不要問是怎麼算出來的；之後的課會講怎麼把 $\eta$ 當成參數來選。林軒田還提到他自己習慣用 0.1126，0.1 附近大概都做得不錯。

### 數值例子：五位病人上的隨機梯度

以下是本文自擬的例子，不在講義上，數字用 Python 驗算過。資料仍是前面的五位病人，$\eta = 0.1$。

**在 $\mathbf{w}_0 = (0, 0)$ 看五個隨機梯度。** 每一筆的分數都是 0，$\theta(0) = 0.5$，所以抽到第 $n$ 筆時的更新方向（負的隨機梯度）是 $0.5\,y_n\mathbf{x}_n$：

| 抽到的 $n$ | $(x_1, y_n)$ | 負的隨機梯度 $0.5\,y_n\mathbf{x}_n$ | 減去平均之後的雜訊 |
|---|---|---|---|
| 1 | $(-2, -1)$ | $(-0.5, 1.0)$ | $(-0.4, 0.6)$ |
| 2 | $(-1, -1)$ | $(-0.5, 0.5)$ | $(-0.4, 0.1)$ |
| 3 | $(0, +1)$ | $(0.5, 0)$ | $(0.6, -0.4)$ |
| 4 | $(1, -1)$ | $(-0.5, -0.5)$ | $(-0.4, -0.9)$ |
| 5 | $(2, +1)$ | $(0.5, 1.0)$ | $(0.6, 0.6)$ |

五個方向的平均是 $(-0.1, 0.4)$，正是上一堂算出來的 $-\nabla E_{\text{in}}(\mathbf{w}_0)$。最右欄的雜訊加起來是 $(0, 0)$，這就是「平均為零」。但單看任何一筆都不等於真梯度：抽到第 4 筆時，$w_1$ 的方向甚至和真梯度相反。

**連走三步。** 假設依序抽到第 5、4、3 筆：

| 步 | 抽到 | $s = \mathbf{w}_t^\top\mathbf{x}_n$ | $\theta(-y_ns)$ | 更新後的 $\mathbf{w}_{t+1}$ | $E_{\text{in}}(\mathbf{w}_{t+1})$ |
|---|---|---|---|---|---|
| 1 | 第 5 筆 | $0$ | 0.5 | $(0.05, 0.1)$ | 0.6610 |
| 2 | 第 4 筆 | $0.15$ | 0.5374 | $(-0.0037, 0.0463)$ | 0.6748 |
| 3 | 第 3 筆 | $-0.0037$ | 0.5009 | $(0.0464, 0.0463)$ | 0.6801 |

第 2 步的算法：$\mathbf{w}_1 = (0.05, 0.1)$，第 4 筆 $\mathbf{x} = (1, 1)$、$y = -1$，分數是 $0.15$，$\theta(0.15) = 0.5374$，$\mathbf{w}_2 = (0.05, 0.1) + 0.1 \times 0.5374 \times (-1)(1, 1) = (-0.0037, 0.0463)$。

起點的 $E_{\text{in}}$ 是 $\ln 2 \approx 0.6931$。第 1 步降到 0.6610，第 2、3 步卻連續上升。上一堂的梯度下降從同一個起點出發，三步的 $E_{\text{in}}$ 是 0.6766、0.6615、0.6479，每一步都下降。講義說的 less stable 在這裡看得到：每一步只對抽到的那一筆負責，整體的 $E_{\text{in}}$ 可能變差。

**跑久一點。** 用 Python 的 `random.seed(1126)`、每步以 `random.randrange(5)` 抽一筆，跑一萬步：

| 步數 $t$ | $\mathbf{w}_t$ | $E_{\text{in}}(\mathbf{w}_t)$ |
|---|---|---|
| 10 | $(0.0061, 0.3254)$ | 0.5897 |
| 100 | $(-0.5823, 0.9337)$ | 0.4872 |
| 1,000 | $(-0.5859, 0.9496)$ | 0.4866 |
| 10,000 | $(-0.7702, 1.1346)$ | 0.4859 |

谷底是 $\mathbf{w} \approx (-0.6227, 1.0904)$、$E_{\text{in}} \approx 0.4844$。SGD 一百步就走到谷底附近，之後不會停在那裡：最後一千步的 $E_{\text{in}}$ 在 0.4844 到 0.5582 之間來回，$w_0$ 在 $-1.29$ 到 $-0.31$ 之間晃。原因是谷底的真梯度雖然是零，單筆的隨機梯度並不是零，每一步仍然會被推離谷底。「跑夠久就停」實際得到的就是這樣一個在谷底附近晃的 $\mathbf{w}$。

成本的比較：SGD 走 100 步只算了 100 次單筆梯度，$E_{\text{in}}$ 是 0.4872；梯度下降算同樣 100 次單筆梯度只能走 20 步，$E_{\text{in}}$ 是 0.5365。這是單一亂數種子、五筆資料的結果，換一個種子數字會不同，不能當成一般結論。

**和 PLA 比一步。** 從 $\mathbf{w}_{\text{LIN}} = (-0.2, 0.4)$ 出發（也就是照講義的建議，拿線性迴歸的解當 $\mathbf{w}_0$）：

| 抽到 | $y_ns$ | SGD 的係數 $\theta(-y_ns)$ | SGD 更新後（$\eta = 0.1$） | PLA 更新後 |
|---|---|---|---|---|
| 第 4 筆（分錯） | $-0.2$ | 0.5498 | $(-0.255, 0.345)$ | $(-1.2, -0.6)$ |
| 第 1 筆（分對） | $1.0$ | 0.2689 | $(-0.2269, 0.4538)$ | 不動，$(-0.2, 0.4)$ |

分對的第 1 筆，SGD 還是會更新，只是係數比較小；PLA 完全不動。再把 $\mathbf{w}$ 放大成 $(-6, 11)$：第 1 筆的 $y_ns = 28$，係數是 $7 \times 10^{-13}$，等於不更新；分錯的第 3 筆 $y_ns = -6$，係數是 0.9975；分錯的第 4 筆 $y_ns = -5$，係數是 0.9933。係數幾乎只剩 0 與 1，和 PLA 的指示函數一樣，這就是講義那句「$\mathbf{w}_t^\top\mathbf{x}_n$ 很大時 PLA ≈ SGD 邏輯迴歸」。

### Fun Time：線性迴歸的 SGD 方向

**題目（第 12 頁）：** 資料量很大時想把 SGD 用在線性迴歸上。用負的隨機梯度當更新方向，這個方向是什麼？

1. $\mathbf{x}_n$
2. $y_n\mathbf{x}_n$
3. $2(\mathbf{w}_t^\top\mathbf{x}_n - y_n)\mathbf{x}_n$
4. $2(y_n - \mathbf{w}_t^\top\mathbf{x}_n)\mathbf{x}_n$

**答案：4。** 線性迴歸的單筆誤差是 $\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = (\mathbf{w}^\top\mathbf{x}_n - y_n)^2$。用連鎖律，外層平方微分得到 $2(\mathbf{w}^\top\mathbf{x}_n - y_n)$，內層 $\mathbf{w}^\top\mathbf{x}_n$ 對 $\mathbf{w}$ 微分得到 $\mathbf{x}_n$，所以梯度是 $2(\mathbf{w}^\top\mathbf{x}_n - y_n)\mathbf{x}_n$。更新方向是負的梯度，把括號裡的順序對調就是選項 4。

選項 3 是梯度本身，少了負號，照它走 $E_{\text{in}}$ 會變大。選項 2 是 PLA 與邏輯迴歸的修正方向，沒有殘差的大小。選項 1 連標籤都沒用到。

講義的解答補了一個物理意義：更新量和殘差 $y_n - \mathbf{w}_t^\top\mathbf{x}_n$ 成正比。課堂上說，這也是往 $\mathbf{x}_n$ 的方向更新，錯得愈多（$y_n$ 與目前分數差得愈遠）更新得愈多。課堂上也交代了為什麼會想這樣做：資料量大到沒辦法用 pseudo-inverse 一次算出解的時候，可以改用 SGD。

本文驗算：在五位病人的資料上任取 $\mathbf{w} = (0.3, -0.2)$，五筆 $2(\mathbf{w}^\top\mathbf{x}_n - y_n)\mathbf{x}_n$ 的平均是 $(1.0, -2.4)$，和基石第 9 堂的公式 $\nabla E_{\text{in}}(\mathbf{w}) = \frac{2}{N}(X^\top X\mathbf{w} - X^\top\mathbf{y})$ 算出來的一樣。

## 從是非題到選擇題：一次分出一個類別的 OVA

```youtube
url: https://www.youtube.com/watch?v=wnM435PDHGY
title: Linear Models for Classification :: Multiclass via Logistic @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:18 提出多類別問題，01:18–03:12 一次分出一個類別，03:12–05:59 組合四個二元分類器時遇到的麻煩，05:59–09:38 改用軟性分類器，09:38–13:30 是 OVA 演算法與優缺點，之後是 Fun Time。）

### 四個類別的問題

第 13 頁換了一個問題：輸出空間是 $\mathcal{Y} = \{\square, \Diamond, \triangle, \star\}$，方塊、菱形、三角形、星形四種。圖上方塊在右上、菱形在左上、三角形在左下、星形在右下。課堂上把這個轉變說成從是非題變成選擇題，並回顧基石第 3 堂：多類別分類在實務上到處都是，尤其是視覺、聲音這類辨識問題。

這一節與下一節要做的事寫在頁尾：把處理圈圈叉叉的工具，用到四個符號的分類上。

### 一次問一個是非題

第 14 頁的做法是一次只問一個類別。先問「是不是方塊」：把方塊當成圈圈，其他三類都當成叉叉，就是一個二元分類問題，解出來是一條把右上角切開的線。課堂上對照寫選擇題的經驗：有四個選項不知道選哪個，就先判斷「是第一個選項，還是不是」。同樣的事對菱形、三角形、星形各做一次，得到四個二元分類器。

第 15 頁把四個分類器的結果疊在一起。課堂上分三種區域講：

- **只有一個分類器說「是」的區域。** 例如右上角一帶只有方塊分類器說圈圈，其他三個都說叉叉。這些區域沒有疑義。
- **兩個分類器都說「是」的區域。** 例如方塊與菱形之間的那一帶，兩個分類器都搶著說是自己的。
- **四個分類器都說「不是」的區域。** 圖的正中央，沒有任何一個分類器認領。

後兩種區域沒辦法決定要預測哪一類。講義在這一頁只留一句「but ties? :-)」，圖上那些區域畫成雜點。

### 改成軟性的分類器

第 16 頁的標題多了一個字：One Class at a Time **Softly**。課堂上的想法是，不要只回答是或不是，改回答可能性有多高，這正是邏輯迴歸在做的事。把方塊當圈圈、其他當叉叉跑一次邏輯迴歸，得到的是 $P(\square \mid \mathbf{x})$ 的估計；圖上原本一刀兩斷的邊界變成漸層，顏色愈深可能性愈高，邊界附近是機率接近 0.5 的模糊地帶。

四個類別各跑一次，就有四個機率的估計。第 17 頁的組合方式是選估計機率最高的那一類。課堂上舉的數字是：四個分類器分別回答 0.7、0.2、0.05、0.05，當然選 0.7 那一個。寫成式子：

$$
g(\mathbf{x}) = \mathop{\text{argmax}}_{k \in \mathcal{Y}}\ \theta\big(\mathbf{w}_{[k]}^\top\mathbf{x}\big)
$$

$\mathbf{w}_{[k]}$ 是第 $k$ 類那個分類器的權重。投影片上 $\theta$ 是灰色的，課堂上解釋原因：logistic 函數是單調的，分數愈大機率愈大，比大小的結果不會變，所以預測時不必真的算 $\theta$，直接比分數 $\mathbf{w}_{[k]}^\top\mathbf{x}$ 就好。

這樣一來，剛才兩種麻煩的區域都有答案：兩個分類器都說是，就比誰的分數高；四個都說不是，就選「最不否定」的那一個。圖上的雜點消失，整個平面被分成四塊。

### OVA 演算法

第 18 頁把上面的流程寫成 One-Versus-All（OVA）Decomposition：

1. 對每個 $k \in \mathcal{Y}$，在下面這份重新標記的資料上跑邏輯迴歸，得到 $\mathbf{w}_{[k]}$：

$$
\mathcal{D}_{[k]} = \big\{(\mathbf{x}_n,\ y'_n = 2\llbracket y_n = k \rrbracket - 1)\big\}_{n=1}^{N}
$$

2. 回傳 $g(\mathbf{x}) = \mathop{\text{argmax}}_{k \in \mathcal{Y}}\big(\mathbf{w}_{[k]}^\top\mathbf{x}\big)$。

$2\llbracket y_n = k \rrbracket - 1$ 只是把標籤換成 $\pm 1$ 的寫法：$y_n$ 是第 $k$ 類時指示函數是 1，$y'_n = +1$；不是時指示函數是 0，$y'_n = -1$。$\mathbf{x}_n$ 完全沒變，$N$ 筆資料都還在。課堂上把名字解釋成一個類別對其他所有類別，把多類別問題拆（decompose）成好幾個二元分類問題。

講義列的優缺點，加上課堂上的說明：

- **優點：有效率。** 可以搭配任何「類似邏輯迴歸」的方法。課堂上把條件講得更清楚：只要方法能輸出一個 0 到 1 之間的值，或是任何可以比大小的實數，都能套進來。
- **缺點：$K$ 大時 $\mathcal{D}_{[k]}$ 常常不平衡。** 課堂上舉 100 個類別、各類資料量相當的情況：每個子問題只有 1% 的圈圈、99% 的叉叉，一個全部猜叉叉的假說就有 99% 的正確率。於是可能拿到一百個都很愛猜叉叉的假說，預測時只是在這堆假說裡挑分數最高的，表現不一定好。
- **延伸：multinomial（「coupled」）logistic regression。** 課堂上補充，OVA 的 $K$ 個機率是各自估的，沒有要求它們加起來是 1；統計上有更有系統的多類別延伸，把這個條件放進去，可能得到更好的估計。這門課只提到名字，有興趣的人可以自己去讀。

講義最後的評語是：OVA 是一個簡單的多類別 meta-algorithm，值得放進工具箱。

### 數值例子：四個類別，三個測試點

以下是本文自擬的例子，不在講義上。四個類別的擺法照講義的圖：方塊在右上、菱形在左上、三角形在左下、星形在右下，$\mathbf{x} = (1, x_1, x_2)$。假設四次邏輯迴歸跑完得到下面四組權重；這些數字是本文為了好算而設定的，不是訓練出來的：

| 類別 $k$ | $\mathbf{w}_{[k]}$ | 分數 $\mathbf{w}_{[k]}^\top\mathbf{x}$ |
|---|---|---|
| 方塊 | $(-1, 1, 1)$ | $x_1 + x_2 - 1$ |
| 菱形 | $(-1, -1, 1)$ | $-x_1 + x_2 - 1$ |
| 三角形 | $(-1, -1, -1)$ | $-x_1 - x_2 - 1$ |
| 星形 | $(-1, 1, -1)$ | $x_1 - x_2 - 1$ |

三個測試點各算四個分數，括號裡是 $\theta$ 之後的機率估計：

| 測試點 $(x_1, x_2)$ | 方塊 | 菱形 | 三角形 | 星形 | 說「是」的有幾個 | 四個機率的和 |
|---|---|---|---|---|---|---|
| $(1.5, 1)$ | $1.5$（0.818） | $-1.5$（0.182） | $-3.5$（0.029） | $-0.5$（0.378） | 1 個 | 1.407 |
| $(0.2, 2)$ | $1.2$（0.769） | $0.8$（0.690） | $-3.2$（0.039） | $-2.8$（0.057） | 2 個 | 1.555 |
| $(0.2, 0.3)$ | $-0.5$（0.378） | $-0.9$（0.289） | $-1.5$（0.182） | $-1.1$（0.250） | 0 個 | 1.099 |

以第二個點為例：方塊的分數是 $0.2 + 2 - 1 = 1.2$，$\theta(1.2) = 0.769$；菱形的分數是 $-0.2 + 2 - 1 = 0.8$，$\theta(0.8) = 0.690$。

**這個結果代表什麼。**

- 如果每個分類器只回答是或不是（分數大於 0 才說是），第一個點沒有疑義；第二個點方塊與菱形都說是，就是第 15 頁的平手；第三個點沒有任何分類器認領。
- 比分數之後，三個點都預測方塊。第二個點靠 $1.2 > 0.8$ 分出高下，第三個點選的是四個負分裡最接近 0 的那一個。
- 比分數和比機率的結果一樣，因為 $\theta$ 是單調的，所以預測時可以省掉 $\theta$。
- 四個機率加起來是 1.407、1.555、1.099，都不是 1。這就是課堂上說的：OVA 各自估計每一類的機率，沒有要求總和是 1。

再看訓練資料的比例。假設訓練資料有 8 筆，每類 2 筆。$\mathcal{D}_{[\text{方塊}]}$ 仍然是 8 筆，其中 2 筆是 $+1$、6 筆是 $-1$，比例 1 比 3。類別數變成 100 而每類資料量相同時，比例是 1 比 99。

### Fun Time：OVA 要花多少訓練力氣

**題目（第 19 頁）：** 對一份 $K$ 類、大小為 $N$ 的資料，用邏輯迴歸做 OVA。下面哪一個最能描述訓練要花的力氣？

1. 學 $K$ 個邏輯迴歸假說，每個用大小 $N/K$ 的資料
2. 學 $K$ 個邏輯迴歸假說，每個用大小 $N\ln K$ 的資料
3. 學 $K$ 個邏輯迴歸假說，每個用大小 $N$ 的資料
4. 學 $K$ 個邏輯迴歸假說，每個用大小 $NK$ 的資料

**答案：3。** $\mathcal{D}_{[k]}$ 的定義裡 $n$ 從 1 跑到 $N$，每一筆資料都在，只有標籤換掉，所以每個子問題的大小就是 $N$。課堂上的說明是：每一筆資料跟原來沒有差很多，只是把 label 換掉而已。

選項 1 是把資料按類別切開的大小，但 OVA 的每個子問題需要其他類別的資料當叉叉，不能只拿自己那一類。選項 2 的 $\ln K$ 沒有任何來源。選項 4 是把 $K$ 個子問題的資料量加總，不是每一個的大小。

講義的解答另外提醒：$K$ 個子問題互不相干，很容易平行處理。課堂上說，有很多台機器的話，可以把它們分到不同的機器上做。

## 讓類別兩兩對打：OVO 與錦標賽冠軍

```youtube
url: https://www.youtube.com/watch?v=vxnjOI_ASlw
title: Linear Models for Classification :: Multiclass via Binary @ Machine Learning Foundations (機器學習基石)
```

（影片 00:01–00:41 回顧 OVA 的不平衡，00:41–02:32 一次只比兩個類別，02:32–06:16 用投票組合六個分類器，06:16–08:58 是 OVO 演算法與優缺點，08:58–09:59 是 Fun Time，之後是整堂課的總結。）

### 不平衡從哪裡來

第 20 頁的標題是 Source of Unbalance: One versus **All**。OVA 的每個子問題都是一類對上其餘所有類，課堂上用打架來比喻：一個要打很多個，圈圈很少、叉叉很多，就不平衡。解法也照這個比喻走：一個打很多個不公平，那就改成一對一。講義的寫法是 make binary classification problems more balanced by one versus **one**。

### 一次只比兩個類別

第 21 頁每次只挑兩個類別出來比。例如「方塊還是菱形」：方塊當圈圈、菱形當叉叉，三角形與星形的資料標成 nil，這一輪不使用。解出來是一條把平面分成「比較像方塊」與「比較像菱形」兩邊的線。課堂上說，如果原本各類的資料量大致平均，這個二元分類問題也會是平均的。

四個類別挑兩個，共有 $\binom{4}{2} = 6$ 種挑法，講義六張圖依序是：方塊對菱形、方塊對三角形、方塊對星形、菱形對三角形、菱形對星形、三角形對星形。

### 六個分類器怎麼合成一個預測

第 22 頁把六個分類器組合起來。課堂上先看和方塊有關的三個分類器（訓練時用到方塊資料的那三個）：在靠近方塊的區域，三個都把票給方塊，光憑這三個就知道那一帶大概是方塊。

接著是棒球的比喻：四個類別像四支棒球隊，六個分類器是它們的循環賽，每一場決定兩隊誰比較好，最後看誰是總冠軍。課堂上在圖上點了一個測試點，六場的結果是：

| 比賽 | 勝方 |
|---|---|
| 方塊 對 菱形 | 方塊 |
| 方塊 對 三角形 | 方塊 |
| 方塊 對 星形 | 方塊 |
| 菱形 對 三角形 | 菱形 |
| 菱形 對 星形 | 星形 |
| 三角形 對 星形 | 星形 |

方塊贏三場、星形贏兩場、菱形贏一場、三角形全輸，所以這個點預測方塊。課堂上特別提到第四場：菱形對三角形的分類器沒有用方塊的資料訓練，它還是會對這個點表態。每個點都這樣打六場，就得到第 22 頁右上那張把平面分成四塊的圖。講義的式子是

$$
g(\mathbf{x}) = \text{tournament champion}\big\{\mathbf{w}_{[k,\ell]}^\top\mathbf{x}\big\}
$$

底下註明 voting of classifiers：也可以看成六個分類器在投票。

### OVO 演算法

第 23 頁寫成 One-versus-one（OVO）Decomposition：

1. 對每一組 $(k, \ell) \in \mathcal{Y} \times \mathcal{Y}$，在下面這份資料上跑線性二元分類，得到 $\mathbf{w}_{[k,\ell]}$：

$$
\mathcal{D}_{[k,\ell]} = \big\{(\mathbf{x}_n,\ y'_n = 2\llbracket y_n = k \rrbracket - 1) : y_n = k \text{ 或 } y_n = \ell\big\}
$$

2. 回傳 $g(\mathbf{x}) = \text{tournament champion}\big\{\mathbf{w}_{[k,\ell]}^\top\mathbf{x}\big\}$。

和 OVA 的 $\mathcal{D}_{[k]}$ 相比，標籤的寫法一樣（第 $k$ 類是 $+1$），差別在冒號後面的條件：只留下屬於 $k$ 或 $\ell$ 的資料，這時不是 $k$ 的就一定是 $\ell$，標成 $-1$。

講義把 $(k, \ell)$ 的範圍寫成 $\mathcal{Y} \times \mathcal{Y}$，字面上是所有有序的配對。課堂上口頭講的比較精確：分類器的個數嚴格來說是 $K$ 取 2，也就是 $\binom{K}{2} = \frac{K(K-1)}{2}$ 個。$(\ell, k)$ 和 $(k, \ell)$ 是同一場比賽，$(k, k)$ 沒有對手。

講義列的優缺點，加上課堂上的說明：

- **優點：有效率，因為訓練問題比較「小」。** 課堂上先替學生提出疑問：四類就要訓練六個分類器，怎麼會有效率？答案是每個分類器只用到兩個類別的資料，其他資料像被丟掉一樣，每次解的都是比較小的問題。
- **優點：穩定。** 課堂上的解釋是，打比賽的過程用了許多不同的分類方式，再用投票決定，像民主機制一樣。
- **優點：可以搭配任何二元分類方法。** 課堂上只說這一點和 OVA 一樣，很通用。本文補充兩頁講義用詞的差別：OVA 那一頁寫的是 logistic regression-like approaches，因為 OVA 要比較各個分類器的輸出誰大，分類器得輸出可以比大小的值；OVO 只需要每個分類器投一票，所以這一頁第 1 步寫的是 linear binary classification，只輸出 $\pm 1$ 的 PLA、pocket 也能用。兩節的標題也是這樣分的：這一節是 Multiclass via Binary Classification，上一節是 via Logistic Regression。
- **缺點：要用 $O(K^2)$ 個 $\mathbf{w}_{[k,\ell]}$。** 講義列了三個後果：占更多空間、預測更慢、要做更多次訓練。課堂上以四類為例：六個 $\mathbf{w}$ 要花六倍的力氣儲存，預測時六個分數都要算出來才知道誰是贏家；訓練時如果想平行處理，也要多幾台機器。

課堂上的整體評價是，類別數沒有非常多的時候，OVO 是簡單又常用的方法。講義的結語和 OVA 那一頁成對：另一個值得放進工具箱的多類別 meta-algorithm。

### 數值例子：同一組測試點改用 OVO

以下是本文自擬的例子，不在講義上。沿用 OVA 例子的四個類別與擺法。六個兩兩對決的分類器同樣是本文設定的，沒有經過訓練；$\mathbf{x} = (1, x_1, x_2)$，分數大於 0 時把票投給前面那一類：

| 分類器 $[k, \ell]$ | $\mathbf{w}_{[k,\ell]}$ | 分數 | 意思 |
|---|---|---|---|
| 方塊 對 菱形 | $(0, 1, 0)$ | $x_1$ | 右邊是方塊 |
| 方塊 對 三角形 | $(0, 1, 1)$ | $x_1 + x_2$ | 右上是方塊 |
| 方塊 對 星形 | $(0, 0, 1)$ | $x_2$ | 上面是方塊 |
| 菱形 對 三角形 | $(0, 0, 1)$ | $x_2$ | 上面是菱形 |
| 菱形 對 星形 | $(0, -1, 1)$ | $-x_1 + x_2$ | 左上是菱形 |
| 三角形 對 星形 | $(0, -1, 0)$ | $-x_1$ | 左邊是三角形 |

對 OVA 例子裡四個分類器都不認領的 $(0.2, 0.3)$，以及一個新的點 $(-1.5, -0.5)$，各打六場：

| 比賽 | $(0.2, 0.3)$ 的分數 | 勝方 | $(-1.5, -0.5)$ 的分數 | 勝方 |
|---|---|---|---|---|
| 方塊 對 菱形 | $0.2$ | 方塊 | $-1.5$ | 菱形 |
| 方塊 對 三角形 | $0.5$ | 方塊 | $-2.0$ | 三角形 |
| 方塊 對 星形 | $0.3$ | 方塊 | $-0.5$ | 星形 |
| 菱形 對 三角形 | $0.3$ | 菱形 | $-0.5$ | 三角形 |
| 菱形 對 星形 | $0.1$ | 菱形 | $1.0$ | 菱形 |
| 三角形 對 星形 | $-0.2$ | 星形 | $1.5$ | 三角形 |

第一個點的票數是方塊 3、菱形 2、星形 1、三角形 0，預測方塊；第二個點是三角形 3、菱形 2、星形 1、方塊 0，預測三角形。

**這個結果代表什麼。**

- 一個類別最多只打 $K - 1 = 3$ 場，拿到 3 票就是全勝，一定是冠軍。兩個點的冠軍都是全勝。
- OVA 裡 $(0.2, 0.3)$ 沒有任何分類器說是，要靠比分數才決定得了；OVO 每一場都只回答二選一，用票數就能決定，不需要分類器輸出機率。
- 訓練資料的比例也不同。沿用每類 2 筆、共 8 筆的假設：OVA 的每個子問題是 8 筆、2 比 6；OVO 的每個子問題是 4 筆、2 比 2。

本文補充：講義沒有談 OVO 票數相同的情況，但它是可能發生的。三個類別時，如果 A 贏 B、B 贏 C、C 贏 A，三類各得一票，這時需要另外規定怎麼決定，例如比分數的總和。

### Fun Time：OVO 要花多少 CPU 時間

**題目（第 24 頁）：** 假設某個二元分類演算法處理大小為 $N$ 的資料剛好要 $N^3$ 秒的 CPU 時間。有一個 10 類的分類問題，每類有 $N/10$ 筆資料。用這個演算法做 OVO，總共要多少秒？

1. $\frac{9}{200}N^3$
2. $\frac{9}{25}N^3$
3. $\frac{4}{5}N^3$
4. $N^3$

**答案：2。** 10 類兩兩配對，有 $\binom{10}{2} = 45$ 個分類器。每個只用兩類的資料，大小是 $\frac{2N}{10} = \frac{N}{5}$，要花 $\big(\frac{N}{5}\big)^3 = \frac{N^3}{125}$ 秒。合計

$$
45 \times \frac{N^3}{125} = \frac{9}{25}N^3
$$

選項 1 的 $\frac{9}{200} = 45 \times \frac{1}{1000}$，是把每個子問題的大小錯當成 $\frac{N}{10}$（只算了一類）。選項 4 是直接對全部資料跑一次的時間，沒有做任何拆解。選項 3 對不上任何合理的算法。

講義的解答順便算了 OVA：10 個分類器、每個用全部 $N$ 筆，要 $10N^3$ 秒，比 OVO 差很多。課堂上說這是跑不掉的。

本文補充：把這題推廣到 $K$ 類、每類 $N/K$ 筆，就看得出 OVO 省在哪裡。如果演算法的時間是 $N^p$：

$$
\text{OVO：}\ \frac{K(K-1)}{2}\Big(\frac{2N}{K}\Big)^p, \qquad \text{OVA：}\ K \cdot N^p
$$

| 演算法的時間 | OVO（$K = 10$） | OVA（$K = 10$） |
|---|---|---|
| $N$ | $9N$ | $10N$ |
| $N^2$ | $\frac{9}{5}N^2$ | $10N^2$ |
| $N^3$ | $\frac{9}{25}N^3$ | $10N^3$ |

演算法是線性時間的話，兩者幾乎一樣；時間成長得愈快，子問題變小的好處愈大。這張表只算訓練時間。預測時 OVO 要算 45 個分數，OVA 只要 10 個，講義列的「更多空間、預測更慢」不受這個結論影響。

### 這堂課的四句話

第 25 頁的總結把四節各收成一句：三個線性模型各有各的用處；SGD 是跟著負的隨機梯度走；OVA 用估計出來的 $P(k \mid \mathbf{x})$ 最大的那一類當預測；OVO 預測錦標賽的冠軍。課堂上收尾時說，到這堂為止介紹的方法都是線性的，腦袋裡都有一個 $\mathbf{w}$，用它和 $\mathbf{x}$ 算出分數再拿來用；下一堂要從線性走到非線性，做出二次、三次曲線的分類邊界。講義上的預告是 next: from linear to nonlinear。

## 自我檢查

**1. 一筆資料的 $y = -1$，模型算出的分數是 $s = 0.4$。算出四種誤差，並指出哪一個比 0/1 誤差小。**

答案：$ys = -0.4$。0/1 誤差是 1（分錯）；平方誤差是 $(-0.4 - 1)^2 = 1.96$；cross-entropy 是 $\ln(1 + e^{0.4}) \approx 0.9130$；scaled cross-entropy 是 $0.9130 / \ln 2 \approx 1.3172$。比 0/1 誤差小的只有 cross-entropy，因為 $-0.4$ 落在 $-0.541 < ys \le 0$ 那一段。

**2. 某個 $\mathbf{w}$ 的 $E_{\text{in}}^{\text{CE}}$ 是 0.3。它的 $E_{\text{in}}^{0/1}$ 最多是多少？如果 $E_{\text{in}}^{\text{CE}}$ 是 0.8 呢？另外說明：為什麼「cross-entropy 最小的 $\mathbf{w}$」不一定是「0/1 誤差最小的 $\mathbf{w}$」？**

答案：$0.3 / \ln 2 \approx 0.433$；$0.8 / \ln 2 \approx 1.154$，超過 1，這個上界沒有提供任何資訊。第二問的判準：要說出不等式只保證 0/1 誤差不超過上界，沒有說兩者的最小點相同；能舉出五位病人的例子更好（$\mathbf{w}_{\text{LOG}}$ 的 0/1 誤差是 0.4，$(0.5, 1)$ 的是 0.2，後者的 cross-entropy 卻比較大）。

**3. $\mathbf{w}_t = (0, 1)$，抽到的資料是 $\mathbf{x}_n = (1, 2)$、$y_n = -1$，$\eta = 0.1$。算出 SGD 邏輯迴歸的 $\mathbf{w}_{t+1}$，再算 PLA 的 $\mathbf{w}_{t+1}$。**

答案：分數 $s = 2$，$y_ns = -2$，分錯了。SGD 的係數是 $\theta(2) \approx 0.8808$，$\mathbf{w}_{t+1} = (0, 1) + 0.1 \times 0.8808 \times (-1)(1, 2) = (-0.0881, 0.8238)$。PLA 因為分錯而更新，$\mathbf{w}_{t+1} = (0, 1) + (-1)(1, 2) = (-1, -1)$。兩者方向相同，SGD 走的長度是 PLA 的 $0.1 \times 0.8808 \approx 0.088$ 倍。

**4. $K = 5$ 類、$N = 1{,}000$ 筆、每類 200 筆。OVA 與 OVO 各要訓練幾個分類器？每個子問題有幾筆、正負比例是多少？如果二元分類演算法的時間是 $N^2$，兩者的總訓練時間各是多少？**

答案：OVA 是 5 個分類器，每個 1,000 筆，正負比 200 比 800，總時間 $5N^2$。OVO 是 $\binom{5}{2} = 10$ 個分類器，每個 400 筆，正負比 200 比 200，每個花 $(0.4N)^2 = 0.16N^2$，總時間 $1.6N^2$。

**5. OVA 預測時為什麼可以不算 $\theta$？OVA 的 $K$ 個機率估計加起來為什麼不一定是 1？OVO 為什麼可以搭配 PLA，OVA 卻不適合？**

判準：第一問要提到 $\theta$ 單調遞增，所以分數的大小順序和機率的大小順序相同。第二問要說出 $K$ 個邏輯迴歸是在各自重新標記的資料上獨立訓練的，沒有任何一步要求總和是 1；能提到 multinomial logistic regression 把這個條件放進去更好。第三問要說出 OVO 每個分類器只需要投一票（輸出 $\pm 1$ 就夠），OVA 要比較 $K$ 個分類器的輸出誰大，只輸出 $\pm 1$ 會遇到平手或無人認領。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把基石第 11、12 堂排在同一週（W6，10/07），這堂對應的投影片是 [11u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/11u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)排在 W6（10/14），2026-09-30 查核時那一週的投影片連結還是 404。本文只用 MOOC 版講義，沒有逐頁比對兩個版本。這堂的四支影片是官方播放清單的第 42 到 45 支。

**教科書。** 兩份課程頁都把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 3.3 節。

**作業。** 相關的題目在 [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)（2024-10-21 發布、11-04 截止，12 題加 1 題 bonus；Q1–4 是自動批改的選擇題，Q5–12 由助教批改），沒有官方解答：

- **Q2**：PLA 的「全部分錯的點一起更新」變體，等於對哪一種逐點誤差做梯度下降。對應這堂的誤差函數比較與「軟的 PLA」。
- **Q3**：高估比低估更糟的非對稱平方誤差，求 SGD 的更新方向。做法和「Fun Time：線性迴歸的 SGD 方向」相同，先寫單筆誤差再微分。
- **Q6–7**：題目明寫 In Lecture 11，要推導 multinomial logistic regression 的 SGD 方向，以及 $K = 2$ 時它和二元邏輯迴歸的解有什麼關係。這是 OVA 那一頁「extension」的內容。
- **Q10**：用 [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) 資料（公開的 LIBSVM datasets）、$N = 64$，實作線性迴歸的 SGD（題目指定照 Lecture 11 第 10、12 頁），$\eta = 0.01$、跑 10 萬次迭代，和解析解比較；實驗要用不同的隨機種子重複 1126 次。自我驗收的方法：SGD 的 $E_{\text{in}}$ 曲線應該往解析解那條水平線靠近。

同一份作業的 Q1、Q5 屬於基石第 10 堂，Q4、Q11–13 屬於基石第 12 堂，Q8–9 屬於基石第 13 堂。整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**動手做。** 三件事可以直接重現本文的數字：把三種誤差與 scaled cross-entropy 畫在同一張 $ys$ 圖上，對照講義第 4 頁；把上一堂的梯度下降改成每步隨機抽一筆，在五位病人的資料上畫出 $E_{\text{in}}$ 隨步數的變化，看它在谷底附近怎麼晃；把 SGD 邏輯迴歸與 PLA 的更新式寫在同一行，確認看得出 $\theta(-ys)$ 取代了指示函數。

**延伸閱讀。** 同一段內容的其他講法：[Stanford CS229 第 3 堂：最大概似與邏輯斯迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)、[Berkeley CS189 Lec 11–12：分類與 logistic regression](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic)。

**下一堂。** [基石第 12 堂：非線性轉換](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)處理這堂沒碰的情況：資料用直線怎麼切都切不好時，這些線性模型還能不能用。

## 課程影片來源

原始影片：[Linear Models for Binary Classification](https://www.youtube.com/watch?v=qXfDVHVzI38)、[Stochastic Gradient Descent](https://www.youtube.com/watch?v=9HL3YvmrovQ)、[Multiclass via Logistic Regression](https://www.youtube.com/watch?v=wnM435PDHGY)、[Multiclass via Binary Classification](https://www.youtube.com/watch?v=vxnjOI_ASlw)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-13：原本與第 12 堂合為一篇，改為一堂一篇，這篇只寫基石第 11 堂，依講義與影片逐字稿重寫。

## 參考資料

- [基石第 11 堂講義 11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time 與第 4、15、17、22 頁的圖都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次與 LFD 章節。
- [Fall 2024 版投影片 11u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/11u_handout.pdf)：Fall 2024 的對應投影片，本文未逐頁比對。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 4（hw4_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)：Q2、Q3、Q6–7、Q10 的題目內容與發布、截止日期。
- [LIBSVM datasets：cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale)：HW4 Q10 的資料。
- [Learning from Data 教科書網站](http://amlbook.com)：3.3 節的出處。
- [基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)：五位病人的資料、cross-entropy 的梯度與梯度下降的數字出自這篇。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
