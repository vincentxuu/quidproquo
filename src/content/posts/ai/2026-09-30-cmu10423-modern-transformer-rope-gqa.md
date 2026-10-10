---
title: "CMU 10-423 L4：預訓練、微調與現代 Transformer——RoPE、GQA、sliding window 各自修了什麼"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, transformer, attention, pre-training, long-context]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 3
tldr: "CMU 10-423 第 4 講前半區分預訓練、mid-training 與 post-training，後半挑出現代 LLM 幾乎都在用的三個元件：RoPE 把位置資訊改成對 query、key 的旋轉，讓注意力分數只取決於兩個 token 的相對距離；GQA 讓多個 query head 共用一組 key/value head，省記憶體和算力；sliding window 改注意力遮罩，讓每個 token 只看左邊固定數量的 token。三者都是 HW1 的題目。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 4 講導讀：預訓練與微調的定義、LLM 的 pre-/mid-/post-training 流程、投影片上的現代 LLM 名單，以及 RoPE、grouped query attention、sliding window attention 的動機與公式，並對應到 HW1 與練習考卷。"
draft: false
glossary:
  - term: "RoPE"
    aliases: ["rotary position embeddings", "旋轉位置編碼"]
    definition: "把 query 與 key 向量切成 d/2 個二維小段，依 token 位置把每段旋轉不同角度；兩個 token 的注意力分數因此只取決於它們的相對距離。"
    context: "CMU 10-423 第 4 講的第一個現代元件，HW1 要在 minGPT 上實作。"
    links:
      - label: "RoFormer（Su et al., 2021）"
        url: "https://arxiv.org/abs/2104.09864"
  - term: "GQA"
    aliases: ["grouped query attention", "grouped-query attention"]
    definition: "把 query head 分組，每組共用一個 key head 與一個 value head。key/value head 數等於 query head 數時就是一般的多頭注意力，只有一個時就是 multi-query attention。"
    context: "CMU 10-423 第 4 講的第二個現代元件，HW1 要量測它對注意力計算時間的影響。"
    links:
      - label: "GQA（Ainslie et al., 2023）"
        url: "https://arxiv.org/abs/2305.13245"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 3 篇，接續 [L2–L3：Transformer LM 與解碼](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)，範圍是 2026 年 1 月 26 日的 Lecture 4「Pre-training, fine-tuning / Modern Transformers」，講者 Matt Gormley。

用到的官方材料：[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)、[投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)（44 頁）與[課堂手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa-ink.pdf)（47 頁），以及講次表列的三篇 readings：[GQA](https://arxiv.org/pdf/2305.13245.pdf)、[Longformer](https://arxiv.org/pdf/2004.05150.pdf)、[RoFormer](https://arxiv.org/pdf/2104.09864.pdf)。這門課的存取等級是 **A3**（等級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但錄影放在要 CMU 登入的 Panopto，所以本篇完全依投影片撰寫，課堂口述的補充拿不到。

這一講是文字單元的最後一講。講次表在同一天標著「HW1 out (L1-L4)」，兩天後的 Quiz 1 範圍也是 L1–L4。換句話說，這一講講的三個元件，下一篇的 [HW1](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa) 就要你動手寫出來。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 前半：預訓練和微調到底差在哪

投影片先給兩個定義：

| | 預訓練（pre-training） | 微調（fine-tuning） |
|---|---|---|
| 初始化 | 隨機初始化參數 | 用預訓練得到的參數 |
| 資料 | 選項 A：大量無標註資料做非監督訓練；選項 B：大量有標註資料做監督訓練 | 目標任務的資料，通常少很多 |
| 做法 | 從頭訓練 | 可選擇加一個參數很少的預測頭，再用反向傳播訓練 |

接著用三組例子對照同一套定義：

- **影像**：預訓練可以是在 MNIST 上訓練 autoencoder（非監督），也可以是在 ImageNet 21k 類、1,400 萬張圖上做分類（監督）；微調則是 COCO 物件偵測或 ADE20k 語意分割。
- **歷史**：投影片引用 Bengio et al.（2006）在 MNIST 上的結果，比較淺層網路、不預訓練的深層網路、監督式預訓練、非監督式預訓練。它的重點是深度學習在 2006 年起步，靠的正是預訓練。
- **語言模型**：預訓練是在大量無標註句子上最大化似然，例子是 The Pile 與 Dolma（3 兆 token）；微調的例子是 MMLU（57 種任務）與 MBPP 程式生成（約 400 筆訓練例）。

投影片也指出，現在的影像模型多半直接在巨大的標註資料集上做監督式預訓練，而 [ViT](https://arxiv.org/pdf/2010.11929.pdf) 的成功很大程度來自更大的預訓練資料集。這個伏筆會在下一講 [CNN、BERT 與 ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit) 收回來。

### LLM 的三段訓練流程

投影片把現代 LLM 的訓練切成三段：

1. **Pre-training**：在大量無標註文字上最大化似然。
2. **Mid-training**：做法跟預訓練一樣，但換成品質更高的資料，例子是 Dolmino Mix 1124（1,000 億到 3,000 億 token）。
3. **Post-training**：instruction tuning、RLHF／DPO、RLVR（reinforcement learning with verifiable rewards）、safety tuning、任務微調的某種組合，通常只用少量監督資料。

Post-training 的各個方法要到課程第三單元才講，本系列對應的是 order 11 的 IFT／RLHF／DPO 篇。

## 現代 Transformer 名單：從 2017 年到現在改了什麼

後半的開場是兩頁密密麻麻的模型清單，從 PaLM、Llama 1–4、Falcon、Mistral、Qwen、OLMo、Gemma 1–3，一路列到 DeepSeek-R1／V3、gpt-oss 與 Olmo 3。每個模型底下記的是它跟前一代比改了什麼，重複出現的詞是 RoPE、GQA、MQA、SwiGLU、RMSNorm、sliding window。

幾個投影片上的具體例子：

- Llama-2 相對 Llama-1：改用 GQA，上下文長度從 2048 變 4096。
- Mistral：sliding window attention（W = 4096）加 GQA，並用 rolling buffer cache，把位置 i 覆寫到 i mod W。
- Gemma 2：本地 sliding window 與全域 self-attention 交錯使用。
- Olmo 3：7B 用 MHA、32B 用 GQA，都用 RoPE 與 sliding window。

清單後面有一頁自嘲：「如果能讓 LLM 自動幫我更新這份清單就好了」，回答是「你會這麼以為，但……」，旁邊標了好幾個「wrong」。後面 RoPE 那頁也用同樣手法，展示一版被標出多處錯誤的公式。

投影片從這份清單挑出三個元件細講：RoPE、GQA、sliding window attention。

## RoPE：把位置寫進注意力分數

### 它要修的問題

原始 Transformer 用的是絕對位置編碼。手寫版第 45 頁（未手寫的版本沒有這一頁）的整理是：絕對編碼（sinusoidal 或可學習的位置向量）給每個位置一個獨特向量，模型得自己比較這些向量推出距離；相對編碼（Shaw et al. 2018、T5）則直接建模 token 之間的距離，讓 token i 與 j 的注意力分數明確依賴 i − j。

HW1 的說明補了另一個角度：絕對位置編碼只在第一層加到詞向量上，後面的層只能靠前面傳上來的位置資訊。RoPE 則在**每一層**的注意力計算裡直接放入位置。

### 它怎麼做

投影片第 34 頁的關鍵想法有三點：

1. 把每個 d 維的 query、key 向量切成 d/2 個長度為 2 的小向量。
2. 把每個小向量旋轉一個角度，角度與位置 m 成正比。
3. m 是 query 或 key 的絕對位置。

每一段的旋轉速度不同，第 i 段的角速度是 θᵢ = 10000^(−2(i−1)/d)，i = 1 到 d/2。這些 θ 事先固定，不需要學。

手寫版第 46 頁寫下了這一講的核心觀察：旋轉矩陣滿足 (R_i)ᵀ R_j = R_(j−i)。所以把旋轉後的 query 和 key 做內積時，分數只剩下兩者的相對位置 t − j。RoPE 用絕對位置去旋轉，得到的卻是相對位置編碼。

<details>
<summary>投影片上的公式對照（標準注意力 vs. RoPE 注意力）</summary>

```text
標準注意力                     RoPE 注意力
q_j = W_qᵀ x_j                 q_j = W_qᵀ x_j        k_j = W_kᵀ x_j
k_j = W_kᵀ x_j                 q̃_j = R_(Θ,j) q_j     k̃_j = R_(Θ,j) k_j
s_(t,j) = k_jᵀ q_t / √d_k      s_(t,j) = k̃_jᵀ q̃_t / √d_k
a_t = softmax(s_t)             a_t = softmax(s_t)

R_(Θ,m) 是 d_k × d_k 的區塊對角矩陣，第 i 個 2×2 區塊為
  [ cos mθ_i  −sin mθ_i ]
  [ sin mθ_i   cos mθ_i ]
Θ = { θ_i = 10000^(−2(i−1)/d), i = 1, …, d/2 }
```

投影片第 42–43 頁接著說明，因為 R 是區塊稀疏矩陣，不必真的做矩陣乘法。把向量逐元素乘上 cos 向量，再加上「兩兩交換並取負號的向量」逐元素乘上 sin 向量即可。矩陣版本則是把整個 Q（或 K）的左右兩半重排，再和一個 N × d 的角度矩陣 C 的 cos、sin 逐元素相乘。HW1 要實作的就是這個矩陣版本。

</details>

投影片在公式旁留了兩個課堂問題，公開的手寫版沒有寫下答案：

- 把向量切成二維小段再旋轉，好處是什麼？
- 為什麼不同的小段要旋轉不同的量？

[RoFormer 論文摘要](https://arxiv.org/abs/2104.09864)列的性質可以當線索：RoPE 用旋轉矩陣編碼絕對位置，同時在 self-attention 裡帶出明確的相對位置依賴，並具備序列長度上的彈性，以及 token 間的依賴隨相對距離增加而衰減。

## GQA：讓多個 query head 共用 key 與 value

### 它要修的問題

第 5 講開頭的回顧講得最直白：Transformer 很吃算力和記憶體。GQA 的做法是重複使用一部分 key/value head，但保留同樣數量的 query head，藉此減少計算與記憶體。

### 它怎麼做

投影片先回顧多頭注意力：每個 head 有自己的 W_q、W_k、W_v。GQA 定義三個數：

- h_q：query head 數
- h_kv：key/value head 數，假設 h_q 可以被 h_kv 整除
- g = h_q / h_kv：每組的大小，也就是一個 key/value head 要服務幾個 query head

每個參數矩陣的大小都不變，只是 key/value 的參數矩陣變少了。第 i 組的 g 個 query head 都拿同一個 K⁽ⁱ⁾ 算分數、拿同一個 V⁽ⁱ⁾ 加權，最後把 h_q 個輸出串起來，乘上輸出矩陣 W_o。

兩個極端情況分別有名字：h_kv = h_q 是一般的多頭注意力（MHA），h_kv = 1 是 multi-query attention（MQA）。投影片的名單裡，PaLM（2022）和第一代 Gemma（2024）用的就是 MQA。

[GQA 論文摘要](https://arxiv.org/abs/2305.13245)交代了它的出發點：MQA 只用一個 key-value head，大幅加快 decoder 推論，但可能降低品質。論文提出兩件事：一是用原本預訓練 5% 的算力，把既有的多頭 checkpoint「uptrain」成 MQA；二是 GQA 這個介於兩者之間的設計。摘要的結論是，uptrain 後的 GQA 品質接近 MHA，速度與 MQA 相當。

## Sliding window attention：只看左邊固定幾個 token

### 它要修的問題

投影片第 54 頁：一般注意力的計算成本高、需要大量記憶體。sliding window attention 又叫 local attention，投影片註明它是為 Longformer（2020）提出的。

### 它怎麼做

它不改公式，只改因果遮罩 M：每個 token 只看一個 ½w + 1 個 token 的窗口，窗口最右邊是自己（遮罩的對角線）。投影片並排畫了一般因果注意力、w = 4、w = 6 三種遮罩。第 5 講的回顧把效果總結為：注意力的計算從平方時間降到線性時間。

實作上有三種方式，投影片列得很清楚：

| 實作 | 特性 |
|---|---|
| 直接做矩陣乘法再加遮罩 | 簡單，但還是慢 |
| for 迴圈逐 token 算 | 漸進上更快、更省記憶體，但 PyTorch 的 for 迴圈太慢，實務上不能用 |
| sliding chunks | 把 Q、K 切成 w × w、重疊 ½w 的區塊，區塊內算完整注意力再遮掉多餘部分；實務上快又省記憶體 |

HW1 的書面題第 4 大題（11 分）就是從這張表出發：先問直接矩陣乘法版的時間與空間複雜度，再要你寫出更有效率的虛擬碼。細節在下一篇。

[Longformer 論文摘要](https://arxiv.org/abs/2004.05150)的說法是：它的注意力機制隨序列長度線性成長，結合本地窗口注意力與依任務而定的全域注意力，可以直接替換標準 self-attention。投影片名單上 Gemma 2 的「本地與全域交錯」也是同一個思路。

## 三個元件一張表

| 元件 | 修的問題 | 改的地方 | 在 HW1 裡 |
|---|---|---|---|
| RoPE | 絕對位置編碼只在第一層、模型得自己推距離 | 每層注意力裡的 q、k | 程式題：實作 `RotaryPositionalEmbeddings` |
| GQA | 注意力吃記憶體和算力 | key/value head 的數量 | 程式題：實作 `GroupedQueryAttention`，量測時間 |
| Sliding window | 注意力成本隨長度平方成長 | 因果遮罩 | 書面題：複雜度分析與虛擬碼 |

## 課程怎麼驗收這一講

- **Quiz 1**：講次表標在 1 月 28 日課堂上，範圍 L1–L4。題目不公開。
- **HW1**：RoPE、GQA 是程式題，sliding window 是書面題。見 [HW1 導讀](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa)。
- **練習考卷**：[Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) 的第 4 大題「Pre-training, fine-tuning / Modern Transformers」占 17 分（全卷 167 分）。

**怎麼做**：今晚打開投影片第 39 頁的 RoPE 公式，拿 d = 4、兩個位置 m = 1 與 m = 3，手算 R_(Θ,1)ᵀ R_(Θ,3)，確認它等於 R_(Θ,2)。算通了，HW1 的 RoPE 程式題只剩張量形狀的問題。

## 這一篇可以確認與不能確認的

可以確認：講次表的日期與 readings、投影片與手寫版的內容、三篇 readings 的摘要。不能確認：課堂錄影裡的口頭解釋（Panopto 需登入）、投影片上兩個 RoPE 課堂問題的官方答案、Quiz 1 題目。投影片提到 The Pile 時，一頁寫 800 GB、另一頁寫 825 GB（約 1.2 兆 token），本文不另外查證這個數字。

延伸閱讀：站上 [CME295 的 Transformer 技巧篇](/posts/ai/2026-09-29-cme295-transformer-tricks)從另一門課的角度講位置編碼與注意力變體；[CS336 的架構與超參數篇](/posts/ai/2026-08-22-cs336-architectures-hyperparameters)和 [attention 與 MoE 篇](/posts/ai/2026-08-22-cs336-attention-moe)則從「自己訓練一個 LM」的角度整理同一批現代元件。

系列導覽：上一篇 [L2–L3：Transformer LM、LLM 訓練與解碼](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)｜下一篇 [HW1：在 minGPT 加上 RoPE 與 GQA](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表（Lecture 4 與 readings）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 4 投影片：Pretraining vs. finetuning + Modern Transformers](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [Lecture 4 投影片（課堂手寫版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa-ink.pdf)
- [Lecture 5 投影片（開頭的 Modern Transformers 回顧）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf)
- [Ainslie et al. 2023：GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints（EMNLP）](https://arxiv.org/abs/2305.13245)
- [Beltagy et al. 2020：Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Su et al. 2021：RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [HW1 handout（hw1.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
