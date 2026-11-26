# 抽取紀錄：Notion 官方說明 — 子頁面巢狀與資料庫如何取代資料夾

## 書目（實際讀的版本，2026-10-22 擷取）

1. Notion Help, "Create a subpage" — https://www.notion.com/help/create-a-subpage
2. Notion Help, "Create a page"（URL slug create-your-first-page）— https://www.notion.com/help/create-your-first-page
3. Notion Help, "Intro to databases" — https://www.notion.com/help/intro-to-databases
- 頁面沒有標示最後更新日期。
- 全文檔（curl 下載 HTML → 自寫 parser 轉文字 → 只留文章本體）：
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/notion-create-a-subpage.txt`（24 行，1,697 bytes）
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/notion-create-your-first-page.txt`（28 行，1,759 bytes）
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/notion-intro-to-databases.txt`（173 行，11,416 bytes）

## 這是什麼類型的來源

- 廠商功能說明，描述的是「工具怎麼設計」，不是「這樣做有效」的證據。不量任何東西。

## 可引用內容（官方原句）

### A. 子頁面取代資料夾（create-a-subpage，行 2–20）

- 開宗明義："There are no folders in Notion. Instead, you can organize pages inside pages... inside pages. Here, we'll show you how to create a page within another page, which we call a subpage."（行 2）
- 定義："A subpage is a page inside a page. You can create any number of subpages for a page."（行 4）
- 建法：在父頁面用 `/page`，或在側欄父頁面旁按 `+`（行 7–9）。
- 導覽："When you open the toggle for the parent page in your sidebar, you'll see its subpages there."；"at the top of your page, you'll see breadcrumbs that show you what page you're in, and where that page lives."（行 13–14）
- 搬移：在側欄把子頁面拖出／拖進父頁面即可改變結構（行 18–20）。

### B. 頁面是起點（create-your-first-page，行 5–24）

- "Every page you create in Notion is a fresh canvas where you can add whatever content you want."（行 5）
- `/` 指令叫出區塊選單（行 20–24）。
- 注意：用 exa 抓同一頁時，結尾多了一句 "There are no folders in Notion. Instead, you can organize pages inside pages... inside pages."（與 subpage 頁同句）；curl 下載的 HTML 本體裡沒有這句，推測是相關文章區塊或舊版內容。引用這句時以 create-a-subpage 頁為準。

### C. 資料庫：每一筆都是頁面，用屬性與檢視取代單一位置（intro-to-databases）

- 定義："Databases in Notion are collections of pages."（行 5）；"They help you manage and organize multiple pages in one place."（行 6）
- 四個特點（行 8–18）：
  - "Every item is its own page: Every item you enter into your database is a Notion page."
  - "You can customize properties: Add properties to contextualize, label, and augment any database item with things like dates, status, and links."
  - "You can visualize your data in different ways: Your data isn't limited to a table. Organize your database as a list, calendar, chart, and more"
  - "You can view multiple sets of data in one database."（例：把 OKR 資料庫連進專案任務資料庫，"without jumping from one part of your workspace to another."）
- 檢視：「Views allow you to organize the information in your database in different ways. By default, your database will be displayed in Table view, but you can add as many views as you'd like.」（行 29）；每個檢視可 "filter, sort, and group the items"（行 33）。
- 資料庫本身仍在頁面樹裡："Full page databases appear just like any other page in your sidebar."（行 37）；"In your sidebar, your inline database will appear as a subpage of the page it's in."（行 52）
- 資料庫項目可再巢狀："Every item in your database ... is its own Notion page that you can build, format, and nest content in like any other page."（行 66）；"Underneath your properties is free page space, where you can add any type of content block, including sub-pages or an inline database."（行 91）
- 規模提醒："When a database contains more than 1,000 items, new pages may appear in the middle of the collection instead of at the end."（行 67）
- 頁首可顯示 Backlinks："Backlinks indicate all the pages that link to the current page"（行 115）。
- 屬性舉例直接列了 tags："Properties provide data about the page you're looking at, like project owner, due date, tags, and more."（行 111）

### 綜合（我的整理，非官方原句）

- Notion 的組織有兩層：頁面樹（單一父頁面，等於資料夾的單一位置）＋資料庫（同一批頁面靠屬性與多個檢視呈現，等於標籤／多重分類）。「一個項目只能在一個位置，但可以出現在多個檢視」就是 Civan 2008 建議的「保留資料夾的好處、再加標籤」的一種實作。

## 限制

- 官方說明只描述功能，沒有任何使用成效數據。
- 頁面無更新日期；Notion 功能改版頻繁，引用時要寫擷取日期。

## 與常見轉述不一致處

- 「Notion 沒有資料夾」：官方說明頁到 2026-10-22 仍這樣寫；但 Notion 自家 MCP 連接器（claude.ai Notion connector）在同日已提供 `notion-create-folder` 工具，說明是 "Creates an empty Notion Folder. Set parent.page_id for a top-level Folder owned by a page, or parent.folder_id to create a nested Folder inside another Folder."——代表 Notion 產品端已出現名為 Folder 的物件，說明中心尚未反映。沒找到官方說明頁或發布說明確認這個功能何時上線、給誰用。寫文章時不要寫死「Notion 沒有資料夾」，應寫「Notion 說明中心描述以頁面巢狀代替資料夾（擷取日 2026-10-22）」，並註記可能已有新的 Folder 物件。
- 第三方教學（bullet.so、super.so、wisechecker、webfactoryltd 等）常把「父頁面」直接叫 folder，wisechecker 稱「sidebar 預設顯示三層」——官方 navigate-with-the-sidebar 摘錄寫的是 "nest pages inside other pages with no limit"，沒有三層限制的說法。第三方說法不採用。
- 「資料庫取代資料夾」：官方沒有這樣說；官方是說資料庫是「頁面的集合」，而資料庫本身仍掛在頁面樹（側欄）裡。比較準確的說法是「資料庫補上多重分類，頁面樹仍負責位置」。

## 讀取紀錄

- mcp__exa__web_fetch_exa 讀 intro-to-databases 與 create-your-first-page（完整文字）。
- curl -L -A "Mozilla/5.0" 下載 create-your-first-page（371,319 B）、intro-to-databases（845,828 B）、create-a-subpage（368,585 B）、navigate-with-the-sidebar（391,787 B）、what-is-a-block（378,177 B），皆 200。前三頁轉文字並截取文章本體後依序讀完：create-a-subpage 1–24、create-your-first-page 1–28、intro-to-databases 1–173。navigate-with-the-sidebar 只看了 exa 搜尋摘錄（"Organize your work on infinite levels — you can nest pages inside other pages with no limit."），全文未逐行讀；what-is-a-block 已下載未讀。
- mcp__exa__web_search_exa 兩次查 Notion 是否新增資料夾功能：只找到第三方教學與說明中心既有頁，沒有官方發布說明。
- ToolSearch 載入 notion-create-folder 工具定義讀其說明（未呼叫）。
