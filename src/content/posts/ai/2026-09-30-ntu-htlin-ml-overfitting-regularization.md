---
title: "林軒田機器學習基石 L13–L14：過擬合與正則化"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, regularization, learning-theory]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 7
tldr: "基石 L13 把過擬合定義成「E_in 更低、E_out 卻更高」，並用實驗找出四個成因：資料太少、隨機雜訊、目標函數太複雜（deterministic noise），以及模型太強。L14 的對策是正則化：把「退回 H₂」改寫成 ‖w‖² ≤ C 的限制，再用拉格朗日乘數變成最小化 E_in + (λ/N)wᵀw，這就是 weight decay。接回 VC 理論時，正則化讓有效 VC 維度 d_EFF 變小；L1 則換來稀疏解。練習題在 Fall 2024 HW4 Q8–9 與 HW5 Q1、Q5–6、Q10。"
description: "台大林軒田《機器學習基石》第 13–14 講導讀：過擬合與欠擬合的定義、2 次與 10 次多項式學習者的對比實驗、stochastic noise 與 deterministic noise、資料清理與 virtual examples；正則化假說集合、weight decay 與 augmented error、Legendre 多項式、正則化與有效 VC 維度、L1 與 L2 的差異與 λ 的選擇，對照 LFD 4.0–4.2 與 Fall 2024 HW4、HW5。"
draft: false
glossary:
  - term: "deterministic noise"
    aliases: ["確定性雜訊"]
    definition: "目標函數 f 不在假說集合 H 裡時，H 中最好的假說 h* 與 f 之間的差距。它對學習的影響像隨機雜訊，但取決於 H，而且在同一個 x 上是固定的。"
    context: "林軒田基石 L13 用它解釋「沒有雜訊也會過擬合」。"
  - term: "augmented error"
    aliases: ["E_aug", "增廣誤差"]
    definition: "E_aug(w) = E_in(w) + (λ/N)Ω(w)。最小化這個無限制的目標，等效於在某個 C 的限制下最小化 E_in。"
    context: "林軒田基石 L14 把 weight decay 寫成最小化 augmented error。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en)

> **版本說明**：本文以[機器學習基石 MOOC](https://www.csie.ntu.edu.tw/~htlin/mooc/) 的 Lecture 13 與 Lecture 14 投影片（[13_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf)、[14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)）與 [YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)第 50–57 支為準；練習題取自 [Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 的 [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/) 與 [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/)。全部在 2026-09-30 打開核對。存取等級：MOOC 本身 **A2**，加上 Fall 2024 作業 **A3（評分鏈除外）**，沒有官方解答。

**系列位置**：上一篇 [線性分類模型、SGD、多類別與非線性轉換](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)｜下一篇 [驗證與三個學習原則](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)的非線性轉換給了線性模型很大的力量，L12 的摘要把下一講預告成「the dark side of the force」。從 L13 開始，基石進入最後一段「How Can Machines Learn Better?」，先問力量用過頭會怎樣，再給第一個對策。

讀完這篇，你應該能說出過擬合的四個成因、deterministic noise 跟一般雜訊差在哪裡、weight decay 的目標函數是怎麼從一個限制式推出來的，以及正則化在 VC 理論裡對應到什麼。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=BA76U3JBDdE
title: What is Overfitting?
```

```youtube
url: https://www.youtube.com/watch?v=6bfcLhHhgs0
title: The Role of Noise and Data Size
```

原始影片：[What is Overfitting?](https://www.youtube.com/watch?v=BA76U3JBDdE)、[The Role of Noise and Data Size](https://www.youtube.com/watch?v=6bfcLhHhgs0)、[Deterministic Noise](https://www.youtube.com/watch?v=c_208kUQEis)、[Dealing with Overfitting](https://www.youtube.com/watch?v=r3bX1k7tcjc)、[Regularized Hypothesis Set](https://www.youtube.com/watch?v=Sno7I5slFUA)、[Weight Decay Regularization](https://www.youtube.com/watch?v=idWnPdW9znM)、[Regularization and VC Theory](https://www.youtube.com/watch?v=15JB2o4VUeY)、[General Regularizers](https://www.youtube.com/watch?v=PeQeKeeGu3A)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 課程與教材對照

| 講次 | YouTube 小節（播放清單序號） | 投影片 | LFD 章節 |
|---|---|---|---|
| L13 Hazard of Overfitting | [What is Overfitting?](https://www.youtube.com/watch?v=BA76U3JBDdE)（50）、[The Role of Noise and Data Size](https://www.youtube.com/watch?v=6bfcLhHhgs0)（51）、[Deterministic Noise](https://www.youtube.com/watch?v=c_208kUQEis)（52）、[Dealing with Overfitting](https://www.youtube.com/watch?v=r3bX1k7tcjc)（53） | [13_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf) | 4.0、4.1 |
| L14 Regularization | [Regularized Hypothesis Set](https://www.youtube.com/watch?v=Sno7I5slFUA)（54）、[Weight Decay Regularization](https://www.youtube.com/watch?v=idWnPdW9znM)（55）、[Regularization and VC Theory](https://www.youtube.com/watch?v=15JB2o4VUeY)（56）、[General Regularizers](https://www.youtube.com/watch?v=PeQeKeeGu3A)（57） | [14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) | 4.2 |

LFD 章節照 Fall 2024 與 Fall 2026 課程頁的標註。Fall 2024 在 W7（10/14）上這兩講，課程頁連到 [13u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/13u_handout.pdf) 與 [14u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/14u_handout.pdf)。[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 排在 W7（10/21），今天這兩份投影片的連結還是 404。

## L13：過擬合從哪裡來

### 壞的泛化與過擬合不是同一件事

投影片開頭的例子很小：目標是 2 次多項式，取 N = 5 筆、加上很小的雜訊，用 4 次多項式轉換後跑線性迴歸。唯一解會穿過全部 5 個點，E_in = 0，E_out 卻很大。

投影片把兩個詞分開定義：

- **壞的泛化（bad generalization）**：E_in 低、E_out 高，指的是某一個 g 的狀態。
- **過擬合（overfitting）**：把 d_vc 從最佳點 d*_vc 往上推時，E_in 下降、E_out 反而上升，指的是換模型的過程。
- **欠擬合（underfitting）**：往下推到 d_vc = 1 時，E_in 和 E_out 一起上升。

投影片用開車比喻成因：用太大的 d_vc 是開太快，雜訊是路面顛簸，資料量少是對路況的觀察有限，結果就是車禍。

### 兩個學習者的反諷

第二節做了兩組實驗。一組的目標是 10 次多項式加雜訊，另一組是 50 次多項式、完全沒有雜訊。兩位學習者各自選：O 選 H₁₀ 中最好的 g₁₀，R 選 H₂ 中最好的 g₂。

| 目標 | g₂ 的 E_in／E_out | g₁₀ 的 E_in／E_out |
|---|---|---|
| 10 次＋雜訊 | 0.050／0.127 | 0.034／9.00 |
| 50 次、無雜訊 | 0.029／0.120 | 0.00001／7680 |

兩組都過擬合了。第一組的反諷是：就算兩人都知道目標是 10 次，R 放棄了擬合能力，E_out 反而大勝。投影片用學習曲線解釋：N → ∞ 時 H₁₀ 的 E_out 比較低，但 N 小的時候泛化誤差大得多，R 一定贏。

第二組更有意思：明明沒有雜訊，R 還是贏。投影片的回答是：目標函數的複雜度本身就像雜訊。

### Deterministic noise

第三節把這個觀察做成實驗。資料是 y = f(x) + ε，f 是 Q_f 次多項式，ε 是變異數 σ² 的高斯雜訊。過擬合程度定義成 E_out(g₁₀) − E_out(g₂)。兩張熱圖分別固定 Q_f = 20 看 σ² 對 N 的影響、固定 σ² = 0.1 看 Q_f 對 N 的影響，形狀幾乎一樣。

投影片據此列出四個嚴重過擬合的成因：

1. 資料量 N 減少
2. 隨機雜訊（stochastic noise）增加
3. 確定性雜訊（deterministic noise）增加，也就是目標太複雜
4. 模型能力過剩

deterministic noise 的定義是：f 不在 H 裡時，H 中最好的 h* 和 f 之間的差距。它的作用像隨機雜訊，投影片拿電腦科學裡的虛擬亂數產生器類比。差別有兩點：它取決於 H，而且在同一個 x 上是固定的。投影片附了一句教育哲學：教小孩的時候，也許別拿太複雜的例子。

### 對付過擬合的幾種辦法

最後一節回到開車比喻，把對策一一對上：

| 開車 | 學習 |
|---|---|
| 開慢一點 | 從簡單模型開始 |
| 用更準確的路況 | 資料清理／修剪 |
| 利用更多路況資訊 | data hinting |
| 踩煞車 | 正則化（L14） |
| 看儀表板 | 驗證（L15） |

資料清理是把疑似標錯的點改標，修剪是直接刪掉，投影片說「可能有幫助，但效果不一」。data hinting 是用平移、旋轉手寫數字等方式產生 virtual examples，投影片提醒這些例子並不是從 P(x, y) 獨立同分布抽出來的。

## L14：正則化，把「退回去」寫成數學

### 從硬限制到軟限制

L14 從一個問題開始：怎麼從 H₁₀「退回」H₂？對 Q 次多項式轉換加線性迴歸來說，H₂ 就是 H₁₀ 加上 w₃ = … = w₁₀ = 0 的限制。

接下來把限制一步步放鬆：

1. **H₂**：w₃ 到 w₁₀ 全為 0。
2. **H₂′**：至少 8 個 w_q 為 0，即 Σ⟦w_q ≠ 0⟧ ≤ 3。比 H₂ 有彈性、比 H₁₀ 安全，但這是稀疏假說集合，解它是 NP-hard。
3. **H(C)**：Σ w_q² ≤ C。和 H₂′ 有重疊但不完全相同，而且隨 C 形成平滑的巢狀結構：H(0) ⊂ H(1.126) ⊂ … ⊂ H(∞) = H₁₀。

在 H(C) 裡找到的最佳解叫 w_REG。

### Weight decay 與 augmented error

限制式 wᵀw ≤ C 的幾何意義是：w 必須落在半徑 √C 的球裡。投影片用梯度的方向論證：在最佳解 w_REG 上，如果 −∇E_in 跟球面法向量 w 不平行，就還能沿著球面讓 E_in 再降。所以最佳解必須滿足 −∇E_in(w_REG) ∝ w_REG，也就是存在 λ > 0，使得

∇E_in(w_REG) + (2λ/N)·w_REG = 0

解這個式子，等價於最小化一個沒有限制的目標：

E_aug(w) = E_in(w) + (λ/N)·wᵀw

這就是 augmented error。給定 λ 最小化 E_aug，效果等同於在某個 C 下做有限制的最小化。投影片把 + (λ/N)wᵀw 稱為 weight-decay regularization：λ 越大，越偏好短的 w，等效的 C 也越小。

第 11 頁的四張圖是這一講最好記的畫面：λ = 0 過擬合，λ = 0.0001 已經好很多，λ = 0.01 接近目標，λ = 1 反而欠擬合。投影片的註解是「a little regularization goes a long way」。

一個實作細節：x ∈ [−1, 1] 時，x^q 在 q 大的時候非常小，需要很大的 w_q 才撐得起來，weight decay 會不公平地壓它。投影片的建議是改用正交的 Legendre 多項式當轉換。

### 正則化與 VC 理論

第三節把正則化接回基石第二段。兩件事並排：

- 有限制地最小化 E_in，有 VC 保證：E_out(w) ≤ E_in(w) + Ω(H(C))。
- 最小化 E_aug 等效於某個 C 的限制最小化，所以間接得到這個保證，又不必真的被關在 H(C) 裡。

另一個角度是把 E_aug 和 VC bound 放在一起看。E_aug = E_in + (λ/N)Ω(w)，其中 Ω(w) 是「單一假說」的複雜度；VC bound 裡的 Ω(H) 是「整個假說集合」的複雜度。如果前者能好好代表後者，E_aug 就是比 E_in 更好的 E_out 代理。

投影片由此定義**有效 VC 維度** d_EFF(H, A)。d_vc(H) = d̃ + 1 很大，因為最小化時所有 w 都「被考慮過」；但真正用得到的只有某個 H(C)。演算法 A 有做正則化時，d_EFF 就小。這一節的 Fun Time 直接問：λ 變大時 d_EFF 怎麼變？答案是變小。

### 一般的正則化項

最後一節把 Ω(w) 的選法整理成三類，並指出它跟 [L8](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error) 選誤差衡量時的三類是同一套邏輯：

- **target-dependent**：如果知道目標的性質就用上，例如偏好偶函數時用只懲罰奇數次項的 symmetry regularizer。
- **plausible**：往更平滑、更簡單的方向，因為兩種雜訊都不平滑。L1（sparsity）屬於這類。
- **friendly**：好最佳化。L2（weight decay）屬於這類。

選錯了也不必太擔心，λ 可以把它壓住。

L1 與 L2 的對比在第 19 頁：

| | L2：Σ w_q² | L1：Σ \|w_q\| |
|---|---|---|
| 凸性 | 凸 | 凸 |
| 可微 | 處處可微 | 不是處處可微 |
| 好處 | 好最佳化 | 解是稀疏的 |

投影片的結論是「需要稀疏解時 L1 有用」。

至於 λ 怎麼選，第 20 頁兩張圖顯示：雜訊越多，需要的正則化越強，隨機雜訊和確定性雜訊都一樣。但雜訊的大小事先不知道，所以要靠下一講的驗證來選。

## Fall 2024 作業裡練得到的題目

[HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)（2024-10-21 發布、11/04 截止）與 [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)（11/04 發布、11/18 截止）都是 12 題加 1 題 bonus，Q1–4 自動批改、Q5–12 由助教批改。跟本篇相關的題目：

| 作業 | 題號 | 內容 | 對應 |
|---|---|---|---|
| HW4 | Q8 | 目標 f(x) = 1 − 2x²、用直線 h(x) = w₀ + w₁x 去近似，只取兩筆資料做線性迴歸，求 E_D(\|E_in(g) − E_out(g)\|) | L13：f 不在 H 裡的情形 |
| HW4 | Q9 | 題目明寫「In Lecture 13」：對輸入加高斯雜訊產生 virtual examples，推導 E(X_hᵀX_h) 的形式；題目附註點出這和正則化線性迴歸要反轉的矩陣有關 | L13 data hinting → L14 |
| HW5 | Q1 | 把 additive smoothing 寫成帶 regularizer 的估計問題，找出 Ω(w₀) | L14 一般正則化項 |
| HW5 | Q5 | 證明加入特定 virtual examples 的線性迴歸，和加權 L2 正則化有相同解 | L13–L14 |
| HW5 | Q6 | 在 E_in 的二階泰勒近似下，求 L2 正則化解與 λ、N、Hessian、w* 的關係 | L14 weight decay |
| HW5 | Q10 | 用 LIBLINEAR（`-s 6`）在 mnist.scale 的 2 對 6 子問題上跑 L1 正則化邏輯迴歸，λ 依 E_in 選，重複 1126 次，畫 E_out 與非零權重數的直方圖 | L14 L1 與稀疏性；也回扣 L11 的 OVO |
| HW5 | Q13（bonus） | elastic net 的 coordinate descent 閉式更新 | L14 L1＋L2 |

資料集 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) 與工具 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 都是公開的。HW5 Q10 要你自己讀 README，找出 LIBLINEAR 的參數 C 跟課堂上的 λ 怎麼換算，這一步本身就是練習。

HW5 Q10 刻意用 E_in 選 λ，接下來的 Q11、Q12 改用驗證集和 3-fold CV 選，要你比較三者的 E_out 分布。這兩題放在[下一篇](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)。

沒有官方解答時可以這樣自我驗收：Q10 裡，λ 依 E_in 選時，通常會落在候選中偏小的 λ，因為正則化越弱、E_in 越容易做低；如果你的結果一面倒地選最大的 λ，先檢查 C 與 λ 的換算方向。

## 自學怎麼做

1. 看第 51 支影片前，先自己猜兩組實驗誰贏，再對照上面那張表。
2. 看第 52 支時，把四個過擬合成因抄下來，每個成因配一個你工作上見過的例子。
3. 看第 55 支時，自己從 wᵀw ≤ C 推一次到 E_aug，重點是「梯度與法向量平行」那一步。
4. 做 HW5 Q10，親手看到 L1 讓權重變稀疏。

今晚可以做的一件事：拿你手上任何一個線性模型，把 L2 係數從 0 開始每次乘 100 往上掃，把訓練誤差與驗證誤差畫在同一張圖，看看投影片第 11 頁的四張圖會不會在你的資料上重現。

## 延伸閱讀

- 同一主題的其他講法：[CS229 講義第 9 章：正規化與模型選擇](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection)、[Ridge、Lasso、weight decay 為什麼能讓模型穩一點？](/posts/learning/2026-08-29-im-stat-regularization)
- 深度學習裡的正則化：[MIT 6.7960：Regularization](/posts/tech/2026-09-17-mit-67960-regularization)
- 技法篇會從正則化的角度重新看 SVM：[Kernel 邏輯迴歸與支援向量迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)
- 作業總覽：[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [機器學習基石／技法 MOOC 頁](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 各講小節標題與投影片下載
- [Lecture 13: Hazard of Overfitting（handout）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf) — 定義、兩個學習者的實驗數字、四個成因、deterministic noise、資料清理與 hinting
- [Lecture 14: Regularization（handout）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) — H(C)、拉格朗日推導、augmented error、Legendre 多項式、d_EFF、L1／L2、λ 與雜訊
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) — 第 50–57 支
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W7 排程與 LFD 章節
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) — Q8–9
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) — Q1、Q5–6、Q10、Q13
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W7（10/21）排程
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 與 [LIBSVM datasets：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) — HW5 程式題工具與資料
- [Learning from Data（AMLbook）](http://amlbook.com) — 教科書 4.0–4.2 節
