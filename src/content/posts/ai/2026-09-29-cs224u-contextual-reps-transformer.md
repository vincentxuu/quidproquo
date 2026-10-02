---
title: "CS224U 上下文表徵 I：「break」有八種意思，Transformer 怎麼讓每個詞看情境"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, transformer, attention, nlp]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 3
tldr: "CS224U Spring 2023 的 contextual representations 單元前三段：先用「break」「crane」這類例子說明靜態詞向量為什麼注定不夠，再用「The Rock rules」三個詞一步步拆出 Transformer block——各欄之間只有 attention 會互相連結，其他步驟都逐欄獨立。最後用兩個問題比較三種位置編碼：位置集合要不要事先決定？會不會妨礙泛化到新位置？絕對位置兩題都不過，正弦函數過第一題，Shaw 2018 的相對位置編碼兩題都過。"
description: "Stanford CS224U（Spring 2023）contextual representations 投影片前三節（Guiding ideas、Transformer、Positional encoding）與 YouTube 04–06 導讀：從靜態詞向量的極限、attention 與 subword 的來歷，到 Transformer block 的逐步計算、multi-head attention，以及絕對、正弦、相對三種位置編碼的比較。公式收在折疊區塊。"
draft: false
glossary:
  - term: "positional encoding"
    aliases: ["位置編碼"]
    definition: "把詞在序列中的位置資訊加進表徵的機制。Transformer 的 attention 本身不分方向，沒有位置編碼就分不出 A B C 和 C B A。"
    context: "本文比較絕對、正弦函數、相對三種做法。"
  - term: "WordPiece"
    aliases: ["word piece tokenization"]
    definition: "把詞切成較小的子詞單位的斷詞法；不在詞彙表裡的詞會被拆成已知的片段，而不是變成 UNK。"
    context: "BERT 用它把詞彙表壓在 3 萬個以內。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en)

> **本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 的 2023 春季版。** 這是 [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)系列的第 3 篇，上一篇是[開場：NLU 的演進與課程地圖](/posts/ai/2026-09-29-cs224u-intro-evolution-of-nlu)。

CS224U 2023 年 4 月 5 日那堂的主題是 contextual word representations。官方材料是一份 [投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)（handout 有 95 頁，投影片編號到 81），分十節：Guiding ideas、Transformer、Pos enc、GPT、BERT、RoBERTa、ELECTRA、seq2seq、Distillation、Wrap-up。YouTube 上的 [XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)把它拆成十支短片。

本篇處理前三節，對應第 [04](https://www.youtube.com/watch?v=FEFeeRONEdw)、[05](https://www.youtube.com/watch?v=yqV_YfBBtK0)、[06](https://www.youtube.com/watch?v=JERXX2Byr90) 支影片。後七節是各個模型家族，放在[下一篇](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)。

Potts 在第 04 支影片一開頭就說明了取捨：以前的版本會花大約兩週講靜態向量，2023 年這版直接跳到上下文表徵。靜態向量變成課程網站上的[背景材料](https://web.stanford.edu/class/cs224u/background.html)。

## 場景：同一個「break」，八種意思

投影片第 4 頁列了一串例子，全部是同一個動詞：

- The vase broke.（碎掉）
- Dawn broke.（天亮、開始）
- The news broke.（消息傳開）
- Sandy broke the world record.（打破紀錄）
- Sandy broke the law.（違法）
- The burglar broke into the house.（闖入）
- The newscaster broke into the movie broadcast.（插播）
- We broke even.（打平、不賺不賠）

形容詞也一樣：flat tire、flat beer、flat note、flat surface。再往外推，「A crane caught a fish」裡的 crane 大概是鳥，「A crane picked up the steel beam」裡的是起重機，「I saw a crane」單看一句分不出來，要靠更大的上下文。

最後一組例子最徹底。「Are there typos? I didn't see any.」和「Are there bookstores downtown? I didn't see any.」第二句一字不差，any 指的東西卻完全不同。

Potts 在[錄影](https://www.youtube.com/watch?v=FEFeeRONEdw)裡下的結論很直接：靜態詞向量要求「broke」在所有例子裡是同一個向量，所以**這條路從來就不可能真的走通**。詞義會受周圍的詞、整段對話，甚至世界知識影響。上下文表徵要捕捉的就是這件事。

## 從靜態到上下文：四個階段、五個里程碑

投影片把靜態表徵的演進壓成四階段：

1. 以特徵為基礎的稀疏表徵：手寫 feature function
2. 以計數為基礎的稀疏表徵：PMI、TF-IDF
3. 傳統降維得到的稠密表徵：PCA、SVD、LDA
4. 用學習做降維的稠密表徵：autoencoder、word2vec、GloVe

上下文表徵的歷史很短，投影片只列五個時間點：

| 時間 | 論文 | 做了什麼 |
|---|---|---|
| 2015 年 11 月 | [Dai & Le](https://arxiv.org/abs/1511.01432) | 證明語言模型式預訓練對下游任務有用 |
| 2017 年 8 月 | [McCann et al.（CoVe）](https://papers.nips.cc/paper/7209-learned-in-translation-contextualized-word-vectors) | 用機器翻譯預訓練的雙向 LSTM 當下游任務起點 |
| 2018 年 2 月 | [Peters et al.（ELMo）](https://aclanthology.org/N18-1202/) | 第一次展示超大規模預訓練雙向 LSTM 能得到多用途表徵 |
| 2018 年 6 月 | [Radford et al.（GPT）](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) | GPT |
| 2018 年 10 月 | [Devlin et al.（BERT）](https://aclanthology.org/N19-1423/) | BERT，論文正式發表於 2019 |

## 直覺：Transformer 之前已經備好的四塊積木

Transformer 不是憑空出現的。Guiding ideas 這一節其實在交代，它用到的東西在之前幾年各自長出來了。

**第一塊：少一點預設結構。** 投影片第 6 頁用「The Rock rules」畫了四種模型。把詞向量直接相加，是事先決定「詞義用加法組合」，偏誤很高。RNN 讓組合方式可以學。樹狀網路要先知道「The Rock」是一個成分、「Rock rules」不是。最後一種是雙向 RNN 加上讓每個狀態連到每個狀態的 attention，等於說「什麼都可以」。Potts 的結論是：Transformer 時代的一個教訓，就是只要資料夠多，「什麼都可以」反而是最強的模式。

**第二塊：dot-product attention。** Transformer 之前，attention 是 RNN 的補丁。用「really not so good」做情感分類時，最後一個狀態可能記不太住句首的詞，所以拿最後狀態和前面每個狀態做內積、softmax 正規化、加權平均成 context，再和最後狀態一起送進分類器。Potts 稱它是 Transformer「跳動的心臟」。

**第三塊：subword。** ELMo 從字元開始，用不同寬度的濾波器加 max-pooling 組出詞向量。但它的詞彙表約有 10 萬個詞，真實文本裡還是一直碰到詞彙表外的詞。BERT 改用 [WordPiece](https://aclanthology.org/P16-1162/)。投影片示範 BERT tokenizer 把「Encode me!」的 encode 拆成「En」和「##code」，把「Snuffleupagus」這一個詞拆成 6 片，詞彙表卻不到 3 萬個。不在詞彙表裡的詞也不會變成 UNK，而是拆成已知的片段。

**第四塊：大規模預訓練與微調。** Potts 把微調分成三個時期：2016–2018 年把靜態向量餵給 RNN；2018 年起直接微調 BERT 這類上下文模型；2021 年之後，越來越多微調發生在我們碰不到參數的大模型上，只能透過 API。他說希望大家還是繼續自己寫微調程式碼，因為那在分析上和技術上都很有力。

位置編碼也列在 guiding ideas 裡，第三節會專門講。

## 機制：一個 Transformer block，一步步算

第 05 支影片用三個詞「The Rock rules」建出整個 block。每一步只示範第三個位置 c 的計算，a、b 兩個位置完全平行。

1. **輸入。** 查詞向量（the 是 x47、Rock 是 x30、rules 是 x34），也查位置向量 p1、p2、p3，兩者逐維相加。所以 c_input = x34 + p3。
2. **Attention。** c_input 分別和 a_input、b_input 做內積，除以 √d_k，softmax 得到權重 α，再用 α 加權加總 a_input 和 b_input，得到 c_attn。
3. **Residual 與 dropout。** c_attn 加回 c_input，對兩者之和套 dropout，得到 c_alayer。
4. **Layer norm。** 減平均、除標準差，讓數值維持在好訓練的範圍。
5. **Feed-forward。** 兩層 dense：第一層後接 ReLU，第二層回到 d_k。
6. **再一次 residual、dropout、layer norm**，得到 c_out。

d_k 為什麼重要？模型裡到處是加法，所以幾乎每個表徵的維度都必須是 d_k。**唯一的例外在 feed-forward 內部**：第一層可以先展開到更寬的維度，只要第二層收回 d_k 就好。Potts 提到，很多大型模型的參數大量藏在這裡。

還有一個觀察值得先記住：**整個 block 裡，只有 attention 讓不同位置之間互相溝通。** 其他步驟都是各欄各自計算。這就是為什麼 attention 是 Transformer 的核心，也是為什麼它需要很多 head。

<details>
<summary>公式：單一位置的完整計算（投影片第 14 頁）</summary>

$$c_{\text{input}} = x_{34} + p_3$$

$$\tilde{\alpha} = \left[\frac{c_{\text{input}}^\top a_{\text{input}}}{\sqrt{d_k}},\ \frac{c_{\text{input}}^\top b_{\text{input}}}{\sqrt{d_k}}\right],\quad \alpha = \mathrm{softmax}(\tilde{\alpha})$$

$$c_{\text{attn}} = \alpha_1 a_{\text{input}} + \alpha_2 b_{\text{input}}$$

$$c_{\text{alayer}} = \mathrm{Dropout}(c_{\text{attn}} + c_{\text{input}}),\quad c_{\text{anorm}} = \frac{c_{\text{alayer}} - \mathrm{mean}(c_{\text{alayer}})}{\mathrm{std}(c_{\text{alayer}}) + \epsilon}$$

$$c_{\text{ff}} = \mathrm{ReLU}(c_{\text{anorm}} W_1 + b_1) W_2 + b_2$$

$$c_{\text{fflayer}} = c_{\text{anorm}} + \mathrm{Dropout}(c_{\text{ff}}),\quad c_{\text{out}} = \frac{c_{\text{fflayer}} - \mathrm{mean}(c_{\text{fflayer}})}{\mathrm{std}(c_{\text{fflayer}}) + \epsilon}$$

</details>

**矩陣形式對不上怎麼辦？** 論文裡常見的是 softmax(QKᵀ/√d_k)V 這種矩陣寫法，Potts 坦白說他一開始也看不出和逐項寫法的對應。投影片第 15 頁附了一段 NumPy，用三個隨機向量分別算逐項版本和矩陣版本，結果一樣。

**Multi-head。** 每個 head 各有一組 W^Q、W^K、W^V，在 query、key、value 上各乘一次再算同樣的內積。把這些參數拿掉，就回到前面的單頭版本。三個 head 各自算完，再把結果接回每個位置。

**疊起來。** c_out 當下一個 block 的 c_input，重複 N 次。Potts 說 12 層、24 層很常見，也可能多到數百層。

**回頭看那張有名的架構圖。** 原論文 [Attention Is All You Need](https://arxiv.org/abs/1706.03762) 處理 seq2seq，所以有 encoder 和 decoder。Encoder 就是上面的 block 重複 N 次；decoder 結構相同，只多了 masking，確保 attention 只看過去、不看未來。Potts 也提到論文標題的意思：當時 RNN 上已經疊了很多 attention，作者主張可以把 recurrence 整個拿掉。

**用 Hugging Face 看實物。** 投影片第 19 頁印出 BERT-base 的結構：詞嵌入約 3 萬個、每個 768 維；位置嵌入 512 個，所以最長只能處理 512 個 token；所有地方都是 768，只有 feed-forward 中間展開到 3,072。

## 位置編碼：兩個問題，三種做法

第 06 支影片開頭，Potts 說他自己「太久把位置編碼視為理所當然」，現在看來它是影響 Transformer 表現的關鍵因素。

**為什麼需要它？** Attention 就是一堆內積，本身沒有方向，各欄之間也沒有別的互動。不加位置資訊，A B C 和 C B A 對模型來說沒有差別。位置編碼還有第二個用途：標記階層式的位置，例如 NLI 裡哪些詞屬於前提、哪些屬於假設。

**評比的兩個問題：**

1. 位置集合需不需要事先決定？
2. 這個做法會不會妨礙模型泛化到新位置？

他額外立了一條規則：模型可能因為各種設計和最佳化上的原因限制最大長度，這些先擱置，只問位置編碼方案本身有沒有限制長度泛化。

| 做法 | Q1：要事先決定位置集合？ | Q2：妨礙泛化到新位置？ |
|---|---|---|
| 絕對位置（學一組位置向量加到詞向量上） | 要。設 512 就沒有 513 | 會。「The Rock」在句首和句中是不同表徵 |
| 正弦函數（原論文的做法） | 不用。任何位置都算得出向量 | 仍會。位置向量還是和詞向量「平起平坐」相加 |
| 相對位置（[Shaw et al. 2018](https://arxiv.org/abs/1803.02155)） | 不用。只要決定窗口大小 | 大致解決 |

**相對位置編碼怎麼運作？** 有兩個關鍵改變。第一，位置資訊不在輸入層加入，而是在 attention 裡加入：算內積時在 key 上加一個相對位置向量，加權加總時在 value 上也加一個。第二，有一個窗口。窗口設為 2 時，從位置 4 往左看，距離 −1 用 w₋₁、距離 −2 用 w₋₂，再更遠也還是 w₋₂；往右同理。整個模型只要學 w₋₂ 到 w₂ 這幾個向量。

**為什麼這樣就能泛化？** 不管「The Rock」出現在字串哪裡，它內部用到的相對位置向量都是 0、1、−1。模型比較容易看出這是同一個片語。Potts 的判斷是：相對位置編碼「在 Transformer 裡是很好的選擇」，而且他認為整個領域的結果都支持這一點。

<details>
<summary>公式：相對位置編碼的完整定義（投影片第 27 頁）</summary>

$$\mathrm{attn}_i = \sum_{j=1}^{n} \alpha_{ij}\left(x_j W^V + a^V_{ij}\right)$$

$$\alpha_{ij} = \mathrm{softmax}\left(\frac{(x_i W^Q)^\top (x_j W^K + a^K_{ij})}{\sqrt{d_k}}\right)$$

其中 $a^K_{ij}$、$a^V_{ij}$ 依相對距離 $j - i$ 取值，並截在窗口 $[-d, d]$ 內：距離超過 $d$ 的都共用 $w_{\pm d}$。

</details>

## 連回模型：這三節怎麼接到後面

- BERT 用的是絕對位置編碼，所以最長 512 個 token。下一篇講 BERT 時，投影片會把這列為它的限制之一。
- Wrap-up 那節提到 [DeBERTa](https://arxiv.org/abs/2006.03654)：把詞和位置的表徵分開，用各自的 attention 處理。Potts 說這呼應了他在位置編碼那段的擔憂，也就是位置表徵有時對詞義的影響太大。
- GPT 需要的 causal mask，就是上面 decoder 的 masking。

## 想深入的話

- 動手最快的路線：打開 [The Annotated Transformer](http://nlp.seas.harvard.edu/annotated-transformer/)，它是講次表列的指定讀物，逐行對照論文實作。
- 把投影片第 15 頁那段 NumPy 自己打一次，確認逐項寫法和矩陣寫法算出一樣的 c_attn。
- 用 `transformers` 載入 `bert-base-cased`，`print(model)` 對照投影片第 19 頁的結構。

**延伸閱讀**：[CS224N 導讀：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers) 用另一門課的角度講同一個架構，包含二次方成本與 Assignment 3 的驗證方式；[CS224N 導讀：詞向量](/posts/ai/2026-08-22-cs224n-word-vectors) 補靜態向量的背景。

## 材料缺口

- 影片是 XCS224U 線上版的螢幕錄影，不是教室錄影，沒有課堂問答。
- 這三節沒有專屬作業；第一份作業（多領域情感分析）才會用到微調上下文模型。
- 投影片第 27 頁的文字檔在相對位置編碼下仍印著兩條「Limitations」，但錄影明確說相對位置編碼兩題都過。PDF 抽出的文字看不出原投影片是否有刪除線，本文以錄影的說法為準。

**系列導覽**：上一篇 [開場：NLU 的演進與課程地圖](/posts/ai/2026-09-29-cs224u-intro-evolution-of-nlu)｜下一篇 [上下文表徵 II：GPT、BERT、RoBERTa、ELECTRA、seq2seq 與蒸餾](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)

## 參考資料

- [CS224U 課程網站（Spring 2023）](https://web.stanford.edu/class/cs224u/)
- [Contextual word representations 投影片（handout PDF）](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)
- [影片 04：Contextual Word Representations, Part 1: Guiding Ideas](https://www.youtube.com/watch?v=FEFeeRONEdw)
- [影片 05：Part 2: Transformer](https://www.youtube.com/watch?v=yqV_YfBBtK0)
- [影片 06：Part 3: Positional Encoding](https://www.youtube.com/watch?v=JERXX2Byr90)
- [CS224U 背景材料頁](https://web.stanford.edu/class/cs224u/background.html)
- [Vaswani et al. (2017). Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Rush (2018). The Annotated Transformer](http://nlp.seas.harvard.edu/annotated-transformer/)
- [Shaw, Uszkoreit & Vaswani (2018). Self-Attention with Relative Position Representations](https://arxiv.org/abs/1803.02155)
- [Dai & Le (2015). Semi-supervised Sequence Learning](https://arxiv.org/abs/1511.01432)
- [McCann et al. (2017). Learned in Translation: Contextualized Word Vectors](https://papers.nips.cc/paper/7209-learned-in-translation-contextualized-word-vectors)
- [Peters et al. (2018). Deep Contextualized Word Representations](https://aclanthology.org/N18-1202/)
- [Radford et al. (2018). Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Devlin et al. (2019). BERT](https://aclanthology.org/N19-1423/)
- [Sennrich, Haddow & Birch (2016). Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [He et al. (2021). DeBERTa](https://arxiv.org/abs/2006.03654)
