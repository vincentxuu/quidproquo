---
title: "Haystack 深入介紹：用 Component 與 Pipeline 組出可測試的 RAG"
date: 2026-08-22
category: ai
type: deep-dive
tags: [haystack, rag, python, pipeline, ai-agent]
lang: zh-TW
tldr: "Haystack 把 indexing、retrieval、generation 與 evaluation 都做成可替換的 Component，再用 directed multigraph Pipeline 串接；適合要把 RAG 流程當成程式資產測試、版本化與部署的 Python 團隊。"
description: "拆解 Haystack 的 Component、Pipeline、Document Store、索引與查詢流程、evaluation 和部署邊界，並說明它與 LlamaIndex、RAGFlow、Dify、R2R 的差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-haystack-pipeline-framework-en)

[Haystack](https://docs.haystack.deepset.ai/) 是開放原始碼的 Python AI orchestration framework。它可以做 RAG、搜尋、agent 與多模態應用，但核心抽象始終是兩個：負責一件事的 Component，以及把 Component 接成資料流的 Pipeline。這使它更像應用程式內的工程框架，不是附管理後台的 RAG 平台。

這篇依一條 pipeline 從資料進入到答案評估的順序，拆解 Haystack。若你只是想快速比較產品層級，可先看站內的 [RAG 框架選型指南](/posts/ai/2026-08-22-rag-framework-selection-guide)。

## Component：每個節點只守一個介面

[官方 Component 文件](https://docs.haystack.deepset.ai/docs/components)把 converter、splitter、embedder、retriever、ranker、generator、router 與 writer 都放在相同抽象下。Component 宣告輸入與輸出，實作 `run()`，可以單獨呼叫，也可以放進 Pipeline。替換向量庫或 reranker 時，理想上只換節點與連線，不必重寫整條應用流程。

自訂節點使用 `@component` 與 `@component.output_types` 宣告契約：

```python
from haystack import component

@component
class NormalizeQuery:
    @component.output_types(query=str)
    def run(self, query: str):
        return {"query": " ".join(query.split())}
```

這個邊界也帶來責任：型別接得上不代表語意正確。文件 metadata、chunk ID、模型版本與失敗狀態仍要由團隊定義，否則元件可替換，資料卻無法重建。

## Pipeline：不是固定直線，而是可分支的圖

[Haystack Pipeline](https://docs.haystack.deepset.ai/docs/pipelines) 是 directed multigraph，可包含分支、迴圈與同時執行的路徑。索引 pipeline 可以把 converter、cleaner、splitter、embedder 與 writer 串起來；查詢 pipeline 則把 query embedder、retriever、prompt builder 與 generator 串起來。兩條流程分開後，重新索引與線上查詢就能各自部署及觀測。

```python
from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator

pipe = Pipeline()
pipe.add_component("prompt", PromptBuilder(
    template="Answer from this context:\n{{ documents }}\nQuestion: {{ query }}"
))
pipe.add_component("llm", OpenAIGenerator())
pipe.connect("prompt.prompt", "llm.prompt")
```

完整 RAG 還要加入 Document Store、retriever 與對應 embedder。官方的 [Creating Pipelines](https://docs.haystack.deepset.ai/docs/creating-pipelines) 範例會先檢查各 Component 的 input/output，再用 `connect()` 接線；這是比複製一段大型範例更可靠的起點。

Pipeline 可序列化，但只有所有 Component 都能序列化時才真正可攜。自訂 class、外部 secret、模型 endpoint 與資料庫 schema 仍需納入部署契約，不要把 YAML 當成完整備份。

## Document Store：介面可以換，資料不會自己搬家

Document Store 保存文字、metadata 與 embedding，retriever 透過它查詢。Haystack 提供 InMemoryDocumentStore，也透過 integrations 連接不同後端。這個抽象適合比較向量庫或在本機測試，但切換後端仍要重新匯入資料、重建 embedding，並驗證 filter 與 ranking 行為。

實務上應為每個來源保存穩定 document ID、來源版本與 chunk lineage。索引工作先寫入暫存或新 collection，驗證筆數與抽樣查詢後再切換讀取端；不要在 production collection 上邊刪邊重建。

## Evaluation：拆節點，也測最後答案

[Haystack evaluation](https://docs.haystack.deepset.ai/docs/evaluation) 區分 component evaluation 與 end-to-end evaluation。前者可以單測 retriever 的 recall 或 ranking，後者把整條 pipeline 視為黑箱評估最終回答。官方也區分需要 ground truth 的統計 evaluator，以及以模型評分的 evaluator。

這個設計很適合找瓶頸：若 relevant document 沒進候選集，先修 retrieval；候選文件正確但回答錯，才看 prompt、generator 或 context packing。今晚可做的第一步，是拿十個真實失敗問題，為每題標 relevant document，再把檢索與回答評估分開跑。

## 部署與營運邊界

Haystack 是 library，不會自動交付帳號、workspace、知識庫管理頁或應用發布流程。你可以把 Pipeline 包成 FastAPI、背景 worker 或批次工作，也可使用官方的部署相關方案；但 authentication、queue、重試、trace 保存、rolling upgrade 與 secret 管理仍屬於你的服務。

| 選項 | 核心交付 | 適合情境 |
| --- | --- | --- |
| [Haystack](https://docs.haystack.deepset.ai/) | Python Component 與 Pipeline | 流程客製、測試與程式碼 review 是核心 |
| [LlamaIndex](https://developers.llamaindex.ai/python/framework/) | 文件、索引與 context augmentation 抽象 | 資料接入與 query engine 是主要語彙 |
| [RAGFlow](https://github.com/infiniflow/ragflow) | 文件解析與 RAG 管理平台 | 複雜文件及人工檢查 chunk 很重要 |
| [Dify](https://github.com/langgenius/dify) | 視覺化 AI 應用平台 | 非工程角色要共同組 workflow 與發布 |
| [R2R](https://github.com/SciPhi-AI/R2R) | Retrieval REST API | 既有產品只缺檢索後端服務 |

## 整體來說

Haystack 的優勢不是替你決定最佳 RAG，而是把每個決定變成清楚的 Component 與連線。當團隊需要反覆換 retriever、reranker、模型或 routing 策略，並希望用測試與版本控制管理這些變更，它的抽象很合適。若需求是讓內容人員在介面上傳文件、調 chunk、發布 chatbot，完整平台會比較直接。

採用前先做一條最小 indexing pipeline、一條 query pipeline，再為真實失敗案例加 component evaluation。若這三件事能自然融入現有 Python 服務，Haystack 才是真的降低複雜度。

## 參考資料

- [Haystack 官方文件](https://docs.haystack.deepset.ai/)
- [Haystack Components](https://docs.haystack.deepset.ai/docs/components)
- [Haystack Pipelines](https://docs.haystack.deepset.ai/docs/pipelines)
- [Creating Pipelines](https://docs.haystack.deepset.ai/docs/creating-pipelines)
- [Haystack Evaluation](https://docs.haystack.deepset.ai/docs/evaluation)
- [LlamaIndex 官方文件](https://developers.llamaindex.ai/python/framework/)
- [RAGFlow 官方 repository](https://github.com/infiniflow/ragflow)
- [Dify 官方 repository](https://github.com/langgenius/dify)
- [R2R 官方 repository](https://github.com/SciPhi-AI/R2R)
