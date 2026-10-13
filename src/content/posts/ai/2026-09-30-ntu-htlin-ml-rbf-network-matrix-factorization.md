---
title: "RBF 網路：用到中心點的相似度做預測，再用 k-means 找中心｜台大林軒田 機器學習技法 第 14 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, rbf-network, k-means, clustering]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 31
tldr: "Gaussian SVM 的結果可以讀成「以支援向量為中心的 Gaussian 做線性投票」，把中心與票數都放開來學就是 RBF 網路。N 筆資料全當中心時，迴歸的最佳票數是 β = Z⁻¹y，訓練誤差剛好是 0，所以要靠 ridge 或把中心減到 M ≪ N 個代表點來正則化；代表點用 k-means 找，它輪流做「每筆資料歸到最近的中心」與「中心改成群內平均」兩步，直到分群不再變動。"
description: "台大林軒田機器學習技法第 14 堂 Radial Basis Function Network 導讀：RBF 網路的假說、full RBF 網路與 nearest neighbor、β = Z⁻¹y 的 exact interpolation 與正則化、k-means 的交替最佳化推導、用 k-means 找中心的 RBF 網路，附手算例子與四題 Fun Time 解析。"
draft: false
glossary:
  - term: "RBF 網路"
    aliases: ["RBF network", "radial basis function network", "徑向基函數網路"]
    definition: "隱藏層用「輸入與中心點的距離」算出相似度（例如 Gaussian），輸出層把這些相似度線性加權投票的模型。學習的變數是中心點 μₘ 與票數 βₘ。"
    context: "技法第 14 堂從 Gaussian SVM 推出它，並指出它在歷史上屬於神經網路的一種。"
    links:
      - label: "技法第 14 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf"
  - term: "代表點"
    aliases: ["prototype", "中心點"]
    definition: "RBF 網路裡數量遠少於資料筆數的中心 μₘ。每個代表點替一群彼此相近的資料發言。"
    context: "技法第 14 堂把「減少中心數」當成一種正則化，並用 k-means 找代表點。"
  - term: "k-means"
    aliases: ["k-Means", "k 平均法"]
    definition: "一種分群演算法：固定中心時把每筆資料歸到最近的中心，固定分群時把中心改成群內平均，兩步輪流做到分群不再變動。"
    context: "技法第 14 堂用它替 RBF 網路找代表點；這裡的 k 是群數，和 k nearest neighbor 的 k 無關。"
  - term: "exact interpolation"
    aliases: ["完全內插"]
    definition: "學到的函數通過每一筆訓練資料，訓練誤差為 0。full Gaussian RBF 網路取 β = Z⁻¹y 時就是這個情況。"
    context: "技法第 14 堂指出這在函數逼近是好事，在機器學習則有過擬合的風險。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [214_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/24 到 24/24），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 14 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂屬於第三種 Distilling Implicit Features: Extraction Models，也就是把特徵轉換本身當成要學的東西。上一堂[技法第 13 堂：深度學習](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning)在同一頁上只有一句：很多層的神經網路先用 denoising autoencoder 做 pre-training，再用 backprop 做 fine-tuning。這堂換一種隱藏層：不做內積，改算「輸入離幾個中心點有多遠」。

先備有四樣：[技法第 3 堂](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)的 Gaussian kernel 與 Gaussian SVM、[基石第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的線性迴歸公式解、[基石第 14 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)的 ridge regression，以及對向量取梯度。讀完之後，你應該能寫出 RBF 網路的假說並說明它和 Gaussian SVM、神經網路各差在哪裡；能推出 full RBF 網路的 $\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y}$ 並解釋為什麼訓練誤差是 0；能從分群的誤差函數推出 k-means 的兩個步驟，對一小組資料手算到收斂。

整堂課的路線：

1. **重看 Gaussian SVM**：它是一堆 Gaussian 的線性組合。
2. **一般化**：中心 $\boldsymbol{\mu}_m$ 與票數 $\beta_m$ 都當成要學的變數，得到 RBF 網路。
3. **最偷懶的中心**：每筆資料都當中心。這條路通到 nearest neighbor，也通到 $E_{\text{in}} = 0$ 的過擬合。
4. **正則化**：加 ridge，或者把中心減到少數幾個代表點。
5. **找代表點**：k-means。
6. **合起來**：k-means 找中心、RBF 做轉換、線性模型算票數。

## RBF 網路長什麼樣子：把 Gaussian SVM 讀成到各個中心的相似度投票

```youtube
url: https://www.youtube.com/watch?v=7lHhnpdPVr0
title: Radial Basis Function Network :: RBF Network Hypothesis @ Machine Learning Techniques (機器學習技法)
```

（影片 00:18–01:33 複習上一堂，01:33–04:59 重看 Gaussian SVM，05:00–06:47 和神經網路對照，06:47–08:56 寫出假說，09:00–12:31 談 RBF 與相似度，之後是 Fun Time。）

### 從 Gaussian SVM 的結果往回看

講義第 2 頁把技法第 3 堂的 Gaussian SVM 抄了一次：

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV}} \alpha_n y_n \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2\big) + b\Big)
$$

當時的講法是在無限多維的空間裡找最胖的邊界。課堂上這次改從結果來讀：最後得到的假說，就是拿一堆 Gaussian 來做線性組合，每個 Gaussian 的中心放在一個支援向量 $\mathbf{x}_n$ 上。

Gaussian kernel 的另一個名字是 Radial Basis Function（RBF）kernel。講義把這個名字拆成兩半：

- **radial**：函數值只跟 $\mathbf{x}$ 和「中心」$\mathbf{x}_n$ 之間的距離有關。課堂上強調是「只」跟這兩個點的距離有關，跟其他事情無關。
- **basis function**：要被拿去「組合」的函數。在 Gaussian SVM 裡，組合的係數是 $\alpha_n y_n$。

接著講義定義 $g_n(\mathbf{x}) = y_n \exp(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2)$，於是

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV}} \alpha_n g_n(\mathbf{x}) + b\Big)
$$

課堂上給 $g_n$ 的物理意義是：看新的 $\mathbf{x}$ 離 $\mathbf{x}_n$ 夠不夠近，愈近就給愈多票，票投的是 $y_n$ 那一邊。每個 $g_n$ 可以想成[技法第 7 堂](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)講 aggregation 時的一個小假說，$\alpha_n$ 是線性組合的權重，而且只有 $\alpha_n \ne 0$ 的支援向量需要算。講義的說法是 linear aggregation of selected radial hypotheses。

把「selected」拿掉，留下的概念就是這堂的主角。講義第 2 頁的定義只有一行：**RBF 網路是 radial 假說的線性 aggregation。**

### 為什麼叫「網路」：只有隱藏層不一樣

第 3 頁把[技法第 12 堂](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)的神經網路和 RBF 網路並排畫成兩張圖。兩張圖的骨架相同：左邊是輸入 $x_0 = 1, x_1, \dots, x_d$，中間一層節點，右邊一個輸出節點。差別在標籤：

| | 神經網路 | RBF 網路 |
|---|---|---|
| 隱藏層節點 | tanh | RBF |
| 輸入到隱藏層的連線 | 權重 $w_{ij}^{(1)}$ | centers（中心） |
| 隱藏層做的事 | 內積，再過 tanh | 算距離，再過 Gaussian |
| 隱藏層到輸出的連線 | 權重 $w_{j1}^{(2)}$ | votes（票數） |
| 輸出層做的事 | 線性 aggregation | 線性 aggregation |

講義的結論是 hidden layer different、output layer same，並說 RBF 網路在歷史上是神經網路的一種。課堂上補充它當年研究的問題：把神經元換成跟距離有關的函數之後，可以做到什麼。

### 假說的完整寫法

第 4 頁寫出 RBF 網路的假說：

$$
h(\mathbf{x}) = \text{Output}\Big(\sum_{m=1}^{M} \beta_m \,\text{RBF}(\mathbf{x}, \boldsymbol{\mu}_m) + b\Big)
$$

式子裡有四樣東西要定：

- **RBF**：用哪一種 radial basis function。Gaussian 只是其中一種。
- **Output**：輸出怎麼轉換。課堂上說要看問題是迴歸還是分類；二元分類就取 sign。
- **中心 $\boldsymbol{\mu}_m$**：要參考哪 $M$ 個點。
- **票數 $\beta_m$**：每個中心的相似度乘上多少，可正可負，講義寫 (signed) votes。

講義把後兩者標成 key variables，學習要做的事寫成一句：given RBF and Output, decide $\boldsymbol{\mu}_m$ and $\beta_m$。投影片上的 $b$ 用灰色字印，從第 7 頁起 RBF 網路的式子都把它省略，這篇照講義的寫法。

Gaussian SVM 是這個假說的一個特例，四樣東西各是：

| RBF 網路的元件 | Gaussian SVM 的選擇 |
|---|---|
| RBF | Gaussian |
| Output | sign（二元分類） |
| $M$ | 支援向量的個數 |
| $\boldsymbol{\mu}_m$ | 支援向量 $\mathbf{x}_m$ |
| $\beta_m$ | 對偶解給的 $\alpha_m y_m$ |

### RBF 是一種相似度，kernel 是另一種

第 5 頁把 RBF 放進更大的圖裡看。投影片畫了一個大框，標題是 general similarity function between $\mathbf{x}$ and $\mathbf{x}'$，裡面有兩個互相重疊的小框：

| 函數 | 定義 | 在哪個框裡 |
|---|---|---|
| Neuron | $\tanh(\gamma\mathbf{x}^\top\mathbf{x}' + 1)$ | 只在大框（一般的相似度） |
| DNASim | $\text{EditDistance}(\mathbf{x}, \mathbf{x}')$ | 只在大框 |
| Poly | $(1 + \mathbf{x}^\top\mathbf{x}')^2$ | kernel |
| Gaussian | $\exp(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2)$ | kernel 與 RBF 的重疊處 |
| Truncated | $[\![\lVert\mathbf{x} - \mathbf{x}'\rVert \le 1]\!]\,(1 - \lVert\mathbf{x} - \mathbf{x}'\rVert)^2$ | RBF |

兩個小框的定義：

- **kernel**：先把兩個點轉換到 $\mathcal{Z}$ 空間，再做內積。因為背後有一個內積，所以要受 Mercer 條件約束（技法第 3 堂）。
- **RBF**：直接用 $\mathcal{X}$ 空間裡的距離算。講義說它通常隨距離單調不增（monotonically non-increasing）。課堂上的解釋是：既然要表達相似度，距離愈近，相似度就該愈大。

Gaussian 同時符合兩邊，課堂上說它位在兩者的交集。Truncated 那一列課堂上沒有講，這裡照式子讀：距離是 0 時值為 1，距離 0.5 時是 $(1 - 0.5)^2 = 0.25$，距離到 1 時降為 0，超過 1 之後一律是 0。它只看距離、而且愈遠愈小，所以是 RBF。

另外兩個例子課堂上各講了一段。神經元也可以看成在比相似度：比的是輸入向量和權重向量，先內積再過 S 形的函數。DNA 序列是一種字串，兩條序列像不像可以用 edit distance 來量，也就是從一條字串改成另一條最少要改幾次；課堂上說這種相似度不一定是 kernel，也不一定是 RBF。

這一頁的結論是：**RBF 網路把「到各個中心的距離相似度」當成特徵轉換。** 課堂上把它講得更廣：相似度本身就是定義特徵轉換的好方法，手上如果有別種相似度的量法，就算跟距離無關、也不是 kernel，一樣可以考慮拿來做轉換。

### Fun Time：哪一個不是 radial basis function

**題目（第 6 頁）：** 下列哪一個不是 radial basis function？

1. $\phi(\mathbf{x}, \boldsymbol{\mu}) = \exp(-\gamma\lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2)$
2. $\phi(\mathbf{x}, \boldsymbol{\mu}) = -\sqrt{\mathbf{x}^\top\mathbf{x} - 2\mathbf{x}^\top\boldsymbol{\mu} + \boldsymbol{\mu}^\top\boldsymbol{\mu}}$
3. $\phi(\mathbf{x}, \boldsymbol{\mu}) = [\![\mathbf{x} = \boldsymbol{\mu}]\!]$
4. $\phi(\mathbf{x}, \boldsymbol{\mu}) = \mathbf{x}^\top\mathbf{x} + \boldsymbol{\mu}^\top\boldsymbol{\mu}$

**答案：4。** 判斷的標準只有一條：函數值能不能只用 $\lVert\mathbf{x} - \boldsymbol{\mu}\rVert$ 算出來。

- 選項 1 就是 Gaussian。
- 選項 2 根號裡的三項是 $(\mathbf{x} - \boldsymbol{\mu})^\top(\mathbf{x} - \boldsymbol{\mu}) = \lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2$ 展開的結果，整個函數是 $-\lVert\mathbf{x} - \boldsymbol{\mu}\rVert$。講義的解答說它裡面藏了一個 $\lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2$。
- 選項 3 等於 $[\![\lVert\mathbf{x} - \boldsymbol{\mu}\rVert = 0]\!]$。講義說它是 Gaussian 在 $\gamma \to \infty$ 的極端情況：距離是 0 時 $\exp(0) = 1$，距離不是 0 時 $\exp(-\gamma \cdot \text{正數}) \to 0$。
- 選項 4 沒辦法只用距離表示。本文補一個反例：$\mathbf{x} = \boldsymbol{\mu} = (0, 0)$ 時距離是 0、函數值是 0；$\mathbf{x} = \boldsymbol{\mu} = (1, 0)$ 時距離也是 0，函數值卻是 2。同樣的距離給出不同的值，它就不是 radial。它比選項 2 的根號裡少了 $-2\mathbf{x}^\top\boldsymbol{\mu}$ 那一項，少的正好是把兩個點連起來的部分。

## 中心與票數怎麼定：從每筆資料都當中心，到只留少數代表點

```youtube
url: https://www.youtube.com/watch?v=dEYdx2rS66c
title: Radial Basis Function Network :: RBF Network Learning @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:29 是 full RBF 網路，02:39–06:56 是 nearest neighbor，06:56–14:44 是迴歸的公式解與 exact interpolation，14:44–17:28 是正則化與 kernel ridge regression 的對照，17:28–19:12 是減少中心數，之後是 Fun Time。）

### full RBF 網路：每筆資料都是中心

中心要放哪裡？第 7 頁先試最省事的做法：$M = N$，每個 $\boldsymbol{\mu}_m = \mathbf{x}_m$，講義稱為 full RBF 網路。它的物理意義是每一筆看過的資料 $\mathbf{x}_m$ 都會影響它附近的 $\mathbf{x}$，影響力的大小是 $\beta_m$。

如果連 $\beta_m$ 也不想學，可以讓每筆資料的影響力一樣大。二元分類時取 $\beta_m = 1 \cdot y_m$：

$$
g_{\text{uniform}}(\mathbf{x}) = \text{sign}\Big(\sum_{m=1}^{N} y_m \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}_m\rVert^2\big)\Big)
$$

課堂上的講法是：本來一人一票，但離得遠的票數打折，離得近的票數多一點；把每筆資料依相似度加權後的意見加起來，看最後是 $+1$ 還是 $-1$。講義說這是 aggregate each example's opinion subject to similarity，並把 full RBF 網路稱為決定 $\boldsymbol{\mu}_m$ 的 lazy（偷懶）方法。

### 只聽最近那一筆：nearest neighbor

第 8 頁從 $g_{\text{uniform}}$ 再偷懶一步。加總裡的每一項都是一個 Gaussian，$\mathbf{x}$ 離哪個 $\mathbf{x}_m$ 最近，那一項就最大。Gaussian 隨距離衰減得很快，所以講義說最大的那一項常常主宰（dominates）整個加總。課堂上舉的情境是：本來有一千個人，要把一千個人的意見都問完再投票；既然票最多的那個人往往說了算，不如直接找出那個人，用他的意見當答案。

這就把 aggregation 換成了 selection（技法第 7 堂的用語），得到的模型是

$$
g_{\text{nbor}}(\mathbf{x}) = y_m \quad \text{such that } \mathbf{x} \text{ closest to } \mathbf{x}_m
$$

也就是 **nearest neighbor**：在看過的資料裡找離 $\mathbf{x}$ 最近的一筆，直接回傳它的標籤。講義接著說也可以對最近的 $k$ 筆做均勻投票，叫 **k nearest neighbor**。課堂上的位置描述是：找三個或五個鄰居來投票，介於「全部的人投票」與「只讓一個人投票」之間，通常比只問一個人好一點。

講義對 k nearest neighbor 的評語是 also lazy but very intuitive。課堂上解釋 lazy 的意思：訓練時幾乎沒做事，只是把資料記起來；預測時才去算相似度、找最近的人，所以預測要花比較多力氣。

### 數值例子一：三筆資料的投票與最近鄰

以下是本文自擬的例子，不在講義上。一維資料三筆：

| $m$ | $x_m$ | $y_m$ |
|---|---|---|
| 1 | $0$ | $+1$ |
| 2 | $1$ | $+1$ |
| 3 | $2$ | $-1$ |

為了讓數字好算，取 $\gamma = \ln 2$，這樣 $\exp(-\gamma d^2) = 2^{-d^2}$：距離 1 的相似度是 $\frac{1}{2}$，距離 2 是 $\frac{1}{16}$，距離 3 是 $\frac{1}{512}$。

**在 $x = 3$ 預測。** 三筆資料的距離是 3、2、1：

$$
\sum_m y_m 2^{-(3 - x_m)^2} = \frac{1}{512} + \frac{1}{16} - \frac{1}{2} = -\frac{223}{512}
$$

$g_{\text{uniform}}(3) = -1$。最大的一項是第 3 筆的 $\frac{1}{2}$，其餘兩項加起來不到 $0.07$，這就是「最大的那一項主宰加總」。nearest neighbor 看最近的第 3 筆，答案同樣是 $-1$。

**在 $x = 1.6$ 預測。** 距離是 1.6、0.6、0.4，三項依序是 $2^{-2.56} \approx 0.170$、$2^{-0.36} \approx 0.779$、$2^{-0.16} \approx 0.895$：

$$
0.170 + 0.779 - 0.895 = +0.054
$$

$g_{\text{uniform}}(1.6) = +1$，但最近的是第 3 筆，$g_{\text{nbor}}(1.6) = -1$。最大的一項在這裡贏不過另外兩項的合計。講義寫的是 often dominates，這個點就是 often 以外的情況：兩個模型在遠離邊界的地方答案一致，在邊界附近可能不同。

### 把票數學出來：迴歸時的公式解

第 9 頁不再把 $\beta_m$ 直接設成 $y_m$，改成中心固定在每筆資料上、$\beta_m$ 用最佳化來學。問題選的是平方誤差的迴歸，所以 Output 不做任何轉換（投影片上把 Output 劃掉）：

$$
h(\mathbf{x}) = \sum_{m=1}^{N} \beta_m \,\text{RBF}(\mathbf{x}, \mathbf{x}_m)
$$

中心定了之後，每筆資料可以先轉換成一個 $N$ 維的向量

$$
\mathbf{z}_n = \big[\text{RBF}(\mathbf{x}_n, \mathbf{x}_1),\ \text{RBF}(\mathbf{x}_n, \mathbf{x}_2),\ \dots,\ \text{RBF}(\mathbf{x}_n, \mathbf{x}_N)\big]
$$

$h(\mathbf{x}_n) = \boldsymbol{\beta}^\top\mathbf{z}_n$ 對 $\boldsymbol{\beta}$ 是線性的，所以這只是在轉換後的資料上做線性迴歸。把 $\mathbf{z}_n$ 一列一列疊成矩陣 $\mathrm{Z}$，基石第 9 堂的公式解直接可用：

$$
\boldsymbol{\beta} = (\mathrm{Z}^\top\mathrm{Z})^{-1}\mathrm{Z}^\top\mathbf{y} \qquad \text{（如果 } \mathrm{Z}^\top\mathrm{Z} \text{ 可逆）}
$$

這個 $\mathrm{Z}$ 有兩個特別的地方。第一，它有 $N$ 列（資料）和 $N$ 行（中心），是方陣。第二，第 $(n, m)$ 格是 $\text{RBF}(\mathbf{x}_n, \mathbf{x}_m)$，只跟兩個點的距離有關，對調 $n$ 和 $m$ 值不變，所以是對稱矩陣。

講義接著給一個不證明的事實（theoretical fact）：只要所有 $\mathbf{x}_n$ 都不相同，Gaussian RBF 產生的 $\mathrm{Z}$ 就可逆。課堂上說資料全部不相同是很常見的情形。本文補充兩筆資料時的驗證：$\mathrm{Z}$ 的對角線是 1，另外兩格是 $a = \exp(-\gamma\lVert\mathbf{x}_1 - \mathbf{x}_2\rVert^2)$，行列式是 $1 - a^2$。兩個點不同時 $a < 1$，行列式大於 0，可逆；兩個點相同時 $a = 1$，行列式是 0。一般的 $N$ 這裡不證。

$\mathrm{Z}$ 又對稱又可逆，公式解可以化簡。對稱表示 $\mathrm{Z}^\top = \mathrm{Z}$；兩個可逆矩陣相乘的反矩陣是各自的反矩陣反序相乘：

$$
\boldsymbol{\beta} = (\mathrm{Z}\mathrm{Z})^{-1}\mathrm{Z}\mathbf{y} = \mathrm{Z}^{-1}\mathrm{Z}^{-1}\mathrm{Z}\mathbf{y} = \mathrm{Z}^{-1}\mathbf{y}
$$

課堂上的說法是一正一反互相消掉，剩下一個比原式簡潔的結果。

### 訓練誤差剛好是 0：exact interpolation

第 10 頁把 $\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y}$ 代回去，看它在訓練資料上的輸出。以 $\mathbf{x}_1$ 為例：

$$
g_{\text{RBF}}(\mathbf{x}_1) = \boldsymbol{\beta}^\top\mathbf{z}_1 = \mathbf{y}^\top\mathrm{Z}^{-1}\,(\mathrm{Z} \text{ 的第一行}) = \mathbf{y}^\top\begin{bmatrix} 1 & 0 & \cdots & 0 \end{bmatrix}^\top = y_1
$$

每個等號的理由：

1. $\boldsymbol{\beta}^\top = (\mathrm{Z}^{-1}\mathbf{y})^\top = \mathbf{y}^\top(\mathrm{Z}^{-1})^\top$。$\mathrm{Z}$ 對稱，$\mathrm{Z}^{-1}$ 也對稱，轉置可以不寫。
2. $\mathbf{z}_1$ 是 $\mathrm{Z}$ 的第一列；因為 $\mathrm{Z}$ 對稱，它也是 $\mathrm{Z}$ 的第一行。
3. $\mathrm{Z}^{-1}\mathrm{Z} = \mathrm{I}$，所以 $\mathrm{Z}^{-1}$ 乘上 $\mathrm{Z}$ 的第一行，得到 $\mathrm{I}$ 的第一行，也就是只有第一格是 1 的向量。
4. $\mathbf{y}$ 和這個向量內積，只留下 $y_1$。

對其他的 $n$ 推導相同，所以 $g_{\text{RBF}}(\mathbf{x}_n) = y_n$ 對每筆訓練資料都成立，$E_{\text{in}}(g_{\text{RBF}}) = 0$。

講義在這裡寫了「yeah!! :-)」，隔一行就問 overfitting for learning? 課堂上的說法是，學到現在看到 $E_{\text{in}} = 0$ 應該會覺得怪怪的。這個性質在應用數學的函數逼近（function approximation）裡是好事，叫 **exact interpolation**：用一些已知的點逼近函數，曲線通過每一個點，內插是完美的。機器學習的資料帶有雜訊，每個點都通過就有過擬合的風險。

### 數值例子二：三筆資料的 β

這個例子同樣是本文自擬的。沿用數值例子一的三筆資料與 $\gamma = \ln 2$，這次把 $y$ 當成實數做迴歸。$\mathrm{Z}$ 是

$$
\mathrm{Z} = \begin{bmatrix} 1 & \frac{1}{2} & \frac{1}{16} \\ \frac{1}{2} & 1 & \frac{1}{2} \\ \frac{1}{16} & \frac{1}{2} & 1 \end{bmatrix}, \qquad \mathbf{y} = \begin{bmatrix} 1 \\ 1 \\ -1 \end{bmatrix}
$$

三筆 $x$ 都不同，$\mathrm{Z}$ 可逆（行列式是 $\frac{135}{256}$）。解 $\mathrm{Z}\boldsymbol{\beta} = \mathbf{y}$ 這組三元一次方程式，得到

$$
\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y} = \Big(\frac{8}{45},\ \frac{17}{9},\ -\frac{88}{45}\Big) \approx (0.178,\ 1.889,\ -1.956)
$$

代回去檢查，通分到 720：

- 第一筆：$\frac{8}{45} + \frac{1}{2}\cdot\frac{17}{9} - \frac{1}{16}\cdot\frac{88}{45} = \frac{128 + 680 - 88}{720} = 1$
- 第二筆：$\frac{1}{2}\cdot\frac{8}{45} + \frac{17}{9} - \frac{1}{2}\cdot\frac{88}{45} = \frac{4 + 85 - 44}{45} = 1$
- 第三筆：$\frac{1}{16}\cdot\frac{8}{45} + \frac{1}{2}\cdot\frac{17}{9} - \frac{88}{45} = \frac{8 + 680 - 1408}{720} = -1$

三筆都剛好命中，$E_{\text{in}} = 0$。

**這個結果代表什麼。** 票數和標籤已經不是同一回事。第 1 筆和第 2 筆的標籤都是 $+1$，票數卻差了十倍；第 2 筆夾在中間，要抵銷第 3 筆傳過來的負票，所以拿到很大的正票。為了通過每一個點，$\boldsymbol{\beta}$ 被拉得很長：$\lVert\boldsymbol{\beta}\rVert^2 \approx 7.42$。在訓練點以外，$g_{\text{RBF}}(1.5) \approx -0.019$、$g_{\text{RBF}}(3) = -\frac{55}{64} \approx -0.859$、$g_{\text{RBF}}(4) \approx -0.119$，離所有資料愈遠，輸出愈接近 0。

### 第一種補救：對 β 做 ridge

第 10 頁的下半提出第一種正則化：線性迴歸那一步改用 ridge regression，

$$
\boldsymbol{\beta} = (\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}
$$

課堂上說，full RBF 網路因為擔心 $E_{\text{in}}$ 做到 0 會過擬合，常常需要加上正則化。

講義接著問：這個 $\mathrm{Z}$ 以前看過嗎？$\mathrm{Z}$ 的每一格是兩筆資料之間的 Gaussian，它就是 Gaussian kernel 矩陣 $\mathrm{K}$。[技法第 6 堂](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression)的 kernel ridge regression 也在算每個 Gaussian 前面的係數，講義把兩個公式並列：

| 方法 | 公式解 | 正則化作用在哪裡 |
|---|---|---|
| kernel ridge regression | $\boldsymbol{\beta} = (\mathrm{K} + \lambda\mathrm{I})^{-1}\mathbf{y}$ | 無限多維的轉換 |
| regularized full RBFNet | $\boldsymbol{\beta} = (\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}$ | $N$ 維的轉換 |

「正則化作用在哪裡」那一欄是課堂上的說法；講義只寫 effect of regularization in different spaces。$\mathrm{Z}$ 和 $\mathrm{K}$ 是同一個矩陣，兩個公式卻不同，因為被懲罰的量不同。

本文補充，把兩邊最小化的目標寫出來對照。技法第 6 堂的 kernel ridge regression 懲罰的是 $\mathcal{Z}$ 空間裡的 $\mathbf{w}^\top\mathbf{w}$，換成 $\boldsymbol{\beta}$ 表示是 $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$；這裡的 ridge 把 $\mathbf{z}_n$ 當成普通的 $N$ 維特徵，懲罰的是 $\boldsymbol{\beta}^\top\boldsymbol{\beta}$：

$$
\min_{\boldsymbol{\beta}}\ \lambda\,\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta} + \lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2 \qquad\text{對上}\qquad \min_{\boldsymbol{\beta}}\ \lambda\,\boldsymbol{\beta}^\top\boldsymbol{\beta} + \lVert\mathbf{y} - \mathrm{Z}\boldsymbol{\beta}\rVert^2
$$

左邊對 $\boldsymbol{\beta}$ 取梯度是 $2\mathrm{K}\big((\mathrm{K} + \lambda\mathrm{I})\boldsymbol{\beta} - \mathbf{y}\big)$，令它為 0 的一個解是 $(\mathrm{K} + \lambda\mathrm{I})^{-1}\mathbf{y}$；右邊的梯度是 $2\big((\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})\boldsymbol{\beta} - \mathrm{Z}^\top\mathbf{y}\big)$，解是表中的第二個公式。技法第 6 堂與基石第 14 堂的講義在兩項前面都多寫一個 $\frac{1}{N}$；整個目標同乘 $N$ 不會改變最小值出現在哪裡，這裡省略。

用數值例子二的資料、取 $\lambda = 1$ 算一次（本文自算）：

| 做法 | $\boldsymbol{\beta}$ | 三筆訓練資料上的輸出 | $E_{\text{in}}$（平方誤差的平均） | $\lVert\boldsymbol{\beta}\rVert^2$ |
|---|---|---|---|---|
| 不正則化，$\mathrm{Z}^{-1}\mathbf{y}$ | $(0.178,\ 1.889,\ -1.956)$ | $(1,\ 1,\ -1)$ | $0$ | $7.42$ |
| regularized full RBFNet，$\lambda = 1$ | $(0.548,\ 0.359,\ -0.450)$ | $(0.700,\ 0.409,\ -0.236)$ | $0.341$ | $0.63$ |
| kernel ridge regression，$\lambda = 1$ | $(0.378,\ 0.569,\ -0.654)$ | $(0.622,\ 0.431,\ -0.346)$ | $0.298$ | $0.89$ |

加了正則化之後曲線不再通過每一個點，$\boldsymbol{\beta}$ 短了很多；兩種正則化給出的 $\boldsymbol{\beta}$ 確實不同。$\lambda$ 取小一點，例如 $0.001$，regularized full RBFNet 的輸出是 $(1.002,\ 0.995,\ -0.996)$，幾乎回到 exact interpolation。

### 第二種補救：少一點中心

第 11 頁回頭再看一次 Gaussian SVM。它的「網路」裡只用到支援向量，數量遠少於 $N$。課堂上舉的數字是：一千筆資料，可能只有一百個支援向量，最後用到的中心就只有一百個。

所以另一種正則化是直接讓 $M \ll N$。課堂上說一千筆資料可能五十個中心就夠，甚至十個。講義說它的效果是 regularization by constraining number of centers and voting weights：中心少了，第二層要學的權重 $\beta_m$ 也跟著少。

這些中心的物理意義，講義稱為 **prototype**（代表點）。課堂上的比喻是選議員：一千個人不必全部直接投票，先選出能代表大家意見的幾個人。這一節留下的問題是 how to extract prototypes，也就是代表點要怎麼找。

### Fun Time：兩筆資料相同時的 Z

**題目（第 12 頁）：** 如果 $\mathbf{x}_1 = \mathbf{x}_2$，full Gaussian RBF 網路的 $\mathrm{Z}$ 矩陣會怎樣？

1. 矩陣的前兩列相同
2. 矩陣的前兩行不同
3. 矩陣可逆
4. 前兩列與前兩行交會處的子矩陣含有常數 0

**答案：1。** 第 $n$ 列的第 $m$ 格是 $\text{RBF}(\mathbf{x}_n, \mathbf{x}_m)$。$\mathbf{x}_1 = \mathbf{x}_2$ 時，$\text{RBF}(\mathbf{x}_1, \mathbf{x}_m) = \text{RBF}(\mathbf{x}_2, \mathbf{x}_m)$ 對每個 $m$ 都成立，前兩列逐格相同。

- 選項 2 錯：$\mathrm{Z}$ 對稱，前兩列相同，前兩行也就相同。
- 選項 3 錯：有兩列相同的矩陣是奇異的（singular），不可逆。「可逆」那個事實的前提是所有 $\mathbf{x}_n$ 都不相同，這題正好破壞了前提。
- 選項 4 錯：那個 $2 \times 2$ 子矩陣的四格都是兩個相同的點之間的 Gaussian，值是 $\exp(-0) = 1$，不是 0。

本文驗算：取 $x_1 = x_2 = 0$、$x_3 = 1$、$\gamma = \ln 2$，

$$
\mathrm{Z} = \begin{bmatrix} 1 & 1 & \frac{1}{2} \\ 1 & 1 & \frac{1}{2} \\ \frac{1}{2} & \frac{1}{2} & 1 \end{bmatrix}
$$

前兩列相同，行列式是 0。這時 $\mathrm{Z}^{-1}\mathbf{y}$ 算不出來；如果這兩筆相同的 $x$ 配到不同的 $y$，也不可能有曲線同時通過兩個點。

## 代表點怎麼找：k-means 輪流最佳化分群與中心

```youtube
url: https://www.youtube.com/watch?v=ker9RF2TDUU
title: Radial Basis Function Network :: k-Means Algorithm @ Machine Learning Techniques (機器學習技法)
```

（影片 00:01–03:33 把找代表點寫成分群問題，03:33–07:02 是固定中心時怎麼分群，07:02–10:00 是固定分群時怎麼定中心，10:00–13:37 是 k-means 演算法與收斂，13:37–15:31 把 k-means 接上 RBF 網路，之後是 Fun Time。）

### 好的代表點：一個分群問題

第 13 頁從一個觀察開始。如果 $\mathbf{x}_1 \approx \mathbf{x}_2$，網路裡就不需要同時有 $\text{RBF}(\mathbf{x}, \mathbf{x}_1)$ 和 $\text{RBF}(\mathbf{x}, \mathbf{x}_2)$。課堂上的理由是這兩個 RBF 表示的函數非常接近，留一個就夠了。所以把 $\mathbf{x}_1$ 和 $\mathbf{x}_2$ 歸成一群，共用一個代表點 $\boldsymbol{\mu} \approx \mathbf{x}_1 \approx \mathbf{x}_2$。

這是分群（clustering），[基石第 3 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning)提過它是典型的非監督式學習。講義要解的版本有兩個動作：

- **partition**：把 $\{\mathbf{x}_n\}$ 切成互斥的集合 $S_1, S_2, \dots, S_M$。課堂上說明互斥的意思是每筆資料只能屬於一群；後面又補上另一半，不能有資料分不到群。
- **choose**：替每個 $S_m$ 選一個代表點 $\boldsymbol{\mu}_m$。

希望達到的是：$\mathbf{x}_1$ 和 $\mathbf{x}_2$ 同屬 $S_m$ 的時候，$\boldsymbol{\mu}_m$ 跟兩者都接近。課堂上的理由是：代表點如果離它代表的資料很遠，做出來的 RBF 就跟那筆資料自己的 RBF 差很多，代表不了它。

把「接近」寫成誤差，用平方距離：

$$
E_{\text{in}}(S_1, \dots, S_M;\ \boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_M) = \frac{1}{N}\sum_{n=1}^{N}\sum_{m=1}^{M} [\![\mathbf{x}_n \in S_m]\!]\,\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2
$$

$[\![\cdot]\!]$ 在條件成立時是 1，否則是 0。對固定的 $n$，內層的加總只有一項留下來，就是 $\mathbf{x}_n$ 所屬那一群的 $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2$。課堂上舉的例子是：$\mathbf{x}_n$ 屬於第三群，就只有 $m = 3$ 那一項的 $[\![\cdot]\!]$ 是 1。所以 $E_{\text{in}}$ 是「每筆資料到自己代表點的平方距離」的平均，課堂上把它說成我和我的代表意見有多不合。

目標是在 $S_1, \dots, S_M$ 構成一個分割的限制下，同時對分群與代表點最小化 $E_{\text{in}}$。

### 固定中心，決定分群

第 14 頁先說這個問題為什麼難：它是 joint combinatorial-numerical optimization。代表點是實數向量，屬於數值最佳化；分群是決定每筆資料放哪一格，屬於組合最佳化，課堂上的說法是一個蘿蔔一個坑。課堂上還提到這種兩者混在一起的問題在這門課裡很少見，之前看過的一次是 perceptron 上要讓分錯的個數最少（[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)）：$\mathbf{w}$ 是數值，錯誤的個數是組合。

講義的對策是：變數有兩組，那就輪流最佳化（optimize alternatingly），一次固定一組、解另一組。第 14、15 兩頁的最小化式子把前面的 $\frac{1}{N}$ 省掉了，它是正的常數，不影響最小值出現在哪裡。

先固定 $\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_M$。這時每筆 $\mathbf{x}_n$ 在 $E_{\text{in}}$ 裡的貢獻只跟自己被分到哪一群有關，跟別筆資料怎麼分無關，所以可以一筆一筆分開決定。對一筆 $\mathbf{x}_n$：

- $[\![\mathbf{x}_n \in S_m]\!]$ 規定它要選一群，而且只能選一群。
- 選第 $m$ 群要付的代價是 $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2$，這 $M$ 個數字在中心固定之後都是已知的。

要付最少，就選 $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2$ 最小的那一群。講義的結論是：for given $\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_M$, each $\mathbf{x}_n$ 'optimally partitioned' using its closest $\boldsymbol{\mu}_m$。

### 固定分群，決定中心

第 15 頁反過來，固定 $S_1, \dots, S_M$。$[\![\mathbf{x}_n \in S_m]\!]$ 的值全部定了，組合的部分消失，剩下的是對每個 $\boldsymbol{\mu}_m$ 的無限制最佳化（unconstrained optimization），做法是梯度等於零。

對 $\boldsymbol{\mu}_m$ 取梯度時，加總裡跟別群有關的項都沒有 $\boldsymbol{\mu}_m$，微分是 0。留下的每一項是 $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2 = (\mathbf{x}_n - \boldsymbol{\mu}_m)^\top(\mathbf{x}_n - \boldsymbol{\mu}_m)$，對 $\boldsymbol{\mu}_m$ 的梯度是 $-2(\mathbf{x}_n - \boldsymbol{\mu}_m)$：平方微分掉下來一個 2，$\boldsymbol{\mu}_m$ 前面的負號給出負號。所以

$$
\nabla_{\boldsymbol{\mu}_m} E_{\text{in}} = -2\sum_{n=1}^{N} [\![\mathbf{x}_n \in S_m]\!]\,(\mathbf{x}_n - \boldsymbol{\mu}_m) = -2\Big(\Big(\sum_{\mathbf{x}_n \in S_m} \mathbf{x}_n\Big) - \lvert S_m\rvert\,\boldsymbol{\mu}_m\Big)
$$

第二個等號把加總拆成兩半：前一半是屬於這一群的 $\mathbf{x}_n$ 加起來；後一半每筆資料都貢獻一個 $\boldsymbol{\mu}_m$，共出現 $\lvert S_m\rvert$ 次，$\lvert S_m\rvert$ 是這一群的資料筆數。令梯度為 $\mathbf{0}$：

$$
\boldsymbol{\mu}_m = \frac{1}{\lvert S_m\rvert}\sum_{\mathbf{x}_n \in S_m} \mathbf{x}_n
$$

最佳的代表點是群內資料的平均。本文補一句：$E_{\text{in}}$ 對 $\boldsymbol{\mu}_m$ 是開口向上的二次函數，所以梯度為零的地方是最小值。講義的結論是：for given $S_1, \dots, S_M$，每個代表點 'optimally computed' as consensus within $S_m$，課堂上把平均稱為這個群體的共識。這一頁和下一頁的投影片上，代表點的下標有幾處印成 $\boldsymbol{\mu}_n$、$\boldsymbol{\mu}_i$，本文一律寫成 $\boldsymbol{\mu}_m$。

### k-means 演算法

把兩個步驟接起來就是第 16 頁的演算法。它歷史上的名字是 **k-means**，代表點的個數習慣記成 $k$，不用這堂之前用的 $M$。講義在名字底下加了一行括號：和 k nearest neighbor 不同。課堂上說兩者只有都叫 $k$ 這一點一樣，只是當初提出方法的人剛好都用了這個字母。

1. **初始化** $\boldsymbol{\mu}_1, \boldsymbol{\mu}_2, \dots, \boldsymbol{\mu}_k$：例如從資料裡隨機選 $k$ 筆 $\mathbf{x}_n$。
2. **交替最佳化** $E_{\text{in}}$，重複以下兩步直到收斂：
   1. 最佳化 $S_1, \dots, S_k$：每筆 $\mathbf{x}_n$ 歸到離它最近的中心。
   2. 最佳化 $\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_k$：每個中心改成自己那一群的平均。

為什麼需要初始化，課堂上的說法是雞生蛋、蛋生雞：分群要靠中心決定，中心要靠分群決定，總要先有一個。林軒田說他自己常用的做法是從原始資料裡隨便選 $k$ 筆當起點，不同的論文會有不同的做法；建議用隨機的，因為這是困難的最佳化問題，隨機選比較可能避免陷在奇怪的局部最佳解。

**收斂**在講義上的定義是 $S_1, \dots, S_k$ 不再改變，並說它有保證，理由是 $E_{\text{in}}$ 在交替最小化的過程中一直下降。課堂上多講了一個條件：兩個步驟都讓 $E_{\text{in}}$ 變小，而 $E_{\text{in}}$ 有下限 0，所以一路做下去一定會停在某個地方。

本文補充，把「一定會停」說得再完整一點。把 $N$ 筆資料分成 $k$ 群的方法只有有限種（最多 $k^N$ 種）。步驟 2-1 若規定資料只在找到嚴格更近的中心時才換群，那麼只要分群有變，$E_{\text{in}}$ 就嚴格變小；步驟 2-2 不會讓 $E_{\text{in}}$ 變大。$E_{\text{in}}$ 一路嚴格下降，表示同一種分群不會出現第二次，有限種分群總會用完，所以演算法在有限輪內停下來。

講義對 k-means 的定位是：the most popular clustering algorithm through alternating minimization。

### 數值例子三：六筆資料手算 k-means

以下是本文自擬的例子，不在講義上。一維資料六筆：$0, 1, 4, 5, 8, 9$，肉眼看得出三群。取 $k = 3$，起始中心選資料裡的三筆 $(1, 4, 5)$。

**第 1 輪，分群。** 相鄰兩個中心的中點是 2.5 與 4.5，資料依這兩個界線歸隊：$S_1 = \{0, 1\}$、$S_2 = \{4\}$、$S_3 = \{5, 8, 9\}$。這時六筆資料到各自中心的平方距離是 $1, 0, 0, 0, 9, 16$，$E_{\text{in}} = \frac{26}{6} = \frac{13}{3} \approx 4.33$。

**第 1 輪，更新中心。** $\boldsymbol{\mu} = \big(\frac{0+1}{2},\ 4,\ \frac{5+8+9}{3}\big) = \big(\frac{1}{2},\ 4,\ \frac{22}{3}\big)$。平方距離的總和變成 $\frac{1}{4} + \frac{1}{4} + 0 + \frac{49}{9} + \frac{4}{9} + \frac{25}{9} = \frac{55}{6}$，$E_{\text{in}} = \frac{55}{36} \approx 1.53$。

**第 2 輪，分群。** 新的中點是 2.25 與 $\frac{17}{3} \approx 5.67$。5 現在離 4 比離 $\frac{22}{3}$ 近，換到第二群：$S_1 = \{0, 1\}$、$S_2 = \{4, 5\}$、$S_3 = \{8, 9\}$。$E_{\text{in}} = \frac{85}{108} \approx 0.79$。

**第 2 輪，更新中心。** $\boldsymbol{\mu} = \big(\frac{1}{2},\ \frac{9}{2},\ \frac{17}{2}\big)$，每筆資料離自己的中心都是 $\frac{1}{2}$，$E_{\text{in}} = \frac{1}{4}$。

**第 3 輪，分群。** 中點是 2.5 與 6.5，分群沒有變，停止。

| 步驟 | 分群 | 中心 | $E_{\text{in}}$ |
|---|---|---|---|
| 第 1 輪分群後 | $\{0,1\}, \{4\}, \{5,8,9\}$ | $(1,\ 4,\ 5)$ | $\frac{13}{3} \approx 4.33$ |
| 第 1 輪更新後 | 同上 | $(\frac{1}{2},\ 4,\ \frac{22}{3})$ | $\frac{55}{36} \approx 1.53$ |
| 第 2 輪分群後 | $\{0,1\}, \{4,5\}, \{8,9\}$ | 同上 | $\frac{85}{108} \approx 0.79$ |
| 第 2 輪更新後 | 同上 | $(\frac{1}{2},\ \frac{9}{2},\ \frac{17}{2})$ | $\frac{1}{4} = 0.25$ |

**這個結果代表什麼。** $E_{\text{in}}$ 在每個半步都下降，這就是講義說的收斂保證；最後的三個中心各落在一群的正中間。同一份資料在另一組起始中心下的結果，放在後面「k 與起始點不同時」那一小節看。

### 接上 RBF 網路

第 17 頁把整個方法寫成四步，標題是 RBF Network Using k-Means：

1. 跑 $k = M$ 的 k-means，得到 $\{\boldsymbol{\mu}_m\}$。
2. 用 RBF（例如 Gaussian）在這些中心上建立特徵轉換 $\boldsymbol{\Phi}(\mathbf{x}) = [\text{RBF}(\mathbf{x}, \boldsymbol{\mu}_1),\ \text{RBF}(\mathbf{x}, \boldsymbol{\mu}_2),\ \dots,\ \text{RBF}(\mathbf{x}, \boldsymbol{\mu}_M)]$。
3. 在 $\{(\boldsymbol{\Phi}(\mathbf{x}_n), y_n)\}$ 上跑線性模型，得到 $\boldsymbol{\beta}$。
4. 回傳 $g_{\text{RBFNET}}(\mathbf{x}) = \text{LinearHypothesis}(\boldsymbol{\beta}, \boldsymbol{\Phi}(\mathbf{x}))$。

第 3 步的線性模型，課堂上點名線性迴歸、邏輯迴歸、線性 SVM 都可以。

講義在演算法底下有兩點說明。第一，這是用非監督式學習（k-means）來輔助特徵轉換，和上一堂的 autoencoder 一樣。課堂上說明兩者的共同點：萃取特徵時只看資料的 $\mathbf{x}$，不看 $y$。第二，要選的參數有兩個：$M$（代表點個數），以及 RBF 自己的參數，例如 Gaussian 的 $\gamma$。課堂上的回答是這門課一貫的做法，用 validation 來選（[基石第 15 堂](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)）。

這一頁最下面的評語是 RBF Network: a simple (old-fashioned) model。課堂上講得更直白：實務上用 RBF 網路的人並不多，它的表現和 Gaussian SVM、神經網路可能差不多。這堂課講它的理由有三個：它讓我們想一想學過的模型彼此是什麼關係；它相對簡單就能得到還不錯的假說；它和 k-means 有連結，可以順便介紹分群的技巧。

### Fun Time：兩個中心怎麼切

**題目（第 18 頁）：** 對 k-means，考慮 $\mathbf{x}_n \in \mathbb{R}^2$，而且所有的 $x_{n,1}$ 與 $x_{n,2}$ 都不是 0。固定兩個代表點 $\boldsymbol{\mu}_1 = [1, 1]$ 與 $\boldsymbol{\mu}_2 = [-1, 1]$ 時，最佳的 $S_1$ 是哪一個集合？

1. $\{\mathbf{x}_n : x_{n,1} > 0\}$
2. $\{\mathbf{x}_n : x_{n,1} < 0\}$
3. $\{\mathbf{x}_n : x_{n,2} > 0\}$
4. $\{\mathbf{x}_n : x_{n,2} < 0\}$

**答案：1。** 講義只提示 $S_1$ 裝的是離 $\boldsymbol{\mu}_1$ 比離 $\boldsymbol{\mu}_2$ 近的資料。把兩個平方距離相減：

$$
\lVert\mathbf{x} - \boldsymbol{\mu}_1\rVert^2 - \lVert\mathbf{x} - \boldsymbol{\mu}_2\rVert^2 = (x_1 - 1)^2 + (x_2 - 1)^2 - (x_1 + 1)^2 - (x_2 - 1)^2 = -4x_1
$$

$x_2$ 的部分相消，因為兩個中心的第二個座標相同。差是負的（離 $\boldsymbol{\mu}_1$ 比較近）若且唯若 $x_1 > 0$，所以 $S_1 = \{\mathbf{x}_n : x_{n,1} > 0\}$，分界線是 $x_1 = 0$ 這條直線，也就是兩個中心的垂直平分線。選項 2 是 $S_2$。選項 3、4 用 $x_2$ 來切，但 $x_2$ 對兩個距離的影響一樣大，分不出遠近。題目規定座標不為 0，是為了排除剛好落在分界線上、兩邊等距的資料。

本文驗算一個點：$\mathbf{x} = (0.5, -3)$ 到 $\boldsymbol{\mu}_1$ 的平方距離是 $0.25 + 16 = 16.25$，到 $\boldsymbol{\mu}_2$ 是 $2.25 + 16 = 18.25$，歸 $S_1$，和 $x_1 = 0.5 > 0$ 一致。

## 實際跑起來：k 與起始點怎麼影響 k-means 與 RBF 網路

```youtube
url: https://www.youtube.com/watch?v=D5elADTz1vk
title: Radial Basis Function Network :: k-Means and RBFNet in Action @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:46 是 k = 4 的 k-means 示範，02:46–04:36 換不同的 k，04:36–06:18 是接上 RBF 網路之後的分類結果，06:18–07:42 是 full RBF 網路與 nearest neighbor，07:42–08:11 是 Fun Time，之後是總結。）

這一節的講義幾乎全是圖，以下用文字描述圖的內容。

### k 選對時：六輪走到四群的中心

第 19 頁（標題 Beauty of k-Means）是一連串畫面，資料是二維平面上的點，分成上、左、右、下四團，課堂上說這份資料是他設計的，肉眼看得出四群。

- **iteration 0**：資料都是黑點，四個方塊是起始中心：淺藍色的在上面那團的上緣，深藍色和黑色的都在右邊那團附近，紫紅色的在下面那團裡。課堂上說起始中心看起來和資料怎麼群聚沒什麼關係。
- **iteration 1**：每個點依最近的中心上色。淺藍色佔了上面那團的大部分和左邊那團的上半，深藍色只拿到少數幾個點，黑色拿到右邊那團，紫紅色拿到下面那團和左邊那團的下半。接著每個中心移到同色點的平均。
- **之後各輪**：深藍色的中心移進上面那團並逐步接收它，淺藍色的中心一輪一輪往左移，接收左邊那團。課堂上的描述是每輪「再吸納一些人，再取平均」。
- **iteration 6**：四個中心各在一團的中間，四種顏色各佔一團。

講義的結論是 usually works well with proper $k$ and initialization。

### k 與起始點不同時

第 20 頁（Difficulty of k-Means）把同一份資料用 $k = 2, 4, 7$ 各跑一次，先給起始畫面，再給收斂後的畫面：

| | $k = 2$ | $k = 4$ | $k = 7$ |
|---|---|---|---|
| 起始中心 | 兩個都在右邊那團附近 | 和第 19 頁相同 | 右邊那團附近有四個，上面兩個，下面一個 |
| 收斂時的輪數（圖上標示） | iteration 9 | iteration 7 | iteration 6 |
| 收斂後的分群 | 上面與右邊合成一群，左邊與下面合成一群 | 四團各一群 | 右邊那團被切成三小群，上面那團切成兩群，左邊與下面各一群 |

$k = 7$ 的結果，課堂上問了一個問題：七群為什麼不是分得平均一點，而是右邊切成三小群、左邊仍是一大群？答案在起始畫面：起始中心剛好在右邊比較多。

講義的結論是 k-means 對 $k$ 與初始化 'sensitive'。課堂上解釋原因：交替最佳化一次只解一部分，不保證得到全域最佳解，一開始在哪裡，就可能陷在那附近。

**數值例子三的另一組起始點（本文自擬）。** 同樣六筆資料 $0, 1, 4, 5, 8, 9$，$k = 3$，起始中心改選 $(0, 1, 4)$。第 1 輪分群得到 $\{0\}, \{1\}, \{4, 5, 8, 9\}$；更新後中心是 $(0,\ 1,\ \frac{13}{2})$，$E_{\text{in}} = \frac{1}{6}(2.5^2 + 1.5^2 + 1.5^2 + 2.5^2) = \frac{17}{6} \approx 2.83$。第 2 輪的中點是 0.5 與 3.75，分群沒有變，停止。

演算法照樣收斂，但停在 $E_{\text{in}} \approx 2.83$ 的分群，是前面那組起始點的十一倍多：兩個中心擠在左邊那一對資料上，右邊四筆只分到一個。本文把「從六筆裡選三筆當起始中心」的 20 種選法全部跑過：16 種收斂到 $E_{\text{in}} = \frac{1}{4}$ 的三群，4 種停在 $E_{\text{in}} = \frac{17}{6}$。這和講義 $k = 7$ 那張圖是同一個現象。

### 接上 RBF 網路之後的分類

第 21 頁把同一份資料加上標籤：左、右兩團是藍色的圈，上、下兩團是紅色的叉。一條直線分不開這種配置。圖上用模糊的色塊標出各個中心的 Gaussian，黑線是分類邊界：

- **$k = 2$**：整張圖的底色都是紅色，沒有邊界。課堂上的說明是兩個中心剛好落在很混沌不明的位置，分類器乾脆把所有點都判成紅色；兩個中心不足以代表要分類的資料長相。
- **$k = 4$**：四個中心各在一團上，邊界是兩條對開的曲線，左右兩塊判藍色、上下判紅色。課堂上說大致上藍的落在藍的一邊、紅的落在紅的一邊，仍有一些點分錯，但結果合理多了。
- **$k = 7$**：邊界的形狀更細。課堂上說右邊多了一個可以表示紅色的中心，右邊那一帶的分類結果因此比較合理。

講義的結論是 reasonable performance with proper centers。課堂上的總結是：第一層的 k-means 做得合理，第二層要做的事就很輕鬆。

**數值例子四：六筆資料走完四步（本文自擬）。** 給數值例子三的資料加上標籤，中間一群是 $+1$，兩邊是 $-1$：

| $x_n$ | $0$ | $1$ | $4$ | $5$ | $8$ | $9$ |
|---|---|---|---|---|---|---|
| $y_n$ | $-1$ | $-1$ | $+1$ | $+1$ | $-1$ | $-1$ |

在一維上，$\text{sign}(wx + b)$ 只能切一刀，分不出「中間正、兩邊負」。照第 17 頁的四步做，RBF 取 $2^{-(x - \mu)^2}$（也就是 $\gamma = \ln 2$ 的 Gaussian），線性模型用不含常數項的線性迴歸，最後取 sign。以下的小數由本文用 numpy 算出。

*用好的中心 $(0.5,\ 4.5,\ 8.5)$。* 每筆資料離自己的中心 0.5，特徵值是 $2^{-0.25} \approx 0.841$；離隔壁的中心至少 3.5，特徵值不超過 $2^{-12.25} \approx 0.0002$。轉換後的資料幾乎是「自己那一群的位置是 0.841，其他是 0」：

| $x_n$ | $\boldsymbol{\Phi}(x_n)$ | $y_n$ |
|---|---|---|
| $0$、$1$ | 約 $(0.841,\ 0,\ 0)$ | $-1$ |
| $4$、$5$ | 約 $(0,\ 0.841,\ 0)$ | $+1$ |
| $8$、$9$ | 約 $(0,\ 0,\ 0.841)$ | $-1$ |

線性迴歸的解是 $\boldsymbol{\beta} \approx (-1.189,\ 1.189,\ -1.189)$，也就是 $\mp\frac{1}{0.841}$：每個中心的票數是它那一群的標籤除以特徵值。六筆訓練資料的輸出和 $\pm 1$ 都差不到 $0.0002$，全部分對。$g(x)$ 的正負號在 $x \approx 2.5$ 與 $x \approx 6.5$ 改變，剛好是相鄰兩個中心的中點。三個中心、三個票數，就做出了一條直線做不到的分類。

*用卡住的中心 $(0,\ 1,\ 6.5)$。* 右邊四筆只能靠第三個中心。4 和 9 離它一樣遠（2.5），第三個特徵都是 $2^{-6.25} \approx 0.013$；5 和 8 離它也一樣遠（1.5），都是 $2^{-2.25} \approx 0.210$。但 4、5 的標籤是 $+1$，8、9 是 $-1$。同樣的特徵值要對到相反的標籤，最小平方的結果是 $\beta_3 \approx 0.0002$，等於放棄這個中心：$\boldsymbol{\beta} \approx (-0.670,\ -0.662,\ 0.0002)$，右邊四筆的輸出絕對值都不到 0.002，取 sign 之後六筆錯三筆。

*只用兩個中心。* $k = 2$ 的 k-means 從起始中心 $(0, 9)$ 出發，收斂到 $(\frac{5}{3},\ \frac{22}{3})$，兩群是 $\{0, 1, 4\}$ 與 $\{5, 8, 9\}$，每一群裡都混著兩種標籤。線性迴歸得到 $\boldsymbol{\beta} \approx (-1.526,\ -1.526)$，兩個票數都是負的，$g(x)$ 在整條數線上都小於 0，六筆全部判成 $-1$，錯兩筆。這和講義 $k = 2$ 那張整片紅色的圖是同一種情況。

| 中心 | 來源 | $\boldsymbol{\beta}$ | 訓練資料分錯幾筆 |
|---|---|---|---|
| $(0.5,\ 4.5,\ 8.5)$ | $k = 3$，起始 $(1, 4, 5)$ | $(-1.189,\ 1.189,\ -1.189)$ | 0 |
| $(0,\ 1,\ 6.5)$ | $k = 3$，起始 $(0, 1, 4)$ | $(-0.670,\ -0.662,\ 0.0002)$ | 3 |
| $(\frac{5}{3},\ \frac{22}{3})$ | $k = 2$，起始 $(0, 9)$ | $(-1.526,\ -1.526)$ | 2 |

**這個結果代表什麼。** 三種情況用的是同一個 RBF、同一個線性模型，差別只在中心。第二步的線性模型救不了第一步沒找好的中心，這就是講義 with proper centers 那個條件的意思，也是 $M$ 與起始點需要用 validation 多試幾組的原因。

### full RBF 網路與 nearest neighbor 的邊界

第 22 頁在同一份資料上並排三張圖：

| | 左 | 中 | 右 |
|---|---|---|---|
| 模型 | full RBF 網路，$k = N$，$\lambda = 0.001$ | $k = 4$ 的 RBF 網路 | nearest neighbor |
| 邊界的樣子 | 沿著資料彎來彎去的曲線 | 兩條平滑的曲線 | 轉折很多的折線，貼著個別的點走 |

課堂上的評語比圖給人的印象溫和：nearest neighbor 的邊界比較不平滑，但不算太不合理；full RBF 網路加上正則化，也能得到還不錯的邊界。兩者共同的問題在計算：它們某種角度上把所有資料都用上了，預測時的計算比較吃力，所以實務上不見得常被使用。課堂上還提到，nearest neighbor 常要靠幾何上更好的搜尋演算法來克服計算量。

講義這一頁的結論只有一句：full RBF Network: generally less useful。講義沒有寫原因，課堂上給的原因是計算量。

### Fun Time：哪一個正則化最強

**題目（第 23 頁）：** RBF 網路搭配 ridge 線性迴歸時，下列哪一種「最受正則化」（most regularized）？

1. $M$ 小、$\lambda$ 小
2. $M$ 小、$\lambda$ 大
3. $M$ 大、$\lambda$ 小
4. $M$ 大、$\lambda$ 大

**答案：2。** 這堂課給了兩個正則化的手段，兩個旋鈕各往自己的方向轉：

- $M$ 小：中心少，$\boldsymbol{\beta}$ 的分量就少，可調的權重少。講義寫 fewer weights and more regularized。
- $\lambda$ 大：ridge 對 $\lVert\boldsymbol{\beta}\rVert^2$ 的懲罰重，$\boldsymbol{\beta}$ 被壓得更短。講義寫 shorter $\boldsymbol{\beta}$ more and more regularized。

兩個都往正則化的方向轉的只有選項 2。選項 3 是另一個極端，$M = N$、$\lambda \to 0$ 時就回到 exact interpolation。選項 1 與 4 各只轉了一個旋鈕。課堂上把「最受正則化」說成模型複雜度比較受到控制。本文補一句：最受正則化不等於最好，數值例子四裡 $M = 2$ 的網路就因為中心太少而分錯；$M$ 與 $\lambda$ 還是要用 validation 選。

### 這堂課的四句總結

第 24 頁把四節各收成一句：

| 節 | 講義的總結 |
|---|---|
| RBF Network Hypothesis | 用代表點取代神經元來做轉換（prototypes instead of neurons as transform） |
| RBF Network Learning | 對代表點的「假說」做線性 aggregation |
| k-Means Algorithm | 用交替最佳化做分群 |
| k-Means and RBF Network in Action | 代表點的個數要選得恰當 |

下一堂的預告是 extracting features from abstract data。課堂上的說法是要處理更抽象的資料，看怎麼從裡面萃取特徵。

## 自我檢查

**1. 兩筆一維資料 $x_1 = 0$、$x_2 = 1$，$y = (3, 0)$，用 $\gamma = \ln 2$ 的 Gaussian（相似度是 $2^{-d^2}$）。算 full RBF 網路的 $\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y}$，確認它通過兩個點，再算 $g(2)$。**

答案：$\mathrm{Z} = \begin{bmatrix} 1 & \frac{1}{2} \\ \frac{1}{2} & 1 \end{bmatrix}$，行列式是 $\frac{3}{4}$，$\mathrm{Z}^{-1} = \frac{4}{3}\begin{bmatrix} 1 & -\frac{1}{2} \\ -\frac{1}{2} & 1 \end{bmatrix}$，$\boldsymbol{\beta} = (4, -2)$。檢查：$g(0) = 4 \cdot 1 - 2 \cdot \frac{1}{2} = 3$，$g(1) = 4 \cdot \frac{1}{2} - 2 \cdot 1 = 0$。$g(2) = 4 \cdot \frac{1}{16} - 2 \cdot \frac{1}{2} = -\frac{3}{4}$。第二筆的 $y$ 是 0，票數卻是 $-2$，因為它要抵銷第一筆傳過來的 $4 \cdot \frac{1}{2} = 2$。

**2. 一維資料 $0, 2, 3, 10$，$k = 2$，起始中心 $(0, 2)$。手算 k-means 到收斂，寫出每一輪的分群、中心，以及更新中心後的 $E_{\text{in}}$。**

答案：第 1 輪分群 $\{0\}, \{2, 3, 10\}$，中心 $(0, 5)$，$E_{\text{in}} = \frac{9 + 4 + 25}{4} = \frac{19}{2}$。第 2 輪：中點是 2.5，分群 $\{0, 2\}, \{3, 10\}$，中心 $(1, \frac{13}{2})$，$E_{\text{in}} = \frac{1 + 1 + 12.25 + 12.25}{4} = \frac{53}{8}$。第 3 輪：中點是 3.75，分群 $\{0, 2, 3\}, \{10\}$，中心 $(\frac{5}{3}, 10)$，$E_{\text{in}} = \frac{1}{4}\cdot\frac{14}{3} = \frac{7}{6}$。第 4 輪：中點約 5.83，分群不變，停止。$E_{\text{in}}$ 依序是 $9.5 \to 6.625 \to 1.17$，一路下降。

**3. $\mathrm{Z}$ 和 Gaussian kernel 矩陣 $\mathrm{K}$ 是同一個矩陣，為什麼 regularized full RBFNet 與 kernel ridge regression 的 $\boldsymbol{\beta}$ 公式不一樣？**

判準：答案要說出兩者懲罰的量不同。kernel ridge regression 懲罰無限多維 $\mathcal{Z}$ 空間裡的 $\mathbf{w}^\top\mathbf{w}$，用 $\boldsymbol{\beta}$ 寫是 $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$，解是 $(\mathrm{K} + \lambda\mathrm{I})^{-1}\mathbf{y}$；regularized full RBFNet 把 $\mathbf{z}_n$ 當成 $N$ 維特徵，懲罰 $\boldsymbol{\beta}^\top\boldsymbol{\beta}$，解是 $(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}$。能再指出 $\lambda \to 0$ 時兩者都回到 $\mathrm{Z}^{-1}\mathbf{y}$ 更好。

**4. $\phi(\mathbf{x}, \boldsymbol{\mu}) = \dfrac{1}{1 + \lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2}$ 是不是 radial basis function？$\phi(\mathbf{x}, \boldsymbol{\mu}) = \mathbf{x}^\top\boldsymbol{\mu}$ 呢？**

答案：第一個是。它只用到距離，距離 0 時是 1，距離愈大值愈小，符合「隨距離單調不增」。第二個不是：$\mathbf{x} = \boldsymbol{\mu} = (1, 0)$ 時值是 1，$\mathbf{x} = \boldsymbol{\mu} = (2, 0)$ 時值是 4，兩組的距離都是 0，值卻不同。

**5. 訓練資料 $N = 10{,}000$ 筆。比較 nearest neighbor、full RBF 網路、$M = 10$ 的 k-means RBF 網路：訓練時各做什麼？預測一筆新資料各要算幾次距離？**

答案：nearest neighbor 訓練時只把資料存起來，預測時要算 10,000 次距離再挑最小的（不靠額外的搜尋結構的話）。full RBF 網路訓練時要解 $10{,}000 \times 10{,}000$ 的線性系統（或它的 ridge 版本）得到 $\boldsymbol{\beta}$，預測時同樣要算 10,000 個 RBF。k-means RBF 網路訓練時先跑 k-means、再解一個只有 10 個變數的線性模型，預測時只算 10 個 RBF。前兩者就是講義說的 lazy 與 generally less useful。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 與 [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 兩個學期的課程計畫都沒有排這一堂：兩學期都在神經網路與深度學習（投影片代號 212u、213u）之後直接接現代深度學習（302u、303u）。所以這堂沒有對應的 `u` 版更新投影片，課程頁也沒有替它標教科書章節。影片與講義本身是免費公開的。

**作業。** 這堂沒有對應的作業題。Fall 2024 的 HW0–HW7 與期末專題說明裡，沒有任何一題考 RBF 網路或 k-means（2026-09-30 查核）。能拿來檢查自己的，是講義裡的四題 Fun Time 與上面的自我檢查；講義把每題 Fun Time 的答案印在題目的下一頁，可以先遮住再作答。作業的整體導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**自己動手的實驗（非課程指定）。** 用 scikit-learn 的 `KMeans` 取中心，自己寫 Gaussian 轉換，再接 `Ridge`，在一份二維玩具資料上掃過 $M \in \{2, 4, 8, 32, N\}$ 與幾個 $\lambda$，把分類邊界畫出來，和講義第 21、22 頁的圖比較。再用不同的亂數種子重跑 k-means，看中心與邊界變了多少。接著把 k-means 自己手寫一次，和 `KMeans` 的結果對照；下一堂的交替最小平方法會用到同一個骨架：固定一組變數、解另一組、重複到不變。

**下一堂。** [技法第 15 堂：矩陣分解](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization)處理的輸入連數值都不是，只是使用者的編號，要從評分資料裡萃取出使用者與電影的特徵。

## 課程影片來源

原始影片：[RBF Network Hypothesis](https://www.youtube.com/watch?v=7lHhnpdPVr0)、[RBF Network Learning](https://www.youtube.com/watch?v=dEYdx2rS66c)、[k-Means Algorithm](https://www.youtube.com/watch?v=ker9RF2TDUU)、[k-Means and RBF Network in Action](https://www.youtube.com/watch?v=D5elADTz1vk)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：原本與第 15 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [技法第 14 堂講義 214_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time 與第 19–22 頁的圖都出自這份講義。
- [技法第 6 堂講義 206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf)：kernel ridge regression 的目標函數與公式解，用在兩種正則化的對照。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：課程計畫未排這一堂。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：課程計畫未排這一堂。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
