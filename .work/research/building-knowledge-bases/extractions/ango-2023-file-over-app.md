# 抽取紀錄：Steph Ango (2023), "File over app"

read_status=full

## 來源與讀取版本

- URL：https://stephango.com/file-over-app
- 作者：Steph Ango（頁面 Linked mentions 區自述「I am currently CEO of the company」，指 Obsidian；行 59–61）
- 發佈日期：July 1, 2023（行 11）；頁面無修訂日期
- 讀取日期：2026-10-22
- 取得方法：curl 抓 HTML（15,839 bytes）→ 自寫 HTML→text parser
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/fileoverapp.full.txt`（91 行，3,741 bytes；本文在行 9–31，其餘為網站導覽、Linked mentions、推薦文章）

## 這是什麼類型的來源

- 個人部落格短文（標示 1 minute read），哲學／倡議性質，沒有證據或數據。
- **廠商立場**：作者是 Obsidian CEO，而 Obsidian 的產品主張正是以本機 Markdown 檔為核心。這篇是「賣方的理念宣言」，不是中立評估。

## 主張／事實

- 定義：File over app 是一種哲學——想讓數位作品長存，就必須是你能控制的檔案、容易取回與閱讀的格式；要使用給你這種自由的工具（行 13）。
- 對工具開發者的呼籲：接受所有軟體都是短暫的，把資料擁有權還給使用者（行 15）。
- 類比：埃及象形文字刻在石頭上幾千年，思想比鑿子重要（行 19）；實體物件可以觸摸、保存，讀紙只需要眼睛（行 21）。
- 現況批評：多數數位作品存在伺服器、資料庫，需要網路與登入；硬碟上的檔案也常是專有格式（行 23）。
- 引自己舊文（行 25–27，連結到 https://obsidian.md/blog/new-obsidian-icon/）：要讓 2060 或 2160 年的電腦讀得到，筆記得能被 1960 年代的電腦讀取。
- 自我限定：他用 Obsidian 寫作，但承認 Obsidian 終將過時，能存活的是純文字檔（行 31）。

## 原句照抄

- 行 13："File over app is a philosophy: if you want to create digital artifacts that last, they must be files you can control, in formats that are easy to retrieve and read. Use tools that give you this freedom."
- 行 15："File over app is an appeal to tool makers: accept that all software is ephemeral, and give people ownership over their data."
- 行 17："In the fullness of time, the files you create are more important than the tools you use to create them. Apps are ephemeral, but your files have a chance to last."
- 行 23："Even the files on your hard drive use proprietary formats that make them incompatible with older systems and other tools."
- 行 27："If you want your writing to still be readable on a computer from the 2060s or 2160s, it’s important that your notes can be read on a computer from the 1960s."
- 行 29："Don’t lock your data into a format you can’t retrieve."
- 行 31："These days I write using an app I help make called Obsidian, but it’s a delusion to think it will last forever. The app will eventually become obsolete. It’s the plain text files I create that are designed to last."

## 限制或作者立場

- 作者的雇主直接受益於這個主張；文章本身有揭露（行 31 "an app I help make"），但沒有討論 Obsidian 自有的專屬語法。
- 沒有證據、沒有反方。「your files have a chance to last」語氣是可能性，不是保證。
- 「1960 年代電腦讀得到」是修辭：1960 年代主流字元編碼不是 UTF-8，中文筆記不可能被當時電腦讀取；寫進文章要當修辭引，不能當技術事實。
- 文章只談「檔案格式」，不談檔案之間的連結、反向連結、屬性型別這些「結構」能不能帶走。

## 與常見轉述不一致處

1. 常被轉述為「Obsidian 的檔案能永久保存」——原文說的是「plain text files … are designed to last」「have a chance to last」，並明說 Obsidian app 本身會過時。說的是檔案，不是 Obsidian。
2. 常被當成「Obsidian 官方承諾」——這是 CEO 個人部落格，不是 Obsidian 產品文件或服務條款。
3. 拿 file over app 證明「用 Obsidian 就沒有鎖定」時要對照官方說明：Obsidian 自己的文件說區塊連結在 Obsidian 外失效、wikilink／註解／高亮是專屬語法（見 obsidian-official-docs.md）。理念和實作之間有落差，原文沒處理。
4. 引用標題時注意原文是單數 "File over app"（沒有查證有多少人誤寫成複數，只是提醒照原文寫）。

## 讀取紀錄

- 2026-10-22 curl HTTP 200；轉文字 91 行，用 Read 整檔讀完。
- 以 grep 從原始 HTML 確認「something I wrote recently」連到 obsidian.md/blog/new-obsidian-icon/（該舊文未讀）。
- 行 33–91 為 Linked mentions（他站其他文章的標題與摘要）、推薦文章、訂閱區，不屬本文。
