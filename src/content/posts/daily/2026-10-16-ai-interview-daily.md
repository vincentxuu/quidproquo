---
title: "AI Engineer 面試日練 — 2026-10-16：Coding"
date: 2026-10-16
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五輪到 ML-flavored coding——面試官給空白編輯器要你手刻 softmax、k-means 或 attention，考的不是演算法背不背得出來，而是 shape、數值穩定性和邊界情況有沒有處理。"
tldr: "今天練『手刻 ML 演算法』這類程式題：核心不是背公式，是向量化思維（用 broadcasting 取代巢狀迴圈）、數值穩定性（softmax 要先減最大值才不會在極端 logit 下溢位）、邊界情況（k-means 的空簇、AUC 的同分）才是真正拿分的地方；面試通常只准 NumPy，要自己寫 model／loss／layer，而不是呼叫 sklearn。練習題改編自 PracHub 機器學習工程師題庫的 k-means clustering from scratch。"
series:
  name: "AI Engineer 面試日練"
  order: 58
---

> 🌏 [English version](/posts/daily/2026-10-16-ai-interview-daily-en)

## 今日主題

星期五輪到 Coding。這裡指的不是一般的 LeetCode，是 ML 工程師面試特有的一種程式題：面試官給一個空白編輯器，要你把 softmax、k-means、attention 或 batch norm 從零刻出來，通常只准用 NumPy，不准呼叫 PyTorch 或 scikit-learn。這一輪考的不是你記不記得演算法的數學式，是你處理 shape、數值穩定性和邊界情況的手感——這些東西在呼叫 library 時全被藏起來，只有自己寫過才會踩到。

## 核心概念速記

### 向量化思維：用 broadcasting 取代巢狀迴圈

拿到 n 個資料點、k 個中心點，第一個直覺是寫兩層 for loop 算距離。面試官真正想看的是你能不能用 NumPy 的 broadcasting 一次算完：把資料點 reshape 成 `(n, 1, d)`、中心點 reshape 成 `(1, k, d)`，相減之後對最後一軸算範數，直接拿到 `(n, k)` 的距離矩陣。這個習慣不只是為了效能，也是面試官判斷你有沒有真的用過 NumPy、還是只是會寫 Python 迴圈的分水嶺。

### 數值穩定性是潛規則，沒人會提醒你

softmax、log-sum-exp、交叉熵這類函式在數學上是對的,直接照公式實作在極端輸入下會溢位。標準修法是先減掉該行的最大值再做 exponential，保證指數不會爆掉,結果數學上完全等價。面試官測試案例裡幾乎一定藏一個 logit 很大的 edge case,沒做這一步當場就會噴 `inf` 或 `nan`。

### 邊界情況才是真正拿分的地方

k-means 可能跑出空簇——某個中心點完全沒分到點,重新計算平均值時就會除以零;標準做法是把空簇重新初始化到距離目前中心最遠的那個點,或者直接跳過更新保留舊值。AUC 計算時分數相同的樣本要怎麼排名也是常見陷阱。這類函式的主邏輯通常五分鐘就能寫完,真正拉開差距的是你有沒有主動講出「這裡如果遇到 XXX 會怎樣」。

### "From scratch" 的範圍是一份隱含契約

面試官說「手刻」時,預設只給你 NumPy,目標是看你知不知道 library 底層在做什麼,所以不能用 `sklearn.cluster.KMeans` 繞過去,但可以用 `np.linalg.norm`、`np.random` 這類基礎工具。開始寫之前先問清楚「我可以用哪些函式」,比悶頭寫完才發現方向錯更划算。

### 生產思維:寫完要能說出怎麼測

寫完程式後,面試官常接著問「你怎麼確定這是對的」。好答案包含:固定的測試案例表(含正常輸入和極端輸入)、跟一個暴力解或高精度解比對在容許誤差內一致、以及至少想過一個會讓你原本寫法出錯的輸入。這個習慣跟團隊寫 production ML 程式碼要求的 data processing／feature logic 單元測試是同一套邏輯。

## 今日練習題

### 題目

實作 k-means clustering algorithm from scratch。給定 n 個 d 維資料點和分群數 k,回傳每個點所屬的群標籤。你只能用 NumPy,不能呼叫任何現成的 clustering 函式庫。

**來源**：改編自 PracHub 機器學習工程師面試題庫（通用題庫，非特定公司）　**難度**：中等　**環節**：technical screen（coding round）

### 拆解思路

1. **先釐清問題**：k 是給定的還是要自己決定？初始化方式有沒有限制（隨機取點 vs k-means++）？收斂判定用什麼（assignment 不再變動,還是設 iteration 上限）？距離度量預設歐幾里得距離嗎？
2. **建立框架**：k-means 就是重複兩步——assignment step（每個點指派給最近的中心點）、update step（重新計算每群的平均當新中心點）,直到 assignment 不再變動或到 iteration 上限。
3. **深入核心**：assignment step 用 broadcasting 一次算完距離矩陣,不要寫巢狀迴圈。update step 要處理空簇——某個中心點完全沒分到點時,重新計算平均值會除以零,標準做法是把它重新初始化到離現有中心最遠的點。另外要提到初始化敏感度:隨機初始化容易收斂到局部最優,實務上會跑多次取 inertia(群內平方和)最小的那次,或改用 k-means++。
4. **收尾**：總結時間複雜度 O(n·k·d·iterations),並主動說明「生產環境會直接用 `sklearn.cluster.KMeans`,這裡手刻是為了證明我理解它內部在做什麼,包括它怎麼處理空簇和初始化」。

### 範例回答（面試時可以這樣講）

> **先確認範圍。** 我會先問收斂判定用什麼、能不能用 k-means++ 初始化,確認只能用 NumPy 不能叫 sklearn。確認清楚再動手比寫錯方向省時間。
>
> **寫核心迴圈。** assignment step 我會把資料點 reshape 成 `(n, 1, d)`、中心點 reshape 成 `(1, k, d)`,相減取範數一次拿到 `(n, k)` 距離矩陣,再用 `argmin` 取每個點最近的中心,這樣就不用寫巢狀迴圈。update step 對每個群用 `np.mean` 重新算中心,但先檢查有沒有群是空的——如果有,我會把它重新丟到目前離所有中心最遠的那個點,避免除以零。收斂判定用 assignment 向量跟上一輪比較,沒變就停,另外設一個 iteration 上限防止真的不收斂。
>
> **講初始化敏感度跟怎麼測。** 隨機初始化容易卡在局部最優,我會提我知道 k-means++ 的作法——按距離平方機率選下一個中心,讓初始點盡量分散,而且實務上通常跑幾次取群內平方和最小的那次。測試上我會準備一組三群分得很開的資料(答案一看就知道對不對)和一組刻意只有一個群的資料(測空簇邏輯),確認兩種情況都不會報錯。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 用 broadcasting 向量化距離計算，沒寫巢狀迴圈 | |
| 明確處理空簇（除以零的邊界情況） | |
| 提到初始化敏感度，知道 k-means++ 是什麼 | |
| 收斂判定與 iteration 上限都說清楚 | |
| 主動講出至少一組會測試邊界情況的輸入 | |
| 加分：複雜度分析 + 跟生產環境用現成函式庫的取捨 | |

## 延伸閱讀

- [Machine Learning Coding Interview Questions, in NumPy — Geodesic](https://geodesicpartners.co.uk/machine-learning-coding) — 把這輪最常考的陷阱整理成清單：softmax 在大 logit 下溢位、k-means 空簇、batch norm 的 train/eval 兩種變異數、AUC 同分排名
- [K Means Clustering interview questions and answers — Devinterview-io](https://github.com/Devinterview-io/k-means-clustering-interview-questions) — k-means 本身的常見面試問答，可以對照練習題的概念邊界
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — mini-batch gradient descent 的完整 NumPy 實作範例，示範向量化寫法

## 參考資料

- [Machine Learning Engineer Interview Questions (Updated 2026) — PracHub](https://prachub.com/positions/machine-learning-engineer) — 今日練習題（k-means clustering from scratch）來源
- [Machine Learning Coding Interview Questions, in NumPy — Geodesic](https://geodesicpartners.co.uk/machine-learning-coding) — 「只准 NumPy」的範圍契約、數值穩定性與邊界情況清單
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — mini-batch SGD 向量化實作對照
- [K Means Clustering interview questions and answers — Devinterview-io](https://github.com/Devinterview-io/k-means-clustering-interview-questions) — k-means 概念延伸對照
