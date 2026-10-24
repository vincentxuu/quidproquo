# 抽取紀錄：Kleppmann, Wiggins, van Hardenberg, McGranaghan (2019), "Local-first software: You own your data, in spite of the cloud"

read_status=full

## 來源與讀取版本

- 網頁版：https://www.inkandswitch.com/local-first/ → meta refresh 轉址到 https://www.inkandswitch.com/essay/local-first/（實際讀這個網址）
- 正式出版：Onward! 2019（ACM SIGPLAN），pp. 154–178，doi:10.1145/3359591.3359737（文中行 29–31 自述）
- 網頁標示日期：April 2019；頁首有 "Tenfold: Celebrating 10 Years of Ink & Switch" 橫幅，網頁本身沒有修訂日期。
- 讀取日期：2026-10-22
- 取得方法：curl 抓 HTML（111,169 bytes）→ 自寫 HTML→text parser
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/localfirst.full.txt`（815 行，77,236 bytes）

## 這是什麼類型的來源

- 研究實驗室的立場論文（position paper）＋原型經驗報告，發表於同儕審查會議 Onward!（偏「新想法」的場子）。
- 評比表是作者「依自身判斷」打的勾叉，不是量測。原型評估是 5 人團隊自用＋約 10 位外部使用者的非正式可用性測試（行 635）。
- 作者立場：Ink & Switch 自己開發 Automerge（CRDT 函式庫），有推廣 CRDT 的利益（行 577）。

## 主張／事實

### A. 問題定義（行 21–103）
- 雲端 app 帶來協作與跨裝置，但「拿走了擁有權與主導權」；服務關了，軟體停止運作、資料就沒了（行 21）。
- 「擁有權」不是智財法意義，而是「創作者感知到與資料的關係」（行 91；行 209 再釋義為 user agency, autonomy, control）。
- 範圍限定：只談文件／檔案類創作 app 與個人資料庫（筆記、行事曆、待辦、密碼管理），不談銀行、電商、社群（行 97）。

### B. 七個理想（行 105–217；表格欄名在行 236–242）
在 local-first 中「本機那份是主副本，伺服器只是輔助的次副本」（行 111）。

| # | 章節標題（原文） | 表格欄名 |
|---|---|---|
| 1 | No spinners: your work at your fingertips | Fast |
| 2 | Your work is not trapped on one device | Multi-device |
| 3 | The network is optional | Offline |
| 4 | Seamless collaboration with your colleagues | Collaboration |
| 5 | The Long Now | Longevity |
| 6 | Security and privacy by default | Privacy |
| 7 | You retain ultimate ownership and control | User control |

- 理想 5 提到：純文字、JPEG、PDF 夠普及「大概能讀好幾個世紀」；美國國會圖書館也建議 XML、JSON、SQLite 作資料集典藏格式；但較冷門格式要保留互動性，就得能跑原軟體（行 189）。
- 理想 7：擁有資料也帶來責任——備份、防勒索、整理檔案（行 215）。
- 不必開源：閉源商業軟體也能滿足，只要不「人為限制」使用者對檔案的操作（例：禁止列印的 PDF、DRM）（行 217）。

### C. 評比表（✓ 符合／— 部分／✗ 不符；行 225）

使用者端（行 233–391）：

| 技術 | Fast | Multi-device | Offline | Collab | Longevity | Privacy | User control |
|---|---|---|---|---|---|---|---|
| Files + email attachments | ✓ | — | ✓ | ✗ | ✓ | — | ✓ |
| Google Docs | — | ✓ | — | ✓ | — | ✗ | — |
| Trello | — | ✓ | — | ✓ | — | ✗ | ✗ |
| Pinterest | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Dropbox | ✓ | — | — | ✗ | ✓ | — | ✓ |
| Git+GitHub | ✓ | — | ✓ | — | ✓ | — | ✓ |

開發者基礎設施（行 393–523）：

| 技術 | Fast | Multi-device | Offline | Collab | Longevity | Privacy | User control |
|---|---|---|---|---|---|---|---|
| Web apps | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| Thick client | ✓ | — | ✓ | ✗ | — | ✗ | ✗ |
| Firebase, CloudKit, Realm | — | ✓ | ✓ | — | ✗ | ✗ | ✗ |
| CouchDB | — | — | ✓ | ✗ | — | — | — |

- 結論：「many technologies satisfy some of the goals, but none are able to satisfy them all」（行 227）。
- Git 被稱為「perhaps the closest thing we have to a true local-first software package」（行 379），但兩大弱點：沒有即時細粒度協作；非行導向文字格式是二等公民（行 387–389）。
- Dropbox 類：桌面版好（同步服務關了檔案還在本機、換服務容易），手機版是 thin client、預設不能離線（行 351–353）。

### D. CRDT 與原型（行 547–717）
- CRDT 2011 年起自學術研究；能自動合併並行修改，唯一無法自動解決的是「多人同時改同一物件的同一屬性」（行 561）。
- 三個原型：Trellis（看板）、Pixelpusher（像素繪圖）、PushPin（媒體畫布）（行 599–631）。
- 發現（行 639–717）：CRDT 可行；離線體驗很好；衝突沒想像中嚴重；文件歷史視覺化重要；URL 適合分享；P2P 難推理；CRDT 累積完整歷史造成效能問題；網路通訊未解；雲端伺服器仍有角色（cloud peer）。
- 作者自承：「not yet advisable to replace a proven product like Firebase with an experimental project like Automerge in a production setting today」（行 723）。

### E. 給實務者的長壽建議（行 781）
- 「Make sure your software can easily export to flattened, standard formats like JSON or PDF.」例：Google Takeout、GoodNotes 持續備份、Trello 的 JSON 下載。
- 檔案類 app 的起步建議：提供能匯出廣泛支援格式（純文字、PDF、PNG、JPEG）的功能（行 271）。

## 原句照抄

- 行 21："If a service shuts down, the software stops functioning, and data created with that software is lost."
- 行 89："In the words of a bumper sticker: “There is no cloud, it’s just someone else’s computer.”"
- 行 93："If the service shuts down, even though you might be able to export your data, without the servers there is normally no way for you to continue running your own copy of that software."
- 行 111："In local-first applications we swap these roles: we treat the copy of the data on your local device — your laptop, tablet, or phone — as the primary copy. Servers still exist, but they hold secondary copies of your data in order to assist with access from multiple devices."
- 行 171："When you do some work with local-first software, your work should continue to be accessible indefinitely, even after the company that produced the software is gone."
- 行 189："Some file formats (such as plain text, JPEG, and PDF) are so ubiquitous that they will probably be readable for centuries to come."
- 行 215："With data ownership comes responsibility: maintaining backups or other preventative measures against data loss, protecting against ransomware, and general organizing and managing of file archives."
- 行 227："As we shall see, many technologies satisfy some of the goals, but none are able to satisfy them all."
- 行 431："By choosing to build a web app, you are choosing the path of data belonging to you and your company, not to your users."
- 行 717："The key difference between traditional systems and local-first systems is not an absence of servers, but a change in their responsibilities: they are in a supporting role, not the source of truth."
- 行 803："No Wayback Machine can restore a sunsetted web application. The Internet Archive cannot preserve your Google Docs."

## 限制或作者立場

- 評比是作者主觀打分，表格沒有評分規則或量測（行 225 只定義符號意義）。
- 原型評估自承「did not follow a formal evaluation methodology」「somewhat subjective」（行 635–637）。
- 作者是 Automerge 開發方，對 CRDT 有推廣立場；文末還呼籲創業做「Firebase for CRDTs」（行 789–795）。
- 2019 年寫成：發表時 Obsidian 尚未推出（Dix 2024 引 Internet Archive，Obsidian 首站 2020-04-10），Notion 也沒被評。表內沒有任何筆記軟體。
- 範圍限定在創作／個人資料 app（行 97）。

## 與常見轉述不一致處

1. 常見說法「Ink & Switch 評比過 Obsidian／Notion，判定 Obsidian 是 local-first」——原文沒有評任何筆記 app。筆記類只出現 Evernote 的衝突處理反例（行 155：並行修改的筆記被丟進「conflicting changes」筆記本，沒有比對工具）。把 Obsidian 套進七個理想是讀者自己的延伸，要寫成「依此框架判斷」而非「該文指出」。
2. 常見說法「local-first＝不用伺服器／純本機」——原文明說伺服器仍存在，只是改當次副本與 cloud peer（行 111、705、717）。
3. 常見說法「local-first＝要開源」——原文明說閉源也可以（行 217）。
4. 常見轉述把七個理想簡化成「離線可用」——離線只是第 3 項；第 4 項「即時協作」是作者自認最難、也是全文主要技術貢獻所在（行 161）。
5. 「純文字能讀好幾世紀」原文是 "will probably be readable"，語氣是推測，不是保證（行 189）。
6. 「Git 是最接近的 local-first」常被引成「Git 就是 local-first」——原文說 Git 有兩大弱點，評比表 Multi-device、Collaboration、Privacy 都只給「—」。

## 讀取紀錄

- 2026-10-22 curl 第一次抓 /local-first/ 只拿到 152 bytes 的 meta refresh；改抓 /essay/local-first/（HTTP 200，111,169 bytes）。
- 轉文字後 815 行；用 Read 依序讀 1–300、300–815，全部讀完。
- 行 1–33 標題、作者、摘要、引用格式；35–71 目錄；73–103 動機；105–217 七理想；219–523 現有模型與評比表；525–795 CRDT、原型、建議；797–815 結論與致謝。
- 表格以 parser 拆成每格一行（如行 235–251），已逐格核對轉錄進上表。圖片只剩說明文字（如行 119、153），圖本身沒看。
