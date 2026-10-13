---
title: "矩陣分解：從評分矩陣學出使用者與電影的特徵｜台大林軒田 機器學習技法 第 15 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, matrix-factorization, recommendation-system, sgd]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 32
tldr: "推薦系統的輸入只有使用者編號。把編號做 binary vector encoding、丟進拿掉 tanh 的 N-d̃-M 線性網路，假說就是 h(x) = WᵀVx，等於把評分矩陣寫成 R ≈ VᵀW。學 V 與 W 有兩條路：交替最小平方每輪解 M+N 個線性迴歸，SGD 每次只用一筆評分更新一位使用者與一部電影的向量。最後把 boosting、神經網路、RBF 網路、矩陣分解與 k 近鄰收成一張萃取模型的地圖。"
description: "台大林軒田機器學習技法第 15 堂 Matrix Factorization 導讀：類別特徵與 binary vector encoding、線性網路假說、矩陣分解、交替最小平方、SGD 的梯度推導與更新式、KDD Cup 2011 的時間順序技巧、萃取模型總整理，附一個 3×3 評分矩陣的手算例子。"
draft: false
glossary:
  - term: "矩陣分解"
    aliases: ["matrix factorization", "MF"]
    definition: "把只知道部分格子的評分矩陣 R 近似成兩個矩陣的乘積 VᵀW：V 的第 n 行是使用者 n 的 d̃ 維特徵 vₙ，W 的第 m 行是電影 m 的 d̃ 維特徵 wₘ，預測的評分是兩者的內積。"
    context: "技法第 15 堂從 N-d̃-M 的線性網路推出它，誤差只算在已知的評分上。"
    links:
      - label: "技法第 15 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf"
  - term: "交替最小平方"
    aliases: ["alternating least squares", "ALS"]
    definition: "矩陣分解的一種解法：固定使用者向量時，每部電影各做一次線性迴歸；固定電影向量時，每位使用者各做一次，兩邊輪流直到收斂。每一步 E_in 都不會上升，所以保證收斂，但只到區域最佳。"
    context: "技法第 15 堂用它和 SGD 兩種方法解矩陣分解。"
    links:
      - label: "技法第 15 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf"
  - term: "binary vector encoding"
    aliases: ["二元向量編碼", "one-hot encoding"]
    definition: "把有 K 種可能的類別特徵編成長度 K 的向量：對應的那一格是 1，其他都是 0。"
    context: "技法第 15 堂用它把使用者編號變成神經網路吃得下的數值輸入。"
  - term: "萃取模型"
    aliases: ["extraction model"]
    definition: "把特徵轉換當成隱藏變數，和最後的線性模型一起從資料學出來的模型。"
    context: "技法第三部分的總稱；第 15 堂把 boosting、神經網路、RBF 網路、矩陣分解、k 近鄰都放進這張地圖。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [215_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf) 與四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 15 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂屬於第三種 Distilling Implicit Features: Extraction Models，也是這個部分的最後一堂。上一堂[技法第 14 堂：RBF 網路](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization)在同一頁上被收成兩行：把以距離為準的相似度做線性組合，並用 k-means 分群找代表點。這堂換一個更極端的情境：輸入連數值都不是，只是一個使用者編號。

先備是[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的最小平方解、[基石第 11 堂：線性分類模型](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)的隨機梯度下降（SGD）、[技法第 12 堂：神經網路](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)的網路記號，以及上一堂 k-means 用過的交替最佳化。讀完之後，你應該能自己從 N-d̃-M 的網路推到 $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$，對一個小評分矩陣手算一輪交替最小平方與一步 SGD，並說出這兩種解法各自適合什麼情況。

整堂課的路線是：

1. **使用者編號**：類別特徵，要先編碼成數值。
2. **線性網路**：N-d̃-M 的神經網路，拿掉 tanh。
3. **矩陣分解**：把同一個假說寫成 $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$。
4. **兩種解法**：交替最小平方、SGD。
5. **萃取模型的地圖**：回顧技法第三部分的所有模型。

## 輸入只有使用者編號：從類別特徵到線性網路

```youtube
url: https://www.youtube.com/watch?v=2pX76iH_irw
title: Matrix Factorization :: Linear Network Hypothesis @ Machine Learning Techniques (機器學習技法)
```

（影片 00:19–01:00 複習上一堂，01:00–04:12 是推薦系統問題，04:12–08:24 類別特徵與編碼，08:24–13:29 把資料併起來餵給神經網路，13:29–15:30 討論 tanh，15:30–19:46 線性網路，之後是 Fun Time。）

### 推薦系統的資料長什麼樣子

講義第 2 頁回到[基石第 1 堂：機器學習是什麼](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)用過的例子。資料是「很多使用者替一些電影打過的分數」，要學到的能力是「預測某位使用者會替一部還沒評過的電影打幾分」。講義引的是 Netflix 在 2006 年辦的競賽：480,189 位使用者對 17,770 部電影給了 100,480,507 筆評分，把預測改善 10% 的隊伍可以拿到 100 萬美元獎金。

把資料依電影拆開。第 $m$ 部電影的資料集是

$$
\mathcal{D}_m = \big\{(\tilde{\mathbf{x}}_n = (n),\ y_n = r_{nm}) : \text{user } n \text{ rated movie } m\big\}
$$

輸入 $\tilde{\mathbf{x}}_n$ 只有編號 $n$，輸出是評分 $r_{nm}$。課堂上舉的例子是：3 號使用者替第 5 部電影評了分，那就是 $n = 3$、$m = 5$，他給的分數記成 $r_{35}$。

講義把這種輸入稱為抽象特徵（abstract feature）。課堂上解釋抽象在哪裡：我們不知道這位使用者的性別、年齡、喜歡哪一類電影，手上只有一個編號和他評過分的紀錄。以前每個模型拿到的 $\mathbf{x}$ 多少帶有可以直接拿來加權的數值，這裡沒有，所以課堂上說這是一個困難的機器學習問題。

本文補充一個數量上的感覺：這份資料的評分矩陣有 $480{,}189 \times 17{,}770 \approx 85.3$ 億格，已知的 1.005 億筆只占 1.18%。這堂課要做的事，是靠這 1% 多的格子去猜其他的格子。

### 類別特徵要先編碼

第 3 頁給這種輸入一個正式的名字：類別特徵（categorical feature）。使用者編號像 1126、5566、6211，講義另外舉了血型（A、B、AB、O）與程式語言（C、C++、Java、Python）。課堂上強調編號沒有數值上的意義：6211 號使用者並沒有比 1126 號「大」，頂多跟註冊的先後有點關係。

到目前為止學過的模型，大部分吃的是數值特徵（numerical feature）。講義列了兩類：線性模型，以及神經網路這類線性模型的延伸。課堂上的理由是，線性模型要把特徵加權算出一個分數，每個特徵得先是數字才加得起來；神經網路一層一層做的也是同一件事。講義標出的例外是決策樹，課堂上補充它的延伸（隨機森林、梯度提升決策樹）也可以直接處理類別特徵。

所以第一步是把類別換成數值，這個預先定好的特徵轉換叫編碼（encoding）。講義用的是最簡單的一種，binary vector encoding：有幾種可能就用幾維的向量，每一種可能占一個位置。

$$
\text{A} = [1\ 0\ 0\ 0]^\top,\quad \text{B} = [0\ 1\ 0\ 0]^\top,\quad \text{AB} = [0\ 0\ 1\ 0]^\top,\quad \text{O} = [0\ 0\ 0\ 1]^\top
$$

套到使用者編號上：有 $N$ 位使用者，第 $n$ 位的編碼 $\mathbf{x}_n$ 是一個 $N$ 維向量，第 $n$ 格是 1，其他都是 0。

### 把各部電影的資料併成一份，交給神經網路

第 4 頁先把 $\mathcal{D}_m$ 的輸入換成編碼後的 $\mathbf{x}_n$，再把所有電影的資料併成一份，一位使用者一筆：

$$
\mathcal{D} = \Big\{\big(\mathbf{x}_n = \text{BinaryVectorEncoding}(n),\ \mathbf{y}_n = [r_{n1}\ \ ?\ \ ?\ \ r_{n4}\ \ r_{n5}\ \ \dots\ \ r_{nM}]^\top\big)\Big\}
$$

$\mathbf{y}_n$ 是 $M$ 維的評分向量，第 $m$ 格是這位使用者給第 $m$ 部電影的分數，沒評過的格子是問號。課堂上的描述是：使用者看過第 1 部就把分數放進第 1 格，沒看過第 2、3 部，那兩格就留空。

編碼後的 $\mathbf{x}_n$ 雖然是數值，仍然很抽象。課堂上說，要知道使用者的喜好，就得把這個向量轉成真正描述使用者的特徵，而我們學過的模型裡，神經網路正是做特徵萃取的典型。於是講義提出：用一個 $N$-$\tilde{d}$-$M$ 的神經網路，輸入層 $N$ 個節點（使用者數），隱藏層 $\tilde{d}$ 個神經元，輸出層 $M$ 個節點（電影數）。講義第 4 頁的圖畫的是 4 個輸入、2 個 tanh 隱藏神經元、3 個線性輸出的小網路，第一層權重標 $w_{ni}^{(1)}$，第二層標 $w_{im}^{(2)}$。

兩個細節：

- 講義註明這個網路「without all $x_0^{(\ell)}$」，每一層都不放常數項。課堂上說這只是為了讓式子簡單，要加回去也可以，會推出稍微不同的模型。
- 多輸入、多輸出、中間一層的網路並不陌生。課堂上提醒，[技法第 13 堂：深度學習](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning)的 autoencoder 就是這個形狀。

### 隱藏層的 tanh 可以拿掉

第 4 頁最底下問了一句：is tanh necessary? 課堂上的回答是，在這個應用裡不見得必要，理由來自輸入的形狀。

$\mathbf{x}_n$ 只有第 $n$ 格是 1。第 $i$ 個隱藏神經元收到的加權總和是 $\sum_{k=1}^{N} w_{ki}^{(1)} x_k$，裡面只有 $k = n$ 那一項不是 0，結果就是 $w_{ni}^{(1)}$ 這一個權重。課堂上的說法是：只有是 1 的那個輸入有訊號送進隱藏層，其他的連線跟不存在一樣。經過 tanh 之後，神經元輸出 $\tanh(w_{ni}^{(1)})$。

所以第 $n$ 位使用者在隱藏層得到的向量，就是「他自己那 $\tilde{d}$ 個權重各取一次 tanh」。這些權重只在這位使用者身上用到，不跟別人共用。那不如直接把 tanh 之後的值當成要學的變數，中間不做任何轉換；課堂上說，在原來的權重裡還是找得到對應的方式來描述同一件事。

本文補充這個「對應」的細節。tanh 版的網路把第一層權重設成 $u_{ni}$ 時，換成沒有 tanh 的網路只要取 $v_{ni} = \tanh(u_{ni})$，輸出完全一樣。例如某位使用者的兩個權重是 $(2.0, -0.7)$，tanh 之後是 $(0.964, -0.604)$，線性版直接把權重設成 $(0.964, -0.604)$ 就好。反方向要多一步：tanh 的輸出只會落在 $-1$ 到 $1$ 之間，線性版的權重沒有這個限制；不過第二層的權重可以整體放大、第一層對應縮小，把範圍補回來。一般的神經網路不能這樣做，因為一般的輸入每一格都有值，隱藏神經元收到的是很多項的加權總和，tanh 不能併進任何一個權重裡。

### 線性網路假說

拿掉 tanh 的網路，講義第 5 頁稱為線性網路（linear network）。課堂上特別說這裡是 Linear Network 而不是 Neural Network，概念上和技法第 13 堂的 linear autoencoder 很接近。網路只有兩層，帶著上標 $(1)$、$(2)$ 太囉嗦，所以講義把權重重新命名：

| 新名字 | 原本的權重 | 大小 | 每一行（column）是什麼 |
|---|---|---|---|
| $\mathrm{V}^\top$ | 第一層 $[w_{ni}^{(1)}]$ | $N \times \tilde{d}$ | — |
| $\mathrm{V}$ | 上面的轉置 | $\tilde{d} \times N$ | 第 $n$ 行 $\mathbf{v}_n$：使用者 $n$ 的 $\tilde{d}$ 個權重 |
| $\mathrm{W}$ | 第二層 $[w_{im}^{(2)}]$ | $\tilde{d} \times M$ | 第 $m$ 行 $\mathbf{w}_m$：連到第 $m$ 個輸出的 $\tilde{d}$ 個權重 |

假說寫成矩陣運算：

$$
\mathbf{h}(\mathbf{x}) = \mathrm{W}^\top\mathrm{V}\mathbf{x}
$$

課堂上帶著檢查了一次維度：$\mathbf{x}$ 是 $N \times 1$，$\mathrm{V}$ 是 $\tilde{d} \times N$，所以 $\mathrm{V}\mathbf{x}$ 是 $\tilde{d} \times 1$ 的隱藏層輸出；$\mathrm{W}^\top$ 是 $M \times \tilde{d}$，最後的輸出是 $M \times 1$，每一格是一部電影的預測評分。

對第 $n$ 位使用者，$\mathbf{x}_n$ 只有第 $n$ 格是 1，矩陣乘上這種向量就是把矩陣的第 $n$ 行取出來：

$$
\mathrm{V}\mathbf{x}_n = \mathbf{v}_n, \qquad \mathbf{h}(\mathbf{x}_n) = \mathrm{W}^\top\mathbf{v}_n
$$

課堂上說，這一步看起來是矩陣乘向量，其實只是從矩陣裡取一行出來。$\mathbf{v}_n$ 就是第 $n$ 位使用者經過特徵轉換之後的樣子，代表他的某種喜好。講義把這一頁的任務寫成一行：linear network for recommender system: learn $\mathrm{V}$ and $\mathrm{W}$。

**一個走得完的小例子（本文自擬，不在講義上）。** 取講義圖上的大小：$N = 4$ 位使用者、$\tilde{d} = 2$、$M = 3$ 部電影。隨手設

$$
\mathrm{V} = \begin{bmatrix} 2 & 0 & 1 & 1 \\ 1 & 2 & 0 & 2 \end{bmatrix}, \qquad \mathrm{W} = \begin{bmatrix} 1 & 0 & 2 \\ 2 & 1 & 0 \end{bmatrix}
$$

3 號使用者的編碼是 $\mathbf{x}_3 = [0\ 0\ 1\ 0]^\top$。$\mathrm{V}\mathbf{x}_3$ 的第一個分量是 $2 \cdot 0 + 0 \cdot 0 + 1 \cdot 1 + 1 \cdot 0 = 1$，第二個分量是 $1 \cdot 0 + 2 \cdot 0 + 0 \cdot 1 + 2 \cdot 0 = 0$，得到 $(1, 0)$，正是 $\mathrm{V}$ 的第 3 行。再乘上 $\mathrm{W}^\top$，三部電影的預測分別是 $\mathbf{w}_1^\top\mathbf{v}_3 = 1 \cdot 1 + 2 \cdot 0 = 1$、$\mathbf{w}_2^\top\mathbf{v}_3 = 0$、$\mathbf{w}_3^\top\mathbf{v}_3 = 2$。四位使用者都算一遍：

| 使用者 | $\mathbf{v}_n$ | 電影 1 | 電影 2 | 電影 3 |
|---|---|---|---|---|
| 1 | $(2, 1)$ | 4 | 1 | 4 |
| 2 | $(0, 2)$ | 4 | 2 | 0 |
| 3 | $(1, 0)$ | 1 | 0 | 2 |
| 4 | $(1, 2)$ | 5 | 2 | 2 |

這張 $4 \times 3$ 的表就是這個假說對所有（使用者，電影）組合的預測。整張表由 $\mathrm{V}$ 的 8 個數字與 $\mathrm{W}$ 的 6 個數字決定，這正是下面 Fun Time 在算的事。

### Fun Time：線性網路有幾個變數

**題目（第 6 頁）：** 有 $N$ 位使用者、$M$ 部電影、$\tilde{d}$ 個「特徵」，要指定一個線性網路假說 $\mathbf{h}(\mathbf{x}) = \mathrm{W}^\top\mathrm{V}\mathbf{x}$，需要幾個變數？

1. $N + M + \tilde{d}$
2. $N \cdot M \cdot \tilde{d}$
3. $(N + M) \cdot \tilde{d}$
4. $(N \cdot M) + \tilde{d}$

**答案：3。** 講義的解答是 $\mathrm{V}^\top$ 有 $N \cdot \tilde{d}$ 個、$\mathrm{W}$ 有 $\tilde{d} \cdot M$ 個；課堂上說就是第一層與第二層的權重數相加。上面的小例子是 $(4 + 3) \times 2 = 14$，和 $8 + 6$ 相符。

其他選項錯在哪裡：選項 1 把每位使用者、每部電影都只算成一個數字，但各自其實是一個 $\tilde{d}$ 維向量。選項 2 是把三個數量全部相乘，那是「每一對使用者與電影都各有一組 $\tilde{d}$ 個權重」才會有的數量，線性網路裡使用者的向量是所有電影共用的。選項 4 的 $N \cdot M$ 是評分矩陣的格子數，不是模型的變數。

本文補充：變數個數比格子數少很多，是這個模型能預測沒看過的格子的原因。以 Netflix 的規模取 $\tilde{d} = 100$，變數是 $(480{,}189 + 17{,}770) \times 100 = 49{,}795{,}900$ 個，大約是 85.3 億格的 171 分之一。

## 把評分矩陣拆成兩個矩陣：交替最小平方

```youtube
url: https://www.youtube.com/watch?v=3l5kaWkcR6s
title: Matrix Factorization :: Basic Matrix Factorization @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:06 是每部電影一個線性模型與 $E_{\text{in}}$，03:06–06:50 矩陣分解，06:50–11:12 交替最小化，11:12–12:48 演算法與收斂，12:48–15:54 和 linear autoencoder 對照，之後是 Fun Time。）

### 每部電影一個線性模型，共用一個特徵轉換

第 7 頁換一個角度讀同一個假說。把 $\mathrm{V}\mathbf{x}$ 記成 $\boldsymbol{\Phi}(\mathbf{x})$：

$$
\mathbf{h}(\mathbf{x}) = \mathrm{W}^\top \underbrace{\mathrm{V}\mathbf{x}}_{\boldsymbol{\Phi}(\mathbf{x})}
$$

只看第 $m$ 部電影的輸出，用到的是 $\mathrm{W}^\top$ 的第 $m$ 列，也就是 $\mathbf{w}_m^\top$：

$$
h_m(\mathbf{x}) = \mathbf{w}_m^\top\boldsymbol{\Phi}(\mathbf{x})
$$

這就是一個做過特徵轉換的線性模型。講義加了一句 subject to shared transform $\boldsymbol{\Phi}$：$M$ 部電影各有自己的 $\mathbf{w}_m$，但共用同一個轉換。課堂上說，這個轉換把使用者那些抽象的特徵，轉成對使用者具體的描述。

我們希望對每一筆已知的評分，$r_{nm} = y_n \approx \mathbf{w}_m^\top\mathbf{v}_n$。用平方誤差，把所有 $\mathcal{D}_m$ 的資料合起來算 $E_{\text{in}}$：

$$
E_{\text{in}}(\{\mathbf{w}_m\}, \{\mathbf{v}_n\}) = \frac{1}{\sum_{m=1}^{M} \lvert\mathcal{D}_m\rvert} \sum_{\text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2
$$

加總只跑已知的評分，問號的格子不算。前面的係數是「已知評分總筆數」的倒數，講義把它印成灰色。課堂上解釋，做最佳化時它只是一個常數，不影響最佳解在哪裡，之後就不特別管它。把這個 $E_{\text{in}}$ 做到最小，等於同時學到兩件事：怎麼轉換（$\mathrm{V}$），以及轉換之後每部電影的線性模型（$\mathrm{W}$）。講義的說法是 transform and linear models jointly learned from all $\mathcal{D}_m$。

### 同一件事寫成矩陣分解

第 8 頁把目標換一個寫法。內積可以對調，所以

$$
r_{nm} \approx \mathbf{w}_m^\top\mathbf{v}_n = \mathbf{v}_n^\top\mathbf{w}_m \quad\Longleftrightarrow\quad \mathrm{R} \approx \mathrm{V}^\top\mathrm{W}
$$

$\mathrm{R}$ 是 $N \times M$ 的評分矩陣，每一列（row）是一位使用者，每一行（column）是一部電影。講義的示意表是這樣：

| $\mathrm{R}$ | movie 1 | movie 2 | … | movie M |
|---|---|---|---|---|
| user 1 | 100 | 80 | … | ? |
| user 2 | ? | 70 | … | 90 |
| … | … | … | … | … |
| user N | ? | 60 | … | 0 |

$\mathrm{V}^\top$ 的第 $n$ 列是 $\mathbf{v}_n^\top$，$\mathrm{W}$ 的第 $m$ 行是 $\mathbf{w}_m$，兩個矩陣相乘之後第 $(n, m)$ 格就是 $\mathbf{v}_n^\top\mathbf{w}_m$。課堂上舉的是 1 號使用者與 2 號電影：$\mathbf{v}_1$ 與 $\mathbf{w}_2$ 的內積，要和表上那一格的評分接近。把一個矩陣拆成兩個矩陣的乘積，這就是矩陣分解（matrix factorization）名字的由來；特別的是我們只知道 $\mathrm{R}$ 的一部分格子。

同一頁的圖沿用基石第 1 堂的畫法。上面一排是觀眾（viewer）的因子：喜不喜歡喜劇、喜不喜歡動作片、偏不偏好賣座大片、喜不喜歡湯姆克魯斯。下面一排是電影（movie）對應的因子：喜劇成分、動作成分、是不是賣座大片、有沒有湯姆克魯斯。上下一對一配對，各因子的貢獻加起來就是預測的評分。課堂上補充了 $\mathbf{w}_m$ 的意思：它可以讀成這部電影裡有哪些元素；使用者喜歡喜劇、電影也是喜劇，配在一起分數就高。

套一組數字看（本文自擬）：取 $\tilde{d} = 2$，第一維當「喜劇」、第二維當「動作」。某位使用者 $\mathbf{v} = (0.9, 0.2)$，喜劇片 $\mathbf{w}_A = (4, 1)$，動作片 $\mathbf{w}_B = (1, 4)$。預測評分是 $0.9 \times 4 + 0.2 \times 1 = 3.8$ 與 $0.9 \times 1 + 0.2 \times 4 = 1.7$，喜劇片高出不少。

講義把學習流程寫成三步：已知的評分 → 學出因子 $\mathbf{v}_n$ 與 $\mathbf{w}_m$ → 預測未知的評分。頁面上還有一句：similar modeling can be used for other abstract features。課堂上說，這類模型常用來把使用者 ID、電影 ID 這種抽象的特徵，轉成有意義、可以再處理的特徵。

本文補充一個讀這張圖時要小心的地方。「這一維是喜劇」是事後的詮釋，模型不會替每一維標上名字，而且分解本身不唯一。取任何可逆的 $\tilde{d} \times \tilde{d}$ 矩陣 $\mathrm{A}$，把 $\mathrm{V}$ 換成 $\mathrm{A}\mathrm{V}$、$\mathrm{W}$ 換成 $(\mathrm{A}^{-1})^\top\mathrm{W}$，乘積 $(\mathrm{A}\mathrm{V})^\top(\mathrm{A}^{-1})^\top\mathrm{W} = \mathrm{V}^\top\mathrm{A}^\top(\mathrm{A}^\top)^{-1}\mathrm{W} = \mathrm{V}^\top\mathrm{W}$ 不變，每一格的預測與 $E_{\text{in}}$ 都一樣。最簡單的情況是所有 $\mathbf{v}_n$ 乘 2、所有 $\mathbf{w}_m$ 除以 2。

### 兩組變數，輪流解

第 9 頁寫下最佳化問題。把灰色的常數拿掉，並依電影分組：

$$
\min_{\mathrm{W}, \mathrm{V}} E_{\text{in}}(\{\mathbf{w}_m\}, \{\mathbf{v}_n\}) \ \propto \sum_{\text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2 = \sum_{m=1}^{M} \bigg( \sum_{(\mathbf{x}_n, r_{nm}) \in \mathcal{D}_m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2 \bigg)
$$

變數有兩組，$\{\mathbf{w}_m\}$ 與 $\{\mathbf{v}_n\}$。課堂上說，兩組要一起解我們不見得會，但上一堂學 k-means 時用過一招：兩組變數不會一起解，就一組一組來，也就是交替最小化（alternating minimization）。

**固定 $\mathbf{v}_n$，解 $\mathbf{w}_m$。** 用線性網路的話來說，是第一層固定、只調第二層。看上面的雙重加總：$\mathbf{w}_m$ 只出現在外層第 $m$ 個括號裡。課堂上的例子是，1126 號電影的 $\mathbf{w}_{1126}$ 只會出現在第 1126 項，別的項都沒有它。所以整個問題拆成 $M$ 個互不相干的小問題，第 $m$ 個是

$$
\min_{\mathbf{w}_m} \sum_{(\mathbf{x}_n, r_{nm}) \in \mathcal{D}_m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2
$$

輸入是固定的 $\mathbf{v}_n$，想要的輸出是 $r_{nm}$，誤差是平方誤差，要找一個權重向量。這就是線性迴歸，講義的說法是 simply per-movie linear regression without $w_0$。課堂上提醒，它和基石裡的線性迴歸差在沒有常數項 $w_0$。

講義沒有把解寫出來，本文補上。對 $\mathbf{w}_m$ 取梯度並令它為 $\mathbf{0}$：

$$
-2\sum_{n \in \mathcal{D}_m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)\mathbf{v}_n = \mathbf{0} \quad\Longrightarrow\quad \Big(\sum_{n \in \mathcal{D}_m} \mathbf{v}_n\mathbf{v}_n^\top\Big)\mathbf{w}_m = \sum_{n \in \mathcal{D}_m} r_{nm}\mathbf{v}_n
$$

這裡用到 $(\mathbf{w}_m^\top\mathbf{v}_n)\mathbf{v}_n = \mathbf{v}_n\mathbf{v}_n^\top\mathbf{w}_m$。它就是基石第 9 堂的 $\mathrm{X}^\top\mathrm{X}\mathbf{w} = \mathrm{X}^\top\mathbf{y}$：把評過這部電影的使用者的 $\mathbf{v}_n^\top$ 疊成 $\mathrm{X}$ 的各列，他們的評分疊成 $\mathbf{y}$。$\tilde{d} = 1$ 時向量都變成純量，解是

$$
w_m = \frac{\sum_{n \in \mathcal{D}_m} r_{nm} v_n}{\sum_{n \in \mathcal{D}_m} v_n^2}
$$

評過這部電影的人數比 $\tilde{d}$ 少時，左邊的矩陣不可逆，要像基石第 9 堂那樣改用 pseudo-inverse。

**固定 $\mathbf{w}_m$，解 $\mathbf{v}_n$。** 課堂上先替學生說出困惑：從上面依電影分組的式子看，$\mathbf{v}_n$ 散在很多個括號裡，好像沒辦法拆。答案是對稱性。在 $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$ 裡把所有矩陣都轉置，使用者和電影的角色就互換了。同一個加總改成依使用者分組：

$$
\sum_{\text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2 = \sum_{n=1}^{N} \bigg( \sum_{m:\ \text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{v}_n^\top\mathbf{w}_m\big)^2 \bigg)
$$

現在 $\mathbf{v}_n$ 只出現在第 $n$ 個括號裡。固定所有 $\mathbf{w}_m$ 之後，每位使用者各解一個線性迴歸：輸入是他評過的那些電影的 $\mathbf{w}_m$，輸出是他給的分數，要找的權重是 $\mathbf{v}_n$。講義寫 per-user linear regression without $v_0$, by symmetry between users/movies。解的形式和上面一樣，把 $\mathbf{v}$ 與 $\mathbf{w}$ 對調就好。

### 交替最小平方演算法

輪流做這兩件事，講義第 9 頁稱為 alternating least squares algorithm（交替最小平方，常縮寫成 ALS），第 10 頁列出步驟：

1. 初始化 $\tilde{d}$ 維的向量 $\{\mathbf{w}_m\}$、$\{\mathbf{v}_n\}$。
2. 反覆做下面兩步，直到收斂：
   1. 最佳化 $\mathbf{w}_1, \dots, \mathbf{w}_M$：對第 $m$ 部電影，在 $\{(\mathbf{v}_n, r_{nm})\}$ 上做線性迴歸來更新 $\mathbf{w}_m$。
   2. 最佳化 $\mathbf{v}_1, \dots, \mathbf{v}_N$：對第 $n$ 位使用者，在 $\{(\mathbf{w}_m, r_{nm})\}$ 上做線性迴歸來更新 $\mathbf{v}_n$。

兩個說明：

- **初始化**：講義寫 usually just randomly。課堂上的理由是，設成太特別的值，最佳化可能沒辦法好好進行，就像之前的神經網路一樣。SGD 那一節的 Fun Time 會看到一個實際的例子。
- **收斂**：講義寫 guaranteed as $E_{\text{in}}$ decreases during alternating minimization。課堂上多講了一半：$E_{\text{in}}$ 是平方和，有下界 0；每一步又都讓它變小，所以它會收斂到某個值，和 k-means 的論證一樣。本文補充為什麼每一步都不會讓 $E_{\text{in}}$ 上升：每個小問題的線性迴歸解是「其他變數固定時」那一項的最小值，目前的值也是候選之一，新值不可能比它差。

講義把這個演算法叫作使用者與電影之間的 tango。課堂上的畫面是：使用者是跳舞的一方，電影是另一方，一個人動完換另一個人動，兩邊有默契地一起把最佳化做完。

### 數值例子：3×3 評分矩陣跑交替最小平方

以下是本文自擬的例子，不在講義上。三位使用者、三部電影，評分 1 到 5 分，九格裡知道六格：

| | 電影 1 | 電影 2 | 電影 3 |
|---|---|---|---|
| 使用者 1 | 5 | 3 | ? |
| 使用者 2 | 4 | ? | 1 |
| 使用者 3 | ? | 2 | 1 |

取 $\tilde{d} = 1$，每位使用者與每部電影都只有一個數字，線性迴歸的解就是上面那條 $\tilde{d} = 1$ 的公式，可以完全手算。這裡的 $E_{\text{in}}$ 用講義第 9 頁「正比於」的版本，也就是六筆平方誤差的總和，不除以 6。為了讓讀者能照著算，初始值不用亂數，取 $v_1 = v_2 = v_3 = 1$。

**第 1 輪，更新電影。** 每部電影只看評過它的人：

- $w_1 = \dfrac{5 \cdot 1 + 4 \cdot 1}{1^2 + 1^2} = 4.5$（使用者 1、2）
- $w_2 = \dfrac{3 \cdot 1 + 2 \cdot 1}{1^2 + 1^2} = 2.5$（使用者 1、3）
- $w_3 = \dfrac{1 \cdot 1 + 1 \cdot 1}{1^2 + 1^2} = 1$（使用者 2、3）

所有 $v_n$ 都是 1 的時候，$w_m$ 就是那部電影的平均分數。此時六筆殘差是 $5 - 4.5$、$3 - 2.5$、$4 - 4.5$、$1 - 1$、$2 - 2.5$、$1 - 1$，$E_{\text{in}} = 4 \times 0.25 = 1$。

**第 1 輪，更新使用者。** 每位使用者只看他評過的電影：

- $v_1 = \dfrac{5 \cdot 4.5 + 3 \cdot 2.5}{4.5^2 + 2.5^2} = \dfrac{30}{26.5} = \dfrac{60}{53} \approx 1.132$
- $v_2 = \dfrac{4 \cdot 4.5 + 1 \cdot 1}{4.5^2 + 1^2} = \dfrac{19}{21.25} = \dfrac{76}{85} \approx 0.894$
- $v_3 = \dfrac{2 \cdot 2.5 + 1 \cdot 1}{2.5^2 + 1^2} = \dfrac{6}{7.25} = \dfrac{24}{29} \approx 0.828$

$E_{\text{in}}$ 降到 $\dfrac{10972}{130645} \approx 0.0840$。這三個數字的意思是：使用者 1 給分比「電影的平均水準」高一成多，使用者 2、3 偏低。

**繼續跑。** 用 Python 接著算（前幾輪用分數精確計算，之後用浮點數）：

| 輪次 | 更新電影之後的 $E_{\text{in}}$ | 更新使用者之後的 $E_{\text{in}}$ |
|---|---|---|
| 1 | 1 | 0.0840 |
| 2 | 0.0289 | 0.0182 |
| 3 | 0.0149 | 0.0139 |
| 5 | — | 0.013415 |
| 10 | — | 0.013411 |
| 20 以後 | — | 0.013411（不再變動） |

每半輪 $E_{\text{in}}$ 都往下，和收斂的論證一致。收斂時 $v = (1.137, 0.903, 0.778)$、$w = (4.409, 2.616, 1.183)$，$\mathrm{V}^\top\mathrm{W}$ 的九格是：

| | 電影 1 | 電影 2 | 電影 3 |
|---|---|---|---|
| 使用者 1 | 5.015 | 2.975 | **1.346** |
| 使用者 2 | 3.982 | **2.363** | 1.068 |
| 使用者 3 | **3.431** | 2.036 | 0.921 |

**這個結果代表什麼。** 六個已知的格子都重建到誤差 0.08 以內。粗體的三格是原本的問號，現在有了預測：例如使用者 3 沒看過電影 1，模型猜他會給 3.4 分左右，理由是電影 1 的 $w$ 最大，而使用者 3 的 $v$ 是三人裡最小的。$E_{\text{in}}$ 停在 0.0134 而不是 0，因為這六個數字沒辦法被 $\tilde{d} = 1$ 的模型完全吻合：使用者 1 說電影 1 比電影 2 是 $5 : 3$，使用者 3 說電影 2 比電影 3 是 $2 : 1$，合起來電影 1 比電影 3 應該是 $10 : 3$，但使用者 2 給的是 $4 : 1$。

談矩陣分解的寫法時說過分解不唯一，這裡也看得到：把 $v$ 全部乘 2、$w$ 全部除以 2，九格的預測一模一樣。能比較的是同一組解裡誰大誰小，單獨一個數字沒有絕對的意義。

### 和 linear autoencoder 對照

第 11 頁把矩陣分解和技法第 13 堂的 linear autoencoder 並排。課堂上的切入點是：linear autoencoder 裡其實也藏著矩陣分解。它把 $\mathrm{X}$ 寫成 $\mathrm{W}(\mathrm{W}^\top\mathrm{X})$，把 $\mathrm{W}^\top\mathrm{X}$ 當成一個新的矩陣，就是把 $\mathrm{X}$ 拆成兩個矩陣的乘積。

| | Linear Autoencoder | Matrix Factorization |
|---|---|---|
| 形式 | $\mathrm{X} \approx \mathrm{W}(\mathrm{W}^\top\mathrm{X})$ | $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$ |
| 出發點 | 特殊的 $d$-$\tilde{d}$-$d$ 線性網路 | $N$-$\tilde{d}$-$M$ 線性網路 |
| 誤差 | 所有 $x_{ni}$ 上的平方誤差 | 只算已知 $r_{nm}$ 的平方誤差 |
| 解 | 全域最佳，在 $\mathrm{X}^\top\mathrm{X}$ 的特徵向量 | 區域最佳，用交替最小平方 |
| 用途 | 萃取降維後的特徵 | 萃取使用者與電影的隱藏特徵 |

逐列補上課堂上的說明。出發點那一列的「特殊」，指的是 autoencoder 限制了兩層權重之間要有關係（編碼用 $\mathrm{W}^\top$，解碼用同一個 $\mathrm{W}$）。誤差那一列：autoencoder 假設 $\mathrm{X}$ 的每一格都知道，矩陣分解沒看過的格子不知道怎麼算，就不算。解那一列：autoencoder 算出 $\mathrm{X}^\top\mathrm{X}$ 再求特徵向量就得到全域最佳解；矩陣分解沒有那麼容易得到全域最佳解，固定一個矩陣、最佳化另一個，這樣交替下去得到的是區域最佳解。

本文補充一個讀這張表時容易卡住的記號問題。技法第 13 堂推導時，$\mathrm{X}$ 是把每筆資料 $\mathbf{x}_n^\top$ 疊成一列的 $N \times d$ 矩陣，所以 $\mathrm{X}^\top\mathrm{X} = \sum_{n=1}^{N}\mathbf{x}_n\mathbf{x}_n^\top$ 是 $d \times d$ 的，表裡「$\mathrm{X}^\top\mathrm{X}$ 的特徵向量」沿用的是這個擺法。但同一欄最上面的 $\mathrm{X} \approx \mathrm{W}(\mathrm{W}^\top\mathrm{X})$ 要乘得起來（$\mathrm{W}$ 是 $d \times \tilde{d}$），$\mathrm{X}$ 得改成每一行（column）放一筆 $\mathbf{x}_n$ 的 $d \times N$ 矩陣；照這個擺法，同一個矩陣 $\sum_n \mathbf{x}_n\mathbf{x}_n^\top$ 要寫成 $\mathrm{X}\mathrm{X}^\top$。兩處指的是同一個 $d \times d$ 矩陣，只是 $\mathrm{X}$ 的方向不同，不必當成兩件事。

講義的結論是 linear autoencoder ≡ special matrix factorization of complete $\mathrm{X}$。課堂上的說法是，可以把矩陣分解看成更一般的、從資料裡萃取有用特徵的方式。

### Fun Time：一輪要解幾個最小平方問題

**題目（第 12 頁）：** 交替最小平方演算法在一輪交替裡，要解幾個最小平方問題？

1. 電影數 $M$
2. 使用者數 $N$
3. $M + N$
4. $M \cdot N$

**答案：3。** 講義的解答是 $M$ 個 per-movie 問題加上 $N$ 個 per-user 問題。課堂上定義了「一輪」：更新完所有電影的特徵，再更新完所有使用者的特徵。

選項 1 與 2 各只算了半輪。選項 4 是把每一格評分都當成一個迴歸問題；實際上一部電影的所有評分合起來才是一個迴歸問題，一個問題裡有很多筆資料。上面 3×3 的例子每輪解 $3 + 3 = 6$ 個；Netflix 的規模是 $17{,}770 + 480{,}189 = 497{,}959$ 個，每個都是 $\tilde{d}$ 個變數的小型線性迴歸。

## 一次只看一筆評分：用 SGD 做矩陣分解

```youtube
url: https://www.youtube.com/watch?v=br3IzOz-xMs
title: Matrix Factorization :: Stochastic Gradient Descent @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:37 回顧 SGD 與它的好處，01:37–06:00 推導單筆誤差的梯度，06:00–07:48 演算法，07:48–11:51 KDD Cup 2011 的做法，之後是 Fun Time。）

### 為什麼再找一種解法

第 13 頁把 $E_{\text{in}}$ 讀成很多項的總和，每一項對應一筆已知的評分：

$$
E_{\text{in}}(\{\mathbf{w}_m\}, \{\mathbf{v}_n\}) \ \propto \sum_{\text{user } n \text{ rated movie } m} \underbrace{\big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2}_{\text{err}(\text{user } n,\ \text{movie } m,\ \text{rating } r_{nm})}
$$

目標函數是一個大加總，正是基石第 11 堂 SGD 的適用情況。課堂上複習它的做法：不想每次把整個加總的梯度都算出來，就隨機挑一筆資料，只在跟這一筆有關的誤差上算梯度、往下走一步。講義列了三個好處，課堂上逐條說明：

- **每次迭代有效率**（講義把 efficient 加了引號）：每次只算跟一筆資料有關的東西。課堂上補了一句，它可能要跑很多很多輪，那是另一回事。
- **容易實作**：程式只牽涉單一筆資料。
- **容易換成別的誤差函數**：課堂上拿交替最小平方對照，那個演算法基本上是建築在平方誤差上的。

### 單筆誤差的梯度

第 14 頁推導 $\text{err} = (r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n)^2$ 對所有變數的梯度。模型的變數是 $N$ 個 $\mathbf{v}$ 向量與 $M$ 個 $\mathbf{w}$ 向量。

**跟這筆資料無關的向量，梯度是 $\mathbf{0}$。** 講義用具體的編號寫：

$$
\nabla_{\mathbf{v}_{1126}}\,\text{err}(\text{user } n, \text{movie } m, \text{rating } r_{nm}) = \mathbf{0} \ \ \text{unless } n = 1126
$$

$$
\nabla_{\mathbf{w}_{6211}}\,\text{err}(\text{user } n, \text{movie } m, \text{rating } r_{nm}) = \mathbf{0} \ \ \text{unless } m = 6211
$$

課堂上的講法是：式子裡只有 $\mathbf{v}_n$，除非 $n$ 剛好是 1126，不然它跟 $\mathbf{v}_{1126}$ 一點關係都沒有，偏微分當然是 0。所以只需要專心在 $\mathbf{v}_n$ 與 $\mathbf{w}_m$ 這兩個向量上。

**對 $\mathbf{v}_n$ 的梯度。** 講義直接給結果，這裡把連鎖律一步一步寫出來。令 $s = r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n = r_{nm} - \sum_{j=1}^{\tilde{d}} w_{m,j}\,v_{n,j}$，誤差是 $s^2$。對 $\mathbf{v}_n$ 的第 $i$ 個分量：

$$
\frac{\partial\,\text{err}}{\partial v_{n,i}} = 2s \cdot \frac{\partial s}{\partial v_{n,i}} = 2s \cdot (-w_{m,i})
$$

第一個等號是「外層的平方先微分，得到 $2s$，再乘上裡面的微分」；第二個等號是因為 $s$ 裡含 $v_{n,i}$ 的只有 $-w_{m,i}v_{n,i}$ 那一項。課堂上說的是同一件事：二次式的 2 跳下來變成一次式，再看 $\mathbf{v}_n$ 前面乘的係數是什麼，是 $\mathbf{w}_m$，還帶一個負號。$\tilde{d}$ 個分量排成向量：

$$
\nabla_{\mathbf{v}_n}\,\text{err} = -2\big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)\mathbf{w}_m
$$

**對 $\mathbf{w}_m$ 的梯度。** $s$ 對 $w_{m,i}$ 的微分是 $-v_{n,i}$，其餘完全對稱：

$$
\nabla_{\mathbf{w}_m}\,\text{err} = -2\big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)\mathbf{v}_n
$$

講義把兩條式子濃縮成一句：per-example gradient ∝ −(residual)(the other feature vector)。課堂上分開解釋這兩個因子。第一個是殘差（residual）：想要的分數減掉模型現在的預測，這個詞在[技法第 11 堂：梯度提升決策樹](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree)出現過。第二個是「另一方」的特徵向量：更新使用者時拿電影的向量來用，更新電影時拿使用者的向量來用；對這一筆資料來說，另一方就像暫時固定住，幫忙完成這次更新。

### 演算法

第 15 頁把梯度下降的更新式寫出來。梯度下降是往負梯度的方向走，梯度裡的負號被抵消，所以更新是「加上」殘差乘另一方的向量：

- 隨機初始化 $\tilde{d}$ 維的向量 $\{\mathbf{w}_m\}$、$\{\mathbf{v}_n\}$。
- 對 $t = 0, 1, \dots, T$：
  1. 從所有已知的 $r_{nm}$ 裡隨機挑一組 $(n, m)$。
  2. 算殘差 $\tilde{r}_{nm} = r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n$。
  3. 更新：

$$
\mathbf{v}_n^{\text{new}} \leftarrow \mathbf{v}_n^{\text{old}} + \eta \cdot \tilde{r}_{nm}\,\mathbf{w}_m^{\text{old}}, \qquad \mathbf{w}_m^{\text{new}} \leftarrow \mathbf{w}_m^{\text{old}} + \eta \cdot \tilde{r}_{nm}\,\mathbf{v}_n^{\text{old}}
$$

本文補充兩個容易漏掉的地方。第一，梯度裡有係數 2，更新式裡沒有：照字面應該是 $2\eta$，講義把 2 併進步長 $\eta$ 了，$\eta$ 本來就是要自己調的數字。第二，兩條更新式右邊用的都是舊值。寫程式時如果先把 $\mathbf{v}_n$ 蓋掉、再拿新的 $\mathbf{v}_n$ 去更新 $\mathbf{w}_m$，算的就不是講義這個演算法；要先把兩個新值都算好再一起寫回去。

每一步只動到 $2\tilde{d}$ 個數字，跟使用者數、電影數、評分筆數都無關。講義對它的評語是 perhaps most popular large-scale matrix factorization algorithm；課堂上說，大型的矩陣分解問題上，它是大多數人最喜歡用的方法之一。

### 數值例子：同一個 3×3 矩陣走兩步 SGD

以下同樣是本文自擬。沿用上面的評分表與 $\tilde{d} = 1$，為了能手算，初始值取 $v_1 = v_2 = v_3 = 1$、$w_1 = w_2 = w_3 = 1$，$\eta = 0.1$，並指定挑到的資料（實際執行時是隨機挑）。一開始每格的預測都是 1，$E_{\text{in}} = 4^2 + 2^2 + 3^2 + 0^2 + 1^2 + 0^2 = 30$。

**第 1 步，挑到 $(n, m) = (1, 1)$，$r_{11} = 5$。**

- 殘差：$\tilde{r}_{11} = 5 - 1 \times 1 = 4$
- $v_1 \leftarrow 1 + 0.1 \times 4 \times 1 = 1.4$
- $w_1 \leftarrow 1 + 0.1 \times 4 \times 1 = 1.4$（用的是舊的 $v_1 = 1$）

這一格的預測從 1 變成 $1.4 \times 1.4 = 1.96$，殘差從 4 降到 3.04。$E_{\text{in}}$ 從 30 降到 19.56。其他四個向量完全沒動。

**第 2 步，挑到 $(1, 2)$，$r_{12} = 3$。**

- 殘差：$\tilde{r}_{12} = 3 - 1 \times 1.4 = 1.6$（$w_2$ 還是 1，$v_1$ 已經是 1.4）
- $v_1 \leftarrow 1.4 + 0.1 \times 1.6 \times 1 = 1.56$
- $w_2 \leftarrow 1 + 0.1 \times 1.6 \times 1.4 = 1.224$

這一格的預測變成 $1.56 \times 1.224 \approx 1.909$。$E_{\text{in}}$ 降到 16.48。

**這兩步看得到什麼。**

- 第 2 步沒有挑到 $(1, 1)$，但那一格的預測也變了：$v_1$ 從 1.4 變成 1.56，預測從 1.96 變成 $1.56 \times 1.4 = 2.184$。同一位使用者的所有評分共用一個 $\mathbf{v}_n$，一筆資料的更新會帶動他其他格子的預測，沒評過的格子也一樣。模型能預測問號，靠的就是這種共用。
- 步長不能亂選。第 1 步如果用 $\eta = 1$，$v_1 = w_1 = 5$，預測變成 25，這一格的平方誤差從 16 變成 $(5 - 25)^2 = 400$。交替最小平方每一步保證 $E_{\text{in}}$ 不上升，SGD 沒有這種保證。
- 繼續跑下去會到差不多的地方。用 Python 以 $\eta = 0.01$ 隨機挑 20 萬步，換幾組亂數種子各跑一次，跑完時 $E_{\text{in}}$ 落在 0.0135 到 0.0138 之間，三個問號格的預測大約是 1.34、2.36、3.43（每次在小數第二位上下略有出入），和交替最小平方的 1.346、2.363、3.431 很接近。步長固定不變時，SGD 會在最佳解附近小幅晃動，不會像交替最小平方那樣停在一個固定的數字上。

### 兩種解法並排

講義沒有把兩種解法放進同一張表，下表是本文依前面的內容整理的：

| | 交替最小平方 | SGD |
|---|---|---|
| 一次更新用到的資料 | 一部電影（或一位使用者）的全部評分 | 一筆評分 |
| 一次更新改動什麼 | 一個 $\mathbf{w}_m$ 或 $\mathbf{v}_n$，直接換成該子問題的最小平方解 | 一個 $\mathbf{v}_n$ 與一個 $\mathbf{w}_m$，各走一小步 |
| 要自己調的數字 | 沒有步長 | 步長 $\eta$、步數 $T$ |
| $E_{\text{in}}$ 的走勢 | 每半輪都不會上升 | 單一步可能上升（上面 $\eta = 1$ 的例子） |
| 誤差函數 | 綁在平方誤差上，子問題才是線性迴歸 | 換別的誤差函數只要重算單筆的梯度 |
| 要改造時 | 更新式是整批解出來的，不容易插手 | 走訪順序、步長都可以自己安排（接下來 KDD Cup 的例子） |

怎麼選：資料量小、想要每一步都穩穩下降而且不想調步長，用交替最小平方；評分筆數很大、或是想換誤差函數、想依應用的需要改演算法，用 SGD。講義對 SGD 的評語就是針對大規模的情況說的。

### 實務上的改造：KDD Cup 2011 的時間順序 SGD

第 16 頁講一個實際的例子，標題是 KDDCup 2011 Track 1: World Champion Solution by NTU。課堂上的說法是，台大的隊伍在 2011 年又拿下一次世界冠軍，這是當時解法的一部分。

**資料的特性。** 講義寫：per-user training ratings earlier than test ratings in time，每位使用者的訓練評分在時間上都早於測試評分。課堂上解釋主辦單位要的是，用使用者剛開始使用系統時給的評分，去預測他未來會給的評分。訓練資料與測試資料不再是從同一個分布隨機抽出來的，有明顯的時間差，分布就可能不同。這是[基石第 16 堂：三個學習原則](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles)講的抽樣偏差（sampling bias）：手上的訓練資料沒辦法完全代表測試的環境。

**想要的事。** 講義寫 want: emphasize latter examples。時間比較晚的資料和測試時的使用者狀況比較接近。課堂上的比喻是，三年前喜歡的歌，三年後不見得還喜歡，所以早期的資料不必那麼看重。

**對 SGD 的觀察。** 講義寫：last $T'$ iterations of SGD: only those $T'$ examples considered，學出來的 $\{\mathbf{w}_m\}$、$\{\mathbf{v}_n\}$ 會偏向那些資料。課堂上用數字講：SGD 每次挑一個點更新一下，最後 100 輪就只看到那 100 個點，最後求出來的解會傾向把那 100 個點做好；就算前面看過兩萬個點，這兩萬個點也不是被公平對待的，演算法比較重視剛看到的那些。

**做法。** 講義寫 our idea: time-deterministic SGD that visits latter examples last，投影片上 SGD 的 S 被劃掉。課堂上解釋，它已經不是 stochastic 了，順序是固定的：最後幾輪刻意給它看時間上比較晚的資料。講義記錄的結果是 consistent improvements of test performance；課堂上說，這讓他們在那次比賽裡所有 SGD 系列的方法幾乎都有進步。

**用一個極小的例子看「偏向最後看到的資料」（本文自擬）。** 只看一位使用者，他有四筆評分，時間由早到晚是 1、1、5、5，口味中途變了。為了只剩一個變數，假設這四部電影的 $w_m$ 都固定是 1 而且不更新（真正的演算法會兩邊一起更新，這裡只是示意）。更新式簡化成 $v \leftarrow v + \eta(r - v)$。取 $\eta = 0.5$，從 $v = 3$ 出發：

| 走訪順序 | $v$ 的變化 | 最後的 $v$ |
|---|---|---|
| 時間順序（1、1、5、5） | $3 \to 2 \to 1.5 \to 3.25 \to 4.125$ | 4.125 |
| 反過來（5、5、1、1） | $3 \to 4 \to 4.5 \to 2.75 \to 1.875$ | 1.875 |

四筆資料一樣，把四筆平方誤差加起來最小的 $v$ 是平均值 3，兩種順序卻分別停在 4.125 與 1.875，各自靠近最後看到的那兩筆。如果測試資料是這位使用者之後的評分，口味比較可能接近 5，照時間順序走訪的結果會比較準。

講義在這一頁底下的結語是：if you understand the behavior of techniques, easier to modify for your real-world use。課堂上強調，重點不在他們做了多了不起的事，而在於知道模型用的最佳化方法實際上在做什麼，才有辦法把演算法改成合乎自己需要的樣子；講者希望這是學完基石與技法之後帶得走的能力。

### Fun Time：全部初始化成 0 會怎樣

**題目（第 17 頁）：** 如果所有 $\mathbf{w}_m$ 與 $\mathbf{v}_n$ 都初始化成 $\mathbf{0}$ 向量，用 SGD 做矩陣分解時，下面哪一件事「不會」發生？

1. 所有 $\mathbf{w}_m$ 永遠是 $\mathbf{0}$
2. 所有 $\mathbf{v}_n$ 永遠是 $\mathbf{0}$
3. 每個殘差 $\tilde{r}_{nm}$ 都等於原本的評分 $r_{nm}$
4. 每次 SGD 更新之後 $E_{\text{in}}$ 都下降

**答案：4。** 講義的解答是：$\mathbf{0}$ 向量讓每一筆資料的梯度都是 $\mathbf{0}$，所以 $E_{\text{in}}$ 沒辦法再下降。課堂上的說法是，不管怎麼更新梯度都還是 0，永遠不會動。

代進更新式驗證。挑到任何 $(n, m)$：殘差是 $\tilde{r}_{nm} = r_{nm} - \mathbf{0}^\top\mathbf{0} = r_{nm}$（選項 3 會發生）；$\mathbf{v}_n \leftarrow \mathbf{0} + \eta\,r_{nm}\,\mathbf{0} = \mathbf{0}$（選項 2 會發生）；$\mathbf{w}_m \leftarrow \mathbf{0} + \eta\,r_{nm}\,\mathbf{0} = \mathbf{0}$（選項 1 會發生）。殘差再大也沒用，因為它乘上的「另一方的向量」是 $\mathbf{0}$。更新之後所有向量和更新之前一樣，下一步的情況完全相同。用上面的 3×3 例子跑 1,000 步確認過：所有向量始終是 0，$E_{\text{in}}$ 一直停在 $5^2 + 3^2 + 4^2 + 1^2 + 2^2 + 1^2 = 56$。

本文補充：卡住的條件是「兩邊都是 $\mathbf{0}$」。如果只有 $\mathbf{v}_n = \mathbf{0}$ 而 $\mathbf{w}_m \ne \mathbf{0}$，第一次更新就會讓 $\mathbf{v}_n$ 變成 $\eta\,r_{nm}\,\mathbf{w}_m$，之後就動得起來。這題是「初始化通常用亂數」最小的反例，也呼應交替最小平方那裡課堂上說的「設成太特別的值，最佳化可能沒辦法好好進行」。

## 萃取模型的總整理：四堂課學了哪些模型與技巧

```youtube
url: https://www.youtube.com/watch?v=xKZMB4T2a2s
title: Matrix Factorization :: Summary of Extraction Models @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:08 是模型的地圖，03:08–05:11 技巧的地圖，05:11–07:21 優缺點，07:21–07:52 Fun Time，之後是整堂的總結。）

### 什麼叫萃取模型

課堂上先承認，講了四堂的 extraction model，其實一直沒有給它明確的定義。講義第 18 頁在這裡補上：feature transform $\boldsymbol{\Phi}$ as hidden variables in addition to linear model。最後還是會接一個線性模型，但在那之前，特徵轉換本身也納入學習，轉換裡的參數就是所謂的隱藏變數。

### 模型的地圖

第 18 頁把學過的模型排在一起，每個模型各列出「隱藏變數（轉換）」與「線性模型的權重」。下表依講義整理，並附上教它的堂次：

| 模型 | 當成隱藏變數的轉換 | 最後線性模型的權重 | 在哪一堂 |
|---|---|---|---|
| Adaptive／Gradient Boosting | 假說 $g_t$ | $\alpha_t$ | [技法第 8 堂：AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting)、[技法第 11 堂：梯度提升決策樹](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree) |
| Neural Network／Deep Learning | 前面各層的權重 $w_{ij}^{(\ell)}$ | 最後一層的權重 $w_{ij}^{(L)}$ | [技法第 12 堂：神經網路](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)、[技法第 13 堂：深度學習](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning) |
| RBF Network | RBF 的中心 $\boldsymbol{\mu}_m$ | $\beta_m$ | [技法第 14 堂：RBF 網路](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization) |
| Matrix Factorization | 使用者特徵 $\mathbf{v}_n$ | 電影特徵 $\mathbf{w}_m$ | 這一堂 |
| k Nearest Neighbor | 以 $\mathbf{x}_n$ 為中心的鄰居 RBF | $y_n$ | 技法第 14 堂：RBF 網路 |

課堂上對其中三列多說了幾句：

- **矩陣分解**：別的格子都是上面一行藍色（轉換）、下面一行紅色（線性模型的權重），這一格的 user features 與 movie features 兩行卻是藍紅交錯，$\mathbf{v}_n$ 與 $\mathbf{w}_m$ 兩個符號都印成紫色。課堂上說這裡特地用紫色，因為使用者和電影在這個應用裡是對稱的，可以說是同時在萃取使用者的特徵與電影的特徵，不一定要指定哪一個是特徵、哪一個是線性模型的權重。
- **Boosting**：它是在聚合模型那幾堂教的，但也可以想成萃取模型。它找出來的轉換是那些假說 $g_t$，最後線性組合的權重是每個 $g_t$ 的票數 $\alpha_t$。
- **k 近鄰**：轉換是「某個看過的點附近的鄰居範圍」，組合的權重是那 $k$ 個點來投票，所以權重就是它們原本的標籤。

講義的結語是 extraction models: a rich family。

### 技巧的地圖

第 19 頁是同一張地圖，格子裡換成「用什麼技巧把轉換萃取出來」。課堂上說這一頁是特別想強調的：這些技巧可以再跟其他模型結合。

| 模型 | 萃取的技巧 | 課堂上的說明 |
|---|---|---|
| Adaptive／Gradient Boosting | functional gradient descent | 用它推導出該怎麼萃取每個 $g_t$ |
| Neural Network／Deep Learning | SGD（backprop）、autoencoder | backprop 幫忙有效率地算梯度；autoencoder 用非監督的方式得到比較好的起始權重 |
| RBF Network | k-means clustering | 同樣是非監督的方式，只用沒有標籤的資料 |
| Matrix Factorization | SGD、alternating leastSQR | 看成交替做線性迴歸，就能用交替最小平方 |
| k Nearest Neighbor | lazy learning | 訓練時幾乎不做事，測試時才拿訓練資料來推論 |

autoencoder 與 k-means 在投影片上都用綠色粗體標出。課堂上把它們放在一起講：兩者都是非監督式的方法，這說明非監督式學習對於學到資料的表示方式很有用。lazy learning 後面講義畫了一個笑臉，課堂上特別澄清這不是在開玩笑，這種方法真的叫 lazy learning。講義的結語是 extraction techniques: quite diverse。

### 優點與缺點

第 20 頁針對神經網路／深度學習、RBF 網路、矩陣分解這三類列出優缺點。

**優點：**

- **「easy」**：減輕人設計特徵的負擔。課堂上舉電腦視覺與語音：人看到一張圖知道那是什麼，聽到一段話知道在講什麼，但要從原始的像素或聲音訊號裡自己設計特徵，不太會做；機器能自動做特徵轉換就幫上很多忙。
- **powerful**：只要考慮夠多的隱藏變數。課堂上舉的是 RBF 網路有夠多的中心、神經網路有夠多的神經元或權重，就能做到很複雜的事。

**缺點：**

- **「hard」**：一般來說是非凸的最佳化問題。課堂上說，非凸代表很容易卡在奇怪的地方、找不到更好的解，所以才需要這麼多不同的技巧來幫忙。本文補充：這堂的矩陣分解就是例子，講義第 11 頁說交替最小平方只到區域最佳，Fun Time 的全零初始化則是卡在一個梯度為 0 的地方出不來。
- **overfitting**：需要適當的正則化與驗證。課堂上的說法是，模型這麼有能力，使用時要小心不要把這些能力用去過度擬合，所以正則化與驗證的機制更重要。

講義把這一頁收成一句：be careful when applying extraction models。

### Fun Time：這是哪一個模型

**題目（第 21 頁）：** 下面哪一個萃取模型，是用 k-means 萃取 Gaussian 的中心，再把這些 Gaussian 線性組合起來？

1. RBF Network
2. Deep Learning
3. Adaptive Boosting
4. Matrix Factorization

**答案：1。** 這是上一堂 RBF 網路的標準描述：用 k-means 找中心 $\boldsymbol{\mu}_m$，用 Gaussian 算相似度，再用 $\beta_m$ 線性組合。講義的解答只有一句恭喜：Congratulations on being an expert in extraction models!

對照地圖看其他選項：深度學習的轉換是各層的權重，技巧是 SGD 與 autoencoder，沒有 Gaussian 的中心。AdaBoost 的轉換是一個一個找出來的假說 $g_t$。矩陣分解的轉換是使用者與電影的向量，技巧是交替最小平方與 SGD。

第 22 頁的總結把四節各收成一句：線性網路是從 binary vector encoding 做特徵萃取；基本的矩陣分解是在使用者與電影之間交替做最小平方；SGD 有效率，而且容易為實際應用修改；萃取模型很有能力，所以要小心使用。下一堂的預告是 closing remarks of techniques。

## 自我檢查

**1. 取 $\tilde{d} = 2$。某部電影有三位使用者評過分，他們目前的向量與評分是：$\mathbf{v}_1 = (1, 0)$ 給 4 分，$\mathbf{v}_2 = (1, 1)$ 給 5 分，$\mathbf{v}_3 = (0, 1)$ 給 2 分。交替最小平方更新這部電影時，$\mathbf{w}$ 會是多少？更新後三筆殘差各是多少？**

答案：$\sum_n \mathbf{v}_n\mathbf{v}_n^\top = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$，$\sum_n r_n\mathbf{v}_n = 4(1,0) + 5(1,1) + 2(0,1) = (9, 7)$。解 $2w_1 + w_2 = 9$、$w_1 + 2w_2 = 7$，得 $\mathbf{w} = (\frac{11}{3}, \frac{5}{3})$。三筆預測是 $\frac{11}{3}$、$\frac{16}{3}$、$\frac{5}{3}$，殘差是 $\frac{1}{3}$、$-\frac{1}{3}$、$\frac{1}{3}$，平方和 $\frac{1}{3}$。三筆資料、兩個變數，通常沒辦法全部吻合。

**2. $\mathbf{v}_n = (1, 2)$、$\mathbf{w}_m = (0.5, 1)$、$r_{nm} = 4$、$\eta = 0.1$。做一步 SGD，寫出新的 $\mathbf{v}_n$、$\mathbf{w}_m$ 與新的預測。**

答案：預測 $0.5 + 2 = 2.5$，殘差 $1.5$。$\mathbf{v}_n \leftarrow (1, 2) + 0.15 \times (0.5, 1) = (1.075, 2.15)$；$\mathbf{w}_m \leftarrow (0.5, 1) + 0.15 \times (1, 2) = (0.65, 1.3)$。新的預測是 $1.075 \times 0.65 + 2.15 \times 1.3 = 3.49375$，往 4 靠近了。如果你的 $\mathbf{w}_m$ 算成 $(0.66125, 1.3225)$，就是用了更新後的 $\mathbf{v}_n$，和講義的更新式不同。

**3. $N = 1{,}000$ 位使用者、$M = 200$ 部電影、$\tilde{d} = 10$。模型有幾個變數？交替最小平方一輪解幾個最小平方問題？SGD 一步改動幾個數字？**

答案：變數 $(1{,}000 + 200) \times 10 = 12{,}000$ 個。交替最小平方一輪 $200 + 1{,}000 = 1{,}200$ 個問題，每個有 10 個變數。SGD 一步只改一個 $\mathbf{v}_n$ 與一個 $\mathbf{w}_m$，共 20 個數字。

**4. 為什麼固定所有 $\mathbf{v}_n$ 之後，$M$ 部電影的 $\mathbf{w}_m$ 可以各自分開解？又為什麼固定 $\mathbf{w}_m$ 之後，$\mathbf{v}_n$ 也可以分開解？**

判準：答案要指出 $E_{\text{in}}$ 是對已知評分的加總，可以依電影分組，$\mathbf{w}_m$ 只出現在第 $m$ 組，所以各組互不影響，每一組是一個以 $\mathbf{v}_n$ 為輸入、$r_{nm}$ 為輸出、沒有常數項的線性迴歸；同一個加總也可以改成依使用者分組，$\mathbf{v}_n$ 只出現在第 $n$ 組。只回答「因為對稱」而沒有說出重新分組，不算完整。

**5. 一位新使用者一筆評分都沒有。用 SGD 訓練完之後，他的 $\mathbf{v}_n$ 是什麼？模型對他的預測可以相信嗎？**

判準：答案要說出 SGD 只從已知的評分裡挑資料，這位使用者永遠不會被挑到，他的 $\mathbf{v}_n$ 的梯度永遠是 $\mathbf{0}$，所以 $\mathbf{v}_n$ 停在初始化的亂數；預測 $\mathbf{w}_m^\top\mathbf{v}_n$ 只反映那組亂數，沒有用到任何關於他的資訊。交替最小平方也一樣，他的迴歸問題裡沒有資料。這堂的模型只能替「至少留下一些評分」的使用者與電影學出特徵。

## 練習與對應閱讀

**這堂在現行學期課程裡沒有排。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)與 [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)的課程計畫都跳過技法第 14、15 堂：兩個學期都在神經網路與深度學習（投影片 `212u`、`213u`）之後直接接現代深度學習（`302u`、`303u`）。所以這堂沒有對應的 `u` 版更新投影片，課程頁也沒有替它標 [Learning from Data](http://amlbook.com) 的章節。上面這些是 2026-09-30 查的。

**作業。** Fall 2024 的 HW0–HW7 與期末專題說明裡，沒有任何一題考矩陣分解。能用來自我檢查的官方材料只有講義裡的四題 Fun Time；講義的更正見 [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)。

**自己動手。** 沒有作業的情況下，最直接的練習是自己把兩種演算法寫出來：

1. 先用本文的 3×3 評分表與 $\tilde{d} = 1$ 寫交替最小平方，確認第 1 輪得到 $w = (4.5, 2.5, 1)$、$v = (\frac{60}{53}, \frac{76}{85}, \frac{24}{29})$，$E_{\text{in}}$ 收斂到 0.0134 左右。
2. 換成 [MovieLens](https://grouplens.org/datasets/movielens/) 最小的資料集（這是自我練習用的資料，不是課程指定的），用 numpy 寫第 15 頁那幾行 SGD 更新，例如 $\tilde{d} = 10$、$\eta = 0.01$。先用全 0 初始化跑一次，再用小亂數跑一次，比較兩者的訓練 RMSE，親眼看 Fun Time 那個現象。
3. 把 k-means 和交替最小平方並排寫。兩者的程式骨架幾乎一樣，都是「固定一組、解另一組、重複到不變」。

**延伸閱讀。** 講義第 16 頁的冠軍隊伍把做法寫成了論文 [A linear ensemble of individual and blended models for music rating prediction](http://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)（Chen et al., KDD Cup 2011）。[Stanford CS224W 導讀](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs)從圖的角度處理推薦問題，可以和這堂對照。

**下一堂。** [技法第 16 堂：Finale](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning) 把整門技法收成三類技巧：運用特徵、最佳化誤差、消除過擬合。這堂的兩種解法都會在最佳化那一類再出現：講義 `216_handout.pdf` 第 7 頁把 Matrix Factorization 列在 SGD 底下，第 9 頁把 alternating LeastSqr 和 k-means 一起列在 Alternating Optim. 底下。

## 課程影片來源

原始影片：[Linear Network Hypothesis](https://www.youtube.com/watch?v=2pX76iH_irw)、[Basic Matrix Factorization](https://www.youtube.com/watch?v=3l5kaWkcR6s)、[Stochastic Gradient Descent](https://www.youtube.com/watch?v=br3IzOz-xMs)、[Summary of Extraction Models](https://www.youtube.com/watch?v=xKZMB4T2a2s)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：技法第 15 堂獨立成篇（原本和技法第 14 堂寫在同一篇），依講義與影片逐字稿重寫。

## 參考資料

- [技法第 15 堂講義 215_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf)：本文的主要底本，四節的內容、四題 Fun Time、第 8 頁的評分表與因子圖、第 18–20 頁的地圖都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)：講義更正的官方清單。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：課程計畫未排這堂，作業沒有矩陣分解的題目。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：課程計畫未排這堂。
- [Learning from Data 教科書網站](http://amlbook.com)：課程頁標註章節時用的教科書；這堂沒有對應章節。
- [A linear ensemble of individual and blended models for music rating prediction（Chen et al., KDD Cup 2011）](http://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)：講義第 16 頁提到的冠軍隊伍的論文，列為延伸閱讀。
- [MovieLens 資料集（GroupLens）](https://grouplens.org/datasets/movielens/)：自我練習用的資料，非課程指定。
- [Stanford CS224W 導讀](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs)：延伸閱讀，從圖的角度看推薦問題。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
