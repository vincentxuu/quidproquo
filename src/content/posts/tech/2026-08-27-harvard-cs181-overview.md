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
tldr: "CS181 2026 以 hw0–6 七份作業為週節拍、無當期錄影但 A3 可自學；2025 多 practical、2024 雙期中、2023 單授 Weiwei Pan。看懂四年沿革後，從 HW0 體檢先修再逐週跟最穩。"
description: "Harvard CS1810 2026/2025/2024/2023 四屆對照：授課、先修、成績、作業鏈、Textbook 與追課節拍，並說明本系列如何以 hw 編號寫逐週導讀。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-27-harvard-cs181-overview-en)

> ⚠️ **版本**：2026 以 [CS181 2026 課程站](https://harvard-ml-courses.github.io/cs181-web/) 與 [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks) 為主；2025/2024/2023 以 `cs181-web-2025/2024/2023` 與 `cs181-s25/s24/s23-homeworks` 對照。Google Sheet schedule 四年皆已刪/空殼，本系列以 `hw 編號` 為週節拍。

## TL;DR

- **可自學嗎**：[CS181 2026](https://harvard-ml-courses.github.io/cs181-web/) 是 **A3**（`hw0-6` 七份 + notes + sections + [textbook](https://github.com/harvard-ml-courses/cs181-textbook) 形成閉環，`all learning will be in-person` 無當期錄影，Gradescope/Ed 需選課），與 [Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) 判一致。
- **怎麼跟**：先做 [HW0 準備度檢查](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)（`due 2026-02-02`，`4%` 門檻），卡哪題就先補哪塊，再逐份 `hw1→hw6` 跟；缺的 `practical` 用 2025 版備援。
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

以 `s26 homeworks` 為準（已直讀 `hw0/hw1/hw6` 30-80 行，`hw2-5` 標題與 Intro 片段）：

- **HW0 Modeling Linear Trends**（`due 2026-02-02`）— 線代/微分/機率/code 四合一
- **HW1 Regression** — NN/kernel/linear regression，`earth_temperature_sampled_train/test.csv`（800k 年冰芯）
- **HW2 Classification and Bias-Variance** — 分類與不確定性量化
- **HW3 Neural Networks and Kernels** — kernel ridge → weighted sum，Section 4
- **HW4 Representation Learning, Transformers, Non-parametric methods** — `Attention(Q,K,V)=softmax(QK^T/√dk)V`，`/√dk` 方差為 1
- **HW5 Clustering, PCA, SSL** — cluster centers vs PCA images
- **HW6 Sequential Models and Decision Making** — Kalman、Gridworld `policy/value iteration`、Swingy Monkey Q-learning、autoregressive `KV cache / speculative decoding`（`due 2026-05-01`）

2025 的 `hw3 Bayesian` / `hw4 SVM` / `hw5 EM` 可作對照，缺的 `practical`（Kaggle 型）見 `cs181-s25-homeworks/practical` 與 `cs181-s19-practicals` 範例。

## 教材與節拍

- **Textbook**：[cs181-textbook](https://github.com/harvard-ml-courses/cs181-textbook)（senior thesis 起，`370 stars`，13 章 `Classification/Clustering/DimensionalityReduction/.../SupportVectorMachines`，`Textbook.pdf 3.59 MB`）
- **Section**：`syllabus` 明載 `flipped classroom, section cycle restarts each Tuesday, solutions will be posted`，但 `cs181-section` repo 僅 `s17-19` 三屆，2025/2026 未進版控；`schedule` 頁僅剩 `S0 Math review`，Google Sheet 四年皆 `檔案已遭刪除` — **本系列以 `hw 編號` 為週節拍，不綁日曆週**。
- **提交**：每份對應 **兩個 Gradescope**（`writeup PDF 需 assign pages` + `LaTeX/code` 備核），見 [homework page](https://harvard-ml-courses.github.io/cs181-web/homework)。

## 本系列怎麼讀

1. 先讀本篇總覽，決定是否要跟 2026 主版
2. 做 [HW0](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)，依卡點補前置
3. 逐週 `HW1→HW6`，每篇對應一份 `hw*_release.tex/pdf/ipynb + data`，內文標 `2026/2025` 差異與 `additionalSeries` 連回地圖
4. 需要綜合實作者，用 2025 `practical` 備援；CS182 見 [CS182 歷史版免責](/posts/learning/2026-08-22-harvard-ai-ml-course-map)（2026/2025 當期 A0，僅 F22 22講可寫）

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
