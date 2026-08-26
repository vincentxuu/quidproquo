---
title: "Tokenization：BPE 演算法，以及為什麼中文比英文貴"
date: 2026-08-26
category: ai
type: deep-dive
tags: [tokenization, bpe, llm, token, nlp, chinese-nlp, api-pricing]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 2
tldr: "模型不是按字數收費，是按 token 收費。BPE 演算法從字元開始，反覆合併最常出現的相鄰配對來建詞表。英文 'understanding' 可能是 1-2 個 token，但中文「理解」可能要 2-3 個——同樣的意思，中文就是比較貴。"
description: "Tokenization 與 BPE 演算法入門：為什麼模型把文字切成 subword、BPE 怎麼建詞表、中英文 token 數量差異的實際影響，以及 tiktoken 和 SentencePiece 的差別。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-tokenization-en)

上一篇講了 token 是模型處理文字的基本單位。但模型到底怎麼決定「哪些字元組成一個 token」？這個過程叫 tokenization，而它直接影響你用 API 要付多少錢。

## 模型不認識「字」，只認識 token

人類讀文字的單位是字詞，但語言模型不是。模型看到的是一串數字——每個數字對應詞表（vocabulary）裡的一個 token。Tokenization 就是把原始文字切成這些 token 的過程。

關鍵問題是：怎麼決定詞表裡有哪些 token？

最簡單的做法是按字元切：每個字母或漢字就是一個 token。但這樣詞表太小，序列太長，模型要花很多步才能理解一個詞的意思。另一個極端是按完整單詞切，但英文單詞量太大（加上各種變形），詞表會爆炸，而且遇到沒見過的新詞就無能為力。

現代語言模型用的是折衷方案：**subword tokenization**。常見的詞保留為整個 token（如 `the`、`is`），罕見的詞拆成更小的片段（如 `tokenization` → `token` + `ization`）。這樣詞表維持在可控範圍（通常 32,000 到 200,000 個 token），同時幾乎能表達任何文字。

## BPE：從字元開始合併

Byte Pair Encoding（BPE）是目前最主流的 subword tokenization 演算法。GPT 系列、Claude、LLaMA 都用它（或它的變體）來建詞表。

BPE 的運作方式：

1. **起點**：把訓練資料裡的所有文字拆成單一位元組（byte）或字元，這就是初始詞表
2. **數頻率**：統計所有相鄰 token 配對出現的次數
3. **合併最頻繁的配對**：把出現最多次的配對合成一個新 token，加進詞表
4. **重複**：回到步驟 2，繼續合併，直到詞表達到預設大小

舉個簡化的例子。假設訓練資料反覆出現 `low`、`lower`、`lowest`：

- 初始 token：`l`, `o`, `w`, `e`, `r`, `s`, `t`
- 最頻繁配對是 `l` + `o` → 合併成 `lo`
- 下一輪 `lo` + `w` → 合併成 `low`
- 下一輪 `e` + `r` → 合併成 `er`
- 下一輪 `e` + `s` → 合併成 `es`

幾輪之後，`low` 變成一個完整 token，`lower` 被切成 `low` + `er`，`lowest` 被切成 `low` + `es` + `t`。常見的片段自然會被合併成較大的 token，罕見組合則維持較小的片段。

BPE 的精髓在於它完全是**資料驅動**的——不需要任何語言學規則，只看頻率。

## 為什麼中文比英文貴

這是實際用 API 會遇到的問題：同樣語意的內容，中文消耗的 token 數量通常比英文多。

用 OpenAI 的 `cl100k_base` tokenizer（GPT-4 使用）實測：

| 句子 | Token 數 |
|------|----------|
| "Machine learning is a subset of artificial intelligence." | 8 |
| 「機器學習是人工智慧的子集。」 | 14 |

同樣的意思，中文用了快兩倍的 token。

原因在 BPE 的訓練資料。這些模型的訓練語料以英文為主，英文的常見詞組在合併過程中被大量壓縮成完整 token。`machine`、`learning`、`artificial`、`intelligence` 各自都是單一 token。

但中文在訓練資料中的比例低得多。BPE 合併時，中文字元配對的頻率排不上前面，所以很多漢字沒有被合進更大的 token。結果是：一個中文字常常被拆成 2-3 個 byte 級別的 token。「機」這個字在 UTF-8 裡占 3 個位元組，如果這 3 個位元組沒有在 BPE 訓練中被合併，它就要占 2-3 個 token。

Claude 的 tokenizer 相對好一些——Anthropic 在訓練時納入了更多多語言資料，常見中文字通常能被編碼為單一 token。但即便如此，中文的 token 效率仍低於英文，因為每個漢字承載的語意密度高（一個字就是一個語素），而 BPE 詞表的大小有限，無法為所有漢字組合都分配獨立的 token。

## 實際影響

Token 數量差異帶來兩個直接後果：

**費用差異**：API 按 token 計價。假設費率是每百萬 input token 3 美元，處理同樣語意的中文內容，成本可能是英文的 1.5 到 2 倍。

**上下文視窗被壓縮**：模型的上下文視窗以 token 為單位。128K token 的視窗，放英文大約能放 96,000 個英文單詞（約 300 頁），但放中文可能只有 40,000-50,000 個字（約 120-150 頁）。在做長文件分析或 RAG 時，這個差距很明顯。

## 不同模型，不同 Tokenizer

每個模型家族有自己的 tokenizer 和詞表：

- **tiktoken**（OpenAI）：GPT-3.5/4/4o 使用，詞表 `cl100k_base` 有 100,256 個 token，`o200k_base` 有 200,000 個 token。以 byte 為基礎的 BPE。
- **SentencePiece**（Google / Meta）：Gemini、LLaMA 使用，支援 BPE 和 Unigram 兩種演算法。直接在 Unicode 文字上操作，不先轉 byte。
- **Claude 的 tokenizer**：Anthropic 沒有公開 tokenizer 細節，但從行為觀察使用的是類似 BPE 的方法，詞表較大，對多語言支援優於早期 GPT 模型。

重要的是：**不同 tokenizer 對同一段文字會產生不同數量的 token**。在估算成本或上下文用量時，要用對應模型的 tokenizer 來計算，不能拿 OpenAI 的結果套到 Claude 上。

OpenAI 提供了線上工具 [Tokenizer](https://platform.openai.com/tokenizer) 可以直接看文字被切成哪些 token。想用程式計算，Python 可以用 `tiktoken` 套件。

## 小結

Tokenization 是模型理解文字的第一步，BPE 用純粹的頻率統計把文字切成大小適中的 subword 單位。因為訓練資料的語言分布不均，中文在大多數模型裡會消耗更多 token，直接反映在 API 費用和上下文容量上。

下一篇會往模型裡面走——這些 token 進入模型之後，是怎麼被轉換成 embedding 向量的。

## 參考資料

- Sennrich, R., Haddow, B., & Birch, A. (2016). [Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/). *Proceedings of the 54th ACL*.
- [OpenAI Tokenizer 工具](https://platform.openai.com/tokenizer)
- Kudo, T., & Richardson, J. (2018). [SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing](https://aclanthology.org/D18-2012/). *EMNLP 2018*.
- [OpenAI tiktoken 原始碼](https://github.com/openai/tiktoken)
