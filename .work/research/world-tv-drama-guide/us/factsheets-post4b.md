# Post 4b 事實表：美劇｜喜劇（12 部）

- 查核日：2026-11-05。順序照 `post4b-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**partial** 表示只讀到前段或部分區塊；**snippet** 表示只看到搜尋摘要或 highlight，不能當成讀過。
- 欄位 6（推薦 tag）直接取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），每類只留最有資訊量的。已刪掉：只有 snippet 而且沒有分數的項目（例如 NWT「RT 2025-page S2 (markdown only; score not captured)」）、反面訊號（例如 Emily「RT 2025 S5 65% / Popcorn 37%」、NWT／Emily「Netflix H2 2025 not top 10」）。沒有業配項目。
- 欄位 8（台灣串流）先照抄 `tw-availability-1/2/3.md` 的原等級，再補這次新找的台灣官方證據（Netflix Taiwan YouTube、台灣媒體）。判定方式比照 `tw-availability-official.md`：Disney+ `/zh-tw/browse/entity-…` 頁算 Disney+ 台灣目錄頁；Netflix `/tw/title/` 頁和 Prime Video `zh_TW` 頁**不算**台灣證據。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、季數、狀態、S1 集數、前置作品 | 英文 Wikipedia 條目 wikitext（`action=raw`），抽 infobox `num_seasons` / `num_episodes` / `first_aired` / `last_aired`、Series overview `episodes1`、導言句、含 renewed / cancel / final season 的句子；Atlanta、Cobra Kai 的 S1 集數改抽 `List_of_…_episodes` | Groundlane `web_extract`（pattern，render=never） | read（12/12） |
| IMDb ID | Wikidata `wbgetentities`（P345），一次查 12 部 | Groundlane `web_extract` | read |
| 美國分級、IMDb 總評分 | IMDb 標題頁 `imdb.com/title/<id>/` 標題列 | Exa `web_fetch_exa`（maxCharacters 700–1000） | read（12/12） |
| 分級細項 | IMDb Parents Guide `imdb.com/title/<id>/parentalguide/` | Exa `web_fetch_exa`（10 部）；The Office、Emily in Paris 在 Exa 回空頁 → Jina `read_url`（無 API key，回全文） | read（12/12；Cobra Kai 的 Profanity 以下票數、Maisel 的 Profanity 票數沒抓到，見各劇） |
| Tomatometer / Popcornmeter / Critics Consensus | RT 季頁 `rottentomatoes.com/tv/<slug>/s01`，選取 `media-scorecard [slot="critics-score"]` / `[slot="audience-score"]` / `[slot="critics-reviews"]` / `[slot="audience-reviews"]` 與 `#critics-consensus p` | Groundlane `web_extract`（render=never） | read（12/12） |
| 台灣串流（新證據） | YouTube 觀看頁的 `meta[name=title]`、`link[itemprop=name]`（頻道名）、`meta[itemprop=datePublished]`；台灣媒體文章 | Groundlane `web_search`／`web_extract`／`web_fetch`；Tavily `tavily_search`／`tavily_extract` | 見各劇欄位 8 |

嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號內是頁面顯示的「X of Y found this …」票數。**Parents Guide 是使用者投稿與投票**，不是官方分級；Chair Company 這種新劇每類只有 6–11 票，參考價值低。

---

## 1. Only Murders in the Building

1. **片名**：破案三人行（Disney+ zh-tw 頁，見 tw-availability-3；中文維基 zhwiki 條目名也是「破案三人行」，Wikidata read）／*Only Murders in the Building*
2. **劇情**：三個住在曼哈頓上西區高級公寓 Arconia 的陌生人（Steve Martin、Martin Short、Selena Gomez）因為都愛聽真實犯罪 podcast 而結識，一起調查大樓裡接連發生的命案，還自己做了一個 podcast 記錄辦案過程。來源：https://en.wikipedia.org/wiki/Only_Murders_in_the_Building （read）
3. **季數與狀態**：已播 5 季、50 集（2021-08-31 起在 Hulu 首播；第 5 季 2025 年 9 月）。2025 年 10 月續訂第 6 季，改名 *Only Murders in London*，**預定 2026-12-08 首播**，所以截至 2026-11-05 是**播出中（續訂）**。第 1 季 10 集。來源：同上（infobox `num_seasons=5`、`num_episodes=50`、`last_aired=present`、`episodes1=10`，read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt11691774/ ）。Parents Guide：Sex & Nudity **Mild**（112/208）、Violence & Gore **Moderate**（72/116）、Profanity **Severe**（100/185）、Alcohol, Drugs & Smoking **Mild**（83/110）、Frightening & Intense **Mild**（65/101）。投稿特別提到：f-word 頻繁、S2E6 有一次 c-word；S1E1 有短暫側面胸部；第 1–4 季兇案幾乎不見血，第 5 季明顯變血腥（肉刀、斷指、解剖畫面）；S3E5 兩人共抽大麻。有投稿指出 ABC 重播版刪了大部分髒話。來源：https://www.imdb.com/title/tt11691774/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **100%**（107 則影評），Popcornmeter **94%**（2,500+）。Consensus：「Only Murders in the Building's silly approach to true crime obsessives is at once hilarious and insightful, thanks in large part to its extremely charming central trio.」來源：https://www.rottentomatoes.com/tv/only_murders_in_the_building/s01 （read）。最新季：candidates 檔記錄 S5 89% / Popcorn 83%，和 S1 差距不大（未重抓）。
6. **推薦 tag**：
   - A：Emmy Comedy nom 2022、2023、2024、2025、2026（連 5 年）；GG Comedy nom 2022–2026
   - C：RT 2025 S5 89% / Popcorn 83%；RT 2024 S4 93% / Popcorn 88%
   - F：PTT「求推薦 D+ 2024 以後新出好看的劇」串
   - G：GQ TW〈Disney+「神級影集」推薦〉（2026-02-09，read 經 jina）
7. **前置作品**：沒有，是原創劇。來源：同欄位 2（read）
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-ef31c7e1-cd0f-4e07-848d-1cbfedb50ddf ；JW：https://www.justwatch.com/tw/節目/only-murders-in-the-building — **confirmed on service page**（tw-availability-3；美國 Hulu 播出、台灣在 Disney+）。補充：電影神搜 2023-08-11 的宣傳稿寫第 3 季「已於 8 月 8 日於 Disney+ 平台上架」（https://news.agentm.tw/261753/ ，read）。

## 2. Atlanta

1. **片名**：亞特蘭大（Disney+ zh-tw 頁，tw-availability-3；zhwiki 條目「亞特蘭大 (電視劇)」）／*Atlanta*
2. **劇情**：Donald Glover 為 FX 創作的超現實喜劇劇情片，講大學輟學的音樂經紀人 Earn（Glover）和饒舌歌手表哥 Alfred「Paper Boi」（Brian Tyree Henry），在怪誕、近乎異世界的亞特蘭大嘻哈圈裡打拚。來源：https://en.wikipedia.org/wiki/Atlanta_(TV_series) （read）
3. **季數與狀態**：4 季、41 集，2016-09-06 到 2022-11-10，**已完結**。第 1 季 10 集。來源：同上（infobox read）；S1 集數：https://en.wikipedia.org/wiki/List_of_Atlanta_episodes （`episodes1=10`，read）
4. **分級**：美國 **TV-MA**（Parents Guide 的 Certifications 區塊與 IMDb 標題頁都寫 TV-MA，read）。Sex & Nudity **Moderate**（72/179）、Violence & Gore **Moderate**（38/79）、Profanity **Severe**（67/108）、Alcohol, Drugs & Smoking **Moderate**（54/84）、Frightening **Moderate**（37/83）。投稿特別提到：全劇有 3 次非性意味的男性正面全裸，兄弟會派對一場最明顯；脫衣舞俱樂部；警察開槍、步槍狙殺；每集都有人抽大麻，偶有古柯鹼和迷幻藥；f-word、n-word、恐同詞；S2E6〈Teddy Perkins〉被稱為全劇最令人不安的一集。IMDb 列出的分級裡沒有台灣。來源：https://www.imdb.com/title/tt4288182/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **98%**（141 則），Popcornmeter **91%**（1,000+）。Consensus：「Ambitious and refreshing, Atlanta offers a unique vehicle for star and series creator Donald Glover's eccentric brand of humor -- as well as a number of timely, trenchant observations.」來源：https://www.rottentomatoes.com/tv/atlanta/s01 （read）
6. **推薦 tag**：
   - A：Emmy Comedy nom 2017、2018；GG Comedy win 2017（⚠ awards 檔自己註明 GG 2016–2020 的得獎欄位擷取不全，這筆 win 要再核）
   - B：BBC2021 #14；NYT2026 #10
   - C：IMDb 8.6（#146）
   - F／G：無
7. **前置作品**：沒有，是原創劇。來源：同欄位 2（read）
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-3529d0f1-acaf-476d-8be3-66cd6bf12530 ；JW：https://www.justwatch.com/tw/節目/atlanta — **confirmed on service page**（tw-availability-3；FX 的劇，台灣在 Disney+）

## 3. Nobody Wants This

1. **片名**：天作不合的我們（tw-availability-3：Netflix 頁顯示，但抓取時被轉到 en-US；這次另在台灣媒體確認，見欄位 8）／*Nobody Wants This*
2. **劇情**：Erin Foster 創作的 Netflix 浪漫喜劇，講直言不諱的不可知論者、性愛 podcast 主持人 Joanne（Kristen Bell）和剛恢復單身的年輕猶太拉比 Noah（Adam Brody）意外相戀。Wikipedia：「the unlikely relationship between an outspoken, agnostic woman and a handsome young Jewish rabbi」。來源：https://en.wikipedia.org/wiki/Nobody_Wants_This （read）
3. **季數與狀態**：3 季、30 集。2024-09-26 首播；2025-11-04 續訂第 3 季，**第 3 季 2026-10-22 上線**。截至 2026-11-05 是**播出中**；第 4 季有沒有續訂，這次抽到的句子裡沒有，未確認。第 1 季 10 集。來源：同上（infobox `num_seasons=3`、`num_episodes=30`、`episodes1=10`；「The third season premiered on October 22, 2026」，read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt26933824/ ）。Sex & Nudity **Mild**（70/161）、Violence & Gore **None**（頁面標 None，票數未顯示）、Profanity **Moderate**（50/102）、Alcohol, Drugs & Smoking **Mild**（62/82）、Frightening **（頁面沒有標示等級，無投稿）**。投稿特別提到：大量性話題與性玩具店場景，但沒有裸露；偶爾說 f-word。來源：https://www.imdb.com/title/tt26933824/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **95%**（56 則），Popcornmeter **84%**（1,000+）。Consensus：「Contrary to its title, Nobody Wants This proves to be a welcome binge thanks to Kristen Bell and Adam Brody's irresistible chemistry and some thoughtful considerations of interfaith romance.」來源：https://www.rottentomatoes.com/tv/nobody_wants_this/s01 （read）。最新季：Wikipedia 寫第 3 季 RT 86%（read，Popcornmeter 未查）。
6. **推薦 tag**：
   - A：Emmy Comedy nom 2025、2026；GG Comedy nom 2025、2026
   - B：CT10-2024 agg #14
   - C：RT 2024 S1 95% / Popcorn 84%
   - D：Nielsen 2024 top new original comedy 4.90B min；Netflix H2 2024 #5（S1 56.8M）
7. **前置作品**：沒有，是原創劇。來源：同欄位 2（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81591296 ；JW：https://www.justwatch.com/tw/節目/nobody-wants-this — tw-availability-3 原等級 **JustWatch only**。**這次補查**：Netflix Taiwan YouTube 沒有找到本劇預告（搜到的是個人轉傳 `dye8SIBY4as`，以及華納音樂西洋日韓頻道 2026-11-03 的原聲帶短片，read，都不是 Netflix 官方）。台灣媒體：Livio 生活網〈信仰與愛情的荒謬交鋒《天作不合的我們》第3季強勢回歸掀翻情感〉寫「第 3 季即重磅上線」，劇照標「圖 Netflix」，標籤含「Netflix 新片」「媒體採購」（https://livio.com.tw/258237/ ，read，搜尋結果標示約 1 週前發布）。判定：**confirmed（台灣媒體；無 Netflix Taiwan 官方影片）**，比照 official 檔 Sirens 的判法。Netflix Original，下架風險低。

## 4. A Man on the Inside

1. **片名**：**臥底老紳士**（台灣媒體用法，見欄位 8；tw-availability-1 原本標「未驗」，JW 顯示簡體「卧底老绅士」；豆瓣陸譯「新手老卧底」）／*A Man on the Inside*
2. **劇情**：Michael Schur 創作、Ted Danson 主演的 Netflix 喜劇。喪偶的退休教授 Charles 應徵私家偵探的報紙廣告，臥底進舊金山一間退休社區調查竊案。改編自 2020 年智利紀錄片《The Mole Agent》（阿公偵探大鬧養老院）。來源：https://en.wikipedia.org/wiki/A_Man_on_the_Inside （read）
3. **季數與狀態**：已播 2 季、16 集（2024-11-21 首播；第 2 季 2025-11-20）。2026-02-03 續訂第 3 季，2026-09-23 宣布第 3 季為**最終季**（上線日未查到）。截至 2026-11-05 是**續訂中、尚未完結**。第 1 季 8 集。來源：同上（infobox `num_seasons=2`、`num_episodes=16`、`episodes1=8`，read）
4. **分級**：美國 **TV-14**（IMDb 標題頁與 Certifications 區塊，read）。Sex & Nudity **None**（38/61）、Violence & Gore **（未標等級；唯一投稿是有人被揍一拳、沒流血）**、Profanity **Mild**（31/49）、Alcohol, Drugs & Smoking **Mild**（42/49）、Frightening **None**（32/43）。投稿特別提到：偶有 s--t 和多次 G--damn；每集都有人喝酒；處理老年健康退化、失智與喪偶，「At least one episode may make you cry」。IMDb 列出的台灣分級是 **13+**。來源：https://www.imdb.com/title/tt26670955/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **96%**（52 則），Popcornmeter **90%**（500+）。Consensus：「Tailor-made to suit Ted Danson's estimable strengths, this warm and witty sitcom discovers a lot of life left in those who've been put out to pasture.」來源：https://www.rottentomatoes.com/tv/a_man_on_the_inside/s01 （read）。最新季：candidates 檔記錄 S2 90% / Popcorn **70%**，觀眾分數比 S1 低 20 點（未重抓）。
6. **推薦 tag**：
   - B：Variety2024（Aramide Tinubu #10）；THR2024（Fienberg honorable mention）；CT10-2024 agg ~#21
   - C：RT 2025 S2 90% / Popcorn 70%
   - D：Nielsen 2024 new original comedy runner-up 2.94B min
   - G：關鍵評論網編輯部〈2025 過年追劇片單（下）〉收錄（該文註明「聚焦於能在台灣以正規方式看見的作品」，Tavily extract read）
7. **前置作品**：不必先看紀錄片《The Mole Agent》。THR 的 Fienberg 說它是少數「leap in media feels wholly justified」的改編（read，見 reviews 檔）。「不必先看」是編輯判斷。
8. **台灣串流**：Netflix（訂閱，2 季）https://www.netflix.com/tw/title/81677257 ；JW：https://www.justwatch.com/tw/節目/a-classic-spy — tw-availability-1 原等級 **C（JustWatch only）**。**這次補查**：Netflix Taiwan YouTube 沒找到（搜到的是「該不該看」頻道的簡體轉傳 `2P2SseSvElY`，read，非官方）。台灣媒體：Livio 生活網〈重返校園泰德丹森變身最老教授《臥底老紳士》愛情與勒索雙重危機〉，標籤「臥底老紳士 第2季 Netflix新片 媒體採購 … 11月20上線」，劇照標「圖 Netflix」（https://livio.com.tw/234015/ ，Tavily extract read；Groundlane 回 gzip 亂碼）；關鍵評論網編輯部片單也收錄（見欄位 6）。判定：**confirmed（台灣媒體；無 Netflix Taiwan 官方影片）**，台灣譯名「臥底老紳士」由台灣媒體確認，仍沒有 Netflix 台灣頁可對。

## 5. The Big Bang Theory

1. **片名**：宅男行不行（HBO Max TW，tw-availability-1）／*The Big Bang Theory*。陸譯「生活大爆炸」（zhwiki 條目名、JW、豆瓣）。
2. **劇情**：Chuck Lorre 與 Bill Prady 為 CBS 打造的情境喜劇，故事一開始圍繞住在帕薩迪納的五個人：同住一間公寓的加州理工物理學家 Leonard 和 Sheldon、住對門想當演員的女服務生 Penny，以及他們同樣宅又不擅社交的朋友 Howard 和 Raj。來源：https://en.wikipedia.org/wiki/The_Big_Bang_Theory （read）
3. **季數與狀態**：12 季、279 集，2007-09-24 到 2019-05-16，**已完結**。第 1 季 17 集。來源：同上（infobox 與導言，read）
4. **分級**：美國 **TV-PG**（IMDb 標題頁，read：https://www.imdb.com/title/tt0898266/ ）。Sex & Nudity **Mild**（339/714）、Violence & Gore **None**（425/501）、Profanity **Mild**（299/487）、Alcohol, Drugs & Smoking **Mild**（283/451）、Frightening **None**（票數未抓到）。投稿特別提到：性話題與雙關語很頻繁，但沒有性愛場面；試播集第一場在精子銀行；髒話以 bitch、ass 為主；喝酒常見。Certifications 區塊列出中國「(Banned) 2014」。來源：https://www.imdb.com/title/tt0898266/parentalguide/ （read，Exa；Certifications 區塊在美國之前截斷）
5. **RT（S1）**：Tomatometer **59%**（29 則），Popcornmeter **84%**（1,000+）。Consensus：「The Big Bang Theory brings a new class of character to mainstream television, but much of the comedy feels formulaic and stiff.」來源：https://www.rottentomatoes.com/tv/the_big_bang_theory/s01 （read）。後面季數的 RT 分數這次沒有抓。
6. **推薦 tag**：
   - B：BBC2021 #56
   - D：Nielsen 2023 overall #6 27.8B min；Nielsen 2024 overall #7 29.1B min + most-binged；Nielsen H1 2026 #5 overall 20.40B min
   - F：PTT 2026 推薦串；PTT GOAT 串「喜劇」(2023)
   - G：HBO Max TW 首頁「熱門經典」(snippet)
7. **前置作品**：沒有，是原創劇。來源：同欄位 2（read）
8. **台灣串流**：HBO Max（訂閱，12 季）https://www.hbomax.com/tw/zh/show/c8ea8e19-cae7-4683-9b62-cdbbed744784 — **A（confirmed on service page）**（tw-availability-1）

## 6. The Office (US)

1. **片名**：**台灣有兩個官方譯名**：HBO Max TW 頁是「**我們的辦公室**」，Prime Video zh_TW 頁是「**辦公室瘋雲**」（tw-availability-1）。zhwiki 條目名是「我們的辦公室」（Wikidata read）；PTT 鄉民用「辦公室瘋雲」（fans 檔）。寫文時建議兩個並列，並註明平台。／*The Office*
2. **劇情**：改編自 Ricky Gervais 與 Stephen Merchant 的 BBC 同名劇，由 Greg Daniels 改編給 NBC 的偽紀錄片情境喜劇，描寫賓州斯克蘭頓的 Dunder Mifflin 紙業公司分公司員工的日常。來源：https://en.wikipedia.org/wiki/The_Office_(American_TV_series) （read）
3. **季數與狀態**：9 季、201 集，2005-03-24 到 2013-05-16，**已完結**。第 1 季 6 集。來源：同上（read）。注意：IMDb 標題頁的集數寫 191（計法不同，read），文章用 Wikipedia 的 201。
4. **分級**：美國 **TV-14**（IMDb 標題頁，read：https://www.imdb.com/title/tt0386676/ ）。Sex & Nudity **Mild**（335/721）、Violence & Gore **None**（321/459）、Profanity **Mild**（288/491）、Alcohol, Drugs & Smoking **Mild**（307/392）、Frightening **None**（319/411）。投稿特別提到：每集都有性笑話（「that's what she said」），偶有打碼裸露；強烈髒話都被消音；Meredith 酗酒；有種族與性別刻板印象的笑點，「could be offensive to some viewers」。⚠ Jina 回傳的全文沒有類別標題，上面 5 類是依 IMDb 固定順序對應，投稿內容和類別吻合。來源：https://www.imdb.com/title/tt0386676/parentalguide/ （read，Jina；Exa 回空頁）
5. **RT（S1）**：Tomatometer **71%**（41 則），Popcornmeter **82%**（500+）。Consensus：「The Office quickly distinguishes itself from its source material within the first few episodes, proving not all Hollywood remakes of overseas hits are destined to end in failure. (That's what she said.)」來源：https://www.rottentomatoes.com/tv/the_office/s01 （read）。後面季數這次沒有抓。
6. **推薦 tag**：
   - B：BBC2021 #39；NYT2026 #11
   - C：IMDb 9.0（#26）
   - F：PTT 2026 推薦串；PTT GOAT 串「喜劇」
7. **前置作品**：是英國 BBC《The Office》的美國改編版。**不必先看英版**；Slate 的 Dana Stevens 指出試播集幾乎逐句照搬英版第一集，從第二集起才走自己的路（read，見 reviews 檔）。「不必先看」是編輯判斷。
8. **台灣串流**：HBO Max（訂閱，9 季）https://www.hbomax.com/tw/zh/show/78e15665-f6c8-4b58-8786-e0d9e2b65ced — **A**；Prime Video（訂閱，9 季）https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.54a9f77b-9a3d-01d5-83b3-c30531685e9f — **B**；Netflix（訂閱，9 季）https://www.netflix.com/tw/title/70136120 — **C**；CATCHPLAY+（訂閱，JW 寫 5 季）https://www.catchplay.com/tw/video/6ac78695-a902-4274-be84-a700a7a1d28c — **C**（tw-availability-1）。建議文章寫法：「HBO Max（譯《我們的辦公室》）；Prime Video 也有（譯《辦公室瘋雲》）」，Netflix 和 CATCHPLAY+ 只有 JustWatch，不寫。

## 7. Emily in Paris

1. **片名**：艾蜜莉在巴黎（Netflix Taiwan YouTube 官方預告標題，見欄位 8；zhwiki 條目名相同）／*Emily in Paris*。第 5 季在劇中改稱 *Emily in Rome*（Wikipedia 註腳，read）。
2. **劇情**：Darren Star 為 Netflix 創作的浪漫喜劇，Lily Collins 飾演芝加哥的行銷主管 Emily Cooper，被派到巴黎一間法國行銷公司提供「美國觀點」，在工作、感情和友情上不斷碰壁。來源：https://en.wikipedia.org/wiki/Emily_in_Paris （read）
3. **季數與狀態**：已播 5 季、50 集（2020-10-02 首播；第 5 季 2025-12-18）。2026-01-05 續訂第 6 季，2026-05-21 宣布為**最終季**，**預定 2026-12-24 首播**。截至 2026-11-05 是**播出中（最終季待播）**。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁與 Certifications，read）。Sex & Nudity **Moderate**（269/709）、Violence & Gore **None**（146/170）、Profanity **Mild**（110/165）、Alcohol, Drugs & Smoking **Mild**（157/248）、Frightening **None**（94/113）。投稿特別提到：視訊自慰、廁所隔間性愛等短暫場面，沒有露出生殖器；第 2 季三溫暖有女性上空；很多人抽菸、喝酒但沒人喝醉。IMDb 列出的台灣分級是 **16+**。來源：https://www.imdb.com/title/tt8962124/parentalguide/ （read，Jina；Exa 回空頁）
5. **RT（S1）**：Tomatometer **61%**（57 則），Popcornmeter **54%**（1,000+）。Consensus：「Though its depiction of France is tré cliché, Emily in Paris is rom-com fantasy at its finest, spectacularly dressed and filled with charming performances.」來源：https://www.rottentomatoes.com/tv/emily_in_paris/s01 （read）。**最新季差很多**：candidates 檔記錄 S5 65% / Popcorn **37%**（未重抓）。
6. **推薦 tag**：
   - A：Emmy Comedy nom 2021；GG Comedy nom 2021
   - D：Netflix H2 2024 #4（S4 57.8M）
   - （已刪：RT 2025 S5 65% / Popcorn 37%、Netflix H2 2025 S5 not top 10，屬反面訊號）
7. **前置作品**：沒有，是原創劇。來源：同欄位 2（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81037371 ；JW：https://www.justwatch.com/tw/節目/emily-in-paris — tw-availability-3 原等級 **JustWatch only**。**這次補查**：Netflix Taiwan 官方預告〈《艾蜜莉在巴黎》 | 第 5 季正式預告 | Netflix〉，頻道 **Netflix Taiwan**，2025-12-03，說明寫「第 5 季將於 12 月 18 日首播，Netflix 獨家」（https://www.youtube.com/watch?v=XQhw3LwetZY ，Groundlane `web_extract` read）。判定：**confirmed（official channel）**。

## 8. Cobra Kai

1. **片名**：眼鏡蛇道館（Netflix Taiwan YouTube 官方預告標題，見欄位 8）／*Cobra Kai*。zhwiki 是簡體「眼镜蛇道馆」；豆瓣「眼镜蛇」。
2. **劇情**：電影《小子難纏》（*The Karate Kid*）前三集的續集影集。2017 年，距離 1984 年全谷空手道大賽敗給 Daniel LaRusso 已經三十三年，Johnny Lawrence 酗酒又憂鬱，後來重開「眼鏡蛇」道館，和事業有成的 Daniel 再度成為對手。來源：https://en.wikipedia.org/wiki/Cobra_Kai （read：「Beginning in 2017, thirty-three years after being defeated by Daniel LaRusso … Johnny Lawrence suffers from alcoholism and depression」）；IMDb 標題頁簡介（read）
3. **季數與狀態**：6 季、65 集，2018-05-02 到 2025-02-13，**已完結**。前兩季在 YouTube Red／YouTube Premium 播出，之後移到 Netflix。第 1 季 10 集；最終第 6 季 15 集、分三部播出。來源：同上（導言 read）；S1／S6 集數：https://en.wikipedia.org/wiki/List_of_Cobra_Kai_episodes （`episodes1=10`、`episodes6=15`，read）
4. **分級**：美國 **TV-14**（IMDb 標題頁，read：https://www.imdb.com/title/tt7221388/ ）。Sex & Nudity **Mild**（329/693）、Violence & Gore **Moderate**（250/430）、Profanity **Moderate**、Alcohol, Drugs & Smoking **Moderate**、Frightening **Mild**（後三類票數沒有抓到，Exa 擷取在 Profanity 段落中途截斷）。投稿特別提到：空手道打鬥多半不見血，但有扯掉耳垂、頭撞桌子、打斷手臂；越戰回憶畫面；第 5 季暴力明顯加重；全 6 季 f-word 不多但逐季增加；角色 Miguel 被叫「Illegal」等族裔辱罵。來源：https://www.imdb.com/title/tt7221388/parentalguide/ （partial，Exa）
5. **RT（S1）**：Tomatometer **100%**（50 則），Popcornmeter **95%**（5,000+）。Consensus：「Cobra Kai continues the Karate Kid franchise with a blend of pleasantly corny nostalgia and teen angst, elevated by a cast of well-written characters.」來源：https://www.rottentomatoes.com/tv/cobra_kai/s01 （read）。最新季：candidates 檔記錄 S6 91% / Popcorn 80%（未重抓）。
6. **推薦 tag**：
   - A：Emmy Comedy nom 2021
   - C：RT 2024 S6 91% / Popcorn 80%
   - D：Netflix H2 2024 #10（S6 38.3M）
7. **前置作品**：**是電影《小子難纏》（1984）系列的續集**。Wikipedia：「It serves as a sequel to the first three *The Karate Kid* films」（read）。**建議至少先看 1984 年第一集**，但不是必要條件：IndieWire 的 Hanh Nguyen 指出劇中大量用原片畫面交代前情（「Footage from the original film is used frequently to provide exposition」，partial，見 reviews 檔）；Vulture 的 Jen Chaney 也提到原片場景以回憶形式重播（Exa highlight，snippet）。「建議先看」是編輯判斷。
8. **台灣串流**：Netflix（訂閱，6 季）https://www.netflix.com/tw/title/81002370 ；JW：https://www.justwatch.com/tw/節目/cobra-kai — tw-availability-3 原等級 **JustWatch only**。**這次補查**：Netflix Taiwan 官方預告〈《眼鏡蛇道館》第 6 季 | 第 3 部上線日期預告 | Netflix〉，頻道 **Netflix Taiwan**，2024-12-24（https://www.youtube.com/watch?v=K5EYorpxgLQ ，read）；另有 Netflix Malaysia（@netflixasia 繁中頻道）2024-05-02 的〈第 6 季 | 上線日期預告〉（https://www.youtube.com/watch?v=WahaOaXjikk ，read）。判定：**confirmed（official channel）**。注意：這部是 Sony Pictures Television 發行、YouTube 起家的劇，掛 Netflix 獨家但不是 Netflix 自製，授權到期下架的風險比 Netflix Original 高；最新官方證據是 2024-12。

## 9. The Marvelous Mrs. Maisel

1. **片名**：漫才梅索太太（Prime Video zh_TW 頁標題「Prime Video：漫才梅索太太第一季」，tw-availability-1；Yahoo TW、DramaQueen、電影神搜都用這個譯名）／*The Marvelous Mrs. Maisel*。陸譯「了不起的麦瑟尔夫人」。
2. **劇情**：Amy Sherman-Palladino 創作的時代喜劇劇情片，背景是 1950 年代末到 1960 年代初的紐約，Rachel Brosnahan 飾演上西區家庭主婦 Midge Maisel，婚姻破裂後投入脫口秀。來源：https://en.wikipedia.org/wiki/The_Marvelous_Mrs._Maisel （read）
3. **季數與狀態**：5 季、43 集，2017-03-17（試播集）到 2023-05-26，**已完結**（第 5 季為最終季，2023-04-14 首播）。第 1 季 8 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（Certifications 與標題頁，read）。Sex & Nudity **Moderate**（215/626）、Violence & Gore **Mild**（160/259）、Profanity **Severe**（票數未抓到）、Alcohol, Drugs & Smoking **Moderate**（164/259）、Frightening **None**。投稿特別提到：第 4 季以脫衣舞俱樂部為場景，有上空表演；男模正面全裸（藝術課）；第 1 季有穿著衣服的性愛場面；Midge 在舞台上露胸；f-word 頻繁；抽菸喝酒到醉。IMDb 列出的台灣分級是 **16+**（第 2 季 18+）。來源：https://www.imdb.com/title/tt5788792/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **94%**（82 則），Popcornmeter **95%**（1,000+）。Consensus：「The Marvelous Mrs. Maisel is an upbeat addition to Amazon's original offerings, propelled by a playful yet poignant performance by Rachel Brosnahan.」來源：https://www.rottentomatoes.com/tv/the_marvelous_mrs_maisel/s01 （read）
6. **推薦 tag**：
   - A：Emmy Comedy win 2018；Emmy Comedy nom 2019、2020、2022、2023；GG Comedy win 2018（⚠ 同 Atlanta，awards 檔 GG 2016–2020 得獎欄位擷取不全）；GG Comedy nom 2019、2020
   - C：IMDb 8.6（#130）
   - F：PTT 2026 推薦串；PTT GOAT 串推文
   - G：Yahoo TW〈台灣 Prime Video 訂閱攻略〉稱「Prime Video 台柱美劇，擁有超高口碑，抱回20座艾美獎」（2026-05-27，read）
7. **前置作品**：沒有，是原創劇。來源：同欄位 2（read）
8. **台灣串流**：Prime Video（訂閱，5 季）https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.7f187a13-f9c4-405d-b822-c56aab133be4 — tw-availability-1 原等級 **B**（zh_TW 頁不證明地區）。**這次補查**：Yahoo 奇摩〈【台灣Prime Video訂閱攻略】…〉（2026-05-27）把《漫才梅索太太》列為台灣 Prime Video 可看的劇，「季數：共五季（已完結）」，並寫《黑袍糾察隊》《漫才梅索太太》等「也都是台灣與全球同步上架」（https://tw.news.yahoo.com/【台灣prime-video訂閱攻略】訂閱方法、方案、畫質、中文字幕狀況一篇弄懂！旗艦大劇《魔戒：力量之戒》、大尺度《黑袍糾察隊》、獨家韓劇《和我老公結婚吧》不容錯過！-135006293.html ，Groundlane `web_extract` read）。判定：**confirmed（台灣媒體；無 Prime Video 台灣官方貼文）**。Amazon Original，下架風險低。

## 10. What We Do in the Shadows

1. **片名**：吸血鬼家庭屍篇（Disney+ zh-tw 頁，tw-availability-2；關鍵評論網報導艾美獎名單也用這個譯名，read）／*What We Do in the Shadows*。陸譯「吸血鬼生活」。
2. **劇情**：Jemaine Clement 創作的 FX 偽紀錄片恐怖喜劇，改編自他和 Taika Waititi 2014 年的同名紐西蘭電影，記錄四個同住在紐約史泰登島的吸血鬼室友。來源：https://en.wikipedia.org/wiki/What_We_Do_in_the_Shadows_(TV_series) （read）
3. **季數與狀態**：6 季、61 集，2019-03-27 到 2024-12-16，**已完結**。第 1 季 10 集。來源：同上（read）
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt7908628/ ）。Sex & Nudity **Moderate**（117/248）、Violence & Gore **Moderate**（73/134）、Profanity **Moderate**（58/141）、Alcohol, Drugs & Smoking **Mild**（84/110）、Frightening **Mild**（68/112）。投稿特別提到：大量性笑話與自慰笑話，兩個主角自稱性成癮；性愛場面每季約一次、很短而且有模糊處理；吸血鬼幾乎每集殺人，有幾集特別血腥；f-word 頻繁。使用者建議分級：「TV MA for some bloody violence, crude sexual content, and language throughout.」來源：https://www.imdb.com/title/tt7908628/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **95%**（73 則），Popcornmeter **95%**（1,000+）。Consensus：「Delightfully absurd and ridiculously fun, What We Do in the Shadows expands on the film's vampiric lore and finds fresh perspective in its charming, off-kilter cast to create a mockumentary series worth sinking your teeth into.」來源：https://www.rottentomatoes.com/tv/what_we_do_in_the_shadows/s01 （read）。最新季：candidates 檔記錄 S6 92% / Popcorn 87%。
6. **推薦 tag**：
   - A：Emmy Comedy nom 2020、2022、2024、2025
   - B：THR2024（Fienberg honorable mention）；CT10-2024 agg ~#26
   - C：IMDb 8.5（#195）；RT 2024 S6 92% / Popcorn 87%
7. **前置作品**：改編自 2014 年同名電影，**不必先看電影**。影集換了角色與城市，Vulture 的 Matt Zoller Seitz 說主創「started over again with the story and characters, a smart move that allows newcomers to jump right in」（read，見 reviews 檔）。
8. **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-0b10c46a-12f0-4357-8a00-547057b49bac ；JW：https://www.justwatch.com/tw/節目/what-we-do-in-the-shadows — **已在服務商頁面確認**（tw-availability-2）

## 11. The Chair Company

1. **片名**：椅子公司（HBO Max TW 頁，tw-availability-3；豆瓣也用「椅子公司」）／*The Chair Company*
2. **劇情**：Tim Robinson 與 Zach Kanin 為 HBO 創作的尷尬喜劇加懸疑劇。Ron Trosper（Robinson）在工作簡報時因為一張壞掉的椅子出了大糗，從此開始調查椅子製造商背後牽連甚廣的陰謀，職場也因此風波不斷。來源：https://en.wikipedia.org/wiki/The_Chair_Company （read：「follows Ron Trosper, a man who has an embarrassing workplace incident involving a faulty chair; this incident leads him to investigate a far-reaching conspiracy」）
3. **季數與狀態**：1 季、8 集，2025-10-12 在 HBO 首播。**2025-11-20 續訂第 2 季**（Variety 報導，Wikipedia 引用），第 2 季上線日這次沒有查到。截至 2026-11-05 是**續訂中**。來源：同上（infobox `num_seasons=1`、`num_episodes=8`，read）
4. **分級**：美國 **TV-MA**（Certifications 與標題頁，read）。Sex & Nudity **Mild**（3/11）、Violence & Gore **Mild**（3/6）、Profanity **Severe**（4/6）、Alcohol, Drugs & Smoking **Mild**（3/6）、Frightening **Moderate**（3/7）。投稿只有一則：第 1 集主角在倉庫翻到一份文件，裡面有短暫出現的黑白裸照。**每類只有 6–11 票，參考價值低**。來源：https://www.imdb.com/title/tt31987295/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **100%**（53 則），Popcornmeter **68%**（500+）。Consensus：「Tim Robinson's volcanic comedic ethos finds an ideal outlet in The Chair Company, a descent into paranoia that finds huge laughs in deeply uncomfortable places.」來源：https://www.rottentomatoes.com/tv/the_chair_company/s01 （read）。評論與觀眾差 32 點。
6. **推薦 tag**：
   - B：Vulture2025（Nicholas Quah #8）；THR2025（Angie Han #7）；CT10-2025 agg #10
   - C：RT 2025 S1 100% / Popcorn 68%
   - F：RedRecs〈Best TV Shows 2025 – Reddit Reviews〉#5（第三方用 Reddit 留言排序，頁面有聯盟連結）
7. **前置作品**：沒有，是原創劇。熟悉 Robinson 的 Netflix 短劇《I Think You Should Leave》會更容易進入它的幽默，但不是必要（Variety、IndieWire 評論都拿它對照，見 reviews 檔）。「不必先看」是編輯判斷。
8. **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/eada90f0-b5b6-4fc4-aeeb-a350a9ceb46c ；JW：https://www.justwatch.com/tw/節目/the-chair-company — **confirmed on service page**（tw-availability-3）

## 12. The Residence

1. **片名**：白色官邸殺人事件（Netflix Taiwan YouTube 官方預告標題，見欄位 8；LINE TODAY 聚光賞、電影神搜也用這個譯名）／*The Residence*。陸譯「白宫杀人事件」。
2. **劇情**：Paul William Davies 為 Netflix 創作、Shondaland 製作的懸疑喜劇，靈感來自 Kate Andersen Brower 的非虛構書《The Residence: Inside the Private World of the White House》，講白宮國宴當晚總管 A.B. Wynter 陳屍，愛賞鳥的古怪偵探 Cordelia Cupp（Uzo Aduba）在白宮員工與賓客中找兇手。來源：https://en.wikipedia.org/wiki/The_Residence_(TV_series) （read）
3. **季數與狀態**：1 季、8 集，2025-03-20 上線。**Netflix 在 2025-07-02 宣布取消**，只有一季（Wikipedia：「On July 2, 2025, Netflix canceled the series after one season」，read）。IMDb 標為「TV Mini Series」（read）。故事在第 1 季內結案，可當單季完結劇看。
4. **分級**：美國 **TV-MA**（IMDb 標題頁，read：https://www.imdb.com/title/tt8740614/ ）。Sex & Nudity **Mild**（74/149）、Violence & Gore **Mild**（45/61）、Profanity **Severe**（63/113）、Alcohol, Drugs & Smoking **Mild**（51/63）、Frightening **Mild**（35/57）。投稿特別提到：有一場約一分鐘的戶外性愛（男方有抽送動作、沒有露點），之後多次閃回；有一具割腕屍體短暫入鏡；髒話很多，有人逐集統計第 8 集 88 次。來源：https://www.imdb.com/title/tt8740614/parentalguide/ （read，Exa）
5. **RT（S1）**：Tomatometer **84%**（68 則），Popcornmeter **79%**（500+）。Consensus：「The Residence situates itself in the White House for a lighthearted murder mystery that won't tax the brain, but Uzo Aduba's eccentric sleuth brings a welcome level of sophistication to proceedings.」來源：https://www.rottentomatoes.com/tv/the_residence/s01 （read）
6. **推薦 tag**：
   - C：RT 2025 S1 84% / Popcorn 79%
   - D：Nielsen 2025 new original drama runner-up 9.5B min
   - G：LINE TODAY 聚光賞〈2025 歐美劇年度榜〉前十（partial：前言點名，確切名次沒看到）
   - 補充（不是 candidates tag）：Uzo Aduba 入圍 2025 艾美獎喜劇類女主角（關鍵評論網 2025 艾美獎名單，snippet）
7. **前置作品**：沒有。改編自非虛構書，不必先讀。來源：同欄位 2（read）
8. **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81005297 ；JW：https://www.justwatch.com/tw/節目/bai-se-guan-di-sha-ren-shi-jian — tw-availability-2 原等級 **僅 JustWatch**。**這次補查**：Netflix Taiwan 官方預告〈《白色官邸殺人事件》| 正式預告 | Netflix〉，頻道 **Netflix Taiwan**，2025-02-19（https://www.youtube.com/watch?v=NvEDWVM_AvM ，read）。判定：**confirmed（official channel）**，台灣譯名也一併確認。Netflix Original，雖然已取消但下架風險低。

---

## 結果摘要

- 12 部的欄位 2、3、4、5、7 都有讀到的來源（read）。Parents Guide 有 2 部票數不全（Cobra Kai 後三類、Maisel Profanity），The Office 的類別是依順序對應。
- **台灣串流**：12 部全部有台灣證據。
  - 服務頁確認（照抄原檔）：OMITB、Atlanta、WWDITS（Disney+）；BBT、Chair Company（HBO Max）；The Office（HBO Max A，另 Prime B）。
  - 這次補成 **confirmed（Netflix Taiwan 官方 YouTube）**：Emily in Paris（2025-12-03）、Cobra Kai（2024-12-24）、The Residence（2025-02-19）。
  - 這次補成 **confirmed（台灣媒體，沒有官方影片）**：Nobody Wants This（Livio，第 3 季）、A Man on the Inside（Livio，第 2 季；台灣譯名「臥底老紳士」）、The Marvelous Mrs. Maisel（Yahoo TW 2026-05-27）。
- **前置作品**：只有 Cobra Kai 建議先看電影《小子難纏》（1984）。WWDITS（電影改編）、The Office（英劇改編）、A Man on the Inside（紀錄片改編）都不必先看原作。

## 無法查證或尚待確認的事實

1. **Nobody Wants This、A Man on the Inside 的台灣證據只有 Livio 生活網**，文章標籤有「媒體採購」，性質接近片商供稿。沒有找到 Netflix Taiwan YouTube、Netflix TW Facebook 或 Netflix 官方新聞稿。建議用台灣裝置確認，或再搜 Netflix 台灣 IG／FB。
2. **A Man on the Inside 的台灣官方譯名**：台灣媒體、部落格一致用「臥底老紳士」，但沒有 Netflix 台灣頁或官方影片可對；vocus 部落格寫「新手老臥底/臥底老紳士」並列。
3. **The Office 兩個台灣譯名**：「我們的辦公室」（HBO Max）和「辦公室瘋雲」（Prime Video）都是服務頁上的名稱；Netflix 台灣和 CATCHPLAY+ 的譯名沒有驗證。
4. **Cobra Kai 是授權劇**（Sony 發行），Netflix 台灣上架的最新官方證據是 2024-12-24，之後有沒有下架沒有確認。
5. **Atlanta、Maisel 的 GG Comedy win**：candidates-awards-critics.md 自己註明 GG 2016–2020 的得獎欄位擷取不全，但表內仍標 win。要寫「金球獎得獎」前需要回 Wikipedia 確認。
6. **Nobody Wants This 是否續訂第 4 季、Chair Company 第 2 季上線日、A Man on the Inside 第 3 季上線日**：這次只抽到續訂／最終季的句子，沒有查到日期。
7. **最新季 RT 分數**（OMITB S5、AMOTI S2、Emily S5、Cobra S6、WWDITS S6）是抄 candidates 檔，這次沒有重抓季頁。Emily S5 Popcorn 37%、AMOTI S2 Popcorn 70% 和 S1 差距大，引用前建議重讀。
8. **美國分級**：全部來自 IMDb 標題頁，沒有用平台（Netflix、Hulu、Prime）官方頁核對。The Residence 有投稿說「rated 13」，可能指某地區平台分級，未查。
9. **Parents Guide 是使用者投稿**，描述可能主觀。Chair Company 每類只有 6–11 票。

## 工具降級紀錄（toolDegradation）

- 容器直連 curl（Wikipedia、RT、Metacritic、IMDb）全被代理拒絕（`CONNECT tunnel failed, response 403`，`connect_rejected`），全部改走 MCP 工具。
- Wikipedia、Wikidata、RT：Groundlane `web_extract` 一次成功，沒有降級。
- IMDb：Exa `web_fetch_exa` 讀到 10 部 Parents Guide 與 12 部標題頁；The Office、Emily in Paris 的 Parents Guide 在 Exa 只回標題 → Jina `read_url`（無 API key，`question` 參數無效，回全文）。Cobra Kai 的擷取在 Profanity 段落截斷。
- YouTube：Groundlane `web_extract`（meta 標籤）成功。
- Livio 生活網 234015：Groundlane `web_fetch` 回 gzip 亂碼 → Tavily `tavily_extract` 成功。
- Groundlane `web_search` 有一次 `RATE_LIMITED`（brave），改用 Tavily `tavily_search`。
- 沒有用 Firecrawl、cloudflare `get_url_markdown`。
