---
title: "CS231N L8：Attention、Transformer 與 ViT"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, transformer, attention, vision-transformer]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 10
tldr: "CS231N Spring 2026 第 8 講從 RNN 翻譯模型的瓶頸出發，把 attention 抽象成一個作用在「向量集合」上的運算，再推到 self-attention、masked 與 multi-head，最後證明整層只是四次矩陣乘法。Transformer block 由 self-attention、LayerNorm、殘差與 MLP 組成；ViT 把 224×224 的圖切成 16×16 的 patch 當 token。講次結尾列出 2017 年後常見的四個改動：Pre-Norm、QK-Norm、SwiGLU 與 MoE。"
description: "Stanford CS231N（Spring 2026）Lecture 8 導讀：依 124 頁官方投影片整理 seq2seq with attention、attention layer 的 Q/K/V 形狀、self-attention 的排列等變性與位置編碼（含 RoPE）、masked 與 multi-head、四次矩陣乘法與 Flash Attention、RNN／卷積／self-attention 三種序列處理方式的取捨、Transformer block、LLM 與 ViT 的輸入輸出設計，以及 Pre-Norm、QK-Norm、SwiGLU、MoE。"
draft: false
glossary:
  - term: "self-attention"
    aliases: ["自注意力"]
    definition: "每個輸入向量各自算出 query、key、value，每個 query 對所有 key 算相似度、做 softmax，再用這組權重加總 value，得到一個混合了所有輸入資訊的輸出向量。"
    context: "CS231N 第 8 講把它寫成 Q=XW_Q、K=XW_K、V=XW_V、Y=softmax(QKᵀ/√D)V。"
  - term: "permutation equivariant"
    aliases: ["排列等變"]
    definition: "把輸入的順序打亂，輸出會以同樣的方式被打亂，其餘不變，也就是 F(σ(X)) = σ(F(X))。"
    context: "CS231N 用它說明 self-attention 作用在向量集合上、本身不知道順序，所以需要位置編碼。"
  - term: "Vision Transformer"
    aliases: ["ViT"]
    definition: "把影像切成固定大小的 patch，每個 patch 攤平後線性投影成一個向量，加上位置編碼，再送進標準 Transformer；分類時把輸出向量平均池化後接線性層。"
    context: "CS231N 第 8 講以 224×224×3 影像、16×16 patch 為例。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文主要依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 課表連結的 [Lecture 8 投影片](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf)（124 頁，2026-09-30 下載核對），加上 5/1 section 的 [RNNs & Transformers 複習投影片](https://cs231n.stanford.edu/slides/2026/section_5.pdf)（封面註明複製自 2025 年版本）。錄影請看 Spring 2025 的 [Lecture 8: Attention and Transformers](https://www.youtube.com/watch?v=RQowiOF_FvQ)；2026 錄影只放在 Canvas，限修課生。兩個年份的投影片大致相同，但 2026 版多了 RoPE 與 QK-Norm 兩頁，看影片時會少這兩段。字幕裡也沒有 Flash Attention，以及本文最後一節的 Pre-Norm、SwiGLU 與 MoE，影片結尾是 Transformer 總結。存取等級 **A3**。

**系列位置**：上一篇 [A2 導讀：BatchNorm、Dropout、CNN、PyTorch 與 RNN Captioning](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn)｜下一篇 [L9：物件偵測、影像分割與模型可視化](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

到第 7 講為止，CS231N 有兩種結構：處理網格的卷積，處理序列的 RNN。第 8 講引入第三種，而且它後來吃掉了前兩種的地盤。投影片的總結頁寫得很直接：Transformer 是今天所有大型 AI 模型的骨幹，用在語言、視覺、語音等領域。

這一講的主線只有一條：attention 從哪裡來 → 抽象成一個通用運算 → 用它蓋出 Transformer → 把圖片也變成 Transformer 能吃的輸入。本文照這條線走。

## 課程影片來源

本文以 Spring 2026 教材為準。官方 Spring 2026 課表（2026-10-10 即時查證）沒有列出錄影連結，也沒有找到 Spring 2026 的公開播放清單；下列 Spring 2025 錄影來自 Stanford Online 的公開播放清單，是講次標題相同的相關補充影片，內容可能與 2026 版不同，原講次錄影未確認。查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：影片是 Spring 2025 第 8 講（長度 1:06:31），字幕有 RNN 翻譯模型與 attention、self-attention 的矩陣運算、排列等變、位置編碼、masked 與 multi-head、RNN／卷積／self-attention 比較、Transformer block 與 ViT 概述，結尾是 Transformer 總結。字幕沒有 RoPE、QK-Norm、Flash Attention、Pre-Norm、SwiGLU、MoE，也沒有 224×224／16×16 patch 的數字例子，這些屬於本文依據的 2026 投影片，已在版本說明補上。本文的投影片細節以 2026 投影片為準，未逐項對照這支上一屆的錄影。

```youtube
url: https://www.youtube.com/watch?v=RQowiOF_FvQ
title: Stanford CS231N | Spring 2025 | Lecture 8: Attention and Transformers
```

原始影片：[Stanford CS231N | Spring 2025 | Lecture 8: Attention and Transformers](https://www.youtube.com/watch?v=RQowiOF_FvQ)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 場景：RNN 翻譯模型卡在一個向量

投影片從 seq2seq 翻譯開始，例子是把「we see the sky」翻成義大利文「vediamo il cielo」。Encoder RNN 讀完整句英文後，只把最後的隱藏狀態交給 decoder，當成整句話的摘要 c。句子一長，所有資訊都得擠進這一個固定大小的向量。

[Bahdanau et al. 2015](https://arxiv.org/abs/1409.0473) 的解法是：decoder 每產生一個詞，都回頭看 encoder 的**所有**隱藏狀態。

1. 用上一步的 decoder 狀態 s_{t−1} 跟每個 encoder 狀態 h_i 算一個對齊分數 e_{t,i}（投影片寫 f_att 是一個線性層）。
2. softmax 把分數變成權重 a_{t,i}。
3. 用權重加總 h_i，得到這一步專屬的 context 向量 c_t。

每個時間步用不同的 context 向量，而且這些權重可以畫出來，看翻譯時模型在看哪幾個原文詞。

投影片接著點出：這裡藏著一個通用的運算。decoder 狀態當 **query**，encoder 狀態當**資料向量**，每個 query 看過所有資料向量，產生一個輸出。這個運算根本不需要 RNN。

## 直覺：attention 是作用在集合上的運算

把 RNN 拿掉之後，attention layer 的輸入是一組 query 向量 Q 和一組資料向量 X。投影片逐頁長出完整形狀：

- 從 X 投影出 key：K = XW_K；投影出 value：V = XW_V
- 相似度 E = QKᵀ / √D_Q，每個元素是一個 query 與一個 key 的點積
- 權重 A = softmax(E)，每個 query 得到一個對所有 key 的分布
- 輸出 Y = AV，每個輸出是 value 的加權和

Query 與資料來自不同來源時，這叫 **cross-attention**。如果 query 也從同一組輸入算出來（Q = XW_Q），就是 **self-attention**：每個輸入各自產生一個輸出，這個輸出混合了所有輸入的資訊。實作上 Q、K、V 三個投影常合併成一次矩陣乘法：[Q K V] = X[W_Q W_K W_V]。

<details>
<summary>self-attention 的完整形狀（投影片第 47 頁）</summary>

```text
輸入 X          [N × D_in]
Q = X W_Q       [N × D_out]
K = X W_K       [N × D_out]
V = X W_V       [N × D_out]
E = Q Kᵀ / √D_Q  [N × N]
A = softmax(E)  [N × N]      每個 query 對所有 key 正規化
Y = A V         [N × D_out]   Y_i = Σ_j A_ij V_j
```

投影片註明：幾乎總是 D_Q = D_V = D_out。

</details>

## 機制：四個性質決定了 Transformer 的樣子

### 1. 它不知道順序

把輸入打亂，Q、K、V、相似度、權重和輸出都跟著以同樣方式打亂，其他什麼都沒變。投影片寫成 F(σ(X)) = σ(F(X))，叫做**排列等變**（permutation equivariant）。

這是優點也是問題。優點是 self-attention 天生適合處理集合；問題是處理句子時，它分不出「狗咬人」和「人咬狗」。投影片給兩種解法：

- 在每個輸入加上**位置編碼**，它是位置索引的固定函數。
- **RoPE**（[Su et al. 2021](https://arxiv.org/abs/2104.09864)）：把位置映射成角度，旋轉 query 和 key，讓點積只依賴兩者的相對位置。這一頁是 2026 版新加的，2025 投影片沒有。

### 2. 可以用遮罩限制它看哪裡

**Masked self-attention** 把不該看的相似度改成 −∞，softmax 後權重就是 0。語言模型用這個方法讓每個 token 只看到它前面的 token，不能偷看答案。

### 3. 可以平行跑好幾份

**Multi-head self-attention** 平行跑 H 份 self-attention，每一份叫一個 head，最後把輸出接起來再投影回原本的維度。

### 4. 整層只是四次矩陣乘法

投影片把 multi-head self-attention 拆成四步：

1. QKV 投影：[N × D] 乘 [D × 3HD_H]
2. QK 相似度：得到 [H × N × N]
3. 用權重加總 V：得到 [H × N × D_H]
4. 輸出投影：[N × HD_H] 乘 [HD_H × D]

問題出在第 2 步的 H × N × N 注意力矩陣。投影片舉例：N = 100K、H = 64 時，光這個矩陣就要 1.192 TB，GPU 裝不下。解法是 [Flash Attention](https://arxiv.org/abs/2205.14135)：把第 2、3 步合在一起算，不存完整的注意力矩陣，於是很大的 N 也變得可行。

## 三種處理序列的方式

投影片把 RNN、卷積、self-attention 並排比較，這張表是本講最值得記住的一頁：

| | RNN | 卷積 | Self-attention |
|---|---|---|---|
| 適用資料 | 一維有序序列 | N 維網格 | 向量集合 |
| 長序列 | 理論上好，O(N) 計算與記憶體 | 差，要疊很多層才看得遠 | 好，每個輸出直接看所有輸入 |
| 平行化 | 不行，隱藏狀態要依序算 | 可以 | 可以，就是四次矩陣乘法 |
| 代價 | — | — | 貴：O(N²) 計算、O(N) 記憶體 |

5/1 的 [section 投影片](https://cs231n.stanford.edu/slides/2026/section_5.pdf)補了一個角度：RNN 的歸納偏置強，天生帶著時間結構；Transformer 的歸納偏置弱，要從資料中學。

## 連回模型：Transformer block

[Transformer](https://arxiv.org/abs/1706.03762)（Vaswani et al. 2017）的一個 block 由下往上是：

1. **Multi-head self-attention**：所有向量在這裡互相交流
2. **殘差連接 + LayerNorm**：LayerNorm 對每個向量各自正規化
3. **MLP**：通常是兩層，經典設定是 D → 4D → D，也叫 FFN，對每個向量**獨立**計算
4. 再一次殘差連接 + LayerNorm

整個 Transformer 就是一疊相同的 block。投影片強調三件事。第一，self-attention 是向量之間唯一的交流管道。第二，LayerNorm 與 MLP 都各自處理每個向量。第三，大部分計算只是 6 次矩陣乘法（self-attention 4 次、MLP 2 次），所以非常容易擴展與平行化。投影片還說，從 2017 年到現在，架構本身沒什麼變，只是規模大了很多。

### 用在語言：LLM

輸入端學一個 [V × D] 的 embedding 矩陣，把詞換成向量。每個 block 裡用 masked attention，讓 token 只看到前面的 token。輸出端學一個 [D × V] 的投影矩陣，把每個 D 維向量變成詞彙表上的分數。

### 用在影像：ViT

[ViT](https://arxiv.org/abs/2010.11929)（Dosovitskiy et al.，ICLR 2021，論文標題是「An Image is Worth 16x16 Words」）要解決的是：影像不是一串詞，要怎麼變成 Transformer 的輸入？投影片的步驟：

1. 輸入影像，例如 224×224×3。
2. 切成 patch，例如 16×16×3。
3. 每個 patch 攤平（16×16×3 = 768 維），線性投影成 D 維向量。
4. 加上位置編碼，告訴 Transformer 每個 patch 的二維位置。
5. **不用遮罩**：每個 patch 都能看到其他所有 patch。
6. Transformer 為每個 patch 輸出一個向量；把 N 個向量平均池化成一個，再用線性層 D → C 預測類別分數。

投影片在第 3 步停下來問：這個操作還能怎麼描述？答案是：一個 16×16、stride 16、3 輸入通道、D 輸出通道的卷積。這句話把 ViT 和前幾講的 CNN 接了起來：ViT 的第一層其實就是一個大步長的卷積，之後全部交給 self-attention。

## 2017 年以後常見的四個改動

投影片最後一節列出現代 Transformer 常見的調整：

- **Pre-Norm**：原版把 LayerNorm 放在殘差連接外面，投影片說這「有點怪」，因為模型學不出恆等函數。改成把正規化移到殘差分支裡面。
- **QK-Norm**：計算相似度前先正規化 query 和 key，防止梯度突波、穩定訓練。這頁也是 2026 版新加的。
- **SwiGLU**：把經典 MLP 換成 Y = (σ(XW₁) ⊙ XW₂)W₃；中間維度設成 H = 8D/3 時，參數量跟原本一樣（[Shazeer 2020](https://arxiv.org/abs/2002.05202)）。
- **Mixture of Experts (MoE)**：每個 block 學 E 組 MLP，每個 token 只路由到其中 A 組。參數量變成 E 倍，計算量只跟 A 成正比（[Shazeer et al. 2017](https://arxiv.org/abs/1701.06538)）。

2025 年版的投影片在這一節有 RMSNorm。2026 版的第 8 講沒有 RMSNorm 那頁，改放在[第 9 講](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization)開頭的 Transformer 回顧裡。

## 想深入

- **課表建議閱讀**：原始論文 [Attention Is All You Need](https://arxiv.org/abs/1706.03762)、Lilian Weng 的 [Attention? Attention!](https://lilianweng.github.io/posts/2018-06-24-attention/)、Jay Alammar 的 [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)、[ViT 論文](https://arxiv.org/abs/2010.11929)。
- **動手**：section 5 投影片最後附了一份 [Colab notebook](https://colab.research.google.com/drive/1mC5CWwekbZ2NrYv6Zfpuv55z8DuOZXVP)。本系列的 [A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)第一題就是用 Transformer 取代 A2 的 RNN 做影像描述。
- **自我檢查**：不看投影片，寫出 self-attention 每一步的矩陣形狀，並說明為什麼 ViT 的 patch embedding 等於一個卷積。

## 延伸閱讀

以下各門課從語言模型的角度講同一套架構，本篇的視覺主線不依賴它們：

- [CS224N：Transformer](/posts/ai/2026-08-22-cs224n-transformers)
- [CME295：Transformer](/posts/ai/2026-09-29-cme295-transformer)
- 從零寫出 Transformer 語言模型：[CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方來源只有 Spring 2025 版錄影，狀態改為僅附相關補充影片，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。影片主題與講次相符；版本說明只提到影片少了 RoPE 與 QK-Norm，實際上少的更多（Flash Attention、Pre-Norm、SwiGLU、MoE 等），已補充。

## 參考資料

- [CS231N Lecture 8 投影片（Spring 2026）](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf) — 本文所有圖表、形狀與例子的出處
- [CS231N Section 5：RNNs & Transformers 投影片](https://cs231n.stanford.edu/slides/2026/section_5.pdf) — RNN 與 Transformer 比較表
- [CS231N 課表（Spring 2026）](https://cs231n.stanford.edu/schedule.html) — 4/23 講次與建議閱讀
- [CS231N Lecture 8 投影片（Spring 2025）](https://cs231n.stanford.edu/slides/2025/lecture_8.pdf) — 與 2026 版比對用
- [Spring 2025 Lecture 8 錄影](https://www.youtube.com/watch?v=RQowiOF_FvQ)
- [Vaswani et al., Attention Is All You Need（NeurIPS 2017）](https://arxiv.org/abs/1706.03762)
- [Dosovitskiy et al., An Image is Worth 16x16 Words（ICLR 2021）](https://arxiv.org/abs/2010.11929)
- [Bahdanau, Cho & Bengio, Neural Machine Translation by Jointly Learning to Align and Translate（ICLR 2015）](https://arxiv.org/abs/1409.0473)
- [Su et al., RoFormer: Enhanced Transformer with Rotary Position Embedding（2021）](https://arxiv.org/abs/2104.09864)
- [Dao et al., FlashAttention（2022）](https://arxiv.org/abs/2205.14135)
- [Shazeer, GLU Variants Improve Transformer（2020）](https://arxiv.org/abs/2002.05202)
- [Shazeer et al., Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer（2017）](https://arxiv.org/abs/1701.06538)
- [Lilian Weng, Attention? Attention!](https://lilianweng.github.io/posts/2018-06-24-attention/)
- [Jay Alammar, The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)
