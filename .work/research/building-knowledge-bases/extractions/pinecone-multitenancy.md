# 抽取紀錄：Pinecone docs — Design for multitenancy ＋ Implement multitenancy

read_status=full（兩頁以 docs.pinecone.io 的 .md 端點 curl 取原始 Markdown，從標題讀到最後一行；程式碼範例只核對與正文一致，多語言重複版本掃過）

## 書目

- (D) "Design for multitenancy"，https://docs.pinecone.io/guides/index-data/design-for-multitenancy
  - 全文檔 scratchpad/fulltext/o17-pinecone-design-multitenancy.md（378 行、12,867 bytes），已讀全部（正文行 1–27、176–183、362–378；其餘為 Python/JS/Java/Go/curl 範例）。
- (I) "Implement multitenancy"，https://docs.pinecone.io/guides/index-data/implement-multitenancy
  - 全文檔 o17-pinecone-implement-multitenancy.md（808 行、26,517 bytes），已讀全部（正文行 1–51、175–179、413、483–487、731–735、792–808；其餘為多語言範例）。
- 兩頁 .md 版無日期。讀取日 2026-10-22。原始檔 o17raw/pc-design.md、pc-impl.md。
- scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文「D 行」「I 行」為上列檔行號。同站另一頁 Filter by metadata 已有紀錄 pinecone-filter-by-metadata.md（order 15）。

## 性質

- 廠商官方設計指引；數字（RU、上限）是該產品的計價與限制，不是實證研究。

## 可引用內容（原文）

1. 建議：一租戶一 namespace（D 行 13）："The most efficient way to implement multitenancy is to use namespaces to separate data by tenant."
2. **隔離理由**（I 行 37）："In the serverless architecture, each namespace is stored separately, so using namespaces provides physical isolation of data between tenants/customers. This reduces the risk of application bugs that could query the wrong tenant's data."；D 行 22："Natural isolation: Reduces the risk of application bugs that could query the wrong tenant's data (for example, by passing an incorrect filter value)."
3. 成本數字（I 行 43；D 行 21）："Query cost is based on namespace size (1 RU per 1 GB). With 100 tenants of 1 GB each, querying one tenant's namespace costs 1 RU. Using metadata filtering in a single 100 GB namespace would cost 100 RUs for the same query, because it scans all data regardless of filters."
4. 退租（I 行 45、733）：刪 namespace 即刪該租戶全部資料，"a lightweight and almost instant operation."
5. 上限（I 行 19）：每個 serverless index 的 namespace 數 "100 on Starter to 1,000,000 on Enterprise"。
6. **反模式：用使用者 ID 清單過濾**（D 行 26、176–179）："A common anti-pattern is storing all data in a single namespace and using metadata filters to scope queries to specific users"；缺點 "Large `$in` filters increase network payload size and query latency." "Each `$in` or `$nin` operator is limited to 10,000 values. Exceeding this limit will cause the request to fail."
7. 改用群組（D 行 183、362）："design your access control using the smallest number of groups that describe a user's access"；"Instead of passing thousands of user IDs, this filter uses only 2 group identifiers to achieve the same access control."
8. 選擇表（D 行 368–372）：資料完全分開 → 一 namespace 一租戶；大租戶有子群組 → 大租戶一個 index、子群組用 namespace；跨租戶共享資料 → 共用 namespace、依群組 ID（org、project、role）過濾，成本較高、較慢。
9. 替代方案的警告（I 行 794–804）：metadata 過濾適用於 "When tenant isolation isn't a strict requirement"；並列出 "post-filter client-side (for semantic search)" 為大 ID 清單的替代之一。

## 沒寫的事

- 沒有召回數字；沒說 metadata 過濾會不會降低召回（另一頁 Filter by metadata 也沒有）。
- 沒談文件層級 ACL（同一租戶內不同使用者權限不同）怎麼做，只建議用群組。
- 沒談權限變更怎麼同步。

## 與範圍卡說法的核對

- 範圍卡「多租戶隔離」：本頁可當出處。原文把 namespace 隔離的理由寫成「減少應用程式 bug 查錯租戶」（D 行 22、I 行 37）——也就是**用結構隔離取代「每次都記得帶對過濾條件」**，這是文章可以講的重點。
- 注意 Pinecone 自己也列「客戶端事後過濾」為選項之一（I 行 804），所以「事後過濾一定錯」不成立；它的代價是回傳可能不足 k 筆（見 pgvector-readme-filtering.md、amanbayev-2026-filtered-anns.md）。

## 對 order 17 的用法

- 「在哪一層過濾」的最外層：租戶之間用 namespace／分割表（結構隔離），租戶之內用群組過濾。
- 「權限用群組而不是逐一列使用者」：D 行 183、362，附 10,000 上限當具體理由。
