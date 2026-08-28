---
title: "Harvard CS181 HW0：開學前先做這 4 題，卡哪題就先補哪裡"
date: 2026-08-27
category: tech
tags: [harvard, cs181, machine-learning, linear-algebra, calculus, probability, linear-regression, python]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 1
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 96
type: guide
tldr: "HW0 用四題檢查 CS181 的先修：矩陣 y=Xw 的可解條件、目標函數的微分與優化、機率推理，以及用 Python 實作 OLS。做不順的地方就是開學後要優先補的缺口。"
description: "逐週導讀 Harvard CS1810 Spring 2026 HW0（2026-02-02 due）：以 2026 為主、2025 為對照，拆解線性趨勢建模、微分優化、機率與線性迴歸實作四題，說明如何用一題判斷自己是否該先補線代或機率。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en)

> ⚠️ **版本**：本文以 [CS1810 Spring 2026 HW0](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw0)（`hw0.tex` due 2026-02-02）為主，`Spring 2025` 同題（`cs181-s25-homeworks/hw0`）作對照。`syllabus` 先修與計分見 [CS181 2026 課程站](https://harvard-ml-courses.github.io/cs181-web/) 與 [CS181 2025 課程站](https://harvard-ml-courses.github.io/cs181-web-2025/)。

## TL;DR

HW0 不計難度、只計完整度（`Homework zero (4%)`，[2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)），但它是整門課唯一的「先修體檢」。四題分別對應 [CS181 textbook](https://github.com/harvard-ml-courses/cs181-textbook) 的前置章：線代、微積分、機率、Python 實作。做完後你會得到一張缺口地圖——哪一題卡最久，開學後就先補哪一塊，而不是等到 HW1 的冰芯溫度迴歸才發現矩陣乘法不熟。

## 為什麼 HW0 值得單獨寫一篇

[CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html) 把 HW0 寫成 `due February 2` 的門檻，並明言 `During the term, the staff will be prioritizing support for new material taught in CS1810 over teaching prerequisites. If you find you are struggling... it might be prudent to postpone`。換句話說，**HW0 是讓你在選課週就決定要不要延後一學期**，而不是在 HW1 才被當。

跟 [Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) 的分級對照，CS181 是 **A3**（`hw0-6` 七份作業全在 [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks) 公開，`all learning will be in-person` 無當期錄影），HW0 的 `data/hw0.ipynb + hw0.tex` 就是自學閉環的起點。2025 版（[s25 homeworks](https://github.com/harvard-ml-courses/cs181-s25-homeworks)）同為七份，唯獨多 `practical`，HW0 本體幾乎不變，可無縫對照。

## 作業怎麼交（先別在格式上丟分）

`homework` 頁要求：每個作業對應 **兩個 Gradescope** — 一個交 `writeup PDF（需 assign pages for each question）`，一個交 `LaTeX 原檔 + code（.py/.ipynb/.tex）`，後者僅在榮譽準則等特殊情況才被審（見 [CS181 homework page](https://harvard-ml-courses.github.io/cs181-web/homework)）。校外自學可直接用 `git clone https://github.com/harvard-ml-courses/cs181-s26-homeworks.git` 後 `git pull` 同步最新版（`s26 README` 寫法）。

## 四題在考什麼（2026 主版，2025 對照）

### Problem 1：Modeling Linear Trends — 線代複習

題目給 `D={(x1,y1),(x2,y2)}`，直線 `y=w0+w1 x`。

1. 用代入法手解 `w0,w1`
2. 改寫成矩陣 `y=Xw`，其中 `y,w∈R^2, X∈R^{2×2}`，並寫出 `X,y,w` 的構成
3. 何時有唯一解？`X` 可逆（`det X ≠0`）↔ `x1≠x2`，此時 `w = X^{-1} y`（或 `w=(X^T X)^{-1}X^T y` 的特例）
4. 比較矩陣解與代入解，說明矩陣表達的好處
5. 資料量 `N>2` 時，`X∈R^{N×2}` 非方陣，`w=X^{-1}y` 不再直接適用（過定系統，需最小平方法）
6. 用 Python 自選 `x1≠x2` 構造 `X,y` 並算 `w`

**導讀**：這題把 [世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) 強調的「矩陣是 ML 的語言」具體化——兩點時矩陣只是換寫法，百萬點時它才顯出優勢（批量運算、幾何直覺、可導向 OLS）。若第 3 問卡住，先回 [MML Book Part I §2-3](https://mml-book.github.io/) 或 [CS109 機率與線代複習](https://harvard-ml-courses.github.io/cs181-web/resources)。

### Problem 2：Optimizing Objectives — 微積分複習

題面為 `hw0.tex` 的第二個 `problem`，聚焦目標函數的導數、極值條件與梯度為零的幾何意義。做題時注意：
- 單變數時 `df/dx=0` 是候選極值，雙變數時 `∇f=0` 才是
- 二階條件決定是極小還是鞍點（與後續 HW1 的 loss landscape 呼應）

若此題耗時最久，表示你需要先補微分與向量微積分，而非急著進 HW1 的迴歸。

### Problem 3：Reasoning about Randomness — 機率與統計複習

第三個 `problem` 回到 [STAT 110](https://statistics.fas.harvard.edu/stat-110) 層級：隨機變數、期望、方差、Bayes。CS181 後續的 `Bayesian Methods`（2025 HW3）與 `Inference in Graphical Models`（2025 HW6）皆以此為地基。建議對照 [CS181 textbook / GenerativeModels](https://github.com/harvard-ml-courses/cs181-textbook/tree/master/GenerativeModels) 與 [STAT 110 官方講義](https://projects.iq.harvard.edu/stat110/home)。

### Problem 4：Implementing a Linear Regression — Coding 複習

題目角色扮演 `Steve the TF live demo`，用 OLS 估 `line of best fit`（非完美穿兩點）。`data` 為兩欄（x, y），你需要：
- 造 `X`（一欄全 1 的截距 + 一欄 x），修正 `X` shape 錯誤
- 解釋 `y.shape` 為何無第二維（`y` 為 1D 向量，`X` 為 2D 矩陣）
- 實作 OLS 並觀察 `N=2` 與 `N>2` 的差異

此題是整門課「理論 + code 同題」的第一個範例。後續 HW1 的冰芯溫度 `earth_temperature_sampled_train/test.csv`（`Jouzel et al. 2007`）就是把同樣的 `X,y` 換成 800k 年真實資料。

## 今晚可做的 90 分鐘檢查

1. `git clone` s26 repo，開 `hw0/hw0.ipynb`，在本地跑通 `import numpy` 與 `X.shape / y.shape`
2. 手寫第 3 問的 `X invertible ↔ x1≠x2` 一遍，再用 Python 隨機兩點驗證
3. 為每題打分（順暢 / 卡但解出 / 需查資料 / 做不出），**卡最久的那題就是你開學第一週要補的前置**（線代 → MML Book，機率 → STAT 110，code → 回做 CS50x Python）

## 與後續週的銜接

HW0 通過後，[HW1 Regression](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)（冰芯溫度）、HW2 Classification、HW3 Neural Networks and Kernels、HW4 Transformers、HW5 Clustering/PCA、HW6 Sequential Models 才會是「新知」而非「補洞」。2025 的 `practical`（Kaggle 型）可視為 HW0-6 後的綜合實作，2026 未提供則可用 2025 版自練。

## 參考資料

- [CS1810 Spring 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [CS1810 Spring 2026 syllabus (GitHub)](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)
- [CS1810 Spring 2026 HW0 (hw0.tex, due 2026-02-02)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw0)
- [CS1810 Spring 2025 course website](https://harvard-ml-courses.github.io/cs181-web-2025/)
- [CS1810 Spring 2025 HW0](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/hw0)
- [CS181 textbook (senior thesis, 13 chapters)](https://github.com/harvard-ml-courses/cs181-textbook)
- [Harvard AI／ML 課程地圖 — CS181/CS182 版本與作業差異](https://quidproquo.cc/posts/learning/2026-08-22-harvard-ai-ml-course-map)
- [世界名校 AI／CS 課程地圖](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map)
- [MML Book Part I (math background)](https://mml-book.github.io/)
