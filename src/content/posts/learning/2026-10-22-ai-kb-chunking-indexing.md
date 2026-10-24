---
title: "切塊與索引：要切多大、用什麼搜，以及怎麼知道選對了"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, chunking, hybrid-search, embedding]
lang: zh-TW
tldr: "建索引要做三個決定：切塊的單位、用關鍵字還是向量還是兩者都用、用哪個 embedding 模型。這三個都是半永久的選擇，改了就要整批重建。研究的建議偏保守：語意切塊沒有一致比較好，按句子或按文件結構切通常就夠；overlap 的效果很小、依設定而定。繁體中文的一項研究裡，正確段落排在第一名的比例，只用向量搜尋 57%，關鍵字搜尋 76%，兩者混合 81%。不要憑感覺選：用 order 11 的測試題比較兩種設定，一次只改一件事。"
description: "知識庫怎麼建 order 16：三個決定為什麼是半永久的、切塊單位怎麼選（語意切塊與 overlap 的研究）、關鍵字與向量與混合檢索在繁中的表現、embedding 模型與語言，以及怎麼用測試題比較兩種設定。"
series:
  name: "知識庫怎麼建"
  order: 16
---

> 🌏 [English version](/posts/learning/2026-10-22-ai-kb-chunking-indexing-en)

客服同事問 AI：「型號 A-3021 的保固是幾年？」產品手冊裡寫得清清楚楚，AI 卻說找不到。原因有兩個：手冊被每 500 字切一段，「A-3021」在一段的結尾，保固年限在下一段的開頭；而且系統只用向量搜尋，「A-3021」這種編號，在向量裡跟「A-3012」幾乎分不出來。

這篇是「知識庫怎麼建」AI 段的第六篇。[order 15](/posts/learning/2026-10-22-ai-kb-metadata-schema) 定好了每一段要帶哪些欄位，這篇談文件要切多大、用什麼方式搜，以及怎麼知道選對了。各種切塊演算法和重新排序的細節，站內的[〈Chunking 策略〉](/posts/ai/2026-03-12-chunking-strategies)有更完整的介紹，這篇不重複。讀完你能用測試題比較兩種切塊設定，選出比較好的一個。

## 三個決定，都是半永久的

建索引要做三個決定：

1. **切塊的單位**：一段多大、依什麼切。
2. **用什麼搜**：關鍵字、向量，還是兩者都用。
3. **embedding 模型**：用哪個模型把文字轉成向量，它懂不懂你的語言。

說它們半永久，是因為改了就要重建。換切法，所有文件要重新切；換 embedding 模型更麻煩，MongoDB 的文件說得很清楚：不同模型產生的向量不能互相比較，即使維度相同，也要把所有文件重新算一次向量（[MongoDB: Migrate to a new embedding model](https://www.mongodb.com/docs/voyageai/tutorials/migrate-embedding-model/)）。所以值得在一開始就用測試題比較過。

## 決定一：切塊的單位

**語意切塊沒有一致比較好。** 語意切塊是用 embedding 判斷哪裡換了主題，在那裡切開。Qu 等人 2025 年在幾個資料集上比較，在本來就是長文件的資料上，按固定句數切的效果最好；語意切塊只在作者把很多短文拼成一篇、主題很雜的資料上明顯勝出（[Qu et al. 2025](https://aclanthology.org/2025.findings-naacl.114/)）。他們也發現，embedding 模型選哪個影響很大，最好的模型平均比次好的高 7% 多。

**按句子切，跟語意切差不多。** Bennani 和 Moslonka 2026 年的比較裡，按句子切和語意切的分數幾乎一樣，都比按固定 token 數切略好（[Bennani & Moslonka 2026](https://arxiv.org/abs/2601.14123)）。

**overlap 的效果很小、依設定而定。** overlap 是讓相鄰兩段重疊一部分，避免句子被切斷。Bennani 和 Moslonka 在他們的設定下加了 20% 的 overlap，分數幾乎沒變，段落數卻多了四分之一。Chroma 2024 年的技術報告在多數設定下也沒看到 overlap 有幫助，但用小的 embedding 模型、按固定 token 數切時，有 overlap 的召回率明顯較高（[Chroma 2024](https://www.trychroma.com/research/evaluating-chunking)）。同一份報告也發現，OpenAI 預設的 800 token、重疊 400 的設定，召回略低於平均。所以比較穩的說法是：overlap 有沒有用要看你的設定，測不出差別就不要開。

**我的建議：** 先依文件結構切，也就是 [order 13](/posts/learning/2026-10-22-ai-kb-parsing-cleaning) 提到的依標題階層切、每段附上標題路徑；結構不明顯的長文，再按句子組成段落。語意切塊和大的 overlap，等測試題顯示有需要再加。Qu 等人在分析錯誤時也觀察到，固定切法的問題常常可以靠「先按章節切」解決。

## 決定二：用關鍵字、向量，還是兩者都用

向量搜尋擅長找意思相近的內容，但對專有名詞、編號、代碼這類要一字不差的東西不擅長；關鍵字搜尋（例如 BM25）正好相反。

**繁體中文的研究，關鍵字搜尋並不差。** 政治大學的 Hsu 和 Tzeng 2025 年用繁體中文的閱讀理解資料集 DRCD 比較，正確段落排在第一名的比例：只用 OpenAI 的向量模型 57%，只用 BM25 76%，兩者混合 81%（[Hsu & Tzeng 2025](https://arxiv.org/abs/2503.23013)）。

**文字不乾淨時，混合不一定贏。** 同一團隊用掃描財報做的另一項研究發現，OCR 文字沒清乾淨時，BM25 反而勝過混合檢索；把文字清乾淨之後，混合檢索才最好（[Hsu et al. 2025](https://arxiv.org/abs/2503.08452)）。這也呼應 order 13：解析品質會影響後面每一步。

**混合也不一定值得它的代價。** [order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first) 提過 Kucia 和 Gawlik 的研究（[Kucia & Gawlik 2026](https://arxiv.org/abs/2609.14579)）：在真實使用者的問題上，混合檢索沒有比純向量檢索準，卻比較慢。

所以我的建議是：繁體中文的知識庫，預設用混合檢索，因為編號、型號、人名、法規條號這類查詢很常見；但用測試題確認它在你的資料上真的比較好。混合檢索怎麼做，站內的[〈Hybrid Search〉](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)有介紹。

## 決定三：embedding 模型與語言

embedding 模型懂不懂你的語言，差別可能很大。C-Pack 研究團隊 2024 年建立了一套中文 embedding 的評測基準，在同一批中文檢索題上，OpenAI 的 text-embedding-ada-002 得分 52，他們自己的 BGE-large 得分 71.5（[Xiao et al. 2024](https://doi.org/10.1145/3626772.3657878)）。要注意三件事：評測基準和 BGE 模型出自同一個團隊；資料是簡體中文，沒有繁體中文；ada-002 是較舊的模型，作者自己也說中文 embedding 之後進步很多。

所以選模型的方式，還是用你自己的測試題：挑兩三個候選模型，各建一次索引，看出處段落有沒有排進前幾名。站內的[〈BGE-M3〉](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)和[〈換更貴的 embedding 救不了繁中 RAG〉](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)談了繁中的實際經驗；embedding 是什麼，可以看[〈Embedding：模型怎麼把文字變成可以計算的向量〉](/posts/ai/2026-08-26-understanding-ai-models-embedding)。

## 怎麼用測試題比較兩種設定

order 11 的每一題都附了出處段落，這就是比較的依據：

1. **定一個指標。** 最簡單的是「出處段落有沒有出現在前 5 名」，每題算 1 或 0，平均起來就是命中率。
2. **一次只改一件事。** 例如切法不同、其他都一樣；同時改切法和模型，就分不出是哪個造成的差別。
3. **兩種設定各建一次索引，跑完所有測試題。** 記下每一題兩邊的結果。
4. **看整體，也看個別題目。** 整體命中率高的那個，不一定每題都好；把兩邊結果不同的題目挑出來看，常常能看出是哪一類問題受影響，例如編號題、跨段落的題。
5. **題目太少時，差一兩題不算數。** 20 題裡差一題，可能只是運氣；看到明顯差距、或某一類題目一致變好，再做決定。

## 例子：同一題，兩種切法

問題：「型號 A-3021 的保固是幾年？」出處：〈產品手冊〉第 4 章〈保固〉。

**設定 A：每 500 字切一段，只用向量搜尋。**

前 5 名裡有三段在講其他型號的保固，一段是 A-3021 的規格表，出處那段排第 9。因為切點落在型號和保固之間，保固年限那段裡沒有「A-3021」這幾個字。

**設定 B：依標題切，每段附上標題路徑，混合檢索。**

出處那段變成「產品手冊 > A-3021 > 4. 保固」，型號就在標題路徑裡；關鍵字搜尋直接比對到「A-3021」，這段排第 1。

如果 20 題測試題裡，設定 B 的命中率明顯較高，而且編號類的題目都變好了，就選 B。

## 研究的限制

Qu 和 Bennani 用的是英文資料，Bennani 是在稀疏檢索、英文維基百科的條件下測 overlap，不能直接推到向量檢索；Chroma 的報告是廠商自己的評測。繁體中文的兩項研究分別是閱讀理解資料集和掃描財報，不是一般企業文件。C-Pack 是簡體中文。切塊和檢索的最佳設定高度依賴資料，這些研究能告訴你「不必一開始就上複雜的做法」，但不能告訴你「你的資料該用哪一種」。

## 今晚可以做的事

1. **查一下你現在的切塊設定。** 切多大、有沒有 overlap、依什麼切；很多工具的預設值你可能沒改過。
2. **查一下你用的是哪種搜尋。** 只有向量的話，挑三題含編號或專有名詞的測試題，看找不找得到。
3. **建一個依標題切的索引，跟現在的比一次。** 用 order 11 的測試題，算前 5 名命中率。
4. **記下目前的設定和結果。** 之後換模型、換切法，都拿這份紀錄比。

## 自我檢查

**問：** 繁體中文的語料只用向量搜尋，可能漏掉什麼？

**判準：** 漏掉要一字不差比對的東西：專有名詞、產品型號、文件編號、法規條號。向量搜尋把意思相近的內容放在一起，「A-3021」和「A-3012」在向量上幾乎一樣；繁中的研究也看到，關鍵字搜尋勝過純向量。掃描檔的錯字還會讓這個問題更嚴重。所以預設加上關鍵字搜尋，並在測試題裡放幾題編號和專有名詞的題目。

## 參考資料

- [MongoDB Docs, Migrate to a New Embedding Model](https://www.mongodb.com/docs/voyageai/tutorials/migrate-embedding-model/)
- [Qu, Tu & Bao 2025, Is Semantic Chunking Worth the Computational Cost? (Findings of NAACL 2025)](https://aclanthology.org/2025.findings-naacl.114/)
- [Bennani & Moslonka 2026, A Systematic Analysis of Chunking Strategies for Reliable Question Answering (ECIR 2026, arXiv)](https://arxiv.org/abs/2601.14123)
- [Chroma 2024, Evaluating Chunking Strategies for Retrieval](https://www.trychroma.com/research/evaluating-chunking)
- [Hsu & Tzeng 2025, DAT: Dynamic Alpha Tuning for Hybrid Retrieval in Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2503.23013)
- [Hsu, Lin, Lin & Tzeng 2025, KAP: MLLM-assisted OCR Text Enhancement for Hybrid Retrieval in Chinese Non-Narrative Documents (arXiv)](https://arxiv.org/abs/2503.08452)
- [Kucia & Gawlik 2026, Beyond Benchmark Scores: How Synthetic and Authentic Query Distributions Diverge in RAG Evaluation (CIKM 2026, arXiv)](https://arxiv.org/abs/2609.14579)
- [Xiao et al. 2024, C-Pack: Packed Resources For General Chinese Embeddings (SIGIR 2024)](https://doi.org/10.1145/3626772.3657878)
- 站內：[Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies)
- 站內：[Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- 站內：[BGE-M3：為什麼這個 Embedding 模型適合繁體中文 RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
- 站內：[換更貴的 embedding 救不了繁中 RAG：三層失敗成因與補救順序](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)
- 站內：[Embedding：模型怎麼把文字變成可以計算的向量](/posts/ai/2026-08-26-understanding-ai-models-embedding)
