---
title: "換更貴的 embedding 救不了繁中 RAG：三層失敗成因與補救順序"
date: 2026-06-04
category: ai
type: deep-dive
tags: [rag, embedding, traditional-chinese, retrieval, llm]
lang: zh-TW
tldr: "繁中 RAG 檢索失敗是三層疊加：embedding 的粒度缺陷（BGE/GTE 從 0.1B 到 7B 都在「炸鸡」這種簡單 query 上排錯）、簡中/英文語料主導造成的在地詞彙偏移（保費、不保事項對齊不可靠）、MTEB 中文榜是簡體導致選型訊號失真。修復是架構性的：OpenCC 正規化 → hybrid + jieba 斷詞 → reranker → 最後才是在地微調——而且一切前提是先建繁中專屬 eval set。"
description: "整理繁體中文 RAG 的 embedding 失敗模式與低資源 retrieval 策略：CapRetrieval 的粒度缺陷實證、繁中在地詞彙的 cross-lingual 對齊問題、ihower 繁中 benchmark 的選型結論，以及按 ROI 排序的六種工程補救與評測方法。"
draft: false
glossary:
  - term: "CapRetrieval"
    definition: "WeChat AI 提出的中文細粒度檢索 benchmark（arXiv:2506.08592），實證 encoder 在「對齊整段語意」與「凸顯細粒度實體」之間互相拉扯，模型加大也救不了。"
    context: "本文用它證明繁中 RAG 檢索失敗的第一層：embedding 的粒度缺陷。"
---

繁中 RAG 檢索出包時，最常見的反應是「換一顆更大、更貴的 embedding 模型」。但實證說這幾乎沒用：CapRetrieval（arXiv:2506.08592）實測 BGE 與 GTE 系列**從 0.1B 到 7B**——都是 MTEB 中文榜前段的模型——對「炸鸡」「紫色的花」這種簡單 query 仍然把較不相關的段落排在更相關的之上，論文直說這現象「universal regardless of training sources and model sizes」。

繁中檢索失敗不是單一問題，是三層疊加。這篇把三層拆開，給出按 ROI 排序的補救清單，以及一切的前提：先有繁中專屬的 eval set。

## 第一層：embedding 的本質缺陷（跨模型普遍）

Bi-encoder 把整段語意壓進一個固定向量，必然丟資訊——丟掉的剛好常是**細粒度實體與事件的區辨力**。這不是中文特有的問題（站內[語意相似 ≠ 檢索相關](/posts/ai/2026-06-04-semantic-similarity-retrieval-relevance-gap)有完整展開），但 CapRetrieval 用中文評測集證明了它在中文場景同樣成立，而且**放大模型救不了**。

疊加上去的通用問題還有：chunk 失去上下文（「它成長了 40%」缺主詞與時間，向量無意義——解法見站內 [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval)）、領域 OOV（泛用 embedding 抓不到專業語義細節）。

## 第二層：簡中 / 英文語料主導，繁中表徵偏移

多語 embedding（E5、BGE、GTE 的 multilingual 版）的訓練資料大宗是英文或簡體中文。繁中與簡中**不只字形不同，制度詞彙與表述也不同**：「保費」「不保事項」「淨利」這類台灣與香港的財經、法律用語，在以簡中與通用語料訓練的 encoder 中對齊不可靠——後果是「**剛好是最重要的那些文件系統性檢索失敗**」（AICUP 繁中財經 CLIR 研究與企業實務報告的一致觀察）。

對在地企業知識庫（公文、保單、法遵、產品術語）來說，這個失敗模式命中的正是最關鍵的內容。

另一個隱性坑：簡繁轉換不對稱。OpenCC 的繁→簡是多對一、安全；**簡→繁有一對多歧義**，命名實體容易轉錯——做字形正規化時方向要想清楚。

## 第三層：評測基準缺繁中，選型訊號失真

MTEB 的中文部分（C-MTEB，35 個資料集）**是簡體、榜上幾乎是中國模型**。用 MTEB 分數選 embedding，等於用簡中當繁中的代理——分數高不代表繁中場景好。

繁中社群最直接的對照是 [ihower 的繁中 embedding benchmark](https://ihower.tw/blog/12167)：用 TCEval-v2 的台達 DRCD 資料（1000 段、3493 題）逐題算 Hit Rate 與 MRR。兩個可驗證的結論：**OpenAI embedding 不是繁中最強**（雖是社群預設推薦），表現最好的是 **voyage-multilingual-2** 與 **multilingual-e5-large** 這類多語模型（精確數字請見原文與其留言區）。Qwen3-Embedding 在 CMTEB 上勝過 BGE-M3 的報告也存在——但 CMTEB 是簡中，繁中場景要自己驗。

## 補救：按 ROI 排序的六招

修復是**架構性的**，不是換模型：

| # | 策略 | 做什麼 | 成本 |
|---|---|---|---|
| ① | Script 正規化 | index 與 query 都先用 OpenCC 統一字形，消除簡繁 mismatch（注意簡→繁的一對多） | 低 |
| ② | Hybrid（BM25 + dense）+ RRF | 補 dense 抓不到的精確關鍵字與實體——正是第一層的弱點 | 低 |
| ③ | 繁中 BM25 先斷詞 | OpenCC → jieba 斷詞再 BM25，勝過 character-level（單源實務報告，但合理） | 低 |
| ④ | Reranker 二階段 | top-k 放大 → cross-encoder 重排取前 N；台灣社群實測「幾乎所有 embedding 經 rerank 都改善」，首選 bge-reranker-v2-m3 | 中（延遲） |
| ⑤ | BGE-M3 單模型 hybrid | 一顆模型同時出 dense + sparse + multi-vector，原生支援繁簡英，省掉維護兩套 index | 中 |
| ⑥ | 在地微調 | 用自家繁中語料做 contrastive fine-tune | 高，最後做 |

①②③ 不換模型就能上，是低成本高回報；hybrid 與 reranking 的細節，站內 [hybrid search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)、[cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking)、[BGE-M3 選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)各有一篇。

第⑥招值得多說一句：低資源 retrieval 的研究給了務實路徑——**用 LLM 合成 triplet 資料做對比微調**。CapRetrieval 用 LLM 生成資料補強後，**自訓的 0.1B encoder 超越 7B baseline**；另一篇（arXiv:2603.22290）顯示 mE5 用**僅 10k 筆含噪合成 pair** 微調就有效。繁中相對簡中是「中度低資源」（字形資源足、高品質標註檢索資料缺），這些通用發現可以直接借用——小模型微調後常勝過大模型 zero-shot。

## 前提：先建繁中 eval set

上面每一招的效果都無從驗證，除非先有繁中專屬評測：

1. **資料**：複製 ihower 做法用 TCEval-v2 / DRCD 起步；更好的是從自家知識庫與真實 query log 建內部 eval set——最貼合在地詞彙的失敗模式。
2. **指標**：Hit Rate / Recall@k、MRR、nDCG@3。
3. **設計要點**：對照組必須含**在地詞彙與專業術語 query**（保單、法遵、公文）才能暴露第二層失敗；加入仿 CapRetrieval 的**簡單實體 query 探針**測第一層；用同義改寫防 BM25 走捷徑。
4. **變因掃描**：chunk size（64/128/256/512）、embedding 模型、retriever 組合（dense / bm25 / hybrid / hybrid+rerank）、top-k——CRUD-RAG（arXiv:2401.17043）的中文全組件評測是方法學參考。

## 整體來說

繁中 RAG 的檢索失敗 = 模型本質缺陷 × 簡中語料偏移 × 評測缺繁中，三層各有對策但**沒有一層的對策是「換更大的模型」**。落地順序：先建繁中 eval（沒有它一切都是猜）→ 正規化 + hybrid + 斷詞三招低成本上線 → 加 reranker → 最後才考慮在地微調。在地術語密集的知識庫（法遵、保險、公文）最該優先上 hybrid + rerank；通用閒聊型知識庫可以寬鬆些。

## 參考資料

- [Dense Retrievers Can Fail on Simple Queries / CapRetrieval（arXiv:2506.08592）](https://arxiv.org/abs/2506.08592)
- [CRUD-RAG: 中文 RAG 全組件評測（arXiv:2401.17043）](https://arxiv.org/abs/2401.17043)
- [ihower — 繁體中文 embedding 檢索評測](https://ihower.tw/blog/12167)
- [ihower — zh-tw-embedding-model-benchmark（GitHub）](https://github.com/ihower/zh-tw-embedding-model-benchmark)
- [BGE-M3（Hugging Face）](https://huggingface.co/BAAI/bge-m3)
- [Adapting Text Embeddings for Low-Resource Languages（arXiv:2603.22290）](https://arxiv.org/abs/2603.22290)
- [LUSIFER: Cross-lingual 共享語義空間（arXiv:2501.00874）](https://arxiv.org/abs/2501.00874)
- [Advancing RAG in Low-Resource Languages（arXiv:2501.04858）](https://arxiv.org/abs/2501.04858)
- [OpenCC（GitHub）](https://github.com/BYVoid/OpenCC)
- [jieba 中文斷詞（GitHub）](https://github.com/fxsjy/jieba)
