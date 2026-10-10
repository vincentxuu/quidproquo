---
title: "CS189 Spring 2026 HW2 導讀：Chatbot Arena 論文題、回歸、MLE/MAP、GMM 到 flow matching"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, homework, linear-regression, generative-models]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 10
tldr: "HW2 是一份純書面作業，共 10 題。前半練讀論文（Chatbot Arena）和回歸、MLE/MAP 的基本推導，後半兩大題最重：Mixed Feelings 從 k-means 對離群值的脆弱一路推到 robust k-means 和加了均勻背景的 GMM；Watch Me Flow Dat 證明 conditional flow matching 和離散化後的 MLE 是同一個目標。題目 PDF 和 LaTeX 範本都能匿名下載，沒有官方解答。"
description: "Berkeley CS189 Spring 2026 Homework 2 導讀：十題的結構與配分、每題需要的講次、Chatbot Arena 論文題的讀法、robust k-means 與 flow matching 兩大題的主線，以及校外讀者能做到哪裡。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）的公開教材。系列入口是 [Berkeley CS189 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)。

Homework 2 在排程上和 Lec 11 同一天（2/24）發布，截止時間是 **3/13（週五）晚上 11:59 PT**，也就是期中考前四天。它涵蓋的範圍比講次進度更廣：前面幾題複習線性回歸和 MLE/MAP，後面兩大題則把 GMM 往前推到 robust clustering 和 flow matching 這種生成模型。

這篇只講每題在考什麼、需要回頭看哪一講、哪裡容易卡住。**不附任何答案。** HW1–4 沒有公開的官方解答，而且 [Syllabus](https://eecs189.org/sp26/syllabus/) 的 GenAI 政策明文禁止把作業題目貼進 GenAI 工具，修課學生請不要把這篇當成解答來源。

## 課程影片來源

未核對到本文專屬的公開講次影片；請從官方課程入口查找錄影與教材。

課程與錄影入口：

- [官方課程與錄影入口](https://eecs189.org/sp26/)

## 官方材料與讀取範圍

排程上 HW2 的 Assignment 連到一個 [Drive 資料夾](https://drive.google.com/drive/folders/1DfylGxAbv2yfybYhAmSa2b4m8dPjLMBm)，裡面只有兩個檔案：

| 檔案 | 內容 | 我能不能讀 |
|---|---|---|
| `hw2.pdf` | 20 頁題目 | 能，已讀全文 |
| `hw2_student.tex` | 作答用的 LaTeX 範本，題目文字和 PDF 相同 | 能，已讀全文 |

繳交方式是把整份 PDF 上傳到 Gradescope 的「HW2 Write-Up」，每題從新的一頁開始。HW2 沒有 notebook 或 coding 部分。Syllabus 說每份作業分成 Part 1 Warmup 和 Part 2 Main，但 HW2 的資料夾裡看不出這種分拆。

依本站 [A0–A3 分級](/posts/learning/2026-08-21-global-ai-cs-course-map)，題目本身是完整公開的，校外讀者能從頭寫到尾。拿不到的是官方解答、Gradescope 評分和 Ed 上的討論。

## 十題一覽

| # | 題目（原標題） | 配分 | 在練什麼 | 回頭看 |
|---|---|---|---|---|
| 1 | Paper Questions | 未標 | 讀 [Chatbot Arena](https://arxiv.org/abs/2403.04132) 論文，回答問題、現有做法、輸入輸出、Bradley–Terry、限制 | Lec 14 後段 |
| 2 | Sum of Residuals | 6 | 用正規方程證明 `Xᵀr = 0`、有偏差項時殘差和為 0、離群值對最小平方的影響 | Lec 7–10 |
| 3 | Weighted Linear Regression | 10 | 加權最小平方寫成矩陣形式、求梯度與閉式解、`XᵀAX` 何時可逆 | Lec 8–10 |
| 4 | MLE vs MAP | 16 | 擲硬幣，Beta(3, 3) 先驗：likelihood、MLE、後驗仍是 Beta、MAP | Lec 14 |
| 5 | Estimating the Population of Grizzly Bears | 11 | 捉放法：寫出族群數 N 的 likelihood，用 likelihood ratio 求 MLE | Lec 5、14 |
| 6 | One Dimensional Mixture of Two Gaussians | 6 | 一維雙高斯混合的聯合與邊際 likelihood，說明為什麼難優化 | Lec 5–7 |
| 7 | A Bayesian Interpretation of Lasso | 8 | 權重放 Laplace 先驗，證明 MAP 等於 ℓ1 正則化，並寫出 λ | Lec 14 |
| 8 | ℓ1-regularization, ℓ2-regularization, and Sparsity | 18 | 在 `XᵀX = nI` 假設下，推導 ℓ1 和 ℓ2 解的每個分量何時為 0，比較誰比較稀疏 | Lec 9–10 |
| 9 | Mixed Feelings | 42 | 廣義 k-means、二次懲罰的崩潰、robust k-means、加均勻背景的 GMM | Lec 4–7 |
| 10 | Watch Me Flow Dat | 25 | flow matching：邊際向量場、CFM 目標的等價性、離散流的 MLE | Lec 5、14 |

配分是從 `hw2_student.tex` 每個小題標的分數加總出來的。第 1 題沒有標分數。

## 第 1 題：Chatbot Arena 論文題

作業開宗明義說，這題考的是「有條理地讀論文」，不是背細節。多數論文的結構都是：提出問題、現有做法和限制、提出的方法和洞見、方法細節、限制。題目就照這個順序出了 a–f 六小題，每題都附了「去看哪一節」的提示：

- **a. 問題**：Chatbot Arena 想解決什麼？為什麼評估生成模型比評估分類器難？（Introduction）
- **b. 現有做法**：論文把 LLM benchmark 分成哪幾類，各有什麼限制？（Related Works）
- **c. 輸入與輸出**：提示是輸出分成「每場對戰」和「彙整後」兩層。
- **d. 關鍵洞見與貢獻**：可以是方法、軟體、問題的形式化、資料集等。
- **e. 方法細節**：什麼是 Bradley–Terry 係數、Arena 怎麼用它計分；以及論文第 4 節為什麼說 Bradley–Terry 比原本的 Elo 更適合統計估計。提示是 Elo 是逐場更新的線上指標，Bradley–Terry 則一次擬合所有對戰結果；題目另外附了 [Bertrand et al.](https://arxiv.org/abs/2206.12301) 關於 Elo 無法抓到遞移結構的論文。
- **f. 限制**：Chatbot Arena 本身，以及人類偏好評測普遍的限制。（Discussion）

這題的讀法 [Lec 14](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy) 後段已經先示範過，包括「前四題通常在 introduction 就找得到」和「Bradley–Terry 本質上是 logistic regression」。先看那幾頁再動筆，會快很多。

題目後面附了一頁「Other Practical Resources」，推薦 Kaggle 的入門競賽 Titanic，以及 LMSYS Chatbot Arena、WSDM Cup Multilingual Chatbot Arena、LLM Detect AI-Generated Text、LLM Classification and Fine-Tuning 四個相關競賽。這頁不計分。

## 第 2–8 題：回歸與 MLE/MAP 的基本功

這七題都是短推導，重點是把前幾週的概念寫得乾淨。可以分成三組：

- **最小平方的性質（第 2、3 題）**：第 2 題的第三小題不是計算，而是要你定性預測一個 y 極大、x 靠近平均的點會怎樣拉動 w，並提出更抗離群值的損失。第 3 題的最後一小題問 `XᵀAX` 何時保證可逆，以及所有權重都大於 0 時條件能不能化簡。
- **貝氏估計（第 4、5、7 題）**：第 4 題是標準的 Beta–Bernoulli 共軛，最後要你用一句話講出 MLE 和 MAP 的差別，而且題目明說只列出前面的答案不算數。第 5 題的族群數 N 是整數，題目提示微分不好用，改看相鄰兩個 N 的 likelihood 比值。第 7 題和 Lec 14 的「高斯先驗 → ridge」是平行結構，只是把先驗換成 Laplace。
- **稀疏性（第 8 題）**：18 分，是這組最重的一題。先把 ℓ1 目標拆成每個維度各自獨立的一項，再分三種情況（分量大於 0、等於 0、小於 0）推導充要條件，最後和 ℓ2 比較。寫完你會知道「ℓ1 會產生稀疏解」這句話背後的條件長什麼樣子。

第 6 題只有 6 分，但它是第 9 題最後一段的伏筆：它要你說明混合模型的 log-likelihood 為什麼難優化，也就是 log 裡面有一個加總。

## 第 9 題 Mixed Feelings：k-means 為什麼怕離群值

這題 42 分，是整份作業最重的一題，靈感來自 NeurIPS 2016 的論文 [Robust k-means: a Theoretical Revisit](https://proceedings.neurips.cc/paper_files/paper/2016/file/80a8155eb153025ea1d513d0b2c4b675-Paper.pdf)。它先把 k-means 推廣成「廣義 k-means」：每個點到最近中心的距離，經過一個懲罰函數 φ 再加總，`φ(t) = t²` 時就回到課堂上的 k-means。接下來分三段：

1. **二次懲罰的崩潰**（a、b，12 分）：資料是高斯內點混上一部分 Cauchy 重尾離群值，要你證明對任何中心位置，期望風險都發散。接著把 Cauchy 換成放在距離 M 處的一個點質量，求最佳中心。題目註明，M → ∞ 時中心會被無限拉走。
2. **Robust k-means**（c–e，23 分）：允許每個點帶一個誤差項，目標變成只對「內點」計算加權平方誤差，限制內點總機率質量恰好是 1 − α。你要寫出 Lagrangian、逐點優化、求最佳中心，最後在兩個重疊高斯的一維情形下證明：硬邊界會把中心推離真實平均，偏差嚴格為正。
3. **加均勻背景的 GMM**（f、g，7 分）：在兩個共用共變異數的高斯之外，加一個均勻分布當離群值成分。要你寫出後驗責任值 γ₁(x)，並證明點沿任一方向跑到無窮遠時 γ₁(x) → 0，說明均勻項如何穩住分母。

這題的主線是「從幾何的 k-means 走到機率的 GMM」，和 [Lec 4–7](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm) 的順序一致。Lagrangian 的部分題目直接附了維基百科的 Lagrange multiplier 條目，不熟的話可以先看 Bishop Appendix C。

## 第 10 題 Watch Me Flow Dat：flow matching 其實是 MLE

這題 25 分，靈感來自 ICLR 2023 的 [Flow Matching for Generative Modeling](https://openreview.net/pdf?id=PqvMRDCJT9t)，並推薦 [A Visual Dive into Conditional Flow Matching](https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching/) 當圖解入門（不讀也能寫）。

設定是：想把標準高斯（t = 0）搬成資料分布（t = 1），用一個隨時間變化的向量場 `v_t(x)` 描述每個點的速度，沿著 ODE 積分就從雜訊走到資料。真正的邊際向量場算不出來，所以改用從 `x_0` 到 `x_1` 的直線路徑，它的條件向量場是 `u_t(x|x_1) = (x_1 − x)/(1 − t)`，題目說可以把它想成「斜率」。題目分三段：

1. **The Marginal Field**（a、b）：寫出 v 和條件向量場之間的期望平方誤差，對 v 取梯度，證明讓它最小的 v* 恰好就是邊際向量場的定義。
2. **Equivalent Objectives**（c，7 分）：證明 Conditional Flow Matching 目標等於邊際目標加上一個和參數無關的常數，所以優化前者就等於優化後者。
3. **MLE on Discrete Flows**（d–f）：把時間切成 T 步，用高斯轉移機率建一個 Markov chain。寫出 log-likelihood，證明最大化它等於最小化「模型速度」與「離散經驗速度」的平方距離，最後代入直線路徑，證明它恰好回到 CFM 目標。

這題把 Lec 14 的觀念推得最遠：「高斯雜訊下的 MLE 等於平方誤差」這件事，不只適用於線性回歸，也適用於一個現代的生成模型。

## Fall 2026 對應

[Fall 2026](https://eecs189.org/fa26/) 的排程在 9/25（週五）列出 Homework 2、10/9 列出 Homework 2 due，但首頁上沒有公開的作業連結，所以無法確認題目是否相同。講次對應上，Fall 2026 的線性回歸、bias-variance、logistic regression 在 Lecture 6–9，GMM 在 Lecture 5。

## 延伸閱讀

- 機率前置：[Stanford CS109 Beta 分布](/posts/learning/2026-08-22-stanford-cs109-lecture-14-beta-distribution)、[最大概似估計](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation)
- 經典 ML 對照：[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

上一篇：[Lec 14、16：MLE vs MAP、bias-variance、熵與 KL](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy)。下一篇：[Lec 17–18：神經網路與反向傳播](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-17-18-neural-networks-backprop)。

## 今晚可以做的動作

1. 下載 `hw2_student.tex`，先寫第 4 題 MLE vs MAP，確認你能把後驗整理回 Beta 分布的形式。
2. 打開 Chatbot Arena 論文，只讀 introduction，試著用自己的話回答第 1 題的 a 到 d。
3. 動第 9 題前，先用 NumPy 做個小實驗：從高斯加 5% Cauchy 抽樣，跑 k = 1 的 k-means，看中心會不會亂跳。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS189 Spring 2026 課程首頁與排程](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Syllabus（作業形式、GenAI 政策）](https://eecs189.org/sp26/syllabus/)
- [HW2 Drive 資料夾（hw2.pdf、hw2_student.tex）](https://drive.google.com/drive/folders/1DfylGxAbv2yfybYhAmSa2b4m8dPjLMBm)
- [Chiang et al., Chatbot Arena（arXiv:2403.04132）](https://arxiv.org/abs/2403.04132)
- [Bertrand et al., On the Limitations of Elo（arXiv:2206.12301）](https://arxiv.org/abs/2206.12301)
- [Robust k-means: a Theoretical Revisit（NeurIPS 2016）](https://proceedings.neurips.cc/paper_files/paper/2016/file/80a8155eb153025ea1d513d0b2c4b675-Paper.pdf)
- [Lipman et al., Flow Matching for Generative Modeling（ICLR 2023）](https://openreview.net/pdf?id=PqvMRDCJT9t)
- [A Visual Dive into Conditional Flow Matching](https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching/)
- [CS189 Fall 2026 排程](https://eecs189.org/fa26/)
