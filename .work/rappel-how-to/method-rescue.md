# 垂降：救援用的三種「兩人一起下」— 研究紀錄

查於 2026-10-24。用途：〈垂降怎麼做〉只寫邊界＋連到〈自我救援入門〉（`2026-10-17-self-rescue-basics`），不教步驟。
字幕與 info.json 在 `.work/rappel-how-to/videos-rescue/`（`<id>.en.vtt`、`<id>.txt` 為每 ~15 秒一段的時間戳文字）。
工具：Groundlane 先前回 401，本輪直接用 Exa（`web_search_exa`/`web_fetch_exa`）與 curl；`toolDegradation`: groundlane→exa。

## 先講術語（寫文時最容易混）

| 名稱 | 誰在繩上、怎麼掛 | 誰控制速度 | 用途 |
|---|---|---|---|
| **Simul-rappel（同時垂降）** | 兩人各在穿過固定點的同一條繩的一端，各用自己的垂降器，互為配重 | 各自控制 | 為了快；專業來源一致說只限緊急 |
| **Counterbalance rappel（配重垂降，救援語境）** | 救援者在一端垂降，另一端是**傷者**（掛在繩上、無法動作），兩人隔固定點互為配重 | 只有救援者 | 救援：從確保站下到傷者處 |
| **Tandem / spider rappel（共用垂降器／蜘蛛垂降，德文 Rettungsspinne）** | 兩人用延伸扁帶同掛**一個**垂降器，雙股繩 | 只有救援者 | 救援：帶傷者一路下到地面 |
| **Counterbalance ascent / climbing（配重上升）** | 救援者往上（攀或上升繩），傷者在另一端被當配重往下 | 救援者 | 救援：攀者墜落在超過半繩處、要接近傷者 |

注意：Gripped、Outdoor Research（Dale Remsberg）、Short Guys Beta Works 都把 simul-rappel 叫成「counterbalance rappel」；Ryan Tilley（AMGA Rock/Alpine Guide）則明確區分 —— counterbalance rappel 是「one person is controlling the rappel but the other climber is on the other line … that's what we call a rescue technique」，tandem 是「two people sharing a device」（zRRnFfOUFKA @1006–1043s）。**文章中文用語建議：同時垂降＝simul-rappel；配重垂降＝救援用 counterbalance rappel；兩人共用垂降器＝tandem。** 中文寫作時要在第一次出現就講清楚，避免讀者以為「配重垂降」就是同時垂降。

---

## 1. Simul-rappel（同時垂降）

### 定義
- Gripped（2020-03-13）："Simul-rappelling is when two climbers counter-balance each other on a rope that is threaded through an anchor. It's an advanced skill and the margin for error is very small."
- Alpine Savvy（John Godino，首發 2019-01-02，後來更新過、已連到 2026 的 Kirkpatrick 文）："a technique in which two climbers rappel a single strand of the rope at the same time, counterweighting each other."
- AAC（2019-08-20，dateModified 2025-05-05）："the counterweight arrangement of simul-rappelling makes the climbers interdependent. If either climber loses control, makes a mistake in rigging, or if either side of the counterweighted rope is severed, both climbers suffer the consequences."

### 為什麼專業來源說避免
- **Gripped 2020-03-13**（https://gripped.com/profiles/simul-rappelling-is-dangerous-go-one-at-a-time/ ，副標 "The only reason you should need to do it is in the case of an emergency"）：
  - "It's dangerous and has been the reason many climbers have died while on rappel."
  - "Some climbers do it to save time, but there is so much risk associated with it that it's not worth the few seconds you'll save. … Don't be pressured into it if you're uncomfortable."
  - 失誤清單："One climber take their weight off the rope and the other climber drops unexpectedly onto a ledge or worse." / "If there are no backups and one climber lets go of the rope then both will fall to their death." / "Only having one rope through the belay device means less friction" / "Having two climbers arrive at an anchor at the same time is actually slower…"
  - "In the special circumstances that simul-rappels are preferred (rescues): Good communication … stopper knots … a 'hands-free' backup such as a friction hitch … link themselves with a tether"
  - 結尾："IFMGA guides Dale Remsberg and Olivia Race demonstrate the safest way to simul-rappel. It takes much more time and is more cumbersome than just going one at time."（嵌入影片經 HTML 確認＝`y_bHtt9iWPA`）
- **AAI 影片 ricHt4aPJVk（2022-10-28）**：AMGA "technical director has more or less said don't teach this"；"this concept of simul-rappelling is not being used by … professional guides"（@184–219s）。
- **Alpine Savvy** 轉引 IFMGA 嚮導 Rob Coppolillo（Climbing 雜誌，"For Safety's Sake, Don't Do This: Simul-Rappel"，付費牆，未直接讀到原文）四點：沒雙方 third hand 等於加倍災難機率；"If one climber unweights his rappel … the rope will slip at the anchor, effectively dropping the other climber"；新手單股反而更慢；同時到站反而慢。Godino 補：固定點負載加倍；用扁帶互連「does NOT mitigate the risk you might think」— 只在到站那一刻有用。Will Gadd："Very, very rarely is simul-rapping justified by expediency."
- **Andy Kirkpatrick, "Murder-Suicide – the Case Against Simul-rappelling"**（Substack，2026-05-30，https://andykirkpatrick.substack.com/p/murder-suicide-the-case-against-simul ）：立場極端（"When not to do it — Never."），引 Gobright 案；指出常見情境是「one person demonstrating an obviously dumb technique to someone who lacks either the experience or the confidence to say, 'No thanks.'」；單點/舊扁帶固定點上絕不。語氣粗口，引用只取事實段。
- **Climbing.com "How to Simul-Rappel"（Liz Drummond，2013-08-12）**：較早、訪 4 位 AMGA 嚮導，列正當用途（暴風雨撤退、尖塔兩側無固定點）與注意事項（體重差約 45 lb 以上要處理、"Stay less than 15 vertical feet apart"、不可只用扁帶當固定點）。2013 年的觀點比 2020 後寬鬆，**只當歷史對照，不當建議**。

### ANAC 事故（全部開過原文頁）
| 年份（事故／出版） | 地點 | 經過 | 原文重點句 | URL |
|---|---|---|---|---|
| 2016／2017 | Yosemite, Reed's Pinnacle | 兩人單繩距後同時垂降，一人 Grigri、一人 ATC，80 m 繩剛好到地；下方的 John 繩尾穿出 ATC，上方 David 墜約 70 ft 死亡，John 腿骨折 | "There were no knots or backup systems on the rope." / "Simul-rappelling is an advanced technique that is rarely required by the average climber. While simul-rappelling, both climber's lives are placed at risk by any mistakes." 編註：同年 Shawangunks 另一起同時垂降兩人重傷 | https://publications.americanalpineclub.org/articles/13201214364 |
| 2017／2018 | Washington, Goat Wall, *Sisyphus* | Shelby Withington（20）與夥伴為省時同時垂降；夥伴先到平台「let go of his strand」，繩尾沒結，繩穿出，Withington 墜約 300＋200 ft（ANAC 此頁未寫存活與否） | "Simul-rappelling has been the cause of several fatalities in recent years. Although it is theoretically faster … the extra care … erases much of that benefit. It is not a recommended technique." | https://publications.americanalpineclub.org/articles/13201214955 |
| 2019／2020 | México, El Potrero Chico, *El Sendero Luminoso* | Brad Gobright（31）與第一次搭檔的夥伴同時垂降，繩沒拉到中點、Gobright 那端卡在灌木中太短、無繩尾結；他那端穿出，兩人一起掉，夥伴落在平台存活，Gobright 死亡 | "In simul-rappelling, when one climber unweights the rope prematurely, the other will drop, and this was the case for Gobright's partner." / "If these two climbers had tied stopper knots, it's very unlikely this fatal accident would have occurred." | https://publications.americanalpineclub.org/articles/13201215647 |
| 2019／2020 | West Virginia, Seneca Rocks | 兩人（其一 13 歲）不知要兩條 70 m 繩，垂過中間站，改掛單一 bolt 再同時垂降；年長者失控垂出繩尾，13 歲者墜約 100 ft 重傷 | "Since they were simul-rappelling, his fall unweighted the counter-balance" / 閉合系統的方法："knots at the ends of the rope, friction hitch (third hand) backups, and a tether between the climbers" | https://publications.americanalpineclub.org/articles/13201215664 |
| 2021／2022 | Squamish, The Apron | 不是同時垂降，是**單繩配重垂降**（新手夥伴在另一端當固定點）：夥伴到樹站扣好後解了繩結，Dalpe 墜約 200 ft 生還 | "Counterweight systems—simul-rappelling, counter-ascending, or the descent method chosen by Dalpe in this incident—are for experts only. … The entire team needs to understand the necessity and process of maintaining a closed system until both parties are on the ground or securely anchored." | https://publications.americanalpineclub.org/articles/13201216294 |

補：ANAC 2018 資料表「Rappel Failure/Error」註腳把 simul-rappelling errors 併入同一類（已在 `sources-accidents.md` A5），沒有單獨統計。

### 影片（排序）
1. **`y_bHtt9iWPA` How to Set Up a Simul-Rappel｜Outdoor Research** — 上傳 2018-05-03，4:24。講者 Dale Remsberg、Olivia Race（Gripped 稱 IFMGA guides；說明欄："methods approved by the American Mountain Guides Association"）。品牌頻道（OR × AMGA 系列），無業配聲明。**早於 2024**：理由是它就是 Gripped 文章附的示範片（協會技術教學），且內容本身在示範「要做就得多麼麻煩」。最佳片段：
   - **@133s**："if Dale were to go off of the end of his rope … I don't have a counterbalance anymore and I will pull the entire system down with me and we'll both be gone"
   - @187s：Dale 站上平台卸重，Olivia 開始往下滑，被互連扁帶擋住："if I didn't have this tether and I stood up Olivia's just gonna go down I'm gonna get slammed into the rock"（@203s）
   - @58s：雙方 third hand、繩尾 barrel knot、互連扁帶三項。
2. **`ricHt4aPJVk` Simul-Rappel Technique｜American Alpine Institute** — 2022-10-28，4:08。AAI 是 AMGA 認證的嚮導公司；講者未在片中具名。說明欄只導向自家課程。**早於 2024**，但「為什麼別做」講得最直接：
   - **@38s**："in practice what we've seen is that this radically increases the hazard … when people employ this tactic they are primarily employing the tactic when they're trying to go fast"
   - @112s："one person gets to a ledge, clips into an anchor, unclips from the system … and the other person falls"
   - @184–237s：AMGA 技術主任不教、"just don't do it don't teach it"
3. 2024+ 備選：**`zRRnFfOUFKA` let's talk about simul-rappelling｜Ryan Tilley** — 2024-08-21，30:48。Ryan Tilley：AMGA Certified Rock Guide＋Alpine Guide、SPI，自述在拚 IFMGA（ryantilleymountainguide.com/about）。無業配（說明欄僅短文）。片長、偏聊天；最佳：@1006–1043s 三種技術的定義（見上）；@1194s 互連扁帶只在有 third hand 或 ABD 時才算閉合系統；@74–93s 朋友實測「saved zero」到「10 to 20 seconds per pitch」（非正式實驗，他自己說 "not exactly scientific"）。
   - 另：`kBfnRNKjVBQ`（Short Guys Beta Works，2025-02-03）算時間帳；Jason 為業餘家庭攀岩頻道、無認證（未查到），說明欄有聯盟連結，不優先。`L3bDfFs6fzo`（Brox_Rocks，2026-01-21）是 POV 紀錄、作者自承非嚮導，**不用**。

---

## 2. Tandem / spider rappel（兩人共用一個垂降器）

### 定義與何時用
- VDiff（英國攀岩教學站，無日期）："Tandem abseiling means two people descending with the same device. It is most useful when descending with an injured climber." 架法：主垂降者用肩長扁帶 girth hitch、自己掛 prusik；第二人用肩長扁帶對折，兩人錯開；"Both climbers are attached with separate screwgates to the belay device. The two carabiners add extra friction"；"Be careful not to descend past your next abseil station – prusiking back up with an extra person hanging from your harness may be impossible." https://www.vdiffclimbing.com/tandem-abseiling/
- VDiff 自救總論："if you can't solve your problem by escaping the belay and setting up a tandem abseil for you and the injured climber, it is unlikely that you'll be able to effect a safe rescue." https://www.vdiffclimbing.com/self-rescue/
- Climbing.com "The Buddy Rappel: Rap Safely With an Injured Partner"（Alexa Flower，2023-05-25）：一條雙倍長扁帶給兩人延伸，傷者那段較短讓救援者在下方；救援者 third hand 必掛；"don't accidentally rappel past your next station: You cannot ascend the line with two people."；傷者無意識時「don't use a personal tether for him」，改用 cordelette＋Munter-mule-overhand 讓每站可放鬆轉移重量；評估先行："Make the safest decision in the moment, which may be to call for help and wait." https://www.climbing.com/skills/rappel-with-injured-partner/
- Climbing.com Jediah Porter（2015-08-27）："The only special skill necessary is tandem rappelling" — 前提是傷者「conscious and cooperative」；頭頸背傷 "call for a professional rescue immediately"。https://www.climbing.com/skills/learn-this-leader-fall-self-rescue/
- **bergundsteigen（Martin Schmidt，staatlich geprüfter Berg- und Skiführer、VDBS 與 DAV 教學團，2025-05-07）**「Bergführerserie: behelfsmäßige Kameradenrettung bei Nachsteigersturz im Quergang」— 德語圈標準作法「1-Personen-Rettungsmethode」＋**Rettungsspinne（救援蜘蛛）**：
  - Abb.13 圖說："120er-Schlinge halbieren, dann 10 cm neben der Mitte (70 cm/50 cm) mit Mastwurf in einem Verschlusskarabiner fixieren. Kurzes Ende für die VP, längeres Ende für die RP. … Am zentralen Karabiner nahe der Mitte wird das Abseilgerät befestigt."（120 cm 扁帶、短端給傷者、長端給救援者、中間掛垂降器）
  - "Die RP nimmt dazu die VP auf den Rücken und seilt mit dieser ab … Eine Selbstsicherung mittels Kurzprusik oder eine sonstige Totmannsicherung ist für die RP verpflichtend. Je steiler die Abseillänge desto besser funktioniert die Technik." / 平緩地形 "Im flachen Gelände hilft nur rohe Kraft."
  - 訓練警語："Bei einigen dieser Techniken geht man erhöhte Risiken ein … Zum Training empfehlen wir, die Techniken erst einmal in Bodennähe und an soliden Fixpunkten (Bohrhaken) intensiv zu üben."
  - https://www.bergundsteigen.com/artikel/bergfuehrerserie-behelfsmaessige-kameradenrettung/ ；續篇（先鋒墜落、Einfach/Doppelseil，2026-05-22）https://www.bergundsteigen.com/artikel/bergfuehrerserie-kameradenrettung-vorsteigersturz/
- bergpunkt（瑞士，App leaflet）："Ein Verletzter kann mit einem Seilstück oder einer Bandschlinge in richtiger Länge parallel zum Retter in dessen Abseilgerät gehängt werden. Er wird zusätzlich am Rücken des Retters fixiert."
- **Petzl**（工作/救援領域，不是攀岩自救頁）：
  - "Accompanied descent rescue with the RIG and I'D descenders"：「This rescue situation is an exceptional case, where the use of single-person equipment for belaying or backing up more than one person is necessary due to the urgency of the situation. … The rescuer transfers the victim's weight to the rescuer's descender, then controls the tandem descent. The worker must be trained and practiced in this type of rescue.」＋通用警語「Mastering these techniques requires specific training. Work with a professional…」https://www.petzl.com/INT/en/Professional/Accompanied-descent-rescue-with-the-RIG-and-I-D-descenders?ActivityName=On-site-rescue （Exa 讀到；curl 對 US/GB 鏡像 404）
  - ASAP 版（德文 Sport 路徑）：兩人共用時器材負載接近極限、只有 ASAP'SORBER AXESS 可用於兩人。
  - **Petzl 攀岩多繩距 Rescue 技術頁清單（https://www.petzl.com/int/en/sport/tech-tips/multi-pitch-climbing/rescue）沒有 tandem/配重垂降條目**，只有上升繩、拖拉。所以「Petzl 攀岩 tech tip 教 tandem」不能寫。

### 影片（排序）
1. **`oUIGGHazDFM` Transition To Tandem Rappel｜Eddie Schoen – IFMGA Mountain Guide** — 2025-10-13，5:05。Eddie Schoen：IFMGA（2021 年第 166 位美國人取得）、AMGA Rock/Ski/Alpine Guide、AMGA 董事會 Treasurer（rebelalpine.com/about；amga.com/about/board）。頻道小（67 訂閱），無業配。情境就是「夥伴昏迷、掛在中間站的 Munter-mule-overhand 上」：
   - **@1s**："maybe we just came down from a counterbalance rappel … they are knocked out incapacitated. They cannot help with this transition. So they are attached to the anchor … with a munter mule overhand"
   - @61–101s：雙倍長扁帶 girth hitch、垂降器掛中段，偏移決定傷者在上或下
   - @216–275s：解 Munter-mule 把傷者重量慢慢放到 tandem 系統（"hold your hand over that to prevent a sudden pop"）
2. **`YaLEx9rX5tk` How and Why Climbers Use Tandem Rappels｜Short Guys Beta Works** — 2025-07-21，4:57。講者 Jason；**未查到嚮導認證**（業餘家庭頻道）；說明欄聲明可能含聯盟連結。用處：解釋為何 tandem 不當日常方法：
   - **@54s** 架法（延伸、third hand 加一圈、兩點 basket hitch）
   - @143s 優點：一人卸重不會讓另一人掉
   - @177–251s 缺點："It's complicated to get four legs all working at the same rate"；同一顆落石／斷繩會同時打到兩人
   - 開場說明欄："In some circumstances, particularly in rescues, tandem rappels are used … too many safety and efficiency downsides for it to be a standard rappelling technique outside of emergency situations."
   - 備選（早於 2024）：`Z9lAgr_dKak` VDiff 2023-05-15；`5F2wdW9btYY` Summit Seekers 2022-05-16（未讀字幕）。

---

## 3. Counterbalance rappel / counterbalance ascent（配重垂降／配重上升）

### 定義與何時用
- **AMGA 考試流程**（Rob Coppolillo，Elevation Outdoors，2012-07-17）：嚮導考 Rock 的救援演練，先 escape the belay 到 "baseline"（傷者重量在繩上、以 Munter-mule-overhand 可釋放），之後 "the guide cleans up the top anchor and counterbalance-rappels to the victim. The duo then descends to another anchor … This fact necessitates a releasable anchoring technique for the next rappel"；考規："one must not allow three meters of slack … nor can the injured/incapacitated climber be held by a single friction hitch." https://www.elevationoutdoors.com/blogs/master-of-none/amga-self-rescue/
- **The Mountaineers（Kitsap 分會中級課 Climbing Self Rescue-1 notes，無日期）**：先講心態 "Recognize that a two-person rescue is difficult enough that you will use sufficient planning and judgment so you don't get in a situation to need to do it."；完整順序：tie off → 摩擦結＋可釋放結轉移 → "shift to a counter-balance rappel. Rappel to the unresponsive climber, counterbalancing to hold the second roughly in place. Upon reaching the second, connect to them … Set up the next rappel as a tandem rappel on both strands." 書目：Tyson & Loomis *Climbing Self-Rescue*、*Freedom of the Hills* 9th ch.25、Fasulo *Self-Rescue*。https://www.mountaineers.org/locations-lodges/kitsap-branch/committees/kitsap-climbing-committee/course-templates/intermediate-climbing-courses/intermediate-essentials-kitsap/course-materials/climbing-self-rescue-1-notes
- **Counterbalance ascent**：Climbing.com "Multi-Pitch 911: How to Escape the Belay"（Alexa Flower，Yosemite SAR 3 年，2019-03-14）："If the leader has taken a fall past the halfway point on the rope, you may consider prusiking up the lead line, using your partner above as a counterweight. You will be heavily weighting their last piece of gear. Think carefully about the viability of this idea—if the gear is marginal, consider waiting for help." https://www.climbing.com/skills/multi-pitch-911-escape-the-belay
- ANAC 2022（Dalpe）把 "counter-ascending" 和 simul-rappel 並列為 "for experts only"（見上表）。
- Climbing.com Christian Black（2022-12-12）"How to Self Rescue While Climbing"：Oh-Shit-Kit＋三項基本技能（transfer of tension、improvised rope ascension、rappelling with weight），含 counterbalance rappel 的設定步驟。https://www.climbing.com/skills/how-to-self-rescue-climbing/
- Ian Nicholson *Climbing Self-Rescue*（Mountaineers Books，2024-03；Climbing.com 2024-04-15 摘錄）：書的範圍含 "rescuing an injured leader"；摘錄只放 Reepschnur／Escaper，**沒放配重或 tandem 段**。https://www.climbing.com/skills/climbing-self-rescue-rappelling/

### 為什麼不能沒受訓就臨場摸索（可直接引用的句子）
- Petzl："Mastering these techniques requires specific training. Work with a professional to confirm your ability to perform these techniques safely and independently before attempting them unsupervised."
- bergundsteigen：先在離地近、bolt 固定點上反覆練。
- VDiff："If it's possible to call for help … this is usually by far the best thing you can do if you are not confident solving the problem with your current set of skills."
- Climbing.com 2023：先評估，最安全的決定 "may be to call for help and wait"。
- 與本站〈自我救援入門〉一致：「沒上過課的人不要現場摸索脫離步驟；先求援，讓受過訓練的人接手。」（self-rescue-basics L163）

### 影片（排序）
1. **`V7LWnJEPgPU` Counter-Balanced Rappel Transition｜Smile Mountain Guides** — 2025-09-23，5:59。Smile Mountain Guides：科羅拉多 AMGA 認證嚮導公司（創辦人 Jeffrey Mascaro 為 AMGA Rock＋Alpine Guide、SPI Provider；smilemountainguides.com/guide-team）；**片中講者未具名**。無業配。從確保站直接轉配重垂降：
   - **@18s**："I'm going to transition to a counterbalance rappel … First thing I'll do is start with a stopper knot because we're performing rescue skills and we add security before taking security away."
   - @78–120s：Klemheist＋Munter-mule-overhand 把傷者重量移到固定點
   - @139s："Now I need to rappel off of a counterbalanced point"；@176s 自己說 "It's getting complicated."
   - @333–354s："now I'm on a counterbalanced rappel."
2. **`QADhGJqKmkc` Belay Escape to Counter Balance Rappel｜Smile Mountain Guides** — 2026-03-15，7:53。同上頻道，說明欄空白。較完整版：
   - **@17s**："The first thing that you want to do for all these rescues is to add safety before removing a system."
   - @238–257s：傷者情境＋先確認繩沒被落石傷到才上這套系統
   - @413s："as I get to my climber, I won't be able to pull them down with me" → 加摩擦結把傷者一起帶下。
   - 兩支擇一嵌入即可（同頻道）；V7LWnJEPgPU 較短。
3. **配重上升：`CCSczBIY63U` Leader Rescue for Rock Climbing｜Skills for Climbing** — 2024-04-12，26:15。Glen Young：AMGA Certified Rock Guide、AMGA Assistant Alpine Guide（skillsforclimbing.com）。無業配。
   - **@358–393s**："his weight is on that one piece if I put my weight on that one piece and it were to fail then two bodies … are both falling … I'm going to try to avoid counterbalance ascending at all costs"
   - @463–500s：改用「counterbalance climb」— 他攀岩往上、傷者同時被放下，"I'm going to counterbalance climb in order to limit the opportunity to double the body weight on that anchor"
   - **限制（必寫）**：Glen Young 在 Mountain Project 留言自承 "this is my own solution here and not one that is endorsed or vetted by the AMGA or other certifying bodies"（轉引自 https://www.mountainproject.com/forum/topic/127228427/counterbalance-climbing ，該串有不同意見）。所以只能用 @358–393s「為什麼避免配重上升」那段，不要把他的替代法當標準。
   - 早於 2024 備選：`fkrX4dydgeU` JB Mountain Skills 2020-05-05（counter balance and Y-hang abseil，未讀字幕）；`VTUipc6DKsg` Stuart Chapin 2020-04-17（counterbalance→tandem）。

---

## 給寫稿的建議邊界句（事實版）
- 同時垂降：一人卸重或垂出繩尾，另一人就掉；ANAC 有 2016 Yosemite、2017 Goat Wall、2019 Gobright、2019 Seneca 等案；AAC 編輯：「It is not a recommended technique.」→ 本文不教，只說「兩人輪流下」。
- tandem／配重垂降／配重上升：都是救援技術，Petzl、bergundsteigen、Mountaineers 都要求先受訓、先在地面練；連到〈自我救援入門〉。
- 不要寫「Petzl 的攀岩 tech tip 教 tandem rappel」（找不到；只有工作救援的 RIG/I'D 伴隨下降）。

## 打開過但沒用來撐主張
- rockclimbingrealms.com "Counterbalance Rappel Rescue"（2026-01-28，作者 Alfredo Ramses，資格不明、像內容農場）— 不用。
- BMC "How to abseil"、"Abseiling: do you know the risks?" — 沒講配重/tandem。
- Mountain Training Abseil Module handbook — 只有團體垂降管理。
- UKC Multi-pitch abseiling（2016）— 只在卡繩時用配重上升取繩，不是救傷者。
- bergundsteigen "Fehler beim Abseilen: 20 Tipps"（2024-06-03）— 沒談同時垂降。
- AAC Know the Ropes "Crafty Rappel Techniques" — 繩尾結與 stacked rappel，沒談同時垂降。
- Mountain Journeys（2014、2017 部落格）— 只列課程主題。

## yt-candidates 掃描紀錄
`node scripts/yt-candidates.mjs --match "simul.?rap|…|counter.?balanc|tandem|spider|rescue|…" --tiers 1,3 --search "…" --verify`：掃 29 個頻道＋5 組關鍵字 → 23 支候選（原始清單在 scratchpad，未入 repo）。HowNOT2、Hard Is Easy、JB Mountain Skills、Petzl 頻道**在 2024+ 都沒有同時垂降／tandem／配重垂降的片**。相關的只有 Short Guys Beta Works（上列 + 2026-07～08 一組 pick-off 系列，屬單繩距救援，不在本題）與 HowNOT2 `gvuw6yE4_d0` "Rescues are misunderstood"（2025-05-14，讀過字幕：是拖拉系統機械利益測試，與本題無關）。其餘以 YouTube 關鍵字搜尋補到（Eddie Schoen、Smile Mountain Guides、Skills for Climbing、Ryan Tilley 不在頻道設定檔內）。
