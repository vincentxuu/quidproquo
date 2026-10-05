---
title: "AI Engineer 面試日練 — 2026-10-06：Deep Learning & NLP"
date: 2026-10-06
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二輪到 Deep Learning & NLP——Self-Attention 的 Q/K/V 跟 scaled dot-product、多語言 LLM 的 tokenizer fertility 怎麼決定成本與品質、BERT 的 masking 為什麼要拆成 attention mask 跟 loss label 兩個獨立決策、CNN 跟 RNN 怎麼選，加一題 Sarvam AI 風格的真實場景題:為什麼 tokenizer fertility 是多語言 LLM 的第一個效能瓶頸。"
tldr: "今天的 Deep Learning & NLP 輪練涵蓋五個核心概念:Self-Attention 的 scaled dot-product 為什麼要除以 sqrt(d_k)、tokenizer fertility（tokens/word）怎麼決定一個語言的成本與有效 context 長度、BERT 的 attention mask 跟 MLM loss label 是兩個獨立機制(常被面試者混為一談)、CNN 跟 RNN 在序列資料上的取捨、以及 fine-tuning 從 full fine-tune 到 LoRA 到 continued pretraining 的光譜。練習題來自 Sarvam AI 的代表性面試題(由 AI-Engineer-Interview-Questions 專案整理、非洩題):解釋為什麼 tokenization 是多語言 LLM 的第一個效能瓶頸，並說明像 Sarvam-1 這種低 fertility tokenizer 如何改變成本結構，拆解思路把「fertility 這個指標怎麼定義」到「下游三條成本線怎麼被它決定」串成一套完整的推理鏈。"
series:
  name: "AI Engineer 面試日練"
  order: 48
---

> 🌏 [English version](/en/posts/daily/2026-10-06-ai-interview-daily-en)

## 今日主題

星期二輪到 Deep Learning & NLP，今天選的概念圍繞「文字怎麼變成模型看得懂的東西,又為什麼這件事的效率差距能決定一個產品的成本結構」。Self-Attention 的數學形式、tokenizer 怎麼切字、BERT 的 masking 機制、CNN 跟 RNN 的取捨,這些都是面試官拿來檢查「你是真的懂原理,還是背過名詞」的標準切入點。今天這題又特別貼近真實場景:多語言 LLM 的 tokenizer 設計,不是學術練習題,是會直接反映在 API 帳單跟 context window 夠不夠用上的工程決策。

## 核心概念速記

### Self-Attention 的 Q/K/V 跟為什麼要 Scaled Dot-Product

Self-Attention 把每個 token 投影成 Query、Key、Value 三個向量,用 Query 跟所有 Key 做內積算出相似度分數,再用這個分數加權平均所有 Value,等於讓每個 token 動態決定該聽哪些其他 token 的話。內積分數除以 sqrt(d_k) 是因為維度越高,隨機向量內積的方差會跟著維度線性成長,分數分佈一變尖,softmax 就會把機率集中到少數位置、梯度趨近於零,除以 sqrt(d_k) 是把方差拉回常數量級,讓 softmax 在訓練初期還保有合理的梯度訊號。

### Tokenizer Fertility:多語言 LLM 的第一個效能瓶頸

Fertility 是「平均每個字要切成幾個 token」,英文中心的 BPE tokenizer 幾乎沒見過天城文或泰米爾文,碰到這些語言時會退化成接近 byte-level 的切法,一個詞可能爆成四到八個 token。這件事會同時打到三條線:成本跟速度隨 token 數線性成長、有效 context window 被壓縮到可能只剩四分之一、以及模型要花容量重新學習「這些破碎片段其實是同一個詞」,擠掉本來該學語義的空間。

### BERT 的 Masking 機制:Attention Mask 跟 Loss Label 是兩個獨立決策

很多人把「BERT 用 mask」講成一件事,但其實是三個獨立決策疊在一起:哪些 token 的輸入被替換成 `[MASK]`(corruption)、哪些位置在算 attention 時可以被看到(attention mask,`[MASK]` 本身的 attention 值是 1,是個有意義的真實位置)、哪些位置的輸出要算進 loss(label,padding 跟沒被選中的 token 都是 -100 忽略)。原始論文的設計是選中的 15% token 裡,80% 換成 `[MASK]`、10% 換成隨機詞、10% 保持不變,但三種都一樣要算進 loss——這個細節常被面試者漏掉。

### CNN vs RNN:怎麼選跟各自的失效模式

CNN 假設局部性跟平移不變性,靠卷積核抓固定範圍內的模式,平行度高、訓練快,適合影像或是局部依賴強的序列任務;RNN 假設序列是逐步展開的馬可夫鏈,理論上能記住任意長度的依賴,但要逐步算、不能平行,而且長序列會碰上梯度消失,早期的資訊在反向傳播時被連鎖律乘積壓到趨近於零。現在大多數序列任務(尤其是長距離依賴)已經被 Transformer 取代,但面試官常用這題檢查你是否理解「為什麼」而不是只會說「Transformer 比較新」。

### Fine-tuning 的光譜:Full Fine-tune、LoRA、Continued Pretraining

三者解決不同問題:continued pretraining 是用大量目標語言或領域的單語語料繼續預訓練,教模型「這個語言/領域長什麼樣子」;full fine-tune 是全參數更新去學一個具體任務,成本最高、最容易 catastrophic forgetting;LoRA 只在部分權重上加低秩矩陣去適配,參數量小、可按部署場景抽換,也因此對其他語言的遺忘風險更低。低資源語言的典型組合是:先用翻譯/音譯放大資料、用相關語系的 base model 做 continued pretraining 教語言,再用 LoRA 做任務層的輕量適配。

## 今日練習題

### 題目

為什麼 tokenization 是多語言 LLM 的第一個效能瓶頸?像 Sarvam-1 這種低 fertility tokenizer,如何改變背後的成本結構?

**來源**:Sarvam AI(由 [AI-Engineer-Interview-Questions](https://github.com/ombharatiya/AI-Engineer-Interview-Questions) 專案根據公開技術方向整理的代表性問題,非洩題)　**難度**:中等　**環節**:technical deep-dive / system design

### 拆解思路

1. **先釐清問題**:面試時該先問——要討論的是訓練時怎麼設計 tokenizer,還是部署後的成本/延遲分析?目標語言集合是什麼(拉丁字母語系還是像天城文、泰米爾文這種非空格分詞的 script)?有沒有一個現成的多語言 tokenizer 當 baseline?
2. **建立框架**:先定義指標——fertility = token 數 / 字數,用平行語料(同一句話的不同語言版本)去量,避免不同語料「講的東西不一樣」混進比較。定義完指標後,把下游影響拆成三條獨立的線:成本/速度、有效 context 長度、模型品質。
3. **深入核心**:技術上最關鍵的 trade-off 是 vocab 預算——固定 vocab size 下,每多覆蓋好一個語言,就要多分配 embedding rows 跟 softmax 的計算量給它,所以不能無限擴充涵蓋所有語言,要在均衡語料上重新訓練 tokenizer,讓常見的語素都拿到專屬 token,而不是把所有新語言硬塞進一個英文中心的字典。
4. **收尾**:用具體數字收斂——fertility 差 4 倍,代表同一句話要多付 4 倍的 token、4 倍的 KV cache、大致 4 倍的 API 成本,同時 context window 能裝的內容少了四分之三,RAG 的 chunk 跟 few-shot 預算都要跟著打折;給出可執行的修法——measure fertility 排序找出瓶頸語言,再決定是重訓 tokenizer 還是擴充 vocab 並用 subword 平均初始化新 embedding、讓繼續預訓練把它們穩定下來。

### 範例回答(面試時可以這樣講)

> Tokenization 之所以是第一個瓶頸,是因為它決定了後面所有東西的「單位成本」。**先講指標**:fertility 就是平均每個字被切成幾個 token,一個英文中心的 BPE tokenizer 幾乎沒見過天城文,碰到印度語言常常退化成接近 byte-level,一個詞可能切成四到八個 token,而設計良好的多語言 tokenizer 可以把這個數字壓到一點多到兩點多。
>
> **再講為什麼這件事會往下傳染**:成本跟延遲是直接跟 token 數成正比的,fertility 差四倍等於同一句話要付四倍的 KV cache 跟推論時間;context window 是固定 token 數的,fertility 差四倍等於你的有效可用長度只剩四分之一,RAG 的 chunk、對話歷史全部被壓縮;更隱性的是模型容量,詞被切得太碎,模型要花能力重新拼回「這些片段是同一個詞」,這個容量本來該用在學語義跟型態學上。
>
> **最後講怎麼解**:這不是靠事後補丁,是要在均衡且涵蓋各語言的語料上重新訓練 tokenizer,讓常見語素各自拿到 token,但代價是 vocab size 有上限,每多覆蓋一個語言就要多分配 embedding 跟 softmax 的預算,這是一個需要在設計階段就做好的平衡,不是訓練完才調的 hyperparameter。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 有把 fertility 定義清楚(tokens/word,且用平行語料量測) | |
| 有講出英文中心 tokenizer 對非拉丁字母語言退化成 byte-level 的成因 | |
| 有拆成三條獨立的下游影響:成本/速度、有效 context、模型品質 | |
| 有指出 vocab size 固定下「多覆蓋一個語言要多付 embedding/softmax 預算」這個 trade-off | |
| 有給出可執行的修法(重訓 tokenizer vs 擴充 vocab + subword 平均初始化 + 繼續預訓練) | |
| 加分項:能講出直接把新 token 硬塞進既有 vocab 的風險(冷啟動 embedding 不穩定,需要繼續訓練才能收斂) | |

## 延伸閱讀

- [BERT Interview Questions: Pretraining Objectives, Attention Masks, and Task Heads | PracHub](https://prachub.com/resources/bert-interview-questions-pretraining-objectives-attention-masks-and-task-heads) — 把 `[MASK]` corruption、attention mask、loss label 三個決策拆開講的完整練習,附批次維度表跟 MLM loss 的數值驗證。
- [BERT 官方模型文件 | Hugging Face](https://huggingface.co/docs/transformers/model_doc/bert) — attention mask 跟 MLM label(`-100` 忽略值)的官方 API 慣例,適合對照自己手寫的程式碼。
- [Samsung Electronics Machine Learning Engineer Interview Questions & Guide 2026 | PracHub](https://prachub.com/interview-guide/samsung-electronics-machine-learning-engineer-interview-questions-guide-2026) — 收錄「CNN vs RNN 怎麼選」「Self-Attention 數學形式」等真實回報過的 ML Engineer 面試題,附拆解思路框架。

## 參考資料

- [AI-Engineer-Interview-Questions / Sarvam AI | GitHub](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/sarvam-ai.md) — 練習題「tokenizer fertility 如何改變多語言 LLM 成本結構」的原始出處,含 fertility 數值、Sarvam-1 的實際設計案例。
- [BERT Interview Questions: Pretraining Objectives, Attention Masks, and Task Heads | PracHub](https://prachub.com/resources/bert-interview-questions-pretraining-objectives-attention-masks-and-task-heads) — 核心概念「BERT 的 Masking 機制」段落的來源,含 corruption/attention mask/loss label 的三層拆解。
- [Samsung Electronics Machine Learning Engineer Interview Questions & Guide 2026 | PracHub](https://prachub.com/interview-guide/samsung-electronics-machine-learning-engineer-interview-questions-guide-2026) — 核心概念「Self-Attention」與「CNN vs RNN」段落的佐證來源,確認這兩題是真實回報過的面試問題。
