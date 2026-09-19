---
title: "10% 的對話在編答案：Retriever 靜默失敗的排查紀錄"
date: 2026-09-19
category: ai
type: debug
tags: [rag, debugging, error-handling, fault-tolerance, elasticsearch, retrieval, agent-reliability]
lang: zh-TW
tldr: "AI 助理平台約 10% 的對話隨機沒有知識庫工具，agent 直接用訓練資料編答案。根因是 retriever 初始化時的 except Exception 吞掉了 Elasticsearch 連線失敗，導致工具註冊靜默跳過。修法：加 retry + 把失敗 surface 到 system prompt + metadata 追蹤。"
description: "一次 RAG 系統靜默失敗的完整排查：從使用者回報「回答不準」到發現 except Exception 吞掉 ES 連線錯誤的根因鏈。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-retriever-silent-failure-en)

## TL;DR

我們的 AI 助理平台約 10% 的對話隨機沒有知識庫（KB）工具可用——agent 不會報錯，而是若無其事地用訓練資料編出「看起來合理」的答案。根因是 retriever 初始化程式用 `except Exception` 吞掉了 [Elasticsearch](https://www.elastic.co/elasticsearch) 連線失敗，工具註冊被靜默跳過。使用者看到的症狀是「有時回答很準、有時胡說八道」，完全無法預測。

## 情境

客戶回報：同一個 AI 助理，問同一類問題，有時引用知識庫精準回答，有時明顯在瞎掰——給出知識庫裡根本沒有的資訊。重新問一次，又恢復正常。

初步懷疑是 RAG 檢索品質問題（排序不好、chunk 切歪），但抽查「回答不準」的對話後發現更根本的問題：**那些對話裡根本沒有 KB 相關的 tool call**。agent 不是「檢索到錯的東西」，而是「壓根沒去檢索」。

## 問題

從監控系統比對正常與異常對話的 tool 清單：

```
正常對話的可用工具：
  retrieve_text_nodes, retrieve_faq_nodes, image_search, web_search, ...

異常對話的可用工具：
  web_search, ...
  （KB 相關工具全部消失）
```

KB 工具在 agent 啟動時動態註冊：系統根據 chatbot 綁定的知識庫，初始化對應的 retriever，成功後才把 `retrieve_text_nodes` 等工具加進 tool list。如果初始化失敗，這些工具就不會出現——agent 也不知道自己「本來應該有」這些工具。

## 嘗試過程

### 第一層：是哪些對話出問題？

拉了 7 天的對話 metadata，標記「有 KB 工具」和「沒有 KB 工具」的比例。結果不是某個特定 chatbot 或時段——**隨機散布在所有 chatbot、所有時段，約佔 10%**。

這排除了設定問題（某個 chatbot 沒綁 KB）和部署問題（新版上線後壞掉）。隨機、低頻、跨 chatbot——典型的**瞬態錯誤**特徵。

### 第二層：retriever 初始化到底做了什麼？

追程式碼，retriever 初始化的流程大致如下：

```python
def _init_retrievers(self, chatbot):
    for kb in chatbot.knowledge_bases.all():
        try:
            retriever = self._create_retriever(kb)
            # 連線 ES、驗證 index 存在、載入設定
            retriever.validate()
            self.retrievers.append(retriever)
        except Exception:
            # 初始化失敗就跳過這個 KB
            pass
```

看到 `except Exception: pass` 的瞬間，根因就浮出來了。

### 第三層：為什麼 ES 連線會偶爾失敗？

ES cluster 在正常運作時，連線是毫秒級完成的事。但在以下場景會短暫無法連線：

- **cluster 節點滾動更新**（rolling restart）
- **網路瞬斷**（雲端環境的常態）
- **連線池耗盡**（高並發時段）
- **DNS 解析延遲**

這些都是秒級的瞬態錯誤，retry 一次通常就成功。但 `except Exception: pass` 連 retry 都不做，直接放棄。

## 為什麼會這樣

三個因素疊加成這個靜默失敗：

1. **`except Exception` 吞掉所有錯誤**：不區分「ES 暫時連不上」（retry 就好）和「index 不存在」（設定錯誤），一律靜默跳過。沒有 log、沒有 metric、沒有任何人知道這件事發生了。

2. **agent 不知道自己缺了工具**：tool list 是動態組裝的，agent 只看到「我現在有 web_search」，不會意識到「我本來應該還有 retrieve_text_nodes」。它會用手上有的工具盡力回答——用 web search 或直接用訓練資料。

3. **「看起來合理」的幻覺比報錯更危險**：如果 agent 說「我無法存取知識庫」，使用者會重試或通報。但 agent 給出一個流暢、自信、結構完整的回答——只是內容是編的——使用者很可能直接採信。

依 [Elasticsearch 官方文件](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html)，瞬態連線失敗在分散式系統中是預期行為，客戶端應實作 retry 機制。

## 解法

三管齊下：

### 1. Retry 機制

```python
def _init_retrievers(self, chatbot):
    for kb in chatbot.knowledge_bases.all():
        retriever = None
        for attempt in range(2):  # 最多試 2 次
            try:
                retriever = self._create_retriever(kb)
                retriever.validate()
                break
            except ConnectionError:
                if attempt == 0:
                    time.sleep(0.5)
                    continue
                raise
        if retriever:
            self.retrievers.append(retriever)
```

瞬態錯誤 retry 一次就好。500ms 的 backoff 足以避過大多數網路抖動。

### 2. 失敗 surface 到 system prompt

如果 retry 後仍然失敗，在 agent 的 system prompt 注入一條通知：

```
⚠️ 知識庫「{kb.name}」目前無法存取。如果使用者的問題需要查詢知識庫，
請告知使用者系統暫時無法檢索相關資料，建議稍後再試。
不要用你的訓練資料編造可能不正確的答案。
```

agent 從「不知道自己缺了什麼」變成「明確知道知識庫有問題，並被指示不要編答案」。

### 3. Metadata 追蹤

在對話的 metadata 記錄 retriever 初始化狀態：

```json
{
  "retriever_init": {
    "attempted": ["kb-001", "kb-002"],
    "succeeded": ["kb-001"],
    "failed": ["kb-002"],
    "failure_reason": "ConnectionError after 2 attempts"
  }
}
```

這讓監控系統能抓出「哪些對話的 KB 工具有缺」，設 alert 追蹤失敗率趨勢。

## 學到的事

**`except Exception: pass` 是生產系統裡最危險的三個字。**

它不是「容錯」——它是「把錯誤藏起來，讓所有人以為系統正常運作」。在 agent 系統裡尤其致命：agent 不會抱怨自己少了工具，它會用手上有的東西盡力回答，產出「看起來正確但實際上是幻覺」的內容。

如果你的系統有動態初始化的元件（工具、plugin、retriever），至少做到這三件事：

1. **區分可 retry 的瞬態錯誤和不可恢復的設定錯誤**
2. **讓系統知道自己的能力降級了**（通知 agent、通知使用者、通知監控）
3. **記錄初始化失敗的結構化 metadata**，不是只 log 一行然後忘掉

靜默失敗的代價不是「系統掛了」——是「系統在錯誤的狀態下繼續運作，而且沒有人知道」。

## 參考資料

- [Elasticsearch — Network Settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html) — ES 連線行為與瞬態錯誤的預期
- [Elasticsearch — Retry on Conflict](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html#docs-update-api-query-params) — ES 官方對 retry 的建議
- [Python Exceptions — Best Practices](https://docs.python.org/3/tutorial/errors.html) — 為什麼不該用 bare except
- [LlamaIndex — Retriever](https://docs.llamaindex.ai/en/stable/module_guides/querying/retriever/) — retriever 初始化流程的參考
