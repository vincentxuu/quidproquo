---
title: "私有語料查詢安全：ACL、刪除傳播與 freshness"
date: 2026-08-22
category: ai
type: deep-dive
tags: [private-corpus, access-control, acl, multi-tenancy, data-lineage, observability]
lang: zh-TW
tldr: "私有搜尋的授權必須在候選生成前生效，並把 ACL、刪除事件與來源版本傳到每一份衍生索引；freshness 也要用可量測的事件時間與 SLA 管理。"
description: "從 pre-filter、post-filter 與多租戶隔離，談到撤權、刪除傳播、來源血緣和 freshness 監控，整理私有語料查詢層真正需要守住的邊界。"
draft: false
series:
  name: "私有語料管線"
  order: 3
---

> 🌏 [English version](/posts/ai/2026-08-22-private-corpus-access-en)

私有語料進了搜尋索引，不代表它已經可以安全地被查詢。真正麻煩的是：使用者的群組剛被移除、文件剛改成機密、來源剛刪除一頁時，關鍵字索引、向量索引、快取與摘要副本不會在同一瞬間更新。

這篇只談查詢時的授權與資料狀態，不再解釋 BM25、embedding、hybrid search 或 reranker。核心判準很簡單：**搜尋結果不只要相關，還要在這次查詢發生的當下仍可見、仍存在、而且新到符合承諾。**

## Pre-filter 是安全邊界，post-filter 只是補強

一次安全查詢應先由後端驗證身分，解析租戶與群組，再把授權條件送進每一個候選生成器：

```text
authenticated identity
        │
        ▼
policy decision ── tenant_id + allowed principals + policy version
        │
        ├── keyword index ──┐
        ├── vector index  ──┼── merge / rank ── final authorization check ── response
        └── cache          ──┘
```

這就是 pre-filter：未授權文件不應進入候選集合。Post-filter 則是在取回候選後再檢查一次權限；它適合攔截同步延遲或程式錯誤，卻不該是唯一防線。

只做 post-filter 有三個問題。第一，為了湊滿可見的前 k 筆，系統得不斷超額取回，授權資料稀疏時可能回傳不足或延遲失控。第二，未授權文件已經進入排名、日誌、追蹤或快取，內容即使沒顯示，標題、分數與文件 ID 仍可能旁漏。第三，只要某條回應路徑忘了過濾，例如自動完成、匯出或除錯端點，ACL 就被繞過。

[Azure AI Search 的安全過濾模式](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)很能說明邊界：把使用者或群組識別碼存成可過濾欄位，再於查詢中比對；文件也特別提醒，這種識別碼只是字串，本身不會替應用程式完成驗證或授權。因此，query service 必須從已驗證的 token 建立條件，不能接受瀏覽器傳來的 `tenant_id` 或群組清單。

實作上可以同時做兩層：候選生成器 pre-filter，送出結果前再向授權服務做 final check。後者要 fail closed；授權服務逾時時，不把「不知道」當成「允許」。[NIST SP 800-207](https://doi.org/10.6028/NIST.SP.800-207)把原則寫得更廣：資源授權是動態決策，應在存取前嚴格執行，且持續蒐集存取請求與資產狀態來改善政策。

## ACL 漏洞通常出在副本與預設值

私有搜尋常見的 ACL 漏洞，不是演算法太難，而是某份衍生資料漏帶了權限：

- 文件有 ACL，chunk 卻沒有，查詢只過濾 chunk。
- 關鍵字索引有 `allowed_group_ids`，向量索引漏了同一欄位。
- 文件 ACL 更新了，query cache 還用舊的群組集合當 key。
- 空 ACL 被解讀成「公開」，其實是 connector 尚未取得權限。
- 使用者離開群組後，長效 token 或本機群組快取仍把舊 membership 當有效。

安全的預設值應該相反：缺少租戶、ACL、來源版本或政策版本的記錄不得進入可查詢索引。每個 chunk、摘要與附件都要繼承來源文件的授權欄位，並保留自己的衍生關係；更新 ACL 時，要能用 canonical document ID 找到所有副本。

ACL 資料也有 freshness。[Azure AI Search 的文件層級存取控制](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)明確指出，查詢是拿 token 權限與「已存進索引」的權限 metadata 比對；來源端的 ACL 變更要等下一次 indexer、push update 或特定 refresh 才會反映。換句話說，查詢時驗證最新 token 仍不夠，文件那一側的 ACL 副本也必須有可接受的同步延遲。

跨群組與繼承權限更不能靠臨時拼字串。[Google Zanzibar 論文](https://www.usenix.org/conference/atc19/presentation/pang)處理的「new enemy」問題正是：使用者先撤銷另一人的權限，隨後寫入新內容，舊快照不能讓被撤權者看到後來的內容。論文用外部一致性、snapshot read 與一致性 token 維持 ACL 與內容更新的因果順序。一般團隊不必複製 Zanzibar，但至少要為 ACL 與內容標上單調遞增版本，讓 query service 能拒絕低於所需政策版本的索引快照。

## 多租戶隔離不能只靠一個可選 filter

共享 collection 可以節省成本，但 `tenant_id` 必須由可信任的後端注入，而且每條查詢路徑都強制套用。以 [Qdrant 的 multitenancy 文件](https://qdrant.tech/documentation/guides/multiple-partitions/)為例，共享 collection 的基本做法是在 point payload 放租戶欄位，查詢時依該欄位過濾；較大的租戶也可以分配 dedicated shard。

這個 filter 是資料分區機制，不是完整的授權系統。應用程式仍要限制誰能指定哪個租戶，批次查詢、recommend、scroll、count 與管理 API 也必須經過同一個 query gateway。快取 key 至少要包含租戶、主體或等價的授權集合雜湊，以及 policy version；否則相同查詢文字可能命中另一位使用者的結果。

隔離強度要按風險選：一般內部團隊可共用 collection 加強制 filter；法規、加密金鑰或客戶合約要求更強邊界時，改成租戶專屬 collection、叢集或帳號。無論哪一層，都要用負向測試驗證：建立兩個租戶的同名文件，逐一打所有查詢 API，確認跨租戶結果、筆數、facet 與錯誤訊息都不洩漏。

## 刪除是一段流程，不是一個 API 回應

來源刪除文件後，只刪主要索引不夠。要把刪除當成有狀態的事件：

```text
source deleted / access revoked
  → tombstone recorded
  → keyword copies deleted
  → vector chunks deleted
  → summaries, caches, exports invalidated
  → search visibility verified
  → retention purge completed
```

Tombstone 要帶 canonical document ID、來源、來源版本、事件時間與刪除原因。每個 consumer 完成後記錄自己的 offset 或 completion time；重試必須冪等。若來源暫時讀不到，不要立刻把所有缺席項目視為刪除，否則 connector 故障會變成大規模誤刪。相反地，明確撤權是安全事件，應走高優先序佇列並縮短可見窗口。

「delete API 回 200」也不等於搜尋已不可見。[OpenSearch 的 Delete Document API](https://docs.opensearch.org/latest/api-reference/document-apis/delete-document/)說明，刪除預設要到下一次 index refresh 才會反映在搜尋；`refresh=wait_for` 可以等到變更可見再回應。這區分了三個時間點：刪除已受理、搜尋已不可見、儲存與備份已依保留政策清除。監控與對外承諾要說清楚是哪一個。

## 來源血緣讓你知道還要刪哪裡

每筆可搜尋記錄至少要能回答：它來自哪個 source object、由哪次 connector run 產生、使用哪個 parser 與 schema version、目前 content／ACL version 是多少、衍生出哪些 chunk 或摘要。沒有這條血緣，刪除只能靠全文比對或整庫重建，也無法判斷某個結果為何仍然陳舊。

[OpenLineage API](https://openlineage.io/apidocs/openapi/)用 run、job、input dataset 與 output dataset 事件描述資料處理血緣。私有語料管線不一定要部署 OpenLineage，但可以沿用相同思路：每次同步有唯一 run ID，記錄 START 與 COMPLETE／FAIL，並把 input source version 連到所有 output IDs。這些 metadata 不必暴露給終端使用者，卻要能讓維運者從一筆搜尋結果反查完整路徑。

## Freshness SLA 要量事件時間，不量排程有沒有跑

「每五分鐘同步一次」不是 freshness SLA。真正需要量的是來源事件到查詢可見的端到端延遲：

- **content lag**：來源修改時間到新版本可被搜尋的時間。
- **ACL lag**：來源撤權時間到所有查詢路徑拒絕存取的時間。
- **deletion lag**：來源刪除時間到所有 serving index 與 cache 不再回傳的時間。
- **run health**：connector 最後成功時間、連續失敗次數、dead-letter 數量與 backlog age。
- **version skew**：關鍵字、向量、摘要與 ACL 副本之間的版本差。

每個來源依風險訂 SLO：組織通訊錄與撤權可能要求數分鐘內生效，產品手冊則可接受較長延遲。告警應看 lag 的高百分位與最舊未完成事件，不只看平均值；平均值會把少數卡住數小時的刪除藏起來。

最後加一個 canary：定期建立只允許測試群組看的文件，確認授權使用者查得到、未授權使用者查不到；接著撤權並刪除，量到所有索引與快取不再回傳所花的時間。這個測試同時驗證 ACL、刪除傳播與 freshness，比單看 connector 顯示綠燈可靠。

## 整體來說

私有語料查詢的安全性取決於狀態同步，而不是最後一層 UI 有沒有藏掉結果。把租戶與 ACL 放進候選生成的 pre-filter，用 final check 補強；把撤權與刪除當成會傳遍所有副本的高優先事件；用 canonical ID、run ID 與版本建立來源血緣；最後用端到端 lag 驗證 SLA。

今晚可以先做一件事：挑一份有權限的文件，列出它在關鍵字索引、向量索引、摘要、快取與匯出中所有副本，實際撤權一次並計時。找不到的副本與量不到的時間，就是目前管線真正的安全缺口。

## 參考資料

- [Microsoft Learn：Document-level access control in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview)
- [Microsoft Learn：Security filters for trimming results in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search)
- [NIST SP 800-207：Zero Trust Architecture](https://doi.org/10.6028/NIST.SP.800-207)
- [USENIX ATC 2019：Zanzibar: Google's Consistent, Global Authorization System](https://www.usenix.org/conference/atc19/presentation/pang)
- [Qdrant：Multitenancy](https://qdrant.tech/documentation/guides/multiple-partitions/)
- [OpenSearch：Delete Document API](https://docs.opensearch.org/latest/api-reference/document-apis/delete-document/)
- [OpenLineage API documentation](https://openlineage.io/apidocs/openapi/)

