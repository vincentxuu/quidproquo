# Obsidian 官方說明 — 同步、Notion 匯入、Bases、內部連結（order 4 補讀）

read_status=read（四個主題的主頁整份讀完；Settings、Manage notes、Core plugins 等旁證頁只讀相關段落，見讀取紀錄）

## 來源

- Repo：`obsidianmd/obsidian-help`（官方說明站 help.obsidian.md 的原始 Markdown），分支 master。
- 釘住的 commit：`cd6c9f3c7d5492bbbec94e8f403572b84eeb325b`（committer date 2026-10-19T15:13:44Z，訊息「chore: apply EN diff to locales」）。所有 raw 檔都用這個 SHA 下載，不是浮動的 master。
- 讀取日期：2026-10-22。
- 各頁（repo 路徑 → 站上 permalink，permalink 取自 frontmatter）：

| 主題 | repo 路徑 | 站上網址 |
|---|---|---|
| 同步 | `en/Getting started/Sync your notes across devices.md` | https://help.obsidian.md/sync-notes |
| Notion 匯入 | `en/Import notes/Import from Notion.md` | https://help.obsidian.md/import/notion |
| Importer 外掛 | `en/Import notes/Importer.md` | https://help.obsidian.md/plugins/importer |
| Bases 介紹 | `en/Bases/Introduction to Bases.md` | https://help.obsidian.md/bases |
| Bases 建立 | `en/Bases/Create a base.md` | https://help.obsidian.md/bases/create-base |
| Bases 語法 | `en/Bases/Bases syntax.md` | https://help.obsidian.md/bases/syntax |
| Bases 檢視 | `en/Bases/Views.md` | （版本表出處） |
| 內部連結 | `en/Linking notes and files/Internal links.md` | https://help.obsidian.md/links |
| 設定（旁證） | `en/User interface/Settings.md` | — |
| 管理筆記（旁證） | `en/Files and folders/Manage notes.md` | https://help.obsidian.md/manage-notes |

- Permalink 範例（GitHub 釘 commit）：`https://github.com/obsidianmd/obsidian-help/blob/cd6c9f3c7d5492bbbec94e8f403572b84eeb325b/en/Getting%20started/Sync%20your%20notes%20across%20devices.md`
- Bases 起始版本另讀官方 changelog（obsidian.md/changelog，經 exa web_fetch_exa）：1.9.0 Desktop early access（2025-05-21）與 1.9.10 Desktop public（2025-08-18）。

## 1. 同步（Sync your notes across devices）

### 官方分類（行 22–27）

「These are a few commonly used sync methods reported by members of the Obsidian community:」
1. 「**First-party sync**: Obsidian Sync」
2. 「**Third-party cloud sync**: iCloud, OneDrive, and Google Drive」
3. 「**Local sync**: Syncthing」
4. 「**Version control**: Git and Working Copy」

前提（行 12、20）：「Obsidian stores notes locally on your device so you always have access to them, even offline. To access your notes on multiple devices you need to set up a sync method.」「With Obsidian your data is simply stored as files in a folder called a vault. This means there are many ways to sync your data.」

### 各方式的「Recommended systems」（原文標籤照抄）

| 方式 | 頁面標示 | 原句 |
|---|---|---|
| Obsidian Sync（行 33–35） | `Windows`, `macOS`, `Linux`, `iOS`, `Android` | 「The most straightforward and officially supported sync method is our first-party solution: Obsidian Sync.」 |
| iCloud（行 43–45） | `macOS`, `iOS`, `iPadOS` | 「iCloud can be used to sync vaults between iOS and macOS. However, **iCloud Drive on Windows** may lead to file duplication or corruption.」 |
| OneDrive（行 80–82） | `Windows`, `macOS`（limited functionality on Android） | 「However, it has limitations on Android and isn't officially supported for syncing Obsidian vaults on iOS.」 |
| Google Drive（行 109–114） | `Windows`, `macOS`, `Android`（limited functionality on iOS） | 「Although it's not officially supported for syncing Obsidian vaults, you can use third-party apps and plugins to sync across devices.」；「Google Drive is not officially supported for syncing Obsidian vaults on iOS.」 |
| Syncthing（行 135–140） | `Windows`, `macOS`, `Linux` | 「The official Syncthing Android app is no longer maintained. However, a community fork called Syncthing-Fork … can be used on Android devices.」 |
| Git（行 165、182–183） | `Windows`, `macOS`, `Linux` | 「Git provides strong version control, but syncing isn't automatic. You must manually push and pull changes.」 |
| Working Copy（行 206–209） | `iOS`；Requires: Git | 「Working Copy is a Git client for iOS … though some features require a paid in-app purchase.」；「While Working Copy isn't officially supported, many users have successfully used it to sync vaults with Git.」（行 224） |

### iPhone / iPad（行 185–202）

- 「**Recommended options**: Obsidian Sync / iCloud」
- 「**Unsupported options**: The following services aren't officially supported on iOS, but users have found workarounds using third-party tools or plugins: Dropbox, Google Drive, OneDrive, Syncthing」
- 「Some users have successfully used plugins like **Remotely Save** or **LiveSync** to sync vaults on iOS. However, these methods aren't officially supported, and results may vary.」
- 不要混用（行 191–192）：「Avoid syncing the same vault across multiple services (e.g., using both Obsidian Sync and iCloud simultaneously) to prevent data conflicts or corruption.」
- iCloud 資料夾位置警告（行 69–76）：「When using iCloud on mobile devices, ensure your vault is stored in the correct location: `iCloud Drive/Obsidian/[Your Vault Name]`.」「If your vault is in a different location, you may experience syncing issues.」

### 為什麼有些服務不支援（FAQ，行 228–234）

- 「Unlike some note-taking apps that access one file at a time, Obsidian requires access to the entire vault for its features (e.g., updating links when renaming a file). This makes it difficult for some services to function reliably with Obsidian.」
- 「If services like OneDrive or iCloud offload files (e.g., using **Files On-Demand** or **Optimize Mac Storage**), Obsidian can't access them, causing sync issues.」

### 旁證（其他頁，同 commit）

- `Back up your Obsidian files.md` 行 16：「Services like Obsidian Sync, iCloud, OneDrive, and Dropbox help you sync your notes across different devices. While they may offer features like note restoration, **they are not designed for backups**.」
- `How Obsidian stores data.md` 行 14：「Obsidian syncs with Obsidian Sync, Dropbox, iCloud, OneDrive, Git, and many other third-party services.」
- `Obsidian Sync/Frequently asked questions.md` 行 65：Files on-demand 的檔案「Obsidian Sync will interpret them as deleted, leading to their removal from your remote vault.」
- 1.9.10 changelog：「Sync: Added new "Conflict resolution" setting. Choose how Obsidian handles file conflicts when syncing: Merge (default) or create conflict file.」

## 2. Importer 外掛與 Notion 匯入

### Importer 是什麼（Importer.md 行 12–14）

「Importer is an official Community plugin made by the Obsidian team, with contributions to our open source code.」——是**官方團隊做的社群外掛**，不是核心外掛；安裝走 Community plugins（行 16–19）。

### 兩種匯入方式（Import from Notion.md 行 6–11）

- 「This converts your Notion workspace to durable Markdown files that you can use offline with Obsidian and many other apps.」
- 「1. **Notion account (recommended)** connects directly to your workspace and lets you preserve Databases and formulas which are converted to Bases. Requires a Notion integration token and an internet connection.」
- 「2. **File import** uses Notion's `.zip` export files. Does not preserve Databases but does not require an API token or internet connection.」
- 兩者都有預覽與範本（行 15）：「Both import methods show a preview before the import begins. You can edit the generated template or choose a Markdown template from your vault.」

### API 匯入的限制（行 64–81）

- 「The Notion API importer is new. Because of the complexity of Notion workspaces, some edge cases may not have been considered.」
- 「Due to Notion API rate limits, importing large workspaces may take considerable time.」
- 「Due to limitations in the Notion API some data is not available or cannot converted:」
  - 「Only the primary view for each database is imported.」
  - 「Linked data sources … are not imported」
  - 「`People` functions: `name()` and `email()`」
  - 「`Text` functions: `style()` and `unstyle()`」
- 結構變化：「Pages without child pages or databases will be imported as `[filename].md` instead of `[filename]/[filename].md`.」「Databases are always represented as folders named `[database name]` with a `[database name].base` file inside.」
- Token 前綴：「typically starting with `ntn_...`」（行 23）；在 Importer 裡選「**Notion (API)**」（行 57）。

### .zip 匯入：要匯出 HTML，不要 Markdown（行 85–123）

- 「This method does not preserve Databases but it does not require an API token or internet connection.」
- 「you will need to export your entire workspace using Notion's HTML export format. We recommend that you do not use Notion's Markdown export as it omits important data. You must have admin access to the Notion workspace to export all workspace content.」
- Troubleshooting：「Make sure you use **HTML** as the export format in Notion, **not Markdown**.」
- 匯出選項：Export format **HTML**、**Include everything**、**Create folders for subpages**（行 94–96）。
- 「It's recommended to import all your Notion at once so internal links can be reconciled correctly.」（行 112）
- 資料夾內容會變位置（行 114）：「Note that in Notion you can write content in Folders, this is not possible in Obsidian and these pages will be added as a subpage under the folder.」
- 大型工作區（行 129–135）：匯出可能含巢狀 `.zip`，錯誤訊息「Import failed {id}.zip/{id}-Part-1.zip undefined.」，解法是先解壓再匯入各 `Export-{id}-Part-1.zip`。

## 3. Bases

- 是核心外掛（Introduction to Bases.md 行 11）：「Bases is a core plugin that lets you create database-like views of your notes. Using a base you can view, edit, sort, and filter files and their properties.」Core plugins.md 行 28 的核心外掛清單也列了 Bases。
- 資料存在哪（行 17）：「All the data in Obsidian Bases is stored in your local Markdown files and their properties. The views are described by the Bases syntax, which can be saved as a `.base` file or embedded in code blocks within your Markdown files.」
- 檔案格式（Bases syntax.md 行 10、12）：「When you create a base in Obsidian, it is saved as a `.base` file.」「Bases must be valid YAML conforming to the schema defined below.」Accepted file formats.md 行 12：「**Bases:** `.base`」。
- 範圍（syntax 行 65）：「By default a base includes every file in the vault. There is no `from` or `source` like in SQL or Dataview.」
- 嵌入：`![[File.base]]`、`![[File.base#View]]`，或 ` ```base ` 程式碼區塊（Create a base.md 行 28–42）。
- 檢視類型與起始版本（Views.md 行 45–51，「App version」欄）：Table 1.9、Cards 1.9、List 1.10、Kanban 1.14、Map 1.10（Map「Requires the Maps plugin.」）。
- 起始版本（changelog）：
  - 1.9.0 Desktop catalyst，May 21, 2025：「Introducing Bases, a new core plugin that lets you turn any set of notes into a powerful database.」「To support Bases, we're introducing the `.base` file format and syntax.」「Important: This is an early beta. … a longer than usual early access phase.」
  - 1.9.10 Desktop public，August 18, 2025：同一段介紹文字，這是公開版首次帶 Bases。
- 一般限制：`file.backlinks`「is performance heavy」且「Does not automatically refresh results when the vault is changed.」；`file.properties` 也「Does not automatically refresh results when the vault is changed.」（syntax 的檔案屬性表）。

## 4. Internal links

- 自動更新連結（Internal links.md 行 15–17）：「Obsidian can automatically update internal links in your vault when you rename a file. If you want to be prompted instead, you can disable it under: **Settings** → **Files and links** → **Automatically update internal links**.」
- Settings.md 行 214–216 的設定名與說明：「#### Automatically update internal links」「When enabled, Obsidian automatically updates internal links when you rename a file. Turn this off to be prompted to update links after renaming.」
- Manage notes.md 行 53：「When you rename a file, Obsidian automatically updates all the links to that file.」
- **只限在 Obsidian 內改名嗎？** 說明頁沒有任何一句明說「在 Obsidian 外（Finder、檔案總管、git mv）改名不會更新連結」。能找到最近的官方說法是：
  - 同步頁 FAQ：Obsidian 需要存取整個 vault 才能做到「updating links when renaming a file」。
  - Symbolic links and junctions.md 行 15（只講檔案 symlink）：「Changes performed outside of Obsidian aren't watched for, so if you change the file directly, Obsidian won't detect the change, update search indexes, etc.」
  - 所以「外部改名不會更新連結」是從機制推得的結論（改名事件發生在 Obsidian 的改名指令裡才會連帶改寫連結），不是說明頁原句。寫文章時要寫成推論或另找來源。
- Wikilink 開關的確切 UI 名稱：Internal links.md 行 40「Under **Files and Links**, disable **Use \[\[Wikilinks\]\]**.」——UI 名稱是「**Use [[Wikilinks]]**」。Settings.md 行 218–220 的標題寫成「#### Use Wikilinks」（標題裡沒有方括號），說明：「Auto-generate Wikilinks for `[[links]]` and `![[images]]` instead of Markdown links and images. Disable this option to generate Markdown links instead.」
- 預設是 Wikilink（行 35）：「By default, due to its more compact format, Obsidian generates links using the Wikilink format. If interoperability is important to you, you can disable Wikilinks and use Markdown links instead.」
- 關掉後仍可用 `[[` 自動完成（行 42）：「When you select one of the suggested files, Obsidian instead generates a Markdown link.」
- Markdown 連結要 URL encode（行 33）：「blank spaces become `%20`」。
- 區塊參照不可攜（行 146–147）：「Block references are specific to Obsidian and not part of the standard Markdown format. Links containing block references won't work outside of Obsidian.」

## 限制

- 這些是**官方說明文件**，描述產品設計與官方立場，不是使用者研究或可靠度量測。「Recommended systems」是官方建議，不是相容性測試報告。
- 同步頁自己說清單是「commonly used sync methods reported by members of the Obsidian community」——除了 Obsidian Sync 之外的方式是社群慣用法，官方只寫支援程度，不保證。
- 說明文件會持續改寫（本 commit 是 2026-10-19）；Notion API 匯入頁自稱「new」，限制清單可能變動。引用時要帶讀取日期。
- Bases 版本：Views.md 的「1.9」沒寫小版號；1.9.0 是 early access（catalyst），1.9.10 是公開版。說「1.9 起」要分清楚是哪一個。
- changelog 經 exa 抓取，maxCharacters 6000 截斷；Bases 段落在頁首，已完整取得，後段（Developers 之後）沒讀。
- 只讀英文版（`en/`），沒有比對 zh 等在地化版本。

## 與常見轉述不一致處

1. **「Obsidian 官方支援 Dropbox 同步」**：同步主頁根本沒有 Dropbox 專節；Dropbox 只出現在 iOS 的「Unsupported options」清單。其他頁（How Obsidian stores data）說「Obsidian syncs with … Dropbox」，但那是泛稱可放在同步資料夾，不是官方支援宣告。
2. **「iOS 只能用 Obsidian Sync 或 iCloud」**：官方寫的是「Recommended options」只有這兩個，其他（Dropbox、Google Drive、OneDrive、Syncthing）是「aren't officially supported on iOS」，但承認有 Remotely Save、LiveSync、Working Copy 等變通。「只能」說得太死；「官方推薦的只有兩個」才準確。
3. **「Git 同步可以自動化」**：頁面原句是「syncing isn't automatic. You must manually push and pull changes.」（社群外掛如 Obsidian Git 可自動化，但說明頁沒提，不能說成官方說法。）
4. **「Notion 匯入建議用 Markdown 匯出」**：官方明確相反——要用 HTML，「do not use Notion's Markdown export as it omits important data」。
5. **「Notion 資料庫匯入後變成 CSV／表格」**：.zip 匯入「Does not preserve Databases」；只有 API 匯入會轉成 Bases（每個資料庫一個資料夾＋`.base` 檔），而且只匯入「primary view」。
6. **「Importer 是核心外掛」**：官方稱「official Community plugin made by the Obsidian team」，要從社群外掛安裝。Bases 才是核心外掛。
7. **「Bases 是把資料存進資料庫」**：資料仍在 Markdown 與 properties；`.base` 只是描述檢視的 YAML。
8. **「Bases 從 1.9 開始就有看板／清單」**：只有 Table、Cards 是 1.9；List、Map 1.10；Kanban 1.14。
9. **「Obsidian 改名一定會更新所有連結」**：設定可關（關了改為詢問）；說明頁沒有聲明外部改名的行為，「外部改名不更新」只能當推論寫。
10. **設定名稱**：常被寫成「Use Wikilinks」或「使用 Wiki 連結」。Internal links 頁的 UI 名稱是「Use [[Wikilinks]]」；Settings 頁標題寫「Use Wikilinks」——官方兩頁寫法本身就不一致，引用 UI 時以帶方括號的版本為準。

## 讀取紀錄

全文存於 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/`，皆為 commit `cd6c9f3c` 的 raw 檔（curl raw.githubusercontent.com，2026-10-22）：

| 檔案 | 行數 | bytes | 讀過的行 |
|---|---|---|---|
| obs2-sync.txt | 237 | 12796 | 1–237 全讀 |
| obs2-notion.txt | 141 | 7399 | 1–141 全讀 |
| obs2-importer.txt | 31 | 1404 | 1–31 全讀 |
| obs2-bases-intro.txt | 45 | 2030 | 1–45 全讀 |
| obs2-bases-create.txt | 44 | 1220 | 1–44 全讀 |
| obs2-bases-syntax.txt | 384 | 18036 | 1–384 全讀 |
| obs2-bases-views.txt | 152 | 8565 | 40–56（版本表）；其餘未讀 |
| obs2-internal-links.txt | 184 | 8992 | 1–184 全讀 |
| obs2-settings.txt | 392 | 14713 | grep 命中 212–228（Files and links 段）；其餘未讀 |
| obs2-manage-notes.txt | 70 | 3220 | grep 命中行（4、25–40、46–55、66）；未逐行全讀 |
| obs2-core-plugins.txt | 90 | 3261 | 20–32；grep 命中 90 |
| obs2-accepted-formats.txt | 32 | 1083 | grep 命中 12 |
| obs2-changelog-bases.txt | 14 | 1832 | exa 抓 obsidian.md/changelog 1.9.0、1.9.10 頁首的摘錄（工具截斷在 6000 字元） |

另把同 commit 的整個 repo tarball 解壓到 scratchpad 的 `obsrepo/`，用 grep 全庫搜「outside of Obsidian」「Dropbox」「1.9」做反證與旁證檢查（結果見第 1、4 節）。
