# 攀岩心理與戰術系列研究（模組 F，2026-10-18）

讀者：剛開始先鋒（岩館先鋒卡到戶外第一條運攀）的台灣攀岩者。系列約 6–7 篇，中英雙語。
前置文件：`.research/2026-10-17-climbing-full-curriculum.md`（模組 F）、`.research/2026-10-17-climbing-curriculum-audit.md`（F 的稽核：onsight 5 份、redpoint 4 份、墜落 5 份、心理 7 份、皮膚保養 2 份來源；Climbing Bible Ch3／Ch4 目錄）、站內〈攀岩書籍知識版圖〉（五種心理取向：Ilgner、McGrath & Elison、Moffatt、Findlay／ACT）。

標記：✅ = 已打開並讀到內容（論文至少讀了摘要）；🟡 = 只讀到二手或部分；⚪ = 整條工具鏈試過仍拿不到（附工具與失敗原因）；✉️ = 只能問人。
本檔＝主線程綜整（§0–§5）＋三份子研究原始紀錄（附錄 A／B／C，各約 40–60 份來源，含網址與數字的對照條件）。

## 0. 工具降級紀錄（toolDegradation）
- Groundlane MCP：三個子研究都回「not connected」；直接 HTTP（POST groundlane…/mcp）回 401（需 OAuth）→ 不可用。
- linkup：404 server not found；jina、firecrawl：not connected。Semantic Scholar：全數 rate-limit。
- 可用：Keenable keyless（需依序呼叫、間隔約 1 秒）、Exa、PubMed E-utilities、OpenAlex、Crossref、curl＋去標籤。
- 打不開（⚪）：The Climbing Bible Ch3／Ch4 正文（出版社試閱 PDF 只有目錄與 Ch2）、MacLeod《9 out of 10 Climbers》正文（只有二手引用）、Vertical Mind 原書、Warrior's Way「Art of Redpointing」課程頁、Hooper's Beta 皮膚內容、Lattice podcast（音檔）。
- 注意：hazelfindlayclimbing.com 是賭場垃圾站，不是 Hazel Findlay 本人，不可引用。

## 1. 既有站內文章（連結，不重寫）
- 〈岩館先鋒〉`2026-10-17-gym-lead-climbing` §先鋒墜落怎麼練：已寫墜落「機制」——在哪練（BMC、REI ≥9 m、Petzl）、BMC 三步由小到大、怎麼掉（喊、不抓、不推牆、吐氣）。F 系列的墜落篇只寫「恐懼」與漸進暴露的劑量與自我監測，機制一律連回。
- 〈休息、讀線與自己定線〉`2026-10-18-resting-route-reading`：已寫 Sanchez 2012（看線 3 分鐘停頓變少、完攀率不變；看別人爬更有效）、BMC 讀線清單、甩手、G-Tox。F 的 onsight 篇不重複，只補新證據（Morenas 2021、Seifert 2017、Boschker 2002、Gresham 依難度決定讀線深度）與「投入」策略。
- 〈攀岩卡關該開始訓練嗎〉`2026-10-18-climbing-training-diagnosis` 第二步「心態」：已用三步分辨技術／心態／體能，把「心態」導向墜落練習。F 的入口篇從這裡接手，不重做三步診斷。
- 〈難度與保護評等〉`2026-10-17-grades-and-protection-ratings`：已定義 onsight／redpoint 與 Rockfax 慣例。F 只連結，不再定義。
- 〈攀岩書籍知識版圖〉：已介紹 Ilgner、Vertical Mind、Moffatt、Findlay 四派。F 寫方法，學派背景連回。
- 皮膚保養：站內只有〈動態〉〈裂隙技術〉零星提到；E 傷害系列研究（`.research/2026-10-18-climbing-injury-firstaid-research.md`）沒有皮膚章 → 由 F 負責，不與 E 重疊。
- 賽事規則：屬 K 模組（尚未寫）。F 的比賽段只寫心理與臨場戰術，規則細節連到 K（或暫時連 IFSC／World Climbing 官方）。

## 2. 關鍵發現（每項詳細來源見附錄）
### 恐懼與焦慮（附錄 A）
- 中級者先鋒比頂繩焦慮：認知與身體焦慮升高、自信下降、動作變不流暢（Aras & Akalan 2014；Giles 2025, n=32；Swinarska 2025, n=100，狀態焦慮先鋒 40.1 vs 頂繩 33.1）。進階者兩者沒差（Fryer 2013, n=21）。潛在墜落越長，兒茶酚胺升得越高（Baláš 2017：890% vs 568% 基線）。樣本都小、都是橫斷研究。
- 焦慮讓新手變慢、變僵、視線鎖在手點（Pijpers 2003/2005、Nieuwenhuys 2008）；但焦慮也可能轉成努力（Hardy & Hutchinson 2007），成功的菁英選手賽前身體焦慮反而較高（Sanchez 2010）。
- 測過的介入：動機式意象（Jones 2002, n=33）、自我疼惜（Röthlin 2021, n=60，降身體焦慮不降擔憂）、情緒調節課（Garrido-Palomino 2023, n=11）；自我對話以短的技術提示對新技能效果最好（後設分析 ES 0.48，非攀岩專屬）。
- **沒有任何墜落練習本身的 RCT**：「練摔有用」＝教練共識＋暴露治療理論外推（Craske 2014 抑制學習：變化性、多重情境、情緒標記、移除安全訊號——攀岩轉譯是推論）。
- 恐懼分兩種：怕摔（人身）與怕失敗／丟臉（表現）。Lumby 2026（REBT）受訪者的恐懼主要來自表現壓力；Findlay 也分開處理。
### 戰術（附錄 B）
- 同一條線 redpoint 比 onsight 快且順，乳酸、心率、焦慮都較低（148.7 s vs 179.5 s；PMID 32547440）。
- 單線練習的進步可能漸進，也可能在找到新動作後跳躍（Orth 2018）；練一條線讓該線變流暢，但不清楚能轉移到新線（Hacques 2022）。
- Hörst「10-4 規則」（4 天內 10 次 redpoint 嘗試後換線）、戶外 80% 時間爬能 onsight／flash 的線；Bechtel redpoint 金字塔是折衷。Hörst「效率在 3–10 次後持平」無出處 → 只能寫成他的意見。
- 看活人示範的抱石完攀最多，優於影片，兩者都優於不看（Morenas 2021）；讀線掃視越多，牆上反而越猶豫（Seifert 2017）；專家用「能做什麼動作」記點，不是用外形（Boschker 2002）。
- 嘗試之間休息：20 分鐘後，輕度活動或前臂冷水浸泡能維持表現，坐著不動則下降（Heyman 2009）；輕鬆攀爬優於走路（Valenzuela 2015）；手垂在身側甩比較好（Baláš 2016，耐力 +22%）。休息長度沒有研究比較；Hörst 的 20／40／60 分鐘是經驗法則 → 寫「休久一點，而且要動」。
- 比賽：2026-01 World Climbing 規則，先鋒準決賽與決賽是 onsight＋6 分鐘集體觀察；抱石決賽每題 2 分鐘觀察；計分 top 25、zone 10、每次失敗 −0.1；可用望遠鏡與手寫筆記。世界盃抱石決賽第 6 次之後沒有人完攀（僅決賽選手）。
- 跟誰爬：沒有攀岩專屬的觀眾效應研究，只有一般社會助長（Bond & Titus 1983，效果小）；6 位菁英訪談重視「霸牆」與「支持繩伴」的平衡；教練經驗：crux 前短而具體的提示有幫助，空泛的「加油你可以」增加壓力。
### 條件與皮膚（附錄 C）
- 止滑粉增減摩擦研究矛盾（Li 2001 降、Amca 2012 升 19–22%）；Clarke 2024 調和：薄層有效且穩定，過量（含點上積粉）反而像潤滑劑 → 刷點、薄抹。
- 實驗室裡溫度、濕度不直接改變手指摩擦係數；教練與論壇以露點與濕度為主要指標。可能的調和（推論）：天氣經由流汗速度、岩面凝結、皮膚含水量起作用。「鞋底 0–5°C 最好」查無實測；軟鞋底不一定比較黏（Elkington 2024）。
- 台灣：基隆 1991–2020 月均相對濕度 72–80%（CWA 氣候值），好天是天氣事件不是季節（2018-03 濕度 50–60% 的一天黃金谷 50+ 人）；東北季風 10–4 月、官方警示 10–3 月避免海岸；梅雨 5–6 月；颱風 8 月中起；指南共識春秋最好；冬天轉往關子嶺。
- 皮膚：攀岩者手部幾乎沒有臨床研究；手汗醫療第一線是氯化鋁與自來水離子導入（AFP 2018、JAAD 2019）；Antihydral（13% methenamine）是德國藥局藥，甲醛過敏禁用，唯一對照試驗是 1995 年小型研究。台灣蝦皮有代購販售（NT$340 起，Keenable 商品卡），TFDA 許可證狀態未查到（見 §5）。

## 3. 學派矛盾（寫作時並列，不選邊）
1. 墜落練習的「量」派（MacLeod：一年數百次）vs「劑量」派（Findlay、Ilgner、Lattice／Maguire：每次強度要剛好，摔過頭會固化恐懼；Ilgner 每輪 6–10 次）。共識：抓繩、憋氣、閉眼 → 退一級。
2. 墜落練習地形：微外傾（Lattice，降低撞牆恐懼）vs 垂直（Ilgner，貼近實際）。
3. 墜落練習是否萬靈丹：Hafer（Climbing, 2025）／Crane：生活壓力、受過傷、焦慮症時可能適得其反，先找專業協助。
4. 焦慮要壓低（Giles 2025）還是重新詮釋為助力（Sanchez 2010、Hardy & Hutchinson 2007、姚廷蓁訪談）。
5. Projecting 量：Hörst 10-4／80-20（少試、多線）vs 長期圍攻（MacLeod、Lattice 15+ sessions）；Bechtel 金字塔折衷；研究兩邊各有道理。
6. 讀線要讀多久：教練說仔細讀；研究說看線不提高完攀、看人爬最有效。
7. 止滑粉增減摩擦；濕手還是乾手受益多（Clarke 2024 乾手較多 vs Carré 濕手）。
8. 天氣決定論：實驗室無相關 vs 教練以露點為準。
9. 繭要磨平（UKC、Climbing.com）vs 不要過度磨（皮膚科大森醫師、KletterRetter）。
10. Flapper 剪掉風乾 vs 貼回繼續爬；強力膠可不可以（UKC 反對、WMS 說醫療級可）。傷口保濕 vs 風乾。
11. Antihydral 用不用、怎麼用（Hörst 夫婦、Buhay vs Sheffield 診所、ClimberNews）；液態粉利（降粉塵）弊（酒精乾皮、松香過敏）。

## 4. 台灣用語（含出處，細節見附錄）
- 墜落練習、墜落恐懼、心理因素訓練（百合搖滾傳攀課）；先鋒攀登、先鋒確保、上方確保（原岩、百合搖滾）；take（喊收繩，岩館口語）。
- 心理素質、內在對話（LINE TODAY）；心魔、焦慮、壓力（Outsiders 姚廷蓁專訪）；國手積分、全國先鋒抱石運動攀登錦標賽（臺中市府 2025）。
- onsight、flash、send、project、beta：台灣岩館多直接講英文；書面用完攀、練線、串動作、紅點。「視攀」「閃攀」是中國用語，不用；「冲坠」也是中國用語。「磨線」「打 project」查無書面來源（口語）。
- 止滑粉、液態粉（白手套）、流手汗、手皮沒了、把繭磨平、反潮。「掀皮」「爆皮」查無台灣書面來源 → 寫「flapper（整片掀起的皮）」。

## 5. 待解問題（只列 ⚪／✉️）
- ⚪ The Climbing Bible Ch3（心理）／Ch4（戰術、皮膚）正文：試閱 PDF、Issuu、Google Books 都只有目錄。要引用具體建議需實體書或電子書。
- ⚪ MacLeod《9 out of 10 Climbers》正文：只有 LiveHard 書評與 Mountain Project 兩個一致的二手引用。
- ⚪ 嘗試之間休息長度、每次 session 嘗試次數：沒有研究比較。
- ⚪ 攀岩專屬的觀眾效應、確保者信任與表現的研究：沒找到。
- 🟡 Gajdošík 2020（Frontiers 32581917）作者名單與「墜落恐懼只影響中低階」：只有二手轉述，引用前核原文。
- ✉️ Hörst「3–10 次後效率持平」的出處：只能問作者或當意見寫。
- ✉️ Antihydral 在台灣的許可證狀態：Keenable 搜「Antihydral 台灣 食藥署」「methenamine 外用 藥品許可證」只找到 TFDA 一般頁與蝦皮代購；TFDA 許可證查詢系統（lmspiq.fda.gov.tw）是互動式表單，未查。要寫進文章前需人工查詢或問藥師。
- ✉️ 台灣有沒有專門攀岩的運動心理師：問台灣運動心理學會或岩館。
- ✉️ 「磨線」「打 project」「flapper」台灣口語：問教練或社團。
- 台灣資料少是常態，不列為缺口。

---

# 附錄 A：心理（墜落恐懼與表現焦慮）原始紀錄


研究日期：2026-10-18｜研究者：subagent research-A｜用途：系列規劃輸入（不是成稿）
範圍：只談恐懼心理與心理技巧；墜落「力學／怎麼摔」站上已有文章，這裡只在心理需要時提及。

## toolDegradation

- (1) Groundlane MCP：已用 ToolSearch 載入 `web_search / web_fetch / paper_search`；第一次呼叫 `paper_search` 就回 `MCP server "claude.ai Groundlane" is not connected` ❌
- (2) Groundlane 直接 HTTP：POST `/mcp` 回 **HTTP 401**（tools/list）／回應內容空白 ❌
- (3) Keenable keyless：✅ 主要搜尋工具（約 30 次查詢，中英文都有）
- (4) You.com keyless：沒用到（Keenable＋Exa 已經夠用）
- (5) Exa `web_search_exa` / `web_fetch_exa`：✅ 用來讀 UKC（curl 被 403 擋）、Lattice、ScienceDirect、PMC、Warrior's Way PDF；firecrawl `firecrawl_scrape` → `not connected` ❌；jina r.jina.ai → 429 依 IP 限流 ❌；linkup → 連不上（404 server not found）❌
- 學術 API：PubMed E-utilities ✅（後來被限流，回空內容）；OpenAlex ✅；Semantic Scholar API → 429 ❌
- 直接 `curl` 加去除 HTML：✅ 大多數教練文章、redalyc、Airiti、台灣網站都用這個

圖例：✅ 已讀（全文或摘要）｜⚪ 確認拿不到（列出試過的工具）｜🟡 只讀到二手來源

---

## 1. 研究文獻：焦慮與攀岩表現

### 1a. 先鋒 vs 頂繩：先鋒真的比較焦慮嗎？（答案：中級者會，進階者不一定）

- ✅ **Draper et al. 2008**, J Sports Sci Med 7(4):492-8 — 『Effect of an on-sight lead on the physiological and psychological responses to rock climbing』，PMID 24149956（PubMed 摘要已讀）。設計：n=10 名中級者，on-sight 先鋒 vs 第二次先鋒。on-sight 時賽前身體焦慮與認知焦慮都比較高（t(9)=2.79, p=0.01；t(9)=1.94, p=0.043），攀爬時間比較長，攀後乳酸比較高 → 焦慮會「放大」生理成本。
- ✅ **Hodgson, Draper et al. 2009**, Br J Sports Med 43(7):531-5, PMID 18411238 — n=12，三種繩索保護條件（低／中／高壓力）。身體焦慮與皮質醇變化都隨壓力**線性**上升，自信隨壓力**線性**下降；皮質醇與認知焦慮呈三次方關係（R²=0.452）。結論：光是改變繩索怎麼設，就足以改變焦慮、皮質醇與自信。
- ✅ **Draper et al. 2012**, Int J Sports Med 33(1):13-7, PMID 21984397 — n=19 名中級者，on-sight 6a。**先鋒與頂繩在焦慮、自信、皮質醇上沒有顯著差異**；皮質醇與自信 r=-0.52、與認知焦慮 r=0.50 呈線性相關。
- ✅ **Fryer et al. 2013**, Scand J Med Sci Sports 23(5):645-50, PMID 22299663 — n=21 名**進階者**（22 Ewbank）。先鋒 vs 頂繩：CSAI-2R、皮質醇、VO2 都沒有差異，只有先鋒在路線**最後一段**心率顯著較高。作者推論：常練先鋒、習慣先鋒墜落的人，不覺得先鋒比頂繩更有壓力。
- ✅ **Aras & Akalan 2014**, J Sports Med Phys Fitness 54(1):1-8, PMID 24445539 — n=26 名中級者（平均先鋒資歷 5.7 年），同一條路線分別先鋒與頂繩，攀爬時間相同。先鋒時認知焦慮與身體焦慮比較高、自信比較低；VE、VO2、RER、MET 也比較高 → 「怕摔」本身就讓攀爬更耗能。
- ✅ **Baláš, Giles, Draper et al. 2017**, J Sports Sci 35(10):989-94, PMID 27400414 — n=9 名進階女性，所有快扣都扣 vs 只扣一半（潛在墜落距離加大）。只扣一半時總兒茶酚胺達基線的 890%（全扣 568%）、正腎上腺素 794% vs 532%、多巴胺 500% vs 210%。**潛在墜落距離越長，壓力荷爾蒙越高**。
- ✅ **Giles, Mangan & Draper 2025**, Physiol Behav 299:114986, PMID 40484106 — n=32 名中級者，三條難度相同的路線 on-sight，隨機分配頂繩／先鋒／先鋒加 run-out。先鋒與 run-out：動作流暢度下降（幾何熵上升，p<0.005）、認知焦慮上升（p=0.002）、自信下降（p=0.001）；只有 run-out 身體焦慮也上升（p=0.011）；唾液皮質醇與賽前心率沒有差異。作者建議介入重點：**降低認知焦慮＋提升自信**。
- ✅ **Giles, Mangan & Draper 2026**, Span J Psychol 29:e16, PMID 42304823 — n=61 名中級到進階者，各自爬一條高於／等於／低於自己 on-sight 等級的路線。路線越超出能力：身體焦慮與認知焦慮越高、自信越低、預期心率越高、動作越差；皮質醇沒有差異。
- ✅ **Swinarska et al. 2025**, BMC Sports Sci Med Rehabil 18:48, PMID 41470029 — 橫斷研究，n=100，波蘭三個城市的岩館。STAI 狀態焦慮：先鋒 40.1±9.2 vs 頂繩 33.1±6.3；46% 的人先鋒時狀態焦慮達「高」。相關因素：性別、BMI、攀登方式。
- 🟡 **Frontiers in Psychology 2020;11:997**（PubMed 32581917）『Effect of Height on Perceived Exertion and Physiological Responses for Climbers of Differing Ability Levels』— 只讀到摘要片段：在高處爬讓低等級攀岩者的 RPE 較高（12±1 vs 跑步機牆 11±1，p=0.040，d=0.41）。Turchetto 2025 引用時寫成「Gajdošík et al., 2020：墜落恐懼會影響低等級與中級攀岩者，但不影響進階與菁英」——**作者名單沒有核對過**。
- ✅ **Sci Rep 2021**, doi 10.1038/s41598-021-82184-6 『Psychophysiological responses to treadwall and indoor wall climbing in adult female climbers』— n=22 名女性，18 m 牆 vs 跑步機牆（貼近地面）。在牆上爬能量消耗高 16%；低等級者的兒茶酚胺在高牆上升 376%（跑步機牆 281%），進階者是 166%（跑步機牆 238%）→ 高度對低等級者的壓力影響比較大。

**系列重點**：剛學先鋒的人正好落在「中級、還不習慣先鋒墜落」這一段，研究一致顯示這群人的認知焦慮會上升、自信會下降、動作變僵硬又更耗力；Fryer 2013 的進階者則沒有這個差異。可以合理推論「習慣是能練出來的」，但**沒有縱向研究直接證明**，只有橫斷比較（見 §6 未解問題）。

### 1b. 焦慮如何讓動作變差（機制）

- ✅ **Pijpers, Oudejans, Holsheimer & Bakker 2003**, Psychol Sport Exerc 4(3):283-304, doi 10.1016/S1469-0292(02)00010-9（VU 研究入口網的摘要）— 兩個實驗，n=13 與 n=17 名新手，同一條橫移路線設在高處 vs 低處。高處：自評焦慮比較高、心率比較高、肌肉比較疲勞、乳酸比較高；攀爬時間比較長、幾何熵比較高（動作不流暢）。解釋：焦慮讓動作**退回到初學階段的控制方式**。
- ✅ **Pijpers, Oudejans & Bakker 2005**, Q J Exp Psychol A 58(3):421-45, PMID 16025756 — 高處橫移時攀爬時間變長、探索動作變多、握點抓得比較久、動作比較慢 → 支持 Masters 的「意識處理假說」（壓力 → 注意力轉向內在 → 有意識控制原本自動化的技巧）。
- ✅ **Nieuwenhuys, Pijpers, Oudejans & Bakker 2008**, J Sport Exerc Psychol 30(2):171-85, PMID 18490789 — 新手，高處 vs 低處橫移。焦慮時注視次數、總注視時間、平均注視時間都增加，而且主要集中在**要抓的手點**上（不是腳點、不是路線規劃）；搜尋速率下降 → 處理效率下降。
- ✅ **Hardy & Hutchinson 2007**, Anxiety Stress Coping 20(2):147-61, PMID 17999221 — 三個研究，用不同方式操弄焦慮，並控制體能消耗。符合處理效率理論：焦慮比較高時，**付出的努力通常比較多，表現也相應比較好**；但認知焦慮可能不是主要決定因素，而個人差異決定誰能把焦慮帶來的努力轉成表現。→ 「焦慮一定有害」是過度簡化。

### 1c. 比賽焦慮

- ✅ **Sanchez, Boschker & Llewellyn 2010**（線上版 2009），Scand J Med Sci Sports, doi 10.1111/j.1600-0838.2009.00904.x（OpenAlex 摘要）— n=19 名菁英男性，國際比賽。**成功的選手賽前身體焦慮比較高**，而且在路線最難的段落爬得比較**慢**。即使控制基線能力，賽前心理狀態仍然影響成敗。→ 支持 IZOF（個人最佳功能區）：激發不是越低越好。
- ✅ **Vrdoljak et al. 2024**, J Sports Med Phys Fitness 64(12):1348-56, PMID 38990193 — n=12，克羅埃西亞全國抱石賽。唾液皮質醇與 α-澱粉酶從賽前到賽後都上升（資格賽皮質醇 0.45→1.02 µg/dL）；資格賽前的皮質醇高於決賽前（0.45 vs 0.29）。
- ✅ **Piepiora, Kwieciński & Migasiewicz 2019**, J Educ Health Sport 9(5):516-33, doi 10.5281/zenodo.3235411（apcz.umk.pl 摘要）— n=30 名波蘭國家隊攀岩選手，d2 注意力測驗＋作者自編的墜落恐懼量表；約 66% 的男女選手得分為正向。品質：小型期刊、量表自編 → **只能當作佐證**。
- ✅ **Woodman & Hardy 2003**, J Sports Sci, doi 10.1080/0264041031000101809 — 一般運動的統合分析（k=48）：認知焦慮與表現 r=-0.10，自信與表現 r=+0.24（效果比較大）；高水準比賽中認知焦慮的效果比較強（r=-0.27）。→ 對攀岩的意涵：**建立自信可能比壓低焦慮更有用**（與 Giles 2025 的建議一致）。
- ✅ **Lutter, Tischer & Schöffl 2021**, BJSM 55(15):857-64, PMID 33036996 — 奧運攀岩敘述性回顧，內容幾乎都是傷害與醫療，**沒有心理資料** → 證實菁英比賽心理研究很少。

### 1d. 系統性回顧（總覽）

- ✅ **Mangan, Andrews, Miles & Draper 2025**, Psychol Sport Exerc（2025 年 1 月），『The psychology of rock climbing: A systematic review』— 篩選 504 筆，納入 83 篇。結論：攀岩者盡責、內在動機強、任務導向；新奇且有挑戰性的情境會帶出心流，並提升樂趣與表現；能力與自信、決策、觸覺／空間知覺、**把焦慮詮釋為助力的程度**相關；越有經驗的人越能管理風險，心理生理反應也越小。最適程度與如何培養仍不清楚。
- ✅ OpenAlex 摘要『Determinants for success in climbing: A systematic review』2019, J Exerc Sci Fit, doi 10.1016/j.jesf.2019.04.002 — 心理面：菁英攀岩者呈典型「冰山剖面」（POMS）。

---

## 2. 介入研究：真正測過效果的方法

| 研究 | 設計 | 介入 | 結果 |
|---|---|---|---|
| ✅ **Jones, Mace, Bray, MacRae & Stockbridge 2002**, J Sport Behav 25:57-73（coachsci.sdsu.edu 摘要） | n=33 名女性新手，4 堂技術課；實驗組加做腳本化意象訓練，對照組加做輕度運動 | 動機性一般精熟（MG-M）＋動機性一般激發（MG-A）意象 | 攀爬表現兩組相同；意象組**壓力比較低、對正確技術的自我效能比較高** |
| ✅ **Röthlin et al. 2021**, Curr Issues Sport Sci 6, doi 10.36950/2021ciss004（redalyc 全文） | RCT，n=60（平均 27.95 歲），兩週，介入組 vs 候補名單 | 心理衛教傳單＋5 次自我疼惜書寫 | 自我疼惜上升（F=4.33, p=.04, η²=.07）；**身體表現焦慮下降**（F=6.24, p=.02, η²=.10）；認知焦慮沒有改變 |
| ✅ **Garrido-Palomino & España-Romero 2023**, J Sports Sci 41(16):1518-29, PMID 37965818 | 有墜落恐懼的女性攀岩者，三組：心理組／訓練組／對照組。博士論文（dialnet tesis 345815）寫明 Study IV **n=11** | 情緒調節心理訓練 | 心理組與訓練組的攀爬能力都進步；心理組的認知焦慮與身體焦慮都下降（訓練組只有認知焦慮下降）；自信與內感受覺察（MAIA 5 個分量表 vs 2 個）提升比較多。**樣本極小**，能力是自評 |
| ✅ **Lumby et al. 2026**, The Sport Psychologist（OUCI 摘要；MMU e-space 643432） | 質性研究（IPA），5 人參加工作坊，訪談 3 人 | 理情行為治療 REBT 工作坊 | 恐懼「與表現壓力有關，不是與人身安全有關」；REBT 讓參與者脫離期待、能探索與享受。初步結果 |
| ✅ DOAJ：『REBT 對半職業青少年攀岩者非理性信念的影響』 | 準實驗，n=60，隨機分到實驗組／對照組，有一個月追蹤 | REBT | 非理性信念下降（只讀到摘要；期刊與國家沒有核對） |
| ✅ **Rey, Müller, Chiossi, Matviienko 2025**, SportsHCI 2025（flomue.com 與 OpenAlex 摘要） | 探索性研究，n=20，戴與不戴 VR 頭盔，從 5 m 高墜落 1–2 m | VR 墜落暴露 | 質性結果：VR「有潛力」，但需要縱向研究；VR 裡放大墜落高度沒有提升暴露感 |
| ✅ CHI 2019『The Role of Physical Props in VR Climbing Environments』（ACM 摘要） | 比較真實 10 m 攀爬、有實體道具的 VR、沒道具的 VR | — | 研究的是臨場感、壓力與焦慮；只讀到摘要開頭 |
| ✅ **Frenkel et al. 2019 HRSST**, Front Psychol 10:2249, PMC6813738 | 4 個研究，n=214 名新手：爬到 12 m，「跳進繩子」墜落約 3 m | 壓力誘發範式（不是治療） | 狀態焦慮**每次都上升**（中到大效果）；皮質醇只在 4 次中的 1 次上升；心率變異度結果不一致 → 墜落恐懼主要是**主觀**的 |
| ✅ **Frenkel et al. 2019**, Front Psychol 10:1719 | n=88 名男性學生，HRSST | 特質：感官尋求、正念 | 焦慮上升、皮質醇沒有上升；正念的「外在觀察」分量表與壓力反應相關（摘要被截斷） |

**沒找到**：任何針對「墜落練習（fall practice）」本身的 RCT。用 PubMed（`climbing AND fear of falling`、`fall training climbing fear`）、OpenAlex（`fall training climbing fear`）、Keenable（「fall practice RCT」相關字詞）搜尋，只找到上面這些相近的研究 → 結論：**墜落練習的效果目前只有教練共識，加上暴露治療理論的外推**（⚪ 確認沒有）。

### 2b. 一般心理技巧的證據（非攀岩專屬，給「自我對話／意象」篇當背景）

- ✅ **Hatzigeorgiadis et al. 2011**, Perspect Psychol Sci, PMID 26167788 — 32 篇研究、62 個效果量，自我對話 ES=0.48。**精細動作任務**與**新任務**效果比較大；精細任務用「指導式」比「激勵式」有效；有練習自我對話的介入比較有效。→ 剛學先鋒：扣繩、腳點這類精細技術，適合用指導式提示語（例如「腳踩好」「呼氣」）。
- ✅ **2025 多層次統合分析**, Behav Sci 15(5):685, doi 10.3390/bs15050685 — 86 篇研究，n=3593 名運動員：意象練習能提升表現；與一、兩種其他心理技巧合併效果更好（劑量細節沒讀到）。
- ✅ **Swann et al. 2017**, J Appl Sport Psychol, doi 10.1080/10413200.2016.1272650 — n=26，表現後訪談：有兩種不同的最佳狀態，「心流」（flow）與「關鍵時刻」（clutch），成因不同，表現中可以互相轉換。
- ✅ **Lochbaum et al. 2022**, PLoS One（sport psychology meta-analyses review）— 30 篇統合分析：有益的心理變項 d=0.51；有害變項（認知焦慮等）效果小且為負。

### 2c. 心流與正念（攀岩）

- ✅ **Delle Fave, Bassi & Massimini 2003**, J Appl Sport Psychol, doi 10.1080/10413200305402 — n=6 人喜馬拉雅山遠征，經驗取樣法：挑戰與能力都高時出現心流；追求心流可能是冒險的動機之一。
- ✅ **Schüler & Brandstätter 2014**『Flow on the rocks』（UZH 104469）— 只有高成就動機者，在重爬一條之前失敗過、超出能力的路線後，心流比較多 → 動機與誘因相符是心流的前提。
- ✅ **Turchetto et al. 2025**, Front Psychol 16:1518495, PMC12179196 — 橫斷研究，n=365（40% 女性）。SEM：攀岩自信是能力最強的心理預測因子；正念**反而是負向**預測因子（雙向關係）。
- ✅ **Jansen & Wolters 2025**, Sci Rep 15:38463, PMC12586483 — n=203：資深者在正念的「不評判」分量表比較高；與中等經驗者比，在情緒調節上有優勢。
- ✅ **Alp et al. 2026**, Front Psychol 17:1799925 — n=150：心理韌性與正念都能負向預測壓力（β 分別為 -0.33 到 -0.38、-0.29）；正念有調節作用。
- ✅ 『Exploring the relationship between mindfulness and rock-climbing: a controlled study』2021, Curr Psychol, doi 10.1007/s12144-021-01593-y — n=59：抱石後正念分數上升（摘要被截斷）。
- ✅ **Limonta et al. 2020**, Front Psychol 11:902, PMC7271724 — n=18 名進階男性：比起 on-sight，紅點時認知焦慮與身體焦慮比較低、自信比較高，動作比較快也比較流暢 → 「熟悉度」本身就能降低焦慮（用在「先在熟悉的路線上練墜落」）。
- ✅ **Vasile et al. 2022**, Front Psychol 13:1012792 — n=17 名青少年選手：意象產生能力對表現是**負向**預測（效果很小，0.5–1.5%）；作者推測意象能力強的人在崩潰時可能想太多。樣本小，只是參考。

---

## 3. 教練方法論與流派衝突

### 3a. 各教練立場（都已讀）

- ✅ **Hazel Findlay｜UKC『Where Climbers Go Wrong with Fall Practice』2024-01-11**（用 Exa 讀全文；curl 回 403）— 「90% 的攀岩者有墜落恐懼」；常見錯誤：(1) 完全不摔 (2) 摔得不夠多 (3) 摔還沒準備好的距離——「像跳進一缸狼蛛來治怕蜘蛛」，會**固化恐懼**，稱為「心理上的傷」，「微創傷對攀岩的影響可能比滑車韌帶斷裂更嚴重」 (4) 急著摔：沒學會忍受摔之前的預期 (5) 跳下而不是掉下：要被動離開岩壁、不要往下看 (6) 身體僵硬地摔（憋氣、抓繩、閉眼）(7) 忽略軟確保；把太多繩子放出去當作軟確保是錯的替代做法。也提到「女性比較不會魯莽面對墜落」，莽撞文化會把人排除在外。
- ✅ **Hazel Findlay｜FAQ 部落格** hazel-findlay.com/blog/faqs-about-building-a-strong-mind-for-climbing — 最常見的三種恐懼：墜落恐懼（包含高度、暴露、受傷）、失敗恐懼、表現焦慮；基礎是心態加上自我覺察；常見的錯誤是「降低挑戰到不怕」或「推太猛而固化恐懼」；失敗恐懼部分靠**重新定義失敗**。
- ✅ **Findlay「恐懼肌肉」**（TrainingBeta 逐字稿，Roanne van Voorst 轉述，2018）— 恐懼耐受度像肌肉，要持續維持；每次 session 前半小時熱身時都要摔；冬天抱石季過後更要練。
- ✅ **Angus Kille／Strong Mind Climbing 2025-07-10** — 與 Findlay 的 UKC 文同一套 7 點，另外加上「沒有融入一般攀爬」：在自然姿勢摔、做一個做不到的動作再摔、找一條安全但很難的路線；還有「把摔變成苦差事」。
- ✅ **Arno Ilgner（Warrior's Way）**：Climbing 雜誌連載 Part 6 與 Part 7（2020）＋官方《10 Tips For Practicing Falling》PDF（2024）— 漸進順序：掛在頂繩上練撞牆 → 約 60 cm 頂繩墜落 → 逐步加到約 3 m → 從最高的快扣開始先鋒墜落。**BEB**：呼吸（整個墜落過程都出聲呼氣）、眼睛（往身體移動的方向看）、身體（往後往下坐，不要跳）。**每輪 6–10 次就換人**（超過會疲勞、品質下降）。關鍵是「成就動機 vs 學習動機」——想把墜落練習「做完了事」本身就會壞事。融入熱身：扣頭上的快扣先摔 → 扣在腰 → 扣在膝。「少量但頻繁，比大量但偶爾好」。**地形選擇：用垂直牆，不要用大外傾**（要符合實際攀爬情境）。
- ✅ **Lattice × Allegra Maguire 2022-04-07** latticetraining.com/blog/fear-of-falling — 用恐懼消退（extinction）來解釋；劑量要小到「像看一部 PG-13 恐怖片」；疲勞或壓力大的日子就做簡單的；限制 session 長度（恐懼會讓人疲勞）；如果你會抓繩、繃緊身體、閉眼 → 退回比較簡單的墜落。三階段：頂繩彈跳／墜落 → 先鋒（在快扣下方 → 在快扣處 → 高於快扣，扣完繩後摔、在動作中摔）→ 融入紅點路線，接著練「超專注攀爬」。**建議從微外傾的牆開始**，再推進到垂直與 slab。也提到「放下自尊心」。
- 🟡 **Dave MacLeod《9 out of 10 Climbers Make the Same Mistakes》** — 只讀到二手引用（LiveHard 書評＋Mountain Project 討論串，兩者引用內容一致）：「累積墜落——不是一兩次，是好幾百次」；「每次 session 5–10 次先鋒墜落，持續一年，足以打破恐懼」；「每個運動攀登日 5–20 次墜落，持續一年」；「一次糟糕的墜落可以抹掉進度」。原書：⚪（沒有公開預覽；Keenable 只找到書評與論壇）。
- ✅ **Eric Hörst** — trainingbeta.com 引用他的文章：長期練習墜落之後就能在安全情境中「脫離」恐懼；遇到看起來安全卻怕的墜落，先做一次「**試摔**」——「你怕的是不知道墜落會是什麼樣子，不是墜落本身」。trainingforclimbing.com 影片頁：目標是「管理」而不是消除恐懼；「沒有速成」。
- ✅ **Alice Hafer《For Me, Fall Practice Was Bad Advice》Climbing 2025-05-19** — 第一人稱反例：在生活壓力下（父親中風）做墜落練習，「摔越多越糟」。引用 Madeleine Crane（Climbing Psychology）：「如果一個人在日常生活中就很掙扎，在那種狀態下也很難摔」。引用 Craske：恐懼會復發。一位學員在撞到岩階摔斷腳踝後，墜落練習「只有當天有效」，後來接受 EMDR。Findlay 的課程區分良性壓力（eustress）與苦惱壓力（distress）。結論：把注意力放回動作上，「學會該說 take 的時候就說 take」。
- ✅ **Vertical Mind**（McGrath & Elison 2014）— 只讀到 TrainingBeta 書評：書中有墜落恐懼與失敗恐懼兩章、行為修正演練、共創式教練（夥伴互相陪練）、心流。具體的 protocol 沒有讀到（原書 ⚪：Amazon／Goodreads 只有書籍資訊）。
- ✅ **Power Company Climbing｜Lor Sabourin 單集**（2021）— Warrior's Way 教練；高抱石恐懼的教練對話。只有節目說明，沒有具體方法。
- ✅ **The Climbing Bible（Mobråten & Christophersen 2020）** — 出版社試閱 PDF（adventurebooks.com）確認第 3 章目錄：動機與目標、逆境、**自信與內在對話**、嘗試失敗再失敗得更好、勇於嘗試、**墜落恐懼（p186）**、**失敗恐懼（p189）**、專注、**例行程序與儀式（p194）**、**壓力程度與控制（p197）**、**視覺化（p200）**、畫路線圖；第 4 章有比賽策略與「處理壓力」。〈十誡〉第 5 條：「擺脫你的墜落恐懼」。波蘭書評說第 3 章約 20 頁、「工具不多」。**正文**：⚪（試閱 PDF 與 Practical Exercises 試閱 PDF 都不含第 3 章正文；Google Books API 回應無法解析）。
- 🟡 **Max Climbing 部落格**（比利時器材零售商）— 4 級「不形成防禦性動作」的墜落 protocol（軟落 → 小墜落 → 動態放手 → 真實墜落），「絕對不要從讓你情緒緊繃的動作摔」。**權威性低**，只能當作佐證。

### 3b. 流派衝突（系列可以直接寫的張力）

1. **「量」派 vs「劑量」派**
   - MacLeod：好幾百、上千次，持續一年；
   - Findlay、Maguire、Ilgner：量要夠（Findlay 第 2 點也說「摔得不夠」），**但每次的強度要剛好**，摔太大會「固化恐懼」；Ilgner 每輪限 6–10 次。
   - 兩派其實同意「要長期、規律」，**真正的差別在單次強度與自我監測**。MacLeod 自己也承認「一次糟糕的墜落可以抹掉進度」。
2. **「直接摔下去」vs「慢慢感受預期」**：Findlay 說急著摔是錯的，要在摔前停幾秒、深呼吸，學會忍受預期焦慮；Max Climbing 的 Level 1 卻寫「不要心理準備」。→ 低權威來源和主流衝突，不採用。
3. **地形：外傾 vs 垂直**：Lattice／Maguire 建議從微外傾開始（減少撞牆的恐懼）；Ilgner 明確說不要選陡牆，要選垂直（貼近實際情境）。→ 系列可以並列，並說明各自的理由（降低恐懼 vs 練習的特定性）。
4. **墜落練習是萬靈丹嗎？** 主流說是核心方法；Hafer／Crane 說在生活壓力、創傷、焦慮症的狀態下可能適得其反，需要先處理整體壓力，或尋求專業協助（EMDR）。Findlay 也承認「摔得不對會固化恐懼」。
5. **焦慮該壓低還是該重新詮釋？** Giles 2025 建議壓低認知焦慮、提升自信；Sanchez 2010 發現成功的菁英選手身體焦慮比較高；Hardy & Hutchinson 2007 發現焦慮可以轉成努力。→ 用 IZOF 加上「方向性」（把焦慮詮釋為助力）來整合；Mangan 2025 的回顧也說「焦慮助益化」與能力相關。
6. **恐懼的來源是危險還是表現壓力？** Lumby 2026（REBT）發現受訪者的恐懼主要來自表現壓力，而不是人身安全；Findlay 的分類也把墜落恐懼和失敗恐懼分開。→ 系列可以拆成兩篇：「怕摔」與「怕失敗／怕丟臉」。

### 3c. 理論橋接（暴露治療）

- ✅ **Craske et al. 2014**, Behav Res Ther, PMC4114726 — 抑制學習模型：消退不是抹除舊的恐懼記憶，而是學到一個新的「安全」聯結，所以恐懼**可能復發**。最佳化策略有 8 項：預期違反、加深消退、偶爾強化的消退、移除安全訊號、**變化性**、提取線索、**多重情境**、情緒標記。→ 攀岩轉譯（**這是推論，不是攀岩研究結果**）：在不同牆角、不同岩館、不同確保者之間練墜落（變化性／多重情境）；摔前說出「我現在很怕」（情緒標記）；先預測「我會撞得很痛」再實際摔一次對照（預期違反）；不要每次都反覆檢查繩結當作安全儀式（移除安全訊號——MacLeod 的讀者也提到「離地前檢查一次，練摔時不再檢查」）。
- ✅ NICT 2025 新聞稿（VR 飛行降低懼高）— 「我掉下去也能飛」的行動式安全預測可以降低恐懼，挑戰「必須重複暴露」的傳統觀點。實驗室研究，與攀岩**沒有直接關係**。

---

## 4. 比賽心理（給「比賽焦慮」篇）

- ✅ **Climbing Psychology（Madeleine Crane 的機構）『How to Mentally Prepare for a Climbing Competition』** — 目標不是消除緊張，而是與緊張建立更好的關係；賽前與兩次嘗試之間的例行程序是最可靠的穩定器；也提到隔離區（isolation）的情境：安靜但緊繃、被叫到名字後瞬間噪音、觀眾、4 分鐘一題抱石；常見症狀：心跳加速、淺呼吸、睡不好、想著名次。
- ✅ **The Hidden Crux（Matt Leslie，2022）** — 訪談 8 位美國青少年攀岩教練，依壓力暴露訓練框架（SET；Driskell 2014：資訊提供 → 技能習得 → 模擬應用）設計工作坊（5 位 USAC 教練試行）。教練列出的壓力源：時間限制、觀眾、離開平常的支持系統、隔離時間不確定；認知症狀：負面自我對話、失敗恐懼、和別人比較；身體症狀：哭、發抖、心率上升。
- ✅ Sanchez 2010、Vrdoljak 2024、Piepiora 2019（見 §1c）。
- **證據缺口**：沒有針對攀岩選手的心理技巧 RCT；IFSC 選手的資料只有荷爾蒙與橫斷問卷。

---

## 5. 台灣／中文來源與用詞

- ✅ **百合搖滾 Wild Lily Rocks｜傳統攀登第一階段「墜落以及心理因素訓練」** wildlily.rocks — 「攀岩運動最大的心理障礙就是恐懼，尤其是墜落恐懼」；2 小時課程（內湖運動中心）：理論（運動生理、心理如何影響生理、墜落衝擊力／墜落係數）＋「各種情境墜落練習」；「很密集的墜落練習」「很多的墜落」；沒有課後團練：「想要具備健康、堅韌的心理因素，不是上課就可以達成的」。費用 NT$7,500／9,000。學員資格：TR 完攀 5.6、有上方確保卡。→ 台灣少數**把墜落練習包裝成心理課**的例子；它的語言偏「多摔、靠自我督促」，比較接近 MacLeod 派。
- ✅ **原岩攀岩館｜進階確保課（先鋒確保＆先鋒攀登）中和店** tupclimbing.tw/course/zhonghe/360 — 6 堂、每堂 1.5 小時、NT$7,500，課程內容列出先鋒確保、先鋒攀登技巧、攀登節奏；**沒有明確列出墜落練習或心理單元**（從課程頁看）。
- ✅ **蕭瑞國等 2006《北體學報》14:13-23** doi 10.6167/TPEC/2006.14.2「自我效能對攀岩表現與內在動機之影響」— n=41 名專科生，上 4 週攀岩課；高自我效能組的攀岩表現與內在動機都顯著較高。少數台灣攀岩心理學研究。
- ✅ **Outsiders 專訪姚廷蓁**（台灣國手；2022 全國賽女子先鋒冠軍）— 第一次參加全國青少年錦標賽：「全身都在發抖，肌肉也比較僵硬，爬起來的感覺跟平常不太一樣」；後來的心態：「過程多少會有壓力，但對我而言，那反而是一種讓我亢奮的元素」（＝把焦慮詮釋為助力）；處理方式：錄影回看、「正視焦慮，並找出焦慮源頭」、專注在訓練目標而不是完攀。→ 很好的在地案例。
- ✅ **臺中市政府新聞稿：2025 全國先鋒抱石運動攀登錦標賽**（5/30–6/1，Dapro 室內攀岩場）— 約 130 名選手；主辦：中華民國山岳協會；國手積分制；國手林嘉翔、姚廷蓁、謝昀珊參賽。→ 台灣比賽情境：全國賽＝爭取國手積分。
- ✅ **114 學年度全國青少年運動攀登錦標賽**（ctaa.j91.me/race/367，只看到搜尋結果標題）— 青少年賽事系統存在。
- ✅ LINE TODAY／Women's Health 雷艾美（2023）— 名人用自我喊話面對恐懼：「當你相信自己的時候，就會突然有一股力量」。屬於大眾媒體的自我對話例子，不能當證據。
- **用詞整理**（附出處）：
  - 「墜落練習」「墜落恐懼」「心理因素訓練」— 百合搖滾
  - 「先鋒攀登」「先鋒確保」「上方確保／Top Rope」— 原岩、百合搖滾
  - 「心理素質」「內在對話」— LINE TODAY 雷艾美文
  - 「心魔」「焦慮」「心態」「壓力」— Outsiders 姚廷蓁專訪
  - 「國手積分」「全國先鋒抱石運動攀登錦標賽」— 臺中市府
  - 中國用語「冲坠」（＝先鋒墜落）：百度百科有詞條，但頁面內容抓不到（curl 只拿到 21 bytes）⚪；寫作時建議用台灣慣用的「墜落／先鋒墜落」，括號註明 lead fall。
  - 「take」（喊收繩）是台灣岩館直接使用的英文口語（百合搖滾資格寫「不能 take」）。
- 台灣來源**稀少是常態**，不列為研究缺口。

---

## 6. 未解問題／系列寫作提醒

1. **沒有墜落練習的 RCT**：所有「練摔有用」的說法都是教練共識＋暴露治療理論的外推＋橫斷研究（進階者先鋒不焦慮）。寫作時要明講「研究顯示 X 有關聯；墜落練習的直接效果研究不存在」。
2. 先鋒焦慮研究的樣本多半很小（9–32 人），而且多半是西方岩館的中級男性；Swinarska（n=100）是比較大的。
3. 「劑量」沒有統一標準：Ilgner 每輪 6–10 次、MacLeod 每天 5–20 次、Maguire「PG-13 程度」——是主觀指標。系列可以提供「自我監測清單」（抓繩／閉眼／憋氣 → 退一級；Findlay、Maguire、Ilgner 都同意這點），比給數字更可靠。
4. 需要專業協助的界線：創傷後（摔傷過）、焦慮症、生活重大壓力 → 建議尋求運動心理師（Hafer／Crane）。台灣有沒有攀岩專門的運動心理師：**沒查到**（✉️ 需要詢問台灣運動心理學會或岩館）。
5. The Climbing Bible 第 3 章與 MacLeod 原書正文沒有讀到（⚪）；如果系列要引用它們的具體建議，需要實體書。
6. Gajdošík 2020（Frontiers 32581917）的作者名單與「墜落恐懼只影響中低階」這個說法，只有二手轉述，引用前要核對原文。
7. 正念與能力負相關（Turchetto 2025）和正念降低壓力（Alp 2026）看似矛盾——兩者都是橫斷研究，不能推論因果；寫作時不要宣稱「正念會讓你爬更好」。

## 來源計數

✅ 已讀約 45 筆（研究 30＋、教練／媒體約 15）、🟡 3 筆（MacLeod 原書內容、Gajdošík 作者、Max Climbing 低權威）、⚪ 4 筆（Climbing Bible 正文、MacLeod 原書、Vertical Mind 原書、百度「冲坠」）、✉️ 1 筆（台灣攀岩運動心理師）。

---

# 附錄 B：戰術（redpoint／onsight／嘗試與休息／繩伴／比賽）原始紀錄


Date: 2026-10-18 · Audience: Taiwanese climbers who just started leading · Feeds: blog series plan
Note: the site already covers route reading (Sanchez 2012, BMC checklist, shake-out, G-Tox). Link to it; below is what is NEW.

## toolDegradation
- Groundlane MCP (`mcp__claude_ai_Groundlane__*`): loaded with ToolSearch, call failed: "MCP server claude.ai Groundlane is not connected".
- Groundlane direct HTTP (POST /mcp): HTTP 401.
- Keenable keyless API: **worked**. Main search engine for this note.
- PubMed E-utilities / OpenAlex / Crossref via curl: worked. Abstracts come from here.
- Exa (`web_fetch_exa`, `web_search_exa`): worked. Used for UKC, the Climbing Bible PDF lookup, and MacLeod.
- jina MCP / firecrawl MCP / linkup MCP: "not connected" (linkup returned 404 "Server not found"). r.jina.ai via curl: 429 rate limit.
- Plain curl + HTML strip: worked for most coaching sites.
- ⚠️ `hazelfindlayclimbing.com` is a **casino spam domain**: the page content is "Non GamStop Casinos UK", and Exa flags it CRAWL_MODERATED_GAMBLING. Do NOT cite it as Hazel Findlay.

---

## 1. Redpoint / projecting

### Research
- ✅ **"On-Sight and Red-Point Climbing: Changes in Performance and Route-Finding Ability in Male Advanced Climbers"** (authors not recorded; check PMID) (Front Psychol 2020, PMID 32547440) https://pubmed.ncbi.nlm.nih.gov/32547440 — 18 advanced males (best RP 7b+/8a, OS 7a+/7b+) climbed the same route OS and then RP. RP was faster (148.7±13.6 s vs 179.5±12.5 s) and smoother (fewer exploratory moves, shorter stops). It was also lower in peak HR, peak lactate, RPE, and cognitive/somatic anxiety, with higher self-confidence. Route-interpretation ability improved RP vs OS and pre→post. Conclusion: route interpretation is trainable. **Use: explains physiologically and psychologically why redpointing feels easier than onsighting.**
- ✅ **Orth et al. 2018, "Behavioral Repertoire Influences the Rate and Nature of Learning in Climbing"** (Front Psychol, PMID 29946284) https://pubmed.ncbi.nlm.nih.gov/29946284 — 8 beginners, 42 trials over 7 weeks on the same route. Three learning dynamics: continuous improvement, sudden improvement (linked to finding a new body-wall orientation), and no improvement in fluency (but more distance climbed). **Use: progress on a project is non-linear; a sudden "it clicked" is real.**
- ✅ **Hacques, Komar, Seifert 2021, "Learning and transfer of perceptual-motor skill: gaze and behavioral exploration"** (Atten Percept Psychophys, PMID 33759114) https://link.springer.com/content/pdf/10.3758/s13414-021-02288-z.pdf — 7 participants, 10 sessions on one route. Exploratory hand movements and fixations dropped with practice and gaze became more goal-directed. Some search came back at the retention test. On new routes, learners explored more by eye than by hand. **Use: what "working a route" is doing — moving exploration from hands to eyes.**
- ✅ **Hacques et al. 2023 (Psychol Res, PMID 37027038) "Exploring in a climbing task… sense-making"** https://pubmed.ncbi.nlm.nih.gov/37027038 — 12 participants, 10 sessions, self-confrontation interviews. Seven phenomenological clusters during previews and climbs; the "chosen novelty" group differed from the others. Qualitative support only.
- ✅ **Hacques et al. 2024 (Res Q Exerc Sport, PMID 38324768)** https://pubmed.ncbi.nlm.nih.gov/38324768 — self-controlled variability (learners choose when to try new routes) seemed to help flexibility. Forced (imposed) variability was no better than constant practice. **Relevant to "siege one route vs. climb many routes".**
- ✅ **Hacques et al. 2022 PLoS One (PMID 35687600)** https://pubmed.ncbi.nlm.nih.gov/35687600 — on the training route the constant-practice group beat the imposed-variability group. Transfer-route fluency did not differ. Variability produced a more proactive gaze. **Use: projecting one route makes you good on that route, not automatically on others. Supports Hörst's and Findlay's "don't only project".**
- 🟡→⚪ Hörst's claim that "a couple of research projects hinted efficiency gains level off between 3 and 10 attempts" (see Hörst 10-4 below). He names no citation. Searched PubMed and OpenAlex (Cordier entropy, Seifert fluency, repeated trials) and found no paper with that 3–10 figure. Orth 2018 (42 trials, individual curves) is the closest. **Treat as coach claim; do not present as research.**

### Coaches (consensus = coach opinion, not tested)
- ✅ **Eric Hörst, "The 10-4 Rule"** (Nicros reprint, ©2015) https://nicros.com/training/training-articles/the-10-4-rule-a-guideline-for-projecting-and-improving-your-climbing — for weekend warriors: **10 redpoint attempts over 4 days**, then move on. He himself uses about 5 attempts over 2 days. Reasons: climbing is a skill sport, so volume is what teaches; repeated failure kills confidence; efficiency plateaus at about 10 attempts, after which you need strength. Five exceptions: a complex crux or a low-percentage dyno; the end of a trip with the send imminent; a local crag; a game-changing rest or beta found on go 9; being a pro. Also an **80/20 crag rule**: 80% of outdoor time on routes you can onsight, flash, or second-go; ≤20% on projects that take 3+ attempts. Mentions Megos's quick-send style.
- ✅ Salt Pump Climbing restatement of 10-4 https://saltpumpclimbing.com/training-the-10-4-rule — confirms the reading ">10 tries or 4 days → leave it for a future season".
- ✅ **Hörst "Projecting 101 – 6 tips"** (TrainingBeta summary, 2016) https://trainingbeta.com/projecting-rock-climbs-with-eric-horst — pick the right route; break it into **3–5 chunks**; spend time on crux beta; dial the crux until automatic; **rest 30–60 min before a redpoint go**; go in calm and expecting success. The original trainingforclimbing article was not opened; the summary was enough.
- ✅ **Hörst Podcast #68 "Anatomy of a Redpoint"** https://trainingforclimbing.com/podcast-68-anatomy-of-a-redpoint-project — case study: 7c+ Hercules done in 3 sessions. Session 1 sussing; session 2 working **4 "chunks"** with fears tackled first, "mental snapshots" of key holds, then 2 redpoint goes; visualization between sessions; sent in session 3. **Good template for the "how many sessions" post.**
- ✅ **Steve Bechtel / Climb Strong, redpoint pyramids** (TrainingBeta summary, 2016) https://trainingbeta.com/organizing-your-cragging-program — classic 5-4-3-2-1 pyramid, long-cycle, in-season, onsight pyramids, and "project + sub-project climbing". The purpose is to stop project-only climbers losing fitness and to push onsight-only climbers onto harder routes. **This is the "redpoint pyramid" answer to "siege".**
- ✅ Bechtel flowchart "What should you be training?" https://climbing.com/skills/what-to-train-to-redpoint-your-project — decision tree for what is limiting the redpoint (opened; it gives diagnostic framing more than tactics).
- ✅ **Lattice (Tom Randall) "Top 10 Projecting Strategies for beginners & intermediate"** (podcast notes, 2022) http://latticetraining.com/blog/sport-climbing-top-10-projecting-strategies-for-beginners-and-intermediate — energy conservation; clipsticks; YouTube beta; using tiredness to your advantage; brushing to get familiar; end-of-day recaps; learning your rests; route maps/topos; **using early lead attempts for mental gains**; dealing with choking and **"top-down" links**. Only the topic list is on the page; the audio was not transcribed.
- ✅ Lattice "Short projects: tactics for trips" (2021) http://latticetraining.com/blog/short-climbing-projects-tactics-for-trips-quick-sends and Lattice Q&A (2020) http://latticetraining.com/blog/ask-lattice-with-tom-ollie-webinar-recording-from-july-27th — these define **short-term projects as 5–14 sessions and long-term as 15+**. Both pages list topics only; the conclusions are in the video (✉️ if needed).
- ✅ **Neil Gresham, "Improve two grades instantly"** (Climbing.com, 2023-08-17) https://climbing.com/skills/improve-two-grades-instantly-with-coachs-magic-bullet-advice-six-tips-that-actually-work — start the day on a slab for footwork. **Get 60–80% pumped on the warm-up** to avoid "flash pump". For a redpoint, warm up by doing **links of 3–4 clips** instead of bolt-to-bolt. Take practice falls. "Just try it" (quoting Lucy Creamer). Believe in yourself.
- ✅ **Dave MacLeod "5 ways to send your project"** (2020-01-07; the blog page only teases the video) https://www.davemacleod.com/blog/5waystosend — content seen only through a UKC forum viewer's notes (https://www.ukclimbing.com/forums/bouldering/does_projecting_make_you_a_better_climber-719801). Points: rest about 2 min per hard move between tries, 20–45 min between full attempts; keep notes; visualize; brush holds; plan for conditions; a partner can help or hurt. **Secondhand; mark as such.** MacLeod also has a vlog "I am a quitter" on *tactical quitting* (listed on https://www.davemacleod.com/blog/category/mental+training). Useful for the "when to give up" angle, but the vlog was not watched.
- ✅ MacLeod on Hague & Hunter's book *Redpoint* (2012) https://davemacleod.blogspot.com/2012/06/redpoint-whole-book-on-tactics-finally.html — notes that a whole book on redpoint tactics exists. Book not read.
- ✅ **Arno Ilgner, "Deliberate Transitions are Ambiguous"** (chockstone.org) https://chockstone.org/TechTips/Transitions.htm — climbing = stopping and moving. At stances: rest, assess, plan. Each stance is a decision point with a transition: let go of the old → neutral zone → embrace the new. Being deliberate means committing fully, not "climbing without stopping". **This is the Warrior's Way "rest–climb" idea in its own words.**
- ⚪ Warrior's Way "Art of Redpointing" course page https://warriorsway.com/course/art-of-redpointing-online-course-with-climbing-magazine — curl got 72 bytes; Exa CRAWL_NOT_FOUND; jina/firecrawl not connected.

### The Climbing Bible (Mobråten & Christophersen), Ch.4 Tactics
- ✅ **TOC from the official publisher sample PDF** https://www.adventurebooks.com/cdn/shop/files/The_Climbing_Bible_Issuu.pdf — Ch.4 Tactics, pp.206–252: When should I climb? (209) · Friction (211) · Who should I climb with? (216) · How many attempts can I have? (219) · Skincare (220) · How do I prepare mentally? (224) · How do I climb the route and the different sections? (227) · How to redpoint a route (228) · Magnus vs Neanderthal (235) · How to redpoint a boulder problem (239) · Stian vs Eurofighter (241) · How to on-sight a route (245) · How to flash a route or boulder (246) · Competition strategies (248): Lead (248), Bouldering (250), Tactical preparations / Competition plans / Dealing with stress / **Binoculars, pen and paper** (252). **This is a ready-made outline for the series.**
- ⚪ Ch.4 body text: the 27-page sample PDF holds the TOC and Ch.2 deadhang pages only. Also tried Issuu (Exa CRAWL_NOT_FOUND, r.jina.ai 429), the Google Books API and in-book search (no snippets), and firecrawl/jina/linkup (not connected).
- ✅ StrengthClimbing review (2020) https://strengthclimbing.com/the-climbing-bible-review/ — confirms Ch.4 covers shoes, skin, warm-up, Magnus on Neanderthal, OS/flash/RP strategies for routes and boulders, and competitions.
- ✅ The companion *Practical Exercises* sample PDF https://www.adventurebooks.com/cdn/shop/files/The_Climbing_Bible_Practical_Exercises_Issu1.pdf — its strength-bouldering prescriptions give **rest ≥3 min between tries, 15 total tries (5 on each of 3 problems)**. This is a training prescription, not a tactic, but it is a useful benchmark for "how many attempts per session".

## 2. Onsight & flash

### Research
- ✅ **Morenas et al. 2021, "Influence of On-Sight and Flash Climbing Styles… Bouldering"** (IJERPH, PMID 34886320) https://pmc.ncbi.nlm.nih.gov/articles/PMC8657215 — 21 advanced climbers (7b–7c+) did 18 boulders of 6c under three conditions: no preview (onsight), video-model preview, and real-model preview (flash). **Real-model preview gave the most tops**; onsight gave more failures than either flash condition. **NEW vs. the existing post: watching a live climber beats watching video, and both beat reading alone.**
- ✅ **Seifert et al. 2017, "Role of route previewing strategies on climbing fluency and exploratory movements"** (PLoS One, PMID 28441425) https://pubmed.ncbi.nlm.nih.gov/28441425 — 8 inexperienced and 10 experienced climbers, eye-tracking during preview, a 5b top-rope route. Four preview strategies: fragmentary, ascending, zigzagging, sequence-of-blocks. **More scan paths → more relative exploration time and less hold-change time.** Sequence-of-blocks and zigzag strategies were associated with more immobility. This is correlational and goes against the naive "more reading = smoother". The authors frame preview as perceiving "nested affordances".
- ✅ **Boschker, Bakker, Michaels 2002 (J Mot Behav, PMID 11880247)** https://pubmed.ncbi.nlm.nih.gov/11880247 — 7 experts, 4 novices, and 9 inexperienced people recalled a 23-hold wall. Experts recalled more, in clusters, and **functionally** (what you can do with a hold). Novices recalled structural features. **Use: how to read like an expert — chunk into actions, not hold shapes.**
- ✅ **Boschker & Bakker 2002 (Percept Mot Skills, PMID 12365268)** https://pubmed.ncbi.nlm.nih.gov/12365268 — 24 inexperienced climbers watched an expert model, a novice model, or a wall-only video, 5 cycles. They picked up and used the modelled actions and climbed faster and more fluently (geometric entropy). **Evidence for beta-sharing / watching others.**
- ✅ **Whitaker, Pointon, Tarampi, Rand 2020, "Expertise effects on perceptual and cognitive tasks of indoor climbing"** (Mem Cognit, PMID 31667757) https://pubmed.ncbi.nlm.nih.gov/31667757 — skilled climbers were *less confident* but more *accurate* about which moves they could do. Expertise predicted hold memory and the accuracy of planned and recalled sequences. **Use: beginners overestimate themselves on single moves; route reading is a memory skill that improves.**
- ✅ **Sanchez et al. 2012** (already on site, PMID 20561271) https://pubmed.ncbi.nlm.nih.gov/20561271 — re-checked: 29 males, a 3-min preview did not change completion but reduced the number and length of stops; experts benefited most. Just link to the existing post.
- ✅ **Identification of parameters that predict sport climbing performance** (Front Psychol 2019, PMID 31214092) https://pubmed.ncbi.nlm.nih.gov/31214092 — 10 expert climber-coaches (7a+ to 8b onsight) named route preview a key parameter, along with route management, risk management, and **peer communication**. Expert opinion (Delphi-style), not an experiment.
- ✅ **Attentional differences vs climbing ability** (Front Psychol 2020, PMID 32793035) https://pubmed.ncbi.nlm.nih.gov/32793035 — 35 climbers. Attention accuracy was linked to self-reported **onsight** grade (β=0.388, p=0.031) but not significantly to redpoint grade (p=0.064). Supports "onsight is more cognitive"; weak, cross-sectional.

### Coaches
- ✅ **Neil Gresham, "How to Get Better at Onsighting Hard Rock Climbs"** (Climbing.com, 2022-02-28) https://climbing.com/skills/reading-routes — **graded reading levels**: L0, first 2 warm-ups, no reading; L1, warm-ups 3–4, identify holds and quick hand sequence; L2, onsight range, hand sequence + rests + clips (repeat 2×); L3, at or just above max onsight, add key feet and body positions (repeat 3×). Mime the moves. View from below and the side. **Plan the hand sequence exactly but keep feet loose**: deciding foot order too rigidly confuses you. On overhangs, left footholds usually pair with the right hand. Overlaps the existing post, but the "levels by grade" idea is new.
- ✅ **Natalie Berry, "The Unknown: Top Ten Tips to Improve your Onsight Grade"** (UKC, 2017-04-19) https://ukclimbing.com/articles/skills/the_unknown_top_ten_tips_to_improve_your_onsight_grade-9300 (via Exa) — look at the route and resist YouTube beta; practise reading (chalk, polish, quickdraw line, binoculars, route mapping on paper); **plan clips from the ground** (straight-arm clips, double clips); **plan 3+ moves ahead en route** (driving analogy); **find a pace** (fast on steep, slower on technical). Only tips 1–4 of 10 were extracted (maxChars limit).
- ✅ Gresham warm-up tip (above): get 60–80% pumped before a hard onsight to avoid flash pump.
- ✅ Hörst 80/20: onsight and flash volume as the main skill builder (above).

## 3. Attempts per session & rest between burns

### Research
- ✅ **Heyman et al. 2009, "Effects of four recovery methods on repeated maximal rock climbing performance"** (MSSE, PMID 19461534) https://pubmed.ncbi.nlm.nih.gov/19461534 — 13 well-trained women did two climbs to exhaustion on a pre-practised 6b overhang with **20 min of recovery** between them. Performance was **maintained with active recovery (cycling 30–40 W) or cold-water immersion of the forearms (3×5 min at 15 °C)**. It **dropped with passive rest or electrostimulation**. **Implication: sitting still for 20 min between burns is worse than easy movement.**
- ✅ **Valenzuela et al. 2015, "Effect of two types of active recovery on fatigue and climbing performance"** (J Sports Sci Med, PMID 26664273) https://pmc.ncbi.nlm.nih.gov/articles/PMC4657419 — 14 subjects did 3× 2-min climbs with **2-min recoveries**. **Easy climbing as recovery** beat walking: lower lactate (d≈0.7) and more metres climbed (d=0.6).
- ✅ **Draper et al. 2006, "Effects of active recovery on lactate, HR and RPE in climbing"** (J Sports Sci Med, PMID 24198686) https://pubmed.ncbi.nlm.nih.gov/24198686 — 10 recreational climbers did 5× 2-min climbs with 2 min active or passive recovery plus 1.5 min refocusing. Active recovery gave lower lactate and RPE.
- ✅ **Baláš et al. 2016, "Active recovery of the finger flexors enhances intermittent handgrip performance"** (Eur J Sport Sci, PMID 27491378) https://pubmed.ncbi.nlm.nih.gov/27491378 — 22 climbers. **Shaking the forearm beside the body** vs holding the hand over a hold: +22% intermittent test time, +28% force-time integral, +32% faster reoxygenation. (Shake-out is already on site, but this gives the numbers.)
- ✅ **White & Olsen 2010, time-motion analysis of competitive bouldering** (JSCR, PMID 20386481) https://pubmed.ncbi.nlm.nih.gov/20386481 — 6 elite UK climbers at a national comp: **3.0±0.5 attempts per problem**, attempts of 28.9±10.8 s, **rests between attempts 114±31 s**. Work:rest ≈ **1:4**.
- ✅ **Augste/Winkler et al. 2022, "The Load Structure in International Competitive Climbing"** (Front Sports Act Living, PMID 35392592) https://pmc.ncbi.nlm.nih.gov/articles/PMC8980921 — international boulder comps: median **3 attempts per boulder in qualification and semi-finals, 4 in finals**; mean attempt 27.0 s. Lead: about 4:09 (W) / 4:18 (M) min of climbing, about 31 actions, 6.2–6.4 s contact time per hold.

### Coaches
- ✅ **Hörst, Training Café #38 "Optimal rest interval between climbing attempts"** (2021-04-23) https://trainingforclimbing.com/training-cafe-38-optimal-rest-interval-between-climbs/ — boulders: **about 1 min of rest per rigorous move**; powerful moves need less, since you are not pumped. Sport routes: **fall low → about 20 min; fall mid-way → about 40 min; fall high on a long route → about 60 min**.
- ✅ Hörst Projecting 101: 30–60 min before a redpoint go. MacLeod (secondhand): 2 min per hard move between boulder tries, 20–45 min between route attempts.
- **Conflict / gap:** coaches prescribe 20–60 min between route burns; Heyman's research used only 20 min, and in that window passive rest *lost* performance. No study tests 20 vs 40 vs 60 min. **For the series: "rest long AND rest active (easy traverse, walk, shake)" fits both sources. Exact minutes are coach heuristics.**

## 4. Who to climb with (partner effect, belayer trust, social facilitation, beta)

- ✅ **Bond & Titus 1983, "Social facilitation: a meta-analysis of 241 studies"** (Psychol Bull, PMID 6356198) https://psycnet.apa.org/record/1984-01336-001 — about 24,000 subjects. The presence of others had **small effects (0.3–3% of variance)**: it speeds up simple tasks and impairs complex ones. General psychology, not climbing. **No climbing-specific social-facilitation experiment was found** (PubMed "climbing audience presence performance" = 0 hits).
- ✅ **"Balancing the Bar — Influence of Social Behaviour on Sport Climbing Performance"** (IJERPH 2022, PMC9368498) https://pmc.ncbi.nlm.nih.gov/articles/PMC9368498/ — qualitative interviews with 6 German higher-elite climbers (≥8c+/8b). Categories: negative egoistic behaviour (hogging the line, choosing times that suit only yourself, staying in a bad mood after failing, which affects the partner's performance), positive supportive behaviour, and the **"balanced behaviour"** ideal. All six said they were more egoistic when younger. n=6, so qualitative only.
- ✅ **Evin, Sève, Saury 2013, "Construction of trust judgments within cooperative dyads"** (Phys Educ Sport Pedagogy) https://doi.org/10.1080/17408989.2012.754002 — school climbing lessons; how students build trust judgments about their partner. Only Crossref metadata was obtained (abstract empty; tandfonline curl returned 18 bytes). ⚪ for content.
- ✅ **Boschker & Bakker 2002** (above) — evidence that watching a model transfers beta. **Morenas 2021** — a live model beats video.
- ✅ **Hörst, "Training Partners: Performance Booster or Hidden Distraction?"** https://trainingforclimbing.com/do-training-partners-boost-performance-or-distract-and-detract/ — high-intensity or technical work (hangboard, campus, max strength) is best alone. Partners help with intervals, **projecting and route climbing** (a better beta sequence, body position, encouragement), and accountability. Watch out for the gym turning into a 3-hour social event.
- ✅ **Climbing.com, "Do Climbers Actually Appreciate Verbal Encouragement?"** (2023-06-19) https://climbing.com/culture-climbing/climbers-appreciate-verbal-encouragement — situational. Occasional encouragement at cruxes signals "the belayer is with me". Vague "you got this, you'll send" adds pressure (Heather Weidner); "Nice!" and "I'm with you!" are fine. Too many onlookers distract. Some find a spotter's voice distracting in bouldering, while ex-comp climbers feed off a crowd. Anecdotal.
- Belayer trust & fear: no climbing study on belayer identity vs. performance was found. Gresham and Ilgner (practice falls, commitment) cover fear indirectly. ⚪ for direct evidence (PubMed "climbing partner belayer trust" = 0).

## 5. Competition tactics

### Rules (primary)
- ✅ **World Climbing Event Regulations v3, Jan 2026** https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/brsjsyh2ea4fxinl8nsa.pdf — **Lead**: qualification = 2 routes, **flash** (a route demo video ≥60 min before start), 6 min; semi-final and final = 1 route, **on-sight, 6-min collective observation**, 6 min climbing. **Boulder**: qualification 5 boulders on-sight, 5-min fixed rotation; semi 4 boulders, 5 min fixed; **final 4 boulders, 4 min max, with a 2 min per boulder collective observation** beforehand. 15-s interval between rotations. **Scoring**: top = 25, zone = 10, **−0.1 per unsuccessful attempt**, minimum 0.
- ✅ **World Climbing Competition Rules v3, Jan 2026** https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/jaq7awz9jmqwpddwnbpr.pdf — in observation you may touch the start holds (and route holds reachable from the ground on lead) but not practise moves. You **may use binoculars and hand-written notes/sketches; no photos or recordings**. You may share observation info with another competitor only if neither has attempted. Watching other competitors' attempts is prohibited.
- ✅ World Climbing lead page https://www.ifsc-climbing.org/lead/index — 6-min limit and 6-min collective observation; no observation in qualification. ✅ Boulder page https://worldclimbing.com/boulder/index — 2 min per boulder in finals; this page still lists the old tops/zones/attempts ranking (outdated vs. 2025 points).
- ✅ **World Climbing news 2025 rule changes** https://worldclimbing.com/news/new-rule-changes-take-effect-for-ifsc-world-cup-series-2025 — 25/10/−0.1 points; flash = 25, second go = 24.9. Boulder semis grow to 24 athletes and finals to 8.
- ✅ **Inside Climbing deep dive** (2025-03-12) https://inside-climbing.com/2025/03/12/deep-dive-looking-new-2025-ifsc-boulder-format — tactical consequence: **falls are no longer split between zone and top, so a flash matters less**. "Top in 1 + zone in 2" = "top in 2 + zone flashed". A 10-pt zone rewards consistency. The IFSC rejected −1/fall because it would discourage extra attempts. ✅ 2025 review https://inside-climbing.com/2026/01/19/2025-reivew-part-2-boulder-points-system (context).

### Research
- ✅ **Time Management Strategies in World Cup Bouldering Finals** (J Hum Kinet 2023, PMID 37181256) https://pmc.ncbi.nlm.nih.gov/articles/PMC10170546 — 56 boulders, 2019 season finals, 240 s per boulder. Attempts per boulder: slab 3.7±2.3 vs non-slab 3.8±2.4 (no difference). Time actually climbing: slab 92±36 s vs non-slab 65±26 s; on slabs, attempts were longer and rests shorter. Per-attempt success: 14.8% on slab, 12.9% on non-slab, 28.4% on coordination moves, 38.1% on zone attempts. Share of all tops reached after attempt 1: 28% (slab) vs 44% (non-slab); the two converge by attempt 3. **No success after the 6th attempt** (excluding one outlier). Caveat: finalists only, skewed by skill. **Use: "if you haven't got it in about 5 goes, bank the zone / move on" is a data-backed heuristic for amateur comps too (with caveat).**
- ✅ White & Olsen 2010 and Load Structure 2022 (above): about 3 attempts/boulder, about 27–29 s per attempt, about 2 min rest between attempts.

### Coaches
- ✅ Climbing Bible TOC: competition plans, dealing with stress, binoculars/pen/paper (body ⚪).
- ✅ USA Climbing para rules discussion (2025) https://usaclimbing.org/wp-content/uploads/2025/04/Para-Climbing-Rules-Discussion.pdf — explains observation practice: 6 min, touch reachable holds with one foot grounded, talk with other isolated competitors, binoculars and notes allowed. Not opened in full beyond the snippet. 🟡 low priority (the IFSC primary rules already cover it).

### Taiwan comps
- ✅ **2024 全國青少年抱石巡迴賽 競賽規程**（中華民國山岳協會運動攀登部）https://itsrcowebs.com/Files/archives/article/100015/c9f597418ddd4f339d8d65a41c38150c_2024-全國青少年抱石巡迴賽-風城-競賽規程_202400610%20(1).pdf — 比賽規則「依據『2024 年 IFSC 運動攀登規則』」；正式賽制＝資格賽、複賽、決賽；國小組採「**大亂鬥**」（jam format）推廣賽；有「**隔離區**」；裁判由山岳協會運動攀登部指派。→ 台灣全國賽直接沿用 IFSC 規則，所以 IFSC 戰術可以直接搬用。

## 6. Taiwan terminology (with source)
- ✅ **VARO 抱石術語大全**（zh-TW）https://getvaro.app/articles/bouldering-terms — Project「正在挑戰的路線」；**Projecting「練線」**；**Link「串動作／連段」**；Send「完攀」；**Flash「一次完攀」**（可先看別人爬、聽 beta）；**Onsight「看過就上、一次完攀」**（可以自己在地面讀線）；**Redpoint「練過後完攀」**，「在先鋒攀登特別常用」；Repeat「重爬」；FA「首攀」（指路線第一次被完成，**不是 onsight**）；Session「一次攀爬」；並註明「中文譯名沒有統一」。
- ✅ **攀岩小妞 climbingninjette 抱石術語** https://climbingninjette.com/2024/04/29/climbing-terms/ — 直接用英文 Flash / Onsight / Project / Pump，中文解釋為「第一次嘗試就完攀（可以有事前資訊）」與「零資訊下一次完攀」；指出 IFSC onsight 輪次有隔離區。
- ✅ **中文維基「攀岩」**（zh-tw）https://zh.wikipedia.org/zh-tw/攀岩 — 用英文 On-Sight / Flash / Red-Point / Pink-Point / Hangdog 並加中文定義（「Red-Point 就是經過練習後的 Flash」）；比賽用語：**難度賽、速度賽、抱石賽、中繼點（Zone）**、完攀。
- ✅ 中國大陸用語對照（**不要混用**）：theCrag 简中 https://www.thecrag.com/zh_hans/article/ticktypes 用「**视攀**」「**红点**」；Sohu 文章 https://www.sohu.com/a/602757633_121124433 用「公开攀登（onsight）、快速攀登（flash）、红点攀登、粉点攀登、头点攀登」。→ 台灣岩館口語多半**直接講英文**（onsight、flash、send、project、beta、crux、link），中文書面寫「完攀、練線、串動作、先鋒、紅點」；「視攀」「閃攀」偏大陸／翻譯腔，台灣來源沒看到用「閃攀」。
- ✅ 台灣選手用法實例：Instagram 李虹瑩 https://www.instagram.com/p/CZjR0ibpsHQ/（Keenable 摘要）——「分享 beta」「路線觀察能力」「定線員出的考題」。只看了 snippet，沒打開全文（Instagram 要登入）。
- ✅ 台灣常用說法：先鋒（lead）、上攀／頂繩（top rope）、確保（belay）、快扣（quickdraw）、隔離區、觀察時間／路線觀察、大亂鬥（jam 賽制）——來源同上（規程、維基、VARO）。「磨線」「打 project」在搜得到的書面來源**沒找到**，大概只在口語流通 → ✉️ 如需確認可問台灣教練或社團。

## School-of-thought conflicts
1. **Projecting volume.** Hörst (10-4 rule, 80/20) and Megos: few goes, lots of routes. Long-term projecting (MacLeod, Lattice's 15+ session category, Magnus on Neanderthal) treats the multi-session siege as a skill in itself. Research (Hacques 2022/2024): constant practice wins on the trained route, and variability does not clearly transfer better. So both camps have a point. Bechtel's pyramid is the compromise.
2. **Rest between burns.** Coaches say long (20–60 min). Research says active rest beats passive at 20 min, and duration has not been compared. Combine the two: long *and* active.
3. **How much to preview.** Coaches (Gresham, Berry, Bible) say read thoroughly. Research is mixed: Sanchez found preview did not change completion; Seifert 2017 found more scan paths went with *more* exploration on the wall. Watching a live model helps most (Morenas 2021, Boschker 2002). **Beginner implication: watching someone climb it, i.e. flash conditions, is worth more than staring alone.**
4. **Flash value in comps.** Under the pre-2025 rules attempts were a tiebreak. Under 2025 points every failed attempt costs only 0.1, and zone vs top falls are not separated. The tactical shift: bank the zone and keep trying.
5. **Encouragement.** Comp climbers like the crowd; trad and sport climbers prefer quiet and specific calls. Social facilitation predicts that an audience *hurts* complex, unfamiliar tasks (onsight) and helps well-learned ones (a redpoint go). That is an inference, not tested in climbing.

## Open questions
- No study tests the length of rest between redpoint burns (20/40/60 min) or the number of burns per session for recreational leaders. ⚪
- Hörst's "efficiency plateaus at 3–10 attempts" has no citation. ✉️ Ask Hörst or his podcast, or treat it as opinion.
- Climbing Bible Ch.4 body text (who to climb with, how many attempts). ⚪ online; needs the physical book or ebook (Everand/zlib not used).
- Climbing-specific social facilitation and belayer-trust performance studies: none found. ⚪
- Taiwanese colloquial terms 磨線 / 打 project / 閃攀 frequency: no written TW sources. ✉️ Ask TW coaches or FB groups (FB not crawlable).
- Lattice podcast content (top-down links, 5–14 vs 15+ session advice): audio only. ✉️ Transcribe if needed.

## Source count
About 38 opened (research 20; rules 6; coaches 12; TW 5). Not counted: summaries-only pointers.

---

# 附錄 C：條件（摩擦、天氣、台灣季節）與皮膚保養原始紀錄


Date: 2026-10-18 · Researcher: subagent C · Output feeds a blog series plan (no repo edits).
Legend: ✅ read (abstract/full text/page) · ⚪ confirmed unavailable (tools tried listed) · ✉️ needs human · (V) vendor-biased · (LW) low-weight forum/anecdote

## toolDegradation

- (1) Groundlane MCP (`mcp__claude_ai_Groundlane__web_search/web_fetch/paper_search`): loaded via ToolSearch, every call returned `MCP server "claude.ai Groundlane" is not connected`.
- (2) Groundlane direct HTTP (POST /mcp): `401 Bearer realm="OAuth"`; it needs OAuth, so it is unusable without a token.
- (3) Keenable keyless: worked. English results were good; Chinese queries were noisy (spam, unrelated pages).
- (4) You.com: not needed (Exa worked).
- (5) Exa `web_search_exa`/`web_fetch_exa`: worked and became the main web tool. jina returned `not connected`, firecrawl returned `not connected`, and linkup failed to connect (404).
- Papers: PubMed E-utilities (esearch/esummary/efetch) worked. OpenAlex worked (abstract_inverted_index). Semantic Scholar API returned 429 on every query. Google Books API returned no volumeInfo.

---

## 1. Friction science (skin × chalk × rock × rubber × weather)

### Primary research

- ✅ **Li, Margetts & Fowler 2001, "Use of 'chalk' in rock climbing: sine qua non or myth?"** J Sports Sci 19(6):427-32, PMID 11411778, https://doi.org/10.1080/026404101300149375 — n=15, flat rock pulled tangentially under fingertip. **Chalk DECREASED μ** on sandstone, granite and slate. Water had no significant effect, and sandstone was the least slippery rock. Proposed mechanisms: chalk dries the skin and lowers its compliance, and chalk forms a slippery granular layer. The authors conclude climbers should remove chalk particles. This is the classic contrarian study.
- ✅ **Amca, Vigouroux, Aritan & Berton 2012, "The effect of chalk on the finger-hold friction coefficient in rock climbing."** Sports Biomech 11(4):473-9, PMID 23259237 — 11 experienced climbers, 42 sessions on a tilting hangboard, slip angle measured. **Chalk +18.7% μ on limestone and +21.6% on sandstone.** Sandstone > limestone by 15.6% without chalk and 18.4% with chalk. **No correlation of μ with humidity or temperature.** The authors say other parameters are needed to explain weather effects.
- ✅ **Fuss & Niegl 2012, "The importance of friction between hand and hold in rock climbing."** Sports Technology, https://doi.org/10.1080/19346182.2012.755539 (abstract via OpenAlex) — instrumented holds. More experienced climbers run μ closer to impending slip. 64% of μ variance is not explained by other performance parameters. **Powder chalk on the hand alone raises μ; chalk on both hand AND hold lowers μ.** This supports brushing holds.
- ✅ **Kilgas et al. 2016, J Appl Biomech 32(6):553-7**, PMID 27619723 — n=19 recreational climbers. With chalk vs without, there was no difference in μ (p=.748), EMG or geometric entropy, **but hang time was longer with chalk: 62.9±36.7 s vs 49.3±25.2 s (p=.046).**
- ✅ **Bacon et al. 2018, Int J Exerc Sci 11(4):479-92**, PMID 29541333 (PMC5841679) — n=9, 50%-bodyweight-assisted pull-ups. With chalk: open hand **22.8 vs 19.7 reps (p=.006)**, pinch **14.4 vs 9.1 reps (p=.007)**. ICC 0.96–0.99.
- ✅ **Carré, Tomlinson, Collins & Lewis 2012, "An assessment of the performance of grip enhancing agents used in sports applications."** Proc IMechE J 226(J7):616-25, https://doi.org/10.1177/1350650112439647, full text https://eprints.whiterose.ac.uk/id/eprint/98047/2/WRRO_98047.pdf — **n=1 subject**, finger rig. On dry steel, powdered chalk and rosin LOWER μ (solid particles act as a lubricant). On a wet finger, only the granular powders raise μ. On sandstone there was little difference between agents, except the dry chalk-free finger, which was lower because sandstone grains act as a lubricant. Tested powdered vs liquid chalk. The intro summarises the Li vs Fuss conflict (different methods, moisture not controlled).
- ✅ **Clarke, Tomlinson, … Lewis 2024, "The effectiveness of chalk as a friction modifier for finger pad contact with rocks of varying roughness."** Proc IMechE P, https://doi.org/10.1177/17543371241272903, OA PDF https://eprints.whiterose.ac.uk/id/eprint/214893/ — sandstone, granite and two limestones, dry and wet fingers, 5/10/15 N. **Chalk helped more on DRY fingertips than on simulated sweaty ones (unexpected).** Chalk made μ **more consistent** across conditions. The effect depends on moisture and asperity gradient. Proposed mechanism: a thin chalk layer fills asperity gaps and adds adhesion, while excess chalk becomes a shearable solid lubricant (reconciling Li 2001).
- ✅ **Fuss, Weizman, Niegl & Tan 2020, "Climbers' Perception of Hold Surface Properties."** Front Psychol 11:252, PMID 32231605 — 22 climbers, 14 surfaces on an instrumented hold. Mean applied COF ranged from 0.53 (Teflon) to 0.84 (rubber). Perceived *grippiness* correlated with COF, but *roughness* did not. Half the climbers showed no correlation at all.
- ✅ **Bourne et al. 2011, J Appl Biomech 27(1):40-6**, PMID 21451181 — n=15. Lift force on 2.8 mm sandstone edges correlates with **fingertip pulp depth (bone tip to pulp tip), r=.65**, and does not correlate with deep-edge strength (r<.1). This links skin/pulp deformability to small-edge performance.
- ✅ **Adams, Johnson, Lefèvre, Lévesque, Hayward, André & Thonnard 2013, "Finger pad friction and its role in grip and touch."** J R Soc Interface 10:20120467, PMID 23256185 — review. On impermeable smooth surfaces, μ can rise **by an order of magnitude within tens of seconds** through sweat occlusion, which plasticises the stratum corneum. On porous surfaces μ falls. Load and velocity dependence is second-order.
- ✅ **André, Lefèvre & Thonnard 2010, "Fingertip moisture is optimally modulated during object manipulation."** J Neurophysiol 103:402-8, PMID 19906876 — grip force is minimal at an *optimal* moisture level, and fingertip moisture tends toward that optimum. Too dry and too wet are both bad.
- ✅ **Yum … Adams & Park 2020, "Fingerprint ridges allow primates to regulate grip."** PNAS 117:31665, PMID 33257543 — ridges plus low-flow sweat pores self-regulate hydration (capillary evaporation and pore blocking) toward the friction-maximising level, which prevents hydrodynamic slip.
- ✅ **Gerhardt … Derler 2008, J R Soc Interface 5:1317-28**, PMID 18331977 — skin on textile (forearm, not fingertip). COF rose **+43% (women) and +26% (men)** from very dry to normally moist skin. Wet fabric gave more than 2× COF. This shows hydration raises friction up to a point.
- ✅ **Serhat, Vardar & Kuchenbecker 2022, PLoS One** PMID 35830372 — glycerin-hydrated fingers had a much larger *real* contact area. Tissue elastic modulus dominated over friction. Supports "soft, hydrated skin deforms into texture".
- ✅ **Spinner, Wiechert & Gorb 2016, "Sticky fingers"** J Biomech PMID 26892897 — fingertip adhesion is up to 15 mN on smooth epoxy and lower on rough surfaces, with huge inter- and intra-individual scatter (moisture, perspiration).
- ✅ **Yamaguchi et al. 2020, rosin powder on finger–baseball** Front Sports Act Living PMID 33345022 — powder did *not* necessarily raise dry μ but **stabilised μ** (less variation between people and loads). It raised μ under wet, high-load conditions. This parallels the "consistency" result in Clarke 2024.
- ✅ **Persson 2006, "Rubber friction: role of the flash temperature."** J Phys Condens Matter, PMID 21690888; **Persson & Xu 2025 review**, J Chem Phys, PMID 41060126 — rubber friction is viscoelastic and strongly temperature-dependent. Local flash heating reduces friction above ~0.01 m/s. This is the physics behind the temperature-dependence of shoe rubber.
- ✅ **Elkington et al. 2024, "Sticky feet: a tribological study of climbing shoe rubber."** Sports Engineering, https://doi.org/10.1007/s12283-024-00474-4 — granite counter-surface. **Softer rubber was NOT consistently grippier**; performance comes from hardness × roughness × adhesion together. The abstract has no temperature data.

### Coach and industry syntheses

- ✅ **Climbing.com, Johnson-Groh 2021, "The science of friction"** https://www.climbing.com/skills/science-friction-the-truth-behind-perfect-climbing-conditions/ — rock friction does not change with ambient temperature; *our sweat* does. A little sweat increases friction, and visible sweat means you are past the threshold. Too-dry or too-cold skin is "glassy". Claims a rubber optimum of "32–41°F" (0–5°C). That number is secondary and unsourced in the article, so it should be verified before quoting.
- ✅ **Three Rock Books, "Friction and Rock Climbing"** https://threerockbooks.com/friction-and-rock-climbing/ (LW, publisher blog) — the same 0–5°C rubber claim plus the rationale "cold enough not to sweat". Wind cools hands but not rock.
- ✅ **Gripped 2024, "Understanding rock climbing conditions"** https://gripped.com/profiles/understanding-rock-climbing-conditions/ — within a season, humidity predicts conditions better than temperature. Above ~70% RH, holds dampen after a few tries. Wind dries. Bouldering tolerates cold better than routes.
- ✅ **Climbing.com, Potter 2023, "Warm-weather tactics"** https://www.climbing.com/skills/how-and-where-to-climb-in-the-heat/ — pick crag aspect by time of day, climb at night, and rest in shade. Rock that has baked in the sun stays hot for hours after the sun leaves. Lower your expectations in heat.
- ✅ **Mountain Project thread, "steep rock will sweat"** https://www.mountainproject.com/forum/topic/117971505/ (LW) — condensation forms when rock temperature ≤ dew point < air temperature. A warm front after cold weather is the classic "sweating crag" case. Folk "Sendex" index for the Red River Gorge: 2×dew point + RH − temperature ≤ 100.
- ✅ **8a.nu 2012, "Humidity, polished routes and grades"** https://www.8a.nu/news/humidity-polished-routes-and-grades (LW) — on sea crags such as Kalymnos, humidity on friction holds "turns 7a into 8a". Inland granite also sweats when a warm front hits cold rock.
- ✅ **Bouldi app scoring** https://bouldi.app/activities/rock-climbing (V/LW, app marketing) — 48–65°F, RH 30–55% (cutoff >75%), dew point <60°F with an 8°F spread. These are heuristic thresholds, not research.
- ✅ **CragCast conditions-model.md** https://github.com/fa-steven/CragCast/blob/main/conditions-model.md (LW, open-source heuristic) — temperature band peaks at 38–52°F, dew-point spread is scored separately, and there is an absolute dew-point penalty from 55°F up (65°F → 0.72, 70°F → 0.48). This is a useful conceptual "dry × friction" two-axis model for a blog diagram.
- ✅ **Friction Labs, "The Science Behind Send Temps"** https://shop.frictionlabs.com/blogs/climb-your-impossible/the-science-behind-send-temps (V) — argues temperature has minimal *direct* effect and humidity acts through thermoregulation and sweat. Pre-cooling with cold drinks. Sells liquid chalk.
- ✅ **Rock+Run, "Performance bouldering"** https://rockrun.com/blogs/the-flash-rock-run-blog/performance-bouldering-tricks-of-the-trade-training-and-skills (V/LW) — optimal friction window −3 to +5°C (UK). Warmer days work if humidity is low.
- ✅ **Eric Hörst T4C podcast #97 show notes (guest: Friction Labs CEO)** https://trainingforclimbing.libsyn.com/93-getting-a-grip-all-about-chalk-use-and-skin-performance (V guest) — show notes only, audio not transcribed. Topics: pulpy tips deform; "save skin by making a few quality attempts"; optimal chalk amount; alcohol vs alcohol-free liquid chalk; whether "drier is always better".
- ✅ **Weinbruch et al. 2012, "Reducing dust exposure in indoor climbing gyms."** J Environ Monit, https://doi.org/10.1039/c2em30289f — gym PM10 reaches up to 4000 µg/m³. **Liquid chalk gives PM10 as low as a chalk ban.** Blocks, sieved chalk and chalk balls did NOT reduce dust. Relevant to the gym and liquid-chalk article.

---

## 2. Taiwan weather, seasons, Long Dong

- ✅ **CWA 1991–2020 Keelung normals (via Wikipedia weather box citing CWB monthlymean)** https://en.wikipedia.org/wiki/Keelung (source page https://www.cwb.gov.tw/V8/C/C/Statistics/monthlymean.html is dynamic and was not fetched directly):
  - **Mean RH** stays between 72% and 80% in every month: Jan 78.5, Feb 79.5, Mar 79.0, Apr 77.4, May 77.4, Jun 76.9, **Jul 71.9 (lowest)**, Aug 73.6, Sep 75.3, Oct 75.6, Nov 77.1, Dec 76.6.
  - **Rain (mm) and rain days:** Sep 390 (15.2 d), Oct 378 (17.1 d), Nov 397 (18.6 d), Dec 357 (19.5 d), Jan 328 (19.6 d), Feb 350 (17.9 d), Mar 274, Apr 211, May 284, Jun 290, **Jul 120 (8.5 d)**, Aug 211.
  - **Mean high:** Jan 18.4°C, Jul 33.3°C. **Sunshine:** Dec 48 h vs Jul 229 h.
  - Takeaway: Keelung (the nearest CWA station, ~20 km W of Long Dong) gets NE-monsoon drizzle from Oct to Mar. July is the driest month but also the hottest. Monthly-mean RH never falls to the "good" thresholds of 50–60%, so good days are synoptic events (dry continental air behind a front), not a season. I did not find Bitou Cape (鼻頭角) station normals ✉️.
- ✅ **CWA 數位科普網 「隨季節變換的風—季風」** https://edu.cwa.gov.tw/PopularScience/wt/wt_3.html — **NE monsoon lasts 7 months (Oct to Apr), peaking Dec–Feb.** SW monsoon runs mid-Jun to mid-Sep. During the NE monsoon a cold front passes every 5–7 days, bringing drizzle mainly to the north and northeast. The SW-monsoon period is the peak typhoon season. Typhoons bring "鹽災" (salt-laden wind), which is relevant to sea-cliff salt.
- ✅ **CWA 氣候資訊 「梅雨」** https://climate.cwa.gov.tw/SeasonalClimate?subpage=PlumRain — Taiwan's 梅雨 falls in May–June. Summer-monsoon onset averages pentad 28 (5/16–5/20), with a range of 5/1 to 6/9. After mid/late June, afternoon thunderstorms dominate. Typhoon season proper runs from mid-August. Mean 5–6 month rain at 11 lowland stations is 440.7 mm. The **west** gets 2–4× more 梅雨 heavy rain than the east.
- ✅ **CWA 「臺灣分區雨量的季節氣候特徵」(PDF)** https://www.cwa.gov.tw/Data/service/hottopic/14277057430.pdf — five rain periods: winter (Dec–Jan), spring rain (Feb–Apr; the north gets ~6 mm/day, about 19% of annual rain), 梅雨 (May–Jun), summer/typhoon (Jul–Sep), autumn (Oct–Nov; the north drops to its **driest month, November** per the CWA autumn page). The northeast (Yilan/Keelung side) is wettest in autumn.
- ✅ **CWA 氣候資訊 「秋季」** https://climate.cwa.gov.tw/SeasonalClimate?subpage=Autumn — from October the NE monsoon brings overcast drizzle to the north and northeast. **November is the north's least-rainy month (~2 mm/day)**, while the northeast is at its wettest (~15 mm/day). This matters because Long Dong sits on the NE corner: Taipei-dry and Long Dong-dry are different questions ✉️.
- ✅ **climbstone.com (Long Dong guidebook site), Chinese and English** http://climbstone.com/chinese/information.html and http://www.climbstone.com/information.html — summer highs 33–37°C, hot and humid. Jan–Mar is rainy, but dry days are climbable, with lows of 5–10°C. **"Spring and fall can be wonderful."** Rock is Silin (四稜) sandstone with 500 routes. Wash and lube metal gear after a few days at the sea. Recommends the CWA Long Dong webcam.
- ✅ **東北角管理處 龍洞岩場** https://www.necoast-nsa.gov.tw/Attraction-Content.aspx?a=186&l=1 — official warning: **during the NE monsoon (Oct–Mar), long-period swell is frequent; do not go to the shore.** This is a safety point for low-lying areas and seaside approaches.
- ✅ **57hours, Khiew 2022** https://57hours.com/review/long-dong-rock-climbing-taiwan/ — "spring, fall and early winter are ideal climbing seasons". Sea spray and salty mist on the low walls. NE monsoon wind.
- ✅ **Kateberry blog 2018 「完攀非常不方便」** http://kateberrysblog.blogspot.com/2018/03/blog-post.html (LW but concrete) — on 2018-03-18 and 03-24, word spread among climbers that Long Dong had **RH of 50–60%**. More than 50 people packed 黃金谷 and every route had a queue. The author felt the difference "第一次感受什麼是乾，真的超有差" (the first time I felt what dry really is) and sent her first Long Dong 5.12a. She also notes that many climbers skip Long Dong in winter and go to **關子嶺** (south, in the lee of the NE monsoon). Good evidence that dry days are rare, event-driven and community-tracked.
- ✅ **atc0317 痞客邦 2010 「低溫鐘塔斜線」** https://atc0317.pixnet.net/blog/posts/10031695928 (LW) — "冬季的東北季風成了通往龍洞岩場的最大阻礙" (the winter NE monsoon is the biggest obstacle to climbing at Long Dong): 陰雨連綿、岩壁潮濕 (endless drizzle, wet rock). People still climb on cold dry New Year's days. Again: winter climbers go to 關子嶺 instead.
- ✅ **U-OUTDOOR 「享譽國際的攀岩聖地 龍洞」** https://mountain.u-outdoor.com/997.html (LW) — climbs in both 「炙熱的夏天」(scorching summer) and 「又濕又冷的冬天」(wet cold winter); the trip day was 12–14°C.
- ✅ **OUTSiDERS 2025** https://www.outsiders.com.tw/post/38995 (LW) — combine climbing with diving in summer; autumn and winter are cool and suit long sessions.
- ✅ **1111 travel** https://travel.1111.com.tw/News_Detail.asp?autono=20582 (LW) — calls September a great climbing season (before the NE monsoon reaches the south, less rain in central and southern Taiwan).
- ✅ **UKC forum, "Why does sea cliff limestone get 'soapy'?"** https://www.ukclimbing.com/forums/rock_talk/why_does_sea_cliff_limestone_get_soapy-764211 (LW) and **Libby Peter "Sea-cliff essentials" PDF** https://www.libbypeterclimbing.co.uk/wp-content/uploads/2022/11/seacliffs.pdf — sea cliffs get greasy "just by dampness in the air". **Salt from spray is hygroscopic (it draws water) and needs extra drying** from sun, wind or low humidity. Wind blowing *off* the sea makes it worse. Let the sun hit the crag first. Mechanism plausible; not peer-reviewed. No Long Dong-specific study found.
- ✅ **設計家 Searchome 2024 「反潮」** https://www.searchome.net/article.aspx?id=79004 (LW, general audience) — Taiwanese 反潮 means warm moist air condensing on colder surfaces, mostly in Mar–May. This is the Taiwanese everyday word for the "rock sweating / dew point" phenomenon. Summer RH runs 70–85%.
- 🟡→⚪ **Gym humidity in summer (Taiwan):** only incidental reviewer comments, e.g. twosevenths.com https://www.twosevenths.com/indoors/rockclimbing-taiwan-fun/ ("夏天有點熱" (a bit hot in summer) at 攀吶 and Boulder Space; B-plus "冷氣強" (strong AC)) and https://www.twosevenths.com/indoors/rockclimbing-taipei-fun/ (市民 "空氣流通不悶熱" (good airflow, not stuffy), free public chalk "手汗人完全不用擔心" (sweaty-handed people needn't worry)). There is no measured gym RH data and no gym policy article. Tools tried: Keenable (noise), Exa (two queries). Groundlane, jina and firecrawl were down. ⚪ for hard data. ✉️ could ask gyms directly or put a hygrometer in a gym.

---

## 3. Skin: injuries, care, sweat, products

### Dermatology and medical

- ✅ **Carioti et al. 2026, "Clinical assessment of nail and skin lesions in indoor climbers."** World J Methodol 16(3):121149, PMID 42626204 — n=156, podiatric clinic, retrospective. Mean 6.6 lesions per person. Hyperkeratosis made up about 2/3 of lesions (hallux and periungual). Shoe-size discrepancy ρ=.195, weekly frequency ρ=.180. This is about **feet**, not hands. The only recent clinical skin series found.
- ✅ **Stelzle et al. 2000 [German] artificial-wall injuries** PMID 11199402 — n=314 interviews. Beginners had skin injuries (n=26) from falls. Hand skin is not analysed separately.
- ✅ **Harries et al. 2005 "Lichen dermatitis in a rock climber"** Contact Dermatitis PMID 15899007 — case letter, no abstract. Contact dermatitis from lichen on rock exists as a case report.
- ✅ **Raymond & Solberg 2025, "Hemostatic properties of climbing chalk."** Wilderness Environ Med 36(3):316-27, PMID 40208048 — in vitro. MgCO₃ chalks shortened aPTT (intrinsic pathway) vs talc. No effect on PT. Gives in-vitro support to the folk practice of "pack chalk in a cut" (but nothing on infection or healing).
- ✅ **WMS magazine, "Climbing Skin Care"** https://wms.org/magazine/magazine/1198/Climbing-Skin-Care/default.aspx (Wilderness Medical Society, clinician-written) — the goal is dry hands with **calluses tapered to the surrounding skin**. Typology: flappers, split tips (more common in dry climates), worn tips, gobies. Use medical-grade cyanoacrylate rather than hardware superglue (cites Davis & Derlet, WEM 2013). Kit list.
- ✅ **Schneider et al. 2017 "Wilderness dermatology: mountain exposures"** Dermatol Online J, https://doi.org/10.5070/d32311037241 — cold, UV and altitude. It does not cover climbing hand skin, so it is of marginal use.
- ✅ **CLIMBERS (Japan) interview with dermatologist 大森俊** https://www.climbers-web.jp/feature/article-93/ — a dermatologist's view:
  - The ideal skin has a stratum corneum of some thickness that is neither too hard nor too soft.
  - Thin skin sweats/weeps more easily because the water-free keratin is gone.
  - Routine: wash, then **glycerin potassium solution (グリセリンカリ液) to *dissolve* frayed keratin rather than sand it**, rinse, lotion, cream. Do this right after climbing, then twice a day including rest days.
  - **Warns that over-sanding causes more fraying.** Sanding is fine for non-fingertip calluses.
  - Sweaty climbers may skip the lotion and cream.
  - Strong conflict with the "sand everything" coaching school (see §4).

### Hyperhidrosis (sweaty hands, 手汗)

- ✅ **Lai et al. 2015, nationwide PPH survey, PR China** Clin Auton Res PMID 25381140 — about 70,000 college students. **Prevalence 2.08%; coastal 2.81% vs inland 1.53%.** Onset at 7–15 years (97%). Family history in 25%.
- ✅ **Li et al. 2007, SE China (Fuzhou region) adolescents** Chin Med J PMID 18167205 — n=33,000. **PPH prevalence 4.36%**, severe 0.27%. Fujian is climatically close to Taiwan, but it is not Taiwan data.
- ✅ **Schreiner et al. 2026, Dtsch Arztebl Int** PMID 41572865 — primary hyperhidrosis affects 2–5%. Stepwise treatment: aluminium chloride and anticholinergics first, then botulinum, plus tap-water iontophoresis and sympathectomy for palms. **Few high-quality studies.**
- ✅ **McConaghy 2018, Am Fam Physician** PMID 30215934 — topical aluminium chloride is first-line. Iontophoresis should be considered for palms and soles. Botulinum is first or second line. ETS only for severe refractory cases.
- ✅ **Nawrocki & Cha 2019, JAAD review** PMID 30710603 — antiperspirants first-line. **Iontophoresis is "the primary remedy for palmar/plantar HH."** Sympathectomy is a last resort because of compensatory sweating.
- ✅ **Chudry 2022, Int J Dermatol systematic review** PMID 34653261 — six studies. Oxybutynin gives more than 80% improvement, iontophoresis 81%, botulinum 90%, ETS more than 95% but with compensatory sweating.
- ✅ **Moniati et al. 2025, Dermatol Res Pract SR** PMID 40881604 — 14 studies, n=1,733. Oral oxybutynin helps 60–97% but has anticholinergic side effects. ETS gives the most complete cessation but compensatory HH. Iontophoresis is moderate, with minimal side effects, and needs maintenance.
- ✅ **Hosseini et al. 2023 RCT, AlCl₃ gel vs tap-water iontophoresis** PMID 37436009 — n=32, 7 sessions. Both reduced sweating (p<.001), with no significant difference between groups. Contraindications: pregnancy, pacemaker, epilepsy.
- ✅ **Phadke et al. 1995, topical methenamine 10% vs glutaraldehyde vs tap-water iontophoresis** Indian J Dermatol Venereol Leprol PMID 20953017 — n=60, 4 weeks, randomised. **Methenamine beat iontophoresis, acted faster than glutaraldehyde and had fewer side effects.** This is the only controlled clinical evidence for methenamine found; it is old and small.
- ✅ **Zur 2019 Parts 1 & 2, Int J Pharm Compd** PMID 30668532, 31085774 — compounding review of topical aluminium salts, methenamine, glycopyrronium and oxybutynin. Abstract only; no numbers.
- Note (not opened, flagged): Taiwan NHIRD cohort papers on palmar hyperhidrosis/ETS (e.g., PMID 32585882, 28929251) show ETS is studied heavily in Taiwan. Not opened, so no claims made.

### Antihydral / methenamine (official source)

- ✅ **Antihydral® Salbe official product page and Pflichttext (Robugen)** https://www.antihydral.de/products/antihydral-salbe, https://www.antihydral.de/pflichttext, https://robugen.de/produkte/antihydral-salbe; **German package leaflet** https://products.dm-static.com/images/v1757559621/assets/pas/package-leaflet/2d07ab11-de24-467a-b348-798ef14a3ef1/2d07ab11-de24-467a-b348-798ef14a3ef1.pdf:
  - **13 g methenamine per 100 g** (130 mg/g) in a talc / zinc oxide / clay paste.
  - It is a medicine (Zul.-Nr. 6421167.00.00), pharmacy-only in Germany.
  - **Contraindications:** formaldehyde allergy, weeping or blistered skin, the face. Avoid in pregnancy (insufficient data) and on the breast while breastfeeding.
  - **Side effects:** rarely (≤1/1000) irritation or hypersensitivity, and eczema in people with formaldehyde contact allergy.
  - **Dosing on the leaflet:** 1–2× daily thin layer, then less often once sweating drops. Robugen's newer page says "**initially only once daily on 2 days per week, preferably evenings; effect after 2–3 days**". For palms, overnight with cotton gloves. If skin gets too dry or brittle, apply a fatty ointment temporarily. Skin sheds back to sweaty within weeks.
  - The manufacturer claims a negative Ames test (Leuschner 2013) and listing in the German S1 hyperhidrosis guideline. These are manufacturer claims (V).
- ✅ **Robugen blog "Wet hands when climbing" (2026)** https://www.antihydral.de/en/post/wet-hands-when-climbing (V) — the manufacturer now markets directly to climbers: antiperspirant the night before plus chalk while climbing.
- ✅ **Goossens & Aerts 2022, "Contact allergy to formaldehyde and formaldehyde releasers"** Contact Dermatitis PMID 35229319 — formaldehyde and its releasers still cause hand, airborne and generalised dermatitis. If sensitised, avoid formaldehyde and the releasers. Methenamine acts by releasing formaldehyde, which is the mechanism behind the allergy risk; the review does not name methenamine specifically.
- ⚪ Taiwan regulatory status of Antihydral/methenamine creams (TFDA registration, legality of 代購 (overseas personal purchasing)). Not searched to closure; Exa queries returned nothing Taiwan-specific. ✉️ check the TFDA drug license database.

### Coach and industry skin-care sources

- ✅ **Climbing.com, Clarke 2024, "Skincare for climbers"** https://www.climbing.com/skills/training/a-climbers-guide-to-skin-care-dealing-with-sweat-tape-splits-and-more/ — the sweaty-vs-dry spectrum: aim for the middle. **Cameron Hörst (5.15)** puts Antihydral on his **palms, not tips**, every other night in the week before a trip, because dry tips crack on small holds. Minimise showers and dishwashing. Sand calluses so the skin is level. Trad climber Molly Mitchell superglues the tape ends.
- ✅ **Climbing.com, Schulte 2022, "Skin care for rock climbing"** https://www.climbing.com/skills/skin-care-for-rock-climbing/ — a split takes up to a week to heal, and the bigger the split, the fewer attempts left. Worn tips (pink, weeping) only heal with rest. Friction tape (3M/hockey) over worn tips. Over-gripping when taped. X-taping method.
- ✅ **Climbing.com, Buhay 2026, "How to prevent sweaty hands"** https://www.climbing.com/gear/how-to-prevent-sweaty-hands-for-climbing/ — product tests (personal):
  - Tite Grip (alcohol + aluminium chlorohydrate) works in about 30 min.
  - Antihydral 13%: more than once a week made her hands "gnarled, yellow"; others use it every 10–14 days. Glassiness. Tips only. Allowed her to use a 10 mm edge instead of 15 mm.
  - Rhino Tip Juice ~12% needs about 8 h overnight; in finger creases the skin went grey and brittle.
  - Driclor (AlCl₃) gives a moderate effect with no glassiness.
- ✅ **Climbing.com, Clarke 2024, "Best skin creams"** https://www.climbing.com/gear/7-balms-salves-and-tools-for-climbing-skin-care/ (V-affiliate) — Antihydral "skin doping" (Squamish Climbing Magazine 2015). Forms a faux callus.
- ✅ **UKC, "Hand and foot care" (2009)** https://www.ukclimbing.com/articles/skills/hand_and_foot_care-2089 — flappers come from heavily callused skin on sharp holds, often in cold. Deep flappers carry infection risk: disinfect, gauze, wait. Warns against superglue. File the "step" in worn skin.
- ✅ **Sheffield Climbing Clinic 2019** https://www.sheffieldclimbingclinic.com/post/skin-care-for-climbers (clinic, mildly V) — mechanism: methenamine + acidic skin releases formaldehyde, which denatures sweat-gland proteins; the block lasts about 2–3 days. **"Difficult to recommend" given the lack of safe-use info.** Gives separate tip lists for dry and sweaty skin. Recontextualises the Daniel Woods "secret to success" quote.
- ✅ **trailandcrag, "A climber's guide to skin care"** https://trailandcrag.com/rock-climbing/climbers-guide-to-skincare (LW/V links to Rhino) — sanding grit 80–120. Keep drying agents off PIP/DIP creases or the skin splits. Split-tip protocol. Chalk in a split as a now-or-never tactic.
- ✅ **99Boulders, Markey 2021** https://www.99boulders.com/skin-care-for-climbers (LW) — "tape the flapper back on" never worked for the author; cut it off and air it out. Split tips: file down to unbroken skin and moisturise heavily. Antihydral: reactions vary hugely, and one person had a split from a 15-minute application that lasted 2 months.
- ✅ **Lattice Training 2023, "Skin care for rock climbers"** https://latticetraining.com/blog/skin-care-for-rock-climbers (V, sells Rhino Skin) — know your skin type. Dry: moisturise 3–4 nights/week and wet hands with a damp cloth before attempts. Sweaty: drying products. **Tape the warm-up and remove the tape only for hard attempts** to save thin skin.
- ✅ **Climb On Equipment guide** https://climbonequipment.com/en-us/blogs/knowledge/skin-care-guide (V) — first Antihydral application ≤1 h (at least 45 min), applied 2–3 days before, lasts about a week. Leukotape vs EuroTape. Heat tape to activate glue. Weeping tips are "plasma, not sweat". Don't put alcohol on soft sandstone.
- ✅ **Rock+Run skincare buying guide** https://rockrun.com/blogs/the-flash-rock-run-blog/climbing-skincare-buying-guide (V) — Rhino Performance 4%, Dry 8%, Tip Juice 12% methenamine (aloe base vs Antihydral's talc base). Liquid chalk as a base layer plus loose chalk on top. Dry-skinned climbers should avoid drying-agent chalk.
- ✅ **KletterRetter, common skin problems 1/3 and 3/3** https://www.kletterretter.com/en/common-climbing-skin-problems-part-1-3/ , https://www.kletterretter.com/en/common-climbing-skin-problems-part-3-3/ (V) — injury depth by skin layer (abrasion = stratum corneum; flapper = full epidermis; blood = dermis). Don't file calluses off completely. **Rosin/colophony in some liquid chalks, alcohol and tape latex as allergens.**
- ✅ **ClimberNews skin guide** https://climbernews.com/climbing-skin-care-guide/ (LW/V affiliate) — do not recommend Antihydral for most people; good care alone reduces wetness. Formaldehyde-allergy warning.
- ✅ **Alpine Indoor Climbing** https://alpineindoorclimbing.com/from-calluses-to-care/ (V) — "quality skin can add at least one grade". Performance creams on pads only, never creases. Tape as a thin-skin preventive at a friction cost.
- ✅ **The Climbing Hangar, hand care** https://www.theclimbinghangar.com/blog/handcare-for-climbers-our-recipe-for-strong-healthy-skin-and-more-climbing (V) — moisturise ≥2 h before the session. Too much alcohol liquid chalk dries skin. Gives two flapper options.
- ✅ **REI Uncommon Path 2018** https://www.rei.com/blog/climb/how-to-build-climbing-skin (V/LW) — moist-covered/air-dry alternation for flappers. Pack chalk into a cut to stop bleeding.
- ✅ **UKBouldering forum "Antihydral" 2025** https://ukbouldering.com/threads/antihydral.34685/ (LW) — user regimens range from 2 nights before a climbing day (≤2 nights/week) to once a fortnight in winter and weekly in summer. "Rather thin tips than split all the time".
- ✅ **Alpine Institute "Flapper management"** https://www.alpineinstitute.com/flapper-management-in-climbing/ — the fetch returned nav only, plus the definition from the search snippet (a callus rips away and leaves a raw wound). Low value.
- ⚪ **Hooper's Beta skin article/video** — homepage reached (https://www.hoopersbeta.com/), but no skin-care page found. Keenable "hoopersbeta skin" returned other sites. Exa search gave no Hooper skin page. Groundlane, jina and firecrawl were down.
- ⚪ **The Climbing Bible (Mobråten & Christophersen) skin/conditions chapter content** — note: authors are Mobråten & Christophersen, not Mandelli/Bechtel. Only catalogue and review pages are available (Goodreads, Google Books, chalkbloc review). No excerpt on skin. Google Books API returned no volumeInfo, Keenable and Exa returned no text, firecrawl was not connected. ✉️ needs the physical book.
- ⚪ **Dave MacLeod on conditions** — blog index seen via Keenable (http://davemacleod.blogspot.se: "I *hate* climbing in the heat"; 2016 "Magic times": sent on first try "in slightly humid conditions"). Anecdotal; no dedicated conditions article found.

### Taiwan sources and terminology (sparse is normal)

- ✅ **PTT X-game 「[問題] 攀岩完之後手部保養」 2019** https://www.pttweb.cc/bbs/X-game/M.1564156083.A.394 — ClimbOn recommended ("手皮沒了擦一擦長很快" (when my hand skin is gone, applying it makes it grow back fast)). The term **「手皮沒了」/「手皮」** (my hand skin is gone / hand skin). 雪弗蘭 (a common Taiwanese drugstore cream) before bed.
- ✅ **PTT X-game 「[討論] 流手汗攀岩」 2009** https://www.pttapp.cc/bbs/X-game/M.1235149385.A.1A4.html — the terms **「流手汗」** (sweaty hands) and **「止滑粉」** (= magnesium carbonate). **「液態粉又稱白手套」** — liquid chalk is nicknamed 白手套 ("white glove").
- ✅ **gazispace 「【運動醫學】攀岩的手部保養建議」 2022** https://gazispace.com/notes/hand-skin-care-for-rock-climbers.html (Taiwanese sports-med blog) — wash after climbing, lotion before bed, **「把繭磨平」** (file calluses flat) to avoid tearing, try different chalk brands, avoid hot water. Also warm water soaks at 38–42°C for joints.
- ✅ **Decathlon HK 「碳酸鎂粉豈止一種」** https://sportadvice-zh.decathlon.com.hk/pan-shi-mei-fen-shi-yong-zhi-nan — HK usage: 散粉 (loose chalk), 粉塊 (block), 粉球 (chalk ball), 液態粉 (liquid chalk). Liquid chalk evaporation chills fingers in cold weather. Chalk buildup forms a hard crust on holds (an LNT point).
- ✅ **Mammut HK liquid chalk** https://www.mammut.hk/zh/product/post/8-78-124-0/242 (V) — the term 液態鎂粉 (liquid magnesium chalk).
- Terminology table (from the sources above):

  | Concept | Term | Source |
  |---|---|---|
  | chalk | 止滑粉 (TW PTT); 鎂粉 / 碳酸鎂粉 (HK/CN) | PTT 2009; Decathlon HK |
  | liquid chalk | 液態粉, nickname 白手套 | PTT 2009 |
  | sweaty hands | 手汗, 流手汗 | PTT 2009 |
  | thin or no skin | 手皮沒了 | PTT 2019 |
  | sand calluses | 把繭磨平 | gazispace |
  | peeling skin | 掉手皮 | dealmoon (simplified Chinese, US-based user) https://www.dealmoon.com/post/1720941 |
  | rock "sweating" from condensation | 反潮 (general Taiwanese word) | searchome |

  **Not confirmed:** 掀皮, 爆皮, 翻皮 for "flapper". No Taiwanese source found using them; Exa returned none. Recommend writing "flapper（整片掀起的皮）" (a whole flap of skin torn up) rather than asserting a slang term ✉️. 磨皮 (sanding skin) was also not seen in a climbing context (it usually means cosmetic dermabrasion), so prefer 磨繭 / 把繭磨平 (file the calluses flat).
- ✅ **Bilibili 「攀岩红线指南：小扣点疼+手汗+手薄皮」** https://www.bilibili.com/opus/1212237043117064196 (LW, mainland; snippet only) — notes "冬天反而更容易掉皮" (you lose skin more easily in winter). Snippet read only.

---

## 4. Conflicts between schools of thought

1. **Does chalk increase friction?**
   - **No:** Li 2001; also Carré 2012 on dry steel.
   - **Yes:** Amca 2012 (+19–22%); Fuss & Niegl 2012 when the chalk is on the hand only.
   - **Performance gains without a μ change:** Kilgas 2016 (longer hangs); Bacon 2018 (more reps).
   - **Resolution:** Clarke 2024. A thin layer helps and stabilises μ; excess chalk (and chalk caked on holds) acts as a solid lubricant. Hence brush holds and apply a thin coat rather than a "ghost hand".
2. **Chalk on wet vs dry skin.** Climber belief: chalk is for sweat. Clarke 2024 found a larger benefit on *dry* tips and a smaller one on simulated sweat. Carré found powder helps a *wet* finger on steel. The results depend on the method; say "evidence mixed".
3. **Humidity and temperature: decisive or not?** Lab studies (Amca 2012; Clarke 2024 citing others) found **no correlation** of μ with temperature or humidity, while coaches and forums treat dew point and RH as the main predictor. A plausible reconciliation (inference, not proven): weather acts through *sweat rate, condensation on rock and skin hydration over a session*, which short lab trials don't capture.
4. **Sand calluses vs dissolve them / don't over-sand.**
   - Coaching consensus: file calluses level (UKC, Climbing.com, WMS, Sheffield).
   - Dermatologist 大森: over-sanding frays the stratum corneum. Use glycerin-potassium solution on tips and sand only non-tip calluses.
   - KletterRetter: never file calluses off completely.
5. **Flapper: cut it off vs tape it back down.** 99Boulders and Climbing Hangar option 1 say cut it off and air-dry. Hangar option 2, the "Frankenweld" (Schulte) approach and superglue tape it down to keep climbing. On glue: UKC warns against superglue; WMS says use medical-grade cyanoacrylate.
6. **Wound healing moist vs dry.** Moist balm-and-bandage (trailandcrag, WMS "keep it moist") vs "let the air at it" to dry (99Boulders). REI alternates the two.
7. **Antihydral yes/no.**
   - Pro, for true hyperhidrosis: Woods quote, C. Hörst, Buhay.
   - Caution or avoid for most: Sheffield clinic "difficult to recommend", ClimberNews, trailandcrag, 99Boulders.
   - Regimens span from once a fortnight to every other night (palms only for Hörst; tips only for Buhay).
   - Medical framing: methenamine has only one small old RCT (Phadke 1995). Mainstream dermatology starts with AlCl₃ and iontophoresis (AFP 2018; JAAD 2019). The leaflet contraindicates formaldehyde allergy.
8. **Liquid chalk.**
   - Pro: dust reduction equals a chalk ban (Weinbruch 2012); base layer for sweaty hands; HK Decathlon.
   - Con: alcohol dries skin (Climbing Hangar, Rock+Run "avoid if dry"); rosin allergy (KletterRetter); chills fingers in cold (Decathlon HK).
   - The 2012 friction test (Carré) found no clear sandstone advantage.
9. **Soft vs hard shoe rubber, and the "0–5°C optimum".** Elkington 2024 finds softer rubber is not consistently grippier. The 0–5°C rubber optimum appears only in secondary pieces (Climbing.com, Three Rock Books) with no cited test. Treat it as an unverified claim.

## 5. Implications for a Taiwan-focused series (synthesis; inferences marked)

- Taiwan's climbing-weather problem is **humidity and heat plus monsoon drizzle, not cold**. Keelung monthly RH stays between 72% and 80% all year (CWA normals). Good Long Dong days (RH 50–60%) are rare synoptic events that the community tracks (Kateberry 2018).
- Season map for Long Dong, from CWA climate plus guide sources:
  - Oct–Mar: NE monsoon, drizzle, wet rock, swell (official warning).
  - Late Mar–Apr: spring windows, but 反潮 risk when warm moist air meets cold rock (inference from 反潮 plus MP dew-point logic).
  - May–Jun: 梅雨, less heavy on the east side than the west (CWA).
  - Jul–Aug: driest and sunniest but 33°C+, so climb shaded walls early or late.
  - Typhoons from mid-Aug, peak Jul–Sep.
  - Sep–early Nov: the most-cited "good season" (guidebook "spring and fall").
  - Winter crowds shift to 關子嶺 in the lee of the monsoon.
- Sea-cliff specifics: salt spray is hygroscopic (forums, not peer-reviewed). Wait for sun and offshore wind. Gear corrosion advice (climbstone).
- Sweaty hands may be common: southeast-China adolescent prevalence is 4.36%, and coastal prevalence exceeds inland (Lai 2015). It is plausible but **unproven** for Taiwan, so mark it as inference. Medical first-line is AlCl₃ or iontophoresis. Antihydral is a German pharmacy medicine with formaldehyde-allergy contraindications; its Taiwanese legal status is unknown.
- Session tactics for skin-limited climbing (coach consensus): a few quality attempts (Hörst podcast); tape the warm-up and remove it for hard tries (Lattice); stop when tips go pink or weep (Schulte, Sheffield); in heat, switch to slabs and mileage (Potter).

## 6. Open questions / ✉️

- Bitou Cape (鼻頭角) or Long Dong CWA station monthly RH and dew point. The CWA monthly-mean page is dynamic and was not fetched; Keelung was used as a proxy.
- Is there any Taiwanese measurement or community log of Long Dong RH vs send rate (Facebook groups such as 龍洞攀岩 or TOCC)? FB was not searchable with the available tools.
- TFDA status of methenamine creams in Taiwan, and whether 汗淨 / AlCl₃ (e.g., Driclor 20%) is OTC in Taiwan.
- Taiwanese slang for flapper (掀皮/爆皮?). Ask local climbers or gym staff.
- Hooper's Beta skin content and The Climbing Bible skin chapter could not be read (see ⚪).
- No peer-reviewed study found on (a) hand skin injuries specifically in climbers, (b) climbing-balm efficacy, (c) antihydral in athletes, or (d) sea-salt effects on rock friction. These are genuine evidence gaps, not just search failures (PubMed and OpenAlex queries were run).
