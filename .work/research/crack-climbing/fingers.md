# 指裂隙（finger cracks）與薄手／off-fingers 研究筆記

- 研究日期：2026-10-26
- 範圍：拇指朝下指塞、拇指朝上／小指朝下、ring lock（off-fingers）、finger stack、thumb cam／thumb lock、pin scar、指裂隙腳法、指裂隙裡的 layback 選擇
- 總論篇已用過、本篇不重做：REI〈How to Climb Finger Cracks〉、Climbing.com〈How to Layback〉、V-Diff、AAI、Whittaker 五條規則書摘（見 `src/content/posts/climbing/2026-10-18-crack-climbing-technique.md`）。本篇只在需要對照時引用它們。
- 暫存（原始頁面、字幕、info.json）：`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/15b045f4-4588-4bdc-aa33-b878e65bd926/scratchpad/crack/fingers/`

## toolDegradation

| 步驟 | 工具 | 結果 |
|---|---|---|
| 1 | Groundlane MCP（`mcp__claude_ai_groundlane__*`） | ToolSearch 載入後只有 `authenticate`，需要 OAuth，不可用 |
| 2 | Groundlane 直接 HTTP（POST `/mcp`） | HTTP 401 |
| 3 | Keenable keyless | 可用，所有網頁搜尋走這裡 |
| 抓全文 | `curl` 直抓 | 多數成功；`rei.com` 連線失敗、`ukclimbing.com` 403、`reddit.com` 403 |
| 5 | Exa `web_fetch_exa` | REI、UKC 成功；Reddit `SOURCE_NOT_AVAILABLE`（www 與 old 都試過） |
| 5 | Tavily `tavily_extract` | Reddit 失敗（Failed to fetch url） |
| 6 | 內建 `WebFetch` | Reddit：「unable to fetch from www.reddit.com」 |
| 影片 | `yt-dlp` | 第一輪無 cookies 被 429；改 `--cookies-from-browser chrome` 後成功；字幕請求仍偶發 429，部分影片只拿到 info.json（說明欄＋章節） |

Reddit 三串因此只有 Keenable 搜尋結果裡的留言原文片段（🟡），整條鏈試過，見文末「未關閉項目」。

## 一、文字來源清單

標示：✅ 讀過全文（或能讀到的全部公開部分）／🟡 只讀到摘要或片段／🔴 讀不到。日期是頁面上的發佈日；論壇串寫首帖到末帖。

| # | 來源 | 作者／身分 | 日期 | 語言 | 狀態 | 用在哪 |
|---|---|---|---|---|---|---|
| T1 | [How to Climb: Expert Advice for Mastering Finger Cracks（Climbing.com，Whittaker《Crack Climbing》書摘）](https://www.climbing.com/skills/how-to-climb-finger-cracks/) | Pete Whittaker（Wide Boyz） | 2021-08-14 | 英 | ✅ 公開部分（拇指朝下食指版、中指版、小指朝下前 4 步）；之後付費牆 🟡 | 拇指朝下步驟、小指朝下、芭蕾舞者與伐木工比喻 |
| T2 | [Nine Tips For Improving Your Crack Climbing（Climbing.com）](https://www.climbing.com/skills/finger-cracks/) | Julie Ellison 整理，引 Jean-Pierre Ouellet | 2022-04-13 | 英 | ✅ | pin scar／pod、ratchet、ring lock、腳法、常見錯誤 |
| T3 | [Wild Country Crack School Part 1 – Fingers（UKC）](https://www.ukclimbing.com/articles/skills/series/wild_country_crack_school) | Tom Randall | 2012-05-01（經典教學，可收） | 英 | ✅（Exa） | 英國 pegged-out 指縫（Millstone）＝pin scar、腳法、軟鞋 |
| T4 | [A New FA in Kristiansund and the Golden Takeaway（Wide Boyz 電子報）](https://wideboyz.school/newsletters/newsletter-archive/posts/a-new-fa-in-kristiansund-and-the-golden-takeaway) | Pete Whittaker | 2026-10-03 | 英 | ✅ | 手大小 × 尺寸對照表（大手／小手各自吃香的尺寸） |
| T5 | [3 Secret Weapons for Finger Cracks（Wide Boyz 電子報）](https://wideboyz.school/newsletters/newsletter-archive/posts/3-secret-weapons-for-finger-cracks-you-re-missing-one) | Pete Whittaker | 2025-12-30 | 英 | ✅ | 指縫三種腳法：Toe Jam、Front-On Smearing、Frogged Position |
| T6 | [Best technique for off fingers cracks, stacks or ringlocks?（Mountain Project 論壇）](https://www.mountainproject.com/forum/topic/117942783/best-technique-for-off-fingers-cracks-stacks-or-ringlocks) | 一般攀岩者，含 Xi Yin（女性）轉述 Tom Randall | 2019-10-25～11-06 | 英 | ✅ | ring lock vs stack 的分歧、命名混亂、「像有人用力咬你拇指」 |
| T7 | [When to switch from ring locks to tight hands（MP）](https://www.mountainproject.com/forum/topic/110968436/when-to-switch-from-ring-locks-to-tight-hands) | 一般攀岩者 | 2015-09～2016-03（2020 前，只取原理） | 英 | ✅ | thumbstack vs ringlock 判別法、下巴高度以下失效、pinky stack、shuffle |
| T8 | [Ringlocks and inflexible thumbs（MP）](https://www.mountainproject.com/forum/topic/119817977/ringlocks-and-inflexible-thumbs) | 一般攀岩者 | 2020-10-27～28 | 英 | ✅ | 做不出 ring lock 的人、兩種 ring lock 做法 |
| T9 | [Resources for little hands and crack climbing?（MP 女性版）](https://www.mountainproject.com/forum/topic/126442328/resources-for-little-hands-and-crack-climbing) | 一般攀岩者（夫妻） | 2024-06-27～07-15 | 英 | ✅ | 小手的人在 Indian Creek 爬 5.11 反而輕鬆 |
| T10 | ["Entry level" ringlock cracks in Indian Creek（MP）](https://www.mountainproject.com/forum/topic/121558044/entry-level-ringlock-cracks-in-indian-creek) | 一般攀岩者 | 2021-10-31～11-16 | 英 | ✅ | 入門 ring lock 路線、貼食指 |
| T11 | [Rattley fingerlocks in corner cracks: just layback?（MP）](https://www.mountainproject.com/forum/topic/203408590/rattley-fingerlocks-in-corner-cracks-just-layback) | 一般攀岩者 | 2026-07-13～15 | 英 | ✅ | 內角指縫：上手 ring lock／can opener、下手 paddle；jam 與 layback 界線模糊；rand smear |
| T12 | [How in God's green earth do I ringlock?（MP）](https://www.mountainproject.com/forum/topic/116356290/how-in-gods-green-earth-do-i-ringlock) | 一般攀岩者（新手學習紀錄） | 2019-01-12 起 | 英 | ✅ | 塞太深的錯誤、拇指貼近裂隙外緣、ring lock 尺寸其實很窄 |
| T13 | [Finger taping for rings/stacks sized cracks（MP）](https://www.mountainproject.com/forum/topic/118203277/finger-taping-for-ringsstacks-sized-cracks) | 一般攀岩者 | 2020-01-02 起 | 英 | ✅ | 指節別貼、只在指節下貼一圈 |
| T14 | [How to jam fat fingers（MP）](https://www.mountainproject.com/forum/topic/111625393/how-to-jam-fat-fingers) | 一般攀岩者 | 2016-02（2020 前，只取原理） | 英 | ✅ | 指南的「finger」很寬鬆、手肘往身體中心收 |
| T15 | [An Ode to Finger Cracks（Sneha Climbs）](https://snehaclimbs.com/post/fingercracks) | Sneha（女性，一般攀岩者） | 2023-12-20 | 英 | ✅ | Joshua Tree 指縫學習筆記、鞋子選擇 |
| T16 | [The Desert Has Made Me: Stingray（brittanygoris.com）](https://brittanygoris.com/2020/02/17/the-desert-has-made-me-stingray) | Brittany Goris（女性職業攀岩者） | 2020-02-17 | 英 | ✅ | 同一條 pin scar 指縫，大手（她 5'11"）與小手夥伴（5'5"）的差異 |
| T17 | [Crack Climbing Technique（V-Diff）](https://www.vdiffclimbing.com/crack-climbing/) | V-Diff（英國教學站） | 2025-12-26 | 英 | ✅ | thumb stack／thumb cam 步驟、thumb cam 脫臼警告、內角只有一手能用 |
| T18 | [Crack Climbing 101（Public Lands）](https://publiclands.com/blog/a/crack-climbing-101) | Corey Buhay | 2023-08-14 | 英 | ✅ | ring lock 寫法（拇指關節頂一側、拇指尖頂另一側） |
| T19 | [The 10 Commandments of Indian Creek（Climbing.com）](https://www.climbing.com/places/commandments-indian-creek/) | Julie Ellison | 2022-04-18 | 英 | ✅ | IC 分級以大手為準、小手 5.11 較輕鬆 |
| T20 | [Crack Climbing Techniques: A Guide by Stevie Huston（alp.org.ua 英譯）](https://alp.org.ua/en/archives/93448) | Stevie Haston（原文譯名誤拼 Huston） | 2025-04-17（轉載；原文年代不明） | 英（譯） | ✅ | 「比手指大一點」是噩夢、拇指頂邊 + 手指壓拇指 |
| T21 | [What is crack climbing? Pete Whittaker answers（Adventure Books）](https://adventurebooks.com/blogs/blog/what-is-crack-climbing-pete-whittaker-answers-all-your-questions) | Pete Whittaker | 2023-07-03 | 英 | ✅ | 薄手：手指別併攏、每一毫米都算 |
| T22 | [America's Hardest Crack Lines Repeated（LACRUX）](https://lacrux.com/en/klettern/America%27s-hardest-lines-repeated) | LACRUX，引 Whittaker | 2023-11-27 | 英 | ✅ | 大手指 Whittaker 為了塞進去不貼膠帶 |
| T23 | [No 'Excuses': Jacopo Larcher… Meltdown（GearJunkie）](https://gearjunkie.com/news/jacopo-larcher-meltdown-514c) | Sam Anderson | 2022-11-25 | 英 | ✅（Exa；curl 403） | 反證：「Meltdown 只有細手指才爬得了」被推翻 |
| T24 | [Serenity Crack（Mountain Project 路線頁）](https://www.mountainproject.com/route/105862912/serenity-crack?print=1) | 路線描述＋留言 | 2006～2026-05 | 英 | ✅ | Yosemite pin scar 實況：好抓、難放、傷腳 |
| T25 | [フィンガークラックが登れないと思っている時期が僕にもありました｜指の太い人こそフィンガーだ！（今日からきみは！！）](https://kyokarakimiwa.com/finger-crack-vs-hutoiyubi/) | にわかアルピニスト（瑞牆／小川山，粗指男性） | 2025-12-15 | 日 | ✅ | 粗手指的反面意見、膠帶讓手指變粗約 1mm、#0.4 對粗指剛好 |
| T26 | [世界はそれをフィンガークラックと呼ぶんだぜ（同站）](https://kyokarakimiwa.com/fingercrack-susume/) | 同上 | 2025-08-28 | 日 | ✅ | 按 Camalot #0.4／#0.3／#0.5 分的指縫尺寸與腳法；#0.5 是鬼門、要サムロック |
| T27 | [フィンガークラックの登り方（ASAI Nature Climbing／note）](https://note.com/39climbing/n/n79f7aced4243) | 佐久平ロッククライミングセンター 教練 | 2025-09-13 | 日 | 🟡 前段免費部分已讀；後段付費 | 指縫三要素：jamming／camming／bottoming |
| T28 | [小川山でクラック四天王を登りました（のぼるひと）](https://www.dimountainphotos.com/entry/ogawayama-crack) | 一般攀岩者 | 2021-05-25 | 日 | ✅ | 小川山レイバック出だし是シンハンド、別硬要四肢都 jam、找側壁小點 |
| T29 | [【小川山】10年早かったクレイジージャム（きい山歩）](https://kiisampo.com/ogawayama-crazy-jam-day1/) | 一般攀岩者（入門第二季） | 2026-07 | 日 | ✅ | 小川山レイバック從 layback 進步到全 jam；細縫 foot jam 靠窄頭鞋 |
| T30 | [크랙등반과 째밍기술 용어정리（네이버 블로그 wooltraveler）](https://blog.naver.com/PostView.naver?blogId=wooltraveler&logNo=222656083847) | 一般攀岩者（課後整理） | 2022-02-23 | 韓 | ✅ | 핑거락／썸스택／썸캠用語、被動 vs 主動 jam |
| T31 | [크랙 등반을 잘하는 비결? 지금 당장 재밍하라!（月刊山）](http://san.chosun.com/news/articleView.html?idxno=11322) | 최석문（韓國傳攀攀岩者）講解 | 2017-11-13（2020 前，只取原理） | 韓 | ✅ | 링락是「不合身」尺寸、jam 熟練前避免 layback |
| T32 | [공감클라이밍 트래드마스터 18기 2일차（네이버 블로그 hyun76lee）](https://m.blog.naver.com/PostView.naver?blogId=hyun76lee&logNo=224107243731) | 學員（無塘谷 무당골 課程） | 2025-12-12 | 韓 | ✅ | 韓國課程把 finger jam 定在 Camalot 0.3～0.75 |
| T33 | [和Indian Creek的感情路（don1don）](https://www.don1don.com/archives/35405/) | 華人女性攀岩講師（NOLS 等） | 2014-11-20（2020 前，心得） | 中 | ✅ | 中文「疊手指」：紫到綠 cam 是她的罩門；問題是掛不久，不是不懂 |
| T34 | Reddit r/tradclimbing〈Steep rattly finger crack tips?〉、〈Flared finger cracks what's the beta〉、r/climbergirls〈Finger cracks〉 | 一般攀岩者 | 2025（帖號 1l2…、1me… 推估 2025） | 英 | 🟡 Keenable 片段 | 下巴以下失效、ring lock 的拇指要平貼、gym 縫好學 |
| T35 | Mountain Project 龍洞路線頁 6 條（One Fine Sunny Day、Fillet Show、Grotto、Westbound Road、Piranha、Finger Crack，連結見 3.4） | 路線作者＋留言 | 各頁不同 | 英 | ✅ | 龍洞哪裡有指縫可練 |

另有兩個只到摘要的台灣來源（🟡）：Instagram〈山地流浪 Sandy〉貼文（龍洞 Disco：「手太小真的卡不住」）、Keenable 片段。台灣書面資料裡找不到指縫技術的專文（見缺口）。

## 二、各子技巧教學重點

每條主張後面附來源編號（T＝文字、V＝影片，見第三節）與原文短句。

### 0. 先講尺寸：同一條縫，對不同的手是不同的技巧

- 指縫是最挑手的尺寸。Whittaker 用芭蕾舞者與伐木工比喻：「Just one millimeter larger or smaller can be the difference between a move feeling easy or impossible.」（T1 ✅）
- Whittaker 2026 電子報給了一張「誰吃香」的表（T4 ✅）：
  - **#0.5（紫）**：「A larger hand can finger jam comfortably here, whereas a smaller hand often has to ringlock.」
  - **#0.3、#0.4**：「Tight finger cracks where smaller fingers lock effortlessly while bigger hands struggle」
  - **#0.75、#1**：「Smaller hands get perfect hand jams in these sizes, whereas larger hands are forced into thin or paddle jams」
  - 總結：「unless you cannot get your fingertip into the crack past the first joint, there is ALWAYS a crack technique you can use.」
- 日本粗指作者的版本（T26 ✅，以他自己的手為準）：#0.4「バチぎきフィンガー」可插到指根；#0.3 粗指只能插到第一關節、「捻れば捻るほど利きがよくなる」；**#0.5 是鬼門**：「狭いのにスカスカ」，要用サムロック（＝thumb cam／ring lock）。
- 韓國課程把 finger jam 範圍寫成 Camalot 0.3～0.75（T32 ✅）；MP 有人說 finger ratchet 約 0.3–0.4、ring lock／thumb stack 約 0.75（T7 ✅）。**但同串另一人反對用 cam 號數講手的尺寸**：「#1 friend is thumbstacks for me, but a #0.5 camalot gets into ring locks… Talk about techniques, not tools.」（T7 ✅）→ 文章裡的 cam 號數只能當「多數人大約」的參考。
- 大手的實例：Whittaker 在人工縫上說「I'm going to use the ring cuz my middle finger is too fat」（V29 ✅ 668 秒）；在 Ramshaw 說縫「looks like my podgy index finger」（V7 ✅ 218 秒）；為了塞進極細縫不貼膠帶（T22 ✅）。
- 小手的實例：Hazel Findlay「having smaller hands and feet can sometimes be helpful with crack climbing」（V27 ✅ 173–187 秒）；Mary Eden 在 IC 說「blue metolius is tips for me」（V10 ✅ 176 秒）——同一個 0.3 號，對大手是更窄的 tips。
- **反證**：「Meltdown 只有細手指的人能爬」的說法流傳多年，被 Traversi（2018）與 Larcher（2022）推翻；Larcher 說把它當成手大小問題是在找藉口（T23 ✅：「anyone who passed the theory that the route was impossible at a certain hand size was displacing personal responsibility」為記者轉述）。日本粗指作者也說：粗指只要能插到第一關節就能 jam，「言葉を選ばなければそのサイズのクラックにジャミングができないのは技術不足です」（T25 ✅）。
- 指南分級偏大手：「the typical "hand crack" size is given the grade of 5.10 while smaller cracks (.75 and #1) are usually 5.11… If you have smaller hands, you'll find the 5.11s much easier」（T19 ✅）。MP 女性版有人照這個建議小手伴侶：「Look for 5.11- rated climbs in the creek. They'll likely be 5.9 for her.」（T9 ✅）

### 1. 拇指朝下指塞（thumb-down finger jam／finger lock）

**步驟**（Whittaker，T1 ✅）：
1. 拇指朝下、小指朝上，手肘往外，手背朝自己「as if you were saluting someone」。
2. 從手腕往外彎，讓指尖對準裂隙；手指放鬆，是最薄的方向。
3. 手指插到指根，拇指留在裂隙外。
4. 手掌和前臂貼平岩面，指根的皮肉會稍微撐開。
5. 想像前臂穿了一根鐵棒（手腕不動），把手肘和前臂往下轉到與裂隙平行。手掌前臂要貼牆，否則「you will find yourself pulling out on the jam and not down」。
6. 轉的時候無名指常會被擠出裂隙、疊在前兩指上；小指出來貼在裂隙壁。
7. 往上拉時，往下拉，不要往外拉。

**變化**：食指太粗或已經痛了，改用中指當最下面那根（T1 ✅）。VIDEORACLES 示範從「第一指節卡住」到「第二指節卡住」到「rattly fingers 全靠扭力」三個寬度（V1 ✅ 字幕 49–121 秒）。

**日本實例**：小川山〈蜘蛛の糸〉攀爬者筆記「右逆手フィンガー（親指は添えて、小指は抜いて）」（V20 說明欄 ✅），逆手＝拇指朝下；「小指は抜いて」和 Whittaker 第 6 步「小指出來貼在裂隙壁」一致。

**何時用**：直上指縫多數時候都用它最穩。Tom Randall：「In general you will probably climb 'thumbs down' in most situations and this does feel most secure on straight up finger cracks」（T3 ✅）。

**常見錯誤**
- 一直拇指朝下：「Jamming thumb-down all the time is a rookie mistake. Sometimes thumb-up will give you that extra reach」（T2 ✅）。
- 手放太低：指塞和 ring lock 只在下巴以上有效，「Finger jams only feel good until about chin level, your elbow rising un-torques your fingers」（T34 🟡；T7 ✅ 同義：「usually only solid from full extension to about your chin」）。
- 手肘外張：「Keep your elbows in toward your rib cage at all times」（T2 ✅）；「bring your elbow in towards your center」（T14 ✅）。
- 抓太緊：「Relax those hands. Don't over-grip.」（T2 ✅）

**力量有多少**：Wide Boyz 用測力計拉各種 jam（V3 ✅ 章節），兩人：tips（過第一指節）19–25 kg（重測後兩人都 25）、fingers（過第二指節）約 31.5 kg；同寬度下 Tom 的 ring lock 17 kg、paddle 36 kg。兩人非正式測試，只能當量級參考。

### 2. 拇指朝上／小指朝下（thumb-up／pinkie-down）

- 縫太窄、食指中指進不去時，翻成拇指朝上，用小指和無名指（總論篇 REI 已用；V1 ✅ 31 秒：「i might go pinky finger down simply because those are my two thinnest fingers」）。
- Whittaker 的小指朝下版（T1 ✅）：手臂與裂隙同線、手肘朝下；找比小指還窄的縮口讓它被動卡住；從**手腕**而不是手臂輕轉，「don't use brute force and over-twist; wait for it to click into place」。缺點：扭得少，沒縮口時「can be marginal… very strenuous」；有縮口時「can often be better than holding a massive jug」。
- 何時用：上下手不同方向的 shuffle（下手拇指朝上在胸口、上手拇指朝下；T2 ✅；Sasha DiGiulian 在 IC 內角也這樣做，V8 ✅ 127–140 秒）；斜縫：左傾就左手在上拇指朝下、右手在下拇指朝上（T2 ✅）；需要多搆一點距離時（T2 ✅、T7 ✅「you can reach farther with the lower hand thumbs up」）。
- 日文用語：「親指を上にした順手」、「親指下にした逆手」（V23 ✅ 字幕 506–509 秒），即 順手＝拇指朝上、逆手＝拇指朝下。V23 講者說手掌縫逆手「適当に入れても決まってくれる」、順手要技巧但較好接下一手（509–529 秒）。

### 3. Ring lock（off-fingers）

**定義先講清楚**：命名很亂。MP 有人整理：ring lock、thumb stack、butterfly、thumb cam 常被混用（T6 ✅）。一個實用分法：「If a pad of my finger is touching my thumbnail, thumbstack. If a pad of my thumb is touching my fingernail, ringlock.」（T7 ✅）

**步驟**（綜合）
- REI 版（OK 手勢入縫）總論篇已用。
- Public Lands 版：食指中指疊在拇指指甲上，「Your thumb knuckle should be jammed against one wall of the crack and your thumb-tip should be rest against the other. Crank your elbow in and down」（T18 ✅）。
- Climbing.com：「Place your pointer and middle fingers on the top portion of your thumb… pinky up and elbow out. Bring your elbow down and in」；而且「these need to be at your face or higher」（T2 ✅）。
- 物理圖像：「envision your thumb as an upward wedge which is passive, and your fingers as a downward active wedge (like a nut)」（T6 ✅）。

**感覺對不對**：Xi Yin 轉述 Tom Randall：「it's supposed to feel like someone is biting real hard on your thumb」（T6 ✅）。另一人：拇指第一節背面要平貼裂隙壁，「If the back of the whole first phalange of my thumb doesn't make flat contact… I'm better off with a thin hand」（T34 🟡）。

**常見錯誤**
- 塞太深：「Looks like you are jamming a bit too deep. Keep your thumb close to the outside of the crack」（T12 ✅）。
- 在平行縫裡學：先在縮口上方練，「This will help your thumb stay in place」（T12 ✅）；MP 有人建議用木板夾出可調寬度的縫在家練（T14 ✅）。
- 塞好後動手肘：「after you fiddle your jam into the crack, don't move your elbow」（T6 ✅）。
- 期待它很穩：「It will never feel secure, ring locks are generally desperate-feeling.」（T8 ✅）VIDEORACLES：「that's not a resting size」（V1 ✅ 138 秒）。

**不同意見**
- 有人覺得 stack 比 ring lock 穩，有人相反（T6 ✅ 首兩帖）。
- 有人很少用：「I don't use ring jams much」（T11 ✅）；花崗岩上「very few granite cracks are so splitter that they are constantly ri[nglock]」（T12 ✅）。
- 拇指柔軟度：發問者懷疑拇指僵硬做不出來，回覆者看照片說 ROM 夠、是技巧問題（T8 ✅）。這點沒有找到醫學來源，只能寫成「有人擔心」。
- 何時換成 tight hands：「When you can get a tight hand jam that is more secure than a ringlock」（T7 ✅），沒有固定尺寸。

**小手／大手**：#0.5 大手能 finger jam、小手要 ring lock（T4 ✅）；中文心得：「疊手指的大小，也就是介於BD紫色到綠色cam的大小」是作者的罩門，她認為缺的是「疊手指之後掛不久」的力量，不是技巧（T33 ✅，2014）。

**膠帶**：ring lock 很痛，建議貼食指（T2 ✅、T10 ✅）；但指節別貼、只在指節下貼一圈，「Avoid taping knuckles if possible」（T13 ✅）。

### 4. Finger stack／ratchet

- Climbing.com 的 ratchet：比指塞寬時，盡量把手塞進去，小指朝上、手肘外、拇指收在手指下，再把手肘往下往肋骨拉，「This ratcheting motion will create torque」；一樣要在臉的高度以上（T2 ✅）。
- MP：ratchet／stack 是在「just can't fit your hands in」那一側，ring lock 在「right before good fingers」那一側（T6 ✅）。也有人說 finger ratchet 用在更窄（0.3–0.4）的縫（T7 ✅）→ 名稱與尺寸對應在社群裡不一致，寫文章時要先定義。
- 疊兩指變一根：「cross your fingers (middle on top of pointer) and finger lock with 2 digits as 1. Fits somewhere between ring locks and normal fingers」（T11 ✅）。
- 小指墊在無名指下的 pinky stack，用在拇指朝上的紫色號附近（T7 ✅）。

### 5. Thumb cam／thumb lock／can opener

- V-Diff：「To thumb cam, put your fingers against one side of the crack with your thumb down and push your thumb against the other side.」警告：「This puts a lot of pressure on your thumb joints – be careful of dislocating it.」以及「In corners, this only works with one hand, since the thumb is in the wrong position on the other hand.」（T17 ✅）
- V-Diff 的 thumb stack：拇指先入縫，食指中指疊上去，往下拉、手肘下壓；可調整疊幾根手指、塞多深（T17 ✅）。
- 「作弊」用拇指推縫邊：「Don't be afraid to "cheat" by pushing your thumb against the edge of the crack, which will secure a rattly jam.」（T2 ✅）
- 內角指縫的組合：「Ring lock or can opener the top hand and paddle the bottom one.」（T11 ✅）
- Stevie Haston 的寫法：拇指尖頂裂隙邊緣，其餘手指把拇指往縫裡壓；不貼膠帶「painful and impossible」（T20 ✅）。
- 日本說法：サムロック（別名：サムカム、リングロック）（T26 ✅）；韓國：썸스택、썸캠（T30 ✅）。

### 6. Pin scar（舊岩釘疤）

- 是什麼：早年人工攀登反覆打拔岩釘，把縫敲出一個個口袋。Reddit 片段：「over time a desperate finger crack becomes a series of bomber finger locks. There are lots of climbs in Squamish that were once popular aid lines that are now a sequence of holds left by pin scars」（🟡 Keenable 片段，r/climbing〈Piton prejudice〉）。
- 怎麼用：「Pin scars and pods provide wider spots directly above constrictions, which are excellent.」（T2 ✅）英國也有：Millstone 這類 pegged-out 指縫「there will be more almost 'pocket like' constrictions where pegs have been, meaning that you must choose which to use… having a definite narrowing at the bottom can make these feel very secure」；天然縫則寬度均勻、少縮口（T3 ✅）。
- 代價：Yosemite〈Serenity Crack〉第一段「Hundreds of blown out pin scars the size of #1 Camalots create a practical ladder」，但「secure gear is not available for a long, long ways」、「painful on the t[oes]」；有人帶 offset cam 也放不好，「The scars are just too flaring or too shallow」；放進去的 cam 還擋住腳點（T24 ✅）。
- 腳：pin scar 多時 Whittaker 用 front-on smear（見 §7，T5 ✅）。
- 小手／大手：Goris 在 Joshua Tree〈The Stingray〉（pin scar 指縫，保護是 yellow alien／0.3）寫她 5'11"、夥伴 5'5"「His index fingers are the length and width of my pinkies」，兩人每個 jam 用法不同、她要強力纏膠帶護指側（T16 ✅）。

### 7. 指縫的腳法

Whittaker 的三招（T5 ✅）：
1. **Toe Jam**：腳轉到最薄方向（主要轉腳踝）；大拇趾先進、以它為支點把鞋外緣（小趾側）滾進縫；腳踝再小扭；**主動把腳尖往縫邊推**，「a weighted foot never slips」。用在稍陡或稍寬時。
2. **Front-On Smearing**：腳正對縫，站起時把腳跟往下壓、最大化橡膠接觸縫緣。用在 pin scar、pod、外擴、或稍成內角時。
3. **Frogged Position**：雙腳盡量高、放在屁股下，最薄方向；膝蓋朝外（打破一般裂隙規則）；左右腳互相往外推縫壁、不扭；屁股壓近腳跟；小步 shuffle、不交叉。用在非常平行、一扭鞋就滾出來的縫。

其他：
- 腳正對縫抹：「Point your foot straight at the crack, so your big toe lines up with the middle of the fissure. Bend your toes upward.」軟、合腳、薄頭鞋最好（T2 ✅）。VIDEORACLES：腳尖對齊縫、腳跟下壓、膝與髖在腳上方，另一腳 flag（V2 ✅ 章節 33 秒）。
- 先找縫外的點：Jean-Pierre Ouellet「The tiniest bumps will be good enough to get to the next jam.」（T2 ✅）小川山實例：「両手両足ジャミングしようとしてしまうと、結構無理な体制になって辛い」，改踩側壁的小ツブ就輕鬆（T28 ✅）。
- 內角縫：rand smear；靠內角那隻腳試著 jam（T11 ✅）。
- 鞋：Tom Randall「soft boots are generally better in these size cracks」（T3 ✅）；日本入門者換成窄頭的 UNPARALLEL Engage Lace-up 後「細いクラックでのフットジャムが一応決まるようになった」（T29 ✅）；Sneha 的筆記：薄邊要軟、已穿軟的鞋，有 smedge＋face 點時用硬一點的（T15 ✅）。
- 尺寸：粗指作者說他的 #0.4 腳「トゥジャムがギリギリ決まるかどうか」、#0.3「なかなか難しい」，找 offset 或縫外點、最後才是抹在縫上（T26 ✅）。
- 指縫是最難練腳的尺寸：「the finger crack is possibly the most difficult crack to master foot technique on」（T3 ✅）。

### 8. 指縫裡什麼時候改 layback

- 韓國김종식的判準（V15 ✅，創作者英文字幕 374–418 秒）：layback 條件「1.Jamming doesn't work 2.The edge is good for grip 3.Gradient is not steep(below 80)」；jam 條件相反（jam 有效、縫緣不好抓、坡度超過 80°）。比較：jam 會痛但「Jamming is stable from falling」，layback 快、省力。示範路線是선인봉（仙人峰）5.10c 左向內角。
- 同一位講者的另一個觀點（V15 ✅ 3–51 秒）：layback 是全身姿勢、jam 是握法，兩者本來不是同一層的二選一。MP 也說「The line between jamming and liebacking isn't always clear」（T11 ✅）。
- 最常見的實際做法是「jam、layback、再 jam 回來」：「Jam, layback, jam back.」（T34 🟡，〈Flared finger cracks〉）；內角 0.5 縫：「high thumbs down jam, sort of a gaston… rotate into something resembling a lieback」（T11 ✅）。
- 代價：layback 時難放保護、看不清 cam；腳要高（V4 ✅ 字幕 6–50 秒「lie-backing is not a first-choice technique」）。韓國월간山：jam 熟練前避免抓縫 layback（T31 ✅，2017）。
- 小川山實例：入門者第一年〈小川山レイバック〉下部「レイバック以外考えられなかった」，第二年「オールジャミングで登れた」（T29 ✅）；〈クレイジージャム〉出だしのシンハンド內角「レイバックでさっさと抜けてしまった方が楽」（T28 ✅）。
- 臂長：「people with longer arm ratios have an easier time laybacking」（T11 ✅，單一留言）。

### 9. 粗糙岩 vs 光滑岩

- 直接比較「粗糙 vs 光滑」對指塞影響的教學來源**沒找到**。能用的旁證：
  - Indian Creek 砂岩縫「長且均勻」、岩面「找不到岩點」，同一動作要重複十幾二十米（T33 ✅）；IC 會「ravage every inch of exposed skin」（T19 ✅）。
  - 花崗岩縫不常是完美平行，ring lock 用得少（T12 ✅）；pin scar 主要在 Yosemite／Squamish 花崗岩與英國 Millstone 砂岩採石場（T2、T3、T24 ✅）。
  - 木造練習縫比岩石滑：「나무로 만들어진 크랙이다 보니 더 미끄러운 건 등반자의 몫」（T32 ✅）；gym 平行縫「very hard to figure out how to jam」（T14 ✅）。
  - 龍洞：總論篇已整理岩質（粗糙、要貼膠帶）。粗糙岩上的指縫皮膚磨損和「膠帶讓手指變粗約 1mm、在 2cm 寬的縫等於窄了 5%」（T25 ✅）這兩件事要一起權衡；大手指的 Whittaker 為了塞進極細縫直接不貼（T22 ✅）。這是推論，不是來源直接說的。

## 三、影片清單（全部 yt-dlp 查過 upload_date；2020-01-01 以後、90 秒以上）

格式：`video_id | 標題 | 頻道 | upload_date | 長度(秒) | 岩場/地點 | 人物 | 類型 | 語言 | 示範重點＋start 秒數 | 查證方式`。start 秒數只在有字幕或章節依據時才寫。

### 3.1 教學片

| V | 資料 |
|---|---|
| V1 | `AjiP5-AM2Rw` \| Crack Climbing: Jamming Fingers \| VIDEORACLES \| 2021-02-15 \| 191 \| 戶外岩石（地點未標） \| 男性教練（頻道主） \| 教學 \| 英 \| 0 拇指朝下、手肘往中線；31 細縫改小指朝下；49 稍寬改拇指朝下、55 第一指節卡；79 第二指節卡；101 rattly fingers 全靠扭力；125 ring lock（OK 手勢到疊拇指）；138「not a resting size」；160 換 thin hands \| 自動字幕 |
| V2 | `HgpCOnPIR7o` \| Crack Climbing: Jamming Feet \| VIDEORACLES \| 2021-02-16 \| 229 \| 同上 \| 同上 \| 教學 \| 英 \| 12 縫外腳點；33 指縫上正面 smear（腳尖對縫、腳跟下壓、另一腳 flag）；78 外旋膝蓋塞腳尖再收回中線；126 稍寬改腳尖直插 \| 章節＋字幕 |
| V3 | `DbnofcWjVts` \| Which Crack Climbing Technique is Strongest? \| Wide Boyz \| 2021-10-07 \| 1069 \| 室內測力裝置 \| Pete Whittaker、Tom Randall \| 教學／實驗 \| 英 \| 0 tips（19–25 kg）；278 fingers（平均 31.5 kg）；416 ring lock，Tom 同寬 ring lock 17 kg vs paddle 36 kg \| 章節＋字幕 |
| V4 | `vUU7Qd1jQSo` \| Laybacking \| VIDEORACLES \| 2021-02-25 \| 106 \| 抱石岩片 \| 同 V1 \| 教學 \| 英 \| 6「lie-backing is not a first-choice technique」、難放保護；20 能 jam 就先 jam；36 腳要高 \| 字幕 |
| V8 | `9pa0xGzvb8U` \| Sasha DiGiulian crack climbing tutorial in Indian Creek \| Sasha DiGiulian \| 2020-01-14 \| 381 \| Indian Creek \| Sasha DiGiulian（女性職業攀岩者，向同行者學） \| 教學＋實錄 \| 英 \| 58 貼膠帶；111 技巧段：腳配合縫扭轉；127 拇指上下看感覺，內角時下手拇指朝上、上手拇指朝下 \| 章節＋字幕 |
| V15 | `gZw9eiu0xM0` \| 크랙 등반 기술 3부: 재밍이냐 레이백이냐, 선인봉 좌향 크랙 \| K Climbing Company（김종식） \| 2023-03-05 \| 653 \| 韓國 道峰山 선인봉（仙人峰）左向內角 5.10c \| 김종식（韓國攀岩教練） \| 教學 \| 韓（創作者英文字幕） \| 6 layback 是姿勢、jam 是握法；374 layback 三條件（jam 無效、縫緣好抓、坡度 80° 以下）；391 jam 三條件；410 jam 痛但墜落時穩、layback 快省力；445 layback 步驟；522 下段 jam 較難 \| 字幕（en/en-US，創作者上傳） |
| V19 | `VRc_iFasUc4` \| 【基本】クラッククライミングの技術をご紹介！Part1 \| TAKEMOVIE（タケムービー） \| 2021-09-09 \| 1049 \| 日本（地點未標） \| 日本攀岩 YouTuber \| 教學 \| 日 \| 358 フィンガージャム；473 シンハンド \| 章節（無字幕） |
| V25 | `NYEsr6X1R3Y` \| 【攀岩进阶技巧】裂缝攀岩的初学者指南（上） \| 知岩片语 Climbing Whispers \| 2020-03-13 \| 720 \| 美國 Planet Granite Sunnyvale 岩館 \| 邵远（女性）、嘉宾炜轶 \| 教學 \| 中（簡） \| 419 指缝（finger crack）爬法；521 宽手指缝（off fingers）爬法 \| 章節＋說明欄時間線 |
| V7 | `-E1hwhUDsXU` \| How to be a Crack Master \| Wide Boyz \| 2022-08-14 \| 1014 \| 英國 Roaches／Ramshaw gritstone（Cracker's Dozen 清單） \| Pete Whittaker \| 實錄＋講解 \| 英 \| 218「looks like my podgy index finger」；494 The Undertaker E3、527「quite steep finger locks」；655 不貼膠帶很痛 \| 章節＋字幕 |

### 3.2 攀爬實錄（能看到指縫技巧）

| V | 資料 |
|---|---|
| V9 | `8-pgiq4vClc` \| Tricks are for Kids Extension 5.13c \| Brittany Goris \| 2020-12-11 \| 295 \| Indian Creek \| Brittany Goris（女性） \| 實錄 \| 英（少量口白） \| 說明欄：前段是 ring lock 馬拉松（影片未拍到），後段一路縮到 fingers 再到 tips \| 說明欄 |
| V10 | `EAtB7Meb7ow` \| Pat's Blue Ribbon, 5.13- Hard and Painful Finger Crack Climb \| Spencer McKay \| 2022-07-11 \| 474 \| Indian Creek \| Mary Eden（Tradprincess，女性） \| 實錄 \| 英 \| 118 進 pod 休息；168 離開 pod 是 0.3、「blue metolius is tips for me」，再縮到 0.2 與 000；330 crux、手指卡住磨掉指腹 \| 章節＋字幕＋說明欄 |
| V11 | `HJ__CZt7Lwk` \| Alpine Follies Hangover Finger Crack \| Tradprincess \| 2023-02-14 \| 648 \| 美國 Sedona \| Matt Starr、Sam Foreman、Mary Eden（三人各用不同方法） \| 實錄 \| 英 \| 28 Matt 首攀先鋒；460 吊在指尖的 finger lock \| 章節＋字幕＋說明欄 |
| V12 | `e87dURsVa7M` \| Top 6 Super Splitters of Indian Creek \| Wide Boyz \| 2022-05-08 \| 720 \| Indian Creek \| Whittaker、Randall \| 實錄 \| 英 \| 490 Tricks Are For Kids 5.13c（與 V9 同線，大手 vs Goris 對照） \| 章節 |
| V13 | `Qtq4HCEP_RA` \| The FORBIDDEN 5.10 in Yosemite Valley – Serenity Crack 5.10d \| The Gravity Lab – Brant Hysell \| 2021-11-11 \| 1308 \| Yosemite〈Serenity Crack〉 \| Brant Hysell（男性） \| 實錄 \| 英 \| 64 P1；463「the placements are all in like pin scars」；777「slabby finger crack」 \| 章節＋字幕 |
| V14 | `0sWVt5QrwTk` \| … FLASHING Serenity Crack and Sons of Yesterday \| Michael Tillman \| 2023-07-14 \| 2297 \| Yosemite \| Michael Tillman \| 實錄 \| 英 \| 68 P1（pin scar 段）；1194 P3 \| 章節＋字幕 |
| V20 | `UGQ-yp3oDtk` \| 小川山 蜘蛛の糸 5.11c RP \| The Climb \| 2021-05-27 \| 803 \| 小川山 屋根岩二峰 \| 日本攀岩者 \| 實錄 \| 日 \| 說明欄 move memo：下部「右逆手フィンガー…左手は…サムロック」再轉 layback；上部「右逆手フィンガー（親指は添えて、小指は抜いて）」 \| 說明欄 |
| V21 | `RlG93RzE0qw` \| 【4K動画】小川山「バナナクラック」(5.11d) \| 萩原悟のクライミング映像 \| 2021-10-04 \| 222 \| 小川山 仏岩 \| 和田剛、星一人 \| 實錄 \| 日 \| 說明欄：核心是 undercling 式 layback，後半接「やや広めのフィンガーサイズは意外と手強く」 \| 說明欄 |
| V22 | `uM1dihjSyjg` \| B1フィンガー 5.11a 瑞牆 クラック地獄 \| 今日からきみは‼-にわかアルピニスト \| 2025-04-03 \| 331 \| 瑞牆 クラック地獄（全 trad 區） \| にわかアルピニスト（粗指男性，即 T25/T26 作者） \| 實錄 \| 日 \| 說明欄：短而技術性的指縫，「5.11の登竜門」 \| 說明欄 |
| V23 | `85N6_GKz73g` \| カサブランカ｜小川山を代表するクラックルート『OSチャレンジ』 \| のぼるきょじん \| 2023-08-04 \| 1166 \| 小川山 妹岩 5.10b \| きょじん（yamato） \| 實錄 \| 日 \| 506 拇指朝上（順手）比朝下（逆手）好用；889 短暫轉 layback；944「フィンガーに近い」段 \| 自動字幕（ja） |
| V26 | `JXjjh0vYtQw` \| 龍洞「翻天手」傳攀 \| rock6879 \| 2022-03-02 \| 398 \| 龍洞 \| 台灣攀岩者 \| 實錄 \| 中（無口白） \| 說明欄：「印象中的手指裂隙變寬了」、原擔心要用兩支 0.2 分力；手指裂隙潮濕 \| 說明欄 |

### 3.3 查過但排除（2020 前，或內容不是指縫）

| video_id | 標題 | upload_date | 排除原因 |
|---|---|---|---|
| `9W99gN54wLQ` | Wild Country Crack School Ep.1 Finger Cracks | 2012-05-04 | 2020 前（經典，文字版 T3 已收） |
| `mIdE-Dzzvlk` | Wild Country Crack School Ep.7 Advanced Fingers | 2014-02-14 | 2020 前 |
| `ESZjWZPx2Kk` | Crack Climbing Tips: Finger Jams With Tom Randall（EpicTV） | 2018-02-08 | 2020 前（Reddit 推薦的 ring lock 示範在 123 秒，可當延伸） |
| `jzdgWsbGbMc` | REI: How to Climb Finger Cracks | 2016-02-10 | 2020 前 |
| `18v8hRj-C7w` | Crack Climbing 101 Ep.3 Thin Hands and Fingers | 2018-07-12 | 2020 前 |
| `CBIQzopPZEE` | Climbing Tech Tips: Finger Locks vs. Laybacking | 2018-02-02 | 2020 前 |
| `vvE03Q-2YsM` | Craig leading a 5.10D finger crack at Squamish | 2013-08-13 | 2020 前 |
| `71IRX1qtDvk` | Learning to Crack Climb on Exasperator（Squamish） | 2018-09-07 | 2020 前 |
| `K9obayzpaVw` | Turkey crack 8a, Cadarese | 2014-08-18 | 2020 前 |
| `wUpR1jRb9iI` | Slim Finger Crack 5C（英國） | 2017-09-01 | 2020 前 |
| `A-y-qvqn6MM`、`f9KImwQQex0` | 小川山のフィンガークラック／フィンガークラック 3級 | 2019-08-06／2011-10-13 | 2020 前 |
| `gtdAyyMMUH4` | Thin-hands… unused foot dangles | 2012-12-06 | 2020 前 |
| `GcRAkkFbutg` | Jay Smith – crack footwork | 2008-12-06 | 2020 前 |
| `ABtnWScoix8`、`H5reKEOINU8` | EpicTV：Matt 跟 Wide Boyz／Tom Randall 學裂隙 | 2018 | 2020 前 |
| `NH6V7jWknaM` | Magnus Midtbø: HOW TO CRACK CLIMB – WIDE BOYZ | 2019-03-25 | 2020 前 |
| `-ocSfP62RLA` | Geek Climber 35 天學裂隙（Wide Boyz 指導） | 2022-03-31 | 主要是手掌縫，非指縫 |
| `B3xHMkcOAVc` | Lattice: Crack Training With No Cracks | 2020-02-18 | 訓練片，指縫技巧少 |
| `mHErzqpYKqM` | Anna Hazelnutt × Tom Randall 5 techniques | 2021-09-29 | 章節是寬縫、煙囪、手掌，無指縫 |
| `9TxC4fNIe6k` | VIDEORACLES: Putting It All Together | 2021-02-17 | 手掌縫為主 |
| `zdegY0z0fMI` | Active Alexis：Crack camp with Mary（IC） | 2022-02-03 | 女性新手營隊心得，指縫內容少（可當「女性學習紀錄」延伸） |
| `QxrnnFduwbg`、`SrcmP59WJiY` | 韓國 三聖山 무당골 5.12a／인클암장 5.11a 指縫 | 2022-04-08／2025-11-17 | 說明欄沒有技巧描述、無字幕，不符「讀字幕或說明欄才能列入」；可當候補 |
| `nTapvs7T_Fg`、`XxkFjyaIeV8`、`2t-Ihl8TsJg`、`RTHO2ErsauA` | 龍洞 曙光裂隙／Disco／龍洞裂隙 | 2024–2026 | 說明欄沒寫是指縫（曙光裂隙說明只寫「塞手」）；無字幕 |
| `RsvaurlrESM` | 小川山 三本槍クラック 5.11b | 2023-07-26 | 說明欄只有路線名 |
| `3VIl0fNzjJM`、`X9A3RJhOpp4`、`OnFaXE3GVB0` | Yosemite Jam Crack／Central Pillar P2／Squamish Crime of the Century | 2023／2023／2024 | 說明欄只有標題層級資訊、無字幕；見 3.5 |
| `1rf43BG8DN0` | Cadarese 2021 | 2021-12-14 | 章節是路線名，看不出哪段是指縫 |

### 3.4 龍洞的指縫路線（文字來源 T35，Mountain Project 路線頁，curl 讀全文 ✅）

台灣書面資料沒有指縫技術專文，但 MP 龍洞路線頁有不少描述寫到 finger crack，可當「在龍洞去哪練」的起點。等級照 MP 頁首；有留言提出不同等級的另外註明。

| 路線 | 區域 | MP 等級／類型 | 原文短句 |
|---|---|---|---|
| [One Fine Sunny Day](https://www.mountainproject.com/route/112460246/one-fine-sunny-day) | 黃金谷 Golden Valley | 5.6 Trad | 「Easy climbing in the beginning, then finger crack.」 |
| [Fillet Show](https://www.mountainproject.com/route/107991222/fillet-show) | Above the Waves | 5.8 Trad | 「climb the clean finger crack in the back of the dihedral. Gear can be a little finicky」；確保點在浪上 |
| [Grotto](https://www.mountainproject.com/route/107843884/grotto) | 第二洞 Second Cave | 5.10b Trad | 「a crack that quickly thins to fingers and then to tips… smearing feet」 |
| [Westbound Road](https://www.mountainproject.com/route/108005463/westbound-road) | 第一洞 First Cave | 5.10 Trad（留言有人寫 5.10c） | 「Finger jams through the overhang」；留言：「a finger lock past the overhang helps a great deal」、也有人說「possible to do the crux without finger crack techniques」 |
| [Piranha](https://www.mountainproject.com/route/108417005/piranha) | 校門口 School Gate | 5.11a Sport（留言：書上 5.11c，實際約 5.10） | 「tackle an arcing fingercrack to reach the shuts」 |
| [Finger Crack](https://www.mountainproject.com/route/106740874/finger-crack) | 音樂廳 Music Hall | 5.11 Sport（有錨栓） | 「Gain the bolted finger crack… You can easily cheat right at the crux.」 |

另有 V26〈翻天手〉傳攀影片（說明欄寫手指裂隙、0.2 cam）。有錨栓的指縫（Piranha、Finger Crack）適合先用運攀方式練指塞，不必同時處理保護。這是建議，不是來源說的。

### 3.5 第二輪補搜（為了補女性、小手／大手、Squamish、韓國、英國）

| V | 資料 |
|---|---|
| V27 | `CXNJnE8SQAc` \| How to be a short climber – 10 tips from Hazel Findlay \| Hazel Findlay ~ Strong Mind \| 2024-04-18 \| 634 \| （訪談，非岩場） \| Hazel Findlay（女性職業攀岩者） \| 心得／教學 \| 英 \| 133 Advantages 章節；173–187「having smaller hands and feet can sometimes be helpful with crack climbing… some cracks are going to be easier if you've got small hands」 \| 章節＋字幕 |
| V28 | `Sy6tvFxlBDo` \| Mary Eden sends Black Mamba… \| WildCountryClimbing \| 2025-05-30 \| 1120 \| Canyonlands White Rim（Utah 砂岩屋簷縫，Wide Boyz 開的 5.14b） \| Mary Eden（女性） \| 實錄＋講解 \| 英 \| 157「crappy feet and hang off of ring locks or finger jams」；551 側拉 finger lock 去搆 ring lock，「that ring lock [can] be so insecure」 \| 章節＋字幕 |
| V29 | `8ohtiqNVs6w` \| She Created the REAL Impossible Crack Boulder for me \| Wide Boyz \| 2025-04-06 \| 1039 \| 室內人工裂隙（女性定線員設計） \| Pete Whittaker \| 實錄＋講解 \| 英 \| 633 中段 thumbs-down finger lock 很爛；668「I'm going to use the ring cuz my middle finger is too fat」（大手的人改 ring lock）；725 donut jam 可用 1–4 指 \| 章節＋字幕 |
| V30 | `LMWKYfwKQ_o` \| Squamish Rock Climbing \| Grub Street 5.11a \| Alpine Gremlin \| 2023-05-27 \| 678 \| Squamish \| 頻道主與同伴（男性） \| 實錄 \| 英 \| 272「focus on your feet」；340 腳滑出；358 finger jam；392「it's not all about my Lumberjack fingers」 \| 自動字幕 |
| V31 | `t49lYBpA-jo` \| Finger Crack Climbing "Astrodad" 5.11+ Wall Street, Moab \| Moab Rock Climber 88 \| 2023-06-06 \| 836 \| Moab Wall Street（砂岩） \| 頻道主 \| 第一人稱實錄 \| 英 \| 說明欄：first person beta、需雙套小 cam \| 說明欄 |
| V32 | `uwsh4bQTY_o` \| 도봉산 선인봉 남측오버행 암벽등반 크랙등반(crack climb.pinger jamming) \| 최기련 \| 2020-09-30 \| 658 \| 韓國 道峰山 선인봉 南側 overhang \| 韓國攀岩者 \| 實錄 \| 韓 \| 標題寫 finger jamming、說明欄「레드포인트 등반」；無字幕不標秒數 \| 🟡 標題＋說明欄（說明欄沒描述技巧） |
| V33 | `ns2gu6Gg37I` \| 선인봉 코너크랙 핑크포인트_250608 \| 전밥시(JEON BABSI) \| 2025-06-12 \| 826 \| 선인봉 corner crack \| 韓國攀岩者 \| 實錄 \| 韓 \| 說明欄：「Traditional climbing route featuring a corner crack」；尺寸未寫 \| 🟡 說明欄 |
| V34 | `Nc_otfbu0b8` \| 재밍 기술 12가지: 크랙 등반 잘하는 법 2부 \| K Climbing Company（김종식） \| 2023-01-19 \| 919 \| 韓國（地點未標） \| 김종식 \| 教學 \| 韓 \| 109 指縫分 thumb down／thumb up，「the one getting more power is the thumbdown」；156–172 斜縫一手朝下一手朝上；202 拇指肉要碰到對面壁；210–219 ring jam（做一個圈、咬到拇指）；255 疊（stacking）；519 只進得去腳尖的縫 \| 韓文自動字幕＋自動英譯（第二輪重抓才拿到） |
| — | `5nkbZT7r_xQ` \| 城ヶ崎 漁火ロック イサリビ・クラックライト 5.10c \| 5Gクライミング \| 2026-07-19 \| 366 \| 城ヶ崎 \| 日本攀岩者 \| 實錄 \| 日 \| 說明欄：「クラックとフェイス要素が半々」，cam 用 Totem 1.8／1.5／0.8，**不是純指縫**，只能證明城ヶ崎缺純指縫影片 \| 說明欄 |

排除：`KiApgYCGC34`（たかボル，剪輯他人影片的解說彙整）、`KqDne5tif_I`（城ヶ崎〈虎の穴〉女性完登，2017）、`LDGCvdxHH7s`（韓國〈강적크랙〉이명희，2017）、`sdQh2pRaths`（2017）、`4YFwrJ8-QkQ`、`boYneswEemA`（說明欄空、無字幕）。

## 四、覆蓋矩陣

### 4.1 子技巧 × 維度

| 子技巧 | 岩場（≥3） | 人（≥3） | 教學＋實錄 | 非英語 | 反證／失敗 |
|---|---|---|---|---|---|
| 拇指朝下指塞 | IC（V10）、Ramshaw gritstone（V7）、小川山（V20）、韓國（V34）、人工縫（V29） | VIDEORACLES、Whittaker、김종식、Mary Eden | 教學 V1/V34/T1；實錄 V7/V10/V29 | 韓 V34、日 T26/V23 | 「一直朝下是新手錯誤」（T2）；下巴以下失效（T7、T34🟡） |
| 拇指朝上／小指朝下 | IC（V8）、小川山（V23）、韓國（V34） | Sasha DiGiulian（女）、きょじん、김종식、VIDEORACLES | 教學 V1/V8/V34；實錄 V23 | 日 V23（順手／逆手用語）、韓 V34 | 小指朝下沒縮口時很費力（T1） |
| Ring lock | IC（V9、V28、T10）、人工縫（V29）、gym（T7） | Goris（女）、Mary Eden（女）、Whittaker（大手）、Xi Yin（女，T6）、MP 一般攀岩者 | 教學 V1/V3/V34/T2/T18；實錄 V9/V28/V29 | 韓 V34、日 T26（サムロック）、中 T33（疊手指） | stack 派 vs ring 派（T6）、做不出來的人（T8）、花崗岩少用（T12）、測力：同寬 paddle 36 kg > ring 17 kg（V3） |
| Finger stack／ratchet | IC（T33）、gym（T7） | MP 多人、中文女性講師（T33） | 教學 T2/T7/T11；**實錄缺** | 中 T33、韓 V34（stacking） | 名稱與尺寸對應不一致（T6 vs T7） |
| Thumb cam／thumb lock／can opener | 小川山（V20 サムロック）、IC 內角（T11） | V-Diff、MP、Stevie Haston、The Climb（日） | 教學 T17/T2/T20；實錄 V20 | 日 V20/T26、韓 T30 | 脫臼風險（T17）；內角只有一手能用（T17） |
| Pin scar | Yosemite（V13、V14、T24）、Joshua Tree（T16）、英國 Millstone（T3）、Squamish（Reddit 🟡） | Brant Hysell、Michael Tillman、Goris（女）、Tom Randall | 教學 T2/T3；實錄 V13/V14 | **缺** | 難放保護、傷腳、cam 擋腳點（T24） |
| 指縫腳法 | IC（V8）、小川山（T28、T29）、Squamish（V30）、Joshua Tree（T15） | Whittaker（T5）、VIDEORACLES（V2）、Sneha（女）、日本入門者（T29） | 教學 V2/T5/T2；實錄 V30 | 日 T26/T28/T29、韓 V34 | 「最難練腳的尺寸」（T3）；別硬要四肢都 jam（T28） |
| 指縫 layback 選擇 | 선인봉（V15）、小川山（V21、V23、T28、T29）、IC 內角（T11） | 김종식、きい山歩、のぼるひと、MP | 教學 V15/V4；實錄 V21/V23 | 韓 V15/T31、日 T28/T29 | layback 與 jam 不是同一層的二選一（V15、T11） |

### 4.2 岩場覆蓋

| 岩場 | 有的來源 | 狀態 |
|---|---|---|
| Indian Creek | V8、V9、V10、V12、V28（Canyonlands）、T9、T10、T19、T33 | ✅ |
| Yosemite | V13、V14、T24、T23（Meltdown） | ✅（實錄）；Yosemite 指縫教學片缺 |
| Squamish | V30、T2（pin scar 泛論）、Reddit 🟡 | 🟡 只有一支 2020+ 實錄可查證；`OnFaXE3GVB0`（Crime of the Century）說明欄空、無字幕 |
| 英國 gritstone／Peak | V7（Roaches／Ramshaw）、T3（Millstone peg scars，2012） | ✅ |
| 日本 小川山／瑞牆 | V20、V21、V22、V23、T25、T26、T28、T29 | ✅ |
| 日本 城ヶ崎 | `5nkbZT7r_xQ`（非純指縫） | ❌ 純指縫影片缺 |
| 韓國 仁壽峰 | — | ❌ 指縫影片沒找到；仁壽峰搜到的多是 layback／slab（如 여정길「크랙 레이백등반의 성지」，2019 前或無說明） |
| 韓國 道峰山 선인봉 | V15、V32🟡、V33🟡 | ✅（V15 有字幕） |
| 台灣龍洞 | V26、T35（6 條 MP 路線） | 🟡 有路線、有 1 支說明欄寫手指裂隙的影片；沒有技巧教學 |
| 歐洲（Cadarese 等） | `1rf43BG8DN0`（看不出指縫段） | ❌ |
| 澳洲、南非 | — | ❌（未搜） |

### 4.3 人與手的大小

| 類別 | 來源 |
|---|---|
| 職業攀岩者 | Whittaker（V3、V7、V12、V29、T1、T4、T5）、Randall（V3）、Hazel Findlay（V27）、Mary Eden（V10、V11、V28）、Brittany Goris（V9、T16）、Sasha DiGiulian（V8） |
| 教練／教學頻道 | VIDEORACLES（V1、V2、V4）、김종식（V15、V34）、知岩片语（V25）、TAKEMOVIE（V19）、ASAI Nature Climbing（T27🟡）、V-Diff（T17） |
| 一般攀岩者／學習紀錄 | MP 各串（T6–T14）、Sneha（T15）、にわかアルピニスト（T25、T26、V22）、きい山歩（T29）、韓國學員（T32）、MP 新手 ring lock 紀錄（T12） |
| 女性 | Hazel Findlay、Mary Eden、Brittany Goris、Sasha DiGiulian、Sneha、Xi Yin、T9 發問者的妻子、T33 作者 |
| 大手／粗指 | Whittaker（V7、V29、T22）、にわかアルピニスト（T25）、Goris 相對夥伴（T16）、Grub Street「Lumberjack fingers」（V30） |
| 小手／細指 | Hazel Findlay（V27）、Mary Eden（V10）、Goris 的夥伴 Prith（T16）、T9、T11（「tiny little fingers… rattley fingers are 0.5s for me」） |

## 五、仍缺的格子（已補搜一輪）

補搜做過：第二輪 YouTube 18 組關鍵字（女性、Hazel、Babsi、Millstone、Peak、IC ring lock、IC 5.11 POV、Squamish 2023、Yosemite pin scars、Index、小川山、城ヶ崎、仁壽峰、선인봉、龍洞）＋ Keenable 文字搜 15 組（日韓中各語）。仍缺：

1. **Pin scar 的非英語來源**：日文搜「ピンスカー」只得到 Yosemite 遊記，沒有技巧內容。
2. **城ヶ崎純指縫、韓國仁壽峰指縫、歐洲（Cadarese／Orco／Chamonix）、澳洲、南非**：2020+ 能查證的指縫影片沒找到。Babsi Zangerl 搜到的是 Gondo Crack（`-1DDUc3aQVY`，未抓到 metadata）與 El Cap，非指縫教學。
3. **Finger stack 的實錄影片**：只有文字。
4. **台灣**：沒有指縫技巧的中文教學或心得；只有 MP 路線描述與 1 支說明欄提到手指裂隙的龍洞影片。台灣資料少是常態，列為「台灣在地化要靠本文自己整理」，不當研究缺口。
5. **粗糙 vs 光滑岩對指塞的差異**：沒有任何來源直接比較，§二.9 只有旁證與推論。
6. **拇指柔軟度是否影響 ring lock**：只有 MP 一串討論（T8），沒有醫學或教練來源。
7. Yosemite／Squamish 的 2020+ 指縫**教學**片：只找到實錄。

## 六、未關閉項目（🟡／🔴 → 處理結果）

| 項目 | 狀態 | 已試工具與失敗原因 |
|---|---|---|
| T34 Reddit 三串（steep rattly、flared、climbergirls finger cracks）＋〈Piton prejudice〉 | 🟡 → ⚪（全文不可得；保留 Keenable 片段原文） | curl www／old.reddit `.json`：403／登入牆；Exa `web_fetch_exa`：SOURCE_NOT_AVAILABLE；Tavily `tavily_extract`：Failed to fetch；內建 WebFetch：unable to fetch from www.reddit.com；Groundlane MCP 需 OAuth、直接 HTTP 401。用到這些片段的主張都另有 ✅ 來源（下巴高度＝T7；jam-layback-jam＝T11）。沒試 Chrome 擴充（需使用者瀏覽器，可選） |
| T1 Whittaker 書摘付費後段（ring lock 等） | 🟡 → ✉️ | 付費牆；書本身是付費出版品。ring lock 改用 T2、T6、T7、T18、V1 等 ✅ 來源 |
| T27 ASAI note 後段 | 🟡 → ✉️ | note 付費章節 |
| Instagram〈山地流浪 Sandy〉 | 🟡 | 只有 Keenable 片段；IG 需登入。只用作「小手在龍洞拳縫卡不住」的旁證，主張另有 T4 ✅ |
| `mUHJCGsygvU`（김종식 Wayfarer Crack）、`-1DDUc3aQVY`（Babsi Gondo Crack）等 | 🔴 未抓到 metadata | yt-dlp 429／第二輪仍失敗；不列入清單 |
| V32、V33（선인봉，說明欄無技巧描述、無字幕） | 🟡 | 已重抓字幕：「There are no subtitles」。保留為候補，不標秒數 |
| `OnFaXE3GVB0`（Squamish Crime of the Century） | 🟡 | 重抓字幕：無字幕；說明欄只有頻道連結。不列入正式清單 |

## 七、給寫稿的提醒

- 名詞要先定義：ring lock／thumb stack／thumb cam／ratchet／finger stack 在英文社群就混用（T6、T7）。建議文章採 V-Diff（T17）＋MP 判別法（T7）的定義，並註明「別人可能叫法不同」。
- cam 號數只當「多數人大約」：T7 有人明說「Talk about techniques, not tools」。
- 小手／大手要寫成「每個尺寸都有人吃香」（T4），並附反證（T23、T25），避免寫成「小手比較適合指縫」。
- 中文用語：中文心得用「疊手指」（T33）；知岩片语用「涨指缝」「宽手指缝（off fingers）」（V25）。台灣用語在既有資料找不到，沿用總論篇「指塞」為譯名。
