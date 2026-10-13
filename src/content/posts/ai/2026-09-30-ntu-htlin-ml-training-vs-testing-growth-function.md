---
title: "訓練與測試：無限多條線其實只有幾種｜台大林軒田 機器學習基石 第 5 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, growth-function]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 5
tldr: "上一堂的保證裡有假說個數 M，感知器有無限多條線，M 是無限大。這堂課改數這些線在 N 筆資料上排得出幾種 ○× 組合（dichotomy），對所有擺法取最大值得到成長函數 m_H(N)：positive rays 是 N+1，positive intervals 是 ½N²+½N+1，convex sets 是 2ᴺ，二維感知器在 4 個點上最多 14 種。成長函數第一次到不了 2ᴺ 的點數叫 break point，講義猜它會把成長函數壓成多項式，證明留到下一堂。"
description: "台大林軒田機器學習基石第 5 堂 Training versus Testing 導讀：學習拆成的兩個核心問題、M 的兩難、union bound 高估在哪裡、dichotomy 與成長函數的定義、四個假說集合的成長函數怎麼數、shatter 與 break point，四題 Fun Time 逐題解釋。"
draft: false
glossary:
  - term: "dichotomy"
    aliases: ["二分", "dichotomies"]
    definition: "只看一個假說 h 在 N 筆輸入 x₁…x_N 上的輸出，得到的長度 N 的 ○× 向量。無限多個假說在固定的 N 個點上，最多只有 2^N 種 dichotomy。"
    context: "基石第 5 堂用 dichotomy 的個數當作取代「假說個數 M」的候選。"
    links:
      - label: "基石第 5 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "成長函數"
    aliases: ["growth function", "m_H(N)"]
    definition: "對所有可能的 N 筆輸入取最大，假說集合 H 能產生的 dichotomy 個數。上限是 2^N。"
    context: "基石第 5 堂想拿它取代 Hoeffding 加 union bound 那條不等式裡的 M；能不能換要到下一堂才證明。"
    links:
      - label: "基石第 5 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "shatter"
    aliases: ["shattered", "打碎"]
    definition: "N 個輸入被 H shatter，指 H 在這 N 個點上做得出全部 2^N 種 dichotomy。"
    context: "基石第 5 堂用 convex sets 的例子引入：放在圓上的 N 個點可以被 shatter。"
  - term: "break point"
    aliases: ["最小 break point"]
    definition: "若沒有任何 k 個輸入能被 H shatter，k 就是 H 的 break point；k+1、k+2… 也都是。課程通常只討論最小的那個。"
    context: "二維感知器的最小 break point 是 4。"
    links:
      - label: "基石第 5 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [05_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/27 到 27/27），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 5 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，前四堂回答的是第一個「When Can Machines Learn?」，這堂開始進入第二個「Why Can Machines Learn?」。上一堂[基石第 4 堂：學習可行嗎](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)的結論在同一頁上只有一行：資料來自統計上的抽樣、假說集合的大小 $\lvert\mathcal{H}\rvert$ 有限時，學習是 PAC 可行的。這堂要處理的是「有限」這個條件。[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的感知器有無限多條線，照上一堂的不等式什麼都保證不了。

先備是上一堂的 $E_{\text{in}}$、$E_{\text{out}}$、Hoeffding 不等式與 union bound，以及第 2 堂的感知器。這堂幾乎沒有代數推導，要做的事是「數」：數一個假說集合在 $N$ 個點上排得出幾種 ○× 組合。讀完之後，你應該能自己算出 positive rays、positive intervals、convex sets 的成長函數，在紙上找出二維感知器在四個點上做不出來的那兩種組合，並且對任何一個新的假說集合找出它的 break point。

整堂課的路線：

1. **兩個核心問題**：$E_{\text{out}}(g) \approx E_{\text{in}}(g)$ 與 $E_{\text{in}}(g) \approx 0$，假說個數 $M$ 對兩者的作用相反。
2. **$M$ 從 union bound 來**：相似的假說會一起出事，union bound 卻把它們當成各自獨立的壞事，重複計算。
3. **改數種類**：無限多條線，從 $N$ 筆資料看出去只有有限多種。
4. **成長函數** $m_{\mathcal{H}}(N)$：把「幾種」定義成任何假說集合都能用的量。
5. **Break point**：成長函數第一次到不了 $2^N$ 的地方。

## 學習拆成兩個問題，M 夾在中間兩頭為難

```youtube
url: https://www.youtube.com/watch?v=4aIAxH8eBMs
title: Training versus Testing :: Recap and Preview @ Machine Learning Foundations (機器學習基石)
```

（影片 00:17–04:38 回顧上一堂的流程圖，04:38–06:51 把四堂課串成兩個問題，06:51–09:57 講 M 的兩難，09:57–12:22 預告接下來要做的事，之後是 Fun Time。）

### 訓練與測試各管一件事

講義第 2 頁把上一堂的結論畫回學習流程圖。圖上有未知的目標函數 $f$、訓練資料 $\mathcal{D}$、演算法 $\mathcal{A}$、假說集合 $\mathcal{H}$ 與最後選出來的 $g$；上一堂加上去的是一個未知的機率分布 $P$，訓練資料的 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 和將來測試用的 $\mathbf{x}$ 都從它抽出來。頁首的兩句話是：

- $\lvert\mathcal{H}\rvert = M$ 有限、$N$ 夠大時，不管 $\mathcal{A}$ 挑哪一個 $g$，都有 $E_{\text{out}}(g) \approx E_{\text{in}}(g)$。
- 如果 $\mathcal{A}$ 找得到一個 $E_{\text{in}}(g) \approx 0$ 的 $g$，PAC 保證 $E_{\text{out}}(g) \approx 0$，學習可行。

圖的右下角把這兩件事寫成一條鏈，並且各標了一個字：

$$
E_{\text{out}}(g) \underbrace{\approx}_{\text{test}} E_{\text{in}}(g) \underbrace{\approx}_{\text{train}} 0
$$

這就是堂名 Training versus Testing 的意思。右邊的 $\approx$ 是訓練時要做到的事：演算法在看過的資料上把錯誤壓低。左邊的 $\approx$ 是測試時才看得出來的事：把 $g$ 用在沒看過的資料上，表現要跟訓練時差不多。課堂上解釋為什麼只有訓練不夠：如果只要求 $E_{\text{in}}$ 接近 0，把所有資料背起來就好了，這對機器來說很容易；但測試時考的是沒看過的資料，所以才要花力氣確認 $E_{\text{in}}$ 與 $E_{\text{out}}$ 接近。

### 兩個核心問題

第 3 頁把前四堂各自的貢獻標在同一行式子上：

| 式子的哪一段 | 哪一堂 | 內容 |
|---|---|---|
| $g \approx f$ | 第 1 堂 | 學習的目標：找一個跟未知的 $f$ 很像的 $g$ |
| $E_{\text{in}}(g) \approx 0$ | 第 2 堂 | PLA 與 pocket 讓看過的資料上錯得少 |
| batch、supervised、binary classification | 第 3 堂 | 這些討論所在的設定 |
| $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ | 第 4 堂 | 假說不太多時，兩者會接近 |

在這個設定下 $g \approx f$ 等於 $E_{\text{out}}(g) \approx 0$，而它是靠 $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ 和 $E_{\text{in}}(g) \approx 0$ 兩段接起來的。所以講義說學習拆成兩個核心問題：

1. 能不能確定 $E_{\text{out}}(g)$ 跟 $E_{\text{in}}(g)$ 夠接近？
2. 能不能讓 $E_{\text{in}}(g)$ 夠小？

課堂上對第一個問題多說了一句：少了它，第 1 堂設定的目標和第 2 堂做的事根本連不起來。第二個問題則是第 2 堂已經開始做、之後的課會教更多技巧的部分。

### M 小不好，M 大也不好

第 3 頁最後問：$M = \lvert\mathcal{H}\rvert$ 在這兩個問題裡各扮演什麼角色？第 4 頁的答案是一張對照表：

| | $M$ 小 | $M$ 大 |
|---|---|---|
| 問題 1：$E_{\text{out}} \approx E_{\text{in}}$？ | Yes。$\mathbb{P}[\text{BAD}] \le 2 \cdot M \cdot \exp(\dots)$，$M$ 小，壞事的機率上限就小 | No。同一條式子，$M$ 大，上限跟著變大 |
| 問題 2：$E_{\text{in}}$ 夠小？ | No。選擇太少 | Yes。選擇很多 |

課堂上把兩欄各走了一遍。$M$ 小的時候，演算法能挑的假說有限，不一定找得到 $E_{\text{in}}$ 很小的那一個，至少不是每個問題都找得到，因為不同的問題需要的假說不同。$M$ 大的時候，不考慮計算量的話總能挑到 $E_{\text{in}}$ 小的，但壞事發生的機率上限變大：課堂上舉的數字是本來用 10 個假說，換成 1 萬個，上限就變成 1,000 倍，只剩比較弱的保證。

講義的結論是用對的 $M$（或者說對的 $\mathcal{H}$）很重要，然後問了一句：$M = \infty$ doomed？無限大屬於「太大」的那一邊。課堂上順著這個邏輯開了個玩笑：這樣看起來，之前示範的 PLA 搞不好是騙人的。

### 接下來幾堂要做的事

第 5 頁把已知和待辦並排。已知的是上一堂的不等式：

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \le 2 \cdot M \cdot \exp\big(-2\epsilon^2 N\big)
$$

待辦有三項：

- 找一個**有限的量**來取代 $M$，講義先把它記成 $m_{\mathcal{H}}$：

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \overset{?}{\le} 2 \cdot m_{\mathcal{H}} \cdot \exp\big(-2\epsilon^2 N\big)
$$

- 用它說明 $M$ 無限大時學習為什麼仍然可行。
- 研究 $m_{\mathcal{H}}$，了解它在選「對的 $\mathcal{H}$」時的取捨，就像剛才對 $M$ 做的那樣。

課堂上解釋了這個記號：用小寫的 $m$，是因為它可能比原來的 $M$ 小；下標 $\mathcal{H}$ 表示它是假說集合的某種性質。不等號上面的問號也特別講了：意思是現在還沒有說一定可以這樣換，只是如果能換，就能用一個有限的量取代無限大的 $M$。這個問號到這堂結束都還在，下一堂才處理。

講義在頁尾寫 mysterious PLA to be fully resolved after 3 more lectures。課堂上的說法是大概要再花三堂課、三個小時左右，之後才能大聲說 PLA 確實學得到東西。他還先安撫了一下：這幾堂是理論課，但目的不是一行一行講枯燥的證明，要講的是這些理論之間怎麼發展出來的，以及背後的道理。

### Fun Time：要收集多少資料

**題目（第 6 頁）：** 這條不等式的一種用法是：先定下能容忍的差距 $\epsilon$，以及能容忍的壞事機率 $\delta$（讓不等式右邊的 $2 \cdot M \cdot \exp(-2\epsilon^2 N)$ 等於 $\delta$），再收集夠多的資料達到這兩個要求。設 $\epsilon = 0.1$、$\delta = 0.05$、$M = 100$，需要多少筆資料？

1. 215
2. 415
3. 615
4. 815

**答案：2。** 講義只給了結果 $N = \frac{1}{2\epsilon^2}\ln\frac{2M}{\delta}$，中間的移項如下。要求右邊不超過 $\delta$：

$$
2M\exp\big(-2\epsilon^2 N\big) \le \delta \quad\Longleftrightarrow\quad \exp\big(-2\epsilon^2 N\big) \le \frac{\delta}{2M}
$$

兩邊取自然對數（$\ln$ 是遞增函數，不等號方向不變），再同除以 $-2\epsilon^2$（負數，不等號反向）：

$$
-2\epsilon^2 N \le \ln\frac{\delta}{2M} \quad\Longleftrightarrow\quad N \ge \frac{1}{2\epsilon^2}\ln\frac{2M}{\delta}
$$

代入數字：$\frac{1}{2 \times 0.01} = 50$，$\frac{2M}{\delta} = \frac{200}{0.05} = 4000$，$\ln 4000 \approx 8.294$，所以 $N \ge 414.7$，取整數是 415。課堂上把這題講成一個情境：老闆要求差距只能有 0.1、壞事的機會只能有 5%，你要回答得收多少資料；式子裡所有數字都知道，只有 $N$ 不知道，把它反算出來就好。

其他選項代回去看：$N = 215$ 時右邊是 $200 \times e^{-4.3} \approx 2.71$，比 1 還大，等於什麼都沒保證。615 與 815 分別給出約 $0.00091$ 與 $0.000017$，都滿足要求，但題目問的是需要的資料量，也就是最少要多少。

本文補充：這條公式裡 $M$ 在對數裡面。$M$ 從 100 變成 10,000，壞事機率的上限變成 100 倍，需要的資料只從 415 筆增加到 645 筆；$M = 10^6$ 時是 876 筆。所以 $M$ 大一些不是大問題，麻煩的是 $M = \infty$：$\ln\infty$ 還是無限大，再多資料都不夠。

## 無限多條線，從資料看出去有幾種

```youtube
url: https://www.youtube.com/watch?v=oAW0_j8_l3Y
title: Training versus Testing :: Effective Number of Lines @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:27 檢討 union bound，03:27–06:52 是一個點與兩個點，06:52–09:43 三個點，09:43–11:35 四個點，11:35–14:03 定義 effective number of lines，之後是 Fun Time。）

### M 是從 union bound 來的

要取代 $M$，先看它當初怎麼出現的（第 7 頁）。對第 $m$ 個假說 $h_m$，定義壞事件

$$
\mathcal{B}_m:\ \lvert E_{\text{in}}(h_m) - E_{\text{out}}(h_m)\rvert > \epsilon
$$

上一堂的 Hoeffding 不等式說，對單一個固定的假說，$\mathbb{P}[\mathcal{B}_m] \le 2\exp(-2\epsilon^2 N)$。為了讓演算法 $\mathcal{A}$ 能自由挑選（課堂上的說法是不要踩到地雷），需要的是「沒有任何一個假說出事」，所以要算的是 $\mathbb{P}[\mathcal{B}_1 \text{ or } \mathcal{B}_2 \text{ or } \dots \mathcal{B}_M]$。上一堂用 union bound 處理它：

$$
\mathbb{P}[\mathcal{B}_1 \text{ or } \mathcal{B}_2 \text{ or } \dots \mathcal{B}_M] \le \mathbb{P}[\mathcal{B}_1] + \mathbb{P}[\mathcal{B}_2] + \dots + \mathbb{P}[\mathcal{B}_M]
$$

右邊有 $M$ 項，每項不超過 $2\exp(-2\epsilon^2 N)$，$M$ 就是這樣乘上去的。講義註明等號成立的最壞情形是所有 $\mathcal{B}_m$ 互不重疊。$M$ 無限大時右邊是無限多項相加；課堂上指出，只要每一項都是個不為 0 的數，加起來可能遠大於 1，這個上限就沒有意義了，畢竟機率本來就不會超過 1。

### union bound 高估在哪裡

第 8 頁的回答是：壞事件其實大量重疊。拿兩個很像的假說 $h_1 \approx h_2$ 來看，課堂上舉的例子就是感知器裡兩條靠得很近的線。講義列了兩個理由：

1. $E_{\text{out}}(h_1) \approx E_{\text{out}}(h_2)$。兩條線只在中間很窄的一塊區域判斷不同。課堂上補了一個條件：只要機率分布不是太糟糕，落在那一小塊的機率就小。
2. 對大部分的資料集 $\mathcal{D}$，$E_{\text{in}}(h_1) = E_{\text{in}}(h_2)$。只要手上的資料沒有剛好落在兩條線有差別的那一小塊，兩條線對每一筆資料的判斷都相同，$E_{\text{in}}$ 是同一個數，連近似都不用。

兩者合起來，讓 $h_1$ 出事的資料集與讓 $h_2$ 出事的資料集幾乎是同一批。投影片右邊畫了三個幾乎疊在一起的圓 $\mathcal{B}_1$、$\mathcal{B}_2$、$\mathcal{B}_3$。union bound 的算法相當於把這三個圓拆開、面積各算一次再相加，重疊的部分被重複計算，講義的用詞是 over-estimating。無限多條線就是無限多個這樣互相重疊的圓，加起來才會爆掉。

所以講義提出這堂課的方向：to account for overlap, can we group similar hypotheses by kind？課堂上說這是第一步：把無限多個假說分成有限多類，每一類裡面的假說長得差不多。

### 一個點、兩個點

第 9 頁拿 $\mathcal{H} = \{\text{all lines in } \mathbb{R}^2\}$，也就是平面上所有的感知器來試。線有無限多條。課堂上的切入點是：資料是有限筆，那就從資料的眼睛看出去。

**只有一個輸入 $\mathbf{x}_1$。** 從它看出去，線只有兩種：把 $\mathbf{x}_1$ 判成 ○ 的，和把 $\mathbf{x}_1$ 判成 × 的。投影片畫了兩條位置、斜率都不同的線 $h_1$ 與 $h_2$ 當代表，講義把兩類寫成 $h_1$-like 與 $h_2$-like。課堂上另外示範了反方向：兩條看起來不一樣的線，只要都把 $\mathbf{x}_1$ 判成 ○，就算同一種。

**兩個輸入 $\mathbf{x}_1, \mathbf{x}_2$（第 10 頁）。** 四種：

| 種類 | $\mathbf{x}_1$ | $\mathbf{x}_2$ | 怎麼畫 |
|---|---|---|---|
| 1 | ○ | ○ | 兩點都在線的正面 |
| 2 | × | × | 把上一條線的正反面對調 |
| 3 | ○ | × | 線穿過兩點之間，$\mathbf{x}_1$ 那側是正面 |
| 4 | × | ○ | 上一條線正反面對調 |

課堂上說，這四種線可以直接用它們在 $\mathbf{x}_1$、$\mathbf{x}_2$ 上產生的圈叉來代表。一個輸入 2 種，兩個輸入 4 種，講義接著問三個輸入。

### 三個點：8 種，但不一定

第 11 頁把三個點排成三角形，列出 8 張小圖：全 ○、全 ×，兩 ○ 一 ×（3 種），兩 × 一 ○（3 種）。課堂上給了判斷方法：一種圈叉組合只要是線性可分的，就有一條線能產生它，這一種就存在。三角形的三個頂點不管怎麼標，都能用一條線把 ○ 與 × 分開，所以 8 種都有。

講義接著問 always 8 for three inputs？第 12 頁換一組輸入：三個點排在同一條直線上，$\mathbf{x}_2$ 在中間。這時候 8 種組合裡有兩種被打叉：

| $\mathbf{x}_1$ | $\mathbf{x}_2$（中間） | $\mathbf{x}_3$ | 做得出來嗎 |
|---|---|---|---|
| ○ | × | ○ | 不行 |
| × | ○ | × | 不行 |

一條直線跟這三點所在的直線最多交在一個點，所以只能把三個點切成「一邊連續的幾個、另一邊連續的幾個」，中間那個點不可能和兩端都不同。剩下 6 種。講義的結論是 'fewer than 8' when degenerate，括號裡舉了共線與 same inputs。後者課堂上也講了：兩個點如果疊在同一個位置，一個要 ○ 一個要 ×，任何線都做不到。

### 四個點：最多 14 種

第 13 頁把四個點排成四邊形，$\mathbf{x}_1$ 在上、$\mathbf{x}_2$ 在左、$\mathbf{x}_3$ 在下、$\mathbf{x}_4$ 在右。四個點有 $2^4 = 16$ 種圈叉組合，投影片只畫了 8 張小圖，旁邊標「14: 2×」。課堂上先替學生問了為什麼只列 8 張：另外 8 種是對稱的。一種組合做得出來，把那條線的正反面對調，每個點的 ○× 都反過來，所以反過來的那一種也做得出來。8 張圖裡 $\mathbf{x}_1$ 都是 ○，各自代表它本身和它的反相。

8 張裡有一張被打叉：$\mathbf{x}_1$ 與 $\mathbf{x}_3$ 是 ○、$\mathbf{x}_2$ 與 $\mathbf{x}_4$ 是 ×，也就是對角的兩點同號。課堂上的說法是，其他幾張都畫得出一條線，唯獨這一張沒有辦法讓 ○ 在一邊、× 在另一邊；無限多條線裡面就是沒有這種線。所以種類數是 $(8 - 1) \times 2 = 14$。

講義在這一頁的結論比前面強：for any four inputs at most 14。不管四個點怎麼擺，都拿不到 16 種。課堂上補充，共線或重疊時會更少，比較一般的擺法就是 14。

講義沒有證明「任何四個點」這句話。下面用兩組具體的座標各驗一次，這是本文自擬的例子，不在講義上。

**擺法一：正方形。** 四個點依序是 $(0,0)$、$(1,0)$、$(1,1)$、$(0,1)$。假設有一條線 $\text{sign}(w_1 x_1 + w_2 x_2 + b)$ 把對角的 $(0,0)$、$(1,1)$ 判成 ○，把 $(1,0)$、$(0,1)$ 判成 ×。四個條件分別是

$$
b > 0,\qquad w_1 + w_2 + b > 0,\qquad w_1 + b < 0,\qquad w_2 + b < 0
$$

前兩式相加得 $w_1 + w_2 + 2b > 0$，後兩式相加得 $w_1 + w_2 + 2b < 0$，矛盾。所以這一種（以及它的反相）做不出來。把兩個座標當成兩個輸入位元、○ 當成輸出 1，它的反相（$(1,0)$、$(0,1)$ 是 ○）正好是邏輯運算 XOR 的真值表，所以這種對角同號的標法常被叫做 XOR 的形狀。其餘 14 種都可以：全 ○、全 × 各 1 種；只有一個點跟別人不同的 8 種，用一條線切掉那個角；相鄰兩點同號的 4 種，用一條水平線或鉛直線。$2 + 8 + 4 = 14$。

**擺法二：三角形加一個內部的點。** $(0,0)$、$(4,0)$、$(0,4)$ 加上 $(1,1)$。內部那一點可以寫成三個頂點的加權平均：$(1,1) = \frac{1}{2}(0,0) + \frac{1}{4}(4,0) + \frac{1}{4}(0,4)$。如果一條線讓三個頂點的 $w_1 x_1 + w_2 x_2 + b$ 都是正的，內部那點的值就是這三個正數的加權平均，也是正的，不可能是 ×。所以「外面三個 ○、裡面一個 ×」和它的反相做不出來，其餘 14 種可以。

本文用線性規劃把這兩組座標的 16 種組合逐一檢查過，都是 14 種，缺的正是上面說的那兩種。

兩個論證都不依賴特定的座標，可以接成「任何四個點」的說明。四個點分三種情形：

1. **沒有三點共線，四點圍成凸四邊形。** 兩條對角線相交在一點 $\mathbf{p}$，$\mathbf{p}$ 落在兩條對角線上，所以它既是一組對角點的加權平均，也是另一組對角點的加權平均。假設有一條線把一組對角點判成 ○、另一組判成 ×：照擺法二的道理，前者讓 $\mathbf{p}$ 的 $w_1 x_1 + w_2 x_2 + b$ 是正的，後者讓它是負的，矛盾。這一種和它的反相做不出來。
2. **沒有三點共線，有一點落在另外三點圍成的三角形裡。** 就是擺法二：「外面三個 ○、裡面一個 ×」和它的反相做不出來。
3. **有三點共線，或有兩點重疊。** 共線的三點做不出「中間和兩端不同」，第四個點標 ○ 或 × 都救不回來，至少缺 4 種（自我檢查第 3 題）；兩點重疊時，把它們標成一 ○ 一 × 的 8 種全都做不出來。

沒有三點共線的四個點只會是前兩種情形之一，所以不管怎麼擺都至少缺 2 種，最多 14 種。這段討論是本文的補充，講義只給了結論。

### 有效的線的數量

第 14 頁把這個「最多幾種」取了名字：對 $N$ 個輸入 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 而言，線最多有幾種，叫 effective number of lines，有效的線的數量。

| $N$ | effective($N$) | $2^N$ |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 4 | 4 |
| 3 | 8 | 8 |
| 4 | 14 | 16 |

講義在上面列了三點：

- **一定不超過 $2^N$。** 講義寫 (why?)，課堂上回答了：每個點只有 ○、× 兩種可能，$N$ 個點最多就 $2^N$ 種組合，例如 10 個點是 1,024 種。
- **它是無限多條線的一個有限的分組。** 線再多，這個數字都是有限的。
- **願望：** 把不等式裡的 $M$ 換成它。

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \le 2 \cdot \text{effective}(N) \cdot \exp\big(-2\epsilon^2 N\big)
$$

講義用的字是 wish。頁尾把條件講清楚：如果 (1) effective($N$) 可以取代 $M$，而且 (2) effective($N$) $\ll 2^N$，那麼無限多條線也能學。課堂上強調表上那個 14：數列沒有照 2、4、8、16 走下去，到某個地方突然比 $2^N$ 小。只要它比 $2^N$ 小很多，$N$ 夠大時右邊那個指數下降的項就會把它壓到接近 0。他同時把話說在前面：這暫時是猜想，或者說幻想，要花一些力氣才能證明。兩個條件各自為什麼需要，Break point 那一節會用數字算給你看。

### Fun Time：五個點有幾種線

**題目（第 15 頁）：** 平面上五個輸入，有效的線的數量是多少？

1. 14
2. 16
3. 22
4. 32

**答案：3。** 講義的解法：把五個點大致排在一個圓上，就可以挑任意幾個**連續**的點放在線的一邊、其餘放另一邊。照這個做法數（課堂上也是這樣數的，一個相鄰的點是 ○、兩個相鄰的點是 ○，依此類推）：

| ○ 的個數 | 有幾種 | 說明 |
|---|---|---|
| 0 | 1 | 全 × |
| 1 | 5 | 圓上任選一點 |
| 2 | 5 | 相鄰的兩點，起點有 5 種選法 |
| 3 | 5 | 相鄰的三點 |
| 4 | 5 | 相鄰的四點 |
| 5 | 1 | 全 ○ |

合計 $1 + 5 \times 4 + 1 = 22$，遠小於 $2^5 = 32$。為什麼只能是連續的點？本文補充：這五個點圍成一個凸五邊形，一條直線穿過凸多邊形時，和它的邊界最多交在兩處，所以頂點被分成兩段各自連續的弧。像「○×○××」這種 ○ 不相鄰的組合就做不出來。

講義接著說，改變點的擺法很難做出更多種，正式的證明留到之後的課。課堂上也說要證明 22 是最大值有一點複雜，希望大家試得夠多之後會相信。本文試了 300 組隨機擺放的五個點，用線性規劃逐一檢查 32 種組合，最多的也是 22 種；這只是嘗試，不是證明。

其他選項：14 是四個點的答案。32 表示五個點的所有組合都做得出來；真是那樣的話，蓋住其中一點，剩下四個點的 16 種組合也都做得出來，跟「任何四個點最多 14 種」矛盾。16 是 $2^4$，四個點的組合總數，跟五個點無關。

本文補充：把這個數法用在圓上的 $N$ 個點，○ 的個數從 1 到 $N-1$ 各有 $N$ 種，加上全 ○ 與全 ×，共 $N(N-1) + 2$ 種。$N = 1, 2, 3, 4, 5$ 時是 2、4、8、14、22，和講義的表一致；$N = 6$ 時是 32，遠小於 $2^6 = 64$。這個式子只說明「至少做得出這麼多種」，它是不是最大值，這堂課沒有回答。

## 把「幾種線」推廣成成長函數

```youtube
url: https://www.youtube.com/watch?v=dnVofdAomWY
title: Training versus Testing :: Effective Number of Hypotheses @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:02 定義 dichotomy，03:02–05:48 定義成長函數，05:48–09:20 positive rays，09:20–11:51 positive intervals，11:51–15:29 convex sets 與 shatter，之後是 Fun Time。）

### Dichotomy：只在 N 個點上看的假說

Effective Number of Lines 那一節數的是線。課堂上開頭就說，以後用的假說集合不一定是線，可能是高維的超平面，也可能是曲線，所以需要一個對任何 $\mathcal{H}$ 都能用的說法。第 16 頁給了定義。假說集合是 $\mathcal{H} = \{\text{hypothesis } h: \mathcal{X} \to \{\times, \circ\}\}$，把一個假說 $h$ 在 $N$ 個輸入上的輸出排成一列：

$$
h(\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N) = \big(h(\mathbf{x}_1), h(\mathbf{x}_2), \dots, h(\mathbf{x}_N)\big) \in \{\times, \circ\}^N
$$

這個長度 $N$ 的圈叉向量叫一個 dichotomy。講義的描述是 hypothesis 'limited' to the eyes of $\mathbf{x}_1, \dots, \mathbf{x}_N$，這一頁的標題乾脆叫它 mini-hypotheses。課堂上解釋這個字是二分的意思：它把手上的點分成 ○ 一堆、× 一堆。

$\mathcal{H}$ 裡所有的假說在這 $N$ 個點上做得出來的 dichotomy 收成一個集合，記作 $\mathcal{H}(\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N)$。記號還是 $\mathcal{H}$，後面多了括號與輸入，表示看的是 dichotomy 而不是原來的假說。講義用一張表對照兩者：

| | 假說集合 $\mathcal{H}$ | dichotomy 集合 $\mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N)$ |
|---|---|---|
| 例子 | 平面上所有的線 | $\{\circ\circ\circ\circ, \circ\circ\circ\times, \circ\circ\times\times, \dots\}$ |
| 大小 | 可能是無限大 | 最多 $2^N$ |

差別在於定義域：假說要對整個輸入空間 $\mathcal{X}$ 的每個點給答案，dichotomy 只對特定的 $N$ 個點給答案。很多個不同的假說會對應到同一個 dichotomy，Effective Number of Lines 那一節說的「同一種線」就是這個意思。講義的結論是：$\lvert\mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N)\rvert$ 是取代 $M$ 的候選。

### 成長函數：對所有擺法取最大

這個候選有個麻煩（第 17 頁）：它跟選了哪 $N$ 個輸入有關。三個點排成三角形是 8，共線是 6。課堂上說，這種對輸入的依賴會讓後面的理論分析有點麻煩，所以要把它拿掉；既然是在算有幾種，就算最多有幾種。做法是對所有可能的 $N$ 個輸入取最大值：

$$
m_{\mathcal{H}}(N) = \max_{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N \in \mathcal{X}} \big\lvert\mathcal{H}(\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N)\big\rvert
$$

這就是成長函數（growth function）。它是 $N$ 的函數：給它點的個數，它回答這個假說集合最多做得出幾種 dichotomy。取了 max 之後，它只跟 $\mathcal{H}$ 與 $N$ 有關，跟資料實際長什麼樣無關。這也是「接下來幾堂要做的事」那一小節預告的 $m_{\mathcal{H}}$ 的正式定義。因為每個 dichotomy 集合都不超過 $2^N$，講義寫成長函數是 finite, upper-bounded by $2^N$。

Effective Number of Lines 那一節的 effective number of lines 就是二維感知器的成長函數。講義把那張表重列了一次，第三列特別寫成 $\max(\dots, 6, 8) = 8$：共線的 6 與三角形的 8 都出現過，成長函數取大的。

| $N$ | $m_{\mathcal{H}}(N)$（二維感知器） |
|---|---|
| 1 | 2 |
| 2 | 4 |
| 3 | $\max(\dots, 6, 8) = 8$ |
| 4 | $14 < 2^N$ |

這張表只有四個值。講義問 how to 'calculate' the growth function？課堂上承認，要把感知器的成長函數整個寫出來比較困難，所以先看幾個簡單的假說集合。

### Positive rays：N+1

第 18 頁的設定：

- 輸入空間 $\mathcal{X} = \mathbb{R}$，資料是數線上的點。
- 每個假說由一個門檻 $a$ 決定：$h(x) = \text{sign}(x - a)$。比 $a$ 大的是 $+1$（○），比 $a$ 小的是 $-1$（×）。

課堂上解釋名稱：像一道往正方向射出去的光束。講義註明它是 'positive half' of 1D perceptrons；課堂上說一維的感知器還有往負方向指的那一半，這裡先不算。為了畫圖方便，把點由左到右編號成 $x_1 < x_2 < \dots < x_N$。課堂上說這個排序只是為了好看，不影響結果。

**怎麼數。** $N$ 個相異的點把數線切成 $N + 1$ 段（講義稱為 spot）：$x_1$ 左邊、每兩個相鄰的點之間、$x_N$ 右邊。門檻 $a$ 在同一段裡移動時，沒有任何一個點從 $a$ 的一邊換到另一邊，dichotomy 不變；$a$ 換到另一段，至少有一個點換邊，dichotomy 就不同。所以

$$
m_{\mathcal{H}}(N) = N + 1
$$

課堂上補充，如果有點重疊，段數變少，dichotomy 只會更少，所以最大值發生在 $N$ 個點都不同的時候。$N = 4$ 時的 5 種（講義右邊的表）：

| $a$ 的位置 | $x_1$ | $x_2$ | $x_3$ | $x_4$ |
|---|---|---|---|---|
| $x_1$ 左邊 | ○ | ○ | ○ | ○ |
| $x_1$ 與 $x_2$ 之間 | × | ○ | ○ | ○ |
| $x_2$ 與 $x_3$ 之間 | × | × | ○ | ○ |
| $x_3$ 與 $x_4$ 之間 | × | × | × | ○ |
| $x_4$ 右邊 | × | × | × | × |

16 種組合裡只做得出 5 種。做不出來的都有同一個特徵：某個 ○ 的右邊出現 ×。講義的評語是 $(N + 1) \ll 2^N$ when $N$ large。課堂上說這對取代 $M$ 是好事：$N$ 很大時，不等式裡指數下降的那一項會變得很小，把 $N + 1$ 這一項壓掉。

### Positive intervals：½N² + ½N + 1

第 19 頁把假說換成區間，輸入同樣在數線上：$h(x) = +1$ iff $x \in [\ell, r)$，否則是 $-1$。區間裡面是 ○，外面是 ×。

**怎麼數。** 同樣有 $N + 1$ 段。一個 dichotomy 由區間的兩個端點各落在哪一段決定：

- 兩個端點落在**不同**的兩段：從 $N + 1$ 段裡選 2 段，$\binom{N+1}{2}$ 種。每一種選法圈住的點都不一樣，所以這些 dichotomy 彼此不同，而且每個都至少有一個 ○。
- 兩個端點落在**同一段**：區間裡沒有任何資料點，全部都是 ×。不管落在哪一段結果都一樣，只算 1 種。

$$
m_{\mathcal{H}}(N) = \underbrace{\binom{N+1}{2}}_{\text{interval ends in } N+1 \text{ spots}} + \underbrace{1}_{\text{all } \times} = \frac{(N+1)N}{2} + 1 = \frac{1}{2}N^2 + \frac{1}{2}N + 1
$$

$N = 4$ 時是 $\binom{5}{2} + 1 = 11$ 種。講義右邊的表把這 11 種逐一列出，下面依 ○ 的個數重新整理：

| ○ 的個數 | dichotomy（$x_1 x_2 x_3 x_4$） | 幾種 |
|---|---|---|
| 1 | ○×××、×○××、××○×、×××○ | 4 |
| 2 | ○○××、×○○×、××○○ | 3 |
| 3 | ○○○×、×○○○ | 2 |
| 4 | ○○○○ | 1 |
| 0 | ×××× | 1 |

本文補充一個對帳的方法：positive intervals 做得出來的，就是「所有 ○ 連在一起」的組合。長度為 $j$ 的連續一段有 $N - j + 1$ 個位置，$j$ 從 1 加到 $N$ 是 $N + (N-1) + \dots + 1 = \frac{N(N+1)}{2}$，再加全 × 的 1 種，和上面的式子相同。做不出來的例子是 ○×○×：兩個 ○ 中間夾著 ×。

講義的評語同樣是 $\ll 2^N$ when $N$ large。$N = 4$ 時 11 對 16 還看不太出來，$N = 20$ 時是 211 對 1,048,576。課堂上說這對我們是好消息：成長函數是多項式，最終會比 $2^N$ 小。

### Convex sets：2 的 N 次方，以及 shatter

第 20 頁回到平面，$\mathcal{X} = \mathbb{R}^2$。每個假說對應一個凸的區域：$h(\mathbf{x}) = +1$ iff $\mathbf{x}$ 在這個凸區域裡，否則是 $-1$。投影片上有兩張圖，都是粉紅色的底上有一塊藍色的區域；課堂上說藍色代表 ○、粉紅色代表 ×。左邊那一塊像是一個圓把左上角補成直角，標 convex region in blue；右邊是兩個圓部分重疊、交界處凹進去的形狀，標 non-convex region，那個不算。凸的意思是區域裡任兩點的連線都還在區域裡。

**怎麼數（第 21 頁）。** 成長函數取的是最大值，所以只要找到一種最有利的擺法。課堂上說成長函數要應付各式各樣的可能，這裡給一個很極端的：把 $N$ 個點全部放在一個大圓的圓周上。隨便指定一種 dichotomy，做法是：

1. 把要當 ○ 的那些點連成一個多邊形。
2. 把這個多邊形稍微往外擴一點點，讓那些 ○ 點落在裡面。

講義的寫法是 a convex region slightly extended from contour of positive inputs。頂點都在圓周上的多邊形一定是凸的，而其他的點也在圓周上，在這個多邊形的外面，只要擴得夠少就不會被包進去。課堂上舉的例子：要 3 個 ○ 就畫三角形，4 個 ○ 就畫四邊形。投影片上的圖是圓上 10 個點，5 個標 $+$、5 個標 $-$；以那 5 個 $+$ 點為頂點的五邊形塗成藍色，中央標了一個大的 $+$。圖上畫的是還沒往外擴的輪廓。

每一種 dichotomy 都做得出來，所以

$$
m_{\mathcal{H}}(N) = 2^N
$$

講義在這裡引入一個名詞：這 $N$ 個輸入被 $\mathcal{H}$ **shatter** 了。課堂上解釋這個字是打碎的意思，也可以想成這 $N$ 個點被假說集合擊倒了，所有情形通通做得出來。頁尾是

$$
m_{\mathcal{H}}(N) = 2^N \quad\Longleftrightarrow\quad \text{exists } N \text{ inputs that can be shattered}
$$

注意是「存在」。本文補充一個例子說明它不是「所有」：把四個點擺成前面用過的三角形加內部一點，凸區域只要包住三個頂點，就一定包住內部那一點，所以「外面三個 ○、裡面一個 ×」做不出來，這四個點只有 15 種。但成長函數取最大值，圓上的四個點給得出 16 種，$m_{\mathcal{H}}(4)$ 還是 16。

到這裡有了三個算得出完整式子的例子，其中兩個是多項式，一個是 $2^N$。這個差別是 Break point 那一節的主題。

### 用程式對帳

本文補充：一維的三個假說集合可以用十幾行 Python 窮舉。對每一段取一個代表的門檻，把產生的 dichotomy 放進集合裡數。

```python
def spots(xs):
    s = sorted(xs)
    return [s[0] - 1] + [(a + b) / 2 for a, b in zip(s, s[1:])] + [s[-1] + 1]

def rays(xs):        # h(x) = sign(x - a)
    return {tuple(x > a for x in xs) for a in spots(xs)}

def intervals(xs):   # h(x) = +1 iff l <= x < r
    return {tuple(l <= x < r for x in xs) for l in spots(xs) for r in spots(xs)}

def stumps(xs):      # positive and negative rays
    return rays(xs) | {tuple(not v for v in d) for d in rays(xs)}

for N in range(1, 7):
    xs = list(range(N))
    print(N, len(rays(xs)), len(intervals(xs)), len(stumps(xs)), 2 ** N)
```

輸出的五欄依序是 $N$、positive rays、positive intervals、下面 Fun Time 的 decision stump、$2^N$：

| $N$ | rays | intervals | stumps | $2^N$ |
|---|---|---|---|---|
| 1 | 2 | 2 | 2 | 2 |
| 2 | 3 | 4 | 4 | 4 |
| 3 | 4 | 7 | 6 | 8 |
| 4 | 5 | 11 | 8 | 16 |
| 5 | 6 | 16 | 10 | 32 |
| 6 | 7 | 22 | 12 | 64 |

前兩欄和 $N + 1$、$\frac{1}{2}N^2 + \frac{1}{2}N + 1$ 一致。

### Fun Time：positive 加 negative rays

**題目（第 22 頁）：** 把 positive rays 和 negative rays 合起來當 $\mathcal{H}$，它等於一維的感知器。這個假說集合常被稱為 decision stump，形容它的假說的形狀。它的成長函數 $m_{\mathcal{H}}(N)$ 是多少？

1. $N$
2. $N + 1$
3. $2N$
4. $2^N$

**答案：3。** 講義的解答：門檻落在 $N - 1$ 個「內部」的段時，每段有兩種 dichotomy；另外還有全 ○ 與全 × 兩種。把它展開：negative ray 是 $h(x) = -\text{sign}(x - a)$，門檻左邊是 ○、右邊是 ×。

- 門檻在內部的某一段（相鄰兩點之間，共 $N - 1$ 段）：positive ray 給「左 × 右 ○」，negative ray 給「左 ○ 右 ×」，兩種不同。小計 $2(N - 1)$。
- 門檻在最左邊那一段：positive ray 給全 ○，negative ray 給全 ×。門檻在最右邊那一段：positive ray 給全 ×，negative ray 給全 ○。四個結果只有兩種不同的 dichotomy。

$$
m_{\mathcal{H}}(N) = 2(N - 1) + 2 = 2N
$$

另一種算法：positive rays 有 $N + 1$ 種，negative rays 對稱也有 $N + 1$ 種，全 ○ 與全 × 兩邊各算了一次，扣掉重複的 2 種，$2(N+1) - 2 = 2N$。Fall 2026 的 [05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf) 用的是這個算法。上面程式的 stumps 那一欄是 2、4、6、8、10、12。

選項 2 的 $N + 1$ 是只有 positive rays 的答案。選項 4 的 $2^N$ 在 $N = 3$ 時就不對：decision stump 做不出 ○×○ 和 ×○×，只有 6 種。選項 1 的 $N$ 少算了，$N = 1$ 時一個點明明可以是 ○ 也可以是 ×。

## Break point：成長函數從哪裡開始到不了 2 的 N 次方

```youtube
url: https://www.youtube.com/watch?v=z3TpJRqPzcg
title: Training versus Testing :: Break Point @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:12 比較四個成長函數，02:12–03:56 定義 break point，03:56–05:59 四個 break point 與猜想，05:59–06:29 Fun Time，之後是總結。）

### 多項式是好的，指數是壞的

第 23 頁把四個成長函數排在一起：

| 假說集合 | $m_{\mathcal{H}}(N)$ |
|---|---|
| positive rays | $N + 1$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ |
| convex sets | $2^N$ |
| 2D perceptrons | 在某些 $N$ 上 $< 2^N$ |

二維感知器只知道幾個值，以及 $N = 4$ 時做不出 16 種。接著講義把成長函數放進那條帶問號的不等式：

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \overset{?}{\le} 2 \cdot m_{\mathcal{H}}(N) \cdot \exp\big(-2\epsilon^2 N\big)
$$

底下一行結論：polynomial: good; exponential: bad。課堂上的解釋是，後面那一項隨 $N$ 指數下降。$m_{\mathcal{H}}(N)$ 如果是多項式，指數下降得比較快，$N$ 夠大時右邊愈來愈小；如果像 convex sets 是 $2^N$，前面指數成長、後面指數下降，乘起來還是指數在跑，就算 $N$ 很大也不見得能保證 $E_{\text{in}}$ 與 $E_{\text{out}}$ 接近。

以下的數字是本文算的，不在講義上。取 $\epsilon = 0.1$，把三個有完整式子的成長函數代進右邊（這條式子還帶著問號，這裡只是看它的大小怎麼變）：

| $N$ | $\exp(-2\epsilon^2 N)$ | positive rays | positive intervals | convex sets |
|---|---|---|---|---|
| 100 | $0.135$ | $27.3$ | $1{,}367$ | 約 $10^{29.5}$ |
| 500 | $4.5 \times 10^{-5}$ | $0.045$ | $11.4$ | 約 $10^{146}$ |
| 1,000 | $2.1 \times 10^{-9}$ | $4.1 \times 10^{-6}$ | $0.0021$ | 約 $10^{293}$ |
| 2,000 | $4.2 \times 10^{-18}$ | $1.7 \times 10^{-14}$ | $1.7 \times 10^{-11}$ | 約 $10^{585}$ |

以 positive rays、$N = 500$ 那一格為例：$2 \times 501 \times e^{-10} = 1002 \times 4.54 \times 10^{-5} \approx 0.045$。兩個多項式的欄位一開始都大於 1（沒有意義），但 $N$ 增加之後很快掉到接近 0。convex sets 那一欄只會愈來愈大，因為

$$
2^N \exp\big(-2\epsilon^2 N\big) = \exp\big(N(\ln 2 - 2\epsilon^2)\big)
$$

$\epsilon = 0.1$ 時括號裡是 $0.693 - 0.02 = 0.673 > 0$，整個式子隨 $N$ 指數成長。要讓括號變成負的，需要 $2\epsilon^2 > \ln 2$，也就是 $\epsilon > 0.589$；容忍 $E_{\text{in}}$ 與 $E_{\text{out}}$ 差到將近六成，這種保證沒有用處。這就是前面那個願望的條件 (2)「effective($N$) $\ll 2^N$」的用意。

所以講義在頁尾問：for 2D or general perceptrons, $m_{\mathcal{H}}(N)$ polynomial？課堂上的問法是，上次玩得很愉快的 PLA，它用的假說集合到底是好的還是不好的。

### Break point 的定義

回答這個問題要到下一堂。第 24 頁先做一個定義。先整理二維感知器已知的事，講義特別把量詞加上引號：

- 三個輸入：'exists' shatter。**存在**一組三個點（三角形）可以做出全部 8 種。
- 四個輸入：'for all' no shatter。**所有**四個點的擺法都做不出 16 種。

定義：如果沒有任何 $k$ 個輸入能被 $\mathcal{H}$ shatter，就稱 $k$ 是 $\mathcal{H}$ 的一個 **break point**。照成長函數的定義，這等於

$$
m_{\mathcal{H}}(k) < 2^k
$$

理由是：$m_{\mathcal{H}}(k)$ 是所有擺法的最大值，最大值小於 $2^k$，就表示每一種擺法都做不到 $2^k$ 種。投影片右邊的圖是四個點，上下兩個 ○、左右兩個 ×，上面畫了一個大叉，就是 Effective Number of Lines 那一節做不出來的那一種。

課堂上對 break point 的形容是：成長函數裡第一個看起來有希望的地方，露出一線曙光的點。在這之前成長函數都頂在 $2^N$ 上，到這裡第一次嚴格小於它。

講義列了兩個性質：

**$k$ 是 break point，$k+1$、$k+2$、… 也都是。** 課堂上給了理由，這裡把它寫完整。用反證法：假設有 $k + 1$ 個點被 shatter，$2^{k+1}$ 種組合都做得出來。把其中一個點蓋住，只看剩下的 $k$ 個點。這 $k$ 個點的任何一種圈叉組合，都是某個 $k + 1$ 點組合的前 $k$ 碼，所以也做得出來，於是這 $k$ 個點被 shatter 了，跟 $k$ 是 break point 矛盾。所以 $k$ 個點做不到，$k + 1$ 個點就做不到，一路往上都做不到。

**只研究最小的 break point。** 既然後面的都自動是，有資訊量的只有第一個。二維感知器在 $N = 3$ 還能 shatter，$N = 4$ 不行，所以講義寫 2D perceptrons: break point at 4。

定義裡的量詞值得再看一次。三點共線時二維感知器只有 6 種，但 3 不是 break point，因為 break point 要求的是「沒有任何」三個點能被 shatter，而三角形可以。

### 四個 break point，與一個猜想

第 25 頁把四個假說集合的 break point 填上去。講義只寫了結果，下表的「驗算」欄是本文照成長函數代的：

| 假說集合 | $m_{\mathcal{H}}(N)$ | 最小 break point | 驗算 |
|---|---|---|---|
| positive rays | $N + 1 = O(N)$ | 2 | $m(1) = 2 = 2^1$；$m(2) = 3 < 4$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1 = O(N^2)$ | 3 | $m(2) = 4 = 2^2$；$m(3) = 7 < 8$ |
| convex sets | $2^N$ | 沒有 | 每個 $N$ 都等於 $2^N$ |
| 2D perceptrons | 在某些 $N$ 上 $< 2^N$ | 4 | $m(3) = 8 = 2^3$；$m(4) = 14 < 16$ |

每個 break point 都可以指出是哪一種組合做不出來。positive rays 在兩個點上做不出「左 ○ 右 ×」。positive intervals 在三個點上做不出 ○×○。二維感知器在四個點上少了兩種。convex sets 的成長函數永遠是 $2^N$，課堂上的說法是它沒有 break point，或者說 break point 在無限遠的地方。

把 break point 與成長函數的次數放在一起看，講義寫下這堂課最後的猜想（conjecture）：

- 沒有 break point：$m_{\mathcal{H}}(N) = 2^N$。講義標 sure!，這只是定義換句話說。
- break point 是 $k$：$m_{\mathcal{H}}(N) = O(N^{k-1})$。

對照上表：positive rays 的 $k = 2$，成長函數是 $O(N^1)$；positive intervals 的 $k = 3$，是 $O(N^2)$。課堂上接著推：如果這個猜想能證明，二維感知器的第一個 break point 在 4，它的成長函數就大概是 $N$ 的三次方左右的速度，是多項式，落在「好」的那一邊。講義頁尾寫 excited? wait for next lecture。

這個猜想的份量在於，它只用到「在某個 $k$ 上做不出 $2^k$ 種」這一件事，就要對所有的 $N$ 下結論。本文把 $O(N^3)$ 代進前面的表試算：$\epsilon = 0.1$ 時，$2N^3\exp(-2\epsilon^2 N)$ 在 $N = 1{,}000$ 是 $4.1$，在 $N = 2{,}000$ 是 $6.8 \times 10^{-8}$。三次方比前兩個例子慢一些，還是會被指數壓下去。

本文補充：$O(N^{k-1})$ 是上界的寫法，不保證剛好是那個次數。下面 Fun Time 的 decision stump，break point 是 3，猜想給的是 $O(N^2)$，實際的成長函數是 $2N$。

### Fun Time：decision stump 的 break point

**題目（第 26 頁）：** 沿用前一題的 positive 加 negative rays（一維感知器），已知成長函數 $m_{\mathcal{H}}(N) = 2N$。$\mathcal{H}$ 的最小 break point 是多少？

1. 1
2. 2
3. 3
4. 4

**答案：3。** 講義的解答是 $k = 3$ 時 $m_{\mathcal{H}}(k) = 6$ 而 $2^k = 8$。從小的 $k$ 逐一比：

| $k$ | $m_{\mathcal{H}}(k) = 2k$ | $2^k$ | 是 break point 嗎 |
|---|---|---|---|
| 1 | 2 | 2 | 不是 |
| 2 | 4 | 4 | 不是 |
| 3 | 6 | 8 | 是 |
| 4 | 8 | 16 | 是，但不是最小的 |

$k = 2$ 時四種組合 ○○、××、×○、○× 都做得出來（後兩種分別用 positive ray 與 negative ray），所以 2 不是。$k = 3$ 時少了 ○×○ 與 ×○×：中間那個點和兩端都不同，一個門檻做不到。選項 4 的 4 也是 break point，但題目問最小的。

這題和 positive rays 對照：只多了「可以反方向」這一點彈性，break point 就從 2 變成 3。

### 這堂課的總結

第 27 頁把四節各收成一句：

- Recap and Preview：兩個問題，$E_{\text{out}}(g) \approx E_{\text{in}}(g)$ 與 $E_{\text{in}}(g) \approx 0$。
- Effective Number of Lines：從 4 個輸入的眼睛看，最多 14 種。
- Effective Number of Hypotheses：從 $N$ 個輸入的眼睛看，最多 $m_{\mathcal{H}}(N)$ 種。
- Break Point：$m_{\mathcal{H}}(N)$ 開始變得「非指數」的地方。

下一堂的預告是 $m_{\mathcal{H}}(N) = \text{poly}(N)$？課堂上的收尾是：有了 break point 這一線曙光，下次要看能不能真的證明成長函數的成長速度跟多項式差不多。

這堂結束時還沒做完的事有兩件，都留到[基石第 6 堂：泛化理論](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization)：一是猜想本身，二是不等式上的那個問號，也就是 $m_{\mathcal{H}}(N)$ 到底能不能直接取代 $M$。

## 用一個門檻分類器把整堂課走一遍

這一節是本文自擬的例子，不在講義上，數字用 Python 算過。目的是把四節的概念放進同一個情境。

**情境。** 輸入 $x$ 是一個介於 0 與 1 之間的分數，在 $[0, 1]$ 上均勻分布。真正的規則是 $f(x) = \text{sign}(x - 0.5)$。假說集合是 positive rays，$h_a(x) = \text{sign}(x - a)$，門檻 $a$ 可以是 $[0, 1]$ 裡的任何實數，所以 $M = \infty$。$h_a$ 與 $f$ 只在 $a$ 和 $0.5$ 之間判斷不同，那一段的長度就是它判錯的機率：

$$
E_{\text{out}}(h_a) = \lvert a - 0.5\rvert
$$

**兩個核心問題。** 問題 2 在這裡很容易：$f$ 本身就在 $\mathcal{H}$ 裡（$a = 0.5$），一定找得到 $E_{\text{in}} = 0$ 的門檻。難的是問題 1：無限多個門檻，上一堂的不等式右邊是無限大。

**兩個相近的門檻有多重疊。** 取 $a = 0.30$ 與 $a = 0.31$。$E_{\text{out}}$ 分別是 $0.20$ 與 $0.19$，很接近。兩者的 $E_{\text{in}}$ 只有在某筆資料落在 $[0.30, 0.31)$ 時才會不同；$N = 20$ 筆資料全都沒落在這一小段的機率是 $0.99^{20} \approx 0.818$。也就是八成以上的資料集，兩個門檻的 $E_{\text{in}}$ 一模一樣，這就是講義第 8 頁的 for most $\mathcal{D}$, $E_{\text{in}}(h_1) = E_{\text{in}}(h_2)$。

再算壞事件。取 $\epsilon = 0.1$。$h_{0.30}$ 的 $E_{\text{in}}$ 是落在 $[0.30, 0.50)$ 的資料筆數除以 20，這個筆數是 20 次、每次機率 $0.2$ 的二項分布；$\lvert E_{\text{in}} - 0.20\rvert > 0.1$ 發生在筆數不超過 1 或至少 7 的時候。$h_{0.31}$ 看的是落在 $[0.31, 0.50)$ 的筆數，跟 $0.19$ 比，壞事發生在筆數不超過 1 或至少 6 的時候。用 Python 把兩者的聯合分布算出來：

| 量 | 數值 |
|---|---|
| $\mathbb{P}[\mathcal{B}_{0.30}]$ | $0.156$ |
| $\mathbb{P}[\mathcal{B}_{0.31}]$ | $0.248$ |
| union bound：兩者相加 | $0.404$ |
| 實際的 $\mathbb{P}[\mathcal{B}_{0.30} \text{ or } \mathcal{B}_{0.31}]$ | $0.251$ |
| 兩者同時發生的機率 | $0.153$ |

$\mathcal{B}_{0.30}$ 幾乎整個落在 $\mathcal{B}_{0.31}$ 裡面，相加的結果比實際多了六成。這裡只有兩個假說；在 $0.30$ 與 $0.31$ 之間還有無限多個門檻，每一個都和它們高度重疊，union bound 全部分開計算。

**從資料看出去只有 N+1 種。** 假設抽到 $N = 4$ 筆資料：$0.15$、$0.42$、$0.58$、$0.83$，照 $f$ 的標籤是 ×、×、○、○。無限多個門檻在這四個點上只有 5 種 dichotomy：

| $a$ 的範圍 | dichotomy | $E_{\text{in}}(h_a)$ | $E_{\text{out}}(h_a)$ 的範圍 |
|---|---|---|---|
| $a < 0.15$ | ○○○○ | $0.5$ | $0.35$ 到 $0.5$ |
| $0.15 < a < 0.42$ | ×○○○ | $0.25$ | $0.08$ 到 $0.35$ |
| $0.42 < a < 0.58$ | ××○○ | $0$ | $0$ 到 $0.08$ |
| $0.58 < a < 0.83$ | ×××○ | $0.25$ | $0.08$ 到 $0.33$ |
| $a > 0.83$ | ×××× | $0.5$ | $0.33$ 到 $0.5$ |

同一列裡的門檻有無限多個，$E_{\text{in}}$ 是同一個數，演算法從資料上分不出它們。成長函數數的就是列數：$m_{\mathcal{H}}(4) = 5$。但同一列裡的 $E_{\text{out}}$ 並不相同。$E_{\text{in}}$ 只跟 dichotomy 有關，$E_{\text{out}}$ 跟整個假說有關，這是本文對講義那個問號的一點補充：把 $M$ 換成 $m_{\mathcal{H}}(N)$ 不是一步就能寫下來的事，下一堂要處理的正是 $E_{\text{out}}$ 這一邊。

**無限多個門檻，壞事的機率其實是多少。** 用模擬直接估計「存在某個門檻 $a$ 使 $\lvert E_{\text{in}}(h_a) - E_{\text{out}}(h_a)\rvert > 0.1$」的機率。每個資料集只需要檢查各段的端點：同一段裡 $E_{\text{in}}$ 不變，$E_{\text{out}} = \lvert a - 0.5\rvert$ 在不含 $0.5$ 的段裡是 $a$ 的一次函數，最大的差距出現在端點；含 $0.5$ 的那一段 $E_{\text{in}} = 0$，差距就是 $\lvert a - 0.5\rvert$，同樣在端點最大。固定亂數種子的結果：

| $N$ | 模擬估計的機率 | 單一假說的 $2\exp(-2\epsilon^2 N)$ | $2M\exp(\dots)$，$M = \infty$ | $2(N+1)\exp(-2\epsilon^2 N)$ |
|---|---|---|---|---|
| 100 | 約 $0.25$（4,000 次） | $0.27$ | $\infty$ | $27.3$ |
| 200 | 約 $0.03$（4,000 次） | $0.037$ | $\infty$ | $7.4$ |
| 500 | 1,000 次裡 0 次 | $9.1 \times 10^{-5}$ | $\infty$ | $0.045$ |

**這個結果代表什麼。** 假說有無限多個，真正的壞事機率卻是有限的，而且隨 $N$ 增加很快變小；union bound 給的無限大只是算法太粗。最右邊一欄是把 $M$ 換成成長函數的那條帶問號的式子，它在 $N$ 小的時候偏鬆（大於 1），$N$ 到 500 就給出小於 5% 的數字。這一欄目前還不能當成定理使用，模擬只是讓你看到這個方向是合理的。

## 自我檢查

**1. 老闆把要求改成 $\epsilon = 0.05$、$\delta = 0.01$，假說有 $M = 1{,}000$ 個。至少要幾筆資料？**

答案：$N \ge \frac{1}{2 \times 0.0025}\ln\frac{2000}{0.01} = 200 \times \ln 200{,}000 \approx 200 \times 12.206 = 2441.2$，所以是 2,442 筆。$\epsilon$ 減半讓前面的係數變成 4 倍，影響比 $M$ 或 $\delta$ 大得多。

**2. 數線上五個點 $1.2$、$3.4$、$5.0$、$7.7$、$9.1$。positive rays、positive intervals、decision stump 各做得出幾種 dichotomy？舉出一種 positive intervals 做得出來、decision stump 做不出來的。反過來有嗎？**

答案：$5 + 1 = 6$、$\binom{6}{2} + 1 = 16$、$2 \times 5 = 10$。點的實際位置不影響答案，只要五個點都不同。positive intervals 做得出、decision stump 做不出的有 6 種，都是 ○ 那一段沒有碰到兩端的，例如 ×○○××。反過來沒有：decision stump 的 dichotomy 都是「○ 連續而且靠著某一端」或者全 ×，positive intervals 全部做得出來。

**3. 平面上四個點 $(0,0)$、$(1,0)$、$(2,0)$、$(1,2)$，前三個共線。二維感知器在這四個點上做得出幾種 dichotomy？這會改變 $m_{\mathcal{H}}(4)$ 嗎？**

答案：12 種。共線的三個點做不出「中間和兩端不同」的 ○×○ 與 ×○×，第四個點不管標什麼都救不回來，所以少了 $2 \times 2 = 4$ 種，$16 - 4 = 12$。本文用線性規劃檢查過，缺的正是這 4 種。$m_{\mathcal{H}}(4)$ 不變，還是 14，因為成長函數取所有擺法的最大值。

**4. 三點共線時二維感知器只有 6 種 dichotomy，少於 $2^3 = 8$。為什麼 3 不是它的 break point？**

判準：答案要說出 break point 的定義是「沒有任何 $k$ 個輸入能被 shatter」，等於 $m_{\mathcal{H}}(k) < 2^k$；而 $m_{\mathcal{H}}(3)$ 取最大值是 8，排成三角形的三個點可以被 shatter。只說「因為有些擺法是 8 種」而沒有連到定義裡的量詞，不算完整。

**5. 新的假說集合：數線上「positive intervals 加 negative intervals」，也就是區間裡面可以是 ○、外面 ×，也可以反過來。$N = 3$ 與 $N = 4$ 時各有幾種 dichotomy？最小 break point 是多少？**

答案：$N = 3$ 時 8 種：positive intervals 的 7 種加上原本做不出來的 ○×○（用 negative interval 把中間那點圈起來）。$N = 4$ 時 14 種：positive 的 11 種和它們的反相 11 種，其中 decision stump 做得出來的那 $2N = 8$ 種兩邊都有，$22 - 8 = 14$。做不出來的是 ○×○× 與 ×○×○，需要切三刀。$m(3) = 8 = 2^3$、$m(4) = 14 < 16$，最小 break point 是 4。照同樣的算法，一般式是 $2\big(\frac{1}{2}N^2 + \frac{1}{2}N + 1\big) - 2N = N^2 - N + 2$。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把這堂的四支影片列為「required watching (before class)」，下一堂的四支則列在 W4（09/30）的「suggested watching (anytime)」。Fall 2026 另外為這堂新增了 3 頁的 [05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf)，補了兩個成長函數的例子：一個是 decision stump 的 $2N$（Fun Time 那一題），另一個是通過原點的二維感知器，成長函數也是 $2N$，做法是把點正規化到單位半圓上，再用掃角度的方式化約成 decision stump。

**教科書。** 依 [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)，這堂對應 [Learning from Data](http://amlbook.com)（LFD）的 2.0 與 2.1.1。[Caltech Learning from Data](https://work.caltech.edu/telecourse) 用的是同一本教科書，它的 Lecture 5 也叫 Training versus Testing，可以當英文對照。

**作業。** [Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) 在 2024-09-23 發布、10-07 截止，滿分 200 分另有 20 分 bonus，題目涵蓋第 4 到第 7 堂，沒有官方解答。用這堂的工具就能動手的是：

- **Q1**：只允許斜率 1 或 −1 的二維感知器，$N \ge 4$ 時的成長函數。
- **Q3**：一定要通過點 $(11, 26)$ 的二維感知器的成長函數。可以先讀 05e 裡「過原點的感知器化約成 decision stump」那一頁。
- **Q10–12**：decision stump。Q10 證明在指定的雜訊資料分布下 $E_{\text{out}}(h_{s,\theta}) = u + v \cdot \lvert\theta\rvert$；Q11 實作一維 decision stump 演算法，在 $N = 12$、雜訊 15% 下重複 2,000 次，畫 $(E_{\text{in}}, E_{\text{out}})$ 散佈圖；Q12 改成隨機挑假說再比一次。Q11 與 Q12 的資料由程式自己產生，兩張圖放在一起看「挑 $E_{\text{in}}$ 最小的假說」和「隨便挑一個」的 $E_{\text{out}} - E_{\text{in}}$ 差多少，可以用 Q10 推出的公式驗算模擬結果。

Q4 與 bonus 的 Q13 要用到[基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)的 VC 維度，Q2、Q6、Q7 是上一堂的多 bin 抽樣題。Fall 2026 的 hw2 依課程頁排程在 10/07 公布，2026-09-30 查詢時還沒公開。整份作業的導讀在[基石作業](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。影片與講義都免費公開；作業 PDF 也公開，但沒有官方解答，批改只限修課生。

**動手做。** 拿一張紙畫 4 個點，親手找出二維感知器切不出來的那兩種組合；再把其中三點移到共線，數數看剩幾種。這是這幾堂理論裡最具體的一個畫面。

**延伸閱讀。** [Stanford CS229 第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)用另一條路線談訓練與測試的差距，可以對照。

**下一堂。** [基石第 6 堂：泛化理論](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization)證明這堂的猜想：只要有 break point，成長函數就被一個多項式壓住，並且把不等式上的問號拿掉。

## 課程影片來源

原始影片：[Recap and Preview](https://www.youtube.com/watch?v=4aIAxH8eBMs)、[Effective Number of Lines](https://www.youtube.com/watch?v=oAW0_j8_l3Y)、[Effective Number of Hypotheses](https://www.youtube.com/watch?v=dnVofdAomWY)、[Break Point](https://www.youtube.com/watch?v=z3TpJRqPzcg)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。把嵌入的 Caltech 講座（另一門課）換成林軒田本人的「Effective Number of Lines」；Caltech 影片保留文字連結。
- 2026-10-13：原本與第 6 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。

## 參考資料

- [基石第 5 堂講義 05_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf)：本文的主要底本，四節的定義、四個成長函數、break point 與四題 Fun Time 都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Fall 2026 的 05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf)：decision stump 成長函數的另一種算法，以及過原點二維感知器的例子。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：這堂影片的課前觀看安排與 hw2 的排程。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應的 LFD 章節。
- [Fall 2024 Homework 2（hw2_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)：Q1、Q3、Q10–12 的題目內容。
- [Learning from Data 教科書網站](http://amlbook.com)：2.0 與 2.1.1 的出處。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：同一本教科書的英文課程，Lecture 5 同名。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
