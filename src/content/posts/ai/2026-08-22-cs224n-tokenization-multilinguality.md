---
title: "CS224N 第 14 講：Tokenization 如何製造多語言成本差"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, tokenization, multilingual-nlp, bpe, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 15
tldr: "第 14 講從 word、character/byte 與 subword 切分一路走到 BPE failure cases 和跨語言公平：tokenizer 決定序列長度、運算成本與模型看到的語言單位，因此不是中立前處理。"
description: "逐段讀 Julie Kallini 的 CS224N Winter 2026 Lecture 14：BPE、glitch tokens、多語言遷移與公平。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)確認第 14 講在 2026 年 2 月 19 日由 Julie Kallini 客座主講；[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture14-guest-julie-tokenization-multilinguality.pdf)的 agenda 有五段：word/character-byte/subword tokenization、BPE 訓練、拼字與 glitch token 案例、多語言與跨語言遷移、公平與多語 tokenizer 挑戰。

## 切分單位先決定模型看見什麼

Word token 容易理解，卻遇到未見詞與形態變化。Character 或 byte vocabulary 很小、幾乎沒有 OOV，但序列更長。Subword 在兩者之間：常見片段合併，罕見形式分解。

「word」本身也不穩定。空白不一定是所有語言的詞界；縮寫、屈折、複合詞與具名實體都讓單一規則失效。

## BPE 如何學詞彙

[BPE subword 方法](https://aclanthology.org/P16-1162/)從基本符號開始，在訓練語料中重複找最常見相鄰 pair、建立 merge、再替換。Merge 次數決定詞彙大小。演算法只看頻率，不知道 morpheme 或語意，因此切分可能符合形態，也可能完全不直覺。

實際 tokenizer 還有 pre-tokenization、正規化、特殊 token 與 byte fallback。只寫「使用 BPE」不足以重現模型輸入；需要保存 tokenizer 檔與版本。

## Spelling、glitch tokens 與崩壞位置

模型處理拼字時不是直接看字母，而是看 token 序列。某些字串被切成罕見或不穩定單位，會讓計數、反轉與字元操作變難。Glitch token 則可能在 tokenizer 裡有單一 ID，訓練資料卻幾乎沒有可靠語境，導致異常行為。

這提醒我們：失敗不一定全在 Transformer。先印出 token IDs 與切分，常比直接改 prompt 更快找到問題。

## 多語言 tokenization 的公平問題

[XLM-R](https://arxiv.org/abs/1911.02116)這類多語模型以共同 tokenizer 促成跨語言參數共享與 transfer，但語料量大的語言更容易得到常見、較長的 token；低資源語言可能被切得更碎。同樣語意因此需要更多 token，造成更高 API 成本、更短有效 context 與更長運算路徑。

[Do All Languages Cost the Same?](https://arxiv.org/abs/2305.13707)提醒評估多語模型時，除了任務分數，也應比較每種語言的 fertility、UNK/byte fallback、每句 token 數與成本。把英文 tokenizer 直接套到所有語言，不是中立 baseline。

## 「詞」不是跨語言一致的單位

英文空白常近似詞界，但中文不以空白分詞，黏著語可在一個 surface form 裝入多個 morphemes。Contraction、compound、emoji、URL、code 也破壞簡單 word split。

Word-level vocabulary 對 productive morphology 產生巨大 long tail。UNK 把所有未見形式壓成同一 ID，模型失去拼字與詞根線索。Character/byte 保 coverage，卻把 sequence 拉長，long dependency 更難。

Tokenizer 是模型假設：決定哪些 variation 被共享、哪些被分開。不能只視為 data cleaning。

## Unicode、normalization 與 pre-tokenization

看起來相同字串可能由不同 Unicode code points 組成；accent 可是 composed 或 combining。NFC/NFKC normalization 會合併某些形式，也可能改掉語意/格式。Case folding 對 proper noun、土耳其語等不是中立。

Pre-tokenizer 先按空白、標點或 regex 切，再做 BPE。Merge 不能跨 pre-token boundary，因此同一 BPE algorithm 配不同 pre-tokenizer 會得不同 vocabulary。

Byte-level encoding 保證任意 Unicode 可表示，但一個非 ASCII character 可能多 bytes。實際 sequence cost 仍跨語言不同。

## BPE training walkthrough

準備 corpus frequency dictionary，詞尾加 marker，初始 symbols。每輪統計 adjacent pair frequency，選最高 pair merge，更新所有 words。Merge list 的順序就是 tokenizer model。

Tie-breaking、normalization、corpus sampling、vocab size、special token 都影響重現。Inference 不是重新找當前字串最高頻 pair，而是按 training merge ranks 套用。

Merge budget 小，常見 morpheme可能拆開；太大，整個 rare word 成 token 且 embedding 訊號少。Validation 可畫 fertility 與 downstream quality 對 vocab size。

## WordPiece、Unigram 與 BPE

WordPiece 常以 likelihood-like criterion 選 merge，而不是 raw pair frequency；Unigram 從大候選 vocabulary 出發，逐步移除，並可保留多 segmentation probability。名稱與實作變體很多，報告應給 tokenizer artifact，不只 algorithm family。

SentencePiece 可直接在 raw text 訓練，將空白納入 symbol，適合不依語言-specific tokenizer。它是工具/框架，內部可用 BPE 或 unigram，不能把兩者混為同一層級。

## Spelling 與 character task

問模型字母數、倒序或第 N 字元時，model 先看到 subwords。若整個 word 是一 token，內部沒有直接逐字元 timestep；能力來自 training pattern 或推理/工具，而非 tokenizer 提供明確 characters。

建立診斷時按 segmentation 分組：single-token word、多 subword、byte fallback。若 accuracy 隨 token count/rarity 改變，就有 tokenizer evidence。

工具使用可解 character 操作，但 evaluation 要區分 model-only 與 tool-assisted。

## Glitch token 的形成與測試

Vocabulary token 可能來自資料中的特殊字串、username 或 encoding artifact，頻率足以進 vocab，卻在清理後 training context 稀少。Embedding/behavior 未被穩定學習。

測試包括 decode-encode round trip、token frequency、不同 context completion、embedding norm/neighbor。不要在 production 隨機探測可能觸發 unsafe output；使用 sandbox。

修正可重新 tokenizer、增加 targeted data、禁止輸入或映射，但每種會破壞 checkpoint compatibility或語意。先定 risk。

## Multilingual pretraining 的資料分布

世界語言數千種，web corpus 高度不均。Temperature sampling 可上採低資源語言、下採高資源，增加 coverage，也可能重複少量低品質資料。

Language identification、dedup、script normalization 對低資源更容易誤刪。報每語言 tokens 不夠，還要 quality/provenance 與 code-switching policy。

Shared parameters 支援 transfer，也產生 interference。相似 script/語系不保證 transfer；task/data 會影響。

## Cross-lingual transfer 怎麼測

Zero-shot：某語言 fine-tune、另一語言 test；translate-train/test 使用翻譯資料；multilingual fine-tuning 混合。三者資源不同，需分開。

Parallel test sets 方便比較，但 translationese 不代表自然使用。加入 native-created data、dialect、code-switch與 domain slices。

Metric 也可能 English-centric。Token overlap 對不同形態語言不公平；human evaluation 需 native/domain expertise。

## Token fertility 與成本公平

Fertility 可定義一個 word/character 對應 tokens 數。相同內容在語言 A 2 倍 tokens，就支付更高 API 成本、占更多 context、decode 更慢。

比較時用平行語料，報 tokens per character/word/semantic unit、價格與 truncation rate。Character-based metric跨 script也需注意 bytes與 grapheme。

商業 tokenizer 版本更新可能改成本，研究要鎖 version/date。

## Vocabulary allocation 與 representation quality

共享 vocab budget 中，高資源語言拿較多 whole/subword entries。低資源被切碎，每 token training frequency可能反而高，但 sequence 變長且語意單位跨多位置。

增加 vocab 不是唯一解；language-specific adapters、byte models、mixture tokenizer 都有 storage/transfer trade-off。公平目標需定義：成本相等、品質相等或最差群改善。

## Tokenizer evaluation suite

Intrinsic：fertility、coverage、round-trip、vocab utilization、fragmentation by language。Behavioral：spelling、morphology、named entities、cross-lingual tasks。Operational：sequence length、latency、memory、price。

Safety：homoglyph、invisible chars、prompt boundary、special-token injection。Normalization 可能讓 visually similar attacks 合併或漏掉。

建立 regression corpus，tokenizer/model upgrade 時比較 IDs 與 downstream，不可只看平均 fertility。

## 可操作 BPE 練習

拿小 corpus 手算前十次 merges，記每輪 pair/count。用兩種語言平衡與不平衡 corpus 各訓練 tokenizer，比較固定句的 segmentation/fertility。

再固定小 language model architecture，僅換 tokenizer（調整 vocab 使總參數可比），看 loss、sequence compute與 rare-word task。這才能將 tokenization trade-off 和 model size 分開。

## 材料缺口

Winter 2026 錄影不公開。本文涵蓋 Julie Kallini 投影片的五段 agenda；現場語言案例與口頭討論未公開，因此不補寫。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 14：Tokenization and Multilinguality 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture14-guest-julie-tokenization-multilinguality.pdf)
- [Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [Unsupervised Cross-lingual Representation Learning at Scale](https://arxiv.org/abs/1911.02116)
- [Do All Languages Cost the Same?](https://arxiv.org/abs/2305.13707)
