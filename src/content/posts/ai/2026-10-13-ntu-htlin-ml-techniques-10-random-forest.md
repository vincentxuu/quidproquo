---
title: "隨機森林：Bagging 加決策樹與 out-of-bag 估計｜台大林軒田 機器學習技法 第 10 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, decision-trees, bagging]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 27
tldr: "隨機森林是 bagging 套在完全長成的 C&RT 上，再讓每次分支只看隨機投影出來的少數特徵。bootstrap 抽 N 次時，每筆資料約有 1/e ≈ 36.8% 的機率沒被某棵樹用到，這些 out-of-bag 資料可以直接算出 E_oob，當作不用另外切資料、不用重新訓練的驗證；再配上 permutation test 就得到每個特徵的重要度。代價是結果會隨亂數種子晃動，樹要加到 G 穩定為止。"
description: "台大林軒田機器學習技法第 10 堂 Random Forest 導讀：bagging 加完全長成的 C&RT、隨機子空間與隨機組合分支、out-of-bag 資料量的推導、E_oob 與模型選擇、permutation test 特徵重要度、KDD Cup 2013 的樹數經驗，附八筆資料五棵樹的手算例子。"
draft: false
glossary:
  - term: "隨機森林"
    aliases: ["random forest", "RF"]
    definition: "用 bootstrap 抽出多份資料，各自訓練一棵完全長成的 C&RT 決策樹，再讓所有的樹公平投票或平均。原始版本在每次分支時還會隨機抽特徵或特徵的組合。"
    context: "技法第 10 堂把它寫成 bagging + random-combination C&RT。"
  - term: "OOB"
    aliases: ["out-of-bag", "袋外資料"]
    definition: "bootstrap 抽樣時沒被抽中的資料。抽的次數等於資料量 N 而且 N 很大時，每筆資料約有 1/e 的機率不在某一份 bootstrap 資料裡，可以拿來驗證沒看過它的那些樹。"
    context: "技法第 10 堂稱 E_oob 為 bagging／隨機森林的 self-validation，不需要另外切驗證資料，也不需重新訓練。"
  - term: "permutation test"
    aliases: ["排列檢定", "permutation importance"]
    definition: "把某個特徵的值在各筆資料之間打亂順序，看表現變差多少，用這個差距當作該特徵的重要度。打亂只改變「誰拿到哪個值」，不改變這個特徵整體的分布。"
    context: "技法第 10 堂用它配合 OOB，不重新訓練就算出隨機森林的特徵重要度。"
  - term: "隨機子空間"
    aliases: ["random subspace"]
    definition: "從 d 個特徵裡隨機挑 d′ 個，只在這 d′ 維上找分支。原始的隨機森林在每一次分支都重新抽一次。"
    context: "技法第 10 堂用它在 bootstrap 之外再增加樹與樹之間的差異。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [210_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 10 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂屬於第二種 Combining Predictive Features: Aggregation Models。上一堂[技法第 9 堂：決策樹](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)在同一頁上被收成一行：用遞迴的分支把資料愈切愈純，在不同的條件下使用不同的常數假說。這堂把那棵樹放進[技法第 7 堂：Blending 與 Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)的 bagging 裡，得到隨機森林（random forest，以下寫 RF）。

先備是技法第 7 堂的 bootstrap 與 bagging、技法第 9 堂的 C&RT（decision stump 分支、Gini impurity、完全長成的樹），以及[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)的 $E_{\text{val}}$ 與模型選擇。讀完之後，你應該能寫出 RF 的演算法與它的兩種隨機分支；推出 bootstrap 之後大約有多少資料沒被抽到；拿到一張「哪筆資料被哪棵樹用過」的表，手算出 $E_{\text{oob}}$ 與 permutation test 的特徵重要度；並且說得出樹的數量該怎麼決定。

四節要回答的問題依序是：

1. bagging 和決策樹怎麼合在一起，還能怎麼讓每棵樹更不一樣。
2. bootstrap 沒抽到的資料能做什麼。
3. 怎麼知道哪些特徵重要。
4. 實際跑起來邊界長什麼樣子，要幾棵樹才夠。

## 把 bagging 套在決策樹上，再讓每棵樹更不一樣

```youtube
url: https://www.youtube.com/watch?v=ATM3sH0D45s
title: Random Forest :: Random Forest Algorithm @ Machine Learning Techniques (機器學習技法)
```

（影片 00:19–01:29 複習上一堂，01:29–05:44 是 bagging 加決策樹，05:44–09:10 隨機子空間，09:10–12:16 隨機組合，之後是 Fun Time。）

### 兩個演算法各有什麼特性

講義第 2 頁把前面學過的兩個演算法並排。左邊是 bagging：

1. 對 $t = 1, 2, \dots, T$，用 bootstrap 從 $\mathcal{D}$ 抽出大小 $N'$ 的資料 $\tilde{\mathcal{D}}_t$（每次抽一筆、抽完放回去）。
2. 把 $\tilde{\mathcal{D}}_t$ 交給基礎演算法 $\mathcal{A}$，得到 $g_t$。
3. 回傳 $G = \text{Uniform}(\{g_t\})$，也就是讓所有 $g_t$ 一人一票（分類）或直接平均（迴歸）。

右邊是決策樹 $\text{DTree}(\mathcal{D})$：達到終止條件就回傳葉子上的基礎假說；否則學一個分支條件 $b(\mathbf{x})$，依它把 $\mathcal{D}$ 切成 $C$ 份 $\mathcal{D}_c$，對每一份遞迴建子樹 $G_c \leftarrow \text{DTree}(\mathcal{D}_c)$，回傳

$$
G(\mathbf{x}) = \sum_{c=1}^{C} [\![\, b(\mathbf{x}) = c \,]\!]\; G_c(\mathbf{x})
$$

兩個框底下各有一行評語。bagging 是 reduces variance by voting/averaging；決策樹是 large variance, especially if fully-grown。這裡的 variance 沿用技法第 7 堂的意思：資料稍微換一批，演算法給出的假說會變多少。

課堂上解釋了決策樹為什麼特別不穩：樹是一刀一刀切出來的，資料只要有一點變化，能下刀的位置就不一樣；一刀切下去之後，每一塊的資料又更少，後面的刀更容易被少數幾筆資料左右。切到不能再切的完全長成（fully-grown）的樹，這個毛病最明顯。

一個演算法會把變動壓下來，另一個本身變動很大，講義問的是 putting them together？並且註明這是 aggregation of aggregation：決策樹本身已經是把葉子上的常數依條件合起來的 aggregation，現在外面再包一層 bagging。課堂上用周星馳電影裡的撒尿牛丸來形容這種把兩樣東西摻在一起的做法。

### 隨機森林的基本版

第 3 頁給出定義：

$$
\text{random forest (RF)} = \text{bagging} + \text{fully-grown C\&RT decision tree}
$$

演算法只是把 bagging 的第 2 步換成決策樹：

1. 對 $t = 1, 2, \dots, T$，用 bootstrap 抽出大小 $N'$ 的 $\tilde{\mathcal{D}}_t$。
2. 用 $\text{DTree}(\tilde{\mathcal{D}}_t)$ 得到一棵樹 $g_t$。
3. 回傳 $G = \text{Uniform}(\{g_t\})$。

課堂上順便解釋了名字的由來：random 指的是 bagging 過程裡 bootstrap 的隨機性，forest 是因為 bagging 底下的每個假說都是一棵樹，很多棵樹合起來就像森林。

講義列了三個好處，課堂上各補了一段說明：

- **highly parallel/efficient to learn。** 每一輪都是獨立地學一棵樹，樹與樹之間沒有先後依賴，可以拆到不同的機器上各自做。決策樹本身又是有效率的演算法，兩層合起來在現在的計算架構下很快。
- **inherit pros of C&RT。** 上一堂說 C&RT 能自然地處理多類別分類、類別特徵與缺值，這些 RF 都直接繼承。
- **eliminate cons of fully-grown tree。** 完全長成的樹對資料太敏感、容易 overfit，這個毛病靠 bagging 的投票緩和。

為什麼這裡用完全長成的樹，而不先剪枝？本文補充：技法第 7 堂把演算法的平均表現拆成兩塊，一塊是「共識」$\bar{g}$ 的表現（bias），一塊是各個 $g_t$ 偏離共識的程度（variance），bagging 的作用是用投票逼近共識，處理的是第二塊。上一堂用剪枝來壓完全長成的樹的 variance；RF 把這件事交給投票，所以每棵樹可以放著讓它長完。

### 再加一層隨機：每次分支只看一部分特徵

uniform aggregation 的關鍵是要有彼此不一樣的 $g_t$。第 4 頁先回顧 bagging 的做法：在資料這一端做隨機，從 $\mathcal{D}$ 隨機抽 $N'$ 筆。接著提出另一個可能性：在特徵這一端做隨機，從 $\mathbf{x}$ 的 $d$ 個特徵裡隨機抽 $d'$ 個。

如果抽到的特徵編號是 $i_1, i_2, \dots, i_{d'}$，這等於做了一個特徵轉換

$$
\boldsymbol{\Phi}(\mathbf{x}) = (x_{i_1}, x_{i_2}, \dots, x_{i_{d'}})
$$

轉換後的空間 $\mathcal{Z} \in \mathbb{R}^{d'}$ 是原本 $\mathcal{X} \in \mathbb{R}^{d}$ 的一個隨機子空間（random subspace）。課堂上的例子是原本有 100 個特徵，每次只隨機選 10 個來建樹；這一輪選這 10 個、下一輪選那 10 個，兩棵樹用來分類的標準顯然很不一樣。

講義另外指出兩件事：

- 通常 $d' \ll d$，所以 $d$ 很大時反而更有效率。課堂上的說法是，原本每次決定切哪裡要看過 100 個維度的所有切法，現在只要看 10 個。
- 這個技巧不限於決策樹，can be generally applied on other models。課堂上說套在 SVM 或 AdaBoost 上再做 aggregation 也都可以。

最後一行是 RF 特有的設計：original RF re-sample new subspace for each $b(\mathbf{x})$ in C&RT。隨機子空間不是整棵樹抽一次，每一次要找分支時都重新抽一組 $d'$ 個特徵。課堂上說，這是原作者的建議，每次分支都抽會讓樹看起來更不一樣。於是 RF 的定義更新成

$$
\text{RF} = \text{bagging} + \text{random-subspace C\&RT}
$$

### 隨機組合：讓分支可以切斜線

第 5 頁把「抽 $d'$ 個特徵」改寫成矩陣的形式：$\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{P} \cdot \mathbf{x}$，其中 $\mathrm{P}$ 有 $d'$ 列，每一列是從 natural basis（只有一個分量是 1、其餘是 0 的單位向量）裡隨機挑的。舉例來說（本文自擬），$d = 4$、抽到第 2 與第 4 個特徵時：

$$
\mathrm{P} = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \qquad \mathrm{P}\begin{bmatrix} 1 \\ 2 \\ 3 \\ 4 \end{bmatrix} = \begin{bmatrix} 2 \\ 4 \end{bmatrix}
$$

寫成這樣之後，下一步就很自然。課堂上的問法是：為什麼投影的方向一定要是這些固定的座標軸方向？講義的回答是讓 $\mathrm{P}$ 的每一列 $\mathbf{p}_i$ 不限於 natural basis，新的特徵是原始特徵的隨機組合：

$$
\phi_i(\mathbf{x}) = \mathbf{p}_i^\top \mathbf{x}
$$

講義稱這是 more powerful features for diversity。同一頁還有三點：

- 通常只考慮低維度的投影（low-dimensional projection）：$\mathbf{p}_i$ 只有 $d''$ 個分量不是 0。課堂上的例子是 100 個特徵裡，這次選 3 個合起來算一個加權分數、在上面切一刀，下次再選另外 5 個；不會每次都把 100 個全部組合進去。
- 隨機子空間是它的特例：$d'' = 1$，而且 $\mathbf{p}_i$ 是 natural basis 裡的向量。
- original RF consider $d'$ random low-dimensional projections for each $b(\mathbf{x})$ in C&RT：原始的 RF 在每一次分支都重新產生 $d'$ 個這樣的隨機投影，C&RT 再從這 $d'$ 個新特徵裡找最好的 decision stump。

延續剛才的例子（本文自擬），把 $\mathrm{P}$ 換成各有 $d'' = 2$ 個非零分量的兩列：

$$
\mathrm{P} = \begin{bmatrix} 0 & 3 & 0 & -1 \\ 2 & 0 & 0 & 0.5 \end{bmatrix}, \qquad \mathrm{P}\begin{bmatrix} 1 \\ 2 \\ 3 \\ 4 \end{bmatrix} = \begin{bmatrix} 3 \times 2 - 4 \\ 2 \times 1 + 0.5 \times 4 \end{bmatrix} = \begin{bmatrix} 2 \\ 4 \end{bmatrix}
$$

第一個新特徵是 $3x_2 - x_4$。在它上面切一刀，例如 $3x_2 - x_4 \ge 1$，在原本的空間裡就是一條斜線，C&RT 原本只能切垂直或水平的刀。

這一頁最後把 RF 寫成

$$
\text{RF} = \text{bagging} + \text{random-combination C\&RT}
$$

並加上一句 randomness everywhere!。課堂上的說法是，難怪它叫 random forest：除了 bagging 的隨機，C&RT 每次分支的過程裡也有隨機。

把三層定義排在一起：

| 版本 | 每棵樹的資料 | 每次分支時考慮的特徵 |
|---|---|---|
| 基本版（第 3 頁） | bootstrap 抽 $N'$ 筆 | 全部 $d$ 個原始特徵 |
| random-subspace（第 4 頁） | 同上 | 隨機抽 $d'$ 個原始特徵，每次分支重抽 |
| random-combination（第 5 頁） | 同上 | $d'$ 個隨機組合，每個組合用到 $d''$ 個原始特徵，每次分支重抽 |

### Fun Time：隨機組合的分支等於哪一種假說

**題目（第 6 頁）：** RF 裡的樹是 random-combination C&RT 時，樹裡的每個分支函數 $b(\mathbf{x})$ 等價於下面哪一種假說？

1. 常數
2. decision stump
3. perceptron
4. 以上皆非

**答案：3。** 講義的解答是：每個 $b(\mathbf{x})$ 先用一個隨機向量把 $\mathbf{x}$ 投影下來，再跟門檻比大小做二元決定，這正是 perceptron 在做的事。寫成式子，在新特徵 $\phi_i(\mathbf{x}) = \mathbf{p}_i^\top\mathbf{x}$ 上的 decision stump 是

$$
b(\mathbf{x}) = \text{sign}\big(\mathbf{p}_i^\top\mathbf{x} - \theta\big)
$$

把 $-\theta$ 當成 $w_0$、$\mathbf{p}_i$ 當成其餘的權重，它就是[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 $\text{sign}(\mathbf{w}^\top\mathbf{x})$。用上面的例子，$3x_2 - x_4 \ge 1$ 這個分支對應 $\mathbf{w} = (-1, 0, 3, 0, -1)$。課堂上的總結是，有了投影之後，切的刀不再只有垂直刀與水平刀，還可以切斜的。

選項 1 不對，常數不會把資料分成兩邊。選項 2 只在特例成立：$d'' = 1$ 的隨機子空間版本裡，分支才是原始特徵上的 decision stump；一般的隨機組合用到不只一個特徵，在原始空間裡就不是 stump。本文補充一點：這個 perceptron 的方向 $\mathbf{p}_i$ 是隨機產生的，資料決定的只有「$d'$ 個候選方向裡選哪一個」和門檻 $\theta$，跟 PLA 從資料學出整個 $\mathbf{w}$ 不一樣。

## bootstrap 沒抽到的資料可以拿來做驗證

```youtube
url: https://www.youtube.com/watch?v=7oz5aO-FkR0
title: Random Forest :: Out-of-bag Estimate @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–01:26 是 OOB 的表格，01:26–04:24 算 OOB 有多少，04:24–10:25 與 validation 對照並定義 OOB error，10:25–11:54 用它做模型選擇，之後是 Fun Time。）

### 一張表：哪筆資料被哪棵樹用過

第 7 頁回到 bagging 的過程，把它列成一張表：每一列是一筆資料，每一行是一個 $g_t$。$(\mathbf{x}_n, y_n)$ 有被抽進 $\tilde{\mathcal{D}}_t$，那一格就寫 $\tilde{\mathcal{D}}_t$；沒被抽到就打一個星號。投影片上的表是這樣：

| | $g_1$ | $g_2$ | $g_3$ | $\cdots$ | $g_T$ |
|---|---|---|---|---|---|
| $(\mathbf{x}_1, y_1)$ | $\tilde{\mathcal{D}}_1$ | $\star$ | $\tilde{\mathcal{D}}_3$ | | $\tilde{\mathcal{D}}_T$ |
| $(\mathbf{x}_2, y_2)$ | $\star$ | $\star$ | $\tilde{\mathcal{D}}_3$ | | $\tilde{\mathcal{D}}_T$ |
| $(\mathbf{x}_3, y_3)$ | $\star$ | $\tilde{\mathcal{D}}_2$ | $\star$ | | $\tilde{\mathcal{D}}_T$ |
| $\cdots$ | | | | | |
| $(\mathbf{x}_N, y_N)$ | $\tilde{\mathcal{D}}_1$ | $\tilde{\mathcal{D}}_2$ | $\star$ | | $\star$ |

講義的定義：第 $t$ 行的 $\star$ 代表這筆資料沒有用來得到 $g_t$，稱為 $g_t$ 的 out-of-bag（OOB）examples。以第 1 行為例，$g_1$ 的訓練用到了第 1 筆與第 $N$ 筆，第 2、3 筆是它的 OOB 資料。

### 每棵樹大約有多少 OOB 資料

第 8 頁先把問題講清楚：一筆資料是 $g_t$ 的 OOB，等於抽了 $N'$ 次之後一次都沒抽到它。講義只算 $N' = N$ 的情況，推導分三步。

**第一步：單次沒抽到的機率。** bootstrap 每次從 $N$ 筆裡均勻地抽一筆，抽到 $(\mathbf{x}_n, y_n)$ 的機率是 $\frac{1}{N}$，沒抽到的機率是 $1 - \frac{1}{N}$。

**第二步：$N$ 次都沒抽到。** 每次抽完都放回去，所以各次互相獨立，機率直接相乘：

$$
P\big((\mathbf{x}_n, y_n) \text{ 是 } g_t \text{ 的 OOB}\big) = \Big(1 - \frac{1}{N}\Big)^N
$$

**第三步：$N$ 很大時的近似。** 講義把它改寫成認得出來的形式：

$$
\Big(1 - \frac{1}{N}\Big)^N = \Big(\frac{N-1}{N}\Big)^N = \frac{1}{\big(\frac{N}{N-1}\big)^N} = \frac{1}{\big(1 + \frac{1}{N-1}\big)^N} \approx \frac{1}{e}
$$

第一個等號是通分，第二個是把分數倒過來放到分母，第三個是 $\frac{N}{N-1} = \frac{(N-1)+1}{N-1} = 1 + \frac{1}{N-1}$。課堂上說，前面這幾步都只是簡單的化簡，目的是拆出一個比較眼熟的項；最後的近似用的是微積分裡的極限 $\lim_{m\to\infty}(1 + \frac{1}{m})^m = e$。本文把最後一步補完整：令 $m = N - 1$，分母是

$$
\Big(1 + \frac{1}{m}\Big)^{m+1} = \Big(1 + \frac{1}{m}\Big)^{m} \cdot \Big(1 + \frac{1}{m}\Big) \ \longrightarrow\ e \cdot 1 = e
$$

所以整個式子趨近 $\frac{1}{e} \approx 0.3679$。講義的結論是

$$
\text{OOB size per } g_t \approx \frac{1}{e} N
$$

本文用 Python 算了幾個 $N$ 的實際值，看這個近似有多快變準：

| $N$ | $(1 - \frac{1}{N})^N$ | 平均每棵樹的 OOB 筆數 |
|---|---|---|
| 2 | 0.2500 | 0.50 |
| 5 | 0.3277 | 1.64 |
| 10 | 0.3487 | 3.49 |
| 100 | 0.3660 | 36.6 |
| 1126 | 0.3677 | 414.0 |
| $\infty$ | $1/e = 0.3679$ | $0.3679N$ |

$N = 10$ 時就已經在 0.35 附近，$N = 100$ 之後和 $1/e$ 只差在小數第三位。課堂上口頭把這個比例粗估成「三分之一左右」，說 100 筆資料大概有 30 筆左右是 OOB；照 $1/e$ 算是 36.8 筆，比三分之一再多一點。

講義只處理 $N' = N$。課堂上提了一句，抽的次數不是 $N$ 的話結果會有些不同。本文補充一般的情況：把第二步的次方換成 $N'$，

$$
\Big(1 - \frac{1}{N}\Big)^{N'} = \bigg[\Big(1 - \frac{1}{N}\Big)^{N}\bigg]^{N'/N} \approx e^{-N'/N}
$$

抽得愈少，OOB 的比例愈高。講義第 17 到 19 頁的示範圖用的是 $N' = N/2$，那時的比例留在自我檢查第 1 題。

### OOB 資料就像驗證資料

第 9 頁把 OOB 的表和[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)的 validation 放在一起。validation 的做法是把資料切成 $\mathcal{D}_{\text{train}}$ 與 $\mathcal{D}_{\text{val}}$，只用 $\mathcal{D}_{\text{train}}$ 訓練出 $g_m^-$，再用 $\mathcal{D}_{\text{val}}$ 衡量它。課堂上重講了一次它為什麼可信：驗證資料沒有被用來得到 $g_m^-$，要是用過，就不能拿來驗證了。

OOB 的表有一樣的結構。$g_t$ 只用了表上寫 $\tilde{\mathcal{D}}_t$ 的那些資料，打星號的資料它完全沒看過。講義的說法是 $\star$ like $\mathcal{D}_{\text{val}}$: 'enough' random examples unused during training。課堂上補了「enough」的意思：一般做 validation 可能只留五分之一或十分之一的資料，這裡每棵樹大約有三分之一的資料沒用到。

接下來講義問了兩個問題。

**用 $\star$ 驗證 $g_t$？** 講義回答 easy, but rarely needed。做法很直接，拿 $g_t$ 的 OOB 資料算它的錯誤率就好。不常需要的理由是課堂上講的：bagging 與 RF 是 aggregation，目的是得到 $G$，不是想知道個別的 $g_t$ 好不好。

**用 $\star$ 驗證 $G$？** 不能直接拿任何一筆資料去測 $G$，因為 $G$ 裡一定有某些樹看過它。課堂上說這裡唯一的重點是讓打星號的資料不受污染，做法是換成一筆一筆來看：對 $(\mathbf{x}_n, y_n)$ 來說，它可以當哪些樹的驗證資料？就是它那一列上打星號的那些 $g_t$。把這些樹組成一個比較小的森林，記作 $G_n^-$，那麼 $(\mathbf{x}_n, y_n)$ 對 $G_n^-$ 來說是完全沒看過的資料。課堂上解釋了那個減號：這個森林比完整的 $G$ 小一點。validation 裡的 $g_m^-$ 也是同樣的意思，用比較少的資料訓練出來的。

講義舉的例子是最後一列。第 9 頁的表把 $(\mathbf{x}_N, y_N)$ 那一列畫成只有 $g_1$ 用過它（和第 7 頁的表在 $g_2$ 那一格不同），其餘都是星號，所以

$$
G_N^-(\mathbf{x}) = \text{average}(g_2, g_3, g_T)
$$

課堂上強調 $g_1$ 不能放進來，因為 $(\mathbf{x}_N, y_N)$ 有用來學 $g_1$。對每一筆資料都這樣做，再把誤差平均，就是 OOB error：

$$
E_{\text{oob}}(G) = \frac{1}{N}\sum_{n=1}^{N} \text{err}\big(y_n,\ G_n^-(\mathbf{x}_n)\big)
$$

課堂上說這有點像基石第 15 堂的 leave-one-out cross validation：每一筆資料都輪流當一次驗證資料，看表現如何，最後取平均。講義把 $E_{\text{oob}}$ 稱為 self-validation of bagging/RF。課堂上的講法是，$G$ 做好的那一刻，bootstrap 的過程就已經讓你大致知道它表現好不好，不用另外再跑一次驗證。

本文補充兩個實作上會碰到的細節。第一，如果某筆資料被每一棵樹都抽到，它的 $G_n^-$ 是空的，沒辦法算。一筆資料被某棵樹抽到的機率約 $1 - \frac{1}{e} \approx 0.632$，被 $T$ 棵樹全部抽到的機率約 $0.632^T$：$T = 5$ 時是 0.101，$T = 20$ 時是 0.0001，樹一多就可以忽略。第二，每筆資料的 $G_n^-$ 大約只有 $T/e$ 棵樹，比完整的 $G$ 小，所以 $E_{\text{oob}}$ 估的是一個比較小的森林的表現。

### 數值例子：八筆資料、五棵樹，手算 OOB 誤差

以下是本文自擬的例子，不在講義上，所有數字用純 Python 另外算過一遍。情境沿用基石的信用卡核卡：八位申請人，$x_1$ 是年收入（萬元），$x_2$ 是申請書流水號的末碼（跟核卡無關，放進來是為了後面算特徵重要度），$y = +1$ 代表核卡。

| $n$ | $x_1$（年收入） | $x_2$（流水號末碼） | $y_n$ |
|---|---|---|---|
| 1 | 28 | 6 | $-1$ |
| 2 | 35 | 1 | $-1$ |
| 3 | 41 | 8 | $-1$ |
| 4 | 50 | 3 | $-1$ |
| 5 | 62 | 5 | $+1$ |
| 6 | 68 | 9 | $+1$ |
| 7 | 77 | 2 | $+1$ |
| 8 | 90 | 7 | $+1$ |

用基本版的 RF：$T = 5$、$N' = N = 8$、每棵樹是完全長成的 C&RT（Gini impurity，門檻取相鄰兩個值的中點）。五份 bootstrap 資料是用亂數抽出來之後固定下來的。為了能手算，本文挑了一組「每棵樹都只需要切一刀」而且「每筆資料至少有一棵樹沒看過它」的抽樣結果。

**第一步：抽樣，找出每棵樹的 OOB 資料。**

| $t$ | $\tilde{\mathcal{D}}_t$（依抽出的順序列出資料編號） | $g_t$ 的 OOB 資料 |
|---|---|---|
| 1 | 7, 3, 1, 5, 7, 5, 8, 8 | 2, 4, 6 |
| 2 | 5, 6, 2, 5, 3, 4, 5, 4 | 1, 7, 8 |
| 3 | 7, 8, 4, 3, 4, 3, 4, 4 | 1, 2, 5, 6 |
| 4 | 8, 8, 5, 1, 1, 2, 3, 4 | 6, 7 |
| 5 | 5, 8, 6, 7, 4, 5, 6, 4 | 1, 2, 3 |

五棵樹的 OOB 筆數是 3、3、4、2、3，平均 3.0 筆。公式給的期望值是 $8 \times (\frac{7}{8})^8 = 2.75$ 筆，用 $N/e$ 近似是 2.94 筆。

**第二步：每棵樹各自跑 C&RT。** 以 $g_1$ 為例。$\tilde{\mathcal{D}}_1$ 裡有第 1、3 筆（各一次，$y = -1$）與第 5、7、8 筆（各兩次，$y = +1$）。C&RT 要在所有「特徵加門檻」的組合裡，挑讓 $\sum_c \lvert\mathcal{D}_c\rvert \cdot \text{impurity}(\mathcal{D}_c)$ 最小的。$x_1$ 上的候選門檻與結果：

| 分支 | 左邊（小於門檻） | 右邊 | 加權 impurity |
|---|---|---|---|
| $x_1$ 對 34.5 | 1 筆，全是 $-1$ | 7 筆，1 負 6 正 | $1 \times 0 + 7 \times \frac{12}{49} = \frac{12}{7}$ |
| $x_1$ 對 51.5 | 2 筆，全是 $-1$ | 6 筆，全是 $+1$ | $0$ |
| $x_1$ 對 69.5 | 4 筆，2 負 2 正 | 4 筆，全是 $+1$ | $4 \times \frac{1}{2} + 0 = 2$ |
| $x_1$ 對 83.5 | 6 筆，2 負 4 正 | 2 筆，全是 $+1$ | $6 \times \frac{4}{9} + 0 = \frac{8}{3}$ |

其中 Gini 的算法是 $1 - \sum_k (\frac{N_k}{N})^2$，例如 1 負 6 正是 $1 - \frac{1}{49} - \frac{36}{49} = \frac{12}{49}$。$x_2$ 上的四個候選門檻（3.5、5.5、6.5、7.5）算出來是 $\frac{8}{3}$、$2$、$\frac{44}{15}$、$\frac{12}{7}$，沒有一個是 0。所以 $g_1$ 的第一刀是「$x_1$ 對 51.5」，切完兩邊都已經全純，達到終止條件，這棵完全長成的樹只有一層：

$$
g_1(\mathbf{x}) = \text{sign}(x_1 - 51.5)
$$

51.5 是 $\tilde{\mathcal{D}}_1$ 裡最大的負例（第 3 筆，41）與最小的正例（第 5 筆，62）的中點。其他四棵樹同樣只切一刀，而且都切在 $x_1$ 上（每棵樹在 $x_2$ 上的候選都沒有全純的）：

| $t$ | 袋中最大的負例 | 袋中最小的正例 | $g_t$ 的門檻 |
|---|---|---|---|
| 1 | 第 3 筆，41 | 第 5 筆，62 | 51.5 |
| 2 | 第 4 筆，50 | 第 5 筆，62 | 56 |
| 3 | 第 4 筆，50 | 第 7 筆，77 | 63.5 |
| 4 | 第 4 筆，50 | 第 5 筆，62 | 56 |
| 5 | 第 4 筆，50 | 第 5 筆，62 | 56 |

同一份原始資料，五棵樹的門檻有三種。$g_3$ 沒抽到第 5、6 筆，它看到的最小正例是 77，門檻就被推到 63.5。這就是講義說的 variance：資料換一批，樹就不一樣。

**第三步：畫出 OOB 表，算每筆資料的 $G_n^-$。** 「袋」代表那筆資料在 $\tilde{\mathcal{D}}_t$ 裡，$\star$ 代表 OOB。

| $n$ | $x_1$ | $y_n$ | $g_1$ | $g_2$ | $g_3$ | $g_4$ | $g_5$ | $G_n^-$ 裡的樹與它們的預測 | $G_n^-(\mathbf{x}_n)$ | 錯？ |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 28 | $-1$ | 袋 | $\star$ | $\star$ | 袋 | $\star$ | $g_2, g_3, g_5$：$-,-,-$ | $-1$ | |
| 2 | 35 | $-1$ | $\star$ | 袋 | $\star$ | 袋 | $\star$ | $g_1, g_3, g_5$：$-,-,-$ | $-1$ | |
| 3 | 41 | $-1$ | 袋 | 袋 | 袋 | 袋 | $\star$ | $g_5$：$-$ | $-1$ | |
| 4 | 50 | $-1$ | $\star$ | 袋 | 袋 | 袋 | 袋 | $g_1$：$-$ | $-1$ | |
| 5 | 62 | $+1$ | 袋 | 袋 | $\star$ | 袋 | 袋 | $g_3$：$-$ | $-1$ | 錯 |
| 6 | 68 | $+1$ | $\star$ | 袋 | $\star$ | $\star$ | 袋 | $g_1, g_3, g_4$：$+,+,+$ | $+1$ | |
| 7 | 77 | $+1$ | 袋 | $\star$ | 袋 | $\star$ | 袋 | $g_2, g_4$：$+,+$ | $+1$ | |
| 8 | 90 | $+1$ | 袋 | $\star$ | 袋 | 袋 | 袋 | $g_2$：$+$ | $+1$ | |

以第 5 筆為例：只有 $g_3$ 沒看過它，所以 $G_5^- = g_3$。$g_3$ 的門檻是 63.5，$x_1 = 62 < 63.5$，預測 $-1$，和 $y_5 = +1$ 不合。八筆裡錯一筆：

$$
E_{\text{oob}}(G) = \frac{1}{8} = 0.125
$$

**第四步：和 $E_{\text{in}}$ 比。** 用全部五棵樹投票的 $G$ 去看第 5 筆：$g_1, g_2, g_4, g_5$ 的門檻都低於 62，投 $+1$；只有 $g_3$ 投 $-1$。四比一，$G$ 答對。其他七筆五棵樹的意見一致，也都對。所以 $E_{\text{in}}(G) = 0$。

**這個結果代表什麼。** $E_{\text{in}} = 0$ 是因為四棵看過第 5 筆的樹當然會把它分對，這個數字沒有告訴我們新資料來了會怎樣。$E_{\text{oob}}$ 只問沒看過那筆資料的樹，結果暴露出一件 $E_{\text{in}}$ 看不到的事：年收入落在 50 到 77 之間的人，樹有沒有抽到附近的資料會影響門檻，預測就可能出錯。新來的申請人剛好就是所有樹都沒看過的資料，$E_{\text{oob}}$ 模擬的正是這個情況。只有八筆資料時這個估計當然很粗（一筆資料就是 0.125），重點是計算的程序。

### 用 OOB 誤差選模型

第 10 頁把基石第 15 堂的模型選擇流程和 RF 的版本並排：

| | 以前：用 $E_{\text{val}}$ 選 | RF：用 $E_{\text{oob}}$ 選 |
|---|---|---|
| 每個候選的分數 | $E_m = E_{\text{val}}(\mathcal{A}_m(\mathcal{D}_{\text{train}}))$ | $E_m = E_{\text{oob}}(\text{RF}_m(\mathcal{D}))$ |
| 選誰 | $m^* = \text{argmin}_{1 \le m \le M} E_m$ | $m^* = \text{argmin}_{1 \le m \le M} E_m$ |
| 最後交出去的 | $g_{m^*} = \mathcal{A}_{m^*}(\mathcal{D})$ | $G_{m^*} = \text{RF}_{m^*}(\mathcal{D})$ |

左邊每個候選要訓練兩次：先在 $\mathcal{D}_{\text{train}}$ 上訓練才能算 $E_{\text{val}}$，選出 $m^*$ 之後還要用完整的 $\mathcal{D}$ 再訓練一次。右邊每個候選直接用完整的 $\mathcal{D}$ 訓練，$E_{\text{oob}}$ 是順便算出來的，選中的那個 $\text{RF}_{m^*}(\mathcal{D})$ 已經是成品。講義把這寫成兩點：use $E_{\text{oob}}$ for self-validation of RF parameters such as $d''$，以及 no re-training needed。課堂上舉的可選參數比講義多一些：隨機投影要用幾個維度的 $d''$，以及決策樹本身的其他參數或 heuristic。

這一頁最後一行是 $E_{\text{oob}}$ often accurate in practice。課堂上的說法是，在 RF 的實務上，用 OOB 誤差衡量 $G$ 的表現通常相當準。這是經驗上的陳述，講義沒有給理論保證。

### Fun Time：1126 筆資料，沒被抽到的機率

**題目（第 11 頁）：** 資料有 $N = 1126$ 筆，bootstrap 抽 $N' = N$ 次之後，$(\mathbf{x}_{1126}, y_{1126})$ 沒被抽到的機率是多少？

1. 0.113
2. 0.368
3. 0.632
4. 0.887

**答案：2。** 講義的解答：$(1 - \frac{1}{N})^N$ 在 $N = 1126$ 時約是 0.367716，接近 $\frac{1}{e} = 0.367879$。本文用 Python 驗算，$(\frac{1125}{1126})^{1126} = 0.367716$，兩者差 0.00016。課堂上說，不管用估計的還是真的把機率算出來，答案都在 0.368 附近。

選項 3 的 0.632 是 $1 - 0.368$，也就是這筆資料「至少被抽到一次」的機率，把題目問的事件看反了就會選它。選項 1 與 4 加起來也是 1，但 0.113 與 0.887 都對不上推導裡的任何一個量。題目問的是第 1126 筆，換成任何一筆答案都一樣，因為每一筆被抽到的機會均等。

## 哪些特徵重要：permutation test 加上 OOB

```youtube
url: https://www.youtube.com/watch?v=ChqNC94JXtM
title: Random Forest :: Feature Selection @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–04:49 是特徵選擇的動機與利弊，04:49–05:45 決策樹內建的選擇，05:45–09:07 用重要度排序與線性模型，09:07–13:23 permutation test，13:23–18:35 原始 RF 的做法，之後是 Fun Time。）

### 特徵選擇想解決什麼

第 12 頁定義問題：輸入 $\mathbf{x} = (x_1, x_2, \dots, x_d)$ 裡，想拿掉兩種特徵。

- **redundant（冗餘的）：** 講義的例子是「年齡」與「完整的生日」留一個就好。課堂上用病歷來講：表上有時要你填年齡、有時要你填生日，兩個都填資訊就重複了，從生日算得出年齡。
- **irrelevant（無關的）：** 講義的例子是用保險類型預測癌症。課堂上說，病人有沒有得癌症是身體的狀況，跟他保什麼險不應該有關係，但病歷表上就是有這一欄。

拿掉之後，等於只學一個「取子集」的轉換 $\boldsymbol{\Phi}(\mathbf{x}) = (x_{i_1}, x_{i_2}, \dots, x_{i_{d'}})$，$d' < d$，再用 $g(\boldsymbol{\Phi}(\mathbf{x}))$ 做預測。課堂上用的數字是從一萬維選出三百維，並且提醒這跟以前的特徵轉換方向相反：以前是往高維度轉，這次是往低維度。

講義把好處與壞處各列三點，課堂上指出兩邊是一一對應的：

| 好處 | 對應的壞處 |
|---|---|
| **efficiency**：假說比較簡單，預測時間比較短 | **computation**：訓練時要解組合最佳化問題 |
| **generalization**：拿掉了 feature noise | **overfit**：組合式的選擇本身可能 overfit |
| **interpretability**：留下來的特徵可以解讀 | **mis-interpretability**：解讀可能是錯的 |

課堂上先用一萬維選三百維說明左欄：選完之後，訓練和預測都只在三百維上做；選得好的話，等於排除了其餘九千七百維裡的雜訊，比較不容易 overfit；留下來的三百維還可以拿去做後續分析，例如醫藥應用想知道哪些項目和要預測的事有關。接著逐條說明右欄。效率是選完之後的事，但一萬個裡要選哪三百個是組合問題，力氣可能都花在選的階段。選對了能排除雜訊，但組合那麼多，很可能選到一組看起來好、其實沒那麼好的特徵。至於解讀，選擇的過程如果已經 overfit，解讀就是錯的；即使沒有，這些解讀也可能只說明了關聯，不能說明因果。

這一頁的最後一句是 decision tree: a rare model with built-in feature selection。課堂上的解釋：決策樹每次都要挑一個特徵來切，挑的過程就是在做選擇；SVM 則是把所有特徵都丟進去算。AdaBoost 配 decision stump 也有同樣的性質，每一輪都選一個特徵切一刀。

### 先把組合問題換成排序問題

第 13 頁的想法是：如果能替每個特徵算出一個分數 $\text{importance}(i)$，$i = 1, 2, \dots, d$，就可以直接挑分數最高的 $d'$ 個。課堂上明講了這個做法放棄的東西：它不考慮特徵之間的交互關係，只看每個特徵個別的重要性。換來的是不必面對組合爆炸。

線性模型很容易做到這件事。線性模型的分數是

$$
\text{score} = \mathbf{w}^\top\mathbf{x} = \sum_{i=1}^{d} w_i x_i
$$

講義給的直覺估計是 $\text{importance}(i) = \lvert w_i \rvert$，其中 $\mathbf{w}$ 要是一個「好的」$\mathbf{w}$，而好的 $\mathbf{w}$ 就是從資料學出來的。課堂上的說明：$\lvert w_i \rvert$ 大，第 $i$ 個特徵在算分數時占的份量就重；$\lvert w_i \rvert$ 小，它幾乎不影響分數。課堂上還提到，用這個方法挑出特徵之後，第二階段要接線性或非線性的模型都可以，特徵選擇和後面的學習是分開的兩步。課堂上還加了一個講義沒寫的前提：各個特徵 $x_i$ 的數值範圍不能差太多，這個比較才有意義。本文補一個例子：把同一個收入特徵從「萬元」改成「元」，$w_i$ 會縮小一萬倍，但這個特徵的重要性沒有變。

講義接著寫 non-linear models? often much harder。課堂上的理由是，非線性模型裡各個特徵的作用交雜在一起，很難替單一個特徵釐清出一個衡量重要性的數字。RF 是非線性模型，但它內部的機制讓這件事變得相對容易，這就是接下來兩頁的內容。

### permutation test：把一個特徵洗牌，看表現掉多少

第 14 頁的想法叫 random test：如果特徵 $i$ 是需要的，把 $x_{n,i}$ 換成隨機的值，表現就會變差。課堂上的講法是，它對你很重要，結果你塞了一些垃圾進去，表現當然會變差；比較塞之前和塞之後的表現，差距就告訴你這個特徵有多重要。

塞什麼隨機值進去？講義比較了兩類：

- **均勻分布、高斯分布⋯⋯** 講義的註解是 $P(x_i)$ changed。課堂上解釋：原始資料在這個特徵上可能根本不是高斯分布，硬塞高斯亂數進去，量到的表現差距就混了兩個原因，一個是分布被改掉了，一個才是我們想量的雜訊的影響。
- **bootstrap、permutation。** 講義的註解是 $P(x_i)$ approximately remained。兩者都只從這個特徵原有的值 $\{x_{n,i}\}_{n=1}^{N}$ 裡取。

permutation 就是把這 $N$ 個值隨機重新排列。課堂上用洗牌來比喻：52 張牌洗一洗，再放回 52 個位置，牌還是那些牌。從整體看，這個特徵的分布沒有變；但對每一筆資料來說，值已經亂掉了，課堂上的例子是 A 病人的數值跑到 B 病人那裡、B 病人的跑到 C 病人那裡。這樣量到的差距就只反映「這個特徵和其他特徵、和 $y$ 之間的對應被打斷」這一件事。

於是 permutation test 定義為

$$
\text{importance}(i) = \text{performance}(\mathcal{D}) - \text{performance}(\mathcal{D}^{(p)})
$$

其中 $\mathcal{D}^{(p)}$ 是把 $\mathcal{D}$ 的第 $i$ 個特徵 $\{x_{n,i}\}$ 換成打亂後的 $\{x_{n,i}\}_{n=1}^{N}$。講義強調這是 a general statistical tool for arbitrary non-linear models like RF，不是 RF 專屬的。

### 原始 RF 的做法：不重新訓練，只在驗證時動手腳

第 15 頁處理剩下的問題：兩個 performance 要怎麼量。

照定義，$\text{performance}(\mathcal{D}^{(p)})$ 要拿打亂後的資料重新訓練一個模型，再做驗證。講義說這 needs re-training and validation in general。$d$ 個特徵就要重新訓練 $d$ 次。

先處理驗證。講義問 'escaping' validation?，答案是剛學到的 OOB：RF 不需要另外的驗證資料，performance 可以直接用 $E_{\text{oob}}$。原始資料的那一項就是 $E_{\text{oob}}(G)$。

再處理重新訓練。照剛才的邏輯，另一項應該是 $E_{\text{oob}}(G^{(p)})$，$G^{(p)}$ 是用 $\mathcal{D}^{(p)}$ 重新訓練出來的森林。課堂上的說法是：我很懶，不想重新訓練，那就投機取巧一下，把 $E_{\text{oob}}(G^{(p)})$ 換成 $E_{\text{oob}}^{(p)}(G)$。兩者的差別在 $(p)$ 放的位置：

- $E_{\text{oob}}(G^{(p)})$：訓練時就用打亂的資料，得到另一個森林。
- $E_{\text{oob}}^{(p)}(G)$：森林 $G$ 不動，只在算 OOB 誤差的時候打亂。

講義寫成

$$
\text{importance}(i) = E_{\text{oob}}(G) - E_{\text{oob}}^{(p)}(G)
$$

並說明 $E_{\text{oob}}^{(p)}$ comes from replacing each request of $x_{n,i}$ by a permuted OOB value。課堂上把這句話拆開講：算 OOB 誤差時要算 $g_t(\mathbf{x}_n)$，$g_t$ 是一棵決策樹，走到某個節點可能要用到 $x_{n,i}$ 的值，這時就把它換掉。換成誰的值？原作者的建議是不要從全部資料裡取，只從「對 $g_t$ 來說是 OOB」的那些資料裡取。課堂上給的理由是，這樣換進來的值仍然是 $g_t$ 沒看過的，完全沒有碰到訓練的過程，量出來會比較準。

這一頁的結論是 RF feature selection via permutation + OOB: often efficient and promising in practice。課堂上說得更具體：RF 的特徵選擇在實務上很好用，很多人碰到非線性的問題時，會先用 RF 做初步的特徵選擇。

本文補充一個讀式子時要注意的地方。講義第 14 頁寫的是 performance，愈大愈好，重要的特徵會讓 $\text{performance}(\mathcal{D}) - \text{performance}(\mathcal{D}^{(p)})$ 是正的。第 15 頁把 performance 直接換成 $E_{\text{oob}}$，而 $E_{\text{oob}}$ 是誤差，愈小愈好；重要的特徵被打亂後誤差會上升，照式子的字面算出來的 $E_{\text{oob}}(G) - E_{\text{oob}}^{(p)}(G)$ 是負數。講義與課堂都是直接把 performance 代換成 $E_{\text{oob}}$，要比的是打亂前後兩個量差多少，沒有另外調整正負號。讀的時候看差距的大小就好：誤差上升了多少，也就是 $E_{\text{oob}}^{(p)}(G) - E_{\text{oob}}(G)$，上升愈多愈重要。

### 數值例子（續）：算兩個特徵的重要度

接著用八筆資料、五棵樹的例子，仍是本文自擬。基準是 $E_{\text{oob}}(G) = \frac{1}{8}$。

**先看 $x_2$（流水號末碼）。** 五棵樹都只在 $x_1$ 上切，沒有任何一個節點會用到 $x_2$ 的值。不管 $x_2$ 被換成什麼，每個 $g_t(\mathbf{x}_n)$ 都不變，所以

$$
E_{\text{oob}}^{(p)}(G) = \frac{1}{8}, \qquad \text{importance}(2) = \frac{1}{8} - \frac{1}{8} = 0
$$

**再看 $x_1$（年收入）。** 打亂應該是隨機的。為了能手算，這裡固定用一種排法：每棵樹的 OOB 資料依編號排成一圈，每一筆改用下一筆的 $x_1$。

| $t$ | 門檻 | OOB 資料 | 換進來的 $x_1$ |
|---|---|---|---|
| 1 | 51.5 | 2, 4, 6 | 第 2 筆拿 50，第 4 筆拿 68，第 6 筆拿 35 |
| 2 | 56 | 1, 7, 8 | 第 1 筆拿 77，第 7 筆拿 90，第 8 筆拿 28 |
| 3 | 63.5 | 1, 2, 5, 6 | 第 1 筆拿 35，第 2 筆拿 62，第 5 筆拿 68，第 6 筆拿 28 |
| 4 | 56 | 6, 7 | 第 6 筆拿 77，第 7 筆拿 68 |
| 5 | 56 | 1, 2, 3 | 第 1 筆拿 35，第 2 筆拿 41，第 3 筆拿 28 |

同一筆資料在不同的樹裡拿到的值不一樣，因為每棵樹是在自己的 OOB 資料裡各自打亂。重新算每筆資料的 $G_n^-$：

| $n$ | $y_n$ | 每棵 OOB 樹看到的 $x_1$ 與預測 | 投票結果 | 錯？ |
|---|---|---|---|---|
| 1 | $-1$ | $g_2$：77，$+$；$g_3$：35，$-$；$g_5$：35，$-$ | $-1$ | |
| 2 | $-1$ | $g_1$：50，$-$；$g_3$：62，$-$；$g_5$：41，$-$ | $-1$ | |
| 3 | $-1$ | $g_5$：28，$-$ | $-1$ | |
| 4 | $-1$ | $g_1$：68，$+$ | $+1$ | 錯 |
| 5 | $+1$ | $g_3$：68，$+$ | $+1$ | |
| 6 | $+1$ | $g_1$：35，$-$；$g_3$：28，$-$；$g_4$：77，$+$ | $-1$ | 錯 |
| 7 | $+1$ | $g_2$：90，$+$；$g_4$：68，$+$ | $+1$ | |
| 8 | $+1$ | $g_2$：28，$-$ | $-1$ | 錯 |

錯三筆，$E_{\text{oob}}^{(p)}(G) = \frac{3}{8}$。照講義的式子，

$$
\text{importance}(1) = \frac{1}{8} - \frac{3}{8} = -\frac{1}{4}
$$

也就是誤差上升了 0.25。第 5 筆原本是錯的，這次反而對了，因為它碰巧拿到 68 這個也屬於正例的值；打亂之後不見得每一筆都變差。

**這個結果代表什麼。** $x_1$ 被打亂後 OOB 誤差從 0.125 升到 0.375，$x_2$ 被打亂完全沒有影響，排序是 $x_1$ 比 $x_2$ 重要，和資料的設計一致。整個過程沒有重新訓練任何一棵樹，只重跑了預測。

單獨一次打亂的結果帶有運氣成分。本文用程式把這個例子所有可能的排法全部列舉（五棵樹的 OOB 各自排列，共 $3! \times 3! \times 4! \times 2! \times 3! = 10{,}368$ 種組合，投票平手算半個錯誤），$E_{\text{oob}}^{(p)}$ 最低是 0、最高是 $\frac{5}{8}$，平均是 $\frac{7}{24} \approx 0.292$。平均來說誤差仍然上升（0.125 到 0.292），但有 2.8% 的排法碰巧讓誤差降到 0。資料只有八筆時，一次打亂的數字不能太當真；資料多、樹多的時候這個波動才會小。

### Fun Time：常數特徵的重要度

**題目（第 16 頁）：** 對 RF 來說，如果資料的第 1126 個特徵是常數 5566，$\text{importance}(i)$ 會是多少？

1. 0
2. 1
3. 1126
4. 5566

**答案：1。** 講義的解答：特徵是常數時，permutation 不會改變它的值，$E_{\text{oob}}(G)$ 與 $E_{\text{oob}}^{(p)}(G)$ 相同，所以 $\text{importance}(i) = 0$。課堂上的說法是，不管怎麼隨機排，在那個特徵上永遠都拿到 5566，和原來一樣，OOB 的表現也就一模一樣。

選項 2、3、4 都是題目裡出現的數字或湊出來的數字，重要度是兩個誤差的差，不會等於特徵的編號或特徵的值。本文補充：這題的 0 還有另一個來源。常數特徵在任何門檻下都沒辦法把資料分成兩邊，C&RT 根本不會拿它來分支，所以沒有任何一棵樹會用到它的值；這和上面例子裡 $x_2$ 的重要度是 0 是同一個道理。反過來要小心的是，重要度 0 只代表「這個森林沒有靠它」，不保證這個特徵和 $y$ 完全無關。

## 實際跑起來的樣子，以及要幾棵樹

```youtube
url: https://www.youtube.com/watch?v=Ipfpf7AW_yM
title: Random Forest :: Random Forest in Action @ Machine Learning Techniques (機器學習技法)
```

（影片 00:01–05:28 是簡單的資料，05:28–06:26 複雜的資料，06:26–07:44 加了雜訊的資料，07:44–11:10 談要幾棵樹，11:10–11:37 是 Fun Time，之後是總結。）

這一節的投影片幾乎都是圖。三組資料都是二維平面上的二元分類，圈圈是一類、叉叉是另一類，背景用藍色與紅色表示模型預測成哪一類，黑線是邊界。三頁的圖都標了 $g_t\ (N' = N/2)$，每棵樹的 bootstrap 只抽一半的資料量。第 17 頁另外標明樹是 C&RT with random combination；第 18、19 頁沒有再標，圖上單棵樹的邊界同樣是斜線。

### 簡單的資料：樹愈多，邊界愈平滑

第 17 頁有三格圖，投影片一張一張把 $t$ 從 1 加到 1000。

| 圖 | 畫的是什麼 | 看到什麼 |
|---|---|---|
| 左（固定不變） | 不做 bagging，用全部資料訓練一棵 random-combination C&RT | 邊界由好幾段斜線拼成，把平面切成不規則的多邊形 |
| 中 | 第 $t$ 棵樹 $g_t$。大的圈叉是被 bootstrap 抽到的資料，小點是沒抽到的 | 每棵樹的邊界都不一樣，常常只是一兩條斜線，沒抽到的點有些被分錯 |
| 右 | 前 $t$ 棵樹投票出來的 $G$ | 隨 $t$ 變化，見下 |

右圖的變化，依課堂上的描述：

- $t = 1$：只有一棵樹，$G$ 的邊界和中間那棵樹一模一樣，有些點分錯。
- $t = 100$：邊界彎彎曲曲，課堂上說有點像變形蟲，看得出是很多棵不同的樹投票的結果，已經比任何一棵單獨的樹複雜得多。
- $t = 200$ 之後：邊界一路變平滑，雖然仍然不太規則。
- $t = 1000$：投影片的評語是 'smooth' and large-margin-like boundary with many trees。

課堂上拿 $t = 1000$ 的右圖和左邊那棵單獨的樹對比，指出兩件事。第一，森林的邊界大致通過圈圈與叉叉的中間，單獨那棵樹的邊界卻有一段剛好壓在某個叉叉旁邊。邊界離兩邊的點都遠，就是[技法第 1 堂：線性 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)講的 large margin。第二，森林的邊界平滑得多。課堂上的評語是，一堆亂亂的樹合起來能有這樣的性質很有趣，就像一堆鄉民的意見合起來，結果可以很不錯。講義的用詞是 large-margin-like，有那個樣子，但沒有說 RF 在最佳化 margin。

### 複雜的資料與加了雜訊的資料

第 18 頁換成一組點很多、真正的邊界是曲線的資料，只留中間與右邊兩格，$t$ 依序是 1、6、11、16、21。單獨一棵樹的邊界歪七扭八，有尖角；合到 21 棵時，右圖已經是一條相對平滑、貼著兩類交界的非線性邊界。投影片的評語是 'easy yet robust' nonlinear model。課堂上說，這條非線性的邊界是用很簡單的方法得到的，只是二十棵左右的決策樹而已，而且比左邊單獨的樹穩定得多。

第 19 頁用同一組資料，課堂上說明是加了 10% 的雜訊，$t$ 同樣從 1 走到 21。這次單獨的樹受到很大的影響：完全長成的樹一定要切到每一筆都分對，所以會在藍色的區域裡替幾個標錯的叉叉圍出小塊的紅色，反過來也一樣，課堂上說這些部分看起來就是在 overfit 雜訊。合到 21 棵樹時，主要的邊界還是做出來了，那些小塊大多消失，只剩少數幾處。投影片的評語是 noise corrected by voting。

本文補充為什麼投票能消掉這些小塊。一筆標錯的資料，只有抽到它的樹才會替它圍一小塊；$N' = N/2$ 時，每棵樹有六成的機會沒抽到它（自我檢查第 1 題），那些樹在這個位置會照周圍的多數來預測。投票時，替雜訊圍小塊的樹是少數。

### 要幾棵樹才夠

第 20 頁的第一行是 almost every theory: the more, the 'better'，前提是 assuming good $\bar{g} = \lim_{T\to\infty} G$。課堂上解釋，RF 的理論這堂沒有細講，但那些理論大多假設用無限多棵樹時會得到一個相對穩定、相對好的結果；有限多棵樹只是在逼近它。所以實際的問題是多少棵才算逼近得夠。

講義接著給了一個台大自己的經驗，標題是 Our NTU Experience：

- **比賽：** KDD Cup 2013 Track 1，預測作者與論文的關係（課堂上的說法是預測某個作者有沒有寫某一篇論文）。投影片在旁邊註了一句 yes, NTU is world champion again! :-)。
- **觀察：** 用幾千棵樹時，$E_{\text{val}}$ 落在 $[0.015, 0.019]$，depending on seed；同一個比賽前 20 名隊伍的 $E_{\text{out}}$ 落在 $[0.014, 0.019]$。
- **決定：** take 12000 trees with seed 1。

課堂上補了三件投影片沒寫的事。第一，那一年因為一些原因沒有用 OOB 誤差，直接算的是驗證誤差，所以投影片寫的是 $E_{\text{val}}$。第二，這兩個區間擺在一起的意思：亂數種子選得好，成績接近前三名；選得不好，就掉到第 20 名附近。同一個方法、同一份資料，只差在亂數。第三，最後的做法是在算得動的範圍內盡量把樹加多，種子用 1；課堂上說不要問為什麼是 1，只是當時覺得那是相對穩定的選擇。

講義由此寫下 RF 的缺點：may need lots of trees if the whole random process too unstable，並建議 should double-check stability of $G$ to ensure enough trees。課堂上的說法是，RF 是隨機性的演算法，如果隨機的過程還沒到穩定的狀態，或者你的問題對一點點變化很敏感（那場比賽名次之間的差距就很小），結果就會跟著亂數高高低低。實務上要看 $G$ 穩不穩定，多一棵樹、少一棵樹表現還在變的話，就是樹不夠，再多加一些。

### 本文補充：為什麼加樹會讓結果穩定下來

這一段的推理不在講義上，用來說明「樹不夠時結果會隨種子變」這件事。

資料 $\mathcal{D}$ 固定之後，每棵樹用的是各自獨立的亂數（自己的 bootstrap、自己的隨機投影）。所以在任何一個點 $\mathbf{x}$ 上，$T$ 棵樹的預測是 $T$ 次獨立的抽樣。假設一棵樹在這個點預測成圈圈的機率是 $p$。$p > 0.5$ 時，無限多棵樹的 $\bar{g}$ 在這個點會答圈圈。$T$ 棵樹的投票和 $\bar{g}$ 不一樣的機率，就是 $T$ 次裡圈圈沒有過半的二項分布機率（下表取 $T$ 是奇數，避開平手）：

| $p$ | $T = 1$ | $T = 5$ | $T = 25$ | $T = 101$ | $T = 1001$ |
|---|---|---|---|---|---|
| 0.60 | 0.400 | 0.317 | 0.154 | 0.021 | 小於 0.0001 |
| 0.55 | 0.450 | 0.407 | 0.306 | 0.156 | 0.001 |
| 0.51 | 0.490 | 0.481 | 0.460 | 0.420 | 0.263 |

例如 $p = 0.6$、$T = 5$：圈圈得 0、1、2 票的機率是 $0.4^5 + 5(0.6)(0.4)^4 + 10(0.6)^2(0.4)^3 = 0.01024 + 0.0768 + 0.2304 = 0.317$。

表裡看得到兩件事。離邊界遠的點（$p$ 離 0.5 遠），幾十棵樹就夠穩定。靠近邊界的點（$p$ 接近 0.5），一千棵樹都還有四分之一的機會和 $\bar{g}$ 不同，換一個種子答案就可能翻過來。簡單資料那組圖裡，$t = 100$ 的邊界彎彎曲曲、到 $t = 1000$ 才平滑，以及 KDD Cup 幾千棵樹時成績還隨種子變動，都可以從這個角度理解：晃動的是邊界附近那些點。這也是為什麼沒有一個放諸四海皆準的 $T$。

### Fun Time：哪一個不是 RF 的最佳用法

**題目（第 21 頁）：** 下面哪一個不是 Random Forest 的最佳用法？

1. 每棵樹用 bootstrap 抽出的資料訓練
2. 用 $E_{\text{oob}}$ 驗證表現
3. 用 permutation test 做特徵選擇
4. 把樹的數量 $T$ 固定在幸運數字 1126

**答案：4。** 講義的解答：好的 $T$ 取決於資料的性質與整個隨機過程的穩定性。課堂上說，隨著資料不同、過程的穩定程度不同，需要的樹的數量也不同。

選項 1、2、3 各是這堂課前面三個主題的主角：bootstrap 是 RF 定義的一部分，$E_{\text{oob}}$ 是它附帶的自我驗證，permutation test 是講義介紹的特徵重要度算法。選項 4 的問題不在 1126 這個數字太大或太小，在於沒有檢查就把它固定下來；照講義的建議，應該看 $G$ 穩定了沒有。

第 22 頁的總結把四節各收成一句：bag of trees on randomly projected subspaces；self-validation with OOB examples；permutation test for feature importance；'smooth' boundary with many trees。下一堂的預告是 boosted decision trees beyond classification：把決策樹和 AdaBoost 這類 boosting 合起來，並且延伸到分類以外的問題。

## 自我檢查

**1. 示範圖裡每棵樹的 bootstrap 只抽 $N' = N/2$ 筆。$N$ 很大時，一筆資料是某棵樹的 OOB 的機率大約是多少？比 $N' = N$ 時高還是低？**

答案：$(1 - \frac{1}{N})^{N/2} = \big[(1 - \frac{1}{N})^N\big]^{1/2} \approx e^{-1/2} \approx 0.607$。比 $N' = N$ 時的 0.368 高，因為抽的次數少，躲過的機會比較大。用 $N = 1000$ 實際算，$(0.999)^{500} = 0.606$。

**2. $N = 3$、$N' = 3$。第 1 筆資料是某棵樹的 OOB 的機率是多少？一棵樹平均有幾筆 OOB 資料？和 $N/e$ 差多少？**

答案：$(\frac{2}{3})^3 = \frac{8}{27} \approx 0.296$。平均 OOB 筆數是 $3 \times \frac{8}{27} = \frac{8}{9} \approx 0.89$。$N/e = 1.10$，高估了兩成左右；$1/e$ 是 $N$ 很大時的近似，$N = 3$ 還不夠大。

**3. 四筆資料、三棵樹。下表列出每棵樹對每筆資料的預測，加括號代表那筆資料在那棵樹的 bootstrap 資料裡（不是 OOB）。算 $E_{\text{oob}}(G)$ 與 $E_{\text{in}}(G)$。**

| $n$ | $y_n$ | $g_1$ | $g_2$ | $g_3$ |
|---|---|---|---|---|
| 1 | $+1$ | $(+1)$ | $-1$ | $(+1)$ |
| 2 | $+1$ | $+1$ | $(+1)$ | $+1$ |
| 3 | $-1$ | $(-1)$ | $(-1)$ | $+1$ |
| 4 | $-1$ | $-1$ | $-1$ | $(-1)$ |

答案：$G_1^- = g_2$，預測 $-1$，錯。$G_2^-$ 由 $g_1, g_3$ 組成，都預測 $+1$，對。$G_3^- = g_3$，預測 $+1$，錯。$G_4^-$ 由 $g_1, g_2$ 組成，都預測 $-1$，對。$E_{\text{oob}}(G) = \frac{2}{4} = 0.5$。$E_{\text{in}}$ 用三棵樹全部投票：四筆的票數分別是兩正一負、三正、兩負一正、三負，全部答對，$E_{\text{in}}(G) = 0$。括號裡的預測都是對的（樹看過那筆資料），$E_{\text{in}}$ 靠的就是這些票。

**4. 做 permutation test 時，為什麼不直接把特徵 $i$ 換成高斯亂數？原始 RF 在算 $E_{\text{oob}}^{(p)}$ 時，換進來的值又為什麼只從那棵樹的 OOB 資料裡取？**

判準：第一問要說出高斯亂數會改變這個特徵的分布 $P(x_i)$，量到的表現差距會混進「分布改變」的影響；permutation 只重排原有的值，分布大致不變。第二問要說出取 OOB 的值，換進來的資料仍是 $g_t$ 訓練時沒看過的，驗證不會被訓練用過的資料污染。

**5. 某次分支抽到的投影向量是 $\mathbf{p} = (0, 0, 1, 0)$，門檻是 2.5。這個分支是哪一種假說？它屬於講義三種 RF 版本的哪一種情況？如果 $\mathbf{p} = (1, 0, -2, 0)$ 呢？**

答案：$\mathbf{p}^\top\mathbf{x} = x_3$，分支是 $\text{sign}(x_3 - 2.5)$，是原始特徵 $x_3$ 上的 decision stump，也就是 $d'' = 1$、$\mathbf{p}$ 屬於 natural basis 的隨機子空間特例。$\mathbf{p} = (1, 0, -2, 0)$ 時分支是 $\text{sign}(x_1 - 2x_3 - 2.5)$，用到兩個特徵（$d'' = 2$），在 $x_1$–$x_3$ 平面上是一條斜線，等價於 $\mathbf{w} = (-2.5, 1, 0, -2, 0)$ 的 perceptron。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把決策樹、隨機森林與梯度提升決策樹排在同一週（W12，11/18），和 AdaBoost 一起上，這堂的投影片是 [210u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/210u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W12（11/25）；這一週的投影片在 2026-09-30 還打不開，所以本文只用 MOOC 版講義。

**教科書與延伸閱讀。** 課程頁沒有替這堂標 [Learning from Data](http://amlbook.com) 的章節。課程頁列的延伸閱讀裡，和這堂直接相關的是 [Breiman, Random Forests（Machine Learning, 2001）](https://doi.org/10.1023/A:1010933404324)，也就是隨機森林的原始論文；講義裡反覆出現的 original RF 與課堂上說的「原來的作者」指的是它。

**作業。** [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（2024-12-02 發布、12-16 截止，沒有官方解答）沒有專門考隨機森林的題目，也沒有相關的程式題。最接近的是 Q1：$N = 1126$ 做 bootstrap，問抽多少筆時「至少有一筆重複」的機率超過 70%。它和這堂 OOB 的推導是同一類的計算，都是把「每次抽樣互相獨立」寫成連乘。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**動手做。** 想親手驗證「$E_{\text{oob}}$ 通常很準」這句話，可以在 HW7 程式題用的 madelon 資料上跑 scikit-learn 的 `RandomForestClassifier`，設 `oob_score=True`，比較 `oob_score_` 與測試集上的結果。三個對照時要知道的地方：`oob_score_` 回報的是正確率，要用 1 減掉才是這堂的 $E_{\text{oob}}$；`max_features` 控制每次分支考慮幾個特徵，對應的是講義的隨機子空間（$d'$），scikit-learn 沒有做隨機組合；`feature_importances_` 是依 impurity 下降量算的，不是這堂的 permutation test，permutation 的版本在 `sklearn.inspection.permutation_importance`，它是在你給的資料上打亂，不是用 OOB。再換幾個 `random_state`、幾種 `n_estimators`，看 OOB 的結果隨種子晃動的幅度怎麼隨樹的數量縮小，就是在做講義說的 double-check stability。

**站內其他課程對同一主題的講法。** [Harvard CS181 HW4：決策樹、隨機森林與 MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)。

**下一堂。** [技法第 11 堂：梯度提升決策樹](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree)把這堂的 bagging 換成 boosting：樹不再各自獨立地長，每一棵都去補前面的樹留下的錯誤。

## 課程影片來源

原始影片：[Random Forest Algorithm](https://www.youtube.com/watch?v=ATM3sH0D45s)、[Out-Of-Bag Estimate](https://www.youtube.com/watch?v=7oz5aO-FkR0)、[Feature Selection](https://www.youtube.com/watch?v=ChqNC94JXtM)、[Random Forest in Action](https://www.youtube.com/watch?v=Ipfpf7AW_yM)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [技法第 10 堂講義 210_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf)：本文的主要底本，四節的定義與推導、四題 Fun Time、第 17 到 19 頁的示範圖與第 20 頁的 KDD Cup 經驗都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、210u 投影片與延伸閱讀清單。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)：Q1 的題目內容，以及這份作業沒有隨機森林專屬題目的依據。
- [Breiman, Random Forests](https://doi.org/10.1023/A:1010933404324)：課程頁列的延伸閱讀，講義所說 original RF 的出處。
- [Learning from Data 教科書網站](http://amlbook.com)：課程指定教科書；這堂沒有對應章節。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
