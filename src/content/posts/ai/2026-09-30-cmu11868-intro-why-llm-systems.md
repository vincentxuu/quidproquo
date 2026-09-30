---
title: "CMU 11-868 L01 開場：LLM 為什麼需要系統——規模曲線、底層運算子與三層抽象"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 1
tldr: "CMU 11-868 第一講用 51 頁投影片論證一件事：LLM 的瓶頸不只在模型，而在「用更少的 GPU、記憶體與電力，更快地在更大的資料上訓練與推論更大的模型」。它把一個 Transformer 拆成矩陣乘法、reduction、map、記憶體搬移四種底層運算子，再把難題分到 kernel、框架、分散式系統三層，並提醒光把計算變快不夠，資料搬移同樣花時間。"
description: "導讀 CMU 11-868 LLM Systems（Spring 2026）L01 Introduction 投影片：課程學習目標、LLM 規模曲線、next-token 機率模型與訓練流程如何定義系統的工作量、底層運算子、三個抽象層的系統挑戰、模型／演算法／系統協同設計、計算與資料搬移的取捨，以及這些論點如何對應到後面的講次與作業。"
draft: false
glossary:
  - term: "model-algorithm-system co-design"
    aliases: ["協同設計", "co-design"]
    definition: "同時設計模型架構、訓練與推論演算法、軟體優化（切分、排程、資料搬移、延遲隱藏）與硬體加速，而不是各層分開優化。"
    context: "CMU 11-868 L01 把它列為 LLM 系統的核心主張，標題寫「LLM needs Model-Algorithm-System Co-design」。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。主要材料是 1/12 的 [L01 Introduction to LLM 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-01-intro-14e74a426e4a7e3ed485a026e1f65b70.pdf)（51 頁），頁碼指 PDF 頁碼。事實皆於 2026-09-30 核對。本課**沒有公開錄影**，以下只根據投影片文字，講者的口頭補充無從得知。

**系列位置**：上一篇 [系列總覽與自學路線](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)｜下一篇 [L02–L04 GPU 程式模型與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

L01 分四段：LLM 能做什麼、數學基礎、LLM 系統的挑戰、課務（第 5 頁）。課務已經寫在[總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)，本篇只順著前三段，看這一講怎麼論證「LLM 需要系統」。

## 課程目標先丟出一個算術題

第 4 頁的學習目標有三條，第一條底下只放了一個問題：

> How much resources do you need to train a 100B model?

另外兩條是工程能力（寫快的 CUDA kernel、可擴展的訓練系統、高效推論）與研究能力（在 LLM 系統研究裡找到新問題並解決它）。這三條幾乎就是整學期的目錄：kernel 對應 GPU 那幾講與 HW1、HW4，訓練系統對應分散式訓練與 HW5，推論對應服務那幾講與 HW6。

L01 沒有真的算出 100B 模型要多少資源，它只把問題丟出來。想先把這筆帳算一次，可以讀 [CS336 Lecture 2：先算 FLOPs 與記憶體](/posts/ai/2026-08-22-cs336-resource-accounting)。

## 規模曲線：為什麼這是系統問題

第 3 頁是一張對數座標圖，縱軸是參數量（十億），從 2017 年的 Transformer、GPT-1、GPT-2，一路到 GPT-3、Gopher、PaLM，再到 GPT-4、DeepSeek-V3、Kimi K2，最高刻度是 10,000B。L02 開頭又放了同一張圖，副標直接寫「the need for system optimization」。

圖上從 GPT-2 到 Kimi K2 跨了好幾個數量級。對照 L02 第 15 頁的規格表，最新的 B200 一張也只有 192GB 記憶體。模型放不進一張卡、資料一台機器讀不完的時候，系統工程就是訓練得起來的前提，不是事後的優化。

## 數學基礎，其實是在定義工作量

第二段看起來在補 LLM 基礎，但每一頁都在定義系統要處理的計算。

- **Next-token 機率**（第 20–21 頁）：語言模型把一句話的機率拆成逐字條件機率的連乘。這決定了生成必須一個 token 接一個 token 做，後面的解碼與服務講次都從這裡出發。
- **三種架構**（第 23–26 頁）：encoder-only（BERT 的 masked prediction）、encoder-decoder、decoder-only。第 26 頁說 decoder-only 是「Most popular choice of LLM architecture」。
- **訓練流程**（第 27–29 頁）：預訓練、監督式微調、RL 三階段；預訓練用 next-token 的 cross-entropy loss，資料是越大越好、品質也重要的網路語料。
- **ChatGPT 為什麼改變局面**（第 22 頁）：在大量原始資料上預訓練（300B tokens）加少量人類回饋、能照指令做事、能靠 in-context learning 泛化。第 32 頁再補一句「Both model scale and data are important」。

所以系統要撐的是三件事：超大模型、超大資料、逐 token 的生成。後面每一講都是在其中一件上找辦法。

## 系統問題的定義

第三段的第一頁（第 34 頁）先說現代 LLM 有三個特性：什麼任務都能寫成 token 序列生成、可以用自然語言下指令、能呼叫外部工具並接收回饋（agentic）。接著第 35 頁給出整門課的問題定義：

> Key system problem: compute (train/inference) larger LLMs on bigger datasets with fewer resources (GPU/memory/power) faster

同一頁提了兩個設計原則：找到**對的抽象**，做出能對應用開發者隱藏複雜度的積木；看清**取捨**，先問根本限制與主要成功指標是什麼。

### 把 Transformer 拆成四種運算子

第 36 頁把 LLM 的計算拆成兩層。上層是常見的網路層：multi-head attention、layer norm、dropout、linear、非線性活化函數、softmax。下層只有四種運算子：

| 底層運算子 | 例子 |
|---|---|
| 矩陣／張量乘法 | linear、attention 裡的 QKᵀ |
| Reduction | 加總、平均 |
| Map | 逐元素套用函數 |
| 記憶體搬移 | 在裝置、記憶體層級之間搬資料 |

這張表值得記住，因為 [Assignment 1](https://llmsystem.github.io/llmsystemhomework/assignment_1/) 要你寫的 CUDA kernel 正好是 map、zip、reduce 與 matrix multiply。你寫完這幾個 kernel，MiniTorch 上面的每一層就都跑在你自己的 GPU 程式碼上。

### 難題分在三層

第 37 頁把系統挑戰畫成三層：

| 抽象層 | 要解決的事 |
|---|---|
| 分散式／平行系統 | 巨大模型、巨大資料、很長的序列與上下文；切分、排程、通訊 |
| 深度學習框架 | 讓人容易開發與修改模型、容易開發 ML 演算法 |
| 以資料區塊為單位的運算子 | 快的 CUDA／TPU kernel、資料與模型壓縮 |

課表大致由下往上走：先 GPU 與 kernel，再框架與自動微分，再 Transformer 與加速，最後才是分散式訓練與服務。

### 協同設計，以及資料搬移

第 38 頁的標題是「LLM needs Model-Algorithm-System Co-design」，要同時設計四件事：模型架構、訓練與推論演算法、軟體優化（切分、排程、資料搬移、延遲隱藏），以及用裝置專屬指令做的硬體加速。這一頁的第一行寫著「Scaling is all you need! – scale up and scale down」。

第 39 頁是整講最像系統課的一頁：

> Making computation fast is not enough

原因有三：大模型參數多，在裝置與節點之間傳參數、傳梯度可能比計算更花時間；整批資料和單一序列的處理方式不同；長上下文需要很大的工作記憶體。這個「計算 vs. 搬移」的張力會一路貫穿課程：L04 的 tiling、LightSeq 的融合 kernel、FlashAttention、ZeRO、KV cache 管理，都是在少搬一點資料。

第 40 頁最後談程式模型，把 AI 應用分成三層：上層把模型整合進產品並長期改善品質，中層做訓練與推論軟體與串流資料流，下層做 GPU kernel 與編譯器。好的抽象要「frees the programmer of one or more concerns」，同時還能支撐各種上層應用。

## 這門課不適合誰

第 45 頁直接列出三種不該修的人：想學怎麼建深度學習模型、用 TensorFlow／PyTorch 的人，去修 11-685／11-785；想學用 LLM、對底層系統沒興趣的人，去修 11-667；沒辦法出席、完成作業與專題的人，因為這門課「requires system implementation」。

第 47 頁補充作業的形態：個人完成，寫 Python 與 C++／CUDA，會一路做出 MiniTorch 的主要元件並訓練一個 Transformer LLM；CUDA 經驗「helpful but not required」。

## 讀完這講可以做什麼

- **把四種運算子對到你熟悉的模型上。** 拿一個你用過的 Transformer 實作，逐層標出它用到哪幾種底層運算子。softmax 同時需要 reduction（對整列加總）和 map（逐元素取指數、相除）；HW4 就是要你把它寫成一個融合 kernel。
- **自己試算那道 100B 的題目。** 用「參數量 × 每個參數的位元組數」估權重大小，再比對一張 GPU 的記憶體，看至少要切成幾份。算不出梯度與 optimizer state 的部分沒關係，後面 ZeRO 那講會補上。
- **決定路線。** 如果你讀到第 45 頁覺得自己屬於第二種人，本系列仍然值得讀，但作業可以跳過；想動手的話，先看[總覽的自學路線](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)確認硬體。

## 延伸閱讀

- [CS336 Lecture 2：先算 FLOPs 與記憶體，再談模型跑不跑得動](/posts/ai/2026-08-22-cs336-resource-accounting)：把 L01 丟出的資源問題實際算一次。
- [CME295 第 5 講：LLM 系統](/posts/ai/2026-09-29-cme295-llm-systems)：用一講的篇幅看同一組系統問題。
- [CMU 11-785 深度學習導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：L01 推薦給「想學建模型」的人去修的課。

## 參考資料

- [CMU 11-868 L01 Introduction to LLM 投影片（Spring 2026，51 頁）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-01-intro-14e74a426e4a7e3ed485a026e1f65b70.pdf)
- [CMU 11-868 Spring 2026 首頁（課程描述）](https://llmsystem.github.io/llmsystem2026spring/)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [CMU 11-868 Assignment 1: CUDA Programming](https://llmsystem.github.io/llmsystemhomework/assignment_1/)
- [CMU 11-868 L02 GPU Programming 投影片（第 3 頁規模曲線）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf)
