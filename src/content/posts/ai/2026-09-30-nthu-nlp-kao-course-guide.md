---
title: "清大高宏宇 自然語言處理導讀：1200 人的 TAICA 課，校外讀者拿得到什麼"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, taiwan]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 0
tldr: "清大資工高宏宇老師的《自然語言處理》是 TAICA 聯盟的研究所級主導課程，Syllabus 寫明開放 1200 人、中文授課，從 TF-IDF、詞向量一路講到 RLHF、PEFT 與 RAG。Fall 2025 的投影片、32 支課堂錄影、4 份作業題目與 starter notebook 都放在 GitHub，評為 A3；拿不到的是解答、評分與期末專題規格。Fall 2026 正在進行，只放到 W3，評為 A2；評分改成作業 75%＋實體期中考 25%，並新增 Reasoning／Agent 單元。"
description: "清大高宏宇《自然語言處理》系列入口：TAICA 主導課程的定位、Fall 2025 與 Fall 2026 兩學期的時段／評分／教材對照、2025 README 週次欄的陷阱、A0–A3 公開程度評級與缺口、20 篇系列地圖與三種讀法。依據兩學期的 GitHub README、W0_Syllabus.pdf、Syllabus-115.pdf、Assignments README、TAICA 開課清單與 IKMLab YouTube 錄影。"
draft: false
glossary:
  - term: "TAICA"
    aliases: ["臺灣大專院校人工智慧學程聯盟"]
    definition: "臺灣大專院校人工智慧學程聯盟。由多所大學開設「主導課程」，聯盟學校的學生以同步遠距方式跨校修課；114 學年上學期由六所大學開了 10 門。"
    context: "本課在 TAICA 開課清單上歸在「人工智慧自然語言技術學分學程」。"
  - term: "鏡像課程"
    aliases: ["mirror course"]
    definition: "TAICA 的一種盟校修課型態：盟校學生直接跟著主導學校的同步遠距課程上課。另一種「衛星課程」由盟校配置協同教師與助教輔導。"
    context: "TAICA 114 學年上學期把本課標為「封閉式：鏡像課程／條件式：衛星課程」，115 學年上學期標為「鏡像課程」。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

清華大學資工系高宏宇老師的[《自然語言處理》](https://github.com/IKMLab/NTHU_Natural_Language_Processing)，是一門掛在 [TAICA 臺灣大專院校人工智慧學程聯盟](https://taicatw.net/fall-114/)底下的主導課程。兩個學期的 Syllabus 都寫著班級人數 1200 人、開課級別研究所；TAICA 開課清單標的授課語言是中文。它從「電腦為什麼讀不懂『冬天：能穿多少穿多少』」講起，經過 TF-IDF、詞向量、RNN、Transformer、BERT，一路講到 RLHF、PEFT 與 RAG。

對校外讀者來說，這門課最特別的是教材放的位置：不在學校的課程網站，而在實驗室的 [GitHub repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing)。每週的投影片、YouTube 直播錄影連結、作業 PDF 和 notebook 都掛在同一張表上。

這篇是系列入口，只回答三件事：這門課的定位與兩學期差異、校外讀者實際拿得到什麼、該從哪裡開始讀。每週的內容留給後面各篇。

**本文依據**：[repo 首頁 README（2026 版）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)、[2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)、[2025 W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf)、[2026 Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf)、[2025 作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)、[2026 作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)、TAICA [114 學年上學期](https://taicatw.net/fall-114/)與[115 學年上學期](https://taicatw.net/fall-115/)開課清單，以及 [IKMLab NTHU YouTube 頻道](https://www.youtube.com/@IKMLabNTHU)的錄影。全部在 2026-09-30 打開核對，錄影逐支用 YouTube oEmbed 確認可公開播放。

## 課程影片來源

本文是課程總覽或資源地圖，沒有單一對應講次；請從官方課程入口與播放清單查找影片。

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 這門課的硬事實

- **定位**：2025 的 Syllabus 封面寫「主導課程5：自然語言處理」，並註明 1200 人中保留 100 人給清大，聯盟學校平均每校約 50 人。TAICA 開課清單把它歸在「人工智慧自然語言技術學分學程」，難度標了八顆星，課程屬性是研究所課程。
- **講者**：Syllabus 第一頁寫高宏宇是清華大學資訊工程系教授；2026 版另列清華大學計算與通訊中心主任，並列出多項 NLP 資料競賽名次。
- **課程目標**：兩版 Syllabus 同一段話：涵蓋 NLP 與大型語言模型的基礎與前瞻技術，並提供理論基礎與實際應用。
- **不教什麼**：Syllabus 的「Not included」欄列了 Speech、Prompt usage、開發新模型、解決生成式 AI 問題。2025 版還有一頁「Is NOT designed for」，對象包括「學如何魔法詠唱」和「沒考試，想靠共同協作完成作業的人」。
- **上課平台**：兩學期都用 [NTU COOL 課號 41436](https://cool.ntu.edu.tw/courses/41436)，校外讀者進不去；公開的只有 GitHub 與 YouTube。

## 兩學期對照：Fall 2025 與 Fall 2026

本系列以已經結束的 Fall 2025 為基準，Fall 2026 的差異集中寫在這裡和期末專題那一篇。

| | Fall 2025（114-1） | Fall 2026（115-1，進行中） |
|---|---|---|
| 同步遠距時段 | 週二 13:20–15:10、週四 13:20–14:10 | 週四 9:00–12:00 |
| TAICA 盟校型態 | 封閉式鏡像課程／條件式衛星課程 | 鏡像課程 |
| 評分 | 作業 70%（Syllabus 寫 5 份）＋期末專題 30% | 作業 75%（4 份）＋期中考 25% |
| 專題／考試 | 3–4 人一組；Proposal 6%、Progress report 6%、Poster 6%、Report 12%；No GPU provided | 期中考排在 W14，實體考試 |
| 新單元 | 無 | Syllabus 新增「NLP issues in LLM era：Reasoning / Agentic AI」，W16 排 Reasoning / Agent |
| 算力 | 專題頁寫 No GPU provided | TAICA 算力補助：9 月到 12 月，總額 9 萬元，例如 100 運算元帳號 100 名或 500 運算元帳號 40 名，細節待公告 |
| 批改 | Syllabus 未寫 | Human-TA 批改，AI-TA 協助；投影片寫「Your Insight, not GPT insight」 |
| 公開進度 | W1–W16 全部掛上 | 只到 W3 |

時段與盟校型態出自 TAICA 開課清單，其餘出自兩份 Syllabus。有一個小地方要注意：2025 資料夾裡的 W0_Syllabus.pdf，封面寫的是「113-1 主導課程5」，也就是 2024 秋季的學期代號，時段則和 TAICA 114 學年上學期清單一致。這份檔案看起來是沿用前一年的封面，本系列只把它當作 2025 年公開的課綱來引用。

2026 的 Syllabus 開頭換了一段「Why Study Natural Language Processing?」，引用 Eduard Hovy 在 ROCLING 2024 的演講「Worries in the LLM era」，把 LLM 時代的 NLP 分成工程、應用與研究三個方向。這段在 2025 版沒有。

## 2025 README 的週次欄不能照抄

打開 [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) 會看到 Week、Topics、Slide、Video、HW 五欄。**Topics 欄是 Syllabus 的課綱模板，和那一列實際掛的投影片對不起來。** 例如 W7 的 Topics 寫「Python for text tutorial (1/2)」，那一列掛的卻是解碼策略投影片和 Hugging Face BERT 助教課；W10 寫「Decoding Strategies」，掛的是 RAG 投影片。

投影片檔名的週次也不可靠：`W3_Transformers.pdf` 實際掛在 W4，`W11_RAG.pdf` 掛在 W10。本系列一律以「那一列實際掛的投影片與錄影」為準。下表是依此整理的 Fall 2025 實際進度：

| 週 | 實際掛的教材 | 系列篇目 |
|---|---|---|
| W1 | Syllabus、NLP brief | [1 NLP 簡介與傳統文字處理](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing) |
| W2 | 詞向量與語言模型（RNN）；HW1 | [2](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)、[3](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) |
| W3 | Seq2seq 與 Attention | [4](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention) |
| W4 | PyTorch 助教課、Transformers | [5](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic)、[6](/posts/ai/2026-09-30-nthu-nlp-transformers) |
| W5 | Sub-word tokenization；HW2 | [7](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization)、[5](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) |
| W6 | BERT and its family | [8](/posts/ai/2026-09-30-nthu-nlp-bert-family) |
| W7 | 解碼與評估、HF BERT 助教課 | [10](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)、[9](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) |
| W8 | GPT-3、InstructGPT、RLHF；HW3 | [12](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)、[9](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) |
| W9 | GPT-2／T5 助教課、PEFT | [11](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization)、[13](/posts/ai/2026-09-30-nthu-nlp-peft) |
| W10 | RAG | [14](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers) |
| W11 | 只有錄影，沒有掛投影片 | [15](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced) |
| W12 | LLM API 助教課；HW4 | [16](/posts/ai/2026-09-30-nthu-nlp-llm-api)、[17](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4) |
| W13 | RAG 助教課 1、2 | [17](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4) |
| W14 | 課程總結、DeepMind Reasoning 演講筆記 | [18](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning) |
| W15–W16 | 期末專題報告錄影 | [19](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes) |

## 公開程度：Fall 2025 是 A3，Fall 2026 目前 A2

評級採用本站[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3：A2 是教材部分開放、可以做選題式導讀但必須列出缺口；A3 是系統化教材加上作業與必要檔案，足以自學。

### Fall 2025：A3 足以自學

拿得到的東西：

- **講課投影片**：W1–W10 與 W14 的講課 PDF 都在 [2025/Slides](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Slides)。
- **錄影**：README 掛了 32 支課堂錄影（W1–W16，每週一到三支）加 4 支作業說明片，全部在 IKMLab NTHU 頻道公開。W8 的 HF BERT 助教課標題沒有「[Fall 2025]」字樣，寫的是「Week 8 Tue. [助教課]」，卻掛在 README 的 W7 列。
- **作業**：[作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)列了 4 份，Word Analogy、Arithmetic、Multi-output learning、RAG。每份都有說明影片、題目 PDF、報告模板與 `main.ipynb`，資料檔也放在資料夾裡，例如 HW1 的 `questions-words.csv`、HW2 的 `arithmetic_train.csv` 與 `arithmetic_eval.csv`、HW4 的 `cat-facts.txt` 與 `questions_answers.txt`；HW3 用 SemEval 2014 Task 1 資料集。
- **助教課 notebook**：[2025/Reference](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference) 有 BERT、GPT-2／T5 摘要、RAG 兩堂實作與 LLM API 的 notebook。

缺口：

- 沒有公開解答或評分腳本，這些在 NTU COOL。唯一公開的成績資料是 Syllabus-115 第 46 頁的 2025 成績分布圖，見[期末專題與 2026 變化](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes)。
- Syllabus 寫「5 assignments for each student」，repo 只有 4 份。本系列不猜第 5 份是什麼。
- 期末專題只有 Syllabus 上的評分結構與報告錄影，沒有題目或規格文件。
- W11 只有錄影，沒有掛投影片。
- 助教課投影片封面日期是 2024 年，LLM API notebook 裡的模型也是 2024 年的型號。讀到那幾篇時會標出教材年份。

### Fall 2026：A2，進行中

[首頁 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing) 目前掛了 W1–W3：Syllabus-115.pdf、`W1_NLP_brief_v2.pdf`（W1 與 W2 都用它）、`W2_Word embeddings and Language Modeling (RNN)_v2.pdf`（W3），3 支錄影，以及 W3 發下的 HW1。[2026 作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)只有 Assignment 1 Word Analogy，說明影片是[這支](https://youtu.be/4nktsdfU24k)。W4–W16 的欄位都還是空的。

有一個容易誤讀的地方：`2026/Slides` 資料夾裡已經有 `W3_Transformers.pdf`、`W11_RAG.pdf` 等和 2025 同名的檔案，但 2026 README 沒有連到它們。本系列不把它們當作 2026 已公開的教材。

## 系列地圖

系列照 Fall 2025 的實際順序走：「看得到文字 → 表示 → 序列 → 架構 → 預訓練 → 生成與評估 → LLM 對齊 → 省參數微調 → 外接知識 → 推理」。助教課和對應作業合成一篇，讓你在同一篇裡學工具、再用工具交作業。

| # | 篇目 | 聚焦問題 |
|---|---|---|
| 1 | [NLP 簡介與傳統文字處理](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing) | LLM 以前，怎麼把文字變成能計算的東西？ |
| 2 | [詞向量與語言模型：從 n-gram 到 RNN](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models) | 「預測下一個字」怎麼從數次數走到神經網路？ |
| 3 | [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) | 詞向量真的學到「king − man + woman」嗎？ |
| 4 | [Seq2seq、LSTM 與 Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention) | 輸入輸出長度不同時怎麼辦？ |
| 5 | [PyTorch 助教課＋HW2 把算式當語言](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) | LSTM 能學會算術嗎？ |
| 6 | [Transformer 與 Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers) | 拿掉 RNN 之後，模型怎麼知道字的關係和位置？ |
| 7 | [Sub-word Tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization) | 為什麼詞彙表是「半個字」？ |
| 8 | [ELMo、BERT、T5、BART、GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family) | encoder、encoder-decoder、decoder 三條路差在哪？ |
| 9 | [HF BERT 助教課＋HW3 多輸出學習](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) | 一個 BERT 同時做回歸和分類，loss 怎麼設計？ |
| 10 | [解碼策略與 NLG 評估](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation) | 生成的文字怎麼打分數？ |
| 11 | [GPT-2／T5 中文摘要實作](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization) | decoder-only 和 encoder-decoder 做摘要，實作差在哪？ |
| 12 | [GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf) | 會接話的模型怎麼變成聽得懂指令的助理？ |
| 13 | [Parameter-Efficient Fine-Tuning](/posts/ai/2026-09-30-nthu-nlp-peft) | 沒有 GPU 叢集，怎麼微調大模型？ |
| 14 | [RAG（上）：幻覺與檢索器](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers) | 稀疏向量和稠密向量各有什麼長處？ |
| 15 | [RAG（下）：從 ODQA 到 Self-RAG](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced) | 檢索器接上生成器之後還會壞在哪？ |
| 16 | [LLM API 助教課](/posts/ai/2026-09-30-nthu-nlp-llm-api) | prompt、JSON 輸出、few-shot 用 API 怎麼做？ |
| 17 | [RAG 助教課＋HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4) | 兩種做法各做一個回答貓咪冷知識的 RAG |
| 18 | [課程總結與 LLM Reasoning 筆記](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning) | 預訓練模型不靠 prompt 會不會推理？ |
| 19 | [期末專題與 Fall 2026 改版](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes) | 2026 為什麼改成期中考？ |

## 三種讀法

**快速讀一輪（8 篇）**：1 → 2 → 6 → 8 → 12 → 13 → 14 → 18。這條線只走講課，跳過助教課和作業，適合想知道「從 TF-IDF 到 RAG 中間發生了什麼」的人。

**完整跟課（20 篇）**：照 0 到 19 的順序讀，每篇附的錄影連結就是對應週次的直播。這條線大約是一學期的份量。

**只做作業（6 篇）**：3 → 5 → 9 → 17，外加兩篇工具篇 11 和 16。每篇都會列出題目 PDF、starter notebook、資料檔與說明影片的連結，你可以直接開 `main.ipynb` 動手。記得沒有公開解答可以對，交出去也沒有人改。

**今晚能做的事**：打開 [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)，點 W1 的 Slide1 和 Video1，看第一週在講什麼；想直接動手的人，把 [HW1 的 main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb) 丟進 Colab。

## 延伸閱讀

內容重疊的部分，本系列照樣完整講，下面只是給想對照另一種講法的人：

- [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)：英文授課的 NLP 主課，逐屆比對 2019 到 2026 的課表。
- [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)：偏自然語言理解、檢索與評估方法。
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：同樣是中文授課、錄影全開，但主軸是 AI Agent 與模型行為。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（首頁 README，2026 版）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 README：Fall 2025 週次表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [2025 W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf)
- [2026 Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf)
- [2025 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [2026 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)
- [2025 Reference notebooks](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference)
- [TAICA 114 學年度上學期開設課程清單](https://taicatw.net/fall-114/)
- [TAICA 115 學年度上學期開設課程清單](https://taicatw.net/fall-115/)
- [IKMLab NTHU YouTube 頻道](https://www.youtube.com/@IKMLabNTHU)
- [Fall 2025 Week 1 Tue. 錄影](https://www.youtube.com/live/X7XJcm9wfFA)
- [Fall 2026 Week 1 錄影](https://youtube.com/live/EEbwXXoVQPY)
