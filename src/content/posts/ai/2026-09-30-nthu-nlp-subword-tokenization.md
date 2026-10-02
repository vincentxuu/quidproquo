---
title: "清大 NLP 導讀 7：Sub-word Tokenization——為什麼模型的詞彙表是「半個字」"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, tokenization, bpe, nlp]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 7
tldr: "清大高宏宇 NLP（Fall 2025）Sub-word Tokenization 單元導讀。用空白切詞只適用於西方語言，也處理不了沒看過的詞和德文那種複合字。BPE 從字元出發，反覆把最常一起出現的一對合併進詞彙表，合併幾次就多幾個詞；缺點是貪婪切法不一定最好。Unigram LM 改用機率挑切法，還能抽樣出不同切法。投影片給的詞彙量是 BERT 30522、GPT-2/GPT-3 50257、T5 32,128。"
description: "清大高宏宇教授自然語言處理（Fall 2025）W3_subword.pdf 與 Week 5 錄影導讀：以空白斷詞的三個問題（非西方語言、OOV、複合字）、segmentation 與 tokenization 的差別、BPE 的逐步合併範例與性質、Unigram Language Model 的建表與 subword sampling、BPE 與 ULM 比較，以及 BERT、GPT、T5 採用的斷詞法與詞彙量。"
draft: false
glossary:
  - term: "BPE"
    aliases: ["Byte Pair Encoding", "位元組對編碼"]
    definition: "子詞斷詞演算法：從字元開始，反覆找出語料中最常相鄰出現的一對符號，合併成新符號加入詞彙表，合併次數 num_merges 是超參數。"
    context: "投影片第 13–29 頁用 low／lower／newest／widest 示範四次合併。"
  - term: "OOV"
    aliases: ["out-of-vocabulary", "未登錄詞"]
    definition: "訓練語料裡沒出現、不在詞彙表中的詞。以整個詞為單位的詞彙表只能把它們全部變成 <UNK>。"
    context: "子詞斷詞主要就是為了處理 OOV、拼錯的詞與複合字。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en)

> **本文依據[清大高宏宇教授「自然語言處理」](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025（114-1）的公開教材。** 這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列的第 7 篇，上一篇是 [Transformer 與 Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers)。

這一講的官方材料是 [W3_subword.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_subword.pdf)（43 頁），錄影是 [Week 5 Tue.](https://www.youtube.com/live/Dpswwk6UMCc) 和 [Week 5 Thu.](https://www.youtube.com/live/FB0fgRTEbJE)。和上一講一樣，檔名的 W3 是舊版編號；[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)把它掛在 W5，同一列也發下 HW2。那一列的 Topics 欄是課綱模板，本篇不引用。

投影片大綱分三段：Recap、Word Segmentation、Sub-word Tokenization。

## 先回想：模型輸出的是整個詞彙表上的機率

第 4–5 頁先回顧語言模型的輸出層：RNN 讀完「I love an」，hidden state 經過分類層，輸出一個長度等於詞彙量的機率分布，apple 0.6、elephant 0.3、eraser 0.05……所以**詞彙表怎麼建，直接決定模型能說出哪些字**。

第 6 頁把 NLP 的基本流程寫成三步：建詞彙表 → 學表示（訓練）→ 做預測（測試），旁邊列出三個模型的詞彙量：

| 模型 | 詞彙量（投影片第 6 頁） |
|---|---|
| BERT | 30522 |
| GPT-2 / GPT-3 | 50257 |
| T5 | 32,128 |

這三個數字和 Hugging Face 上 [bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased/blob/main/config.json)、[gpt2](https://huggingface.co/openai-community/gpt2/blob/main/config.json)、[t5-base](https://huggingface.co/google-t5/t5-base/blob/main/config.json) 設定檔裡的 `vocab_size` 一致。要注意的是，[T5 論文](https://arxiv.org/abs/1910.10683)第 3.1.3 節寫的是「32,000 wordpieces」，設定檔的 32,128 比它多 128，官方材料沒有解釋這個差額。

## 用空白切詞會壞在哪

第 7 頁示範最直覺的做法：用空白切開「I love apples. I like apples and pineapples.」，收集出 and、apples、I、like、love、pineapples、「.」，再加一個 `<UNK>` 給沒看過的詞。切完也可以再做 stemming。

第 8–9 頁列出三個問題：

1. **只適用於西方語言**：中文、日文沒有空白分隔
2. **處理不了沒看過的詞**：拼錯的字明明帶著詞形資訊，卻整個變成 `<UNK>`
3. **翻譯時對不上**：來源語和目標語的詞不一定一對一。投影片的例子是英文 sewage water treatment plant 對到德文一個字 Abwasserbehandlungsanlage

結論是子詞單位比較好。第 11 頁補一個用詞區分：所有 tokenization 都是 segmentation，但反過來不成立。Segmentation 還包括把文件切成句子；tokenization 則可以是切詞，也可以是把詞再切成子詞。第 12 頁放了 [OpenAI Tokenizer](https://platform.openai.com/tokenizer) 讓同學自己玩。

## 三種常見演算法

第 10 頁列出三種：

- **BPE**（[Sennrich et al., 2016](https://aclanthology.org/P16-1162/)）：GPT 系列
- **WordPiece**（Schuster & Nakajima, 2012）：BERT
- **Unigram Language Model**（[Kudo, 2018](https://aclanthology.org/P18-1007/)）

第 40 頁的對照表更完整：WordPiece 用在 BERT、ALBERT、MT-DNN；BPE 用在 RoBERTa、XLM、GPT-1/2/3；Unigram 用在 XLNet、T5、mT5。

投影片前後有一處不一致：第 10 頁把 T5 放在 WordPiece 底下，第 40 頁放在 Unigram 底下。T5 論文自己的說法是「用 [SentencePiece](https://github.com/google/sentencepiece) 把文字編碼成 WordPiece token」，兩個詞都出現，所以兩種寫法都找得到來源。讀的時候知道有這個出入就好。

## BPE：一次合併一對

第 13–27 頁用一份小語料完整跑一遍。語料是 low ×5、lower ×2、newest ×6、widest ×3。每個詞先拆成字元，詞尾加上 `</w>`（end-of-word 符號，之後才還原得回原本的切法）：

| 詞 | 次數 |
|---|---|
| l o w `</w>` | 5 |
| l o w e r `</w>` | 2 |
| n e w e s t `</w>` | 6 |
| w i d e s t `</w>` | 3 |

初始詞彙表就是出現過的字元：`</w>`, d, e, i, l, n, o, r, s, t, w。接著重複三個動作：找出頻率最高的相鄰一對 → 加進詞彙表 → 把語料裡所有這一對合併。

| 第幾次合併 | 找到的一對 | 頻率 | 新增到詞彙表 |
|---|---|---|---|
| 1 | e s | 6 + 3 = 9 | es |
| 2 | es t | 6 + 3 = 9 | est |
| 3 | est `</w>` | 6 + 3 = 9 | est`</w>` |
| 4 | l o | 5 + 2 = 7 | lo |

合併四次（`num_merges` = 4）就停。`num_merges` 是要自己設定的超參數。

切新詞時（第 28 頁），同樣先拆成字元加 `</w>`，再依學到的詞彙表合併：low 變成 lo w `</w>`，widest 變成 w i d est`</w>`。

第 29 頁歸納兩個性質：

- **最終詞彙量 = 初始詞彙量 + num_merges**。例子裡是 11 + 4 = 15
- **它是統計方法**，語料裡越常見的子詞越會被收進詞彙表

### BPE 的問題：貪婪不一定最好

第 30 頁指出，BPE 預設用詞彙表裡最大的子詞去切，是貪婪、確定、由左到右的做法。「Hello world」可能被切成 Hell / o / world，但 H / ello / world、He / llo / world 等切法也都合法，BPE 選的不一定最好。

第 31 頁給每個子詞一個出現機率，把每種切法的機率相乘比較：BPE 的 Hell / o / world 約 4.2×10<sup>−6</sup>，H / ello / world 約 7.9×10<sup>−6</sup>，後者更高。這就引出下一個方法。

## Unigram Language Model：用機率挑切法

第 32 頁的定位：ULM 和 BPE 一樣把句子切成子詞，差別在於它依照整句的聯合機率來切，詞彙表裡每個 token 都有自己從語料學到的機率。

第 33–37 頁的流程分三步：

1. **定好詞彙量，建初始詞彙表**：從語料取出所有子詞（含單一字元），留下最常見的那些，算出每個子詞的頻率。原論文用 Enhanced Suffix Array 加速，課堂不講
2. **訓練 unigram 語言模型**：不是神經網路，是機率模型，用 EM 演算法最大化整份語料的 likelihood；每句取最佳切法時用 Viterbi 演算法加速，課堂同樣不講
3. **修剪詞彙表**：反覆計算每個子詞被拿掉後 loss 會增加多少，保留前 η%（例如 η = 80）

投影片附上兩個延伸連結：[SentencePiece](https://github.com/google/sentencepiece) 與 [Hugging Face NLP Course 的 Unigram 章節](https://huggingface.co/learn/nlp-course/chapter6/7)。

<details>
<summary>公式：子詞頻率與 subword sampling（投影片第 35、38 頁）</summary>

$$\mathrm{frequency}(x_i) = \frac{\mathrm{Count}(x_i)}{\sum \text{all counts}}$$

從最好的 l 種切法中，依下面的分布抽一種：

$$P(\mathbf{x}_i \mid X) \approx \frac{P(\mathbf{x}_i)^{\alpha}}{\sum_{i=1}^{l} P(\mathbf{x}_i)^{\alpha}},\qquad P(\mathbf{x}_i) = \prod_{j=1}^{n_i} P(t_j)$$

X 是句子，x<sub>i</sub> 是第 i 種切法，n<sub>i</sub> 是它的 token 數，α 控制分布的平滑程度。

</details>

### Subword sampling：同一個字，每次切法不同

第 38–39 頁說明，ULM 原論文在推論時不一定選機率最高的切法，而是抽樣。投影片用 T5-base tokenizer 對「internationalization」抽五次，得到五種切法，例如：

- ▁ / inter / national / ization
- ▁ / international / ization
- ▁in / tern / at / i / o / n / ali / z / ation

開頭的「▁」是 T5 tokenizer 加在詞前面的邊界符號。

## BPE 和 ULM 怎麼選

第 41 頁的比較表：

| 面向 | ULM | BPE |
|---|---|---|
| 演算法 | EM 演算法 | 貪婪法，沒有機率模型 |
| 訓練速度 | 較慢 | 較快 |
| 切法一致性 | 同一個詞可能切出不同結果 | 每次都一樣 |
| 推論速度 | 較慢 | 較快 |
| 下游任務 | 機器翻譯可能較好 | 適用大多數任務 |

第 42–43 頁收尾：子詞斷詞能處理未知詞、拼錯的詞和複合字，緩解翻譯時的複合字問題，而 GPT-3、BERT 這類模型都在預訓練前先做子詞斷詞。缺點不多：`num_merges` 要調，詞彙表建好就固定，加新資料要重跑。最後一行留了一個問題：中文怎麼辦？投影片的答案是 character-level encoding，也就是以字為單位。

## 想深入

- 用 Python 把第 13–27 頁的四次合併寫出來：一個 `Counter` 數相鄰符號對，一個函式做合併，跑完對照投影片的詞彙表。
- 把 `num_merges` 改成 10，看 newest 和 widest 最後會不會變成單一 token。
- 用 `transformers` 載入 `t5-base` tokenizer，對「internationalization」開啟 sampling 參數跑幾次，對照第 39 頁的結果。
- 用 [OpenAI Tokenizer](https://platform.openai.com/tokenizer) 貼一段中文和一段英文，比較同樣意思各用了多少 token。

**延伸閱讀**：[CS224N 導讀：Tokenization 與多語言](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality) 從多語言公平性講斷詞；[CS336 導讀：總覽與 tokenization](/posts/ai/2026-08-22-cs336-overview-tokenization) 要你自己從頭實作 byte-level BPE。

## 材料缺口

- 這一講沒有專屬作業。同一週發下的 [HW2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) 是字元層級的算式生成，沒有用到 BPE。
- WordPiece 只在列表裡出現，投影片沒有講它的演算法。
- 投影片第 10 頁與第 40 頁對 T5 的歸類不一致，見上文。
- 解答、測驗與課堂討論在 NTU COOL，校外讀者拿不到。Fall 2026 的這一講還沒公開。

**系列導覽**：上一篇 [Transformer 與 Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers)｜下一篇 [ELMo、BERT、T5、BART、GPT：預訓練的三條路](/posts/ai/2026-09-30-nthu-nlp-bert-family)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W3_subword.pdf（Sub-word Tokenization 投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_subword.pdf)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 5 Tue.](https://www.youtube.com/live/Dpswwk6UMCc)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 5 Thu.](https://www.youtube.com/live/FB0fgRTEbJE)
- [Sennrich, Haddow & Birch (2016). Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [Kudo (2018). Subword Regularization](https://aclanthology.org/P18-1007/)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer（T5）](https://arxiv.org/abs/1910.10683)
- [google/sentencepiece](https://github.com/google/sentencepiece)
- [Hugging Face NLP Course：Unigram tokenization](https://huggingface.co/learn/nlp-course/chapter6/7)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)
- [bert-base-uncased config.json](https://huggingface.co/google-bert/bert-base-uncased/blob/main/config.json)
- [gpt2 config.json](https://huggingface.co/openai-community/gpt2/blob/main/config.json)
- [t5-base config.json](https://huggingface.co/google-t5/t5-base/blob/main/config.json)
