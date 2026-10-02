---
title: "Berkeley CS189 Spring 2025 總覽：用 HW1–7 與 code/data 走完的機器學習，用 Fall 2026 看下一學期"
date: 2026-08-22
category: learning
tags: [berkeley, cs189, machine-learning, open-course, learning-path]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 1
tldr: "CS189 在網路上有好幾個學期的版本。本系列從第 2 篇起以 Spring 2026（eecs189.org/sp26，A3）為底本，逐講、逐份作業導讀；Spring 2025（Shewchuk）是另一條經典路線，公開 25 講 notes、HW1–7 與歷屆考題，但正式錄影在 bCourses 要登入；Fall 2026 還在進行中，只拿來對照。本篇是系列入口與全系列目錄。"
description: "Berkeley CS189 系列入口：Spring 2025／Spring 2026／Fall 2026 三個版本的公開程度、先修、Spring 2025 的 25 講與 HW1–7 課序，以及本系列 18 篇的目錄。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en)

[Berkeley CS189 Introduction to Machine Learning](https://people.eecs.berkeley.edu/~jrs/189s25/) 是 Berkeley 的數學型機器學習入口，不接在 [CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/) 之後，而是與它平行。[Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)已把兩門課定位為「搜尋／推理」與「統計學習」兩個入口；這篇把 CS189 的自學可行性補到可執行。

核心結論：**想跟著本系列逐講自學，走 [Spring 2026](https://eecs189.org/sp26/)；想走 SVM、決策樹、PCA、boosting 的經典路線，走 Spring 2025；想看下一學期長什麼樣，看 [Fall 2026](https://eecs189.org/fa26)。** Spring 2026 公開講義、25 支講課影片、附解答的 discussion 與 HW1–5 題目，本系列從第 2 篇起以它為底本（版本比較見 [CS189 有三個版本](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)）。Spring 2025 在 `people.eecs.berkeley.edu/~jrs/189s25/` 保留 25 講 lecture notes、HW1–7、code/data 與歷屆考題（本站判 [A3](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map)），正式錄影則放在 bCourses，要登入。Fall 2026 剛在 `eecs189.org/fa26` 公布 27 講行事曆（`Lec01 Introduction + ML Problem Framing` 到 `Lec27 Closing`），但講義與作業多數尚未開放，泛用網址 `eecs189.org` 本身也會隨學期重導向，舊檔有輪替後 404 的前例。

## 公開到什麼程度

依本站 A0–A3 標準：

| 版本 | 等級 | 匿名拿得到什麼 | 主要缺口 |
|---|---|---|---|
| **CS189 Spring 2026** (`eecs189.org/sp26`) | **A3（本系列底本）** | 27 講排程、講義 PDF／Notes、官方站連結的 25 支講課影片、Discussion 1–12 題目＋解答＋walkthrough、HW1–5 題目（HW5 附解答）、期中考與解答 | Gradescope、hidden tests、Ed；HW1–4 解答；期末考；Lec 1 錄影 |
| **CS189 Spring 2025** (`~jrs/189s25`) | **A3（另一條路線）** | 25 講 lecture notes、整本 `machlearn.pdf`、HW1–7、code/data（HW4 資料放 Kaggle）、歷屆考題、完整 syllabus | 正式錄影在 bCourses 要登入，公開的只有 screen-only 備份錄影；當期 Gradescope、Ed 與隱藏測試 |
| **CS189 Fall 2026** (`eecs189.org/fa26`) | **A1→A2** | syllabus、27 講行事曆（Week 1–16）、部分 lecture 連結 | 講義／錄影／HW starter 多數尚未發布；需等學期推進 |

兩個 A3 版本能過關的關鍵都是「練習鏈完整」：有題目、有可本機執行的 code/data、有歷屆考題可自我檢測。Fall 2026 的價值目前在「看結構」：從 [Fall 2026 Schedule](https://eecs189.org/fa26/#schedule) 可看到完整路徑 `Data Tools / K-Means / KNN → Density Estimation / GMM → Linear Regression / Bias-Variance → Logistic Regression → Gradient Descent → Neural Networks → CNN / Transformers / LLM → Attention / MDP / RL → Post-training / Diffusion → Closing`，與傳統 [ESL](https://hastie.su.domains/ElemStatLearn/) 與校內 ML 主幹一致，但不宜把它當成已開放的自學包。

## 開始前要會什麼

官方先修是多變量微積分、線性代數與 [CS70](https://fa25.eecs70.org/)（或教師同意）。對校外讀者的可操作檢查：

1. 線代：矩陣乘法、特徵值、SVD 的幾何意義；能讀懂最小平方法與 ridge 的正規方程。
2. 機率：條件機率、期望值、MLE／MAP、bias-variance 拆解。
3. 實作：Python + NumPy 能完成向量化實作與梯度檢查；不熟就先回 [CS61B Fall 2025](https://fa25.datastructur.es/) 補資料結構與測試習慣。

CS189 不要求 CS61B 的課號，但 HW 的 code 會假設你會寫可重現的實驗、會切 train/validation、會看 learning curve。缺這塊會比缺一條先修課號更卡。

## Spring 2025 的課序與 HW1–7

Spring 2025 是 Jonathan Shewchuk 的版本，課序和 Spring 2026／Fall 2026 不一樣。依 [189s25 課程頁](https://people.eecs.berkeley.edu/~jrs/189s25/)的講次標題，25 講大致分成五段：

1. **線性分類器（Lec 1–5）**：分類與 train/validation/test、perceptron、gradient descent 與 SGD、hard/soft-margin SVM、ML 的抽象層次與最佳化問題類型。
2. **決策理論與高斯模型（Lec 6–9）**：Bayes decision rule、生成式與判別式模型、GDA（QDA／LDA）與 MLE、特徵分解與非等向高斯。
3. **回歸（Lec 10–13）**：least squares、logistic regression 與 Newton 法、ROC、回歸的統計論證、ridge 與 MAP。
4. **樹與神經網路（Lec 14–19、22–23）**：決策樹、bagging 與隨機森林、backpropagation、vanishing gradient 與 ReLU、CNN，後段再補 data augmentation、正則化、batch normalization、ResNet 與 AdamW。
5. **非監督與近鄰（Lec 20–21、24–25）**：PCA、SVD、k-means 與階層式聚類、AdaBoost、kNN 與 k-d tree。

HW1–7 的截止日依序是 1/29、2/12、2/26、3/12、4/3、4/25、5/7。課程頁只列每份作業的檔案與截止日，沒有逐份標主題，所以這裡不替各份 HW 貼主題標籤；要知道某份在練什麼，直接打開該份的 written part PDF。每份都有題目與可本機執行的 code/data，校外讀者缺的是 Gradescope hidden tests 與助教回饋，可以改用歷屆考題和自己切的 validation 曲線驗收。

SVM、決策樹／隨機森林、PCA／SVD、boosting、k-d tree 這些主題只有 Spring 2025 講，本系列以 Spring 2026 為底本時，遇到這些主題會指回這裡。

## 為什麼不直接追 Fall 2026

`eecs189.org` 是輪替站，根網域已 `302` 到 `/fa26`，舊學期頁面可能在切換後失效（[Berkeley 課程地圖](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)已有 `404` 紀錄）。Fall 2026 目前僅行事曆完整，講義與 HW 多數標 `TBD`，硬追會變成「看課表自學」。可行的策略是：以已經結束、教材齊全的 Spring 2026 建主幹（本系列第 2–18 篇），把 Fall 2026 的 27 講順序當對照，Spring 2025 用來補經典主題。

## 系列文章

Spring 2026 共 27 講、5 份作業，本系列按官方課序把講次與作業交錯排：

1. 本篇：系列入口與版本總覽
2. [CS189 有三個版本：Spring 2026 底本、Spring 2025 經典版、Fall 2026 進行中](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)
3. [Lec 1–3：ML 問題框架、資料工具、術語與技巧](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics)
4. [Lec 4–7：K-means、機率複習、MLE、多變量高斯與 GMM](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm)
5. [Lec 7–10：線性回歸、最小平方的幾何、正則化](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression)
6. [HW1：線代／微積分／機率熱身 + Fashion coding](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw1-math-refresher-fashion)
7. [Lec 11–12：分類、生成式分類器、logistic regression、ROC](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic)
8. [Lec 13、15：收斂、Momentum、Adam、SGD](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers)
9. [Lec 14、16：MLE vs MAP、bias-variance、熵與 KL，期中自評](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy)
10. [HW2：Chatbot Arena 論文題、回歸、MLE/MAP、GMM 到 flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)
11. [Lec 17–18：深度、萬能近似、激活函數與反向傳播](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-17-18-neural-networks-backprop)
12. [HW3：從零寫 autograd（BearTensor）、Newton 法、資訊瓶頸](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw3-autograd-optimizers)
13. [Lec 19–20：初始化、BatchNorm、CNN、early stopping 與 double descent](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-19-20-cnn-generalization)
14. [Lec 21–22：Transformers](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-21-22-transformers)
15. [HW4：ResNet/Transformer 論文題與 CNN、ResNet、Transformer、DNABERT、ConvNeXt 實作](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw4-resnet-transformer-dnabert)
16. [Lec 23–24：LLM 訓練與應用、自監督學習](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-23-24-llm-training-ssl)
17. [Lec 25–27：蛋白質工程的 AI、agents 與環境，以及完課路線](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-25-27-protein-agents-closing)
18. [HW5（選修）：生物自監督 InfoNCE、diffusion 理論、LLM fine-tuning + Kaggle](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw5-ssl-diffusion-finetuning)

還拿不到、系列裡只記存在的部分：Spring 2026 期末考題目與解答（考古題資料夾只到 sp25／fa25 期末）、HW1–4 官方解答、Lec 26 guest lecture（沒有公開教材）、Lec 1 錄影。Fall 2026 學期結束後，會再評估是否改用它當底本。

## 今晚的起步動作

1. 先讀 [CS189 有三個版本](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)，決定走 Spring 2026 主線還是 Spring 2025 經典路線。
2. 走 Spring 2026 的話，打開 [Lec 1–3 導讀](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics)，順手把 [HW1](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw1-math-refresher-fashion) 的數學熱身題標出三類：純推導、資料分析、程式實作。
3. 若熱身題的線代或機率卡住，先回 CS70 notes 或 [CS61B](https://fa25.datastructur.es/) 補基礎，不要跳課。

## 參考資料

- [Berkeley CS189 Spring 2026（eecs189.org/sp26，本系列底本）](https://eecs189.org/sp26/)
- [Berkeley CS189 Spring 2025（~jrs，經典路線 A3）](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [Berkeley CS189 Fall 2026 Schedule（eecs189.org/fa26, 當期行事曆）](https://eecs189.org/fa26/)
- [Berkeley AI／ML 課程導讀：從 CS61A 到 CS288](https://quidproquo.cc/posts/learning/2026-08-21-berkeley-ai-ml-course-map)
- [Berkeley CS188 Spring 2026 總覽](https://quidproquo.cc/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)
- [世界名校 AI／CS 課程地圖：A0–A3 分級](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map)
- [CS70 Fall 2025](https://fa25.eecs70.org/)
- [CS61B Fall 2025](https://fa25.datastructur.es/)
- [CSDIY — Berkeley CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)

## 更新紀錄

- 2026-09-29：系列擴充為 18 篇，改以 Spring 2026 為底本，新增「系列文章」目錄與待釋出清單；修正「HW1–7 怎麼走」一節，原文把 Spring 2026／Fall 2026 的課序誤寫成 Spring 2025 的 HW 主題，改依 189s25 課程頁的講次標題重寫，並更正 Spring 2025 錄影需 bCourses 登入；公開程度表新增 Spring 2026；起步動作改指向系列文。
