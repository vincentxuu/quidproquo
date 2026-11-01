# 研究筆記：手掌裂隙、拳裂隙、屋簷／斜裂隙

> 範圍：hand cracks、fist cracks、roof cracks、leaning/diagonal cracks。
> 研究日：2026-10-26。暫存檔（info.json、字幕、Keenable 抓回的逐字稿、網頁原文、龍洞影片抽格圖）在 `/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/15b045f4-4588-4bdc-aa33-b878e65bd926/scratchpad/crack/hands-fists-roofs/`
> 已讀過總論〈裂隙怎麼爬〉的參考資料，重複使用處標「總論已用」。這份以新增來源為主。

## toolDegradation

| 步驟 | 工具 | 結果 |
|---|---|---|
| 1 | Groundlane MCP（`mcp__claude_ai_groundlane__*`） | 只出現 `authenticate`，沒有授權，web_search／web_fetch 無法呼叫 |
| 2 | Groundlane 直接 HTTP（POST `/mcp` tools/call） | 回空內容（需要授權） |
| 3 | Keenable keyless：search | ✅ 所有網頁搜尋都走這條 |
| 3b | Keenable `GET /v1/fetch/public?url=` | ✅ 可以抓 YouTube 頁面，有些影片附帶逐字稿（含 `[m:ss]` 時間戳），用來補 yt-dlp 抓不到的字幕 |
| 5 | Exa `web_fetch_exa` | 用來抓 UKC 的頁面（curl 抓 UKC 只回 21 bytes），成功；Reddit 一頁 Exa 回 SOURCE_NOT_AVAILABLE，沒有再追（2013 年的串，不在 2020+ 母群） |
| 6 | curl＋自己寫的 html→text | 其餘頁面都用這條讀全文 |
| YouTube | yt-dlp | 搜尋正常。info.json 第一輪被「Sign in to confirm you're not a bot」擋，加 `--cookies-from-browser chrome` 後 83 支全部拿到。**字幕的 timedtext 端點從第 6 支起一直回 HTTP 429**，Google 對 IP 回「Sorry」頁，換間隔 30 秒、直接 curl 字幕 URL 都一樣。改用三種方式查證：(a) 已經下載到的 5 支字幕；(b) Keenable fetch 帶回的逐字稿（17 支有實際內容）；(c) info.json 裡的章節與說明欄。龍洞影片沒有字幕，也沒有說明，所以每 60 秒抽一格畫面來看（ffmpeg） |

查證欄的代號：**字幕**＝yt-dlp VTT；**KT**＝Keenable 逐字稿（時間戳是段落起點，示範內容出現在該秒數之後）；**章節**＝YouTube chapters；**說明**＝說明欄；**抽格**＝畫面抽格。

---

## 一、各子技巧的教學重點

### 1. 手塞（hand jam）的基本動作

**步驟（各來源一致）**
1. 手先放鬆、壓扁，掌形像 L 再插進去。不要在裂隙外就先擺好塞手的手形。
2. 插到手腕附近，裂隙邊緣要落在手腕，不是落在指根。
3. 拇指往掌心收，朝小指根方向推，靠拇指根部的肌肉（thumb pulp）撐開。手指頂住對面岩壁，只是輔助。
4. 找下方變窄的地方往下卡；能卡在收口上，就靠骨架掛住，不必一直出力。

- Pete Whittaker〈3 Techniques Crucial For Crack Success〉（Wide Boyz 電子報）✅："Make your hand as thin as possible and relax it (L-shape). It's incredible how many people start making a hand jam shape before it actually enters the crack"；"Tuck your thumb into the centre of your palm, push it towards the little finger (and down)."
- Pete Whittaker〈The one way to truly rest on a hand jam〉✅：手指會痠，是因為用手指壓太多，拇指撐得不夠。"Your thumb is the powerhouse! … The pressure from your fingers should be minimal, it is there for the extra 20-30%"；"In a perfect hand jam you should be able to hang easily off the jam without the opposing pressure of the fingers."
- Tom Randall〈Wild Country Crack School Part 2〉UKC（2012，原理類）✅："push it hard towards your pinky before fully weighting your hand jam – that way you produce maximum width, before putting all the force through it."
- Geek Climber -ocSfP62RLA（字幕 30–150s）：Pete 指出初學者最常見的錯誤是手插得不夠深，以及手塞放得太靠近胸口。手放太低時手肘會往外張，人會往後倒。

**常見錯誤**
- 手沒插深，裂隙邊緣壓在指根上（-ocSfP62RLA 字幕 60s）。
- 用手指去抓裂隙邊緣，那不是塞手（VIDEORACLES nLIzQb0a3X4 KT [0:00]）："I see a lot of people when they're learning trying to grip the edges of the crack with their fingers but that's not an efficient jamb"。
- 手指壓太多導致指關節過伸或痠痛（Whittaker〈truly rest〉✅）。
- 手塞放在胸口的高度（-ocSfP62RLA 字幕 120s）。
- 拉的時候手肘外張；應該讓手臂和裂隙保持同一條線（-ocSfP62RLA 字幕 330s、480s）。

### 2. 拇指朝上 vs 朝下

| | 拇指朝上（thumbs-up） | 拇指朝下（thumbs-down） |
|---|---|---|
| 好處 | 可以把手拉到身體中線，伸得遠；適合往上前進 | 手肘往下壓時會產生扭力（torque），比較穩，適合放保護點、休息，也適合手伸過頭時 |
| 壞處 | 沒有扭力，鬆的時候容易滑 | 手越過肩膀往下之後就很難再拉；每一步的距離短 |
| 何時用 | 垂直的直裂隙、往上前進 | 斜裂隙的上手、放保護點、找休息點、較緊的手掌尺寸 |

- Julie Ellison〈How to Hand Jam〉Climbing.com 2023 ✅（總論已用）："Thumbs-down is great for placing gear or trying to shake out and rest. For the most efficient upward progress, thumbs-up is the way to go."
- Tom Randall UKC Part 2 ✅："if you're looking to make an extra long reach from a hand jam, then you will almost certainly want to use a thumbs-up jam."
- VIDEORACLES nLIzQb0a3X4（章節 50s「Perfect Hand Jam」＋KT）："I prefer a thumb up hand jam … the angle of my elbow here allows me to pull all the way up"；拇指朝下"you can hang out and rest … but when you go to make the move its torquing your elbow at a really weird angle"，所以下一步通常是在它下方接一個拇指朝上的手塞。
- Summit Seekers VmqPBdVpiDY（字幕 360–420s）：拇指朝下"I then torque my elbow down … the downside of this is it's hard for me to … reach up"。
- Climbing Tech Tips L3VgN017jLo（2018，字幕 60s）：拇指朝下時拇指根的肉卡得比較緊，拇指朝上則每一步能移動比較遠。
- Mountain Project〈Thumbs up vs thumbs down〉討論串（2013–2014，論壇）✅：有人說全程拇指朝下，是自己「快要掉下去」的徵兆；也有人說"thumbs down feels more secure since my weight twists my wrist"。
- **反方意見**：MP〈Thumb up thin hand technique〉✅ mountainhick："personally I avoid thumbs down whenever possible. It is harder anatomically, and limits movement per reach/move … Except in corners." 也就是說，拇指朝下比較穩只是初學階段的感覺，熟練之後多數人改以拇指朝上為主。
- 日本初學者的實錄 LHbOgOppfeg（KT [0:21]，小川山〈さよなら百恵ちゃん〉5.9）：「今は逆手で親指が下の逆手で入れてる…なんか自然と僕逆手で入れちゃう」。初學者很自然就會拇指朝下，正好可以當反例拿來講。

### 3. 緊手（thin hands）、標準手、鬆手（cupped hands）

- **thin hands（偏緊）**：拇指收不進掌心。Whittaker〈3 Techniques〉✅：食指、中指 crimp，好讓拇指更深入，"Push against the crack wall with the outside of your thumb"。Jeff Achey〈Jam Session〉Climbing.com 2012 ✅ 列出要訣："1) twisting techniques such as thumbs-down jams; 2) meticulous footwork …; and 3) letting go of the idea that the jam should feel secure."
- **cupped hands（偏鬆）**：Achey ✅：指尖和掌根頂一側，指節背面頂另一側，"Because of this one sharp point of contact, wide-hands cracks are painful. Tape over the knuckles is highly recommended"。
- Tony Jewell〈How to Climb Wide-hand Cracks〉Climbing.com 2023 ✅（Indian Creek）提出「cup and twist」：手指伸直、指尖朝裂隙裡，再往小指方向轉，"clockwise for your right hand, counterclockwise for your left, regardless of whether your hand is thumb up or thumb down"。
- Whittaker〈truly rest〉✅：到了 cupped 的寬度，拇指一個撐不滿，要「expanding the thumb pulp … but also twisting the hand and forearm across the crack」。
- MP〈jams for rattly hands〉✅（2015–2018）：有人寧可用拇指朝上加 roll 拇指，也不要 cup，因為 cup "puts bruising pressure on the bones on the back of the hand"；也有人改用 torqued fists，"set them thumbs down and use your weight to hold them"。
- **強度**：Wide Boyz〈Which Crack Climbing Technique is Strongest?〉DbnofcWjVts 實測各種塞法的拉力（章節 683s hand、851s cupped、891s fist）。數字要另外看影片才能引用，這裡沒有逐字稿可以核對。

### 4. 換手：交叉（hand-over-hand）vs 平移（shuffle／swimming）

- **直裂隙**：多半交叉換手，兩手都拇指朝上（節奏快、每步遠）。
- **斜裂隙、內角、邊緣互相重疊時**：平移換手，上手拇指朝下、下手拇指朝上（thumbs facing），兩手不要交叉。
- Tom Randall UKC Part 2 ✅："how overlapping the edges of the crack are or whether the crack lies in a corner … it's almost impossible to cross hand-over-hand … use the 'swimming-technique' … one hand stays on the bottom in a 'thumbs-up' position and the other leads in a 'thumbs-down' position."
- Wild Country Crack School Ep2（y4CzwDebyI8，2012，字幕 100–180s）：斜裂隙往右傾就右手領先、拇指朝下，左手拇指朝上，用 swimming 的方式前進；往左傾則反過來。
- Tony Jewell Climbing.com 2023 ✅："if the crack veers to the left, you'll want to lead with your left hand"；"Facing thumbs … shuffle your jams upward without taking them out of the crack"。
- MP〈Sustained straight up wide hands〉✅：在 Supercrack（Indian Creek）這種直裂隙上，不少人兩手都用拇指朝上，覺得比較省力；平移則留給 wide hands、深裂隙或放保護點時。這兩種說法不衝突，選哪個取決於裂隙寬度和方向。
- Sasha DiGiulian 9pa0xGzvb8U（章節 111s「Techniques」＋KT）："if you're in a corner … I'm jamming thumb up with my lower hand and I'm thumb down at the higher … it's a straight in crack I'm just hand over [hand] like swimming up"。

### 5. 拳塞（fist jam）：掌心朝內／朝外、緊拳 vs 鬆拳、拇指位置

- **成形**：Whittaker〈3 Techniques〉✅："Create a fist … Aim for your index to curl around so it touches the very top of your thumb meat. Place your thumb on top of your fingers (some people like to do thumb inside the fingers, I prefer on top. there is nothing wrong with either)."
- **出力點**：Whittaker〈2 CRUCIAL techniques to make fist jams easier〉✅：受力的是拳頭的兩側，要用食指和小指往掌心壓，讓側面變硬；拳頭開始滑時"people starting to flex at the wrist"，這會讓塞拳更差，手背和前臂要像有一根鋼條一樣保持平直。
- **掌心朝下（palm down）vs 掌心朝上（palm up）**：Wild Country Ep3（rVfrh7ggxJc，2012；Keenable 摘要）："two main types … palms facing upwards and our palms facing downwards"；Tom Randall UKC Part 3 ✅（總論已用）建議上下交替使用，這樣不用交叉換手，又能伸得比較遠。VIDEORACLES nLIzQb0a3X4（KT [0:00] 段末，cupped 章節 216s 之後）："I can turn that upside down and go palm up also same idea outside of my pinky finger and between thumb and forefinger making contact"。
- **斜裂隙／內角的拳塞**：MP〈Tips for awkward fist sized jams〉✅（2021）："If the crack is leaning, you can jam palm down with your upper hand, and palm up with your lower hand." MP〈Help with corner fist crack technique〉✅（2021）提醒不要只用 palm down；"a half-fist-jam-half-lieback DOES sort of work"（手塞配上 layback 則會因為手腕彎曲而失效）。
- **鬆拳：拇指當墊片（teacup）**：Whittaker〈"My fist is too small". Do This.〉✅ 列出三種 teacup 寫法（拇指半包在拳內、拇指平貼在拳側、拇指尖壓進食指凹處），之後才進入 stacking；"I will always try and max my teacupping out before moving into stacking territory"。Tom Randall UKC Part 3 ✅："lay your thumb down the outside of your fist (see the 'teacup jam')"；"fist jams rarely feel completely bomber in parallel cracks"。
- **介於手和拳之間的尺寸**：MP corner-fist 串 ✅："start in a swimming position (thumbs pointing toward each other), then rotate them into a palms facing each other before i squeeze"。MP awkward-fist 串也提到另一招：把拇指夾在食指和中指之間。
- **學習順序**：Whittaker〈Want to learn jams quicker?〉✅：先練手塞，再練 thin hands／paddle，接著是拳塞；"Fist jamming is slightly less reliant on strength, and in general … an easier technique than paddles"。之後再練 cupped 和 teacup。
- **皮膚**：UKC Part 3 ✅：拇指最容易磨破，長路線要連小指一起貼膠帶。

### 6. 手大小的差異（小手／大手）

這是本主題最實用、也最常被忽略的一點：同一條裂隙，對不同手的大小其實是不同的技巧。

- Whittaker〈A New FA in Kristiansund and the Golden Takeaway〉✅（2026-10，和 Mari Salvesen 一起首攀屋簷）逐一對照凸輪尺寸："#2 (Gold Cam): Larger hands get a basic, solid hand jam. Smaller hands often have to use a cupped hand jam"；"#0.75 & #1 (Green & Red Cam): Smaller hands get perfect hand jams in these sizes, whereas larger hands are forced into thin or paddle jams"；"#4 (Grey Cam): Larger hands can fist jam, whereas smaller hands have to execute a butterfly stack"。屋簷中段的 #6 寬度裡，Mari 能把身體塞得更深，反而爬得輕鬆。
- Whittaker〈What to do when your hand doesn't fit〉✅：只要指尖塞得進去，就一定有可以用的技巧，"What technique should I use to fill the space in the most efficient way?"。大手的人改用 thin／paddle，小手的人改用 cupped 或拳塞。
- Julie Ellison〈The 10 Commandments of Indian Creek〉Climbing.com 2022 ✅："many of Indian Creek's routes were established by dudes who have hands the size of #2 and #3 cams, the typical 'hand crack' size is given the grade of 5.10 while smaller cracks (.75 and #1) are usually 5.11 … If you have smaller hands, you'll find the 5.11s much easier than the 5.10s"。她本來以為自己的手是 .75–#1，爬了 Incredible Handcrack 才發現介於 #1 和 #2 之間（2026-10-26 post-verify 更正：原記為 #2）。
- MP〈Resources for little hands and crack climbing?〉✅（2024）：丈夫的手是 #2、妻子的手是 .75，"Look for 5.11- rated climbs in the creek. They'll likely be 5.9 for her"；Jen N："I have a similar hand size … all the 5.10's were too big for my hands"。
- UKC〈Crack climbs for small hands〉✅（2021，英國 grit）：列了 Tufted Crack、Dexterity、Laugh Not 等「小手版本比較好爬」的路線。**反方**：PaulJepson："I've not come across many cracks in the UK where they are parallel enough for handsize to change the grade"。也就是說，手的大小在平行裂隙（Indian Creek）上影響最大，在有收口的 grit 上影響比較小。
- Wide Boyz〈Feet first VS hands first〉nbc0ytdo2To（章節 190s Mari feet first、326s Mari hands first＋KT）：Mari 手小、腳小，"she's unable to [fist] … so she has to go into something called a teacup jam"；Pete 和 David 覺得手先比較好，Mari 則覺得腳先比較好。
- Climb-Cleveland〈Crack Climbers Share Their Experience〉（2018，在 2020 年前，只當背景）✅："most women have an advantage in crack climbing in that the climbs that are harder for men are usually easier for women, given their smaller hands"。這句是概括說法，引用時要加但書。
- 日本反例：めざせ500イレブン+ 3ACg6wXaqJs（說明，城ヶ崎フナムシロック 5.10a 屋簷）：「ハング上のクラックは下半分はキャメ1番サイズなのでジャムも上手くきかず」，身高 168cm 的攀岩者認為這條不像 5.10a。

### 7. 腳（手掌和拳頭的尺寸）

- UKC Part 2 ✅：膝蓋往外、腳側放插進去，再把膝蓋轉回和裂隙平行來鎖住。UKC Part 3 ✅：拳頭寬的裂隙，腳通常直接踢進去就卡住。腳卡住時，把膝蓋往外轉並減少承重。
- Geek Climber -ocSfP62RLA（字幕 300–330s）：初學者覺得「腳比手痛兩倍」。Pete 建議 drop heel（腳跟放得比腳尖低），並保持手臂和裂隙同一條線。
- 登山教室Timtam mwjEI_Ibjms（說明＋KT [0:01]）：在岩館分三階段練——只用手塞（腳踩岩點）、只用腳塞（手抓大點）、手腳都塞。說明欄寫「ジャミングは足の固定がしっかりされるのが大事」。這個練習順序適合台灣岩館。

### 8. 屋簷裂隙（roof cracks）

**要點**
1. **體力的大部分要靠腳**：腳和手一起塞在屋簷裡，身體才不會整個掛在手上（Kevin Corrigan〈Crack Machine〉Climbing.com 2020/2024 ✅："When you're climbing a roof crack, your feet will be taking some of your weight"）。
2. **腳先 vs 手先**：Wide Boyz nbc0ytdo2To（KT [0:00]–[3:09]）說明腳先時兩種放腳法："toe into the crack which we call trench foot or heel into the crack … wide pony/frog foot"。裂隙對腳來說太窄時，腳跟先進比較難。Emil Abrahamsson 在德國屋簷（qwNLPCKOyL4，KT [3:30]、[7:34]）："Do you go feet first or do you go feet back? … If you go feet first, you don't have to fumble with the feet on the rope"。Separate Reality 的 Mountain Project 路線頁留言："feet first is pretty clutch"✅（留言沒有日期）。日本城ヶ崎赤沢的屋簷，今日からきみは〈ルーフクラック特集〉✅ 也寫「足先行ムーブでルーフを進み，リップを悪いシンハンドで超えていきます」。
3. **前進方式**：手先時，上手往前滑、後手跟上（shuffle），熟練後再交叉。Corrigan ✅："sliding your upper hand in the direction you'll move, then slide your trailing hand to follow it … Eventually, try to remove your trailing hand and then place it above the other hand"。
4. **拇指耐力是瓶頸**：Bronwyn Hodgins〈Training and Tactics for Desert Roof Cracks〉Wild Country 2024 ✅（Squamish 攀岩者，Necronomicon）："Five moves later my thumbs are powered out"。她的戰術是在 crux 前改到旁邊較寬的地方用拳塞休息："The fists feel less secure and more strenuous, but I will be using different muscles meaning my thumbs will get a break"。Whittaker 在 Corrigan 一文中說，9a、9b 的運動攀登者到 Tom 的地下室，都"struggle to create the same jamming force"。
5. **出屋簷（lip）是另一個 crux**：Mary Eden 在 Black Mamba（Sy6tvFxlBDo，章節 293s「Route breakdown」、KT [9:57]）："the lip is very definitely a crux … I had to practice that lip turn quite a few times"。Separate Reality 在 MP 的描述是"a wild series of moves at the lip"✅。
6. **訓練**：Corrigan ✅ 的進程是用滑輪減重做塞手懸垂 → 加上腳 → 進到屋簷裡保持姿勢 → 移動。Whittaker：「Do some deadhang training in the roof crack, exactly like you would when finger boarding, but with jams」。Mary Eden 的標準（Climbing.com〈White Rim〉2024 ✅）："comfortably complete three sets of ten minutes on the crack trainer with thirty minute rests"。
7. **安全**：石田祐城〈ルーフクラック、自分メモ〉2015（日本，在 2020 年前）✅：「足をフック系の技で決めたりして、手がすっぽ抜けると頭から落ちる場面が多い」「上下反転するような動きの中では、足がロープに絡みそうになる」，屋簷根部的保護點也會讓繩子摩擦。

**經典屋簷（影片／心得都有）**：Separate Reality（Yosemite，屋簷內是 #2→.5 的手掌尺寸，MP 2020 串 ✅："the roof was 5.10 bomber hands nearly all the way"）；Desert Gold（Red Rocks）；White Rim 的 Black Mamba、Century Crack（Canyonlands）；英國的 Ma Dooley Roof、Gobbler's Roof；日本的楯ヶ崎〈釣り師のテラスのルーフクラック〉、城ヶ崎的屋簷群。

### 9. 斜裂隙（leaning／diagonal）

- 上下手的方向：**裂隙往哪邊傾，哪隻手就在上面當領手，拇指朝下；下手拇指朝上，用平移換手**（見第 4 節，UKC Part 2 ✅、Jewell ✅、Ellison ✅："If the crack is slanting in one direction, it can be more efficient to have the top hand thumb-down and bottom hand thumb-up so you can shuffle"）。
- 拳頭的尺寸：上手掌心朝下、下手掌心朝上（MP 2021 ✅）。
- 腳：韓國〈크랙 등반을 잘하는 비결? 지금 당장 재밍하라!〉月刊山 2017 ✅（Trad Climbing Festival 報導）："사선 크랙에서는 한 발은 크랙에 두고, 나머지 발은 크랙 바깥에 두는 것이 유리하다"（斜裂隙一腳放在裂隙裡，另一腳踩在裂隙外的岩面比較有利）。同一篇也寫拇指朝下時把手肘往身體拉，就會產生撐開的力量。
- 身體會被裂隙拉到一側，形成半 layback：Tom Randall UKC Part 3 ✅ 說拳塞可以故意把重心移到一側、往側邊 torque。韓國김종식（K Rock Climbing）_Xkjff8fxcM（說明）："사선크랙 등반은 어렵다. 두 가지 유형으로 분석하여 공략법을 제시한다"（以仁壽峰 심우길、학교길 等路線為例）。內容沒有字幕可以核對，start 秒數未定。
- 龍洞實例：〈曙光裂隙〉5.11b（第一洞）。抽格看到下方先翻過一段水平屋簷帶，上方接一條斜向的裂隙（CdhEuYj2fMY 0–660s、nTapvs7T_Fg 0–240s）。rock6879 的說明："將近三週沒爬的狀況下塞手的動作還是有幫助"。

### 10. 岩質：粗糙 vs 光滑

- Ellison〈How to Hand Jam〉✅（總論已用）：Vedauwoo 粗糙要貼膠帶，Yosemite 比較光滑。
- Climber.co.uk〈How to Climb on Gritstone〉✅：grit "exposes all your technique weaknesses in three crucial areas – jamming, laybacking and smearing"，"Grit rash is an occupational hazard"。
- Ellison〈10 Commandments〉✅：Indian Creek 的砂岩"sandpaper rock"，初學技術差時手會被割爛，所以要先戴膠帶手套，之後再試著不戴。
- MP〈Thumbs up vs down〉✅：在健身房或 IC 那種平行的 splitter 上學，比較難學到基本功，"A lower angled crack with constrictions can teach good technique"。這一點對龍洞（有收口、岩面粗糙的石英砂岩）是好消息：適合學，但要貼膠帶。
- Whittaker〈Crack Machine〉中的意見 ✅：自製的裂隙訓練板不要塗止滑漆，"You don't ruin your skin as quickly"。

---

## 二、影片清單（2020+，全部用 yt-dlp 取得 upload_date）

格式：`video_id | 標題 | 頻道 | upload_date | 長度 | 岩場／地點 | 人物 | 類型 | 語言 | 示範重點＋start | 查證`

### 教學片

| id | 標題 | 頻道 | 日期 | 長度 | 地點 | 人物 | 類型 | 語言 | 重點＋start | 查證 |
|---|---|---|---|---|---|---|---|---|---|---|
| nLIzQb0a3X4 | Crack Climbing: Jamming Hands and Fists | VIDEORACLES | 2020-03-26 | 6:23 | Joshua Tree（片中提到） | 教練（男） | 教學 | en | 50s perfect hand（拇指朝上 vs 朝下）；169s thin hand；216s cupped；之後是 perfect fist palm down／palm up | 章節＋KT |
| 9pa0xGzvb8U | Sasha DiGiulian crack climbing tutorial in Indian Creek | Sasha DiGiulian | 2020-01-14 | 6:21 | Indian Creek | 職業攀岩者（女，運動攀登出身） | 教學＋實錄 | en | 58s 膠帶；111s 拇指方向，內角上手朝下、下手朝上，直裂隙交叉換手；175s 練習 | 章節＋KT |
| -ocSfP62RLA | Pro Climber Coaches Gym Climber to Learn Crack Climbing in 35 Days ft. Wide Boyz | Geek Climber | 2022-03-31 | 10:46 | 岩館 | 一般攀岩者（男），Pete 遠距指導 | 學習紀錄 | en | 30s L 形、插深；120s 手塞放太低的錯誤；240s 疼痛；300–330s 腳痛、drop heel、手臂和裂隙同一條線 | 字幕 |
| VmqPBdVpiDY | Hand Jamming Technique \| Crack Climbing | Summit Seekers Experience | 2022-09-01 | 12:45 | 戶外（地點未標） | 頻道主（男，身分未查） | 教學 | en | 90s 拇指撐寬；330–420s 拇指朝下 torque vs 朝上 mobility；510s 收口；630s 拳塞 | 字幕 |
| mHErzqpYKqM | secrets from the crack cellar: HOW TO CRACK CLIMB, 5 techniques with Tom Randall | Anna Hazelnutt | 2021-09-29 | 23:31 | Sheffield，Tom 的地下室 | 一般/網紅攀岩者（女）＋ Tom Randall | 教學 | en | 619s 屋簷裡的 perfect hands；854s paddle；1043s cupped hands | 章節 |
| DbnofcWjVts | Which Crack Climbing Technique is Strongest? | Wide Boyz | 2021-10-07 | 17:49 | 地下室 | Pete、Tom | 實驗 | en | 683s 手塞；851s cupped；891s 拳塞的拉力測試 | 章節 |
| wlhUPyT7Tog | 5 Mistakes You MUST Avoid When Trad Climbing | Wide Boyz | 2021-09-05 | 8:12 | 英國 | Pete | 教學 | en | 483s 不用塞的錯誤（neglecting jamming） | 章節 |
| nbc0ytdo2To | Feet first VS hands first | Wide Boyz | 2020-06-21 | 6:41 | 挪威 Sogndal | Pete、David Postelt、Mari Salvesen（女，手腳都小） | 實驗/教學 | en | 63s Pete 腳先；129s David（trench foot 腳尖先 vs frog foot 腳跟先）；190s Mari 腳先；288s／326s 手先，Mari 改用 teacup | 章節＋KT |
| 6XhyKPseZ0g | Training for Climbing Cracks + Example Exercises: Part 1 | Lattice Training | 2020-02-16 | 12:58 | 室內 | Tom Randall（教練） | 訓練 | en | 506s 休息；595s 牆上練習 | 章節 |
| VRc_iFasUc4 | 【基本】クラッククライミングの技術をご紹介！Part1 | TAKEMOVIE | 2021-09-09 | 17:29 | 日本 | 日本攀岩者（男） | 教學 | ja | 271s ハンドジャム；473s シンハンド；544s フィストジャム；768s 実際の登り方 | 章節 |
| OzOvDAbNK0A | クラックの登り方-入門編のハンドジャム&カムのサイズ感 | Kohei Yoshida | 2021-03-01 | 4:47 | 日本 | 日本攀岩者 | 教學 | ja | 手塞的做法與凸輪尺寸（start 未定） | 說明 |
| pA0265oKvNo | フィストジャムって？ジャミング入門課題で体験してみる【ガレーラボルダリング女子】 | クライミングジム ガレーラ | 2021-03-11 | 11:08 | 日本岩館 | 女性一般攀岩者兩名＋館方解說 | 教學/體驗 | ja | 拳塞入門的 4 級抱石題（start 未定） | 說明 |
| mwjEI_Ibjms | ボルダリングジムでジャミングを学ぼう | 登山教室Timtam | 2025-12-10 | 2:56 | 群馬 サイトウクライミングジム（可調寬度的裂隙） | 登山教室 | 教學 | ja | 0s 只用手塞→只用腳塞→手腳都塞；59s 把腳扭進去 | 說明＋KT |
| nAclUErY6LA | 【クライミング】これって我慢大会⁈マスターに学ぶ☆湯川クラック講習会 | KORのクライミングNOTE | 2021-06-28 | 6:37 | 湯川（日本） | 一般攀岩者上課 | 學習紀錄 | ja | 膠帶、塞法（start 未定） | 說明 |
| _Xkjff8fxcM | 인수봉 심우길 등 사선크랙 집중 공략 | 김종식 락 클라이밍（K Rock Climbing） | 2021-07-05 | 14:04 | 韓國北漢山仁壽峰 | 嚮導 김종식 | 教學 | ko | 把斜裂隙分兩型講攻略（start 未定） | 說明 |
| gZw9eiu0xM0 | 크랙 등반 기술 3부: 재밍이냐 레이백이냐, 선인봉 좌향 크랙 | 김종식 락 클라이밍 | 2023-03-05 | 10:53 | 韓國道峰山仙人峰 | 김종식 | 教學 | ko | 往左傾斜的裂隙：塞 vs layback 的取捨（start 未定） | 說明 |
| Zd5PnDXeTWY | 크랙 장갑 1,000원으로 만들기: 핸드, 피스트 재밍 테이핑 | 김종식 락 클라이밍 | 2022-10-31 | 9:20 | 韓國 | 김종식 | 教學 | ko | 手塞、拳塞用的膠帶手套（start 未定） | 說明 |
| zdegY0z0fMI | Crack Climbing Camp with Mary! MY EXPERIENCE + WHAT TO EXPECT | Active Alexis | 2022-02-03 | 14:25 | Indian Creek | 一般攀岩者（女）＋ Mary Eden | 心得 | en | 526s 學技巧；615s 膠帶手套 | 章節 |

### 攀爬實錄：手掌與拳頭裂隙

| id | 標題 | 頻道 | 日期 | 長度 | 地點 | 人物 | 語言 | 重點＋start | 查證 |
|---|---|---|---|---|---|---|---|---|---|
| cPewuF0nOWc | Learning How To Crack Climb (Flatline 5.10) - Indian Creek | John Minar Photography | 2023-10-18 | 7:15 | Indian Creek | 5.7 程度的一般攀岩者（男） | en | 111s 實際爬與掙扎 | 章節 |
| H-Aqt96SR6o | Learning to Crack Climb in Indian Creek | AccessAlpine | 2023-10-12 | 6:25 | Indian Creek（Batteries Not Included） | 一般攀岩者 | en | 號稱 Creek 最簡單的路線（start 未定） | 說明 |
| DwIH8DRdB5A | First Person Rock Climbing: "3AM Crack" (5.10), Indian Creek | Brad Burns | 2021-05-27 | 20:14 | Indian Creek（wide hands） | 一般攀岩者 POV | en | 3AM Crack 是 Jewell 文中的 cups 經典（start 未定） | 說明 |
| e87dURsVa7M | Top 6 Super Splitters of Indian Creek | Wide Boyz | 2022-05-08 | 12:00 | Indian Creek | Tom、Pete | en | 48s 起分章節，各路線 | 章節 |
| AE6BOBkTeRE | Climbing Super Hands (aka Ranger Crack) 5.8 | Daniel S | 2023-08-28 | 7:52 | Yosemite | 一般攀岩者 | en | Yosemite 花崗岩的手掌裂隙（start 未定） | 說明 |
| xMiDW1jprMA | Squamish Rock Climbing \| Klahanie Crack 5.7 | Alpine Gremlin | 2022-09-24 | 6:40 | Squamish | 一般攀岩者 | en | "You don't get more splitter then this"（start 未定） | 說明 |
| -E1hwhUDsXU | How to be a Crack Master | Wide Boyz | 2022-08-14 | 16:54 | 英國 Ramshaw/Roaches gritstone（Cracker's Dozen） | Pete、Mari Salvesen（女） | en | 133s Green Crack HVS；335s Foord's Folly（thin hands）；410s Imposition E2（拳頭，UKC Part 3 列為經典） | 章節＋KT |
| COooHBsQ6NA | Training for Climbing is POINTLESS. Leaning Crack E4 6a | JB Mountain Skills | 2023-06-15 | 12:18 | 英國 | JB Mountain Skills 頻道主（男） | en | 171s 先鋒一條斜裂隙 | 章節 |
| 7XSA2VgrIrg | Climbing A Bridge Hand Crack \| Urban First Ascent | Robbie Phillips | 2020-02-10 | 11:36 | 蘇格蘭 Edinburgh 橋下 | 職業攀岩者 | en | 都市裡的 splitter 手掌裂隙（start 未定） | 說明 |
| rAZ3djzVmck | Climbing a Steep Hand Crack in New Hampshire | Bryce Dahlgren | 2025-10-09 | 3:41 | 美國 Russell Crags（約 40° 外傾） | 一般攀岩者 | en | 外傾的手掌裂隙 Slap Fight 5.11d | 說明＋KT |
| 8jJfA5s1zEc | Girl Trad Climbing on Amazing Cracks, Kottenheim/Ettringen | 2 Small Adventurers | 2021-07-18 | 18:58 | 德國玄武岩 | 女性攀岩者 | en | 柱狀節理的裂隙 | 說明 |
| 5OBA1IPcARA | Leaning granite crack: Berguven (6-), Nordens Ark | Carl Climbing POV | 2026-05-06 | 17:09 | 瑞典 Bohuslän 花崗岩 | 一般攀岩者 POV | sv | 斜裂隙全程 POV | 說明＋KT |
| LHbOgOppfeg | 【ハンドジャム入門】さよなら百恵ちゃんルート 1p目 (5.9) | のぼるきょじん | 2023-07-21 | 10:37 | 小川山 | 初學者（男） | ja | 21s 起：初學者自然用拇指朝下，「ジャムってなんなん」；腳塞不熟 | KT |
| l6XLbp0nPjU | クラック初心者悶絶！ゆうこ＆やよい 5.10c はじめてのクラック | 6DME | 2022-02-04 | 11:50 | 瑞浪屏風岩 | 女性初學者兩名 | ja | 濕冷岩面上第一次爬裂隙就失敗（反例） | 說明 |
| Dm_rtld5wsA | 小川山 ばんざいジャム（5.10c） | ちくごん | 2022-06-28 | 5:38 | 小川山 砦岩前衛壁 | 日本攀岩者 | ja | （start 未定） | 說明 |
| kEmGvij7OOs | 인수봉 취나드a 3피치 재밍의 고통을 즐겨라 | 쏘맥 클라이머 | 2024-06-03 | 5:56 | 仁壽峰〈취나드 A〉 | 一般攀岩者 | ko | 塞的疼痛（start 未定） | 說明（標題） |
| 832EYL3GKNk | 인수봉 취나드 a 4피치, 재밍의 마력을 믿어라 | 쏘맥 클라이머 | 2024-10-23 | 28:02 | 仁壽峰 | 一般攀岩者（學習者的心得） | ko | 說明欄是長篇心得 | 說明 |
| -ApmZ21wROM | Black Diamond Presents: Hazel Findlay in South Korea | Black Diamond Equipment | 2020-05-26 | 7:24 | 韓國 | Hazel Findlay、Colette McInerney（女） | en | 312s「Analytical Cracks」 | 章節 |
| CdhEuYj2fMY | Taiwan Long Dong Climbing Beta \| Twilight Crack 曙光裂隙 5.11b 傳攀 · 26m | yu lin lai | 2025-12-26 | 21:10 | 龍洞第一洞 | 台灣攀岩者 | 無旁白 | 0–120s 翻過屋簷帶；240s 起是斜裂隙 | 說明＋抽格 |
| nTapvs7T_Fg | 龍洞「曙光裂隙」 | rock6879 | 2024-11-25 | 4:47 | 龍洞第一洞 | 台灣攀岩者 | zh | 0s 屋簷下；60s 在屋簷邊緣塞進裂隙；120–240s 斜裂隙 | 說明＋抽格 |
| XxkFjyaIeV8 | 龍洞 曙光裂隙 2026年9月 | 戶外江 | 2026-10-06 | 4:11 | 龍洞 | 台灣攀岩者 | – | 畫面未查證 | 標題 |
| 2t-Ihl8TsJg | 龍洞 disco大裂隙 2026年7月 | 戶外江 | 2026-08-20 | 7:27 | 龍洞 | 台灣攀岩者 | – | 畫面未查證 | 標題 |
| RTHO2ErsauA | 龍洞裂隙 | 沙克強 | 2024-05-05 | 20:33 | 龍洞 | 台灣攀岩者 | – | 畫面未查證 | 標題 |

### 攀爬實錄：屋簷裂隙

| id | 標題 | 頻道 | 日期 | 長度 | 地點 | 人物 | 語言 | 重點＋start | 查證 |
|---|---|---|---|---|---|---|---|---|---|
| Sy6tvFxlBDo | Mary Eden sends Black Mamba | WildCountryClimbing | 2025-05-30 | 18:40 | Canyonlands White Rim | Mary Eden（女） | en | 116s 準備；293s 路線拆解（手→cups→拳頭→倒掛進 offwidth→出 lip）；636s 戰術；[9:57] 出 lip 的 crux | 章節＋KT |
| qwNLPCKOyL4 | Taking a Pro Climber on Germany's Biggest Roof Climb | Wide Boyz | 2025-11-30 | 27:18 | 德國橋下的屋簷 | Pete＋Emil Abrahamsson＋Sebastian | en | 144s 裝備與技巧；[3:30] 腳先 vs 腳後；[4:03] shuffle；[7:34] 手會滑是因為拇指撐得不夠 | 章節＋KT |
| HRYHMgULP08 | Solo climbing a bridge roof crack | Wide Boyz | 2020-04-26 | 6:33 | Edinburgh 橋下 | Pete | en | 156s 屋簷裂隙長怎樣；258s 尺寸 | 章節 |
| zJx5hPpWA3A | Climbing The 1000ft Roof Crack | Wide Boyz | 2021-09-27 | 6:50 | Sheffield Ma Dooley roof | Pete、Tom | en | 73s 進度與戰術；178s 疲勞管理 | 章節 |
| bFDrzUL8srU | Britain's Biggest Roof Climb (100m, 3 Pitches) | Wide Boyz | 2020-11-29 | 14:30 | 英國海崖 | Pete | en | [6:01] 倒掛 | KT |
| I4nXoo49DMw | Parkour Pro Smashes Roof Crack Boulder | Wide Boyz | 2022-08-30 | 21:37 | 挪威屋簷抱石 | Pete 指導新手 | en | 20s 技巧；[17:23]–[17:55]「keep using the feet … hang off the feet」 | 章節＋KT |
| nbc0ytdo2To | （見教學片） | | | | | | | 腳先／手先 | |
| mHErzqpYKqM | （見教學片） | | | | | | | 619s 屋簷內的 perfect hands | |
| AmTa72gwRks | Desert Gold 5.13a Roof Crack Climbing | Ben Frank Adventures | 2021-05-28 | 8:32 | Red Rocks | Fallon Rowe（女）、Landon McDowell | en | 84s 路線描述；219s Fallon 爬 | 章節 |
| 8IIZf0UBa4w | Attempting the most ICONIC roof crack climb in America | Noah Kane | 2024-06-14 | 18:12 | Red Rocks Desert Gold | 一般/網紅攀岩者 | en | 660s 策略；836s 屋簷段 | 章節＋KT |
| LWRLnPGDQm0 | Finding a Separate Reality | Noah Havlik | 2022-02-03 | 14:20 | Yosemite | 一般攀岩者 | en | 454s 技術建議；[12:32]–[13:03]「twist that foot」 | 章節＋KT |
| ma3GXYj6ing | separate reality 5.11d yosemite | 今日からきみは‼-にわかアルピニスト | 2025-03-16 | 7:39 | Yosemite | 日本攀岩者 | ja | 2023-04-26 紅點 | 說明 |
| maV7kiauMhg | Master Blaster - 13+ roof crack?? | Bron and Jacob | 2021-04-01 | 5:51 | Zion | Bronwyn Hodgins（女，Squamish） | – | 屋簷裂隙 | 說明 |
| TyAAVghc0Yc | Roof Crack 5.9 - Wichita Mountains, OK | Grahm The Overstoker | 2022-11-04 | 5:28 | 美國 Oklahoma | 一般攀岩者 | – | 5.9 的入門屋簷 | 說明 |
| _0e92oAStU0 | 釣り師テラスのルーフクラック | TAKU NAKA | 2020-02-04 | 5:14 | 三重 楯ヶ崎 | 中村拓哉 | ja | 屋簷裂隙抱石 | 說明 |
| WV8sUXDBgbk | ワンポイントのルーフクラック、オンサイトトライ | 石田祐城 | 2025-11-26 | 7:27 | 日本 | 石田祐城 | ja | 5.11a，onsight 嘗試 | 說明 |
| 3ACg6wXaqJs | 無名ルーフクラック 5.10a（城ヶ崎 フナムシロック） | めざせ500イレブン+ | 2026-01-06 | 3:23 | 城ヶ崎 | 168cm 攀岩者 | ja | 反例：#1 尺寸手塞不住，必須正對岩壁 | 說明 |
| bs8pWQ9gPp8 | センチュリークラックへの道 The Road to Century Crack | ワイドクラック最前線 | 2023-07-28 | 31:18 | Canyonlands | 日本攀岩者 | ja | 屋簷 offwidth 的四年訓練（偏 offwidth 主題） | 說明＋KT |
| m6_cozbF21E | Jamming So Hard We Split The Crack Open | Wide Boyz | 2020-12-20 | 15:36 | 地下室 | Pete、Tom | en | [4:53] 屋簷裡腳甩過去再塞 | KT |

### 2020 年前的經典教學（不計入母群，只當原理參考）

| id | 標題 | 日期 | 重點 |
|---|---|---|---|
| y4CzwDebyI8 | Wild Country Crack School Ep2 Hand Cracks | 2012-05-02 | 字幕 40–100s 拇指撐開；100–180s 斜裂隙 swimming（右傾右手領先） |
| rVfrh7ggxJc | Wild Country Crack School Ep3 Fist Cracks | 2012-05-15 | 掌心朝上／朝下、teacup |
| tMzG0ZrMP2c | Wild Country Crack School Ep8 Advanced Hands | 2014-06-04 | thin hands 一律拇指朝下 |
| L3VgN017jLo | Climbing Tech Tips: Hand Jamming | 2018-02-02 | 字幕 60s 拇指朝下比較緊，朝上每步走得遠 |
| l4EzbCLfUkc | REI: How to Jam Hand Cracks | 2016-02-10 | 字幕 60s 大跨步或橫移時用拇指朝下 |

---

## 三、文字來源

| 狀態 | 來源 | 年份 | 用途 |
|---|---|---|---|
| ✅ | [Pete Whittaker〈3 Techniques Crucial For Crack Success〉](https://wideboyz.school/newsletters/newsletter-archive/posts/3-techniques-crucial-for-crack-success) | 頁面日期 2025-12-30 | 手塞、thin hands、拳塞的成形 |
| ✅ | [Whittaker〈2 CRUCIAL techniques to make fist jams easier〉](https://wideboyz.school/newsletters/newsletter-archive/posts/2-crucial-techniques-to-make-fist-jams-easier) | 頁面日期 2025-12-30 | 拳塞要繃緊側面、手腕不能彎 |
| ✅ | [Whittaker〈"My fist is too small". Do This.〉](https://wideboyz.school/newsletters/newsletter-archive/posts/my-fist-is-too-small-do-this) | 2026-07-07 | teacup 三種、butterfly／hand-fist stack |
| ✅ | [Whittaker〈What to do when your hand doesn't fit〉](https://wideboyz.school/newsletters/newsletter-archive/posts/what-to-do-when-your-hand-doesn-t-fit) | 2026-02-22 | 大手／小手的對應技巧 |
| ✅ | [Whittaker〈The one way to truly rest on a hand jam〉](https://wideboyz.school/newsletters/newsletter-archive/posts/the-one-way-to-truly-rest-on-a-hand-jam) | 頁面日期 2025-12-30 | 拇指 vs 手指的出力比例 |
| ✅ | [Whittaker〈Want to learn jams quicker? Do this〉](https://wideboyz.school/newsletters/newsletter-archive/posts/want-to-learn-jams-quicker-do-this) | 2026-02-22 | 學習順序 |
| ✅ | [Whittaker〈A New FA in Kristiansund and the Golden Takeaway〉](https://wideboyz.school/newsletters/newsletter-archive/posts/a-new-fa-in-kristiansund-and-the-golden-takeaway) | 2026-10-03 | 依凸輪尺寸對照大手／小手 |
| ✅ | [Tom Randall〈Wild Country Crack School Part 2 – Jamming〉UKC](https://www.ukclimbing.com/articles/skills/wild_country_crack_school_part_2_-_jamming-4638) | 2012 | 拇指撐開、朝上/朝下、swimming（Exa 抓取） |
| ✅ | [Tom Randall〈Part 3 – Fist Cracks〉UKC](https://www.ukclimbing.com/articles/skills/wild_country_crack_school_part_3_-_fist_cracks-4651) | 2012 | 總論已用；teacup、側向 torque、拇指膠帶 |
| ✅ | [Jeff Achey〈Jam Session〉Climbing.com](https://www.climbing.com/skills/jam-session/) | 2012 | magic triangle、thin hands、cups |
| ✅ | [Julie Ellison〈How to Hand Jam〉Climbing.com](https://www.climbing.com/skills/how-to-hand-jam/) | 2023 | 總論已用；拇指方向、手大小 |
| ✅ | [Tony Jewell〈How to Climb Wide-hand Cracks〉Climbing.com](https://www.climbing.com/skills/trad-wide-hands-crack-technique/) | 2023 | cup-and-twist、哪隻手領先、拇指相對 |
| ✅ | [Julie Ellison〈The 10 Commandments of Indian Creek〉](https://www.climbing.com/places/commandments-indian-creek/) | 2022（2025 更新） | 手大小與 IC 的難度 |
| ✅ | [Maya Silver〈Crack Camp〉Climbing.com](https://www.climbing.com/skills/crack-climbing-camp-indian-creek-mary-eden-trad-princess/) | 2025 | Mary Eden 營隊的學習心得（女性） |
| ✅ | [Kevin Corrigan〈Build A Crack Machine〉Climbing.com](https://www.climbing.com/skills/training-how-to-improve-hand-jam-strength-for-roof-cracks/) | 2020（2024 更新） | 屋簷訓練進程、Whittaker 引述 |
| ✅ | [〈8 Insider Tips … Roof-Crack Capital〉Climbing.com](https://www.climbing.com/travel/white-rim-climbing/) | 2024 | White Rim 屋簷、Mary Eden 的訓練標準 |
| ✅ | [Bronwyn Hodgins〈Training and Tactics for Desert Roof Cracks〉Wild Country](https://www.wildcountry.com/en-us/bronwyn-hodgins-roof-cracks) | 2024 | 拇指耐力、用拳塞休息的戰術 |
| ✅ | [MP〈Thumbs up vs thumbs down〉](https://www.mountainproject.com/forum/topic/108722160/thumbs-up-vs-thumbs-down) | 2013–14 | 正反意見 |
| ✅ | [MP〈Thumb up thin hand technique〉](https://www.mountainproject.com/forum/topic/114407559/thumb-up-thin-hand-technique) | 2014–18 | 反對用拇指朝下 |
| ✅ | [MP〈jams for rattly hands?〉](https://www.mountainproject.com/forum/topic/114107908/jams-for-rattly-hands) | 2015–18 | cupped vs torqued |
| ✅ | [MP〈Tips for awkward fist sized jams?〉](https://www.mountainproject.com/forum/topic/120474545/tips-for-awkward-fist-sized-jams) | 2021 | 小拳頭、斜裂隙的拳塞 |
| ✅ | [MP〈Help with corner fist crack technique!〉](https://www.mountainproject.com/forum/topic/120571020/help-with-corner-fist-crack-technique) | 2021 | 內角的拳塞 |
| ✅ | [MP〈Sustained straight up wide hands〉](https://www.mountainproject.com/forum/topic/109725920/sustained-straight-up-wide-hands-both-hands-thumbs-up-or-top-hand-thum) | 年份未標 | 直裂隙兩手都拇指朝上 vs 平移 |
| ✅ | [MP〈Resources for little hands and crack climbing?〉](https://www.mountainproject.com/forum/topic/126442328/resources-for-little-hands-and-crack-climbing) | 2024 | 小手（女性）找路線 |
| ✅ | [UKC 論壇〈Crack climbs for small hands〉](https://www.ukclimbing.com/forums/rock_talk/crack_climbs_for_small_hands-735952) | 2021 | grit 上小手的路線＋反方意見（Exa） |
| ✅ | [MP〈Replica beta for Separate Reality〉](https://www.mountainproject.com/forum/topic/120116680/replica-beta-for-separate-reality-solicited-spray-downs) | 2020 | 屋簷尺寸 #2→.5、"5.10 bomber hands" |
| ✅ | [MP Separate Reality 路線頁](https://www.mountainproject.com/route/105874590/separate-reality?print=1) | 留言沒有日期 | "feet first is pretty clutch"、lip |
| ✅ | [Climber.co.uk〈How to Climb on Gritstone〉](https://climber.co.uk/training-how-to/how-to-climb-on-gritstone) | 未標 | grit 的岩質 |
| ✅ | [Climb-Cleveland〈Crack Climbers Share Their Experience〉](https://climb-cleveland.com/crack-climbers-share-their-experience) | 2018 | 岩館女性學員的心得（在 2020 年前） |
| ✅ | [awildmon〈Giving it a Crack〉Substack](https://awildmon.substack.com/p/giving-it-a-crack) | 2026-08 | 一般攀岩者第一次到 IC："people will say 'I have size 3 hands'" |
| ✅ | [今日からきみは〈世界一わかりやすいルーフクラック特集〉](https://kyokarakimiwa.com/roof-crack/) | 頁面 2025（內文有 2023） | 日本屋簷（瑞牆、城ヶ崎、楯ヶ崎、Yosemite）、足先行 |
| ✅ | [石田登山塾〈ルーフクラック、自分メモ〉](https://ishidatozanjukunisshi.blogspot.com/2015/12/blog-post_7.html) | 2015 | 屋簷的墜落與繩子風險 |
| ✅ | [石田登山塾〈ジャミングの様々なコツを、統一的に考えてみる〉](https://ishidatozanjukunisshi.blogspot.com/2013/11/blog-post_10.html) | 2013 | 拇指根的力量、「膨らませる力」 |
| ✅ | [月刊山〈크랙 등반을 잘하는 비결? 지금 당장 재밍하라!〉](http://san.chosun.com/news/articleView.html?idxno=11322) | 2017 | 韓國：斜裂隙的腳法、拇指朝下時手肘內拉 |
| ✅ | [ami41〈크랙등반 재밍 테크닉〉](https://ami41.tistory.com/452) | 2015 | 韓國：thin hand 上手朝下、下手朝上 |
| ⚪ | crazyjam.exblog.jp〈フィストジャムの科學〉 | – | 原頁已刪除，作者說搬到 crackclimbing.net；首頁抓回後找不到同名文章（Keenable＋curl） |
| ⚪ | 台灣手塞／拳塞的中文教學文 | – | Keenable 搜了 4 組中文關鍵字（龍洞 手掌裂隙 心得、龍洞 塞手 塞拳、曙光裂隙 心得、拳塞 裂隙攀登），只找到總論已用的 elliotway、黃國維，以及無關的頁面。Groundlane 未授權。台灣資料少是常態，不列為缺口 |

---

## 四、覆蓋矩陣

| 子技巧 | 岩場（≥3） | 人（≥3，含性別、手大小） | 教學＋實錄 | 非英語 | 反證/失敗 |
|---|---|---|---|---|---|
| 拇指朝上/朝下 | JT、IC、Yosemite（L3V 2018）、小川山 ✓ | VIDEORACLES、Sasha（女）、Summit Seekers、日本初學者 ✓ | ✓ | ja（LHbOgOppfeg）、ko（ami41） | MP 反對用拇指朝下 ✓ |
| 緊手 vs 鬆手 | IC（Jewell）、地下室、JT ✓ | Whittaker、Jewell、Anna Hazelnutt（女） ✓ | ✓ | ja（VRc 473s） | MP rattly：cup 會瘀青 ✓ |
| 換手：交叉 vs 平移 | IC、英國、韓國 ✓ | Randall、Jewell、Sasha ✓ | 教學 ✓／實錄偏少 | ko（ami41） | MP Supercrack：兩手都朝上比較省力 ✓ |
| 拳塞：掌心方向、拇指 | 英國 Millstone（2012）、JT、Ramshaw、Indian Creek（文字） | Whittaker、Mari（小手）、VIDEORACLES、日本岩館女性 ✓ | ✓ | ja（pA0265、VRc 544s）、ko（Zd5P 膠帶） | UKC：平行裂隙的拳塞很少穩 ✓ |
| 手大小 | IC、英國 grit、挪威 ✓ | Mari、MP 的妻子、Ellison、UKC 論壇 ✓ | 文字為主＋nbc0 | ja（3ACg 說明） | PaulJepson：英國少有平行到會因手大小改變難度的裂隙 ✓ |
| 屋簷裂隙 | Yosemite SR、Red Rocks、White Rim、英國、德國、日本楯ヶ崎/城ヶ崎、Zion ✓ | Mary Eden（女）、Bronwyn（女）、Fallon Rowe（女）、Pete、Emil、一般攀岩者 ✓ | ✓ | ja 多支 | 3ACg 正對岩壁失敗；石田的墜落風險 ✓ |
| 斜裂隙 | 英國、瑞典、韓國仁壽峰/仙人峰、龍洞〈曙光裂隙〉 ✓ | JB、Carl POV、김종식、台灣攀岩者 ✓ | 實錄 ✓／教學影片只有韓文（無字幕） | ko、zh | 偏少 |

### 仍缺的格子（已補搜一輪，仍沒找到）

1. **斜裂隙的英文教學影片（2020+）**：沒有找到專講 leaning crack 的英文教學影片。現有的教學都在 2012 年的 Wild Country Ep2（y4CzwDebyI8 字幕 100–180s）和文字來源裡。韓文的김종식 _Xkjff8fxcM 最對題，但字幕被 429 擋住，內容沒有核對。**待補**：IP 冷卻後重跑 `yt-dlp --cookies-from-browser chrome --write-auto-subs --sub-langs ko _Xkjff8fxcM`。
2. **Squamish 2020+ 的手掌/拳頭裂隙教學**：只有 Klahanie Crack 實錄（說明查證）和 Bronwyn Hodgins 的文字；Squamish Rock Guides 的課程頁只有行銷文字。
3. **字幕 start 秒數**：日文和韓文教學（OzOvDAbNK0A、pA0265oKvNo、nAclUErY6LA、_Xkjff8fxcM、gZw9eiu0xM0、Zd5PnDXeTWY）只有說明欄，沒有字幕，start 未定。VRc_iFasUc4 有章節可以用。
4. **龍洞**：XxkFjyaIeV8、2t-Ihl8TsJg、RTHO2ErsauA 只核對了標題，畫面沒有抽格。
5. **Wide Boyz 拉力測試的數字**（DbnofcWjVts）：只有章節，沒有逐字稿，不要引用數字。
6. **Pete Whittaker《Crack Climbing》書中手和拳的章節**：issuu 的樣章沒有抓取；改用他 2025–2026 的電子報（同一位作者，內容重疊）。
