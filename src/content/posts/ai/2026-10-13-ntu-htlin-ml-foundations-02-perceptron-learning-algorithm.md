---
title: "感知器與 PLA：一條線怎麼從錯誤裡修正出來｜台大林軒田 機器學習基石 第 2 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, perceptron, classification]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 2
tldr: "這堂課給第 1 堂的流程圖填上第一組具體內容：假說集合 H 是所有的線（感知器），演算法 A 是 PLA，看到分錯的點就把 w 加上 yₙxₙ。資料線性可分時，從 w₀ = 0 出發最多修正 R²/ρ² 次就會停；資料分不開時改用 pocket，把看過錯最少的那條線留在口袋裡。"
description: "台大林軒田機器學習基石第 2 堂 Learning to Answer Yes/No 導讀：感知器假說集合與向量形式、PLA 的修正規則、線性可分時 T ≤ R²/ρ² 的完整證明、pocket 演算法，並用四個二維點把 PLA 從 w = 0 一步一步跑到停。"
draft: false
glossary:
  - term: "感知器"
    aliases: ["perceptron"]
    definition: "把輸入的每個特徵乘上權重加總，和門檻比大小，超過輸出 +1、沒超過輸出 −1 的假說；寫成向量是 h(x) = sign(wᵀx)。在平面上每個感知器是一條線。"
    context: "基石第 2 堂選用的假說集合，也叫線性二元分類器。"
  - term: "PLA"
    aliases: ["Perceptron Learning Algorithm", "感知器學習演算法"]
    definition: "從某個 w₀ 出發，每次找一筆分錯的資料 (xₙ, yₙ)，把 w 改成 w + yₙxₙ，直到沒有分錯的資料為止。"
    context: "基石第 2 堂的學習演算法；林軒田稱它為「知錯能改」演算法。"
  - term: "linear separable"
    aliases: ["線性可分"]
    definition: "存在一個權重向量 w_f，讓每筆訓練資料都滿足 yₙ = sign(w_fᵀxₙ)，也就是一條直線（高維是超平面）能把正負例完全分開。"
    context: "PLA 保證會停下來的前提；基石第 2 堂的收斂證明只在這個條件下成立。"
  - term: "pocket algorithm"
    aliases: ["pocket 演算法", "口袋演算法"]
    definition: "PLA 的變形：照常修正錯誤，但另外把目前看過錯誤最少的權重存在「口袋」裡，跑夠多次之後回傳口袋裡的權重。"
    context: "基石第 2 堂用來處理不可分或有雜訊的資料。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [02_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 2 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，這堂還在第一個「When Can Machines Learn?」底下。上一堂（[基石第 1 堂：機器學習是什麼](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)）在同一頁上只留一行：演算法 $\mathcal{A}$ 拿資料 $\mathcal{D}$ 與假說集合 $\mathcal{H}$，得到 $g$。那張流程圖裡的 $\mathcal{H}$ 和 $\mathcal{A}$ 都還是空的框，這堂把它們填上第一組具體的內容，題目是最單純的一種：回答是或否。

先備是上一堂的五個符號（$f$、$\mathcal{D}$、$\mathcal{A}$、$\mathcal{H}$、$g$）、向量內積、向量長度與夾角的關係（$\mathbf{a}^\top\mathbf{b} = \lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\cos\theta$）。讀完之後，你應該能自己寫出 PLA、對一組小資料手算每一步的修正，並且從頭推出「資料線性可分時，PLA 最多修正 $R^2/\rho^2$ 次」這個結論，也知道資料分不開時為什麼要改用 pocket。

## 假說集合長什麼樣：把核卡規則寫成一條線

```youtube
url: https://www.youtube.com/watch?v=WlpF1Phkv28
title: Learning to Answer Yes/No :: Perceptron Hypothesis Set @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:00 回顧上一堂，03:00–07:47 講分數與門檻，07:47–10:26 是向量形式，10:26–14:15 看二維的圖，之後是 Fun Time。）

### 加權分數與門檻

講義第 2 頁把上一堂的信用卡流程圖再放一次，底下只問一句：what hypothesis set can we use? 第 3 頁給的答案是一個算分數的規則。每位申請人用一個向量 $\mathbf{x} = (x_1, x_2, \dots, x_d)$ 表示，講義舉的維度是年齡、年薪、工作年資、目前負債。每個維度乘上一個權重 $w_i$，加起來是這個人的分數：

$$
\text{分數超過門檻就核卡：} \sum_{i=1}^{d} w_i x_i > \text{threshold}; \qquad \text{沒超過就不核：} \sum_{i=1}^{d} w_i x_i < \text{threshold}
$$

課堂上拿考試來比：每一題有配分，加起來超過 60 分及格，沒超過就不及格。權重就是配分。對核卡有利的維度給正的權重，愈重要給愈大；不利的維度，課堂上舉的是欠的錢很多，權重可能是負的，或者比較小。

輸出只有兩種，講義把它們編成數字：$\mathcal{Y} = \{+1(\text{good}), -1(\text{bad})\}$。課堂上說用什麼符號都可以，選 $+1$ 和 $-1$ 是為了數學上方便：這樣一來，「超過門檻輸出好、沒超過輸出壞」就是對「分數減門檻」取正負號。

$$
h(\mathbf{x}) = \text{sign}\Big(\Big(\sum_{i=1}^{d} w_i x_i\Big) - \text{threshold}\Big)
$$

分數剛好等於門檻時 sign 是 0，講義只寫「0 ignored」。課堂上多講了兩句：這種情形很少發生，在之後的討論裡也不重要，真的碰到就當成丟銅板決定。

注意這裡寫的是小寫的 $h$。一組權重加一個門檻決定一個 $h$，換一組就是另一個 $h$，所有這種 $h$ 合起來是假說集合 $\mathcal{H}$。講義說這種假說歷史上叫作感知器（perceptron）。課堂上交代了名字的來源：它出自很早期的類神經網路研究，可以看成一個神經元的數學模型，這門課暫時不深究。

### 把門檻收進向量

每次都寫一個加總再減門檻很囉嗦。第 4 頁做了一個只改寫法、不改意思的整理：把「減門檻」看成多乘一項。

$$
\begin{aligned}
h(\mathbf{x}) &= \text{sign}\Big(\Big(\sum_{i=1}^{d} w_i x_i\Big) + \underbrace{(-\text{threshold})}_{w_0} \cdot \underbrace{(+1)}_{x_0}\Big) \\
&= \text{sign}\Big(\sum_{i=0}^{d} w_i x_i\Big) \\
&= \text{sign}\big(\mathbf{w}^\top\mathbf{x}\big)
\end{aligned}
$$

做法是給每筆資料補一個永遠等於 $+1$ 的第 0 維 $x_0$，再把 $-\text{threshold}$ 叫作 $w_0$。加總的起點從 1 改成 0，門檻就併進去了。於是 $\mathbf{x}$ 和 $\mathbf{w}$ 都是 $d+1$ 維的向量，講義稱它們是「tall」的版本（課堂上說「高高的向量」），分數減門檻就是兩個向量的內積。之後整堂課的 $\mathbf{x}$ 與 $\mathbf{w}$ 都指這個多一維的版本，一個 $\mathbf{w}$ 代表一個假說 $h$。

### 在平面上，一個感知器就是一條線

第 5 頁把 $d = 2$ 的情形畫出來。這時 $h(\mathbf{x}) = \text{sign}(w_0 + w_1 x_1 + w_2 x_2)$，圖上的東西這樣對應：

| 符號 | 圖上的樣子 |
|---|---|
| 顧客的特徵 $\mathbf{x}$ | 平面上的一個點（高維是 $\mathbb{R}^d$ 裡的點） |
| 標籤 $y$ | 點的形狀：藍色圈圈 ○ 是 $+1$，紅色叉叉 × 是 $-1$ |
| 假說 $h$ | 一條線（高維是超平面），線的一側判 $+1$，另一側判 $-1$ |

為什麼是一條線？課堂上的解釋是看 sign 在哪裡換號：括號裡的值等於 0 的地方。$w_0 + w_1 x_1 + w_2 x_2 = 0$ 是 $x_1$ 與 $x_2$ 的一次方程式，在平面上是直線。直線的一邊代進去是正的，另一邊是負的。講義的圖放了兩條不同的線切同一批點，各自把平面塗成藍色與紅色兩塊，說明不同的線會把顧客分成不同的結果。

本文補充一個之後會一直用到的幾何事實：$(w_1, w_2)$ 是這條線的法向量，指向判 $+1$ 的那一側；線到原點的距離是 $\lvert w_0\rvert$ 除以 $(w_1, w_2)$ 的長度。$\mathbf{w}$ 整個乘上一個正數，線的位置與正負兩側都不變，所以同一條線對應到無限多個方向相同的 $\mathbf{w}$。

講義的結論是 perceptrons ⇔ linear (binary) classifiers：感知器就是線性的二元分類器。

### Fun Time：垃圾信偵測器的權重

**題目（第 6 頁）：** 用感知器偵測垃圾信。每封信用關鍵字出現的頻率表示，輸出 $+1$ 代表垃圾信。一個好的感知器裡，下面哪一組關鍵字應該有很大的正權重？

1. coffee, tea, hamburger, steak
2. free, drug, fantastic, deal
3. machine, learning, statistics, textbook
4. national, Taiwan, university, coursera

**答案：2。** 講義的解釋是：權重為正的關鍵字一出現，「垃圾信分數」就增加，所以這些字應該是垃圾信裡常見的字。課堂上的說法相同，這個感知器像在算一封信的垃圾信分數，free、drug、fantastic、deal 是垃圾信常用的字，會拿到最大的權重。

其他選項的字在垃圾信與正常信裡出現的機會差不多，或者更常出現在正常信裡（對修這門課的人來說，選項 3 與 4 是課程通知會用的字），給它們很大的正權重只會把正常信推過門檻。一個小差別：講義寫的是關鍵字的「出現頻率」，課堂上口頭描述成「有出現這個字就記有、沒出現就記沒有」。兩種表示法下的推理一樣。

## 怎麼從無限多條線裡挑一條：看到錯就修正

```youtube
url: https://www.youtube.com/watch?v=1xnUlrgJJGo
title: Learning to Answer Yes/No :: Perceptron Learning Algorithm @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–04:45 講要挑什麼樣的線、為什麼難，04:45–08:38 是 PLA 的規則，08:38–10:04 是 cyclic PLA，10:04–15:49 逐步看圖，15:49–17:41 列出還沒回答的問題，之後是 Fun Time。）

### 目標：先在看過的資料上全對

$\mathcal{H}$ 是所有的線，$g$ 要選哪一條？第 7 頁分四步想：

- 想要的是 $g \approx f$。但 $f$ 未知，這件事沒辦法直接做。課堂上說，知道 $f$ 的話就收工回家了，不需要機器學習。
- 幾乎必要的條件是 $g$ 在 $\mathcal{D}$ 上接近 $f$，最理想是每一筆都對：$g(\mathbf{x}_n) = f(\mathbf{x}_n) = y_n$。課堂上的說法是，看過的資料先確定沒問題，沒看過的再說。
- 困難在 $\mathcal{H}$ 的大小是無限。課堂上說，就算只在二維，線轉來轉去也有無限多條，用笨方法一條一條試是試不完的。
- 所以換個做法：手上先有一條線 $g_0$，再去「修正」它在 $\mathcal{D}$ 上犯的錯。課堂上把這比成人的學習，一開始不太會，愈學愈會。

同一頁右邊的圖畫的就是最後這一步：一條線把右下方的一個圈圈分到紅色那一側，線上畫了幾個朝那個圈圈指的小箭頭。課堂上說，把線稍微移一下，看能不能修掉這個錯，或至少讓它錯得輕一點。

$g_0$ 用它的權重向量 $\mathbf{w}_0$ 表示。這個 $\mathbf{w}_0$ 的下標是「第 0 輪」的意思，是整個向量，跟前面「把門檻收進向量」裡代表門檻的分量 $w_0$（沒有粗體）不是同一個東西。

### PLA 的兩個步驟

第 8 頁是整個演算法。從某個 $\mathbf{w}_0$ 出發（講義說可以用 $\mathbf{0}$），對 $t = 0, 1, \dots$ 重複：

1. 找一筆 $\mathbf{w}_t$ 分錯的資料，記成 $(\mathbf{x}_{n(t)}, y_{n(t)})$。分錯的意思是

$$
\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}_{n(t)}\big) \ne y_{n(t)}
$$

2. （試著）修正這個錯誤：

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}
$$

一直做到沒有錯誤為止，把最後的 $\mathbf{w}$（稱為 $\mathbf{w}_{\text{PLA}}$）當作 $g$ 回傳。$n(t)$ 這個記號只是在說「第 $t$ 輪挑到的那一筆的編號」。

這就是 Perceptron Learning Algorithm（PLA）。講義在頁尾寫了一句 A fault confessed is half redressed；課堂上說這對應中文的「知錯能改，善莫大焉」，所以常把 PLA 叫作知錯能改演算法。初始值用 $\mathbf{0}$，課堂上的說明是它代表什麼都不知道。

### 為什麼加上 yₙxₙ 算是修正

第 8 頁右邊有兩張小圖，各畫一種犯錯的情形。先記得內積的正負由夾角決定：$\mathbf{w}^\top\mathbf{x} > 0$ 表示 $\mathbf{w}$ 與 $\mathbf{x}$ 的夾角小於 90 度，小於 0 表示夾角大於 90 度。

| 情形 | 圖上的樣子 | 修正 | 效果 |
|---|---|---|---|
| $y = +1$，但 $\mathbf{w}^\top\mathbf{x} < 0$ | $\mathbf{w}$ 與 $\mathbf{x}$ 的夾角太大 | $\mathbf{w} + \mathbf{x}$ | 新的向量落在 $\mathbf{w}$ 與 $\mathbf{x}$ 之間，轉向 $\mathbf{x}$ |
| $y = -1$，但 $\mathbf{w}^\top\mathbf{x} > 0$ | $\mathbf{w}$ 與 $\mathbf{x}$ 的夾角太小 | $\mathbf{w} - \mathbf{x}$ | 新的向量轉離 $\mathbf{x}$ |

課堂上的講法是：要正的就把 $\mathbf{w}$ 轉得靠近 $\mathbf{x}$ 一點，要負的就轉得遠離 $\mathbf{x}$ 一點。兩種情形合起來只要一條式子，因為 $y$ 自己帶著正負號：$\mathbf{w} + y\mathbf{x}$。

圖只能說方向對了，代數可以說得更準。把修正式兩邊都和 $y_n\mathbf{x}_n$ 做內積（這裡把 $n(t)$ 簡寫成 $n$）：

$$
y_n\mathbf{w}_{t+1}^\top\mathbf{x}_n = y_n(\mathbf{w}_t + y_n\mathbf{x}_n)^\top\mathbf{x}_n = y_n\mathbf{w}_t^\top\mathbf{x}_n + y_n^2\,\mathbf{x}_n^\top\mathbf{x}_n = y_n\mathbf{w}_t^\top\mathbf{x}_n + \lVert\mathbf{x}_n\rVert^2
$$

最後一步用了 $y_n^2 = 1$。$y_n\mathbf{w}^\top\mathbf{x}_n$ 這個量值得記住：它是正的，表示分數的正負號和 $y_n$ 相同，這筆分對了；它是負的或 0，表示分錯了。上面的式子說，修正之後這個量增加了 $\lVert\mathbf{x}_n\rVert^2$。因為 $x_0 = 1$，$\lVert\mathbf{x}_n\rVert^2$ 至少是 1，所以一定是往對的方向推。至於推一次夠不夠讓它變成正的，這條式子沒有保證，這也是講義在「correct」前面加「(try to)」的原因。這一段就是本節 Fun Time 的內容。

### 實作：cyclic PLA

第 8 頁的「找一筆錯誤」沒說怎麼找，「沒有錯誤」也沒說怎麼判斷。第 9 頁給一個實際的寫法，叫 cyclic PLA：把資料排成一圈，每次找「下一筆」錯誤，一直到完整繞一圈都沒有遇到錯誤才停。

課堂上用 100 筆資料說明：從 1 號看到 100 號，這一筆沒錯就看下一筆，有錯就修正；100 筆都看過、繞回來也沒再犯錯，就做完了。順序可以照資料原本的編號（講義稱 naïve cycle），也可以先用亂數排好一個順序再照著繞（precomputed random cycle）。這樣寫的好處是「還有沒有人犯錯」很容易判斷。

### 講義的示範：修正九次之後停下來

第 10 頁的標題是 Seeing is Believing，一連 11 張圖，把 PLA 在一組二維資料上的每一步畫出來。圖上有 6 個藍圈與 9 個紅叉，圈圈偏右下，叉叉偏左上。每張圖的內容如下：

| 圖 | 修正用的點 | 畫了什麼 |
|---|---|---|
| initially | | 只有資料，還沒有線 |
| update: 1 | $\mathbf{x}_1$（圈） | $\mathbf{w}_{t+1}$ 是從原點指向 $\mathbf{x}_1$ 的向量 |
| update: 2 | $\mathbf{x}_9$（圈） | 上一步的線垂直於 $\mathbf{w}_t$；$\mathbf{x}_9$ 落在紅色那一側，$\mathbf{w}$ 轉向它 |
| update: 3 | $\mathbf{x}_{14}$（叉） | 轉過頭了，遠處的一個叉叉跑到藍色那一側，$\mathbf{w}$ 轉離它 |
| update: 4 | $\mathbf{x}_3$（叉） | 另一個叉叉分錯，再轉離 |
| update: 5 到 9 | $\mathbf{x}_9$、$\mathbf{x}_{14}$、$\mathbf{x}_9$、$\mathbf{x}_{14}$、$\mathbf{x}_9$ | 線在這兩個點之間來回擺：用 $\mathbf{x}_9$ 修正後線變平，用 $\mathbf{x}_{14}$ 修正後線又變陡 |
| finally | | $\mathbf{w}_{\text{PLA}}$ 把圈圈與叉叉完全分開 |

第一步為什麼一定有錯？課堂上說，一開始 $\mathbf{w} = \mathbf{0}$，等於沒有線，看到什麼都算錯。中間來回擺的那幾步，課堂上的解釋是 PLA 一次只看一個點，修好這一個，另一個可能又跑到錯的那一側；林軒田在這裡用了一句台語俗諺，要抓龜、結果跑了鱉，意思是抓住這個點、跑走了另一個點。九次修正裡只用到 4 個不同的點，$\mathbf{x}_9$ 就被用了 4 次。

頁尾有兩行字。第一行 worked like a charm with < 20 lines：課堂上說他自己的程式不含畫圖不到 20 行。第二行是給想自己重畫這張圖的人的提醒：note: made $x_i \gg x_0 = 1$ for visual purpose。課堂上說明，他刻意讓每個特徵的數值都比 $x_0 = 1$ 大很多，畫出來比較好看；不這樣做，演算法照樣找得到線。

### 數值例子：四個點，從 w = 0 跑到停

以下是本文自擬的例子，不在講義上。四筆二維資料，照講義的做法補上 $x_0 = 1$：

| $n$ | 原本的點 | $\mathbf{x}_n = (x_0, x_1, x_2)$ | $y_n$ |
|---|---|---|---|
| 1 | $(3, 0)$ | $(1, 3, 0)$ | $+1$ |
| 2 | $(0, 3)$ | $(1, 0, 3)$ | $+1$ |
| 3 | $(1, 0)$ | $(1, 1, 0)$ | $-1$ |
| 4 | $(0, 1)$ | $(1, 0, 1)$ | $-1$ |

從 $\mathbf{w}_0 = (0, 0, 0)$ 出發，用 cyclic PLA 照 1、2、3、4 的順序繞。有一個細節要先講定：分數剛好是 0 的時候算不算錯？講義第 15 頁把「犯錯」寫成 $y_n\mathbf{w}_t^\top\mathbf{x}_n \le 0$，等號包含在內，這裡照這個寫法，分數是 0 就當作錯。不這樣規定的話，從 $\mathbf{0}$ 出發時每筆的分數都是 0，演算法一步也動不了。

第一步：看第 1 筆，$\mathbf{w}_0^\top\mathbf{x}_1 = 0$，算錯。$\mathbf{w}_1 = (0,0,0) + (+1)(1,3,0) = (1,3,0)$。

接著看第 2 筆：$\mathbf{w}_1^\top\mathbf{x}_2 = 1 + 0 + 0 = 1 > 0$，$y_2 = +1$，對。看第 3 筆：$\mathbf{w}_1^\top\mathbf{x}_3 = 1 + 3 + 0 = 4 > 0$，但 $y_3 = -1$，錯。$\mathbf{w}_2 = (1,3,0) - (1,1,0) = (0,2,0)$。

之後每一步都是同樣的算法，整理成表。「修正後還錯的點」是把新的 $\mathbf{w}_{t+1}$ 代回四筆資料檢查的結果。

| $t$ | 用的點 | $\mathbf{w}_t$ | $\mathbf{w}_t^\top\mathbf{x}_n$ | $y_n$ | $\mathbf{w}_{t+1} = \mathbf{w}_t + y_n\mathbf{x}_n$ | 修正後還錯的點 |
|---|---|---|---|---|---|---|
| 0 | 1 | $(0, 0, 0)$ | $0$ | $+1$ | $(1, 3, 0)$ | 3、4 |
| 1 | 3 | $(1, 3, 0)$ | $4$ | $-1$ | $(0, 2, 0)$ | 2、3、4 |
| 2 | 4 | $(0, 2, 0)$ | $0$ | $-1$ | $(-1, 2, -1)$ | 2、3 |
| 3 | 2 | $(-1, 2, -1)$ | $-4$ | $+1$ | $(0, 2, 2)$ | 3、4 |
| 4 | 3 | $(0, 2, 2)$ | $2$ | $-1$ | $(-1, 1, 2)$ | 3、4 |
| 5 | 4 | $(-1, 1, 2)$ | $1$ | $-1$ | $(-2, 1, 1)$ | 無 |

$\mathbf{w}_6 = (-2, 1, 1)$ 之後再繞一整圈：四筆的 $y_n\mathbf{w}_6^\top\mathbf{x}_n$ 分別是 $-2 + 3 = 1$、$-2 + 3 = 1$、$-(-2 + 1) = 1$、$-(-2 + 1) = 1$，全部是正的，演算法停下來。總共修正 6 次。

**這個結果代表什麼。** $\mathbf{w}_{\text{PLA}} = (-2, 1, 1)$ 對應的線是 $-2 + x_1 + x_2 = 0$，也就是 $x_1 + x_2 = 2$。兩個正例的 $x_1 + x_2 = 3$，在線的一側；兩個負例的 $x_1 + x_2 = 1$，在另一側。翻回信用卡的講法：兩個特徵各配 1 分，總分超過 2 才核卡。

過程裡有三件事可以對照前面的說明：

- 第 $t = 1$ 步用第 3 筆修正，修正前 $y_3\mathbf{w}^\top\mathbf{x}_3 = -4$，修正後是 $-2$。增加了 $\lVert\mathbf{x}_3\rVert^2 = 2$，方向對，但第 3 筆還是錯的。「試著修正」不保證一次修好。
- 同一步修正之後，原本分對的第 2 筆變成 $\mathbf{w}_2^\top\mathbf{x}_2 = 0$，落到線上。修一個點會動到別的點，這就是講義那組圖裡線來回擺的原因。
- 第 $t = 4$ 步之後，第 3 筆的分數是 $-1 + 1 + 0 = 0$，照上面的規定還算錯；但 cyclic PLA 下一個看的是第 4 筆，先修了它，結果第 3 筆也跟著對了。

把這個過程寫成程式，純 Python 不到 20 行：

```python
def pla(data):
    w = [0, 0, 0]
    updates, clean, i = 0, 0, 0
    while clean < len(data):              # 連續看完一整圈都沒錯才停
        x, y = data[i]
        score = sum(wj * xj for wj, xj in zip(w, x))
        if y * score <= 0:                # 分錯，或剛好落在線上
            w = [wj + y * xj for wj, xj in zip(w, x)]
            updates, clean = updates + 1, 0
        else:
            clean += 1
        i = (i + 1) % len(data)
    return w, updates

data = [((1, 3, 0), +1), ((1, 0, 3), +1), ((1, 1, 0), -1), ((1, 0, 1), -1)]
print(pla(data))                          # ([-2, 1, 1], 6)
```

執行結果是 `([-2, 1, 1], 6)`，和上表最後一列、總共 6 次修正一致。這段程式遇到分不開的資料不會停，原因在「資料分不開時怎麼辦」那一節。

### 還沒回答的兩類問題

第 11 頁把 PLA 留下的問題分成兩類，都還打著問號：

- **演算法面：它會停嗎？** 照原本編號繞的、照亂數順序繞的、其他變形，講義各寫了「??」。課堂上強調，剛才只是秀了一個例子，沒有說它一定會停。
- **學習面：$g \approx f$ 嗎？** 如果停了，在 $\mathcal{D}$ 上是的，因為沒有錯誤。在 $\mathcal{D}$ 以外呢？不停的話呢？都是「??」。

頁尾預告接下來「PLA 一定會停嗎」那一節要證明的事：if (...), after 'enough' corrections, any PLA variant halts。括號裡的條件先留白。$\mathcal{D}$ 以外的問題，課堂上說差不多要過兩堂課才談，也就是[基石第 4 堂：學習可行嗎](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)。

### Fun Time：修正規則保證了什麼

**題目（第 12 頁）：** 想想 PLA 為什麼可能有用。令 $n = n(t)$，根據 PLA 的規則

$$
\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}_n\big) \ne y_n, \qquad \mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_n\mathbf{x}_n
$$

下面哪一條一定成立？

1. $\mathbf{w}_{t+1}^\top\mathbf{x}_n = y_n$
2. $\text{sign}(\mathbf{w}_{t+1}^\top\mathbf{x}_n) = y_n$
3. $y_n\mathbf{w}_{t+1}^\top\mathbf{x}_n \ge y_n\mathbf{w}_t^\top\mathbf{x}_n$
4. $y_n\mathbf{w}_{t+1}^\top\mathbf{x}_n < y_n\mathbf{w}_t^\top\mathbf{x}_n$

**答案：3。** 講義的提示是把規則的第二部分乘上 $y_n\mathbf{x}_n$，推導就是前面「為什麼加上 yₙxₙ 算是修正」那一段：右邊多出 $\lVert\mathbf{x}_n\rVert^2 \ge 0$，所以左邊不會比較小。講義說這個結果顯示規則 somewhat 'tries to correct the mistake'。課堂上的讀法是：$\mathbf{w}^\top\mathbf{x}_n$ 是分數，乘上 $y_n$ 之後變大，表示分數的正負號和 $y_n$ 更符合了一點，可能就此全對，也可能還沒有。

其他選項用上面的數值例子就能排除。選項 1：第一步修正後 $\mathbf{w}_1^\top\mathbf{x}_1 = 1 + 9 = 10$，不等於 $y_1 = 1$；修正規則從來沒有要讓分數剛好等於 $\pm 1$。選項 2：$t = 1$ 那一步修正後，第 3 筆的分數是 $2$，正負號還是和 $y_3 = -1$ 不同。選項 4 和選項 3 方向相反，既然 $\lVert\mathbf{x}_n\rVert^2 \ge 1$，它不可能成立。

## PLA 一定會停嗎：線性可分時的保證

```youtube
url: https://www.youtube.com/watch?v=Okrrz0IYoSE
title: Learning to Answer Yes/No :: Guarantee of PLA @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:40 定義線性可分，01:40–06:17 是第一個事實，06:17–09:20 是第二個事實，09:20–10:58 把兩者合起來，之後是 Fun Time。）

### 先決條件：線性可分

PLA 停下來的時候，手上那條線在 $\mathcal{D}$ 上沒有任何錯誤。所以第 13 頁說，PLA 會停的必要條件是 $\mathcal{D}$ 允許某個 $\mathbf{w}$ 完全不犯錯。這樣的 $\mathcal{D}$ 叫作線性可分（講義寫 linear separable）。課堂上講得直接：資料根本沒有一條線切得開的話，PLA 跑一輩子也不會停。

講義用三張圖說明：

| 圖 | 資料的樣子 | 線性可分？ |
|---|---|---|
| 左 | 圈圈在右、叉叉在左，一條線分得開 | 是 |
| 中 | 大致沿對角線分成兩邊，但各有幾個點混在對面 | 否 |
| 右 | 圈圈聚在中間，叉叉圍在外面，要用圓才分得開 | 否 |

課堂上順帶提到，右邊兩張圖就是這門課 logo 上的兩個圖案，之後的課會陸續介紹處理它們的方法，這堂稍後就會先處理其中一部分的情形。

必要條件講完了，問題反過來問：假設 $\mathcal{D}$ 線性可分，PLA 一定會停嗎？

### 事實一：每修正一次，w 和 w_f 的內積至少增加一個固定的量

線性可分的意思是存在一個完美的 $\mathbf{w}_f$，讓每一筆都有 $y_n = \text{sign}(\mathbf{w}_f^\top\mathbf{x}_n)$（第 14 頁）。課堂上說下標刻意用 $f$，就把這條線想成目標函數。我們不知道 $\mathbf{w}_f$ 是多少，但證明只需要它存在。

$\mathbf{w}_f$ 把每一筆都分對，所以每一筆的 $y_n\mathbf{w}_f^\top\mathbf{x}_n$ 都是正的，沒有任何一點落在線上或錯的那一側。資料只有 $N$ 筆，這 $N$ 個正數裡最小的那個也是正的。PLA 在第 $t$ 輪挑到的那一筆是其中之一，所以

$$
y_{n(t)}\mathbf{w}_f^\top\mathbf{x}_{n(t)} \ \ge\ \min_{n} y_n\mathbf{w}_f^\top\mathbf{x}_n \ >\ 0
$$

課堂上把取到最小值的那一筆叫作「離線最近的那個人」。

現在看 $\mathbf{w}_f$ 與 $\mathbf{w}_t$ 的內積在一次修正後怎麼變。把修正規則代進去，再把內積展開：

$$
\begin{aligned}
\mathbf{w}_f^\top\mathbf{w}_{t+1} &= \mathbf{w}_f^\top\big(\mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}\big) \\
&= \mathbf{w}_f^\top\mathbf{w}_t + y_{n(t)}\mathbf{w}_f^\top\mathbf{x}_{n(t)} \\
&\ge \mathbf{w}_f^\top\mathbf{w}_t + \min_{n} y_n\mathbf{w}_f^\top\mathbf{x}_n \\
&> \mathbf{w}_f^\top\mathbf{w}_t + 0
\end{aligned}
$$

第三行用的就是上一條不等式。結論是每修正一次，內積至少增加 $\min_n y_n\mathbf{w}_f^\top\mathbf{x}_n$ 這麼多。注意這一段只用到「拿某一筆資料來修正」，沒有用到那一筆是分錯的。

內積變大，講義說 $\mathbf{w}_t$ appears more aligned with $\mathbf{w}_f$，後面接了一個「(really?)」。課堂上替數學好的同學提出質疑：內積是 $\lVert\mathbf{w}_f\rVert\lVert\mathbf{w}_t\rVert\cos\theta$，它變大可能是因為夾角變小，也可能只是因為 $\mathbf{w}_t$ 變長了。兩個內積為正的向量，把其中一個乘兩倍、三倍，內積也會變大。所以到這裡只證了一半，還得管住 $\mathbf{w}_t$ 的長度。

### 事實二：w 的長度平方每次最多增加 R²

第 15 頁用上事實一沒用到的性質，課堂上稱它是 PLA 最重要的性質：有錯才修正。講義把「分錯」改寫成一條好用的不等式：

$$
\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}_{n(t)}\big) \ne y_{n(t)} \quad\Longleftrightarrow\quad y_{n(t)}\mathbf{w}_t^\top\mathbf{x}_{n(t)} \le 0
$$

分數和 $y$ 的正負號不同，兩者相乘就不會是正的。現在把修正後的長度平方展開。$\lVert\mathbf{a} + \mathbf{b}\rVert^2 = \lVert\mathbf{a}\rVert^2 + 2\mathbf{a}^\top\mathbf{b} + \lVert\mathbf{b}\rVert^2$，取 $\mathbf{a} = \mathbf{w}_t$、$\mathbf{b} = y_{n(t)}\mathbf{x}_{n(t)}$：

$$
\begin{aligned}
\lVert\mathbf{w}_{t+1}\rVert^2 &= \lVert\mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}\rVert^2 \\
&= \lVert\mathbf{w}_t\rVert^2 + 2y_{n(t)}\mathbf{w}_t^\top\mathbf{x}_{n(t)} + \lVert y_{n(t)}\mathbf{x}_{n(t)}\rVert^2 \\
&\le \lVert\mathbf{w}_t\rVert^2 + 0 + \lVert y_{n(t)}\mathbf{x}_{n(t)}\rVert^2 \\
&\le \lVert\mathbf{w}_t\rVert^2 + \max_{n}\lVert y_n\mathbf{x}_n\rVert^2
\end{aligned}
$$

第三行：中間那一項是 2 乘上一個小於等於 0 的數，換成 0 只會讓右邊變大。第四行：這一輪用的那筆資料，長度不會超過所有資料裡最長的那一筆。$y_n$ 是 $\pm 1$，不影響長度，所以 $\lVert y_n\mathbf{x}_n\rVert^2 = \lVert\mathbf{x}_n\rVert^2$；課堂上說投影片把這裡的 $y_n$ 塗成灰色就是這個意思。

講義對這一段的總結是：mistake 'limits' $\lVert\mathbf{w}_t\rVert^2$ growth, even when updating with 'longest' $\mathbf{x}_n$。就算每次都拿最長的那一筆來修正，長度平方一次也只增加 $\max_n\lVert\mathbf{x}_n\rVert^2$。課堂上的說法是，會讓 $\mathbf{w}_t$ 成長的只有最後那一項，中間那一項不會給它任何成長。

### 兩個事實合起來：T ≤ R²/ρ²

第 15 頁底下只給了結論的形狀：從 $\mathbf{w}_0 = \mathbf{0}$ 出發，修正 $T$ 次之後，

$$
\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\frac{\mathbf{w}_T}{\lVert\mathbf{w}_T\rVert} \ \ge\ \sqrt{T}\cdot\text{constant}
$$

課堂上把中間的計算留給學生，說拿一張紙把兩頁的結果寫下來就能得到。以下把它走完。先用第 16 頁 Fun Time 的記號給兩個量取名字：

$$
R^2 = \max_{n}\lVert\mathbf{x}_n\rVert^2, \qquad \rho = \min_{n} y_n\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\mathbf{x}_n
$$

$R$ 是最長的那筆資料的長度，課堂上說有人把 $R^2$ 叫作半徑的平方。$\rho$ 是事實一裡那個最小值除以 $\lVert\mathbf{w}_f\rVert$，所以 $\min_n y_n\mathbf{w}_f^\top\mathbf{x}_n = \rho\lVert\mathbf{w}_f\rVert$，線性可分時 $\rho > 0$。

**第一步：把事實一累加 $T$ 次。** $\mathbf{w}_0 = \mathbf{0}$，所以 $\mathbf{w}_f^\top\mathbf{w}_0 = 0$。每修正一次至少增加 $\rho\lVert\mathbf{w}_f\rVert$：

$$
\mathbf{w}_f^\top\mathbf{w}_T \ \ge\ \mathbf{w}_f^\top\mathbf{w}_{T-1} + \rho\lVert\mathbf{w}_f\rVert \ \ge\ \cdots \ \ge\ \mathbf{w}_f^\top\mathbf{w}_0 + T\rho\lVert\mathbf{w}_f\rVert = T\rho\lVert\mathbf{w}_f\rVert
$$

**第二步：把事實二累加 $T$ 次。** $\lVert\mathbf{w}_0\rVert^2 = 0$，每修正一次最多增加 $R^2$：

$$
\lVert\mathbf{w}_T\rVert^2 \ \le\ \lVert\mathbf{w}_{T-1}\rVert^2 + R^2 \ \le\ \cdots \ \le\ \lVert\mathbf{w}_0\rVert^2 + TR^2 = TR^2 \quad\Longrightarrow\quad \lVert\mathbf{w}_T\rVert \le \sqrt{T}R
$$

**第三步：相除。** $T \ge 1$ 時，第一步說 $\mathbf{w}_f^\top\mathbf{w}_T > 0$，所以 $\mathbf{w}_T$ 不是零向量，可以除以它的長度。分子用第一步的下界，分母用第二步的上界（分母換成比較大的數，整個分數變小）：

$$
\frac{\mathbf{w}_f^\top\mathbf{w}_T}{\lVert\mathbf{w}_f\rVert\lVert\mathbf{w}_T\rVert} \ \ge\ \frac{T\rho\lVert\mathbf{w}_f\rVert}{\lVert\mathbf{w}_f\rVert\cdot\sqrt{T}R} = \sqrt{T}\cdot\frac{\rho}{R}
$$

講義上的 constant 就是 $\rho/R$。

**第四步：左邊不會超過 1。** 左邊是兩個長度為 1 的向量的內積，也就是 $\mathbf{w}_f$ 與 $\mathbf{w}_T$ 夾角的 $\cos\theta$，最大是 1。這回它量的真的是方向接不接近，長度的影響已經除掉了，回答了講義那個「(really?)」。於是

$$
1 \ \ge\ \sqrt{T}\cdot\frac{\rho}{R} \quad\Longrightarrow\quad \sqrt{T} \le \frac{R}{\rho} \quad\Longrightarrow\quad T \le \frac{R^2}{\rho^2}
$$

這條不等式的讀法是：只要 PLA 已經做了 $T$ 次修正，$T$ 就不可能超過 $R^2/\rho^2$。PLA 只在還有錯誤時才會繼續修正，修正的次數既然有上限，它一定會在某一刻找不到錯誤，也就是停下來，而且停的時候在 $\mathcal{D}$ 上沒有錯誤。課堂上的講法是：每修正一次就靠近一點，靠近的程度隨修正次數的根號成長，但兩個向量的內積最多是 1，不可能無限制地漲上去。

整個推導沒有用到「錯誤是怎麼挑的」。照編號繞、照亂數順序繞、每次隨便挑一筆錯的，都適用，所以第 11 頁那句預告寫的是 any PLA variant，括號裡留白的條件就是 linear separable。

本文補充三點。第一，$\rho$ 是有幾何意義的：一個點 $\mathbf{x}$ 的 $\mathbf{w}_f^\top\mathbf{x}/\lVert\mathbf{w}_f\rVert$，是它在 $\mathbf{w}_f$ 這個方向上的投影長度，所以 $\rho$ 量的是「在補了 $x_0$ 的 $d+1$ 維空間裡，離 $\mathbf{w}_f$ 決定的那個分界超平面最近的那筆資料有多遠」。課堂上在講事實一時，把還沒除以 $\lVert\mathbf{w}_f\rVert$ 的 $\mathbf{w}_f^\top\mathbf{x}_n$ 就說成帶正負號的距離，那是比較鬆的說法，嚴格講要除以長度才是。資料離分界愈遠（$\rho$ 大）、本身愈短（$R$ 小），上限愈低。第二，$\mathbf{w}_f$ 不只一個。任何一個把資料完全分對的 $\mathbf{w}_f$ 都能代進去，各自給出一個上限，全部都成立，其中 $\rho$ 最大的那個給出最緊的上限。第三，$\mathbf{w}_0 = \mathbf{0}$ 這個條件有用到：兩個累加的起點都是 0。

### 拿四個點的例子對照上限

回到前面「數值例子：四個點」自擬的那組資料。它的 $\mathbf{w}_{\text{PLA}} = (-2, 1, 1)$ 把資料完全分對，可以直接拿來當 $\mathbf{w}_f$。

- $R^2$：四筆的 $\lVert\mathbf{x}_n\rVert^2$ 是 $1 + 9 + 0 = 10$、$10$、$1 + 1 + 0 = 2$、$2$，最大是 $10$。
- $\rho$：四筆的 $y_n\mathbf{w}_f^\top\mathbf{x}_n$ 都是 $1$（跑 PLA 的那個例子最後算過），$\lVert\mathbf{w}_f\rVert = \sqrt{4 + 1 + 1} = \sqrt{6}$，所以 $\rho = 1/\sqrt{6}$，$\rho^2 = 1/6$。
- 上限：$R^2/\rho^2 = 10 \times 6 = 60$。

實際修正了 6 次，$6 \le 60$。兩個事實也可以逐步核對。下表的 $T$ 是已經修正的次數，$\mathbf{w}_T$ 取自那個例子的表：

| $T$ | $\mathbf{w}_T$ | $\mathbf{w}_f^\top\mathbf{w}_T$ | 下界 $T\rho\lVert\mathbf{w}_f\rVert = T$ | $\lVert\mathbf{w}_T\rVert^2$ | 上界 $TR^2$ | $\cos\theta$ | 下界 $\sqrt{T}\rho/R$ |
|---|---|---|---|---|---|---|---|
| 1 | $(1, 3, 0)$ | $1$ | $1$ | $10$ | $10$ | $0.129$ | $0.129$ |
| 2 | $(0, 2, 0)$ | $2$ | $2$ | $4$ | $20$ | $0.408$ | $0.183$ |
| 3 | $(-1, 2, -1)$ | $3$ | $3$ | $6$ | $30$ | $0.500$ | $0.224$ |
| 4 | $(0, 2, 2)$ | $4$ | $4$ | $8$ | $40$ | $0.577$ | $0.258$ |
| 5 | $(-1, 1, 2)$ | $5$ | $5$ | $6$ | $50$ | $0.833$ | $0.289$ |
| 6 | $(-2, 1, 1)$ | $6$ | $6$ | $6$ | $60$ | $1.000$ | $0.316$ |

**這張表代表什麼。** 內積那一欄每次剛好加 1，因為這組資料每一筆的 $y_n\mathbf{w}_f^\top\mathbf{x}_n$ 都等於最小值 1，事實一的不等式在這裡是等式。長度平方那一欄遠低於上界，而且會變小：從 $10$ 掉到 $4$，是因為那一步的中間項 $2y_n\mathbf{w}_t^\top\mathbf{x}_n = 2 \times (-4) = -8$，加上 $\lVert\mathbf{x}_3\rVert^2 = 2$ 之後淨變化是 $-6$。事實二把這個負的項整個丟掉、又把每一筆都當成最長的那一筆，所以上界很鬆，60 比 6 大十倍就是這樣來的。$\cos\theta$ 那一欄一路升到 1，表示 $\mathbf{w}_T$ 的方向最後和 $\mathbf{w}_f$ 完全相同；它每一步都不低於最右邊的下界。

換一個 $\mathbf{w}_f$ 試試。$(-3, 2, 2)$ 也把四筆都分對：$y_n\mathbf{w}_f^\top\mathbf{x}_n$ 分別是 $3$、$3$、$1$、$1$，最小值 $1$，$\lVert\mathbf{w}_f\rVert^2 = 17$，$\rho^2 = 1/17$，上限是 $170$。它同樣成立，只是比較鬆。這組資料沒有任何 $\mathbf{w}_f$ 的 $\rho$ 比 $1/\sqrt{6}$ 大（本文補充的論證）：任取一個長度為 1 的向量 $\mathbf{u}$，把四筆的 $y_n\mathbf{u}^\top\mathbf{x}_n$ 照 $\frac{1}{6}$、$\frac{1}{6}$、$\frac{1}{3}$、$\frac{1}{3}$ 加權平均，得到的是 $\mathbf{u}$ 和 $\frac{1}{6}(1,3,0) + \frac{1}{6}(1,0,3) - \frac{1}{3}(1,1,0) - \frac{1}{3}(1,0,1) = \frac{1}{6}(-2, 1, 1)$ 的內積，它不會超過後者的長度 $\sqrt{6}/6 = 1/\sqrt{6}$。四個數的最小值不會比它們的加權平均大，所以 $\rho \le 1/\sqrt{6}$。60 因此是這條定理對這組資料能給的最好的數字。

上限對所有變形都成立，這也可以驗證：把四筆資料的 24 種排列順序各跑一次 cyclic PLA，修正次數是 6、12 或 14；每次從分錯的點裡任意挑一筆，把所有可能的挑法窮舉一遍，修正次數最少 6、最多 15。沒有一種超過 60。

### Fun Time：上限用 R 與 ρ 表示

**題目（第 16 頁）：** 我們來給 $T$（PLA「修正」錯誤的次數）一個上限。定義

$$
R^2 = \max_{n}\lVert\mathbf{x}_n\rVert^2, \qquad \rho = \min_{n} y_n\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\mathbf{x}_n
$$

想證明 $T \le \square$。用這兩個量把 $\square$ 表示出來。

1. $R/\rho$
2. $R^2/\rho^2$
3. $R/\rho^2$
4. $\rho^2/R^2$

**答案：2。** 講義的解釋是：$\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\frac{\mathbf{w}_t}{\lVert\mathbf{w}_t\rVert}$ 的最大值是 1，$T$ 次修正讓這個內積至少成長到 $\sqrt{T}\cdot\text{constant}$，所以修正次數最多是 $1/\text{constant}^2$。前面算出 constant 是 $\rho/R$，$1/\text{constant}^2 = R^2/\rho^2$。

其他選項可以從兩個角度排除。一是根號：不等式是 $\sqrt{T} \le R/\rho$，要平方才得到 $T$，選項 1 少了平方，選項 3 只平方了一半。二是方向：資料離分界線愈遠應該愈好分，$\rho$ 愈大上限要愈小，選項 4 的 $\rho$ 在分子，方向反了。用四個點的例子檢查：選項 1 給 $\sqrt{10} \times \sqrt{6} \approx 7.7$，選項 3 給 $\sqrt{10} \times 6 \approx 19$，選項 4 給 $1/60$。實際修正了 6 次，選項 4 直接被否定；換順序時出現過 12 與 14 次，選項 1 也不成立。選項 3 的單位不對：把所有資料放大 10 倍（$x_0$ 也一起放大），$R$ 與 $\rho$ 都變 10 倍，PLA 的每一步只是跟著放大、修正次數不變，$R/\rho^2$ 卻變成十分之一，大約 $1.9$，比實際的 6 次還小。

## 資料分不開時怎麼辦：pocket 演算法

```youtube
url: https://www.youtube.com/watch?v=vT-mUeRJfys
title: Learning to Answer Yes/No :: Non-Separable Data @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:48 整理 PLA 的優缺點，02:48–06:56 談雜訊與 NP-hard，06:56–10:02 是 pocket 演算法，10:02–11:34 是 Fun Time，之後是總結。）

### PLA 的保證有兩個實際上的問題

第 17 頁先把收斂保證的結果整理成三塊。

**保證。** 只要資料線性可分、而且只在犯錯時修正：$\mathbf{w}_f$ 與 $\mathbf{w}_t$ 的內積長得快，$\mathbf{w}_t$ 的長度長得慢，PLA 的線愈來愈對齊 $\mathbf{w}_f$，所以會停。

**優點。** 容易實作、快、任何維度 $d$ 都能用。課堂上說，整個演算法只有向量運算，沒有用到二維才有的幾何性質，二維和一百維對程式來說差不多，只是計算時間多 50 倍。

**缺點。** 講義列了兩條：

- 它「假設」$\mathcal{D}$ 線性可分才會停，而這個性質事先不知道。講義在括號裡寫：知道 $\mathbf{w}_f$ 的話就不需要 PLA 了。課堂上說這是循環論證：要確認假設成立得先找出一個 $\mathbf{w}_f$，可是找 $\mathbf{w}_f$ 正是 PLA 要做的事。
- 不確定要多久才停，因為 $\rho$ 取決於 $\mathbf{w}_f$。$R$ 可以從資料直接算，$\rho$ 不行。講義補了一句：實務上倒是很快。

課堂上把兩條合起來講實際使用時的處境：你只能讓 PLA 一直跑，停了很高興；不停的話，可能是還沒跑夠，也可能是資料根本分不開，兩種情況分辨不出來。

### 資料有雜訊：退一步，找錯最少的線

第 18 頁把上一堂的流程圖改了一個地方：目標函數 $f$ 的框裡多了「+ noise」。課堂上舉的雜訊來源是銀行過去發錯了卡、後來結果不好，或者理財專員把一些東西弄錯。這樣一來，就算 $f$ 真的是一條線，拿到手的 $\mathcal{D}$ 也不一定線性可分。問題變成：how to at least get $g \approx f$ on noisy $\mathcal{D}$?

第 19 頁的推理分三步：

- 假設雜訊「不多」，所以大部分的資料仍然有 $y_n = f(\mathbf{x}_n)$。課堂上的理由是，雜訊大到蓋過 $f$ 的話，要學的就是雜訊了。
- 那麼 $g \approx f$ 在 $\mathcal{D}$ 上的意思就是大部分的資料有 $y_n = g(\mathbf{x}_n)$。
- 既然找不到完全不犯錯的線，就找犯錯最少的線：

$$
\mathbf{w}_g \leftarrow \underset{\mathbf{w}}{\text{argmin}} \sum_{n=1}^{N} \big[\!\big[\, y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{x}_n) \,\big]\!\big]
$$

雙層方括號是講義的記號，裡面的條件成立時值是 1，不成立是 0，所以這個加總就是 $\mathbf{w}$ 在 $\mathcal{D}$ 上分錯的筆數。同一頁的圖是第 13 頁中間那一張：一條對角線把大部分的點分對，兩邊各剩幾個混在對面的點。

講義緊接著寫：NP-hard to solve, unfortunately。課堂上對沒聽過這個詞的人解釋，把它想成很難的問題，目前沒有已知的有效率的演算法能解；還開玩笑說，誰有有效率的解法趕快來找他合作。所以實際的問題是：can we modify PLA to get an 'approximately good' $g$?

### Pocket：把最好的那條線留在口袋裡

第 20 頁的 pocket 演算法是 PLA 加上幾行（講義用黑字印 PLA 原有的部分，橘字印新增的部分）：

1. 初始化口袋裡的權重 $\hat{\mathbf{w}}$。
2. 對 $t = 0, 1, \dots$：
   - 找一筆 $\mathbf{w}_t$ 分錯的資料 $(\mathbf{x}_{n(t)}, y_{n(t)})$，講義註明用「隨機」的方式找。
   - （試著）修正：$\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}$。
   - **如果 $\mathbf{w}_{t+1}$ 犯的錯比 $\hat{\mathbf{w}}$ 少，就把 $\hat{\mathbf{w}}$ 換成 $\mathbf{w}_{t+1}$。**
3. 跑到「夠多次」為止，回傳 $\hat{\mathbf{w}}$（稱為 $\mathbf{w}_{\text{POCKET}}$）當作 $g$。

和 PLA 有三個不同。第一，多了一個口袋，裡面放目前看過錯最少的那條線；$\mathbf{w}_t$ 照常往下修正，不受口袋影響。課堂上的比喻是貪心的小孩抓著手上最好玩的玩具，看到更好玩的就把手上的丟掉換新的；他還說外國人比較含蓄，才說成放在口袋裡。第二，錯誤用隨機的方式挑。課堂上的理由是希望一路上看到的線多一點變化，比較有機會碰到好的。第三，停止條件不一樣。PLA 是沒有錯就停，資料分不開時這個條件永遠等不到，所以改成跑到自己覺得夠多次。

講義對結果的用詞很保守：(somewhat) 'best' weights。它不保證找到錯最少的線。課堂上說有理論可以證明它找到的線還不錯，但這門課不細講。

### 數值例子：加一筆雜訊之後

以下也是本文自擬的例子。在前面的四個點之外，加第 5 筆 $(2, 2)$，標成 $-1$。照 $x_1 + x_2 = 2$ 那條線它應該是正的，可以把它想成一筆登錯的資料。

這五筆分不開。兩個正例 $(3, 0)$、$(0, 3)$ 的中點是 $(1.5, 1.5)$；三個負例照 $\frac{1}{6}$、$\frac{1}{6}$、$\frac{2}{3}$ 的比例加權平均，$\frac{1}{6}(1, 0) + \frac{1}{6}(0, 1) + \frac{2}{3}(2, 2)$，也是 $(1.5, 1.5)$。任何一條把兩個正例都判成正的線，會把它們的中點判成正的；把三個負例都判成負的線，會把它們的加權平均判成負的。同一個點不能又正又負，所以完美的線不存在，最好的線至少錯一筆。

為了讓過程可以重現，這裡不用隨機，照 1 到 5 的順序找下一筆錯誤（和 cyclic PLA 一樣）。一開始 $\mathbf{w}_0 = \mathbf{0}$，五筆的分數都是 0，全錯，口袋裡先放 $\hat{\mathbf{w}} = \mathbf{0}$（錯 5 筆）。

| 第幾次修正 | 用的點 | $\mathbf{w}_{t+1}$ | $\mathbf{w}_{t+1}$ 錯幾筆（哪幾筆） | 口袋 |
|---|---|---|---|---|
| 1 | 1 | $(1, 3, 0)$ | 3（3、4、5） | 換成 $(1, 3, 0)$，錯 3 筆 |
| 2 | 3 | $(0, 2, 0)$ | 4（2、3、4、5） | 不換 |
| 3 | 4 | $(-1, 2, -1)$ | 3（2、3、5） | 不換，沒有比 3 筆少 |
| 4 | 5 | $(-2, 0, -3)$ | 2（1、2） | 換成 $(-2, 0, -3)$，錯 2 筆 |
| 5 | 1 | $(-1, 3, -3)$ | 2（2、3） | 不換 |
| 6 | 2 | $(0, 3, 0)$ | 4（2、3、4、5） | 不換 |
| 7 | 3 | $(-1, 2, 0)$ | 3（2、3、5） | 不換 |
| 8 | 5 | $(-2, 0, -2)$ | 2（1、2） | 不換 |

繼續跑下去，第 25 次修正得到 $(-3, 2, 2)$，只錯第 5 筆，口袋換成它。前面證明過至少要錯一筆，所以這已經是錯最少的線。

**這個例子代表什麼。** 第一，$\mathbf{w}_t$ 本身的錯誤數是 3、4、3、2、2、4、3、2，忽高忽低，沒有愈來愈好的趨勢。跑到一半隨便停下來拿當時的 $\mathbf{w}_t$，可能拿到很差的線，口袋就是為了這件事存在。第二，停在第 8 次修正的話，回傳的是 $(-2, 0, -3)$，把兩個正例都分錯，離最好的線還有差距。「夠多次」是多少沒有標準答案，這就是講義寫 somewhat 的地方。第三，每一次修正之後都要把五筆資料全部重算一遍才知道錯幾筆，這個成本是下面 Fun Time 的重點。同一組資料用前面那段 PLA 程式跑，修正 10,000 次也沒有停。

### Fun Time：pocket 和 PLA 該用哪個

**題目（第 21 頁）：** 我們事先不知道 $\mathcal{D}$ 是不是線性可分，所以可能乾脆直接用 pocket、不用 PLA。如果 $\mathcal{D}$ 其實是線性可分的，兩者差在哪裡？

1. pocket 在 $\mathcal{D}$ 上比 PLA 慢
2. pocket 在 $\mathcal{D}$ 上比 PLA 快
3. pocket 在 $\mathcal{D}$ 上回傳的 $g$ 比 PLA 更接近 $f$
4. pocket 在 $\mathcal{D}$ 上回傳的 $g$ 比 PLA 更不接近 $f$

**答案：1。** 講義的解釋是：pocket 每一輪都要檢查 $\mathbf{w}_{t+1}$ 是不是比 $\hat{\mathbf{w}}$ 好，所以比較慢；在線性可分的 $\mathcal{D}$ 上，$\mathbf{w}_{\text{POCKET}}$ 和 $\mathbf{w}_{\text{PLA}}$ 是同一個，都不犯錯。

課堂上講了兩個變慢的原因，講義只寫了第二個。一是要花力氣把口袋裡的東西存起來。二是比較兩條線誰好，得把所有資料看過一遍；PLA 只要找到一筆錯誤就能往下走。本文把第二個原因換成數字：PLA 的一次修正，最省的時候只算一次內積；pocket 每次修正後要多算 $N$ 次內積來數錯誤。

選項 2 方向相反。選項 3 與 4 不對，是因為資料線性可分時，$\mathbf{w}_t$ 最後會走到一條不犯錯的線，那一刻它的錯誤數是 0，一定比口袋裡的少（除非口袋裡已經是它），於是口袋裡放的就是 PLA 會回傳的那條線，兩者的 $g$ 一樣好。

### 這堂課的總結

第 22 頁把四節各收成一句：感知器假說集合是 $\mathbb{R}^d$ 裡的超平面，也就是線性分類器；PLA 找出錯誤並反覆修正；資料線性可分時，最後一定沒有錯誤；資料不可分時，把（還算）最好的權重留在口袋裡。講義對下一堂的預告是 the zoo of learning problems，課堂上說機器學習能做的不只是是非題。

第 11 頁的兩類問題，這堂回答了一半：線性可分時會停，停了之後在 $\mathcal{D}$ 上全對。「在 $\mathcal{D}$ 以外，$g$ 還接近 $f$ 嗎」仍然沒有答案。

## 自我檢查

**1. 目前 $\mathbf{w}_t = (1, -2, 1)$。來了一筆資料，原本的點是 $(2, 1)$，$y = +1$。它被分錯了嗎？如果是，算出 $\mathbf{w}_{t+1}$，並確認修正後這一筆的分數變了多少。**

答案：補上 $x_0$ 之後 $\mathbf{x} = (1, 2, 1)$，分數是 $1 - 4 + 1 = -2$，和 $y = +1$ 不同號，分錯了。$\mathbf{w}_{t+1} = (1, -2, 1) + (1, 2, 1) = (2, 0, 2)$。新的分數是 $2 + 0 + 2 = 4$，這次分對了。分數從 $-2$ 變成 $4$，增加 $6$，正好是 $\lVert\mathbf{x}\rVert^2 = 1 + 4 + 1$。

**2. 只有兩筆資料：$(1, 1)$ 標 $+1$，$(-1, -1)$ 標 $-1$。從 $\mathbf{w}_0 = \mathbf{0}$ 跑 PLA 要修正幾次？分別用 $\mathbf{w}_f = (0, 1, 1)$ 與 $\mathbf{w}_f = (1, 1, 1)$ 算 $R^2/\rho^2$。**

答案：$\mathbf{x}_1 = (1, 1, 1)$、$\mathbf{x}_2 = (1, -1, -1)$。第一步分數是 0，算錯，$\mathbf{w}_1 = (1, 1, 1)$。檢查第 2 筆：$1 - 1 - 1 = -1$，和 $y_2 = -1$ 同號；第 1 筆：$3 > 0$。修正 1 次就停。$R^2 = 3$。用 $(0, 1, 1)$：兩筆的 $y_n\mathbf{w}_f^\top\mathbf{x}_n$ 都是 $2$，$\lVert\mathbf{w}_f\rVert^2 = 2$，$\rho^2 = 4/2 = 2$，上限 $3/2$。用 $(1, 1, 1)$：兩筆分別是 $3$ 與 $1$，最小值 $1$，$\rho^2 = 1/3$，上限 $9$。兩個上限都成立；$T$ 是整數，$T \le 1.5$ 表示最多修正 1 次，這組資料上限是緊的。

**3. 證明裡「只在犯錯時才修正」用在哪一步？假如有人改成不管分對分錯、每一筆都拿來加，兩個事實各自還成立嗎？**

判準：答案要指出它只用在事實二，用來說 $2y_{n(t)}\mathbf{w}_t^\top\mathbf{x}_{n(t)} \le 0$、可以丟掉。事實一對任何一筆資料都成立，不受影響。拿分對的資料來加的話，中間那一項是正的，$\lVert\mathbf{w}_t\rVert^2$ 一次增加的量就不再受 $R^2$ 限制；極端的例子是反覆加同一筆分對的資料，$\lVert\mathbf{w}_T\rVert$ 會跟 $T$ 成正比，$\cos\theta$ 的下界不再隨 $\sqrt{T}$ 成長，也就推不出 $T$ 的上限。

**4. 把每一筆 $\mathbf{x}_n$（包含 $x_0$）都乘上 10，$R^2/\rho^2$ 會怎麼變？PLA 的修正次數呢？**

答案：$R^2$ 變成 100 倍。$\rho$ 是 $\mathbf{x}_n$ 在單位向量上的投影取最小值，變成 10 倍，$\rho^2$ 變成 100 倍。兩者相除，上限不變。PLA 從 $\mathbf{0}$ 出發時，每一步的 $\mathbf{w}_t$ 都只是原本的 10 倍，分數的正負號不變，挑到的錯誤與修正次數完全相同。用四個點的例子實際跑：放大後仍是 6 次，最後的 $\mathbf{w}$ 是 $(-20, 10, 10)$。

**5. 跑 pocket 時，連續六次修正得到的 $\mathbf{w}$ 在 $\mathcal{D}$ 上分別錯 4、2、3、2、1、3 筆，一開始的口袋錯 5 筆。每次修正後口袋裡的線錯幾筆？如果這時候停下來，回傳的是哪一次的 $\mathbf{w}$？**

答案：口袋依序是 4、2、2、2、1、1。第四次的 2 筆沒有比口袋裡的 2 筆「少」，不換。停下來時回傳第五次修正得到的 $\mathbf{w}$，不是最後一次的（最後一次錯 3 筆）。

## 練習與對應閱讀

**對應的教科書章節。** [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 1.1.2 與 3.1，並把這堂的四支影片排在 W2 的課前必看清單裡。

**Fall 2026 extended slides（02e）的補充。** 同一個課程頁的 [02e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf) 在 MOOC 講義之外多了四件事：

- sign(0) 該怎麼算。從 $\mathbf{w}_0 = \mathbf{0}$ 出發時第一步必然碰到 sign(0)，extended slides 列出 $-1$、$+1$、$0$、隨機四種慣例，並說只要 $\mathbf{w}_1$ 通常變成非零，選哪種影響不大。本文的數值例子採用「0 算錯」，相當於其中的第三種（sign(0) = 0，碰到就修正）。
- $x_0$ 的角色：每次修正都讓 $\mathbf{w}_t$ 的第 0 個分量改變 $y_{n(t)}$。
- 把兩個事實接成 $T \le R^2/\rho^2$ 的完整推導，extended slides 稱為 Magic Chain，內容就是本文「兩個事實合起來」那一段的四個步驟。
- 把 pocket「產生候選、留下更好的」這個模式，對照到當代對齊生成式 AI 的做法，引用 Lu、Lin、Wang 在 ICML 2026 Workshop on Generative and Agentic AI for Biology 的論文。

**作業。** 兩個學期的第一份作業都有這堂的題目，沒有官方解答，批改只限修課生。

[Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)：

- Q3–4、Q7–8：資料縮放、$x_0$ 的取值怎麼改變 PLA 的上限與行為，題目引用這堂的收斂上限那一頁。自我檢查第 4 題是暖身。
- Q9：用感知器做仇恨文章偵測的推導。
- Q10–12：在 LIBSVM 的 [rcv1_train.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2) 前 200 筆上跑隨機挑選的 PLA 1000 次，畫修正次數的直方圖與 $\lVert\mathbf{w}_t\rVert$ 的變化，再比較「同一筆一直改到對」的變形。Q13 是 bonus。

[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)：

- Q2–4：保證修正一個錯誤所需的最少修正次數、正規化輸入後上限怎麼變、$K = 2$ 時多類別 PLA 和二元 PLA 的關係。
- Q11–16（程式題）：在 [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat)（$N = 256$、$\mathbf{x} \in \mathbb{R}^{12}$）上跑 1000 次隨機 PLA，量 $E_{\text{in}} = 0$ 的比例、修正次數與 $\lVert\mathbf{w}_{\text{PLA}}\rVert$ 的中位數，再看把 $\mathbf{x}$ 縮小一半、$x_0$ 改成 0.5 或 0 時修正次數怎麼變。

沒有官方解答時，程式題可以這樣自己驗收：在自己產生、確定線性可分的小資料上，確認程式停下來時訓練資料上的錯誤是 0，並檢查修正次數有沒有超過 $R^2/\rho^2$。整份作業的導讀在[基石作業](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**動手做。** 兩件今晚就能做的事：

1. 看完第二支影片後不看講義，把 PLA 寫成 20 行以內的 Python，用本文四個點的例子核對輸出是不是 $(-2, 1, 1)$ 與 6 次。
2. 在二維平面自己產生 50 個線性可分的點跑你的 PLA，把每次修正後的線畫出來，和講義第 10 頁那組圖對照。照講義的提醒，特徵的數值要比 $x_0 = 1$ 大得多，圖才好看。

**延伸閱讀。** [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)用另一種講法介紹感知器與線性分類。[Caltech Learning from Data](https://work.caltech.edu/telecourse) 是 Abu-Mostafa 用同一本教科書開的英文課。

**下一堂。** [基石第 3 堂：學習的種類](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning)把學習問題依輸出、標籤、資料取得方式與輸入分類，是非題只是其中一格。

## 課程影片來源

原始影片：[Perceptron Hypothesis Set](https://www.youtube.com/watch?v=WlpF1Phkv28)、[Perceptron Learning Algorithm](https://www.youtube.com/watch?v=1xnUlrgJJGo)、[Guarantee of PLA](https://www.youtube.com/watch?v=Okrrz0IYoSE)、[Non-Separable Data](https://www.youtube.com/watch?v=vT-mUeRJfys)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [基石第 2 堂講義 02_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf)：本文的主要底本，四節的內容、兩個 PLA 事實的推導、四題 Fun Time 與第 10 頁的示範圖都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：W2 課前必看清單與 LFD 章節。
- [基石第 2 堂 extended slides（02e_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf)：sign(0) 的慣例、$x_0$ 的角色、Magic Chain 與 pocket 的當代對照。
- [Fall 2024 Homework 1（hw1_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)：Q3–4、Q7–13 的題目內容。
- [Fall 2026 Homework 1（hw1.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)與 [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat)：Q2–4、Q11–16 的題目內容與程式題資料。
- [LIBSVM Data: rcv1_train.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2)：Fall 2024 HW1 程式題用的資料。
- [Learning from Data 教科書網站](http://amlbook.com)：1.1.2 與 3.1 的出處。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：延伸閱讀，同一本教科書的英文課程。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
