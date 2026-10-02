---
title: "台大陳縕儂 深度學習之應用 2025 Fall 導讀：課程地圖、A2 分級與讀法"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, deep-learning, nlp]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 0
tldr: "台大資工陳縕儂的《深度學習之應用》（ADL）Fall 2025 是一門以 NLP 為主軸的深度學習課：從神經網路基礎一路講到 Transformer、BERT、預訓練與 prompt、後訓練、LoRA、RAG、生成評估、對齊議題與 Language Agents。L0–L11 有講義 PDF 與分段影片，播放清單另外多出 L12–L14 三講影片；作業端只有 HW1 規格公開，HW2、HW3 與期末專題只有說明影片，所以存取分級是 A2。"
description: "台大陳縕儂《深度學習之應用》ADL Fall 2025（114-1）系列入口：課程目標、先修、評分、週課表、講課與助教課兩條線、A2 存取分級與缺口、Fall 2025 與進行中的 Fall 2026 課程頁差別、播放清單多出的 L12–L14，以及全系列 19 篇目錄。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

《深度學習之應用》（Applied Deep Learning，簡稱 ADL）是台大資工系陳縕儂老師開的課，課程網址固定在 [adl.miulab.tw](http://adl.miulab.tw/)。名字叫「深度學習之應用」，實際上是一門以自然語言處理為主軸的深度學習課：從「神經網路是什麼」開始，經過 Transformer、BERT、預訓練，最後走到 RAG、對齊與 Language Agents。

本系列讀的是 **ADL Fall 2025（114-1，2025/09/01–12/15）**，這是目前最近一個已經完課的學期。這篇是系列入口，只講課程結構、校外讀者拿得到什麼、該怎麼排讀。每一講的技術內容留給後面各篇。

**本文依據**：[Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)、[Course Logistics 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)（18 頁）、[2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)、[HW1 規格投影片](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)，以及用來比對的 [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~miulab/f115-adl/)，全部在 2026-09-30 打開核對。對應的影片是 [ADL 0: Course Introduction 課程介紹與規定](https://youtu.be/RwRZVd9rLxE)（29:36）。課程以中文講授、投影片為英文。

## 這門課的硬事實

依 Course Logistics 投影片：

- **時間地點**：週一 14:20–17:10，實體在 R103，另有 YouTube 與 NTU COOL 的線上管道。課程頁每一週標註 Physical（實體）或 Virtual（線上）。
- **課程目標**（第 4 頁）：學生要理解 (1) 深度學習怎麼運作；(2) 怎麼把任務框成學習問題；(3) 怎麼用工具實作設計好的模型；(4) 怎麼利用預訓練模型；(5) 特定學習技術在什麼時候、為什麼對特定問題有效。
- **定位**（第 5 頁）：投影片把 ADL 和台大其他課並列，寫明「ADL focus on NLP」。同一頁列出林軒田、李濬屹、李宏毅的機器學習、王鈺強的電腦視覺深度學習、李宏毅的深度學習與人類語言處理等課。
- **先修**（第 7 頁）：必備是大學程度的微積分與線性代數；建議修過機率、統計與人工智慧導論。程式要熟 Python，作業全部用 Python，並透過 GitHub 繳交。
- **評分**（第 9 頁）：3 份個人作業 60%（GitHub 程式加 README，依程式與報告計分，遲交每天扣 25%）；期末團體專題 35%；參與 5%。
- **AI 使用規則**（第 9–10 頁）：可以問 ChatGPT、Gemini 等 LLM，也可以用公開 repo 的程式碼，但都要在報告裡註明出處；不能看往年或同屆同學的程式與報告。
- **HW0**（第 17 頁）：選課前必須先看完線上課程 Introduction（1.1–1.3）、NN Basics（2.1–2.4）與 Backpropagation（2.5）。這三份講義在課程頁上標成「自學／先修」，也是本系列第 1、2 篇的內容。

## 兩條線：講課與助教課

課程頁的課表每一週分成 Lecture 與 Recitation 兩欄。Course Logistics 第 6 頁把兩邊的主題列得很清楚：講課負責 DL 基礎、語言表示、語言模型、Transformer、預訓練加微調、預訓練加 prompting、NLP 議題；助教課負責開發環境（Colab、GPU、PyTorch）、DL 工作流程、Hugging Face 基礎、LLM 架構、評估、訓練與推論。

下表依課程頁（不是 Course Logistics 第 13 頁的「Tentative Schedule」，兩者在 11 月的排序不同）整理：

| 日期 | 講課 | 助教課 | 作業／備註 |
|---|---|---|---|
| 自學／先修 | Introduction、NN Basics、Backpropagation | — | HW0 |
| 9/01 | Course Logistics、Sequence Modeling | Dev Infra & Tooling（PyTorch、Debugging） | |
| 9/08 | Attention、Transformer、Tokenization、BERT；另有 William Wang（UCSB）客座演講 | NLP Lifecycle | HW1 |
| 彈性補充 | Word Embeddings、BERT Variants | — | |
| 9/15 | Pretraining & Prompt Learning | Underlying Logics of Projects | |
| 9/22 | Post-Training、LLM Adaptation | LLM LoRA Training | HW2 |
| 9/29、10/06 | 教師節、中秋節停課 | | |
| 10/13 | Retrieval-Augmented Generation | LLM Basics & MoE | HW3 |
| 10/20 | 期中停課 | | |
| 10/27 | NLG Decoding、NLG Evaluation | LLM Inference & Evaluation | |
| 11/03 | Issues and Development in Pre-Trained Models | LLM Deployment | 期末專題公布 |
| 11/10 | Language Agents | | |
| 11/17 | Knowledge, Multimodality（只有標題） | | |
| 11/24 | Personalization（只有標題） | | |
| 12/01 | Reasoning（只有標題） | | |
| 12/15 | | | Final Project Due |

客座演講在課程頁上只有講者名字，沒有講題、投影片或影片，本系列不寫。

## 校外拿得到什麼：A2

本站的[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)把公開程度分成 A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學。[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)把 ADL Fall 2025 列為 A2，本系列重新核對後維持 A2：講課端很完整，作業端只有一份規格能確定是當期版本。

**公開的部分**

- L1–L11 的講義 PDF，加上分段影片（多數講次拆成 3 到 6 支，Attention、Transformer、BPE 各只有一支）。
- 播放清單上 L12–L14 的影片（見下一節）。
- 助教課影片與 2 份 Colab：[Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)、[NLP Lifecycle](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)。
- HW1 完整規格：中文抽取式問答，先從四段文字裡選出相關段落，再在段落裡找出答案的起訖位置，用 Exact Match 評分。排行榜在 Kaggle（9/29 截止），程式與報告交到 NTU COOL（10/1 截止）。
- HW2、HW3 與期末專題的說明影片。

**缺口**

1. **HW2、HW3 只有影片。** 課程頁的 HW 2、HW 3 按鈕直接連到 YouTube。影片說明欄各只有一句題目：HW2 是「LLM Tuning and Prompt Tuning for Classical Chinese Translation」，HW3 是「Retriever & Reranker Training for RAG」。資料集、baseline 與評分方式都沒有公開文字版。
2. **期末專題只有影片標題與說明欄。** [Final Project Introduction](https://youtu.be/UBe9eGPwRyg) 的說明欄寫 Rules and Grading；[Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I) 的說明欄寫 Jailbreaking Olympics。
3. **繳交與評分都在校內。** 作業交到 NTU COOL（需要台大帳號）；HW1 的 Kaggle 比賽本系列沒有打開驗證，不保證現在還能提交。
4. **L12–L14 沒有當期投影片**，L12 Reasoning 完全沒有投影片。
5. **有些連結壞了。** 課程頁上 5 份助教講義（如 `w2-ProjLife.pdf`）在 f114 路徑下都回傳 404，同名檔在 [Fall 2024 路徑](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)可以打開；BERT Variants 講義同樣要改用 [Fall 2024 版](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)。

**怎麼做**：如果你的目標是理解 NLP 從 RNN 到 LLM 的主線，講義加影片已經夠。如果目標是完整做完三份作業，只有 HW1 做得起來；HW2、HW3 要自己設計資料與評估方式，別期待能對上官方評分。

## 課程頁沒寫清楚的四件事

**1. 播放清單比課程頁多三講。** [2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)共 77 支影片。課程頁的 11/17、11/24、12/01 三列只有標題，但播放清單裡有：

- **L12 Reasoning**：12.1 What is Reasoning?、12.2 Short CoT、12.3 Test-Time Scaling、12.4 Learning to Reason、12.5 RL for Reasoning
- **L13 對話與工具使用**：13.1 Learning to Converse and Interact 到 13.9 Conversation Evaluation，中間有 LaMDA、BlenderBot、WebGPT、Toolformer、Plan-and-Execute、Theory-of-Mind
- **L14 超越監督學習**：14.1 Beyond Supervised Learning 到 14.7 Multimodality，中間有 Auto-Encoder、VAE、Dual Learning、Self-Supervised Learning、CLIP & DALL·E 2

課表上的 Personalization 在播放清單裡找不到對應影片。

**2. 課程頁的 HTML 裡留著 2022 年的作業。** 頁面下方 Homework 區塊的原始碼裡還有 A1_RNN、A2_BERT、A3_NLG 與 2022 年的截止日，不過這段已經被註解掉，瀏覽器看到的只有繳交規則（交到 NTU COOL、不接受遲交、repo 設成 private）。當期作業的入口是課表 Note 欄的 HW 1／2／3 按鈕，不要用搜尋引擎撈到的舊檔。

**3. 有一支影片連錯。** 彈性補充區 Word Embeddings 的「Intro」連到 [LosffMy3BqM](https://youtu.be/LosffMy3BqM)，實際標題是「ADL 4: Gating Mechanism 了解LSTM與GRU的細節」。同區其他 5 支才是詞嵌入影片。

**4. 2.5 Backpropagation 不在播放清單裡。** [ADL 2.5](https://youtu.be/BHgssEwMxsY) 在課程頁有連結，上傳者也是陳縕儂 Vivian NTU MiuLab，但 77 支的清單裡沒有它。只照播放清單看，會漏掉反向傳播這一段。

## 為什麼不讀 Fall 2026

adl.miulab.tw 現在轉到 [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~miulab/f115-adl/)。這學期還在進行，只有 9/07、9/14 兩週換了新講義（檔名開頭 `2609`）；9/21 以後各列仍連到 `250915_Pretraining.pdf` 這類 Fall 2025 的檔名，在 f115 路徑下一律 404。課表也改了：Alignment 挪到 11/09，新增 11/23 Human-AI Interaction。

所以本系列以 Fall 2025 為基準。Fall 2026 學期結束（課程頁寫 2026/12/14 Final Project Due）後，再評估要不要換版或補更新紀錄。

## 本系列怎麼排

系列大致照官方課序，只做三個調整：HW1 排在 BERT 之後、當成獨立一篇；HW2、HW3 與期末專題各自併進對應的講課篇，因為公開資訊都只有一句話；助教課集中成最後一篇，講課篇只放連結。

| # | 篇名 | 對應官方材料 |
|---|---|---|
| 1 | [什麼是機器學習與深度學習](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction) | Introduction、影片 1.1–1.3 |
| 2 | [神經網路與反向傳播](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop) | NN Basics、Backpropagation、影片 2.1–2.5 |
| 3 | [詞向量、語言模型與 RNN](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn) | Sequence Modeling、影片 3.1–3.4 |
| 4 | [Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer) | 影片 4.1–4.2 |
| 5 | [Tokenization 與 BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe) | 影片 5.1 |
| 6 | [BERT 與 BERT 家族](/posts/ai/2026-09-30-ntu-adl2025-bert-family) | 影片 5.2–5.6 |
| 7 | [HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) | HW1 規格投影片 |
| 8 | [預訓練三大類與 Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning) | 影片 6.1–6.6 |
| 9 | [後訓練：Instruction Tuning、RLHF 與 InstructGPT](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf) | 影片 7.1–7.4 |
| 10 | [PEFT：Adapter、LoRA、Prompt Tuning＋HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2) | 影片 7.5、HW2 影片 |
| 11 | [RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3) | 影片 8.1–8.6、HW3 影片 |
| 12 | [NLG：解碼、控制與評估](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation) | 影片 9.1–9.5 |
| 13 | [偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality) | 影片 10.1–10.3、專題影片 |
| 14 | [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents) | 影片 11.1–11.5 |
| 15 | [Reasoning（影片限定）](/posts/ai/2026-09-30-ntu-adl2025-reasoning) | 影片 12.1–12.5 |
| 16 | [對話系統與工具使用](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use) | 影片 13.1–13.9、Fall 2024 講義 |
| 17 | [超越監督學習與多模態](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal) | 影片 14.1–14.7、Fall 2024 講義 |
| 18 | [助教課：從 PyTorch 到 LLM 部署](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations) | 助教課影片、講義與 Colab |

第 15 到 17 篇的官方材料比前面少：15 沒有投影片，16、17 的投影片來自 Fall 2024，文章會逐段標明來源學期。

## 怎麼開始

1. **先確認先修**：微積分與線性代數是官方寫的必備。沒碰過 Python 或 PyTorch 的話，先看第 18 篇連到的 Dev Infra 助教課與 Colab。
2. **照官方的 HW0 走**：先讀第 1、2 篇，配著影片 1.1–2.5 看。這是選課前就要看完的部分，也是後面所有內容的共同語言。
3. **做 HW1 當檢查點**：讀完第 6 篇 BERT 之後做 HW1。它是唯一有完整規格的作業，能驗證你是不是真的能把一個 NLP 任務落到程式上。

站內相關入口：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)把 ADL 和李宏毅、林軒田的課放在一起比較；同校的[李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)從 AI Agent 切入，和 ADL 由基礎往上堆的順序互補。想看英文授課的 NLP 主線，可以對照 [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)。

下一篇：[什麼是機器學習與深度學習](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 週課表、講義與影片連結、助教課、作業入口、助教分工
- [Course Logistics 投影片（250901_Course.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — 課程目標、先修、評分、合作規範、HW0
- [2025 Fall 台大資訊 深度學習之應用 NTU CSIE ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [ADL 0: Course Introduction 課程介紹與規定（YouTube）](https://youtu.be/RwRZVd9rLxE)
- [ADL 2.5: Backpropagation（YouTube，不在播放清單內）](https://youtu.be/BHgssEwMxsY)
- [NTU ADL 2025 Fall HW1 規格投影片](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)
- [ADL 2025 Fall Homework 2 說明影片](https://youtu.be/_QiIp0WTRzI)
- [ADL 2025 Fall Homework 3 說明影片](https://youtu.be/tzjmqxw1n8M)
- [ADL 2025 Final Project Introduction](https://youtu.be/UBe9eGPwRyg)、[Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I)
- [助教課 Colab：Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)、[NLP Lifecycle](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [NLP Lifecycle 助教講義（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [BERT Variants 講義（Fall 2024 路徑）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [ADL Fall 2026（115-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f115-adl/) — 進行中的學期，只用來比對
- [陳縕儂 Vivian NTU MiuLab YouTube 頻道](https://www.youtube.com/@VivianMiuLab/playlists)
- 站內：[全球 AI／CS 課程地圖（A0–A3 分級定義）](/posts/learning/2026-08-21-global-ai-cs-course-map)
- 站內：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
