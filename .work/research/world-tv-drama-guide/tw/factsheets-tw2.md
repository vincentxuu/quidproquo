# 台劇 2 事實表：社會、職人與時代（15 部）

- 查核日：2026-11-13。順序照 `post-tw2-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示頁面快取（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。**這一輪沒有任何一個外部頁面是 read**（原因見 toolDegradation）：本輪新查的資料全部是 WebSearch 摘要，一律標 snippet。標 read／partial 的只有從既有 candidates 檔、tw-availability 檔抄來的資料（沿用那些檔當時的讀取狀態）。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。這輪 15 部沒有遇到業配標示。
- **金鐘獎算 A 類**（評審是業界獨立評審團，不是官方榜；見 awards 檔開頭說明）。台劇沒有陸劇那種「官方榜」欄。
- **「不計」與「只算一次」的規則**：
  - **awards 檔 B 類的 LINE TODAY 聚光賞（LINE2024／LINE2025）不計入 B**；LINE TODAY 只在 fans 檔算 G（merge.py 同規則）。所以 聽海湧、人生清理員、華麗計程車行 沒有 B。
  - ratings 檔 §5：同一資料家族只算一個——IMDb、MDL、豆瓣（DB*）、Netflix（NFG＋NF*）、Nielsen（TDI）、Google（GYS*）、DailyView／KEYPO（DV*）。同一家族的 tag 並列在同一個括號裡。
  - fans 檔：PTT 推文數是「提到該劇的帳號數」；負評、「看不下去」不算推薦，另外附註。遠見（S21）、S14、S22、S23 不計。
- **欄位 4 分級要分三層看**：
  1. **台灣有電視節目分級**（普／護／輔12／輔15／限）。這輪要求「照 tw-availability 檔抄平台頁或維基上的台灣分級」：**兩份 tw-availability 檔對本篇 15 部都沒有記錄分級**；zh.wikipedia 這輪連不上，也沒有讀到。WebSearch 兩次搜尋（與惡、聽海湧＋分級字樣）都沒有回傳分級。**15 部的台灣分級全部是「讀不到」**。
  2. IMDb Certifications、IMDb Parents Guide：**這輪 www.imdb.com 對 WebFetch 解析失敗（網域不在 session 允許清單），一頁都沒讀到**。搜尋摘要只回了 與惡 一個單集頁（"Until Dawn"）的 Parents Guide 有 United States TV-14 一列，不是全劇條目，也沒有嚴重度與票數，只當線索。**15 部的 Parents Guide 五類嚴重度與票數全部「讀不到」**。
  3. MDL Content Rating（使用者／編輯填寫，只算旁證）：搜尋摘要只出現兩筆——與惡 S1 13+、暴走女外科 13+（snippet）。
  - 「需要提醒的內容」只寫來源（搜尋摘要）說到的題材，不寫尺度判斷。
- **欄位 5 豆瓣**：沒有碰豆瓣頁面。分數只用 candidates 檔已記的；本篇只有 與惡 II 有分數（DB25 #3，8.4）。新聞引用值這輪沒有讀到原文，不採用。

## 這份資料的限制

1. **整份的外部事實都是 snippet**。MCP 網路工具全部斷線，WebFetch 連 zh.wikipedia、mydramalist.com、www.imdb.com 都回 `getaddrinfo ENOTFOUND`（被 session 網路白名單擋），所以集數、首播日、片長、MDL 分數與人數、IMDb 分數與票數，**全都來自 WebSearch 的摘要**。摘要本身常寫「各頁快照數字不同」，也有明顯過時的快照（星空下的黑潮島嶼 MDL 0 人、牛車來去 MDL 0 人，搜尋 metadata 自稱是幾年前的快取）。**寫進文章前，每個數字都要重新讀原頁**。
2. **IMDb 有兩種來源**：與惡、人選之人、化外之醫、一把青 的 IMDb 分數來自 ratings 檔（2026-11-13 用 Exa 讀 IMDb 進階搜尋清單，read）；其餘 11 部是這輪的 IMDb 搜尋摘要（snippet）。兩者讀取時間與方式不同。
3. **MDL／IMDb 樣本都很小**。MDL 人數過百的只有 與惡 S1（535）、人選之人（約 200）、監所男子（約 219）、暴走女外科（約 190）、一把青（102）；其他都在 50 人以下，聽海湧 7 人、華麗計程車行 4 人、黑潮島嶼／牛車來去 快照為 0 人。IMDb 過千票只有 與惡（3.3K）、人選之人（1.7K）；監所男子 14 票、華麗計程車行 約 19 票、黑潮島嶼 22 票。**這些分數幾乎不能拿來互相比較**。ratings 檔也提醒 MDL 台劇榜偏 BL／偶像劇，本篇這類公視寫實劇在 MDL 人數本來就少。
4. **分級完全缺**：台灣分級、IMDb Certifications、Parents Guide 三層都讀不到（見上）。文章裡如果要寫分級，需要另一輪能連上 zh.wikipedia／IMDb／公視+ 頁面的查核。
5. **豆瓣只有一筆**（與惡 II 8.4，DB25，cn 輪 read）。其他 14 部 candidates 檔沒有豆瓣分數，這輪也沒查。
6. **年份與首播平台跟 candidates 檔有出入**，以摘要為線索記下，未定案：牛車來去 merged 寫 2022，MDL／IMDb 摘要與新聞摘要都說 **2023-01-14 首播**（2022-11 定檔）；華麗計程車行 awards 檔寫 2023，摘要說 **2024-02-18 首播**；監所男子囚生記 MDL 摘要寫 iQiyi，新聞摘要說 **愛奇藝國際版與 MyVideo 同步首播**、是「愛奇藝原創」與壹壹影業聯合出品（tw-availability-2 判定仍是 CATCHPLAY+ confirmed，iq.com 不算）。
7. **台灣串流**照抄 tw-availability（沒有台灣 IP 驗證）；**一把青 是 `licensed-old`**（Netflix 2018 舊證據；公視+、LINE TV 已下架）。
8. **類型核對**：15 部都可以放進「社會、職人與時代」，但性質不同——時代劇 6 部（茶金、聽海湧、斯卡羅、星空下的黑潮島嶼、牛車來去、一把青，加上半時代的 天橋上的魔術師），社會議題 2 部（與惡、化外之醫），職人 6 部（人選之人、做工的人、監所男子、人生清理員、華麗計程車行、暴走女外科）。其中 **暴走女外科、監所男子 是喜劇調性**，華麗計程車行 是家庭＋地方職人劇，人生清理員 是沉重的職人劇。見各劇「類型核對」。
9. **候選 tag 偏誤**：awards 檔的 B 類台灣影評榜很薄（KM2025、TNL2023、500輯2022），集中在 2023–2025；AACA 只完整讀了 2024–2025 的台灣各類別，所以 2018–2023 的劇在 A 類被低估。fans 檔 PTT 樣本小、懸疑串偏推理劇；一把青（2015）在 fans 檔標「範圍外」，但 merge.py 仍把 F 計入。G 類 LINE TODAY 2021–2023 是大眾票選、2024–2025 是打光團，性質不同。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 集數、首播日、平台、片長、劇情、原作 | MDL 作品頁（經搜尋摘要）、IMDb 標題頁（經搜尋摘要）、台灣新聞（TVBS、天下、鏡週刊、遠見、Marie Claire、NOWnews、yam、報導者、中央社等，皆經搜尋摘要） | WebSearch | snippet（15/15） |
| zh.wikipedia／en.wikipedia | `zh.wikipedia.org/wiki/我們與惡的距離` | WebFetch | 失敗（ENOTFOUND，網域不在允許清單）；其餘維基頁沒有再試 |
| MDL 分數、人數 | MDL 作品頁 | WebFetch 失敗 → WebSearch（`allowed_domains: mydramalist.com`） | snippet（15/15；與惡 S1 另有 ratings 檔 MDL #11 8.4（535），read） |
| IMDb 評分與票數 | ratings 檔（Exa 讀 IMDb 進階搜尋，≥500 票的台灣清單）；IMDb 標題頁 | 抄 candidates 檔／WebSearch（`allowed_domains: imdb.com`） | read（4 部：與惡、人選之人、化外之醫、一把青）／snippet（11 部） |
| IMDb Parents Guide、Certifications | `imdb.com/title/<id>/parentalguide/` | WebFetch 失敗（ENOTFOUND）；WebSearch 1 次 | 讀不到（15/15） |
| 台灣電視分級 | tw-availability 檔；公視節目頁；zh.wikipedia | 抄檔／WebSearch 2 次 | tw-availability 無記錄；搜尋無結果 → 讀不到（15/15） |
| 豆瓣 | ratings 檔 DB25 | 抄檔 | read（cn 輪；只有與惡 II） |
| 推薦 tag | 三份 candidates 檔＋merged | 本機讀檔 | 沿用各檔標記 |
| 台灣串流 | tw-availability-1／2 | 本機讀檔，照抄 | 沿用各檔判定 |

toolDegradation：
- **MCP 網路工具全部斷線**（session 啟動時 Groundlane、Exa、Tavily、jina、firecrawl、linkup 都回 502 `CLIENT_HTTP_NOT_IMPLEMENTED`），所以 fallback 鏈第 1、5 層不能用。
- 第 2 層 Groundlane 直接 HTTP 需要對 `/mcp` 發 POST；這個 session 的 WebFetch 只能發 GET，所以沒有試。第 3、4 層（Keenable、You.com keyless）同樣要靠 WebFetch 連外部網域；WebFetch 對 zh.wikipedia.org、mydramalist.com、www.imdb.com 都回 `getaddrinfo ENOTFOUND`（網域不在 session 網路白名單），工具說明要求同類失敗後不要再試其他網站，所以沒有再試 api.keenable.ai、api.you.com。
- 實際可用的只有 **WebSearch**（內建，美國地區），共約 40 次查詢；`allowed_domains` 限 mydramalist.com／imdb.com 取 MDL／IMDb 摘要，中文新聞用不限網域的搜尋。**所有新資料都是摘要（snippet）**。
- 終端機 curl 沒有使用（任務說明已知被擋）。沒有碰豆瓣頁面。
- 要補 read 證據，需要使用者把 `zh.wikipedia.org`、`mydramalist.com`、`www.imdb.com`（以及公視+、各平台頁）加進環境的 Allowed domains，或等 MCP 恢復。

---

## 1. 我們與惡的距離（含 II）

1. **片名**：**我們與惡的距離 (+ II)**／*The World Between Us*（S1）、*The World Between Us: After the Flames*（S2，CATCHPLAY+ 文章用名）（tw-availability-1）。MDL S1 條目另名 *No Outsiders*（slug `28709-no-outsiders`），S2 條目名 *The World between Us Season 2*（snippet）。
2. **劇情**：
   - S1：一樁無差別殺人案之後，被害者家屬、加害者家屬、律師、媒體人與精神疾病患者家庭交錯的故事。IMDb 摘要：「10-part, hour-long plot about the aftermath of a mass shooting」（snippet；IMDb 寫 shooting，台灣報導多寫「無差別殺人」，用詞要再核對原頁）。天下雜誌等新聞摘要：描寫「被害者與加害者家屬的心理狀態，並融入人權、媒體等議題」（snippet）。
   - II：一場隨機縱火案開場，時間跨度約 20 年、六個家庭交錯；周渝民飾演的精神科醫師馬亦森在縱火案中失去妻兒。議題含精神疾病、隨機殺人、公共衛生、國民法官（天下／TVBS／yam 摘要，snippet）。
3. **季數與狀態**（皆 snippet）：
   | 季 | 播出 | 集數 | 平台 | 片長 |
   |---|---|---|---|---|
   | 我們與惡的距離（S1） | 2019-03-24 到 04-21，每週日 21:00 | 10 | 公視、CATCHPLAY 線上影音、HBO 同步（天下摘要）；MDL 寫 PTS | 約 1 小時（IMDb 摘要「hour-long」） |
   | 我們與惡的距離 II | 2025-06-07 起每週六 21:00 兩集連播，到 07-05（MDL） | 10 | 公視、CATCHPLAY 電影台首播；同晚 22:00 CATCHPLAY+、公視+、愛奇藝國際版上架（TVBS 摘要）；海外 Prime Video（摘要稱「首部登上 Amazon Prime Video 的台劇」） | 讀不到 |
   - **兩季都已完結**。**I 與 II 的距離：首播相隔約 6 年（2019-03 → 2025-06）**，主創同為編劇呂蒔媛、導演林君陽（snippet）。II 的分集依年代推進（1–2 集 2022、3–4 集 2001、5–6 集 2011、7–8 集 2021、9–10 集最終回）（TVBS 摘要，snippet）。
   - 沒有讀到第三季消息。
4. **分級**：
   - 台灣分級：tw-availability 沒有記錄；搜尋沒有結果 → **讀不到**。
   - IMDb Certifications／Parents Guide：**讀不到**（全劇條目 tt10073114）。線索：單集 "Until Dawn" 的 Parents Guide 頁有 United States TV-14（snippet，不是全劇）。
   - MDL Content Rating：S1 13+（snippet）。
   - 需要提醒：S1 以隨機殺人案為核心；II 以縱火案、喪妻喪子、精神疾病為核心（新聞摘要，snippet）。具體尺度沒有來源。
5. **觀眾評分**：
   - MDL：S1 **8.4**（535 人，https://mydramalist.com/28709-no-outsiders ；ratings 檔 MDL #11，read）；S2 **7.8**（33 人）／另一快照 7.9（31 人）（https://mydramalist.com/781982-the-world-between-us-season-2 ，snippet）。
   - IMDb：**8.8**（3.3K，ratings 檔 read；台灣劇集 IMDb #1；條目 tt10073114 標「TV Series 2019–」，S1/S2 是否同條目沒有確認）。
   - 豆瓣：II **8.4**（DB25 #3，ratings 檔，cn 輪 read）。S1 沒有分數。
6. **推薦 tag**（merged：ABCEFG，6 類）：
   - A：**GB 戲劇節目獎 2019（win）**；**GB 戲劇節目獎 2026（win，II）**；AACA 台灣區 Best Drama Series 2019；GOTT 2019 Best Writer（呂蒔媛，win）；AACA 2025 台灣區 Best Actor（周渝民）＋Best Screenplay（呂蒔媛）（II）
   - B：KM2025 台劇 #1（II）；500輯2022（鄭秉泓「三部關鍵台劇」）
   - C：IMDb 8.8（3.3K，台劇 #1）；MDL #11 8.4（535）；豆瓣 DB25 #3（II，8.4）
   - E：Google（2019 快速竄升關鍵字總榜 #1，史上第一部戲劇；2025 快速竄升台灣戲劇 #3，II）——算一次；DailyView 2025 #7（II）
   - F：PTT 2019 鄉民票選 #1（514 票）；PTT 2020 經典票選 #1（174 票）；PTT 2025 前三串 推文 4（II）；另有 S20 BUE「沒有當年的氣勢」（II 負評）
   - G：LINE TODAY 聚光賞 2025 台劇 #3（II）
   - （已刪：awards 檔 B LINE2025 #3，依規則不計 B。）
7. **前置作品**：**原創劇本**（沒有讀到原著）。II 是 S1 的續作，摘要說是「六個家庭」的新故事（主角群與 S1 的關係沒有讀到）；**能否不看 S1 直接看 II 沒有來源，判斷上建議先看 S1**。
8. **台灣串流**：公視+ (both seasons on one program page): https://www.ptsplus.tv/zh/programs/55585715-e0e9-4e9f-8956-112319ecd7ac (S2 season page …/seasons/109c97b9-2c1f-44f9-937d-99cd6aecfb7f). CATCHPLAY+ (S1 and S2). TaiwanPlus (S1, free, English subs). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 我們與惡的距離」. CATCHPLAY+ 編看編談, 2026-10-26 (https://edsays.catchplay.com/tw/article-4865-mjaa6gxm): 「全集集數可在 CATCHPLAY+ 線上看」, with a free week from 10/26 to 10/31. Mirror Media, 2024-10-22 (https://www.mirrormedia.mg/story/20241022insight004): S1 on TaiwanPlus. — **confirmed (service page + platform's own article, 2026-10)**（tw-availability-1）
- **類型核對**：社會議題劇（ratings 檔標 social drama）。**符合本篇（社會）**。
- **合作方**：S1 公視 × CATCHPLAY × HBO Asia（公視新聞稿 2019-03-08，tw-availability-1）；S2 公視＋大慕影藝，CATCHPLAY+ 為串流夥伴、Prime Video 海外。

## 2. 人選之人－造浪者

1. **片名**：**人選之人－造浪者**／*Wave Makers*（Netflix trailer keywords）（tw-availability-1）
2. **劇情**：總統大選前約十個月，執政黨候選人林月真（賴佩霞）競選團隊文宣部的日常——做梗圖、拍影片、辦活動製造聲量；劇中處理職場性騷擾與同志議題。被稱為「台灣首部探討政治幕僚的職人劇」（新聞摘要，snippet）。MDL 摘要：「centers on campaign staff for a presidential candidate」，tag 含 Political、LGBTQ+（snippet）。
3. **季數與狀態**：8 集（MDL 摘要；新聞摘要沒有寫集數），**2023-04-28 Netflix 首播**；公視主頻道原訂 2023-10-28 接檔播出，因飾演候選人的賴佩霞 2023-09-14 宣布參選副總統，公視 09-15 董事會討論是否照原定排播（新聞摘要，snippet；最後的播出日沒有讀到）。導演林君陽（MDL 摘要）。**已完結**，沒有讀到續季。
4. **分級**：台灣分級 **讀不到**（tw-availability 無記錄）；IMDb Certifications／Parents Guide **讀不到**；MDL Content Rating 沒有出現在摘要。需要提醒：職場性騷擾情節（劇中台詞「我們不要就這樣算了」被認為帶動 2023 台灣 MeToo 風潮，新聞摘要，snippet）。
5. **觀眾評分**：MDL **7.4**（約 200 人，https://mydramalist.com/745619-the-wave-makers ，snippet）；IMDb **8.2**（1.7K，ratings 檔 read）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABCDEG，6 類）：
   - A：**GB 迷你劇集獎 2023（win）**；AACA 台灣區 Best Drama Series 2023；GOTT 2023 nom（陳妤 Buffy Chen 得獎，類別未確認）
   - B：The Economist 2023 年度最佳電視（ECON2023）；TNL2023 徐佑德年度五大最佳台劇 第 1 部（partial，付費牆）
   - C：IMDb 8.2（1.7K）
   - D：Netflix NF23H1 820 萬小時（台劇 #2、全球 #2441）
   - E：Google 2023 快速竄升台灣戲劇 #6；DailyView 2023 #1
   - G：LINE TODAY 2023 網友最愛 #3（10.1%）；Netflix 台灣週榜 2023-05-07 #1
   - （F 無：fans 檔說 PTT 幾乎沒有推薦推文，只有 1 人「沒看造浪」。）
7. **前置作品**：原創劇本（沒有讀到原著）。可直接看。
8. **台灣串流**：Netflix (global exclusive since 2023-04-28). Not found on 公視+: no `ptsplus.tv/programs` page surfaced, only 公視 articles about the 2023 broadcast controversy. Linear: 公視. — 證據：beauty321, 2025-09-14 (https://www.beauty321.com/post/67277): its 「2025Netflix台劇推薦」 list includes 《人選之人－造浪者》. The 2023 trailer is on the Netflix Malaysia/Asia channel (https://www.youtube.com/watch?v=A2VMwf58M3I), so it is not counted. — **confirmed (Taiwan media, 2025-09-14)**（tw-availability-1）
- **類型核對**：政治幕僚職人劇。**符合本篇（職人＋社會）**。
- **合作方**：公視 × 大慕影藝，Netflix 首播窗口（tw-availability-1）。

## 3. 化外之醫

1. **片名**：**化外之醫**／*The Outlaw Doctor*（公視+ / Hami titles）（tw-availability-1）
2. **劇情**：因醫療糾紛逃離母國的外籍醫師范文寧（連炳發），隱姓埋名在台灣非法行醫，女神經外科醫師鄭婉平（張鈞甯）協助他，兩人同時面對犯罪集團與執法單位的壓力。題材含無證移工、非法行醫、人口販運（MDL 摘要，snippet；MDL 不同頁對他的國籍寫法不一，第 1 集簡介寫越南）。
3. **季數與狀態**：11 集，**2025-03-08 到 04-12 公視**（MDL 摘要）；同步 中華電信 MOD、Hami Video、公視+、愛奇藝國際版（beauty321 摘要）（皆 snippet）。片長讀不到。**已完結**。
   - **續季：未確認**。製作人湯昇榮受訪說劇中醫療小隊「可能發展成獨立 IP，也可能推出第二季」（關鍵評論網摘要，snippet）——只是可能性，沒有開拍或定檔消息。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**；MDL Content Rating 沒有出現在摘要。需要提醒：人口販運、非法醫療、黑道（MDL 評論摘要，snippet）。
5. **觀眾評分**：MDL **7.4**（43 人）／cast 頁快照 7.5（40 人）（https://mydramalist.com/758383-the-outlaw-doctor ，snippet）；IMDb **7.5**（517，ratings 檔 read）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABCEFG，6 類）：
   - A：**GOTT 2025 Best Asian Contents（win）**；GB 戲劇節目獎 2025（nom；個人獎另有男配角 楊一展，連炳發是否得男主角兩份摘要說法不一，不計）
   - B：KM2025 台劇 #6
   - C：IMDb 7.5（517）
   - E：Google 2025 快速竄升台灣戲劇 #9；DailyView 2025 #10（DV 註：公視首播週日華語劇收視冠軍）
   - F：PTT 2025 前三串 推文 約 11（年度最多）；PTT 2025 懸疑串 推文 1；Dcard 2025 回覆 2（「討論好像比較少」）
   - G：LINE TODAY 聚光賞 2025 台劇 #5；Hami 2025 年度戲劇榜（名次不明；中華電信出品，有平台效應）
   - （已刪：awards 檔 B LINE2025 #5，依規則不計 B；Hami 上半年 TOP10，S14 snippet。）
7. **前置作品**：沒有讀到原著（原創或改編不明）。可直接看。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/0e5ad353-29e5-4e8c-a014-009333bcf81e. Hami Video (some episodes free): https://hamivideo.hinet.net/product/286712.do?cs=2 (下架時間 2030-03-07). Netflix per beauty321 (2025-09, lead). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| The Outlaw Doctor化外之醫」; the Hami page loaded with the title and licence date. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：醫療／移工社會劇（ratings 檔標 medical / migrant-worker drama；MDL 摘要 crime and medical）。**符合本篇（社會＋職人）**。
- **合作方**：公視 × 中華電信 × 瀚草；越南語劇情不代表外國合拍（tw-availability-1）。

## 4. 茶金

1. **片名**：**茶金**／*Gold Leaf*（Hami ep page）（tw-availability-1）
2. **劇情**：1949 年新竹北埔，茶廠千金在離婚後接手負債累累的家族茶業（MDL 摘要，snippet）。以北埔茶商姜阿新（1901–1982）為創作靈感，劇中角色「吉桑」張福吉以他為原型，另有虛構角色；在縣定古蹟「姜阿新洋樓」取景（遠見等摘要，snippet）。
3. **季數與狀態**：12 集，**2021-11-13 到 12-18 公視，每週六**（MDL 摘要，snippet；IMDb 摘要首播日同為 2021-11-13）。導演林君陽，主演連俞涵、溫昇豪（MDL 摘要）。片長讀不到。**已完結**，沒有讀到續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：沒有可引用的內容提醒（題材是戰後經濟與家族事業，判斷）。
5. **觀眾評分**：MDL **7.7**（34 人；搜尋列表頁另有 8.3，https://mydramalist.com/705569-gold-leaf ，snippet）；IMDb **8.3**（304 票，tt15678308，snippet；其他快照 8.2–8.3、275–303 票）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABEFG，5 類）：
   - A：GB 戲劇節目獎 2022（nom）
   - B：500輯2022（鄭秉泓「三部關鍵台劇」）
   - E：Google 2022 快速竄升台灣戲劇 #9
   - F：PTT 2022 成功台劇串 推文 5（其中 1 則「看不下去」）
   - G：LINE TODAY 2021 最推薦台劇 #4（6.88%）；Netflix 台灣週榜 2021-12-26 #2
   - （鄭秉泓〈2021台劇回顧〉只是提及，awards 檔本來就不計。）
7. **前置作品**：取材真人（姜阿新），但劇情有虛構，**不需要先讀任何作品**。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/1075b4c1-de46-4255-94e3-e22272dcddbe. LINE TV https://www.linetv.tw/drama/12800/eps/1 shows 「授權到期」 and 「即將上線」 (**lapsed**). Hami ep page https://hamivideo.hinet.net/product/176003.do?cs=2 showed 下架時間 2025-11-12 (**lapsed**). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 茶金」. 劇夠 2023-07-28: 「《茶金》公視+線上全集收看」. — **confirmed (service page)**（tw-availability-1）
- **類型核對**：客家時代劇（ratings 檔標 Hakka period drama）。**符合本篇（時代＋商戰職人）**。
- **合作方**：公視／瀚草（merged）。沒有外國合拍。

## 5. 聽海湧

1. **片名**：**聽海湧**／*Three Tears in Borneo*（tw-availability-2）。IMDb 原名 *Thiann hái-íng*（snippet）。
2. **劇情**：二戰期間，日本徵召台灣青年到北婆羅洲（今馬來西亞沙巴）山打根一帶的戰俘營擔任戰俘監視員，三名年輕台籍監視員捲入屠殺，戰後被送上盟軍軍事法庭、被控虐待戰俘（商周、報導者、MDL、IMDb 摘要，snippet）。五集分別以「黑鳶」「赤陽」「強風」「侏儒象」「海湧」為題（snippet）。
3. **季數與狀態**：5 集，**2024-08-17 到 08-31 公視，每週六 21:00**；Hami Video 電視館同步（MDL／新聞摘要，snippet；IMDb 單集頁另寫 08-16 到 08-30，時區差異未確認）。片長讀不到。**已完結**，沒有讀到續季。
4. **分級**：台灣分級 **讀不到**（搜尋「聽海湧＋輔12／輔15／護」無結果）；IMDb Certifications／Parents Guide **讀不到**；MDL 沒有出現 Content Rating。
   - **需要提醒：戰俘虐待、戰俘營屠殺、戰犯審判**（多家摘要，snippet）。具體畫面尺度沒有來源。
   - 另：公視董事長胡元輝曾撰文回應本劇引發的「若干爭議」，討論歷史與戲劇的距離（關鍵評論網摘要，snippet；爭議內容沒有讀到）。
5. **觀眾評分**：MDL **8.4**（**7 人**，https://mydramalist.com/771803-three-tears-in-boreno ，snippet；slug 拼成 boreno）；IMDb **8.3**（162 票，tt31502667，snippet；其他快照 8.4、8.6）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEFG，4 類）：
   - A：**GB 迷你劇集獎 2025（win）**；Series Mania 2024 International Panorama 競賽入選（入選不是得獎；文化部稱是台灣影集首次入選，partial）
   - E：DailyView 2024 #7
   - F：PTT 2025 懸疑串 推文 4（「懸疑氣氛塑造得很好」）；PTT 2025 前三串 推文 2；PTT 2025 中空串 lupins「很讚」
   - G：LINE TODAY 聚光賞 2024 台劇 #2（awards 檔記為十大追劇榜 #3）；Netflix 台灣週榜 2024-11-24 #10
   - （已刪：awards 檔 B LINE2024，依規則不計 B；遠見 2024 #6，S21 不計。）
7. **前置作品**：**取材真實歷史**（台籍戰俘監視員、盟軍審判），人物與情節是虛構的；編導參考《前進婆羅洲——台籍戰俘監視員》等書與澳洲法庭審判資料（新聞摘要，snippet）。不需要先看什麼；文章可補一句歷史背景。
8. **台灣串流**：公視+ (free, 「開放全球觀看」): https://www.ptsplus.tv/zh/programs/63b046d9-794e-41df-a76b-cd96a3e330fd. zh-Wikipedia also lists Netflix (from 2024-11) and LINE TV (from 2025-10); neither was checked. — 證據：The 公視+ page loaded on 2026-11-13. 聯合報 (udn), 2026-08-14 (https://stars.udn.com/star/story/10091/9692686): 「也已於公視+免費上架」. — **confirmed (service page + Taiwan media, 2026-08-14)**（tw-availability-2）
- **類型核對**：二戰歷史戰爭劇（ratings 檔標 WWII war drama）。**符合本篇（時代）**。
- **合作方**：公視／看不見電影（merged）。沒有讀到外國合拍。

## 6. 斯卡羅

1. **片名**：**斯卡羅**／*Seqalu: Formosa 1867*（tw-availability-2）
2. **劇情**：以 1867 年羅妹號事件為核心——船難倖存者在南台灣海岸遇害，引出美國領事李仙得（Charles Le Gendre）與恆春半島原住民、漢人、客家人之間的衝突與交涉（MDL 摘要，snippet）。主角蝶妹由溫貞菱飾演，李仙得由法比歐（Fabio Grangeon）飾演（MDL 摘要）。
3. **季數與狀態**：12 集，**2021-08-14 到 09-04**，公視、LINE TV（MDL 摘要；另一列表含 Netflix）（snippet）。IMDb 也寫 2021-08-14 首播、TV Mini Series（snippet）。片長讀不到。**已完結**，沒有續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。
   - **需要提醒：歷史暴力**——船難者遇害、族群衝突與戰事是劇情主軸（MDL 摘要說「shipwreck survivors were killed」，snippet）。具體尺度沒有來源。
5. **觀眾評分**：MDL **8.0**（31 人）／另一快照 8.3（20 人）（https://mydramalist.com/40121-lady-the-butterfly ，snippet；slug 與片名不符）；IMDb **7.3**（300 票，tt15207176，snippet；其他快照 7.2／294–299 票）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：**GB 戲劇節目獎 2022（win）**
   - E：Google 2021 快速竄升戲劇 #10（不分國別總榜）
   - G：LINE TODAY 2021 台劇票選（fans 檔把 斯卡羅 與另 4 部併成一列，名次 #8／#9／#10／#12／#13 沒有分開對應，**斯卡羅的確切名次不明**）
   - （鄭秉泓〈2021台劇回顧〉只是提及，不計。三類剛好達門檻，G 類證據弱。）
7. **前置作品**：**改編小說**（陳耀昌《傀儡花》，MDL 摘要，snippet）。取材真實事件（羅妹號事件）。不需要先讀原著。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/96a5ec69-7327-4d5f-ada8-53e210e34b94. In 2021 it was also on Netflix TW, LINE TV, myVideo and Hami (zh-Wikipedia); none was checked. — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. — **confirmed (service page)**（tw-availability-2）。另：MDL 一則使用者評論說 TaiwanPlus YouTube 有全集（snippet，tw-availability 沒有記錄，不計）。
- **類型核對**：歷史劇（ratings 檔標 historical drama）。**符合本篇（時代）**。
- **合作方**：公視／台北創造（merged）。沒有讀到外國合拍。

## 7. 星空下的黑潮島嶼

1. **片名**：**星空下的黑潮島嶼**／*Black Tide Island*（tw-availability-2）
2. **劇情**：1950 年代白色恐怖時期，一群頂尖醫師以政治犯身分被關在綠島新生訓導處，在資源極度匱乏下撐起醫務室、為人開刀（IMDb／MDL 摘要，snippet）。中央社稱它是「台灣第一部聚焦於綠島新生訓導處時期政治受難者的電視劇」，角色與情節「係以相關人物、事件為基礎進行改編創作」（snippet）。
3. **季數與狀態**：9 集，**2025-03-30 到 04-27 客家電視台，每週日**，每集 50 分鐘（MDL 摘要）；IMDb 也寫 2025-03-30、9 集（snippet）。導演王傳宗（IMDb 寫 Jim Wang）。**已完結**（IMDb 標「TV Series 2025–」，但沒有讀到續季消息）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：白色恐怖、政治犯監禁（題材，snippet）。具體尺度沒有來源。
5. **觀眾評分**：MDL **讀不到有效分數**（快照為 N/A、0 人，摘要自稱是舊快取，https://mydramalist.com/772385-black-tide-island ，snippet）；IMDb **8.3**（22 票，tt28687392，snippet；其他快照 8.6／10 票、8.1）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABFG，4 類）：
   - A：**AACA 2025 Grand Best Cinematography (Fiction)＋Grand Best VFX**（另有台灣區剪輯、音效）；GB 迷你劇集獎 2025（nom）
   - B：KM2025 台劇 #2
   - F：PTT 2025 前三串 推文 5；PTT 2025 中空串 skysilver「大推」
   - G：LINE TODAY 聚光賞 2025 台劇 #1、十大追劇榜 #6（唯一入榜台劇）
   - （已刪：awards 檔 B LINE2025，依規則不計 B；Hami 上半年 TOP10，S14 snippet。）
7. **前置作品**：**取材真實歷史**（綠島新生訓導處醫務所），人物改編創作。不需要先看什麼。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/c2a25464-d569-410f-a776-539d1c0746fc. Hami Video (some episodes free): https://hamivideo.hinet.net/product/288397.do?cs=2 (下架時間 2028-03-29). LINE TV: https://www.linetv.tw/drama/18031/eps/1. myVideo 3/30930 exists (inconclusive). — 證據：All three pages loaded on 2026-11-13. LINE TV shows 「已完結」 with no lapse notice. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：白色恐怖時代劇＋醫療職人。**符合本篇（時代）**。
- **合作方**：客家電視台／中華電信（merged）；IMDb 摘要列製作公司 Go Inside、Hakka TV。

## 8. 做工的人

1. **片名**：**做工的人 [co-pro: HBO Asia]**／*Workers*（HBO Max URL slug）（tw-availability-2）。IMDb 單集頁另有英文名 *We, the Laborers*（snippet）。
2. **劇情**：台灣工地工人的日常與友情。IMDb 摘要：三個朋友打算蓋廟，向泰國商人買神像來募款（snippet）。MDL tag 含 Construction Worker Male Lead、Workplace Setting、Brothers' Relationship、Illness（snippet）。
3. **季數與狀態**：6 集，**2020-05-10 到 06-14，每週日**，每集 45 分鐘（MDL 摘要）；首播平台 HBO Asia 與 myVideo（TheTVDB 摘要），IMDb 寫台灣、新加坡同日首播（皆 snippet）。導演鄭芬芬（IMDb 摘要）。**已完結**（TheTVDB 標 Ended）；沒有讀到第二季。另有電影版《做工的人：電影版》（MDL 摘要，snippet；年份沒有讀到）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：MDL tag 有 Illness（疾病情節，snippet）；其餘沒有來源。
5. **觀眾評分**：MDL **7.5**（31 人，https://mydramalist.com/55019-we-the-laborers ，snippet）；IMDb **8.1**（273 票，tt11092582，snippet；另一快照 266 票）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEF，3 類）：
   - A：**GB 迷你劇集獎 2021（win）**
   - E：Google 2020 快速竄升戲劇 前十（未標名次，partial 讀取）
   - F：PTT 2020 經典票選 #16（49 票）；PTT 2022 成功台劇串 推文 4；PTT 2023 懸疑串 原 PO「既好笑又感人」；Dcard 2021 個人清單
7. **前置作品**：**改編散文集**（林立青《做工的人》，MDL／TheTVDB 摘要，snippet）。不需要先讀。
8. **台灣串流**：HBO Max TW: https://www.hbomax.com/tw/zh/show/0b4fa3a3-ab03-4c4b-9634-3e9d3922146d. myVideo was the co-premiere platform (inconclusive). — 證據：The HBO Max TW page loaded on 2026-11-13 as 「觀看 做工的人 \| HBO Max」. UpToGo, 2026-05-17, names MyVideo and HBO GO. — **confirmed (service page). This is an HBO Asia original co-production.**（tw-availability-2）
- **類型核對**：藍領職人喜劇（ratings 檔標 working-class comedy-drama）。**符合本篇（職人＋社會）**。
- **合作方（合拍）**：**HBO Asia 原創合製**；台灣方為 大慕影藝／凱擘／台灣大哥大（awards 檔、tw-availability-2）。IMDb 摘要列製作公司 Damou Entertainment。

## 9. 天橋上的魔術師

1. **片名**：**天橋上的魔術師**／*The Magician on the Skywalk*（zh-Wikipedia，經 tw-availability-2）
2. **劇情**：1980 年代台北中華商場，天橋上的魔術師與商場裡孩子們的魔幻寫實故事（MDL／新聞摘要，snippet）。IMDb 分類為 supernatural fantasy（snippet）。
3. **季數與狀態**：10 集，**2021-02-20 起每週六 21:00 公視、myVideo 同步首播，每週兩集**；之後 Netflix 台灣上架（Newtalk／公視新聞摘要，snippet）。片長讀不到。導演楊雅喆（與江遇珠共同編劇，MDL 摘要）。總投資逾 2 億、其中約 8,000 萬搭建中華商場場景（新聞摘要，snippet）。**已完結**，沒有續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：沒有可引用的來源。
5. **觀眾評分**：MDL **7.4**（22 人，https://mydramalist.com/686349-the-magician-on-the-skywalk ，snippet）；IMDb **7.8**（274 票，tt14238838，snippet；另一快照 257 票；單集 6.1–9.2，票數很少）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AFG，3 類）：
   - A：**GB 戲劇節目獎 2021（win）**
   - F：PTT 2022 成功台劇串 推文 2（其中 1 則看不下去）
   - G：LINE TODAY 2021 台劇票選 #6
   - （已刪：PTT〈天橋上的魔術師為何不是神劇？〉18 推，S22 不計。F 類證據偏弱且褒貶互見。）
7. **前置作品**：**改編小說**（吳明益《天橋上的魔術師》，MDL／新聞摘要，snippet）。不需要先讀。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/6b6894e2-92ec-4932-827b-0ed10a482234. In 2021 it was also on Netflix TW, LINE TV and myVideo; LiTV added it in 2023 (zh-Wikipedia). None of these was checked. — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. — **confirmed (service page). This is a 公視 × myVideo co-production.**（tw-availability-2）
- **類型核對**：時代＋魔幻寫實。放「時代」可以，但奇幻成分要在文章裡講明。
- **合作方（合拍）**：**公視 × myVideo**（tw-availability-2）；製作 原子映象（merged）。

## 10. 牛車來去

1. **片名**：**牛車來去**／英文片名：tw-availability-2 寫「no English title found from a reliable source」。MDL、IMDb 摘要用 *Oxcart Trails*；IMDb 原名 *Gû tshia lâi khì*（台語）（snippet）——**tw-availability 判定不採用，照抄「無可靠英文名」**。
2. **劇情**：1943 年台南鄉村，農婦阿春為改善家計，答應地主以一頭牛為代價借腹生子（新聞／MDL 摘要，snippet）。在台南鹽水岸內糖廠拍攝（新聞摘要）。
3. **季數與狀態**：30 集，**2023-01-14 到 04-22 公視**，每集 60 分鐘（MDL 摘要；鏡週刊 2022-11 定檔報導、IMDb 首播日同）（皆 snippet）。製作費約 8,400 萬、費時 3 年（新聞摘要）。IMDb 列語言為台語（Min Nan）。**已完結**。
   - **續作**：系列第二部《火車來去》由華視與公視台語台合作，2025 年開春播出、原班人馬（yam 摘要，snippet）。這部不在本篇清單裡。
   - 注意：merged 檔寫 2022，與首播 2023-01 不符（2022 是定檔／製作年）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：借腹生子題材（snippet）；其餘沒有來源。
5. **觀眾評分**：MDL **讀不到有效分數**（快照 N/A、0 人，摘要說是幾年前的快取，https://mydramalist.com/747291-oxcart-trails ，snippet）；IMDb **7.2**（票數沒有在摘要裡，tt25382986，snippet）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：GB 戲劇節目獎 2023（nom）
   - E：DailyView 2023 #3；Google 2023 快速竄升台灣戲劇 #10（不同家族，類別只算一次）
   - G：LINE TODAY 2023 網友最愛 #8
7. **前置作品**：沒有讀到原著（原創或改編不明）。不需要先看什麼；續作《火車來去》是之後的作品。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/6ace5111-0637-435c-bc35-d5c8b80f1d14. Hami Video: https://hamivideo.hinet.net/product/210517.do?cs=2 (下架時間 2028-01-13). — 證據：Both pages loaded on 2026-11-13. — **confirmed (service page). This is a 公視 × 中華電信 co-production.**（tw-availability-2）
- **類型核對**：日治時期鄉村時代劇（ratings 檔標 period rural drama）。**符合本篇（時代）**。
- **合作方（合拍）**：**公視 × 中華電信**（tw-availability-2）；製作 禾豐（merged）。

## 11. 一把青

1. **片名**：**一把青**／*A Touch of Green*（tw-availability-2）
2. **劇情**：1945 到 1971 年，國軍空軍飛行員與他們的妻子、家庭的故事（MDL 摘要，snippet）。
3. **季數與狀態**：31 集，**2015-12-19 到 2016-04-02 公視**，每集 52 分鐘（MDL 摘要，snippet）。主演吳慷仁、楊一展、楊謹華、天心（MDL 摘要；MDL 拼成 Lan Jun Tian）、連俞涵。**已完結**，沒有續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：戰爭場面、飛行員殉職與喪偶（MDL 評論摘要說「emotionally heavy」，snippet）。
5. **觀眾評分**：MDL **8.0**（102 人；episodes 頁快照 7.9／101 人，https://mydramalist.com/15192-a-touch-of-green ，snippet）；IMDb **8.4**（509，ratings 檔 read）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ACF，3 類）：
   - A：**GB 戲劇節目獎 2016（win）**
   - C：IMDb 8.4（509）
   - F：PTT 2020 經典票選 #9；PTT 2022 推文 3；Dcard 2021、2019——**fans 檔把本劇標「範圍外」（2015 首播，早於 2016 的蒐集窗口），但 merge.py 仍把 F 計入**；若嚴格照 fans 檔，只剩 A、C 兩類。
7. **前置作品**：**改編白先勇短篇小說〈一把青〉**（收在《臺北人》）（MDL 摘要，snippet）。不需要先讀。
8. **台灣串流**：None confirmed. 公視+ https://www.ptsplus.tv/zh/programs/f342823d-1eb7-4dc0-a4c6-ffa02ef189ba returns 「公視+ \| 404」 (**lapsed**). LINE TV https://www.linetv.tw/drama/12579/eps/20 shows 「此戲劇因授權到期，已下架」 (**lapsed**). LiTV VOD00295464 and ofiii 64603 are inconclusive. Netflix: https://www.netflix.com/tw/title/80233859 is indexed (lead). — 證據：Epoch Times, 2018-04-03 (https://www.epochtimes.com/b5/18/4/2/n10271177.htm): 公視 put 《一把青》 on Netflix. No later Taiwan evidence was found. The 公視 YouTube playlist PLLhKX7btG59cksEKyZazJKskCnOFIt88X 「公視 一把青」 could not be read (lead). — **licensed-old (Netflix, 2018; 公視+ and LINE TV lapsed)**（tw-availability-2）
- **類型核對**：眷村／軍人家庭時代劇（ratings 檔標 period military-family drama）。**符合本篇（時代）**。文章要標「可能已下架」。
- **合作方**：公視／台北創造（merged）。

## 12. 監所男子囚生記

1. **片名**：**監所男子囚生記**／*Oops! I'm in Jail*（tw-availability-2）
2. **劇情**：體保生阿耀（陳澤耀）為了還債，被黑道大姐派進監所當管理員照顧黑道「吉娃娃」（楊祐寧）；劉以豪飾演警校出身、守規矩的官二代姜一傑（新聞摘要，snippet）。MDL 摘要寫「a former taekwondo athlete who takes a job as a prison guard to cover his gambling debts」（snippet）。
3. **季數與狀態**：12 集（MDL 摘要；新聞摘要沒有寫集數），**2025-11-15 起每週六 20:00 愛奇藝國際版與台灣大哥大 MyVideo 同步首播**；八大戲劇台 11-23、台視 12-14 起播（TVBS／鏡週刊摘要，snippet）。MDL 摘要寫播到 2025-12-13（snippet）。片長讀不到。**已完結**；沒有讀到續季消息。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：黑道、賭債題材（snippet）；其餘沒有來源。
5. **觀眾評分**：MDL **7.7**（約 219 人，https://mydramalist.com/802450-oops-i-m-in-jail ，snippet）；IMDb **7.7**（**14 票**，tt38628094，snippet）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：ABFG，4 類）：
   - A：GB 戲劇節目獎 2026（nom）
   - B：KM2025 台劇 #5
   - F：PTT 2025 前三串 推文 2（「節奏笑點感人都有」）
   - G：MyVideo 2025 戲劇榜 前十（名次在圖片裡，不明；MyVideo 是首播平台之一，有平台效應）
7. **前置作品**：沒有讀到原著。可直接看。
8. **台灣串流**：CATCHPLAY+: https://www.catchplay.com/tw/video/3053b6c1-aee4-434d-80e3-aab05fcafa05 (redirected to the homepage for our IP; inconclusive). myVideo was the 2025 premiere platform (inconclusive). iq.com also carries it (not counted). — 證據：CATCHPLAY ED Says, 2026-05-07 (https://www.catchplay.com/tw/ed-says/article-5068-uxzugmir): 「5/16在CATCHPLAY+全集上架，首兩集免費觀看」. myVideo blog, 2025-12-15 (https://blog.myvideo.net.tw/oops-im-in-jail-01/): 「MyVideo 11月15日正式開播」. — **confirmed (service editorial, 2026-05-07)**（tw-availability-2）
- **類型核對**：**監所職場喜劇**（新聞摘要）。放「職人」可以，但調性是喜劇，文章要講明。
- **合作方**：新聞摘要說是「愛奇藝原創」、愛奇藝國際站與壹壹影業聯合出品（snippet）；楊祐寧兼任監製。不是外國合拍，但是 iQIYI 國際站出品——台灣合法收看照 tw-availability 的 CATCHPLAY+ 判定，iq.com 不算。

## 13. 人生清理員

1. **片名**：**人生清理員（影集版）**／*The Cleaner*（zh-Wikipedia English title）（tw-availability-2）
2. **劇情**：黑道出身的男子帶著一組人清理命案與孤獨死現場，和他的助手一起面對逝者留下的人生（MDL 摘要，snippet）。主演鳳小岳、宋芸樺、金士傑、黃冠智、蔡嘉茵（snippet）。
3. **季數與狀態**：9 集，**2024-09-07 起公視每週六 21:00–23:00 連播兩集；八大戲劇台 09-08 起每週日 20:00 播一集**；MDL 寫播到 10-05（鏡週刊／MDL 摘要，snippet）。導演陳大璞、製作人楊凱婷，果陀娛樂製作（snippet）。片長讀不到。**已完結**，沒有讀到續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：死亡現場、命案現場清理（題材，snippet；MDL 評論說調性沉重）。具體尺度沒有來源。
5. **觀眾評分**：MDL **7.8–7.9**（約 16–19 人，快照不同，https://mydramalist.com/766083-the-cleaner ，snippet）；IMDb **7.8**（票數沒有在摘要裡，tt33268748，snippet）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AFG，3 類）：
   - A：GB 迷你劇集獎 2025（nom）
   - F：Dcard 2025 回覆 1（弱訊號）
   - G：LINE TODAY 聚光賞 2024 台劇 #5
   - （已刪：遠見 2024 #3，S21 不計。F 只有一則 Dcard，類別數剛好 3，偏弱。）
7. **前置作品**：**有前作**：2020 年公視人生劇展電視電影《人生清理員》（入圍金鐘電視電影獎等 7 項），影集版沿用電視電影班底、開發 4 年，**是全新故事**（鏡週刊摘要，snippet）。**不需要先看電視電影版**（判斷：新故事）。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/1fd797a3-b9c8-4949-b8de-a4324eb22d3a. Netflix: https://www.netflix.com/tw/title/81927215 (lead). Hami https://hamivideo.hinet.net/product/272428.do?cs=2 is now a bare 「HamiVideo」 shell (**lapsed**). — 證據：The 公視+ page loaded on 2026-11-13 as 「公視+ \| 人生清理員（影集版）」. udnSTYLE / Cosmopolitan TW, 2024-09-27 (https://style.udn.com/style/story/121034/8251825): it topped the Netflix TW chart. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：**職人劇（命案／孤獨死現場清潔）**，調性沉重。**符合本篇（職人）**。
- **合作方**：果陀（merged）；播出 公視＋八大（snippet）。MDL 寫 GTV & PTS。沒有外國合拍。

## 14. 華麗計程車行

1. **片名**：**華麗計程車行**／*A Wonderful Journey*（tw-availability-2）。IMDb 原名 *Hua li ji cheng che hang*（snippet）。
2. **劇情**：嘉義老字號「華麗」計程車行的家族與司機們；921 地震後，陳家兄弟博文、博翰面對要不要接下車行（IMDb 摘要，snippet）。每集帶出嘉義的人與文化（MDL 摘要）。
3. **季數與狀態**：10 集，**2024-02-18 起每週日 22:00**，華視、LINE TV 首播，Netflix、Hami Video 等同步（新聞／MDL 摘要，snippet）。導演莊絢維（MDL 拼 John Chuang）。片長讀不到。**已完結**，沒有續季。
   - 注意：awards 檔寫 2023；首播是 2024-02（金鐘 2024 入圍與此一致）。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**。需要提醒：沒有可引用的來源。
5. **觀眾評分**：MDL **7.5**（**4 人**，https://mydramalist.com/760177-a-wonderful-journey ，snippet）；IMDb **7.4**（tt30765097；另一排行頁 7.2／19 票，snippet）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：AACA 2024 台灣區 Best Original Production by a Streamer (Fiction)；GB 戲劇節目獎 2024（nom）
   - E：DailyView 2024 #8
   - G：LINE TODAY 聚光賞 2024 台劇 #9；金鐘 59 人氣票選期中 #9
7. **前置作品**：**改編嘉義作家陳俊文的同名作品**（聯合報出版；摘要稱是「台灣第一本以計程車車行為主題的散文作品」，同一則摘要又寫「原著小說」，文類要再核對）（yam 摘要，snippet）。不需要先讀。
8. **台灣串流**：LINE TV (co-producer): https://www.linetv.tw/drama/15286/eps/2 — 證據：The page loaded on 2026-11-13 as 「華麗計程車行第1集 無常才是正常」, with VIP badges and neither 「授權到期」 nor 「即將上線」. — **confirmed (service page)**（tw-availability-2）
- **類型核對**：**家庭＋地方職人劇**（計程車行，ratings 檔標 family workplace drama）。放「職人」可以，偏溫情家庭。
- **合作方（合拍）**：**華視 × LINE TV**（LINE TV 是共同出品方；新聞摘要稱「LINE TV 與華視首度合作」）；製作 巧克（merged）。不是外國合拍。

## 15. 村裡來了個暴走女外科

1. **片名**：**村裡來了個暴走女外科**／*Mad Doctor*（ELLE TW URL slug; unofficial）（tw-availability-2）。MDL、IMDb 條目也用 *Mad Doctor*（snippet）。
2. **劇情**：女外科醫師「小劉」來到鄉村小醫院，用自己的技術與固執原則，處理村裡令人啼笑皆非的醫療狀況，背後有不為人知的過去；中段（5、6 集）觸及醫療糾紛（Marie Claire 摘要，snippet）。
3. **季數與狀態**：10 集，**2022-05-07 到 06-04 公視，每週六 21:00**；MOD、Hami Video、MyVideo、LINE TV、公視+ 同步（Marie Claire／MDL／IMDb 摘要，snippet）。導演賴孟傑；蔡淑臻主演並參與編劇（snippet）。片長讀不到。**已完結**，沒有續季。
4. **分級**：台灣分級 **讀不到**；IMDb Certifications／Parents Guide **讀不到**；MDL Content Rating **13+**（snippet）。需要提醒：醫療糾紛、手術場面（題材，snippet）。
5. **觀眾評分**：MDL **7.5**（約 190 人，https://mydramalist.com/709165-mad-doctor ，snippet）；IMDb **7.3**（約 185 票，tt19655892，snippet）；豆瓣：candidates 檔沒有。
6. **推薦 tag**（merged：AEG，3 類）：
   - A：**GB 戲劇節目獎 2023（win）**
   - E：Google 2022 快速竄升台灣戲劇 #5
   - G：LINE TODAY 2022 年度期中 #1（14.6%；只有期中結果，最終名次沒找到）
7. **前置作品**：**改編劉宗瑀醫師的同名小說**（Marie Claire 摘要，snippet）。不需要先讀。
8. **台灣串流**：公視+: https://www.ptsplus.tv/zh/programs/a3f838da-d613-4d6b-a0b0-2c5a048dba5f. Hami https://hamivideo.hinet.net/product/188605.do?cs=2 is a bare shell (**lapsed**). LiTV VOD00296163 and ofiii 64649 are inconclusive. — 證據：The 公視+ page loaded on 2026-11-13 with the synopsis. In 2022 it was also on Netflix TW (Marie Claire TW, 2022-05-26). — **confirmed (service page)**（tw-availability-2）
- **類型核對**：**鄉村醫療喜劇**（MDL genre Comedy／Medical；ratings 檔標 medical romcom）。放「職人」可以，但調性輕鬆，文章要講明（split-proposal 也列它「歸類最不確定」）。
- **合作方**：公視出品、十三月製作（Marie Claire 摘要；IMDb 摘要列製作公司 Neverland，對應關係未確認）。不是合拍。

---

## 總結一覽

| # | 片名 | 集數／首播 | MDL（人數） | IMDb（票數） | 豆瓣 | merged 類別 | 台灣串流判定 |
|---|---|---|---|---|---|---|---|
| 1 | 我們與惡的距離（I／II） | 10／2019-03-24；10／2025-06-07 | 8.4（535，read）；II 7.8（33） | 8.8（3.3K，read） | II 8.4（DB25） | ABCEFG | confirmed |
| 2 | 人選之人－造浪者 | 8／2023-04-28 Netflix | 7.4（約 200） | 8.2（1.7K，read） | — | ABCDEG | confirmed (Taiwan media) |
| 3 | 化外之醫 | 11／2025-03-08 | 7.4（43） | 7.5（517，read） | — | ABCEFG | confirmed |
| 4 | 茶金 | 12／2021-11-13 | 7.7（34） | 8.3（304） | — | ABEFG | confirmed |
| 5 | 聽海湧 | 5／2024-08-17 | 8.4（7） | 8.3（162） | — | AEFG | confirmed |
| 6 | 斯卡羅 | 12／2021-08-14 | 8.0（31） | 7.3（300） | — | AEG | confirmed |
| 7 | 星空下的黑潮島嶼 | 9／2025-03-30 | 讀不到（快照 0 人） | 8.3（22） | — | ABFG | confirmed |
| 8 | 做工的人 | 6／2020-05-10 | 7.5（31） | 8.1（273） | — | AEF | confirmed（HBO Max） |
| 9 | 天橋上的魔術師 | 10／2021-02-20 | 7.4（22） | 7.8（274） | — | AFG | confirmed |
| 10 | 牛車來去 | 30／2023-01-14 | 讀不到（快照 0 人） | 7.2（票數不明） | — | AEG | confirmed |
| 11 | 一把青 | 31／2015-12-19 | 8.0（102） | 8.4（509，read） | — | ACF | **licensed-old** |
| 12 | 監所男子囚生記 | 12／2025-11-15 | 7.7（約 219） | 7.7（14） | — | ABFG | confirmed (service editorial) |
| 13 | 人生清理員 | 9／2024-09-07 | 7.8–7.9（16–19） | 7.8（票數不明） | — | AFG | confirmed |
| 14 | 華麗計程車行 | 10／2024-02-18 | 7.5（4） | 7.4（約 19） | — | AEG | confirmed |
| 15 | 村裡來了個暴走女外科 | 10／2022-05-07 | 7.5（約 190） | 7.3（約 185） | — | AEG | confirmed |

除了標 read 的四個 IMDb 值、與惡 S1 的 MDL 值和豆瓣值，表中數字全部是 snippet。台灣分級與 IMDb Parents Guide 15 部都讀不到。
