---
title: "分數別騙自己，資料再做大——期中驗收週｜Stanford CS329Z 第 7 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 8
tldr: "Week 7 是期中驗收週：週一談資料選擇，週三談評分與 benchmark 設計；Zhu 等人教你別被自己的分數騙，SWE-smith 把軟體工程任務資料做到 5 萬題，讀完為 HW2 寫下第一版 4-tuple。"
description: "帶讀 Stanford CS329Z Week 7 三篇主讀物：agentic benchmark 最佳實踐檢查表、LLM 評審的人類對齊、SWE-smith 資料規模化管線，以及課程的 4-tuple 評估框架。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

Week 7 是期中驗收週。週一（11/2）談資料選擇與品質，週三（11/4）談評分基礎與 benchmark 設計。同一週週三晚上 11:59 要交 midpoint demo 的錄影（不在課堂上發表），週五要交 midway report。分數和資料同一週登場不是巧合：demo 影片要拿分數說話，報告要交代資料從哪來。

先給新手一個框架。課程把一次 agent 評估拆成 4-tuple。request 是你交辦的事，environment 是 agent 能動的世界。stopping criteria 管何時收工，scorer 負責判分。四個少一個，分數就站不住。

拿修 bug 當例子。request 是「修好這個 issue」，environment 是程式碼庫加終端機，stopping criteria 是交出 patch，scorer 是跑測試。後面三篇主讀物正好分工：[Zhu 等人的最佳實踐](https://arxiv.org/abs/2507.02825)在講 scorer 多容易寫錯，[Shankar 等人的驗證者研究](https://arxiv.org/abs/2404.12272)在講 LLM 幫忙打分要怎麼對齊人類，[Yang 等人的 SWE-smith](https://arxiv.org/abs/2504.21798)在講任務資料怎麼做大。

```diagram
title: 四元組是評估規格，不是四個步驟
desc: Request、environment、stopping criteria 與 scorer 共同定義一次修 bug 評估。
caption: 同框表示四項共同組成規格，不表示執行順序；停止與成功分開定義。
---
<svg viewBox="0 0 440 456"><rect class="dg-zone dg-zone--solid" x="8" y="8" width="424" height="440" rx="6"/><text class="dg-heading" x="220" y="40" text-anchor="middle" dominant-baseline="central">一次評估的規格</text><rect class="dg-box" x="32" y="72" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="96" text-anchor="middle" dominant-baseline="central">Request</text><text class="dg-sub" x="220" y="124" text-anchor="middle" dominant-baseline="central">修好這個 issue</text><rect class="dg-box" x="32" y="164" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="188" text-anchor="middle" dominant-baseline="central">Environment</text><text class="dg-sub" x="220" y="216" text-anchor="middle" dominant-baseline="central">程式庫與終端機</text><rect class="dg-box" x="32" y="256" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">Stopping criteria</text><text class="dg-sub" x="220" y="308" text-anchor="middle" dominant-baseline="central">交出 patch</text><rect class="dg-box dg-box--accent" x="32" y="348" width="376" height="76" rx="6"/><text class="dg-label" x="220" y="372" text-anchor="middle" dominant-baseline="central">Scorer</text><text class="dg-sub" x="220" y="400" text-anchor="middle" dominant-baseline="central">跑測試判分</text></svg>
```

## 先把考題寫完整，再相信分數

本週要把資料品質與評分器連起來。[官方課表](https://cs329z.stanford.edu/)將資料選擇排在 11/2、benchmark 設計排在 11/4。截至 2026-10-23 尚無公開投影片，因此本節按課表問題導讀指定閱讀，不杜撰未上課的內容。對要做繁中內部助理的讀者，最有用的起點是一個可重播、可判分的任務，而非先追排行榜。

### Request 與 environment：同一句話怎麼變成不同考題

「找出延期交付的原因」若能讀所有信件，與只給部分搜尋結果，是兩個不同任務。先固定信件快照、工具、權限與起始狀態，再定義請求。否則新版系統拿到更多資料，分數提高可能只是題目變容易。[Press 的 benchmark 指南](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/)用四元組把這些條件寫清楚。

### Stopping criteria 與 scorer：停止不等於成功

停止可以是交出答案、預算耗盡或明確失敗。Scorer 則獨立檢查答案是否指出正確原因、引用真的存在，以及有沒有把「可能」改成「已決定」。空答案不該因為沒說錯話就得滿分；同樣，格式正確也不等於完成任務。[ABC 論文](https://arxiv.org/html/2507.02825)的核心用途，是讓你系統性尋找這種規格漏洞。

### 用反例測評分器，再用資料改善系統

先自己寫幾份反例：空答案、只貼原文、引用對但結論錯、結論對但引用不存在。評分器若全放行，先修評分器。把有爭議的例子交給人類看，記錄分歧原因，再更新 rubric；[EvalGen](https://arxiv.org/html/2404.12272)提醒標準會隨實際輸出而演變。更新後重新標註，不把不同標準下的分數直接串成趨勢。

**理解檢查**：修好 scorer 後成功率下降，代表 agent 退步嗎？**答案判準**：不能直接比較。先用同一版本 scorer 重評舊系統和新系統，再檢查新規則是否更符合任務。



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

同屬週一的第三篇主讀物換了主角：[Shankar 等人問，LLM 幫忙打的分，要怎麼對齊人類](https://arxiv.org/abs/2404.12272)（UIST 2024）。人工評太貴、程式評太窄，所以大家拿 LLM 當評審；但評審模型繼承了被評模型的所有毛病，還得再驗一次。他們的做法叫 EvalGen，混合主動：系統自動生評分標準和實作（Python 函式或 grader prompt），過程中請人類為一小批輸出打分；這些回饋拿來挑跟人類最合的實作。

最值得記的是 criteria drift：你要先有標準才能打分，但打著打著才發現標準該長什麼樣；有些標準甚至依附在看過的輸出上，根本沒法事先寫下來。這對「評分獨立於觀察」的假設是正面一擊。HW2 寫 LLM-as-judge 之前，先讀這篇再動手。

**證據與結果。** 研究發現使用者在看過輸出後會修訂標準，並展示互動式工具如何協助形成與對齊validator。

### 深入要點

- Criterion是想量的品質，validator是其程式或prompt實作，兩者不應混為一談。
- 有爭議案例不只是雜訊，也可能揭露原標準沒有說清楚的價值選擇。

### Reviewer 一句話評

先校準評分者，再用評分者優化系統。

### 給你的 take-away

每次標準修改都版本化，重評固定案例，並留下人機分歧理由。

## 讀物 3｜Agentic Benchmark Checklist

原文：[Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825)

### TL;DR

ABC 從案例、文獻與建置經驗整理 outcome validity 與 task validity 的檢查，並用 CVE-Bench 示範修訂。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 任務與 scorer 的漏洞，會讓分數高估或低估多少？ |
| 證據與邊界 | 空回覆38%與 CVE-Bench33個百分點是特定 benchmark 案例；不是所有評估誤差的固定幅度。 |

### 領域背景

Agent benchmark 同時包含環境、任務與判分程式；任何一層漏洞都可能使漂亮分數失去意義。

### 中階導讀

**方法。** 依檢查表掃描任務建置、環境與scorer，用能利用漏洞的trivial agent檢驗評估。

Zhu 等人的論文開門見山：很多 agentic benchmark 的題目設定或獎勵設計有坑。兩個點名案例：[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) 測試案例不足，[TAU-bench](https://arxiv.org/abs/2406.12045) 把空回應也算過關——交白卷的 trivial agent 在航空子集拿下 38% 成功率。這類坑會讓分數低估或高估，幅度可達一倍。

作者群給的解法是 [Agentic Benchmark Checklist（ABC）](https://arxiv.org/abs/2507.02825)。它從實作經驗、文獻回顧和已知事故歸納出一套檢查項。拿它去掃現有 benchmark，分數真的會動：在設計複雜的 [CVE-Bench](https://arxiv.org/abs/2503.17332) 上走一遍，高估幅度少了 33 個百分點。

**證據與結果。** ABC在具體benchmark發現空回應過關與測試不充分等問題，證明評分程式的有效性需要另外檢查。

### 深入要點

- Outcome validity檢查判分是否反映真正成功；task validity檢查任務本身是否測到宣稱的能力。
- 高估與低估都可能存在，修scorer後分數降低不等於agent能力退步。

### Reviewer 一句話評

把考卷本身也當成需要測試的軟體。

### 給你的 take-away

先用空答案、錯誤證據與部分完成的反例攻擊自己的 scorer。

## 讀物 4｜LIMA

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

## 讀物 5｜How to Build Good Language Modeling Benchmarks

原文：[How to Build Good Language Modeling Benchmarks](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/)

### TL;DR

指南用 request、environment、stopping criteria、scorer 定義任務，將任務設計與分數連起來。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | Benchmark 如何同時自然、可評分，又有挑戰？ |
| 證據與邊界 | 這是設計指南，不是保證採用四元組就沒有資料污染或評分漏洞。 |

### 領域背景

只描述輸入和答案，會漏掉 agent 能碰的世界、預算與停止條件，讓同名評估不可比較。

### 中階導讀

**方法。** 先將一題拆成四元組，再檢查任務是否自然、可自動驗收且對目標系統有挑戰。

**證據與結果。** 指南提供可寫進任務規格的條件，讓開發者討論自然性、可判分性與難度，而非只追總題數。

### 深入要點

- Stopping定義何時收工，scorer定義做得好不好；兩者可以同時回報超時與失敗。
- 環境權限與工具可用性會改變題目難度，必須跟request一起版本化。

### Reviewer 一句話評

四元組讓隱含的題目條件變得可討論。

### 給你的 take-away

把一題寫成完整四元組，請另一個人只看規格重播與判分。

## 讀物 6｜tinyBenchmarks

原文：[tinyBenchmarks](https://arxiv.org/abs/2402.14992)

### TL;DR

作者用選題與統計估計方法，從精選子集預測完整評測的 accuracy。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 完整 benchmark 太貴，能否用少量題估計表現？ |
| 證據與邊界 | 約100題對MMLU的結果依賴選題與模型分布，不等於任意100題都保留排名。 |

### 領域背景

完整評測費用高，但題目之間常含重複訊息；縮小評測要處理代表性與估計誤差。

### 中階導讀

**方法。** 利用既有模型的題目反應挑代表性案例，再以估計程序補回未跑題目的資訊。

**證據與結果。** 作者在MMLU等評測上展示少量選題可估計完整表現，節省成本來自代表性與估計器，而非隨機刪題。

### 深入要點

- 要分開報告估計誤差與模型差距；兩模型差距小於誤差時，排名不應過度解讀。
- 模型分布變化後，原子集可能不再代表新模型，需重新校準。

### Reviewer 一句話評

小測的可信度來自校準，而非題數夠少。

### 給你的 take-away

先用完整評測校準子集誤差，再把小測用於迭代，最後保留完整驗收。


## 怎麼做：為 HW2 寫下你的 4-tuple

**怎麼做**：為 HW2 暖身，給自己的 agent 寫下 4-tuple。request 用一句話寫交辦事項，environment 列出它能碰的工具與資料，stopping criteria 寫明什麼算做完，scorer 先寫一個最陽春的版本。寫完拿 Zhu 等人的案例反問自己：我的 scorer 會不會把空回應算過關。這張紙就是 midway report 評估章節的草稿。

## 它在課程裡的位置

Week 7 之後就是驗收：週三交的 demo 錄影拿分數說話，週五報告交代資料與方法。[Week 6](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel) 談資料飛輪，Week 7 補上另一半：分數怎麼寫才不會騙自己。把 4-tuple 寫好，HW2 的題目定義就完成一半。

## 本週 Course Material 對照

- 週一 11/2 Data Selection & Quality：主讀物 SWE-smith、Who Validates the Validators?（本文已導讀）。延伸閱讀 [Zhou 等人 LIMA](https://arxiv.org/abs/2305.11206)：只用 1,000 條精心篩選的問答做 supervised fine-tune，不做 RLHF；人類評測裡 43% 的回覆不輸 GPT-4。論點是知識都在預訓練學完，對齊重質不重量。
- 週三 11/4 Evaluation Fundamentals & Benchmark Design：主讀物 Zhu 等人最佳實踐（本文已導讀）。延伸閱讀 [Press 談怎麼做好的 LM benchmark](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/)：好 benchmark 要 natural、automatically evaluable、challenging；他還警告別讓同一個 LM 又當選手又當裁判。文末把單一任務寫成 request–environment–stopping criteria–scorer 的 4-tuple，正是本週框架的出處。延伸閱讀 [Polo 等人 tinyBenchmarks](https://arxiv.org/abs/2402.14992)：MMLU 的 1.4 萬題不必全跑。作者用約 100 題的精選子集估計完整 MMLU 表現；這依賴選題與估計方法，不能保證任意 100 題都維持排名。評測貴在具代表性，不在題海。
- 課表原文：[CS329Z 官網 Week 7](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。

- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。


- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：期中 demo 改為錄影繳交（週三 11/4 晚上 11:59 截止，不在課堂發表），同步改寫開頭與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[Week 6：資料飛輪](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yang et al., SWE-smith](https://arxiv.org/abs/2504.21798)、[Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272)、[Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)
