---
title: "CS224N 第 7 講：預訓練、subword 與 in-context learning"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, pretraining, language-model, tokenization, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 8
tldr: "第 7 講把預訓練拆成可擴張資料、subword tokenization、三種模型目標與 in-context learning；核心取捨是用通用的自監督目標換取可重用表示，再用下游訊號指定用途。"
description: "逐段讀 CS224N Winter 2026 Lecture 7：BPE、decoder/encoder/encoder-decoder 預訓練與大型模型。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-pretraining-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 7 講排在 2026 年 1 月 27 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture07-pretraining.pdf)題為 **Pretraining (Scaling, Systems, Data)**。agenda 有六段：動機、subword、從詞向量走到模型預訓練、三種架構、預訓練學到什麼，以及大型模型與 in-context learning。

## 為什麼預訓練能擴張

監督式任務仰賴人工標籤，資料量與任務範圍都受限。預訓練改從文字本身製造預測目標，讓模型能使用大規模、多樣且未標註的語料。之後再以少量標註資料、指令或 prompt 指定用途。

這不是免費知識。模型學到什麼取決於語料、tokenizer、目標函數、參數量與運算預算。資料更大只表示訓練訊號更多，不保證來源平衡、內容正確或下游行為可靠。

## Subword 解掉固定詞彙表的斷點

以完整單詞建詞彙表會把未見詞都映成 UNK。[Byte-pair encoding subword 方法](https://aclanthology.org/P16-1162/)從字元開始，反覆合併語料中最常見的相鄰單位，直到達到目標詞彙大小。常見詞可能保留完整，罕見詞與新詞則拆成已知 subword。

它在詞彙大小與序列長度間取捨：詞彙太小，序列變長；詞彙太大，稀有 token 缺資料。切分也不是語言學分析，同一個詞可能被拆成不直覺的片段。

## 三種預訓練方式

Decoder 使用左到右語言模型目標，天然適合生成。Encoder 以 masked language modeling 從雙向上下文恢復被遮住的 token，適合建立表示。Encoder-decoder 以來源條件生成目標，可用遮蔽 span 或文字到文字形式統一任務。

三者不是單純的模型大小差異，而是資訊可見範圍與訓練介面的差異。選擇時要看下游任務需要自由生成、雙向表示，還是明確的輸入到輸出轉換。

## 學到的是知識、能力，還是模式延續

投影片把「預訓練究竟教了什麼」列為獨立 interlude。行為證據可以顯示模型記住事實、捕捉語法或完成新任務，但不能只靠一次輸出決定內部表示。對大型 decoder 而言，in-context learning 又增加一層：參數不更新，模型僅從 prompt 中的說明或範例改變當次行為。

實務上要把三件事分開測：模型預訓練後已具備什麼、微調新增什麼、prompt 暫時引出什麼。混在一個 benchmark 分數裡，就無法知道能力從哪裡來。

## 從 static embedding 到 contextual model

Lecture 2 的 word2vec 每個詞只有一個向量。Model pretraining 把整個 encoder 或 decoder 一起訓練，使 token representation 依左右文改變。Bank 在金融句與河岸句會得到不同 hidden states，而不必先手工標 sense。

轉折不只在 representation，而是 transfer unit。Word embedding 只能把 input table 搬到新任務；pretrained model 搬走整套 composition function。下游任務可 fine-tune 全模型、加 task head，或只用 prompt/PEFT 調整。

這也帶來 representation layer 選擇。較低層常保留局部或形式資訊，較高層更受 objective 與 task 影響；不能不標 layer 就說「BERT embedding」。Pooling、subword alignment 與是否 fine-tuned 都會改結果。

## BPE walkthrough 與詞彙取捨

假設 corpus 先拆成 character 加 end-of-word。統計所有相鄰 pair，合併最高頻，例如 `l`+`o` 成 `lo`；重新計數再合併。反覆到 vocabulary budget。Training 完後 merge order 固定，新字串照同順序切分。

Vocabulary 大，常見字串 token 少、sequence 短，但 embedding table 大且 rare token 學習不足；vocabulary 小，coverage 穩定但 sequence 長，attention 成本增加。同一計費以 token 為單位時，不同語言切分還會產生成本差，Lecture 14 會完整展開。

Tokenizer 必須和 checkpoint 配對。換 tokenizer 不只是 input format 變動，embedding row 與 learned statistics 都不再對齊。新增 special token 後也要 resize embedding，並決定它如何取得 training signal。

## Decoder pretraining：從左到右預測

Decoder objective 最大化每個 token 在 prefix 下的 likelihood。Causal mask 防止看未來，所有位置都能產生 loss，因此資料使用密度高。生成介面和訓練介面一致：給 prefix，繼續文字。

優點是任務可統一成 text continuation，in-context examples 也自然放進 prefix。限制是 representation 只能看左側；對需要完整句子分類的任務，模型仍可用最後位置或額外格式，但資訊路徑和 bidirectional encoder 不同。

Loss 對常見 token 貢獻多，資料重複與 domain mix 直接塑造模型。Next-token accuracy 也不等於 factuality 或 instruction following；後兩者需要資料、後訓練與 evaluation 補上。

## Encoder pretraining：masked language modeling

Encoder 隨機遮住部分 token，利用雙向 context 恢復。[BERT](https://arxiv.org/abs/1810.04805) 的 input 可同時看左右，因此適合 classification、extraction 與 retrieval representation。Pretraining 中被 mask 的位置有直接 loss，其他位置透過 attention 間接受訊號。

Pretrain-finetune mismatch 是一個設計問題：`[MASK]` 在下游通常不出現。替換策略會保留部分原 token 或換成隨機 token，降低模型只依賴特殊符號。Mask rate、span length 與 dynamic masking 都影響學到的依賴。

Encoder 不天然提供自回歸 generation。可以反覆 mask/fill，但那不是原本介面。架構選擇應從 information flow 與 task 開始，而不是把 encoder/decoder 視為大小版本。

## Encoder-decoder pretraining：corruption 到 reconstruction

Encoder 讀被破壞的 source，decoder 生成 target。Span corruption 可把連續片段替換成 sentinel，再要求 decoder 輸出缺失內容。這讓 encoder 建立雙向來源表示，同時保留 generation 能力。

Text-to-text formulation 把 translation、summarization、classification 都寫成文字輸入到文字輸出。統一介面方便 transfer，但 label word 選擇與 decoding 仍影響 classification；生成完整 target 也比輸出 class id 成本高。

比較三種 pretraining 時要固定 data 與 compute。若 decoder 參數更大或看更多 token，不能把差異只歸因 objective。Downstream suite 也應涵蓋 representation 與 generation，避免偏向某一架構。

## Scaling 要同時看 data、model、compute

[Llama 3 技術報告](https://arxiv.org/abs/2407.21783)提供大型預訓練系統的具體案例；投影片把 compute-aware scaling 列為核心。參數、training tokens 與 FLOPs 必須平衡；固定 compute 下，盲目加大 model 會讓每個 token 看得太少，盲目加資料則模型容量不足。

Data quality 也不是一個 scalar。去重能避免 memorization 與 benchmark contamination；language/domain mixture 決定 coverage；filter 可能移除噪音，也可能系統性排除非標準語言。應保存來源比例與 filtering rule，而不是只報總 token。

大型 training system 還需要 distributed data/model parallelism、checkpoint 與 failure recovery。這些系統選擇會決定可達 batch、sequence 與實驗迭代速度，但不應被包裝成模型能力本身。

## 預訓練學到什麼：用 probe 要小心

Behavioral probe 可測 syntax、facts 或 relation 是否能從 hidden state 解碼。但強 probe classifier 可能自己學會任務；probe 成功只表示資訊可取得，不表示主模型在 prediction 時使用它。

Intervention 比 correlation 更強：修改 representation 或 input，看行為是否按 hypothesis 改變。仍需控制副作用，因為破壞 hidden state 可能同時影響很多特徵。

Memorization 與 generalization 也不是二分。模型可記住 phrase、抽取 pattern，再組合到新 context。查證 claim 時要用去重、時間切分、counterfactual 與近鄰分析，不能只因題目不在 exact training set 就稱為推理。

## In-context learning 的實驗設計

固定 checkpoint，不更新參數，只改 prompt 中 instruction、demonstrations 與 order。要分別測 zero-shot、few-shot、label permutation、example order 與格式。若 label permutation 後仍輸出原語意 label，模型可能依 prior 而非 demonstration mapping。

Context 中例子越多不一定越好。長 prompt 會增加成本，relevant examples 可能被干擾。選例策略、position 與 recency 都需報告。

今晚可做一個小實驗：選二元分類，建立十組相同 examples 不同 order 的 prompts，記錄 accuracy 與 prediction flip。這會把「prompt 敏感」變成可量 variation，而不是印象。

再加入一組完全不含 demonstration、只保留相同 token 長度的 control，區分改善來自範例內容還是單純更長 context。把每次 prompt 與 raw output 保存，不要只存 aggregate score；錯誤是否集中在 label mapping 或格式，必須回到原始輸出才能判斷。

## 材料缺口與編號註記

Winter 2026 錄影不公開。投影片封面保留「Lecture 6: Pretraining」舊標籤，但官方課表、日期、檔名與前後序列都確認它是本學期 regular Lecture 7。本文依課表編號，不推測舊標籤來源。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 7：Pretraining 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture07-pretraining.pdf)
- [Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [BERT](https://arxiv.org/abs/1810.04805)
- [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783)
