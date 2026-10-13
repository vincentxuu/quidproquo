---
title: "梯度提升決策樹：把 AdaBoost 看成對誤差函數做梯度下降｜台大林軒田 機器學習技法 第 11 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, decision-trees, gradient-descent]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 28
tldr: "AdaBoost 每一輪的權重總和，剛好是指數誤差 exp(−ys) 的總和。這堂課由此推出：基礎演算法找的 gₜ 是近似的函數梯度方向，票數 αₜ 是那個方向上的最佳步長。把指數誤差換成平方誤差，同一套推導變成「每一輪對殘差 yₙ − sₙ 做迴歸，再用單變數線性迴歸定步長」，基礎模型用砍弱的 C&RT 就是 GBDT。"
description: "台大林軒田機器學習技法第 11 堂 Gradient Boosted Decision Tree 導讀：AdaBoost-DTree 的抽樣與剪枝、AdaBoost 的指數誤差與最速下降推導、gradient boosting 在平方誤差下的殘差擬合、GBDT 演算法與 aggregation 模型總整理，附兩個手算例子。"
draft: false
glossary:
  - term: "指數誤差"
    aliases: ["exponential error", "err_ADA"]
    definition: "exp(−ys)，s 是投票分數、y 是正負一的標籤。它處處不低於 0/1 誤差，而且是凸函數。"
    context: "技法第 11 堂指出 AdaBoost 的權重總和就是所有資料的指數誤差總和，AdaBoost 每一輪都在讓它下降。"
  - term: "gradient boosting"
    aliases: ["GradientBoost", "GBDT", "梯度提升"]
    definition: "把 boosting 看成在函數空間做最速下降：每一輪找一個近似負梯度方向的 gₜ，再用一維搜尋決定步長 αₜ。平方誤差時等於對殘差 yₙ − sₙ 做迴歸。"
    context: "技法第 11 堂由 AdaBoost 的指數誤差推廣到任意誤差函數；基礎模型用砍弱的決策樹就是 GBDT。"
  - term: "殘差"
    aliases: ["residual", "餘數"]
    definition: "yₙ − sₙ，目標值減掉目前已經累積的分數，也就是還沒做到的部分。"
    context: "GBDT 每一輪的基礎演算法拿到的不是原本的 yₙ，而是殘差。林軒田在課堂上把它叫作餘數。"
  - term: "最速下降"
    aliases: ["steepest descent"]
    definition: "方向決定之後，不走固定的一小步，而是直接解出讓誤差在這個方向上降到最低的步長。"
    context: "技法第 11 堂用它解釋 AdaBoost 的 αₜ 與 GBDT 的 αₜ。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/25 到 25/25），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 11 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂是第二種 Combining Predictive Features: Aggregation Models 的最後一堂。上一堂[技法第 10 堂：隨機森林](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest)在同一頁上被收成一行：把隨機化的 C&RT 樹用 bagging 合起來，順便得到自動的驗證與特徵選擇。這堂把外層的 bagging 換成 boosting，然後回頭問一個[技法第 8 堂：AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting)沒回答的問題：AdaBoost 那個看起來像憑空冒出來的票數公式，到底在最佳化什麼。

先備有五項：

- [技法第 8 堂：AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting)：權重 $u_n^{(t)}$ 的更新規則、加權錯誤率 $\epsilon_t$、縮放因子 $\blacklozenge_t$ 與票數 $\alpha_t$。
- [技法第 9 堂：決策樹](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)的 C&RT：用 decision stump 分支、葉子放常數。
- [基石第 10 堂：邏輯迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)裡的梯度下降：用一階泰勒展開找下降方向。
- [基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的公式解。
- [基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)把限制式換成懲罰項的手法，有印象即可。

讀完之後，你應該能自己從 AdaBoost 的權重更新式推到「$g_t$ 是函數梯度方向、$\alpha_t$ 是最佳步長」，再把同一套推導搬到平方誤差上，寫出 GBDT 的三個步驟，並對一組小資料手算幾輪。

整堂課的推導順序：

1. **AdaBoost 配決策樹**：權重改用抽樣表達，樹要砍弱。
2. **權重總和等於指數誤差的總和**：AdaBoost 每一輪都在讓它下降。
3. **固定步長找方向**：泰勒展開之後，最好的方向就是加權錯誤率最低的 $h$。
4. **固定方向找步長**：微分設為 0，解出來正好是 $\alpha_t$。
5. **換成任意誤差函數**：得到 GradientBoost；平方誤差時方向是殘差上的迴歸，步長是單變數線性迴歸。
6. **基礎模型用樹**：GBDT。

## 樹怎麼配 AdaBoost：用抽樣傳遞權重，再把樹砍弱

```youtube
url: https://www.youtube.com/watch?v=aX6ZiIWLjdk
title: Gradient Boosted Decision Tree :: AdaBoost Decision Tree @ Machine Learning Techniques (機器學習技法)
```

（影片 00:18–01:23 複習隨機森林，01:23–07:16 講怎麼讓決策樹吃權重，07:23–11:55 講樹為什麼要弱，11:55–14:11 是高度 1 的極端情況，之後是 Fun Time。）

### 從隨機森林到 AdaBoost-DTree

講義第 2 頁把兩個演算法並排。左邊是上一堂的隨機森林，右邊把外層換成 AdaBoost：

| | RandomForest(D) | AdaBoost-DTree(D) |
|---|---|---|
| 每一輪第 1 步 | 用 bootstrap 從 $\mathcal{D}$ 抽出大小 $N'$ 的 $\tilde{\mathcal{D}}_t$ | 把資料重新加權成 $\mathbf{u}^{(t)}$ |
| 每一輪第 2 步 | $g_t$ = Randomized-DTree($\tilde{\mathcal{D}}_t$) | $g_t$ = DTree($\mathcal{D}, \mathbf{u}^{(t)}$) |
| 每一輪第 3 步 | （沒有） | 算 $g_t$ 的票數 $\alpha_t$ |
| 回傳 | $G$ = Uniform($\{g_t\}$)，一棵一票 | $G$ = LinearHypo($\{(g_t, \alpha_t)\}$)，照票數線性組合 |

右邊第 2 步需要一棵「吃得下權重」的樹，講義在頁尾寫 need: weighted DTree($\mathcal{D}, \mathbf{u}^{(t)}$)。技法第 9 堂的 C&RT 不論在挑分支還是在決定葉子的常數時，都沒有考慮每筆資料的權重。

### 不改演算法，改送進去的資料

第 3 頁先寫出對帶權重的演算法的期待：它應該最小化加權的 $E_{\text{in}}$（可以另外帶正則化），

$$
E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{N}\sum_{n=1}^{N} u_n \cdot \text{err}(y_n, h(\mathbf{x}_n))
$$

課堂上說有兩條路。第一條是把演算法打開，找出每個處理 $E_{\text{in}}$ 的地方，把權重乘進去；例如 SVM 跟 $E_{\text{in}}$ 有關的是 hinge 那一項，把每筆資料的那一項乘上對應的權重就好。決策樹走這條路很麻煩：除了基本步驟，它還有很多作者各自加進去的巧思，要一條一條檢查哪些跟 $E_{\text{in}}$ 有關。

第二條路是把原本的演算法當成黑盒子，完全不動，只在送進去的資料上動手腳。課堂上回頭看權重當初是怎麼來的，說明這為什麼做得到：技法第 8 堂是從 bagging 出發引進權重的，權重記的就是這筆資料被 bootstrap 抽到幾份，權重 3 就是資料裡有 3 份。反過來，手上有一組權重 $\mathbf{u}$ 時，可以照 $u_n$ 的比例抽樣，抽出來的資料裡每筆資料出現的比例就大致等於它的權重占比。講義把這兩件事並排：

| | 權重怎麼表達 | 怎麼取得 $\tilde{\mathcal{D}}_t$ |
|---|---|---|
| Bagging 裡的「加權」演算法 | bootstrap 抽到幾份 | 從 $\mathcal{D}$ 做 bootstrap，取 $N'$ 筆 |
| 一般的隨機化基礎演算法 | 依 $u_n$ 的比例抽樣 | 在 $\mathcal{D}$ 上依 $\propto \mathbf{u}$ 抽樣，取 $N'$ 筆 |

舉個數字（本文自擬）：五筆資料的權重是 $(0.1, 0.1, 0.1, 0.1, 0.4)$，總和 0.8，被抽到的機率就是 $(\frac{1}{8}, \frac{1}{8}, \frac{1}{8}, \frac{1}{8}, \frac{1}{2})$。抽 $N' = 8$ 筆時，前四筆平均各出現 1 次，第五筆平均出現 4 次。沒改過的決策樹看到這 8 筆資料，等於間接知道了第五筆比較重要。

講義的結論是：AdaBoost-DTree 通常是 AdaBoost + 依 $\mathbf{u}^{(t)}$ 的比例抽樣 + DTree($\tilde{\mathcal{D}}_t$)，不修改 DTree。課堂上講得很白：因為我們通常很懶，不想去改決策樹的演算法。

### 完全長大的樹會讓 AdaBoost 變成獨裁

第 4 頁先複習票數公式。$\epsilon_t$ 是 $g_t$ 的加權錯誤率（答錯的權重總和除以全部的權重總和）：

$$
\alpha_t = \ln \blacklozenge_t = \ln\sqrt{\frac{1-\epsilon_t}{\epsilon_t}}
$$

接著是一串推論。如果 $g_t$ 是一棵完全長大的樹，而且用全部的 $\mathbf{x}_n$ 訓練：

1. 只要所有 $\mathbf{x}_n$ 都不一樣，樹可以一刀一刀切到每筆資料各佔一個葉子，$E_{\text{in}}(g_t) = 0$。
2. 沒加權時一筆都沒錯，加權之後當然也是 0：$E_{\text{in}}^{\mathbf{u}}(g_t) = 0$。
3. 所以 $\epsilon_t = 0$。
4. 所以 $\alpha_t = \ln\sqrt{1/0} = \infty$。

一棵樹拿到無限多票，其他樹怎麼投都沒用。講義把這叫 autocracy（獨裁）。課堂上的說法是，這樣就不再是 aggregation，只需要那一棵樹；明明是想像隨機森林那樣把很多棵樹合起來，結果算出來只要一棵。問題出在兩個地方：把所有資料都丟進去，而且真的讓樹切到底。

所以 AdaBoost 需要一棵弱一點的樹，講義寫成 pruned tree trained on some $\mathbf{x}_n$：

- **pruned**：用一般的剪枝，或是直接限制樹的高度。課堂上補充，技法第 9 堂講過的剪枝方式都可以用，但因為 AdaBoost 只要基礎模型做得「大概」就好，大家常用更簡單的做法，限制高度。
- **some**：只用一部分資料。這件事抽樣已經順便做了一半，因為依 $\mathbf{u}^{(t)}$ 抽樣時不見得每筆資料都會被抽到。

這一頁的結論把前一頁補完整：AdaBoost-DTree 通常是 AdaBoost + 依 $\mathbf{u}^{(t)}$ 的比例抽樣 + 剪過枝的 DTree($\tilde{\mathcal{D}}$)。

### 砍到只剩一層：decision stump

最弱的樹是哪一種？第 5 頁問：如果 C&RT 的高度限制在 1 以內呢。這時整棵樹只有一個分支條件，

$$
b(\mathbf{x}) = \underset{\text{decision stumps } h(\mathbf{x})}{\operatorname{argmin}} \ \sum_{c=1}^{2} \lvert \mathcal{D}_c \text{ with } h\rvert \cdot \text{impurity}(\mathcal{D}_c \text{ with } h)
$$

也就是切一刀，讓兩邊按資料量加權的不純度最低。如果不純度用的是二元分類錯誤率，那就是切一刀、左右各回傳 $+1$ 或 $-1$、讓分類錯誤最少，正是技法第 8 堂的 decision stump。所以講義說 AdaBoost-Stump 是 AdaBoost-DTree 的特例。

課堂上多講了一個講義沒寫的實作習慣：樹這麼矮的時候，$\epsilon_t$ 通常不會是 0，而且 decision stump 簡單到可以直接把權重放進演算法，所以搭配 stump 時通常不抽樣，直接用權重；一般的決策樹才用抽樣。

### Fun Time：抽樣資料上全對，票數會是多少

**題目（第 6 頁）：** 用抽樣的方式跑 AdaBoost-DTree，得到一棵決策樹 $g_t$，它在抽樣出來的資料 $\tilde{\mathcal{D}}_t$ 上錯誤是 0。下面哪一種情況可能發生？

1. $\alpha_t < 0$
2. $\alpha_t = 0$
3. $\alpha_t > 0$
4. 以上皆有可能

**答案：4。** 講義的解釋是：$g_t$ 在 $\tilde{\mathcal{D}}_t$ 上全對，不代表它在 $(\mathcal{D}, \mathbf{u}^{(t)})$ 上的加權錯誤是 0，所以 $\epsilon_t$ 可以是任何值，甚至大於等於 $\frac{1}{2}$，這時 $\alpha_t \le 0$。$\alpha_t$ 是用原本的完整資料與權重算的，抽樣資料只用來訓練樹。

本文用剛才那組權重 $(0.1, 0.1, 0.1, 0.1, 0.4)$ 各造一個例子。五筆資料的標籤設為 $(+1, +1, -1, -1, +1)$：

| 抽樣剛好只抽到 | 在抽樣資料上全對的樹 | 在完整資料上答錯的 | $\epsilon_t$ | $\alpha_t$ |
|---|---|---|---|---|
| 第 1、2、5 筆 | 一律回答 $+1$ | 第 3、4 筆，權重 0.2 | $0.2/0.8 = 0.25$ | $\ln\sqrt{3} \approx 0.549$ |
| 第 1 到 4 筆 | 前兩筆 $+1$、其餘 $-1$ | 第 5 筆，權重 0.4 | $0.4/0.8 = 0.5$ | $\ln 1 = 0$ |
| 第 3、4 筆 | 一律回答 $-1$ | 第 1、2、5 筆，權重 0.6 | $0.6/0.8 = 0.75$ | $\ln\sqrt{1/3} \approx -0.549$ |

三種正負號都出現了，所以選項 1、2、3 單獨選都不完整。

## AdaBoost 在最小化什麼：指數誤差上的最速下降

```youtube
url: https://www.youtube.com/watch?v=lKkXrFVcZjs
title: Gradient Boosted Decision Tree :: Optimization of AdaBoost @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–05:00 整理權重的更新式，05:00–09:39 把投票分數接到 margin，09:39–11:43 是指數誤差，11:43–17:58 用梯度下降的方式展開，17:58–21:08 找方向，21:08–26:46 找步長，之後是 Fun Time。）

### 把權重更新寫成一條式子

技法第 8 堂的更新規則分兩行：答錯的資料權重乘上 $\blacklozenge_t$，答對的除以 $\blacklozenge_t$。第 7 頁把它併成一行。二元分類時 $y_n$ 與 $g_t(\mathbf{x}_n)$ 都是 $\pm 1$：答錯時兩者異號，$y_n g_t(\mathbf{x}_n) = -1$；答對時同號，$y_n g_t(\mathbf{x}_n) = +1$。所以

$$
u_n^{(t+1)} = u_n^{(t)} \cdot \blacklozenge_t^{\,-y_n g_t(\mathbf{x}_n)}
$$

答錯時指數是 $+1$，乘上 $\blacklozenge_t$；答對時指數是 $-1$，除以 $\blacklozenge_t$。再用 $\alpha_t = \ln\blacklozenge_t$，也就是 $\blacklozenge_t = \exp(\alpha_t)$：

$$
u_n^{(t+1)} = u_n^{(t)} \cdot \exp\big(-y_n \alpha_t g_t(\mathbf{x}_n)\big)
$$

每一輪都是乘上一個指數。從 $u_n^{(1)} = \frac{1}{N}$ 一路乘到第 $T$ 輪結束，連乘的指數可以搬進同一個 exp 裡變成連加：

$$
u_n^{(T+1)} = u_n^{(1)} \cdot \prod_{t=1}^{T}\exp\big(-y_n\alpha_t g_t(\mathbf{x}_n)\big) = \frac{1}{N}\cdot\exp\Big(-y_n \sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)\Big)
$$

exp 裡面的 $\sum_t \alpha_t g_t(\mathbf{x})$ 似曾相識：AdaBoost 最後回傳的是 $G(\mathbf{x}) = \text{sign}\big(\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})\big)$，取正負號之前的就是這個量。講義把它叫作 $\{g_t\}$ 在 $\mathbf{x}$ 上的投票分數（voting score）。這一頁的結論是

$$
u_n^{(T+1)} \propto \exp\big(-y_n \cdot (\text{voting score on } \mathbf{x}_n)\big)
$$

每筆資料最後的權重，只由它的標籤與它拿到的投票分數決定。

### 投票分數就是還沒正規化的 margin

第 8 頁回到技法第 7 堂的觀點：linear blending 是「線性模型＋把假說當成特徵轉換」。講義原本還列了第三項 constraints，在投影片上被劃掉。課堂上解釋，票數照理不該是負的，要加條件，但之前講過不加也沒關係，負的票數只是把那個 $g_t$ 的意見反過來用。

照這個觀點，把 $g_t(\mathbf{x}_n)$ 看成第 $t$ 個轉換後的特徵 $\phi_t(\mathbf{x}_n)$，把 $\alpha_t$ 看成那個特徵的權重 $w_t$，投票分數就是 $\mathbf{w}^\top\boldsymbol{\phi}(\mathbf{x}_n)$。而 hard-margin SVM 的 margin 是

$$
\text{margin} = \frac{y_n\big(\mathbf{w}^\top\boldsymbol{\phi}(\mathbf{x}_n) + b\big)}{\lVert\mathbf{w}\rVert}
$$

兩相對照，$y_n \cdot (\text{voting score})$ 就是一個有正負號、還沒正規化的 margin（signed & unnormalized margin）。課堂上點出跟 SVM 的兩個差別：沒有除以 $\lVert\mathbf{w}\rVert$，也沒有 $b$；乘上 $y_n$ 則是為了帶進「在正確的一邊還是錯誤的一邊」的資訊。

我們希望這個 margin 是正的（分對了）而且大（離邊界遠）。講義用三行等價關係往下推：

- 希望 $y_n \cdot (\text{voting score})$ 是正的而且大
- 等於希望 $\exp(-y_n \cdot (\text{voting score}))$ 小
- 等於希望 $u_n^{(T+1)}$ 小

最後一步用的就是第 7 頁那個正比關係。於是講義提出這一節的主張：**AdaBoost 會讓 $\sum_{n=1}^{N} u_n^{(t)}$ 隨著輪數下降。** 課堂上的引申是，這表示 AdaBoost 在執行過程中一直想辦法讓每個點的 margin 愈來愈正、愈來愈大，可以達到 large margin 的效果。

### 指數誤差：0/1 誤差的凸上界

把所有資料最後的權重加起來（第 9 頁）：

$$
\sum_{n=1}^{N} u_n^{(T+1)} = \frac{1}{N}\sum_{n=1}^{N}\exp\Big(-y_n\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)\Big)
$$

把線性分數記成 $s = \sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)$，右邊每一項都是 $(s, y)$ 的函數。講義把它跟 0/1 誤差放在一起：

$$
\text{err}_{0/1}(s, y) = [\![\, ys \le 0 \,]\!], \qquad \widehat{\text{err}}_{\text{ADA}}(s, y) = \exp(-ys)
$$

第 9 頁的圖以 $ys$ 為橫軸。黑色的 0/1 誤差是階梯：$ys \le 0$ 時是 1，$ys > 0$ 時是 0。紫色的 $\exp(-ys)$ 是一條往右下降的曲線，通過 $(0, 1)$，整條都不低於階梯，只在 $ys = 0$ 那一點碰在一起。幾個點的值（數字是本文算的）：

| $ys$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| 0/1 誤差 | 1 | 1 | 1 | 0 | 0 |
| $\exp(-ys)$ | 7.39 | 2.72 | 1 | 0.37 | 0.14 |

$ys \le 0$ 時 $\exp(-ys) \ge 1$，$ys > 0$ 時 $\exp(-ys) > 0$，所以它是 0/1 誤差的上界；它也是凸函數。講義把 $\widehat{\text{err}}_{\text{ADA}}$ 稱為指數誤差（exponential error measure），定位是「演算法用的誤差衡量」（algorithmic error measure）：用一個凸的上界來間接把 0/1 誤差做好。課堂上提醒我們已經一再碰到同樣的手法，SVM 的 hinge 誤差、邏輯迴歸縮放後的 cross-entropy 都是 0/1 誤差的上界。

所以「AdaBoost 讓權重總和下降」可以改寫成「AdaBoost 在某種程度上最小化指數誤差」，講義用的詞是 somewhat minimizes。下面兩個小節要證明的就是這句話，而且要說清楚是怎麼最小化的。

### 把函數當成方向

第 10 頁先複習基石第 10 堂的梯度下降。第 $t$ 步站在 $\mathbf{w}_t$，想往某個單位方向 $\mathbf{v}$ 走一小步 $\eta$，用泰勒展開把附近的 $E_{\text{in}}$ 寫成一次式：

$$
\min_{\lVert\mathbf{v}\rVert = 1} E_{\text{in}}(\mathbf{w}_t + \eta\mathbf{v}) \approx \underbrace{E_{\text{in}}(\mathbf{w}_t)}_{\text{known}} + \underbrace{\eta}_{\text{given positive}} \ \mathbf{v}^\top\underbrace{\nabla E_{\text{in}}(\mathbf{w}_t)}_{\text{known}}
$$

課堂上的複習是：在長度的限制下，讓這個一次式最小的方向是負梯度方向，往那裡走一小步 $\eta$，誤差就降一點。

現在照樣造句。AdaBoost 跑到第 $t$ 輪時，手上已經有 $g_1, \dots, g_{t-1}$ 與 $\alpha_1, \dots, \alpha_{t-1}$，這是「現在站的位置」。下一步要加進一個新的 $g_t$ 與 $\alpha_t$；還沒決定之前，先把它們叫作 $h$ 與 $\eta$。$h$ 扮演方向 $\mathbf{v}$ 的角色，只是它是一個函數。

課堂上替學生問了：以前找的方向是向量，現在怎麼變成找函數。回答是函數與向量沒有那麼不同：向量是給它一個索引（第幾格），它回傳那一格的值；函數是給它一個 $\mathbf{x}$，它回傳函數值。差別只在索引的種類，其他做法照舊。

第 $t$ 輪要解的問題是

$$
\min_{h}\ \widehat{E}_{\text{ADA}} = \frac{1}{N}\sum_{n=1}^{N}\exp\Big(-y_n\Big(\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n) + \eta h(\mathbf{x}_n)\Big)\Big)
$$

**第一步：把已知的部分收成權重。** 指數裡的和可以拆成兩個 exp 相乘。前半段 $\frac{1}{N}\exp\big(-y_n\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n)\big)$ 照前面的連乘公式（把 $T$ 換成 $t-1$）正好是 $u_n^{(t)}$：

$$
\widehat{E}_{\text{ADA}} = \sum_{n=1}^{N} u_n^{(t)}\exp\big(-y_n\eta h(\mathbf{x}_n)\big)
$$

**第二步：泰勒展開。** $\eta$ 很小時，在原點附近 $\exp(z) \approx 1 + z$，取 $z = -y_n\eta h(\mathbf{x}_n)$：

$$
\widehat{E}_{\text{ADA}} \approx \sum_{n=1}^{N} u_n^{(t)}\big(1 - y_n\eta h(\mathbf{x}_n)\big) = \sum_{n=1}^{N} u_n^{(t)} - \eta\sum_{n=1}^{N} u_n^{(t)} y_n h(\mathbf{x}_n)
$$

形式跟梯度下降那一行完全對得上：第一項是現在的誤差，是已知的常數；第二項是 $\eta$ 乘上一個跟方向有關的量。$\eta$ 是正的，所以好的 $h$ 要讓

$$
\sum_{n=1}^{N} u_n^{(t)}\big(-y_n h(\mathbf{x}_n)\big)
$$

愈小愈好。

本文補充：梯度下降要限制 $\lVert\mathbf{v}\rVert = 1$，不然方向愈長、一次式的值愈低，沒有最小值。這裡沒有另外加限制，是因為二元分類的 $h$ 只會輸出 $\pm 1$，大小本來就固定。等到「換一個誤差函數」那一節把 $h$ 換成實數輸出，這個問題才會冒出來，講義到時用懲罰項處理。

### 找方向：基礎演算法早就在做了

第 11 頁把上面這個量整理成認得出來的東西。二元分類時 $y_n$ 與 $h(\mathbf{x}_n)$ 都是 $\pm 1$，$-y_n h(\mathbf{x}_n)$ 在答對時是 $-1$、答錯時是 $+1$。把每一項都先抽出一個 $-1$，剩下的就是答對 0、答錯 2：

$$
\sum_{n=1}^{N} u_n^{(t)}\big(-y_n h(\mathbf{x}_n)\big) = -\sum_{n=1}^{N} u_n^{(t)} + \sum_{n=1}^{N} u_n^{(t)}\cdot 2\,[\![\, y_n \ne h(\mathbf{x}_n) \,]\!] = -\sum_{n=1}^{N} u_n^{(t)} + 2E_{\text{in}}^{\mathbf{u}^{(t)}}(h)\cdot N
$$

最後一個等號用的是 $E_{\text{in}}^{\mathbf{u}^{(t)}}(h) = \frac{1}{N}\sum_n u_n^{(t)}[\![\, y_n \ne h(\mathbf{x}_n) \,]\!]$，定義裡有 $\frac{1}{N}$，所以要乘回 $N$。第一項跟 $h$ 無關，於是

> 找好的函數方向 $h$ $\Longleftrightarrow$ 最小化 $E_{\text{in}}^{\mathbf{u}^{(t)}}(h)$

誰在最小化加權的 $E_{\text{in}}^{\mathbf{u}}$？AdaBoost 的基礎演算法 $\mathcal{A}$。技法第 8 堂對它的要求只有一條，拿到權重之後把加權的 0/1 錯誤做低；現在知道它交回來的 $g_t$ 同時是這個近似最佳化問題裡的好方向。課堂上的評語是數學有點神奇。

### 找步長：解出來就是 α

方向定了之後，照梯度下降的做法是走固定的一小步，再找下一個方向。第 12 頁問：既然 $g_t$ 已經固定，何不直接解

$$
\min_{\eta}\ \widehat{E}_{\text{ADA}} = \sum_{n=1}^{N} u_n^{(t)}\exp\big(-y_n\eta g_t(\mathbf{x}_n)\big)
$$

課堂上給的動機是：這個方向是靠另一個演算法算出來的，算一次不便宜，值得走大步一點。講義說這樣解出的 $\eta_t$ 比固定的小 $\eta$ 來得 greedily faster，這種做法在最佳化裡叫最速下降（steepest descent）。課堂上解釋 greedily 的意思：只保證這一輪看起來比較快，長期是不是比較快並沒有保證。

注意這一步不需要泰勒展開，$g_t$ 固定之後可以直接算。加總裡只有兩種項：

- 答對（$y_n = g_t(\mathbf{x}_n)$）：$u_n^{(t)}\exp(-\eta)$
- 答錯（$y_n \ne g_t(\mathbf{x}_n)$）：$u_n^{(t)}\exp(+\eta)$

答錯的權重總和是 $\epsilon_t\sum_n u_n^{(t)}$，答對的是 $(1-\epsilon_t)\sum_n u_n^{(t)}$，這就是 $\epsilon_t$ 的定義。把全部的權重總和提出來：

$$
\widehat{E}_{\text{ADA}} = \Big(\sum_{n=1}^{N} u_n^{(t)}\Big)\cdot\big((1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)
$$

這是 $\eta$ 的單變數可微函數。對 $\eta$ 微分，設為 0：

$$
\frac{\partial\widehat{E}_{\text{ADA}}}{\partial\eta} = \Big(\sum_{n=1}^{N} u_n^{(t)}\Big)\cdot\big(-(1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big) = 0
$$

權重總和是正的，所以括號要是 0：$\epsilon_t\exp(\eta) = (1-\epsilon_t)\exp(-\eta)$。兩邊同乘 $\exp(\eta)$ 再除以 $\epsilon_t$，得 $\exp(2\eta) = \frac{1-\epsilon_t}{\epsilon_t}$，取對數除以 2：

$$
\eta_t = \frac{1}{2}\ln\frac{1-\epsilon_t}{\epsilon_t} = \ln\sqrt{\frac{1-\epsilon_t}{\epsilon_t}} = \alpha_t
$$

本文補充：二階微分是 $\big(\sum_n u_n^{(t)}\big)\big((1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(\eta)\big) > 0$，所以這個點是最小值。

技法第 8 堂把 $\alpha_t$ 解釋成「$g_t$ 表現愈好，票愈多」；課堂上說，現在看到它其實是偷偷在做某個最佳化。講義用一句話總結整節：AdaBoost 是 steepest descent with approximate functional gradient。functional gradient 指的是在函數的世界裡做類似梯度下降的事；approximate 是因為找方向時用了泰勒展開的近似。

本文再補一步，把講義的主張算成數字。把 $\eta = \alpha_t$ 代回去，$\exp(-\alpha_t) = \sqrt{\epsilon_t/(1-\epsilon_t)}$、$\exp(\alpha_t) = \sqrt{(1-\epsilon_t)/\epsilon_t}$，兩項各等於 $\sqrt{\epsilon_t(1-\epsilon_t)}$：

$$
\sum_{n=1}^{N} u_n^{(t+1)} = \Big(\sum_{n=1}^{N} u_n^{(t)}\Big)\cdot 2\sqrt{\epsilon_t(1-\epsilon_t)}
$$

左邊能寫成下一輪的權重總和，是因為把 $\eta = \alpha_t$ 代進 $u_n^{(t)}\exp(-y_n\eta g_t(\mathbf{x}_n))$ 就是 $u_n^{(t+1)}$。$2\sqrt{\epsilon_t(1-\epsilon_t)}$ 在 $\epsilon_t = \frac{1}{2}$ 時等於 1，其他時候都小於 1。所以只要基礎演算法每一輪都比亂猜好一點，權重總和（也就是指數誤差）每一輪都確實下降，這就是第 8 頁那個主張的精確版本。

### 數值例子：五個點跑三輪 AdaBoost-Stump

以下是本文自擬的例子，不在講義上，用來把這一節的每個式子都算出數字。資料是一維的五個點：

| $n$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $x_n$ | 1 | 2 | 3 | 4 | 5 |
| $y_n$ | $+1$ | $+1$ | $-1$ | $-1$ | $+1$ |

基礎演算法是 decision stump：選一個門檻與方向，讓加權錯誤率最低（也允許整條線都回答同一個符號）。起始權重 $u_n^{(1)} = \frac{1}{5}$，總和 $U_1 = 1$。

**第 1 輪。** 最好的 stump 是 $g_1(x) = \text{sign}(2.5 - x)$，輸出 $(+,+,-,-,-)$，只錯第 5 筆。$\epsilon_1 = 0.2$，$\blacklozenge_1 = \sqrt{0.8/0.2} = 2$，$\alpha_1 = \ln 2 \approx 0.693$。

先看「找步長」那個函數。這一輪 $\widehat{E}_{\text{ADA}}(\eta) = 0.8\exp(-\eta) + 0.2\exp(\eta)$：

| $\eta$ | $\widehat{E}_{\text{ADA}}(\eta)$ | 說明 |
|---|---|---|
| $0$ | $1$ | 還沒走，等於 $U_1$ |
| $0.1$ | $0.9449$ | 固定的一小步；泰勒近似給 $1 - 0.1\times 0.6 = 0.94$ |
| $\ln 2 \approx 0.693$ | $0.4 + 0.4 = 0.8$ | 最速下降的步長 |
| $2\ln 2 \approx 1.386$ | $0.2 + 0.8 = 1$ | 走過頭，回到原來的高度 |

泰勒近似那一格的 $0.6$ 是 $\sum_n u_n^{(1)} y_n g_1(x_n) = 0.8 - 0.2$。最低點在 $\eta = \alpha_1$，值是 $0.8 = 1 \times 2\sqrt{0.2\times 0.8}$，跟公式一致。更新權重：答錯的第 5 筆 $0.2\times 2 = 0.4$，其他四筆 $0.2/2 = 0.1$，總和 $U_2 = 0.8$。

**第 2 輪。** 權重是 $(0.1, 0.1, 0.1, 0.1, 0.4)$。上一輪的 $g_1$ 現在的加權錯誤率是 $0.4/0.8 = 0.5$，等於亂猜，這是技法第 8 堂講過的設計。這一輪有兩個 stump 並列最好：$\text{sign}(x - 4.5)$ 錯第 1、2 筆，整條線都回答 $+1$ 的那個錯第 3、4 筆，答錯的權重都是 $0.2$，其他切法都更差。這裡取 $g_2(x) = \text{sign}(x - 4.5)$，輸出 $(-,-,-,-,+)$（選另一個的話後面的數字會不同，但權重總和等於指數誤差的平均、每一輪照 $2\sqrt{\epsilon_t(1-\epsilon_t)}$ 的比例下降，這兩件事照樣成立）。$\epsilon_2 = 0.2/0.8 = 0.25$，$\blacklozenge_2 = \sqrt{3}$，$\alpha_2 = \ln\sqrt{3} \approx 0.549$。新權重：第 1、2 筆 $0.1\sqrt{3} \approx 0.173$，第 3、4 筆 $0.1/\sqrt{3} \approx 0.058$，第 5 筆 $0.4/\sqrt{3} \approx 0.231$。總和 $U_3 \approx 0.693 = 0.8\times 2\sqrt{0.25\times 0.75}$。

**第 3 輪。** 最好的 stump 是整條線都回答 $+1$ 的 $g_3$，錯第 3、4 筆。$\epsilon_3 = 0.115/0.693 = \frac{1}{6}$，$\blacklozenge_3 = \sqrt{5}$，$\alpha_3 = \ln\sqrt{5} \approx 0.805$。總和 $U_4 \approx 0.516 = 0.693\times 2\sqrt{\frac{1}{6}\times\frac{5}{6}}$。

三輪下來，每筆資料的投票分數 $s_n = \sum_t \alpha_t g_t(x_n)$：

| $n$ | $s_n$（第 1 輪後） | $s_n$（第 2 輪後） | $s_n$（第 3 輪後） | 第 3 輪後的 $y_n s_n$ |
|---|---|---|---|---|
| 1、2 | $0.693$ | $0.144$ | $0.949$ | $0.949$ |
| 3、4 | $-0.693$ | $-1.242$ | $-0.438$ | $0.438$ |
| 5 | $-0.693$ | $-0.144$ | $0.661$ | $0.661$ |

| | 起始 | 第 1 輪後 | 第 2 輪後 | 第 3 輪後 |
|---|---|---|---|---|
| 權重總和 $U_{t+1}$ | $1$ | $0.8$ | $0.693$ | $0.516$ |
| $\frac{1}{N}\sum_n\exp(-y_n s_n)$ | $1$ | $0.8$ | $0.693$ | $0.516$ |
| $E_{\text{in}}(G)$（0/1） | 還沒有 $G$ | $0.2$ | $0.2$ | $0$ |

**這個結果代表什麼。** 第二列與第一列完全相同，這就是第 9 頁那條等式：權重總和就是指數誤差的平均。它每一輪都下降，下降的比例是 $2\sqrt{\epsilon_t(1-\epsilon_t)}$，分別是 $0.8$、$0.866$、$0.745$。0/1 誤差一直被壓在指數誤差下面；第 2 輪它沒有動（仍然錯第 5 筆），指數誤差卻照樣下降，因為 AdaBoost 最佳化的對象是上界。第 3 輪之後五筆的 $y_n s_n$ 全部是正的，三個各自都會犯錯的 stump 合起來把資料全部分對。

### Fun Time：對 η 微分

**題目（第 13 頁）：** 已知 $\widehat{E}_{\text{ADA}} = \big(\sum_{n=1}^{N} u_n^{(t)}\big)\cdot\big((1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)$，下面哪一個是可以用來解最佳 $\eta_t$ 的 $\frac{\partial\widehat{E}_{\text{ADA}}}{\partial\eta}$？四個選項的前半都是 $\big(\sum_{n=1}^{N} u_n^{(t)}\big)$，差別在後面的括號：

1. $\big(+(1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)$
2. $\big(+(1-\epsilon_t)\exp(-\eta) - \epsilon_t\exp(+\eta)\big)$
3. $\big(-(1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)$
4. $\big(-(1-\epsilon_t)\exp(-\eta) - \epsilon_t\exp(+\eta)\big)$

**答案：3。** $\exp(-\eta)$ 對 $\eta$ 微分多出一個 $-1$，$\exp(+\eta)$ 微分多出一個 $+1$，其他係數都不變。課堂上講的也是這兩句。

其他選項錯在哪：選項 1 跟原式一模一樣，等於沒微分（它其實是二階微分）。選項 4 把兩項都當成會多出負號。選項 2 是正確答案整個乘上 $-1$；設它等於 0 會解出同一個 $\eta_t$，但它不是題目問的偏微分。用例子的第 1 輪驗算：$\epsilon_1 = 0.2$、$\eta = \ln 2$ 時，選項 3 的括號是 $-0.8\times\frac{1}{2} + 0.2\times 2 = 0$，正好是最低點。

## 換一個誤差函數：平方誤差下，每一輪都在擬合殘差

```youtube
url: https://www.youtube.com/watch?v=F_EuNXhS9js
title: Gradient Boosted Decision Tree :: Gradient Boosting @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:45 從 AdaBoost 推廣到 GradientBoost，02:45–07:24 是平方誤差下的泰勒展開，07:24–12:09 加懲罰項、得到殘差，12:09–15:00 決定步長，15:00–17:45 組成 GBDT，之後是 Fun Time。）

### 從 AdaBoost 到 GradientBoost

最佳化觀點的結論可以寫成一個兩層的最佳化問題（第 14 頁）：

$$
\text{AdaBoost：}\quad \min_{\eta}\min_{h}\ \frac{1}{N}\sum_{n=1}^{N}\exp\Big(-y_n\Big(\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n) + \eta h(\mathbf{x}_n)\Big)\Big)
$$

其中 $h$ 是二元輸出的假說。既然每一輪做的事是「先對 $h$ 最佳化、再對 $\eta$ 最佳化」，把 exp 換成別的誤差函數也可以照做：

$$
\text{GradientBoost：}\quad \min_{\eta}\min_{h}\ \frac{1}{N}\sum_{n=1}^{N}\text{err}\Big(\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n) + \eta h(\mathbf{x}_n),\ y_n\Big)
$$

這裡的 $h$ 可以是任何假說，講義註明通常是實數輸出的。講義的定位是：GradientBoost 讓同一個架構延伸到不同的 err，用來做迴歸、軟性分類等問題。課堂上舉的例子是，在意邏輯迴歸那種問題就用 cross-entropy，做迴歸就用平方誤差；另外提醒，因為用的是梯度下降這一類方法，誤差函數要夠平滑。

這堂課只推迴歸的版本。

### 平方誤差下的泰勒展開

第 15 頁取 $\text{err}(s, y) = (s - y)^2$，並把目前累積的分數記成

$$
s_n = \sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n)
$$

課堂上說明，現在做的是迴歸，$s_n$ 不見得還能叫投票分數，它就是前面幾輪加權累積出來的數值。每筆資料從 $s_n$ 出發，移動 $\eta h(\mathbf{x}_n)$。對 err 的第一個引數在 $s_n$ 附近做一階泰勒展開：

$$
\text{err}\big(s_n + \eta h(\mathbf{x}_n), y_n\big) \approx \text{err}(s_n, y_n) + \eta h(\mathbf{x}_n)\cdot\frac{\partial\,\text{err}(s, y_n)}{\partial s}\bigg|_{s = s_n}
$$

課堂上強調 $s$ 是變數、$s_n$ 是已經算出來的數字，偏微分做完才把 $s_n$ 代進去。$(s - y_n)^2$ 對 $s$ 微分是 $2(s - y_n)$，代入 $s = s_n$ 得 $2(s_n - y_n)$。第一項跟 $h$ 無關，是常數：

$$
\min_{h}\ \frac{1}{N}\sum_{n=1}^{N}\text{err}\big(s_n + \eta h(\mathbf{x}_n), y_n\big) \approx \min_{h}\ \text{constants} + \frac{\eta}{N}\sum_{n=1}^{N} h(\mathbf{x}_n)\cdot 2(s_n - y_n)
$$

要讓後面那一項愈小愈好。課堂上帶著學生想：$s_n - y_n$ 是正的就給負的 $h(\mathbf{x}_n)$，是負的就給正的，乘起來永遠是負的；那大小呢，100 比 1 好，1000 比 100 好，愈大愈好。於是講義在頁尾寫出這個沒有意義的解：如果對 $h$ 沒有任何限制，

$$
h(\mathbf{x}_n) = -\infty\cdot(s_n - y_n)
$$

本文補充：平方誤差其實可以直接展開，$(s_n + \eta h - y_n)^2 = (s_n - y_n)^2 + 2\eta h(s_n - y_n) + \eta^2 h^2$。一階泰勒展開丟掉的正是最後那個 $\eta^2 h^2$，而它本來會阻止 $h$ 無限變大。講義接下來加的懲罰項，做的是類似的事。

### 加上懲罰項：方向是殘差上的迴歸

第 16 頁處理這個跑到無限大的問題。第一個觀察：$h$ 的大小不重要，因為 $\eta$ 接下來會再最佳化，步長由它負責。梯度下降當時是限制 $\lVert\mathbf{v}\rVert = 1$；課堂上說這裡也可以限制 $h$ 的長度，但那樣要解有限制式的最佳化問題，比較討厭。改用[基石第 14 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)做正則化時的手法：把限制換成一個懲罰項，丟進要最小化的式子裡。$h$ 愈大，懲罰愈重：

$$
\min_{h}\ \text{constants} + \frac{\eta}{N}\sum_{n=1}^{N}\Big(2h(\mathbf{x}_n)(s_n - y_n) + \big(h(\mathbf{x}_n)\big)^2\Big)
$$

選 $h^2$ 當懲罰是為了配方。一個平方項加上「兩倍的 $h$ 乘上某個量」，可以湊成完全平方：

$$
2h(\mathbf{x}_n)(s_n - y_n) + \big(h(\mathbf{x}_n)\big)^2 = \big(h(\mathbf{x}_n) + (s_n - y_n)\big)^2 - (s_n - y_n)^2 = \big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2 - (y_n - s_n)^2
$$

最後減掉的 $(y_n - s_n)^2$ 只跟目前的分數與標籤有關，是常數。所以問題變成

$$
\min_{h}\ \text{constants} + \frac{\eta}{N}\sum_{n=1}^{N}\Big(\text{constant} + \big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2\Big)
$$

跟 $h$ 有關的只剩 $\sum_n\big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2$：要 $h(\mathbf{x}_n)$ 在平方誤差的意義下盡量接近 $y_n - s_n$。這就是一個迴歸問題，資料是 $\{(\mathbf{x}_n,\ y_n - s_n)\}$。

$y_n - s_n$ 是目標值減掉目前做到的分數，講義叫它 residual（殘差）。課堂上用的中文是「餘數」，比喻是：想要 100 分，現在做到 90 分，還差 10 分沒做到。講義的結論：

> GradientBoost for regression: find $g_t = h$ by regression with residuals

課堂上拿 AdaBoost 對照：AdaBoost 每一輪交給基礎演算法的是一組新的權重，GradientBoost 做迴歸時交給基礎演算法的是一組新的目標值（殘差）。

本文補充：殘差與梯度的關係很直接，$y_n - s_n = -\frac{1}{2}\cdot\frac{\partial\,\text{err}}{\partial s}\big|_{s = s_n}$。對殘差做迴歸，就是找一個在每個 $\mathbf{x}_n$ 上都盡量貼近負梯度的函數，名字裡的 gradient 是這樣來的。

### 步長是單變數線性迴歸

找到 $g_t = h$ 之後，第 17 頁把它固定，只對 $\eta$ 最佳化（投影片上的 $\min_h$ 被劃掉了）：

$$
\min_{\eta}\ \frac{1}{N}\sum_{n=1}^{N}\big(s_n + \eta g_t(\mathbf{x}_n) - y_n\big)^2 = \frac{1}{N}\sum_{n=1}^{N}\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big)^2
$$

等號只是把括號裡每一項變號，平方不受影響。右邊的形式很眼熟：$y_n - s_n$ 又是殘差，$g_t(\mathbf{x}_n)$ 是已知的數，要找一個係數 $\eta$ 讓 $\eta g_t(\mathbf{x}_n)$ 貼近殘差。這是只有一個變數的線性迴歸，輸入是用 $g_t$ 轉換過的 $g_t(\mathbf{x}_n)$，輸出是殘差。課堂上特別說明這裡沒有 $x_0$ 那個常數項，真的只有一個變數；它跟上一步的迴歸也不同，上一步要靠基礎演算法 $\mathcal{A}$ 來解，這一步有公式解。

公式自己推一次。對 $\eta$ 微分設為 0：

$$
\frac{d}{d\eta}\sum_{n=1}^{N}\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big)^2 = -2\sum_{n=1}^{N} g_t(\mathbf{x}_n)\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big) = 0
$$

展開後 $\sum_n g_t(\mathbf{x}_n)(y_n - s_n) = \eta\sum_n g_t^2(\mathbf{x}_n)$，所以

$$
\alpha_t = \eta_{\text{opt}} = \frac{\sum_{n=1}^{N} g_t(\mathbf{x}_n)(y_n - s_n)}{\sum_{n=1}^{N} g_t^2(\mathbf{x}_n)}
$$

講義的結論是：GradientBoost for regression 的 $\alpha_t$ 就是 optimal $\eta$，由 $g_t$ 轉換後的線性迴歸算出來。

### 組起來：GBDT

第 18 頁把兩個步驟放進迴圈，就是 Gradient Boosted Decision Tree（GBDT）：

1. 起始：$s_1 = s_2 = \dots = s_N = 0$。
2. 對 $t = 1, 2, \dots, T$：
   1. 用迴歸演算法 $\mathcal{A}$（最小化平方誤差）在 $\{(\mathbf{x}_n,\ y_n - s_n)\}$ 上學出 $g_t$。講義在這裡問：用抽樣加剪枝的 C&RT 如何？
   2. 算 $\alpha_t = \text{OneVarLinearRegression}\big(\{(g_t(\mathbf{x}_n),\ y_n - s_n)\}\big)$。
   3. 更新 $s_n \leftarrow s_n + \alpha_t g_t(\mathbf{x}_n)$。
3. 回傳 $G(\mathbf{x}) = \sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})$。

幾個細節都來自課堂上的說明。名字裡的 Decision Tree 來自第一個步驟：決策樹可以做迴歸，所以最常拿它當基礎演算法。回傳的 $G$ 沒有取 sign，因為做的是迴歸。起始分數是 0，所以第 1 輪的殘差就是 $y_n$ 本身，解的是原始的迴歸問題；第 2 輪開始才是在殘差上學。

講義稱 GBDT 是 AdaBoost-DTree 的 regression sibling（迴歸版的手足），實務上很受歡迎。課堂上補充，換一套推導也可以做出邏輯迴歸等問題的版本，這堂只示範迴歸；應用方面舉的例子是資訊檢索，例如網頁排序。

把兩個演算法每一輪做的事並排（這張表是本文整理的，各列的內容都出自前面的推導）：

| | AdaBoost | GradientBoost（平方誤差） |
|---|---|---|
| 誤差函數 | $\exp(-ys)$ | $(s - y)^2$ |
| 交給基礎演算法的 | 原本的 $y_n$，加上新的權重 $u_n^{(t)}$ | 新的目標值 $y_n - s_n$ |
| 基礎演算法解什麼 | 加權的二元分類 | 平方誤差迴歸 |
| 步長 $\alpha_t$ | $\ln\sqrt{(1-\epsilon_t)/\epsilon_t}$ | $\sum_n g_t(\mathbf{x}_n)(y_n - s_n)\,/\,\sum_n g_t^2(\mathbf{x}_n)$ |
| 回傳 | $\text{sign}\big(\sum_t\alpha_t g_t(\mathbf{x})\big)$ | $\sum_t\alpha_t g_t(\mathbf{x})$ |

### 數值例子：四個點跑三輪 GBDT

以下是本文自擬的例子，不在講義上。四筆一維資料：

| $n$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| $x_n$ | 1 | 2 | 3 | 4 |
| $y_n$ | 1 | 3 | 2 | 6 |

基礎演算法用高度 1 的 C&RT 迴歸樹：在相鄰兩點的中間切一刀，兩邊各回傳該邊殘差的平均，挑兩邊平方誤差總和最小的切法。為了讓過程看得清楚，前三輪先不抽樣，用全部四筆資料。

**第 1 輪。** $s_n = 0$，殘差就是 $y = (1, 3, 2, 6)$。三種切法：

| 切在 | 左邊平均 | 右邊平均 | 平方誤差總和 |
|---|---|---|---|
| 1.5 | $1$ | $\frac{11}{3}$ | $\frac{26}{3} \approx 8.67$ |
| 2.5 | $2$ | $4$ | $10$ |
| 3.5 | $2$ | $6$ | $2$ |

選 3.5：$g_1(x) = 2$（$x < 3.5$）或 $6$（$x > 3.5$），在四個點上是 $(2, 2, 2, 6)$。步長

$$
\alpha_1 = \frac{2\times 1 + 2\times 3 + 2\times 2 + 6\times 6}{2^2 + 2^2 + 2^2 + 6^2} = \frac{48}{48} = 1
$$

更新 $s = (2, 2, 2, 6)$，新的殘差是 $(-1, 1, 0, 0)$。

**第 2 輪。** 在殘差 $(-1, 1, 0, 0)$ 上重做一次。切在 1.5 時左邊平均 $-1$、右邊平均 $\frac{1}{3}$，平方誤差總和 $\frac{2}{3}$；另外兩種切法都是 2。所以 $g_2 = (-1, \frac{1}{3}, \frac{1}{3}, \frac{1}{3})$，

$$
\alpha_2 = \frac{(-1)(-1) + \frac{1}{3}\times 1 + 0 + 0}{1 + 3\times\frac{1}{9}} = \frac{4/3}{4/3} = 1
$$

更新 $s = (1, \frac{7}{3}, \frac{7}{3}, \frac{19}{3})$，殘差 $(0, \frac{2}{3}, -\frac{1}{3}, -\frac{1}{3})$。

**第 3 輪。** 切在 2.5 最好（平方誤差總和 $\frac{2}{9}$，另外兩種是 $\frac{2}{3}$ 與 $\frac{14}{27}$）：$g_3 = (\frac{1}{3}, \frac{1}{3}, -\frac{1}{3}, -\frac{1}{3})$，$\alpha_3 = 1$。更新 $s = (\frac{4}{3}, \frac{8}{3}, 2, 6)$，殘差 $(-\frac{1}{3}, \frac{1}{3}, 0, 0)$。

| | 起始 | 第 1 輪後 | 第 2 輪後 | 第 3 輪後 |
|---|---|---|---|---|
| $s_n$ | $(0, 0, 0, 0)$ | $(2, 2, 2, 6)$ | $(1, \frac{7}{3}, \frac{7}{3}, \frac{19}{3})$ | $(\frac{4}{3}, \frac{8}{3}, 2, 6)$ |
| 殘差 $y_n - s_n$ | $(1, 3, 2, 6)$ | $(-1, 1, 0, 0)$ | $(0, \frac{2}{3}, -\frac{1}{3}, -\frac{1}{3})$ | $(-\frac{1}{3}, \frac{1}{3}, 0, 0)$ |
| 平方誤差的平均 | $12.5$ | $0.5$ | $\frac{1}{6} \approx 0.167$ | $\frac{1}{18} \approx 0.056$ |

**這個結果代表什麼。** 每一輪的樹都只切一刀，單獨看都很弱；三棵加起來，$G(x) = g_1(x) + g_2(x) + g_3(x)$ 是一個有四段的階梯函數，在四個點上的值是 $(\frac{4}{3}, \frac{8}{3}, 2, 6)$，離目標 $(1, 3, 2, 6)$ 已經很近。每一輪的樹看到的目標都不一樣：第 1 輪看到原始的 $y$，之後看到的是前面還沒做到的部分，所以三棵樹切在三個不同的位置。平方誤差的平均從 12.5 一路降到 0.056。

三輪的 $\alpha_t$ 都剛好是 1，這有原因（本文補充）。迴歸樹的每個葉子回傳的是落在該葉子的殘差平均。設某個葉子裡有 $m$ 筆資料、殘差平均是 $c$，那一葉對分子的貢獻是 $c\times(\text{sum of residuals}) = c\times mc$，對分母的貢獻是 $m\times c^2$，兩者相等。每個葉子都這樣，所以分子等於分母。只要樹是在同一份資料上訓練、葉子用平均，而且 $g_t$ 的輸出不全是 0，$\alpha_t$ 就一定是 1。

那第二個步驟什麼時候有用？講義建議的是「抽樣加剪枝」的 C&RT。樹只看到抽樣出來的資料時，$\alpha_t$ 是在全部資料上重新算的，就不一定是 1。把第 1 輪改成：樹只用抽到的第 1、3、4 筆（$y$ 值 $1, 2, 6$）訓練。切在 3.5 最好，左邊平均 $\frac{3}{2}$、右邊 $6$，在四個點上 $g_1 = (\frac{3}{2}, \frac{3}{2}, \frac{3}{2}, 6)$。

$$
\alpha_1 = \frac{\frac{3}{2}(1 + 3 + 2) + 6\times 6}{3\times\frac{9}{4} + 36} = \frac{45}{42.75} = \frac{20}{19} \approx 1.053
$$

用 $\alpha_1 = \frac{20}{19}$ 時，四筆資料的平方誤差平均是 $\frac{25}{38} \approx 0.658$；直接用 1 的話是 $\frac{11}{16} = 0.6875$。樹沒看到第 2 筆的 $y = 3$，左邊的葉子估得偏低，單變數線性迴歸用全部資料把整棵樹的輸出稍微放大，補回一點。

下面這段純 Python 會印出前三輪的門檻、兩個葉子的值、$\alpha_t$ 與平方誤差的平均，可以拿來對照上面的表：

```python
from fractions import Fraction as F

x = [1, 2, 3, 4]
y = [F(1), F(3), F(2), F(6)]

def stump(xs, rs):
    """高度 1 的迴歸樹：回傳 (門檻, 左葉平均, 右葉平均)"""
    best = None
    for i in range(len(xs) - 1):
        th = F(xs[i] + xs[i + 1], 2)
        left = [r for a, r in zip(xs, rs) if a < th]
        right = [r for a, r in zip(xs, rs) if a > th]
        ml, mr = sum(left) / len(left), sum(right) / len(right)
        sse = sum((r - ml) ** 2 for r in left) + sum((r - mr) ** 2 for r in right)
        if best is None or sse < best[0]:
            best = (sse, th, ml, mr)
    return best[1:]

s = [F(0)] * 4
for t in range(1, 4):
    res = [yn - sn for yn, sn in zip(y, s)]            # 殘差
    th, ml, mr = stump(x, res)                         # 步驟 1：對殘差做迴歸
    g = [ml if a < th else mr for a in x]
    alpha = sum(gn * rn for gn, rn in zip(g, res)) / sum(gn * gn for gn in g)  # 步驟 2
    s = [sn + alpha * gn for sn, gn in zip(s, g)]      # 步驟 3
    mse = sum((yn - sn) ** 2 for yn, sn in zip(y, s)) / 4
    print(t, th, ml, mr, alpha, mse)
```

輸出是三行：`1 7/2 2 6 1 1/2`、`2 3/2 -1 1/3 1 1/6`、`3 5/2 1/3 -1/3 1 1/18`。

### Fun Time：最佳步長的公式

**題目（第 19 頁）：** 下面哪一個是 $\min_{\eta}\frac{1}{N}\sum_{n=1}^{N}\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big)^2$ 的最佳 $\eta$？記 $A = \sum_{n=1}^{N} g_t(\mathbf{x}_n)(y_n - s_n)$、$B = \sum_{n=1}^{N} g_t^2(\mathbf{x}_n)$（這兩個代號是本文為了排版加的）：

1. $A \cdot B$
2. $A\,/\,B$
3. $A + B$
4. $A - B$

**答案：2。** 講義只寫「基石第 9 堂推導過」。基石第 9 堂的線性迴歸公式解是 $\mathbf{w} = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathbf{y}$。這裡只有一個變數，$\mathrm{X}$ 是一個 $N\times 1$ 的直行，裝著 $g_t(\mathbf{x}_n)$；$\mathbf{y}$ 換成殘差。於是 $\mathrm{X}^\top\mathrm{X} = B$、$\mathrm{X}^\top\mathbf{y} = A$，$\eta = A/B$。前面「步長是單變數線性迴歸」那一小節直接微分，得到的是同一個式子。

其他選項可以用一個簡單的檢查排除：如果 $g_t$ 剛好等於殘差，最佳的 $\eta$ 顯然是 1。這時 $A = B$，四個選項分別給出 $B^2$、$1$、$2B$、$0$，只有選項 2 對。例子的第 1 輪也是驗算：$A = 48$、$B = 48$，$\eta = 1$。

## aggregation 模型的總整理：誰讓模型變強，誰讓模型變穩

```youtube
url: https://www.youtube.com/watch?v=JqSLmlSpqNo
title: Gradient Boosted Decision Tree :: Summary of Aggregation @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:08 整理 blending，02:08–05:00 整理邊學邊合的模型，05:00–06:00 是 aggregation 的 aggregation，06:00–08:42 談兩種療效，08:42–09:21 是 Fun Time，之後是整堂的總結。）

技法第 7 堂到這堂，五堂課講了一整族模型。第 20 到 23 頁把它們收成三張地圖與一個結論。

### 先有 g 再合：blending

第 20 頁的定義是 aggregate **after** getting diverse $g_t$。課堂上的比喻是把已經有的 $g_t$ 丟進果汁機打成綜合果汁。三種做法：

| | uniform | non-uniform | conditional |
|---|---|---|---|
| 怎麼合 | 投票或平均 | 在 $g_t$ 轉換後的輸入上學線性模型 | 在 $g_t$ 轉換後的輸入上學非線性模型 |

講義的評語是：uniform 追求穩定（stability）；non-uniform 與 conditional 追求複雜度（complexity），要小心使用。課堂上的解釋是，uniform 讓不同的 $g_t$ 互相修正彼此的錯誤；另外兩種在轉換之後又多學了一層，能力比較強，相對要擔心 overfitting。課堂上還提到 conditional 這種做法一般叫 stacking，指的是把一層一層的學習堆起來；這個名字不在這一頁投影片上。

### 邊學 g 邊合：四個模型

第 21 頁的定義是 aggregate **as well as** getting diverse $g_t$：手上還沒有 $g_t$，一邊學一邊決定怎麼合。

| 模型 | 怎麼得到不一樣的 $g_t$ | 怎麼合 |
|---|---|---|
| Bagging | bootstrap | uniform 投票，什麼都不用算 |
| AdaBoost | 重新加權（reweighting） | 線性投票，票數由最速搜尋（steepest search）決定 |
| Decision Tree | 切資料（data splitting） | conditional 投票，條件由分支決定 |
| GradientBoost | 擬合殘差（residual fitting） | 線性投票，票數由最速搜尋決定 |

AdaBoost 與 GradientBoost 的第二欄不同、第三欄相同，這正是這堂課兩段推導的內容。講義在頁尾寫 boosting-like algorithms most popular。課堂上的說法稍微不同：四個模型在實務上都很重要，其中最流行的是跟 boosting 有關的兩個。

### 把 aggregation 再 aggregation

第 22 頁把上面的模型兩兩搭配：

| 外層 | 內層的樹 | 得到 |
|---|---|---|
| Bagging（加上隨機化） | 「強」的 DTree | Random Forest |
| AdaBoost | 「弱」的 DTree | AdaBoost-DTree |
| GradientBoost | 「弱」的 DTree | GBDT |

講義說這三個在實務上都常用。強弱的分別課堂上有解釋：隨機森林用的是完全長大的樹，還靠隨機投影讓樹更有變化；AdaBoost 的設計是把弱的東西合起來變強，一開始就用太強的沒有意思，GradientBoost 也一樣配弱的樹。這呼應了這堂開頭的獨裁問題。

### 兩種療效

第 23 頁回到技法第 7 堂開頭講的兩個動機，各配一張圖：

- **治 underfitting。** 左圖是圈圈與叉叉的資料，邊界由幾段水平與垂直的線段接成階梯狀。單一的 decision stump 只能切一刀水平或垂直的線，分不好；合起來之後 $G(\mathbf{x})$ 變「強」。講義的解讀是 aggregation ⟹ feature transform。
- **治 overfitting。** 右圖有許多條灰色的直線，中間一條黑線。把很多個合起來會得到一個比較中庸的 $G(\mathbf{x})$（講義的用詞是 moderate）。課堂上的說法是，overfitting 就是做了太極端的選擇，中庸的選擇可以防止它發生。講義的解讀是 aggregation ⟹ regularization。課堂上說，中庸的選擇在圖上表現成類似 large margin 的效果，隨機森林的邊界也看得到這個現象。

課堂上把這兩面比成一個大家族裡同時有幫你踩油門的與幫你踩煞車的模型：有的在治 underfitting 上比較成功，有的在治 overfitting 上比較成功，知道各自的特性、交替用得好，才能得到更好的表現。講義的結論是 proper aggregation（又稱 ensemble）⟹ better performance。ensemble 這個字，課堂上解釋成像合唱團那樣的一群。

本文補充：AdaBoost 與 GBDT 那兩個數值例子都屬於左圖那一種。三個各自會犯錯的 stump 合起來把五個點全部分對；三棵只切一刀的迴歸樹合成四段的階梯函數。

### Fun Time：哪個模型靠重新加權與最速搜尋

**題目（第 24 頁）：** 下面哪一個 aggregation 模型靠重新加權（reweighting）學到不一樣的 $g_t$，並用最速搜尋（steepest search）算出線性的票數？

1. AdaBoost
2. Random Forest
3. Decision Tree
4. Linear Blending

**答案：1。** 這句話就是第 21 頁表格裡 AdaBoost 那一列。其他選項對照同一張表：Random Forest 靠 bootstrap（加上隨機化的樹）得到 $g_t$，而且是 uniform 投票，不算票數。Decision Tree 靠切資料，合的方式是 conditional。Linear Blending 是先有 $g_t$ 才合，它不負責學 $g_t$，票數是解一個線性模型得到的。GradientBoost 的票數同樣來自最速搜尋，但它得到 $g_t$ 的方式是擬合殘差，而且不在選項裡。

第 25 頁的總結把四節各收成一句：為了得到弱的樹要抽樣與剪枝；AdaBoost 是在指數誤差上做函數梯度下降；gradient boosting 是反覆的最速殘差擬合；aggregation 模型有的治 underfitting、有的治 overfitting。下一堂的預告是 extract features other than hypotheses：到目前為止拿來當特徵轉換的都是假說 $g_t$，接下來要讓機器自己學出其他種類的特徵轉換。

## 自我檢查

**1. 某一輪 AdaBoost 的權重總和是 1，基礎演算法交回的 $g_t$ 加權錯誤率是 $\epsilon_t = 0.1$。最佳步長是多少？走完這一步，權重總和變成多少？**

答案：$\eta_t = \ln\sqrt{0.9/0.1} = \ln 3 \approx 1.099$。$\widehat{E}_{\text{ADA}} = 0.9\exp(-\ln 3) + 0.1\exp(\ln 3) = 0.3 + 0.3 = 0.6$，也可以直接用 $2\sqrt{0.1\times 0.9} = 0.6$。$g_t$ 愈準，步長愈大，權重總和降得愈多。

**2. 在 GBDT 的某一輪，三筆資料的殘差是 $(3, -1, 2)$，學到的 $g_t$ 在這三筆上的輸出是 $(1, -1, 1)$。算 $\alpha_t$ 與更新後的殘差，並檢查新的殘差與 $g_t$ 的輸出內積是多少。**

答案：$\alpha_t = \frac{3 + 1 + 2}{1 + 1 + 1} = 2$。新的殘差是 $(3, -1, 2) - 2\times(1, -1, 1) = (1, 1, 0)$，平方誤差的平均從 $\frac{14}{3}$ 降到 $\frac{2}{3}$。內積是 $1\times 1 + 1\times(-1) + 0\times 1 = 0$。這不是巧合：最佳的 $\eta$ 滿足 $\sum_n g_t(\mathbf{x}_n)\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big) = 0$，括號裡正是更新後的殘差。

**3. 為什麼 AdaBoost 不能直接搭配「用全部資料訓練、完全長大」的決策樹？講義給了哪兩個補救方法？**

判準：答案要走完這串推論：所有 $\mathbf{x}_n$ 都不同時 $E_{\text{in}} = 0$，加權後仍是 0，$\epsilon_t = 0$，$\alpha_t = \infty$，一棵樹獨占所有票數。補救是剪枝（或限制高度）與只用部分資料（依 $\mathbf{u}^{(t)}$ 抽樣）。

**4. 推導 GradientBoost 的方向時，為什麼不加懲罰項就得不到有意義的 $h$？$h$ 的大小最後由誰決定？**

判準：答案要說出泰勒展開後的目標是 $h(\mathbf{x}_n)$ 的一次式 $\frac{\eta}{N}\sum_n h(\mathbf{x}_n)\cdot 2(s_n - y_n)$，只要符號取得跟 $s_n - y_n$ 相反，大小愈大值愈小，沒有最小值；加上 $h^2$ 後可以配成 $\big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2$，最小值存在。大小不必在這一步定好，因為下一步的 $\eta$ 會用單變數線性迴歸決定步長。

**5. GBDT 的第 1 輪，基礎演算法解的是什麼問題？如果基礎演算法是一棵沒有抽樣、葉子取平均的迴歸樹，$\alpha_1$ 會是多少？**

答案：$s_n$ 起始是 0，殘差等於 $y_n$，第 1 輪解的就是原始的迴歸問題。照數值例子裡的論證，每個葉子對分子與分母的貢獻相等，$\alpha_1 = 1$。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把決策樹、隨機森林與這堂排在同一週（W12，11/18），這堂的投影片代號是 [211u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/211u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W12（11/25）；這一週的投影片在 2026-09-30 還沒上線，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都沒有替這堂標 [Learning from Data](http://amlbook.com) 的章節。課程頁替這一週列的延伸閱讀裡，跟這堂有關的是 [Friedman, Greedy Function Approximation: A Gradient Boosting Machine（Annals of Statistics, 2001）](https://doi.org/10.1214/aos/1013203451)，gradient boosting 的原始論文；這裡的連結用 DOI。

**作業。** [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（2024-12-02 發布、12-16 截止）有三題直接對應這堂，都是人工批改的證明題，沒有官方解答：

- **Q6**：證明 $U_{t+1}/U_t = 2\sqrt{\epsilon_t(1-\epsilon_t)}$，其中 $U_t$ 是第 $t$ 輪的權重總和。題目明寫對應技法第 8 堂與這堂的 AdaBoost。「找步長」那一小節最後的補充就是這個式子，五個點的例子可以拿來核對數字。
- **Q7**：gradient boosting 的基礎模型換成不帶正則化的線性迴歸時，證明或反駁最佳的 $\alpha_1 = 1$。可以先想清楚數值例子裡迴歸樹為什麼會得到 1，再看那個論證在線性迴歸上還成不成立。
- **Q8**：GBDT 用最速的 $\eta$ 當 $\alpha_t$ 更新完 $s_n$ 之後，證明 $\sum_n (y_n - s_n) g_t(\mathbf{x}_n) = 0$，並思考殘差向量與 $g_t$ 輸出向量的關係。自我檢查第 2 題是它的數字版。

這堂沒有程式題。想動手的話有兩個方向：把 HW7 Q10–12 的 AdaBoost-Stump 改成 AdaBoost-DTree，照這堂的做法依權重抽樣、限制樹高；或是把上面那段 GBDT 程式的基礎模型換成深度 2 的迴歸樹，在一維 sin 曲線加雜訊的資料上畫出第 1、5、20 輪的 $G$，看每一輪怎麼補上前一輪留下的殘差。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**下一堂。** [技法第 12 堂：神經網路](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)進入第三種技巧 Distilling Implicit Features: Extraction Models，特徵轉換不再是一個個學好的假說，而是跟著最後的模型一起學出來。

## 課程影片來源

原始影片：[Adaptive Boosted Decision Tree](https://www.youtube.com/watch?v=aX6ZiIWLjdk)、[Optimization View of AdaBoost](https://www.youtube.com/watch?v=lKkXrFVcZjs)、[Gradient Boosting](https://www.youtube.com/watch?v=F_EuNXhS9js)、[Summary of Aggregation Models](https://www.youtube.com/watch?v=JqSLmlSpqNo)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。影片標題裡的節名比講義短（AdaBoost Decision Tree、Optimization of AdaBoost、Summary of Aggregation），上面的連結用講義第 1 頁的節名。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [技法第 11 堂講義 211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time、第 9 頁與第 23 頁的圖都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、211u 投影片與延伸閱讀清單。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)：Q6、Q7、Q8 與 Q10–12 的題目內容。
- [Friedman, Greedy Function Approximation: A Gradient Boosting Machine](https://doi.org/10.1214/aos/1013203451)：課程頁列的延伸閱讀，gradient boosting 的原始論文。
- [Learning from Data 教科書網站](http://amlbook.com)：說明課程頁沒有替這堂標章節時提到的教科書。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
