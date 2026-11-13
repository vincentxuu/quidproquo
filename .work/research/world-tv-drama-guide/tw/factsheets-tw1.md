# 台劇 1 事實表：懸疑、犯罪與驚悚（16 部）

- 查核日：2026-11-13。順序照 `post-tw1-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示頁面快取（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。**這一輪從網路拿到的資料全部是 snippet**（見下方 toolDegradation）：內建 `WebSearch` 回的是「搜尋結果標題＋網址＋模型整理的摘要」，連原始搜尋摘要都不是，可信度比陸劇版的 snippet 更低。
- 標 **（候選檔，read）** 的數字與名次，是照抄 `candidates-*.md` 裡原本標 read 的資料（那三份檔在 2026-11-13 用 Groundlane／Exa／jina 讀過），不是這一輪重新讀的。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。
  - **金鐘獎算 A 類**（awards 檔開頭說明：評審團是業界人士，不是政府選），所以台劇**沒有「官方榜」欄**。
  - **B 類裡的 LINE TODAY 聚光賞（`LINE2024`／`LINE2025`）不計**（merged 檔規則）；聚光賞只在 fans 檔當 G 類算。所以 B 類只剩 `KM2025`（台灣劇評人年度榜）、`TNL2023`（關鍵評論網徐佑德）、`ECON2023`、`VAR-Intl2021`、`500輯2022`，本篇 16 部只有 KM2025 與 TNL2023 用得到。
  - 金鐘個人獎（演技、編劇等）awards 檔沒有收成 tag，只在備註提到，這裡也只附註。
- **「只算一次」的規則**：ratings 檔 §5 的資料家族——IMDb、MDL、豆瓣（DB*）、Netflix（NFG＋NF23H1／NF25／NF26H1）、Google（GYS*）、DailyView／KEYPO（DV*）——同一家族在同一部劇只算一個，並列在同一個括號裡。fans 檔裡 S2、S3、S17 的「原 PO 看過清單」強度弱，照 fans 檔備註寫明。
- **欄位 4 分級要分三層看**：
  1. **台灣有電視節目分級**（普／護／輔12／輔15／限）。`tw-availability-1/2` **16 部都沒有記錄平台頁分級**；這一輪用 WebSearch 查《八尺門的辯護人》《零日攻擊》《模仿犯》的分級，三次都沒有結果。沒有台灣 IP，Netflix 台灣頁本來就不算證據。**本篇 16 部都沒有台灣分級資料。**
  2. IMDb Certifications 與 IMDb Parents Guide：imdb.com 讀不到（WebFetch DNS 失敗），WebSearch 也拿不到 Parents Guide 內容。**16 部全部寫「讀不到」**。只有《忘了我記得》在搜尋摘要裡出現「TV-14」（snippet）。
  3. MDL Content Rating：使用者／編輯填的，只算旁證；這一輪只在搜尋摘要裡看到 6 部的值（snippet）。
- **欄位 5 豆瓣**：沒有碰豆瓣頁面與 sec.douban.com。只用候選檔裡已有的（DB22／DB23／DB25 年度榜位置；只有 DB25 有分數）。搜尋摘要裡看到的其他豆瓣分數（例如 MDL 使用者清單寫火神的眼淚 8.9）不採用。

## 這份資料的限制

1. **這一輪幾乎沒有可讀的網頁**。MCP 網路工具全斷，`WebFetch` 對所有外部網域都 DNS 失敗，只剩 `WebSearch`。所以：集數、首播日、劇情、MDL 人數、IMDb 條目 ID，凡是沒有標「候選檔」的，**全部是 snippet**，寫文章前要用 zh.wikipedia／MDL／IMDb 原頁重讀。
2. **可以直接用的數字只有候選檔那批**：IMDb 分數與票數（ratings 檔用 IMDb advanced search ≥500 票清單讀到，13 部有）、MDL 名次與分數（ratings 檔 MDL Top Taiwanese 前 60，7 部有；人數只有前 20 名有，即如果我不曾見過太陽 Pt1 3,176／Pt2 2,378）、豆瓣年度榜位置。其餘 MDL 人數全是 snippet，而且同一頁不同快取的人數常常不一樣（例如誰是被害者 S1 出現 2,477／2,682／2,722 三個值）。
3. **IMDb 票數少於 500 的 3 部**（台灣犯罪故事、忘了我記得、死了一個娛樂女記者之後）不在 ratings 檔清單裡，分數只有 snippet。**八尺門的辯護人的 MDL「7.7／47 人」只出現在一則摘要裡**，跟它的金鐘與豆瓣聲量對不起來，很可能是舊快取，暫不採用。
4. **分級完全沒有官方來源**（見上）。Parents Guide 16 部全讀不到。內容提醒只能依題材（判斷）或搜尋摘要寫。
5. **類型核對有 3 部不符、1 部需確認**：
   - **忘了我記得**：照顧失智父親的家庭劇（ratings 檔 genre「family drama (dementia)」，候選檔 read；搜尋摘要也說「療癒的家庭劇」，snippet）。**不符本篇**，建議移到 17（社會）或 18（家庭）。
   - **此時此刻**：委託說是「災難」，但候選檔與 tw-availability 都指向**疫情背景的愛情單元劇**（ratings 檔 genre「romance anthology」；Netflix 新聞稿網址 slug `at-the-moment-rides-the-wave-of-love-taiwanese-anthology-series-cast`，tw-availability-2 有記錄）。**不是災難劇，不符本篇**，建議移到 18（愛情）。
   - **火神的眼淚**：消防職人劇（ratings 檔「firefighter drama」；搜尋摘要「消防職人劇」）。**不符本篇**，建議移到 17（職人）。
   - **乩身**：民俗宗教奇幻動作（ratings 檔「folk-religion fantasy action」），有犯罪／除魔元素但重心是奇幻動作。放本篇勉強可以，要寫明。
6. **年份不一致**：awards 檔與 merged 檔把乩身寫成 2024；tw-availability-1 與 ratings 檔寫 2026-04-02 上線（Netflix 台灣官方 YouTube 預告 2026-03-03，tw-availability-1）。以 2026 為準，merged 的 2024 應是錯的（推論：awards 檔說首播年都是「金鐘年減一」估的）。
7. **台灣串流沒有台灣 IP 驗證**（沿用 tw-availability 的規則）；Netflix 的劇多半只有官方 YouTube／新聞稿／台灣媒體證據，沒有平台頁。
8. **候選 tag 偏誤**：fans 檔 F 類主要來自兩串 PTT「懸疑推理推薦」（S2、S3），主題本身就偏推理劇，會把誰是被害者、模仿犯、台灣犯罪故事 的 F 訊號拉高；G 類的 Netflix 台灣週榜只抽 21 週，可能漏掉 誰是被害者 S2、正港分局 的上榜週。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播日、平台、片長、原著、劇情 | 搜尋結果裡的 en.wikipedia、MDL、Netflix 新聞稿、台灣媒體（鏡週刊、TVBS、天下、中央社等）摘要 | `WebSearch`（standard） | **snippet**（16/16）。zh.wikipedia、en.wikipedia、MDL 原頁都讀不到 |
| MDL 分數、人數、Content Rating | `WebSearch` 加 `allowed_domains: mydramalist.com` 的摘要；候選檔 ratings 檔的 MDL Top 清單 | `WebSearch`；候選檔 | 候選檔 read（7 部名次＋分數）；其餘 snippet |
| IMDb 分數與票數 | 候選檔 ratings 檔（IMDb advanced search ≥500 票）；另 3 部用 `WebSearch`（`allowed_domains: imdb.com`） | 候選檔；`WebSearch` | 候選檔 read（13 部）；3 部 snippet |
| IMDb Parents Guide、Certifications | — | `WebFetch` 失敗 | **讀不到**（16/16） |
| 台灣分級 | tw-availability 檔（沒有記錄）；`WebSearch` 試 3 部 | — | 沒有結果 |
| 豆瓣 | 候選檔 ratings 檔（DB22／DB23／DB25，cn 回合讀過） | — | 候選檔 read |
| 推薦 tag | 三份 candidates 檔＋merged 檔 | 本機讀檔 | 照抄候選檔的讀取狀態 |
| 台灣串流 | tw-availability-1／2 | 本機讀檔 | 照抄 |

toolDegradation：
- **MCP 全斷**：Groundlane、Exa、Tavily、jina、firecrawl、linkup 在這個 session 回 502（連線失敗），完全不能用。
- **Groundlane 直接 HTTP**：`WebFetch` 到 `groundlane.vincent-xu-work.workers.dev` → `getaddrinfo ENOTFOUND`（這個網域不在 session 的網路白名單）。
- **內建 `WebFetch`**：zh.wikipedia.org、mydramalist.com、www.imdb.com 都是 `ENOTFOUND`（不在白名單）。照工具提示，同類失敗後就沒有再試其他網站。
- **Keenable／You.com keyless**：沒試（兩者都要對外 HTTP，與 WebFetch／curl 同樣被擋；委託也說終端機 curl 被擋）。
- **改用內建 `WebSearch`**（standard 模式）：可用，共約 30 次查詢。回傳的是標題＋網址＋模型整理的摘要，所以一律標 snippet。
- 要讀原頁，需要在環境的 Allowed domains 加入：`zh.wikipedia.org`、`en.wikipedia.org`、`mydramalist.com`、`www.imdb.com`、`groundlane.vincent-xu-work.workers.dev`。

---

## 1. 模仿犯

1. **片名**：**模仿犯**／*Copycat Killer*（About Netflix）（tw-availability-1）
2. **劇情**：1990 年代末的台北，檢察官郭曉其（吳慷仁；原著沒有的新角色）和刑警林尚勇（庹宗華）組成專案小組，追查一連串模仿式的連續殺人案。（台灣媒體與 Netflix 英文新聞稿摘要，snippet）
3. **季數與狀態**：1 季 10 集，2023-03-31 Netflix 全球上線，一次上架；每集約 45–50 分鐘（en.wikipedia／英文媒體摘要，snippet）。**已完結**，沒有看到續季消息。
4. **分級**：
   - 台灣平台頁：tw-availability-1 沒有記錄；WebSearch 查不到。
   - IMDb Certifications／Parents Guide：讀不到。
   - MDL Content Rating：沒有看到。
   - 需要提醒：連續殺人題材；MDL 一則使用者評論批評「graphic violence」（snippet）。具體尺度沒有來源。
5. **觀眾評分**：
   - MDL：**8.1**，Top Taiwanese #21（候選檔，read）；人數 3,153（snippet），https://mydramalist.com/722595-copycat-killer
   - IMDb：**7.0**（3K）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ABCDEFG，7 類）：
   - A：GB 2023 戲劇節目獎 nom（另：搜尋摘要說它拿了第 58 屆金鐘 4 個獎，含「最具人氣戲劇節目」，snippet，awards 檔沒收個人獎）
   - B：TNL2023（徐佑德年度五大最佳台劇，只確認標題點名「打下高標準」，內文沒讀到，partial）
   - C：IMDb 7.0（3K）；MDL #21 8.1
   - D：Netflix 家族（NFG 全球非英語週榜 #2，2023-04-09 週 1,774 萬小時，台劇第一次進全球榜；#5 次週；NF23H1 4,560 萬小時，台劇第一）——算一次
   - E：Google 2023 快速竄升台灣戲劇 #1＋戲劇影集 #1；DailyView 2023 #2
   - F：PTT 2023 懸疑串 原 PO 清單（「最近版上熱烈討論」）；PTT 2025 懸疑串、Dcard 2025 原 PO 清單（弱）
   - G：LINE TODAY 2023 網友最愛台劇 #1（12.77%）；Netflix 台灣週榜 2023-04-23 #3、05-07 #9
7. **前置作品**：**改編**宮部美幸同名小說（日文原作 2001 年；snippet）。不必先讀原著（判斷）；檢察官主角是原創角色，跟原著走向不同（snippet）。
8. **台灣串流**：Netflix (Netflix original, 瀚草). No TW title ID was found. — 證據：beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦7：《模仿犯》」. About Netflix zh_tw, 2022-03-03 (https://about.netflix.com/zh_tw/news/netflix-assembles-all-star-cast-to-do-justice-to-copycat-killer-adaptation). The 2023 trailers are on Netflix Malaysia/Asia (https://www.youtube.com/watch?v=Sk-XhCaz5M0), so they are not counted. — **confirmed (Taiwan media, 2026-02-14)**（tw-availability-1）
- **類型核對**：ratings 檔 genre「crime thriller」（候選檔）。**符合本篇**。

## 2. 誰是被害者（第 1–2 季）

1. **片名**：**誰是被害者 (+ 2)**／*The Victims' Game*（YT keyword）（tw-availability-1）
2. **劇情**：患有亞斯伯格症的鑑識官方毅任（張孝全）在命案現場發現與女兒有關的線索，與調查記者徐海茵（許瑋甯）一起追查一連串看似自殺的命案。（en.wikipedia／英文影評摘要，snippet）
3. **季數與狀態**（全部 snippet）：
   | 季 | 上線 | 集數 | 平台 |
   |---|---|---|---|
   | 第 1 季 | 2020-04-30 | 8 | Netflix |
   | 第 2 季 | 2024-06-21 | 8 | Netflix 全球獨家 |
   - 兩季都**已完結**。S2 原訂 2022 年推出，延到 2024（What's on Netflix 摘要）。SeriesReminder 寫 S2「16 集」，摘要本身判為錯誤，不採用。
   - 每集片長：沒有讀到。
   - 第 3 季：沒有看到任何消息。
   - S1 原著：en.wikipedia 摘要寫改編自 2015 年小說 *The Fourth Victim*（作者名摘要寫 Liang Shuting、Xu Ruilang，snippet，要重查中文書名）；另一則中文摘要說沒看到原著資訊。**原著與否待查**。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL Content Rating 沒有看到。需要提醒：命案、自殺題材，SCMP 標題用「grisly」形容（snippet）。
5. **觀眾評分**：
   - MDL：S1 **8.1**（#27，候選檔 read；人數 2,477–2,722，snippet，https://mydramalist.com/53745-the-victims-game ）；S2 **8.0**（#37，候選檔 read；人數 660–819，snippet，https://mydramalist.com/693453-the-victims-game-season-2 ）
   - IMDb：**7.3**（2.4K）（候選檔，read；條目沒分季）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ACDEFG，6 類）：
   - A：AACA 台灣區 Best Drama Series 2020＋2024（S2）；GOTT 2020 Best Actor（張孝全，得獎）；GB 2020 戲劇節目獎 nom；GB 2025 迷你劇集獎 nom（S2）
   - C：IMDb 7.3（2.4K）；MDL S1 #27 8.1、S2 #37 8.0
   - D：NF23H1 S1 190 萬小時
   - E：DailyView 2024 #6
   - F：PTT 2023 懸疑串 推文 7；PTT 2020 經典台劇票選 #23（34 票）
   - G：LINE TODAY 聚光賞 2024 台劇榜 #6（S2）
   - （不計：遠見 2024 #4，fans 檔標不計。）
7. **前置作品**：S1 原著待查（見欄位 3）。**S2 接續 S1 的人物，建議先看第一季**（判斷；S2 主角與鑑識官設定延續，snippet）。
8. **台灣串流**：Netflix (Netflix original): https://www.netflix.com/tw/title/81318134 (ID from the Netflix Taiwan S2 trailer description; one title page covers both seasons). — 證據：https://www.youtube.com/watch?v=7RfsUh-VjEo 「《誰是被害者》第2季 \| 正式預告 \| Netflix」, Netflix Taiwan, 2024-06-02. Also About Netflix zh_tw, 2024-06-03, and beauty321, 2026-02-14 (S1 and S2 listed as Netflix). — **confirmed (official channel 2024-06; Taiwan media 2026-02)**（tw-availability-1）
- **類型核對**：ratings 檔「crime thriller」。**符合本篇**。

## 3. 華燈初上（三部）

1. **片名**：**華燈初上**／*Light the Night*（TSV）（tw-availability-1）
2. **劇情**：1988 年台北林森北路條通的日式酒店「光」，一具紅鞋女屍讓兩位媽媽桑（林心如、楊謹華）、陪酒小姐、客人與幫派都成了嫌疑人，劇情一邊辦案一邊回溯兩人的友情與恩怨。（鏡週刊、HK01、bella 等摘要，snippet）
3. **季數與狀態**（snippet）：Netflix 原創，三部共 24 集（每部 8 集）。
   | 部 | 上線 |
   |---|---|
   | 第一部 | 2021-11-26 |
   | 第二部 | 2021-12-30（Tatler 預告報導寫「預計本月底 12/30」，沒找到官方首播日） |
   | 第三部 | 2022-03-18 |
   - **已完結**；兇手在第三部揭曉（MDL 使用者評論摘要）。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL 沒有看到。需要提醒：命案、酒店與幫派題材（判斷）。
5. **觀眾評分**：
   - MDL：第一部 **8.0**（#34）、第二部 **8.0**（#32）、第三部 **7.9**（#48）（候選檔 read）；人數 929／678／575（snippet）。網址：https://mydramalist.com/75551-light-the-night 、https://mydramalist.com/715993-light-the-night-season-2 、https://mydramalist.com/720655-light-the-night-season-3
   - IMDb：**7.4**（1.8K）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ACDEFG，6 類）：
   - A：AACA 2022 台灣區 Best Drama Series；AACA 2022 Grand Best Supporting Actor（吳慷仁）；GB 2022 戲劇節目獎 nom
   - C：IMDb 7.4（1.8K）；MDL 三部 7.9–8.0
   - D：NF23H1（三部 150／100／100 萬小時）
   - E：Google 2022 快速竄升台灣戲劇 #1
   - F：PTT 2022「成功台劇」串 推文 4（NICKSHOW「挺多負評」但承認成功）；PTT 2023 懸疑串 原 PO「追到天亮」
   - G：LINE TODAY 2021 最推薦台劇 #1（16.84%）；Netflix 台灣週榜 2021-12-26 #3
7. **前置作品**：原創劇本，不需要先看任何作品（搜尋摘要沒有原著，snippet；判斷）。**三部是同一個故事，要從第一部依序看**，第二部結尾是懸念（snippet）。
8. **台灣串流**：Netflix (Netflix original, three parts). No TW title ID was found. — 證據：beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦6：《華燈初上》」. 造咖, 2025-10-15 (https://cava.tw/entertainment/moviestv/261142). The 2021 trailers are on Netflix Malaysia/Asia, so they are not counted. — **confirmed (Taiwan media, 2026-02-14)**（tw-availability-1）
- **類型核對**：ratings 檔「period mystery」。**符合本篇（年代懸疑）**。

## 4. 回魂計

1. **片名**：**回魂計**／*The Resurrected*（TSV）（tw-availability-1）。tw-availability-1 註記：「台泰合製」只出自 DailyView 摘要，Netflix 新聞稿沒有列泰國製作方，**合製說未證實**。
2. **劇情**：詐騙集團首腦張世凱被判死刑伏法，兩位女兒受害的母親（舒淇、李心潔）前往偏遠村落尋找讓死者還魂的儀式，想讓他回來再受一次懲罰。（Netflix 中文新聞稿、MDL 分集摘要，snippet）
3. **季數與狀態**：9 集，2025-10-09 Netflix 全球上線；2025-09 在釜山影展首映。導演陳正道、許肇任（en.wikipedia／Netflix 新聞稿摘要，snippet）。**已完結**，沒有看到續季消息。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到。MDL Content Rating：**18+ Restricted (Violence & Profanity)**（snippet）。需要提醒：詐騙、綁架、暴力與宗教儀式題材（snippet）。
5. **觀眾評分**：
   - MDL：**7.7**（445–538 人，snippet），https://mydramalist.com/768391-the-resurrected 。不在候選檔 MDL Top 60。
   - IMDb：**7.0**（976）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ABCDEFG，7 類）：
   - A：GB 2026 迷你劇集獎 nom
   - B：KM2025 #7
   - C：IMDb 7.0（976）
   - D：Netflix 家族（NF25 華語劇 #5，240 萬次；NF26H1 台劇 #7，40 萬次）——算一次
   - E：Google 2025 快速竄升台灣戲劇 #8；DailyView 2025 #5
   - F：PTT 2025 前三好看台劇串 推文 2；另有 PTT〈[心得] 回魂計〉75 推（2026-11，列表頁，fans 檔不計）
   - G：LINE TODAY 聚光賞 2025 台劇榜 #2；Netflix 台灣週榜 2025-10-26 #1
   - （不計：LINE2025 在 B 類的同一個名次。）
7. **前置作品**：原創劇本（snippet 沒有提到原著）。不需要先看任何作品（判斷）。
8. **台灣串流**：Netflix (Netflix original). No title ID was found. — 證據：About Netflix (zh_tw, 全球台灣), 2025-09-02: https://about.netflix.com/zh_tw/news/chinese-language-revenge-thriller-the-resurrected-unveils-main-trailer 「2025年10月9日於Netflix全球獨家播出」. Taiwan media: beauty321, 2026-02-14 (https://www.beauty321.com/post/71268), lists it among 「Netflix燒腦懸疑台劇」. — **confirmed (official newsroom 2025-09; Taiwan media 2026-02)**（tw-availability-1）
- **類型核對**：ratings 檔「supernatural revenge thriller」。**符合本篇（超自然復仇驚悚）**。

## 5. 如果我不曾見過太陽（第一部／第二部）

1. **片名**：**如果我不曾見過太陽**／*Had I Not Seen the Sun*（About Netflix URL slug, YT keyword）（tw-availability-1）
2. **劇情**：被媒體稱為連續殺人犯的李壬曜（曾敬驊）接受紀錄片訪問，訪問者江齊（周品瑜）開始在夢裡和他糾纏；訪談回溯他的高中時代、家暴背景，以及他和陽光少女（李沐）的感情。（techbang、NOWnews 摘要，snippet）
3. **季數與狀態**：Netflix 原創，分兩部上線——**第一部 2025-11-13、第二部 2025-12-11**（tw-availability-1，候選檔 read）。總集數 **20 集**（Focus Taiwan 2026-10-09，awards 檔 read）；各部集數沒有讀到（摘要只提到第一部第 10 集的情節，snippet）。《想見你》團隊製作，導演蔣繼正、簡奇峯（snippet）。**已完結**，沒有看到續作消息。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL 沒有看到。需要提醒：連續殺人、家暴、性侵情節（第一部尾聲女主角遭侵害，snippet）；結局有角色走入海中（snippet）——**自殺暗示要提醒**（判斷）。
5. **觀眾評分**：
   - MDL：第一部 **8.5**（3,176 人，Top Taiwanese #4）、第二部 **8.5**（2,378 人，#5）（候選檔，read）；**網址這一輪沒有取得**。
   - IMDb：**7.7**（768）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ABCDFG，6 類）：
   - A：**SDA 2026 首爾國際電視節 Best Series**；GOTT 2026 Best Lead Actor（曾敬驊，得獎）＋江齊 nom
   - B：KM2025 #3
   - C：MDL 第一部 #4 8.5、第二部 #5 8.5；IMDb 7.7（768）
   - D：Netflix 家族（NF25 華語劇 #4，290 萬次；NF26H1 台劇 #3／#4）——算一次
   - F：PTT 2025 前三好看台劇串 推文 2
   - G：LINE TODAY 聚光賞 2025 台劇榜 #9（一部曲）；Netflix 台灣週榜 2025-11-30 #4
   - （已刪：DailyView 2026-06 月榜 #10，snippet＋月榜不計；金鐘 2026 個人獎 6 項提名，awards 檔沒收成 tag，只附註。）
7. **前置作品**：原創劇本，不是改編（snippet）。**兩部是同一個故事，要先看第一部**（判斷）。
8. **台灣串流**：Netflix (original): https://www.netflix.com/tw/title/81766275 (ID from the Netflix Taiwan trailer description). Part 1 launched 2025-11-13 and part 2 on 2025-12-11. — 證據：https://www.youtube.com/watch?v=67aW34TI9V0 「《如果我不曾見過太陽》 \| 正式前導預告 \| Netflix」, Netflix Taiwan (per Exa; no date exposed). About Netflix zh_tw, 2025-10-21 (https://about.netflix.com/zh_tw/news/had-i-not-seen-the-sun-drops-main-trailer-and-key-art). 今周刊/LINE TODAY, 2025-12-19: Netflix Taiwan top 10. — **confirmed (official channel, 2025-10)**（tw-availability-1）
- **類型核對**：ratings 檔「crime mystery」；內容也有很重的愛情線（snippet）。**符合本篇**。

## 6. 忘了我記得

1. **片名**：**忘了我記得**／*Forget You Not*（YT keywords）（tw-availability-1）
2. **劇情**：想當脫口秀演員的程樂樂（謝盈萱）白天在便利商店打工，一邊處理婚姻問題，一邊照顧逐漸失智的父親程光齊（秦漢），把辛酸寫成笑話。劉若英導演。（Netflix 新聞稿、bella 摘要，snippet）
3. **季數與狀態**：8 集，2025-05-23 Netflix 全球獨家上線（Netflix 台灣官方預告，tw-availability-1）。每集約 1 小時（IMDb 摘要，snippet）。**已完結**，沒有續季消息。
4. **分級**：台灣平台頁沒有記錄。IMDb Certifications：摘要出現 **TV-14**（snippet）；Parents Guide 讀不到。MDL 沒有看到。需要提醒：失智、照護題材，尺度輕（判斷）。
5. **觀眾評分**：
   - MDL：**7.8**（#52，候選檔 read）；人數 235–260（snippet），https://mydramalist.com/766733-forget-you-not
   - IMDb：**7.5**（308）或 7.3（124），兩個快取不一致（snippet，tt31909033）；不到 500 票，不在候選檔清單（DailyView 引 IMDb 8.1，候選檔備註）。
   - 豆瓣：**8.3**（豆瓣 2025 評分最高華語劇集 #4，DB25，候選檔 read）
6. **推薦 tag**（merged：ABCEFG，6 類）：
   - A：GB 2026 迷你劇集獎 nom
   - B：KM2025 #4
   - C：豆瓣 DB25 #4 8.3；MDL #52 7.8
   - E：Google 2025 快速竄升台灣戲劇 #4；DailyView 2025 #2
   - F：PTT 2025 前三好看台劇串 原 PO 前三＋推文 3（1 則「略嫌單薄」）；PTT 2025 中空串 原 PO 批評劇本「平台流水線」——褒貶互見
   - G：LINE TODAY 聚光賞 2025 台劇榜 #4
7. **前置作品**：原創，沒有看到原著（snippet）。不需要先看任何作品。
8. **台灣串流**：Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81730394 (ID from the Netflix Taiwan trailer description). — 證據：https://www.youtube.com/watch?v=s-iH3SucfjA 「《忘了我記得》\| 正式前導預告 \| Netflix」, Netflix Taiwan, 2025-04-07: 「2025年5月23日於Netflix全球獨家播出」. Also beauty321, 2025-09-14. — **confirmed (official channel, 2025-04)**（tw-availability-1）
- **類型核對**：ratings 檔「family drama (dementia)」（候選檔）；搜尋摘要也說「比較像療癒的家庭劇」、資料不支持「懸疑」（snippet）。**不符本篇**，建議移到 17 或 18。

## 7. 乩身

1. **片名**：**乩身**／*Agent from Above*（TSV）（tw-availability-1）。fans 檔寫「台灣官方中文劇名待查（暫用原著名）」；tw-availability-1 的 Netflix 台灣官方預告標題就是《乩身》，已確認。
2. **劇情**：街頭混混韓杰（柯震東）成為三太子（王柏傑）的乩身，在人間降妖除魔、贖罪自救，對手是魔王吳天機（薛仕凌）。（TVBS 等摘要，snippet）
3. **季數與狀態**：**8 集**，2026-04-02 Netflix 一次上架（TVBS 等多家摘要；NOWnews 寫 6 集，摘要判為不一致，snippet）。上線日有 Netflix 台灣官方預告與青年日報佐證（tw-availability-1）。**已完結**，第二季沒有可靠消息（snippet）。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到。MDL Content Rating：Not Yet Rated（snippet）。需要提醒：民俗宗教、妖魔與打鬥場面（判斷）。
5. **觀眾評分**：
   - MDL：**7.8**（#55，候選檔 read）；人數 1,205–1,445（snippet），https://mydramalist.com/746387-agent-from-above
   - IMDb：**6.3**（849）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ACDG，4 類）：
   - A：GOTT 2026 Best Visual Effects（得獎）；GB 2026 迷你劇集獎 nom
   - C：IMDb 6.3（849）；MDL #55 7.8
   - D：Netflix 家族（NFG 全球非英語週榜 #6，2026-04-05 週 810 萬小時——台劇第二部進全球榜；NF26H1 台劇 #1，490 萬次）——算一次
   - G：Netflix 台灣週榜 2026-04-26 #3
   - （已刪：ETtoday「Netflix 台劇原創新高」，ratings 檔標 snippet、不計。）
7. **前置作品**：**改編星子同名小說**（TVBS 摘要；另一則說「漫畫與小說」，只出現一次，snippet）。不必先讀原著（判斷）。
8. **台灣串流**：Netflix (Netflix original; launched 2026-04-02). No title ID was found. — 證據：https://www.youtube.com/watch?v=aNycdiA6t74 「《乩身》\| 正式前導預告 \| Netflix」, Netflix Taiwan, 2026-03-03. Also 「特別版預告：泥娃娃篇」, Netflix Taiwan, 2026-04-02. 青年日報 2026-03-17: 「Netflix《乩身》即將於4月2日上線」. — **confirmed (official channel, 2026-03)**（tw-availability-1）
- **類型核對**：ratings 檔「folk-religion fantasy action」。重心是奇幻動作，懸疑犯罪成分有限。**放本篇勉強可以**，要寫明是「奇幻動作」。merged 檔年份寫 2024，應為 2026（見限制 6）。

## 8. 正港分局

1. **片名**：**正港分局**／*GG Precinct*（YT keyword）（tw-availability-2）
2. **劇情**：電影《關於我和鬼變成家人的那件事》（Marry My Dead Body）的衍生劇。菜鳥分局長林子晴（王淨）和怪咖吳明翰（許光漢）追查一連串用成語當謎題的連續殺人案。程偉豪、殷振豪編導。（en.wikipedia／MDL 摘要，snippet）
3. **季數與狀態**：1 季 6 集，2024-08-22 Netflix 上線（snippet；Netflix 台灣官方預告 2024-08-04，tw-availability-2）。**已完結**，沒有續季消息。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL 沒有看到。需要提醒：連續殺人題材，但以喜劇呈現（判斷）。
5. **觀眾評分**：
   - MDL：**7.3**（681–772 人，snippet），https://mydramalist.com/764639-gg-precinct 。不在候選檔 MDL Top 60。
   - IMDb：**5.9**（519）（候選檔，read）——本篇第二低
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ACEFG，5 類）：
   - A：AACA 2025 台灣區 Best Comedy Programme＋Best Comedy Performance（許光漢）；GOTT 2024 nom（作品、許光漢）
   - C：IMDb 5.9（519）
   - E：DailyView 2024 #5；Google 2024 快速竄升戲劇 #9（全國別）
   - F：PTT 2025 懸疑串 推文 1（弱）
   - G：LINE TODAY 聚光賞 2024 台劇榜 #8
   - （不計：遠見 2024 #5。awards 檔註記「正港分局」中文名來自搜尋摘要 †；tw-availability-2 的 Netflix 台灣官方預告已確認中文名。）
7. **前置作品**：**電影《關於我和鬼變成家人的那件事》（2023）衍生**（en.wikipedia 摘要，snippet）。吳明翰角色沿用電影設定，**看過電影比較有感，但不是必要**（判斷）。
8. **台灣串流**：Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81740096 (ID from the Netflix Taiwan trailer description). — 證據：https://www.youtube.com/watch?v=YN8w0CGRMws 「《正港分局》 \| 正式預告 \| Netflix」, Netflix Taiwan, 2024-08-04. About Netflix zh_tw, 2024-08-05. — **confirmed (official channel, 2024-08)**. Netflix exclusive, so lapse risk is low.（tw-availability-2）
- **類型核對**：ratings 檔「crime comedy」。**警察犯罪喜劇**：有連續殺人案主線，放本篇可以，但要寫明調性是喜劇。

## 9. 台灣犯罪故事

1. **片名**：**台灣犯罪故事**／*Taiwan Crime Stories*（tw-availability-1）
2. **劇情**：四個各 3 集的單元——〈出軌〉〈生死困局〉〈惡有引力〉〈黑潮之下〉，靈感來自台灣真實案件（火車出軌案、滅門案、冤獄案等），探討犯罪動機。（鏡週刊摘要，snippet）
3. **季數與狀態**：12 集，Disney+ 2023-01-04 起每週三上一個單元 3 集，最後一集 2023-01-25（鏡週刊、TVmaze 摘要，snippet）。Disney+ 平台頁讀到「2023, 1 season, 12 episodes」（tw-availability-1，read）。台灣犢影、香港陸匠、美國 Imagine Entertainment 合製（snippet）。IMDb 條目標「2023–」（snippet），**沒有看到第二季消息**。
4. **分級**：台灣平台頁：tw-availability-1 讀到 Disney+ 頁但**沒有記錄分級**。IMDb 讀不到。MDL Content Rating：Not Yet Rated（snippet）。需要提醒：取材真實命案、滅門案（snippet）。
5. **觀眾評分**：
   - MDL：**7.4**（71–85 人，snippet），https://mydramalist.com/722417-taiwan-fan-zui-gu-shi
   - IMDb：**6.3–6.4**（171–260 票，快取不一，snippet，tt14113482）；不到 500 票，不在候選檔清單。單集分數高於整體（6.9–9.2，票數 20–30，snippet）。
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：AEFG，4 類）：
   - A：GB 2023 戲劇節目獎 nom；GOTT 2023 nom（薛仕凌得獎）
   - E：Google 2023 快速竄升台灣戲劇 #9
   - F：PTT 2023 懸疑串 原 PO 清單＋推文 1；PTT 2025 懸疑串、Dcard 2025 原 PO（弱）
   - G：LINE TODAY 2023 網友最愛台劇 #11
7. **前置作品**：原創單元劇，各單元獨立，可以挑單元看（判斷）。
8. **台灣串流**：Disney+ (original): https://www.disneyplus.com/zh-tw/browse/entity-0e22e97a-9295-490a-b798-0c612c4815cf — 證據：The page loaded on 2026-11-13 as 「觀看台灣犯罪故事 \| Disney+」 (2023, 1 season, 12 episodes). Disney Plus TW trailer https://www.youtube.com/watch?v=o_lTvsOjOdk (2022-12-04). — **confirmed (service page)**（tw-availability-1）
- **類型核對**：ratings 檔「crime anthology」。**符合本篇**。

## 10. 八尺門的辯護人

1. **片名**：**八尺門的辯護人**／*Port of Lies*（TaiwanPlus / Mirror）（tw-availability-1）
2. **劇情**：基隆八尺門的阿美族公設辯護人佟寶駒（李銘順），接下印尼漁工被控殺害船長一家的案子，發現案情背後的政治與商業糾葛，觸及原住民、移工、漁業與死刑議題。（鏡週刊、MDL、報導者摘要，snippet）
3. **季數與狀態**：8 集，2023-07-02 起公視首播（TheTVDB 摘要），中華電信 MOD、Hami Video 同步；完結篇約 2023-07-22／23（鏡週刊摘要）——**兩個日期都是 snippet，要以公視頁為準**（MDL 摘要寫 7 月到 8 月，不一致）。**已完結**。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；WebSearch 查不到分級。IMDb 讀不到。需要提醒：兇殺、死刑議題（snippet）。
5. **觀眾評分**：
   - MDL：摘要寫 **7.7／47 人**（snippet，https://mydramalist.com/723521-ba-chi-men-de-bian-hu-ren ）——人數少到可疑，**不採用**，要重讀。
   - IMDb：**8.1**（551）（候選檔，read）——本篇 IMDb 最高
   - 豆瓣：豆瓣 2023 評分最高華語劇集 **#6**（DB23，候選檔 read；沒有分數）
6. **推薦 tag**（merged：ACEFG，5 類）：
   - A：**GB 2024 迷你劇集獎（得獎）**；同屆另得編劇、男主角、音效、配樂、創新獎、最具人氣等個人獎（awards 檔備註，不另計）
   - C：IMDb 8.1（551）；豆瓣 DB23 #6
   - E：Google 2023 快速竄升台灣戲劇 #2；DailyView 2023 #4
   - F：PTT 2025 中空串 sabinetwn「印象還停留在 2023 年的八尺門」；PTT 2025 懸疑串 推文 1（原 PO「劇情沒有很喜歡」）
   - G：LINE TODAY 2023 網友最愛台劇 #4（10.08%）；金鐘 59 人氣票選期中 #1（9.77%）
   - （不計：PTT〈八尺門的辯護人：我的年度台劇〉60 推，只讀到列表頁。）
7. **前置作品**：**改編唐福睿同名小說**（鏡文學百萬影視小說大獎首獎；原著作者自己編導），靈感來自 1986 年湯英伸案（snippet）。不必先讀原著（判斷）。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/9d9bd8cd-83cb-4119-9a70-35ec815fa131. LINE TV: https://www.linetv.tw/drama/16600/eps/1. TaiwanPlus (free, English subs). Netflix per beauty321 (2025-09, lead). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 八尺門的辯護人」. The LINE TV page loaded with the title and no 「授權到期」. Mirror Media, 2024-10-22: TaiwanPlus. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：ratings 檔「legal thriller」。**符合本篇（法庭懸疑）**。

## 11. 零日攻擊

1. **片名**：**零日攻擊**／*Zero Day Attack*（tw-availability-2）
2. **劇情**：假設中國以封鎖與滲透方式準備攻台，十集由不同人物視角切入同一場台海危機：恐攻、紅色滲透媒體、網紅被操控、駭客入侵、軍方高層被滲透等。製作人兼編劇統籌鄭心媚，洪伯豪、吳季恩等多位導演分集執導。（天下、報導者、中央社摘要，snippet）
3. **季數與狀態**：10 集，2025-08-02 起每週六 21:00 公視、LINE TV、MOD、Hami、MyVideo 同步，22:00 公視+；民視 08-24 起播；MDL 寫播到 2025-10-04（snippet）。**已完結**，類單元劇結構。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；WebSearch 查不到分級。IMDb 讀不到。MDL Content Rating：Not Yet Rated（snippet）。需要提醒：戰爭、恐攻場面；**政治爭議大**（立委質疑補助 1.1 億，snippet）。
5. **觀眾評分**：
   - MDL：**7.0**（48 人，snippet），https://mydramalist.com/774351-zero-day ；單集分數只有 1.0–1.2（42 人以下，snippet），疑似洗分，不採用單集分。
   - IMDb：**4.8**（881）（候選檔，read）——**本篇最低**；票數不少，政治題材可能有刷分，沒有查證（推論）。IMDb 條目 tt33083565（snippet）。
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：CEG，3 類）：
   - C：IMDb 4.8（881）
   - E：DailyView 2025 #1（討論量第一，其中「政治」占 39.5%；聲量不等於好評）
   - G：LINE TODAY 聚光賞 2025 台劇榜 #7；MyVideo 2025 年度戲劇榜 #1
   - （不計：LINE2025 在 B 類；AACA 2025 台灣區 Best Promo/Trailer，是預告片獎。）
7. **前置作品**：原創。2024 年先釋出的 17 分鐘前導預告引起國際報導（snippet），不是必看。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/605db3ed-d546-4e30-85b3-869fa25e94ba. Hami Video (some episodes free): https://hamivideo.hinet.net/product/299663.do?cs=2 (下架時間 2031-08-01). LINE TV: https://www.linetv.tw/drama/17706/eps/1. myVideo 1/31273 exists (inconclusive). — 證據：All three pages loaded on 2026-11-13. LINE TV shows 「已完結」 with no lapse notice. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：ratings 檔「war / political thriller」。**符合本篇（政治驚悚）**；評價兩極，要寫明。

## 12. 百萬人推理

1. **片名**：**百萬人推理**／*Million-Follower Detective*（2026 / Netflix）（tw-availability-2）
2. **劇情**：網紅「巴巴女巫」在網路發布死亡預言後，接連發生命案，鄭伊健與婁峻碩聯手調查，也挖出網紅生態的黑暗面。蘇文聖（蘇三毛）編導，《華燈初上》團隊製作。（TVBS、Netflix 新聞稿摘要，snippet）
3. **季數與狀態**：8 集，2026-02-12 Netflix 全球獨家上線（Netflix 新聞稿，tw-availability-2；集數 snippet）。**已完結**，沒有續季消息。每集片長沒有讀到。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL 沒有看到。需要提醒：連續命案（判斷）。
5. **觀眾評分**：
   - MDL：**7.6**（1,028 人，snippet），https://mydramalist.com/742993-million-follower-detective
   - IMDb：**6.0**（628）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：CDG，3 類）：
   - C：IMDb 6.0（628）
   - D：NF26H1 台劇 #2（300 萬次）
   - G：Netflix 台灣週榜 2026-02-15 #1
7. **前置作品**：原創（snippet 沒有提到原著）。
8. **台灣串流**：Netflix (global exclusive): https://www.netflix.com/tw/title/81939587 (indexed as 「百萬人推理」; lead) — 證據：Netflix newsroom, 2026-01-05 (https://about.netflix.com/zh_tw/news/taiwanese-series-million-follower-detective-launches-on-february-12): 「2026年2月12日Netflix全球獨家上線」. Harper's Bazaar TW, 2026-02-12 (https://www.harpersbazaar.com/tw/culture/filmandmusic/a70293390/netflix-million-follower-detective/). — **confirmed (official channel + Taiwan media, 2026)**（tw-availability-2）
- **類型核對**：ratings 檔「mystery」。**符合本篇**。只有 3 類，訊號最弱之一。

## 13. 死了一個娛樂女記者之後

1. **片名**：**死了一個娛樂女記者之後**／*Tabloid*（2025 / —）（tw-availability-2；英文名 *Tabloid* 出自 IMDb／MDL 摘要，snippet）
2. **劇情**：一名娛樂週刊女記者死在毒趴，她的主管（林予晞）為了保住升遷私下調查，牽出娛樂圈性醜聞、性交易與政商勾結。（摘要，snippet）
3. **季數與狀態**：8 集，2025-02-08 到 03-01，每週六 21:00 公視（公視購片播出）（TheTVDB、MDL 摘要，snippet）。導演梁秀紅、吳旻炫。**已完結**。merged 檔與 fans 檔把年份寫成 2023（fans 檔），應為 2025（推論）。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL：沒有分級（snippet）。需要提醒：毒品、性醜聞、性交易題材（snippet）。
5. **觀眾評分**：
   - MDL：**7.8**（16 人，snippet），https://mydramalist.com/753975-tabloid ——樣本太小
   - IMDb：**6.9**（票數沒看到，snippet，tt35321198，條目名 *Si le yi ge yu le nü ji zhe zhi hou*）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：BEF，3 類）：
   - B：KM2025 #8
   - E：Google 2025 快速竄升台灣戲劇 #6
   - F：PTT 2025 懸疑串 原 PO 清單＋推文 1；Dcard 2025 原 PO 清單（都偏弱）
7. **前置作品**：**改編柯映安同名小說**（鏡文學 2019 年出版；作者加入編劇團隊）（snippet）。不必先讀（判斷）。
8. **台灣串流**：Hami Video: https://hamivideo.hinet.net/product/284561.do?cs=2 (下架時間 2028-02-07). Netflix: https://www.netflix.com/tw/title/81994325 (ID from the Netflix Taiwan video description). — 證據：The Hami page loaded on 2026-11-13. https://www.youtube.com/watch?v=RDA5aORQwO4 「《死了一個娛樂女記者之後》｜精彩片段」 is on the Netflix Taiwan channel, 2025-03 (search date 2025-03-11). TVBS, 2025-03-10 (https://news.tvbs.com.tw/entertainment/2783850) names 公視、Netflix、Hami Video、Catchplay+、中華電信MOD、八大電視. — **confirmed (service page + official channel)**（tw-availability-2）
- **類型核對**：ratings 檔「mystery」。**符合本篇**。

## 14. 此時此刻

1. **片名**：**此時此刻**／*At the Moment*（2023 / Netflix / 百聿 / 天予）（tw-availability-2）
2. **劇情**：疫情期間，十段彼此交錯的愛情故事，透過一檔交友實境節目的製作串在一起。（Netflix 英文新聞稿摘要，snippet）
3. **季數與狀態**：1 季 10 集，2023-11-10 Netflix 全球獨家上線；每集約 47–60 分鐘（TheTVDB 摘要，snippet）。**已完結**。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到。MDL Content Rating：**15+**（snippet）。需要提醒：沒有可引用的內容提醒。
5. **觀眾評分**：
   - MDL：**7.5**（999 人，snippet），https://mydramalist.com/747289-at-the-moment
   - IMDb：**6.9**（520）（候選檔，read）
   - 豆瓣：候選檔沒有。
6. **推薦 tag**（merged：ACEG，4 類）：
   - A：GB 2024 戲劇節目獎 nom；AACA 2024 台灣區 Best Supporting Actress（徐熙娣）
   - C：IMDb 6.9（520）
   - E：Google 2023 快速竄升台灣戲劇 #5；DailyView 2023 #6
   - G：LINE TODAY 2023 網友最愛台劇 #6；金鐘 59 人氣票選期中 #10
7. **前置作品**：無；單元劇，可跳著看（判斷）。
8. **台灣串流**：Netflix (Netflix global exclusive): https://www.netflix.com/tw/title/81701115 (ID from search; lead) — 證據：https://www.youtube.com/watch?v=0uHME-cEVKc 「《此時此刻》\| 正式預告 \| Netflix」 is on the Netflix Taiwan channel, 2023-10 (per Exa). Netflix newsroom, 2023-11-14 (https://about.netflix.com/zh_tw/news/at-the-moment-rides-the-wave-of-love-taiwanese-anthology-series-cast): 「現正於Netflix全球獨家熱播中」. — **confirmed (official channel). The evidence is from 2023, but Netflix commissioned it as a global exclusive.**（tw-availability-2）
- **類型核對**：**不是災難劇**。ratings 檔 genre「romance anthology」（候選檔）；Netflix 新聞稿網址寫「rides the wave of love … anthology series」（tw-availability-2）；搜尋摘要也寫「愛情選集影集」「疫情背景」（snippet）。**不符本篇**，建議移到 18（愛情）。

## 15. 火神的眼淚

1. **片名**：**火神的眼淚**／*Tears on Fire*（2021 / 公視）（tw-availability-2）
2. **劇情**：大員市消防局同安分隊的消防員（溫昇豪、陳庭妮、林柏宏、劉冠廷），面對火場、誤報、民眾刁難與家庭壓力。（Marie Claire、TheTVDB 摘要，snippet）
3. **季數與狀態**：10 集，2021-05-01 到 05-29，每週六 21:00 公視首播，myVideo 同步；首播平均收視 1.11（snippet）。**已完結**。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到。MDL Content Rating：**13+**（snippet）。需要提醒：火災、傷亡場面（判斷）。
5. **觀眾評分**：
   - MDL：**7.7**（186–189 人，snippet），https://mydramalist.com/60883-tears-on-fire
   - IMDb：**7.9**（502）（候選檔，read）
   - 豆瓣：候選檔沒有。（MDL 使用者清單寫豆瓣 8.9，不採用。）
6. **推薦 tag**（merged：CEFG，4 類；沒有 A）：
   - C：IMDb 7.9（502）
   - E：Google 2021 快速竄升戲劇 #3（全國別）
   - F：PTT 2022 成功台劇串 推文 3（1 則負評）；PTT 2023 懸疑串 推文 2（推文者自己標「職人劇」）
   - G：LINE TODAY 2021 最推薦台劇 #3（14.49%）
   - （不計：鄭秉泓 2021 台劇回顧點名，awards 檔標不計。）
7. **前置作品**：原創，不需要先看任何作品（判斷）。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/bd0f4e04-7123-4f38-981f-0b461c9284d9. 公視 YouTube playlist PLLhKX7btG59d59RjseCUbtGO6xkB7rC5j 「【火神的眼淚】｜消防職人電視劇」 (contents not readable; lead). — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. A search snippet of the same page mentioned 「限時免費觀看至10/31」, with the year unknown. The show was also on Netflix TW in 2021 (Netflix newsroom, 2022-03-20). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：**消防職人劇**（ratings 檔「firefighter drama」；公視 YouTube 播放清單標題「消防職人電視劇」，tw-availability-2）。**不符本篇**，建議移到 17（職人）。

## 16. 她和她的她

1. **片名**：**她和她的她**／*Shards of Her*（TSV）（tw-availability-2）
2. **劇情**：獵頭顧問林晨曦（許瑋甯）車禍昏迷醒來後，發現自己記憶錯亂，被迫重新面對童年的創傷；故事在現在與過去之間交錯。（en.wikipedia 摘要：「Waking up from a coma, an accomplished headhunter finds herself in an alternate reality where she has to revisit an excruciating childhood trauma」，snippet）創傷的具體內容摘要沒有寫，**這一輪沒有確認**。
3. **季數與狀態**：1 季 9 集，2022-10-28 Netflix 上線（en.wikipedia 摘要，snippet）；製作公司八大電視（Gala Television）（snippet）。候選檔對首播台寫法不一（ratings 檔寫「台視 / Netflix†」、fans 檔寫「台視／待查」、merged 寫「四方四隅 / 華文創 / 八大」）；摘要說沒有看到台視播出。**電視首播台待查**。**已完結**。
4. **分級**：台灣平台頁沒有記錄；IMDb 讀不到；MDL 沒有看到。需要提醒：童年創傷題材（snippet）；是否涉及性侵沒有讀到來源，**不能寫**。
5. **觀眾評分**：
   - MDL：**8.1**（#24，候選檔 read）；人數 770–977（snippet），https://mydramalist.com/726467-ta-he-ta-de-ta
   - IMDb：**6.9**（926）（候選檔，read）
   - 豆瓣：豆瓣 2022 評分最高華語劇集 **#2**（DB22，候選檔 read；沒有分數）
6. **推薦 tag**（merged：ACDEFG，6 類）：
   - A：GB 2023 迷你劇集獎 nom
   - C：豆瓣 DB22 #2；MDL #24 8.1；IMDb 6.9（926）
   - D：NF23H1 150 萬小時
   - E：Google 2022 快速竄升台灣戲劇 #3
   - F：PTT 2025 懸疑串 原 PO 清單＋推文 1；PTT 2023 懸疑串 推文 1（都偏弱）
   - G：LINE TODAY 2022 年度台劇票選 期中 #2（10.98%；只有期中結果）
7. **前置作品**：原創（snippet 沒有原著）。
8. **台灣串流**：Netflix (Netflix global exclusive per 劇夠 2023). No TW title ID was found. — 證據：beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦8：《她和她的她》」. 劇夠 (公視+), 2023-09-14 (https://dramago.ptsplus.tv/articles/8255/): 「Netflix全球獨家華語懸疑劇」. Site-restricted searches of Hami, LINE TV, friDay, CATCHPLAY+, 公視+ and Disney+ found no page. — **confirmed (Taiwan media, 2026-02-14)**（tw-availability-2）
- **類型核對**：ratings 檔「psychological drama」；劇夠稱「華語懸疑劇」（tw-availability-2）。**女性心理懸疑，符合本篇**。

---

## 總結

| # | 劇 | MDL | IMDb | 類型核對 |
|---|---|---|---|---|
| 1 | 模仿犯 | 8.1（#21，候選檔；3,153 人 snippet） | 7.0（3K） | 符合 |
| 2 | 誰是被害者 | S1 8.1／S2 8.0（候選檔；人數 snippet） | 7.3（2.4K） | 符合 |
| 3 | 華燈初上 | 8.0／8.0／7.9（候選檔；人數 snippet） | 7.4（1.8K） | 符合 |
| 4 | 回魂計 | 7.7（約 500 人，snippet） | 7.0（976） | 符合 |
| 5 | 如果我不曾見過太陽 | 8.5（3,176）／8.5（2,378）（候選檔） | 7.7（768） | 符合 |
| 6 | 忘了我記得 | 7.8（#52，候選檔；約 250 人 snippet） | 7.3–7.5（124–308，snippet） | **不符（家庭劇）** |
| 7 | 乩身 | 7.8（#55，候選檔；約 1,400 人 snippet） | 6.3（849） | 勉強（奇幻動作） |
| 8 | 正港分局 | 7.3（約 770 人，snippet） | 5.9（519） | 可以（犯罪喜劇） |
| 9 | 台灣犯罪故事 | 7.4（85 人，snippet） | 6.3–6.4（171–260，snippet） | 符合 |
| 10 | 八尺門的辯護人 | 讀不到（摘要 7.7／47 人，不採用） | 8.1（551） | 符合 |
| 11 | 零日攻擊 | 7.0（48 人，snippet） | 4.8（881） | 符合（政治驚悚） |
| 12 | 百萬人推理 | 7.6（1,028 人，snippet） | 6.0（628） | 符合 |
| 13 | 死了一個娛樂女記者之後 | 7.8（16 人，snippet） | 6.9（票數不明，snippet） | 符合 |
| 14 | 此時此刻 | 7.5（999 人，snippet） | 6.9（520） | **不符（愛情單元劇，不是災難）** |
| 15 | 火神的眼淚 | 7.7（約 189 人，snippet） | 7.9（502） | **不符（消防職人）** |
| 16 | 她和她的她 | 8.1（#24，候選檔；約 977 人 snippet） | 6.9（926） | 符合（女性心理懸疑） |

IMDb 沒有標 snippet 的，都來自候選檔（read）。符合本篇的是 12 部（含乩身、正港分局兩部要註明調性），不符的 3 部是忘了我記得、此時此刻、火神的眼淚。
