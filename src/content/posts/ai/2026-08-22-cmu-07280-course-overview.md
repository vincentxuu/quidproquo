---
title: "CMU 07-280 完整課程導讀：搜尋、GPT-2、AlphaZero 為什麼在同一門課？"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, search, reinforcement-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 0
type: deep-dive
tldr: "07-280 是 CMU Spring 2026 首開的 AI＋ML 核心：24 講、12 個作業編號，從 heuristic search、CSP 與機器學習一路做到 AlexNet、GPT-2、AlphaZero。教材足以自學，但沒有完整公開錄影、Canvas checkpoint 或 Gradescope 回饋。"
description: "介紹 CMU 07-280 Spring 2026 的改制目的、24 講課程架構、12 份作業、公開材料、版本風險與完整系列閱讀方法。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-course-overview-en)

CMU 在 Spring 2026 首次開出 **07-280 Artificial Intelligence and Machine Learning I**，用它取代舊制裡分開的 15-281 Artificial Intelligence 與 10-315 Machine Learning for SCS。這門課最醒目的地方不是新課號，而是同一學期先教 heuristic search、adversarial search 和 constraint satisfaction，後面卻要求學生做出 AlexNet、GPT-2 與 AlphaZero。

這不是把「經典 AI」和「熱門模型」塞進同一張清單。07-280 的主脊是：**先學如何定義狀態、目標、模型與計算代價，再逐步增加能從資料與互動中學習的元件。**搜尋、監督式學習、語言模型與強化學習，都是在回答「系統如何選下一步」。

本系列以 **Spring 2026 首次完成班次**為 canonical edition。官方首頁目前已切換到 Fall 2026，Spring links 退到 HTML comments；多數帶有 `S26` 的 slides、notes、recitation、written homework 和 notebooks 仍可匿名直連，但少數舊直連已失效。現存材料足以重建完整課程主線，卻沒有逐講公開錄影；本文不會虛構講者口述或課堂問答。

## 這次改制到底改了什麼

[07-280 官方 FAQ](https://www.cs.cmu.edu/~07280/)說得很直接：舊的 15-281 與 10-315 退休，改成 07-280 → 07-380 兩門連續核心。第一門要同時服務 BSAI 學生，以及只打算修一門技術型 AI 課的其他 SCS 學生；第二門再增加進階主題與研究方法。

07-280 不是 10-301 的新名字。兩者都能滿足多數 introductory ML prerequisite，但 07-280 額外涵蓋 heuristic search、adversarial search、CSP、GPU basics 與 Monte Carlo tree search；10-301 則多出 KNN、perceptron、PAC learning、PCA、clustering、ensemble methods、recommender systems 與 MAP。想建立廣義 AI 主幹選 07-280；想集中補統計式 ML，10-301 仍是獨立入口。

正式先修也反映這個野心。07-280 要求 15-122 程式能力、離散數學／concepts、線性代數，並搭配微積分與機率。這些條件不是行政裝飾：搜尋分析要離散結構，ML 推導要微積分、線代與機率，大型作業又要求能讀寫完整 Python notebook。

## 24 講其實分成四次能力升級

[Spring 2026 課表](https://www.cs.cmu.edu/~07280/)共有 24 講，可以整理成四段：

```text
問題與搜尋
  Introduction → Heuristic Search → Adversarial Search → CSP
                              ↓
從資料學函數
  Formulation → Trees → Linear/Logistic Regression → Optimization
  → Regularization → Neural Nets → Backprop → Vision/Transfer
                              ↓
機率與語言表示
  MLE → N-grams → Embeddings → Attention/Transformers
                              ↓
序列決策
  MDP → RL → Deep RL → MCTS
```

第一段先要求你把世界寫成 state、action、constraint、utility 與 heuristic。第二段把「人工設計規則」換成「從資料估計函數」。第三段處理序列、表示與條件機率，讓模型能預測 token。最後一段讓 agent 在回饋與長期報酬下選擇行動，再用 MCTS 和 policy/value network 把規劃與學習接回來。

因此 GPT-2 和 AlphaZero 不是兩個孤立 showcase。GPT-2 把 feature learning、tokenization、position、attention 與 autoregressive likelihood 串起來；AlphaZero 則把 adversarial search、MDP、reinforcement learning、MCTS 和 neural networks 串回同一個系統。大型作業是在驗收前面二十多講能不能整合，不只是要求學生呼叫現成 API。

## 12 個 homework numbers 才是這門課的真正節拍

Spring 2026 有 HW0 到 HW12，但 HW0 是 online-only 起始檢查，所以官方描述常說十二份主要 assignments。作業型態混合 online、written 與 programming：前段驗證搜尋和數學推導，中段進入 ML notebooks，後段用三個 landmark systems 收束。

| 階段 | 代表交付 | 校外可做程度 |
|---|---|---|
| 搜尋與 CSP | HW1 written/programming、HW2 search and games | handout、LaTeX starter、部分 programming tree 可匿名取得；online／submission 受限 |
| ML 基礎 | regression、regularization、NN 相關 written／notebook | 多數 PDF、zip、notebook 可匿名取得；沒有正式 grader 回饋 |
| 深度學習 | HW8 Building AlexNet | notebook 公開；運算環境與評分不等於公開 |
| 語言模型 | HW11 Building GPT2 | written、GPT notebook、RL programming 可見；Canvas／Gradescope 仍受限 |
| 規劃＋學習 | HW12 Building AlphaZero | notebook 可見；正式測試與助教回饋不公開 |

這也解釋為什麼本系列不會只照 slides 寫二十四篇摘要。逐講文章會同時讀對應 pre-reading、recitation、worksheet solution 與 homework，把「這一講教了什麼」接到「學生必須做出什麼」。三篇階段複習再分別用 AlexNet、GPT-2 與 AlphaZero 檢查跨講整合，最後補上校外自學的結業路線。

## 公開程度：A3，但不是完整遠距修課

沿用[CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)的判準，Spring 2026 可列 A3：

- 24 講的課綱與主題鏈都能由官方材料重建；多數 slides／inked slides 與多份 staff notes 可匿名讀取，少數後段舊直連已失效。
- 14 次 recitation 有 worksheet，許多也公開 solution。
- written homework、LaTeX starter、部分 notebooks 與 programming tree 能直接下載。
- [Midterm 1 learning objectives](https://www.cs.cmu.edu/~07280/07280_S26_Learning_Objectives_Midterm_1.pdf)把每個主題應該會做什麼列得很細，足以當自我檢查表。

但 A3 不代表取得正式課程體驗。完整 lecture recording／transcript 沒有公開；pre-reading checkpoints 在 Canvas，online homework 與提交在 Gradescope；Piazza、office hours、in-class polls、考試評分與助教回饋也不屬於匿名路線。某些 optional readings 另需 CMU Library。

校外自學必須自己補 feedback loop：先做 worksheet，不看 solution；完成後逐題對答案並記錄錯誤類型；programming notebook 至少建立可重跑的 local tests。做不到這三步，就算所有 PDF 都下載完成，也只是收藏材料。

## 為什麼系列鎖 Spring 2026，不追著 Fall 2026 首頁跑

本文查核時，首頁的可見 schedule 已是 Fall 2026。新的 Lecture 1 題名變成「Introduction, AI Alignment, and Safety」，日期也換到 8 月；Spring 2026 的 Lecture 1 正式題名則只有「Introduction」，日期是 1 月 13 日。若直接抄首頁，就會把新課綱題名嫁接到舊 slides。

本系列採三條版本規則：

1. 每篇標出 Spring 2026 的 lecture number、date 與官方題名。
2. 主要材料只用可辨識為 S26 的 slides、notes、recitation 和 homework。
3. Fall 2026 新增內容只放在文末 `## 延伸：`，不能無聲改寫原課。

Fall 2026 完課後可以另寫版本差異，但不會把已發布文章的 canonical semester 偷換掉。這樣讀者才知道自己做的 worksheet、slides 和作業是否真的對得上。

## 完整系列怎麼讀

系列共 29 篇：本篇總覽、24 篇逐講、三篇階段複習，以及一篇全課結業路線。三篇階段複習分別用搜尋到監督式學習、AlexNet 到 GPT-2、RL 到 AlphaZero，重組逐講知識。逐講文章固定包含：

1. official materials 與讀取完整度；
2. 這講承接的問題；
3. slides／notes agenda 的完整展開；
4. recitation 和 homework 如何測同一概念；
5. 一個可重做的推導、例子或程式動作；
6. 文末才加入現代系統或舊課對照。

第一次讀建議從 [Lecture 1：Introduction](/posts/ai/2026-08-22-cmu-07280-lecture-01-introduction)開始，依序完成逐講練習；每十二講、八講與四講後，分別停在三篇階段複習重組知識。開始前先下載 [Notation Guide](https://www.cs.cmu.edu/~07280/notes/07280_Notation_Guide.pdf)、[Math Background](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Math_Background.pdf)，再打開 [Recitation 1 Search worksheet](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)。如果 worksheet 的 state space、frontier、heuristic 與 graph search 無法自行定義，先補這段，不要急著跳到 GPT-2 notebook。讀完 24 講後，再用[全課結業路線](/posts/ai/2026-08-22-cmu-07280-completion-roadmap)驗收自己是否真的留下可執行成果。

07-280 最值得導讀的地方，正是它拒絕把現代 AI 縮成「訓練一個神經網路」。它從問題表示開始，經過搜尋、估計、表示學習與序列決策，最後才讓學生組裝 landmark systems。完整讀完，才看得出 AlexNet、GPT-2 與 AlphaZero 在同一門課裡不是宣傳詞，而是三次不同形式的整合考試。

## 參考資料

- [CMU 07-280 Artificial Intelligence and Machine Learning I](https://www.cs.cmu.edu/~07280/)
- [07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [07-280 Spring 2026 Midterm 1 learning objectives](https://www.cs.cmu.edu/~07280/07280_S26_Learning_Objectives_Midterm_1.pdf)
- [Lecture 1 — Introduction](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec1_Intro.pdf)
- [Lecture 2 — Heuristic Search](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec2_Heuristic_Search.pdf)
- [Lecture 3 — Adversarial Search](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec3_Adversarial_Search.pdf)
- [Lecture 4 — Constraint Satisfaction Problems](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec4_CSPs.pdf)
- [07-280 Search pre-reading](https://www.cs.cmu.edu/~07280/notes/search/search_prereading.html)
- [07-280 Recitation 1 — Search](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
- [07-280 Homework 1](https://www.cs.cmu.edu/~07280/assignments/hw1_blank.pdf)
