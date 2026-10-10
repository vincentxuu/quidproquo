---
title: "政大蔡炎龍 生成式AI 導讀：總覽與自學路線"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, taiwan]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 0
tldr: "《生成式 AI：文字與圖像生成的原理與實務》是政大應數系蔡炎龍主講、以 TAICA 衛星課程開放給聯盟學校的入門課。網路上最完整的那頁課程網站其實是長庚衛星班（協同教師楊智淵）的頁面。本系列以 Spring 2025（1132）為準：14 支錄影、14 份投影片、12 份作業說明與評分標準都公開，Demo notebook 也在 GitHub 上，存取分級 A3；缺口是 notebook 會持續改版、繳交與批改走各校平台、期末專案成果沒有公開。"
description: "政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》系列入口：課程歸屬與長庚衛星班頁面的關係、TAICA 衛星課程的分工、1132 學期的 A3 存取分級與四個缺口、講次與作業週次的對應、三種評分版本、Colab／OpenAI／Groq／AISuite／Gradio／diffusers／Fooocus 工具鏈，以及 Fall 2026（1151）課綱的變動。"
draft: false
glossary:
  - term: "TAICA"
    aliases: ["台灣大專院校人工智慧學程聯盟"]
    definition: "台灣大專院校人工智慧學程聯盟。由主導學校的老師開設直播課，聯盟學校以衛星課程方式讓自己的學生修課。"
    context: "本課是 TAICA 的主導課程之一，開課學校是政大。"
  - term: "衛星課程"
    definition: "TAICA 的修課型態：主導課程老師提供直播、錄影與投影片，聯盟學校由協同老師找助教、獨立評完自己學校學生的成績。"
    context: "長庚大學的衛星班頁面就是這種安排下的產物，作業評分標準出自那裡。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

《生成式 AI：文字與圖像生成的原理與實務》是國立政治大學應用數學系**蔡炎龍**老師的課。它是 [TAICA（台灣大專院校人工智慧學程聯盟）](https://taicatw.net/fall-115/)的主導課程，每週二下午直播，聯盟學校的學生可以用衛星課程的方式修課。

這門課的定位很清楚：程式基礎不多的初學者，先弄懂神經網路、GAN、大型語言模型、RAG、AI Agents 與 diffusion 生圖的原理，再用 [Google Colab](https://colab.research.google.com/) 做出對話機器人、RAG 系統、Agent 與生圖 Web App。它在本站的課程導讀裡算是較淺的一條入口，深入的部分會用延伸閱讀連到其他系列。

這篇是系列入口，只講課程是誰開的、校外讀者拿得到什麼、講次與作業怎麼對上、需要哪些工具，以及 Fall 2026 有什麼不同。每一講的內容留給後面各篇。

## 課程影片來源

本文是課程總覽或資源地圖，沒有單一對應講次；請從官方課程入口與播放清單查找影片。

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## 這門課是誰的：政大主講，長庚那頁是衛星班

在網路上搜尋這門課，最容易找到的完整頁面是 [yangchihyuan.github.io/courses/GenerativeAI2025](https://yangchihyuan.github.io/courses/GenerativeAI2025)。這頁掛在長庚大學人工智慧學系**楊智淵**老師的 CGU AICV Lab 網站上，屬於**長庚衛星班**的課程頁，並非主講者的官網。

頁面自己寫得很清楚：

- 開設學校：政治大學；授課教師：蔡炎龍
- 楊智淵列在「協同教師與答問時間」，另有兩位長庚助教
- 開課級別寫「碩士課程（政大學碩合開），但長庚列為大一課程」
- 教科書一欄寫「沒有教科書，只有蔡炎龍老師的錄影」

所以本系列的歸屬這樣處理：錄影、投影片、Demo notebook 都出自蔡炎龍，課程內容歸給他；每週作業的題目與評分標準，公開文字只在長庚頁面上看得到，引用時一律寫明「長庚衛星班版本」。

### TAICA 衛星課程怎麼分工

[Fall 2026 課綱 PDF](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) 把分工寫得很具體：

| 項目 | 課綱內容 |
|---|---|
| 班級人數 | 2500 人，保留 500 人給政大；聯盟校不限，條件式授權學校可自訂上限 |
| 助教比例 | 聯盟學校每 30 名學生需 1 名助教 |
| 協同老師 | 「不需要同步跟課」，但要找助教，並**獨立完成該校所有學生的評分** |
| 協同老師背景 | 不需要已經很熟 Python 與生成式 AI，因為 1132 的完整錄影與投影片都已公開 |

最後一列就是校外自學者能用這門課的原因：主講者把 1132 整學期的材料當成給協同老師的備課資源公開。

## 以哪一學期為準：Spring 2025（1132）

本系列以政大 **1132 學期（2025 年 2–6 月）**為準。這是目前唯一一個錄影、投影片、作業題目與 notebook 都公開的完整學期。

| 材料 | 狀態 | 出處 |
|---|---|---|
| 14 支直播錄影（每支約 2 小時 45 分到 3 小時 12 分） | 公開 | [1132 YouTube 播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) |
| 14 份投影片 PDF（GenAI01–GenAI14） | 公開 | [yenlung.me/1132GenAI](https://yenlung.me/1132GenAI)（轉址到 Google Drive 資料夾） |
| 週次課表、12 份作業說明與評分標準 | 公開 | [長庚衛星班頁面](https://yangchihyuan.github.io/courses/GenerativeAI2025) |
| Demo notebooks（Colab） | 公開，但跨課共用、持續更新 | [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo) |
| 繳交與批改 | 各校平台（政大用 NTU COOL），校外拿不到 | GenAI01 投影片第 9 頁 |

每支錄影的 YouTube 說明欄都附了分段時間軸，找特定主題時很好用。

### 存取分級：A3，附四個缺口

依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3 分級，1132 是 **A3（足以自學）**：錄影、投影片、每週作業說明與評分標準，加上大部分作業直接改寫的範例 notebook，都拿得到。缺口有四個：

1. **Notebook 不是當時的版本。** [AI-Demo](https://github.com/yenlung/AI-Demo) 的 repo 說明是「人工智慧工作坊、演講等示範檔案」，是蔡炎龍所有課程與工作坊共用的，學期結束後還在改。例如 `【Demo01】設計你的神經網路.ipynb` 最近一次 commit 是 2026-03-17。本系列引用 notebook 時都標「repo 目前版本」。
2. **沒有批改。** 作業繳交走各校平台，校外讀者只能拿評分標準自評。
3. **期末專案只有規則。** 期末以 Gather Town 線上研討會分享，但沒有公開的成果清單。
4. **投影片文字抽不乾淨。** PDF 裡的中文字型抽成純文字會缺字，要引用時請回到投影片頁面對照。

## 講次與作業怎麼對上

長庚頁面的作業是照「週」編號，不是照講次。第 5 週（Transformers）與第 15 週（新趨勢）沒有作業，第 14 週是政大校慶停課，第 13 週的作業是期末專案提案。合計 12 份作業。

| 週 | 日期（2025） | 講次主題 | 作業（長庚衛星班版本） | 本系列 |
|---|---|---|---|---|
| 1 | 2/18 | 課程介紹與生成式 AI 概述 | 在 Colab 畫一個函數圖形 | [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai) |
| 2 | 2/25 | 神經網路的概念 | 自己設計 DNN 手寫辨識，不能是三層 | [L02](/posts/ai/2026-09-30-nccu-genai-02-neural-networks) |
| 3 | 3/4 | 紅極一時的生成對抗網路 GAN | 二選一：實際跑 GAN，或解釋 Cross Entropy 與 KL divergence | [L03](/posts/ai/2026-09-30-nccu-genai-03-gan) |
| 4 | 3/11 | 大型語言模型原來這麼簡單 | 建立自己的 benchmark prompts，比較至少兩種 LLM | [L04](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token) |
| 5 | 3/18 | Transformers 全攻略 | 無作業 | [L05](/posts/ai/2026-09-30-nccu-genai-05-transformers-math) |
| 6 | 3/25 | LLM 的應用及倫理議題的挑戰 | 用 OpenAI API 打造有人設的對話機器人，Gradio 展示 | [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics) |
| 7 | 4/1 | 打造自己的對話機器人 | 二選一：可持續對話的版本，或兩個模型互相對話 | [L07](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot) |
| 8 | 4/8 | RAG 的原理及實作 | 用自己的資料實作 RAG 系統 | [L08](/posts/ai/2026-09-30-nccu-genai-08-rag) |
| 9 | 4/15 | 為什麼大家說 2025 年是 AI Agents 元年 | Planning（CoT 改寫版）或 Reflection 模式二選一 | [L09](/posts/ai/2026-09-30-nccu-genai-09-ai-agents) |
| 10 | 4/22 | 變分自編碼器（VAE）開始的冒險旅程 | 用 Bing 文字生圖，生出風格一致的多組圖 | [L10](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion) |
| 11 | 4/29 | 文字生圖 AI 的原理及實作 | 用 Hugging Face 的 SD1.5 模型做生圖 Web App | [L11](/posts/ai/2026-09-30-nccu-genai-11-text-to-image) |
| 12 | 5/6 | ControlNet 與 Fooocus | 設想應用情境，用 Fooocus 至少生 3 組圖並寫出創作流程 | [L12](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus) |
| 13 | 5/13 | 強化學習與生成式 AI 綜合應用 | 期末專案提案 | [L13](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning) |
| 14 | 5/20 | 政大校慶，無課 | — | — |
| 15 | 5/27 | 生成式 AI 新趨勢 | 無作業 | [L14](/posts/ai/2026-09-30-nccu-genai-14-new-trends) |
| 16 | 6/3 | 研討會型式的期末專題成果分享 | — | 併入 L14 |

有兩個錯位要先知道。第 6 週的作業（OpenAI API 對話機器人）掛在倫理那一講底下，內容其實銜接第 7 講。第 10 週的作業（Bing 生圖）掛在 VAE 那一講，要到第 11 講才會講 diffusion 的原理。

### 同一門課，三種評分方式

TAICA 讓各校獨立評分，所以同一份作業在不同學校的份量不一樣：

| 版本 | 作業 | 期末專案 | 上課參與 | 出處 |
|---|---|---|---|---|
| 政大 1132 | 70% | 25% | 5% | GenAI01 投影片第 115 頁 |
| 長庚衛星班 1132 | 100%（12 次平均） | 0% | 0% | 長庚頁面 |
| 政大 1151（Fall 2026） | 作業及反思 75% | 20% | 5% | Fall 2026 課綱 |

長庚把期末專案調成 0%，理由寫在頁面上：該班九成是大四生，學校要求 5/29 前上傳成績，而期末專案繳交日是 6/2。政大另外有「閃電秀」加分，GenAI01 第 116 頁寫學期成績額外加 2 分。

三個版本共用的規則是抄襲的定義。課程鼓勵用大型語言模型協作，但「直接下一個 prompt 就能產出的結果」拿來當作業不被接受。Fall 2026 課綱把它寫成分數上限：這種水準的作業最高 3 分（滿分 10 分）。

## 需要的工具

| 工具 | 用在哪裡 | 出處 |
|---|---|---|
| [Google Colab](https://colab.research.google.com/) | 全部作業；免費版應該就夠 | 長庚頁面「課程要求」、GenAI01 第 3 節 |
| [OpenAI API](https://platform.openai.com/) | 對話機器人、RAG、Agent；建議（非必要）儲值，課綱說 5 美元就完全足夠 | 長庚頁面、Fall 2026 課綱 |
| [Groq API](https://console.groq.com/) | 有完全免費的方案；Fall 2026 課綱要求每人申請 | Fall 2026 課綱 |
| [AISuite](https://github.com/andrewyng/aisuite) | 用同一套介面呼叫多家 LLM；Agent 的兩個 Demo 用它實作 | `【Demo07a】`、`【Demo07c】` notebook |
| [Gradio](https://www.gradio.app/) | 幾乎每份作業都要求用它做展示介面 | `【Demo01】` 起的 notebook |
| LangChain + FAISS | 只出現在 RAG 的兩個 notebook | `【Demo06a】`、`【Demo06b】` |
| [diffusers](https://huggingface.co/docs/diffusers) | 文字生圖 | `【Demo08】` |
| [Fooocus](https://github.com/lllyasviel/Fooocus) | 第 12 週的生圖工作流程 | GenAI12、第 12 週作業 |

有一個常見誤解要先講。1132 的課程概述把 AutoGen 與 LangChain 列為會用到的工具，但實際打開材料，GenAI09 投影片把 LangChain、AutoGen、CrewAI 放在「進階學習」清單；Agent 的實作用的是 AISuite 加 Gradio。這門課沒有 AutoGen 的實作。

## Fall 2026（1151）有什麼不同

1151 學期正在直播，存取分級是 **A2**：課綱與投影片（[yenlung.me/1151GenAI](https://yenlung.me/1151GenAI)）公開，錄影陸續上架。

2026-09-30 查詢時，[頻道](https://www.youtube.com/@ive-iveai)上的 1151 播放清單有 5 個項目，其中 1 支隱藏，可看的 4 支標題是：1. 如何不焦慮地學 AI、2. 呆萌型 AI 機器人、3. AI 為什麼每次都不一樣、4. LLM 只是在猜下一個字。期末分享排在 2026/12/22。

跟 1132 相比，課綱的變動集中在後半學期：

| 週 | 1132 | 1151 課綱 |
|---|---|---|
| 7 | 打造自己的對話機器人 | 同名，寫明用 AISuite 實作 |
| 8 | RAG | 專家講座 |
| 9 | AI Agents | RAG，寫明「基於 LangChain」 |
| 10 | VAE | Agentic AI 與 AI Agents，用 AISuite 實作 |
| 13 | 強化學習與生成式 AI 綜合應用 | 用 Fooocus 實現 Diffusion Models 的進階技術 |
| 14 | 校慶停課 | 生成式 AI 流行工具及應用範例 |

強化學習那一週拿掉了。工具清單裡的 AutoGen 換成 AISuite，並新增每人申請 Groq API 的要求。本系列等 1151 結束後，再決定要不要補一篇對照。

## 建議的自學路線

1. **先開帳號。** 準備 Google 帳號（Colab）、Groq API 金鑰；想省事的話在 OpenAI 儲值少量額度。
2. **一週一講。** 每講先看錄影前兩節，再打開對應的 Demo notebook 跑一遍，最後照長庚頁面的評分標準做作業。評分標準的高分條件通常是「改成自己的樣子」，照抄範例只拿基本分。
3. **把作業留在 Colab 裡。** 長庚頁面要求交 Colab 連結加重點說明與截圖，自學時照做，等於幫自己留一份學習紀錄。
4. **數學週可以先跳。** L05 Transformers 的數學沒有作業；不想碰矩陣的讀者可以先讀 L06，之後再回來。

今晚可以做的一件事：打開 [GenAI01 投影片](https://yenlung.me/1132GenAI)第 81 頁，把那四行標準套件在一個新的 Colab 筆記本裡跑起來。第一份作業就從這裡開始。

## 系列文章

| order | 文章 |
|---|---|
| 0 | 總覽與自學路線（本篇） |
| 1 | [L01 為什麼要研究生成式 AI：課程介紹與 Colab](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai) |
| 2 | [L02 神經網路的概念](/posts/ai/2026-09-30-nccu-genai-02-neural-networks) |
| 3 | [L03 紅極一時的 GAN](/posts/ai/2026-09-30-nccu-genai-03-gan) |
| 4 | [L04 大型語言模型原來這麼簡單](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token) |
| 5 | [L05 Transformers 全攻略](/posts/ai/2026-09-30-nccu-genai-05-transformers-math) |
| 6 | [L06 LLM 的應用與倫理挑戰](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics) |
| 7 | [L07 打造自己的對話機器人](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot) |
| 8 | [L08 RAG 的原理及實作](/posts/ai/2026-09-30-nccu-genai-08-rag) |
| 9 | [L09 為什麼 2025 是 AI Agents 元年](/posts/ai/2026-09-30-nccu-genai-09-ai-agents) |
| 10 | [L10 從 VAE 開始的冒險旅程](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion) |
| 11 | [L11 文字生圖 AI 的原理及實作](/posts/ai/2026-09-30-nccu-genai-11-text-to-image) |
| 12 | [L12 ControlNet 與 Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus) |
| 13 | [L13 強化學習與生成式 AI 綜合應用](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning) |
| 14 | [L14 生成式 AI 新趨勢與期末專案](/posts/ai/2026-09-30-nccu-genai-14-new-trends) |

## 延伸閱讀

這門課每一講都自成一套，下面這些站內系列只在你想往下挖時才需要：

- 神經網路基礎更完整的版本：[CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)
- LLM 與 Transformer：[Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[Stanford CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)、[Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)、[台大李宏毅 機器學習 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview)
- RAG：[RAG 模式完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide)
- AI Agents：[CMU 11-768 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)；MCP 的正式名稱與設計：[MCP（Model Context Protocol）](/posts/ai/2026-03-22-mcp-model-context-protocol)
- Diffusion 的數學：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)；視覺生成：[Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)
- 強化學習：[Berkeley CS285：模仿學習與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)
- 各校課程的公開程度比較：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025](https://yangchihyuan.github.io/courses/GenerativeAI2025) — 授課教師、協同教師、週次課表、12 份作業說明與評分標準、長庚的評分調整
- [1132 YouTube 播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) — 14 支直播錄影與分段時間軸
- [1132 投影片資料夾（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI) — GenAI01–GenAI14 PDF；政大 1132 評分比例見 GenAI01 第 115–116 頁
- [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo) — 課程 Demo notebooks，跨課共用、持續更新
- [Fall 2026 課綱 PDF](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) — 班級人數、助教比例、協同老師分工、1151 週次、評分與課程要求
- [TAICA 115 學年度上學期課程清單](https://taicatw.net/fall-115/) — 課程屬性、難度 ★★、衛星課程型態、期末分享日期
- [Iveai - I've AI YouTube 頻道](https://www.youtube.com/@ive-iveai) — 1132 與 1151 播放清單
- [1151 投影片資料夾（yenlung.me/1151GenAI）](https://yenlung.me/1151GenAI) — Fall 2026 已上傳的講義
