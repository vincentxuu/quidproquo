---
title: "林軒田機器學習基石 L15–L16：驗證與三個學習原則"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, validation, model-selection, cross-validation]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 8
tldr: "基石 L15 處理模型選擇：用 E_in 選會過擬合，用 E_test 選是作弊，折衷是從訓練資料切出驗證集，用 E_val 選完再拿全部資料重訓。驗證集大小 K 兩難，經驗值是 K = N/5；LOOCV 幾乎無偏但太貴又不穩，實務上用 5-fold 或 10-fold。L16 用 Occam's razor、sampling bias、data snooping 三個原則收尾，並用「Power of Three」把整門課收成三個領域、三個 bound、三個線性模型、三個工具。練習題在 Fall 2024 HW5。"
description: "台大林軒田《機器學習基石》第 15–16 講導讀：模型選擇問題、E_in／E_test／E_val 的比較、驗證集大小的兩難與 K = N/5、leave-one-out 的幾乎無偏性與缺點、V-fold 交叉驗證；Occam's razor、1948 年美國大選與 Netflix 競賽的 sampling bias、匯率資料與論文接力的 data snooping，以及 Power of Three 總結，對照 LFD 4.3、第 5 章與 Fall 2024 HW5。"
draft: false
glossary:
  - term: "data snooping"
    aliases: ["資料窺探"]
    definition: "只要某份資料影響過學習流程中的任何一步（包括看圖挑特徵、用它做標準化、讀過別人在同一份資料上的結果），它評估最終結果的能力就被污染了。"
    context: "林軒田基石 L16 的第三個學習原則。"
  - term: "sampling bias"
    aliases: ["抽樣偏差"]
    definition: "訓練資料的分布與測試情境的分布不同時，VC 保證不再成立，學到的結果也會帶著同樣的偏差。"
    context: "林軒田基石 L16 的第二個學習原則，經驗法則是讓訓練與驗證盡量貼近測試情境。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文以[機器學習基石 MOOC](https://www.csie.ntu.edu.tw/~htlin/mooc/) 的 Lecture 15 與 Lecture 16 投影片（[15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf)、[16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf)）與 [YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)第 58–65 支為準；練習題取自 [Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 的 [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/)。全部在 2026-09-30 打開核對。存取等級：MOOC 本身 **A2**，加上 Fall 2024 作業 **A3（評分鏈除外）**，沒有官方解答。

**系列位置**：上一篇 [過擬合與正則化](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)｜下一篇 [線性 SVM 與對偶 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)｜[系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)留下一個問題：雜訊越多需要越強的正則化，但雜訊大小事先不知道，λ 要怎麼選？L15 的答案是驗證。L16 是基石的最後一講，不再引入新演算法，而是用三個原則提醒你：前面十五講的保證，在哪些情況下會悄悄失效。

讀完這篇，你應該能說清楚為什麼用 E_in 選模型不行、驗證集該切多大、為什麼選完要用全部資料重訓，以及 sampling bias 和 data snooping 分別在防什麼。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=BRLGPnrcel8
title: Model Selection Problem
```

```youtube
url: https://www.youtube.com/watch?v=RvkCaAwRP8A
title: Validation
```

原始影片：[Model Selection Problem](https://www.youtube.com/watch?v=BRLGPnrcel8)、[Validation](https://www.youtube.com/watch?v=RvkCaAwRP8A)、[Leave-One-Out Cross Validation](https://www.youtube.com/watch?v=iToz5t0J6WU)、[V-Fold Cross Validation](https://www.youtube.com/watch?v=Y8PaLsYm0Ac)、[Occam's Razor](https://www.youtube.com/watch?v=Oj6j98ceUz8)、[Sampling Bias](https://www.youtube.com/watch?v=8QZZiIAdTUU)、[Data Snooping](https://www.youtube.com/watch?v=7nP5zWMQmxM)、[Power of Three](https://www.youtube.com/watch?v=29jgHPeRAqI)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 課程與教材對照

| 講次 | YouTube 小節（播放清單序號） | 投影片 | LFD 章節 |
|---|---|---|---|
| L15 Validation | [Model Selection Problem](https://www.youtube.com/watch?v=BRLGPnrcel8)（58）、[Validation](https://www.youtube.com/watch?v=RvkCaAwRP8A)（59）、[Leave-One-Out Cross Validation](https://www.youtube.com/watch?v=iToz5t0J6WU)（60）、[V-Fold Cross Validation](https://www.youtube.com/watch?v=Y8PaLsYm0Ac)（61） | [15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf) | 4.3 |
| L16 Three Learning Principles | [Occam's Razor](https://www.youtube.com/watch?v=Oj6j98ceUz8)（62）、[Sampling Bias](https://www.youtube.com/watch?v=8QZZiIAdTUU)（63）、[Data Snooping](https://www.youtube.com/watch?v=7nP5zWMQmxM)（64）、[Power of Three](https://www.youtube.com/watch?v=29jgHPeRAqI)（65） | [16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf) | 第 5 章 |

LFD 章節照 Fall 2024 與 Fall 2026 課程頁的標註。Fall 2024 在 W8（10/21）上這兩講，課程頁連到 [15u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/15u_handout.pdf) 與 [16u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/16u_handout.pdf)。[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 排在 W8（10/28），今天這兩份投影片的連結還是 404。第 65 支影片是整個基石播放清單的最後一支。

## L15：怎麼選模型而不偷看

### 模型選擇是最重要的實務問題

投影片第 2 頁列了一張組合表：光是二元分類，就有演算法（PLA、pocket、線性迴歸、邏輯迴歸）、迭代次數、學習率、特徵轉換、正則化項、λ 六個維度可以選。第 3 頁把這個問題寫得很正式：給定 M 個模型 H_m 與對應的演算法 A_m，要選出 E_out(g_m*) 最低的那個。E_out 仍然是未知的，投影片也說這「可以說是機器學習最重要的實務問題」。

用眼睛看？投影片說不行，要你回想 [L12](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform) 講過的「用眼睛挑 Φ」。

### E_in、E_test 與 E_val

接下來比較三種選法：

| 選法 | 問題 |
|---|---|
| 用 E_in 選 | Φ₁₁₂₆ 永遠贏過 Φ₁，λ = 0 永遠贏過 λ = 0.1。而且「選模型＋學習」付的是 d_vc(H₁ ∪ H₂) 的代價，泛化會變差 |
| 用 E_test 選 | 有漂亮的有限 bin Hoeffding 保證，E_out ≤ E_test + O(√(log M / N_test))。但測試資料在「老闆的保險箱裡」，拿不到，拿來選也是作弊 |
| 用 E_val 選 | 從手上的 D 切出 D_val，只要 A_m 沒用過它，它就是乾淨的。投影片稱之為「合法的作弊」 |

### 驗證的完整流程

1. 從 D 隨機取 K 筆當 D_val，剩下 N − K 筆當 D_train。隨機抽取是為了讓 D_val 仍然是從 P(x, y) 獨立同分布抽出。
2. 每個模型只用 D_train 訓練，得到 g_m⁻ = A_m(D_train)。
3. 用 E_val(g_m⁻) 選出 m*。保證是 E_out(g_m⁻) ≤ E_val(g_m⁻) + O(√(log M / K))。
4. **用全部 D 重訓**，回傳 g_m* = A_m*(D)。

第 4 步的理由是學習曲線：資料從 N − K 筆變成 N 筆，E_out 通常會更低。第 10 頁的實驗驗證了這點，在 H_Φ5 與 H_Φ10 之間選，「選完用全部資料重訓」的曲線確實比直接回傳 g_m*⁻ 好。圖中也看得到另一件事：直接回傳 g⁻ 的版本，在某些 K 下甚至比用 E_in 選還差。

### K 的兩難

驗證的推理是一條近似鏈：E_out(g) ≈ E_out(g⁻) ≈ E_val(g⁻)。

- 第一個 ≈ 需要 K 小，這樣 g⁻ 才接近 g。
- 第二個 ≈ 需要 K 大，這樣 E_val 才接近 E_out。

投影片給的經驗值是 **K = N/5**。第 12 頁的 Fun Time 算給你看代價：一個模型用 N 筆要訓練 N² 秒，K = N/5、25 個模型，總共要 (16/25)N²×25 + N² = 17N² 秒。

### Leave-one-out 與 V-fold

把 K 推到極端 K = 1，輪流留下每一筆當驗證，再平均：

E_loocv(H, A) = (1/N) Σ err(g_n⁻(x_n), y_n)

第 15 頁證明了它的期望值等於在 N − 1 筆資料上訓練的平均 E_out，所以常被稱為「幾乎無偏」的 E_out 估計。第 16 頁的手寫數字實驗裡，用 E_loocv 選特徵數比用 E_in 選好很多。

但投影片隨即列出兩個缺點：每個模型要多訓練 N 次，除非像線性迴歸有解析解，否則通常負擔不起；而且每個點的估計變異大，曲線不穩。結論是 LOOCV 實務上不常用。

折衷是 V-fold：把 D 隨機切成 V 等份，輪流拿一份驗證、其餘訓練，平均 V 個 E_val。經驗值 V = 10。

第 20 頁的「final words」值得整段記住：

- 計算資源允許時，V-fold 通常比單一驗證集好。
- 5-fold 或 10-fold 通常就夠了，不必為了 LOOCV 付代價。
- 訓練模型是在假說之間選，驗證是在「決賽名單」之間選，測試只負責評估。
- 驗證仍然比測試樂觀。**報告測試結果，不要報告最好的驗證結果。**

## L16：三個學習原則

### Occam's razor：簡單的比較好

投影片把原則寫成：能擬合資料的最簡單模型，也是最可信的模型。接著回答兩個問題。

**什麼叫簡單？** 單一假說 h 簡單，是它看起來簡單、參數少；模型 H 簡單，是它包含的假說少。兩者相連：如果 H 只有 2^ℓ 個假說，每個 h 用 ℓ 個 bit 就能描述。

**為什麼簡單比較好？** 除了前面的數學證明，投影片給了一個哲學論證：H 簡單，成長函數 m_H(N) 就小，隨便一組標籤被完美擬合的機率就低，所以一旦擬合成功，這件事就比較有意義。第 6 頁的 Fun Time 把它算出來：decision stump 在 10 個點上 m_H(N) = 2N = 20，隨機標籤可分的機率是 20/1024。

直接的行動是：先試線性模型，並且隨時問自己資料有沒有被過度建模。

### Sampling bias：課堂要跟考試對得上

投影片用 1948 年美國總統大選開場：報紙依電話民調下了「Dewey Defeats Truman」的標題，結果贏的是 Truman。問題不在編輯，也不在運氣，提示是「當年電話很貴」。

原則是：**資料抽樣有偏差，學出來的結果也會有同樣的偏差。** 技術上的解釋是，資料來自 P₁、測試卻在 P₂ ≠ P₁ 下進行，VC 保證就失效了。VC 理論有一個「小」假設：訓練與測試都從同一個 P 獨立同分布抽出。

接著是林軒田自己的故事。Netflix 競賽要推薦系統改善 10% 才拿得到一百萬美元獎金，他第一次嘗試時 E_val 顯示改善 13%。投影片的自嘲是「那我為什麼還在這裡教書？」原因是他的驗證集是從 D 裡隨機抽的，但測試資料是每位使用者在 D **之後**的最後幾筆紀錄。

經驗法則是：**盡量貼近測試情境**。測試是「之後」的紀錄，訓練時就加重較晚的例子（投影片標註 KDDCup 2011），驗證時也用較晚的紀錄。投影片最後留了一個謎題：用銀行既有紀錄學信用卡核卡，危險在哪裡？

### Data snooping：誠實是最好的策略

原則是：**只要某份資料影響過學習流程的任何一步，它評估結果的能力就被污染了。**

投影片舉了三種窺探：

1. **視覺窺探**：就是 L12 那個看圖挑 Φ 的例子。
2. **只是平移縮放**：8 年匯率資料，前 6 年訓練、後 2 年測試，用前 20 天預測第 21 天。如果用訓練＋測試的全部資料算標準化參數，累積獲利曲線明顯比只用訓練資料算的好看，但這個優勢來自偷看了測試期間的資料。
3. **重複使用資料**：同一份 benchmark 上，第二篇論文讀過第一篇，只有贏過才發表；第三篇再讀前兩篇……如果把所有論文當成同一個作者的一篇大論文，付的是 d_vc(∪H_m) 的代價；而且每一步都「偷看」過前人結果，「贏了才發表」又讓情況更糟。投影片引了一句話：「if you torture the data long enough, it will confess」。

怎麼辦？投影片坦白說，除非極度誠實，否則很難完全避免。由嚴到寬是：把測試資料鎖進保險箱；保留驗證集並謹慎使用；不要依資料做建模決定；以適當的「污染感」解讀研究結果，包括你自己的。他也說，贏 KDDCup 的秘訣之一，就是在資料驅動的建模（窺探）和驗證（不窺探）之間小心取得平衡。

### Power of Three：整門基石收成幾張表

最後一節把整門課用「三」重新整理一遍：

| 三個…… | 內容 |
|---|---|
| 相關領域 | Data Mining、Artificial Intelligence、Statistics |
| 理論 bound | Hoeffding（一個假說，用於測試）、multi-bin Hoeffding（M 個假說，用於驗證）、VC（整個 H，用於訓練） |
| 線性模型 | PLA／pocket（0/1，特殊方法最小化）、線性迴歸（squared，解析解）、邏輯迴歸（CE，迭代最小化） |
| 關鍵工具 | 特徵轉換（E_in 降、d_vc 升）、正則化（d_EFF 降、E_in 升）、驗證（選擇變少、訓練資料變少） |
| 學習原則 | Occam's razor（simple is good）、sampling bias（class matches exam）、data snooping（honesty is best policy） |

第 23 頁「三個未來方向」列的是 More Transform、More Regularization、Less Label，底下散落著 SVM、kernel、AdaBoost、random forest、GBDT、neural network、autoencoder、matrix factorization 等名詞，幾乎就是技法 16 講的目錄。投影片的結語是「ready for the jungle!」。最後一題 Fun Time 則問整門課反覆出現的魔術數字：3 和 1126。

## Fall 2024 HW5 裡練得到的題目

[HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) 在 2024-11-04 發布、11/18 截止，共 12 題加 1 題 bonus。Q1–4 自動批改，Q5–12 由助教批改。跟本篇相關的題目：

| 題號 | 內容 | 對應 |
|---|---|---|
| Q2 | 線性可分資料上、取正負最近點中點當門檻的 decision stump，求 leave-one-out 誤差最緊的上界 | L15 LOOCV |
| Q3 | 題目明寫「In Lecture 16」：5 個點、隨機標籤下 decision stump 最小 E_in 的期望值；附註說 1 減兩倍的期望值就是經驗 Rademacher complexity | L16 Occam's razor |
| Q7 | 前 N − K 筆算平均、後 K 筆驗證，求期望驗證誤差 | L15 驗證 |
| Q8 | 證明常數迴歸的 E_loocv = (N/(N−1))² E_in，說明 E_in 比 E_loocv 樂觀 | L15 LOOCV |
| Q9 | 分類器部署到正負比例不同的測試分布時，何時會和常數分類器一樣差 | L16 測試情境與訓練不同 |
| Q11 | mnist.scale 2 對 6：切 8000 筆 sub-training，用 E_val 選 λ 後在全部訓練資料上重訓，重複 1126 次，與 Q10（用 E_in 選）比較 E_out 分布 | L15 驗證＋重訓 |
| Q12 | 同上，改用 3-fold CV 選 λ，與 Q11 比較 | L15 V-fold |

HW5 的 Q4 已經是技法 T1 的 hard-margin SVM，留給[下一篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)。Q10 的 L1 正則化在[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)。程式題用公開的 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 與 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)，三題共用同一套 λ 候選（log₁₀λ ∈ {−2, …, 3}）與「平手選最大 λ」的規則，所以 Q10–12 最好寫成同一支程式、只換選擇準則。

沒有官方解答時可以這樣自我驗收：Q8 的等式可以先用三個數字手算對照，L15 第 17 頁的 Fun Time（y = 1, 5, 7，答案 14）就是現成的測試案例。

## 自學怎麼做

1. 看第 59 支影片時，把驗證流程的四步寫下來，特別圈出「用全部 D 重訓」。
2. 看第 60–61 支後，用你熟悉的框架（例如 scikit-learn）把 5-fold 和 LOOCV 在同一份小資料上各跑一次，比較時間與估計值的變動。
3. 看第 63–64 支時，拿自己最近的一個專案逐條檢查：驗證集是不是貼近真正的使用情境？標準化參數是不是只用訓練資料算的？
4. 做 HW5 Q10–12，親眼看三種選 λ 方式的 E_out 分布差多少。

今晚可以做的一件事：打開你最近一次模型評估的程式，確認 scaler 或 normalizer 的 `fit` 只呼叫在訓練資料上。如果不是，你剛剛找到一個 data snooping。

## 延伸閱讀

- 同一主題的其他講法：[CS229 講義第 9 章：正規化與模型選擇](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection)
- 基石到此結束。技法從「特徵轉換太貴」這個問題出發，第一站是 [線性 SVM 與對偶 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)
- 作業總覽：[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)
- 其他學校的 ML 入門：[Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning)、[Berkeley CS189](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [機器學習基石／技法 MOOC 頁](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 各講小節標題與投影片下載
- [Lecture 15: Validation（handout）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf) — 模型選擇、E_in／E_test／E_val、K = N/5、LOOCV 無偏性證明、V-fold、final words
- [Lecture 16: Three Learning Principles（handout）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf) — Occam's razor、1948 大選與 Netflix 例子、匯率與論文接力的 snooping、Power of Three
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) — 第 58–65 支
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W8 排程與 LFD 章節
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) — Q2–3、Q7–9、Q11–12
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W8（10/28）排程
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 與 [LIBSVM datasets：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) — HW5 程式題工具與資料
- [Learning from Data（AMLbook）](http://amlbook.com) — 教科書 4.3 節與第 5 章
