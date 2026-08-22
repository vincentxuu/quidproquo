---
title: "MIT 6.S191 導讀：九講與三個 labs 全公開，但完整跑完仍要三個外部服務"
date: 2026-08-21
category: ai
type: guide
tags: [mit, ai-course, deep-learning, pytorch, colab, llm]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 1
tldr: "MIT 6.S191 的 2026 版已公開九講影片、投影片、三個 software labs 與解答，足以列為 A3 自學課；但官方執行路線需要 Google／Colab、Comet，以及 Lab 3 的 OpenRouter，校外讀者也拿不到 MIT 的學分、專案回饋與 API credit。"
description: "MIT 6.S191 Introduction to Deep Learning 2026 完整導讀：九講如何安排、三個 labs 實際做什麼、公開教材能走到哪裡、Google Colab、Comet 與 OpenRouter 有哪些限制，以及 2025 和 2026 版本該怎麼選。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)

[MIT 6.S191: Introduction to Deep Learning](https://introtodeeplearning.com/) 的 2026 版已經完整公開：九講都有官方影片與投影片，三個 software labs 的 notebook、必要程式與解答也在官方 GitHub。按照本站的公開程度標籤，它是 **A3：足以自學**。

但「全公開」不等於「匿名打開瀏覽器就能一格不漏跑完」。官方路線要求 Google 帳號與 Colab GPU；Lab 1、2 會用 Comet，Lab 3 再加 OpenRouter。MIT 現場生能拿到的專案回饋、學分與 API credit，校外讀者也沒有。

所以這篇不只列九個影片標題。我要回答的是：這九講如何接起來、三個 labs 到底做什麼，以及自學者會在哪一步碰到帳號、算力與回饋的邊界。

這篇查過 2026 課站、九份投影片入口、官方 GitHub 的 README、三組 labs 與公開解答，也對照了 2025 封存站與兩年的程式分支。**沒有逐段看完九支影片**；以下是課程結構與可執行性的稽核，不是授課表現評論。

## 先判斷它是不是你要的課

6.S191 官方稱自己是 high-intensity bootcamp。2026 年從 3 月 30 日到 5 月 25 日，每週一講，對 MIT 學生是三學分、P/D/F，評分依據是 project proposal。先修要求只列基礎線性代數、微積分與鏈式法則；Python 有幫助但不是硬條件，校外旁聽者也被明確歡迎。

這組資訊決定了它的定位：**它是快速建立全景與動手感的入口，不是完整一學期的深度學習理論課。** 九週裡要從神經網路走到生成模型、強化學習、安全、科學應用與分散式訓練，廣度必然比推導深度更優先。

適合它的人：已經會一點 Python，希望四到九週內把「模型、訓練、應用、評估」串成一條線。若你想從機率、最佳化一路嚴格推導，或要做大型系統實作，應把它當入口，再接 MIT 6.7960、CMU 11-785 或專門的 ML systems 課。

## 九講其實是三段路

### 第一段：先把深度學習的共同語言補齊

前六講是主幹：Introduction to Deep Learning、Deep Sequence Modeling、Deep Computer Vision、Deep Generative Modeling、Deep Reinforcement Learning、New Frontiers。

這一段不是依應用領域各自散開，而是反覆看同一套問題：輸入如何表示、模型如何產生預測、loss 如何回傳訊號、序列或空間結構如何改變架構。Lab 1 接 sequence modeling，Lab 2 接 vision 與 generative modeling，讓前四講不是只停在投影片。

第五講強化學習把「從標註答案學習」換成「從行動後果學習」。第六講再把視角拉到前沿應用。若你只想要最小核心，可以先完成前六講與前兩個 labs；這已經構成一門緊湊的入門課。

### 第二段：2026 新增的是如何讓 AI 進入真實流程

第七講 The Three Laws of AI 不是另一堂模型架構課。它把 observability、trace、測試資料集、metrics 與持續 evaluation 放到安全討論裡：系統如果沒有留下行為軌跡、沒有反覆測試，就很難談部署後是否可靠。

第八講 AI for Science 從假說與實驗循環出發，談大氣、材料與藥物探索。它的重要提醒是：科學 AI 不能只靠更多資料，還要把 invariance、conservation law 與模擬器等領域結構放進模型或學習流程。

### 第三段：模型能跑，跟模型能大規模訓練是兩回事

第九講 Secrets to Massively Parallel Training 從 CPU／GPU 差異與 scaling law 出發，接到 activation checkpointing、offloading、data／tensor／pipeline／context parallelism、ZeRO、FSDP 與 mixture-of-experts。課程用 LFM2 當案例，說明這些技術如何一起使用。

這堂放在最後很合理：前面八講告訴你可以訓練什麼，第九講才處理模型與資料大到單張 GPU 放不下時，記憶體、通訊與平行策略如何共同決定能不能訓練。

## 三個 labs 才是這門課的骨架

官方 repo 同時保留 PyTorch 與 TensorFlow 版本的前兩個 labs；以下以 PyTorch 路線為主。所有 notebook 都有 TODO，官方也公開 solution notebook。自學時不要一開始就開解答，先讓失敗的 cell 告訴你哪個概念沒有接上。

### Lab 1：從 tensor 一路做到音樂生成

[Lab 1](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab1) 先補 PyTorch 基本操作，再用 RNN／LSTM 讀 ABC notation、產生愛爾蘭民謠。這個題目不只是展示模型會生成東西：你會碰到字元表示、序列切片、hidden state、loss、訓練迴圈與 sampling。

它也是最適合拿來試水溫的一份。若你連 Part 1 都需要大量補課，先停在這裡整理 Python、tensor shape 與反向傳播，比直接跳到 LLM 微調有效。

### Lab 2：分類準確率之外，資料偏差怎麼進模型

[Lab 2](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab2) 的 Part 1 用 MNIST 做 fully connected network 與 CNN；Part 2 進到 facial detection 與 debiasing，以 DB-VAE 學習臉部資料的 latent distribution，再調整取樣。

它的價值是把「生成模型」與「公平性」接在同一個實驗裡。你不是只讀一段 AI bias 的倫理說明，而是要觀察資料分布如何影響訓練、模型在哪些臉上表現較差，以及重新取樣能修正什麼、不能修正什麼。

### Lab 3：LoRA 微調，再用另一個 LLM 當裁判

[Lab 3](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab3) 使用 Liquid AI 的 LFM2-1.2B。先建立 chat template、tokenize 與 generate，再用 LoRA 只更新少量參數，把模型調成特定說話風格。最後用較大的模型做 LLM-as-a-judge，配合 Comet 的 Opik 建立評估指標。

這份 lab 很像 2026 年的 AI prototype：底模從 Hugging Face 載入、微調用 PEFT、judge 經 API 呼叫、評估另有 observability 工具。好處是接近真實工作流；代價是依賴也最多。

## 「可以自學」和「完全沒有門檻」差在哪裡

| 項目 | 校外讀者狀態 | 真正限制 |
|---|---|---|
| 九講影片與投影片 | 公開 | 影片不等於練習；要配 labs |
| 三個 labs、資料與 helper code | 公開 | 官方支援路線用 Colab GPU |
| Solution notebooks | 公開 | 太早打開會直接消滅練習效果 |
| Google／Colab | 需要 | README 明寫要 Google 帳號，並選 GPU runtime |
| Comet | Lab 1、2、3 的供應流程會用 | notebook 要求帳號與 API key，負責實驗追蹤或 Opik 評估 |
| OpenRouter | Lab 3 的 judge 段落需要 | 要帳號與 API key；強模型可能付費，免費模型有 rate limit |
| MIT 學分與 P/D/F | 拿不到 | 只屬正式註冊流程 |
| 專案評審、staff feedback、office-hour credit | 不應假設拿得到 | 課站描述的是 MIT offering；Lab 3 credit 明寫給現場學生 |
| Lab competition | notebook 有提交說明 | 2026 活動時程已過，校外資格不能從公開 notebook 推定 |

最容易寫錯的是「只要有 Google 帳號就能全免費完成」。Lab 3 notebook 明寫，大型 judge model 需要付費；MIT 現場生可在 office hour 取得 OpenRouter credit。它也提供免費模型選項，但同一段就提醒會碰到 rate limit。

你當然可以修改 notebook，換掉 Comet、改成本地 Jupyter、用不同 judge。那是合理的工程選擇，卻已經不是「照官方步驟重現」。因此本站仍把它判為 A3，但在 A3 後面附註服務依賴，而不是宣稱零帳號、零成本。

## 2025 和 2026 怎麼選

[2025 封存版](https://introtodeeplearning.com/2025/index.html)不是殘缺備份。它有十講影片、投影片與同樣三組 labs，可以正式自學。差別主要在課程後半：2025 有兩講 Large Language Models，接 AI in the Wild 與 AI for Biology；2026 改成 Three Laws of AI、AI for Science 與 Massively Parallel Training，總講數從十變九。

Labs 的概念延續，但檔案不是完全相同。最明顯的是 Lab 3：2026 改用 LFM2-1.2B，並以 Gemini 2.5 作為建議 judge。官方 GitHub 有年度分支；如果跟 2026，就讓課站、notebook 與 solution 全部留在 2026，不要拿 2025 的影片順手配 2026 的 TODO，再假設 API、模型名稱與輸出完全相容。

我的選法很簡單：**現在開始就用 2026**。只有兩種情況回到 2025：你特別想看兩堂獨立 LLM 講座，或 2026 notebook 的服務／模型變更讓你的環境卡住，需要拿完整舊版當替代線。切換時整組換，不要逐項拼裝。

## 四週自學路線

正式課程走九週；自學可以壓成四週，但每週都要留下作品，不要只留下觀看紀錄。

### 第一週：序列模型

- 看 Lecture 1、2。
- 完成 Lab 1 的 PyTorch Part 1 與 music generation。
- 產出：一個能播放的生成音樂檔，加一張 training loss 圖，另外寫下 sequence length 改變後的差異。

### 第二週：vision 與生成模型

- 看 Lecture 3、4。
- 完成 Lab 2 的 MNIST 與 debiasing。
- 產出：比較 baseline 與 debiased model，不只報總 accuracy，至少記錄一個失敗樣本或 subgroup 現象。

### 第三週：決策與 LLM 微調

- 看 Lecture 5、6。
- 完成 Lab 3 到 LoRA 微調；先不用急著接付費 judge。
- 產出：固定三個 prompts，比較 base model 與 fine-tuned model 的回覆，寫出你的評分準則。

### 第四週：評估、科學與系統

- 看 Lecture 7、8、9。
- 再決定是否替 Lab 3 接 OpenRouter／Opik；若不接，就人工依前一週的 rubric 評分。
- 產出：一頁 mini project proposal，包含問題、資料、baseline、metric、失敗條件、算力與服務依賴。這也最接近正式課程用 project proposal 收尾的方式。

這條路故意把 API judge 延後。先定義評分準則，再決定要不要花錢讓模型執行；否則你只會學會貼 API key，沒有學會 evaluation。

## CSDIY 在這篇能證明什麼

[CSDIY](https://csdiy.wiki/)目前的深度學習路線有 MIT 6.7960、CMU 11-785 等課，但搜尋不到獨立的 6.S191 課程頁。這不是反證：6.S191 的 2026 官方材料確實完整公開，GitHub 也明寫 labs 可按自己的速度完成。

它反而提醒一件事：社群指南適合找實修心得與歷史替代資源，不能拿「有沒有被收錄」判定今天能不能上課。這篇的 A3 判定來自當期官方課站與 repo；CSDIY 用來幫你比較下一門較長、較硬的課，不用來替官方權限背書。

## 最小開始方式

不要先把九支影片加入稍後觀看。打開官方 GitHub 的 [Lab 1 PyTorch Part 1](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/lab1/PT_Part1_Intro.ipynb)，按 Run in Colab，確認三件事：Google 帳號能進、GPU runtime 能選、第一組 TODO 能在不看 solution 的情況下完成。

給自己九十分鐘。九十分鐘後如果你能說清楚 tensor shape、gradient 與下一個 TODO 在做什麼，就接 Lecture 2 與音樂生成；如果時間都花在 Python syntax，先補 Python／NumPy，再回來。這個小測試比「我有沒有數學天分」更能預測你是否適合現在開始。

## 更新紀錄

- 2026-08-22：新增九講與三個 labs 的雙語系列，並將所有 lab 連結固定到官方 `2026` branch。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/) — 日期、九講影片與投影片、三個 labs、先修、學分、評量與公開授權
- [MIT 6.S191 2025 封存站](https://introtodeeplearning.com/2025/index.html) — 十講結構與年度比較
- [MITDeepLearning/introtodeeplearning](https://github.com/MITDeepLearning/introtodeeplearning) — 2026 labs、Colab／Google 帳號與 GPU runtime 說明、MIT License
- [Lab 1：PyTorch 與 Music Generation](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab1) — RNN／LSTM、Comet 與公開解答
- [Lab 2：MNIST 與 Debiasing](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab2) — CNN、DB-VAE、Comet 與公開解答
- [Lab 3：LLM Fine-tuning](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/lab3/LLM_Finetuning.ipynb) — LFM2-1.2B、LoRA、OpenRouter、Gemini 2.5 與 Opik 的執行要求
- [CSDIY CS 學習規劃](https://csdiy.wiki/CS%E5%AD%A6%E4%B9%A0%E8%A7%84%E5%88%92/) — 社群深度學習路線對照；目前未列獨立 6.S191 頁面
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)
