# 抽取紀錄：Obsidian 官方說明（資料儲存、內部連結、反向連結、Properties、區塊連結、嵌入）

read_status=full（下列 7 頁原始 Markdown 整頁讀完）

## 來源與讀取版本

- 來源：Obsidian 官方說明的 GitHub 原始檔 repo `obsidianmd/obsidian-help`，`master` 分支 `en/` 目錄。help.obsidian.md 由此 repo 發佈（各檔 frontmatter 有 `permalink`、`publish: true`）。
- 讀取版本：commit `cd6c9f3c7d5492bbbec94e8f403572b84eeb325b`（commit 時間 2026-10-19T15:13:44Z）
- 讀取日期：2026-10-22
- 取得方法：`curl https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/<路徑>`
- 全文檔（皆在 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/`）：

| 頁面 | repo 路徑 | 線上 permalink | 全文檔 | 行數 | bytes |
|---|---|---|---|---|---|
| How Obsidian stores data | en/Files and folders/How Obsidian stores data.md | /data-storage | obs-stores-data.txt | 55 | 3,473 |
| Internal links（含 Link to a block） | en/Linking notes and files/Internal links.md | /links | obs-internal-links.txt | 184 | 8,992 |
| Backlinks | en/Plugins/Backlinks.md | /plugins/backlinks | obs-backlinks.txt | 68 | 3,045 |
| Properties | en/Editing and formatting/Properties.md | /properties | obs-properties.txt | 306 | 10,453 |
| Embed files | en/Linking notes and files/Embed files.md | /embeds | obs-embed-files.txt | 133 | 3,125 |
| Obsidian Flavored Markdown | en/Editing and formatting/Obsidian Flavored Markdown.md | /obsidian-flavored-markdown | obs-flavored-md.txt | 43 | 2,564 |
| Aliases（補讀，因 Internal links 引用） | en/Linking notes and files/Aliases.md | /aliases | obs-aliases.txt | 52 | 1,777 |

- 注意：「Link to blocks」沒有獨立頁，是 Internal links 頁的一節（該檔 frontmatter alias 含 `How to/Link to blocks`，行 4）。

## 這是什麼類型的來源

- 廠商官方功能說明。描述工具怎麼運作，不證明「這樣做有效」。官方文件會改，引用寫「截至 2026-10（commit cd6c9f3）」。

## 主張／事實

### 1. 資料怎麼存（obs-stores-data.txt）
- 筆記是 vault 裡的 Markdown 純文字檔；vault 就是本機檔案系統上的一個資料夾（含子資料夾）（行 10）。
- 可用其他編輯器改；Obsidian 會自動刷新以跟上外部修改（行 12）。
- 可同步：Obsidian Sync、Dropbox、iCloud、OneDrive、Git 等（行 14）。
- 不建議 vault 套 vault，因為內部連結以 vault 為範圍，連結可能更新錯（行 18–19）。
- 每個 vault 根目錄有 `.obsidian` 設定資料夾（快捷鍵、主題、社群外掛）（行 23）；`workspace.json` 常變動，用 Git 時可考慮加進 `.gitignore`（行 31–32）。
- 另有 IndexedDB 存 Sync 狀態與 metadata cache；cache 可能和檔案不同步，可在設定 Files and links 重建（行 44–54）。→ 也就是說，反向連結、圖譜等「關係」是 app 從檔案算出來的快取，不寫在檔案裡。

### 2. 內部連結（obs-internal-links.txt）
- 兩種格式（行 21–24）：
  - Wikilink：`[[Three laws of motion]]` 或 `[[Three laws of motion.md]]`
  - Markdown：`[Three laws of motion](Three%20laws%20of%20motion)` 或 `...md)`
- 預設產生 Wikilink（因較精簡）；重視互通性可關掉「Use [[Wikilinks]]」改用 Markdown 連結；關掉後打 `[[` 仍能自動完成，但產生的是 Markdown 連結（行 35–42）。
- Markdown 格式要 URL encode，空白變 `%20`（行 32–33）。
- 改名自動更新連結：設定 → Files and links → Automatically update internal links；可關掉改成「提示」（行 15–17）。
- 不能用在連結的字元：`# | ^ : %% [[ ]]`（行 44–45）。
- 連到非 Markdown 檔要寫副檔名，如 `[[Figure 1.png]]`（行 57）。
- 連標題：`[[Note#Heading]]`；子標題可多個 `#`；`[[## team]]` 跨 vault 搜標題（行 64–90）。
- 顯示文字：Wikilink 用 `|`（`[[Example|Custom name]]`），Markdown 用 `[Custom name](Example.md)`（行 149–167）。

### 3. 區塊連結（Link to a block，obs-internal-links.txt 行 96–147）
- 區塊＝段落、引言、清單項等文字單位（行 98）。
- 語法：連結目的地後加 `#^` 和區塊 ID，例 `[[2023-01-01#^37066d]]`；打 `^` 會跳出建議清單（行 100）。
- 一般段落：行尾加空白＋`^ID`（行 102–106）。
- 結構化區塊（清單、引言、callout、表格）：ID 放獨立一行，前後各空一行（行 108–116）。
- 不支援連到引言、callout、表格的「局部」（行 127）。
- `[[^^block]]` 跨 vault 搜區塊（行 129–131）。
- 自訂可讀 ID：只能用拉丁字母、數字、連字號（行 136）。
- 互通性警告（行 146–147，見原句）。

### 4. 反向連結（obs-backlinks.txt）
- Backlinks 是「核心外掛」（core plugin），不是 Markdown 功能（行 9）。
- 兩段：Linked mentions（有內部連結指向本筆記）與 Unlinked mentions（只是文字出現筆記名稱、沒有連結）（行 26–29）。
- 可顯示在右側欄或筆記底部（「Backlink in document」選項）（行 59–68）。
- 排除檔案（Excluded files）不會出現在 Unlinked mentions（行 45–46）。

### 5. Properties（obs-properties.txt）
- 存在檔案開頭的 YAML（行 136）；在檔案最開頭打 `---` 即可新增（行 25）。
- 型別：Text、List、Number、Checkbox、Date、Date & time、Tags（行 37–45）；同名屬性在整個 vault 共用同一型別（行 47）。
- 預設屬性：`tags`、`aliases`、`cssclasses`（行 29、274–282）；Publish 用 `publish`、`permalink`、`description`、`image`、`cover`（行 286–294）。
- `tag`／`alias`／`cssclass` 在 1.4 棄用、1.9 起不再當預設屬性（行 296–304）。
- 屬性裡的內部連結必須加引號：`link: "[[Episode IV]]"`（行 154–161、168–179）。
- Text 屬性不渲染 Markdown、hashtag 不會變標籤（行 152）。
- 不支援：巢狀屬性、大量編輯（建議用 VSCode、腳本、外掛）、屬性內的 Markdown（刻意限制）（行 77–83）。
- 也可用 JSON 寫，但會被讀取並「存成 YAML」（行 259–272）。
- 日期格式 `2020-08-21`；日期時間 `2020-08-21T10:30:00`（行 204–238）。

### 6. 嵌入（obs-embed-files.txt）
- 在內部連結前加 `!` 即嵌入；嵌入內容會隨原檔更新（行 11–13）。
- 嵌入筆記 `![[Internal links]]`、嵌入標題或區塊 `![[Internal links#^b15695]]`（行 18–30）。
- 圖片尺寸 `![[Engelbart.jpg|100x145]]`，只給寬度則等比例（行 46–52）；外部圖片用 Markdown `![250](URL)`（行 56–59）。
- PDF `#page=3`、`#height=400`，可用 `&` 合併（行 74–98）。
- Canvas 嵌入只顯示形狀、不顯示卡片內文字（行 102–111）。
- 嵌入清單：先給清單加區塊 ID，再 `![[My note#^my-list-id]]`（行 113–129）。

### 7. Obsidian Flavored Markdown（obs-flavored-md.txt）
- 支援 CommonMark、GitHub Flavored Markdown、LaTeX（行 12）。
- HTML 元素內的 Markdown 不渲染（刻意設計）（行 14–23）。
- 擴充語法表（行 25–41）：`[[Link]]`、`![[Link]]`、`![[Link#^id]]`、`^id`、`[^id]`、`%%Text%%`、`~~Text~~`、`==Text==`、程式碼區塊、`- [ ]`、`- [x]`、`> [!note]`、表格。
- 哪些是 Obsidian 專屬（行 43，見原句）。

### 8. Aliases（obs-aliases.txt）
- 用 `aliases` 屬性（YAML 清單）設別名（行 21–32）。
- 用別名連結時，Obsidian 產生 `[[Artificial Intelligence|AI]]` 而非 `[[AI]]`，理由是「與其他使用 Wikilink 格式的應用互通」（行 41–44）。

## 原句照抄

- obs-stores-data.txt 行 10："Obsidian stores your notes as Markdown-formatted plain text files in a _vault_. A vault is a folder on your local file system, including any subfolders."（原檔中 Markdown-formatted 是 wikilink，此處去掉括號）
- obs-stores-data.txt 行 12："Because notes are plain text files, you can use other text editors and file managers to edit and manage notes. Obsidian automatically refreshes your vault to keep up with any external changes."
- obs-stores-data.txt 行 19："Because Internal links are local to a vault, we recommend that you don't create vaults within vaults. Links may not be updated correctly."
- obs-internal-links.txt 行 15："Obsidian can automatically update internal links in your vault when you rename a file. If you want to be prompted instead, you can disable it under:"（接行 17 設定路徑 Settings → Files and links → Automatically update internal links）
- obs-internal-links.txt 行 35："By default, due to its more compact format, Obsidian generates links using the Wikilink format. If interoperability is important to you, you can disable Wikilinks and use Markdown links instead."
- obs-internal-links.txt 行 100："You can link to a block by adding `#^` at the end of your link destination, followed by a unique block identifier. For example: `[[2023-01-01#^37066d]]`."
- obs-internal-links.txt 行 146–147："Block references are specific to Obsidian and not part of the standard Markdown format. Links containing block references won't work outside of Obsidian."
- obs-flavored-md.txt 行 43："Some of these, such as internal links, comments, and highlights, are specific to Obsidian. Other Markdown apps may show them as plain text."
- obs-flavored-md.txt 行 10："Obsidian strives for maximum capability without breaking any existing formats."
- obs-backlinks.txt 行 11："A backlink for a note is a link from another note to that note."
- obs-properties.txt 行 83："Markdown in properties: This is an intentional limitation as properties are meant for small, atomic bits of information that are both human and machine readable."
- obs-embed-files.txt 行 11："Embedded files display their content inline in a note and stay up to date when the source file changes."
- obs-aliases.txt 行 44："Rather than just using the alias as the link destination (`[[AI]]`), Obsidian uses the `[[Artificial Intelligence|AI]]` link format to ensure interoperability with other applications using the Wikilink format."

## 哪些語法是 Obsidian 專屬、在一般 Markdown 會失效

依官方文件（obs-flavored-md 行 43、obs-internal-links 行 146–147）與 CommonMark／GFM 規格的差異整理：

| 語法 | 官方怎麼說 | 在一般 Markdown 檢視器（如 GitHub、VS Code 預覽） |
|---|---|---|
| `[[Note]]` Wikilink | 明列為 Obsidian 專屬之一（internal links） | 顯示成字面文字 `[[Note]]`，不可點（部分工具如 Foam、Logseq 另有支援） |
| `![[Note]]` / `![[img.png]]` 嵌入 | 擴充語法表列出 | 字面文字；圖片不顯示 |
| `[[Note#^id]]` 區塊連結、`^id` 區塊 ID | 官方明說「won't work outside of Obsidian」 | `^id` 留在段落尾端成雜訊；連結失效 |
| `%%comment%%` 註解 | 明列為 Obsidian 專屬（comments） | 註解內容會直接顯示出來（隱私風險） |
| `==highlight==` | 明列為 Obsidian 專屬（highlights） | 顯示成 `==字==` |
| `> [!note]` callout | 列在擴充表，未明說專屬 | GFM 2023 起有自己的 alert 語法 `> [!NOTE]`，部分相容；其他檢視器只看到一般引言＋`[!note]` 字樣 |
| `[^id]` 註腳、`~~刪除線~~`、`- [ ]` 任務 | 列在擴充表 | GFM 支援；純 CommonMark 不支援 |
| 屬性 `"[[Link]]"` | — | 只是 YAML 字串；其他工具不會當連結 |
| 標準 Markdown 連結 `[text](Note.md)` | 官方建議重視互通性時改用 | 可用；但 Obsidian 支援 vault 根目錄起算的路徑，其他工具多以相對於檔案的路徑解析，路徑風格要注意 |

（表中「一般檢視器」一欄是我依 CommonMark／GFM 規格推論，不是 Obsidian 文件原文；callout 與 GFM alert 的關係也是外部知識，寫進文章前要另查 GitHub 文件。）

另外兩項「不在檔案裡」的東西：反向連結是核心外掛從 metadata cache 算出來的（obs-backlinks 行 9、obs-stores-data 行 50–54），換工具後檔案裡沒有反向連結清單；屬性型別設定也存在 vault 設定而非每個檔案（obs-properties 行 47）。後者是推論，文件只說型別會套用全 vault，沒說存在哪。

## 限制或作者立場

- 廠商文件，傾向強調「純文字、可攜」；但同一份文件也誠實寫出區塊連結等專屬語法會失效。
- 文件沒有量化任何東西（例如改名更新連結失敗率）。
- 「改名自動更新」只在 Obsidian 內改名才觸發；用 Finder 或其他編輯器改名不會更新連結——文件沒有明講這點，是由「Obsidian automatically refreshes your vault to keep up with any external changes」（只說會刷新）推不出會改連結；寫進文章時要標為推論或另行實測。

## 與常見轉述不一致處

1. 常見說法「Obsidian 就是純 Markdown，換工具零成本」——官方自己說 internal links、comments、highlights 是 Obsidian 專屬，其他 app 可能顯示成純文字（obs-flavored-md 行 43），區塊連結在 Obsidian 外失效（obs-internal-links 行 146–147）。檔案帶得走，連結網不一定帶得走。
2. 常見說法「Obsidian 只能用 [[ ]]」——官方支援標準 Markdown 連結，可在設定關掉 Wikilink（行 35–42）。
3. 常見說法「反向連結存在筆記裡」——反向連結是外掛即時計算、靠 metadata cache（不在檔案內）。
4. 「Link to blocks」常被當成獨立功能頁引用——官方現在是 Internal links 頁的一節，舊網址是 alias。
5. 屬性常被說成「就是 YAML frontmatter，任何工具都讀得懂」——YAML 本身可讀，但連結必須加引號、型別由 Obsidian 解釋、不支援巢狀顯示（行 77–83、154）；其他工具不會把 `"[[X]]"` 當連結。
6. 常說的舊屬性 `tag`／`alias`／`cssclass` 已在 1.9 不再當預設屬性（行 298），舊教學可能過時。

## 讀取紀錄

- 2026-10-22 以 `gh api repos/obsidianmd/obsidian-help/git/trees/master?recursive=1` 列出 en/ 檔案，確認路徑；以 `gh api .../commits/master` 取得 commit SHA。
- curl 下載 7 個 .md；用 Read 各自整檔讀完（行數見上表）。
- 原始檔中的 `[[...]]` 是 Obsidian 文件自己的內部連結；原句照抄時已去掉 wikilink 括號並註明。
- 沒有開 help.obsidian.md 線上渲染頁比對；內容以 repo 原始檔為準。
