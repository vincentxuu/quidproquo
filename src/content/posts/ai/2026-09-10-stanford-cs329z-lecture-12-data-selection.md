---
title: "資料不是越多越好：挑選、驗證與品質｜Stanford CS329Z 第 12 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 13
tldr: "第 12 堂依課表談找出最有資訊量的資料、篩選策略、小而精準的 benchmark、標註實務、品質評估，以及從 agent 軌跡建資料集。讀物 SWE-smith 示範怎麼把軟體工程任務資料做大，Who Validates the Validators 談 LLM 評分怎麼對齊人類，LIMA 則說明少量高品質資料的效果。"
description: "依課表與指定閱讀預習 Stanford CS329Z 第 12 堂 Data Selection & Quality：深讀 SWE-smith、Who Validates the Validators 與 LIMA，說明資料規模、品質與驗證者對齊。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 12 堂（11/2，Data Selection & Quality）接著上一堂的資料飛輪，問下一個問題：資料收進來之後，哪些值得留？課表列出的主題是找出最有資訊量的資料、篩選與選擇策略、小而精準的 benchmark、標註實務、品質評估，以及從 agent 軌跡建資料集。

指定讀物是 Yang 等人的 [SWE-smith](https://arxiv.org/abs/2504.21798) 與 Shankar 等人的 [Who Validates the Validators?](https://arxiv.org/abs/2404.12272)，延伸閱讀是 Zhou 等人的 LIMA。三篇本文都深讀：SWE-smith 談任務資料怎麼做大，驗證者研究談 LLM 幫忙打分要怎麼對齊人類，LIMA 則提醒少量高品質資料能走多遠。截至 2026-10-29，這堂還沒有公開投影片，本文是依官方課表與指定閱讀寫的預習，不代表講師在課堂上說過的內容。第 11 堂以後的堂次編號依課表順序推算，官網目前只列日期與主題。

## 讀物 1｜SWE-smith

原文：[SWE-smith](https://arxiv.org/abs/2504.21798)

### TL;DR

流程先建立執行環境，再合成會使現有測試失敗的變更，產生可驗證任務與訓練軌跡。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 軟體工程 agent 的訓練任務，如何從少量人工整理擴大？ |
| 證據與邊界 | 5 萬題、128 個 repo 與 40.2% Pass@1 都是作者當時的資料與模型結果；不是現今排行榜宣稱。 |

### 領域背景

真實 issue 整理、環境安裝與測試驗證都會限制訓練資料規模，單純生成題目文字還不夠。

### 中階導讀

**方法。** 先挑repo並安裝環境，再用不同破壞策略產生候選、跑測試篩選，最後收集解題軌跡。

換邊看資料。[SWE-smith](https://arxiv.org/abs/2504.21798) 處理的痛點很具體：早期部分軟體工程訓練資料的repo覆蓋有限，整理流程還要大量人工。這不是所有資料集都少於某個repo數的現況宣稱。做法是反過來：給定任意 Python 程式碼庫，先建好執行環境，再自動合成會弄壞現有測試的任務。

用這條管線造出的資料集橫跨 128 個 GitHub repo。總題數來到 5 萬。拿它訓出的 SWE-agent-LM-32B 在 SWE-bench Verified 的一次解題率達到 40.2%，這是作者當時的受測結果，不作現今排名宣稱。

**證據與結果。** 作者以管線建立超過5萬個任務，並展示用這些資料訓練軟體agent的效果；資料生成與模型評估是兩個階段。

### 深入要點

- 「使測試失敗」提供可執行訊號，仍要避免把不合理的破壞當成有價值bug。
- 環境安裝與驗證成本會影響哪些repo能進資料集，因此repo數不等於真實開發全貌。

### Reviewer 一句話評

可執行的驗證把合成任務變成較可檢查的訓練材料。

### 給你的 take-away

先確認現有測試真能抓到任務失敗，再擴增資料；用獨立 repo 或題集測轉移。

## 讀物 2｜Who Validates the Validators?

原文：[Who Validates the Validators?](https://arxiv.org/abs/2404.12272)

### TL;DR

EvalGen 讓系統提出評分標準與實作，人類標註少量輸出，再選與人類判斷對齊的 validator。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 評分標準會隨看過的答案改變，LLM grader 怎麼跟上？ |
| 證據與邊界 | Criteria drift 表示標準也在改，不能把不同 rubric 下的分數直接視為趨勢。 |

### 領域背景

開放式品質沒有單一標準答案，人類往往看過實際輸出後，才知道規則還缺什麼。

### 中階導讀

**方法。** 讓人先定義或選擇criteria，系統產生候選validator，再用人工標記的輸出回選實作。

這堂的另一篇主讀物換了主角：[Shankar 等人問，LLM 幫忙打的分，要怎麼對齊人類](https://arxiv.org/abs/2404.12272)（UIST 2024）。人工評太貴、程式評太窄，所以大家拿 LLM 當評審；但評審模型繼承了被評模型的所有毛病，還得再驗一次。他們的做法叫 EvalGen，混合主動：系統自動生評分標準和實作（Python 函式或 grader prompt），過程中請人類為一小批輸出打分；這些回饋拿來挑跟人類最合的實作。

最值得記的是 criteria drift：你要先有標準才能打分，但打著打著才發現標準該長什麼樣；有些標準甚至依附在看過的輸出上，根本沒法事先寫下來。這對「評分獨立於觀察」的假設是正面一擊。HW2 寫 LLM-as-judge 之前，先讀這篇再動手。

**證據與結果。** 研究發現使用者在看過輸出後會修訂標準，並展示互動式工具如何協助形成與對齊validator。

### 深入要點

- Criterion是想量的品質，validator是其程式或prompt實作，兩者不應混為一談。
- 有爭議案例不只是雜訊，也可能揭露原標準沒有說清楚的價值選擇。

### Reviewer 一句話評

先校準評分者，再用評分者優化系統。

### 給你的 take-away

每次標準修改都版本化，重評固定案例，並留下人機分歧理由。

## 讀物 3｜LIMA

原文：[LIMA](https://arxiv.org/abs/2305.11206)

### TL;DR

LIMA 用 1000 組精選示範進行 supervised fine-tuning，研究對齊資料品質而非單純擴量。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 少量精選示範能否教會已預訓練模型回應格式？ |
| 證據與邊界 | 43% 是特定人工偏好比較中與 GPT-4 相當或更被偏好的比例，不是通用能力超越。 |

### 領域背景

預訓練能力與指令對齊是不同階段，少量資料能研究後者，卻不代表知識可以憑空產生。

### 中階導讀

**方法。** 以精選prompt-response資料微調預訓練模型，再用未見題的人類偏好比較驗證。

**證據與結果。** 在受控人工偏好評估中，少量精選SFT資料得到有競爭力回覆；作者據此提出對齊主要教格式的假說。

### 深入要點

- 這個假說依賴強預訓練底座；拿掉既有能力，不能期待相同少樣本效果。
- 偏好中的平手與勝出合計，不能翻譯成單獨勝率或事實正確率。

### Reviewer 一句話評

精選示範的價值不能被誤讀成所有任務都只需要少量資料。

### 給你的 take-away

先整理代表真實失敗的高品質示範，再比較增加數量是否帶來額外價值。

## 它在課程裡的位置

第 12 堂決定資料要留什麼，[第 13 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks)把評估規格寫完整。同一週週三晚上要交期中 demo 錄影，週五交期中報告，報告要交代資料從哪來。

## 本堂 Course Material 對照

- 官方投影片：尚未公開（截至 2026-10-29）
- 指定閱讀：Yang 等人〈SWE-smith: Scaling Data for Software Engineering Agents〉（本文深讀）、Shankar 等人〈Who Validates the Validators?〉（本文深讀）
- 延伸閱讀：Zhou 等人〈LIMA: Less Is More for Alignment〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 12（11/2 週一）的內容，原屬「第 7 週：分數別騙自己，資料再做大」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：期中 demo 改為錄影繳交（週三 11/4 晚上 11:59 截止，不在課堂發表），同步改寫開頭與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 11 堂：Data for Agentic Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents)、[第 13 堂：Evaluation Fundamentals & Benchmark Design](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yang et al., SWE-smith](https://arxiv.org/abs/2504.21798)、[Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272)
