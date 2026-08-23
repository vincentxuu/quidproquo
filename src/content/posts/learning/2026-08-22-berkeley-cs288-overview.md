---
title: "Berkeley CS288 Spring 2026 導讀：18 組教材、三份作業與自學邊界"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, nlp, llm, self-study, open-course]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "CS288 用 18 組公開投影片與三份作業，從 n-gram 走到 RAG、reasoning 與 agents；錄影需 Berkeley 登入，所以這是一條教材型 A3 路線。"
description: "整理 Berkeley CS288 Spring 2026 的先修、18 組教材、三份作業、研究專案、算力需求與校外自學限制。"
draft: false
series:
  name: "Berkeley CS288 Spring 2026"
  order: 0
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs288-overview-en)

[Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/) 是研究所等級的 Advanced Natural Language Processing。它不是只教怎麼呼叫現成 LLM：課程先從 n-gram、詞向量、分類與序列模型建立地基，再進入 Transformer、pre-training、post-training、RAG、inference-time compute、reasoning 與 agents。

這個系列採「教材導讀」，不是逐字課堂重建。官方課站明載[錄影需要 Berkeley 登入](https://cal-cs288.github.io/sp26/course_info/)，匿名讀者拿得到的是 18 組 slides、三份作業、兩個 starter repositories 與 project 規格。文章只解釋這些材料明確支持的內容，不替未公開的口頭授課補台詞。

## 先修不是建議清單而已

官方要求已有 machine learning 經驗，能熟練使用 PyTorch、NumPy 與 neural networks，而且不提供入門教學；對大學部與碩士生，[CS182、CS188、CS189 或 EECS183/283A](https://cal-cs288.github.io/sp26/course_info/) 也被列為強烈建議背景。校外讀者若還沒自己寫過訓練迴圈、cross-entropy 與基本 attention，先補 ML 與 PyTorch，會比硬跟課表有效。

今晚可做的門檻測試：不用框架的高階 Trainer，寫一個 PyTorch 分類器，完成 forward、loss、backward、optimizer step，並說清楚 train／validation split。做不到就先補基礎。

## 六篇怎麼覆蓋 18 組教材

| order | 範圍 | 對應公開 slides |
|---:|---|---|
| 1 | 從計數到分類 | 01–04：Introduction、n-gram LM、word representation、text classification |
| 2 | 序列到 Transformer | 05–07：sequence models、seq2seq、Transformers |
| 3 | 訓練後模型如何可用 | 08–12：pre-training、advanced pre-training、post-training、generation、evaluation |
| 4 | 外部知識與架構 | 13–14：retrieval/RAG、advanced architectures；另交代 social-impact 缺口 |
| 5 | 推理與 agents | 15–18：embodied perception、inference-time compute、agent reasoning、embodied agents |

課表還列了 impact、speech、continual learning 與 guest lectures。因為課站沒有為每一場提供匿名教材，本系列只在總覽保留它們的位置，不推測講者內容。

## 三份作業是一條能力鏈

[Assignment 1](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment1.pdf) 要學生實作 n-gram LM、neural n-gram LM、perceptron 與 NBOW MLP。重點是同時看見人工特徵與神經表示如何改變分類器，而不是直接跳進大型模型。

[Assignment 2](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf) 再把抽象名詞拆回元件：從 BPE、RoPE、causal attention、Transformer block，到 optimizer、warmup、cosine decay 與 gradient clipping。bonus 才把 pre-training、fine-tuning 與 prompting 串成 mini-study。

[Assignment 3](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment3.pdf) 不提供 starter code。學生要自己蒐集 Berkeley EECS 網頁、建立 QA 驗證集、設計 retrieval corpus、比較 sparse／dense retrieval，最後以 ablation 區分檢索與生成瓶頸。這才是課程從「模型元件」轉向「研究系統」的轉折。

## A3 不等於完整修課體驗

教材與必要起始碼足以讓校外讀者動手，因此判為 A3。[Course Info](https://cal-cs288.github.io/sp26/course_info/) 說明錄影只提供修課生與 Berkeley 校內旁聽者，Ed、Gradescope 與教師回饋也屬於課內修課環境。

[Assignment 2 與 Assignment 3](https://cal-cs288.github.io/sp26/assignments/) 的正式驗收還依賴 hidden tests、Gradescope，以及課程提供的 OpenRouter wrapper。校外讀者拿不到這些部分。[Final project](https://cal-cs288.github.io/sp26/project/) 另有課內團隊媒合與階段回饋；課站只說 VESSL AI 與 Google Cloud 提供 project compute credits，沒有承諾對外開放。

A2 的 Transformer 與 A3 的 RAG 都可能產生費用。先用小資料、小模型與 CPU baseline 驗證管線，再決定是否租 GPU。

## 參考資料

- [CS288 Spring 2026](https://cal-cs288.github.io/sp26/)
- [Course info and prerequisites](https://cal-cs288.github.io/sp26/course_info/)
- [Assignments index](https://cal-cs288.github.io/sp26/assignments/)
- [Course project](https://cal-cs288.github.io/sp26/project/)
- [Berkeley AI／ML 課程地圖](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)
