---
title: "Stanford CS329Z 導讀 Week 7：分數別騙自己，資料再做大——期中驗收週"
date: 2026-09-15
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 8
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 23
tldr: "Week 7 是期中驗收週：週一談資料選擇，週三談評分與 benchmark 設計；Zhu 等人教你別被自己的分數騙，SWE-smith 把軟體工程任務資料做到 5 萬題，讀完為 HW2 寫下第一版 4-tuple。"
description: "帶讀 Stanford CS329Z Week 7 三篇主讀物：agentic benchmark 最佳實踐檢查表、LLM 評審的人類對齊、SWE-smith 資料規模化管線，以及課程的 4-tuple 評估框架。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en)

Week 7 是期中驗收週。週一（11/2）談資料選擇與品質，週三（11/4）談評分基礎與 benchmark 設計。同一週週三是 midpoint demo，週五要交 midway report。分數和資料同一週登場不是巧合：demo 要拿分數說話，報告要交代資料從哪來。

先給新手一個框架。課程把一次 agent 評估拆成 4-tuple。request 是你交辦的事，environment 是 agent 能動的世界。stopping criteria 管何時收工，scorer 負責判分。四個少一個，分數就站不住。

拿修 bug 當例子。request 是「修好這個 issue」，environment 是程式碼庫加終端機，stopping criteria 是交出 patch，scorer 是跑測試。後面三篇主讀物正好分工：[Zhu 等人的最佳實踐](https://arxiv.org/abs/2507.02825)在講 scorer 多容易寫錯，[Shankar 等人的驗證者研究](https://arxiv.org/abs/2404.12272)在講 LLM 幫忙打分要怎麼對齊人類，[Yang 等人的 SWE-smith](https://arxiv.org/abs/2504.21798)在講任務資料怎麼做大。

## 評分比你想的脆弱

Zhu 等人的論文開門見山：很多 agentic benchmark 的題目設定或獎勵設計有坑。兩個點名案例：[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) 測試案例不足，[TAU-bench](https://arxiv.org/abs/2406.12045) 把空回應也算過關——交白卷的 trivial agent 在航空子集拿下 38% 成功率。這類坑會讓分數低估或高估，幅度可達一倍。

## Benchmark 設計：拿一張檢查表動工

作者群給的解法是 [Agentic Benchmark Checklist（ABC）](https://arxiv.org/abs/2507.02825)。它從實作經驗、文獻回顧和已知事故歸納出一套檢查項。拿它去掃現有 benchmark，分數真的會動：在設計複雜的 [CVE-Bench](https://arxiv.org/abs/2503.17332) 上走一遍，高估幅度少了 33 個百分點。

## 資料規模化：SWE-smith 的做法

換邊看資料。[SWE-smith](https://arxiv.org/abs/2504.21798) 處理的痛點很具體：過去的軟體工程訓練資料又小又貴，最多只涵蓋 11 個 repo，整理流程還要大量人工。做法是反過來：給定任意 Python 程式碼庫，先建好執行環境，再自動合成會弄壞現有測試的任務。

用這條管線造出的資料集橫跨 128 個 GitHub repo。總題數來到 5 萬。拿它訓出的 SWE-agent-LM-32B 在 SWE-bench Verified 的一次解題率達到 40.2%，是當時開源模型最佳。

## 誰來驗證驗證者

同屬週一的第三篇主讀物換了主角：[Shankar 等人問，LLM 幫忙打的分，要怎麼對齊人類](https://arxiv.org/abs/2404.12272)（UIST 2024）。人工評太貴、程式評太窄，所以大家拿 LLM 當評審；但評審模型繼承了被評模型的所有毛病，還得再驗一次。他們的做法叫 EvalGen，混合主動：系統自動生評分標準和實作（Python 函式或 grader prompt），過程中請人類為一小批輸出打分；這些回饋拿來挑跟人類最合的實作。

最值得記的是 criteria drift：你要先有標準才能打分，但打著打著才發現標準該長什麼樣；有些標準甚至依附在看過的輸出上，根本沒法事先寫下來。這對「評分獨立於觀察」的假設是正面一擊。HW2 寫 LLM-as-judge 之前，先讀這篇再動手。

## 怎麼做：為 HW2 寫下你的 4-tuple

**怎麼做**：為 HW2 暖身，給自己的 agent 寫下 4-tuple。request 用一句話寫交辦事項，environment 列出它能碰的工具與資料，stopping criteria 寫明什麼算做完，scorer 先寫一個最陽春的版本。寫完拿 Zhu 等人的案例反問自己：我的 scorer 會不會把空回應算過關。這張紙就是 midway report 評估章節的草稿。

## 它在課程裡的位置

Week 7 之後就是驗收：週三 demo 拿分數說話，週五報告交代資料與方法。[Week 6](/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel) 談資料飛輪，Week 7 補上另一半：分數怎麼寫才不會騙自己。把 4-tuple 寫好，HW2 的題目定義就完成一半。

## 本週 Course Material 對照

- 週一 11/2 Data Selection & Quality：主讀物 SWE-smith、Who Validates the Validators?（本文已導讀）。延伸閱讀 [Zhou 等人 LIMA](https://arxiv.org/abs/2305.11206)：只用 1,000 條精心篩選的問答做 supervised fine-tune，不做 RLHF；人類評測裡 43% 的回覆不輸 GPT-4。論點是知識都在預訓練學完，對齊重質不重量。
- 週三 11/4 Evaluation Fundamentals & Benchmark Design：主讀物 Zhu 等人最佳實踐（本文已導讀）。延伸閱讀 [Press 談怎麼做好的 LM benchmark](https://ofir.io/How-to-Build-Good-Language-Modeling-Benchmarks/)：好 benchmark 要 natural、automatically evaluable、challenging；他還警告別讓同一個 LM 又當選手又當裁判。文末把單一任務寫成 request–environment–stopping criteria–scorer 的 4-tuple，正是本週框架的出處。延伸閱讀 [Polo 等人 tinyBenchmarks](https://arxiv.org/abs/2402.14992)：MMLU 的 1.4 萬題不必全跑。100 題精選子集就能可靠重現原排名。評測貴在具代表性，不在題海。
- 課表原文：[CS329Z 官網 Week 7](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Week 6：資料飛輪](/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yang et al., SWE-smith](https://arxiv.org/abs/2504.21798)、[Shankar et al., Who Validates the Validators?](https://arxiv.org/abs/2404.12272)、[Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)
