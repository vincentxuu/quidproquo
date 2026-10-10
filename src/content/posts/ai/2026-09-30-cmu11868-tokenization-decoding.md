---
title: "CMU 11-868 L08–L09：詞表怎麼選、token 怎麼吐，以及 speculative decoding 為什麼快"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, tokenization, speculative-decoding, llm-inference]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 7
tldr: "L08 從 BPE 講到講者 Lei Li 參與的 VOLT：詞表大小有成本也有價值，VOLT 用「每加一個 token 能降多少正規化熵」找划算的點，再化成最佳傳輸問題求解；後半講 LLaMA 3 詞表從 32k 擴到 128k、中文字被 byte-level BPE 切成三個 token 的代價。L09 從 greedy、取樣、beam search 一路講到 speculative decoding：小模型先猜 N 個 token，大模型一次前向驗證，因為驗證比生成便宜；最後介紹 EAGLE 改成預測最後一層特徵。"
description: "CMU 11-868 LLM Systems（2026 春季版）L08 Tokenization and Embedding 與 L09 Generation and Speculative Decoding 導讀：BPE、VOLT 與 MUV、LLaMA 3 詞表與多語 over-tokenization、Gumbel-max 取樣、beam search、top-k 驗證的 speculative decoding、EAGLE 與 tree attention。"
draft: false
glossary:
  - term: "VOLT"
    definition: "Vocabulary Learning via Optimal Transport（Xu 等人，ACL 2021）：用詞表的邊際效用（MUV，每多加一個 token 能降低多少正規化熵）找詞表大小的划算點，並把求解化成熵正則化的最佳傳輸問題，用 Sinkhorn 演算法解。"
    context: "CMU 11-868 L08 的第二段，講者 Lei Li 是作者之一。"
  - term: "MUV"
    definition: "Marginal Utility of Vocabularization：詞表從 k 個 token 增加到 k+m 個時，正規化熵下降量除以 m 的負值，衡量每個新增 token 帶來多少價值。"
    context: "VOLT 用來找最佳詞表大小的指標。"
  - term: "Speculative decoding"
    definition: "用小的 draft 模型先連續生成 N 個候選 token，再讓大的 target 模型用一次前向同時驗證；被接受的 token 直接保留，第一個被拒絕處由 target 模型接手生成。加速來自驗證比逐一生成便宜。"
    context: "CMU 11-868 L09 的主題。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-tokenization-decoding-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。主要材料是 [L08 Tokenization and Embedding 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-08-tokenization-594dd043d7a87d8dcc91b7e7585a0e34.pdf)（2/9，45 頁）、[L09 Decoding 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-09-decoding-cac2cd9402765ff5e6c24f7baffd321c.pdf)（2/11，54 頁），[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 列的 reading（[BPE](https://aclanthology.org/P16-1162/)、[SentencePiece](https://aclanthology.org/D18-2012/)、[VOLT](https://aclanthology.org/2021.acl-long.571/)），以及課程的 [llmsys_code_examples](https://github.com/llmsystem/llmsys_code_examples) notebook。文中頁碼指 PDF 頁。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**，但**官方課表未列公開錄影連結**；投影片裡的 Quiz 5.1–5.3 在 Canvas 上，校外看不到。

**系列位置**：上一篇 [L06–L07：Transformer 與預訓練 LLM](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms)｜下一篇 [HW3：在 MiniTorch 實作 decoder-only Transformer](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

[上一篇](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms)講的是模型中間那一大塊。這一篇講頭尾：輸入前怎麼把文字切成 token，輸出後怎麼一個一個把 token 吐出來。

兩件事看起來都跟「系統」無關，其實都是成本問題。詞表大小決定 embedding 表和輸出層有多大、同一句話要多少個 token；解碼策略決定生成一段文字要跑幾次前向。L09 的後半更直接：speculative decoding 就是一個推論加速技術。

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## L08：tokenization 是一個取捨

### 三種粒度

L08 第 5–11 頁依序比較三種切法：

| 粒度 | 優點 | 缺點 |
|---|---|---|
| 詞 | 好實作 | 遇到沒看過的詞（投影片的例子是 Covid）只能變 [UNK]；中文、日文、韓文、高棉文等不用空白分詞的語言要另外斷詞 |
| 字元 | 詞表很小、沒有 OOV | 序列變長，單一 token 沒有語意 |
| Subword | 詞表大小適中、沒有 OOV | 切出來的片段不一定有語意 |

第 9 頁把詞表大小的兩難講得很清楚：詞表小，參數少、生成時要選的詞少，但 OOV 多；詞表大則反過來。

### BPE

第 11–14 頁講 Byte Pair Encoding。它原本是 1994 年的資料壓縮演算法，[Sennrich 等人 2016](https://aclanthology.org/P16-1162/) 把它用在翻譯：

1. 詞表從所有字元開始（加一個詞尾符號）
2. 反覆統計相鄰 token 對的出現次數，把最常見的一對合併成新 token
3. 詞表到達目標大小就停

切新文字時，第 14 頁的做法是先依空白切開，再反覆貪婪找出詞表裡最長的前綴。課程附了一份 [tokenization notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/tokenization/tokenization.ipynb) 可以跟著跑。

### VOLT：詞表大小怎麼選

第 17–26 頁是 L08 最有份量的一段，內容來自 [VOLT（Xu, Zhou, Gan, Zheng, Li, ACL 2021）](https://aclanthology.org/2021.acl-long.571/)，講者 Lei Li 是作者之一。

問題是（第 18 頁）：1k、10k、30k 的詞表，哪個翻譯效果最好？老實的做法是每個大小都完整訓練、測試一遍，太貴。

VOLT 的思路分三步：

- **量價值**：第 19 頁定義正規化熵，也就是 token 分布的熵除以 token 平均字元數，意思是每個字元承載的語意資訊。越小越好，歧義少、好生成
- **量效益**：第 20 頁定義 MUV，詞表每多 m 個 token，正規化熵下降多少，再除以 m。它回答的是「每加一個 token 值不值得」
- **求解**：第 21–22 頁說 MUV 最大的點通常對應最好的 BLEU，在三分之二的任務上兩者相關；第 23–25 頁把最大化 MUV 的問題換成最大化下界，化成熵正則化的最佳傳輸問題，用 Sinkhorn 演算法解

第 26 頁補充編碼方式：先切成字元，只要合併後的 token 在詞表裡就合併，直到不能再合併。

### 實務上的四件事

第 28–35 頁轉到 LLM 的實務：

- **去重**（第 29 頁）：LLaMA 3 在 URL、文件（minHash）、行（每 3,000 萬份文件做 64-bit SHA-1）三個層級去重，另外過濾單行 n-gram 重複、髒字計數、token 分布跟整體語料差太多的文件
- **SentencePiece 與 byte-level BPE**（第 30 頁）：BBPE 把文字當成 Unicode 位元組序列，所以對所有語言都通用；[SentencePiece](https://aclanthology.org/D18-2012/) 直接處理原始句子，把空白換成 ▁（U+2581）再做 BPE；WordPiece 則改用條件機率決定合併
- **程式碼與數字**（第 31–32 頁）：用正規表示式先切（例如讓 `.append` 成為一個 token），數字則介紹 xVal 這類連續數值表示
- **多語詞表**（第 33–34 頁）：LLaMA 2 的 32k 詞表到 LLaMA 3.1 擴成 128k，其中 100k 來自 OpenAI 的 tiktoken，28k 分給多語

### 詞表共享與 over-tokenization

第 37–42 頁引用 Yuan 等人（ACL 2024）對 LLaMA 詞表共享的研究：用 1 萬筆雙語資料微調 LLaMA-7B 的 embedding，各語言的反應分成四個象限。其中「停滯」象限（高棉文、寮文、古吉拉特文、泰盧固文）雙語和多語都沒進步，原因之一是 over-tokenization：byte-level BPE 產生的序列比字元數還長。第 41 頁的例子是「饕」這個字被切成三個 token。

這一頁對中文讀者有直接意義：同一句話，token 越多，推論越慢、越貴，context window 也越快用完。

L08 第 43 頁提到不用 tokenizer 的 Byte Latent Transformer，只放了論文標題，沒有展開。

## L09：把 token 吐出來

### Greedy、取樣與 beam search

L09 第 4 頁先說明，窮舉所有序列找最大機率是 O(V^N)，不可能。所以有三條路：

- **Greedy**（第 5–6 頁）：每步選機率最大的 token。因為只要取最大，比 logits 就夠了，不用做 softmax 正規化
- **取樣**（第 7–10 頁）：從分布裡抽。第 8 頁比較抽 n 次、k 個類別的三種做法：直接抽 O(nk)、二分搜尋 O(k + n log k)、alias sampling O(k log k + n)。第 9–10 頁介紹 Gumbel-max trick：對 logits 加上 Gumbel 雜訊再取 argmax，等同於從 softmax 分布抽樣，所以可以省掉 softmax，並附一段預先產生雜訊的 PyTorch 程式
- **Beam search**（第 12–16 頁）：每步保留 k 條最好的部分序列，第 14 頁附虛擬碼，第 15 頁列三種剪枝規則，第 16 頁提到先取樣前幾個 token 再接 beam search，可以增加多樣性

這些都有 [decoding notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/decoding/decoding.ipynb)，Syllabus 也把 2/13 的 Recitation 4 排成解碼。

### Speculative decoding

第 20 頁點出問題：自回歸解碼一次只能生一個 token，每個 token 可能要數百毫秒。

第 22–34 頁用逐步動畫說明解法：

1. 小的 **draft 模型**先連續生成 N 個候選 token
2. 大的 **target 模型**對每個位置算出自己的分布；只要候選 token 落在 target 模型的 top-k 預測裡，就接受（第 31–32 頁）
3. 一旦有 token 被拒，target 模型從最後一個被接受的位置接手，自己生成（第 33–34 頁）

為什麼快？第 35–37 頁的解釋是：自回歸生成 N 個 token 要跑 N 次前向；驗證 N 個 token 時，因為有 causal attention，**一次前向**就能算出所有位置的機率。驗證比生成便宜。

第 41–42 頁是調參的取捨：

- N 大，理論加速多；但被拒的機率高、被拒的代價大、要算更多次整個詞表的 softmax（可能卡記憶體），在聊天這類即時應用裡停頓也更長。常見選擇是 N = 4 或 8
- draft 和 target 對齊得越好，被拒率越低；一被拒，加速就被抵消。常見做法是從同一個模型家族挑一大一小

投影片用的是 top-k 驗收。示意圖引自 [Xia 等人 2024 年的 survey](https://aclanthology.org/2024.findings-acl.456/)，第 39–40 頁的品質與速度結果引自同一位第一作者的 [EMNLP 2023 Findings 論文](https://aclanthology.org/2023.findings-emnlp.257/)。survey 第 6 節把驗收策略分成 greedy decoding、speculative sampling 與 token tree verification 三類，想比較不同規則可以從那裡開始。

### EAGLE：不猜 token，猜特徵

第 44–51 頁介紹 [EAGLE](https://arxiv.org/abs/2401.15077)：

- 觀察（第 44 頁）：預測大模型下一步的最後一層特徵，比直接預測下一個 token 容易
- 做法（第 45–46 頁）：沿用原模型的 embedding 與 LM head，只加一層 Transformer 當 draft，輸入是 token embedding 加上最後一層特徵。要加 token embedding 是因為取樣到哪個 token 會大幅影響下一步的特徵
- 實作（第 47 頁）：多條候選攤平成一條輸入，配上樹狀的 attention mask，一次驗證整棵候選樹
- 訓練（第 48–49 頁）：特徵用 smooth L1 loss，token 分布用 cross-entropy
- 第 51 頁提到 EAGLE-2 會剪掉低信心的分支，EAGLE-3 擴大訓練資料

課程附了 [speculative decoding notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/speculative_decoding/Speculative_decoding_demo.ipynb) 和 [EAGLE demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/speculative_decoding/EAGLE)。

## 跟作業的關係

[HW3](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture) 的翻譯管線要你實作 `generate`，作業頁指定用 argmax 解碼、逐句生成、不做 batch。讀完 L09 你會知道這是最慢也最簡單的版本；後面[服務篇](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)才會處理怎麼同時服務很多請求。

## 延伸閱讀

- [CS336 Lecture 1：從位元組到 tokenizer](/posts/ai/2026-08-22-cs336-overview-tokenization)：從零實作 BPE tokenizer
- [CS336 Lecture 10：LLM 推論](/posts/ai/2026-08-22-cs336-inference)：從記憶體頻寬的角度看 speculative decoding
- [CS224N 第 7 講：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)
- [CME295 第 1 講：從切字到 Transformer](/posts/ai/2026-09-29-cme295-transformer)

## 自學建議

1. 先跑 tokenization notebook，親手讓 BPE 合併幾輪，再讀 VOLT 論文的 MUV 定義
2. 開一個 tokenizer demo（投影片第 35 頁列了兩個），貼一段中文和一段英文，比較 token 數
3. 跑 decoding notebook，比較 greedy 與 beam search 的輸出
4. 跑 speculative decoding notebook，試著改 N，看接受率和速度怎麼變

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 11-868 LLM Systems，2026 春季課程首頁](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L08 Tokenization and Embedding 投影片（PDF）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-08-tokenization-594dd043d7a87d8dcc91b7e7585a0e34.pdf)
- [L09 Decoding 投影片（PDF）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-09-decoding-cac2cd9402765ff5e6c24f7baffd321c.pdf)
- [Sennrich et al., Neural Machine Translation of Rare Words with Subword Units（ACL 2016）](https://aclanthology.org/P16-1162/)
- [Kudo & Richardson, SentencePiece（EMNLP 2018 Demo）](https://aclanthology.org/D18-2012/)
- [Xu et al., Vocabulary Learning via Optimal Transport for Neural Machine Translation（VOLT，ACL 2021）](https://aclanthology.org/2021.acl-long.571/)
- [Xia et al., Speculative Decoding: Exploiting Speculative Execution for Accelerating Seq2seq Generation（EMNLP 2023 Findings）](https://aclanthology.org/2023.findings-emnlp.257/)
- [Xia et al., Unlocking Efficiency in Large Language Model Inference: A Comprehensive Survey of Speculative Decoding（ACL 2024 Findings）](https://aclanthology.org/2024.findings-acl.456/)
- [Li et al., EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty（2024）](https://arxiv.org/abs/2401.15077)
- [llmsys_code_examples（課程範例程式）](https://github.com/llmsystem/llmsys_code_examples)
