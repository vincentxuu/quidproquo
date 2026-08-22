---
title: "R2R 深入介紹：把 Ingestion、Hybrid Search 與 RAG 包成 API"
date: 2026-08-22
category: ai
type: deep-dive
tags: [r2r, rag, retrieval, api, self-hosted]
lang: zh-TW
tldr: "R2R 把文件匯入、hybrid search、knowledge graph、RAG、Agent 與權限包在 REST API 後面；適合已有產品前後台、只想補上 retrieval service 的團隊。"
description: "沿 API 資源生命週期介紹 R2R 的 document ingestion、collection、hybrid search、RAG、Agent、access control、自架與資料退出邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-r2r-retrieval-api-en)

[R2R](https://github.com/SciPhi-AI/R2R) 是開放原始碼的 AI retrieval system，把文件處理、搜尋、RAG、knowledge graph、Agent 與管理能力放在 REST API 後面。它不是讓內容人員畫 workflow 的平台，也不是嵌進 Python 程式的節點 library；它比較像一個可自行架設的 retrieval backend。

這篇依 API 資源生命週期往下走：啟動服務、匯入 document、用 collection 管範圍、呼叫 search/RAG/Agent，最後處理權限、部署與退出。跨框架定位可搭配 [RAG 框架選型指南](/posts/ai/2026-08-22-rag-framework-selection-guide)。

## 啟動：先取得一個穩定的服務邊界

官方 repository 提供 Python 輕量啟動與完整 Docker 模式。README 的最小流程是安裝 `r2r`、設定模型憑證，再啟動 server；client 透過 `http://localhost:7272` 呼叫。

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install r2r
export OPENAI_API_KEY="..."
python -m r2r.serve
```

正式環境不要只複製這段。API 必須放在 authentication、TLS、rate limit 與網路隔離後面，模型 key 放 secret manager。若要用 Docker full mode，應以部署當下的官方 compose 與設定說明為準。

## Documents：匯入不是一次性上傳

R2R 的 document API 接受多種內容，server 負責解析、切分、embedding 與索引。Python client 的入口很直接：

```python
from r2r import R2RClient

client = R2RClient(base_url="http://localhost:7272")
document = client.documents.create(file_path="handbook.pdf")
print(document)
```

API 簡單，不代表 ingestion lifecycle 消失。產品要保存來源 ID、checksum、R2R document ID、匯入時間與處理狀態。更新來源時要決定覆寫、建立新版本或先刪後建；刪除時也要驗證 chunk、embedding、graph entity 與快取是否一起消失。

把這些 mapping 留在自己的資料庫，才能在換 embedding model、重建 R2R 或遷移平台時重放 corpus。只把原始檔丟給服務，日後很難回答某個答案引用的是哪一版文件。

## Search：先驗證 retrieval，再接生成

R2R 的核心搜尋能力包含 semantic 與 keyword matching，並提供 hybrid search。官方 README 將 reciprocal rank fusion、knowledge graph 與 multimodal ingestion 列為主要能力。呼叫介面把 retrieval 與 generation 分開：

```python
results = client.retrieval.search(query="How do we rotate API keys?")
print(results)
```

實際 response 結構要依安裝版本的 SDK/API 文件確認。先用 `search` 看候選 chunk，標記 relevant document 與 ranking，再調 filter、search mode 或設定。若直接從 `rag()` 開始，回答看似合理時很容易忽略 retrieval 根本抓錯文件。

## RAG 與 Agent：相同知識層的不同執行模式

`retrieval.rag()` 會在搜尋後生成有引用的回答；`retrieval.agent()` 則可做多步驟的 agentic retrieval。官方 README 也描述 Deep Research API，可同時使用 knowledge base 與網路來源處理複雜問題。

```python
response = client.retrieval.rag(
    query="Summarize the incident response policy with citations."
)
print(response)
```

不要因為 endpoint 名稱是 `rag` 就省略自己的品質契約。每次回應至少記錄 query、使用者/collection 範圍、引用 document ID、模型設定、latency 與錯誤。Agent 會放大成本與不確定性，應先讓單次 search/RAG 有 golden cases，再為確實需要多步驟探索的問題開 agent。

## Collections 與權限：產品身份必須映射到檢索範圍

R2R 提供 user、collection 與 access control 能力。這適合多使用者產品，但後端不能只相信前端傳來的 collection ID。應由自己的 authentication context 決定可查範圍，再把授權後的 filter 或 collection 傳給 R2R。

權限測試要包含負向案例：A 使用者不能靠猜 ID 查到 B 的 document；文件移出 collection 後不得再被搜尋或引用；管理員操作要留 audit trail。RAG 回答沒有洩漏不代表安全，search endpoint 與文件下載同樣要測。

## 自架與退出：REST 是替換縫，不是完整可攜性

R2R 的 REST boundary 讓前端與主要應用不必依賴內部 Python class，這是它相較 library 的明顯優勢。可是 document、chunk、collection、graph、provider config 與資料庫仍是服務狀態。退出計畫需要原始來源、canonical metadata、ID mapping、embedding 重建流程與可重跑的驗收題。

| 選項 | 核心交付 | 適合情境 |
| --- | --- | --- |
| [R2R](https://github.com/SciPhi-AI/R2R) | Retrieval REST API 與 SDK | 已有產品介面，需要獨立 RAG backend |
| [Haystack](https://docs.haystack.deepset.ai/) | Python Component/Pipeline | retrieval 演算法要深度客製與測試 |
| [RAGFlow](https://github.com/infiniflow/ragflow) | 文件解析與操作 UI | 人工檢查 chunk 與引用很重要 |
| [Dify](https://github.com/langgenius/dify) | AI 應用 workspace | workflow、工具與發布都要讓跨角色操作 |

## 整體來說

R2R 最清楚的價值是服務邊界。團隊可以保留自己的產品前端、帳號與商業流程，透過 API 補上 ingestion、hybrid search、RAG、graph 與 agentic retrieval。它省下的是從零設計 retrieval backend 的時間，不是資料治理、評估與營運責任。

採用前先做三件事：匯入一小組有版本的文件、以 search endpoint 驗證 retrieval、再用相同問題測 RAG 引用。最後刪除一份文件並確認所有入口都查不到。這條生命週期走通，比 demo 能回答一題更接近 production readiness。

## 參考資料

- [R2R 官方 repository](https://github.com/SciPhi-AI/R2R)
- [R2R：What is R2R?](https://github.com/SciPhi-AI/R2R/blob/main/docs/introduction/guides/what-is-r2r.md)
- [Haystack 官方文件](https://docs.haystack.deepset.ai/)
- [RAGFlow 官方 repository](https://github.com/infiniflow/ragflow)
- [Dify 官方 repository](https://github.com/langgenius/dify)
