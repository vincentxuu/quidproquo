# 審稿報告：order 25〈讀者說寫得好，不代表他學到了〉

- 文章：`src/content/posts/learning/2026-10-14-reader-signals-vs-learning.md`（未追蹤的新檔，只有中文稿，跳過中英一致）
- sha256 審前（2026-10-15 09:37 CST）：`bc8c3a12c2f64bd93662fbf8a1e0ddf1a12f97cb2e23c5606860ecc8f7e437b5`
- sha256 審後（2026-10-15 09:43 CST）：`bc8c3a12c2f64bd93662fbf8a1e0ddf1a12f97cb2e23c5606860ecc8f7e437b5`（相同，審稿期間沒有人改檔）
- 依據：`.work/reviews/REVIEW-BRIEF-research-posts.md`、`.research/2026-10-14-writing-brief.md`、精讀清單 `.research/2026-10-13-reading-list-order-25-28.md`、抽取紀錄 11 份（`articles-that-teach/` 下的 deslauriers2019、bastani2025、lehmann2024、fischer2025、kestin2025、nagahama2017、oura2018、lai2023、chen2016-ab、yu2019、salvador2024）與 `teaching-text/koedinger2015.md`，抽查結果 `_audit/group-*.md`、`provenance.md`。
- 自動檢查：`check-tw-terms.mjs` 0 blocking、0 to review；`check-post-quality.mjs` 無問題。

## 必須修

**M1. 第 180 行：Chen 等人投入指標的描述寫錯，也和第 112 行自相矛盾。**
文章：「表裡投入只有一支影片的一個指標顯著」。抽取紀錄 `chen2016-ab-experiments-mooc.md` 第 11、12 項與 Table 5：平均總觀看時間在四支裡有三支顯著（影片 1 p = 0.02、影片 2 p = 0.05、影片 3 p = 0.006），只是方向不一（兩支舊拍法較長、一支新拍法較長）；只有「長觀看比例」這個指標是四支裡一支顯著。文章第 112 行本身就寫了「平均觀看時間有兩支是舊拍法較長、一支是新拍法較長」。建議改成：「表裡的長觀看比例只有一支影片顯著；平均觀看時間三支有顯著差異，但方向不一致」。

**M2. 第 54 行小標與第 105 行：把 Deslauriers 補充迴歸說得比原文強。**
小標「『講得好』能說明大半的『學到很多』」，第 105 行「『覺得講得好』和『覺得學到很多』幾乎是同一件事」。原文（紀錄第 14 項，¶9 L108）只有：Q3 高者 Q2 高 0.51 SD，放進 Q3 後教法不再顯著，「only the perceived fluency of the instructor was relevant」。原文沒有報這一題解釋了多少變異，「大半」「幾乎是同一件事」都是原文沒有的量。0.51 SD 的關聯也說不上「同一件事」。建議：小標改「『講得好』一放進去，教法就不顯著了」之類；第 105 行改成「在這個實驗裡，『覺得講得好』和『覺得學到很多』高度相關，而且放進前者之後，教法本身不再預測後者」。第 36 行表格「一題就能說明」可一併改成「一題就能預測」。

**M3. 第 22 行：站內聊天「會記下每一則提問與回答」不符合程式行為。**
`src/pages/api/chat.ts:140–141`：命中語意快取（`lookupSemanticCache`）時直接串流快取答案並 return，不會走到第 355 行的 `INSERT INTO chat_logs`。所以被快取回答的提問沒有記錄。另外 `chat_logs` 存了 `thread_id`、`ip`、`is_admin`（第 355 行），站主自己的測試提問也在裡面、只是有標記。建議改成：「站上的問答聊天會把多數提問與回答記進資料庫（命中快取的提問不記），連同對話串與來源 IP」，並在第 165 行表格或第 170 行說明這份資料混有站主自己的測試（可用 `is_admin` 分開）。這一點也和第 21 行的「沒有讀者身分」形成對照，讀者會想知道聊天有沒有身分。

## 建議修

1. 第 21 行「名詞解釋的功能每被查一次，資料庫就……加一」：同一頁面裡，同一個詞、同一程度、同一上下文的重複查詢由前端 `glossaryCache` 擋下，不會再送 API（`src/pages/posts/[...slug].astro:1265`），所以計數是「每頁面載入、每組詞／程度／上下文最多一次」。寫入本身（`src/pages/api/glossary/explain.ts:145–155`，`migrations/0006_glossary_lookup_stats.sql` 的主鍵 term＋slug＋level、`last_context`）與文章描述相符。建議改成「名詞解釋每被查一次（同一頁重複查同一個詞不重算）」。
2. 第 149 行 Duolingo「前兩次……第三次……」和第 141 行「換過兩次」的計數不一致。依紀錄：指標換了兩次（session → 學習時間 → TSLW），中間另有一次調整（總量 → 每天至少 15 分鐘的比例）。建議第 149 行改成「前兩次調整（換掉 session 數、把總時間改成達標比例）……最後一次換成 TSLW……」。
3. 第 123 行「所以『有 AI 時自評偏高』不是每一組都成立」：underconfident 的判斷來自作者並排兩張表的係數、沒有檢定（第 123 行與附錄已寫明是作者做的、沒有檢定，歸屬沒問題）。但這一句是本站從未檢定的比較推出的結論，建議改成「依作者沒有檢定的並排，全程可用那一組看起來不是偏高」，或標成我的讀法。
4. 第 216、234 行「Kestin 沒有預先註冊」：紀錄的原話是「原文沒有提到預先註冊」。建議照這個寫法。
5. 第 58 行：「依據是另一批訪談」之後緊接「17 人的訪談裡」，讀起來像同一批。紀錄第 15 項：詮釋 Q3 的那批訪談人數原文沒寫，和 17 人訪談是兩批。建議寫成「依據是另一批訪談（人數原文沒寫）……另外，主要的 17 人訪談裡……」。
6. 第 106 行「2,900 名有交作業的學員」：紀錄寫的是成績 1 分以上的 5,992 人裡、事前問卷必要題都有效作答的 2,900 人。建議補「且填了開課問卷」，不然讀者會以為是全部交作業的人。
7. 第 94 行「今年把選擇題嵌在影片裡」：報告是 2023 年交的，「今年」指的是實驗那一屆。建議改「實驗那一屆」。
8. 第 20 行與第 250 行的 Visits 定義：Cloudflare 文件是「A page view that originated from a different website or direct link」。兩處都只寫了「來自別的網站」。第 10、19 篇也是同樣寫法，所以不算和已發佈篇不一致；要補就三篇一起補。
9. 第 170 行「本站沒有分析過聊天內容」：這是站內事實，我沒辦法從 repo 確認或否定（`src/lib/pipeline/` 有 glossary-gap 模組讀名詞解釋的統計，沒看到分析 chat_logs 的模組，但沒有逐一查）。建議作者自己確認一次。
10. 標題「不代表他學到了」用「他」指泛稱的讀者。系列規劃檔就是這個標題，不是在指研究者，不違反代名詞規則；若想全站一致避開，可改「不代表讀者學到了」。這一條只供參考。

## 沒問題的項目

**來源核對**（每個數字與引文都回抽取紀錄核過；英文引文另回原文檔逐字 grep）：
- Deslauriers：149 人、交叉、課後先填問卷再考、+0.46／−0.56（穩健標準誤 0.10／0.13）、四題合成 FOL 的組成、「virtually identical」、0.51、交互作用 p < .05 沒印係數、15／17、期中 −0.20／0.26。引文「Notably, the type of instruction…」與 XML 逐字相同。
- Bastani：839 人、班級隨機、+48%／+127%（未預註冊）、−0.054／−0.004、t 檢定 −0.035／−0.006、Table B.8 各係數。正文引文與原文逐字相同；感受只在 SI 這一點有寫。「沒有測到差異（點估計負的）、不能寫成覺得一樣好」寫法正確。
- Lehmann：107／69 人、+0.338（SE 0.166，p = 0.044，N = 176，探索性）、+0.154、−0.672、Study 3 學習階段 +2.614、後測 p = 0.580／0.298。引文逐字相同。「自評大致跟著實際進步走，有工具的人整體往上偏」照紀錄的但書寫。
- Fischer：334 人、+0.337／+0.132／差 0.21（p = 0.066）、自估 +0.195／+0.217、喜歡 +0.308／+0.199。「somewhat overconfident」「slightly underconfident」對原文（PDF 斷字 some-what）逐字相同，歸給作者、寫明沒有檢定。
- Kestin：投入 4.1 對 3.6、動機、喜歡與成長心態沒有測到差異、0.63、沒有問自評學習、142／174 對不上 194。把它和 Deslauriers 區分成「投入感 vs 自評學習」，照紀錄的但書寫。
- 長濱與森田：75 人、檢定力 0.17–0.65、再生分數遞減、評價是考後另看短版剪輯、1.5 倍速評價最高、日英文摘要差異。
- 大浦等：8.35、1.15（p = .161）、1.01、思考力只含修了者、中位數超過片長、7% 前後都填、反轉組自選小樣本只放附錄並註明。
- 東華報告：49／41 人、觀看時間 11,400 對 8,898 單位未註明、t = 2.03、10.42 對 10.31（F = 0.40）、74 對 90 份問卷、研究目的列了但沒報的項目。
- Chen：除 M1 外都相符；「did not observe any consistent trend」「Unfortunately, most MOOC video studies…」「did not result in eye opening discovery or solid conclusions」逐字相同，評語標成作者看法。
- Yu：0.95／0.98、14 個特徵含 4 個測驗相關、「pass (1) and fail (0) of the course」逐字相同、0.91 基準線標成我用原文人數算的。
- Koedinger 2015：0.44 對 0.065、小考同題庫、期末 16%／15%／31%、作者的因果主張與限制分開寫。和第 8、9 篇的說法一致。
- Salvador：除建議 2 外都相符；引文「The idea was more sessions = better for learning. If you do more, you learn more, right? Not quite!」與「rough formula」逐字相同。
- Klose 2022、Uttl 2017 照規則只寫「研究存在、沒讀到合法公開全文」，沒有引數字，也沒列進參考資料。
- 參考資料每一筆都有 DOI 或合法公開網址，註明版本與沒讀的部分。

**主線指定要看的點**：
- 東華報告：封面標「延後公開」、由東華大學教學卓越中心網站公開，`provenance.md` 第 44、85 行已記這件事。文章在第 104 行（「計畫成果報告，沒有同儕審查」）、第 216 行（證據等級）、第 240 行（附錄寫明網站公開與封面標延後公開）、第 263 行（參考資料「未經同儕審查」）都交代了，第 38 行表格也寫「一份未經審查的報告」。主線判定可用，文章寫法符合要求。
- Fischer 自評與實際的並排：比較是作者做的（紀錄第 23 項，L704–711），文章寫「作者據此說」「這是把兩張表的係數並排比，沒有做檢定」，附錄也寫「作者把自估與實際並排比較，沒有檢定」。歸屬正確，不是本站做的比較，所以不需要標成本站比較。唯一的問題是第 123 行由此推出的那句結論，見建議 3。
- 本站現況，對過 repo 與 Cloudflare 文件（2026-10-15 09:40 前後）：
  - 用瀏覽器 UA 抓 `https://quidproquo.cc/`，HTML 裡有 `cloudflareinsights.com/beacon.min.js`；`src/` 與設定檔沒有這段程式。「正式站至少載入了……在邊緣自動注入的，不在網站的程式裡」成立。
  - High-level metrics 頁（Last updated Apr 16, 2026）列 Visits、Page views、Page load time、Core Web Vitals；FAQ「Does Web Analytics support custom events? Not yet, but we may add support for this in the future.」逐字相同。
  - 寫法和第 10、19 篇一致：「正式站至少載入了」、tldr 與限制節的「流量統計是匯總的」。差別只有多列了 Core Web Vitals（文件有）、少了「不收集訪客的個人資料」，都不是矛盾。
  - 名詞解釋的資料表結構與寫入路徑相符（計數細節見建議 1）；聊天見 M3。
  - `course-guide-contract.md` 第 71、72、73 行（獨立審稿、verify 綠不能替代教學驗收、不能宣稱 lint 能判斷學會與否）與第 200 行、對照表相符。
- 不顯著的寫法：全篇都寫「沒有測到差異」，沒有出現「沒有效果」「一樣好」；第 72、92、217 行還特別說明不能這樣讀。
- 英文引號內的文字：上面列的全部逐字相符。
- 研究者代名詞：全文沒有用「他／她」指研究者（第 141 行「他們」指 Duolingo 團隊）。
- 粗體：掃過全部 `**`，沒有收尾 `**` 緊接在全形標點之後又接文字的情形；附錄的「（2019）**，」收尾後接標點，可以渲染。
- 和第 8、15 篇的關係：Deslauriers 的設計與主數字只在這篇帶一句並連到第 8 篇；交互作用一段明寫「第 15 篇談過這一點」，用詞（前測 × 覺得學到很多、p < .05、沒印係數）和第 15 篇第 111、265 行一致。第 8 篇第 227 行預告「之後的篇會專門談讀者與作者手上的訊號」，這篇就是那一篇。沒有找到矛盾。第 15 篇的 0.18 在本篇第 16 行引用一致。
- 開頭的取樣偏誤：第 29 行寫了挑選標準、對象多是大學生或高中生、在課堂或實驗室、立即測、沒有一篇是網頁長文讀者。
- 推論標記：第 105、125、170、192 行與「可以做的事」五條、規格對照表都標了是本站的推論或判斷，並寫出依據。
- 來源說法不同的地方：四組衝突並列、沒有選邊。
- 站內連結：第 8、9、10、15 篇的檔案都在，order 對得上。order 26 的檔案已在工作區（`draft: false`、尚未 commit），文章第 27 行用「之後的篇」不放連結，符合寫稿說明。
- 外部連結（curl，瀏覽器 UA）：15 個 200；5 個 DOI（PNAS ×3、ACM、MDPI）跟隨轉址後 403，不跟隨時 doi.org 都回 302 到正確的出版者頁，是出版者擋機器人，不是死連結。
- 用語：替換表檢查器零命中，我讀的時候也沒看到中國用語。

## 需要人判斷的事，我的判斷

- 東華報告用不用：可以用，文章已照實標未經同儕審查、對照組是前一年、有效問卷數不一致，四處交代足夠。
- Fischer 段：歸屬正確，只需改建議 3 那一句。

## 我沒做的事

- 沒有回頭讀任何一篇論文的原文全文，數字以抽取紀錄為準（抽查已在 `_audit/` 全部通過）；只針對英文引文回原文檔逐字比對。
- 沒有連 D1 或 Cloudflare 後台看實際資料（例如 chat_logs 有沒有被分析過、名詞解釋表在正式區有沒有資料）。
- 沒有跑 `pnpm dev`／build，沒看渲染後的頁面；粗體與表格是讀原始碼判斷的。
- 沒有逐一查 `src/lib/pipeline/` 下有沒有讀 chat_logs 的分析模組（建議 9）。

## 2026-10-15 複審（接手後）

- sha256 審前（2026-10-15 11:05 CST 前後）：`b055bb5b2a1a5f7ea97417d72d57300903a7bd81fe3e1a1d15f615197a7643b2`
- sha256 審後（2026-10-15 11:23 CST）：`b055bb5b2a1a5f7ea97417d72d57300903a7bd81fe3e1a1d15f615197a7643b2`（相同，複審期間沒有人改檔）
- 複審者沒有參與撰寫與改稿。上一版文章沒有留存，無法 diff；改動段落依上一輪報告的行號與內容定位，並把那些段落前後文整段重讀。
- 自動檢查：`check-tw-terms.mjs` 0 blocking、0 to review；`check-post-quality.mjs` 無問題；`check-process-leak.mjs <檔>` exit 0、沒有輸出。
- 粗體：用 perl 掃「全形或半形標點＋`**`＋非空白非標點」，零命中。
- 代名詞：「他們」出現在第 58（學生）、68、72（實驗組學生）、108（修了者）、141、147（Duolingo 團隊），沒有用「他／她」指研究者。
- 不顯著寫法：全文沒有「沒有效果」「一樣好」（第 72 行的「一樣好」是在說不能這樣寫）。

### 上一輪各項的處理（現在的行號）

| 項 | 狀態 | 現在 |
|---|---|---|
| M1 Chen 投入指標 | 已改 | 第 182 行「長觀看比例只有一支影片顯著，平均觀看時間三支有顯著差異但方向不一致，學習有兩支顯著但方向相反」，和第 112 行、附錄第 244 行、紀錄 Table 5 一致。 |
| M2 Deslauriers 補充迴歸 | 已改 | 第 54 行小標改為「把『講得好』放進去，教法就不顯著了」；第 36 行表格「一題就能預測」；第 60 行改為「高度相關，而且放進前者之後，教法本身不再預測後者」。「高度」仍是原文沒給的量，見下方建議 1。 |
| M3 聊天紀錄 | 已改，但引出新問題 | 第 22 行：完成後才寫入、命中快取不記、沒產生完不記、存對話串編號／IP／站主標記，皆與 `src/pages/api/chat.ts:137–160、352–358` 相符。第 165 行表格補了「命中快取的不記，含站主測試」。第 170 行新寫的「網站程式只寫入這份紀錄，沒有讀它的地方」見下方 R-M1。 |
| 建議 1 名詞解釋計數 | 已改 | 第 21 行。快取鍵是 `term:level:context`（`src/pages/posts/[...slug].astro:1260`），context 由 `sentenceAround(button)` 取得，「同一句上下文」寫法正確；伺服器端每次請求都 `recordLookup`（`src/pages/api/glossary/explain.ts:175`）。 |
| 建議 2 Duolingo 計數 | 已改 | 第 41、141、149 行一致（換兩次、中間另調整一次）。第 149 行新增句子的問題見建議 2。 |
| 建議 3 Fischer 結論句 | 已改 | 第 123 行「依作者這個沒有檢定的並排……所以我不把……當成每一組都成立」，標成作者的並排、我的取捨。 |
| 建議 4 Kestin 預註冊 | 已改 | 第 216、234 行都寫「原文沒有提到預先註冊」。 |
| 建議 5 兩批訪談 | 已改 | 第 58 行「另一批訪談（人數原文沒寫）……另外，主要的 17 人訪談裡」，和紀錄第 12、15 項相符。 |
| 建議 6 大浦樣本 | 已改 | 第 106 行 2,900 人與 1,224 人的條件都和 `oura2018-flipped-mooc.md` 第 24、25 行相符。 |
| 建議 7 「今年」 | 已改 | 第 94 行「實驗那一屆」。 |
| 建議 8 Visits 定義 | 已改（只改本篇） | 第 20 行「從別的網站連過來、還是直接開啟的（來源網址和本站主機名不同）」，第 250 行附錄引原文。2026-10-15 11:15 用 curl 抓 High-level metrics 的 index.md，原文為「A page view that originated from a different website or direct link. Cloudflare checks where the HTTP referer does not match the hostname.」相符。第 10、19 篇仍是舊寫法，兩篇是說法較省略、不是矛盾，要不要一起補由主線決定。 |
| 建議 9 聊天有沒有被分析 | 已改寫，但改寫後的句子不完整 | 見 R-M1。 |
| 建議 10 標題代名詞 | 已改 | 標題改成「不代表讀者學到了」。 |

### 必須修

**R-M1. 第 170 行（連帶第 22 行、第 165 行）：聊天內容不只記在 `chat_logs`，站主有地方看得到提問。**
第 170 行：「我沒有找到分析聊天內容的程式，網站程式只寫入這份紀錄，沒有讀它的地方。」就 `chat_logs` 這張表而言是對的（全 repo 的 `src/`、`scripts/` 沒有任何 SELECT `chat_logs`）。但同一次聊天另外寫了兩處：
1. `rag_trace_steps`：每個步驟的 `input_summary` 是提問的前 240 字（`src/lib/conversation/graph.ts:216`、`pipelines/manual.ts:58`、`engines/agent/query.ts:122`；寫入在 `src/pages/api/chat.ts` 的 `persistTraceSteps`）。後台 `src/pages/admin/settings/site/traces.astro:415–434` 經 `src/pages/api/admin/site/traces/[id].ts` 讀出並顯示每步的輸入與輸出摘要；`src/pages/api/admin/site/stats/rag.ts` 用它算期間內的提問數與平均延遲。這張表有保留期限設定（`traces/retention.ts`）。
2. Langfuse：`chat.ts:165–169` 以 `input: { message }` 建 trace，完成時以 `output: { response }` 更新（`chat.ts:360` 起），有設金鑰時送到外部的 Langfuse；後台 trace 頁有連到 Langfuse 的連結。正式區有沒有設金鑰我沒有查。
兩者也都在快取檢查之後，所以「命中快取的不記」對三處都成立。讀者讀到第 22 行與第 170 行，會以為站主手上沒有任何看聊天內容的介面，和現況不符。建議第 22 行補「同一則提問的前 240 字也會留在後台的步驟紀錄裡，後台有頁面可以逐則看；有設定 Langfuse 時，完整提問與回答也會送過去」，第 170 行改成「後台有逐則看步驟紀錄的頁面，也有計算提問數的統計，但沒有分析提問內容的程式（例如歸類讀者卡在哪裡）」。結論（量不到學到沒有）不受影響。

### 建議修

1. 第 60 行「高度相關」：原文只報 Q3 高者 Q2 高 0.51 SD（p < 0.001），沒有相關係數；「高度」是原文沒有的量。建議改「明顯相關（『教得有效』高的學生，『學到很多』高 0.51 個標準差）」。
2. 第 149 行「沒有一次是拿指標和另外量的學習比，發現對不上」：紀錄第 7 項，改成「每天至少 15 分鐘的比例」的依據之一是「several formal studies」（沒有引用、內容不明）。建議補一句「改成每天 15 分鐘門檻時說參考了幾項正式研究，但沒有引用，也看不出研究量的是什麼」，避免讀者以為作者完全沒提研究。
3. 第 10、19 篇的 Visits 定義（上一輪建議 8 的後半）：本篇已補直接開啟與判定方式，另外兩篇沒有；不構成矛盾，是否同步由主線決定。

### 沒問題的項目（本輪新看的）

- 第 21、22 行與 `explain.ts`、`[...slug].astro`、`chat.ts` 的行為逐點相符（R-M1 指出的是遺漏，不是寫錯）。
- 第 58、60、106、112、123、141–149、182、216、234、250 行與抽取紀錄（deslauriers2019 第 12–15 項與圖 1/2 表、oura2018 第 24–25 行、fischer2025 第 20–23 項、chen2016 Table 5、salvador2024 第 2–11 項）相符；第 60 行「兩者都沒有跟著實際測驗走」在組層級成立（紀錄圖 1/2 目測：Q2、Q3 都是被動組較高，TOL 主動組較高）。
- 推論標記：第 60、123、170、192 行與「可以做的事」都還標著本站判斷。
- 用語：沒看到替換表的中國用語；「支持」（第 155 行）是論證意義，「1% 水準」是統計顯著水準，都不是替換對象。

### 結論

不通過，原因只有 R-M1 一項（站內現況寫得不完整、會誤導）。改完 R-M1 即可通過，建議 1、2 可一併處理。

### 我沒做的事

- 沒有上一版文章可 diff，改動段落是依上一輪報告定位，其他段落只做全文掃描、沒有逐數字重核（上一輪已核過）。
- 沒有重跑外部連結的 curl（只抓了 Cloudflare High-level metrics 頁）。
- 沒有連 D1、Cloudflare 或 Langfuse 後台，不知道正式區 `rag_trace_steps` 的保留天數實際設定、Langfuse 金鑰有沒有設。
- 沒有跑 `pnpm dev`／build，沒看渲染結果；沒有 commit。

## 2026-10-15 英文稿審稿

- 審稿者沒有參與撰寫、改稿或翻譯。
- 英文稿 `2026-10-14-reader-signals-vs-learning-en.md` sha256：審前（11:50 CST）`a6581407b630f6aef837f7c36e1d21bf1f6187375bea5c23ff51e01a280f1192`；審後（12:07 CST）相同。
- 中文稿 `2026-10-14-reader-signals-vs-learning.md` sha256：審前（11:50 CST）`f49165998470475990d0df9404c533b264fab631bdfc3f314f50871602e59431`；審後（12:07 CST）相同。審稿期間沒有人改這兩個檔。
- 自動檢查：`check-post-quality.mjs <英文檔>` 回 `OK: checked 1 post file, no quality issues found.`；`check-process-leak.mjs <英文檔>` exit 0；`check-lang-parity.mjs` 全站 2810 對，0 問題；中文稿 `check-tw-terms.mjs` 0 blocking、0 to review。

### 中文稿有沒有別的改動（任務 b）

**有。除了 English version 那一行，中文稿和上一輪複審時的版本（`b055bb5b…`）還差 6 處。**
做法：拿現在的中文稿，拿掉 English version 那一行，再把主線 session 紀錄（`~/.pi/agent/sessions/…/2026-10-15T03-02-27…jsonl`，03:35Z 兩次 python 替換）的改動逆向還原，得到的 sha256 正好是 `b055bb5b2a1a5f7ea97417d72d57300903a7bd81fe3e1a1d15f615197a7643b2`，所以差異只有下面這些，沒有別的：

1. 第 22 行：補「同一則提問的前 240 字也會留在後台的步驟紀錄裡，站主可以逐則看；有設定 Langfuse 時，完整的提問與回答也會送過去。」（R-M1）
2. 第 170 行：「我沒有找到分析聊天內容的程式，網站程式只寫入這份紀錄，沒有讀它的地方。」改成「後台有逐則看步驟紀錄的頁面和期間內的提問數統計，但我沒有找到分析提問內容的程式。」（R-M1）
3. 第 60 行：「高度相關」改成「明顯相關（前者高的人，後者高 0.51 個標準差）」（複審建議 1）
4. 第 149 行：補「改成每天 15 分鐘的門檻時，文章說參考了「several formal studies」，但沒有引用也沒有連結」（複審建議 2）
5–6. 第 20 行與附錄第 250 行：「主機名」改成「主機名稱」（全站用語統一）。

這幾處是主線依複審報告改的，報告裡沒有它們的獨立複審紀錄（複審結論是「不通過，改完 R-M1 即可通過」）。我這次順手核了：
- 第 22 行：`src/lib/conversation/graph.ts:216`、`pipelines/manual.ts:58`、`engines/agent/query.ts:122` 都是 `input.message.slice(0, 240)`；`chat.ts:165–169` 的 Langfuse trace `input: { message }`、`chat.ts:362–363` `output: { response }`；兩者都在快取檢查（`chat.ts:138–162`）之後。相符。小細節：後台頁 `traces.astro:422` 顯示時再截成 200 字（`truncate(step.input_summary, 200)`），資料庫裡是 240 字；「留在步驟紀錄裡」這句沒錯，見建議修 9。
- 第 170 行：`traces.astro:415–434` 逐步顯示輸入摘要、`api/admin/site/stats/rag.ts:21–26` 從 `rag_trace_steps` 算用量，相符。
- 第 60 行 0.51、第 149 行「several formal studies」：分別回 `deslauriers2019pnas_PMC6765278.txt` 與 `duolingo2024-tslw.txt` 逐字找到。
- 「主機名稱」：替換表檢查 0 命中。
結論：R-M1 與兩項建議已正確處理，我認為可以視為結案；但「English version 那一行是唯一改動」這個前提不成立，主線要知道中文稿在複審後還改過這 6 處。

### 必須修

（無）

### 建議修

1. 第 96 行、第 242 行：「Lai Chih-Hung」是姓前名後，和全文其他人名（Chen-Hsiang Yu、Toru Nagahama）順序不一致。東華資工系教師頁的英文姓名是「Chih-Hung Lai」（拼法正確，順序不同）；報告 PDF 本身只有中文名。建議正文改 Chih-Hung Lai，附錄標頭照其他條目只寫姓：Lai (2023)。
2. 第 240 行：gacco 課名後的「(Freedom and Equality in Medieval Japan)」是譯者加的英譯；論文（`oura2018flipped.txt`，含英文 Summary）與 J-STAGE 英文頁都沒有官方英文課名。建議標明是譯文，例如「(roughly, Freedom and Equality in Medieval Japan)」，或拿掉。
3. 第 96、242、265 行：「National Dong Hwa University's Center for Teaching Excellence」用大寫寫成專有名稱，但中心網站只有中文標題（`<title>教學卓越中心 - 國立東華大學教學卓越中心</title>`），我查不到官方英文名。建議改成小寫描述（the university's teaching excellence center）。其餘譯名已核對無誤：Toru Nagahama、Yusuke Morita、Hiroki Oura、Ikejiri、Fushikida、Anzai、Yamauchi 對原文 PDF 的英文署名；Japan Journal of Educational Technology 對 J-STAGE 英文頁；MOE Teaching Practice Research Program 對報告封面；Fischer 的「Technical University of Berlin」原文 L269。
4. 第 18 行：「Part 25 … and the first part of its sixth section」裡 part 一字兩義（篇與部分），建議改「the first article in its sixth section」。同段「how much can the things readers tell the author, and the behavioral traces they leave, tell the author?」tell the author 重複，建議改「how much do readers' remarks and the traces they leave actually tell the author?」。
5. 第 31 行：選來源那一句 108 字，括號裡又有分號串列。建議把「I ended up reading these:」後的清單拆成獨立句或條列。
6. 翻譯腔：第 62 行「Three limitations need to stay attached.」、第 110 行「Three conditions need to travel with this.」、第 106 行「The evidence level of this report should be recorded as it is」（無主詞被動）。建議改「Three limitations come with this.」「Three caveats apply.」「This report's evidence should be stated plainly:」。
7. 第 74 行「it can't be written as them feeling they did just as well」：直譯「不能寫成」。建議「it does not mean they felt they did just as well」。（意思沒錯，不是把不顯著寫成 the same。）
8. 第 184 行：「the authors called drag-and-drop questions leading to more correct answers on later practice questions (looking only at …) "quicker learning"」很難斷句。建議拆成：「In Chen and colleagues' other experiment, students who started with drag-and-drop questions got more later practice questions right (counting only those who got the first one wrong), and the authors called this "quicker learning".」
9. 第 24 行「The first 240 characters of each question」：中文是「同一則提問」，指的是有被記下的那些；each 會讓人以為連命中快取的也有。建議改「of these same questions」。後台頁顯示時截成 200 字一事，中英都沒寫，不算錯，要精確可補。
10. 第 54、58、62、190 行與附錄第 228 行：「學到很多」一下譯 learned a great deal、一下譯 learned a lot／feeling of having learned a lot，建議全文統一一種。
11. 第 8 行 description「What the signals in the hands of an author without exams each measure」讀起來卡，建議「What each signal available to an author who gives no exams actually measures」。
12. 第 202 行（規格段）88 字一句，建議在冒號後拆成三句。
13. （不在本篇範圍，供主線參考）中文稿第 25、28 篇寫「第六部分」，第 26、27 篇寫「最後一部分」；英文稿照各自中文翻，所以第 25 篇英文「sixth section」與第 27 篇英文「last section」並存。要統一就四篇中英一起改。

### 沒問題的項目

- **數字**：去掉網址後抽出全部數字比對，中英唯一差異是寫法換算（七成→70%、110 萬／180 萬→1.1／1.8 million、2014 年 4 月→April 2014），沒有漏或多。
- **結構**：標題 19／19、表格列 24／24、外部連結 33／33 且順序相同、粗體標記 82／82、附錄 12 條、參考資料 13 條，逐表逐列對過內容。
- **內容沒有增刪**：逐段對讀，沒找到英文新增或刪去的說法。英文多出的只有：小標「to the model」（說明是迴歸模型，原文就是補充迴歸）、參考資料的 (in Japanese)／(in Chinese)（站內既有慣例，89 篇英文稿用過）、賴志宏後附漢字。
- **英文引號逐字**：用腳本把英文稿所有雙引號與 blockquote 內文對 `.research/raw/learning-content/q6-evaluate/` 原文（去換行連字號、壓空白）比對：Deslauriers「virtually identical」與 Notably 一句、Lehmann「Thus, LLMs…」、Bastani blockquote、Chen 三句與「quicker learning」、Yu 題名、Duolingo 三處（含新補的「several formal studies」）、「示唆された」都命中。未直接命中的另外核：Fischer「somewhat overconfident」「slightly underconfident」在 PDF L706–707（some-／what 斷行）；Yu「pass (1) and fail (0) of the course」在 `yu2019taiwanmooc.md:96`；Bastani「potentially overvalue its benefits」在 `bastani2025pnas_sapp.txt:925`；Cloudflare 兩句 12:00 用 curl 抓 index.md，High-level metrics 第 19 行與 FAQ 第 222 行逐字相同。系列名與分段名的引號是站內慣例。
- **中文「」轉述沒有變成英文引號**：問卷題目、「很清楚」「這頁有幫助嗎」「學到很多」等都改成斜體；83% 那句也沒加引號。
- **代名詞**：全文沒有 he/she/his/her/him 指任何人；Duolingo 用 the author、they 指團隊。
- **不顯著寫法**：全部是 no difference was detected／not significant。the same 的出現處都不是在說不顯著（第 120 行 16% 和 15% 是 about the same，對應中文「差不多」，是描述數字；第 94、219 行是在說不能這樣讀）。沒有 no effect。
- **推論標記**：第 62、102、127、137（I calculated）、172、194 行與規格表的 that is my reading、可以做的事開頭的 this site's judgment，對應中文的每一處都在。
- **站內連結**：Part 8、9、10、15 的 -en 檔都存在、`draft: false`、order 對；中文版連結存在。第 26 篇沒放連結，和中文「之後的篇」一致。
- **篇號**：一律 Part N（8、9、10、15、25）。

### 我沒做的事

- 沒有重抓 PDF 核每個數字，數字以中文稿（上兩輪已對抽取紀錄核過）為準，只做中英對照；英文引文回原文檔逐字比對過。
- 沒有重測外部連結狀態碼（英文稿的 33 個連結和中文稿逐一相同、順序相同）；只用 curl 抓了 Cloudflare 兩頁、J-STAGE 英文頁、東華教學卓越中心首頁，另用 DuckDuckGo 查到東華資工系教師頁的英文姓名。
- 沒有查 gacco 有沒有官方英文課名（論文與 J-STAGE 都沒有）。
- 沒有連 D1、Cloudflare 或 Langfuse 後台。
- 沒有跑 `pnpm dev`／build、沒看渲染結果、沒有改文章、沒有 commit。
