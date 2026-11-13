# 陸劇 3 事實表：都市愛情、家庭與時代（21 部）

- 查核日：2026-11-13。順序照 `post-cn3-shows.txt`（早春晴朗由第 2 篇移入，插在 狙擊蝴蝶 之後，照該檔順序）。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取或搜尋結果裡的頁面內容（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。早春晴朗 全部欄位沿用 `factsheets-cn2.md` §15（2026-11-12 查核），這輪沒有重查。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。這輪 21 部沒有遇到業配標示。
- **官方榜不計入類別**：awards 檔的 `A*`（FT 飛天獎、GE 金鷹獎）與 `S`（S-TJ2024 年度劇集推優）是國家廣電總局／中國文聯系統的榜，照 merged 檔規則**不算進 A–G**，各劇另列「官方榜」一行。FT-nom（飛天入圍）awards 檔本來就不計，這裡也只附註。
- **「只算一次」的規則**：
  - ratings 檔 §5：同一資料家族只算一個——豆瓣（DB20–25）、云合（YH23/24/25）、灯塔（LT24/25）、猫眼（MYP25 播放＋MYH25 熱度）、平台站內熱度（PH25＋IQ10K）、Netflix（NF26）、微博（WB25/26）、IMDb、MDL。同一家族的 tag 並列在同一個括號裡。生萬物 同時有 MYP25（D）與 MYH25（E），猫眼只算一次。
  - fans 檔：PTT 使用者 HTC92 連寫 2023／2024／2025「最喜歡的中劇」串（S6／S5／S1），他本人的評價只算一聲；推文是不同人，照 fans 檔點算。
- **欄位 4 分級要分三層看**：
  1. **中國沒有影視分級制度**，衛視與平台播出不標年齡。
  2. 台灣平台頁分級：只照抄 `tw-availability` 檔有記錄的。**本篇 21 部在 tw-availability 檔裡都沒有記錄平台頁分級**（第 2 篇的兩筆 Disney+ 12+ 都不是本篇的劇）；這輪沒有另外抓（沒有台灣 IP，Netflix 頁不算證據）。
  3. IMDb Certifications 的 Taiwan 列是**使用者可編輯**資料，只算旁證；**本篇 21 部全部沒有 Taiwan 列**。IMDb Parents Guide 是使用者投稿與投票，不是官方分級；嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。MDL 的 Content Rating 也是使用者／編輯填的，一併列出但同樣只是旁證。
- **Parents Guide 多半是空的**：21 部裡有投票的只有 偷偷藏不住（每類 10–26 票）、難哄（5–13 票）、當我飛奔向你（6–11 票）、以家人之名（3–4 票）、早春晴朗（1–5 票，cn2）、許我耀眼（1–2 票）。其餘 15 部五類全是「No data／No voting data」（180天重啟計劃、大生意人 有未投票的投稿文字，各劇註明）。
- **欄位 5 豆瓣**：sec.douban.com 沒有碰，豆瓣頁面本體沒有讀（搜尋結果裡出現的 movie.douban.com 摘要一律不採用）。分數只用 (a) candidates 檔已記的（LT25 新聞、云合 YH24 PDF、DB24 年度榜），或 (b) 新聞已引用、且這輪用 Groundlane `web_extract` 讀到原文句子的分數（標 read＋日期＋媒體）；只看到搜尋摘要的標 **snippet**。開分值和現值常不同，各劇寫明是「開分」還是某日新聞引用值。

## 這份資料的限制

1. **豆瓣與 MDL／IMDb 落差大，方向因類型而異**。現代甜寵／偶像劇在 MDL 很高、豆瓣偏低：難哄 MDL 8.8（47,582 人）vs 豆瓣 5.4（搜狐 2025-02，read）、偷偷藏不住 MDL 9.0（97,413 人）vs 豆瓣開分 6.7（新浪 2023-07，read）、早春晴朗 MDL 8.5 vs 開分 6.7（snippet）。年代／寫實劇反過來：豆瓣高、MDL／IMDb 人數極少——人世間 MDL 7.8 只有 55 人、IMDb 158 票；小巷人家 豆瓣 8.3 vs MDL 473 人。三個平台不要合成一個「品質分」。
2. **生萬物 IMDb 3.3（608 票）**，與 MDL 8.2、豆瓣 7.2（LT25）差很多，是本篇唯一 IMDb 低於 5 的劇。沒有查原因，不要推測是洗分；文章若引用要寫明票數並附 MDL／豆瓣對照。
3. **MDL／IMDb 樣本差很多**。MDL 過萬人的有 偷偷藏不住（97,413）、當我飛奔向你（62,728）、難哄（47,582）、以家人之名（39,513）、在暴雪時分（24,008）、早春晴朗（18,399）、許我耀眼（14,612）、去有風的地方（13,395）；年代劇多半只有幾十到幾百人（人世間 55、老舅 31、180天重啟計劃 127、繁花 228、蠻好的人生 311）。IMDb 只有 偷偷藏不住（9.9K）、難哄（5.1K）、當我飛奔向你（4.4K）、以家人之名（2.5K）、早春晴朗（2.2K）、在暴雪時分（2K）過兩千；老舅 14 票、180天重啟計劃 24 票，幾乎不能拿來比。
4. **豆瓣分數來源參差**：candidates 檔 read 來源只有 小巷人家 8.3、我的阿勒泰 8.9（YH24 PDF）、生萬物 7.2、許我耀眼 6.5、蠻好的人生 6.4（LT25）；人世間 8.1 在 ratings 檔本身就標 snippet。這輪讀到新聞原文的有 繁花、玫瑰的故事、北上、去有風的地方、偷偷藏不住、當我飛奔向你、向風而行、狙擊蝴蝶、大生意人、老舅、難哄。在暴雪時分、以家人之名、早春晴朗 只有 snippet；180天重啟計劃 讀不到任何新聞引用值。
5. **IMDb 分數讀取方式不一**：多數是 Exa `web_fetch_exa` 讀標題頁（cache）；玫瑰的故事、蠻好的人生、小巷人家、180天重啟計劃 的標題頁 Exa 逾時，改用 jina `read_url`（read）；在暴雪時分、老舅 是 Exa 搜尋結果裡的標題頁內容（cache）。Parents Guide 與 Certifications 全部是 jina `read_url` 讀全頁（read）。
6. **IMDb 條目**：在暴雪時分（tt28183145）、老舅（tt34607647）、180天重啟計劃（tt29613358）是這輪用 Exa 搜尋找到的；其餘來自 zh.wikipedia infobox 或 Wikidata（P345）。繁花 的 Wikidata 項 Q48773410 對到 tt3881914，IMDb 頁標題是 *Blossoms Shanghai (TV Series 2023–2024)*，對得上。
7. **zh.wikipedia 缺條目**：180天重啟計劃、狙擊蝴蝶、老舅 用 `?action=raw` 試簡繁與「(电视剧)」後綴都 404，劇情與播出資訊改用 MDL（read）。玫瑰的故事 只讀到 infobox 前段（集數、片長、類型），首播日與平台用 MDL＋ratings 檔。
8. **台灣串流沒有台灣 IP 驗證**（沿用 tw-availability 的規則）；在暴雪時分、人世間 是 `licensed-old`；**我的阿勒泰 Hami 授權 2026-12-01 到期**（距查核日不到三週），文章發布前要再確認；繁花 只在 myVideo，無法驗證是否仍上架。
9. **類型核對**：21 部大致可分三組（見文末）。**大生意人**是晚清古裝商戰劇（zh.wikipedia「古装、商业、爱情」），放「時代」勉強可以，但不是現代劇，要在文章說明；**北上**是現代 90 後成長＋運河年代群像，介於家庭與年代之間。
10. **候選 tag 偏誤**：fans 檔 G 類偏 Netflix 台灣（Tudum 只抽 14 週）、LINE TODAY 與 myVideo／愛奇藝台灣站年榜；PTT 樣本偏古裝，年代劇（人世間、生萬物、老舅）幾乎沒有 F／G。awards 檔 A 類以白玉蘭為主；年代劇常同時拿飛天、金鷹（官方榜，不計）。C 類的 MDL／IMDb 樣本偏甜寵劇。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播／完結日、平台與衛視、每集片長、原作、前後作、劇情 | zh.wikipedia wikitext（`?action=raw`）：`难哄`、`许我耀眼`、`偷偷藏不住_(电视剧)`、`当我飞奔向你`、`在暴雪时分`、`玫瑰的故事_(电视剧)`、`蛮好的人生`、`向风而行`、`以家人之名`、`繁花_(电视剧)`、`北上_(电视剧)`、`去有风的地方`、`小巷人家`、`生万物`、`人世间_(电视剧)`、`我的阿勒泰`、`大生意人` | Groundlane `web_extract`（pattern 抽 infobox 欄位、導言、劇情段） | read（17/20；玫瑰的故事 partial）。180天重啟計劃、狙擊蝴蝶、老舅 沒有條目（404），改用 MDL |
| MDL 分數、人數、集數、播出日、片長、Content Rating、genre、簡介、原作 | MDL 站內搜尋 `mydramalist.com/search?q=` 取連結；作品頁 `ratingValue">X</b>/10 from N users`、`Episodes:`、`Aired:`、`Duration:`、`Content Rating:`、`li.show-genres`、`div.show-synopsis`、`Original Network:` | Groundlane `web_extract`（render=never） | read（20/20）。注意 slug 與片名不符：當我飛奔向你 `62295-luo-yao-knew-what-he-meant`、大生意人 `63963-the-tycoon`、180天重啟計劃 `755761-180-tian-pei-chan-ji-hua`、生萬物 `761585-wan-wu-sheng`；難哄 另有 `782180-nan-hong`（無評分的重複條目，不用）；偷偷藏不住 要用 `729705-hidden-love`（2023），`685131-hidden-love` 是 2020 年同名電影 |
| IMDb ID | zh.wikipedia infobox `imdb_id`；Wikidata SPARQL（P345，以 zh 標籤查）；在暴雪時分、老舅、180天重啟計劃 用 Exa 搜尋 | Groundlane `web_fetch`／Exa `web_search_exa` | read／cache |
| IMDb 評分與票數 | IMDb 標題頁 | Exa `web_fetch_exa`（maxCharacters 400–700）；逾時的改 jina `read_url` | cache（14）／read（4）／cache-搜尋結果（2） |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文） | read（20/20）。Groundlane `web_extract` 對 IMDb 只拿到 2 KB 空殼，不用 |
| 豆瓣分數 | candidates 檔（LT25、YH24、DB24、DB22）＋新聞（新京報、華龍網、網易、新浪、搜狐、Cosmopolitan TW） | Groundlane `web_search`（brave／you）找；`web_extract` 抽原文含「豆瓣」的句子 | candidates 檔 read；新聞 11 部 read，其餘 snippet |

toolDegradation：
- Groundlane MCP 是主力（zh.wikipedia、MDL、Wikidata、中文新聞搜尋與原文抽句）。`web_search` 的 tavily、exa provider 在 Groundlane 內「unavailable」，brave 間歇 unavailable，結果多由 you.com 回傳。Groundlane 讀 IMDb 只拿到 2 KB 空殼（被擋），改用 Exa／jina。`web_extract` 的 pattern 用了巢狀量詞時回 `INVALID_INPUT`（high-risk regex），改成單層 `[\s\S]{0,400}` 後正常。新浪財經 cj.sina.com.cn（狙擊蝴蝶 4.2→7.2 那篇）只回 1.3 KB，讀不到內文。
- Exa（`web_fetch_exa`）讀 IMDb 標題頁（cache）；tt29930328、tt31887577、tt29469265、tt29613358 連續兩次 `CRAWL_LIVECRAWL_TIMEOUT`，降級到 jina。`web_search_exa` 找到在暴雪時分、老舅 的 IMDb 頁與 180天重啟計劃 的 ID（MooveeDB／NeoDB 第三方頁，IMDb 分數後來以 jina read 確認）。
- jina `read_url` 讀 IMDb Parents Guide 全頁與 4 個標題頁（read）；`question` 參數因無 key 無效，回全文。許我耀眼 Parents Guide 第一次 30 秒逾時，重試成功。
- Tavily、Firecrawl 沒用到。沒有用終端機 curl，沒有碰 sec.douban.com 或豆瓣頁面本體。

---

## 1. 難哄

1. **片名**：**難哄**（Netflix 台灣媒體報導）（tw-availability-1）／难哄／*The First Frost*（zh.wikipedia、MDL、IMDb）
2. **劇情**：電視台記者溫以凡（章若楠）與高中時拒絕過的桑延（白敬亭）多年後重逢，陰錯陽差成了室友，舊情重燃。zh.wikipedia：「讲述了温以凡与桑延久别重逢的故事」（read）；MDL 簡介：「It was by pure chance that Wen Yifan became housemates with Sang Yan, whom she had rejected during high school.」（read）。來源：https://zh.wikipedia.org/wiki/难哄 、https://mydramalist.com/722171-first-frost
3. **季數與狀態**：32 集，2025-02-18 到 03-10，優酷首播、Netflix 同步，每集 45 分鐘（zh.wikipedia infobox，read；MDL 同，read）。瞿友寧（台灣導演）編導。**已完結**。
   - zh.wikipedia infobox：前作《偷偷藏不住》（2023）、**續作《折月亮》（2026）**（read；沒有另查《折月亮》是不是同一故事，竹已的「偷偷」系列各書主角不同）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄（Netflix 頁不算）。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；Australia M、Singapore PG13、South Korea 15（2025, self-applied）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31887832/parentalguide/ ）：Sex & Nudity **None**（8 of 13；投稿「a couple kissing scenes…Sex is mildly implied in one scene」）；Violence & Gore **Mild**（6 of 8）；Profanity **None**（5 of 6）；Alcohol, Drugs & Smoking **Mild**（6 of 8）；Frightening & Intense **Moderate**（5 of 5；投稿「Deals with some of deeper topics and some scenes can be disturbing…14 and up」）。
   - MDL Content Rating：13+（read）。
   - 需要提醒：女主過去的創傷與騷擾情節（搜狐 2025-02-26 文提到「前9集里出现多次性骚扰情节」，read）；IMDb 投稿也說有令人不安的段落。
5. **觀眾評分**：
   - MDL **8.8**（47,582 人，https://mydramalist.com/722171-first-frost ，read）。
   - IMDb **8.4**（5.1K，tt31887832，cache）。
   - 豆瓣 **5.4**（搜狐 2025-02-26「在豆瓣上的评分仅为5.4分」，read；文中未寫是否開分、人數）。另：起點問答摘要稱「最后落到了 6.7 分」（snippet，來源可信度低，不採用）。
6. **推薦 tag**（merged：CDEFG，5 類）：
   - C：MDL #14 8.8（47,537）；IMDb 8.4（5.1K）
   - D：云合 YH25 top20（新聞只列「前二十」，沒有名次）
   - E：WB25 年度大眾喜愛作品
   - F：PTT 2025 最喜歡串 8 推（1 人「沒被哄好」）；PTT kamenatsumi 回顧「完成度相當高」；Dcard 吾言少女 2025 上半年 #2（143 票）；MDL 使用者清單 #1（國際粉絲，弱）
   - G：LINE TODAY 2025 陸劇年度榜 #1；DailyView 2025 年度聲量 #1（89,454 筆）；Netflix TW 2025-03-02 #1（累計 7 週）
   - （不計：ACA 2025 People's Choice 類〔白敬亭〕，awards 檔標人氣獎不計。）
7. **前置作品**：**改編網路小說**（竹已《難哄》；MDL：「Adapted from the web novel "First Frost" (难哄) by Zhu Yi」，read）。與《偷偷藏不住》同作者、同一系列（zh.wikipedia 列為前作），但主角不同，**不必先看**（判斷）。
8. **台灣串流**：Netflix: no TW ID found. No Hami, friDay, LINE TV or Disney+ page was found. — 證據：Cosmopolitan TW, 2025-04-04 (https://www.cosmopolitan.com/tw/entertainment/movies/g61941830/the-first-frost/): 「《難哄》於2025年2月18日於Netflix上線，共32集」. Harper's Bazaar TW 2025-02-17 (https://www.harpersbazaar.com/tw/culture/drama/g63812052/the-first-frost-highlights/) embeds 「《難哄》 \| 正式預告 \| Netflix」. Tudum TW 2025-03-02 #1. — **confirmed (Taiwan media, 2025-04)**（tw-availability-1）
- **類型核對**：zh.wikipedia「都市、爱情」；MDL Romance／Life／Youth／Drama；IMDb Coming-of-Age／Drama／Romance。**符合（都市愛情）**。

## 2. 許我耀眼

1. **片名**：**許我耀眼**（LINE TV 頁；Netflix Taiwan YT）（tw-availability-1）／许我耀眼／*Love's Ambition*（zh.wikipedia、MDL、IMDb）
2. **劇情**：當紅主播許妍（趙露思）靠「精心裝點」的身世嫁給都市精英沈皓明（陳偉霆），婚姻破裂後她在事業與感情低谷重新認識自己，沈皓明則發現自己早已動心，想把她追回。zh.wikipedia 劇情大綱：「許妍靠著光鮮的主持人身分和"精心裝點"的身世順利和沈皓明步入婚姻……全劇以自我認同、誠信與救贖為主題」（read）。
3. **季數與狀態**：32 集，2025-09-26 騰訊視頻首播，東方衛視 09-28 首播，海外 WeTV、LINE TV、Netflix，每集約 45 分鐘（zh.wikipedia，read）；MDL 寫 09-26 到 10-11（read）。**已完結**。沒有讀到續季消息。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 LINE TV 頁分級。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32582480/parentalguide/ ）：Sex & Nudity **None**（2 of 2）；Violence **None**（1 of 1）；Profanity **None**（1 of 1）；Alcohol **Mild**（1 of 1）；Frightening **None**（1 of 1）。**票數 1–2，參考價值很低**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒（婚姻欺瞞、家庭偏心題材，判斷）。
5. **觀眾評分**：MDL **8.3**（14,612 人，https://mydramalist.com/769801-xu-wo-yao-yan ，read）；IMDb **7.4**（931，tt32582480，cache）；豆瓣 **6.5**（灯塔 LT25 新聞引用，ratings 檔，read）。
6. **推薦 tag**（merged：BDFG，4 類）：
   - B：XZK 2025 年度熱劇（awards 檔標 popularity-type）
   - D：云合 YH25 #3（熱播期集均 6328 萬）；灯塔 LT25 #5 19.64 億；猫眼 MYP25 都市劇有效播放雙榜冠軍 16.19 億；平台熱度 PH25 騰訊視頻 2025 熱度值 #1——各家族算一次
   - F：PTT 2025 推薦串 3 推；PTT kamenatsumi 回顧正評；MDL 使用者清單 #7（弱）；（PTT 2025 最喜歡串 正 1／負 1「看不太下去」）
   - G：LINE TODAY 2025 陸劇 #3；DailyView 2025 #3（「在台灣Netflix上線後……拿下收視亞軍」）；Netflix TW 2025-10-26 #2（累計 7 週）
7. **前置作品**：**改編小說**（張悅然《大喬小喬》；zh.wikipedia，read）；同一原作另有電影《喬妍的心事》（2024）（zh.wikipedia related 欄，read）。不必先看（判斷）。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/17522/eps/1. Netflix: https://www.netflix.com/tw/title/82050339 (indexed as 「觀賞《許我耀眼》 \| Netflix」; lead). — 證據：LINE TV page loaded on 2026-11-12 with no 「授權到期」. https://www.youtube.com/shorts/WYU58NtZado 「《許我耀眼》｜夫妻一場不演了」, Netflix Taiwan, 「#許我耀眼 現正熱播」 (no date). Tudum TW 2025-10-26 #2. — **confirmed (service page + official channel)**（tw-availability-1）
- **類型核對**：zh.wikipedia「相愛相殺、都市愛情」，導言「都市職場劇」；MDL Romance／Life／Drama／Family。**符合（都市愛情）**。

## 3. 偷偷藏不住

1. **片名**：**偷偷藏不住**（Netflix 台灣媒體報導）（tw-availability-1）／偷偷藏不住／*Hidden Love*（zh.wikipedia、MDL、IMDb）
2. **劇情**：桑稚（趙露思）國中起暗戀常來家裡找哥哥的段嘉許（陳哲遠），上大學到他所在的城市後兩人重新相處、慢慢相戀。IMDb 簡介：「Sang Zhi falls in love with Duan Jia Xu, the boy who often comes to her house to play with her brother. Years after she joins the university in the city he now lives…they slowly fall in love.」（cache）。
3. **季數與狀態**：25 集，2023-06-20 到 07-20（zh.wikipedia；MDL 寫到 07-06），優酷首播，Netflix 06-29 起全球播出（zh.wikipedia 電視網1，read），每集約 45 分鐘。**已完結**。
   - 竹已同系列：《難哄》（2025，本篇 #1）、《當我飛奔向你》（2023，本篇 #4）是同作者其他小說改編，主角不同。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；United States TV-Y7（Netflix rating）、Argentina 7（Netflix rating）、Brazil 12、Singapore PG、UK PG、Indonesia R、UAE 13+（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt28076458/parentalguide/ ）：Sex & Nudity **Mild**（12 of 26；投稿「Boyfriend and girlfriend kiss simply a few times」）；Violence & Gore **Mild**（13 of 16）；Profanity **None**（7 of 10）；Alcohol **Mild**（7 of 10）；Frightening **None**（8 of 10）。本篇票數最多。
   - MDL Content Rating：13+（read）。
   - 需要提醒：尺度輕；男女主年齡差（女主國中起暗戀大學生，劇情設定，判斷），文章可提一句。
5. **觀眾評分**：MDL **9.0**（**97,413 人，本篇最多**，https://mydramalist.com/729705-hidden-love ，read）；IMDb **8.6**（9.9K，tt28076458，cache）；豆瓣 **開分 6.7**（新浪 2023-07-18，轉錄微博「#偷偷藏不住豆瓣开分6.7分#」，read；知乎問題摘要稱「11万人打分」，snippet）。
6. **推薦 tag**（merged：BCF，3 類）：
   - B：NDY2023 #10
   - C：MDL #4 9.0（97,375）；IMDb 8.6（9.8K）
   - F：PTT 2023 最喜歡串 約 32 推；（PTT jpeg 2025 補看「順順看」，中性）
   - （已刪：YH23-x V30 snippet。G 類 candidates 沒有；tw-availability 證據欄的 ETtoday「Netflix台灣第一」、風傳媒甜寵 TOP10 #9 不是 candidates tag。）
7. **前置作品**：**改編網路小說**（竹已《偷偷藏不住》；zh.wikipedia，read）。不必先看任何作品（判斷）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81705641 (indexed TW page; lead) — 證據：風傳媒 2026-07-01 (https://www.storm.mg/lifestyle/11146091): Netflix 甜寵陸劇 TOP10 #9 《偷偷藏不住》. Also ETtoday 2023-07-03: 「Netflix台灣第一」. — **confirmed (Taiwan media, 2026-07-01)**（tw-availability-1）
- **類型核對**：zh.wikipedia「青春、校园、爱情」；MDL Comedy／Romance／Life／Youth。**符合（都市愛情，偏青春校園）**。

## 4. 當我飛奔向你

1. **片名**：**當我飛奔向你**（Netflix 台灣媒體報導）（tw-availability-1）／当我飞奔向你／*When I Fly Towards You*（zh.wikipedia、MDL、IMDb）
2. **劇情**：直球高中少女蘇在在（張淼怡）雨天在小賣部前對校草張陸讓（周翊然）一見鍾情，用偏愛融化他的心防，一路從高中走到大學。zh.wikipedia 劇情簡介：「可愛開朗的16歲直球高中少女「蘇在在」，在某天下雨時在小賣部前遇見同級校草「張陸讓」，就此對他一見鍾情」（read）。
3. **季數與狀態**：24 集，2023-06-13 到 07-18，優酷；Netflix 2023-08-16 全集上線（zh.wikipedia 播放平台表，read）；每集 30–43 分鐘（zh.wikipedia）／35 分鐘（MDL）；MDL 寫 06-13 到 06-29（read）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；United States TV-PG、Argentina 13（Netflix rating）、Australia M、Singapore PG、UK 12、UAE Not Rated（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt28036189/parentalguide/ ）：Sex & Nudity **Mild**（8 of 11；投稿描述大學後兩段接吻、暗示性場面「Nothing else is shown on screen」，以及一段職場上司不當注視的情節）；Violence **None**（7 of 9）；Profanity **None**（8 of 9）；Alcohol **Mild**（4 of 6）；Frightening **None**（6 of 8）。
   - MDL Content Rating：13+（read）。
   - 需要提醒：校園段落尺度很輕；後段有職場騷擾暗示（IMDb 投稿）。
5. **觀眾評分**：MDL **9.0**（62,728 人，https://mydramalist.com/62295-luo-yao-knew-what-he-meant ，read）；IMDb **8.5**（4.4K，tt28036189，cache）；豆瓣 **7.9**（Cosmopolitan TW 2025-02-25「在豆瓣上獲得了7.9的高分」，read）。另：新浪 2023-07-18 摘要「豆瓣评分涨到7.6」（snippet）。開分值沒有讀到。
6. **推薦 tag**（merged：CFG，3 類）：
   - C：MDL #2 9.0（62,689）；IMDb 8.5（4.4K）
   - F：PTT 2023 最喜歡串 約 34 推
   - G：Netflix TW 2023-08-27 #8（1 週）
7. **前置作品**：**改編網路小說**（竹已《她病得不輕》，又名《當我飛奔向你》；zh.wikipedia，read）。不必先看（判斷）。
8. **台灣串流**：Netflix: https://www.netflix.com/tw/title/81712983 (indexed TW page; lead) — 證據：風傳媒 2026-07-01 (https://www.storm.mg/lifestyle/11146091): Netflix 甜寵陸劇 #1 《當我飛奔向你》. Also Beauty321 2026-09-01 (https://www.beauty321.com/post/73151). — **confirmed (Taiwan media, 2026-09-01)**（tw-availability-1）
- **類型核對**：zh.wikipedia「校園、愛情」；MDL Comedy／Romance／Youth。**符合（都市愛情，偏青春校園）**。

## 5. 在暴雪時分

1. **片名**：**在暴雪時分**（Hami 頁標題，2024）（tw-availability-1）／在暴雪时分／*Amidst a Snowstorm of Love*（zh.wikipedia、MDL、IMDb）
2. **劇情**：因衝撞裁判被禁賽後負氣退役的前斯諾克天才林亦揚（吳磊），在暴雪之夜遇見當紅九球選手殷果（趙今麥），在她的帶動下重返賽場。zh.wikipedia 劇情介紹：「昔日天才級職業司諾克選手林亦揚與當紅九球選手殷果相遇在一場十年難得一遇的暴雪之夜」（read）。
3. **季數與狀態**：30 集，2024-02-02 到 02-18，騰訊視頻 18:00、東方衛視 19:30（zh.wikipedia，read）；MDL 寫到 02-14、每集 45 分鐘（read）。Netflix 2024-02-21 起（日韓以外）；台灣 愛爾達影劇台 2024-05-03、八大戲劇台 2024-11-22 播出（zh.wikipedia 播放表，read；線性電視不算串流）。黃天仁（《想見你》導演）執導。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄（Hami 頁已失效）。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 Singapore PG（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt28183145/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：13+（read）。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **8.5**（24,008 人，https://mydramalist.com/702919-during-the-snowstorm ，read）；IMDb **7.9**（2K，tt28183145，cache-搜尋結果）；豆瓣 **開分 6.9**（知乎問題標題 2024-02-16，snippet；起點問答摘要稱後降至 6.6，snippet）。**沒有讀到原文引用值**。
6. **推薦 tag**（merged：BCDF，4 類）：
   - B：BJN 2024 年度劇集
   - C：IMDb 7.9（2.0K）
   - D：云合 YH24 #19 11.9 億
   - F：PTT 2024 最喜歡串 5 推；PTT 入坑串 1
7. **前置作品**：**改編小說**（墨寶非寶《在暴雪時分》，作者兼編劇；zh.wikipedia，read）。不必先看（判斷）。
8. **台灣串流**：None current. Hami https://hamivideo.hinet.net/product/259259.do?cs=2 now returns the generic 「HamiVideo」 shell (**lapsed**). Netflix: only a HK page (`netflix.com/hk/title/81760073`) surfaced; no TW page was indexed. Linear: 八大電視 programme page https://www.gtv.com.tw/Program/P2024112201/index.html. — 證據：beauty321, 2024-05-28 (https://www.beauty321.com/post/60022): 「在Netflix上線啦」. That launch article is the only evidence; the Hami copy has since lapsed. — **licensed-old**. This is a judgement call: the evidence is from 2024, not 2023 or earlier, but it is only a launch article for a licensed (non-original) title with the Hami copy lapsed, so it is not marked confirmed.（tw-availability-1）
- **類型核對**：zh.wikipedia「都市、偶像」；MDL Romance／Sports；IMDb Drama／Romance／Sport。**符合（都市愛情，運動題材）**。

## 6. 玫瑰的故事

1. **片名**：**玫瑰的故事**（Hami 頁）（tw-availability-1）／玫瑰的故事／英文名不統一：MDL、IMDb 用 *The Tale of Rose*，tw-availability／ratings 檔寫 *The Story of Rose*，zh.wikipedia 英文名欄空白（read）
2. **劇情**：書香世家出身的黃亦玫（劉亦菲）從初入職場到創業策展，經歷初戀錯過、婚姻離散與靈魂伴侶病逝，仍選擇把人生活得精彩。MDL 簡介：「Born in a scholarly family, Huang Yi Mei grew up carefully sheltered…Despite her grief and pain, Huang Yi Mei ultimately chooses to look forward to the future」（read）。zh.wikipedia 標語：「人们爱的是一些人，与之结婚生子的，又是另外一些人。」（read）
3. **季數與狀態**：38 集，每集約 45–47 分鐘（zh.wikipedia infobox，read）；MDL 寫 2024-06-08 到 06-22、每集 45 分鐘（read）；平台 CCTV-8／騰訊視頻（ratings 檔，read；zh.wikipedia 播出段沒有讀到）。汪俊執導。**已完結**。導演稱「開放式結局，但沒有續集」（華龍網 2024-06-21，read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 Australia M（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt29930328/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒（多段感情、離婚、絕症題材，判斷）。
5. **觀眾評分**：MDL **8.2**（2,215 人，https://mydramalist.com/740501-the-story-of-rose ，read）；IMDb **6.8**（568，tt29930328，jina read）；豆瓣 **開分 7.1**（超過 8.7 萬人；華龍網 2024-06-21「6月21日，该剧豆瓣开分7.1分，目前打分人数超8.7万」，read）。新浪 2026-11-02 摘要說維持 7.1（snippet）。
6. **推薦 tag**（merged：ADFG，4 類，● 有官方榜）：
   - A：MAG 2025 nom
   - D：云合 YH24 #5 22.9 億、熱播期集均 #5；灯塔 LT24 電視劇榜 #3 20.82 億、都市劇冠軍——各家族算一次
   - F：PTT 2024 最喜歡串 1（「沒有之一 竟然沒人推」）
   - G：LINE TODAY 2024 陸劇 點名（推定 8–10 名，順序沒寫）
   - 官方榜（不計）：GE 2026 nom；S-TJ2024；FT-nom 2026（不計）
   - （不計：BJN 2024 只在前言提到，不是榜單條目。）
7. **前置作品**：**改編小說**（亦舒《玫瑰的故事》；zh.wikipedia、MDL，read）。1986 年另有同名電影（zh.wikipedia 消歧義頁，read），不是前作。不必先看（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/271369.do?cs=2 (下架時間 2029-06-07) — 證據：The page loaded on 2026-11-12 with the title. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「都市情感」；MDL Romance／Life；IMDb Drama／Romance。**符合（都市愛情；也可放「女性人生」）**。

## 7. 蠻好的人生

1. **片名**：**蠻好的人生**（Hami 頁；Netflix Taiwan YT）（tw-availability-1）／蛮好的人生／*A Better Life*（zh.wikipedia、MDL、IMDb）。港澳名《中年好翻身》（zh.wikipedia，read）
2. **劇情**：39 歲的金牌保險業務胡曼黎（孫儷）同時失去婚姻與工作，與當初害她被開除的 28 歲新人薛曉舟（董子健）從互相誤解到聯手重新出發。MDL 簡介：「Hu Man Li, a thirty-nine-year-old insurance practitioner, lost her marriage and job at the same time…decided to ignore the past grudges and join forces with Xue Xiao Zhou to start over.」（read）
3. **季數與狀態**：36 集，2025-04-17 到 05-04（zh.wikipedia；MDL 寫到 05-02），CCTV-8、優酷、東方衛視；台灣中華電信 MOD、Hami Video（zh.wikipedia 頻道欄，read），每集約 45 分鐘。汪俊執導。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄 Hami 頁分級。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 Singapore PG13（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31887577/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **7.7**（311 人，https://mydramalist.com/763259-man-hao-de-ren-sheng ，read）；IMDb **7.3**（118，tt31887577，jina read）；豆瓣 **6.4**（灯塔 LT25 新聞引用，ratings 檔，read）。
6. **推薦 tag**（merged：ADEFG，5 類，● 有官方榜）：
   - A：MAG 2026 nom
   - D：云合 YH25 #18 11 億；灯塔 LT25 #8 14.61 億——各算一次
   - E：WB25 年度優秀作品
   - F：PTT 2025 推薦串 2 推
   - G：Netflix TW 2025-07-13 #6（累計 6 週）；Hami Video 影劇館+ 2025 年度戲劇 #6
   - 官方榜（不計）：GE 2026 nom；FT-nom 2026（不計）
   - （已刪：CVB25 CCTV8 2.3%，ratings 檔標 mention。）
7. **前置作品**：zh.wikipedia 寫「剧情改編自同名小說」（read，沒有寫作者）。不必先看（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/291553.do?cs=2 (下架時間 2030-04-18). Netflix: https://www.netflix.com/tw/title/82071131 (indexed as 「觀賞《蠻好的人生》 \| Netflix」; lead). Also listed on 中華電信 MOD 466398. — 證據：Hami page loaded on 2026-11-12. https://www.youtube.com/shorts/P8w6-zU6J98 「《蠻好的人生》｜孫儷打招呼」, Netflix Taiwan (no date). NOWnews 2026-02-28 (https://www.nownews.com/news/6790654): 「Netflix《蠻好的人生》懶人包」. Tudum TW 2025-07-13 #6. — **confirmed (service page + official channel)**（tw-availability-1）
- **類型核對**：zh.wikipedia「連續劇」，導言「以都市生活為背景」；MDL Drama；ratings 檔「urban (insurance sales)」。**符合（家庭與人生：中年職場重啟）**。

## 8. 180天重啟計劃

1. **片名**：**180天重啟計劃**（Hami／LINE TV；Hami 英文 *Me and my Family*）（tw-availability-2）／180天重启计划／*Me and My Family*（MDL、IMDb AKA）
2. **劇情**：28 歲失戀又失業的顧雲蘇（周雨彤）回家投靠母親吳儷梅（吳越），卻發現 48 歲再婚的母親意外高齡懷孕，只好當起陪產照護，與母親、繼父和沒有血緣的弟弟同住 180 天，母女重新理解彼此。MDL 簡介：「Twenty-eight-year-old Gu Yun Su, facing heartbreak and unemployment, returns home to her mother, Wu Li Mei, who is unexpectedly pregnant at 48…Over 180 days, mother and daughter develop a deeper understanding」（read）。
3. **季數與狀態**：27 集，2025-02-17 到 02-27（MDL，read），湖南衛視、芒果TV（MDL Original Network，read），每集 45 分鐘。李漠執導（IMDb／DramaWiki，cache）。**已完結**。**沒有 zh.wikipedia 條目**。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt29613358/parentalguide/ ）：**五類都沒有投票**；Frightening 有一則未投票投稿：「There are intense fight scenes between husband & wife, mom & daughter, a death scene of grandmother too.」
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：家庭爭吵激烈、外婆過世段落（IMDb 投稿）。
5. **觀眾評分**：MDL **7.8**（127 人，https://mydramalist.com/755761-180-tian-pei-chan-ji-hua ，read）；IMDb **6.4**（24，tt29613358，jina read）；豆瓣：**讀不到新聞引用值**（搜尋結果裡豆瓣影評頁顯示「180天重启计划 (2025) 7.9」，2025-02-26，是豆瓣本體摘要，snippet，不採用）。
6. **推薦 tag**（merged：BEF，3 類）：
   - B：NFZM 2025 提名
   - E：WB25 年度突破創新作品
   - F：PTT jpeg 2025 推薦（「李漠導演都市劇的神」）；PTT 2025 最喜歡串 1；PTT 2025 推薦串 1
7. **前置作品**：**改編網路小說**（楚棠《180天陪產計劃》，豆瓣閱讀連載；MDL，read）。不必先看（判斷）。
8. **台灣串流**：Hami Video (some eps free): https://hamivideo.hinet.net/product/290629.do?cs=2 (下架時間 2030-02-16). LINE TV: https://www.linetv.tw/drama/17223/eps/1. myVideo 3/29862 exists (inconclusive). — 證據：Both pages loaded on 2026-11-12; Hami 「全27集(部分免費)」; LINE TV 「已完結」, no lapse notice. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：MDL Comedy／Drama／Family；IMDb Comedy／Drama／Family；DramaWiki「Metropolitan, Family」（cache）。**符合（家庭與人生）**；split-proposal 原列為歸類不確定，核對後確定是家庭劇。

## 9. 向風而行

1. **片名**：**向風而行**（LINE TV／friDay；Hami 英文 *Flight to You*）（tw-availability-1）／向风而行／*Flight to You*（zh.wikipedia、MDL、IMDb）
2. **劇情**：以虛構的鷺洲航空（取景參考廈門航空）為背景，立志當機長的女飛行員程曉（譚松韻）跟著嚴格的機長顧南亭（王凱）受訓，在男性為主的行業裡證明自己，兩人日久生情。zh.wikipedia：「中国大陆民航题材电视剧……讲述「鹭洲航空」（取景參考廈門航空）的故事」（read）；MDL 簡介：「Aspiring pilot Cheng Xiao has to learn to get along with her extremely strict instructor Gu Nan Ting while also navigating a male-dominated field」（read）。
3. **季數與狀態**：TV 版 39 集／原版 40 集，每集 45 分鐘；2022-12-26 到 2023-01-14 央視八套黃金檔首播，愛奇藝、騰訊視頻網播到 2023-02-01；台灣 friDay影音、LiTV、MyVideo 同步（zh.wikipedia infobox 與導言，read）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；Singapore PG13（self-applied）、Vietnam (Banned)（read；越南列沒有說明原因）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt19725610/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **8.2**（4,257 人，https://mydramalist.com/64587-flight-to-you ，read）；IMDb **7.8**（196，tt19725610，cache）；豆瓣 **開分 6.9**（2.1 萬人；新浪 2023-01-06 轉錄微博「豆瓣开分，2.1万网友参与打分……综合评分6.9」，read）。
6. **推薦 tag**（merged：DFG，3 類）：
   - D：云合 YH23 全網 top10（愛奇藝轉述的榜，無名次）
   - F：PTT 2023 最喜歡串 7 推（有人註明 2022 年底開播）
   - G：myVideo 2023 戲劇年榜 #2；愛奇藝台灣站 2023 #9
7. **前置作品**：**改編小說**（沐清雨《雲過天空你過心》；zh.wikipedia、MDL，read）。不必先看（判斷）。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/14795/eps/1. friDay影音 (免費 + 影劇): https://video.friday.tw/drama/detail/2760. Hami https://hamivideo.hinet.net/product/210781.do?cs=2 returns the bare shell (**lapsed**). myVideo 3/22573 (inconclusive). — 證據：LINE TV and friDay pages loaded on 2026-11-12 (LINE TV 「已完結」, no lapse). — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「民航、职场、都市」；MDL Romance／Life／Drama。**符合（都市愛情，職人劇）**。

## 10. 狙擊蝴蝶

1. **片名**：**狙擊蝴蝶**（Hami）（tw-availability-1）／狙击蝴蝶／*Sniper Butterfly*（MDL、IMDb）
2. **劇情**：岑矜（陳妍希）人生低谷時接到曾資助的鄉村少年李霧（周柯宇）求助，把他接到城市念書；六年後已是職場精英的李霧因工作與她重逢，兩人走向姊弟戀。MDL 簡介：「When Cen Jin falls into a low point in her life, she receives a call for help from Li Wu, a rural boy she once supported…Six years later, Li Wu, now a successful professional, returns to the city and reunites with Cen Jin due to work.」（read）
3. **季數與狀態**：30 集，2025-12-04 到 12-15，騰訊視頻，每集 45 分鐘（MDL，read）。**已完結**。**沒有 zh.wikipedia 條目**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt33265684/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：資助人與受資助者的年齡差戀愛設定（MDL 簡介，題材判斷）；搜狐文提到「壁咚、強吻戲」（read）。
5. **觀眾評分**：MDL **8.0**（5,343 人，https://mydramalist.com/756325-ju-ji-hu-die ，read）；IMDb **7.7**（287，tt33265684，cache）；豆瓣 **開分 6.8**（搜狐 2025-12-22「陈妍希《狙击蝴蝶》豆瓣开分6.8」，read）。新浪財經頭條摘要（2026-02-07）稱「从开画低迷的4.2分一路飙升至7.2分」（snippet；頁面只回 1.3 KB 讀不到，**與搜狐開分 6.8 矛盾，不採用**）。
6. **推薦 tag**（merged：BFG，3 類）：
   - B：BJN 2025 年度劇集榜
   - F：PTT 2025 最喜歡串 7 推；PTT kamenatsumi 正評；PTT jpeg 看完名單
   - G：Netflix TW 2025-12-21 #10（2 週）
7. **前置作品**：**改編網路小說**（七寶酥《狙擊蝴蝶》；MDL，read）。不必先看（判斷）。
8. **台灣串流**：Hami Video (some eps free): https://hamivideo.hinet.net/product/318872.do?cs=2 (下架時間 2031-03-01). Netflix 82055551 (hk / mo pages only; lead). — 證據：The Hami page loaded on 2026-11-12 with 「全30集(部分免費)」. 風傳媒 2026-07-01 lists it as a Netflix 甜寵陸劇 (#8). — **confirmed (service page)**（tw-availability-1）
- **類型核對**：MDL Romance／Drama；IMDb Drama／Romance；搜狐稱「都市劇」（read）。**符合（都市愛情）**。

## 11. 早春晴朗（沿用 factsheets-cn2 §15）

1. **片名**：**早春晴朗**（About Netflix zh_tw）（tw-availability-1）／早春晴朗／*The Early Spring*（zh.wikipedia、MDL、IMDb、Netflix）
2. **劇情**：普通二本畢業、北漂的尚之桃（孫千）進入廣告公司凌美，在毒舌的創意總監欒念（井柏然）手下從職場新人成長為策劃總監，兩人開始一段長達六年的地下戀情；她因誤會與現實不告而別回鄉創業，多年後兩人重逢。zh.wikipedia 劇情簡介：「普通二本毕业的北漂之女尚之桃……意外入职北京广告公司巨头凌美……开启了一段长达六年的隐秘地下恋情」（read，cn2）。
3. **季數與狀態**：24 集，2026-08-26 到 09-09，優酷（生花劇場）全網獨播，Netflix 全球同步，每集約 45 分鐘（zh.wikipedia，read；MDL 48 min）。**已完結**。
   - 續作：MDL 新聞標題「Chinese drama The Early Spring to get a follow-up」（只看到搜尋結果標題，snippet）。沒有讀內文，**不確定是續季、番外還是衍生**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄（Netflix 頁不算）。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；Argentina 13、Singapore PG13（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt37884717/parentalguide/ ）：Sex & Nudity **Mild**（3 of 5；投稿「Some implied sex and visual imagery of sex scenes」）；Violence **None**（1 of 1）；Profanity **None**（1 of 1）；Alcohol **Mild**（2 of 2）；Frightening **None**（1 of 1）。
   - MDL Content Rating：13+（read）。
   - 需要提醒：親密戲較多（IMDb 投稿；TVBS 女人我最大標題「車內激吻」，zh.wikipedia 引用，read 引用標題）。
5. **觀眾評分**：MDL **8.5**（18,399 人，https://mydramalist.com/761231-zao-chun-qing-lang ，read）；IMDb **8.2**（2.2K，cache；單集平均 9.3）；豆瓣 **6.7**（開分，4 萬多人；新浪 2026-09-11，snippet）。另一篇新浪「豆瓣開分即達8.5分」（2026-09-02，snippet）**與多篇開分 6.7 報導矛盾，看起來是內容農場，不採用**。
6. **推薦 tag**（merged：CDEG，4 類）：
   - C：IMDb 8.2（2.2K）
   - D：Netflix NF26 全球非英語影集週榜 #2（8/24–30，240 萬次觀看）、#2（8/31–9/6，320 萬次）——同家族算一次
   - E：WB26 年度影響力作品
   - G：DailyView 2026-10 月榜 #7（聲量，關鍵字井柏然）
   - 台灣：About Netflix 2026-09-02 稱台灣影集週榜冠軍（tw-availability-1 證據欄，非 candidates tag）
7. **前置作品**：**改編網路小說**（姑娘別哭《早春晴朗》）（read）。不必先讀。
8. **台灣串流**：Netflix (global exclusive): https://www.netflix.com/tw/title/83067197 (ID linked in the Netflix newsroom article) — 證據：About Netflix (zh_tw), 2026-09-02 (https://about.netflix.com/zh_tw/news/the-early-spring-blooms-at-no-2-on-global-non-english-tv-list): 「Netflix 全球獨家華語都市職場愛情影集」, launched 8/26, 「勇奪台灣…影集週榜冠軍」. Also 自由娛樂 2026-09-11 (https://ent.ltn.com.tw/news/breakingnews/5571184). — **confirmed (official Netflix newsroom, 2026-09-02)**（tw-availability-1）
- **類型核對**：zh.wikipedia「剧情、都市、职场、爱情」，導言「都市职场情感剧」；MDL Romance／Life／Drama；Netflix 新聞稿「都市職場愛情影集」。**符合（都市愛情）**。

## 12. 以家人之名

1. **片名**：**以家人之名**（LINE TV）（tw-availability-2）／以家人之名／*Go Ahead*（zh.wikipedia、MDL、IMDb）
2. **劇情**：三個來自破碎家庭的孩子李尖尖（譚松韻）、凌霄（宋威龍）、賀子秋（張新成）與兩個爸爸組成沒有血緣的一家人，高中後兩個哥哥回到原生家庭，九年後三人重聚，面對各自的過去。MDL 簡介：「Three troubled youths, each from a dysfunctional household, find comfort in each other and form a chosen family…Nine years later, the three reunite」（read）。
3. **季數與狀態**：40 集（zh.wikipedia：DVD／網路版 40 集；MDL：TV 版 46、網路版 40），每集約 40 分鐘（zh.wikipedia）／45 分鐘（MDL）；2020-08-10 到 09-06 湖南衛視首播，芒果TV 同步（zh.wikipedia，read）。**已完結**。zh.wikipedia related 欄：韓國版《重組家庭》（read，沒有另查）。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；United States TV-14（Apple TV rating）、India 13、Indonesia 13+、Philippines 13+（皆 self-applied）、Singapore PG（self-applied）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt12477960/parentalguide/ ）：五類都是 **Mild**——Sex & Nudity（2 of 4；接吻、壁咚）、Violence（1 of 3）、Profanity（1 of 3）、Alcohol（2 of 3）、Frightening（1 of 3；「A young child is pushed around and hit by an adult at one point」）。
   - MDL Content Rating：G - All Ages（read）。
   - 需要提醒：家暴與原生家庭創傷情節（IMDb 投稿：兒童被大人推打）。
5. **觀眾評分**：MDL **8.8**（39,513 人，https://mydramalist.com/40911-go-ahead ，read）；IMDb **8.5**（2.5K，tt12477960，cache）；豆瓣 **開分 8.6**（新浪 2020-08-13 摘要「一开播就拿下了8.6分的好成绩」，snippet；沒有讀原文）。
6. **推薦 tag**（merged：ACF，3 類）：
   - A：SDA 2021 Best Series Drama 亞軍
   - C：MDL #15 8.8（39,503）；IMDb 8.5（2.5K）
   - F：PTT 2020 最愛三部陸劇串 約 28 推
   - （不計：FT-nom 2022。）
7. **前置作品**：原創劇本（zh.wikipedia 只列編劇水阡墨、王雄成，沒有原作欄，read）。不必先看任何作品（判斷）。
8. **台灣串流**：LINE TV: https://www.linetv.tw/drama/20204/eps/1 (2025-11 re-upload). friDay https://video.friday.tw/drama/detail/1516 returns 「資料錯誤」 (**lapsed**). Hami https://hamivideo.hinet.net/product/128738.do?cs=2 returns the bare 「HamiVideo」 shell (**lapsed**). myVideo 3/13273 (inconclusive). — 證據：The LINE TV page loaded on 2026-11-12 with 「已完結」 and no lapse notice. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia「家庭、喜剧、青春、親情、愛情」；MDL Comedy／Romance／Drama／Melodrama。**符合（家庭與人生）**。

## 13. 繁花

1. **片名**：**繁花**（myVideo；台灣大哥大新聞稿）（tw-availability-1）／繁花／*Blossoms Shanghai*（zh.wikipedia、MDL、IMDb）
2. **劇情**：1990 年代改革開放初期的上海，阿寶（胡歌）在黃河路乘勢發跡成為商界新星，一家新開的飯店卻讓他的事業與人際關係陷入動盪。zh.wikipedia 故事簡介：「背景設定在1990年代的上海，講述改革開放初期發家於上海黄河路的商人阿寶的故事」（read）。
3. **季數與狀態**：30 集，每集 46 分鐘（zh.wikipedia，read；MDL 45 min）；2023-12-27 到 2024-01-09（zh.wikipedia 播出表、MDL，read），CCTV-8、東方衛視、騰訊視頻。王家衛執導，滬語與普通話雙版本（zh.wikipedia 語言欄，read）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄（myVideo 頁對非台灣 IP 無法讀）。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 Netherlands 7+（streaming）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt3881914/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒。台灣版是「雙語版」（台灣大哥大新聞稿標題，tw-availability-1），文章可提醒滬語原音。
5. **觀眾評分**：MDL **7.7**（228 人，https://mydramalist.com/52077-fan-hua ，read）；IMDb **7.8**（1.4K，tt3881914，cache）；豆瓣 **8.7**（42 萬人；新京報 2024-02-26「豆瓣评分涨至8.7……42万人的支持」，read；同文「该剧开分成绩为8.1」，read）。
6. **推薦 tag**（merged：ABCDFG，6 類，● 有官方榜）：
   - A：**MAG 2024 最佳中國電視劇（win）**；ACA 2024 Best Creative（win）＋ Best Lead Actor 胡歌（win）
   - B：XZK 2024 年度文化貢獻；NFZM 2023 提名
   - C：豆瓣 DB24 #4；IMDb 7.8（1.4K）
   - D：云合 YH24 #4 22.9 億；灯塔 LT24 都市劇 #2 18.19 億——各算一次
   - F：PTT 2024 最喜歡串 1
   - G：LINE TODAY 2024 陸劇 #3（劇照標 MyVideo）
   - 官方榜（不計）：FT 2024 優秀電視劇（win）；GE 2024 優秀電視劇
7. **前置作品**：**改編小說**（金宇澄《繁花》，茅盾文學獎作品；zh.wikipedia，read）。不必先讀（判斷）。
8. **台灣串流**：myVideo (Taiwan exclusive): https://www.myvideo.net.tw/details/3/27675 (inconclusive to our IP). No Hami, friDay, LINE TV, Disney+ or Netflix TW page was found. — 證據：Taiwan Mobile press release, 2024-06-13 (https://corp.taiwanmobile.com/press-release/news/press_20240613_248970.html): MyVideo「取得王家衛首部電視劇《繁花》台灣版權 6月14日獨家播出雙語版」. Also TVBS 2024-06-07 (https://news.tvbs.com.tw/entertainment/drama/2510616). — **confirmed (press release, 2024-06)**. The only platform is myVideo, which we cannot check, so lapse risk is unverified.（tw-availability-1）
- **類型核對**：zh.wikipedia「劇情、年代、商戰、情感」；MDL Historical／Business／Romance／Drama。**符合（年代劇）**。

## 14. 北上

1. **片名**：**北上**（Hami 頁）（tw-availability-1）／北上／*Northward*（zh.wikipedia、MDL、IMDb）
2. **劇情**：京杭大運河邊「花街」長大的一群 90 後（白鹿、歐豪等）各奔前程後多年重聚，在生活壓力中重新出發，同時串起運河百年的興衰。MDL 簡介：「The story revolves around several boys and girls who grew up along the canal. After parting ways…they reunite years later」（read）；網易 2025-03-18 文：「以京杭大运河为脉络……聚焦三代女性」（read）。
3. **季數與狀態**：38 集，每集 45 分鐘；2025-03-03 起 CCTV-1 播出，愛奇藝全網獨播（zh.wikipedia，read）；MDL 寫到 03-25（read）。姚曉峰執導。**已完結**（網易文提到播出中曾「斷更一陣」，read）。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 South Korea 15（2025）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27936497/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：13+（read）。
   - 需要提醒：IMDb 簡介提到高中時一場意外奪走女主弟弟與祖母（cache）；其餘沒有來源。
5. **觀眾評分**：MDL **8.5**（1,798 人，https://mydramalist.com/740015-bei-shang ，read）；IMDb **7.9**（263，tt27936497，cache）；豆瓣 **開分 7.3**（網易 2025-03-18「如今播出过半，豆瓣开分7.3分」，read）。
6. **推薦 tag**（merged：ADEFG，5 類，● 有官方榜）：
   - A：ACA 2025 Best Director（姚曉峰）
   - D：CVB25 CCTV1 3.615%（CVB 有統計以來電視劇收視第三）；云合 YH25 top20（無名次）
   - E：WB25 年度影視化文學 IP
   - F：PTT 2025 最喜歡串 1
   - G：PTT 轉貼 愛奇藝台灣 2025 上半年 #10（推文 3，「北上相當不錯」）——注意這是 iq.com 的榜
   - 官方榜（不計）：GE 2026 nom；FT-nom 2026（不計）
   - （不計：ACA People's Choice〔白鹿〕，人氣獎。）
7. **前置作品**：**改編小說**（徐則臣《北上》，茅盾文學獎；zh.wikipedia、MDL，read）。劇版改以現代 90 後為主線，與原著清末運河故事差很多（新京報 2023 訪談摘要，snippet）。不必先讀（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/323030.do?cs=2 (下架時間 2029-02-03) — 證據：The page loaded on 2026-11-12 with the title. Also an iQIYI exclusive on iq.com (PTT S24, 「獨」; not counted). — **confirmed (service page)**（tw-availability-1）
- **類型核對**：MDL Youth／Drama／Family；百度百科摘要「剧情现代剧」（snippet）。**符合（家庭與人生／年代之間；建議放年代組，以運河時代變遷為主軸）**。

## 15. 去有風的地方

1. **片名**：**去有風的地方**（Hami／friDay／LINE TV 頁）（tw-availability-1）／去有风的地方／*Meet Yourself*（zh.wikipedia、MDL、IMDb）
2. **劇情**：北京五星級酒店大堂經理許紅豆（劉亦菲）因摯友病逝辭職到雲南大理「有風小院」長住，結識返鄉創業的謝之遙（李現），用酒店管理經驗幫村子發展文旅，兩人日久生情。zh.wikipedia 劇情：「北京五星級酒店大廳經理許紅豆，因摯友南南得癌症離世……选择放下工作來到曾與摯友約好要去的雲南长住」（read）。
3. **季數與狀態**：40 集；2023-01-03 到 02-02，湖南衛視、芒果TV（zh.wikipedia infobox，read）；MDL 寫到 01-22、每集 45 分鐘（read）。ratings 檔另記 CCTV-8／騰訊視頻（†待確認）。丁梓光執導（與《以家人之名》同導演，豆瓣摘要，snippet）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 Singapore PG（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt21233692/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：G - All Ages（read）。
   - 需要提醒：開頭是摯友癌逝（zh.wikipedia 劇情，read）。
5. **觀眾評分**：MDL **8.8**（13,395 人，https://mydramalist.com/715585-you-feng-de-di-fang ，read）；IMDb **8.2**（1.2K，tt21233692，cache）；豆瓣 **開分 8.1 → 8.4**（新浪 2023-02-01 轉錄微博「豆瓣评分涨至8.4分，开分是8.1分」，read）。知乎 2023-12 文摘要稱已到 8.7（snippet）。
6. **推薦 tag**（merged：ABCFG，5 類，● 有官方榜）：
   - A：SDA 2023 Best Series Drama（與 *Act Like You're Asleep* 並列）
   - B：NDY2023 #4
   - C：豆瓣 DB23 #3；MDL #19 8.8（13,388）；IMDb 8.2（1.2K）——三個家族
   - F：PTT 2023 最喜歡串 約 65 推（本篇 PTT 推數最多）
   - G：myVideo 2023 戲劇年榜 #1；愛奇藝台灣站 2023 #10
   - 官方榜（不計）：FT 2024 優秀電視劇（win）；GE 2024 優秀電視劇
7. **前置作品**：原創（zh.wikipedia infobox 沒有原作欄，read）。不必先看任何作品（判斷）。
8. **台灣串流**：friDay影音 (免費 + 影劇, 全40集): https://video.friday.tw/drama/detail/4697. Hami Video: https://hamivideo.hinet.net/product/211689.do?cs=2 (下架時間 2027-01-02). LINE TV: https://www.linetv.tw/drama/14304/eps/1. myVideo https://www.myvideo.net.tw/details/3/22647 exists (inconclusive). — 證據：All three counted pages loaded on 2026-11-12. friDay shows 「適用方案 免費 影劇 / 全40集」; LINE TV shows no 「授權到期」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「爱情剧、田园剧」；MDL Romance／Life／Drama。**符合（家庭與人生／慢活田園愛情；放都市愛情也可，但場景是鄉村）**。

## 16. 小巷人家

1. **片名**：**小巷人家**（Hami 頁）（tw-availability-1）／小巷人家／*Romance in the Alley*（zh.wikipedia、MDL、IMDb）
2. **劇情**：1970 年代末蘇州棉紡廠家屬區小巷裡，莊家、林家、吳家三戶人家在恢復高考、改革開放到 90 年代的時代變遷中各自成長。zh.wikipedia：「剧情主要讲述了20世纪70年代末，苏州棉纺厂家属区里小巷住着的庄家、林家、吴家在历经时代变迁后的故事」（read）。
3. **季數與狀態**：40 集（MDL：網路版 40／TV 版 47）；2024-10-28 到 11-22，湖南衛視、芒果TV、咪咕視頻同步（zh.wikipedia，read）；ratings 檔記騰訊視頻；每集 45 分鐘（MDL，read）。正午陽光出品、張開宙執導（zh.wikipedia，read）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt29469265/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒（MDL 簡介提到「愚孝」對家人的傷害，題材判斷）。
5. **觀眾評分**：MDL **8.0**（473 人，https://mydramalist.com/757969-xiao-xiang-ren-jia ，read）；IMDb **7.9**（133，tt29469265，jina read）；豆瓣 **8.3**（DB24 #9；分數出自云合 2024 PDF，ratings 檔，read）。
6. **推薦 tag**（merged：ACDEF，5 類，● 有官方榜）：
   - A：MAG 2025 nom
   - C：豆瓣 DB24 #9（8.3）
   - D：云合 YH24 #15 13.2 億；灯塔 LT24 年代劇播放冠軍——各算一次
   - E：WB25 年度影響力作品＋媒體選擇榮耀
   - F：PTT 2024 最喜歡串 6 推（「意外的好看」）；PTT kamenatsumi（完成度高但不是她的菜）
   - 官方榜（不計）：FT 2026 優秀電視劇（win）；GE 2026 nom；S-TJ2024
   - （已刪：CSM24 #16 0.99，snippet。）
7. **前置作品**：**改編網路小說**（大米《小巷人家》；zh.wikipedia、MDL，read）。不必先讀（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/305910.do?cs=2 (下架時間 2029-07-19) — 證據：The page loaded on 2026-11-12 with the title. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「年代生活情感剧」（導言，read）；MDL Romance／Life／Family／Melodrama；IMDb Drama／Family。**符合（年代劇）**。

## 17. 生萬物

1. **片名**：**生萬物**（Hami 頁）（tw-availability-1）／生万物／*This Thriving Land*（zh.wikipedia、MDL、IMDb；tw-availability 與 candidates 檔寫「English title not in sources」，這輪由 zh.wikipedia 英文名欄補上）
2. **劇情**：魯南天牛廟村首富之女寧繡繡（楊冪）成婚當日被土匪擄走，父親不願賣地贖人、改讓妹妹頂替出嫁；她脫險後與父親決裂，嫁給救她的莊稼漢封大腳（歐豪），在土地上重新生活，並帶領村中女性剿匪、抗日。zh.wikipedia 劇情大綱：「天牛廟村首富的女儿寧繡繡在成婚當日遭土匪擄走……並嫁給了將她從匪巢中救出的莊稼漢封大腳」（read）。IMDb 簡介：時間是 1926–1944 年魯南（cache）。
3. **季數與狀態**：36 集，每集 45 分鐘；2025-08-13 到 08-24（zh.wikipedia，read；MDL 寫到 08-23）；CCTV-8／愛奇藝（ratings 檔，read）。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 South Korea 15（2025）（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt32199362/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：13+（read）。
   - 需要提醒：土匪擄人、戰爭與抗日情節（zh.wikipedia 劇情，read）；具體尺度沒有來源。
5. **觀眾評分**：MDL **8.2**（767 人，https://mydramalist.com/761585-wan-wu-sheng ，read）；IMDb **3.3**（608，tt32199362，cache）——**與 MDL、豆瓣落差極大，原因沒有查，不要推測**；豆瓣 **7.2**（22 萬人；灯塔 LT25 新聞引用，ratings 檔，read）。
6. **推薦 tag**（merged：ABDE，4 類，● 有官方榜）：
   - A：MAG 2026 nom
   - B：XZK 2025 年度劇集
   - D：云合 YH25 #4；灯塔 LT25 #2 21.35 億；猫眼（MYP25 電視劇有效播放 #2 21.60 億、集均冠軍＋MYH25 熱度 #6）——猫眼 D/E 算一次；平台熱度 PH25 愛奇藝 2025 熱度值 #1
   - E：WB25 年度影響力作品
   - 官方榜（不計）：FT 2026 優秀電視劇（win）；GE 2026 優秀電視劇
   - （已刪：CVB25 CCTV8 2.388%，mention。F：只在 PTT 2025 推薦串出現 1 次，fans 檔沒有成列。）
7. **前置作品**：**改編小說**（趙德發《繾綣與決絕》；zh.wikipedia，read）。不必先讀（判斷）。
8. **台灣串流**：Hami Video (some episodes free): https://hamivideo.hinet.net/product/334081.do?cs=2 (下架時間 2029-07-19) — 證據：The page loaded on 2026-11-12 with the title (2026-08 upload). The page gives no English title. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：zh.wikipedia「年代、情感、史詩」；MDL Historical／Life／Drama。**符合（年代劇）**；時代背景是民國到抗戰，比本篇其他年代劇早。

## 18. 人世間

1. **片名**：**人世間**（中央社；iq.com）（tw-availability-2）／人世间／*A Lifelong Journey*（zh.wikipedia、MDL、IMDb）
2. **劇情**：東北某省會城市周家三代人，從文革後期到改革開放之後各自拼搏；主線是留城的老三周秉昆（雷佳音）與鄭娟（殷桃）的患難婚姻，以及工人階級經歷國企改制、下崗再就業的陣痛。zh.wikipedia 劇情：「该剧讲述了中国东北某省会城市的周姓人家三代人在文化大革命后期到改革开放之后拼搏奋斗，创造美好生活的故事」（read）。
3. **季數與狀態**：58 集，每集 45 分鐘；2022-01-28 到 03-01 央視一套（zh.wikipedia，read）；MDL 寫到 03-08（read）；愛奇藝網播（ratings 檔）。李路執導。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt17506764/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：文革、入獄、下崗等時代題材（zh.wikipedia 劇情，read）；具體尺度沒有來源。
5. **觀眾評分**：MDL **7.8**（**55 人**，https://mydramalist.com/76641-ren-shi-jian ，read）；IMDb **8.3**（158，tt17506764，cache）；豆瓣 **8.1**（21 萬人；ratings 檔 DB22 #4，本身標「per qq snippet」，**snippet**）。
6. **推薦 tag**（merged：ABD，3 類，● 有官方榜）：
   - A：**MAG 2023 最佳中國電視劇（win，與《縣委大院》並列）**
   - B：NFZM 2022 年度劇集
   - D：愛奇藝站內熱度破萬 IQ10K
   - 官方榜（不計）：FT 2024 優秀電視劇（win）；GE 2022 優秀電視劇
   - （已刪：C 類 DB22 #4——分數只有 qq snippet，merged 也沒算 C。）
7. **前置作品**：**改編小說**（梁曉聲《人世間》，茅盾文學獎；zh.wikipedia，read）。不必先讀（判斷）。
8. **台灣串流**：Disney+ bought it for 大中華區 in 2022, but no current Disney+ zh-tw entity page was found by search. iq.com (info only): https://www.iq.com/wiki/zh_tw/album/%E4%BA%BA%E4%B8%96%E9%96%93-2022-13q7f4zxgi5 — 證據：CNA 2022-01-06 (https://www.cna.com.tw/news/amov/202201060241.aspx): Disney+ (Taiwan launch Nov 2021) lists 華語劇「人世間」 for 大中華區. 上報 2022-03-09 (https://www.upmedia.mg/tw/popularity/upviewpoint/139392): 「登Disney+」. No evidence after 2022. — **licensed-old (Disney+ 2022; current page not found)**（tw-availability-2）
- **類型核對**：zh.wikipedia 分類「时代剧」；MDL Life／Drama／Family。**符合（年代劇）**。

## 19. 我的阿勒泰

1. **片名**：**我的阿勒泰**（Hami）（tw-availability-2）／我的阿勒泰／*To the Wonder*（zh.wikipedia、MDL、IMDb）
2. **劇情**：新疆阿勒泰小鎮長大的漢族女孩李文秀（周依然）到大城市追作家夢受挫，回鄉幫母親（馬伊琍）顧雜貨鋪，結識哈薩克族少年巴太（于適）與遊牧家庭，在草原生活裡重新找到書寫的力量。MDL 簡介：「Li Wen Xiu, a girl from a small town in Altay, dreams of becoming a writer in the big city but faces constant setbacks…she meets a Kazakh boy, Batay」（read）。
3. **季數與狀態**：**8 集**，每集約 39–51 分鐘（zh.wikipedia，read）；MDL 寫 2024-05-07 到 05-10 網路播出，04-07 為影展首映（read）；CCTV-1／愛奇藝（ratings 檔；awards 檔註「+CCTV-1 per zh.wiki」）。滕叢叢編導。普通話、維吾爾語、哈薩克語（zh.wikipedia，read）。**已完結**，迷你劇。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄 Hami 頁分級。
   - IMDb Certifications（使用者可編輯）：沒有 Taiwan 列；只有 Brazil 12（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27931200/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **8.8**（3,225 人，https://mydramalist.com/748325-my-aletai ，read）；IMDb **8.2**（480，tt27931200，cache）；豆瓣 **8.9**（DB24 #2；分數出自云合 2024 PDF，ratings 檔，read）。
6. **推薦 tag**（merged：ABC，3 類，● 有官方榜）：
   - A：**MAG 2025 最佳中國電視劇（win）**；**AACA 2024 中國區 Best Drama Series**（另 Best Actress 馬伊琍、攝影、滕叢叢）；ACA 2024 nom（劇集＋編劇）
   - B：NFZM 2024 年度劇集；XZK 2024 年度劇集（＋劇集導演）
   - C：豆瓣 DB24 #2（8.9）；MDL #22 8.8
   - 官方榜（不計）：FT 2026 優秀電視劇（win）；GE 2026 優秀電視劇；S-TJ2024
   - （不計：影視榜樣 2024 創新劇集〔snippet〕；Asian Television Awards 2024 Best Drama Series〔只在 zh.wikipedia 看到，awards 檔沒讀原始來源〕；Canneseries 2024 入圍〔不是獎〕。awards 檔總結：本篇唯一同時拿國內評審獎、國外評審獎、兩份獨立評論榜第一的劇。）
7. **前置作品**：**改編散文集**（李娟《我的阿勒泰》；zh.wikipedia、MDL，read）。不必先讀（判斷）。
8. **台灣串流**：Hami Video (some eps free): https://hamivideo.hinet.net/product/282840.do?cs=2 (**下架時間 2026-12-01**, under three weeks away) — 證據：The page loaded on 2026-11-12 with 「全8集(部分免費)」. — **confirmed (service page; licence ends 2026-12-01)**（tw-availability-2）。**文章發布時若已過 12-01，要改寫成「已下架」或重查。**
- **類型核對**：zh.wikipedia「家庭、爱情」；MDL Romance／Life／Family。**符合（家庭與人生）**。

## 20. 大生意人

1. **片名**：**大生意人**（Hami／LINE TV／myVideo；Hami 英文 *Legend of the Magnate*）（tw-availability-2）／大生意人／*Legend of the Magnate*（zh.wikipedia、MDL、IMDb；MDL slug 與 IMDb AKA 另作 *The Tycoon*）
2. **劇情**：晚清書生古平原（陳曉）科場遭誣陷、流放寧古塔，越獄後跟著私鹽商隊到山西，從典當、茶葉做到軍糧與鹽業，逆襲成為「商王」。zh.wikipedia 劇情簡介：「書生古平原在科場遭人誣陷，被發配寧古塔，其後越獄逃生，逐步成長為一代「商王」的傳奇故事」（read）。
3. **季數與狀態**：40 集，每集約 45 分鐘；2025-11-25 愛奇藝、CCTV-8 19:30 同步，台灣 MyVideo、LiTV 同日上線；TVB 翡翠台 2026-04-06 起播粵語版 23 集（zh.wikipedia 播出時間表，read）；MDL 寫到 12-11（read）。張挺編導。**已完結**。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31888090/parentalguide/ ）：**五類都沒有投票**；Profanity 有未投票投稿（關於英文字幕用詞，與內容尺度無關）。
   - MDL Content Rating：13+（read）。
   - 需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：MDL **8.3**（965 人，https://mydramalist.com/63963-the-tycoon ，read）；IMDb **7.4**（128，tt31888090，cache）；豆瓣 **7.2**（搜狐 2025-12-22「《大生意人》豆瓣评分7.2」，read；未寫人數，未說是否開分）。
6. **推薦 tag**（merged：AEF，3 類）：
   - A：MAG 2026 nom
   - E：猫眼 MYH25 熱度 #4；WB26 年度品質作品——不同家族
   - F：PTT 2025 推薦串 5 推；PTT 2025 最喜歡串 1
   - （不計：FT-nom 2026；CVB25 CCTV8 2.288%，mention。）
7. **前置作品**：**改編小說**（趙之羽《大生意人》；zh.wikipedia 導言、MDL，read）。不必先讀（判斷）。
8. **台灣串流**：Hami Video: https://hamivideo.hinet.net/product/310725.do?cs=2 (下架時間 2031-11-24). LINE TV: https://www.linetv.tw/drama/20124/eps/1. myVideo 3/32240 (inconclusive; the myVideo blog says it premiered there 2025-11-23). Netflix: https://www.netflix.com/tw/title/82687282 (lead). — 證據：Hami and LINE TV pages loaded on 2026-11-12 (Hami 「全40集(部分免費)」; LINE TV 「已完結」, no lapse). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：zh.wikipedia「古装、商业、爱情」，導言「中国晚清时期古装剧」；MDL Historical；豆瓣類型摘要「剧情 / 古装」（snippet）。**勉強符合**：是晚清古裝商戰，放「時代」組可以，但不是現代家庭劇；也可考慮移到第 2 篇「權謀」或第 1 篇以外的古裝組，需要使用者決定。

## 21. 老舅

1. **片名**：**老舅**（Hami／LINE TV）（tw-availability-2；英文欄「—」）／老舅／*Uncle*（MDL、IMDb）
2. **劇情**：1990 年代東北，從外甥「二胖」的視角，看聰明卻三分鐘熱度的老舅崔國明（郭京飞）從國營廠技術骨干到下崗、一次次創業失敗，最後明白親情與友情才是最寶貴的財富。MDL 簡介：「It is set in the 1990s. It mainly tells the story of the old uncle Cui Guo Ming…Although he repeatedly encountered setbacks, he still lived a positive and optimistic life」（read）。
3. **季數與狀態**：27 集，2025-12-15 到 12-27，每集 45 分鐘；MDL Original Network 列 CCTV、iQiyi（第三個沒讀到）（read）。百度百科摘要稱出品方含央視與騰訊企鵝影視、孔二狗與李奇星執導（snippet）。**已完結**。**沒有 zh.wikipedia 條目**。
4. **分級**：
   - 台灣平台頁：tw-availability-2 沒有記錄。
   - IMDb Certifications：**沒有任何國家的資料**（read）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt34607647/parentalguide/ ）：**五類都沒有投票**。
   - MDL Content Rating：Not Yet Rated（read）。
   - 需要提醒：沒有可引用的內容提醒（百度百科摘要提到「江边命案」支線，snippet）。
5. **觀眾評分**：MDL **7.3**（**31 人**，https://mydramalist.com/778856-lao-jiu ，read）；IMDb **7.4**（**14 票**，tt34607647，cache-搜尋結果）；豆瓣 **7.6**（搜狐 2025-12-22「郭京飞、王佳佳《老舅》豆瓣评分7.6」，read）。
6. **推薦 tag**（merged：ABE，3 類，● 有官方榜）：
   - A：MAG 2026 nom
   - B：BJN 2025 年度劇集榜
   - E：猫眼 MYH25 熱度 #7
   - 官方榜（不計）：GE 2026 nom；FT-nom 2026（不計）
   - （F：PTT 2025 最喜歡串 只有 1 推，fans 檔沒有成列，不算。）
7. **前置作品**：沒有讀到原作資料（MDL 簡介沒有寫改編；豆瓣摘要列編劇韓三平、孔二狗，snippet）。不必先看任何作品（判斷）。
8. **台灣串流**：Hami Video: https://hamivideo.hinet.net/product/324870.do?cs=2 (下架時間 2030-12-14). LINE TV (some eps free, rest VIP): https://www.linetv.tw/drama/20852/eps/1. myVideo 0/429459 (inconclusive). — 證據：Both pages loaded on 2026-11-12 (Hami 「全27集(部分免費)」; LINE TV 「部分免費」 with VIP episode badges, no lapse). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：MDL Comedy／Drama／Family；IMDb Comedy／Drama；百度百科「年代轻喜剧」（snippet）。**符合（年代劇，喜劇）**。

---

## 總結

### 21 部評分一覽

| # | 片名 | MDL（人數） | IMDb（票數） | 豆瓣（來源） |
|---|---|---|---|---|
| 1 | 難哄 | 8.8（47,582） | 8.4（5.1K） | 5.4（搜狐 2025-02，read） |
| 2 | 許我耀眼 | 8.3（14,612） | 7.4（931） | 6.5（LT25） |
| 3 | 偷偷藏不住 | **9.0（97,413）** | 8.6（9.9K） | 開分 6.7（新浪 2023-07，read） |
| 4 | 當我飛奔向你 | 9.0（62,728） | 8.5（4.4K） | 7.9（Cosmopolitan TW 2025-02，read） |
| 5 | 在暴雪時分 | 8.5（24,008） | 7.9（2K） | 開分 6.9（snippet） |
| 6 | 玫瑰的故事 | 8.2（2,215） | 6.8（568） | 開分 7.1（華龍網 2024-06，read） |
| 7 | 蠻好的人生 | 7.7（311） | 7.3（118） | 6.4（LT25） |
| 8 | 180天重啟計劃 | 7.8（127） | 6.4（24） | 讀不到 |
| 9 | 向風而行 | 8.2（4,257） | 7.8（196） | 開分 6.9（新浪 2023-01，read） |
| 10 | 狙擊蝴蝶 | 8.0（5,343） | 7.7（287） | 開分 6.8（搜狐 2025-12，read） |
| 11 | 早春晴朗 | 8.5（18,399） | 8.2（2.2K） | 開分 6.7（snippet，cn2） |
| 12 | 以家人之名 | 8.8（39,513） | 8.5（2.5K） | 開分 8.6（snippet） |
| 13 | 繁花 | 7.7（228） | 7.8（1.4K） | 8.7（新京報 2024-02，read；開分 8.1） |
| 14 | 北上 | 8.5（1,798） | 7.9（263） | 開分 7.3（網易 2025-03，read） |
| 15 | 去有風的地方 | 8.8（13,395） | 8.2（1.2K） | 8.4（新浪 2023-02，read；開分 8.1） |
| 16 | 小巷人家 | 8.0（473） | 7.9（133） | 8.3（YH24 PDF） |
| 17 | 生萬物 | 8.2（767） | **3.3（608）** | 7.2（LT25） |
| 18 | 人世間 | 7.8（55） | 8.3（158） | 8.1（snippet） |
| 19 | 我的阿勒泰 | 8.8（3,225） | 8.2（480） | **8.9**（YH24 PDF） |
| 20 | 大生意人 | 8.3（965） | 7.4（128） | 7.2（搜狐 2025-12，read） |
| 21 | 老舅 | 7.3（31） | 7.4（14） | 7.6（搜狐 2025-12，read） |

### 類型核對與建議分組

- **都市愛情（9）**：難哄、許我耀眼、偷偷藏不住、當我飛奔向你（後兩部偏青春校園）、在暴雪時分（運動）、玫瑰的故事、向風而行（民航職人）、狙擊蝴蝶、早春晴朗（職場）。玫瑰的故事 也可放「家庭與人生」（女性一生）。
- **家庭與人生（5）**：以家人之名、180天重啟計劃、蠻好的人生、去有風的地方、我的阿勒泰。
- **年代劇（7）**：繁花、人世間、小巷人家、生萬物、老舅、北上（也可放家庭與人生）、**大生意人**（晚清古裝商戰，勉強歸入，或請使用者決定是否移出）。
- 不符合本篇主題的：沒有。最需要說明的是 大生意人（古裝）與 北上（現代＋運河年代）。

### 缺資料的地方

- 180天重啟計劃、狙擊蝴蝶、老舅 沒有 zh.wikipedia 條目，播出平台與日期只靠 MDL；老舅 的第三個播出平台、原作沒讀到。
- 玫瑰的故事 zh.wikipedia 只讀到 infobox 前段，首播平台用 ratings 檔＋MDL。
- 豆瓣：180天重啟計劃 讀不到任何新聞引用值；在暴雪時分、以家人之名、人世間、早春晴朗 只有 snippet；難哄 5.4 來自搜狐評論文（沒寫是開分或現值）。
- 生萬物 IMDb 3.3 的原因沒有查。
- 台灣平台頁分級：本篇 21 部 tw-availability 都沒有記錄；IMDb 也沒有任何一部有 Taiwan 列。
- Parents Guide 有投票的只有 6 部（其中 許我耀眼、早春晴朗、以家人之名 票數 ≤5）。
- 續季：都沒有讀到續季消息；難哄 zh.wikipedia 列「續作《折月亮》（2026）」，沒有查是不是同主角。
- 我的阿勒泰 Hami 授權 2026-12-01 到期；繁花 只在 myVideo（無法驗證）；在暴雪時分、人世間 是 licensed-old。
