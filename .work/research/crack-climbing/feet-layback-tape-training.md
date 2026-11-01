# 裂隙系列研究：腳塞、Layback／對撐／內角、膠帶與手套、訓練與學習路徑

- 研究日期：2026-10-26
- 研究範圍：brief.md 指定的四塊主題（腳塞；layback、stemming、內角；膠帶手套、裂隙手套與皮膚；裂隙訓練與學習路徑）
- 已讀總論 `src/content/posts/climbing/2026-10-18-crack-climbing-technique.md` 的參考資料，下面不重做 REI、AAI、Metolius、V-Diff、Climbing.com〈How to Layback〉這幾個來源的基本步驟，只補它們沒講到的部分。
- 暫存（原始抓取、字幕、yt-dlp metadata）：`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/15b045f4-4588-4bdc-aa33-b878e65bd926/scratchpad/crack/feet-layback-tape-training/`

## toolDegradation

| 層 | 工具 | 結果 |
|---|---|---|
| 1 | Groundlane MCP（`mcp__claude_ai_groundlane__*`） | 只有 `authenticate`，要使用者走 OAuth，沒辦法用 |
| 2 | Groundlane 直接 HTTP（POST `/mcp`） | 回應是空的（推測同樣要認證） |
| 3 | Keenable keyless search | ✅ 能用，所有網頁搜尋都靠它 |
| 5 | Exa `web_fetch_exa` | ✅ 能用；UKC、climbing-net、Medium、heason.net 用它補抓。Reddit 回 `SOURCE_NOT_AVAILABLE` |
| 5 | Tavily `tavily_extract`（advanced） | Reddit 回「Failed to fetch url」 |
| 6 | curl + BeautifulSoup | 大部分頁面主力；Reddit `.json`（含 old.reddit）被擋 |
| 影片 | yt-dlp | 一開始沒帶 cookies，被 429 擋，同時又出現「Sign in to confirm you're not a bot」；改用 `--cookies-from-browser chrome` 之後 metadata 正常。部分字幕仍然 429，那些影片改用說明欄或章節查證，表內有標 |

結論：Reddit 三串（r/tradclimbing〈Foot-jamming and bad ankles?〉、r/climbing〈How to prepare ankles for crack climbing?〉、r/tradclimbing〈Wide boyz crack gloves〉）整條鏈都試過了，全文讀不到，列為 ⚪。同主題已用 Mountain Project 的討論串補上（見文字來源表）。

## 一、腳塞（foot jams）

### 教學重點

**手掌寬裂隙的整腳塞（標準做法）**

1. 膝蓋外轉，讓腳變成「最薄」的方向：小趾側朝下、大拇趾側朝上，鞋面貼一邊岩壁、鞋底貼另一邊。
2. 腳插進裂隙，深度到「甜蜜點」。
3. 膝蓋轉回和裂隙同一條線，鞋子就被扭緊。
4. 站上去時腳跟往下沉，讓腳跟低於腳尖。

- UKC／Wild Country Crack School（2012，Tom Randall 與 Pete Whittaker）：「turn your foot so that your knee points outwards from the crack… push the foot in quite deeply… The final movement… twist your knee so that it becomes more parallel to the crack」✅
- VIDEORACLES〈Jamming Feet〉75s：「externally rotate, toe in, twist to lock」✅（字幕）
- Geek Climber × Pete Whittaker（2022）167s：腳要先轉到最薄再放進去，常見錯誤是「put it like at a 45 degree angle… they're only just getting their toes in」✅（字幕）
- Stefano Ghisolfi × Pete（2023）165s：Pete 說新手最需要改的是腳，「people just putting the ends of their toes in」✅（字幕）

**深度：塞多深**

Wide Boyz 2026 通訊〈4 easy fixes to solve foot pain in cracks〉✅：

- 太淺：「only your toe knuckles engage… concentrates huge pressure onto a tiny area」
- 太深：腳型窄的人，裂隙邊緣會壓在腳背最細、最多骨頭的地方，「after a whole pitch, it gets very painful」
- 甜蜜點：「Aim for the crack edge to sit about half a toe to a full toe's length past the webbing of your foot」。長段裂隙可以每次深淺差一公釐，避免同一點一直受力。
- 不同意見：MP〈Foot Jam Agony〉（2021）有人說「stick my foot in as far as I could… But it will get stuck sometimes」✅。總論引的 REI 說「塞到前腳掌就夠」，和這個說法相反。這裡結論採 Pete 的甜蜜點，深塞容易卡住列為風險。

**腳跟往下沉：解決痛最有效的一招**

- Wide Boyz 通訊：「gently drop your heel toward the ground so it sits lower than your toes… the lowest-profile outside edge of your foot enters the crack much more effectively」✅
- MP〈Foot jamming pain〉（2024）：「the most important beginner tip… was to really drop your heel… the pressure is transferred through the rand into the heel instead of… crushing them」✅
- MP〈Foot Jam Agony〉：「drop your heel to adjust the angle of the jam… squeeze across the toes instead of the knuckles」✅

**不要扭過頭**

- MP〈Foot jamming pain〉：「they may be over-torquing the jam… It's the equivalent of over-gripping on jugs」✅
- MP〈Foot Jam Agony〉：「think of it as smearing one side of the crack rather than torquing my foot so hard it fuses to both sides」✅
- 練習法（同串）：四肢都塞進裂隙，再輪流放鬆，感受實際需要多少扭力 ✅

**指寬裂隙的腳（Wide Boyz 通訊〈3 Secret Weapons for Finger Cracks〉，2025-12-30）✅**

1. **Toe jam（腳尖塞）**：大拇趾先進，當支點把小趾側最低的鞋緣滾進去，主要在腳踝扭一點，最後「Actively push (dig) your toe into the crack edge」。
2. **縫緣踩踏（edge smear）**：適合內角、偏移（offset）、外張（flared）、有釘痕（pin scar）的裂隙。腳正面朝牆，腳尖踩在縫緣，站起時腳跟往下壓。
3. **雙腳對推**：適合筆直、扭腳會讓橡膠滾出來的裂隙。腳放高在臀下、膝蓋朝外，左右腳互推、不扭，小步往上挪，雙腳不交叉。

- 補充：VIDEORACLES 33s 說指寬裂隙常常是直接把腳抹在裂隙上，「drop your heel and center your knee and hip over that foot」✅
- 補充：Pete〈Best shoes〉影片 36s：指寬裂隙的第一優先是縫外的小點跟抹點；要塞進縫裡時，軟鞋比較能塞進小窟窿 ✅（字幕）

**拳頭寬、更寬的裂隙**

- VIDEORACLES 120s：裂隙再寬，就把整個腳尖「straight in」，用中立的角度站，硬底鞋在這裡特別有用 ✅
- TAKEMOVIE Part1 585s（日文）：拳頭寬大約可以把腳整個放進去，靠改變腳尖的橫向角度卡住 ✅
- K Climbing Company 2부 525–570s（韓文）：比腳趾寬的裂隙，改用腳中段的凹處和腳背；再寬就用 toe-heel ✅
- 寬縫（offwidth）：UKC Crack School Part 4（2012）說外側腳的 heel-toe 是關鍵，「If an offwidth feels hard… it's almost certainly because of your outside foot」✅。Wild Country Crack School Ep.4 210s 也說：「your foot forms a bridge across the off width jamming at the back of your heel and on the end of your big toe」✅（2012，經典原理）
- 寬縫的倒掛技巧（frog／wide pony 與 trench foot）：Wide Boyz〈Feet first VS hands first〉（2020）135–165s。三個人體型、手腳大小都不同，腳比裂隙寬時改用 toe-in（trench foot）✅

**取出腳、避免卡住**

- 取出時反向操作（總論已寫，出自 REI）：膝蓋外轉、腳踝放鬆。
- 風險實例：MP〈Type 4 Tibial Eminence Fracture caused by foot jam〉（2021-12-05）。當事人另一腳滑掉，「my right foot was locked into the crack by a secure foot jam. My body fell but my right foot stayed in the crack」，結果膝部骨折。回覆者自己也說：「push off the wall when falling… release foot jam turning knee out… it may have just been over in milliseconds」✅
- 卡膝蓋：AAC〈Prescription—Knee Stuck in Crack〉（2025-03-12）說他們每年都會刊出至少一起膝蓋卡在寬縫的報告。2023 年 Queen Victoria Spire 那起，當事人是第一次爬戶外的 25 歲女性，搜救花了超過一小時才把她弄出來 ✅。Climbing.com（2026）作者 Sam MacIlwaine 本人在倒掛寬縫做 knee lock 時卡住過 ✅

**鞋子**

- 共通原則：平底、楦頭寬、腳趾能伸平、小趾側低，要舒適不要窄。
  - Wide Boyz 通訊：「Flat foot in a flat shoe… Wide toe box… Low profile on the sides of the shoe, especially down the pinky-toe side」✅
  - 常見錯誤（同通訊）：「in flat shoes, but because they sized them down 3 sizes, their toes are completely bunched up inside」✅
- 依裂隙尺寸挑鞋（Pete〈What are the BEST climbing shoes for crack climbing?〉，2020，有章節）✅：
  - 指寬：縫外點優先；花崗岩、石灰岩點多時穿硬的 edging 鞋；要塞進縫裡時穿軟鞋。也可以兩腳不同鞋。
  - 細手寬：小趾那一側越低越好（low profile）。
  - 手寬以上：見影片 242s、346s、465s、710s 的章節。
- TC Pro（女性、澳洲 Blue Mountains 觀點）：Gwen Lancashire（Mountain Equipment，2024-10-09）✅
  - 高筒「protect them from gobies when jamming your feet deep in a crack」，寬楦，硬底撐腳塞，也方便 heel-toe。
  - 她有兩雙：EU36 爬指寬、內角、技術面；EU37 爬長日子和寬縫，可以穿襪子。兩雙腳趾都是平的。
- TC Pro 的缺點（OutdoorGearLab，2025-11-24）✅：
  - 新版舌片在腳尖附近會折起、鞋帶護片形成壓點。
  - 「very stiff」，陡壁不好用。
  - 新版腳尖體積較小，細縫比舊版好塞，但還不算細縫專用鞋。
- 其他鞋：
  - 硬鞋不一定比較好：MP〈Foot Jam Agony〉說 Moccasym 黏、感覺好；TC 要更多扭力 ✅
  - Scarpa Generator Mid 對比 TC Pro（Kellen Erickson，2024）30–60s：Generator Mid 腳踝有氯丁橡膠＋泡棉，TC Pro 的墊子「feel like… paper」✅
  - BD Aspect：日本 山ちゃんねる（2020）只看了說明欄 🟡；Aspect Pro 見 EpicTV（2022）90s ✅
  - 韓文：K Climbing Company〈TC-Pro vs Maestro〉（2020）只看了說明欄 🟡
  - 韓文：naver 部落格（2022-02-23）「암벽화는 발목까지 오는 하이컷이 좋다… 꽉 끼는 것보다는 편안한 신발」✅

**腳痛是正常的嗎？**

- Pete 的立場：「if foot jamming hurts, it usually means you're doing something wrong」，而且裂隙耐受度要從零開始累積，「Even if you've been climbing for 5 or 10 years, your crack tolerance starts back at zero」✅
- MP（2024）有回覆者說：除非是低角度、有窟窿的裂隙，或對方腳踝完全沒彈性，否則「it's a technique issue」✅
- 反方：MP（2021）有人建議練習前先吃止痛藥，馬上被反駁「Don't use drugs… worst advice」✅。文章不要採止痛藥這個建議。
- 腳踝韌帶：MP（2021）「All those foot and ankle ligaments/tendons are being stretched in ways they've never been before. It'll get better with more mileage」✅

**小手、大手、腳小**

- Pete（Wide Boyz 通訊〈A New FA in Kristiansund〉）✅：同一條路線不同段難易互換，總難度會平均掉。#0.75–#1 對小手是完美手塞，對大手是細手；#6 小個子可以把更多身體塞進去。
- Mari Salvesen 在 #2 寬度要用 cupped hand、在 #4 要 stack。這篇講的主要是手，腳的部分沒有明說。
- 腳小、寬裂隙：Anthony Johnson（2018，在 2020 年以前，只當原理）說自己「small feet… can also start to become a challenge on some of these wider cracks」✅

**粗糙岩 vs 光滑岩（腳）**

- 光滑：Wide Boyz 通訊說，裂隙很筆直、扭腳會讓橡膠滾出來時，改用雙腳對推 ✅
- 粗糙：
  - Scarpa vs TC Pro 影片 75s：「jagged Granite crack」時，腳踝護墊很重要 ✅
  - Climbing.com〈10 Commandments of Indian Creek〉（Julie Ellison）：IC 的砂岩「will ravage every inch of exposed skin」，建議穿襪子護腳踝 ✅
  - 龍洞屬於粗糙岩（見總論），推論應該優先考慮高筒或襪子。這是推論，沒有龍洞專文。

### 影片（腳塞與鞋）

| video_id | 標題 | 頻道 | upload_date | 長度 | 岩場/地點 | 人物 | 類型 | 語言 | 示範重點＋start 秒數 | 查證方式 |
|---|---|---|---|---|---|---|---|---|---|---|
| HgpCOnPIR7o | Crack Climbing: Jamming Feet | VIDEORACLES | 2021-02-16 | 3:49 | 戶外抱石岩（未標地點） | VIDEORACLES 講者（教練） | 教學 | 英 | 12s 縫外點／33s 指縫抹腳＋腳跟下沉／75s 外轉→腳尖入→膝回中線／120s 寬縫直插／161s 休息站姿 | 字幕＋章節 |
| cCEzog_m6BI | 4 Easy fixes to solve foot pain in cracks | The Wide Boyz Show | 2026-08-29 | 4:56 | （通訊朗讀，無岩場） | Pete Whittaker | 教學 | 英 | 30s 鞋型／90s 深度甜蜜點／150s 腳跟下沉／之後「從零累積耐受度」 | 字幕＋通訊全文 |
| Abx8Gl-VHv0 | What are the BEST climbing shoes for crack climbing? | Wide Boyz | 2020-05-10 | 13:22 | 室內 | Pete Whittaker | 教學 | 英 | 36s 指縫鞋／172s 細手／242s 手縫／346s 拳縫／465s 寬縫／710s 通則 | 章節＋字幕 |
| -ocSfP62RLA | Pro Climber Coaches Gym Climber to Learn Crack Climbing in 35 Days | Geek Climber | 2022-03-31 | 10:46 | 岩館人工裂隙 | 一般岩館抱石者＋Pete | 學習紀錄＋教學 | 英 | 35s 手塞／167s 腳塞（先轉薄、別 45° 只塞腳趾）／233s 初練疼痛／355s 手腳配合／414s 倒退爬 | 章節＋字幕 |
| 5SfTjWiFYFA | Who's the STRONGEST crack climber? Challenging the legendary cellar | Stefano Ghisolfi | 2023-03-30 | 24:25 | 英國 Sheffield 的 Tom Randall 地窖 | Stefano Ghisolfi、Pete、Tom | 實錄＋教學 | 英 | 106s 腳法挑戰；165s Pete 談新手只塞腳趾尖 | 章節＋字幕 |
| mvr0oPGpWRI | Transforming Beginner to Big Wall Climber in 5 Days | Wide Boyz | 2023-10-15 | 27:24 | 岩館人工裂隙→戶外 | Mike Boyd（攀岩不到一年的新手） | 學習紀錄 | 英 | 75s 岩館人工裂隙教學／135s 第一次腳塞 | 字幕 |
| Nc_otfbu0b8 | 재밍 기술 12가지: 크랙 등반 잘하는 법 2부 | K Climbing Company | 2023-01-19 | 15:19 | 韓國（道峰山一帶岩館與岩場） | 김종식（嚮導） | 教學 | 韓 | 510s 腳趾寬裂隙：腳刀立起插入→膝立起／525s 再寬用腳中段與腳背／570s toe-heel／630s leg bar | 韓文字幕 |
| ScCQg539ylE | 암벽등반 초급 중급자 크랙등반 발기술 | 최지호 | 2020-11-29 | 5:18 | 韓國 | 최지호 | 教學 | 韓 | 說明欄：腳塞、膝塞、手推省臂力（無字幕，起點未定，從 0s 看） | 說明欄 |
| VRc_iFasUc4 | 【基本】クラッククライミングの技術をご紹介！Part1 | TAKEMOVIE | 2021-09-09 | 17:29 | 日本 | TAKE（手大的日本攀岩者） | 教學 | 日 | 271s 手塞章節，345s 講到腳：小趾側朝下、膝往內倒施加扭力／450s 寬指縫腳尖／585s 拳縫腳整個入 | 章節＋日文字幕 |
| nbc0ytdo2To | Feet first VS hands first | Wide Boyz | 2020-06-21 | 6:41 | 挪威 Sogndal | Pete、Mari Salvesen（女）、David Postelt（體型最大） | 實錄＋教學 | 英 | 75s frog／banana foot；135s toe-in（trench foot）vs heel-in（wide pony）；165s 腳比裂隙寬時用 toe-in | 章節＋字幕 |
| jZWEHeAMSGQ | How to Climb OffWidths With the Wide Boyz | Josh Rundle | 2022-01-09 | 21:48 | 英國（Wide Boyz 訓練場） | Pete＋YouTuber Josh Rundle | 教學 | 英 | 96s 窄寬縫的難處／175s 進階腳位（heel-toe） | 章節 |
| 9pa0xGzvb8U | Sasha DiGiulian crack climbing tutorial in Indian Creek | Sasha DiGiulian | 2020-01-14 | 6:21 | Indian Creek | Sasha DiGiulian（女，運動攀登出身） | 教學＋實錄 | 英 | 58s 貼膠帶別太厚／105s 腳對準裂隙放入再扭／120s 內角時改 layback | 章節＋字幕 |
| DIFzDs_cDQI | THE FOOT JAM DYNO | Wide Boyz | 2021-09-30 | 15:43 | 岩館 | Tom、Pete | 實錄（定線） | 英 | 105s heel-toe 腳塞；442s frog vs banana | 章節＋字幕 |
| oO1xDmVwxeE | NEW La Sportiva TC Pro: Babsi Zangerl + Jacopo Larcher Review | EpicTV Climbing Daily | 2022-01-14 | 6:28 | 義大利 Valle dell'Orco | Babsi Zangerl（女）、Jacopo Larcher | 鞋評＋實錄 | 英 | 105s 「the crack climbing shoe」／150s 鞋帶護片是為腳塞設計 | 章節＋字幕 |
| jdRCZq9rphk | La Sportiva TC Pro: Versatile, durable, and extremely comfortable | UKClimbing | 2022-09-19 | 7:36 | 英國 | Rob Greenwood | 鞋評 | 英 | 52s 硬度／105s 裂隙表現／170s 抹腳 | 章節＋字幕 |
| fm_W4PcVo2U | SCARPA Generator Mid vs La Sportiva TC Pro | Kellen Erickson | 2024-07-19 | 6:28 | 美國（Yosemite 用鞋觀點） | Kellen Erickson | 鞋評 | 英 | 30s 腳踝護墊差異／75s 粗糙花崗岩 | 字幕 |
| YwgHyrVbzDo | How To Choose Crack Climbing Shoes - 5 Things To Consider | The Adventure Junkies | 2020-11-04 | 4:00 | — | 講者 | 教學 | 英 | 0s 高筒護踝／45s 平底／72s 腳趾有空間 | 章節＋字幕 |
| 1yVv_DHF-wI | The Crack Climbing, Big Mountain, NEW Black Diamond Shoe | EpicTV Climbing Daily | 2022-10-07 | 6:01 | — | BD 歐洲產品主管 | 鞋評（廠商） | 英 | 90s 中筒對煙囪、寬縫的保護 | 章節＋字幕 |
| obgz2KKqY74 | 【このシューズ反則すぎる】BDのアスペクトがクラックでかなり使える件 | 山ちゃんねる | 2020-11-21 | 8:49 | 日本 | 山ちゃん | 鞋評 | 日 | 說明欄：腳尖塞進裂隙時「絶大な信頼感」（起點未定） | 說明欄 |

不收：
- Wild Country Crack School Ep.1–8（2012–2013）、Anthony Johnson〈Crack Climbing 101〉（2018）、Dale Bard（2019）：都在 2020 年以前，只當原理引用。
- 원리 ranghes〈크랙등반 시의 발동작〉（2019，101 秒）：在 2020 年以前。

## 二、Layback、stemming（對撐）、內角（dihedral）

總論已經寫了 layback 的基本姿勢（引 Climbing.com、REI、V-Diff），這裡只補判斷、轉換和對撐。

### 教學重點

**何時 layback、何時塞**

- 優先塞，地形不允許才 layback：
  - VIDEORACLES〈Laybacking〉15s：「generally i would prefer when i see a flake like this to jam and get my weight on my feet but because this one tilts over backwards… i'm going to need to get outside the crack and lie back」✅
- 塞比較安全：MP〈Why the hate on laybacking?〉（2022-12-02）✅
  - 「It's inherently unstable. Pulling and pushing pressure is all that keeps you on. So the pump clock runs a lot faster」
  - 墜落時「If someone falls while laybacking it, they invert in the fall」
  - 定級的假設：「It is only 5.7 when jammed, it looked like 5.10+ the way the climber was trying to do it」
- 什麼時候 layback 合理：
  - 同串：「more appropriate to layback an open book feature when it is off-vertical」，例如 Yosemite 很多中級內角太寬或太窄、塞不好，但角度不陡，腳很吃得住 ✅
- 反方：同串另一派說「There is nothing "wrong" about laybacking a crack… just like there is nothing "wrong" with campusing a roof climb」，還有「fluency」的比喻：一段 3–6 公尺內會混著用塞、抹、layback、肩頂 ✅
- 韓文比較：K Climbing Company 3부（2023-03-05，선인봉 좌향 크랙）405s 的英文字幕 ✅
  - 「Jamming is followed by pain, but lay back not… Jamming is stable from falling… Lay back is high in climbing speed… good in energy efficiency」
  - 結論：「This is why you should do jamming in taking risk of pain」
  - 525s：寬到快要變寬縫、又有好邊可抓時，layback 比較輕鬆
- 臂長：MP〈Rattley fingerlocks in corner cracks: just layback?〉（2026-07-13）「people with longer arm ratios have an easier time laybacking that short arm people」✅
- 小手：同串有人說「rattley fingers are 0.5s for me, so I get basically nothing out of my feet」✅

**Layback 的細節（Climbing.com〈How to Layback〉，2022-11-17）✅**

- 腳和手的距離：「Don't get your feet too close to your hands; this creates maximum horizontal force… if your feet are too low, the opposing forces won't create enough friction」。甜蜜點依角度和身高調整。
- VIDEORACLES 30–45s：「the key to lie backing is getting your feet high… if my feet get down low they start slipping」✅
- 進出 layback 要找扎實的塞點：「Getting into and out of a layback is hard, so try to find a bomber lock or jam… start the transition moves with high feet」
- 裂隙變陡、變斜時：改成雙手 undercling（掌心朝上）。
- 放保護：先找休息站姿再放，「A recent rescue involved a laybacking climber who was blindly placing gear… his pro blew, and he hit the ground」。
- 日本的常見錯誤：クライミングアップ（2021）章節 90s「落ちてしまう原因」，就是身體像門一樣打開（barn door）🟡（只看了章節與說明欄）。

**Layback 與塞的混合（jam-back）、換塞**

- Anna Hazelnutt × Mary Eden（@tradprincess，Indian Creek Crack Camp 導師），Yosemite〈Blues Riff〉（2024-07-28）✅（字幕）
  - 270s：「a jam back is where we combine the styles of layback and crack climbing」
  - 285s：「anybody that tells you layback is not part of crack climbing…」
  - 300s：用在過屋簷、偏移裂隙、內角，或沒有好腳點的 splitter
  - 330s：內側腳用 rand smear，把鞋側橡膠抹進縫裡
- Wide Boyz × Janja Garnbret（2025-10-12）270s：Pete 教「go into a jam… and then just turn it into a kind of like a jamming layback」✅（字幕）
- MP（2026）：「Ring lock or can opener the top hand and paddle the bottom one… The line between jamming and liebacking isn't always clear」✅
- MP（2026）：「jamming the foot nearest the corner. You can get a layback position with a little more separation between the hands and feet」✅
- MP（2026）：內角細縫用高位 thumbs-down 塞（像 gaston），把腳踩高對抗下手，再轉成近似 layback 的姿勢接下一個高位 gaston ✅
- MP（2026）：IC 式內角靠內側腳 rand smear；花崗岩內角則「getting your stem on」✅

**內角與對撐（stemming）**

- Climbing.com〈How to Stem〉（2023-12-28，Jesse Huey 等）✅：
  - 原理：「Stemming is all about oppositional force」，三點不動、移一點。
  - 吃力的是腳：「the pump clock will be counting down on your calves… Keep your heels as low as possible」。
  - Jesse Huey：「it's about balance and hip flexibility」，瑜伽跟懸吊板一樣重要；腳點「Usually it's much higher and wider than you want」。
  - Jesse Huey 說他在某條路線的難點用 stem，而「most people layback」，結果「drastically took the weight off my fingers」。
- VIDEORACLES〈Stemming〉（2021-02-11）30s 在對撐站姿雙手放開；75s 示範全身對撐 ✅
- 矮個子：The Hangout Climbing Centre（2023-01-27）說對撐是「A Good Climbing Technique For Short Climbers」🟡（只看了說明欄）
- 龍洞：kateberry 部落格（2020-09）爬〈福利社〉5.10a，後半段是內角裂隙 ✅
  - 「對裂隙不得其門而入的我一路逃避裂隙爬法、用lay back和煙囪爬法土砲爬完」
  - 「龍洞的裂隙路線比較親切，可以用lay back和煙囪爬法通過」
  - 這是一般攀岩者、女性、龍洞的第一手心得。

**粗糙岩 vs 光滑岩**

- 光滑的平行裂隙（IC 砂岩）：MP 說要「Rand smear shuffle」。
- 花崗岩：凹凸多，可以多用對撐（同串）✅
- 龍洞岩質粗糙，摩擦好，layback 時腳比較吃得住。這是推論，沒有專文。

### 影片（layback、對撐、內角）

| video_id | 標題 | 頻道 | upload_date | 長度 | 岩場/地點 | 人物 | 類型 | 語言 | 示範重點＋start 秒數 | 查證方式 |
|---|---|---|---|---|---|---|---|---|---|---|
| vUU7Qd1jQSo | Laybacking | VIDEORACLES | 2021-02-25 | 1:46 | 戶外高抱石岩片 | VIDEORACLES 講者 | 教學 | 英 | 15s 為何不塞改 layback／30s 腳要高／45s 腳低就滑、要快 | 字幕 |
| USRN6FUCYgU | Stemming | VIDEORACLES | 2021-02-11 | 2:35 | 戶外內角抱石 | VIDEORACLES 講者、Ethan | 教學 | 英 | 0s 定義／30s 對撐站姿放手／75s 全身對撐 | 字幕 |
| aI1EoRX-ySs | Can I Survive Crack Climbing with @tradprincess? | Anna Hazelnutt | 2024-07-28 | 20:21 | Yosemite（Blues Riff） | Anna Hazelnutt（女）、Mary Eden（女，Crack Camp 導師） | 教學＋實錄 | 英 | 274s 技巧章節：270s jam-back 定義／300s 何時用／330s rand smear | 章節＋字幕 |
| 0jIKMrVH0_c | Training Crack Climbing with the World's Best Climber | Wide Boyz | 2025-10-12 | 31:15 | 斯洛維尼亞岩館（360 Holds 人工裂隙） | Janja Garnbret（女）、Pete | 教學＋實錄 | 英 | 69s 基本塞法／165s 拳、外張裂隙／270s jamming layback／494s 進階 | 章節＋字幕 |
| gZw9eiu0xM0 | 크랙 등반 기술 3부: 재밍이냐 레이백이냐, 선인봉 좌향 크랙 | K Climbing Company | 2023-03-05 | 10:53 | 韓國 道峰山 선인봉 | 김종식（嚮導） | 教學 | 韓（附英字幕） | 405s 塞 vs layback 比較／450s 腳的節奏（右腳臨時踏、左腳主推）／525s 寬縫邊好抓時 layback | 英文字幕 |
| 1xMEF7mZQjU | 인수봉 남면 여정길 제1피치(5.10c) 크랙, 레이백, 스테밍, 중심이동이 핵심 | 김용기의클라이밍세상 | 2026-10-21 | 12:14 | 韓國 北漢山 仁壽峰 | 김용기、이지민 | 實錄 | 韓 | 說明欄：layback、stemming、重心移動是關鍵（無字幕，從 0s） | 說明欄 |
| cWy5j39E0gs | 북한산 인수봉 여정길 1피치 크랙등반 레이백의 성지 | 슬랩머신K | 2020-04-08 | 4:57 | 韓國 仁壽峰 여정길 | 夫妻攀岩者 | 實錄 | 韓 | 說明欄：「레이백과 스테밍의 조화」，並警告這是腳踝骨折危險區（從 0s） | 說明欄 |
| yjlv5YkXqsM | [용화산 매길 마담길] 크랙루트 째밍 vs 레이백 승자는 과연? | Santa Minji | 2021-06-25 | 26:50 | 韓國 龍華山 | Santa Minji（女，一般攀岩者） | 實錄 | 韓 | 說明欄：在雪嶽山練過、受過課，塞的能力進步；路線含 5.9／5.11／5.10a（從 0s） | 說明欄 |
| BgHCXB6QDPA | 선인봉 남측 코너크랙(5.10d), 리드 도전 | 쏘맥 클라이머 | 2023-10-23 | 14:36 | 韓國 道峰山 선인봉 | 쏘맥（一般攀岩者） | 實錄 | 韓 | 說明欄：對撐段之後接裂隙、腳滑、手指磨破，後段 layback 變順（從 0s） | 說明欄 |
| hYDpkqYM42E | 小川山「小川山レイバック」 | 萩原悟のクライミング映像 | 2020-04-21 | 3:35 | 日本 小川山 親指岩 | 萩原悟 | 實錄 | 日 | 說明欄：「レイバックで押し切ってもよし、ステミングやジャミングで華麗に切り抜けてもよし」（從 0s） | 說明欄 |
| RbIj8z9hZ3o | 『怒涛のレイバック』瑞牆 | Rysa | 2021-09-03 | 15:03 | 日本 瑞牆 カサメリ沢 | Rysa（一般攀岩者） | 實錄 | 日 | 說明欄：開頭 layback 很耗力（從 0s） | 說明欄 |
| --wmcrfkucc | レイバックで体が開いてしまうあなたへ！ | クライミングアップ | 2021-02-06 | 6:52 | 岩館抱石 | 講者 | 教學 | 日 | 48s 動作／90s 掉下的原因（barn door）／199s 訣竅 | 章節 |
| ZZIu_E52ui4 | Stemming: A Good Climbing Technique For Short Climbers | The Hangout Climbing Centre | 2023-01-27 | 1:54 | 岩館 | 講者 | 教學 | 英 | 說明欄：手搆不到下一點時用對撐（從 0s） | 說明欄 |
| YjwnI1xty1c | The Best Climb in Colorado's - Wunsch's Dihedral | The Gravity Lab - Brant Hysell | 2024-11-20 | 20:03 | 美國 Colorado | Brant Hysell、Tristan | 實錄 | 英 | 260s 技術難點／446s 上段裂隙 | 章節 |
| 9pa0xGzvb8U | Sasha DiGiulian crack climbing tutorial in Indian Creek | Sasha DiGiulian | 2020-01-14 | 6:21 | Indian Creek | Sasha DiGiulian（女） | 教學 | 英 | 120s 在內角有時不塞，改 layback | 字幕 |
| cPewuF0nOWc | Learning How To Crack Climb (Flatline 5.10) | John Minar Photography | 2023-10-18 | 7:15 | Indian Creek | John Minar（新手） | 學習紀錄 | 英 | 15s「Jam don't crimp, use your feet」／45s 整段 layback 上去 | 章節＋字幕 |

不收：
- Climbing Tech Tips〈Finger Locks vs. Laybacking〉（2018）、Anthony Johnson〈Fist Jams and Laybacks〉（2018）：都在 2020 年以前。
- River Rock〈Laybacks〉（2015）：在 2020 年以前。
- F-STYLE 杉田雅俊〈レイバック〉（2011）：在 2020 年以前。
- 小川山レイバック 4K 版（6u1AKYm3-2g，2021）：和上表 hYDpkqYM42E 是同一條路線，擇一收錄。

## 三、膠帶手套、裂隙手套與皮膚

### 教學重點：膠帶手套

總論已經寫了 Metolius 的三步驟。以下補共通的訣竅和不同做法。

**材料**

- 寬度：
  - 1.5 吋（約 38 mm）非彈性運動膠帶最常見：Climbing.com 2025 版作者 Jean-Pierre Ouellet、ちくごん（2024，38mm 非伸縮）、TAKEMOVIE（約 4 公分）✅
  - AAI 的做法用 1 吋膠帶撕成半吋細條做骨架 ✅
  - AAC 經典文〈Taping for Hand and Fist Cracks〉：「Especially for small hands, 1½-inch tape is easier to apply. For those with large hands… 2-inch tape」✅（這是小手、大手的具體差異）
- 黏度比什麼都重要：今日からきみは！！（日文，2021-08-30，2025 更新）「一番大切なポイントは粘着力の強いテープを使う」，推薦 Nichiban ✅

**步驟上的共通訣竅**

- 皮膚要撐開再貼：
  - Sam Foreman（Outside TV，2025-07-23，IC Crack Camp 嚮導）75s：「stretch your skin as much as you can… make a fist when you tape over the back of your hand」✅
  - Wild Country Ep.6（2012）也說「make sure the Skin's tight」。
- 不要有皺摺：VIDEORACLES（2021）60s 說皺摺會不舒服、也黏不牢 ✅
- 收尾壓住：Sam Foreman 105s「always try to cover the ends of the tape roll. Because the ends are always where it peels」✅
- 拇指要包：
  - Sam Foreman 45s：thumbs-down 塞或拳塞時，那塊皮會磨 ✅
  - Tom Randall（Wild Country Tips，2019）的「thumb loop」：先做，才不會在塞的時候捲起來 ✅
- 手腕不要纏太緊：
  - Climbing.com：「Be careful not to make this piece too tight, or you'll get pumped in an instant」✅
  - Outdoor Research Adam George（2012）也提醒過。
- 掌心留空：
  - Zd5PnDXeTWY（韓文，2022）345s：留空才能抓 face 點、爬 slab ✅
  - Climbing.com：掌心有膠帶會降低摩擦力，多繩距中如果下一段是斜面或 sloper 難點，「you're better off using crack gloves」✅
- 剃毛、清油：
  - AAC：剃毛、用酒精或丙酮去油，再加安息香酊（benzoin）增黏 ✅
  - Climbing.com：「Shave your hands first」，甚至可以用快乾膠 ✅
  - Aric Fishman（2023）300s：手毛多時更要壓平 ✅
- 重複使用：從手腕內側剪開脫下，下次套回去再纏一圈手腕（Climbing.com、Wild Country、K Climbing 405s）✅
- 細手：
  - Wild Country Ep.6 75s：細手塞時摩擦最多的區域要貼兩層 ✅
  - 反過來，指縫、細手要貼越薄越好。日文部落格算過：0.25 mm 的膠帶纏兩圈，指頭直徑增加約 1 mm；這 1 mm 對 2 cm 寬的指縫等於窄了 5%，對 10 cm 寬的裂隙只差 1% ✅（今日からきみは！！〈指の太い人こそフィンガーだ〉）

**要不要貼：不同意見**

- 新手建議貼，熟了以後試著不貼：Climbing.com〈10 Commandments of Indian Creek〉（Julie Ellison，2025-06-21 版）✅
  - 「Thou shalt learn how to make good tape gloves—and then climb without them」
  - 「As you get better, your hands will stay where you put them, but the gloves seem slippery」
- 大手的人不愛貼：TAKEMOVIE Part2（2021）285–300s ✅
  - 手本來就寬，貼了更難塞進去。
  - 汗會讓膠帶滑掉，塞不住。
  - 有次忘了帶就完全爬不好，所以不想依賴膠帶。
  - 今日からきみは！！作者也是大手，原本在 Yosemite〈Tales of Power〉#0.75 細手段貼膠帶。中途膠帶剝落，乾脆撕掉，結果「ジャミングのきき方が大きく変わりました」✅
- 回應「手皮會變厚」的說法：AAC 認為手背皮膚「lacks the true callus-forming potential of palmside skin」，不貼的人主要是痛覺耐受度變高 ✅
- Wide Boyz 地窖訓練：「pressure wounds rather than actually drawing blood… because the cracks are either soft or they're wood and you're taped up」（TrainingBeta #144）✅

### 教學重點：市售裂隙手套比較（2020 年以後的評測與心得）

| 產品 | 特性 | 優點 | 缺點 | 來源 |
|---|---|---|---|---|
| Ocun Crack Gloves（原版、Lite） | 厚橡膠背片、指節有襯墊、Velcro 藏在橡膠翻蓋下 | 粗糙或晶體多的岩石最舒服、最耐用。測試者一手戴 Ocun、一手貼膠帶爬長路線，結束後 Ocun「I could barely tell the difference」 | 厚，細手縫比較難塞，要改塞法；回饋感比較少；不會完全取代膠帶 | 99Boulders（2021-08-10）✅；6DME 日文實測：Ocun Lite「肉厚でグリップが良い」（章節 109s）🟡 |
| Ocun Crack Gloves Pro（2024 款） | 加拇指覆蓋、拉環、指環改成攤平的轉向設計、改用彈性 Velcro 纏繞 | 比原版更貼手 | — | WeighMyRack（2023-09-13）字幕 0–60s ✅（廠商口述） |
| Outdoor Research Splitter（II） | 薄合成皮 | 感覺接近膠帶、輕；光滑岩表現好 | 會在不該折的時候折起；尖銳的塞點仍然痛；尺寸 L/XL 偏長；比 Ocun 早磨壞；不適合寬縫、拳縫、疊塞 | 99Boulders ✅；Treeline Review（2026-09-28）✅ |
| Black Diamond Crack Gloves（2020） | 合成麂皮＋0.6 mm 壓紋橡膠，指頭無縫，側邊和拇指包覆，像白色膠帶 | 細手縫到茶杯拳都好用（Derek Franz，Alpinist，2021-12-17）；外觀像膠帶，在岩場比較不會被「純粹派」白眼 | 細手塞磨損處，橡膠會開始脫層；Velcro 穿孔開始裂；脫手套要小心 | WeighMyRack（2020-03-20）45–75s ✅；Alpinist ✅；takato77 日文心得（2020-11）列了「フィストジャム時の突っ張り感」「脱ぐ際の指の引っ掛かり」✅；BD Korea（2020-05-08）韓文 60–90s ✅（廠商） |
| Wide Boyz Crack Gloves | 橡膠覆蓋細手到疊塞的接觸面，有拇指環，延長手腕帶，掌心和手指留空 | 「grip way beyond that of even the vest tape gloves」，又不會讓手變太粗；£45 | 穿戴有點麻煩 | Heason（2023-11-14）✅；Wide Boyz 2026 年新推 Master Jam Crack Glove（_AT8-hMEgt4 說明欄）🟡 |
| G7 Hand Jam | — | 「the most durable I've yet to use」，薄、不礙事 | 不便宜 | Climbing.com〈9 Best Climbing Gloves〉（2026-01-06）✅ |

**手套 vs 膠帶：怎麼選**

- 99Boulders：「If you crack climb predominantly on rough or crystalline rock… get the Ocuns」。一捲膠帶約可以做 5–7 副手套，不常爬裂隙的人用膠帶比較省 ✅
- Climbing.com（2025）：手套大約用 10–20 次後就比膠帶便宜；但「much thicker than the average tape glove」，而且寬縫不護掌心 ✅
- Alpinist：可重複用的膠帶手套「don't work if you need a performance fit (read: if you're jamming anything other than a hand crack)」✅
- 「手套算不算人工攀登（aid）？」：
  - 日本有強烈意見說是 aid。日文部落格引了 Wide Boyz 的拉力實驗：戴手套時細手、手、拳的塞點拉力都比較高 ✅（實驗影片 DbnofcWjVts，2021-10-07，說明欄寫有比較手套和赤手）
  - Climbing Nomads（2020）章節 202s「Is using gloves cheating」🟡
- 台灣、龍洞：岩質粗糙（總論引了黃國維說的「玻璃混泥土」）。依 99Boulders 的判準，偏向 Ocun 一類的厚手套或膠帶，這是推論。

### 皮膚

- 傷口（gobies）主要在手背、指節、拇指根。Rhino 的頁面是保養品廠商的行銷文，只拿它描述受傷部位：「Splitter cracks grind the knuckles, the thumb web and the back of the hand」🟡
- AAC：疼痛主要來自滑動，「wounds result if sharp crystals are encountered… sliding of loose skin」✅
- Lattice〈Training for Climbing Cracks Part 1〉（2020-02-16）150s：Tom Randall 說，停爬裂隙一段時間後回來，第一週一樣很痛，要持續接觸皮膚才會消退 ✅（字幕）
- 戒指：AAI〈Climbing with Jewelry is Dangerous〉說最大風險是戒指撕脫傷（ring avulsion）；戴手錶塞裂隙「watch meets rock, rock wins」✅

### 影片（膠帶與手套）

| video_id | 標題 | 頻道 | upload_date | 長度 | 岩場/地點 | 人物 | 類型 | 語言 | 示範重點＋start 秒數 | 查證方式 |
|---|---|---|---|---|---|---|---|---|---|---|
| r51YThzTWXM | How to Tape Your Hands for Crack Climbing | Outside TV | 2025-07-23 | 7:05 | Indian Creek | Sam Foreman（Crack Camp 嚮導） | 教學 | 英 | 0s 拇指／75s 撐開皮膚／105s 蓋住膠帶尾端／157s 手掌／272s 手腕固定 | 章節＋字幕 |
| QliMoR9C1vA | Crack Climbing: How To Tapes Your Hands | VIDEORACLES | 2021-02-19 | 9:34 | 戶外 | VIDEORACLES 講者 | 教學 | 英 | 0s 手背橫條／60s 不要皺摺／120s 指環用半寬細條 | 字幕 |
| ufJt-vUxSdY | How to Make Crack Climbing Tape Gloves | Aric Fishman | 2023-08-19 | 21:31 | — | Aric Fishman | 教學 | 英 | 0s 手背／283s 底座／401s 指與拇指／844s 加強耐用度 | 章節＋字幕 |
| Gw0MVaekdpc | How to Tape Your Hands for Rock Climbing | Escape Climbing | 2023-06-21 | 11:47 | 岩館 | Escape Climbing 講者 | 教學 | 英 | 22s 指頭貼法（非裂隙）／297s 裂隙膠帶手套／643s 手腕 | 章節＋字幕 |
| EKHxhXIPGi8 | Quick Tips - How to Make a Basic Crack Glove | Movement Gyms | 2020-04-08 | 3:00 | 岩館 | Dan（岩館教練） | 教學 | 英 | 45s 1 吋膠帶／120s 指環／135s 手腕 | 字幕 |
| NsdLmE47Ecg | NON-Crack Climber Vs Crack Climbing Gloves: Wideboyz Tape | EpicTV Climbing Daily | 2020-07-31 | 8:11 | 室內 | Teresa（非裂隙攀岩者，女） | 教學＋試用 | 英 | 72s 什麼是攀岩膠帶／186s 做膠帶手套／419s 結論 | 章節 |
| zdegY0z0fMI | Crack Climbing Camp with Mary! MY EXPERIENCE + WHAT TO EXPECT | Active Alexis | 2022-02-03 | 14:25 | Indian Creek | Alexis（女，學員）、Mary Eden | 課程心得 | 英 | 45s 營隊形式／135s 自己貼失敗／615s Mary 的手套貼法（660s 先貼拇指與小指） | 章節＋字幕 |
| eXimcVNmMaY | 【クラッククライミング入門】〜ジャミング用のテーピングの巻き方〜 | ちくごん | 2024-11-15 | 10:33 | 日本（岩館） | ちくごん | 教學 | 日 | 0s 38mm 非伸縮／30s 先在手腕貼起點／75s 手背橫條／180s 防剝落的固定 | 日文字幕 |
| K6DnGCsNjlo | 【基本】クラッククライミングの技術をご紹介！Part2 | TAKEMOVIE | 2021-09-16 | 11:37 | 日本 | TAKE（大手） | 教學 | 日 | 266s 膠帶（285s 大手不貼的理由）／405s 鞋子／544s 練習方法 | 章節＋日文字幕 |
| Zd5PnDXeTWY | 크랙 장갑 1,000원으로 만들기: 핸드, 피스트 재밍 테이핑 | K Climbing Company | 2022-10-31 | 9:20 | 韓國 | 김종식 | 教學 | 韓 | 30s 手套約 4 萬韓元 vs 膠帶／60s 30cm×3＋10cm×3／345s 掌心留空／405s 可重複使用 | 韓文字幕 |
| sI9A7BABqSM | 크랙 재밍 글러브 만들기 | beast_park | 2020-05-22 | 38:42 | 韓國 | beast_park | 教學 | 韓 | 說明欄：用攀岩膠帶做手套（從 0s） | 說明欄 |
| rmAQzm1-JxI | Ocun Crack Gloves Review | Climbing Nomads | 2020-02-09 | 5:25 | — | Climbing Nomads（情侶） | 評測 | 英 | 30s 尺寸／60s 穿法／122s 表現／202s 算不算作弊／241s 冷天優點 | 章節 |
| OlUjrAjztnM | *ALL NEW* Black Diamond Crack Gloves | WeighMyRack | 2020-03-20 | 4:36 | 展場 | BD 產品人員 | 產品介紹 | 英 | 30s 模仿膠帶、無襯墊／45s 0.6 mm 橡膠／75s 低輪廓、Velcro | 章節＋字幕 |
| GtwLGq_gzBw | Chris Burkard Reviews the New BD Crack Gloves | Black Diamond Equipment | 2020-07-16 | 3:04 | — | Chris Burkard | 評測（品牌大使） | 英 | 20s 合身／50s 護腕／70s 薄度／92s 拇指／105s 指節 | 章節 |
| MDM9rQux3uA | *NEW* Ocun Crack Gloves Pro | WeighMyRack | 2023-09-13 | 2:22 | 展場 | Ocun 人員 | 產品介紹 | 英 | 0s 原版設計／30s 拇指覆蓋與指環／60s 新 Velcro | 字幕 |
| mlW0vCdc6t4 | クラッククライミングの練習 素手とグローブの比較 | 6DME | 2022-04-24 | 2:41 | 日本（天然木練習路線，很滑） | 6DME（一般攀岩者） | 比較實測 | 日 | 6s 赤手（很痛）／60s BD（薄但舒適）／109s Ocun Lite（厚、抓得好） | 章節＋說明欄 |
| qYOuYhwRzQs | [블랙다이아몬드] 크랙 재밍 글러브 | 블랙다이아몬드코리아 | 2020-05-08 | 4:36 | — | BD | 產品介紹 | 韓 | 60–90s 薄、無縫、側邊與拇指包覆 | 韓文字幕 |
| DbnofcWjVts | Which Crack Climbing Technique is Strongest? | Wide Boyz | 2021-10-07 | 17:49 | 室內（拉力計） | Tom、Pete | 實驗 | 英 | 0s 指尖／278s 指／416s ring lock／556s paddle／683s 手塞（說明欄：比較手套 vs 赤手） | 章節＋字幕 |
| LtzIW70H-2Y | Review - Wideboyz Crack Gloves | Matt Heason | 2023-11-14 | 1:37 | 英國 The Climbing Works | Dylan | 評測 | 英 | 搭配 heason.net 文字評測（從 0s） | 說明欄＋全文 |
| OaRRCa3QFpk | REVIEW GUANTES de Fisuras OCUN Pros y Contras | Gonzalo Climb | 2022-08-07 | 4:34 | — | Gonzalo | 評測 | 西 | 說明欄：個人使用心得（從 0s） | 說明欄 |

不收：
- Wild Country Ep.6 Taping（2012／2013）、Climbing Tech Tips（2018）、Metolius Beth Rodden（2015）、BetaClimbers（2019）、Misty Mountain（2014）、OR Adam George（2012）、Nina Caprez（2017，60 秒）、EpicTV OR Splitter（2015）、ElevatedReality 手套比較（2019）：都在 2020 年以前，或短於 90 秒。
- 【山岳医】たけちゃんねる〈【エイド！？】クラックグローブについて〉（j8oXrYoTtBs，2024-09-09，12:54）：主題相關，但字幕 429、說明欄只有頻道介紹，沒有內容描述，無法查證示範重點，列為 🟡 待補。

## 四、裂隙訓練與學習路徑

### 教學重點

**練習的優先順序：先真的去塞**

- Pete（Wide Boyz 通訊〈80% of crack strength comes from one thing〉，2026-07-30）✅
  - 「80% of my progress and strength in jamming has come from actually doing the thing… You might get 20% stronger」
  - 剩下 20% 可以靠這些補：前臂反握彎舉、反握二頭彎舉、Bachar 梯（雙手放在每階正中、一手在另一手正上方）、在小裂隙盒上做負重。
- Lattice Part 1（2020-02-16）75s：Tom Randall 說裂隙訓練轉移到一般攀登的效果「limited… really high degree of specificity」✅

**沒有裂隙也能練的（Lattice〈How To Train With No Cracks!〉，2020-02-18；Wide Boyz 通訊 2026-02-22）**

| 練法 | 細節 | start / 來源 |
|---|---|---|
| 地板槓片模擬手塞 | 手平放在槓片上，用拇指和手內在肌把槓片提起來，練手塞會用到的拇指與蚓狀肌 | Lattice 0s、175s ✅ |
| 滑輪減重 | 在自製屋簷裂隙做死吊，減重後慢慢加回體重 | Lattice 269s ✅；Climbing.com（2024-10-07）作者一開始赤手要減 53 磅才吊得住，Pete 建議「Do some deadhang training in the roof crack, exactly like you would when finger boarding, but with jams」✅ |
| 肱橈肌 | 反握彎舉、靜態腕伸，因為指塞與 cup & twist 手塞會在「thumb side」這一側爆前臂 | Lattice 433s ✅；Wide Boyz 通訊 ✅ |
| 鎖臂 | 單臂鎖 5–10 秒換手，持續 30–60 秒；雙手盡量靠身體中線，模擬裂隙 | Wide Boyz 通訊 ✅；Lattice 260s〈Lockdown〉✅ |
| Bachar 梯／campus 大點 | 手放正中，一手在另一手正上方 | Wide Boyz 通訊 ✅ |

**複製品訓練（replica）與 crack machine**

- 練哪種尺寸：Lattice × Wide Boyz（2020-11-01）章節 120s〈Replica training〉、528s〈What size of crack to train?〉、824s〈cross-training〉✅
- Century Crack 的地窖訓練：Wide Boyz（2020-11-01）有 Century Box、雙拳疊、腿塞訓練器、kneebar 仰臥起坐機等章節 ✅
- 材料與尺寸：
  - Climbing.com〈DIY: How to Build A Crack Machine〉（Anthony Johnson，2022-02-07）：「Fingers are .5"-1.35", Hands 1.35"-2.5", Fists 2.5"-3.75", and Off-width 3.75"-12"」。第一次做建議「start with a parallel hand-size crack or a varied crack that ranges from small to cupped hands」✅
  - 依手大小決定寬度：Climbing.com〈Ramshackle Hand Jams〉（Dakota Walz，2020-04-29）「I have smaller hands that normally fit down to a wide No. 1 size, so I'm going to make my trainer about 1.75-inches wide… When in doubt, go a little tight」✅
- 木頭和岩石的差別：
  - 木頭比較光滑，Ramshackle 說做好的訓練器會比較光滑、比較難 ✅
  - 解法一：Dennis Robertson（2021-11-26）60s 在木頭上貼滑板止滑帶 ✅
  - 解法二：Wide Boyz 的 volume 有軟橡膠內襯（TrainingBeta #144）✅
  - 6DME（2022）說天然木練習路線「凄く滑る」✅
- 現成產品：
  - Wide Boyz Crack Trainer（with Soft Grip）：EpicTV、Bananafingers 的商品頁，只看了搜尋摘要 🟡
  - Splitter Climbing volumes（2020-04-05，產品介紹）✅
- 自製實例：
  - Xinran Lu 獨立式機（2021-01-03，說明欄附設計與材料 PDF）✅
  - dannyami 可摺 3 m 機與 jam board（2020-04／05）✅
  - Crack Generator 3000：可調寬度，Medium 文（2022-02-21）寫了導軌、Teflon、鏈條調整機構 ✅
  - Brant Hysell 地窖（2024-02-23）255s 用 2×8 木板做細手寬度 ✅
  - eshen 在 Austin 停車場自製裂隙首攀（Substack，2024-10-14）：朋友車庫的 crack machine「slowly gaining an intuition」✅

**岩館裂隙牆**

- 岩館很少有裂隙的原因：
  - Wide Boyz〈Climbing The Tallest Indoor Crack Climb〉（2026-04-26）255s：「the main reason cracks aren't more common in gyms is simple, lack of knowledge. Both in how to jam and how to set lines」✅
  - 同片說他們和 360 Holds 合作做「Crack Generator」volume，讓一面裂隙同時有純裂隙線和混合線 ✅
- 岩館當外岩課的門檻：日本 KO-WALL 滋賀規定，要先能爬完館內 5.8 手裂隙課題，才能報名外岩裂隙講習（Sei's Nature Study，2024-12-01，說明欄＋章節）✅
- 練習壁的規則設計：日本ランナウト（石田祐城，2022-02-26）說明欄 ✅
  - ①「手はジャミングのみ、足は自由」
  - ②「中央のクラックのみ。足はフットジャム」
  - 這是用規則逐步收緊的練法，可以直接搬到台灣岩館。
- CMC Denver 2026 課程：先在 Boulder Rock Club 岩館上一晚（樓上多種寬度、樓下一條長的完美手裂隙），再去 Boulder Canyon。課程說「Crack-specific gloves or tape are recommended even for the gym」✅
- Movement Gyms 部落格（無日期）🟡：「Gym cracks let you practice technique in a controlled environment, where you can find specific sizes」

**頂繩、新手路線、學習路徑**

- 分級進度：Pete〈5.5 to 5.14: A beginners guide to Elite Cracks〉（影片 2026-09-14＋通訊）✅
  - 5.5→5.10 擋住人的不是力量，是裝備管理和基本手塞。
  - 「Aim to place gear in 10 to 30 seconds, not 2+ minutes」
  - 後面的分級段落只讀到摘要 🟡
- 先頂繩反覆刷同一段：MP〈Easy cracks for small hands?〉（2024-06-27）「what's the harm in lapping the same 20' section over and over? … pull on the rope until you get to the part of the route you want」✅
- 小手的路線選擇：MP〈Resources for little hands and crack climbing?〉（2024-06-27）✅
  - 「Look for 5.11- rated climbs in the creek. They'll likely be 5.9 for her」
  - 有女性回覆：「I have a similar hand size and was pushed towards this in the beginning… when all the 5.10's were too big for my hands」
  - 「The joke when I lived in Moab was that someone needed to publish "The Ladies' Guide to the Creek"」
  - 推薦 Pete 的書，但「it's not really for reading as much as referencing」；也有人自己用廢木頭做小裂隙配書練。
- 同主題 Climbing.com〈10 Commandments〉第 1 條：「figure out thy hand size」✅
  - IC 的手裂隙多由「hands the size of #2 and #3 cams」的人首攀，所以 #2–#3 定 5.10，#0.75–#1 多半定 5.11。
- 身體大小：Pete（Kristiansund 通訊）說「unless you cannot get your fingertip into the crack past the first joint, there is ALWAYS a crack technique you can use」✅
- 大手爬指縫：今日からきみは！！（日文）作者手大、指粗，從避開指縫到「人並み」爬得上。他的論點是同一條指縫，因指粗細不同難度差很多；又舉 Meltdown 這條極細裂隙完攀者多為女性為例，說這「かもしれない」和指頭粗細有關（作者推測）✅

**課程（各國）**

| 地區 | 課程 | 重點 | 來源狀態 |
|---|---|---|---|
| 美國 Indian Creek | Red River Adventures〈Classic Indian Creek Crack Camp〉，3 天，Mary Eden（AMGA SPI） | 指縫到拳、寬縫策略、裝備、膠帶手套、先鋒；建議 5.9 體能 | ✅；學員心得影片 zdegY0z0fMI |
| 美國 Indian Creek | Peak Mountain Guides〈Indian Creek Crack Clinic〉，3 天 | 第一天在 Supercrack Buttress 上 #2 手裂隙，先試、再教膠帶手套、手腳塞，「finding their jam」 | ✅ |
| 美國 Indian Creek | Moab Cliffs & Canyons〈Take the Lead Ladies!〉女性裂隙營 | Pamela Shanti Pack、Gisely Ferraz 帶；第一天各尺寸、第二天模擬先鋒 | ✅ |
| 美國 Colorado | CMC〈TCS Intro to Crack Climbing – Denver 2026〉 | 岩館一晚＋Boulder Canyon 一天 | ✅ |
| 加拿大 Squamish | Kinley Aitken Guiding〈Wide Cracks Clinic〉 | 只確認有開課，課綱頁沒抓到 | 🟡（clinics 頁只見繩索救援課） |
| 英國 | Cornwall Sea Cliff Climbing〈WIDECRAFT〉2 天 | 手塞到窄煙囪；要能以第二攀爬 HVS | ✅ |
| 線上 | Wide Boyz〈Global Crack School〉30 天課程 | 2027 春季重新開放 | ✅ |
| 日本 小川山 | 鳴海玄希（IFMGA）〈小川山クラック講習会〉 | 妹岩一帶：カサブランカ 5.10b、龍の子太郎 5.9、愛情物語 5.8；對象 5.7 以下的初學者 | ✅ |
| 日本 小川山 | カモシカスポーツ〈秋のクラッククライミング講習〉（2026-10，已額滿） | 給平常爬運動攀登、第一次碰裂隙的人 | ✅ |
| 日本 小川山／瑞牆 | 小俣智範（serow-guide）〈クラッククライミング講習〉 | 13,000 日圓＋雜費，一日，3 人；手塞、腳塞基礎 | ✅ |
| 日本 湯川 | KORのクライミングNOTE 心得影片（2021-06-28） | 說明欄提到膠帶、塞 | ✅（說明欄） |
| 韓國 | K Climbing Company（김종식）선등자교육、크랙등반 강습 | Y1wU-kio78I（2021，在仁壽 a→友情 a→多用途裂隙上課）、JkkwRm5DpcA（2023 入門 1 부） | ✅（說明欄） |
| 台灣 | TAIWAN368〈東引傳統攀登三日初階訓練〉 | 標題寫「裂隙攀登・Cam Nut・確保站」 | 🟡（頁面主文是選單，課綱沒抓到） |
| 台灣 | 百合搖滾 | 課程前言說初階重點是「支點架設」與「系統操作」，不是裂隙技巧 | ✅（裂隙技巧不是重點這件事值得寫進文章） |

**受傷預防（手背、腳踝、手指、膝）**

- 腳踝、足部：
  - 足科醫師 Tom Biernacki, DPM（Michigan 診所衛教文，2026-04 更新）✅：「Foot jams place the ankle in forced dorsiflexion and the foot in extreme abduction stress. Ankle sprains, capsular injuries, and metatarsal stress from repeated jamming are common in crack climbers. The medial ankle structures are particularly stressed」
  - 同一篇也說攀岩鞋太緊會造成前足問題。這是診所的衛教文，有利益關係。
  - Hooper's Beta〈How to Fix Ankle Pain for Climbers〉（2021-11-15）章節：52s 解剖與受傷機轉、194s 風險因子、315s 排除撕脫性骨折。這支是一般攀岩的腳踝傷，不是裂隙專講 ✅
- 腳塞卡住、墜落時腳留在縫裡：見第一節 MP 2021 膝部骨折案例。
- 膝蓋卡寬縫：
  - AAC 2025 ✅
  - Climbing.com 2026：作者 2022 年在 South Platte 倒掛寬縫抱石做 knee lock，「Rock immediately locked onto bone」✅
- 競賽、岩館人工裂隙卡手：Wide Boyz〈Climber Stuck In Crack Needs Rescuing〉（2022-04-28）分析 Meiringen 世界盃裂隙賽：選手腳回不去、卡在塞點裡吊著。章節 267s〈The principles〉講定線原則（不能做出鎖骨的塞點）✅
- 手背、皮膚：見第三節。
- 手指：MP〈Help with a friendly argument: hand jamming and injuries〉（Reddit）讀不到 ⚪。手指滑輪傷的一般資料不屬於裂隙專題，這裡不收。
- 恢復耐受度：Lattice 150s 說停爬後第一週一樣痛。Pete 說「Stop before it actually hurts!… your crack tolerance starts back at zero」✅

### 影片（訓練、學習紀錄、岩場實錄）

| video_id | 標題 | 頻道 | upload_date | 長度 | 岩場/地點 | 人物 | 類型 | 語言 | 示範重點＋start 秒數 | 查證方式 |
|---|---|---|---|---|---|---|---|---|---|---|
| B3xHMkcOAVc | Crack Climbing Training: How To Train With No Cracks! | Lattice Training | 2020-02-18 | 12:54 | 室內 | Tom Randall | 訓練教學 | 英 | 0s 槓片模擬手塞／175s 漸進／269s 滑輪／433s 肱橈肌／510s deep lock | 章節＋字幕 |
| 6XhyKPseZ0g | Training for Climbing Cracks + Example Exercises: Part 1 | Lattice Training | 2020-02-16 | 12:58 | 室內 | Tom Randall | 訓練教學 | 英 | 75s 轉移有限／150s 停爬後皮膚回痛／260s lockdown／506s 休息／595s 牆上練習 | 章節＋字幕 |
| nvOZZ8omsIE | Lattice Takes on The Wideboyz: Crack Training | Lattice Training | 2020-11-01 | 23:15 | 室內 | Tom、Pete | 訓練教學 | 英 | 120s 複製品／528s 練哪種尺寸／824s 交叉訓練／1161s 裂隙 vs face 的優先順序 | 章節＋字幕 |
| -nIQr0pfdlE | How We Trained For The World's Hardest Offwidth Climb | Wide Boyz | 2020-11-01 | 17:26 | Sheffield 地窖 | Tom Randall | 訓練實錄 | 英 | 0s Century Box／279s 雙拳疊／367s 腿塞訓練器／763s kneebar 仰臥起坐 | 章節＋字幕 |
| N1qossrIRAo | Building a Crack Cellar with the WIDE BOYZ! | The Gravity Lab - Brant Hysell | 2024-02-23 | 17:49 | 美國自家地窖 | Brant Hysell、Pete | 自製 | 英 | 75s Tom 的客廳 crack machine 起源／255s 各寬度用料 | 字幕 |
| fSXfmmIZ--E | How I Built a Free Standing Crack Machine | Xinran Lu | 2021-01-03 | 6:30 | 自家 | Xinran Lu（一般攀岩者） | 自製 | 英 | 15s 3 m 設計／120s 木料厚度讓雙拳太寬的問題（說明欄附材料 PDF） | 字幕＋說明欄 |
| n-Ioa96phCI | 3 meter collapsible crack machine | dannyami | 2020-05-02 | 4:40 | 自家 | dannyami | 自製 | 英 | 說明欄：組裝式（從 0s） | 說明欄 |
| IuUxeAm49Ag | How to build a Jam Board, Training for crack climbing. | dannyami | 2020-04-27 | 6:32 | 自家 | dannyami | 自製 | 英 | 說明欄：手塞用的可攜板（從 0s） | 說明欄 |
| w127uyTugxA | Crack Climbing Trainer | Dennis Robertson | 2021-11-26 | 12:35 | 帆船俱樂部後院（國家未標） | Dennis Robertson（一般攀岩者） | 自製＋學習紀錄 | 英 | 45s 戴 Wide Boyz 手套練／60s 木頭貼滑板止滑帶 | 字幕 |
| babmu1O19As | クラックマシーントレーニング | sunny side climbing yazaki | 2022-05-09 | 4:24 | 日本自家 | yazaki | 自製訓練 | 日 | 說明欄：在家用塞的方式長時間移動，缺點是寬縫練不到全身（從 0s） | 說明欄 |
| LcmasJ_seUA | ランナウトのクラック練習壁① | 石田祐城 | 2022-02-26 | 2:09 | 日本岩館（ランナウト） | 石田祐城 | 練習 | 日 | 說明欄規則：手只能塞、腳自由（從 0s） | 說明欄 |
| 9EWEE-FnVL0 | ランナウトのクラック練習壁② | 石田祐城 | 2022-02-26 | 3:19 | 同上 | 同上 | 練習 | 日 | 說明欄規則：只用中央裂隙，腳只能腳塞 | 說明欄 |
| UtH5b6LJoD4 | クラック外岩講習のための練習（KO-WALL滋賀リード店） | Sei's Nature Study | 2024-12-01 | 10:14 | 日本 KO-WALL 滋賀 | 一般攀岩者 | 學習紀錄 | 日 | 0s 手裂隙 5.8（講習門檻）／162s 拳裂隙／367s 再挑戰 | 章節＋說明欄 |
| 9jJG0nXS1EQ | Climbing The Tallest Indoor Crack Climb | Wide Boyz | 2026-04-26 | 18:41 | 岩館 | Pete、Tom | 岩館定線 | 英 | 62s 系統設計／248s 教育岩館社群／255s 岩館少裂隙是因為缺知識／618s 主線 | 章節＋字幕 |
| _AT8-hMEgt4 | The Hardest Indoor Crack We've Ever Tried | Wide Boyz and Depot Climbing | 2026-03-17 | 33:03 | 英國 Depot 岩館 | Pete、Tom | 實錄 | 英 | 133s 技巧／213s 熱身策略／372s 首試 | 章節 |
| -ocSfP62RLA | Pro Climber Coaches Gym Climber… 35 Days | Geek Climber | 2022-03-31 | 10:46 | 岩館 | 一般抱石者 | 學習紀錄 | 英 | 233s 初練疼痛／414s 倒退爬練習／495s 完攀 | 章節 |
| mvr0oPGpWRI | Transforming Beginner to Big Wall Climber in 5 Days | Wide Boyz | 2023-10-15 | 27:24 | 岩館→戶外大岩壁 | Mike Boyd | 學習紀錄 | 英 | 75s 先在岩館人工裂隙學該做與不該做的 | 字幕 |
| mHErzqpYKqM | secrets from the crack cellar: HOW TO CRACK CLIMB: 5 techniques with Tom Randall | Anna Hazelnutt | 2021-09-29 | 23:31 | Sheffield 地窖 | Anna Hazelnutt（女）、Tom | 教學 | 英 | 183s 寬縫（wide pony）／406s 窄煙囪／619s 屋簷手裂隙／854s paddle／1043s cupped hands | 章節＋字幕 |
| 5SfTjWiFYFA | Who's the STRONGEST crack climber? | Stefano Ghisolfi | 2023-03-30 | 24:25 | Sheffield 地窖 | Stefano Ghisolfi | 實錄 | 英 | 106s 腳法挑戰／812s 耐力 | 章節 |
| 0jIKMrVH0_c | Training Crack Climbing with the World's Best Climber | Wide Boyz | 2025-10-12 | 31:15 | 斯洛維尼亞岩館 | Janja Garnbret（女） | 訓練實錄 | 英 | 69s 基本塞法／270s jamming layback／697s 世界盃裂隙 | 章節＋字幕 |
| 5GqhbbaPdbg | 5.5 to 5.14 Crack Climbing: A Beginners Guide to Elite Level Cracks | The Wide Boyz Show | 2026-09-14 | 22:40 | （通訊朗讀） | Pete | 學習路徑 | 英 | 說明欄：每個級距該練什麼（從 0s；字幕 429） | 說明欄＋通訊摘要 |
| zdegY0z0fMI | Crack Climbing Camp with Mary! | Active Alexis | 2022-02-03 | 14:25 | Indian Creek | Alexis（女） | 課程心得 | 英 | 0s 營隊概要／214s 抵達／526s 學技巧／615s 膠帶手套 | 章節＋字幕 |
| c4chvHGx3xk | We Tried Crack Climbing For the First Time | Knowles and Company | 2025-04-02 | 9:59 | Indian Creek | Lincoln Knowles（岩館抱石出身三年） | 學習紀錄 | 英 | 72s 現地 onsight／146s ring lock／585s「在岩館抱石三年才發現傳攀」 | 章節＋字幕 |
| H-Aqt96SR6o | Learning to Crack Climb in Indian Creek | AccessAlpine | 2023-10-12 | 6:25 | Indian Creek〈Batteries Not Included〉 | 一般攀岩者 | 學習紀錄 | 英 | 說明欄：可能是 IC 最簡單的路線，適合當 5.10 前的入門（從 0s） | 說明欄 |
| xMiDW1jprMA | Squamish Rock Climbing, Klahanie Crack 5.7 | Alpine Gremlin | 2022-09-24 | 6:40 | Squamish | Alpine Gremlin | 實錄 | 英 | 說明欄：〈Spirit of Squamish〉第一段，非常 splitter（從 0s） | 說明欄 |
| AE6BOBkTeRE | Climbing Super Hands (aka Ranger Crack) 5.8 | Daniel S | 2023-08-28 | 7:52 | Yosemite | 一般攀岩者 | 實錄 | 英 | 說明欄：開始爬裂隙後一直想爬的路線（從 0s） | 說明欄 |
| FFFtrw-lgRU | The Last Forgotten Art, Crack Climbing | BMC TV | 2023-10-09 | 15:04 | 英國 Peak（Roaches／Ramshaw gritstone） | Vicky 等多位英國攀岩者 | 紀錄片 | 英 | 58s off whips／270s 封城時在客廳自製吊掛系統／471s Green Crack／745s Ramshaw Crack | 章節＋字幕 |
| -E1hwhUDsXU | How to be a Crack Master | Wide Boyz | 2022-08-14 | 16:54 | 英國 Roaches／Ramshaw（Cracker's Dozen 清單） | Tom、Pete | 實錄 | 英 | 133s Green Crack HVS／277s Brown's Crack E1／450s「ankle territory」 | 章節＋字幕 |
| 8jJfA5s1zEc | Girl Trad Climbing on Amazing Cracks, Kottenheim, Germany | 2 Small Adventurers | 2021-07-18 | 18:58 | 德國 Kottenheim／Ettringen（玄武岩） | 女性攀岩者（頻道主） | 實錄 | 英 | 說明欄（從 0s） | 說明欄 |
| NYEsr6X1R3Y | 【攀岩进阶技巧】裂缝攀岩的初学者指南（上） | 知岩片语 Climbing Whispers | 2020-03-13 | 12:00 | 中國 | 邵远、炜轶 | 教學 | 中（簡） | 71s 為什麼爬裂隙／235s 手縫／419s 指縫／521s 寬指縫／566s 拳縫／657s 學員體驗 | 章節 |
| He-hdiBBilU | 【攀岩进阶技巧】裂缝攀岩的初学者指南（下） | 知岩片语 Climbing Whispers | 2020-03-17 | 7:27 | 中國 | 同上 | 教學 | 中（簡） | 28s hand stack／182s 窄煙囪／288s 煙囪／345s 爬縫裝備 | 章節 |
| JXjjh0vYtQw | 龍洞「翻天手」傳攀 | rock6879 | 2022-03-02 | 6:38 | 台灣 龍洞 | rock6879（一般攀岩者） | 實錄 | 中 | 說明欄：指裂隙變寬、岩面潮濕；先確認前兩個裂隙的岩楔尺寸（從 0s） | 說明欄 |
| nTapvs7T_Fg | 龍洞「曙光裂隙」 | rock6879 | 2024-11-25 | 4:47 | 台灣 龍洞 | rock6879 | 實錄 | 中 | 說明欄：潮濕時「爬起來很抖」；近三週沒爬，「塞手的動作還是有幫助」（從 0s） | 說明欄 |
| CdhEuYj2fMY | Taiwan Long Dong Climbing Beta, Twilight Crack 曙光裂隙 5.11b 傳攀 | yu lin lai | 2025-12-26 | 21:10 | 台灣 龍洞 第一洞 | yu lin lai | 實錄（beta） | 中／英標題 | 說明欄只有日期 2025/12/14（從 0s；示範重點未查證） | 說明欄（弱） |
| YNY4JXLX5gk | Taiwan Long Dong Climbing Beta, Shield 盾 5.11b 傳攀 | yu lin lai | 2025-12-08 | 12:20 | 台灣 龍洞 音樂廳 | yu lin lai | 實錄 | 中／英標題 | 說明欄空白（示範重點未查證） | 標題（弱） |
| Ci1E4Enm3_o | How to Fix Ankle Pain for Climbers | Hooper's Beta | 2021-11-15 | 17:42 | — | Hooper's Beta 頻道主 | 受傷 | 英 | 52s 解剖與機轉／194s 風險因子／315s 排除撕脫性骨折 | 章節 |
| LCO2zPQMbk8 | Climber Stuck In Crack Needs Rescuing - Wide Boyz Analyse | Wide Boyz | 2022-04-28 | 22:38 | 瑞士 Meiringen 世界盃 | Tom、Pete | 分析 | 英 | 44s 事件／154s 問題／267s 定線原則／625s 安全 | 章節＋字幕 |

不收：
- FirstPersonBeta 的 Squamish〈Exasperator〉、Yosemite〈Jabberwocky〉、〈Lowe Route〉（2018）：在 2020 年以前。
- Altus Mountain Guides〈Exasperator〉（2014）：在 2020 年以前。
- Ben Frank crack machine（2019）、Crack Generator 3000 影片（2017）：在 2020 年以前（文字版收 Medium 2022）。
- Tolipo（2019）：在 2020 年以前。
- Amy Darling〈Creek Week〉（2019-04-11）：在 2020 年以前。
- Magnus Midtbø × Wide Boyz（2019-03-25）：在 2020 年以前。
- EpicTV〈Learning To Crack Climb〉Sophie Whyte（2018）：在 2020 年以前。
- 戶外江〈龍洞 disco大裂隙〉（2026-08-20）、〈曙光裂隙〉（2026-10-06）、沙克強〈龍洞裂隙〉（2024-05-05）：說明欄空白、字幕 429，示範重點無法查證，只列為候選。

## 五、文字來源總表

✅＝讀過全文；🟡＝只讀摘要、說明欄或部分內容；🔴＝沒讀到；⚪＝整條抓取鏈都試過，確認讀不到。

| # | 來源 | 作者/單位 | 日期 | 語言 | 主題 | 狀態 |
|---|---|---|---|---|---|---|
| 1 | [4 easy fixes to solve foot pain in cracks](https://wideboyz.school/newsletters/newsletter-archive/posts/4-easy-fixes-to-solve-foot-pain-in-cracks) | Pete Whittaker | 2026（頁面標 Oct 03, 2026；對應影片 2026-08-29） | 英 | 腳塞、鞋 | ✅ |
| 2 | [3 Secret Weapons for Finger Cracks](https://wideboyz.school/newsletters/newsletter-archive/posts/3-secret-weapons-for-finger-cracks-you-re-missing-one) | Pete Whittaker | 2025-12-30 | 英 | 指縫腳法 | ✅ |
| 3 | [A New FA in Kristiansund and the Golden Takeaway](https://wideboyz.school/newsletters/newsletter-archive/posts/a-new-fa-in-kristiansund-and-the-golden-takeaway) | Pete Whittaker | 2026（頁面日期不確定） | 英 | 手大小與尺寸 | ✅ |
| 4 | [80% of crack strength comes from one thing](https://wideboyz.school/newsletters/newsletter-archive/posts/80-of-crack-strength-comes-from-one-thing) | Pete Whittaker | 2026-07-30 | 英 | 訓練、恐懼管理 | ✅ |
| 5 | [How to Train For Crack Climbing, With No Cracks](https://wideboyz.school/newsletters/newsletter-archive/posts/how-to-train-for-crack-climbing-with-no-cracks) | Pete Whittaker | 2026-02-22 | 英 | 訓練 | ✅ |
| 6 | [5.5 to 5.14: A beginners guide to Elite Cracks](https://wideboyz.school/newsletters/newsletter-archive/posts/5-5-to-5-14-a-beginners-guide-to-elite-cracks) | Pete Whittaker | 2026 | 英 | 學習路徑 | 🟡（只抓到第一段摘要；影片 5GqhbbaPdbg 字幕 429） |
| 7 | [Wild Country Crack School Part 2 – Jamming](https://www.ukclimbing.com/articles/skills/series/wild_country_crack_school/part_2_-_jamming-4638) | Tom Randall／UKC | 2012-05-07 | 英 | 腳塞（經典原理） | ✅ |
| 8 | [Wild Country Crack School Part 4 – Offwidth](https://www.ukclimbing.com/articles/skills/series/wild_country_crack_school/part_4_-_offwidth_cracks-4669) | Tom Randall／UKC | 2012-05-22 | 英 | heel-toe | ✅ |
| 9 | [Foot Jam Agony](https://www.mountainproject.com/forum/topic/120140674/foot-jam-agony) | MP 論壇 | 2021-01-01 | 英 | 腳痛、鞋、止痛藥爭議 | ✅ |
| 10 | [Foot jamming pain](https://www.mountainproject.com/forum/topic/125880516/foot-jamming-pain) | MP 論壇（教人者發問） | 2024-03-28 | 英 | 腳痛、腳跟下沉 | ✅ |
| 11 | [Type 4 Tibial Eminence Fracture caused by foot jam](https://www.mountainproject.com/forum/topic/121742876/type-4-tibial-eminence-fracture-caused-by-foot-jam) | MP 論壇 | 2021-12-05 | 英 | 受傷 | ✅ |
| 12 | [La Sportiva TC Pro II – Gwen Lancashire](https://mountainequipment.com/blogs/product-reviews/la-sportiva-tc-pro-ii-gwen-lancashire) | Gwen Lancashire（女，Blue Mountains） | 2024-10-09 | 英 | 鞋 | ✅ |
| 13 | [La Sportiva TC Pro Review](https://www.outdoorgearlab.com/reviews/climbing/climbing-shoes/la-sportiva-tc-pro) | OutdoorGearLab | 2025-11-24 | 英 | 鞋 | ✅ |
| 14 | [How to Layback Climbing](https://www.climbing.com/skills/how-to-layback-climbing/) | Climbing.com | 2022-11-17 | 英 | layback（總論已引，這裡補細節） | ✅ |
| 15 | [How to Stem Climbing](https://www.climbing.com/skills/how-to-stem-climbing/) | Climbing.com（Jesse Huey 等） | 2023-12-28 | 英 | 對撐 | ✅ |
| 16 | [Why the hate on laybacking?](https://www.mountainproject.com/forum/topic/123523948/why-the-hate-on-laybacking) | MP 論壇 | 2022-12-02 | 英 | layback 爭議 | ✅ |
| 17 | [Rattley fingerlocks in corner cracks: just layback?](https://www.mountainproject.com/forum/topic/203408590/rattley-fingerlocks-in-corner-cracks-just-layback) | MP 論壇 | 2026-07-13 | 英 | 內角、換塞、臂長、小手 | ✅ |
| 18 | [How to Lieback without ending up on next week's Weekend Whipper?](https://www.mountainproject.com/forum/topic/115181476/how-to-lieback-without-ending-up-on-next-weeks-weekend-whipper) | MP 論壇 | 2018-09-09 | 英 | layback 放保護 | 🟡（抓到了，2020 年以前，沒有引用） |
| 19 | [龍洞傳攀：裂隙入門路線福利社](http://kateberrysblog.blogspot.com/2020/09/blog-post_13.html) | kateberry（女） | 2020-09 | 中 | 龍洞內角、layback、煙囪 | ✅ |
| 20 | [Best Crack Climbing Gloves](https://99boulders.com/best-crack-climbing-gloves) | 99Boulders | 2021-08-10 | 英 | Ocun vs OR | ✅ |
| 21 | [Best Climbing Gloves of 2026](https://treelinereview.com/gearreviews/best-climbing-gloves) | Treeline Review | 2026-09-28 | 英 | OR Splitter II | ✅ |
| 22 | [Black Diamond Crack Gloves have it covered](https://www.alpinist.com/mountain-standards/black-diamond-crack-gloves-have-it-covered-from-hand-cracks-to-offwidth-sizes) | Derek Franz／Alpinist | 2021-12-17 | 英 | BD 手套 | ✅ |
| 23 | [9 Best Climbing Gloves](https://www.climbing.com/gear/9-best-climbing-gloves/) | Climbing.com | 2026-01-06 | 英 | G7 Hand Jam | ✅ |
| 24 | [Review – Wideboyz Crack Gloves](http://www.heason.net/reviews/2023/11/14/Review__Wideboyz_Crack_Gloves/) | Heason | 2023-11-14 | 英 | WB 手套 | ✅（Exa） |
| 25 | [Black Diamondのクラックグローブを買った](https://takato77.hatenablog.com/entry/2020/11/12/205207) | takato77 | 2020-11-12 | 日 | BD 手套心得 | ✅ |
| 26 | [テーピング vs クラックグローブ論争｜男は黙って素手ジャミング！？](https://kyokarakimiwa.com/bare-hand-jam/) | 今日からきみは！！ | 2021-08-30（2025 更新） | 日 | 赤手、膠帶、手套、aid 爭議 | ✅ |
| 27 | [指の太い人こそフィンガーだ！](https://kyokarakimiwa.com/finger-crack-vs-hutoiyubi/) | 今日からきみは！！ | 2025 | 日 | 大手、指縫、膠帶厚度 | ✅ |
| 28 | [How to Make Tape Gloves for Crack Climbing](https://www.climbing.com/skills/better-tape-gloves/) | Jean-Pierre Ouellet／Climbing.com | 2025-08-09（原刊 2012） | 英 | 膠帶 | ✅ |
| 29 | [Crack Climbing Basics: Tape Gloves](https://www.alpineinstitute.com/crack-climbing-basics-tape-gloves/) | AAI | 未標 | 英 | 膠帶（骨架＋面板法） | ✅ |
| 30 | [Taping for Hand and Fist Cracks](https://publications.americanalpineclub.org/articles/12198516600/Taping-for-Hand-and-Fist-Cracks) | AAC Publications | 經典（年代未標） | 英 | 膠帶原理、皮膚 | ✅ |
| 31 | [The 10 Commandments of Indian Creek](https://www.climbing.com/videos/commandments-indian-creek/) | Julie Ellison／Climbing.com | 2025-06-21 版 | 英 | 手大小、膠帶、皮膚 | ✅ |
| 32 | [크랙등반과 째밍기술 용어정리](https://blog.naver.com/PostView.naver?blogId=wooltraveler&logNo=222656083847) | wooltraveler（naver） | 2022-02-23 | 韓 | 鞋、腳塞、layback、膠帶 | ✅ |
| 33 | [크랙 등반 / 손.발재밍, 레이백, 짝힘등](https://m.cafe.daum.net/withclimbing5.14/PNtC/11) | 大邱 With Climbing Center | 未標 | 韓 | 基礎 | 🟡（抓到部分，沒有引用） |
| 34 | [DIY: How to Build A Crack Machine](https://www.climbing.com/lates-news/crack-fix-how-to-build-a-home-crack-training-system/) | Anthony Johnson／Climbing.com | 2022-02-07 | 英 | crack machine | ✅ |
| 35 | [Ramshackle Hand Jams](https://www.climbing.com/skills/ramshackle-hand-jams-how-to-build-easy-cheap-and-portable-crack-trainers/) | Dakota Walz（小手）／Climbing.com | 2020-04-29 | 英 | 可攜訓練器 | ✅ |
| 36 | [How To Practice And Train For Crack Climbing, Build A Crack Machine](https://www.climbing.com/skills/training-how-to-improve-hand-jam-strength-for-roof-cracks/) | Climbing.com | 2024-10-07 | 英 | 屋簷死吊、Pete 建議 | ✅ |
| 37 | [How to Build Your Own Crack Climbing Machine](https://gripped.com/indoor-climbing/how-to-build-your-own-crack-climbing-machine/) | Gripped | 未標 | 英 | 獨立式框架 | ✅ |
| 38 | [How to build a crack climbing machine](https://medium.com/@jeroenvanzeeland/how-to-build-a-crack-climbing-machine-db7027a407e8) | Jeroen van Zeeland | 2022-02-21 | 英 | 可調寬度 | ✅（Exa） |
| 39 | [The Beginnings of a Crack Addiction](https://eshen.substack.com/p/the-beginnings-of-a-crack-addiction) | eshen | 2024-10-14 | 英 | 一般攀岩者自製訓練到首攀 | ✅ |
| 40 | [TBP 144: Pete Whittaker](https://trainingbeta.com/media/pete-whittaker/) | TrainingBeta | 約 2019 | 英 | 地窖訓練 | ✅（2020 年以前，只當原理） |
| 41 | [Lattice and Wideboyz: Training, Replicas and Crack vs Face](http://latticetraining.com/blog/lattice-and-wideboyz-training-replicas-and-crack-vs-face) | Lattice | 2021-03-21 | 英 | 複製品訓練 | 🟡（文章只是影片簡介，內容看影片 nvOZZ8omsIE） |
| 42 | [Resources for little hands and crack climbing?](https://www.mountainproject.com/forum/topic/126442328/resources-for-little-hands-and-crack-climbing) | MP 論壇 | 2024-06-27 | 英 | 小手、女性 | ✅ |
| 43 | [Easy cracks for small hands?](https://www.mountainproject.com/forum/topic/126442352/easy-cracks-for-small-hands) | MP 論壇 | 2024-06-27 | 英 | 小手路線、頂繩刷段 | ✅ |
| 44 | [Prescription—Knee Stuck in Crack](https://americanalpineclub.org/news/2025/3/12/prescriptionknee) | AAC | 2025-03-12 | 英 | 卡膝 | ✅ |
| 45 | [How to Avoid Getting Your Knee Stuck](https://www.climbing.com/skills/trad-climbing/how-to-avoid-getting-your-knee-stuck-crack-climbing/) | Sam MacIlwaine（女）／Climbing.com | 2026-09-23 | 英 | 卡膝 | ✅ |
| 46 | [Rock Climbing and Bouldering Foot Injuries: Foot Jam](https://michiganfootdoctors.com/rock-climbing-bouldering-foot-injuries-foot-jamming-ankle) | Tom Biernacki, DPM | 2026-04 | 英 | 腳踝 | ✅（診所衛教，有利益關係） |
| 47 | [Climbing with Jewelry is Dangerous](https://www.alpineinstitute.com/climbing-with-jewelry-is-dangerous/) | AAI | 未標 | 英 | 戒指撕脫傷 | ✅ |
| 48 | [Crack Climbing Hand Care](https://rhinoskinsolutions.com/pages/crack-climbing-hands) | Rhino Skin（廠商） | 未標 | 英 | 皮膚 | 🟡（行銷頁，只引受傷部位） |
| 49 | 課程頁：[Red River Adventures](https://redriveradventures.com/crack-camp/indian-creek-clinic)、[Peak Mountain Guides](https://peakguides.com/courses/indian-creek-crack-clinic)、[Moab Cliffs & Canyons 女性營](https://cliffsandcanyons.com/take-the-lead-ladies-crack-climbing-clinic)、[CMC Denver 2026](https://cmc.org/community/front-range-groups/denver/course-templates/tcs-intro-to-crack-climbing-denver-1/tcs-intro-to-crack-climbing-denver-2026)、[WIDECRAFT](https://cornwallseacliffclimbing.co.uk/widecraft-jamming-offwidth-crack-climbing-skills-2-day-workshops)、[Global Crack School](https://wideboyz.school/global-crack-school)、[鳴海玄希](https://genkinarumi.com/ogawayama-crack-climbing-clinic/)、[カモシカスポーツ](https://kamoshika.co.jp/news/202610ogawayama)、[serow-guide](https://www.serow-guide.com/%E3%82%AF%E3%83%A9%E3%83%83%E3%82%AF%E3%82%AF%E3%83%A9%E3%82%A4%E3%83%9F%E3%83%B3%E3%82%B0%E8%AC%9B%E7%BF%92/)、[百合搖滾課程前言](https://www.wildlily.rocks/about-the-course) | 各單位 | 2024–2026 | 英／日／中 | 課程 | ✅ |
| 50 | [Kinley Aitken Wide Cracks Clinic](https://kinleyaitkenguiding.com/store/p/wide-cracks-clinic)、[TAIWAN368 東引](https://www.taiwan368368.com.tw/item/dongyin-traditional-climbing) | — | — | 英／中 | 課程 | 🟡（課綱沒抓到） |
| 51 | [Arc'teryx Academy: Crack Climbing with Will Stanhope](https://themountainschool.com/program/arcteryx-climbing-academy-crack-climbing-with-will-stanhope) | Canada West Mountain School | — | 英 | Squamish 課程 | ⚪（404 Page not found） |
| 52 | Reddit：r/tradclimbing〈Foot-jamming and bad ankles?〉、r/climbing〈How to prepare ankles for crack climbing?〉、r/tradclimbing〈Help with a friendly argument: hand jamming and injuries〉、r/tradclimbing〈Wide boyz crack gloves〉 | Reddit | — | 英 | 腳踝、手套 | ⚪（Groundlane 要認證／Groundlane HTTP 回空／Keenable 只有搜尋摘要／Exa SOURCE_NOT_AVAILABLE／Tavily Failed to fetch／curl 與 old.reddit .json 被擋） |
| 53 | [Finger, hand and wrist injuries in climbers](https://pmc.ncbi.nlm.nih.gov/articles/PMC13052765)（BMJ Open Sport Exerc Med 2026） | — | 2026-04-03 | 英 | 手部傷害流行病學 | 🟡（curl 抓到的文字裡找不到 crack 或 jam 的段落，推測是 JS 渲染，沒有引用） |
| 54 | tradclimbers.com〈Footwork Tips〉〈Layback Technique〉 | tradclimbers.com | 未標 | 英 | — | 排除（內容空泛，像 AI 生成的彙整文，例如寫「沙漠峽谷的花崗岩裂隙」） |

## 六、覆蓋矩陣

| 子技巧 | 岩場/岩質（≥3） | 人（≥3，含女性、小手） | 教學＋實錄 | 非英語 | 反證/失敗 |
|---|---|---|---|---|---|
| 腳塞 | IC（Sasha）、英國 Sheffield 地窖、挪威 Sogndal、韓國、日本、岩館 ✅ | Pete、Tom、Sasha DiGiulian（女）、Mari Salvesen（女）、Mike Boyd（新手）、Geek Climber（岩館抱石者）、김종식、TAKE ✅；小手：只有 Pete 的通訊間接談到 🟡 | ✅ | 韓（Nc_otfbu0b8）、日（VRc_iFasUc4）✅ | 深塞會卡、止痛藥爭議、太緊的鞋、腳卡導致骨折 ✅ |
| 鞋子 | Yosemite／Valle dell'Orco（Babsi）／英國（UKC）／Blue Mountains（Gwen）✅ | Babsi Zangerl（女）、Gwen Lancashire（女）、Pete、Kellen ✅ | 評測為主 | 日、韓（只看說明欄）🟡 | TC Pro 缺點（OGL）、硬鞋不一定好（MP）✅ |
| Layback／對撐／內角 | Yosemite（Blues Riff）、IC、韓國 仁壽峰／선인봉／龍華山、日本 小川山／瑞牆、Colorado、龍洞（文字）✅ | Mary Eden（女）、Anna Hazelnutt（女）、Janja（女）、Santa Minji（女）、kateberry（女，龍洞）、김종식、Jesse Huey ✅；短臂、小手：MP 一句 🟡 | ✅ | 韓、日 ✅ | layback 倒栽墜落、5.7 被爬成 5.10+、「nothing wrong with laybacking」✅ |
| 膠帶 | IC（Sam Foreman）、岩館、日本、韓國 ✅ | Sam Foreman、Mary Eden 學員 Alexis（女）、Teresa（女）、ちくごん、TAKE（大手、反貼）、김종식 ✅；小手：AAC 說 1.5 吋膠帶比較好貼 ✅ | ✅ | 日、韓 ✅ | 大手不貼、熟練後改赤手、手背不會長繭 ✅ |
| 裂隙手套 | Yosemite／Black Canyon（Alpinist）、西部（99B）、日本、英國 ✅ | Derek Franz、Chris Burkard、6DME、takato77、Gonzalo ✅；女性評測 ❌ | 評測＋產品介紹 | 日、韓、西 ✅ | Ocun 太厚、OR 會折、BD 脫層、「手套是 aid」✅ |
| 訓練 | Sheffield、斯洛維尼亞、美國車庫、日本岩館、英國 Peak ✅ | Pete、Tom、Janja（女）、Anna（女）、Xinran Lu、Dennis Robertson、eshen、Dakota Walz（小手）✅ | ✅ | 日 ✅；韓、中 ❌ | 「80% 來自實際去塞」、轉移有限 ✅ |
| 課程 | IC、Colorado、Squamish（🟡）、英國、日本、韓國、台灣 ✅ | 女性營（Pamela Shanti Pack、Gisely Ferraz）✅ | 課程頁＋學員心得影片 ✅ | 日、韓、中 ✅ | 百合搖滾說初階重點不是裂隙技巧 ✅ |
| 受傷 | IC、Sedona、South Platte、Meiringen ✅ | 25 歲女性首次戶外（AAC）、Sam MacIlwaine（女）✅ | 案例＋衛教 | ❌ | — |

## 七、仍缺的格子（已補搜一輪）

1. **龍洞裂隙的教學影片**：YouTube 搜了「龍洞 裂隙」「龍洞 攀岩 傳攀」「龍洞 塞手」「裂隙攀岩 教學 塞手 塞腳」「傳攀 裂隙 膠帶 手套」，只找到路線實錄（rock6879、yu lin lai、戶外江、沙克強），沒有講技巧的。中文教學只有中國的知岩片语（2020）。龍洞的實錄多半沒字幕、說明欄也很短，示範重點沒辦法查證到秒。⚪（YouTube 範圍內）
2. **小手的腳塞、鞋子專論**：找不到專文。只有 Pete 的通訊（講手）、Anthony Johnson（2018，腳小）。🟡
3. **女性的裂隙手套評測**：沒找到。Teresa（EpicTV 2020）試用的是 Wide Boyz 膠帶，不是手套。🟡
4. **韓文、中文的訓練與 crack machine 影片**：沒搜到 2020 年以後的。
5. **南非、澳洲的影片**：澳洲只有 Gwen Lancashire 的文字評測，和 Pete 通訊提到的 Fight Club。影片沒有專門再搜。
6. **手指、手背受傷的裂隙專門研究**：BMJ 2026 那篇沒抓到相關段落；Reddit 那串讀不到。目前只有皮膚、卡膝、腳踝的資料。
7. **字幕 429**：在 2024–2026 年間的日文、韓文影片（例如 K Climbing 1부、湯川講習、ランナウト練習壁、山岳医 手套），都只能用說明欄。之後如果要引用到秒，要換時段、帶 cookies 重抓字幕。
