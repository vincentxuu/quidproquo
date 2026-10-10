---
title: "台大 ADL 2025 第 9 講：NLG 的解碼、生成控制與評估"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, decoding, llm-evaluation]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 12
tldr: "ADL Fall 2025 第 9 講回答兩個問題：模型每一步給出一個機率分布，要怎麼從裡面挑字？挑出來的句子又要怎麼評？講義先用 teacher forcing 與 exposure bias 說明訓練和生成的落差，再依序比較 greedy、beam search、sampling、top-k 與 nucleus sampling，把 temperature 與各種 penalty 歸類為「控制」而不是解碼演算法；評估一半講 BLEU、ROUGE、perplexity 與 LLM-Eval，另一半講為什麼要用 RL 直接優化整句的品質。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）10/27 的 NLG Decoding 與 NLG Evaluation 兩份講義與影片 9.1–9.5：conditional LM、teacher forcing、exposure bias、scheduled sampling、greedy／beam／sampling／top-k／nucleus、temperature、repetition／frequency／presence penalty、BLEU、ROUGE、perplexity、LLM-Eval，以及 RL for NLG 與 RLHF。"
draft: false
glossary:
  - term: "exposure bias"
    aliases: ["曝光偏差"]
    definition: "訓練時解碼器每一步都吃正確答案（teacher forcing），生成時卻吃自己上一步的輸出；模型從沒在訓練中看過自己犯錯後的狀態，所以一步錯就可能步步錯。"
    context: "講義第 10–11 頁用「一步錯，步步錯」說明。"
  - term: "nucleus sampling"
    aliases: ["top-p sampling", "top-p"]
    definition: "只從累積機率達到門檻 p 的最小候選詞集合裡抽樣；分布尖時集合小，分布平時集合大，等於動態調整 top-k 的 k。"
    context: "講義第 33 頁引 Holtzman 等人的 The Curious Case of Neural Text Degeneration。"
  - term: "perplexity"
    aliases: ["困惑度"]
    definition: "語言模型預測一組測試句子時的困惑程度，等於測試集機率的倒數再依字數正規化；越低代表模型越會預測沒看過的句子。"
    context: "講義第 9 頁強調它評的是生成模型本身，不是某一句輸出。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 12 篇。ADL Fall 2025（114-1，2025/09/01–12/15）在期中考週之後的 10/27 上這一講，[課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)把這一週標為線上（Virtual）。

**本文依據**：兩份講義 [NLG Decoding（251027_NLG.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLG.pdf)（41 頁）與 [NLG Evaluation（251027_NLGEval.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf)（22 頁），以及五支影片：[9.1 Natural Language Generation 語言生成的詳細策略](https://youtu.be/1d9WhPS6gv8)（28:20）、[9.2 Decoding Algorithms 如何控制每次輸出哪個 Token 呢?](https://youtu.be/agHrC93u7w8)（28:34）、[9.3 Generation Control 控制輸出內容的特性](https://youtu.be/Jxg6MLpgKPM)（17:57）、[9.4 NLG Evaluation 評估語言生成的結果](https://youtu.be/gAsEAga1icM)（32:41）、[9.5 RL for NLG 進一步提升語言生成結果](https://youtu.be/Ly67whCaS4M)（15:27）。講義於 2026-09-30 打開核對，本文頁碼都指講義 PDF。

> **版本提醒**：講義封面寫 October 27th, 2025；五支影片在 2025/10/27 上傳到 Fall 2025 播放清單，但說明欄標的日期是 2023/10/26，9.1–9.3 還註明投影片取材自李宏毅老師。本文沒有逐頁比對影片畫面與 2025 講義，兩者有出入時以講義為準。

**系列位置**：上一篇 [RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)｜下一篇 [偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

前面幾講都在教模型怎麼學會「下一個詞的機率分布」。這一講處理的是模型訓練好以後的事：分布拿到手，**到底要輸出哪個詞**？輸出的一整段文字，**又要怎麼判斷好壞**？

這一講沒有對應的作業，[存取分級](/posts/ai/2026-09-30-ntu-adl2025-course-overview)沿用系列的 A2：講義與影片都公開，這一講本身沒有缺口。同一週的助教課 LLM Inference & Evaluation 放在本系列的[助教課篇](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=1d9WhPS6gv8
title: ADL 9.1: Natural Language Generation 語言生成的詳細策略（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=agHrC93u7w8
title: ADL 9.2: Decoding Algorithms 如何控制每次輸出哪個 Token 呢?（YouTube）
```

原始影片：[ADL 9.1: Natural Language Generation 語言生成的詳細策略（YouTube）](https://www.youtube.com/watch?v=1d9WhPS6gv8)、[ADL 9.2: Decoding Algorithms 如何控制每次輸出哪個 Token 呢?（YouTube）](https://www.youtube.com/watch?v=agHrC93u7w8)、[ADL 9.3: Generation Control 控制輸出內容的特性（YouTube）](https://www.youtube.com/watch?v=Jxg6MLpgKPM)、[ADL 9.4: NLG Evaluation 評估語言生成的結果（YouTube）](https://www.youtube.com/watch?v=gAsEAga1icM)、[ADL 9.5: RL for NLG 進一步提升語言生成結果（YouTube）](https://www.youtube.com/watch?v=Ly67whCaS4M)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：9.1 與 9.2 兩支都讀了字幕。9.1：NLG 任務、conditional LM、teacher forcing、exposure bias 與「一步錯，步步錯」、scheduled sampling（含 image captioning 實驗）、LLM 因資料量大而不用 scheduled sampling；9.2：greedy 非全域最佳、beam search 與 beam size 取捨（含 What do you do for a living? 的例子）、sampling 的長尾問題與 white rabbit 例子、top-k、nucleus sampling 的動態集合、temperature 不是解碼演算法、不能把整個機率分布當下一步輸入（高興想笑／難過想哭），皆與文章相符，沒有需要更正的影片說法。確認文章「版本提醒」所述：兩支影片上傳於 2025-10-27，說明欄日期為 2023/10/26 並註明投影片取材自李宏毅老師。9.3–9.5 未嵌入，未核對；BLEU、ROUGE、perplexity、LLM-Eval 與 RL for NLG 的段落依據的是講義。

## 從語言模型到 conditional LM

講義第 3 頁先列出含有生成的任務：機器翻譯、抽象式摘要、對話、看圖說故事、創意寫作。第 4–7 頁把它們統一成同一個問題。

- **語言模型**：給定目前為止的詞，預測下一個詞，也就是 P(y_i | y_1, …, y_{i−1})。RNN-LM 用 RNN 建模這個分布，GPT 用 Transformer。
- **Conditional LM**：多一個輸入 x，預測 P(y_i | y_1, …, y_{i−1}, x)。翻譯的 x 是原文，摘要的 x 是文章，對話的 x 是前文，看圖說故事的 x 是圖片。

第 7 頁補一句：encoder-decoder 或 decoder-only 架構都能做到「以 x 為條件」。這個框架跟[第 3 篇的語言模型](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)是同一件事，只是多了條件。

## 訓練與生成的落差：exposure bias

**Teacher forcing**（第 8 頁）：訓練時不管模型上一步預測了什麼，都把正確答案餵給解碼器當下一步的輸入。這讓訓練穩定，但講義立刻點出問題：訓練與測試不一致。

第 9–11 頁用只有 A、B 兩個字的小例子說明：

- 訓練時，每一步的輸入都是參考答案，loss 是每個詞的 cross-entropy 加總。
- 生成時，參考答案不存在，模型上一步的輸出就是下一步的輸入。

模型在訓練中從沒看過「自己出錯之後」的狀態。講義把這叫 **exposure bias**，中文標語是「一步錯，步步錯」：一旦某一步偏了，後面走進的是從未探索過的路徑，結果可能整句都錯。

**Scheduled sampling**（第 12–13 頁，Bengio 等人 2015）的解法是訓練時隨機決定下一步的輸入來自參考答案還是模型自己。講義引的 MSCOCO 看圖說故事結果裡，混合的做法比「永遠用參考答案」和「永遠用模型輸出」都好。

第 14 頁接著說：**LLM 訓練不用 scheduled sampling**。講義給的理由是 LLM 的預訓練資料量夠大，本身就探索了多得多的路徑。

## 五種解碼演算法

第 16 頁定義：有了訓練好的（conditional）LM，**解碼演算法**決定怎麼從它產生文字。講義用同一段開頭（Dwight 起床、下樓、吃早餐、看報紙上的填字遊戲）比較每種方法接出來的句子，讀起來很直觀。

| 方法 | 做法 | 講義指出的問題 |
|---|---|---|
| Greedy（第 17–19 頁） | 每步取機率最高的詞（argmax） | 不能回頭；沒走的路可能整體機率更高。例子接出來的是「The headline read: "The New York Times."」反覆三次 |
| Beam search（第 20–23 頁） | 每步保留 k 條最可能的序列 | beam 小容易不通順；beam 大比較通順但昂貴，閒聊對話會變成安全又空洞的回答。例子接出一長串「New York」 |
| Sampling（第 26–28 頁） | 依機率分布隨機抽，不取 argmax | 長尾裡有大量低機率詞，品質在那裡變差。例子接出「how happy has white rabbit been?」這種句子 |
| Top-k（第 29–32 頁） | 只在機率最高的 k 個詞裡抽 | k=1 就是 greedy、k=V 就是純 sampling；分布很尖時 k 太大會抽到離譜的詞，分布很平時 k 太小會太保守 |
| Nucleus／top-p（第 33–34 頁） | 從累積機率最高的一小撮詞裡抽 | 講義的定位是動態伸縮的 top-k |

Beam size 的取捨在第 22 頁有個好例子：對一句「我主要吃生食，所以省了不少菜錢」，beam size 1 回「I love to eat healthy and eat healthy」，beam size 越大越常出現「What do you do for a living?」。講義的結論是**合適的 beam size 不容易找**。

### 為什麼「取最大機率」行不通

第 24–25 頁是這一講的關鍵轉折。人寫的文字，每一步的機率有很多尖峰；機器用最大化解碼寫出來的文字，機率又高又平。講義給了三個理由：

1. 成功的語言模型都重度依賴 attention，而 attention 容易學會放大重複的傾向。
2. 在熵很高的時間點（很多詞都說得通的時候）最大化本身就有問題，跟模型好壞無關。
3. 人說話不是在最大化機率，而是在達成目標（講義引 Goodman 2016）。

所以要引入隨機性，而 top-k 與 nucleus 是在「多樣」與「安全」之間找平衡。第 29 頁把這個平衡稱為一個重要的研究方向。

## 生成控制：temperature 與 penalty

第 35 頁起換一個角度：鼓勵想要的、懲罰不想要的。

**Temperature**（第 36 頁）在 softmax 上套一個溫度超參數 τ。溫度高，分布變平，輸出更多樣；溫度低，分布變尖，輸出更集中。講義特別強調：**temperature 不是解碼演算法**，它是搭配任何解碼演算法、在測試時控制多樣性的手段。

**Penalty**（第 37–38 頁）：

- Repetition penalty：壓低重複。第 38 頁再把它細分成下面兩種。
- Frequency penalty：避免同一個詞重複太多次。
- Presence penalty：鼓勵換用不同的詞。

第 40 頁補了一個容易被忽略的細節：如果把上一步的**整個機率分布**當成下一步輸入，而不是挑出一個詞，模型可能在「高興想笑」和「難過想哭」之間混出「高興想哭」。講義的結論是分布輸入不見得適合 NLG。

<details>
<summary>在 API 裡對應到哪些參數</summary>

講義沒有提到任何特定 API。不過如果你用過 LLM 服務，第 36–38 頁講的 temperature、frequency penalty、presence penalty 就是常見的推論參數名稱；top-k 與 top-p 也常以同樣的名字出現。這一講的價值在於告訴你每個旋鈕背後在改分布的哪一部分。

</details>

## NLG 評估：評輸出，還是評模型

[NLG Evaluation 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf)第 2 頁把自動指標分兩類，並先定調：這些指標評的是**輸出的結果**，不是生成模型本身。

- **詞重疊指標**：BLEU、ROUGE、METEOR。翻譯勉強可用，摘要更差，對話與說故事這種越開放的任務越糟。
- **Embedding 指標**：比較詞向量的相似度，比較能彈性地抓到語意。

### BLEU 與 ROUGE

第 3–5 頁的對照：

| | BLEU | ROUGE |
|---|---|---|
| 基礎 | n-gram 重疊 | n-gram 重疊 |
| 看重 | precision | recall |
| 回報方式 | 一個數字（結合 n = 1–4） | 每種 n-gram 分開回報：ROUGE-1、ROUGE-2、ROUGE-L（最長共同子序列） |
| 常見場景 | 機器翻譯 | 摘要 |

<details>
<summary>BLEU 的組成（依講義第 3 頁）</summary>

- n-gram precision p_n：輸出裡每個 n-gram 的出現次數，截斷到它在任一參考句中出現的最高次數，再除以輸出的 n-gram 總數。
- Brevity penalty B：輸出比參考短時，B = e^(1 − ref/hyp)，否則 B = 1。避免模型只輸出幾個穩妥的詞來刷 precision。
- BLEU = B × exp((1/N) Σ log p_n)，也就是 n-gram precision 的幾何平均再乘上長度懲罰。

</details>

第 7 頁放了一張圖：在對話品質上，自動分數和人類分數**沒有一致性**。所以第 8 頁建議改評單一面向：流暢度（用訓練好的 LM 算機率）、風格（用目標語料訓練的 LM）、多樣性（罕見詞與 n-gram 的獨特性）、與輸入的相關性、長度與重複這種簡單指標，以及摘要的壓縮率這類任務專屬指標。

### Perplexity

第 9–10 頁：perplexity 衡量語言模型預測一句話時有多困惑，等於測試集機率的倒數再依字數正規化。越好的 LM 越能預測沒看過的測試集，perplexity 就越低。第 10 頁把它和 cross-entropy 連起來：它量的是真實分布與預測分布之間的距離。

跟 BLEU、ROUGE 不同，**perplexity 評的是機率生成模型本身**。第 22 頁的總結把這兩種叫 output evaluation 與 model evaluation。

### LLM-Eval

第 11–12 頁介紹 Yen-Ting Lin 與陳縕儂的 [LLM-Eval](https://arxiv.org/abs/2305.13711)（NLP4ConvAI 2023）：用 LLM 評開放領域對話的回應。講義的重點有兩個：LLM-Eval 的分數與人類評分的相關性比既有的所有指標都高；單輪與多輪對話都適用。所以 LLM-Eval 的分數可以當作人類評估的代理。

更完整的 LLM-as-judge 偏誤討論，站內有 [CME295 的 LLM 評估篇](/posts/ai/2026-09-29-cme295-llm-evaluation)。

## RL for NLG：直接優化整句

評估講義的後半回到訓練。第 14 頁的問題是：**每個詞的 cross-entropy 最小，不等於整句最好**。參考答案是「The dog is running fast」，模型輸出「The dog is is fast」，cross-entropy 只在錯的那一步罰它，但整句已經壞了。我們想優化的是整句層級的指標 R(y, ŷ)，可是這種指標不能直接做 gradient descent。

第 15–18 頁的答案是強化學習：把生成每個詞當成一個 action，前面的詞會影響下一步的 observation，整句生成完才拿到 reward（例如跟參考句比的分數）。講義引用 [Ranzato 等人的 Sequence Level Training](https://arxiv.org/abs/1511.06732)（ICLR 2016），並把 scheduled sampling 與 RL 放在同一張圖裡比較。

第 19 頁的摘要實驗值得記住：只用 RL 直接優化 ROUGE-L，自動分數比較高，**人類評分反而比較低**；MLE 加 RL 的混合做法最好。第 22 頁把它寫成一句建議：先 MLE、再 RL。

第 20–21 頁把這條線接到 ChatGPT 的 RLHF：reward 不再是 ROUGE，而是人給的分數，也就是讓 RL 去優化「人類滿意度」這種抽象指標。RLHF 的完整流程在本系列的[後訓練篇](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)。

## 自學怎麼用這一講

1. 先看 9.2 與 9.3，把第 17–34 頁五種解碼的例子句子對照著讀，這是這一講最好記的部分。
2. 用任何一個開源 LM，固定同一段 prompt，分別跑 greedy、beam、top-k、top-p，觀察重複與離題各出現在哪一種。
3. 再讀第 14 頁與第 19 頁，想清楚「每個詞都對」和「整句都好」為什麼不是同一件事。

今晚可以做的一件事：挑一個你常用的生成功能，寫下它現在用的 temperature 與 top-p，再用講義第 29 頁「多樣 vs 安全」的角度判斷這個設定是不是符合那個任務。

## 延伸閱讀

- [CS224N 第 11 講：Benchmark 與 LLM 評估為什麼會過期](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)：從 benchmark 的角度講評估。
- [CME295 第 8 講：用 LLM 評 LLM，先防三種偏誤](/posts/ai/2026-09-29-cme295-llm-evaluation)：LLM-as-judge 的細節。
- [CME295 第 5 講：RLHF 與 DPO](/posts/ai/2026-09-29-cme295-preference-tuning)：RL for NLG 的現代延伸。

上一篇：[RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)
下一篇：[偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：依字幕核對影片內容。確認 9.1、9.2 與文章相符；版本提醒（上傳 2025-10-27、說明欄 2023/10/26）屬實。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 10/27 課表列
- [NLG Decoding 講義（251027_NLG.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLG.pdf) — teacher forcing、exposure bias、五種解碼與生成控制
- [NLG Evaluation 講義（251027_NLGEval.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf) — BLEU、ROUGE、perplexity、LLM-Eval、RL for NLG
- [ADL 9.1: Natural Language Generation 語言生成的詳細策略（YouTube）](https://youtu.be/1d9WhPS6gv8)
- [ADL 9.2: Decoding Algorithms 如何控制每次輸出哪個 Token 呢?（YouTube）](https://youtu.be/agHrC93u7w8)
- [ADL 9.3: Generation Control 控制輸出內容的特性（YouTube）](https://youtu.be/Jxg6MLpgKPM)
- [ADL 9.4: NLG Evaluation 評估語言生成的結果（YouTube）](https://youtu.be/gAsEAga1icM)
- [ADL 9.5: RL for NLG 進一步提升語言生成結果（YouTube）](https://youtu.be/Ly67whCaS4M)
- [Bengio et al., Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks (2015)](https://arxiv.org/abs/1506.03099)
- [Holtzman et al., The Curious Case of Neural Text Degeneration (ICLR)](https://arxiv.org/abs/1904.09751)
- [Ranzato et al., Sequence Level Training with Recurrent Neural Networks (ICLR 2016)](https://arxiv.org/abs/1511.06732)
- [Lin & Chen, LLM-Eval: Unified Multi-Dimensional Automatic Evaluation for Open-Domain Conversations with Large Language Models (NLP4ConvAI 2023)](https://arxiv.org/abs/2305.13711)
