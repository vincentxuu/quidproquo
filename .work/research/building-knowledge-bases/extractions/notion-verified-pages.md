# 抽取紀錄：Notion「Wikis & verified pages」（附 Confluence Verified 對照）

read_status=full（Notion 兩頁＋Confluence 三頁全文；2026-10-22 讀）

## 書目與讀取方式

| 頁面 | URL | 全文檔（scratchpad/fulltext/） |
|---|---|---|
| Notion Help：Wikis & verified pages | https://www.notion.com/help/wikis-and-verified-pages | o9-notion.txt（261 行，6,868 bytes）|
| Notion Guide：Verify knowledge your teammates can trust | https://www.notion.com/help/guides/verify-knowledge-your-teammates-can-trust-with-page-verification | o9-notion-guide.txt（227 行，9,451 bytes）；頁內「Click to expand」折疊段落 pandoc 抓不到，改從原始 HTML 的 JSON 字串用 python 抽出（下文標「HTML 折疊段」）|
| Confluence 公告（Atlassian 員工 Avinoam 發文＋留言串）| https://community.atlassian.com/forums/Confluence-articles/Verified-Pages-Now-Available-in-Confluence/ba-p/2664827 | o9-cf-verified-ann.txt（340 行，14,363 bytes）|
| Confluence Support：Add a status to your content | https://support.atlassian.com/confluence-cloud/docs/add-a-status-to-your-page-or-blog/ | o9-cf-status.txt（103 行，3,717 bytes）|
| Confluence Support：Transfer ownership of your content item | https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/ | o9-cf-owner.txt（83 行，2,519 bytes）|

目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/

全部用 `curl -sL -A "Mozilla/5.0…"`（皆 HTTP 200）→ `pandoc -f html -t plain --wrap=none`。Notion Guide 的 HTML 標示 2025-03-28 修改（JSON 內時間戳）；Help 頁與 Confluence 頁面沒有可見日期。Confluence 公告 2024-04-08。

選 Confluence 當對照的理由：GitBook 的官方說明搜尋只找到行銷部落格（建議 owner＋review interval，但不是產品功能說明）；Confluence 有原生「Verified」狀態與 owner 欄位，並有公開留言串可看實際使用者反應。

## 性質

- 全部是廠商功能說明或廠商員工公告，作者主張／產品文件。沒有任何「用了驗證到期之後文件比較正確」的資料。
- Confluence 留言串是使用者的個人回報（軼事），不是研究，但含實際部署經驗。

## Notion：功能怎麼運作（Help 頁）

1. 定位（行 81）："Wikis, page owners, and verified pages can help you centralize, find, and update knowledge with ease."
2. Wiki 預設三個視圖，其中一個是「Pages I own」（行 101–107）——owner 是內建的瀏覽維度。
3. 驗證與到期（行 123–127）："You can verify content in your workspace to show that its contents are up to date. You can choose to keep a page verified for a certain period of time or indefinitely." 到期後："When a page’s verification expires, its owner will be notified in their Notion inbox as well as via email."
4. 驗證的可見效果（行 127）：藍色勾勾出現在 @-mention 與 Notion 搜尋結果。
5. 預設 owner 是建立者（行 133）："By default, whoever creates a page in a wiki becomes the page’s owner, but you can change the page owner at any time."
6. 驗證需要 owner（行 169）："For a page to be verified, it must have at least one owner."
7. owner 是「人」欄位（行 201）：資料庫的 Owner 屬性可設 "only have 1 Person as the owner, or ... No limit"。說明頁沒有提到可以指派群組或角色。
8. 方案限制（行 157、183）：wiki 以外的頁面驗證 "available on Business and Enterprise Plans."
9. 全站總覽（行 225）：Settings → Verified pages，可依 owner 或 teamspace 篩選。

## Notion：官方建議怎麼用（Guide 頁）

1. 不要全部驗證（行 101）："Verification isn't about marking everything as official — it's about highlighting your most essential, frequently-referenced content." 四個判斷問題（行 103–109）：常被引用？過時會出大問題？影響關鍵決策？是該主題的 source of truth？
2. 驗證會影響 AI（行 115）："When you mark a page as verified, it becomes more visible in search and Notion AI responses"——與 order 10、11 的「第二種讀者」相關。
3. 週期依內容變動速度（行 155）："review campaign assets monthly as products change, while brand guidelines may only need a quarterly check."
4. owner 選專家（行 153）："Choose folks who truly know their stuff ... And, while anyone with edit access can verify a page, it's good to align on who gets the final say."
5. 廠商自己的警告（HTML 折疊段「When to use "Verify indefinitely"」）："using it too much might make it less meaningful as a quality signal. Try to save it for the content that truly needs regular review"
6. 成效敘述是行銷句（行 183）："Meetings get shorter ... Teams launch features faster"——沒有資料。

## Confluence 對照

1. Verified 是內容狀態的一種（公告行 23）："We leveraged the already existing content status functionality to implement content verification."
2. 誰能設（公告行 25）："only page owners or space/site admins will be able to place and remove this status"
3. 到期機制不是內建計時，是自動化範本（公告行 29）："an easy to use template that will look for inactive pages that are verified and automatically un-verify the page and email the page owner, asking them to review the page."——觸發條件是「頁面不活躍」，不是 Notion 那種「到期日」。
4. owner 轉移（owner 頁行 13–15、37、49）：建立者預設是 owner；可轉移給「point person」；新 owner 必須有 space 存取與編輯權；space／product admin 也能轉。官方說明同樣沒有群組 owner。
5. 官方 support 的「Add a status」頁（o9-cf-status.txt 全頁）沒有提到 Verified——官方說明與 2024 公告不同步。

## Confluence 留言串：使用者回報的問題（軼事，可當限制）

- 通知疲勞（公告行 175–177，Ralph Jäger）："for larger instances the automation will only find part of inactive pages. Furthermore our employees have been complaining about receiving about 100 emails about pages beeing inactive and started to ignore emails sent by confluence...."
- 自動化上限（行 115–117，第三方外掛廠商員工，有利益衝突）："Automation for Confluence sends an email per page"、"The branch rule execution will cut off at 150 pages"。Atlassian 之後在行 256 貼了「Increased Branch Limits」公告連結（未讀該公告）。
- 勾勾的意義被稀釋（行 141、162）：建立者就是 owner，所以 "basically everyone who can add content ... is able to add the 'VERIFIED' status"；"The 'badge' makes it look like the page is 'authorised', which isn't always the case as every page creator can add it."
- 改狀態會改「最後更新日期」（行 249、260、277）："changing the page status via automation changes the last updated date"——用「最後更新」判斷過時的規則會被驗證動作本身污染。
- 天花板低（行 193–195）："the main gain here is a more 'in your face' label...the ceiling on actual usefulness is pretty low."；人工標記與評估過時頁 "extremely time-consuming"。

## 沒寫的事

- 兩家都沒說 owner 離職或帳號停用後，驗證與到期通知怎麼處理（Notion 另一頁 managed-users 只說被刪除使用者的署名改成「Deleted User」，未讀全文，只見搜尋摘要，不引用）。
- 都沒有「重新驗證」要檢查什麼的規範：按下 Verify 不需要任何證據或變更，系統無法分辨認真檢查與順手點擊。
- 都沒有成效資料。

## 與常見轉述不一致處

- 「Notion 讓每頁都有 owner」：只有 wiki 內頁與加了 Verification 屬性的資料庫預設有 owner（建立者）；一般頁面要手動驗證才需要 owner，且非 wiki 頁的驗證限 Business／Enterprise 方案。Guide 頁的折疊段寫的是「Plus or Business plan」，與 Help 頁「Business and Enterprise」不一致，引用方案時以 Help 頁為準並註明。
- 「驗證到期會自動把過時頁標出來」：Notion 是到期日通知 owner；Confluence 是「不活躍」觸發自動化。兩者都只會通知，不會判斷內容對不對。
- 「owner 是角色」：兩家產品的 owner 欄位都是個人帳號。要做到「owner 是角色」得靠團隊自己的規則（例如交接清單、GitLab 的 CODEOWNERS 可指定群組，見 gitlab-dri-handbook-first.md）。

## 限制

- 全是廠商說明，功能隨版本變；引用時要附查核日期 2026-10-22。
- Confluence 留言是少數人的軼事，部分留言者是競品外掛廠商。
