---
title: "林軒田機器學習基石 L11–L12：線性分類模型、SGD、多類別與非線性轉換"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, classification, optimization, feature-engineering]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 6
tldr: "基石 L11 把 PLA、線性迴歸、邏輯迴歸放在同一個分數 s = wᵀx 上比較：三者只差在誤差函數，而 scaled cross-entropy 是 0/1 誤差的上界，所以兩種迴歸都能拿來做分類。接著用「隨機挑一筆算梯度」把邏輯迴歸變成 SGD，並用 OVA、OVO 把二元分類器組成多類別分類器。L12 用特徵轉換 Φ 把圓形邊界變成 Z 空間裡的直線，代價是計算量與 d_vc 都跟著維度變大，所以結論是「先試線性模型」。練習題在 Fall 2024 HW4。"
description: "台大林軒田《機器學習基石》第 11–12 講導讀：三種線性模型的誤差函數比較與上界論證、隨機梯度下降與 PLA 的關係、OVA 與 OVO 兩種多類別拆解、二次假說與 Z 空間轉換、多項式轉換在計算與模型複雜度上的代價、巢狀假說集合與「linear model first」，對照 LFD 3.3–3.4 與 Fall 2024 HW4。"
draft: false
glossary:
  - term: "OVA decomposition"
    aliases: ["one-versus-all", "一對其餘"]
    definition: "把 K 類分類拆成 K 個「是第 k 類或不是」的二元問題，各自訓練一個軟性分類器（如邏輯迴歸），預測時取分數最高的類別。"
    context: "林軒田基石 L11 的第一種多類別 meta-algorithm。"
  - term: "OVO decomposition"
    aliases: ["one-versus-one", "一對一"]
    definition: "對每一對類別 (k, ℓ) 只取這兩類的資料訓練二元分類器，共 K(K−1)/2 個，預測時讓所有分類器投票，選出「錦標賽冠軍」。"
    context: "林軒田基石 L11 的第二種多類別 meta-algorithm，用來緩解 OVA 的類別不平衡。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文以[機器學習基石 MOOC](https://www.csie.ntu.edu.tw/~htlin/mooc/) 的 Lecture 11 與 Lecture 12 投影片（[11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf)、[12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)）與 [YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)第 42–49 支為準；練習題取自 [Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 的 [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/)。全部在 2026-09-30 打開核對。存取等級：MOOC 本身 **A2**，加上 Fall 2024 作業 **A3（評分鏈除外）**，沒有官方解答。

**系列位置**：上一篇 [線性迴歸與邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)｜下一篇 [過擬合與正則化](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

到 L10 為止，基石的第三段「How Can Machines Learn?」已經給了三個線性模型：做分類的 PLA、有閉式解的線性迴歸、用梯度下降解的邏輯迴歸。L11 要回答它們之間是什麼關係，L12 則要回答：如果資料根本不是線性可分的，這三個模型還能用嗎？

這兩講是第三段的收尾。讀完你應該能說出：為什麼可以拿迴歸來做分類、SGD 的更新式是怎麼來的、多類別分類有哪兩種拆法，以及特徵轉換的代價要怎麼算。

## 課程影片來源

以下影片已於 2026-10-10 對照林軒田官方 MOOC 頁與兩份官方免費 YouTube 播放清單（講次與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=qXfDVHVzI38
title: Binary Classification
```

```youtube
url: https://www.youtube.com/watch?v=9HL3YvmrovQ
title: Stochastic Grad. Descent
```

原始影片：[Binary Classification](https://www.youtube.com/watch?v=qXfDVHVzI38)、[Stochastic Grad. Descent](https://www.youtube.com/watch?v=9HL3YvmrovQ)、[Multiclass via Logistic](https://www.youtube.com/watch?v=wnM435PDHGY)、[Multiclass via Binary](https://www.youtube.com/watch?v=vxnjOI_ASlw)、[Quadratic Hypotheses](https://www.youtube.com/watch?v=8pQ06pku1xA)、[Nonlinear Transform](https://www.youtube.com/watch?v=UHAn6Cuk8zk)、[Price of Nonlinear Transform](https://www.youtube.com/watch?v=Inxr-Yc1Aow)、[Structured Hypothesis Sets](https://www.youtube.com/watch?v=gcLmU3MC3bE)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-10。

## 課程與教材對照

| 講次 | YouTube 小節（播放清單序號） | 投影片 | LFD 章節 |
|---|---|---|---|
| L11 Linear Models for Classification | [Binary Classification](https://www.youtube.com/watch?v=qXfDVHVzI38)（42）、[Stochastic Grad. Descent](https://www.youtube.com/watch?v=9HL3YvmrovQ)（43）、[Multiclass via Logistic](https://www.youtube.com/watch?v=wnM435PDHGY)（44）、[Multiclass via Binary](https://www.youtube.com/watch?v=vxnjOI_ASlw)（45） | [11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf) | 3.3 |
| L12 Nonlinear Transformation | [Quadratic Hypotheses](https://www.youtube.com/watch?v=8pQ06pku1xA)（46）、[Nonlinear Transform](https://www.youtube.com/watch?v=UHAn6Cuk8zk)（47）、[Price of Nonlinear Transform](https://www.youtube.com/watch?v=Inxr-Yc1Aow)（48）、[Structured Hypothesis Sets](https://www.youtube.com/watch?v=gcLmU3MC3bE)（49） | [12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf) | 3.4 |

LFD 章節照 Fall 2024 與 Fall 2026 課程頁的標註。Fall 2024 在 W6（10/07）上這兩講，課程頁連到的是 [11u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/11u_handout.pdf) 與 [12u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/12u_handout.pdf)。[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 排在 W6（10/14），今天這兩份投影片的連結還是 404，要等上課後才會公開。

## L11 上半：三個線性模型只差在誤差函數

投影片第 2 頁把三個模型畫成同一張圖。它們都先算一個線性分數 s = wᵀx，差別只在後面接什麼：

| 模型 | 假說 | 誤差 | 最佳化難度 |
|---|---|---|---|
| 線性分類（PLA） | h(x) = sign(s) | 0/1 | 離散，NP-hard |
| 線性迴歸 | h(x) = s | squared | 二次凸函數，有閉式解 |
| 邏輯迴歸 | h(x) = θ(s) | cross-entropy | 平滑凸函數，梯度下降 |

關鍵的一步是把三種誤差都改寫成 ys 的函數。對 y ∈ {−1, +1}，ys 可以讀成「分類正確的程度」，ys 越大越對：

- err₀/₁ = ⟦sign(ys) ≠ 1⟧
- err_SQR = (ys − 1)²
- err_CE = ln(1 + exp(−ys))

畫在同一張圖上就看得出差別。平方誤差在 ys ≤ 1 時確實比 0/1 大，但在 ys 遠大於 1 時也會重罰，等於懲罰「對得太多」。cross-entropy 對 ys 單調遞減。把它換成以 2 為底的 scaled cross-entropy，err_SCE = log₂(1 + exp(−ys))，就成為 0/1 誤差的上界。

上界的意義在第 5 頁。因為 err₀/₁ ≤ err_SCE = (1/ln 2)·err_CE，把 VC bound 套上去，E_out 的 0/1 誤差就被 cross-entropy 的 E_in 加上一個複雜度項壓住。結論是：**把 cross-entropy 做小，0/1 誤差也跟著變小**，所以邏輯迴歸可以拿來做線性分類。平方誤差也是 0/1 的上界，線性迴歸同樣適用。

實務上怎麼選，第 6 頁給了三欄比較：

- **PLA**：資料線性可分時有效率又有保證，不可分就得靠 pocket。
- **線性迴歸**：最好解，但在 |ys| 大的地方是很鬆的上界。
- **邏輯迴歸**：好解，只有在 ys 很負時上界才鬆。

投影片的建議是：線性迴歸常拿來當 PLA、pocket 或邏輯迴歸的初始 w₀；要在 pocket 和邏輯迴歸之間選，通常選邏輯迴歸。

## L11 中段：SGD，以及它跟 PLA 的關係

PLA 每次只看一筆資料，每輪 O(1)；L10 的邏輯迴歸梯度下降每輪要掃過全部 N 筆，每輪 O(N)。能不能讓邏輯迴歸也每輪 O(1)？

投影片的做法是把梯度裡的 (1/N)Σ 看成「對 n 均勻抽樣取期望值」。那麼隨機抽一筆算出來的梯度，就是真梯度加上一個期望值為零的雜訊。步數夠多時，平均起來兩者差不多。這就是 SGD，邏輯迴歸版的更新式是：

w_{t+1} ← w_t + η · θ(−y_n w_tᵀx_n) · y_n x_n

投影片接著把它和 PLA 並排。PLA 的更新是 w_{t+1} ← w_t + 1·⟦y_n ≠ sign(w_tᵀx_n)⟧·y_n x_n。對照之下，SGD 邏輯迴歸就是「軟性的 PLA」：用 θ(−ys) 這個介於 0 和 1 的權重，取代「錯了才更新」的硬性指示函數。當 w_tᵀx_n 很大時，PLA 近似於 η = 1 的 SGD 邏輯迴歸。

SGD 的優點是計算便宜，適合大資料與線上學習；缺點是本質上比較不穩。投影片給的兩個經驗法則是：t 夠大就停，x 的範圍合適時 η 取 0.1。這一節的 Fun Time 順便推出線性迴歸的 SGD 方向：2(y_n − w_tᵀx_n)x_n，也就是依殘差大小修正 w。

## L11 下半：多類別分類的兩種拆法

基石到這裡都只處理二元分類。L11 最後兩節用兩個 meta-algorithm，把二元分類器組成 K 類分類器。

**OVA（one-versus-all）**：對每個類別 k，把資料重新標成「是 k 就 +1，否則 −1」，跑一次邏輯迴歸得到 w_[k]。預測時取 argmax_k w_[k]ᵀx。投影片特別說明為什麼要用邏輯迴歸這種「軟」分類器：如果每個二元分類器只輸出 ±1，組合時會遇到平手（投影片第 15 頁只留了一句「but ties?」）；改成比較各類估計的 P(k|x)，取最大者就好。

- 優點：有效率，可以搭配任何類似邏輯迴歸的方法。
- 缺點：K 大時，每個子問題都嚴重不平衡，一類對上其餘所有類。
- 延伸：multinomial（coupled）logistic regression。

**OVO（one-versus-one）**：對每一對類別 (k, ℓ)，只取這兩類的資料訓練一個二元分類器。預測時讓所有分類器投票，選出錦標賽冠軍。

- 優點：每個子問題比較小，也比較平衡、穩定，可以搭配任何二元分類演算法。
- 缺點：要存 O(K²) 個 w，預測比較慢，總訓練次數也比較多。

第 24 頁的 Fun Time 把兩者的訓練成本算給你看：假設二元分類演算法對 N 筆資料要花 N³ 秒，10 類各 N/10 筆，OVO 要訓練 45 個分類器，每個用 2N/10 筆，合計約 (9/25)N³；同一個演算法做 OVA 要 10N³。子問題變小的好處，在超線性複雜度的演算法上特別明顯。

## L12：非線性轉換，以及它的代價

### 從圓形邊界到 Z 空間的直線

L12 從一份線性不可分、但可以用圓分開的資料開始：h_SEP(x) = sign(−x₁² − x₂² + 0.6)。難道要重新推導一套「圓形 PLA」「圓形迴歸」嗎？

不用。令 z = Φ(x) = (1, x₁², x₂²)，這條圓形邊界就變成 Z 空間裡的一條直線 sign(w̃ᵀz)。投影片列了幾組 w̃ 對應到 X 空間的曲線：(0.6, −1, −1) 是圓，(0.6, −1, −2) 是橢圓，(0.6, −1, +2) 是雙曲線。換成完整的二次轉換 Φ₂(x) = (1, x₁, x₂, x₁², x₁x₂, x₂²)，Z 空間的感知器就對應到 X 空間所有二次曲線，直線與常數也包含在內，當作退化情形。

流程只有三步：

1. 把資料 {(x_n, y_n)} 轉成 {(z_n = Φ(x_n), y_n)}。
2. 在 Z 空間用你喜歡的線性演算法 A 得到 w̃。
3. 回傳 g(x) = sign(w̃ᵀΦ(x))。

投影片把這稱為打開潘朵拉的盒子：二次 PLA、二次迴歸、三次迴歸、任意多項式迴歸都可以照做。而且 Φ 不一定是多項式，投影片第 11 頁用手寫數字說明：從原始像素換成「平均亮度、對稱性」這種具體特徵，本身就是一種轉換，只是靠的是領域知識。L3 講輸入空間時也用過對稱性這類 concrete features。

### 代價一：計算與儲存

Q 次多項式轉換 Φ_Q 在 d 維輸入上會產生 d̃ = C(Q+d, d) − 1 維，也就是 O(Q^d)。Q 一大，z 和 w̃ 就很難算也很難存。第 17 頁的 Fun Time 給了一個具體數字：d = 2、Q = 50 時，d̃ = 1325。

### 代價二：模型複雜度

自由參數有 d̃ + 1 個，d_vc(H_Φ_Q) ≤ d̃ + 1。Q 越大，d_vc 越大。這就回到基石第二段的取捨：d̃ 大，E_in 容易做小，但 E_out 和 E_in 的差距難保證；d̃ 小則反過來。

那能不能先把資料畫出來、再用眼睛挑 Φ？第 16 頁說不行，理由有兩個。第一，X = R¹⁰ 時根本畫不出來。第二，看過資料後把 Φ₂ 縮成 (1, x₁², x₂²)，甚至直接寫出 sign(0.6 − x₁² − x₂²)，看起來 d_vc 變小了，但你的大腦已經替模型做了選擇，那部分複雜度沒有被算進去。投影片的結論是：為了 VC 保證，Φ 要在「偷看」資料之前決定。這個主題會在 [L16 的 data snooping](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles) 再回來。

### 巢狀假說集合與 linear model first

多項式轉換天然形成一串巢狀集合：H₀ ⊂ H₁ ⊂ H₂ ⊂ …。越往右，d_vc 不減，最佳 E_in 不增，E_out 則是熟悉的 U 形曲線。

所以投影片第 20 頁給的建議是：**先試線性模型**。直接用 H₁₁₂₆ 做出很低的 E_in 去唬老闆，是一條回不了頭的路。先用 H₁，E_in 夠好就結束；不夠好再往右走，損失的只是多花的計算。

這一講的摘要最後一句是「next: dark side of the force」，下一篇要講的就是轉換太強的後果：過擬合。

## Fall 2024 HW4 裡練得到的題目

[HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) 在 2024-10-21 發布、11/04 截止，共 12 題加 1 題 bonus。Q1–4 是自動批改的選擇題，Q5–12 由助教批改。跟本篇相關的題目：

| 題號 | 內容 | 對應 |
|---|---|---|
| Q2 | PLA 的「全部錯誤點一起更新」變體，等於對哪一種 pointwise 誤差做梯度下降 | L11 誤差函數比較 |
| Q3 | 高估比低估更糟的非對稱平方誤差，求 SGD 更新方向 | L11 SGD |
| Q4 | 對每筆訓練資料做 one-hot 的「Dr. Transformer」轉換後跑線性迴歸 | L12 轉換的代價；題目提示你想想 E_out |
| Q6–7 | 題目明寫「In Lecture 11」：推導 multinomial logistic regression 的 SGD 方向，以及 K = 2 時與二元邏輯迴歸解的關係 | L11 OVA 的延伸 |
| Q10 | cpusmall_scale 資料、N = 64，實作線性迴歸的 SGD（題目指定照 Lecture 11 第 10、12 頁），η = 0.01、10 萬次迭代，和閉式解比較 | L11 SGD |
| Q11–12 | 同一份資料做 Q = 3 的齊次多項式轉換，看 E_in 的收益與 E_out 的變化 | L12 轉換的代價 |
| Q13（bonus） | 乘法形式的假說集合，證明或否證它的 d_vc 大於線性假說 | L12 轉換與 d_vc |

Q1 屬於 L10 的 cross-entropy，Q5 是邏輯迴歸的 Newton 法（Hessian），放在[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)；Q8–9 屬於 L13，放在[下一篇](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)。程式題用的 [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) 來自公開的 LIBSVM datasets 頁面。每個實驗要用不同的隨機種子重複 1126 次。

沒有官方解答，程式題可以這樣自我驗收：Q10 的 SGD 曲線應該往閉式解那條水平線靠近；Q11 的 E_in 差值依定義不會是負的（H₁ ⊂ H_Φ），出現負值代表實作有錯。

## 自學怎麼做

1. 先看第 42 支影片，自己把三種誤差畫在同一張 ys 圖上，再對照投影片第 4 頁。
2. 看第 43 支時，把 SGD 邏輯迴歸和 PLA 的更新式寫在同一行，確認你看得出「θ(−ys) 取代指示函數」這件事。
3. 做 HW4 Q10：它同時驗證 SGD 的實作，也讓你看到 SGD 收斂到閉式解附近要多少步。
4. 看 L12 時，每遇到一個 Φ 就問自己兩件事：d̃ 是多少？這個 Φ 是不是看了資料才決定的？

今晚可以做的一件事：用 d̃ = C(Q+d, d) − 1 算出 d = 10 時 Q = 2、3、5 的維度，感受一下多項式轉換的代價長得多快。

## 延伸閱讀

- 同一段內容的其他講法：[CS229 講義第 2 章：分類與邏輯斯迴歸](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression)、[Berkeley CS189 Lec 11–12：分類與 logistic regression](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic)
- 特徵轉換與正則化的取捨：[CMU 07-280 Lecture 10：Feature Engineering 與 Regularization](/posts/ai/2026-08-22-cmu-07280-lecture-10-feature-engineering-regularization)
- 技法篇會把「維度大要付代價」這個問題交給 SVM 與 kernel：[線性 SVM 與對偶 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)
- 作業總覽：[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。

## 參考資料

- [機器學習基石／技法 MOOC 頁](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 各講小節標題與投影片下載
- [Lecture 11: Linear Models for Classification（handout）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf) — 誤差函數比較、上界論證、SGD、OVA、OVO
- [Lecture 12: Nonlinear Transformation（handout）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf) — 二次假說、轉換步驟、兩種代價、巢狀假說集合
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) — 第 42–49 支
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W6 排程與 LFD 章節
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) — 題目與發布、截止日期
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W6（10/14）排程
- [LIBSVM datasets：cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) — HW4 程式題資料
- [Learning from Data（AMLbook）](http://amlbook.com) — 教科書 3.3–3.4 節
