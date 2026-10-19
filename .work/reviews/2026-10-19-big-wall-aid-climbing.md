# Review: 2026-10-19-big-wall-aid-climbing（zh + en）

Review date: 2026-10-19. Scope: 其他攀登類型系列 order 2，中文為主、英文版逐段比對數字與歸屬。獨立審稿，未改文。
工具：Groundlane MCP `web_fetch`（可用；遇 CONCURRENCY_LIMIT 改序列重試）、`web_search`；climbstone 與中文維基走 r.jina.ai。原始擷取存於 session scratchpad `H-review-b/dl/`。

## 待修清單（給改稿者）

| 嚴重度 | 位置 | 原句 | 建議改為 |
|---|---|---|---|
| must-fix | L118（en L117 同） | 「維基百科引用《Hooking Up》的說法：傳統人工攀登要打岩釘，一條新路線前 5 隊爬時是 A5，到第 6–20 隊時一半的銅頭塞已經被留在牆上，第 41 隊之後……」 | 「維基百科引用 McNamara《Yosemite Big Walls》（2011）的說法：優勝美地一條新的 A5 路線，前 5 隊爬時是 A5；第 6–20 隊時一半的銅頭塞已經固定在牆上，約 A4；第 41 隊之後所有銅頭塞都在位、岩釘孔被打到不用槌子也能放裝備，等級穩定在 A3+。」（後句「《優勝美地大岩壁》作者 McNamara」改成「同一本書裡 McNamara」，書名用原文 *Yosemite Big Walls*，沒有中譯本）。en：「Wikipedia cites Chris McNamara's *Yosemite Big Walls* (2011): …」 |
| should-fix | L93（en L92） | 「1958 年首登花了 45 天，用了 600 根岩釘和 125 根人工攀登用的螺栓。」 | 「1958 年首登累計攀登約 45 天，分散在約 18 個月內，用固定繩分段推進（圍攻式），用了 600 根岩釘和 125 根人工攀登用的螺栓。」維基同條目另一處寫 47 天，45 天是 LA Times 等來源的通用數字 |
| should-fix | L39（en L38 已改好） | 「紀錄片《Free Solo》裡 Honnold 不帶繩爬上的酋長岩，路線多是 VI 級……他們把每人每天 3–4 公升的水拖上岩壁」 | 「紀錄片《赤手登峰》（Free Solo）裡 Honnold 不帶繩爬上的酋長岩，上面的路線多是 VI 級，一般繩隊要花兩天以上。這些繩隊把每人每天 3–4 公升的水拖上岩壁……」（「他們」目前讀起來像 Honnold；台灣片名《赤手登峰》，規劃表目標讀者段也用這個名字） |
| nit | L57 | 「至少 10 段或 300–500 公尺……它沒有明確的段數門檻。」 | 「通常至少 6–10 段（約 300–500 公尺）……沒有明確的段數門檻。」維基導言寫 10 段、正文寫 6–10 段，前後兩句目前互相打架 |
| nit | L128（en L127） | 「*Zodiac* 寫成 VI 5.8 A2+，*The Shield* 寫成 VI 5.7 A3（維基百科）」 | 維基兩個條目給的自由難度不同（Zodiac 5.7／5.8、Shield 5.7／5.8）。改成「約 5.7–5.8」或註明「依維基 Aid climbing 條目」 |
| nit | L137 | 「食物要掛在離路線底部至少 50 英尺（約 15 公尺）的地方」 | 「食物要掛在岩壁上、高出路線底部至少 50 英尺（約 15 公尺）」（NPS：hung on the wall at least 50 feet above the base；目前寫法可能被讀成水平距離） |
| nit | L81、L203 | 「小PO 在動一動的專欄」 | 補作者全名與年份：「易思婷（小PO）2015 年在動一動的專欄」；她用的詞是「大牆攀登」，可加一句括號說明中文名不統一（研究筆記用語表已列） |
| nit | tags | `[climbing, outdoor-climbing, big-wall, multi-pitch, trad-climbing]` | 可加 `aid-climbing`（本系列其他篇已在內文用到人工攀登，全站目前沒有這個 tag；可選） |

## post-verify

| 原句（行） | Verdict | 說明 | 來源 |
|---|---|---|---|
| Climbing.com：爬過很多長多繩距前不要上大岩壁；幾乎每面牆都有必須自由攀的段落，帶裝備更難；至少能用傳攀保護穩定先鋒 5.9（L52） | 🟢 Confirmed | 原文 Caution 段逐句相符（Mark Synnott，2022-02-23） | climbing.com/skills/how-to-climb-a-big-wall |
| 大岩壁至少 10 段或 300–500 m，一整天到好幾天；沒有明確段數門檻（L57） | 🟡 來源內部不一致 | 維基導言 10 段、正文「6–10 pitches」；見 nit | Wikipedia Big wall climbing |
| NCCS I–VII 表（L59–68、glossary） | 🟢 Confirmed | 與 Alpinist／AAJ 原文一致 | alpinist.com/climbing-grade-comparison-chart |
| 優勝美地只能在 Grade V 以上、離地至少一段的路線上過夜（L70） | 🟢 Confirmed | NPS FAQ 原文 | nps.gov/yose climbingpermits |
| 四步流程：先鋒拖第二條繩、到站固定先鋒繩、架拖吊、跟攀者上升器爬繩清裝備、到站整理換下一段（L74–79） | 🟢 Confirmed | Climbing.com The Basics 段 | 同上 |
| 小PO：跟攀者爬繩時先鋒可拖包、不用確保，效率高（L81） | 🟢 Confirmed | 原文「跟攀者經常使用爬繩的方式上昇，因為在此同時先鋒者可以拖包」 | don1don.com/archives/59390 |
| 拖包：吊帳、睡袋、poop tube、食物、水每人每天 3–4 L（L83、L39） | 🟢 Confirmed | 維基 Big wall「circa 3-4 liters per day per person」 | Wikipedia Big wall climbing |
| 彈跳測試：用體重衝擊、想把它拔出來；拔不出來才放心踩（L87） | 🟢 Confirmed | 「You try to rip out the piece… If you can't rip it out, you move onto it with confidence」 | Climbing.com |
| 單段路線已很少用人工攀登；大岩壁與高山路線上遇到難度遠高於其他部分的段落，人工攀登被接受（L91） | 🟢 Confirmed | 維基 Aid climbing「accepted even by free climbers」 | Wikipedia Aid climbing |
| 1958 首登 45 天、600 岩釘、125 螺栓（L93） | 🟡 Confirmed（需補條件） | 維基同條目一處 45 天、一處 47 天；LA Times 2002 訃聞與其他來源：45 天、分散在 18 個月、留固定繩。只寫「花了 45 天」會被讀成連續 45 天 | Wikipedia Aid climbing；latimes.com 2002-03-08（搜尋摘要） |
| The Nose 常見寫法 VI 5.9 C2；1993 Lynn Hill 首次全程自由攀登（L93） | 🟢 Confirmed | 英文、中文維基一致（5.14a） | Wikipedia；zh.wikipedia 大岩壁攀登 |
| 人工攀登等級量的是只撐體重的放置點數，不太管體力（L99） | 🟢 Confirmed | 「less concerned with the physical demands」 | Wikipedia Aid climbing |
| A0–A5 定義表（L103–112） | 🟢 Confirmed | AAJ 原文 | Alpinist |
| 1990 年代優勝美地 new wave、延伸到 A6、A2 起加「+」、A3 約 15 m、A4 約 30 m（L114） | 🟢 Confirmed | | Wikipedia Aid climbing；Alpinist |
| A→C 表示不用槌子（L116） | 🟢 Confirmed | | Alpinist |
| 等級演變鏈出自《Hooking Up》（L118） | 🔴 Contradicted（歸屬錯） | 維基這段的出處是 McNamara & Van Leuven《Yosemite Big Walls》（3rd ed., 2011, pp.18–19），不是 *Hooking Up*；且原表講的是「優勝美地一條典型的新 A5 路線」，中間還有 A4（6–20 隊）與 A3/A4（21–40 隊）兩階 | Wikipedia Aid climbing（Issues with aid grading 節，ref 20） |
| McNamara：new wave 原本號稱更精確，結果只帶來更多混亂（L118） | 🟢 Confirmed | 引文相符 | 同上 |
| VI／5.9／C2 拆解（L122–126） | 🟢 Confirmed | | Wikipedia；Alpinist |
| Zodiac VI 5.8 A2+、The Shield VI 5.7 A3（L128） | 🟡 來源內部不一致 | Aid climbing 條目：Zodiac VI 5.8 A2+、Shield VI 5.7 A3；Big wall 條目：Zodiac 5.7 A2+ VI、Shield 5.8 A3 | 兩個維基條目 |
| 過夜一律要許可；免費、無名額、酋長岩橋附近 24/7 自助登記、前一天或當天領（L134） | 🟢 Confirmed | | nps.gov/yose climbingpermits |
| 2021 試辦、2023 年 1 月常設（L134） | 🟢 Confirmed | AAC 原文 | americanalpineclub.org 2025-05-27 |
| 固體排泄物帶下岩壁、裝合適容器、丟垃圾箱或旱廁（L135） | 🟢 Confirmed | | NPS 許可條款 |
| 繩子不能無人看管超過 24 小時；固定繩標姓名、日期、聯絡方式（L136） | 🟢 Confirmed | | NPS |
| 食物掛離路線底部至少 50 英尺（L137） | 🟢 Confirmed | 原文「hung on the wall at least 50 feet above the base of the route」；寫法見 nit | NPS |
| 2001 年清掉超過四千英尺廢棄繩（L139） | 🟢 Confirmed | | nps.gov/yose climbing_regulations |
| 小PO 學習路徑五步、「大牆至少 Grade V，大量 III、IV 經驗」（L143–149） | 🟢 Confirmed | 原文的一二三＋A、B＋四（甲乙丙丁）結構相符 | don1don.com/archives/59390 |
| Climbing.com：先在短裂隙練 clean aid，再找三到五段的路線練所有技能和轉換（L151） | 🟢 Confirmed | | Climbing.com Leading 段 |
| 龍洞岩壁最高約 70 m（L155、tldr） | 🟢 Confirmed | 「up to 70 meters high」。研究筆記寫「約 80 m」，文章用 70 是對的 | climbstone.com/information.html |
| 書籍版圖收 Lynn Hill、Tommy Caldwell 自傳（L161） | 🟢 Confirmed | *Climbing Free*、*The Push*（繁中《獨行大岩壁》） | 站內 2026-06-20-climbing-books-knowledge-map |
| 練習題 1–3 答案（L169–193） | 🟢 與正文一致 | 題 2 的「岩釘孔被打大」與正文一致 | — |
| en 版 | 🟢 數字一致 | 同樣有 *Hooking Up* 歸屬錯（L117）與 45 天缺條件（L92）；en L38 已把主詞改成 Those teams | — |

### 未查證／未公開

- 規劃表範圍卡提到的「太魯閣報告：大岩壁僅有白沙峰有記錄」與「台灣有業者開大岩壁訓練課」，文章都沒寫。前者在研究筆記是轉引（🟡），後者涉及點名業者；不寫是合理的取捨，不列為缺口。
- *The Nose* 自由攀段最難是不是 5.9（有 topo 寫 5.8 C2）：只對到維基，沒有對 SuperTopo／Mountain Project。
- 本次只檢查了文中已提出的約 30 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。

## post-review

機械檢查：`pnpm verify` 唯一紅燈是本篇與其他 order 缺審稿紀錄（本檔即補上）；`pnpm check:tw` 0 blocking；`scan-ledger.sh` 0 命中；`pnpm check:links` 本篇 0 壞連結。站內連結 9 條全部存在。

frontmatter：必填齊全、type `guide`、tags 5 個、tldr 與 description 不重複；tldr 數字（V、VI 5.9 C2、70 m）與正文一致。glossary 五條與正文一致。

結構：前置 → 定義（NCCS 表）→ 繩隊流程 → 人工攀登 → 分級（表折疊）→ 讀法 → 優勝美地規定 → 學習路徑 → 在台灣 → 練習題 → 參考資料，符合系列共用規格。範圍卡要求的項目（定義、流程、A/C、降級、三等級並列、許可 2023 常設、排泄物、小PO 路徑、龍洞可練系統）都有。不講拖吊與吊帳細節，開頭已明講範圍。

inline 來源：數據與引述都有 inline link 或明確指回前文已連結的來源。

台灣讀者位置：開頭承接《赤手登峰》、前置連回站內系列、「在台灣」段給龍洞限制與可練項目，成立。

## post-polish

`register-scan.sh`：長句 1 句（L41，68 字，系列導覽句）、引述區塊 0、姓名主詞 0、模板化轉折 0、一般英文術語 0。數字密度偏高的段落：L93（7 個）、L118（6 個）、L114（7 個，在 `<details>` 內，可留）。

建議（未改）：
- L118 改完歸屬後會更長。建議把「隊數 → 等級」那串拆成四行小表或清單（前 5 隊 A5／6–20 隊 A4／21–40 隊 A3–A4／41 隊後 A3+），正文只留「後人用的是前人留下的放置點，所以變簡單」這個結論。
- L93：把首登的天數與裝備數放在一句、Lynn Hill 放下一句，目前一段塞了首登、今日等級、自由攀三件事。
- L41 的 68 字長句可在「第 2 篇」後斷句。
- 可執行動作：L157「先在龍洞把多繩距的轉換練到不用想」偏抽象。可補一句做得出來的動作，例如「下次爬多繩距時，請繩伴記下每個確保站從到站到出發花了幾分鐘，下一次試著縮短」（不加具體目標數字，避免無來源）。

保護片段（數字、引號原文、URL）未動。

## 修正紀錄（2026-10-19）

已修（zh＋en）：
- must-fix L118 歸屬：改為 McNamara《Yosemite Big Walls》（2011），補上 A4（6–20 隊）、A3／A4（21–40 隊）兩階，並依 post-polish 建議拆成四行清單；後句改「同一本書裡」。已用 Wikipedia Aid climbing `action=raw` 核對 ref CMcN2011。
- should-fix L93 首登 45 天：補「累計」與條件——依 Wikipedia The Nose 條目（新增連結），1957 年 7 月開始、1958 年 11 月登頂，分次推進、營地間架固定繩。未採用「18 個月」說法（只有搜尋摘要，未開原文）。
- should-fix L39：片名改《赤手登峰》（Free Solo），主詞改「這些繩隊」（en 原已正確）。
- nit L128：註明依維基 Aid climbing 條目，Big wall 條目自由難度約 5.7–5.8（已核對 Big wall 原始碼）。
- nit L137：改為「掛在岩壁上、高出路線底部至少 50 英尺」（zh；en 原已寫 above the base）。

未修：
- nit L57（6–10 段）：Big wall 原始碼 grep 未找到「6–10 pitches」字樣，未自行確認，保留原句。
- nit L81／L203 小PO 全名：本次未打開來源確認作者全名與年份，未改。
- nit tags `aid-climbing`：新增全站 tag 屬可選，未加。
- post-polish L41 長句、L157 可執行動作：非 must/should，未改。
