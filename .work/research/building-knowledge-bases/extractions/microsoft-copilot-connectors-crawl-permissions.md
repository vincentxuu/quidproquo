# 抽取紀錄：Microsoft Graph / Microsoft 365 Copilot connectors — 管理項目、增量與完整爬取、權限同步

read_status=full（五份全讀：Graph 管理項目頁、connectors FAQ、部署頁、索引內容驗證頁、官方 roadmap 項目 JSON）

## 書目

- (G) 指定頁 "Create, update, and delete items in a Microsoft Graph connection"，https://learn.microsoft.com/en-us/graph/connecting-external-content-manage-items
  - meta ms.date 2024-11-07；頁尾 "Last updated on 2024-11-07"（updated_at 2025-08-06）。**是五份中最舊的一頁。**
  - 全文檔 scratchpad/fulltext/o17-graphitems.md（127 行、10,837 bytes），已讀全部。
- (F) "Microsoft 365 Copilot connectors FAQ"，https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions （ms.date 2026-05-18；頁尾 Last updated on 2026-09-23）。o17-connfaq.md（127 行、11,362 bytes），已讀全部。
- (D) "Deploy connectors in the Microsoft 365 admin center"，https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/deployment-overview （ms.date 與頁尾皆 2026-04-07）。o17-conndeploy.md（269 行、21,101 bytes），已讀全部。
- (I) "Search and validate indexed content"，https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/indexed-content （ms.date 2026-09-24；頁尾 2026-09-25）。o17-connindexed.md（105 行、12,470 bytes），已讀全部。
- (R) Microsoft 365 Roadmap ID 503570 "Microsoft Copilot (Microsoft 365): Support permission sync missed in incremental crawl"
  - 官方 API：https://www.microsoft.com/releasecommunications/api/v1/m365/503570 （curl 取得 JSON 1,013 bytes，存 o17raw/rm-official.json，全讀）。人看的頁面：https://www.microsoft.com/microsoft-365/roadmap?id=503570
  - 第三方封存 mc.merill.net/message/RM503570（o17-rm503570.md，67 行）內容與官方 JSON 一致，另記版本史：v1 2026-02-12、v2 2026-10-20 改 Status 與 Tags。
- 原始 HTML 在 o17raw/。scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 讀取日 2026-10-22。下文「G／F／D／I 行」為上列檔行號。

## 性質

- 廠商官方文件與產品路線圖，沒有實證數據；唯一數字是「最多 24 小時」「預設約每天一次完整爬取」。

## 可引用內容（原文）

1. **指定頁對增量爬取的確切寫法**（G 行 101–102）：
   - "Incremental crawl: Detects and pushes additions in source data; less performance-intensive than a full crawl."
   - "Full crawl: Updates the entire item from the source data (re-crawl), capturing all additions and deletions; ensures better accuracy but is more time-consuming and performance-intensive than an incremental crawl."
   - G 頁**完全沒提權限變更**在哪種爬取更新。
2. 同步頻率建議（G 行 104–105）：Event-based "for dynamic or sensitive data such as item status"；Scheduled（每 N 分鐘）"for content-rich or non-sensitive data that is less frequently updated such as wikis or webpages."
3. 項目 ACL 結構（G 行 27–32）：每個 externalItem 有 ACL（Entra 使用者、群組或 `Everyone`）；"The accessType value `deny` takes precedence over `grant`."；非 Entra 群組用 external groups，"Avoid expanding the membership of your external groups directly into the ACLs of individual items because each group membership can lead to a high volume of item updates."
4. **新版文件的增量／完整爬取差異**（F 行 70–78）：
   - 完整爬取："Reflects any deletions from the data source in the index." "Updates the permissions."
   - 增量爬取："Only updates items that changed since the last crawl." "Doesn't handle deletions, so items removed from the data source remain in the index." "Incremental crawls don't currently support processing of updates to permissions."
5. D 行 103–105："Incremental crawl: Syncs only new or changed data." 註："Incremental crawls don't support permission updates. Run full crawls periodically to maintain sync accuracy."；D 行 219–229 完整重新整理的使用時機包含 "Detecting deleted items." "Updating ACLs."；"An incremental refresh processes only items that you created or modified since the last successful crawl." "Incremental crawls don't currently process updates to permissions."
6. **權限變更延遲**（I 行 85–87）："Changes to user or group permissions (ACLs) might take up to 24 hours to reflect in Microsoft Search and Microsoft 365 Copilot." "Permissions updates occur during a full crawl, not an incremental crawl." "If your data source permissions change after the last full crawl, you must trigger a new full crawl on-demand or schedule it to update the index."
7. 「所有人可見」設定會蓋過來源權限（I 行 29、82；D 行 57–60）："When you configure an item to be visible to everyone, all users in the organization can access it, regardless of the permissions set in the data source." 連線設定時就有「Only users with access」vs「Everyone in the organization」二選一。
8. 驗證工具（I 行 22–32）：Index browser 可查單一項目的 ACL，"Check user access" 查某使用者能否看到；F 行 52 建議 "Create users in the test environment for ACL testing."
9. **Roadmap 503570（R）**：描述原文 "Earlier, permissions were synced only in the periodic full crawl which generally ha a default frequency of 1 day for most of the connectors. Now, we have support for doing permission syncs more frequently in an incremental way." 欄位：status "Launched"、releasePhase "General Availability"、publicPreviewDate "May CY2026"、GA "July CY2026"、modified 2026-10-20、cloud "Worldwide (Standard Multi-Tenant)"。

## 文件之間的矛盾（重要）

- Roadmap 503570 已標「Launched / GA July 2026」，但 F（2026-09-23）、D（2026-04-07）、I（2026-09-25）三頁仍寫「增量爬取不處理權限更新」。可能是文件未更新、或只適用部分連接器；**官方沒有說明哪些連接器適用**。
- G 頁（2024-11）說增量只抓「additions」；新版頁說增量抓「new or changed / created or modified」。兩者對「修改」的說法不一致，以新版為準。

## 與範圍卡說法的核對

- 範圍卡「Microsoft 增量爬取只抓新增」：**要修正**。
  - G 頁原文確實是 "Detects and pushes additions"，但這是 2024 年的舊頁。
  - 新版文件：增量會處理新增與修改，**不處理刪除，也（文件寫）不處理權限變更**；權限與刪除靠完整爬取，權限變更最多 24 小時才反映。
  - 2026 年起官方路線圖稱已上線增量權限同步（GA 2026-07），文件尚未同步更新。
  - 建議改寫：「Microsoft 的連接器文件寫明：增量同步只處理新增和修改，刪除和權限變更要等完整同步才會反映，最多可能延遲 24 小時（2026 年路線圖宣布改善）」——重點放在「權限變更和內容變更走的是不同同步路徑」，這個教訓不會隨產品更新而失效。
- 「權限變更要跟著同步」：本組文件是最直接的出處（F 行 75–78、I 行 85–87）。

## 對 order 17 的用法

- 越權測試要包含「權限剛被撤銷的人」：撤銷後在下次完整同步前仍可能查到（I 行 85–87）。
- 「設成所有人可見」的連線設定是一個常見的越權來源（I 行 82）。
- 連到 order 18：刪除也只在完整同步反映（F 行 77）。
