# 抽取紀錄：工具官方說明（Readwise Reader、Obsidian Web Clipper、Notion Web Clipper）

read_status=full（下列每頁整頁讀完；讀取日期皆為 2026-10-22。官方文件會改，引用時寫「截至 2026-10」）

## 性質

廠商官方說明文件。只記本文會用到的事實；功能描述以文件為準，沒有實機操作驗證。

---

## 一、Readwise Reader

### 1. How to choose a Library configuration
- URL：https://docs.readwise.io/reader/guides/workflows/library-configuration
- 讀取：curl 取 HTML 轉文字，69 行全讀
- 事實：
  - 預設三格："By default, your Library is organized into Inbox, Later, and Archive"
  - 三種配置：
    - Triage（預設）：Inbox → Later → Archive。"All newly saved documents land in your Inbox, where you can process them one at a time by deleting, archiving, or moving them to Later for future reading." 定位 "designed for productivity-focused users who prefer an "inbox zero" approach. It treats every new document as an item to be processed."
    - Shortlist：Later → Shortlist → Archive。"Newly saved items go to Later, which acts as an "anti-library" of everything you might want to read eventually. From there, you can promote high-priority items to your Shortlist, which serves as your active reading queue." "It separates your "must-read" content from your "might-read" content"
    - Classic：Later → Archive。"similar to traditional read-it-later apps like Instapaper or Pocket" "Once you've finished reading an item, you can move it to Archive for permanent storage and future reference."
  - Triage 下也有「⭐ Shortlist」預設視圖，但那是用 `shortlist` 標籤做的，不是一個位置："This default view allows you to use a tag to earmark documents, regardless of which Library location they're in."
  - 可隨時切換："You can switch between configurations at any time"；切換會自動搬移文件，搬移前有確認視窗。
  - 快捷鍵：Inbox shift+E、Later L、Shortlist S、Archive E。

### 2. Adding Content to Reader（FAQ）
- URL：https://docs.readwise.io/reader/docs/faqs/adding-new-content
- 讀取：curl 轉文字，72 行全讀
- 事實：
  - Library vs Feed："Library is where things go that you manually curate for yourself and choose to save permanently, such as articles saved from the browser extension or uploaded EPUB documents." "The Feed is where things go that are automatically pushed to you, such as RSS feed content, and it's divided into two locations: Unseen and Seen."
  - 瀏覽器擴充存到 Inbox："This will save a clean, readable version of the document to your Reader inbox."（預設快捷鍵 Alt+R）
  - 擴充比只給 URL 好："the extension gets the underlying content rendered in your browser as opposed to just a URL."
  - 上傳上限："most uploads are limited to 500 MB, and Markdown files are limited to 10 MB."
  - URL 存檔格式：https://wise.readwise.io/save?url=<URL>
- 補充（exa 摘錄，未整頁讀）：Saving Content to Reader 頁說擴充 "By default ... saves documents to the first section of your Library (either Inbox or Later, depending on your configuration)"。

### 3. Readwise → Obsidian 匯出
- URL：https://docs.readwise.io/readwise/docs/exporting-highlights/obsidian
- 讀取：curl 轉文字，131 行全讀
- 事實：
  - 要裝 Obsidian 社群外掛 "Readwise Official"。
  - 同步方式："If the highlight is from a new book, article, or Twitter account, a new page in the Obsidian vault will be made. If the highlight is from an existing book, article, or Twitter account, the highlight will be appended to the bottom of the existing page. Because the Readwise plugin is append-only, nothing in Obsidian will ever be overwritten."
  - 預設開 Obsidian 時自動同步，可設每 1、12、24 小時自動檢查。
  - 在 Readwise 改劃線不會同步到 Obsidian（反之亦然）："At the moment, no."
  - 在 Obsidian 改名或搬檔後若再劃線，會在原位置生出第二個檔："you will end up with two files."
  - 可改匯出資料夾（"Customize base folder"）、可關掉 Books/Articles/Tweets 分類資料夾。
  - 可匯出 Reader 全文："toggling the "Export All Reader Documents" setting"；"the full text export only includes documents in your Library. Documents in your Feed won't be exported."
  - 模板用 Jinja2，可自訂 Properties（"previously known as YAML front matter"），但 "By default, this section of the template is off"。
- Reader 與 Readwise 的關係（docs.readwise.io/reader/llms.txt，exa 摘錄）："Every highlight you make in Reader instantly syncs with Readwise and then from Readwise to your note-taking apps."

### 4. Readwise → Notion 匯出
- URL：https://docs.readwise.io/readwise/docs/exporting-highlights/notion
- 讀取：curl 轉文字，58 行全讀
- 事實：
  - "The first time Readwise syncs with Notion, a new table called "Readwise" will be created in a private page of your selected Notion workspace."
  - 預設依 Book、Article、Tweet、Podcast 分視圖；"Export Automatically" 開著時每日同步。
  - 一樣 append-only："All of our export integrations with note-taking apps are append-only."
  - 可加自訂屬性，但 "be careful not to delete or change the property type for any of the default properties, or the sync will break."
  - 與 Obsidian 不同：在 Notion 搬移或改名頁面後同步仍能找到（需給 Readwise 整合存取新位置）。

---

## 二、Obsidian Web Clipper

### 1. Introduction to Obsidian Web Clipper
- URL：https://obsidian.md/help/web-clipper （SPA，curl 只拿到殼；改讀官方 help repo 原始檔 https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Obsidian%20Web%20Clipper/Introduction%20to%20Obsidian%20Web%20Clipper.md）
- 讀取：47 行全讀
- 事實：
  - "Obsidian Web Clipper is a free browser extension that lets you highlight pages and save web content to your vault."
  - 支援 Chrome（與 Chromium 系：Brave、Arc、Orion 等）、Firefox（含 Firefox Mobile）、Safari（macOS、iOS、iPadOS）、Edge。
  - 隱私："Obsidian Web Clipper saves content locally to your Obsidian vault ... Your data is not collected, and we do not gather any usage metrics. The code is open source and auditable."

### 2. Clip web pages
- URL：https://obsidian.md/help/web-clipper/capture （讀 help repo 原始檔 Clip web pages.md）
- 讀取：65 行全讀
- 事實：
  - 介面四區："**Properties** shows the metadata extracted from the page that will be saved as Properties in Obsidian." "**Footer** allows you select the vault and folder, and add to Obsidian."
  - Footer："**Folder** field to define which folder to save to."
  - 預設只擷取主文；有自訂模板用模板、有選取用選取、有劃線用劃線。
  - 圖片不下載："Images are not automatically downloaded when you use Web Clipper. Instead, images link to their web-based URL. This saves space in your vault but it means the images will not be accessible offline, or if the URL stops working."（可用指令 "Download attachments for current file" 補下載）

### 3. Templates
- URL：https://obsidian.md/help/web-clipper/templates （讀 help repo 原始檔 Templates.md）
- 讀取：68 行全讀
- 事實：
  - Behavior 三種：Create a new note；Add to an existing note（頂部或底部）；Add to daily note（需 daily notes 外掛）。
  - 可依 URL 前綴、正規表示式、schema.org 資料自動套用模板；沒匹配就用清單第一個模板。
  - 模板可匯出／匯入 .json。

### 4. Variables
- URL：https://obsidian.md/help/web-clipper/variables （讀 help repo 原始檔 Variables.md）
- 讀取：124 行全讀
- 事實：
  - "Variables can be used in the **note name**, **note location**, **properties**, and **note content**."（→ 存放資料夾可以用變數動態決定）
  - 預設變數含 {{title}}、{{url}}、{{author}}、{{published}}、{{date}}、{{highlights}} 等；prompt variables 需啟用 Interpreter（外部語言模型，"may have cost and privacy considerations"）。

### 5. Obsidian Web Clipper 產品頁
- URL：https://obsidian.md/clipper
- 讀取：curl 轉文字，315 行全讀（多數是導覽與示範內容）
- 事實：
  - 模板設定示範欄位："Note location — The folder or path of the note."（示範值 Clippings）；"Vault — Select the default vault for this template."；"Note name — Format for the file name of the note. You can use variables like {{title}}, {{date}}, and {{published}}"
  - 示範的 Properties：category、author、published、description、source、tags。
  - "Your clips are saved to durable Markdown files. All your highlights and settings are exportable to JSON."
  - "All your clipped content is stored locally in your Obsidian vault."
  - 頁面引用 Steph Ango〈File over app〉："Apps are ephemeral, but your files have a chance to last."

→ 結論：可以設定存到指定資料夾（每個模板的 Note location，或剪輯時在 Footer 的 Folder 欄位改），也可以設定 properties（模板定義，存成 Obsidian Properties）。

---

## 三、Notion Web Clipper

- URL：https://www.notion.com/help/web-clipper （標題 "Save web pages with Notion Web Clipper | Notion Help"）
- 讀取：curl 轉文字，70 行全讀
- 事實：
  - "You can add this web content to a workspace or page of your choosing, making it easy to build a reading list, collect references and more."
  - 桌面版只有 Chrome 與 Safari："Our desktop Web Clipper is a browser extension available for Chrome and Safari."（Safari 版已不在 App Store，改從 notion.com/web-clipper 下載 DMG）
  - 可存到指定資料庫："A small window will pop up asking which workspace and Notion page (or database) you want to add the web page into." 可用 "+ New links database" 新建；既有資料庫不在預設清單時可搜尋。
  - 存進資料庫時自動加 URL 屬性："When you clip a web page into a database, a URL property will automatically be added to capture the address of the original page (even if there wasn't one before)!"
  - 剪輯當下不能加標籤（FAQ）："Can you add tags to a web page while clipping it? Not at the moment, unfortunately." "For the time being, you'll need to open the clipped page in a Notion database to add and edit any tags or other database properties."
  - 手機：iOS（需 13.0+）與 Android（需 7.0+）用分享選單；Android 選 page/database，iOS 步驟只寫 "choose which workspace and page"。
  - 解析品質："Websites are built in all kinds of ways, so they can't all be parsed the same way. Formatting in Notion will vary."

→ 結論：能存到指定資料庫（含新建 links database），但標籤與其他屬性要剪完再到 Notion 裡補。

---

## 與摘要或常見轉述不一致處

1. Readwise Reader「Library 有 Inbox / Later / Shortlist / Archive 四格」：不是同時有四格。三種配置各用 2–3 格：Triage（Inbox/Later/Archive，預設）、Shortlist（Later/Shortlist/Archive）、Classic（Later/Archive）。Triage 下看到的「⭐ Shortlist」是標籤視圖，不是位置。
2. Readwise 匯出常被說成「雙向同步」：官方明說 append-only，在 Readwise 改劃線不會更新 Obsidian/Notion，反向也不會。
3. Readwise → Obsidian 的 Properties（YAML）預設是關的；要自己開。
4. Notion 說明頁內部矛盾：Use the clipper 第 7 步寫 "You can also add tags, other properties, comments, and edits to the pages you clip"，FAQ 卻說剪輯時不能加標籤。兩者可調和為「剪完之後在 Notion 裡加」，引用時寫「剪輯當下不能加標籤」。
5. Notion Web Clipper 常被說「各瀏覽器都能用」：官方桌面版只列 Chrome 與 Safari，沒有 Firefox、Edge（Chromium 系能否裝 Chrome 版文件沒寫）。Obsidian Web Clipper 則官方支援 Chrome/Firefox/Safari/Edge。
6. Obsidian Web Clipper「存成本地檔案就不怕失效」：文字存在本地，但圖片預設只存外部連結，原網址失效就看不到，除非手動執行下載附件指令。
7. Obsidian Web Clipper 的 Templates 說明頁本身沒有寫 Note location 欄位；這個欄位出現在 Variables 頁（"note location" 可用變數）、Clip web pages 頁（Footer 的 Folder 欄位）與產品頁示範。

## 讀取紀錄（每頁全文存檔）

目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/

| 檔名 | 行數 | bytes | 讀過區段 |
|---|---|---|---|
| tools-rw-libconfig.txt | 69 | 5,097 | 1–69 |
| tools-rw-addcontent.txt | 72 | 9,546 | 1–72 |
| tools-rw-obsidian.txt | 131 | 13,312 | 1–131 |
| tools-rw-notion.txt | 58 | 7,495 | 1–58 |
| tools-obs-Introduction-to-Obsidian-Web-Clipper.md | 47 | 2,009 | 1–47 |
| tools-obs-Clip-web-pages.md | 65 | 3,711 | 1–65 |
| tools-obs-Templates.md | 68 | 3,732 | 1–68 |
| tools-obs-Variables.md | 124 | 9,698 | 1–124 |
| tools-obs-clipper-landing.txt | 315 | 13,220 | 1–315 |
| tools-notion-clipper.txt | 70 | 5,893 | 1–70 |

失敗管道：obsidian.md/help/* 是 Obsidian Publish 單頁應用，curl 只拿到約 2.8 KB 的殼（無內文），改讀官方 help repo（obsidianmd/obsidian-help，master/en/Obsidian Web Clipper/）；obsidianmd/obsidian-clipper repo 的 docs/ 路徑 raw 檔 404。
