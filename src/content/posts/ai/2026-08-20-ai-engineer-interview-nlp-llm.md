---
title: "NLP & LLM 面試攻略：從 tokenization 到 RLHF"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, nlp, llm, rlhf]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 NLP 與 LLM 環節的高頻考點——tokenization、預訓練、fine-tuning、RLHF、prompting、LLM evaluation。"
tldr: "LLM 面試的分水嶺是你有沒有實際用過這些東西。高頻考點：BPE tokenization 的邏輯與多語言問題、預訓練目標（CLM vs MLM）、fine-tuning 的三種層次（full/LoRA/prompt tuning）、RLHF 的流程與 failure mode、prompting 的工程實踐、LLM 評估的困難與現有方法。"
series:
  name: "AI Engineer 面試準備"
  order: 4
---

NLP 與 LLM 是 AI Engineer 面試中最快暴露深度差距的環節。面試官不會問你「什麼是 Transformer」——他們預設你知道。他們會問的是：你用 LoRA fine-tune 過模型嗎？遇到什麼問題？你怎麼評估 LLM 的輸出品質？RLHF 的 reward model 可能出什麼問題？

這篇整理六個高頻考點，每個都從「面試會怎麼問」出發，不是教科書式的知識回顧。

## Tokenization：不只是把文字切碎

面試常見問法：「解釋 BPE 的運作方式」「為什麼同一個模型處理中文會比英文用更多 token？」

**BPE（Byte Pair Encoding）** 的核心邏輯是從字元開始，反覆合併出現頻率最高的相鄰 pair，直到詞彙表達到目標大小。WordPiece 做法類似但用 likelihood 而非頻率來決定合併順序。SentencePiece 則是在原始 byte 層級操作，不依賴預先的空格分詞，對中日韓等非空格分隔的語言更友善。

多語言是面試最愛追問的點。英文文本在 GPT-4 的 tokenizer 下大約 1 token 對應 4 個字元；中文可能 1 個字就要 2-3 個 token。這直接影響 context window 的有效長度和推論成本。面試時能說出「這是因為訓練語料以英文為主，中文字元在 BPE merge table 中的合併層級較低」就夠了。

## 預訓練：CLM vs MLM

面試常見問法：「GPT 和 BERT 的預訓練目標有什麼不同？」「什麼是 scaling laws？」

**Causal Language Modeling（CLM）** 是 GPT 系列的做法——預測下一個 token，只看左邊的 context。**Masked Language Modeling（MLM）** 是 BERT 的做法——隨機遮住 15% 的 token，用雙向 context 來預測被遮住的部分。

關鍵差異在於：CLM 天然適合生成任務（因為訓練和推論都是從左到右），MLM 天然適合理解任務（因為能用完整 context）。現在主流的 LLM 都用 CLM，因為生成能力是 LLM 的核心價值。

**Scaling laws**（Kaplan et al., 2020；Chinchilla, 2022）告訴我們：模型的 loss 和參數量、訓練資料量、計算量之間有可預測的冪律關係。Chinchilla 的結論是之前的模型普遍 undertrained——給定固定的計算預算，應該用更多資料訓練更小的模型，而不是訓練一個巨大的模型但資料不夠。面試時提到這個觀點，會讓面試官知道你理解「不是模型越大越好」。

## Fine-tuning：三種層次的取捨

面試常見問法：「你會怎麼決定用 full fine-tuning 還是 LoRA？」「什麼場景下 prompt tuning 就夠了？」

**Full fine-tuning** 更新所有參數。效果最好但成本最高——需要完整模型大小的 optimizer state，7B 模型大約要 60GB+ GPU 記憶體。適合你有大量高品質標註資料、且目標任務和預訓練分佈差異大的場景。

**LoRA（Low-Rank Adaptation）** 凍結原始權重，只訓練插入的低秩矩陣。參數量通常只有原模型的 0.1%-1%，記憶體需求大幅降低。QLoRA 更進一步，把凍結的權重量化到 4-bit，讓 7B 模型可以在單張 24GB GPU 上 fine-tune。LoRA 是目前最常用的做法，面試時要能解釋 rank 的選擇（通常 8-64）和哪些層要加 adapter（通常是 attention 的 Q、V 矩陣）。

**Prompt tuning** 不改模型參數，只學習一段可訓練的 soft prompt 前綴。參數量極小（幾千個），但效果依賴模型夠大（通常 10B 以上才有效）。適合多租戶場景——每個客戶一組 prompt embedding，模型本身共用。

面試的追問通常是：「LoRA fine-tune 後的模型，推論時要怎麼部署？」答案是 LoRA 權重可以 merge 回原始模型（無額外推論成本），或是用 adapter serving 在同一個 base model 上同時服務多組 LoRA adapter。

## RLHF：流程、替代方案與 failure mode

面試常見問法：「RLHF 的三個步驟是什麼？」「reward hacking 是什麼意思？」

RLHF 的標準流程：（1）SFT——用高品質示範資料 supervised fine-tune 一個基礎模型；（2）Reward Model——收集人類偏好對比資料（A 回答比 B 好），訓練一個打分模型；（3）PPO——用 reward model 的分數作為獎勵信號，對 SFT 模型做 reinforcement learning。

**DPO（Direct Preference Optimization）** 是 2023 年提出的替代方案，跳過 reward model 訓練，直接用偏好資料優化 policy。DPO 更簡單、更穩定，但犧牲了一些靈活性——你沒辦法像 RLHF 那樣在訓練中動態調整 reward。

**Reward hacking** 是面試必考的追問：模型學會最大化 reward score 但不是真正在做你要的事。例如 reward model 對長回答給高分，模型就開始生成冗長但不精確的回答。解法包括 KL penalty（限制模型不要偏離 SFT 太遠）和定期更新 reward model。

## Prompting：工程實踐而非技巧展示

面試常見問法：「你在生產環境怎麼管理 prompt？」「chain-of-thought 什麼時候有效、什麼時候沒用？」

**Few-shot prompting** 在 prompt 中放幾個示範 example，讓模型理解任務格式。關鍵是 example 的選擇——和測試輸入語意相近的 example 效果最好（這就是 dynamic few-shot selection 的價值）。

**Chain-of-thought（CoT）** 讓模型先輸出推理過程再給答案。對數學和多步驟邏輯推理任務效果顯著，但對簡單分類任務反而可能降低準確率（增加了不必要的生成步驟）。面試時說出「我會根據任務類型決定要不要用 CoT」比「CoT 很有效」好得多。

**System prompt 設計**在生產環境是一個工程問題：版本控制、A/B testing、和模型升級時的相容性。面試時能提到「我們把 system prompt 當成 code 管理，有 version control 和 regression test」會加分。

## LLM Evaluation：最難的部分

面試常見問法：「perplexity 低就代表模型好嗎？」「你怎麼評估一個 chatbot 的回答品質？」

**Perplexity** 衡量的是模型對下一個 token 的預測能力。它和使用者感知的品質之間可能有巨大的 gap——一個 perplexity 很低的模型可能生成流暢但有害的內容。Perplexity 適合比較同架構不同 checkpoint 的模型，不適合跨架構比較。

**Human evaluation** 是品質評估的金標準但成本高、速度慢。常見做法是 A/B testing——給人類看兩個模型的回答，選比較好的那個。問題是 inter-annotator agreement 通常不高，需要多個 annotator 和清楚的評分標準。

**LLM-as-judge** 用另一個強模型（如 GPT-4）來評分。優點是快速且便宜，缺點是有系統性偏差——LLM 傾向偏好長回答、格式整齊的回答、和自己風格相似的回答。面試時能提到這些偏差以及怎麼緩解（隨機化呈現順序、多個 judge 模型取共識）就很好。

## 面試常見追問

- 「Transformer 的 attention 複雜度是 O(n²)，有什麼方法可以降低？」——提到 Flash Attention（IO-aware 的精確 attention 實作）、sliding window attention（Mistral）、和 linear attention 的各自取捨。
- 「你怎麼處理 hallucination？」——沒有通用解法。有效的做法是 RAG（讓模型基於檢索到的文件回答）、constrained generation（限制輸出格式）、和 citation verification（讓模型輸出引用來源再驗證）。
- 「如果你要部署一個 LLM，你會選 API 服務還是自架？」——取決於 data privacy 要求、QPS、延遲需求和成本。面試時要能算出一個粗略的 TCO 比較。

## 面試模擬題

### 題目

「你的團隊有一個 7B 參數的 base model，需要讓它學會回答客服問題。你有 10,000 筆標註好的 QA 對。你會怎麼做 fine-tuning？」

**來源**：Anthropic engineering interview　**難度**：進階　**環節**：onsite ML deep dive

### 拆解思路

1. **先釐清問題**：問面試官——需要多高的回答品質？有沒有 GPU 預算限制（幾張 A100？）？需不需要保留 base model 的通用能力？部署環境是什麼（on-premise / cloud）？
2. **建立框架**：Fine-tuning 的三個層次——full fine-tuning（所有參數）、parameter-efficient（LoRA/QLoRA）、prompt tuning。按資源和需求選擇。
3. **深入核心**：10,000 筆 QA 對在 fine-tuning 領域是中等規模。Full fine-tuning 7B 需要至少 2 張 A100（80GB），可能過擬合。LoRA 只訓練 0.1-1% 的參數，1 張 A100 就夠，還能保留 base model 的能力。
4. **收尾**：提到評估策略——用 held-out set 算 ROUGE/BERTScore 做自動評估，再用 LLM-as-judge 或人工抽查驗品質。

### 範例回答（面試時可以這樣講）

> **我會用 LoRA fine-tuning，rank 設 16-64，target modules 是 attention 的 Q/K/V 投影矩陣。** 理由有三個。第一，7B model 做 full fine-tuning 需要大約 56GB 的 GPU 記憶體（參數 14GB + optimizer states 42GB），至少要 2 張 A100-80GB。LoRA 只訓練低秩矩陣，記憶體降到約 20GB，1 張 A100 就夠。第二，10,000 筆 QA 對不算多，full fine-tuning 7B 參數很容易過擬合。LoRA 因為可訓練參數少（大約 10M vs. 7B），天然就有 regularization 效果。第三，LoRA adapter 可以單獨部署，base model 不動，以後加其他任務的 adapter 也方便。
>
> **訓練的具體做法。** 資料格式用 instruction-following 的模板（`<|system|> You are a customer service agent... <|user|> {question} <|assistant|> {answer}`）。10,000 筆拆成 8,500 train / 1,000 validation / 500 test。Training 跑 3-5 epochs，learning rate 1e-4 到 2e-4，用 cosine schedule。如果 validation loss 在第 2 epoch 就不降了就 early stop。
>
> **如果面試官問「QLoRA 行不行」**——QLoRA 把 base model 量化到 4-bit 再加 LoRA，記憶體再降一半，可以在消費級 GPU（24GB）上跑。Trade-off 是量化會損失一點精度，但對 7B 模型來說損失通常 < 1%。如果 GPU 預算很吃緊，我會用 QLoRA。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 比較 full fine-tuning vs LoRA 的資源需求 | |
| LoRA 的具體設定（rank、target modules） | |
| 資料量 10K 對 fine-tuning 策略選擇的影響 | |
| 訓練超參數（LR、epochs、schedule） | |
| 過擬合風險與緩解方式 | |
| 加分：提到 QLoRA 或 adapter 部署策略 | |

## 參考資料

- [Sennrich et al. — Neural Machine Translation of Rare Words with Subword Units (2016)](https://aclanthology.org/P16-1162/) — BPE tokenization 的原始論文，面試中 tokenization 問題的核心來源
- [Hu et al. — LoRA: Low-Rank Adaptation of Large Language Models (2021)](https://arxiv.org/abs/2106.09685) — LoRA fine-tuning 的原始論文，解釋低秩分解如何大幅降低 LLM fine-tuning 成本
- [Rafailov et al. — Direct Preference Optimization (2023)](https://arxiv.org/abs/2305.18290) — DPO 作為 RLHF 替代方案的論文，面試中 RLHF vs DPO 比較的核心參考
- [Zheng et al. — Judging LLM-as-a-Judge (2023)](https://arxiv.org/abs/2306.05685) — LLM-as-judge 評估方法的系統性分析，包括偏差來源與緩解策略
