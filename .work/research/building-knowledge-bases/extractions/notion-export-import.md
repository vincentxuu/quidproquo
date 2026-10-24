# 抽取紀錄：Notion 官方說明 — Export your content、Import data into Notion

read_status=full（兩頁文章本體整段讀完；頁首導覽列與頁尾連結也讀過確認沒有本文）

## 來源與讀取版本

1. Notion Help, "Export your content" — https://www.notion.com/help/export-your-content
2. Notion Help, "Import data into Notion" — https://www.notion.com/help/import-data-into-notion（這是 Notion 匯入 Markdown 的官方說明所在頁，Text & Markdown 是其中一節）
- 頁面沒有標示最後更新日期（HTML 內查不到 dateModified）；頁尾「© 2026 Notion Labs, Inc.」。
- 讀取日期：2026-10-22
- 取得方法：curl 抓 HTML（export 485,217 bytes；import 567,649 bytes）→ 自寫 HTML→text parser
- 全文檔：
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/notion-export.full.txt`（628 行，13,344 bytes；本文在行 148–478，行 1–147 是導覽列，行 480–628 是目錄與頁尾）
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/notion-import.full.txt`（1,340 行，24,618 bytes；本文在行 148–1182）

## 這是什麼類型的來源

- 廠商官方功能說明。寫的是「能做什麼」，對「匯出會掉什麼」只列了少數幾項，沒有完整的保真度清單。不量任何東西。

## 主張／事實

### A. 匯出格式（export 行 151–368）
- 可匯出單頁、資料庫或整個 workspace；格式 PDF、HTML、Markdown & CSV（行 151）。
- PDF：可選排除檔案與圖片、紙張大小、縮放；Business／Enterprise 方案才能「Include subpages」產生含子頁 PDF 的 zip（行 176–196、238）。PDF 匯出失敗會改匯出 HTML（行 202）。自訂 emoji 不會出現在 PDF（行 200）。
- HTML：可連同頁面與區塊層級留言一起匯出（含已解決與未解決）（行 242）；子頁會放在各自資料夾，圖片等資產另存（行 266）。
- Markdown & CSV：非資料庫頁面→Markdown；整頁資料庫→CSV，每個子頁另存 Markdown；callout 區塊匯出成 HTML（行 304，見原句）。
- 列印：桌面 app 不能直接列印，要先匯出 PDF；瀏覽器不能列印整頁資料庫（行 370–390）。

### B. 不會匯出／匯出限制（逐條，含出處）
- 資料庫的 Form view 不能匯出，建議改從 Table view 匯出問題與回覆（export 行 154）。
- 自訂 emoji 不會出現在 PDF（行 200）。
- 資料庫只能選「目前 view」或「預設 view」匯出，不支援一次匯出所有 views（行 458–460）。
- callout 沒有 Markdown 對應，以 HTML 匯出（行 304）。
- 整個 workspace 匯出：匯出者沒權限的頁面（例如其他人的私人頁）不會被包含；Enterprise 管理員可用 content search 給自己權限；部分內容可能因 teamspace 設定不被匯出（行 398）。
- 匯出的 workspace 不能重新上傳就還原（行 430，見原句）。
- 下載連結 7 天後失效；大型 workspace 最長要 30 小時處理（行 416–420）。
- 只能在桌面或網頁版匯出整個 workspace（行 427）。
- Windows 路徑 260 字元上限：Notion 為子頁建立巢狀資料夾，可能讓 zip 解不開；可取消勾選「Create folders for subpages」或用 7-Zip（行 462–476）。

### C. 權限限制（export 行 394–452）
- 驗證網域需要 organization owner（行 394）。
- Enterprise workspace 的 workspace owner 或 teamspace owner 可以關掉匯出（Settings → Security → Disable export）（行 440–450）。
- 訪客（guest）要有該頁的 Full access 才看得到匯出選項（行 452）。
- Enterprise 方案有 admin API 可排程啟動 workspace 匯出（beta，需 organization owner 設 admin bot 與 token）（行 432–436）。

### D. 匯入 Markdown（import 行 875–947）
- 可單檔或多檔匯入 .md/.txt；要保留資料夾結構就把資料夾壓成 ZIP 匯入（行 877–887）。
- 會匯入：純文字與標準 Markdown；標題、清單、程式碼區塊（行 889–897）。
- 不會匯入：anchor links；進階或非標準 Markdown 擴充（工具專屬格式）（行 899–907）。
- 限制：每檔 5 MB（Free）／50 MB（付費）；約每 12 小時 120 個檔案（行 909–917）。
- 連結／錨點不能用時，建議在 Notion 用標題與目錄重建導覽（行 931）。
- Notion Desktop 可「開啟」Markdown 檔（最多 10 個），會建立唯讀副本（行 933–947）。

### E. 匯入其他相關事實（import）
- ZIP：最多 5 GB；10,000+ 檔可能失敗或部分匯入；`.DS_Store` 等隱藏檔可能導致失敗（行 797–799）。
- CSV：新匯入不能建立 rollup、formula、relation（要匯入後重建）；匯入只新增列、不更新既有列（行 1021–1043）；日期以 MM/DD/YYYY 匯入（行 1079）。
- Evernote：筆記本→頁面、筆記→清單資料庫項目；約 5,000 則筆記內可靠；建立／更新日期可能不對（行 239–329）。
- Google Docs：建議、他人留言、分隔線、顏色不匯入；清單勾選框變成項目符號（行 615–659）。
- 匯入 FAQ：「Imports focus on preserving content structure. Complex layouts, styling, and app-specific features often need cleanup in Notion.」（行 1166）

## 原句照抄

- export 行 151："You can export a Notion page, database, or entire workspace at any time."
- export 行 304："Any non-database Notion page can be exported as a Markdown file. Full page databases will be exports as a CSV file, with Markdown files for each subpage. Callout blocks will be exported as HTML, as there is no Markdown equivalent."（"will be exports" 為原文錯字）
- export 行 396："Your Notion data will always be backed up in the cloud, but you can also export it for safekeeping."
- export 行 398："Pages that the exporter doesn't have access to, such as private pages of other users, will not be included in the export."
- export 行 430："You can’t instantly recreate your workspace by reuploading your exported workspace content."
- export 行 442："If you’re a member of an Enterprise workspace, it's possible that your workspace or teamspace owner has disabled exporting."
- export 行 460："When exporting a database, you can only choose between the current view and the default view. Exporting all views at once isn’t supported."
- export 行 517（頁尾 Up next 摘要，取自 Back up your data 頁）："Everything is stored in the cloud, and we keep per-minute backups of your page content on our server. That said, your data belongs to you, so we've made it easy to create your own backups and keep your information portable."
- import 行 907："Advanced or nonstandard Markdown extensions (tool-specific formatting)"（列在 What doesn't import 之下）
- import 行 921："Anchor links and nonstandard Markdown extensions may not import cleanly."
- import 行 1025："A new CSV import can’t create new rollups or formulas (you’ll need to rebuild these in Notion after import)."

## 限制或作者立場

- 廠商立場：開頭用 "We got you covered!"、"at any time"，以正面口吻呈現匯出；匯出會掉什麼只列零星幾項。
- 沒寫的事（不能當成「會保留」）：資料庫的 relation／rollup／formula 匯出到 CSV 後變成什麼、頁面內的頁面連結與 @mention 匯出後的樣子、toggle／synced block／columns 等其他區塊在 Markdown 裡的樣子、匯出檔名是否帶 ID。這些頁面都沒提。
- callout 以外的區塊匯出樣子沒有文件；要寫進文章需實測匯出一次。
- 匯入頁對 Obsidian 專屬語法（`[[ ]]`、`![[ ]]`、`^id`）沒有點名，只概括為「nonstandard Markdown extensions」。

## 與常見轉述不一致處

1. 常見說法「Notion 可以匯出 Markdown，所以沒有鎖定」——官方原文：資料庫匯出成 CSV（不是 Markdown）、只能匯出一個 view、callout 變 HTML、匯出的東西不能直接重新上傳還原 workspace（行 304、460、430）。「可匯出」不等於「可帶走並還原」。
2. 常見說法「匯出整個 workspace＝拿到全部資料」——匯出者沒權限的頁面不在內，管理者還可以關閉匯出（行 398、442）。
3. 常見說法「Notion 會把 callout 匯出成 blockquote」——官方說是 HTML（行 304）。
4. 常見說法「Obsidian 筆記可直接匯入 Notion」——官方只保證標準 Markdown；工具專屬擴充與 anchor link 不匯入（import 行 899–921）。Wikilink、嵌入、區塊連結都屬此類（此歸類是推論，頁面沒點名 Obsidian）。
5. 「PDF 匯出含子頁」常被當成每人都有——官方限 Business／Enterprise 方案（行 192、238）。
6. 「Notion 自己說資料屬於你」來自 Back up your data 摘要（行 517），同一頁也強調「stored in the cloud」——擁有權的宣稱和儲存位置是兩回事，對照 Ink & Switch 對「ownership」的定義（使用者主導權）時要區分。

## 讀取紀錄

- 2026-10-22 curl 兩頁 HTTP 200；HTML 轉文字。
- export：用 Read 讀行 140–628（行 1–147 另以 sed 印出確認為網站導覽列：Product、Resources、Help Center 分類清單）。
- import：用 Read 讀行 148–1236（本文、FAQ、目錄、Up next）；行 1–147 同為導覽列；行 1237–1340 為頁尾連結與語言清單（同 export 頁尾結構，以 grep 確認無本文）。
- 頁面圖片與影片未看（轉文字後只剩文字）。
