---
title: "Linkup Search API 完整指南：從 standard、deep 到結構化輸出"
date: 2026-08-21
category: ai
type: guide
tags: [linkup, web-search, ai-agent, search-api, structured-output]
lang: zh-TW
tldr: "Linkup 把搜尋深度與輸出格式分開控制：多數 agent 查詢先用 standard + searchResults，需要循線讀多頁才升到 deep；每月補回 20 美元是餘額恢復，不是固定再送 20 美元。"
description: "從第一個 Linkup API 呼叫開始，說明搜尋深度、來源與全文取得、JSON Schema、錯誤重試、預付餘額，以及隱私與區域處理的官方邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-linkup-search-api-guide-en)

[Linkup](https://docs.linkup.so/pages/documentation/get-started/introduction) 是給 AI 應用程式用的網路搜尋 API。它不只回傳網址，也能交付可供模型閱讀的搜尋內容、附來源的答案，或符合 JSON Schema 的物件。這篇把認識工具與實際串接放在一起：先選搜尋深度，再選輸出，最後才處理全文、重試與費用。

最重要的觀念是：`depth` 和 `outputType` 是兩條不同的軸。`depth` 決定 Linkup 做多少搜尋與讀頁工作；`outputType` 決定你的程式收到原始來源、整理過的答案，還是固定欄位。不要一開始就把兩者都開到最重。

## 先跑第一個搜尋

到 Linkup 建立 API key，放進環境變數，再直接呼叫同步的 `/v1/search`：

```bash
export LINKUP_API_KEY='<YOUR_LINKUP_API_KEY>'

curl --request POST \
  --url https://api.linkup.so/v1/search \
  --header "Authorization: Bearer $LINKUP_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "q": "Find the official Linkup Search API documentation and summarize its three depth modes.",
    "depth": "standard",
    "outputType": "sourcedAnswer",
    "includeInlineCitations": true
  }'
```

認證格式是 `Authorization: Bearer <token>`。如果不想直接處理 HTTP，也可安裝官方 Python SDK：

```bash
pip install linkup-sdk
```

```python
from linkup import LinkupClient

client = LinkupClient()  # 讀取 LINKUP_API_KEY
response = client.search(
    query="Find the latest official release notes for Astro.",
    depth="standard",
    output_type="searchResults",
    include_domains=["astro.build"],
    max_results=5,
)
print(response)
```

## fast、standard、deep 怎麼選

依[搜尋總覽](https://docs.linkup.so/pages/documentation/endpoints/search/overview)，目前有三種深度：

| 深度 | 實際行為 | 適合情境 |
|---|---|---|
| `fast`（beta） | 不呼叫 LLM，不改寫查詢，也不讀頁面 | 關鍵字式、低延遲的單點查詢 |
| `standard` | 單輪 agentic search，可平行拆成數個搜尋，也能讀取查詢中提供的一個 URL | 多數即時問答與 agent 工具呼叫 |
| `deep` | 多輪搜尋、讀頁與評估，前一步結果可交給下一步 | 要找出網址後繼續讀、多來源循線研究 |

實務上的預設值是 `standard`。如果問題只像「NVIDIA Q4 2024 revenue」，可試 `fast`；如果指令是「先找官方定價頁，再讀產品頁，最後整理方案差異」，才需要 `deep`。官方[最佳實務](https://docs.linkup.so/pages/documentation/endpoints/search/best-practices)也提醒，`fast` 會把整段指令當成關鍵字，不會理解「先做 A、再做 B」。

`standard` 與 `deep` 的查詢則要寫成檢索任務。與其問「告訴我這家公司」，不如明列要找的頁面、要抽取的欄位，以及希望怎麼呈現。日期範圍應放進 `fromDate`、`toDate`，來源限制用 `includeDomains` 或 `excludeDomains`；`includeDomains` 最多可放 100 個網域。

## 三種輸出對應三種下游

`outputType` 不只是顯示格式，它決定誰負責最後一步推理：

- `searchResults`：回傳排序後的來源與內容片段，適合交給自己的 LLM、reranker 或儲存流程。
- `sourcedAnswer`：Linkup 直接整理自然語言答案；開啟 `includeInlineCitations` 可要求行內引用，適合直接顯示給人看。
- `structured`：依 `structuredOutputSchema` 產生固定欄位，適合後端程式接續處理。

來源物件包含名稱、URL 與文字內容；不同輸出與 SDK 包裝的欄位外層不完全相同。正式程式應依[當前 API reference](https://docs.linkup.so/pages/documentation/endpoints/search/reference)與 SDK 型別處理，不要假設三種輸出都叫 `results`。

如果你要的是已知網頁的全文，不要要求 Search 把片段硬撐成全文。改用 `/v1/fetch`，它會回傳清理後的 Markdown；動態頁面才開 `renderJs`：

```bash
curl --request POST \
  --url https://api.linkup.so/v1/fetch \
  --header "Authorization: Bearer $LINKUP_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "url": "https://docs.linkup.so/pages/documentation/endpoints/search/overview",
    "renderJs": false,
    "includeRawHtml": false,
    "extractImages": false
  }'
```

這會形成一條容易控制的管線：Search 找候選 URL，程式挑出真正需要的頁面，再用 Fetch 取全文。比讓一次搜尋讀遍所有結果更容易控制成本與上下文。

## 用 JSON Schema 交付可解析結果

要讓回傳值直接進資料庫或工作流程，把 `outputType` 設成 `structured`，並提供根節點為 `object` 的 JSON Schema。REST API 的 `structuredOutputSchema` 是 JSON 字串；Python SDK 也接受 Pydantic model 或字串。

```python
import json
from linkup import LinkupClient

schema = {
    "type": "object",
    "properties": {
        "product": {"type": "string"},
        "current_version": {"type": "string"},
        "release_url": {"type": "string"},
    },
    "required": ["product", "current_version", "release_url"],
}

client = LinkupClient()
response = client.search(
    query="From the official Astro website, find the current stable version and its release URL.",
    depth="standard",
    output_type="structured",
    structured_output_schema=json.dumps(schema),
    include_domains=["astro.build"],
    include_sources=True,
)
print(response)
```

Schema 只規定形狀，不會替搜尋補出不存在的證據。查詢文字仍要明確要求對應欄位，重要欄位放進 `required`；要保留查證路徑則開 `includeSources`。官方[結構化輸出指南](https://docs.linkup.so/pages/documentation/tutorials/structured-output-guide)特別指出，啟用來源後會改變回應外層結構，因此下游型別也要一起調整。

## 錯誤與重試要分流

Linkup 的錯誤本文會帶 `statusCode`，以及包含 `code`、`message`、`details` 的 `error`。依[錯誤文件](https://docs.linkup.so/pages/documentation/platform/errors)，常見狀態包括：

- `400`：參數不合法，或搜尋沒有結果。修正請求，不要原封不動重試。
- `401`、`403`：API key 或權限問題。停止重試並檢查設定。
- `429`：可能是餘額用完，也可能是同時送出太多請求。先查餘額，再決定補款或退避。
- `500`：服務端錯誤。可做有上限的指數退避。

官方文件沒有公布 `Retry-After` 保證或一套固定重試次數。下面是呼叫端的保守做法，不是 Linkup 的服務承諾：只對暫時性 `429`、`500` 重試，加入 jitter，設總時限，並記錄每次失敗。Search 是付費呼叫，也不要用無限重試掩蓋壞查詢。

先用餘額端點區分 `429`：

```bash
curl --request GET \
  --url https://api.linkup.so/v1/credits/balance \
  --header "Authorization: Bearer $LINKUP_API_KEY"
```

## 「每月把餘額補回 20 美元」到底是什麼

Linkup 的[公開定價文件](https://docs.linkup.so/pages/documentation/platform/pricing)寫的是：新帳號先取得 20 美元預付餘額，之後每月把 credits **補回** 20 美元。照這句話的字面，若補款時餘額剩 3 美元，是補 17 美元回到 20 美元；不是每月固定再加 20 美元。若餘額已高於 20 美元，也不能據此認定還會再加。

但公開文件沒有說明補款發生在每月哪一天、未用餘額是否另有期限，或付費加值會如何影響補款。介面所稱「eligible account」也沒有公開資格判準。因此，不應把它寫死成產品內的月額保證。程式應讀 `/v1/credits/balance`、設低餘額告警；要做正式預算承諾時，向 Linkup 確認自己帳號與合約的規則。

目前 Search 的單次費用依深度與輸出而異：`standard + searchResults` 是 0.005 美元，`standard + sourcedAnswer/structured` 是 0.006 美元；`deep` 分別是 0.05 與 0.055 美元。官方文件也寫明，錯誤或找不到相關結果時不扣款，餘額耗盡會回 `429`。價格會變，正式上線前仍要重看定價頁。

## 隱私、ZDR 與區域不能混成一句 GDPR

這裡最容易寫過頭。Linkup 的[隱私政策](https://www.linkup.so/privacy-policy)說，其蒐集的個人資料在歐盟處理與儲存。目前的[安全 FAQ](https://docs.linkup.so/pages/security-and-privacy/faq)則說，API 查詢預設可能依負載在美國、歐盟、加拿大與亞太地區處理。指定地理區域的查詢處理要透過 enterprise agreement 保證。

同一份 FAQ 說 Zero Data Retention 可提出申請，而且預設沒有開啟；啟用後，查詢與結果不寫入持久儲存。這不等於「所有方案、所有新帳號預設 ZDR」，也不等於一般帳號自動具備歐盟境內查詢處理。若查詢會帶客戶名稱、內部識別碼或受管制資料，實際動作是先確認合約中的處理地區、ZDR 狀態與 DPA，再送資料。

## 整體來說

Linkup 適合想用一支 API 取得「搜尋結果、附來源答案、結構化資料與已知頁面全文」的 agent。穩健的起點不是全面用 `deep`，而是 `standard + searchResults`：讓自己的應用程式掌握來源、驗證與後續推理；只有問題真的需要多輪循線時才升級深度。

上線前再補三道護欄：保留來源 URL、針對 `429` 先判斷餘額或併發、把區域與 ZDR 當成帳號／合約設定驗證。這三件事比把搜尋 prompt 寫得更華麗重要。

## 參考資料

- [Linkup API introduction](https://docs.linkup.so/pages/documentation/get-started/introduction)
- [Search overview](https://docs.linkup.so/pages/documentation/endpoints/search/overview)
- [Search API reference](https://docs.linkup.so/pages/documentation/endpoints/search/reference)
- [Search best practices](https://docs.linkup.so/pages/documentation/endpoints/search/best-practices)
- [Fetch API reference](https://docs.linkup.so/pages/documentation/endpoints/fetch/reference)
- [Structured Output Guide](https://docs.linkup.so/pages/documentation/tutorials/structured-output-guide)
- [Authentication](https://docs.linkup.so/pages/documentation/platform/authentication)
- [Errors](https://docs.linkup.so/pages/documentation/platform/errors)
- [Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Credit balance API](https://docs.linkup.so/pages/documentation/endpoints/account/balance)
- [Security and Privacy FAQ](https://docs.linkup.so/pages/security-and-privacy/faq)
- [Linkup Privacy Policy](https://www.linkup.so/privacy-policy)
