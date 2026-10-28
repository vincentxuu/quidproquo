## post-verify

對象：`src/content/posts/climbing/2026-10-27-foot-jams.md`、`-en.md`（英文版逐段對應，以下 verdict 兩版共用；只有英文措辭不同處另註）。
查核日：2026-10-27。獨立重查，未採用 `.work/reviews/2026-10-27-foot-jams.md` 的結論。

### 工具與降級紀錄（toolDegradation）

- Groundlane MCP：本 session 只有 `authenticate`，未授權，無 web_fetch 可用。
- Groundlane 直接 HTTP：`POST https://groundlane.vincent-xu-work.workers.dev/mcp` 回 401。
- Keenable／You.com：只提供搜尋，本次需要全文，未用。
- 改用 Exa `web_fetch_exa` 全文抓取（REI、UKC、Wide Boyz 電子報 ×2、Mountain Project ×3、Mountain Equipment、timtam.net）與 Exa `web_search_exa` 找來源（Tom Randall cellar、VIDEORACLES／Roddy McCalley）。
- YouTube：`yt-dlp --cookies-from-browser chrome` 取 upload_date／channel／title／chapters／description，並下載 en／ja／ko 原文自動字幕（`*-orig`），轉成帶秒數的逐字稿核對。Timtam 影片沒有字幕，下載影片後用 ffmpeg 擷取 59–65 秒逐秒畫面判讀字卡。
- oEmbed：`curl https://www.youtube.com/oembed?url=...`。

### 影片基本資料（14 支）

| ID | 上傳日 | 頻道 | oEmbed | 文中用法 | Verdict |
|---|---|---|---|---|---|
| HgpCOnPIR7o | 2021-02-16 | VIDEORACLES | 200 | 嵌入 start 64 | 🟢 |
| -ocSfP62RLA | 2022-03-31 | Geek Climber | 200 | 嵌入 start 167 | 🟢 |
| jG8rMsswzfA | 2022-05-13 | Arc'teryx Japan Official YouTube channel | 200 | 嵌入 start 466 | 🟢 |
| Nc_otfbu0b8 | 2023-01-19 | K Climbing Company | **401** | 已改用連結 `&t=536s`，未嵌入 | 🟢（處理正確） |
| VRc_iFasUc4 | 2021-09-09 | TAKEMOVIE（タケムービー） | 200 | 連結 `&t=347s`、`&t=590s` | 🟢 |
| 5SfTjWiFYFA | 2023-03-30 | Stefano Ghisolfi | 200 | 嵌入 start 145 | 🟢 |
| cCEzog_m6BI | 2026-08-29 | The Wide Boyz Show | 200 | 連結 | 🟢 |
| _looiYwkr14 | 2024-04-04 | 山岳医chippecoちゃんねる。 | 200 | 嵌入 start 170 | 🟢 |
| 9pa0xGzvb8U | 2020-01-14 | Sasha DiGiulian | 200 | 嵌入 start 107 | 🟢 |
| ScCQg539ylE | 2020-11-29 | 최지호 | 200 | 嵌入 start 116 | 🟢 |
| Abx8Gl-VHv0 | 2020-05-10 | Wide Boyz | 200 | 連結 `&t=242s`、`&t=334s` | 🟢 |
| oO1xDmVwxeE | 2022-01-14 | EpicTV Climbing Daily | 200 | 嵌入 start 160 | 🟢 |
| nbc0ytdo2To | 2020-06-21 | Wide Boyz | 200 | 連結 | 🟢 |
| mwjEI_Ibjms | 2025-12-10 | 登山教室Timtam | 200 | 嵌入 start 59 | 🔴 時間點見下 |

全部 ≥2020；標題、頻道、年份與參考資料列表一致。

### 逐條查核

#### 手掌裂隙的四步驟

| # | 原句（zh） | Verdict | 依據 |
|---|---|---|---|
| 1 | 四步驟：膝蓋往外、腳變薄、腳尖插入、膝蓋轉回、站上 | 🟢 Confirmed | REI：“Bend one knee and turn it outward (your pinkie toe will be turned down)… Insert your toes… Bring your knee back in line with your body… Smear your foot into the crack” https://www.rei.com/learn/expert-advice/crack-climbing.html ；UKC Randall：“turn your foot so that your knee points outwards… tops of your shoes touching the crack on one side and the sole… on the other… twist your knee so that it becomes more parallel” https://www.ukclimbing.com/articles/skills/wild_country_crack_school_part_2_-_jamming-4638 |
| 2 | Randall：腳要先塞得服貼再承重 | 🟢 | UKC：“try to push the foot in quite deeply and so that it feels really snug before you even contemplate weighting it” |
| 3 | 「美國教學頻道 VIDEORACLES」「他」 | 🟢 Confirmed (single-source) | rockclimb.videoracles.com 由 VIDEORACLES LLC 經營，課程講師 Roddy McCalley（加州 Joshua Tree 嚮導，男性；climbwithroddy.wordpress.com Bio）。這支影片本身沒報名字，講者身分是從課程頁推定 |
| 4 | VIDEORACLES 1:04 起「外轉、腳尖進、扭緊」、這是大家覺得裂隙會痛的原因、不舒服但很穩、另一腳側伸平衡 | 🟢 | 字幕 1:04–1:59：“the classic crack foot technique and the reason people think crack climbing hurts… externally rotate toe in, twist to lock, flag the other foot for balance… uncomfortably torqued… but it's really secure” |
| 5 | Geek Climber 2:47 起，Pete：很多初學者斜 45 度放、只塞進腳趾尖；要整個轉到側面；膝蓋往外倒、從腳踝轉 | 🟢 | 章節 “Foot jam techniques” 2:47；字幕 3:01–3:13 “they put it like at a 45 degree angle… only just getting their toes in whereas if they turn it the whole way”，接著 “tip your knee out to the side and turn at the ankle” |
| 6 | 「英國裂隙攀登者 Pete Whittaker」 | 🟢 | Wild Country：“training hard… at home in Sheffield, UK” https://www.wildcountry.com/blog-pete-solo-free |
| 7 | 「上一篇提過 Geek Climber 的學習紀錄」 | 🟢 | `2026-10-26-hand-jams.md` 內有 3 處 Geek Climber |
| 8 | Arc'teryx Japan，山岳嚮導新名健太郎，7:46 起「フットジャムの基本」：腳先立起來插入，再扭膝蓋讓它和裂隙平行 | 🟢 | 說明欄：「山岳ガイドの新名健太郎さん」「07:46 フットジャムの基本」；字幕 7:51–8:05「ハンドサイズのフットジャムでは足をまず縦にして中に差し込み、その後膝をひねってクラックと平行にします」 |
| 9 | K Climbing Company 김종식 8:56 起：腳刀立起插入、膝蓋立起，靠腳中段凹處與腳背卡住 | 🟢 | 字幕 8:42–9:16「발날을 세운다… 무릎을 세워서… 발의 중간 부분 오목한 곳과 발등을 사용해서 마찰력을 얻는」。講者名來自說明欄（연락처 010-… 김종식），影片內未自報名字 → 人名為 single-source |
| 10 | TAKEMOVIE 5:47 起：小趾側朝下塞進去、膝蓋往內倒、扭力讓腳卡住 | 🟢 | 字幕 5:47–5:56「小指側を下にねじ込んで膝を内側に倒れる方向にひねりの力を加えるとしっかりと保持ができます」 |

#### 塞多深

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 11 | REI：塞到前腳掌就夠 | 🟢 | REI：“You don't need to put your entire foot into the crack; instead, try inserting your toes to about the ball of your foot.” |
| 12 | Randall（2012）：塞深一點 | 🟢 | UKC 頁面日期 7th May 2012，引文同 #2 |
| 13 | Whittaker（2026）甜蜜點：縫邊落在趾根再往裡半根到一根腳趾 | 🟢 | 電子報 Oct 03, 2026：“Aim for the crack edge to sit about half a toe to a full toe's length past the webbing of your foot” https://wideboyz.school/newsletters/newsletter-archive/posts/4-easy-fixes-to-solve-foot-pain-in-cracks ；有聲版 2:10 同句 |
| 14 | 太淺只有腳趾關節出力；太深、腳型窄縫邊壓腳背骨頭，一兩次沒事一整段很痛；甜蜜點接觸面大、橡膠出力；長裂隙每步差一點點 | 🟢 | 同電子報 “Too shallow… only your toe knuckles engage… Too deep: If you have a slim, low-profile foot… thin, bony top of your foot… fine for a couple of jams, but after a whole pitch…”；“subtly change the depth… by a millimeter either side” |
| 15 | Stefano Ghisolfi 到 Tom Randall 家地下室；2:44 起 Pete：很多人手練得好、腳只塞腳趾尖；掛在腳趾尖上也會掉 | 🟢 | 字幕 2:41–3:19 “people just don't put their feet deep enough… due to shoes… or foot size… just putting the ends of their toes in… if you were to try and hang off just the end of your toes… they would just fall out”。地下室屬 Tom Randall：Lacrux 訪談 “training in the basement under my house”、Outside 2011 “a makeshift gym in Randall's basement in Sheffield” |
| 16 | MP〈Foot Jam Agony〉：初學時塞最深最舒服、幾乎不用扭、偶爾會卡住 | 🟢 | JaredG（Jan 2, 2021）：“most comfortable to stick my foot in as far as I could… barely have to torque at all… But it will get stuck sometimes.” |

#### 腳跟往下沉

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 17 | Whittaker：扭緊後開始承重時腳跟放低於腳尖；三個好處 | 🟢 | 電子報 “3. Lower the Heel… gently drop your heel toward the ground so it sits lower than your toes… 1. more surface area… 2. Relieves direct pressure on your toe knuckles 3. lower-profile section of the shoe into the crack” |
| 18 | 有聲版 2:42 起講這段 | 🟢 | 字幕 2:42 “Number four, lower the heel”（有聲版口誤把第 3 點念成 Number four，不影響文章） |
| 19 | Geek Climber 5:00 起：只用腳爬時腳痛「大概是手的兩倍」，故意把重量放回手上；Pete 建議腳跟下沉；下次痛還在但能忍 | 🟡 措辭 | 字幕 5:00–5:47 “the feet felt **at least** two times more painful… purposely putting more weight on my hands… drop heal technique… still there but… a lot more manageable”。英文版寫 at least twice 正確；中文「大概」應改「至少」 |
| 20 | MP〈Foot jamming pain〉：最重要的入門建議是腳跟真的放低；壓力經鞋緣傳到腳跟 | 🟢 | Ryan Penrod（Apr 8, 2024）：“really drop your heel… the pressure is transferred through the rand into the heel instead of… crushing them” https://www.mountainproject.com/forum/topic/125880516/foot-jamming-pain |
| 21 | 〈Foot Jam Agony〉：腳跟上下調一點避開痛點，稍微放低最好 | 🟢 | Nathan Sullivan：“move your heel up or down to avoid putting pressure on any pain points… for me, heel down a little is best” |

#### 不痛的關鍵

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 22 | 2012 Randall：一開始會痛，痛不代表做錯 | 🟢 | UKC：“this will feel pretty painful when you first try it, so don't think you're doing anything wrong if it hurts!” |
| 23 | 2026 Whittaker：會痛通常代表做錯 | 🟢 | 電子報：“if foot jamming hurts, it usually means you're doing something wrong.” |
| 24 | MP〈Foot jamming pain〉：除非低角度有窟窿或腳踝沒彈性，否則是技術問題 | 🟢 | Austin Donisan：“Unless you're teaching on a low-angle podded crack, or the person has literally no ankle flexibility, it's a technique issue.” |
| 25 | 同串：初學者不覺得穩就扭過頭，像死握大把手點；剛開始像要把腳扭斷 | 🟢 | Ryan Penrod：“over-torquing… since they don't feel secure yet… equivalent of over-gripping on jugs… like I was trying to twist my foot off” |
| 26 | 〈Foot Jam Agony〉：把腳塞想成抹在一側，不是焊死兩側，剛好讓橡膠黏住 | 🟢 | Nathan Sullivan：“smearing one side of the crack rather than torquing my foot so hard it fuses to both sides… juuuuust enough force to get the rubber to stick” |
| 27 | Whittaker：爬了五年十年，裂隙耐受度也從零開始；痛之前就停 | 🟢 | 電子報 #4 “Stop before it actually hurts… Even if you've been climbing for 5 or 10 years, your crack tolerance starts back at zero” |
| 28 | 止痛藥建議與反駁、韌帶被拉伸會好 | 🟢 | Jon Nelson “taking OTC pain medicine before practicing”；Tim M “Don't use drugs… worst advice… You're learning a new skill”；Steven Lee “foot and ankle ligaments/tendons are being stretched in ways they've never been before. It'll get better with more mileage.” |
| 29 | 山岳醫 chippeco 在名張〈イカサマ師〉：2:50 看起來有腳點其實幾乎沒有；3:15 縫寬讓腳塞不深、要用力扭、腳很累 | 🟢 | 字幕 2:51「足置いてるように見えてほぼないんですよね」；3:16–3:31「クラックの幅がずっと足がしっかり入らない…しっかりねじ込んで滑らないように…足が結構疲れます」。說明欄「国際山岳医」 |
| 30 | 練習：四肢都塞、輪流放鬆，再試兩手一腳等 | 🟢 | Steven Lee：“Get all 4 appendages in the crack, loosen the jams in varying combinations… Then try it with 2 hands in, 1 foot in/2 feet in 1 hand in” |

#### 指縫與拳縫

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 31 | Whittaker 腳尖塞：最薄方向、大拇趾先進當支點、小趾側鞋緣滾進、腳踝扭一點、最後腳尖往縫邊用力踩（很多人忘） | 🟢 | 電子報 Dec 30, 2025：“Place your big toe in the crack first and use it as a pivot point to roll the lowest profile of your shoe… Add a small twist at the ankle… Actively push (dig) your toe into the crack edge… (many people often forget this last point)” |
| 32 | 「縫太細、**連腳尖都進不去時**，VIDEORACLES 33 秒起示範腳尖對準裂隙抹上去、腳跟放低、膝髖移到腳上方」 | 🔵 Misframed（輕） | 字幕 0:29–0:52 “especially in thin cracks like this section of finger crack… smear your foot on the crack… point of my shoe is lined up with the crack… drop your heel and center your knee and hip over that foot”。動作 Confirmed；但影片只說「細的裂隙」，沒說「腳尖進不去時」才用。建議改成「縫很細時」 |
| 33 | 「拳頭寬的裂隙（整腳塞）…VIDEORACLES 在 2:06 起說，這時腳和腿保持中立、不用扭，硬底鞋好用，縫夾住的是腳趾根部的硬橡膠」 | 🔵 Misframed | 字幕 2:06–2:37 “**as the crack gets a little wider**… putting your whole **toe** in… but putting it in straight… neutral alignment… stiff shoe… the crack is pinching… the stiff rubber right here at the base of my toes”；3:15 “**if the crack is the right size for my foot** I can try the more comfortable technique of jamming straight in”。VIDEORACLES 講的是「稍寬、剛好合腳的縫，把鞋頭直直塞進去」，沒說拳頭寬，也不是整隻腳。拳縫直踩的說法另有 REI 支持：“The width of a fist-size crack often allows you to insert your foot straight in and stand up… Stiff shoes work well for climbing fist-size cracks.” |
| 34 | Whittaker 選鞋影片 5:34 起：拳縫橫跨腳掌寬度卡、鞋底硬、像站在木板上不是棉花糖 | 🟢 | 字幕 5:34 “with fist jamming cracks… jam across the width of our foot… nice and stiff underneath”；7:02–7:27 “standing on it like it's a plank of wood… candy floss… Plank of wood, not candy floss”（原文是 candy floss；中文「棉花糖」在台灣也指 cotton candy，可接受）。講者為 Pete：說明欄 “Pete Whittaker suggests the best climbing shoes for each crack size” |
| 35 | TAKEMOVIE 9:50 起：腳整個塞進去，改變腳尖橫向角度卡住 | 🟢 | 字幕 9:50–9:54「足は基本的にクラックの中にすっぽりと入れるぐらいのサイズなのでつま先の角度を横にずらしながら決める」，章節フィストジャム 9:04–9:58 |
| 36 | 新名健太郎：比手掌寬的縫可把腳保持水平放進去再在縫裡扭 | 🟢 | 字幕 8:08–8:13「幅広のフットジャムでは足を水平のまま…中でひねるというテクニックもあります」 |

#### 縫外腳點與休息站姿

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 37 | VIDEORACLES 第一順位是縫外好點或抹點；REI 提醒看縫外 | 🟢 | 字幕 0:00 “one if there's a nice hold like this one outside the crack that's great”；REI “Don't forget to look outside the crack for features” |
| 38 | VIDEORACLES 2:39 休息站姿：一腳塞、異側手塞、空的腳往外伸平衡 | 🟢 | 字幕 2:39–2:59 “resting stance… one foot firmly jammed… the opposite hand jammed… flagging that other foot out to the side for balance” |
| 39 | Sasha DiGiulian 在 Indian Creek 跟同行的人學、自稱很不會爬裂隙；1:47 學讓腳對準裂隙再扭；爬完說縫外有點可偷用、想找純裂隙、小 crimp 也比好手塞安心 | 🟢 | 字幕 0:22 “I'm actually a terrible crack climber”；0:34 朋友經營 Denver Mountain Guiding；1:47–2:00 “match your foot to the crack… then you twist it”；2:55–3:22 “some cheat feet outside that crack… pure splitter… even if it's like a tiny little crimp I feel more confident on that than like a bomber hand jam” |
| 40 | 최지호〈골드길〉5.9：腳怎麼用決定花多少手臂力；1:56 起腳塞站起、因為塞進去所以輕鬆 | 🟢 | 字幕 0:09–0:36「골드길은 5.9 크랙… 발 쓰기를 어떻게 하느냐에 따라서 힘이 덜 들고」；1:56–2:18「발재밍… 재밍이 들어왔기 때문에 편해요」（自動字幕品質差，但關鍵句可辨）；說明欄「발재밍 무릎재밍」 |

#### 拔出與卡住

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 41 | 拔腳反過來做：膝蓋往外、腳踝放鬆、抽出 | 🟢 | REI “Reverse the process. Move your knee out to the side, relax the ankle and pull your foot out” |
| 42 | REI：手掌裂隙橫塞再往下踩可能卡住 | 🟢 | REI “tempting to insert a foot horizontally into a hand crack and step down, this can sometimes get your foot stuck because the crack is too narrow” |
| 43 | MP 骨折串：約 8 英尺、手指到手掌寬裂隙、左腳滑、右腳留在縫裡、十字韌帶扯裂一塊脛骨、開刀拄拐八週 | 🟢 | Finn McArdle（Dec 5, 2021）：“small hand/finger crack… about 8 feet off the ground… My left foot slipped… my right foot was locked into the crack… My PCL and ACL ripped a part of my tibia apart… on crutches for the next 8 weeks and undergo surgery” |
| 44 | 回覆：事後講推離／別僵／轉膝放開很容易，但一瞬間；有人在 Vedauwoo 看過；有人說很少見 | 🟢 | Cole D “It's easy in hindsight to say, push off the wall… release foot jam turning knee out… over in milliseconds”；rob.calm “Climb and Punishment at Vedauwoo”；Christopher Smith “a pretty freak occurrence” |

#### 鞋子

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 45 | Whittaker 三條件：鞋平腳也平、楦頭寬、側面低（尤其小趾側） | 🟢 | 電子報 #1 三點原文 |
| 46 | 「他**最常看到的**錯誤是穿了平底鞋卻買小了三號」（英文版 “The mistake he sees most”） | 🔴 Contradicted | 電子報與有聲版 0:46 都是 “I've **sometimes** seen climbers turn up… in flat shoes, but because they sized them down 3 sizes, their toes are completely bunched up inside”。原文沒有「最常」 |
| 47 | REI 偏好綁帶鞋，比魔鬼氈薄 | 🟢 | REI “Lace-up shoes are preferred… slimmer profile than shoes with hook-and-loop strap closures” |
| 48 | Whittaker 選鞋影片：手掌裂隙常穿魔鬼氈，腳背沒鞋帶讓橡膠貼岩 | 🟢 | 字幕 5:14–5:30 “Velcro straps are quite good cuz it keeps this area of the boot free where you can get the rubber and there aren't any laces… But I often think yeah some Velcro strap shoes uh for hand cracks”；`&t=242s` 落在 hand cracks 章節（4:02） |
| 49 | 〈Foot Jam Agony〉：手縫偏好軟套鞋較黏；TC Pro 要更多扭力 | 🟢 | Nathan Sullivan “I like Moccs for anything hand crack related due to sticker rubber… while the TCs take more torque” |
| 50 | 2022 EpicTV **帶** Babsi Zangerl、Jacopo Larcher 到 Valle dell'Orco 的〈Incastromania〉試新版 | 🟡 措辭 | 片中 1:40 是 “la sportiva athlete summit” 在 Valle dell'Orco，EpicTV “were there with them”；3:16 “It's called Incastromania… perfect hand crack”。地點、人、路線 Confirmed；「EpicTV 帶他們去」不準，是 La Sportiva 運動員聚會、EpicTV 隨行 |
| 51 | 2:40 鞋帶護片是為腳塞時保護鞋帶；3:44 前端體積小、容易塞細縫 | 🟢 | 字幕 2:40–2:48 “added this extra protection for the laces because when you jam your feet in the crack”；3:44–3:56 “not so much volume in the front so it's easier to jam your feet in like smaller cracks” |
| 52 | Gwen Lancashire（澳洲 Blue Mountains）：高筒護腳踝、寬楦腳趾平、硬底撐腳塞；兩雙 TC Pro EU36 緊、大一號爬長日和寬縫可穿襪 | 🟢 | Mountain Equipment（Oct 9, 2024）“anyone in the Blue Mountains… it's Gwen”；“High ankle… Wide toe box so that your toes can sit flat… Stiff soles to help stand on jams”；“A tighter pair for finger cracks, dihedrals… a pair a whole size bigger for easier or big days and wide cracks so I can wear socks… EU36… EU37” |

#### 大腳和小腳、岩館練習

| # | 原句 | Verdict | 依據 |
|---|---|---|---|
| 53 | Wide Boyz〈Feet first VS hands first〉2:45：縫對腳太窄時腳跟先進很難、改腳尖先進；Mari Salvesen 腳小直接腳跟先進 | 🟢 | 字幕 2:45–2:57 “if the crack is narrow for your foot size it can be really difficult to get… your heel in the crack first which is why this toe in technique… can work really well”；3:09 “Mari… she's got smaller feet… heel is going into the crack first” |
| 54 | Geek Climber 5:59：手腳一起塞只爬兩步就痛 | 🟢 | 字幕 5:59–6:05 “trying crack climbing with both hands and feet at the same time unfortunately I could barely climb more than two moves” |
| 55 | 「**日本群馬的**登山教室 Timtam」（英文版 “Mountaineering school Timtam in Gunma”） | 🔴 Contradicted | timtam.net：「東京近郊の山を教室に…登山スクール」，電話 03-（東京）。群馬是拍攝地：說明欄「群馬新町のサイトウクライミングジムには『クラックの幅が調節できるクラック』があります」 |
| 56 | Timtam 三段練習、說明欄「最重要的是腳要固定得穩」 | 🟢 | 說明欄「ジャミングは足の固定がしっかりされるのが大事です」「①手だけジャム…②足だけジャム：手はガバホールドを掴みます…③手足ジャム」 |
| 57 | 「**59 秒起**是只用腳塞的段落」＋嵌入 `start: 59` | 🔴 Contradicted | 無字幕，逐秒擷取畫面：59–63 秒仍是手塞特寫，**64 秒**出現「足だけジャム」字卡。應改 1:04／`start: 64` |

### 必改

1. **#46 Whittaker「最常看到」→ 原文是 sometimes**（zh「鞋子」節「他最常看到的錯誤是…」；en line 187 “The mistake he sees most”）。改成「他有時會看到…」。
2. **#55 Timtam 不是群馬的登山教室**（zh「從岩館練起」節；en line 217）。改成「東京的登山教室 Timtam 在群馬新町一間有可調寬度裂隙的岩館」之類。
3. **#57 Timtam 時間點 59 秒 → 64 秒**（zh／en 正文「59 秒起」與兩版 youtube fence `start: 59` → `start: 64`）。
4. **#33 VIDEORACLES 2:06 被套成「拳頭寬的整腳塞」**（zh「指縫和拳縫」節拳縫段；en line 137；練習題 5 的答案沿用）。VIDEORACLES 講的是「縫稍寬、剛好合腳時把鞋頭直直塞進去、腿保持中立」。修法二選一：(a) 拳縫直踩改引 REI（“insert your foot straight in and stand up… Stiff shoes work well”），VIDEORACLES 那句移到「稍寬於手掌、剛好合腳」的語境；(b) 保留 VIDEORACLES，但改成「縫稍寬一點、剛好合腳時」並把「整隻腳」改成「整個鞋頭」。

### 建議改

1. **#19** zh「腳的痛大概是手的兩倍」→「至少是手的兩倍」（原文 at least；英文版已正確）。
2. **#32** zh「縫太細、連腳尖都進不去時」→「縫很細時」（en “When even the toe won't go in” 同改）。原片只說 thin／finger crack。
3. **#50**「EpicTV 帶 Babsi Zangerl 和 Jacopo Larcher 到…」→「EpicTV 在 La Sportiva 運動員聚會隨 Babsi Zangerl 和 Jacopo Larcher 到…」或直接寫「EpicTV 的片中，兩人在…試新版」。
4. 參考資料 Gwen Lancashire 那條補年份（Mountain Equipment，2024）；它是澳洲雪梨的戶外店，不是英國同名品牌，必要時可加「澳洲」免誤會。
5. #9 김종식、#3 VIDEORACLES 講者身分都只靠說明欄或課程頁推定（影片內未自報），目前寫法可留，但若要更穩可寫成頻道名不寫人名。

歸因標籤計數：全篇以「某某說」「有人說」帶出的引述多但都是直接來源歸因，不是「作者判斷」型但書，不需合併。

範圍聲明：本次只檢查了文中已提出的 57 條宣告（含 14 支影片的 ≥2020、頻道、標題、oEmbed 與每個 start／「X:XX 起」時間點），未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。
