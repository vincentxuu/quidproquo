---
title: "清大 NLP 期末專題與 Fall 2026 改版：30% 分組專題換成 W14 實體期中考，外加 Reasoning／Agentic AI、AI-TA 與 TAICA 算力"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, nlp, ai-course, research-project, taiwan]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 19
tldr: "Fall 2025 的評分是作業 70%＋期末專題 30%，專題 3–4 人一組，分成 Proposal 6%、Progress 6%、Poster 6%、Report 12%，不提供 GPU；repo 沒有專題規格文件，只有 Syllabus 的結構、期末提醒與 W15–W16 的錄影。Fall 2026 改成作業 75%（4 份）＋W14 實體期中考 25%，課表拿掉報告週，新增 Reasoning／Agent 單元，並加入 AI-TA 協助批改與 TAICA 算力補助。改版原因，官方材料沒有寫。"
description: "清大高宏宇《自然語言處理》系列收尾：Fall 2025 期末專題的配分、四種題型與四條限制、期末時程與報告錄影，以及 Fall 2026（115-1）Syllabus 的改變——評分、上課時段、週次重排、Reasoning/Agentic AI、AI-TA、TAICA 算力補助、2025 成績分布，與目前（W3）的公開進度。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據清大高宏宇《自然語言處理》Fall 2025（114-1）與 Fall 2026（115-1）的官方教材。** 這是 [清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列第 19 篇，也是最後一篇，接續[課程總結與 LLM Reasoning 筆記](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning)。

前 18 篇照 Fall 2025 的教材走完了一學期。這一篇處理兩件前面沒講的事：2025 年占三成的期末專題要做什麼，以及 2026 年的課改了哪些地方。

用到的官方材料：2025 的 [W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf) 與 [Course_summary.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/Course_summary.pdf)、[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) W14–W16 列的錄影、2026 的 [Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf) 與 [repo 首頁課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing)。存取等級：Fall 2025 是 **A3 足以自學**，但期末專題這一塊只到課綱層級；Fall 2026 是 **A2（進行中）**。評級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=_hzMv789JQ8
title: Week 14 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=03_BDLu3DDU
title: Week 15 Tue.
```

原始影片：[Week 14 Tue.](https://www.youtube.com/watch?v=_hzMv789JQ8)、[Week 15 Tue.](https://www.youtube.com/watch?v=03_BDLu3DDU)、[Week 15 Thu.](https://www.youtube.com/watch?v=w48WxRz6LXE)、[Week 16 Tue.](https://www.youtube.com/watch?v=3AsbuOlSWpQ)、[Week 16 Thu.](https://www.youtube.com/watch?v=jQUHM3MQisw)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

查核日期：2026-10-10。

## 2025：期末專題占 30%

2025 Syllabus 的 Grading 頁寫得很簡短：

| 項目 | 占比 | 細節 |
|---|---|---|
| 作業 | 70% | 寫「5 assignments for each student」，需要寫程式 |
| 期末專題 | 30% | 3–4 人一組；Proposal 6%、Progress report 6%、Poster 6%、Report 12% |

同一頁補了一句：單份作業的份量會依設計「微調」，配分可能上下變動 3%。另外要注意，Syllabus 寫 5 份作業，repo 實際只公開 4 份（詞類比、算式、多輸出學習、RAG），第 5 份是什麼，官方材料沒有交代。

一個小細節：這份放在 2025 資料夾的 Syllabus，標題頁寫的是「113-1 主導課程5」，也就是沿用 113 學年的封面。人數與時段寫 1200 人（保留 100 人給清大）、週二 13:20–15:10 與週四 13:20–14:10 同步遠距。

### 題型四選一，限制四條

Syllabus 第 37 頁把專題畫成兩排方框。上排是四種題型：

- 新／舊型態 NLP 任務重現
- LLM Applications
- Competitions／Kaggle tasks
- Real Data Solving

下排是四條限制：3–4 人一組、**不提供 GPU**、效能不是唯一的評分標準（投影片寫 evaluation matrix）、兩輪報告或展示。

「不提供 GPU」要和[第 13 篇 PEFT](/posts/ai/2026-09-30-nthu-nlp-peft) 一起讀。那一篇開場就在估算全參數微調要多少顯存，LoRA 這類方法正好是沒有叢集的學生做專題時會用上的工具。

### 期末投影片給的三個方向

學期末的 Course_summary 另有一頁「Term project」，把好的專題報告分成三個方向：

1. **描述問題困難點，並說明它和你提出的方法之間的關聯**：資料改進、案例探討（看 false positive 與 false negative）。
2. **NLP 技術的效能比較**：文字特徵、representation、NLP models。投影片括號特別註明，這比探討機器學習模型本身的問題（超參數、換不同 ML 模型）更重要。
3. **他山之石，可以攻錯**：整理並善用 Kaggle 上的程式碼，學習或討論其他組的做法。

第二點值得停一下。這門課叫 NLP，專題被期待回答的是「哪種文字表示、哪種 NLP 模型比較好，為什麼」，而不是調參數把分數往上推。

**怎麼做**：如果你是校外讀者想拿這門課練專題，今晚先做一件事——挑一個 Kaggle 上的文字分類或 QA 題目，寫下你打算比較的兩種表示方式（例如 TF-IDF 對 BERT 的 CLS 向量），再列出你要逐筆看的 10 個錯誤案例。這一步同時對上第 1 點和第 2 點。

### 期末時程與報告錄影

Course_summary 最後一頁是期末時程：Term Project CP4 與所有作業都在 12/25（週四）截止，12/29–12/30 公布成績，12/31 送出成績。「CP4」投影片沒有展開；專題正好有四個計分項目，但 CP4 是否就是第四個項目，官方材料沒有寫明。

Syllabus 原本排的是 W14–W16 報告、W17–W18 選擇性 demo。實際的 2025 課表 README 是這樣掛的：

| 週 | README 標題 | 掛的材料 |
|---|---|---|
| W14 | Term project presentation (1) | Course_summary、Reasoning 筆記；錄影 [Week 14 Tue.](https://www.youtube.com/watch?v=_hzMv789JQ8)（約 77 分鐘） |
| W15 | Term project presentation (2) | 錄影 [Week 15 Tue.](https://www.youtube.com/watch?v=03_BDLu3DDU)（約 114 分鐘）、[Week 15 Thu.](https://www.youtube.com/watch?v=w48WxRz6LXE)（約 72 分鐘） |
| W16 | Term Project (demo) (optional) | 錄影 [Week 16 Tue.](https://www.youtube.com/watch?v=3AsbuOlSWpQ)（約 75 分鐘）、[Week 16 Thu.](https://www.youtube.com/watch?v=jQUHM3MQisw)（約 33 分鐘） |
| W17–W18 | Term Project (demo) (optional) | 空白 |

這幾支錄影都沒有字幕，本文沒有逐支看片，所以不描述裡面有哪些組、報了什麼題目。W14 那週的材料是課程總結，內容見[上一篇](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning)。

### 校外讀者拿不到的部分

專題規格文件、評分細則、各組題目與海報、報告檔：repo 都沒有。作業解答與成績在 NTU COOL，需要修課身分。這是 Fall 2025 雖然整體列 A3，專題這塊只能講到結構的原因。

## 2026：專題換成期中考

Fall 2026 的 Syllabus-115 把評分改成：

| 項目 | 2025 | 2026 |
|---|---|---|
| 作業 | 70%（寫 5 份） | 75%（4 份） |
| 期末專題 | 30% | 取消 |
| 期中考 | 無 | 25%，W14（暫定），**實體考** |

同一頁的紅框寫著：這門課在清大是 X-class，可以同時選清大同時段的其他課；考試採實體進行。

課表圖例也反映了這個變化。2025 Syllabus 的圖例有 Lecture、Tutorial、Reporting，Exam 被劃掉；2026 則是 Reporting 被劃掉，Exam 保留。2025 那頁「This course is NOT designed for」還列著「沒考試，想靠共同協作完成作業的人」，2026 版把整個 NOT 清單拿掉，只留「Is designed for」，並多了一條「想了解 why LLM so power?」。

**為什麼改，官方材料沒有寫。** Syllabus 沒有說明取消專題、改考試的理由，本文不代為推測。

### 上課時段與週次重排

2026 改成週四 9:00–12:00 一次上完，人數仍是 1200 人。兩份 Syllabus 的課表對照如下（以下比的是兩份 Syllabus 的排課表，2025 實際掛的教材順序和它的 Syllabus 本來就對不齊，見[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)）：

| 主題 | 2025 Syllabus | 2026 Syllabus |
|---|---|---|
| NLP 簡介、基礎文字 ML | W1–W5 | W1–W5 |
| 文字生成式 AI (1/3)：詞向量到 Transformer | W6 | W8 |
| Python for text 助教課 | W7–W8 | W6–W7 |
| BERT 家族、解碼與評估 | W9–W10 | W9–W10 |
| GPT-3／InstructGPT／RLHF、PEFT | W11–W12 | W11–W12 |
| RAG | W13 | W13（I）、W15（II） |
| 期中考 | 無 | W14 |
| Reasoning / Agent | 無 | W16 |
| 專題報告與 demo | W14–W18 | 無 |

兩個變化最明顯：助教課挪到講「文字生成式 AI」之前，RAG 拆成兩週夾著期中考。

「In this course」頁也改了。2025 版列的是 Basics、NLP Basics、GAI（文字與影像生成模型、GAI 的不同用法、GAI 應用開發）與 PBL（真實資料案例、做出 GAI 驅動的應用）。2026 版改成 Basics、NLP Basics、NLP with DL（序列模型、文字生成模型），加上新的一塊「NLP issues in LLM era」，底下列 Reasoning 與 Agentic AI。不教的清單兩年相同：Speech、Prompt usage、開發新模型、解 GAI 問題。

### 三個新元素：成績分布、TAICA 算力、AI-TA

**2025 成績分布**。Syllabus-115 第 46 頁「Grade in 2025」放了兩張圖：總人數 523，有效成績 475，平均 76.60、中位數 79.70。等第分布裡人數最多的是 A-（123 人，25.9%），F 有 41 人（8.6%）。這是這門課目前唯一公開的成績資料。

**TAICA 算力補助**。第 47 頁寫明：提供期間 9 月到 12 月，每個帳號自啟用起 90 天有效，沒用完自動失效；總預算 9 萬元，參考組合是 100 運算元帳號（約 300 元）100 名，或 500 運算元帳號（約 1500 元）40 名。投影片最後一行是「Wait for announcement」，申請方式還沒公布。這和 2025 專題頁的「No GPU provided」形成對照。2025 Syllabus 寫明名額裡保留 100 人給清大，其餘開放給聯盟學校，平均每校約 50 人。

**AI-TA**。第 48 頁「Homework evaluation」列了「Human-TA 批改」與「AI-TA 協助」，下面是「Code / Results Evaluation」與「Discussion Evaluation」兩個評分面向，最後一個紅框寫「Your Insight, not GPT insight」。投影片沒有畫出哪個 TA 負責哪個面向，本文不替它對應。

第 50 頁「The hardships of learning」貼了幾段修課心得，沒有標出處。內容提到學期初特別花時間、非同步上課容易忘記進度，也有人推薦給有 coding 與深度學習基礎的碩士生，並喜歡課程後段串接 Hugging Face、LangChain、Ollama。

**怎麼做**：如果你是 2026 年聯盟學校的修課生，今晚把 W14 期中考的暫定日期寫進行事曆，並在 NTU COOL（[課號 41436](https://cool.ntu.edu.tw/courses/41436)）開一則提醒，等 TAICA 算力的申請公告。

## 2026 目前公開到哪裡

截至 2026-09-30，repo 首頁課表只填到 W3：

| 週 | 投影片 | 錄影 | 作業 |
|---|---|---|---|
| W1 | Syllabus-115、W1_NLP_brief_v2 | [Week 1](https://www.youtube.com/watch?v=EEbwXXoVQPY) | |
| W2 | W1_NLP_brief_v2 | [Week 2](https://www.youtube.com/watch?v=MnA5KUETSg4) | |
| W3 | W2_Word embeddings and Language Modeling (RNN)_v2 | [Week 3](https://www.youtube.com/watch?v=g0QE6O17BWE) | [HW1](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2026/Assignments/Assignment1) |

HW1 的主題仍是 Word Analogy，說明影片是 [4nktsdfU24k](https://youtu.be/4nktsdfU24k)，YouTube 標題寫「Week 2 Thu. - Assignment 1」，README 則把 HW1 放在 W3 列。2025 版 HW1 的導讀見[第 3 篇](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy)；2026 版題目是否有改動，本文沒有逐項比對。W4 之後的投影片、錄影與 HW2–HW4 都還沒公開，W14 期中考是實體考，不會有公開材料。

助教時間是週一、週三 15:30–16:30，地點台達館 714。

## 延伸閱讀

- [CS224N Final Projects](/posts/ai/2026-08-22-cs224n-final-projects)：Stanford 的 NLP 期末專題有完整的規格與範例，可以拿來補清大專題缺的那一塊。
- [CS230：AI 專案策略](/posts/ai/2026-08-16-cs230-ai-project-strategy)：怎麼挑題、怎麼迭代。
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：另一門中文授課、作業完整公開的課。

## 這一篇可以確認與不能確認的

可以確認：兩份 Syllabus 的配分、題型、限制、課表、TAICA 算力條件、AI-TA 頁面與 2025 成績分布圖；Course_summary 的專題方向與期末時程；2025 與 2026 README 各週掛的檔案、錄影 ID、標題與長度。不能確認：2025 第 5 份作業是什麼；專題規格、評分細則與各組題目；W15–W16 錄影的實際內容（無字幕，未看片）；「CP4」的確切指涉；改成期中考的原因；Fall 2026 W4 之後的教材。

系列導覽：上一篇 [課程總結與 LLM Reasoning 筆記](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning)｜回到[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：嘗試依字幕核對影片內容，但 Week 14 Tue.（_hzMv789JQ8）與 Week 15 Tue.（03_BDLu3DDU）的 YouTube 頁面都沒有字幕，無法核對，因此沒有加內容核對記號；文內本來就只依投影片與官方頁面、不描述影片內容，維持不變。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 repo，首頁為 2026 版課表）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W0_Syllabus.pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf)
- [Course_summary.pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/Course_summary.pdf)
- [Syllabus-115.pdf（Fall 2026）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf)
- [2026 Assignment1（Word Analogy）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2026/Assignments/Assignment1)
- [錄影：[Fall 2025] Week 15 Tue.](https://www.youtube.com/watch?v=03_BDLu3DDU)
- [錄影：[Fall 2025] Week 15 Thu.](https://www.youtube.com/watch?v=w48WxRz6LXE)
- [錄影：[Fall 2025] Week 16 Tue.](https://www.youtube.com/watch?v=3AsbuOlSWpQ)
- [錄影：[Fall 2025] Week 16 Thu.](https://www.youtube.com/watch?v=jQUHM3MQisw)
- [錄影：[Fall 2026] Week 2 Thu. - Assignment 1](https://youtu.be/4nktsdfU24k)
- [IKMLab NTHU YouTube 頻道](https://www.youtube.com/@IKMLabNTHU)
- [NTU COOL 課程頁（課號 41436，需登入）](https://cool.ntu.edu.tw/courses/41436)
