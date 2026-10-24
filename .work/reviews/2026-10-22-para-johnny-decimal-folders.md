# 審稿：知識庫怎麼建 order 2「放哪裡：PARA、Johnny.Decimal，與到底要不要分資料夾」（中英）

- 審稿日期：2026-10-22
- 審稿者：獨立審稿員（沒參與寫作）
- 範圍：`src/content/posts/learning/2026-10-22-para-johnny-decimal-folders.md`（zh，以下 L＝行號）、`-en.md`（EN）
- 證據：`.work/research/building-knowledge-bases/extractions/` 的 bergman-2008、bergman-2010、bergman-dvir-2024、whittaker-2011、forte-para、johnny-decimal、dinneen-frissen-2020、najork-2024；需要逐字或頁內脈絡時回 scratchpad `fulltext/` 原文（bergman-2008-tois.txt、bergman2010-folder.txt、bergman-dvir-2024-hypersearching.txt、para-2017-every.txt、para-part2-every.txt、para.txt、jd-*.txt）。Forte〈Building a Second Brain〉用 `mcp__exa__web_fetch_exa` 讀全文（2026-10-22，頁面標 UPDATED 2023-11-23）。
- 沒改文章。

嚴重度：🔴 必修（事實錯、出處錯、會誤導）／🟡 建議修／🟢 可選。

---

## post-verify

### 🔴 Contradicted

**V1　2008 研究的人數「六百多位」**
- 原句（zh L23）：「2008 年的研究問了六百多位 Windows 和 Mac 使用者，自評的找回方式裡，點資料夾佔 56% 到 68%……」；EN L23「surveyed more than 600 Windows and Mac users」。
- 問題：56–68% 這個範圍來自六個條件，包含 Preliminary study 的 78 人。三個研究合計 78＋47＋589＝714 人。EN 的「more than 600」字面上沒錯，但會讓讀者以為大約六百。
- 改法：zh「七百多位」或「714 位」；EN「more than 700」。
- 依據：bergman-2008 抽取紀錄〈研究設計〉；全文 Table III。

**V2　「PARA 每層 no more than four levels deep」，把深度寫成每層的寬度**
- 原句（zh L112）：「Forte 說 PARA 每層「no more than four levels deep」，Johnny.Decimal 每層不超過十個」。
- 問題：Forte 的原句是整體「four categories wide」而且「no more than four levels deep」。「four levels deep」講的是總深度，不是每一層的上限。zh 寫成「每層」，意思錯了。EN L112 寫「should be "no more than four levels deep"」，是對的。
- 改法：「Forte 說 PARA 最多四層深（"no more than four levels deep"），Johnny.Decimal 則是每層不超過十個」。
- 依據：para-2017-every.txt 第 177 行。

**V3　Johnny.Decimal 的引文掛錯頁**
- 原句（zh L72、L74、L76；EN 同段）：「Creating a new category should be something that takes time.」「The index is your Johnny.Decimal system.」，以及學生、老師、接案者塞不進去的例子。
- 問題：全文只連到 Introduction（L66），參考資料也只列 Introduction。三項內容的出處分別是：
  - 「takes time」在 philosophy 頁（jd-philosophy.txt 第 28 行）；
  - 「The index *is* your…」在 the-jdex 頁（jd-the-jdex.txt 第 6、14 行）；
  - 學生、老師、接案者的例子在 expand-an-area-overview 頁（第 16–20 行）。

  讀者點 Introduction 找不到這幾句。「no more than 10」和「數字比字母穩定」兩項確實在 Introduction（jd-intro.txt 第 169、175 行），不用動。
- 改法：在三句所在的位置各加 inline link：`https://johnnydecimal.com/documentation/philosophy`、`/documentation/the-jdex`、`/documentation/expand-an-area-overview`。參考資料補這三頁。
- 依據：johnny-decimal 抽取紀錄〈來源與讀取版本〉；以上各檔。

### 🔵 Misframed（數字對，框架錯）

**V4　「平均約 12 個檔案」拿去和「21 項」比，單位不同**
- 原句（zh L35）：「目標檔平均只在 2.86 層深的地方，一個資料夾平均約 12 個檔案……一個資料夾超過約 21 項（檔案加子資料夾），就值得再開一層」；EN L35 同。
- 問題：11.82 只算檔案。21 項的門檻算的是檔案加子資料夾，同一份資料用這個算法，每個資料夾平均是 22.46 項（中位數 15）。讀者看到 12 對 21，會以為一般人的資料夾離門檻很遠；其實平均值已經在門檻上，是中位數低於門檻。
- 改法：「一個資料夾平均約 22 項（檔案和子資料夾大約各半，中位數 15）」，或保留 12 個檔案並補「加上子資料夾約 22 項」。tldr 不受影響。
- 依據：bergman-2010 抽取紀錄結果 1（p.14）；原文摘要。

**V5　「超過三、四層，時間一層層加上去」：資料是 2 到 6 層持平**
- 原句（zh L39）：「建資料夾，但不要超過三、四層。超過了，找起來的時間會一層層加上去。」；EN L39「Beyond that, each level adds to the time」。tldr「每多一層，找檔平均多花約 2 秒」。
- 問題：每層 2.2 秒是回歸的線性係數（R²＝0.22）。Table 3 的實際平均是：桌面 5.6 秒、1 層 11.65 秒，2 到 6 層落在 15.78–18.92 秒、幾乎沒變，7 層以上才升到約 25 秒。作者自己說 4、5 層的平坦是觀察誤差。所以「超過三、四層才開始一層層加」和資料的形狀對不上。三、四層這個上限也不是研究結論：研究只描述了 82% 的目標檔在 4 層以內。
- 改法：二選一。
  1. 縮回來源原意：「研究裡多數人的檔案都在四層以內（82%）。照回歸估計每多一層約多 2 秒，實際上是從桌面到第一層、以及七層以上差最多。」
  2. 寫成作者主張：「我會把上限訂在三、四層。這是參考研究裡多數人的實際深度和 Forte 的四層原則，研究沒有比較過哪個深度最好。」

  tldr 的「每多一層約 2 秒」可以留，但正文要有一句說明這是回歸平均。
- 依據：bergman-2010 抽取紀錄結果 4、〈與常見轉述不一致處〉第 5 點。

**V6　Forte 的「四層」把 app 和筆記本身都算進去**
- 原句（zh L101「兩者都只有三、四層，都符合上面研究說的『淺』」、L112；EN 同）。
- 問題：Forte 舉的四層是「application > stacks > notebooks > notes」，最外面的 app 和最裡面的筆記都算一層。換成資料夾，大約只有兩層。把它和 Bergman 的「資料夾深度」放在一起比，量的不是同一件事。
- 改法：在 L112 補半句：「Forte 的四層連 app 和筆記本身都算進去，換成資料夾其實只有兩層左右。」
- 依據：para-2017-every.txt 第 177 行。

**V7　Google Desktop 的結果被壓成「回到原本水準」**
- 原句（zh L25）：「搜尋比例三週後短暫上升，七個月後又回到原本的水準」；EN L25 同。
- 問題：三週後搜尋比例是翻倍（7%→15.5%，顯著）。七個月後的 10% 和基線沒有顯著差異，但這時 43 人裡已經有 16 人（37%）移除 Google Desktop。還在用的 27 人是 14.5%，仍然顯著高於基線。「又回到原本的水準」是把移除的人和沒移除的人平均在一起的結果。
- 改法：「三週後搜尋比例翻倍；七個月後整體又降回和原本差不多，但當中有三分之一的人已經把 Google Desktop 移除了，留下來用的人搜尋得仍然比較多。導覽還是佔大多數。」
- 依據：bergman-2008 抽取紀錄結果 2、不一致處第 4 點。

**V8　Bergman & Dvir 的 email 43% 和檔案 7% 是自評，而且是對照組**
- 原句（zh L29）：「一般受試者找 email 時有 43% 用搜尋，找檔案只有 7%」；EN「ordinary participants used search for 43%…」。
- 問題：這兩個數字都是問卷自評（全文 §5.8 說「asked to estimate」，§6.7.2 說「average estimated e-mail search percentage」）。同一篇的實測檔案搜尋是 5%。「一般受試者」是排除了 hyper-searcher 的隨機對照組。L23 談 2008 時有標「自評」，這裡沒標，前後不一致。
- 改法：「同一篇研究的對照組自評，找 email 有 43% 用搜尋，找檔案只有 7%。」
- 依據：bergman-dvir-2024-hypersearching.txt 第 615–622、780–786 行。

### 🟡 Unverifiable／超出來源（建議修）

**V9　「勤於歸檔的人和不歸檔的人」**
- 原句（zh L29「勤於歸檔的人和不歸檔的人，找到信的比例一樣是 88%」；EN「Diligent filers and non-filers」）。
- 問題：比較的是用中位數切成的 high filers 和 low filers，低的那組也有歸檔。另外，88% 是代理指標：打開一封信超過 29 秒或接著回覆，就算找到。
- 改法：zh「歸檔多的人和歸檔少的人」；EN「heavy filers and light filers」。
- 依據：whittaker-2011 抽取紀錄〈研究設計〉、不一致處第 9 點。

**V10　「85,000 次找信的紀錄」**
- 原句（zh L29「超過 85,000 次找信的紀錄」）。
- 問題：原文是「refinding actions」，指捲動、搜尋、開資料夾這類單一動作，不是找信的次數。找信的序列每人平均約 62 串，合計約 2 萬多串。EN 寫「re-finding actions」，是對的。
- 改法：「超過 85,000 次找信動作」。
- 依據：whittaker-2011 抽取紀錄結果 1、2。

**V11　「這群人是例外，而他們的理由反而證明了規則」**
- 原句（zh L27）。
- 問題：原文是「their reasons for doing so only strengthen the rule」，意思是「強化」，不是「證明」。EN 寫「only strengthen it」，是對的。
- 改法：「他們的理由反而讓這條規則更站得住」。
- 依據：bergman-dvir-2024-hypersearching.txt 第 814 行。

**V12　「忘記位置的情況大約只佔四分之一」**
- 原句（zh L25；EN「roughly a quarter of cases」）。
- 問題：各組實際是 10–26%，作者說約 25% 是搜尋成長的「上限」。
- 改法：zh「最多約四分之一」；EN「at most about a quarter」。
- 依據：bergman-2008 結果 3（§6.1 原句）。

**V13　「Bergman 和合作者從 2008 年起一再研究這件事」**
- 原句（zh L23；EN「since 2008」）。
- 問題：Bergman 的 PIM 研究從 2003 年就開始（2008 文獻列有 Bergman et al. 2003、2006）。另外，2008 那篇發表時，Bergman 的署名是 Sheffield University，不是 Bar-Ilan。
- 改法：「Bergman（現任教於以色列 Bar-Ilan 大學）和合作者多年來一再研究這件事」。
- 依據：bergman-2008-tois.txt 第 1–12、1148–1155 行；bergman2010-folder.txt 第 7 行。

**V14　研究年代寫成「2008 到 2010 年的 Windows 和 Mac」**
- 原句（zh L116；EN「between 2008 and 2010」）。
- 問題：2008 和 2010 是發表年。2008 那篇的資料來自 2005–2007 年的桌面搜尋，2010 那篇的受試者多是英國 Sheffield 的大學生，平均 26 歲。
- 改法：「主要是 2000 年代後期的 Windows 和 Mac，2010 年那篇的受試者多是英國大學生；2024 年那篇只收 Windows 筆電使用者」。
- 依據：bergman-2008 不一致處最後一點；bergman-2010 研究設計、不一致處最後一點；bergman-dvir 作者列限制 (b)。

**V15　「搜尋當備援」引的 Forte 原句，脈絡偏一點**
- 原句（zh L41、EN L41：「You always have search as a backup tool」）。
- 問題：這句在 Part 2 的脈絡是「在四類之間搬筆記不必追求精確，放錯了還有搜尋」，不是在講「忘了放哪再搜」，但方向相近。BASB overview 有一句更貼切的：「Remember that you can almost certainly find anything again using a simple search.」另外，這一句沒有 inline link。
- 改法：換成 BASB overview 那句，連到 `https://fortelabs.com/blog/basboverview/`；或保留原句，補連 Part 2。
- 依據：para-part2-every.txt 第 123 行；basboverview「Ask three questions」節。

### 🟢 Confirmed

- 2010：296 人、1,131 次有效取回、94% 成功、成功者平均 14.76 秒（約 15 秒），文中有限定是「成功的」，平均深度 2.86，回歸係數 2.236 秒和 0.106 秒、相除約 21，21 項含子資料夾，文中寫明這是經驗法則、不是最佳值，失敗或繞路時經過的資料夾較大（27.45、28.38 對 22.72）：都對（bergman-2010 結果 3、4）。
- 2008：導覽 56–68%、搜尋 4–15%、標明自評，Spotlight 481 人中 12 人變得比較不整理、12 人整理得更細，「In PIM, the same user both organizes and retrieves the information.」逐字相符（第 994 行）。
- Bergman & Dvir 2024：約 8%（保守估計）、導覽失敗多、資料夾比較亂：都對。
- Whittaker 2011：IBM Research，345 人，捲動 62%、搜尋 18%、資料夾 12%，開資料夾約 58.8 秒、搜尋和排序約 15 秒，88% 對 88%，歸檔多的人稍慢（72.87 對 66.07 秒，p < .05），歸檔和收信量、待辦管理有關：都對。
- PARA：定義出自 2017 原版，連結和標示都正確，現行頁沒有 deadline 和 standard 兩個關鍵詞。「This makes zero sense in your post-academic career.」出自現行頁，連到 fortelabs/blog/para，正確。Area 對 Resource 的判準句出自 Part 2，正確。「opportunistically, as opportunities arise」、不排固定時間重整、專案結束挑出來的東西少但價值高（「immense」）、Projects→Archives 最常見：都對。「Whether or not it's a real limit, it is a useful constraint」逐字相符（2017 版第 181 行，引到逗號前截斷，可接受）。
- 今晚第 4 步：BASB overview 原文是「Move all existing files to a folder titled Archive with today's date」以及「Whenever you need a file, you can always pull it out of your Archive folder」，相符。
- Johnny.Decimal：作者 Johnny Noble；area、category、ID 三層，各自上限 10、10、100；ID 格式兩位數、小數點、兩位數；只在 ID 存東西；「no more than 10」和「數字不會跑位、記得住位置」出自 Introduction；`15 Travel`、`15.52` 是作者自己的例子；同一個 ID 可以跨媒介。
- Dinneen & Frissen 2020：人格和空間能力的效果量小（R² < 0.074），作業系統的差異大。可以補一句：作業系統和檔案管理器的效果分不開，見抽取紀錄。
- 樹狀圖規則檢查：
  - JD 這邊，一般 ID 從 `.11` 起（11.11、12.11、21.11、22.11），category 避開 x0，area 從 10-19 起，東西只放在 ID 層，都符合作者規則。
  - PARA 這邊，Projects、Areas、Resources、Archives 四個頂層，專案沒有放在 Area 底下（作者在 Part 2 明確反對那樣放），符合規則。
- 自我檢查「Python」的判準，和 Part 2 的「responsible vs merely interested」以及 2017 版「standard to be maintained」一致。

### 例子查核

- L62 小川山（Ogawayama）是日本實際存在的岩場。「花十分鐘」是作者自訂的例子，不是 Forte 的數字，文中沒有掛在 Forte 名下，可以接受。
- L80 列的六樣東西和 L82–99 的兩棵樹對不太上。PARA 樹多了「旅行（出國裝備清單）」，這樣東西不在 L80 的清單裡，JD 樹也沒有。標題說「同一批檔案」，建議兩邊補齊，或從 PARA 樹拿掉（🟡）。

### 歸因標籤

全篇有「這是我的推論」（L31）、「這是作者從數字推出的建議」（L35）、「作者都沒有引用研究，是經驗值」（L112）、tldr「兩者都是作者的經驗」。正文三處，剛好在上限，`check-process-leak.mjs` 沒報錯。V5 如果改成作者主張，要同時刪掉一處舊的。

範圍聲明：本次只檢查了文中已提出的約 45 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。
下一步（未完成前不能 commit）：post-review、post-polish。

---

## post-review

### 機械檢查

- `pnpm check:tw`（zh）：0 blocking、0 review。
- `check-process-leak.mjs`：zh、EN 都通過。
- `register-scan` 和 `scan-ledger`：見 post-polish。
- `pnpm verify`：只有 `check:series-plan` 一項紅，原因是 order 2、order 3 都還沒有審稿紀錄。verify 是在本報告寫入之前開始跑的，本檔存檔後單獨重跑 `check-series-plan.mjs`，結果是「23 個受管系列的規劃表與審稿紀錄齊全」，已通過。其餘檢查全綠，包括 lang-parity。
- `pnpm check:links`：10 個外部連結沒有壞的。5 個 doi.org 回 403，是出版社擋機器人，需要人工確認，不是失效。

### 🔴 必修

**R1　inline 出處缺漏（8.5）**
- 有直接引文但當句沒有連結的位置：
  - zh L31 Bergman 2008 原句（2008 在 L23 有連結，但隔了一段，建議在引文處再連一次）；
  - L41 Forte「backup tool」；
  - L72 philosophy 頁那句、L74 the-jdex 頁那句、L76 expand-an-area 頁的內容（以上三項同 V3）；
  - L112 Forte 的「four levels deep」和「Whether or not…」，兩句都出自 2017 原版，當段沒有連結。
- 改法：在引文所在的句子加連結。EN 同步。

**R2　「每層」寫錯和「12 個檔案」的單位**：同 V2、V4，這兩項會直接影響讀者照做的判斷，所以在這裡也列成必修。

### 🟡 建議修

**R3　範圍卡列的反面證據沒有用到**
- 範圍卡的對應來源列了 Najork 2024 轉述的 Lansdale 1988：勤於歸檔不一定找得回，因為分類會重疊、模稜兩可。規劃表的 ④反證欄也列了「Najork 轉述的 Elsweiler」。正文完全沒提。
- 這一點正好是 PARA（用可行動性避開主題重疊）和 Johnny.Decimal（「you just decide」並記在索引裡）在處理的問題，放進來能把研究和方法接起來。
- 改法：在「研究怎麼說」或 PARA 節前加一兩句。例：「早期研究也發現，勤於歸檔不保證找得回，因為類別常常重疊，歸的時候和找的時候想到的不是同一格（[Najork 2024](…) 轉述 Lansdale 1988）。下面兩套方法，都是在處理『該放哪一格』這個問題。」
- 依據：najork-2024 抽取紀錄結果 3；規劃表 order 2 列。

**R4　筆記軟體「沒有同樣規模的研究」，但系列 order 3 已經引了一篇小研究**
- 原句：zh L31「筆記軟體本身還沒有同樣規模的研究」、L116「下一篇談連結時會再碰到這個缺口」。
- 問題：order 3（`2026-10-22-zettelkasten-evergreen-notes-moc.md` L69）引了 Ferreira et al. 2025：7 位 Obsidian 使用者日常主要靠資料夾、標籤和搜尋。這直接支持本篇 L31「筆記比較像檔案」的推論，卻只出現在下一篇。
- 改法：在 L31 補一句。例：「目前只有一項訪談 7 位 Obsidian 使用者的小研究，發現他們主要靠資料夾、標籤和搜尋（Ferreira et al. 2025）。」這樣 L31 的「我的推論」也有了一點旁證。L116 的「下一篇」改成連到 order 3 的連結（order 3 已經上線）。
- 依據：order 3 正文；ferreira-2025 抽取紀錄。

**R5　L19、L116 指到 order 3 但沒有連結**
- 原句：L19「筆記之間怎麼連結留給 order 3」、L116「下一篇談連結時」。
- 改法：order 3 檔案已經存在，加 `/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc`（EN 加 `-en`）。

**R6　「同一批檔案」的兩棵樹不對稱**：同例子查核，「出國裝備清單」只出現在 PARA 樹。

**R7　zh 樹狀圖右欄錯一格**
- 問題：zh L85、L87、L88、L89 的左欄顯示寬度是 35 格，其他行是 34 格（全形字算 2 格）。右邊的 Johnny.Decimal 樹在這四行會往右偏一格。EN 版對齊。
- 改法：這四行左欄各刪一個半形空白。
- 依據：用 `unicodedata.east_asian_width` 算寬度的結果。

**R8　「今晚可以做的事」第 1 步和研究方向相反**
- 原句：L120「超過四層，把中間只用來轉場的層級拿掉」。
- 問題：「轉場層」對應 Bergman 2010 的 corridor folders，但正文沒介紹過這個概念。Bergman 把它當成正常的結構（途經的資料夾 65% 是子資料夾），沒有建議拿掉。拿掉轉場層還會讓剩下的資料夾變大，和第 2 步「超過二十幾項就拆」互相拉扯。
- 改法：把判準寫出來。例：「一層裡只有一兩個子資料夾、自己沒放檔案的，可以併到上一層；併完超過二十幾項就不要併。」

**R9　type: guide 的結構**
- 問題：文章前半是研究導讀，後半是做法。guide 預期的「預期輸出／常見錯誤」沒有獨立段落；「怎麼選」和「今晚可以做的事」大致補上了。不必改 type。可以考慮在「今晚」各步驟後補一句做完會看到什麼，例如「最深的資料夾不超過四層、每個資料夾不超過二十幾項」。

### 對照範圍卡

- **講**：
  - PARA 依可行動性分四類和搬移時機 ✓；
  - Johnny.Decimal 每層不超過 10 個、用編號固定位置 ✓；
  - email（Whittaker 2011，兩組都 88%、資料夾在管待辦）✓；
  - 檔案（Bergman 2010，淺、小、越深越大越慢）✓，但「約 12 個檔」照抄範圍卡，有 V4 的問題，範圍卡本身也該改；
  - 導覽偏好至今仍成立：範圍卡寫 Bergman & Dvir 2026，正文用 2024 全文，2026 只讀到摘要，用 2024 是對的 ✓；
  - 結論「淺、小、搜尋與導覽並用」✓。
- **不講**：連結（order 3）✓，沒有越界。
- **讀完能**：判斷用容器分類、編號還是搜尋，有「怎麼選」表 ✓；重分一次，有「今晚」四步 ✓。
- **例子**：日本攀岩從 Project 到 Archive ✓；兩種樹 ✓。
- **自我檢查**：Python 放 Area 還是 Resource，附判準 ✓。
- **斷崖處理**：作者主張和研究分開寫 ✓；說明研究對象是 email 和檔案系統、不是筆記軟體 ✓（L31、L116）。
- **時效**：有 2024 年的來源 ✓。

### 其他各項

- frontmatter：必填欄位齊全，5 個 tags 都是 kebab-case，和 order 1、3 一致，para 和 johnny-decimal 是新 tag 但對題。tldr 和 description 不重複。
- tldr 強度：有具體數字和取捨，可以。tldr 的「每多一層約 2 秒」「超過二十幾項就該拆」和正文一致，但正文改了 V5 之後，tldr 要跟著檢查。tldr 寫「兩者都是作者的經驗」，但 21 項的拆分建議也是作者的經驗法則，tldr 的「就該拆」語氣比正文強，可以考慮改成「可以拆」（🟢）。
- 文體占比（zh 字元數）：研究兩節約 3,540（30%），方法兩節約 3,300（28%），兩棵樹 1,700（14%），選擇、限制、今晚、自我檢查約 2,270（19%），參考資料 12%。和 guide 承諾的「判斷＋重分」相符；研究段偏重，但範圍卡本來就要求。
- 圖表：兩棵樹用 text 區塊並排是合適的圖型。可選改用 `diagram` 並排兩棵樹，不必。
- 主題歸屬：站上沒有其他文章講 PARA 或 Johnny.Decimal，沒有重複。
- 參考資料：缺 JD 的 philosophy、the-jdex、expand-an-area 三頁（V3）。EN 版沒有中文資源，不需要標 (in Mandarin)。
- 通順與接縫：
  - L41 第一次出現「PARA 作者 Forte」，但 PARA 到 L47 才介紹，順序顛倒，EN 同。建議 L41 改成「下面會介紹的 PARA，作者 Forte 也這麼說」，或把這一點移到 PARA 節。
  - L101 寫「都符合上面研究說的『淺』」，但研究段沒有說過三、四層，見 V5、V6。

---

## post-polish

### 掃描結果（zh）

- 長句超過 60 字：9 句，占全部句子比例偏高，集中在研究段。
- 但書段落：14%（綠）。
- 引述區塊：0。
- 單段數字 4 個以上：3 段（L23 有 13 個、L29 有 10 個、L35 有 7 個）。
- 姓名當主詞：1 處。
- 模板化轉折：1 處（L27）。
- 一般英文術語：0。
- phrase ledger 沒有台灣用語高風險詞。`check:tw` 0 命中。

### 🟡 建議修

**P1　L25 一句 95 字**
- 原句：「同一篇研究追蹤裝了 Google Desktop 的 Windows 使用者，搜尋比例三週後短暫上升，七個月後又回到原本的水準；Mac 使用者換成更好的 Spotlight 之後，481 人裡只有 12 人……」
- 改法：Windows 和 Mac 拆成兩句，順便套 V7 的修正。例：「同一篇研究追蹤裝了 Google Desktop 的 Windows 使用者：三週後搜尋比例翻倍，七個月後整體又降回原本的水準。Mac 這邊，換成 Spotlight 的 481 人裡，只有 12 人說自己因此變得比較不整理，另有 12 人反而整理得更細。」

**P2　L23、L29 數字太密**
- L23 一段 13 個數字，L29 一段 10 個。正文每個主張留一個讀者會拿來做決定的數字就好。
- 改法：
  - L23 保留「94% 找到、約 15 秒」和「點資料夾五到七成、搜尋不到兩成」；296 人、1,131 次、56–68%、4–15% 等精確值可以移到括號，或留在 2008 那句裡就好。
  - L29 保留「捲動 62%、資料夾 12%」「兩組都 88%」；58.8 秒、15 秒可以縮成「開資料夾比搜尋慢好幾倍」。
- 不刪資料，只搬位置。

**P3　zh 正文有 10 段英文引文沒有中譯**
- 位置：L31、L41、L47、L58、L60、L72（兩句）、L74、L112（兩句）。
- 問題：英文引文和中文改述常常重複說同一件事（L58、L72），或直接整句英文、沒有翻譯（L41、L112「Whether or not…」）。讀起來像在讀英文文件的摘錄。order 1 一句英文引文都沒有，order 3 只有 2 處，同系列不一致。
- 改法：保留 2–3 句最有力的原文，其餘改成中文並附原文。
  - 建議保留：L31「In PIM…」、L74「The index is your…」、L112「Whether or not…」，三句都是作者自承或反直覺的判斷。
  - 其他句子的格式：中文意思加括號原文，例如「新增一個 category 應該要花點時間想（"Creating a new category should be something that takes time."）」；或只留中文加連結。
  - L72 已經有中文轉述，英文可以刪。
  - L112 補中譯：「不管這是不是真正的極限，它都是有用的限制」。

**P4　L47 一句 80 字，英文引文夾在中間**
- 原句：「它反對學校式的主題分類，例如「行銷」「心理學」「點子」，Forte 的話是「This makes zero sense in your post-academic career.」他主張依可行動性分類……」
- 改法：「它反對學校那套依科目分類的做法，例如「行銷」「心理學」「點子」。Forte 說，出了學校這樣分毫無道理。他主張依可行動性分類，也就是看這東西和你現在要完成的事有多近。」

**P5　L27 模板轉折**
- 原句：「但他們搜尋不是因為搜尋比較好用，而是資料夾比較亂」。
- 這是全篇唯一一處「不是 A 而是 B」，可以留。如果要改：「但原因出在資料夾：他們的資料夾比較亂，點資料夾找常常失敗。」

**P6　L101「差別一目了然」**
- 這是套語，而且接著又把差別解釋了一整段。
- 改法：刪掉，直接從「PARA 依『現在和你多近』分……」開始。

**P7　L112「研究能支持的只有方向：淺、小」**
- 語意沒問題。前一句「Forte 自己的說法是：「Whether…」」整句英文，接著就下結論，讀起來斷掉。套 P3 補中譯後就順了。

**P8　台灣讀者位置**
- 全球議題，沒有硬塞台灣案例的必要。開頭用「筆記越存越多」切入，讀者位置清楚，攀岩、報稅、健檢這些例子也貼近台灣讀者。不需要作者補。

### 🟡 EN 自然度

**E1　L19「and to reorganize your existing folders once」**
- 「once」讀起來像「只整理一次」。
- 改法：「and to do a first pass at reorganizing your existing folders」。

**E2　L47 括號夾引文**
- 原句：「…like "Marketing", "Psychology" or "Ideas" ("This makes zero sense in your post-academic career.") and sorts instead by…」
- 句中夾一個整句引文，很拗口。
- 改法：拆成兩句。「It rejects school-style subject folders like "Marketing," "Psychology" or "Ideas." As Forte puts it, "This makes zero sense in your post-academic career." PARA sorts instead by actionability…」

**E3　L112「they're rules of experience」**
- 不是自然的英文搭配。
- 改法：「they're rules of thumb」或「they come from experience」。

**E4　L27「In the authors' words, these people are an exception to the rule, and their reasons only strengthen it.」**
- 說「In the authors' words」卻沒有用引號，又不是逐字引用。
- 改法：直接引原句：As the authors put it, hyper-searching "is an exception to the rule," but "their reasons for doing so only strengthen the rule."

**E5　L101「the Japan trip moves house」**
- 英式慣用語，讀者看得懂，但和全文語氣不太一致。
- 改法：「the Japan trip folder gets moved once it's over」。

**E6　L120「the levels that only serve as corridors」**
- 「corridors」在正文沒有鋪墊過，同 R8。

**E7　L41「PARA's author Tiago Forte」**
- 比 PARA 的介紹早出現，同 post-review 的接縫問題。

### 🟡 中英一致

- zh L29「85,000 次找信的紀錄」對 EN「re-finding actions」：EN 對，zh 要改（V10）。
- zh L27「證明了規則」對 EN「strengthen」：EN 對，zh 要改（V11）。
- zh L112「每層 no more than four levels deep」對 EN「no more than four levels deep」：EN 對，zh 要改（V2）。
- 兩版共同要改的：V1（人數）、V4（單位）、V5、V7、V8、V9、V12、V13、V14，改的時候兩版同步。
- 樹狀圖：EN 的 `12 Money` 對 PARA 的 `Finances`，zh 兩邊都是「財務」。不影響理解。

### 保護片段提醒

改寫時不得動：2.86、2.236／0.106／21、94%、14.76、88%、8%、`.11` 編號、所有逐字引文。V1、V4 是改正數字的錯誤用法，不是潤飾；它們歸 post-update 處理。

## 修正紀錄（2026-10-22，寫作者依本審稿與編輯審稿 2026-10-22-editor-pass-order2-3.md 修改，中英同步）

- V1 2008 人數改「七百多位」；V2 拿掉「每層四個」誤寫，Forte 四層改為作者主張並附原話；V3 Johnny.Decimal 三句改連 philosophy、the-jdex、expand-an-area-overview 頁並補參考資料；V4 改用 22 項（中位數 15）與 21 項門檻比較，指出一般資料夾已在門檻附近；R1 引文當句補連結或改寫成轉述。
- V5「三、四層上限」改成資料原意：2–6 層差不多、7 層以上明顯變慢，建議改為「別深到七層以上」；V6 不再拿 Forte 四層與 Bergman 深度直接比；V7 補「七個月後已有超過三分之一移除，整體回到接近原水準」；V8 email／檔案比例標明自評。
- 措辭：Whittaker 改回呼 order 0、比的是勤於歸檔的人；「證明」改「強化」；忘記位置改「最多約四分之一」；拿掉「從 2008 年起」；資料年代改「2000 年代後期收集」。
- 編輯審稿：開頭三段先介紹 PARA 與 Johnny.Decimal；新增「標籤，以及沒有資料夾的工具」一節（Bergman 2013 姊妹篇、Civan 2008、Notion 說明中心，截至 2026-10）；解釋 Johnny.Decimal 每 category 100 個 ID 與「二十幾項就拆」的差別（靠索引 vs 瀏覽）；兩棵樹都加收件匣、Johnny.Decimal 樹補出國裝備清單；「今晚可以做的事」改成 A／B 兩條路；結尾用小川山筆記帶出 order 3；Ferreira 2025 支持「筆記像檔案」；英文引文大多改成中文轉述，只留兩句；英文版 "In the authors' words" 改為轉述語氣、"rules of experience" 刪除。
- 未採納：Lansdale 1988（只經 Bendersky 轉引，未讀原文）。
