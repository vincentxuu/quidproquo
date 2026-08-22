---
title: "Meilisearch 完整介紹：索引、中文搜尋與多租戶安全"
date: 2026-08-21
category: ai
type: deep-dive
tags: [meilisearch, full-text-search, search-engine, self-hosted, typo-tolerance, multi-tenant]
lang: zh-TW
tldr: "Meilisearch 適合把應用程式資料做成快速、容錯的全文搜尋；真正的導入難點不在 search API，而在索引設定、非同步 task、中文分詞、權限過濾與備份還原。"
description: "從安裝、index／document／task 模型，到 searchable、filterable、sortable 設定、中文搜尋、API key、tenant token、備份與 Agent 工具介面，完整整理 Meilisearch 的導入方式。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-meilisearch-complete-guide-en)

[Meilisearch](https://www.meilisearch.com/docs/learn/getting_started/what_is_meilisearch) 是一套以應用程式搜尋為目標的全文檢索引擎。把產品、文章、文件或客服知識同步進 index 後，它可以提供前綴搜尋、拼字容錯、篩選、排序與 facets，而不必讓每個查詢都掃一次主資料庫。

它不是主資料庫，也不是替 Agent 上網找資料的 public web search，更不是只靠 embedding 找語意相似內容的 vector database。若還在比較搜尋、爬取與自架工具的成本模型，可先看[〈免費搜尋與爬取工具怎麼選〉](/posts/ai/2026-08-21-free-search-scraping-tools)；本文處理的是選定 Meilisearch 後，怎麼把它做成可維運的搜尋服務。

## 先理解 index、document 與 task

Meilisearch 的資料模型不複雜，但三個名詞不能混用：

- **index** 是一組可搜尋文件與搜尋設定，例如 `articles`、`products`。
- **document** 是 JSON object。每份文件都必須有同一個 primary key，例如 `id`。
- **task** 是非同步操作的狀態。建立 index、寫入文件、刪除文件與修改設定，通常先回傳 task，再由背景工作完成。

Primary key 是同步契約，不只是方便查找的欄位。[官方說明](https://www.meilisearch.com/docs/resources/internals/primary_key)指出，一個 index 只能有一個 primary key；相同 key 的文件會更新既有文件，而且 index 已有文件後不能直接更換 primary key。與其依賴欄位名稱推測，建立 index 時就明確指定：

```bash
curl -X POST 'http://127.0.0.1:7700/indexes' \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"uid":"articles","primaryKey":"id"}'
```

回應裡的 `taskUid` 只代表請求已排隊。根據 [task 文件](https://www.meilisearch.com/docs/capabilities/indexing/tasks_and_batches/monitor_tasks)，HTTP 202 或 `enqueued` 都不是寫入成功；部署程式必須查詢 `/tasks/{taskUid}`，直到 `succeeded`，遇到 `failed` 則保存錯誤內容並停止下游步驟。

```bash
curl \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  "http://127.0.0.1:7700/tasks/$TASK_UID"
```

如果設定 task 還沒完成就開始灌資料，或寫入 task 還在排隊就立刻驗收搜尋結果，很容易得到「API 沒報錯、結果卻不完整」的假成功。

## 本機安裝：先做一個只綁 localhost 的 smoke test

[官方 self-hosting 指南](https://www.meilisearch.com/docs/resources/self_hosting/getting_started/install_locally)提供 binary、套件管理器與 Docker 等安裝方式。以下 Docker 指令適合本機驗證；它把連接埠限制在 localhost，並把資料放進專用 volume：

```bash
docker run --rm -it \
  -p 127.0.0.1:7700:7700 \
  -e MEILI_ENV=development \
  -v "$PWD/meili_data:/meili_data" \
  getmeili/meilisearch:v1.37
```

正式環境不要照搬 development 設定。至少要鎖定映像版本、設定 master key、用 TLS reverse proxy 保護傳輸、限制網路入口，並把資料目錄與備份放進持久儲存。版本升級前也要先確認 dump／snapshot 相容性，而不是把 `latest` 直接交給自動部署。

## 搜尋品質首先由 settings 決定

新 index 預設可搜尋所有欄位，對 prototype 很方便，對 production 卻太寬。Meilisearch 需要把欄位用途寫成索引設定：

- `searchableAttributes`：哪些欄位參與全文搜尋，順序也會影響 attribute ranking。
- `filterableAttributes`：哪些欄位可以放進 `filter` 或 facet。
- `sortableAttributes`：哪些欄位允許動態排序。
- `displayedAttributes`：搜尋結果允許回傳哪些欄位。

```bash
curl -X PATCH 'http://127.0.0.1:7700/indexes/articles/settings' \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  --data '{
    "searchableAttributes": ["title", "summary", "body"],
    "filterableAttributes": ["tenant_id", "lang", "category", "published"],
    "sortableAttributes": ["published_at"],
    "displayedAttributes": ["id", "title", "summary", "url", "lang", "published_at"]
  }'
```

[searchable attributes 文件](https://www.meilisearch.com/docs/capabilities/full_text_search/how_to/configure_searchable_attributes)提醒，修改後會觸發非同步重新索引。[filtering 與 sorting 文件](https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/overview)也說明，只有預先宣告的欄位能被篩選或排序，因為引擎要建立額外資料結構。不要把每個欄位都設成 filterable／sortable；這會增加索引時間與記憶體需求，也讓公開查詢介面更難限制。

這組 settings 應像 database migration 一樣進版控：先在 staging 建新 index、寫入固定資料集、跑搜尋回歸測試，再切 alias 或應用程式設定。直接在 production 修改 settings，可能同時帶來 reindex 延遲與排序變化。

## 寫入、更新與刪除都要追 task

`PUT /indexes/{index}/documents` 會依 primary key 新增或更新文件；`POST` 則是新增或取代文件。需要局部更新欄位時通常用 `PUT`，但同步器仍應送出自己能負責的完整搜尋文件，避免舊欄位因不同 producer 交錯而殘留。

```bash
curl -X PUT 'http://127.0.0.1:7700/indexes/articles/documents' \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  --data '[{
    "id": "post_20260821_meili",
    "tenant_id": "site_public",
    "lang": "zh-TW",
    "title": "Meilisearch 完整介紹",
    "summary": "索引、中文搜尋與多租戶安全",
    "url": "/posts/ai/2026-08-21-meilisearch-complete-guide",
    "category": "ai",
    "published": true,
    "published_at": 1787241600
  }]'
```

[document API](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents)一樣先回 task。刪除也不是例外：來源文章下架、帳號刪除或租戶終止時，必須送出 delete 並等待完成，不能只從主資料庫移除。

```bash
curl -X DELETE \
  -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
  'http://127.0.0.1:7700/indexes/articles/documents/post_20260821_meili'
```

可靠的同步器至少要保存 source revision、document id、task uid、送出時間與最終狀態，並提供重跑與 reconciliation。Meilisearch 是衍生索引；主資料庫或 object storage 才是 source of truth。

## Typo tolerance 要按欄位風險調整

[Typo tolerance](https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/typo_tolerance_settings)預設啟用，適合產品名稱、文章標題與一般自然語言。它能讓使用者少打一個字或按錯鍵時仍取得結果，這也是 Meilisearch 開箱搜尋手感好的原因之一。

但訂單編號、SKU、法規條號與人員代碼通常要求精確。這些欄位可以停用 typo tolerance，數字也能另外設定；否則 `AB-1208` 可能匹配到另一個看似相近、實際上完全不同的識別碼。調整後要以真實 query set 比較 recall 與誤匹配率，不要只看幾個手選範例。

同義詞也不能代替資料治理。「LLM」與「大型語言模型」可以是產品語彙同義詞，但品牌名、醫療詞彙與法規術語應由領域負責人審核，並跟 settings 一起版本化。

## zh-TW 的限制在語言判斷，不是完全不能分詞

Meilisearch 使用 [Charabia tokenizer](https://www.meilisearch.com/docs/resources/help/language)，官方列出的語言支援包含需要專門 tokenizer 的中文與日文。因此「Meilisearch 不支援中文分詞」並不精確。

真正要注意的是自動語言判斷。[多語資料指南](https://www.meilisearch.com/docs/capabilities/indexing/how_to/handle_multilingual_data)指出：

1. 中、日文不要混在同一欄位，因為兩者共用大量字元，難以穩定判斷應採哪一種 tokenizer。
2. 很短或只有部分字詞的 query 也不容易偵測語言。
3. 官方優先建議每種語言使用獨立 index；若一定要共用 index，至少拆成不同欄位，並用 localized attributes 與查詢 locales 明示語言。

對 zh-TW 站內搜尋，我會先建 `articles_zh_tw`，不要把繁中、日文與英文全文塞進同一個 `body`。文件保留 `lang: "zh-TW"`，查詢端固定語言範圍，再用實際資料做 benchmark：品牌中英混寫、同義詞、全半形標點、繁簡差異、兩字短詞與常見錯字都要進測試集。

Meilisearch 能解決 tokenizer 與 typo tolerance 的基礎問題，但不會自動理解台灣用語。例如「隨身碟／USB」、「資料庫／數據庫」或產品內部縮寫仍需要同義詞、內容正規化或額外 reranking。中文搜尋能不能上線，應由固定 query relevance 測試決定，而不是由「官方支援 Chinese」一句話決定。

## API key 與 tenant token 是兩種不同邊界

[安全性總覽](https://www.meilisearch.com/docs/capabilities/security/overview)把權限分成三層：

- master key／管理用 API key 留在後端，負責 index、settings、document 與 key 管理。
- search-only key 只適合不需要租戶隔離的公開搜尋。
- tenant token 由可信任後端產生，把 index 範圍、搜尋權限與 filter rules 綁進短效 token。

多租戶系統不能只在前端偷偷加上 `tenant_id = acme` filter。使用者可以自行改 request；真正的隔離條件必須由 tenant token 強制套用。依照 [tenant token payload](https://www.meilisearch.com/docs/capabilities/security/advanced/tenant_token_payload)文件，token 以受限 API key 作為 parent，並可加入過期時間。parent key 也要只授予必要 action 與 index，token 不應比 parent key 活得更久。

[API key 管理指南](https://www.meilisearch.com/docs/capabilities/security/how_to/manage_api_keys)的原則很直接：最小權限、限制 index、設定 expiry、不要把 admin key 放進 browser 或 mobile app，並建立輪替程序。搜尋結果中的內容仍是原始文件資料；若要渲染成 HTML，應在輸出層 escape／sanitize，而不是相信搜尋引擎會替你處理 XSS。

## Snapshot 與 dump 的用途不同

自架搜尋服務遲早會遇到磁碟損壞、誤刪 index 或版本升級。[備份總覽](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/overview)區分兩種機制：

| 機制 | 優點 | 限制 | 適用情境 |
|---|---|---|---|
| snapshot | 是資料庫的快速複本，恢復快 | 只能由相同 Meilisearch 版本載入，檔案較大 | 同版本災難復原 |
| dump | 可攜式資料藍圖，可跨版本匯入 | 匯入時要重建 index，較慢 | 升級、遷移、長期保存 |

[Snapshot 指南](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/snapshots)也提醒，預設目錄中的新 snapshot 會覆蓋舊檔。排程建立不等於備份完成：檔案必須複製到不同故障域，保留多個世代，並定期在隔離環境做 restore drill。

Dump 可透過 `POST /dumps` 建立，同樣要追蹤背景 task；[dump 文件](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/dumps)建議把它用於 migration。升級流程應先產生 dump、驗證檔案、在目標版本匯入並跑搜尋回歸，最後才切換流量。

## 給 Agent 的工具介面應該比原生 API 更窄

Agent 不需要拿到 Meilisearch admin key，也不該自由決定 index、任意 filter 或無上限 `limit`。比較安全的 tool contract 可以只有：

```ts
type SearchKnowledgeInput = {
  query: string;
  category?: "docs" | "policy" | "support";
  sort?: "relevance" | "newest";
  limit?: number;
};

type SearchKnowledgeHit = {
  id: string;
  title: string;
  snippet: string;
  sourceUrl: string;
  updatedAt: string;
};
```

後端 adapter 再負責：

1. 從登入身分取得 tenant，而不是相信模型傳來的 `tenant_id`。
2. 將 category 與 sort 映射到 allowlist，不接受任意 filter expression。
3. 對 query 長度、`limit`、timeout 與回應大小設硬上限。
4. 使用 tenant token 或伺服器端受限 key 查詢。
5. 回傳可引用的 source URL、片段與更新時間，不把整份私有文件塞進 context。

寫入、刪除、settings 與 backup 應是另一套受控的 ingestion／ops 工作流，不是一般對話 Agent 的工具。若 Agent 需要「新增知識」，先寫入 source of truth，經審核與同步器產生 document，再等待 task 成功；不要讓模型直接修改搜尋索引，否則無法保證刪除傳播、權限與稽核紀錄。

## 上線前的最低檢查表

- Primary key 已明確指定，而且能從 source of truth 重建所有 document id。
- Settings 已進版控；可搜尋、可篩選、可排序與可顯示欄位都是最小集合。
- 所有寫入、刪除、設定與 dump 操作都等到 task `succeeded`。
- zh-TW 用真實 query set 測過短詞、繁簡、品牌名、同義詞與中英混寫。
- Public search key 不負責多租戶隔離；私有資料使用後端強制的 tenant token/filter rules。
- Admin key 不出現在前端、Agent prompt、log 或 analytics event。
- Snapshot／dump 已移出主機，且真的做過還原演練。
- Search index 被視為可重建的衍生資料，不承擔交易一致性或唯一真相。

Meilisearch 的價值是用比大型搜尋叢集更小的操作面，快速交付產品內全文搜尋。代價是你仍要自己定義索引 schema、非同步 task、中文 relevance、租戶邊界與災難復原。把這些契約在第一天就寫清楚，它會是一個很務實的搜尋元件；只看 demo 裡的即時搜尋框，上線後才會發現真正難的都在搜尋框之外。

## 參考資料

- [What is Meilisearch?](https://www.meilisearch.com/docs/learn/getting_started/what_is_meilisearch)
- [Install Meilisearch locally](https://www.meilisearch.com/docs/resources/self_hosting/getting_started/install_locally)
- [Primary key](https://www.meilisearch.com/docs/resources/internals/primary_key)
- [Tasks and batches](https://www.meilisearch.com/docs/capabilities/indexing/tasks_and_batches/monitor_tasks)
- [Add or update documents](https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents)
- [Configure searchable attributes](https://www.meilisearch.com/docs/capabilities/full_text_search/how_to/configure_searchable_attributes)
- [Filtering, sorting, and faceting](https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/overview)
- [Typo tolerance settings](https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/typo_tolerance_settings)
- [Language support](https://www.meilisearch.com/docs/resources/help/language)
- [Index multilingual datasets](https://www.meilisearch.com/docs/capabilities/indexing/how_to/handle_multilingual_data)
- [Security overview](https://www.meilisearch.com/docs/capabilities/security/overview)
- [Manage API keys](https://www.meilisearch.com/docs/capabilities/security/how_to/manage_api_keys)
- [Tenant token payload](https://www.meilisearch.com/docs/capabilities/security/advanced/tenant_token_payload)
- [Data backup overview](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/overview)
- [Snapshots](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/snapshots)
- [Dumps](https://www.meilisearch.com/docs/resources/self_hosting/data_backup/dumps)
