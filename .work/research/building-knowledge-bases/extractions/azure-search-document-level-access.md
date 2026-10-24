# 抽取紀錄：Azure AI Search — Security filters for trimming results ＋ Document-level access control

read_status=full（兩頁 curl 取 HTML → 取正文 div → pandoc 轉 Markdown → 刪空行，從標題讀到頁尾 Last updated；表格另以 pandoc plain 抽出逐列讀）

## 書目

- (A) "Security filters for trimming results in Azure AI Search"，https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search
  - meta ms.date 2026-08-21；頁尾 "Last updated on 2026-08-24"。範例 API 版本 2026-04-01。
  - 全文檔：scratchpad/fulltext/o17-azsec.md（172 行、10,913 bytes），已讀 1–172 全部。原始 HTML o17raw/azsec.html（58,271 bytes）。
- (B) 新版頁 "Document-level access control in Azure AI Search"，https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview
  - meta ms.date 2026-08-08；頁尾 "Last updated on 2026-09-17"。preview API 2026-08-01-preview。
  - 全文檔：scratchpad/fulltext/o17-azdlac.md（141 行、22,198 bytes），已讀 1–141 全部；行 29 的 [TABLE]（四種做法對照表）另從 o17raw/azdlac.html 用 pandoc plain 抽出讀完。
- scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 讀取日 2026-10-22。下文「A 行」「B 行」為上列兩檔行號。

## 性質

- 廠商官方操作文件（規範性說明），沒有實證數據；唯一的「效能」說法是質性（「subsecond」「many seconds」）。

## 可引用內容（原文）

1. 舊做法的定位（A 行 24）：安全過濾是給「不能用內建 ACL 支援」的情況："For search solutions that can't use the built-in access control list (ACL) support for document-level authorization, Azure AI Search supports creating a filter that trims search results based on a string containing a group or user identity."
2. 安全過濾只是字串比對，不是驗證（A 行 32）："There's no authentication or authorization through the security principal. The principal is just a string, used in a filter expression, to include or exclude a document from the search results."
3. 做法四步（A 行 26–29 附近 checklist）：文件帶身分字串 → 索引建 `Collection(Edm.String)` 欄位、filterable=true、retrievable=false → 推進索引 → 查詢帶 `group_ids/any(g:search.in(g, 'group_id1, group_id2'))`（A 行 125、132）。
4. 效能（A 行 33–34）：用一長串 `Id eq 'id1' or ...` "in cases where the list contains hundreds or thousands of values, slows down query response time by many seconds"；改用 `search.in` "you can expect subsecond response times."
5. **retrievable=false 不是安全機制**（A 行 77）："It isn't a content-obfuscation or field-level security mechanism. In this pattern, document-level authorization is enforced by applying the security filter to every query. Don't rely on `retrievable` alone to protect sensitive information from all query features or response formats."
6. 權限欄要自己填（A 行 79）："Azure AI Search doesn't provide APIs or features for populating the security field specifically."；群組改了用 `merge`/`mergeOrUpload` 更新該文件的 group_ids（A 行 82–96 範例）。
7. 新版四種做法（B 行 28 與表）：Security filters（字串比對，GA）；POSIX-like ACL / RBAC scopes（preview，ADLS Gen2 與 Blob）；Microsoft Purview sensitivity labels（preview）；SharePoint in Microsoft 365 ACLs（preview）。除 Security filters 外都標 preview。
8. 原生做法的查詢流程（B 行 99–103）：查詢時在 header `x-ms-query-source-authorization` 帶使用者的 Entra token；服務抽出 user/group/scope claims，和索引裡的權限 metadata 比對，"Returns only documents whose synchronized permission metadata grants the caller access."
9. **權限變更要同步才生效**（B 行 104）："Permission changes in the source system (Microsoft Entra group membership, ADLS Gen2 ACLs, Purview label assignments, or SharePoint ACLs) are only reflected in search results after that metadata is synchronized to the index through the source-specific mechanism, for example, a subsequent indexer run, a push-API update, or a Purview-driven refresh." SharePoint：唯一權限項目的 ACL 變更自 2026-05-01-preview 起每次 indexer 執行增量抓；**從上層（site、library、list、folder）繼承的變更要明確 refresh**。
10. **切塊後權限要跟到每個 chunk**（B 行 77、81、96）：有 Text Split 切塊時 ACL 欄位要從 indexer field mappings 移到 index projections；sensitivity label 也要 "project the sensitivity label to each chunk row ... Without this projection, chunk-level references aren't filtered."
11. 為什麼不在應用端事後修剪（B 行 108、111）：原生做法 "Eliminates custom permission code: You don't need to implement nested group resolution, multilevel ACL traversal, or post-query trimming in your application."；"Improves performance versus post-query trimming: Filtering inside the search pipeline is faster than loading larger result sets into your application and trimming there"。
12. 限制（B 行 90、30）：Purview 標籤強制只支援 single-tenant、需 RBAC；Autocomplete/Suggest 不支援；啟用原生權限匯入時不能用 image serving。

## 沒寫的事

- 沒有任何召回或延遲的數字；沒說過濾會不會讓 top-k 變少（Azure 的 filter 是在搜尋管線內套用，頁面沒談對向量召回的影響）。
- 沒說巢狀群組怎麼展開（安全過濾模式下要應用端自己算使用者屬於哪些群組再傳入）。
- 沒談多使用者對話（例如 A 幫 B 草擬回覆）時要用誰的身分過濾。

## 與範圍卡說法的核對

- 「檢索時過濾（文件帶群組 ID、查詢帶使用者群組）」：A 頁就是這個模式，可直接當出處（A 行 125–153）。
- 「而不是生成後再擋」：A、B 都沒談「生成後擋」；B 頁比較的對象是「應用端拿回結果後再修剪（post-query trimming）」，理由是**效能與要自己寫巢狀群組邏輯**，不是安全性。文章若要講「生成後擋不安全」，出處要用 Bhatt 2025、FACTS（見下）或 ConfusedPilot，不是這兩頁。
- 「權限變更要跟著同步」：B 行 104 是很好的補充出處，且指出「繼承來的權限變更」是盲點。

## 對 order 17 的用法

- 「在哪一層過濾」的三層示意：(1) 索引層（Azure 原生 token、Pinecone namespace）；(2) 查詢層（安全過濾字串）；(3) 應用層事後修剪。B 行 108、111 說明第 3 層的成本。
- 越權測試題的設計依據：同一查詢分別帶兩個群組字串，比對結果（A 行 125–153 的 secured_file_a/b/c 範例本身就是一題）。
- 「retrievable=false 不等於保護」：A 行 77，可接自我檢查「藏起來不等於擋住」。
