---
title: "清大 NLP 導讀 6：拿掉 RNN 之後，Transformer 怎麼知道字跟字的關係和位置"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, transformer, self-attention, nlp]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 6
tldr: "清大高宏宇 NLP（Fall 2025）Transformer 單元導讀。投影片從 RNN 的兩個毛病出發：字跟字的互動要隔著 O(N) 步傳遞，時間步之間又不能平行。Self-attention 讓每個字直接看所有字，用矩陣乘法一次算完，兩個毛病同時解掉；代價是模型分不出詞序，所以要補正弦位置編碼。之後依序組出 multi-head attention、Add & Norm、feed forward、cross-attention、masked attention 與 teacher forcing，最後用 GPT-2、ViT 與四種變體說明這個架構後來走多遠。"
description: "清大高宏宇教授自然語言處理（Fall 2025）W3_Transformers.pdf 與 Week 4 Thu. 錄影導讀：RNN 的線性互動距離與不可平行化、QKV self-attention、scaled dot product、正弦位置編碼、multi-head attention、Add & Norm、encoder-decoder 與 cross-attention、masked attention、teacher forcing，以及 GPT-2、ViT、Universal Transformer、Longformer、RoFormer 等變體。公式收在折疊區塊。"
draft: false
glossary:
  - term: "self-attention"
    aliases: ["自注意力"]
    definition: "序列中每個位置都拿自己的 query 去跟所有位置的 key 算相似度，再用 softmax 後的權重加總所有位置的 value，得到這個位置的新表示。"
    context: "本篇用它解決 RNN 的線性互動距離與不可平行化。"
  - term: "teacher forcing"
    aliases: ["教師強制"]
    definition: "訓練 decoder 時，不管模型上一步預測了什麼，下一步的輸入一律換成正確答案（gold token）。"
    context: "投影片第 55–56 頁用「預測成 the、答案是 a」的例子說明。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-transformers-en)

> **本文依據[清大高宏宇教授「自然語言處理」](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025（114-1）的公開教材。** 這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列的第 6 篇，上一篇是 [PyTorch 助教課與 HW2：把算式當語言](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic)。

這一講的官方材料是 [W3_Transformers.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Transformers.pdf)（65 頁），錄影是 [Week 4 Thu.](https://www.youtube.com/live/tr5QyN5TswM)。檔名寫 W3，卻掛在 [2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)的 W4 列，和同週二的 PyTorch 助教課放在一起。這是舊版週次編號沒改，內容以實際掛的投影片與錄影為準。課表那一列的 Topics 欄寫「Basic machine learning for text」，是課綱模板，和這份投影片對不起來，本篇不引用。

投影片大綱分六段：RNN 的問題、attention 當解法、self-attention、Transformer encoder-decoder、Transformer 的成就、Transformer 變體。本篇照這個順序，用「場景 → 直覺 → 機制 → 連回模型 → 想深入」五層來寫。

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=tr5QyN5TswM
title: Week 4 Thu.
```

原始影片：[Week 4 Thu.](https://www.youtube.com/watch?v=tr5QyN5TswM)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 場景：John 住在紐約，RNN 卻忘了 John

投影片第 3 頁用一個問答例子開場：句子開頭提到 John，後面講到 New York，要模型回答 John 住哪。RNN 裡，兩個字互相影響的程度由距離決定。John 的資訊要一路傳過將近 O(N) 個時間步才碰得到答案，途中早就被沖淡了。投影片的說法是：我們早就知道「越近越重要」不是理解句子的正確方式。

第 4 頁是第二個毛病。RNN 的第 t 個 hidden state 要等第 t−1 個算完才能開始，時間步之間沒辦法平行。投影片畫了一個兩層、單向的 RNN，每個格子標出「最少要幾步才算得出來」，數字一路往右上遞增。語料一大、句子一長，這個限制就讓 RNN 很難用在大規模訓練上。

兩個毛病合起來，就是上一講 [seq2seq 與 attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention) 留下的問題：attention 已經讓 decoder 可以回頭看 encoder 的每個位置，那能不能乾脆讓句子裡的每個字都直接看所有字，連 RNN 都不要了？

## 直覺：在句子裡開一個搜尋引擎

第 5–6 頁的答案是 **attention within a sentence**：每一層裡，每個字都去看同一句的所有字。字 i 對字 j 的重視程度記成 α<sub>ij</sub>，由模型學出來，不再由距離決定。

第 7–9 頁用 YouTube 搜尋來比喻 [Vaswani et al. (2017)](https://arxiv.org/abs/1706.03762) 提出的 QKV attention：

| 角色 | 搜尋引擎裡 | 句子裡（找「it」指誰） |
|---|---|---|
| Query | 你打的搜尋字串 | 「it」在找它的指涉對象 |
| Key | 影片標題、描述 | 每個字提供的線索：與 it 的距離、because、was、詞性等 |
| Value | 最後回傳的影片 | 真正的答案那個字（例子裡是 monkey） |

投影片也坦白說 key 這個角色「相當抽象」。可以先記住一句話：**query 決定要找什麼，key 決定被找到的機率，value 決定找到之後拿走什麼。**

## 機制：從一個字的注意力到整個 block

### Self-attention 的計算

第 12–20 頁一步步算。輸入是 N 個 d 維的 embedding e<sub>1</sub>…e<sub>N</sub>，初始化三個矩陣 W<sub>q</sub>、W<sub>k</sub>、W<sub>v</sub>，把每個 e<sub>i</sub> 投影成 q<sub>i</sub>、k<sub>i</sub>、v<sub>i</sub>。然後三步：

1. **算分數**：q<sub>i</sub> 和每個 k<sub>j</sub> 做 scaled dot product
2. **正規化**：對同一個 i 的所有分數做 softmax，得到 α′<sub>ij</sub>
3. **加權平均**：用 α′<sub>ij</sub> 加總所有 v<sub>j</sub>，得到輸出 y<sub>i</sub>

為什麼要除以 √d<sub>k</sub>？第 13 頁的解釋是：d<sub>k</sub> 越大，點積的數值越大，丟進 softmax 後會趨近 one-hot，梯度跟著消失。如果 query 和 key 的每一維都是平均 0、標準差 1，除以 √d<sub>k</sub> 就能讓分數維持在穩定的範圍。

第 19–20 頁把這三步改寫成矩陣形式，整個序列一次乘完。投影片在這裡寫了一句「Solves the parallelizability problem!!」。

<details>
<summary>公式：scaled dot-product attention（投影片第 13–20 頁）</summary>

$$q_i = W_q e_i,\quad k_i = W_k e_i,\quad v_i = W_v e_i$$

$$\mathrm{score}(e_i, e_j) = \frac{q_i^\top k_j}{\sqrt{d_k}},\qquad \alpha'_{ij} = \frac{\exp(\mathrm{score}(e_i,e_j))}{\sum_{j'} \exp(\mathrm{score}(e_i,e_{j'}))}$$

$$y_i = \sum_{j=1}^{N} \alpha'_{ij}\, v_j$$

矩陣形式（N 為序列長度）：

$$Y = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V,\qquad Y \in \mathbb{R}^{N\times d}$$

</details>

### 位置編碼：解掉兩個問題，冒出第三個

第 21 頁回頭清點：線性互動距離解掉了（直接學權重，不靠距離衰減），不可平行化也解掉了（矩陣乘法）。但新問題是，**模型完全不知道字的相對位置**。同一個字「Amy」出現在兩個語意不同的句子裡，只要周圍是同一組字，用同一組權重算出來的 y 就一模一樣。

解法是在 embedding 上加一個代表位置的向量。第 22 頁先問：直接把位置編號 1、2、3… 加上去為什麼不行？兩個理由：

- **沒有數值上限**：句子越長，位置值越大
- **沒有長度上限**：訓練集最長 50，測試集出現 53，第 51–53 個位置的 embedding 從沒訓練過

第 24–30 頁介紹 Vaswani 的做法：不訓練，用正弦與餘弦產生週期性的編碼。每個位置的編碼是一組不同頻率的波，位置越近，圖樣越像。數值固定落在 [−1, 1]，解決第一個問題；週期性可以一直延伸下去，解決第二個問題。投影片也提醒，位置編碼的做法很多，課堂只介紹這一種。

<details>
<summary>公式：正弦位置編碼（Vaswani et al., 2017）</summary>

$$PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right),\qquad PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

pos 是位置，i 是維度索引。偶數維用 sin、奇數維用 cos，波長從 2π 等比增加到 10000·2π。

</details>

### Multi-head attention

第 32 頁回到搜尋引擎的比喻：如果想讓不同組 query 關注不同面向，例如一組看語意相似度、另一組看主動或被動語態，就需要多個注意力機制，也就是多個 head。

第 33–36 頁的計算很直接：h 個 head 各自算出 N×d 的 Y<sub>1</sub>…Y<sub>h</sub>，接起來變成 N×(h·d)，再乘一個 W<sup>O</sup> 投影回想要的維度 d<sub>out</sub>。投影片特別註明，實作上可以把 Q<sub>1</sub>、Q<sub>2</sub>… 併成一個大矩陣，所以 head 數不會讓計算流程變複雜，也不用擔心輸出維度跟著 head 數改變。

### Add & Norm 與 Feed Forward

第 37–39 頁拆開 block 裡的「Add & Norm」：

- **Add**：residual connection（[He et al., 2016](https://arxiv.org/abs/1512.03385)），讓中間的層只學殘差 Y − X，訓練比較穩
- **Norm**：layer normalization（[Ba et al., 2016](https://arxiv.org/abs/1607.06450)），對單一向量沿 embedding 維度算平均和標準差

為什麼用 layer norm 而不是 batch norm？投影片的說法是：原論文沒有給出實驗理由。batch norm 在推論時需要 batch 的統計量，不適合 NLP 裡長短不一的序列，而 layer norm 效果也好。

第 40 頁的 feed forward 只有一句：乘一個權重矩陣，投影到指定維度。

## 連回模型：encoder、decoder 與訓練方式

### 疊層與 cross-attention

第 41–42 頁是 decoder 裡的 cross-attention：K 和 V 來自 encoder 的輸出，Q 來自 decoder 自己。這就是上一講 seq2seq attention 的 Transformer 版本。

第 43–45 頁指出一個設計上的方便：每個 block 的輸入和輸出都是 N×d，維度一致，所以 encoder 可以疊 N 層來增加參數量，decoder 也一樣。

### Masked attention：不能偷看未來

第 46–49 頁提出矛盾：self-attention 要算目前這個字的分數，得用到後面的字，但測試時 decoder 根本還不知道後面的字。解法是在 softmax 前把 QK 分數矩陣的右上三角遮掉，填成 −∞。因為 softmax(−∞) = 0，每一步只會對 j ≤ i 的位置做加權平均。

### 自迴歸解碼與 teacher forcing

第 50–54 頁借用 [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) 的圖，示範 decoder 一次產生一個 token，直到產生 `<eos>` 為止。第 55–56 頁區分兩個階段：

- **測試時**：第 i 步產生的 token 接回輸入，用來預測第 i+1 步
- **訓練時**：用 teacher forcing。假設第 2 步模型預測的是「the」、正確答案是「a」，下一步的輸入仍然放「a」。訓練時預測出的 token 本身不重要，只用它的機率分布算 loss

這和 [HW2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) 用 LSTM 做的 teacher forcing 是同一件事，只是換到 Transformer 上。

### 成就與變體

第 57 頁引原論文的機器翻譯結果：base 設定是 6 層 encoder、6 層 decoder、維度 512、訓練 10 萬步。big 設定維度 1024、訓練 30 萬步，在當時拿下翻譯的 state of the art。第 19 頁寫「原始 Transformer 用 d = 1024」，對應的是 big 設定；[原論文](https://arxiv.org/abs/1706.03762)的 base 模型 d<sub>model</sub> = 512。

第 58–61 頁把 Transformer 連到後面的課：(Chat)GPT 就是 n 層 Transformer decoder 預訓練出來的，預訓練就像讓模型讀很多書，從上下文分布推出字義。投影片用「special restaurant」和「extraordinary restaurant」出現在相似上下文的例子，連到 Firth（1957）的分布假說：a word is characterized by the company it keeps。GPT 系列留到後面再講，也就是本系列的 [BERT 家族](/posts/ai/2026-09-30-nthu-nlp-bert-family)與 [GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)。

第 62–63 頁列出變體（投影片註明「還有很多」）：

| 變體 | 改了什麼 |
|---|---|
| [Universal Transformer](https://arxiv.org/abs/1807.03819) | 加入 Adaptive Computation Time |
| [Longformer](https://arxiv.org/abs/2004.05150) | 處理長文件 |
| [RoFormer](https://arxiv.org/abs/2104.09864) | 改位置編碼設計（Rotary Position Embedding） |
| [Vision Transformer (ViT)](https://arxiv.org/abs/2010.11929) | 把圖片切成 patch 排成序列，送進 Transformer encoder，在大規模資料上勝過改良版 ResNet（BiT-L） |

最後一頁引 [Stanford AI Index Report 2024](https://aiindex.stanford.edu/wp-content/uploads/2024/05/HAI_AI-Index-Report-2024.pdf) 的訓練成本圖，提醒這條路越走越貴。

## 想深入

- 用 NumPy 寫一個單頭 self-attention：給 4 個隨機向量，手算 QK<sup>⊤</sup>/√d<sub>k</sub>、softmax、乘 V，再把上三角遮成 −∞ 看 masked 版本差在哪。
- 把第 21 頁的「Amy」例子實際跑一次：拿掉位置編碼、把輸入順序打亂，確認輸出只是跟著換位置，數值本身不變。
- 畫出 d<sub>model</sub> = 64 的正弦位置編碼熱圖，對照第 25–30 頁的圖。
- 變體表裡的 RoFormer 改的正是位置編碼。想看位置編碼後來的發展，可以接著讀 [台大李宏毅 ML 2026：位置編碼](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)。

**延伸閱讀**：[CS224N 導讀：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers)、[CME295 導讀：Transformer](/posts/ai/2026-09-29-cme295-transformer)、[CS224U 上下文表徵 I：Transformer 與位置編碼](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)。三門課講的是同一個架構，切入角度不同。

## 材料缺口

- 投影片的公式與示意圖多半是圖片，本文的公式依投影片標示的出處（Vaswani et al., 2017）補寫，符號盡量對齊投影片。
- 這一講沒有對應作業。Transformer 要到 [HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) 用 BERT 時才會實際動手。
- 解答、測驗與課堂討論區在 NTU COOL，校外讀者拿不到。
- Fall 2026 的這一講還沒公開（2026 課表 W4 之後都是空的），本文只根據 Fall 2025。

**系列導覽**：上一篇 [PyTorch 助教課與 HW2：把算式當語言](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic)｜下一篇 [Sub-word Tokenization：為什麼模型的詞彙表是「半個字」](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W3_Transformers.pdf（Transformer and Self-Attention 投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Transformers.pdf)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 4 Thu.](https://www.youtube.com/live/tr5QyN5TswM)
- [Vaswani et al. (2017). Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [He et al. (2016). Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)
- [Ba, Kiros & Hinton (2016). Layer Normalization](https://arxiv.org/abs/1607.06450)
- [Alammar. The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Dehghani et al. (2018). Universal Transformers](https://arxiv.org/abs/1807.03819)
- [Beltagy et al. (2020). Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Su et al. (2021). RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Dosovitskiy et al. (2021). An Image is Worth 16x16 Words](https://arxiv.org/abs/2010.11929)
- [Stanford HAI. AI Index Report 2024](https://aiindex.stanford.edu/wp-content/uploads/2024/05/HAI_AI-Index-Report-2024.pdf)
