---
title: "Harvard CS181 Machine Learning 導讀總覽：2026 七份作業怎麼跟？四年版本一次看懂"
date: 2026-08-27
category: tech
tags: [harvard, cs181, machine-learning, learning-path, homework, practical, textbook]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 0
type: guide
tldr: "CS181 2026 以 hw0–6 七份作業為週節拍、官方課表未列對應講次的公開錄影但 A3 可自學；2025 多 practical、2024 雙期中、2023 單授 Weiwei Pan。看懂四年沿革後，從 HW0 體檢先修再逐週跟最穩。"
description: "Harvard CS1810 2026/2025/2024/2023 四屆對照：授課、先修、成績、作業鏈、Textbook 與追課節拍，並說明本系列如何以 hw 編號寫逐週導讀。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-27-harvard-cs181-overview-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> ⚠️ **版本**：2026 以 [CS181 2026 課程站](https://harvard-ml-courses.github.io/cs181-web/) 與 [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks) 為主；2025/2024/2023 以 `cs181-web-2025/2024/2023` 與 `cs181-s25/s24/s23-homeworks` 對照。2026 課站嵌入的 [Google Sheet 課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) 可匿名匯出（2026-09-29 確認），本系列以 `hw 編號` 為週節拍、課表講題為篇內順序。

## 課程影片來源

已核對 CS1810 Spring 2026 官方課表與 syllabus：本文依據作業、section 或考試教材導讀，對應條目未列公開講課影片；官方提供講課投影片與 section 教材。這表示公開課表未提供對應影片，不代表課程從未錄影。

官方來源：

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

查核日期：2026-10-10。

## TL;DR

- **可自學嗎**：[CS181 2026](https://harvard-ml-courses.github.io/cs181-web/) 是 **A3**（`hw0-6` 七份 + notes + sections + [textbook](https://github.com/harvard-ml-courses/cs181-textbook) 形成閉環，`all learning will be in-person` 官方課表未列對應講次的公開錄影，Gradescope/Ed 需選課），與 [Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) 判一致。
- **怎麼跟**：先做 [HW0 準備度檢查](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)（`due 2026-02-02`，`4%` 門檻），卡哪題就先補哪塊，再逐份 `hw1→hw6` 跟；系列共 16 篇（order 0–15），含期中、期末兩篇檢核，完整清單見下方「系列文章一覽」。
- **四年差異**：2025 多 `practical 6%`、2024 雙期中無期末、2023 單授 `Weiwei Pan` 且僅 `hw0-5 + practical1`。

## 四屆對照（一張表看懂沿革）

| 年 | 課站 | 授課 | 成績 | 作業目錄（`api.github.com` 驗證） | 節拍差異 |
|---|---|---|---|---|---|
| **2026** | [cs181-web](https://harvard-ml-courses.github.io/cs181-web/) | Alvarez-Melis / Du + Head TFs Russell Li / Elvin Lo | [syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus): `hw0 4% + hw1-6 各11% + midterm 15% + final 15%` | [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks): `hw0-6` 7 dir | `hw6` 為 Sequential/MDP/RL + Autoregressive |
| **2025** | [cs181-web-2025](https://harvard-ml-courses.github.io/cs181-web-2025/) | Doshi-Velez / Alvarez-Melis + Preceptor Papon | `hw0 4% + hw1-6 各10% + practical 6% + midterm/final 各15%` | [s25 homeworks](https://github.com/harvard-ml-courses/cs181-s25-homeworks): `hw0-6 + practical` 8 dir | hw3-5 重組前（Bayesian/EM） |
| **2024** | [cs181-web-2024](https://harvard-ml-courses.github.io/cs181-web-2024/) | Doshi-Velez / Alvarez-Melis + Head TFs Badrinath/Cai | `hw0 4% + hw1-6 各11% + two midterms 各15%`（無 final） | [s24 homeworks](https://github.com/harvard-ml-courses/cs181-s24-homeworks): `hw0-6` 7 dir | 唯一雙期中版，`hw0 due Jan26,2024` |
| **2023** | [cs181-web-2023](https://harvard-ml-courses.github.io/cs181-web-2023/) | Weiwei Pan 單授 `TTh 2:15 SEC 1.321` | 見 `cs181-s23` practical 計分 | [s23 homeworks](https://github.com/harvard-ml-courses/cs181-s23-homeworks): `hw0-5 + practical1` | 僅 6 hw，命名 `T*_TestCases.py` |

## 先修與 HW0 門檻

[syllabus 先修段](https://harvard-ml-courses.github.io/cs181-web/syllabus) 四年一致：`CS50 以上 Python + STAT 110 + 微積分 + 線代（AM 22a / Math 21b）`，`STAT 111 / CS 51` 非必要。HW0 明載 `During the term, the staff will be prioritizing support for new material... it might be prudent to postpone`，實為選課週體檢。建議見 [HW0 逐題導讀](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)：線代 `y=Xw`（`x1≠x2 ↔ X invertible`）、微分、機率、OLS code 各一題，卡最久的即開學首週補課對象（[MML Book](https://mml-book.github.io/)、[STAT 110](https://statistics.fas.harvard.edu/stat110/home)）。

## 作業鏈怎麼走（2026 主版）

以 `s26 homeworks` 各份 `.tex` 的 `\duedate` 與題目標題為準（2026-09-29 逐份核對）：

- **HW0 Modeling Linear Trends**（`due 2026-02-02`）— 線代/微分/機率/code 四合一
- **HW1 Regression**（`due 2026-02-13`）— kNN & Kernels / Geometric Least Squares / Basis Regression / Probabilistic View & Regularization 四題，`earth_temperature_sampled_train/test.csv`（800k 年冰芯）
- **HW2 Classification and Bias-Variance**（`due 2026-02-27`）— Bias-Variance & Uncertainty / MLE in classification / Classifying Loan Applicants / GD & Regularization
- **HW3**（`due 2026-03-23`）— Kernels & Feature Maps / Neural Networks / Neural Scaling Laws
- **HW4**（`due 2026-04-03`）— Understanding the Transformer / Autoencoders / Decision Trees, Random Forests & Mixture of Experts
- **HW5**（`due 2026-04-19`，課表原訂 Apr 17）— Contrastive Learning / GANs / K-Means & HAC / PCA
- **HW6 Sequential Models and Decision Making**（`due 2026-05-01`）— HMM / Policy & Value Iteration / Reinforcement Learning / Autoregressive Models / Embedded Ethics
- **考試**：課表列 Midterm `Mar 10`（in-class）、Final Exam `May 9 2pm`

2025 的 `hw3 Bayesian` / `hw4 SVM` / `hw5 EM` 可作對照，缺的 `practical`（Kaggle 型）見 `cs181-s25-homeworks/practical` 與 `cs181-s19-practicals` 範例。

## 教材與節拍

- **Textbook**：[cs181-textbook](https://github.com/harvard-ml-courses/cs181-textbook)（senior thesis 起，`370 stars`，13 章 `Classification/Clustering/DimensionalityReduction/.../SupportVectorMachines`，`Textbook.pdf 3.59 MB`）
- **Section**：`syllabus` 明載 `flipped classroom, section cycle restarts each Tuesday, solutions will be posted`。舊的 `cs181-section` repo 只有 `s17-19`，但 2026 課站 `static/sec00`–`sec10` 放了 S0–S10 講義與解答 PDF，各篇導讀直接引用。
- **課表與投影片**：2026 課站嵌入的 Google Sheet 課表可匿名匯出 CSV（Week 0–14 講題、section、作業發布與截止）；講題儲存格內附 2026 講課投影片的 Google Drive 連結，CSV 看不到、匯出 xlsx 才讀得到。**本系列以 `hw 編號` 為週節拍，不綁日曆週**。
- **提交**：每份對應 **兩個 Gradescope**（`writeup PDF 需 assign pages` + `LaTeX/code` 備核），見 [homework page](https://harvard-ml-courses.github.io/cs181-web/homework)。

## 系列文章一覽

| order | 文章 | 對應 |
|---|---|---|
| 0 | 本篇總覽 | 四屆對照、存取分級 |
| 1 | [HW0：線代、微積分與機率準備度檢查](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review) | hw0 |
| 2 | [HW1：迴歸](/posts/tech/2026-08-27-harvard-cs181-hw1-regression) | hw1 |
| 3 | [HW2：分類與偏差—變異](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance) | hw2 |
| 4 | [HW3：核方法、神經網路與 Scaling Law](/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling) | hw3 |
| 5 | [期中檢核：用官方 checklist 盤點 HW0–HW3](/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint) | midterm |
| 6 | [HW4（上）：Transformer](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer) | hw4 P1 |
| 7 | [HW4（中）：Autoencoder 與 VAE](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae) | hw4 P2 |
| 8 | [HW4（下）：決策樹、隨機森林與 MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe) | hw4 P3 |
| 9 | [HW5（上）：K-means、HAC 與 PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca) | hw5 P3–4 |
| 10 | [HW5（下）：SimCLR 對比學習與 GAN](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans) | hw5 P1–2 |
| 11 | [HW6（一）：自迴歸解碼、KV Cache 與 Speculative Decoding](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding) | hw6 P4 |
| 12 | [HW6（二）：HMM 與 Kalman Filter](/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman) | hw6 P1 |
| 13 | [HW6（三）：MDP 的 Policy / Value Iteration](/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning) | hw6 P2 |
| 14 | [HW6（四）：Q-learning 與 Embedded EthiCS](/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics) | hw6 P3、P5 |
| 15 | [期末檢核與系列收尾](/posts/tech/2026-09-29-harvard-cs181-final-checkpoint) | final |

建議讀法：先讀本篇決定要不要跟 2026 主版 → 做 HW0 依卡點補前置 → 依 order 逐篇跟，每篇對應一份 `hw*_release.tex/pdf/ipynb + data` 與當週 section。HW4–HW6 依課表講題順序拆成多篇。CS182 見 [CS182 歷史版免責](/posts/learning/2026-08-22-harvard-ai-ml-course-map)（2026/2025 當期 A0，僅 F22 22講可寫）。

### 目前的限制與未釋出部分

- **公開影片狀態**：syllabus 說實體授課，不能用來證明沒有錄影；主要講次未列公開影片，W13 Embedded EthiCS 明確寫 see recording，但本次公開課表 HTML 未提供可開啟的錄影連結。
- **無作業解答**，Gradescope／Ed 需選課；section 有解答 PDF。
- 2024 scribe notes 是舊年份講義；midterm/final review 與 midterm practice 標頭為 2025。
- 課站 `homework` 頁未更新（只列 HW0），2026 作業清單以 s26 repo 與課表為準。
- CS1810 是春季課，Fall 2026 不開；Spring 2027 教材上架後再補對照。

## 參考資料

- [CS181 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [CS181 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)
- [CS181 s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks)
- [CS181 2025 course website](https://harvard-ml-courses.github.io/cs181-web-2025/)
- [CS181 s25 homeworks](https://github.com/harvard-ml-courses/cs181-s25-homeworks)
- [CS181 2024 course website](https://harvard-ml-courses.github.io/cs181-web-2024/)
- [CS181 s24 homeworks](https://github.com/harvard-ml-courses/cs181-s24-homeworks)
- [CS181 2023 course website](https://harvard-ml-courses.github.io/cs181-web-2023/)
- [CS181 s23 homeworks](https://github.com/harvard-ml-courses/cs181-s23-homeworks)
- [CS181 textbook](https://github.com/harvard-ml-courses/cs181-textbook)
- [Harvard AI／ML 課程地圖](https://quidproquo.cc/posts/learning/2026-08-22-harvard-ai-ml-course-map)
- [世界名校 AI／CS 課程地圖](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map)
- [MML Book](https://mml-book.github.io/)

## 更新紀錄


- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- **2026-09-29**：系列擴充到 order 0–15，新增「系列文章一覽」與限制清單；依 2026 課表與各份 `.tex` 補上 HW1–HW6 截止日、題目與考試日期；更正「Google Sheet 課表已刪」與「2026 section 未公開」的舊說法。
