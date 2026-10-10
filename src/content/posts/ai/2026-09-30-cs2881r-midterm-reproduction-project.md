---
title: "CS2881R 期中：挑一張 headline figure 重現並延伸"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, reproducibility, red-teaming]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 7
tldr: "CS2881R 的期中作業不是考試，是 2–4 人一組，從四篇 AI 安全論文裡挑一篇，重做它最核心的那張圖或表，再做一到兩個延伸，交 3–5 頁報告與 GitHub。規格投影片與評分表都公開，校外讀者可以完整照做。評分表把最多分數給「重現」與「延伸」，另外專門留一分給「你對結果有多脆弱的反思」——這一分正是這份作業想訓練的研究習慣。"
description: "Harvard CS 2881R AI Safety（Fall 2025）期中 mini-project 導讀：規格投影片的目標與交付物、四篇候選論文（GCG、Instruction Hierarchy、Spill the Beans、以剪枝與低秩修改檢驗安全對齊的脆弱性）各要重現的圖表、評分表的配分，head TA 回顧文對這份作業的說明與反思，以及材料之間對不上的地方。"
draft: false
glossary:
  - term: "headline figure"
    definition: "一篇論文裡承載核心主張的那張圖或表。CS2881R 期中要求重現的就是它，而不是整篇論文。"
    context: "CS2881R mini-project 規格投影片的用語。"
  - term: "Attack Success Rate"
    aliases: ["ASR", "攻擊成功率"]
    definition: "在一組有害請求上，攻擊方法讓模型產出不該產出之回應的比例。"
    context: "期中候選論文裡的 GCG 與剪枝／低秩兩篇都以 ASR 當主要指標。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) Fall 2025 的期中 mini-project。主要材料是公開的 [mini-project 規格投影片](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew)、[評分表](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII)，以及 head TA Roy Rinberg 的[回顧文](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)中「Assignment Structure」一段；截止日取自 Boaz Barak 第 8 講投影片的 Admin 頁。事實皆於 2026-09-30 打開上述材料核對。這份作業的規格與評分標準全公開，就作業本身屬 **A3**；拿不到的是學生繳交的期中報告與成績。

**系列位置**：上一篇 [L5：內容審核的老教訓如何搬到生成式 AI](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies)｜下一篇 [L8：Scheming、reward hacking 與欺騙](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception)｜[系列總覽](/posts/ai/2026-09-30-cs2881r-course-overview)

讀到這裡，你已經看過模型怎麼被訓練（L2）、怎麼被攻破（L3）、規範怎麼寫（L4）與怎麼執行（L5）。[CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) 的期中作業要你把其中一個結果親手做一遍，然後問：它有多穩？

## 課程影片來源

官方 Fall 2025 課表提供部分講次錄影；本篇的直接影片連結尚未由這次取得的官方頁面核實，請由課表查看可用錄影。

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## 作業在問什麼

規格投影片第一頁把目標寫成一句話：練習重現並批判性地檢視 AI 安全研究的結果。做法是從提供的論文裡挑一篇（也可以自己提），重現它的「headline figure」。

投影片把任務拆成兩件事：

1. **重現核心結果**：重做論文的核心圖或表，程式與設定要清楚、有文件、跑得起來。
2. **探索分歧**：做 1–2 個變化實驗。可以測穩健性（換資料集、調超參數、改設定），也可以把方法套到新情境。投影片寫明目的是「探測原始發現有多脆弱或多能推廣」。

最後一頁的 TLDR 很直接：不在乎精確重現，在乎抓到主要想法；歡迎提出變化與有趣的延伸。

## 規格一覽

| 項目 | 規格投影片的寫法 |
|---|---|
| 組員 | 2–4 人 |
| 交付物 | 3–5 頁短報告 + GitHub |
| 報告內容 | 重現的 headline result（圖或表）、1–2 個延伸、對結果穩健性／脆弱性的反思 |
| 程式 | 程式碼 + README |
| 公開程式碼 | 原論文若已有公開程式碼，延伸必須「non-trivial」 |
| 簡化 | 可以提出讓實作更可行的變化，例如縮小模型或換模型系列 |
| 算力 | 每組 200 美元，需要更多再問 |
| 截止 | 2025 年 11 月 2 日（週日）午夜（出自第 8 講投影片 Admin 頁） |

算力預算有一處對不上：規格投影片寫每組 200 美元，head TA 回顧文則說 mini-project 每組「大約 50 美元」的報銷，而且多數學生用得比這少。本文以規格投影片為準，並列出這個差異。

## 四篇候選論文

回顧文說期中有「五篇」建議論文，但公開的規格投影片只列四篇。本文依投影片。前兩篇也出現在 [L3：jailbreak 與 prompt injection](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness)的閱讀清單裡。

### 1. GCG：一段後綴通吃多個模型

[Universal and Transferable Adversarial Attacks on Aligned Language Models](https://arxiv.org/abs/2307.15043)。投影片的一句話摘要：用 Greedy Coordinate Gradient 找出單一段學出來的後綴（「universal adversarial prompt」），讓它在多個模型上繞過對齊，以 Attack Success Rate 衡量。

**要重現**：Table 2 的前三列——只給有害行為（不加後綴）、有害行為加上「Sure, here's」基準、有害行為加 GCG 後綴——並另外回報你在來源模型上做最佳化時的白箱成功率。

### 2. Instruction Hierarchy：讓模型分得出誰的指令比較大

[The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions](https://arxiv.org/abs/2404.13208)。投影片摘要：證明一個被微調成遵守指令層級的模型，比同等能力的基準更能抵抗攻擊，同時過度拒答維持在小幅度。

**要重現**：Figure 2。

### 3. Spill the Beans：RAG 會把檢索內容原文吐出來

[Follow My Instruction and Spill the Beans: Scalable Data Extraction from Retrieval-Augmented Generation Systems](https://arxiv.org/abs/2402.17840)。投影片摘要：一個簡單的指令式 prompt 就能讓 instruction-tuned 模型逐字複製檢索到的內容，而且模型越大越容易中招。

**要重現**：Table 1 的 7B 與 13B 部分。

### 4. 安全對齊只佔很少的權重

[Assessing the Brittleness of Safety Alignment via Pruning and Low-Rank Modifications](https://arxiv.org/abs/2402.05162)。投影片摘要：找出並移除非常稀疏的「安全關鍵」區域（以神經元剪枝約 3% 的權重，或以低秩更新約 2.5% 的 rank），就能推高攻擊成功率。

**要重現**：Figure 2。

四篇的共同點是，它們都在回答「安全機制有多牢」。前兩篇一攻一守，第三篇把攻擊面移到 RAG 系統，第四篇從權重層面說安全行為可能只是薄薄一層。

## 評分表怎麼配分

評分表分成 Writeup 與 Code 兩大塊。

**Writeup（標題寫 /10）**

| 項目 | 配分 | 拿滿分的條件 |
|---|---|---|
| Reproduction of Results | 5 | 成功重現 headline result，**或**對方法差異如何導致不同結果給出有說服力的解釋 |
| Extensions | 5 | 一到兩個有意義、經過思考的延伸，並清楚討論發現 |
| Reflection on Robustness / Fragility | 1 | 可信地討論結果的脆弱性、假設或可靠度 |
| Communication & Clarity | 1 | 寫作清楚、圖表易懂 |

**Code（/5）**

| 項目 | 配分 | 拿滿分的條件 |
|---|---|---|
| README & Documentation | 1 | 有 README，含環境、設定、使用說明 |
| Code Quality & Use of Public Source | 4 | 結構清楚好讀，能看出對方法與延伸的理解；若用公開程式碼，commit 歷史要顯示真正的投入 |

公開文件裡 Writeup 四個子項加起來是 12 分，標題卻寫 /10。文件沒有解釋，本文照原樣列出。

三個細節值得注意：

- **重現失敗也能拿滿分**，前提是你把失敗的原因講清楚。這跟一般作業「答案對才有分」很不一樣。
- **延伸的 3 分描述**寫的是「trivial、expected，或討論不足（尤其在已有公開程式碼時）」。有現成 repo 的論文，跑一次就交是拿不到高分的。
- **脆弱性反思只佔 1 分**，但它是整份作業唯一直接評「研究判斷」的項目。

## TA 怎麼看這份作業

head TA Roy Rinberg 在課程結束後的回顧文裡，對期中的描述是：重現五篇建議論文之一，加上一點開放式的變化，例如看不同 prompt 方式怎麼影響結果，或結果換個模型、換個資料集還穩不穩。

他對這個設計的評語有兩段值得轉述：

- 評分要找「難做、好驗證」的東西。重現一張 headline figure 好驗證，又逼學生真正碰到材料；要求「有意義的延伸」則逼學生超越「對現成 codebase 跑 Claude Code」。他也說，未來 AI 工具也許會讓這件事變得太簡單，但在這一屆還算合適。
- mini-project 幫學生找到想合作的組員，又不會綁太死。

他在建議清單裡也承認，這是第一次開課，評分表不一定在作業發下時就準備好。學生回饋也要求更早、更清楚地說明專題選項、評分標準與截止日。

回顧文的另一段把這份作業放進更大的脈絡：很多 AI 安全論文帶著「我們試了一個東西，它有效」的味道，學術界能做的一件事就是把它們撿起來，檢查到底多穩——什麼時候會壞、論文沒說的是什麼。

## 怎麼自己做一次

1. **先選題**。有 GPU 就考慮 GCG 或剪枝／低秩那篇；只有 API 額度，Spill the Beans 的 7B／13B 設定與 Instruction Hierarchy 的評測部分比較可行。投影片允許縮小模型或換系列。
2. **先讀懂要重現的那張圖**。把圖的每一軸、每一列寫成一句話，確定你知道每個數字是怎麼算出來的。
3. **先做最小重現**，再做延伸。延伸挑一個會讓原結論「可能不成立」的方向，例如換一個更新的模型、換一組 prompt 模板、換一個資料分布。
4. **報告裡留一段寫脆弱性**，即使只是列出你的重現和原文有哪些設定不同。

今晚可以做的一件事：打開你選的那篇論文，只看 headline figure，在一張紙上寫下「要重做這張圖，我需要哪些模型、哪些資料、多少次推論」。這張清單就是你的算力預算。

## 延伸閱讀

- 四篇候選中兩篇的來源講次：[CS2881R L3：jailbreak、prompt injection 與從軟體安全借來的教訓](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness)
- 另一門課的 jailbreak 專題設計：[台大 ADL 2025 第 10 講：偏見、安全、幻覺與對齊](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)
- Prompt injection 的工程防線：[安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS2881 Mini-project 規格投影片（Google Slides）](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew) — 目標（重現 headline figure 並延伸）、交付物、算力、四篇候選與各自要重現的圖表
- [Mini Project Grading 評分表（Google Docs）](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII) — Writeup 與 Code 兩塊的配分與描述
- [Roy Rinberg, Reflections on TA-ing Harvard's first AI safety course（LessWrong, 2026-01-15）](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) — Assignment Structure、報銷金額、評分設計的反思與學生回饋
- [Boaz Barak, Lecture 8: Scheming 投影片（Harvard SharePoint）](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/Ec5_PVcJPBJPg-fJa0scnPYB8oDlDLuCM5I92N1Dit6SPQ?e=d6Z21h) — Admin 頁的 mini-project 截止日
- [Harvard CS 2881R AI Safety, Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/) — L3 閱讀清單中的 GCG 與 Instruction Hierarchy
- [Zou et al., Universal and Transferable Adversarial Attacks on Aligned Language Models（arXiv 2307.15043）](https://arxiv.org/abs/2307.15043)
- [Wallace et al., The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions（arXiv 2404.13208）](https://arxiv.org/abs/2404.13208)
- [Qi et al., Follow My Instruction and Spill the Beans（arXiv 2402.17840）](https://arxiv.org/abs/2402.17840)
- [Wei et al., Assessing the Brittleness of Safety Alignment via Pruning and Low-Rank Modifications（arXiv 2402.05162）](https://arxiv.org/abs/2402.05162)
