---
title: "圖譜 RAG 怎麼選：GraphRAG v3.1.2、LightRAG 與 HippoRAG 2 的設計、成本與選型"
date: 2026-08-25
category: ai
type: deep-dive
tags: [rag, graphrag, lightrag, hipporag, knowledge-graph, retrieval]
lang: zh-TW
tldr: "同樣是「知識圖譜 + 檢索」，Microsoft GraphRAG v3.1.2 用重索引換全局總結能力，LightRAG 用 dual-level 與增量把成本砍下來，HippoRAG 2 用 PPR 把 RAG 做成可持續增長的記憶；這篇按部件拆設計取捨，含四種查詢、索引流程與選型表。"
description: "按部件對比 Microsoft GraphRAG v3.1.2（TextUnit→Entity→Leiden→Community Summary 與 Global/Local/DRIFT/Basic 四查詢）、LightRAG 的 dual-level 與增量更新、HippoRAG 2 的 PPR 關聯記憶，含與純向量與 LongRAG 的比較、ASCII 架構與可貼上的設定範例。"
series:
  name: "RAG 技法大全"
  order: 47
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-graphrag-lightrag-hipporag-en)

向量搜尋找得到「像」的文件，但碰到「誰跟誰有關係」「整批文件在講什麼趨勢」這類問題，就會漏掉關鍵連結。圖譜 RAG 就是補這一塊：先把文件抽成實體與關係，再在圖上檢索。問題是，圖譜怎麼做才划算——這篇把三個主流路線攤開來比，讓你直接對照成本、更新頻率與問題類型做選擇。

讀完你會得到：[Microsoft GraphRAG](https://microsoft.github.io/graphrag/) v3.1.2 的完整索引與四查詢模型、[LightRAG](https://github.com/HKUDS/LightRAG) 為何能做到低成本增量、[HippoRAG 2](https://github.com/OSU-NLP-Group/HippoRAG) 如何把 RAG 做成持續記憶，以及一張「何時用圖、何時用向量、什麼時候根本不需要圖」的選型表。

## 先說結論：三個不是同一種產品

一句話區分——GraphRAG 是「重索引、強總結」的企業級管線，LightRAG 是「輕索引、可增量」的工程務實派，HippoRAG 2 是「把檢索當記憶」的持續學習路線。論文與官方文件都指向同一個分歧點：**成本花在哪裡**。GraphRAG 把成本花在建圖與社區總結，換回全局問答；LightRAG 與 HippoRAG 則刻意少調 LLM，把成本壓在檢索時。

如果你只記一件事，記這個：選型關鍵不在榜單分數，而在**更新頻率與問題形態**——語料一天一變與半年一變、點查與總結，答案完全不同。

## Microsoft GraphRAG v3.1.2：把文件煮成一張可總結的圖

[Microsoft GraphRAG](https://microsoft.github.io/graphrag/)（[文件](https://microsoft.github.io/graphrag/)｜[Releases v3.1.2](https://github.com/microsoft/graphrag/releases)）的設計哲學是「先把語料結構化，再把結構壓成可被查詢的摘要」。2025-08-21 的 v3.1.2 已非早期的實驗性版本，官方標示的索引主流程是：

**TextUnit → Entity / Relationship 抽取 → Leiden 分群 → Community Summary（自底向上）**

實務上，Document 先切成 TextUnit（帶重疊的 chunk），每個 TextUnit 用 LLM 抽取實體與關係，彙整去重後得到圖；接著用 [Leiden 演算法](https://arxiv.org/abs/1810.08473)做階層分群，同一群的實體與關係再用 LLM 自底向上生成 Community Summary。官方文件原話是：*_GraphRAG builds a knowledge graph and then generates community summaries bottom-up_*——這些摘要才是全局查詢的真正索引，代價就是建庫時的大量 LLM 呼叫。

與替代方案比較，GraphRAG 相較純向量與 [LightRAG](https://arxiv.org/abs/2410.05779)（arXiv:2410.05779）刻意保留「圖 + 摘要」兩層：向量能在語意相近的段落上快速命中，但跨文件關係（法規引用鏈、組織關係、藥物交互）需要走圖；LightRAG 為了省成本拿掉了重量級的社區報告，HippoRAG 2（[arXiv:2502.14802](https://arxiv.org/abs/2502.14802)）則用檢索時計算取代建庫時摘要。三者的共同限制是抽取品質——實體抽錯，後面全錯。

適合情境：法規、醫療、金融研究、企業 wiki 這類關係密集且需要回答「整批文件在說什麼」的場景；不適合情境：語料頻繁變動（日更）、一次性 demo、或問題皆為單段可答的事實型查詢——此時建圖成本收不回來。

具體用法（設定範例）：

```yaml
# settings.yaml — GraphRAG v3.x 索引設定（概念範例）
input:
  type: csv
  file_pattern: ".*\\.csv$"
chunks:
  size: 1200
  overlap: 100
  group_by_columns: [id]
extract_graph:
  model_id: gpt-4o-mini
  prompt: "extract_graph.txt"
  max_gleanings: 1
cluster_graph:
  max_cluster_size: 10
  use_lcc: true
summarize_descriptions:
  model_id: gpt-4o-mini
  max_length: 500
community_reports:
  model_id: gpt-4o-mini
  max_length: 2000
  max_input_length: 8000
```

```bash
# 索引與查詢（v3 CLI）
graphrag index --root ./ragtest
graphrag query --root ./ragtest --method global "這批合約有哪些共同風險？"
graphrag query --root ./ragtest --method local  "A 公司與 B 公司什麼關係？"
```

GraphRAG v3.1.2 提供四種查詢，官方文件定義如下：

- **Global**：用 Community Summary 回答全局總結型問題（「這批文件整體趨勢？」）
- **Local**：以實體為中心在圖上擴散，適合點查與關係追蹤
- **DRIFT**：介於兩者之間的動態混合，先拉全局脈絡再鑽局部
- **Basic**：退化為純向量相似度搜尋，作 baseline 或低成本備援

限制與注意：索引仍需大量 LLM 呼叫，v3 起的 streaming 與 storage 後端（新增 [CosmosTableProvider 支援 namespace 分區](https://github.com/microsoft/graphrag/releases)）緩解了吞吐與隔離，但未根除成本；大語料首次建庫建議先以子集估成本，再決定是否全量。此外 3.x 有 breaking changes，升級前讀 `breaking-changes.md` 比直接升版更省事。

## LightRAG：把圖做輕，讓增量與刪除不再重建全庫

[LightRAG](https://github.com/HKUDS/LightRAG)（[論文 arXiv:2410.05779](https://arxiv.org/abs/2410.05779) v3 2025-04-28）的設計哲學是「圖要有，但不要重」。它保留實體與關係抽取，卻拿掉 GraphRAG 最貴的社區報告層，改以兩個機制補位：**dual-level retrieval** 與**增量更新**。

Dual-level 指檢索時同時走兩條路——low-level 走實體層（精準的關係與屬性），high-level 走主題/概念層（涵蓋面），兩路結果再合併。這讓 LightRAG 在不需要預先做全局總結的前提下，仍能兼顧點查與一定程度的全局覆蓋。與 GraphRAG 相較，它在「法規整批總結」這類極端全局任務上可能略遜，但在多數混合問題上以更低成本取得接近效果；與 [HippoRAG 2](https://arxiv.org/abs/2502.14802) 相較，LightRAG 的圖更顯式、更新路徑更直接，HippoRAG 則更偏記憶與關聯擴散。

適合情境：知識庫需頻繁增刪（產品文件、客服知識庫、研究筆記）、預算有限但又需要超越純向量的關聯檢索；不適合情境：要求極致全局一致性的單次大規模總結，或實體抽取品質極差的嘈雜語料——此時輕量圖的優勢會被抽取噪音抵消。

具體用法（Python，概念範例）：

```python
# pip install lightrag-hku
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete
from lightrag.utils import EmbeddingFunc
import openai

rag = LightRAG(
    working_dir="./lightrag_cache",
    llm_model_func=gpt_4o_mini_complete,
    embedding_func=EmbeddingFunc(
        embedding_dim=3072,
        max_token_size=8192,
        func=lambda texts: openai.embeddings.create(
            model="text-embedding-3-large", input=texts
        ).data[0].embedding
    ),
)

# 增量寫入：重複呼叫 insert 即可，不需重建全庫
rag.insert("LightRAG 支援增量更新，刪除時僅移除相關子圖。")
rag.insert(["第二批文件……", "第三批文件……"])

# dual-level 檢索：mix 同時走 low + high
result = rag.query("A 產品的依賴元件有哪些？", param=QueryParam(mode="mix"))
print(result)

# 刪除（若後端支援）：僅清相關實體與邊
# rag.delete_by_doc_id("doc-123")
```

限制與注意：GitHub 已標示 39k+ stars，2026-05 合併 [RAGAnything](https://github.com/HKUDS/LightRAG) 後支援 MinerU/Docling 等多模態切分與多後端，但核心限制未變——增量雖便宜，萍水相逢的文件若從未被抽取為實體，仍不會自動變成可檢索的知識；此外 `mix` 模式的兩路融合參數需在自家資料上調校，榜單數字不能直接搬。

## HippoRAG 2：把 RAG 當成會長大的記憶

[HippoRAG 2](https://github.com/OSU-NLP-Group/HippoRAG)（[論文 arXiv:2502.14802](https://arxiv.org/abs/2502.14802)，ICML 2025）借了海馬迴的隱喻：檢索不是一次性查詢，而是**持續累積的關聯記憶**。設計哲學是把檢索從「找最像的 chunk」改為「在圖上做關聯擴散」，核心是 **Personalized PageRank（PPR）**。

做法是：把 passage 與實體一起建成圖，查詢時先以少量 seed 節點啟動 PPR，在圖上做隨機遊走擴散，最後把高分節點對應的 passage 拿回來生成。論文回報相較強 embedding baseline 在關聯任務上有約 7% 提升，關鍵不在分數本身，而在方法暗示——HippoRAG 把「記憶如何組織」當成一等公民，因而支援 non-parametric continual learning：新知識以節點與邊增量加入，無需重訓。

與替代方案比較：相較 GraphRAG 的預先總結，HippoRAG 把計算挪到查詢時；相較 LightRAG 的 dual-level，HippoRAG 的 dual 是「文字相似度 + 圖擴散」；相較純向量與 [LongRAG](https://arxiv.org/abs/2408.09843)（長上下文塞大 chunk），HippoRAG 在跨文檔跳躍（multi-hop）上更強，但在單文件事實抽取上未必更準——若答案就在同一段落，向量或長上下文已足夠。

適合情境：需跨越多份文件的關聯問答、研究型知識庫、會持續增長且需保留歷史脈絡的個人/組織記憶；不適合情境：語料高度結構化且查詢皆為單跳事實、或向量庫已由託管服務高度優化且延遲比關聯更重要的線上服務。

具體用法（概念範例）：

```python
# HippoRAG 2 概念流程（簡化）
from hipporag import HippoRAG

rag = HippoRAG(
    llm_model="gpt-4o-mini",
    embedding_model="text-embedding-3-large",
    graph_type="openie",  # 或 llm-based 抽取
)

# 索引：passage 與實體同時入圖
rag.index(docs=[
    {"id": "doc1", "text": "A 藥物抑制 X 蛋白，X 與 Y 有交互。"},
    {"id": "doc2", "text": "Y 蛋白在 B 疾病中過度表現。"},
])

# 檢索：PPR 在圖上擴散，再取對應 passage
answer = rag.query("A 藥物是否與 B 疾病間接相關？", method="ppr")
print(answer)

# 持續記憶：新增知識即增量擴圖
rag.index([{"id": "doc3", "text": "新研究顯示 Y 與 Z 的關聯。"}])
```

限制與注意：PPR 的迭代步數與阻尼係數是超參數，過度擴散會引入噪音；持續記憶雖無需重訓，但圖會隨時間膨脹，舊節點的權重與遺忘策略需額外設計；此外 HippoRAG 的優勢依賴抽取與圖品質，抽取噪音高時 PPR 只會把錯的關聯擴得更遠。

## 跟純向量與 LongRAG 比：圖譜不是越用越好

許多團隊的直覺是「向量不夠就上圖」，但圖譜的報酬曲線不是線性的。

**純向量（vector-only）** 的強項是簡單、便宜、好維運。大量事實型與單段可答的查詢，純向量已足夠；它的短板在關係缺失——向量不知道「A 引用了 B」「A 與 C 同屬一群」。**LongRAG**（[Xiao et al., 2024](https://arxiv.org/abs/2408.09843)）則走另一條路：用大 chunk + 長上下文模型硬吃完整語境，保留「答案被切在邊界」的資訊，適合語料少、單次就要完整脈絡的場景，代價是 token 與延遲直線上升。

圖譜的報酬集中在兩個象限：

| 問題類型 | 純向量 / LongRAG 夠嗎 | 圖譜的增量 |
|---|---|---|
| 單段事實（某條文第幾條、某 API 參數） | 夠，向量最快 | 圖譜多餘，成本白花 |
| 跨文件關聯（引用鏈、組織關係） | 不夠，易漏鏈 | PPR / 圖遍歷明顯提升 |
| 全局總結（整批文件趨勢、風險彙整） | LongRAG 可硬吃，小語料尚可 | GraphRAG 的 Community Summary 最穩 |
| 頻繁增刪的知識庫 | 向量可增量，LongRAG 需重塞 | LightRAG / HippoRAG 的增量最划算 |

增量歸因提醒：不要把「能回答全局問題」全歸功於圖譜——LongRAG 用長上下文也能回答小語料的全局問題，圖譜的真正增量是**在語料規模與更新頻率的壓力下，仍能維持全局一致性與關聯可追溯性**。小語料、一次性任務，圖譜往往是過度設計。

可執行動作：拿自家 50 題含「總結型 / 關聯型 / 單段事實型」的混合評測集，跑三組對照——向量 vs LongRAG（大 chunk） vs 圖譜（任選其一）——以任務類型分開看召回與成本，再決定哪個象限值得為圖譜付費。

## 怎麼選：三軸決策

| 軸 | 選 GraphRAG v3.1.2 | 選 LightRAG | 選 HippoRAG 2 |
|---|---|---|---|
| **成本耐受** | 可接受首次重索引，換全局精度 | 預算緊，需低 LLM 呼叫 | 中等，但查詢時計算可接受 |
| **更新頻率** | 低頻（月更/季更）沒問題 | 高頻（日更/隨寫隨增）首選 | 持續增長的記憶型語料首選 |
| **問題形態** | 全局總結、階層化報告 | 混合（點查 + 中度總結） | 跨文檔多跳關聯、記憶回溯 |
| **維運** | 需管 pipeline 與社群報告 | 最輕，delete/insert 局部 | 需調 PPR 與記憶膨脹策略 |

快速規則：

- **先問更新頻率**——日更選 LightRAG / HippoRAG，低頻選 GraphRAG。
- **再問問題形態**——全局總結選 GraphRAG，多跳關聯選 HippoRAG，混合選 LightRAG。
- **最後問維運能力**——沒有餘力調圖與 PPR，就先用純向量 + 評測證明瓶頸真的在關係缺失，再進場。

## 整體架構

```
                        查詢 Query
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   GraphRAG v3.1.2      LightRAG           HippoRAG 2
   ─────────────        ────────           ──────────
   Doc → TextUnit       Doc → Entity/Rel   Doc + Passage → Graph
         │  (抽取)              │  (輕量抽取)        │  (openie/LLM)
         ▼                      ▼                    ▼
   Entity/Rels Graph      Entity Graph         Entity + Passage Graph
         │                      │                    │
    Leiden 分群          無 Community Summary   PPR 關聯擴散
         │                      │                    │
   Community Summary      dual-level 檢索       Passage 召回
   (自底向上 LLM)         low + high 融合       (圖擴散結果)
         │                      │                    │
        Global/Local/DRIFT/Basic  mix / hybrid       PPR-ranked
         │                      │                    │
         └───────────────────┼───────────────────┘
                             ▼
                     LLM 生成 + 引用
                             │
                    評估 / 可觀測 / 成本
```

圖的橫向是成本分佈：GraphRAG 成本在左（索引時），HippoRAG 成本在右（查詢時），LightRAG 盡量讓兩側都薄。

## 整體來說

圖譜 RAG 的選型不是「誰的分數最高」，而是「你願意把成本付在哪裡、以及語料怎麼長大」。[Microsoft GraphRAG](https://microsoft.github.io/graphrag/) v3.1.2 適合願意付索引成本換全局可解釋性的團隊；[LightRAG](https://github.com/HKUDS/LightRAG) 適合語料一直長、預算與維運都有限的務實團隊；[HippoRAG 2](https://github.com/OSU-NLP-Group/HippoRAG) 適合把 RAG 當記憶系統、需要跨文件關聯與持續累積的場景。若不確定，務實起點是先讓純向量跑起來，用混合評測集量出「關係缺失」的具體比例——比例夠高，再為圖譜付費；否則 LongRAG 或更好的切分，往往更划算。

## 參考資料

- [Welcome to GraphRAG — Microsoft Docs](https://microsoft.github.io/graphrag/) — GraphRAG 官方文件，Leiden 分群、community summaries 與四查詢定義
- [GraphRAG Releases v3.1.2](https://github.com/microsoft/graphrag/releases) — 2025-08-21 最新版與 breaking-changes、CosmosTableProvider
- [Microsoft GraphRAG GitHub](https://github.com/microsoft/graphrag) — 專案首頁與 `settings.yaml` 參數
- [LightRAG: Simple and Fast Retrieval-Augmented Generation](https://arxiv.org/abs/2410.05779) — arXiv:2410.05779，v3 2025-04-28，dual-level 與增量更新
- [LightRAG — HKUDS GitHub](https://github.com/HKUDS/LightRAG) — 39.2k stars，RAGAnything / MinerU 多模態演進
- [From RAG to Memory: Non-Parametric Continual Learning via HippoRAG 2](https://arxiv.org/abs/2502.14802) — arXiv:2502.14802，ICML 2025，PPR 與持續記憶
- [HippoRAG — OSU NLP GitHub](https://github.com/OSU-NLP-Group/HippoRAG) — NeurIPS'24 → ICML'25 方法與實作
- [ColPali: Efficient Document Retrieval with Vision Language Models](https://arxiv.org/abs/2407.01449) — arXiv:2407.01449，ICLR 2025，若跨到視覺直嵌時的對照（本文未深展，僅作邊界）
- [LongRAG: Enhancing Retrieval-Augmented Generation with Long-context LLMs](https://arxiv.org/abs/2408.09843) — 長上下文大 chunk 的對照基線
- [RAG 技法大全導航](https://quidproquo.cc/posts/ai/2026-03-14-rag-patterns-complete-guide) — 本文所屬系列的總覽與世代選型
