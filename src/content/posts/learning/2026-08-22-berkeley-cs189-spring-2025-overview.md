---
title: "Berkeley CS189 Spring 2025 總覽：用 HW1–7 與 code/data 走完的機器學習，用 Fall 2026 看下一學期"
date: 2026-08-22
category: learning
tags: [berkeley, cs189, machine-learning, open-course, learning-path]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 Spring 2025"
  order: 1
tldr: "CS189 Spring 2025 公開完整 notes、影片、HW1–7 與 code/data，是目前唯一 A3 自學版；Fall 2026（eecs189.org/fa26）已上線 27 講行事曆但多數教材尚未開放，輪替站舊檔有 404 風險，本文以 Spring 2025 為主、Fall 2026 為對照。"
description: "Berkeley CS189 Spring 2025 完整自學總覽：公開程度、先修、HW1–7 與 Fall 2026 現況對照，以及校外讀者的權限邊界與起步動作。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en)

[Berkeley CS189 Introduction to Machine Learning](https://people.eecs.berkeley.edu/~jrs/189s25/) 是 Berkeley 的數學型機器學習入口，不接在 [CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/) 之後，而是與它平行。[Berkeley AI／ML 課程導讀](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)已把兩門課定位為「搜尋／推理」與「統計學習」兩個入口；這篇把 CS189 的自學可行性補到可執行。

核心結論：**想現在自學，走 Spring 2025；想看下一學期長什麼樣，看 [Fall 2026](https://eecs189.org/fa26)。** Spring 2025 在 `people.eecs.berkeley.edu/~jrs/189s25/` 保留完整 notes、影片、HW1–7、code/data 與歷屆考題（本站判 [A3](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map)）；Fall 2026 剛在 `eecs189.org/fa26` 公布 27 講行事曆（`Lec01 Introduction + ML Problem Framing` 到 `Lec27 Closing`），但講義與作業多數尚未開放，泛用網址 `eecs189.org` 本身也會隨學期重導向，舊檔有輪替後 404 的前例。

## 公開到什麼程度

依本站 A0–A3 標準：

| 版本 | 等級 | 匿名拿得到什麼 | 主要缺口 |
|---|---|---|---|
| **CS189 Spring 2025** (`~jrs/189s25`) | **A3** | lecture notes、影片、HW1–7、code/data、歷屆考題、完整 syllabus | 當期 Gradescope 提交、Ed、人工回饋與隱藏測試 |
| **CS189 Fall 2026** (`eecs189.org/fa26`) | **A1→A2** | syllabus、27 講行事曆（Week 1–16）、部分 lecture 連結 | 講義／錄影／HW starter 多數尚未發布；需等學期推進 |

Spring 2025 能判 A3 的關鍵是「練習鏈完整」：有題目、有可本機執行的 code/data、有歷屆考題可自我檢測。Fall 2026 的價值目前在「看結構」：從 [Fall 2026 Schedule](https://eecs189.org/fa26/#schedule) 可看到完整路徑 `Data Tools / K-Means / KNN → Density Estimation / GMM → Linear Regression / Bias-Variance → Logistic Regression → Gradient Descent → Neural Networks → CNN / Transformers / LLM → Attention / MDP / RL → Post-training / Diffusion → Closing`，與傳統 [ESL](https://hastie.su.domains/ElemStatLearn/) 與校內 ML 主幹一致，但不宜把它當成已開放的自學包。

## 開始前要會什麼

官方先修是多變量微積分、線性代數與 [CS70](https://fa25.eecs70.org/)（或教師同意）。對校外讀者的可操作檢查：

1. 線代：矩陣乘法、特徵值、SVD 的幾何意義；能讀懂最小平方法與 ridge 的正規方程。
2. 機率：條件機率、期望值、MLE／MAP、bias-variance 拆解。
3. 實作：Python + NumPy 能完成向量化實作與梯度檢查；不熟就先回 [CS61B Fall 2025](https://fa25.datastructur.es/) 補資料結構與測試習慣。

CS189 不要求 CS61B 的課號，但 HW 的 code 會假設你會寫可重現的實驗、會切 train/validation、會看 learning curve。缺這塊會比缺一條先修課號更卡。

## HW1–7 怎麼走（Spring 2025）

Spring 2025 的 HW1–7 在站上各有 PDF 與對應 code/data，建議照官方順序做，每份都做「讀 notes → 看影片 → 做 discussion → 寫 HW → 對歷屆考題」：

1. **資料與距離**：K-Means、KNN 與資料工具，建立「特徵—距離—決策」直覺。
2. **機率與密度**：density estimation、GMM，銜接 EM 的推導。
3. **線性模型**：least squares、regularization、bias-variance 與模型選擇。
4. **分類**：logistic regression、LDA/QDA、支援向量機的對比。
5. **最佳化**：gradient descent 的收斂與步長，接到隨機與批次變體。
6. **非線性與核**：kernel methods、feature maps 與正則化的對偶觀點。
7. **深度模型**：neural networks、CNN/Transformer/LLM 與生成模型收尾（對應 Fall 2026 的 `Lec12–Lec27` 弧線）。

每份 HW 保留「題目—code—data」三角，校外可本機重跑；缺的是 Berkeley 的 Gradescope hidden tests 與助教回饋，改以歷屆考題與自行切的 validation 曲線做驗收。

## 為什麼不直接追 Fall 2026

`eecs189.org` 是輪替站，根網域已 `302` 到 `/fa26`，舊學期頁面可能在切換後失效（[Berkeley 課程地圖](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)已有 `404` 紀錄）。Fall 2026 目前僅行事曆完整，講義與 HW 多數標 `TBD`，硬追會變成「看課表自學」。可行的策略是：以 Spring 2025 建主幹，同步對照 Fall 2026 的 27 講順序，遇到新主題（如 `Post-training: Fine-tuning / LoRA / PEFT / Distillation`、`Diffusion`）再回頭補 Spring 2025 沒有的單元。

## 今晚的起步動作

1. 打開 [CS189 Spring 2025](https://people.eecs.berkeley.edu/~jrs/189s25/) 的 `HW1`，不寫 code，先標出三類題：純推導、資料分析、程式實作。
2. 對照 [Fall 2026 Lec01–Lec03](https://eecs189.org/fa26/lecture/lec01) 的 `Introduction / Data Tools / Math Refresher`，補齊卡住的線代或機率清單。
3. 若 `HW1` 的 NumPy 題十分鐘內能跑通，再往 `HW2` 走；否則回到 CS70 notes 或 [CS61B](https://fa25.datastructur.es/) 單元補基礎，不要跳課。

## 參考資料

- [Berkeley CS189 Spring 2025（~jrs, canonical A3）](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [Berkeley CS189 Fall 2026 Schedule（eecs189.org/fa26, 當期行事曆）](https://eecs189.org/fa26/)
- [Berkeley AI／ML 課程導讀：從 CS61A 到 CS288](https://quidproquo.cc/posts/learning/2026-08-21-berkeley-ai-ml-course-map)
- [Berkeley CS188 Spring 2026 總覽](https://quidproquo.cc/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)
- [世界名校 AI／CS 課程地圖：A0–A3 分級](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map)
- [CS70 Fall 2025](https://fa25.eecs70.org/)
- [CS61B Fall 2025](https://fa25.datastructur.es/)
- [CSDIY — Berkeley CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)

