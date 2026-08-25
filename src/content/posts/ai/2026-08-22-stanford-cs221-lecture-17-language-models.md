---
title: "CS221 Lecture 17：Language Models：從 next-token prediction 到生成"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 18
tldr: "第 17 講把 language model 定義為 sequence probability 的 chain-rule factorization，對照 n-gram 與 neural conditional models，並說明 sampling、temperature 與 evaluation 如何改變生成結果。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 17：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-17-language-models-en)

本篇只依 **Stanford CS221 Autumn 2025 Lecture 17** 的官方投影片 `language_models.pdf` 重寫。PDF 封面標示日期為 2025-11-17、講者為 Ken Liu；它開頭先提醒本講不會出現在當週考試，接著依序介紹語言模型的定義、建模理由、架構與系統，最後放回當時的產業與研究脈絡。

> 材料缺口：以下以這份 PDF 的靜態投影片為準。投影片沒有完整 Transformer 推導、可重現訓練程式、系統 benchmark 表、課堂互動紀錄或 Canvas 內容；這些地方不以一般教科書內容補寫。

## 本講的地圖

PDF 的 agenda 有四站：

1. What exactly are language models?
2. Why is it a good idea to model language?
3. What makes language models work?
4. Where we are today

順序很重要：投影片先把語言模型還原成一個對序列給機率的模型，再解釋為什麼同一個 next-token objective 能承擔許多任務，然後才談規模化訓練、後訓練與部署成本。

### 1. 語言模型到底是什麼

本講的工作定義很簡單：language 是一串有結構的 characters，而 characters 可以是文字或 token。結構來自兩件事：可能出現的 vocabulary，以及字元如何接續的 grammar。因此學 language model 不只是記住字典，而是學語言的結構與產生語言的能力。

投影片用 **The stock market crashed and investors ...** 當例子。下一個位置不能輸出不在詞彙中的 `桌`；`golfing` 也同時被標成語意與文法不合理。`panicked` 是 plausible，`celebrated` 也可能 plausible。前者更符合股市崩盤的世界知識，但重點不是唯一正解，而是模型應對候選延續分配不同機率。

Tensor view 把這件事變成 vocabulary 上的多類別分類。假設 vocabulary 只有十個詞，先將詞映射為 ID；長度 T 的輸入是 `(T,)`。每個 ID 變成 D 維 embedding，得到 `(T, D)`；模型再輸出 `(V,)` 的 vocabulary 機率。對每個位置做一次，輸出就是 `(T, V)`；一次處理 B 個序列則是 `(B, T, V)`。

這些 shape 不是裝飾：輸入是 token ID 序列，輸出是每個位置對 vocabulary 的分類分布。投影片接著把預測出的 `panicked` 接回輸入，再預測下一個 token。這就是 autoregression：生成不是一次吐出完整句子，而是逐 token 把新結果加入 context。

### 2. 為什麼要建模語言

#### 2.1 機率分解與 next-token objective

機率觀點更直接：language model 是對序列的分布。投影片列出示意值：以 `panicked` 結尾的序列是 0.02，`celebrated` 是 0.015，`golfing` 是 0.0001。這些是投影片示範，不是真實語料估計。

利用 chain rule，joint probability 可以拆成逐步條件機率：

```text
P(x₁, ..., xₙ) = ∏ᵢ P(xᵢ | x₁:i−1)
```

所以模型不必直接為每個完整句子建表，只需在看過去 context 後一次預測一個 token。Next-token prediction（NTP）是 vocabulary 上的 sequential multi-class classification：輸入 `(B, T)`，輸出 `(B, T, V)`，學的是 `P(xₜ | x₁, ..., xₜ₋₁)`。PDF 稱它是最常見的 pre-training objective。

投影片也對照 masked language modeling（MLM）。它同樣做 vocabulary classification，但非 sequential；在 `import ____ as np` 中，可以利用遮罩位置兩側的內容，令 `numpy` 成為 plausible completion。PDF 的例子是 `P(xₜ | x₁, ..., xₜ₋₁, xₜ₊₁, ..., x_T)`，並指出 MLM 今日使用較少。它不能直接當作與 NTP 相同的生成流程，因為條件資訊不同。

#### 2.2 從序列補全到多任務

第一個理由是，很多人類活動可以看成 sequence completion。PDF 把寫 email、寫 code、回覆 advisor 放進同一框架：合適的 next-word distribution 可能帶來實際好處。投影片沒有提供任務精度或使用者研究，所以這是建模觀點，不是完整效能證明。

第二個理由是 multi-task learning。相同的 next-token objective 可以讓模型從文字中學到很多事：投影片展示 memorizing facts、math 與 reasoning。它用選擇題說明極簡版本：若正確答案是 `c)`，能給 `c)` 高機率的 LM 就可能完成這個序列補全；投影片並回顧這和 HW7 的一階邏輯問題有相似之處。這不代表 LM 等於 logic solver，而是任務可以被編碼成 continuation。

第三個理由是 scale。PDF 引用 Kaplan Scaling Laws（OpenAI, 2020）與 Chinchilla Scaling Laws（Google DeepMind, 2022），展示更多資料和更大模型時 loss 仍可能下降；同一模型於是可處理 chat、coding、translation、summarization。投影片沒有完整定義 scaling-law 公式、適用區間或不確定性，這些是本講缺口。

### 3. 什麼讓語言模型有效

PDF 先回顧 scaling 與 next-token prediction 作為 multi-task learning，再列出 model architecture、pre-training vs post-training、tokenization、systems，最後列 test-time scaling、distillation、tool use、mixed precision、speculative decoding、model routing、evaluation 與 multimodality。以下依投影片實際展示的內容整理。

#### 3.1 架構：MLP 的三個瓶頸

投影片刻意不講 Transformer 細節，而用 HW2 的 vanilla neural network／MLP 問為什麼不直接用它，並提醒學生另學 Transformer、自己檢查它如何修正問題。這裡是瓶頸對照，不是完整 Transformer 教學。

第一個問題是參數量依賴 T 與 V。若把長度 T 的 embedding 直接接到長度 T、詞彙 V 的輸出，即使一層也約有 `O(DVT²)` 參數。LM 希望 T 大以看較長過去，V 也要大以涵蓋語言與任務；投影片指出 Transformer 在 T 上共享參數，對 V 的主要依賴留在 embedding 與 output。

第二個問題是 network fixed、沒有 dynamic weights。MLP 像巨大 lookup table：對某個 prefix 固定下一詞；權重 frozen 時，也不會因位置不同而改變偏好。投影片用 attention 作直覺對照：Transformer 的 attention mechanism 能對不同位置形成 dynamic weights。

第三個問題是沒有 computation reuse。某個長度 T 的輸入最多只能 cache 該輸出的結果；即使倒數第二個位置改變，也得重做整個 forward pass。投影片指出 Transformer 可用 KV-cache 保存過去 token 的中間值。PDF 沒有給 KV-cache 的資料結構、延遲數字或記憶體公式，本文不把它擴寫成部署指南。

#### 3.2 訓練：pre-training 與 post-training

Pre-training 是用巨量文字、巨量模型與簡單 objective（例如 next-token prediction）訓練基礎模型。投影片以 AI2 的 OLMo 和 sample pre-training text 為例，並說 capabilities emerge from pre-training。GPT-3 的投影片接著說明 in-context learning：把任務範例放進 input string，completion 可能變好。

但 pre-trained LM 仍像「加強版 autocomplete」：它可能因看過資料而知道很多事，卻只是延續 input text 的 pattern，還沒有被訓練成把輸入當問題回答。Post-training 的目的，是讓它真正有用；PDF 以 ChatGPT 作直觀例子。

Instruction-following 對應 InstructGPT／RLHF（OpenAI, 2022）。用 RL 語言說，LM 是 policy；generation 是從 policy sampling，reward 是由 human preference labels 形成的 model，training 大致是 policy gradient。Safety-tuning 則讓模型不回答有害問題，形成攻擊者 jailbreak 與防守者之間的 cat-and-mouse game。投影片用「改成過去式」和「祖母睡前故事」展示提示變形。

PDF 列出仍在演進的技術：SFT 是在 instruction-following／refusal examples 上做 next-token prediction；RLHF 用人類標籤的 reward 做 RL；RLVR 改由 automated verifier 標註；data curation 則一開始就移除 harmful data。投影片沒有比較實驗，不能替這些方法補上效能排序。

#### 3.3 Tokenization：不要只枚舉完整單字

如果 vocabulary 只列完整 words，遇到 `rArE` 或拼錯的 `mispeled` 就很脆弱。PDF 的 key idea 是 subword units，並介紹 Byte-Pair Encoding（BPE）：起初可令一個 token 對應一個 character，再加 common words 與 special tokens；反覆依頻率 merge token pairs，直到達到目標 vocabulary size。

這使前面的 tensor 定義更實際：T 是 token sequence length，不必等同完整單字數；vocabulary 也不需收錄所有新詞。PDF 只給高層流程與影片連結，沒有 merge table、token 數量或 tokenizer 比較，本文保留這個靜態材料缺口。

#### 3.4 Systems：記憶體、平行化、效率與 cache

LM 大到不能只在 laptop 上跑。PDF 用 Llama-3.3 70B 算例：權重若每參數 2 bytes，約需 140 GB；vanilla Adam training 加 gradients 與 optimizer states，投影片估算約 8 倍、1.12 TB。單張 H100 是 80 GB，因此第一個問題是如何放下模型；這些是講義估算，不是完整硬體規格。

第一個方向是 quantization：以較低 precision 儲存。投影片提到 inference 可低至 2-bit、training 可低至 4-bit，仍屬 active research；2-bit 只有四種可能值。基本程序是分配 `2^k` 個 bins，把 weights 指派至最近的 bin 並盡量降低 loss；代價包括 training stability 和低 bitwidth 的效能退化。

第二個方向是 parallelism and sharding。模型能放進一張 GPU 時，可複製模型、切小 batch，在多 GPU 上各自計算再合併 gradients，這是 data parallel。模型加一個 example 都放不下時，改切模型：pipeline parallel 切 layers，tensor parallel 切 individual matrices。

第三個方向是 hardware-aware code。投影片說多數計算受 memory bandwidth 而非 raw compute 限制；kernel fusion 把 memory／compute 間多個小操作合成大操作，FlashAttention series 是例子。第四是 caching and batching：common inputs 可 cache activations，KV-cache 保存過去 token 的工作；現代 serving systems 會 cache common prompts，但 cache 也可能成為 security side-channel。把 inputs batch 起來則提高 arithmetic intensity、降低 inference 成本。

PDF 還列出未展開的方向：test-time scaling（reasoning、parallel sampling）、distillation、tool use、mixed-precision、speculative decoding、model routing、更好的 optimizer／architecture／RL algorithms、thoughtful evaluation and benchmarking，以及 image、video、audio 的 multi-modality。列名不等於本講已教完；PDF 沒有給它們的公式或結果。

### 4. 生成與推論：從分布到下一個 token

前面的 tensor 與 chain rule 合起來，就是 inference loop。給定 prefix，模型輸出 vocabulary 的條件分布；選取或 sample 一個 token，接回序列，再用更新後 prefix 取得下一個分布。`The stock market crashed and investors` 先讓 `panicked` 與 `celebrated` 競爭；加入 `panicked` 後進入下一步，而不是列出所有完整句子。

要分清三層：模型學的是 conditional probabilities；autoregressive inference 逐 token 使用它們；generation 則依分布選 token。PDF 在 RLHF 段落說 generations 是從 policy sample，但沒有定義 temperature、top-k、top-p、beam search 或 stopping rules，因此不把這些常見名詞當成本講內容。

KV-cache 與 batching 也在 inference 的系統層：前者避免重算過去 token 的中間值，後者一次處理多個輸入。它們改變計算與記憶體使用方式，不會改變 NTP objective。PDF 沒有單 token latency、throughput、cache hit rate 或 quality curve，這些仍是材料缺口。

### 5. 評估與限制：loss 下降不是完整保證

PDF 明確談到的量化訊號主要是 loss：scaling 段落說資料與模型變大時 loss 仍可下降；最後也把 thoughtful evaluations and benchmarking 列作讓 LM 有效的其他方向。這只支持有限結論：loss 是重要訊號，但投影片沒有完整 evaluation protocol，也沒有 validation split、perplexity、calibration、任務分數或人評方法。

投影片的例子已顯示限制。第一，`panicked` 與 `celebrated` 都可能 plausible；LM 學到的是分布，不是唯一真相。第二，流暢 completion 不保證有來源知識；PDF 沒提供 retrieval、citation 或 factuality evaluation。第三，MLP 的參數量、固定權重與無法重用計算說明架構會限制 context、vocabulary 和 inference cost；Transformer、KV-cache、systems 只是對瓶頸的講義級回應。

「Where we are today」則把限制放到社會層面。Closed frontier models 放在付費 API 後，演算法、資料、systems、inference 的 secret sauce 不公開；open-weight models 把 weights 放到 Hugging Face，可 inference、fine-tune、做 RL、研究架構或移除 safety training，但執行它們仍要成本；open-source models 理想上連 data、training、weights、code 都開放，PDF 舉 OLMo、Marin、LLM360、Pythia，並說它們多半較小、偏學術。

PDF 把 agents 定義成能產生 tool token 使用 web search 或 command line、並放進 `while task not done` 迴圈的 LLM；它也說需要特殊訓練，如何走長 trajectory、何時用工具都未解決。最後列出的問題包括 AI safety、copyright／fair use、data and user privacy、security、interpretability 與 HCI。這些是投影片提出的研究與治理問題，不是本文能替它們下的結論。

### 6. PDF 明確沒有回答的事

這份 119 頁投影片是地圖，不是完整課本或可重現 benchmark。依 PDF 靜態內容，以下事項保留為缺口：

- 沒有 Transformer、attention、KV-cache、FlashAttention 或 BPE 的逐行推導與完整實作。
- 沒有 pre-training corpus 清單、資料清理規則、訓練超參數、checkpoint 或失敗案例。
- 沒有將 NTP、MLM、SFT、RLHF、RLVR 放在同一組可比較實驗中，也沒有共享的品質、成本或安全分數。
- 沒有 loss 以外的完整 evaluation protocol；IOI、FrontierMath、HLE 只是 closed-model 段落中的能力例子。
- 沒有公開本講 Canvas 互動、作業解答、隱藏測資或課堂討論。

因此最可靠的收穫不是「next-token prediction 已解釋智慧」，而是一份可檢查的契約：語言被表示成 token sequence，joint probability 由 chain rule 分解，模型在每個位置做 vocabulary classification，training 與 post-training 改變不同行為，inference 逐 token 生成，而 architecture、data、systems、evaluation 共同決定這份契約能走多遠。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：language_models.pdf](https://stanford-cs221.github.io/autumn2025-lectures/language_models.pdf)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
