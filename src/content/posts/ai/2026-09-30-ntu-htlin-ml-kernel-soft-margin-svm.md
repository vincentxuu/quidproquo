---
title: "林軒田機器學習技法 T3–T4：Kernel 技巧與軟邊界 SVM——無限維的分類器怎麼算、怎麼防過擬合"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 10
tldr: "技法第 3 講把「特徵轉換＋內積」合成一個 kernel 函數 K(x, x′)，對偶 SVM 的訓練與預測都只要算 K，於是 d̃ 可以是無限大：Gaussian kernel 就對應一個無限維的轉換。第 4 講承認 SVM 仍會過擬合，引入違反量 ξₙ 與參數 C，得到 soft-margin SVM；它的對偶和 hard-margin 只差一件事：αₙ 多了上界 C。αₙ 的值把資料分成非支援向量、free SV 與 bounded SV 三類，而支援向量的比例 #SV/N 是 leave-one-out 誤差的上界，可以拿來快速排除危險的 (C, γ)。"
description: "台大林軒田《機器學習技法》Lecture 3 Kernel SVM 與 Lecture 4 Soft-Margin SVM 導讀：kernel trick 怎麼把 O(d̃) 內積降到 O(d)、多項式 kernel 的 (γ, ζ, Q)、Gaussian kernel 對應的無限維轉換、三種 kernel 的優缺點與 Mercer 條件；soft-margin 原始問題、對偶問題、用 free SV 算 b、αₙ 的物理意義、cross validation 與 #SV 做模型選擇，附 Fall 2024 HW6 對應題。"
draft: false
glossary:
  - term: "kernel trick"
    aliases: ["核技巧", "kernel 技巧"]
    definition: "把特徵轉換 Φ 與內積合成一個函數 K(x, x′) = Φ(x)ᵀΦ(x′)，直接算 K 而不真的把 x 轉到高維，讓只用到內積的演算法（例如對偶 SVM）擺脫轉換後的維度 d̃。"
    context: "技法 T3 的主題。"
  - term: "Mercer 條件"
    aliases: ["Mercer's condition"]
    definition: "一個函數要成為合法 kernel 的充要條件：對稱，而且任意一組資料算出來的 kernel 矩陣都是半正定。"
    context: "T3 用它說明「任意相似度」不一定是合法 kernel。"
  - term: "bounded SV"
    aliases: ["bounded support vector", "有界支援向量"]
    definition: "soft-margin SVM 中 αₙ = C 的支援向量，ξₙ 等於它違反胖邊界的量；相對地，0 < αₙ < C 的叫 free SV，一定剛好落在胖邊界上。"
    context: "T4 用 αₙ 的值把訓練點分成三類。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 10 篇，範圍是[機器學習技法](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 3 講 Kernel Support Vector Machine 與第 4 講 Soft-Margin Support Vector Machine。

**本文依據**：MOOC 投影片 [203_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf) 與 [204_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf)、[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)第 10–17 支、[Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 與 [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 課程頁，以及 [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)，全部在 2026-09-30 打開核對。教科書對應 [LFD](http://amlbook.com) e-8.3（kernel）與 e-8.4（soft margin），這是兩份課程頁標的章節，本文沒有打開章節本身。

存取等級：MOOC 教材是 **A2**；加上 Fall 2024 HW6 題目 PDF 與公開的 [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) 和 MNIST 資料，這兩講可以到 **A3（評分鏈除外）**：沒有官方解答，Gradescope 批改只限修課生。

## 上一篇停在哪

[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)把 hard-margin SVM 換成對偶問題：N 個變數、N + 1 條限制，看起來和轉換後的維度 d̃ 無關。但對偶的二次項係數 q_{n,m} = yₙyₘzₙᵀzₘ 仍是 d̃ 維的內積，直接算要 O(d̃)。T3 解決這個問題，T4 解決另一個問題：就算邊界夠胖，hard-margin SVM 還是會過擬合。

## T3：Kernel SVM

### 轉換加內積，可以一起算

投影片先拿二次多項式轉換 Φ₂(x) 示範。為了簡單，它同時放了 x₁x₂ 與 x₂x₁ 兩項。展開 Φ₂(x)ᵀΦ₂(x′) 後，可以整理成：

```text
Φ₂(x)ᵀΦ₂(x′) = 1 + xᵀx′ + (xᵀx′)²
```

右邊只需要一次 d 維內積，O(d) 就能算完，不必先展開成 O(d²) 維再做內積。這個「轉換＋內積」的捷徑就叫 **kernel function**，寫成 K_Φ(x, x′) ≡ Φ(x)ᵀΦ(x′)。

對偶 SVM 裡所有用到 z 的地方都能換成 K：

- 二次項係數：q_{n,m} = yₙyₘK(xₙ, xₘ)
- 截距：用任一個支援向量 (x_s, y_s)，b = y_s − Σ αₙyₙK(xₙ, x_s)
- 預測：g_SVM(x) = sign(Σ αₙyₙK(xₙ, x) + b)

投影片的 Kernel Hard-Margin SVM 演算法有四步。建 Q 矩陣要 O(N²) 次 kernel 計算，解一個 N 變數的 QP，算 b 與預測都只要 O(#SV) 次 kernel 計算。訓練與預測都不必碰到 w 本身，也就是說完全不依賴 d̃。

### 多項式 kernel

同樣是二次轉換，只要在各項前面乘上不同的係數，就得到不同的 kernel。投影片整理成一般形式：

```text
K_Q(x, x′) = (ζ + γ xᵀx′)^Q,  γ > 0, ζ ≥ 0
```

這幾種二次 kernel 的表達力相同，但內積定義不同，幾何就不同，margin 的意義也跟著變。投影片放了 γ = 0.001、1、1000 三張圖：分隔線不同，支援向量也不同，事前很難說哪個比較好。**換 kernel 就是換 margin 的定義**，所以選 kernel 和選 Φ 一樣，都是模型選擇的問題。

Q = 1、ζ = 0、γ = 1 時就是一般內積，叫 **linear kernel**。林軒田照例提醒：linear first。線性問題常常可以直接在原始形式上有效率地解。

### Gaussian kernel：無限維的轉換

既然只要 K 算得出來，Φ 能不能是無限維？投影片用一維的 K(x, x′) = exp(−(x − x′)²) 示範：拆成三個指數相乘，再把 exp(2xx′) 用泰勒展開，就能寫成兩個無限維向量的內積。一般形式是：

```text
K(x, x′) = exp(−γ‖x − x′‖²),  γ > 0
```

這就是 **Gaussian kernel**，也叫 RBF kernel。代進 g_SVM 後，預測函數是一群以支援向量為中心的高斯函數的線性組合。投影片的說法是：在無限維空間做線性分類，泛化則由 large margin 把關。

但 γ 大時高斯很尖，投影片的三張圖（γ = 1、10、100）裡，γ = 100 的邊界已經緊緊包住每個點。投影片下方寫著：**warning: SVM can still overfit :-(**。

### 三種 kernel 的取捨

| kernel | 缺點 | 優點 |
|---|---|---|
| linear | 受限，資料不一定可分 | 安全、快（可用原始形式的專用解算器）、w 與支援向量可以解釋 |
| polynomial | Q 大時數值困難（底數小於 1 趨近 0，大於 1 爆大）；三個參數 (γ, ζ, Q) 難選 | 比 linear 有彈性；Q 直接控制次數 |
| Gaussian | 沒有 w 可以看；比 linear 慢；可能太強 | 表達力最強；值有界，數值上比 polynomial 穩；只有一個參數 |

投影片的結論是：效率選 linear，表達力選 Gaussian，polynomial 大概只用小 Q。

### 自己設計 kernel

kernel 代表一種特殊的相似度，但不是任何相似度都能當 kernel。充要條件是 **Mercer 條件**：K 對稱，而且任意一組資料算出來的矩陣 K（元素 kᵢⱼ = K(xᵢ, xⱼ)）一定半正定，因為它可以寫成 ZZᵀ。投影片的評語是：自訂 kernel 做得到，但很難。

**怎麼做**：做投影片最後一題 Fun Time，用 x₁ = (1)、x₂ = (−1) 兩個點把四個候選 kernel 的 2×2 矩陣寫出來，看哪一個不是半正定。這是檢查自訂 kernel 最便宜的方法。

## T4：Soft-Margin SVM

### Hard-margin 的問題

SVM 會過擬合，一部分原因是 Φ 太強，另一部分是它堅持資料必須完全分開。堅持可分就等於要求能 shatter，於是有能力去擬合雜訊。

投影片的出發點是把兩個舊方法合起來。pocket 演算法容許犯錯，最小化錯誤數；hard-margin SVM 要最大 margin，但一個錯都不准犯。合起來就是：最小化 ½wᵀw 加上 C 乘以錯誤數，分對的點照舊要滿足 margin 限制，分錯的點不管。**C 控制 large margin 與容忍雜訊之間的取捨。**

但這個版本有兩個問題：錯誤數是非線性的，不再是 QP；而且它分不出「只差一點」和「錯得離譜」。改用**違反量** ξₙ 來記錄每個點超出胖邊界多少，懲罰違反量的總和，而不是錯誤的個數：

```text
min_{b,w,ξ}  ½ wᵀw + C Σₙ ξₙ
subject to   yₙ(wᵀzₙ + b) ≥ 1 − ξₙ,  ξₙ ≥ 0
```

C 大表示不太能容忍違反，C 小表示寧可要胖一點的邊界。這是 d̃ + 1 + N 個變數、2N 條限制的 QP。

### 對偶：αₙ 多了上界 C

推導和 T2 幾乎一樣。這次有兩組乘數：αₙ 配 margin 限制，βₙ 配 ξₙ ≥ 0。對 ξₙ 偏微分得到 C − αₙ − βₙ = 0，於是 βₙ 可以用 C − αₙ 取代，同時得到 0 ≤ αₙ ≤ C；ξₙ 也隨之消掉。剩下的內層問題和 hard-margin 一模一樣。結果是：

```text
min_α  ½ Σₙ Σₘ αₙαₘ yₙyₘ K(xₙ, xₘ) − Σₙ αₙ
subject to  Σₙ yₙαₙ = 0;  0 ≤ αₙ ≤ C
```

和 hard-margin 唯一的差別是 αₙ 多了上界 C。N 個變數、2N + 1 條限制。

### 怎麼算 b

hard-margin 時任一個支援向量都能算 b。soft-margin 有兩條互補鬆弛：

- αₙ(1 − ξₙ − yₙ(wᵀzₙ + b)) = 0
- (C − αₙ)ξₙ = 0

所以要找 **free SV**（0 < α_s < C）：第二條讓它的 ξ_s = 0，第一條再給出 b = y_s − Σ αₙyₙK(xₙ, x_s)。如果一個 free SV 都沒有，b 只能確定在某個範圍內。Fall 2024 HW6 Q2 就是在考這個「沒有 free SV」的情形。

### αₙ 的物理意義

同樣兩條互補鬆弛把每個訓練點分成三類：

| 類別 | αₙ | ξₙ | 位置 |
|---|---|---|---|
| 非支援向量 | 0 | 0 | 在胖邊界外側或剛好在邊界上 |
| free SV | 0 < αₙ < C | 0 | 剛好在胖邊界上，用來算 b |
| bounded SV | C | 違反量 | 違反胖邊界，或剛好在邊界上 |

投影片說 αₙ 可以拿來做資料分析：bounded SV 是可能分錯或靠得太近的點。ξₙ ≥ 1 才會造成 0/1 錯誤，所以 bounded SV 的比例是 E_in 的上界。

### 模型選擇

Gaussian soft-margin SVM 至少有 (C, γ) 兩個參數，投影片三張圖（C = 1、10、100）顯示 C 大也會過擬合。怎麼選？答案是基石 L15 的 validation，見[第 8 篇](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)。

- **Cross validation**：E_cv(C, γ) 對參數不平滑，難以直接最佳化，實務上在幾個格點上跑 V-fold CV。這是最常用的準則。
- **#SV 當上界**：投影片宣稱 E_loocv ≤ #SV / N。理由是：拿掉一個非支援向量後，剩下的 α 仍是最佳解，所以留一模型和原模型相同，那個點的誤差是 0；支援向量的留一誤差最多是 1。這只是上界，但計算便宜，可以用來排除危險的參數組合。投影片的建議是：CV 太花時間時，用 #SV 當安全檢查。

**怎麼做**：用 LIBSVM 或 scikit-learn 的 `SVC` 在任一份二元分類資料上跑 3×3 的 (C, γ) 格點，同時記下 5-fold CV 誤差與 #SV/N。看 #SV/N 最大的格點，CV 誤差是不是也偏高。

## 影片與投影片對照

| 小節 | 影片 | 投影片 |
|---|---|---|
| Kernel Trick | [T3-1](https://www.youtube.com/watch?v=oOi7kqUTqxw) | 203 |
| Polynomial Kernel | [T3-2](https://www.youtube.com/watch?v=Fb-WSBvsPak) | 203 |
| Gaussian Kernel | [T3-3](https://www.youtube.com/watch?v=_-fIkbSBdF8) | 203 |
| Comparison of Kernels | [T3-4](https://www.youtube.com/watch?v=sacJmcs8TKE) | 203 |
| Motivation and Primal | [T4-1](https://www.youtube.com/watch?v=K7ZcAYXuU_A) | 204 |
| Dual Problem | [T4-2](https://www.youtube.com/watch?v=fTHTqW5Uq4U) | 204 |
| Messages | [T4-3](https://www.youtube.com/watch?v=5z7ujI3YBBE) | 204 |
| Model Selection | [T4-4](https://www.youtube.com/watch?v=ahogAa5Rnmc) | 204 |

## 兩個學期怎麼排

- **Fall 2024**：W10（11/04）同一週講 kernel SVM 與 soft-margin SVM，投影片是 `203u`、`204u`。
- **Fall 2026**：排在 W10（11/11），課程頁標 LFD e-8.3、e-8.4。`203u_handout.pdf` 連結在 2026-09-30 打開是 404，本文只用 MOOC 版。

## 練習：Fall 2024 HW6

[HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) 在 2024-11-18 發布、12-02 截止，12 題加 1 題 bonus，Q1–4 自動批改，其餘由助教批改。和本篇相關的題目：

| 題 | 主題 | 對應 |
|---|---|---|
| Q1 | 把 kernel trick 套到 PLA：維護 α 而不是 w | T3 kernel trick、T2 的「w 由資料表示」 |
| Q2 | 所有點都是 bounded SV 時，最小的 b* 是多少 | T4 算 b |
| Q5 | 把常數 1 補進 xₙ 再解 soft-margin SVM，解是否不變 | T1 把 b 拿出來、T4 原始與對偶 |
| Q6 | 用原點當錨點的 one-class SVM，推對偶問題 | T4 對偶推導 |
| Q7 | γ 夠大時，Gaussian kernel 的 ĥ 可讓 E_in = 0 | T3 Gaussian kernel |
| Q8 | 證明 exp(2cos(x − x′) − 2) 是合法 kernel | T3 Mercer 條件與 Gaussian kernel |
| Q10 | MNIST 3 對 7，多項式 kernel，C ∈ {0.1, 1, 10}、Q ∈ {2, 3, 4} 的 #SV | T3 多項式 kernel、T4 |
| Q11 | 同資料，Gaussian kernel，C 與 γ 各取 {0.1, 1, 10}，算 margin 1/‖w‖ | T3、T4 |
| Q12 | 固定 C = 1，隨機抽 200 筆當 validation 選 γ，重複 128 次畫頻率圖 | T4 模型選擇 |

程式題的資料是 LIBSVM 網站上的 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)，題目建議用 LIBSVM，並提醒兩件事：不要讓套件自動縮放資料，否則等於換了 kernel；以及要自己確認套件解的是課堂上的對偶形式，數值精度也夠。

沒有官方解答。Q10–Q12 可以用兩個不同的套件（例如 LIBSVM 與 scikit-learn 的 `SVC`，後者底層也是 LIBSVM）交叉比對 #SV 與 margin，數字對得上再寫結論。

## 延伸閱讀

- 站內 [CS229 2026 講義第 5 章：kernel 方法](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods)與[第 6 章：支援向量機](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines)：同一組概念在 Stanford 講義裡的寫法。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：同一本教科書的英文課。

系列導覽：上一篇 [線性 SVM 與對偶 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)｜下一篇 [Kernel 邏輯迴歸與支援向量迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 16 講大綱與投影片
- [技法 Lecture 3：Kernel Support Vector Machine（203_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf)
- [技法 Lecture 4：Soft-Margin Support Vector Machine（204_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf)
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [LIBSVM Data：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)
- [Learning from Data 教科書網站](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
