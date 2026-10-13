---
title: "泛化理論：一個 break point 怎麼把成長函數壓成多項式｜台大林軒田 機器學習基石 第 6 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, vc-bound]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 6
tldr: "假說集合只要有 break point k，N 個點上最多能產生的 dichotomy 數 B(N, k) 就滿足 B(N, k) ≤ B(N−1, k) + B(N−1, k−1)，由此推出 B(N, k) ≤ C(N, 0) + … + C(N, k−1)，最高次是 N 的 k−1 次方。再用三個步驟把成長函數放進 Hoeffding，得到 VC bound：壞事機率 ≤ 4·m_H(2N)·exp(−ε²N/8)。二維感知器的 break point 是 4，所以學得起來。"
description: "台大林軒田機器學習基石第 6 堂 Theory of Generalization 導讀：break point 對成長函數的限制、上限函數 B(N, k) 的表格與遞迴式、用數學歸納法證明多項式上界、VC bound 的三步圖解證明，四題 Fun Time 逐題解釋並附驗算。"
draft: false
glossary:
  - term: "上限函數"
    aliases: ["bounding function", "B(N, k)"]
    definition: "在「任何 k 個點都不能被 shatter」的前提下，N 個點上最多能同時存在幾種 dichotomy。它是純排列組合的量，不看假說集合的細節。"
    context: "基石第 6 堂用它當成長函數 m_H(N) 的上界，再證明它被 N 的 k−1 次多項式壓住。"
    links:
      - label: "第 6 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf"
  - term: "VC bound"
    aliases: ["Vapnik-Chervonenkis bound", "VC 上界"]
    definition: "P[存在 h 使 |E_in(h) − E_out(h)| > ε] ≤ 4·m_H(2N)·exp(−ε²N/8)。它把有限假說版 Hoeffding 裡的 M 換成成長函數，常數也跟著變。"
    context: "基石第 6 堂最後一節用三個步驟說明每個常數從哪裡來。"
    links:
      - label: "第 6 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf"
  - term: "ghost data"
    aliases: ["D′", "verification set"]
    definition: "證明時想像再抽出來的另一份 N 筆資料 D′，用它算出的 E′_in 來代替無法只靠有限個點決定的 E_out。它不是真的存在的資料。"
    context: "VC bound 證明的第一步。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [06_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/27 到 27/27），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 6 堂。講義第 1 頁的 Roadmap 把它放在四大問題的第二個 Why Can Machines Learn? 底下，接在[基石第 5 堂：訓練與測試](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)之後。上一堂的結論在同一頁上是一行帶著「(wishfully)」的話：訓練時「有得選」的代價，希望能用帶有 break point 的成長函數 $m_{\mathcal{H}}(N)$ 來算。這堂要把這個希望變成定理。課堂上開場把 generalization 白話說成舉一反三，並把今天要回答的事拆成兩題：

1. 成長函數 $m_{\mathcal{H}}(N)$ 會不會長得夠慢？
2. 如果夠慢，它能不能取代 Hoeffding 不等式裡那個可能是無限大的 $M$？

前三節回答第一題，最後一節回答第二題。

先備是上一堂的四個名詞：dichotomy（假說在 $N$ 個點上畫出的一種 ○× 組合）、成長函數（$N$ 個點上最多幾種 dichotomy）、shatter（某 $k$ 個點上 $2^k$ 種組合全部出現）、break point（任何 $k$ 個點都無法被 shatter 的那個 $k$），以及[基石第 4 堂：學習可行嗎](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)的 Hoeffding 不等式與 union bound。數學上只用到組合數 $\binom{N}{i}$ 與數學歸納法。讀完之後，你應該能自己填出上限函數 $B(N, k)$ 的表格、從頭推出遞迴不等式與多項式上界，並說出 VC bound 裡的 4、$2N$、$\frac{1}{8}$ 三個常數各自來自證明的哪一步。

## 一個 break point 對更多點的情形限制了多少

```youtube
url: https://www.youtube.com/watch?v=rUFqB5Z3YHQ
title: Theory of Generalization :: Restriction of Break Point @ Machine Learning Foundations (機器學習基石)
```

（影片 00:17–04:50 回顧成長函數與四個例子，04:50–11:22 是三個點的實驗，11:22–13:11 講這一節得到的想法，之後是 Fun Time。）

### 回顧：四個假說集合的 break point

講義第 2 頁把上一堂算過的四個例子列在一起：

| 假說集合 | 成長函數 | 無法產生的組合 | break point |
|---|---|---|---|
| positive rays | $m_{\mathcal{H}}(N) = N + 1$ | 兩個點排成 ○× | 2（$m_{\mathcal{H}}(2) = 3 < 2^2$） |
| positive intervals | $m_{\mathcal{H}}(N) = \frac{1}{2}N^2 + \frac{1}{2}N + 1$ | 三個點排成 ○×○ | 3（$m_{\mathcal{H}}(3) = 7 < 2^3$） |
| convex sets | $m_{\mathcal{H}}(N) = 2^N$ | 沒有 | 沒有 |
| 2D perceptrons | 某些 $N$ 上小於 $2^N$ | 四個點、對角同號 | 4（$m_{\mathcal{H}}(4) = 14 < 2^4$） |

課堂上把 break point 稱為露出一線曙光的點：成長函數到這裡第一次比 $2^N$ 小。二維感知器的成長函數長什麼樣子，上一堂沒有算出來，只知道它的 break point 在 4。

上一堂已經知道 $k$ 是 break point 的話，$k+1$、$k+2$、⋯⋯也都是。講義在頁尾問：what else？一個 break point 對更多點的情形，還多限制了什麼？

### 實驗：最小 break point 是 2，三個點最多幾種

第 3 頁做一個思考實驗。假設只知道某個假說集合的最小 break point 是 $k = 2$，其他什麼都不知道。

- $N = 1$：$m_{\mathcal{H}}(1) = 2$。課堂上的理由是，最小的 break point 在 2，表示 1 還不是 break point，一個點可以被 shatter。
- $N = 2$：$m_{\mathcal{H}}(2) < 4$，這是 break point 的定義，所以最多 3 種。
- $N = 3$：最多幾種？

「$k = 2$」在三個點上的意思是：$(\mathbf{x}_1, \mathbf{x}_2)$、$(\mathbf{x}_1, \mathbf{x}_3)$、$(\mathbf{x}_2, \mathbf{x}_3)$ 這三組，每一組都不能出現 ○○、○×、×○、×× 全部四種。課堂上把它當成一個益智問題：一種一種把 dichotomy 加進來，每加一種就檢查有沒有違反條件。講義用九張投影片（頁碼都是 3）把過程畫出來，整理成下表：

| 目前收進來的 dichotomy（$\mathbf{x}_1\mathbf{x}_2\mathbf{x}_3$） | 有哪兩個點被 shatter | 可以嗎 |
|---|---|---|
| ○○○ | 沒有（只有 1 種，湊不出 4 種） | 可以 |
| ○○○、○○× | 沒有 | 可以 |
| ○○○、○○×、○×○ | 沒有 | 可以 |
| ○○○、○○×、○×○、○×× | $(\mathbf{x}_2, \mathbf{x}_3)$：○○、○×、×○、×× 都出現 | 不行 |
| ○○○、○○×、○×○、×○○ | 沒有 | 可以 |
| 第五列的四種再加 ×○× | $(\mathbf{x}_1, \mathbf{x}_3)$ | 不行 |
| 第五列的四種再加 ××○ | $(\mathbf{x}_1, \mathbf{x}_2)$ | 不行 |
| 第五列的四種再加 ××× | $(\mathbf{x}_1, \mathbf{x}_2)$（投影片標的是這一組；另外兩組其實也被 shatter） | 不行 |

課堂上補了一個省力的觀察：兩個點要被 shatter，至少需要四種不同的 dichotomy，所以收到三種為止不必檢查，一定沒事。

以第五列為例自己驗一次。四種 dichotomy 在 $(\mathbf{x}_1, \mathbf{x}_2)$ 上是 ○○、○○、○×、×○，只有三種不同的；在 $(\mathbf{x}_1, \mathbf{x}_3)$ 上是 ○○、○×、○○、×○，三種；在 $(\mathbf{x}_2, \mathbf{x}_3)$ 上是 ○○、○×、×○、○○，三種。三組都缺 ××，所以沒有任何兩個點被 shatter。

三個點總共只有 $2^3 = 8$ 種 dichotomy。第五列用掉四種，剩下 ○××、×○×、××○、×××，表中後三列加上第四列（○×× 會讓 $(\mathbf{x}_2, \mathbf{x}_3)$ 被 shatter）說明這四種一個都加不進去。講義最後一張投影片的結論是 maximum possible so far: 4 dichotomies，三個欄位底下各畫一個哭臉。課堂上說，前面那四種也許還能換成別的組合，但不管怎麼換，四種就是極限。老師也提醒這個數字的意思：實際的假說集合產生的不一定是這四種，也可能比四種少；4 是在「任兩點不能 shatter」這個條件下的最大值。

本文驗算：用 Python 把 8 種 dichotomy 的 $2^8$ 個子集合全部檢查一遍，滿足「任兩點不被 shatter」的子集合最多含 4 種，而且達到 4 種的不只講義那一組。另一個容易看懂的例子是 positive rays 本身：三個由左到右的點上，它產生 ○○○、×○○、××○、×××，剛好 4 種。

### 這個實驗帶出的想法

第 4 頁把三個數字排在一起：

| $N$ | 最多幾種（$k = 2$） | 沒有限制時 |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 3 | 4 |
| 3 | 4 | 8 |

$N = 2$ 時 3 跟 4 只差一點，$N = 3$ 時 4 跟 8 就差了一半。講義的說法是 break point $k$ restricts maximum possible $m_{\mathcal{H}}(N)$ a lot for $N > k$；課堂上的解釋是，點變多之後，每一種 $k$ 個點的組合都要加上「不能 shatter」這個條件。$N = 3$ 時要同時守住的就有三組兩個點。

由此得到這堂課的路線（第 4 頁）：

$$
m_{\mathcal{H}}(N) \ \le\ \text{maximum possible } m_{\mathcal{H}}(N) \text{ given } k \ \le\ \text{poly}(N)
$$

成長函數跟假說集合的細節有關，很難直接算。中間那個量只跟 $k$ 有關。如果能證明中間那個量是 $N$ 的多項式，任何有 break point 的假說集合就都被多項式壓住了。

### Fun Time：連一個點都不能 shatter

**題目（第 5 頁）：** 最小 break point 是 $k = 1$ 時，$N = 3$ 的 $m_{\mathcal{H}}(N)$ 最多可能是多少？

1. 1
2. 2
3. 4
4. 8

**答案：1。** $k = 1$ 表示連一個點都不能被 shatter，也就是每一個點上不能同時出現 ○ 和 ×。把 dichotomy 一列一列排成表格，這等於說每一「欄」只能有一種符號。講義的解答旁邊畫了兩列 ○×○ 與 ○××：這兩列在 $\mathbf{x}_3$ 那一欄一個是 ○、一個是 ×，$\mathbf{x}_3$ 就被 shatter 了。課堂上的說法是，第二種 dichotomy 跟第一種總要在某個點上不一樣，那個點上就同時有 ○ 和 ×，違反條件。所以只能有 1 種。

另外三個選項（2 種、4 種、8 種）都至少有兩種 dichotomy，都逃不過上面的論證。這個結果跟 $N$ 是 3 無關，任何 $N$ 都一樣，後面填 $B(N, k)$ 的表格時會用到。

## 把「最多幾種」定義成上限函數，先填好填的格子

```youtube
url: https://www.youtube.com/watch?v=OmRekto9rkc
title: Theory of Generalization :: Bounding Function: Basic Cases @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:26 定義上限函數，02:26–05:58 填表格的邊界，之後是 Fun Time。）

### 上限函數 B(N, k) 的定義

講義第 6 頁給「maximum possible」一個名字。**上限函數（bounding function）** $B(N, k)$ 是 break point 為 $k$ 時，$m_{\mathcal{H}}(N)$ 最大可能的值。

講義強調它是一個排列組合的量（combinatorial quantity）：由 ○ 與 × 組成、長度是 $N$ 的向量，最多能收幾個，使得任何長度為 $k$ 的子向量都沒有被 shatter。課堂上的講法是把向量的某些維度遮起來，只看其中 $k$ 個維度，不管看哪 $k$ 個，都不能看到全部 $2^k$ 種組合。

這個定義完全沒提到假說集合。講義舉的例子是 $B(N, 3)$ 同時管住兩個長得很不一樣的集合：positive intervals 的 break point 是 3，一維感知器（1D perceptrons）的 break point 也是 3。課堂上說，這樣就不必分別研究區間怎麼分析、感知器怎麼分析，只要拿 break point 這一個數字去查 $B$。

前面三個點的實驗得到的結果，用新的記號寫是 $B(2, 2) = 3$、$B(3, 2) = 4$。新的目標（第 6 頁）：

$$
B(N, k) \le \text{poly}(N) \ ?
$$

### 填表：四種不用花力氣的格子

第 7 到 10 頁把 $B(N, k)$ 排成一張表，列是 $N$、欄是 $k$，一步一步填。

**已知的兩格（第 7 頁）。** $B(2, 2) = 3$，$B(3, 2) = 4$。

**第一欄，$k = 1$（第 8 頁）。** $B(N, 1) = 1$，就是剛才 Fun Time 的結論。

**右上角，$N < k$（第 9 頁）。** $B(N, k) = 2^N$。點數比 $k$ 還少，根本挑不出 $k$ 個不同的點來檢查，課堂上說這時「任何 $k$ 個點不能 shatter」這個條件有寫跟沒寫一樣，所以 $2^N$ 種全部可以收。

**對角線，$N = k$（第 10 頁）。** $B(N, k) = 2^N - 1$。這時候能挑的 $k$ 個點只有一組，就是全部 $N$ 個點。它們不能被 shatter，所以不能是 $2^N$ 種；隨便拿掉一種，剩下 $2^N - 1$ 種就不算 shatter 了，而且不可能更多。課堂上用已經算過的數字對照：兩個點是 4 種不行、減一種得 3；三個點是 8 種不行、減一種得 7。

填完之後的表（第 10 頁）：

| $N$（列）／$k$（欄） | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 2 | 2 | 2 |
| 2 | 1 | 3 | 4 | 4 | 4 | 4 |
| 3 | 1 | 4 | 7 | 8 | 8 | 8 |
| 4 | 1 | | | 15 | 16 | 16 |
| 5 | 1 | | | | 31 | 32 |
| 6 | 1 | | | | | 63 |

講義在頁尾寫 more than halfway done。課堂上補了一句：還沒填的那一塊才是重頭戲。在表上那是左下角，也就是 $N > k$ 的格子。（本文補充：對學習有用的正是這一塊，因為實際問題裡資料量 $N$ 遠大於 break point $k$。）

### Fun Time：二維感知器與 B(4, 4)

**題目（第 11 頁）：** 對二維感知器，下列哪一個敘述是對的？

1. 最小 break point $k = 2$
2. $m_{\mathcal{H}}(4) = 15$
3. $N = k =$ 最小 break point 時，$m_{\mathcal{H}}(N) < B(N, k)$
4. $N = k =$ 最小 break point 時，$m_{\mathcal{H}}(N) > B(N, k)$

**答案：3。** 二維感知器的最小 break point 是 4，$m_{\mathcal{H}}(4) = 14$；查表 $B(4, 4) = 2^4 - 1 = 15$。$14 < 15$。

其他選項：選項 1 錯，因為兩個點、三個點（不共線）都能被直線 shatter，2 和 3 都不是 break point。選項 2 把 14 寫成 15；四個點上直線做不出來的是兩種對角同號的組合，$16 - 2 = 14$。選項 4 不可能發生，$B(N, k)$ 的定義就是「最大可能的 $m_{\mathcal{H}}(N)$」，成長函數不會超過它。

這題要帶走的訊息在講義解答的最後一句：上限函數可以是鬆的（loose）。$B(4, 4) = 15$ 只說「拿掉一種就合法」，二維感知器因為幾何上的原因實際少了兩種。課堂上的說法是，$B$ 是成長函數的上限，等號不一定成立。

## 剩下的格子：把 B(4, 3) 拆回上一列

```youtube
url: https://www.youtube.com/watch?v=6jtWUmaBqFU
title: Theory of Generalization :: Bounding Function: Inductive @ Machine Learning Foundations (機器學習基石)
```

（影片 00:01–02:18 用程式找出 $B(4, 3)$，02:18–08:17 把 11 種 dichotomy 分組並得到兩條不等式，08:17–10:00 推廣成遞迴式與填表，10:00–12:20 是多項式上界的定理，12:20–13:58 回頭檢查三個例子，之後是 Fun Time。YouTube 上這支影片的標題寫 Inductive，講義上這一節的名稱是 Bounding Function: Inductive Cases。）

### 先看答案：B(4, 3) 是 11

第 12 頁挑表上空著的 $B(4, 3)$ 當例子。動機是：四個點、任三點不能 shatter，跟「三個點」的那一列應該有關係，因為四個點遮掉一個就是三個點。目標是把 $B(4, 3)$ 化約到 $B(3, ?)$。

怎麼化約不容易直接看出來，所以課堂上先把答案找出來再觀察。老師說自己是資訊系出身的，就寫一支小程式：長度 4 的 ○× 向量有 16 種，從裡面挑若干個當成一組 dichotomy，檢查有沒有任三點被 shatter，找出最大的一組。要檢查的組合有 $2^{16}$ 個，講義寫成 $2^{2^4}$，對電腦來說很快。第 13 頁列出贏家，一共 11 種：

| 編號 | $\mathbf{x}_1$ | $\mathbf{x}_2$ | $\mathbf{x}_3$ | $\mathbf{x}_4$ |
|---|---|---|---|---|
| 01 | ○ | ○ | ○ | ○ |
| 02 | × | ○ | ○ | ○ |
| 03 | ○ | × | ○ | ○ |
| 04 | ○ | ○ | × | ○ |
| 05 | ○ | ○ | ○ | × |
| 06 | × | × | ○ | × |
| 07 | × | ○ | × | ○ |
| 08 | × | ○ | ○ | × |
| 09 | ○ | × | × | ○ |
| 10 | ○ | × | ○ | × |
| 11 | ○ | ○ | × | × |

所以 $B(4, 3) = 11$。表上 $B(4, 3)$ 的正上方是 $B(3, 3) = 7$，左上方是 $B(3, 2) = 4$，而 $4 + 7 = 11$。課堂上說，這不能只當成湊數字的遊戲，要說 11 是 4 加 7，得講出理由。

本文驗算：照同樣的做法用 Python 窮舉 $2^{16} = 65{,}536$ 個子集合，最大的合法子集合確實含 11 種，講義這一組通過檢查。達到 11 種的子集合不只這一組（後面會看到 positive intervals 在四個點上的 11 種就是另一組），下面的論證對任何一組都成立。

### 按最後一個點分成「成對」與「落單」

第 14 頁把 11 列重新排過。分組的依據是前三個點 $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3)$ 的樣子：

- **成對（投影片上的橘色）**：前三碼相同，$\mathbf{x}_4$ 一個是 ○、一個是 ×。有 01 與 05（○○○）、02 與 08（×○○）、03 與 10（○×○）、04 與 11（○○×），共 4 對、8 列。
- **落單（紫色）**：前三碼在整張表裡只出現一次。有 06（××○，$\mathbf{x}_4$ 是 ×）、07（×○×，$\mathbf{x}_4$ 是 ○）、09（○××，$\mathbf{x}_4$ 是 ○），共 3 列。

課堂上的用語是成雙成對與形單影隻。把成對的組數記成 $\alpha$、落單的個數記成 $\beta$（第 15 頁）：

$$
B(4, 3) = 11 = 2\alpha + \beta, \qquad \alpha = 4,\ \beta = 3
$$

### 第一條不等式：遮掉 x₄ 之後

把 $\mathbf{x}_4$ 那一欄遮起來，只看前三個點（第 15 頁）。每一對的兩列變成同一列，算一種；落單的各算一種。所以前三個點上有 $\alpha + \beta$ 種不同的 dichotomy：

| 來源 | 在 $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3)$ 上的樣子 |
|---|---|
| $\alpha$（成對的前三碼） | ○○○、×○○、○×○、○○× |
| $\beta$（落單的前三碼） | ××○、×○×、○×× |

原本的 11 列「任三點不能 shatter」，$(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3)$ 當然是其中一組三點。所以這 $\alpha + \beta$ 種在三個點上也不能 shatter 這三個點，它們的數量不會超過「三個點、任三點不能 shatter」的最大值：

$$
\alpha + \beta \le B(3, 3)
$$

這個例子裡 $4 + 3 = 7 = B(3, 3)$，剛好等號。

### 第二條不等式：只看成對的那一半

再做一次，這次除了遮掉 $\mathbf{x}_4$，還把落單的丟掉，只留 $\alpha$ 那四種（第 16 頁）。講義宣稱：這 $\alpha$ 種在前三個點上，任「兩」點都不能被 shatter。

理由用反證法。假設 $\alpha$ 那幾種 shatter 了前三點中的某兩個，比方說 $(\mathbf{x}_1, \mathbf{x}_2)$，也就是這兩點上 ○○、○×、×○、×× 都出現。$\alpha$ 裡的每一種在原表中都有 $\mathbf{x}_4$ 是 ○ 與 $\mathbf{x}_4$ 是 × 的兩個版本，於是 $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_4)$ 上就有 $4 \times 2 = 8$ 種組合全部出現，三個點被 shatter 了，跟原本的條件矛盾。課堂上說得很直接：兩個點被 shatter，配上成雙成對的 $\mathbf{x}_4$，就是三個點被 shatter，我們就死定了。所以

$$
\alpha \le B(3, 2)
$$

在這個例子裡驗證：○○○、×○○、○×○、○○× 這四種，任兩個點上都只出現 ○○、○×、×○ 三種，缺 ××。$\alpha = 4 = B(3, 2)$，也是等號。這四種還剛好就是前面三個點的實驗裡留到最後的那一組，只是列的順序不同。

第一條不等式用的是「遮掉一個點，條件裡的 $k$ 不變」；第二條多用了成對的資訊，換到一個更嚴的條件，$k$ 降了 1。兩條缺一不可：只有第一條的話，得到的是 $B(4, 3) = 2\alpha + \beta \le 2(\alpha + \beta) \le 2B(3, 3)$，每多一個點就翻倍，上界還是指數。

### 合起來：遞迴不等式

第 17 頁把三條式子疊起來：

$$
\begin{aligned}
B(4, 3) &= 2\alpha + \beta = (\alpha + \beta) + \alpha \\
&\le B(3, 3) + B(3, 2)
\end{aligned}
$$

同一頁的第二張投影片把 4 換成 $N$、3 換成 $k$。課堂上說證明一個字都不用改，唯一的差別是那組最大的 dichotomy 不再是電腦跑出來的，而是腦袋裡想像的一組：它一定能按 $\mathbf{x}_N$ 分成成對的 $\alpha$ 組與落單的 $\beta$ 個。

$$
\begin{aligned}
B(N, k) &= 2\alpha + \beta \\
\alpha + \beta &\le B(N-1, k) \\
\alpha &\le B(N-1, k-1) \\
\Longrightarrow\ B(N, k) &\le B(N-1, k) + B(N-1, k-1)
\end{aligned}
$$

把一般情形的理由寫完整（本文補充，講義只列式子）：設 $S$ 是達到 $B(N, k)$ 的那組 dichotomy。遮掉 $\mathbf{x}_N$ 後得到 $\alpha + \beta$ 種長度 $N-1$ 的 dichotomy，前 $N-1$ 個點裡的任何 $k$ 個點本來就沒被 $S$ shatter，所以 $\alpha + \beta \le B(N-1, k)$。成對的 $\alpha$ 種如果 shatter 了前 $N-1$ 個點裡的某 $k-1$ 個，加上 $\mathbf{x}_N$ 就 shatter 了 $k$ 個點，矛盾，所以 $\alpha \le B(N-1, k-1)$。這個論證需要 $N \ge 2$、$k \ge 2$。

表格上，這條式子說的是：每一格不超過「正上方」加「左上方」。用它把左下角填滿（第 17 頁）：

| $N$（列）／$k$（欄） | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 2 | 2 | 2 |
| 2 | 1 | 3 | 4 | 4 | 4 | 4 |
| 3 | 1 | 4 | 7 | 8 | 8 | 8 |
| 4 | 1 | ≤ 5 | 11 | 15 | 16 | 16 |
| 5 | 1 | ≤ 6 | ≤ 16 | ≤ 26 | 31 | 32 |
| 6 | 1 | ≤ 7 | ≤ 22 | ≤ 42 | ≤ 57 | 63 |

逐格算一遍：$B(4, 2) \le 4 + 1 = 5$；$B(5, 2) \le 5 + 1 = 6$；$B(5, 3) \le 11 + 5 = 16$；$B(5, 4) \le 15 + 11 = 26$；$B(6, 2) \le 6 + 1 = 7$；$B(6, 3) \le 16 + 6 = 22$；$B(6, 4) \le 26 + 16 = 42$；$B(6, 5) \le 31 + 26 = 57$。注意 $B(5, 3)$ 用到的 5 本身就是上界，課堂上的說法是，從兩個上界可以再估下一個上界。老師把這一路的關係整理成一串：成長函數被上限函數壓住，上限函數被「上限的上限」壓住。

### 定理：上限函數被多項式壓住

第 18 頁的定理：

$$
B(N, k) \ \le\ \sum_{i=0}^{k-1} \binom{N}{i}
$$

講義說證明是 simple induction using boundary and inductive formula，課堂上也說這是很簡單的數學歸納法，沒有細講。下面把它寫出來（本文補上的步驟）。約定 $i > N$ 時 $\binom{N}{i} = 0$。

**$k = 1$ 的那一欄。** 右邊只有 $i = 0$ 一項，$\binom{N}{0} = 1$，而 $B(N, 1) = 1$。成立。

**$N = 1$ 的那一列。** $k = 1$ 已經看過。$k \ge 2$ 時 $B(1, k) = 2$，右邊是 $\binom{1}{0} + \binom{1}{1} + 0 + \dots = 2$。成立。

**歸納步驟。** 設 $N \ge 2$、$k \ge 2$，並假設第 $N-1$ 列的每一格都成立。用遞迴不等式，再把歸納假設代進兩項：

$$
\begin{aligned}
B(N, k) &\le B(N-1, k) + B(N-1, k-1) \\
&\le \sum_{i=0}^{k-1}\binom{N-1}{i} + \sum_{i=0}^{k-2}\binom{N-1}{i}
\end{aligned}
$$

第二個總和的指標往後移一格，寫成 $\sum_{i=1}^{k-1}\binom{N-1}{i-1}$。第一個總和把 $i = 0$ 那項單獨拿出來，剩下的跟第二個總和逐項配對：

$$
= \binom{N-1}{0} + \sum_{i=1}^{k-1}\left[\binom{N-1}{i} + \binom{N-1}{i-1}\right] = \binom{N}{0} + \sum_{i=1}^{k-1}\binom{N}{i} = \sum_{i=0}^{k-1}\binom{N}{i}
$$

中間用了兩件事：$\binom{N-1}{0} = \binom{N}{0} = 1$，以及巴斯卡三角形的恆等式 $\binom{N-1}{i} + \binom{N-1}{i-1} = \binom{N}{i}$（從 $N$ 個東西挑 $i$ 個，分成「不挑最後一個」與「挑最後一個」兩種情形）。第 $N$ 列成立，歸納完成。

遞迴不等式「上方加左上方」跟巴斯卡三角形的生成規則是同一個形狀，這就是右邊會出現組合數的原因。

**為什麼這是多項式。** $k$ 固定時，總和裡次數最高的是最後一項

$$
\binom{N}{k-1} = \frac{N(N-1)\cdots(N-k+2)}{(k-1)!}
$$

它是 $N$ 的 $k-1$ 次多項式，講義在總和底下標了 highest term $N^{k-1}$。於是（第 18 頁）：$k$ 固定時 $B(N, k)$ 被 $\text{poly}(N)$ 壓住，所以**只要 break point 存在，$m_{\mathcal{H}}(N)$ 就是多項式等級**。課堂上的結論是，成長函數只要有那個露出一線曙光的點就不用怕，最後一定是多項式。

對照表格：$k = 3$ 時 $\binom{N}{0} + \binom{N}{1} + \binom{N}{2}$ 在 $N = 4, 5, 6$ 是 $11, 16, 22$；$k = 4$ 時加上 $\binom{N}{3}$，在 $N = 5, 6$ 是 $26, 42$。跟表上的數字一致。

講義在同一頁寫：「≤」其實可以是「=」，喜歡數學的人自己去證。課堂上補充，那要證的是另一個方向（≥），用到的技巧跟這裡不一樣。本文補充一個看得出 ≥ 的方向為什麼成立的想法：把所有「× 的個數不超過 $k-1$」的向量收成一組，共有 $\sum_{i=0}^{k-1}\binom{N}{i}$ 個；任何 $k$ 個點要被 shatter，就得出現這 $k$ 個點全是 × 的向量，但那樣的向量至少有 $k$ 個 ×，不在這一組裡。$N = 4$、$k = 3$ 時這一組有 $1 + 4 + 6 = 11$ 個，本文用程式檢查過它確實沒有 shatter 任何三點。所以表上帶「≤」的數字都是真正的值。

### 套到具體的假說集合：positive intervals 的四個點

以下是本文自擬的例子，不在講義上，用來確認 $\alpha$、$\beta$ 的論證在真正的假說集合上長什麼樣子。positive intervals 的 break point 是 3，四個由左到右的點上有 $m_{\mathcal{H}}(4) = \frac{1}{2}\cdot 16 + \frac{1}{2}\cdot 4 + 1 = 11$ 種 dichotomy：全部是 ×，加上 ○ 連成一段的 $4 + 3 + 2 + 1 = 10$ 種。按前三個點分組：

| 前三碼 | $\mathbf{x}_4$ 是 ○ | $\mathbf{x}_4$ 是 × | 類別 |
|---|---|---|---|
| ××× | ×××○ | ×××× | 成對 |
| ××○ | ××○○ | ××○× | 成對 |
| ×○○ | ×○○○ | ×○○× | 成對 |
| ○○○ | ○○○○ | ○○○× | 成對 |
| ○×× | 做不出來（○ 不連續） | ○××× | 落單 |
| ×○× | 做不出來 | ×○×× | 落單 |
| ○○× | 做不出來 | ○○×× | 落單 |

$\alpha = 4$、$\beta = 3$，$2 \times 4 + 3 = 11$。成對的前三碼是 ×××、××○、×○○、○○○，任兩點上都缺 ○× 這個組合（左邊是 ○、右邊是 ×），沒有兩點被 shatter，$\alpha = 4 = B(3, 2)$。全部七種前三碼就是三個點上的 positive intervals，$\alpha + \beta = 7 = B(3, 3)$。

這個結果代表：positive intervals 在四個點上把 $B(4, 3) = 11$ 用滿了，它的 11 種跟講義程式找到的 11 種是不同的兩組，但分組之後的 $\alpha$、$\beta$ 一樣，兩條不等式也都取等號。成對的那一半之所以只受 $k - 1 = 2$ 的限制，在這裡看得很清楚：要讓最後一個點兩種符號都行，前三個點要嘛全是 ×，要嘛 ○ 一路連到右端，這正是 positive rays 那種只有一個邊界的樣子，而 positive rays 的 break point 就是 2。

### 回頭檢查三個例子

第 19 頁把定理套回開頭的例子（convex sets 沒有 break point，所以這一頁叫 The Three Break Points）：

| 假說集合 | $k$ | 真正的 $m_{\mathcal{H}}(N)$ | 定理給的上界 $\sum_{i=0}^{k-1}\binom{N}{i}$ |
|---|---|---|---|
| positive rays | 2 | $N + 1$ | $1 + N$ |
| positive intervals | 3 | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ | $1 + N + \frac{N(N-1)}{2} = \frac{1}{2}N^2 + \frac{1}{2}N + 1$ |
| 2D perceptrons | 4 | 還不知道 | $\frac{1}{6}N^3 + \frac{5}{6}N + 1$ |

前兩列上界跟真正的值一樣大。第三列的上界展開一次：

$$
1 + N + \frac{N(N-1)}{2} + \frac{N(N-1)(N-2)}{6} = 1 + N + \frac{N^2 - N}{2} + \frac{N^3 - 3N^2 + 2N}{6} = \frac{1}{6}N^3 + \frac{5}{6}N + 1
$$

$N^2$ 項是 $\frac{1}{2} - \frac{1}{2} = 0$，$N$ 項是 $1 - \frac{1}{2} + \frac{1}{3} = \frac{5}{6}$。代 $N = 4$ 得 $\frac{64}{6} + \frac{20}{6} + 1 = 15$，就是 $B(4, 4)$。

課堂上說前兩列不是重點，它們的成長函數本來就寫得出來。重要的是第三列：二維感知器的成長函數到現在還是寫不出來，但只靠「break point 是 4」這一個數字，就知道它最多長得像 $N^3$。講義頁尾的結論是 can bound $m_{\mathcal{H}}(N)$ by only one break point。

### Fun Time：一維感知器的上界鬆不鬆

**題目（第 20 頁）：** 一維感知器（正向與負向的 rays）的 $m_{\mathcal{H}}(N) = 2N$。令 $k$ 為最小 break point。下列哪一個**不是**對的？

1. $k = 3$
2. 對某些整數 $N > 0$，$m_{\mathcal{H}}(N) = \sum_{i=0}^{k-1}\binom{N}{i}$
3. 對所有整數 $N > 0$，$m_{\mathcal{H}}(N) = \sum_{i=0}^{k-1}\binom{N}{i}$
4. 對所有整數 $N > 2$，$m_{\mathcal{H}}(N) < \sum_{i=0}^{k-1}\binom{N}{i}$

**答案：3。** 講義說照定義列出來就好，這裡把它列完。

- 選項 1 是對的：$m_{\mathcal{H}}(2) = 4 = 2^2$，兩個點可以 shatter；$m_{\mathcal{H}}(3) = 6 < 8$。最小 break point 是 3。
- $k = 3$ 時上界是 $1 + N + \frac{N(N-1)}{2} = \frac{1}{2}N^2 + \frac{1}{2}N + 1$。跟 $2N$ 比：

| $N$ | $m_{\mathcal{H}}(N) = 2N$ | 上界 |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 4 | 4 |
| 3 | 6 | 7 |
| 4 | 8 | 11 |
| 5 | 10 | 16 |

- 選項 2 是對的：$N = 1$ 與 $N = 2$ 時相等。
- 選項 4 是對的：上界減掉 $2N$ 是 $\frac{1}{2}N^2 - \frac{3}{2}N + 1 = \frac{1}{2}(N-1)(N-2)$，$N > 2$ 時是正的。
- 選項 3 說每個 $N$ 都相等，$N = 3$ 就不成立（6 對 7）。

同樣是 $k = 3$，positive intervals 把上界用滿，一維感知器只有線性成長。上限函數只看 break point，對後者就很鬆。

## 成長函數怎麼換掉 M：VC bound 的三步圖解證明

```youtube
url: https://www.youtube.com/watch?v=GcxpsIvR7t8
title: Theory of Generalization :: A Pictorial Proof @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:56 說明最後的式子長什麼樣、這一節怎麼講，01:56–06:39 第一步，06:39–09:28 第二步，09:28–11:29 第三步，11:29–13:37 是 VC bound 與二維感知器，13:37–14:35 是 Fun Time，之後是總結。）

### 想要的式子與實際得到的式子

第一題有答案了：有 break point，成長函數就是多項式。第二題是把它放進 Hoeffding。基石第 4 堂對有限個假說的結果是 $\mathbb{P}[\text{BAD}] \le 2M\exp(-2\epsilon^2 N)$。最直接的願望是把 $M$ 換成 $m_{\mathcal{H}}(N)$（講義第 21 頁的 want）：

$$
\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ 2\, m_{\mathcal{H}}(N)\, \exp\big(-2\epsilon^2 N\big)
$$

課堂上說事情沒這麼簡單。實際能證的是長得差不多的版本（第 21 頁的 actually），而且要 $N$ 夠大：

$$
\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ 2 \cdot 2\, m_{\mathcal{H}}(2N) \cdot \exp\Big(-2 \cdot \frac{1}{16}\epsilon^2 N\Big)
$$

多了三個常數：前面多一個 2，$m_{\mathcal{H}}$ 的引數從 $N$ 變成 $2N$，指數裡多一個 $\frac{1}{16}$。

講義把接下來的內容叫 sketch of proof。課堂上先講清楚這一節的定位：完整的證明很技術性，老師不認為每個人都該花力氣弄懂所有數學細節，所以只交代三個常數各是哪個技巧帶出來的，底層的數學不講，有興趣的人要自己把細節寫下來。這篇照同樣的範圍寫，會補幾句講義沒寫的理由，但同樣不是嚴格的證明。

下面把 $\mathbb{P}[\exists h \in \mathcal{H} \text{ s.t. } \lvert E_{\text{in}}(h) - E_{\text{out}}(h)\rvert > \epsilon]$ 簡寫成 BAD，跟講義第 23 頁一樣。它的意思是：抽到的資料 $\mathcal{D}$ 讓假說集合裡至少一個 $h$ 的 $E_{\text{in}}$ 與 $E_{\text{out}}$ 差超過 $\epsilon$。

### 第一步：用 E′in 取代 Eout

為什麼不能直接把假說分成 $m_{\mathcal{H}}(N)$ 類再做 union bound？講義第 22 頁的第一點：$E_{\text{in}}(h)$ 只有有限多種，$E_{\text{out}}(h)$ 有無限多種。課堂上的解釋是，$E_{\text{in}}$ 只跟 $N$ 筆資料有關，兩個假說在這 $N$ 個點上的 dichotomy 一樣，$E_{\text{in}}$ 就一樣，所以最多 $m_{\mathcal{H}}(N)$ 種；$E_{\text{out}}$ 卻跟整個輸入空間有關，平面上的線稍微轉一點，$E_{\text{out}}$ 就不一樣。也就是說，兩個 $E_{\text{in}}$ 相同的假說 $E_{\text{out}}$ 仍然不同，BAD 會不會發生也就可能不同，沒辦法歸成同一類。講義把 $E_{\text{out}}$ 稱為 evil，要先把它換掉。

換法是再抽一份大小同樣是 $N$ 的資料 $\mathcal{D}'$（講義稱 verification set），在上面算出 $E'_{\text{in}}(h)$，用它代替 $E_{\text{out}}(h)$。課堂上說這就是之前講過的 verification：要用有限個點知道 $E_{\text{out}}$ 大概是多少，就另外拿一批資料來估。$\mathcal{D}'$ 通常叫 ghost data；課堂上強調它不是真的存在的資料，只是想像再抽一次會怎麼樣。

講義這一頁的圖是一條鐘形曲線，畫的是 $E_{\text{in}}$ 與 $E'_{\text{in}}$ 的機率分布，中心在 $E_{\text{out}}$。$E_{\text{in}}$ 標在右邊的尾巴上，離中心很遠，這是 BAD 發生的情形；中心線左邊那一半塗了顏色，$E'_{\text{in}}$ 標在那一側。課堂上的講法是：各種資料集算出來的 $E_{\text{in}}$ 大致以 $E_{\text{out}}$ 為中心，有的遠一點、有的近一點；如果 $E_{\text{in}}$ 離 $E_{\text{out}}$ 很遠，再抽一次得到的 $E'_{\text{in}}$ 有很大的機會跟 $E_{\text{in}}$ 也隔得很遠，老師說圖上畫的有點像超過二分之一的機會。照圖來讀（本文的讀法）：$E'_{\text{in}}$ 落在 $E_{\text{out}}$ 的另一側時，它離 $E_{\text{in}}$ 比 $E_{\text{out}}$ 還遠。講義寫成 BAD $h$ of $E_{\text{in}} - E_{\text{out}}$ 以很高的可能（probably）推得 BAD $h$ of $E_{\text{in}} - E'_{\text{in}}$。寫成式子：

$$
\frac{1}{2}\,\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ \mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E'_{\text{in}}(h)\big\rvert > \frac{\epsilon}{2}\Big]
$$

跟原式比，改了三個地方：$E_{\text{out}}$ 換成 $E'_{\text{in}}$；左邊多一個 $\frac{1}{2}$，課堂上說它對應到剛才那個「很大的機會」，因為不是一定會發生；門檻從 $\epsilon$ 變成 $\frac{\epsilon}{2}$，課堂上只說這是數學上的需要。

本文補充 $\frac{\epsilon}{2}$ 與「$N$ 夠大」的來源（講義與課堂都沒有展開）。假設 $\mathcal{D}$ 讓某個 $h$ 出事，$\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\rvert > \epsilon$。這個 $h$ 是看了 $\mathcal{D}$ 才挑出來的，但 $\mathcal{D}'$ 是另外獨立抽的，從 $\mathcal{D}'$ 的角度看它是一個事先定好的假說，所以可以用基石第 4 堂對單一假說的 Hoeffding（把 $\epsilon$ 換成 $\frac{\epsilon}{2}$）：$\lvert E'_{\text{in}}(h) - E_{\text{out}}(h)\rvert \le \frac{\epsilon}{2}$ 的機率至少是 $1 - 2\exp(-\frac{1}{2}\epsilon^2 N)$。這件事發生時，由三角不等式

$$
\big\lvert E_{\text{in}} - E'_{\text{in}}\big\rvert \ \ge\ \big\lvert E_{\text{in}} - E_{\text{out}}\big\rvert - \big\lvert E'_{\text{in}} - E_{\text{out}}\big\rvert \ >\ \epsilon - \frac{\epsilon}{2} = \frac{\epsilon}{2}
$$

所以只要 $2\exp(-\frac{1}{2}\epsilon^2 N) \le \frac{1}{2}$，也就是 $N \ge \frac{2\ln 4}{\epsilon^2}$，原本的 BAD 一旦發生，就有至少一半的機會連帶讓新的 BAD 發生，新的 BAD 的機率因此不小於原本 BAD 機率的一半，這就是上面那條式子。$\epsilon = 0.1$ 時這個門檻是 $N \ge 278$。講義的「$N$ 夠大」沒有給數字；這裡的門檻是這個論證用到的條件，不代表完整證明採用的是同一個。門檻取 $\frac{\epsilon}{2}$ 是在留餘裕：$E'_{\text{in}}$ 自己也會偏離 $E_{\text{out}}$，允許它偏 $\frac{\epsilon}{2}$，剩下的差距仍有 $\frac{\epsilon}{2}$。

### 第二步：把假說按種類分開

把 $\frac{1}{2}$ 移到右邊（第 23 頁）：

$$
\text{BAD} \ \le\ 2\,\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E'_{\text{in}}(h)\big\rvert > \frac{\epsilon}{2}\Big]
$$

現在括號裡的事件只跟 $\mathcal{D}$ 與 $\mathcal{D}'$ 這 $2N$ 個點有關。課堂上的說法是：兩個假說如果在這 $2N$ 個點上的 dichotomy 一樣，它們的 $E_{\text{in}}$ 一樣，$E'_{\text{in}}$ 也一樣，出不出事完全同步。所以無限大的 $\mathcal{H}$ 可以分成

$$
\big\lvert \mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N, \mathbf{x}'_1, \dots, \mathbf{x}'_N) \big\rvert \ \le\ m_{\mathcal{H}}(2N)
$$

種，每種抓一個代表，對這有限多個代表做 union bound：

$$
\text{BAD} \ \le\ 2\, m_{\mathcal{H}}(2N)\ \mathbb{P}\Big[\text{fixed } h \text{ s.t. } \big\lvert E_{\text{in}}(h) - E'_{\text{in}}(h)\big\rvert > \frac{\epsilon}{2}\Big]
$$

$m_{\mathcal{H}}$ 的引數是 $2N$，因為現在看的是兩份資料合起來的點數。

講義這一頁有三張並排的小圖，每張的方框代表所有可能的資料集，$\mathcal{D}$ 是其中一點：

| 圖 | 畫了什麼 | 意思 |
|---|---|---|
| (a) Hoeffding Inequality | 方框裡一小團 | 單一個 $h$ 的壞資料只占一小塊 |
| (b) Union Bound | 很多團、彼此不重疊、塞滿方框 | 把每個 $h$ 的壞資料當成互不重疊來加，無限多個 $h$ 就蓋滿了 |
| (c) Now | 很多團疊在同一區 | 同一類的 $h$ 壞資料幾乎重疊，歸成一類只算一次 |

課堂上說，這一步的技巧跟基石第 4 堂用 union bound 時是一樣的，只是要先套用成長函數，才能把有限的個數拿出來，好好計算有多少壞事是重疊發生的。講義頁尾寫的是 use $m_{\mathcal{H}}(2N)$ to calculate BAD-overlap properly。

本文補充：每一類的代表是 $2N$ 個點定下來之後才選得出來的，所以這裡的「fixed $h$」是在這 $2N$ 個點已經給定的條件下說的。這也是第三步改用罐子來看的原因：$2N$ 個點給定之後，剩下的隨機性是「哪 $N$ 個歸 $\mathcal{D}$、哪 $N$ 個歸 $\mathcal{D}'$」。講義沒有把這層條件寫出來，這裡也只點出它，沒有把條件機率的細節寫完。

### 第三步：不放回的 Hoeffding

剩下的是對一個固定的 $h$，估計兩次抽樣的差超過 $\frac{\epsilon}{2}$ 的機率。講義第 24 頁的做法：把這 $2N$ 筆資料想成一個小罐子（small bin），從裡面抽 $N$ 筆算 $E_{\text{in}}$，留在罐子裡的 $N$ 筆算 $E'_{\text{in}}$。罐子裡 $h$ 犯錯的比例是全部 $2N$ 筆的平均，也就是 $\frac{E_{\text{in}} + E'_{\text{in}}}{2}$。因為

$$
E_{\text{in}} - \frac{E_{\text{in}} + E'_{\text{in}}}{2} = \frac{E_{\text{in}} - E'_{\text{in}}}{2}
$$

所以

$$
\big\lvert E_{\text{in}} - E'_{\text{in}}\big\rvert > \frac{\epsilon}{2} \quad\Longleftrightarrow\quad \Big\lvert E_{\text{in}} - \frac{E_{\text{in}} + E'_{\text{in}}}{2}\Big\rvert > \frac{\epsilon}{4}
$$

右邊是「樣本的比例」跟「罐子的比例」差超過 $\frac{\epsilon}{4}$，正是 Hoeffding 在處理的事。講義列出跟基石第 4 堂不同的三點：罐子比較小（只有 $2N$ 筆）、$\epsilon$ 比較小（$\frac{\epsilon}{4}$）、抽樣是不放回的（Hoeffding without replacement）。課堂上解釋不放回的意思：抽出一個橘色的，罐子裡橘色的比例就少一點，不像原本的設定每次抽的機率都不變；不過這個版本的 Hoeffding 最後的結果跟原來的一樣或類似。把 $\frac{\epsilon}{4}$ 代進 $2\exp(-2\epsilon^2 N)$ 的 $\epsilon$：

$$
\text{BAD} \ \le\ 2\, m_{\mathcal{H}}(2N) \cdot 2\exp\Big(-2\Big(\frac{\epsilon}{4}\Big)^2 N\Big)
$$

### 小罐子的數值例子

以下是本文自擬的例子，不在講義上，用來看第三步的等價關係與不等式實際的大小。取 $N = 10$，罐子裡有 $2N = 20$ 筆資料，某個固定的 $h$ 在其中 8 筆上犯錯，罐子的錯誤比例是 $\frac{8}{20} = 0.4$。隨機抽 10 筆當 $\mathcal{D}$，其中 $h$ 犯錯的有 $j$ 筆，則 $E_{\text{in}} = \frac{j}{10}$、$E'_{\text{in}} = \frac{8 - j}{10}$。取 $\epsilon = 0.8$，門檻是 $\frac{\epsilon}{2} = 0.4$ 與 $\frac{\epsilon}{4} = 0.2$。

抽到 $j$ 筆錯誤的方法數是 $\binom{8}{j}\binom{12}{10-j}$，總共 $\binom{20}{10} = 184{,}756$ 種抽法：

| $j$ | 方法數 | $\lvert E_{\text{in}} - E'_{\text{in}}\rvert$ | $\lvert E_{\text{in}} - 0.4\rvert$ | 超過門檻？ |
|---|---|---|---|---|
| 0 | 66 | 0.8 | 0.4 | 是 |
| 1 | 1,760 | 0.6 | 0.3 | 是 |
| 2 | 13,860 | 0.4 | 0.2 | 否（剛好等於） |
| 3 | 44,352 | 0.2 | 0.1 | 否 |
| 4 | 64,680 | 0 | 0 | 否 |
| 5 | 44,352 | 0.2 | 0.1 | 否 |
| 6 | 13,860 | 0.4 | 0.2 | 否（剛好等於） |
| 7 | 1,760 | 0.6 | 0.3 | 是 |
| 8 | 66 | 0.8 | 0.4 | 是 |

第三欄永遠是第四欄的兩倍，所以「第三欄大於 0.4」與「第四欄大於 0.2」挑出的是同樣四列，這就是上面那個等價關係。真正的機率是

$$
\frac{66 + 1760 + 1760 + 66}{184756} = \frac{3652}{184756} = \frac{83}{4199} \approx 0.0198
$$

第三步給的上界是 $2\exp(-2 \times 0.2^2 \times 10) = 2\exp(-0.8) \approx 0.899$。

這個結果代表兩件事。不等式成立，$0.0198 \le 0.899$。同時它很鬆，差了四十幾倍；Hoeffding 只用到「樣本平均偏離母體平均」這個一般性的事實，沒有用到這個罐子的細節。這種鬆在三個步驟裡都有，後面的 Fun Time 會看到它累積起來的效果。

### 合起來：VC bound

三步的常數乘在一起，$2 \times 2 = 4$，$2 \times \frac{1}{16} = \frac{1}{8}$，得到第 25 頁的 **Vapnik-Chervonenkis（VC）bound**：

$$
\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ 4\, m_{\mathcal{H}}(2N)\, \exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

| 步驟 | 做了什麼 | 留下的常數 |
|---|---|---|
| 1 | 用 $E'_{\text{in}}$ 取代 $E_{\text{out}}$ | 前面多一個 2，$\epsilon$ 變 $\frac{\epsilon}{2}$ |
| 2 | 把 $\mathcal{H}$ 按種類分開 | $M$ 換成 $m_{\mathcal{H}}(2N)$ |
| 3 | 不放回的 Hoeffding | 再多一個 2，$\frac{\epsilon}{2}$ 變 $\frac{\epsilon}{4}$，平方後指數裡是 $\frac{1}{8}$ |

課堂上說這是用非常「揮揮手」的方式證明的一個很重要的定理，並介紹 Vapnik 與 Chervonenkis 是機器學習理論領域裡很重要的兩個人。

同一頁接著把二維感知器代進去：break point 是 4，$m_{\mathcal{H}}(N)$ 是 $O(N^3)$。多項式乘上 $\exp(-\frac{1}{8}\epsilon^2 N)$，$N$ 夠大時指數那一項贏，壞事的機率趨近 0。講義的結論是 learning with 2D perceptrons feasible。課堂上把它接回演算法：資料夠多時，挑 $E_{\text{in}}$ 最小的那個假說，$E_{\text{out}}$ 大概也會小，所以[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 PLA 在二維的資料上真的學得到東西。老師也提醒，目前證明的只有二維，任意維度的感知器 break point 在哪裡還沒講。

### Fun Time：一萬筆資料的 VC bound

**題目（第 26 頁）：** positive rays 的 $m_{\mathcal{H}}(N) = N + 1$。取 $\epsilon = 0.1$、$N = 10{,}000$，代進 VC bound，壞事機率的上界是多少？

1. $2.77 \times 10^{-87}$
2. $5.54 \times 10^{-83}$
3. $2.98 \times 10^{-1}$
4. $2.29 \times 10^{2}$

**答案：3。** 講義只寫 simple calculation，算式如下：

- $m_{\mathcal{H}}(2N) = 2N + 1 = 20{,}001$，$4\, m_{\mathcal{H}}(2N) = 80{,}004$。
- 指數是 $-\frac{1}{8} \times 0.1^2 \times 10{,}000 = -12.5$，$\exp(-12.5) \approx 3.727 \times 10^{-6}$。
- 相乘：$80{,}004 \times 3.727 \times 10^{-6} \approx 0.298$。

其他選項（以下的對應是本文算出來的，講義沒有說明）：選項 1 是只有一個假說時的 Hoeffding，$2\exp(-2\epsilon^2 N) = 2\exp(-200) \approx 2.77 \times 10^{-87}$。選項 2 是把成長函數直接塞進原本的指數，例如 $2\, m_{\mathcal{H}}(2N)\exp(-2\epsilon^2 N) = 40{,}002 \times \exp(-200) \approx 5.54 \times 10^{-83}$，沒有把指數換成 $-\frac{1}{8}\epsilon^2 N$。選項 4 大於 1，本文沒有找到對應的算式；機率的上界超過 1 等於沒有提供資訊。

選項 1、2 跟正確答案差了八十幾個數量級，差別全在指數：$-2\epsilon^2 N = -200$ 變成 $-\frac{1}{8}\epsilon^2 N = -12.5$，縮小了 16 倍。講義的提醒是，一萬筆資料之下，這個 BAD 機率的上界並不小。課堂上的解釋是推導過程中用了很多近似，所以這個 bound 不見得那麼準；既然不準，為什麼還要花這麼大的力氣推導它，留到下一堂談。

### 把二維感知器代進去看看

以下是本文自擬的計算，不在講義上。用第 19 頁的上界 $m_{\mathcal{H}}(2N) \le \frac{1}{6}(2N)^3 + \frac{5}{6}(2N) + 1$，同樣取 $\epsilon = 0.1$：

| $N$ | $m_{\mathcal{H}}(2N)$ 的上界 | $\exp(-\frac{1}{8}\epsilon^2 N)$ | VC bound |
|---|---|---|---|
| 10,000 | 約 $1.33 \times 10^{12}$ | $3.73 \times 10^{-6}$ | 約 $1.99 \times 10^{7}$ |
| 20,000 | 約 $1.07 \times 10^{13}$ | $1.39 \times 10^{-11}$ | 約 $593$ |
| 30,000 | 約 $3.60 \times 10^{13}$ | $5.18 \times 10^{-17}$ | 約 $0.0075$ |
| 100,000 | 約 $1.33 \times 10^{15}$ | $5.17 \times 10^{-55}$ | 約 $2.8 \times 10^{-39}$ |

這個結果代表：$N = 10{,}000$ 時上界是兩千萬，遠大於 1，什麼都沒保證；$N$ 從兩萬到三萬之間，上界從 593 掉到 0.0075。逐一試算，上界第一次不超過 1 是在 $N = 25{,}711$，第一次不超過 0.05 是在 $N = 28{,}341$。多項式那一項在這段區間只變大三倍多，指數那一項卻每多一萬筆就縮小約 $2.7 \times 10^{5}$ 倍，這就是「多項式遲早輸給指數」的實際樣子。

要注意這些數字是保證所需的資料量，不是實務上學二維感知器需要的資料量。上界鬆的原因在前面都出現過：$B(N, k)$ 可以比真正的成長函數大，union bound 把重疊的壞事重複算，Hoeffding 本身也鬆。

第 27 頁的總結把四節各收成一句：break point 會限制它之後的點數；$B(N, k)$ 在 break point 為 $k$ 時壓住 $m_{\mathcal{H}}(N)$；$B(N, k)$ 是 $\text{poly}(N)$；$m_{\mathcal{H}}(N)$ 做幾個小更動之後可以取代 $M$。下一堂的預告是 how to 'use' the break point。

## 自我檢查

**1. 最小 break point 是 $k = 2$ 時，四個點最多幾種 dichotomy？寫出一組達到這個數字的 dichotomy。**

答案：遞迴不等式給 $B(4, 2) \le B(3, 2) + B(3, 1) = 4 + 1 = 5$。positive rays 在四個由左到右的點上產生 ○○○○、×○○○、××○○、×××○、×××× 共 5 種，任兩點上都缺「左 ○ 右 ×」，沒有兩點被 shatter。所以上界達得到，$B(4, 2) = 5$，也等於定理的 $\binom{4}{0} + \binom{4}{1} = 5$。（本文用程式窮舉確認最大值是 5。）

**2. 表上 $B(5, 3) \le 16$。不用程式，說明 $B(5, 3)$ 就是 16。**

答案：只要找到一組 16 種、任三點不被 shatter 的 dichotomy 就夠了。positive intervals 的 break point 是 3，$m_{\mathcal{H}}(5) = \frac{25}{2} + \frac{5}{2} + 1 = 16$，它在五個點上的 16 種 dichotomy 就是這樣的一組。上界 16 加上有人達到 16，所以相等。

**3. 推導遞迴不等式時，為什麼成對的 $\alpha$ 是跟 $B(N-1, k-1)$ 比，不是跟 $B(N-1, k)$ 比？如果只能寫 $\alpha \le B(N-1, k)$，結論會變成什麼？**

判準：答案要說出成對的每一種在 $\mathbf{x}_N$ 上 ○、× 都有，所以前 $N-1$ 個點裡只要有 $k-1$ 個被 shatter，加上 $\mathbf{x}_N$ 就湊成 $k$ 個點被 shatter；因此 $\alpha$ 受到的限制比原本嚴一級。只寫 $\alpha \le B(N-1, k)$ 的話得到 $B(N, k) \le 2B(N-1, k)$，每多一個點最多翻倍，上界仍是指數，證不出多項式。

**4. positive intervals 的 $m_{\mathcal{H}}(N) = \frac{1}{2}N^2 + \frac{1}{2}N + 1$。取 $\epsilon = 0.1$，分別算 $N = 10{,}000$ 與 $N = 20{,}000$ 的 VC bound。**

答案：$N = 10{,}000$ 時 $m_{\mathcal{H}}(20{,}000) = 200{,}010{,}001$，乘 4 是 $800{,}040{,}004$，再乘 $\exp(-12.5) \approx 3.727 \times 10^{-6}$，約 $2{,}981$，大於 1，沒有保證。$N = 20{,}000$ 時 $m_{\mathcal{H}}(40{,}000) = 800{,}020{,}001$，乘 4 是 $3{,}200{,}080{,}004$，再乘 $\exp(-25) \approx 1.389 \times 10^{-11}$，約 $0.044$。成長函數從一次變成二次，一萬筆就從 0.298 變成沒有保證，要兩萬筆才壓到 0.05 以下。

**5. 某個固定的 $h$ 在 $\mathcal{D}$ 上的 $E_{\text{in}} = 0.3$，在 $\mathcal{D}'$ 上的 $E'_{\text{in}} = 0.1$，$\epsilon = 0.3$。第三步的兩個寫法各自怎麼判斷？再說明為什麼證明的第一步非做不可。**

答案與判準：$\lvert E_{\text{in}} - E'_{\text{in}}\rvert = 0.2 > \frac{\epsilon}{2} = 0.15$；罐子的平均是 $0.2$，$\lvert 0.3 - 0.2\rvert = 0.1 > \frac{\epsilon}{4} = 0.075$。兩種寫法都判定超過，因為後者只是前者兩邊除以 2。第一步的理由要說出：$E_{\text{out}}$ 取決於整個輸入空間，兩個在 $N$ 個點上 dichotomy 相同的假說 $E_{\text{out}}$ 仍可能不同，沒辦法歸成有限多類；換成 $E'_{\text{in}}$ 之後，事件只跟 $2N$ 個點有關，才數得出 $m_{\mathcal{H}}(2N)$ 類。

## 練習與對應閱讀

**兩個學期都把這堂列為選看。** [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把這堂的四支影片列在 W4（09/30）的「suggested watching (anytime)」，上一堂的影片則是「required watching (before class)」。[Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把這堂放在「optional」，旁邊並列兩個版本：Caltech Yaser Abu-Mostafa 的[英文 Lecture 6](https://www.youtube.com/watch?v=6FWRijsmLtE)，以及林軒田的中文版四段。只想往下讀的人，帶走兩個結論就夠：有 break point 的假說集合，成長函數是多項式；VC bound 是 $4\, m_{\mathcal{H}}(2N)\exp(-\frac{1}{8}\epsilon^2 N)$。

**教科書。** 依 Fall 2024 課程頁，這堂對應 [Learning from Data](http://amlbook.com)（LFD）的 2.1.2。

**英文對照。** [Caltech Learning from Data](https://work.caltech.edu/telecourse) 的 Lecture 6 也叫 Theory of Generalization，用的是同一本教科書。

**作業。** [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) 的 bonus 題 Q13 要證 $B(N, k)$ 的下界，也就是講義第 18 頁留給讀者的「≤ 可以是 =」的另一個方向。[Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) 涵蓋基石第 4 到第 7 堂，其中算成長函數的題目放在[基石第 5 堂：訓練與測試](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)那一篇。整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**自己動手。** 這堂最值得親手做的是課堂上那支小程式：列出長度 4 的 16 種 ○× 向量，窮舉它們的 $2^{16}$ 個子集合，找出任三點不被 shatter 的最大子集合，確認是 11 種；把條件改成任兩點，確認是 5 種。純 Python 幾秒鐘就跑完。

**延伸閱讀。** [Stanford CS229 第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)用不同的路線談同一個泛化問題，可以對照。

**下一堂。** [基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)把「最大的非 break point」命名為 VC 維度，處理這堂留下的兩件事：任意維度的感知器 break point 在哪裡，以及這個很鬆的 bound 為什麼還是有用。

## 課程影片來源

原始影片：[Restriction of Break Point](https://www.youtube.com/watch?v=rUFqB5Z3YHQ)、[Bounding Function: Basic Cases](https://www.youtube.com/watch?v=OmRekto9rkc)、[Bounding Function: Inductive Cases](https://www.youtube.com/watch?v=6jtWUmaBqFU)、[A Pictorial Proof](https://www.youtube.com/watch?v=GcxpsIvR7t8)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [基石第 6 堂講義 06_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf)：本文的主要底本，四節的推導、表格、四題 Fun Time 與圖的描述都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)：官方勘誤頁，讀講義時可以對照。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：這堂在 W4 列為 suggested watching。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：這堂列為 optional，以及對應的 LFD 章節。
- [Fall 2024 Homework 3（hw3_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)：bonus 題 Q13 證上限函數的下界。
- [Fall 2024 Homework 2（hw2_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)：涵蓋基石第 4 到第 7 堂的作業。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：同一本教科書的英文課程。
- [Caltech Lecture 6（Yaser Abu-Mostafa）](https://www.youtube.com/watch?v=6FWRijsmLtE)：Fall 2024 課程頁並列的英文版 Theory of Generalization。
- [Learning from Data 教科書網站](http://amlbook.com)：2.1.2 的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
