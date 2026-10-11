---
title: "林軒田機器學習技法作業與期末專題：Fall 2024 HW6–HW7 與 HTMLB 勝負預測"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, homework, svm, ensemble]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 18
tldr: "Fall 2024 技法段有兩份作業和一個期末專題，題目 PDF 都公開。HW6 練 kernel、soft-margin SVM 與 aggregation，程式題用 LIBSVM 在 mnist.scale 的 3 對 7 子問題上數支援向量、算 margin、跑 128 次 validation。HW7 練 bootstrap、impurity、AdaBoost、gradient boosting 與神經網路，程式題是在 madelon 上實作 500 輪 AdaBoost-Stump。期末專題是虛構的 HTMLB 棒球勝負預測，分兩個 Kaggle stage，交一份最多 7 頁的英文報告，至少比較四種方法。沒有官方解答；Kaggle 競賽頁在 2026-09-30 未登入時回 404，校外讀者大概拿不到 HTMLB 資料，只能照同樣的切分方式換一份公開資料自評。"
description: "台大林軒田 Machine Learning Fall 2024 技法段作業導讀：HW6（kernel perceptron、soft-margin SVM 對偶、one-class SVM、Gaussian kernel、decision stump kernel、mnist.scale 3 vs 7 的 LIBSVM 實驗）、HW7（bootstrap、impurity、AdaBoost 權重、gradient boosting、tanh 神經網路、madelon 上的 AdaBoost-Stump），以及 HTMLB 期末專題的兩個 stage、評分規則、報告要求，附 Kaggle 無法確認時的自評替代做法與 Fall 2026 對照。"
draft: false
glossary:
  - term: "HTMLB"
    aliases: ["Hyper Thrill Machine Learning Baseball"]
    definition: "林軒田 Fall 2024 期末專題虛構的棒球平台，資料是模仿 MLB 歷史比賽分布的假資料，任務是預測主隊輸贏。"
    context: "Fall 2024 final project 的資料來源。"
  - term: "AdaBoost-Stump"
    aliases: ["AdaBoost with decision stumps"]
    definition: "以 decision stump（單一維度、單一門檻的分類器）當基礎演算法的 AdaBoost。每輪依樣本權重挑出加權錯誤最小的 stump，再更新權重。"
    context: "Fall 2024 HW7 Q10–12 的實作題，對應技法 Lecture 208。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 18 篇，也是最後一篇。上一篇[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)處理 HW0–HW5；這篇接著講技法段的 HW6、HW7 和期末專題。

**本文依據**：[Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)（頁尾最後更新 2025-01-17）、[HW6 題目](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)、[HW7 題目](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)、[期末專題說明](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf)，以及 [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)的排程，全部在 2026-09-30 下載或打開核對。題目敘述都從 PDF 讀出；「這題練哪一講」是依題目內容與題目明寫的 Lecture 編號歸類。

這篇不給解答。每題只說它在練什麼、需要哪一篇的內容，以及怎麼自己驗證答案。

## 課程影片來源

未核對到本文專屬的公開講次影片；請從官方課程入口查找錄影與教材。

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [基石 官方免費 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [技法 官方免費 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)

2026-10-10 已即時查過官方 MOOC 頁與兩份播放清單：播放清單只有講課影片，沒有這篇談的作業說明影片（題目是 NTU 課程頁上的 PDF）。

查核日期：2026-10-10。

## 存取等級與缺口

依[全球 AI/CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，MOOC 加上 Fall 2024 作業 PDF 是 **A3，但評分鏈除外**。拿得到的東西和拿不到的東西如下：

| 項目 | 校外能拿到嗎 | 說明 |
|---|---|---|
| HW6、HW7、final 題目 PDF | 可以 | 課程頁的 `hw6/`、`hw7/`、`final/` 子頁直接下載 |
| HW6 資料 `mnist.scale` | 可以 | [LIBSVM datasets](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/) 公開檔案 |
| HW7 資料 `madelon`、`madelon.t` | 可以 | 同上，binary 分類區 |
| 官方解答 | 沒有 | 課程頁與作業子頁都沒有掛解答 |
| Gradescope 自動批改、助教批改 | 沒有 | 限修課生 |
| HTMLB 資料與 Kaggle 排行榜 | 未確認，大概沒有 | 兩個競賽頁在 2026-09-30 未登入時都回 404；PDF 寫明要從課程公告的連結報名後，競賽連結才會生效 |

## 作業格式

HW6、HW7 的格式和基石段一樣：

- 每份 200 分加 20 分 bonus。Q1–4 是選擇題，自動批改，每題 10 分；Q5–12 人工批改，每題 20 分；Q13 是 bonus。
- 實驗性的「clarity bonus」：助教認為答案正確又特別清楚時，每道人工批改題最多再加 2 分。
- 答案要用英文寫，程式語言與平台不限，掃描或列印後上傳 Gradescope。
- 可以討論，但最後要自己寫；借出或借入解答都算違反誠信規定。

Fall 2024 課程頁的評分是 70% 作業、30% 專題（tentative），授課語言標示為英文。

## HW6：kernel、soft-margin SVM 與 aggregation

HW6 在 2024-11-18 發布，12-02 截止，11-22 另外發了紅字修正版（檔名 `hw6_red.pdf`）。發布那週上課進度是 AdaBoost、決策樹、隨機森林與 GBDT，但題目主要練的是前幾週的 [kernel 與軟邊界 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)，外加一點 [blending](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)。

### 選擇題與證明題

| 題 | 在練什麼 | 先讀 |
|---|---|---|
| Q1 | 把 PLA 的 w 寫成 Σ αₙΦ(xₙ)，問 α 怎麼更新（kernel perceptron） | [第 9 篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)、[第 10 篇](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm) |
| Q2 | 所有點都是 bounded SV（αₙ = C）時，b 有多個解，求最小的 b | 第 10 篇 |
| Q3 | squared hinge loss 版 soft-margin SVM 的對偶解，怎麼從 α 算回 ξ | 第 10 篇 |
| Q4 | 5 個錯誤互相獨立、E_out 都是 0.25 的分類器做 uniform blending，G 的 E_out（題目指向 Lecture 207 第 7 頁） | [第 12 篇](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost) |
| Q5 | 「Dr. Threshold」忘了把 b 分開，把常數 1 塞進 x 去解 soft-margin SVM，證明或否證解還是一樣 | 第 9、10 篇 |
| Q6 | 用原點當一個硬性負例，把 soft-margin SVM 改成 one-class 異常偵測，推出 QP 形式的對偶 | 第 9、10 篇 |
| Q7 | Gaussian kernel 的 γ 夠大時，α 全 1、b = 0 的分類器就能讓 E_in = 0 | 第 10 篇 |
| Q8 | 證明 exp(2cos(x − x′) − 2) 是合法 kernel | 第 10 篇 |
| Q9 | 用 decision stump 當特徵轉換，算出對應的 kernel 並證明 | 第 10、12 篇 |
| Q13（bonus） | 推 soft-margin SVM 對偶問題的對偶，和原始問題比較；題目附上 chatGPT 的回答供參考 | 第 9 篇 |

Q9 的提示連到林軒田早年的論文 [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf)，裡面談怎麼用 perceptron 和決策樹構造 kernel。想知道「aggregation 和 SVM 能不能合在一起」的讀者可以接著讀。

**自己驗證的方法**：

- Q1：寫一個 kernel perceptron，和一般 PLA 在同一份資料上逐步比對，確認每一步 Σ αₙΦ(xₙ) 和 w 相同。
- Q4：用亂數模擬 5 個獨立出錯的分類器做多數決，跑幾十萬次看錯誤率，對照選項。
- Q8、Q9：隨機抽一批點算出 kernel 矩陣，檢查特徵值都不小於 0。這只是數值上的檢查，不能取代證明。

### 程式題：mnist.scale 的 3 對 7

Q10–12 用 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)，只取一對一拆解裡「class 3 vs class 7」這個子問題。題目建議用 [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)，因為有些 QP 套件處理不了這麼大的問題。題目特別提醒兩件事：

1. 要讓套件**不要**自動縮放資料，否則等於換了 kernel。
2. 自己確認套件解的就是課堂上的 soft-margin 對偶問題，而且數值精度夠。讀手冊、找出影響結果的參數，是題目明說的一部分工作。

| 題 | 設定 | 要交什麼 |
|---|---|---|
| Q10 | 多項式 kernel (1 + xₙᵀxₘ)^Q，C ∈ {0.1, 1, 10}、Q ∈ {2, 3, 4} | 9 組支援向量個數的表格，指出哪組最少，描述觀察 |
| Q11 | Gaussian kernel，C ∈ {0.1, 1, 10}、γ ∈ {0.1, 1, 10} | 9 組 margin 1/‖w‖ 的表格，指出哪組最大 |
| Q12 | C = 1，每次隨機抽 200 筆當 validation，在 γ ∈ {0.01, 0.1, 1, 10, 100} 裡依 0/1 E_val 選 γ（平手取小的），重複 128 次 | γ 被選中次數的長條圖與觀察 |

三題都要附程式或指令第一頁的截圖。

Q11 的 margin 沒辦法直接從 w 算，因為 Gaussian kernel 的 Φ 是無限維。要從對偶解回推：‖w‖² = ΣₙΣₘ αₙαₘyₙyₘK(xₙ, xₘ)，這正是[第 10 篇](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)的 kernel trick。Q12 的 validation 概念在[第 8 篇](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)。

**自己驗證的方法**：同一組參數用 LIBSVM 和 scikit-learn 的 `SVC` 各跑一次（`SVC` 底層也是 LIBSVM），比對支援向量數與對偶係數。兩邊對不上，通常是 γ 的定義、資料縮放或停止條件不同。

## HW7：bootstrap、樹、boosting 與神經網路

HW7 在 2024-12-02 發布，12-16 截止，涵蓋 [blending 與 bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)、[決策樹、隨機森林與 GBDT](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)，以及[神經網路](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)。

### 選擇題與證明題

| 題 | 在練什麼 | 先讀 |
|---|---|---|
| Q1 | N = 1126 做 bootstrap，抽多少筆時「至少有一筆重複」的機率超過 70% | 第 12 篇 |
| Q2 | 把幾種 impurity 函數正規化後，哪一個和 Gini index 相同 | 第 13 篇 |
| Q3 | 87% 是負例、第一輪 g₁ 是常數 −1 時，第二輪正負例權重的比值（Lecture 208 第 17 頁的 AdaBoost） | 第 12 篇 |
| Q4 | 20 個輸入單元（含常數項 x₀）、3 個輸出、50 個隱藏單元任意分層，權重數最多是多少 | 第 14 篇 |
| Q5 | 2M+1 個分類器做 uniform voting，用各自的 E_out 推 G 的 E_out 最緊上界 | 第 12 篇 |
| Q6 | 證明 AdaBoost 權重總和 U_{t+1}/U_t = 2√(εₜ(1 − εₜ))；提示說這是證明 AdaBoost 在 O(log N) 輪內收斂的骨幹 | 第 12、13 篇（Lecture 208、211） |
| Q7 | gradient boosting 換成搭配線性迴歸時，最佳 α₁ 是否等於 1 | 第 13 篇 |
| Q8 | GBDT 用最陡步長更新後，Σ(yₙ − sₙ)gₜ(xₙ) = 0 | 第 13 篇 |
| Q9 | 一層隱藏層、全用 tanh 的網路，初始權重全設 0.5 時，第一層權重會一直對稱 | 第 14 篇 |
| Q13（bonus） | 題目附上一段 chatGPT 回答，聲稱 d-(d−1)-1 的 sign 網路能實作 d 維 XOR；要找出它和 2023 年秋季 bonus 題的分歧點，並證明不可能 | 第 14 篇 |

**自己驗證的方法**：

- Q1：這是生日問題的變形。寫幾行程式模擬 bootstrap，或直接算 1 − Π(1 − k/N)，對照選項。
- Q3、Q6：寫一個最小的 AdaBoost，印出每輪的 uₙ 總和，和公式比對。
- Q8：在任一回歸資料上跑一輪 GBDT，印出殘差向量和 gₜ 輸出的內積，應該接近 0。
- Q9：用 NumPy 寫一個小網路，權重全設 0.5，訓練幾步後看同一層的權重是否仍然相等。這一題的數值結果也能順便說明為什麼實務上要隨機初始化。

### 程式題：madelon 上的 AdaBoost-Stump

Q10–12 要自己實作 Lecture 208 的 AdaBoost-Stump，訓練集是 [madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon)，測試集是 [madelon.t](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon.t)。固定跑 T = 500 輪，不能提早停。

decision stump 要沿用 HW2 自己寫的版本，擴充成多維、能吃樣本權重的形式（題目指向 HW2 Problem 13）。題目建議的最簡單做法：每一維用加權 E_in 找最好的 stump，再從所有維度裡挑「best of the best」。HW2 的內容在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

| 題 | 畫什麼 |
|---|---|
| Q10 | 每個 gₜ 的 E_in（0/1）和 εₜ（正規化的加權 E_in）對 t 的曲線，畫在同一張圖；要附 AdaBoost-Stump 程式第一頁截圖 |
| Q11 | 累積分類器 Gₜ 的 E_in 和 E_out 對 t 的曲線 |
| Q12 | Q6 定義的 Uₜ 和 E_in(Gₜ) 對 t 的曲線 |

Q12 是把 Q6 的證明拿到真實資料上看：如果 Uₜ 照理論下降，E_in(Gₜ) 應該跟著被壓低。

**自己驗證的方法**：scikit-learn 的 `AdaBoostClassifier` 搭配 `DecisionTreeClassifier(max_depth=1)` 可以當對照組，但它的權重更新細節和課堂版本不一定相同，曲線趨勢可以比，數字不要硬對。更可靠的檢查是：每一輪挑出的 stump，εₜ 都應該小於 0.5；更新權重後，上一輪的 gₜ 在新權重下的錯誤率應該剛好是 0.5，這是 AdaBoost 的設計目標。

## 期末專題：HTMLB 勝負預測

期末專題在 2024-10-16 發布，報告在 2024-12-23 13:00 截止。它佔 800 分，等於 4 份作業，其中至少 720 分給報告，其餘 80 分可能看競賽成績、分工等次要項目。

### 任務與資料

設定是：你在一間「Game Prediction Company」上班，公司沒拿到 MLB 或 Fantasy Baseball 的授權，於是自己架了一個虛構平台「Hyper Thrill Machine Learning Baseball」（HTMLB）收集資料。資料是假的，但 PDF 說它已驗證和 MLB 歷史比賽資料有某些分布上的相似性。任務是預測**主隊會不會贏**，二元分類，用 0/1 error 評分。

| | 訓練資料 | 要預測的 |
|---|---|---|
| Stage 1 | 2016–2023 年，每年 1–7 月 | 同樣 2016–2023 年的 8–12 月 |
| Stage 2 | 同上 | 2024 年全部比賽 |

這兩個 stage 的差別本身就是一道題：stage 1 是同一年的後半季，stage 2 是完全沒看過的新年份。報告要比較的面向之一，正是方法在兩個 stage 之間穩不穩定。

禁止使用任何外部資料，包括 MLB 與 Fantasy Baseball 的資料；訓練與測試只能用給定的資料。

### 競賽規則

- 在 Kaggle 上進行，一隊最多 4 人，預設就是 4 人；少於 4 人的隊伍要「願意做得和 4 人隊一樣好」。
- 每隊每個 stage 每天最多 5 次上傳。成績先用約 50% 的測試集（public）顯示，截止前每個 stage 要選 2 份最終上傳，比賽結束後用另外 50%（private）評分。
- 上傳截止是 2024-12-15 23:59（UTC+8），趕上 12-16 的頒獎典禮；上傳站開到報告截止。
- 隊伍報名截止 2024-10-28，要填表並從 NTU COOL 公告裡的連結加入競賽（不是 PDF 上的連結）。
- 原始碼不用交，但要保留到 2025-01-31，助教可能要求現場示範訓練與上傳流程。

### 報告要求

報告是這個專題最重的部分，PDF 自己也這麼說：

- 至少研究**四種**機器學習方法，從準確度、兩個 stage 間的穩定性、效率、可擴展性、可解釋性等角度比較。
- 最後推薦**一個**最好的方法，寫出它的優缺點。
- 最多 7 頁 A4，英文撰寫。
- 最重要的評分標準是**可重現性**：要寫清楚前處理、建了哪些特徵、用了哪些方法（課堂沒教的要附參考文獻）、實驗設定與參數。
- 其他標準包括清晰度、推理強度、機器學習技巧用得對不對、組員工作量與引用。多人隊伍一定要寫怎麼分配工作。
- 讀者設定是公司高層，不一定都有資工背景。PDF 建議把助教當成要被說服的老闆。

演算法與套件都不限，課堂沒教的也可以用，只要在報告裡附上引用。

### 沒有 Kaggle 時怎麼自學

HTMLB 資料只放在 Kaggle，而競賽頁校外打不開，所以校外讀者很可能拿不到原題資料。專題的精神還是可以照做：

1. **換一份有時間戳記的公開二元分類資料**。LIBSVM datasets 或其他公開來源都可以，重點是資料要能照時間切。
2. **照 HTMLB 的方式切三份**。每年前段當訓練；同一年後段當「stage 1 驗證集」；最新的一整年完全留著當「stage 2 測試集」，最後才打開一次。
3. **模仿 public/private 切分**。把 stage 2 測試集再隨機對半，調參時只看其中一半，最後才看另一半，體會一下在 public 分數上過擬合是什麼感覺。
4. **至少比四種方法**，而且盡量橫跨技法三段：例如一個 kernel SVM、一個 AdaBoost 或 GBDT、一個隨機森林、一個神經網路，再加一個基石段的線性模型當 baseline。
5. **照 PDF 的規格寫報告**：7 頁以內、英文、先講可重現性，最後推薦一個方法並列優缺點。

少了排行榜，你沒辦法知道自己在修課生裡排第幾，但報告佔了至少 720/800 分，排行榜本來就不是重點。

## Fall 2026 對照

[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 正在進行，今天是第 4 週，技法段的作業與期末專題都還沒公布。課程頁排程如下（期末專題的兩個日期都標 tentative）：

| 項目 | 排程 |
|---|---|
| hw6（最後一份） | 12-02 公布，12-23 截止 |
| 期末考 | 12-09 |
| 期末專題 | 10-14 公布，12-30 截止 |

Fall 2026 的評分改成 30% 作業、30% 考試、40% 專題（tentative），授課語言是中文，和 Fall 2024 不同。題目內容還不能寫；等 2027 年 1 月結課後，這篇會再核對一次，決定作業基準要不要換成 Fall 2026。

## 延伸閱讀

- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：Abu-Mostafa 用同一本教科書開的英文課，有自己的作業集。
- 站內 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：SVM、kernel 與 boosting 的另一種講法。

系列導覽：上一篇 [基石作業導讀：Fall 2024 HW0–HW5](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)｜本篇是系列最後一篇，回到 [系列總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方播放清單只有講課影片，沒有作業說明影片，狀態不變。

## 參考資料

- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — 公告、每週進度與評分比例
- [Fall 2024 Homework 6（hw6_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Fall 2024 Final Project（final.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 技法 16 講的投影片與影片
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [LIBSVM datasets：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)
- [LIBSVM datasets：madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon) 與 [madelon.t](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon.t)
- [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf) — HW6 Q9 提示連到的論文
- [HTMLB Stage 1 Kaggle 競賽頁](https://www.kaggle.com/competitions/html-2024-fall-final-project-stage-1)（2026-09-30 未登入時回 404）
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
