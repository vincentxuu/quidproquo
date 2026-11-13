# 島島阿學長期經營：外部案例研究

- 研究日期：2026-10-29
- 研究問題：以「長期做社群經營，軟體服務只是其中一項價值」為方向時，有哪些外部案例可以對照？哪些條件讓這個方向成立或失敗？
- 讀取狀態標記：✅ 讀過正文　🟡 只讀到搜尋摘要或部分內容　🔴 換過工具仍讀不到
- 工具：主要用 Exa（web_search_exa / web_fetch_exa）。本輪沒有遇到需要標 🔴 的來源，所以沒有動用 Tavily、firecrawl、jina 等備援工具。
- 本檔是研究筆記，不是文章。數字一律附出處與日期；查不到的直接寫「查不到」。

---

## 0. 先讀：最重要的偏誤

1. **研究者跟研究對象有利害關係。** 島島阿學的 LinkedIn 公司頁列出的共同創辦人是 Vincent Xu；2024-09-08 iThome 鐵人賽〈Day 7: 島島阿學的誕生〉的作者帳號是 vincentxu。下面對島島本身的描述只用公開資料，但案例的選法與解讀仍可能偏向「替現行方向找支持」。第 5 節的反證要和正面案例一起讀。
2. **英語圈、程式學習類案例太多。** 自學社群裡留下公開財報、關站信或 990 表的，大多是美國的程式學習組織。這反映的是資料好不好拿，不代表這類組織最多。
3. **倖存者與「大聲失敗者」偏誤。** 會寫長篇關站信的（Buildspace、Write of Passage）通常本來就有名氣。沒人知道就悄悄消失的小型共學社群，比例上一定更多，但幾乎沒有紀錄。
4. **財務數字多半是組織自己報的**（年報、創辦人貼文、媒體採訪）。只有 Hack Club（990 表）和 BloomTech（CFPB 命令）有第三方或官方文件。
5. **CMX 和 Circle 的產業報告**，受訪者以企業品牌社群和創作者付費社群為主，跟非營利學習社群的處境不同，只能當旁證。

---

## 1. 母群清單（掃描結果）

母群定義：以社群為核心、軟體／工具只是其中一項價值的學習型組織。另外放了對照組（純內容平台、純 App）和基礎設施（社群工具平台）。

掃描方式：英文與中文關鍵字搜尋（「共學社群」「自學社群」「陪跑」「讀書會 經營」、cohort-based course shut down、learning community nonprofit closing）、關站和轉型新聞、推薦鏈（島島 2020 年提案文列的同類組織、學思達頁面提到的合作平台、Maven 創辦人貼文點名的已關閉 cohort 課、OCF 社群專案列表）。

| # | 名稱 | 地區 | 類型 | 狀態（查證日期 2026-10） | 這次有沒有讀 |
|---|---|---|---|---|---|
| 1 | 島島阿學 DaoDao | 台灣 | 自主學習社群＋學習工具 | 營運中，2026-09 轉向服務引導者 | ✅ 研究對象 |
| 2 | g0v 零時政府／揪松團 | 台灣 | 公民科技社群（島島的來源社群） | 營運中，2024 年發起「救松行動」 | ✅ 選入 |
| 3 | g0v 零時小學校 Sch001 | 台灣 | 社群教育專案 | 2020 年啟動 | 🟡 只列名 |
| 4 | 學思達教學社群／學思達教育基金會 | 台灣 | 教師共學社群＋基金會 | 營運中 | ✅ 選入 |
| 5 | 六角學院 | 台灣 | 程式社群出身的 cohort 收費陪跑班 | 營運中 | ✅ 選入 |
| 6 | Side Project Taiwan | 台灣 | Discord 協作社群 | 營運中 | 🟡 只列名 |
| 7 | 自主學習促進會 | 台灣 | 自學支持組織（島島 2020 年提案文列為同類） | 未查 | 只列名 |
| 8 | 均一教育平台／ShareClass | 台灣 | 非營利學習平台（偏工具） | 營運中 | 🟡 只列名 |
| 9 | 魚水教育催化劑 | 台灣 | 實驗教育組織（島島合作夥伴） | 未查 | 只列名 |
| 10 | OCF 底下的開源社群（CONCOM 參與的 30 多個） | 台灣 | 開源社群群體 | 營運中 | 🟡 旁證 |
| 11 | Hahow 好學校 | 台灣 | **對照組**：內容課程平台 | 營運中 | 🟡 選入對照組 |
| 12 | Trevari 트레바리 | 韓國 | 付費讀書會社群 | 營運中，2025 年完全資本侵蝕 | ✅ 選入 |
| 13 | CoderDojo Japan | 日本 | 志工程式道場網絡 | 營運中 | ✅ 選入 |
| 14 | Class101 | 韓國 | 內容課程平台（對照用） | 營運中 | 🟡 只列名 |
| 15 | 學思達馬來西亞社群 | 馬來西亞 | 教師社群分支 | 營運中 | 🟡 只列名 |
| 16 | Buildspace | 美國 | 線上 builder 社群＋cohort | 2024-08 關閉 | ✅ 選入 |
| 17 | On Deck → ODF | 美國 | 付費 fellowship 社群 | 2022 年兩輪裁員並大幅縮編 | 🟡 選入 |
| 18 | Lambda School → BloomTech | 美國 | 收費 bootcamp（ISA） | 2024 年 CFPB 處分 | 🟡 只列名（不是社群優先） |
| 19 | Women Who Code | 美國／全球 | 非營利會員社群 | 2024-04 關閉 | ✅ 選入 |
| 20 | Exercism | 英國／全球 | 非營利練習平台＋志工 mentor 社群 | 2024-09 財務危機後改組 | ✅ 選入 |
| 21 | freeCodeCamp | 美國／全球 | 非營利課程＋論壇／Discord | 營運中 | 🟡 選入 |
| 22 | The Odin Project | 全球 | 志工維護的開源課程＋Discord | 營運中 | 🟡 只列名（輔助） |
| 23 | Hack Club | 美國／全球 | 青少年社團網絡（非營利） | 營運中 | 🟡 選入 |
| 24 | P2PU（Peer 2 Peer University） | 美國／全球 | Learning circles 同儕學習 | 2025-05 併入 DPL Foundation | ✅ 選入 |
| 25 | Recurse Center | 美國 | 自主學習 retreat＋招聘 | 營運中 | 🟡 選入 |
| 26 | Reforge | 美國 | cohort 課程轉軟體產品 | 2024 年轉型 | 🟡 只列名（輔助） |
| 27 | Maven | 美國 | cohort 課程平台 | 營運中 | 🟡 旁證 |
| 28 | altMBA | 美國 | cohort 課程 | 據 Maven 共同創辦人說已關閉 | 🟡 只列名 |
| 29 | Building a Second Brain cohort | 美國 | cohort 課程 | 同上 | 🟡 只列名 |
| 30 | Write of Passage | 美國 | cohort 寫作課＋社群 | 2024 年底關閉 | ✅ 選入 |
| 31 | Raspberry Pi Foundation Code Club | 英國／全球 | 志工社團網絡 | 營運中 | 🟡 旁證 |
| 32 | Duolingo | 美國 | **對照組**：純 App | 營運中 | 🟡 選入對照組 |
| 33 | Circle、Skool | — | 基礎設施：社群工具平台 | 營運中 | 🟡 旁證 |

---

## 2. 覆蓋矩陣

選了 16 個比較案例（14 個比較組、2 個對照組），加上島島本身。

| 案例 | 規模 | 營收模式 | 軟體角色 | 生命週期 | 地區 |
|---|---|---|---|---|---|
| 島島阿學 | 小 | 捐款＋活動收費（押金制）→ 探索 B2B | 自建平台＋Discord | 多次轉向 | 台灣 |
| g0v | 中 | 捐款＋專案承攬（經 OCF） | 混合（HackMD、Slack、自建小工具） | 營運中，財務吃緊 | 台灣 |
| 學思達 | 中大 | 基金會（捐助＋培訓） | 現成工具（臉書社團）＋合作平台 ShareClass | 營運中，已制度化 | 台灣 |
| 六角學院 | 中 | cohort 收費 | 混合（自建「程式勇者村」＋Discord＋Teachable） | 營運中 | 台灣 |
| Trevari | 中 | 會員收費（按季） | 自建 App，以線下為主 | 疫情重挫後回升，2025 年完全資本侵蝕 | 韓國 |
| CoderDojo Japan | 中 | 非營利（企業夥伴、捐贈） | 自建統計／地圖工具＋connpass | 營運中 | 日本 |
| Buildspace | 大 | 創投資金，未正式收費 | 自建＋直播＋Discord | **已關閉**（2024） | 美國 |
| On Deck | 大→中 | cohort／fellowship 收費 | 自建會員平台 | **大幅縮編**（2022） | 美國 |
| Women Who Code | 大 | 捐款＋企業贊助 | 現成工具為主 | **已關閉**（2024） | 全球 |
| Write of Passage | 小中 | cohort 收費 | 現成工具（Zoom 等） | **已關閉**（2024） | 美國 |
| Exercism | 大 | 捐款＋少量廣告 | 自建平台（核心） | **財務危機後改組**（2024） | 全球 |
| freeCodeCamp | 大 | 小額捐款 | 自建平台（核心）＋論壇＋Discord | 營運中 | 全球 |
| Hack Club | 大 | 捐款＋自建金融工具收費 | 自建（HCB）＋Slack | 營運中，成長中 | 全球 |
| P2PU | 小中 | 補助＋機構會員費 | 自建輕量工具 | **併入他組織**（2025） | 美國／全球 |
| Recurse Center | 小 | B2B（招聘佣金） | 自建內部工具 | 營運中（2023–24 虧損，2025 轉盈） | 美國 |
| 對照：Hahow | 大 | 內容銷售＋B2B／B2G | 平台本身就是產品 | 營運中 | 台灣 |
| 對照：Duolingo | 極大 | 免費增值訂閱 | App 本身就是產品，2022 年關閉論壇 | 營運中 | 全球 |

**覆蓋檢查**

- 規模：大、中、小都有，但「小」只有 P2PU、Recurse、Write of Passage 和島島。缺「跟島島一樣全志工、成員一兩百人」的案例深讀。
- 營收模式：會員訂閱（Trevari）、cohort 收費（六角、Write of Passage、On Deck）、捐款／非營利（g0v、WWC、Exercism、freeCodeCamp、Hack Club、CoderDojo）、B2B／機構（Recurse、P2PU Teams、Hahow for Business）、免費＋工具付費（Hack Club HCB、Duolingo）都有。
- 軟體角色：自建（Exercism、freeCodeCamp、Hack Club、Trevari）、現成工具（WWC、學思達、Write of Passage）、混合（六角、g0v、島島）都有。
- 生命週期：已關閉 3 個（Buildspace、WWC、Write of Passage）；縮編、轉型或併入 4 個（On Deck、Exercism、P2PU、Reforge）；財務惡化 1 個（Trevari）。符合「至少 3 個」的要求。
- 地區：台灣 4 個（島島、g0v、學思達、六角）＋對照組 Hahow；亞洲非台灣 2 個（Trevari、CoderDojo Japan）；其餘是英語圈。

**缺口**

- 沒有讀到**台灣的失敗或收攤案例**。有找，但台灣共學社群停辦後很少公開寫原因。
- 沒有中國大陸、東南亞的自學社群案例。
- 「全志工、無專職」又撐超過十年的學習社群，只有 The Odin Project（列名，沒深讀）和 CoderDojo 的地方道場層級。
- 島島本身的使用數據（會員數、留存、學習馬拉松完賽率）**查不到**公開資料。

---

## 3. 島島阿學公開歷史（只寫查得到的）

| 時間 | 事件 | 來源 |
|---|---|---|
| 2020 | 發起人主要來自「台灣實驗教育工作者培育計畫」的成員，加上在臉書在家自學社團認識的高中生。參加 g0v 2020 零時小學校競賽，在 g0v 找到工程師，做出第一版網站。 | iThome 2024-09-08 ✅ |
| 2020 | 第一版用 WordPress＋AirTable 架設，資料庫以 CC0 釋出。README 寫著「我們真正的構想是這個資料庫的維護和社群的營運，而非單單的一個網站」。 | GitHub LeeLin2602/DaoTW（2020-10）🟡 |
| 2020 年起 | 「以全志工的方式運作」，每兩週開一次線上會議，平時非同步協作。獲選 2020 g0v 零時小學校前五名、2021 親子天下教育創新 100。財務掛在開放文化基金會（OCF）的社群專案底下募款。 | OCF 社群專案頁 ✅ |
| 2021 | 疫情期間 FB 社團「短時間內衝到一千多人」。組織分內容、行銷公關、管理、設計、IT 等部門。 | 志工部落格 2021-08-22 🟡 |
| 2022-04 | 親子天下《翻轉教育》報導：學習資源平台、「慢慢學、不用急」（台語「沓沓仔學」）。 | 翻轉教育 2022-04-13 🟡 |
| 2024-12 至 2025-07 | 「島島盃 2025 春季學習馬拉松」：5 個月、預計入選 20 人、完賽全額退費（押金制）、總獎金 NT$25,000，搭配引導師、學習小組、Discord 和「AI 個人化學習工具」。合作夥伴：魚水教育催化劑、青醒人共生文化智庫、OCF。 | daodao.so 活動頁 🟡 |
| 2025-08-22 | LinkedIn：「面對 5 個月的承諾時，許多人開始猶豫……也有夥伴因為生活變化在中途失去動力」。 | LinkedIn 公司頁 ✅ |
| 2025-08 至 10 | 推出「學習實驗室」（4 週）與共創問卷，只邀請填過問卷的人報名。 | g0v Slack 封存 2025-08-29 🟡、vocus 2025-10-30 ✅ |
| 2025 年底 | 電子報：「『學習實驗室』因為報名人數不足而暫緩」「產品開發遇到了一些瓶頸」「預計 2026 年 1 月，大家就能看到全新形態的島島阿學」。 | Kit 電子報 ✅（**日期註記**：內文寫「2024 年已經來到尾聲」，但學習實驗室是 2025-08 才推出，研判是 2025 年底的筆誤） |
| 2025-10-30 | 從「學習計劃」（要填動機、目標、里程碑）改成「主題實踐」（7–30 天、彈性頻率、打卡），理由是填寫門檻太高。 | vocus ✅ |
| 2026-02-20 | 「主題實踐」功能上線。 | LinkedIn ✅ |
| 2026 上半年（研判） | 辦了《Rewire 神經可塑性》共讀聚會；7/1–7/27 在 Discord 辦第二場「re-Visit」共讀（每週一、三晚上，免費）。電子報說這讓團隊「更清楚島島阿學的方向」。 | Kit 電子報 ✅（年份由相對時間推算） |
| 2026-09-15 | 「重新思考島島服務的『第一個人』是誰」，開始注意「提供課程、coaching、mentoring、工作坊，或經營學習社群的人」。公司簡介改為「幫助講師、教練與引導者，把好的學習體驗，變成更容易執行……的學習計畫」。 | LinkedIn ✅ |
| 2026-10（第三方估計） | LinkedIn 顯示員工 2 人、追蹤者 19 人；第三方流量估計每月 581 次造訪。 | LinkedIn 聚合頁 ✅（流量數字是第三方估計，可信度低） |

**跟 g0v、實驗教育的關係（查得到的部分）**：出身 g0v 零時小學校；g0v Slack 有 #edu-daodao 頻道（2025-08 仍在使用）；財務由 OCF 代管；發起人來自實驗教育工作者培育計畫；2025 年學習馬拉松的引導師之一謝佩君是魚水教育催化劑創辦人。

**查不到**：會員數、Discord 活躍人數、學習馬拉松實際入選人數與完賽率、年度收支。

---

## 4. 案例卡

### 4.1 g0v 零時政府（揪松團）— 台灣｜中｜捐款＋承攬｜混合工具｜營運中但財務吃緊

- 成立：2012 年 12 月第一場黑客松；2014 年成立揪松團（g0v 揪松團治理文件，2024/12 更新 ✅）。
- 規模：「累積 59+ 次黑客松、7200+ 參加人次、950+ 提案……超過 200 個成型專案」（OCF g0v 大松頁，2024-07 🟡）。揪松團「三位支薪職工與七位志工」（同頁）；2024/12 的版本是「七位志工，以及專案合作人員」（治理文件 ✅）。
- 營收：定期定額捐款、單筆捐款、義賣、黑客松贊助、接案盈餘，經 OCF 代管。2020 年後兩三年的主要收入是「水源計劃」和疫情期間的線上辦松接案；水源計劃「只有三年，非常吃 Isabel 的人脈」，接案需求也隨疫情消退。2024 年 2 月時，定期定額每月約 2.2 萬元（留言更正值，2024-03 統計），要「勉強」維持辦公室、HackMD／AWS 和每雙月的百人黑客松，大約需要每月 5–6 萬元（Ronny Wang 2024-02-28 ✅）。
- 軟體的角色：基礎建設（HackMD、Slack、一鍵開大松等），不是產品。
- 社群機制：每兩個月一次實體黑客松、提案制、坑主制；揪松團決策委員採邀請制，「三個月未參與……確認是否有意願繼續貢獻，否則退出」（治理文件 ✅）。
- 倦怠處理：明文規定不活躍就退出；2025 年的工作重點是「建立給專案坑主及主題社群的支持系統」；COSCUP 2024 有一場〈開放文化下公民參與的困境與倦怠〉（只看到議程，🟡）。
- 成敗關鍵：社群能量很強，但錢靠少數人的人脈和一次性專案，2024 年要發起「救松行動」節流。他們公開討論過要不要收費：「如果收費會不會讓一些想出力的人反而降低參與意願呢？」
- 對島島的啟示：島島的直系母體也撐不起常態職工，捐款連固定開銷都不夠。**社群優先不會自動帶來財源**；g0v 能活下來靠的是「實體聚會＋開放提案」這個不太需要中央經營的機制。

### 4.2 學思達教學社群／學思達教育基金會 — 台灣｜中大｜基金會｜現成工具為主｜營運中

- 成立：2013 年 9 月開始推廣；2020 年成立基金會，2021 年正式運作（基金會「關於」頁 ✅）。
- 規模：臉書「學思達教學社群」2020-05 時 6.3 萬名成員（未來親子 2020-05 🟡）；2024-09 時「八萬多名成員」（未來親子週刊 2024-09 🟡）；核心講師 2020 年約 80 人（同 2020 年報導），2023 年「170 位共同推動的老師群」（亞洲年會參加者部落格 2023-03 🟡）。
- 營收：2016 年起由公益平台、誠致兩個基金會支持行政與資源，後來自己成立基金會（「關於」頁 ✅）。年度收支：**查不到**。
- 軟體的角色：臉書社團做即時交流；講義放在均一的 ShareClass；經驗分享用 Medium，影片用 YouTube。**完全沒有自建核心平台**（資源頁 🟡）。
- 社群機制：「開放教室」（任何人都可以進去觀課）、講義共享、學科子社團、亞洲年會、認證與教師成長路徑。
- 倦怠處理：創辦人辭去教職全職投入（2018 年）；後來建立講師群、認證制度和基金會，降低對創辦人一人的依賴。
- 成敗關鍵：**一個可以模仿的具體做法（學思達教學法）＋開放教室**當入口，社群人數跟著方法擴散；組織化（基金會、認證）是第 7 到 8 年才做的。
- 對島島的啟示：社群規模可以完全建在別人的工具上。軟體不是瓶頸，「可以帶回去用的方法」才是。島島的「自主學習方法」如果要擴散，可能需要像「開放教室」這樣能讓外人看得到、學得走的形式。

### 4.3 六角學院 — 台灣｜中｜cohort 收費｜混合（自建＋Discord＋Teachable）｜營運中

- 成立：2016 年（廖洧杰 Medium 2019-06 🟡）。從前端社群起家（創業講座頁：「從社群發跡，再到創辦公司」，三年多累積 1.8 萬名學員；講座日期未標，🟡）。
- 規模：Discord 共學頻道「超過 3,000 人」（官方部落格 2021-12 🟡）；校長的影音課學生數「超過 30,000」（Node.js 直播班頁，2026 年梯次 🟡）。
- 營收：直播班收費，例如「JS+Vue 前端工程師培訓班」NT$27,340、加上專題班 NT$47,980（課程頁，2026 梯次 🟡），另有影音課。
- 軟體的角色：自建「程式勇者村 RPG」（交任務、看行事曆、每日打卡儀表板、領證書）、影音放 Teachable、討論用 Discord（2026 雲端班系統導覽 🟡）。軟體負責的是**進度與回饋的結構**，社群活動在 Discord。
- 社群機制：每日小任務在 Discord 討論串打卡、可以看別人的答案；助教批改週任務；專題分組並配教練；先完成「報到任務」才能進 Discord。
- 倦怠處理：靠**付費助教**承接回應壓力（「每門課程約配置 3～5 位的專屬助教」，2021-12 🟡），而不是靠志工。
- 成敗關鍵：學員付錢買的是「轉職」這個明確結果；社群和助教是讓人完成的手段。
- 對島島的啟示：島島 2026 年的「主題實踐＋打卡」在機制上很像六角的每日任務，但六角能收費，是因為**結果明確（找到工作）而且有人回應**。島島做的是「興趣探索、生活學習」，付費意願可能弱很多。這是推論，沒有資料。

### 4.4 Trevari 트레바리 — 韓國｜中｜按季會員收費｜自建 App，以線下為主｜回升後再惡化

- 成立：2015 年 9 月開始營運（東亞日報 2023-03 🟡）；法人 2018 年底設立（Forbes Korea 2024-04 ✅）。
- 規模：累積付費會員 10 萬、營運中的讀書會約 400 個（2024 年 4 月，Forbes Korea ✅）；累積會員 106,973（Edaily 2025-01 🟡）。
- 營收：每個讀書會 4 個月約 30 萬韓元。營收 2022 年 40.3 億、2023 年 50 億韓元（Forbes Korea ✅）；2025 年營收 52 億、營業損失 4 億韓元，「7 年連續虧損」、完全資本侵蝕（brunch 轉載創業資料庫，2026-05 ✅；Naver Premium 2026-04 🟡）。疫情期間「會員數比疫情前減少 75%」（Edaily 2025-01 🟡）。
- 軟體的角色：輔助線下。2021 年起擴編 IT 人力，讓會員在線上預先交流讀後感、發現其他讀書會；但創辦人說疫情期間「開了線上社群，沒有做出有意義的成績」（Forbes Korea ✅）。
- 社群機制：**聚會前必須交 400 字讀後感，沒交就不能參加**；每月一次在自營空間聚會；讀書會由名人「클럽장」（club leader）或經過甄選的兼職「파트너」（partner）帶領（Forbes Korea ✅）。
- 倦怠處理：帶領者是**有酬的兼職 partner**，公司負責策劃內容與招募 leader，所以品質控管和人力負擔都在公司身上。
- 成敗關鍵：付費＋讀後感門檻做出高品質討論，但固定成本重（「人事費、租金等必要固定費用占管銷將近一半」，brunch ✅）。現在開始做企業內部讀書會的 B2B（同上）。
- 對島島的啟示：**亞洲已經被驗證過、最接近「付費社群為主」的案例，十年下來還是很難賺錢。** 門檻機制（讀後感）能提高品質，這點可以借用；但「靠會員費養社群」這條路要先看 Trevari 的損益表。評論者的結論是「直接靠社群賺錢的難度是最高級，替代方案是間接模式」（brunch ✅）。

### 4.5 CoderDojo Japan — 日本｜中｜非營利｜自建統計工具＋現成報名平台｜營運中

- 成立：日本第一個道場 2012 年；2016 年成立官方法人（CoderDojo Japan 2024 年活動報告投影片 🟡）。
- 規模：活躍道場 207 個；2025 年實際統計 1,274 場活動、7,706 人次；統計涵蓋率 73.7%，推估約 10,455 人次（統計頁，每週更新，2026-10 讀取 ✅）。疫情時從 2019 年的 1,517 場掉到 2021 年的 1,073 場（同頁）。
- 營收：非營利。25 家以上的夥伴法人提供捐贈、合作（PR TIMES 2024-02 🟡）。年度收支：有公開決算報告的連結，但**沒有讀**。
- 軟體的角色：法人自己開發 DojoMap、Stats、Kata 等輔助工具，報名用 connpass；**每個道場的活動完全由地方志工自主舉辦**（about 頁 ✅）。
- 社群機制：「參加者自己想好要做什麼再來，道場幫忙實現」，不綁特定課程（about 頁 ✅）。
- 倦怠處理：分散式。根據 Raspberry Pi Foundation 2024 年社團年度調查，平均每個 CoderDojo 有 4 位志工，48% 的 CoderDojo 有未滿 18 歲的志工協助；志工回報的主要挑戰是「時間不夠」和「招募志工」（2024 Clubs Annual Survey PDF 🟡；這是全球數據，不是日本）。
- 成敗關鍵：中央只做標準、地圖、數據和企業合作；**地方道場可以自由開關，整個網絡不會因為某個人倦怠就倒。**
- 對島島的啟示：如果島島要「長期做社群」，CoderDojo 的分工值得參考：中央是輕量的支援層和工具層，社群活動由很多小型、在地、可以替換的主持人撐起來。

### 4.6 Buildspace — 美國｜大｜創投資金｜自建＋Discord｜已關閉（2024-08）

- 成立：前身 Zipschool；Buildspace 約在 2020–2021 年轉型（關站信只寫到「two years at zipschool」）。
- 規模：關站信說「touched the lives of millions of people」、「launched a new ai product to 100,000 users」（buildspace.so/letter，2024-08-23 ✅）。第三方整理說約 15 萬人參加過計畫（openalmanac 🟡，二手資料）。
- 營收：a16z 等創投投資；信中說「we'd confidently make $3-5m arr off sponsorships」，而且還有「2+ years in the bank」（✅）。
- 軟體的角色：直播、自建產品（Sage）、Discord、季制的 Nights & Weekends。
- 社群機制：季制 cohort（「seasons」）、分院、直播互動、舊金山實體空間。
- 倦怠處理：沒有制度化的處理。創辦人自述從 2023-09（第 4 季結束後）開始失去動力，一年後關站。
- 成敗關鍵：**不是錢的問題，是創辦人的能量。** 第三方引述創辦人說，公司不好交接，因為「It was more of a community/brand versus a product that someone could come in and continue running」（openalmanac 引述 🟡，原始出處沒有讀到）。
- 對島島的啟示：**社群型組織有一個獨特的失敗模式：太依附核心人物的品牌和熱情。** 錢夠也救不了。這點跟島島「志工來來去去」的歷史直接相關。

### 4.7 On Deck → ODF — 美國｜大→中｜fellowship 收費｜自建平台｜大幅縮編

- 成立：2019 年 6 月（TechCrunch 2022-05 🟡）。
- 規模：高峰時「communities serving over ten thousand founders and career professionals」（創辦人部落格，經 TechCrunch 2022-08 引述 🟡）；2022 年 5 月裁員約 72 人、8 月再裁 73 人（TechCrunch 🟡；前員工回顧 2024-02 🟡）。現在的 ODF 是「一週實體」fellowship，每期 80–100 人，社群平台 3,000 多名會員（beondeck.com 現行頁 ✅）。
- 營收：大約 20 種 fellowship 收費，例如 climate fellowship 收 $2,490（TechCrunch 🟡），另有加速器投資；前員工說高峰時年營收 run rate 約 2,000 萬美元（boringbusinessnerd 2024-02 🟡）。
- 軟體的角色：自建會員平台。
- 成敗關鍵：創辦人自己的檢討：「What we’ve always projected as a strength — serving multiple user groups and building flywheels between them — also fractured our focus and brand.」（經 TechCrunch 引述 🟡；原始部落格文章換了網址，**沒有讀到原文**）。另外，原本承諾的資金臨時撤回，加上招聘擴張太快。
- 對島島的啟示：**同時服務太多種族群的社群會分裂。** 島島從「學生、家長、教育者」到「成人興趣學習」再到「引導者」，族群換過好幾次，要留意同時服務多群人的成本。

### 4.8 Women Who Code — 全球｜大｜捐款＋企業贊助｜現成工具｜已關閉（2024-04）

- 成立：2011 年社群，2013 年登記為 501(c)(3)（關站公告 ✅）。
- 規模：會員 36 萬多人、145 國、1,000 多位志工帶地方社群、2 萬多場活動、志工時數超過 100 萬小時（關站公告 2024-04-18 ✅）。
- 營收：BBC 引述最近一份年報（2022 年）：收入約 400 萬美元、支出約 420 萬美元（BBC 2024-04-19 🟡）。
- 倦怠處理：靠大量志工；組織本身因為資金來源受影響而解散（「factors that have materially impacted our funding sources」✅）。
- 成敗關鍵：**社群巨大、志工充沛，仍然因為依賴企業贊助而在科技業景氣下滑時倒閉。** 品牌後來被 TechFutures 接手（womenwhocode.com/about 🟡）。
- 對島島的啟示：規模和志工能量不能取代財源分散。依賴單一類型的贊助者是結構性風險。

### 4.9 Write of Passage — 美國｜小中｜cohort 收費｜現成工具｜已關閉（2024 年底）

- 規模：「2,000+ students from 72 countries」、NPS 75（最後一期公告 2024-08-19 ✅）。
- 營收：cohort 收費，一年兩期。
- 成敗關鍵：「We’ve built something worth celebrating in every way, except for the economics of the business」；「the main thing we were missing was a dependable flow of new students」；創辦人也想回去做自己的創作（✅）。
- 旁證：Maven 共同創辦人 Gagan Biyani 在 2024-10-30 說，altMBA、Building a Second Brain、Write of Passage 一年內相繼關閉，他歸因於：課程大約有 5–8 年壽命、創作者的受眾會耗盡、人事等固定成本高、X 演算法讓追蹤者的價值下降（LinkedIn 🟡）。另一位 cohort 課經營者認為，cohort 的新生來源取決於創辦人觸及率的成長，而且回購很難：「Out of the 116 people who took my CBC, only a few enrolled a second time」（Lisa Kostova LinkedIn 2024-08 🟡）。
- 對島島的啟示：**cohort 制做得出好體驗，但新學員來源和回購是硬傷。** 島島的學習馬拉松、學習實驗室都是 cohort 形式，「報名人數不足」是同一類問題的早期訊號。

### 4.10 Exercism — 全球｜大｜捐款＋少量廣告｜自建平台（核心）｜財務危機後改組（2024-09）

- 規模：2024 年 9 月 200 萬使用者、4,500 萬次練習提交、每天 1,200 多人註冊（部落格 2024-09-05 ✅）；現在影響力頁寫 3,124,562 名學生、19,603 位 mentor、5,508 位程式貢獻者、3 位全職員工（impact 頁，讀取 2026-10 🟡）。
- 營收：「about 800 monthly donors and about $7,500 in monthly donations. That covers our server costs pretty much exactly」（2024-09 ✅）。捐款頁目前顯示每月 $10,253，「Sustainable at: $25,000」（讀取 2026-10 🟡）。
- 成敗關鍵：創辦人說「I've lost faith in the nonprofit business model」；「By serving people everywhere……we don't serve a narrow enough demographic」，所以不符合補助方的使命（✅）。後來用營利公司做新產品來補貼 Exercism，並考慮推 Exercism Teams 收費版。
- 倦怠處理：付不出薪水，核心員工轉為志工維護者；改成每個 PR 都要審查，把維運工作分散到整個組織（✅）。
- 對島島的啟示：**捐款付得起伺服器，付不起人。** 「服務所有人」對補助方來說太模糊。島島如果要申請補助，需要更窄、更容易描述的受益者。

### 4.11 freeCodeCamp — 全球｜大｜小額捐款｜自建平台＋論壇＋Discord｜營運中

- 規模：「more than half a million people use freeCodeCamp every day」（Quincy Larson 2025-03 🟡）；2025 年合併 4,279 個 commit，611 位主要開源貢獻者（2025-11 🟡）。
- 營收：每月定期捐款者約 10,342 人（2025-11）或 10,221 人（2025-12）（兩則貼文數字略有出入，🟡）；年度預算「only a few hundred thousand dollars per year」（2025-03 🟡）；另有 Google、Microsoft 的小額補助（訪談 2025-12 🟡）。
- 社群機制：把貢獻流程完全寫成文件（contribute.freecodecamp.org）；用 good first issue 標籤；論壇問答；Discord 即時交流。創辦人說「That way we’re not onboarding a whole lot of people manually」（訪談 2025-12 🟡）。
- 對島島的啟示：要靠捐款撐下去，前提是**每天幾十萬人使用、成本壓到極低、志工上手流程完全自助**。島島目前的規模（第三方估計每月不到一千次造訪）離這個前提很遠。

### 4.12 Hack Club — 全球｜大｜捐款＋自建工具收費｜自建（HCB）｜營運中、成長中

- 成立：Hack Foundation 2016 年成立（2024 年 990 表 🟡）。
- 規模：2025 年社群超過 10 萬名青少年、99 個以上國家；1,440 個社團（新增 520 個）；22,394 個專案（2024 年是 5,600 個）（2025 年報 🟡）。
- 營收：2025 年總收入 $8,911,074，其中捐款 $6,416,916、earned（主要是 HCB）$2,007,146；「one-fifth of Hack Club revenue was earned via HCB」（2025 年報 🟡）。2024 年 990 表：Hack Club 本身收入 $5,238,425（🟡）。
- 軟體的角色：**HCB 原本是 2018 年為自己的青少年社團做的金流工具**，後來開放給其他非營利組織，收 7% 手續費，2025 年經手 1.1 億美元交易（fiscal sponsorship 頁、年報 🟡）。
- 倦怠處理：2025 年聘了 20 位青少年做全職有薪的 gap year，由他們設計和經營計畫；「80% of our staff is now younger than 19」（年報 🟡）。把社群成員變成有薪經營者。
- 對島島的啟示：**最接近「社群為主、軟體為輔，而且軟體真的帶來收入」的正面案例。** 順序是：先為自己的社群主持人解決真實的營運痛點（金流），證明有用之後，才賣給同類組織。島島 2026-09 轉向「幫引導者省去追進度的工」，方向相似，但 Hack Club 的工具是先在**自己 1,000 多個社團**裡驗證過的。

### 4.13 P2PU（Peer 2 Peer University）— 全球｜小中｜補助＋機構會員費｜自建輕量工具｜併入他組織（2025-05）

- 成立：learning circles 從 2015 年跟芝加哥公共圖書館試行開始（P2PU 部落格 2016、2020 🟡）。
- 規模：2018 年時網站上建立過 394 個 learning circles、約 4,000 名學習者、100 多個城市（AACE 訪談 2018 🟡）；IMLS 補助期間 11 個夥伴圖書館辦了 200 多個 circle，「10 of our original 11 library partners are still running learning circles even though the grant has ended」（2020-07 🟡）。
- 營收：補助（Knight、IMLS 等）＋ Teams 會員費（機構按規模付 $2,000–$10,000／年，含軟體、培訓、實踐社群）＋服務收費（Teams 頁、Services 頁 🟡）。
- 社群機制：輕度引導的讀書會，**帶領者不是老師、也不需要是專家**；6–8 週、每週 90 分鐘、4–12 人（handbook 🟡）。
- 生命週期：2024 年重新檢討策略；2025-05 併入 Detroit Public Library Foundation，理由是「in this climate, where resources for non-profits are growing more scarce」（部落格 2025-05-08 ✅）。
- 對島島的啟示：**在機制上是最像島島理念的案例（同儕、去階層、引導者不是老師），付錢的是機構，不是學習者。** 但即使有機構付費，2025 年還是需要找更大的組織當靠山。「引導者工具＋機構會員」能讓組織活著，不保證能長大。

### 4.14 Recurse Center — 美國｜小｜B2B 招聘佣金｜自建內部工具｜營運中

- 成立：2011 年（about-us 頁 🟡）。
- 營收：參加者完全免費；企業聘用 RC 校友時付「25% of a candidate’s first year salary」（hire 頁 🟡）。只拿過 YC 的 $17,000 外部資金，其他種子輪都退還了（about-us 🟡）。
- 景氣敏感度：CEO 說「Starting in late 2022, it's been the worst market for hiring engineers since we started」（Understanding AI 2025-08 引述 🟡）；「2025……We returned to profitability」（CEO LinkedIn 2026-01 🟡）。
- 社群機制：6 或 12 週的 batch、沒有課程、自己決定要做什麼；「learning generously」——寫 check-in、展示半成品、結對程式設計（部落格 2024-07 🟡）。
- 對島島的啟示：**讓第三方為社群的產出付錢**，學習者完全免費，是很漂亮的解法。但收入完全綁在一個市場（工程師招聘），2023–24 年因此虧損。島島的學習者沒有這種明確的「下游買家」，這也是它比較難的地方。

### 4.15 對照組：Hahow 好學校 — 台灣｜大｜內容＋B2B／B2G｜平台即產品

- 規模：2024 年 7 月約 110 萬會員；2025 年第一季全通路會員 145 萬，營收年增 115%（自由財經 2024-07 🟡、經濟日報 2025-06 🟡）。
- 營收結構：約 60% 個人、30% 企業、10% 公部門（鉅亨網 2024-07 🟡）；Hahow for Business 累計 250 家以上企業（同上）。
- 跟島島的差異：Hahow 賣的是內容，學習者之間的互相回應不是核心。它在台灣的成長來自**企業和公部門**，個人端以職場技能為主（行銷、程式、設計、AI 應用占 57%，經貿透視 2024-11 🟡）。
- 對照意義：在台灣，「學習」能規模化收錢的路徑，是 B2B／B2G 加上職場技能。島島鎖定的「興趣探索、生活學習」，正好是 Hahow 數據裡比較弱的區塊（推論）。

### 4.16 對照組：Duolingo — 全球｜極大｜免費增值訂閱｜App 即產品

- 規模：2025 年第三季 DAU 超過 5,000 萬（Q3 2025 股東信 🟡）；2025-12-31 時連續學習 7 天以上的 DAU 約 4,300 萬，365 天以上約 1,500 萬（2025 年報 10-K 🟡）。
- 社群的處理：2017 年因為效能和「only a small percentage of total user adoption」移除 Activity Stream（CEO 公告存檔 🟡）；**2022-03-22 關閉論壇**（Fandom FAQ 🟡）；之後改成「輕社交」：好友連續紀錄、好友排行榜、Friends Quests（Duolingo 部落格 2025-12 🟡）。
- 對照意義：純 App 可以把「社群」壓縮成遊戲化的同儕壓力，而且規模極大。但這條路需要極大的工程與內容投資，島島沒有條件走。反過來看，**光靠打卡、連續紀錄這類功能，很難做出 Duolingo 等級的差異化。**

### 輔助案例（只做短註）

- **Reforge**：7 年 cohort 教育品牌，2024 年裁員、把課程主題縮到核心 20%，轉做給產品團隊用的 AI 軟體，9 個月推出 5 個產品（第三方訪談 2026-01 🟡；LinkedIn 2025-11 🟡）。轉型的依據是學員多年來一直說「That course was amazing…but can you help me do/implement X」。這是**反方向**的案例：社群／教育公司最後選擇讓軟體當主角。
- **The Odin Project**：全志工維護的開源課程；捐款經 Open Collective，只付伺服器等成本，「Your money does not go towards paying the maintainers」；很多維護者是自己在這裡學會的人（support、about 頁 🟡）。
- **Lambda School／BloomTech**：2024-04 CFPB 認定 ISA 是貸款、就業率灌水（宣稱最高 86%，內部數據接近 50%），永久禁止公司從事消費貸款（CFPB 公告 🟡）。這是 bootcamp 的失敗，不是社群優先的失敗，所以只列名。

---

## 5. 反證與「社群無法規模化／無法賺錢」的論點

1. **付費社群的財務難度**：Trevari 是付費讀書會的代表，2025 年營收 52 億韓元、營業損失 4 億、完全資本侵蝕；評論者認為「直接靠社群賺錢的難度是最高級，替代方案是間接模式」（brunch 2026-05 ✅）。
2. **cohort 課程有壽命**：Write of Passage、altMBA、BASB 在 2024 年前後相繼關閉（Perell ✅、Biyani 🟡）。
3. **非營利捐款撐不起人力**：Exercism（✅）、g0v（✅）、WWC（✅）、P2PU（✅）都在 2024–2025 年遇到資金緊縮。
4. **付費社群的流失率**：創作者社群圈常說的數字是每月 7–12%（Skool 社群貼文 2025-09 🟡）、10–18%（startuptrio 2024-07 🟡）。**這些是低品質來源，只能當方向參考，不能引用成事實。**同一批來源也說，有固定期限的 cohort 和挑戰能明顯降低流失，同樣**沒有一手數據**。
5. **企業社群產業正在縮編**：CMX 2025 年報告（589 位社群工作者，2025-05 至 06 調查）：17% 沒有任何全職社群人員，是歷年最高；ROI 仍然是頭號挑戰（✅ 讀了前段）。這類受訪者以企業社群為主，跟島島只能當旁證。
6. **志工倦怠是常態**：Tidelift 2024 年維護者調查，60% 沒有報酬，60% 已經退出或考慮退出（Tidelift 2024 一頁摘要 🟡）。這是開源維護者，不是學習社群的主持人，但機制類似。
7. **反方向的成功**：Reforge 從教育社群轉向軟體；Duolingo 拿掉論壇以後繼續大幅成長。這兩個案例說明「軟體為主」本身不是錯的方向，關鍵在於誰付錢、付錢買什麼。

---

## 6. 跨案例發現（最可能改變「島島該怎麼經營」判斷的幾條）

1. **能長期活下來的社群型學習組織，錢幾乎都不是學習者為了「社群」而付的。** Recurse（企業招聘佣金）、Hack Club（大額捐款＋HCB 工具收費占 1/5）、P2PU（圖書館付 Teams 會員費）、學思達（基金會支持）、CoderDojo（企業夥伴）都是這樣。學習者自己付會員費或 cohort 費、以社群為主要賣點的案例（Trevari、Write of Passage、On Deck），不是虧損、關閉，就是大幅縮編。→ 島島 2026-09 把服務對象改成「講師、教練、引導者」，是往「讓別人付錢」的方向走，跟這個模式一致。但要釐清：引導者付錢買的是**工具**，還是**社群提供的支持**。
2. **捐款能付伺服器，付不起人。** Exercism：每月 $7,500 剛好打平伺服器費；g0v：每月 2.2 萬元，連一半的固定開銷都不夠；freeCodeCamp 靠 1 萬多名捐款者，背後是每天 50 萬名使用者。島島目前的規模，捐款和補助只能當輔助收入，不能當主要財源。
3. **真正的單點故障是核心人物的能量，不是錢。** Buildspace 有兩年以上的資金照樣關站；Write of Passage 的創辦人想回去做自己的創作；g0v 的財源「非常吃 Isabel 的人脈」。撐得比較久的做法是把主持責任**分散並付費或制度化**：Trevari 的兼職 partner、Hack Club 的有薪青少年、六角的付費助教、CoderDojo 的地方道場、g0v「三個月沒參與就確認去留」。島島從 2020 年起就是全志工、每兩週開會，這是目前最大的結構性風險。
4. **軟體成為收入來源的前提，是先在自己的社群裡證明它能減輕主持人的負擔。** Hack Club 的 HCB 先服務自己的社團，才開放給外部；P2PU 的 Teams 軟體綁在圖書館的培訓與實踐社群裡一起賣；CoderDojo 的工具只服務自家道場。島島的工具過去主要做給**學習者**（資源庫 → 學習計劃 → 主題實踐），而學習者端的付費證據最弱。如果轉向引導者，先讓島島自己的活動帶領者用起來，可能比直接對外賣更重要。這是推論，可以實際驗證。
5. **有期限、有門檻的形式，能做出品質；但新人來源是另一個獨立的問題。** Trevari 的 400 字讀後感、P2PU 的 6–8 週、Recurse 的 batch、六角的每日任務，都能讓參與者互相回應。但 Write of Passage 的教訓是：體驗再好，沒有穩定的新學員來源也會倒。島島已經碰到這個問題：5 個月的馬拉松讓人卻步，學習實驗室因報名不足暫緩。縮成 7–30 天能降低門檻，但不會自動帶來新學員。

---

## 7. 仍有的缺口

- 台灣共學社群的失敗案例（例如停辦的讀書會品牌、收掉的自學社群）沒有找到公開的檢討文。
- 島島自己的數據（會員數、主題實踐使用率、馬拉松完賽率、收支）沒有公開資料；這部分可能要直接問團隊。
- 學思達、CoderDojo Japan、g0v 揪松團的年度收支沒有讀（CoderDojo 有公開決算報告連結，OCF 有年度成果報告，下一輪可以補）。
- On Deck 創辦人的原始部落格文章換了網址，只讀到 TechCrunch 的引述。
- Buildspace 的參與人數只有二手資料（約 15 萬人）。
- 付費社群流失率沒有可靠的一手研究。
- 中國大陸、東南亞的同類案例沒有掃。

---

## 8. 來源表

| # | 來源 | URL | 狀態 | 發布或資料日期 |
|---|---|---|---|---|
| 1 | 島島阿學「關於」頁 | https://daodao.so/about | ✅ | 讀取 2026-10-29 |
| 2 | 島島阿學首頁 | https://daodao.so/ | ✅ | 讀取 2026-10-29 |
| 3 | 島島 Kit 電子報〈re-Visit 共讀聚會〉 | https://daoda.kit.com/posts/re-visit | ✅ | 研判 2026-06（頁面只顯示相對時間；比 #4 晚約 6 個月） |
| 4 | 島島 Kit 電子報〈卡關、收歛、重新調整〉 | https://daoda.kit.com/posts/-6 | ✅ | 研判 2025-12（內文寫 2024） |
| 5 | 島島 Kit 電子報〈螺旋式成長〉 | https://daoda.kit.com/posts/-5 | 🟡 | 約 2025-11 |
| 6 | OCF 島島阿學社群專案頁 | https://ocf.tw/p/daodao/ | ✅ | 未標日期 |
| 7 | iThome〈Day 7: 島島阿學的誕生〉 | https://ithelp.ithome.com.tw/articles/10348539 | ✅ | 2024-09-08 |
| 8 | GitHub DaoTW README | https://github.com/LeeLin2602/DaoTW | 🟡 | 2020-10 |
| 9 | 志工招募文 | https://blog.yyisyou.tw/b3ef37bf/ | 🟡 | 2021-08-22 |
| 10 | 翻轉教育報導 | https://flipedu.parenting.com.tw/article/007256 | 🟡 | 2022-04-13 |
| 11 | g0v HackMD 島島入口頁 | https://g0v.hackmd.io/@daodaoedu/HydZGAUYc | 🟡 | 約 2022 |
| 12 | 2025 春季學習馬拉松頁 | https://daodao.so/zh-TW/learning-marathons/2025S1 | 🟡 | 2024-12 至 2025-07 |
| 13 | g0v Slack 封存 #edu-daodao | https://g0v-slack-archive.g0v.ronny.tw/index/channel/C0182TQTVV2/2025-08 | 🟡 | 2025-08-29 |
| 14 | vocus〈學習實驗室〉 | https://vocus.cc/article/690203fefd8978000130c914 | ✅ | 2025-10-30 |
| 15 | LinkedIn 島島公司頁（聚合頁） | https://tw.linkedin.com/company/daodaolearn | ✅ | 貼文 2024-12 至 2026-09 |
| 16 | g0v 揪松團工作計畫與治理機制 | https://g0v.hackmd.io/@jothon/rksXtoYj8Q | ✅ | 2024/12 更新 |
| 17 | OCF g0v 大松頁 | https://ocf.tw/p/g0vdathon/ | 🟡 | 2024-07-20 |
| 18 | Ronny Wang〈想讓 g0v 活著有多難？(下)〉 | https://ronnywang.substack.com/p/20240228-g0v | ✅ | 2024-02-28 |
| 19 | OCF 2024 成果報告 | https://ocf.tw/p/2024/ | 🟡 | 2024 |
| 20 | COSCUP 2024 倦怠議程 | https://coscup.org/2024/zh-TW/session/PDFEGE | 🟡 | 2024 |
| 21 | 學思達基金會「關於」頁 | https://sharestart.org/about/ | 🟡 | 未標日期 |
| 22 | 學思達老師支持系統頁 | https://www.sharestart.org/234162460536948327692410725903253453199532113.html | 🟡 | 未標日期 |
| 23 | 未來親子：張輝誠 | https://futureparenting.cwgv.com.tw/family/weekly/index/195/6 | 🟡 | 2024-09-24 |
| 24 | 未來親子：普林思頓學思達學校 | https://futureparenting.cwgv.com.tw/family/content/index/17890 | 🟡 | 2020-05-01 |
| 25 | 學思達 2023 亞洲年會心得 | https://maggiloveshare.com/archives/15787 | 🟡 | 2023-03-02 |
| 26 | 六角學院福利說明 | https://www.hexschool.com/2021/12/21/2021-12-21-hex-service/ | 🟡 | 2021-12-21 |
| 27 | 六角 Node.js 直播班 | https://www.hexschool.com/courses/nodejs-training.html | 🟡 | 2026 梯次 |
| 28 | 六角前端培訓班 | https://www.hexschool.com/courses/frontend-training.html | 🟡 | 2026 梯次 |
| 29 | 六角雲端班系統導覽 | https://hackmd.io/@hexschool/BJa3DtBwGe | 🟡 | 2026 |
| 30 | DAKUO 講座：六角從社群到公司 | https://dakuo.kktix.cc/events/khfunstart-12?locale=ja | 🟡 | 未標日期 |
| 31 | 廖洧杰 Medium | https://medium.com/@gonsakon/%E8%A8%82%E9%96%B1%E7%B6%93%E6%BF%9F-%E6%88%91%E5%9C%A8-pressplay-%E7%9A%84%E8%A8%82%E9%96%B1%E6%AD%B7%E7%A8%8B-1-3c3e5dc77a27 | 🟡 | 2019-06-13 |
| 32 | Forbes Korea：Trevari 尹秀英 | https://www.forbeskorea.co.kr/news/articleView.html?idxno=339603 | ✅ | 2024-04-24 |
| 33 | Edaily：Class101、Trevari | https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=01594086642036080 | 🟡 | 2025-01-08 |
| 34 | brunch〈트레바리에 대한 우려〉 | https://brunch.co.kr/@rory/2384 | ✅ | 2026-05-23 |
| 35 | Naver Premium：Trevari 完全資本侵蝕 | https://contents.premium.naver.com/outstanding/outstandcrew/contents/260421183231439fj | 🟡（付費牆） | 2026-04-21 |
| 36 | 東亞日報：Trevari | https://www.donga.com/news/Economy/article/all/20230306/118193701/1 | 🟡 | 2023-03-07 |
| 37 | Daum：텍스트힙 트렌드 | https://v.daum.net/v/20250211100906398 | 🟡 | 2025-02-11 |
| 38 | CoderDojo Japan 統計頁 | https://coderdojo.jp/english/stats | ✅ | 每週更新，讀取 2026-10-29 |
| 39 | CoderDojo Japan「關於」頁 | https://coderdojo.jp/about | ✅ | 讀取 2026-10-29 |
| 40 | CoderDojo Japan 2024 活動報告 | https://speakerdeck.com/coderdojojapan/coderdojo-japan-in-2024 | 🟡 | 2024-09-15 |
| 41 | PR TIMES CoderDojo Japan | https://prtimes.jp/main/html/rd/p/000000012.000038935.html | 🟡 | 2024-02-29 |
| 42 | Raspberry Pi Foundation 2024 社團調查 | https://static.raspberrypi.org/files/clubs/Raspberry_Pi_Foundation_Clubs_Annual_Survey_2024.pdf | 🟡 | 2024 |
| 43 | Buildspace 關站信 | https://buildspace.so/letter | ✅ | 2024-08-23 |
| 44 | openalmanac Buildspace 條目 | https://www.openalmanac.org/w/founders-inc/buildspace | 🟡（二手） | 未標日期 |
| 45 | TechCrunch On Deck 2022-05 | https://techcrunch.com/2022/05/05/on-deck-lay-off-accelerator/ | 🟡 | 2022-05-05 |
| 46 | TechCrunch On Deck 2022-08 | https://techcrunch.com/2022/08/04/on-deck-lays-off-a-third-of-staff-after-cutting-a-quarter-just-months-prior/ | 🟡 | 2022-08-04 |
| 47 | TechCrunch On Deck 2022-09 | https://techcrunch.com/2022/09/22/on-deck-tried-to-do-it-all-now-its-trying-to-do-less-better/ | 🟡 | 2022-09-22 |
| 48 | 前員工回顧 On Deck | https://www.boringbusinessnerd.com/post/what-i-learned-working-in-a-hypergrowth-startup | 🟡 | 2024-02-25 |
| 49 | ODF 現行頁 | https://www.beondeck.com/post/on-deck-refocus | ✅ | 讀取 2026-10-29 |
| 50 | Women Who Code 關站公告 | https://womenwhocode.com/blog/the-end-of-an-era-women-who-code-closing/ | ✅ | 2024-04-18 |
| 51 | BBC：WWC 關閉 | https://www.bbc.com/news/articles/cw0769446nyo | 🟡 | 2024-04-19 |
| 52 | WWC「關於」頁（TechFutures 接手） | https://womenwhocode.com/about/ | 🟡 | 讀取 2026-10 |
| 53 | Write of Passage 最後一期公告 | https://writeofpassage.com/blog/final-cohort | ✅ | 2024-08-19 |
| 54 | Gagan Biyani LinkedIn（cohort 課關閉） | https://www.linkedin.com/posts/gaganbiyani_social-headlines-make-it-seem-cohort-based-activity-7257405331700432896-2RXW | 🟡 | 2024-10-30 |
| 55 | Lisa Kostova LinkedIn（cohort 課 10 個難處） | https://www.linkedin.com/posts/lisakostova_david-perell-just-closed-his-cohort-based-course-activity-7231731779433365505-g6sg | 🟡 | 2024-08-20 |
| 56 | Exercism 2024-09 改組文 | https://exercism.org/blog/september-2024-restructure | ✅ | 2024-09-05 |
| 57 | Exercism 影響力頁 | https://exercism.org/about/impact | 🟡 | 讀取 2026-10 |
| 58 | Exercism 捐款頁 | https://exercism.org/donate | 🟡 | 讀取 2026-10 |
| 59 | freeCodeCamp 捐款說明 | https://www.freecodecamp.org/news/how-to-donate-to-free-code-camp/ | 🟡 | 2025-03-19 |
| 60 | freeCodeCamp 2025 貢獻者 | https://www.freecodecamp.org/news/freecodecamp-top-open-source-contributors-2025/ | 🟡 | 2025-11-25 |
| 61 | Quincy Larson 訪談 | https://lijie2000.substack.com/p/an-interview-with-quincy-larson-from | 🟡 | 2025-12-05 |
| 62 | Hack Club 2025 年報 | https://user-cdn.hackclub-assets.com/019ff180-b929-7834-ad99-e263bcdd9a1d/2025%20Hack%20Club%20Annual%20Report.pdf | 🟡 | 2025 年度 |
| 63 | Hack Club 2024 年 990 表 | https://user-cdn.hackclub-assets.com/019c4366-66a7-7b57-8103-5d7731c114d3/812908499_2024_202533219349309698_990.pdf | 🟡 | 2024 年度 |
| 64 | Hack Club fiscal sponsorship 頁 | https://v3.hackclub.com/fiscal-sponsorship/ | 🟡 | 未標日期 |
| 65 | P2PU 併入 DPL Foundation | https://info.p2pu.org/2025/05/08/p2pu-is-joining-forces-with-the-dpl-foundation/ | ✅ | 2025-05-08 |
| 66 | P2PU 策略檢討 | https://info.p2pu.org/2024/05/13/taking-a-fresh-look-at-our-strategy/ | 🟡 | 2024-05-13 |
| 67 | P2PU 電子報 2024-10 | https://info.p2pu.org/2024/10/31/p2pu-newsletter-october-2024/ | 🟡 | 2024-10-31 |
| 68 | P2PU Teams 頁 | https://www.p2pu.org/en/teams/ | 🟡 | 未標日期 |
| 69 | P2PU IMLS 三年回顧 | https://info.p2pu.org/2020/07/29/celebrating-three-years-of-community-based-online-learning-with-imls/ | 🟡 | 2020-07-29 |
| 70 | AACE 訪談 P2PU | https://aace.org/review/peer-to-peer-learning-with-open-educational-resources-an-interview-with-p2pu/ | 🟡 | 2018-06-16 |
| 71 | P2PU handbook | https://github.com/p2pu/handbook | 🟡 | 2021 |
| 72 | Recurse Center FAQ | https://www.recurse.com/faq | 🟡 | 未標日期 |
| 73 | Recurse Center 招聘頁 | https://www.recurse.com/hire | 🟡 | 未標日期 |
| 74 | Recurse Center about-us | https://www.recurse.com/about-us | 🟡 | 未標日期 |
| 75 | Understanding AI（引述 RC CEO） | https://www.understandingai.org/p/new-evidence-strongly-suggest-ai | 🟡 | 2025-08-28 |
| 76 | RC CEO LinkedIn（2025 轉盈） | https://www.linkedin.com/posts/nicholasbs_2025-was-a-big-change-for-our-recruiting-activity-7414675548016283648-BQnA | 🟡 | 2026-01-07 |
| 77 | RC 部落格〈You can build something great〉 | https://www.recurse.com/blog/190-you-can-build-something-great | 🟡 | 2024-07-31 |
| 78 | 自由財經：Hahow | https://ec.ltn.com.tw/article/breakingnews/4745871 | 🟡 | 2024-07-23 |
| 79 | 鉅亨網：Hahow | https://news.cnyes.com/news/id/5648374 | 🟡 | 2024-07-23 |
| 80 | 經濟日報：Hahow 2025Q1 | https://money.udn.com/money/story/5612/8828346 | 🟡 | 2025-06-24 |
| 81 | 經貿透視：Hahow | https://www.trademag.org.tw/page/itemsd/?id=7911559&no=21 | 🟡 | 2024-11-27 |
| 82 | Duolingo Q3 2025 股東信 | https://investgame.net/wp-content/uploads/2025/11/Q3FY25-Duolingo-9-30-25-Shareholder-Letter-Final.pdf | 🟡 | 2025-11 |
| 83 | Duolingo 2025 年報（SEC） | https://www.sec.gov/Archives/edgar/data/1562088/000162828026025737/duolingodecember312025an.htm | 🟡 | 2025-12-31 資料 |
| 84 | Duolingo 論壇關閉 FAQ | https://duolingo.fandom.com/wiki/Forum_Announcement_%2B_FAQ | 🟡（二手 wiki） | 2022-03 |
| 85 | Duolingo Activity Stream 公告存檔 | https://archive.ph/yYpj7 | 🟡 | 2017-04-18 |
| 86 | Duolingo 2025 產品回顧 | https://blog.duolingo.com/product-highlights/ | 🟡 | 2025-12-10 |
| 87 | Reforge 轉型訪談 | https://promptledproduct.substack.com/p/how-reforge-transformed-from-education | 🟡 | 2026-01-29 |
| 88 | Marc Baselga LinkedIn（Reforge） | https://www.linkedin.com/posts/marcbaselga_brian-balfour-took-reforge-from-an-education-activity-7396572101031297024-7QT8 | 🟡 | 2025-11-18 |
| 89 | The Odin Project support 頁 | https://www.theodinproject.com/support_us | 🟡 | 未標日期 |
| 90 | The Odin Project about 頁 | https://www.theodinproject.com/about | 🟡 | 未標日期 |
| 91 | CFPB BloomTech 處分 | https://www.consumerfinance.gov/archive/newsroom/cfpb-takes-action-against-coding-boot-camp-bloomtech-and-ceo-austen-allred-for-deceiving-students-and-hiding-loan-costs/ | 🟡 | 2024-04-17 |
| 92 | CMX 2025 Community Industry Report | https://wudo.io/wp-content/uploads/2025/09/2025-CMX-Community-Industry-Report-1.pdf | 🟡（讀了前段） | 2025 |
| 93 | Circle 2025 Community Trends Report | https://9306053.fs1.hubspotusercontent-na1.net/hubfs/9306053/The%202025%20Community%20Trends%20Report,%20by%20Circle.pdf | 🟡（廠商報告） | 2025 |
| 94 | Skool 社群貼文（流失率說法） | https://www.skool.com/theskoolhub/is-it-possible-to-get-wealthy-on-skool | 🟡（低品質） | 2025-09-30 |
| 95 | startuptrio（付費社群經濟） | https://startuptrio.com/articles/economics-of-paid-communities-churn-moderation-margins/ | 🟡（低品質） | 2024-07-02 |
| 96 | Tidelift 2024 維護者調查摘要 | https://assets-eu-01.kc-usercontent.com/ef593040-b591-0198-9506-ed88b30bc023/23071823-ff61-4de9-87ca-e8a67c533c56/survey-one-pager-24-.pdf | 🟡 | 2024 |

**時效檢查**：96 筆來源中，2024 年以後發布或讀取的現行頁約 70 筆，超過一半。2024 年以前的來源主要用在歷史背景（島島 2020–2022 年、P2PU 早期、On Deck 2022 年）。

**🔴 讀不到**：無。Naver Premium 的 Trevari 文章有付費牆，只讀到前段，但同一組財務數字已經在 brunch 轉載的創業資料庫讀過全文，所以沒有再換工具。
