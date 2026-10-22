# 終審：知識庫怎麼建 order 2、order 3（中英）

審稿日：2026-10-22。獨立審稿，沒有讀 `.work/reviews/` 下的既有檔案。

範圍：
- order 2：`src/content/posts/learning/2026-10-22-para-johnny-decimal-folders.md`、`-en.md`
- order 3：`src/content/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc.md`、`-en.md`
- 對照：order 0 `2026-10-22-knowledge-base-three-readers.md`、order 1 `2026-10-22-what-to-keep-collecting-is-not-knowledge.md`

證據：`.work/research/building-knowledge-bases/extractions/*.md`，以及 scratchpad `fulltext/` 裡的全文。抽取紀錄沒有涵蓋的地方另外補讀了三份：
- Bergman et al. 2013 JASIST 預印本（`is.biu.ac.il/files/is/Folders vs Tags - Preprint version.pdf`，用 exa web_fetch 讀到摘要和引言）
- Forte〈Building a Second Brain〉basboverview 全文（exa web_fetch）
- Notion releases 頁搜尋（exa web_search）

機器檢查：兩篇中文版跑過 `check-process-leak`、`check:tw`、`register-scan`、`scan-ledger`，都沒有 blocking。各有一處模板化轉折，不改也可以。

---

## 必修

### M1．order 2「標籤也不是比較差」漏掉了同一批研究的反證（中英都有）

- 原句（zh 51 行）：「標籤也不是比較差。Civan 等人 2008 年讓 10 個人分別用資料夾和標籤整理文章五天，之後找回的速度沒有差別」
- 原句（en 51 行）："Tags aren't worse, either. Civan and colleagues had 10 people…"
- 問題：上一段引的 Bergman 團隊研究，JASIST 原文摘要寫著 "The controlled retrieval task showed lower success rates and slower retrieval speeds for tag use."。姊妹篇 ASIS&T 2013 也轉述了這個結果："retrievals with tags resulted in more failures to reach the target file and were significantly slower."（`bergman-2013-jasist-folder-vs-tag.md` 結果 3）。所以「標籤不比較差」只靠 n = 10、五天、找回測驗在七天內的 Civan 2008，卻壓過了用受試者自己檔案做的控制作業。兩者合起來，證據應該是互相矛盾的。Bergman 姊妹篇 Table 1 整理 8 篇實驗，結論也是 "mixed results"。這屬於 🔵 Misframed。
- 改法（zh）：「標籤也不是一定比較差。Bergman 那兩個研究的控制作業裡，用標籤找自己的檔案失敗較多、也較慢；但 Civan 等人 2008 年讓 10 個人分別用資料夾和標籤整理文章五天，之後找回的速度沒有差別。差別比較在取捨：⋯⋯」（後面接原文）
- 改法（en）："Tags aren't necessarily worse, though. In Bergman's controlled task, retrieving one's own files by tag failed more often and was slower; but when Civan and colleagues had 10 people… they found no difference in re-finding speed. The real difference lies in the trade-offs: …"
- 附帶修正：同一段的「Bergman 團隊 2013 年有兩篇研究，一篇在 Gmail、一篇在 Windows 7」⋯⋯「同一團隊的另一篇論文整理了結果」，會讓人以為那是兩篇論文。實際上是一篇 JASIST 論文（DOI 10.1002/asi.22906）裡的兩個研究，同團隊的 ASIS&T 2013 再轉述。建議改成「Bergman 團隊 2013 年的一篇論文做了兩個研究⋯⋯同團隊同年另一篇論文轉述了數字」，並在參考資料補 JASIST 那篇（預印本可讀）。英文同樣把 "ran two studies in 2013 … A companion paper" 改成 "a 2013 paper reported two studies … a companion paper by the same team restates the figures"。
- 依據：`bergman-2013-jasist-folder-vs-tag.md` 結果 1、3、6；JASIST 預印本摘要（本次讀取）；`civan-2008-folders-vs-tags.md`「與常見轉述不一致處」第 2 點。

### M2．order 2「一個 category 可以放到上百個 ID」超出上限，而且中英不一致

- 原句（zh 84 行）：「所以一個 category 可以放到上百個 ID 而不必拆」
- 原句（en 84 行）："That's why a category can hold up to a hundred IDs without being split"
- 問題：同篇 80 行自己寫「每個 category 最多 100 個」，再加上 standard zeros 把 `.00–.09` 保留給系統，一般內容從 `.11` 起，實際能放的不到 90 個。中文「上百個」是一百以上，和上限矛盾；英文 "up to a hundred" 是對的。
- 改法（zh）：「所以一個 category 可以放到近百個 ID 而不必拆」
- 依據：`johnny-decimal.md`「上限」「Standard zeros」；`fulltext/jd-the-standard-zeros.txt`（"IDs at `.11` rather than `.00` or `.01`"）。

### M3．order 3「雙向都記」寫成 Luhmann 一律這樣做（中英都有）

- 原句（zh 40 行）：「**3. 卡片之間寫連結，雙向都記。** ⋯⋯而且 Luhmann 會在被連的那張卡上也記一筆回連。」
- 原句（en 40 行）："**3. Links between cards, recorded both ways.** … and Luhmann also noted a link back on the card being linked to."
- 問題：Luhmann 英譯的原意是建議：連結很多時要 "capture the connections radially … but at the same time also by right away recording back links in the slips that are being linked to"。檔案館描述的實物是遠距連結「häufiger」（常常）有回連，而且只講遠距連結，不是每一條。現在的寫法把建議和常見情況寫成了規則。140 行的「這省掉了 Luhmann 手寫回連的工夫」也是建在這個前提上，改完這裡仍然成立。
- 改法（zh）：「**3. 卡片之間寫連結，常常雙向記。** 因為號碼固定，任何一張卡都可以寫上「見某號」。Luhmann 建議連到別處時，順手在被連的那張卡上也記一筆回連；檔案館看到的遠距連結也常有回連。他說有了連結⋯⋯」
- 改法（en）："**3. Links between cards, often recorded both ways.** … Luhmann advised writing a link back on the card being linked to at the same time, and the archive finds that his long-distance links often carry one."
- 依據：`luhmann-slip-boxes.md`「連結」；`fulltext/luhmann-slipbox.txt`（radially 那句）；`fulltext/luhmann-archiv-nachlass-zk.txt` §3.5「Auf dem verwiesenen Zettel findet man häufiger auch einen Rückverweis」；`luhmann-archiv-zettelkasten.md`「與常見轉述不一致處：連結都是雙向」。

### M4．order 2 結尾丟給 order 3 的問題，order 3 從頭到尾沒有回答，而且示範例子落在 order 3 自己說「不需要這些」的範圍（讀者測試）

- 原句（order 2 zh 154 行）：「那「小川山的岩場筆記」呢？它既是攀岩技術（Resource），也和明年的旅行計畫（Project）有關。資料夾只能讓它住一個地方，這時就需要下一篇談的連結。」
- 原句（order 3 zh 19 行）：「這篇談的就是另一半：筆記和筆記之間怎麼連起來。⋯⋯用 PARA 的人，這類筆記通常住在 Resources」
- 原句（order 3 zh 146 行）：「如果你的筆記主要是待辦、會議紀錄、參考資料，order 2 的資料夾加搜尋就夠了，不必把每則都改寫成永久筆記。」
- 問題：小川山岩場筆記屬於參考資料，照 order 3 146 行的判準，它不需要永久筆記這套做法。可是 order 3 開頭拿它當動機，後面的例子卻換成 Bergman 論文，小川山再也沒出現。讀者會卡在兩件事：「那小川山到底要怎麼連？」以及「連結是不是只適用於想法筆記？」
- 改法（zh，二選一）：
  1. 在 order 3「什麼時候不需要這些」那段補兩句：「但『寫一條有理由的連結』不限於永久筆記。像小川山的岩場筆記，留在 Resources 就好，在明年的旅行專案裡加一行『連到〈小川山岩場筆記〉：這次要爬的路線在這裡』，它就同時出現在兩個地方。要不要改寫成永久筆記，看它是不是一個你自己的想法。」
  2. 或者把 order 3 開頭第 19 行改成先回答小川山（一行有理由的連結），再接「但連結真正能幫你想出新東西，是在想法筆記上」，然後進入本文。
- 英文同步：order 3 en 第 19 行與 146 行的對應位置。
- 依據：order 2 第 154 行；order 3 第 19、146 行；寫作規範〈長文〉第 3 條「每個該做的事都要有做得出來的動作」。

---

## 建議

### S1．order 2：Bergman 2010 的層數時間只講了一半，和下一段的回歸結果打架

- 原句（zh 37、43 行）：「2 到 6 層之間差不多，大約 16 到 19 秒；到了 7 層以上，才明顯變慢到 25 秒左右」／「兩三層、四五層差別不大，真正變慢的是很深的樹。」
- 問題：數字本身沒錯（Table 3：2 層 15.78、6 層 18.92、7 層 24.76、8–11 層 25.22 秒）。但同一張表裡，桌面 5.6 秒、1 層 11.65 秒，0 到 2 層之間差了約 10 秒，作者也說主要差距在桌面、第 1 層和 7 層以上。下一段的回歸又說「每多一層 2.236 秒」。讀者看到「2–6 層差不多」再看到「多一層等於多 21 項」，會覺得自相矛盾。
- 改法（zh 37 行補一句）：「最快的是放在桌面或第一層（約 6 到 12 秒）；2 到 6 層之間差不多，大約 16 到 19 秒；7 層以上才又明顯變慢，到 25 秒左右。」43 行改成：「**別讓結構深到七層以上。** 二到六層之間差別不大；常用的東西放淺一點，最快。」
- 依據：`bergman-2010-folder-structure.md` 結果 4 與「與常見轉述不一致處」第 5 點。

### S2．order 2：「一般人的資料夾大多已經在這條線附近」說反了方向

- 原句（zh 39 行）：「受試者的資料夾平均本來就有 22 項左右，中位數 15 項，也就是說，一般人的資料夾大多已經在這條線附近。」
- 問題：中位數 15 代表一半以上的資料夾低於 21；原文 p.30 也寫約 67% 的資料夾在 21 項以內。平均值被少數大資料夾拉高。
- 改法：「受試者的資料夾平均約 22 項，但中位數只有 15 項：多數資料夾在這條線以下，是少數特別大的資料夾把平均拉高。要拆的通常就是那幾個。」英文同步改。
- 依據：`bergman-2010-folder-structure.md` 結果 1、「與常見轉述不一致處」第 3 點（67.3%）。

### S3．order 2：「研究的限制」把 2008 年的樣本講錯

- 原句（zh 130 行）：「多半是 2000 年代後期收集的 Windows 和 Mac 資料，受試者多是大學生和職員，而且只測最近用過的檔案」
- 問題：2008 年的 714 人裡有 589 人是美英澳 Mac 使用者社團的成員，Spotlight 組平均 58 歲，不是大學生。2008 年用的是自評全部取回的比例，不是「最近用過的檔案」。只有 2010 年和 2024 年是測最近用過的檔案。
- 改法：「受試者多是大學生、職員和 Mac 使用者社團成員；實測的研究只找最近用過的檔案，很久沒開的舊檔沒測。」英文同步改。
- 依據：`bergman-2008-tois-navigation-preference.md`「研究設計」；`bergman-2010-folder-structure.md`；`bergman-dvir-2024-hypersearching.md`。

### S4．order 2：Bergman & Dvir 的 email 數字是對照組的

- 原句（zh 31 行）：「Bergman 和 Dvir 的受試者也一樣：自己估計找 email 有四成多靠搜尋，找檔案不到一成。」
- 問題：43% 和 7% 是對照組。超級搜尋者那組是 email 53%、檔案 67%（實測）。現在的寫法讀起來像全體受試者。
- 改法：「Bergman 和 Dvir 研究裡的一般使用者（對照組）也一樣：⋯⋯」英文改成 "the control group in Bergman and Dvir's study…"。
- 依據：`fulltext/bergman-dvir-2024-hypersearching.txt` 第 617–624、783–784 行。

### S5．order 2：Notion 那段的歸屬與時效

- 原句（zh 53 行）：「Notion 這類工具沒有傳統的資料夾。依 Notion 說明中心的說法（2026 年 10 月），它用頁面裡放頁面取代資料夾，再用資料庫的屬性和不同的檢視方式，讓同一則頁面出現在好幾種分類裡」
- 問題：
  1. 第一句沒有歸屬，等於直接斷言。抽取紀錄指出，Notion 自家 MCP 已經提供 `notion-create-folder`（本 session 的工具清單也看得到），產品端可能已經有 Folder 物件，只是說明中心和 releases 頁都還沒寫（本次搜 releases 也沒找到）。
  2. 「讓同一則頁面出現在好幾種分類裡」是作者整理，說明中心原文只說資料庫是「頁面的集合」，可以用屬性與檢視做 filter、sort、group。
- 改法：「Notion 的說明中心寫的是『There are no folders in Notion』：用頁面裡放頁面代替資料夾（2026 年 10 月）。要讓同一則頁面出現在好幾種分類裡，靠的是資料庫的屬性和檢視。」刪掉第一句的斷言。英文同步改。
- 依據：`notion-pages-databases.md` A、C 與「與常見轉述不一致處」第 1、3 點。

### S6．order 2：「怎麼選」第一列、tldr 與「今晚可以做的事」A 路線互相打架

- 原句：tldr「所以筆記值得分類」；表格第一列「筆記很少，或幾乎都靠搜尋也找得到 → 先不分類，收件匣加搜尋就好」；A 路線「筆記還不多，或樹還不亂。直接照新規則調整：1. 建一個收件匣和一個『專案』資料夾⋯⋯」
- 問題：「筆記很少」和「筆記還不多」是同一種讀者，卻拿到兩個相反的指示。而且 A 路線是 PARA 專用，表格選了 Johnny.Decimal 的人在「今晚可以做的事」找不到自己的路。
- 改法：
  1. A 路線第一行改成「筆記已經有一些、樹還不亂」，並在 A 前面加一句：「筆記還很少的，照表格第一列，先不分類。」
  2. A 第 1 步改成兩個版本：「用 PARA：建一個收件匣和一個『專案』資料夾⋯⋯；用 Johnny.Decimal：先在紙上列出不超過十個 area，每個 area 底下幾個 category，再建 `00.01` 收件匣。」
- 依據：寫作規範〈長文〉第 2、3 條；`johnny-decimal.md`「分類規則」（top-down／bottom-up）。

### S7．order 2：和 order 1 的 Forte 說法看起來衝突，要先說清楚

- 原句（order 2 zh 70 行）：「他也不建議排固定時間重新整理，而是『隨機會而做』」
- 對照（order 1 zh 56 行）：「Tiago Forte 說他每週清一次，一次處理 10 到 20 則」
- 問題：讀完兩篇的人會以為 Forte 前後矛盾。實際上前者是「重新整理已經歸好的東西」（Part 2, 2017），後者是「把收件匣的新東西歸檔」（basboverview 2023，本次讀過原文："I prefer to do this 'filing' in one batch about once a week"）。
- 改法（order 2 zh 70 行補半句）：「⋯⋯而是『隨機會而做』（每週清收件匣是處理新東西，不算重新整理）：已經在翻某個專案的筆記時，順手把放錯的移走。」英文同步改。
- 依據：`forte-para.md`「搬移時機」；basboverview 原文「Ask three questions」段。

### S8．order 2：沒有交代「過早歸檔」和「每則都要有一個家」的先後

- 對照：order 1 第 54 行「所以清收件匣時只做去留的決定，不急著分類」；order 2 第 55 行「每則筆記有一個主要的家」。
- 問題：讀者會問「那什麼時候分？」order 2 開頭說「這篇談收進來之後放哪裡」，但沒有點出「收進來」是指通過 order 1 三步判準、進了知識庫的那些。
- 改法（order 2 zh 21 行補一句）：「這裡說的『收進來』，是通過 order 1 三步判準、確定要留的東西；收件匣裡還沒決定的，先不分類。」英文同步改。
- 依據：order 1 第 54、58 行。

### S9．order 2：Johnny.Decimal 樹缺了 `00` category，也沒解釋為什麼從 `.11` 起

- 原句（zh 94–95 行）：「00-09 系統 └── 00.01 收件匣」；80 行「每個 category 最多 100 個」
- 問題：
  1. 其他 area 都是 area → category → ID 三層，唯獨 `00-09` 跳過了 category `00`。這和 82 行「東西只放在 ID 裡」的三層結構不一致。原文是 `00-09 System-management area └─ 00 System-management category └─ 00.01 Inbox for the system`。
  2. 讀者剛讀完「最多 100 個」，在樹裡看到所有 ID 都從 `.11` 起、收件匣卻是 `00.01`，會不知道為什麼。
- 改法：
  1. 樹改成「00-09 系統 │ └── 00 系統管理 │ └── 00.01 收件匣」，右欄對齊稍作調整。
  2. 樹下面補一句：「作者把每一層的 0 號保留給系統本身，例如 `00.01` 是整個系統的收件匣、`.00–.09` 是每個 category 的管理用號碼，所以一般內容從 area `10-19`、category `11`、ID `.11` 起。」英文同步改。
- 依據：`fulltext/jd-the-standard-zeros.txt`（Figure 62.21C、"What happened to 00-09?"）。

### S10．order 2：一段裡的數字太多

- 原句：49 行（三分之一、九成多、五週、23 人中 6 人、168 位、77%）；37–39 行（2.86、2、6、16、19、7、25、21、22、15）。
- 問題：寫作規範〈長文〉第 4 條「正文每個主張最多一個數字」。
- 改法：49 行留「三分之一」「23 人中 6 人」「77%」，「九成多只貼一個」改成「幾乎都只貼一個」，五週、168 位刪掉。37 行留 2.86 層和「7 層以上」兩個數字，秒數只留 25 秒對比。
- 依據：`.agents/skills/post/references/writing-guide.md`〈長文〉第 4 條。

### S11．order 3：「多數人的筆記只停在第一種」「這是最常被跳過的一點」「幾個月後你自己也看不懂」都沒有來源

- 原句（zh 30、56 行）：「多數人的筆記只停在第一種。」「這是最常被跳過的一點。」「只放一個連結、不寫理由，幾個月後你自己也看不懂為什麼連。」
- 問題：三句都寫成事實，但抽取紀錄裡沒有支持的資料。作者的建議應該寫成建議或作者判斷的語氣。
- 改法（擇一套用，全段只說一次）：
  - 30 行換成有來源的說法：「Matuschak 觀察到，現在用 Zettelkasten 的人，大多拿它記別人的想法。」（am-vs-zk："Most people in the contemporary Zettelkasten culture seem to use their systems primarily to write notes about others' ideas."）或者直接寫成作者主張：「我自己的筆記，大多也停在第一種。」
  - 56 行：「這一點我最常跳過。只放一個連結、不寫理由，幾個月後常常想不起為什麼連。」
- 依據：`matuschak-evergreen-notes.md`「與 Zettelkasten 的異同」最後一點；寫作規範「但書與歸因不堆疊」第 3 種修法。

### S12．order 3：「用 PARA 的人，這類筆記通常住在 Resources」要寫成建議

- 原句（zh 19 行）：「用 PARA 的人，這類筆記通常住在 Resources；用 Johnny.Decimal 的人，可以開一個專門放想法筆記的 category。」
- 問題：「通常」是在描述事實，但 Forte 沒有這樣說；後半句已經是建議語氣，前後不一致。
- 改法：「用 PARA 的人，可以把這類筆記放在 Resources；用 Johnny.Decimal 的人，可以開一個專門放想法筆記的 category。」英文 "usually live in Resources" 改成 "can live in Resources"。
- 依據：`forte-para.md`（沒有對想法筆記放哪裡的主張）。

### S13．order 3：Matuschak「寫不出來」那段放錯論點

- 原句（zh 148 行）：「這套做法也很花時間。Matuschak 自己承認，寫筆記時如果一心想寫成可以發表的樣子，他常常一個字都寫不出來，所以他主張預設寫給自己看。」
- 問題：轉述本身正確（am-foryourself："Then I often find that I can't write anything at all!"），但原文講的是「寫給讀者看會卡住」，不是「這套做法花時間」。放在「花時間」底下，等於替來源加了它沒有的主張。
- 改法：「這套做法也很花時間，所以別一開始就要求寫得漂亮。Matuschak 說，他寫筆記時如果一心想寫成可以發表的樣子，常常一個字都寫不出來，所以他主張預設寫給自己看。」英文同步改。
- 依據：`fulltext/am-foryourself.txt` 第 6、8 行；寫作規範〈長文〉第 7 條。

### S14．order 3：Ferreira 2025 的轉述用錯重點，也把作者詮釋寫成發現

- 原句（zh 136 行）：「2025 年一項訪談 7 位用 Obsidian 的研究者的研究則發現，他們怎麼建筆記，取決於他們打算之後怎麼找」
- 問題：「取回策略影響建立方式」是作者的詮釋，方向沒有檢驗過。對 order 3 來說，這篇真正相關的是：7 位受訪者日常主要靠資料夾、標籤和搜尋，幾乎沒有人描述自己怎麼建立筆記間的連結，全文也沒有出現 MOC。
- 改法：「2025 年一項訪談 7 位 Obsidian 使用者的研究裡，受訪者日常靠的是資料夾、標籤和搜尋，幾乎沒有人談到自己怎麼在筆記之間建立連結（Ferreira et al. 2025）。」英文同步改。
- 依據：`ferreira-2025-second-brains-obsidian.md`「與摘要或常見轉述不一致處」第 1、2、5 點。

### S15．order 3：「用自己的話寫」缺一條和筆記直接相關的反證

- 原句（zh 132 行）：「『用自己的話寫』有間接支持。」
- 問題：研究段只有支持方向的生成效應。專案裡已經精讀過 Urry et al. 2021（Mueller & Oppenheimer 的直接複製，加上 8 篇小型統合分析）：上課做筆記、立即測驗的情境下，手寫優勢沒有複製；「筆記和原文重疊越少、成績越好」的相關也不穩健。這是和「做筆記」最接近的證據，應該寫進來，否則研究段只呈現單邊。
- 改法（132 行末補一句）：「直接測『做筆記時用自己的話』的研究反而不太支持：一項 2021 年的大型複製實驗，加上 8 篇類似研究的統合，都沒有找到用手寫、少抄原文就記得比較好的穩定證據（Urry et al. 2021）。」並在參考資料補 Urry 2021。英文同步改。
- 依據：`urry-2021-laptop-replication.md` 結果 2、4、6 與「對 order 3 的意義」；使用者記憶「研究何時算夠：反證」。

### S16．order 3：示範沒有做到 tldr 承諾的「互相連結」

- 原句（tldr）：「你能把一篇讀書摘要改寫成兩三則可以互相連結的筆記」；例子第三步只示範「第二則連到舊筆記」。
- 問題：兩則新寫的永久筆記之間沒有連結。讀者照做時，會不知道同一來源拆出來的筆記要不要互連。
- 改法：第三步加一行：「- 連到〈資料夾樹別深到七層以上〉：靠位置找的前提是樹不能太深，否則就算記得放哪也找得慢。」
- 依據：tldr 與第 104–111 行。

### S17．order 3：「先分清兩種筆記」沒交代術語來源，也沒接上 order 1 的「那句話」

- 原句（zh 25–30 行）：「這篇會用到兩個詞：文獻筆記⋯⋯永久筆記⋯⋯」
- 問題：
  1. 「文獻筆記／永久筆記」是 Ahrens《How to Take Smart Notes》推廣的說法。zettelkasten.de 入門文和 Matuschak 都沒有用這兩個詞，Matuschak 還刻意和 permanent notes 保持距離。規劃表也把 Ahrens 列為來源，但抽取紀錄裡沒有 Ahrens。
  2. order 1 第三步要求每則進知識庫的東西都有「一句自己的話」。讀者會問：那一句算文獻筆記還是永久筆記？
- 改法：
  1. 用 Luhmann 檔案館的紀錄撐住這組區分，不必另找 Ahrens：「Luhmann 自己也是先把閱讀筆記寫在書目卡背面，之後才寫成正式的卡片。」（`luhmann-archiv-zettelkasten.md`「例子：閱讀流程」）
  2. 30 行後補一句：「order 1 說的『一句自己的話』是起點，它還掛在原文底下；把它拿出來單獨寫成一則、脫離原文也讀得懂，就是永久筆記。」英文同步改。
- 依據：`matuschak-evergreen-notes.md`「與常見轉述不一致處」第 2 點；order 1 第 72 行。

---

## 可選

### O1．order 2：PARA 例子的資料夾名前後不一

「小川山的岩場筆記」移到 Resources 的「攀岩」底下（72 行），樹裡卻叫「攀岩技術」（102 行）。統一成「攀岩技術」，英文 "Climbing" 也一起改成 "Climbing technique"。

### O2．order 2：`15.52` 和 `31.14` 暗示前面還有很多 ID

Johnny.Decimal 的 ID 依建立順序編號（"recent things have higher numbers"）。在這棵「只有幾樣東西」的樹裡，第二個旅行 ID 照理是 `15.12`。如果想保留 `15.52`（照用作者的例子），可以在 90 行加「假設你已經用了一陣子」。依據：`johnny-decimal.md`「ID」。

### O3．order 2：PARA 的 Areas 和 Johnny.Decimal 的 area 同名

讀者容易把兩者混在一起。可以在 Johnny.Decimal 小節第一次出現 area 時加半句：「（和 PARA 的 Areas 不是同一個意思，這裡只是最上層的大分類）」。

### O4．order 2：B 路線可以補 Johnny.Decimal 版本

Johnny.Decimal 的 standard zeros 頁建議：先設計好 category，每個建一個 `.01` 收件匣，把舊東西整批移進去，之後再慢慢整理。可以當 B 的第二種做法，一行就夠。依據：`fulltext/jd-the-standard-zeros.txt`「.01 Inbox」。

### O5．order 3：匯總卡「一張列了最多 25 個連結」的語意

原文是「Auf einem solchen Zettel können bis zu 25 Verweise aufgeführt werden」，意思是這類卡片每張最多可以列 25 個，不是「其中一張列了最多」。中文改成「這類卡片一張最多可列 25 個連結」。zettelkasten.de 原文追溯的是「hub notes」，可以照寫「zettelkasten.de 也把 structure note 追溯到 Luhmann 的 hub notes」。

### O6．order 3：Luhmann「前幾年只是容器」講了兩次

第 44 行和第 148 行重複。148 行可以刪掉最後一句。

### O7．order 3：「Matuschak 還主張連結要多」的連結指錯頁

現在連到 associative ontologies 頁。主張「連結要多」的是〈Evergreen notes should be densely linked〉（`https://notes.andymatuschak.org/zF8xCU4BwXwbmSyp7tmff9i`，抽取紀錄已讀）。建議前半句連這頁、後半句「讓結構自己長出來」維持原連結，並在參考資料補上。

### O8．order 3：「最常被引用」沒有依據

第 48 行「zettelkasten.de 的入門文和 Andy Matuschak 的 Evergreen notes 最常被引用」改成「是兩份常被引用的整理」，或直接刪掉「最常被引用」。

### O9．order 3：第 136 行可以少寫一點過程

「我搜尋了 2024 到 2026 年的英文文獻，沒有找到⋯⋯」可以改成「2024 到 2026 年的英文文獻裡，沒有拿 Zettelkasten⋯⋯比較的可信實驗」。讀者需要的是結果和範圍，不是搜尋動作。

### O10．英文自然度

- order 2 en 49 行 "The research answer is that people think tags are a good idea but rarely use them." → "Research suggests people like the idea of tags but rarely use them."
- order 2 en 37 行 "Bergman's 2010 data also shows what folders should look like." → "Bergman's 2010 data also hints at what a workable folder looks like."（中文「也說明了資料夾該長什麼樣子」同理，可改成「也看得出資料夾大概該長什麼樣子」）。
- order 3 en 56 行 "A bare link with no reason is something you yourself won't understand a few months later." → "Months later, even you won't remember why a bare link is there."（若採用 S11，改成 "I often can't remember…"）。
- order 2 en 114 行 "moves house" 是英式口語，可以保留；若想中性一點，改成 "gets moved"。

---

## 查證結果摘要（照 post-verify）

| 範圍 | 結果 |
|---|---|
| order 2 Bergman 2008／2010／Dvir 2024 的數字（296 人、94%、約 15 秒、七百多人、56–68% vs ≤15%、7 個月、三分之一移除、四分之一上限、8%、2.86 層、16–19 秒、25 秒、21 項、22／15） | 🟢 全部對得上抽取紀錄與全文；S1、S2、S4 是框架問題 |
| order 2 Whittaker 2011（六成捲動、一成多資料夾） | 🟢（62%／12%） |
| order 2 Bergman 2013（三分之一、九成多、23 人中 6 人、168 人、77%、1 對 1 好記） | 🟢 數字都來自姊妹篇轉述，正文已標「另一篇論文整理」；🔵 「標籤不比較差」見 M1 |
| order 2 Civan 2008（10 人、五天、找回速度沒差、選資料夾較費心、標籤重疊無法逐一翻、兩者都要一點） | 🟢 |
| order 2 Notion | 🟢 引句正確；S5 處理歸屬與時效 |
| order 2 PARA 定義、Area／Resource 判準、動態、隨機會而做、四層與作者自承、搜尋當後備 | 🟢 |
| order 2 B 路線（整包移進標日期的封存資料夾） | 🟢 basboverview 原文 "Move all existing files to a folder titled Archive with today's date."；「用到再搬」對應 "Whenever you need a file, you can always pull it out" |
| order 2 Johnny.Decimal 結構、三個理由、兩句英文引文、索引、塞不進的例子 | 🟢；M2 數量、S9 standard zeros |
| order 2 Ferreira、Dinneen & Frissen | 🟢 |
| order 3 Luhmann（9 萬張、1952–1997 初、1981 年文章、57/12a1、十幾碼、四萬多條連結、4 個位置、108／11 區、臨界量） | 🟢；M3 雙向 |
| order 3 zettelkasten.de（自己的話、link context、structure note、某種階層有用、50 本書 600 篇、工作狂註腳） | 🟢 |
| order 3 Matuschak（atomic、沒有一刀切標準、concept-oriented 不會累積、讓結構自己長、寫給自己） | 🟢；S13 框架 |
| order 3 LYT（不只是目錄、Mental Squeeze Point、gather／collide／navigate、非線性） | 🟢 |
| order 3 Bertsch（86 篇、約 9 個百分點）、McCurdy（126 篇、校正出版偏誤後仍在、寫／打字較小）、無意義材料接近零 | 🟢 |
| order 3 DeStefano（數量不一致、五篇中四篇變慢、標示目的地有幫助）、Madrid（3 vs 8、多出來的隨機、負荷與學習無差） | 🟢 |
| order 3 Malashenko（條件差太多、表格對不上）、Alford & Mendes（自評信心↑、時間無差） | 🟢 |
| order 3 例子裡的文獻筆記與兩則永久筆記 | 🟢 忠於 Bergman 2010／2008、Whittaker 2011；S16 補互連 |
| 歸因標籤 | 兩篇各 1–2 處「我認為／我找不到」，沒有超過 3 處 |

---

## 分數

| 篇 | 分數 | 理由 |
|---|---|---|
| order 2 中文 | 7／10 | 研究整理紮實，數字幾乎都對；扣分在 M1（標籤段漏反證）、M2（上百個），以及 S6 的分支互相打架、A 路線只顧 PARA |
| order 2 英文 | 7.5／10 | 自然、忠實，100 這處反而比中文對；M1 同樣存在，"Tags aren't worse, either" 讀起來生硬 |
| order 3 中文 | 8／10 | 結構清楚、例子能照做、研究段誠實；扣分在 M3 雙向連結過度概括、M4 小川山沒收尾、研究段缺 Urry 反證 |
| order 3 英文 | 8／10 | 與中文一致，語氣自然；問題與中文相同 |

## 必修清單（回報用）

1. M1 order 2 標籤段：補 Bergman 控制作業「標籤找回較慢、失敗較多」，「標籤也不是比較差」改成「不一定比較差」；「兩篇研究」改成「一篇論文裡的兩個研究」（中英）。
2. M2 order 2「上百個 ID」改成「近百個」（中文；英文已正確）。
3. M3 order 3「雙向都記」改成 Luhmann 的建議加檔案館的「常常有回連」（中英）。
4. M4 order 3 回答 order 2 留下的小川山問題：說明參考類筆記也可以靠一行有理由的連結解決，永久筆記只用在想法筆記（中英）。

## 修正紀錄（2026-10-22，寫作者依本審稿修改，中英同步）

- 必修 1：order 2 改為「用標籤找，結果有好有壞」，補 Bergman 2013 JASIST 摘要的「控制任務中標籤成功率較低、較慢」並列 Civan 2008；「兩篇研究」改「一篇論文裡兩項研究」；參考資料補 JASIST。
- 必修 2：「上百個 ID」改「近百個」，並說明 `.00–.09` 保留、一般內容從 `.11` 起。
- 必修 3：Luhmann 改「常常雙向都記」，依原文與檔案館措辭。
- 必修 4：order 3 開頭補小川山筆記的解法：參考資料不必改寫成永久筆記，留在原處，從旅行筆記連一條寫了理由的連結。
- 建議採納：A 路線拆成 PARA／Johnny.Decimal 兩條並補「筆記很少只建收件匣」；PARA 段說明每週清收件匣與反對排時間重整不衝突；Bergman 2010 補桌面與第一層時間、中位數 15 改為「一半不到 15 項、平均被少數大資料夾拉高」；限制段補 2008 年 Mac 社團年長受試者；Johnny.Decimal 樹補 `00 系統` 層；order 3 補 Urry 2021 一句反證；「多數人」「最常被跳過」改為作者語氣；PARA「通常」改「可以」；Matuschak 改放在「想寫得太完美會卡住」；Ferreira 改為受訪者幾乎沒談連結。
- 未採納：其餘可選項（篇幅）。
