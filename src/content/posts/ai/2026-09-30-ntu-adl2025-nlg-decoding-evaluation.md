---
title: "NLG 的解碼、生成控制與評估｜台大陳縕儂 深度學習之應用 第 9 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, decoding, llm-evaluation]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 10
tldr: "ADL Fall 2025 第 9 堂回答兩個問題：模型每一步給出一個機率分布，要怎麼從裡面挑字？挑出來的句子又要怎麼評？講義先用 teacher forcing 與 exposure bias 說明訓練和生成的落差，再依序比較 greedy、beam search、sampling、top-k 與 nucleus sampling，把 temperature 與各種 penalty 歸類為「控制」而不是解碼演算法；評估一半講 BLEU、ROUGE、perplexity 與 LLM-Eval，另一半講為什麼要用 RL 直接對整句的品質做最佳化。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）10/27 的 NLG Decoding 與 NLG Evaluation 兩份講義與影片 9.1–9.5：conditional LM、teacher forcing、exposure bias、scheduled sampling、greedy／beam／sampling／top-k／nucleus、temperature、repetition／frequency／presence penalty、BLEU、ROUGE、perplexity、LLM-Eval，以及 RL for NLG 與 RLHF。附解碼、BLEU／ROUGE 與 perplexity 的手算例子和自我檢查。"
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
    context: "NLG Evaluation 講義第 9 頁強調它評的是生成模型本身，不是某一句輸出。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 9 堂。ADL Fall 2025（114-1，2025/09/01–12/15）在期中考週之後的 10/27 上這一堂，[課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)把這一週標為線上（Virtual）。

**本文依據**：兩份講義 [NLG Decoding（251027_NLG.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLG.pdf)（41 頁）與 [NLG Evaluation（251027_NLGEval.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf)（22 頁），以及五支影片：[9.1 Natural Language Generation 語言生成的詳細策略](https://youtu.be/1d9WhPS6gv8)（28:20）、[9.2 Decoding Algorithms 如何控制每次輸出哪個 Token 呢?](https://youtu.be/agHrC93u7w8)（28:34）、[9.3 Generation Control 控制輸出內容的特性](https://youtu.be/Jxg6MLpgKPM)（17:57）、[9.4 NLG Evaluation 評估語言生成的結果](https://youtu.be/gAsEAga1icM)（32:41）、[9.5 RL for NLG 進一步提升語言生成結果](https://youtu.be/Ly67whCaS4M)（15:27）。本文頁碼都指講義 PDF。

> **版本提醒**：講義封面寫 October 27th, 2025；五支影片在 2025/10/27 上傳到 Fall 2025 播放清單，但說明欄標的日期是 2023/10/26，其中 9.1、9.2、9.3、9.5 還註明投影片取材自李宏毅老師。影片裡提到的作業（用預訓練的 T5 練習解碼）是錄影那個學期的安排。本文沒有逐頁比對影片畫面與 2025 講義，兩者有出入時以講義為準。

**系列位置**：上一篇 [RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)｜下一篇 [偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

前面幾堂都在教模型怎麼學會「下一個詞的機率分布」。這一堂處理的是模型訓練好以後的事：分布拿到手，**到底要輸出哪個詞**？輸出的一整段文字，**又要怎麼判斷好壞**？

這一堂沒有對應的作業，[存取分級](/posts/ai/2026-09-30-ntu-adl2025-course-overview)沿用系列的 A2：講義與影片都公開，這一堂本身沒有缺口。同一週的助教課 LLM Inference & Evaluation 放在本系列的[助教課篇](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)。

讀完這一堂要能做四件事：說出 teacher forcing 造成的落差與它為什麼在 LLM 上不嚴重；對一個小例子分別用 greedy、beam search、top-k、nucleus 選詞；說出 temperature 改的是什麼、不改的是什麼；分清楚 BLEU／ROUGE 這類評輸出的指標和 perplexity 這種評模型的指標，並手算一次。標成「本文自編」的例子不是課堂內容。

## 從語言模型到 conditional LM

講義第 3 頁先列出含有生成的任務：機器翻譯、抽象式摘要、對話、圖片描述（image captioning）、創意寫作。第 4–7 頁把它們統一成同一個問題。

- **語言模型**：給定目前為止的詞，預測下一個詞，也就是 P(y_i | y_1, …, y_{i−1})。RNN-LM 用 RNN 建模這個分布，GPT 用 Transformer。
- **Conditional LM**：多一個輸入 x，預測 P(y_i | y_1, …, y_{i−1}, x)。翻譯的 x 是原文，摘要的 x 是文章，對話的 x 是前文，圖片描述的 x 是圖片。

第 7 頁補一句：encoder-decoder 或 decoder-only 架構都能做到「以 x 為條件」。老師補充，現在大家用的 prompting 也是 conditional LM：模型生成答案時，條件就是你給的 prompt。Encoder-only 的模型不在這裡，因為它看得到後面的詞，做不了生成。這個框架跟[第 3 堂的語言模型](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)是同一件事，只是多了條件。

## 訓練與生成的落差：exposure bias

**Teacher forcing**（第 8 頁）：訓練時不管模型上一步預測了什麼，都把正確答案餵給解碼器當下一步的輸入。這個做法很直覺，但講義立刻點出問題：訓練與測試不一致。

第 9–11 頁用只有 A、B 兩個字的小例子說明：

- 訓練時，每一步的輸入都是參考答案，loss 是每個詞的 cross-entropy 加總。
- 生成時，參考答案不存在，模型上一步的輸出就是下一步的輸入。

模型在訓練中從沒看過「自己出錯之後」的狀態。講義把這叫 **exposure bias**，中文標語是「一步錯，步步錯」：一旦某一步偏了，後面走進的是從未探索過的路徑，結果可能整句都錯。

**Scheduled sampling**（第 12–13 頁，Bengio 等人 2015）的解法是訓練時隨機決定下一步的輸入來自參考答案還是模型自己。老師說明了機率怎麼排：訓練初期模型還不會生成，應該多用參考答案；越到後期越多用模型自己的輸出，讓訓練接近測試的情況。所以用一個遞減的函數決定「這一步用參考答案的機率」，可以是線性、指數或反 sigmoid 的遞減。講義引的 MSCOCO 圖片描述結果裡，這樣混合的做法比「永遠用參考答案」好；「永遠用模型輸出」則差很多，老師的解釋是沒有老師教、一直拿自己還沒學好的輸出往下接，很難接得好。

第 14 頁接著說：**LLM 訓練不用 scheduled sampling**。講義給的理由是 LLM 的預訓練資料量夠大，本身就探索了多得多的路徑。老師說這是經驗上的結論：就算測試時走到一條沒見過的路，模型也能從看過的資料估出還不錯的下一步，exposure bias 仍會發生，但影響不大。她提醒，自己訓練小模型時，scheduled sampling 還是用得上。

## 五種解碼演算法

第 16 頁定義：有了訓練好的（conditional）LM，**解碼演算法**決定怎麼從它產生文字。講義用同一段開頭（Dwight 起床、下樓、做早餐、看報紙上的填字遊戲）比較每種方法接出來的句子，讀起來很直觀。

| 方法 | 做法 | 講義指出的問題 |
|---|---|---|
| Greedy（第 17–19 頁） | 每步取機率最高的詞（argmax） | 不能回頭；沒走的路可能整體機率更高。例子接出來的是「The headline read: "The New York Times."」幾乎原樣重複三次（第三次的動詞換成 said） |
| Beam search（第 20–23 頁） | 每步保留 k 條最可能的序列 | beam 小容易不通順；beam 大比較通順但昂貴，閒聊對話會變成安全又空洞的回答。例子接出一長串「New York」 |
| Sampling（第 26–28 頁） | 依機率分布隨機抽，不取 argmax | 長尾裡有大量低機率詞，品質在那裡變差。例子接出「how happy has white rabbit been?」這種句子 |
| Top-k（第 29–32 頁） | 只在機率最高的 k 個詞裡抽 | k=1 就是 greedy、k=V 就是純 sampling；分布很尖時 k 太大會抽到離譜的詞，分布很平時 k 太小會太保守 |
| Nucleus／top-p（第 33–34 頁） | 從累積機率最高的一小撮詞裡抽 | 講義的定位是動態伸縮的 top-k |

### 用數字比較 greedy 與 beam search（本文自編）

詞彙表只有 A、B 兩個詞，生成兩步。模型給的機率是：

| 已生成 | 下一個是 A | 下一個是 B |
|---|---|---|
| （開頭） | 0.6 | 0.4 |
| A | 0.55 | 0.45 |
| B | 0.1 | 0.9 |

- **Greedy**：第一步取 A（0.6），第二步取 A（0.55），得到 AA，整句機率 0.6 × 0.55 = 0.33。
- **四條路徑的整句機率**：AA 0.33、AB 0.27、BA 0.04、BB 0.36。最高的是 BB，greedy 沒有走到。
- **Beam search，k = 2**：第一步把 A、B 都留著。第二步展開成四條，留下機率最高的兩條 BB（0.36）與 AA（0.33），最後輸出 BB。

Greedy 第一步選了當下比較高的 A，就再也回不到 B 那條路。真實的詞彙表如果有一萬個詞，生成十個詞就有一萬的十次方條路徑，不可能全部檢查，所以 beam search 也只是多追蹤幾條。

Beam size 的取捨在第 22 頁有個好例子：對一句「我主要吃生食，所以省了不少菜錢」，beam size 1 回「I love to eat healthy and eat healthy」，beam size 越大越常出現「What do you do for a living?」。講義的結論是**合適的 beam size 不容易找**。

### 為什麼「取最大機率」行不通

第 24–25 頁是這一堂的關鍵轉折。人寫的文字，每一步的機率有很多尖峰；機器用最大化解碼寫出來的文字，機率又高又平。講義給了三個理由：

1. 成功的語言模型都重度依賴 attention，而 attention 容易學會放大重複的傾向。
2. 在熵很高的時間點（很多詞都說得通的時候）最大化本身就有問題，跟模型好壞無關。
3. 人說話不是在最大化機率，而是在達成目標（講義引 Goodman 2016）。

所以要引入隨機性，而 top-k 與 nucleus 是在「多樣」與「安全」之間找平衡。

純 sampling 的問題出在長尾：詞彙表很大，機率很低的詞加起來數量很多，一旦抽到一個罕見詞，後面的內容就得接著它寫下去。老師拿自己名字裡的「縕」字當例子：抽到這個字，很難再接出通順的句子。

Top-k 用固定的 k，老師用兩句話說明它為什麼不夠：

- 「I ate the pizza while it was still ＿」：幾乎只會接 hot 或 warm，分布很窄。k 設大了，會把不合理的詞也放進來抽。
- 「She said I never ＿」：能接的詞很多，分布很平。k 設小了，只剩幾個最普通的詞。

Nucleus sampling 改成固定機率：把詞依機率由高到低累加，加到達到 p 為止，只在這一小群裡抽。分布窄時這一群很小，分布平時這一群自動變大。

**算一次（本文自編）。** 取 p = 0.85。

- 窄的分布：hot 0.6、warm 0.3、cold 0.05、其他詞合計 0.05。hot 是 0.6，還不到 0.85；加上 warm 是 0.9，達到了，候選只有 hot 和 warm 兩個。如果用 top-k、k = 4，cold 和另一個更冷門的詞也會進來。
- 平的分布：有 10 個詞各是 0.09，其他詞合計 0.1。累加 9 個詞是 0.81，還不到；加到第 10 個是 0.9，候選有 10 個。如果用 top-k、k = 4，只剩 4 個。

## 生成控制：temperature 與 penalty

第 35 頁起換一個角度：鼓勵想要的、懲罰不想要的。

**Temperature**（第 36 頁）在 softmax 上套一個溫度超參數 τ。溫度高，分布變平，輸出更多樣；溫度低，分布變尖，輸出更集中。講義特別強調：**temperature 不是解碼演算法**，它是搭配任何解碼演算法、在測試時控制多樣性的手段。老師補了一句：如果後面接的是 greedy，調 temperature 沒有意義，因為最高分的還是同一個詞。

**算一次（本文自編）。** 三個詞的分數是 (2, 1, 0)：

| τ | 機率 |
|---|---|
| 0.5 | (0.867, 0.117, 0.016) |
| 1 | (0.665, 0.245, 0.090) |
| 2 | (0.506, 0.307, 0.186) |

三種設定下排名都沒有變，變的是差距。想要有創意的文案就調高，想要每次結果差不多就調低。

**Penalty**（第 37–38 頁）：

- Repetition penalty：壓低重複。第 38 頁再把它細分成下面兩種。
- Frequency penalty：避免同一個詞重複太多次。
- Presence penalty：鼓勵換用不同的詞。

老師解釋重複為什麼常見：輸入屬於某個主題時，和主題相關的詞機率都被拉高，就容易一再被抽出來。兩種 penalty 的目標相同，方向相反。frequency penalty 依一個詞已經出現的次數壓低它，出現一兩次還好，越多次壓得越重。presence penalty 看的是有沒有出現過，把還沒出現過的詞往上提。

第 40 頁補了一個容易被忽略的細節：如果把上一步的**整個機率分布**當成下一步輸入，而不是挑出一個詞，模型可能在「高興想笑」和「難過想哭」之間混出「高興想哭」。講義的結論是分布輸入不見得適合 NLG。

<details>
<summary>在 API 裡對應到哪些參數</summary>

講義第 39 頁放了 OpenAI Playground 的截圖。老師對照著說：Temperature 預設 1，等於原本的 softmax；Top P 預設 1。截圖上 Frequency penalty 與 Presence penalty 的值都是 0。第 36–38 頁講的幾個量，就是這個畫面上可以調的參數。這一堂的價值在於告訴你每個旋鈕背後在改分布的哪一部分。

</details>

## NLG 評估：評輸出，還是評模型

[NLG Evaluation 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf)第 2 頁把自動指標分兩類，並先定調：這些指標評的是**輸出的結果**，不是生成模型本身。

- **詞重疊指標**：BLEU、ROUGE、METEOR。用在翻譯都不算理想，摘要更差，對話與說故事這種越開放的任務越糟。
- **Embedding 指標**：比較詞向量的相似度，比較能彈性地抓到語意。老師舉的做法是把兩個句子各自丟進 BERT，比較得到的向量接不接近。

這兩類的共同弱點是都把參考答案當成唯一的標準。老師的說法是：摘要和專家寫的不一樣，不代表它不好；對話更是任何合理的回應都可以。和參考答案不像，不代表差；很像，也不代表好。

### BLEU 與 ROUGE

第 3–5 頁的對照：

| | BLEU | ROUGE |
|---|---|---|
| 基礎 | n-gram 重疊 | n-gram 重疊 |
| 看重 | precision | recall |
| 回報方式 | 一個數字（結合 n = 1–4） | 每種 n-gram 分開回報：ROUGE-1、ROUGE-2、ROUGE-L（最長共同子序列） |
| 常用在 | 機器翻譯 | 摘要 |

<details>
<summary>BLEU 的組成（依講義第 3 頁）</summary>

- n-gram precision p_n：輸出裡每個 n-gram 的出現次數，截斷到它在任一參考句中出現的最高次數，再除以輸出的 n-gram 總數。
- Brevity penalty B：輸出比參考短時，B = e^(1 − ref/hyp)，否則 B = 1。（用意是不讓模型靠只輸出幾個穩妥的詞來拉高 precision；這句是本文補充，不在講義上。）
- BLEU = B × exp((1/N) Σ log p_n)，也就是 n-gram precision 的幾何平均再乘上長度懲罰。講義第 3 頁印的式子裡沒有 log，這裡寫的是標準定義。

</details>

**手算一次（本文自編）。** 參考句是「the cat is on the mat」（6 個詞），模型輸出「the cat sat on mat」（5 個詞）。

- 重疊的 unigram：the、cat、on、mat，共 4 個。
- Unigram precision（BLEU 用的方向）：4 ÷ 5 = 0.8，分母是輸出的長度。
- ROUGE-1（recall）：4 ÷ 6 ≈ 0.67，分母是參考句的長度。
- Bigram：輸出有 the cat、cat sat、sat on、on mat 四個，只有 the cat 出現在參考句裡。precision 是 1 ÷ 4 = 0.25；參考句有 5 個 bigram，ROUGE-2 是 1 ÷ 5 = 0.2。
- 輸出比參考句短，brevity penalty 是 e^(1 − 6/5) ≈ 0.82。
- 完整的 BLEU 取 n = 1 到 4。這組句子沒有任何重疊的 trigram 或 4-gram，所以 BLEU 是 0。短句很容易這樣，BLEU 通常是對整個測試集算的。

同一個輸出，precision 是 0.8、recall 是 0.67。它每個詞大多有憑有據，但漏了參考句裡的東西。

第 7 頁放了一張圖：在對話品質上，自動分數和人類分數**沒有一致性**。老師補充了圖的另一半：有人懷疑是人的評分本身太雜亂，但把同一批資料交給兩組不同的人評，兩組的分數是正相關的。人和人之間有共識，自動指標卻反映不出來。所以後來的論文除了自動指標，還會加上請真人評分的 user study。

第 8 頁建議改評單一面向：流暢度（用訓練好的 LM 算機率）、風格（用目標語料訓練的 LM）、多樣性（罕見詞與 n-gram 的獨特性）、與輸入的相關性、長度與重複這種簡單指標，以及摘要的壓縮率這類任務專屬指標。

### Perplexity

第 9–10 頁：perplexity 衡量語言模型預測一句話時有多困惑，等於測試集機率的倒數再依字數正規化。越好的 LM 越能預測沒看過的測試集，perplexity 就越低。第 10 頁把它和 cross-entropy 連起來：它量的是真實分布與預測分布之間的距離。

**算一次（本文自編）。** 測試句有 3 個 token，模型依序給它們的機率是 0.5、0.25、0.125。整句機率是 1/64。Perplexity 是 (1/64)^(−1/3) = 4。換成 cross-entropy：三個 token 的 −log₂ 是 1、2、3，平均 2 bits，2² 也是 4。直覺上，這個模型平均每一步像是在 4 個選項裡猜。

跟 BLEU、ROUGE 不同，**perplexity 評的是機率生成模型本身**，而且是越低越好。做法是不讓模型生成，直接算它對測試集裡真實句子給了多高的機率。第 22 頁的總結把這兩種叫 output evaluation 與 model evaluation。

### LLM-Eval

第 11–12 頁介紹 Yen-Ting Lin 與陳縕儂的 [LLM-Eval](https://arxiv.org/abs/2305.13711)（NLP4ConvAI 2023）：用 LLM 評開放領域對話的回應。講義的重點有兩個：LLM-Eval 的分數與人類評分的相關性比既有的所有指標都高；單輪與多輪對話都適用。所以 LLM-Eval 的分數可以當作人類評估的代理。「比既有的所有指標都高」是講義的結論；老師對著表格口頭說的是，大部分比較高、和真人相關性比較高的分數，都是 LLM 給的。老師另外補了兩個觀察：請 LLM 給 0–5 分或 0–100 分，結果會有一點差別；在對話這個任務上，有沒有給它看真人的參考回應，差異不大。她也說它不是完美的，只是比以前的自動指標更接近人的看法。

更完整的 LLM-as-judge 偏誤討論，站內有 [CME295 的 LLM 評估篇](/posts/ai/2026-09-29-cme295-llm-evaluation)。

## RL for NLG：直接對整句做最佳化

評估講義的後半回到訓練。第 14 頁的問題是：**每個詞的 cross-entropy 最小，不等於整句最好**。參考答案是「The dog is running fast」，模型輸出「The dog is is fast」，cross-entropy 只在錯的那一步罰它，但整句已經壞了。我們想最佳化的是整句層級的指標 R(y, ŷ)，可是這種指標不能直接做 gradient descent。

老師用射擊遊戲解釋強化學習的設定：每一步看到畫面、選一個動作，當下不一定知道這個動作好不好，打掉外星人才拿到分數；下圍棋更極端，要到最後才知道輸贏。

第 15–18 頁的答案是強化學習：把生成每個詞當成一個 action，前面的詞會影響下一步的 observation，整句生成完才拿到 reward（例如跟參考句比的分數）。講義引用 [Ranzato 等人的 Sequence Level Training](https://arxiv.org/abs/1511.06732)（ICLR 2016），並把 scheduled sampling 與 RL 放在同一張圖裡比較。

第 19 頁的摘要實驗值得記住：只用 RL 直接最佳化 ROUGE-L，自動分數比較高，**人類評分反而比較低**；MLE 加 RL 的混合做法最好。第 22 頁把它寫成一句建議：先 MLE、再 RL。

第 20–21 頁把這條線接到 ChatGPT 的 RLHF：reward 不再是 ROUGE，而是人給的分數，也就是讓 RL 去最佳化「人類滿意度」這種抽象指標。人沒辦法一直即時給回饋，所以先學一個模擬人類回饋的 reward model，再用 PPO 這類演算法對它做最佳化。老師說，ChatGPT 的回答常常頭頭是道，就是因為它學到人喜歡這樣的回答。RLHF 的完整流程在本系列的[後訓練篇](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)。

## 常見的誤解

這幾條是我依課堂內容整理的。

- **「每一步都選機率最高的詞，整句的機率就最高。」** 上面的例子裡 greedy 得到 0.33，最高的是 0.36。
- **「Beam size 越大越好。」** 越大越花時間，在閒聊對話裡還會選到「What do you do for a living?」這種到處都通用、和輸入無關的句子。
- **「Temperature 是一種解碼方法。」** 它只改分布的尖或平，選詞仍由解碼演算法決定。接 greedy 時完全沒有效果。
- **「BLEU 高就代表生成得好。」** 在對話這類開放的任務上，自動分數和人的評分沒有一致性。
- **「Perplexity 和 BLEU 一樣是越高越好。」** Perplexity 越低越好，而且它評的是模型，不是某一次生成的輸出。
- **「直接用 RL 把 ROUGE 衝高就是最好的摘要模型。」** 只用 RL 的模型 ROUGE-1 與 ROUGE-L 最高，人的評分卻比較低。先 MLE 再 RL 的混合做法最好。

## 自我檢查

題目是本文自擬的。

**1. 訓練用 teacher forcing，參考答案是 A B B。測試時模型第一步輸出了 B。第二步的輸入是什麼？這會造成什麼問題？**

輸入是模型自己輸出的 B，因為測試時沒有參考答案。訓練時模型只看過「第一個是 A」之後的情況，B 之後的路徑沒有練過，後面可能一路錯下去。這就是 exposure bias。

**2. 沿用上面 A、B 的機率表，beam size 改成 1，會輸出什麼？**

Beam size 1 就是 greedy，輸出 AA，機率 0.33。

**3. 下一個詞的分布是：a 0.5、b 0.2、c 0.15、d 0.1、e 0.05。Top-k（k = 2）和 nucleus（p = 0.8）各從哪些詞裡抽？**

Top-k 取 a、b。Nucleus 從高到低累加：0.5、0.7、0.85，加到 c 才超過 0.8，所以從 a、b、c 裡抽。

**4. 分數是 (2, 1, 0)，temperature 從 1 調到 2，最高那個詞的機率怎麼變？如果解碼用 greedy，輸出會不會變？**

從 0.665 降到 0.506，分布變平。用 greedy 的話輸出不變，因為排名沒有變。

**5. 參考句「我 今天 真的 很 開心」，模型輸出「我 很 開心」。Unigram precision 和 ROUGE-1 recall 各是多少？**

輸出的三個詞都出現在參考句裡，precision 是 3 ÷ 3 = 1。參考句五個詞裡有三個被涵蓋，recall 是 3 ÷ 5 = 0.6。

**6. 模型對一個 2 個 token 的測試句給的機率是 0.5 和 0.5。Perplexity 是多少？另一個模型給 0.25 和 0.25，哪個模型比較好？**

第一個是 (0.25)^(−1/2) = 2，第二個是 (0.0625)^(−1/2) = 4。Perplexity 低的第一個比較好。

**7. 動手題：用任何一個開源語言模型，固定同一段 prompt，分別跑 greedy、beam search、純 sampling、top-k、top-p。預期會看到什麼？**

Greedy 與 beam search 的輸出容易重複同一段話；純 sampling 偶爾會離題；top-k 與 top-p 介於中間。

## 延伸閱讀

- [CS224N 第 11 堂：Benchmark 與 LLM 評估為什麼會過期](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)：從 benchmark 的角度講評估。
- [CME295 第 8 堂：用 LLM 評 LLM，先防三種偏誤](/posts/ai/2026-09-29-cme295-llm-evaluation)：LLM-as-judge 的細節。
- [CME295 第 5 堂：RLHF 與 DPO](/posts/ai/2026-09-29-cme295-preference-tuning)：RL for NLG 的現代延伸。

上一篇：[RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)
下一篇：[偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)

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

查核日期：2026-10-13。

內容核對：已依字幕核對（2026-10-13）：9.1–9.5 五支都依字幕整理。五支都在 2025-10-27 上傳，說明欄日期是 2023/10/26；其中 9.1、9.2、9.3、9.5 註明投影片取材自李宏毅老師。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：依字幕核對影片內容。確認 9.1、9.2 與文章相符；版本提醒（上傳 2025-10-27、說明欄 2023/10/26）屬實。
- 2026-10-13：查證歷程移出正文；系列內互相引用由篇序改為堂次。
- 2026-10-13：依五支影片的課堂口述補上各段說明，加入 greedy／beam、nucleus、temperature、BLEU／ROUGE、perplexity 的手算例子、常見誤解與附答案的自我檢查。

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
