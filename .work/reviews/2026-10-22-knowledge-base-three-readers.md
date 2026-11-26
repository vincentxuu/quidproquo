# 審稿紀錄：知識庫怎麼建 order 0〈三種讀者、四個問題〉

- 中文：`src/content/posts/learning/2026-10-22-knowledge-base-three-readers.md`
- 英文：`src/content/posts/learning/2026-10-22-knowledge-base-three-readers-en.md`
- 審稿日期：2026-10-22。獨立審稿員，沒參與寫作，沒改文章。
- 證據來源：`.work/research/building-knowledge-bases/extractions/` 的抽取紀錄（boardman、bruce-jones-dumais-2004-kftf、najork-2024、malone-1983、stocker-tochtermann-2011、anthropic-2024、barnett-2024、whittaker-hirschberg-2001、whittaker-2011、dumais-2003、grudin-poole-2010）。非論文來源與抽取紀錄沒寫到的細節，用 Exa `web_fetch_exa` 重抓：Anthropic Contextual Retrieval 全文、arXiv 2401.05856 摘要頁（作者機構）、Forte BASB 導覽（含 PARA 段）、zettelkasten.de Collector's Fallacy。Groundlane 這次沒用；照任務指定改走 Exa。
- 行號都指中文版；英文版行號相同，因為兩版逐段對齊。

## post-verify

共抽出 31 條宣告。逐字引文 10 條全部對過原句，都是逐字，沒有轉引被寫成直接引用的情形（Bendersky 那句是書章作者自己的話，不是轉引）。全篇歸因標籤只有 1 處（line 67「我沒找到」），沒超過 3 處。

### 🔵 Misframed（數字或原句對，推論或框架偏了）

1. **line 69「order 2 會談『到底要不要建資料夾』，上面 email 研究的結果就和多數方法書的建議不同」**（英文 line 69 同）
   - 問題一：Whittaker 2011 只研究 email（IBM 的 Bluemail，平均用兩個月）。作者自己在 Discussion 也說，檔案與網頁的研究結論和他們相反，可能因為 email 結構比較好、信件量比較大（抽取紀錄第 9 點與「場域侷限」）。規劃表「斷崖處理」對 order 2 也要求「說清楚研究對象是 email 與檔案系統，不是筆記軟體」。這句直接拿 email 的結果去對筆記方法書，等於把範圍放大了。
   - 問題二：文中點名的方法書 Forte，本身就反對事先建一套完整的資料夾階層（BASB 導覽的「Organize for actionability」：「It can be tempting to try to create a perfect hierarchy of folders from the get-go … this approach is not only time-consuming…」），PARA 也只有四個資料夾。所以「和多數方法書的建議不同」講得比實際衝突還大，「多數」也沒有依據。
   - 建議改法（縮回來源原意）：「例如 order 2 會談『到底要不要建資料夾』：PARA 主張用四個資料夾、按能不能拿來行動來分；email 研究卻發現勤於歸檔的人沒有比較找得到。不過那是 email，不是筆記軟體，order 2 會講這個差別。」

2. **line 61「時間和人是他們找回時最重要的線索」**（英文 line 61「their most important cues」）
   - 來源原文：25% 的查詢含人名，作者的說法是「people are a powerful memory cue」；使用者比較常切到依日期排序，原文是「Date is a more useful attribute than Rank」，而且預設依相關度排序的那組差異不顯著（dumais 抽取紀錄第 5 點）。原文沒有「最重要」。「使用者回報找東西變容易」只來自 45 份前後問卷的自評。
   - 建議改法：「…使用者回報找東西變容易。他們最常用時間和人名當線索：四分之一的查詢帶人名，結果也常被切成依日期排序。」或乾脆縮成「時間和人名是常用的線索」。

3. **line 49「模型找不到往往直接編一個答案」**（英文「often makes something up」）；表格 line 39「模型照樣回答」
   - Barnett 的原句是「the system could be fooled into giving a response」，講的是「可能」，沒有量頻率。「往往」是放大。
   - 建議改法：「模型找不到，卻可能照樣給一個答案。」表格那格沒問題，不用改。

4. **line 63 Grudin 那段：「負責修格式和錯字的人離開後，大家都抱怨它『going to weed』」**
   - 原文的順序是：一位主要貢獻者（不是被指派「負責」的人）會順手修格式和文法 → 他離開 → 指派一位 PM 接手 → PM 又被調走 → 沒有人顧，wiki 外觀和一致性變差。而且原文說這個 wiki「remained very active」。照現在的寫法，讀者會以為 wiki 從此荒廢，也看不到「指派過人、後來被調走」這個跟 order 9（維護責任）最有關的細節。
   - 建議改法：「…一位常順手修格式和文法的主要貢獻者離開，接手的 PM 後來又被調去做別的事。wiki 還是很多人在用，但每位受訪者都抱怨它『going to weed』（長滿雜草）…」

### 🟠 Outdated（以前對，現在要加時間條件）

5. **line 51「知識庫小於 20 萬 token（約 500 頁）時，可以整份放進提示詞」**
   - 原句逐字對過（「If your knowledge base is smaller than 200,000 tokens (about 500 pages of material), you can just include the entire knowledge base in the prompt…」）。不過 20 萬是 2024-09 那時 Claude 的 context 長度（anthropic 抽取紀錄的「限制」），這個門檻會跟著模型變。到 2026-10，已經有不少模型的 context 比這長很多。正文沒寫年份，讀者會把它當成固定門檻。
   - 建議改法：「Anthropic 同一篇文章（2024 年）提醒，知識庫小於當時模型的 context 長度，約 20 萬 token、500 頁，就可以整份放進提示詞。門檻會跟著模型的 context 長度變。」

### 🔴／🟡 作者與機構描述

6. 🟡 **line 63「微軟研究院的 Grudin 和 Poole」**：Poole 當時在 Georgia Tech，只有 Grudin 在微軟研究院（grudin 抽取紀錄的「書目」）。建議改成「微軟研究院的 Grudin 與 Georgia Tech 的 Poole」，或寫「Grudin 和 Poole」，不寫機構。英文 line 63「at Microsoft Research」同樣要改。
7. 🟡 **line 59「Whittaker 與 IBM 研究員分析…」**：這樣寫像是說 Whittaker 不在 IBM。實際上前四位作者都在 IBM Research（Almaden／Argentina），Tang 掛 microsoft.com。建議改成「IBM 研究院的 Whittaker 等人分析…」。英文「Whittaker and IBM researchers」改成「Whittaker and colleagues at IBM Research」。
8. 🟡 **line 45「工程師自己寫、自己用的技術區塊」**：原文是「20 technicians」，應該寫「技術人員」。英文「the engineers themselves」改成「the technicians themselves」。
9. 🟡 **line 67「Zettelkasten 的現代版本則多由 zettelkasten.de 這類推廣網站整理」**：「多由」沒有依據。現代版 Zettelkasten 最常被引的整理者是 Sönke Ahrens 的書（規劃表 order 3 的來源也列「Ahrens 概念」）。另外，連結指到〈The Collector's Fallacy〉，這篇講收集的迷思，不是在介紹 Zettelkasten 方法。打開連結的人看不到「整理 Zettelkasten 現代版」這件事。建議改成「Zettelkasten 的現代版本則由 Sönke Ahrens 的書和 zettelkasten.de 這類網站推廣」，連結換成 zettelkasten.de 的入門頁。如果要留 Collector's Fallacy，就把它放到 order 1。

### 🟡 措辭比來源寬一點（可以縮回原意，不用加但書）

10. **line 41「桌上那疊文件除了方便找，還有一個一樣重要的功能」**：原文的主詞是「desk organizations」（整張桌子的整理方式），不是那疊文件。提醒功能的證據裡，確實有「約 67% 的 pile 是待辦」，所以方向沒錯。不過為了貼合引文，建議改成「他發現桌面的擺法除了方便找，還有一個一樣重要的功能」。英文「the piles on a desk had a second job」改成「the way people arranged their desks had a second job」。
11. **line 57「趁一次辦公室搬遷清點員工的紙本檔案」**：數字來自 50 人的線上問卷：搬家箱數加上自陳的各類比例，不是研究者自己去清點。建議改成「趁一次辦公室搬遷，調查員工的紙本檔案」。英文「inventoried」改成「surveyed」。
12. **line 8 tldr「研究顯示個人收藏的『找』多半是找回看過的東西，而維護是三種知識庫共同的弱點」**：前半句有 Bendersky 2024 支持；後半句是作者綜合 Boardman、Grudin、Stocker、Barnett 得出的判斷，Barnett 也只說要持續校正，沒說維護是弱點。兩句接在同一個「研究顯示」底下，後半句就被一起掛到研究名下了。建議拆成兩句：「研究顯示，個人收藏的『找』多半是找回看過的東西。三種知識庫最常壞在同一處：沒人維護。」英文 tldr 同樣拆開。
13. **line 67「主題多是 2000 年代的 email 和電腦檔案」**：文中引的 PIM 研究有 1983 年的辦公桌和 2001 年的紙本檔案。建議改成「主題多是 1980 到 2000 年代的紙本、email 和電腦檔案」。

### 🟢 Confirmed（不必動）

- line 17：Boardman & Sasse 2004 訪談 31 人，研究檔案、email、書籤；兩位作者都在倫敦（Imperial、UCL），寫「英國研究者」正確；引文逐字（含 en dash）。
- line 23：Bruce、Jones（華盛頓大學）、Dumais（微軟研究院）；書籤、寄信給自己、存檔、列印都在他們列的十種方法裡；blockquote 逐字。
- line 27：Bendersky、Metzler、Najork、Wang（Google DeepMind），第一作者寫對；「refinding known items」逐字，而且是書章作者自己的話，不是轉引。
- line 41：Malone 1983 訪談 10 人；引文逐字。
- line 43：「about two-thirds of all the retrieval probes, the documents were not filed under the dimension(s) used in the description」，例子「標題和作者 vs 專案」也是原文的例子。
- line 45：三家奧地利企業；Beta 的非技術類文章大多由已離職的核心成員寫；引文逐字；技術區塊保持更新。「代寫」是合理的轉述，抽取紀錄也這樣讀。
- line 47：Anthropic 的例句逐字（含句點）。原文的情境是 SEC filings，寫「財報」可以接受。
- line 49：Barnett 等人在 Deakin University 的 Applied AI Institute（arXiv 頁確認）；三個案例；FP1 Missing Content；引文逐字。
- line 57：只有 49% 是獨有文件，15% 沒讀過，36% 是公開資料副本，數字與分母都對。抽取紀錄讀的是作者草稿，但 49% 在兩版一致。
- line 59：345 人、超過 85,000 次找回動作、「high filers were no more successful at finding messages than low filers」逐字；整理是為了管待辦、不被信淹沒，出自 32 人訪談，對得上。
- line 61：SIS 把 email、網頁、檔案建成統一索引；使用者自評找東西變容易（只有第 5 點的「最重要」要改）。
- line 63：Boardman 的受訪者很少整理，大整理發生在換工作這類人生轉折，原文是「only occurred during major life change stages such as starting a new job」；Grudin 的 Orbit 團隊 200 人；兩段引文逐字；Barnett 的「evolves rather than designed in at the start」逐字（原文本身文法就這樣）；「持續校正」對應 Table 2「continuous calibration」。
- line 67：PARA 與 Building a Second Brain 都是 Forte 的方法，BASB 導覽頁有「Adopt the PARA Method」一節；企業 wiki 研究以訪談與個案為主（Grudin、Stocker 都是）。
- line 19、77：系列 20 篇（order 0–19），各段範圍與規劃表的篇目總表一致；四個問題對應的 order（1／6／11–12、2–3／7–8／13–16、2／4／10／16–17、5／9／18–19）與規劃表的骨架表逐格一致。
- 站內連結：order 1、RAG 技法大全（系列名，連到該系列第 1 篇）、LLM 知識庫三種模式，中英檔案都存在。

範圍聲明：本次只檢查了文中已提出的 31 條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

### 機械檢查

- `pnpm verify`：只有 `check:series-plan` 紅，原因是缺本審稿紀錄（這份寫完就會補上）；同一條也點名 order 1 缺審稿紀錄，不屬於本篇。其餘全綠，包括 lang-parity、series-order、post-quality、check:tw A 級。
- `pnpm check:links`（中文版）：6 個 doi.org 回 403，是 ACM 擋機器人，人工確認即可。zettelkasten.de 回 `TypeError`，但 Exa 正常抓到全文，判定是檢查腳本的連線問題，不是死連結。
- 沒有 diagram 區塊，不用跑 diagram-preview。

### 事實查證

見上一節。

### 教學品質與結構（對照規劃表 order 0 範圍卡）

範圍卡逐項：

| 範圍卡項目 | 兌現情況 |
|---|---|
| 聚焦問題「知識庫是什麼？從哪段讀起？」 | ✅ line 19 定義、line 71–79 讀法表 |
| 講：收藏 vs 知識庫、三種讀者、四個問題、三段地圖 | ✅ 四節都有 |
| 不講：任何具體方法 | ✅ PARA、Zettelkasten 只點名，沒有展開 |
| 讀完能：說出自己要建哪一種、從哪篇開始 | ✅ 讀法表；但缺一個常見情況（第 3 點） |
| 例子：「年假怎麼請」三種讀者 | ✅ line 33–47；但到「四個問題」就斷了（第 4 點） |
| 自我檢查 | ✅ 有判準；判準跟範圍卡不同（第 6 點） |
| 連結 llm-knowledge-vault、rag-patterns | ✅ line 79 |

問題（依嚴重度）：

1. 🟡 **「兩件事」和「四個問題」沒有接上**（line 29 → line 53）。line 29 說收藏要變成知識庫「得先回答兩件事」（怎麼找到、誰維護），下一節表格之後又變成四個問題，收什麼和怎麼整理是突然冒出來的。反向大綱讀下來，讀者會問：到底是兩件還是四件？建議在 line 55 加一句橋接：「前面那兩件事（找得到、有人維護）是判斷收藏算不算知識庫的門檻；要做到，得從更前面的收什麼、怎麼整理開始。」
2. 🟡 **「四個問題 × 三段」用文字列 order，適合改成表格**（line 57–63）。每段結尾都塞一串「order 2、4、10、16–17 會談這個問題」，等於把一張 4×3 矩陣拆成散文。這也是 post-polish 那邊數字密度超標的主因（每段 6–9 個數字）。規劃表已經有這張表（「骨架是四個問題」那張）。建議在本節開頭或結尾放一張四列三欄的表，欄位是個人／團隊／AI，格子寫主題加 order；四段正文就拿掉 order 編號，只留研究證據。英文版同步。
3. 🟡 **讀法表缺「要拿團隊文件餵 AI」這個最常見的情況**（line 79）。規劃表的 C 段前置寫「order 0（讀過 B 段更好）」，斷崖表也說「B 段寫好的文件正是 AI 知識庫最好的原料」。正文只寫「每段第一篇都只假設你讀過這篇總覽，可以直接跳段」，讀者不會知道要做 AI 助理的人，最好也讀 B 段。建議在 line 79 補一句：「要拿公司現有文件做 AI 助理的人，可以先讀團隊段：AI 知識庫的原料，多半就是團隊文件。」
4. 🟢 **「年假」例子只用在三種讀者那節**。四個問題各補半句年假的例子，例如「收什麼：要收的是最新版的請假規定，不是三年前的公告截圖」，例子就能貫穿全篇。屬於可選。
5. 🟡 **line 25 的 blockquote 沒翻譯，「leaving」也沒解釋**。「keeping and leaving」裡的 leaving 指「不存，留在原處，需要時再找」，正文前文完全沒提，中文讀者看不懂這句為什麼是判準。建議在引文後加一句：「這裡的 leaving 指刻意不存、需要時再去原處找；不論存或不存，好不好的標準都是之後找不找得回來。」
6. 🟢 **自我檢查的判準和範圍卡不同**。範圍卡寫「有沒有回答『怎麼整理』與『誰維護』」，正文改成「用什麼線索找到」與「誰清掉過時的」。正文版本和 line 29 一致，比範圍卡好，建議回頭改規劃表，不要改文章。另外判準的中間情況沒定義（見 post-polish 第 4 點）。
7. 🟢 **frontmatter**：`type: guide` 跟內容（總覽）不太合，guide 預期有步驟、預期輸出、常見錯誤。站上其他系列的 order 0 有 deep-dive 也有 guide，兩種都有前例，可以不改。tags 5 個合規。站上已經有 `knowledge-base`（4 篇在用），這正是系列主題詞，建議加進去。description 和 tldr 沒有重複。
8. 🟢 **inline link**：line 63 第二次提到 Boardman 和 Sasse、Barnett 時沒有再連結，前文都連過了，可以接受；要嚴格符合 8.5 就再補一次連結。
9. 🟢 **參考資料**：Bendersky 那條沒寫年份與正式出處（ACM Press 2025 書章，*Information Retrieval: Advanced Topics and Techniques* 第 14 章）；Stocker 那條沒寫會議（IC3K 2009，CCIS 128）。建議補上。
10. 🟢 **文體占比**：介紹類章節占八成以上，方法論限制只有一節，約一成，跟「總覽」的承諾一致。標題與 tldr 沒有放工作量數字。
11. 🟢 **台灣讀者位置**：題目是全球通用的議題，「年假怎麼請」、Notion、Slack、Google 這些例子台灣上班族都熟，不必硬塞台灣案例。如果要加強，「表單在 Slack 置頂」可以考慮換成台灣公司更常見的 Teams 或 LINE 群組公告；這是可選。
12. ✅ **主題歸屬**：RAG 切塊只用一段講直覺，細節轉手給 RAG 技法大全，沒有越界。

## post-polish

### 掃描結果（中文版）

- `register-scan.sh`：長句 10 句。全篇約 70 句，約 14%，接近 15% 的處理線，集中在每段引研究的那一句。但書 3/22 段，綠。引述區塊 1，綠。數字密度：四個問題那節 4 段都 ≥6，原因見 post-review 第 2 點。姓名當主詞 0、模板化轉折 0、一般英文術語 0。
- `scan-ledger.sh`：沒有命中。
- `pnpm check:tw`：0 blocking、0 待看。

### 問題清單

1. 🟡 **正文夾的英文引文多半沒有中文意思**（line 17、45、49、63）。line 41、59 引文前後有中文轉述，沒問題；下面幾句沒有，不讀英文的讀者會漏掉重點。引號內原文是保護片段，不能改，只能在旁邊補中文：
   - line 17「stuff goes into the computer and doesn't come out – it just builds up」→ 後面補「（東西進了電腦就出不來，只會一直堆）」。
   - line 45「continuously declined, rendering most of them useless now」→ 改成「這些文章的內容越來越舊，到研究時大多已經沒用（原文：「continuously declined, rendering most of them useless now」）」，也順便把主詞改對：原文退步的是「內容新不新」，不是文章本身。
   - line 49「be fooled into giving a response」→ 前面補「被騙著照樣給出答案」。
   - line 63「going to weed」→ 補「（長滿雜草）」；「No one we interviewed mentioned…」→ 先寫「受訪者沒有一個人提到自己會清掉過時內容」，原文放括號或刪掉。
   - line 63「evolves rather than designed in at the start」→ 前面補「是上線後慢慢磨出來的，不是一開始就設計得出來」。
2. 🟡 **長句集中的三處**：
   - line 23（77 字）：「個人資訊管理（personal information management，PIM）研究把這件事拆成幾個動作：…」，中英全名加三組括號英文。建議把英文術語留給第一次出現的 PIM，keeping、re-finding、maintenance 三個括號拿掉，或改成一張三列小表。
   - line 41（84 字）：引文前面那句先斷開：「他發現桌面的擺法除了方便找，還有一樣重要的功能：提醒。」英文原句放在後面。
   - line 59（77 字）：「Whittaker 與 IBM 研究員分析 345 位使用者超過 85,000 次找回 email 的紀錄，結論是…」，建議拆成「IBM 研究院的 Whittaker 等人分析了 345 位使用者、超過 85,000 次找回 email 的紀錄。結論是…」。
3. 🟡 **數字密度**（line 57–63）：照 post-review 第 2 點把 order 編號移到表格，每段就只剩一個讀者用得到的數字（49%、345 人、200 人團隊），自然降到門檻內。
4. 🟡 **自我檢查的判準有一個沒定義的中間情況**（line 85）：「兩句都答不出來，它還是收藏。答得出來，它才開始像知識庫」。只答得出一句算什麼？建議改成「只要有一句答不出來，它就還是收藏；兩句都答得出來，它才開始像知識庫…」。英文 line 85「If you can't answer either … If you can」同樣改成「If you can't answer both … If you can answer both」。
5. 🟢 **用詞**：
   - line 63「穩健度」→ 台灣較常說「穩健性」。
   - line 67「研究這一側也有限制」→「研究本身也有限制」（「這一側」是 on the research side 的直譯）。
   - line 67「這些做法有它的道理」→「這些做法各有道理」。
   - line 57「AT&T 研究室」→「AT&T 實驗室」（AT&T Labs 在台灣的通稱）。
   - line 61「微軟的 Stuff I've Seen」→「微軟研究院的 Stuff I've Seen 系統」，第一次出現時讓讀者知道這是一套系統。
   - line 35 表頭「最常見的壞法」口語有特色，可以留；想要穩一點就改成「最常見的壞掉方式」。
6. 🟡 **英文版自然度**：
   - line 17「In 2004 the British researchers Boardman and Sasse」→ 去掉「the」：「In 2004, British researchers Boardman and Sasse…」。
   - line 47「a line from a financial filing, "The company's revenue grew by 3% over the previous quarter.", once chunked, no longer says…」→ 引號後接「.",」很彆扭。建議改成「Anthropic gives an example from a financial filing: once chunked, the line "The company's revenue grew by 3% over the previous quarter." no longer says which company or which quarter.」
   - line 51「Not every body of material for an AI needs retrieval.」→「Not every AI knowledge base needs a retrieval system.」
   - line 57「Worth keeping, usually, is what you will use again and can't find elsewhere.」倒裝太硬 →「What's usually worth keeping is what you'll use again and can't find anywhere else.」
   - line 63「Here all three kinds are weakest.」→「This is the weak point all three share.」，跟 tldr 用詞一致。
   - line 63 巢狀引號：「"No one we interviewed mentioned "pruning stale content" as…"」內層要改成單引號 'pruning stale content'。
   - line 63「After the person who fixed formatting and typos left one 200-person team」語序繞，配合 post-verify 第 4 點一起改寫：「On one 200-person team, a major contributor who used to fix formatting and grammar left; the project manager assigned to take over was later moved to other work.」
   - line 63 Barnett 引文原文文法不完整；英文讀者會以為是本站打錯字。可以寫成 robustness "evolves rather than [is] designed in at the start"，或改成轉述。
7. ✅ **中英一致**：段落、表格、order 對應、數字、連結逐段對過，語意一致。英文把新人搜的詞改成「time off」，是合理的在地化。上面 post-verify 第 1–13 點中英兩版都要同步改。

## 修正紀錄（2026-10-22，寫作者依本審稿修改）

中英兩版同步。
- 推論放大：order 2 預告改成「PARA 主張依專案分類 vs email 研究；那是 email 不是筆記軟體，留給 order 2」，拿掉「多數方法書」；SIS 改成「常改用日期排序、查詢常出現人名，時間和人都是好用的線索」；Barnett 改「可能直接給出一個答案」；Grudin 段改寫成主要貢獻者離開→指派 PM→PM 調走、wiki 仍活躍但外觀與一致性變差。
- 20 萬 token 補「2024 年」與「門檻隨模型能讀多少而變」。
- 機構：Poole 改喬治亞理工；Whittaker 2011 改「IBM 研究院的 Whittaker 等人」；engineers→技術人員／technicians；Zettelkasten 改「推廣多來自書籍和部落格，例如提出收集者謬誤的 zettelkasten.de」。
- tldr 把「研究顯示」與維護弱點拆成兩句並各自標明研究範圍。
- 「兩件事」到「四個問題」補橋接句；四個問題改成 4×3 表，order 編號移入表格。
- 讀法段補「做 AI 助理的人也讀團隊段」；自我檢查補「只答得出第一句」的情況。
- 英文引句在中文正文旁補中文意思；leaving 加註；斷長句；穩健性、研究本身、AT&T 實驗室。
- 採納可選項：加 knowledge-base tag；參考資料補 Bendersky 書章出處、Stocker 會議與 CCIS 128、Barnett CAIN 2024。
- 未採納：年假例子貫穿四問（篇幅）；規劃表範圍卡自我檢查判準留待下次改規劃表時同步。
