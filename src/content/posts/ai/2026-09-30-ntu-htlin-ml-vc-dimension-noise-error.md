---
title: "VC 維度：模型複雜度怎麼量｜台大林軒田 機器學習基石 第 7 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, perceptron]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 7
tldr: "這堂課把「最大的非 break point」命名為 VC 維度 d_VC，用可逆矩陣與線性相依兩段證明 d 維感知器的 d_VC = d + 1，再把 VC bound 改寫成 E_out ≤ E_in + Ω：d_VC 愈大，E_in 愈容易壓低，但複雜度的懲罰 Ω 也愈大。照 bound 算，ε = δ = 0.1、d_VC = 3 要 29,300 筆資料，大約是 10,000 倍的 d_VC；實務上 10 倍常常就夠。"
description: "台大林軒田機器學習基石第 7 堂 The VC Dimension 導讀：VC 維度的定義與四個例子、d 維感知器 d_VC = d + 1 的兩段證明、自由度的直覺、VC bound 改寫成模型複雜度懲罰與樣本複雜度的推導、bound 為什麼鬆，附四個點的手算例子與每一題 Fun Time 的解釋。"
draft: false
glossary:
  - term: "VC 維度"
    aliases: ["VC dimension", "d_VC", "Vapnik-Chervonenkis dimension"]
    definition: "假說集合 H 能 shatter 的最多點數，也就是 m_H(N) = 2^N 成立的最大 N；等於最小 break point 減 1。任何 N 都成立時記成無限大。"
    context: "基石第 7 堂用它當模型複雜度的量尺；d 維感知器的 d_VC = d + 1。"
    links:
      - label: "基石第 7 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf"
  - term: "模型複雜度的懲罰"
    aliases: ["penalty for model complexity", "Ω(N, H, δ)"]
    definition: "把 VC bound 改寫成 E_out ≤ E_in + Ω 之後的那一項：Ω = √((8/N)·ln(4(2N)^d_VC / δ))。d_VC 愈大它愈大，N 愈大它愈小。"
    context: "基石第 7 堂用它說明假說集合不是愈強愈好。"
  - term: "樣本複雜度"
    aliases: ["sample complexity"]
    definition: "給定容許的誤差 ε、容許的失敗機率 δ 與 d_VC，要多少筆資料 N 才能讓 VC bound 的右邊不超過 δ。"
    context: "基石第 7 堂算出理論上約需 10,000 倍的 d_VC，實務經驗是 10 倍。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/26 到 26/26），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 7 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，這堂在第二個「Why Can Machines Learn?」底下。上一堂[基石第 6 堂：泛化理論](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization)的結論在 Roadmap 上只有一句：只要成長函數 $m_{\mathcal{H}}(N)$ 在某處出現 break point，而且 $N$ 夠大，$E_{\text{out}} \approx E_{\text{in}}$ 就有可能。

那個結論用起來不順手。每換一個假說集合，都得重新找它的 break point、重寫一次上限。這堂課做三件事：把 break point 換成一個數字，叫 VC 維度；算出感知器的這個數字；再拿這個數字回頭讀 VC bound，看它對「模型該選多複雜」「資料要多少筆」各說了什麼。

先備是[基石第 5 堂：訓練與測試](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)的 dichotomy、成長函數、shatter 與 break point，上一堂的上限函數 $B(N, k)$ 與 VC bound，以及線性代數的反矩陣與線性相依。讀完之後，你應該能自己判斷一個假說集合的 VC 維度該怎麼證（兩個方向各要證什麼），把感知器的兩段證明重寫一遍，從 VC bound 推出 $\Omega$ 那個根號，並且代數字算出某個 $N$ 之下 bound 到底保證了多少。

## 給 break point 一個正式的名字：VC 維度的定義

```youtube
url: https://www.youtube.com/watch?v=XxPB9GlJEUk
title: The VC Dimension :: Definition of VC Dimension @ Machine Learning Foundations (機器學習基石)
```

（影片 00:19–03:06 複習成長函數的上限，03:06–06:19 複習 VC bound 與學得起來的條件，06:19–09:03 是定義，09:03–10:29 四個例子，10:29–11:50 VC 維度與學習的關係，之後是 Fun Time。）

### 複習：上限函數可以再鬆成 N 的 k−1 次方

課堂上先複習上一堂的主題。generalization 常被翻成「一般化」，課堂上認為更貼切的說法是「舉一反三」：訓練時舉例子，測試時的表現跟訓練時類似。上一堂證明的是，成長函數只要在某個 $k$ 露出「一線曙光」（break point），它就被上限函數 $B(N, k)$ 蓋住（講義第 2 頁）：

$$
m_{\mathcal{H}}(N) \ \le\ B(N, k) = \sum_{i=0}^{k-1}\binom{N}{i}
$$

這個加總的最高次項是 $N^{k-1}$。講義把 $B(N, k)$ 與 $N^{k-1}$ 的表格並排，兩張表合起來是這樣（每格寫成「$B(N,k)$ ／ $N^{k-1}$」）：

| $N$ | $k=1$ | $k=2$ | $k=3$ | $k=4$ | $k=5$ |
|---|---|---|---|---|---|
| 1 | 1 ／ 1 | 2 ／ 1 | 2 ／ 1 | 2 ／ 1 | 2 ／ 1 |
| 2 | 1 ／ 1 | 3 ／ 2 | 4 ／ 4 | 4 ／ 8 | 4 ／ 16 |
| 3 | 1 ／ 1 | 4 ／ 3 | 7 ／ 9 | 8 ／ 27 | 8 ／ 81 |
| 4 | 1 ／ 1 | 5 ／ 4 | 11 ／ 16 | 15 ／ 64 | 16 ／ 256 |
| 5 | 1 ／ 1 | 6 ／ 5 | 16 ／ 25 | 26 ／ 125 | 31 ／ 625 |
| 6 | 1 ／ 1 | 7 ／ 6 | 22 ／ 36 | 42 ／ 216 | 57 ／ 1296 |

講義把 $N \ge 2$、$k \ge 3$ 的那一塊塗了底色。在那一塊裡，右邊的數字都不小於左邊，所以講義寫成「provably & loosely」：

$$
m_{\mathcal{H}}(N) \ \le\ B(N, k) = \sum_{i=0}^{k-1}\binom{N}{i} \ \le\ N^{k-1} \qquad (N \ge 2,\ k \ge 3)
$$

兩個條件不能省。$k = 2$ 那一行是 $N + 1$ 對 $N$，右邊永遠小 1；$N = 1$ 那一列從 $k = 2$ 起是 2 對 1。講義沒有寫第二個不等號的證明。本文用 Python 對 $N = 2$ 到 300、$k = 3$ 到 40 的每一格都算過一次，沒有反例；這是驗算，不是證明。

換成 $N^{k-1}$ 的好處，課堂上說得很實際：以後寫成長函數的上限，不必再帶著 $B$ 或那個加總，一個簡單的多項式就夠。

### 複習：VC bound 與學得起來的三個條件

講義第 3 頁把上一堂的 VC bound 再寫一次。對任何由演算法從資料選出來的 $g = \mathcal{A}(\mathcal{D}) \in \mathcal{H}$：

$$
\begin{aligned}
\mathbb{P}_{\mathcal{D}}\Big[\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| > \epsilon\Big]
&\le \mathbb{P}_{\mathcal{D}}\Big[\exists\, h \in \mathcal{H} \ \text{s.t.}\ \big|E_{\text{in}}(h) - E_{\text{out}}(h)\big| > \epsilon\Big] \\
&\le 4\, m_{\mathcal{H}}(2N)\exp\Big(-\frac{1}{8}\epsilon^2 N\Big) \\
&\le 4\,(2N)^{k-1}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
\end{aligned}
$$

三個不等號各有理由：

1. $g$ 是 $\mathcal{H}$ 裡的某一個假說。$g$ 出事，就表示 $\mathcal{H}$ 裡至少有一個 $h$ 出事，所以第一行的事件包含在第二行的事件裡。課堂上換個方向講：既然大部分時候沒有任何 $h$ 出事，演算法不管怎麼選，都被這個 bound 管住。
2. 第二個不等號是上一堂證明的 VC bound。
3. 第三個不等號把剛才的 $m_{\mathcal{H}}(N) \le N^{k-1}$ 用在 $2N$ 個點上，講義在不等號上方註明「if $k$ exists」。

投影片上，條件原本寫「for $N \ge 2$, $k \ge 3$」，其中 $N \ge 2$ 被劃掉了。課堂上解釋：VC bound 的證明本來就假設 $N$ 夠大，這一條不是新條件；$k \ge 3$ 才是新加的。$k$ 比 3 小的時候只是不能用 $N^{k-1}$ 這個式子，可以改用別的上限；本文補一個現成的選擇：直接用 $B(N, k)$ 本身。

同一頁下半把「學得起來」拆成條件：

| 條件 | 講義的標註 | 得到什麼 |
|---|---|---|
| $m_{\mathcal{H}}(N)$ 在 $k$ 有 break point | good $\mathcal{H}$ | |
| $N$ 夠大 | good $\mathcal{D}$ | 前兩條合起來：大概有泛化，$E_{\text{out}} \approx E_{\text{in}}$ |
| $\mathcal{A}$ 選出 $E_{\text{in}}$ 小的 $g$ | good $\mathcal{A}$ | 三條合起來：大概學到了 |

「大概」兩個字來自 bound 講的是機率。講義在最後一行加了「good luck」，課堂上的說法是：除了好的假說集合、好的資料、好的演算法，還需要一點好運氣。

### 定義：最大的非 break point

講義第 4 頁的標題下寫著「the formal name of maximum non-break point」。課堂上說明，這個正式的名字不是給 break point 本身，而是給它前面那一個點：最小的 break point 是 $k$ 的話，$k - 1$ 就是最大的非 break point。

> **定義。** $\mathcal{H}$ 的 VC 維度，記成 $d_{\text{VC}}(\mathcal{H})$，是讓 $m_{\mathcal{H}}(N) = 2^N$ 成立的最大 $N$。

講義接著給兩個等價的說法：它是 $\mathcal{H}$ 最多能 shatter 幾個輸入；它等於「最小的 $k$」減 1。課堂上補了定義沒寫到的情況：最小的 break point 不存在時，就說 VC 維度是無限大。

由定義直接得到兩句話：

- $N \le d_{\text{VC}}$：$\mathcal{H}$ 能 shatter **某** $N$ 個輸入。
- $k > d_{\text{VC}}$：$k$ 是 $\mathcal{H}$ 的 break point。

第一句的「某」字是這堂課最容易讀錯的地方。課堂上特別強調：資料量不超過 VC 維度，只表示存在某一組那麼多的點可以被 shatter，我們手上那一組不一定是。第二句就沒有「某」：超過 VC 維度之後，任何一組那麼多的點都 shatter 不了。

本文補充第一句為什麼對比 $d_{\text{VC}}$ 小的 $N$ 也成立。如果某 $d_{\text{VC}}$ 個點被 shatter，從裡面任取 $N$ 個點，這 $N$ 個點的每一種標法都可以延伸成 $d_{\text{VC}}$ 個點的某一種標法，而後者做得出來，所以前者也做得出來。

把複習時那條 $m_{\mathcal{H}}(N) \le N^{k-1}$ 裡的 $k - 1$ 換成 $d_{\text{VC}}$，條件 $k \ge 3$ 就變成 $d_{\text{VC}} \ge 2$（講義第 4 頁最下方）：

$$
m_{\mathcal{H}}(N) \ \le\ N^{d_{\text{VC}}} \qquad (N \ge 2,\ d_{\text{VC}} \ge 2)
$$

### 四個老例子的 VC 維度

講義第 5 頁把[基石第 5 堂：訓練與測試](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)的四個假說集合各配上 VC 維度。右邊兩欄是本文把成長函數代進去的結果：

| 假說集合 | $m_{\mathcal{H}}(N)$ | $d_{\text{VC}}$ | 在 $N = d_{\text{VC}}$ | 在 $N = d_{\text{VC}} + 1$ |
|---|---|---|---|---|
| positive rays | $N + 1$ | 1 | $2 = 2^1$ | $3 < 2^2$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ | 2 | $4 = 2^2$ | $7 < 2^3$ |
| convex sets | $2^N$ | $\infty$ | 任何 $N$ 都是 $2^N$ | 沒有 break point |
| 2D perceptrons | $\le N^3$（$N \ge 2$） | 3 | $8 = 2^3$ | 最多 $14 < 2^4$ |

投影片在每一列旁邊畫了被 shatter 的點：positive rays 一個點，positive intervals 兩個點，convex sets 是排在圓周上的一圈點，2D perceptrons 是三個不共線的點。課堂上逐列帶過：positive rays 給一個點，兩種標法都做得出來，兩個點就不行；convex sets 只要把點排在圓上，不管幾個都能 shatter，所以是無限大。

positive rays 這一列順便示範了 $d_{\text{VC}} \ge 2$ 這個條件不能省：它的 $d_{\text{VC}} = 1$，而 $m_{\mathcal{H}}(N) = N + 1 > N^1$。

這一頁的結論只有一行：good: finite $d_{\text{VC}}$。課堂上把上一堂的說法對過來：以前說好的假說集合是露出一線曙光的，現在說好的假說集合是 VC 維度有限的。

### 有限的 VC 維度保證了什麼

講義第 6 頁：$d_{\text{VC}}$ 有限，$g$ 就「會」泛化，$E_{\text{out}}(g) \approx E_{\text{in}}(g)$。而且這件事：

- 跟演算法 $\mathcal{A}$ 無關。課堂上舉的極端情況是：就算用一個很糟的演算法，選出 $E_{\text{in}}$ 很高的 $g$，它的 $E_{\text{out}}$ 還是會跟 $E_{\text{in}}$ 接近，只是這樣對我們沒什麼用。
- 跟輸入的分布 $P$ 無關。我們不必知道資料是從什麼分布來的。
- 跟目標函數 $f$ 無關。所以 $f$ 可以一直維持未知。

投影片把先前加上機率分布之後的學習流程圖再畫一次（$P$ 是[基石第 4 堂：學習可行嗎](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)加進去的）：未知的 $f$ 產生訓練資料 $\mathcal{D}$，未知的 $P$ 同時產生訓練用的 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 與未來測試用的 $\mathbf{x}$，演算法 $\mathcal{A}$ 從假說集合 $\mathcal{H}$ 裡挑出 $g \approx f$。圖上 $f$、$P$、$\mathcal{A}$ 三個位置都被畫成灰色，表示這個保證不依賴它們。右下角的黃框寫的是「worst case」guarantee on generalization：對最壞的情況也成立。這個「什麼都不假設」的好處，到「為什麼鬆了一千倍」那一小節會變成 bound 很鬆的原因。

### Fun Time：一組點不能被 shatter，能推出什麼

**題目（第 7 頁）：** 已知有一組 $N$ 個輸入不能被 $\mathcal{H}$ shatter。只根據這一點，對 $d_{\text{VC}}(\mathcal{H})$ 能下什麼結論？

1. $d_{\text{VC}}(\mathcal{H}) > N$
2. $d_{\text{VC}}(\mathcal{H}) = N$
3. $d_{\text{VC}}(\mathcal{H}) < N$
4. 無法下任何結論

**答案：4。** 講義的解答是：可能有另一組 $N$ 個輸入可以被 shatter，那麼 $d_{\text{VC}} \ge N$；也可能沒有任何一組 $N$ 個輸入可以被 shatter，那麼 $d_{\text{VC}} < N$。單靠一組 shatter 不了的點，兩種情況都排除不掉。

本文各舉一個實例。$\mathcal{H}$ 是 2D perceptrons、$N = 3$：三個排在同一條直線上的點不能被 shatter（中間標 ×、兩邊標 ○ 的那種做不出來），但另外找三個不共線的點就可以，$d_{\text{VC}} = 3 \ge N$。$\mathcal{H}$ 是 positive rays、$N = 2$：任何兩個點都 shatter 不了，$d_{\text{VC}} = 1 < N$。兩個例子的已知條件一模一樣，結論相反，所以選項 1、2、3 都不能選。

課堂上的總結是，定義裡「存在一組」和「對所有組」是不同的話，進下一段課程之前要先分清楚。接下來感知器的兩段證明正好各用一種。

## d 維感知器的 VC 維度為什麼是 d+1

```youtube
url: https://www.youtube.com/watch?v=WQzhc1IdB_I
title: The VC Dimension :: VC Dimension of Perceptrons @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:49 回顧二維的 PLA，01:49–03:19 猜 $d+1$，03:19–07:10 證「大於等於」，07:10–10:24 用四個點的特例看「小於等於」，10:24–13:01 一般情況，之後是 Fun Time。）

### 回到 PLA：二維的故事已經說完了

講義第 8 頁把[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 PLA 放回來，畫成兩條線匯在一起：

| | 左邊那條線 | 右邊那條線 |
|---|---|---|
| 前提 | $\mathcal{D}$ 線性可分 | $\mathbf{x}_n \sim P$，$y_n = f(\mathbf{x}_n)$ |
| 依據 | PLA 會收斂 | $\mathbb{P}[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon] \le \dots$，因為 $d_{\text{VC}} = 3$ |
| 需要 | 修正次數 $T$ 夠大 | 資料量 $N$ 夠大 |
| 得到 | $E_{\text{in}}(g) = 0$ | $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ |

兩個結果合起來才是 $E_{\text{out}}(g) \approx 0$。課堂上稱這是兩條軸線的故事兜在一起，才能說學到東西了。

這張圖只對二維成立，因為 $d_{\text{VC}} = 3$ 是二維感知器的數字。PLA 可以用在任何維度的資料上，所以投影片最下面問：特徵超過兩個的時候呢？要回答就得知道 $d$ 維感知器的 VC 維度。

### 從一維與二維猜出 d+1

第 9 頁列出已知的兩個例子：

- 一維感知器就是 positive rays 加上 negative rays，$d_{\text{VC}} = 2$。投影片只寫了這個數字；本文補上算法：它的成長函數是 $2N$（基石第 5 堂的 Fun Time 算過），$N = 2$ 時 $4 = 2^2$，$N = 3$ 時 $6 < 2^3$。
- 二維感知器 $d_{\text{VC}} = 3$。投影片畫了兩張小圖：三個不共線的點（可以 shatter，所以 $d_{\text{VC}} \ge 3$），以及四個點排成菱形、上下標 ○、左右標 × 的那一種標法（做不出來，用來說明 $d_{\text{VC}} \le 3$）。

課堂上對第二張圖多說了一句：四個點那邊他只畫了一組不能 shatter 的例子，但實際上要所有四個點的組合都不能 shatter 才算數。

一維是 2、二維是 3，於是猜 $d$ 維是 $d + 1$；投影片在等號上打了一個問號。課堂上自己吐槽：從兩個例子就做學習，不是聰明的做法，所以這只能算猜想。要把問號拿掉，需要兩個方向：

$$
d_{\text{VC}} \ge d + 1 \qquad \text{以及} \qquad d_{\text{VC}} \le d + 1
$$

### Extra Fun Time：要證「至少 d+1」，該證哪一句

**題目（第 10 頁）：** 下面哪一句話能說明 $d_{\text{VC}} \ge d + 1$？

1. 有某 $d + 1$ 個輸入可以被 shatter。
2. 任何 $d + 1$ 個輸入都可以被 shatter。
3. 有某 $d + 2$ 個輸入不能被 shatter。
4. 任何 $d + 2$ 個輸入都不能被 shatter。

**答案：1。** 講義的解釋：$d_{\text{VC}}$ 是讓 $m_{\mathcal{H}}(N) = 2^N$ 成立的最大 $N$，而 $m_{\mathcal{H}}(N)$ 是 $N$ 個輸入上最多能產生幾種 dichotomy。只要在某 $d + 1$ 個輸入上找到 $2^{d+1}$ 種，$m_{\mathcal{H}}(d+1) = 2^{d+1}$，所以 $d_{\text{VC}} \ge d + 1$。

其他選項：選項 2 如果成立當然也夠，但它要求得太多，而且對感知器根本不成立（共線的三個點就是二維的反例）。選項 3 就是上一題 Fun Time 的情況，推不出任何結論。選項 4 說的是 $d + 2$ 是 break point，給的是上界 $d_{\text{VC}} \le d + 1$，方向相反。

### 證「至少 d+1」：找一組特別的點，解一個聯立方程

第 11 頁挑了 $d + 1$ 個「trivial」的輸入：原點，加上每個座標軸上各一個點。記得感知器會在每個 $\mathbf{x}$ 前面補上常數座標 $x_0 = 1$，所以把這些點一列一列排成矩陣是

$$
\mathrm{X} = \begin{bmatrix} \text{—}\ \mathbf{x}_1^\top\ \text{—} \\ \text{—}\ \mathbf{x}_2^\top\ \text{—} \\ \text{—}\ \mathbf{x}_3^\top\ \text{—} \\ \vdots \\ \text{—}\ \mathbf{x}_{d+1}^\top\ \text{—} \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & \cdots & 0 \\ 1 & 1 & 0 & \cdots & 0 \\ 1 & 0 & 1 & & 0 \\ \vdots & \vdots & & \ddots & 0 \\ 1 & 0 & \cdots & 0 & 1 \end{bmatrix}
$$

投影片把最左邊那一行的 1 塗成灰色，課堂上說明那就是偷偷塞進去、代表門檻值的第 0 維。二維的時候，這三個點是 $(0,0)$、$(1,0)$、$(0,1)$。講義在頁尾用黃框標出關鍵：$\mathrm{X}$ 是可逆的（invertible）。本文補一句理由：這是一個對角線全是 1 的下三角矩陣，行列式是 1。

第 12 頁說明可逆有什麼用。shatter 的意思是：對任何一組標籤 $\mathbf{y} = (y_1, \dots, y_{d+1})$，每個 $y_n$ 是 $+1$ 或 $-1$，都找得到 $\mathbf{w}$ 讓

$$
\text{sign}(\mathrm{X}\mathbf{w}) = \mathbf{y}
$$

sign 不好處理，所以改要求一件更強的事：$\mathrm{X}\mathbf{w}$ 不取正負號就直接等於 $\mathbf{y}$。$\mathbf{y}$ 的分量本來就是 $\pm 1$，取了正負號還是自己，所以

$$
\text{sign}(\mathrm{X}\mathbf{w}) = \mathbf{y} \ \Longleftarrow\ \mathrm{X}\mathbf{w} = \mathbf{y} \ \Longleftrightarrow\ \mathbf{w} = \mathrm{X}^{-1}\mathbf{y}
$$

箭頭的方向要看清楚：左邊是單向的，$\mathrm{X}\mathbf{w} = \mathbf{y}$ 是充分條件，不是必要條件；右邊的雙向箭頭靠的是 $\mathrm{X}$ 可逆。$\mathrm{X}\mathbf{w} = \mathbf{y}$ 是 $d + 1$ 個未知數、$d + 1$ 條方程式的聯立方程，可逆保證它有解。課堂上的收尾是：$2^{d+1}$ 組 $\mathbf{y}$ 都可以如法炮製，每一組找到自己的 $\mathbf{w}$，所以這組特別的點被 shatter 了，$d_{\text{VC}} \ge d + 1$。

本文把 $\mathbf{w} = \mathrm{X}^{-1}\mathbf{y}$ 直接解出來。第一條方程式（原點）是 $w_0 = y_1$；第 $i + 1$ 條方程式（第 $i$ 軸上的點）是 $w_0 + w_i = y_{i+1}$。所以

$$
w_0 = y_1, \qquad w_i = y_{i+1} - y_1 \quad (i = 1, \dots, d)
$$

**數值例子（$d = 2$，本文用上面的公式算，不在講義上）。** 三個點是 $\mathbf{x}_1 = (0,0)$、$\mathbf{x}_2 = (1,0)$、$\mathbf{x}_3 = (0,1)$，八種標法各自的 $\mathbf{w} = (w_0, w_1, w_2)$：

| $(y_1, y_2, y_3)$ | $\mathbf{w} = (y_1,\ y_2 - y_1,\ y_3 - y_1)$ | $\mathrm{X}\mathbf{w} = (w_0,\ w_0 + w_1,\ w_0 + w_2)$ |
|---|---|---|
| $(+1, +1, +1)$ | $(1, 0, 0)$ | $(1, 1, 1)$ |
| $(+1, +1, -1)$ | $(1, 0, -2)$ | $(1, 1, -1)$ |
| $(+1, -1, +1)$ | $(1, -2, 0)$ | $(1, -1, 1)$ |
| $(+1, -1, -1)$ | $(1, -2, -2)$ | $(1, -1, -1)$ |
| $(-1, +1, +1)$ | $(-1, 2, 2)$ | $(-1, 1, 1)$ |
| $(-1, +1, -1)$ | $(-1, 2, 0)$ | $(-1, 1, -1)$ |
| $(-1, -1, +1)$ | $(-1, 0, 2)$ | $(-1, -1, 1)$ |
| $(-1, -1, -1)$ | $(-1, 0, 0)$ | $(-1, -1, -1)$ |

最右欄每一列都等於最左欄，八種 dichotomy 全部做得出來。以第二列為例，$\mathbf{w} = (1, 0, -2)$ 對應的直線是 $1 - 2x_2 = 0$，也就是水平線 $x_2 = \frac{1}{2}$：原點與 $(1,0)$ 在線的下方，得到 $+1$；$(0,1)$ 在上方，得到 $-1$。同一條公式本文也在 $d = 5$ 的 64 種標法上用程式逐一檢查過，全部成立。

這個結果代表：證明「至少」的時候，點是我們自己挑的，可以挑到讓聯立方程最好解的位置。

### Extra Fun Time：要證「至多 d+1」，該證哪一句

**題目（第 13 頁）：** 同樣四個選項，哪一句話能說明 $d_{\text{VC}} \le d + 1$？

**答案：4。** 講義的解釋：如果在**任何** $d + 2$ 個輸入上都找不到 $2^{d+2}$ 種 dichotomy（也就是 $d + 2$ 是 break point），$m_{\mathcal{H}}(d+2) < 2^{d+2}$，所以 $d_{\text{VC}} < d + 2$，即 $d_{\text{VC}} \le d + 1$。

選項 3 只找到一組不能 shatter 的 $d + 2$ 個點，別組可能可以，推不出上界。選項 1 與 2 講的是 $d + 1$ 個點，給的是下界。

兩題合起來是整節的骨架：下界只要舉一個例子，上界要對所有可能的資料都成立。課堂上承認後者比較難，所以先從一個特例看起。

### 證「至多 d+1」：二維的特例

第 14 頁在剛才的三個點之外加上第四個點 $(1,1)$，四個點排成正方形：

$$
\mathrm{X} = \begin{bmatrix} \text{—}\ \mathbf{x}_1^\top\ \text{—} \\ \text{—}\ \mathbf{x}_2^\top\ \text{—} \\ \text{—}\ \mathbf{x}_3^\top\ \text{—} \\ \text{—}\ \mathbf{x}_4^\top\ \text{—} \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 1 & 1 & 0 \\ 1 & 0 & 1 \\ 1 & 1 & 1 \end{bmatrix}
$$

投影片上的圖是：左下的 $\mathbf{x}_1$ 標 ×，右下的 $\mathbf{x}_2$ 與左上的 $\mathbf{x}_3$ 標 ○，右上的 $\mathbf{x}_4$ 打問號，旁邊註明問號不能是 ×。這就是[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)看過的、對角各一種標籤的那種做不出來的標法，當時只靠畫圖說服自己，現在有代數的理由。

四個橫列之間有一個關係，直接看矩陣就能驗證：$(1,1,1) = (1,1,0) + (1,0,1) - (1,0,0)$，也就是

$$
\mathbf{x}_4 = \mathbf{x}_2 + \mathbf{x}_3 - \mathbf{x}_1
$$

等式兩邊同時跟任何一個 $\mathbf{w}$ 做內積，等號照樣成立：

$$
\mathbf{w}^\top\mathbf{x}_4 = \underbrace{\mathbf{w}^\top\mathbf{x}_2}_{\circ:\ >0} + \underbrace{\mathbf{w}^\top\mathbf{x}_3}_{\circ:\ >0} - \underbrace{\mathbf{w}^\top\mathbf{x}_1}_{\times:\ <0} \ >\ 0
$$

如果某個 $\mathbf{w}$ 把 $\mathbf{x}_2$、$\mathbf{x}_3$ 標成 ○，把 $\mathbf{x}_1$ 標成 ×，那前兩項是正的，第三項是負的但前面有減號，三項加起來一定是正的。課堂上特別提醒別漏看那個減號。結論是 $\mathbf{x}_4$ 被迫是 ○，$(\times, \circ, \circ, \times)$ 這種 dichotomy 產生不了。

講義把這一頁收成一句：linear dependence restricts dichotomy，線性相依限制了能產生的 dichotomy。

### 證「至多 d+1」：一般情況

第 15 頁把同一個論證搬到任意的 $d + 2$ 個點上。把它們排成矩陣 $\mathrm{X}$，橫列有 $d + 2$ 個，直行只有 $d + 1$ 個（$x_0$ 加上 $d$ 個特徵）。講義寫「more rows than columns」：$d + 2$ 個 $d + 1$ 維的向量一定線性相依，所以

$$
\mathbf{x}_{d+2} = a_1\mathbf{x}_1 + a_2\mathbf{x}_2 + \dots + a_{d+1}\mathbf{x}_{d+1}, \qquad \text{某些 } a_i \ne 0
$$

課堂上說這些係數有正、有負、也可能是 0，但不會全部是 0。

接著用反證法。假設這 $d + 2$ 個點可以被 shatter，那就一定有某個 $\mathbf{w}$ 產生下面這種 dichotomy：前 $d + 1$ 個點的標籤跟係數的正負號一致（$a_i > 0$ 的點標 ○，$a_i < 0$ 的點標 ×），最後一個點標 ×。講義寫成 $(\text{sign}(a_1), \text{sign}(a_2), \dots, \text{sign}(a_{d+1}), \times)$。對這個 $\mathbf{w}$：

$$
\mathbf{w}^\top\mathbf{x}_{d+2} = a_1\mathbf{w}^\top\mathbf{x}_1 + a_2\mathbf{w}^\top\mathbf{x}_2 + \dots + a_{d+1}\mathbf{w}^\top\mathbf{x}_{d+1} \ >\ 0
$$

每一項 $a_i\mathbf{w}^\top\mathbf{x}_i$ 都是兩個同號的數相乘：正乘正，或負乘負，所以每一項都是正的，總和大於 0。$\mathbf{x}_{d+2}$ 被迫是 ○，跟「最後一個點標 ×」矛盾。所以這種 dichotomy 產生不了，這 $d + 2$ 個點不能被 shatter。這 $d + 2$ 個點是任意取的，沒有用到它們的任何特殊性質，所以任何 $d + 2$ 個點都不能被 shatter，$d_{\text{VC}} \le d + 1$。

兩個方向合起來，$d$ 維感知器的 $d_{\text{VC}} = d + 1$。

講義這一頁有兩個細節沒寫，本文補上：

- **$a_i = 0$ 的點怎麼標。** $\text{sign}(0)$ 沒有定義。這些點在加總裡的那一項是 0，標成 ○ 或 × 都不影響論證，隨便挑一種就好。因為至少有一個 $a_i \ne 0$，總和裡至少有一項嚴格大於 0，結論不變。
- **為什麼一定是最後一個點被別人表示。** 線性相依保證的是「有一組不全為 0 的係數讓 $d + 2$ 個向量的組合等於零向量」，被別人表示的那個向量不一定排在最後。把係數不為 0 的任何一個向量移到等號另一邊、重新編號成第 $d + 2$ 個就可以了；自我檢查第 2 題就是需要重新編號的例子。

### 數值例子：兩組不是正方形的四個點

以下兩組點是本文自擬的，不在講義上，用來示範一般情況的論證怎麼套到具體的點上。兩組都是二維（$d = 2$），所以是四個點。

**第一組：第四個點在另外三個點圍成的三角形裡面。** $\mathbf{x}_1 = (0,0)$、$\mathbf{x}_2 = (4,0)$、$\mathbf{x}_3 = (0,4)$、$\mathbf{x}_4 = (1,1)$。補上 $x_0 = 1$ 之後解 $\mathbf{x}_4 = a_1\mathbf{x}_1 + a_2\mathbf{x}_2 + a_3\mathbf{x}_3$，三個座標各一條方程式：

$$
a_1 + a_2 + a_3 = 1, \qquad 4a_2 = 1, \qquad 4a_3 = 1
$$

解得 $a_2 = a_3 = \frac{1}{4}$、$a_1 = \frac{1}{2}$。三個係數都是正的，所以做不出來的是 $(\circ, \circ, \circ, \times)$：三個頂點都標 ○ 時，$\mathbf{w}^\top\mathbf{x}_4 = \frac{1}{2}\mathbf{w}^\top\mathbf{x}_1 + \frac{1}{4}\mathbf{w}^\top\mathbf{x}_2 + \frac{1}{4}\mathbf{w}^\top\mathbf{x}_3 > 0$，裡面那個點只能是 ○。

**第二組：四個點都在外圍。** $\mathbf{x}_1 = (0,0)$、$\mathbf{x}_2 = (2,0)$、$\mathbf{x}_3 = (0,2)$、$\mathbf{x}_4 = (3,3)$。方程式是

$$
a_1 + a_2 + a_3 = 1, \qquad 2a_2 = 3, \qquad 2a_3 = 3
$$

解得 $a_2 = a_3 = \frac{3}{2}$、$a_1 = -2$。係數的正負號是 $(-, +, +)$，所以做不出來的是 $(\times, \circ, \circ, \times)$，跟講義正方形的那一種同型。

第一條方程式 $a_1 + a_2 + a_3 = 1$ 來自 $x_0 = 1$ 那個座標，它是兩組例子長得不一樣的原因：係數總和固定是 1，點在三角形裡面時三個係數都是正的，在外面時至少有一個是負的。

**驗算。** 本文對這兩組點各用程式掃過整數格子上所有的 $\mathbf{w}$（每個分量從 $-12$ 到 $12$），把出現過的 dichotomy 收集起來，兩組都剛好是 14 種。缺的兩種，第一組是 $(\circ, \circ, \circ, \times)$ 與 $(\times, \times, \times, \circ)$，第二組是 $(\times, \circ, \circ, \times)$ 與 $(\circ, \times, \times, \circ)$。每組的第二種是第一種整個反過來，理由是把 $\mathbf{w}$ 換成 $-\mathbf{w}$ 會讓每個點的標籤都翻面，所以一種做不出來，反過來的那種也做不出來。

**這個結果代表什麼。** 不管四個點怎麼擺，線性相依的係數都會指出一種做不出來的標法。14 也是二維感知器在四個點上最多能產生的 dichotomy 數，比上一堂的上限 $B(4, 4) = 15$ 少 1，更比 $N^{d_{\text{VC}}} = 4^3 = 64$ 小得多。這個差距到「為什麼鬆了一千倍」那一小節會再出現。

### Fun Time：1126 維的感知器

**題目（第 16 頁）：** 根據上面的證明，1126 維感知器的 $d_{\text{VC}}$ 是多少？

1. $1024$
2. $1126$
3. $1127$
4. $6211$

**答案：3。** $d = 1126$，$d_{\text{VC}} = d + 1 = 1127$。講義的解答只寫了一句玩笑話：這一節的 Fun Time 太多了。課堂上也說，前面練習給得太多，所以這裡出一題超簡單的。選項 2 是忘了算 $w_0$ 那一維；多出來的 1 就是門檻值。

## VC 維度量的是什麼：有效的自由度

```youtube
url: https://www.youtube.com/watch?v=5-V5WCf8cY8
title: The VC Dimension :: Physical Intuition of VC Dimension @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:53 自由度，01:53–02:45 兩個老朋友，02:45–05:15 $M$ 與 $d_{\text{VC}}$ 的對照，之後是 Fun Time。）

### 旋鈕的比喻

這一節先回答一個名稱上的問題：為什麼叫「維度」。課堂上的回答是，$d + 1$ 就是感知器 $\mathbf{w}$ 的維度，VC 維度因此跟感知器的維度扯上了關係。

講義第 17 頁畫了十個旋鈕（圖下註明改自 Hugues Vermeiren 在 texample.net 上的作品），用它對照三種量假說集合的方法：

| 量什麼 | 講義的說法 | 意思 |
|---|---|---|
| 假說的參數 $\mathbf{w} = (w_0, w_1, \dots, w_d)$ | creates degrees of freedom | 每個參數是一個可以調的旋鈕 |
| 假說的數量 $M = \lvert\mathcal{H}\rvert$ | 「analog」degrees of freedom | 把旋鈕當成類比的，每一個都有無限多種位置 |
| 假說的「力量」$d_{\text{VC}} = d + 1$ | effective「binary」degrees of freedom | 做二元分類時，真正有效的自由度有幾個 |

課堂上對「effective」的解釋是：如果某個旋鈕根本沒有作用，它就不會被算進有效的自由度裡。對「binary」的解釋是：我們做的是二元分類，量的是在這件事上的自由度，而衡量的方式就是能產生多少 dichotomy、最多還能 shatter 幾個點。投影片的黃框把它收成一句：$d_{\text{VC}}(\mathcal{H})$ 是 $\mathcal{H}$ 的 powerfulness。

### 兩個老朋友，以及「不總是如此」

第 18 頁回頭看兩個一維的假說集合：

- **positive rays**（$d_{\text{VC}} = 1$）：門檻 $a$ 的左邊是 $-1$、右邊是 $+1$。自由參數只有 $a$ 一個。
- **positive intervals**（$d_{\text{VC}} = 2$）：區間裡面是 $+1$、外面是 $-1$。自由參數是左端點 $\ell$ 與右端點 $r$ 兩個。

加上感知器的 $d + 1$ 個參數對 $d_{\text{VC}} = d + 1$，講義給出一條實用的經驗法則：

$$
d_{\text{VC}} \approx \#\text{free parameters} \quad \text{(but not always)}
$$

課堂上的說法是：這件事大致上對，但不總是對；實務上想估計 VC 維度大概多少，數一數有幾個可以調的旋鈕通常是個好辦法。

講義沒有舉「not always」的例子，以下兩個是本文補充的，不在講義上：

- **參數比有效自由度多。** 把 positive rays 的門檻寫成 $h(x) = \text{sign}(x - (a + b))$，參數有 $a$、$b$ 兩個，但它們只透過 $a + b$ 起作用，能產生的假說跟原本一模一樣，$d_{\text{VC}}$ 還是 1。這就是課堂上說的沒有作用的旋鈕。
- **一個參數，VC 維度卻是無限大。** $h(x) = \text{sign}(\sin(\alpha x))$ 只有一個參數 $\alpha$。取 $N$ 個點 $x_i = 10^{-i}$，對任何標籤令 $\alpha = \pi\big(1 + \sum_{i:\,y_i = -1} 10^i\big)$，就能把這 $N$ 個點標成想要的樣子，$N$ 多大都可以。以 $N = 3$、$\mathbf{y} = (+1, -1, +1)$ 為例，$\alpha = 101\pi$，三個點的 $\sin(\alpha x_i)$ 是 $\sin(10.1\pi) \approx 0.309$、$\sin(1.01\pi) \approx -0.031$、$\sin(0.101\pi) \approx 0.312$，正負號正好是 $(+, -, +)$。本文用程式把 $N = 4$ 的 16 種標法都檢查過，全部做得出來。

所以數參數只是估計，要確定還是得回到定義，一個點、兩個點、三個點地試。

### M 與 VC 維度：同一個取捨換了量尺

第 19 頁把[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)的一張表原封不動搬回來（投影片上寫著 copied from Lecture 5）。學習要同時回答兩個問題：

1. 能不能確保 $E_{\text{out}}(g)$ 跟 $E_{\text{in}}(g)$ 夠接近？
2. 能不能讓 $E_{\text{in}}(g)$ 夠小？

| | 問題 1：$E_{\text{out}} \approx E_{\text{in}}$？ | 問題 2：$E_{\text{in}}$ 夠小？ |
|---|---|---|
| $M$ 小 | Yes，$\mathbb{P}[\text{BAD}] \le 2 \cdot M \cdot \exp(\dots)$ 小 | No，選擇太少 |
| $M$ 大 | No，同一個式子變大 | Yes，選擇很多 |
| $d_{\text{VC}}$ 小 | Yes，$\mathbb{P}[\text{BAD}] \le 4 \cdot (2N)^{d_{\text{VC}}} \cdot \exp(\dots)$ 小 | No，力量太有限 |
| $d_{\text{VC}}$ 大 | No，同一個式子變大 | Yes，力量很大 |

上兩列是第 5 堂的版本，下兩列是把 $M$ 換成 $d_{\text{VC}}$ 之後的版本。課堂上指出，$(2N)^{d_{\text{VC}}}$ 現在扮演的就是以前 $M$ 的角色。差別在於 $M$ 對感知器這種有無限多條線的假說集合是無限大，那張表用不上；$d_{\text{VC}}$ 是有限的數字，同一個取捨總算可以拿來算。

投影片的結論是 using the right $d_{\text{VC}}$ (or $\mathcal{H}$) is important。課堂上預告，以後會用 VC 維度或類似的資訊，來決定手上有這些資料時該選哪一種假說集合。怎麼選，「模型複雜度：假說集合不是愈強愈好」那一小節會看到第一個版本。

### Fun Time：過原點的超平面

**題目（第 20 頁）：** 過原點的超平面（origin-crossing hyperplanes）本質上就是把 $w_0$ 固定成 0 的感知器。猜猜看，$\mathbb{R}^d$ 裡過原點的超平面，$d_{\text{VC}}$ 是多少？

1. $1$
2. $d$
3. $d + 1$
4. $\infty$

**答案：2。** 講義的解答說，證明跟一般感知器的幾乎一樣，但這題要你用的是直覺：$d_{\text{VC}} \approx$ 自由參數的個數。課堂上講得更白：本來有 $d + 1$ 個參數，其中 $w_0$ 被固定住、不能動了，所以實際上只剩 $d$ 個旋鈕。

本文把「幾乎一樣的證明」補上，確認這次直覺是對的。沒有 $x_0$ 之後，每個點就是 $d$ 維的向量。

- **至少 $d$：** 取 $d$ 個座標軸上的單位向量，排成的矩陣是 $d \times d$ 的單位矩陣，當然可逆。對任何 $\mathbf{y}$ 取 $\mathbf{w} = \mathbf{y}$ 就有 $\mathrm{X}\mathbf{w} = \mathbf{y}$。
- **至多 $d$：** 任何 $d + 1$ 個 $d$ 維向量一定線性相依，同樣的反證法照用。

二維的例子：$(1,0)$ 與 $(0,1)$ 兩個點可以被 shatter；再加上 $(1,1)$，因為 $(1,1) = (1,0) + (0,1)$，前兩個點都標 ○ 時第三個點被迫是 ○，$(\circ, \circ, \times)$ 做不出來。本文用程式掃過整數格子上的 $\mathbf{w}$，這三個點只出現 6 種 dichotomy，缺的正是 $(\circ, \circ, \times)$ 與它整個反過來的那一種。

選項 3 是沒把被固定的 $w_0$ 扣掉。選項 1 把「少一個自由度」誤讀成「只剩一個」。選項 4 不可能，因為這個假說集合是一般感知器的子集合，能產生的 dichotomy 只會更少，VC 維度不會超過 $d + 1$。

## 把 VC bound 讀成模型複雜度與樣本複雜度

```youtube
url: https://www.youtube.com/watch?v=_DN_oF-i6ag
title: The VC Dimension :: Interpreting VC Dimension @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–04:14 改寫 VC bound，04:14–07:26 模型複雜度，07:26–10:30 樣本複雜度，10:30–14:57 bound 為什麼鬆，14:57–15:37 是 Fun Time，之後是整堂的總結。）

### 從「壞事的機率」改寫成「好事發生時差多少」

把 $k - 1$ 換成 $d_{\text{VC}}$，VC bound 是（講義第 21 頁；條件同樣是 $N \ge 2$ 被劃掉、留下 $d_{\text{VC}} \ge 2$）：

$$
\mathbb{P}_{\mathcal{D}}\Big[\underbrace{\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| > \epsilon}_{\text{BAD}}\Big] \ \le\ \underbrace{4\,(2N)^{d_{\text{VC}}}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)}_{\delta}
$$

這個式子是先給 $\epsilon$，再告訴你壞事的機率上限。課堂上換一個角度：壞事的機率很小，等於好事的機率很大。把右邊叫做 $\delta$，那麼至少有 $1 - \delta$ 的機率發生好事，也就是 $\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert \le \epsilon$。現在反過來問：先決定願意承擔的 $\delta$，對應的 $\epsilon$ 是多少？講義分四步解出來。

**第一步：** 令右邊等於 $\delta$。

$$
\delta = 4\,(2N)^{d_{\text{VC}}}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

**第二步：** 兩邊同除以 $4(2N)^{d_{\text{VC}}}$，把指數那一項單獨留下。

$$
\frac{\delta}{4\,(2N)^{d_{\text{VC}}}} = \exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

**第三步：** 兩邊取自然對數，得到 $\ln\frac{\delta}{4(2N)^{d_{\text{VC}}}} = -\frac{1}{8}\epsilon^2 N$。兩邊再乘上 $-1$；對數裡的分數上下顛倒，正好吸收掉那個負號。

$$
\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big) = \frac{1}{8}\epsilon^2 N
$$

**第四步：** 兩邊乘上 $\frac{8}{N}$ 再開根號。$\epsilon$ 是正的，取正根。

$$
\epsilon = \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}
$$

所以至少有 $1 - \delta$ 的機率：

$$
\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| \ \le\ \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}
$$

左邊這個差距，講義標成 gen. error（generalization error），課堂上說它量的是舉一反三做得多好。絕對值的不等式拆開就是兩邊的界：

$$
E_{\text{in}}(g) - \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)} \ \le\ E_{\text{out}}(g) \ \le\ E_{\text{in}}(g) + \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}
$$

課堂上說這很像統計裡的信賴區間。投影片把左半邊塗成灰色，理由是我們通常不太在意 $E_{\text{out}}$ 最好能有多好，比較在意它最壞會有多壞；課堂上舉的例子是，把 $g$ 拿去股市投資的時候，你會想知道在自己設定的 $\delta$ 之下，最糟的情況有多糟。

根號那一項，講義叫它 penalty for model complexity，記成 $\Omega(N, \mathcal{H}, \delta)$。課堂上說明，這裡的 model 指的就是假說集合：假說集合愈強，泛化時要付出的代價就愈多。它由三樣東西決定：資料量 $N$、假說集合 $\mathcal{H}$（透過 $d_{\text{VC}}$）、以及 $\delta$。課堂上對 $\delta$ 的口語說法是「你覺得你有多幸運」。

### 模型複雜度：假說集合不是愈強愈好

講義第 22 頁的標題是 THE VC Message。以很高的機率：

$$
E_{\text{out}}(g) \ \le\ E_{\text{in}}(g) + \underbrace{\sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}}_{\Omega(N,\ \mathcal{H},\ \delta)}
$$

投影片上有一張圖：橫軸是 VC 維度，縱軸是 error，三條曲線。

| 曲線 | 隨 $d_{\text{VC}}$ 變大 | 原因 |
|---|---|---|
| in-sample error（$E_{\text{in}}$） | 一路下降 | 能 shatter 的點變多，可以選的排列組合變多 |
| model complexity（$\Omega$） | 一路上升 | $d_{\text{VC}}$ 在根號裡的對數裡當次方 |
| out-of-sample error（$E_{\text{out}}$） | 先降後升 | 前兩條相加 |

講義把它寫成三行：$d_{\text{VC}}$ 變大，$E_{\text{in}}$ 下降但 $\Omega$ 上升；$d_{\text{VC}}$ 變小，$\Omega$ 下降但 $E_{\text{in}}$ 上升；最好的 $d^*_{\text{VC}}$ 在中間。圖上用一條虛線標出 $E_{\text{out}}$ 最低的位置。

$E_{\text{in}}$ 為什麼會下降，課堂上的解釋是：資料固定在那裡，VC 維度變大時能 shatter 的點變多，排列組合比較多種，一個合理的演算法就比較有機會找到 $E_{\text{in}}$ 更小的假說。

這張圖要傳達的事，課堂上是對著剛開始用機器學習的人說的：初學者常常只想把 $E_{\text{in}}$ 做到最低，那可能意味著要用 VC 維度更高、更強的假說集合，但從圖上看這不見得是最好的選擇，因為要付出很大的模型複雜度代價。投影片最下方的結論是 powerful $\mathcal{H}$ not always good。課堂上還預告，以後會常常看到這種形狀的圖，橫軸不一定是 VC 維度，可能是某個跟它有關的量；它會在[基石第 13 堂：過擬合](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)再出現。

**數值例子：把 Ω 代進一個具體情境。** 以下是本文自擬的例子，不在講義上；$\Omega$ 的數字是照公式算的，$E_{\text{in}}$ 的數字是為了說明而假設的。

沿用這門課的信用卡核卡情境。銀行有 $N = 10{,}000$ 筆歷史紀錄，要用感知器決定核不核卡，容許的失敗機率取 $\delta = 0.1$。有三種做法：只用 3 個特徵、用 10 個、用 50 個。$d$ 個特徵的感知器 $d_{\text{VC}} = d + 1$。先算 $\Omega$，以 3 個特徵為例：

$$
\Omega = \sqrt{\frac{8}{10{,}000}\ln\Big(\frac{4 \times 20{,}000^{4}}{0.1}\Big)} = \sqrt{0.0008 \times 43.30} \approx 0.186
$$

其中 $\ln(4 \times 20{,}000^4 / 0.1) = \ln 40 + 4\ln 20{,}000 \approx 3.69 + 39.61 = 43.30$。三種做法：

| 特徵數 $d$ | $d_{\text{VC}}$ | $\Omega$（算出來的） | $E_{\text{in}}$（假設的） | $E_{\text{in}} + \Omega$ |
|---|---|---|---|---|
| 3 | 4 | 0.186 | 0.20 | 0.386 |
| 10 | 11 | 0.300 | 0.08 | 0.380 |
| 50 | 51 | 0.638 | 0.05 | 0.688 |

從 3 個特徵加到 10 個，假設 $E_{\text{in}}$ 降了 0.12，$\Omega$ 只多了 0.114，保證的上限略有改善。從 10 個加到 50 個，$E_{\text{in}}$ 只再降 0.03，$\Omega$ 卻多了 0.338，上限從 0.380 變成 0.688，反而差很多。這就是圖上先降後升的那條曲線，最好的位置在中間。

這個結果代表什麼，要分兩層讀。第一層：能直接照公式算的只有 $\Omega$，而且它只跟 $N$、$d_{\text{VC}}$、$\delta$ 有關，還沒看資料就能算；$E_{\text{in}}$ 要實際訓練才知道。第二層：表裡的 0.38 是「錯誤率不超過 38%」的保證，以核卡來說實在不算好的保證，但實際的 $E_{\text{out}}$ 通常遠比它低。這個落差就是接下來兩個小節的主題。

### 樣本複雜度：照 bound 算要多少筆資料

VC bound 的第二種讀法是樣本複雜度（sample complexity，講義第 23 頁）。課堂上用老闆開規格來講：

- 希望 $E_{\text{in}}$ 跟 $E_{\text{out}}$ 最多差 $\epsilon = 0.1$。
- 希望壞事發生的機率最多 $\delta = 0.1$，也就是九成的時候相信好事會發生。
- 給你的模型 $d_{\text{VC}} = 3$，例如二維的感知器。

問：要多少筆資料才夠？做法就是把 $N$ 代進 $4(2N)^{d_{\text{VC}}}\exp(-\frac{1}{8}\epsilon^2 N)$，看什麼時候它不超過 $\delta$。講義列了五個 $N$，下表的前兩欄是本文把 bound 拆成兩個因子重算的結果：

| $N$ | $4(2N)^3$ | $\exp(-\frac{1}{8} \times 0.01 \times N)$ | bound（講義的數字） |
|---|---|---|---|
| 100 | $3.2 \times 10^{7}$ | $e^{-0.125} \approx 0.882$ | $2.82 \times 10^{7}$ |
| 1,000 | $3.2 \times 10^{10}$ | $e^{-1.25} \approx 0.287$ | $9.17 \times 10^{9}$ |
| 10,000 | $3.2 \times 10^{13}$ | $e^{-12.5} \approx 3.73 \times 10^{-6}$ | $1.19 \times 10^{8}$ |
| 100,000 | $3.2 \times 10^{16}$ | $e^{-125} \approx 5.17 \times 10^{-55}$ | $1.65 \times 10^{-38}$ |
| 29,300 | $8.05 \times 10^{14}$ | $e^{-36.625} \approx 1.24 \times 10^{-16}$ | $9.99 \times 10^{-2}$ |

兩個因子相乘都對得上講義的數字。課堂上一列一列演給學生看：100 筆時 bound 是 $2.82 \times 10^7$，一個機率小於等於兩千多萬，這跟有寫跟沒寫一樣，因為機率本來就不會超過 1。換成 1,000 筆，結果更糟。到 10,000 筆才開始好一點，課堂上說那是指數下降的那一項開始發揮作用。100,000 筆時 bound 小到 $10^{-38}$。往回找，大約 29,300 筆時剛好滿足規格（課堂上口頭說的是大概兩萬九千筆）。

本文補充：為什麼資料從 100 筆變成 1,000 筆，bound 反而變大？看表的中間兩欄：$N$ 變成 10 倍，多項式那個因子變成 1,000 倍，指數那個因子只從 0.882 掉到 0.287。把 bound 取對數再對 $N$ 微分：

$$
\frac{d}{dN}\Big[d_{\text{VC}}\ln(2N) - \frac{1}{8}\epsilon^2 N\Big] = \frac{d_{\text{VC}}}{N} - \frac{\epsilon^2}{8} = 0 \quad\Longrightarrow\quad N = \frac{8\,d_{\text{VC}}}{\epsilon^2} = \frac{8 \times 3}{0.01} = 2{,}400
$$

所以 bound 在 $N = 2{,}400$ 之前一直變大（最大值約 $2.2 \times 10^{10}$），之後才開始下降，要一路降到 29,300 才低於 0.1。本文用程式逐一比較過，$N = 29{,}300$ 也確實是第一個讓 bound 不超過 0.1 的整數。這不表示資料多了反而學得差，只表示 $N$ 還小的時候這個 bound 說不出任何有用的話。

講義由此歸納：理論上需要 $N \approx 10{,}000\,d_{\text{VC}}$。課堂上說，換不同的 VC 維度代進去，得到的大概都是一萬倍。本文在同樣的 $\epsilon = \delta = 0.1$ 下算了幾個：

| $d_{\text{VC}}$ | 讓 bound $\le 0.1$ 的最小 $N$ | $N / d_{\text{VC}}$ |
|---|---|---|
| 2 | 19,898 | 9,949 |
| 3 | 29,300 | 9,767 |
| 5 | 48,916 | 9,783 |
| 10 | 100,652 | 10,065 |
| 50 | 560,113 | 11,202 |

比值都在一萬上下。要注意這個「一萬」跟規格綁在一起：$\epsilon$ 或 $\delta$ 換了，倍數也會跟著變。

課堂上接著替學生抱怨：一個二維平面要學一條線，得找三萬個點，哪來這麼多資料？然後給出實務的觀察：大概 10 倍的 VC 維度就很夠了。在平面上給 30 個點學一條線已經很夠，給 100 個點就算奢侈。講義把它寫成第二條經驗法則：

$$
N \approx 10\,d_{\text{VC}} \quad \text{often enough!}
$$

本文把 $N = 30$ 代回 $\Omega$ 看看理論怎麼說：$\Omega = \sqrt{\frac{8}{30}\ln\frac{4 \times 60^3}{0.1}} \approx 2.06$。$E_{\text{out}} \le E_{\text{in}} + 2.06$ 這句話毫無內容，因為錯誤率最多就是 1。實務上夠用的資料量，在這個 bound 眼中等於沒有保證。

### 為什麼鬆了一千倍

理論上 10,000 倍、實務上 10 倍，講義第 24 頁列出這個差距的四個來源。每一個都是推導過程中為了讓結論「對什麼都成立」而放寬的地方。下表前兩欄是講義的內容，第三欄是本文依課堂說法整理的：

| 推導時用了什麼 | 換來什麼 | 鬆在哪裡 |
|---|---|---|
| 對未知的 $E_{\text{out}}$ 用 Hoeffding | 任何分布、任何目標函數都成立 | 我們面對的那一個分布與目標，不一定是最壞的 |
| 用 $m_{\mathcal{H}}(N)$，不用 $\lvert\mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N)\rvert$ | 「任何」資料都成立 | 成長函數是所有資料裡的最大值，手上這份資料的 dichotomy 可能比較少 |
| 用 $N^{d_{\text{VC}}}$，不用 $m_{\mathcal{H}}(N)$ | 「任何」$d_{\text{VC}}$ 相同的 $\mathcal{H}$ 都成立 | 多項式是上限的上限的上限 |
| 對最壞情況用 union bound | 演算法 $\mathcal{A}$ 做任何選擇都成立 | 演算法不見得會選到出事的那個假說 |

課堂上對這四列各有一句說明。第一列：這個 bound「包山包海」，不需要知道 $P$ 也不需要知道 $f$。第二列：成長函數只是實際 dichotomy 數量的高估。第三列：好處是看一個假說集合只要看一個數字，不用管它的細節；代價可以用四個點來感受，上限函數說最多 15 種，二維感知器實際上只有 14 種，再換成 $N$ 的次方只會更鬆。第四列：我們假設演算法只要有地雷就可能踩到，但實際上它不一定那麼容易踩到。

本文用前面算過的例子把第二、三列的差距列出來。四個點、二維感知器：手上那份資料實際的 dichotomy 數可以是 12（自我檢查第 2 題那種有三點共線的資料），成長函數是 14，上限函數 $B(4, 4)$ 是 15，$N^{d_{\text{VC}}}$ 是 64。

那這個 bound 還有用嗎？講義在這四點下面用紅字寫：but hardly better, and「similarly loose for all models」。課堂上分兩點說明：

- 很多研究者試過把 bound 弄緊一點，但要像 VC bound 這樣，對分布、目標函數、演算法都不設限，幾乎沒有人做得更好。
- 它對各種模型鬆的程度差不多。課堂上打的比方是：假如每個模型的 bound 都比實際放大了兩萬倍，那拿 bound 來比較誰大誰小還是可以的。

所以講義的結論是：philosophical message of VC bound important for improving ML。課堂上說得很直接：以後用到的不是它理論數字的部分，因為那要一萬倍 VC 維度的資料，多數時候做不到；用到的是它背後的哲學訊息，例如模型複雜度那張圖說的「不要一味追求最強的假說集合」。

### Fun Time：怎麼降低拿到壞資料的機率

**題目（第 25 頁）：** 考慮下面的 VC bound。怎樣可以降低拿到 BAD 資料的機率？

$$
\mathbb{P}_{\mathcal{D}}\Big[\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| > \epsilon\Big] \ \le\ 4\,(2N)^{d_{\text{VC}}}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

1. 降低模型複雜度 $d_{\text{VC}}$
2. 把資料量 $N$ 增加很多
3. 提高對泛化誤差的容忍度 $\epsilon$
4. 以上皆是

**答案：4。** 講義的解答只有一句恭喜（Congratulations on being Master of VC bound），三個選項的理由本文逐一補上：

- **選項 1。** $2N > 1$，所以 $(2N)^{d_{\text{VC}}}$ 隨 $d_{\text{VC}}$ 變小而變小。在 $N = 10{,}000$、$\epsilon = 0.1$ 時，$d_{\text{VC}}$ 每少 1，bound 就除以 20,000。
- **選項 2。** 題目寫的是增加「很多」（a lot），這兩個字不是裝飾。樣本複雜度那張表顯示，$N$ 從 100 加到 1,000 時 bound 反而變大，要超過 $8\,d_{\text{VC}}/\epsilon^2$ 之後指數那一項才壓得過多項式。
- **選項 3。** $\epsilon$ 只出現在 $\exp(-\frac{1}{8}\epsilon^2 N)$ 裡，$\epsilon$ 愈大這一項愈小。代價是「好事」的定義變寬了：你保證的是 $E_{\text{in}}$ 與 $E_{\text{out}}$ 相差不超過一個比較大的數。

嚴格說，三個動作降低的都是機率的**上限**，bound 沒有說真正的機率一定跟著降多少。

### 這堂課的總結

講義第 26 頁把四節各收成一句：

| 節 | 講義的一句話 |
|---|---|
| Definition of VC Dimension | maximum non-break point |
| VC Dimension of Perceptrons | $d_{\text{VC}}(\mathcal{H}) = d + 1$ |
| Physical Intuition of VC Dimension | $d_{\text{VC}} \approx \#$free parameters |
| Interpreting VC Dimension | loosely: model complexity & sample complexity |

到這裡為止，所有的推導都假設資料是由某個固定的目標函數 $f$ 產生的，沒有雜訊，而且只做二元分類。投影片的預告是 more than noiseless binary classification?，課堂上說下一堂要把 VC 維度的概念延伸到更多不同的學習問題上。

## 自我檢查

**1. 一維感知器（positive rays 加上 negative rays）的成長函數是 $m_{\mathcal{H}}(N) = 2N$。它的 VC 維度與最小 break point 各是多少？$m_{\mathcal{H}}(N) \le N^{d_{\text{VC}}}$ 在 $N = 2$ 與 $N = 3$ 成立嗎？**

答案：$N = 2$ 時 $2N = 4 = 2^2$，$N = 3$ 時 $6 < 2^3 = 8$，所以 $d_{\text{VC}} = 2$，最小 break point 是 3。$d_{\text{VC}} = 2$ 滿足條件 $d_{\text{VC}} \ge 2$，上限是 $N^2$：$N = 2$ 時 $4 \le 4$，$N = 3$ 時 $6 \le 9$，都成立。這也符合感知器的公式 $d + 1 = 1 + 1 = 2$。

**2. 四個二維的點 $\mathbf{x}_1 = (0,0)$、$\mathbf{x}_2 = (1,0)$、$\mathbf{x}_3 = (2,0)$、$\mathbf{x}_4 = (5,7)$。照講義的寫法，$\mathbf{x}_4$ 能寫成前三個點的線性組合嗎？不能的話，要怎麼找出一種二維感知器做不出來的 dichotomy？**

答案：補上 $x_0 = 1$ 後，前三個向量是 $(1,0,0)$、$(1,1,0)$、$(1,2,0)$，第三個座標都是 0，組合不出 $(1,5,7)$，所以 $\mathbf{x}_4$ 不能被前三個點表示。但四個向量仍然線性相依：$\mathbf{x}_1 - 2\mathbf{x}_2 + \mathbf{x}_3 = \mathbf{0}$（$\mathbf{x}_4$ 的係數是 0）。把係數不為 0 的 $\mathbf{x}_3$ 移到一邊：$\mathbf{x}_3 = -\mathbf{x}_1 + 2\mathbf{x}_2$。係數的正負號是 $(-, +)$，所以當 $\mathbf{x}_1$ 標 ×、$\mathbf{x}_2$ 標 ○ 時，$\mathbf{w}^\top\mathbf{x}_3 = -\mathbf{w}^\top\mathbf{x}_1 + 2\mathbf{w}^\top\mathbf{x}_2 > 0$，$\mathbf{x}_3$ 被迫是 ○。$(\times, \circ, \times, \ast)$ 做不出來，$\ast$ 是 ○ 或 × 都一樣；整個反過來的 $(\circ, \times, \circ, \ast)$ 也做不出來。本文用程式驗算，這四個點只有 12 種 dichotomy，缺的正是這 4 種。這就是三點共線時「夾在中間的點不能跟兩邊不同」的代數版本。

**3. 三維的感知器（$d = 3$），取講義那組點：原點與三個座標軸上的單位點。寫出產生標籤 $\mathbf{y} = (-1, +1, +1, -1)$ 的 $\mathbf{w}$，並驗算。**

答案：$w_0 = y_1 = -1$，$w_i = y_{i+1} - y_1$，所以 $\mathbf{w} = (-1, 2, 2, 0)$。驗算：原點得到 $w_0 = -1$；第一軸的點得到 $-1 + 2 = 1$；第二軸的點得到 $-1 + 2 = 1$；第三軸的點得到 $-1 + 0 = -1$。四個值正好是 $\mathbf{y}$。

**4. $d_{\text{VC}} = 3$、$\delta = 0.1$。$N = 1{,}000$ 與 $N = 100{,}000$ 時，$\Omega$ 各是多少？這兩個數字各代表什麼？**

答案：$N = 1{,}000$：$\Omega = \sqrt{\frac{8}{1000}\ln\frac{4 \times 2000^3}{0.1}} = \sqrt{0.008 \times 26.49} \approx 0.46$。$N = 100{,}000$：$\Omega = \sqrt{\frac{8}{100000}\ln\frac{4 \times 200000^3}{0.1}} = \sqrt{0.00008 \times 40.31} \approx 0.057$。意思是：有九成以上的把握，$E_{\text{out}}$ 不會比 $E_{\text{in}}$ 高出這麼多。1,000 筆時保證的差距是 0.46，$E_{\text{in}} = 0$ 也只能保證 $E_{\text{out}} \le 0.46$，比丟銅板好不了多少；100,000 筆時差距縮到 0.057。資料變成 100 倍，$\Omega$ 大約只縮成八分之一，因為 $N$ 在根號裡面，而且對數那一項還跟著變大。

**5. 有人說：「我的假說集合 VC 維度有限，所以它一定學得起來。」這句話少了什麼？另一個人說：「那我選 VC 維度最大的假說集合，$E_{\text{in}}$ 最低，一定最好。」這句話又少了什麼？**

判準：第一句的回答要指出，有限的 $d_{\text{VC}}$ 加上夠大的 $N$ 只保證 $E_{\text{out}} \approx E_{\text{in}}$，還需要演算法找到 $E_{\text{in}}$ 小的 $g$，而且整個保證是機率性的；$d_{\text{VC}}$ 太小時 $E_{\text{in}}$ 可能根本壓不下來。第二句的回答要指出 $E_{\text{out}} \le E_{\text{in}} + \Omega$ 的第二項隨 $d_{\text{VC}}$ 變大，最好的 $d_{\text{VC}}$ 在中間；能舉出類似本文三種特徵數的數字對照更好。

## 練習與對應閱讀

**作業。** [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) 在 2024-10-07 發布、10-21 截止，題目涵蓋基石第 7 到第 10 堂，沒有官方解答。跟這堂直接相關的是兩題：

- **Q1**（自動批改）：五個各只有一個參數的假說集合，哪一個的 $d_{\text{VC}}$ 最大。這題考的就是「$d_{\text{VC}} \approx$ 自由參數個數，但不總是如此」。做法：五個選項各自試著 shatter 1 個、2 個、3 個點，不要只數參數。
- **Q5**：證明或反證 $d_{\text{VC}}(\mathcal{H}_1 \cup \mathcal{H}_2) \le d_{\text{VC}}(\mathcal{H}_1) + d_{\text{VC}}(\mathcal{H}_2)$。先拿 positive rays 與 negative rays 這一對試試看。

同一份作業的 Q6、Q7 屬於下一堂。整份作業的導讀在[基石作業](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。Fall 2026 的 hw2 依課程頁的排程在 10/07 公布，2026-09-30 查核時還沒公開。影片與講義都免費公開；Fall 2024 的作業 PDF 也公開，但沒有官方解答，批改只限修課生。

**教科書。** [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 與 [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 的課程頁都把這堂對到 [Learning from Data](http://amlbook.com)（LFD）的 2.2 節。

**Fall 2026 的補充投影片。** Fall 2026 為這堂多發了一份 5 頁的 extended slides [07e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf)，有三件事是 MOOC 講義沒有的：

- 它把過原點的 $d$ 維感知器 $d_{\text{VC}} = d$ 寫成正式的結果（MOOC 講義只放在 Fun Time 裡讓你猜），並且指出證明 $d_{\text{VC}}$ 有時比直接推 $m_{\mathcal{H}}(N)$ 容易。
- 它把「bound 很鬆」放到深度學習的脈絡下：VC bound 作為數學定理仍然成立，概念上也仍把模型複雜度和泛化連在一起；但對合理的 $N$ 與 $\mathcal{H}$，$\Omega$ 會遠大於 1，變成沒有意義的 bound，而 double descent 這類新觀察也還沒被完整解釋。投影片的建議是「take the philosophical message, not the mathematical numbers」。
- 它介紹另一種複雜度的量尺 Rademacher complexity：跟資料相依，比成長函數「軟」，也比較容易推廣到迴歸。

**日常怎麼用。** 挑一個你熟悉的模型，數它的自由參數估一個 $d_{\text{VC}}$，再看手上的資料量有沒有它的 10 倍以上。這是這堂課的結論在實務上最直接的用法。

**延伸閱讀。** [Caltech Learning from Data](https://work.caltech.edu/telecourse) 的 Lecture 7 同樣是 The VC Dimension，可以當英文對照。[Stanford CS229 第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)用 bias–variance 的角度看「模型太簡單與太複雜」這同一個取捨。

**下一堂。** [基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)把固定的目標函數換成有雜訊的目標分布，並且說明換了誤差的算法之後，這堂的結論還成不成立。

## 課程影片來源

原始影片：[Definition of VC Dimension](https://www.youtube.com/watch?v=XxPB9GlJEUk)、[VC Dimension of Perceptrons](https://www.youtube.com/watch?v=WQzhc1IdB_I)、[Physical Intuition of VC Dimension](https://www.youtube.com/watch?v=5-V5WCf8cY8)、[Interpreting VC Dimension](https://www.youtube.com/watch?v=_DN_oF-i6ag)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-13：原本與第 8 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。

## 參考資料

- [基石第 7 堂講義 07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf)：本文的主要底本，四節的定義、證明、表格與六題 Fun Time 都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Fall 2026 extended slides 07e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf)：過原點感知器的結果、深度學習時代對 VC bound 的補充、Rademacher complexity。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：LFD 對應章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：LFD 對應章節與 hw2 的排程。
- [Fall 2024 Homework 3（hw3_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)：Q1 與 Q5 的題目內容。
- [Learning from Data 教科書網站](http://amlbook.com)：2.2 節的出處。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：英文對照，Lecture 7 同名。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
