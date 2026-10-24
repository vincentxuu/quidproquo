# 編輯審稿：知識庫怎麼建 order 2、order 3（2026-10-22）

審稿人立場：沒參與寫作、沒讀過其他審稿紀錄。讀過 order 0、1（中文）、規劃表的目標讀者／弧線／order 2–5 範圍卡、writing-guide「長文的體裁與語域」七條。未改動任何文章。

假想讀者：在 Notion 或 Obsidian 裡筆記越積越多、找不到東西的上班族，沒讀過 PIM 文獻，聽過 PARA／Zettelkasten 但沒真的用過。

---

## 1. 讀者測試

### order 2：能不能決定方法並動手重分資料夾？

**能做出大方向的決定，但動手時會卡在三處。**

做得好的地方：
- 「同一批檔案，兩種樹」是全篇最有用的一段，讀者一眼看出兩種方法的差別：「PARA 依『現在和你多近』分，日本攀岩結束後會整個搬家；Johnny.Decimal 依『是什麼』分，日本攀岩永遠在 `15.52`」。
- 「日本攀岩的一生」把 PARA 的搬移時機講成可照做的動作（「先花十分鐘把以後還會用到的東西挑出來」）。
- 自我檢查「Python 放 Area 還是 Resource」選得好，答案點出 PARA 的本質。

卡住的地方：

1. **用 Notion 的人不知道怎麼套。** 全文的單位是「資料夾」，但 Notion 沒有資料夾，只有巢狀頁面和資料庫。order 1 有「在工具裡怎麼做」表，order 2 完全沒有，只在限制段說「筆記軟體裡的資料夾、標籤和雙向連結，目前沒有同樣規模的研究」。Notion 讀者讀完會問：PARA 在 Notion 是四個頁面還是一個資料庫加「類別」欄位？「一個資料夾超過二十幾項就拆」在資料庫視圖裡還成立嗎？不需要寫成工具教學（那是 order 4），但要一段話說清楚「資料夾」在 Notion／Obsidian 對應什麼，並指向 order 4。

2. **標籤 vs 資料夾完全沒談。** 這是目標讀者最常卡的問題，order 3 的 MOC 範例甚至把它列成「還沒想清楚的：標籤和資料夾要不要並用？」，等於系列自己承認沒回答。order 2 是回答它最自然的位置：至少給一句判準（例如資料夾回答「它住在哪」只能一個，標籤回答「它跟什麼有關」可以多個；研究沒量過，這是作法）。

3. **「今晚可以做的事」第 1–2 步和第 4 步互相打架。** 第 1、2 步要讀者「數一下你最深的資料夾有幾層……把中間只用來轉場的層級拿掉」「找出超過二十幾項的資料夾。拆成兩三個子資料夾」；第 4 步卻說「別一次重整全部……把舊東西整包放進一個標了日期的封存資料夾」。照第 4 步做，第 1、2 步就白做了。開頭承諾的「把現有的資料夾重新分一次」也和第 4 步方向相反。讀者會不知道今晚到底該重整還是封存。建議改成二選一的分支：舊樹還算能用就做 1、2；已經亂到不想碰就做 4。

會想關掉分頁的地方：**第一節「研究怎麼說」**。讀者點進來是為了 PARA 和 Johnny.Decimal，前五段卻是連續的研究數字：「296 個人……1,131 個檔案，94% 找到了……約 15 秒」「六百多位……56% 到 68%，搜尋只佔 4% 到 15%」「三週後短暫上升，七個月後又回到原本的水準……481 人裡只有 12 人……另有 12 人」「約 8%」「345 位使用者超過 85,000 次……62%，搜尋 18%……12%……將近一分鐘……15 秒……88%」「43%……7%」。PARA 到第三個 `##` 才出現。

### order 3：能不能照例子把摘要改寫成原子筆記並建 MOC？

**改寫原子筆記：能。建 MOC：大概能，但不知道 MOC 要放哪、和資料夾有什麼不同。**

做得好的地方：
- 例子拿 order 2 的論文當素材，四步（文獻筆記 → 兩則永久筆記 → 連舊筆記 → MOC）完整走完，示範了「依概念寫會把兩篇來源收在一起」。這是系列內最好的教學段之一。
- 永久筆記範例最後一句「我自己的筆記庫最深到 6 層，該攤平了」示範了什麼叫「用自己的話」，比任何定義都清楚。
- MOC 的「還沒想清楚的」一節是有價值、可照做的細節。
- 「什麼時候不需要這些」很誠實，替不寫書的讀者解套。

卡住的地方：

1. **永久筆記和 MOC 要放在哪個資料夾？** order 3 說「和 order 2 可以並用：資料夾管行動，連結管想法」，但沒說怎麼並用。用 PARA 的讀者會問：原子筆記算 Resources？每則都開一個資料夾？還是另開一個平的「筆記」資料夾？用 Johnny.Decimal 的人更困惑：每則原子筆記要一個 ID 嗎？這正是 2→3 的斷崖，規劃表的處理只寫到「說明兩者解決不同問題」，讀者要的是一句擺放規則。

2. **示範的連結理由本身寫得不清楚。** 這段是在教「怎麼寫連結理由」，範本卻是：「連到〈收件匣每週清空〉：這解釋了為什麼收件匣不用分類，反正之後靠位置找的是已經歸好的東西，收件匣只是暫存。」我讀了三次才懂。而且 order 1 給收件匣不分類的理由是「過早歸檔」（Whittaker & Hirschberg），不是這個。範本要是讀者照抄的標準，應該換成一句一讀就懂的，並和 order 1 的理由一致；第二條（Johnny.Decimal）就寫得很好，可以當模範。

3. **Luhmann 的固定編號在數位工具裡要不要做？** 第一節花大篇幅講「57/12a1」，但後面的四個原則和例子都沒用編號，也沒說 Obsidian／Notion 裡由什麼取代（檔名＋連結；Obsidian 改名自動更新連結是 order 4 的範圍）。讀者會以為自己要開始編號。

4. **Obsidian 的 backlink、graph view、AI 自動建議連結，算不算「寫了理由的連結」？** 全文沒提。Obsidian 讀者最常見的狀況正是：反向連結面板自動出現一堆，或外掛自動建議相關筆記。這和「每條連結寫出為什麼連」直接衝突，應該有一句交代（例如：自動出現的是候選，不是連結；決定要連時才補理由；AI 能做什麼留給 order 5）。order 1 用「AI 幫我寫的摘要，算不算那一句話？」處理過同類問題，order 3 用同一個格式加一題「AI 建議的連結算不算？」會很一致。

會想關掉分頁的地方：**「研究支持到哪裡」整節**。它卡在「MOC」和「例子」之間，讀者剛學會概念、準備看示範時，被四小節、十幾個數字擋住（86 篇、9 個百分點、126 篇、50 項、2014、2021、五篇裡四篇、3 vs 8 個、4 秒、2009、7 位）。

---

## 2. 判準與建議的一致性、可操作性、漏掉的情境

### 前後不一致

- **order 2「二十幾項就拆」vs Johnny.Decimal「每個 category 最多 100 個 ID」。** 同一篇裡，研究段說「一個資料夾超過約 21 項……就值得再開一層」，JD 段說「ID：每個 category 最多 100 個」，選擇表又把 JD 當推薦選項。讀者會問：用 JD 的話，一個 category 放到 50 個 ID 要不要拆？文章沒交代。PARA 的 Resources 一層也很容易超過 21 項，同樣沒交代。
- **order 3 tldr「歸成三件事」vs 正文「現代版的四個原則」。** tldr：「現代版歸成三件事：一則筆記只講一個概念、用自己的話寫、每條連結寫出為什麼連」；正文標題是「現代版的四個原則」，多了「依概念寫，不依書或專案寫」。
- **order 3「資料夾管行動，連結管想法」只對 PARA 成立。** order 2 自己說 Johnny.Decimal 是「依『是什麼』分」，不是依行動。這句口號應改成不綁 PARA 的說法（例如「資料夾決定一則筆記住在哪，連結決定它跟什麼有關」）。
- **order 3 MOC 要不要有階層？** Luhmann 段強調「decide against the systematic ordering in accordance with topics」，MOC 段又引 zettelkasten.de「Some sort of hierarchical structure is very useful.」，兩句放在同一篇沒有調和。讀者會覺得 MOC 是把 Luhmann 反對的東西請回來。一句話就能解：Luhmann 反對的是「筆記本身照主題樹放」，structure note 是在固定位置之上另加一層可以隨時重排的地圖。
- **order 3 開始小 vs 今晚清單。** 「從小處開始：不必改寫舊筆記」之後，今晚清單第 1 步是「挑一則最近的讀書摘要……改寫成一則……筆記」，那正是舊筆記。差異不大，但用詞要對齊（例如「不必回頭改寫全部舊筆記，挑一則就好」）。
- **兩篇的樹都沒有收件匣。** order 1 的核心動作是「只留一個收件匣」，但 order 2 的 PARA 樹和 JD 樹都沒有收件匣的位置，選擇表第一列卻說「收件匣加搜尋就好」。在樹上加一個 `0 Inbox`（JD 可用 `00` 區或系統區），三篇就接起來了。

### 可操作性不足

- order 2 選擇表第一列「筆記很少，或幾乎都靠搜尋也找得到」沒有門檻。「很少」是幾則？可用 order 1 的「數一次自己的收藏」或研究段的「二十幾項」當門檻（例如全部筆記還放得進一個不到二十幾項的資料夾）。
- order 2 選擇表是二選一，但多數讀者兩種情況都有（工作專案一直換、生活資料很穩定）。要說可不可以混用（例如 PARA 頂層、Resources 內部用 JD 編號；或明說不建議混用的理由）。
- order 3 MOC 的建立時機只有 Milo 的「Mental Squeeze Point」，是一種感覺。可給一個經驗值當起點，例如同主題的筆記多到一頁列不完、或你找某則筆記開始要靠搜尋，並標明是經驗值。

### 漏掉的情境

| 情境 | 現況 | 建議 |
|---|---|---|
| 標籤 vs 資料夾 | order 2 未談；order 3 把它留成「還沒想清楚」 | order 2 給一句判準 |
| 沒有資料夾的筆記軟體（Notion 巢狀頁面／資料庫） | 未談 | order 2 一段對應＋指向 order 4 |
| 剪藏的內容（Web Clipper 自動命名） | order 2 推論「筆記比較像檔案：你寫的、你放的」 | 這個推論對剪藏不成立：order 1 才教讀者用 Web Clipper 收文章，那些頁名是別人取的，比較像 email。應補一句，否則推論有洞 |
| Obsidian backlink／graph view | order 3 只引一篇 2009 雙向連結實驗，沒連到讀者的工具 | 一句說明自動反向連結和「寫了理由的連結」的差別 |
| AI 自動連結、AI 自動分類 | 兩篇都沒提 | 各一句，指向 order 5 |
| 一則筆記同時屬於兩個地方 | 沒提，但這正是 order 2 → 3 的動機 | 見第 4 點 |

---

## 3. 研究與主張的比例

**兩篇的研究段都偏文獻回顧，教學比例不足。** 系列原則「作者主張與研究證據分開寫」是對的，但目前的寫法是把方法學數字也搬進正文，違反 writing-guide 第 4 條「正文每個主張最多一個數字」。

order 2：
- 第一節第 1 段：一個主張（多數人靠點資料夾找）配了 296／1,131／94%／15 秒／六百多位／56–68%／4–15% 共七個數字。讀者做決定只需要一個：「點資料夾佔五到七成，搜尋不到兩成」。
- Google Desktop／Spotlight 那段（三週、七個月、481 人、12 人、12 人）可縮成一句「搜尋工具變好之後，習慣幾個月內就回到原樣」。
- Whittaker 2011 那段與 order 0 重複（見第 4 點），可縮成一句回呼。
- 「研究的限制」放在文末是對的（第 6 條：但書換位置）。

order 3：
- 「研究支持到哪裡」四小節都是文獻回顧格式（某某某年、整合幾篇、發現什麼），沒有一句「所以你該怎麼做」，只有最後一小節收在「這和『寫出連結理由』的建議方向一致」。
- **「手寫比打字好」整小節離題。** 這篇的聚焦問題是「怎麼連」，讀者沒問手寫，規劃表範圍卡也寫「手寫比打字好的說法已被 2021 重複驗證推翻，不引」。建議刪除或移到附錄。
- 生成效應那段的但書是堆疊式（第 6 條）：「但要知道它測的是什麼……材料沒有意義時效應接近零，清單超過 50 項時也幾乎消失；用寫或打字產生的效應，比用口說的小。所以……不能直接證明……」。三個限制連發，讀者拿不到結論。主張留一句，限制移到節尾或附錄。
- 超文本研究的標題「連結多好還是少好，研究看不出來」，和內文「加上橫向的語意連結，五篇裡有四篇讓讀者找資訊變慢」有點對不上：後者其實是一個明確的訊號，而 Zettelkasten 的連結正是橫向語意連結。建議直接講：「讀別人做的超文本時，多加橫向連結會變慢，標清楚目的地的連結有幫助；長年經營自己的筆記庫沒人測過」。不要用標題把它淡化。
- Ferreira 2025（7 位 Obsidian 使用者日常主要靠資料夾、標籤和搜尋）是兩篇之間最好的橋，現在卻放在研究段最後一句，沒有解讀。它支持「連結不取代資料夾，兩者並用」，應該拿去當 order 3 開頭「可以並用」的證據，或放在「什麼時候不需要這些」。

**該講沒講的觀點：**
- order 2：資料夾的另一個功能是提醒（order 0 引過 Malone：「提醒你還有事沒做」）。PARA 的 Projects 放最上面，本質就是利用這一點。order 2 沒有接上 order 0 的這條線，很可惜，而且這正好能回答「既然搜尋這麼好用，為什麼還要 Projects 資料夾」。
- order 3：連結的成本。每條連結寫理由要花時間，什麼時候不連？文章講了「太碎連結也跟著碎」，但沒給「這則不必連」的判準。
- order 3：order 1 的「那一句自己的話」就是永久筆記的種子。order 3 沒有回呼 order 1，錯過了系列最自然的遞進（order 1 寫一句 → order 3 把那句長成一則可連結的筆記）。

**引述密度（第 5 條）：** 兩篇各有約十處未翻譯的英文行內引述，中文讀者每次都要切語言。多數不通過「原話比轉述更有力」的測試，例如 order 3 的「use your own words」、order 2 的「opportunistically, as opportunities arise」「no more than four levels deep」「The index is your Johnny.Decimal system.」，都是一般描述。建議只保留作者自承或反直覺的那幾句（Luhmann「a mere container」那段 blockquote、Matuschak「can't write anything at all」、Forte「Whether or not it's a real limit, it is a useful constraint」），其餘改成中文轉述加連結。

---

## 4. 重複、矛盾與銜接

### 與 order 0、1 的重複

- **Whittaker 2011** 在 order 0 已經以「IBM 研究院的 Whittaker 等人分析 345 位使用者找回 email 的紀錄……勤於歸檔的人並沒有比較找得到……主要是為了管理待辦」完整介紹過，order 2 幾乎原句重講：「IBM 研究院的 Whittaker 等人分析 345 位使用者……歸檔多半是因為信太多，用來管待辦」。order 0 結尾也已明說「兩者能不能互相推論，留給 order 2」，所以 order 2 應該寫成回呼（「總覽提過的 email 研究發現……」），把篇幅留給 order 0 沒講的部分：為什麼檔案不一樣。
- **Forte BASB 的封存建議**在 order 2 第 4 步引用，order 1 也引過同一篇談收件匣，不算重複，沒問題。
- **「用自己的話」**：order 1 第三步和 order 3 都在講，但兩篇沒有互相指認，讀起來像兩次獨立的建議。

### 與 order 0、1 的矛盾

- order 3 連結範例給「收件匣不用分類」的理由，和 order 1 給的理由（過早歸檔）不同，見第 1 點。
- order 0 的地圖說個人段「怎麼找到」由 order 2、4 處理；order 2 的「搜尋當備援」只有一句，可以接受，但沒有說搜尋要怎麼做得好（標題怎麼取才搜得到），這部分也許可留給 order 4，但要在 order 2 點一句。

### 兩篇之間

- **order 2 結尾到 order 3 開頭的銜接偏弱。** order 2 的最後一段正文是「今晚可以做的事」和 Python 自我檢查，唯一往後指的是限制段的「下一篇談連結時會再碰到這個缺口」，而且沒有連結。order 2 從頭到尾沒有製造「資料夾不夠用」的張力，order 3 只好從另一個問題（摘要沒幫你想出新東西）重新開始。
- 最自然的橋其實就在 order 2 的例子裡：「小川山的岩場筆記」該放 Resources／攀岩，還是跟 Areas／旅行的裝備清單放一起？一則筆記只能住一個資料夾，但它跟好幾個地方有關。在 order 2 結尾加兩三句把這個問題丟出來、連到 order 3；order 3 開頭第二段再接住它（「上一篇的岩場筆記只能放一個地方，連結解決的就是這件事」），兩篇就扣起來了。
- order 3 開頭「和 order 2 可以並用」是規劃表斷崖處理要求的，有做到，但只是一句宣告，見第 1 點建議補擺放規則。

---

## 5. 標題、tldr、開頭三段

### order 2

- **標題**「放哪裡：PARA、Johnny.Decimal，與到底要不要分資料夾」：好。後半句正是讀者心裡的問題。
- **tldr**：太長（約 170 字），而且全是研究結論，沒有給選擇規則。結尾停在但書「兩者都是作者的經驗，不是實驗結果」，讀者拿走的最後一個印象是「不確定」。建議改成：研究結論一句（分類要淺要小）＋選擇規則一句（專案常換用 PARA、資料穩定要固定位置用 JD、很少就先不分）＋經驗值的提醒縮成幾個字。
- **開頭三段**：第一段很好，「兩派都拿得出研究，因為研究看的東西不一樣」是很強的鉤子。第二段是系列樣板，必要但平淡。違反 writing-guide 第 1 條「前三段之內要讓沒接觸過的人知道它是什麼」：PARA 和 Johnny.Decimal 在標題就出現，但前三段沒有一句說它們是什麼，要等研究整節結束。建議在第二段末加一句定義，例如「PARA 依『跟手上的事多近』把東西分成四類，Johnny.Decimal 用兩位數編號把每樣東西固定在一個位置」。

### order 3

- **標題**「怎麼連：Zettelkasten、Evergreen notes 與 MOC」：「怎麼連」好；後面三個術語對 Notion 使用者偏生，但它們是 SEO 關鍵字，可以接受。
- **tldr**：開頭是 Luhmann 的歷史（「靠固定編號、在卡片之間寫連結、只記少數入口的索引，用了幾年才開始產生新想法」），讀者還不知道 Luhmann 是誰；中段兩個但書（「沒有任何對照實驗」「看不出好壞」）。加上「三件事 vs 四個原則」的不一致。建議改成結果導向：先說這篇教你把摘要改成會長出想法的筆記；再說三個動作；研究的保留縮成一句。
- **開頭三段**：第一段非常好，「它們找得到，但從來沒有幫你想出新東西」精準擊中目標讀者。第二段的並用說明可以補上 order 2 留下的問題（見第 4 點）。

---

## 6. 英文版

### 最不自然的七處

| # | 位置 | 原文 | 問題 | 建議 |
|---|---|---|---|---|
| 1 | order 2 第二段 | "How notes link to each other waits for order 3." | 「等待」的擬人用法不自然 | "How notes link to each other is the subject of order 3." |
| 2 | order 2 第二段 | "and to reorganize your existing folders once" | "once" 讀起來像「僅一次」或「曾經」 | "and to do one full pass at reorganizing your existing folders" |
| 3 | order 2 研究段 | "In the authors' words, these people are an exception to the rule, and their reasons only strengthen it." | "In the authors' words" 暗示接下來是原話，但後面不是引文；中文是「作者的結論是」 | "The authors conclude that these people are the exception, and their reasons actually confirm the rule." |
| 4 | order 2 研究段 | "their search share rose briefly after three weeks and fell back to its earlier level after seven months" / "moved to the better Spotlight" | 時間副詞位置讓意思變成「三週後才上升」；"the better Spotlight" 不自然 | "their share of searches rose in the first three weeks, then fell back to its earlier level by seven months" / "who had switched to the improved Spotlight" |
| 5 | order 2 怎麼選 | "they're rules of experience" / "What the research supports is only the direction" | "rules of experience" 不是慣用語；第二句語序生硬 | "they're rules of thumb" / "The research supports only the direction: shallow and small." |
| 6 | order 3 現代版原則 | "Promoters have rewritten Luhmann's method for digital tools." | "Promoters" 帶推銷意味，英文讀者會讀成負面 | "Advocates have adapted Luhmann's method for digital tools." |
| 7 | order 3 MOC 範例與研究段 | "# Organizing a personal knowledge base MOC" / "Whether more links are better or worse, the research can't say." / "This isn't a new invention from 2020." | MOC 標題語序怪；前置受詞句不自然；「2020」沒有前文交代 | "# MOC: Organizing a personal knowledge base" / "The research can't say whether more links help or hurt." / "This idea predates the digital tools that popularized it."（或補上 2020 指的是什麼） |

另有一處英文同樣繼承了中文的問題：order 3 Step 3 的 "this explains why the inbox needn't be sorted; what you later find by location is what's already filed, and the inbox is only a holding area." 中文改好後英文要一起改。

### 中英一致性

- 整體一致，段落、表格、例子一一對應。
- order 2 英文加了 "Ofer Bergman"，中文只有 Bergman，無妨。
- 第 3 處（"In the authors' words"）是唯一語意偏移：英文把轉述變成了疑似引文。
- 中文版的問題（tldr 三件事 vs 四原則、今晚清單矛盾、連結範例不清）英文版全部原樣繼承，修中文時要同步。

---

## 7. 總評

### order 2：7/10

優點：問題選得準，研究對照（檔案 vs email）是這個主題少見的實證切入，兩棵樹的對照和攀岩例子很好用，Python 自我檢查精準。

要到 9 分還差：
1. 開頭三段就說出 PARA／JD 是什麼，研究段數字壓到每個主張一個（第 1、4 條）。
2. 補「標籤 vs 資料夾」與「沒有資料夾的工具（Notion）」各一段。
3. 解決「二十幾項就拆」與 JD「100 個 ID」的衝突，樹上加收件匣。
4. 今晚清單改成分支，不要自相矛盾。
5. 結尾製造「一則筆記只能住一個地方」的張力，連到 order 3。

### order 3：7/10

優點：開頭鉤子最強，Luhmann 段用一手來源還原了常被省略的細節（他其實有分區、前幾年只是收納盒），四步例子是整個系列目前最好的示範，「什麼時候不需要這些」誠實又實用。

要到 9 分還差：
1. 研究段移到例子之後（或縮成一段＋附錄），刪掉手寫 vs 打字（規劃表本來就寫不引）。
2. tldr 與正文的原則數一致，tldr 改成結果導向。
3. 回答「永久筆記和 MOC 放在 order 2 的哪個資料夾」、「MOC 和資料夾／標籤差在哪」。
4. 換掉不清楚的連結理由範本，和 order 1 的理由對齊。
5. 一句交代 Obsidian backlink 與 AI 自動連結和「寫了理由的連結」的差別。

---

## 修改建議（依影響排序，共 12 條）

1. **【order 2】補「標籤 vs 資料夾」與「Notion 沒有資料夾」**：各一段，給判準並指向 order 4；同時拿掉 order 3 MOC 範例裡「標籤和資料夾要不要並用？」這個系列自己沒回答的問題，或改成連回 order 2。
2. **【order 3】說清楚怎麼和 order 2 並用**：永久筆記與 MOC 要放在 PARA／JD 的哪裡（一句擺放規則），並把口號「資料夾管行動，連結管想法」改成不綁 PARA 的說法。Ferreira 2025 拿來當這段的證據。
3. **【order 3】研究段搬到例子之後並瘦身**：刪除「手寫比打字好」小節；生成效應的三個但書移到節尾；超文本研究直接講「多加橫向連結變慢、標清楚目的地有幫助」，不用「看不出來」淡化。
4. **【order 2】第一節壓數字、提前定義**：前三段加一句 PARA／JD 的定義；每個主張只留一個讀者會用的數字，其餘進附錄；Whittaker 2011 改寫成回呼 order 0。
5. **【order 2】今晚清單改分支**：舊樹還能用做 1、2；太亂就做 4（整包封存）。對齊開頭承諾「重新分一次」。
6. **【order 2 → 3 銜接】** order 2 結尾用「小川山岩場筆記該放 Resources 還是 Areas」帶出「一則筆記只能住一個地方」並連到 order 3；order 3 第二段接住這個問題。
7. **【order 3】換掉第一條連結理由範本**：改成一讀就懂的一句，並和 order 1「過早歸檔」的理由一致；英文版同步。
8. **【order 3】tldr 與正文一致**：三件事 vs 四個原則擇一；tldr 改成結果導向，研究保留縮成一句。
9. **【order 2】解決「二十幾項」與 JD「100 個 ID」的衝突**，並在兩棵樹上加收件匣位置，接上 order 1。
10. **【order 3】補 backlink／AI 自動連結一題**：仿 order 1 的 FAQ 格式，「Obsidian 自動出現的反向連結、AI 建議的連結，算不算？」答案指向 order 5。順帶一句交代數位工具不需要 Luhmann 式編號。
11. **【兩篇】英文行內引述減到三四句**：只留作者自承或反直覺的原話，其餘轉成中文加連結；order 3 MOC 段調和 Luhmann「反對主題排序」與 structure note「階層有用」。
12. **【英文版】修上表七處**，特別是 order 2 的 "In the authors' words"（語意偏移）與 order 3 的 "Promoters"（語氣偏負面）。
