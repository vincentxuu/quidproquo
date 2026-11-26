# 研究筆記：寬裂（offwidth）、擠身縫（squeeze）、煙囪（chimney）

> 主題範圍：arm bar／chicken wing、hand stack（手手 butterfly、手拳 teacup、拳拳）、leavittation、heel-toe／foot stack（T-stack）／knee lock／calf lock、側向選擇、squeeze 的肩/髖/呼吸、煙囪背腳對撐與 stemming、寬裂裝備。
> 研究日：2026-10-26。暫存（字幕、原文、metadata）：`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/15b045f4-4588-4bdc-aa33-b878e65bd926/scratchpad/crack/offwidth/`（`subtxt/` 為帶秒數的字幕文字、`texts/` 為原文、`meta/` 為 yt-dlp JSON）。
> 已避開總論文（2026-10-18-crack-climbing-technique.md）已用過的來源：Climbing.com〈Don't Just Wing It〉與〈How to Climb Chimneys〉在總論只用到「概念」層級，本筆記改抽細節步驟；龍路（黃國維）、Noodle Line 不重複列。

## toolDegradation

| 層 | 結果 |
|---|---|
| 1 Groundlane MCP | ToolSearch 只找到 `mcp__claude_ai_groundlane__authenticate`（需要 OAuth），實際工具不可用 |
| 2 Groundlane 直接 HTTP | POST `https://groundlane.vincent-xu-work.workers.dev/mcp` → HTTP 401 |
| 3 Keenable keyless | ✅ 可用，所有搜尋都走這層 |
| 抓全文 | `curl` 直接抓；UKC（403）、outdoorprolink（403）、planetmountain（403）、reddit（被擋）改用 Exa `web_fetch_exa` |
| YouTube | `yt-dlp` 不帶 cookie 會被「Sign in to confirm you're not a bot」擋；改加 `--cookies-from-browser chrome`。要求「en」翻譯字幕會 429，改只抓原語言 `*-orig` 後成功 |

---

## 一、影片清單（全部 yt-dlp 查證 upload_date；start 秒數來自字幕（`subtxt/`）或章節）

格式：`video_id | 標題 | 頻道 | upload_date | 長度(秒) | 岩場/地點 | 人物 | 類型 | 語言 | 示範重點＋start | 查證方式`

### A. 教學片（技術拆解）

1. `rv_CnoIdo_s` | Crack Climbing: Intro To Offwidth Technique | VIDEORACLES | 2021-02-18 | 415 | Joshua Tree（加州，石英二長岩，喇叭口寬裂） | 頻道講者（男，教練型） | 教學 | 英 | 60s 手拳 stack（拇指側、掌心接岩，避免指節磨破）；90s「Indian Creek 直裂才常用 stack，Joshua Tree 多在 flare 後面，所以半身進去靠 arm bar／chicken wing」；120s arm bar 可「walk it down to my waist」、chicken wing 肘先進；150s heel-toe 站穩再移手；330s heel-toe「my favorite」、foot stack | 字幕 en-orig＋章節（141 Chicken Wing / 202 Hand Stack / 304 Leg Bar / 362 Heel Toe）
2. `HHDxEcnM1qk` | Chimneys | VIDEORACLES | 2021-02-12 | 207 | Joshua Tree | 同上 | 教學 | 英 | 0s 寬煙囪坐背推腳；40s 窄處用 scissor foot（一腳前一腳後、雙手各一側）；60s scissor flip；90s 進 squeeze「深吸氣胸口會卡住」；100s squeeze 用 arm bar＋lower leg bar，「inches of progress at a time」 | 字幕＋章節
3. `jZWEHeAMSGQ` | How to Climb OffWidths With the Wide Boyz | Josh Rundle | 2022-01-09 | 1308 | 室內木箱（英國） | Pete Whittaker 教 YouTuber Josh Rundle（初學） | 教學 | 英 | 20s「裂隙裡的部位負責把你留住，外面的部位負責把你往上推」；40s 手拳 stack 一次到位；60s knee lock（膝進去、腳拉出讓膝撐開）；140s 學員「腿太瘦膝鎖不住」→ 外側腳扭轉、身體往右靠；580s 深裂把腿「放鬆、微彎」整條插到髖再把腳拉出；260s 提醒手滑出而腳踝卡住會受傷，要有人 spot | 字幕＋章節（579 wide pony / 798 inverted foot jam）
4. `mHErzqpYKqM` | secrets from the crack cellar: HOW TO CRACK CLIMB: 5 techniques with Wide Boyz' Tom Randall | Anna Hazelnutt | 2021-09-29 | 1411 | Tom Randall 的地下室訓練裂隙（英國 Sheffield） | Tom Randall 教女性攀岩者 Anna Hazelnutt | 教學 | 英 | 183s offwidth 章：200s 手拳 stack、220s 倒掛「wide pony」；406s squeeze 章：400s「Hastonator」45° 寬裂/擠身縫；440s 內側腿盡量插深；480s「squeeze 和 45° offwidth 靠肩關節活動度，我老了肩膀轉不進去」；500–540s 學員把肩膀往上放才成功、進階是放掉一隻手 | 字幕＋章節
5. `NG9E8-8a5oA` | Sierra Blair-Coyle Battles with Offwidth Climbing | Wide Boyz | 2022-01-04 | 677 | 美國砂岩寬裂（說明欄未寫地名）＋煙囪 | Tom Randall、Mary Eden（Tradprincess，女）帶競技攀岩者 Sierra Blair-Coyle（女，第一次） | 教學＋實錄 | 英 | 63s 貼膠帶手套（先貼拇指）；109s 裝備：大號 #6「後面緊、前面寬」、cam 塞深避免踩繩；180s「內側腿把我勾進裂隙，外側腿是推、讓我站起來」；200s 選右側朝內；420s 外側腿 heel-toe；498s sidewinder 側滾擠身縫「真希望有護膝」；600s 右手高位 chicken wing | 字幕＋章節＋說明欄（列出 arm bars, heel toe cams, chicken wings, side winder squeeze chimneys）
6. `tfgUmB-6Z7g` | Climbing's Strangest Move, T-stacking | Wide Boyz | 2022-06-26 | 535 | 室內（英國） | Pete Whittaker / Tom Randall | 教學（定線實驗） | 英 | 0s 定義「腳排成 T 字，一腳橫一腳直」；20s「以前只在煙囪用過」，嘗試倒掛 T-stack；500s 結論做成「小寫 t」：腳側緣＋腳跟頂入，正規「大寫 T」做不出來 | 字幕＋章節
7. `-IX2Rd_Jyuc` | Offwidth Climbing: The Art of Knee Lock, aka how not to get stuck | mudworm | 2024-04-08 | 425 | 室內＋戶外示範（美國加州） | 一般攀岩者（男，部落客 mudworm） | 教學（反方觀點） | 英 | 60s 批評 Wide Boyz 教法「直腿塞進去再彎」是卡膝配方；90s 直腿最窄、彎曲最粗；150s 正確：先把膝彎到最尖再塞；180s 靠「大腿內側＋小腿外側」的偏移摩擦，不是靠膝骨當岩楔；255s 往上移時用脛骨側面頂住、不要直接滑膝 | 字幕＋章節＋說明欄連到部落格
8. `GFHq2HbNUIY` | Offwidth climbing: Taping technique with Pamela Shanti-Pack | Pamela Shanti-Pack | 2020-03-14 | 335 | （室內講解） | Pamela Shanti Pack（女，寬裂 FA 50+） | 教學（裝備） | 英 | 94s 保護拇指與掌根（palming／chicken wing 用）；136–185s 拇指整圈包覆（hand-fist stack 會磨）；185s 小指側長條（fist 側磨損）；263s 鎖拇指、食指與腕 | 字幕＋章節
9. `tsT72PxL3Ug` | Leavittation - stos z dłoni, klinowanie kolana | Tolipo | 2020-09-04 | 517 | 波蘭 Niesajzowa Rysa（Lama）、捷克 Údolní / Hláska（砂岩） | 波蘭攀岩者 Tolipo（男） | 教學＋失敗示範 | 波蘭語（附人工英文字幕） | 40s 自己兩年前在 crack machine 上「手 stack 跟膝鎖都對，但外側腿明顯錯了」的失敗影片；80s 寬到只能 stack 時雙臂交叉；202s 波蘭實地；260s 捷克實地；339s 訓練；375s 歷史 | 字幕 en（人工）＋章節
10. `1gK55sEB2wA` | Norway's Most Famous Offwidth Boulder | Wide Boyz | 2021-09-12 | 665 | 挪威（倒掛寬裂抱石） | Pete Whittaker、Martine Limstad（女） | 實錄＋小教學 | 英 | 402s「crack school」：butterfly stack 寬度最尷尬，要用 calf lock；420s 常見錯誤「calf lock 那條腿放得不夠高，就沒辦法把體重放上去再移 stack」 | 字幕＋章節＋說明欄
11. `I_MfYfpp0AU` | The Hardest Offwidth Climbed at our Gym | Wide Boyz | 2022-01-20 | 573 | 室內 | Tom Randall 教 Josh | 教學 | 英 | 90s chicken wing：肘「朝內朝上」，不要在裂隙口邊緣、要在最深處；120s double chicken wing；150s 煙囪 back-and-foot、手掌壓背後牆 | 字幕
12. `uvjKJe_R0xI` | Technique Hack from Offwidthing in Australia | The Wide Boyz Show | 2026-10-08 | 250 | 澳洲〈Fight Club〉 | Pete Whittaker（音訊朗讀電子報） | 教學（音訊，畫面少） | 英 | 60s double fist stack 四種擺法；120s「拇指側貼另一拳小指側」占 95%；150s 倒掛時手腕不交叉、垂直時交叉 | 字幕（與電子報文字一致，見文字來源 T12）
13. `aB-6aF8ADps` | 把身体塞进岩壁里的痛与乐——如何攀爬宽缝 | 知岩片语 Climbing Whispers | 2020-10-30 | 503 | Indian Creek（猶他，Wingate 砂岩直裂） | 邵遠（男，華人攀岩者）上 Pamela Pack 的「Art of Offwidth」課 | 教學（心得整理） | 中文（普通話，附英文字幕） | 40s「技術 50%、體能 35%、固執 10%、忍痛 5%」；60s 側身、一側手腳塞入、外側腳推；100s hand stack 雙腕交叉；120s calf lock：內側腿抬 45°、腳往內轉；140s 手拳 stack＋knee lock 可無手休息；170s arm bar＋外側手反向側拉；200s chicken wing「肘盡量朝天」；240s 寬過腳長改 foot stack；280s squeeze 四點支撐、或側躺 sidewinder；360s 保護：#4 到 #7/#8、推 cam；380s「不同體型同一條裂隙用的技術不同」 | 字幕 en（人工）＋說明欄
14. `LQh6ZRplSUo` | 世界のキタヒラに教わるワイドクラックの登り方『センチュリークラック映像公開記念』 | TAKEMOVIE | 2023-07-28 | 1151 | 日本・瑞牆（花崗岩）抱石〈ピカソ〉（約 130° 寬裂，腳先行） | 北平（挑戰 Century Crack 的日本寬裂攀岩者）教頻道主竹森 | 教學 | 日 | 210s「瑞牆指南 600 條路線裡 200 條是寬裂」；330s 裝備：厚牛仔褲、長袖、肘護墊；360s 用膠帶把褲管固定在腳踝（褲子上縮會卡膝）；390s 寬裂鞋要鞋面包膠、鞋跟硬；480s 手拳 leavittation，再寬改拳拳；540s chicken wing 放手休息；570s 腳 stack 時「拇趾側＋腳跟外側」受力、膝外開（ガニ股）更穩，Century Crack 的 wide pony 手放兩膝之間；870s 選邊：手掌要壓在「突出那一面」，所以左側朝內比右側朝內好用 | 字幕 ja-orig
15. `WdjE2QRmyHw` | Primera vez en LA BATALLA DE LAS MARIPOSAS | Como empotrar, disfrutar y sufrir en un off width | Escalajipi | 2023-04-27 | 519 | 智利 Cochamó（花崗岩），〈La Batalla de las Mariposas〉第 3 段約 50 m 寬裂 | 頻道主帶第一次爬寬裂的女性友人「la Jojo」 | 教學＋實錄 | 西班牙語 | 120s 手臂反折塞入、左腿抬到髖高把膝放進去並扭轉；140s 外側腳在板面上「像青蛙」；160s 右手在外面往外推、「外側腳要用好，不要拖著」；180s「感覺移動了 400 公里，其實只動了 1 公分」 | 字幕 es-orig
16a. `W2tclY5bEFA` | Comp Climbers VS. Offwidth Foot Technique, Ft. Ondra & Schubert | Wide Boyz | 2021-07-11 | 958 | IFSC 鹽湖城世界盃決賽畫面評析 | Pete/Tom 評 Ondra、Schubert 等競技選手 | 教學（評析） | 英 | 200s 第二次「把腳跟確實插進去」才成功；700–760s「heel first, then toe」、選手本能「toe first」是錯；580s 選手做出腳版 butterfly foot stack | 字幕＋章節
16. `tOBUoORmvVs` | 산녀니 암벽등반 도전 3-2탄｜크랙등반과 침니등반 제대로 해보자고! | 산녀(山女) TV | 2022-12-20 | 1041 | 韓國首爾道峰山（花崗岩） | 師父帶女性初學者산녀니 | 教學＋實錄 | 韓 | 379s 師父講解問題與 jamming；390s「扭轉卡住就不會滑，只是會痛」；698s 師父示範裂隙＋煙囪；707s「煙囪技術是什麼」章節；745s 學員上煙囪 | 章節＋字幕 ko-orig（自動字幕品質差，只能確認 390s 的扭轉講解）

### B. 攀爬實錄（能看清技巧）

17. `SMRAl_0RamE` | Girls Gone Wide - Offwidth Climbing in Vedauwoo Wyoming | Kaya Lindsay | 2021-09-13 | 1825 | Vedauwoo（懷俄明，粗顆粒花崗岩） | Kaya Lindsay、Mary Eden（女），Tom Randall 受訪 | 實錄＋心得 | 英 | 160s Kaya「我手很小、沒 Mary 強，arm bar 撐不久」→ 改右側朝內；240s 用力「karate kick」＋下方 heel-toe 可無手；360s「Off-width techniques」章；420s 戴護膝、440s 第一次卡膝硬拔「把皮整片扯掉」；500s「大家低估 Mary，因為她小」；680s Tom Randall：「每種寬度都有適合的體型：大個子塞不進髖和肩，小個子整個人進去變煙囪；但小個子在很喇叭的裂隙搆不到深處的拳」 | 字幕＋23 章節
18. `1tZvvjZ84PU` | Girl's Gone Wide 2: Screaming Sky Crack | Tradprincess | 2022-07-20 | 925 | 大峽谷內塔（砂岩，多繩距） | Mary Eden、Kaya Lindsay（女） | 實錄（冒險） | 英 | 395s 上頭牆；440s 「怪異的 pod：可以塞膝、有好的 pod hand jam」 | 字幕＋章節（技術畫面較少）
19. `spXuF64bsWg` | The Price Of Evil Desert Offwidth | Tradprincess | 2023-08-15 | 994 | Indian Creek〈The Price of Evil〉5.13 | Mary Eden（女） | 實錄 | 英 | 202s crux；524s 攀爬畫面；540s 把膠帶手套直接留在手上反覆用；940s 「整趟 offwidth 巡迴的 heel-toe 讓鞋子都快解體」 | 字幕＋章節
20. `AJdRfTc1HD4` | Climbing MOST NOTORIOUS Offwidth In A New Style, TradPrincess, Belly Full of Bad Berries | Spencer McKay | 2023-01-20 | 714 | Indian Creek〈Belly Full of Bad Berries〉5.13 | Mary Eden（女） | 實錄 | 英 | 全片：不倒掛、手在腳上方 straight-in，靠 calf lock 把腿抬到腰以上當「第二雙手」 | 說明欄＋Gripped 報導（T27）
21. `b58xJp4ki8w` | She Uses Her HEAD To Climb...Literally. Tradprincess & The Hondo Off Width Day 1 | Giant Rock | 2022-09-19 | 1378 | Joshua Tree〈Earle Struggs〉 | Mary Eden（女） | 實錄 | 英 | 440s「對小個子比較難——腳小」；660s「我肩膀寬，一直被推出來」；700s 學 Danny Parker 把 gear 塞深；1160–1200s「stack、arm bar、head jam」 | 字幕＋章節
22. `O6TPz1eMg-0` | The Off-width crux of Fear and Loathing? - A primer in the style | FirstPersonBeta | 2023-03-30 | 861 | Red Rock（內華達，砂岩）〈Plumber's Crack〉 | 一般攀岩者（男，頭戴視角） | 實錄＋解說 | 英 | 340s butterfly stack 不夠用改用腿；360s「背靠微突出的那一側」；380s「關鍵是把髖放進去，左腳永遠先、左肩朝內」；520s 寬到能 chicken wing（手指朝下）；560s 變 squeeze；620s 一側變寬就換邊；640–680s 煙囪「膝到腳跟之間撐住」、肩卡兩手之間 | 字幕＋章節＋說明欄 MP 連結（查得 Southern Nevada）
23. `UvyAJNwjckc` | Yosemite Rock Climbing - Mental Block 5.10c - Offwidth Adventure | The Gravity Lab - Brant Hysell | 2021-11-05 | 1170 | Yosemite（花崗岩）〈Mental Block〉5.10c | 一般攀岩者三人（第一次來 Yosemite 的朋友） | 實錄 | 英 | 138s 進 Mental Block；840s「第一個穩的 knee bar」 | 章節＋字幕
24. `jyvyJKIzyes` | The Green Room - First Ascent of a Horizontal 5.13 Squeeze | Wide Boyz | 2021-05-23 | 1018 | 挪威 Rogaland（Sirdal） | Tom Randall、Jørn Nagel 等 | 實錄 | 英 | 180s 第二段從煙囪鑽到後方、flaring squeeze；280s「pleasure box」整個身體在裡面；720s 一人 layback 後高腳轉進 chicken wing，另一人倒掛踢腳再 pivot | 字幕＋章節
25. `e5aiDSdc9yE` | Offwidth Battle! - Melvin Bragg V8 | Climbing Nomads | 2022-05-03 | 817 | 英國 Peak District Ramshaw（gritstone） | 一般/業餘攀岩者（男） | 實錄 | 英 | 40s 戴 crack gloves、護膝；90s flash 嘗試；480s 「進 chicken wing」 | 字幕＋章節＋說明欄
26. `-E1hwhUDsXU` | How to be a Crack Master | Wide Boyz | 2022-08-14 | 1014 | 英國 Ramshaw Rocks（gritstone）〈Cracker's Dozen〉清單 | Wide Boyz | 實錄（由易到難） | 英 | 章節：201 Great Zawn HVS「wide, committing」/ 617 Ramshaw Crack E4 / 908 Melvin Bragg V8 | 章節＋說明欄（Roaches 指南的清單）；字幕技術描述少
27. `gmURk8d0vTU` | We Climbed The World's Hardest Offwidth Crack | Wide Boyz | 2025-11-18 | 1368 | （〈Autobahn〉，影片稱世界最難寬裂） | Tom Randall、Mari Salvesen（女） | 實錄 | 英 | 40s 在家做一段複製品訓練；200s 大量鎂粉；240s 長袖 | 字幕＋章節
28. `-nIQr0pfdlE` | How We Trained For The World's Hardest Offwidth Climb | Wide Boyz | 2020-11-01 | 1046 | 地下室訓練器 | Tom Randall | 訓練 | 英 | 140s 手拳 stack 掌心對自己、累了換手；279s double fist；398s Hastonator：「寬到 double fist 也不行，就是 chicken wing／arm bar 的範圍」、懸吊＋外側手負重 | 字幕＋章節
29. `6R4CoWvIN8c` | VOO OFF-WIDTH ROOF CLIMBING BURL-FESTS VEDAUWOO WYOMING | Cedar Wright | 2025-11-27 | 303 | Vedauwoo〈Squat〉5.12a 倒掛屋簷 | Cedar Wright、Nellie（女） | 實錄 | 英 | 140s「只有 35 呎卻像在爬大岩壁」；180s 從 5.9 煙囪起步；240s 「右腳 heel-toe」 | 字幕＋章節
30. `MGsVtzhxSsw` | New Climb! Squeeze Chimney First Ascent - Climbing in Cochise Stronghold, AZ | Molly Ohm | 2026-05-18 | 602 | 亞利桑那 Cochise Stronghold（花崗岩） | Molly Ohm（女，頭戴視角首攀） | 實錄 | 英 | 85s 放第一顆 #6；227s 試放最大的 cam；320s「找到能轉頭的位置」；360s 猶豫要騎稜還是繼續煙囪 | 字幕＋說明欄章節
31. `qGjhzcwRRU4` | Off-Width Crack Climbing: No Way OUT! | Climbing Daily Ep.1985 | EpicTV Climbing Daily | 2022-04-14 | 448 | 義大利薩丁尼亞（花崗岩） | Vibram 運動員，傳攀新手與老手混合 | 實錄 | 英 | 180s「你的手比我大一點」比手；380s「從沒爬過全身塞的裂隙，超累又痛，兩人膝蓋都流血」 | 字幕＋說明欄
32. `kchZm510gLU` | 瑞牆山ワイドクラックをめぐる旅（皇后5.11b、カーテンコール5.12a） | TAKEMOVIE | 2021-11-09 | 825 | 日本瑞牆（花崗岩） | 竹森（男） | 實錄 | 日 | 30s 自己在小川山開了一條寬裂、不知道怎麼給分，所以來瑞牆試；360s 帶 #5、#6 與手掌尺寸 cam | 字幕 ja-orig＋章節
33. `ygbuT3nAHps` | 2024.12.1 城ケ崎海岸、フナムシロックエリア、ネッシー5.8 奮闘のワイド | 超デスクワーカーの山行冒険記 | 2024-12-03 | 284 | 日本伊豆城ヶ崎（海岸玄武岩/安山岩柱狀節理） | 一般攀岩者＋前輩 | 實錄 | 日 | 180s 前輩：「背中を使ってない」（沒用背）；210s「寬裂先想辦法停住——能 stack 停住就代表姿勢對了，Big Rock 的箱型煙囪也一樣，先停住最重要」 | 字幕 ja-orig
34. `crQfPwXPaKQ` | 小川山 小指岩 ダイヤモンド・ヴァージン 5.9 ワイドクラック | 5Gクライミング | 2026-07-19 | 409 | 日本小川山（花崗岩） | 一般攀岩者（兩人） | 實錄 | 日 | 0s 討論最後變成右側朝內「看個人喜好」；120s 鬆的 cam 先放再說；180s「之後都是同樣的動作，地獄」「腳先卡好、也利用右邊牆」 | 字幕 ja-orig
35. `KSihyAbQFWY` | 小川山 烏帽子岩左稜線 5.8チムニー 最終ピッチ | めざせ500イレブン+ | 2026-08-06 | 304 | 日本小川山（花崗岩，多繩距） | 一般攀岩者（168 cm） | 實錄 | 日 | 說明欄：先上大 chockstone、進到底再選左右向；先朝右（右壁斷處可放腳休息、好放 cam）；煙囪內有 #2–#4 能放的裂隙；上部變窄要確實 back-and-foot；煙囪略左傾所以改朝左 | 說明欄（無字幕）
36. `GyCnrlUncYc` | Vedauwoo - Nautilus - Bat Guano Crack 5.11- RP | The Climb | 2024-07-13 | 1084 | Vedauwoo | 日本攀岩者（頻道 The Climb） | 實錄 | 日文說明 | 說明欄 move memo：第一屋簷「腳往外撐、右手拳或右手 arm bar 壓住、身體塞進去」；第二屋簷「右腳 heel-toe、右肩往外頂、左腳撐開讓手休息（寬裂技術！好玩）」 | 說明欄
37. `YyXNHneDvg4` | 용화산 오프위드456 크랙등반스케치 | 바위타는은설 | 2023-06-20 | 1566 | 韓國春川龍華山（花崗岩，韓國裂隙聖地） | 韓國一般攀岩者群組 | 實錄 | 韓 | 540s「用 cam 推著爬也不容易」；960–990s 現場小教學：「用腳夾大腿或塞膝撐住、手一點一點往上、左腳推、右腳要進裂隙」 | 字幕 ko-orig＋章節
38. `vqeV58rXxXU` | 울산바위 번개길 오프위드 크랙의 진수를 맛보다! | 권코몽클라이밍tv | 2026-09-20 | 1824 | 韓國雪嶽山蔚山岩（花崗岩，多繩距） | 嘉泉大學山岳社學生 | 實錄 | 韓 | 90s「接近時短袖短褲，爬的時候一定要長袖長褲，不然非常痛」；120s「別穿貴的衣服，會被撕破，最推薦學長給的舊衣服」；360s 煙囪「岩石滑，背靠牆的姿勢不安心，乾脆整個人往裡面進去慢慢蹭」、runout 長要多放 cam；510s 手臂磨破 | 字幕 ko-orig
39. `L-RSqT9MjnY` | Mississippi Chimney - Trad Climbing - Stanage Popular - Peak District | Up and Around | 2024-11-20 | 428 | 英國 Stanage（gritstone）VD | 60/70 歲兄弟 | 實錄（一般攀岩者、年長） | 英（無字幕） | 全片：低難度 gritstone 煙囪 | 說明欄
40. `RYP0f7tQNM0` | Vedauwoo Off-Width - Easy Jam 5.4 25 Aug 24 | Ian Riley | 2024-08-25 | 1038 | Vedauwoo | 一般攀岩者 | 實錄 | 無口白 | 低難度寬裂入門路線 | 標題／upload_date（說明欄空白、無字幕；**只能當「入門路線長什麼樣」參考，不可引用技術**）
41. `pfJtNk3SD-E` | 관악산 산바우암장에서 침니에 몸 끼어볼래? | Santa Minji | 2020-09-29 | 795 | 韓國首爾冠岳山 산바우岩場（煙囪） | 女性攀岩者 Santa Minji | 實錄 | 韓 | 說明欄：裂隙運動路線為主、也有煙囪 | 說明欄（自動字幕品質太差，無法定位秒數）

### C. 排除 / 降級

- 2020 前（教學原理可參考、不列入心得影片）：Wild Country Crack School Ep.4（`-XvR4PkzMPA`，2012）、Crack Climbing 101 Ep5/6（2018）、Magnus × Wide Boyz（2019）、Offwidth Vocabulary（2019）、Boogie Til You Poop（`1dJLN43G6KA`，2010，Squamish 卡膝名場面）、Generator Crack 各 TR（2010/2014/2016）、Pamela Pack Hardliners（2015）、チビゴジラ leavittation（2014）。
- 2020+ 但無字幕/說明欄可依據：`5JoCKYA88R8`（小川山夏風，字幕只有 [Music]）、`S_z-23eBZQ4`（Squamish Hypertension 2025）、`GHdQv0rJD2w`（Yosemite wide 2023）、`D-OTsoLVAxs`（Randy Leavitt 本人示範 leavittation，2025-05-29，**無字幕無說明，值得人工看**）、`8sbTKMfNenI`（Sanity Assassin 2026，說明欄只說 chicken wing＋thigh jam）、`ZqdKzB8wS9w`（蔚山岩 온새미로 煙囪 10a，2026）、`sOnEopCh8PM`（仁壽峰附近露積峰 T 煙囪，2020）、`jv4Fs9zKuCQ`（谷川岳變形チムニー 2020）、`YpAu8PgvKzc`（城ヶ崎かんのんクラック 2022，章節說上部 flare 寬段難）。
- `uvjKJe_R0xI` 畫面為音訊朗讀，列教學但標「畫面少」。

---

## 二、文字來源（✅讀全文／🟡只讀摘要或截斷／⚪確認無公開全文）

| # | 來源 | 作者/類型 | 日期 | 狀態 | 關鍵原文短句 |
|---|---|---|---|---|---|
| T1 | [Wild Country Crack School Part 4 – Offwidth（UKC）](https://www.ukclimbing.com/articles/skills/series/wild_country_crack_school/part_4_-_offwidth_cracks-4669) | Wide Boyz（Exa 抓全文） | 2012-05-22 | ✅ | arm bar「the elbow should press hard…if it's not slightly painful, then you're not doing it quite right」「keep the arm bar at below shoulder level」；chicken wing「mainly used as a resting aid」；「Hand stacking…you'll only find this of real use once you climb routes of E3 and above」；外側腳「jam your outside foot in a "heel-toe"…If an offwidth feels hard…it's almost certainly because of your outside foot」；服裝「Corduroys, jeans, fleeces and cotton」；「stiff-soled boots…hi-tops」 |
| T2 | [Don't Just Wing It（Climbing.com）](https://www.climbing.com/skills/dont-just-wing-it/) | Matt Kuehl | 2013-08-05 | ✅ | heel-toe「toe on one side and your heel on the other」；arm bar「palm against one side…thumbs-up, and your elbow against the other」「works best on vertical terrain」；chicken wing「hand pointing toward your face, and palm facing out…can stress your shoulder on steep terrain」；hand stacks「as a crack becomes wider, the stacks become less secure」；butterfly「backs of your hands together…thumbs up」；手拳「more secure to cross your arms at the wrists」；拳拳「Don't move your fists as you pull down」；裝備「canvas pants, a long-sleeve shirt, and some comfortable hightop shoes」 |
| T3 | [How to Climb Chimneys（Climbing.com）](https://www.climbing.com/skills/technique/how-to-climb-chimneys/) | 訪 Rob Pizem | 2024-04-16 | ✅ | squeeze「Remove any bulky gear…clip it to your belay loop so it hangs down」「If the crack gets tighter as it goes deeper, put your dominant hand inside」；中寬「Back on one side, knees pushing into the other…palms—fingers pointing down…kept low」；寬煙囪 stem「Most people slip because they are pushing down when the holds actually require them to push out」；休息「inhale to lodge your chest in place」 |
| T4 | [Sidewinder（Climbing.com）](https://www.climbing.com/skills/sidewinder/) | Craig Luebben（BigBro 發明人） | 2012-06-15 | ✅ | 反證 T-stack：「Many how-to books show a "T-stack"…I've never gotten much mileage out of this technique because the leg position feels awkward, and my knees get in the way」；sidewinder：上臂 chicken wing 肘朝上、下臂肘朝下，「rotate your upper hip into the front wall, and your lower buttock against the back wall」「both of your knees against the front wall…heels against the back wall」；可換邊分散磨損 |
| T5 | [The Calf Lock（Climbing.com）](https://www.climbing.com/skills/the-calf-lock/) | Pamela Pack | 2012-07-25 | ✅ | 「just bigger than your fists but too small for your knees. For most people, this means a four-inch crack…requires the hand/hand ("butterfly") stack」；步驟「Move one foot up…to about waist height…rotate your high foot toward your big toe」；「best practiced on toprope」；「Tape the cuffs of your pants to your ankles」 |
| T6 | [Learn This: Invert Offwidth Techniques（Climbing.com）](https://www.climbing.com/skills/learn-this-invert-offwidth-technique/) | Pamela Shanti Pack | 2016-09-08 | ✅ | 「Invert offwidth climbing is a progression of Leavittation」；「stack the hand or fist of the leading leg on the back wall to provide maximum room for shoulder rotation」；pivot「The most common mistake…is to sit up…Focus on getting your hips up first」；wide pony 由 Wide Boyz 命名「It's like riding a pony [upside down]」 |
| T7 | [Learn This: Offwidth Protection Primer（Climbing.com）](https://www.climbing.com/skills/learn-this-offwidth-protection-primer/) | Pamela Pack | 2016-04-18 | ✅ | 「Pinning the rope behind a knee is quite common」「Place gear deep inside the crack」；推 cam「push two cams, so one acts as a backup」；喊「Bumping!」；「Big Bros are also the only method for protecting squeeze chimneys, unless you own a 12" Valley Giant」 |
| T8 | [Leavittation – the origins of hand-stacking](https://dirtbagdispatches.com/2018/01/10/leavittation-the-origins-of-hand-stacking/) | Derek Cheng 訪 Randy Leavitt | 2018-01-10 | ✅ | 起源：1977 洛杉磯 Wells Fargo 停車場屋簷裂隙；「The perfect leavittation crack is basically whatever your knee size is. For me, it's like a hand-fist」；「it is a common misconception to say that leavittation is about inverting. It was really about stacking」 |
| T9 | [Offwidth Tips for Beginners](https://blog.outdoorprolink.com/offwidth-tips-for-beginners) | Kaya Lindsay（Exa） | 2021-09-10 | ✅ | 「offwidth is 75% technique, and 25% endurance…the technique varies so wildly between body sizes. For me, number four sized cracks are calf locks and baggy fists, but for a different body type, fours might be calf locks and butterfly stacks」；「Often this means ignoring your friends shouting beta at you from below!」；穿 cycling sleeves、leggings、煙囪加護膝；「you'll want to bump two cams」；「keep a tight belay」；「Typical offwidth belays are about one hour long」 |
| T10 | [I struggled with offwidths, until I fixed this!](https://wideboyz.school/newsletters/newsletter-archive/posts/i-struggled-with-offwidths-until-i-fixed-this) | Pete Whittaker 電子報 | 未標日期（網頁無日期） | ✅ | 「the correct body position (side-on), and the correct insertion of the foot into the crack (heel first, then toe)」；「hold with the inside, push/pull with the outside」 |
| T11 | [The #1 reason you're thrutching on offwidths](https://wideboyz.school/newsletters/newsletter-archive/posts/the-1-reason-you-re-thrutching-on-offwidths) | Pete Whittaker | 未標日期 | ✅ | 外側腳「insert your heel into the crack first…The important thing to remember is that the heel should sit slightly deeper inside the crack than the toes」；錯誤「Going toe-first…indicates…your body positioning is wrong」「Pointing your toes too far down」 |
| T12 | [I Stopped Fearing Offwidths. This Is How.](https://wideboyz.school/newsletters/newsletter-archive/posts/i-stopped-fearing-offwidths-this-is-how) | Pete Whittaker | 未標日期 | ✅ | 「Inside Arm & Inside Leg…80-90% holding」「Outside Hand…50-60% holding and 40-50% pulling」「Outside Leg…90% of the pushing」；「try and stay side-on…only…front-on if there are some seriously bomber face or foot holds」 |
| T13 | [Technique Hack from Offwidthing in Australia](https://wideboyz.school/newsletters/newsletter-archive/posts/technique-hack-from-offwidthing-in-australia) | Pete Whittaker | 對應影片 2026-10-08 | ✅ | double fist「thumb side of one fist meets the pinkie side of the other…roughly 95%」；「Uncrossed Wrists: Ideal when you are hanging inverted」「Crossed Wrists: Ideal on vertical」 |
| T14 | [What Santa Taught Me About Chimneys](https://wideboyz.school/newsletters/newsletter-archive/posts/what-santa-taught-me-about-chimneys) | Pete Whittaker | 未標日期 | ✅ | squeeze 常見錯誤「Take a deep breath and then try to move…increases the width of the chest」；「Breath in when stationary…Breath out when you want to move up」 |
| T15 | [I answered your burning questions](https://wideboyz.school/newsletters/newsletter-archive/posts/i-answered-your-burning-questions) | Pete Whittaker | 未標日期 | ✅ | 「cover up before you start crack climbing and not after」；「tape down the ankles of your trousers, use ankle protectors and neoprene elbow/knee pads under your clothes」；「if you are covered in bruises…it generally means that technique has started to fail」 |
| T16 | [Offwidths – How do I choose which side goes in?（MP）](https://www.mountainproject.com/forum/topic/116716338/offwidths-how-do-i-choose-which-side-goes-in) | 論壇 | 2019-04-09 | ✅ | 正反意見：「face the side that has more holds and is lower angle」vs.「Opposite. You want your back on the lower angle side and your feet on the more featured…steeper side」；「a leaning offwidth facing down, and a leaning chimney facing up」 |
| T17 | [Resources for little hands and crack climbing?（MP）](https://www.mountainproject.com/forum/topic/126442328/resources-for-little-hands-and-crack-climbing) | 論壇 | 2024-06-27 | ✅ | 「My perfect hands are a BD #2 but hers are a 0.75…'easy' crack climbs…they're offwidths for her」；「Look for 5.11- rated climbs in the creek. They'll likely be 5.9 for her」 |
| T18 | [Switching sides in a tight arm bar offwidth（MP）](https://www.mountainproject.com/forum/topic/200435725/switching-sides-in-a-tight-arm-bar-offwidth) | 論壇（Santa Cruz Pacific Edge 岩館寬裂） | 2025-01-28 | ✅ | 「Changing corners is one of the hardest moves to do in OW climbing」；「have you tried to pop out into a lieback for a few moves then re-establish」；「Drive in the heel, drag in the toes」 |
| T19 | [How do you climb a chimney that narrows to an offwidth?（MP）](https://www.mountainproject.com/forum/topic/203446974/how-do-you-climb-a-chimney-that-narrows-to-an-offwidth) | 論壇 | 2026-07-17 | ✅ | 「rotate to facing inwards…This rotation is often the crux」；「Go horizontal…You're fighting for inches, not big movements」；「If footstacks are not in your tool bucket, acquire it…inside leg knee locks, toe/heeling, foot stacking, knee/heeling」 |
| T20 | [Offwidth foot work（MP）](https://www.mountainproject.com/forum/topic/108786024/offwidth-foot-work) | 論壇 | 2014-03-27 | ✅ | 「In theory you can use foot stacks like a "T", but in practice they don't seem to work well except for occasional rests」；「a totally bent leg widens your thigh muscles that are right above your knee」；「make short movements, like an inch at a time」 |
| T21 | [Tips for offwidth（MP）](https://www.mountainproject.com/forum/topic/123670209/tips-for-offwidth) | 論壇 | 2023-01-18 | ✅ | 「thin compression kneepads…best placed over your shins for #4's and just above your kneecaps for chimneys」；「Your outside leg is often your pusher…your inside leg is your locker」；「learn old-school armbar/chickenwing/heeltoe…don't get caught up in Leavittation stacking too soon」 |
| T22 | [Off width/knee bar kneepads and elbowpads（MP）](https://www.mountainproject.com/forum/topic/114651917/off-widthknee-bar-kneepads-and-elbowpads-any-recs) | 論壇（Vedauwoo） | 2018-07-23 | ✅ | 「the ones with the plastic covers are slick」；「neoprene pads under the blue jeans」；「Size elbow pads large to fit over triceps. Size knee pads small to avoid rolling」 |
| T23 | [Which Techniques Do You Use for Offwidth Pods?（MP）](https://www.mountainproject.com/forum/topic/126243160/which-techniques-do-you-use-for-offwidth-pods) | 論壇（Indian Creek） | 2024-05-27 | ✅ | 「The #6 size is key. Really learn how to heel-toe well (it's all about hip external rotation with the outside leg)」；「Learn how to switch sides once in the pod」 |
| T24 | [Troubleshooting offwidths: how to make upward progress?（MP）](https://www.mountainproject.com/forum/topic/202036482/troubleshooting-offwidths-how-to-make-upward-progress) | 論壇 | 2025-11-06 | ✅ | 「Moving up an inch or two in a calf lock or hand stack crack is normal」；「Scrap the hand stacking on those. You will get better at using your feet」；「In straight on Levittation stacking cracks you might not have an inside arm/outside arm」 |
| T25 | [Offwidths... are not chimneys!（MP）](https://www.mountainproject.com/forum/topic/106716947/offwidths-are-not-chimneys) | 論壇 | 2010-04-01 | ✅ | 定義爭議：「size does matter, if you (yoga types) are small enough to chickenwing then it's not an offwidth for you」 |
| T26 | [How to Avoid Getting Your Knee Stuck While Crack Climbing（Climbing.com）](https://www.climbing.com/skills/trad-climbing/how-to-avoid-getting-your-knee-stuck-crack-climbing/) | Sam MacIlwaine（女，自己卡過 1.5 小時） | 2026-09-23 | ✅ | 「Straightening your leg in an offwidth is a surefire way to get your knee stuck」「never fully straighten it…ideally not more than a 120-degree angle」「keep your leg bent at all times, ensuring that your thigh always stays wider than the knee cap」 |
| T27 | [Mary Eden Sends Famous 5.13 Offwidth Using New Style（Gripped）](https://gripped.com/video/mary-eden-aka-tradprincess-sends-famous-5-13-offwidth-using-new-style) | 報導 | 2023-01-21 | ✅ | 「she climbed the crack straight-in, with her hands above her feet」「treats her foot and calf as if it were an additional set of hands」 |
| T28 | [Prescription—Knee Stuck in Crack（AAC）](https://americanalpineclub.org/news/2025/3/12/prescriptionknee) | AAC 事故報告 | 2025-03-13 | ✅ | 「every year we publish at least one report of a climber getting their knee stuck」；Sedona 5.7 首次戶外者「alpine knee」滑進 4 吋裂隙，SAR 一小時以上才救出 |
| T29 | [So You Got Your Knee Stuck](https://climbingzine.com/so-you-got-your-knee-stuck-by-kaya-lindsay/) | Kaya Lindsay（The Climbing Zine） | 2026-10-17 | ✅ | 救援：「build himself an anchor and go indirect」、剪開牛仔褲、往「進去的反方向」退；自己在 Moab 擠身縫「breathing out as I make a move and breathing in to hold myself」後髖部卡住 |
| T30 | [The Art of Knee Lock（部落格）](https://mxi2000.net/mudworm/2024/04/offwidth-climbing-the-art-of-knee-lock) | mudworm | 2024-04 | ✅ | 反對 Wide Boyz 推薦牛仔褲：「they add just a little more risk of getting the knee stuck」；推 cam 也不要「blindly slide that cam up」 |
| T31 | [Jenny "Lemonpie" Fischer – Offwidth Obsession（FrictionLabs）](https://frictionlabs.de/blog/jenny-lemonpie-offwidth-obsession) | 女性攀岩者訪談 | 未標（網頁無日期） | ✅ | 「I highly recommend offwith bouldering as a learning medium」「make sure you have GOOD spotters, getting a foot stuck can be dangerous」「stacks, which are essentially a hand or fist jam on your own hand or fist」 |
| T32 | [Climbing the Wide with Pride: The Freschl Special（Touchstone）](https://touchstoneclimbing.com/climbing-the-wide-with-pride-the-freschl-special) | Christina Freschl（女） | 2014-08-19 | ✅（2020 前，只用裝備原理） | 「two pairs, one for squeeze chimneys (volleyball ones with a hard pad) and thinner, tighter ones, for the cracks between 5-6 inches. Be warned, don't wear these in #4 cracks…your knee will get stuck」 |
| T33 | [Far and Wide – Offwidths Around the World（UKC）](https://www.ukclimbing.com/articles/features/far_and_wide_-_offwidths_around_the_world-12833) | Stu Bradbury（近 60 歲） | 2020-06-18 | 🟡（Exa 7000 字截斷，前半為心得） | 「Grit teaches you to trust your feet to friction…AND…if you let it, it will teach you to jam!」 |
| T34 | [A Masochist's Tour of Cornwall's Offwidths（UKC）](https://www.ukclimbing.com/articles/destinations/a_masochists_tour_of_cornwalls_offwidths-11875) | Stu Bradbury | 2019-05-02 | 🟡（截斷；2020 前，只取原理） | 引 Craig Luebben「An offwidth requires more effort per inch of stone than any other type of climbing」；「Gritstone is a great medium to hone these types of skills」 |
| T35 | [Most difficult fat offwidths/chimneys on grit?（UKC 論壇）](https://www.ukclimbing.com/forums/rock_talk/most_difficult_fat_offwidthschimneys_on_grit-697358) | 論壇 | 2018-12-14 | ✅ | gritstone 寬裂清單：Goliath E4、Blue Light's Crack、Ramshaw Crack、Brimham〈Dirty Dozen〉「super safe with a size 6」 |
| T36 | [Best Offwidths in North America（Climbing.com）](https://www.climbing.com/travel/best-offwidths-in-north-america/) | 編輯部 | 2022-04-11 | ✅ | Chrysler Crack「Forgo the laybacking and employ arm-bars and heel-toe cams」；Steph Davis：「from fist jamming to a couple of hand stacks…then transition to a squeeze move」 |
| T37 | [「ワイドクラックも、特別なものではない」と考える（石田登山塾日誌）](https://ishidatozanjukunisshi.blogspot.com/2025/06/blog-post_25.html) | 日本嚮導 石田 | 2025-06-25 | ✅ | 反對用頂繩學寬裂：「トップロープでのワイドムーヴ学習は、どうしても雑になります」；「垂直以下のチムニーは、クライムダウン敗退が容易」；「アームロックやニーロックなど…ボルダーまたはリードルートの出だしでの反復練習がオススメ」；原則「足の移動時は壁から身体を離す、手の移動時は壁に腰を入れる」 |
| T38 | [What is ワイドクラック??（PUMP）](https://store.pump-climbing.com/news/354.html) | PUMP 店員 | 2024-06-17 | ✅ | ニーロック／レッグバー：「膝を曲げて、少し力を入れると…太ももがふくらみます」；arm bar「チキンウィングよりも推進力が強い」；常用「バタフライジャム…ハンドフィストのリービテーション」 |
| T39 | [クライミング講習とワイドクラック講習](https://uobmm.exblog.jp/28908479/) | 日本嚮導部落格 | 2021-10-06 | ✅ | 「少し体の厚みがちがうだけで、スクイーズチムニーがすごく難しくなったり、同じTスタックでも人によって左右の足の組み方が異なったり」 |
| T40 | [【瑞牆】ワイドクラック體驗](https://kiisampo.com/mizugaki-wide-mateniwa-mattan/) | 日本一般攀岩者（男，初體驗） | 2025-08-30 攀爬 | ✅ | 「僕は足をスタックさせようとシューズの角度ばかり気にしていたが、もっと体全体を回転させることが重要らしい」；寬煙囪 back & foot |
| T41 | [小川山のおすすめワイドクラック（カラファテ）](https://calafate.co.jp/shop/pg/1widecrack1/) | 店家 | 未標 | ✅ | 「こぶしの小さいクライマーにはグレードよりも難しく感じるワイドクラック」；squeeze→chimney 的入門線 |
| T42 | [ワイドクラックの登り方（ASAI Nature Climbing, note）](https://note.com/39climbing/n/n572002578424) | 日本嚮導 | 2025-08-10 | ⚪（curl 與 Exa 都只拿到前言，其後為付費/JS 載入） | 只用前言：「ハンド&フィストリービテーションを使うサイズからがワイド」「チムニーは…廊下の両側の壁に手足を突っ張り」 |
| T43 | [크랙등반과 째밍기술 용어정리](https://blog.naver.com/PostView.naver?blogId=wooltraveler&logNo=222656083847) | 韓國一般攀岩者 | 2021-05-11 | ✅ | 「누군가에겐 피스트째밍이 되지만 누군가에겐 오프위드 크랙일 수 있다」；寬裂/煙囪穿長袖長褲「비싼 옷은 입지 말자」 |
| T44 | ['스퀴즈 침니' 쉽게 등반하기](https://kjcjkj.tistory.com/15714467) | 韓文轉載 Luebben〈Sidewinder〉 | 2026-03 轉載 | ✅ | 同 T4（韓文版），證明此技巧在韓國社群流傳 |
| T45 | [반침니 (Offwidth) 등반요령](https://ami41.tistory.com/504) | 韓文（譯自美國寬裂文章） | 2013/2015 | ✅（2020 前，只取裝備） | 「어려운 어프위드에서는…스와미 벨트」；「몸의 왼쪽을 써서 오르느냐 오른쪽…미리 생각해야」（決定哪側朝內後整理裝備） |
| T46 | [크랙 등반을 잘하는 비결? 지금 당장 재밍하라!（月刊山）](http://san.chosun.com/news/articleView.html?idxno=11322) | 韓國傳攀節講座 | 2017-11-13 | ✅（2020 前，只取原理） | 「몸에 맞아 떨어지지 않는 크랙(링락, 오프위드)…신체 겹치기 기술」 |
| T47 | [Offwidth climbing in Seattle](http://websterart.com/wordpress/2024/02/offwidth-climbing-in-seattle) | 一般攀岩者（大手） | 2024-02 | ✅ | 小手大手對比：「My friend with small hands really struggled with these two number 3 cracks. She had to do elbow jams or shaky butterfly jams」；#5 岩館裂隙「left leg in up to the thigh…toe-knee bar」 |
| T48 | [Off width cracks（IMGA 百科）](https://wiki.imga.org.il/?title=Off_width_cracks) | 以色列登山百科 | 未標 | ✅ | 「decide in advance which side of your body you want in, because once you start, it might b impossible to swich sides」「not to go too deep into the crack」 |

已關閉說明：T33/T34 是 2019–2020 心得，截斷部分非技術內容，不另找；T42 已試 curl＋Exa，判 ⚪（付費牆後無公開全文）。UKC 與 reddit `r/tradclimbing` 的護膝串（Keenable 找到但 reddit 擋 curl，Exa 回 SOURCE_NOT_AVAILABLE）→ ⚪，以 MP T21/T22 替代。

---

## 三、各子技巧教學重點

### 3.0 共同原則（每個子技巧都套用）
- **側身、裡面的部位留住、外面的部位往上推**：Pete Whittaker「hold with the inside, push/pull with the outside」（T10）；比例「Outside Leg…90% of the pushing」（T12）；Mary Eden 對 Sierra 講「內側腿把我勾進去，外側腿是推」（影片 5，180s）；韓國龍華山現場教學同樣「左腳推、右腳進裂隙」（影片 37，960s）；智利 Cochamó 教第一次的人「外側腳要用好，不要拖著」（影片 15，160s）。
- **一次只動一點**：「make short movements, like an inch at a time」（T20）、「Moving up an inch or two…is normal」（T24）、日本城ヶ崎前輩「先停住，停得住代表姿勢對了」（影片 33，210s）。
- **體型決定技術**：Kaya「同樣 #4，我是 calf lock＋baggy fist，別人可能是 calf lock＋butterfly」（T9）；Tom Randall「大個子塞不進髖和肩；小個子整個人進去變煙囪，但搆不到喇叭裂隙深處的拳」（影片 17，680s）。

### 3.1 Arm bar／arm lock
- 步驟：側身，內側手整條伸進去，掌心推一側、肘（三頭肌）推另一側；外側手拇指朝下壓在裂隙口外緣（T2）；放在**肩膀以下**，「keep it low and getting pushing」（T1）；可以一路「walk it down to my waist」坐在上面（影片 1，120s）。
- 常見錯誤：放太高沒用（T1）；肘沒用力頂——「if it's not slightly painful…not doing it quite right」（T1）。
- 何時用：比 stack 寬、比全身擠入窄的「中間尺寸」，最適合垂直地形（T2）；在 flare 裂隙比 stack 常用（影片 1，90s：Joshua Tree 多為 flare）。
- 粗糙 vs 光滑：日本 PUMP 說 arm bar 推進力比 chicken wing 強、但更費力（T38）；英國原則 gritstone 粗顆粒摩擦大可放心推（T33 推論，**未有原文直接比較 arm bar 在粗/滑岩的差別，標推測**）。

### 3.2 Chicken wing
- 步驟：肘先進，手臂折起、手指朝下/朝臉、掌心朝外推裂隙口，上臂背面頂後牆，往下壓就會 cam 住（T2）；肘「朝內朝上」、要在裂隙深處不要在邊緣（影片 11，90s）；中文影片「肘盡量朝天」（影片 13，220s）。
- 用途：主要是休息、放 gear（T1）；北平示範 chicken wing 可放手（影片 14，540s）。
- 錯誤/風險：陡壁會拉傷肩膀（T2）；先學 arm bar 再用 chicken wing 爬升（T1）。
- 手/身體差異：「yoga types…small enough to chickenwing then it's not an offwidth for you」（T25）；Kaya 小手撐不久 arm bar，「最爛的 chicken wing」照樣上（影片 17，160–260s）。
- 選邊相關：北平「手掌要壓在突出的那一面」（影片 14，870–900s）。

### 3.3 Hand stack（butterfly 手手、teacup 手拳、拳拳）
- **Butterfly（手背對手背）**：兩手背靠、拇指朝上插入、手掌貼兩側往外撐，適合比拳頭寬一點（T2）；但這尺寸塞不進膝，要配 calf lock（T5、影片 10）。
- **手拳（teacup / hand-fist）**：手掌那側貼岩、拳頭在手背與岩之間；交叉手腕更穩、搆更深（T2）；拳用**拇指側**接岩，比小指側肉多不易磨（影片 1，60s）；這尺寸通常塞得進膝 → knee lock 可無手休息（影片 13，140s）。
- **拳拳（double fist）**：「拇指側貼另一拳小指側」占 95%；倒掛不交叉、垂直交叉（T13、影片 12）；拉的時候拳頭不要動（T2）。
- 何時用：英國觀點「E3 以上才真的用得到」（T1）；直裂（Indian Creek）才常用，flare 用 arm bar（影片 1）；反對意見「先學 armbar/chickenwing/heeltoe，別太早迷上 leavittation」（T21）、「在 5.8–5.9 上先放棄 stacking，腳會進步」（T24）。
- 小手：stack 尺寸因手而異——小手的 #3 已是 butterfly（T47）。

### 3.4 Leavittation
- 定義：手 stack＋下半身（腳、小腿、膝）卡住，輪流移動；不是倒掛（T8）。
- 「完美尺寸就是你的膝」——Leavitt 本人是手拳（T8）。
- 倒掛是延伸：手 stack 要用「領先腳同側的手」貼後牆、髖先抬再坐起（T6）。
- 新變體：Mary Eden 在 Belly Full of Bad Berries 不倒掛、靠 calf lock straight-in（T27、影片 20）。
- 練習方式爭議：Pamela Pack「best practiced on toprope」（T5）、Lemonpie 推薦寬裂抱石＋好 spotter（T31）、日本石田反對用頂繩學（T37）。
- 失敗示範：波蘭 Tolipo「stack、膝鎖都對但外側腿錯」（影片 9，40–60s）。

### 3.5 Heel-toe／foot stack（含 T-stack）／knee lock／calf lock
- **Heel-toe（外側腳）**：腳跟先進、再轉腳尖；「the heel should sit slightly deeper inside the crack than the toes」（T11）；錯誤：腳尖先進、腳尖太往下（T11）；Indian Creek pod 的關鍵是「hip external rotation with the outside leg」（T23）；競技選手常「腳尖先進」是本能錯誤（影片「Comp Climbers VS Offwidth Foot Technique」`W2tclY5bEFA`，2021-07-11，760s）。
- **Foot stack／T-stack**：腳長不夠跨時，內側腳外緣貼一側、另一腳跟疊上、腳尖頂另一側（影片 13，260s）；反證：「in practice they don't seem to work well except for occasional rests」（T20）、Luebben「knees get in the way」（T4）；Wide Boyz 自己做倒掛 T-stack 也只做出「小寫 t」（影片 6，500s）；日本講習發現「同樣 T-stack，每個人左右腳組法不同」（T39）。
- **Knee lock**：兩派——Wide Boyz：放鬆微彎整條塞到髖、再把腳拉出讓膝撐開（影片 3，60s、580s）；mudworm／MacIlwaine：先彎到最尖再塞，永不打直超過約 120°，靠大腿內側＋小腿外側的偏移摩擦（影片 7；T26）。mudworm 也反對牛仔褲（T30）。
- **Calf lock**：4 吋（butterfly 尺寸）用；腳抬到腰、小腿整段進去、腳往拇趾方向轉；最常錯「腿放不夠高」（T5、影片 10，420s）。
- 對腳/腿大小：「腿太瘦膝鎖不住」→ 扭外側腳、身體靠（影片 3，140s）；Mary Eden「小腳難」（影片 21，440s）；老手說穿 approach shoes 腳比較大（T20）。

### 3.6 側向選擇（哪側朝內）
- 原則一（有點/面）：面對有點、坡度較緩的那側（T16 正方）；原則二（煙囪式）：背靠緩的、腳踩有點的陡面（T16 反方）。**論壇未有共識，寫文時要並陳**。
- 斜裂：寬裂朝下看、煙囪朝上看（T16）。
- 依據裂隙：「出っ張ってる面に手のひら」（影片 14，870s）；FirstPersonBeta「背靠微突出那側」（影片 22，360s）；Rob Pizem：裂隙越深越窄時慣用手放裡面（T3）。
- 先決定，因為中途難換（T48）；但 pod、裂隙轉向時要學會換邊（T23、T18「Changing corners is one of the hardest moves」）。
- 小手例子：Kaya 小手 arm bar 撐不住 → 整個翻成右側朝內（影片 17，160s）；日本兩人爬同一條，最後「看喜好」（影片 34，0s）。
- 裝備要配合側向：gear 掛在外側/肩帶（T45）。

### 3.7 Squeeze 的肩、髖、呼吸
- 呼吸：吸氣卡住、吐氣移動（T14、影片 2，90s；Kaya 自述 T29）。
- 肩：「squeeze 和 45° 寬裂靠肩關節活動度」；肩膀往上放才卡得住（影片 4，480–540s）。
- 髖：「關鍵是把髖放進去」（影片 22，380s）；sidewinder 上髖頂前牆、下臀頂後牆（T4）。
- Sidewinder／側躺：上臂 chicken wing＋下臂 chicken wing＋雙膝頂前牆腳跟頂後牆，側滾往上（T4、影片 5，498s、影片 13，300s）；寬到要從 squeeze 轉 offwidth 時「go horizontal」（T19）。
- 體型：「少し体の厚みがちがうだけで、スクイーズチムニーがすごく難しく」（T39）；Mary Eden「肩膀寬，一直被推出來」（影片 21，660s）。
- 裝備：背包、鞋掛在吊帶下方（T3）；Big Bro 是保護 squeeze 的唯一辦法（T7）。

### 3.8 煙囪：背腳對撐（back-and-foot）與 stemming
- 中寬：背貼一側、腳掌踩背後那側、膝頂前方；手掌放低往外推（T3）；窄處用 scissor foot（影片 2，40s）；寬煙囪 stem 手腳各一側「往外推不是往下壓」（T3）。
- 選向：小川山 5.8 煙囪「先朝右（右壁斷處能休息），上部變窄要確實 back-and-foot、煙囪左傾改朝左」（影片 35，說明欄）。
- 滑的岩：韓國蔚山岩學生「岩石滑，背靠牆的姿勢不安心，乾脆整個人往裡面進去慢慢蹭」（影片 38，360s）；日本城ヶ崎「背中を使ってない」被糾正（影片 33，180s）。
- 心理/保護：「Place when you can, not when you want to」（T3）；垂直以下的煙囪通常可以倒退爬下撤退（T37）；韓國 5.4、5.8 的低難度煙囪 runout 長（影片 38）。

### 3.9 寬裂裝備
- 衣服：棉、燈芯絨、牛仔褲、刷毛（T1）；長袖、帆布褲、高筒鞋（T2）；cycling sleeves＋leggings（T9）；韓國「別穿貴的、穿學長舊衣」（影片 38，120s）；反方：牛仔褲讓膝更容易卡（T30）。
- 固定褲管：用膠帶把褲腳貼在腳踝（T5、T15、影片 14，360s）。
- 護具：neoprene 護膝／護肘穿在褲子裡、塑膠殼護膝太滑（T22）；#4 尺寸把護膝放脛骨、煙囪放膝蓋上方（T21）；**#4 或大膝蓋者在 #5 不要戴護膝，會卡膝**（T32）。
- 膠帶：全包覆、含手背與拇指（T9、影片 8）。
- 鞋：硬底、高筒保護腳踝（T1）；北平用鞋面包膠、鞋跟硬的 UpRise Pro（影片 14，390s）。
- 大號 cam／Big Bro：推兩顆 cam、塞深避免繩卡膝後（T7、T9）；BD #4 到 #7/#8（影片 13，360s）；Big Bro 保護 squeeze（T7）。

---

## 四、對小手/大手、粗糙/光滑岩的差異整理

| 面向 | 證據 |
|---|---|
| 小手 | T17（太太的 hand 是 0.75，「easy」裂隙變 offwidth，去 Indian Creek 找 5.11- 會像 5.9）；T47（小手 #3 只能 elbow jam／抖的 butterfly）；T41（小拳頭的人覺得比分級難）；影片 17（Kaya 小手撐不久 arm bar，改邊）；T9（同尺寸因手改 baggy fist vs butterfly） |
| 大手 | T8（John Long 戴三層手套把寬裂變拳裂，Leavitt 手小做不到）；T47（大手 #3 是 tight fist）；影片 31（比手大小） |
| 身體大小 | 影片 17（Tom Randall：大個子塞不進、小個子在 flare 搆不到）；T39（身體厚度差一點 squeeze 難很多）；影片 21（肩寬被推出）；T25（瑜伽型身材能 chicken wing 就不算 offwidth） |
| 粗糙 vs 光滑 | T9（膠帶在「slick granite cracks」多一點摩擦）；T33（gritstone 教你信任摩擦）；影片 38（蔚山岩濕滑時改進到深處）；影片 1（Joshua Tree 粗糙 flare 偏 arm bar）；**沒找到直接比較同一招在粗/滑岩差異的原文，此格只能推論** |

## 五、對台灣龍洞讀者的連結（推論，非來源原話）
- 龍洞是粗糙、會割皮的石英砂岩/變質礫岩（總論已引 MP、Noodle Line），所以衣服與膠帶的建議直接適用；褲管固定、不要穿貴衣服（韓國、日本來源）比「穿牛仔褲」更有共識。
- 台灣這類路線少，原文來源也少（Keenable 搜「龍洞 寬裂隙」「龍洞 煙囪」只得到總論已用的龍路/Climbstone 與體驗活動頁）；依專案慣例不列為缺口。

---

## 六、覆蓋矩陣（✔=至少 1 支 2020+ 影片或 ✅ 文字）

| 子技巧 | 岩場（≥3） | 人（≥3） | 教學＋實錄 | 非英語 | 反證/失敗 |
|---|---|---|---|---|---|
| Arm bar | Joshua Tree、Indian Creek、Vedauwoo、Red Rock、Cochamó ✔ | VIDEORACLES、Pete/Tom、Mary Eden、Kaya、FirstPersonBeta ✔ | ✔ | 中（影片 13）、西（15） ✔ | T1 太高沒用；Kaya 小手撐不住 ✔ |
| Chicken wing | Joshua Tree、瑞牆、Norway、Ramshaw、Red Rock ✔ | 北平、Tom、Kaya、Sierra ✔ | ✔ | 日（14）、中（13） ✔ | 陡壁傷肩（T2） ✔ |
| Hand stack | Indian Creek、Joshua Tree、瑞牆、Norway、澳洲 ✔ | Pete、Pamela、北平、邵遠 ✔ | ✔ | 中、日、波蘭 ✔ | 「E3 以上才用」「別太早學」(T1/T21/T24) ✔ |
| Leavittation | Tahquitz/Suicide（歷史）、Vedauwoo、Indian Creek、瑞牆、波蘭/捷克 ✔ | Leavitt、Pamela、Mary Eden、Tolipo、北平 ✔ | ✔ | 日、波蘭 ✔ | Tolipo 外側腿失敗（影片 9） ✔ |
| Heel-toe | Joshua Tree、Indian Creek、Vedauwoo、Cochamó、蔚山/龍華山 ✔ | Pete、Mary、VIDEORACLES、競技選手 ✔ | ✔ | 西、韓 ✔ | 腳尖先進（T11、W2tcl） ✔ |
| Foot stack／T-stack | 室內為主、Mission Cliffs（論壇）、瑞牆（T40） | Pete/Tom、Luebben、日本講習 ✔ | 教學有、**實錄缺** | 日（T39/T40） | ✔（T4/T20/影片 6） |
| Knee lock | Indian Creek、Squamish（T26 提及）、Vedauwoo、Yosemite（影片 23） ✔ | Pete、mudworm、MacIlwaine（女）、Kaya ✔ | ✔ | 中、日（T38）、西 ✔ | 卡膝派別之爭＋AAC 事故 ✔ |
| Calf lock | Indian Creek、Norway、Vedauwoo ✔ | Pamela、Pete、Mary Eden、邵遠 ✔ | ✔ | 中 ✔ | 「腿不夠高」（影片 10） ✔ |
| 側向選擇 | 瑞牆、小川山、Red Rock、Vedauwoo ✔ | 北平、Kaya、FPB、論壇 ✔ | ✔ | 日 ✔ | MP 正反意見 ✔ |
| Squeeze | Moab、Cochise、Norway、英國室內、Indian Creek ✔ | Pete、Tom、Molly Ohm（女）、Kaya、Luebben ✔ | ✔ | 中、韓（T44） ✔ | Kaya 髖卡住（T29）、呼吸錯誤（T14） ✔ |
| 煙囪背腳/stem | Joshua Tree、小川山、蔚山岩、道峰山、Stanage、Red Rock ✔ | VIDEORACLES、Rob Pizem、韓國學生、日本攀岩者、年長兄弟 ✔ | ✔ | 日、韓 ✔ | 滑岩背靠不安（影片 38）、沒用背（影片 33） ✔ |
| 裝備 | Vedauwoo、瑞牆、蔚山岩、Indian Creek ✔ | Pamela、Kaya、北平、MP 論壇、韓國學生 ✔ | ✔ | 日、韓、中 ✔ | 牛仔褲反方（T30）、護膝卡膝（T32） ✔ |

### 仍缺的格子（已補搜一輪仍無）
- **Generator Crack、Fresh Air（Camp 4）2020+ 影片**：yt-dlp 搜「Generator Crack 5.10c」「Generator Crack offwidth lead Yosemite」「Fresh Air 5.10a Yosemite offwidth」「Camp 4 wall offwidth」只找到 2010/2014/2016 TR；Yosemite 2020+ 改用 Mental Block（影片 23）、Wide climbing in Yosemite（`GHdQv0rJD2w`，無字幕）。Fresh Air 的 MP 頁 Keenable 也沒搜到。
- **Hazel Findlay 寬裂**：搜到的 Black Diamond 系列（含韓國篇 `-ApmZ21wROM`）非寬裂主題，未列入。
- **T-stack 的戶外實錄**：只有室內/論壇/講習文字。
- **台灣龍洞寬裂/煙囪 2020+ 影片或心得**：未找到（依慣例不算缺口）。
- **粗糙 vs 光滑岩對同一招的直接比較**：沒有原文，只能推論。
- **Wide Boyz 電子報日期**：網頁沒有標日期，引用時寫「Wide Boyz School 電子報」不寫年份。
- `D-OTsoLVAxs`（Randy Leavitt 本人 2025 示範）無字幕無說明，建議人工看過再引用。
