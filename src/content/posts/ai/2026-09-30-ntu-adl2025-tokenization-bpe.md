---
title: "台大 ADL 第 5 講：Tokenization 與 BPE，詞表是怎麼長出來的"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, tokenization, bpe]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 5
tldr: "用整個詞當單位，沒看過的詞只能變成 UNK；用單一字元當單位，意思又很難組回來。ADL 這一講用 22 頁投影片說明主流的折衷：subword，以及最常用的切法 BPE。重點是一個 4 個詞、16 次出現的小語料，從字元開始，每次把最常相鄰的一對合併，9 次合併後得到 newest</w>、low</w> 這些單位，再拿來切沒看過的 lowest 與 powest。最後用 GPT-3 tokenizer 示範：同一句話的中文版比英文版多一倍 token。"
description: "台大陳縕儂《深度學習之應用》ADL Fall 2025 Tokenization 講次導讀：詞表外的詞（UNK）問題、Swahili 動詞的形態變化、character 與 subword 兩種 token 定義、BPE 三步驟與逐步合併示範、merge 規則如何處理未見詞、BPE 單位與詞素的關係、多語 BPE 對中文不利的 token 成本。"
draft: false
glossary:
  - term: "BPE"
    aliases: ["Byte-Pair Encoding", "位元組對編碼"]
    definition: "一種定義 subword 詞表的方法：從只有字元與詞尾符號的詞表開始，反覆找出語料中最常相鄰出現的一對單位、合併成新單位加入詞表，直到詞表達到想要的大小。合併的順序記下來，就是之後切新文字的規則。"
    context: "ADL Tokenization 投影片第 5–19 頁用 low、lower、newest、widest 四個詞的小語料逐步示範。"
  - term: "subword"
    aliases: ["子詞", "次詞單位"]
    definition: "介於整個詞與單一字元之間的切分單位。常見詞保持完整，罕見詞拆成幾個較常見的片段，所以詞表大小可控，也不太會遇到完全沒見過的輸入。"
    context: "ADL Tokenization 投影片第 4 頁稱它為 dominant modern paradigm，是詞與字元之間的平衡。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據台大陳縕儂《深度學習之應用》（ADL）**Fall 2025（114-1，2025/09/01–12/15）** 9/08 那週的 [Tokenization 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf)（22 頁）。課程頁這一列連到的影片是 [ADL 5.1: BPE (Byte-Pair Encoding) Tokenization](https://youtu.be/NrT5kmnTFCk)（33:37），它的上傳日期是 2023-10-12，是沿用往年的錄影，不是 2025 年重錄，內容可能跟 2025 版投影片有出入。這支影片沒有字幕，本文只依投影片寫。事實皆於 2026-09-30 打開官方材料核對。整門課的存取分級是 **A2**，缺口在作業端，見[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)。

**系列位置**：上一篇 [Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)｜下一篇 [BERT 與 BERT 家族](/posts/ai/2026-09-30-ntu-adl2025-bert-family)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

讀完 Transformer 之後突然回頭講「怎麼切字」，看起來像倒退一步。其實 [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)的 9/08 那一列就是這個順序：Attention → Transformer → Tokenization → BERT。理由有兩個。第一，[上一篇](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)的 Transformer 訓練技巧第一項就是 BPE。第二，[下一篇](/posts/ai/2026-09-30-ntu-adl2025-bert-family)的 BERT 吃進去的輸入就是 subword。

這份投影片只有 22 頁，其中 14 頁是一個例子的逐步示範。把那個例子自己算一遍，這一講就讀完了。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=NrT5kmnTFCk
title: ADL 5.1: BPE (Byte-Pair Encoding) Tokenization 如何將字詞切成小單元
```

```youtube
url: https://www.youtube.com/watch?v=HEikzVL-lZU
title: Byte Pair Encoding Tokenization
```

原始影片：[ADL 5.1: BPE (Byte-Pair Encoding) Tokenization 如何將字詞切成小單元](https://www.youtube.com/watch?v=NrT5kmnTFCk)、[Byte Pair Encoding Tokenization](https://www.youtube.com/watch?v=HEikzVL-lZU)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## 問題：詞表外的詞

投影片第 2 頁的表格把問題講得很具體。詞表從訓練資料來，常見的 hat、learn 有自己的向量；下面三種詞全部變成 UNK，共用同一個沒什麼意義的向量：

- 變體：taaaaasty
- 拼錯：laern
- 新詞：Transformerify

標題下的那句話是重點：這些詞模型處理不好，但人可以。你看到 Transformerify，大概猜得出它的意思，因為你會拆字。

第 3 頁補上語言學的角度：很多語言的詞形變化很複雜。投影片的例子是 Swahili 的動詞可以有上百種變化，每一種編碼了時態、語氣、定指、否定、受詞等資訊。以整個詞當單位，這類語言的詞表會大到不實際。

## Token 要切多細

第 4 頁比較兩種單位：

| 單位 | 好處 | 壞處 |
|---|---|---|
| 字元 | 不會有沒見過的單位；詞表很小 | 意思分散在很多字元上，模型很難組回來 |
| Subword（詞的片段） | 詞與字元之間的平衡 | —— |

投影片稱 subword 是現在的主流做法。接下來的問題就是：片段要怎麼決定？

## BPE：三個步驟

第 5 頁先給出 BPE 的原始定義：把資料裡最常見的一對相鄰位元組，換成一個資料裡沒出現過的新位元組。用在 NLP 時改成三步：

1. 從只有字元和一個「詞尾」符號 `</w>` 的詞表開始。
2. 在語料裡找出最常相鄰出現的一對單位「a, b」，把「ab」加進詞表。
3. 把語料裡所有這一對換成新單位，回到第 2 步，直到詞表達到想要的大小。

投影片沒有附論文出處；把 BPE 用在神經機器翻譯的是 [Sennrich et al. 2016](https://arxiv.org/abs/1508.07909)。投影片另外附了 Hugging Face 的示範影片「[Byte Pair Encoding Tokenization](https://youtu.be/HEikzVL-lZU)」。

## 逐步示範：low、lower、newest、widest

第 6–16 頁用一個小語料示範。四個詞，後面是出現次數：

```
l o w </w>        : 5
l o w e r </w>    : 2
n e w e s t </w>  : 6
w i d e s t </w>  : 3
```

起始詞表是語料裡出現的所有字元加上 `</w>`：`</w> d e i l n o r s t w`。

**第一次合併。** 數每一對相鄰單位的次數：`e s` 出現在 newest（6 次）與 widest（3 次），共 9 次；`s t` 也是 9 次；`l o` 是 7 次。投影片標出兩個並列最高的 9 次，寫「Choose One」，選了 `es`。語料變成 `n e w es t </w>`、`w i d es t </w>`。

**接下來每一步都一樣**：數次數、合併最高的一對、改寫語料。投影片第 17 頁把 9 次合併依序列出：

```
1. e + s        → es
2. es + t       → est
3. est + </w>   → est</w>
4. l + o        → lo
5. lo + w       → low
6. n + e        → ne
7. ne + w       → new
8. new + est</w> → newest</w>
9. low + </w>   → low</w>
```

最後的語料是 `low</w>`、`low e r </w>`、`newest</w>`、`w i d est</w>`，詞表多了 `es est est</w> lo low ne new newest</w> low</w>`。

注意第 3 步：`est` 和 `</w>` 合在一起，代表模型學到了「est 常出現在詞尾」。同一串字母在詞中間和詞尾是不同的單位，這就是 `</w>` 的作用。

### 切沒看過的詞

合併規則記下來之後，切新詞就是照順序套用。第 18–19 頁示範兩個語料裡沒有的詞：

- **lowest** → `low est</w>`。依序套規則，先合出 `est</w>`，再合出 `low`；因為 lowest 的 low 後面沒接 `</w>`，第 9 條不適用。兩個片段都在詞表裡。
- **powest** → `<unk> o w est</w>`。`p` 不在起始詞表裡，只好變成 `<unk>`；`o w` 前面沒有 `l`，合不成 `low`。

第二個例子說明了 BPE 的極限：起始詞表沒有的字元，還是會變成未知符號。

## BPE 單位有什麼特性

第 20 頁：BPE 的詞表通常同時有常見的整個詞與常見的片段，而這些片段常常就是詞素（morpheme），例如 -est、-er。投影片對詞素的定義是語言中最小的有意義單位，例子是 unlikeliest 拆成 un-、likely、-est 三個詞素。

這也回答了開頭的問題：人看得懂 Transformerify，是因為認得 Transformer 和 -ify。BPE 讓模型有機會做類似的事。

## 多語 BPE：中文比較貴

第 21 頁是一張 [OpenAI tokenizer](https://platform.openai.com/tokenizer) 的截圖。多語模型用同一套 BPE 切所有語言，同一句話兩種語言的結果差很多：

| 句子 | Token | 字元 |
|---|---|---|
| Working on NLP is fun, but tokenization is not fun. | 14 | 51 |
| 做NLP工作很有趣，但tokenization不有趣。 | 29 | 27 |

這是 GPT-3 tokenizer 的結果。中文版字元比較少，token 卻多了一倍以上，工具還提示「有些 unicode 字元對應到多個 token」。投影片的結論是：透過 Unicode 編碼切中文沒有效率，成本也比較高。

結論頁（第 22 頁）把整講收成三點：subword 解決沒看過的詞；BPE 是常用的 subword 切法，詞表同時有常見詞與最小的有意義單位；不同語言可能需要自己的切法，才能提高效率、降低成本。

## 自學怎麼做

1. 讀投影片第 6–17 頁時不要只看，拿紙跟著數。每一步先自己決定該合併哪一對，再翻下一頁對答案。
2. 第 7 頁 `es` 和 `st` 同為 9 次，投影片選了 `es`。試試改選 `st`，看最後的詞表會不會不同。
3. 如果想聽老師講解，[5.1 影片](https://youtu.be/NrT5kmnTFCk)是 2023 年的錄影，先對照投影片頁碼再看。

今晚可以做的一件事：打開 [OpenAI tokenizer](https://platform.openai.com/tokenizer)，貼一段你最近寫的中文訊息和它的英文翻譯，記下兩邊的 token 數。你手上就有一個跟第 21 頁一樣的比較，而且是用現在的 tokenizer。

## 延伸閱讀

- 從零實作 BPE tokenizer：[CS336 Lecture 1：從位元組到 tokenizer](/posts/ai/2026-08-22-cs336-overview-tokenization)
- 多語 token 成本的更完整討論：[CS224N 第 14 講：Tokenization 如何製造多語言成本差](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality)
- 另一門課怎麼把切字接到 Transformer：[CME295 第 1 講](/posts/ai/2026-09-29-cme295-transformer)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/08 課表列
- [Tokenization 投影片（2025/09/08）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf) — 本文引用的頁碼與例子都出自這份
- [ADL 5.1: BPE (Byte-Pair Encoding) Tokenization 如何將字詞切成小單元](https://youtu.be/NrT5kmnTFCk)（33:37，2023-10-12 上傳）
- [2025 Fall ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Sennrich, Haddow & Birch, Neural Machine Translation of Rare Words with Subword Units（ACL 2016）](https://arxiv.org/abs/1508.07909) — BPE 用於 NMT 的原始論文（投影片未引用）
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — 投影片第 21 頁截圖來源
