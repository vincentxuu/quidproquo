---
title: "NVIDIA NCA-GENM 備考路徑：多模態那張，但兩門必備課程只有 $500 講師版"
date: 2026-08-18
type: guide
category: ai
tags: [certification, nvidia, multimodal, generative-ai, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 12
tldr: "NCA-GENM 與 NCA-GENL 同價同時長同級別，但重心完全不同：Experimentation 升到 25%（最重），Core ML 從 30% 降到 20%，並多出 Multimodal Data 15% 與 Performance Optimization 10% 兩塊。內容上考 U-Net、CLIP、擴散模型、多模態損失函數、attention map，以及 Riva／NeMo／Triton／ACE 這幾個 NVIDIA SDK。要注意成本結構：官方建議的五門課裡有兩門只有 $500 的講師版、沒有自學選項——純自學路線先天蓋不滿。官方規格：$125、1 小時、50–60 題、效期兩年、僅英文。"
description: "NVIDIA NCA-GENM（Generative AI Multimodal Associate）備考指南，依官方七塊權重逐項拆解多模態資料、實驗、效能最佳化與 U-Net／CLIP／擴散模型，說明與 NCA-GENL 的差異、五門建議課程中兩門僅有講師版的成本問題，以及三週時程換算依據。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-nvidia-nca-genm-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回 [NVIDIA 官方認證頁](https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/)與官方 Exam Study Guide，不含考古題。查證日期：2026-08-18。

NCA-GENM 跟 [NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide) **同價（$125）、同時長（1 小時）、同級別（associate）**，但兩張是平行的兄弟而不是階梯 —— 一張走 LLM，一張走多模態（文字、影像、音訊）。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 七塊權重，以及與 NCA-GENL 的差異

| 主題 | NCA-GENM | 對照 NCA-GENL |
|---|---|---|
| **Experimentation** | **25%** | 22% |
| Core Machine Learning and AI Knowledge | 20% | **30%** |
| **Multimodal Data** | **15%** | —（沒有這塊） |
| Software Development | 15% | 24% |
| Data Analysis and Visualization | 10% | 14% |
| **Performance Optimization** | **10%** | —（沒有這塊） |
| Trustworthy AI | 5% | 10% |

**三個變化決定了準備方向**：Experimentation 升到最重的 25%；多出 **Multimodal Data 15%** 與 **Performance Optimization 10%** 兩塊全新的；Core ML 從 30% 降到 20%、Trustworthy AI 從 10% 砍半到 5%。

也就是說：**如果你已經考過或準備過 NCA-GENL，這張有大約四分之一是全新內容，其餘是同一套骨架換題材。**

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | **$125** |
| 時間 | **1 小時** |
| 題數 | 官方頁面同樣並存兩個數字：內文「includes 50 questions」、規格欄「50-60 multiple-choice」 |
| 及格 | 不公布（pass/fail，不給分數） |
| 效期 | 2 年，只能重考 |
| 語言 | 僅英文 |
| 先修 | 「A basic understanding of generative AI」 |
| 報名 | **已開放**（直接連 Certiverse 結帳，與兩張 professional 的 Coming soon 不同） |

## 成本結構的雷：兩門必備課只有講師版

這是這張跟其他 NVIDIA 證照最不一樣的地方。官方建議的五門課裡，**有兩門沒有自學選項**：

| 官方建議課程 | 自學版 | 講師版 |
|---|---|---|
| [Getting Started With Deep Learning](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-01+V1) ／ Fundamentals of Deep Learning | 8 小時 **$90** | 8 小時 $500 |
| [Introduction to Transformer-Based NLP](https://courses.nvidia.com/courses/course-v1:DLI+S-FX-08+V1/) ／ Building Transformer-Based NLP Applications | 6 小時 **$30** | 8 小時 $500 |
| [**Building Conversational AI Applications**](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+C-FX-06+V2) | **無** | 8 小時 **$500** |
| [Generative AI With Diffusion Models](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-14+V1) | 8 小時 **$90** | 8 小時 $500 |
| [**Building AI Agents with Multimodal Models**](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+C-FX-17+V1) | **無** | 8 小時 **$500** |

**自學能買到的只有三門，合計 $210；剩下兩門要走講師課，合計 $1,000。**

對照 [NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide)（五門都有自學版、全買 $390），這張的自學路線先天蓋不滿官方建議。

**實務建議**：**別為了那兩門花 $1,000。** 它們對應的內容（對話式 AI 應用、多模態 agent）可以用官方文件與開源專案自己練 —— 特別是 Building AI Agents with Multimodal Models 那門，主題在多模態 agent，而這張的 blueprint 裡並沒有「agent」這個獨立領域。真正必買的是 **Generative AI With Diffusion Models（$90）**，它直接對應 Software Development 那 15% 裡的 U-Net 與 CLIP 條目。

## 逐塊準備

### Experimentation（25%，最重）

**官方考什麼**：協助開發與測試多模態 AI 模型；**管理與前處理來自多種來源的資料**；**用多模態模型提升可解釋性**；在多模態情境下測試資料品質與一致性；測試模型以確保準確與有效。

**怎麼準備**：這塊在 NCA-GENL 是 22%、在這張升到 25%，而且題材換成多模態。重點在**「跨模態的一致性」** —— 文字與影像對不齊、音訊與時間軸偏移，這類問題是多模態獨有的。

### Core Machine Learning and AI Knowledge（20%）

**官方考什麼**：**控制多模態情境下的訓練穩定性**；**多模態損失函數**；ML 基礎（特徵工程、模型比較、交叉驗證）；**非序列神經網路與殘差連結**；設計評估多模態管線的統計分析；**多模態專屬的遷移學習**；新興趨勢；能源效率與可信賴的多模態模型；prompt engineering；深度學習框架（TensorFlow、PyTorch）。

**怎麼準備**：**多模態損失函數與訓練穩定性是這塊的核心**，也是跟 NCA-GENL 差最多的地方。殘差連結與非序列網路屬於基礎架構知識，官方那門 $90 的 Deep Learning 入門課涵蓋得到。

### Multimodal Data（15%，新增）

**官方定義**：「跨文字、影像、音訊、時間序列與地理空間等多元資料型態的整合、策展與品質評估，並處理各模態間**缺失或不完整資訊**的挑戰」。

**怎麼準備**：這塊的關鍵詞是**缺失模態**（modality missingness）—— 某一筆資料只有影像沒有音訊時怎麼辦。地理空間與時間序列也被官方列進來，範圍比多數人想的寬。

### Software Development（15%）

**官方描述**：「設計與實作神經網路架構，例如用於生成影像的 **U-Net**、整合 **CLIP** 這類文字轉影像模型，並運用 prompt engineering… 包含熟悉 **Riva、NeMo、Triton、Avatar Cloud Engine（ACE）** 等 NVIDIA SDK」。

具體條目包含：**用 U-Net 從純雜訊生成影像**、把 U-Net 當成一種 autoencoder；**用 CLIP 從英文 prompt 生成影像**、**用 CLIP 訓練文字轉影像的擴散模型**。

**怎麼準備**：這是全張最具體、最能動手的一塊，也是 $90 那門 Diffusion Models 課的正中紅心。**四個 NVIDIA SDK（Riva、NeMo、Triton、ACE）要知道各自負責什麼**：語音、模型建構、推論服務、虛擬人。

### Data Analysis and Visualization（10%）與 Performance Optimization（10%）

**Data Analysis** 除了常見的圖表與趨勢辨識，多了一條 **「多模態情境下的 attention map」** —— 這是可解釋性的具體做法，跟 Experimentation 那塊的「用多模態模型提升可解釋性」互相呼應。

**Performance Optimization（新增）**：提升運算效率與輸出準確度；**調校超參數**；多模態專屬遷移學習；在指導下協助模型訓練與訓練最佳化。

### Trustworthy AI（5%）

四條「描述」層級的條目：倫理原則、資料隱私與同意的平衡、用 NVIDIA 與其他技術提升可信度、降低偏誤。權重從 NCA-GENL 的 10% 砍半，讀過官方免費的 Trustworthy AI 頁面即可。

## 三週時程與換算依據

**換算方式**：與 NCA-GENL 同級同時長，內容量相當，所以同樣抓三週。差別在**你從哪裡來**：

**情境 A：做過 LLM／NLP，沒碰過影像與音訊**

| 週次 | 內容 |
|---|---|
| 第 1 週 | Software Development（15%）：U-Net、CLIP、擴散模型 —— 直接上 $90 那門課並動手跑 |
| 第 2 週 | Multimodal Data（15%）+ Core ML 的多模態部分（損失函數、訓練穩定性） |
| 第 3 週 | Experimentation（25%）+ Data Analysis（10%）+ Performance Optimization（10%）+ Trustworthy AI（5%） |

**情境 B：做過電腦視覺，沒碰過 LLM**

把第 1 週換成 Transformer 入門（官方 $30 那門）與 prompt engineering，其餘相同。

**限時練習同樣重要**：一小時 50–60 題，平均每題約一分鐘，而且**不會給你分數診斷**。

**失敗成本**：官方 FAQ 規定沒過等 **14 天**、**同一張考試 12 個月內最多五次**，每次都要重新購買。

## 兩年效期，只能重考

跟其他三張 NVIDIA 證照相同：兩年、只能靠重考續期、**沒有繼續教育路徑也沒有折扣**。兩年後再付 $125。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 七塊權重 | 25 / 20 / 15 / 15 / 10 / 10 / 5 | 每季 |
| 題數 | 官方頁面並存 50 與 50–60 兩個數字 | 每半年 |
| 兩門課只有講師版 | Building Conversational AI Applications、Building AI Agents with Multimodal Models | 每季 |
| 費用 | 考試 $125；自學課 $30–$90；講師課 $500 | 每季 |

## 參考資料

- [NCA-GENM 官方認證頁（規格、blueprint、建議課程）](https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/)
- [NVIDIA 認證總覽與 FAQ（計分、重考、續期）](https://www.nvidia.com/en-us/learn/certification/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [NVIDIA NCA-GENL 備考路徑（同級的 LLM 那張）](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide)
- [NVIDIA NCP-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)
