---
title: "RAGFlow 深入介紹：從文件解析、Chunk 檢查到可追溯回答"
date: 2026-08-22
category: ai
type: deep-dive
tags: [ragflow, rag, document-parsing, knowledge-base, self-hosted]
lang: zh-TW
tldr: "RAGFlow 把文件解析、chunk 人工檢查、retrieval test、聊天與引用放在同一套平台；適合 PDF、表格與版面複雜文件，但部署重量和平台狀態都高於 Python library。"
description: "沿文件生命週期介紹 RAGFlow 的 dataset、解析模板、chunk 介面、檢索測試、聊天與 API，並說明自架成本、模型限制及退出風險。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-ragflow-document-rag-platform-en)

[RAGFlow](https://github.com/infiniflow/ragflow) 是開放原始碼的全端 RAG 平台。它的重點不只是向量搜尋，而是讓文件從上傳、解析、切塊、人工檢查、檢索測試，到回答與引用都留在同一個操作介面。對版面複雜的 PDF、表格與掃描文件，這個可視性常比「多一個 retriever class」更有價值。

這篇沿一份文件的生命週期介紹 RAGFlow。若要先比較它與 Haystack、Dify、R2R 的產品層級，可看 [RAG 框架選型指南](/posts/ai/2026-08-22-rag-framework-selection-guide)。

## Dataset：先決定模型與解析策略

依官方 [Quickstart](https://github.com/infiniflow/ragflow/blob/main/docs/quickstart.mdx)，資料先進入 dataset，再選 embedding model 與 chunking template。模板會依文件性質處理一般文件、表格、圖片或投影片；解析完成後，使用者可直接查看 chunk snapshot、修改文字、補 keyword 或 question。

這個流程把資料品質從後端日誌搬到 UI。內容人員能指出頁首被誤當正文、表格列錯位或標題和段落拆散，不必先學會查向量資料庫。

模型選擇不是隨手設定。官方明確提醒：dataset 一旦用某個 embedding model 解析文件，就不能直接換成另一個 embedding model，因為資料必須留在同一個向量空間。上線前應用小型代表資料集驗證語言、chunk 與 retrieval；要換模型時建立新 dataset 並重建，不要期待原地切換。

## 文件解析：RAGFlow 的核心差異

RAGFlow 的[基礎說明](https://github.com/infiniflow/ragflow/blob/main/docs/basics/rag.md)把多模態文件處理視為工業級 RAG 的主要難題。系統提供內建解析能力，也支援不同 parsing method。價值不在「任何 PDF 都能完美解析」，而是解析結果能被看見、修改並送進 retrieval test。

建議先準備一組真正會出錯的文件：雙欄論文、跨頁表格、掃描頁、頁首頁尾與混合語言。每種文件抽查 chunk 是否保留標題層級、表格語意與頁碼，再決定模板。只拿乾淨 Markdown 測試，無法證明選 RAGFlow 的理由。

## Retrieval test：在生成回答前看見召回內容

解析完成後可在 dataset 內做 retrieval testing。使用者輸入問題，直接檢查召回 chunk，並調整 similarity threshold、keyword、question 或其他檢索設定。這比只看 chatbot 最後回答容易定位問題：沒召回是 indexing/retrieval 問題；有正確 chunk 卻答錯，才是 prompt 或模型問題。

人工調 chunk 是優點，也是平台狀態。若大量品質來自 UI 內的手動修改，備份與遷移計畫不能只保存原始檔。團隊要確認 dataset 設定、chunk 修改、metadata 與 embedding 如何匯出或重建。

## Chat、Agent 與 API：平台不只是一個 demo

RAGFlow 可以把一個或多個 dataset 綁到 chat assistant，設定 system prompt、模型與沒有召回內容時的行為。Quickstart 特別指出：若希望回答只限於資料集，可以設定固定 empty response；留白則允許模型自行回答，也可能增加幻覺風險。

除了 UI，RAGFlow 也提供 HTTP 與 Python API。應用程式可以自行保留前端，只把文件、dataset、retrieval 或 conversation 能力接進產品。API key 必須放在 secret manager 或環境變數，不要寫進瀏覽器 bundle。

```python
import os
import requests

headers = {"Authorization": f"Bearer {os.environ['RAGFLOW_API_KEY']}"}
response = requests.get(
    f"{os.environ['RAGFLOW_BASE_URL']}/api/v1/datasets",
    headers=headers,
    timeout=30,
)
response.raise_for_status()
print(response.json())
```

實際 endpoint 與 payload 應依部署版本的官方 API reference 確認；平台持續演進，不要把網路上的舊範例當固定契約。

## 自架：得到完整平台，也接下完整平台

官方 repository 的自架方式以 Docker Compose 為主，包含前端、後端、關聯式資料庫、快取、物件儲存與 document engine。這和安裝一個 Python package 完全不同。你要規劃持久化 volume、備份、升級、模型憑證、對外 TLS、資源監控與背景解析工作的容量。

官方 README 與 Quickstart 應作為部署當下的準則，因為相依服務和硬體要求會變。先在測試環境匯入代表文件，確認解析 worker、儲存與搜尋服務重啟後仍能恢復，再談 production。

| 選項 | 最適合 | 主要取捨 |
| --- | --- | --- |
| [RAGFlow](https://github.com/infiniflow/ragflow) | 複雜文件、chunk 人工檢查、引用可視性 | 系統較重，平台狀態要備份與升級 |
| [Haystack](https://docs.haystack.deepset.ai/) | 程式化組合與測試 retrieval pipeline | 管理 UI 與內容營運要自己做 |
| [Dify](https://github.com/langgenius/dify) | RAG 只是視覺化 AI workflow 的一部分 | 文件解析不是唯一中心 |
| [R2R](https://github.com/SciPhi-AI/R2R) | 既有產品需要 retrieval API | 人工檢查文件的介面不是主要賣點 |

## 整體來說

RAGFlow 適合「文件進來後到底被切成什麼」是團隊主要風險的專案。它把解析、chunk、檢索與引用放到同一個可操作平面，讓工程師與內容專家能一起除錯。代價是你採用的不只是一套 library，而是一套有資料庫、搜尋、儲存和背景工作的完整平台。

採用前不要先上傳全部文件。挑一小組最難的代表檔，逐頁核對解析、跑真實問題的 retrieval test，再演練 embedding model 更換與資料還原。這三關通過，平台的便利才不會變成不可見的鎖定。

## 參考資料

- [RAGFlow 官方 repository 與自架說明](https://github.com/infiniflow/ragflow)
- [RAGFlow Quickstart](https://github.com/infiniflow/ragflow/blob/main/docs/quickstart.mdx)
- [RAGFlow：RAG 基礎與文件處理](https://github.com/infiniflow/ragflow/blob/main/docs/basics/rag.md)
- [RAGFlow 模型設定](https://github.com/infiniflow/ragflow/blob/main/docs/guides/models/llm_api_key_setup.md)
- [Haystack 官方文件](https://docs.haystack.deepset.ai/)
- [Dify 官方 repository](https://github.com/langgenius/dify)
- [R2R 官方 repository](https://github.com/SciPhi-AI/R2R)
