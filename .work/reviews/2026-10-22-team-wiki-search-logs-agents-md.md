# 審稿紀錄：知識庫怎麼建 order 10〈找得到：用搜尋紀錄找出缺口，以及開始讀團隊文件的 AI〉

- 審稿對象：`src/content/posts/learning/2026-10-22-team-wiki-search-logs-agents-md.md`（zh）、`src/content/posts/learning/2026-10-22-team-wiki-search-logs-agents-md-en.md`（en）
- 日期：2026-10-22
- 審稿員：獨立審稿（未參與寫作），一輪做完 post-verify／post-review／post-polish；未改文章。另附 order 1、2 稽核修正核對（任務 B）。
- 證據：`.work/research/building-knowledge-bases/extractions/` 的 nng-search-log-analysis、nng-internal-search-7-ways、cleverley-burnett-2019-enterprise-search-satisfaction、cleverley-2023-covid-enterprise-search、huurdeman-2018-oria-zero-result、llmstxt-spec、agentsmd-site、chatlatanagulchai-2025-agent-readmes、gloaguen-2026-evaluating-agentsmd、lulla-2026-agentsmd-efficiency、ahrefs-2026-llmstxt-study、aghajani-2019-doc-issues-unveiled；有疑義處回 scratchpad 全文（`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/` 下的 o10-cleverley-burnett-2019-es-satisfaction.txt、o10-cleverley-covid-pmc.txt、o10-gloaguen-agentsmd-v3.txt）。另對照 `.work/series-plans/building-knowledge-bases.md`（order 10 範圍卡 L223–233、斷崖處理 L86）、order 6、7、9 正文、站內 `src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md`。規則依 repo 版 `.agents/skills/post/references/writing-guide.md`。未上網。
- 行號：zh／en 逐行對齊（兩檔都是 145 行），以下同一行號。
- 機器檢查：`check-process-leak.mjs` zh 0；`pnpm check:tw` 0 blocking／0 review；`register-scan.sh` 轉折段落 12／38（31%，略過 30% 閾值）、單段 4 個以上數字 2 段（19、36 行）、研究者姓名當主詞 1（en 2）、模板化轉折 0；`scan-ledger.sh` 0；`pnpm check:references` 對這兩檔無錯誤無警告（全站唯一錯誤在另一篇 tech 文章）。站內連結 `/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf`（及 `-en`）存在。

統計：🔴 4／🟡 8／🟢 10

---

## post-verify

### 已核對無誤（摘要，不另列條目）

| 位置 | 說法 | 依據 |
|---|---|---|
| 23 | Aghajani 2019：一半的可用性問題是有寫但找不到 | aghajani 紀錄 L52–54；order 6 L23 確有提過 |
| 25 | Huurdeman 50 筆零結果只有一成真的沒有 | huurdeman 紀錄 L19–23 |
| 27 | Cleverley & Burnett：上千則回饋、三類、資訊類 36%、「improving the organization…」原句、換引擎循環 | cleverley-burnett 紀錄 L13、L19、L25、L30；全文 L540–544（該公司確實換過幾代搜尋引擎）。資訊類含「標題／標籤沒標好」見全文 L376 Table 2 |
| 33–35 | NN/g：前 1,000 名、3–6 個月、零結果只看次數多的、連續查詢是唯一需要識別碼的分析 | nng-search-log 紀錄 L24、L27–29、L43 |
| 36 | Cleverley 2023：129 次查詢 1 次點擊；公司沒人看搜尋紀錄 | cleverley-2023 紀錄 L18–19；全文 L306–308 |
| 38 | NN/g 跑前 100 名；Huurdeman 熱門 50 名兩成找不到 | nng-search-log 紀錄 L41；huurdeman 紀錄 L27 |
| 54–55 | 同義詞只佔 5%；best bets 做成獨立區塊會被忽略；Cleverley & Burnett 也看到 | cleverley-burnett 紀錄 L23、L27；全文 L654–670；nng-internal-search 紀錄 L18 |
| 57 | 標題權重最高、模板強制填標題 | cleverley-burnett 紀錄 L26；全文 L558 |
| 61 | 心理健康查詢上升、怕被回溯；NN/g 個資四條 | cleverley-2023 紀錄 L24；全文 L312–320；nng-search-log 紀錄 L44 |
| 67 | AGENTS.md「README for agents」「anything you'd tell a new teammate」 | agentsmd-site 紀錄 L17、L20 |
| 72 | Chatlatanagulchai：2,303 份、多數改過不只一次、92% 實質修改、以新增為主、context debt 是作者提出的風險；「亂」寫成「還沒有人量過」 | chatlatanagulchai 紀錄 L16、L25–27、L32、L44–47。**「亂」沒有寫成實測，符合紀錄的建議改寫** |
| 74 | Gloaguen：LLM 檔成功率沒提高、成本約兩成（+20%／+23%）；開發者檔略升不顯著（+2.4%，p=0.21）、成本「近兩成」（正文 at most 19%）；指令會被照做；概覽沒幫助；預印本 | gloaguen 紀錄 L21–26、L48；全文 L360–368。方向與數字都對，沒有把摘要的「over 20%」套到開發者檔 |
| 76 | Lulla 只用一種 agent；時間、輸出 token 減少；總 token 持平 | lulla 紀錄 L15、L19–21 |
| 78 | Ahrefs 97% 一個月零請求；AI 只在被連結或被指示時抓；廠商資料、客戶偏 SEO | ahrefs 紀錄 L13、L19、L22 |
| 80 | Gloaguen 建議：暫不用 LLM 檔；人寫的只放 README 沒有的；採用前評估 | gloaguen 紀錄 L32 |

### 🔴 V1　「Cleverley 那兩篇是同一家公司」沒有出處

- 位置：zh 117；en 117
- 原句：zh「搜尋的研究各是單一組織：Cleverley 那兩篇是同一家公司」；en「both Cleverley papers are from the same company」
- 依據：cleverley-burnett-2019 紀錄 L13（大型油氣跨國企業，2013–2015）；cleverley-2023 紀錄 L13（「單一知識密集跨國企業」，10 萬人以上）；全文 o10-cleverley-covid-pmc.txt L176：「A large knowledge-intensive multinational corporation with over 100,000 staff … The organisation is to remain anonymous」。2023 篇匿名，兩篇都沒說是同一家。
- 改法：
  - zh：「搜尋的研究各是單一組織：Cleverley 那兩篇各研究一家大型跨國企業，Huurdeman 是一間大學圖書館，而且都是關鍵字搜尋的年代；NN/g 的是實務說明。」
  - en：「Each search study covers a single organization: each Cleverley paper studies one large multinational, Huurdeman's is one university library, and all come from the keyword-search era; NN/g's is a practical guide.」

### 🔴 V2　Gloaguen「刪掉其他文件後才有幫助」只適用 LLM 產生的檔，作者明說開發者檔不是重複

- 位置：zh 74；en 74
- 原句：zh「另一個發現是：把 repo 裡其他文件都刪掉之後，這類檔案就有幫助了；換句話說，它們多半在重複 README 已經寫過的東西。」；en「Another finding: once the repo's other documentation was removed, the files did help; in other words, they were mostly repeating what the README already said.」
- 依據：gloaguen 紀錄 L31；全文 o10-gloaguen-agentsmd-v3.txt L1002–1029：「Our hypothesis is that LLM-generated context files are mostly redundant with existing documentation, while developer-provided context files add additional information. … LLM-generated context files not only consistently improve performance by 2.7% on average, but also outperform developer-written ones」。刪的是所有 .md、範例與 docs/，不只 README；這個實驗也排除了 Claude Code。正文把「重複」套到所有 context file，方向與作者對開發者檔的說法相反；讀者寫的正是開發者檔。
- 改法：
  - zh：「另一個發現是：把 repo 裡其他文件（.md 檔、範例、docs/）都刪掉之後，LLM 產生的檔案就有幫助了，甚至勝過開發者寫的。作者據此認為，LLM 產生的檔案多半在重複既有文件，開發者寫的才會補上新資訊。這篇還是預印本。」
  - en：「Another finding: once the repo's other documentation (.md files, examples, docs/) was removed, LLM-generated files did help, and even beat the developer-written ones. The authors take this to mean that LLM-generated files mostly repeat existing documentation, while developer-written ones add new information. This is still a preprint.」
  - 連帶：101–111 的表格第 4 列「從其他文件複製來的長段說明：刪掉，連到原處」仍成立（依據改為作者建議 gloaguen 紀錄 L32，以及 Aghajani 觀察到重複內容多半以連結取代，aghajani 紀錄 L60），不必改。

### 🔴 V3　自我檢查「新的引擎一樣不知道『請假』就是『休假』」說過頭

- 位置：zh 130；en 130
- 原句：zh「換搜尋引擎通常解決不了這個問題，因為新的引擎一樣不知道「請假」就是「休假」。」；en「A new search engine usually won't fix this, because it won't know that "leave" means "time off" either.」
- 依據：這句對「換一套關鍵字引擎」成立，但不是一般事實。本文自己在 117 行說來源都是關鍵字搜尋的年代；站內〈Hybrid Search〉第 19–21、159 行明說向量搜尋抓語意，正好能接起同義詞；範圍卡 L232 的連結就是這篇，正文卻只把它放在參考資料（見 R2）。Cleverley & Burnett 全文 L544 也記下該公司第二代引擎用 statistical conceptual searching，反而讓部分使用者困惑——引擎換成語意式不保證滿意，但「一樣不知道」不對。
- 改法：
  - zh：「換一套同樣靠關鍵字比對的搜尋引擎，通常解決不了這個問題，因為它一樣不知道「請假」就是「休假」。有語意（向量）搜尋的引擎比較接得起這種詞（見[〈Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區〉](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)），但那是另一個更貴的決定；改標題幾分鐘就做完。」
  - en：「Switching to another keyword-matching engine usually won't fix this, because it won't know that "leave" means "time off" either. Engines with semantic (vector) search are better at bridging words like these (see [Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)), but that's a separate and more expensive decision; retitling a page takes minutes.」

### 🟡 V4　Huurdeman「其他的是……」漏掉兩成判斷不出原因

- 位置：zh 25；en 25
- 原句：zh「其他的是直接貼了整段引文、拼錯字、選錯搜尋範圍、資料沒被索引。」；en「the rest were whole citations pasted in, misspellings, the wrong search scope, or items that hadn't been indexed.」
- 依據：huurdeman 紀錄 L19–26：貼引文 22%、拼錯 20%、範圍 12%、真的沒有 10%、未索引 6%、語法 2%、**判斷不出 20%**。「其他的是」讀起來像其餘九成都歸了因。
- 改法：
  - zh：「其他的多半是直接貼了整段引文、拼錯字、選錯搜尋範圍、資料沒被索引；還有兩成判斷不出原因。」
  - en：「most of the rest were whole citations pasted in, misspellings, the wrong search scope, or items that hadn't been indexed, and a fifth couldn't be classified.」

### 🟡 V5　「前三種最常用來決定下一步」是 NN/g 沒說的排序

- 位置：zh 42；en 42
- 原句：zh「NN/g 從搜尋紀錄整理出七種發現，前三種最常用來決定下一步：」；en「NN/g lists seven kinds of findings from search logs; the first three are the ones most often used to decide what to do next:」
- 依據：nng-search-log 紀錄 L33–39（七種只是並列）、L56（「要說是挑前三種，不要寫成 NN/g 只分三類」）。原文沒有說前三種最常用。
- 改法：
  - zh：「NN/g 從搜尋紀錄整理出七種發現，這裡用前三種來分類缺口：」
  - en：「NN/g lists seven kinds of findings from search logs; here we use the first three to sort the gaps:」

### 🟡 V6　Aghajani 2019 正文有引，但沒有行內連結、也不在參考資料

- 位置：zh 23、132–145；en 同
- 原句：zh「order 6 提過，Aghajani 2019 年的研究裡，一半的可用性問題是「有寫但找不到」。」
- 依據：writing-guide 行 435、450（引用論文要列參考資料，第一次出現要有連結）。aghajani 紀錄 L9 的網址就是 order 6 用的那一個（order 6 L23、L104）。
- 改法：
  - zh 23：「[order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots) 提過，[Aghajani 等人 2019](https://emadpres.github.io/pdfs/icse2019.pdf) 的研究裡……」；參考資料加「- [Aghajani et al. 2019, Software Documentation Issues Unveiled (ICSE 2019)](https://emadpres.github.io/pdfs/icse2019.pdf)」
  - en 23：「[Order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots-en) mentioned that in [Aghajani et al.'s 2019 study](https://emadpres.github.io/pdfs/icse2019.pdf)……」；參考資料同一條。

### 🟢 V7　llms.txt 不只放根目錄

- 位置：zh 68；en 68
- 原句：zh「放在網站根目錄的一份 Markdown」
- 依據：llmstxt-spec 紀錄 L22（v2：根目錄或任一子路徑，一份涵蓋它底下的頁面）。
- 改法：zh「放在網站根目錄（v2 起也可放在子路徑）的一份 Markdown」；en「a Markdown file at a website's root (since v2, also under a subpath)」。不改也不誤導，可選。

### 🟢 V8　Lulla「沒有比較答案對不對」可再精確

- 位置：zh 76；en 76
- 依據：lulla 紀錄 L23：只抽 50 個 PR 確認有非空改動，作者說不算正確性評估。
- 改法：zh「也沒有完整比較答案對不對」；en「and correctness wasn't fully evaluated」。

### 🟢 V9　數字查詢「常代表找人」略強

- 位置：zh 50；en 50
- 依據：nng-search-log 紀錄 L39：原文是「如果在內網看到大家用電話號碼搜」。
- 改法：zh「最後一種在內網上如果是電話號碼，多半代表大家在找人」；en「on an intranet, if the numbers are phone numbers, people are probably looking for colleagues」。

### 🟢 V10　受訪的搜尋管理者性別不明

- 位置：zh 57；en 57
- 原句：zh「他的建議是讓頁面模板強制填標題」；en「his suggestion was」
- 依據：cleverley-burnett 全文 L558 只標 [ESM_1]。
- 改法：zh「這位管理者建議讓頁面模板強制填標題」；en「and suggested making page templates require one」。

### 🟢 V11　限制段「量的是程式任務的成功率和成本」不含 Chatlatanagulchai

- 位置：zh 117；en 117
- 依據：chatlatanagulchai 紀錄 L15、L37：描述性研究，不量 agent 表現。
- 改法：zh「Gloaguen 和 Lulla 量的是程式任務的成功率與成本，Chatlatanagulchai 只分析檔案本身；都不是團隊內部文件問答。」；en 對應。

---

## post-review

### 🔴 R1　分類規則與例子表不一致：「找不到」與「用詞不同」用的是同一種例子

- 位置：zh 44–48（三類表）、88、90（例子表）、123（步驟 3）；en 同
- 原句：三類表「想要但找不到｜搜「請假」找不到〈休假政策〉」與「用詞不同｜大家搜「VPN」，文件寫「遠端連線服務」」；例子表「請假｜找不到」「報帳｜找不到｜頁面叫〈費用核銷流程〉」「VPN｜用詞不同」。
- 依據：請假→休假、報帳→費用核銷、VPN→遠端連線服務是同一種機制：頁面在，用的是別的詞。NN/g 的「詞彙落差」就是這個（nng-search-log 紀錄 L35：品牌詞、縮寫、自創標籤 vs 通用詞）。文章沒給區分規則，讀者照「今晚可以做的事」第 2 步分類時無從判斷。真正和詞彙無關的「找不到」，在研究裡是沒被索引、範圍不對、排序太後面（huurdeman 紀錄 L20–24；cleverley-burnett 紀錄 L21 的 I2「不在索引」）——例子表裡只有「薪資單」是這種。
- 改法：
  - 三類表下方加一句規則。zh：「分法：頁面在、裡面也有大家用的詞，卻搜不到（沒被索引、搜尋範圍不對、排得太後面），算「找不到」；頁面在、但用的是另一個詞，算「用詞不同」；頁面根本不在，算「不存在」。」en：「The rule: if the page exists and already uses the word people search for but doesn't come up (not indexed, wrong scope, ranked too low), it's "can't be found"; if the page exists but uses a different word, it's "different words"; if there's no page, it "doesn't exist".」
  - 三類表第 1 列例子改成 zh「搜「薪資單」，頁面在人資系統裡、wiki 沒有索引」／en「Searching "payslip", but the page lives in the HR system the wiki doesn't index」；對策改成 zh「把它納入索引，或在 wiki 加一頁連過去；排序太後面就設置頂推薦」／en「Get it indexed or add a wiki page linking to it; if it ranks too low, add a best bet」。第 3 列可保留 VPN，或改用請假。
  - 例子表：「請假」「報帳」的分類改成「用詞不同」（處理欄不變）。99 行「真正需要補寫的只有三個」不受影響。
  - 步驟 3：zh「先修「找不到」和「用詞不同」的那幾個。」；en「Fix the "can't be found" and "different words" ones first.」
  - 自我檢查題目可保留口語的「找不到」（範圍卡原題），判準已經是詞彙對策，與新規則一致。

### 🟡 R2　範圍卡要求的站內連結只在參考資料，正文沒用到

- 位置：zh 145；en 145
- 依據：範圍卡 L232「連結：hybrid-search-bm25-vector-rrf」；writing-guide 行 446–456（參考資料不能取代行內連結）。
- 改法：依 V3 改法把連結放進自我檢查判準；或放進 117 行限制段：zh「……而且都是關鍵字搜尋的年代；語意搜尋能接起部分同義詞，見〈Hybrid Search〉。」

### 🟡 R3　10→11 的銜接句沒寫

- 位置：zh 115–131（文末）；en 同
- 依據：規劃表斷崖處理 L86：「order 10 結尾：同事開始改用問的；order 11 開頭說明 B 段寫好的文件正是 AI 知識庫最好的原料」。正文 63–80 談了 AI 讀者，但沒有把讀者送到 C 段。order 11 尚未發布，先不加連結。
- 改法：在「研究的限制」之後、「今晚可以做的事」之前加一段。
  - zh：「團隊段到這裡結束。接下來同事會越來越常不搜、直接問 AI 助理；前面幾篇寫好、有人維護、找得到的文件，正是那種知識庫最好的原料，下一段從這裡開始。」
  - en：「That's the end of the team part. Colleagues will increasingly skip the search box and ask an AI assistant instead; the documents the earlier posts helped you write, maintain and make findable are the best raw material for that kind of knowledge base, which is where the next part begins.」

### 🟡 R4　tldr 太長

- 位置：zh 8；en 8
- 依據：writing-guide 行 36（tldr 1–2 句）。現在 zh 6 句、en 5 句，幾乎是全文摘要。
- 改法：
  - zh：「同事搜不到，多半不是沒寫：一間大學圖書館的 50 筆零結果查詢只有一成是真的沒有。用三到六個月的搜尋紀錄把缺口分成找不到、不存在、用詞不同，先改標題、設同義詞；給 AI 看的 AGENTS.md 也一樣要精簡、要維護、要先評估，一項評估發現它們整體沒提高成功率，成本卻增加約兩成。」
  - en：「When colleagues can't find something, it usually isn't missing: of 50 zero-result queries at one university library, only one in ten was for something it didn't have. Sort the gaps in three to six months of search logs into can't be found, doesn't exist and different words, and fix titles and synonyms first; AGENTS.md files for AI need the same care, since one evaluation found they didn't raise success rates overall while raising costs by about a fifth.」

### 🟡 R5　「用幾個真實的任務比較改前改後」做不出研究裡那種差異

- 位置：zh 113；en 113
- 原句：zh「改完之後，用幾個真實的任務比較改前改後的結果，再決定要不要保留。」
- 依據：Gloaguen 用 438 題、每題一次，成功率差異都在 ±2.5% 且不顯著（gloaguen 紀錄 L15、L21–22、L40）；幾個任務看不出成功率差異，反而會讓讀者誤判。看得見的是指令有沒有被照做、步數與成本（紀錄 L21、L26）；llms.txt 規格建議用 agent 問答來測（llmstxt-spec 紀錄 L28）。這一列是「該做的事」，動作要做得出來（writing-guide 行 340–346）。
- 改法：
  - zh：「改完之後，挑幾個最近真的做過的任務各跑一次改前改後，看三件事：檔案裡寫的慣例有沒有被照做、多花了幾步、有沒有去讀它不該需要的檔案。幾個任務看不出成功率的差別，研究用了四百多題也只看到不顯著的差異；看得出來的是指令有沒有被照做與成本。」
  - en：「After the edit, rerun a few tasks you've actually done recently, before and after, and check three things: were the conventions in the file followed, how many extra steps did the agent take, and did it read files it shouldn't have needed. A few tasks won't show a difference in success rate; the research used over four hundred tasks and still found no significant one. What you can see is whether instructions were followed and what it cost.」

### 🟢 R6　AGENTS.md 表格逐列核對（記錄用）與第 5 列可補研究支撐

- 位置：zh 105–111；en 同
- 核對：
  - 第 1 列（概覽刪掉）：gloaguen 紀錄 L25、L30（概覽沒讓 agent 更快找到檔案；刪掉概覽不影響正確率）。在研究範圍內。Lulla 作者推測結構說明可能減少探索（lulla 紀錄 L24），但沒驗證，不足以推翻。
  - 第 2 列（建置測試指令有就連）：紀錄 L30 刪掉測試段顯著省成本、不影響正確率（只測 GPT-5.2）。在範圍內。
  - 第 3 列（團隊慣例留下）：紀錄 L26（uv、repo 專屬工具會被照做）與 L32（作者建議）。「會照做」有實證，「照做會提高成功率」沒有，表格沒這樣宣稱，可以。
  - 第 4 列（複製的長段刪掉）：見 V2 連帶說明，成立。
  - 第 5 列（久未確認照 order 9）：系列內部規則，不是研究；可補 chatlatanagulchai 紀錄 L33 的建議（用 CODEOWNERS 指定 context owner、PR 改到建置時檢查是否要更新），讓這列也有出處。
- 改法（可選）：zh 第 5 列「照 order 9 處理：負責人、確認週期；Chatlatanagulchai 等人也建議用 CODEOWNERS 指定這份檔案的負責人」；en 對應。

### 🟢 R7　〈請假與休假政策〉與 order 7 的「與」原則

- 位置：zh 88、130；en 88、130
- 依據：order 7 L49「如果標題要用『與』『及』連三件事，大概要拆成三頁」。這裡是同一件事的兩個名字，不違反，但讀者可能聯想到。
- 改法（可選）：zh 改成〈請假（休假）政策〉；en 保持「Leave and time-off policy」即可。

### 🟢 R8　「育嬰假」的處理與「不存在」的規則對齊

- 位置：zh 47、91；en 同
- 依據：47 行規則是「先讓搜尋結果指到最接近的頁面或負責人」；91 行做法是在政策頁加一行連到人資窗口。那一行要含「育嬰假」三個字，搜尋才會指過去。
- 改法：zh 91「先在〈請假與休假政策〉加一行「育嬰假：請洽人資窗口」」；en「meanwhile add a line "Parental leave: contact HR" to "Leave and time-off policy"」。

### 🟢 R9　範圍卡的「最長查詢」清單沒放進來

- 位置：zh 31–36；en 同
- 依據：範圍卡 L226 列了四份清單含最長查詢；nng-search-log 紀錄 L31（最長查詢常是整句，能幫忙理解單字查詢的意思）。正文寫「整理成三份清單」再加一份，最長查詢只在 50 行當發現提到。不算錯，取捨可接受。
- 改法（可選）：第 1 份清單末尾加一句 zh「看不懂某個短查詢想找什麼時，翻一下最長的那些整句查詢，常有答案。」／en「When a short query is hard to interpret, look at the longest full-sentence queries; they often explain it.」

---

## post-polish

### 🟡 P1　同一個但書講兩次，轉折段落略過閾值

- 位置：zh 74「這篇還是預印本。」與 117「多數是預印本」；zh 78「這是廠商自己的資料，客戶也偏重 SEO。」與 117「Ahrefs 是廠商資料」；en 同行
- 依據：writing-guide 行 362–366（但書換位置，不要堆疊；轉折段落超過三成就過量）；register-scan 12／38＝31%。
- 改法：保留各段的但書（讀者在那一段做判斷），刪掉 117 行重複的兩句。
  - zh 117：「AGENTS.md 的研究都很新，只測 Python 或小型任務……」（刪「多數是預印本」）；刪「Ahrefs 是廠商資料。」
  - en 117：刪「mostly preprints,」與「Ahrefs' figures are vendor data.」
  - 若 V2 採用改法，74 行已含「這篇還是預印本」，不重複。

### 🟢 P2　「NN/g 說這裡會混著……」的「這裡」

- 位置：zh 34
- 原句：「NN/g 說這裡會混著拼錯的詞和「想找但找不到」的東西。」
- 改法：「NN/g 說這份清單會混著拼錯的詞和「想找但找不到」的東西。」（en 已寫 this list，不用改）

---

## 附：order 1、2 稽核修正核對

對照 `.work/reviews/2026-10-22-kb-series-reference-audit.md` 第 285–289 行「修正紀錄」與 `git diff` 的 7 處改動。結論：**7 處都與原文一致、中英一致，沒有新錯**；只有一條可選的用詞建議。

| # | 位置 | 改後（zh／en） | 依據 | 判定 |
|---|---|---|---|---|
| 1 | order 1 L27 | 「趁一次辦公室搬遷調查員工的紙本檔案，員工估計其中 15% 從來沒讀過」／「surveyed employees about their paper files, and employees estimated that 15% had never been read」 | whittaker-hirschberg 紀錄 L138–140（TOCHI p.157；數字來自問卷自陳，Method p.152）、L162 | 吻合；中英一致 |
| 2 | order 1 L56 | 「剛開始時收集一小時就停，把收到的處理完再開始下一輪，之後依自己的情況調整時間」／「when starting out, collect for an hour, stop, process what you collected before the next round, and adjust the time to suit you later」 | zettelkasten-collectors-fallacy 紀錄 L25–28（原文 64–70：起步一小時、處理到清空、回顧並調整上限） | 吻合；中英一致 |
| 3 | order 1 L62 | 「覺得有共鳴就存；新東西先放進收件匣，每週一次再決定歸到哪裡」／「keeping anything that resonates; new items go into the inbox, and once a week he decides where they belong」 | forte-basb-overview 紀錄 L24–26（162 共鳴）、L40（263 每週一次把收件匣項目放到 proper place）、L51 | 吻合；修掉了原本「每週才判斷（去留）」的偏差；中英一致 |
| 4 | order 1 L64 | 「三題都答不出，就封存或乾脆不存」／「If all three draw a blank, he archives it or doesn't save it at all」 | forte-basb-overview 紀錄 L36（256–259「archive this information or not save it at all」）、L52 | 吻合；後句「這篇比 Forte 嚴格」仍成立；中英一致 |
| 5 | order 1 L70、L134 | 改連 Wayback 的〈Details on Omnivore shutting down〉；「10 月底宣布……匯出期限延了一次，使用者實際只有約一個月」／「the export deadline was extended once, leaving users about a month」；參考資料新增該公告、保留 README 條目（L135） | omnivore-2024-shutdown 紀錄 L10–12、L25、L29、L80–84（10/29 宣布、原定 11/15、10/31 延到 11/30，約 32 天） | 吻合；連結、標題與快照編號 20250503155629 與紀錄一致；README 仍在參考資料，符合修正紀錄「保留 README」 |
| 6 | order 2 L51 | 「Bergman 團隊在 Windows 7 那項研究裡做了控制好的找檔任務：受試者剛被要求用標籤兩週後，用標籤找明顯比較慢，找不到的次數也比較多，但後者只接近顯著」／「run right after participants had been asked to use tags for two weeks, retrieving with tags was significantly slower, and failed more often, though the latter difference was only close to significant」 | bergman-2013 紀錄 L95–98（接受稿 818–844：強制兩週後當場做；21.21 vs 16.44 秒 p<0.05；失敗 6 vs 1，p=0.059） | 吻合；中英一致 |
| 7 | order 2 L168 | 參考資料加「（依作者接受稿）」／「(per the authors' accepted manuscript)」 | bergman-2013 紀錄 L3、L89 | 吻合 |

- 🟢 B1（可選）order 2 L51 zh「用標籤找明顯比較慢」：這裡要對應 en 的 significantly 與後半句的「接近顯著」，改成「用標籤找顯著比較慢」讀者比較容易看出兩者的統計強度不同。不改也不算錯。
- 修正紀錄說 order 2 第 149 行第 3 步未改：forte-basb-overview 紀錄 L34、L53 支持「用到時再從封存拿出來」，同意不改。

## 修正紀錄（2026-10-22）

- 全部採用：V1–V11、R1（加分類規則；三類表例子改為薪資單／請假；例子表請假、報帳改「用詞不同」；步驟 3 同步）、R2（連結放進自我檢查判準）、R3（加團隊段結尾銜接句，order 11 未發布不加連結）、R4、R5、R6、R8、P1、P2。
- 不採用：R7（〈請假與休假政策〉是同一件事的兩個名字，不違反 order 7 原則）、R9（最長查詢已在七種發現提到）。
- 附錄建議：order 2 第 51 行「明顯」改「顯著」，已改。
