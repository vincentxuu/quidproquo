# R-technique：拖包（hauling）技術與器材事實檔

研究日期：2026-10-24。每條附「實際打開的 URL」與原文短引。[opened] = 本次親自抓到全文或可見內文；[opened via Exa] = curl 404，改用 Exa web_fetch／web_search 取得內文；[prior] = 沿用 .work/aid-climbing-gear/ 既有已查證筆記，本次沒有重抓；[not opened] = 只看到搜尋結果標題或二手轉述。

## 工具降級紀錄（toolDegradation）

- (1) Groundlane MCP：本 session 只有 `mcp__claude_ai_groundlane__authenticate`，沒有 web_search/web_fetch → 不可用。
- (2) Groundlane 直接 HTTP（curl POST /mcp）：HTTP 401（要認證）。
- (3) Keenable keyless API：可用，所有搜尋都走這條（`/v1/search/public?query=`）。
- 抓頁：curl 直接抓 + 本地 HTML→文字（大部分頁面 200）。
- Petzl 舊式 URL（/BE/en/Sport/Hauling-a-bag…、/INT/en/Sport/Video-…PUR-LINE）curl 回 404、Exa fetch 回 CRAWL_NOT_FOUND／REDIRECT → 改用 Exa web_search 取得頁面內文。
- SuperTopo 全站 curl 回「Site Temporarily Unavailable」，Wayback 沒有快照 → Exa web_fetch 取得全文。
- 沒用到：You.com、Tavily、linkup、jina、firecrawl、內建 WebFetch。

## 來源日期總表（日期門檻：評測／影片／價格 2024+；原廠說明、協會教學、經典教學不受限）

| 來源 | 日期 | 類型 |
|---|---|---|
| Petzl〈Hauling a bag: preparation and technique〉 | 未標 | 原廠 tech tip |
| Petzl〈Video – Hauling a Pack on a Multi-Pitch Route with the PUR LINE〉 | YouTube 原片 2023-06-27（wYRd6WUBBCo；原寫 2023-10-24 有誤，見 §6.7） | 原廠影片（原廠教學，可留；若當「影片」算則 <2024） |
| Climbing.com, Jeff Achey〈How to Haul a Pack for Climbing〉 | 2023-06-14 | 技術教學 |
| Climbing.com, Alexa Flower〈Learn This: Efficient Hauling〉 | 2016-09-21 | 技術教學 |
| Climbing.com, Pete Zabrok〈Tech Tip – Aid – 2:1 Hauling Ratchet〉 | 2004-02-02 | 技術教學 |
| Alpinesavvy〈Hauling – not just for big walls〉 | 2023-01-18 | 技術教學 |
| Alpinesavvy〈Foot haul your pack on a multi-pitch〉 | 2025-08-14 | 技術教學（全文付費，只讀到公開部分） |
| Alpinesavvy〈Drop-proof your pack〉 | 2025-08-10 | 技術教學 |
| Alpinesavvy〈Haul bag rigging 101〉 | 2022-08-25 | 技術教學 |
| Alpinesavvy〈Hauling directly from a Traxion pulley〉 | 2019-02-25 | 技術教學 |
| Alpinesavvy〈The 2 to 1 "Z pull" haul, explained〉 | 2018-12-17（內文寫 2020 best practices） | 技術教學 |
| Andy Kirkpatrick〈Advanced Hauling〉（Substack） | 2021-06-01 | 技術教學 |
| Andy Kirkpatrick 舊文（Rucksack hauling、Basic Hauling Systems、The Haul Line） | 頁面自註「most written in the 1990s」 | 經典教學，器材已過時 |
| SuperTopo, Chris McNamara〈How to Big Wall Climb – Hauling…〉 | 2017-06-06 | 經典教學 |
| SuperTopo, McNamara〈Gear 3: Haulbags, Hauling and Bivy Gear〉 | 2012-05-06 | 經典教學（器材推薦過時） |
| Mark Hudon〈All Things Haul Bag〉PDF | ©2012 | 經典教學 |
| VDiff Climbing〈Basic Hauling Techniques for Multi-Pitch Trad〉 | 2025-12-29（改 2026-05-26） | 技術教學（書摘） |
| VDiff Climbing〈Big Wall Hauling Systems Explained〉 | 2025-12-30（改 2026-06-07） | 技術教學 |
| WeighMyRack〈3 Hauling Methods for Hard Multipitch Climbs〉 | 2018-03-05（改 2021-09-11） | 技術教學 |
| 石田登山塾日誌〈荷上げ失敗を考察〉 | 2018-12-20 | 日本講習事故分析 |
| finetrack〈Road to El Capitan 荷揚げトレ真っ只中！〉 | 約 2019（頁面圖片路徑 2019/09，未確認發文日） | 日本品牌部落格 |
| NPS Yosemite Climbing Regulations | 現行頁 | 官方 |
| 各產品頁、價格 | 2026-10-24 抓取 | 原廠 |

---

## 1. 自由攀登多繩距的輕量拖包

### 1.1 什麼時候值得拖、什麼時候讓跟攀背

1. **Climbing.com（Achey 2023）[opened]** https://www.climbing.com/skills/how-to-haul-pack-climbing/
   > "Carrying the big cams, approach shoes, water, and storm gear in a small haul pack frees the leader—and follower—to send as much as a number grade harder. If the climb is longer than 10 pitches, and you're trying to blitz the route in a day, hauling might be too slow"
   > "If all goes well, the entire hauling process should take about 10 minutes. That's an extra hour for every six pitches"
   > "On easier, lower-angled rock, such as fourth-class summit pitches or ridge traverses, stop hauling and let the second carry the bag. You may also need to do this on sharply traversing pitches."
2. **VDiff（2025-12）[opened]** https://vdiffclimbing.com/basic-hauling
   > "Hauling is typically only beneficial on terrain steeper than 80 degrees, where there are few obstacles and no loose rock. Otherwise, you'll be better carrying the load on your back."
   > "Hauling a lightweight pack up low-angled rock will most likely result in you losing all your belongings and dislodging rocks."
3. **Kirkpatrick〈Hauling Your Rucksack〉（1990s 舊文）[opened]** https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies
   > "Hauling should be avoided where possible. More often than not it turns into a time-consuming nightmare, requiring more effort than simply climbing with the thing on your back."
   最後一句（rucksack_hauling_strategies1）："the best advice for 'sack hauling is to make sure you're strong enough — and your 'sack is light enough — that you don't need to haul it in the first place."
   → 和 Climbing.com／Alpinesavvy 的「拖比較好」立場相反，文章可以並列：陡、難、有墜落風險的繩距才拖；緩、亂、有落石就背。
4. **Alpinesavvy（2023-01）[opened]** https://alpinesavvy.com/blog/hauling-not-just-for-big-walls
   > "While climbers typically default for the second to always carry the pack, a better option is often for the leader to haul that extra gear."
5. **WeighMyRack（2018）[opened]** https://blog.weighmyrack.com/what-the-haul-3-ways-to-help-send-hard-multipitch-climbs
   Black Canyon 的 Trilogy（5.12a）："our 6mm static 60m rope and a 35L BD Stubby haul bag proved crucial"；"Light is right, I discovered, until the climbing starts to get hard."

### 1.2 拖繩的選擇

6. **Climbing.com（Achey 2023）[opened]**（同上 URL）
   > "Never use a skinny dynamic double rope as a tag line. Its stretchiness is terrible for pulling on rappel and very dangerous over edges if it has to be ascended. The best line for light hauling is a 65-meter 6mm-8mm static tag line."
7. **Petzl PUR LINE 6 mm 產品頁 [opened]** https://www.petzl.com/us/en/sport/products/cords/pur-line-6-mm/PUR-LINE-6-mm_SPO_a2m1r000002bfKZAAY.html
   > "ultra-lightweight and ultra-durable cord for hauling a pack or retrieving a single rope during a rappel. It is hyperstatic and features a rough sheath"
   > "Diameter 6 mm Weight per meter 20 g Material(s) High-modulus polyethylene (HMPE) Certification(s) CE EN 564, UIAA Static elongation Less than 2 %"；"Length 65 m 200 m"；"Weight 1300 g 4000 g"
   > "65-meter length to compensate for the elasticity of a 60-meter dynamic rope during rappels"
   > "When used to haul a bag, it is compatible with most Petzl ascenders and progress capture pulleys (TIBLOC, BASIC, ASCENSION, MICRO TRAXION and NANO TRAXION)"
   頁面附圖說明："Classic hauling technique with NANO TRAXION progress-capture pulley."
   台灣官網（https://www.petzltw.com/products/pur-line-6-mm ，2026-10-24）[opened]：SKU PTR010AA00／AA01，價格 NT$11,500 與 NT$31,000；65 m = 11,500、200 m = 31,000（§6.11 已由頁面 productVariantsInfo 確認）。
8. **Kirkpatrick〈The Haul Line〉（舊文）[opened]** https://andy-kirkpatrick.com/articles/view/the_haul_line
   輕載拖繩："(5.5mm Dyneema/Spectra, 7.5–8mm dynamic rope, or 7–8mm perlon). Used for very light loads … With ropes this thin it's often unnecessary to use a pulley; hauling by hand or with a Wild Country Ropeman is sufficient."
   英國用半繩其中一條拖（rucksack_hauling_strategies1）："The 'sack is pulled up first on one rope (usually one half of your double rope system in the UK), then the second follows on the remaining single rope"
   → 和 Achey「不要用細的動力雙繩當拖繩」衝突；差別在 Achey 擔心的是拿它垂降拉繩、或得爬它；Kirkpatrick 寫的是英式雙繩系統。文章兩者並列。
9. **VDiff [opened]**（同上 URL）："Using a dynamic lead rope (instead of a static rope or cord) as your haul line gives you more options. It acts as a back up if your main rope is damaged … Having a second rope also doubles the length of your abseils."
10. **Alpinesavvy（2023）[opened]**：6 mm PUR LINE 65 m "weighs just a hair over 3 pounds / 1.3 kg"；"Small diameter ropes like the 6mm Petzl PURline can be very tangle prone. A stuff sack or rope bag is highly recommended"
11. **WeighMyRack [opened]**：Micro Traxion 拖法用 "40-70m of 5-6mm static cord"。
12. **Beal BACK UP LINE 5 mm [opened]** https://us.beal-planet.com/products/back-up-line-5mm
    > "specially designed for hoisting, rappelling and hauling in rescue situations" / "only 21g/m. But also ultra-static. Since the BACK UP LINE does not absorb energy at all, it should not be used for roping, progressing or any situation requiring dynamic qualities."（強度數字頁面欄位有，但本次文字擷取沒抓到數值 → 未記錄）

### 1.3 手拉 vs 止退滑輪；1:1 腳踩

13. **Climbing.com（Achey）[opened]**
    > "With a lighter load—if you're confident—you can simply haul up the rope and bag hand-over-hand. With a heavier bag, redirect the rope and the bag through a carabiner, as high as possible at the belay, and use a progress-capture device (PCD)."
    > "I like the Petzl Tibloc in 'locking pulley' mode, or the slightly heavier (but more efficient) Petzl Nano Traxion"
    > "Arms, not legs, give out first on long climbs, so don't waste your guns on the hauling."
14. **Alpinesavvy〈Foot haul〉（2025-08，公開部分）[opened]** https://alpinesavvy.com/blog/foot-haul-your-pack-on-a-multi-pitch
    > "it's now a lot more feasible to efficiently haul a moderate (30 lbs. / 15 kg) load. With a modest load like this, you don't need any fancy mechanical advantage rigging. A 1:1 is going to work fine."
    > "If your pack is very light, you might pull it up hand over hand, but this usually isn't the best choice."
    > "At a bolted anchor, usually it's best to haul off of the bolt rather than the anchor master point … A well placed bolt is good for 20+ kN"
    步驟：PCP 掛高點→第二個 PCP 夾在拖繩上（"teeth to tail"）→腳環→再加一個 redirect 鉤環。"Note that zero load is going onto your tired arms!"
    來源說明：靈感來自 Avant 的 Brent Barghahn YouTube 影片（Avant 賣器材，有商業關係）。
15. **Kirkpatrick〈Basic Hauling Systems〉（舊文）[opened]** https://andy-kirkpatrick.com/articles/view/basic_hauling_systems
    > "If the rucksack isn't too heavy, this is the best system to use, as it's quick, simple"（手拉）；Magic plate 自鎖："has the major advantage of allowing you to belay your second while hauling from the same device."
16. **Alpinesavvy（2023）[opened]**：沒有止退滑輪時可用 Garda hitch，"it can add quite a lot of friction"；Tibloc 要照 Petzl 圖把繩子穿過鉤環，否則 "can be hard on your rope"。

### 1.4 流程：誰做什麼（放包、卡住、先拖還是先確保）

17. **Climbing.com（Achey）[opened]**
    > "yell, 'Ready to haul!' … I use three sharp tugs on the line to indicate I'm ready to pull up the bag."
    > "The second can now free the bag from its clip-in point on the anchor. Unclip it and yell a voice command such as 'Haul away!'"
    > "I like to tie the tag line to the pack with a clove hitch, about 15 feet from the end of the line, so I have a 'tail' section of line to gently extend the bag out on traversing pitches instead of letting it swing."
    > "In general, the leader will haul the bag before he puts the second on belay (so the second can free a stuck bag if necessary), but let the follower climb clear of the danger zone before attempting a rockfall-prone haul."
18. **Alpinesavvy（2023）[opened]**：順序不同——
    > "the first thing they do is set up the haul, and pull the bag a few meters off of the lower anchor … The next thing the leader does is put the second on belay. Then, the leader can start hauling as fast as they can … That way the leader is (mostly) not trying to belay and haul at the same."
    → **兩家順序衝突**：Achey 先拖完再確保（跟攀者在下面可以處理卡包）；Alpinesavvy 先拖離幾公尺、確保、再拖。文章並列，不選邊。
19. **VDiff [opened]**："If the bag gets stuck, you can pause hauling and begin belaying your partner. Once they have climbed up and freed the bag, you can tie-off the belay and continue hauling."；橫渡繩距 "the bag should be attached to the middle of the rope (with an alpine butterfly) … This enables the belayer to lower the bag out gently"；先把滑輪掛上固定點再從吊帶解下繩子 "ensures that you cannot drop the rope"。
20. **WeighMyRack [opened]**：橫渡時 "tie the bag 10-15 meters from the end of the rope … the follower unclips the bag from the anchor and manually pays out the final 10-15m, releasing the bag to a point plumb line below the top anchor"；"Stack the tag line across a separate space (your shoulders, your foot, etc) from the lead line"。
21. **Kirkpatrick（1990s）[opened]** https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies1
    > "If the 'sack does get stuck you'll have to wait for your second to reach it … Don't be tempted to start yarding on it to dislodge it, as this could send a block down onto your mate's head."
    三種：standard haul／assisted haul（跟攀者邊爬邊拖）／protected haul（包掛在跟攀繩上方 1 公尺左右、跟攀者綁兩條繩）——"perfect if the ground is dangerous and loose"。
22. **Kirkpatrick 拖繩上吊帶 [opened]**（The Haul Line）："clip it directly into the anchor, pulling slack through the hauler as you do so … This system means you can't drop your haul line."；Climbing.com（Achey）："clipped to the dedicated haul loop on the back of her harness"；VDiff："Be careful of using gear loops – they can break if the rope gets stuck."

### 1.5 包的準備

23. **Climbing.com（Achey）[opened]**
    > "Haul clean … Waistbelts and shoulder straps will snag, so remove or tuck them away. Never tie anything to the side of a haul pack—hang below, if at all."
    > "Pick a bag specifically designed for hauling, or it will get shredded after only one or two outings."
    > "protect the rope at the knot with the cut-off top of a plastic soda bottle"
24. **Kirkpatrick〈Hauling Your Rucksack〉[opened]**："Make sure no hard objects are pressing directly against the fabric, as they'll grind a hole through it in seconds."；"Clip the hip belt back around the body of the pack—buckles love getting wedged in cracks"；"Always connect the rope to the rucksack with a locking karabiner—or two opposed karabiners"；"Keep any knots as close to the 'sack as possible"。
25. **防掉包 [opened]** Alpinesavvy（2025-08）https://alpinesavvy.com/bonus-articles/drop-proof-your-pack ："Girth hitch a 60 cm sling to your pack … When you reach the belay, clip the pack to the anchor, and THEN take the pack off."；"girth hitch the sling through both the haul loop AND a shoulder strap"。Kirkpatrick 同一招（60 cm sling、Lark's foot）。
26. **小拖包／攀登包實例 [opened]**：BD Wall Hauler 40（見 §3）；Metolius Sentinel 46 L "designed for use on shorter walls or as a sub-bag"；Petzl BUG 18 L / 665 g（Alpinesavvy 說 "the haul loop is extra stout"；Petzl 產品頁本次沒抓到 haul loop 字樣）。本站〈multipitch-climbing-backpacks〉已有攀登包拖拉環原則，可交叉連結。

### 1.6 危險

27. 落石：Achey "A hauled bag can cause rockfall … be aware of parties climbing below!"；Kirkpatrick 見 #21；VDiff 見 #2。
28. 卡包機制（日本講習實例）**[opened]** 石田登山塾 2018-12-20 https://ishidatozanjukunisshi.blogspot.com/2018/12/blog-post_58.html
    城ヶ崎「鬼ころし（5.7）」：繩子落在裂隙裡 → "荷物がクラックの僅か１５ｃｍぐらいのハングに引っ掛かりました" → "ロープAそのものがクラック内に入っているので、荷物は引っ掛かるばかり"；結論 "とりあえず引っ掛かる仕組みを理解しておくことも大事"。用途列表："リード中の弾切れ／マルチの難しいピッチ"。（用語：日文寫「荷上げ」，finetrack 寫「荷揚げ」，兩種都有。）
29. 拖繩和主繩纏在一起：WeighMyRack 分開堆繩（#20）；Alpinesavvy 6 mm 易打結（#10）。**沒有找到**專門講「拖繩和先鋒繩互相摩擦（rope-on-rope）」的來源；只有 Kirkpatrick〈Advanced Hauling〉講受力中的繩子很容易被割："you can easily slice through it with just a shoelace, which is why you should always be paranoid about haul lines moving close to fixed lines"（大岩壁情境）。
30. 拖包時邊確保：Alpinesavvy "(mostly) not trying to belay and haul at the same"（#18）。Kirkpatrick 說 magic plate 可以同時確保和拖（#15）。**沒有找到** Petzl 原文明說「拖包同時確保 = 危險」；Petzl 有的是「用 MICRO/NANO TRAXION 確保跟攀 = 危險」[prior，R-technique.md #38]，那是另一件事，不要混寫。

---

## 2. 大岩壁拖包

### 2.1 1:1 body haul（體重拖）

31. **Petzl〈Hauling a bag〉[opened via Exa]** https://www.petzl.com/US/en/Sport/Hauling-a-bag--preparation-and-technique
    > "having several bags of 30 to 40 kg, rather than one 80 kg bag, is a good idea. It is not uncommon to see an inexperienced party leave with a huge bag and spend two or three hours hauling it up one pitch!"
    > "Install a PRO TRAXION progress capture pulley on the station."
    > "The easiest and most efficient hauling technique is the 'balancier' on the ASCENSION handled rope clamp. It uses the weight of the body as a counterweight to raise the bag. This technique is efficient, although it can only be used with a light bag (30 to 40 kg)."
    > "Warning: during these manipulations, the counterweight climber must always remain attached to the station with a rope."
32. **Climbing.com（Flower 2016）[opened]** https://www.climbing.com/skills/learn-this-efficient-hauling/
    裝備："Progress-capture device: E.g., Petzl Pro Traxion or Mini Traxion"、"Haul line: 9.8mm static 60-meter rope"、"Lower-out line: 7mm or 8mm tag line, 40 to 50 feet long"
    > "Clip the end of the haul line to the anchor with a locking carabiner. If there is a failure in the system, the weight of the bag will drop onto the anchor instead of the hauling climber."
    > "To back up your progress-capture device, clip a sling or quickdraw to the master point and to the haul line directly behind your device."
    > "Using your body as a counterweight, squat abruptly to jolt the bags and haul them up"；"Set up the hauling device at eye level"
    > "If the haulbag weighs more than the climber, mechanical advantage will make hauling much easier."
33. **SuperTopo（McNamara 2017）[opened via Exa]** http://www.supertopo.com/a/How-to-Big-Wall-Climb-Hauling-Managing-the-Belay-The-Changeover/a10574n.html
    > "There two main techniques: space hauling and body hauling. Both techniques use the same principle: you attach yourself to the haul rope with an Ascender and then use your body as a counterweight"
    > "Eyes level with hauling device. Feet at the same height and on either side of the haul line."
    > "Clip a backup draw to the rope (in case the device fails, this will catch the rope)."
    > "What is the difference between a 5-minute belay changeover and a 20-minute changeover? About an extra day on the wall (15 minutes times 30 pitches)."
34. **VDiff 大岩壁（2025-12）[opened]** https://vdiffclimbing.com/bigwall-hauling-1
    1:1："Very difficult to haul more than your own bodyweight"；"Stop hauling when you still have around 30cm of rope left – be careful not to jam the knot into the device."；"Have a rest every 20 or so pulls"。
35. **finetrack（約 2019）[opened]** https://www.finetrack.com/funtotrack/post-46332/
    "ホールバッグには30Lを越える水をやギアをたっぷり詰め込み、50㎏近い重さにしてみた"；"摩擦が少ないところでは、1：1で自分の体重を使って上げるボディホーリングだけでも50㎏を上げられることが確認できた"；"終了点は、スラブ状になっているのだが、こうなるとボディホーリングだけでは全く荷物が上がらない" → スペースホーリング。（日文用語：ボディホーリング、スペースホーリング、荷揚げ。）

### 2.2 2:1、3:1、space haul

36. **Alpinesavvy〈2:1 Z pull〉[opened]** https://alpinesavvy.com/blog/the-2-to-1-z-pull-haul-explained
    > "On big wall climbs taking two or three days with a team of two, you can probably use a traditional 1:1 hauling system. However, for climbs much longer than this, or a team of three, or when you or your teammate are significantly lighter than the bags, or if the hauling is on terrain less then vertical … you may well want to add some mechanical advantage."
    > "if you've taken a crevasse rescue … you might think of a 'Z drag' as being a 3:1 … However, in this case, the 'Z' is a 2:1 system"
    來源鏈：Chongo → Pete Zabrok 2004 Climbing Tech Tip → Mark Hudon；"pig rig"。
37. **Climbing.com（Zabrok 2004）[opened]** https://www.climbing.com/skills/tech-tip-aid-21-hauling-ratchet/
    > "While 'space hauling' (two climbers on the haul line at once) works, you must wait for your partner to reach the belay — inconvenient at best and impossible if you're soloing … Three-to-one 'Z' hauling is cumbersome overkill."
    "Start with a 15-foot hunk of 6 or 7mm static line — the Zed Cord."；"practice it first by hauling rocks at your local crag. I'm not kidding!"
38. **VDiff [opened]**（大岩壁頁）
    > "With a 3:1 setup, three meters of rope must be hauled to move the load up one meter … In theory, a 3:1 is three times easier than a 1:1. In reality, it's more like 2.5 times easier."
    > 2:1 用 "a 2 meter length of 8mm nylon cord (don't use dyneema cord – this material weakens with repeated flexing and will suddenly snap mid-haul)"
    > "Space hauling … doubles the efficiency (e.g: Two people hauling with a 3:1 setup gives a 6:1 advantage)"；"It is VERY IMPORTANT that the lower climber stays backed-up on the lead rope"
    > "The same weight hauled 1:1 on overhanging terrain may need a 2:1 on slabby terrain."
    > "The most likely cause of failure is the toothed catch becoming wedged open, causing the haulbag to plummet."
39. **Kirkpatrick〈Advanced Hauling〉（2021）[opened]** https://andykirkpatrick.substack.com/p/advanced-hauling
    > "space hauling … a method of lifting very loads with just a simple 1:1 haul … where one climber hauls and the other acts as a counterbalance."
    > "each time you increase the ratio you also increase the time, so a space haul is always the fasted method of lifting a big load"（Petzl Jag 可做 4:1／5:1）
    > 安全做法："the counterbalanced climber always remains tied into a section of rope - ideally dynamic lead rope - which is clipped into the belay, ideally not into the actual masterpoint"；"This safety rope will come tight after a certain distance, generally around 10 or 20 metres"
    > 事故：有人拖繩在岩階邊緣斷掉 "which sent his bags to the bottom of El Cap … I suspect he was using 60 metres of 9 mm accessory cord, not actual static rope"（他自己說是推測）；"if his partner had been space hauling he'd have died."
    > 反向事故："a friend who was counter hauling their bag, only to find the bag, once the bag cleared a few friction points, was much lighter than them, causing them to plummet down the wall until the bag hit the belay!"
40. **SuperTopo（McNamara）[opened via Exa]**：space haul 步驟 "pull up at least 20 feet of slack before fixing the rope. This way you have a 20+ foot leash"；"Warning: Space hauling is dangerous if done improperly."（後文在書裡，網頁未公開）

### 2.3 拖包端掛法、swivel、docking、lower out

41. **Petzl〈Hauling a bag〉[opened via Exa]**
    > "The haul bag should always remain attached. The attachment knot should be protected with a cut plastic bottle … Between the knot and the bag, you can use a SWIVEL to avoid rope twists … Only one of the bag's two haul straps is attached to the carabiner or quick link under the SWIVEL. This way it is easy to open the bag without dropping it. When hauling, nothing should stick out from the bag … Have a lanyard ready for attaching the bag to the station (a knotted rope end is perfect)."
    橫渡／大屋簷："attach the bag several meters from the lower end of the rope. The lower climber lowers the bag on a Munter hitch while the upper climber hauls gently. Once the bag is vertically aligned with the upper anchor, normal hauling continues."
42. **Climbing.com（Flower）[opened]**
    > "Clip the swivel, which prevents the bag from spinning and turning the haul line into a kinked mess"；"clip the lower-out line … below the swivel to prevent entanglement."
    > "If possible, separate your anchor so the follower ascends on one side and the haulbag raises on the other."
    > Lower out："Once the leader shouts, 'Ready to haul,' the follower lowers out the haulbag, which prevents it from swinging across the rock … release the mule hitch in the lower-out line, so the bag is held by the Munter … Lower out the bag … until the bag is below the next anchor … Yell up to the leader, 'Haul away!'"
    > Dock："Dock the bag using a Munter-mule knot in the lower-out line … Release the teeth on the hauling device and let the lower-out line take the weight."
43. **Alpinesavvy〈Haul bag rigging 101〉（2022）[opened]** https://alpinesavvy.com/blog/haul-bag-rigging-101
    > "A docking cord attaches the bag to the anchor, not a daisy chain. The docking cord is typically a doubled length of 7 or 8mm cord (about 15 feet / 5 meters) that's attached to the long strap of your bag … You can release the bag when this hitch is fully loaded"
    > "that evil sewn pocket daisy chain! That sucker can be very difficult to unclip, especially if the pitch above is traversing."
    > "It's important to clip this bight knot ABOVE the swivel, and not below it."
    > 現代掛法：Traxion 掛在包上（far end haul）、swivel 在 Traxion 和主鉤環之間、cam strap 連長短背帶。
    > 註："many swivels made by DMM have been recalled"
    引 Kirkpatrick《Higher Education》："Hauling is potentially one of the most dangerous aspects of big wall climbing … view their bags as dangerous creatures, like a great white shark, rhino, or raptor"（書本身 [not opened]，經 Alpinesavvy 轉引）
44. **Alpinesavvy〈Hauling directly from a Traxion〉（2019）[opened]** https://alpinesavvy.com/blog/hauling-directly-from-a-micro-traxion
    "far end haul … originally invented by … Chongo, and shown to me initially by Mark Hudon"；"No, the teeth on the pulley do not damage the rope … (You ARE using a burly haul rope with a stout sheath, right?)"（作者經驗說法，非原廠）；好處：不用 knot protector、多餘拖繩當 lower-out、不用解死結。
45. **Mark Hudon〈All Things Haul Bag〉（2012）[opened, PDF]** http://headlampsclusterfucksandotherverticaladventures.com/wp-content/uploads/2015/06/all_things_haulbag.pdf
    Docking cord："15 feet of 8 mil, doubled … tie a Munter Hitch using both cords … After five or six wraps secure the ends with a simple square knot … In four walls, probably 80 pitches, I have never had the Cord slip or untie."
    Lower out："pulling all the available slack through the Mini-Traxion and tie a safety knot to the top of the swivel … run the slack end of the rope up to a biner at the anchor and down to the Gri-gri … release the docking cord at the appropriate time and then continue lowering out the bag with my Gri-gri."
46. **SuperTopo Gear 3（McNamara 2012）[opened via Exa]** http://www.supertopo.com/a/How-To-Big-Wall-Climb-Hauling-and-Bivy-Gear/a10540n.html
    拖繩："The Nose or Half Dome in just one bivvy … 8mm 60m static line. For most two to three-day walls I take a 9.5mm static … For massive loads … 10mm static"
    Lower-out 三種：用拖繩多留 "10 to 20 extra feet"／"20 to 30-foot piece of 8 mil cord"／"50-plus-foot 8mm lower-out line … necessary on a route like The Nose"
    Swivel："I have rarely used a hauling swivel but it is nice for a low-angle route that traverses a lot like The Nose."（→ 和 Flower／Petzl 偏「要用」的語氣不同，並列。）
    滑輪："you want to have a pulley that is at least one inch in diameter"
47. **Kirkpatrick〈Advanced Hauling〉[opened]**："As a rule, the bags should never be undocked until they have been fully lifted off the belay, and the last person can check everything is loading correctly"；拖繩接包："two hard links (two lockers), or 10 mm hard link, or even tie the line to the bags with a backed-up bowline"。
48. **Kirkpatrick〈The Haul Line〉[opened]**：passing a knot 五步；"Tie the haul line off as a backup before removing the pulley."
49. **Alpinesavvy 2:1 文、VDiff [opened]**：拖包掛點要能看到——VDiff "keeping the hauling device clear of anything else at the belay"；"Hauling devices and pulleys should be used with compatible carabiners (ovals work best)"。Petzl 有專文〈Choice of carabiners for hauling systems and pulley attachment〉[opened, 只讀到開頭]：「For hauling, the highest efficiency is desired, which is obtained by choosing efficient pulleys, but also by ensuring that the devices are ideally aligned or positioned.」
    https://www.petzl.com/us/en/sport/tech-tips/choosing-the-right-equipment/choice-of-carabiners-for-hauling-systems-and-pulley-attachment/mousquetonsV2-pe13-mouflages_SPO_a77w0000000Gmw1AAC.html

### 2.4 拖包重量

50. **SuperTopo（McNamara 2017）[opened via Exa]**："water is the heaviest item in the haulbag … If a team is able to climb a route in one fewer day you save 20 pounds! (20 = 2 pounds of food + 8 pounds of water multiplied by two people)" → 每人每天 8 lb 水 ≈ 3.6 L（換算是本檔加的），和本站 big-wall 文「每人每天 3–4 公升」一致。
51. Petzl：建議拆成 30–40 kg 幾包，而不是一包 80 kg（#31）。Kirkpatrick：三人隊 "I think you could easily hit 200 kg"（#39）。Kirkpatrick 自己 Troll Wall 獨攀 "using roughly two litres a day"（https://andy-kirkpatrick.com/blog/view/hauling_hauling_hauling [opened]，個人數字，不是建議值）。

---

## 3. 器材規格（2026-10-24 原廠頁）

### 3.1 止退滑輪 [prior，見 .work/aid-climbing-gear/R-gear.md §6；本次重開核對 Micro／Pro 頁]

| 型號 | 重量 | 效率 | 繩徑 | 強度 | 本次核對 |
|---|---|---|---|---|---|
| Petzl NANO TRAXION | 53 g | 91 % | 7–11 mm | 止退破斷 4 kN；滑輪 15 kN | prior；TW 特價 NT$3,040（https://www.petzltw.com/products/nano-traxion [opened]） |
| Petzl MICRO TRAXION | 85 g | 91 % | 7–11 mm | 止退工作 2.5 kN／破斷 4 kN；滑輪工作 5 kN／破斷 15 kN | [opened] https://www.petzl.com/int/en/sport/products/progress-capture-pulleys/micro-traxion/MICRO-TRAXION_SPO_a2mw0000000HePgAAK.html ："designed for crevasse rescue, hauling, and self-rescue, and for use as an emergency ascender"；TW NT$3,980 [opened] |
| Petzl MINI TRAXION | 150 g | 93 % | 7–11 mm | 2×2.5 kN 工作 | prior |
| Petzl PRO TRAXION | 295 g | 95 % | 8–13 mm | 止退破斷 4 kN；滑輪 11.5×2=23 kN；滑輪徑 38 mm | [opened] https://www.petzl.com/us/en/operators/products/progress-capture-pulleys/pro-traxion/PRO-TRAXION_OPE_a2m68000000PBIuAAO.html ："Designed for hauling heavy loads"、"Drop-resistant … Triple-action opening"、"Red indicator provides a visual warning when the moving side plate is unlocked"、"Swivel allows pulley to be oriented under load"；TW NT$7,300 [opened] https://www.petzltw.com/products/pro-traxion |
| Edelrid SPOC | 60 g | 92 % | 7–11 mm | 破斷 15 kN | [opened] https://edelrid.de/en/sports/pulleys/spoc.html ："Designed for lifting loads, crevasse rescue operations, or as an emergency ascender"；"will work even with icy or muddy ropes" |
| 「TRAXION」單獨型號 | — | — | — | — | 沒有現行產品頁（prior 結論，本次未再找到） |

PUR LINE 2024+ 認證把 RAD LINE 6 mm 納入 Micro／Nano（prior，Micro FAQ）。PUR LINE 頁列 Micro／Nano／Tibloc 可用於拖包（#7）。

### 3.2 Swivel

| 型號 | 重量 | 強度 | 價格 | 來源 |
|---|---|---|---|---|
| Petzl SWIVEL S | 95 g | 破斷 23 kN；工作 5 kN；CE、EAC、NFPA 2500 | USD 79.95（Tactical 頁搜尋摘要）；TW NT$3,000（S）／NT$3,700（L），§6.11 已確認 SKU 對應 | [opened] https://www.petzl.com/us/en/sport/products/accessories-for-anchors/swivel-s/SWIVEL-S_SPO_a2mw0000000HfRdAAK.html ："Positioned between the rope and the load, the swivel allows the load to turn without twisting the rope."；"Ball bearing swivel"；TW https://www.petzltw.com/products/swivel [opened] |
| Petzl MICRO SWIVEL | 75 g | 23 kN | TW NT$2,750 | [opened] https://www.petzl.com/us/en/tactical/products/swivels/micro-swivel/MICRO-SWIVEL-TACTICAL_MIL_a2mw0000000QRjRAAW.html ："Compact openable swivel … design without bearings allows it to turn freely when not loaded and to stop moving when loaded" → 不是滾珠軸承，用途偏定位；拿來掛拖包是 Alpinesavvy 的提議（"I haven't tried these"），不是原廠用途 |
| BD Rotor | 83 g | 26 kN | USD 79.95 | [opened] https://www.blackdiamondequipment.com/products/rotor ："The essential anti-twist device for big-wall hauling."、"Enclosed bearing for smooth operation" |
| Kong DANCER | 160 g | "Load - 42kN" | USD 81.95 | [opened] https://kongusa.com/products/dancer ："prevents ropes from twisting during the suspension of a load. Smooth movement at high loads thanks to the ball bearing." |
| CAMP Gyro | — | — | — | [not opened]（只看到零售商搜尋結果） |
| DMM 旋轉環召回 | — | — | — | [opened] https://dmmwales.com/pages/important-safety-notice-product-recall-dmm-compact-swivel-units ："a near-miss incident involving the failure of a DMM Director connector (A647BS) that parted at the swivel assembly"、"may allow the swivel assembly to unscrew and subsequently part"、"Stop using any of the above items immediately"。英國政府召回頁 2022-11（gov.uk 2211-0021，[not opened]，只見搜尋標題）。Alpinesavvy rigging 101 推薦的 DMM Director Swivel Boss 正是召回對象之一 → 文章若提 DMM 旋轉環要附召回。 |

### 3.3 拖包

| 型號 | 容量 | 重量 | 價格 | 來源與原文 |
|---|---|---|---|---|
| BD Wall Hauler 40 | 40 L | 1.99 kg | USD 219.95 | [opened] https://www.blackdiamondequipment.com/products/wall-hauler-40-haul-bag ："TPU-coated body fabrics"、"Redesigned rim to reduce snagging while hauling"、"Off -set handles, and a roll-top closure make for easy access when the bag is rigged up" |
| BD Wall Hauler 70 | 70 L | 2.46 kg | USD 259.95 | [opened] https://www.blackdiamondequipment.com/products/wall-hauler-70-haul-bag |
| BD Wall Hauler 140 | 140 L | 3.11 kg | USD 319.95 | [opened] https://www.blackdiamondequipment.com/products/wall-hauler-140-haul-bag （另有 125 L 頁，未開） |
| Metolius Sentinel／Quarter Dome／Half Dome／El Cap | 46／69／125／157 L | 2.1／2.3／3.4／3.6 kg | USD 189.95／219.95／279.95／299.95（§6.10 由 Shopify .js 確認逐型號價格） | [opened] https://metoliusclimbing.com/products/haul-bag ："Durathane™, which is 10 times more abrasion resistant than the vinyl-coated nylon"、"offset haul points"、"suspension system that tucks away in seconds for hauling"。容量與型號的對應原本依列出順序推定，§6.10 已由頁面 Specs & Details 確認；零售商標題「Quarter Dome 69L」「Half Dome 125L」吻合。 |
| Fish（Budget／Deluxe／Grade V；Atom Smasher 小包） | Grade V 84 L；Atom Smasher 加領口 51 L | — | USD 99–199（頁面未標日期，價格可能過時） | [opened] http://fishproducts.com/catalog/haul_bags.html ："Never use a biner as a pulley while hauling unless you are forced into it."；"If it is really dumping rain … punch a hole in the bottom … for drainage." |
| Petzl BUG（多繩距攀登包，非拖包） | 18 L | 665 g | — | [opened] https://www.petzl.com/us/en/sport/products/climbing-packs-rope-bags/bug/BUG_SPO_a2mTx000003PXGnIAO.html |
| BD Touchstone／Stubby | 舊 URL | — | — | [not opened]（BD 舊式 URL，現行型錄似已換成 Wall Hauler；WeighMyRack 2018 用 35 L Stubby） |
| Petzl PORTAGE | 30 L | — | — | [not opened]（只見零售商；是洞穴運輸袋） |

### 3.4 拖繩／tag line

- Petzl PUR LINE 6 mm：見 #7（HMPE、EN 564、<2 % 延伸、20 g/m、65 m 1.3 kg；TW 65 m NT$11,500，§6.11 已確認）。
- Beal BACK UP LINE 5 mm：芳綸+尼龍，21 g/m，ultra-static，見 #12。
- Maxim Personal Escape Rope、Sterling、Edelrid Rap Line：[not opened]（只見搜尋結果）。
- 大岩壁拖繩直徑：McNamara 8／9.5／10 mm static（#46）；Flower 9.8 mm static 60 m（#32）；Kirkpatrick 9.7–11 mm dynamic 或 10–11 mm static 為多數岩壁標準（#8 同頁）。

---

## 4. 事故、警告、強度

52. **4 kN 原則 [opened]** Kirkpatrick〈Advanced Hauling〉："no ascender or cam should be exposed to any loading above 4kN (407 kg), as doing so will first strip the sheath from the rope, and then cut the rope itself."；Petzl 原廠：Micro／Nano／Pro Traxion 止退破斷都是 4 kN（§3.1）。
53. **HowNOT2 [prior]**（.work/aid-climbing-gear/R-videos.md #4）：XcDa2wESs7o（2025-12-03）200 lb 石頭掛 Micro Traxion，無鬆弛約 2 kN 沒事；FF1 **4.67 kN** 外皮被扯掉、斷兩股芯（說明欄數字；樣本少；EDELRID 贊助）。R-videos-2024.md：DHgozZxLbyo（2024-07-10）Micro Traxion 被卡住齒張開、滑到備份結，峰值 4.85 kN。
54. **Pro Traxion 使用錯誤 [opened]** Kirkpatrick："not locking closed a two-part pulley (like the Pro Traxion), leading to it opening under load, having the pulley upside down (a classic Pro Traxion error)"；備份："Use a karabiner to keep the hauler locked together (clipped into the bottom of your Pro Traxion), and also clip a draw (ideally a locking draw) from the masterpoint to the rope."（Flower 也說 "Some devices need to be locked by clipping a non-locking carabiner through the lower connection point"）
55. **齒被卡開 [opened]** VDiff："toothed catch becoming wedged open … usually happens because something got stuck in it or there was a weighted rope pinching it into the rock"；Alpinesavvy rigging 101："If the Traxion cam were to open up on some rock nubbin when you're hauling, this backup knot prevents you from losing your haul bag."；Petzl 說明書 [prior]："when the cam appears to be noticeably outside the body of the device, the progress-capture function is disabled."
56. **短距離下放 [opened]** Petzl〈Short lower of the load during hauling〉https://www.petzl.com/us/en/sport/tech-tips-by-product/rescue/short-lower-of-the-load-during-hauling/MICRO-TRAXION---sport-5---Descente-courte-de-la-ch_SPO_a77w0000000KysIAAS.html
    > "A short lower should be done by simply lifting the cam, without deactivating the progress-capture function."
    > "Warning: be sure you can hold the load before lifting the cam … add some friction or make a knot in the rope where it exits the haul system"
    > "Warning: do not push on the button to avoid accidentally deactivating the progress-capture function."
    （這頁在 Petzl 的 rescue 分類，對象是傷者，不是拖包；套用到拖包是本檔推論。）
57. **動力繩當拖繩** Kirkpatrick（The Haul Line）：動力繩 "reduce the efficiency of the haul system"，但包脫落時 "the shock load on the belay will be far more forgiving"；Achey 反對用細動力雙繩當 tag line（#6）。
58. **拖繩斷、counterweight 墜落** 見 #39（Kirkpatrick 轉述，原因他自己標為推測）。
59. **NPS Yosemite [opened]** https://home.nps.gov/yose/planyourvisit/climbing_regulations.htm
    > "It is illegal to throw anything off a cliff in Yosemite."
    > "Haul bags thrown from the wall have nearly struck climbers on the ground (really) and have been mistaken for falling climbers multiple times."
60. **手指被滑輪夾** → **沒有找到**任何來源。Petzl 本次讀到的頁面沒有這條警告；不要寫。
61. **「拖包同時確保 = 危險」** → **沒有找到**原廠或協會原文（見 #30）。

---

## 5. 沒找到／沒打開（不要寫成事實）

- BD 官方「how to haul」教學：沒有找到（BD 只有產品頁）。
- REI Expert Advice 的拖包文章：沒有找到（只有 REI 部落格 big wall 生活文，未開）。
- AMGA 拖包技術：沒有找到（只有課程頁）。
- Kirkpatrick《Higher Education》書本：沒打開，引言經 Alpinesavvy 轉引。
- SuperTopo space haul 的危險清單：網頁只寫 "Read the rest of this chapter in the … book"，沒讀到。
- Alpinesavvy〈Foot haul〉的 Tibloc 版本、超過體重的 1:1：在付費牆後，沒讀到。
- Petzl PUR LINE 影片頁：只有影片（YouTube wYRd6WUBBCo，2023-10-24），沒有文字步驟；影片內容沒看。
- CAMP 旋轉環、Maxim／Sterling／Edelrid 細繩、BD Stubby／Touchstone、Petzl Portage：沒打開原廠頁。
- Beal BACK UP LINE 破斷強度數字：欄位存在但沒擷取到數值。
- Metolius 各型號價格：頁面只抓到一個 USD 189.95，對不到型號。
- 台灣通路價：只有 petzltw.com 官網；PUR LINE、SWIVEL 的尺寸與價格配對原為推定，§6.11 已確認。
- 「繩對繩摩擦（拖繩 vs 先鋒繩）」專文：沒找到。
- 「手指夾進滑輪」警告：沒找到。
- TAKEMOVIE 瑞牆〈秋一番〉影片：brief 提供的時間碼，本檔沒有重看。

---

## 6. 補查（第二輪）

補查日期：2026-10-24。逐項重跑整條抓取鏈，並另外找公開副本（Wayback、archive.ph、Google Books、Amazon、原廠 PDF 說明書、Shopify／CYBERBIZ 商品資料、YouTube 字幕或抽幀）。

### 6.0 本輪工具狀態（toolDegradation）

- (1) Groundlane MCP：ToolSearch "groundlane" 只回 `authenticate`／`complete_authentication`，沒有 web_search/web_fetch → 不可用（要使用者 OAuth）。
- (2) Groundlane 直接 HTTP：`POST /mcp tools/list` → HTTP 401。
- (3) Keenable keyless：可用，本輪主要搜尋都走這條。
- (4) You.com keyless：`POST api.you.com/mcp?profile=free tools/list` 有回應（工具 you-search），本輪沒有需要用到；GET 回 405。
- (5) Exa：web_search_exa 可用（Kirkpatrick 引文、CAMP Gyro1、Petzl PORTAGE、拖包同時確保等都靠它找到）；web_fetch_exa 對 SuperTopo 回維護頁、對 Petzl 舊網址回 CRAWL_NOT_FOUND。Tavily：主線程查詢回 HTTP 429（請求過多）；6.3a 協會盤點時同一工具可用，跑了 9 次限定網域查詢。jina（r.jina.ai）：可用，SuperTopo 原頁的快取就是從這裡拿到的；CAMP 官網是 JS 單頁應用，jina 回 "Page not found"。linkup、firecrawl：本 session 沒有這兩個工具。
- (6) 內建 WebFetch：已載入，本輪沒有用到（curl 加瀏覽器 UA 已經拿得到內容）。
- 其他：Wayback CDX 在 Alpinesavvy 那次查詢可用（快照 20250920000150），之後兩次都回 "Internet Archive: Temporarily Offline"；`archive.org/wayback/available` 回 429。archive.ph `newest/` → 404（沒有存檔）。Google Books API → "Quota exceeded … Queries per day"；`books.google.com/books?vid=ISBN9781999700597` → 404。yt-dlp 可用（字幕、360p 影片下載都成功）；ffmpeg 抽幀可用。

### 6.1 BD 官方拖包教學 → **partial（確認 BD 沒有教學文；有政策性的一句話）**

- [opened] https://blackdiamondequipment.com/blogs/stories/the-yosemite-rack
  > "There is a lot of information out there about hauling setups, which require specialized gear, so we're not going to get into the weeds on that stuff here."
  > "Haul bags, a haul line, and a swivel are all necessary for a smooth vertical …"
- [opened] BD 站內文章搜尋 https://blackdiamondequipment.com/search?q=hauling&type=article → "1 result found"，唯一結果是〈QC LAB: FULL STRENGTH HAUL LOOPS〉（https://blackdiamondequipment.com/blogs/stories/qc-lab-full-strength-haul-loops ，2016-09-07）：
  > "Haul loops on harnesses are made for exactly that reason—to tag or haul a line … that haul loop only needs to be able to withstand the weight of a tagline (a few pounds)."
  > "you should never be tying in with the haul loop, belaying off the haul loop, anchoring in with the haul loop … The haul loop is for hauling, plain and simple."
- [opened] https://blackdiamondequipment.com/blogs/stories/how-to-choose-a-climbing-harness
  > "If you're climbing big walls or multi-pitch routes, you'll probably want a harness with a haul loop, or at least a fifth gear loop in the back so you can clip a tagline or a haul line to your harness."
- [opened] https://blackdiamondequipment.com/products/rotor ："The essential anti-twist device for big-wall hauling."
- BD YouTube：`ytsearch8:"Black Diamond Equipment how to haul big wall"` 只回 HowNOT2、EpicTV、Shane Borza、WeighMyRack，沒有 BD 官方頻道的拖包教學片。
- Wall Hauler 說明書 PDF：沒找到（Keenable 搜 "Black Diamond Wall Hauler instructions pdf" 只回產品頁）。
- 結論：BD 官方的拖包資訊只有產品頁、吊帶拖繩環說明、Yosemite 器材清單；BD 自己明說不在該文談拖包系統。

### 6.2 REI Expert Advice → **still not found**

- Keenable："REI expert advice big wall climbing hauling"、"REI expert advice how to haul a bag" → 只有 REI〈Climbing Rack Basics〉〈How to Choose Climbing Ropes〉〈How to Pack and Hoist a Backpack〉（背包上身，不是攀岩拖包）、REI 部落格〈Big Wall Climbing: The Realities of Vertical Camping〉（生活文）。
- YouTube：`ytsearch8:"REI big wall climbing hauling"` 沒有 REI 頻道結果。
- Exa：搜拖包教學時 REI 沒有出現在結果裡。Tavily：429。Groundlane：401／只有 authenticate。jina／WebFetch：沒有可以抓的目標網址。
- 結論：REI Expert Advice 目前沒有拖包教學。

### 6.3 AMGA 與各國嚮導協會、山岳會 → 見 6.3a（依協調者要求擴大範圍）

#### 6.3a 協會／山岳會拖包教材盤點（AMGA + IFMGA 會員協會 + 各國山岳會）

判準：教「拖背包／haul bag」才算 found；救援拉升（3:1 raise、Flaschenzug、mouflage、hoisting）只算 related。工具：Keenable 64 個查詢、Tavily（限定網域）9 次、Exa 8 次、yt-dlp 14 個搜尋，另外把 AMGAUSA（103 支）、BMC TV（884 支）頻道的完整影片清單拿來 grep。Groundlane 不可用（401）。原始查詢與結果在 scratchpad `gaps/assoc/`。

**found（有實際技術教學）**
- **bergundsteigen**（ÖAV／DAV／SAC／AVS 合辦的期刊；DAV、ÖAV、SAC 的拖包技術內容實際上都在這裡）
  - [opened] 〈Die Tagline – wie haule ich richtig?〉Gebi Bendler，2021-12-09，https://www.bergundsteigen.com/artikel/die-tagline-wie-haule-ich-richtig-tipps-von-babsi-zangerl-jacopo-larcher/ （Babsi Zangerl、Jacopo Larcher 談阿爾卑斯多繩距）：
    > "Meistens klettern wir mit Einfachseil und haulen mit einer Tagline, das heißt wir ziehen einen Rucksack bzw. meist unseren Haulbag mit einer dünnen statischen Hilfsleine nach."
    > "Ein leichterer Rucksack lässt sich händisch, also nur mit einer Micro Traxion und ohne Jumar und Beinschlinge nach oben ziehen."
    > "Also am besten eignet sich ein Haulbag. Denn der ist viel robuster als ein Rucksack."
  - [opened] 〈How to Bigwall (2/3): Richtig Haulen〉Thomas Wanner、Ben Lepesant，2022-12-15，https://www.bergundsteigen.com/artikel/how-to-bigwall-2-3-richtig-haulen/ ：
    > "Wer schon mal in den Alpen einen Rucksack die Wand entlang- geschleift hat, weiß, wie lang es dauert, bis vom Rucksack nicht mehr viel übrig ist."
    > "Man sollte den Haulbag am Stand immer redundant festmachen, auch wenn er nicht runterfallen kann. Wenn er's doch tut, ist die Klettertour im besten Fall vorbei, im schlimmsten Fall ist der Vorsteiger tot"

**related only（只有救援拉升、名詞定義或一句敘事）**
- **AMGA**：SPI Program Handbook Edition 4（2026，https://cdn.shopify.com/s/files/1/0876/5174/6093/files/AMGA_Single_Pitch_Instructor_Program_Handbook_Edition_4_2026.pdf ）寫 "3:1 raise, 3:1 assisted raise, releasable rappel set-up"。SPI 考試情境（provider 轉載）寫 "Provide assistance using a 3:1 hauling system."，指的是拉客戶，不是拖包。AMGAUSA 頻道唯一沾邊的是〈Crevasse Rescue: Hauling〉（冰河救援）。amga.com 的 Rock Guide、MPI 課程頁 grep haul／pack 都零命中。
- **BMG（英國）**：Training Scheme Handbook（2022-12-02）只有 "Hoisting and crevasse rescue"。
- **JMGA（日本山岳ガイド協会）**：《技術教本（第1.5版）》目錄有「９．メカニカルアドバンテージ（M/A)システム」，但沒有荷上げ或ホーリング章節。教本要付費，M/A 章有沒有談到拖包無法確認。
- **DAV**：alpenverein.de〈Alpinrucksäcke〉（2020-07-14）只是背包功能清單裡的定義："Laschen zur Verwendung als Haulbag (= Materialsack zum Nachziehen bei schweren Klettertouren)"。Alpin-Lehrplan 是付費書，沒有線上全文。
- **SAC**：sac-cas.ch 人物報導裡一句 "Er rackert sich ab und zieht den schweren Haulbag nach."（敘事，不是教學）。
- **CAI**：La Rivista 2004 年 7–8 月號（https://www.cai.it/wp-content/uploads/2007/12/La_Rivista_Luglio_Agosto_04.pdf ）的路線描述："bisogna quindi legarlo ad una corda e farlo issare in alto dal primo"。
- **FFME**：Roc Aventure 營隊（2021）列 "poser des protections, hisser un sac, s'organiser dans un big wall"；ENAM 頁寫 "hissages lourds sur relais sur coinceurs"；FFME YouTube〈Stage escalade artificielle pour l'ENAF〉（2V_I3v2qKak，2022-11-03）說明欄有 "hissage de sac"，但片子是活動剪輯，沒有教學口白。
- **NZMGA**：Technical Syllabus 只有 "lowering and raising" 這類救援項目。
- **Mountain Training UK**：MCI 手冊只有 "abseiling, lowering, hoisting"（救援）；RCI 不涵蓋多繩距。

**nothing（用當地語言 + 英文，Keenable + Tavily/Exa 都查過）**
- **ACMG**：Scope of Practice PDF（https://acmg.ca/app/uploads/2025/10/ACMG_SOP_2022.pdf ）grep haul 零命中；ACMG Technical Handbook 是付費書。
- **SBV／ASGM**：Modul Mehrseillängenrouten 2023 PDF（https://sbv-asgm.ch/wp-content/uploads/KL-Mehrseillaengen_2023.pdf ）grep haul／hiss／nachzieh／Rucksack 都零命中。
- **ENSA／ENSM**：嚮導課程頁與 cursus PDF 沒有 hissage。
- **VDBS**、**奧地利嚮導協會（VÖBS）**：只有招生頁、組織架構頁。
- **ÖAV 自家網站**：沒有（拖包內容在 bergundsteigen）。
- **BMC**：〈Top tips for your first multi-pitch adventure〉、〈Tech skills: gear for alpine rock〉grep haul 零命中；BMC TV 884 支影片裡沒有拖包教學。
- **UIAA**：〈Mountain Skills: what gear to bring – single and multi-pitch〉grep haul 零命中。
- **日本山岳会（JAC）**、**JMSCA**：查到的「荷上げ／荷揚げ」都是遠征運補，不是拖包。

**AMGA 本項結論**：AMGA 沒有公開的拖包教學；AMGA 文件裡的 "hauling system" 指 3:1 救援拉升。寫文章時不要把它引成拖包來源。

### 6.4 Kirkpatrick《Higher Education》→ **partial（書沒打開；引文確認同一段經 Alpinesavvy 4 篇轉引，另找到 Kirkpatrick 本人 3 篇拖包文）**

- 書本身：Google Books API "Quota exceeded"；books.google.com ISBN 頁 404；Amazon 商品頁（https://www.amazon.com/Higher-Education-Big-Wall-Manual/dp/1999700597 ，HTTP 200）抓到的 HTML 沒有試閱內文；Exa 和 Keenable 搜 "great white shark" + haul 只回 Alpinesavvy 轉引。Tavily：429。
- Kirkpatrick 官網書頁 [opened] https://andy-kirkpatrick.com/shop/view/higher-education ："Publication date: 01 May 2018 … Print length: 478 pages"；"Key topics include: … Hauling systems, counterbalance, and load management"。
- 引文全文（Exa 抓到的 Alpinesavvy〈Haul bag rigging 101〉2022-08-25、〈The 2 to 1 Z pull〉2018-12-18、〈Riding the Pig〉2026-02-16、〈Convert a 1:1 to a 3:1〉2019-01-05，四篇文字完全一樣，後兩篇明寫出自《Higher Education》）：
  > "Hauling is potentially one of the most dangerous aspects of big wall climbing. This translates to ultra-caution in all parts of your hauling system and interaction with bags, haul lines, docking cords, and pulleys. If you rush and make a mistake, drop a load or have it shift where it's not wanted, you could easily kill someone or yourself. I try and teach climbers to view their bags as dangerous creatures, like a great white shark, rhino, or raptor that is in their charge. The ability to keep them calm and under your control comes down to paranoia, foresight, and heavy respect for the damage they can do."
  → 寫進文章時標成「Kirkpatrick《Higher Education》，經 Alpinesavvy 轉引」。
- 新找到 Kirkpatrick 本人寫的多繩距背包拖包文（比大岩壁書更貼近本文主題）：
  - [opened] https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies （〈Hauling Your Rucksack〉，2008-12-04；站方註明 "All of these articles are decades old … references to gear are now seriously outdated"）
    > "Hauling should be avoided where possible. More often than not it turns into a time-consuming nightmare, requiring more effort than simply climbing with the thing on your back."
    > "Make sure no hard objects are pressing directly against the fabric, as they'll grind a hole through it in seconds."
    > "Clip the hip belt back around the body of the pack—buckles love getting wedged in cracks"
    > "Always connect the rope to the rucksack with a locking karabiner—or two opposed karabiners"；"Keep any knots as close to the 'sack as possible to minimise abrasion"
  - [opened] https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies1 （〈Rucksack Hauling Strategies〉，2008-12-04）：三種方式 Standard／Assisted／Protected haul。
    > "if there's a chance it'll get stuck it probably will"；"Don't be tempted to start yarding on it to dislodge it, as this could send a block down onto your mate's head."
    > "the 'sack may dislodge rocks as it rises, which may well strike the second — or their rope (often a single skinny rope)."
    > Assisted haul："the second does most of the hauling rather than the leader … ideal for slabby or complex ground"
    > Protected haul："The second remains tied into both ropes, attaching the 'sack a metre or so higher up one of the ropes"
    > "the best advice for 'sack hauling is to make sure you're strong enough — and your 'sack is light enough — that you don't need to haul it in the first place."
  - [opened] https://andy-kirkpatrick.com/articles/view/the_haul_line ：大岩壁拖繩選擇（"Thick static ropes are ideal for heavy use, fixing, and serious hauling."）。

### 6.5 SuperTopo／McNamara space hauling 危險清單 → **still not found（確認清單只在書裡）**

- [opened via jina] https://r.jina.ai/http://supertopo.com/a/How-to-Big-Wall-Climb-Hauling-Managing-the-Belay-The-Changeover/a10574n.html （jina 快取；SuperTopo 原站 curl 和 Exa 都回 "Site Temporarily Unavailable"）：
  > "Space hauling is the most efficient way to use your body as a counterweight. To do this you need two Ascenders and a hauling device like a ProTraxion."
  > "1) When you are setting up the anchor, make sure to pull up at least 20 feet of slack before fixing the rope. This way you have a 20+ foot leash."
  > "**Warning: Space hauling is dangerous if done improperly.** Here are some things that can go wrong... Read the rest of this chapter in the How to Big Wall Climb SuperTopo book"
- 各工具失敗紀錄：Groundlane（只有 authenticate／HTTP 401）；Keenable 搜 "Space hauling is dangerous if done improperly" 只回同一頁；Exa web_fetch → 維護頁；Tavily → 429；Wayback CDX → "Temporarily Offline"（兩次），availability API → 429；archive.ph → 404；Google Books → 額度用完；內建 WebFetch 沒用（原站在維護）。
- 替代來源：Kirkpatrick〈Advanced Hauling〉[opened] https://andykirkpatrick.substack.com/p/advanced-hauling （2021-06-01）列了 space haul 的風險：
  > "In the 'Safety fifth' approach, you trust all your gear without question … Here you will not bother backing up your pulley, or give the dead weight counterbalanced climber a back-up rope"
  > "make sure the rope you're clipping into to space haul is the correct rope, and in the correct orientation. The idea of clipping into the end of a haul line, so you just fall to your death, might sound stupid, but when it's 1 am … it can end all too easily."
  > "no ascender or cam should be exposed to any loading above 4kN (407 kg), as doing so will first strip the sheath from the rope, and then cut the rope itself."

### 6.6 Alpinesavvy〈Foot haul〉付費段落與 Barghahn 影片 → **partial（付費段沒讀到；原始影片字幕全讀）**

- 付費段：live 頁與 Wayback 快照（[opened] https://web.archive.org/web/20250920000150id_/https://www.alpinesavvy.com/blog/foot-haul-your-pack-on-a-multi-pitch ）內容相同，兩者都停在：
  > "How do you manage the extra haul rope? How can you set this up with Tibloc instead of a second PCP? … How about a video of a way to 1:1 haul a load that weighs more than you do? Join my Premium Membership to learn all this in the complete article."
  公開段有："This tip was inspired by a YouTube video (link below) by Brent Barghahn, professional climber and founder of Avant Climbing Innovations."；"Gear you need for a foot haul: Two progress capture pulleys (PCP), such as a Petzl Micro Traxion (or a Tibloc) A few extra carabiners 60 cm (single length) sling"；"Check to see that it's rigged 'teeth to tail', so it pulls correctly."
  Tibloc 版、超過體重的 1:1 → 還是沒讀到（付費牆；Wayback 也一樣）。
- 原始影片 [opened，字幕全讀] Brent Barghahn〈Efficient Foot Hauling: Dealing with your Multi-Pitch Climbing Baggage〉https://www.youtube.com/watch?v=VmN-jcHG7hI （上傳 2023-06-07，5:32；章節 0:36 The Gear／0:52 Setting it Up／2:46 Live Action Hauling／3:34 Tag Line Management）。步驟（字幕原文）：
  - 領攀者拖著 tagline，帶 "two progress capturing pulleys … and one of them has a sling to stand in"。
  - 到確保站："I set up the slingless progress capture pulley so that it hauls through in One Direction … I clip that pulley to the Anchor itself whether a chain or a ring"；"I clip the tagline tail to one side of the anchor … ready for a redirect"。
  - "pull all the slack through until I hit the bag and I yelled down 'haul is on' to my partner and they can release the bag"。
  - 第二個 PCP 裝在自由端、掛扁帶踩："you can see this is not very ergonomic … using the [carabiner] that was on the tail of the tagline I redirect and create a more ergonomic setup"；"while I'm pushing down the Rope is just passing through my hands … I could even switch feet … all the while I'm saving my arms for the next pitch"。
  - 拖繩管理（對應 Alpinesavvy 付費段的 "manage the extra haul rope"）："stack the tagline … just like I'm coiling a lead rope … starting from the bag side"；"I unclip that tail just to avoid any tangles"；"stack all the tagline in a dedicated Alpine draw … the key here … is to not cinch it … the tagline is loose enough to feed out as the leader climbs off"。
  - 重量："with a foot haul system like this you can even carry up to maybe 30 pounds in your bag pretty comfortably"；"it's also advantageous to combine with fixed and following tactics because your follower can even be climbing while you're doing all this hauling"；"I'm no guide but I have a lot of hard-earned experience"。
- 同一人另一支 [opened，字幕全讀] Avant Climbing Innovations〈How to Solo Haul for Multipitch Projecting〉https://www.youtube.com/watch?v=VoCdbU2l4Z8 （2024-11-07，8:30）：40 m 5 mm tagline + fifi hook 自己放包；警告：
  > "what you don't want is the droop of the tag line to get under the bag and Tangle and either pop early or pull against itself"
  > "this is not a great tactic for a busy route or when there's people below you … you do risk popping the Fifi hook … and plummeting your bag to the end of your tagline with your tagline attached to your harness which maybe your gear Loop will blow"
  > "I've got a quick draw for backup so I don't plummet my bag"

### 6.7 Petzl PUR LINE 影片 wYRd6WUBBCo → **found（抽幀讀燒錄字幕）**

- [opened] https://www.youtube.com/watch?v=wYRd6WUBBCo ：頻道 Petzl Sport，標題 "#PetzlTips - Raising the haul bag on a multi-pitch route with a PUR LINE"，**上傳日期 2023-06-27**（yt-dlp info.json），長 6:01。沒有 CC 字幕檔（subtitles、automatic_captions 都是空的），英文字幕燒在畫面上 → 360p 下載後每 6 秒抽一幀（60 幀）讀字幕。說明欄：
  > "On very vertical multi-pitch routes, hauling your pack allows you to climb with less weight and stacks the odds in your favor to send the pitch. @symon9v shows us the basics of setting up a haul bag and shares a few tips on how to be more efficient."
- 步驟（畫面字幕原文，時間為抽幀位置約略值）：
  1. 器材（0:00–1:10）："Today we're going to talk about hoisting a bag." / "We'll need a hoisting rope, a very thin and very light static rope" / "We'll also need a hoisting bag, of course." / "We'll have a quick link that will remain stationary" / "which will prevent the rope from twisting too quickly." / "which is detachable, so we'll be able to open or close it to access the bag." / "a TRAXION pulley to hoist the bag." / "we may need a second TRAXION pulley"。
  2. 出發前（1:12–2:20）：把 PUR LINE 預先穿進 TRAXION，"And to secure it, I tie a overhand knot here." / "My hoisting system is ready to be attached to my harness." / "you'll need at least enough rope" / "Then, we will try to leave as much of the rope as possible" / "so we'll be able to loosen it or use it if there's a traverse." / 繩端連包用 "or a bowline knot, which is quite handy." / "We'll hook it up"。
  3. 到站（2:24–3:30）："so we're going to hoist the bag." / 把 TRAXION "install it on the belay station." / "I'll pull the hoisting rope" / "We have to be careful to secure the rope properly at the belay … Just like with my tethering rope, on my belay stance, like this, to secure the rope." / "pull in the hoisting rope until I reach the bag." / "At that point, the second will release the bag." / "And I can start hoisting the bag."（畫面：下方確保者從站上解開包）。
  4. 包卡住（約 3:36）："… in a crack or a spike or whatever."（前一句字幕在抽幀間隔內沒抓到）。
  5. 第二種方式（3:48–4:20）："The second option, is to install a NANO TRAXION at my tie-in loop, where I'm going to get the hoisting rope and it will allow me to use my body weight. This way I can pull the rope, the bag to bring it up."
  6. 第三種方式（4:30–5:00）："One last solution would be to install a directional point. Then I will have even more power" / "This allows me to hoist my bag" / "So when I use this option, Most importantly, I'm using a dynamic lanyard"（畫面：用身體下坐，人掛在動力繩 lanyard 上）。
  7. 收尾（5:00–6:00）："I hoist the bag until it reaches the belay station." / "I take the sling I'd installed" / "At this point, I'll take the tension off my pulley to put the bag under tension on the sling." / "to prepare for hoisting in the next pitch" / "So I'm going to remove the pulley from the carabiner, remove the rope and pick up the rope by the knot." / "… by the next climber."
- 更正：本檔 §來源日期總表與 §5 寫的「2023-10-24」是錯的，YouTube 上傳日是 **2023-06-27**。

### 6.8 原廠頁：CAMP Gyro、Maxim／Sterling／Edelrid 細繩、BD Stubby／Touchstone、Petzl PORTAGE

- **CAMP GYRO1 → partial（官網打不開；零售商轉貼原廠規格且彼此一致）**。camp.it／camp-usa.com 是 JS 單頁應用，curl 只拿到空殼（1,291 bytes），jina 對猜的產品網址回 "Page not found"；Exa 限定 camp.it 也只回零售商。零售商頁（Exa 讀）：
  - https://www.climbinganchors.com.au/c.a.m.p.-gyro1 ："Working load limit: 5 kN. Minimum breaking strength: 25 kN. UPDATE 2024: working load limit (WLL) increased from 3 to 5 kN."；"Weight: 76g"。
  - https://www.skyman.cz/en/p/camp-gyro1-swivel ："Certification: CE PPE-R/11.135, ANSI Z359.12, EAC"；"Uses: Rope access, tree climbing, professional rescue, confined spaces"。
  - 注意：舊頁面（fletcherstewart、rope-master）還寫 WLL 3 kN，引用時要用 2024 後的 5 kN。產品定位是高空作業／救援，不是攀岩拖包專用。
- **Maxim Personal Escape Rope → found** [opened] https://shop.maximropes.com/products/personal-escape-rope
  > "MAXIM® has created a 7mm Personal Escape Rope. Its stiff 100% nylon construction is engineered for use as a haul line or tag line as well as a small rappel rope"
  > "Our amazing MAXIM teammates swear by this personal escape rope for hauling bags on big walls and as a tag line"
  規格表：7 mm、32.7 g/m、MBS 1175 daN／2650 lbf。價格（Shopify `.js`）：130 ft USD 178.00／200 ft USD 267.00／660 ft USD 888.00。
- **Sterling 6 mm TRC Tag Line → found** [opened] https://sterlingrope.com/6-mm-trc
  > "The 6 mm TRC is a high strength specialty cord that features a Technora sheath and nylon core. Designed for high strength and low-elongation applications such as personal escape, rappels, or haul systems."
  MBS 3,484 lb／15.5 kN；27.6 g/m；"MSRP … $402.99 - to $460.99"。
- **Edelrid RAP LINE PROTECT PRO DRY 6 mm → found** [opened] https://edelrid.com/eu-en/sport/ropes/rap-line-protect-pro-dry-6mm
  > "we were able to increase the maximum tensile strength to more than 10 kN, while simultaneously reducing the weight to 31 g/m."
  > "Suitable for hauling equipment or abseiling, thanks to the low elongation values"；"Certification: EN 564"；"Sharp edge approved"。
- **BD Stubby／Touchstone／Zion → found（已停產）**：BD 官網 `/products/stubby-haul-bag`、`/touchstone-haul-bag`、`/zion-haul-bag` 都回 404；零售商：
  - https://campsaver.com/black-diamond-stubby-haul-bag.html ："Unavailable & Discontinued Models … Black Diamond Stubby Haul Bag, MPN: BD8102700000ALL1"
  - https://bergfreunde.eu/black-diamond-stubby-haulbag ："This product is no longer available."
  - https://mtntools.com/cat/bigwall/haulbags/02haulbags.htm ："STUBBY 35 … SOLD OUT  TOUCHSTONE 70 … SOLD OUT  ZION 145 … SOLD OUT"
  - 現行 BD 拖包（官網 Shopify `.js`，2026-10-24）：Wall Hauler 40 USD 219.95、Wall Hauler 70 USD 259.95、Wall Hauler 140 USD 319.95；Wall Hauler 125 的產品網址轉到拖包分類頁，抓不到 `.js`（可能已下架，**推定**）。
- **Petzl PORTAGE → partial（官網頁沒打開；零售商轉貼一致：洞穴背包）**。petzl.com 猜的三個網址都 404，Exa 只回 Petzl Caving 分類頁（highlights 沒列出 PORTAGE）和零售商。零售商（Exa 讀）：
  - https://proteushop.com/en/tackle-bags-16-39l/93834-petzl-portage-30l.html ："Durable medium-capacity pack for caving"；"Weight: 800 g Volume: 30 liters Height: 65 cm"；"Constructed of TPU (PVC-free) material"
  - https://treetools.co.nz/brands/petzl/petzl-portage-30l ："Upper loop for hauling"
  → 寫的時候定位成「洞穴用 TPU 運輸袋，可拖」，不要寫成攀岩拖包。

### 6.9 Beal BACK UP LINE 5 mm 破斷強度 → **found**

- [opened] https://beal-planet.com/en/products/back-up-line-5mm （US 站 https://us.beal-planet.com/products/back-up-line-5mm 規格相同）：
  > "Standard EN 564: 2023, UIAA 102 Accessory Cord, UIAA 110 Static Ropes … Diameter (mm) 5.5 Weight per meter (g/m) 21.0 Breaking load (kN) 15.0 Simple knot breaking strength (kN) 15.0 Breaking strength with double fisherman knot (kN) 18.0 Material Polyamide, Aramid"
  > "Since the BACK UP LINE does not absorb energy at all, it should not be used for roping, progressing or any situation requiring dynamic qualities."
- 注意：產品名叫 5 mm，官方規格表寫的直徑是 **5.5 mm**。零售商 Sport Conrad 寫 "Breaking load (kN): 12.0"，和原廠 15.0 kN 不一致 → 用原廠數字。
- 價格（US 站 Shopify `.js`）：40 m USD 171.39／50 m 214.24／60 m 257.09／200 m 856.96；EU 站 40 m €154.40。

### 6.10 Metolius 各型號價格 → **found（推定改為確認）**

- [opened] https://metoliusclimbing.com/products/haul-bag.js （Shopify，option "Model"）：
  - Sentinel USD 189.95（SKU SENT001.03）
  - Quarter Dome USD 219.95（QUAR001.03）
  - Half Dome USD 279.95（HALF001.03）
  - El Capitan USD 299.95（ELCA001.03）
- 容量對應（同頁 Specs & Details，[opened]）：
  > "Sentinel: Capacity: 2800 cu. in. (46 L) Weight: 4 lbs. 11 oz. (2.1 kg) … Quarter Dome: Capacity: 4200 cu. in. (69 L) Weight: … (2.3 kg) … Half Dome: Capacity: 7600 cu. in. (125 L) Weight: … (3.4 kg) … El Cap: Capacity: 9600 cu. in. (157 L) Weight: 8 lbs. (3.6 kg)"
  → §3 原本依排列順序**推定**的容量對應，這次頁面規格直接寫明，**已確認**。

### 6.11 Petzl 台灣價格 → **found（推定改為確認）**

- petzltw.com 是 CYBERBIZ 平台，不是 Shopify（`/products/<handle>.js` 回 404）；改讀商品頁 HTML 內嵌的 `productVariantsInfo`／`productData`：
  - [opened] https://www.petzltw.com/products/pur-line-6-mm ：`"79458644,PTR010AA00,11500.0,…,65 m,PUR LINE 6 mm - 65 m"`、`"79458646,PTR010AA01,31000.0,…,200 m,PUR LINE 6 mm - 200 m"` → **65 m = NT$11,500、200 m = NT$31,000（確認）**。兩款 `inventory_quantity_status` 都是 "empty"（2026-10-24 無庫存）。
  - [opened] https://www.petzltw.com/products/swivel ：`{"sku":"PTP58-L","price":3700.0,…"properties":[{"name":"顏色","value":"黑/紅色"},{"name":"規格","value":"L"}]}`、`{"sku":"PTP58-S","price":3000.0,…}` → **SWIVEL S = NT$3,000、L = NT$3,700（確認）**。S 款 "empty"（無庫存），L 款 "safety"。台灣站把 SWIVEL 放在「專業系列」。

### 6.12 拖繩 vs 主繩：繩對繩摩擦／纏繩 → **found（原廠一般警告 + 案例；沒有「拖繩 vs 先鋒繩」專項測試）**

- [opened] Petzl Tech Tip〈How to protect the rope?〉https://petzl.com/us/en/sport/tech-tips-by-product/product-information-and-specifications/how-to-protect-the-rope-/CORDES-precautions_SPO_a77w0000000KyvgAAC.html
  > "Avoid rubbing against edges and avoid positioning the rope in a crack when rappelling. Rope-on-rope or rope-on-webbing friction is forbidden."
- [opened] PUR LINE 技術說明書 TECHNICAL NOTICE PUR LINE R0014400G (220725)，https://petzl.com/sfc/servlet.shepherd/version/download/068Tx00000K2Q1LIAV
  > "Hyperstatic accessory cord for climbing and mountaineering. Specially suited for bag hauling and single rope retrieval. This cord does not absorb energy and must not be used for belaying."
  > "The melting point of high-modulus polyethylene (140° C) is lower than that of nylon and polyester. High-modulus polyethylene has a low coefficient of friction."
  > "Verify the absence of any sharp edges or rubbing that can damage the cord."
  > "PUR LINE + MICRO TRAXION, TIBLOC, NANO TRAXION or PRO TRAXION + BASIC or ASCENSION = compatibility verified by Petzl. - PUR LINE + any other ascender = potential danger."
  > "Static strength without terminations: 15 kN. Static strength with figure-eight knots at the ends: 8 kN."
  → HMPE 拖繩熔點 140 °C，比尼龍主繩低，繩對繩摩擦時吃虧的是拖繩（推論；Petzl 只給熔點數字，沒有直接寫拖繩對主繩的情境）。
- [opened] Climbing〈For Safety's Sake Don't Do This: Saw Through Someone Else's Rope〉https://climbing.com/news/for-safetys-sake-dont-run-rope-over-rop
  > "Fifty feet of his rope rubbed across one point of my rope, a new 9.8 on only it's third day in use. When we pulled it we found a dime-sized hole burned through the sheath with some damage to the core strands."
  （情境是頂繩下降時兩條繩在同一組鍊環互磨，不是拖包；可當「繩對繩摩擦會燒傷外皮」的實例。）
- 纏繩：Alpinesavvy〈Hauling – not just for big walls〉[opened] https://alpinesavvy.com/blog/hauling-not-just-for-big-walls ："Small diameter ropes like the 6mm Petzl PURline can be very tangle prone. A stuff sack or rope bag is highly recommended"；Avant 影片（6.6）講 tagline 下垂段會勾到包下方而纏住。
- 各工具紀錄：Keenable 搜 "haul line rubbing lead rope abrasion rope on rope friction" 前幾名是船用繩；Exa 沒有額外找到 Petzl／Edelrid／Beal 做的「拖繩 vs 主繩」專項測試。**拖繩 vs 先鋒繩的專項測試仍然沒有找到。**

### 6.13 手指／頭髮／衣物被滑輪或 Traxion 夾 → **partial（BD 有文字警告；Petzl 只有圖示）**

- [opened via Exa；curl 下載 PDF 回連線失敗 000] BD ATC-Guide 使用說明 https://blackdiamond-cms.zaneray.com/cms/media/92ef04c4-847c-44ef-91f2-ec78c4418012_M10798_C_ATC-Guide_IS-WEB.pdf
  > "Ensure hair, loose clothing and your brake hand do not get caught in the belay device during use."
  > "Belaying … requires complete attention and commitment. The belayer is responsible for catching the climber's fall and there is no margin for error."
  （這條是確保器的警告；確保器在 guide mode 也會被拿來拖輕包，見 6.14 VDiff。）
- [opened] Petzl MICRO TRAXION 技術說明書 P0004600E (290824) https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dwc33c3a4e/media/product/technical-notice-MICROTRAXION-1_068Tx00000GXHYmIAP.pdf
  - 文字裡沒有手指、頭髮的字樣（grep finger/hair/cloth/glove/caught/pinch 都沒有命中；"n. Hand" 是器材上的標記圖例）。
  - 第 2 頁「6. Installing the pulley」有一個橘色「!」警示框，畫的是**齒輪旁一個長髮的人**（第 2 頁 300 dpi 放大後讀圖）。這是常見的「頭髮捲入轉動件」圖示；Petzl 沒有附文字，**圖意是推定**。
  - 同頁其他圖示：滑輪靠在岩面上、凸輪被頂住 → 骷髏圖示（致命）；滑輪卡在稜角上 → 骷髏；Tyrolean 橫渡 → 骷髏。文字對應："Warning: the MICRO TRAXION must be attached without obstruction."
  - 拖包段落文字："8a. Hauling"；"WARNING: disabling the progress-capture function presents a fall risk for the load."；"Breaking strength when used as progress-capture pulley: 4 kN."
- NANO TRAXION 說明書 P0015600E (020924)，[opened]：文字同樣沒有手指／頭髮警告。PRO TRAXION：tech-tips 頁沒抓到說明書連結。
- 結論：可以寫「BD 的確保器說明書明文提醒頭髮、寬鬆衣物、制動手會被捲進器材；Petzl Traxion 說明書用圖示提醒」。不要寫成「Petzl 明文警告手指夾傷」。

### 6.14 拖包同時確保 → **found（主流做法是先拖再確保；也有人寫怎麼同時做）**

- [opened] Climbing〈How to Haul a Pack for Climbing〉，Jeff Achey，2023-06-14，https://www.climbing.com/skills/how-to-haul-pack-climbing/
  > "A hauled bag can cause rockfall, so be cautious when hauling from above and at the belay below. In general, the leader will haul the bag before he puts the second on belay (so the second can free a stuck bag if necessary), but let the follower climb clear of the danger zone before attempting a rockfall-prone haul."
- [opened] VDiff Climbing〈Basic Hauling Techniques for Multi-Pitch Trad〉https://www.vdiffclimbing.com/basic-hauling/
  > "Step 6 Clip the bag to the anchor with a sling and remove the hauling setup. You can now belay your partner."
  > "If the bag gets stuck, you can pause hauling and begin belaying your partner. Once they have climbed up and freed the bag, you can tie-off the belay and continue hauling."
- 同時做的寫法：
  - WeighMyRack（Blake Herrington，2018-03-05）[opened] https://blog.weighmyrack.com/what-the-haul-3-ways-to-help-send-hard-multipitch-climbs ："put your follower on belay, ideally using a guide-style device … As the following climber starts up the pitch, the leader can hand-over-hand haul the pack, while belaying."（2018，<2024，只當技術描述）
  - Kirkpatrick Protected Haul（6.4）："put the haul strand of the two ropes through a self-locking hauling device and the free rope through a belay plate. If the 'sack is light the best device is a magic plate … as this allows the leader to have both ropes locked at all times — otherwise you need four hands."
  - Mountain Project 論壇〈Fix and follow?〉[opened] https://mountainproject.com/forum/topic/118973932/fix-and-follow ："Yes, you could haul and belay at the same time. But if you haul and then are done with it, the leader can really rest--no need to multitask the belaying, too."（論壇，非權威）
- 原廠：Petzl〈Belaying the second with a MICRO TRAXION or NANO TRAXION: beware of any fall〉（Exa 讀）https://www.petzl.com/US/en/Sport/Belaying-the-second-with-a-MICRO-TRAXION--beware-of-any-fall?ActivityName=multi-pitch-climbing ："the belayer must be especially vigilant: they must take up rope as the climber progresses and avoid any slack"——講的是用 Traxion 確保，不是拖包同時確保（和 §1 #30 的提醒一致，不要混用）。BD ATC-Guide 說明書："Belaying … requires complete attention"。
- 各工具紀錄：Keenable、Exa 都沒有找到原廠或協會明寫「不可同時拖包和確保」；Tavily 429；Groundlane 401。**「原廠明文禁止」仍然沒有找到**；能寫的是「教學文的建議順序：先拖、再確保」。

### 6.15 推定的更正

| 原寫法（位置） | 本輪結果 |
|---|---|
| PUR LINE TW 65 m = 11,500、200 m = 31,000「推定」（§1 #7、§3） | **確認**（petzltw `productVariantsInfo`） |
| SWIVEL TW S = 3,000、L = 3,700「推定配對」（§3） | **確認**（petzltw `productData`，PTP58-S／PTP58-L） |
| Metolius 容量依排列順序「推定」（§3） | **確認**（頁面 Specs & Details 逐型號寫明），各型號價格見 6.10 |
| Petzl PUR LINE 影片 2023-10-24（來源日期總表、§5） | **錯**，YouTube 上傳日是 2023-06-27 |
| CAMP Gyro［not opened］ | Gyro1：25 kN／WLL 5 kN（2024 起，原 3 kN）／76 g（零售商轉貼，官網 JS 抓不到） |
| BD Stubby／Touchstone［not opened］ | 已停產（BD 官網 404 + 零售商 discontinued） |
| Beal BACK UP LINE 強度未擷取 | 15.0 kN（原廠；規格寫直徑 5.5 mm） |
| 「手指夾進滑輪」沒找到（§4 #60） | BD ATC-Guide 有頭髮／衣物／制動手捲入的文字警告；Petzl MICRO TRAXION 只有圖示（圖意推定） |
| 「拖包同時確保」沒找到原廠原文（§4 #61） | 原廠禁止仍沒找到；Climbing（2023）："the leader will haul the bag before he puts the second on belay" |
| 「繩對繩摩擦」專文沒找到（§1 #29、§5） | Petzl："Rope-on-rope or rope-on-webbing friction is forbidden."；PUR LINE 說明書：HMPE 熔點 140 °C。拖繩 vs 先鋒繩專項測試仍沒有 |
