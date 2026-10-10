---
title: "林軒田機器學習技法 T5–T6：Kernel 邏輯迴歸與支援向量迴歸——SVM 其實是正則化模型"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods, logistic-regression, kernel-regression]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 11
tldr: "技法第 5 講把 soft-margin SVM 改寫成無限制形式：½wᵀw 加上 C 乘以 hinge 誤差的總和，也就是一個 L2 正則化模型，C 越大正則化越弱。hinge 誤差和邏輯迴歸的 cross-entropy 都是 0/1 誤差的凸上界，所以 SVM 近似於 L2 正則化邏輯迴歸。要機率輸出，可以用 Platt 的兩層學習在 SVM 分數上再跑一次邏輯迴歸，或靠 representer theorem 直接做 kernel 邏輯迴歸。第 6 講用同一個定理得到 kernel ridge regression 的解析解 β = (λI + K)⁻¹y，但 β 是稠密的；改用 ε-insensitive 的管狀誤差，就得到係數稀疏的 SVR。Fall 2026 沒有排這兩講。"
description: "台大林軒田《機器學習技法》Lecture 5 Kernel Logistic Regression 與 Lecture 6 Support Vector Regression 導讀：soft-margin SVM 的無限制形式與 hinge 誤差、SVM 與邏輯迴歸的誤差比較、Platt 的機率化 SVM、representer theorem 與 kernel 邏輯迴歸、kernel ridge regression、LSSVM、tube regression、SVR 原始與對偶問題，以及 kernel 模型總整理；附兩個學期的排課差異與 Fall 2024 HW6 Q3。"
draft: false
glossary:
  - term: "hinge 誤差"
    aliases: ["hinge error", "hinge loss"]
    definition: "err(s, y) = max(1 − ys, 0)。soft-margin SVM 改寫成無限制形式後用的誤差，是 0/1 誤差的凸上界。"
    context: "技法 T5 用它把 SVM 接回正則化模型。"
  - term: "representer theorem"
    aliases: ["表示定理"]
    definition: "任何 L2 正則化線性模型的最佳解 w* 都可以寫成訓練資料轉換後 zₙ 的線性組合 Σ βₙzₙ，因此都能 kernel 化。"
    context: "技法 T5–T6 用它推出 kernel 邏輯迴歸與 kernel ridge regression。"
  - term: "ε-insensitive 誤差"
    aliases: ["epsilon-insensitive error", "tube error", "管狀誤差"]
    definition: "err(y, s) = max(0, |s − y| − ε)：預測落在寬 ε 的管子裡不算錯，超出才按距離計算。"
    context: "技法 T6 用它推出係數稀疏的支援向量迴歸（SVR）。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 11 篇，範圍是[機器學習技法](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 5 講 Kernel Logistic Regression 與第 6 講 Support Vector Regression，也是技法第一段「Embedding Numerous Features: Kernel Models」的收尾。

**本文依據**：MOOC 投影片 [205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf) 與 [206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf)、[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)第 18–25 支、[Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)與它的 [205u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf)、[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)，以及 [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)，全部在 2026-09-30 打開核對。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=Bc8bg5ZkRdk
title: T5-1
```

```youtube
url: https://www.youtube.com/watch?v=5K44AgZvcDk
title: T5-2
```

原始影片：[T5-1](https://www.youtube.com/watch?v=Bc8bg5ZkRdk)、[T5-2](https://www.youtube.com/watch?v=5K44AgZvcDk)、[T5-3](https://www.youtube.com/watch?v=pNfvZYH5iFg)、[T5-4](https://www.youtube.com/watch?v=AbaIkcQUQuo)、[T6-1](https://www.youtube.com/watch?v=5uUob0VX83Y)、[T6-2](https://www.youtube.com/watch?v=rMTD31FFY3g)、[T6-3](https://www.youtube.com/watch?v=0ZIKMdSAJio)、[T6-4](https://www.youtube.com/watch?v=9OBWkHnzr2k)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 先說清楚：這兩講在台大課堂上幾乎不教

兩個學期的課程計畫都沒有完整排進這兩講：

- **Fall 2024**：W11（11/11）上了 `205u`，標題改成「SVM for Soft Binary Classification」。它的 Summary 只列 T5 的前三節，沒有 Kernel Logistic Regression 那一節。T6 沒排。同一週就接著講 blending and bagging。
- **Fall 2026**：W10 講完 kernel 與 soft-margin SVM 後，W11（11/18）直接進入 blending、bagging 與 AdaBoost，T5 和 T6 都沒排。

所以這一篇只能以 MOOC 教材為準。存取等級是 **A2**：投影片與 8 支影片都免費，但沒有專屬的公開作業，只有 Fall 2024 HW6 Q3 碰到相關主題，而且沒有官方解答。對只想跟台大課堂進度的人，這篇可以先跳過；想把 kernel 模型看完整的人，這兩講正是把 SVM 和基石的線性模型重新接起來的地方。

## T5：Kernel 邏輯迴歸

### SVM 是一個正則化模型

T5 的第一節先把前四講收成一張表：hard-margin 與 soft-margin 各有原始與對偶形式，兩個對偶只差 αₙ 有沒有上界 C。投影片也點名實務工具：線性用 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)，非線性用 [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)，而且實務上偏好 soft-margin。

接著換個角度看 ξₙ。對任何 (b, w)，ξₙ 就是違反量：違反時是 1 − yₙ(wᵀzₙ + b)，沒違反時是 0。合起來就是 max(1 − yₙ(wᵀzₙ + b), 0)。代回去，soft-margin SVM 可以寫成沒有限制的形式：

```text
min_{b,w}  ½ wᵀw + C Σₙ max(1 − yₙ(wᵀzₙ + b), 0)
```

林軒田在這裡問「familiar?」：這就是 [L14](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) 的 L2 正則化，只是 w 少了 w₀、參數換了名字、誤差換成特殊的 ê_rr。那為什麼不直接解這個形式？因為它不是 QP，看不出怎麼用 kernel trick，而且 max(·, 0) 不可微分，比較難解。

投影片的對照表：

| 模型 | 最小化 | 限制 |
|---|---|---|
| 以限制做正則化 | E_in | wᵀw ≤ C |
| hard-margin SVM | wᵀw | E_in = 0（而且更多） |
| L2 正則化 | (λ/N)wᵀw + E_in | — |
| soft-margin SVM | ½wᵀw + C N Ê_in | — |

結論有三句：large margin 等於更少的超平面，也等於 L2 正則化讓 w 變短；soft margin 等於換一種誤差；C 越大，對應的 λ 越小，正則化越弱。投影片說，把 SVM 看成正則化模型，就能把它延伸、連接到其他學習模型。

### SVM 與邏輯迴歸

用分數 s = wᵀz + b 與 ys 畫誤差：

- 0/1 誤差：ys ≤ 0 就算錯。
- SVM 的誤差：max(1 − ys, 0)，通常叫 **hinge 誤差**，是 0/1 誤差的凸上界。
- 放縮過的 cross-entropy：log₂(1 + exp(−ys))，邏輯迴歸用的另一個凸上界，見[第 5 篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)。

ys 趨近 −∞ 時，兩者都近似 −ys；趨近 +∞ 時，hinge 等於 0，cross-entropy 趨近 0。所以投影片說：**SVM ≈ L2 正則化邏輯迴歸**。

三種二元分類線性模型的比較：

| | PLA | soft-margin SVM | 正則化邏輯迴歸 |
|---|---|---|---|
| 怎麼解 | 直接最小化 0/1 誤差 | 用 QP 最小化正則化 hinge 誤差 | 用 GD／SGD 最小化正則化 cross-entropy |
| 優點 | 線性可分時很有效率 | 容易最佳化，有理論保證 | 容易最佳化，有正則化保護 |
| 缺點 | 只在線性可分時有用，否則要 pocket | ys 很負時，上界很鬆 | ys 很負時，上界很鬆 |

正則化邏輯迴歸可以近似 SVM。反過來，SVM 能不能近似邏輯迴歸？這是下一節的問題。

### 讓 SVM 輸出機率：Platt 的兩層學習

想要的是 soft binary classification，也就是輸出機率。投影片先列兩個直覺做法：直接把 SVM 分數丟進 θ（簡單，但沒有邏輯迴歸的味道）；或拿 SVM 的解當邏輯迴歸的起點（不比直接跑邏輯迴歸簡單，而且 kernel 的好處沒了）。

折衷是兩層學習：

```text
g(x) = θ(A · (w_SVMᵀΦ(x) + b_SVM) + B)
```

SVM 決定超平面的方向，kernel 照用；邏輯迴歸只學縮放 A 和平移 B，讓結果符合最大概似。w_SVM 夠好時 A 通常大於 0，b_SVM 夠好時 B 通常接近 0。

這就是 **Platt 的機率化 SVM**，三步：

1. 在 D 上跑 SVM，把每個點轉成一維分數 z′ₙ = w_SVMᵀΦ(xₙ) + b_SVM。投影片註明實際的模型做法更複雜。
2. 在 {(z′ₙ, yₙ)} 上跑邏輯迴歸，得到 (A, B)。投影片註明實際的模型會加特殊的正則化。
3. 回傳 g(x) = θ(A · (w_SVMᵀΦ(x) + b_SVM) + B)。

因為有 B，機率化 SVM 的分類邊界不一定和原本的 SVM 相同。只有兩個變數，GD、SGD 或更好的方法都能解。Fall 2024 課程頁在 205u 旁邊列了延伸閱讀 [A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf)（Lin、Weng、Lin），討論的正是「實際的模型」那兩個註解。本文沒有逐頁讀這篇論文。

### Representer theorem 與 kernel 邏輯迴歸

Platt 的做法是在 Z 空間「近似」邏輯迴歸。能不能在 Z 空間做「精確」的邏輯迴歸？

kernel trick 能用，關鍵在於最佳的 w 可以寫成 Σ βₙzₙ，這樣 wᵀz 就能改寫成 Σ βₙK(xₙ, x)。SVM、PLA、用 SGD 解的邏輯迴歸都有這個性質。問題是：什麼時候一定成立？

投影片的 **representer theorem** 說：任何 L2 正則化線性模型

```text
min_w  (λ/N) wᵀw + (1/N) Σₙ err(yₙ, wᵀzₙ)
```

的最佳解都是 w* = Σ βₙzₙ。證明很短：把 w* 拆成 zₙ 張成空間裡的分量 w∥ 與垂直分量 w⊥。w⊥ 和每個 zₙ 內積都是 0，所以誤差不變；但 w⊥ ≠ 0 時 w∥ 的正則化項比較小，比 w* 更好，矛盾。所以**任何 L2 正則化線性模型都能 kernel 化**。

套到 L2 正則化邏輯迴歸，改成直接解 β：

```text
min_β  (λ/N) Σₙ Σₘ βₙβₘ K(xₙ, xₘ) + (1/N) Σₙ log(1 + exp(−yₙ Σₘ βₘ K(xₘ, xₙ)))
```

這是沒有限制的最佳化，用 GD／SGD 就能解。投影片還給了另一個看法：把 (K(x₁, x), …, K(x_N, x)) 當成 N 維的轉換，KLR 就是在這個 N 維空間上的線性模型，正則化項是 βᵀKβ。

最後一個警告：**SVM 的 αₙ 大多是 0，KLR 的 βₙ 通常都不是 0。** 預測時每個訓練點都要算一次 kernel，這個代價在 T6 會再出現。

## T6：支援向量迴歸

### Kernel ridge regression

representer theorem 對迴歸也成立。基石的 ridge regression 用平方誤差，有解析解；kernel 化之後呢？

把 w = Σ βₙzₙ 代進 ridge regression，目標函數變成 (λ/N)βᵀKβ 加上 (1/N)‖y − Kβ‖²。對 β 取梯度並令它為 0，得到一個解析解：

```text
β = (λI + K)⁻¹ y
```

λ > 0 時反矩陣一定存在，因為 K 是半正定的，這正是 [T3](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm) 的 Mercer 條件。用最簡單的稠密矩陣求逆，時間是 O(N³)。

| | 線性 ridge regression | kernel ridge regression |
|---|---|---|
| 解 | w = (λI + XᵀX)⁻¹Xᵀy | β = (λI + K)⁻¹y |
| 彈性 | 較受限 | 靠 K 取得彈性 |
| 訓練 | O(d³ + d²N) | O(N³) |
| 預測 | O(d) | O(N) |
| 適合 | N 遠大於 d 時很有效率 | 大資料時很吃力 |

投影片的結論：線性與 kernel 之間是效率與彈性的取捨。

### LSSVM：稠密的 β 是個問題

把 kernel ridge regression 直接拿來做分類，叫 **least-squares SVM（LSSVM）**。投影片比較 soft-margin Gaussian SVM 與 Gaussian LSSVM：邊界差不多，但 LSSVM 的支援向量多很多，預測變慢，模型也很大。KLR 與 LSSVM 的 β 是稠密的，標準 SVM 的 α 是稀疏的。目標是讓迴歸也有稀疏的係數。

### Tube regression 與 SVR 原始問題

做法是換一個誤差。**tube regression** 在預測值周圍畫一根寬 ε 的管子：落在管子裡不算錯，超出的部分按距離計算。

```text
err(y, s) = max(0, |s − y| − ε)
```

通常叫 **ε-insensitive 誤差**。|s − y| 小的時候它和平方誤差差不多，但比較不受離群值影響。

接下來照抄 SVM 的推導路線。先把 L2 正則化的管狀迴歸寫成 SVM 的樣子：½wᵀw 加上 C 乘以管狀違反量的總和，把 b 拿出來。再把絕對值拆成上下兩條線性限制，分別配上方違反量 ξₙ^∧ 與下方違反量 ξₙ^∨：

```text
min_{b,w,ξ^∨,ξ^∧}  ½ wᵀw + C Σₙ (ξₙ^∨ + ξₙ^∧)
subject to  −ε − ξₙ^∨ ≤ yₙ − wᵀzₙ − b ≤ ε + ξₙ^∧
            ξₙ^∨ ≥ 0, ξₙ^∧ ≥ 0
```

這就是 **SVR** 的原始問題。C 控制正則化與管狀違反的取捨，ε 控制管子的垂直寬度，又多一個參數要選。這是 d̃ + 1 + 2N 個變數、4N 條限制的 QP。

### SVR 對偶與稀疏性

兩條管壁各配一個乘數 αₙ^∧ 與 αₙ^∨。KKT 條件給出 w = Σ (αₙ^∧ − αₙ^∨)zₙ，令 βₙ = αₙ^∧ − αₙ^∨；對 b 偏微分得到 Σ (αₙ^∧ − αₙ^∨) = 0。其餘推導和 T4 相同，得到的對偶是一個和 SVM 對偶很像的 QP，可以用類似的解算器處理，兩組 α 都介於 0 和 C 之間。

稀疏性從互補鬆弛來：一個點如果嚴格落在管子裡，兩個 ξ 都是 0，兩條互補鬆弛的括號都不為 0，所以兩個 α 都是 0，βₙ = 0。**只有在管壁上或管子外的點是支援向量。**

### Kernel 模型總整理

T6 最後一節把技法前六講和基石的線性模型排成一張地圖：

| 列 | 模型 | 投影片的評語 |
|---|---|---|
| 1 | PLA／pocket、線性 SVR | 效果較差，較少用 |
| 2 | 線性 soft-margin SVM、線性 ridge regression、正則化邏輯迴歸 | LIBLINEAR 裡常用 |
| 3 | kernel ridge regression、kernel 邏輯迴歸 | β 稠密，較少用 |
| 4 | SVM、SVR、機率化 SVM | LIBSVM 裡常用 |

可用的 kernel 有多項式、Gaussian，或自己設計的（要滿足 Mercer 條件）。投影片借蜘蛛人的台詞作結：with great power comes great responsibility。kernel 模型很強，但一樣會過擬合。

**怎麼做**：拿一份迴歸資料，用 scikit-learn 的 `KernelRidge` 與 `SVR` 配同一個 RBF kernel 各跑一次。比較兩者的測試誤差，再數 `SVR` 的 `support_` 有幾個元素、`KernelRidge` 的 `dual_coef_` 有幾個不是 0。你會親眼看到 T6 講的稀疏與稠密。

## 影片與投影片對照

| 小節 | 影片 | 投影片 |
|---|---|---|
| Soft-Margin SVM as Regularized Model | [T5-1](https://www.youtube.com/watch?v=Bc8bg5ZkRdk) | 205 |
| SVM versus Logistic Regression | [T5-2](https://www.youtube.com/watch?v=5K44AgZvcDk) | 205 |
| SVM for Soft Binary Classification | [T5-3](https://www.youtube.com/watch?v=pNfvZYH5iFg) | 205 |
| Kernel Logistic Regression | [T5-4](https://www.youtube.com/watch?v=AbaIkcQUQuo) | 205 |
| Kernel Ridge Regression | [T6-1](https://www.youtube.com/watch?v=5uUob0VX83Y) | 206 |
| Support Vector Regression Primal | [T6-2](https://www.youtube.com/watch?v=rMTD31FFY3g) | 206 |
| Support Vector Regression Dual | [T6-3](https://www.youtube.com/watch?v=0ZIKMdSAJio) | 206 |
| Summary of Kernel Models | [T6-4](https://www.youtube.com/watch?v=9OBWkHnzr2k) | 206 |

## 練習：Fall 2024 HW6 Q3

[HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止）的 Q3 是自動批改的選擇題：把 soft-margin SVM 的違反量懲罰從 Σ ξₙ 改成 Σ ξₙ²（squared hinge），題目給出它的對偶問題，問解出 α* 後怎麼算回最佳的 ξ*。

這題練的是 T4 的對偶推導，也練 T5 的核心觀點：ξₙ 就是誤差，換掉懲罰方式就是換掉誤差函數。建議先自己從拉格朗日函數推一次對偶，確認和題目給的形式相同，再回答 ξ* 的問題。沒有官方解答；可以用小資料集和通用 QP 套件（例如 CVXPY）分別解原始與對偶問題，驗證你的 ξ* 公式。

HW6 其他題目的對照見[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)，整份作業的做法見[技法作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

## 延伸閱讀

- 站內 [CS229 2026 講義第 5 章：kernel 方法](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods)：kernel 化的另一種推導。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：同一本教科書的英文課。

系列導覽：上一篇 [Kernel 技巧與軟邊界 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)｜下一篇 [Blending、Bagging 與 AdaBoost](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 16 講大綱與投影片
- [技法 Lecture 5：Kernel Logistic Regression（205_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf)
- [技法 Lecture 6：Support Vector Regression（206_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf)
- [基石 Lecture 14：Regularization（14_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Lecture 5：SVM for Soft Binary Classification（205u_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Lin, Weng, Lin：A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf)
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)
