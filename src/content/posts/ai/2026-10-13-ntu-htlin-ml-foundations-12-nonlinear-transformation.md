---
title: "非線性轉換：用特徵轉換畫出曲線邊界的代價｜台大林軒田 機器學習基石 第 12 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, feature-engineering, classification, learning-theory]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 12
tldr: "資料用直線切不開時，不必重新設計演算法：先用特徵轉換 Φ 把 x 換成 z，在 Z 空間照常跑線性模型，Z 空間的直線就是 X 空間的二次或更高次曲線。Q 次多項式轉換會把維度拉到 d̃ = C(Q+d, d) − 1，計算、儲存與 VC 維度（至多 d̃+1）都跟著漲，所以這堂課的結論是先試線性模型，不夠再往高次走。"
description: "台大林軒田機器學習基石第 12 堂 Nonlinear Transformation 導讀：二次假說與 Z 空間、非線性轉換三步驟、多項式轉換的維度公式與 VC 維度上限、為什麼不能看了資料再挑轉換、巢狀假說集合與先試線性模型，並用七個點把 Z 空間的 PLA 手算完。"
draft: false
glossary:
  - term: "特徵轉換"
    aliases: ["feature transform", "nonlinear transform", "Φ"]
    definition: "把原始輸入 x 換成另一組特徵 z = Φ(x) 的函數。轉換本身可以是非線性的；轉換之後在 z 上用線性模型，回到 x 看就是非線性的邊界。"
    context: "基石第 12 堂用 Φ(x) = (1, x₁², x₂²) 把圓形邊界變成直線。"
    links:
      - label: "基石第 12 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf"
  - term: "Z 空間"
    aliases: ["Z-space", "Z 世界"]
    definition: "特徵轉換之後 z = Φ(x) 所在的空間。講義把這個空間裡的權重寫成 w̃、維度寫成 d̃，用波浪號跟 X 空間的 w、d 區分。"
    context: "基石第 12 堂在 Z 空間跑 PLA、線性迴歸或邏輯迴歸。"
  - term: "Q 次多項式轉換"
    aliases: ["Q-th order polynomial transform", "Φ_Q"]
    definition: "把 d 個輸入變數組成的所有 0 次到 Q 次單項式排成一個向量。扣掉常數項之後有 d̃ = C(Q+d, d) − 1 維，d 固定時是 O(Q^d)。"
    context: "基石第 12 堂用它算轉換在計算、儲存與模型複雜度上的代價。"
  - term: "巢狀假說集合"
    aliases: ["structured hypothesis sets", "nested hypothesis sets"]
    definition: "一串一個包著一個的假說集合 H₀ ⊂ H₁ ⊂ H₂ ⊂ …。愈外層 VC 維度不會變小，能做到的最低 E_in 不會變大。"
    context: "基石第 12 堂由多項式轉換的遞迴定義得到這個結構，據此建議先試 H₁。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 12 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，這堂是第三個問題「How Can Machines Learn?」的最後一堂。上一堂[基石第 11 堂：線性分類模型](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)在同一頁上的摘要是：二元分類可以用（邏輯）迴歸來做，多類別分類可以用 OVA／OVO 拆解。到那裡為止，PLA、線性迴歸、邏輯迴歸三個模型都只會算線性的分數 $s = \mathbf{w}^\top\mathbf{x}$。這堂要回答的是：資料根本不是一條線切得開的時候，這三個模型還能不能用。

先備是[基石第 2 堂的 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)（更新式 $\mathbf{w} \leftarrow \mathbf{w} + y_n\mathbf{x}_n$）、[基石第 7 堂的 VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)（$d$ 維感知器的 $d_{\text{VC}} = d + 1$，以及 $E_{\text{out}} \le E_{\text{in}} + \Omega$ 的讀法），還有高中的圓錐曲線與排列組合。讀完之後，你應該能把一條二次曲線寫成 Z 空間裡的權重向量、對一組小資料手算「轉換後跑 PLA」的每一步、算出 $Q$ 次多項式轉換的維度，並且解釋為什麼看了資料才挑轉換會讓 VC 的保證失效。

## 直線切不開的資料怎麼辦：把圓形邊界變成 Z 空間的直線

```youtube
url: https://www.youtube.com/watch?v=8pQ06pku1xA
title: Nonlinear Transformation :: Quadratic Hypotheses @ Machine Learning Foundations (機器學習基石)
```

（影片 00:17–02:30 回顧線性假說與它的限制，02:30–04:59 是圓形可分的資料，04:59–11:21 把係數與輸入重新取名字，11:21–17:29 看五組權重各畫出什麼曲線，17:29–22:58 是一般的二次假說集合，之後是 Fun Time。）

### 線性假說的好處與限制

講義第 2 頁把到目前為止的線性假說整理成兩欄。左欄是它的樣子：視覺上是像「線」的邊界，數學上是線性的分數 $s = \mathbf{w}^\top\mathbf{x}$。右欄是它的限制：理論上 $d_{\text{VC}}$ 受到控制，這是好事；實務上有些資料 $\mathcal{D}$，不管用哪一條線，$E_{\text{in}}$ 都很大。右欄的圖是一群圈（○）聚在中間、叉（×）散在四周，沒有任何一條直線能把兩者分開。

課堂上把這兩件事接成一個因果：模型的複雜度受控，$E_{\text{in}}$ 和 $E_{\text{out}}$ 才不會差太遠；但也正因為複雜度受控，就會遇到每條線都切不好的資料。這時 $E_{\text{in}}$ 很大，$E_{\text{out}}$ 跟它接近，所以也很大，等於學不好。這堂課的目標寫在第 2 頁底下：how to break the limit of linear hypotheses。

### 圓形可分

第 3 頁把同一份資料再畫一次，這次多了一個圓。講義說這份資料不是線性可分（linear separable），但是「圓形可分」（circular separable）：用一個圓心在原點、半徑 $\sqrt{0.6}$ 的圓就能分開，對應的假說是

$$
h_{\text{SEP}}(\mathbf{x}) = \text{sign}\left(-x_1^2 - x_2^2 + 0.6\right)
$$

$x_1^2 + x_2^2$ 是點到原點距離的平方。課堂上的讀法是：拿這個距離平方跟 0.6 比，比 0.6 小就說是圈，比 0.6 大就說是叉。

既然有圓形可分的資料，一個直接的想法是把之前學過的東西全部重做一遍：圓形版的 PLA、圓形版的迴歸、圓形版的邏輯迴歸。講義在頁尾問的就是這句（re-derive Circular-PLA, Circular-Regression, blahblah … all over again?）。課堂上替學生回答了：這太困難了，每個演算法都要重看一次，找出哪裡要把線改成圓。所以接下來要找的是一個有系統的做法，不必一個一個演算法重新設計。

### 替係數與輸入重新取名字

第 4 頁做的事情只有一件：取名字。把 $h_{\text{SEP}}$ 的三項拆開，每一項寫成「一個係數乘上一個跟輸入有關的量」：

$$
h(\mathbf{x}) = \text{sign}\Big(\underbrace{0.6}_{\tilde{w}_0} \cdot \underbrace{1}_{z_0} + \underbrace{(-1)}_{\tilde{w}_1} \cdot \underbrace{x_1^2}_{z_1} + \underbrace{(-1)}_{\tilde{w}_2} \cdot \underbrace{x_2^2}_{z_2}\Big) = \text{sign}\left(\tilde{\mathbf{w}}^\top\mathbf{z}\right)
$$

課堂上是這樣一步一步講的。0.6、$-1$、$-1$ 這三個數字決定了假說在做什麼，例如決定它是半徑 $\sqrt{0.6}$ 的圓還是半徑 $\sqrt{0.8}$ 的圓，角色跟線性假說裡的權重一樣，所以叫它們 $w_0, w_1, w_2$。以前 $w_1$ 配的是 $x_1$，現在配的是 $x_1^2$，為了看清楚，把 $x_1^2$ 叫作 $z_1$、$x_2^2$ 叫作 $z_2$；常數那一項比照以前的 $x_0 = 1$，補一個 $z_0 = 1$。寫完之後，式子跟線性世界裡的 $w_0x_0 + w_1x_1 + w_2x_2$ 只差在 $x$ 換成了 $z$。為了不跟原來的權重搞混，權重上面加一個波浪號，課堂上叫它「小蚯蚓」，用來提醒這是 Z 那個世界裡的 $\mathbf{w}$。（課堂上也先講好：寫的時候會寫 $\tilde{\mathbf{w}}$，口頭上嫌麻煩就直接唸 $\mathbf{w}$。）

名字取完，就能換一個角度看同一件事。把每個點 $\mathbf{x} = (x_1, x_2)$ 的兩個分量各自平方，畫到另一張圖上，這張新圖的座標是 $(z_1, z_2)$。講義把這個動作記成

$$
\mathbf{x} \in \mathcal{X} \ \overset{\boldsymbol{\Phi}}{\longmapsto}\ \mathbf{z} \in \mathcal{Z}
$$

並稱 $\boldsymbol{\Phi}$ 為（非線性的）特徵轉換（feature transform）。課堂上把左邊叫 X 世界、右邊叫 Z 世界。第 4 頁右邊那張圖就是轉換後的資料：橫軸 $z_1$、縱軸 $z_2$，圈都擠在靠近原點的左下角，叉在右上方，中間一條從 $(0, 0.6)$ 到 $(0.6, 0)$ 的直線把兩群分開。這條線就是 $0.6 - z_1 - z_2 = 0$，也就是原來那個圓。

於是有了這堂課的第一個結論：

$$
\{(\mathbf{x}_n, y_n)\}\ \text{圓形可分} \ \Longrightarrow\ \{(\mathbf{z}_n, y_n)\}\ \text{線性可分}
$$

本文補充：這張 Z 空間的圖有一個容易漏看的地方。$z_1 = x_1^2$ 與 $z_2 = x_2^2$ 都不可能是負的，所以不管 X 空間的資料長什麼樣子，轉換後的點全部落在第一象限（含座標軸）。這件事等一下會用到。

### 反過來成立嗎：Z 空間的直線不一定是圓

第 4 頁的頁尾留了一個問題：vice versa？轉換後線性可分，就代表原來的資料可以用圓分開嗎？第 5 頁的答案是不一定。先把 Z 空間裡的假說寫完整：

$$
(z_0, z_1, z_2) = \mathbf{z} = \boldsymbol{\Phi}(\mathbf{x}) = (1, x_1^2, x_2^2)
$$

$$
h(\mathbf{x}) = \tilde{h}(\mathbf{z}) = \text{sign}\left(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}(\mathbf{x})\right) = \text{sign}\left(\tilde{w}_0 + \tilde{w}_1 x_1^2 + \tilde{w}_2 x_2^2\right)
$$

要知道一組 $\tilde{\mathbf{w}}$ 在 X 空間畫出什麼，課堂上教的方法是找「切換的地方」：sign 裡面的量等於 0 的那些點就是邊界，係數的正負號再決定哪一邊是圈。講義列了五組 $\tilde{\mathbf{w}} = (\tilde{w}_0, \tilde{w}_1, \tilde{w}_2)$，下表把每一組的邊界方程式寫出來（最後一欄的半軸長與「哪一邊為正」是本文照同一個方法算的）：

| $\tilde{\mathbf{w}}$ | 邊界（sign 裡面等於 0） | 講義的說法 | 哪裡輸出 $+1$（圈） |
|---|---|---|---|
| $(0.6, -1, -1)$ | $x_1^2 + x_2^2 = 0.6$ | 圓，圈在裡面 | 圓內。代原點：$0.6 > 0$ |
| $(-0.6, +1, +1)$ | $x_1^2 + x_2^2 = 0.6$ | 圓，圈在外面 | 圓外。代原點：$-0.6 < 0$ |
| $(0.6, -1, -2)$ | $x_1^2 + 2x_2^2 = 0.6$ | 橢圓 | 橢圓內。$x_1$ 方向半軸 $\sqrt{0.6} \approx 0.775$，$x_2$ 方向半軸 $\sqrt{0.3} \approx 0.548$ |
| $(0.6, -1, +2)$ | $x_1^2 - 2x_2^2 = 0.6$ | 雙曲線 | 夾在兩支之間、包含原點的那一區 |
| $(0.6, +1, +2)$ | 沒有解 | 常數，永遠是圈 | 所有的點 |

前兩組是同一個圓，差別只在整個權重乘了 $-1$，裡外對調。第三組把 $x_2^2$ 的係數加倍，兩個軸的長度就不一樣，課堂上說這跟剛才的正圓不同，是橢圓。第四組一正一負，是高中學過的雙曲線。第五組最特別：課堂上假想學生跑回來說找不到等於 0 的地方，因為 $0.6$ 加上兩個不會是負數的量，怎麼加都是正的，輸出一定全是圈。

本文補充：第五組用 Z 空間的圖來看更直接。直線 $0.6 + z_1 + 2z_2 = 0$ 整條都在第一象限之外，而所有轉換後的資料都在第一象限，所以這條線碰不到任何資料，所有的點都在它的同一側。

所以 Z 空間裡不同的直線，回到 X 空間可能是圓、橢圓、雙曲線，也可能是常數。講義的結論是

$$
\text{lines in } \mathcal{Z}\text{-space} \iff \textbf{special} \text{ quadratic curves in } \mathcal{X}\text{-space}
$$

講義把 special 這個字標成紅色。課堂上解釋了特殊在哪裡：以正圓為例，圓心一定在原點。要表示圓心不在原點的圓，展開之後會有一次項（平移來的），而 $\boldsymbol{\Phi}(\mathbf{x}) = (1, x_1^2, x_2^2)$ 裡沒有 $x_1$、$x_2$ 這兩項，所以做不到。本文補充：同理，沒有 $x_1x_2$ 這一項，就做不出斜的橢圓；這個轉換能畫的曲線，對 $x_1$ 軸與 $x_2$ 軸都是對稱的。

### 一般的二次假說集合

要做出所有的二次曲線，課堂上的答案是：把表示二次曲線需要的項全部放進來，包括所有的二次項、所有的一次項與常數項。第 6 頁把這個比較大的 Z 空間寫成

$$
\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)
$$

現在 $\mathbf{z}$ 有 6 個分量。Z 空間裡的每一個感知器，對應 X 空間裡的一個二次假說，講義把這個假說集合定義成

$$
\mathcal{H}_{\boldsymbol{\Phi}_2} = \left\{h(\mathbf{x}) : h(\mathbf{x}) = \tilde{h}(\boldsymbol{\Phi}_2(\mathbf{x})) \text{ for some linear } \tilde{h} \text{ on } \mathcal{Z}\right\}
$$

意思是：先把 $\mathbf{x}$ 用 $\boldsymbol{\Phi}_2$ 送到 Z 空間，再用 Z 空間裡的某個線性分類器 $\tilde{h}$ 做決定；所有這樣組出來的 $h$ 收在一起，就是 $\mathcal{H}_{\boldsymbol{\Phi}_2}$。講義說它能實現所有可能的二次曲線邊界：圓、橢圓、旋轉過的橢圓、雙曲線、拋物線等等。

講義舉的例子是一個斜的橢圓：

$$
2(x_1 + x_2 - 3)^2 + (x_1 - x_2 - 4)^2 = 1 \quad\Longleftarrow\quad \tilde{\mathbf{w}}^\top = [33, -20, -4, 3, 2, 3]
$$

講義只給了結果，課堂上口頭算了常數項與兩個一次項。完整的展開如下。第一個平方：

$$
2(x_1 + x_2 - 3)^2 = 2x_1^2 + 4x_1x_2 + 2x_2^2 - 12x_1 - 12x_2 + 18
$$

第二個平方：

$$
(x_1 - x_2 - 4)^2 = x_1^2 - 2x_1x_2 + x_2^2 - 8x_1 + 8x_2 + 16
$$

兩式相加，再把右邊的 1 移到左邊：

$$
\underbrace{(18 + 16 - 1)}_{33} + \underbrace{(-12 - 8)}_{-20}\,x_1 + \underbrace{(-12 + 8)}_{-4}\,x_2 + \underbrace{(2 + 1)}_{3}\,x_1^2 + \underbrace{(4 - 2)}_{2}\,x_1x_2 + \underbrace{(2 + 1)}_{3}\,x_2^2 = 0
$$

照 $\boldsymbol{\Phi}_2$ 的順序（常數、$x_1$、$x_2$、$x_1^2$、$x_1x_2$、$x_2^2$）把係數排起來，就是 $[33, -20, -4, 3, 2, 3]$。課堂上算的三個數字是一樣的：常數項 $18 + 16 - 1 = 33$，$x_1$ 的係數 $-12 - 8 = -20$，$x_2$ 的係數 $-12 + 8 = -4$。

本文補充兩點。第一，這個橢圓的中心在 $x_1 + x_2 = 3$ 且 $x_1 - x_2 = 4$ 的地方，也就是 $(3.5, -0.5)$；把它代進 $\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}_2(\mathbf{x})$ 得到 $-1$，所以這組權重讓橢圓內部輸出 $-1$、外部輸出 $+1$。想讓內部是 $+1$，整個向量乘上 $-1$ 即可。第二，$x_1x_2$ 的係數 2 不是 0，這正是它「斜」的原因，也是 $(1, x_1^2, x_2^2)$ 做不出它的原因。

講義最後補了一句：直線與常數也包含在 $\mathcal{H}_{\boldsymbol{\Phi}_2}$ 裡，當作退化的情形（degenerate cases）。課堂上的說明是：直線只需要前三個權重，把三個二次項的權重都設成 0，剩下的 $\tilde{w}_0 + \tilde{w}_1x_1 + \tilde{w}_2x_2$ 就是原來的線性假說；永遠說圈或永遠說叉的常數分類器也在裡面。所以二次假說集合包含原來的線性假說集合。這個包含關係在最後一節會變成主角。

### Fun Time：拋物線的權重

**題目（第 7 頁）：** 使用轉換 $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$，下列哪一組 Z 空間的權重 $\tilde{\mathbf{w}}^\top$ 實現了拋物線 $2x_1^2 + x_2 = 1$？

1. $[-1, 2, 1, 0, 0, 0]$
2. $[0, 2, 1, 0, -1, 0]$
3. $[-1, 0, 1, 2, 0, 0]$
4. $[-1, 2, 0, 0, 0, 1]$

**答案：3。** 把方程式移項成 $-1 + x_2 + 2x_1^2 = 0$，再對照 $\boldsymbol{\Phi}_2$ 的六個位置：常數項係數 $-1$，$x_1$ 沒有出現所以是 0，$x_2$ 的係數是 1，$x_1^2$ 的係數是 2，$x_1x_2$ 與 $x_2^2$ 都是 0，得到 $[-1, 0, 1, 2, 0, 0]$。講義的評語是這題很簡單，重點是能實現任意的二次曲線，替「把 $E_{\text{in}}$ 做小」開了新的可能。

其他選項各自是別的曲線（本文推算）：

- 選項 1 是 $-1 + 2x_1 + x_2 = 0$，一條直線。它把 2 放到了 $x_1$ 的位置，而不是 $x_1^2$ 的位置。
- 選項 2 是 $2x_1 + x_2 - x_1x_2 = 0$，整理成 $(x_1 - 1)(x_2 - 2) = 2$，是雙曲線。
- 選項 4 是 $-1 + 2x_1 + x_2^2 = 0$，也是拋物線，但平方落在 $x_2$ 上，開口朝 $x_1$ 的負方向，不是題目要的那一條。

驗算：在拋物線上取 $(0, 1)$、$(1, -1)$、$(-2, -7)$、$(\frac{1}{3}, \frac{7}{9})$ 四個點，只有選項 3 在四個點上的 $\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}_2(\mathbf{x})$ 都是 0。

## 怎麼學到好的二次曲線：轉換、跑線性演算法、代回去

```youtube
url: https://www.youtube.com/watch?v=UHAn6Cuk8zk
title: Nonlinear Transformation :: Nonlinear Transform @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:56 是轉換的三個步驟，03:56–05:50 講兩個可以選的東西與潘朵拉的盒子，05:50–08:36 說明特徵轉換不是新東西，之後是 Fun Time。）

### 把「找好的二次曲線」換成「找好的直線」

前一節建立的是假說之間的對應。第 8 頁把它往前推一步，三行並排：

| Z 空間 | | X 空間 |
|---|---|---|
| 感知器 | $\iff$ | 二次假說 |
| 好的感知器 | $\iff$ | 好的二次假說 |
| 能分開資料的感知器 | $\iff$ | 能分開資料的二次假說 |

第一行是定義。後兩行成立的理由，是同一筆資料在兩邊的預測一模一樣：$h(\mathbf{x}_n) = \tilde{h}(\mathbf{z}_n)$，所以 $h$ 在 $\{(\mathbf{x}_n, y_n)\}$ 上錯幾筆，$\tilde{h}$ 在 $\{(\mathbf{z}_n, y_n)\}$ 上就錯幾筆，兩者的 $E_{\text{in}}$ 相等。課堂上說，如果把「好」理解成 $E_{\text{in}}$ 最小，那麼在 Z 空間找到一條分得開的直線，就等於在 X 空間找到一條分得開的二次曲線。

講義接著把問題整理成三句：

- **想要的**：在 Z 空間拿到好的感知器。
- **已經會的**：用資料 $\{(\mathbf{x}_n, y_n)\}$ 在 X 空間拿到好的感知器。
- **要做的**：用資料 $\{(\mathbf{z}_n = \boldsymbol{\Phi}_2(\mathbf{x}_n), y_n)\}$ 在 Z 空間拿到好的感知器。

第三句裡沒有任何新的演算法。演算法只看得到餵給它的向量與標籤，把 $\mathbf{x}_n$ 換成 $\mathbf{z}_n$ 餵進去，它就在 Z 空間裡找線。

### 三個步驟

第 9 頁把做法寫成三步：

1. 用 $\boldsymbol{\Phi}$ 把原始資料 $\{(\mathbf{x}_n, y_n)\}$ 轉換成 $\{(\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n), y_n)\}$。
2. 用 $\{(\mathbf{z}_n, y_n)\}$ 與你喜歡的線性分類演算法 $\mathcal{A}$，得到一個好的感知器 $\tilde{\mathbf{w}}$。
3. 回傳 $g(\mathbf{x}) = \text{sign}\left(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}(\mathbf{x})\right)$。

同一頁有四張圖排成一個方形。左上是 X 空間的原始資料，往右的箭頭標 $\boldsymbol{\Phi}$，到右上的 Z 空間資料；往下的箭頭標 $\mathcal{A}$，到右下那張畫了直線、塗了顏色的 Z 空間；右下與左下之間有兩個箭頭，一個往左、標 $\boldsymbol{\Phi}^{-1}$、畫成灰色，一個往右、標 $\boldsymbol{\Phi}$；左下是 X 空間裡的圓形邊界。

那個灰色的 $\boldsymbol{\Phi}^{-1}$ 講義沒有解釋，課堂上花了不少時間講。把 Z 空間的直線「搬回」X 空間得到曲線，只是我們想像的動作，這個反運算不一定存在，因為沒有人保證 $\mathbf{x}$ 到 $\mathbf{z}$ 是一對一的。實際上做的永遠是往右的箭頭：X 空間裡隨便一個點，先用 $\boldsymbol{\Phi}$ 送到 Z 空間，看它落在直線的哪一側，得到紅色或藍色，再把這個顏色塗回 X 空間的那個點上。每個點都這樣做，左下那張圖就畫出來了。第 3 步的式子 $g(\mathbf{x}) = \text{sign}(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}(\mathbf{x}))$ 寫的正是這個順序：先 $\boldsymbol{\Phi}$，再內積，再取正負號。

本文補充：$(1, x_1^2, x_2^2)$ 就不是一對一的。$(2, 0)$ 與 $(-2, 0)$ 平方之後都是 $(4, 0)$，Z 空間的一個點對到 X 空間的好幾個點，所以沒有反函數。下面的數值例子裡正好有這樣的一對點。

### 數值例子：七個點，在 Z 空間跑 PLA

以下是本文自擬的例子，不在講義上，數字用 Python（純整數運算）驗算過。資料是 X 空間裡的七個點：

| $n$ | $\mathbf{x}_n$ | $y_n$ |
|---|---|---|
| 1 | $(0, 0)$ | $+1$ |
| 2 | $(1, 0)$ | $+1$ |
| 3 | $(0, -1)$ | $+1$ |
| 4 | $(2, 0)$ | $-1$ |
| 5 | $(-2, 0)$ | $-1$ |
| 6 | $(0, 2)$ | $-1$ |
| 7 | $(1, 2)$ | $-1$ |

**先確認直線做不到。** 假設有一條線 $\text{sign}(w_0 + w_1x_1 + w_2x_2)$ 把七個點全分對。第 4、5 點是負的，所以 $w_0 + 2w_1 < 0$ 而且 $w_0 - 2w_1 < 0$。兩式相加得到 $2w_0 < 0$。可是第 1 點是原點，要分對就得 $w_0 > 0$，矛盾。原因從圖上看很直接：原點剛好在第 4、5 兩個負的點正中間。所以這份資料不是線性可分，[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)證過的 PLA 會停下來的保證在 X 空間用不上。

**步驟 1：轉換。** 用 $\boldsymbol{\Phi}(\mathbf{x}) = (1, x_1^2, x_2^2)$：

| $n$ | $\mathbf{x}_n$ | $\mathbf{z}_n = (1, x_1^2, x_2^2)$ | $y_n$ |
|---|---|---|---|
| 1 | $(0, 0)$ | $(1, 0, 0)$ | $+1$ |
| 2 | $(1, 0)$ | $(1, 1, 0)$ | $+1$ |
| 3 | $(0, -1)$ | $(1, 0, 1)$ | $+1$ |
| 4 | $(2, 0)$ | $(1, 4, 0)$ | $-1$ |
| 5 | $(-2, 0)$ | $(1, 4, 0)$ | $-1$ |
| 6 | $(0, 2)$ | $(1, 0, 4)$ | $-1$ |
| 7 | $(1, 2)$ | $(1, 1, 4)$ | $-1$ |

第 4、5 點在 Z 空間疊在一起，這就是前面說的 $\boldsymbol{\Phi}$ 不是一對一。

**步驟 2：在 Z 空間跑 PLA。** 從 $\tilde{\mathbf{w}} = (0, 0, 0)$ 開始，照 $n = 1, 2, \dots, 7$ 的順序輪流檢查，一圈看完再從頭；分數 $\tilde{\mathbf{w}}^\top\mathbf{z}_n$ 剛好是 0 時當成分錯。遇到分錯的點就修正 $\tilde{\mathbf{w}} \leftarrow \tilde{\mathbf{w}} + y_n\mathbf{z}_n$。下表只列出有修正的那幾次：

| 第幾次修正 | 檢查到的點 | 修正前的分數 $\tilde{\mathbf{w}}^\top\mathbf{z}_n$ | $y_n$ | 修正後的 $\tilde{\mathbf{w}}$ |
|---|---|---|---|---|
| 1 | 第 1 點 | $0$ | $+1$ | $(1, 0, 0)$ |
| 2 | 第 4 點 | $1$ | $-1$ | $(0, -4, 0)$ |
| 3 | 第 6 點 | $0$ | $-1$ | $(-1, -4, -4)$ |
| 4 | 第 1 點 | $-1$ | $+1$ | $(0, -4, -4)$ |
| 5 | 第 2 點 | $-4$ | $+1$ | $(1, -3, -4)$ |
| 6 | 第 3 點 | $-3$ | $+1$ | $(2, -3, -3)$ |
| 7 | 第 2 點 | $-1$ | $+1$ | $(3, -2, -3)$ |
| 8 | 第 3 點 | $0$ | $+1$ | $(4, -2, -2)$ |

以第 2 次修正為例：當時 $\tilde{\mathbf{w}} = (1, 0, 0)$，第 2、3 點的分數都是 1，分對了；第 4 點的分數是 $1 \cdot 1 + 0 \cdot 4 + 0 \cdot 0 = 1$，預測 $+1$ 但標籤是 $-1$，所以 $\tilde{\mathbf{w}} \leftarrow (1, 0, 0) - (1, 4, 0) = (0, -4, 0)$。第 8 次修正之後，七個點的分數依序是 $4, 2, 2, -4, -4, -4, -6$，正負號全部跟標籤一致，PLA 停下來。

**步驟 3：回傳 $g$。**

$$
g(\mathbf{x}) = \text{sign}\left(4 - 2x_1^2 - 2x_2^2\right)
$$

邊界是 $x_1^2 + x_2^2 = 2$，一個圓心在原點、半徑 $\sqrt{2} \approx 1.414$ 的圓，圓內是 $+1$。在 Z 空間裡它是直線 $z_1 + z_2 = 2$。

**預測新的點。** 照課堂上強調的方向，先轉換再算分數。$\mathbf{x} = (-1, -0.5)$：$\mathbf{z} = (1, 1, 0.25)$，分數 $4 - 2 - 0.5 = 1.5$，預測 $+1$。$\mathbf{x} = (1.5, 1)$：$\mathbf{z} = (1, 2.25, 1)$，分數 $4 - 4.5 - 2 = -2.5$，預測 $-1$。

**這個結果代表什麼。** PLA 的程式一行都沒改，它只是在三維的 $\mathbf{z}$ 上找一個平面（忽略永遠是 1 的 $z_0$ 的話，是 $(z_1, z_2)$ 平面上的一條線）。我們多做的事只有兩件：訓練前把每個 $\mathbf{x}_n$ 換成 $\mathbf{z}_n$，預測前把新的 $\mathbf{x}$ 也換成 $\mathbf{z}$。X 空間裡切不開的資料，$E_{\text{in}}$ 就這樣做到了 0。這個例子在後面兩節還會回來：它選轉換的方式其實有問題，而且同一份資料換一個轉換會學到不一樣的曲線。

### 兩個可以選的東西，以及潘朵拉的盒子

第 10 頁的標題把這個做法寫成一條式子：Nonlinear Model via Nonlinear $\boldsymbol{\Phi}$ + Linear Models。流程裡有兩個東西由你決定：

- **特徵轉換 $\boldsymbol{\Phi}$**：要轉換到什麼樣的 Z 空間。
- **線性模型 $\mathcal{A}$**：講義特別註明 not just binary classification。

課堂上把第二點展開：這堂用二元分類來講解，但同樣的做法可以用在線性迴歸、邏輯迴歸，甚至多類別分類上，因為核心只是換一個空間去做線性的學習。訓練時換到那個空間去找線，測試時也換到那個空間去看預測結果。

講義把後果叫作潘朵拉的盒子（Pandora's box）：現在可以自由地做二次 PLA、二次迴歸、三次迴歸，一路到多項式迴歸。課堂上的講法是，學過的 PLA、pocket、線性迴歸、邏輯迴歸，配上一個二次轉換就全部「二次化」，要三次化也可以，演算法的靈活度一下子增加很多。

### 特徵轉換並不是新東西

第 11 頁的圖是手寫數字。左上是一排排的原始數字影像，往右的箭頭標 $\boldsymbol{\Phi}$，到一張橫軸為平均強度（Average Intensity）、縱軸為對稱性（Symmetry）的散布圖，圖上的藍色圈是數字 1、紅色叉是 not 1；往下用 $\mathcal{A}$ 在這張圖上畫一條分隔線；左下是幾個新的數字影像，被框成紅色或藍色。講義的說明是 not new, not just polynomial：從 raw（pixels）到 concrete（intensity, symmetry），中間的箭頭上寫著 domain knowledge。

課堂上請大家回想[基石第 3 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning)：那時把特徵分成有具體物理意義的 concrete features，以及原始收集到的 raw features，並且說過原始的訊號可以整理成具體的特徵。數字辨識的例子裡，原始資料是 $16 \times 16$ 的灰階影像，也就是 256 維的向量；整理成對稱性與「佔了多少黑色格子」兩個數字之後，變成二維的向量，再在二維上做分類。課堂上補充，圖上做的是把 1 跟其他數字分開，有點像上一堂講的一對多拆解裡針對 1 的那一個子問題。測試時也一樣：新寫的字先算出這兩個特徵，再決定它是圈還是叉。

所以這件事以前就做過了，差別在轉換的來源。多項式轉換是機械式地把所有的項列出來；對稱性與強度是靠人對問題的了解挑出來的。兩者都是 $\boldsymbol{\Phi}$，後者相當於在像素空間裡做了非線性的事。

講義在頁尾寫：the force, too good to be true? 課堂上解釋 the force 是《星際大戰》裡的原力，特徵轉換在機器學習裡就是這麼強的一股力量，可以拿來做很多事。接著的問題是：它有沒有代價。

### Fun Time：d 維輸入的二次轉換有幾維

**題目（第 12 頁）：** 考慮 $\mathbf{x} \in \mathbb{R}^d$（而不是 $\mathbb{R}^2$）的二次轉換 $\boldsymbol{\Phi}_2(\mathbf{x})$。這個轉換要包含由 $(x_1, x_2, \dots, x_d)$ 組成的所有不同的二次項、一次項與常數項。$\mathbf{z} = \boldsymbol{\Phi}_2(\mathbf{x})$ 有幾個維度？

1. $d$
2. $\frac{d^2}{2} + \frac{3d}{2} + 1$
3. $d^2 + d + 1$
4. $2^d$

**答案：2。** 講義的解答把三種項分開數：

- 二次項：$\binom{d}{2} + d$ 個。課堂上的數法是，從 $d$ 個變數裡取兩個不一樣的相乘（$x_ix_j$，$i \ne j$），有 $\binom{d}{2}$ 種；取兩個一樣的（$x_i^2$），有 $d$ 種。
- 一次項：$d$ 個。
- 常數項：1 個。

加起來：

$$
\binom{d}{2} + d + d + 1 = \frac{d(d-1)}{2} + 2d + 1 = \frac{d^2}{2} + \frac{3d}{2} + 1
$$

用 $d = 2$ 檢查：$2 + 3 + 1 = 6$，正是 $(1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$ 的六項。

其他選項（本文推算）：選項 1 的 $d$ 連原來的一次項加常數都不夠。選項 3 的 $d^2 + d + 1$ 是把 $x_ix_j$ 與 $x_jx_i$ 當成兩個不同的項，二次項數成了 $d^2$ 個；$d = 2$ 時它給 7，多了一個。選項 4 的 $2^d$ 在 $d = 2$ 時是 4，也對不上。

課堂上提到 $d$ 可能是 10，也可能是 100。代進公式（本文計算）：$d = 10$ 時是 66 維，$d = 100$ 時是 5,151 維。光是二次轉換，維度就從 100 漲到五千多，這題是替下一節的問題暖身。

## 轉換要付什麼代價：維度、VC 維度，以及不能偷看資料

```youtube
url: https://www.youtube.com/watch?v=Inxr-Yc1Aow
title: Nonlinear Transformation :: Price of Nonlinear Transform @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:51 是計算與儲存的代價，03:51–05:58 是模型複雜度的代價，05:58–08:00 談兩者的取捨，08:00–14:29 講用眼睛挑轉換的危險，之後是 Fun Time。）

### Q 次多項式轉換有幾維

第 13 頁把二次推廣到 $Q$ 次。$Q$ 次多項式轉換把 0 次到 $Q$ 次的所有項列出來：

$$
\boldsymbol{\Phi}_Q(\mathbf{x}) = \Big(1,\ \ x_1, x_2, \dots, x_d,\ \ x_1^2, x_1x_2, \dots, x_d^2,\ \ \dots,\ \ x_1^Q, x_1^{Q-1}x_2, \dots, x_d^Q\Big)
$$

講義把它的長度記成 $1 + \tilde{d}$：1 是常數項（對應 $\tilde{w}_0$），$\tilde{d}$ 是其他的項。課堂上說把 1 獨立出來的理由，跟線性模型裡寫 $d + 1$ 是同一個；$d$ 上面的波浪號同樣表示這是 Z 空間裡的量。講義接著給出

$$
1 + \tilde{d} = \binom{Q + d}{Q} = \binom{Q + d}{d} = O\left(Q^d\right)
$$

講義只用一句話交代來源：這是「從 $d$ 種東西裡、可重複地取至多 $Q$ 個」的方法數。課堂上說這是高中排列組合裡的重複組合，請大家自己去翻書。下面把這一步補完（本文補充）。

每一項都長成 $x_1^{a_1}x_2^{a_2}\cdots x_d^{a_d}$，其中每個 $a_i$ 是非負整數，總次數 $a_1 + a_2 + \dots + a_d \le Q$。一組 $(a_1, \dots, a_d)$ 對應一個項，所以要數的是這個不等式有幾組非負整數解。多設一個變數 $a_0 = Q - (a_1 + \dots + a_d)$，代表「沒用掉的次數」，不等式就變成等式：

$$
a_0 + a_1 + a_2 + \dots + a_d = Q, \qquad a_i \ge 0
$$

這等於把 $Q$ 個相同的球分進 $d + 1$ 個箱子。把 $Q$ 個球與 $d$ 片隔板排成一列，一共 $Q + d$ 個位置，選其中 $d$ 個放隔板，方法數是 $\binom{Q+d}{d}$；改成選 $Q$ 個位置放球，寫法就是 $\binom{Q+d}{Q}$，兩者相等。

用 $d = 2$、$Q = 2$ 檢查：$\binom{4}{2} = 6$，跟 $\boldsymbol{\Phi}_2$ 的六項一致。上一題 Fun Time 的 $\frac{d^2}{2} + \frac{3d}{2} + 1$ 也是它的特例，因為 $\binom{d+2}{2} = \frac{(d+2)(d+1)}{2}$。

至於 $O(Q^d)$：課堂上說，把 $d$ 當成常數（資料給定之後它就固定了），看的是 $Q$ 變大時的成長。把二項式係數寫開，

$$
\binom{Q + d}{d} = \frac{(Q + d)(Q + d - 1)\cdots(Q + 1)}{d!}
$$

分子是 $d$ 個因式相乘，每個都是 $Q$ 的一次式，所以整體是 $Q$ 的 $d$ 次多項式。幾個數字（本文計算，括號內是 $\tilde{d}$）：

| | $Q = 1$ | $Q = 2$ | $Q = 3$ | $Q = 5$ | $Q = 10$ |
|---|---|---|---|---|---|
| $d = 2$ | 3（2） | 6（5） | 10（9） | 21（20） | 66（65） |
| $d = 10$ | 11（10） | 66（65） | 286（285） | 3,003（3,002） | 184,756（184,755） |

### 第一個代價：計算與儲存

講義在第 13 頁的結論是：$1 + \tilde{d}$ 就是計算與儲存 $\mathbf{z} = \boldsymbol{\Phi}_Q(\mathbf{x})$ 以及 $\tilde{\mathbf{w}}$ 所需要的力氣；$Q$ 大，就很難算、很難存。

課堂上把「力氣」拆成幾筆帳：

- **算 $\mathbf{z}$**：每一筆資料都要從 $\mathbf{x}$ 算出 $\mathbf{z}$。$\mathbf{x}$ 是 2 維、$\mathbf{z}$ 是 6 維的話，每筆要花 6 的力氣。
- **算 $\tilde{\mathbf{w}}$**：不管用 pocket、線性迴歸還是邏輯迴歸，每次更新至少要花 $\tilde{d} + 1$ 的力氣，PLA 每修正一次就是這麼多。線性迴歸可能更慘，要處理一個 $(\tilde{d} + 1) \times (\tilde{d} + 1)$ 的矩陣並求反矩陣。
- **存 $\tilde{\mathbf{w}}$**：學完之後要把 $\tilde{\mathbf{w}}$ 留下來才能預測，這也要空間。

課堂上的結論是，這個轉換並不是免費的，$Q$ 很大時要存、要更新一個一兩萬維的向量，或者在那樣的空間裡做最佳化，都可能很困難。

### 第二個代價：模型複雜度

第 14 頁的標題是 Model Complexity Price。同樣的 $1 + \tilde{d} = O(Q^d)$，換一個角度看：

- 自由參數 $\tilde{w}_i$ 的個數是 $\tilde{d} + 1$，講義寫它 $\approx d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q})$。這用的是[基石第 7 堂](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)的經驗法則：$d_{\text{VC}}$ 大致等於自由參數的個數。
- 講義接著給出一個確定成立的不等式 $d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q}) \le \tilde{d} + 1$，理由只有兩行：any $\tilde{d} + 2$ inputs not shattered in $\mathcal{Z}$ $\Longrightarrow$ any $\tilde{d} + 2$ inputs not shattered in $\mathcal{X}$。

把這兩行展開成完整的論證：

1. Z 空間裡的假說是 $\tilde{d}$ 維的感知器（外加常數項）。基石第 7 堂證過 $d$ 維感知器的 $d_{\text{VC}} = d + 1$，所以 Z 空間裡任意 $\tilde{d} + 2$ 個點，都不能被感知器 shatter。
2. 現在在 X 空間任取 $\tilde{d} + 2$ 個輸入 $\mathbf{x}_1, \dots, \mathbf{x}_{\tilde{d}+2}$，它們的轉換 $\mathbf{z}_n = \boldsymbol{\Phi}_Q(\mathbf{x}_n)$ 是 Z 空間裡的 $\tilde{d} + 2$ 個點。由第 1 步，一定存在某一種圈叉的排法 $(y_1, \dots, y_{\tilde{d}+2})$，沒有任何 $\tilde{\mathbf{w}}$ 能在這些 $\mathbf{z}_n$ 上做出來。
3. $\mathcal{H}_{\boldsymbol{\Phi}_Q}$ 裡的每個假說都長成 $h(\mathbf{x}) = \text{sign}(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}_Q(\mathbf{x}))$，它在 $\mathbf{x}_n$ 上的輸出就是對應的感知器在 $\mathbf{z}_n$ 上的輸出。所以那一種排法，$\mathcal{H}_{\boldsymbol{\Phi}_Q}$ 在這些 $\mathbf{x}_n$ 上也做不出來。
4. X 空間裡任意 $\tilde{d} + 2$ 個點都不能被 shatter，照定義 $d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q}) \le \tilde{d} + 1$。

課堂上用反證的口吻講第 3 步：如果 X 空間那邊可以 shatter，把那組係數拿到 Z 空間也就 shatter 了，這跟已知的事實不合。課堂上也交代，另一個方向（下限）比較難證，這門課不提，只要記得上限。本文補充為什麼反方向不能照抄：要證 $d_{\text{VC}} \ge \tilde{d} + 1$，得在 X 空間找出 $\tilde{d} + 1$ 個點被 shatter，可是轉換後的點只能落在 $\boldsymbol{\Phi}(\mathcal{X})$ 這個受限的範圍裡，不能任意擺。一個讓上限不是等號的小例子：輸入只有一維，$\boldsymbol{\Phi}(x) = (1, x, 2x)$，$\tilde{d} = 2$，上限是 3；但 $\tilde{w}_0 + \tilde{w}_1x + 2\tilde{w}_2x$ 只是一維的感知器，$d_{\text{VC}}$ 是 2。

看影片時留意一處：這一段收尾的那句話聽起來像是在說最多要付出 $\tilde{d} + 2$ 的代價。$\tilde{d} + 2$ 是論證裡「不能被 shatter 的點數」，$d_{\text{VC}}$ 的上限是講義寫的 $\tilde{d} + 1$。

講義的結論是 $Q$ large $\Longrightarrow$ large $d_{\text{VC}}$。課堂上的講法是：原本線性模型過得好好的，只有 $d + 1$ 的自由度，現在變成 $\tilde{d} + 1$，而且隨著 $Q$ 很快地漲上去。

### 兩個問題不能同時滿足

第 15 頁放了同一份資料的兩種分法。左圖用 $\boldsymbol{\Phi}_1$（就是原來的 $\mathbf{x}$），一條斜線分開兩群，有幾個圈與叉落在錯的一邊。右圖用 $\boldsymbol{\Phi}_4$，一條彎彎曲曲的四次曲線把每一個點都分對，$E_{\text{in}}(g) = 0$。講義問 which one do you prefer，並給了評語：$\boldsymbol{\Phi}_1$ 視覺上比較討喜；$\boldsymbol{\Phi}_4$ 的 $E_{\text{in}}$ 是 0，但是 overkill。課堂上說大部分的人會選左邊，右邊把一些看起來不合群的點也硬分對了，做得太過頭。

本文補充：二維輸入的 $\boldsymbol{\Phi}_4$ 有 $\binom{6}{2} = 15$ 個權重，而 $\boldsymbol{\Phi}_1$ 只有 3 個。

講義把這件事接回基石第二個問題留下來的兩個核心問題：

1. 能不能確保 $E_{\text{out}}(g)$ 跟 $E_{\text{in}}(g)$ 夠接近？
2. 能不能讓 $E_{\text{in}}(g)$ 夠小？

| $\tilde{d}$（$Q$） | 問題 1：$E_{\text{out}} \approx E_{\text{in}}$ | 問題 2：$E_{\text{in}}$ 夠小 |
|---|---|---|
| 比較高 | 不容易 | 容易 |
| 比較低 | 容易 | 不容易 |

$\tilde{d}$ 高的時候，假說多、曲線彎得動，$E_{\text{in}}$ 容易做小，但 $d_{\text{VC}}$ 大，兩個誤差可能差很遠。$\tilde{d}$ 低的時候反過來。課堂上說，這是機器學習裡最重要的取捨。

用基石第 7 堂的 $\Omega = \sqrt{\frac{8}{N}\ln\frac{4(2N)^{d_{\text{VC}}}}{\delta}}$ 可以看到問題 1 這一欄的數字（本文計算，$N = 10{,}000$、$\delta = 0.1$，$d_{\text{VC}}$ 取上限）：

| 轉換（二維輸入） | $d_{\text{VC}}$ 上限 | $\Omega$ |
|---|---|---|
| $\boldsymbol{\Phi}_1$ | 3 | 0.163 |
| $\boldsymbol{\Phi}_2$ | 6 | 0.225 |
| $\boldsymbol{\Phi}_4$ | 15 | 0.349 |
| $\boldsymbol{\Phi}_{50}$ | 1,326 | 3.24 |

誤差最大就是 1，$\Omega$ 超過 1 表示這個保證什麼都沒說。VC bound 本身很寬鬆，這些數字的絕對大小不必當真，要看的是它隨 $d_{\text{VC}}$ 變大的方向。

### 用眼睛挑轉換的危險

那麼 $Q$ 要怎麼選？第 15 頁的頁尾試探性地問：visually, maybe？剛才判斷 $\boldsymbol{\Phi}_1$ 比 $\boldsymbol{\Phi}_4$ 好，靠的就是眼睛。第 16 頁的標題直接回答：Danger of Visual Choices。

第一個理由寫在最上面：$\mathcal{X} = \mathbb{R}^{10}$ 時你真的能「看」嗎？講義自己答 well, I can't。課堂上補充，實際上用到的資料大多是高維度的，要靠視覺來決定並不容易。

第二個理由比較隱微：就算在看得見的 $\mathbb{R}^2$，用眼睛決定也有問題。講義用開頭那份圓形可分的資料，列了四個愈來愈「聰明」的選擇：

| 選擇 | $\mathbf{z}$ | 講義標的 $d_{\text{VC}}$ |
|---|---|---|
| 完整的二次轉換 | $(1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$ | 6 |
| 看過圖之後 | $(1, x_1^2, x_2^2)$ | 3 |
| 更好？ | $(1, x_1^2 + x_2^2)$ | 2 |
| 再更好？ | $\left(\text{sign}(0.6 - x_1^2 - x_2^2)\right)$ | 講義沒有寫數字 |

課堂上把這四步演成一段對話。一開始老實用六維的轉換，付出 $d_{\text{VC}} = 6$ 的代價。看了圖發現不必這麼複雜，三維就好，代價是 3。更聰明的同學說：反正是正圓，只要算點到原點的距離平方，用一個特別的多項式 $x_1^2 + x_2^2$ 就夠了，代價是 2。最後老師出手做「最聰明」的事：轉換不一定要是多項式，乾脆把答案直接當成特徵，$\mathbf{z}$ 只剩一維，連常數項都不用，課堂上說這樣看起來只要付 1 的代價。

聽起來愈來愈划算，問題出在哪裡？課堂上的解釋是：在這個過程裡，是你的腦袋經過了一番運算，替這一份資料挑出了適合的轉換。VC 的推論原本說的是，資料從某個分布抽出來，我們去算有多少機率會抽到讓學習失敗的壞資料；這個推論假設假說集合在看到資料之前就定好了。你先看了資料才定轉換，等於你的腦袋先做了一次學習，課堂上稱它為 human learning，並且說這已經不是 machine learning。交給機器的東西已經受到你主觀選擇的影響，選擇付出的複雜度代價留在你的腦袋裡，沒有被算進去。

後果是高估：你會以為自己用很小的 $d_{\text{VC}}$ 就把 $E_{\text{in}}$ 做得很低。課堂上的說法是，看起來 $d_{\text{VC}}$ 很小，只是因為沒有把腦袋裡的 VC 維度算進去；而人夠聰明，能做很多不同的分類工作，腦袋的 VC 維度應該相當大。課堂上舉的下場是：機器看起來做得很好，拿去投資股市卻怎麼做都做不好。

講義把這一頁收成兩句：

> careful about your brain's 'model complexity'

> for VC-safety, $\boldsymbol{\Phi}$ shall be decided without 'peeking' data

本文補充：前面七個點的例子就犯了這個錯。我先擺好了「正的在裡面、負的在外面、而且以原點為中心」的資料，再挑 $(1, x_1^2, x_2^2)$ 這個剛好適合它的轉換。帳面上是 $d_{\text{VC}} = 3$、$E_{\text{in}} = 0$，但這個 3 沒有算到「先看圖再挑轉換」的那一步。如果事先不看資料，老實用完整的 $\boldsymbol{\Phi}_2$，同樣的 PLA（同樣的起點與檢查順序）修正 7 次後停在 $\tilde{\mathbf{w}} = (3, 0, -3, -2, 0, -3)$，邊界是 $2x_1^2 + 3x_2^2 + 3x_2 = 3$，一個中心在 $(0, -0.5)$ 的橢圓，$E_{\text{in}}$ 也是 0。兩條曲線在七個訓練點上完全一致，在沒看過的點上卻會意見不同：$\mathbf{x} = (1.2, 0.5)$ 代進圓的式子是 $4 - 2.88 - 0.5 = 0.62$，預測 $+1$；代進橢圓的式子是 $3 - 1.5 - 2.88 - 0.75 = -2.13$，預測 $-1$。七筆資料分不出誰對，這就是自由度變多的代價在小例子上的樣子。

這個主題在[基石第 16 堂：三個學習原則](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles)會以 data snooping 的名字再出現一次。讀這堂課之後，每遇到一個 $\boldsymbol{\Phi}$ 可以問自己兩件事：$\tilde{d}$ 是多少？這個 $\boldsymbol{\Phi}$ 是不是看了資料才決定的？

### Fun Time：Q = 50 時的維度

**題目（第 17 頁）：** 考慮 $\mathbf{x} \in \mathbb{R}^2$ 的 $Q$ 次多項式轉換 $\boldsymbol{\Phi}_Q(\mathbf{x})$。回想 $\tilde{d} = \binom{Q+2}{2} - 1$。$Q = 50$ 時 $\tilde{d}$ 是多少？

1. 1126
2. 1325
3. 2651
4. 6211

**答案：2。** 直接代入：

$$
\tilde{d} = \binom{52}{2} - 1 = \frac{52 \times 51}{2} - 1 = 1326 - 1 = 1325
$$

講義的評語是：只是簡單的計算，但它讓你看到轉換後 $\tilde{d}$ 變成 $d = 2$ 的好幾百倍（$1325 / 2 \approx 662$）。

其他選項（本文推算）：選項 3 的 2651 是忘了除以 2，$52 \times 51 - 1 = 2651$。選項 1 的 1126 與選項 4 的 6211 用這條公式算不出來；就本文的觀察，1126 是這門課愛用的數字：下一節的 $\mathcal{H}_{1126}$、後面作業裡「重複 1126 次」的實驗用的都是它。

課堂上接著問了一個實際的問題：原本只是二維，現在到了一千多維的空間，你的資料量撐得住嗎？二維的時候可能二十個點就夠了，一千維的時候二十個點肯定不夠，你真的有一萬個點嗎？本文補充：照基石第 7 堂的經驗法則 $N \approx 10\,d_{\text{VC}}$ 估算，二維感知器 $d_{\text{VC}} = 3$，約需 30 筆；$\boldsymbol{\Phi}_{50}$ 的 $d_{\text{VC}}$ 上限是 1326，約需 13,000 筆，跟課堂上說的數量級相符。

## 該從哪個轉換開始試：巢狀假說集合與先試線性模型

```youtube
url: https://www.youtube.com/watch?v=gcLmU3MC3bE
title: Nonlinear Transformation :: Structured Hypothesis Sets @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:20 是多項式轉換的遞迴定義與巢狀結構，02:20–04:38 推出 VC 維度與 E_in 的兩串不等式，04:38–07:30 講先試線性模型，07:30–08:02 是 Fun Time，之後是總結與下一堂預告。）

### 多項式轉換一層包一層

第 18 頁把多項式轉換重新寫成遞迴的樣子。零次轉換只有常數，之後每升一次，就是在前一個轉換後面接上所有新次數的項：

$$
\begin{aligned}
\boldsymbol{\Phi}_0(\mathbf{x}) &= \big(1\big) \\
\boldsymbol{\Phi}_1(\mathbf{x}) &= \big(\boldsymbol{\Phi}_0(\mathbf{x}),\ x_1, x_2, \dots, x_d\big) \\
\boldsymbol{\Phi}_2(\mathbf{x}) &= \big(\boldsymbol{\Phi}_1(\mathbf{x}),\ x_1^2, x_1x_2, \dots, x_d^2\big) \\
\boldsymbol{\Phi}_3(\mathbf{x}) &= \big(\boldsymbol{\Phi}_2(\mathbf{x}),\ x_1^3, x_1^2x_2, \dots, x_d^3\big) \\
&\ \ \vdots \\
\boldsymbol{\Phi}_Q(\mathbf{x}) &= \big(\boldsymbol{\Phi}_{Q-1}(\mathbf{x}),\ x_1^Q, x_1^{Q-1}x_2, \dots, x_d^Q\big)
\end{aligned}
$$

每個轉換都包含前一個轉換。課堂上說明這對假說集合的意義：在比較大的 Z 空間裡做線性學習時，永遠可以把新增加的那些維度的權重設成 0，這樣得到的假說就跟前一個轉換能做的一模一樣。前一節說「直線是二次假說的退化情形」，用的就是同一個理由。把每個轉換對應的假說集合 $\mathcal{H}_{\boldsymbol{\Phi}_i}$ 簡寫成 $\mathcal{H}_i$，得到

$$
\mathcal{H}_0 \subset \mathcal{H}_1 \subset \mathcal{H}_2 \subset \mathcal{H}_3 \subset \dots \subset \mathcal{H}_Q
$$

講義畫了一組一個套一個的橢圓，最裡面一圈標 $\mathcal{H}_0$，往外依序是 $\mathcal{H}_1$、$\mathcal{H}_2$、$\mathcal{H}_3$，並把這種一個包一個的關係稱為假說集合的結構（structure: nested $\mathcal{H}_i$）。

### 兩串方向相反的不等式

第 19 頁令 $g_i = \text{argmin}_{h \in \mathcal{H}_i} E_{\text{in}}(h)$，也就是在 $\mathcal{H}_i$ 裡 $E_{\text{in}}$ 最低的那個假說，然後寫下三行：

$$
\begin{array}{ccccccccc}
\mathcal{H}_0 & \subset & \mathcal{H}_1 & \subset & \mathcal{H}_2 & \subset & \mathcal{H}_3 & \subset & \dots \\
d_{\text{VC}}(\mathcal{H}_0) & \le & d_{\text{VC}}(\mathcal{H}_1) & \le & d_{\text{VC}}(\mathcal{H}_2) & \le & d_{\text{VC}}(\mathcal{H}_3) & \le & \dots \\
E_{\text{in}}(g_0) & \ge & E_{\text{in}}(g_1) & \ge & E_{\text{in}}(g_2) & \ge & E_{\text{in}}(g_3) & \ge & \dots
\end{array}
$$

第二行與第三行講義沒有寫理由，課堂上各用一段話說明，整理如下。

**VC 維度不會變小。** $\mathcal{H}_i \subset \mathcal{H}_{i+1}$ 表示 $\mathcal{H}_{i+1}$ 擁有 $\mathcal{H}_i$ 的每一個假說。如果某 $k$ 個點能被 $\mathcal{H}_i$ shatter，那 $2^k$ 種排法各自由 $\mathcal{H}_i$ 裡的某個假說做出來，這些假說也都在 $\mathcal{H}_{i+1}$ 裡，所以這 $k$ 個點同樣被 $\mathcal{H}_{i+1}$ shatter。能 shatter 的點數只會變多或持平。

**最低的 E_in 不會變大。** $g_i$ 本身也是 $\mathcal{H}_{i+1}$ 的成員。$g_{i+1}$ 是在 $\mathcal{H}_{i+1}$ 裡挑 $E_{\text{in}}$ 最低的，候選名單包含 $g_i$，所以 $E_{\text{in}}(g_{i+1}) \le E_{\text{in}}(g_i)$。課堂上的講法是：選擇變多了，可能在新增的選擇裡找到更好的；找不到的話，至少跟原來一樣。

**套到七個點上（本文計算）。** 用前面的資料，三個正的、四個負的：

| 假說集合 | 能做的事 | 最低的 $E_{\text{in}}$ | 怎麼得到 |
|---|---|---|---|
| $\mathcal{H}_0$ | 常數：全猜 $+1$ 或全猜 $-1$ | $\frac{3}{7}$ | 全猜 $-1$ 錯 3 筆，全猜 $+1$ 錯 4 筆 |
| $\mathcal{H}_1$ | 直線 | $\frac{1}{7}$ | 前面證過至少錯 1 筆；$\text{sign}(1.5 - x_1 - x_2)$ 只錯第 5 點 |
| $\mathcal{H}_2$ | 二次曲線 | $0$ | 前面 PLA 找到的圓 |
| $\mathcal{H}_3$ 以後 | 三次以上的曲線 | $0$ | 已經是 0，不可能更低 |

$\frac{3}{7} \ge \frac{1}{7} \ge 0 \ge 0$，跟第三行一致。同時 $d_{\text{VC}}$ 的上限是 1、3、6、10：到 $\mathcal{H}_3$ 時有 10 個權重，比資料的 7 筆還多，$E_{\text{in}}$ 卻一點也沒有再進步。從 $\mathcal{H}_2$ 往右走，多付的全是複雜度。

第 19 頁的下半是基石第 7 堂出現過的那張圖，橫軸是 $d_{\text{VC}}$：in-sample error 的曲線一路往下，model complexity 的曲線一路往上，out-of-sample error 的曲線先降後升，最低點對應的橫座標標成 $d^*_{\text{VC}}$。巢狀假說集合由左到右排開，正好對應這張圖的橫軸。講義在旁邊寫了一句：use $\mathcal{H}_{1126}$ won't be good。課堂上的說明是，一開始就用 1126 次這麼高的轉換，你已經站在曲線非常右邊的地方，$E_{\text{in}}$ 可能很低，但付出了很大的模型複雜度，$E_{\text{out}}$ 會很高。

本文補充一個數字：二維輸入的 $\boldsymbol{\Phi}_{1126}$，$\tilde{d} = \binom{1128}{2} - 1 = 635{,}627$。

### 先試線性模型

第 20 頁把建議寫成兩條路。

**誘人的罪（tempting sin）：** 直接用 $\mathcal{H}_{1126}$，拿很低的 $E_{\text{in}}(g_{1126})$ 去唬老闆。講義的評語是 really? a dangerous path of no return。課堂上說，剛接觸特徵轉換的人特別容易這樣做：資料都在你手上，做一個高維度的轉換，把 $E_{\text{in}}$ 壓到 0，跑去跟老闆說做得很好，老闆一時不察就被騙了。可是我們在意的從來不是 $E_{\text{in}}$，它只是中間的產物。課堂上把 path of no return 講成一條不歸路：$E_{\text{in}}$ 做好了、$E_{\text{out}}$ 卻很高，接下來幾乎沒有辦法再做什麼補救。

**安全的路（safe route）：** 先用 $\mathcal{H}_1$。

- 如果 $E_{\text{in}}(g_1)$ 夠好，事情就結束了（講義寫 live happily thereafter）。$d_{\text{VC}}$ 小，$E_{\text{out}}$ 跟 $E_{\text{in}}$ 接近，所以 $E_{\text{out}}$ 也好。
- 如果不夠好，就往曲線的右邊移動，損失的只有「浪費掉」的計算（nothing lost except 'wasted' computation）。

講義的結語是 linear model first: simple, efficient, safe, and workable。課堂上逐一對過這四個形容詞：簡單；有效率，因為維度小；安全；最後一個是很多時候你會意外發現它做得還不錯。課堂上特別叮嚀，不要以為線性的就一定做不好，很多時候線性是描述這個世界相當好的一種逼近。

### Fun Time：巢狀集合的 VC 維度

**題目（第 21 頁）：** 考慮兩個假說集合 $\mathcal{H}_1$ 與 $\mathcal{H}_{1126}$，其中 $\mathcal{H}_1 \subset \mathcal{H}_{1126}$。$d_{\text{VC}}(\mathcal{H}_1)$ 與 $d_{\text{VC}}(\mathcal{H}_{1126})$ 之間，下列哪一種關係不可能發生？

1. $d_{\text{VC}}(\mathcal{H}_1) = d_{\text{VC}}(\mathcal{H}_{1126})$
2. $d_{\text{VC}}(\mathcal{H}_1) \ne d_{\text{VC}}(\mathcal{H}_{1126})$
3. $d_{\text{VC}}(\mathcal{H}_1) < d_{\text{VC}}(\mathcal{H}_{1126})$
4. $d_{\text{VC}}(\mathcal{H}_1) > d_{\text{VC}}(\mathcal{H}_{1126})$

**答案：4。** 講義的解答是：$\mathcal{H}_1$ 能 shatter 的每一組輸入，$\mathcal{H}_{1126}$ 也能 shatter，所以 $d_{\text{VC}}$ 不可能變小。這就是剛才那串「$\le$」的理由。

其他三個選項都可能發生（本文補充）。題目只給了包含關係，沒有說兩個集合是多項式轉換來的，所以要問的是：一般而言，小集合包在大集合裡，會發生什麼？

- 選項 3（小於）與選項 2（不等於）是常見的情形。例如二維輸入的直線 $d_{\text{VC}} = 3$，二次曲線 $d_{\text{VC}} = 6$（講義第 16 頁的數字）。
- 選項 1（等於）也可能。大集合比小集合多出來的假說，不一定幫得上 shatter。一個例子：一維的 positive ray $h(x) = \text{sign}(x - a)$，$d_{\text{VC}} = 1$；再加進「永遠輸出 $-1$」這一個假說，集合變大了，但兩個點 $x_1 < x_2$ 上「左 $+1$、右 $-1$」的排法仍然做不出來，$d_{\text{VC}}$ 還是 1。

看影片時留意一處：課堂上口頭報的答案編號聽起來是 3，但緊接著的說明是大於的那種情形不可能發生，對到講義上的選項 4。以講義的參考答案 4 為準。

### 這堂課的總結

第 22 頁把四節各收成一句：

| 節 | 講義的一句話 |
|---|---|
| Quadratic Hypotheses | linear hypotheses on quadratic-transformed data |
| Nonlinear Transform | happy linear modeling after $\mathcal{Z} = \boldsymbol{\Phi}(\mathcal{X})$ |
| Price of Nonlinear Transform | computation/storage/[model complexity] |
| Structured Hypothesis Sets | linear/simpler model first |

第三句裡 model complexity 被方括號框起來。課堂上的總結也說，最重要的代價是模型複雜度上的代價。

頁尾的預告是 next: dark side of the force。課堂上說，特徵轉換是原力，這堂其實已經碰到一些它的黑暗面；下一堂要正面講它對機器學習造成什麼不好的影響，之後再講怎麼控制。Roadmap 上，下一堂開始進入第四個問題 How Can Machines Learn Better?。

## 自我檢查

**1. 用 $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$，寫出一組 $\tilde{\mathbf{w}}$，讓邊界是圓心 $(1, 2)$、半徑 2 的圓，而且圓內輸出 $+1$。為什麼 $(1, x_1^2, x_2^2)$ 做不出這個圓？**

答案：圓內為正，所以取 $4 - (x_1 - 1)^2 - (x_2 - 2)^2 > 0$。展開：$4 - x_1^2 + 2x_1 - 1 - x_2^2 + 4x_2 - 4 = -1 + 2x_1 + 4x_2 - x_1^2 - x_2^2$，所以 $\tilde{\mathbf{w}} = (-1, 2, 4, -1, 0, -1)$（乘上任何正數也對）。檢查：圓心 $(1, 2)$ 的分數是 $-1 + 2 + 8 - 1 - 4 = 4 > 0$；圓上的點 $(3, 2)$ 是 $-1 + 6 + 8 - 9 - 4 = 0$。展開後有 $2x_1$ 與 $4x_2$ 兩個一次項，$(1, x_1^2, x_2^2)$ 沒有對應的位置。

**2. 輸入是 10 維。$Q = 2$、$3$、$5$ 的多項式轉換，$\tilde{d}$ 各是多少？用 $N \approx 10\,d_{\text{VC}}$ 的經驗法則、$d_{\text{VC}}$ 取上限 $\tilde{d} + 1$，各需要大約幾筆資料？**

答案：$1 + \tilde{d} = \binom{Q + 10}{10}$，分別是 $\binom{12}{10} = 66$、$\binom{13}{10} = 286$、$\binom{15}{10} = 3003$，所以 $\tilde{d} = 65$、$285$、$3002$。資料量大約 660、2,860、30,030 筆。次數從 2 升到 5，需要的資料多了約 45 倍。

**3. 一維資料五筆：$x = -2, -1, 0, 1, 2$，標籤依序是 $-1, +1, +1, +1, -1$。求 $E_{\text{in}}(g_0)$、$E_{\text{in}}(g_1)$，並在 $\mathcal{H}_2$ 裡找一個 $E_{\text{in}} = 0$ 的假說（$\boldsymbol{\Phi}_2(x) = (1, x, x^2)$）。**

答案：$\mathcal{H}_0$ 只能全猜一種，全猜 $+1$ 錯 2 筆，$E_{\text{in}}(g_0) = \frac{2}{5}$。$\mathcal{H}_1$ 是一維感知器 $\text{sign}(w_0 + w_1x)$：$x = 0$ 在兩個負的點 $\pm 2$ 的正中間，跟七個點的例子一樣，$w_0 \pm 2w_1 < 0$ 相加得 $w_0 < 0$，與 $x = 0$ 要為正矛盾，所以至少錯 1 筆；$\text{sign}(1.5 - x)$ 只錯 $x = -2$ 這一筆，$E_{\text{in}}(g_1) = \frac{1}{5}$。$\mathcal{H}_2$：取 $\tilde{\mathbf{w}} = (2.5, 0, -1)$，也就是 $\text{sign}(2.5 - x^2)$，五筆的分數是 $-1.5, 1.5, 2.5, 1.5, -1.5$，全對。$\frac{2}{5} \ge \frac{1}{5} \ge 0$。

**4. 同事拿到一份二維資料，先畫散布圖，發現正的點圍成一圈、負的點在圈外，於是只用 $\mathbf{z} = (1, x_1^2 + x_2^2)$ 訓練，得到 $E_{\text{in}} = 0$，並在報告裡寫「模型的 VC 維度只有 2，所以泛化有保證」。這個說法哪裡有問題？該怎麼做才站得住腳？**

判準：答案要指出轉換是看了資料才選的，選擇的過程（從所有可能的轉換裡挑出這一個）本身有複雜度，沒有算進那個 2 裡，所以 VC 的保證不適用，結論偏樂觀。站得住腳的做法是在看資料之前就決定轉換（例如事先約定用 $\boldsymbol{\Phi}_2$，接受 $d_{\text{VC}} = 6$ 的代價），或者另外留一份沒有參與任何決定的資料來評估。只答「VC 維度算錯」而沒有說出代價藏在人的選擇裡，不算完整。

**5. $d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q}) \le \tilde{d} + 1$ 的證明用了哪一個已知結果？為什麼同樣的論證不能直接得到 $\ge$？**

判準：要說出用的是「$\tilde{d}$ 維感知器不能 shatter 任何 $\tilde{d} + 2$ 個點」，以及「$\mathcal{H}_{\boldsymbol{\Phi}_Q}$ 在 $\mathbf{x}_n$ 上的輸出等於感知器在 $\mathbf{z}_n$ 上的輸出」，所以 Z 空間做不出的排法 X 空間也做不出。反方向需要找到 $\tilde{d} + 1$ 個 X 空間的點被 shatter，但它們的轉換只能落在 $\boldsymbol{\Phi}(\mathcal{X})$ 上，不能任意擺放，感知器在 Z 空間「存在某 $\tilde{d} + 1$ 個點可以 shatter」的那組點不一定是某些 $\mathbf{x}$ 的轉換。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把基石第 11、12 堂排在同一週（W6，10/07），這堂的投影片是 [12u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/12u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)排在 W6（10/14）；2026-09-30 查核時，這一週的投影片連結還是 404，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 3.4 節。

**作業。** 相關的題目在 [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)（2024-10-21 發布、11-04 截止，12 題加 1 題 bonus），沒有官方解答：

| 題號 | 內容 | 對應這堂的哪裡 |
|---|---|---|
| Q4 | 對每筆訓練資料做 one-hot 的「Dr. Transformer」轉換後跑線性迴歸；題目提示你想想 $E_{\text{out}}$ | 轉換的代價：$E_{\text{in}}$ 做得很低不代表學到東西 |
| Q11–12 | cpusmall_scale 資料做 $Q = 3$ 的齊次多項式轉換，看 $E_{\text{in}}$ 的收益與 $E_{\text{out}}$ 的變化 | 兩個問題的取捨、巢狀假說集合 |
| Q13（bonus） | 乘法形式的假說集合，證明或否證它的 $d_{\text{VC}}$ 大於線性假說 | 轉換與 $d_{\text{VC}}$ |

程式題用的 [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) 來自公開的 LIBSVM datasets 頁面，每個實驗要用不同的隨機種子重複 1126 次。Q11 可以這樣自我驗收：$E_{\text{in}}$ 的差值依定義不會是負的，因為線性假說包含在轉換後的假說集合裡（跟這堂 $E_{\text{in}}$ 那串不等式是同一個道理）；出現負值代表實作有錯。整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**延伸閱讀。**

- 特徵轉換與正則化的取捨，另一門課的講法：[CMU 07-280 Lecture 10：Feature Engineering 與 Regularization](/posts/ai/2026-08-22-cmu-07280-lecture-10-feature-engineering-regularization)。
- 技法會把「維度大要付代價」這個問題交給 SVM 與 kernel 處理：[技法第 1 堂：線性 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)、[技法第 3 堂：Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)。

**下一堂。** [基石第 13 堂：過擬合](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)接著講原力的黑暗面：轉換太強、$E_{\text{in}}$ 很低而 $E_{\text{out}}$ 很高的時候，到底發生了什麼事。

## 課程影片來源

原始影片：[Quadratic Hypotheses](https://www.youtube.com/watch?v=8pQ06pku1xA)、[Nonlinear Transform](https://www.youtube.com/watch?v=UHAn6Cuk8zk)、[Price of Nonlinear Transform](https://www.youtube.com/watch?v=Inxr-Yc1Aow)、[Structured Hypothesis Sets](https://www.youtube.com/watch?v=gcLmU3MC3bE)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：改為一堂一篇，依講義與影片逐字稿重寫。

## 參考資料

- [基石第 12 堂講義 12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)：本文的主要底本，四節的內容、四題 Fun Time 與各頁的圖都出自這份講義。
- [基石第 7 堂講義 07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf)：$d$ 維感知器的 VC 維度、$\Omega$ 的公式與 $N \approx 10\,d_{\text{VC}}$ 的經驗法則，用在模型複雜度那一節的計算。
- [基石第 3 堂講義 03_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf)：concrete features 與 raw features 的區分、$16 \times 16$ 灰階影像的例子。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：W6 的排程、12u 投影片與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：W6（10/14）的排程。
- [Fall 2024 Homework 4（hw4_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)：Q4、Q11–12、Q13 的題目內容與發布、截止日期。
- [LIBSVM datasets：cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale)：HW4 程式題的資料。
- [Learning from Data 教科書網站](http://amlbook.com)：3.4 節的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
