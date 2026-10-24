# 編輯審稿：知識庫怎麼建 order 4、5（2026-10-22）

審稿者角色：沒參與寫作、未讀任何既有審稿紀錄的資深編輯。以目標讀者（想整理自己筆記、筆記越積越多找不到的人；用 Notion 或 Obsidian）的角度讀。

讀過：order 4、5 中英四篇；order 0–3 中文版；規劃表 `.work/series-plans/building-knowledge-bases.md`（目標讀者、斷崖處理、order 4–6 範圍卡）；writing-guide「長文的體裁與語域」七條。
另外查了兩頁 Obsidian 官方說明（2026-10-22 抓取）來核對建議能不能照做：`help.obsidian.md/sync-notes`、`help.obsidian.md/import/notion`。

---

## 1. 讀者測試

### order 4：用 Notion／Obsidian 的人讀完，能做什麼、會卡在哪

**能做到的：** 「匯出一次、用別的程式打開」這個測試很清楚，今晚就做得出來（「拿一個最普通的文字編輯器打開匯出的檔案，看看哪些東西變成亂碼、哪些連結斷了」）。Obsidian 專屬語法清單（區塊連結、`%%`、`==`、properties 裡的連結）具體、有官方原話，讀者能拿去對照自己的筆記。

**卡住的地方：**

1. **評估自己的工具：五個判準只用了第一條。** 開頭表格列了「檔案格式／連結／搜尋／同步／離線」，接著說「其他四條用起來就知道好不好」，之後全文沒有再用搜尋、同步、離線評過 Obsidian 或 Notion。讀者拿不到「我的工具在這五條各是幾分」的答案，也沒有一張兩個工具並排的表。判準表變成了裝飾。
2. **同步的說法對手機使用者是錯的方向。** 原文：「同步可以用它自家的 Obsidian Sync，也可以用 Dropbox、iCloud、Git 這類工具。」Obsidian 官方同步說明（2026-10）的 iPhone/iPad 段落寫的是：官方建議只有 Obsidian Sync 和 iCloud；Dropbox、Google Drive、OneDrive、Syncthing 在 iOS 上都列為 unsupported。以手機為主的讀者照這句選 Dropbox，會在 iPhone 上卡住。這正好是判準表「同步要靠它自家的服務，還是任何同步工具都行？」那一題的答案，文章反而沒答。
3. **決定要不要換：沒有決策段。** 全文只講「換了會掉什麼」，沒有講「誰該留在 Notion、誰該換」。Notion 的強項（資料庫、多檢視、協作）在「資料庫好用」一句帶過；讀者如果是跟同事共用 workspace、重度用資料庫，文章沒告訴他「那你可能不該換」。
4. **換工具的實際路徑缺席。** 從 Notion 搬到 Obsidian 是最常見的方向，文章只寫了反方向（「從 Obsidian 搬到 Notion，Wikilink 和區塊連結大概都帶不過去」，而且是「大概」）。Obsidian 官方 Importer 外掛的 Notion 說明寫明：用 Notion API 匯入可以保留資料庫與 formula，轉成 Obsidian 的 Bases；用 .zip 匯入則建議 Notion 匯出選 **HTML 而不是 Markdown**，因為「Notion's Markdown export ... omits important data」。這和文章「今晚匯出一次」暗示用 Markdown 匯出的做法有落差，也是想換工具的讀者最需要的一段。
5. **Obsidian 實作步驟有三個缺口：**
   - 永久筆記和 MOC 放哪個資料夾沒說。order 3 明講過「用 PARA 的人，想法筆記可以放在 Resources；用 Johnny.Decimal 的人，可以開一個專門放想法筆記的 category」，order 4 第 1 步只建了 PARA／JD 的空架子。
   - 第 3 步「給永久筆記加一個 `用途` 或 `狀態` 欄位，對應 order 1 的『一句話』和 order 2 的『標籤只標狀態』」把三件事攪在一起：order 1 的「用途」是收件時判斷用的，永久筆記不需要；「一句話」是內文不是欄位；order 2 講的是**標籤**，這裡變成 **property**。讀者會問：狀態到底用 tag 還是 property？
   - 第 2 步只說「改用 Markdown 連結」，沒提同一個設定區還有「New link format」（最短路徑／相對路徑／絕對路徑），以及檔名有空格時 Markdown 連結會被編碼成 `%20`（英文版的例子就出現了 `Don't%20let%20a%20folder...`，中文版沒有說明）。真要換工具，相對路徑才是別的工具讀得懂的那種。
6. **例子段沒有給「匯出結果」。** 範圍卡寫「同一組筆記在 Obsidian 與 Notion 的樣子，以及各自匯出結果」，正文卻是「relation 匯出後變成什麼，官方沒寫，要自己試一次才知道」。這是指南，作者自己試一次、把匯出的檔名與 CSV 欄位貼出來，比叫讀者去試有用得多。

### order 5：讀完能不能排出 30 分鐘每週回顧、決定哪些交給 LLM

**能做到的：** 30 分鐘四段（0–10、10–20、20–25、25–30）具體，能直接抄進行事曆。GTD 三段對 order 1–3 的表是全段最好的一張表，把前三篇串成一個循環。冷凍區（降級）是好的新動作。

**卡住的地方：**

1. **三段還是四段？** 表格是三段（Clear／Current／Creative），例子是四段（多了「20–25 分鐘：清理」），結尾說「重點是三段都要有：清空、處理、想新的」，「今晚可以做的事」第 1 條又說「照上面四段走」。讀者不知道「清理」是不是必要的。
2. **跟 order 1 的時間打架。** order 1「今晚可以做的事」第 3 條：「在行事曆排每週 20 分鐘。照三步清空收件匣」。order 5 收件匣只給 10 分鐘，總長 30 分鐘。讀過 order 1 的人會問：那 20 分鐘那個事件要刪掉，還是兩個都排？一句「order 1 那 20 分鐘，就是這裡的前段；收件匣小的話 10 分鐘夠」就解決。
3. **25–30 分鐘寫一則永久筆記不實際。** order 3 花了整篇講永久筆記要用自己的話、依概念、寫連結理由，還引 Matuschak「一心想寫成可以發表的樣子，他常常一個字都寫不出來」。五分鐘寫完一則，與前文的分量不符。改成「挑一個問題，寫下標題（就是主張）和第一句」比較能照做。
4. **「交給 LLM」那一欄沒有做法。** 表格左欄：「收件匣的初步分類建議」「找出重複或內容很像的筆記」「建議可能相關的筆記」。讀者讀完不知道：用哪個工具（Obsidian 外掛？Notion AI？把資料夾丟給 ChatGPT/Claude？）、提示詞怎麼寫、一次丟多少。writing-guide 第 3 條：「抽象建議不算交付」。
5. **LLM 分類建議和 order 1 衝突。** order 1：「所以清收件匣時只做去留的決定，不急著分類。」order 5 的 0–10 分鐘：「可以先讓 LLM 給每則一個分類建議」。應改成「去留建議」（進知識庫／只留連結／待讀／刪），才和 order 1 的四個去處對得上。

---

## 2. 判準與建議：一致性、可操作性、漏掉的情境

**前後不一致：**

- order 4 開頭：「Omnivore 和 Pocket ... 使用者只有一到四個月可以把資料匯出來」。order 1 原文：Omnivore「約一個月」、Pocket「2025 年 5 月宣布停止服務，匯出功能在 11 月關閉」（約六個月）。兩篇對同一件事給了不同的數字，要回原始來源（Mozilla 說明頁）核對後統一。
- order 4 的判準和 local-first 七個理想是兩套並列的框架，兩套都沒有拿去評任何一個工具（見第 3 點）。
- order 5 的漸進摘要和 order 1、3 的「一句自己的話」沒有對齊。order 1：「寫得出那句話才進知識庫，寫不出就放進待讀清單」；order 3：「直接貼原文是摘錄，是文獻筆記，不是永久筆記」。Forte 的第 1–3 層卻是收原文段落、加粗、螢光，第 4 層「只有少數筆記」才用自己的話。讀者會問：到底每則都要寫一句，還是多數只劃線？需要一句話說清楚：漸進摘要適用於 Resources 裡的參考資料／文獻筆記；order 1 那句話是入庫門檻，與第 4 層不同。
- order 5「進行中的專案，看一眼有沒有放錯地方的筆記」排進每週固定時間；order 2 說 Forte「不建議排固定時間重整整個結構，而是『隨機會而做』」。差別不大（看一眼 ≠ 重整），但值得加半句說明這不是重整。

**漏掉的情境：**

| 讀者 | 目前文章給了什麼 | 缺什麼 |
|---|---|---|
| Apple Notes／Google Keep 使用者 | 無 | Apple Notes 沒有原生的整批 Markdown 匯出；Obsidian Importer 有 Apple Notes、Google Keep、Evernote、OneNote、Bear、Logseq 的匯入器。一張「其他工具套五判準」的小表就夠 |
| Logseq 使用者 | 無 | Logseq 以區塊為單位，區塊參照是核心用法，order 4「少用區塊連結」的建議對他等於「換工具」，要特別點出 |
| Google Docs 當筆記的人 | 無 | 沒有內部連結、反向連結；Takeout 匯出是 docx。可以一句話歸類到「檔案帶得走、連結本來就沒有」 |
| 手機為主的人 | order 4 的同步那句還指錯方向；order 5 完全沒提 | iOS 官方只支援 Obsidian Sync／iCloud；每週回顧能不能在手機上做（30 分鐘大概不行，收件匣那 10 分鐘可以） |
| 已經用 AI 自動整理的人（Notion AI 自動摘要、Readwise Ghostreader、自動標籤） | order 5「今晚」第 3 條：「至少改寫其中一段成你自己的話」；自我檢查談自動標籤 | 沒告訴他要不要關掉自動功能、已經自動產生的幾百則摘要怎麼處理（建議：不回頭改，從今天起入庫前補那一句，舊的進冷凍區） |
| 在意隱私的人 | order 4 local-first 第 6 條「隱私」 | order 5 建議把收件匣、整個筆記庫交給 LLM 找重複，卻沒提筆記會上傳到雲端模型。這與 order 4 的 local-first 論點直接相關，是兩篇之間最明顯的漏接 |
| Notion 團隊 workspace 使用者 | order 4「Enterprise 管理者可以關掉匯出」 | 「你不是管理員，匯不出整個 workspace」；Obsidian 說明也寫匯出全部工作區要 admin 權限 |

---

## 3. 研究與主張的比例

**order 4：** 研究比重不高，主要是官方說明，方向對。但有兩段讀起來像研究筆記：

- local-first 那節第三段：「要注意兩件事。第一，這張表是作者自己打的分數，不是量測。第二，表裡沒有評任何筆記軟體 ... 網路上說『這篇認定 Obsidian 是 local-first』是錯的轉述」。後半句是在反駁一個沒有出處的網路說法，屬於查證過程，讀者用不到，建議刪。
- 七個理想列完之後沒有被使用。writing-guide 第 2 條「一條主脊，不要三套組織原則並行」：這篇有「五個判準」和「七個理想」兩套。建議把七個理想壓成一句，說明五個判準各對應哪幾個理想（格式→長久、主導權；同步→多裝置；離線→快、離線），讓它成為判準的來由，而不是第二張清單。

**order 4 該講沒講：**
- **Obsidian Bases**（官方核心功能，Importer 說明直接寫 Notion 資料庫會轉成 Bases）。文章把「資料庫」當成 Notion 獨有的強項（「這是它比純檔案強的地方」），讀者會以為換到 Obsidian 就沒有資料庫檢視。Bases 是用 properties 做出表格檢視，資料仍存在 Markdown 的 YAML 裡，正好是「功能和可攜性不必二選一」的例子。
- **備份和匯出是兩件事。** Obsidian 不需要「匯出」，但需要備份；文章引了 Kleppmann「資料由你主導，就代表備份、防勒索軟體這些責任也落在你身上」，之後沒給任何備份動作。

**order 5：「LLM 能接手什麼」整節像文獻回顧。** 這是兩篇最需要改的地方：

- 四個研究各一段，每段都是「誰、幾人、怎麼做、結果、限制」。Chen 那段就有 30 位、15 秒、一兩分鐘、40%、8% 五個數字；writing-guide 第 4 條是「正文每個主張最多一個數字」。Etkin 那段後半（「這篇另一個常被引用的結論是『AI 幫助弱者、傷害強者』，但它的分組方式本身會製造出這種結果；換成獨立的入學考試成績分組後，效果小很多」）是方法學批評，讀者不需要知道一個被推翻的結論。
- 每段結尾都有一句但書（「這項研究沒有完全不用 AI 的對照組」「這些全是自評」「這項研究沒有量學習效果」），然後「研究的限制」節又說一次。writing-guide 第 6 條：但書集中到節末或附錄。
- **證據和建議對不上。** 四個研究量的都是「學習」：看講座、讀文章後的理解與記憶。表格左欄的任務（分類建議、找重複、建議連結、轉逐字稿）沒有一項被這些研究測過。研究支持的是右欄「為什麼要自己寫那一句」，對「哪些可以安心交出去」沒有證據。建議明說：左欄是作者依任務性質判斷（它不是學習步驟、錯了容易發現），右欄才有研究撐腰。
- 節首總結「研究結果比較一致的是：AI 替你做完越多，你學到的越少，但你會越喜歡它」。「越喜歡它」只來自 Chen 一項研究（受試者評完整筆記比只有逐字稿高），不是「比較一致」的結果，屬於 writing-guide 第 7 條「替來源加上它沒有的主張」。
- 規劃表要求的反證平衡是 Etkin（AI 幫低能力者）。稿子把它判為分組造成的假象之後，整節就只剩「AI 有害」的方向，NoTeeline 只證明省時間。這可以接受，但要在節首說清楚目前沒有研究顯示 AI 筆記讓人學得更多，而不是讓讀者自己拼出來。

**建議改法：** 這節改成「先結論、後證據」：一段結論（自己決定記什麼，AI 擴寫可以；AI 全包，學得最少），然後一張小表「研究｜量了什麼｜一個數字｜能推到哪」，四列。方法學細節和 Etkin 的分組問題移到「研究的限制」或附錄。省下來的篇幅拿去寫左欄的實際做法（提示詞範例、在 Obsidian／Notion 怎麼做、隱私提醒）。

**order 5 該講沒講：**
- 隱私（見上表）。
- 每季匯出（order 1、order 4 都要求每季匯出一次）沒有進 order 5 的維護節奏。維護篇是放「每週／每季／每次打開時」節奏總表的地方。
- 開頭 Van Kleek 2009 的 75% 是「10 天內沒有被**編輯**」，tldr 寫成「筆記記下來之後，多數再也不會被碰」。編輯 ≠ 被打開；10 天 ≠ 再也不會。要嘛改 tldr 用語（「多數寫完就沒再改過」），要嘛換一個量「被找回」的數字（order 1 已用過 List-it 2011「只有約五分之一曾經被搜尋找出來過」）。

---

## 4. 與 order 0–3 及兩篇之間的重複或矛盾；order 5 作為個人段收尾

**重複：**
- order 4 開頭用 Omnivore／Pocket，order 1 已用過，而且數字不一致（見第 2 點）。當作回扣可以，但只要一句帶過、數字要一致。
- order 5 開頭用 MIT 側邊欄筆記工具的研究當鉤子，order 1 開頭也是同一個工具（List-it）、同一個團隊的研究。連續兩篇段首都是「MIT 筆記工具的百分比」，讀者會有既視感。
- order 5 再講 Melumad & Yun，order 1 已經講過並明說「用 AI 整理筆記能做什麼、不能做什麼，留給 order 5」。order 5 只用一句回扣是對的，不必再展開；目前的處理可以接受。
- order 3 已經寫過「AI 建議的連結，可以當線索，不要直接收下」，order 5 表格的「建議可能相關的筆記」跟它一致，可以直接連回 order 3 那節，不必重講。

**矛盾：**
- order 1「只做去留的決定，不急著分類」 vs order 5「讓 LLM 給每則一個分類建議」（見 1-5）。
- order 1「每週 20 分鐘」 vs order 5「30 分鐘、收件匣 10 分鐘」（見 1-2）。
- order 2「標籤只用來標跨主題的狀態」 vs order 4 第 3 步把「狀態」做成 property（見 1-5）。
- order 1、3 的「一句自己的話」 vs order 5 漸進摘要第 1–3 層（見第 2 點）。

**order 5 作為個人段收尾：沒有收束，也沒有接到 order 6。**
- 全文最後是「自我檢查」接參考資料。沒有一張「個人段全流程」的總結：收（order 1 三步判準）→ 放（order 2 一個主要的家）→ 連（order 3 寫理由的連結、MOC）→ 裝（order 4 帶得走的格式）→ 養（order 5 每週回顧）。GTD 三段對照表已經做了一半，再加「每次存的時候／每週／每季／每次打開時」的節奏欄，就是全段的一張地圖。
- 規劃表「斷崖處理」明寫：「5→6｜個人系統直接搬到團隊會壞｜order 5 結尾點出：讀者換成別人，『我知道這是什麼意思』就不成立；order 6 從這裡接」。稿子沒有這段。order 0 的三種讀者表（「未來的自己最寬容」「同事沒有你的脈絡」）正好是現成的鉤子：你筆記裡那句「年假：問 HR，表單在 Slack 置頂」，同事看不懂。建議收尾加一節「下一段：讀者換成同事」，三四句，連到 order 6（撰寫中可先不加連結）。

---

## 5. 標題、tldr、開頭三段

**order 4**
- 標題「工具落地：Obsidian、Notion 與換工具時資料帶不帶得走」：後半句是好鉤子，講到讀者真正怕的事。「工具落地」是系列內部用語，讀者不在乎。可考慮「Obsidian 還是 Notion：先問換工具時筆記帶不帶得走」。
- tldr 太長、太細：callout 變 HTML、只能匯出一個檢視都進了 tldr，卻沒有「該不該換」的結論。建議 tldr 給一個判斷：「重度用資料庫、跟人共用的留在 Notion，但每季匯出；在意十年後還打得開的用 Obsidian，少用區塊連結」。
- 開頭三段：第一段從服務關閉切入，有效；第二段是系列導覽；第三段直接進判準表。缺一句讓 Notion 使用者覺得「這篇在講我」的話（例如「你的 Notion 資料庫匯出後長什麼樣，你看過嗎？」）。

**order 5**
- 標題「維護：每週回顧、漸進摘要、刪除，與 LLM 能接手什麼」是四個名詞的清單，像目錄。目標讀者的痛點是「三個月後荒廢」（範圍卡的聚焦問題），標題沒用到。可考慮「筆記怎麼不荒廢：每週 30 分鐘回顧，與哪些交給 LLM」。
- tldr 前半好（30 分鐘、三件事、摘要不排時間），最後一句「研究顯示，AI 直接給完整筆記時，人學得最少，也最少修改」像研究摘要，可改成給讀者的行動：「讓 AI 擴寫你寫的重點，不要讓它替你寫重點」。
- 開頭三段：第一段鉤子的數字有過度推論（見第 3 點）；第二段把「這些整理工作，哪些可以交給 LLM？」點成大家最常問的問題，好。

---

## 6. 英文版

**最不自然的七處：**

1. **order 5，年份放句尾的中文語序（反覆出現）。** "Chen and colleagues had 30 university students watch lecture videos in 2025"、"Etkin and colleagues had 195 college-age participants read ACT reading passages in 2025"、"Lee and colleagues surveyed 319 people ... in 2025"、"Huq and colleagues built a tool called NoTeeline in 2025"。讀起來像實驗是 2025 年做的。→ "In a 2025 study, Chen and colleagues had ..."，其餘同理。
2. **order 5 tldr。** "the sentence in your own words, deciding what matters and whether to delete are yours" 主詞並列混了名詞和動名詞，文法彆扭。→ "but keep three things for yourself: the sentence in your own words, the call on what matters, and the decision to delete."
3. **order 5 例子結尾。** "What matters is having all three parts: clearing, dealing with, and thinking anew." "dealing with" 缺受詞，"thinking anew" 很生硬。→ "clearing out, catching up, and thinking ahead"（剛好對應 Get Clear／Current／Creative）。
4. **order 4，"proprietary syntax"（出現三次：自我檢查、今晚第 3 條、判準段）。** proprietary 暗示封閉或有授權限制，但 Obsidian 的語法是公開的，只是非標準。→ "Obsidian-only syntax" 或 "tool-specific features"。
5. **order 4 小標 "Local-first: the copy on your device is the real one"。** "real one" 口語又不精確，原文用的是 primary copy。→ "the copy on your device is the primary one"。
6. **order 4 第 3 步 "matching order 1's one sentence and order 2's 'tags only for status'"。** "order 1's one sentence" 沒有讀過中文版的人看不懂。→ "echoing order 1's rule of one sentence in your own words and order 2's advice to use tags only for status"（同時要依第 1-5 點修正內容）。
7. **order 5 "For projects still under way, glance for misfiled notes."** "glance for" 不是慣用搭配。→ "take a quick look for misfiled notes"。

次要：order 4 "look for what turned into gibberish"（Markdown 匯出通常不會變亂碼，→ "what came out garbled or as raw HTML"）。

**中英一致性：**
- order 4 中文「官方說明直接建議：如果在意和其他工具互通，就把 Wikilink 關掉」；英文 "The docs say outright that if interoperability matters to you, you **can** turn off Wikilinks"。中文是「建議」，英文是「可以」，語氣不同。依官方原文擇一統一。
- order 4 英文的 Markdown 連結例子是 `Don't%20let%20a%20folder%20tree...`，中文例子沒有空格所以沒有 `%20`。英文讀者看到 `%20` 會疑惑，兩版都應加一句「檔名有空格時，Markdown 連結會把空格寫成 `%20`」。
- 其餘段落、表格、數字中英一致，沒有發現漏譯或多譯。

---

## 7. 總評

**order 4：6.5／10**
優點：官方原話引得準；專屬語法清單和「匯出一次、用別的程式打開」很實用；Steph Ango 一段自帶反諷（CEO 說 app 不會永遠存在），引得好。
要到 9 分還差：
- 用五個判準實際評一次 Obsidian 和 Notion（一張並排表），修正手機同步的說法；
- 加「要不要換」的決策段和實際搬家路徑（Obsidian Importer、Notion 匯出選 HTML、Bases）；
- 例子段貼出真的匯出結果；
- local-first 七條併進判準，刪掉反駁網路說法那句；
- 補其他工具一張小表；
- 補齊 Obsidian 實作步驟（永久筆記與 MOC 放哪、tag 還是 property、連結路徑格式）。

**order 5：6／10**
優點：GTD 三段對 order 1–3 的表是全段最好的串接；漸進摘要「碰到才加一層」糾正常見誤解，講得清楚；降級／冷凍區是新的、可做的動作；分工表左右欄的共同點那兩句很好。
要到 9 分還差：
- 加個人段收尾總表和接到 order 6 的段落（規劃表明列、目前沒有）；
- LLM 一節從文獻回顧改成「結論＋一張證據表」，省下的篇幅寫左欄怎麼做（提示詞、工具、隱私）；
- 和 order 1 的四處對齊（20／30 分鐘、去留 vs 分類、一句話 vs 漸進摘要、每季匯出）；
- 30 分鐘流程統一成三段或四段，最後五分鐘改成能做完的動作；
- 開頭與 tldr 不要從「10 天沒編輯」推到「再也不會被碰」；
- 英文版改掉年份語序。

---

## 按影響排序的修改建議（12 條）

1. **〔order 5〕加個人段收尾與 5→6 橋接。** 一張全段流程表（收／放／連／裝／養 × 存的當下、每週、每季、每次打開），加一節「讀者換成同事」，用 order 0「年假：問 HR，表單在 Slack 置頂」當鉤子，接 order 6。規劃表斷崖處理已明列，目前完全缺。
2. **〔order 5〕重寫「LLM 能接手什麼」。** 結論先行；四個研究壓成一張「量了什麼｜一個數字｜能推到哪」的表；方法學與 Etkin 分組問題移到限制節；刪掉「你會越喜歡它」的概括；明說左欄是依任務性質判斷、右欄才有研究支持；補左欄的實際做法（一個收件匣去留建議的提示詞、一個找重複的提示詞、Obsidian／Notion 裡在哪做）。
3. **〔order 4〕用五個判準實際評 Obsidian 和 Notion。** 並排一張表，搜尋、同步、離線、手機都要有答案；修正「Dropbox、iCloud、Git 都可以」：依官方說明，iOS 上只有 Obsidian Sync 和 iCloud 是官方支援。
4. **〔order 4〕加「要不要換、怎麼換」。** 誰該留在 Notion（協作、重度資料庫），誰適合 Obsidian；Notion→Obsidian 用官方 Importer：API 匯入可保留資料庫並轉成 Bases，.zip 匯入要選 HTML 匯出而不是 Markdown；提到 Bases，讓讀者知道換過去不等於失去資料庫檢視。
5. **〔order 5〕補隱私提醒，接回 order 4。** 把筆記庫丟給雲端 LLM 找重複，筆記就離開了你的裝置；給一個選項（只丟標題／只丟收件匣、或用本機模型），並連回 order 4 的 local-first「隱私」。
6. **〔order 5〕和 order 1 對齊四處。** 20 vs 30 分鐘；「分類建議」改「去留建議」；說明漸進摘要用在參考資料／文獻筆記，不取代入庫時那一句自己的話；每季匯出放進維護節奏。
7. **〔order 4〕例子段貼出真實匯出結果。** 作者自己匯出一次 Notion 的「永久筆記」資料庫，貼出檔名、CSV 的 relation 欄位長相，取代「要自己試一次才知道」。
8. **〔order 4〕一條主脊。** 七個理想壓成一句，說明它是五個判準的來由；刪掉「網路上說『這篇認定 Obsidian 是 local-first』是錯的轉述」（查證過程不進正文）。
9. **〔order 4〕補齊 Obsidian 實作步驟。** 永久筆記與 MOC 放哪（照 order 3：PARA 的 Resources 或 JD 專用 category）；狀態用 tag 還是 property 擇一並和 order 2 對齊；連結格式設成相對路徑，提醒檔名空格會變 `%20`；補一個備份動作。
10. **〔order 4〕補漏掉的工具與讀者。** 一張小表：Apple Notes、Google Keep、Logseq（區塊參照是核心，order 4 的建議對它影響最大）、Google Docs、Evernote，各一行「帶不帶得走、Obsidian Importer 支不支援」；Notion 非管理員匯不出整個 workspace。
11. **〔order 5〕修 30 分鐘流程與開頭鉤子。** 統一三段或四段（建議四段，表格補一列「清理」）；25–30 分鐘改成「寫下標題與第一句」；tldr「多數再也不會被碰」改成資料撐得住的說法，或換掉與 order 1 重複的 MIT 筆記工具開頭；標題改成以「不荒廢」為主。
12. **〔兩篇英文版＋一致性〕** order 5 的年份語序（4 處）、tldr 文法、"clearing, dealing with, and thinking anew"、"glance for"；order 4 的 "proprietary syntax"、"the real one"、"order 1's one sentence"；統一「建議／can」；Omnivore／Pocket 匯出期限與 order 1 對齊後兩語同步修。
