---
title: "Blending 與 Bagging：把多個假說合起來為什麼更好｜台大林軒田 機器學習技法 第 7 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, bagging]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 24
tldr: "手上有 T 個假說 gₜ 時，除了用 validation 挑一個，還可以一人一票（uniform blending）、學一組票數（linear blending）或再學一個模型來組合（any blending，也叫 stacking）。這堂用一段六行的代數證明：平方誤差下，平均後的 G 不會比 gₜ 的平均表現差，差距就是 gₜ 之間的分散程度，也就是 variance。最後用 bootstrap 從唯一一份資料重抽出 T 份，各訓練一個 gₜ 再投票，就是 bagging。"
description: "台大林軒田機器學習技法第 7 堂 Blending and Bagging 導讀：aggregation 的四種形式、uniform blending 的 bias–variance 拆解推導、linear 與 any blending 的實務步驟、KDD Cup 2011 的數字、bootstrap 與 bagging，四題 Fun Time 與自擬數值例子都附驗算。"
draft: false
glossary:
  - term: "blending"
    aliases: ["混合", "stacking"]
    definition: "手上已經有 g₁…g_T 之後才決定怎麼組合：一人一票（uniform）、學一組線性權重（linear），或把 gₜ 的輸出當特徵再學任意模型（any blending，也叫 stacking）。"
    context: "技法第 7 堂把 blending 和「邊學 gₜ 邊組合」的 aggregation learning 分開講。"
  - term: "bagging"
    aliases: ["bootstrap aggregation"]
    definition: "從原資料有放回地抽樣出多份 bootstrap 資料，各自訓練一個 gₜ，最後一人一票。它是包在任何基礎演算法外面的 meta algorithm。"
    context: "技法第 7 堂的結論：基礎演算法對資料的隨機性愈敏感，bagging 愈有效。"
  - term: "bootstrap"
    aliases: ["bootstrapping", "拔靴法"]
    definition: "統計上的重抽樣工具：從手上的 N 筆資料均勻、有放回地抽 N 筆（也可以抽 N′ 筆），用來模擬「再拿到一份新資料」。"
    context: "技法第 7 堂用它替代 bias–variance 分析裡那個需要無限多份新資料的虛擬流程。"
  - term: "bias–variance 拆解"
    aliases: ["bias-variance decomposition"]
    definition: "平方誤差下，演算法的期望表現等於「各個 gₜ 偏離共識 ḡ 的期望程度」（variance）加上「共識 ḡ 本身的表現」（bias）。"
    context: "技法第 7 堂由 uniform blending 的代數恆等式取 T 趨近無限得到；uniform blending 消掉的是 variance 那一項。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf) 與四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/23 到 23/23），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 7 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，前六堂都屬於第一種 Embedding Numerous Features: Kernel Models，到上一堂[技法第 6 堂：支援向量迴歸](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression)收尾。這堂開始第二種：Combining Predictive Features: Aggregation Models。題目換成：手上已經有好幾個假說（hypothesis），每一個都有點預測能力，怎麼把它們合起來，得到比單獨用任何一個更好的結果。課堂上說，這個家族會用五堂課來談，每堂挑幾個不同的做法介紹，這堂是第一堂。

先備是[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)的 $E_{\text{val}}$ 與 $g^-$ 記號、[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的平方誤差、[基石第 12 堂：非線性轉換](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)「先轉換、再跑線性模型」的流程，以及期望值的基本運算。讀完之後，你應該能自己重推 uniform blending 的誤差拆解，說出 bias 與 variance 各是哪一項；能照步驟做 linear blending 與 any blending，並解釋為什麼票數要在驗證資料上學；能寫出 bagging 的流程，算出一份 bootstrap 資料長什麼樣子。

## 為什麼要把假說合起來：從選一個朋友到讓大家投票

```youtube
url: https://www.youtube.com/watch?v=mjUKsp0MvMI
title: Blending and Bagging :: Motivation of Aggregation @ Machine Learning Techniques (機器學習技法)
```

（影片 00:17–02:03 回顧上一堂並預告主題，02:03–05:18 是朋友報股票的故事，05:18–10:34 把四種做法寫成式子，10:34–12:59 談 selection 的侷限，12:59–17:49 是兩張示意圖，之後是 Fun Time。）

### 四種用朋友的方法

講義第 2 頁的故事是這樣的：你有 $T$ 個朋友 $g_1, \dots, g_T$，每個人都會預測某支股票明天漲還是跌，朋友 $t$ 的預測記成 $g_t(\mathbf{x})$。課堂上直接假設有 15 個朋友，有人說漲、有人說跌。聽完之後你可以：

1. **挑一個最可信的人，只聽他的。** 依每個人平常的表現來選。講義在旁邊標了 validation：這就是基石第 15 堂的模型選擇。
2. **所有人一人一票。** 多數人說漲就當漲。
3. **投票，但票數不一樣。** 比較可信的人多給幾票。
4. **看情況決定聽誰的。** 講義寫的是：如果「朋友 $t$ 滿足某個條件」，才給他票。課堂上舉的例子是，有人擅長科技類股、有人擅長傳統產業，看科技類股時參考甲、乙、丙的意見，看傳統產業時改成參考甲和丁。

講義把這類做法統稱 aggregation models：把假說混合（mix）或組合（combine）起來，希望表現更好。

### 四種方法寫成式子

第 3 頁把上面四件事各寫成一行。漲記成 $+1$、跌記成 $-1$，最後的結果記成大寫的 $G$。

**選一個（select）：**

$$
G(\mathbf{x}) = g_{t_*}(\mathbf{x}), \qquad t_* = \underset{t \in \{1, 2, \dots, T\}}{\operatorname{argmin}}\ E_{\text{val}}(g_t^-)
$$

$g_t^-$ 是只用訓練資料（不含驗證資料）學出來的版本，用它算驗證誤差來選；選定 $t_*$ 之後回傳的是用全部資料學的 $g_{t_*}$，這是基石第 15 堂的做法。

**一人一票（uniform）：**

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} 1 \cdot g_t(\mathbf{x})\Big)
$$

把所有人的 $\pm 1$ 加起來，看總和是正是負。

**票數不同（non-uniform）：**

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} \alpha_t \cdot g_t(\mathbf{x})\Big), \qquad \alpha_t \ge 0
$$

$\alpha_t$ 是朋友 $t$ 的票數。課堂上說票數當然不能是負的，但可以是 0，代表完全不需要這個人的票。

**看條件（conditional）：**

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} q_t(\mathbf{x}) \cdot g_t(\mathbf{x})\Big), \qquad q_t(\mathbf{x}) \ge 0
$$

票數從一個固定的數變成 $\mathbf{x}$ 的函數。課堂上的說明是：輸入裡如果記著這是哪一類股票，$q_t(\mathbf{x})$ 就能依這個資訊決定要不要問朋友 $t$、給他幾票。

這四種是一層包一層的關係。講義用 $\llbracket \cdot \rrbracket$ 表示「條件成立時是 1、不成立時是 0」：

| 比較大的形式 | 怎麼設定就退回比較小的形式 |
|---|---|
| non-uniform | $\alpha_t = \llbracket E_{\text{val}}(g_t^-) \text{ 最小} \rrbracket$：只有驗證誤差最小的那個人拿到 1 票，其他人 0 票，就是 select |
| non-uniform | $\alpha_t = 1$：就是 uniform |
| conditional | $q_t(\mathbf{x}) = \alpha_t$：不管什麼條件都給同樣的票，就是 non-uniform |

所以 conditional 包含了前面全部。講義的總結是 aggregation models: a rich family。

### 只選一個的侷限

第 4 頁回頭看 selection。它簡單、常用，但有兩件事要記得：

- 如果用 $E_{\text{in}}(g_t)$ 取代 $E_{\text{val}}(g_t^-)$ 來選，要付出 $d_{\text{VC}}$ 上的複雜度代價。這是基石第 15 堂講過的，這堂談 linear blending 時還會再用一次。
- selection 要成功，候選裡得有一個夠強的 $g_t^-$，才能保證 $E_{\text{val}}$ 小、進而 $E_{\text{out}}$ 小。課堂上講得很直白：如果每個 $g_t^-$ 都弱，再怎麼選也只是從一堆不好的裡面挑一個。

講義把兩者對照成兩句話。selection 靠的是一個強的假說，課堂上稱為強人領導。aggregation 問的是：如果手上是很多個可能比較弱的假說，能不能靠合起來做得更好？

### 兩張圖：合起來可以變強，也可以變穩

第 5 頁用兩張圖回答「為什麼合起來可能有用」。兩張圖都是二維平面上的圈圈（正例）與叉叉（負例）。

**左圖：弱的合起來變強。** 規定只能用水平線或垂直線來分類。這份資料的圈圈在右上、叉叉在左下，看起來至少要一條斜線才分得開，任何單獨一條水平線或垂直線都分不好。圖上畫了一條水平線與兩條垂直線，三條各自都不完美；讓它們一人一票之後，得到的邊界是一條先往下、往右、再往下的階梯狀折線，把圈圈與叉叉完全分開。講義的註解是：把不同的弱假說均勻混合，$G(\mathbf{x})$ 變「強」了，效果像特徵轉換（feature transform）。

**右圖：很多條都對的線，合起來取中間。** 這份資料線性可分，能把它完全分對的線有無限多條。PLA 隨機執行時，停在其中哪一條都有可能，圖上畫了一堆灰色的線。讓這些灰線投票，結果是中間那條黑線。課堂上的解釋是：灰線散布在所有可行的線之間，投票的結果會靠近中庸的那一條，不會緊貼著某個圈圈或某個叉叉；而中庸的線大致就是邊界比較胖的線，所以效果像 SVM 的 large margin，也就是正則化（regularization）。講義的註解是 $G(\mathbf{x})$ 變得「moderate」。

課堂上特別點出這兩件事在基石裡是相反的方向：特徵轉換像踩油門，讓模型更有能力；正則化像踩煞車，讓模型不要那麼強。同樣是讓假說投票，卻兩種效果都可能出現。把 aggregation 做對，就像油門和煞車都控制好。講義這一頁的結論是 proper aggregation ⟹ better performance，兩個效果後面都打了問號；本文的理解是，這兩張圖給的是直覺，還不是證明。一個效果對付模型能力不足，一個對付過擬合，到 aggregation 的最後一堂[技法第 11 堂：梯度提升決策樹](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree)做總整理時會再出現一次。

### Fun Time：三個 decision stump 投票

**題目（第 6 頁）：** 有三個從 $\mathbb{R}$ 對到 $\{-1, +1\}$ 的 decision stump：$g_1(x) = \operatorname{sign}(1 - x)$、$g_2(x) = \operatorname{sign}(1 + x)$、$g_3(x) = -1$。三個假說一人一票，得到的 $G(x)$ 是哪一個？

1. $2\llbracket \lvert x \rvert \le 1 \rrbracket - 1$
2. $2\llbracket \lvert x \rvert \ge 1 \rrbracket - 1$
3. $2\llbracket x \le -1 \rrbracket - 1$
4. $2\llbracket x \ge +1 \rrbracket - 1$

先讀懂選項的寫法：$\llbracket \cdot \rrbracket$ 成立時是 1，$2 \times 1 - 1 = +1$；不成立時是 0，$2 \times 0 - 1 = -1$。所以選項 1 的意思是「$\lvert x \rvert \le 1$ 時輸出 $+1$，其他地方輸出 $-1$」。decision stump 是只看一個維度、只切一刀的分類器，$g_1$ 在 $x = 1$ 切、$g_2$ 在 $x = -1$ 切，$g_3$ 是不管輸入都說 $-1$ 的常數。

**答案：1。** 把數線分成三段，逐段數票：

| 區域 | $g_1$ | $g_2$ | $g_3$ | 票數總和 | $G$ |
|---|---|---|---|---|---|
| $x < -1$ | $+1$ | $-1$ | $-1$ | $-1$ | $-1$ |
| $-1 < x < 1$ | $+1$ | $+1$ | $-1$ | $+1$ | $+1$ |
| $x > 1$ | $-1$ | $+1$ | $-1$ | $-1$ | $-1$ |

只有中間那一段同時拿到 $g_1$ 與 $g_2$ 的兩張正票，贏過 $g_3$ 的一張反對票。選項 2 把內外弄反了。選項 3 與 4 各只有一個切點，但投票的結果有兩個切點。

本文補充：剛好在 $x = \pm 1$ 的兩個點，其中一個 stump 算的是 $\operatorname{sign}(0)$。把 $\operatorname{sign}(0)$ 當成 $+1$，這兩個點也是 $+1$，才會跟選項 1 的「$\le$」完全一致。

講義的解答補了一句：三個 decision stump 合起來，可以形成比較複雜的假說。每個 stump 只能把數線切成左右兩邊，$G$ 卻切出「中間一段」。課堂上說這有點像第 5 頁左邊那張圖：把一堆簡單的假說合起來，做出比較複雜的東西。

## 一人一票為什麼有用：uniform blending 與誤差的拆解

```youtube
url: https://www.youtube.com/watch?v=DAFkKJYTMW4
title: Blending and Bagging :: Uniform Blending @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–04:17 是分類的投票，04:17–06:46 是迴歸的平均，06:46–15:24 推導誤差的拆解，15:24–19:54 是虛擬流程與 bias–variance，之後是 Fun Time。）

### blending 這個字，以及分類的投票

課堂上先解釋用詞。blending 是果汁機在做的事：把一堆假說丟進去打成一杯綜合果汁。這個字用在「$g_t$ 已經在手上」的情況，例如你帶一個三人小組，三個人各交給你一個 $g$，問題只剩怎麼合。每個 $g_t$ 地位相同、一人一票，叫 uniform blending。

二元分類的式子（第 7 頁）就是前面那一行：

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} 1 \cdot g_t(\mathbf{x})\Big)
$$

講義列了兩種極端情況：

- **所有 $g_t$ 都一樣**（講義戲稱 autocracy，獨裁）：投票的結果就是那一個 $g_t$，沒有任何好處。
- **$g_t$ 彼此很不同**（diversity 加 democracy）：多數可以修正少數。

第 7 頁右邊的圖就是第 5 頁左圖的實際投票結果。課堂上的說明是：一條水平線與兩條垂直線把平面切成六塊，每一塊裡三條線各說一個答案，取兩票的那一邊；右上那一帶整塊是圈圈，左下那一帶整塊是叉叉，階梯狀的邊界就是這樣數票數出來的。「少數服從多數」能修正錯誤，背後的假設是少數那一方比較可能是犯錯的。

多類別分類也能投票，只是不再加加減減，改成數每個類別得幾票，選最高票：

$$
G(\mathbf{x}) = \underset{1 \le k \le K}{\operatorname{argmax}} \sum_{t=1}^{T} \llbracket g_t(\mathbf{x}) = k \rrbracket
$$

本文舉個例子：五個假說對同一個 $\mathbf{x}$ 分別說類別 2、1、2、3、2，類別 2 拿到三票，$G(\mathbf{x}) = 2$。

### 迴歸：把輸出平均

迴歸的輸出是實數，第 8 頁的做法是平均：

$$
G(\mathbf{x}) = \frac{1}{T}\sum_{t=1}^{T} g_t(\mathbf{x})
$$

為什麼要除以 $T$？課堂上的例子是：正確答案是 2，十個人都預測在 2 附近，直接加起來會變成 20。要一人一票又要落在同樣的範圍，就得除以人數。

兩種極端情況跟分類一樣。$g_t$ 都相同時，平均還是它自己。$g_t$ 不同時，講義寫的是：有些 $g_t(\mathbf{x}) > f(\mathbf{x})$，有些 $g_t(\mathbf{x}) < f(\mathbf{x})$，平均「可能」比個別的更準。高估與低估會互相抵銷一部分。

講義把兩頁收成一句：假說夠多樣（diverse）時，連最簡單的 uniform blending 都可能比任何單一假說好。這句話裡的「可能」，接下來用一段代數變成確定的不等式。

### 推導：平均誤差等於分散程度加上 G 的誤差

第 9 頁要證明的是：$g_t$ 的平均平方誤差，與 $G$ 的平方誤差，剛好差一項「$g_t$ 有多分散」。

先約定記號。課堂上說，每個函數後面都拖著 $(\mathbf{x})$ 太麻煩，所以先固定一個 $\mathbf{x}$，把 $g_t(\mathbf{x})$、$f(\mathbf{x})$、$G(\mathbf{x})$ 簡寫成 $g_t$、$f$、$G$，三個都只是數字。另外用 $\operatorname{avg}$ 表示「對 $t = 1, \dots, T$ 加總再除以 $T$」，所以 $G = \operatorname{avg}(g_t)$。課堂上說寫成 avg 比加總符號平易近人。

這個 $\operatorname{avg}$ 有兩個性質，整段推導只靠這兩個：它是線性的（加法可以拆開、常數可以提出來），以及跟 $t$ 無關的量取平均還是自己。$f$ 與 $G$ 都跟 $t$ 無關。

$$
\begin{aligned}
\operatorname{avg}\big((g_t - f)^2\big) &= \operatorname{avg}\big(g_t^2 - 2g_t f + f^2\big) \\
&= \operatorname{avg}\big(g_t^2\big) - 2Gf + f^2 \\
&= \operatorname{avg}\big(g_t^2\big) - G^2 + (G - f)^2 \\
&= \operatorname{avg}\big(g_t^2\big) - 2G^2 + G^2 + (G - f)^2 \\
&= \operatorname{avg}\big(g_t^2 - 2g_t G + G^2\big) + (G - f)^2 \\
&= \operatorname{avg}\big((g_t - G)^2\big) + (G - f)^2
\end{aligned}
$$

每一行做了什麼：

1. **展開平方。**
2. **把平均拆進三項。** 第一項留著。中間項 $\operatorname{avg}(2g_t f) = 2f \operatorname{avg}(g_t) = 2Gf$，因為 $f$ 是常數、$\operatorname{avg}(g_t)$ 就是 $G$。最後一項 $\operatorname{avg}(f^2) = f^2$。
3. **湊出 $(G - f)^2$。** 我們的目標裡有 $G$ 的誤差 $(G - f)^2 = G^2 - 2Gf + f^2$，手上有 $-2Gf + f^2$，少一個 $G^2$。課堂上的說法是先借一項 $G^2$ 來，再還它一項，所以多了 $-G^2$。
4. **把 $-G^2$ 寫成 $-2G^2 + G^2$。** 課堂上說這是變個魔術，目的是讓前半段也能湊成一個平方。
5. **把 $G$ 放回平均裡面。** $2G^2 = 2G \cdot \operatorname{avg}(g_t) = \operatorname{avg}(2g_t G)$，這一步把其中一個 $G$ 還原成「$g_t$ 的平均」；$G^2 = \operatorname{avg}(G^2)$，因為 $G$ 跟 $t$ 無關。
6. **認出完全平方。** $g_t^2 - 2g_t G + G^2 = (g_t - G)^2$。

結論是對這個固定的 $\mathbf{x}$：

$$
\underbrace{\operatorname{avg}\big((g_t - f)^2\big)}_{g_t \text{ 的平均誤差}} = \underbrace{\operatorname{avg}\big((g_t - G)^2\big)}_{g_t \text{ 離 } G \text{ 多遠}} + \underbrace{(G - f)^2}_{G \text{ 的誤差}}
$$

### 數值例子：三個預測值

以下是本文自擬的例子，不在講義上。固定一個 $\mathbf{x}$，真正的答案是 $f = 6$，三個假說的預測是 $g_1 = 2$、$g_2 = 4$、$g_3 = 9$。兩個低估、一個高估。

- $G = (2 + 4 + 9)/3 = 5$。
- 左邊：$\operatorname{avg}\big((g_t - f)^2\big) = (16 + 4 + 9)/3 = 29/3 \approx 9.67$。
- 分散程度：$\operatorname{avg}\big((g_t - G)^2\big) = (9 + 1 + 16)/3 = 26/3 \approx 8.67$。
- $G$ 的誤差：$(5 - 6)^2 = 1$。

$26/3 + 1 = 29/3$，等式成立。三個假說的平方誤差分別是 16、4、9，平均起來將近 10；平均後的 $G$ 只有 1，這個例子裡 $G$ 比三個都好。

但等式保證的只有「不輸給平均」。把預測換成 $g_1 = 6$、$g_2 = 2$、$g_3 = 1$，$f$ 仍是 6：$G = 3$，$G$ 的誤差是 9，$g_t$ 的平均誤差是 $(0 + 16 + 25)/3 = 41/3 \approx 13.67$，分散程度是 $(9 + 1 + 4)/3 = 14/3$，$14/3 + 9 = 41/3$ 仍然成立。可是 $g_1$ 的誤差是 0，比 $G$ 好。課堂上講的就是這件事：最好的那個 $g_t$ 有沒有比 $G$ 好，不知道；能確定的是 $G$ 比「隨便挑一個 $g_t$」的期望表現好，因為你事先並不知道該挑哪一個。

### 從一個點到整體的 Eout

上面的等式對每一個 $\mathbf{x}$ 都成立，所以可以對產生 $\mathbf{x}$ 的分布取期望值。講義用 $\mathcal{E}$ 表示這個期望。平方誤差的期望值就是 $E_{\text{out}}$：$\mathcal{E}\,(g_t - f)^2 = E_{\text{out}}(g_t)$、$\mathcal{E}\,(G - f)^2 = E_{\text{out}}(G)$。$\operatorname{avg}$ 與 $\mathcal{E}$ 都是線性運算，先後順序可以交換，於是第 9 頁下半部寫成

$$
\operatorname{avg}\big(E_{\text{out}}(g_t)\big) = \operatorname{avg}\big(\mathcal{E}\,(g_t - G)^2\big) + E_{\text{out}}(G) \ \ge\ E_{\text{out}}(G)
$$

中間那一項是平方的平均再取期望，不可能是負的，把它丟掉就得到不等式。在平方誤差的迴歸問題裡，uniform blending 的 $G$ 保證不比 $g_t$ 的平均表現差，兩者的差距正好是 $g_t$ 之間的分散程度：$g_t$ 愈不一樣，$G$ 贏得愈多；$g_t$ 完全相同時那一項是 0，沒有任何好處。前面說的「要多樣」在這裡有了精確的意思。

本文補充：這個結論是對迴歸的平方誤差證的。分類的投票沒有同樣漂亮的恆等式，自我檢查第 2 題用機率算一個分類的例子。

### 一組特別的 gₜ：bias 與 variance

第 10 頁把同一個等式用在一組特別的 $g_t$ 上。想像一個虛擬的流程，對 $t = 1, 2, \dots, T$：

1. 從分布 $P^N$ 拿到一份新的、大小為 $N$ 的資料 $\mathcal{D}_t$（i.i.d.）。
2. 用演算法 $\mathcal{A}$ 學出 $g_t = \mathcal{A}(\mathcal{D}_t)$。

課堂上說這個流程是抽象的，哪裡不實際先留著沒講；到 bagging 那一節會看到，問題在於現實中沒有人能每一輪都拿到一份全新的資料。把 $T$ 推到無限大，平均的結果記成 $\bar{g}$：

$$
\bar{g} = \lim_{T \to \infty} G = \lim_{T \to \infty} \frac{1}{T}\sum_{t=1}^{T} g_t = \underset{\mathcal{D}}{\mathcal{E}}\ \mathcal{A}(\mathcal{D})
$$

$\bar{g}$ 是演算法 $\mathcal{A}$ 看過各式各樣的資料之後，產生的假說的期望值。把 $G$ 換成 $\bar{g}$，前面的等式變成

$$
\operatorname{avg}\big(E_{\text{out}}(g_t)\big) = \operatorname{avg}\big(\mathcal{E}\,(g_t - \bar{g})^2\big) + E_{\text{out}}(\bar{g})
$$

本文補充：等式換了對象仍然成立，是因為推導只用到平均的線性，以及 $G$ 是 $g_t$ 的平均。把「對 $t$ 平均」換成「對資料 $\mathcal{D}$ 取期望」，這兩個性質都還在。

講義替三項各取了名字：

| 式子裡的項 | 講義的說法 | 名稱 |
|---|---|---|
| $\operatorname{avg}\big(E_{\text{out}}(g_t)\big)$ | expected performance of $\mathcal{A}$：演算法的期望表現 | — |
| $E_{\text{out}}(\bar{g})$ | performance of consensus：共識本身的表現 | **bias** |
| $\operatorname{avg}\big(\mathcal{E}\,(g_t - \bar{g})^2\big)$ | expected deviation to consensus：各個 $g_t$ 偏離共識的期望程度 | **variance** |

$\bar{g}$ 叫共識（consensus），是所有 $g_t$ 的共同意見。課堂上的白話是：bias 看的是這個共識離我們真正要的 $f$ 還有多遠；variance 看的是這群 $g_t$ 七嘴八舌，意見到底有多亂。一個演算法的平均表現可以拆成這兩項，統計的書上叫 bias–variance decomposition。

講義這一頁的結論是：uniform blending 降低的是 variance，換來比較穩定的表現。課堂上的說法是，平均的過程就是在消除「意見有多亂」這一項的影響。等式本身也看得出來：改用共識 $\bar{g}$ 之後，誤差只剩 $E_{\text{out}}(\bar{g})$ 這一項 bias，variance 那一項整個消失。bias 則不會因為平均而變小，共識離 $f$ 有多遠就是多遠。

### 數值例子：一筆資料學一個常數

以下是本文自擬的例子，不在講義上，目的是把三項各算出一個數字。

- 輸入 $x$ 等機率取 $-1$、$0$、$1$，目標函數 $f(x) = x^2$，所以 $f$ 的值分別是 1、0、1。
- 每份資料只有 $N = 1$ 筆。演算法 $\mathcal{A}$ 回傳通過那一筆的常數假說 $g(x) = y_1$。

資料有三種等機率的可能，學到的 $g$ 分別是常數 1、0、1。常數假說 $g(x) = c$ 的 $E_{\text{out}}$ 是 $\frac{1}{3}\big[(c - 1)^2 + c^2 + (c - 1)^2\big]$：

| 抽到的 $x$ | 學到的 $g$ | $E_{\text{out}}(g)$ | $(g - \bar{g})^2$ |
|---|---|---|---|
| $-1$ | $1$ | $\frac{1}{3}$ | $\frac{1}{9}$ |
| $0$ | $0$ | $\frac{2}{3}$ | $\frac{4}{9}$ |
| $1$ | $1$ | $\frac{1}{3}$ | $\frac{1}{9}$ |

- 共識：$\bar{g} = (1 + 0 + 1)/3 = \frac{2}{3}$。
- 演算法的期望表現：$(\frac{1}{3} + \frac{2}{3} + \frac{1}{3})/3 = \frac{4}{9}$。
- variance：$(\frac{1}{9} + \frac{4}{9} + \frac{1}{9})/3 = \frac{2}{9}$。因為 $g$ 是常數，$(g - \bar{g})^2$ 不隨 $x$ 變，對 $x$ 的期望就是它自己。
- bias：$E_{\text{out}}(\bar{g}) = \frac{1}{3}\big[\frac{1}{9} + \frac{4}{9} + \frac{1}{9}\big] = \frac{2}{9}$。

$\frac{2}{9} + \frac{2}{9} = \frac{4}{9}$，等式成立。這個結果的意思是：只看一筆資料就下結論的演算法，期望誤差 $\frac{4}{9}$ 裡有一半來自「每次看到的資料不同，學到的東西跟著晃」。如果能把所有可能的 $g$ 平均起來，誤差降到 $\frac{2}{9}$，比三種 $g$ 的任何一個（$\frac{1}{3}$ 或 $\frac{2}{3}$）都低。剩下的 $\frac{2}{9}$ 是常數假說本來就表達不了 $x^2$ 的部分，再怎麼平均也消不掉。

### Fun Time：線性假說平均之後是什麼

**題目（第 11 頁）：** 把 uniform blending $G(\mathbf{x}) = \frac{1}{T}\sum_{t=1}^{T} g_t(\mathbf{x})$ 用在線性迴歸的假說 $g_t(\mathbf{x}) = \operatorname{innerprod}(\mathbf{w}_t, \mathbf{x})$ 上。哪一個最能描述得到的 $G(\mathbf{x})$？

1. $\mathbf{x}$ 的常數函數
2. $\mathbf{x}$ 的線性函數
3. $\mathbf{x}$ 的二次函數
4. 以上皆非

**答案：2。** 內積對第一個引數是線性的，所以

$$
G(\mathbf{x}) = \frac{1}{T}\sum_{t=1}^{T} \operatorname{innerprod}(\mathbf{w}_t, \mathbf{x}) = \operatorname{innerprod}\Big(\frac{1}{T}\sum_{t=1}^{T}\mathbf{w}_t,\ \mathbf{x}\Big)
$$

$G$ 仍是一個線性假說，權重是所有 $\mathbf{w}_t$ 的平均。選項 1 只在平均後的權重剛好讓 $G$ 不隨 $\mathbf{x}$ 變時才成立，不是一般情況。選項 3 不可能，線性函數相加不會長出二次項。講義順便解釋了為什麼寫 innerprod：平常的轉置記號 $\mathbf{w}^\top\mathbf{x}$ 裡的 T 會跟假說的個數 $T$ 撞名。

本文補充：這題和「三個 decision stump 投票」那題 Fun Time 剛好是一組對照。線性迴歸的假說平均之後還在原本的假說集合裡，模型的能力沒有增加，平均能帶來的只有降低 variance。decision stump 投票時多了一層 $\operatorname{sign}$，合起來的 $G$ 就跑到單一 stump 表達不了的地方。第 5 頁的兩張圖一張講能力變強、一張講結果變穩；stump 那題是前者的小例子，線性迴歸這題則是「只變穩、能力不變」最單純的情況（右圖的 PLA 投票還多一層 $\operatorname{sign}$，不完全相同）。

## 票數怎麼決定：linear blending 與 any blending

```youtube
url: https://www.youtube.com/watch?v=i03s1g7X_m4
title: Blending and Bagging :: Linear and Any Blending @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:44 把 linear blending 看成線性模型，03:44–06:18 談 $\alpha_t \ge 0$ 的限制，06:18–11:10 與 selection 比較並給出實務步驟，11:10–12:49 是 any blending，12:49–16:11 是 KDD Cup 2011 的故事，之後是 Fun Time。）

### 求票數就是做一次線性迴歸

linear blending（第 12 頁）同樣假設 $g_t$ 已經在手上，要決定每個 $g_t$ 拿幾票：

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} \alpha_t \cdot g_t(\mathbf{x})\Big), \qquad \alpha_t \ge 0
$$

名字裡的 linear，課堂上的解釋是：$G$ 是把 $g_t$ 的輸出用 $\alpha_t$ 做線性組合。什麼是好的 $\alpha$？最直接的想法是讓誤差最小，$\min_{\alpha_t \ge 0} E_{\text{in}}(\boldsymbol{\alpha})$。以迴歸為例，講義把它和基石學過的問題並排：

| linear blending for regression | 線性迴歸加特徵轉換 |
|---|---|
| $\displaystyle \min_{\alpha_t \ge 0} \frac{1}{N}\sum_{n=1}^{N}\Big(y_n - \sum_{t=1}^{T}\alpha_t\, g_t(\mathbf{x}_n)\Big)^2$ | $\displaystyle \min_{w_i} \frac{1}{N}\sum_{n=1}^{N}\Big(y_n - \sum_{i=1}^{\tilde{d}} w_i\, \phi_i(\mathbf{x}_n)\Big)^2$ |

兩邊逐項對得上：$\alpha_t$ 對 $w_i$，$g_t$ 對 $\phi_i$，假說的個數 $T$ 對轉換後的維度 $\tilde{d}$。唯一的差別是左邊多了 $\alpha_t \ge 0$。所以講義把 linear blending 寫成一條式子：

**linear blending = 線性模型 + 把假說當特徵轉換 + 限制式**

課堂上說，linear blending 其實沒有新東西，把 $g_t$ 當成特徵轉換，剩下的全是學過的線性模型：做迴歸就用線性迴歸，要輸出機率就用邏輯迴歸。講義提醒這像 two-level learning。課堂上指出那是在講 probabilistic SVM 時出現的（[技法第 5 堂：Kernel 邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)）：先跑 SVM，再把它的輸出交給邏輯迴歸。這裡是先得到一堆 $g_t$，再跑一次線性模型得到 $\alpha$。

### 票數不能是負的嗎

線性模型本來沒有 $\alpha_t \ge 0$ 這種限制，加上它之後不能直接套現成的解法。第 13 頁先把誤差換成一般的寫法 $\min_{\alpha_t \ge 0} \frac{1}{N}\sum_n \operatorname{err}\big(y_n, \sum_t \alpha_t g_t(\mathbf{x}_n)\big)$，再問：如果解出來某個 $\alpha_t < 0$，代表什麼？

$$
\alpha_t < 0 \quad\Longrightarrow\quad \alpha_t\, g_t(\mathbf{x}) = \lvert \alpha_t \rvert \cdot \big(-g_t(\mathbf{x})\big)
$$

給 $g_t$ 負的票數，等於給 $-g_t$ 正的票數。在二元分類裡，$-g_t$ 就是把 $g_t$ 的答案反過來。課堂上的說法是：機器學完之後算出負的 $\alpha_t$，是在建議你把這個 $g_t$ 反過來用。

講義用一句玩笑說明反過來用沒什麼不好：如果你有一個錯誤率 99% 的股票漲跌分類器，請告訴我。課堂上把話說完：他說漲我就猜跌，他說跌我就猜漲，錯誤率 99% 就變成正確率 99%。

所以講義的結論是，實務上常常直接把限制式拿掉，投影片上「+ constraints」被劃了一條線：

**linear blending = 線性模型 + 把假說當特徵轉換**

課堂上也承認，迴歸時把假說反過來用的意思沒那麼直觀，不過多數時候刻意留著這條限制並沒有必要。

### 數值例子：替三個 decision stump 算票數

以下是本文自擬的例子，不在講義上；用的假說是講義兩題 Fun Time 裡的三個 decision stump，$g_1(x) = \operatorname{sign}(1 - x)$、$g_2(x) = \operatorname{sign}(1 + x)$、$g_3(x) = -1$。

把假說當特徵轉換，$\boldsymbol{\Phi}(x) = (g_1(x), g_2(x), g_3(x))$。數線上的點轉換後只有三種結果：

| 區域 | $\boldsymbol{\Phi}(x)$ |
|---|---|
| $x < -1$ | $(+1, -1, -1)$ |
| $-1 < x < 1$ | $(+1, +1, -1)$ |
| $x > 1$ | $(-1, +1, -1)$ |

拿五筆資料 $x = -2, -1.5, 0, 0.5, 3$ 來學票數，用不加限制式的線性迴歸，也就是找 $\boldsymbol{\alpha}$ 讓 $\sum_n (y_n - \boldsymbol{\alpha}^\top\boldsymbol{\Phi}(x_n))^2$ 最小。如果有一組 $\boldsymbol{\alpha}$ 能讓每一筆的誤差都是 0，它就是最小值，所以直接解「三種區域各一條等式」：

$$
\begin{aligned}
x < -1:&\quad \alpha_1 - \alpha_2 - \alpha_3 = y_{\text{左}} \\
-1 < x < 1:&\quad \alpha_1 + \alpha_2 - \alpha_3 = y_{\text{中}} \\
x > 1:&\quad -\alpha_1 + \alpha_2 - \alpha_3 = y_{\text{右}}
\end{aligned}
$$

第二式減第一式得到 $2\alpha_2 = y_{\text{中}} - y_{\text{左}}$，第二式減第三式得到 $2\alpha_1 = y_{\text{中}} - y_{\text{右}}$，再代回第二式求 $\alpha_3 = \alpha_1 + \alpha_2 - y_{\text{中}}$。對三種不同的目標各解一次：

| 目標（$y = +1$ 的區域） | $(y_{\text{左}}, y_{\text{中}}, y_{\text{右}})$ | 解出的 $(\alpha_1, \alpha_2, \alpha_3)$ | 這組票數的意思 |
|---|---|---|---|
| $\lvert x \rvert < 1$ | $(-1, +1, -1)$ | $(1, 1, 1)$ | 一人一票，就是 uniform blending |
| $x < 1$ | $(+1, +1, -1)$ | $(1, 0, 0)$ | 只留 $g_1$，就是 selection |
| $x < -1$ | $(+1, -1, -1)$ | $(0, -1, 0)$ | 把 $g_2$ 反過來用 |

以第三列為例：$2\alpha_2 = -1 - 1 = -2$，$\alpha_2 = -1$；$2\alpha_1 = -1 - (-1) = 0$，$\alpha_1 = 0$；$\alpha_3 = 0 + (-1) - (-1) = 0$。驗證：$x = -2$ 時 $\boldsymbol{\alpha}^\top\boldsymbol{\Phi} = (-1)(-1) = +1$，$x = 0$ 時是 $(-1)(+1) = -1$，$x = 3$ 時也是 $-1$，五筆都完全吻合。把這五筆的 $\boldsymbol{\Phi}(x_n)$ 與 $y_n$ 交給基石第 9 堂的線性迴歸解法再算一次，得到的也是同樣的答案。

這個小例子把這一節的三件事都走到了。同一組假說、同一套線性迴歸，資料長得不一樣，學出的票數可以是 uniform，可以是 selection，這就是第 3 頁那張包含關係的表。第三列的 $\alpha_2 = -1$ 是負的：這三條等式只有這一組解，如果堅持 $\alpha_t \ge 0$，就做不到誤差為 0；允許負的票數，等於多了 $-g_2 = \operatorname{sign}(-1 - x)$ 這個假說可以用。

這個例子裡的三個 stump 是事先給定的，不是從這五筆資料學出來的。實務上 $g_t$ 通常也是從資料學來的，這時拿哪些資料來學票數就有講究，接下來處理這件事。

### 不能用 Ein 來學票數

$g_t$ 在實務上通常怎麼來？第 14 頁的說法是：各自來自不同的模型，$g_1 \in \mathcal{H}_1, g_2 \in \mathcal{H}_2, \dots, g_T \in \mathcal{H}_T$，每個都是在自己的假說集合裡把 $E_{\text{in}}$ 降到最低得到的。這跟基石第 15 堂模型選擇的情境一樣，那時的結論也適用：

- **用 $E_{\text{in}}$ 做 selection**，選到的是 best of best，要付的複雜度代價是 $d_{\text{VC}}\big(\bigcup_{t=1}^{T}\mathcal{H}_t\big)$。課堂上的比喻是兩個班的第一名出來再比一次，選出來的人代表的是兩個班合起來的複雜度。
- **linear blending 包含 selection 當特例**，把 $\alpha_t$ 設成 $\llbracket E_{\text{val}}(g_t^-) \text{ 最小} \rrbracket$ 就是。
- 所以**用 $E_{\text{in}}$ 做 linear blending**，講義稱為 aggregation of best，複雜度代價 $\ge d_{\text{VC}}\big(\bigcup_{t=1}^{T}\mathcal{H}_t\big)$。

第三點的理由，課堂上講的是：selection 只是從各班第一名裡挑一個，linear blending 是把所有第一名組成一支菁英團隊；它能做到的事包含了 selection，付出的代價只會更高。best of best 已經夠危險，這樣做更容易過擬合，所以實務上不建議用 $E_{\text{in}}$ 學 $\alpha$。

講義的處方跟 selection 一樣，兩個地方都換掉：用 $E_{\text{val}}$ 取代 $E_{\text{in}}$；被組合的假說用 $g_t^-$，也就是只在 $\mathcal{D}_{\text{train}}$ 上把 $E_{\text{train}}$ 降到最低得到的版本。課堂上補充了第二點的用意：算 $\alpha$ 用的驗證資料，要跟產生那些假說的資料分開，才有獨立性。

### 實務步驟，以及 any blending

第 15 頁把流程寫出來。把資料切成 $\mathcal{D}_{\text{train}}$ 與 $\mathcal{D}_{\text{val}}$ 之後：

1. 在 $\mathcal{D}_{\text{train}}$ 上學出 $g_1^-, g_2^-, \dots, g_T^-$。
2. 把 $\mathcal{D}_{\text{val}}$ 裡的每一筆 $(\mathbf{x}_n, y_n)$ 轉換成 $(\mathbf{z}_n = \boldsymbol{\Phi}^-(\mathbf{x}_n),\ y_n)$，其中 $\boldsymbol{\Phi}^-(\mathbf{x}) = (g_1^-(\mathbf{x}), \dots, g_T^-(\mathbf{x}))$。
3. 在轉換後的資料上學組合的方式。
4. 回傳的 $G$ 改用 $\boldsymbol{\Phi}(\mathbf{x}) = (g_1(\mathbf{x}), \dots, g_T(\mathbf{x}))$，也就是不帶減號的 $g_t$。

第 3、4 步有兩種做法：

| | Linear Blending | Any Blending（Stacking） |
|---|---|---|
| 第 3 步 | $\boldsymbol{\alpha} = \text{LinearModel}\big(\{(\mathbf{z}_n, y_n)\}\big)$ | $\tilde{g} = \text{AnyModel}\big(\{(\mathbf{z}_n, y_n)\}\big)$ |
| 第 4 步 | $G_{\text{LINB}}(\mathbf{x}) = \text{LinearHypothesis}_{\boldsymbol{\alpha}}\big(\boldsymbol{\Phi}(\mathbf{x})\big)$ | $G_{\text{ANYB}}(\mathbf{x}) = \tilde{g}\big(\boldsymbol{\Phi}(\mathbf{x})\big)$ |

$\text{LinearHypothesis}_{\boldsymbol{\alpha}}$ 的意思，課堂上的說明是：先算 $\boldsymbol{\alpha}$ 與 $\boldsymbol{\Phi}(\mathbf{x})$ 的內積，迴歸就直接輸出，分類再取 $\operatorname{sign}$。

第 4 步為什麼用 $\boldsymbol{\Phi}$、不用 $\boldsymbol{\Phi}^-$？課堂上特別停下來講：這跟 validation 選完模型之後回傳 $g$、不回傳 $g^-$ 是同一個道理，$g_t$ 用了全部的資料，預期表現會比 $g_t^-$ 好。本文補充：這表示每個模型要訓練兩次，一次只用 $\mathcal{D}_{\text{train}}$ 得到 $g_t^-$ 來學 $\boldsymbol{\alpha}$，一次用全部資料得到 $g_t$ 來做最後的預測。

右邊那一欄把線性模型換成任何模型，叫 any blending，也叫 stacking。課堂上解釋 stacking 是一層疊一層的意思：第一層得到 $g_t$，第二層把它們合起來；第二層可以用非線性的 SVM 或任何你想用的模型。他還開了個玩笑：LinearModel 的 Lin 是 linear，不是因為他姓林。

講義對 any blending 的評語有兩條：

- **powerful**：第二層是非線性的，可以做到第 3 頁的 conditional blending，等於在不同的條件下用不同的 $g_t$。
- **danger of overfitting**：愈有能力的模型愈容易過擬合。課堂上提醒用 any blending 要非常小心，該加正則化就加，要常踩煞車。

### 實例：KDD Cup 2011 Track 1

第 16 頁是台大團隊拿下 KDD Cup 2011 Track 1 世界冠軍的解法，出處是 Chen 等人的論文 [A linear ensemble of individual and blended models for music rating prediction](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)。投影片上方的流程圖有五個方塊，依序是：

1. Data-Set
2. Single Models：箭頭來自 Data-Set；訓練出很多個單一模型，就是這堂課的 $g_t$。
3. Val.-Set Blending：箭頭來自 Single Models，另有一條直接來自 Data-Set。
4. Test-Set Blending：箭頭來自 Val.-Set Blending，另有一條直接來自 Single Models。
5. Post-Processing

也就是說，單一模型與第一次 blending 得到的模型，都會進到第二次 blending。

兩次 blending 各有數字，講義標的是 $E_{\text{test}}$ (squared)：

| 步驟 | 做法 | $E_{\text{test}}$ | 講義說它的作用 |
|---|---|---|---|
| validation set blending | 一種特別的 any blending | 519.45 ⟹ 456.24 | 最後兩週保住領先 |
| test set blending | 用 $\tilde{E}_{\text{test}}$ 做 linear blending | 456.24 ⟹ 442.06 | 最後一小時逆轉 |

本文算了一下降幅：第一步降了 63.21，約 12.2%；第二步降了 14.18，約 3.1%。

課堂上補了比賽的經過。第一步把單一模型用非線性的方式合起來，做完之後台大隊在比賽倒數兩週穩定待在領先群。第二步是把前面得到的上百個 $g$ 與 $G$ 再合一次，這次只給每個模型不同的票數；特別的地方是用了某種方法，拿得到很接近 $E_{\text{test}}$ 的估計值，投影片在 $E_{\text{test}}$ 上面加一條波浪線就是這個意思，再直接針對這個估計值來學票數。第二步的降幅看起來小，卻讓台大隊在比賽最後一小時從第二名變成第一名。

講義的結論是 blending 在實務上「有用」，儘管計算負擔很重。課堂上自己也打了折扣：競賽算不算實務是一回事，真實的系統會不會放兩百多個模型在裡面又是另一回事；可以確定的是，如果你從不同的方向做了嘗試、手上有一些不同的 $g_t$，把它們合起來是真的有用，代價是模型的複雜度與計算量。

### Fun Time：x 等於 0 時的轉換結果

**題目（第 17 頁）：** 同樣是那三個 decision stump，$g_1(x) = \operatorname{sign}(1 - x)$、$g_2(x) = \operatorname{sign}(1 + x)$、$g_3(x) = -1$。$x = 0$ 時，linear／any blending 回傳的假說裡用到的 $\boldsymbol{\Phi}(x) = (g_1(x), g_2(x), g_3(x))$ 是哪一個？

1. $(+1, +1, +1)$
2. $(+1, +1, -1)$
3. $(+1, -1, -1)$
4. $(-1, -1, -1)$

**答案：2。** 直接代入：$g_1(0) = \operatorname{sign}(1) = +1$，$g_2(0) = \operatorname{sign}(1) = +1$，$g_3(0) = -1$。講義的解答只寫了一句「Too easy? :-)」。

其他選項可以對回前面例子的表：選項 3 是 $x < -1$ 那一段的 $\boldsymbol{\Phi}(x)$。選項 1 與 4 對任何 $x$ 都不會出現：選項 1 的第三個分量是 $+1$，但 $g_3$ 永遠是 $-1$；選項 4 要 $g_1$ 與 $g_2$ 同時是 $-1$，那需要 $x > 1$ 且 $x < -1$。

這題要確認的是「把假說當特徵轉換」這件事有沒有看懂：原本一維的 $x$，被三個假說轉成三維的 $\mathbf{z}$，第二層的模型看到的是 $\mathbf{z}$，看不到原本的 $x$。

## 只有一份資料時怎麼得到不同的假說：bootstrap 與 bagging

```youtube
url: https://www.youtube.com/watch?v=3T1mdvzRAF0
title: Blending and Bagging :: Bagging (Bootstrap Aggregation) @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:00 回顧 blending 並列出多樣性的來源，03:00–04:30 回到 bias–variance，04:30–06:42 是 bootstrap，06:42–08:12 是 bagging，08:12–09:46 是 pocket 的示範，之後是 Fun Time 與總結。）

### 從「先有 gₜ 再合」到「邊學 gₜ 邊合」

第 18 頁先整理到目前為止的三種 blending，並提出下一個問題。blending 是拿到 $g_t$ 之後才合；講義把「一邊得到 $g_t$、一邊合起來」叫 learning：

| aggregation type | blending | learning |
|---|---|---|
| uniform | voting／averaging | ? |
| non-uniform | linear | ? |
| conditional | stacking | ? |

右邊一欄這堂只填第一格。對照技法第 9 堂講義開頭的同一張表，三格的答案依序是 Bagging、AdaBoost、Decision Tree，後兩格是接下來兩堂的內容。

要為 uniform aggregation 學出 $g_t$，前面的分析已經說了關鍵：要多樣。講義列出四種多樣性的來源：

- **不同的模型**：$g_1 \in \mathcal{H}_1, g_2 \in \mathcal{H}_2, \dots, g_T \in \mathcal{H}_T$。
- **不同的參數**：例如梯度下降用 $\eta = 0.001, 0.01, \dots, 10$。課堂上多舉了 SVM 用不同的 $\gamma$ 或不同的 $C$。
- **演算法本身的隨機性**：隨機的 PLA 用不同的亂數種子。課堂上說 pocket 用不同的起始點也算。
- **資料的隨機性**：cross-validation 過程中的那些 $g_v^-$，每一個是用不同的幾份資料學出來的。

講義接下來要走的是第四條，但加了一個條件：diversity by data randomness without $g^-$。本文的理解是，cross-validation 的 $g_v^-$ 每一個都少用了一份資料；這裡想找的做法是不必切出驗證資料，同一份資料也能造出很多個不同的 $g_t$。

### 回到 bias–variance：兩個做不到的地方

第 19 頁回到 uniform blending 那一節的結論：

$$
\text{演算法 } \mathcal{A} \text{ 的期望表現} = \text{偏離共識的期望程度} + \text{共識的表現}, \qquad \bar{g} = \text{來自 } \mathcal{D}_t \sim P^N \text{ 的 } g_t \text{ 的期望}
$$

講義說，共識 $\bar{g}$ 比直接用 $\mathcal{A}(\mathcal{D})$ 穩定，但它需要的 $\mathcal{D}_t$ 比手上那一份 $\mathcal{D}$ 多得多。課堂上把困難拆成兩個：$\bar{g}$ 要無限多個 $g_t$ 的平均，我們沒有無限多個；每個 $g_t$ 都要一份新鮮的資料，我們只有手上這一份。所以要做兩個妥協：

- 用有限、但夠大的 $T$ 代替無限多。
- 只用手上的 $\mathcal{D}$，想辦法造出「長得像新資料」的 $\mathcal{D}_t$，再用它得到 $g_t = \mathcal{A}(\mathcal{D}_t)$。

第二個妥協靠的是 bootstrapping。講義的定義是：一種統計工具，從 $\mathcal{D}$ 重新抽樣來「模擬」$\mathcal{D}_t$。課堂上提到它有人直譯成拔靴法。

### bootstrap：有放回地重抽

第 20 頁的定義：bootstrap sample $\tilde{\mathcal{D}}_t$ 是從 $\mathcal{D}$ 裡均勻地、有放回地（uniformly with replacement）重抽 $N$ 筆得到的資料。

手上有 $N$ 筆，再抽 $N$ 筆，不就是原來那一份嗎？課堂上把過程講得很具體：每次抓一筆出來，記下「這次抽到第 3 筆」，放回去；再抓一筆，記下「這次抽到第 5 筆」，放回去；再抓一筆，又是第 3 筆，也記下來，放回去。因為每次都放回去，同一筆資料可能被抽到好幾次，也可能有資料一次都沒被抽到。這樣做 $N$ 次，記下來的那 $N$ 筆就是一個 bootstrap sample。波浪線表示它跟想像中的 $\mathcal{D}_t$ 很像，但不一樣。

抽的筆數不一定要是 $N$，講義寫可以用任意的 $N'$。課堂上的例子是：有一萬筆資料，覺得每次抽三千筆就夠，那 $N'$ 就是 3000。重點在「抽出來、記下來、放回去」這個過程。

### bagging 的流程

有了 bootstrap，第 10 頁的虛擬流程就能換成做得到的版本。講義把兩者並排：

| | virtual aggregation（虛擬的） | bootstrap aggregation（實際做得到的） |
|---|---|---|
| 每一輪 $t = 1, 2, \dots, T$，第 1 步 | 從 $P^N$ 拿一份大小 $N$ 的新資料 $\mathcal{D}_t$ | 用 bootstrap 從 $\mathcal{D}$ 抽一份大小 $N'$ 的 $\tilde{\mathcal{D}}_t$ |
| 第 2 步 | $g_t = \mathcal{A}(\mathcal{D}_t)$ | $g_t = \mathcal{A}(\tilde{\mathcal{D}}_t)$ |
| 最後 | $G = \text{Uniform}(\{g_t\})$ | $G = \text{Uniform}(\{g_t\})$ |

$\text{Uniform}$ 就是這堂課的 uniform blending：分類用投票，迴歸用平均。兩欄只差在資料從哪裡來。

bootstrap aggregation 簡稱 BAGging。課堂上說這個暱稱像是把一堆 $g_t$ 打包起來。它不管底下的 $\mathcal{A}$ 是什麼，任何演算法都能套，所以講義稱它是蓋在 base algorithm $\mathcal{A}$ 上面的 meta algorithm。

### 數值例子：三筆資料的 bootstrap

以下是本文自擬的例子，不在講義上。資料只有三筆，$y$ 的值是 1、2、6，不看輸入，只學一個常數來預測 $y$。抽三次、每次三種可能，一共 $3^3 = 27$ 種等機率的抽法。不計順序的話是 10 種組合：

| 抽到的三筆 | 抽法數 | 平均數 | 中位數 |
|---|---|---|---|
| 1, 1, 1 | 1 | $1$ | 1 |
| 1, 1, 2 | 3 | $\frac{4}{3}$ | 1 |
| 1, 1, 6 | 3 | $\frac{8}{3}$ | 1 |
| 1, 2, 2 | 3 | $\frac{5}{3}$ | 2 |
| 2, 2, 2 | 1 | $2$ | 2 |
| 2, 2, 6 | 3 | $\frac{10}{3}$ | 2 |
| 1, 2, 6 | 6 | $3$ | 2 |
| 1, 6, 6 | 3 | $\frac{13}{3}$ | 6 |
| 2, 6, 6 | 3 | $\frac{14}{3}$ | 6 |
| 6, 6, 6 | 1 | $6$ | 6 |

抽法數加起來是 27。27 種抽法裡，只有 6 種抽到的剛好是原來的三筆；其他 21 種都有重複、也都漏掉至少一筆。每一輪的 $\tilde{\mathcal{D}}_t$ 多半跟 $\mathcal{D}$ 不同，彼此也不同，各個 $g_t$ 的差異就是從這裡來的。

再看兩種 base algorithm。把 $T$ 取到很大，bagging 的輸出會接近 27 種抽法的平均：

- **$\mathcal{A}$ 回傳平均數。** 原資料上 $\mathcal{A}(\mathcal{D}) = 3$。27 種抽法的平均數再平均，還是 3。各個 $g_t$ 明明都不一樣，合起來卻回到原點。
- **$\mathcal{A}$ 回傳中位數。** 原資料上 $\mathcal{A}(\mathcal{D}) = 2$。27 種抽法裡中位數是 1 的有 7 種、是 2 的有 13 種、是 6 的有 7 種，平均是 $(7 \times 1 + 13 \times 2 + 7 \times 6)/27 = 75/27 = 25/9 \approx 2.78$，跟原本的 2 不同。

這個例子說明兩件事。第一，bagging 的 $G$ 不一定等於直接在 $\mathcal{D}$ 上跑一次 $\mathcal{A}$ 的結果，中位數的情況就不一樣。第二，bootstrap 只是從同一份 $\mathcal{D}$ 重抽，沒有帶進新的資料。平均數的情況最明顯：每一筆被抽到的機率相同，bootstrap 平均數的期望值就是原資料的平均數，所以重抽再平均之後只是回到 $\mathcal{A}(\mathcal{D}) = 3$。虛擬流程裡的 $\bar{g}$ 是對真正的新資料取期望，兩者不是同一個東西；課堂上講 bagging 時也說，這只是在模擬想像中的那個過程。以上兩點是本文從這個例子讀出來的，不是講義的內容。這個例子沒有 $f$，所以沒辦法說哪一個答案比較好，它只呈現 bagging 改變了什麼、沒改變什麼。

### 示範：bagging 加 pocket

第 21 頁是實際跑出來的圖，base algorithm 是[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 pocket 演算法。設定是 $T_{\text{POCKET}} = 1000$、$T_{\text{BAG}} = 25$：做 25 次 bootstrap，每一份資料讓 pocket 跑 1000 輪，各得到一條線。

圖上 25 條灰線方向差很多，課堂上的描述是有的比較像橫的、有的是斜的，這些差異全是 bootstrap 造成的。25 條線投票之後得到黑色的邊界，它是一條彎彎折折的非線性邊界。課堂上的評價很保守：圈圈和叉叉分得還可以，不算非常好，但可能比單獨一條 pocket 的線來得好。

講義整理成兩點：bagging 得到的 $g_t$ 很多樣；把二元分類器合起來之後，得到合適的非線性邊界。這一頁的結論是：base algorithm 對資料的隨機性敏感時，bagging 的效果不錯。課堂上的解釋是，演算法愈敏感，bootstrap 出來的 $g_t$ 愈不一樣，合起來就愈可能有好處。這句話是[技法第 10 堂：隨機森林](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest)的伏筆：完全長大的決策樹正是對資料非常敏感的演算法。

### Fun Time：抽回原來那一份的機率

**題目（第 22 頁）：** 用 bootstrap 從有 $N$ 筆的資料 $\mathcal{D}$ 重抽 $N$ 筆得到 $\tilde{\mathcal{D}}_t$。$\tilde{\mathcal{D}}_t$ 跟 $\mathcal{D}$ 完全一樣的機率是多少？

1. $0 / N^N = 0$
2. $1 / N^N$
3. $N! / N^N$
4. $N^N / N^N = 1$

**答案：3。** 講義的解法是把重抽想成有順序的 $N$ 步：每一步有 $N$ 種可能，總共 $N^N$ 種結果，每一種機率相同。其中有 $N!$ 種是原本 $\mathcal{D}$ 的排列，每一筆恰好出現一次，只是順序不同，所以機率是 $N!/N^N$。

課堂上唸題目時補了一個條件：原本的 $N$ 筆是不一樣的資料。這題也把「一樣」當成不計順序的一樣。

其他選項錯在哪：選項 1 說不可能，但每一筆剛好各抽到一次是會發生的。選項 2 只算了「依原本的順序抽到」那一種，如果連順序都要相同才對。選項 4 說一定一樣，忽略了重複抽到同一筆的情況。

本文驗算：前面三筆資料的例子，27 種抽法裡有 6 種是原資料的排列，$3!/3^3 = 6/27 = 2/9$，跟表上那一列的抽法數 6 吻合。$N$ 一大，這個機率掉得很快：$N = 5$ 是 $24/625 = 0.0384$，$N = 10$ 是 $0.00036$。資料量稍微大一點，每一份 bootstrap 資料幾乎一定跟原資料不同。

第 23 頁的總結把四節各收成一句：合起來的 $G$ 可以變強，也可以變得中庸；假說要多樣，一人一票、票票等值；linear 與 any blending 是把假說當特徵轉換的 two-level learning；bootstrap 用來產生多樣的假說。下一堂的預告是 getting more diverse hypotheses to make $G$ strong。課堂上的講法是：能不能得到比 bagging 更不一樣的假說，讓 $G$ 做得更好。

## 自我檢查

**1. 固定一個 $\mathbf{x}$，$f = 2$，三個假說的預測是 $g_1 = 1$、$g_2 = 2$、$g_3 = 9$。算出 $G$、$g_t$ 的平均平方誤差、$g_t$ 對 $G$ 的分散程度、$G$ 的平方誤差，並檢查等式。$G$ 有沒有贏過每一個 $g_t$？**

答案：$G = 12/3 = 4$。平均平方誤差是 $(1 + 0 + 49)/3 = 50/3$；分散程度是 $(9 + 4 + 25)/3 = 38/3$；$G$ 的平方誤差是 $(4 - 2)^2 = 4$。$38/3 + 4 = 50/3$，成立。$G$ 的誤差 4 遠低於平均的 $50/3 \approx 16.7$，但 $g_1$（誤差 1）與 $g_2$（誤差 0）都比 $G$ 好。等式保證的是 $G$ 不輸給平均，沒有保證贏過最好的那一個。

**2. 三個二元分類器，各自有 20% 的機率答錯，而且三個答錯與否互相獨立。一人一票的 $G$ 答錯的機率是多少？如果三個分類器完全相同呢？如果每個的錯誤率是 60% 呢？**

答案（本文的計算，獨立是題目給的假設）：$G$ 答錯需要至少兩個同時答錯，機率是 $3 \times 0.2^2 \times 0.8 + 0.2^3 = 0.096 + 0.008 = 0.104$，比單獨一個的 0.2 低。三個完全相同時，投票結果就是那一個，錯誤率仍是 0.2，這是講義說的 autocracy。錯誤率 60% 時是 $3 \times 0.6^2 \times 0.4 + 0.6^3 = 0.432 + 0.216 = 0.648$，比單獨一個還差：多數修正少數，前提是多數比較可能是對的。

**3. 做 linear blending 時，為什麼 $\boldsymbol{\alpha}$ 要在 $\mathcal{D}_{\text{val}}$ 上用 $g_t^-$ 的輸出來學，最後回傳時卻改用 $g_t$？**

判準：答案要說出三件事。第一，linear blending 包含 selection 當特例，用 $E_{\text{in}}$ 學 $\boldsymbol{\alpha}$ 付出的複雜度代價至少是 $d_{\text{VC}}(\bigcup_t \mathcal{H}_t)$，容易過擬合。第二，$g_t^-$ 只看過 $\mathcal{D}_{\text{train}}$，所以 $\mathcal{D}_{\text{val}}$ 對它們來說是沒看過的資料，學 $\boldsymbol{\alpha}$ 時才不會被已經記住的資料誤導。第三，票數定下來之後，換回用全部資料訓練的 $g_t$，理由跟 validation 選完模型後回傳 $g$ 而不是 $g^-$ 相同。

**4. 用正文裡那三個 decision stump 做不加限制式的 linear blending，目標是「$\lvert x \rvert > 1$ 時 $y = +1$，$\lvert x \rvert < 1$ 時 $y = -1$」。解出 $\boldsymbol{\alpha}$，並說明它的意思。**

答案：$(y_{\text{左}}, y_{\text{中}}, y_{\text{右}}) = (+1, -1, +1)$。$2\alpha_2 = -1 - 1 = -2$，$\alpha_2 = -1$；$2\alpha_1 = -1 - 1 = -2$，$\alpha_1 = -1$；$\alpha_3 = -1 - 1 - (-1) = -1$。$\boldsymbol{\alpha} = (-1, -1, -1)$：三個假說都反過來用再一人一票。這是 Fun Time 那個 $G$ 的相反，三票全是負的；有 $\alpha_t \ge 0$ 的限制時做不到。

**5. $N = 4$ 筆互不相同的資料，bootstrap 抽 4 筆。抽到的資料跟原本完全一樣（不計順序）的機率是多少？這對 bagging 代表什麼？**

答案：$4!/4^4 = 24/256 = 3/32 \approx 0.094$。超過九成的機率會有資料被重複抽到、同時有資料沒被抽到，所以每一輪的 $\tilde{\mathcal{D}}_t$ 多半跟 $\mathcal{D}$ 不同，base algorithm 才會給出不同的 $g_t$。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把這堂排在 W11（11/11），投影片代號是 [207u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/207u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)排在 W11（11/18），和技法第 8 堂同一週上；這一週的投影片在 2026-09-30 還沒上線，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都沒有替這堂標 [Learning from Data](http://amlbook.com)（LFD）的章節，本文只依講義與影片。

**作業。** 相關的題目在 [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止）與 [HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（12-02 發布、12-16 截止），沒有官方解答：

| 題 | 類型 | 練什麼 |
|---|---|---|
| HW6 Q4 | 自動批改 | 5 個錯誤互相獨立、各自 $E_{\text{out}} = 0.25$ 的分類器做 uniform blending，$G$ 的 $E_{\text{out}}$ 大約多少（題目直接引用講義 207 第 7 頁）。算法跟自我檢查第 2 題相同 |
| HW6 Q9 | 人工批改 | 把 linear blending 的 $\boldsymbol{\Phi}(\mathbf{x}) = (g_1(\mathbf{x}), \dots, g_T(\mathbf{x}))$ 與 kernel 結合：用整數輸入上的縮放 decision stump 當 $g_t$，推出對應的 kernel |
| HW7 Q1 | 自動批改 | $N = 1126$ 時，bootstrap 抽多少個才有超過 70% 的機率出現重複的資料 |
| HW7 Q5 | 人工批改 | $2M + 1$ 個分類器 uniform 投票時，$E_{\text{out}}(G)$ 最緊的上界 |

HW6 Q9 的提示附了林軒田早期的論文 [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf)。HW7 Q1 可以用蒙地卡羅模擬核對自己的解析解。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**延伸閱讀。** 課程頁列的延伸閱讀裡，跟這堂有關的是兩篇：[Breiman, Bagging Predictors](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf)（UC Berkeley 技術報告 421）是 bagging 的原始論文；[Chen et al.](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf) 是講義第 16 頁引用的 KDD Cup 2011 解法。站內其他課程對同一主題的講法：[Harvard CS181 HW4：決策樹、隨機森林與 MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)、[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)。

**下一堂。** [技法第 8 堂：AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting) 接著處理這堂留下的問題：bootstrap 靠隨機抽樣得到不同的 $g_t$，能不能刻意調整資料，讓下一個 $g_t$ 跟上一個更不一樣。

## 課程影片來源

原始影片：[Motivation of Aggregation](https://www.youtube.com/watch?v=mjUKsp0MvMI)、[Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4)、[Linear and Any Blending](https://www.youtube.com/watch?v=i03s1g7X_m4)、[Bagging (Bootstrap Aggregation)](https://www.youtube.com/watch?v=3T1mdvzRAF0)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-13：原本與第 8 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。

## 參考資料

- [技法第 7 堂講義 207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf)：本文的主要底本，四節的式子、誤差拆解的推導、KDD Cup 2011 的數字、bagging pocket 的示範與四題 Fun Time 都出自這份講義。
- [技法第 9 堂講義 209_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf)：只取開頭那張 blending／learning 對照表，確認三個問號的答案。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、207u 投影片與延伸閱讀清單。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)：Q4 與 Q9 的題目內容。
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)：Q1 與 Q5 的題目內容。
- [Chen et al., A linear ensemble of individual and blended models for music rating prediction](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)：講義第 16 頁引用的 KDD Cup 2011 Track 1 解法。
- [Breiman, Bagging Predictors](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf)：課程頁列的延伸閱讀，bagging 的原始論文。
- [Lin, infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf)：HW6 Q9 提示附的論文。
- [Learning from Data 教科書網站](http://amlbook.com)：課程頁對照 LFD 章節時用的教科書。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
