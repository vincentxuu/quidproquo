# 審稿紀錄：2026-10-19-climbing-partners-gym-culture（中英共用）

日期：2026-10-19。審稿者：rev-a（獨立審稿，未參與撰寫）。對象：zh-TW 正文與 `-en` 版。本紀錄只列問題，未改文章。

工具：Groundlane MCP `web_fetch` 這次可用（BMC 調查頁、ACG 首頁走 Groundlane）；其餘大量抓取改用 Jina reader（`r.jina.ai`，中途遇到 429 限流，改成逐一抓取後成功），DAV 作者欄位用 curl 讀原始 HTML 的 JSON-LD。toolDegradation：Groundlane → Jina reader／curl（為了批次抓取與 grep，不是因為 Groundlane 失敗）。原始擷取存於 scratchpad `M/rev-a/dl/`。

## post-verify

🟢 Confirmed（逐一打開原文）
- BMC Your Climbing Counts：2023 年 12 月啟動、「just under 5,500 usable responses」；「close to half if they had a regular climbing partner」；「Being introduced to climbing by a friend is the most common and is equally so for both men and women」。
- Climbing.com 43 Ways（2025-10-30，Maya Silver）：Instagram 投票超過 1,000 人，86% IRL、14% online。
- Mountain Project Partner Finder：「There are 37,951 climbers」（2026-10-19）；篩選欄有年齡、距離、各類型 Lead／Follow。
- LINE 社群「攀岩抱石找繩伴&岩友」：今日顯示成員 460（文中「約 459」可接受）。
- 成大攀岩場：登山社與課外組共管；開放時「也吸引許多校外人士攀爬」。
- Climbing.com Red Flags（2025-08-29）：8 項警訊內容與文中轉述一致；「If their gear… truly make you uncomfortable, end the climbing session」；聽得進去就當 teachable moment，下次一樣就換人。
- DAV Panorama 6/2014〈Kampf dem Eisberg〉（Hummel & Hellberg）：先鋒每次確保 1.4 個錯誤、上攀 0.7 個；冰山比喻。
- DAV 2025 岩館事故統計：繩攀落地 31 起中 15 起在下放；自動確保器 5 起落地全部「Nichteinhängen」，1 起死亡；一起「Trotz Partnerchecks wurde übersehen, dass der Knoten nicht fertig war」。
- DAV〈Sicherungsfehler in Kletterhallen〉：作者 Dr. Martin Schwiersch、Julia Janotte（JSON-LD）；首發 2018-09-13；MUSS／SOLL／KANN 三級、例子、介入時機（雙方都在地面）、走近後等眼神接觸、「Stopp. Du bist nicht richtig eingebunden.」、被看著時確保較好、Vieraugencheck 起初被視為干涉。
- 原岩中和店〈安全守則與個人責任聲明〉：抱石區嚴禁坐軟墊、建議離牆至少 2 公尺；初次來館要學「抱石安全墜落」與自動確保器，做不到可拒絕攀爬；尊重先上牆者；未滿 16 歲不得確保；館內嚴禁私自技術教學、禁止確保練習。
- CWA〈What Makes a Climbing Gym a Third Place〉（2026-02）：「rest time between attempts is where relationships actually form」。
- Outside：Shelma Jun 在紐約，2014 年創立 Flash Foxy，2016 年辦第一屆女性攀岩節。
- Guardian 2024-01-25：Black Girls Boulder 2020 年 3 月成立；岩館多在 affluent communities；裝備、會費、比賽費高；比賽中反覆遭遇 microaggressions。
- Brown Girls Climb 2016 秋天以 Instagram 帳號起家：見 Voyage Denver 訪談（文中沒有附這個來源，見待修 5）。
- 動誌 2022-03-07：內湖小岩館 4/9–4/10 封館辦「國內首次女性專屬」女力攀岩嘉年華。
- 蘭州街：pixnet 年表「民國 86 年（1997）6/1 中華山協蘭州街會館改建成室內攀岩訓練中心」「1999 年改為台北攀登俱樂部，開始對外營運」；kate4「2004 年由現在的 STONE 團隊接手，並轉商業經營」「已於 2012 年熄燈」；kate 2018 STONE 文「蘭州街岩場的最後一夜（2012/4/27）」。
- 原岩官網「2015 年 8 月成立，目前有 6 間分店」；kate4「2015 年於楊梅開張」「從肅殺與怒吼，悄悄轉成溫馨與社交」。

🔴／🟠 修正（列入待修清單）
- 🟠 REI 六個方法被誤述：原文第 3 點是「Find your local climbing advocacy organization and get involved」（到攀岩倡議團體當志工），不是「在岩館當志工」；第 5 點布告欄、第 6 點自己開團是兩件事，原文沒有「固定時段」。
- 🟠 蘭州街 2012-04-27 的日期掛在 pixnet 年表連結上，但那篇寫於 2012-03-15，內文還說「三月底結束營業」，不可能支持 4/27。支持 4/27 的是 kate 2018 STONE 文的照片說明。
- 🔵 1999 vs 2004 被寫成「對外營運從哪一年開始」的衝突：兩份來源講的其實是不同事件（1999 改為台北攀登俱樂部、開始對外營運；2004 由 STONE 團隊接手轉商業經營）。
- 🔵 DAV「必須」級也包含「Eindeutig zu viel Schlappseil beim Sichern in Bodennähe mit Bodensturzgefahr」，「應該」級是「偶爾／反覆」太鬆。文章 tldr、表格與練習題 2 把「靠近地面繩子太鬆」一律歸為「應該」，少了這個分界。
- 🔵 Eisberg 原文：錯誤只在「Sturz oder Ablassen」時造成事故；文中只寫「墜落」，漏了下放，而下放正是下一段的重點。
- 🔵 BMC：「有更多時間就會多爬」超過三分之二，是最大因素；「有固定繩伴」是將近一半。文中「很多人不是不想爬，而是找不到人一起爬」把繩伴寫成主因。

🟡 Unverifiable（未要求修）
- 「音樂用耳機」「不穿岩鞋進廁所」：原岩館規沒有；研究筆記 S36 是個人部落格。文中已註明「加上各地常見的禮儀」，可接受。
- 「多數禮儀整理都建議要給 beta 之前先問」：沒有單一權威來源，屬經驗歸納，措辭已經保守。

本次只檢查了文中已提出的約 40 條宣告，沒有評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0／0；`check:references` 本篇 zh-TW 無錯，**EN 版 4 個 ERROR**（kids／coach／route-setter／waivers 的 `-en` 不存在；series map 4 處＋「Next」1 處）；`check:links` 本篇 18 條無壞鏈（REI 回 403，是擋機器人，Jina 可讀）。
- frontmatter：tags 4 個（climbing, indoor-climbing, belay, taiwan），都是既有 tag ✅；type guide ✅；description 與 tldr 不重複 ✅。
- 範圍卡（order 0）：找繩伴管道 ✅、Climbing.com 86% ✅、BMC 2023 ✅、試新繩伴流程 ✅、DAV 2012 確保錯誤觀察與 2025 下放事故 ✅、MUSS／SOLL／KANN ✅、禮儀 ✅、平權社群 ✅、台灣女性攀岩節 ✅、系列地圖 ✅、岩館史一段 ✅；例子「FB 認識的新繩伴」✅；自我檢查題（八字結沒穿好）✅。不講項目都只用連結處理 ✅。
- 衍生內容：tldr 的「收繩太鬆之類的錯誤，等兩人回到地面再好好說」把 DAV 的分界簡化掉了（見待修 4）。
- inline 來源：Brown Girls Climb 2016 沒有 inline 來源（見待修 5）。
- 中英對照：EN 跟 zh 內容一致，只有一處差異：EN glossary 少了「繩伴」詞條（🟢 不需修）。下面每條待修都要中英一起改。

## post-polish

- 長句 8 句（> 60 字）／約 88 段，屬可接受密度。最長的是 Red Flags 那句（109 字，一口氣列了 8 項），建議改成條列（待修 8）。
- 但書 6%、姓名當主詞 1、引述 0：綠。
- 模板化轉折 1 處（「不是不想爬，而是找不到人」），待修 6 改寫時順便處理。
- 數字密度：4 段 ≥ 4 個數字（Climbing.com 投票、DAV 冰山、平權社群年份、蘭州街年表）；年份與比例都是主張本身，保留。
- 每節都有「今晚就能做的事」✅。

## 待修清單

1. 🔴【EN】站內連結指向不存在的英文版。`-en.md` 系列地圖表格的 4 個連結 `/posts/climbing/2026-10-19-kids-adaptive-climbing-en`、`/posts/climbing/2026-10-19-climbing-coach-certification-en`、`/posts/climbing/2026-10-19-route-setter-career-en`、`/posts/climbing/2026-10-19-climbing-gym-safety-waivers-en`，以及「## Next」段的 `[Post 1: Kids and Adaptive Climbing](/posts/climbing/2026-10-19-kids-adaptive-climbing-en)`。修法：merge 前先補齊這 4 篇英文版（系列規格要求中英同步）；如果來不及，暫時改連中文版並加註，例如 `[Kids and disabled climbers](/posts/climbing/2026-10-19-kids-adaptive-climbing) (in Chinese)`，其餘 3 個連結同樣處理。最後跑 `pnpm check:references` 確認。
2. 🟠【zh＋EN】REI 誤述。
   - zh 原文：「美國戶外用品商 REI 的〈[找岩館社群的六個方法](…)〉還提到兩個常被忽略的管道：在岩館當志工，或自己在布告欄開一個固定時段的團。」
   - 改為：「美國戶外用品商 REI 的〈[找岩館社群的六個方法](https://www.rei.com/blog/climb/6-ways-to-find-your-climbing-gym-community)〉還提到兩個常被忽略的管道：到當地的攀岩倡議團體當志工，以及岩館布告欄：在上面貼一張找繩伴的紙條，或乾脆自己開一個團。」
   - EN 原文：「adds two routes people forget: volunteering at a gym, or starting your own regular session on the notice board.」
   - EN 改為：「adds two routes people forget: volunteering with your local climbing advocacy group, and the gym notice board, where you can post a note looking for a partner or start a group of your own.」
   - 來源：同一 REI 頁第 3、5、6 點。
3. 🟠【zh＋EN】蘭州街日期的出處與 1999／2004 的說法。
   - zh 原文：「後來轉為商業經營，2012 年 4 月 27 日熄燈。對外營運從哪一年開始，說法有 1999 和 2004 兩種。」
   - 改為：「後來轉為商業經營，2012 年 4 月 27 日[熄燈](http://kateberrysblog.blogspot.com/2018/12/stone.html)。轉型的時間點有兩種說法：年表寫 1999 年改為台北攀登俱樂部、開始對外營運；[座談整理](http://kateberrysblog.blogspot.com/2021/02/rock-climb-generation-4.html)寫 2004 年由 STONE 團隊接手、轉為商業經營。」
   - 參考資料加一條：`- [STONE 攀岩場將歇業（部落格，2018，含蘭州街最後一夜 2012/4/27）](http://kateberrysblog.blogspot.com/2018/12/stone.html)`
   - EN 原文：「It later ran commercially and closed on 27 April 2012. Sources disagree on when it opened to the public: 1999 or 2004.」
   - EN 改為：「It later ran commercially and [closed on 27 April 2012](http://kateberrysblog.blogspot.com/2018/12/stone.html) (in Chinese). Accounts of the switch differ: the timeline says it became the Taipei Climbing Club and opened to the public in 1999, while the [panel write-up](http://kateberrysblog.blogspot.com/2021/02/rock-climb-generation-4.html) says the STONE team took it over and ran it commercially from 2004.」
   - EN 參考資料加：`- [STONE climbing gym to close (blog, 2018, in Chinese; includes Lanzhou Street's last night, 27 April 2012)](http://kateberrysblog.blogspot.com/2018/12/stone.html)`
4. 🟡【zh＋EN】DAV「必須／應該」對「繩子太鬆」的分界（來源：DAV Sicherungsfehler 頁，MUSS 例「Eindeutig zu viel Schlappseil beim Sichern in Bodennähe mit Bodensturzgefahr」；SOLL 例「Gelegentlich／Wiederholtes übermäßiges Schlappseil」）。
   - tldr 原文：「收繩太鬆之類的錯誤，等兩人回到地面再好好說。」→ 改為：「偶爾收繩太鬆、制動手常往上抬這類錯誤，等兩人回到地面再好好說；但如果靠近地面時鬆到明顯會落地，就屬於「必須」，要當場提醒。」
   - 表格「應該（SOLL）」列的例子原文：「制動手常常往上抬；靠近地面時繩子太鬆；確保站位不好」→ 改為：「制動手常常往上抬；靠近地面時偶爾太鬆；確保站位不好」
   - 表格「必須（MUSS）」列的例子原文：「攀爬者繩結沒打完；確保者長時間放開制動手；下放失控」→ 改為：「攀爬者繩結沒打完；確保者長時間放開制動手；靠近地面時繩子明顯太鬆，一墜落就會落地；下放失控」
   - 練習題 2 答案的第一句之後加一句：「如果你判斷那段鬆繩已經鬆到一墜落就會落地，就升級成「必須」：當場出聲提醒確保者收繩。」
   - EN 對應：tldr「Errors like slack near the ground can wait until both of them are back on the ground, and then you say something calmly.」→「Errors like occasional slack or a brake hand drifting upward can wait until both are back on the ground; but slack near the ground that would clearly mean a ground fall is a 'must', so say something right away.」SOLL 例「too much slack near the ground」→「occasional slack near the ground」；MUSS 例加「clearly too much slack near the ground, so a fall would hit the floor;」；練習題 2 答案加「If the slack is bad enough that a fall would clearly reach the ground, treat it as a 'must' and tell the belayer to take in right away.」
5. 🟡【zh＋EN】平權社群：三個例子都在美國，而且 Brown Girls Climb 2016 沒有 inline 來源。
   - zh 原文：「英美有幾個由女性和有色人種發起的社群」→ 改為：「美國有幾個由女性和有色人種發起的社群」
   - zh 原文：「Brown Girls Climb 2016 年從一個 Instagram 帳號開始」→ 改為：「[Brown Girls Climb](https://voyagedenver.com/interview/daily-inspiration-meet-brown-girls-climb-colorado) 2016 年秋天從一個 Instagram 帳號開始」
   - EN：「In the UK and US, several communities」→「In the US, several communities」；「Brown Girls Climb began as an Instagram account in 2016」→「[Brown Girls Climb](https://voyagedenver.com/interview/daily-inspiration-meet-brown-girls-climb-colorado) began as an Instagram account in autumn 2016」
   - 兩版參考資料都加：`- [Meet Brown Girls Climb（Voyage Denver）](https://voyagedenver.com/interview/daily-inspiration-meet-brown-girls-climb-colorado)`
6. 🟡【zh＋EN】BMC 的主因被改寫（同時去掉一處模板句）。來源：BMC 頁「More than two-thirds… more time, almost half if they lived closer…, close to half if they had a regular climbing partner」。
   - zh 原文：「換句話說，很多人不是不想爬，而是找不到人一起爬。缺繩伴本身就會讓人少去岩館。」
   - 改為：「最大的限制還是時間：超過三分之二的人說，有更多時間就會多爬。缺繩伴排在後面，但它比時間好解決。」
   - EN 原文：「In other words, plenty of people want to climb but have nobody to climb with. Not having a partner keeps people out of the gym.」
   - EN 改為：「Time is still the biggest limit: more than two-thirds said they would climb more with more time. A missing partner comes further down the list, but it's easier to fix than time.」
7. 🟡【zh＋EN】Eisberg 漏了下放。來源：Panorama 6/2014「ein Fehler führt nur zum Unfall, wenn die Sicherung im Moment des Fehlers beansprucht wird, also bei Sturz oder Ablassen」。
   - zh 原文：「因為墜落剛好沒發生在錯誤的那一刻」→ 改為：「因為錯誤發生的那一刻，剛好沒有人墜落，也沒有人正在下放」
   - EN 原文：「because nobody happens to fall at the wrong moment」→「because nobody happens to fall, or be lowered, at that moment」
8. 🟢【zh＋EN，polish】Red Flags 那句 109 字一口氣列 8 項，改成條列。
   - zh 原文：「Climbing.com 的〈[換繩伴的八個警訊](…)〉幾乎就是上面這張清單的反面：拒絕互檢或器材有問題、不理會你的口令、確保時分心、刻意隱瞞路線難度、你說不要 beta 還一直給、做過讓你失去信任的事（例如制動手離繩）、決定都是單方面做的、一直嘲諷你。」
   - 改為：「Climbing.com 的〈[換繩伴的八個警訊](…)〉幾乎就是上面這張清單的反面：\n\n- 器材有問題，或拒絕互檢\n- 不理會你的口令\n- 確保時分心\n- 刻意 sandbag：少講或謊報路線的難度與危險\n- 你說不要 beta，還一直給\n- 做過讓你失去信任的事，例如制動手離繩\n- 決定都是單方面做的\n- 一直嘲諷你」
   - EN 同樣改成 8 項條列（文字沿用現有 EN 句子拆開）。

## 修正紀錄

- 待修 1：其餘 4 篇英文版同批補齊，英文版連結保留。
- 待修 2–8：中英兩版全部照建議文字改入（REI 管道、蘭州街轉型兩說與 STONE 來源、DAV 必須／應該對鬆繩的分界含 tldr 與練習題 2、平權社群限美國與 Brown Girls Climb 來源、BMC 主因為時間、Eisberg 補下放、八個警訊改條列）。練習題 2 答案的升級句後補「否則」銜接原句。
