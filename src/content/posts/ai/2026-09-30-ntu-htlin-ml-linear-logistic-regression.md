---
title: "線性迴歸：用 pseudo-inverse 一步算出最佳解｜台大林軒田 機器學習基石 第 9 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, linear-regression]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 9
tldr: "線性迴歸把平方誤差寫成 (1/N)‖Xw − y‖²，令梯度為零就得到 w_LIN = X†y，不必迭代。hat matrix H = XX† 把 y 投影到 X 的直行張成的空間，trace(I − H) = N − (d+1)，由此得到平均 E_in = σ²(1 − (d+1)/N)、平均 E_out = σ²(1 + (d+1)/N)。平方誤差又是 0/1 誤差的上界，所以 w_LIN 也能拿來做二元分類。"
description: "台大林軒田機器學習基石第 9 堂 Linear Regression 導讀：線性迴歸的假說與平方誤差、E_in 的矩陣形式與梯度、pseudo-inverse 解、hat matrix 的幾何意義與學習曲線、用迴歸做二元分類的理由，四題 Fun Time 逐題解釋，並用四位顧客的資料把整個演算法手算一遍。"
draft: false
glossary:
  - term: "pseudo-inverse"
    aliases: ["虛反矩陣", "X†", "偽逆矩陣"]
    definition: "線性迴歸的解 w_LIN = X†y 中的 X†。XᵀX 可逆時等於 (XᵀX)⁻¹Xᵀ；不可逆時仍可用其他方式定義，給出眾多最佳解中的一個。"
    context: "基石第 9 堂建議用現成、數值穩定的 pseudo-inverse 程式，不要自己算 (XᵀX)⁻¹Xᵀ。"
    links:
      - label: "第 9 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
  - term: "hat matrix"
    aliases: ["帽子矩陣", "H = XX†"]
    definition: "線性迴歸裡把標籤向量 y 變成預測向量 ŷ 的矩陣 H = XX†，幾何上是把 y 投影到 X 的直行張成的空間。名字來自它替 y「戴上帽子」變成 ŷ。"
    context: "基石第 9 堂用 trace(I − H) = N − (d+1) 推出線性迴歸的平均 E_in 與平均 E_out。"
    links:
      - label: "第 9 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/23 到 23/23），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 9 堂。講義第 1 頁的 Roadmap 從這堂開始進入四大問題的第三個：How Can Machines Learn? 前一個問題的結論在同一頁上是一行：只要有 target distribution $P(y \mid \mathbf{x})$，而且對選定的誤差衡量 err 能把 $E_{\text{in}}$ 做小，學習就可能發生。這是[基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)的結論。課堂上開場補了一句：先前花力氣在二元分類上證明的 VC bound，可以用在不同的誤差衡量與有雜訊的情形，迴歸也包含在內，所以現在可以專心看演算法怎麼設計。

先備是矩陣乘法、轉置、反矩陣、偏微分，以及前幾堂的 $E_{\text{in}}$、$E_{\text{out}}$ 與感知器的假說 $\text{sign}(\mathbf{w}^\top\mathbf{x})$。讀完之後，你應該能自己把 $E_{\text{in}}$ 寫成矩陣形式、推出梯度、解出 $\mathbf{w}_{\text{LIN}}$，對一組小資料手算整個演算法；能說明 hat matrix 在做什麼、學習曲線的兩條式子從哪裡來；也能解釋為什麼迴歸的解可以直接拿去做分類。

## 輸出從「核不核卡」變成「額度給多少」

```youtube
url: https://www.youtube.com/watch?v=qGzjYrLV-4Y
title: Linear Regression :: Linear Regression Problem @ Machine Learning Foundations (機器學習基石)
```

（影片 00:18–02:05 是問題設定，02:05–04:01 是假說，04:01–06:41 是圖示與殘差，06:41–09:10 是誤差衡量，之後是 Fun Time。）

### 信用額度問題

前幾堂的例子是銀行決定要不要發信用卡，輸出只有兩種。講義第 2 頁把題目改成 Credit Limit Problem：同一位顧客（23 歲、女性、年收入新台幣 1,000,000 元、居住 1 年、工作 0.5 年、負債 200,000 元），銀行現在要決定的是給多少額度，投影片上的答案寫著 100,000。課堂上的說法是，這已經不是是非題，這位顧客可能給十萬，另一位可能給八萬。

整個學習流程圖跟以前一樣：未知的目標函數 $f$（理想的額度公式）、訓練資料 $\mathcal{D}$（銀行的歷史紀錄）、假說集合 $\mathcal{H}$、演算法 $\mathcal{A}$、最後的 $g \approx f$。唯一的差別寫在頁尾：

$$
\mathcal{Y} = \mathbb{R} \quad\Longrightarrow\quad \text{regression}
$$

輸出空間是整個實數，這類問題叫迴歸（regression）。課堂上順帶說明：額度其實只會是正數，銀行不會給負的額度，但把輸出空間看得寬一點、當成全部的實數來處理比較方便。

### 假說：感知器拿掉 sign

第 3 頁挑最簡單的假說。顧客的特徵寫成 $\mathbf{x} = (x_0, x_1, \dots, x_d)$，其中 $x_0$ 是照慣例補上的常數項，用加權總和去逼近想要的額度：

$$
y \approx \sum_{i=0}^{d} w_i x_i, \qquad h(\mathbf{x}) = \mathbf{w}^\top\mathbf{x}
$$

講義的註解是「like perceptron, but without the sign」。感知器（[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)）算完分數 $\mathbf{w}^\top\mathbf{x}$ 之後還要取正負號，回答圈或叉；線性迴歸算完分數就直接輸出，因為分數本身就是實數。

第 4 頁用兩張圖說明這個假說長什麼樣子：

| | 左圖：$\mathbf{x} = (x) \in \mathbb{R}$ | 右圖：$\mathbf{x} = (x_1, x_2) \in \mathbb{R}^2$ |
|---|---|---|
| 座標軸 | 橫軸 $x$、縱軸 $y$ | 底面是 $x_1$、$x_2$，高度是 $y$ |
| 資料點 | 平面上的一堆圈 | 空間中的一堆圈 |
| 假說 | 一條藍色的直線 | 一個藍色的平面 |
| 紅色線段 | 每個點到直線的鉛直距離 | 每個點到平面的鉛直距離 |

課堂上提醒這跟以前的圖不一樣：分類的圖只畫 $\mathbf{x}$ 的平面，用圈和叉表示 $y$；現在 $y$ 自己佔一個座標軸，資料點全都畫成圈。紅色線段叫殘差（residual），課堂上稱它「餘數」：假說預測完之後，還沒辦法解釋的那一段。講義把線性迴歸要做的事寫成一句：find lines/hyperplanes with small residuals。

### 誤差衡量：平方誤差

殘差算不算小，要有個量法。第 5 頁用的是講義所說 popular/historical 的平方誤差：

$$
\text{err}(\hat{y}, y) = (\hat{y} - y)^2
$$

課堂上說，線性迴歸是統計學界研究了很久的問題，傳統上最常用的就是平方誤差。套進上一堂的框架，樣本內與樣本外的誤差分別是

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N}\big(\underbrace{h(\mathbf{x}_n)}_{\mathbf{w}^\top\mathbf{x}_n} - y_n\big)^2, \qquad E_{\text{out}}(\mathbf{w}) = \mathop{\mathcal{E}}_{(\mathbf{x}, y)\sim P}\big(\mathbf{w}^\top\mathbf{x} - y\big)^2
$$

兩個記號上的細節，課堂上都有交代。第一，每個 $\mathbf{w}$ 對應一個 $h$，所以直接寫 $E_{\text{in}}(\mathbf{w})$，不寫 $E_{\text{in}}(h)$，之後的式子會簡單一點。第二，$E_{\text{out}}$ 的期望值是對 $(\mathbf{x}, y)$ 一起取的：我們已經在上一堂的有雜訊設定裡，$\mathbf{x}$ 和 $y$ 合起來從一個聯合分布抽出來。

本文補一個小例子看平方的效果（數字是本文自擬的）：預測 9 萬、實際 10 萬，誤差是 $1$；預測 12 萬、實際 8 萬，誤差是 $16$。差距變成 4 倍，誤差變成 16 倍，所以平方誤差特別在意差很多的點。這個性質在最後一節拿迴歸做分類時會再出現。

這一頁的最後一行是「next: how to minimize $E_{\text{in}}(\mathbf{w})$?」。課堂上的說法是：如果你相信 VC bound 的推導，也相信它能延伸到別的問題，那就只剩這一件事要做。

### Fun Time：哪個特徵該拿到正的權重

**題目（第 6 頁）：** 用線性迴歸的假說 $h(\mathbf{x}) = \mathbf{w}^\top\mathbf{x}$ 預測顧客的信用額度。在一個好的假說裡，下面哪個特徵應該有正的權重？

1. 出生月份（birth month）
2. 月收入（monthly income）
3. 目前的負債（current debt）
4. 持有的信用卡張數（number of credit cards owned）

**答案：2。** 講義的解釋是：月收入愈高的顧客，自然該給愈高的額度，正的權重表達的就是這件事。$w_i$ 是正的，代表 $x_i$ 每增加一單位，預測的額度跟著增加 $w_i$。

講義沒有解釋其他選項，以下是本文的推論。出生月份跟還款能力看不出關係，好的假說會給它接近 0 的權重。目前的負債愈多，能再借的空間愈小，合理的權重是負的。信用卡張數的方向不明確，持卡多可能代表信用好，也可能代表已經借了不少，這題沒有理由認定它一定是正的。

## 把梯度設成零，一步解出最好的 w

```youtube
url: https://www.youtube.com/watch?v=2LfdSCdcg1g
title: Linear Regression :: Linear Regression Algorithm @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–05:00 把 $E_{\text{in}}$ 寫成矩陣形式，05:00–08:01 說明凸函數與梯度為零，08:01–12:52 算梯度，12:52–17:35 解方程式與 pseudo-inverse，17:35–18:51 是完整演算法，之後是 Fun Time。）

### 把 E_in 寫成矩陣形式

$E_{\text{in}}$ 的式子裡有個跑來跑去的下標 $n$。第 7 頁用四步把它收進矩陣，課堂上說目的只是讓之後的符號乾淨一點。

**第一步：內積交換順序。** $\mathbf{w}^\top\mathbf{x}_n$ 是兩個向量的內積，內積可以交換，所以等於 $\mathbf{x}_n^\top\mathbf{w}$：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N}\big(\mathbf{w}^\top\mathbf{x}_n - y_n\big)^2 = \frac{1}{N}\sum_{n=1}^{N}\big(\mathbf{x}_n^\top\mathbf{w} - y_n\big)^2
$$

**第二步：平方和就是向量長度的平方。** 把 $N$ 個要平方的量疊成一個 $N$ 維向量，它的長度平方就是各分量的平方和：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\left\lVert \begin{bmatrix} \mathbf{x}_1^\top\mathbf{w} - y_1 \\ \mathbf{x}_2^\top\mathbf{w} - y_2 \\ \vdots \\ \mathbf{x}_N^\top\mathbf{w} - y_N \end{bmatrix} \right\rVert^2
$$

**第三步：把共同的 $\mathbf{w}$ 提出來。** 每一列都有 $\mathbf{w}$。把 $\mathbf{x}_1^\top, \dots, \mathbf{x}_N^\top$ 一列一列疊成矩陣，$y_1, \dots, y_N$ 疊成向量。課堂上的形容是：原本「高高的」向量 $\mathbf{x}_n$ 躺下來變成橫排。

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\left\lVert \begin{bmatrix} \text{---}\ \mathbf{x}_1^\top\ \text{---} \\ \text{---}\ \mathbf{x}_2^\top\ \text{---} \\ \vdots \\ \text{---}\ \mathbf{x}_N^\top\ \text{---} \end{bmatrix}\mathbf{w} - \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_N \end{bmatrix} \right\rVert^2
$$

**第四步：取名字。** 矩陣叫 $\mathrm{X}$，向量叫 $\mathbf{y}$：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\lVert \mathrm{X}\mathbf{w} - \mathbf{y} \rVert^2
$$

講義在底下標了大小：$\mathrm{X}$ 是 $N \times (d+1)$，一筆資料一個橫列、一個特徵一個直行；$\mathbf{w}$ 是 $(d+1) \times 1$；$\mathbf{y}$ 是 $N \times 1$。$\mathrm{X}$ 和 $\mathbf{y}$ 都是資料給的，式子裡唯一會動的只有 $\mathbf{w}$。

### 最低點的條件：梯度是零

第 8 頁先講 $E_{\text{in}}(\mathbf{w})$ 這個函數的三個性質：連續（continuous）、可微（differentiable）、凸（convex）。課堂上對凸函數只給物理上的圖像：它長得像山谷、像一個碗，投影片左邊畫的就是一條開口向上的曲線，橫軸是 $\mathbf{w}$，最低點標了一個黑點。

碗的最低點有什麼特徵？課堂上用一顆球來想：球在谷底時，往哪個方向都滾不下去。梯度的每個分量是函數在一個方向上的斜率，所以谷底的梯度必須是零向量：

$$
\nabla E_{\text{in}}(\mathbf{w}) \equiv \begin{bmatrix} \dfrac{\partial E_{\text{in}}}{\partial w_0}(\mathbf{w}) \\ \dfrac{\partial E_{\text{in}}}{\partial w_1}(\mathbf{w}) \\ \vdots \\ \dfrac{\partial E_{\text{in}}}{\partial w_d}(\mathbf{w}) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ \vdots \\ 0 \end{bmatrix}
$$

講義把這寫成「best $\mathbf{w}$ 的必要條件」，註解是 not possible to 'roll down'。於是任務變成：找到 $\mathbf{w}_{\text{LIN}}$ 使 $\nabla E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \mathbf{0}$。課堂上特別交代下標：LIN 是 linear regression 的意思，跟老師姓林無關。

本文補充兩點。第一，講義只說這是必要條件；對凸函數來說，梯度為零的點也一定是最低點，所以解出來的 $\mathbf{w}_{\text{LIN}}$ 真的是最佳解。課堂上說這裡不做嚴格的證明。第二，為什麼是凸的：對任何方向 $\mathbf{v}$，$\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lVert\mathrm{X}\mathbf{v}\rVert^2 \ge 0$，二次項的彎曲方向永遠朝上。

### 算梯度：先看一個變數，再看向量

第 9 頁先把長度平方展開。$\lVert\mathbf{a}\rVert^2 = \mathbf{a}^\top\mathbf{a}$，所以

$$
\lVert\mathrm{X}\mathbf{w} - \mathbf{y}\rVert^2 = (\mathrm{X}\mathbf{w} - \mathbf{y})^\top(\mathrm{X}\mathbf{w} - \mathbf{y}) = \mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w} - \mathbf{w}^\top\mathrm{X}^\top\mathbf{y} - \mathbf{y}^\top\mathrm{X}\mathbf{w} + \mathbf{y}^\top\mathbf{y}
$$

中間兩項都是純量，而且互為轉置，所以相等，合併成 $-2\mathbf{w}^\top\mathrm{X}^\top\mathbf{y}$。課堂上說這就像 $(a - b)^2$ 展開後的 $-2ab$。講義替三個由資料決定的量取了暫時的名字：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\Big(\mathbf{w}^\top\underbrace{\mathrm{X}^\top\mathrm{X}}_{\mathrm{A}}\mathbf{w} - 2\mathbf{w}^\top\underbrace{\mathrm{X}^\top\mathbf{y}}_{\mathbf{b}} + \underbrace{\mathbf{y}^\top\mathbf{y}}_{c}\Big)
$$

$\mathrm{A}$ 是 $(d+1) \times (d+1)$ 的矩陣，$\mathbf{b}$ 是 $d+1$ 維的向量，$c$ 是一個數字。三項分別是 $\mathbf{w}$ 的二次式、一次式、常數。

課堂上說很多人看到這裡會怕，覺得向量微積分沒學好。講義的做法是先看只有一個 $w$ 的情形，再對照到向量：

| | 只有一個 $w$ | $\mathbf{w}$ 是向量 |
|---|---|---|
| $E_{\text{in}}$ | $\frac{1}{N}(aw^2 - 2bw + c)$ | $\frac{1}{N}(\mathbf{w}^\top\mathrm{A}\mathbf{w} - 2\mathbf{w}^\top\mathbf{b} + c)$ |
| $\nabla E_{\text{in}}$ | $\frac{1}{N}(2aw - 2b)$ | $\frac{1}{N}(2\mathrm{A}\mathbf{w} - 2\mathbf{b})$ |
| 講義的註解 | simple! | similar (derived by definition) |

左邊是高中的一元二次函數微分。右邊長得一模一樣，只是 $a$ 換成矩陣、$b$ 換成向量。講義寫 derived by definition，沒有列過程；課堂上說照定義推一下就會得到，而且過程用到 $\mathrm{A}$ 是對稱矩陣。以下是本文照定義補上的推導。

對第 $k$ 個分量 $w_k$ 偏微分。一次項 $\mathbf{w}^\top\mathbf{b} = \sum_i w_i b_i$，只有 $i = k$ 那一項含 $w_k$，微分得 $b_k$。二次項 $\mathbf{w}^\top\mathrm{A}\mathbf{w} = \sum_i\sum_j w_i A_{ij} w_j$，$w_k$ 出現在 $i = k$ 的那些項，也出現在 $j = k$ 的那些項：

$$
\frac{\partial}{\partial w_k}\sum_{i}\sum_{j} w_i A_{ij} w_j = \sum_{j} A_{kj} w_j + \sum_{i} w_i A_{ik} = (\mathrm{A}\mathbf{w})_k + (\mathrm{A}^\top\mathbf{w})_k
$$

（$i = j = k$ 的那一項是 $A_{kk}w_k^2$，微分得 $2A_{kk}w_k$，剛好在兩個加總裡各出現一次，沒有多算。）$\mathrm{A} = \mathrm{X}^\top\mathrm{X}$ 的轉置是 $(\mathrm{X}^\top\mathrm{X})^\top = \mathrm{X}^\top\mathrm{X}$，它是對稱的，所以 $(\mathrm{A}^\top\mathbf{w})_k = (\mathrm{A}\mathbf{w})_k$，二次項的偏微分是 $2(\mathrm{A}\mathbf{w})_k$。把 $k = 0, 1, \dots, d$ 疊起來，再把 $\mathrm{A}$ 與 $\mathbf{b}$ 換回原本的樣子：

$$
\nabla E_{\text{in}}(\mathbf{w}) = \frac{1}{N}(2\mathrm{A}\mathbf{w} - 2\mathbf{b}) = \frac{2}{N}\big(\mathrm{X}^\top\mathrm{X}\mathbf{w} - \mathrm{X}^\top\mathbf{y}\big)
$$

### 解方程式：pseudo-inverse

第 10 頁令梯度為零：

$$
\frac{2}{N}\big(\mathrm{X}^\top\mathrm{X}\mathbf{w} - \mathrm{X}^\top\mathbf{y}\big) = \mathbf{0} \quad\Longleftrightarrow\quad \mathrm{X}^\top\mathrm{X}\mathbf{w} = \mathrm{X}^\top\mathbf{y}
$$

$\mathrm{X}^\top\mathrm{X}$ 與 $\mathrm{X}^\top\mathbf{y}$ 都算得出來，未知的只有 $\mathbf{w}$，而且每個未知數都是一次方。課堂上說這就是一組聯立一次方程式。接下來分兩種情形。

**$\mathrm{X}^\top\mathrm{X}$ 可逆（invertible）。** 講義寫 easy! unique solution。兩邊左乘反矩陣：

$$
\mathbf{w}_{\text{LIN}} = \underbrace{\big(\mathrm{X}^\top\mathrm{X}\big)^{-1}\mathrm{X}^\top}_{\text{pseudo-inverse } \mathrm{X}^\dagger}\,\mathbf{y}
$$

$(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top$ 這一塊有名字，叫 pseudo-inverse，記成 $\mathrm{X}^\dagger$。課堂上解釋「假的反矩陣」這個名字：假如 $\mathrm{X}$ 是方的而且有反矩陣，這一塊化簡之後就是 $\mathrm{X}^{-1}$；$\mathrm{X}$ 不是方陣時，它的性質仍然跟反矩陣很像。本文補一個可以馬上檢查的性質：$\mathrm{X}^\dagger\mathrm{X} = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathrm{X} = \mathrm{I}$，從左邊乘上去會得到單位矩陣。

講義說這種情形很常見，理由是 $N \gg d + 1$。課堂上的解釋是：$\mathrm{X}^\top\mathrm{X}$ 只有 $(d+1) \times (d+1)$ 這麼大，資料量 $N$ 通常比 $d$ 大很多，矩陣裡有足夠的自由度，所以多半可逆。本文把這句話補得具體一點：如果 $\mathrm{X}^\top\mathrm{X}\mathbf{v} = \mathbf{0}$，那麼 $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lVert\mathrm{X}\mathbf{v}\rVert^2 = 0$，也就是 $\mathrm{X}\mathbf{v} = \mathbf{0}$。所以 $\mathrm{X}^\top\mathrm{X}$ 不可逆，只會發生在某個特徵在全部 $N$ 筆資料上都恰好是其他特徵的線性組合的時候。資料愈多，這種巧合愈難發生。

**$\mathrm{X}^\top\mathrm{X}$ 不可逆（singular）。** 講義寫 many optimal solutions：方程式有很多組解，每一組都是最佳解。這時換別的方式定義 $\mathrm{X}^\dagger$，$\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}$ 仍然是其中一組。課堂上說定義的細節要去翻線性代數的課本，多數數值運算的軟體都已經寫好了。

兩種情形都寫成同一條式子：

$$
\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}
$$

這一頁的實務建議放在黃色框裡：用實作良好的 $\dagger$ 程式，不要自己算 $(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top$，因為矩陣接近不可逆（almost-singular）時前者的數值比較穩定。課堂上多講了一個好處：你不用自己判斷矩陣到底可不可逆。

### 完整演算法

第 11 頁把整件事收成三步：

1. 從資料 $\mathcal{D}$ 建出輸入矩陣 $\mathrm{X}$（$N \times (d+1)$）與輸出向量 $\mathbf{y}$（$N \times 1$）。
2. 算 pseudo-inverse $\mathrm{X}^\dagger$（$(d+1) \times N$）。
3. 回傳 $\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}$（$(d+1) \times 1$）。

講義的評語是 simple and efficient with good $\dagger$ routine。課堂上說第一步幾乎不用做事，只是把資料的輸入與輸出分開放；又說有些人以前只在一維或二維學過迴歸，這裡的推導全程用向量與矩陣，所以不管幾維都是同一套做法。

### 數值例子：四位顧客，手算整個演算法

以下是本文自擬的例子，不在講義上。四位顧客，特徵只有年收入（單位：百萬元），要預測信用額度（單位：十萬元）：

| 顧客 | 年收入 $x$（百萬元） | 額度 $y$（十萬元） |
|---|---|---|
| 1 | 1 | 2 |
| 2 | 2 | 3 |
| 3 | 3 | 5 |
| 4 | 4 | 6 |

**第一步：建 $\mathrm{X}$ 與 $\mathbf{y}$。** 每筆資料前面補 $x_0 = 1$。這裡 $N = 4$、$d = 1$：

$$
\mathrm{X} = \begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \\ 1 & 4 \end{bmatrix}, \qquad \mathbf{y} = \begin{bmatrix} 2 \\ 3 \\ 5 \\ 6 \end{bmatrix}
$$

**第二步：算 $\mathrm{A}$、$\mathbf{b}$、$c$。** $\mathrm{A}$ 的四個元素分別是 $\sum 1 = 4$、$\sum x_n = 10$、$\sum x_n^2 = 1 + 4 + 9 + 16 = 30$；$\mathbf{b}$ 的兩個分量是 $\sum y_n = 16$ 與 $\sum x_n y_n = 2 + 6 + 15 + 24 = 47$；$c = 4 + 9 + 25 + 36 = 74$。

$$
\mathrm{A} = \mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 4 & 10 \\ 10 & 30 \end{bmatrix}, \qquad \mathbf{b} = \mathrm{X}^\top\mathbf{y} = \begin{bmatrix} 16 \\ 47 \end{bmatrix}, \qquad c = 74
$$

**第三步：解 $\mathrm{A}\mathbf{w} = \mathbf{b}$。** 也就是 $4w_0 + 10w_1 = 16$ 與 $10w_0 + 30w_1 = 47$。$\mathrm{A}$ 的行列式是 $4 \times 30 - 10 \times 10 = 20$，不是 0，所以可逆：

$$
\mathrm{A}^{-1} = \frac{1}{20}\begin{bmatrix} 30 & -10 \\ -10 & 4 \end{bmatrix}, \qquad \mathbf{w}_{\text{LIN}} = \mathrm{A}^{-1}\mathbf{b} = \frac{1}{20}\begin{bmatrix} 30 \times 16 - 10 \times 47 \\ -10 \times 16 + 4 \times 47 \end{bmatrix} = \frac{1}{20}\begin{bmatrix} 10 \\ 28 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 1.4 \end{bmatrix}
$$

如果照演算法先把 pseudo-inverse 算出來，它是一個 $2 \times 4$ 的矩陣，第 $n$ 個直行是 $\mathrm{A}^{-1}$ 乘上 $(1, x_n)$：

$$
\mathrm{X}^\dagger = \mathrm{A}^{-1}\mathrm{X}^\top = \frac{1}{20}\begin{bmatrix} 20 & 10 & 0 & -10 \\ -6 & -2 & 2 & 6 \end{bmatrix}
$$

乘上 $\mathbf{y}$：第一列 $\frac{1}{20}(40 + 30 + 0 - 60) = 0.5$，第二列 $\frac{1}{20}(-12 - 6 + 10 + 36) = 1.4$，跟上面一樣。

**第四步：看結果。** 假說是 $h(x) = 0.5 + 1.4x$。

| 顧客 | $y_n$ | $\hat{y}_n = 0.5 + 1.4x_n$ | 殘差 $y_n - \hat{y}_n$ | 殘差平方 |
|---|---|---|---|---|
| 1 | 2 | 1.9 | 0.1 | 0.01 |
| 2 | 3 | 3.3 | −0.3 | 0.09 |
| 3 | 5 | 4.7 | 0.3 | 0.09 |
| 4 | 6 | 6.1 | −0.1 | 0.01 |

$$
E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{0.01 + 0.09 + 0.09 + 0.01}{4} = 0.05
$$

用 $\mathrm{A}$、$\mathbf{b}$、$c$ 的式子再算一次：$\mathbf{w}^\top\mathrm{A}\mathbf{w} = 73.8$、$2\mathbf{w}^\top\mathbf{b} = 147.6$，$\frac{1}{4}(73.8 - 147.6 + 74) = 0.05$，一致。

**這個結果代表什麼。** $w_1 = 1.4$ 的意思是年收入每多一百萬元，預測的額度多 14 萬元；$w_0 = 0.5$ 是 5 萬元的基本額度。$E_{\text{in}} = 0.05$ 的單位是「十萬元的平方」，開根號約 0.224，也就是平均來說預測跟實際差 2 萬多元。換幾個別的 $\mathbf{w}$ 比較，可以看到梯度為零的那一個確實最低：

| $\mathbf{w} = (w_0, w_1)$ | $E_{\text{in}}(\mathbf{w})$ | $\nabla E_{\text{in}}(\mathbf{w}) = \frac{2}{4}(\mathrm{A}\mathbf{w} - \mathbf{b})$ |
|---|---|---|
| $(0, 0)$ | $18.5$ | $(-8, -23.5)$ |
| $(1, 1)$ | $0.5$ | $(-1, -3.5)$ |
| $(0, 1.5)$ | $0.125$ | $(-0.5, -1)$ |
| $(0.5, 1.4)$ | $0.05$ | $(0, 0)$ |

**不可逆的情形。** 再加一個多餘的特徵：$x_2 = 2x_1$（同一個年收入，改用五十萬元當單位）。$\mathrm{X}$ 的第三個直行是第二個的兩倍，$\mathrm{X}^\top\mathrm{X}$ 的行列式是 0。這時 $h(\mathbf{x}) = w_0 + (w_1 + 2w_2)x_1$，只要 $w_0 = 0.5$ 而且 $w_1 + 2w_2 = 1.4$，預測就跟剛才完全一樣，$E_{\text{in}}$ 都是 0.05。$(0.5, 1.4, 0)$、$(0.5, 0, 0.7)$、$(0.5, 3.4, -1)$ 都是最佳解，這就是講義說的 many optimal solutions。

用 NumPy 實際跑：`np.linalg.inv(X.T @ X)` 直接丟出 `Singular matrix` 的錯誤；`np.linalg.pinv(X) @ y` 回傳 $(0.5, 0.28, 0.56)$，它滿足 $0.28 + 2 \times 0.56 = 1.4$，是那一整排最佳解的其中一個。四個解的長度平方分別是 $2.21$、$0.74$、$12.81$、$0.642$，pinv 給的是最短的那一個。這是 Moore-Penrose pseudo-inverse 的性質，講義沒有提，屬於本文補充。

### Fun Time：預測向量的矩陣寫法

**題目（第 12 頁）：** 得到 $\mathbf{w}_{\text{LIN}}$ 之後，可以算出預測值 $\hat{y}_n = \mathbf{w}_{\text{LIN}}^\top\mathbf{x}_n$。把所有 $\hat{y}_n$ 像 $\mathbf{y}$ 那樣疊成向量 $\hat{\mathbf{y}}$，它的矩陣式子是哪一個？

1. $\mathbf{y}$
2. $\mathrm{X}\mathrm{X}^\top\mathbf{y}$
3. $\mathrm{X}\mathrm{X}^\dagger\mathbf{y}$
4. $\mathrm{X}\mathrm{X}^\dagger\mathrm{X}\mathrm{X}^\top\mathbf{y}$

**答案：3。** 講義的解答是：$\hat{\mathbf{y}} = \mathrm{X}\mathbf{w}_{\text{LIN}}$，把 $\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}$ 代進去就是 $\mathrm{X}\mathrm{X}^\dagger\mathbf{y}$。$\mathrm{X}\mathbf{w}$ 的第 $n$ 個分量是 $\mathbf{x}_n^\top\mathbf{w}$，正好是第 $n$ 筆的預測。

其他選項是本文的分析。選項 1 等於說預測完全命中，只有殘差全是 0 時才對；四位顧客的例子裡 $\hat{\mathbf{y}} = (1.9, 3.3, 4.7, 6.1)$ 就不等於 $\mathbf{y}$。選項 2 把 $\mathrm{X}^\dagger$ 錯換成 $\mathrm{X}^\top$，少了 $(\mathrm{X}^\top\mathrm{X})^{-1}$；同一個例子算出來是 $(63, 110, 157, 204)$。選項 4 因為 $\mathrm{X}\mathrm{X}^\dagger\mathrm{X} = \mathrm{X}(\mathrm{X}^\dagger\mathrm{X}) = \mathrm{X}$，化簡後跟選項 2 是同一個式子。

課堂上講完答案後提醒：從 $\mathbf{y}$ 到 $\hat{\mathbf{y}}$ 只隔了一個矩陣 $\mathrm{X}\mathrm{X}^\dagger$，下一節的分析會一直用到它。

## 沒有一步步改進也算學習嗎：hat matrix 與學習曲線

```youtube
url: https://www.youtube.com/watch?v=lj2jK1FSwgo
title: Linear Regression :: Generalization Issue @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:50 討論這算不算學習，03:50–08:25 是平均 $E_{\text{in}}$ 與 hat matrix，08:25–12:45 是幾何圖像與 trace，12:45–16:52 是雜訊的論證與 $E_{\text{out}}$，16:52–19:12 是學習曲線，之後是 Fun Time。）

### 一步登天的演算法

課堂上先替學生問：這真的是機器學習嗎？演算法一下子就把答案算出來，有種一步登天的感覺，看不到學習的過程。第 13 頁把正反兩邊並排：

| 說不是（No!） | 說是（Yes!） |
|---|---|
| 解是 analytic（closed-form）的，瞬間算完 | $E_{\text{in}}$ 好嗎？好，而且是最佳的 |
| 沒有一輪一輪地改善 $E_{\text{in}}$ 或 $E_{\text{out}}$ | $E_{\text{out}}$ 好嗎？好，$d_{\text{VC}}$ 有限，跟感知器一樣 |
| | 有迭代改善嗎？算有，藏在 pseudo-inverse 的程式裡 |

右邊第二列的依據是[基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)：$d$ 維感知器的 $d_{\text{VC}}$ 是 $d + 1$，是有限的。課堂上說，模型只有 $d + 1$ 個變數，資料夠多的話，好的 $E_{\text{in}}$ 會延伸成好的 $E_{\text{out}}$。第三列講義說的是 pseudo-inverse 的程式內部是迭代的；課堂上舉的例子是求反矩陣的高斯消去法，它本身就是一個迴圈在跑，如果把中間的步驟攤開來看，$E_{\text{in}}$ 也是一步步變好的，只是整個程式包得太好，你沒看到。

講義的結論是：if $E_{\text{out}}(\mathbf{w}_{\text{LIN}})$ is good, learning 'happened'! 課堂上用考試來比喻：不管它是躲在棉被裡偷偷學，還是一步一步讀給你看，最後考試（$E_{\text{out}}$）考得好，就表示中間發生了學習。

### 另一種保證：看平均的 E_in

VC bound 可以保證 $E_{\text{out}}$，這一節要給另一種保證，講義的標題是 'Simpler-than-VC' Guarantee。它用得上，是因為線性迴歸有解析解，式子寫得出來。分析的對象是 $E_{\text{in}}$ 的平均（第 14 頁）：

$$
\overline{E_{\text{in}}} = \mathop{\mathcal{E}}_{\mathcal{D}\sim P^N}\Big\{E_{\text{in}}(\mathbf{w}_{\text{LIN}} \text{ w.r.t. } \mathcal{D})\Big\} \ \overset{\text{to be shown}}{=}\ \text{noise level}\cdot\Big(1 - \frac{d+1}{N}\Big)
$$

平均是對資料取的。課堂上沿用先前的比喻：從罐子裡抓一把資料算一次 $E_{\text{in}}$，再抓一把再算一次，把所有可能抓到的資料都平均起來。課堂上也點出它跟 VC 的差別：VC 看的是個別的 $E_{\text{in}}$，這裡看平均。noise level 是資料裡雜訊的強度，也就是上一堂說的、再好的目標函數也做不到的那一部分。

先把單一一份資料的 $E_{\text{in}}$ 寫出來。用上一題 Fun Time 的 $\hat{\mathbf{y}} = \mathrm{X}\mathrm{X}^\dagger\mathbf{y}$：

$$
E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{1}{N}\lVert\mathbf{y} - \hat{\mathbf{y}}\rVert^2 = \frac{1}{N}\lVert\mathbf{y} - \mathrm{X}\mathrm{X}^\dagger\mathbf{y}\rVert^2 = \frac{1}{N}\lVert(\mathrm{I} - \mathrm{X}\mathrm{X}^\dagger)\mathbf{y}\rVert^2
$$

最後一步把 $\mathbf{y}$ 寫成 $\mathrm{I}\mathbf{y}$ 再提出來。講義把 $\mathrm{X}\mathrm{X}^\dagger$ 叫作 hat matrix，記成 $\mathrm{H}$，理由寫在投影片上：because it puts ∧ on $\mathbf{y}$。課堂上說這是統計學界取的名字，$\mathbf{y}$ 乘上它之後頭上就長出一頂帽子，變成 $\hat{\mathbf{y}}$，很好記。

### hat matrix 在做投影

第 15 頁在 $\mathbb{R}^N$ 裡畫了一張圖。注意這個空間有 $N$ 維：$\mathbf{y} = (y_1, \dots, y_N)$ 是裡面的一個向量，一筆資料佔一個座標軸，跟前面以特徵為軸的圖是兩回事。圖上有四樣東西：

- **粉紅色的區域**：$\mathrm{X}$ 的 $d + 1$ 個直行張成的空間（span of $\mathrm{X}$）。每個直行也是 $N$ 維的向量。
- **紫色的 $\mathbf{y}$**：從原點出發，斜斜地指向粉紅色區域的外面。
- **黑色的 $\hat{\mathbf{y}}$**：躺在粉紅色區域裡。
- **綠色的虛線 $\mathbf{y} - \hat{\mathbf{y}}$**：從 $\hat{\mathbf{y}}$ 的箭頭垂直往上，接到 $\mathbf{y}$ 的箭頭。

講義列了四句話，逐句看：

1. **$\hat{\mathbf{y}} = \mathrm{X}\mathbf{w}_{\text{LIN}}$ 在 span 裡。** 課堂上的解釋是：$\mathrm{X}$ 乘上任何 $\mathbf{w}$，都是拿 $\mathbf{w}$ 的分量當係數，把 $\mathrm{X}$ 的各個直行做線性組合，結果一定落在 span 裡。不同的 $\mathbf{w}$ 對應 span 裡不同的點。
2. **$\mathbf{y} - \hat{\mathbf{y}}$ 要最短，所以它垂直於 span。** 線性迴歸要的是 $\lVert\mathbf{y} - \hat{\mathbf{y}}\rVert$ 最小，也就是在 span 裡找離 $\mathbf{y}$ 最近的點。最近的點是垂直投影下去的那一點。
3. **$\mathrm{H}$ 把 $\mathbf{y}$ 投影成 span 裡的 $\hat{\mathbf{y}}$。**
4. **$\mathrm{I} - \mathrm{H}$ 把 $\mathbf{y}$ 變成垂直於 span 的 $\mathbf{y} - \hat{\mathbf{y}}$。** 課堂上說這是在取「餘數」。

本文補充第 2 句的代數版本。垂直於 span，就是跟 $\mathrm{X}$ 的每個直行內積都是 0，寫成矩陣是 $\mathrm{X}^\top(\mathbf{y} - \hat{\mathbf{y}}) = \mathbf{0}$。展開：$\mathrm{X}^\top\mathbf{y} - \mathrm{X}^\top\mathrm{X}\mathbf{w}_{\text{LIN}} = \mathbf{0}$，這正是演算法那一節令梯度為零得到的方程式。「梯度為零」和「殘差垂直於 span」是同一個條件的兩種說法。四位顧客的例子可以直接檢查：殘差是 $(0.1, -0.3, 0.3, -0.1)$，跟第一個直行 $(1, 1, 1, 1)$ 的內積是 $0.1 - 0.3 + 0.3 - 0.1 = 0$，跟第二個直行 $(1, 2, 3, 4)$ 的內積是 $0.1 - 0.6 + 0.9 - 0.4 = 0$。

### trace(I − H) 為什麼是 N − (d + 1)

第 15 頁最後留了一句：claim: $\text{trace}(\mathrm{I} - \mathrm{H}) = N - (d + 1)$. Why? :-) trace 是矩陣對角線上所有元素的和。課堂上沒有證明，只講物理意義，並請大家私下把證明寫出來：$\mathbf{y}$ 原本在 $N$ 維的空間裡有 $N$ 個自由度；投影到的 span 最多 $d + 1$ 維；取餘數之後剩下的自由度最多就是 $N - (d + 1)$。

以下是本文補上的證明，只處理 $\mathrm{X}^\top\mathrm{X}$ 可逆的情形。用到一個性質：兩個矩陣相乘的 trace 可以調換順序，$\text{trace}(\mathrm{P}\mathrm{Q}) = \text{trace}(\mathrm{Q}\mathrm{P})$，因為兩邊都等於 $\sum_i\sum_j P_{ij}Q_{ji}$。取 $\mathrm{P} = \mathrm{X}$、$\mathrm{Q} = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top$：

$$
\text{trace}(\mathrm{H}) = \text{trace}\big(\mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\big) = \text{trace}\big((\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathrm{X}\big) = \text{trace}(\mathrm{I}_{d+1}) = d + 1
$$

調換之後，$N \times N$ 的大矩陣變成 $(d+1) \times (d+1)$ 的單位矩陣，對角線上有 $d + 1$ 個 1。於是

$$
\text{trace}(\mathrm{I} - \mathrm{H}) = \text{trace}(\mathrm{I}_N) - \text{trace}(\mathrm{H}) = N - (d + 1)
$$

四位顧客的例子裡，hat matrix 是

$$
\mathrm{H} = \mathrm{X}\mathrm{X}^\dagger = \begin{bmatrix} 0.7 & 0.4 & 0.1 & -0.2 \\ 0.4 & 0.3 & 0.2 & 0.1 \\ 0.1 & 0.2 & 0.3 & 0.4 \\ -0.2 & 0.1 & 0.4 & 0.7 \end{bmatrix}
$$

對角線的和是 $0.7 + 0.3 + 0.3 + 0.7 = 2 = d + 1$，$\text{trace}(\mathrm{I} - \mathrm{H}) = 4 - 2 = 2$。把第一列乘上 $\mathbf{y} = (2, 3, 5, 6)$：$1.4 + 1.2 + 0.5 - 1.2 = 1.9$，就是 $\hat{y}_1$。

### 雜訊被 I − H 轉成殘差

第 16 頁的標題是 An Illustrative 'Proof'，引號是講義自己加的。課堂上也說不給完整的證明，只講裡面的大概念。圖上比前一頁多了兩樣東西：span 裡多一個紅色標籤 $f(\mathrm{X})$，以及一段從 $f(\mathrm{X})$ 連到 $\mathbf{y}$ 的黑色虛線，標著 noise。

**假設。** $\mathbf{y}$ 來自某個理想的 $f(\mathrm{X})$ 加上雜訊，而且 $f(\mathrm{X})$ 落在 span 裡：

$$
\mathbf{y} = f(\mathrm{X}) + \textbf{noise}, \qquad f(\mathrm{X}) \in \text{span}
$$

$f(\mathrm{X}) \in \text{span}$ 的意思是存在某個 $\mathbf{w}_f$ 使 $f(\mathrm{X}) = \mathrm{X}\mathbf{w}_f$，也就是理想的目標本身是線性的。

**第一步：$\mathrm{I} - \mathrm{H}$ 把 $f(\mathrm{X})$ 消掉。** 已經在 span 裡的向量，投影之後還是自己：$\mathrm{H}\mathrm{X}\mathbf{w}_f = \mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathrm{X}\mathbf{w}_f = \mathrm{X}\mathbf{w}_f$。所以 $(\mathrm{I} - \mathrm{H})f(\mathrm{X}) = \mathbf{0}$，

$$
\mathbf{y} - \hat{\mathbf{y}} = (\mathrm{I} - \mathrm{H})\mathbf{y} = (\mathrm{I} - \mathrm{H})f(\mathrm{X}) + (\mathrm{I} - \mathrm{H})\,\textbf{noise} = (\mathrm{I} - \mathrm{H})\,\textbf{noise}
$$

課堂上從圖上講同一件事：對 noise 那段黑色虛線做取餘數的轉換，得到的也是綠色那條虛線。

**第二步：算長度平方的平均。** 講義直接寫出結果：

$$
E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{1}{N}\lVert\mathbf{y} - \hat{\mathbf{y}}\rVert^2 = \frac{1}{N}\lVert(\mathrm{I} - \mathrm{H})\,\textbf{noise}\rVert^2 = \frac{1}{N}\big(N - (d+1)\big)\sigma^2
$$

講義對雜訊只寫了「per-dimension 'noise level' $\sigma^2$」，最後一個等號其實是對雜訊取平均之後才成立，課堂上有明講這是「對各種亂亂的 noise 做平均的結果」。以下是本文補的計算，需要的假設是：雜訊的 $N$ 個分量 $\epsilon_1, \dots, \epsilon_N$ 彼此獨立，平均都是 0，變異數都是 $\sigma^2$。

把 $\mathrm{I} - \mathrm{H}$ 記成 $\mathrm{M}$。$\mathrm{H}$ 是對稱的，而且 $\mathrm{H}^2 = \mathrm{H}$（這一節的 Fun Time 會驗證），所以 $\mathrm{M}$ 也對稱，$\mathrm{M}^\top\mathrm{M} = \mathrm{M}^2 = \mathrm{I} - 2\mathrm{H} + \mathrm{H}^2 = \mathrm{M}$。於是

$$
\lVert\mathrm{M}\boldsymbol{\epsilon}\rVert^2 = \boldsymbol{\epsilon}^\top\mathrm{M}^\top\mathrm{M}\boldsymbol{\epsilon} = \boldsymbol{\epsilon}^\top\mathrm{M}\boldsymbol{\epsilon} = \sum_{i}\sum_{j} M_{ij}\,\epsilon_i\epsilon_j
$$

取期望值。$i \ne j$ 時，獨立加上平均為 0 讓 $\mathcal{E}[\epsilon_i\epsilon_j] = 0$；$i = j$ 時 $\mathcal{E}[\epsilon_i^2] = \sigma^2$。只剩對角線：

$$
\mathcal{E}\,\lVert\mathrm{M}\boldsymbol{\epsilon}\rVert^2 = \sigma^2\sum_{i} M_{ii} = \sigma^2\,\text{trace}(\mathrm{I} - \mathrm{H}) = \sigma^2\big(N - (d+1)\big)
$$

除以 $N$：

$$
\overline{E_{\text{in}}} = \sigma^2\cdot\Big(1 - \frac{d+1}{N}\Big)
$$

課堂上把 trace 說成 $\mathrm{I} - \mathrm{H}$ 的「能量」：雜訊原本在 $N$ 個方向上各有 $\sigma^2$，經過 $\mathrm{I} - \mathrm{H}$ 之後只留下 $N - (d+1)$ 份。

**$E_{\text{out}}$ 的式子。** 同一頁列出

$$
\overline{E_{\text{out}}} = \sigma^2\cdot\Big(1 + \frac{d+1}{N}\Big)
$$

講義在後面標了 complicated!，沒有推導；課堂上說認真去算的話可以類似地算出來，只是比較複雜。課堂上給的是直覺：$E_{\text{in}}$ 是在看得到的資料上算的，那條線會往這批資料的雜訊偏過去一點，讓 $E_{\text{in}}$ 好看一點，這就是減掉 $\frac{d+1}{N}$ 的來源；$E_{\text{out}}$ 看的是新的資料，線已經往這邊偏了，新資料的雜訊卻可能在另一邊，一來一往，所以是加。

本文補一個可以完整算出來的簡化版本，它對應課堂上講 $E_{\text{out}}$ 時說的「有點像另外的 $N$ 個點」。假設測試資料用同一批 $\mathbf{x}_n$，只是重新抽一次雜訊 $\boldsymbol{\epsilon}'$，跟訓練時的 $\boldsymbol{\epsilon}$ 獨立。新的標籤是 $\mathbf{y}' = f(\mathrm{X}) + \boldsymbol{\epsilon}'$，預測仍是 $\hat{\mathbf{y}} = \mathrm{H}\mathbf{y} = f(\mathrm{X}) + \mathrm{H}\boldsymbol{\epsilon}$，兩者的差是 $\boldsymbol{\epsilon}' - \mathrm{H}\boldsymbol{\epsilon}$：

$$
\mathcal{E}\,\lVert\boldsymbol{\epsilon}' - \mathrm{H}\boldsymbol{\epsilon}\rVert^2 = \mathcal{E}\,\lVert\boldsymbol{\epsilon}'\rVert^2 + \mathcal{E}\,\lVert\mathrm{H}\boldsymbol{\epsilon}\rVert^2 = N\sigma^2 + \sigma^2\,\text{trace}(\mathrm{H}) = \sigma^2\big(N + (d+1)\big)
$$

交叉項因為兩批雜訊獨立而且平均為 0，期望值是 0；$\mathcal{E}\lVert\mathrm{H}\boldsymbol{\epsilon}\rVert^2$ 的算法跟上面 $\mathrm{M}$ 的那一段一樣。除以 $N$ 就是 $\sigma^2(1 + \frac{d+1}{N})$。式子裡的兩項各有來源：$N\sigma^2$ 是新資料自己的雜訊，$(d+1)\sigma^2$ 是 $\mathbf{w}_{\text{LIN}}$ 被舊雜訊帶偏的代價。

本文用 NumPy 模擬檢查這三條式子（$d = 2$、$\sigma^2 = 1$，特徵從標準常態分布抽，目標是隨機抽的線性函數，每個 $N$ 重複 4 萬次以上）：

| $N$ | 平均 $E_{\text{in}}$：模擬／公式 | 同一批 $\mathbf{x}$、新雜訊：模擬／公式 | $\mathbf{x}$ 也重抽的平均 $E_{\text{out}}$：模擬 |
|---|---|---|---|
| 10 | 0.703／0.700 | 1.301／1.300 | 約 1.47 |
| 20 | 0.849／0.850 | 1.147／1.150 | 約 1.18 |
| 50 | 0.940／0.940 | 1.061／1.060 | 約 1.06 |
| 100 | 0.971／0.970 | 1.031／1.030 | 約 1.03 |

前兩欄跟公式吻合。最後一欄才是講義定義的 $E_{\text{out}}$（新的 $\mathbf{x}$ 也從分布裡重新抽）：$N$ 很小時它比 $\sigma^2(1 + \frac{d+1}{N})$ 高，$N = 10$ 時是 1.47 對 1.30，$N$ 到 50 以上就幾乎重合。所以上面那個簡化版本只能說明「加上 $\frac{d+1}{N}$」這一項從哪裡來，不能當成一般情形的證明。這一欄是本文在這個特定設定（常態分布的特徵）下的模擬結果，不是講義的內容；一般情形的推導講義沒有給。

### 學習曲線

第 17 頁把兩條式子畫成圖，橫軸是資料量 $N$，縱軸是 Expected Error：

- 中間一條水平線，高度是 $\sigma^2$。
- 紅色的 $\overline{E_{\text{out}}}$ 從很高的地方往下降，貼近水平線。
- 藍色的 $\overline{E_{\text{in}}}$ 從橫軸上標著 $d + 1$ 的位置出發（那裡的值是 $\sigma^2 \cdot 0 = 0$），往上升，貼近水平線。

這張圖叫學習曲線（learning curve）。講義寫了兩點。第一，$N \to \infty$ 時兩者都收斂到 $\sigma^2$。第二，expected generalization error 是 $\frac{2(d+1)}{N}$，跟 VC 的 worst-case 保證相似。課堂上補充兩者的差別與相似處：VC 講的是最壞的情形，這裡講的是平均；相似的地方是兩邊都跟 $d + 1$ 這個自由度有關，而且都隨 $N$ 變大而縮小。

一個要留意的細節：照前一頁的兩條式子相減，差距是

$$
\overline{E_{\text{out}}} - \overline{E_{\text{in}}} = \sigma^2\cdot\frac{2(d+1)}{N}
$$

講義這一頁的兩條式子前面都乘著 noise level，但底下那一行寫的是「expected generalization error: $\frac{2(d+1)}{N}$」，第 23 頁的總結寫的是「$E_{\text{out}} - E_{\text{in}} \approx \frac{2(d+1)}{N}$ on average」，課堂上口頭說的也是「大概是兩倍的 $\frac{d+1}{N}$」，三處都沒有乘上 noise level。照式子相減，前面應該還有 $\sigma^2$ 這個倍數；只有 $\sigma^2 = 1$ 時兩種寫法的數值才相同。代數字時請用帶 $\sigma^2$ 的版本，自我檢查第 2 題就是這樣算的。

講義的結論是：linear regression (LinReg): learning 'happened'! 課堂上的說法是，$N$ 夠大時，我們已經做得跟雜訊的強度差不多好，雜訊不太多的話，學習就真的發生了。課堂上也表明態度：細節的數學沒那麼重要，希望大家記得的是幾何與物理上的意義，只有 $N$ 個點，線就會往這 $N$ 個點偏一點。

**套到一個情境算算看（本文自擬）。** 假設有 12 個特徵，$d + 1 = 13$，這是下面練習會用到的 cpusmall 資料集的維度：

| $N$ | $\overline{E_{\text{in}}}/\sigma^2$ | $\overline{E_{\text{out}}}/\sigma^2$ | 差距 $/\sigma^2$ |
|---|---|---|---|
| 13 | 0 | 2 | 2 |
| 32 | 0.594 | 1.406 | 0.813 |
| 100 | 0.87 | 1.13 | 0.26 |
| 2,000 | 0.9935 | 1.0065 | 0.013 |

$N = 32$ 時，訓練資料上看到的誤差只有雜訊強度的六成，新資料上卻是 1.4 倍，只看 $E_{\text{in}}$ 會嚴重高估模型。$N = 13$ 時 $E_{\text{in}}$ 是 0：13 個未知數配 13 筆資料，每一筆都能完全命中，但平均 $E_{\text{out}}$ 是雜訊強度的兩倍。要讓差距小於雜訊強度的 5%，需要 $\frac{26}{N} \le 0.05$，也就是 $N \ge 520$。這些數字的前提是目標真的是線性加雜訊，真實資料不會剛好符合，拿來對照曲線的形狀比較恰當。

### Fun Time：hat matrix 的性質

**題目（第 18 頁）：** 下面關於 $\mathrm{H}$ 的性質，哪一個不成立？

1. $\mathrm{H}$ 是對稱的
2. $\mathrm{H}^2 = \mathrm{H}$（投影兩次等於投影一次）
3. $(\mathrm{I} - \mathrm{H})^2 = \mathrm{I} - \mathrm{H}$（取兩次餘數等於取一次）
4. 以上皆非（三個都成立）

**答案：4。** 講義的解答只說第 2 與第 3 個可以從物理意義看出來。課堂上的說法：投影一次之後已經在那個空間裡，再投影一次不會動；取過一次餘數的向量已經垂直於那個空間，再取一次還是同一個向量。對稱則是從式子大概就看得出來。課堂上也說不要求大家證明。

本文在 $\mathrm{X}^\top\mathrm{X}$ 可逆的情形把三條各驗一次：

- 對稱：$\mathrm{H}^\top = \big(\mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\big)^\top = \mathrm{X}\big((\mathrm{X}^\top\mathrm{X})^{-1}\big)^\top\mathrm{X}^\top = \mathrm{H}$，因為對稱矩陣的反矩陣也對稱。
- $\mathrm{H}^2 = \mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\underbrace{\mathrm{X}^\top\mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}}_{\mathrm{I}}\mathrm{X}^\top = \mathrm{H}$。
- $(\mathrm{I} - \mathrm{H})^2 = \mathrm{I} - 2\mathrm{H} + \mathrm{H}^2 = \mathrm{I} - 2\mathrm{H} + \mathrm{H} = \mathrm{I} - \mathrm{H}$。

四位顧客的 $\mathrm{H}$ 一眼就看得出對稱。$\mathrm{H}^2$ 的左上角是第一列跟自己的內積：$0.49 + 0.16 + 0.01 + 0.04 = 0.7$，等於 $\mathrm{H}$ 的左上角。整個矩陣用 NumPy 檢查，三條都成立。

## 迴歸的解拿去做分類，憑什麼

```youtube
url: https://www.youtube.com/watch?v=tF1HTirYbtc
title: Linear Regression :: for Binary Classification @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:51 比較兩種問題並提出做法，02:51–05:30 比較兩種誤差，05:30–09:03 接上 VC bound 與用途，09:03–10:00 是 Fun Time，之後是整堂的總結。）

### 一個看起來可行的偷懶做法

第 19 頁把兩種線性模型並排：

| | 線性分類 | 線性迴歸 |
|---|---|---|
| 輸出空間 | $\mathcal{Y} = \{-1, +1\}$ | $\mathcal{Y} = \mathbb{R}$ |
| 假說 | $h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x})$ | $h(\mathbf{x}) = \mathbf{w}^\top\mathbf{x}$ |
| 誤差 | $\text{err}(\hat{y}, y) = \llbracket\hat{y} \ne y\rrbracket$ | $\text{err}(\hat{y}, y) = (\hat{y} - y)^2$ |
| 求解 | 一般情形是 NP-hard | 有效率的解析解 |

講義接著指出 $\{-1, +1\} \subset \mathbb{R}$。課堂上的講法是，$+1$ 和 $-1$ 也只是茫茫實數裡的兩個特殊的值。那就產生一個想法：

1. 把二元分類的資料 $\mathcal{D}$ 直接丟給線性迴歸，$y_n$ 就當成實數的 $\pm 1$。
2. 回傳 $g(\mathbf{x}) = \text{sign}(\mathbf{w}_{\text{LIN}}^\top\mathbf{x})$。

課堂上說明直覺：迴歸解出來的 $\mathbf{w}$，在標籤是 $+1$ 的地方大概會給出大於 0 的值，在 $-1$ 的地方給出小於 0 的值；而且不用像 PLA 或 pocket 那樣跑很久、震盪來震盪去，在 MATLAB 這類軟體裡兩三行就寫完。講義稱這是一個 heuristic，並問：它的解釋在哪裡？課堂上說，聽起來有道理，但還不算數學上的道理。

### 兩種誤差的關係

兩個模型都先算分數 $\mathbf{w}^\top\mathbf{x}$，差別只在之後怎麼算誤差。第 20 頁把兩種誤差都寫成分數的函數：

$$
\text{err}_{0/1} = \llbracket\text{sign}(\mathbf{w}^\top\mathbf{x}) \ne y\rrbracket, \qquad \text{err}_{\text{sqr}} = (\mathbf{w}^\top\mathbf{x} - y)^2
$$

然後畫兩張圖，橫軸是 $\mathbf{w}^\top\mathbf{x}$，縱軸是誤差，藍線是 0/1 誤差，紅線是平方誤差：

| | 想要的 $y = +1$ | 想要的 $y = -1$ |
|---|---|---|
| 藍線（0/1） | 分數小於 0 時是 1，大於 0 時是 0，一個階梯 | 分數大於 0 時是 1，小於 0 時是 0 |
| 紅線（平方） | 拋物線，最低點在分數 $= 1$，值是 0 | 拋物線，最低點在分數 $= -1$ |
| 兩線的關係 | 紅線壓在藍線上面 | 紅線壓在藍線上面 |

結論寫在頁尾：

$$
\text{err}_{0/1} \le \text{err}_{\text{sqr}}
$$

課堂上稱這是圖形化的證明。本文補上代數的版本。令 $s = \mathbf{w}^\top\mathbf{x}$。因為 $y \in \{-1, +1\}$，$y^2 = 1$，所以

$$
(s - y)^2 = y^2(s - y)^2 = (ys - y^2)^2 = (ys - 1)^2
$$

兩種情形分開看。分類正確時，$\text{err}_{0/1} = 0$，平方不可能是負的，不等式成立。分類錯誤時，$s$ 和 $y$ 不同號，$ys \le 0$，所以 $ys - 1 \le -1$，$(ys - 1)^2 \ge 1 = \text{err}_{0/1}$。

把 $y = +1$ 的幾個分數代進去看：

| 分數 $s$ | $-2$ | $-0.5$ | $0.5$ | $1$ | $3$ |
|---|---|---|---|---|---|
| $\text{err}_{0/1}$ | 1 | 1 | 0 | 0 | 0 |
| $\text{err}_{\text{sqr}}$ | 9 | 2.25 | 0.25 | 0 | 4 |

最右邊那一欄是拋物線的右半邊：分數 3 分類完全正確，平方誤差卻有 4。平方誤差只認「離 1 多遠」，不管是哪一邊。

### 接上 VC bound

第 21 頁把不等式放進 VC bound。對同一個 $\mathbf{w}$：

$$
\begin{aligned}
\text{classification } E_{\text{out}}(\mathbf{w}) \ &\overset{\text{VC}}{\le}\ \text{classification } E_{\text{in}}(\mathbf{w}) + \sqrt{\cdots\cdots} \\
&\le\ \text{regression } E_{\text{in}}(\mathbf{w}) + \sqrt{\cdots\cdots}
\end{aligned}
$$

第一行是 VC bound，根號裡是含 $d_{\text{VC}}$ 的那一項。第二行用的是：每一筆資料的 0/1 誤差都不超過平方誤差，平均之後還是不超過。課堂上的結論是：分類的 $E_{\text{out}}$ 被迴歸的 $E_{\text{in}}$ 加上同一個複雜度項壓住，所以用力把迴歸的 $E_{\text{in}}$ 做小，也是把分類的 $E_{\text{out}}$ 做好的一種方法。

講義用上一堂的語言再說一次：把 $\text{err}_{\text{sqr}}$ 當成 $\widehat{\text{err}}$，用一個（寬鬆的）上界去近似 $\text{err}_{0/1}$。[基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)說演算法實際拿來最佳化的 $\widehat{\text{err}}$ 可以挑好解的，這裡就是一個例子。代價寫成一句：trade bound tightness for efficiency，用上界的鬆緊換取效率。

講義的建議有兩個用法：$\mathbf{w}_{\text{LIN}}$ 是有用的 baseline 分類器；或者拿它當 PLA／pocket 的初始向量。課堂上說，實際去做的話，很多時候它的表現還不算太差；如果嫌這個上界太鬆，可以把它當 $\mathbf{w}_0$，從一個不錯的起點再讓 PLA 或 pocket 慢慢修正，需要的修正次數可能比較少。

### 數值例子：迴歸分類器什麼時候會錯

以下是本文自擬的例子，不在講義上。沿用四位顧客的 $\mathrm{X}$，把輸出換成核卡與否：年收入 1、2 的標 $-1$，3、4 的標 $+1$，$\mathbf{y} = (-1, -1, +1, +1)$。$\mathrm{X}^\dagger$ 前面已經算過：

$$
\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y} = \frac{1}{20}\begin{bmatrix} -20 - 10 + 0 - 10 \\ 6 + 2 + 2 + 6 \end{bmatrix} = \begin{bmatrix} -2 \\ 0.8 \end{bmatrix}
$$

四筆的分數是 $-1.2$、$-0.4$、$0.4$、$1.2$，正負號全對，分類的 $E_{\text{in}}$ 是 0。平方誤差是 $0.04$、$0.36$、$0.36$、$0.04$，迴歸的 $E_{\text{in}}$ 是 $0.2$。$0 \le 0.2$，上界成立；分界點在 $-2 + 0.8x = 0$，也就是 $x = 2.5$，剛好在兩群中間。

現在加入第五位顧客：年收入 12、標 $+1$。資料還是線性可分的，分界點放在 2 和 3 之間就全對。重新算：

$$
\mathrm{A} = \begin{bmatrix} 5 & 22 \\ 22 & 174 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 1 \\ 16 \end{bmatrix}, \quad \det\mathrm{A} = 386, \quad \mathbf{w}_{\text{LIN}} = \frac{1}{386}\begin{bmatrix} 174 - 352 \\ -22 + 80 \end{bmatrix} = \begin{bmatrix} -89/193 \\ 29/193 \end{bmatrix} \approx \begin{bmatrix} -0.461 \\ 0.150 \end{bmatrix}
$$

| 年收入 $x$ | $y$ | 分數 $\mathbf{w}_{\text{LIN}}^\top\mathbf{x}$ | $\text{err}_{0/1}$ | $\text{err}_{\text{sqr}}$ |
|---|---|---|---|---|
| 1 | $-1$ | $-0.311$ | 0 | 0.475 |
| 2 | $-1$ | $-0.161$ | 0 | 0.705 |
| 3 | $+1$ | $-0.010$ | 1 | 1.021 |
| 4 | $+1$ | $0.140$ | 0 | 0.740 |
| 12 | $+1$ | $1.342$ | 0 | 0.117 |

分類的 $E_{\text{in}}$ 是 $\frac{1}{5} = 0.2$，迴歸的 $E_{\text{in}}$ 是 $\frac{118}{193} \approx 0.611$。上界仍然成立，但迴歸分類器把年收入 3 的那位判錯了，而這份資料明明存在全對的直線。

**這個結果代表什麼。** 原因就是拋物線的右半邊。第五位顧客離分界很遠，如果直線的斜率維持 0.8，他的分數會是 7.6，平方誤差 $(7.6 - 1)^2 \approx 43.6$。迴歸為了壓低這一筆，把直線壓平，分界點從 2.5 移到約 3.07，年收入 3 的顧客就落到錯的一邊。這就是講義說的 loose：把上界做小，不保證把真正在意的 0/1 誤差做到最小。

講義建議的第二個用法在這裡看得到效果。用[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 PLA 在這五筆資料上跑（本文的做法：每次都從第一筆往下找第一個分錯的點，用 $\mathbf{w} \leftarrow \mathbf{w} + y_n\mathbf{x}_n$ 修正，再回到第一筆重新找；分數剛好是 0 也算錯），結果是：從零向量出發要修正 23 次才全對，從 $\mathbf{w}_{\text{LIN}}$ 出發修正 6 次。次數跟找錯誤的順序有關，換一種走訪方式數字會不同；這只是一組資料上的觀察，不是保證。

### Fun Time：哪些函數是 0/1 誤差的上界

**題目（第 22 頁）：** 對 $y \in \{-1, +1\}$，下面哪些函數是逐點 0/1 誤差 $\llbracket\text{sign}(\mathbf{w}^\top\mathbf{x}) \ne y\rrbracket$ 的上界？

1. $\exp(-y\mathbf{w}^\top\mathbf{x})$
2. $\max(0,\ 1 - y\mathbf{w}^\top\mathbf{x})$
3. $\log_2\big(1 + \exp(-y\mathbf{w}^\top\mathbf{x})\big)$
4. 以上皆是

**答案：4。** 講義的解答是把曲線畫出來就看得到，並說三個函數都能用在二元分類，各自連到機器學習裡很重要的演算法，其中一個下一堂就會講。

本文補上不畫圖的驗證。令 $z = y\mathbf{w}^\top\mathbf{x}$，分類正確是 $z > 0$，錯誤是 $z \le 0$。三個函數都不會是負的，所以分類正確（0/1 誤差是 0）時一定成立；只要檢查 $z \le 0$ 時是不是至少 1：

- $\exp(-z)$：$z \le 0$ 時 $-z \ge 0$，$\exp(-z) \ge \exp(0) = 1$。
- $\max(0, 1 - z)$：$z \le 0$ 時 $1 - z \ge 1$。
- $\log_2(1 + \exp(-z))$：$z \le 0$ 時 $1 + \exp(-z) \ge 2$，$\log_2$ 之後至少是 1。

| $z$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| 0/1 誤差 | 1 | 1 | 1 | 0 | 0 |
| $\exp(-z)$ | 7.389 | 2.718 | 1 | 0.368 | 0.135 |
| $\max(0, 1 - z)$ | 3 | 2 | 1 | 0 | 0 |
| $\log_2(1 + \exp(-z))$ | 3.069 | 1.895 | 1 | 0.452 | 0.183 |

第三個函數的底數是 2 有它的作用：如果換成自然對數，$z = 0$ 時的值是 $\ln 2 \approx 0.693$，比 1 小，就不是上界了。講義預告的「下一堂會講的那一個」是第三個，[基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)的誤差函數就是 $\ln(1 + \exp(-y\mathbf{w}^\top\mathbf{x}))$。另外兩個對應到哪些演算法，這份講義沒有寫；課堂上只說，把這門課和接下來的那門課（機器學習技法）都上完，三種都會學到。以下是本文對照技法課講義的補充：$\max(0, 1 - z)$ 在[技法第 5 堂：Kernel 邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)的講義裡記成 $\widehat{\text{err}}_{\text{SVM}}$，稱為 hinge error measure，是軟邊界 SVM 改寫成無限制式的形式之後出現的誤差；$\exp(-z)$ 在[技法第 11 堂：梯度提升決策樹](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree)的講義裡記成 $\widehat{\text{err}}_{\text{ADA}}$，稱為 exponential error measure，那一堂說明 AdaBoost 可以看成在最小化這個誤差。兩份講義也都註明它們是 $\text{err}_{0/1}$ 的上界。

第 23 頁的總結把四節各收成一句：用超平面去逼近實數值；用 pseudo-inverse 得到解析解；平均來說 $E_{\text{out}} - E_{\text{in}} \approx \frac{2(d+1)}{N}$；0/1 誤差 ≤ 平方誤差。頁尾的預告是「binary classification, regression, and then?」課堂上說，下一堂還是用線性模型，但要解另一種問題。

## 自我檢查

**1. 假說不含常數項，$h(x) = wx$，只有一個參數。資料是 $(x, y) = (1, 1)$、$(2, 3)$、$(3, 7)$。求 $w_{\text{LIN}}$、三個預測值與 $E_{\text{in}}$。**

答案：$\mathrm{X}$ 只有一個直行 $(1, 2, 3)$，$\mathrm{X}^\top\mathrm{X} = 1 + 4 + 9 = 14$，$\mathrm{X}^\top\mathbf{y} = 1 + 6 + 21 = 28$，$w_{\text{LIN}} = \frac{28}{14} = 2$。預測是 $(2, 4, 6)$，殘差是 $(-1, -1, 1)$，$E_{\text{in}} = \frac{1 + 1 + 1}{3} = 1$。檢查：殘差和 $(1, 2, 3)$ 的內積是 $-1 - 2 + 3 = 0$，垂直。一般式是 $w_{\text{LIN}} = \frac{\sum x_n y_n}{\sum x_n^2}$。

**2. 某個迴歸問題有 4 個特徵（加上常數項共 5 個權重），雜訊強度 $\sigma^2 = 4$，資料 $N = 20$ 筆。照講義的兩條式子，平均 $E_{\text{in}}$、平均 $E_{\text{out}}$ 與兩者的差距各是多少？要讓差距減半，需要多少資料？**

答案：$\frac{d+1}{N} = \frac{5}{20} = 0.25$。平均 $E_{\text{in}} = 4 \times 0.75 = 3$，平均 $E_{\text{out}} = 4 \times 1.25 = 5$，差距 2。差距是 $\sigma^2 \cdot \frac{2(d+1)}{N} = \frac{40}{N}$，要變成 1 需要 $N = 40$。

**3. $N = d + 1$ 而且 $\mathrm{X}$ 是可逆的方陣時，$\mathrm{H}$ 是什麼？$E_{\text{in}}$ 是多少？這跟講義的公式一致嗎？這時候可以說學得很好嗎？**

答案：$\mathrm{X}$ 可逆時 $\mathrm{X}^\dagger = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top = \mathrm{X}^{-1}(\mathrm{X}^\top)^{-1}\mathrm{X}^\top = \mathrm{X}^{-1}$，所以 $\mathrm{H} = \mathrm{X}\mathrm{X}^{-1} = \mathrm{I}$，$\hat{\mathbf{y}} = \mathbf{y}$，$E_{\text{in}} = 0$。公式給 $\sigma^2(1 - 1) = 0$，一致；$\text{trace}(\mathrm{I} - \mathrm{H}) = 0$ 也對得上。不能說學得好：同一條公式給的平均 $E_{\text{out}}$ 是 $2\sigma^2$，$E_{\text{in}} = 0$ 只是因為未知數和資料一樣多，連雜訊都一起配進去了。

**4. 把 $\hat{\mathbf{y}}$ 當成新的標籤，對同一個 $\mathrm{X}$ 再跑一次線性迴歸。得到的權重和 $E_{\text{in}}$ 是什麼？這對應到 hat matrix 的哪個性質？**

答案：新的權重是 $\mathrm{X}^\dagger\hat{\mathbf{y}} = \mathrm{X}^\dagger\mathrm{X}\mathrm{X}^\dagger\mathbf{y} = \mathrm{X}^\dagger\mathbf{y} = \mathbf{w}_{\text{LIN}}$（用到 $\mathrm{X}^\dagger\mathrm{X} = \mathrm{I}$），跟原來一樣。新的預測是 $\mathrm{H}\hat{\mathbf{y}} = \mathrm{H}^2\mathbf{y} = \mathrm{H}\mathbf{y} = \hat{\mathbf{y}}$，跟新標籤完全相同，$E_{\text{in}} = 0$。對應的性質是 $\mathrm{H}^2 = \mathrm{H}$：$\hat{\mathbf{y}}$ 已經在 span 裡，再投影一次不會動。

**5. 用線性迴歸做二元分類。某筆資料 $y = +1$，三個不同的 $\mathbf{w}$ 分別給它分數 $0.9$、$3$、$-0.5$。各自的 0/1 誤差與平方誤差是多少？迴歸最想修正的是哪一個？這說明了什麼？**

判準：三組分別是 $(0, 0.01)$、$(0, 4)$、$(1, 2.25)$。平方誤差最大的是分數 3，一個分類完全正確的情形。答案要說出：平方誤差罰的是「離 $+1$ 多遠」，分數太大也罰；所以最小化迴歸的 $E_{\text{in}}$ 可能為了拉回離得很遠的正確點，而犧牲邊界附近的點。這就是上界寬鬆的地方，也是五位顧客的例子裡發生的事。

## 練習與對應閱讀

**課程版本的對應。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)這堂的投影片是 [09u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf)，它只有三個小節，拿掉了 MOOC 版的 Linear Regression for Binary Classification；Fall 2024 的第 11 堂（11u）則以 Linear Models for Binary Classification 開場。本文仍依 MOOC 版把四節講完。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把第 9、10 堂排在 W5（10/07）；在 2026-09-30 查的時候，這一週的 09u 投影片還沒公開。

**教科書。** 依 Fall 2024 課程頁，這堂對應 [Learning from Data](http://amlbook.com)（LFD）的 3.2 節。

**自學能做到哪裡。** 影片與講義都公開；Fall 2024 的作業 PDF 與 LIBSVM 資料集也公開，可以自己做題，但沒有官方解答，批改只限修課學生。

**作業。** [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)（2024-10-07 發布、10-21 截止）跟這堂相關的題目：

- **Q2**：沒有 $x_0$ 的一維線性迴歸 $h(x) = wx$，最佳的 $w_{\text{lin}}$ 是什麼。自我檢查第 1 題就是這個形式的數值版。
- **Q3**：對 $\mathrm{X}$ 做哪一種操作（縮放某一列、縮放某一行、整體乘 2、把幾行加到第一行）可能改變 hat matrix $\mathrm{H}$。提示：$\mathrm{H}$ 是往 span 的投影，先想每種操作會不會改變 span。
- **Q8**：把每筆資料的 $x_0$ 從 1 改成 1126 再跑一次線性迴歸，證明新舊解之間差一個對角矩陣 $\mathrm{D}$。
- **Q10–12（程式題）**：用 LIBSVM 網站的 [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) 資料集（8,192 筆，12 個特徵）。Q10 取 $N = 32$ 跑 1,126 次線性迴歸，畫 $(E_{\text{in}}, E_{\text{out}})$ 的散佈圖；Q11 對 $N = 25, 50, \dots, 2000$ 各平均 16 次，畫學習曲線；Q12 只用前 2 個特徵重做一次，跟 Q11 比較。

**怎麼做。** 程式題先自己寫 `np.linalg.pinv(X) @ y`，結果可以用 `np.linalg.lstsq` 或 scikit-learn 的 `LinearRegression` 交叉驗算。Q11 畫出來的學習曲線，拿來跟學習曲線那一段 $d + 1 = 13$ 的表對照形狀；Q12 的 $d + 1 = 3$，照公式差距會小很多，但 $E_{\text{in}}$ 與 $E_{\text{out}}$ 收斂到的那個水平線會不會變高，是值得看的地方。另外可以重做本文不可逆的實驗：隨機產生 $N = 100$、$d = 5$ 的資料，比較 `pinv` 與自己算 `inv(X.T @ X) @ X.T @ y` 的結果，再把某一行改成另一行的兩倍，看哪一個會出問題。整份作業的導讀在[基石作業](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**延伸閱讀。** [Stanford CS229 第 2 堂：監督式學習設定與線性迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression)用梯度下降與 normal equation 兩條路講同一個問題，可以跟這堂的寫法對照。

**下一堂。** [基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)把輸出換成機率，誤差函數換成最後一題 Fun Time 的第三個選項。它沒有解析解，梯度為零的方程式解不出來，得改用一步一步往下走的梯度下降。

## 課程影片來源

原始影片：[Linear Regression Problem](https://www.youtube.com/watch?v=qGzjYrLV-4Y)、[Linear Regression Algorithm](https://www.youtube.com/watch?v=2LfdSCdcg1g)、[Generalization Issue](https://www.youtube.com/watch?v=lj2jK1FSwgo)、[Linear Regression for Binary Classification](https://www.youtube.com/watch?v=tF1HTirYbtc)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：原本與第 10 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [基石第 9 堂講義 09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf)：本文的主要底本，四節的推導、圖與四題 Fun Time 都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [技法第 5 堂講義 205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf)、[技法第 11 堂講義 211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf)：最後一題 Fun Time 裡 hinge 誤差與指數誤差各自對應的演算法。
- [Fall 2024 版第 9 堂投影片（09u）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf)：版本差異，只有三個小節。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：LFD 章節對應與作業入口。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：這堂在 Fall 2026 的週次。
- [Fall 2024 Homework 3（hw3_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)：Q2、Q3、Q8、Q10–12 的題目內容。
- [LIBSVM Data: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale)：HW3 程式題的資料集，本文用它的特徵數當學習曲線的情境。
- [Learning from Data 教科書網站](http://amlbook.com)：3.2 節的出處。
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)：官方勘誤入口。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
