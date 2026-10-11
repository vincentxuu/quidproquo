---
title: "CMU 11-868 L06–L07：用系統的眼光讀 Transformer、T5、LLaMA 與 GPT-3"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, transformer, pre-training, llama]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 6
tldr: "11-868 只花兩堂課講模型本身：L06 把 Transformer 拆成 embedding、多頭注意力、FFN、LayerNorm 與殘差，L07 用 T5、LLaMA、GPT-3 三個模型示範現代 LLM 改了哪些地方。對系統工程師來說，重點是記住形狀：GPT-3 175B 是 96 層、d_model 12288、context 2048，訓練 3,000 億 token；LLaMA 65B 是 80 層、d_model 8192、訓練 1.4 兆 token。這些數字決定了後面每一堂加速、平行與服務課要處理的量。"
description: "CMU 11-868 LLM Systems（2026 春季版）L06 Transformer 與 L07 Pre-trained LLMs 導讀：encoder-decoder 到 decoder-only、注意力與 FFN 的矩陣形狀、pre-norm、SwiGLU、RoPE，以及 T5、LLaMA、GPT-3 的模型尺寸與訓練算力。架構細節另連 CS224N、CME295、CS336。"
draft: false
glossary:
  - term: "SwiGLU"
    definition: "把 Swish 激活函數和閘控線性單元（GLU）結合的 FFN 變體：一路線性投影經過 Swish 後，和另一路線性投影逐元素相乘。LLaMA 採用它，並把 FFN 中間維度從 4d 降到約 2/3 × 4d，讓參數量和原本相近。"
    context: "CMU 11-868 L07 講 LLaMA 架構改動時的第二項。"
  - term: "RoPE"
    definition: "Rotary Position Embedding：把 query 與 key 的每兩個維度看成一個平面向量，依位置 m 旋轉 mθ 角，讓兩個 token 的注意力分數只跟位置差 n−m 有關。"
    context: "CMU 11-868 L07 講 LLaMA 架構改動時的第三項。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。主要材料是 [L06 Transformer 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf)（2/2，25 頁）、[L07 Pre-trained LLMs 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-07-llms-acf5db9438a8d9a86f86d29d9c563c00.pdf)（2/4，22 頁），以及 [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 列的 reading。文中頁碼指 PDF 頁。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與作業全部公開，但**官方課表未列公開錄影連結**，本文只能依投影片與論文，不能轉述講者口頭補充。

**系列位置**：上一篇 [HW2：MiniTorch Framework](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework)｜下一篇 [L08–L09：Tokenization、解碼與 speculative decoding](/posts/ai/2026-09-30-cmu11868-tokenization-decoding)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

前五篇在打地基：GPU 怎麼跑 kernel、框架怎麼自動微分、你自己的 MiniTorch 怎麼訓練一個情感分類器。從這一篇開始，課程第一次把「模型」搬上桌。

11-868 講模型只用了兩堂：L06 講 Transformer，L07 講預訓練 LLM。跟 [Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning) 或 [CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms) 比，這兩堂的篇幅很短。它們只負責一件事：讓你知道**接下來要加速、切分、服務的東西長什麼樣子**，語言模型為什麼有效則交給其他課。本文照這個角度讀：每個元件都問兩件事，它的矩陣形狀是什麼、它會吃掉什麼資源。

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 先定位：三種語言模型

L06 第 4 頁把語言模型分成三類：

| 類型 | 訓練目標 | 投影片的例子 |
|---|---|---|
| Encoder-only | Masked LM | BERT、RoBERTa、ESM（蛋白質） |
| Encoder-decoder | 自回歸或非自回歸 | T5 |
| Decoder-only | 自回歸 | GPT、LLaMA、ProGen（蛋白質） |

L06 用機器翻譯當主例，走 encoder-decoder 路線；L07 再轉到 decoder-only。這條路線跟後面的作業直接相關：[HW3](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture) 要你用 decoder-only 的 GPT-2 架構做德英翻譯，所以兩種架構你都得懂。

L06 第 6–7 頁交代了換架構的動機：以前的 seq2seq 用 LSTM 或 GRU，一次只能處理一個位置；Transformer 在 encoder 和 decoder 都改用 attention，拿掉遞迴之後，encoder 可以**同時**編碼整句。對系統課來說，這一句就是全部重點：可平行，才適合 GPU。

## L06：一個 Transformer 層的形狀

### Embedding

L06 第 10 頁：token embedding 是一張查表，輸入和輸出共用同一張（tied embedding）；位置編碼用原論文的 sin/cos 公式，維度和 token embedding 相同，兩者相加。tokenization 留到下一堂。

系統上要記的是：embedding 表的大小是「詞表大小 × 隱藏維度」。詞表越大，這張表和最後輸出層的矩陣就越大，這也是下一篇講 tokenization 時會回來談的成本。

### 多頭注意力

L06 第 11–13 頁：輸入 X 的形狀是「token 數 × 維度」，投影成 Q、K、V 之後切成 h 個頭，各自做 scaled dot-product attention，再串接起來乘上輸出矩陣 W^O。第 12 頁在圖上標了兩個形狀：Q、K、V 是 **len × dim**，注意力分數矩陣是 **len × len**，並留了一題「為什麼要除以 √d」給讀者想。

那個 len × len 就是系統課的伏筆。序列長度加倍，注意力矩陣變成四倍。後面的 [FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention) 整堂課都在處理這個矩陣怎麼不要整塊寫回記憶體。

Decoder 的 self-attention 多一步：softmax 前把右側（未來位置）遮成 −∞（第 14 頁）。

### FFN、殘差與 LayerNorm

L06 第 13 頁的 FFN 是兩層線性加 ReLU：`FFN(x) = max(0, xW1 + b1)W2 + b2`。原論文的數字在第 17 頁：encoder、decoder 各 6 層，embedding 512（base）或 1024（large），FFN 中間維度 2048。

第 15 頁把殘差連接和 LayerNorm 放在一起，並列出 post-norm 與 pre-norm 兩種擺法。這個區別在 HW3 會變成實作要求：作業頁寫明 GPT-2 用 pre-LN。

### 訓練設定

L06 第 18–23 頁整理原論文的訓練細節，挑幾個跟資源有關的：

- 訓練用 teacher forcing：解碼器假裝已經知道正確的前綴，所有位置可以一起算 loss（第 18 頁）
- 批次依句長大致分組，但仍要 shuffle（第 21 頁）
- 硬體：2017 年論文用一台 8 張 GPU 的機器，base 模型 10 萬步約 12 小時，large 模型 30 萬步約 3.5 天（第 21 頁）
- Adam 搭配 warmup 後遞減的學習率（第 21–22 頁）
- 最後把 base 模型最後 5 個 checkpoint 取平均（第 23 頁）

L06 最後一頁（第 25 頁）的 code walkthrough 指向 [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/)，Syllabus 也把 2/6 的 Recitation 3 排成它。沒有對應錄影連結的狀況下，這份逐行實作是理解 L06 最好的替代品。

## L07：現代預訓練 LLM 改了什麼

L07 用三個模型當案例（第 3 頁）：encoder-decoder 的 T5、decoder-only 的 LLaMA，以及 GPT-3。

### T5：統一格式與 span corruption

第 4–7 頁：

- 標準 encoder-decoder Transformer，解碼用 beam search（beam width 4、length penalty 0.6）
- 尺寸：T5-base 2.2 億參數（12 層、d_model 768、d_ff 3072、12 頭）；T5-11B 是 24 層、d_model 1024、d_ff 65536、128 頭
- 預訓練資料 C4：從 Common Crawl 過濾出的英文語料，750GB
- 預訓練目標：隨機遮掉 15% 的 span 再還原；50 萬步、每批 128 條長度 512 的序列，打包後每批約 65k token，總共約 340 億 token
- 多任務微調：把任務說明用自然語言寫進輸入，之後的 T0、Flan-T5 都沿用這個做法

T5-11B 的 d_model 只有 1024，參數幾乎都堆在 FFN 的 65536 維。這個配置提醒你：同樣的參數量，擺在不同矩陣上，對記憶體和運算的壓力會很不一樣。

### LLaMA：三個架構改動

第 8 頁列出 LLaMA 在 decoder-only Transformer 上的三項改動，每一項都標了出處：

1. **Pre-normalization**（來自 GPT-3）：LayerNorm 移到子層之前（第 9 頁）
2. **SwiGLU**（來自 PaLM）：FFN 改用 Swish 閘控，第 10 頁特別標出中間維度從 4d 改成 **2/3 × 4d**
3. **RoPE**（來自 RoFormer）：用旋轉矩陣讓注意力分數只跟位置差有關（第 11–12 頁）

第 14 頁補了訓練策略：標準語言模型 loss，不用 label smoothing，加一項輔助 loss 讓 softmax 的正規化項接近 0；預訓練只用開源資料。

第 13 頁的模型尺寸表在投影片裡是圖，數字要回 [LLaMA 論文](https://arxiv.org/abs/2302.13971) 的 Table 2 看：

| 參數 | d_model | 頭數 | 層數 | 訓練 token |
|---|---|---|---|---|
| 6.7B | 4096 | 32 | 32 | 1.0T |
| 13.0B | 5120 | 40 | 40 | 1.0T |
| 32.5B | 6656 | 52 | 60 | 1.4T |
| 65.2B | 8192 | 64 | 80 | 1.4T |

論文第 2.4 節給了一個系統課會喜歡的數字：訓練 65B 模型時，每張 GPU 每秒處理約 380 個 token，用 2048 張 80GB A100，跑完 1.4 兆 token 大約要 21 天。

### GPT-3：尺寸與算力

第 15 頁：GPT-3 沿用標準 Transformer，改了初始化、用 pre-normalization 與可逆的 tokenization，並交替使用 dense 與局部帶狀的 sparse attention。第 16–18 頁的尺寸表、訓練細節與「Computation」頁都是從 [GPT-3 論文](https://arxiv.org/abs/2005.14165)截的圖。回原論文看 Table 2.1，最大的 175B 是：

- 96 層、d_model 12288、96 頭、每頭 128 維
- 所有尺寸的 context window 都是 2048 token
- 所有尺寸都訓練 3,000 億 token

論文附錄 D 的 Table D.1 把算力算給你看：每個參數每個 token 前向約 2 次浮點運算，反向再乘 3，合計 6 次；175B 模型訓練 3,000 億 token，總計約 3.14 × 10²³ FLOPs，約 3,640 petaflop/s-days。

### 用這些數字自己估一下

以下是本文用上面的數字做的粗估，不是投影片內容，但這正是後面每堂課要你做的事：

- **參數記憶體**：175B 參數用 FP16 存，光權重就約 350GB，一張 80GB 的 GPU 放不下。這是[模型平行](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)和 [ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization) 存在的理由
- **每層參數**：一層的注意力（Q、K、V、O 四個 d×d 矩陣）加 FFN（兩個 d×4d）約 12d²。GPT-3 的 d=12288、96 層，12 × 12288² × 96 ≈ 1,740 億，跟 175B 對得上
- **注意力分數**：context 2048 時，每個頭每層的分數矩陣是 2048 × 2048

## 延伸閱讀：架構本身

11-868 刻意只講系統需要的部分。想弄懂架構設計的來龍去脈，站上有幾篇更完整的導讀：

- [CS224N 第 5 講：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers)，以及 [第 7 講：預訓練](/posts/ai/2026-08-22-cs224n-pretraining)
- [CME295 第 1 講：從切字到 Transformer](/posts/ai/2026-09-29-cme295-transformer) 與 [Transformer 技巧](/posts/ai/2026-09-29-cme295-transformer-tricks)
- [CS336 Lecture 3：Transformer 架構與超參數](/posts/ai/2026-08-22-cs336-architectures-hyperparameters)：pre-norm、SwiGLU、RoPE 為什麼成為預設
- [CMU 11-785 Lecture 19：Transformer 與後續架構](/posts/ai/2026-08-22-cmu-11785-19-transformer-architectures)

## 自學建議

1. 先讀 L06，再對照 [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) 把每個矩陣的形狀寫在紙上，特別是注意力那段的 permute 與 reshape，HW3 會原樣考你
2. L07 的尺寸表是圖片，直接開 [LLaMA](https://arxiv.org/abs/2302.13971) Table 2 和 [GPT-3](https://arxiv.org/abs/2005.14165) Table 2.1、Table D.1
3. 用 GPT-3 的數字算一次參數量、權重記憶體和訓練 FLOPs，當作進入後半學期的暖身
4. L07 第 21 頁直接接到 [HW3 作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_3/)，這份作業 2/4 發下，讀完本文與[下一篇](/posts/ai/2026-09-30-cmu11868-tokenization-decoding)就可以開始

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時回官方課程頁與公開影音來源查證，仍未找到該講公開錄影，狀態維持不變。

## 參考資料

- [CMU 11-868 LLM Systems，2026 春季課程首頁](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L06 Transformer 投影片（PDF）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf)
- [L07 Pre-trained LLMs 投影片（PDF）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-07-llms-acf5db9438a8d9a86f86d29d9c563c00.pdf)
- [Vaswani et al., Attention Is All You Need（2017）](https://arxiv.org/abs/1706.03762)
- [Touvron et al., LLaMA: Open and Efficient Foundation Language Models（2023）](https://arxiv.org/abs/2302.13971)
- [Brown et al., Language Models are Few-Shot Learners（GPT-3，2020）](https://arxiv.org/abs/2005.14165)
- [The Annotated Transformer（Harvard NLP）](https://nlp.seas.harvard.edu/annotated-transformer/)
- [11-868 Assignment 3 作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_3/)
