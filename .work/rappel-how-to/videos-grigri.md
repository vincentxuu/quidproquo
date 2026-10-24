# 垂降文：GRIGRI／輔助制動器單股垂降（影片＋事實）

研究日期 2026-10-24。字幕、info.json、搜尋清單在 `.work/rappel-how-to/videos-grigri/`（`*.txt` 是帶秒數的去重字幕）。
工具：yt-dlp（搜尋、頻道掃描、字幕；中途遇 429，改用 `--cookies-from-browser chrome` 重抓）、`scripts/yt-candidates.mjs`（37 個頻道＋5 組關鍵字，輸出 `videos-grigri/yt-candidates.md`）、curl（Petzl、AAC、Climbing.com）、Keenable（找 GRIGRI 說明書 PDF）。沒有用 Groundlane，因為 curl 已經能直接拿到全部頁面。

## 結論先講

- **Petzl 沒有一支有旁白、專講「GRIGRI 單股垂降」的影片。** Petzl Sport 與 Petzl America 的上傳列表全部掃過，最接近的是 2025-08 的 #PetzlTips 短片（下面第 1 名）。它就嵌在 Petzl「Multi-pitch rappelling with a single rope」技術頁上，但片子沒有旁白、沒有字幕，只能看畫面。
- 2024 年後符合條件、而且有旁白的只有兩支：EDELRID（用的是 PINCH，不是 GRIGRI）和 Travis Weil（AMGA 嚮導，GRIGRI 只是帶過，鏡頭偏遠）。**沒有任何一支影片完整講到「操作把手時，制動手要握在哪裡」**，這部分要靠 Petzl 文字。
- 2024 年前的 GRIGRI 垂降片（ClimbTips、Bowline Dandy、Yann Camus、Rock Climbing Instruction 等）多半沒有作者資歷，有的示範內容和 Petzl 衝突，不採用。

## 影片排名

### 1. #Petzltips - Rappelling with a single rope and a pull cord.（Petzl Sport）

- id `UUrPgAP1mfw`｜上傳日 2025-08-06｜106 秒（Shorts，直式）｜原廠（第 3 層）｜沒有贊助問題（原廠自家產品：VOLTA 單繩、PUR LINE 拉繩）
- 說明欄："an example of how to set up a rappel on a VOLTA single rope with a stopper knot at the anchor + a PUR LINE pull cord to retrieve the rope on the descent."
- 沒有旁白也沒有字幕（yt-dlp 回報 no subtitles）。下面的時間軸是我把影片下載下來，每 2 秒截一張圖看出來的：
  - **22–26 s**：在主繩上打結（阻擋結），結比垂降環大。
  - **30–36 s**：有鎖鉤環扣進結，再扣回主繩（這就是 Petzl 說的 knot block＋locking carabiner 備援）。
  - **38–44 s**：GRIGRI 特寫，繩子裝進 GRIGRI，扣到吊帶。
  - **48–56 s**：整理、丟繩，拉繩從繩袋放出去。
  - **58–66 s**：GRIGRI 與拉繩在吊帶上的特寫（拉繩用鉤環掛在吊帶上），坐下吃重、確認系統。
  - **68–74 s**：解除自我確保，開始垂降。
  - **約 88–92 s**：垂降環特寫，可以看到結和鉤環擋在環上。
- 建議 `start=22`。
- 限制：沒有旁白，無法對照文字確認每一步（例如是不是掛在 GRIGRI 下方的確保環）。看不出制動手和把手怎麼配合。
- 和 Petzl 文字一致：與 Petzl 技術頁同一套作法，影片也嵌在該頁上。

### 2. Single Rope Multi-Pitch Climbing – Our Favorite Setup & Tips（EDELRID）

- id `aDVjeWyhXpE`｜上傳日 2025-09-29｜680 秒｜原廠（第 3 層）。說明欄列出的全是自家產品連結（EAGLE LITE、TAGLINE 4mm、PINCH、OHMEGA 等），等於產品展示。主講人是 EDELRID 的 Daniel 與 Dörte，個人資歷沒有查到。
- 裝置是 **EDELRID PINCH**（輔助制動器），不是 GRIGRI。
- 最佳片段：
  - **`start=439`**：單繩加拉繩的阻擋式垂降。
    - [456] "We have a figure eight knot as a stopper knot which gets blocked in the eyelet."
    - [461] "We connect the carabiner from the figure eight knot to the standing rope to have this as a backup in case the knot … should slide through the eyelet."
    - [474] "The end is fixed to the tagline…"
    - [488] "I load the system, check if everything is working, and then I take out my self belay and start to repel."
    - [538] 拉繩袋（haul bag）掛在 "the belay loop underneath the belay device"。
    - [568] "The tagline will now run out of the haul bag and so I can be sure to always have it with me."
  - **`start=585`**：垂降環太大時，八字結會被拉過去，改用 clove hitch 加有鎖鉤環。
    - [609] "the figure of eight knot jumps through the eyelet… as soon as the carabiner has jumped through the eyelet, it's hard to pull it backwards."
    - [624] "use a clove hitch instead … and a locking carabiner … clip … on the loaded strand."
    - [650] "So the pinch goes to the fixed side."
    - [655] "I load it, do a function check, works, and then I can take self belay out."
- 跟 Petzl 不一樣的地方：
  - 拉繩怎麼帶：EDELRID 把拉繩放在拉繩袋裡、掛在確保環上。Petzl 寫的是 GRIGRI 用快扣把拉繩扣在確保環上。兩種都是「拉繩一直帶在身上」，只是做法不同。
  - 大垂降環的作法：EDELRID 用 clove hitch 加鉤環。Petzl 只說「large ring → risk of poor carabiner positioning」，沒有提 clove hitch。
- 限制：PINCH 不是 GRIGRI。文章引用時要寫「輔助制動器」，不能寫成 GRIGRI 示範。

### 3. Rappelling in Tricky Situations: Advanced Rappelling Techniques（Travis Weil）

- id `WlR79qc7fBA`｜上傳日 2026-08-04｜814 秒｜頻道訂閱數 617。
- 資歷：travisweil.com 自述 "AMGA Certified Rock and Alpine Guide, AMGA Apprentice Ski Guide, and a PSIA Level 2 Alpine Instructor"。這是他自己網站上寫的，**我沒有到 AMGA 名錄核對**。
- 贊助：說明欄有 Insta360 聯盟連結與折扣碼（"Filmed with the help of Insta360 X4"）。
- 最佳片段 **`start=136`**（到約 268 s）：
  - [160] "tie an overhand on a bite on the pull side of my rope. Take a locking carabiner, clip it into the knot, and then into my rappel line"
  - [174] "I'll stack my rappel device up on this one strand because it is now fixed."
  - [187] "I want to make sure I keep track of the end of my pull strand."
  - [193] 拉繩那側不夠長時，到底後接上 cordelette、長扁帶或串起來的快扣再拉。
  - [212] "Instead of being limited to ATCs … I can also use tools like my Grigri here to go down on a single strand."
  - [290–415] 想知道結要打在哪裡時，先把夥伴下放，用 ATC 從 master point 下放，順便把繩子拉到剛好的位置，再在制動側打阻擋結。
- 限制：
  - 多是遠景，看不清 GRIGRI 和制動手的細節，也沒有明確示範吃重測試。
  - 他把這招叫 "knot block or a reef knot"。reef knot 是方結，叫法不準確，引用時不要沿用。
  - 用扁帶、快扣臨時加長拉繩，Petzl 沒有寫。

### 補充（不排名，可視需要用）

- **Which Rope Block Systems are SAFER for Single Strand Rappels?（Short Guys Beta Works）**
  - id `S3JLEA5lgvs`｜2025-07-07｜410 秒｜說明欄聲明可能含聯盟連結。主講 Jason，網站自述在 Colorado Mountain Club 教過多年；沒有嚮導認證資訊。
  - 片頭 [23]："Let's say we are climbing with single strand assisted braking devices like GriGris…"
  - 章節：1:24 Knot Blocks｜2:35 Carabiner Blocks｜4:17 Reepschnür Hitch｜5:34 Joined Ropes。
  - 主軸是「擋得越牢，越容易卡繩」的取捨。[233] "of course we test the system before relying upon it." [344] 兩條繩對接時，把繩結打在垂降股上，這樣對接結失效也不會讓垂降系統失效。
  - 適合用在「阻擋法比較」段，`start=84`。沒有示範 GRIGRI 操作。
- **It is not a Rappel Device! - Petzl Grigri（ripperkon）**
  - id `uQVqtH91j5k`｜2025-11-23｜821 秒｜11 萬訂閱，作者資歷不明（拿工業用 Skylotec 器材比較）。
  - [192]–[240] 示範 GRIGRI 沒吃重時凸輪會被彈簧打開。下方繩子少、繩子細，或用繩袋時，比較不容易鎖住。[300] GRIGRI+ 的 anti-panic 可以被拉過頭。
  - 立場比 Petzl 保守（Petzl 明列 GRIGRI 可單股垂降），只能當「為什麼一定要握制動端」的佐證，不能當教學。
- **How to Set Up a Tag Line for Rappeling（Outdoor Research × AMGA，Dale Remsburg）**
  - id `dlKPQ_0f6aI`｜2018-11-06，早於 2024 門檻。
  - overhand on a bite＋有鎖鉤環當阻擋，拉繩用 flat overhand 接上。他用管狀器材把拉繩也穿進去（[111]），不是 GRIGRI 作法。
  - 只能當背景參考，不嵌入。
- 已排除：
  - Adventure Bus `g8nFPXp6Lx8`（2026-01-27）：沒有資歷，還示範用 ghosting 收繩。
  - Climb Free As Can Be `aPHD7ZBJmn4`：沒有旁白內容。
  - HowNOT2 `MYy9zMrxYRs`、`BshgXXn4UEk`（2021–2022）：講溪降與 Munter 的阻擋，不是 GRIGRI。
  - JB Mountain Skills `uZYbL61GO6w`：固定繩，但沒有用 GRIGRI。
  - Kuri Adventures `E3FeDfY73K4`（2026-10-19，日本登山嚮導，6.1 萬訂閱）：繞樹，用 girth hitch 加鉤環的單繩回收法，示範的是一般確保器，不是 GRIGRI。可以當亞洲讀者的補充。

## Petzl 文字：GRIGRI 單股阻擋式垂降（可直接引用）

### P1. Rappelling with GRIGRI and NEOX

https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI（2026-10-24 以 curl 取得）

- "GRIGRI and NEOX enable rappelling on a single rope: on a retrievable system with one strand blocked, or on a fixed rope."
- "Hold the brake side of the rope and gradually pull the release handle. The handle helps adjust the friction, but the descent is controlled by the hand gripping the brake side of the rope."
- "Rappelling can be done on EN 892 dynamic or EN 1891 low stretch rope of a compatible diameter indicated on the device."
- "A bottom belay is possible … The person performing this maneuver must pull by hand, without hanging on the rope. WARNING: a strong pull on the brake side of the rope can cause the GRIGRI or NEOX to unblock."
- "With NEOX, GRIGRI + from 2017 and on, and GRIGRI from 2019 and on, unblocking and a consequent fall can occur if the rope below the user is heavily loaded … equal to or greater than that of the person rappelling."
- 危險情境：救援者不可沿受困者的繩子往上爬。排隊時預先裝在繩上的器材 "can be inverted (and thus unblocked) by the weight of the person rappelling below them."

### P2. Multi-pitch rappelling with a single rope

https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope（頁面嵌入影片 `UUrPgAP1mfw`）

- "With a GRIGRI, it is not possible to rappel on the two strands coming out of the anchor. So one must rappel on a single strand, blocked at the rappel ring by a knot attached to a locking carabiner."
- "Rappel only on the strand opposite the knot block; the other strand is used only for retrieving the rope."
- "the knot should be bigger than the rappel ring. If the knot goes through the ring, the fall will be stopped, but rope retrieval will be complicated."
- "Petzl recommends that the rappel setup always be secured with a locking carabiner clipped to the rope, to back up the knot block. There is a risk of the knot passing through the ring, even if the block seems secure."
- "A knot at the end of the rope is a necessary precaution…"
- 超過半條繩長時："a rope retrieval cord must be used … Do not descend on the retrieval cord."
- 兩種阻擋法：
  - 小環加備援：要等整條繩收回才能架下一段；體積大，比較容易卡。
  - 不用對接結，直接用有鎖鉤環：下一段不用把整條繩重新穿過環；但環大時，鉤環可能卡在不對的位置，或卡繩。
- "if the single rope gets stuck out of reach, the retrieval cord can not be used to belay for the recovery." 這套作法 "not suitable for the rapid execution of a long series of rappels."
- 垂降與收繩：
  - "Before un-tethering from the anchor, put your body weight on your rappel system and verify that it is properly set up."
  - "Take care to rappel on the correct strand. Do not rappel on the cord."
  - "With a GRIGRI: clip the cord to your belay loop with a quickdraw."
  - 拉繩太細拉不動時，用上升器輔助（BASIC、ASCENSION、TIBLOC）。

### P3. Petzl Technical Institute：Rappelling On A Single Line With Assisted Braking Belay Devices

https://www.climbing.com/gear/rappelling-on-a-single-line-with-assisted-braking-belay-devices/（2017-05-01，標明是 Petzl 撰寫的廣告內容）

- "A blocking technique must be used to prevent the risk of the knot passing through the anchor point when descending a route on only one strand of rope. Additionally, on rappels longer than half a rope-length, a dedicated pull-cord or another rope must be used…"
- 三種阻擋法：
  1. flat overhand 接拉繩當 knot block，"Use an alpine butterfly or clove hitch and carabiner to close the loop should the knot squeeze through the anchor." 結穿過快扣環時能擋住墜落，但收繩困難。
  2. 兩個 figure eight on a bight 加有鎖鉤環："the second rappel can be set up without threading the whole rope"。風險："poor carabiner positioning and/or stuck rope"。
  3. 八字結回穿加鉤環："knot block is of considerable size to reduce the risk of it getting sucked through"。缺點是結比較複雜。

### P4. GRIGRI 技術說明書

Technical Notice GRIGRI D0015500K (051124)，16 頁，PDF 建立於 2024-11-05。https://petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW

- §1："EN 15151-1 type 6: devices for belaying and rappelling without a panic blocking element … It also allows rappelling on a single strand of rope."
- §6："The blocking function and descent control will not work if the rope is installed in the wrong direction."
- §8 Rappelling and lowering："always hold the brake side of the rope when operating the handle. If the brake side of the rope is not held, there is a risk of losing control of the descent. Operate the handle to gradually unblock the rope. The handle helps adjust the friction, but the descent is controlled by the hand gripping the brake side of the rope."
- §9 Hands free："tie a tight knot in the brake side of the rope, near the device. This knot will serve as a stop in case of rope slippage."
- 繩徑："Compatible with 8.5 to 11 mm diameter EN 892 dynamic single ropes and EN 1891 low-stretch kernmantle ropes … tolerance of up to ±0.2 mm."
  - 8.9–10.5 mm 最佳。
  - 8.5–8.9 mm："Thin ropes … can be more difficult to control while lowering, rappelling or in the event of a fall."
  - 新繩、有表面處理、結冰、濕、泥濘的繩子會降低制動效果。

### 整理成步驟（GRIGRI＋單繩＋拉繩，依 P2/P3/P4，非影片）

1. 繩子穿過垂降環。在**不垂降的那股**（拉繩側）打阻擋結，結要比環大。
2. 用有鎖鉤環把結扣回**垂降股**，防止結被拉過環。這一步 Petzl 寫「always」。
3. 超過半條繩長時接上拉繩（flat overhand，必要時加止滑結）。兩股繩尾都打結。
4. GRIGRI 只裝在**阻擋結對面那股**（被擋住、固定的那股），照機身標示確認方向。拉繩用快扣扣在確保環上。
5. 還掛著自我確保時，先把全身重量坐到 GRIGRI 上，確認鎖得住、方向正確、裝在對的那股，才解除自我確保。
6. 制動手一直握住制動端，另一手慢慢拉把手。速度由制動手控制，不是把手。要空手時，在制動端靠近器材處打結。
7. 到底後拉**拉繩**收繩。如果單繩卡在搆不到的地方，拉繩不能拿來當確保。

## 事故（AAC《Accidents in North American Climbing》2026 年版）

### A1. Rappel Fatality — Rappel Device Attached to Wrong Strand

https://publications.americanalpineclub.org/articles/13201217659

- 地點：Nevada, Red Rock, Pine Creek Canyon, Community Pillar｜Climb Year 2025｜作者：Joe De Luca, Climbing Magazine and the Editors。
- 經過："she had attached her Grigri to the 'pull' strand rather than the 'rappel' strand. When she weighted the device, the rope pulled through the anchor and she fell past her partner" — 墜落 120–130 ft，死亡。
- 機制："Attaching a rappel device to the pull strand—versus the load strand—results in an immediate, unobstructed fall as the rope runs through the anchor."
- 情境：日落後約半小時、約 45°F、面北的岩壁，"almost certainly in a hurry"。
- 教訓："When conditions deteriorate and pressure mounts, slowing down is the correct response." 圖說寫的條件是："with a precise setup and clear identification of the correct rappel strand before weighting the system—the Reepschnur is a safe and useful technique."
- **日期矛盾**：內文寫 "On January 18"，圖說寫 "a fatal accident in Red Rock in November 2025"。引用時只寫「2025 年」，不要寫月份。

### A2. Rappel Error — Complacency（Psycho Tower）

https://publications.americanalpineclub.org/articles/13201217645

- 地點：Colorado, Dolores River Canyon｜Climb Year 2025｜作者：Marcel Such 本人自述。
- 器材與作法：GRIGRI+、9.5 mm 70 m 單繩對折，carabiner block，獨攀後下降。
- 經過：在第二個垂降站預先穿繩時，垂降股掉了。他把面前的拉繩股當成垂降股裝進 GRIGRI。
  - "pulled the slack out of my device and gave the 'rappel side' a tug. There was enough friction in the system for there to be resistance when I pulled, so I untethered, leaned back—and instantly toppled backward"
  - 墜落 20–30 ft，徒手抓住垂著的繩尾才停下來（手被繩子燙傷）。
- 教訓：
  - 用手拉一下不算測試，**要全身吃重才算**。
  - 錨點在腰的高度、底下有好平台時，最容易省掉吃重測試。
  - "I got complacent on the rappels"。
  - 雙色花紋（bi-pattern）的繩子可能幫他發現股別錯了。
  - 如果用一般雙股垂降，這件事不會發生。

### A3. Ground Fall From Anchor — Rappel Rope Not Properly Attached（Palisades）

https://publications.americanalpineclub.org/articles/13201217622

- 地點：Alabama, Blount County, Palisades Park, Buckets (5.5)｜Climb Year 2024（收在 2026 年版）｜作者：Dylan Addis, MD, and the Editors。
- 經過：60 磅、約 11 歲的孩子，因為「太輕」被安排用 ATC 型器材單股垂降，那一股沒有固定。下方有人做消防員確保，但沒有用："the rope had simply pulled through the anchor when the girl weighted the system." 墜落 50–60 ft，傷勢輕微。
- 教訓：
  - "The fix was one simple step: a knot clipped directly to the anchor."
  - 錨點 "unnecessarily complicated—more components mean more to check"。
  - "the party likely failed to test the system"。
  - 第一個下去的是孩子，"cannot reasonably be expected to discern a rigging error"。
  - 消防員確保擋不住整條繩被拉過錨點。
- 和 GRIGRI 的關係：器材不是 GRIGRI，但失敗模式一樣，都是單股垂降時那股沒有被擋住或固定。

### 三起事故共同點

都是「單股垂降，裝在沒有被擋住的那股」，而且出事前都沒有做全身吃重的測試。這正好對應 Petzl 的兩句話："Take care to rappel on the correct strand" 和 "put your body weight on your rappel system and verify"。
