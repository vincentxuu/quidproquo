# 審稿紀錄：2026-10-26-crack-climbing-size-map

## post-verify

查證日期：2026-10-26。範圍：`src/content/posts/climbing/2026-10-26-crack-climbing-size-map.md`＋`-en.md`（英文版只比對與中文是否一致）。未修改文章。

工具與降級（toolDegradation）：
- Groundlane MCP：未授權，未使用。
- 網頁：curl 直接抓 Wide Boyz 電子報、Climbing.com、Mountain Project、Climber.co.uk、TOMMY、月刊山／中央日報（全文）；UKC 兩頁 curl 回 403 → Keenable fetch（課程頁全文；論壇只回一則）→ Exa `web_fetch_exa`（論壇全串）。
- YouTube：20 支全部跑 oEmbed；yt-dlp `--cookies-from-browser chrome` 取 info.json（上傳日期、章節、說明欄）；字幕全部 429（含 json3 直連）→ Keenable fetch 取逐字稿（多數成功）→ VIDEORACLES 用 Tavily extract、Kim 2 部／のぼるきょじん 用 Exa（無時間碼的全文）。

### 影片核對表

| 影片 | oEmbed | 上傳日 | 用途 | 結果 |
|---|---|---|---|---|
| JkkwRm5DpcA 김종식 1부 | 401（關閉嵌入，文中用連結 ✓） | 2023-01-05 | 拇指分界、flare／內角／斜裂 | 內容 ✓（逐字稿） |
| VRc_iFasUc4 TAKEMOVIE | 200 | 2021-09-09 | start 181 | ✓ 章節 181「種類と名称」，之後 271 ハンド→358 フィンガー→473 シンハンド→544 フィスト→598 オフィズス→704 チムニー，順序與文中一致 |
| DbnofcWjVts Wide Boyz 測力 | 200 | 2021-10-07 | Pete＋Tom、指尖到拳 | ✓ 章節 tips→finger→ringlock→paddle→hand→cupped→fist；逐字稿 Tom 參與、同寬度比 ring lock vs paddle |
| -E1hwhUDsXU Cracker's Dozen | 200 | 2022-08-14 | start 133 | 秒數 ✓（章節 133 = Green Crack HVS）；「第一條手掌裂隙」✗，見下 |
| e87dURsVa7M Top 6 | 200 | 2022-05-08 | 8:10 TAFK | ✓ 章節 490 s = 8:10「Tricks Are For Kids, 13c」 |
| 8-pgiq4vClc Brittany Goris | 200 | 2020-12-11 | 同線不同人 | ✓，但她爬的是 Extension，見下 |
| rv_CnoIdo_s VIDEORACLES 寬裂 | 200 | 2021-02-18 | Joshua Tree 外張寬裂、arm bar | ✓ 逐字稿：「here in joshua tree most off widths are in the back of flares … relying much more than stacks on arm bars and chicken wings」 |
| Qtq4HCEP_RA Serenity Crack | 200 | 2021-11-11 | pin scar | ✓ 說明欄＋逐字稿「placements are all in like pin scars」 |

所有影片皆 ≥ 2020-01-01；fence 嵌入的 3 支 oEmbed 皆 200。

### 🟢 Confirmed

1. Whittaker〈A New FA in Kristiansund…〉日期 Oct 03, 2026；cam 對照表 7 列（0.3/0.4、0.5、0.75/1、2、4、5、6）逐列與原文一致（#6：小手 "more of their body inside the crack with good chicken wings"、大手 "forced more to the edges"；#5：小手 "stacking becomes cupped"）。
2. Kristiansund 路線：起步手掌段 Pete 剛好、Mari 用 cupped；中段 #6 屋簷 Pete "go inverted … massive sit-up"、Mari 臀肩塞深 "cruised"；最後 #4 Pete 拳塞、Mari 疊手；"we both agreed it landed around the exact same grade"。golden rule（指尖過第一指節就一定有技巧）與「只爬一種尺寸會得到偏差印象」都在原文。
3. Indian Creek 十誡（Julie Ellison，2022-04-18 發布、2025-06-21 更新）："established by dudes who have hands the size of #2 and #3 cams … 5.10 … (.75 and #1) are usually 5.11 … If you have smaller hands, you'll find the 5.11s much easier than the 5.10s"。
4. MP「little hands」串（2024-06-27）：先生完美手號 BD #2、太太 0.75；回覆 "Look for 5.11- rated climbs in the creek. They'll likely be 5.9 for her."
5. MP ring lock 串（2015-09-01）："#1 friend is thumbstacks for me, but a #0.5 camalot gets into ring locks … Talk about techniques, not tools."
6. UKC 論壇（2021-06-16）PaulJepson："I've not come across many cracks in the UK where they are parallel enough for handsize to change the grade"（但後半句延伸見 Misframed）。
7. 김종식 1부 逐字稿：拇指只有第三指節，"If your thumb fits in by more than three knuckles, it's a hand crack"；斜裂最難、flare "definitely more difficult"、內角可兩邊撐所以比平面容易。
8. 岩質表：Indian Creek 砂岩平行直裂（十誡）；Joshua Tree 外張寬裂＋arm bar（VIDEORACLES）；優勝美地 pin scar（Serenity 影片）；小川山花崗岩「日本のヨセミテと呼ばれてます」、城ヶ崎安山岩／大室山熔岩（TOMMY）；瑞牆花崗岩、「小川山に比べルートスケールが大きい」（TOMMY）；仁壽峰花崗岩多段、"Mostly slab and crack climbing"（MP）。
9. Tricks Are For Kids 在 Top 6 的 8:10；MP 列 5.13。

### 🔵 Misframed／🔴 Contradicted（要修）

A. 🔴 **gritstone「短而有收口」**（表格 L116、L126「短而有收口的英國裂隙」）
   - 文中引的 Climber.co.uk 原文反而寫 "The friction of the rock and uniformity of the cracks is a winning combination"、"doubling up on sizes … on uniform cracks"；它說 grit 考驗的是 "jamming, laybacking and smearing"、路線 "short"。「有收口」在引用來源裡找不到，方向還相反。
   - 中：「短而有收口的裂隙，考驗塞手、layback 和摩擦」→「短而粗糙的裂隙，考驗塞手、layback 和 smearing」；L126「可以看看短而有收口的英國裂隙長什麼樣」→「可以看看短而粗糙的英國 gritstone 裂隙長什麼樣」。
   - 英：「Short cracks with constrictions that test jamming, laybacking and friction」→「Short, coarse cracks that test jamming, laybacking and smearing」；「It shows what short, constricting British cracks look like」→「It shows what short, coarse British gritstone cracks look like」。

B. 🔵 **Cracker's Dozen「2 分 13 秒起是第一條手掌裂隙，之後依序有薄手、拳頭的路線」**（L126）
   - 章節 133 s 是第 5 條〈Green Crack〉HVS；說明欄（Roaches 指南的清單）只寫 "An awkward change of angle"，沒說是手掌裂隙，也不是第一條裂隙（前面還有 Phallic Crack、Tricouni Crack、The Crank "a jammer's milestone"）。只有第 8 條〈Foord's Folly〉寫明 "Thin hand technique can but help"（章節 5:35），〈Ramshaw Crack〉寫 "Hands to fists to armbar"（10:17）。〈Imposition〉說明是 "Another difficult change in angle"，不是拳裂。Mari 有參與 ✓（逐字稿 5:22「this is going to be Mari's E2 6a」）。
   - 中：「2 分 13 秒起是第一條手掌裂隙，之後依序有薄手、拳頭的路線，Mari Salvesen 也一起爬」→「整份清單 13 條由易到難，2 分 13 秒起是第 5 條〈Green Crack〉，5 分 35 秒的〈Foord's Folly〉要用薄手，10 分 17 秒的〈Ramshaw Crack〉從手掌一路變寬到拳頭和 arm bar，Mari Salvesen 也一起爬」（start 133 可保留，或改 335 對應薄手段）。
   - 英：「The first hand crack starts at 2:13, followed by thin-hands and fist routes, with Mari Salvesen along too.」→「The 13 routes run from easy to hard: Green Crack, the fifth, starts at 2:13; Foord's Folly at 5:35 calls for thin hands; Ramshaw Crack at 10:17 goes from hands to fists to arm bars. Mari Salvesen climbs too.」

C. 🔵 **「Tricks Are For Kids 5.13c … Brittany Goris 也有自己的影片」**（L142）
   - Brittany 的影片是 **Extension**：說明欄寫原線由 Steve Hong 開到第一組錨 45 m、"solid 5.13"，Didier Berthod 延伸到 70 m，5.13c 是她給延伸版的級數。Top 6 說明欄則寫 Tom Randall 爬了 "Tricks Are For Kids, 13c"（不是 Pete）。兩支影片不一定是同一段。
   - 中：「Indian Creek 的〈Tricks Are For Kids〉5.13c，Wide Boyz 在 Top 6 Super Splitters 8 分 10 秒起爬了，女性攀岩者 Brittany Goris 也有自己的影片」→「Indian Creek 的〈Tricks Are For Kids〉（5.13），Wide Boyz 的 Tom Randall 在 Top 6 Super Splitters 8 分 10 秒起爬了；女性攀岩者 Brittany Goris 拍了她爬延伸版（70 公尺，她給 5.13c）的影片」。
   - 英：「Wide Boyz climb Indian Creek's Tricks Are For Kids (5.13c) from 8:10 … and Brittany Goris has her own video of it」→「Tom Randall of Wide Boyz climbs Indian Creek's Tricks Are For Kids (5.13) from 8:10 …, and Brittany Goris has a video of the 70 m extension, which she grades 5.13c」。

D. 🔵 **UKC 例外段後半**（L86）：PaulJepson 只說英國少有平行到會因手大小改變難度的裂隙，"though cruxes can be easier or harder"。「手大小影響最大的，是 Indian Creek 那種…；有收口的裂隙，總能找到適合你的地方」不在原文；同串其他人（Tufted Crack、Dexterity、Beeline）反而舉了很多手小比較吃香的英國路線。
   - 中：「手大小影響最大的，是 Indian Creek 那種從頭到尾一樣寬的砂岩直裂；有收口的裂隙，總能找到適合你的地方。」→「不過他也說，難點還是可能因手大小變簡單或變難；同一串裡也有人舉出好幾條手小比較吃香的英國路線。」
   - 英：「Hand size matters most on Indian Creek's sandstone splitters … in a crack with constrictions you can usually find a spot that suits you.」→「He allowed that cruxes can still be easier or harder, and others in the same thread named several UK routes that favour small hands.」

E. 🟡→建議改 **「韓國 KMGA 一級嚮導김종식」**（L52）
   - 找到的來源：月刊山〈국내 첫 한국암벽등반가이드협회 창립〉寫協會「以김종식為中心」創立，是「國內少數攀岩嚮導之一」；東亞體育（2022-04-26）寫 KMGA（사단법인 한국등반가이드협회，2019 年設立）首次辦 1 級／2 級資格考。沒有任何來源寫他本人持有「1 級」資格；影片說明欄也沒有。
   - 中：「韓國 KMGA 一級嚮導김종식（Kim Jong-sik）」→「韓國攀岩嚮導김종식（Kim Jong-sik，韓國登攀嚮導協會 KMGA 的創會核心）」。
   - 英：「Kim Jong-sik, a KMGA first-grade guide in South Korea」→「Kim Jong-sik, a Korean climbing guide and a founding figure of the Korean climbing-guide association KMGA」。

### 🟡 Unverifiable（低風險，可留可縮）

- 「瑞牆路線較長，寬裂多」：TOMMY 只寫「ルートスケールが大きい」，本站瑞牆山篇也沒有「寬裂多」的字樣。建議中「瑞牆路線較長，寬裂多」→「瑞牆的路線規模比小川山大」；英「Mizugaki has longer routes and many offwidths」→「Mizugaki's routes are bigger in scale」。
- 仁壽峰／仙人峰「斜裂、內角和大煙囪」：花崗岩多段、裂隙接摩擦板、煙囪有來源（MP、本站兩篇）；「斜裂」有김종식〈인수봉 심우길 등 사선크랙〉影片標題可佐；「內角」沒找到明確來源。低風險。
- 「(BD Camalot)」：電子報沒寫品牌，只寫號數與顏色（Purple、Gold、Grey、Green & Red、Small Blue & Grey），顏色和 BD Camalot 一致，屬合理推斷。

### 英文版一致性

除上列 A–E 的同步修改外，英文與中文的主張一致，沒有多出或改變的主張。

### 建議修改清單（摘要）

1. gritstone「有收口」→ 改成「粗糙」（表格＋Cracker's Dozen 段，中英共 4 處）。
2. Cracker's Dozen 2:13 不是「第一條手掌裂隙」→ 改寫成 Green Crack／Foord's Folly（5:35 薄手）／Ramshaw Crack（10:17）。
3. Tricks Are For Kids：原線約 5.13，5.13c 是 Brittany 給延伸版的級數；Top 6 裡爬的是 Tom。
4. UKC 例外段後半句縮回原文。
5. 김종식「KMGA 一級嚮導」→「KMGA 創會核心的攀岩嚮導」。
6. （可選）瑞牆「寬裂多」改成「路線規模較大」。

## post-review

> 本節原由獨立審稿 agent 寫入，後被並行的 post-verify 寫檔覆蓋；以下依主執行緒保留的原文重建（結論與每條建議的處理結果）。

**結論**：聚焦問題（一條縫多寬、該用哪招、手大小改變什麼）答得到，地圖、手大小、岩場、讀法四塊齊。最大缺口是範圍卡的「尺寸與 cam 號數對照」沒做出來；兩篇 glossary 的 thin hands／緊手歸屬互相衝突。機械檢查：check:references、check-process-leak、check:tw 皆無問題。

| # | 問題 | 處理 |
|---|---|---|
| 1 🔴 | 八種尺寸表缺 cam 號數欄 | 已加「大約 cam 號數」欄，註明依 Whittaker 對照整理、隨手大小前後移 |
| 2 🔴 | 「薄手」aliases 含 thin hands／緊手，與手掌篇衝突；definition 與 context 矛盾 | 已拿掉，context 改指向〈手掌裂隙〉的緊手；英文同步 |
| 3 | 今晚動作說「下一節會用到」卻沒用到 | 改成量手寬記錄，之後對照 cam |
| 4 | 找手號的動作做不出來 | 改成岩館裂隙牆＋朋友放 cam、看 cam 片收一半的號數 |
| 5 | 「對照上一節的表」指錯 | 改「本篇開頭的八種尺寸表」 |
| 6 | 岩場表龍洞列沒寫尺寸 | 補〈Noodle Line〉5.8 內角手掌與拳頭裂隙 |
| 7 | 練習題沒考判斷尺寸 | 新增第 1 題（薄手判斷） |
| 8 | 內文連結閘門（Camalot、Mari、Tom Randall、MP、theCrag、Friend 等） | 補 Camalot、Tom Randall、MP、theCrag 連結；Friend 加說明；KMGA 未找到可靠官網，只寫全名 |
| 9 | 研究出處清單擋在正文 | 刪除，改把連結放進表格 |
| 10 | 寫作方法論寫進讀者文 | 刪除秒數守則句；岩質比較句縮短 |
| 11 | 「C 系列」內部代號 | 改〈運動攀登與傳統攀登〉系列 |
| 12 | description 比正文說得滿 | 改「很多路線是大手的人開的，難度也常按大手訂」 |
| 13 | 韓國沒有可嵌入影片 | 未加（符合規格；手掌篇已有仁壽峰影片） |
| 14 | tags | 加 taiwan；不新增 crack-climbing tag |
| 16 | 系列表無連結 | 標「撰寫中」 |
| 中英 | 英文 glossary context 寫中文沿革；not-X-but-Y 開頭；Mizugaki 不一致 | 已改 |

## post-polish

> 本節原由獨立審稿 agent 寫入，後被並行的 post-verify 寫檔覆蓋；以下依主執行緒保留的原文重建（結論與每條建議的處理結果）。

**結論**：教學口吻、但書與模板轉折在綠區。問題集中在 7 句超過 60 字（L80 90 字、出處段 129 字）與 L80–90 連續六段換來源。

處理：Kristiansund 長句拆成三句；김종식、Wide Boyz 測力、今晚動作等長句依建議改寫；出處段刪除；手大小一節依論點重排成三個小節（大手小手各有尺寸／影響挑路線／什麼時候不適用）；「難易會平均」改為「難易要能平均，有個前提」；表格「疊手也變成鬆的」改「連疊手都會晃」；英文第一人稱「I haven't found」改無人稱。修後 register-scan：模板轉折 0，數字密度剩 4 段 6–8 個（皆為影片時間點與 cam 號數，保留）。


## 修改紀錄（2026-10-26，主執行緒）

post-verify 的 Contradicted／Misframed 全部照建議修正（中英同步）；Unverifiable 項依建議縮寫或改寫。post-review 🔴 全修；🟡 多數已修（尺寸表加 cam 欄、glossary 統一、研究過程段落刪除、今晚動作改成做得到的版本、內文連結補齊、練習題補題、「C 系列」改全名、tags 加 taiwan）；未做：新增 crack-climbing tag（避免新 tag，待系列多篇後再評估）、KMGA 官網連結（找不到可靠官網網址）。post-polish 長句與姓名主詞依建議改寫。修後重跑 check:tw、register-scan、check:references、check-process-leak。
