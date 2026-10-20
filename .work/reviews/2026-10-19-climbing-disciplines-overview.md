# Review: 2026-10-19-climbing-disciplines-overview（zh + en）

Review date: 2026-10-19. Scope: 其他攀登類型系列 order 0，中英兩版。獨立審稿，未改文。
工具：Groundlane MCP `web_fetch`（本次可用；兩次 502／stream closed 後改 `curl` r.jina.ai 與 Wikipedia `action=raw`）。原始擷取存於 session scratchpad `H-review-a/dl/`。

## post-verify

| 原句（行） | Verdict | 說明 | 來源 |
|---|---|---|---|
| 2024 年高山 71、傳攀 52、運攀 35，無繩獨攀和深水獨攀合計 9 起；Climbing.com 提醒是總數不是比率（L108–110、tldr） | 🟢 Confirmed | 原文逐項相符；ANAC 2025 版、美加合計 210 起 | climbing.com/news/9-takeaways-climbing-accidents-2024 |
| 「爬高山的人本來就比獨攀的人多得多」（L110）、「爬高山的人遠比無繩獨攀的人多」（L142） | 🔵 Misframed | Climbing.com 只說事故量「might be indicative of the popularity」，沒有給參與人數。正文把推測寫成事實 | 同上 |
| NCCS I–II 半天、IV 一整天、V 通常過夜、VI 兩天以上、VII 偏遠大岩壁（L50、glossary） | 🟡 部分 | I/II/IV/V/VI 相符。VII 原文是「Remote walls climbed in alpine style」，少了「以阿式風格」；V 原文另有「or done fast and free in a day」 | alpinist.com/climbing-grade-comparison-chart |
| 「你在龍洞爬的單段路線，連 I 級都談不上」（L50） | 🔵 Misframed | NCCS I 定義是技術段半天以內，單段路線落在 I 的範圍，只是通常不標。說「談不上」會讓讀者以為 I 級門檻比單段高 | 同上 |
| DWS 起點 1978 馬約卡；英國 S0–S3（L58） | 🟢 Confirmed | | en.wikipedia.org/wiki/Deep-water_soloing |
| Crystal Blue Temptation 在被礁石圍住的池子；其他地方有強烈離岸流（L61） | 🟢 Confirmed（single-source） | MP：「self-contained pool…powerful riptides」。注意它是 6 m 的 boulder 路線，不是池子本身 | mountainproject.com/route/108330150 |
| 大岩壁＝「overgrown rock route」＋人工攀登＋拖吊；建議至少能用傳攀先鋒 5.9（L66、L68） | 🟢 Confirmed | | climbing.com/skills/how-to-climb-a-big-wall |
| 龍洞最高岩壁約 70 公尺（L69） | 🟢 Confirmed（single-source） | climbstone：「up to 70 meters high」。研究筆記另記約 80 m，兩者不一致，本文用 70 m 有出處 | climbstone.com/information.html |
| 韓國冰攀團條件「有攀岩經驗，會垂降和 Top rope 確保」＋六種繩結（L76） | 🟢 Confirmed | 原文列八字結、雙漁人、普魯士、義大利半扣、水結、雙套結，共 6 種 | goforwild.com.tw act_no=491 |
| 「高雄已有岩館設乾攀路線」（L77）、表格「只有岩館乾攀」（L102） | 🔵 Misframed | go4mosa 註 2 自己更正：乾攀定義是冰斧冰爪並用，高雄那個岩館的空間是「衍生的類冰攀練習形式」（內文說腳上穿攀岩鞋）。本文 L74 又把乾攀定義成「用冰斧冰爪爬裸岩」，跟 L77 的說法對不上 | go4mosa.net/blog/posts/iceclimbing |
| 高山客觀危險：落石、雪崩、冰塔、冰河裂隙、風暴、高度（L82） | 🟢 Confirmed | | en.wikipedia.org/wiki/Alpine_climbing |
| F–ED 量整條路線的嚴重程度，含接近和下撤（L82） | 🟢 Confirmed | 出處是 Alpinist 表（「approach, ascent and descent」），不是該段掛的維基 | alpinist.com |
| 115 年雪季進生態保護區要附「雪攀裝備及技術自我檢查表」（L85） | 🟢 Confirmed | 1/1–3/31；全名「雪季期間攀登雪霸園區登山路線雪攀裝備及技術自我檢查表」 | taiwan.nps.gov.tw/home/zh-tw/news/32712.html |
| Honnold 2026-01-25 Netflix 直播爬台北 101，1 小時 31 分（L31、L90） | 🟢 Confirmed | 維基：9:00 開始，1:31:34 到塔尖 | en.wikipedia.org/wiki/Skyscraper_Live_(2026) |
| glossary「台灣業者多稱『深水抱石』」（L22） | 🟡 Unverifiable | 研究筆記只記到一家業者（活動列表）用這個詞；「多稱」沒有支撐 | 研究筆記 L80、L156 |
| 表格「冰螺栓拔出」為冰攀最大風險來源（L102） | 🟡 本文無來源 | 研究筆記有出處（Climbing.com 30 年事故分析），本文沒有掛連結 | 研究筆記 L36、L126 |
| 表格大岩壁風險「系統出錯、長時間暴露、撤退困難」（L101） | 🟡 本文無來源 | 屬一般性描述，無引用 | — |

en 版對照：數字與宣稱和 zh 一致，上面的 Misframed／Unverifiable 項在 en 同樣存在（L22 "operators often call it"、L109/L141 "Far more people climb alpine routes"、L76 "A gym in Kaohsiung has set dry-tooling routes"）。

本次只檢查了文中已提出的 17 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

機械檢查：`pnpm check:references` 本篇 0 錯誤 0 警告（全站 0 error）；`pnpm check:tw` 0 擋下、0 待看；站內連結 12 個目標檔全部存在（含 order 2–5）。`pnpm verify`／`astro check` 未跑（只審兩篇、不 commit）。

- frontmatter：必填齊全；tags 7 個（上限）。`alpine-climbing`（站內 4 次）與既有 `mountaineering`（16 次）並存，屬可接受的區分，但要確認系列內一致。
- tldr：有數字、有決策點（「只爬過抱石的人離 DWS 最近」），強度與正文一致。
- 結構：三軸 → 五類各一段（是什麼／先會什麼／台灣）→ 前置表 → 事故數限制 → 選讀表 → 練習題。符合範圍卡；自我檢查題（抱石 → DWS）有放。
- 台灣讀者位置：每類都有「台灣能不能練」，開頭用台北 101 與龍洞切入。OK。
- inline 來源：F–ED 定義那句掛的是維基，應改掛或加掛 Alpinist；冰螺栓、大岩壁風險無來源（見上）。
- 範圍卡遵守：未點名推薦業者，但 L76 inline 連到「山野悠遊」商業活動頁當來源，讀起來像導購（見 nit）。

## post-polish

`register-scan.sh`：長句 6 句（44 段中，未達密度門檻）；但書 9%；引述 0；數字密度 3 段 ≥4（Honnold 段、ANAC 段、練習題 3），ANAC 段是全篇的核心數字，保留；姓名主詞 0；模板化轉折 0；`scan-ledger.sh` 無命中。

人工回讀：L31 開頭 93 字一句是四個平行畫面，屬刻意排比，可留；L50 NCCS 那句 81 字可拆。L66「長太大的岩石路線」不順。

## 問題清單

### must-fix

無。

### should-fix

1. **乾攀說法自相矛盾**（L77、L102；en L76、L101）
   - 原句：「高雄已有岩館設乾攀路線（go4mosa 報導）」「只有岩館乾攀」
   - 建議：「高雄有岩館設了用冰斧練習的區域（穿攀岩鞋，報導者自己註明是類冰攀的衍生練習，不是嚴格定義的乾攀；[go4mosa 報導](…)）」；表格改「岩館冰斧練習區」。
   - en：「A gym in Kaohsiung has set up an ice-tool training area (climbers wear rock shoes; the article itself notes it is a derived form, not dry tooling in the strict sense)」。
2. **把參與人數差距寫成事實**（L110、L142；en L109、L141）
   - 原句：「爬高山的人本來就比獨攀的人多得多」「爬高山的人遠比無繩獨攀的人多」
   - 建議：「Climbing.com 的解讀是，事故數高可能只反映爬的人多；參與人數少的類型，事故數少，比率可能反而很高。」練習題 2 改：「爬高山的人很可能遠比無繩獨攀的人多，但這組資料沒有參與人數……」。
3. **「連 I 級都談不上」**（L50；en 同段）
   - 建議：「你在龍洞爬的單段路線通常不標 NCCS；真要標，就是 I 級。」
4. **glossary「台灣業者多稱『深水抱石』」**（L22；en L22）
   - 建議：「台灣有業者稱為『深水抱石』。」（en：「Some Taiwanese operators call it 深水抱石」）

### nit

5. NCCS VII（L50）：「VII 是偏遠的大岩壁」→「VII 是以阿式風格攀登的偏遠大岩壁」。
6. F–ED 那句（L82）：在「高山路線用 F 到 ED 分級」後加 Alpinist 表連結。
7. 表格冰攀風險（L102）：「冰螺栓拔出」可在第 3 篇已有來源，這裡可不掛；若要掛，用研究筆記的 Climbing.com 30 年事故分析。
8. L61：「Crystal Blue Temptation 是一個被礁石圍住的池子」→「Crystal Blue Temptation 是一條在礁石圍住的池子裡、約 6 公尺高的路線」。
9. L66：「長太大的岩石路線」→「長得過頭的岩石路線」或「加大版的岩石路線」。
10. L76 商業活動頁當 inline 來源：系列規格「不推薦特定商業業者」。可改成「台灣一個韓國冰攀訓練團的報名條件是……」，連結移到參考資料，或保留但不寫業者名。
11. L50 拆句：在「這樣定義：」後斷成兩句。

## 未查證／未公開

- 「台灣業者多稱深水抱石」：只找到一家業者的用語。
- 爬高山與無繩獨攀的參與人數：沒有公開資料，Climbing.com 也沒給。
- 大岩壁「系統出錯、長時間暴露、撤退困難」：本文無來源，屬作者歸納。
- 龍洞最高岩壁：climbstone 寫 70 m，研究筆記另有約 80 m，未見第二個獨立來源。

## 修正紀錄（2026-10-19）

zh、en 兩版同步修改，未改 slug／date，未加更新紀錄。

- 已修 should-fix 1：乾攀說法改為「岩館冰斧練習區（穿攀岩鞋，報導者註明非嚴格定義的乾攀）」，表格同步改。
- 已修 should-fix 2：L110、練習題 2 改為 Climbing.com 的解讀／「很可能」＋「這組資料沒有參與人數」。
- 已修 should-fix 3：改「通常不標 NCCS；真要標，就是 I 級」。
- 已修 should-fix 4：glossary 改「台灣有業者稱為」。
- 已修 nit 5（VII 補「以阿式風格」）、6（F–ED 加掛 Alpinist 表）、8（Crystal Blue Temptation 改為池子裡約 6 公尺的路線）、9（「加大版的岩石路線」）、10（inline 連結文字改「報名頁」、正文不寫業者名；參考資料列保留原標題）、11（NCCS 句在「這樣定義」後斷句）。
- 未修 nit 7：冰螺栓拔出的來源在研究筆記，本篇未開該頁，依審稿建議留給第 3 篇承載，不在這裡新增未開過的連結。
- 未處理：大岩壁風險欄（作者歸納，無來源）、龍洞 70 m／80 m 不一致（本文用有出處的 70 m）。
