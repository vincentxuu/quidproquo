---
title: "Stanford CS224V 第 11 講：把臨床試驗條件翻成 SMT，而不是讓 LLM 直接判資格"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, formal-methods, smt, semantic-parsing]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 12
tldr: "這堂把病人紀錄與試驗條件各自轉成 SMT，先以較弱的命題邏輯投影做大規模候選檢索，再用 solver 檢查候選；推理可解釋，但 NL-to-SMT 仍是主要錯誤入口。"
description: "CS224V Natural Language Constraints with SMT：臨床試驗配對、SMT 表示、PL projection、候選檢索、solver matching 與限制。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-natural-language-smt-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第十一講是一個形式方法研究案例，不是醫療建議。它問：病人紀錄與臨床試驗 eligibility criteria 都是自然語言時，如何在大量候選中找出「約束可同時成立」的配對？課程不讓 LLM 直接下資格判決，而是把語言轉成 solver 能檢查的表示。

## Agenda：從既有 matching 到 SMT pipeline

講義先說明 clinical-trial matching 的規模與既有 retrieval-plus-LLM 方法，再介紹 SMT、資料集與表示。後半完整走過 NL-to-SMT、SMT-to-propositional-logic projection、大規模 retrieval、候選 SMT matching、錯誤分析與限制。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

## 試驗條件是一組邏輯約束

「至少兩年過敏性鼻炎病史」同時包含布林事實與數值比較；排除條件還會有否定、or、時間與醫療概念階層。SMT 可以同時表達 Boolean、Real 與關係式。病人紀錄也轉成 assertions，solver 再檢查病人與試驗約束合併後是否 satisfiable。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

這比 prompt 判斷多了可檢查的中間物：變數、assertions 與 solver 結果。但 solver 不懂醫療語意；所有有用資訊都必須由 parser 正確形式化，術語 canonicalization 也要依 SNOMED CT 類體系處理。

## Clinical trial matching 有三種不同問題

講義先區分基本 pairwise matching、替一位病人找合適 trials，以及替一個 trial 從大量病歷找 cohort。第一種問一個 patient/trial pair 是否 eligible；第二種先從龐大 trial collection retrieval，再逐候選 match；第三種方向相反，還涉及醫療機構資料權限與大量病人 records。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

三種問題不能用同一個 accuracy 敷衍。Pairwise dataset 可能預先給相關 trial，沒有測 retrieval；patient-to-trials 需要 ranking 與 recall；cohort discovery 更在意不能漏掉可能符合者，也不能把不符合者送進後續臨床流程。Lecture 的 SMT-PL pipeline 正是為規模與 reasoning 分工。

投影片回顧 TrialGPT 與其他 LLM matching 工作，指出 retrieval 後讓 LLM 比較病歷與 criteria 是常見做法。錯誤可能來自 retrieval miss、長 criteria 遺漏、否定／時間理解或模型直接做醫療判斷。形式方法的提案不是說既有系統毫無價值，而是把 eligibility constraints 從自由文字推理移到明確公式。

## SMT 比 propositional logic 多表達什麼

命題邏輯可以表示 `has_asthma`、`is_smoker` 等真假，但不能自然表示「病史至少一年」「年齡介於十八與六十五」「某數值低於門檻」。SMT 在 Boolean 之外加入 Real、Integer、String 等 theories 與比較，因此能把數值、時間長度與邏輯組合放進同一 solver。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Lecture 的 inclusion example 把季節性過敏性鼻炎與慢性氣喘分解成 diagnosis facts、duration variables 與 implications。`chronic` 或 `duration_at_least_1_year` 不是自然語言標籤而已，還要連到基本 diagnosis；solver 才能知道複合概念如何 entail 較一般概念。

Exclusion criteria 需要否定與 disjunction。Patient record 也可能寫「denies smoking, diabetes...」，parser 必須把否定 scope 正確套到每個 finding。若漏一個 `not`，solver 會非常一致地對錯公式推理。Formal reasoning 的可靠性與 semantic parsing fidelity 必須分開報告。

## Patient record 與 trial criteria 如何共用 vocabulary

兩邊自然語言可能用不同詞描述同一醫療概念。Trial 寫 allergic rhinitis，病歷用 hay fever；若 parser 建不同 Boolean variables，solver 看不出它們相關。Canonicalization 需要 ontology 或 controlled terminology，把 aliases 對到同一 concept ID。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

講義以 SNOMED CT 的 top-level classes 與大量 clinical terms 說明這件事很難。Ontology 有 hierarchy、synonyms 與 relations，parser 還要決定句中概念是 finding、procedure、substance 或 observable。只做字串 normalization 不足以處理 clinical meaning。

Canonicalization error 可分 entity miss、wrong concept 與 granularity mismatch。病歷只有 asthma，trial 要 chronic asthma 時，不能自動把一般概念提升成更具體；但 chronic asthma 可以 entail asthma。Directionality 應由 ontology/constraints 表達，不能靠 LLM 常識暗中補。

## Unknown 不等於 false

病歷沒寫某疾病，不代表病人沒有。Closed-world database 常把缺值當 false，clinical record 則多半是 unknown。SMT representation 必須區分 asserted true、asserted false 與未提及，否則大量 missing facts 會被錯當符合 exclusion 或 inclusion。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Eligibility 還可能依醫師判斷、檢驗時點或「適當治療後」等 soft/subjective constraints。Lecture 把 hard 與 soft distinction 列為 disadvantage，因為 solver 只能處理被形式化的明確規則。遇到無法可靠形式化的條件，系統應標 needs review，而不是創造一個 Boolean。

這也影響 solver output。SAT 只表示目前 assertions 與 constraints 可同時成立，不等於現實世界已證明病人符合；UNSAT 也可能是 parser 加入錯誤 assertion。需要第四種 workflow state：insufficient/uncertain information，交給資料補充或專家。

## NL-to-SMT parser 的輸出契約

Parser 需要產生 declarations、assertions 與原句 alignment。每個 variable 應有 type、canonical concept、source span 與 polarity；每條 constraint 保存它由 trial 哪一段生成。這讓 reviewer 能從公式回到文本，而不是閱讀一整份無註解 SMT-LIB。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

語法 validity 可以由 SMT parser 檢查，type consistency 由 solver 找出；semantic validity 則需 domain review 與 test cases。常見測試包括 negation、數值單位、日期相對關係、and/or scope、history vs current condition，以及 inclusion/exclusion section boundary。

One-time parsing 是 pipeline 的效率來源：每份 patient/trial document 先轉成 formal representation，之後多次 matching 重用。這要求 parse artifacts 版本化；parser 或 ontology 更新時要知道哪些 documents 需要重算。

## SMT-to-PL projection 的目標不是隨便簡化

PL projection 要得到「SMT 中能由命題邏輯表達的最緊 constraints」。若投影太強，會把真正 satisfiable pairs 在 retrieval 階段排除，造成不可恢復 false negative；投影太弱則候選太多，完整 SMT matching 成本上升。它是 recall/cost tradeoff，不只是轉格式。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

講義圖中 patient/trial 各自有 SMT 與 PL，database 能用 Boolean facts 篩選大量 pairs。Projection 無法保留數值精細關係時，可以只保留 diagnosis presence 等必要條件。所有通過 PL 的 pairs 再交完整 solver，讓 numeric/theory constraints 決定。

Evaluation 要單獨量 projection candidate recall、candidate reduction 與「PL sat 但 SMT unsat」比例。只有 final matching accuracy 會掩蓋 retrieval 是否根本沒有縮小集合，或是否漏掉 eligible candidates。

## 大規模 matching 的計算路徑

天真 pairwise 對每個 patient 與 trial 呼叫 LLM 或 solver，複雜度隨兩邊乘積成長。Pipeline 先把 PL facts 放進 database/query index，以 linear preprocessing 加可擴展 retrieval 產生小候選；再對候選 SMT pairs 執行 Z3。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Solver matching 可回 SAT/UNSAT 與 model/unsat core 等解釋素材。Unsat core 能指出哪些 constraints 衝突，但轉成使用者可理解的臨床說明仍需對回來源。不能直接展示內部 variable 名稱，也不能讓生成器從 core 推測醫療建議。

Caching 要以 patient/trial representation version 為 key。病歷更新、新檢驗進來或 trial criteria 修訂後，舊 matching 失效。Clinical setting 中 freshness 是 correctness 的一部分，不只是效能優化。

## Evaluation 必須拆 parser、retrieval 與 solver

Solver 對 formal input 的 correctness 可以用單元公式驗證；NL-to-SMT 用人工標註公式、constraint-level entailment 與 source alignment；projection 用 recall/reduction；end-to-end 才用 patient-trial labels。每層 gold 的成本不同，但不拆就無法知道形式方法是否真的改善主要瓶頸。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

Clinical labels 也不是絕對真相。Dataset annotation 可能有 inter-rater disagreement，patient record 不完整，trial criteria 本身含 ambiguity。報告應保留 adjudication 與 uncertainty，不把一個 benchmark label 當醫療事實。

False positive 與 false negative 成本不同。Research benchmark 可以報 balanced metrics；實際 referral workflow 要由臨床方定義 threshold 與人工 review。本文與 lecture 都不能提供 deployment 決策，只能說明 architecture。

## 用非醫療 constraints 建立安全原型

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

選活動報名、課程先修或設備相容性等低風險 domain。定義十個 typed concepts、數值與 Boolean constraints，人工寫 gold SMT。建立 NL parser 後逐句保存 formula/source alignment，測 negation、unknown、unit conversion 與 conflicting facts。

再做 PL projection，量候選 recall 與 reduction，最後用 Z3 檢查完整 constraints。對每個 UNSAT 產生由 gold source spans 組成的 explanation，不讓 LLM自由補原因。這能練到 lecture 的全部 dataflow，又不把研究原型誤用在臨床決策。

## 為什麼還需要 PL projection

直接對每位病人與所有試驗跑完整 SMT matching，配對數會成平方成長。講義先把 SMT 投影成較弱、可放進資料庫檢索的 propositional constraints，用它篩出候選，再對小集合跑完整 solver。目標是保留高 recall，同時把昂貴推理限制在候選對。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

這個設計把 retrieval 與 reasoning 分開：PL projection 漏掉候選是召回問題；完整 SMT 判錯則回到 parse、變數或約束。形式方法沒有消滅錯誤，但讓錯誤位置變得清楚。

## 最大限制在語言進入形式系統之前

NL-to-SMT 可能漏否定、混淆 hard 與 soft constraint，或把臨床判斷硬寫成布林值。SMT solver 只保證對輸入公式正確推理，不保證公式忠於原文。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf))

> **本文延伸：** 實務系統應保留原句對應、parser confidence 與人工覆核，不能把 SAT 當醫療資格核准。

## 可以怎麼練習

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

用非醫療例子開始：把「活動限十八歲以上；學生可免票；非學生票價低於五百元」寫成 typed variables 與 assertions。為每條公式標回原句，再設計 missing、conflicting 與 unknown 三種輸入，確認系統不把 unknown 當 false。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開投影片沒有驗證過的臨床部署 protocol、完整 parser code 或課堂錄影。講義列出的規模與結果屬研究背景，本文不據此提出臨床效能主張。

## 參考資料

- [Lecture 11: Satisfying Natural Language Constraints with SMT](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf)
- [ClinicalTrials.gov](https://clinicaltrials.gov/)
- [Z3 theorem prover](https://github.com/Z3Prover/z3)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 1: formal-reasoning course map](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
