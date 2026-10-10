---
title: "林軒田機器學習技法 T9–T11：決策樹、隨機森林與梯度提升樹"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, decision-trees]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 13
tldr: "技法第 9–11 講用「樹＋aggregation」一條線串起三種模型。T9 把決策樹看成 conditional aggregation，講 C&RT 的二元分支、Gini 與迴歸誤差、剪枝、類別特徵與 surrogate branch。T10 把 bagging 套在完全長大的樹上，加上隨機子空間與隨機投影就是隨機森林，順帶得到免費的 OOB 驗證與 permutation 特徵重要度。T11 先把 AdaBoost 重新推導成對指數誤差做函數空間的最速下降，再把誤差換成平方誤差，得到「對殘差做迴歸」的 GBDT。練習用 Fall 2024 HW7 的 impurity、gradient boosting 證明題；沒有官方解答。"
description: "台大林軒田《機器學習技法》第 9 講 Decision Tree、第 10 講 Random Forest、第 11 講 Gradient Boosted Decision Tree 導讀：C&RT 演算法與 heuristics、隨機森林與 random-combination 分支、OOB 估計與模型選擇、permutation test 特徵選擇、AdaBoost-DTree、AdaBoost 的最佳化觀點、gradient boosting 推導與 aggregation 模型總整理，附 Fall 2024 HW7 對應題與課程頁列的 Loh、Breiman、Friedman 延伸閱讀。"
draft: false
glossary:
  - term: "C&RT"
    aliases: ["CART", "Classification and Regression Tree"]
    definition: "每個節點用 decision stump 二元分支、挑讓兩邊最「純」的切法，葉子放 E_in 最佳的常數（分類取多數、迴歸取平均），長到不能再切為止。"
    context: "林軒田 T9 特別聲明，課堂上的 C&RT 只取 CART 的部分元件。"
  - term: "OOB"
    aliases: ["out-of-bag", "袋外估計"]
    definition: "bootstrap 抽樣時沒被抽中的樣本。每個樣本大約有 1/e 的機率不在某一份 bootstrap 資料裡，可以拿來驗證沒看過它的那些樹。"
    context: "T10 稱 E_oob 為 bagging／隨機森林的 self-validation，不需要另外切 validation、也不需重新訓練。"
  - term: "gradient boosting"
    aliases: ["GradientBoost", "GBDT"]
    definition: "把 boosting 看成在函數空間做最速下降：每一輪找一個近似負梯度方向的 g_t，再用一維搜尋決定步長 α_t。平方誤差時等於對殘差 y_n − s_n 做迴歸。"
    context: "T11 由 AdaBoost 的指數誤差推廣到任意誤差；基礎模型用剪過枝的樹就是 GBDT。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en)

> **版本說明**：本文以 [MOOC 版](https://www.csie.ntu.edu.tw/~htlin/mooc/)《機器學習技法》為核心教材：[209_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf)（Decision Tree）、[210_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf)（Random Forest）、[211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf)（Gradient Boosted Decision Tree）與[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)第 34–45 支。作業對照 [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)。事實皆於 2026-09-30 打開核對。存取等級：MOOC 本身 **A2**，加上 Fall 2024 作業 PDF 是 **A3（評分鏈除外）**——沒有官方解答，Gradescope 與 NTU COOL 限修課生。

**系列位置**：上一篇 [Blending、Bagging 與 AdaBoost](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)｜下一篇 [神經網路與深度學習](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)結束時，aggregation 的地圖上還空著一格。T9 開頭把它畫成一張表：

| | uniform | non-uniform | conditional |
|---|---|---|---|
| blending（先有 g_t 再組合） | voting／averaging | linear | stacking |
| learning（邊學 g_t 邊組合） | Bagging | AdaBoost | **Decision Tree** |

決策樹就是「邊學邊做 conditional aggregation」的那一格。本系列把三講合成一篇的理由也在這裡：T9 先講樹，T10 把樹放進 bagging，T11 把樹放進 boosting，三者共用同一條主線。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=dAqPpAXnMJ4
title: Decision Tree Hypothesis
```

```youtube
url: https://www.youtube.com/watch?v=s9Um2O7N7YM
title: Decision Tree Algorithm
```

原始影片：[Decision Tree Hypothesis](https://www.youtube.com/watch?v=dAqPpAXnMJ4)、[Decision Tree Algorithm](https://www.youtube.com/watch?v=s9Um2O7N7YM)、[Decision Tree Heuristics in C&RT](https://www.youtube.com/watch?v=uvGC_Y0EYiA)、[Decision Tree in Action](https://www.youtube.com/watch?v=ryWTrPPbqcg)、[Random Forest Algorithm](https://www.youtube.com/watch?v=ATM3sH0D45s)、[Out-of-bag Estimate](https://www.youtube.com/watch?v=7oz5aO-FkR0)、[Feature Selection](https://www.youtube.com/watch?v=ChqNC94JXtM)、[Random Forest in Action](https://www.youtube.com/watch?v=Ipfpf7AW_yM)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 在課表上的位置

| 版本 | 週次 | 投影片 | 延伸閱讀（課程頁原列） |
|---|---|---|---|
| MOOC | 技法 T9–T11 | 209、210、211 | — |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W12（11/18），和 T8 同一週 | [209u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/209u_handout.pdf)、[210u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/210u_handout.pdf)、[211u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/211u_handout.pdf) | Loh、Breiman et al.（CART 書）、Breiman（RF）、Friedman |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W12（11/25） | 209u–211u 目前 404，尚未公開 | 同上 |

課程頁沒有替這三講標 LFD 章節。

## T9 Decision Tree

影片：[Decision Tree Hypothesis](https://www.youtube.com/watch?v=dAqPpAXnMJ4)、[Decision Tree Algorithm](https://www.youtube.com/watch?v=s9Um2O7N7YM)、[Decision Tree Heuristics in C&RT](https://www.youtube.com/watch?v=uvGC_Y0EYiA)、[Decision Tree in Action](https://www.youtube.com/watch?v=ryWTrPPbqcg)

### 決策樹是哪一種 aggregation

投影片的例子是「今天要不要看 MOOC」：先看下班時間，早於 18:30 再看有沒有約會，晚於 21:30 再看作業截止日還剩幾天。

寫成 aggregation 的形式，G(x) = Σ q_t(x)·g_t(x)：g_t 是第 t 條路徑末端的葉子（這裡是常數），q_t(x) 是「x 是否走在第 t 條路徑上」。也可以用遞迴的觀點看：G(x) = Σ_c [b(x) = c]·G_c(x)，b 是分支條件，G_c 是第 c 棵子樹。投影片的說法是「就像你的資料結構老師會講的」。

投影片也老實列了決策樹的兩面。好處：人看得懂、在商業與醫療資料分析裡很常用、簡單到大一生就能寫、訓練和預測都快。壞處：理論解釋很少、heuristics 多到讓初學者困惑、也沒有單一個代表性的演算法。

### C&RT 的四個選擇

基本的決策樹演算法是遞迴：沒達到終止條件就學一個分支條件 b(x)、把資料切成 C 份、各自遞迴建子樹。要決定的有四件事：分支數、分支條件、終止條件、葉子的基礎假說。

課堂上的 C&RT（投影片聲明它只取 CART 的部分元件）這樣選：

- **C = 2**，二元樹。
- **葉子**是 E_in 最佳的常數：分類取多數、迴歸取平均。
- **分支**用 decision stump，挑讓切出來的兩邊最純的：b(x) = argmin Σ_c |D_c|·impurity(D_c)。
- **impurity** 就是用最佳常數時的 E_in。迴歸用平方誤差；分類有 Gini index（1 − Σ_k (N_k/N)²，所有類別一起考慮）與分類錯誤率（只看多數類別）。投影片說常見選擇是分類用 Gini、迴歸用迴歸誤差。
- **終止**：所有 y_n 一樣（impurity = 0），或所有 x_n 一樣（找不到 stump 可切），被迫停下。

所以 C&RT 預設會長成一棵完全長大、葉子是常數的樹。

### 剪枝、類別特徵、缺值

完全長大的樹在所有 x_n 都不同時 E_in = 0，但深處的節點只用很少的資料建出來，容易 overfitting。投影片的處理：

- **剪枝**：正則化項取葉子數，Ω(G) = NumberOfLeaves(G)。所有可能的樹列舉不完，所以只考慮一串：G^(0) 是完全長大的樹，G^(i) 是從 G^(i−1) 拿掉一片葉子後 E_in 最小的那棵。λ 用 validation 選。
- **類別特徵**：數值特徵用門檻切，類別特徵改用子集合，b(x) = [x_i ∈ S] + 1。
- **缺值**：訓練時同時記下幾個「替代分支」（surrogate branch），它們的切法接近最佳分支。例如最佳分支是體重 ≤ 50 kg，預測時若缺體重，就改用身高的門檻。

投影片把 C&RT 的特長整理成五點：人看得懂、容易做多類別、容易處理類別特徵、容易處理缺值、非線性而且訓練與測試都有效率。並提到另一個常見的決策樹演算法 C4.5，選了不同的 heuristics。在示範資料集上，C&RT 比上一講的 AdaBoost-Stump 還更有效率。

## T10 Random Forest

影片：[Random Forest Algorithm](https://www.youtube.com/watch?v=ATM3sH0D45s)、[Out-of-bag Estimate](https://www.youtube.com/watch?v=7oz5aO-FkR0)、[Feature Selection](https://www.youtube.com/watch?v=ChqNC94JXtM)、[Random Forest in Action](https://www.youtube.com/watch?v=Ipfpf7AW_yM)

### bagging ＋ 完全長大的樹

bagging 會降低 variance，完全長大的樹 variance 很大。把兩者放在一起，投影片叫它「aggregation of aggregation」：

**隨機森林（RF）= bagging + 完全長大的 C&RT**

好處有三：高度平行、繼承 C&RT 的優點、用投票抵銷完全長大的樹的缺點。

多樣性還能再加。bagging 抽的是樣本，RF 還可以抽特徵：隨機挑 d′ 個維度，Φ(x) = (x_{i1}, …, x_{id′})，也就是隨機子空間。原始 RF 在 C&RT 的**每一次分支**都重新抽一個子空間。

再進一步，投影矩陣 P 的每一列不一定要是單位向量，可以是隨機的低維組合 φ_i(x) = p_iᵀx（只有 d″ 個非零分量）。原始 RF 在每次分支時考慮 d′ 個這樣的隨機投影。這時每個分支 b(x) 其實就是一個 perceptron。投影片的標語是「randomness everywhere!」。

### OOB：免費的驗證

bootstrap 抽 N′ 個時，每一份 D̃_t 都有一些樣本沒被抽到，它們是 g_t 的 out-of-bag（OOB）樣本。N′ = N 而且 N 很大時，某個樣本不在 D̃_t 裡的機率是 (1 − 1/N)^N ≈ 1/e，所以每棵樹大約有 N/e 個 OOB 樣本。

OOB 樣本對 g_t 就像 validation 資料。拿它驗證單棵樹很容易，但很少需要；真正有用的是驗證整個 G：

E_oob(G) = (1/N) Σ_n err(y_n, G_n⁻(x_n))，其中 G_n⁻ 只由「沒看過 x_n 的那些樹」組成。

投影片稱這是 bagging／RF 的 self-validation，可以直接拿來做模型選擇，例如選 d″ 這類 RF 參數，而且不需要重新訓練。投影片說 E_oob 在實務上通常很準。

### 用 permutation test 算特徵重要度

特徵選擇想去掉兩種特徵：重複的（像同時有「年齡」和「完整生日」）與無關的（像用保險類型預測癌症）。好處是效率、泛化、可解釋性；壞處是組合最佳化很貴、可能 overfit、也可能被誤讀。投影片說決策樹是少數內建特徵選擇的模型。

如果能算出每個特徵的重要度，就能挑前 d′ 名。線性模型可以直接看 |w_i|，非線性模型就難了。RF 的做法是 **permutation test**：如果特徵 i 重要，把它的值換成隨機值，表現應該變差。為了不改變 x_i 的分布，把 {x_{n,i}} 在樣本之間打亂順序，而不是換成均勻或高斯亂數。

importance(i) = performance(D) − performance(D^(p))

一般來說 D^(p) 要重新訓練再驗證，原始 RF 用 OOB 繞過：importance(i) = E_oob(G) − E_oob^(p)(G)，其中 E_oob^(p) 是在算 OOB 誤差時，把 x_{n,i} 換成打亂後的 OOB 值。投影片的評語是「通常有效率，而且實務上有希望」。

### 要幾棵樹

示範資料上，樹越多，邊界越平滑，看起來也越像大 margin。投影片的經驗例子是 KDD Cup 2013 Track 1（台大再次奪冠，任務是預測作者與論文的關係）：幾千棵樹的 E_val 隨亂數種子落在 0.015 到 0.019，前 20 名隊伍的 E_out 也落在 0.014 到 0.019，最後決定用 12000 棵、種子 1。RF 的缺點因此是：隨機過程不穩定時可能需要非常多棵樹，要回頭檢查 G 的穩定性。

## T11 Gradient Boosted Decision Tree

影片：[AdaBoost Decision Tree](https://www.youtube.com/watch?v=aX6ZiIWLjdk)、[Optimization of AdaBoost](https://www.youtube.com/watch?v=lKkXrFVcZjs)、[Gradient Boosting](https://www.youtube.com/watch?v=F_EuNXhS9js)、[Summary of Aggregation](https://www.youtube.com/watch?v=JqSLmlSpqNo)

### AdaBoost-DTree：樹要夠弱

把 RF 的 bagging 換成 AdaBoost，需要一棵吃樣本權重的樹。不想改 DTree 的程式時，可以依 u^(t) 的比例抽樣出 D̃_t，再拿一般的 DTree 去學。

另一個問題是 AdaBoost 需要**弱**的基礎演算法。完全長大的樹在所有 x_n 不同時 E_in^u = 0，於是 ε_t = 0、α_t = ∞，投影片叫這個「獨裁」。所以要剪枝（或直接限制高度），而且只在抽樣出來的部分資料上訓練。

極端情況是高度 ≤ 1 的樹：如果 impurity 用二元分類錯誤率，它就是 decision stump。所以 AdaBoost-Stump 是 AdaBoost-DTree 的特例。

### AdaBoost 的最佳化觀點

這一節是 T11 的核心，把上一講看起來很「魔法」的 α_t 重新推一次。

先看權重：答錯乘 ♦_t、答對除 ♦_t，可以統一寫成 u_n^(t+1) = u_n^(t)·exp(−y_n α_t g_t(x_n))。一路乘下來，u_n^(T+1) 正比於 exp(−y_n·Σ_t α_t g_t(x_n))。

Σ_t α_t g_t(x_n) 是 G 的投票分數。回想 T7 的 linear blending 和硬邊界 SVM，y_n 乘上投票分數就是一個有正負號、沒正規化的 margin。我們希望它是正的而且越大越好，也就是 exp(−y_n·分數) 越小越好。

投影片的主張是：**AdaBoost 會讓 Σ_n u_n^(t) 下降**，等於在某種程度上最小化 Σ_n exp(−y_n s_n)。其中 err_ADA(s, y) = exp(−ys) 是 0/1 誤差的凸上界，叫指數誤差。

<details>
<summary>推導：g_t 是近似的函數梯度方向，α_t 是最速下降的步長</summary>

**找方向**。第 t 輪想找一個函數 h 與步長 η，讓 Ê_ADA 下降：

Ê_ADA = (1/N) Σ_n exp(−y_n(Σ_{τ<t} α_τ g_τ(x_n) + η h(x_n)))
= Σ_n u_n^(t) exp(−y_n η h(x_n))
≈ Σ_n u_n^(t)(1 − y_n η h(x_n))（在 η = 0 附近做 Taylor 展開）
= Σ_n u_n^(t) − η Σ_n u_n^(t) y_n h(x_n)

所以好的 h 要最小化 Σ_n u_n^(t)(−y_n h(x_n))。二元分類時 y_n、h(x_n) ∈ {−1, +1}，這個量等於 −Σ_n u_n^(t) + 2·E_in^u(h)·N。最小化它，就是最小化加權的 E_in^u(h)，而這正是 AdaBoost 裡基礎演算法 A 在做的事。

**找步長**。找到 g_t 後，不用固定的小 η，而是直接找讓 Ê_ADA 最小的 η（最速下降）：

Ê_ADA = (Σ_n u_n^(t))·((1 − ε_t) exp(−η) + ε_t exp(+η))

對 η 微分設為 0，得到 η_t = ln √((1 − ε_t)/ε_t) = α_t。

</details>

結論：**AdaBoost 就是用近似的函數梯度做最速下降**。上一講的 α_t 其實就是最佳步長。HW7 Q6 要你證明的 U_{t+1}/U_t = 2√(ε_t(1 − ε_t))，就是這個下降量的精確版本。

### Gradient boosting：換掉誤差函數

既然 AdaBoost 是對指數誤差做最速下降，把誤差換成任意的 err、把 h 換成實數輸出的假說，就得到 GradientBoost。它可以用在迴歸、軟分類等其他問題。

迴歸用平方誤差時，推導出來的結論很乾淨：

<details>
<summary>推導：平方誤差下，g_t 是對殘差的迴歸，α_t 是一維線性迴歸</summary>

令 s_n = Σ_{τ<t} α_τ g_τ(x_n)，err(s, y) = (s − y)²。在 s_n 附近 Taylor 展開：

min_h (1/N) Σ_n err(s_n + η h(x_n), y_n) ≈ 常數 + (η/N) Σ_n h(x_n)·2(s_n − y_n)

如果 h 沒有限制，最佳解是 h(x_n) = −∞·(s_n − y_n)，沒有意義。h 的大小不重要（η 之後會再最佳化），所以加上懲罰項 (h(x_n))²：

常數 + (η/N) Σ_n (2h(x_n)(s_n − y_n) + (h(x_n))²) = 常數 + (η/N) Σ_n (常數 + (h(x_n) − (y_n − s_n))²)

也就是在 {(x_n, y_n − s_n)} 上做平方誤差迴歸，y_n − s_n 就是**殘差**。

找到 g_t 後，α_t 是讓 Σ_n((y_n − s_n) − η g_t(x_n))² 最小的 η，也就是以 g_t(x_n) 為輸入、殘差為輸出的一維線性迴歸。

</details>

組起來就是 GBDT：

1. s_1 = … = s_N = 0。
2. 每一輪用（平方誤差的）迴歸演算法在 {(x_n, y_n − s_n)} 上學 g_t，投影片建議用抽樣加剪枝的 C&RT。
3. α_t = OneVarLinearRegression({(g_t(x_n), y_n − s_n)})。
4. 更新 s_n ← s_n + α_t g_t(x_n)。
5. 回傳 G(x) = Σ_t α_t g_t(x)。

投影片稱 GBDT 是 AdaBoost-DTree 的「迴歸手足」，實務上很受歡迎。

### Aggregation 模型總整理

T11 最後把整個第二段收成三張圖：

- **Blending**（先有 g_t）：uniform 是投票／平均，non-uniform 是在 g_t 轉換後的輸入上學線性模型，conditional 是學非線性模型。uniform 為了穩定；non-uniform 與 conditional 要小心複雜度。
- **Aggregation learning**（邊學邊組）：Bagging 靠 bootstrap 造多樣性、uniform 投票；AdaBoost 靠重新加權、以最速搜尋決定線性權重；決策樹靠切資料、以分支做 conditional 投票；GradientBoost 靠擬合殘差、以最速搜尋決定線性權重。投影片說 boosting 類的最受歡迎。
- **Aggregation of aggregation**：RF = 隨機化的 bagging + 「強」的樹；AdaBoost-DTree = AdaBoost + 「弱」的樹；GBDT = GradientBoost + 「弱」的樹。三者實務上都很常用。

最後一張回到 T7 開頭的兩個直覺：aggregation 可以讓 G 變強，像特徵轉換，治 underfitting；也可以讓 G 變穩，像正則化，治 overfitting。適當的 aggregation（又稱 ensemble）帶來更好的表現。

## 用 Fall 2024 作業練習

[HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（2024-12-02 發布、12-16 截止）裡跟這三講相關的題目：

| 題 | 類型 | 練什麼 |
|---|---|---|
| Q2 | 自動批改 | 把幾種 impurity 函數（分類錯誤率、平方誤差、entropy、closeness）除以最大值正規化後，哪一個和 Gini index 等價 |
| Q6 | 人工批改 | 證明 U_{t+1}/U_t = 2√(ε_t(1 − ε_t))；題目明寫對應 Lecture 208 與 211 的 AdaBoost |
| Q7 | 人工批改 | gradient boosting 的基礎模型換成不帶正則化的線性迴歸時，證明或反駁最佳的 α_1 = 1 |
| Q8 | 人工批改 | GBDT 用最速的 η 當 α_t 更新完 s_n 後，證明 Σ_n (y_n − s_n) g_t(x_n) = 0，並思考殘差向量與 g_t 輸出向量的關係 |

這三講沒有程式題。想動手的話，可以把[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)的 AdaBoost-Stump（HW7 Q10–12）改成 AdaBoost-DTree，或在同一份 madelon 資料上跑 scikit-learn 的 `RandomForestClassifier`，比較 `oob_score_` 與測試集誤差，親手驗證「E_oob 通常很準」這句話。沒有官方解答，證明題只能靠自己或同學互相檢查。完整的作業導讀見[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

## 自學怎麼用這三講

1. T9、T10 可以當作「讀懂 scikit-learn 參數」的課：`max_depth`、`max_features`、`oob_score`、`feature_importances_` 背後分別是投影片的哪一段，看完應該都對得上。
2. T11 的 [Optimization of AdaBoost](https://www.youtube.com/watch?v=lKkXrFVcZjs) 最值得反覆看。把兩個折疊推導各自推一次，之後讀 gradient boosting 的任何變體都會輕鬆很多。
3. 今晚可以做的一件事：用 numpy 寫 30 行的 GBDT（基礎模型用深度 2 的 `DecisionTreeRegressor`），在一維 sin 曲線加雜訊的資料上畫出第 1、5、20 輪的 G。你會看到每一輪都在補上一輪留下的殘差。

## 延伸閱讀

課程頁列的延伸閱讀：

- [Loh, Classification and Regression Trees（WIREs 綜述）](https://pages.stat.wisc.edu/~loh/treeprogs/guide/wires11.pdf)：決策樹演算法的全景。
- Breiman et al., *Classification and Regression Trees*：CART 原書，課程頁連到 [Amazon 書頁](http://www.amazon.com/Classification-Regression-Wadsworth-Statistics-Probability/dp/0412048418)。
- [Breiman, Random Forests（Machine Learning, 2001）](https://doi.org/10.1023/A:1010933404324)：隨機森林原始論文。
- [Friedman, Greedy Function Approximation: A Gradient Boosting Machine（Annals of Statistics, 2001）](https://doi.org/10.1214/aos/1013203451)：gradient boosting 原始論文。課程頁的舊連結（www-stat.stanford.edu）在 2026-09-30 已經打不開，這裡改用 DOI。

站內其他課程對同一主題的講法（本篇內容不因此省略）：

- [Harvard CS181 HW4：決策樹、隨機森林與 MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)
- [CMU 10-301 HW2：決策樹](/posts/learning/2026-08-22-cmu-10301-hw2-decision-trees)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 T9–T11 的小節標題與投影片
- [Lecture 9: Decision Tree（209_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf) — conditional aggregation、C&RT、impurity、剪枝、類別特徵、surrogate branch
- [Lecture 10: Random Forest（210_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf) — RF、隨機子空間與隨機投影、OOB、permutation 特徵重要度、KDD Cup 2013 經驗
- [Lecture 11: Gradient Boosted Decision Tree（211_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf) — AdaBoost-DTree、最佳化觀點、gradient boosting、aggregation 總整理
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) — 第 34–45 支
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — 週次、209u–211u 投影片與延伸閱讀清單
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W12 排程
- [Loh, Classification and Regression Trees](https://pages.stat.wisc.edu/~loh/treeprogs/guide/wires11.pdf)
- [Breiman, Random Forests](https://doi.org/10.1023/A:1010933404324)
- [Friedman, Greedy Function Approximation: A Gradient Boosting Machine](https://doi.org/10.1214/aos/1013203451)
- 站內：[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)
