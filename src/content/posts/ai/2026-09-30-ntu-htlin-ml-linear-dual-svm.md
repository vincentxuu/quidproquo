---
title: "林軒田機器學習技法 T1–T2：線性 SVM 與對偶 SVM——最胖的分隔線、QP 與 KKT"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, optimization]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 9
tldr: "技法第 1 講把「哪條分隔線最好」寫成最佳化問題：在 min yₙ(wᵀxₙ+b)=1 的縮放下，最大 margin 等於最小化 ½wᵀw，這是一個標準 QP。第 2 講用拉格朗日對偶把 d̃+1 個變數的 QP 換成 N 個變數、N+1 個限制的 QP，再用 KKT 條件從 α 解回 (b, w)：只有 αₙ>0 的點，也就是支援向量，會影響答案。對偶問題還留著 zₙᵀzₘ 這個內積，所以要等下一講的 kernel 才算真正擺脫維度。"
description: "台大林軒田《機器學習技法》Lecture 1 Linear SVM 與 Lecture 2 Dual SVM 導讀：從基石 L12 特徵轉換的代價與 L14 weight decay 接到最大 margin、點到超平面距離、標準 hard-margin 問題與 QP、large margin 為什麼能壓低有效 VC 維度、拉格朗日函數與強對偶、KKT 條件、支援向量的意義，附影片、投影片與 LFD e-8.1–8.2 對照。"
draft: false
glossary:
  - term: "margin"
    aliases: ["邊界寬度", "fatness"]
    definition: "分隔超平面到最近訓練點的距離。林軒田在投影片上先叫它 fatness（胖瘦），再正式命名為 margin。"
    context: "技法 T1 的最大化目標：找最胖的分隔超平面。"
  - term: "KKT 條件"
    aliases: ["Karush-Kuhn-Tucker conditions", "KKT conditions"]
    definition: "原始與對偶問題同時達到最佳解時必須成立的一組條件：原始可行、對偶可行、對偶內層最佳、互補鬆弛。在 SVM 這類凸 QP 上也是充分條件。"
    context: "技法 T2 用 KKT 從對偶解 α 算回 w 與 b。"
  - term: "支援向量"
    aliases: ["support vector", "SV"]
    definition: "對偶解中 αₙ>0 的訓練點。它們一定落在胖邊界上，而且只靠它們就能算出 w 與 b。"
    context: "SVM 名稱的來源；T2 把「邊界上的候選點」和「αₙ>0 的點」分開。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 9 篇，從這篇開始進入[機器學習技法](https://www.csie.ntu.edu.tw/~htlin/mooc/)。範圍是技法第 1 講 Linear Support Vector Machine 與第 2 講 Dual Support Vector Machine。

**本文依據**：MOOC 投影片 [201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf) 與 [202_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf)、[技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)第 1–9 支、[Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 與 [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 課程頁的課程計畫，全部在 2026-09-30 打開核對。教科書對應 [LFD](http://amlbook.com) e-8.1（線性 SVM）與 e-8.2（對偶 SVM），這是兩份課程頁標的章節；e-Chapter 8 是 LFD 的線上章節，本文沒有打開章節本身。

存取等級：只看 MOOC 是 **A2**，投影片與 9 支影片都免費。這兩講在 Fall 2024 沒有專屬作業，相關練習都在 HW6（見文末），那份 PDF 公開，但沒有官方解答。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=A-GxGCCAIrg
title: T1-1
```

```youtube
url: https://www.youtube.com/watch?v=8hak0XngnV0
title: T1-2
```

原始影片：[T1-1](https://www.youtube.com/watch?v=A-GxGCCAIrg)、[T1-2](https://www.youtube.com/watch?v=8hak0XngnV0)、[T1-3](https://www.youtube.com/watch?v=lHo9GcIURRs)、[T1-4](https://www.youtube.com/watch?v=FAm70y081o4)、[T1-5](https://www.youtube.com/watch?v=7UUO_AamxcA)、[T2-1](https://www.youtube.com/watch?v=VUp-17l03lk)、[T2-2](https://www.youtube.com/watch?v=Yhwtvbzg9Fw)、[T2-3](https://www.youtube.com/watch?v=qGk0p7K07Mc)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 從基石接過來：轉換的代價還沒付清

基石收尾時留下兩個工具，技法第 1 講會把它們接在一起。

第一個是 [L12 非線性轉換](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)。把 x 轉成 Q 次多項式特徵 Φ_Q(x) 可以畫出彎曲的邊界，但 L12 的「Price of Nonlinear Transform」一節列了兩筆帳：d̃ 維的特徵在 Q 大時難算也難存，而且 Q 大會讓 d_vc 變大。見[第 6 篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)。

第二個是 [L14 正則化](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)。在 E_in 後面加上 (λ/N)wᵀw，也就是 weight decay，用來限制 w 的長度。見[第 7 篇](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)。

技法第 1 講開場的 Course Design 說，整門課圍繞三種處理特徵轉換的技巧，第一種叫 Embedding Numerous Features：怎麼利用並正則化「大量」特徵。這一種技巧引出 SVM。接下來兩講要做的事，就是讓你享受高維轉換帶來的複雜邊界，同時不必付 L12 那兩筆帳。

## T1：線性 SVM

### 哪條線最好？

投影片從一張圖開始：三條線都把資料分開，E_in 都是 0。PLA 會選哪條要看隨機性；VC bound 對三條一視同仁，因為它們的 d_vc 都是 d+1。但大部分人會挑離兩邊資料最遠的那條。

林軒田給的是非正式理由：未來的輸入 x 很可能是某個訓練點 xₙ 加上一點雜訊。分隔線離最近的 xₙ 越遠，能容忍的雜訊越多，也越不容易過擬合。他把這種「離兩邊都遠」的超平面叫做 fat（胖），胖瘦就是到最近訓練點的距離，正式名稱是 **margin**。目標於是變成：在分對所有點的前提下，找 margin 最大的超平面。

### 寫成標準問題

這一節要處理三件事，每件都是一個技術小步驟：

1. **把 w₀ 拿出來叫 b**。算距離時，截距和其他權重的角色不同，所以從這裡開始寫成 h(x) = sign(wᵀx + b)，x 與 w 不再補那個常數 1。
2. **點到超平面的距離**。取超平面上兩點 x′、x″，可以看出 w 垂直於超平面；把 x − x′ 投影到 w 方向，得到距離 = |wᵀx + b| / ‖w‖。對一條分對的線，絕對值可以換成 yₙ(wᵀxₙ + b)。
3. **固定縮放**。wᵀx + b = 0 和 3wᵀx + 3b = 0 是同一條線，所以可以只看滿足 min yₙ(wᵀxₙ + b) = 1 的 (b, w)。這時 margin 剛好是 1/‖w‖。

投影片接著論證：把「最小值等於 1」放寬成「每個點都 ≥ 1」，最佳解不會跑掉。如果最佳解每個點都大於 1（投影片舉 1.126），就能把 (b, w) 等比例縮小，得到更大的 1/‖w‖，這就矛盾了。最後把 max 1/‖w‖ 換成 min，去掉根號，乘上 ½：

```text
min_{b,w}  ½ wᵀw
subject to yₙ(wᵀxₙ + b) ≥ 1,  n = 1, …, N
```

這就是 **hard-margin SVM** 的標準形式。投影片用四個二維點手算一次，得到 w = (1, −1)、b = −1，margin 是 1/√2 ≈ 0.707。圖上只有落在胖邊界上的點決定了這條線，其他點拿掉也不影響答案。林軒田把邊界上的點叫做 **support vector（的候選）**，SVM 這個名字就是從這裡來的。

### 交給 QP 解

一般情況沒辦法手算，梯度下降碰到限制式也不好處理。好在這個問題的目標函數是 (b, w) 的凸二次式，限制式是 (b, w) 的線性式，這類問題叫 **quadratic programming（QP）**，有現成的解法。

投影片把 SVM 對應到 QP 解算器的標準輸入 `QP(Q, p, A, c)`：變數 u = [b; w]，Q 是左上角為 0、右下角為單位矩陣的方陣，p = 0，每個限制 aₙᵀ = yₙ[1, xₙᵀ]，cₙ = 1，共 N 條。要非線性，就把 xₙ 換成 zₙ = Φ(xₙ)。

### 為什麼 large margin 有用

這是 T1 最值得慢慢讀的一節，因為它把 SVM 接回基石的理論。

先從正則化的角度看。L14 的正則化是「最小化 E_in，限制 wᵀw ≤ C」；SVM 反過來，是「最小化 wᵀw，限制 E_in = 0（而且還要更多）」。投影片的結論是：SVM 等於在 E_in = 0 的範圍內做 weight decay。

再從 VC 的角度看。想像一個演算法 A_ρ：找得到 margin ≥ ρ 的分隔線就回傳，找不到就放棄。ρ = 0 時它就像 PLA，能 shatter 一般位置的 3 個點；ρ 夠大時，連 3 個點都 shatter 不了。能產生的 dichotomy 變少，有效的 VC 維度就變小。投影片給的上界是：輸入落在半徑 R 的球內時，d_vc(A_ρ) ≤ min(R²/ρ², d) + 1，不會超過一般 perceptron 的 d+1。

注意投影片的附註：這裡算的是演算法 A_ρ 的 VC 維度，它和資料有關，已經超出基石講的 VC 理論範圍。

最後一張表是 T1 的重點：

| | 超平面 | large-margin 超平面 | 超平面＋特徵轉換 Φ |
|---|---|---|---|
| 能產生的邊界數 | 不多 | 更少 | 很多 |
| 邊界形狀 | 簡單 | 簡單 | 複雜 |

邊界數少對泛化有利，邊界複雜對降低 E_in 有利。large margin 加上大量特徵轉換，就有機會兩者兼得。這就是非線性 SVM 的動機，也是 T2 要解決的問題。

**怎麼做**：做完投影片的 Fun Time 題（ρ = 1/4、1126 維、‖z‖ ≤ 1 時 d_vc 上界是多少），確定你會用 min(R²/ρ², d) + 1 這個式子。

## T2：對偶 SVM

### 動機：想要不依賴 d̃ 的 SVM

非線性 SVM 的 QP 有 d̃ + 1 個變數、N 條限制。d̃ 很大，甚至是無限大時，這個 QP 就解不了。T2 的目標寫在投影片上：SVM without dependence on d̃。做法是找一個「等價」的 QP，只有 N 個變數、N + 1 條限制。

林軒田在這裡先打預防針：Warning: Heavy Math!!!!!!。他會引入必要的數學但不求嚴謹，有些結果直接「宣稱」，就像基石宣稱 Hoeffding 不等式一樣。

### 拉格朗日函數：把限制藏進 max

工具是 L14 已經見過的拉格朗日乘數。正則化那時把 λ 當成給定的參數；對偶 SVM 反過來，把每條限制配一個乘數 αₙ，當成未知數來解。N 條限制就有 N 個 αₙ。

```text
L(b, w, α) = ½ wᵀw + Σₙ αₙ (1 − yₙ(wᵀzₙ + b))
```

關鍵觀察：原本的 SVM 等於 `min_{b,w} ( max_{αₙ≥0} L )`。如果 (b, w) 違反某條限制，那一項是正的，讓對應的 αₙ 趨近無限大，max 就是 ∞；如果 (b, w) 全部合法，每一項都 ≤ 0，max 就取 αₙ = 0，剩下 ½wᵀw。限制式就這樣藏進了 max 裡。

### 對偶問題與強對偶

把 min 和 max 的順序對調，得到一個下界：

```text
min_{b,w} max_{α≥0} L  ≥  max_{α≥0} min_{b,w} L
```

右邊就是 **Lagrange dual problem**。「≥」叫弱對偶。對 QP 來說，只要原問題是凸的、可行的（在 Φ 空間可分時成立）、限制是線性的，等號就成立，這叫**強對偶**，投影片稱這些條件為 constraint qualification。這時存在一組 (b, w, α) 同時是兩邊的最佳解。

### 化簡：兩次偏微分

對偶問題的內層是沒有限制的 min，所以最佳解的偏微分為 0：

- 對 b 偏微分：得到 Σ αₙyₙ = 0。加上這條限制後，含 b 的項整個消失。
- 對 w 偏微分：得到 w = Σ αₙyₙzₙ。代回去後，只剩下 α。

整理後就是標準的 hard-margin SVM dual：

```text
min_α  ½ Σₙ Σₘ αₙαₘ yₙyₘ zₙᵀzₘ − Σₙ αₙ
subject to Σₙ yₙαₙ = 0;  αₙ ≥ 0, n = 1, …, N
```

N 個變數、N + 1 條限制，符合承諾。

### KKT 條件：從 α 解回 (b, w)

原始與對偶同時最佳時，四組條件必須成立，稱為 **KKT 條件**：

1. 原始可行：yₙ(wᵀzₙ + b) ≥ 1
2. 對偶可行：αₙ ≥ 0
3. 對偶內層最佳：Σ yₙαₙ = 0；w = Σ αₙyₙzₙ
4. 原始內層最佳（互補鬆弛）：αₙ(1 − yₙ(wᵀzₙ + b)) = 0

投影片說它們是最佳解的必要條件，在這裡也是充分條件。用法是：w 直接從第 3 條算；b 從第 4 條算，只要有一個 αₙ > 0，那個點的括號就必須是 0，於是 b = yₙ − wᵀzₙ。

實務上，投影片提醒你兩件事。第一，對偶的 Q 矩陣元素 q_{n,m} = yₙyₘzₙᵀzₘ 通常不是 0，N = 30,000 時光是存這個稠密矩陣就要超過 3 GB。第二，很多解算器會特別處理等式與上下界限制，所以實務上最好用專為 SVM 設計的解算器，不要硬塞進通用 QP。

### 對偶透露的訊息

互補鬆弛說：αₙ > 0 的點一定在胖邊界上。投影片據此重新定義 **support vector**：αₙ > 0 的點才是支援向量，它們是「邊界上的候選點」的子集。w 和 b 都只要用支援向量就能算出來。

投影片還把 SVM 和 PLA 並排：

| | 表示法 | 係數從哪來 |
|---|---|---|
| SVM | w = Σ αₙ(yₙzₙ) | 對偶問題的解 |
| PLA | w = Σ βₙ(yₙzₙ) | 每個點被修正的次數 |

兩者的 w 都是 yₙzₙ 的線性組合，也就是「由資料表示」。從 w₀ = 0 起跑的 GD／SGD 版邏輯迴歸與線性迴歸也是如此。差別在於 SVM 只用支援向量來表示 w。

原始與對偶的比較：

| | 原始 hard-margin SVM | 對偶 hard-margin SVM |
|---|---|---|
| 規模 | d̃ + 1 個變數、N 條限制 | N 個變數、N + 1 條簡單限制 |
| 適合 | d̃ 小的時候 | N 小的時候 |
| 物理意義 | 找特定縮放的 (b, w) | 找支援向量與它們的 αₙ |

### 還沒做完

T2 最後一張投影片問：Are We Done Yet? 對偶 QP 的變數數量確實和 d̃ 無關，但 q_{n,m} 裡的 zₙᵀzₘ 是 d̃ 維的內積，直接算要 O(d̃)。d̃ 的依賴只是藏起來了。要真正擺脫它，得等[下一篇](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)的 kernel trick。

<details>
<summary>投影片 Fun Time 裡值得自己推一次的兩題</summary>

- 兩個點 (z, +1) 與 (−z, −1)，α₁、α₂ 都大於 0，最佳的 b 是多少？用互補鬆弛寫出兩條等式再相加。
- N = 5566、支援向量有 1126 個，胖邊界上的點可能有幾個？關鍵是「支援向量 ⊆ 邊界上的候選點 ⊆ 全部資料」。

投影片都附了參考答案，推完再對。

</details>

## 影片與投影片對照

| 小節 | 影片 | 投影片 |
|---|---|---|
| Course Introduction | [T1-1](https://www.youtube.com/watch?v=A-GxGCCAIrg) | 201 |
| Large-Margin Separating Hyperplane | [T1-2](https://www.youtube.com/watch?v=8hak0XngnV0) | 201 |
| Standard Large-Margin Problem | [T1-3](https://www.youtube.com/watch?v=lHo9GcIURRs) | 201 |
| Support Vector Machine | [T1-4](https://www.youtube.com/watch?v=FAm70y081o4) | 201 |
| Reasons behind Large-Margin Hyperplane | [T1-5](https://www.youtube.com/watch?v=7UUO_AamxcA) | 201 |
| Motivation of Dual SVM | [T2-1](https://www.youtube.com/watch?v=VUp-17l03lk) | 202 |
| Lagrange Dual SVM | [T2-2](https://www.youtube.com/watch?v=Yhwtvbzg9Fw) | 202 |
| Solving Dual SVM | [T2-3](https://www.youtube.com/watch?v=qGk0p7K07Mc) | 202 |
| Messages behind Dual SVM | [T2-4](https://www.youtube.com/watch?v=agmmQh702aA) | 202 |

T2-2 的影片標題在 YouTube 上拼成「Largange Dual SVM」，投影片是正確的 Lagrange。

## 兩個學期怎麼排

- **Fall 2024**：W9（10/28）同一週講 linear SVM 與 dual SVM，投影片是 `201u`、`202u`。
- **Fall 2026**：排在 W9（11/04），同樣兩講一起上，課程頁標 LFD e-8.1、e-8.2。這一週的 `201u_handout.pdf` 連結在 2026-09-30 打開是 404（課程才進行到 W4），本文只用 MOOC 版。

## 練習：Fall 2024 HW6 的相關題

[Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)（2024-11-18 發布、12-02 截止）的主題是 kernel、soft-margin 與 aggregation，大多數題目要等下一篇的內容。和這一篇直接相關的有兩題：

- **Q1**：把 PLA 的 w 寫成 Σ αₙΦ(xₙ)，問每次修正時 α 該怎麼更新。這正是 T2 最後「w 由資料表示」那張表的延伸。
- **Q13（bonus）**：推導 soft-margin SVM 對偶問題的對偶，和原始問題比較。先把本篇的拉格朗日對偶步驟練熟再做。

沒有官方解答。Q1 可以自己寫一個 kernel perceptron，和一般 PLA 在同一份資料上比對每一步的 w 是否一致。

## 延伸閱讀

- 站內 [CS229 2026 講義第 6 章：支援向量機](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines)：另一種 SVM 推導方式，可以和本篇的 QP 寫法對照。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：Abu-Mostafa 用同一本教科書開的英文課。

系列導覽：上一篇 [驗證與三個學習原則](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)｜下一篇 [Kernel 技巧與軟邊界 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 16 講大綱與投影片
- [技法 Lecture 1：Linear Support Vector Machine（201_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf)
- [技法 Lecture 2：Dual Support Vector Machine（202_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf)
- [基石 Lecture 12：Nonlinear Transformation（12_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)
- [基石 Lecture 14：Regularization（14_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Learning from Data 教科書網站](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
