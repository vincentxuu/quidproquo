# 單繩對折垂降（兩股進管狀垂降器）影片研究

查於 2026-10-24。對應文章：`src/content/posts/climbing/2026-10-24-how-to-rappel.md`（已嵌 fMlxmDCie0s、IpJtTRmg7Og、rDkLXs-vfuI、JwSJrWQnNrA，本檔不重複推薦）。
字幕與 info.json：`.work/rappel-how-to/videos-single/`（`<id>.en-orig.vtt` 原始自動字幕、`<id>.txt` 去重後附秒數）。
日期全部用 yt-dlp 讀 `upload_date`（exact）。

## 搜尋過程

- `node scripts/yt-candidates.mjs`：37 個頻道上傳列表＋6 組關鍵字，88 支候選（輸出在 scratchpad，未 --verify）。
- yt-dlp `ytsearch` 共約 12 組關鍵字；逐支查 upload_date 約 45 支。
- 頻道直掃：Travis Weil、Climbing Magazine（相關影片都是 2012–2013）、Summit Seekers Experience（相關多為 2021–2023）、Mountain Skills Academy（@MountainSkillsAcademy 回 404）。
- Keenable 搜尋（Groundlane 前一輪 401，這輪直接用 Keenable）：找到 AMGA、AAC、OR 的影片，都是 2017–2019，只有 AMGAUSA 2025 這支是 2024 年以後。
- 結論：2024 年以後，由有證照的專業人士完整示範「單繩穿環、找中間記號、兩股進管狀器」的影片很少。目前找到最乾淨的是 Travis Weil（AMGA 認證岩攀／阿式嚮導）2025 年的垂降系列。

## 推薦排序

### 1. Rappelling: Learn the Basics — `w6a0SCc3iAI`

- 頻道：Travis Weil；上傳 **2025-10-03**；7:52（472 s）
- 資歷：自家網站 travisweil.com 寫「AMGA Certified Rock and Alpine Guide, AMGA Apprentice Ski Guide, PSIA Level 2」；Alpine Ascents International 嚮導頁也列了他。片頭 0:20 自述「I am an AMGA certified rock and alpine guide」。
- 商業關係：說明欄有 Insta360 X4 的聯盟連結和折扣碼（INRJ40P），也推廣自己的嚮導與教學服務。沒有攀岩器材廠商贊助。
- 內容：sport／單段路線頂端，綁著繩子到站 → 穿過鍊環 → 找中間記號 → 兩股裝進管狀器 → autoblock → 由上往下檢查 → 下降 → 到底拆器材。
- 時間點：
  - **43 s**（0:43）從頂端開始轉換：「I am tied into the end of my rope, but I need to get my rope off of me through those chains」。62 s 先用自我確保繩扣上固定點；73–87 s 先拉一段繩打結扣在吊帶上，「I then can untie my knot knowing that I can't lose my rope」（防掉繩）。
  - **89 s**（1:29）穿環、繩尾打結、拉到中間記號：「I'm going to go through my chains… close that system by tying a knot in the end」（95 s）、「until the end of my rope is either confirmed at the bottom or my middle mark is at the chains」（105–113 s），還建議用雙色（bi-pattern）繩，中間記號才不會褪色（116–127 s）。
  - **136 s**（2:16）兩股進管狀器：「place both strands into my belay device… clip it back through both strands of the rope and this little keeper cable」（146–161 s）；170 s 起在確保環上打 autoblock（Beal Jammy 30 cm 繞 3 圈）；215 s 補充，繩子很重時先打 autoblock 再裝垂降器。
  - **241 s**（4:01）由上往下檢查：「I just confirm that I am through the rings and that my middle mark is at the rings… Both strands of rope are through my belay device and my carabiner is through both ropes」。
  - 下降手法 322 s；到底拆器材 358–408 s（提醒垂降器會很燙）。
- 跟 Petzl／DAV 的差異：4:01 只做目視檢查，沒有先坐上去讓系統受力就解開自我確保（273 s「I'm ready to take my tether off」）。本文第五步把負重測試列為必做，引用這段時要另外講。1:35 只說「a knot in the end」，沒講兩端都要打；第 2 支影片有講兩端。

### 2. 5 Rappelling Best Practices to Keep You Safe — `qkbxXGYfGMk`

- 頻道：Travis Weil；上傳 **2025-09-21**；7:28（448 s）。資歷、商業關係同上（Insta360 聯盟碼）。
- 時間點：
  - **35 s**（0:35）Closing the system：「when I'm threading my rope through the ring chains, I will tie a barrel knot… a knot that I cannot rappel past on the end of my rope. And I'll do that with both ends」（55–73 s），另外講這樣「prevents my rope from feeding back through the chains」（73–80 s）。82 s 起講第二種做法：用 bight knot 把繩尾扣在自己身上，有風時繩尾不會飄走。
  - **252 s**（4:12）放繩：穿到中間記號後，繞手圈往下丟（263–284 s）；陡又平滑的岩壁就慢慢放下去（286–309 s）；岩壁有裂縫／岩角、風大或有其他隊伍時用 saddlebag（313–383 s）。
  - **387 s**（6:27）避免卡繩：「make sure that we don't leave any excess rope that should be below us above us… the possibility of the rope snagging above us and us having to reascend」。
  - 另有 107 s 延伸＋自我確保、133 s autoblock 掛確保環、188 s 預先架設垂降（pre-rig）。
- 跟本文的差異：212–219 s 預先架設時說上面的 Chris「doesn't need a backup because I can provide a backup for him from the ground」，用下方拉繩保護取代第二人的 autoblock。本文〈下方拉繩保護能不能取代備份〉那節的立場要對照，不要讓讀者以為可以直接取代。

### 3. Full Masterclass: Multi Pitch Rappelling for Outdoor Rock Climbing - Bolted Anchors — `_C0HXDiGbls`

- 頻道：Mike Vert；上傳 **2026-08-24**；23:44（1424 s）
- 資歷：只有說明欄和片頭（7 s）自述「climbing for 11 years… a diploma in outdoor adventure」。**不是認證嚮導**，資歷比 1、2 弱。
- 商業關係：說明欄推廣自家付費線上課程 Rock Ready 30（climbingmastery.com）；scanner 也標了 REI 導購連結。
- 優點：完整拍出單繩對折的多段垂降，也是本次唯一清楚拍到「拉繩、拉之前解開止滑結」的 2024+ 影片。
- 時間點：
  - **509 s**（8:29）解繩、打止滑結、穿兩個 quick link：「we always, always, always use stoppers… I go 30 centimeters from the end」（529–556 s）；「feed the rope through those two quick links… before I do anything else, I'm going to tie a stopper knot in」（595–610 s）；「pull it till the middle mark of the rope… a black spot」（657–662 s）。
  - **680 s**（11:20）先裝 autoblock，再把兩股裝進管狀器（776–797 s「make sure that this is locked and it's running through two ropes」），**846 s** 坐上去做負重測試，確認自我確保已經鬆掉。
  - **1186 s**（19:46）拉繩：「right when they come off the rope, you can start pulling the other side」；「you're actually going to undo the stopper knot here because it's going to be going through the chains at the top… it's going to get stuck on the chains」（1208–1218 s）；繩尾穿過下一站後要再打止滑結（1235–1247 s）。
  - 1324 s 示範負重測試沒過（自我確保太高，沒有鬆掉），要調整後再測。
- 衝突／慎用：**1104–1142 s**（18:24–19:02）同伴還在垂降時，就把一股繩的止滑結解開，先穿進下一站的鍊環再重打。他自己也說要隨時管好繩尾，但這一步是在同伴掛在繩上時拿掉止滑結，風險高。本文不採用，嵌入時用 `end: 1100` 或從 1186 s 開始。另外 1:43 提到 GRIGRI 只能用單股，跟本文一致。

## 補充與次選

- **Cleaning Top Rope Anchors — `MKfPKYSW7iE`**（AMGAUSA，**2025-06-12**，8:05）：主講 Dale Remsberg，是 IFMGA 嚮導、AMGA Technical Director（San Juan Mountain Guides 和 AMGA 合作文章都寫明）。片中是**下放**，不是垂降，但 **104 s**（1:44）有一句可引用：「I'm going to lower off of this sport climb not rappel. In sport climbing the AMGA, the American Alpine Club, we all recommend that we lower off these anchors」。如果本文要寫「清 sport 路線之後垂降」，要先寫清楚 AMGA／AAC 預設是下放。另外 98 s 說要喊「slack」不要喊「off belay」，避免溝通錯誤。說明欄是空的。
- **Rappelling in Tricky Situations — `WlR79qc7fBA`**（Travis Weil，**2026-08-04**，13:34）：**38 s**（0:38）講垂降超過半條繩長時，要先查路線資料，接兩條繩，粗繩要穿過鍊環（110 s）；**136 s**（2:16）講只差幾呎時用 knot block（overhand on a bight＋有鎖鉤環）改成單股垂降，再用 cordelette 加長拉繩端（230–264 s）。適合「半條繩長限制」，但屬進階技術。本文〈特殊情況〉已經引用 Petzl 和 bergundsteigen 的不同意見，要放的話併在那節。有 Insta360 聯盟碼。
- **Rappel Extensions and Tethers — `06-aadUGzeg`**（Travis Weil，2025-05-29）：主題是延伸和自我確保繩，不是單繩，主題跟第四步重疊。
- **The Abseil Method I Don't Teach — `pGhA-CTgfUY`**（JB Mountain Skills，2026-04-26）：用的是兩條 Mammut 寄的 8 mm 半繩（0:21「Mammut kindly sent me」），重點是 120 cm 扁帶延伸的做法，**不是單繩對折**，不推薦用在這個主題。6:39 有一句「put some knots in the bottom of your ropes… I do it every single time」。
- **How to safely teach stripping / cleaning a sport route — `GnY4faSILcI`**（JB Mountain Skills，**2023-11-12**，pre-2024）：主題是清路線教學，以下放為主，字幕已下載，沒有細讀。
- pre-2024 的經典教學（沒有下載字幕、沒有審過，只列出來）：AAC Know the Ropes: Rappelling `ZCZjMG7UJqQ`（日期未查）、AAC Cleaning an Anchor `aDilZALfW9c`（2017-04-13）、REI How to Rappel `7U6tdEevJgs`（2016-08-15）、Summit Seekers（AMGA SPI）`nrrpJAkEj7U`（2021-07-12）、American Alpine Institute How to Retrieve a Stuck Rope `Rb9C4Md8-sY`（2022-10-28）。
- 沒找到：2024 年以後 Petzl、BMC、Black Diamond、Edelrid、DMM、Climbing magazine、Alpine Savvy 專講單繩對折垂降或拉繩的影片。Alpine Savvy 有文章（例：cast don't throw、microline），沒有對應的 YouTube 影片。

## 建議用法

- 第二到三步（穿繩、止滑結、中間記號）：w6a0SCc3iAI start 89，或 qkbxXGYfGMk start 35（兩端都打 barrel knot）。
- 第八步（拉繩）：_C0HXDiGbls start 1186，end 約 1250。
- 卡繩、不要讓繩子留在上方：qkbxXGYfGMk start 387。
- 同一支影片一篇只嵌一次；Travis Weil 的兩支建議擇一嵌入，另一支放參考資料。
