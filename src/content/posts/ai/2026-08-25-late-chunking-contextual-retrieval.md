---
title: "Late Chunking vs Contextual Retrieval：先編碼後切塊的零成本上下文 vs LLM 前置生成的精準度交易"
date: 2026-08-25
category: ai
type: deep-dive
tags: [rag, chunking, late-chunking, contextual-retrieval, embedding, retrieval]
lang: zh-TW
tldr: "Anthropic Contextual Retrieval 用 LLM 為每塊生成 50-100 token 前置上下文把失敗率從 5.7% 壓到 1.9%（含 rerank），成本約 $1.02/1M tokens；Late Chunking 先以 32K 長上下文模型全文件編碼再切塊 mean-pool，零額外 LLM 成本，取捨在窗口、延遲與文件結構。"
description: "按機制對比兩種讓 chunk 帶上下文的作法：Anthropic Contextual Retrieval 的 LLM 前置生成與 Late Chunking 的先編碼後切塊（無需訓練），含 RAPTOR 摘要樹延伸對照、成本/延遲/窗口三軸表與可貼上的 transformer + mean-pool 實作偽碼。"
series:
  name: "RAG 技法大全"
  order: 48
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-late-chunking-contextual-retrieval-en)

檢索的失敗常常不是模型不夠強，而是切塊把上下文切丟了。同一份文件裡「前文提到的那個條款」「上段那家公司」一被切開，單塊的向量就只剩殘句，查再多也對不上。

這篇把 2025 年最常被拿來對照的兩條路線攤開來比：[Anthropic Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)（2024-09-19，用 LLM 為每塊補一句話）與 [Late Chunking](https://arxiv.org/abs/2409.04701)（arXiv:2409.04701，先讓模型看完全文再切）。讀完你會得到：兩者的機制與成本差在哪、與純切塊相比提升多少、[RAPTOR](https://arxiv.org/abs/2401.18059)（arXiv:2401.18059）摘要樹為何是另一條軸、何時該付 LLM 的錢何時不該，以及一段可直接改成生產程式碼的 Late Chunking 偽碼。

## 純切塊為什麼會丟上下文

設計哲學上，純切塊（naive / recursive / semantic）信奉「先切再算」：把文件按字數或語意切成 400-800 token 的塊，每塊獨立丟進 embedding 模型，得到一組互不相干的向量。這個設計的優點是簡單、可平行、對模型窗口零要求；缺點是每塊的向量只看見塊內文字，指代與主题全斷。

與替代方案相比，純切塊的盲點在兩個地方最明顯：一是前置指代（"上述條款適用於..."），二是跨段主題（塊內的「營收成長 12%」若不知道是哪家公司，就無法命中「A 公司營收」這類查詢）。實務常見的 workaround 是把 chunk 加大或加 overlap，前者把延遲與 token 成本推高，後者只能緩解邊界，切中間的句子仍孤立。

適合情境是語句自足的語料——FAQ、短句知識庫、每塊都像一則獨立摘要的文件；不適合的是長文件、合約、論文、產品手冊這類「後文依賴前文」的語料。具體用法就是你現在多數 pipeline 預設的那套；限制是召回上碰到天花板，再怎麼調 embedding 模型都補不回丟掉的上下文。

```python
# 純切塊：每塊獨立編碼，互不知情
chunks = split(text, size=512, overlap=50)  # 固定大小切
vectors = [embed(c) for c in chunks]        # 各算各的
# 問題：chunks[7] 內的「該條款」已失去對 chunks[2] 的指代
```

## Contextual Retrieval：用 LLM 幫每塊寫一句「這段在說什麼」

[Anthropic Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 的設計哲學是「把上下文補回文字，再算向量」——既然切塊丟了前文，就讓 LLM 在索引階段為每塊生成 50-100 token 的前置說明，把該塊在整份文件中的定位寫回文字本身。官方方法有兩層：Contextual Embeddings（前置文字參與 embedding）與 Contextual BM25（前置文字參與詞彙檢索），兩者可疊加，再加 rerank 進一步篩選。官方的說法很直白：*_Contextual Retrieval ... prepends chunk-specific explanatory context_*——靠文字本身把「這段出自哪裡、在講哪個主題」帶進檢索。

與純切塊相比，Anthropic 在內部知識庫基準上給出明確的階梯數據：單用 Contextual Embeddings 將失敗率從 5.7% 降至 3.7%（-35%），兩者疊加降至 2.9%（-49%），再加 rerank 降至 1.9%（-67%）。這些數字與純向量基線對比，不建議外推為通用提升比——但作為「有上下文 vs 無上下文」的對照，方向是穩定的。與 [Late Chunking](https://arxiv.org/abs/2409.04701) 相比，Contextual Retrieval 的語意補得更直白（LLM 用自然語言重述），因此在實體指代高度歧義、或文件結構含大量隱含前提時，往往更準；代價是每塊一次 LLM 調用。

適合情境是高價值問答、法規/合約/醫學文獻這類「答錯成本高、文本高度互依」的場景，且團隊願意為召回付前置成本；不適合情境是海量日更語料、低單價問答、或已用 BM25 為主的關鍵字精確匹配（此時前置文字對詞彙檢索的增益有限）。

具體用法（索引時，概念範例）：

```python
# Contextual Retrieval 索引：每塊調用 LLM 生成前置
import anthropic

def contextualize(chunk: str, doc: str) -> str:
    resp = anthropic.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=120,
        messages=[{
            "role": "user",
            "content": f"文件：\n{doc[:8000]}\n\n待加上下文的塊：\n{chunk}\n\n請用 50-100 字說明此塊在文件中的脈絡（主體/章節/指代對象），只輸出說明。"
        }]
    )
    return resp.content[0].text.strip() + "\n---\n" + chunk

enriched = [contextualize(c, full_doc) for c in chunks]
vectors  = embed_batch(enriched)  # 前置已混入向量
# BM25 亦可用 enriched 建索引，達到 Contextual BM25
```

限制與注意：Anthropic 官方估算的前置成本約 $1.02/1M tokens（以 800 token 塊 / 8K 文件為假設，僅作基準，實際依塊大小與模型計費而異）；此成本發生在索引時而非查詢時，但對百萬塊語料仍可觀。此外前置生成的品質依賴提示詞與文件截斷策略，過短的提示會讓 LLM 猜測，過長則把索引延遲與費用拉高。務實做法是先對 1,000 塊試跑，量「前置 vs 無前置」在自家標註集上的失敗率差，再決定是否全量。

## Late Chunking：先讓模型看完全文，再切塊池化

[Late Chunking](https://arxiv.org/abs/2409.04701)（Jina AI，2024-09-07 v1 → 2025-07-07 v3）的設計哲學剛好反過來：**先編碼，再切**。把整份文件一次性送進長上下文的 embedding 模型（如 [jina-embeddings-v5-text](https://arxiv.org/abs/2602.15547)（arXiv:2602.15547）small 32K / nano 8K、[jina-embeddings-v4](https://arxiv.org/abs/2506.18902)（arXiv:2506.18902）等多模模型），讓 transformer 自注意力先在文件內部跑完，得到每個 token 帶全篇上下文的表示，再依原先的切塊邊界對 token 向量做 mean-pool，得到「已上下文化的 chunk 向量」。

與純切塊相比，Late Chunking 的差異不在文字，而在向量產生的時機——純切塊的 chunk 向量只見過塊內 token，Late Chunking 的 chunk 向量見過全文件的 token。與 [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 相比，前者靠 LLM 的自然語言重述補上下文，後者靠編碼器的注意力隱式帶上下文；前者更準但每塊一調用，後者零額外 LLM 成本、一次前向即得全部分塊向量，但受限於編碼模型的窗口上限。

適合情境是預算有限、語料量大、且已採用 32K 長上下文 embedding 模型的團隊；特別是段落間指代多、但文件結構仍在單模型窗口內可容的場景，Late Chunking 的性價比最高。不適合情境是文件遠超 32K（論文提及的長文長度邊界）、或文件本身就是高度獨立的短句集合——此時全文件注意力分不到多少跨塊訊號，收益遞減。

限制與注意：Late Chunking **無需額外訓練**，任何支援長上下文的 embedding 模型理論上可用，但前向的記憶體與延遲隨文件長度線性上升，超長文件仍需滑窗分段再融合；同一份文件若需頻繁增刪，整文件重編碼的成本高於單塊增量。實務上建議在自家語料上對照「純切塊 vs Late Chunking vs Contextual Retrieval 小樣本」三組，再決定預設策略。

## RAPTOR：當「切」本身不夠，需要長出多尺度索引

如果 Contextual Retrieval 與 Late Chunking 都是在「讓同一尺度的 chunk 帶上下文」，[RAPTOR](https://arxiv.org/abs/2401.18059) 則把索引長成一棵樹。它的設計哲學是遞迴抽象：先嵌入、聚類、再對每簇做摘要，摘要再嵌入、再聚類、再摘要，直到頂端，形成「原文塊 → 摘要 → 更粗摘要」的多層樹。查詢時可同時命中細節與全局，適合需要跨層推理的問答。

與前兩者相比，RAPTOR 解決的不是「單塊孤立」而是「單一粒度不夠」的問題——[Anthropic Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 與 [Late Chunking](https://arxiv.org/abs/2409.04701) 讓細塊更準，RAPTOR 則額外提供中層與頂層的抽象節點，讓「總結整批文件」與「找到某個細節」可在同一索引中切換。論文在 QuALITY 等任務上回報 GPT-4 + RAPTOR 較最佳基線有最高約 20% 的絕對準確率提升（偏多步綜合型任務，單段事實型任務增益較小）。

適合情境是多步推理、全局總結、與「同一語料需同時服務細查與綜述」的產品；不適合情境是語料更新頻繁——樹的重建與摘要更新涉及多層 LLM 調用，增量比 Late Chunking 昂貴。具體用法上，RAPTOR 與前兩者可疊加：用 Late Chunking 產生帶上下文的葉節點，再以 RAPTOR 長出摘要父節點，兼具兩者的增益。

限制是成本與延遲：建樹階段的聚類與多輪摘要皆為離線成本，查詢時若做 tree-traversal + 扁平檢索的混合，延遲高於單層檢索。選型時把它當成「延伸對照」而非預設：大多數單跳問答不需要樹，先讓 chunk 帶上下文，再量是否仍缺全局抽象。

```python
# RAPTOR 概念：葉塊 → 摘要父節點（多層）
leaf_embeddings = embed(chunks)
clusters = cluster(leaf_embeddings)  # 例如 GMM / k-means
summaries = [llm.summarize([chunks[i] for i in c]) for c in clusters]
parent_embeddings = embed(summaries)  # 新一層，遞迴向上
# 檢索時：同時比對 leaf 與 parent，按需回填
```

## 三軸對比：成本、延遲與窗口

| 維度 | 純切塊 | Contextual Retrieval | Late Chunking | RAPTOR 摘要樹 |
|---|---|---|---|---|
| **機制** | 先切再各別編碼 | 每塊 LLM 生成 50-100 tok 前置再編碼 | 全文件先編碼再依邊界 mean-pool | 嵌入→聚類→摘要遞迴長樹 |
| **索引成本** | 最低（僅 embedding） | 高（每塊一次 LLM，約 $1.02/1M tok 基準） | 低（一次長上下文前向，無額外 LLM） | 最高（多輪 LLM 摘要） |
| **查詢延遲** | 最低 | 與純切塊相近（前置在索引期） | 與純切塊相近，略增編碼時長 | 較高（跨層檢索/遍歷） |
| **窗口限制** | 無（塊小） | 無（分塊生成） | 受限於 embedding 模型窗口（如 32K，超長需滑窗） | 受限於摘要用 LLM 窗口 |
| **最強情境** | 短句自足語料 | 高價值、歧義高的長文件問答 | 預算有限的長文件、指代多 | 多步推理與全局總結 |
| **首見連結** | — | [Anthropic CR](https://www.anthropic.com/news/contextual-retrieval) | [arXiv:2409.04701](https://arxiv.org/abs/2409.04701) | [arXiv:2401.18059](https://arxiv.org/abs/2401.18059) |
| **增量更新** | 單塊重算 | 單塊重生成 | 整文件重編較貴 | 需重建受影響子樹 |

快速判斷：若文件可在 32K 內放下且預算緊，先試 Late Chunking；若答錯成本高且指代歧義重，付 Contextual Retrieval 的錢；若問題同時需要細節與全局，疊加 RAPTOR。

## 實作：從 transformer 前向到 mean-pool

以下偽碼把 Late Chunking 的核心攤開——它不是「切塊後加權」，而是「先讓模型看完全文，再按邊界池化」。與純切塊的差異只有兩行，但向量品質的來源完全不同。

```python
# Late Chunking 核心（概念偽碼，可對接 Hugging Face / Jina）
import torch
from transformers import AutoTokenizer, AutoModel

tok = AutoTokenizer.from_pretrained("jinaai/jina-embeddings-v5-small")
mdl = AutoModel.from_pretrained("jinaai/jina-embeddings-v5-small", trust_remote_code=True)
mdl.eval()

def late_chunk_embed(document: str, boundaries: list[tuple[int, int]]):
    # 1. 全文件編碼：所有 token 共享同一次自注意力
    inputs = tok(document, return_tensors="pt", truncation=False)
    with torch.no_grad():
        out = mdl(**inputs, output_hidden_states=False)
        token_vecs = out.last_hidden_state[0]  # [seq_len, hidden]

    # 2. 依切塊邊界做 mean-pool（注意用 token 對齊，而非字元對齊的近似）
    # boundaries 為字元區間，先映射到 token 區間
    chunk_vecs = []
    for char_start, char_end in boundaries:
        tok_start = tok.char_to_token(0, char_start)
        tok_end   = tok.char_to_token(0, char_end - 1)
        # 防呆：若 tokenizer 不支援 char_to_token，退化為以字元近似切 token 序列
        if tok_start is None or tok_end is None:
            continue
        chunk_vecs.append(token_vecs[tok_start:tok_end + 1].mean(dim=0))
    return torch.stack(chunk_vecs)  # [num_chunks, hidden]

# 與純切塊的對照（語意差異）
# 純切塊：vectors = [embed(chunk) for chunk in chunks]  # 各塊獨立前向
# Late：  vectors = late_chunk_embed(full_doc, boundaries)  # 一次前向，再池化

# Contextual Retrieval 的前置（對照，索引期）
# enriched = [llm_contextualize(c, full_doc) + c for c in chunks]
# vectors_cr = embed_batch(enriched)  # 每塊多 50-100 tok 的自然語言上下文
```

向量庫端的補位：量化與混合檢索已成預設。索引量起來後，[Qdrant 1.19 Turbo4](https://qdrant.tech/blog/qdrant-1.19.x/)（4-bit 純量化、9× 儲存降）與 [Weaviate 1.30 BlockMax WAND](https://weaviate.io/blog/weaviate-1-30-release)（詞彙搜尋最高 10× 加速）的增量，讓「為上下文多付的成本」在儲存與檢索側被部分抵消；混合檢索的 [Qdrant Hybrid RRF/DBSF 實測](https://qdrant.tech/articles/hybrid-search/)（5 集 4 勝、額外延遲 0.60–1.47ms）則說明「字詞 + 向量」仍是召回的安全網，無論選哪種上下文方案都值得保留。

## 怎麼選：今晚就能做的對照

1. **先量語料形態**——若 80% 文件在 32K 內且跨段指代多，預設試 Late Chunking；若文件含大量隱含前提（例如「依前述專案範圍」反覆出現），改試 Contextual Retrieval。
2. **再量成本天花**——估算 `塊數 × 單塊前置均價` 是否超過月度 LLM 預算的 10%。超過就先用 Late Chunking 打底，只對高價值子集（如合約、SOP）加 Contextual 前置。
3. **疊加而非二選一**——葉節點用 Late Chunking 產生帶上下文向量，上層用 RAPTOR 長摘要，兼顧單點精準與全局覆蓋；更新頻繁的語料則少用 RAPTOR。
4. **可執行動作**——從既有語料抽 100 題（含指代型 / 事實型 / 總結型），各跑「純切塊 / Late Chunking / Contextual 小樣本」三組，比較失敗率與索引成本，48 小時內的數據比任何榜單更能決定預設。

## 整體來說

這三個技術處理的是同一件事在不同尺度上的缺口：Late Chunking 補「塊內看不見塊外」——先看完全文再切，零額外 LLM 成本，換的是對 32K 窗口的依賴；Contextual Retrieval 補「向量記不住指代」——用 LLM 把定位寫回文字，更準但每塊一調用，成本發生在索引側；RAPTOR 補「單一粒度不夠」——長出摘要樹，讓檢索可在細節與全局間切換，成本與更新代價最高。與純切塊相比，前兩者都在同一粒度上就已顯著降失敗率，差異在付錢的位置與窗口的限制。

對多數團隊，務實的起點是：**預設 Late Chunking，高價值語料疊加 Contextual 前置，需要全局綜述再接 RAPTOR**。先在自家標註集上跑完三組對照，再把勝出的那組寫進 `embed` 與 `chunk` 的預設——而不是先押一個，下次語料一變再重來。

## 參考資料

- [Introducing Contextual Retrieval — Anthropic](https://www.anthropic.com/news/contextual-retrieval) — Contextual Embeddings + Contextual BM25 階梯數據（5.7%→3.7%→2.9%→1.9% with rerank）與 $1.02/1M tokens 成本基準
- [Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models](https://arxiv.org/abs/2409.04701) — arXiv:2409.04701，v1 2024-09-07，先全文件編碼再切塊再 mean-pool，無需訓練
- [RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval](https://arxiv.org/abs/2401.18059) — arXiv:2401.18059，遞迴摘要建樹與 QuALITY 等評測
- [Jina Embeddings v5-text — Jina AI](https://jina.ai/embeddings/) — 含 v5-text（32K 小模型）與 v4/v3 結構對照
- [jina-embeddings-v5-text: Task-Targeted Embedding Distillation](https://arxiv.org/abs/2602.15547) — arXiv:2602.15547，v5 用於 Late Chunking 的 32K 上下文模型
- [Qdrant 1.19 — TurboQuant Datatype & Memory Tiers](https://qdrant.tech/blog/qdrant-1.19.x/) — 4-bit 純量化與 9× 儲存降
- [Hybrid Search in Qdrant](https://qdrant.tech/articles/hybrid-search/) — RRF/DBSF 混合檢索實測與 0.60–1.47ms 額外延遲
- [Weaviate 1.30 Release](https://weaviate.io/blog/weaviate-1-30-release) — BlockMax WAND 最高 10× 詞彙加速
- [RAG 技法大全導航](https://quidproquo.cc/posts/ai/2026-03-14-rag-patterns-complete-guide) — 本文所屬系列的總覽與世代選型
