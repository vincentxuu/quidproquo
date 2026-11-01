---
title: "改 prompt、改權重，還是想久一點：agent 優化三軸｜Stanford CS329Z 第 9 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 10
tldr: "Lecture 09 先問優化何時划算，再比較 context 優化（few-shot bootstrapping、MIPROv2、OPRO、TextGrad、GEPA）、權重優化（SFT、PPO、GRPO、on-policy distillation）與讓 agent 當優化器。讀物涵蓋 test-time compute、GEPA、BetterTogether 與 MIPRO，最後收斂成 HW1 交卷前的三件事。"
description: "依實體頁碼帶讀 CS329Z Lecture 09 Optimization 投影片，再深讀 test-time compute、GEPA、BetterTogether 與 MIPRO，說明何時改 prompt、何時改權重，以及 HW1 收尾怎麼分配時間。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 9 堂（10/21，Optimization）換了一個問題：不管單幹還是開會，系統可以從三個地方改善。改 prompt（換說明書）、改權重（換腦袋）、加推理算力（想久一點）。投影片先問優化什麼時候值得，再逐一比較 context 優化、權重優化，以及 Darwin Gödel Machine 這類讓 agent 自己當優化器的做法。

指定讀物是 Agrawal 等人的 [GEPA](https://arxiv.org/abs/2507.19457)、Opsahl-Ong 等人的 MIPRO 與 DeepSeekMath。本文深讀 GEPA 與 MIPRO，另讀 Snell 等人的 [test-time compute 論文](https://arxiv.org/abs/2408.03314)與 BetterTogether。時間點很現實：[HW1 在 10/30 截止](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，這篇幫你決定最後的力氣花在哪一軸。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 09 投影片導讀：讓證據決定優化哪一層

<div class="slide-reader" data-slide-reader data-pages="125" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf">
<p>Lecture 09: 125 頁 PDF。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf" target="_blank" rel="noopener noreferrer">原始 PDF</a></p>
</div>

### 第 1–11 頁：優化先有三個支柱

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=1" data-slide-page="1">投影片第 1–11 頁</a>

資料、可執行系統與評估必須一起存在。先把可靠性、領域需求或成本問題寫成能測的目標，再談搜尋 prompt。若指標只獎勵語氣，優化器可能把錯誤說得更流暢；若需要的行為無法靠文字指令穩定表達，示範與回饋才有價值。

### 第 12–22 頁：Few-shot：挑例子，也挑順序

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=12" data-slide-page="12">投影片第 12–22 頁</a>

投影片先用 few-shot 的順序敏感性說明，內容相同不表示效果相同。STaR 與 DSPy 的 bootstrapping 從成功推理或任務軌跡建立可用材料；先跑出候選，再用指標篩選，避免把所有生成都當成好示範。這是資料與評估共同決定 context 的例子。

### 第 23–69 頁：反思式搜尋：MIPROv2 到 GEPA

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=23" data-slide-page="23">投影片第 23–69 頁</a>

MIPROv2 的長動畫其實只有三個階段：蒐集成功示範、根據程式與資料提出指令、搜尋指令與示範組合。小批量測試提供便宜回饋，定期完整評估再檢查候選。TextGrad 把文字回饋往模組傳，GEPA 讀失敗軌跡反思並保留互補候選。不要把一張結果圖讀成任何工作負載的通用保證。

### 第 70–104 頁：權重：誰產生軌跡，誰提供回饋

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=70" data-slide-page="70">投影片第 70–104 頁</a>

SFT 用教師完成任務的軌跡訓練學生；RL 讓學生自己操作，由結果獎勵更新。PPO 與 GRPO 的比較在說明 value 與群組相對回饋的差別；on-policy distillation 則在學生自己產生的路徑上取教師分布回饋。**理解檢查**：只有離線教師成功紀錄，不能重新操作環境，先試哪條？**答案判準**：SFT；不能直接假設已具備 RL 的互動與獎勵。

### 第 105–116 頁：Agent 也能改 harness，但評估必須可信

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=105" data-slide-page="105">投影片第 105–116 頁</a>

Darwin Gödel Machine、Meta-Harness 與 auto-research 都把修改、實驗與保留有效版本接成迴圈。它們改的是系統設計或研究流程，並不等於模型權重自己更新。本文建議將驗收條件放在改寫範圍之外，並保存實驗設定與失敗，避免優化變成挑最好看的分數。

### 第 117–125 頁：選擇策略：條件比口號重要

<a href="https://web.stanford.edu/class/cs329z/slides/lecture09.pdf#page=117" data-slide-page="117">投影片第 117–125 頁</a>

BetterTogether 展示 prompt 與權重可以交替改善。只有 API、任務常變或環境執行昂貴時，context 優化可能是較可行的起點；有強教師、想部署較便宜學生或 context 過長時，再評估權重方案。資料、算力、模型存取與驗收可靠性共同決定路線；未定位的失敗不能直接推論需要微調。

## 用資料決定改哪裡：Lecture 09 的選擇方式

[Lecture 09](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)先要求三樣東西一起存在：資料、可執行的系統、評估與指標。若「好答案」還沒定義，優化器只會更有效率地追逐模糊目標。成功率之外，也要測成本與延遲；資料要分成調整用與保留驗收用，避免把看過的題目記熟誤認為泛化。

Context optimization 不只改一句 system prompt。Few-shot 路線先從成功軌跡建立示範，再搜尋有用的組合；MIPROv2 同時提出指令與示範候選，用小批量評估更新搜尋。反思式路線把失敗軌跡與回饋交給模型，讓它提出下一個修改。這說明了為什麼只存最後分數不夠：工具回傳錯在哪，才可能告訴你哪個模組該改。

| 手上的條件 | 優先試驗 | 要先確認的事 |
|---|---|---|
| 只有 API、常換任務、環境執行昂貴 | Context／prompt 優化 | 評估是否涵蓋真實失敗 |
| 有好教師，要把任務移到較便宜學生 | SFT／蒸餾 | 教師軌跡品質與多樣性 |
| 學生能互動，任務結果可驗證 | RL | 獎勵是否反映真正完成 |
| 某些題目重試會改善，且有可靠 verifier | 增加推理算力 | 增益是否值得成本與延遲 |

這張表是根據講義整理的試驗起點，不是互斥選單。講義用 BetterTogether 說明 prompt、權重、再 prompt 可以交替；也談到讓 agent 修改 harness、跑實驗、保留有效改動。越能自動探索，越要把評估固定在它不能任意改寫的地方，並保留未用於調參的題目。

## 讀物 1｜Scaling Test-Time Compute

原文：[Scaling Test-Time Compute](https://arxiv.org/abs/2408.03314)

### TL;DR

研究把 proposer 與 verifier 接起來，比較搜尋與修訂在不同題目難度下的配置；選法隨模型能力與預算改變。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 同一筆推理預算要用在搜尋，還是逐次修訂？ |
| 證據與邊界 | 主要證據來自數學題與特定 verifier；不能直接推論企業 email 任務也有同等收益。 |

### 領域背景

推理階段可以產生更多候選，也可以沿同一答案持續修訂；兩者消耗相近資源，失敗型態卻不同。

### 中階導讀

**方法。** 以相同推理預算比較平行候選、逐次修訂與verifier搜尋，再按難度分析效果。

Snell 那篇守推理算力軸。它把 test-time compute 拆成兩招：對 process verifier 做搜尋，以及讓模型迭代改自己的答案。論文研究修訂與搜尋的效益如何隨題目難度和預算改變；在 [MATH](https://arxiv.org/abs/2103.03874) 上的實驗支持按情況配置算力。它沒有證明 email 助理「怎樣都答不對」就必須改權重：漏檢索、工具失效、評分標準出錯，也會長得一樣。先看失敗軌跡，才能選優化方向。

**證據與結果。** 作者觀察到搜尋與修訂的相對收益會隨題目難度改變，支持按條件分配而非平均增加算力。

### 深入要點

- Proposer 改變候選答案的分布，verifier 則決定如何篩選候選，兩者是不同瓶頸。
- 若verifier偏好錯誤答案，增加搜尋可能更常挑中看似高分的錯解。

### Reviewer 一句話評

增加思考預算有價值的前提，是知道如何選出較好的嘗試。

### 給你的 take-away

固定題目與成本上限，分別試候選搜尋與修訂，連同失敗型態一起比較。

## 讀物 2｜GEPA

原文：[GEPA](https://arxiv.org/abs/2507.19457)

### TL;DR

GEPA 讀執行軌跡與回饋，反思 prompt 改動，並以 Pareto 候選保留不同題目上的互補優勢。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 只看總分，怎麼知道應該改哪個模組的 prompt？ |
| 證據與邊界 | 論文比較受限於任務、模型與 rollout 預算；標題的 outperform 不是任意部署的保證。 |

### 領域背景

複合系統可能在檢索、工具或摘要任一處失敗；總分只告訴你結果，軌跡才保留修改線索。

### 中階導讀

**方法。** 選一個候選系統、執行小批案例、讀軌跡反思並提出prompt改動，再評估是否保留或合併。

GEPA 守 prompt 軸。它看著系統跑出來的軌跡（推理、工具呼叫、工具輸出）用自然語言反思，診斷哪裡壞、該改哪句 prompt。多次嘗試裡互補的經驗，再從 Pareto 前沿合起來。[開源實作](https://github.com/gepa-ai/gepa)把這個循環具體化：提出 prompt 改動、執行、檢查回饋，再保留有用的候選。Lecture 09 把 GEPA 與 MIPROv2、TextGrad 放在同一條反思式優化脈絡，並不保證某個優化器在你的工作負載一定勝出。

**證據與結果。** 論文在多個複合系統配置中比較優化器與預算，顯示自然語言軌跡回饋可提供比單一reward更細的修改線索。

### 深入要點

- 反思需要看到哪次工具回覆導致錯誤；只給最終成功或失敗，會失去模組歸因。
- Pareto候選保留不同題目上的優勢，避免用單一平均分數過早丟掉互補策略。

### Reviewer 一句話評

反思的價值在讀懂可行動的回饋，而非再多產生一段自我評論。

### 給你的 take-away

在失敗紀錄中保留工具參數與回覆，讓反思能指出具體模組，再用保留題驗收。

## 讀物 3｜BetterTogether

原文：[BetterTogether](https://aclanthology.org/2024.emnlp-main.597/)

### TL;DR

BetterTogether 交替進行 prompt 優化與微調，讓前一階段改善後的系統產生下一階段可用資料。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | Prompt 與權重優化會不會互相改變彼此的最佳起點？ |
| 證據與邊界 | 結果限於論文的問答與推理配置；交替不是無條件更便宜或更好。 |

### 領域背景

Prompt 會改變模型的輸出分布，微調也會改變模型對指令的反應，因此兩者可能相互影響。

### 中階導讀

**方法。** 在可評估的程式上交替產生訓練材料、微調與prompt搜尋，保留各階段的對照。

**證據與結果。** 在論文的多跳問答與數學推理設定中，組合策略優於只調prompt或只調權重的比較設定。

### 深入要點

- 微調後最好的prompt可能改變，舊prompt不應自動視為新權重的最佳搭配。
- 成功軌跡也可能缺乏多樣性，反覆自教需檢查資料分布是否縮窄。

### Reviewer 一句話評

先後順序本身也是系統設計的一部分。

### 給你的 take-away

保存每一階段版本與成本，驗收組合是否真的優於單獨優化。

## 讀物 4｜MIPRO

原文：[MIPRO](https://arxiv.org/abs/2406.11695)

### TL;DR

MIPRO 根據程式、資料與成功軌跡提出候選，使用代理評估搜尋跨模組的組合。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 多階段程式中，指令和示範如何一起挑選？ |
| 證據與邊界 | 原文報告最高約 13% accuracy 改善；這是指定任務與模型的比較，不是每段模組各增 13%。 |

### 領域背景

多階段程式的指令彼此相依，逐段挑局部最佳不一定得到端到端最佳。

### 中階導讀

**方法。** 先bootstrap示範，再提出多個指令，最後用代理搜尋組合指令與示範。

**證據與結果。** 論文在七個多階段程式中的五個優於比較優化器；收益依程式與候選搜尋而異。

### 深入要點

- 候選指令有程式、資料與成功軌跡作脈絡，避免完全盲目改寫。
- 小批量評估降低搜尋成本，但選出的候選仍需較完整評估確認。

### Reviewer 一句話評

聯合搜尋把指令與示範一起評估，代價是必須有可信的指標。

### 給你的 take-away

把模組級 prompt 與示範一起版本化，保留端到端評分以檢查跨模組歸因。

## HW1 收尾：交卷前只做三件事

第一，鎖骨架。[第 6 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)與[第 7 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory) 把 [ReAct](https://arxiv.org/abs/2210.03629) 迴圈形狀和記憶分層定下來之後就別再改，凍結一個能跑的版本當對照組。第二，把 harness 補齊：HW1 要的不只是會查信的 pipeline，還有工具、terminal、記憶和人類介入。缺哪塊先補哪塊，每補一塊就拿同一組 email 題對凍結版跑一次。第三，錯誤分析三行寫好：哪類題目最常失敗、失敗落在檢索還是推理、人類介入在哪裡攔下了錯。

**怎麼做**：依尚缺的項目分配剩餘時間：鎖骨架、補齊 harness 並逐塊對照，再預留錯誤分析與收尾。每天只動一軸：今天改 prompt，明天加算力，後天才考慮拆 agent。混著調的失敗是沒法寫進報告的。

## 它在課程裡的位置

第 9 堂讓證據決定優化哪一層，但證據要從評估與資料來。下一週[第 10 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench)由 Terminal-Bench 作者談怎麼寫可驗證的評估任務，第 11 堂再談 agent 需要什麼資料。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Optimization — Lecture 09](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
- 指定閱讀：Agrawal 等人〈GEPA〉（本文深讀）、Opsahl-Ong 等人〈Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs〉（本文深讀）、Shao 等人〈DeepSeekMath〉
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 9（10/21 週三）的內容，原屬「第 5 週：該單幹還是開會」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依 Lecture 08–09 補入協調、worktree、權重優化與依評估選策略，新增完整教學例子、圖解與理解檢查。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、語料換成企業 email、改成不用框架的完整 harness），改寫「HW1 收尾」的十天計畫與各節「怎麼做」裡的作業對應
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 8 堂：Multi-Agent Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent)、[第 10 堂：Terminal-Bench 客座](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 講義：[Lecture 09: Optimization](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Snell et al., Scaling LLM Test-Time Compute Optimally, ICLR 2025](https://arxiv.org/abs/2408.03314)、[Agrawal et al., GEPA, arXiv 2025 (ICLR 2026 Oral)](https://arxiv.org/abs/2507.19457)
- 工具：[GEPA](https://github.com/gepa-ai/gepa)
