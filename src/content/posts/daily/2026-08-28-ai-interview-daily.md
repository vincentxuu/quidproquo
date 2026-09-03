---
title: "AI Engineer 面試日練 — 2026-08-28：Coding（推論排程與除錯手刻）"
date: 2026-08-28
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "今日練 ML coding round 的新趨勢：讀別人的 ML 程式碼抓 bug、用狀態機拆解 LLM 推論排程、pandas 時序特徵防洩漏，以及 AUC-ROC 從零手刻。"
tldr: "2026 年的 ML coding round 不再只考「從零寫出來」，也考「看得懂別人寫壞的程式碼」。今天聚焦五個考點：LLM 推論排程的狀態機設計、debug 既有 ML 程式碼的方法、NumPy shape 陷阱、pandas 時序特徵的資料洩漏防範，以及 AUC-ROC 的從零手刻。練習題取自 Anthropic 近期一份公開流出的 OA 真題：簡化版 GPU 請求排程器。"
series:
  name: "AI Engineer 面試日練"
  order: 9
---

> 🌏 [English version](/en/posts/daily/2026-08-28-ai-interview-daily-en)

## 今日主題

ML coding round 在 2026 年多了一個新分支：不是給你一張白紙叫你從零寫演算法,而是丟給你一段「看起來能跑但其實有隱藏 bug」的 ML 程式碼,要求你在時限內讀懂邏輯、抓出問題、讓測試全過。這種題型比純手刻更貼近真實工作——資深工程師花在讀別人程式碼上的時間,遠比自己寫新程式碼多。

今天練的五個主題——LLM 推論排程的狀態機思維、debug 既有程式碼的策略、NumPy shape 陷阱、pandas 時序特徵防洩漏、AUC-ROC 手刻——剛好覆蓋 frontier lab OA 到傳統 FAANG coding round 的兩種出題風格,練完能同時應付「從零寫」和「讀懂並修好」這兩種面試官視角。

## 核心概念速記

### LLM 推論排程的狀態機設計

Anthropic 等 frontier lab 的 OA 開始考「簡化版 GPU 請求排程器」:每個請求要先經過 Prefill 階段(建立 KV Cache),再進入 Decode 階段(逐 token 生成),GPU 每個 timestep 有固定的批次容量上限。解這題的關鍵不是模擬真實的 vLLM,而是把它當成一個乾淨的狀態機——顯式定義 Waiting／Prefill／Decode／Finished 幾個狀態,用佇列管理轉移,每步結束立刻移除已完成的請求。

### Debug 既有 ML 程式碼的策略

面試官給你一段「看起來對但藏著 bug」的程式碼時,不要急著重寫。先跑一遍測試找出哪些 case 失敗,從最小的 edge case 開始修,每改一步就重跑測試,盡量維持最小改動而不是整段重寫。這個流程本身就是被打分的對象——面試官在看你有沒有系統化 debug 的習慣,而不是運氣好抓到 bug。

### NumPy Shape 陷阱

`(n,)`、`(n, 1)`、`(1, n)` 三種 shape 在數學上常常「看起來一樣」,但在 broadcasting、索引、矩陣運算裡行為完全不同。這是 debug 既有 ML 程式碼時最常見的 bug 來源,尤其是遞迴建構樹模型或手刻梯度更新時,一個不小心 squeeze 或 reshape 錯誤,就會讓程式在某些輸入下悄悄算錯而不拋例外。

### Pandas 時序特徵與資料洩漏

Rolling window 特徵(移動平均、標準差、極值)是時序 ML 常見的 pandas 手刻題,重點在正確處理視窗邊界——視窗不夠長時該回傳 NaN 還是用可得資料計算,以及最容易被面試官抓包的「用未來資料算現在的特徵」洩漏問題。判斷洩漏的方法很直接:這個特徵在預測當下的時間點,是不是真的已經可以取得。

### AUC-ROC 從零手刻

給定預測機率和標籤,手刻 AUC-ROC 的標準流程是:依預測機率排序、掃過所有可能的門檻值、在每個門檻算出 TPR 和 FPR、最後用梯形法則積分。面試官除了看你會不會寫,更常追問「AUC 0.92 但業務指標沒動,可能是什麼原因」——這把手刻題直接接回生產環境的模型評估判斷。

## 今日練習題

### 題目

「實作一個簡化版的 LLM 推論請求排程器。每個請求依序經過 Prefill(建立 KV Cache)與 Decode(逐 token 生成)兩個階段,GPU 每個 timestep 有固定的 token 批次容量上限。請設計資料結構與排程邏輯,正確處理請求的狀態轉移,並在容量超過上限時讓多的請求等到下一輪。」

**來源**：Anthropic OA 真題（2026 年公開流出案例）　**難度**：進階　**環節**：online assessment（take-home coding）

### 拆解思路

1. **先釐清問題**：問清楚容量上限指的是「這個 timestep 總共能處理的 token 數」還是「請求數量上限」;Prefill 和 Decode 的 token 是否共用同一個容量預算;請求進場順序是否要保序(FCFS)還是允許插隊;是否需要支援搶佔(preemption)。

2. **建立框架**：不要試著模擬真實 GPU 排程細節,把它當成純粹的狀態機——定義 `Waiting → Prefill → Decode → Finished` 四個狀態,每個狀態對應一個佇列。每個 timestep 依序:先讓 Decode 佇列裡的請求生成一個 token(優先權通常給已經在跑的請求,避免飢餓),再用剩餘容量從 Waiting 佇列拉新請求進 Prefill。

3. **深入核心**：最容易出錯、也是面試官最想聽你講清楚的三個地方——(a) 狀態轉移的順序限制:請求不能在 Prefill 完成前進入 Decode;(b) 容量檢查要在「加入這個 timestep 的批次之前」做,不能加完才發現超額;(c) 已完成的請求要立刻從佇列移除,否則會污染下一輪的排程決策。這三點對應到題目描述裡明講的三個常見失敗模式。

4. **收尾**：主動提一句「這只是排程正確性的簡化模型,真實系統像 vLLM 會用 continuous batching 和 PagedAttention 處理 KV Cache 的記憶體管理,但那是另一層優化,OA 要驗證的是狀態機本身有沒有寫對」,展現你知道這題的邊界在哪裡,不會過度工程化。

### 範例回答（面試時可以這樣講）

> 我會把這題完全當成狀態機來解,不去模擬真實 GPU 細節。**先定義四個顯式狀態**:`waiting`、`prefill`、`decode`、`finished`,用四個佇列(或一個帶 state 欄位的請求物件清單)管理。每個 timestep 分兩步走:第一步優先處理 Decode 佇列裡的請求,各生成一個 token,消耗 1 單位容量;第二步用剩餘容量,從 Waiting 佇列依序把請求搬進 Prefill,一旦 Prefill 完成就轉成 Decode 狀態,等下一個 timestep 開始生成。
>
> **容量檢查我會寫成「試算後再提交」的模式**:在把一個請求加進這個 timestep 的批次之前,先確認目前已用容量加上這個請求要用的量沒有超過上限,超過就讓它留在 Waiting,下一輪再試。這樣可以避免「加完才發現超額還要復原」的複雜邏輯。
>
> **狀態轉移我會寫斷言而不是假設**:比如 Decode 佇列裡不該出現還沒完成 Prefill 的請求,一旦生成到結束 token 就立刻標記 `finished` 並從 Decode 佇列移除,不留到下一輪才清。這些防禦性檢查看起來多餘,但正是這類 OA 隱藏測試最愛戳的地方。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 顯式定義 Waiting/Prefill/Decode/Finished 狀態 | |
| 容量檢查在加入批次「之前」而非之後 | |
| Prefill 未完成不能進入 Decode（狀態順序限制） | |
| 已完成請求當下 timestep 立刻移除 | |
| 有講清楚排程優先權（FCFS 或其他規則）與飢餓問題 | |
| 加分：提到 vLLM continuous batching / PagedAttention 作為生產環境延伸 | |

## 延伸閱讀

- [Anthropic OA Latest Review: Inference Engine + Extra Trees Debug](https://dev.to/interviewshow-cs/anthropic-oa-latest-review-inference-engine-extra-trees-debug-b9i) — 今天練習題的完整原題拆解，含 Extremely Randomized Trees debug 題的常見 NumPy shape 陷阱
- [The Machine Learning Engineer Interview Guide (2026) — TechScreen](https://techscreen.app/articles/machine-learning-engineer-interview-guide-2026) — 完整拆解 2026 年「debug 既有訓練迴圈」「讀 200 行舊程式碼找 bug」這類新型應用 ML coding 題型
- [Python Machine Learning Interview Questions for Data Scientists — Let's Data Science](https://letsdatascience.com/blog/python-machine-learning-interview-questions) — AUC-ROC、k-fold cross-validation 等從零手刻題的完整範例與常見錯誤

## 參考資料

- [Anthropic OA Latest Review: Inference Engine + Extra Trees Debug](https://dev.to/interviewshow-cs/anthropic-oa-latest-review-inference-engine-extra-trees-debug-b9i) — 今日練習題原題出處，以及「debug 既有程式碼」概念小節的三個常見失敗模式
- [The Machine Learning Engineer Interview Guide (2026) — TechScreen](https://techscreen.app/articles/machine-learning-engineer-interview-guide-2026) — Debug 既有訓練迴圈與讀舊程式碼題型的 2026 年趨勢描述
- [Python Machine Learning Interview Questions for Data Scientists — Let's Data Science](https://letsdatascience.com/blog/python-machine-learning-interview-questions) — NumPy shape 陷阱、AUC-ROC 從零手刻段落的參考來源
