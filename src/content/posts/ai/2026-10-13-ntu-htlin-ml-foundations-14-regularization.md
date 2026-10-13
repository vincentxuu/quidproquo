---
title: "正則化：weight decay 怎麼限制模型｜台大林軒田 機器學習基石 第 14 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, regularization, learning-theory]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 14
tldr: "從 10 次多項式退回 2 次，等於在 10 次的問題上加限制式。把限制放軟成 ‖w‖² ≤ C 之後，最佳解上 E_in 的負梯度必須和 w 平行，由此得到 w_REG = (ZᵀZ + λI)⁻¹Zᵀy，也等於最小化 E_aug = E_in + (λ/N)wᵀw，這就是 weight decay。λ 愈大，等效的 C 愈小，有效 VC 維度 d_EFF 跟著變小；換成 L1 則會得到稀疏解。"
description: "台大林軒田機器學習基石第 14 堂 Regularization 導讀：正則化假說集合 H(C)、拉格朗日乘數的幾何推導、ridge regression 閉式解、augmented error 與 weight decay、Legendre 多項式、有效 VC 維度、L1 與 L2 正則化項，並用三筆資料把每一步手算一遍。"
draft: false
glossary:
  - term: "augmented error"
    aliases: ["E_aug", "增廣誤差"]
    definition: "E_aug(w) = E_in(w) + (λ/N)Ω(w)。最小化這個沒有限制式的目標，等效於在某個 C 的限制下最小化 E_in。"
    context: "基石第 14 堂把 weight decay 寫成最小化 augmented error。"
  - term: "weight decay"
    aliases: ["weight-decay regularization", "L2 正則化"]
    definition: "在 E_in 後面加上 (λ/N)wᵀw 的正則化做法。λ 愈大，愈偏好長度短的 w。"
    context: "基石第 14 堂的主角；搭配線性迴歸時在統計學裡叫 ridge regression。"
  - term: "有效 VC 維度"
    aliases: ["effective VC dimension", "d_EFF"]
    definition: "把假說集合 H 和演算法 A 的選擇方式一起算進去的模型複雜度，講義記成 d_EFF(H, A)。演算法有做正則化時，它比 d_VC(H) 小。"
    context: "基石第 14 堂用它解釋正則化為什麼有助於泛化。"
  - term: "正則化項"
    aliases: ["regularizer", "Ω(w)"]
    definition: "加在 E_in 後面、衡量單一假說 w 有多複雜的函數。常見的有 L2（Σw_q²）與 L1（Σ|w_q|）。"
    context: "基石第 14 堂最後一節談怎麼選它。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 14 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，這堂屬於第四個 How Can Machines Learn Better?。上一堂[基石第 13 堂：過擬合](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)在同一頁上只剩一行：模型能力過剩、有隨機或確定性雜訊、資料又有限的時候，過擬合就會發生。上一堂把對策比喻成開車，其中「踩煞車」那一項就是這堂的正則化（regularization）。課堂上提到這個詞一般有人翻成規則化或規律化，本文用正則化。

先備有四樣：[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的矩陣寫法與梯度、[基石第 12 堂：非線性轉換](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)的多項式轉換與一層包一層的假說集合、[基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)的 VC bound，以及向量的內積與垂直。拉格朗日乘數沒學過也可以，這堂用幾何把它講出來。

讀完之後，你應該能自己從限制式 $\mathbf{w}^\top\mathbf{w} \le C$ 推到閉式解 $\mathbf{w}_{\text{REG}} = (\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}$，對一組小資料手算不同 $\lambda$ 的解，並說明 $\lambda$、$C$ 與有效 VC 維度三者怎麼一起變動，以及 L1 為什麼會得到稀疏解。

整堂課的推導先看全貌：

1. **退回低次多項式**：等於在高次的問題上加限制式。
2. **限制放軟**：從「指定哪些係數是 0」放到「至多幾個不是 0」，再放到「係數的平方和不超過 $C$」。
3. **幾何條件**：最佳解上，$E_{\text{in}}$ 的負梯度和 $\mathbf{w}$ 平行，比例由 $\lambda$ 決定。
4. **給定 $\lambda$ 求解**：解一個線性方程式，得到閉式解。
5. **換成沒有限制式的問題**：最小化 augmented error。
6. **接回 VC 理論**：正則化讓有效 VC 維度變小。
7. **換別的正則化項**：L1、對稱性，以及 $\lambda$ 該取多大。

## 把「退回低次多項式」寫成限制式：正則化假說集合

```youtube
url: https://www.youtube.com/watch?v=Sno7I5slFUA
title: Regularization :: Regularized Hypothesis Set @ Machine Learning Foundations (機器學習基石)
```

（影片 00:17–03:53 複習上一堂並講正則化的想法，03:53–08:54 把退回去寫成限制式，08:54–14:18 是比較鬆的限制，14:18–18:37 是比較軟的限制，之後是 Fun Time。）

### 想做的事：從右圖走到左圖

講義第 2 頁放了兩張圖，橫軸是 $x$、縱軸是 $y$，圖上有五個資料點、一條藍色的目標函數、一條紅色的擬合結果。

| | 右圖（overfit） | 左圖（regularized fit） |
|---|---|---|
| 紅線與資料 | 穿過每一個點，$E_{\text{in}}$ 很低 | 沒有穿過每一個點 |
| 紅線的形狀 | 在點與點之間大幅上下擺動 | 平滑 |
| 紅線與藍線 | 離得很遠，$E_{\text{out}}$ 很大 | 幾乎疊在一起 |

右圖就是上一堂的過擬合。課堂上說那是用四次或更高次的多項式去擬合少量資料的結果，左圖則是比較低次的多項式做出來的。所以要做的事是從高次多項式的假說集合「走回」低次的。講義把這個想法寫成 step back from $\mathcal{H}_{10}$ to $\mathcal{H}_2$，旁邊畫的是基石第 12 堂那張一圈包一圈的圖：$\mathcal{H}_0 \subset \mathcal{H}_1 \subset \mathcal{H}_2 \subset \mathcal{H}_3 \subset \cdots$。

講義順帶交代名字的來源：regularization 出自函數逼近（function approximation）裡處理 ill-posed problem 的做法。課堂上的解釋是，ill-posed 指的是滿足條件的函數太多，不知道該選哪一個，所以要先把範圍限縮。迴歸也是這種問題：資料只有有限個點，穿過這些點的函數非常多。

### 退回去就是加限制式

講義第 3 頁用一維的輸入 $x \in \mathbb{R}$ 加上 $Q$ 次多項式轉換當例子：

$$
\boldsymbol{\Phi}_Q(x) = \big(1, x, x^2, \dots, x^Q\big)
$$

轉換之後做線性迴歸。照之前的記號，轉換後空間裡的權重該寫成 $\tilde{\mathbf{w}}$。講義在這一頁宣布把 $\tilde{\mathbf{w}}$ 直接寫成 $\mathbf{w}$，課堂上的理由是不想讓一堆「小蚯蚓」在式子裡飛來飛去。本文跟著講義，以下的 $\mathbf{w}$ 都是轉換後的權重，轉換後的資料記成 $\mathbf{z}_n = \boldsymbol{\Phi}(x_n)$。

兩個假說集合裡的假說長這樣：

$$
\begin{aligned}
\mathcal{H}_{10}:\quad & w_0 + w_1 x + w_2 x^2 + w_3 x^3 + \dots + w_{10} x^{10} \\
\mathcal{H}_{2}:\quad & w_0 + w_1 x + w_2 x^2
\end{aligned}
$$

把 $\mathcal{H}_{10}$ 的假說裡 $w_3$ 到 $w_{10}$ 都設成 0，剩下的就是 $\mathcal{H}_2$ 的假說。講義的寫法是：$\mathcal{H}_2 = \mathcal{H}_{10}$ AND「$w_3 = w_4 = \dots = w_{10} = 0$ 這個限制」。所以 step back = constraint。

第 4 頁把這句話翻成最佳化問題。兩邊的 $\mathbf{w}$ 都是 11 維的向量（講義寫 $\mathbb{R}^{10+1}$）：

$$
\text{regression with } \mathcal{H}_{10}:\quad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w})
$$

$$
\text{regression with } \mathcal{H}_{2}:\quad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w}) \quad \text{s.t.} \quad w_3 = w_4 = \dots = w_{10} = 0
$$

課堂上的講法是：左邊的問題收任何 11 維的向量，右邊的問題對不滿足條件的向量「連看都不看」，只在滿足條件的向量裡找最好的。

講義在頁尾替學生問了一句：why don't you just use $\mathbf{w} \in \mathbb{R}^{2+1}$? 要做二次多項式，直接用三個係數就好，何必繞一圈。課堂上的回答是，跨出這一步是為了拓展視野，把問題寫成「大的集合加限制式」之後，才能去調整那條限制式，後面的推導會比較容易。

### 鬆一點：只規定有幾個係數是 0

$\mathcal{H}_2$ 的限制指定了「哪八個」係數是 0。第 5 頁把它放鬆：只要求至少有八個是 0，是哪八個都可以。等於 0 的至少八個，不等於 0 的就至多三個：

$$
\mathcal{H}_2' \equiv \Big\{ \mathbf{w} \in \mathbb{R}^{10+1} \ \text{while} \ \ge 8 \text{ of } w_q = 0 \Big\}, \qquad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w}) \quad \text{s.t.} \quad \sum_{q=0}^{10} \llbracket w_q \ne 0 \rrbracket \le 3
$$

$\llbracket \cdot \rrbracket$ 在條件成立時是 1、不成立時是 0，所以加總算的是不為 0 的係數個數。講義列出它和另外兩個集合的關係：

- $\mathcal{H}_2 \subset \mathcal{H}_2'$：比 $\mathcal{H}_2$ 有彈性。任何滿足「$w_3$ 到 $w_{10}$ 都是 0」的 $\mathbf{w}$，也滿足「至少八個是 0」。
- $\mathcal{H}_2' \subset \mathcal{H}_{10}$：比 $\mathcal{H}_{10}$ 安全。課堂上說它沒有 $\mathcal{H}_{10}$ 那麼包山包海，也許比較不容易過擬合。

本文舉一個例子：$0.5 + 2x^5 - x^9$ 只有三個係數不是 0，它在 $\mathcal{H}_2'$ 裡，但不在 $\mathcal{H}_2$ 裡。

這種大部分係數是 0 的假說叫稀疏（sparse）的假說。課堂上提到它的好處：之後做預測只要算不是 0 的那三項再加起來，不必每一項都算。

壞消息寫在頁尾：在 $\mathcal{H}_2'$ 上最小化 $E_{\text{in}}$ 是 NP-hard。課堂上的直覺是，限制式裡的 $\llbracket \cdot \rrbracket$ 是離散的函數，[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)在感知器的 0/1 誤差上第一次遇到它，那時就知道這類函數不好最佳化。本文補充一個數字感受一下：光是「哪三個係數可以不為 0」，11 個裡挑 3 個就有 $\binom{11}{3} = 165$ 種挑法，維度一高，一種一種試就不可行。

### 軟一點：係數的平方和不超過 C

第 6 頁換一條好處理的限制式。原本數的是「不為 0 的係數有幾個」，現在改成量「係數有多大」，把每個係數的平方加起來，要求不超過一個事先定好的上限 $C$：

$$
\mathcal{H}(C) \equiv \Big\{ \mathbf{w} \in \mathbb{R}^{10+1} \ \text{while} \ \lVert\mathbf{w}\rVert^2 \le C \Big\}, \qquad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w}) \quad \text{s.t.} \quad \sum_{q=0}^{10} w_q^2 \le C
$$

課堂上的想法是：等於 0 或很接近 0 的係數，平方也很小；不是 0 的係數，平方就大。所以平方和可以當成「有幾個不是 0」的連續版本，而且避開了離散的函數。$C$ 可以是 13、15、11.7 這類數字。

講義對 $\mathcal{H}(C)$ 說了兩件事。

**第一，它和 $\mathcal{H}_2'$ 有重疊，但不相同。** 下面三個 11 維的 $\mathbf{w}$ 是本文自擬的例子，取 $C = 1$：

| $\mathbf{w}$ | 不為 0 的個數 | $\lVert\mathbf{w}\rVert^2$ | 在 $\mathcal{H}_2'$？ | 在 $\mathcal{H}(1)$？ |
|---|---|---|---|---|
| $(0.5, 0.5, 0, \dots, 0)$ | 2 | $0.5$ | 是 | 是 |
| $(3, 0, 0, \dots, 0)$ | 1 | $9$ | 是 | 否 |
| $(0.1, 0.1, \dots, 0.1)$ | 11 | $11 \times 0.01 = 0.11$ | 否 | 是 |

第三列就是課堂上說的情形：每個係數都很小、但都不是 0 的假說，在 $\mathcal{H}(C)$ 裡而不在 $\mathcal{H}_2'$ 裡。

**第二，它隨著 $C$ 形成一層包一層的結構。** 講義稱為 soft and smooth structure over $C \ge 0$：

$$
\mathcal{H}(0) \subset \mathcal{H}(1.126) \subset \dots \subset \mathcal{H}(1126) \subset \dots \subset \mathcal{H}(\infty) = \mathcal{H}_{10}
$$

$\mathcal{H}_0, \mathcal{H}_1, \mathcal{H}_2, \dots$ 只有 11 層可以選，而 $C$ 是實數，課堂上說這等於有無限多個假說集合依 $C$ 的大小排開。$C = \infty$ 等於沒有限制，就是原來的 $\mathcal{H}_{10}$；另一頭 $\mathcal{H}(0)$ 只剩 $\mathbf{w} = \mathbf{0}$ 一個假說。

講義把 $\mathcal{H}(C)$ 叫作正則化假說集合（regularized hypothesis set），在它裡面找到的最佳解記成 $\mathbf{w}_{\text{REG}}$。這一節的結論是：正則化假說集合就是原本的假說集合加上限制式。

### Fun Time：誰不在 H(1) 裡

**題目（第 7 頁）：** 設 $Q \ge 1$。下面哪一個假說（權重向量 $\mathbf{w} \in \mathbb{R}^{Q+1}$）不在正則化假說集合 $\mathcal{H}(1)$ 裡？

1. $\mathbf{w}^\top = [0, 0, \dots, 0]$
2. $\mathbf{w}^\top = [1, 0, \dots, 0]$
3. $\mathbf{w}^\top = [1, 1, \dots, 1]$
4. $\mathbf{w}^\top = \Big[\sqrt{\tfrac{1}{Q+1}}, \sqrt{\tfrac{1}{Q+1}}, \dots, \sqrt{\tfrac{1}{Q+1}}\Big]$

**答案：3。** 每個選項算一次 $\lVert\mathbf{w}\rVert^2$，和 1 比：

- 選項 1：$0 \le 1$，在裡面。
- 選項 2：$1^2 = 1 \le 1$，剛好在邊界上，也算在裡面。
- 選項 3：$Q + 1$ 個 1 的平方和是 $Q + 1$。因為 $Q \ge 1$，這個數至少是 2，超過 1，不在裡面。
- 選項 4：$Q + 1$ 個 $\frac{1}{Q+1}$ 加起來剛好是 1，在邊界上，也在裡面。

題目特別寫 $Q \ge 1$ 是有用的：$Q = 0$ 時選項 3 只有一個分量，平方和是 1，就在 $\mathcal{H}(1)$ 裡了。選項 2 和選項 4 長度一樣，一個把長度全放在一個係數上，一個平均分給所有係數。$\mathcal{H}(C)$ 不管長度怎麼分配，這也是它和 $\mathcal{H}_2'$ 不同的地方。

## 限制式怎麼解：拉格朗日乘數、augmented error 與 weight decay

```youtube
url: https://www.youtube.com/watch?v=idWnPdW9znM
title: Regularization :: Weight Decay Regularization @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:57 寫成矩陣形式，01:57–09:03 用幾何講拉格朗日乘數，09:03–12:40 給定 λ 求閉式解，12:40–17:20 是 augmented error，17:20–19:39 看不同 λ 的結果，19:39–23:08 是 Legendre 多項式，之後是 Fun Time。）

### 先寫成矩陣

第 8 頁把問題寫成向量與矩陣。把 $N$ 筆轉換後的資料 $\mathbf{z}_n^\top$ 一列一列疊成矩陣 $\mathrm{Z}$，標籤疊成向量 $\mathbf{y}$，基石第 9 堂推過 $\sum_n (\mathbf{w}^\top\mathbf{z}_n - y_n)^2 = (\mathrm{Z}\mathbf{w} - \mathbf{y})^\top(\mathrm{Z}\mathbf{w} - \mathbf{y})$，講義在旁邊寫了一句 remember? 限制式的 $\sum_q w_q^2$ 則是 $\mathbf{w}$ 和自己的內積：

$$
\min_{\mathbf{w} \in \mathbb{R}^{Q+1}} \ E_{\text{in}}(\mathbf{w}) = \frac{1}{N}(\mathrm{Z}\mathbf{w} - \mathbf{y})^\top(\mathrm{Z}\mathbf{w} - \mathbf{y}) \qquad \text{s.t.} \quad \mathbf{w}^\top\mathbf{w} \le C
$$

限制式有幾何意義：合格的 $\mathbf{w}$ 落在一顆球心在原點、半徑 $\sqrt{C}$ 的球裡面（講義寫 hypersphere）。球外的 $\mathbf{w}$ 都不要。

### 幾何：最佳解上，負梯度和 w 平行

第 9 頁用一張二維的圖來想這個問題。圖上有三樣東西：

- **藍色的橢圓**，標著 $E_{\text{in}} = \text{const.}$，是 $E_{\text{in}}$ 的等高線。橢圓的中心是 $\mathbf{w}_{\text{LIN}}$，也就是沒有限制時線性迴歸的解。課堂上說 $E_{\text{in}}$ 像一個山谷，谷底在 $\mathbf{w}_{\text{LIN}}$。
- **紅色的圓**，標著 $\mathbf{w}^\top\mathbf{w} = C$，圓心在原點。合格的解只能在圓裡面。
- **圓上的一個點 $\mathbf{w}$**，從它畫出三個箭頭：藍色的 $-\nabla E_{\text{in}}$ 指向谷底那一側，紅色的 normal 從原點往外指，綠色的箭頭沿著圓的切線。

沒有限制時，[基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)教的梯度下降是沿著 $-\nabla E_{\text{in}}(\mathbf{w})$ 往下滾，一路滾到 $\mathbf{w}_{\text{LIN}}$。現在有那顆球擋著。如果 $\mathbf{w}_{\text{LIN}}$ 本來就在球裡，它就是答案，限制式沒有作用。課堂上說大部分的時候不是這樣，$\mathbf{w}_{\text{LIN}}$ 在球外，這時候要的解會在球的邊界上。

本文補充邊界這件事的理由：$E_{\text{in}}$ 是凸函數，假如最佳解在球的內部，它附近每個方向都走得動，卻沒有一個方向能讓 $E_{\text{in}}$ 變小，那它就是整個山谷的谷底 $\mathbf{w}_{\text{LIN}}$，和「$\mathbf{w}_{\text{LIN}}$ 在球外」矛盾。

接下來的問題是：站在球面上的某個 $\mathbf{w}$，怎麼判斷它是不是最佳解。講義分四步：

1. **下降的方向**是 $-\nabla E_{\text{in}}(\mathbf{w})$。
2. **球面的法向量**（normal vector）是 $\mathbf{w}$ 本身。球面是 $\mathbf{w}^\top\mathbf{w} = C$，從原點指向球面上那個點的方向就垂直於球面。沿著這個方向往外走會滾出球，違反限制；垂直於它的方向是沿著球面走，課堂上說走一小步還會留在球上。
3. **如果 $-\nabla E_{\text{in}}(\mathbf{w})$ 和 $\mathbf{w}$ 不平行**，把 $-\nabla E_{\text{in}}$ 拆成法向量方向的分量和垂直於法向量的分量，後者就是圖上的綠色箭頭，而且不是零。沿著綠色箭頭走，$E_{\text{in}}$ 會下降，又不會離開球面。講義的說法是 can decrease $E_{\text{in}}(\mathbf{w})$ without violating the constraint。這個 $\mathbf{w}$ 不是最佳解。
4. **所以在最佳解 $\mathbf{w}_{\text{REG}}$ 上**，綠色的分量必須是零，也就是

$$
-\nabla E_{\text{in}}(\mathbf{w}_{\text{REG}}) \ \propto\ \mathbf{w}_{\text{REG}}
$$

兩個向量平行，就是其中一個等於另一個乘上一個數。講義把這個比例寫成 $\frac{2\lambda}{N}$：

$$
\nabla E_{\text{in}}(\mathbf{w}_{\text{REG}}) + \frac{2\lambda}{N}\mathbf{w}_{\text{REG}} = \mathbf{0}
$$

課堂上說多放的 2 和 $N$ 只是為了等一下推導方便。$\lambda$ 叫拉格朗日乘數（Lagrange multiplier），是解有限制的最佳化問題的重要工具；上面那四步是它的幾何意義，沒學過的人也可以從這個幾何來理解。講義把目標寫成：找出 $\lambda > 0$ 和 $\mathbf{w}_{\text{REG}}$，讓這個式子成立。

本文補充 $\lambda$ 為什麼是正的。式子移項後是 $-\nabla E_{\text{in}} = \frac{2\lambda}{N}\mathbf{w}_{\text{REG}}$，$\lambda > 0$ 代表負梯度朝球的外面指：谷底在球外，往下滾的方向就是往外。如果負梯度朝球的裡面指，往裡走一步既合格又能讓 $E_{\text{in}}$ 下降，那個點也不會是最佳解。

### 有人告訴你 λ：解一個線性方程式

現在未知數從一個 $\mathbf{w}$ 變成 $\mathbf{w}$ 加 $\lambda$，課堂上替學生抱怨了一句：問題好像更複雜了。講義第 10 頁的處理是先假設有 oracle 告訴你 $\lambda$（課堂上說成「很神的同學」）。這樣一來未知數只剩 $\mathbf{w}_{\text{REG}}$。

基石第 9 堂算過線性迴歸的梯度：$\nabla E_{\text{in}}(\mathbf{w}) = \frac{2}{N}\big(\mathrm{Z}^\top\mathrm{Z}\mathbf{w} - \mathrm{Z}^\top\mathbf{y}\big)$。代進平行條件：

$$
\frac{2}{N}\big(\mathrm{Z}^\top\mathrm{Z}\mathbf{w}_{\text{REG}} - \mathrm{Z}^\top\mathbf{y}\big) + \frac{2\lambda}{N}\mathbf{w}_{\text{REG}} = \mathbf{0}
$$

式子裡除了 $\mathbf{w}_{\text{REG}}$ 都是已知的數，而且 $\mathbf{w}_{\text{REG}}$ 只出現一次方，課堂上強調這是一個線性方程式。兩邊同乘 $\frac{N}{2}$，先前多放的 2 和 $N$ 在這裡消掉：

$$
\mathrm{Z}^\top\mathrm{Z}\mathbf{w}_{\text{REG}} - \mathrm{Z}^\top\mathbf{y} + \lambda\mathbf{w}_{\text{REG}} = \mathbf{0}
$$

把 $\lambda\mathbf{w}_{\text{REG}}$ 寫成 $\lambda\mathrm{I}\mathbf{w}_{\text{REG}}$（$\mathrm{I}$ 是單位矩陣），含 $\mathbf{w}_{\text{REG}}$ 的兩項合併，$\mathrm{Z}^\top\mathbf{y}$ 移到右邊：

$$
\big(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}\big)\mathbf{w}_{\text{REG}} = \mathrm{Z}^\top\mathbf{y} \quad\Longrightarrow\quad \mathbf{w}_{\text{REG}} = \big(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}\big)^{-1}\mathrm{Z}^\top\mathbf{y}
$$

和 $\mathbf{w}_{\text{LIN}} = (\mathrm{Z}^\top\mathrm{Z})^{-1}\mathrm{Z}^\top\mathbf{y}$ 相比，只多了一個 $\lambda\mathrm{I}$。講義註明這在統計學裡叫 ridge regression。

最後一步用到反矩陣，它一定存在嗎？課堂上說只要 $\lambda > 0$ 就一定存在：$\mathrm{Z}^\top\mathrm{Z}$ 是半正定的，加上正的 $\lambda\mathrm{I}$ 之後變成正定，正定矩陣一定可逆。本文把這句話的計算補上。對任何不是零向量的 $\mathbf{v}$：

$$
\mathbf{v}^\top\big(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}\big)\mathbf{v} = (\mathrm{Z}\mathbf{v})^\top(\mathrm{Z}\mathbf{v}) + \lambda\mathbf{v}^\top\mathbf{v} = \lVert\mathrm{Z}\mathbf{v}\rVert^2 + \lambda\lVert\mathbf{v}\rVert^2 > 0
$$

第一項不會是負的，第二項在 $\lambda > 0$ 時嚴格大於 0。如果矩陣不可逆，就會有某個非零的 $\mathbf{v}$ 被它乘成零向量，上式會等於 0，矛盾。基石第 9 堂的 $\mathrm{Z}^\top\mathrm{Z}$ 在資料太少時可能不可逆，要靠 pseudo-inverse；加了 $\lambda\mathrm{I}$ 之後沒有這個問題，解也是唯一的。

### 換個角度：最小化 augmented error

第 10 頁的第二個版本換一種方式讀同一條式子。課堂上的出發點是：$E_{\text{in}}$ 不一定是線性迴歸的，也可能是邏輯迴歸的，那時候沒有閉式解，該怎麼看這個條件？

以前解 $\nabla E_{\text{in}}(\mathbf{w}) = \mathbf{0}$，是因為想最小化 $E_{\text{in}}$。現在要解的是「梯度加上某一項等於零」，那就去找一個函數，它的梯度剛好是左邊那一整串。課堂上說這是把微分倒回去做積分。$\mathbf{w}^\top\mathbf{w} = \sum_q w_q^2$ 對 $w_q$ 偏微分是 $2w_q$，所以 $\nabla(\mathbf{w}^\top\mathbf{w}) = 2\mathbf{w}$，於是

$$
\nabla\Big(E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}\Big) = \nabla E_{\text{in}}(\mathbf{w}) + \frac{2\lambda}{N}\mathbf{w}
$$

右邊就是平行條件的左邊。所以解平行條件，等於最小化

$$
E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \underbrace{\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}}_{\text{regularizer}}
$$

多出來的那一項叫正則化項（regularizer），整個函數叫 augmented error，augmented 就是「加上去的」。這個新問題沒有任何限制式，課堂上的說法是原本的條件跑進要最小化的東西裡面去了。講義把做法寫成：

$$
\mathbf{w}_{\text{REG}} \leftarrow \operatorname*{argmin}_{\mathbf{w}} E_{\text{aug}}(\mathbf{w}) \quad \text{for given } \lambda > 0 \text{ or } \lambda = 0
$$

$\lambda = 0$ 也收，這時候正則化項消失，回到原本只最小化 $E_{\text{in}}$ 的問題。

這也改變了使用者要給的參數。課堂上的講法是：本來使用者給 $C$，我們還得去找它對應的 $\lambda$；既然每個 $C$ 都對應到某個 $\lambda$，不如請使用者直接給 $\lambda$。對使用者來說給哪一個花的力氣差不多，對我們來說有了 $\lambda$ 就只剩一個沒有限制式的問題要解。講義頁尾的結論是：minimizing unconstrained $E_{\text{aug}}$ effectively minimizes some $C$-constrained $E_{\text{in}}$。

本文補一個不靠圖的檢查，確認反過來也對：給定 $\lambda > 0$，令 $\mathbf{w}_{\text{REG}}$ 是 $E_{\text{aug}}$ 的最小點，取 $C = \mathbf{w}_{\text{REG}}^\top\mathbf{w}_{\text{REG}}$。對任何滿足 $\mathbf{w}^\top\mathbf{w} \le C$ 的 $\mathbf{w}$，由 $E_{\text{aug}}(\mathbf{w}) \ge E_{\text{aug}}(\mathbf{w}_{\text{REG}})$ 移項得到

$$
E_{\text{in}}(\mathbf{w}) \ \ge\ E_{\text{in}}(\mathbf{w}_{\text{REG}}) + \frac{\lambda}{N}\big(C - \mathbf{w}^\top\mathbf{w}\big) \ \ge\ E_{\text{in}}(\mathbf{w}_{\text{REG}})
$$

第二個不等號用到 $C - \mathbf{w}^\top\mathbf{w} \ge 0$。所以 $\mathbf{w}_{\text{REG}}$ 確實是 $\mathcal{H}(C)$ 裡 $E_{\text{in}}$ 最小的那一個。

### 數值例子：三筆資料，把 λ 從 0 調到 100

以下是本文自擬的例子，不在講義上。為了能畫在平面上、對得上第 9 頁那張圖，$\mathbf{w}$ 只取兩維：不做高次轉換，$\mathbf{z} = (1, x)$，假說是直線 $w_0 + w_1 x$。資料三筆：

| $n$ | $x_n$ | $\mathbf{z}_n$ | $y_n$ |
|---|---|---|---|
| 1 | $-1$ | $(1, -1)$ | $1$ |
| 2 | $0$ | $(1, 0)$ | $3$ |
| 3 | $1$ | $(1, 1)$ | $2$ |

**第一步：算兩個矩陣。**

$$
\mathrm{Z}^\top\mathrm{Z} = \begin{bmatrix} 1+1+1 & -1+0+1 \\ -1+0+1 & 1+0+1 \end{bmatrix} = \begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}, \qquad \mathrm{Z}^\top\mathbf{y} = \begin{bmatrix} 1+3+2 \\ -1+0+2 \end{bmatrix} = \begin{bmatrix} 6 \\ 1 \end{bmatrix}
$$

$x$ 對 0 對稱，所以 $\mathrm{Z}^\top\mathrm{Z}$ 是對角矩陣，反矩陣可以直接寫。

**第二步：沒有正則化的解。** $\mathbf{w}_{\text{LIN}} = (6/3,\ 1/2) = (2, \tfrac{1}{2})$。三筆的預測是 $1.5, 2, 2.5$，誤差是 $0.5, -1, 0.5$，$E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{1}{3}(0.25 + 1 + 0.25) = \frac{1}{2}$。$\lVert\mathbf{w}_{\text{LIN}}\rVert^2 = 4 + \tfrac{1}{4} = \tfrac{17}{4} = 4.25$。

**第三步：代閉式解。** $\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}$ 的對角線是 $3 + \lambda$ 和 $2 + \lambda$，所以

$$
\mathbf{w}_{\text{REG}} = \Big(\frac{6}{3+\lambda},\ \frac{1}{2+\lambda}\Big)
$$

取 $\lambda = 1$：$\mathbf{w}_{\text{REG}} = (\tfrac{3}{2}, \tfrac{1}{3})$。三筆的預測是 $\tfrac{7}{6}, \tfrac{3}{2}, \tfrac{11}{6}$，和 $y$ 的差是 $\tfrac{1}{6}, -\tfrac{3}{2}, -\tfrac{1}{6}$，所以

$$
E_{\text{in}}(\mathbf{w}_{\text{REG}}) = \frac{1}{3}\Big(\frac{1}{36} + \frac{9}{4} + \frac{1}{36}\Big) = \frac{83}{108} \approx 0.769, \qquad \lVert\mathbf{w}_{\text{REG}}\rVert^2 = \frac{9}{4} + \frac{1}{9} = \frac{85}{36} \approx 2.361
$$

$E_{\text{in}}$ 從 $0.5$ 升到 $0.769$，$\mathbf{w}$ 的長度平方從 $4.25$ 降到 $2.361$。

**第四步：檢查平行條件。** 在 $\mathbf{w}_{\text{REG}} = (\tfrac{3}{2}, \tfrac{1}{3})$：

$$
\nabla E_{\text{in}} = \frac{2}{3}\left(\begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}\begin{bmatrix} 3/2 \\ 1/3 \end{bmatrix} - \begin{bmatrix} 6 \\ 1 \end{bmatrix}\right) = \frac{2}{3}\begin{bmatrix} -3/2 \\ -1/3 \end{bmatrix} = \begin{bmatrix} -1 \\ -2/9 \end{bmatrix}
$$

而 $\frac{2\lambda}{N}\mathbf{w}_{\text{REG}} = \frac{2}{3}(\tfrac{3}{2}, \tfrac{1}{3}) = (1, \tfrac{2}{9})$。兩者相加是零向量，負梯度 $(1, \tfrac{2}{9})$ 和 $\mathbf{w}_{\text{REG}}$ 方向相同。

**第五步：對照有限制式的問題。** 這個 $\mathbf{w}_{\text{REG}}$ 落在半徑平方 $C = \tfrac{85}{36}$ 的圓上。同一個圓上換一個點，例如 $\mathbf{w}_A = (\sqrt{85}/6,\ 0) \approx (1.537, 0)$：

- $E_{\text{in}}(\mathbf{w}_A) \approx 0.881$，比 $0.769$ 高。
- $-\nabla E_{\text{in}}(\mathbf{w}_A) = \frac{2}{3}\big(6 - 3 \times 1.537,\ 1 - 0\big) \approx (0.927, 0.667)$。
- 法向量是 $\mathbf{w}_A$ 的方向 $(1, 0)$。負梯度拆開來，法向量方向的分量是 $0.927$，垂直於它的分量是 $(0, 0.667)$，不是零。

這個 $0.667$ 就是第 9 頁圖上的綠色箭頭：沿著圓往 $w_1$ 增加的方向走，$E_{\text{in}}$ 還能再降，一直走到 $(\tfrac{3}{2}, \tfrac{1}{3})$ 綠色分量才消失。本文用程式把這個圓切成兩百萬個點逐一算 $E_{\text{in}}$，最小值 $0.76852$ 出現在 $(1.5000, 0.3333)$，和閉式解一致。

**第六步：把 $\lambda$ 掃一遍。**

| $\lambda$ | $\mathbf{w}_{\text{REG}}$ | $\lVert\mathbf{w}_{\text{REG}}\rVert^2$（等效的 $C$） | $E_{\text{in}}$ | $E_{\text{aug}}$ |
|---|---|---|---|---|
| $0$ | $(2, 0.5)$ | $4.250$ | $0.500$ | $0.500$ |
| $0.1$ | $(1.935, 0.476)$ | $3.973$ | $0.505$ | $0.637$ |
| $1$ | $(1.5, 0.333)$ | $2.361$ | $0.769$ | $1.556$ |
| $3$ | $(1, 0.2)$ | $1.040$ | $1.560$ | $2.600$ |
| $10$ | $(0.462, 0.083)$ | $0.220$ | $2.983$ | $3.716$ |
| $100$ | $(0.058, 0.010)$ | $0.003$ | $4.431$ | $4.547$ |

**這個結果代表什麼。** $\lambda$ 往上調，$\mathbf{w}_{\text{REG}}$ 愈來愈短，等效的 $C$ 愈來愈小，$E_{\text{in}}$ 愈來愈高；$\lambda$ 很大時 $\mathbf{w}$ 被壓到接近零向量，直線幾乎變成 $y = 0$，$E_{\text{in}}$ 逼近 $\frac{1}{3}(1 + 9 + 4) \approx 4.667$。$\lambda = 0.1$ 只讓 $E_{\text{in}}$ 多了 $0.005$，$\lambda = 10$ 就多了將近 $2.5$。兩個係數被壓縮的比例也不同：$\lambda = 1$ 時 $w_0$ 乘上 $\frac{3}{4}$、$w_1$ 乘上 $\frac{2}{3}$，$\mathrm{Z}^\top\mathrm{Z}$ 對角線上數字小的方向縮得多。

反過來，給定 $C$ 也找得到 $\lambda$，只是要解方程式 $\frac{36}{(3+\lambda)^2} + \frac{1}{(2+\lambda)^2} = C$：$C = 3$ 對應 $\lambda \approx 0.556$，$C = 2$ 對應 $\lambda \approx 1.341$，$C = 1$ 對應 $\lambda \approx 3.118$。$C \ge 4.25$ 時 $\mathbf{w}_{\text{LIN}}$ 已經在圓裡，$\lambda = 0$。這個方程式沒有簡單的公式解，要用數值方法。課堂上說使用者給 $C$ 的話還得多花力氣找出對應的 $\lambda$，指的就是這一步。

想自己重算的話，下面這段程式會印出上表的每一列：

```python
import numpy as np

Z = np.array([[1, -1], [1, 0], [1, 1]], dtype=float)
y = np.array([1, 3, 2], dtype=float)
N = len(y)

for lam in [0, 0.1, 1, 3, 10, 100]:
    w = np.linalg.solve(Z.T @ Z + lam * np.eye(2), Z.T @ y)
    e_in = np.mean((Z @ w - y) ** 2)
    print(lam, w.round(3), round(w @ w, 3), round(e_in, 3), round(e_in + lam / N * (w @ w), 3))
```

### 講義上的四張圖與 weight decay 這個名字

第 11 頁回到這堂一開始的五個資料點，用四個不同的 $\lambda$ 各做一次，四張圖由左到右：

| $\lambda$ | 紅線的樣子 | 講義的標註 |
|---|---|---|
| $0$ | 穿過每個點，在點之間大幅擺動 | overfitting |
| $0.0001$ | 平滑，幾乎和藍色的目標疊在一起 | |
| $0.01$ | 平滑，開始離開目標，沒有穿過每個點 | |
| $1$ | 很平的一條曲線，離目標很遠 | underfitting |

$\lambda = 0$ 就是原本只最小化 $E_{\text{in}}$ 的結果。課堂上說，只加 $0.0001$ 這麼一點點，紅線就已經很平滑、很貼近藍線；$\lambda$ 加到很大時線還是平滑的，但離藍線又遠了，這是上一堂講的欠擬合（underfitting）。講義把心得寫成一句：a little regularization goes a long way。課堂上說這是套用一句諺語 a little goes a long way，本來的意思是一點點努力就能成就很多事。

講義接著給這個做法一個名字：把 $+\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$ 叫作 weight-decay regularization，並列出三件等價的事：

$$
\text{larger } \lambda \iff \text{prefer shorter } \mathbf{w} \iff \text{effectively smaller } C
$$

課堂上的解釋是，$\lambda$ 像是在懲罰長的 $\mathbf{w}$：要最小化的東西裡有 $\lambda$ 乘上長度的平方，$\mathbf{w}$ 愈長被罰得愈多。weight decay 這個名字指的是把權重變小。上面數值例子的表就是這三件事的實例。

本文補充這個名字的另一個讀法，用的是基石第 10 堂的梯度下降。對 $E_{\text{aug}}$ 做梯度下降，每一步是

$$
\mathbf{w}_{t+1} = \mathbf{w}_t - \eta\Big(\nabla E_{\text{in}}(\mathbf{w}_t) + \frac{2\lambda}{N}\mathbf{w}_t\Big) = \Big(1 - \frac{2\eta\lambda}{N}\Big)\mathbf{w}_t - \eta\nabla E_{\text{in}}(\mathbf{w}_t)
$$

$\eta$ 是步長。只要 $\eta\lambda$ 是正的而且不太大，括號裡的數就介於 0 和 1 之間：每一步都先把舊的權重縮小一點，再照原本的梯度更新。

頁尾還有一句 go with 'any' transform + linear model。課堂上說這堂用多項式轉換加線性迴歸當例子，同樣的正則化也可以搭配邏輯迴歸，或搭配別的轉換。本文補充：搭配邏輯迴歸時沒有閉式解，可以用上面那條梯度下降的式子去最小化 $E_{\text{aug}}$。

### 一個細節：Legendre 多項式

第 12 頁交代那四張圖背後的一個處理。課堂上說，為了讓結果好看一點，做轉換時動了一點小手腳。正則化的問題寫出來是

$$
\min_{\mathbf{w} \in \mathbb{R}^{Q+1}} \ \frac{1}{N}\sum_{n=1}^{N}\big(\mathbf{w}^\top\boldsymbol{\Phi}(x_n) - y_n\big)^2 + \frac{\lambda}{N}\sum_{q=0}^{Q} w_q^2
$$

講義這一頁把第一個加總的下標印成 $n = 0$ 到 $N$；資料是從第 1 筆編到第 $N$ 筆，第 8 頁同一個加總也寫 $n = 1$，所以上面照 $n = 1$ 到 $N$ 寫。

如果 $\boldsymbol{\Phi}$ 是原本的多項式轉換 $(1, x, x^2, \dots, x^Q)$（講義稱為 naïve polynomial transform），而 $x_n$ 落在 $[-1, +1]$，那麼 $x_n^q$ 在 $q$ 大的時候會非常小。例如 $x = 0.5$ 時 $x^{10} \approx 0.001$。講義的註解是：$x_n^q$ really small, needing large $w_q$。高次項要對結果有影響，就得配一個很大的係數，而正則化正好在罰大的係數。課堂上說這等於過度懲罰了高次項：低次的地方容忍得多，高次的地方正則化下得太重。課堂上還提到太小的數字會有精確度的問題。

講義的做法是換一組基底，稱為 normalized polynomial transform：

$$
\boldsymbol{\Phi}(x) = \big(1, L_1(x), L_2(x), \dots, L_Q(x)\big)
$$

$L_q$ 是 Legendre 多項式，講義列了前五個的式子與圖形：

| | 式子 |
|---|---|
| $L_1$ | $x$ |
| $L_2$ | $\frac{1}{2}(3x^2 - 1)$ |
| $L_3$ | $\frac{1}{2}(5x^3 - 3x)$ |
| $L_4$ | $\frac{1}{8}(35x^4 - 30x^2 + 3)$ |
| $L_5$ | $\frac{1}{8}(63x^5 - \cdots)$ |

$L_q$ 仍然是 $q$ 次多項式，所以這組基底組得出的函數和原本的 $(1, x, \dots, x^Q)$ 一模一樣，假說集合沒有變，變的只是同一個函數用哪一組係數表示。課堂上把它說成坐標轉換：原本那幾個坐標彼此不垂直，做正則化時就出了問題；把函數想成無限多維的向量，可以要求它們兩兩的內積是 0，Legendre 多項式就是對原本的多項式做垂直化得到的。這個做法在線性代數裡叫 Gram–Schmidt 正交化，這個名稱是本文補的。

本文用兩個計算把這段話落實。函數的內積取 $\int_{-1}^{1} f(x)g(x)\,dx$：

- 原本的基底不垂直：$\int_{-1}^{1} 1 \cdot x^2\,dx = \frac{2}{3}$，$\int_{-1}^{1} x \cdot x^3\,dx = \frac{2}{5}$，都不是 0。
- Legendre 多項式兩兩垂直：本文把 $1, L_1, \dots, L_5$ 兩兩相乘再積分，不同的兩個得到的都是 0。

講義稱這組基底為 orthonormal basis functions。照講義列的式子直接算，自己和自己的內積是 $\int_{-1}^{1} L_q(x)^2\,dx = \frac{2}{2q+1}$（$q = 0$ 到 $5$ 依序是 $2, \frac{2}{3}, \frac{2}{5}, \frac{2}{7}, \frac{2}{9}, \frac{2}{11}$），並不是 1。所以嚴格說這幾個式子是正交（orthogonal）的，還要各自再乘上一個常數才是單位長度。這不影響講義要講的重點：它們彼此垂直。

同一個函數在兩組基底下被罰多少，差別很大。拿 $h(x) = L_4(x)$ 來看：

| 基底 | 係數 | $\sum_q w_q^2$ |
|---|---|---|
| Legendre | $w_4 = 1$，其他是 0 | $1$ |
| 原本的多項式 | $w_0 = \frac{3}{8}$、$w_2 = -\frac{30}{8}$、$w_4 = \frac{35}{8}$ | $\frac{9 + 900 + 1225}{64} \approx 33.3$ |

同一條曲線，用原本的基底寫，weight decay 的懲罰是 33 倍。$L_5$ 更誇張，是 $142$ 比 $1$。課堂上的建議是：這只是補充的細節，記得以後做多項式迴歸加正則化時，用 Legendre 多項式效果會比較好。

### Fun Time：什麼時候正則化的解和原本一樣

**題目（第 13 頁）：** $\mathbf{w}_{\text{REG}}$ 在什麼情況下會等於 $\mathbf{w}_{\text{LIN}}$？

1. $\lambda = 0$
2. $C = \infty$
3. $C \ge \lVert\mathbf{w}_{\text{LIN}}\rVert^2$
4. 以上皆是

**答案：4。** 講義說選項 1 和 2 應該很容易，選項 3 代表對 $\mathbf{w}$ 實際上沒有限制。

- 選項 1：$\lambda = 0$ 時 $E_{\text{aug}} = E_{\text{in}}$，閉式解裡的 $\lambda\mathrm{I}$ 也消失，就是 $\mathbf{w}_{\text{LIN}}$。課堂上說這等於把正則化項遮起來。
- 選項 2：$C = \infty$ 時 $\mathcal{H}(\infty) = \mathcal{H}_{10}$，沒有限制式。
- 選項 3：$C \ge \lVert\mathbf{w}_{\text{LIN}}\rVert^2$ 表示 $\mathbf{w}_{\text{LIN}}$ 本身滿足限制式。它是所有 $\mathbf{w}$ 裡 $E_{\text{in}}$ 最小的，又在合格的範圍內，當然也是合格範圍裡最小的。課堂上的講法是紅色的球大到把 $\mathbf{w}_{\text{LIN}}$ 包在裡面。

選項 2 其實是選項 3 的特例。套到數值例子：$\lVert\mathbf{w}_{\text{LIN}}\rVert^2 = 4.25$，所以 $C = 5$ 或 $C = 100$ 得到的都是 $(2, 0.5)$，對應的 $\lambda$ 都是 0；$C$ 降到 $4.25$ 以下，限制式才開始有作用。講義把 $\lambda$ 的範圍寫成「$\lambda > 0$ or $\lambda = 0$」，從這裡看得出 $\lambda = 0$ 為什麼要收進來：一整段 $C$ 都對到同一個 $\lambda = 0$。

## 正則化在 VC 理論裡對應什麼：有效 VC 維度

```youtube
url: https://www.youtube.com/watch?v=15JB2o4VUeY
title: Regularization :: Regularization and VC Theory @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:52 是兩種寫法與 VC 保證，01:52–05:00 把 augmented error 和 VC bound 並排看，05:00–07:42 是有效 VC 維度，之後是 Fun Time。）

### 沒有被關在 H(C) 裡，卻拿到它的保證

基石的第二段（Why Can Machines Learn?）得到的結論是 VC bound：$E_{\text{out}}$ 不會比 $E_{\text{in}}$ 加上一項模型複雜度的代價來得大。這一節問的是，正則化和這個理論有什麼關係。

第 14 頁畫了三個框：

| 框 | 內容 |
|---|---|
| 左上：有限制式的正則化 | $\min_{\mathbf{w}} E_{\text{in}}(\mathbf{w})$ s.t. $\mathbf{w}^\top\mathbf{w} \le C$ |
| 右上：它的 VC 保證 | $E_{\text{out}}(\mathbf{w}) \le E_{\text{in}}(\mathbf{w}) + \Omega(\mathcal{H}(C))$ |
| 左下：最小化 augmented error | $\min_{\mathbf{w}} E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$ |

左上到右上有一個箭頭：如果真的只在 $\mathcal{H}(C)$ 裡挑假說，VC bound 裡的複雜度就用 $\mathcal{H}(C)$ 的來算，它比整個 $\mathcal{H}$ 的小。左上和左下之間是雙向箭頭，標著 $C$ equivalent to some $\lambda$，這是前面「換個角度：最小化 augmented error」得到的結論。

我們實際做的是左下那一個。課堂上說這是偷懶：設一個 $\lambda$ 就去解，並沒有回頭算它對應的 $C$ 是多少。講義的結論是：minimizing $E_{\text{aug}}$: indirectly getting VC guarantee without confining to $\mathcal{H}(C)$。課堂上解釋「間接」的意思：最佳化的時候沒有限制式，所有的 $\mathbf{w}$ 都在考慮範圍內，只是每個 $\mathbf{w}$ 身上多了一項「喜歡這個、不喜歡那個」的懲罰；最後選出來的 $\mathbf{w}$ 落在某個 $\mathcal{H}(C)$ 裡，右上角的保證是對那個 $\mathcal{H}(C)$ 說的。

### 兩個 Ω：一個量假說，一個量假說集合

第 15 頁把兩條式子並排：

$$
E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} \qquad\qquad E_{\text{out}}(\mathbf{w}) \le E_{\text{in}}(\mathbf{w}) + \Omega(\mathcal{H})
$$

兩邊都是 $E_{\text{in}}$ 加上一項，加的東西不一樣：

- 正則化項 $\mathbf{w}^\top\mathbf{w}$ 量的是**單一假說**有多複雜。課堂上用多項式來想：高次的多項式彎彎曲曲，低次的平滑，這一項說的是 $\mathbf{w}$ 代表的那條曲線本身有多複雜。
- VC bound 的 $\Omega(\mathcal{H})$ 量的是**整個假說集合**有多複雜，講義稱為 generalization price。課堂上的說法是它代表有多少種選擇。

課堂上說這裡把符號重複使用（overload）：正則化項也記成 $\Omega(\mathbf{w})$，凡是複雜度都用 $\Omega$。講義接著寫：如果 $\frac{\lambda}{N}\Omega(\mathbf{w})$ 能好好「代表」$\Omega(\mathcal{H})$，那麼 $E_{\text{aug}}$ 就是比 $E_{\text{in}}$ 更好的 $E_{\text{out}}$ 代理（proxy）。課堂上給的理由是：一個很複雜的多項式，某種角度上應該待在一個很複雜的假說集合裡，兩種複雜度有關聯。

講義把最小化 $E_{\text{aug}}$ 的好處分成兩句：

- (heuristically) operating with the better proxy：用一個比較好的代理人來做事。
- (technically) enjoying flexibility of whole $\mathcal{H}$：仍然可以在整個 $\mathcal{H}$ 裡自由挑。

課堂上特別聲明第一句是 heuristic，不是數學，只是在對照兩條式子長得像的地方。本文也提醒：這不是在說 $E_{\text{aug}}$ 是 $E_{\text{out}}$ 的上界。

### 實際用到多少：有效 VC 維度

第 16 頁換一個角度問：做正則化時，模型複雜度的代價到底付了多少？把問題寫成一般的形式，轉換後的維度記成 $\tilde{d}$：

$$
\min_{\mathbf{w} \in \mathbb{R}^{\tilde{d}+1}} E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\Omega(\mathbf{w})
$$

講義分三行回答：

1. **照規矩算**：$d_{\text{VC}}(\mathcal{H}) = \tilde{d} + 1$。最小化的時候所有的 $\mathbf{w}$ 都被考慮了（講義寫 all considered），所以假說集合是整個 $\mathcal{H}$。
2. **實際需要的**（actually needed）只有 $\mathcal{H}(C)$，$C$ 是和 $\lambda$ 等效的那一個。課堂上的說法是：看起來全部都考慮了，其實只有少數的 $\mathbf{w}$ 會在谷底附近，就是 $\mathcal{H}(C)$ 裡面的那些。
3. **所以**把 $d_{\text{VC}}(\mathcal{H}(C))$ 叫作有效 VC 維度（effective VC dimension），記成 $d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$。$\mathcal{A}$ 是演算法，在這裡就是「最小化 $E_{\text{aug}}$」。

$d_{\text{EFF}}$ 有兩個引數是重點。以前衡量模型複雜度只看假說集合；課堂上說現在要把假說集合和演算法「包起來看」，看演算法在假說集合裡怎麼做選擇、實際動用了多少能力。演算法如果在裡面踩煞車（加上正則化項就是踩煞車），用到的 VC 維度就可能比整個假說集合的小，泛化也可能跟著變好。

講義對正則化的解釋就是這三行：

$$
d_{\text{VC}}(\mathcal{H}) \text{ large, while } d_{\text{EFF}}(\mathcal{H}, \mathcal{A}) \text{ small if } \mathcal{A} \text{ regularized}
$$

課堂上稱這是「概念上」的定義。講義沒有給 $d_{\text{EFF}}$ 的計算公式，也沒有證明把它代進 VC bound 之後不等式仍然成立。

### 套回三筆資料的例子

以下是本文的補充。前面的例子裡 $\mathcal{H}$ 是所有直線 $w_0 + w_1 x$，照規矩算的代價是固定的，和 $\lambda$ 無關。實際用到的集合卻跟著 $\lambda$ 縮：

| $\lambda$ | 選出的 $\mathbf{w}_{\text{REG}}$ 所在的集合 |
|---|---|
| $0$ | $\mathcal{H}(4.25)$，效果等同整個 $\mathcal{H}$ |
| $1$ | $\mathcal{H}(2.361)$ |
| $3$ | $\mathcal{H}(1.04)$ |
| $10$ | $\mathcal{H}(0.22)$ |

$\mathcal{H}(0.22) \subset \mathcal{H}(1.04) \subset \mathcal{H}(2.361) \subset \mathcal{H}(4.25)$，一個比一個小。到了 $\mathcal{H}(0.22)$，斜率 $w_1$ 的絕對值不可能超過 $\sqrt{0.22} \approx 0.47$，截距也是；能畫出來的只剩一小撮貼近 $y = 0$ 的平緩直線。「所有直線」和「這一小撮直線」在同一個 $\mathcal{H}$ 裡，講義要說的是後者的複雜度才是實際付出的代價。

講義沒有給 $d_{\text{EFF}}$ 的數字。統計學對 ridge regression 另有一個常用的量叫有效自由度，定義是 $\operatorname{tr}\big(\mathrm{Z}(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\big)$。它和講義的 $d_{\text{EFF}}$ 不是同一個定義，這裡只借它來看「有效的參數個數會連續地變少」。在這個例子裡它等於 $\frac{3}{3+\lambda} + \frac{2}{2+\lambda}$：$\lambda = 0$ 時是 2，剛好是係數的個數；$\lambda = 1$ 時是 $\frac{17}{12} \approx 1.42$；$\lambda = 3$ 時是 $0.9$；$\lambda = 10$ 時約 $0.40$。

### Fun Time：λ 變大，有效 VC 維度怎麼變

**題目（第 17 頁）：** 考慮迴歸問題上的 weight-decay 正則化。把演算法 $\mathcal{A}$ 裡的 $\lambda$ 調大，$d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$ 會怎麼樣？

1. $d_{\text{EFF}}$ 上升
2. $d_{\text{EFF}}$ 下降
3. $d_{\text{EFF}} = d_{\text{VC}}(\mathcal{H})$，和 $\lambda$ 無關
4. $d_{\text{EFF}} = 1126$，和 $\lambda$ 無關

**答案：2。** 講義的解答是一串等價關係：

$$
\text{larger } \lambda \iff \text{smaller } C \iff \text{smaller } \mathcal{H}(C) \iff \text{smaller } d_{\text{EFF}}
$$

第一個關係在數值例子把 $\lambda$ 掃一遍的那張表裡看過：$\lambda$ 從 0 調到 10，等效的 $C$ 從 $4.25$ 降到 $0.22$。$C$ 變小，$\mathcal{H}(C)$ 是比較小的球，裡面的假說是原本的一部分；假說集合變小，VC 維度不會變大。

選項 1 把方向弄反了。選項 3 說的 $d_{\text{VC}}(\mathcal{H})$ 是照規矩算的那個數，它確實和 $\lambda$ 無關，但它不是 $d_{\text{EFF}}$；兩者只有在 $\lambda = 0$、完全不做正則化時才一樣。選項 4 的 1126 是這門課常拿來當例子的數字（$\mathcal{H}(1126)$ 也是它），沒有任何根據。

## 換別的正則化項：選擇的三個方向、L1 與 L2、λ 取多大

```youtube
url: https://www.youtube.com/watch?v=PeQeKeeGu3A
title: Regularization :: General Regularizers @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–05:18 講選正則化項的三個方向，05:18–09:32 比較 L2 與 L1，09:32–11:43 看最佳的 λ，11:43–12:19 是 Fun Time，之後是總結。）

### 選正則化項的三個方向

到這裡用的都是 $\mathbf{w}^\top\mathbf{w}$。第 18 頁問：要換成更一般的 $\Omega(\mathbf{w})$，有什麼原則？講義開頭寫：want: constraint in the 'direction' of target function。課堂上的說法是，最好的限制當然是直接知道目標函數，但做機器學習就是不知道；退一步，如果有人能告訴你好的假說大概在哪個方向，把範圍縮小到那邊，也很好。

講義列了三種選法：

| 選法 | 意思 | 講義的例子 |
|---|---|---|
| target-dependent | 知道目標函數的某些性質，就把它放進去 | 對稱性正則化項 $\sum_q \llbracket q \text{ is odd} \rrbracket\, w_q^2$ |
| plausible | 選一個說服得了自己的方向：往比較平滑或比較簡單的假說 | 稀疏性（L1）正則化項 $\sum_q \lvert w_q \rvert$ |
| friendly | 好最佳化 | weight-decay（L2）正則化項 $\sum_q w_q^2$ |

**target-dependent。** 課堂上的例子是：如果你認為目標是偶函數或很接近偶函數，就只把奇數次方的係數壓小，偶數次方的係數長大一點沒關係。本文補充為什麼這樣做對：偶函數滿足 $h(x) = h(-x)$，多項式裡偶數次方的項符合這個性質，奇數次方的項會變號，所以偶函數的多項式只有偶數次方的項。

**plausible。** 講義在這一項底下用灰底寫了理由：stochastic/deterministic noise both non-smooth。課堂上把它接回上一堂：正則化是用來對付過擬合的，過擬合來自雜訊，兩種雜訊都是跳來跳去的、不平滑的；目標函數相對於雜訊應該是平滑的，那就多選平滑的假說。L1 會在這一節後半詳細講，課堂上說它在實務上還算蠻有用。

**friendly。** weight decay 就屬於這一類。課堂上說它只是加一個平方項，整個最佳化問題和原來的差不多。

選到不好的正則化項怎麼辦？講義寫：bad? no worries, guard by $\lambda$。課堂上的解釋是，正則化項前面乘了 $\lambda$，只要把 $\lambda = 0$ 也放進候選，最差的情況就是不用它，這是最後一道保護。

頁尾有一個對照，講義問 ringing a bell? 課堂上說[基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)選誤差衡量時有三種可能：使用者告訴我們他要什麼、選一個說服得了自己的、選一個好最佳化的。兩邊是同一套：

| | 三種選法 |
|---|---|
| 誤差衡量（error measure） | user-dependent、plausible、friendly |
| 正則化項（regularizer） | target-dependent、plausible、friendly |

講義把 augmented error 寫成 error $\widehat{\text{err}}$ + regularizer $\Omega$。$E_{\text{aug}}$ 的兩個部分各有三種選法，課堂上說這是設計機器學習演算法時很重要的三個面向。

### L2 與 L1：圓和菱形

第 19 頁把兩種正則化項並排，各配一張幾何圖。

| | L2 正則化項 | L1 正則化項 |
|---|---|---|
| 式子 | $\Omega(\mathbf{w}) = \sum_{q=0}^{Q} w_q^2 = \lVert\mathbf{w}\rVert_2^2$ | $\Omega(\mathbf{w}) = \sum_{q=0}^{Q} \lvert w_q \rvert = \lVert\mathbf{w}\rVert_1$ |
| 凸性 | 凸 | 凸 |
| 可微 | 處處可微 | 不是處處可微 |
| 特點 | 好最佳化 | 解是稀疏的 |
| 限制式的形狀（二維） | 圓 $\mathbf{w}^\top\mathbf{w} = C$ | 菱形 $\lVert\mathbf{w}\rVert_1 = C$ |

左邊的圖和第 9 頁一樣。右邊的圖把紅色的圓換成紅色的菱形，四個頂點在坐標軸上。課堂上說絕對值函數的圖形是尖的，尖點在 $w_q = 0$，那裡不可微，所以 L1 比 L2 難解一些；不過它還是凸的。

右圖的 $\mathbf{w}$ 畫在菱形的一條邊上，不在頂點。判斷它是不是最佳解，用的還是同一個檢查：負梯度和邊界的法向量有沒有平行。圖上紅色的箭頭標著 sign，課堂上說垂直於這條邊的方向就是對 $\mathbf{w}$ 的每個分量取正負號得到的向量。本文舉例：兩個分量都是正的那條邊是 $w_0 + w_1 = C$，上面每一點的正負號都是 $(+, +)$，法向量就是 $(1, 1)$。

差別就在這裡。本文把它講細一點：圓上每個點的法向量都不一樣，$-\nabla E_{\text{in}}$ 不管指向哪裡，圓上總有一個點的法向量和它平行。菱形的一整條邊只有一個法向量，$-\nabla E_{\text{in}}$ 要剛好指向 $(1, 1)$ 那個方向才行，這種事很少發生。課堂上的說法是：在邊上，負梯度常常和法向量不平行，就一直有綠色的分量把 $\mathbf{w}$ 沿著邊拉，拉到頂點才停下來。頂點在坐標軸上，表示有些 $w_q$ 是 0。所以 L1 的最佳解常常發生在頂點上，得到的是稀疏解。

講義的結論是 L1 useful if needing sparse solution。課堂上舉手機當例子：訓練出一個 1126 維的 $\mathbf{w}$，手機每個維度都算完，電也用完了；如果其中只有五個不是 0，手機只要算五項，比較快也比較省電。

### 用同一組資料比較 L1 與 L2

以下是本文自擬的計算，沿用前面的三筆資料。先把 $E_{\text{in}}$ 配方。直接展開：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{3}\Big[(w_0 - w_1 - 1)^2 + (w_0 - 3)^2 + (w_0 + w_1 - 2)^2\Big] = \frac{1}{3}\Big[3w_0^2 + 2w_1^2 - 12w_0 - 2w_1 + 14\Big]
$$

再配成完全平方：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{2} + \frac{1}{3}\Big[3(w_0 - 2)^2 + 2\big(w_1 - \tfrac{1}{2}\big)^2\Big]
$$

這就是那個山谷：谷底在 $\mathbf{w}_{\text{LIN}} = (2, \tfrac{1}{2})$，高度 $\tfrac{1}{2}$，等高線是橢圓。$w_0$ 和 $w_1$ 沒有交叉項，所以加上 L1 正則化項 $\frac{\lambda}{3}(\lvert w_0 \rvert + \lvert w_1 \rvert)$ 之後，兩個係數可以分開最小化。只看 $w_1$ 的部分（乘上 3 不影響最小點）：

$$
2\big(w_1 - \tfrac{1}{2}\big)^2 + \lambda\lvert w_1 \rvert
$$

- 如果最小點在 $w_1 > 0$，那裡 $\lvert w_1 \rvert = w_1$，微分得 $4(w_1 - \tfrac{1}{2}) + \lambda = 0$，$w_1 = \tfrac{1}{2} - \tfrac{\lambda}{4}$。這個答案要是正的才算數，也就是 $\lambda < 2$。
- $\lambda \ge 2$ 時，$w_1 > 0$ 的那一段微分恆正，愈往 0 走愈小；$w_1 < 0$ 的那一段兩項都愈往 0 走愈小。最小點就在 $w_1 = 0$。

$w_0$ 同理：$w_0 = 2 - \tfrac{\lambda}{6}$，要到 $\lambda \ge 12$ 才變成 0。和 L2 的解 $\big(\tfrac{6}{3+\lambda}, \tfrac{1}{2+\lambda}\big)$ 放在一起：

| $\lambda$ | L2 的解 | L1 的解 |
|---|---|---|
| $1$ | $(1.5, 0.333)$ | $(1.833, 0.25)$ |
| $3$ | $(1, 0.2)$ | $(1.5, 0)$ |
| $10$ | $(0.462, 0.083)$ | $(0.333, 0)$ |

L2 把每個係數乘上一個比例，$\lambda$ 再大也只是愈來愈接近 0，不會剛好是 0。L1 把每個係數往 0 移動一段和係數大小無關的距離（這裡 $w_0$ 移 $\tfrac{\lambda}{6}$、$w_1$ 移 $\tfrac{\lambda}{4}$），本來就小的 $w_1$ 很快被移到 0，然後停在那裡。$\lambda = 3$ 時 L1 的解是 $(1.5, 0)$，假說變成水平線 $y = 1.5$，斜率那一項整個不見了，這就是稀疏。本文另外用格點搜尋核對過 $\lambda = 2$ 的 L1 最小點，落在 $(1.67, 0)$，和公式的 $(\tfrac{5}{3}, 0)$ 一致。

### λ 要多大：看雜訊有多少

第 20 頁是兩張實驗圖，橫軸都是 $\lambda$（0 到 2），縱軸是期望的 $E_{\text{out}}$，每條曲線上用圓點標出最低的位置。

| | 三條曲線 | 最低點的位置 |
|---|---|---|
| 左圖 stochastic noise | $\sigma^2 = 0$、$0.25$、$0.5$ | $\sigma^2 = 0$ 在 $\lambda = 0$；$\sigma^2$ 愈大，最低點愈往右 |
| 右圖 deterministic noise | $Q_f = 15$、$30$、$100$ | $Q_f = 15$ 在 $\lambda = 0$；$Q_f$ 愈大，最低點愈往右 |

（照圖目測，$\sigma^2 = 0.25$ 與 $Q_f = 30$ 的最低點都在 $\lambda = 0.5$ 多一點的地方，$\sigma^2 = 0.5$ 與 $Q_f = 100$ 的在 $\lambda = 1$ 出頭；講義沒有列出數字。）

$\sigma^2$ 是隨機雜訊的變異數，$Q_f$ 是目標多項式的次數，兩者都是上一堂的記號。課堂上說明右圖用來學習的是 15 次多項式，所以 $Q_f = 15$ 那條沒有確定性雜訊，$Q_f = 30$ 有一些，$Q_f = 100$ 有很多。

講義的結論有兩條：

- more noise ⟺ more regularization needed。講義接回上一堂的開車比喻：more bumpy road ⟺ putting brakes more，路愈顛簸，煞車踩得愈多。
- noise unknown：雜訊有多少事先不知道，所以要做適當的選擇。

課堂上的說法是，你得在很多個 $\lambda$ 裡挑出最好的那一個，正則化才能發揮效用。怎麼挑留到下一堂，課堂上預告下一堂不只教怎麼選 $\lambda$，也教怎麼選轉換 $\boldsymbol{\Phi}$、怎麼選要用哪一種線性模型。

### Fun Time：每一項的懲罰都不一樣

**題目（第 21 頁）：** 用正則化項 $\Omega(\mathbf{w}) = \sum_{q=0}^{Q} 2^q w_q^2$ 搭配 Legendre 多項式迴歸。這個正則化項偏好哪一種假說？

1. 滿足 $h(x) = h(-x)$ 的對稱多項式
2. 低次的多項式（原文 low-dimensional polynomials）
3. 高次的多項式（原文 high-dimensional polynomials）
4. 沒有特別的偏好

**答案：2。** 講義的解答是：高次項的「懲罰」比較重，所以這個正則化項偏好低次的多項式。

每個 $w_q^2$ 前面的倍數是 $2^q$：$q = 0$ 是 1，$q = 1$ 是 2，$q = 5$ 是 32，$q = 10$ 是 1024。同樣大小的係數，放在 $L_{10}$ 上的代價是放在常數項上的 1024 倍。要讓 $E_{\text{aug}}$ 小，最划算的做法是把高次項的係數壓得很小，選出來的假說就接近低次多項式。課堂上的講法是在高次的地方加上了很重的正則化。

選項 1 對應的是只罰奇數次項的對稱性正則化項；這一題奇數次與偶數次都罰，沒有偏好對稱。選項 3 方向反了。選項 4 不對，因為每一項的倍數不同，如果全部都是 1 才沒有偏好，那就回到 weight decay。本文補充：這題示範了怎麼把偏好寫進 $\Omega$。想要低次、比較簡單的假說，就把高次項的倍數調大；對照講義第 18 頁的分類，往比較簡單的假說走屬於 plausible 那一類。

### 這堂課的四句話

第 22 頁的總結把四節各收成一句：

1. Regularized Hypothesis Set：原本的 $\mathcal{H}$ 加上限制式。
2. Weight Decay Regularization：在 $E_{\text{aug}}$ 裡加上 $\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$。
3. Regularization and VC Theory：正則化讓 $d_{\text{EFF}}$ 變小。
4. General Regularizers：target-dependent、plausible 或 friendly。

下一堂的預告是 choosing from the so-many models/parameters。

## 自我檢查

**1. 兩筆資料：$x_1 = -1$、$y_1 = 0$；$x_2 = 1$、$y_2 = 2$。用 $\mathbf{z} = (1, x)$ 做 weight-decay 線性迴歸，$\lambda = 2$。算出 $\mathbf{w}_{\text{REG}}$、$E_{\text{in}}$ 與 $E_{\text{aug}}$，並和 $\lambda = 0$ 比較。**

答案：$\mathrm{Z}^\top\mathrm{Z} = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$，$\mathrm{Z}^\top\mathbf{y} = (2, 2)$。$\lambda = 0$ 時 $\mathbf{w}_{\text{LIN}} = (1, 1)$，直線 $1 + x$ 穿過兩個點，$E_{\text{in}} = 0$。$\lambda = 2$ 時 $\mathbf{w}_{\text{REG}} = (\tfrac{2}{4}, \tfrac{2}{4}) = (\tfrac{1}{2}, \tfrac{1}{2})$，兩筆的預測是 $0$ 和 $1$，$E_{\text{in}} = \frac{1}{2}(0 + 1) = \frac{1}{2}$；$\mathbf{w}^\top\mathbf{w} = \frac{1}{2}$，$E_{\text{aug}} = \frac{1}{2} + \frac{2}{2} \times \frac{1}{2} = 1$。

**2. 承上題，使用者改給 $C$ 而不是 $\lambda$。$C = \frac{8}{9}$ 對應的 $\lambda$ 是多少？$C = 5$ 呢？**

答案：$\mathbf{w}_{\text{REG}} = \frac{2}{2+\lambda}(1, 1)$，長度平方是 $\frac{8}{(2+\lambda)^2}$。令它等於 $\frac{8}{9}$，得 $(2 + \lambda)^2 = 9$，$\lambda = 1$。$\lVert\mathbf{w}_{\text{LIN}}\rVert^2 = 2$，$C = 5$ 已經把 $\mathbf{w}_{\text{LIN}}$ 包在球裡，限制式沒有作用，$\lambda = 0$。

**3. 有人說：「最小化 augmented error 的時候，任何 w 都可以被選到，所以假說集合還是整個 H，VC 維度還是 d̃ + 1，正則化對泛化沒有幫助。」這段話哪裡說對、哪裡有問題？**

判準：答案要說出前半是對的，$d_{\text{VC}}(\mathcal{H})$ 確實是 $\tilde{d} + 1$；問題在於它只看假說集合、沒看演算法怎麼選。給定 $\lambda$ 之後，選出來的 $\mathbf{w}$ 落在某個 $\mathcal{H}(C)$ 裡，講義用 $d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$ 表示這個實際付出的複雜度，它比 $d_{\text{VC}}(\mathcal{H})$ 小，而且 $\lambda$ 愈大愈小。能補上「講義只給了概念上的定義，沒有給公式」更好。

**4. 只有一個係數 $w$。分別最小化 $(w - 0.3)^2 + w^2$ 與 $(w - 0.3)^2 + \lvert w \rvert$，各得到多少？這說明 L1 與 L2 的什麼差別？**

答案：第一個微分 $2(w - 0.3) + 2w = 0$，$w = 0.15$。第二個在 $w > 0$ 時微分是 $2(w - 0.3) + 1 = 2w + 0.4$，恆為正，所以往 0 走會變小；$w < 0$ 時兩項都隨著往 0 走而變小；最小點是 $w = 0$。L2 把 $0.3$ 縮成一半但不是 0，L1 直接給出 0。

**5. 把 $h(x) = L_3(x) = \frac{1}{2}(5x^3 - 3x)$ 分別用 Legendre 基底與原本的多項式基底表示，weight decay 的 $\sum_q w_q^2$ 各是多少？這和「x 的高次方很小」有什麼關係？**

答案：Legendre 基底下只有 $w_3 = 1$，平方和是 1。原本的基底下 $w_1 = -\frac{3}{2}$、$w_3 = \frac{5}{2}$，平方和是 $\frac{9}{4} + \frac{25}{4} = 8.5$。$x \in [-1, 1]$ 時 $x^3$ 的絕對值不會比 $x$ 的大，中間那一段更是小得多，要湊出同樣大小的函數值，高次項的係數就得比較大，於是被罰得比較重。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把基石第 13、14 堂排在同一週（W7，10/14），這堂的投影片是 [14u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/14u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W7（10/21），2026-09-30 查的時候這一週的投影片連結還是 404，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都把這堂對到 [Learning from Data](http://amlbook.com)（LFD）的 4.2 節。

**作業。** 以下題目都沒有官方解答。[Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) 在 2024-10-21 發布、11-04 截止，[HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) 在 11-04 發布、11-18 截止。

| 作業 | 題號 | 內容 | 對應這堂的哪裡 |
|---|---|---|---|
| HW4 | Q9 | 對輸入加高斯雜訊產生 virtual examples，推導一個矩陣期望值的形式；題目附註點出它和正則化線性迴歸要反轉的矩陣有關 | 上一堂的 data hinting 接到這堂的 $\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}$ |
| HW5 | Q1 | 把 additive smoothing 寫成帶正則化項的估計問題，找出 $\Omega(w_0)$ | 一般的正則化項 |
| HW5 | Q5 | 證明加入特定 virtual examples 的線性迴歸，和加權的 L2 正則化有相同的解 | 閉式解的推導 |
| HW5 | Q6 | 在 $E_{\text{in}}$ 的二階泰勒近似下，求 L2 正則化的解與 $\lambda$、$N$、Hessian、$\mathbf{w}^*$ 的關係 | 平行條件與閉式解 |
| HW5 | Q10 | 用 LIBLINEAR（`-s 6`）在 mnist.scale 的 2 對 6 子問題上跑 L1 正則化的邏輯迴歸，$\lambda$ 依 $E_{\text{in}}$ 選，重複 1126 次，畫 $E_{\text{out}}$ 與非零權重個數的直方圖 | L1 與稀疏解 |
| HW5 | Q13（bonus） | elastic net 的 coordinate descent 閉式更新 | L1 加 L2 |

Q6 可以先拿本文的三筆資料試：線性迴歸的 $E_{\text{in}}$ 本來就是二次函數，泰勒近似沒有誤差。這個例子的 Hessian 是 $\frac{2}{N}\mathrm{Z}^\top\mathrm{Z}$，對角線是 $2$ 和 $\tfrac{4}{3}$，$\mathbf{w}^* = (2, \tfrac{1}{2})$；你推出的式子代進去應該得到 $\big(\tfrac{6}{3+\lambda}, \tfrac{1}{2+\lambda}\big)$。

資料集 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) 與工具 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 都是公開的。Q10 要你自己讀 README，找出 LIBLINEAR 的參數 C 和課堂上的 $\lambda$ 怎麼換算，這一步本身就是練習。沒有官方解答時可以這樣檢查自己：$\lambda$ 依 $E_{\text{in}}$ 選的時候，通常會落在候選中偏小的 $\lambda$，因為正則化愈弱，$E_{\text{in}}$ 愈容易做低（本文的表也是這樣）；如果你的結果一面倒地選最大的 $\lambda$，先檢查換算的方向。Q10 刻意用 $E_{\text{in}}$ 選 $\lambda$，接下來的 Q11、Q12 改用驗證集與 3-fold cross validation，那兩題屬於下一堂。整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**動手做。** 拿手上任何一個線性模型，把 L2 的係數從 0 開始每次乘 100 往上掃，把訓練誤差與驗證誤差畫在同一張圖，看看講義第 11 頁那四張圖的變化會不會在你的資料上重現。

**延伸閱讀。** 同一個主題的其他講法：[Stanford CS229 第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)、[Ridge、Lasso、weight decay 為什麼能讓模型穩一點？](/posts/learning/2026-08-29-im-stat-regularization)。深度學習裡的正則化見 [MIT 6.7960：Regularization](/posts/tech/2026-08-30-mit-67960-regularization)。技法會兩度回到這堂：[技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)把拉格朗日乘數從給定的參數改成要解的未知數，[技法第 5 堂：Kernel 邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)從正則化的角度重新看 SVM。

**下一堂。** [基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)回答這堂留下的問題：雜訊有多少不知道，$\lambda$ 要怎麼選。

## 課程影片來源

原始影片：[Regularized Hypothesis Set](https://www.youtube.com/watch?v=Sno7I5slFUA)、[Weight Decay Regularization](https://www.youtube.com/watch?v=idWnPdW9znM)、[Regularization and VC Theory](https://www.youtube.com/watch?v=15JB2o4VUeY)、[General Regularizers](https://www.youtube.com/watch?v=PeQeKeeGu3A)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [基石第 14 堂講義 14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time 與第 2、9、11、12、19、20 頁的圖都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、14u 投影片與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次與 LFD 章節。
- [Fall 2024 Homework 4（hw4_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)：Q9 的題目內容。
- [Fall 2024 Homework 5（hw5.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)：Q1、Q5、Q6、Q10、Q13 的題目內容。
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 與 [LIBSVM datasets：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)：HW5 Q10 用的工具與資料。
- [Learning from Data 教科書網站](http://amlbook.com)：4.2 節的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
