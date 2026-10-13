---
title: "線性 SVM：最胖的分隔線怎麼寫成二次規劃｜台大林軒田 機器學習技法 第 1 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, optimization]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 18
tldr: "把資料全部分對的線有很多條，這堂課挑離最近的資料點最遠、也就是最胖的那一條。把 (b, w) 縮放到 min yₙ(wᵀxₙ+b)=1 之後，最大的 margin 等於最小化 ½wᵀw，限制式是每個點 yₙ(wᵀxₙ+b)≥1，可以直接交給二次規劃的解算器。胖的好處有兩種解釋：它是 E_in=0 範圍內的 weight decay，也讓能產生的 dichotomy 變少。"
description: "台大林軒田機器學習技法第 1 堂 Linear Support Vector Machine 導讀：最胖的分隔超平面、點到超平面的距離、縮放與 hard-margin SVM 標準問題、四個點的手算、二次規劃的輸入格式，以及 large margin 為什麼有助於泛化。"
draft: false
glossary:
  - term: "margin"
    aliases: ["邊界寬度", "fatness"]
    definition: "分隔超平面到最近訓練點的距離。林軒田在投影片上先叫它 fatness（胖瘦），再正式命名為 margin。"
    context: "技法第 1 堂的最大化目標：找最胖的分隔超平面。"
  - term: "hard-margin SVM"
    aliases: ["硬邊界 SVM", "linear hard-margin SVM"]
    definition: "要求每個訓練點都分對、而且都不落進胖邊界裡的 SVM。標準問題是最小化 ½wᵀw，限制式為每個點 yₙ(wᵀxₙ+b)≥1。"
    context: "技法第 1 堂導出的標準問題；允許違反邊界的版本要到技法第 4 堂。"
  - term: "支援向量"
    aliases: ["support vector", "SV", "支撐向量"]
    definition: "技法第 1 堂先把落在胖邊界上的訓練點叫作 support vector 的候選：它們決定了最胖的超平面在哪裡，其他點拿掉也不影響答案。正式定義要到技法第 2 堂。"
    context: "SVM 名稱的來源。"
  - term: "二次規劃"
    aliases: ["quadratic programming", "QP"]
    definition: "目標函數是變數的凸二次函數、限制式都是變數的一次式的最佳化問題，有現成的解算器。"
    context: "技法第 1 堂把 hard-margin SVM 對到 QP(Q, p, A, c) 的輸入。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf) 與這堂五支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/28 到 28/28），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 1 堂，接在[基石第 16 堂：三個學習原則](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles)後面。講義第 4 頁的 Roadmap 把技法分成三類處理特徵的技巧，這堂是第一類 Embedding Numerous Features: Kernel Models 的起點。它要回答的問題很具體：資料線性可分的時候，能把資料全部分對的線有很多條，該選哪一條，又要怎麼把它算出來。

先備是基石教過的幾樣東西：線性分類器 $h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x})$ 與 PLA（[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)）、dichotomy 與 shatter（[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)）、VC 維度（[基石第 7 堂](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)）、特徵轉換（[基石第 12 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)）、正則化（[基石第 14 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)），加上向量內積與投影。讀完之後，你應該能自己從「找最胖的線」推到 hard-margin SVM 的標準問題，對一組小資料手算出最胖的線，把問題填進二次規劃解算器的四個輸入，並且說得出胖的線為什麼對泛化有幫助。

整堂課的推導順序如下：

1. **提問**：都分對了，哪條線比較好？答案是離最近的資料點最遠的那條。
2. **寫成最佳化問題**：最大化 margin，限制是每個點都分對。
3. **算距離**：把截距 $b$ 從 $\mathbf{w}$ 裡拿出來，導出點到超平面的距離公式。
4. **固定縮放**：只看最近的點剛好讓 $y_n(\mathbf{w}^\top\mathbf{x}_n + b) = 1$ 的寫法，margin 變成 $1/\lVert\mathbf{w}\rVert$。
5. **放寬限制式**：把「最小的等於 1」換成「每個都至少是 1」，證明答案不變。
6. **交給二次規劃**：目標是二次函數、限制式是一次式。
7. **回頭問為什麼**：正則化與 VC 維度兩種解釋。

## 這門課怎麼排：圍繞特徵轉換的三類技巧

```youtube
url: https://www.youtube.com/watch?v=A-GxGCCAIrg
title: Linear Support Vector Machine (SVM) :: Course Introduction @ Machine Learning Techniques (機器學習技法)
```

（影片 00:18–03:00 介紹課程，之後是 Fun Time。）

講義第 1 頁交代這門課的來歷。林軒田在台大開的機器學習是 15 到 17 週的實體課，用英語與黑板授課。搬到 Coursera 時切成兩門：前 8 週是機器學習基石（Machine Learning Foundations），後 8 週是這門機器學習技法（Machine Learning Techniques）。線上版改用華語、改用投影片，並配合 Coursera 的小測驗與作業機制；講義寫的目標是讓線上版比實體版更好。

基石用四個問題把 16 堂課串起來：機器什麼時候能學（When）、為什麼能學（Why）、怎麼學（How）、怎麼學得更好（How Better），各段對應的堂次見[課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)。技法的排法不同。講義第 2 頁說，這門課一樣混合哲學上的說明、關鍵理論、核心演算法與實務用法，但主軸換成圍繞特徵轉換（feature transform）的三類技巧：

| 技巧 | 講義上的問題 | 引出的模型 | 堂次 |
|---|---|---|---|
| Embedding Numerous Features | 怎麼利用大量的特徵，並對它們做正則化？ | Support Vector Machine（SVM） | 技法第 1–6 堂 |
| Combining Predictive Features | 怎麼建構有預測力的特徵，並把它們混合起來？ | Adaptive Boosting（AdaBoost） | 技法第 7–11 堂 |
| Distilling Implicit Features | 怎麼找出並學到隱藏的特徵？ | Deep Learning | 技法第 12–15 堂 |

表中的堂次是照總覽整理的分段，不在這一頁投影片上。課堂上對三類技巧各多講了一句。第一類：特徵轉換用得很多的時候，複雜度會出問題，要想辦法控制；講義寫的是 regularize，課堂上說的是控制複雜度，兩者指同一件事。第二類：把找出來的特徵混合起來，讓整個模型表現更好，課堂上把 AdaBoost 的中文叫作逐步增強法。第三類：課堂上換了一個通俗的講法，就是讓機器自己把特徵學出來；這個想法早年帶出類神經網路，近年發展成深度學習。

第一類技巧接的是基石留下的問題。[基石第 12 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)的特徵轉換可以畫出彎曲的邊界，但那一堂也列了代價：轉換後的維度一高，計算與儲存都變貴，$d_{\text{VC}}$ 也跟著變大。[基石第 14 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的 weight decay 用限制 $\mathbf{w}$ 的長度來壓複雜度。技法前幾堂要做的，是讓你用得起高維的轉換，同時不必照原價付那兩筆代價。這堂先不做轉換，只處理原始空間裡的線性分類，所以叫線性 SVM。

### Fun Time：這門課的描述哪一個對

**題目（講義第 3 頁）：** 下面哪一個對這門課的描述是對的？

1. 這門課會用台語授課
2. 這門課會教我做出 Star Trek 裡的 android（人形機器人）Lieutenant Commander Data 的技術
3. 這門課有 16 週
4. 這門課會聚焦在三個主要的技巧上

**答案：4。** 課堂上唸題目時，把 Data 說成這部影集裡的一個機器人。講義的解答逐項回了一句。選項 1：不會，林軒田說自己的台語（還）不夠好到能拿來教課。選項 2：不會，不過這門課教的東西也許能當成零件（building blocks）。選項 3：不是，除非你把前一門基石也算進來，8 週加 8 週才是 16 週。選項 4 就是剛才那張表。

## 都分對了，哪條線比較好：最胖的分隔超平面

```youtube
url: https://www.youtube.com/watch?v=8hak0XngnV0
title: Linear SVM :: Large-Margin Separating Hyperplane @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:11 複習線性分類，01:11–03:21 問哪條線最好，03:21–08:04 用測量誤差解釋，08:04–09:41 把「強壯」換成「胖」，09:41–13:11 寫成最佳化問題，之後是 Fun Time。）

### PLA 與 VC bound 都分不出高下

講義第 5 頁先複習線性分類：算一個加權分數 $s = \mathbf{w}^\top\mathbf{x}$，看它是正是負，$h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x})$。資料線性可分（linear separable）時，PLA 能找到一條把圈圈（正例）和叉叉（負例）完全分開的線。

第 6 頁畫了三張圖。三張圖是同一組資料，各畫一條不同的線，三條線都把資料完全分對。講義問：哪一條最好？

- **問 PLA**：講義的回答是 depending on randomness。課堂上解釋，PLA 手上拿著一條線，看到一個錯誤就轉一下，最後停在哪一條完美的線上，跟它一路看到哪些錯誤有關；每次隨機挑一個錯誤來修的話，停在哪一條並不一定。
- **問 VC bound**：講義的回答是 whichever you like。VC bound 說

$$
E_{\text{out}}(\mathbf{w}) \le \underbrace{E_{\text{in}}(\mathbf{w})}_{0} + \underbrace{\Omega(\mathcal{H})}_{d_{\text{VC}} = d+1}
$$

三條線的 $E_{\text{in}}$ 都是 0，用的又都是同一個假說集（$d$ 維的線性分類器，$d_{\text{VC}} = d+1$），複雜度那一項一模一樣。照基石學到的理論，三條線沒有差別。

可是多數人憑直覺會選最右邊那條。講義寫的是「You? rightmost one, possibly :-)」。最右邊那張圖的線離兩邊的點都比較遠。

### 為什麼是離點最遠的那條：容忍測量誤差

第 7 頁給了一個講義自己標明是非正式的論證（informal argument）。課堂上先說這只是一個簡單的解釋，比較仔細的理論保證留到後面。

想像訓練資料是 $\mathbf{x}_n$，未來測試時拿到的 $\mathbf{x}$ 跟某個 $\mathbf{x}_n$ 很接近，$\mathbf{x} \approx \mathbf{x}_n$。課堂上說的原因是測量誤差或資料收集過程的誤差：就算本來應該一模一樣的資料，收進來時也會差一點。講義上寫的是「(Gaussian-like) noise」，課堂上沒有提高斯，只說測量誤差。如果我們相信訓練資料，最合理的預測是讓這個 $\mathbf{x}$ 跟 $\mathbf{x}_n$ 得到同一個標籤。

第 7 頁的圖在每個訓練點外面畫了一個灰色的圓，代表「線還能容忍多大的誤差」。同一張圖裡每個點的圓一樣大，半徑就是最近的那個點到線的距離：圓再大一點，最近的那個點的圓就會越過線。左邊那張圖有一個點貼著線，所以每個圓都小到幾乎看不見；右邊那張圖最近的點也離線很遠，每個點的圓都很大。講義把這個觀察寫成兩串等價：

| 從點的角度 | 從線的角度 |
|---|---|
| $\mathbf{x}_n$ 離超平面愈遠 | 到最近的 $\mathbf{x}_n$ 的距離 |
| ⟺ 能容忍愈多雜訊 | ⟺ 能容忍的雜訊量 |
| ⟺ 對過擬合愈 robust | ⟺ 超平面的 robustness |

課堂上把它接回基石講過的事（[基石第 13 堂：過擬合](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)）：雜訊是過擬合的主要原因，測量誤差也是一種雜訊，所以能容忍愈多誤差的線愈好。一條線到底有多強壯（robust），就看它離最近的那個訓練點有多遠。

### 從強壯到胖

第 8 頁換一個角度畫同一件事。不在點的周圍畫圓，改讓線自己往兩邊長：線能長到多胖，就看它往外長到哪裡會碰到最近的點。圖上三條線各自長成一條灰色的帶子，左邊的很細，右邊的很寬。講義的定義是：

- robust 的分隔超平面就是胖（fat）的超平面，離兩邊的資料都遠；
- robustness 等同於 fatness，也就是到最近的 $\mathbf{x}_n$ 的距離。

目標於是寫成一行：find fattest separating hyperplane。課堂上說，這一堂喜歡的是比較胖的線，像下盤比較穩，還拿楊貴妃開了個玩笑：胖的比較好。

### 寫成最佳化問題

第 9 頁把目標寫成式子。每一條線由 $\mathbf{w}$ 決定，要找的 $\mathbf{w}$ 滿足兩件事：分對所有資料，而且最胖。

$$
\begin{aligned}
\max_{\mathbf{w}}\quad & \text{fatness}(\mathbf{w}) \\
\text{subject to}\quad & \mathbf{w} \text{ classifies every } (\mathbf{x}_n, y_n) \text{ correctly} \\
& \text{fatness}(\mathbf{w}) = \min_{n=1,\dots,N} \text{distance}(\mathbf{x}_n, \mathbf{w})
\end{aligned}
$$

胖瘦的算法是：把這條線到每個點的距離都算出來，取最小的那個。課堂上特別說，這個問題只是用語言講起來簡單，不代表好解；接下來的工作是把它一步一步改寫成會解的形式。

講義接著換兩個說法。第一，fatness 的正式名稱是 margin。課堂上的解釋是 margin 就像頁面旁邊的留白：線的兩旁留一塊空白，這塊空白裡看不到任何訓練資料，留白有多寬，線就有多胖。第二，「分對」可以寫成不等式。$y_n = \text{sign}(\mathbf{w}^\top\mathbf{x}_n)$ 的意思是分數 $\mathbf{w}^\top\mathbf{x}_n$ 跟 $y_n$ 同號，兩個同號的數相乘一定是正的：

$$
\begin{aligned}
\max_{\mathbf{w}}\quad & \text{margin}(\mathbf{w}) \\
\text{subject to}\quad & \text{every } y_n\mathbf{w}^\top\mathbf{x}_n > 0 \\
& \text{margin}(\mathbf{w}) = \min_{n=1,\dots,N} \text{distance}(\mathbf{x}_n, \mathbf{w})
\end{aligned}
$$

這就是 largest-margin separating hyperplane：separating 指把資料完全分開，largest-margin 指 margin 最大。這裡先假設資料線性可分，否則第一條限制式沒有任何 $\mathbf{w}$ 能滿足。式子裡的 distance 還只是一個名字，怎麼算留到「把『最胖』寫成能解的問題」那一節。

### Fun Time：兩個點的最胖分隔線

**題目（講義第 10 頁）：** 有兩筆資料 $(\mathbf{v}, +1)$ 與 $(-\mathbf{v}, -1)$，$\mathbf{v} \in \mathbb{R}^2$（沒有補 $v_0 = 1$）。下面哪一個是這兩筆資料的 largest-margin separating hyperplane？講義建議拿 $\mathbf{v} = (3, 2)$ 畫畫看。

1. $x_1 = 0$
2. $x_2 = 0$
3. $v_1x_1 + v_2x_2 = 0$
4. $v_2x_1 + v_1x_2 = 0$

**答案：3。** 講義的理由是：最胖的分隔線一定是 $\mathbf{v}$ 與 $-\mathbf{v}$ 連線的中垂線（perpendicular bisector），所以 $\mathbf{v}$ 是這條線的法向量；這個結論對 $\mathbf{v} \in \mathbb{R}^d$ 也成立。

講義沒有說明為什麼一定是中垂線，本文補上。任何把兩點分開的線都要從兩點之間穿過去。兩個點到線的距離相加，等於兩點連線在法向量方向上的投影長度，不會超過兩點之間的距離 $2\lVert\mathbf{v}\rVert$。兩個距離裡比較小的那個就是 margin，所以 margin 不超過 $\lVert\mathbf{v}\rVert$。要剛好等於 $\lVert\mathbf{v}\rVert$，線必須垂直於連線（投影才不會縮短），而且通過中點（兩邊才一樣遠）。這兩個點的中點是原點，垂直於 $\mathbf{v}$ 且通過原點的線就是 $\mathbf{v}^\top\mathbf{x} = v_1x_1 + v_2x_2 = 0$。

用 $\mathbf{v} = (3, 2)$ 驗算四個選項（距離公式在「把『最胖』寫成能解的問題」那一節推導，這裡先用）：

| 選項 | 線 | $\mathbf{v}$ 到線的距離 |
|---|---|---|
| 1 | $x_1 = 0$ | $3$ |
| 2 | $x_2 = 0$ | $2$ |
| 3 | $3x_1 + 2x_2 = 0$ | $\frac{9+4}{\sqrt{13}} = \sqrt{13} \approx 3.606$ |
| 4 | $2x_1 + 3x_2 = 0$ | $\frac{6+6}{\sqrt{13}} \approx 3.328$ |

四條線都通過原點，$-\mathbf{v}$ 到線的距離跟 $\mathbf{v}$ 一樣，所以表上的數字就是各自的 margin。以這個 $\mathbf{v}$ 來說四條都能把兩點分開，最胖的是選項 3，margin 剛好是 $\lVert\mathbf{v}\rVert = \sqrt{13}$。選項 1 與 2 只看了一個座標；$\mathbf{v}$ 換成 $(0, 2)$ 的話，選項 1 的線會直接壓在兩個點上，連分都分不開。選項 4 把 $\mathbf{v}$ 的兩個分量對調，得到的法向量 $(v_2, v_1)$ 一般不是 $\mathbf{v}$ 的方向。

## 把「最胖」寫成能解的問題：距離、縮放與標準問題

```youtube
url: https://www.youtube.com/watch?v=lHo9GcIURRs
title: Linear SVM :: Standard Large-Margin Problem @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:51 把截距拿出來，02:51–07:00 推導距離公式，07:00–08:55 分隔超平面的距離，08:55–11:51 固定縮放，11:51–16:44 放寬限制式，16:44–18:38 最後的整理，之後是 Fun Time。）

### 先把截距從 w 裡拿出來

基石一直把 $\mathbf{x}$ 補上一個 $x_0 = 1$，讓截距變成 $w_0$，式子可以寫成單一的內積。課堂上把那個 $x_0$ 比喻成塞在底下的增高墊。講義第 11 頁說，算距離的時候，$w_0$ 和 $(w_1, \dots, w_d)$ 的角色不一樣（原因要等公式推出來才看得到），所以從這裡開始把兩者分開：

$$
b = w_0, \qquad \mathbf{w} = \begin{bmatrix} w_1 \\ \vdots \\ w_d \end{bmatrix}, \qquad \mathbf{x} = \begin{bmatrix} x_1 \\ \vdots \\ x_d \end{bmatrix}
$$

$b$ 是 bias，也就是截距。$\mathbf{w}$ 與 $\mathbf{x}$ 都比原來少一個分量，講義的說法是把它們 shorten，課堂上說是變矮了一點。這一堂與之後幾堂的假說都寫成

$$
h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x} + b)
$$

### 點到超平面的距離

第 12 頁要算的是 $\text{distance}(\mathbf{x}, b, \mathbf{w})$：一個點 $\mathbf{x}$ 到超平面 $\mathbf{w}^\top\mathbf{x}' + b = 0$ 的距離。推導分三步。

**第一步：超平面上的點滿足什麼。** 在超平面上任取兩個點 $\mathbf{x}'$ 與 $\mathbf{x}''$。它們都滿足超平面的方程式，移項得到

$$
\mathbf{w}^\top\mathbf{x}' = -b, \qquad \mathbf{w}^\top\mathbf{x}'' = -b
$$

**第二步：w 垂直於超平面。** 兩式相減：

$$
\mathbf{w}^\top(\mathbf{x}'' - \mathbf{x}') = -b - (-b) = 0
$$

$\mathbf{x}'' - \mathbf{x}'$ 是從超平面上一點指向另一點的向量，整個躺在超平面上。$\mathbf{x}'$ 與 $\mathbf{x}''$ 是任意挑的，所以 $\mathbf{w}$ 跟超平面上的每一個向量內積都是 0，也就是 $\mathbf{w}$ 垂直於超平面，是它的法向量。課堂上的說法是：有了法向量就好辦事。

**第三步：投影。** 點 $\mathbf{x}$ 到超平面的距離，是把 $\mathbf{x}$ 與超平面上任一點 $\mathbf{x}'$ 連成的向量 $\mathbf{x} - \mathbf{x}'$，投影到垂直於超平面的方向之後的長度。垂直的方向就是 $\mathbf{w}$；投影到某個方向，是跟那個方向的單位向量 $\mathbf{w}/\lVert\mathbf{w}\rVert$ 做內積，再取絕對值：

$$
\text{distance}(\mathbf{x}, b, \mathbf{w}) = \left|\frac{\mathbf{w}^\top}{\lVert\mathbf{w}\rVert}(\mathbf{x} - \mathbf{x}')\right| = \frac{1}{\lVert\mathbf{w}\rVert}\left|\mathbf{w}^\top\mathbf{x} - \mathbf{w}^\top\mathbf{x}'\right| = \frac{1}{\lVert\mathbf{w}\rVert}\left|\mathbf{w}^\top\mathbf{x} + b\right|
$$

最後一個等號用的是第一步的 $\mathbf{w}^\top\mathbf{x}' = -b$。結果裡沒有 $\mathbf{x}'$，所以挑超平面上哪一點都一樣。

公式讀起來是：先算原本的分數 $\mathbf{w}^\top\mathbf{x} + b$，取絕對值，再除以 $\mathbf{w}$ 的長度。分母只有 $\lVert\mathbf{w}\rVert$，沒有 $b$。課堂上指出這就是把 $b$ 和 $\mathbf{w}$ 分開的原因：算距離只需要 $\mathbf{w}$ 的長度，不需要 $b$ 的大小；如果還把 $w_0$ 包在 $\mathbf{w}$ 裡，長度就會算錯。

### 分隔超平面可以把絕對值拿掉

我們只關心能把資料分對的超平面。第 13 頁用這個性質把絕對值去掉。分隔超平面對每個 $n$ 都有

$$
y_n(\mathbf{w}^\top\mathbf{x}_n + b) > 0
$$

$y_n$ 是 $+1$ 或 $-1$，而且跟分數同號，所以 $y_n$ 乘上分數剛好就是分數的絕對值：

$$
\text{distance}(\mathbf{x}_n, b, \mathbf{w}) = \frac{1}{\lVert\mathbf{w}\rVert}\,y_n(\mathbf{w}^\top\mathbf{x}_n + b)
$$

把它代回最佳化問題，distance 不再只是一個名字：

$$
\begin{aligned}
\max_{b,\mathbf{w}}\quad & \text{margin}(b, \mathbf{w}) \\
\text{subject to}\quad & \text{every } y_n(\mathbf{w}^\top\mathbf{x}_n + b) > 0 \\
& \text{margin}(b, \mathbf{w}) = \min_{n=1,\dots,N} \frac{1}{\lVert\mathbf{w}\rVert}\,y_n(\mathbf{w}^\top\mathbf{x}_n + b)
\end{aligned}
$$

課堂上在這裡自問：這樣會解了嗎？好像還不會，要再簡化。

### 固定縮放：讓最近的點剛好等於 1

第 14 頁的觀察是：同一個超平面有很多種寫法。$\mathbf{w}^\top\mathbf{x} + b = 0$ 與 $3\mathbf{w}^\top\mathbf{x} + 3b = 0$ 是同一個超平面，講義寫 scaling does not matter。課堂上的講法是，這個世界上其實沒有那麼多條線，$(b, \mathbf{w})$ 滿天跑，很多組只是同一條線放大或縮小。既然縮放不改變線，就挑一個讓式子最好寫的縮放：只考慮滿足下式的 $(b, \mathbf{w})$，

$$
\min_{n=1,\dots,N} y_n(\mathbf{w}^\top\mathbf{x}_n + b) = 1
$$

本文補充為什麼這樣挑不會漏掉任何一條線。任何一組把資料分開的 $(b, \mathbf{w})$，它的 $m = \min_n y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 是一個正數。把 $b$ 和 $\mathbf{w}$ 同除以 $m$，超平面沒變，新的最小值是 $m/m = 1$。所以每一個分隔超平面都剛好有一種寫法符合這個縮放。

在這個縮放之下，margin 的式子變得很簡單。$\frac{1}{\lVert\mathbf{w}\rVert}$ 跟 $n$ 無關，可以提到 min 外面：

$$
\text{margin}(b, \mathbf{w}) = \frac{1}{\lVert\mathbf{w}\rVert}\min_{n} y_n(\mathbf{w}^\top\mathbf{x}_n + b) = \frac{1}{\lVert\mathbf{w}\rVert} \times 1 = \frac{1}{\lVert\mathbf{w}\rVert}
$$

還有一個附帶的好處。最小的都等於 1 了，每個 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 當然都大於 0，原本那條「分對」的限制式不必再寫；課堂上說那一條寫了也是白寫。問題變成

$$
\max_{b,\mathbf{w}}\ \frac{1}{\lVert\mathbf{w}\rVert} \qquad \text{subject to} \quad \min_{n=1,\dots,N} y_n(\mathbf{w}^\top\mathbf{x}_n + b) = 1
$$

### 放寬限制式：最小的等於 1 換成每個都至少是 1

限制式裡還有一個 min。課堂上說，外面做最大化已經夠煩了，裡面又冒出一個最小化，不好處理。第 15 頁的做法是把限制式放寬成它的必要條件：

$$
y_n(\mathbf{w}^\top\mathbf{x}_n + b) \ge 1 \quad \text{for all } n
$$

最小的等於 1，每一個當然都至少是 1，所以原本合法的 $(b, \mathbf{w})$ 在新的限制式下仍然合法。反過來不一定：每個都至少是 1，不保證有哪一個剛好等於 1。課堂上說這是必要條件但不是充分條件，並且用一張示意圖說明：原本的限制式圍出一個小區域，放寬之後是包住它的大區域。隨便放寬限制式，最佳解可能跑到小區域外面，答案就變了。要證明的是：在大區域裡找到的最佳解，一定還落在小區域裡。

講義用反證法。假設放寬後的最佳解 $(b, \mathbf{w})$ 落在小區域外面，也就是每個點都嚴格大於 1。講義舉的數字是

$$
y_n(\mathbf{w}^\top\mathbf{x}_n + b) > 1.126 \quad \text{for all } n
$$

那就把 $b$ 和 $\mathbf{w}$ 都除以 1.126，看新的一組 $\left(\frac{b}{1.126}, \frac{\mathbf{w}}{1.126}\right)$：

- 它仍然合法：$y_n\left(\frac{\mathbf{w}^\top\mathbf{x}_n + b}{1.126}\right) > \frac{1.126}{1.126} = 1$。
- 它的目標值更大：$\mathbf{w}$ 變短了，$\frac{1}{\lVert\mathbf{w}/1.126\rVert} = \frac{1.126}{\lVert\mathbf{w}\rVert} > \frac{1}{\lVert\mathbf{w}\rVert}$。

找到一組合法而且更好的解，跟「$(b, \mathbf{w})$ 是最佳解」矛盾。1.126 沒有特別之處，換成任何大於 1 的數，論證都一樣。所以放寬後的最佳解一定有某個點剛好等於 1，落在小區域裡。小區域裡的每一組解本來也都在大區域裡，大區域的冠軍既然落在小區域，它也就是小區域的冠軍。放寬沒有改變答案。

### 最後的整理：max 換成 min

第 15 頁最後做三個不改變最佳解的調整，講義寫成一行「max ⟹ min, remove √, add ½」：

1. **最大化 $\frac{1}{\lVert\mathbf{w}\rVert}$ 換成最小化 $\lVert\mathbf{w}\rVert$。** 一個正數愈大，它的倒數愈小。課堂上的理由是基石的梯度下降講的都是最小化，改成最小化比較接近熟悉的形式。
2. **拿掉根號。** $\lVert\mathbf{w}\rVert = \sqrt{\mathbf{w}^\top\mathbf{w}}$，長度最小跟長度的平方最小是同一件事，改成最小化 $\mathbf{w}^\top\mathbf{w}$。
3. **前面乘上 $\frac{1}{2}$。** 最小化一個量跟最小化它的一半，最佳解相同。課堂上只說原因之後會看到。本文補充：[技法第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)對 $\mathbf{w}$ 偏微分時，這個 $\frac{1}{2}$ 剛好跟平方微分出來的 2 消掉；它也對得上 QP 標準形式裡的 $\frac{1}{2}\mathbf{u}^\top Q\mathbf{u}$。

結果就是講義所說的標準問題：

$$
\begin{aligned}
\min_{b,\mathbf{w}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} \\
\text{subject to}\quad & y_n(\mathbf{w}^\top\mathbf{x}_n + b) \ge 1 \quad \text{for all } n
\end{aligned}
$$

解出這個問題的 $(b, \mathbf{w})$，就是最胖的分隔超平面，margin 是 $1/\lVert\mathbf{w}\rVert$。講義第 28 頁的總結把這一節收成一句：minimize 'length of w' at special separating scale。

### Fun Time：三個點與一條給定的線

**題目（講義第 16 頁）：** 三筆資料 $(\mathbf{x}_1, +1)$、$(\mathbf{x}_2, +1)$、$(\mathbf{x}_3, -1)$，其中 $\mathbf{x}_1 = (3, 0)$、$\mathbf{x}_2 = (0, 4)$、$\mathbf{x}_3 = (0, 0)$。考慮超平面 $x_1 + x_2 = 1$。下面哪一個**不對**？

1. 這個超平面把三筆資料分開了
2. 超平面到 $\mathbf{x}_1$ 的距離是 $2$
3. 超平面到 $\mathbf{x}_3$ 的距離是 $\frac{1}{\sqrt{2}}$
4. 離超平面最近的是 $\mathbf{x}_3$

**答案：2。** 把超平面寫成 $\mathbf{w} = (1, 1)$、$b = -1$，$\lVert\mathbf{w}\rVert = \sqrt{2}$。逐點算：

| 點 | $y_n$ | 分數 $\mathbf{w}^\top\mathbf{x}_n + b$ | $y_n \times$ 分數 | 距離 |
|---|---|---|---|---|
| $\mathbf{x}_1 = (3, 0)$ | $+1$ | $3 + 0 - 1 = 2$ | $2$ | $\frac{2}{\sqrt{2}} = \sqrt{2} \approx 1.414$ |
| $\mathbf{x}_2 = (0, 4)$ | $+1$ | $0 + 4 - 1 = 3$ | $3$ | $\frac{3}{\sqrt{2}} \approx 2.121$ |
| $\mathbf{x}_3 = (0, 0)$ | $-1$ | $-1$ | $1$ | $\frac{1}{\sqrt{2}} \approx 0.707$ |

第四欄都是正的，所以三筆都分對，選項 1 對。$\mathbf{x}_3$ 的距離是 $\frac{1}{\sqrt{2}}$，而且是三個裡最小的，選項 3 與 4 對。$\mathbf{x}_1$ 的距離是 $\sqrt{2}$，選項 2 寫成 2，是忘了除以 $\lVert\mathbf{w}\rVert$，把分數直接當成距離。講義的解答只列了算式 $\frac{1}{\sqrt{2}}(3 + 0 - 1) = \sqrt{2}$，課堂上也只說距離應該是 $\sqrt{2}$ 而不是 2；「忘了除以長度」是本文對這個錯誤選項的解讀。

本文補充：這條線分對了，但不是最胖的。它的 margin 是 $\frac{1}{\sqrt{2}} \approx 0.707$。用標準問題解這三個點，限制式是 $3w_1 + b \ge 1$、$4w_2 + b \ge 1$、$-b \ge 1$。第一條與第三條相加得 $w_1 \ge \frac{2}{3}$，第二條與第三條相加得 $w_2 \ge \frac{1}{2}$，所以 $\frac{1}{2}\mathbf{w}^\top\mathbf{w} \ge \frac{1}{2}\left(\frac{4}{9} + \frac{1}{4}\right) = \frac{25}{72}$。取 $\mathbf{w} = \left(\frac{2}{3}, \frac{1}{2}\right)$、$b = -1$ 三條都剛好等於 1，所以它是最佳解，margin 是 $\frac{1}{\lVert\mathbf{w}\rVert} = \frac{6}{5} = 1.2$。最胖的線是 $4x_1 + 3x_2 = 6$，三個點到它的距離都是 1.2。

## 四個點手算一次，再交給二次規劃

```youtube
url: https://www.youtube.com/watch?v=FAm70y081o4
title: Linear SVM :: Support Vector Machine @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:53 手算四個點，03:53–06:10 支援向量，06:10–07:53 二次規劃，07:53–13:59 對到解算器的輸入，13:59–14:58 整理成演算法，之後是 Fun Time。）

### 數值例子：講義的四個點

講義第 17 頁用一組小資料把標準問題從頭解一次。資料是四個二維的點：

| $n$ | $\mathbf{x}_n$ | $y_n$ |
|---|---|---|
| 1 | $(0, 0)$ | $-1$ |
| 2 | $(2, 2)$ | $-1$ |
| 3 | $(2, 0)$ | $+1$ |
| 4 | $(3, 0)$ | $+1$ |

**第一步：一個點寫一條限制式。** 把每個點代進 $y_n(w_1x_{n,1} + w_2x_{n,2} + b) \ge 1$：

$$
\begin{aligned}
-b &\ge 1 && \text{(i)} \\
-2w_1 - 2w_2 - b &\ge 1 && \text{(ii)} \\
2w_1 + b &\ge 1 && \text{(iii)} \\
3w_1 + b &\ge 1 && \text{(iv)}
\end{aligned}
$$

**第二步：把限制式兩兩相加，消掉 b。** (i) 與 (iii) 的左邊相加是 $2w_1$，右邊相加是 2，所以 $w_1 \ge 1$。(ii) 與 (iii) 相加，$2w_1$ 與 $b$ 都消掉，剩下 $-2w_2 \ge 2$，所以 $w_2 \le -1$。課堂上稱這兩條是必要條件：原本四條限制式都成立的話，這兩條一定成立。

**第三步：得到目標函數的下界。** $w_1 \ge 1$ 表示 $w_1^2 \ge 1$；$w_2 \le -1$ 表示 $w_2^2 \ge 1$。所以

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} = \frac{1}{2}(w_1^2 + w_2^2) \ge \frac{1}{2}(1 + 1) = 1
$$

任何合法的解，目標值都不會低於 1。

**第四步：找一組剛好碰到下界的合法解。** 要讓目標值等於 1，只能取 $w_1 = 1$、$w_2 = -1$。把它們代回四條限制式看 $b$ 的範圍：(i) 要求 $b \le -1$；(ii) 是 $-2 + 2 - b \ge 1$，也是 $b \le -1$；(iii) 是 $2 + b \ge 1$，要求 $b \ge -1$；(iv) 是 $3 + b \ge 1$，要求 $b \ge -2$。四條同時成立只剩 $b = -1$。講義只寫結論「$(w_1 = 1, w_2 = -1, b = -1)$ at lower bound and satisfies (i)–(iv)」，中間 $b$ 的範圍是本文補上的。

目標值碰到下界而且四條限制式都滿足，所以這就是最佳解。分類器是

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}(x_1 - x_2 - 1)
$$

**這個結果代表什麼。** 第 18 頁算出 margin：

$$
\text{margin}(b, \mathbf{w}) = \frac{1}{\lVert\mathbf{w}\rVert} = \frac{1}{\sqrt{1^2 + (-1)^2}} = \frac{1}{\sqrt{2}} \approx 0.707
$$

逐點檢查，前三個點的 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 都剛好是 1，到線的距離都是 0.707；第 4 點是 $3 - 0 - 1 = 2$，距離 1.414。線 $x_1 - x_2 - 1 = 0$ 往兩邊各長 0.707，剛好碰到前三個點。

本文再拿兩條同樣把四個點分對的線來比，數字是本文算的，不在講義上：

| 線 | $\mathbf{w}$、$b$ | 四個點的 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ | $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ | margin |
|---|---|---|---|---|
| $x_1 - x_2 - 1 = 0$ | $(1, -1)$、$-1$ | $1, 1, 1, 2$ | $1$ | $\frac{1}{\sqrt{2}} \approx 0.707$ |
| $x_1 - 2x_2 - 1 = 0$ | $(1, -2)$、$-1$ | $1, 3, 1, 2$ | $2.5$ | $\frac{1}{\sqrt{5}} \approx 0.447$ |
| $2x_1 - x_2 - 3 = 0$ | $(2, -1)$、$-3$ | $3, 1, 1, 3$ | $2.5$ | $\frac{1}{\sqrt{5}} \approx 0.447$ |

三組寫法的最小值都是 1，符合前面挑的縮放，所以可以直接比 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$：愈小的愈胖。後兩條線合法，但目標值是 2.5，margin 只有 0.447。

胖的好處也可以用這組資料看到。假設測試時來了一個點 $(2, 0.6)$，它離訓練點 $(2, 0)$ 只有 0.6，照「很接近就該同一類」的想法應該是正例。最胖的線給的分數是 $2 - 0.6 - 1 = 0.4 > 0$，判成正例。第二條線給的是 $2 - 1.2 - 1 = -0.2 < 0$，判成負例。0.6 的誤差比 0.707 小、比 0.447 大，所以前者撐得住，後者撐不住。

### 支援向量：只有邊界上的點在決定這條線

第 18 頁的圖上，$(0,0)$、$(2,2)$、$(2,0)$ 三個點被框起來，它們剛好落在灰色胖邊界的邊緣；$(3,0)$ 沒有框。講義的觀察是：

- 邊界上的點「定位」（locates）了最胖的超平面；
- 其他的點不需要（not needed）。

課堂上的說法是，把離得比較遠的點塗掉、當作沒看到，用剩下的點重新找最胖的線，找到的還是同一條。本文驗算：拿掉 $(3, 0)$ 之後，限制式少了 (iv)，上面四個步驟一步都不用改，答案仍是 $(1, -1, -1)$。反過來，拿掉邊界上的 $(2, 2)$，限制式 (ii) 消失，$w_2 \le -1$ 這個要求跟著消失，最佳解變成 $\mathbf{w} = (1, 0)$、$b = -1$，也就是直線 $x_1 = 1$，margin 變成 1。邊界上的點一動，線就跟著動。

講義把邊界上的點叫作 support vector，後面用小字加了「(candidate)」。課堂上的解釋是這些點支撐住那個胖胖的超平面；它們目前只是支撐向量的候選，之後才會給明確的定義。那個定義在[技法第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)。課堂上把 support vector 叫作支撐向量，兩種譯名指的是同一個東西；本系列統一寫成支援向量。SVM 這個名字就從這裡來：

> support vector machine (SVM): learn fattest hyperplanes (with help of support vectors)

### 一般情況：這是一個二次規劃問題

四個點可以用手硬解，資料一多就不行。第 19 頁列了兩條行不通的路：手算當然不容易；梯度下降也不好用，因為有限制式。課堂上的講法是，現在不能自由自在地往山谷下面滾，有些地方不准滾。

好消息是這個問題有兩個性質：

- 目標函數 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ 是 $(b, \mathbf{w})$ 的凸二次函數；
- 限制式 $y_n(\mathbf{w}^\top\mathbf{x}_n + b) \ge 1$ 是 $(b, \mathbf{w})$ 的一次式。

具備這兩個性質的最佳化問題叫二次規劃（quadratic programming，QP）。課堂上說可以把它想成線性規劃的進階版，研究數值最佳化的人已經把它研究得很清楚，有現成的工具。講義的說法是 QP 是「easy」的最佳化問題。剩下的工作是把 SVM 寫成 QP 的標準形式，把係數交給工具。

### 對到 QP 解算器的四個輸入

第 20 頁把兩個問題並排。QP 解算器 $\text{QP}(Q, \mathbf{p}, A, \mathbf{c})$ 解的是

$$
\begin{aligned}
\min_{\mathbf{u}}\quad & \frac{1}{2}\mathbf{u}^\top Q\mathbf{u} + \mathbf{p}^\top\mathbf{u} \\
\text{subject to}\quad & \mathbf{a}_m^\top\mathbf{u} \ge c_m, \quad m = 1, 2, \dots, M
\end{aligned}
$$

$\mathbf{u}$ 是要解的變數；$Q$ 放二次項的係數，$\mathbf{p}$ 放一次項的係數；每條限制式有一組係數 $\mathbf{a}_m$ 與一個常數 $c_m$，把所有 $\mathbf{a}_m^\top$ 疊成矩陣 $A$、所有 $c_m$ 疊成向量 $\mathbf{c}$。逐項對過去：

**變數。** 我們要解的是 $b$ 與 $\mathbf{w}$，全部塞進 $\mathbf{u}$，共 $d + 1$ 個分量：

$$
\mathbf{u} = \begin{bmatrix} b \\ \mathbf{w} \end{bmatrix}
$$

**二次項。** 目標函數是 $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$，裡面只有 $\mathbf{w}$，沒有 $b$。課堂上的說法是跟 $b$ 有關的部分我們不在乎，不在乎就是係數為 0；$\mathbf{w}$ 是跟自己相乘，所以對應的那一塊放單位矩陣：

$$
Q = \begin{bmatrix} 0 & \mathbf{0}_d^\top \\ \mathbf{0}_d & \mathrm{I}_d \end{bmatrix}
$$

驗算：$\mathbf{u}^\top Q\mathbf{u} = 0 \cdot b^2 + \mathbf{w}^\top\mathrm{I}_d\mathbf{w} = \mathbf{w}^\top\mathbf{w}$。

**一次項。** 目標函數沒有 $b$ 或 $\mathbf{w}$ 的一次項，所以 $\mathbf{p} = \mathbf{0}_{d+1}$。

**限制式。** SVM 有 $N$ 條，所以 $M = N$。右邊的常數都是 1，所以 $c_n = 1$。左邊要寫成某個向量跟 $\mathbf{u}$ 的內積。把 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 展開成 $y_n \cdot b + y_n\mathbf{x}_n^\top\mathbf{w}$：跟 $b$ 相乘的是 $y_n$，跟 $\mathbf{w}$ 相乘的是 $y_n\mathbf{x}_n$。所以

$$
\mathbf{a}_n^\top = y_n\begin{bmatrix} 1 & \mathbf{x}_n^\top \end{bmatrix}
$$

第一格是 $y_n$，後面 $d$ 格是 $y_n\mathbf{x}_n^\top$。

對完之後，課堂上說剩下的事只有一步，呼叫解算器。講義的框裡寫的是：SVM with general QP solver: easy if you've read the manual。課堂上提到 Matlab 等不少軟體都內建解 QP 的工具，但細節要自己讀說明書，就像家裡新買的電器要先讀使用說明：這裡的限制式寫成「≥」，有的工具要你餵「≤」的形式，那係數就要變號；有等式或其他類型的限制式時，也可能要用另外的方式餵進去。

### Linear Hard-Margin SVM 演算法

第 21 頁把流程收成三步：

1. 算出 $Q = \begin{bmatrix} 0 & \mathbf{0}_d^\top \\ \mathbf{0}_d & \mathrm{I}_d \end{bmatrix}$、$\mathbf{p} = \mathbf{0}_{d+1}$、$\mathbf{a}_n^\top = y_n\begin{bmatrix} 1 & \mathbf{x}_n^\top \end{bmatrix}$、$c_n = 1$。
2. 呼叫 $\begin{bmatrix} b \\ \mathbf{w} \end{bmatrix} \leftarrow \text{QP}(Q, \mathbf{p}, A, \mathbf{c})$。
3. 回傳 $b$ 與 $\mathbf{w}$，作為 $g_{\text{SVM}}$。

名字裡的兩個形容詞各有意思。**Hard-margin**：講義寫 nothing violate 'fat boundary'，沒有任何點可以違反胖邊界；課堂上說這代表堅持圈圈和叉叉一定要完全分開，不可以有任何犯錯。資料不是線性可分時，這個 QP 沒有合法的解，放寬這個要求是[技法第 4 堂：軟邊界 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm)的事。**Linear**：用的是原始的 $\mathbf{x}_n$，找的是 $\mathbf{x}$ 空間裡的超平面。

想要非線性的邊界怎麼辦？講義的提示是「$\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n)$—remember? :-)」。照基石第 12 堂的做法，先把 $\mathbf{x}_n$ 轉換成 $\mathbf{z}_n$，再對 $\mathbf{z}_n$ 做同一套演算法就好。

### Fun Time：四個點要餵給解算器的 a

**題目（講義第 22 頁）：** 沿用第 17 頁的四個點：兩個負例 $\mathbf{x}_1 = (0, 0)$、$\mathbf{x}_2 = (2, 2)$，兩個正例 $\mathbf{x}_3 = (2, 0)$、$\mathbf{x}_4 = (3, 0)$。$\mathbf{u}$、$Q$、$\mathbf{p}$、$c_n$ 照第 20 頁的定義。要餵給 QP 解算器的 $\mathbf{a}_n^\top$ 是哪一組？

1. $\mathbf{a}_1^\top = [-1, 0, 0]$，$\mathbf{a}_2^\top = [-1, 2, 2]$，$\mathbf{a}_3^\top = [-1, 2, 0]$，$\mathbf{a}_4^\top = [-1, 3, 0]$
2. $\mathbf{a}_1^\top = [1, 0, 0]$，$\mathbf{a}_2^\top = [1, -2, -2]$，$\mathbf{a}_3^\top = [-1, 2, 0]$，$\mathbf{a}_4^\top = [-1, 3, 0]$
3. $\mathbf{a}_1^\top = [1, 0, 0]$，$\mathbf{a}_2^\top = [1, 2, 2]$，$\mathbf{a}_3^\top = [1, 2, 0]$，$\mathbf{a}_4^\top = [1, 3, 0]$
4. $\mathbf{a}_1^\top = [-1, 0, 0]$，$\mathbf{a}_2^\top = [-1, -2, -2]$，$\mathbf{a}_3^\top = [1, 2, 0]$，$\mathbf{a}_4^\top = [1, 3, 0]$

**答案：4。** 講義的解答只有一行：$\mathbf{a}_n^\top = y_n\begin{bmatrix} 1 & \mathbf{x}_n^\top \end{bmatrix}$。照著算：

- $\mathbf{a}_1^\top = (-1)[1, 0, 0] = [-1, 0, 0]$
- $\mathbf{a}_2^\top = (-1)[1, 2, 2] = [-1, -2, -2]$
- $\mathbf{a}_3^\top = (+1)[1, 2, 0] = [1, 2, 0]$
- $\mathbf{a}_4^\top = (+1)[1, 3, 0] = [1, 3, 0]$

每一列乘上 $\mathbf{u} = (b, w_1, w_2)$ 就是前面的限制式 (i) 到 (iv)，例如第二列是 $-b - 2w_1 - 2w_2 \ge 1$。把手算的最佳解 $\mathbf{u} = (-1, 1, -1)$ 代進去，四列分別得到 $1, 1, 1, 2$，都至少是 1；$\frac{1}{2}\mathbf{u}^\top Q\mathbf{u} = \frac{1}{2}(1 + 1) = 1$，跟手算的目標值一致。本文另外把這組 $Q$、$\mathbf{p}$、$A$、$\mathbf{c}$ 交給數值的最佳化程式，得到的也是 $(b, w_1, w_2) = (-1, 1, -1)$。

其他選項各錯一處。選項 3 是 $[1, \mathbf{x}_n^\top]$，忘了乘 $y_n$。選項 1 是 $[-1, \mathbf{x}_n^\top]$，第一格全部寫成 $-1$，後面沒乘 $y_n$。選項 2 是 $[-y_n, y_n\mathbf{x}_n^\top]$，$\mathbf{x}_n$ 的部分對了，但 $b$ 的係數正負號反了。

## 胖為什麼有用：正則化與 VC 維度兩種解釋

```youtube
url: https://www.youtube.com/watch?v=7UUO_AamxcA
title: Linear SVM :: Reasons behind Large-Margin Hyperplane @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:08 從正則化看，02:08–05:29 large margin 限制了 dichotomy，05:29–09:26 演算法的 VC 維度，09:26–11:10 與特徵轉換搭配，11:10–11:55 Fun Time，之後是總結。）

這一節的式子改用 $\mathbf{z}_n$ 寫（講義第 23 頁），提醒你這套方法在轉換後的空間照樣能用。前面用測量誤差解釋過為什麼要胖，那是直覺上的說法。這一節補兩個跟基石理論接得上的解釋。

### 解釋一：SVM 是 E_in 等於 0 範圍內的 weight decay

把[基石第 14 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的正則化和 SVM 的標準問題放在一起（第 23 頁）：

| | 最小化的東西 | 限制式 |
|---|---|---|
| 正則化 | $E_{\text{in}}$ | $\mathbf{w}^\top\mathbf{w} \le C$ |
| SVM | $\mathbf{w}^\top\mathbf{w}$ | $E_{\text{in}} = 0$［and more］ |

正則化想把 $E_{\text{in}}$ 壓低，但怕過擬合，所以限制 $\mathbf{w}$ 的長度，只准用一小塊區域裡的 $\mathbf{w}$。SVM 把兩個角色對調：最小化的是 $\mathbf{w}$ 的長度，限制式是把資料全部分對。課堂上說兩者做的是一體兩面的事，最小化的對象和限制式交換了位置，但都是想同時顧到這兩件事。

表裡的「and more」指的是 SVM 的限制式比 $E_{\text{in}} = 0$ 還嚴格。分對只需要 $y_n(\mathbf{w}^\top\mathbf{z}_n + b) > 0$，SVM 要求的是 $\ge 1$。講義的結論是：SVM（large-margin hyperplane）就是在 $E_{\text{in}} = 0$ 之內做 weight-decay regularization。

### 解釋二：堅持要胖，能做出來的 dichotomy 變少

第二個解釋回到 VC 理論。[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)用 dichotomy 來數假說集的複雜度：給定 $N$ 個點，能產生幾種不同的圈圈叉叉組合。全部 $2^N$ 種都做得出來叫 shatter。

第 24 頁定義一個「large-margin 演算法」$\mathcal{A}_\rho$：如果存在 margin 至少是 $\rho$ 的分隔超平面 $g$，就回傳它；找不到就回傳 0，也就是不給答案。課堂上的比喻是找伴侶：這個演算法喜歡愈胖愈好，資料拿來找得到夠胖的，就選它；找不到夠胖的，寧可單身一輩子。

- **$\mathcal{A}_0$**：不計較胖瘦，跟 PLA 一樣。平面上一般位置的 3 個點，8 種標法都做得出來，可以 shatter。講義的圖畫了其中 4 種，課堂上說明另外 4 種是它們的對稱情形。
- **$\mathcal{A}_{1.126}$**：要求線至少 1.126 那麼胖。講義說這比 SVM 還嚴格（more strict than SVM），SVM 只是找最胖的，沒有規定最少要多胖。圖上同樣的 3 個點，全部標成圈圈時找得到夠胖的線；但有些標法裡，圈圈和叉叉靠得太近，中間塞不下那麼胖的線，$\mathcal{A}_{1.126}$ 做不出來。於是這 3 個點沒辦法被 shatter。

能做出來的 dichotomy 變少，複雜度就變低。講義把這條推論寫成：

> fewer dichotomies ⟹ smaller 'VC dim.' ⟹ better generalization

「VC dim.」加了引號，課堂上解釋這不是照基石的定義推出來的 VC 維度，可以把它想成有效的 VC 維度；它愈低，$E_{\text{in}}$ 與 $E_{\text{out}}$ 愈接近。

### 演算法的 VC 維度：單位圓上的例子

第 25 頁說明引號的原因。基石的 $d_{\text{VC}}(\mathcal{H})$ 是假說集的性質，跟資料無關（data-independent）。這裡談的 $d_{\text{VC}}(\mathcal{A}_\rho)$ 是演算法的性質：$\mathcal{A}_\rho$ 做不做得出某個 dichotomy，要看這批資料上找不找得到夠胖的線，所以跟資料有關（data-dependent）。講義註明這需要比 VC 更多的理論（need more than VC）。課堂上說這部分的嚴格推導要多花力氣，這裡只講概念：看這個演算法最多能 shatter 幾個點。

講義舉的情境是 $\mathcal{X}$ 為 $\mathbb{R}^2$ 裡的單位圓。課堂上說的是圓裡面的任意三個點，投影片的圖也是一個塗滿的圓，所以這裡指的是半徑為 1 的圓盤。

- $\rho = 0$：就是一般的 perceptron，$d_{\text{VC}} = 3$。
- $\rho > \frac{\sqrt{3}}{2}$：任何 3 個點都無法 shatter，$d_{\text{VC}} < 3$。講義給的理由是：其中一定有兩個點的距離不超過 $\sqrt{3}$。

這個理由講義只寫了一行，本文把它補完。

**為什麼一定有兩個點距離不超過 √3。** 三個點裡如果有一個在圓心，它到另外兩點的距離都不超過 1。否則，從圓心看這三個點有三個方向，三個方向繞一圈共 360 度，一定有兩個方向的夾角 $\theta$ 不超過 120 度。這兩個點到圓心的距離是 $r_1$ 與 $r_2$，都不超過 1。用餘弦定理，$\cos\theta \ge -\frac{1}{2}$，所以它們的距離平方是

$$
r_1^2 + r_2^2 - 2r_1r_2\cos\theta \ \le\ r_1^2 + r_2^2 + r_1r_2 \ \le\ 3
$$

**為什麼這樣就無法 shatter。** 把這兩個點一個標圈、一個標叉。分隔線要從兩點之間穿過，兩個點到線的距離相加，不超過它們之間的距離 $\sqrt{3}$（跟「兩個點的最胖分隔線」那題 Fun Time 的論證相同）。比較近的那個點到線的距離就不超過 $\frac{\sqrt{3}}{2}$，margin 也就不超過 $\frac{\sqrt{3}}{2}$。$\rho$ 大於這個數時，$\mathcal{A}_\rho$ 找不到合格的線，這種標法做不出來。8 種標法少了至少一種，就不是 shatter。

**套到一組具體的點（本文自擬，不在講義上）。** 取內接於單位圓的正三角形：$(0, 1)$、$\left(-\frac{\sqrt{3}}{2}, -\frac{1}{2}\right)$、$\left(\frac{\sqrt{3}}{2}, -\frac{1}{2}\right)$，邊長都是 $\sqrt{3}$。把上面那一點標成圈、下面兩點標成叉，最胖的分隔線是水平線 $x_2 = \frac{1}{4}$：上面的點在高度 1，下面兩點在高度 $-\frac{1}{2}$，中間隔 1.5，線放在正中間，margin 是 0.75。另外五種一對二的標法由對稱性也都是 0.75；三個點標成同一類時，線可以放得很遠，margin 要多大有多大。所以對這三個點來說，$\rho \le 0.75$ 的 $\mathcal{A}_\rho$ 可以 shatter，$\rho > 0.75$ 就不行。講義的門檻 $\frac{\sqrt{3}}{2} \approx 0.866$ 比 0.75 大，是一個對圓盤裡任何三個點都保證成立的充分條件。

講義接著給一般的結果：當 $\mathcal{X}$ 落在半徑為 $R$ 的超球（hyperball）內，

$$
d_{\text{VC}}(\mathcal{A}_\rho) \le \min\left(\frac{R^2}{\rho^2},\ d\right) + 1 \ \le\ \underbrace{d + 1}_{d_{\text{VC}}(\text{perceptrons})}
$$

這個式子講義沒有證明，本文也不證。它說了兩件事。第一，上界跟兩個量有關：資料散布的範圍 $R$，以及要求的胖瘦 $\rho$。課堂上的說法是，圓大一點就容得下比較胖的線，資料擠在小範圍裡就不行。第二，不管怎樣，它都不會比一般 perceptron 的 $d + 1$ 差；$\rho$ 夠大時，$\frac{R^2}{\rho^2}$ 那一項比 $d$ 小，上界就真的降下來了。課堂上把它總結成：多了一個控制複雜度的方式。

本文補充一個讀這個式子時要留意的地方，講義沒有寫。$\frac{R^2}{\rho^2}$ 不是整數時，照字面代進去會得到帶小數的數字。拿剛才的正三角形來對：$R = 1$、$\rho = 0.75$、$d = 2$ 時，$\min\left(\frac{16}{9},\ 2\right) + 1 = \frac{25}{9} \approx 2.78$，照字面讀是最多只能 shatter 2 個點。可是那三個點都落在半徑 1 的圓盤內，而且確實能被 $\mathcal{A}_{0.75}$ shatter：六種一對二的標法 margin 都是 0.75，兩種全部同一類的標法 margin 不受限制。所以 $\frac{R^2}{\rho^2}$ 不是整數時，這條式子不能照字面當成精確的上界來讀；它要傳達的是趨勢，$\rho$ 相對於 $R$ 愈大，能 shatter 的點愈少。這堂課實際用到的兩個數字不受影響：$\rho > \frac{\sqrt{3}}{2}$ 時無法 shatter 3 個點，是前面用兩點距離直接證出來的，沒有用到這條式子；Fun Time 的 $\frac{R^2}{\rho^2} = 16$ 剛好是整數。

### 配上特徵轉換：邊界數量不多，形狀又夠複雜

第 26 頁用一張表收尾：

| | large-margin 超平面 | 超平面 | 超平面＋特徵轉換 Φ |
|---|---|---|---|
| 能產生的邊界數量（#） | 更少（even fewer） | 不多（not many） | 很多（many） |
| 邊界的形狀 | 簡單 | 簡單 | 複雜（sophisticated） |

講義的兩句評語是：數量不多是好事，因為 $d_{\text{VC}}$ 小、泛化好；形狀複雜也是好事，因為 $E_{\text{in}}$ 有機會更低。課堂上回顧基石的做法：當初用超平面，是因為它的 $d_{\text{VC}}$ 不大、複雜度控制得住；但邊界太簡單可能做不好，才加上特徵轉換換取複雜的邊界。VC bound 的兩項都想顧好，可是原本的工具一次只顧得到一項。

large margin 給了新的組合。把 large-margin 超平面和大量的特徵轉換合起來：

| | large-margin 超平面＋大量特徵轉換 Φ |
|---|---|
| 能產生的邊界數量（#） | 不多 |
| 邊界的形狀 | 複雜 |

特徵轉換把數量推到「很多」，large margin 再把它拉回「不多」，同時保留複雜的形狀。講義稱它為 a new possibility: non-linear SVM。課堂上說，有了這個新的控制複雜度的方法，就可以更放心地使用各式各樣的特徵轉換。這正是 Course Design 裡第一類技巧要做的事：利用大量特徵，同時把複雜度管住。

### Fun Time：1126 維空間裡的上界

**題目（講義第 27 頁）：** 在 $\mathcal{Z}$ 空間跑 large-margin 演算法 $\mathcal{A}_\rho$，$\rho = \frac{1}{4}$。$\mathbf{z} = \boldsymbol{\Phi}(\mathbf{x})$ 有 1126 維（不含 $z_0$），而且 $\lVert\mathbf{z}\rVert \le 1$。用 $\min\left(\frac{R^2}{\rho^2}, d\right) + 1$ 算，$d_{\text{VC}}(\mathcal{A}_\rho)$ 的上界是多少？

1. $5$
2. $17$
3. $1126$
4. $1127$

**答案：2。** 講義的解答：$d = 1126$、$R = 1$，所以上界是 17。算式是

$$
\frac{R^2}{\rho^2} = \frac{1}{(1/4)^2} = 16, \qquad \min(16,\ 1126) + 1 = 17
$$

選項 1 的 5 是忘了平方，算成 $\frac{R}{\rho} + 1 = 4 + 1$。選項 3 是只取了 $d$。選項 4 的 1127 是一般 perceptron 的 $d + 1$，完全沒用到 margin。課堂上的評語是：明明在 1126 維的空間裡，只要堅持要胖，VC 維度的上界就只有 17 這麼小。

第 28 頁的總結把五個部分各收成一句：課程從基石走到技法；large-margin 的分隔超平面直覺上對雜訊比較 robust；標準問題是在特殊的縮放下最小化 $\mathbf{w}$ 的長度；SVM 可以用二次規劃「容易地」解；large margin 讓 dichotomy 變少、泛化變好。下一堂的預告是 solving non-linear Support Vector Machine。

## 自我檢查

**1. 三筆資料 $(4, 3)$ 標 $+1$、$(0, 0)$ 標 $-1$、$(6, 6)$ 標 $+1$，超平面是 $3x_1 + 4x_2 - 10 = 0$。算出三個點到它的距離與 margin，再把 $(b, \mathbf{w})$ 改寫成符合「最小的 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 等於 1」的縮放，確認 $1/\lVert\mathbf{w}\rVert$ 等於 margin。**

答案：$\mathbf{w} = (3, 4)$、$b = -10$、$\lVert\mathbf{w}\rVert = 5$。三個點的 $y_n \times$ 分數是 $12 + 12 - 10 = 14$、$(-1)(-10) = 10$、$18 + 24 - 10 = 32$，距離是 $2.8$、$2$、$6.4$，margin 是 2。最小值是 10，所以同除以 10：$\mathbf{w} = (0.3, 0.4)$、$b = -1$。這時 $\lVert\mathbf{w}\rVert = 0.5$，$1/\lVert\mathbf{w}\rVert = 2$，跟 margin 一致。

**2. 三筆資料 $(1, 0)$ 標 $-1$、$(3, 0)$ 標 $+1$、$(4, 4)$ 標 $+1$。照講義手算四個點的方法，解出 hard-margin SVM 的 $(b, \mathbf{w})$ 與 margin，並指出哪些點在胖邊界上。**

答案：限制式是 $-w_1 - b \ge 1$、$3w_1 + b \ge 1$、$4w_1 + 4w_2 + b \ge 1$。前兩條相加得 $2w_1 \ge 2$，$w_1 \ge 1$，所以 $\frac{1}{2}\mathbf{w}^\top\mathbf{w} \ge \frac{1}{2}$，等號要 $w_1 = 1$、$w_2 = 0$。代回去：第一條要 $b \le -2$，第二條要 $b \ge -2$，所以 $b = -2$；第三條是 $4 + 0 - 2 = 2 \ge 1$，成立。最佳解是 $\mathbf{w} = (1, 0)$、$b = -2$，也就是直線 $x_1 = 2$，margin 是 $1/\lVert\mathbf{w}\rVert = 1$。前兩個點的 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 是 1，在胖邊界上；$(4, 4)$ 是 2，不在邊界上，拿掉它答案不變。

**3. 為什麼可以把限制式「最小的 $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ 等於 1」換成「每個都至少是 1」？**

判準：答案要有三點。第一，後者是前者的必要條件，所以合法的範圍只會變大。第二，放寬後的最佳解不可能每個點都嚴格大於 1：若最小值是某個 $c > 1$，把 $(b, \mathbf{w})$ 同除以 $c$ 仍然合法，$\mathbf{w}$ 卻更短，跟最佳矛盾。第三，所以放寬後的最佳解本來就滿足原本的限制式，它同時是原問題的最佳解。只說「因為縮放沒差」不算答對，那是前一步（固定縮放）的理由。

**4. 資料有 $d = 3$ 個特徵、$N = 5$ 筆。寫出 QP 四個輸入的大小與 $Q$ 的內容。如果手上的解算器只接受 $\mathbf{a}_m^\top\mathbf{u} \le c_m$ 的形式，$\mathbf{a}_n$ 與 $c_n$ 要怎麼改？**

答案：$\mathbf{u}$ 有 4 個分量（$b$ 加 3 個 $w$）。$Q$ 是 $4 \times 4$，對角線是 $0, 1, 1, 1$，其他都是 0。$\mathbf{p}$ 是 4 個 0。$A$ 是 $5 \times 4$，第 $n$ 列是 $y_n[1, x_{n,1}, x_{n,2}, x_{n,3}]$。$\mathbf{c}$ 是 5 個 1。改成「≤」的形式時，不等式兩邊同乘 $-1$：$-\mathbf{a}_n^\top\mathbf{u} \le -1$，所以餵 $-y_n[1, \mathbf{x}_n^\top]$ 與 $-1$。

**5. 資料落在半徑 $R = 10$ 的球內，特徵有 $d = 50$ 維。用講義的式子算 $\rho = 2$ 與 $\rho = 1$ 時 $d_{\text{VC}}(\mathcal{A}_\rho)$ 的上界，並說明哪一個情況下 large margin 有幫上忙。**

答案：$\rho = 2$ 時 $\frac{R^2}{\rho^2} = 25$，上界是 $\min(25, 50) + 1 = 26$，比 perceptron 的 51 小，large margin 有用。$\rho = 1$ 時 $\frac{R^2}{\rho^2} = 100$，上界是 $\min(100, 50) + 1 = 51$，跟 perceptron 一樣，這個式子沒有給出更好的保證。margin 相對於資料的範圍要夠大，上界才降得下來。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把 linear SVM 與 dual SVM 排在同一週（W9，10/28），這堂的投影片代號是 `201u`。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W9（11/04），兩堂一起上。Fall 2026 這一週的 `201u_handout.pdf` 連結在 2026-09-30 打開是 404（當時課程才進行到 W4），所以本文只用 MOOC 版講義。MOOC 的講義與影片都可以免費取得。

**教科書。** 兩份課程頁都把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 e-8.1。e-Chapter 8 是 LFD 的線上章節，不在紙本書裡。

**作業。** 這堂在 Fall 2024 沒有專屬作業。相關的 [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止）主題是 kernel、soft-margin 與 aggregation，沒有官方解答；其中跟前兩堂 SVM 最接近的 Q1 與 Q13 用到的是對偶與「$\mathbf{w}$ 由資料表示」，放在[技法第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)說明。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。這堂最直接的練習是把自我檢查第 2 題換幾組自己擬的點再算一次，然後照 Linear Hard-Margin SVM 演算法的三步，把同一組資料交給手邊的 QP 工具，對一對答案。

**延伸閱讀。** [CS229 主講義第 6 章](https://cs229.stanford.edu/main_notes.pdf)用另一種方式推導 SVM，可以和這堂的 QP 寫法對照。[Caltech Learning from Data](https://work.caltech.edu/telecourse) 是 Abu-Mostafa 用同一本教科書開的英文課。

**下一堂。** [技法第 2 堂：對偶 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm) 處理這堂留下的問題：做了高維的特徵轉換之後，$\mathbf{u}$ 的分量變成 $\tilde{d} + 1$ 個，QP 會大到解不動，要換一個變數個數只跟資料量有關的等價問題。

## 課程影片來源

原始影片：[Course Introduction](https://www.youtube.com/watch?v=A-GxGCCAIrg)、[Large-Margin Separating Hyperplane](https://www.youtube.com/watch?v=8hak0XngnV0)、[Standard Large-Margin Problem](https://www.youtube.com/watch?v=lHo9GcIURRs)、[Support Vector Machine](https://www.youtube.com/watch?v=FAm70y081o4)、[Reasons behind Large-Margin Hyperplane](https://www.youtube.com/watch?v=7UUO_AamxcA)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-13：原本與第 2 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。

## 參考資料

- [技法第 1 堂講義 201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf)：本文的主要底本，五個部分的推導、四個點的例子與五題 Fun Time 都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：五支影片的 ID 與標題；文中「課堂上」的說法轉述自這五支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [基石第 12 堂講義 12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)：特徵轉換的兩筆代價，這堂的動機接在它後面。
- [基石第 14 堂講義 14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)：weight decay 的寫法，用來和 SVM 的標準問題對照。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次與 LFD 章節。
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)：作業主題與相關題號。
- [Learning from Data 教科書網站](http://amlbook.com)：e-8.1 的出處。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：延伸閱讀，第 6 章的 SVM 推導。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：延伸閱讀，使用同一本教科書的英文課。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置、基石四個問題與技法三類技巧各對應哪些堂次。
