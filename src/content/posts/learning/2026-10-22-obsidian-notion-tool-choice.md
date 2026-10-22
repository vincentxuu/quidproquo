---
title: "選筆記工具：Obsidian、Notion，與換工具時資料帶不帶得走"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, note-taking, obsidian, notion]
lang: zh-TW
tldr: "選筆記工具前先問五件事：檔案能不能用別的程式打開、連結改名會不會斷、搜尋、多裝置同步、離線能不能用。Obsidian 的筆記就是本機一個資料夾裡的 Markdown 檔，但區塊連結這類語法離開 Obsidian 就點不開，iPhone 上官方建議的同步方式也只有兩種。Notion 的資料庫好用，但匯出時只能帶走一個檢視、callout 會變成 HTML，匯出的東西也不能直接上傳回去還原。換工具之前，先匯出一次、用別的程式打開看看。"
description: "知識庫怎麼建 order 4：選筆記工具的五個判準、Obsidian 和 Notion 逐條比較、哪些語法離開工具就失效、要不要換與怎麼換，以及在 Obsidian 做出 order 2、3 的資料夾與連結。"
series:
  name: "知識庫怎麼建"
  order: 4
---

> 🌏 [English version](/posts/learning/2026-10-22-obsidian-notion-tool-choice-en)

[order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge) 提過兩個稍後閱讀服務關站的例子：Omnivore 從宣布到不能匯出只有約一個月，Pocket 約半年。筆記工具也一樣，你今天用得很順的軟體，十年後不一定還在。2019 年 Ink & Switch 研究室的一篇文章講得很直接：服務一關，軟體就停止運作，用它建立的資料也跟著沒了（[Kleppmann et al. 2019](https://www.inkandswitch.com/local-first/)）。

這篇是「知識庫怎麼建」個人段的第四篇。前面三篇談收什麼、放哪裡、怎麼連，這篇談用什麼工具裝它們，以及哪天要換工具時，資料帶不帶得走。讀完你能用五個判準評估一個筆記工具，決定要不要換，並在 Obsidian 裡把 [order 2](/posts/learning/2026-10-22-para-johnny-decimal-folders) 的資料夾和 [order 3](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc) 的連結做出來。這篇不比較外掛。

## 選工具前先問五件事

工具的功能清單一直在變，下面五件事比較不會變：

| 判準 | 要問的問題 |
|---|---|
| 檔案格式 | 筆記存成什麼？不開這個軟體，能用別的程式打開嗎？ |
| 連結 | 筆記之間能互相連結嗎？改了標題，連結會不會斷？ |
| 搜尋 | 能搜全文嗎？能依標籤、屬性篩選嗎？ |
| 同步 | 手機、電腦都能用嗎？同步要靠它自家的服務，還是別的同步工具也行？ |
| 離線 | 沒有網路時能讀能寫嗎？ |

這五條是我整理的。其中多裝置、離線、資料能不能長久留著，對應 Ink & Switch 那篇提出的「local-first」理念：資料的正本在你自己的裝置上，伺服器只是輔助同步。那篇列了七個理想，並用它們評了 Google Docs、Dropbox、Git 等工具，結論是沒有一個全部做到，Git 最接近；表裡沒有評任何筆記軟體。連結和搜尋兩條，是為了知識庫另外加的。

檔案格式這一條最難事後補救。其他四條用起來就知道好不好，格式的問題卻要等到哪天想換工具才會發現。

## Obsidian 和 Notion，逐條比

| 判準 | Obsidian | Notion |
|---|---|---|
| 檔案格式 | 本機資料夾裡的 Markdown 純文字檔，其他編輯器打得開 | 存在雲端；可匯出成 Markdown 和 CSV，但有不少限制（見下文） |
| 連結 | 兩種寫法；在 Obsidian 裡改檔名，連結預設會自動更新 | 頁面之間可以連結，資料庫之間可以用 relation 連起來 |
| 搜尋與篩選 | 標籤和 properties；Bases 可以做資料庫式的表格檢視 | 資料庫可依屬性篩選、排序、分組 |
| 同步 | 自家 Obsidian Sync，或 iCloud、Git 等；各平台支援不同（見下文） | 內建，靠 Notion 自己的伺服器 |
| 離線 | 檔案在本機，離線照常讀寫 | 這篇沒有核對離線的官方說明，用之前請自己確認 |

## Obsidian：筆記就是一個資料夾裡的檔案

依 [Obsidian 官方說明](https://help.obsidian.md/data-storage)（2026 年 10 月），筆記存成 Markdown 純文字檔，放在一個叫 vault 的資料夾裡，這個資料夾就在你自己的電腦上。因為是純文字，你可以用其他編輯器打開、修改，Obsidian 會自動跟上。

**同步要看平台。** [同步說明](https://help.obsidian.md/sync-notes)列了每個平台的做法。iPhone 和 iPad 上，官方建議的只有 Obsidian Sync 和 iCloud；Dropbox、Google Drive、OneDrive 被列為「不在官方支援範圍，但有人找到變通辦法」。用 Git 同步也可以，但不會自動同步，要自己手動推送和拉取。原因是 Obsidian 需要存取整個 vault，才能做到改檔名時一併更新連結這類功能。

**連結有兩種寫法**（[Internal links](https://help.obsidian.md/links)）：

- **Wikilink**：`[[資料夾樹別深到七層以上]]`，Obsidian 預設用這種，比較精簡。
- **Markdown 連結**：`[資料夾樹別深到七層以上](資料夾樹別深到七層以上.md)`，一般的 Markdown 工具都看得懂。檔名有空格時，要寫成 `%20`。

官方說明提到，如果在意和其他工具互通，可以把 Wikilink 關掉，改用 Markdown 連結。在 Obsidian 裡改檔名時，它預設會自動更新所有指向這個檔案的連結。官方說明講的是在 Obsidian 裡改名；在 Finder 或其他程式裡改名時，不要假設連結會跟著更新。

反向連結是 Obsidian 內建的外掛功能，會列出哪些筆記連到這裡（[Backlinks](https://help.obsidian.md/plugins/backlinks)）。這些關係是 Obsidian 從檔案算出來的，不另外寫進檔案裡。筆記開頭可以加 properties，以 YAML 格式寫在檔案裡（[Properties](https://help.obsidian.md/properties)）。2025 年起，Obsidian 也有一個叫 [Bases](https://help.obsidian.md/bases) 的核心外掛，能把筆記的 properties 排成表格、卡片等檢視，設定存成 `.base` 檔，資料本身還是留在各則筆記裡。

**哪些東西離開 Obsidian 就失效。** 官方說明自己點出了幾種：

- **區塊連結**，例如 `[[2023-01-01#^37066d]]`，可以連到某一段文字。官方的說法是：「Block references are specific to Obsidian and not part of the standard Markdown format.」離開 Obsidian，這串字還留在檔案裡，但點不開。
- **Wikilink、註解 `%%...%%`、螢光標記 `==...==`**，官方說其他 Markdown 工具可能只會顯示成純文字（[Obsidian Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)）。

同理，properties 裡的連結要寫成 `"[[某則筆記]]"`，在其他工具裡只是一串文字。所以 Obsidian 的檔案帶得走，但帶走之後，連結和某些格式要靠你自己處理。

Obsidian 的執行長 Steph Ango 寫過一篇〈[File over app](https://stephango.com/file-over-app)〉，主張想讓數位作品留得久，就要用你能掌控、容易讀取的檔案格式。要記得這是廠商立場。他自己也寫，以為 Obsidian 會永遠存在是一種錯覺，能留下來的是檔案。

## Notion：資料庫好用，匯出時要付出代價

Notion 的資料存在雲端，用頁面和資料庫組織（order 2 談過）。資料庫可以加屬性、建好幾種檢視，這是它比純檔案強的地方。代價出現在匯出時。依 [Notion 官方的匯出說明](https://www.notion.com/help/export-your-content)（2026 年 10 月）：

- **格式**：一般頁面匯出成 Markdown；整頁的資料庫匯出成 CSV，每一筆再各自一個 Markdown 檔。
- **只能匯出一個檢視**：資料庫只能選目前的檢視或預設檢視，不能一次匯出全部。
- **callout 會變成 HTML**，因為 Markdown 沒有對應的格式。
- **權限**：你沒有權限的頁面不會被匯出；Enterprise 方案的管理者也可以把匯出功能關掉。如果你不是管理者，可能匯不出整個工作區。
- **回不去**：官方原話是「You can't instantly recreate your workspace by reuploading your exported workspace content.」匯出的東西不能直接上傳回去還原。

官方說明沒寫資料庫之間的 relation、rollup、頁面裡的 @mention 匯出後會變成什麼，這要你自己匯出一次才知道。[匯入說明](https://www.notion.com/help/import-data-into-notion)則提到，用 CSV 匯入時不能建立 relation、rollup 和 formula，要匯入後再重建；Markdown 裡的非標準擴充語法也不會匯入。

## 要不要換，怎麼換

**先問自己痛在哪裡。** 如果你主要的困擾是 order 1 到 order 3 那些事，例如收太多、找不到、筆記沒有連起來，換工具不會解決，先照前幾篇改做法。如果困擾是工具本身，例如資料被鎖在雲端、手機同步不穩、匯出不了，才值得換。

**從 Notion 換到 Obsidian。** Obsidian 團隊做了一個官方的社群外掛 [Importer](https://help.obsidian.md/import/notion)，有兩種方式：

- **用 Notion 帳號連線匯入**（官方推薦）：資料庫和公式會轉成 Bases，每個資料庫變成一個資料夾加一個 `.base` 檔；但每個資料庫只會匯入主要的那個檢視。
- **用 Notion 匯出的 .zip 匯入**：不用連線，但不會保留資料庫。官方建議這時在 Notion 選 HTML 匯出，不要選 Markdown，因為 Markdown 匯出會漏掉重要的資料。

**從 Obsidian 換到 Notion。** Notion 只保證匯入標準 Markdown，所以 Wikilink、區塊連結、嵌入這些 Obsidian 專屬語法，大概都帶不過去。換之前，先把要帶走的筆記改成 Markdown 連結。

## 在 Obsidian 裡做出 order 2、3 的結構

1. **資料夾**：照 order 2 選一套。用 PARA 就建 `0 收件匣`、`1 Projects`、`2 Areas`、`3 Resources`、`4 Archives`；用 Johnny.Decimal 就建 `00-09 系統`／`00 系統`／`00.01 收件匣`，再照你的 area 和 category 開資料夾。order 3 的永久筆記和 MOC，用 PARA 的放 Resources，用 Johnny.Decimal 的開一個專門的 category。
2. **連結格式**：在設定的 Files and links 裡，如果你在意以後換工具，把「Use [[Wikilinks]]」關掉，改用 Markdown 連結；確認「Automatically update internal links」是開的。
3. **用途和狀態**：order 1 的第一步要你說得出用途，可以在 properties 加一個 `用途` 欄位記下來；order 2 說標籤只標狀態，就用 `#待讀`、`#進行中` 這類標籤。
4. **連結理由**：照 order 3，連結旁邊寫一句為什麼連。反向連結面板會告訴你誰連過來，但不會替你寫理由。
5. **MOC**：等某個主題的筆記多到覺得亂，開一則新筆記，把相關筆記的連結丟進去，分組，加一節「還沒想清楚的」。
6. **少用區塊連結**：如果你在意可攜性，盡量連到整則筆記或標題。
7. **備份**：同步不等於備份。用同步服務的人，另外每季把整個 vault 資料夾複製一份到別的地方。

## 研究的限制

我找不到 2020 到 2026 年間以「換筆記軟體」為主題的訪談或問卷研究。比較接近的是 Alan Dix 2024 年的一篇觀點文章，他提到換系統的成本不只是匯出匯入，還有學新工具、放棄已經摸熟的變通做法，而廠商也常傾向讓使用者留在自家平台裡（[Dix 2024](https://doi.org/10.1080/07370024.2024.2356155)）。作者自己說這是個人觀點。上面兩個工具的行為描述來自它們的官方說明，官方說明會隨版本改變，用之前以當下的說明為準。

## 今晚可以做的事

1. **匯出一次。** 不管你用什麼工具，今晚就照官方步驟匯出一次全部筆記。
2. **用別的程式打開，檢查三件事。** 拿一個最普通的文字編輯器打開匯出的檔案：文字有沒有變成亂碼、連結點不點得開、有沒有整段不見。有問題的，記下來是哪一種內容造成的。
3. **列出你用到的專屬語法。** 例如 Obsidian 的區塊連結、Notion 的 relation 和 rollup。這些是換工具時要手動處理的部分，用得越多，越要定期匯出。
4. **排一個每季的匯出提醒。** 工具會消失，匯出的檔案才是你的備份。

## 自我檢查

**問：** 你用的筆記工具明天宣布停止服務，給你三個月匯出。你的筆記會剩下什麼？

**判準：** 看兩件事。第一，匯出格式是不是別的程式也打得開的標準格式，例如純文字、Markdown、CSV、PDF。第二，你用了多少專屬功能：Obsidian 的區塊連結還會留在檔案裡，但點不開；Notion 的 callout 會變成 HTML；relation、rollup 這類資料庫功能匯出後變成什麼，官方沒寫，你只能自己匯出一次看看。格式標準、專屬功能用得少，你的筆記幾乎都還在；格式封閉、專屬功能用得多，你帶走的可能是一堆失去連結的文字。

## 參考資料

- [Kleppmann, Wiggins, van Hardenberg & McGranaghan 2019, Local-first software: You own your data, in spite of the cloud (Ink & Switch; Onward! 2019)](https://www.inkandswitch.com/local-first/)
- [Obsidian Help: How Obsidian stores data](https://help.obsidian.md/data-storage)
- [Obsidian Help: Sync your notes across devices](https://help.obsidian.md/sync-notes)
- [Obsidian Help: Internal links](https://help.obsidian.md/links)
- [Obsidian Help: Backlinks](https://help.obsidian.md/plugins/backlinks)
- [Obsidian Help: Properties](https://help.obsidian.md/properties)
- [Obsidian Help: Introduction to Bases](https://help.obsidian.md/bases)
- [Obsidian Help: Obsidian Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)
- [Obsidian Help: Import from Notion](https://help.obsidian.md/import/notion)
- [Steph Ango, File over app](https://stephango.com/file-over-app)
- [Notion Help: Export your content](https://www.notion.com/help/export-your-content)
- [Notion Help: Import data into Notion](https://www.notion.com/help/import-data-into-notion)
- [Dix 2024, The future of PIM: pragmatics and potential (Human–Computer Interaction)](https://doi.org/10.1080/07370024.2024.2356155)
