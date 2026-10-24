# 雙繩對接垂降影片候選（2026-10-24）

目標：補〈垂降怎麼做〉第二步（兩條繩怎麼接）與第七、八步（多繩距換站、拉繩）的影片。已用的 fMlxmDCie0s、IpJtTRmg7Og、rDkLXs-vfuI、JwSJrWQnNrA 不重複。

方法：`scripts/yt-candidates.mjs`（37 個設定頻道＋8 組關鍵字，結果 `videos-double/candidates.md`）＋另掃 BMC TV、AAC、AMGA、Glenmore Lodge、Climbing Magazine、Summit Seekers、Short Guys Beta Works、Skills for Climbing、Outdoor Research、Dave Searle、JB、Mike Vert、Climbing Tech Tips 上傳列表（`videos-double/chscan.tsv`）＋ yt-dlp 關鍵字搜尋（`search2.tsv`）。每支 upload_date 用 yt-dlp 逐支查（exact）。字幕、info.json、去重後的逐秒文字（`<id>.txt`）都在 `videos-double/`。Groundlane 未試（上游已知 401），網頁查證走 Keenable keyless + curl。

**結論先講**：2024 以後沒有找到「一支片從對接、穿繩、記拉繩側、換站到拉繩全部拍完」的專業頻道影片。2024+ 只能拆成兩塊：對接結（Dave Searle、JB）＋堆疊垂降互檢（AAC）。完整換站流程最好的兩支都是 2022–2023（Short Guys Beta Works、DMM），列為「較舊」備選。

## 推薦（依序）

### 1. Connecting Ropes for Climbing and Mountaineering // DAVE SEARLE — `ykzmVwFrVLM`

- 上傳：2024-08-31（exact）；25:15（1515 秒）
- 頻道／資格：Dave Searle，片中自述「I'm an IFMGA guide based out in Chamonix」（25s）；Rab 運動員頁寫「As an IFMGA mountain guide…resident [in Chamonix] for the past 16 years」；英國山岳嚮導協會 BMG 名錄有 david-searle 條目（Keenable 搜尋結果，頁面未展開）。
- 商業：0:37–1:44 推銷自己開發的 OAK app（說明欄有下載連結）；說明欄有 Amazon 書籍連結（Andy Kirkpatrick《Down》）；Rab 贊助運動員。
- 片段：
  - **start 472**：offset overhand bend 怎麼打、整理、拉緊。字幕：「to start with the simplest the easiest」（472）、「pull those Tails out and pull those tails simultaneously」（503–510）、「I want all the strands here to be parallel」（531）、「stress the knot … pull each individual strand」（554）。另 405：用手腕到手肘量 30 cm 尾巴。594：「first you would thread one of these ropes through your repel anchor」。
  - **start 287**：offset vs inline——結偏一側，拉繩時貼著岩面滑，比 double fisherman 不易卡。字幕：「this means that the knot can stay on the surface of the Rock … less likely to get snagged」（約 307–322）。
  - **start 785**：「European death knot」的名聲其實是 flat figure 8 造成的，別用 flat figure 8 接繩。字幕：「the offset figure of eight Bend now we don't use this to connect two ropes together anymore」（832）。
- 限制／衝突：只講結，沒有穿繩、換站、拉繩流程。642 秒起說加第二個 overhand 後「we can actually have slightly shorter tails」——Edelrid／UIAA 的要求是尾巴要夠長，本文寫 30 cm，引用時只用 472–600 段，不用這句。

### 2. The Prescription | Stacked Rappel（American Alpine Club）— `dkPNdMKzlSg`

- 上傳：2026-01-21（exact）；2:11（131 秒）
- 頻道／資格：AAC 官方；講者 Jason Antin，說明欄與 AAC 文章標「IFMGA/AMGA Guide」，LinkedIn 標題「IFMGA Mountain Guide」（Golden, CO）。另有 Pete Takeda（《Accidents in North American Climbing》編輯）開場。
- 商業：本支說明欄沒有贊助字樣；同系列其他片（m41B2_NFDD0）寫「supported by Rocky Talkie」。片尾呼籲加入 AAC。
- 片段：
  - **start 0**：Pete Takeda 開場講 2025 年 Stanley Headwall 事故（ATC 穿錯）——本文第 60 行已引用同一事故，可直接接。字幕：「This climber had threaded their ATC incorrectly」（15–32）。
  - **start 35**：Jason Antin 示範兩人堆疊（pre-rigged）垂降、用 HAD（Harness / Anchor / Device）互檢。字幕：「Pre-rigged or stacked repels are an incredibly efficient way to repel with more than one person」（35）、「The acronym I like to use is HID. Don't be had harness anchor device」（60，自動字幕把 HAD 聽成 HID）、「there are two ropes going through the device clipped with a locked carabiner」（98）。
- 限制：太短，沒有示範對接結與拉繩；片中只說「two ropes going through the device」，沒交代是兩條繩對接或單繩對折。與 Petzl／DAV 的負重測試、夥伴互檢一致，無衝突。

### 3. Avoid this catastrophic abseiling error! How to join two ropes the right way!（JB Mountain Skills）— `1SGEoyW2aR8`

- 上傳：2025-07-22（exact）；3:55（235 秒）
- 頻道／資格：Jez，官網「a qualified climbing & mountaineering instructor who started JB Mountain Skills in 2009 and has been working in the outdoor industry since 1999」，北威爾斯；開 Rock Climbing Instructor 等英國 Mountain Training 資格課程。官網沒寫他自己持哪一級證照，寫「qualified instructor」即可。
- 商業：說明欄只有 Buy me a coffee、T-shirt；頻道設定檔記「器材店 Outside 支持頻道」。本支無贊助。
- 片段：
  - **start 18**：故意示範趕時間的錯——尾巴留太長、垂降器扣到尾巴上。字幕：「I've lent back on the tails」（78）、「people have absailed off their tails cuz they've just done them a ridiculous size」（約 99–110）。注意 46–71 秒他為了演錯故意說「I'm not going to bother using a prusik」，嵌入時要在文字說明這是反面示範。
  - **start 114**：正確做法——尾巴 30–50 cm、兩繩平行無交叉、拉對向的繩股收緊；加第二個 overhand 的取捨（較安心 vs 較易卡在岩縫）。字幕：「tails around about 30 cm. 30 to 50 cm. No less than 30, no more than 50」（127）、「no crossings over, you know, the ropes stay parallel」（141）、「I pull the opposing strands」（151）、「it does have a higher chance of getting stuck in a crack」（189）。
- 限制／衝突：上限 50 cm 比本文「約 30 cm」寬；第二個 overhand 他說看情境，與 bergundsteigen 2025「單結就夠、兩個更容易卡」不同、與 Petzl「粗細不同才加」部分一致——本文已有這張對照表，可並列。

## 較舊但流程最完整（2024 以前，標明）

### A. How to Multi-Pitch Rappel (Abseil) on Two Ropes…（Short Guys Beta Works）— `ho5DMl8Jiu8`【2023，較舊】

- 上傳：2023-07-17（exact）；5:18（318 秒）
- 頻道／資格：Jason（姓氏未公開於站內）與家人經營；About 頁「Jason has taught these skills for years at the Colorado Mountain Club」。**不是** AAC 片中的 Jason Antin，也非認證嚮導。
- 商業：說明欄聲明「may contain affiliate links」。
- 片段：**start 41**：第一人到下一站扣好 → 拆掉拉繩端止滑結、穿過新站的垂降點、clove hitch 扣站並重打止滑結 → 另一端也 clove 但不打止滑結（要穿回上方）→ 第二人到站扣好後，解開非拉繩端開始拉 → 結到了換手 →「The pull strand will alternate at each new anchor」（188）。字幕：「We now undo the stopper knot on the end of our pull strand and run it through the rappel point」（50）、「we take the non-pull end off the clove hitch and start pulling on the pull strand」（110–115）。
- 限制／衝突：動畫＋口述為主、實拍少；沒有示範打結本身。與 Petzl／bergundsteigen 的換站順序一致。

### B. Learning to Trad Climb: Part 5 - How to abseil/rappel（DMM Wales）— `p6uJIg4fL5k`【2022，較舊】

- 上傳：2022-08-26（exact）；11:39（699 秒）
- 頻道／資格：DMM 官方；講師 Alice Kerr，說明欄標「AMI instructor」（英國 Association of Mountaineering Instructors）。
- 商業：原廠頻道，器材多為 DMM。
- 片段：
  - **start 69**：從攀登繩解開（兩人不要同時解）、一端穿過 maillon、兩端並排打 flat overhand、整理拉緊；說明要拉哪一條。字幕：「So I just fed the blue end through there」（75）、「a single overhand knot」（90）、「we'll pull on the red rope … If you pull on the wrong it jams」（123–128）。
  - **start 275**：stacked abseil 互檢、先裝 prusik、負重確認 lanyard 鬆了才解。字幕：「What I tend to do … is to do something called a stacked abseil」（275）。
- 限制／衝突：單繩距岩場頂端下降，不是多段換站。尾巴「about 2 foot long」（108，約 60 cm），比本文 30 cm 長；止滑結「about a metre from the end」。引用時要註明尾巴長度以本文為準。

## 看過但不推薦

| id | 日期 | 頻道 | 理由 |
|---|---|---|---|
| _C0HXDiGbls | 2026-08-24 | Mike Vert | 多繩距垂降 24 分完整示範，但全程**單繩對折（找中點）**，不是兩繩對接；1101 秒起有「下面的人先把繩端穿進新站」的效率技巧可參考。資格：自述攀岩 11 年、outdoor adventure 文憑，非認證嚮導；片尾與說明欄推自家付費課程 Rock Ready 30。 |
| BrwrP1frTj8 | 2025-09-08 | Short Guys Beta Works | flat overhand 深入：78 秒起打法、94「about 30 centimeters…of tail」、120 粗細不同時細繩放下方（引 AMGA 技術總監 Dale Remsberg）。內容好，但與 Dave Searle 重疊、講者非認證；可當備用。說明欄有聯盟連結。 |
| 9z7v3NDxRjc | 2026-01-26 | Short Guys Beta Works | 何時不用 flat overhand（單股負重、tandem、細 tagline）；超出本文範圍。 |
| weppbvZ_0uc | 2025-08-18 | Short Guys Beta Works | 三人隊雙繩固定單股垂降轉換；149 秒有「run one end through the rappel point, and then join the ropes… 30 centimeters of tail」，但情境特殊。 |
| qJ-hGkSqJew | 2025-02-17 | Short Guys Beta Works | 無 tether 換站法，非主流，不放。 |
| A7rKGDxrdTA | 2025-02-20 | EDELRID Knowledge Base | 接繩結實驗室拉力與垂降受力數據（約 2–2.5 kN 峰值）；本文已引 Edelrid 文章，影片是數據不是流程。 |
| pGhA-CTgfUY | 2026-04-26 | JB Mountain Skills | 延伸垂降兩種掛法，繩已架好，沒有對接結。 |
| qizKZXBIkfI | 2025-10-25 | Ryan Tilley | 帶客人多段垂降實拍，單繩找中點，對話雜。 |
| 8qNiN-lmemo | 2024-02-19 | Mount Everest 8848.86M | 頻道來歷不明。 |
| ZCZjMG7UJqQ、6Xb0ajjlTis、3HURCTzCMA0、e95eCJbRf_E、fYo6SMnkD80 等 | 2018–2022 | AAC／SIET／Summit Seekers／Skills for Climbing 等 | 太舊，且已有 2022–2023 更貼題的 A、B。 |

## 嵌入建議

- 第二步「兩條繩怎麼接」段落後：Dave Searle `ykzmVwFrVLM` start 472（或 JB `1SGEoyW2aR8` start 114，兩支擇一，避免同主題兩支）。
- 第六步負重測試／夥伴互檢附近：AAC `dkPNdMKzlSg` start 35（與第 60 行 Stanley Headwall 事故呼應）。
- 若要補「換站＋拉繩」流程影片，只有 2023 的 `ho5DMl8Jiu8` start 41，需標明 2024 前、講者非認證嚮導；或不放。
