---
title: "認識 AI 模型：從 token 到自架，18 篇讀懂模型的通用知識"
date: 2026-08-26
category: ai
type: guide
tags: [llm, transformer, ai-model, learning-path, tokenization, embedding, scaling-laws, fine-tuning, rlhf]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 0
tldr: "不需要變成研究員也能系統理解 AI 模型。這個系列從你看得見的東西（token、context window）開始，一路走到自架開源模型，18 篇覆蓋選模型、讀 benchmark、算成本需要的所有基礎。"
description: "「認識 AI 模型」系列導讀：18 篇從 token、embedding、loss function、Transformer、訓練流程、scaling laws、評估到量化與自架的完整學習路徑，為非研究背景的讀者設計。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-series-intro-en)

你不需要理解模型，也能用 API 生成文字。就像你不需要懂引擎，也能開車。

但當你要選車（選模型）、估油錢（算 token 成本）、看評測報告（讀 benchmark）、決定要不要自己改裝（fine-tuning vs RAG），不懂引擎會讓你只能聽銷售員的話。

這個系列的目標：**讓你具備足夠的模型知識，做出更好的工程決策**。不是把你變成研究員，而是讓你在讀到「128K context window」「MoE 架構」「RLHF 對齊」「INT4 量化」時，知道這些詞背後的機制，以及它們對你的選擇意味著什麼。

## 這個系列不是什麼

- 不是論文導讀。沒有推導，沒有證明。
- 不是課程筆記。排序是讀者的學習弧線，不是教授的章節順序。
- 不是 API 教學。怎麼呼叫模型不在這裡，那是應用層的事。

## 學習路徑

整個系列按一條弧線排列：從你摸得到的概念開始，逐步深入到你做決策時需要的知識。

```
基礎概念 → 表示 → 學習機制 → 架構 → 訓練流程 → 規模 → 評估 → 進階 → 實用
  1-2       3       4-5        6        7          8      9-10    11-12   13-17
```

你不必從頭讀到尾。每篇獨立可讀，但如果你對某個主題感到吃力，往前翻一兩篇通常能找到需要的前置知識。

## 18 篇總覽

### 基礎概念

**1. 模型基本概念：token、context window、推論 vs 訓練**
模型的輸入輸出到底是什麼？為什麼同一個模型「訓練」和「推論」是完全不同的事？這些是後面所有文章的共同語彙。

**2. Tokenization：BPE 演算法與為什麼中文比英文貴**
模型看到的不是字，是 token。BPE 演算法決定了切分方式，也直接影響了不同語言的使用成本。

### 表示

**3. Embedding：文字→向量，以及相似度的意義**
模型怎麼把文字變成可以計算的東西？Embedding 是理解搜尋、分類、RAG 的基礎。

### 學習機制

**4. 模型怎麼知道自己錯了：loss function**
Loss function 是模型學習的唯一指南針。搞懂它，你就知道為什麼某些任務模型學得好、某些學不好。

**5. 模型怎麼改進自己：梯度下降與訓練迴圈**
知道錯在哪之後，模型怎麼一步步修正自己的參數？梯度下降是所有深度學習的核心迴圈。

> 第 4、5 篇涉及一些數學。每篇都用「直覺先行」的結構：先用類比和圖示建立直覺，公式放在可摺疊區塊裡。想深入機率基礎的讀者，推薦 Stanford CS109。

### 架構

**6. Transformer 與 Attention：選擇性注意力的直覺**
為什麼 Transformer 取代了 RNN 成為主流？Attention 機制讓模型可以「同時看到所有位置，但只關注重要的」。

### 訓練流程

**7. 訓練三階段：預訓練→SFT→RLHF**
一個模型從「會接話」到「有用且安全」要經過三個階段。這是理解 ChatGPT 類產品的關鍵。

### 規模

**8. Scaling Laws：模型要多大才夠？**
越大越好嗎？Scaling laws 告訴我們資料量、參數量、運算量之間的關係，以及為什麼 GPT-4 級別的模型要花那麼多錢訓練。

> 第 8 篇同樣使用直覺先行結構，對數和冪次律的公式在摺疊區塊中。

### 評估

**9. MoE 架構：用路由取代暴力計算**
不是所有參數都要同時啟動。MoE 讓模型在推論時只用一小部分參數，是理解 Mixtral、GPT-4 架構的基礎。

**10. 模型成績單怎麼看：metrics 與 evaluation**
MMLU、HumanEval、MT-Bench——benchmark 名字一堆，怎麼判斷哪些值得看、分數差多少才有意義？

**11. Coding Benchmark 怎麼讀**
針對程式碼能力的 benchmark 有自己的眉角：pass@k、contamination、多語言支援，工程師選模型必讀。

### 進階

**12. Self-improvement RL 三種路線**
模型能不能自己變強？Expert Iteration、SPIN、SELF-PLAY 三種路線，各自的假設和限制。

**13. Fine-tuning vs RAG：什麼時候該練模型、什麼時候該接資料庫**
兩種讓模型「知道更多」的方式，成本結構和適用場景完全不同。選錯方向會浪費大量時間和預算。

### 實用

**14. 量化與推論優化：讓模型跑在你的筆電上**
INT8、INT4、GGUF、KV cache——把 70B 模型塞進消費級 GPU 的技術，以及品質和速度的取捨。

**15. 開源 AI 授權指南**
Apache 2.0、Llama 3 Community License、RAIL——開源模型的授權條款差異很大，商用前必須搞清楚。

**16. API 路由比價：怎麼用最少的錢呼叫最好的模型**
OpenRouter、Amazon Bedrock、Azure——多個供應商的定價比較和路由策略。

**17. 開源模型自架指南**
vLLM、Ollama、TGI——當你決定不用 API 而自己跑模型，需要的硬體規劃和部署工具。

## 與「AI 模型家族」系列的關係

這個系列講的是**通用知識**——不管你用哪家的模型，token、Transformer、training pipeline、benchmark 的概念都一樣。

姊妹系列「AI 模型家族」則講**個別家族的特色**——Claude 的 constitutional AI、GPT 的 o 系列推理模型、Gemini 的多模態架構各自有什麼不同。

建議先讀這個系列建立基礎，再按需要翻閱感興趣的模型家族。

## 怎麼讀

- **趕時間**：先讀第 1 篇（基礎語彙）→ 跳到你需要的主題
- **想建立完整圖景**：按順序從 1 讀到 13，實用篇按需選讀
- **已經有基礎**：直接跳到第 9 篇之後的評估和進階主題

每篇文末都有延伸閱讀和對應的大學課程章節，想深入的讀者可以從那裡接軌。

## 參考資料

- Jurafsky, D. & Martin, J. H. (2024). *Speech and Language Processing* (3rd ed. draft). [https://web.stanford.edu/~jurafsky/slp3/](https://web.stanford.edu/~jurafsky/slp3/)
- Stanford CS336: Language Modeling from Scratch (2025). [https://stanford-cs336.github.io/spring2025/](https://stanford-cs336.github.io/spring2025/)
- Stanford CS224N: Natural Language Processing with Deep Learning. [https://web.stanford.edu/class/cs224n/](https://web.stanford.edu/class/cs224n/)
- Stanford CS109: Probability for Computer Scientists. [https://web.stanford.edu/class/cs109/](https://web.stanford.edu/class/cs109/)
- CMU 11-785: Introduction to Deep Learning. [https://deeplearning.cs.cmu.edu/](https://deeplearning.cs.cmu.edu/)
