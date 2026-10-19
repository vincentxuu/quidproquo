# 研究筆記：攀岩圈與產業（M 模組）

日期：2026-10-18｜用途：`.work/series-plans/climbing-community-industry.md` 的來源
範圍：找繩伴與岩館文化、教練證照（岩館／單段，不含 IFMGA 嚮導）、兒童與適應性攀岩、岩館經營（商業模式、安全管理、保險、切結書）、定線員職涯。
方法：3 個平行研究 agent，約 180 份來源（附錄 A–C 為原始筆記，含來源表、讀取程度 ✅／🟡／🔴、衝突、台灣用語）。本節是彙整與主筆補查。

## toolDegradation

Groundlane MCP 未連線、直接 HTTP 回 401；jina 429、firecrawl／linkup 斷線。搜尋改用 Keenable keyless，頁面用 curl＋pdftotext、r.jina.ai、Exa 讀取。主筆補查（全國法規資料庫、北市法規）用 curl 直抓。

## 主筆補查（關閉附錄 A Open question 5）

- ✅ **國民體育法 44-1、44-2 沒有立法。** 全國法規資料庫 `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=H0120001`（最新修正 民國 115 年 07 月 15 日）第 44 條只管「公共運動設施」，授權中央訂設置、安全、人員、保險辦法；全文沒有 44-1、44-2。2019 年擬納管民營場館的草案沒有成為條文。
- 🟡 **公共意外責任險的法源在地方。** 臺北市以《臺北市消費場所強制投保公共意外責任保險實施辦法》（依臺北市消費者保護自治條例訂定，109-09-22 修正）規定附表所列消費場所強制投保。產險公會〈現有法規強制業者應投保公共意外險最低投保金額一覽表〉（115.08 版，https://www.nlia.org.tw/wp-content/uploads/doc/casualty01/%E7%8F%BE%E6%9C%89%E6%B3%95%E8%A6%8F%E5%BC%B7%E5%88%B6%E6%A5%AD%E8%80%85%E6%87%89%E6%8A%95%E4%BF%9D%E5%85%AC%E5%85%B1%E6%84%8F%E5%A4%96%E9%9A%AA-115.08.pdf）列北市最低保額：每人身體傷亡 600 萬、每事故 3,000 萬、財損 300 萬、總額 6,600 萬（摘要層級）。**攀岩館是否在北市附表內未逐行核對**，寫文前要打開附表確認；其他縣市各自訂。

## 跨主題重點（寫文會用到的事實）

### 找繩伴與岩館文化（附錄 C）
- 認識繩伴的管道：Climbing.com 讀者投票 86% 是當面認識（非科學調查）；Mountain Project Partner Finder 約 3.8 萬人登錄；BMC 2023 調查近半數說有固定繩伴會爬更多。台灣：岩館團練、LINE 群、大學登山社／攀岩社、Facebook 社團（登入牆，未讀）。
- 安全：DAV 2012 觀察研究，先鋒確保平均每次 1.4 個錯誤、上攀 0.7 個；DAV 2025 年 31 起繩索落地事故中 15 起發生在下放；自動確保器 5 起全是沒扣上。DAV MUSS／SOLL／KANN 三級「什麼時候該開口提醒別人」。
- 平權社群：Flash Foxy（2014）、Brown Girls Climb（2016 秋）、Black Girls Boulder（2020）；台灣小岩館 2022-04 自稱首屆女性攀岩節。
- 岩館史：Leeds 1964、可拆岩點 1983、Terres Neuves 1987-05、Vertical Club 1987-10；台灣蘭州街 1997 山協改建 → 2012-04-27 熄燈；原岩 2015-08（楊梅，原名頂呱呱）。

### 教練證照（附錄 B）
- AMGA CWI 2.5 天、18+、分上攀／先鋒兩種範圍，約 US$450–550；AMGA SPI 課 27 小時＋考 16 小時。PCIA 另有同名 SPI（不同機構）。
- USA Climbing L1／L2 是賽事教練通行證（SafeSport＋背景調查），不是教學課。
- UK Mountain Training：Indoor Climbing Assistant → CWI → CWDI → RCI → RCDI；教練線 Foundation → Development → Performance Coach。
- 台灣：中華民國山岳協會 C 級運動攀登教練講習（有效 CBT、20 歲以上、良民證、3 天、會員 NT$4,000／非會員 4,500，2024 與 2026 相同）；中華民國攀登協會 C 級休閒攀登教練 NT$6,000。教練證法規只按賽事角色定 C／B／A，**找不到「在商業岩館教課必須持證」的法規**（⚪，權威答案需問運動部全民運動署）。2026-09-03 行政院通過國民運動法草案，新增教練章與「適應運動」章（草案）。
- 薪資：104 人力銀行 2026-01 職缺，全職岩館教練月薪 NT$32,000–40,000，兒童課時薪 NT$300–600。
- 體育署已改制運動部（文中用語要更新）。

### 兒童與適應性攀岩（附錄 B）
- 原岩兒童課分 4–6、7–12 歲；全身式吊帶與 EN 12277 分型；IFSC 青年分組。
- 青少年手指生長板壓力性骨折：2025 前瞻研究占 18 歲以下傷害 45.3%（高峰 13–15 歲），另三篇早期研究；不同研究計數方式不同，數字不可直接比。
- 適應性攀岩：Paradox Sports 2 天岩館訓練、Adaptive Climbing Group（2012）、英國 Climbing for All 課程；IFSC 帕拉分級 B／AL／AU／RP，上攀賽；LA28 首度入奧，8 面金牌。台灣只有零星視障體驗活動，全國賽沒有帕拉組。

### 定線員（附錄 A）
- 認證：USA Climbing 賽事定線 L1–L5（2025-09 PDF）；CWA 商業定線認證 PRS（2024 推出）；英國 ABC 定線課（RSD）2025 重啟；World Climbing（IFSC）2023–24 改 Level 1–4、由國家協會提名；加拿大、日本 JMSCA（一般 → C／B／A）。
- 台灣：山協 2021 C 級定線員講習，報名門檻 RP 5.12b／V4、4 天、NT$6,000，發「C 級運動攀登裁判（定線）證書」；臺北市運動局檢核表要求岩館定線員持 C 級以上、4 年內有效證照。A／B 級規則未公開（⚪）。
- 收入與工作：NLRB 2026-02 裁決文件中 Touchstone 定線員時薪 US$28；CBJ 2026 薪資調查，助理定線員滿意度 3.47/5，非管理職最低；Lajoie 調查 78.5% 定線員曾在工作中受傷；Movement、Touchstone 工會，美國首次定線員罷工 2025-03-24。台灣定線員薪資無公開資料（⚪）。

### 岩館經營、安全、保險（附錄 A＋主筆補查）
- 產業：CBJ 2025 北美新開 53 間、淨成長 4.7%；美國新館 73% 是抱石館；連鎖 Movement 34、Central Rock Gym 29、Touchstone 18（2026-02）。營收占比說法衝突（會員 ≥50% vs 70–85%）。
- 標準：EN 12572（人工岩牆）；CWA 檢查週期；**ASTM F2376 是滑水道標準，不是岩館標準**（某創業指南網站寫錯，寫文時不要沿用）。
- 美國：Vertical World 自動確保器和解 US$600 萬；奧勒岡 SB 1517（2026）恢復切結書效力。
- 台灣：消保法 §10-1 使切結書不能免除業者責任；內湖自動確保器死亡案一審判賠 105 萬、二審再加 37.5 萬；2019 行政院消保處稽查 20 家攀岩／彈翻床館，設施安全 18 家不合格、12 家要簽免責切結、4 家未投保或保額不足；2023 新北 6 家全不合格。

## 衝突（並列不裁決；細節見附錄）

1. USA Climbing 定線 L1／L2 試爬門檻：2025-09 PDF（V5；V6／5.12+）vs Clinics 頁（V4＋5.12；V7＋5.13）。
2. CWA PRS L2 Boulder 建議時數：150（PDF）vs 200（Dashboard）。
3. 美國／北美岩館總數：>695、>700、>800、>900，範圍與年份不同。
4. 岩館營收中會員占比：≥50% vs 70–85%。
5. 蘭州街開始商業營運：1999 vs 2004；台灣「第一間室內岩場」Y17 vs 蘭州街。
6. 台灣岩館數：約 30 多間（2021，含運動中心）vs 62 座（運動部登記，日期不明）。
7. DAV 歷年事故收錄門檻不同，年份不能直接比。
8. 青少年手指傷害：生長板骨折 vs PPSI，計數範圍不同。

## 台灣用語（彙整）

繩伴／確保伙伴、揪團、團練、確保證／安檢卡、CBT（攀登確保能力檢測）、定線員、定線、換線、試爬（forerun）、洗岩點、C 級運動攀登教練、休閒攀登教練、公共意外責任險、安全守則與個人責任聲明（原岩的切結書名稱）、自動確保器、全身式吊帶、適應運動（國民運動法草案用語）、視障攀岩、帕拉攀岩（para climbing）。

## 未結案（只列 ⚪ 與 ✉️）

- ⚪ 台灣定線員、教練以外職位薪資；台灣官方岩館總數；原岩營收；山協 A／B 級定線員規則；Y17 啟用年份；台灣與 CWA 的事故統計。
- ⚪ 在商業岩館教課是否必須持證：未找到法規。✉️ 運動部全民運動署。
- ✉️ PCIA 岩館認證天數與費用（PCIA）。
- 🟡 北市公共意外責任險附表是否列攀岩館：寫第 5 篇前打開附表確認。
- 🔴 Facebook 台灣攀岩社團（登入牆）；AAC 2019 報告原文（只有轉引：4.4% 美國人室內攀岩、室內攀岩者約半數女性）。

---

# 附錄：A-setting-business
## A｜定線員職涯 × 岩館經營 研究筆記

研究日：2026-10-18｜研究者：subagent A｜原始抓取存於同目錄 `raw/`（每個來源一檔，檔名見表格 `raw` 欄）

### toolDegradation

| 層級 | 結果 |
|---|---|
| (1) Groundlane MCP `mcp__claude_ai_Groundlane__web_search` | ToolSearch 載入成功，呼叫回 `MCP server "claude.ai Groundlane" is not connected`（4 次皆同） |
| (2) Groundlane 直接 HTTP（POST `groundlane.vincent-xu-work.workers.dev/mcp`，curl 與 Python 皆試） | HTTP 401 Unauthorized（Python 預設 UA 時為 403） |
| (3) Keenable keyless | ✅ 可用，全部搜尋都走這層 |
| 抓頁 | Keenable 無 fetch → 直接 `curl` 原站 + BeautifulSoup／`pdftotext` 擷取全文；原站 403/404 或內容過短時退到 jina reader（`r.jina.ai`，第 5 層）。jina 對並行請求會回 429，改序列重試。linkup MCP 本 session 連線失敗（404 server not found），未使用。 |

---

### Sources table

讀取等級：✅ 全文讀過｜🟡 只讀到摘要層級／付費牆前段／圖表無法擷取｜🔴 未讀（附原因）

#### 定線員：認證與職涯

| # | URL | 等級 | raw | 內容 |
|---|---|---|---|---|
| S1 | https://usaclimbing.org/wp-content/uploads/2025/11/Path-of-a-Routesetter-9.2025.pdf | ✅ | usac-path25 | USAC 定線 L1–L5 晉升條件（2025-09 版）：各級試爬（forerun）門檻、實習次數、L5＝國家級主定線、可被提名 IFSC |
| S2 | https://usaclimbing.org/community/routesetters/routesetting-clinics/ | ✅ | usac-clinics | L1 研習 $500、L2 $1000、年費 $100；最低 16 歲；L1 要求「6 個月職業定線經驗＋能爬 V4 與 5.12」；明講此研習為競賽定線，不是商業定線 |
| S3 | https://usaclimbing.org/community/routesetters/routesetting-competitions | ✅ | usac-comp | 2027 國家隊定線員申請（截止 2026-11-01）；實習（intern）需 L2、學徒（apprentice）需 L3、助理需 L4；IFSC 世界盃交換至少 L4；分區賽實習無薪 |
| S4 | https://usaclimbing.org/Officials/Routesetters/Certification.htm | 🟡 | usac-cert | 舊網址直連回 404；內容只從搜尋摘要看到（維持認證需 USAC 會籍＋SafeSport，主定線需背景調查）。以 S1–S3 為準 |
| S5 | https://assets.noviams.com/novi-file-uploads/cwa/pdfs-and-documents/Certifications/PRS_Certification_Standards-d0cec824.pdf | ✅ | cwa-prs | CWA 商業定線認證 PRS 標準（2024-04）：Intro → L1 → L2 Boulder/Ropes → L3 → Provider；年齡、攀爬能力、時數門檻；三年到期 |
| S6 | https://cwapro.org/certification-dashboard | ✅ | cwa-dash | CWA 三條認證線：CWI（教練）、WAH（高處作業）、PRS（定線，2024-08 更新）；Direct Entry 管道 |
| S7 | https://climbingbusinessjournal.com/routesetting-trends-2025 | 🟡 | cbj-rst2025 | CBJ 2025 定線趨勢調查（>300 名定線員，57% 北美、35% 歐洲）；PRS 上線被列為專業化大事；正文其餘在付費牆後 |
| S8 | https://abcwalls.co.uk/2025/10/09 | ✅ | abc-oct2025 | 英國 ABC 的 Route Setting Development（RSD）新路徑第一年：Setting Basics（1 天）→ Setting in Practice（1 天）→ Commercial Roped Setter（2 天） |
| S9 | https://abcwalls.co.uk/events/event/rsd-boulder-setter | ✅ | abc-boulder | 舊制 RSD Level 1 Boulder Setter 一日課（2023）內容：兒童定線、上點、梯子、高處作業法規、生產力 |
| S10 | https://worldclimbing.com/development/dev-officials | ✅ | wc-devoff | World Climbing（前 IFSC）2023-10 修訂技術官員教育路徑：Levels 1–4、獨立評估小組（定線員偶數年評）、多元交換計畫（2026 年 >20 名額） |
| S11 | https://epsets.substack.com/p/an-interview-with-ifsc-routesetter | ✅ | ifsc-sewell | IFSC 定線員 Ryan Sewell 專訪（2025-07）：IFSC 四級制（L1 國家推薦／L2 洲際／L3 國際／L4 世界盃主定線）、國家協會提名機制、Movement 全職 |
| S12 | https://boulderhalle-e4.de/nothing-but-problems-with-dirk | ✅ | e4dirk | 德國 Dirk Uhlig 2021 取得 IFSC 國際主定線員；2006 國家執照、2015 首場世界盃；世界盃巔峰日工時 21 小時；岩館每色約 60 條抱石、每週換線 |
| S13 | https://climbingcanada.ca/routesetting | ✅ | cec | 加拿大 CEC 國家定線路徑，對齊「2024 年 IFSC 新分級制」；主定線（HRS）／助理主定線（AHRS）／定線員角色定義 |
| S14 | https://climbingcanada.ca/wp-content/uploads/2024/07/CEC-National-Routesetting-Pathway-Phase-2.pdf | ✅ | cec-ph2 | CEC 2025–26 L1 Apprentice → L2 → L3 Leader（IFSC Level 2+ 可直接算） |
| S15 | https://www.climbers-web.jp/feature/article-81/ | ✅ | climbers-jp | 日本 JMSCA 定線資格：無資格＝可在商業岩館定線；一般→C→B→A；IFSC 國際定線員當時日本 6 人（2020-03 刊物） |
| S16 | https://www.jma-sangaku.or.jp/sports/sc_info/r7_c_routesetter/ | ✅ | jmsca-c | 2025 年 C 級定線檢定會：都道府県級主定線能力檢定、12/22–23、¥44,000 |
| S17 | https://www.jma-sangaku.or.jp/sports/sc_info/r7fy_1st_seminar_of_route_setter/ | ✅ | jmsca-kosyu | 公認定線員講習：需能判讀 5.12 或抱石 3 級；公認資格是報考 C 級的前提（自 2024 年度起） |
| S18 | https://itsrcowebs.com/Files/archives/article/100015/1705b29d...C級定線員講習簡章-3.pdf | ✅ | ctma-c110 | 中華民國山岳協會 110 年度（2021）運動攀登 C 級定線員講習簡章：資格、費用、4 天課表、核發「C 級運動攀登裁判(定線)證書」 |
| S19 | https://itsrcowebs.com/Files/archives/article/100015/ca082412...運動攀登部組織簡則-20180902.pdf | ✅ | ctma-rules | 山協運動攀登部簡則（2018 修正）：負責制定裁判、定線員、教練審核辦法與講習 |
| S20 | https://500times.udn.com/wtimes/story/12671/5886300 | ✅ | udn-marco | 台灣定線員劉翰杰（Marco）專訪：自由教練＋定線員，團隊固定在桃園爬森攀岩館定線；定線理念「安全又帶冒險感」 |

#### 定線員：收入、身體負擔、工會

| # | URL | 等級 | raw | 內容 |
|---|---|---|---|---|
| S21 | https://climbingbusinessjournal.com/compensation-dashboard-2026 | 🟡 | cbj-compdash | CBJ 薪酬儀表板：兩輪調查（2024 末、2026）共 1,590 份、38 國；數據在付費牆後 |
| S22 | https://vertigemedia.fr/en/working-in-climbing-pay-wages-us-gyms | ✅ | vertige-pay | 解讀 CBJ 2026 薪酬調查：助理定線員工作滿意度 3.47/5，非管理職最低；PTO 平均 116 小時；兼職 74% 無 PTO；性別薪資差 |
| S23 | https://onthelaborfront.com/chalk-up-the-vote-nlrb-orders-separate-union-elections-for-touchstone-climbing | ✅ | labor-ts | NLRB 2026-02-17 裁決 Touchstone 灣區 21 名定線員可單獨組工會；裁決書載各職位時薪：定線員 $28、維修 $30、櫃台 $22 |
| S24 | https://climbingbusinessjournal.com/touchstone-workers-united-calls-first-routesetter-ulp-strike-in-america | ✅ | cbj-tsstrike | 2025-03-24 美國首次定線員 ULP 罷工（Touchstone 南加州）；工會方新聞稿（CBJ 註明為贊助方撰寫） |
| S25 | https://kqed.org/news/2025/09/10/workers-at-4-popular-bay-area-rock-climbing-gyms-win-unionization-vote | 🟡 | kqed-ts | 灣區 4 家 Touchstone 2025-09 投票成立工會；頁面雜訊多，只讀到要點 |
| S26 | https://en.wikipedia.org/wiki/Movement_(company) | ✅ | wiki-movement | Movement 由多個連鎖併購而成、2021 統一品牌、2023 再併兩家、32 個據點；Crystal City 2022 年成為美國第一家經 NLRB 認證的工會岩館；2026 年 9 個據點已組工會但仍無合約 |
| S27 | https://nlrb.gov/case/20-RC-379307 | ✅ | nlrb-mv1 | Movement Holdings 案：2026-01-20 申請、28 名合格選民、12 票贊成 2 票反對 |
| S28 | https://theclimbingdoctor.com/work-injuries-amongst-routesetters-and-occupational-hazards | ✅ | cd-lajoie | 物理治療師 Evelyne Lajoie 的定線員傷害問卷摘要：78.5% 工作中受過傷、71% 有慢性工作相關疾患、約 40% 工時在試爬 |
| S29 | https://vortexroutesetting.com/s/Routesetting-Industry-Data_-CWA22-Presentation.pdf | 🟡 | vortex-cwa22 / vortex2 | CWA Summit 2022 簡報：近 100 間岩館、22 州的定線部門數據；圖表是圖片，數字擷取不到，只確認到「疫情後離職率有時達 50–60%」一句 |
| S30 | https://climbingbusinessjournal.com/job/...（搜尋摘要多筆） | 🟡 | s2.txt | CBJ 職缺時薪範例：兼職定線員 $16–22、$22–27；資深 $24–28；主定線年薪 $40k–49k（Inner Peaks）、$65k–75k（G1 Colorado）。只看了搜尋摘要，未逐頁打開 |
| S31 | https://blog.104.com.tw/104data-rock-climbing-recruit-salary/ | ✅ | job104 | 104 人力銀行（2026 年 Honnold 101 事件後）：約 1,200 個「攀岩」相關職缺；岩館教練月薪 3.2–4 萬、兒童攀岩教師時薪 300–600；職缺內容含「館內定線」 |

#### 岩館經營、產業數據、整併

| # | URL | 等級 | raw | 內容 |
|---|---|---|---|---|
| B1 | https://climbingbusinessjournal.com/gyms-and-trends-2025 | 🟡 | cbj2025 | CBJ Gyms & Trends 2025：北美 2025 年新開 53 家、永久關閉 12 家、淨增 41、淨成長率 4.7%、新館岩壁面積 356,314 平方英尺；調查 240 家。後段在付費牆後 |
| B2 | https://climbingbusinessjournal.com/cbjs-renowned-gyms-and-trends-report-examines-the-highs-and-lows-of-the-climbing-gym-industry-in-2025 | ✅ | cbj-pr2025 | 報告目錄（含 Rock Gym Pro 的平均進場數／會員數據、青少年課程、首個 Optimism Index） |
| B3 | https://recmanagement.com/articles/155661/... | ✅ | recmgmt | 73% 業者回報經濟狀況變差；61% 預期 2026 營收改善 |
| B4 | https://climbingbusinessjournal.com/6-ways-climbing-gyms-are-adapting-to-economic-downturns | ✅ | cbj-6ways | 約 85% 業者說 2025 總支出比 2024 高；71% 消費力變差；69% 營收持平或下滑；美國岩館過去多數年份每年成長 5–10% |
| B5 | https://climbingbusinessjournal.com/2025-cbj-gym-list-awards | ✅ | cbj-gla2025 | 北美岩館總數「超過 900」；2025 最大新館 High Point Orlando（35,000 平方英尺岩壁）；年度開發商 The Gravity Vault（加盟＋直營） |
| B6 | https://climbingbusinessjournal.com/largest-climbing-gym-developers-in-america | ✅ | cbj-devs | 美國最大岩館開發商（2026-02-27 更新）：Movement 34、Central Rock Gym 29、Touchstone 18、The Gravity Vault 16、Bouldering Project 13 |
| B7 | https://climbingbusinessjournal.com/largest-bouldering-gyms-in-america/ | ✅ | cbj-boulder | 美國約 270 家抱石館，95% 是近 15 年開的；2024、2025 年美國新館 73% 是抱石館（歷史新高） |
| B8 | https://climbingbusinessjournal.com/biggest-climbing-gyms-in-the-us-official-list | ✅ | cbj-largest | 「美國商業岩館超過 695 家」（頁面未標撰寫日期） |
| B9 | https://climbingbusinessjournal.com/midwest-based-vertical-endeavors-changes-hands | ✅ | cbj-ve | Vertical Endeavors（6 館）易主；1992 年開館時美國不到 30 家商業岩館，撰文時超過 700 家 |
| B10 | https://verlinvest.com/insights/our-investment-in-boulders | ✅ | verlinvest | 2025-09-15 Verlinvest 取得丹麥 Boulders 多數股權，連同英國 The Climbing Hangar 共 21 館；Boulders 每月 >6 萬人次、每週換線 |
| B11 | https://riseaboveconsultancy.com/post/the-climbing-gym-business-model-a-practical-guide | ✅ | riseabove | 顧問業者文章：會員常占營收 ≥50%、日票 20–25%；保險預算約營收 2–3%；成熟館淨利率 10–20%、2–3 年損益兩平；開館成本常在 $1M 以上。顧問行銷文，非調查資料 |
| B12 | https://worldclimbing.com/news/gyms-trends-2025-offers-data-driven-snapshot-of-climbing-industry | ✅ | wc-gt2025 | World Climbing 轉述 CBJ 報告（第 13 版） |

#### 安全標準、保險、免責

| # | URL | 等級 | raw | 內容 |
|---|---|---|---|---|
| R1 | https://cwapro.org/file/secure/cwainspectionspecfinal2022.pdf | ✅ | cwa-insp | CWA 人工岩壁結構檢查規範（2022）：檢查員資格、頻率（製造商無指引時室內 ≤48 個月、戶外 ≤24 個月） |
| R2 | https://pyramide.eu/en/standards-information/specific-standards | ✅ | pyramide | 法國岩壁商整理 EN 12572-1/-2/-3 重點數值（墜落負載、抱石墊尺寸、岩點 12 kN 拉力測試等） |
| R3 | https://standards.iteh.ai/catalog/standards/cen/8cdf0427-.../en-12572-1-2017 | 🟡 | en12572-iteh | EN 12572-1:2017 目錄頁：範圍、標示要求（須標示下次主檢查日期）；標準全文需付費 |
| R4 | https://standards.iteh.ai/catalog/standards/sist/9cea43a2-.../osist-pren-12572-1-2025 | 🔴 | pren2025 | 直連與 jina 都失敗（jina 429）；只知道搜尋摘要寫有 prEN 12572-1:2025 修訂草案 |
| R5 | https://www.cwapro.org/file/secure/cwaindustrypractices3rdmaster2018.pdf | 🔴 | cwa-ip2018 | 404（CWA 會員限定／已移除）。CWA Industry Practices 第 3 版（2018）的存在由 cwapro.org/aore 頁面摘要得知 |
| R6 | https://climbingbusinessjournal.com/cwa-releases-draft-work-at-height-standard | 🟡 | cwa-wah-draft | CWA 高處作業標準草案發布新聞；只讀到前段 |
| R7 | https://climbing.com/news/gym-and-auto-belay-manufacturer-to-pay-6m-in-settlement-for-auto-belay-accident | ✅ | autobelay6m | 2019-08-01 西雅圖 Vertical World 自動確保器墜落 30 英尺案：C3 付 $5M、岩館付 $1M；雙方說法衝突；Perfect Descent 2016 年起多次召回 |
| R8 | https://cwapro.org/blog/a-win-for-climbing-gyms-in-oregon | ✅ | oregon | 奧勒岡 SB 1517（2026 年初簽署）恢復免責同意書效力；不可免除的責任類型清單；CWA Industry Practices 要求所有岩館使用參與者協議 |
| R9 | https://caselaw.findlaw.com/court/ak-supreme-court/1674514.html | 🟡 | donahue | Donahue v. Ledgends（阿拉斯加最高法院 2014）抱石墜落斷脛骨、免責同意書成立；只讀了判決摘要與開頭 |
| R10 | https://www.astm.org/f2376-17.html | ✅ | astm2376 | ASTM F2376 實際上是**水滑梯**標準，用來核對 B13 的說法 |
| R11 | https://startpermit.com/blog/how-to-start-a-rock-climbing-gym | 🟡 | startpermit | SEO 網站宣稱「CWA 標準與 ASTM F2376 定義業界注意義務」——經 R10 查證，F2376 與岩館無關。不採用 |

#### 台灣（含中國對照）

| # | URL | 等級 | raw | 內容 |
|---|---|---|---|---|
| T1 | https://industry.sports.gov.taipei/announcement/?K=286 | ✅ | tpe-notice | 臺北市體育局公告：轄管場館檢查表增列「攀岩館、抱石館」12 項安全規範（駐場人員須有教練證＋急救證、AED、禁免責條款、維護紀錄留存 5 年、UIAA/CE 裝備、**教練／裁判／定線員須有 C 級或丙級以上證照且在 4 年效期內**、抱石墊 30–50 cm 等）。頁面未顯示發布日期；引用「運動部」手冊，推測為 2025-09 之後 |
| T2 | https://www.ntpc.gov.tw/ch/home.jsp?id=e8ca970cde5c00e1&dataserno=e47c5c455d0250e61868788488bf5d1a | ✅ | ntpc-audit | 新北市 112 年（2023）4 月聯合稽查 6 家室內攀岩館，100% 不合格（4 家有免責條款違反消保法 §10-1、3 家消防不符、3 家未完成建物公安申報、3 家軟墊區缺警語） |
| T3 | https://www.anntw.com/articles/20190917-sT5Z | ✅ | anntw2019 | 2019 行政院消保處稽查 20 家攀岩館＋彈翻床館：設施安全管理 18 家不合格、12 家要求簽免責切結書、4 家未投保或投保不足公共意外責任險；體育署擬修國民體育法 44-1、44-2 把民營場館納管 |
| T4 | https://news.pts.org.tw/article/663770 | ✅ | pts-neihu | 2020 內湖運動中心自動確保器忘扣墜落死亡案，士林地院判救國團等負 70% 責任、賠 105 萬 |
| T5 | https://tw.news.yahoo.com/疏未扣自動確保器安全扣環攀岩亡...（CNEWS） | ✅ | yahoo-neihu | 同案二審：高院改認死者自負 5%，救國團等須再連帶給付 37.5 萬（慰撫金 150 萬 × 95% ＝ 142.5 萬）；理由是消保法企業經營者責任、未派員或設警示 |
| T6 | https://tupclimbing.tw/ | ✅ | tup-home | 原岩攀岩館 2015-08 成立、6 間分店；課程含幼兒／兒童／青少年／確保課 |
| T7 | https://tupclimbing.tw/terms-and-conditions/78 | ✅ | tup-terms | 原岩中和店《安全守則與個人責任聲明》：首次入館須簽署、須教授抱石墜落與自動確保器使用；「本場地已辦理公共意外責任險，保險額度依照政府法令規定投保」 |
| T8 | https://woman.udn.com/woman/story/123162/9396580 | ✅ | udn-top10 | DailyView 聲量：2025-03-20～2026-03-19「攀岩、抱石」討論 180,826 筆，前一年 58,104 筆，成長 211.2% |
| T9 | https://aia.kcg.gov.tw/News_Content.aspx?n=B190CBEC6148FFF8&... | ✅ | kcg-manual | 體育署 2025-08-28 公布新版《運動設施規範及分級分類參考手冊》（42 項運動）；運動部 2025-09-09 成立 |
| T10 | https://vocus.cc/article/670405bbfd897800019ada90 | 🟡 | vocus-acc | 方格子評論文：台灣無攀岩場館專法、自動確保器無使用規範（2024 年文章，觀點文）；只讀到要點 |
| T11 | https://vocus.cc/article/670ddcabfd89780001b65821 | 🟡 | vocus-ab | 同作者：2020 年台灣第一起「忘記扣」自動確保器死亡案；觀點文 |
| T12 | https://cpc.ey.gov.tw/Page/2E6DC9A6807E8AEB/7b543458-... | 🟡 | cpc-ey | 行政院消保處「至攀岩館、彈翻床館…應注意事項」；抓到的只有選單，三點內容取自搜尋摘要（注意教練證照、注意有無公共意外責任險） |
| T13 | https://www.sport.gov.cn/n20001280/n20067608/n20067635/c29850312/content.html | ✅ | cn-gb | 中國對照：GB 19079.4—2025 攀岩場所強制性國標 2025-07-01 實施；截至 2025-09 中國（不含港澳台）經營性攀岩館 970 家；頂端保護 ≥8 kN、須投保公眾責任險 |
| T14 | https://www.sports-life.com.tw/catalog/jay-ri/ | 🟡 | （搜尋摘要） | 教練自介提到山協證照序列「CBT、先鋒證、頂繩確保證、C 級攀岩教練證」；只用來對照術語 |

#### 營運實務（換線週期、洗點、分級標示）

| # | URL | 等級 | raw | 內容 |
|---|---|---|---|---|
| O1 | https://petracliffs.com/routesetting | ✅ | petra | 路線留 2–3 個月、一次換一面牆；平板／比賽風格區每週或每兩週換；難度只對館內有效 |
| O2 | https://ascendclimbing.com/programs/climbing/routesetting | ✅ | ascend | 抱石、上攀各一週換兩次，依牆面分區順時針輪換 |
| O3 | https://goatclimbinggym.com/climbing | 🟡 | goat | 抓取為空；搜尋摘要：自動確保器 6 週、抱石區 5 週、上攀 3 個月 |
| O4 | https://climbsoill.com/routesetting/zone-setting | 🟡 | soill | 抓取只拿到 cookie 頁；搜尋摘要：由「每週依顏色換」改成「每兩週依區域換」 |
| O5 | https://tetonrockgym.com/routesetting | ✅ | teton | 區間分級（circuit grading）：用起步膠帶顏色代表重疊的難度區間（例：V2–4），岩點顏色可混用以節省岩點預算；源自楓丹白露 |
| O6 | https://rockcityclimbingholds.com/resources/hold-care-and-maintenance | ✅ | rockcity | 岩點廠商建議：主要抱石牆岩點每 1–2 週刷、每月洗；先乾刷、檸檬酸溶液、徹底沖淨、完全晾乾再上牆（濕點上牆會鏽蝕 T 型螺帽） |

---

### Findings by topic

#### 1. 定線怎麼運作（現場工作）

- **一輪換線的流程**：拆點（strip）→ 洗點 → 依顏色／尺寸分箱 → 上點（set）→ 試爬（forerun）修正 → 定級、貼標。CWA PRS 從 L2 起把「參與試爬」列為職責（S5）。Lajoie 問卷：定線員平均每週 2.5 天、每天 7.3 小時，**約 40% 工時在試爬**（S28）。
- **換線週期（各館公開例子，非產業統計）**：Ascend 抱石、上攀各一週兩次分區輪換（O2）；Petra Cliffs 路線留 2–3 個月、一次換一面牆，訓練性區塊每週到兩週換（O1）；GOAT 抱石區 5 週、上攀 3 個月（O3，🟡）；E4 每週換線、每色約 60 條（S12）；丹麥 Boulders 每週換（B10）；原岩官網寫「高頻率更換攀爬路線」（T6），LINE 旅遊文寫原岩「每兩周換點換線」（搜尋摘要，未打開）。
- **排程規劃**：CBJ 2025 定線趨勢調查有「路線密度與換線率」的分布（S7），數據在付費牆後 → 見 Open questions。
- **洗點**：岩點廠商建議主要牆每 1–2 週刷、每月洗；用檸檬酸、不要漂白水或溶劑；濕點上牆會讓 T 型螺帽生鏽、合板脫層（O6）。USAC／Movement 工會文件把「洗點員（Hold Washers）」和定線員列在同一職類（NLRB 20-RC-375680 搜尋摘要）。
- **分級與標示系統**：
  - 單一難度＋同色岩點（美國常見 V 級）。
  - 區間分級（circuit grading）：用起步膠帶顏色代表難度區間，區間互相重疊；岩點顏色可以混用，省下岩點預算（O5）。
  - 難度只代表館內一致（O1）。
- **競賽定線**：IFSC 世界盃每輪抱石有 5 題（資格賽）或 4 題（準決賽、決賽）；先鋒路線試爬可能只有 4–6 次（S11）。世界盃團隊通常 1 名主定線＋數名定線員＋數名見習（aspirant），共 6–8 人（S15，日本）。

#### 2. 認證體系

**美國 USA Climbing（競賽線，2025-09 版，S1）**

| 等級 | 取得方式 | 試爬門檻 | 可擔任 |
|---|---|---|---|
| L1 | 研習（先到先得）；6 個月定線經驗 | V5 | — |
| L2 | 研習（申請制）；L1＋協助 6 場 USAC 賽事 | V6、5.12+ | QE（地方資格賽）主定線 |
| L3 | 2 次分區賽實習且評價良好（另需當過 6 次 QE 主定線） | V7、5.13 | 國家賽學徒 |
| L4 | 3 次學徒 | V9、5.13+ | 國家賽助理、區域錦標賽主定線 |
| L5 | 10 場國家賽＋6 場區域／分區主定線（4 場在本區外）＋ 2 場國家錦標賽主定線實作 | V9、5.14 | 國家賽主定線、可被提名 IFSC |

費用：L1 $500、L2 $1000、USAC 定線員年費 $100；最低 16 歲（S2）。分區賽實習無薪，鼓勵主辦館提供住宿（S3）。

**美國 CWA PRS（商業岩館線，2024 年起，S5/S6）**：Intro（線上）→ L1（18 歲、V2、能搬 50 磅／25 kg、建議 50 小時）→ L2 Boulder（V4）→ L2 Ropes（5.10，須 WAH L1）→ L3 Boulder/Ropes（600 小時；可帶隊）→ Provider（21 歲、V4–V6／5.10–5.12、2,000 小時、急救證）。三年到期。CBJ 稱這是「北美第一個專為商業定線設計的認證」（S7）。

**英國 ABC RSD（S8/S9）**：2025 年起新路徑 Setting Basics（1 天，可在監督下定線／拆點）→ Setting in Practice（1 天，可獨立定抱石）→ Commercial Roped Setter（2 天，上攀定線）。舊制有 RSD Level 1 Boulder Setter；更早還有 Route Setting Association（RSA）分級課（搜尋摘要提到「RSA Level 2」）。

**World Climbing／IFSC（S10/S11/S12）**：2023-10 修訂官員教育路徑，Levels 1–4。Sewell 的說法是：L1 國家推薦定線員、L2 洲際、L3 國際（可擔任洲際賽主定線、參與世界盃）、L4 世界盃主定線（可定奧運）。建制當時由各國協會在 L1–L3 各提名 2 人（若有非男性可提名第 3 人），L4 不開放提名；審查看攀爬能力、國家與國際經驗、年齡。舊制是可以直接報名的 IFSC 定線課程，後來改成青年（junior）計畫，現在改成分級制。Gripped（搜尋摘要）寫舊制要求「先有國家定線資格，再做 5 場無薪世界盃實習」。

**加拿大 CEC（S13/S14）**：對齊 IFSC 2024 分級；L1 Apprentice → L2 → L3 Leader → L4，評估項目含定線、試爬、團隊合作、專業度。

**日本 JMSCA（S15–S17）**：商業岩館定線不需要資格。公認定線員（須能判讀 5.12 或抱石 3 級，可定國民體育大會縣預賽）→ C 級（都道府縣賽主定線；2025 年檢定費 ¥44,000）→ B 級（國體分區賽）→ A 級（BJC 等全國賽）。IFSC 國際資格要有推薦＋IFSC 定線委員會投票；2020 年日本有 6 人。

**台灣（S18/S19/T1）**：
- 主管單位是中華民國山岳協會運動攀登部，依「運動攀登定線員制度實施辦法」辦理，指導單位為教育部體育署（2021 年時）。
- 2021 年 C 級講習的報名資格：①山協 CBT 以上；②C 級裁判講習筆試 60 分以上（可一年內補）；③先鋒 RP 5.12b、抱石 V4 以上；④18 歲、高中職學歷。上限 20 人；報名費會員 6,000 元、非會員 7,000 元；4 天課程在台中 Dapro。課程含定線員職責、場地安全規範、先鋒／抱石／速度賽路線設計、難度規劃與控制、系統轉換、定線考核、學科測驗。合格者核發「C 級運動攀登裁判(定線)證書」。
- 臺北市體育局檢查表要求岩館的「攀登教練、裁判、定線員」須有 C 級或丙級以上證照、效期 4 年內（T1）。也就是說，台北的商業岩館定線員有行政上的證照要求，和日本「商業定線免資格」不同。
- 實施辦法全文、A／B 級條件：⚪ 見 Open questions。

#### 3. 收入、全職或自由接案、身體負擔、工會

- **美國時薪／年薪（單一來源，條件各異）**：
  - NLRB 裁決書（Touchstone 灣區，2026-02）：定線員約 $28/小時、維修 $30、櫃台 $22、安全人員 $19、教練 $20、瑜伽老師 $34（S23）。
  - CBJ 職缺（搜尋摘要，S30）：兼職定線員 $16–22、$22–27；資深 $24–28；助理主定線 $22–24（約 $45.7k–49.9k／年）；主定線 $40k–49k（北卡）、$65k–75k（科羅拉多）；兼職主定線 $20–25。
  - Glassdoor（搜尋摘要）：加州定線員中位數總薪 $60k/年（約 $29/小時）。
- **CBJ 2026 薪酬調查（S22 轉述）**：1,590 份回覆、38 國但以北美為主。助理定線員滿意度 3.47/5，是非管理職最低；美國南部經生活成本調整後的平均薪資 +27%、西部 +21%；全職員工約四分之一每週在主要任職岩館工作超過 40 小時；PTO 平均 116 小時／年；兼職 74%、全職 9% 完全沒有 PTO；女性年薪比男性低 11%、非二元性別低 23%（經生活成本調整）。
- **全職或自由接案**：USAC 研習明講不是商業定線課（S2）。日本刊物指出很多定線員兼做岩點製造、岩館經營或教練（S15）。台灣例子 Marco 是自由教練兼定線員（S20）。Sewell 是 Movement 全職員工，另外接 IFSC 賽事（S11）。World Climbing 交換計畫負擔交通與住宿，「可能有部分津貼」（S10）。
- **身體負擔（S28）**：78.5% 在工作中受過傷；61% 有外傷（墜落、器材、搬運）；71% 有慢性工作相關疾患（下背、肩、肘、腕）；25% 有下背問題，比一般攀岩者高；衝擊起子的震動被列為風險因子；31% 曾因傷請假、37% 必須調整工作方式。Touchstone 工會指稱公司在協商期間增加定線工作量，造成更多傷害（S24，工會方說法）。
- **工會**：
  - Movement Crystal City：2022 年美國第一家經 NLRB 認證的工會岩館（S26）。
  - Touchstone 南加州 5 館：2024-03 選舉勝出（S23），2024-04 認證（S24 寫法）。2025-03-24 定線員發動美國首次 ULP 罷工（S24）。灣區 4 館 2025-09 投票成立工會（S25）。2026-02 灣區 21 名定線員獲准單獨成立職類工會（S23）。
  - Movement：2026 年有 9 個據點已組工會但都沒有合約（S26）；舊金山一案 2026-02 開票 12:2（S27）。
  - Workers United 估計美國約 10% 岩館員工已有工會代表，2021 到 2025 年底約 27 館完成組織（S23 轉述）。

#### 4. 岩館商業模式與產業數據

- **北美規模（CBJ）**：2025 年新開 53（美 40、加 11、墨 2）、關閉 12、淨增 41、淨成長 4.7%（美 4.2%）；2024 年新開 60、淨成長 6.3%（B1）。北美總數「超過 900」（B5，2025 末）；2024 年版寫「超過 800」（搜尋摘要）。美國總數「超過 695」（B8，未註日期）、「超過 700」（B9，2026）。
- **抱石館化**：美國約 270 家抱石館，95% 是近 15 年開的；2024、2025 年美國新館有 73% 是抱石館（B7）。
- **景氣**：85% 業者說支出上升、71% 消費變差、69% 營收持平或下滑；73% 說經濟狀況變差，但 61% 預期 2026 改善；有業者說「Boom times are over」，強調要靠規模或併購才容易獲利（B1/B3/B4）。青少年課程報名上升是 2025 少數亮點（B1/B12）。
- **營收結構**：沒有找到 CBJ 或 CWA 公開的營收占比。顧問業者 Rise Above 的說法：會員常占 ≥50%、日票 20–25%，青少年課做得好可以超過日票；零售、餐飲占比小、毛利低；保險約營收 2–3%；成熟館淨利率 10–20%（B11）。wifitalents 等「統計」網站引用的「會員占 70%」來源不明，不採用。
- **整併**：美國前五大開發商 Movement 34 館（23 上攀＋11 抱石）、Central Rock Gym 29、Touchstone 18、The Gravity Vault 16（開始走加盟）、Bouldering Project 13（2026-02-27，B6）。Movement 由 Earth Treks、Planet Granite、Movement 合併，2021 年統一品牌（S26）。歐洲：Verlinvest 2024 年投資英國 Climbing Hangar、2025 年取得丹麥 Boulders 多數股權，合計 21 館（B10）。中西部 Vertical Endeavors（6 館）2026 年由創辦人賣給新業主（B9）。

#### 5. 安全管理、標準、保險、免責

- **歐洲 EN 12572（R2/R3）**：Part 1 是有保護點的岩壁（墜落負載破壞 20 kN／使用 6.6 kN；第一個保護點最高 3.10 m；岩點 12 kN 拉力測試；岩壁須標示製造商、標準編號、安裝日與下次主檢查日）；Part 2 是抱石牆（3 m 以下可用碎石，超過要用墊子；墊子由懸垂處外伸 2.0–2.5 m、側邊 1.5 m 或高度的 50%）；Part 3 是岩點。2025 年有修訂草案 prEN 12572-1:2025（R4 🔴）。
- **美國**：沒有聯邦岩壁標準；CWA 自稱「人工岩壁產業的標準制定組織」，有設計工程規範、結構檢查規範（R1：製造商無指引時，室內 ≤48 個月、戶外 ≤24 個月檢查一次；檢查員須 21 歲以上，具工程學位＋1 年經驗或 2 年業界經驗等）、Industry Practices（第 3 版 2018，R5 🔴 會員限定）、WAH 高處作業標準（R6）。ASTM 方面沒有找到專門的岩館標準；網路上常說的「ASTM F2376」查證後是水滑梯標準（R10），「ASTM F1918」是軟體遊戲設施（搜尋摘要）。
- **自動確保器事故**：西雅圖 Vertical World 案以 $6M 和解（R7）。台灣內湖運動中心 2020 年「忘記扣」致死，一審賠 105 萬（業者負 70% 責任），二審改死者自負 5%，再加 37.5 萬（T4/T5）。
- **免責同意書：美國和台灣法律環境完全不同**：
  - 美國多數州承認免責同意書可以排除「一般過失」，不能排除重大過失（R8/R9）；奧勒岡 2014 年 Bagley 案後失效，2026 年 SB 1517 恢復效力，並列出不可免除的責任（重大過失、安全設備維護檢查不當、人員訓練監督達重大過失等）（R8）。CWA Industry Practices 要求所有岩館使用參與者協議（R8）。
  - 台灣：消保法 §10-1「企業經營者對消費者或第三人之損害賠償責任，不得預先約定限制或免除」，免責條款無效（T2/T3）；§7 是無過失責任（T4）。臺北市檢查表明列「不得以書面、口頭或其他方式預先免責」（T1）。原岩的文件叫「安全守則與個人責任聲明」，不叫免責書（T7）。
- **台灣監管**：
  - 國民體育法 §44 原本只管公共運動設施，2019 年體育署擬增 44-1、44-2 納管民營場館（T3）；是否已立法：⚪ 見 Open questions。
  - 地方以消保稽查、建管公安申報、消防、體育局檢查表管理。2019 年中央稽查 20 家有 18 家設施安全不合格（T3）；2023 年新北 6 家全部不合格（T2）；臺北市檢查表增列攀岩 12 項（T1）。
  - 運動部《運動設施規範及分級分類參考手冊》2025-08 改版，第三十節是運動攀登場地（T1/T9）。
  - 公共意外責任險：稽查都把「有無投保」列為項目（T2/T3），原岩寫「依政府法令規定投保」（T7）；確切法源與最低保額：⚪ 見 Open questions。
- **中國對照**：GB 19079.4—2025 強制性國標（2025-07-01 實施）；攀岩被列為「高危險性體育項目」，須許可、須公眾責任險、技術指導人員須持證；970 家經營性岩館（2025-09）（T13）。

#### 6. 台灣岩館市場

- 原岩（T-UP）2015-08 成立，6 間分店（抱石：萬華、南港、明德；上攀＋抱石：中和、A19→搬遷 A22、新店）（T6；Threads 與 FB 的搜尋摘要）。A19 店 8/31 結束營業、搬到 A22 老街溪站（FB 搜尋摘要，年份未確認）。
- 2026-01-25 Honnold 徒手攀登台北 101 之後聲量大增：「攀岩、抱石」一年討論 180,826 筆、成長 211.2%（T8）；104 約 1,200 個攀岩相關職缺（S31）。
- 全台岩館家數：沒有官方統計 → ⚪。
- 營收、會員數、開店與倒閉統計：沒有公開資料 → ⚪。

---

### Conflicts（並列不裁決）

1. **USAC L1／L2 試爬門檻**：Path PDF（2025-09）寫 L1 要 V5、L2 要 V6／5.12+；Clinics 頁寫 L1 要「V4 與 5.12」、L2 要「V7 與 5.13」（S1 vs S2）。2023-10 舊版 PDF 摘要寫 L1「5.12 與 V4」、L3「5.13 與 V7」。
2. **CWA PRS L2 Boulder 建議時數**：標準 PDF（2024-04）寫 150 小時；Dashboard（2024-08 更新）寫 200 小時（S5 vs S6）。
3. **Touchstone 南加州工會時間**：CBJ 新聞稿寫「2024-04 認證」；onthelaborfront 寫「2024-03 選舉勝出」（S24 vs S23）。兩者可能分別指選舉與認證。
4. **Movement 據點數**：Wikipedia 寫 32（S26）；CBJ 開發商榜（2026-02-27）寫 34（B6）。
5. **美國／北美岩館總數**：「>695」（B8，未註日期）、「>700」（B9，2026）、北美「>900」（B5）、2024 北美「>800」（搜尋摘要）。統計範圍（美國或北美）與時間點都不同。
6. **內湖案賠償金額**：公視寫判賠 105 萬（一審）；CNEWS 寫二審再加 37.5 萬，標題寫「142.5 萬」（T4 vs T5）。是審級不同，不算矛盾，引用時要標明審級。
7. **IFSC 舊制入門**：Gripped 寫「國家定線員＋5 場無薪世界盃實習」（搜尋摘要）；Sewell 寫「早期可直接上 IFSC 課程 → 後來青年計畫 → 現在分級＋國家協會提名」（S11）。兩者描述的是不同時期。
8. **營收占比**：Rise Above 寫會員 ≥50%、日票 20–25%（B11）；fbcwall／wifitalents 寫會員 70–85%（搜尋摘要，來源不明）。

---

### Taiwan terminology（台灣用語）

| 中文 | 英文／說明 | 出處 |
|---|---|---|
| 定線員 | route setter；山協正式稱「運動攀登定線員」 | S18 |
| 定線 | route setting；104 職缺寫「館內定線」 | S18、S31 |
| C 級定線員講習／C 級運動攀登裁判(定線)證書 | 山協入門級定線資格（另有 A、B 級，條件未查到） | S18 |
| 主定線（員） | chief／head route setter（中國用「定线员」、日本用「チーフルートセッター」） | S15、cn |
| 試爬 | forerunning（日文「試登」）；山協課表沒有直接用「試爬」，用的是「定線實務」「定線考核」 | S17 |
| 換點換線 | 換線、reset（旅遊文對原岩的寫法） | 搜尋摘要 |
| 上攀／抱石 | roped climbing（含頂繩、先鋒）／bouldering | T6 |
| 頂繩（上方確保）／先鋒 | top-rope／lead | T5、T6 |
| 自動確保器 | auto-belay | T4、T7 |
| 確保證／先鋒證／安檢卡 | belay check card（頂繩、先鋒） | T5、T14 |
| CBT | 山協基礎攀登訓練證（報考 C 級定線的前提） | S18 |
| 公共意外責任險 | public liability insurance | T1–T3、T7 |
| 免責條款／切結書 | waiver（台灣依消保法 §10-1 無效） | T2、T3 |
| 安全守則與個人責任聲明 | 原岩的入場簽署文件名稱 | T7 |
| 定型化契約 | standard-form contract（稽查項目） | T2 |
| 岩點／岩塊、膠帶 | holds、start/finish tape | S20 |
| 運動攀登部 | CTMA Sport Climbing Department | S19 |
| 洗點 | hold washing（中文社群常用說法，本次未在台灣一手來源看到 → 引用時標「慣用語」） | — |

---

### Open questions（每項都標明結案狀態）

1. **山協「運動攀登定線員制度實施辦法」全文與 A／B 級條件、現行（2025–26）講習簡章** — ⚪ 公開網路查無（Keenable：「B級定線員 山岳協會 運動攀登」「中華民國山岳協會 運動攀登 定線員制度實施辦法 A級 B級」；只找到 2021 年 C 級簡章與 2018 年部簡則）。✉️ 可來信中華民國山岳協會運動攀登部索取實施辦法、現行簡章、各級人數；2021 年簡章的收件人是新竹 iClimb 風城攀岩館（張家祝）。
2. **台灣定線員薪資（時薪或按條計）** — ⚪ 無公開資料（Keenable：「岩館 定線 兼職 時薪 定線員 收入」；104 文章只列教練薪資，S31）。✉️ 可直接訪問岩館主定線或自由定線員（例如 S20 的劉翰杰）。
3. **台灣岩館家數與成長、開店與倒閉統計** — ⚪ 沒有官方或產業統計（Keenable：「全台 攀岩館 家數 統計」「台灣 攀岩館 數量 成長 抱石館 開店」「岩館 倒閉 熄燈 攀岩」；結果只有推薦清單與聲量排行）。✉️ 可能要問運動部運動產業署或山協。
4. **原岩營收、會員數** — ⚪ 未上市、無公開財報（Keenable：「原岩攀岩館 T-UP 營收 分店」）。✉️ 只能直接問原岩。
5. **國民體育法 44-1、44-2（民營場館納管）是否完成立法，以及攀岩館公共意外責任險的法源與最低保額** — 未結案。全國法規資料庫頁 `law.moj.gov.tw` 因網址含 `?` 在 zsh 中展開失敗，沒有抓到（工具操作問題，不是被擋）。下一步：重抓國民體育法全文，查各縣市「公共意外責任險」自治條例。現階段只能寫「推測」。
6. **CBJ 付費數據**（Gyms & Trends 2025 的營收／流量／價格／青少年課占比；Routesetting Trends 2025 的換線率與密度；Compensation Dashboard 各職位薪資） — ✉️ 要 CBJ Pro（$150/年）或填過調查的人才看得到。目前只能引用公開摘要（B1/B3/B4/S22）。
7. **Lajoie 定線員傷害研究的樣本數與發表處** — 🟡 只讀到 Climbing Doctor 的摘要（S28）；原始問卷或論文沒找到，下一步可用 jina 或 Exa 搜「Lajoie routesetters injuries survey」。
8. **World Climbing《Technical Officials' Pathway of Education》PDF（各級官方前提條件）** — 未結案。dev-officials 頁有提到這份文件（S10），但本次沒有抽出 PDF 連結；目前 IFSC L1–L4 的定義來自 Sewell 二手說法（S11）。下一步：抓 worldclimbing.com/resources/officials 找 PDF。
9. **prEN 12572-1:2025 修訂內容、CWA Industry Practices 第 3 版內文** — R4 🔴（jina 429）、R5 🔴（404／會員限定）。✉️ 後者要 CWA 會員資格。
10. **英國舊 RSA（Route Setting Association）和新 RSD Pathways 的承接關係** — 🟡 只有搜尋摘要層級，未打開 climbingwallservices 頁。
11. **台灣有沒有岩館員工組工會、定線員勞動條件的報導** — ⚪ 本次沒有搜尋這個題目（時間分配），未查證，不宜下結論。

---

# 附錄：B-coach-kids-adaptive
## B｜Coaching certifications, kids climbing, adaptive and paraclimbing: research notes

Research date: 2026-10-18. Scope: gym and sport instructor/coach certifications (not IFMGA), kids climbing, adaptive climbing and paraclimbing. Raw page dumps: `scratchpad/Bwork/pages/*.txt`.

**toolDegradation**
- (1) Groundlane MCP: `MCP server "claude.ai Groundlane" is not connected`.
- (2) Groundlane direct HTTP: HTTP 401 (OAuth bearer required).
- (3) Keenable keyless search worked, and was used for all searches.
- Page reads used `curl` plus a local HTML-to-text script, or `pdftotext` for PDFs. These are plain HTTP fetches, not a listed tool.
- (5) Cloud MCPs: jina MCP not connected. firecrawl MCP not connected. linkup failed (404). The keyless `r.jina.ai` reader worked after an initial 429 and was used for JS-rendered pages (pcia.us, nicas.co.uk).
- pubmed.ncbi.nlm.nih.gov returned a bot wall, so abstracts came from NCBI E-utilities (`efetch`).
- (4) You.com and (6) built-in WebFetch were not needed.

Read-level legend: ✅ read in full (whole page text extracted and read) · 🟡 summary-level (search snippet or partial) · 🔴 unread (reason given).

---

### 1. Sources table

| # | URL | Read | What it says |
|---|---|---|---|
| S1 | https://amga.com/programs/climbing-instructor-programs/climbing-wall-instructor-program | ✅ | AMGA CWI: est. 2007, UIAA-endorsed 2009. Runs 2.5 days with ≥20 h of training plus assessment. Two levels, Top Rope and Lead. Prerequisites: AMGA Pro membership, age 18+. Top Rope needs 30 outings in the last 12 months and comfortable 5.7 on top rope. Lead needs 50 outings, 5.9 on top rope and 5.8 leading. The page shows no price. |
| S2 | https://amga.com/programs/climbing-instructor-programs/single-pitch-instructor-program | ✅ | AMGA SPI: est. 2008, UIAA 2009, "over 18,000 participants". Course is 27 h over about 3 days. Exam is ≥16 h over 2 days and must happen within 2 years of the course. Course prereqs: 12 months outdoor climbing, 15 trad leads, 5.8 on top rope. Exam prereqs: 40 trad leads (15 post-course, 5 top-managed, 5 mock instruction), lead 5.6 trad. Medical cert required once certified, not before. |
| S3 | https://www.rockclimbfairfield.com/climbing-wall-instructor-certification | ✅ | Provider price for CWI: US$450 for the 20-h course and certification, US$225 for 1-day recert. AMGA membership is extra. The page is undated. |
| S4 | https://www.alpineinstitute.com/programs/amga-climbing-wall-instructor/ | 🟡 | Provider price for CWI: US$550 per person plus instructor travel, 2.5 days (grep of price block only). |
| S5 | https://climbingschoolusa.com/amga-courses | ✅ | Provider price for SPI: course Oct 10–12, 2026 at US$695; assessment Oct 24–25 at US$500. |
| S6 | https://usaclimbing.org/community/coaches/ | ✅ | Coach hub. Background screening can take up to 10 business days. 2026 coach calls include "Youth Climber Finger Injuries" (Apr 14, 2026) and separate Para Coaches calls. |
| S7 | https://usaclimbing.org/wp-content/uploads/2023/10/Coach-Certification.pdf | ✅ | USAC has two levels only, Level 1 and Level 2 Certified Coach. Both need coach membership, a background check, and SafeSport training (valid one season). L1 is age 16+; L2 is age 18+ plus current First Aid/CPR. Every team needs at least one L2. Requirements are checked to sit on the competition floor or enter isolation. |
| S8 | https://usaclimbing.org/wp-content/uploads/2021/10/Coach-Certification.pdf | ✅ | Older 2021-22 version. It has no age minimums; otherwise the same. |
| S9 | https://usaclimbing.org/wp-content/uploads/2025/05/USA-Climbing-Background-Check-Policy-2025-4-23.pdf | ✅ (grep-level on long sections) | Certified coaches are covered. Full re-screen every two seasons, with a lighter check in the off-years. |
| S10 | https://pcia.us/programs (via r.jina.ai) | ✅ | PCIA, since 2007, offers SPI, Sport Climbing Instructor (SCI), Climbing Wall Instructor (CWI) and Climbing Site Belayer (CSB). |
| S11 | https://pcia.us/cwi , /sci , /trci | 🟡/🔴 | /cwi returns 404 through the reader. The /trci search snippet says "~3 days, 18+". No PCIA prices or days were found for CWI. |
| S12 | https://www.mountain-training.org/qualifications/climbing/qualifications/climbing-wall-instructor | ✅ | MT CWI: training 17+, assessment 18+. 2 days training, 1 day assessment. Registration £69 and a mountaineering council membership. Before assessment: 30 wall visits, 40 leads, F4 leading, 15 assisted sessions, and in-person first aid of 8 h or more. Ofqual-regulated in England. Handbook updated June 2026. |
| S13 | https://www.mountain-training.org/qualifications/climbing/climbing-wall-development-instructor | ✅ | CWDI teaches lead climbing on walls. Must hold CWI or RCI. 1 day training, 1 day assessment, £69. Before assessment: 100 leads with half at 6a or above, and 5 observed lead-teaching sessions. |
| S14 | https://www.mountain-training.org/qualifications/climbing/rock-climbing-instructor | ✅ | RCI: 18+. 3 days training (2 days if all candidates already did CWI training), 2 days assessment, £69. Before assessment: 40 trad leads (20 at Severe or above), 30 wall leads, 10 sport leads, 20 assisted sessions, 16 h first aid. |
| S15 | https://www.mountain-training.org/qualifications/climbing/rock-climbing-development-instructor | ✅ | RCDI: must hold RCI. 4 days training, 3 days assessment, £81. Registration needs 60 trad leads at VS 4c and 60 sport leads at 6a. |
| S16 | https://www.mountain-training.org/qualifications/climbing/indoor-climbing-assistant | ✅ | ICA: age 16+, 1-day combined course, £27. Needs 5 indoor sessions; no personal climbing requirement. |
| S17 | https://www.mountain-training.org/cymru/scheme-information/indoor-climbing-assistant | ✅ | ICA scope: an assistant under direct supervision only, never managing groups independently. Min 6 h, 1 staff to 6 candidates, no first aid requirement. |
| S18 | https://www.mountain-training.org/qualifications/climbing/foundation-coach | ✅ | Foundation Coach: 16+. 1 day training, 2 h assessment, £69. Needs 15 coaching sessions, FUNdamentals 1, and a Safeguarding module. Average 1.6 years from training to pass. |
| S19 | https://www.mountain-training.org/qualifications/climbing/development-coach | ✅ | Development Coach: 18+. 2 days training, 4 h assessment, £69. Needs 40 coaching sessions after training, lesson plans, a home paper and safeguarding. Average 3.1 years from training to pass. |
| S20 | https://www.mountain-training.org/qualifications/climbing/performance-coach | ✅ | Performance Coach: must be a Development Coach. Needs onsight up to 7a and 200 h or more of coaching. Registration £103; training package £750. Fixed cohort of max 12; 2026 cohort runs Oct 2026 to Aug 2027. Assessment is a portfolio, a viva and a practical. |
| S21 | https://thebmc.co.uk/en/qualifications-explained | ✅ | BMC overview of MT schemes: Foundation, Development and Performance Coach roles. |
| S22 | ukclimbing / MT news in search results ("Mountain Training releases two climbing coach surveys", 12.05.25) | 🟡 | MT says it is reviewing its coaching qualifications (Foundation, Development, Performance) as of May 2025. |
| S23 | https://www.japan-sports.or.jp/Portals/0/data/ikusei/doc/guide/Sports_Climbing_Coach1.pdf | ✅ | JSPO 公認スポーツクライミングコーチ1 (as of 2023-04-01; curriculum dated 2024-04-01). Age 18+. Must belong to a prefectural federation. Leads 5.10b or above, *or* is judged able to teach beginners. Common subjects I (45 h) plus specialist subjects (25 h), ¥15,400 each. Registration ¥10,000 + ¥2,000 per 4 years + ¥3,300 initial fee. |
| S24 | https://www.jma-sangaku.or.jp/about/sports_leader/ | 🟡 | JMSCA sports-leader index page; short text only. |
| S25 | Coach 2 PDF (hma.jp 2021) | 🔴 | Not opened. The brief marked Japan "if quick", so it was deprioritised. |
| S26 | 中華民國山岳協會 115年度 C級運動攀登教練講習 簡章 (itsrcowebs.com …202603227-29-C教-內湖-簡章.pdf) | ✅ | Runs 3/27–3/29, 3 days, at 內湖運動中心. Eligibility: valid CTAA **CBT**, age **20+**, senior-high education. Must submit a 警察刑事紀錄證明 issued within the last month. Fee: members NT$4,000, non-members NT$4,500; certificate fee NT$300. Cap 30; cancelled if under 10. The certificate is issued through 中華民國體育運動總會. The curriculum includes 兒童及青少年運動訓練注意事項, 性平教育, 運動禁藥 and 運動傷害防護. |
| S27 | 中華民國山岳協會 113年度 C級 簡章 (…11308-體總-C教-原岩-簡章.pdf) | ✅ | 2024-08-30 to 09-01 at 原岩中和. Same eligibility and the same fees (NT$4,000 / NT$4,500). |
| S28 | CTAA B級 簡章 (Facebook group post, 2016) | 🟡 | Search snippet only (Facebook not fetched): requires a C cert plus 2 years of actual coaching, age 20+, and a pass on the C級裁判 written test. |
| S29 | https://tupclimbing.tw/news/announcement/232 | ✅ | CBT (Climbing Belay Test), 2023-05-20 at 原岩中和. Fee NT$1,200, or NT$1,000 for CTAA members. Tests TR belay, lead belay, an 8 m lead at 5.7–5.8, and rope coiling. The page says CBT is the prerequisite for C-level coach, judge and setter courses. |
| S30 | https://pa.org.tw/CTCA/04class/index.html | ✅ | 中華民國攀登協會 (CTCA, since 1996) 休閒攀登教練 course, run by 台北攀岩學校. Batch 35 has no date yet ("2027/xx"). Age 20+, senior-high education, must be able to lead and clean (先鋒撤退). NT$6,000. Held at 新店瑠公攀岩基地, 20 per batch. |
| S31 | https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=H0120082 | ✅ | 特定體育團體建立運動教練資格檢定及管理辦法 (amended 112-03-31). C/B/A levels are defined by **competition/national-team roles**. C: age 20+ and senior-high. B: 2 years as C plus practice. A: 3 years as B. Course hours: C ≥24 h, B ≥32 h, A ≥40 h. Life bans for sexual offences and similar. Certificate valid 4 years; renewal needs 48 h of CPD with at least 6 h a year. |
| S32 | https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=H0120001 | ✅ (grep of relevant articles) | 國民體育法. Art. 3 defines 運動教練 as certified by sports bodies. Art. 20 says high-risk sports activities need a permit under a 辦法. The only Art.-20 辦法 found was 高空彈跳 (bungee); none was found for climbing. |
| S33 | https://www.ey.gov.tw/Page/9277F759E41CCD91/d0eb8192-299e-4522-a74d-23435408aed2 | ✅ | 2026-09-03 (115-09-03): the Executive Yuan passed the draft **國民運動法**, replacing 國民體育法 and now before the Legislative Yuan. New chapters: 「適應運動」 and 「運動教練、運動裁判及運動專業人員」. A public lookup system for unfit coaches is planned. |
| S34 | https://www.legis-pedia.com/columns/7/articles/1458 | ✅ | Lawyer column (2026, after Honnold's Taipei 101 climb). "目前並沒有法規針對岩館的場地規格作統一規範". Courts refer to the CTAA 《運動攀登安全手冊》 (2024). Waivers are void under 消保法 §10-1. Gyms carry 公共意外責任險. It does not discuss a coach-licence requirement. |
| S35 | https://blog.104.com.tw/104data-rock-climbing-recruit-salary/ | ✅ | 104人力銀行, 2026-01-26: about 1,200 climbing-tagged jobs. Gym 運動攀岩教練 full-time NT$32,000–40,000 a month. 兒童攀岩教師 part-time NT$300–600 an hour. Outdoor promotion roles NT$38,000–50,000 a month. |
| S36 | https://udn.com/news/story/7269/9298463 | ✅ | UDN rewrite of the same 104 data (no new numbers). |
| S37 | http://www.iclimb.com.tw/about/job.htm (Big5) | ✅ | iClimb 風城, dated 103-04-02 (2014). Full-time 攀岩教練: college degree, "無經驗可". CTAA CB Test, EMT and similar certificates are "尤佳" (preferred, not required). |
| S38 | Threads post @tupclimbing (原岩A19 兼職) | 🟡 | Snippet only (Threads not fetched). Counter/front-desk part-time at NT$196 weekday / NT$206 holiday per hour; "任何程度攀岩經驗". This is a desk job, not coaching. |
| S39 | https://www.sports-life.com.tw/catalog/jay-ri/ | 🟡 | Snippet. A coach's own path: CBT, then lead and TR belay certificates, then CTAA C-level within year one, then part-time coaching at several gyms. |
| S40 | https://pubmed.ncbi.nlm.nih.gov/16209469 (via E-utilities) | ✅ abstract | Hochholzer & Schöffl 2005, *Wilderness Environ Med*. 24 cases of non-traumatic epiphyseal fracture of the PIP joint (dorsal base of the middle phalanx). Mean age 14.5; 23 of 24 boys. 20 were Salter-Harris III. All were fatigue fractures. Advises eliminating intensive power training at this age. |
| S41 | https://pubmed.ncbi.nlm.nih.gov/31103479 (E-utilities) | ✅ abstract | Bärtschi, Scheibler & Schweizer 2019, *Hand Surg Rehabil*. 28 climbers, mean age 13.7. Middle finger 58%, ring 30%. 54% fractures and 46% symptomatic sprains. Radiological union averaged 35 weeks. 8 cases had articular incongruency. |
| S42 | https://pubmed.ncbi.nlm.nih.gov/30431364 (E-utilities) | ✅ abstract | Schöffl et al. 2018 review, *Res Sports Med*. Climbing is comparatively safe for youth. Epiphyseal stress fractures are a major concern during the pubertal growth spurt. |
| S43 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11848689/ | ✅ | Schöffl et al. 2025, *BMJ Open SEM* 11:e002212. Prospective, single centre, 2017–2020: 137 injuries in 95 climbers under 18. PPSI (primary periphyseal stress injury) made up **45.3%** of injuries. Peak age 13–15, mostly boys. Recommends reducing crimping, monitoring load, ensuring recovery, and education. |
| S44 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7037851/ | ✅ (key sections) | Meyers et al. 2020, *IJERPH* 17:812. Survey of 267 youth at the 2017 USAC Nationals. Most wrongly named A2 pulley as the top youth injury. Only 5.7% knew the "safe age (18+)" for double-dyno campusing, which the paper attributes to BMC guidance. |
| S45 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6446347/ | ✅ abstract | Conference abstract of the same survey (*OJSM* 2019). Regular IFSC speed-wall training was associated with growth-plate injury (risk ratio 1.34–13.94, p=0.02). |
| S46 | BMC "Harnesses – A Guide for Climbers and Mountaineers" PDF | ✅ (children sections) | Type B child full-body harnesses are tested to a 40 kg max. Younger children need full-body harnesses because of a higher centre of gravity and no defined waist. Moving to a sit harness "depends on many factors". The injury tolerance of children in lead falls is "not clearly established", so the guide advises caution. |
| S47 | https://avs.edelrid.com/images/attribut/EN_12277.pdf | ✅ | EN 12277 types: A full body; B small full body (up to 40 kg); C sit; D chest (only with C). |
| S48 | https://www.petzl.com/INT/en/Sport/Harnesses/OUISTITI | ✅ | Petzl OUISTITI kids' full-body harness. Front tie-in sits low; buckles are out of the child's reach. No weight limit appeared in the extracted text. |
| S49 | UIAA 105 harness standard PDF | 🔴 | PDF is image-only, so no text could be extracted. EN 12277 (S47) was used instead. |
| S50 | https://tupclimbing.tw/pricing/83 | ✅ | 原岩中和 entry categories: 兒童 6–12, 幼兒 under 6. Under 12 must wear a helmet on roped walls. Under 18 must be accompanied by an adult. Under 18 may not belay others without staff permission. |
| S51 | https://tupclimbing.tw/course/zhonghe/370 | ✅ | 原岩 【兒童課】上攀課程 ages 7–12. 3–4 per class. NT$4,000 for 6 sessions of 1.5 h. Trial session NT$800. Shoes, harness and helmet provided. |
| S52 | https://tupclimbing.tw/course/zhonghe/367 | ✅ | 原岩 【幼兒課】攀岩體能課 ages 4–6. NT$3,000 for 6 sessions of 1 h. Play, fitness and coordination mixed with climbing. |
| S53 | https://tupclimbing.tw/course/zhonghe/358, /360, /379 | ✅ | Adult courses for comparison (18+). TR belay NT$5,500 for 5 sessions. Lead NT$7,500 for 6. Technique NT$5,000 for 4. |
| S54 | https://climbingbusinessjournal.com/changes-to-ifsc-age-categories | ✅ | The 2023 IFSC GA raised the World Cup minimum age from 16 to 17, effective 2025. Categories change to U17/U19/U21. The 2025 Youth Worlds include only U17 and U19. |
| S55 | https://climbing.nz/2025/01/understanding-the-new-ifsc-category-changes | ✅ | Mapping: YD→U13, YC→U15, YB→U17, YA→U19, Junior→U21. Says the change applies "starting in 2024" (see Conflicts). |
| S56 | https://climbingbusinessjournal.com/changes-to-youth-age-categories | ✅ | USAC youth categories changed for the 2024-25 season: U20 single-age category, U15 and others. |
| S57 | youthclimbing.com competitions snippet + geckoclimbinggym.com QE page | 🟡 | 2025-26 USAC table: U11 (10 & under, new, mixed gender, QEs and Regionals only), U13, U15 (top rope only for rope events), U17, U19, U20. |
| S58 | https://www.worldclimbing.com/news/get-to-know-para-climbing | ✅ | IFSC (now branded "World Climbing"). Para events are Lead on **top rope**. Up to 20 sport classes (10 per gender). Classes: B1–B3 (visual), AL1–AL2 (lower limb), AU2–AU3 (upper limb), RP1–RP3 (range and power). A lower number means greater impairment. B1 climbers wear a blindfold; guides talk by radio. Prosthetics are optional. 2025 season: 3 World Cups plus Worlds in Seoul. |
| S59 | https://www.paralympic.org/news/la28-paralympic-medal-event-programme-athlete-quotas | ✅ | Para climbing debuts at LA28 as the 23rd sport: 8 medal events (4 men, 4 women), max 10 athletes each. |
| S60 | https://usaclimbing.org/news/para-climbing-schedule-confirmed-for-the-la28-paralympic-games/ | ✅ | LA28 para climbing runs Aug 24–27, 2028 at the Long Beach Climbing Theater. Classes in the schedule include AU2, B1, B2, RP1 and AL2. |
| S61 | https://paraclimbing.org/classification/ , https://climbingcanada.ca/…/classification-system/ | 🟡 | Fetched but not cited beyond S58. |
| S62 | https://www.paradoxsports.org/adaptive-climbing-initiative/ | ✅ | Paradox Sports Adaptive Climbing Initiative (ACI), sponsored by The North Face. A 2-day course for gym staff, guides and others. Hosting facilities go on to run adaptive nights, clubs and so on. |
| S63 | https://paradoxsports.org/aci-course-list | ✅ | List of facilities that have hosted ACI. About 159 entries (by line count), with dates up to 2026. |
| S64 | https://paradoxsports.org/trips/faqs | ✅ | Serves physical disabilities, TBI and PTSD. Program leaders are AMGA-certified. Minors may join with a guardian registered as volunteer. |
| S65 | https://adaptiveclimbinggroup.org | ✅ | ACG, founded by Kareemah Batts. First clinic 2012-03-15 in Brooklyn with 38 participants. Now indoor, outdoor and youth programmes plus paraclimbing support. Training camp since 2017. Free, discounted or donation-based. |
| S66 | https://services.thebmc.co.uk/disability-neednt-stop-you-climbing | ✅ (undated, older) | BMC Equity Steering Group, the "Climbing for All" booklet and course, and the BMC Paraclimbing Series with 8 categories (including learning difficulties and ASC). |
| S67 | https://nicas.co.uk/climbing-for-all (via r.jina.ai) | ✅ | Published 2025-07-28. Climbing for All is a 1-day course "offered for over 20 years". Developed by Mountain Training, BMC and Adventure for All; delivered with NICAS and Access Sport. Half theory (social model of disability), half practical. Linked to NICAS Ascend, the award for disabled and neurodivergent participants. |
| S68 | https://twnewshub.com/archives/60776 | ✅ | 2023-12-15: 國立體育大學 hosted 小林幸一郎 (Monkey Magic) and 鈴木直也. On 112-12-01 at Camp 4 北投 with 台灣展翼視障天使協力車協會, clock-direction cueing was found best for guiding. |
| S69 | https://www.tfb.org.tw/contents/news_ct?id=71 | ✅ | 愛盲基金會 / 廣慈視障者生活重建中心 climbing experience session led by coach 陳怡勳 (Y17). Year not shown (8/13, a Tuesday). |
| S70 | https://www.ibt.org.tw/RWD01/OnePage.aspx?tid=120&id=945 | ✅ | 台灣盲人重建院 南部服務中心: blind participants climbed and abseiled at 柴山 on 2/16 (year not shown). |
| S71 | https://vocus.cc/article/692dbdb3fd89780001cd4142 | ✅ | 2025-12 film review (《攀岳人生》). Mentions Monkey Magic events with 原岩. Claims Koba's method was "引進到台灣攀岩協會的系統" (unsourced). |
| S72 | https://ctaa.j91.me/race/502 , /race/30 | ✅ | CTAA national championships (2025 lead and boulder, 2026 boulder): categories are only 男子/女子甲組 plus youth. **No para category.** |
| S73 | NTSU page (Monkey Magic x 原岩 視障攀岩體驗) | 🔴 | curl failed (connection) and it was not retried through the reader. Covered by S68 and S71. |

---

### 2. Findings by topic

#### 2.1 Instructor and coach certifications (gym and sport)

**USA: AMGA (professional guide body; the one most cited in US gyms)**
- **CWI (Climbing Wall Instructor)** (S1):
  - Format: 2.5 days, ≥20 h of training and assessment.
  - Two levels: Top Rope CWI teaches movement and top rope. Lead CWI also teaches lead on single-pitch artificial walls.
  - Prerequisites: AMGA Professional Membership, age 18+, at least one year of documented climbing.
  - TR level: 30 outings in the last 12 months, 5.7 on top rope.
  - Lead level: 50 outings, 5.9 on top rope, 5.8 leading.
  - Provider prices: US$450 with US$225 recert (S3, undated); US$550 (S4).
- **SPI (Single Pitch Instructor)** (S2) is the outdoor single-pitch crag step and leads on to the Rock Guide Course. It is useful context for a gym-coach article but is not gym-specific.
  - Course: 27 h, valid for 2 years.
  - Exam: 16 h over 2 days, after 40 trad leads.
  - Provider prices: US$695 course and US$500 exam (S5, Oct 2026).
- **AMGA adaptive link:** Paradox Sports program leaders are AMGA-certified (S64).

**USA: USA Climbing (competition NGB)** (S6–S9)
- Only **Level 1 and Level 2 Certified Coach** memberships exist; no Level 3 was found.
- This is a **competition-access credential**, not a teaching course. It requires:
  - coach membership
  - a background check under the SafeSport Screening policy, with a full re-screen every 2 seasons
  - SafeSport online training, valid one season
  - an employer letter or a CV with 2 references
- L1 is 16+. L2 is 18+ with current First Aid/CPR. Every team needs at least one L2.
- USAC runs dedicated **Para Coaches** calls and held a "Youth Climber Finger Injuries" coach call on 2026-04-14.

**USA: PCIA (Professional Climbing Instructors Association)** (S10–S11)
- Since 2007. Offers CWI, SCI (Sport Climbing Instructor, a gym-to-crag bridge), SPI (its own, a different body from AMGA's SPI) and CSB (Climbing Site Belayer).
- Days and prices for PCIA CWI were not obtainable; the /cwi page returns 404 (see Open questions).

**UK and Ireland: Mountain Training (MT)** (S12–S22). The full ladder for gym and crag:

| Scheme | Purpose | Min age | Training / assessment | Registration fee | Key prerequisite |
|---|---|---|---|---|---|
| Indoor Climbing Assistant (ICA) | Assist a qualified instructor; cannot run groups alone | 16 | 1-day combined course | £27 | 5 indoor sessions |
| Climbing Wall Instructor (CWI) | Supervise and teach top-rope groups on walls | 17 train / 18 assess | 2 d / 1 d | £69 | 40 leads, 15 assisted sessions, 8 h first aid |
| Climbing Wall Development Instructor (CWDI) | Teach lead climbing indoors | must hold CWI or RCI | 1 d / 1 d | £69 | 100 leads (half at 6a+) |
| Rock Climbing Instructor (RCI) | Single-pitch crags plus walls | 18 | 3 d (2 d after CWI) / 2 d | £69 | 40 trad (20 at Severe+), 16 h first aid |
| Rock Climbing Development Instructor (RCDI) | Teach lead (sport and trad) on crags | must hold RCI | 4 d / 3 d | £81 | 60 trad at VS 4c + 60 sport at 6a |
| Foundation Coach | Single coaching sessions (movement) | 16 | 1 d / 2 h | £69 | 15 sessions, FUNdas 1, safeguarding |
| Development Coach | Structured multi-session coaching | 18 | 2 d / 4 h | £69 | 40 sessions, lesson plans, home paper, safeguarding |
| Performance Coach | Bespoke performance coaching | must be a Dev Coach | 8 days + online over months; £750 package | £103 | onsight 7a, 200 h+ coaching; cohort max 12 |

- **Instructor vs coach.** MT keeps "instructor" schemes (supervision and safety) separate from "coach" schemes (movement and performance). Coaches must also hold the right supervision credential, e.g. CWI for roped climbing (S18–S19).
- The brief's name "Climbing Coach" does not exist as a current MT scheme. The current coach ladder is **Foundation → Development → Performance Coach**. MT announced a review of the coaching suite in May 2025 (S22).
- CWI, CWDI, RCI, RCDI and ICA delivered by MT England are **Ofqual-regulated**.

**Japan: JSPO / JMSCA** (S23)
- 公認スポーツクライミングコーチ1:
  - Age 18+, member of a prefectural federation.
  - Lead 5.10b or above, *or* judged able to teach beginners.
  - JSPO 共通科目Ⅰ (45 h) plus specialist subjects (25 h), ¥15,400 + ¥15,400.
  - 4-year registration; renewal requires training.
- Role: prefecture-level instruction, school clubs, and coaching 国体 athletes. Coach 2 was not researched (🔴 S25).

**Taiwan**
- **中華民國山岳協會 (CTAA)** is the IFSC member and the 特定體育團體 for 運動攀登.
- **CTAA C級運動攀登教練** (S26–S27):
  - Prerequisite: a valid **CBT 攀登確保能力檢測**.
  - CBT itself (S29): TR belay, lead belay, an 8 m lead at 5.7–5.8, and rope coiling. NT$1,200, or NT$1,000 for members (2023 price).
  - Other requirements: age **20+**, senior-high education, a 警察刑事紀錄證明 issued within the last month.
  - Format: a 3-day course (2026: 3/27–29 at 內湖運動中心; 2024: 8/30–9/1 at 原岩中和).
  - Fees: NT$4,000 for members, NT$4,500 for non-members, plus NT$300 certificate fee. Identical in 2024 and 2026.
  - Cap 30; the course is cancelled below 10.
  - Passing both the written and practical tests leads to a certificate issued through **中華民國體育運動總會**.
  - The legal minimum for C-level training is 24 h (S31). The 2026 timetable has about 3 days of sessions, including 兒童及青少年運動訓練注意事項, 性平教育, 運動禁藥, 運動傷害防護及急救, 攀岩運動生理學 and technical practice.
- **CTAA B級** (S28, 🟡 2016 snippet): C certificate plus 2 years of coaching, age 20+, plus a pass on the C-level judge written test.
- **The legal frame** is 特定體育團體建立運動教練資格檢定及管理辦法 (S31):
  - Levels are defined by **competition roles**. C: coach at government or federation competitions. B: national-team assistant. A: national-team head coach.
  - Minimum course hours: C 24 h, B 32 h, A 40 h.
  - Certificates last 4 years; renewal needs 48 h of CPD (at least 6 h a year).
  - There are lifetime and 1–4-year bans for sexual offences, bullying, doping and similar.
  - Certificates issued before 107-05-30 expired on 114-12-31 unless converted.
- **中華民國攀登協會 (CTCA)** 休閒攀登教練 (S30):
  - A private association credential, run by 台北攀岩學校.
  - NT$6,000; age 20+; must be able to lead and clean.
  - Batch 35 has no date ("2027/xx").
  - CTCA's page calls it 「休閒攀登教練」 and does not state "C級" on the course page. It has a 教練制度 sub-page (not opened).
- **Agency names.** 體育署 was reorganised into **運動部** in 2025. The 全國法規資料庫 now files these rules under 「行政＞運動部」 (S31), and the EY release mentions 運動部 and 全民運動署 (S33). Writing 「體育署」 is outdated for 2026 text.
- **Is a certificate legally required to teach in a Taiwan gym?** ⚪ No legal requirement was found.
  - The 教練資格 regulation defines C/B/A levels by competition roles only (S31).
  - 國民體育法 Art. 20 allows permits for designated "high-risk" sports, but the only such 辦法 found was for bungee jumping (S32).
  - A lawyer notes that no statute regulates gym specifications; courts refer to CTAA's 安全手冊 instead (S34).
  - Gyms list certificates as "尤佳", i.e. preferred (S37, 2014).
  - Caveat: the 國民運動法 draft passed by the Executive Yuan (2026-09-03) adds a coach chapter and an unfit-coach lookup system (S33). Its effect on commercial instruction is unknown until the bill text is published.
  - Tools tried: Keenable (3 queries on gym regulations and Art. 20), legal databases, the legispedia column. If you need an authoritative answer, ✉️ email 運動部 全民運動署 to ask whether commercial climbing instruction falls under any 辦法.
- **How Taiwan gyms hire, and pay:**
  - The 104 data (2026-01-26) gives gym 運動攀岩教練 at **NT$32,000–40,000 a month full-time** and 兒童攀岩教師 at **NT$300–600 an hour part-time** (S35).
  - Front desk staff at 原岩 earn NT$196–206 an hour (S38, 🟡). NT$196 matches the 2026 minimum hourly wage (that last point is my inference).
  - A typical coach path described in S39 (🟡) is CBT → belay certificates → CTAA C → part-time coaching at several gyms.
  - Gym course prices at 原岩 are in S51–S53.

#### 2.2 Kids climbing

- **Starting age.** No governing body sets a minimum age.
  - Practice examples: 原岩 runs **幼兒 4–6** (play and fitness-based) and **兒童 7–12** roped classes, max 4 per class, with helmet and harness provided (S51–S52).
  - 原岩 house rules: helmet under 12 on roped walls; adult accompaniment under 18; no belaying others under 18 without staff permission (S50).
  - USAC competition starts at U11 (10 & under), mixed gender, at local and regional events only (S57).
  - MT lets 16-year-olds take ICA and Foundation Coach (S16, S18).
- **Harnesses** (S46–S48). EN 12277 has Type A full body, **Type B small full body (≤40 kg)**, Type C sit, and Type D chest.
  - The BMC says younger children need full-body harnesses: a higher centre of gravity, and no defined waist to hold a belt.
  - The switch to a sit harness "depends on many factors".
  - Because children's injury tolerance in lead falls is unknown, the BMC advises caution about starting lead and sit harnesses.
  - Example product: Petzl OUISTITI.
- **Youth categories:**
  - IFSC (now branded World Climbing) moved to U13/U15/U17/U19/U21 and raised the senior World Cup minimum age to 17 from 2025. Youth Worlds from 2025 include only **U17 (15–16) and U19 (17–18)** (S54–S55).
  - USAC 2025-26: U11, U13, U15 (top rope only for rope events), U17, U19 and U20 (S56–S57).
  - UK: NICAS (National Indoor Climbing Achievement Scheme) has levels; the BMC and MT say NICAS Level 4–5 graduates suit CWI or Foundation Coach (S12, S18). The NICAS FAQ itself returned a bot wall.
- **Growth-plate (epiphyseal) finger stress fractures** are the signature youth injury:
  - The original case series: 24 cases, mean age 14.5, 23 of 24 boys, dorsal base of the middle phalanx, Salter-Harris III, all fatigue fractures (S40).
  - Swiss series: mean age 13.7; middle 58% and ring 30% of fingers; union took about 35 weeks; untreated cases can leave permanent joint incongruency (S41).
  - Prospective 2017–2020 series of under-18s: **PPSI = 45.3% of all injuries**, peak at ages 13–15. Recommends less crimping, load monitoring, recovery and education (S43).
  - Awareness survey at USAC Nationals: youth confused PPSI with A2 pulley injury, and only 5.7% knew the guidance against double-dyno campusing under 18, which the paper attributes to the BMC (S44).
  - Regular IFSC speed-wall training was associated with growth-plate injury (S45).
  - Review: climbing is comparatively safe for youth, but the pubertal growth spurt is the risk window (S42).
  - Terminology has shifted: the 2025 papers use "primary periphyseal stress injury (PPSI)" rather than "epiphyseal fracture" (S43; Frontiers 2024/2025 classification papers appeared in search but were 🔴 not opened).
- **Taiwan coach training** includes a 「兒童及青少年運動訓練注意事項」 session in the C-level course (S26).

#### 2.3 Adaptive climbing and paraclimbing

- **Paradox Sports (US)** (S62–S64):
  - Runs the Adaptive Climbing Initiative, a 2-day course (sponsored by The North Face) training gyms, universities and guides to run adaptive programs.
  - About 159 host sites are listed, with courses dated through 2026.
  - Trips serve physical disabilities, TBI and PTSD, led by AMGA-certified leaders.
- **Adaptive Climbing Group (US)** (S65):
  - Founded by Kareemah Batts after losing her leg to cancer. First clinic 2012-03-15 in Brooklyn with 38 participants.
  - Now runs indoor, outdoor and youth programmes, plus a paraclimbing training camp since 2017.
  - Programming is free, discounted or donation-based.
- **UK** (S66–S67):
  - *Climbing for All* is a 1-day CPD course for instructors and coaches, offered for 20+ years. Developed by MT, BMC and Adventure for All; delivered with NICAS and Access Sport. It is built on the social model of disability.
  - NICAS Ascend is the award for disabled and neurodivergent climbers.
  - The BMC runs a Paraclimbing Series with 8 categories, broader than the IFSC classes (it includes learning difficulties and ASC).
- **IFSC para classes** (S58), suitable for a community-level post:
  - **B1–B3**: visual impairment. B1 is blindfolded; guides give instructions by radio.
  - **AL1–AL2**: lower limb. AL1 climbers effectively campus.
  - **AU2–AU3**: upper limb.
  - **RP1–RP3**: range, power or neurological impairment.
  - A lower number means greater impairment. Up to 20 classes in total.
  - Competitions are lead on **top rope** with no clipping. Prosthetics are optional.
- **Paralympics:** para climbing debuts at **LA28** with 8 medal events and up to 10 athletes each, Aug 24–27, 2028 at Long Beach (S59–S60).
- **Taiwan:**
  - Activity is mostly **視障 (visually impaired) experience events**:
    - Monkey Magic (小林幸一郎, 鈴木直也) with 國立體育大學, 展翼視障天使協力車協會 and Camp 4 北投 in Dec 2023 (S68); also with 原岩 (S71).
    - 愛盲基金會 / 廣慈 sessions (S69).
    - 台灣盲人重建院 at 柴山 (S70).
  - CTAA national championships have no para category (S72).
  - The draft 國民運動法 adds a 「適應運動」 chapter, the official Taiwan term for adaptive sport (S33).
  - ⚪ No standing Taiwan adaptive or para climbing organisation or regular programme was found. Tools tried: Keenable, 4 queries (身障/視障/帕拉/適應性 攀岩 plus a national-championship check).

---

### 3. Conflicts (listed, not resolved)

1. **IFSC age-category start year.** CBJ (S54) says new categories start in 2025. Climbing NZ (S55) says "starting in 2024". This may reflect NZ's season boundary.
2. **CTAA 2026 brochure date.** The brochure title says 115年度 (2026), but the body says 「2025 年 3 月 27 日（星期五）」. 2026-03-27 is a Friday, so the "2025" is likely a typo, but the document itself is inconsistent.
3. **CWI price varies by provider.** US$450 (S3, undated) vs US$550 (S4). AMGA lists no national price.
4. **"SPI" means two different programs.** AMGA SPI and PCIA SPI are separate programs from rival bodies (S2 vs S10).
5. **USAC age minimums.** The 2021 PDF has none; the 2023 PDF sets L1 at 16+ and L2 at 18+ (S7, S8).
6. **小林幸一郎 titles.** "四屆世界攀岩錦標賽視障組冠軍" (S68) vs a list of 5 years in S71.
7. **Injury terminology.** "Epiphyseal fracture" (2005/2019) vs "PPSI" (2025), and different counting: S41 includes sprains, S43 includes stress reactions. Rates are not directly comparable.
8. **USAC youth table for 2025-26.** youthclimbing.com has U20 as ages 18–19 (born 2006–07); a gym QE page uses different birth-year bands (S57). Both are 🟡; the primary USAC rulebook was not read.

### 4. Taiwan terminology

| English | zh-TW used in sources |
|---|---|
| Sport climbing coach (C/B/A level) | C級／B級／A級運動攀登教練 (中華民國山岳協會) |
| Recreational climbing coach | 休閒攀登教練 (中華民國攀登協會) |
| Climbing Belay Test | CBT 攀登確保能力檢測 (also written CB Test) |
| Coach CPD | 教練增能進修研習會 |
| Top-rope / lead belay | 頂繩確保 (Top-Rope)／先鋒確保 |
| Lead and clean | 先鋒攀登／先鋒撤退 |
| Belay device / ATC | 確保器 (豬鼻仔) |
| Police criminal record certificate | 警察刑事紀錄證明 |
| Designated sports body | 特定體育團體 |
| National sports federation umbrella | 中華民國體育運動總會 |
| Ministry of Sports | 運動部 (successor to 體育署) |
| Adaptive sport | 適應運動 (official, per the 國民運動法 draft) |
| Paraclimbing | 帕拉攀岩 (CTSOD = 中華帕拉林匹克總會); the press uses 身障攀岩 |
| Visually impaired climbing | 視障攀岩 / 盲攀 |
| Kids / toddler class | 兒童課／幼兒課 (原岩) |
| Full-body harness | 全身式吊帶 (common usage; no Taiwan official source checked) |
| Growth plate | 生長板 (common usage; the papers are English) |
| Resident gym coach | 駐場教練 |
| Public liability insurance | 公共意外責任險 |
| CTAA safety manual | 《運動攀登安全手冊》 |

### 5. Open questions / gaps

| Gap | Status |
|---|---|
| PCIA CWI days and price | ✉️ email PCIA (pcia.us contact). The /cwi page returns 404; only program descriptions were obtainable. |
| JSPO スポーツクライミングコーチ2 details | 🔴 deprioritised ("if quick"). The hma.jp PDF exists but was not opened. |
| Is a coach certificate legally required to teach at a Taiwan commercial gym? | ⚪ No public statute found (tools listed in 2.1). ✉️ 運動部 全民運動署 for an authoritative answer. Recheck once the 國民運動法 bill text is published. |
| CTAA B/A-level current requirements and fees | 🟡 2016 Facebook snippet only (Facebook not fetchable). ✉️ CTAA 運動攀登部, or wait for the next brochure on itsrcowebs. |
| CTCA 休閒攀登教練 level naming ("C級"?) and validity period | 🟡 The course page doesn't say. The 教練制度 sub-page was not opened (could be closed quickly). |
| Typical Taiwan coach pay beyond the 104 aggregate | ⚪ No gym-published coach pay scales found (Keenable searches for 岩館 徵才 時薪). Only 104 ranges and one front-desk wage. |
| US coach pay | Not researched. Climbing Business Journal publishes a "Compensation Report 2026" (seen in site nav, not opened). |
| Taiwan adaptive or para climbing standing programs | ⚪ None found beyond one-off 視障 events (tools listed in 2.3). |
| USAC 2025-26 youth table from the primary source | 🟡 Secondary sources only. Could be closed via the USAC Youth Series Guide (Google Doc linked in search results). |
| BMC under-18 campus-board guidance, primary text | 🟡 Cited only through S44. The BMC page was not located. |
| UIAA 105 text | 🔴 Image-only PDF; EN 12277 (Edelrid) used instead. |

---

# 附錄：C-partners-culture
## C 系列研究筆記：繩伴、岩館文化與岩館史

研究日期：2026-10-18。研究代理：plan 子代理（只做研究，沒有改 repo）。

### toolDegradation（工具降級紀錄）

| 層級 | 工具 | 結果 |
|---|---|---|
| 1 | Groundlane MCP `web_search` / `web_fetch`（用 ToolSearch 載入） | ❌ 載入成功，但每次呼叫都回 `MCP server "claude.ai Groundlane" is not connected` |
| 2 | Groundlane 直接 HTTP（curl POST `/mcp`） | ❌ 回應內容是空的 |
| 3 | Keenable keyless search | ✅ 所有搜尋都用它（腳本 `ks.sh`） |
| 頁面抓取 | jina reader（`r.jina.ai`，curl） | ❌ 回 429 per-IP rate limit |
| 頁面抓取 | curl 直接抓原始 HTML，轉成純文字 | ✅ 大部分頁面讀全文都靠這條；HTML 原文存在 `scratchpad/pg/`，PDF 用 `pdftotext` 轉 |
| 5 | firecrawl MCP | ❌ not connected |
| 5 | linkup MCP | ❌ 404 / disconnected |
| 5 | Exa `web_fetch_exa` | ✅ 用來讀 CWA、T&F、Forbes、Climbing.com、REI、BMC、VoyageDenver、人間福報、動誌、Queen's 這幾頁 |

### Sources table（來源表）

read 等級：✅ 讀了全文（或主要內容全文）／🟡 只讀到部分或摘要層級／🔴 沒讀

| # | URL | 讀取程度 | 內容摘要 |
|---|---|---|---|
| S1 | https://www.alpenverein.de/verband/bergsport/sicherheitsforschung/kletterhallen-unfallstatistik/kletterhallenunfallstatistik-2025 | ✅ | DAV＋KLEVER 2025 年報（德國＋奧地利）。341 件通報，其中 252 件符合收錄門檻（有出動救護或至少中度傷）。抱石 174 件、繩攀 68 件（8 件發生在自動確保器）。抱石事故中 89% 是落墊。繩攀共 31 次墜地，其中 15 次發生在下放；12 次是繩子不受控地滑過確保器（9 次是 Autotuber 類半自動確保器、2 次 GriGri/Neox、1 次 HMS），平均墜落高度 5 m。墜地事故中有 44% 發生在「理論上沒有自由墜落」的情境（下放、頂繩）。有 1 例做了 partner check 仍漏看沒打完的繩結。5 例自動確保器墜地都是人為沒扣上，其中 1 死，3 人有 10 年以上經驗。非計畫的墜落練習（溝通不清）造成墜地與碰撞。官方明講「沒有通報義務，存在黑數」。 |
| S2 | https://www.alpenverein.de/.../kletterhallenunfallstatistik-2024 | 🟡 | 2024 年收錄 261 件（德國 220、奧地利 41），收錄門檻是「出動救護或已知住院」；抱石事故中 84% 是落墊。2024 年起納入 VKAÖ 的岩館。只讀了開頭幾段。 |
| S3 | https://www.alpenverein.de/verband/bergsport/sicherheitsforschung/kletterhallen-unfallstatistik | ✅ | 索引頁：DAV 與 KLEVER 自 2015 年起每年出版統計，現在約有 250 間岩館參與。 |
| S4 | https://bergsteigerbund.de/wp-content/uploads/2017/05/Panorama-6-2014-Sicherheitsforschung-Sicherungsfehler-Hallenklettern.pdf | ✅（PDF 轉文字） | DAV Panorama 6/2014〈Kampf dem Eisberg〉，作者 Hummel & Hellberg。2012 年的事故風險是每 1000 小時 0.023 件（相當於每週去兩次、每次 3 小時，要爬 100 年以上才會碰到一次）。2012 年岩館觀察研究：先鋒每次確保平均 1.4 個確保錯誤，頂繩平均 0.7 個。2012–13 年共 31 間岩館通報 161 件：先鋒 78%（其中至少 20% 在掛繩時）、下放 12%、頂繩 7%、墜落練習 3%。不含下放事故的墜地中，58% 是確保者的錯。約 20% 的入館者在抱石，但抱石佔通報事故 40% 以上。91 件繩攀事故中 45 件撞到地面，6 件傷及旁人。 |
| S5 | https://www.bergsteigen.com/news/neuigkeiten/wie-passieren-unfaelle-in-kletterhallen/ | ✅ | 轉述 S4 的數字，另外加上：用 Tube 的事故約佔 70%，但 2012 年只有約 60% 的人用 Tube；建議初學者用半自動確保器；最常見的錯誤依序是違反制動手原則、握繩不確實、制動手位置錯。 |
| S6 | https://www.alpenverein.de/artikel/sicherungsfehler-in-kletterhallen_3fca5a95-06c8-48de-bcfb-d80d31059b89 | ✅ | Schwiersch & Janotte，2018-09-14。DAV 觀察研究發現：「人們覺得自己被看著時，確保得比較好」。Partner check（Vieraugencheck，四眼檢查）起初被當成侵犯個人自主，現在已是常態。文章把介入分成 MUSS／SOLL／KANN 三級，各級都有例子和建議的開口方式，例如對沒綁好的人說「Stopp. Du bist nicht richtig eingebunden.」 |
| S7 | https://thebmc.co.uk/en/the-basics-climbing-indoors | ✅ | BMC 入門文：英國幾乎每個城鎮都有岩館；多數岩館要初學者先上入門課才能進場；「不會確保就老實說」；BMC 對未成年人的建議（16–17 歲要通過能力測驗；14–15 歲要測驗加家長到場；14 歲以下由經理決定）；抱石要互相 spot；互相檢查吊帶和繩結。這頁不是一份完整的禮儀清單。 |
| S8 | https://www.mountainproject.com/partner-finder | ✅ | 頁面顯示「There are 37,950 climbers in the Partner Finder」（2026-10-18 抓取）。可以依年齡、距離、各類型能領攀／跟攀的難度篩選。 |
| S9 | https://climbing.com/culture-climbing/43-ways-find-a-climbing-partner | 🟡（前 21 點） | Maya Silver，2025-10-31 更新。Instagram 投票超過 1,000 人：86% 在現實中認識繩伴，14% 在網路上。管道包括 Facebook 地區社團、MP Partner Finder／論壇、Oak app、岩館 meetup 與布告欄、上課或參加 clinic、到岩館工作等。 |
| S10 | https://climbing.com/skills/red-flags-in-a-belaytionship-8-signs-you-need-a-new-partner | ✅ | 2025-08-29。換繩伴的 8 個警訊：器材有問題或不肯做 partner check、不理會攀爬者的口令、確保時分心、故意 sandbag、一直 spray beta、做過讓人失去信任的事（例如制動手離繩）、決策一言堂、持續嘲諷。 |
| S11 | https://rei.com/blog/climb/6-ways-to-find-your-climbing-gym-community | ✅ | REI 2017-02-17。六個找岩館社群的方法：社群活動、課程（含女性班）、志工、上網（Facebook／Meetup／論壇，並提醒「跟網友上繩前先多問」）、布告欄、自己開團。 |
| S12 | https://cwapro.org/blog/what-makes-a-climbing-gym-a-third-place | 🟡（Exa 擷取前 6000 字） | CWA 部落格，2026-02-16，作者 Andrew Carter Smith（教練）。用 Oldenburg 的「第三場所」框架分析岩館：中立地帶、拉平階層、聊天是次要活動、規律性、像第二個家。文中也承認某些社會身分在岩館裡仍會被凸顯或被 tokenize。這是評論文章，不是研究。 |
| S13 | https://www.tandfonline.com/doi/abs/10.1080/02614367.2021.2006280 | 🟡（摘要） | Hewitt & McEvilly，2021，*Leisure Studies*。訪談 12 名 18–25 歲英國女性，用 Bourdieu 框架分析，歸納出三個主題：把攀岩看成男性場域、被威嚇感與自卑感、climbing capital。受訪者多半由男友或兄弟帶入門；社交面和成就感讓她們留下來。 |
| S14 | https://qspace.library.queensu.ca/items/3fbe57a2-45e6-4710-a674-de5edb756fea | 🟡（摘要） | Wigglesworth 博士論文，2021，女性主義民族誌：訪談 34 人，田野觀察兩年。摘要轉引 AAC 2019 State of Climbing：4.4% 的美國人在室內攀岩，女性約佔室內攀岩者一半。這是二手轉引，AAC 原報告沒有打開。 |
| S15 | https://thebmc.co.uk/your-climbing-counts | ✅ | BMC Your Climbing Counts 調查，2023-12 啟動，約 5,500 份有效回覆。最熱門的項目是室內抱石；最常見的入門方式是朋友帶，男女都一樣；近期才開始爬的人以女性居多；將近一半的人說「有固定繩伴」就會爬更多。 |
| S16 | https://www.theguardian.com/sport/2024/jan/25/brown-girls-climb-black-poc-rock-climbing | ✅ | Guardian 2024-01-25。Black Girls Boulder（2020-03，Tiffany Blount）、Blk Out Fest、Brown Girls Climb（執行長 Brittany Leavitt）。報導指出的進入障礙：岩館多開在富裕社區、費用高、比賽中的微歧視。 |
| S17 | https://voyagedenver.com/interview/daily-inspiration-meet-brown-girls-climb-colorado | ✅ | BGC 在 2016 年秋天由 Bethany Lebewitz 開 Instagram 帳號起家；2017 年春天在 D.C. 開始辦 meetup，5 月擴展到 Denver；由志工經營。 |
| S18 | https://www.outsideonline.com/outdoor-adventure/climbing/shelma-jun-women-climb/ | ✅ | Shelma Jun 在 2014 年創立 Flash Foxy。 |
| S19 | https://awomensthing.org/blog/flash-foxy-shelma-jun-founder-flash-foxy-womens-climbing-festival | ✅ | Flash Foxy 2014 年 4 月以 Instagram 起家（Brooklyn Boulders 的一群人）。Women's Climbing Festival 約在創立一年後的 6 月宣布；第一屆 300 人，候補 800 人，票一分鐘賣完。 |
| S20 | https://flashfoxy.com/about | 🔴 | curl 只抓到 1 byte，jina 被限流，firecrawl 沒連上。內容已由 S18、S19 覆蓋。 |
| S21 | https://en.wikipedia.org/wiki/Climbing_wall | ✅ | 1937 年比利時國王 Leopold III 委建的牆（出處是 Sebille《Bel'Wall》）；1939 年 Seattle 的 Schurman Rock；1964 年 Leeds 大學 Don Robinson 在走廊牆面嵌石頭；1987-05-16 布魯塞爾 Terres Neuves 是「世界第一間室內攀岩館」（Alpi-in 製牆，預鑽 T-nut 合板）；1987 年 10 月底 Vertical World 開始賣會籍，是北美第一間；1991 年 Sheffield 的 Foundry 是英國第一間商業岩館。 |
| S22 | https://climbingbusinessjournal.com/where-it-all-began-memories-from-americas-first-climbing-gym/ | ✅ | CBJ 2026-05-29，Rich Johnston 回憶錄。Vertical Club（現名 Vertical World）由 Johnston 與 Dan Cauthorn 在 1987 年創立；1987 年 10 月底開賣會籍，年費 $120；岩點是從 Joshua Tree 等地撿回來黏上去的石頭；開館初期不太受攀岩圈歡迎。按 CBJ 最新 Gyms & Trends，北美現有 900 間以上岩館。 |
| S23 | https://climbingbusinessjournal.com/gyms-and-trends-2024/ | 🟡（付費牆前） | 2024 年北美岩館數超過 870 間；新開岩館中 73% 是抱石館。 |
| S24 | https://climbingbusinessjournal.com/gyms-and-trends-2025/ | 🟡（付費牆前） | 2025 年北美新開岩館數比 2024 少；調查 240 間岩館，多數既有岩館的客流和營收持平或下滑；一位業者說「Boom times are over」。 |
| S25 | https://www.forbes.com/sites/michellebruton/2021/11/24/...tokyo-olympics-debut/ | 🟡（開頭段） | 東京奧運後攀岩的關注度和岩館會員數上升。只讀到開頭，後段的數字沒讀到。 |
| S26 | https://en.sports-tokyo-info.metro.tokyo.lg.jp/5yearsanniversary/voices/1 | ✅ | 東京都官方網站：約在 2016 年攀岩確定入奧時，日本全國岩館數增加到約 500 間；目前愛好者約 60 萬人。60 萬這個數字頁面沒有標年份。 |
| S27 | https://tupclimbing.tw/ ；https://tupclimbing.tw/branch/zhonghe | ✅ | 原岩官方：「原岩攀岩館於 2015 年 8 月成立，目前有 6 間分店」，分布在大台北和桃園。中和店是上攀館，挑高 15 m。 |
| S28 | http://kateberrysblog.blogspot.com/2021/02/rock-climb-generation-4.html | ✅ | 2021 年 Clubhouse 座談整理。舊時代岩館以蘭州街（LZS）為代表：1997 年中華山協把它改成國手訓練中心，2004 年由 STONE 團隊接手轉商業經營，2012 年熄燈。原岩 2015 年在楊梅開張（原名「頂呱呱攀岩館」），2017 年開萬華店，2020 年開中和店。原岩推動 new school 路線，岩館氛圍「從肅殺與怒吼轉成溫馨與社交」。文中出現「戰服妹」一詞。 |
| S29 | http://kateberrysblog.blogspot.com/2021/02/rock-climb-generation-6.html | ✅ | 台灣定線市場還養不起專職定線員；台灣路線已較少受性別和身材限制；台灣攀岩人口和岩場基數都小。 |
| S30 | https://atc0317.pixnet.net/blog/posts/10031696816 | ✅ | 2012-03-15 部落格，摘錄「台攀大事年表」：民國 86 年（1997）6/1 中華山協蘭州街會館改建為室內攀岩訓練中心；1999 年改為台北攀登俱樂部，開始對外營運；約 2005 年由現團隊接手，辦了 18 屆鳥蛋杯；2011 年底北醫抱石場關閉；「學生不再是攀岩消費主力」。 |
| S31 | http://kateberrysblog.blogspot.com/2018/12/stone.html | ✅ | 2018-12-25：STONE 攀岩場將歇業；蘭州街最後一夜是 2012-04-27。 |
| S32 | https://500times.udn.com/wtimes/story/12671/5886235 | ✅ | 500輯 2021-11-12：「早期全台僅有一間於 2004 年成立的蘭州街岩場」；「目前全台灣擁有攀岩設施的公營運動中心與民營岩館約 30 多間」。另引 Google Trends，2010–2021 年攀岩和抱石的搜尋熱度大幅上升。 |
| S33 | https://double8-y17.rezio.shop/ ；https://www.double8.com.tw/News/Detail?newsid=40 | ✅ | 業者自述 Y17（台北市青年局九樓）是「全台灣第一個室內攀岩場」。岩究所團隊從 2002 年起以公辦民營方式參與，2022-01-06 起直營。岩場高 12 m，10 條上攀道。岩究所大稻埕館 2018-02-25 開幕。頁面沒有寫 Y17 岩場的啟用年份。 |
| S34 | https://www.mcu.edu.tw/wnews/eteens/play/n009.htm | ✅（big5） | 銘傳學生報導：Y17 青少年育樂中心九樓的「巔峰戰士攀岩場」高 12 m、寬 18 m，使用法國進口岩板，是「全國室內最高」。中心在「今年 7 月」營業、12 月 22 日正式開幕，但文中沒寫年份。伺服器 Last-Modified 是 2010-08-16。 |
| S35 | https://city.gvm.com.tw/article/129387 | ✅ | DailyView 2026-04-14：「攀岩、抱石」網路聲量在 2025-03-20 到 2026-03-19 間有 180,826 筆，前一年是 58,104 筆（+211.2%）。Red Rock 紅石 2015 年成立。光合作用的「週五團練能交到朋友」、抱石基地的「館內客人互相指導」都是網友評價。2026 年 2 月圓石空間發生女童使用自動確保器墜落事件。 |
| S36 | https://climbingninjette.com/2026/09/26/first-time-climbing/ | ✅ | 依原岩館規與 REI 整理的台灣岩館禮儀七條：不站在攀爬者下方、不坐軟墊、軟墊上不放東西、輪流爬、要給 Beta 先問一聲、耳機音量開小、不穿岩鞋進廁所。原岩規定初次來館者要先學會「抱石安全墜落」。部落格作者是個人。 |
| S37 | https://sportmeow.com.tw/articles/rules-climbing/ | ✅ | 「全台目前收錄 62 座攀岩場」。這是 AI 協作編輯的頁面，「首次發布：原始紀錄待確認」，資料來自運動部登記的場館，日期不明。 |
| S38 | https://tupclimbing.tw/course/zhonghe/358 | ✅ | 原岩初階確保課（Top-Rope）：5 堂共 5,500 元，教 ATC＋Grigri，結業取得「原岩確保證」，有複習課。 |
| S39 | https://tupclimbing.tw/news/announcement/232 ；Keenable snippet: CBT 2019 簡章、山協 FB 2026 | ✅／🟡 | 中華山協「CBT 攀登確保能力檢測」：2023-05-20 在原岩中和辦，費用 1,200 元；2026 年場次在風城、Mega Stone。2019 簡章 PDF 只看到 snippet。 |
| S40 | https://news-secr.ncku.edu.tw/p/404-1037-98066.php | ✅ | 成大攀岩場由登山社和課外組共管，民國 100 年（2011）暑假完工，高 15 m；週一三五晚上開放，「也吸引許多校外人士」；文中提到 CBT 測驗。 |
| S41 | https://openchat.line.me/tw/cover/j71r_XNpPxJIUt4CWK9lTui2J5FaLeLUAbVw9pDuM0sjyZ2x-RpVAZug_t8 | ✅ | LINE 社群「攀岩抱石找繩伴&岩友」459 人（2026-10-18）；同頁推薦「螢光小苔蘚 - I人抱石揪伴閒聊」，約 62–65 人。 |
| S42 | https://sportz.im/the-little-rock-202203/ | ✅ | 動誌 2022-03-07：內湖小岩館在 2022-04-09／10 舉辦「國內首次女性專屬」女力攀岩嘉年華，李虹瑩出席；小岩館內湖店 2021 年開幕。 |
| S43 | https://www.merit-times.com.tw/NewsPage.aspx?unid=125160 | ✅ | 人間福報 2009-05-09：繩伴之間的口令「準備攀登／確保完成／開始攀登」，以及「繩伴關係」的信賴。 |
| S44 | https://www.airitilibrary.com/Article/Detail/P20101027006-200701-201010270003-51-60 | 🟡（摘要） | 王伯宇等，2007：台灣攀岩由日本引進，早期屬於登山技能；當時已有國家認可的攀岩證照，以及巡迴賽、大專盃。 |
| S45 | https://www.oft.com.tw/tech-detail/20/ | ✅ | 權衡國際（Entre-Prises 台灣代理）：1983 年 François Savigny 發明可移動的玻璃纖維樹脂岩塊；1985 年創立 Entre-Prises。內容沒有台灣岩館史。 |
| S46 | https://tupclimbing.tw/faq/introduction/116 | 🟡（snippet） | 「一個人可以去攀岩嗎？」可以：抱石館不需要確保，上攀館有自動確保器。 |
| S47 | https://www.tpenoc.net/sport/sports-climbing/ | 🟡（snippet） | 1983 Savigny、1986 第一場室內賽、1989 第一屆世界盃。curl 抓到的內容是空的。 |
| S48 | getdrillz / seclimbers / rockclimbingrealms 類的 partner vetting 文章 | 🔴／低品質 | seclimbers 用 curl 抓到 57 bytes；這類多是內容農場性質，改用 S10、S6 代替，不引用。 |
| S49 | https://www.washingtonpost.com/magazine/2021/05/19/... | 🔴 | 付費牆，curl 只抓到 1 byte。BGC 的資訊已由 S16、S17 覆蓋。 |
| S50 | BMC 女性參與頁、Researching Women in Mountaineering 2020（ray.yorksj.ac.uk） | 🔴 | 時間有限沒打開，見 Open questions。 |

### Findings by topic（依主題整理）

#### 1. 怎麼找繩伴

- **現實中認識還是主流。** Climbing.com 的 Instagram 投票（超過 1,000 人，不是科學抽樣）：86% 在現實中認識繩伴，14% 在網路上（S9）。BMC 2023 年調查（約 5,500 人）：最常見的入門方式是「朋友帶」，男女都一樣；將近一半的人說「有固定繩伴就會爬更多」（S15）。也就是說，缺繩伴本身就是讓人少爬的原因。
- **常見管道（英文圈）**（S9、S11）：
  - 線下：岩館 meetup、課程（含女性班）、布告欄、到岩館工作、攀岩組織的志工。
  - 線上：Facebook 地區社團、Mountain Project Partner Finder（2026-10-18 頁面顯示 37,950 人，S8）、MP 論壇、Oak app。
- **怎麼審核新繩伴**（S10、S11、S6）：
  - 先在岩館頂繩試過再出去。REI 的提醒是「跟網友上繩前先多問」。
  - Climbing.com 列的警訊：拒絕 partner check、確保時分心、制動手離繩、不理會口令、施壓或 sandbag、一直 spray beta、決策一言堂。
- **台灣的管道**：
  - LINE 社群（OpenChat），例如「攀岩抱石找繩伴&岩友」459 人、「I人抱石揪伴閒聊」約 65 人（S41）。
  - 岩館團練，例如光合作用週五團練，網友說能交到朋友（S35）。
  - 大學登山社、攀岩社：成大岩場由登山社管理，也有校外人士來爬（S40）；人物誌提到登山社轉型為攀岩社來吸引新生（Keenable snippet，hanchor 人物誌四）。
  - 女性團練社群，例如 Threads 上的「北區女子攀岩團練」（只有 snippet，🟡）。
  - Facebook 社團：⚪ 找不到可公開讀取的社團頁面，FB 社團需要登入。
  - 抱石不需要繩伴：原岩 FAQ 說「一個人就可以攀爬」，上攀可以用自動確保器（S46）。
- **台灣的確保資格制度**：岩館發的確保證，例如原岩初階確保課 5,500 元、結業取得「原岩確保證」（S38）；全國性的是中華山協「CBT 攀登確保能力檢測」（S39、S40）。英美大學和商業岩館也普遍有「belay test／certification」（Keenable snippets，🟡）。

#### 2. 繩伴安全與事故數據（DAV 為主）

- **基準風險**：2012 年每 1000 小時 0.023 件（S4）。
- **錯誤遠多於事故（「冰山」）**：2012 年觀察研究發現，先鋒每次確保平均 1.4 個錯誤，頂繩平均 0.7 個（S4）。
- **2012–13 年（31 館、161 件）**（S4、S5）：
  - 事故情境：先鋒 78%、下放 12%、頂繩 7%、墜落練習 3%。
  - 不含下放的墜地中，58% 是確保者的錯。
  - 用 Tube 的事故約佔 70%，但只有約 60% 的人用 Tube。
  - 抱石：約 20% 的入館者在抱石，事故卻佔 40% 以上，不過傷勢較輕。
- **2025 年（德國＋奧地利，252 件符合收錄門檻）**（S1）：
  - 抱石 174 件、繩攀 68 件。
  - 繩攀墜地 31 次，15 次發生在下放，其中 12 次是繩子在確保器裡失控滑動。
  - 綁繩錯誤造成墜地，包括做了 partner check 還漏看繩結的案例。
  - 非計畫的墜落練習因溝通不清造成墜地和碰撞，報告建議事先講好，並用輔助器材處理體重差。
  - 自動確保器墜地 5 例全是「沒扣上」，1 死。
- **2024 年**：收錄門檻不同（出動救護或已知住院），收錄 261 件（S2）。不同年份不能直接比較。
- **文化面**：DAV 主張旁觀者應該開口指出確保錯誤，分 MUSS／SOLL／KANN 三級；觀察研究顯示「被看著時確保比較好」；partner check 從被當成侵犯自主變成常態（S6）。
- **台灣**：2026 年 2 月高雄圓石空間有女童使用自動確保器墜落，業者道歉並把設備送回原廠檢修（S35）。這是二手轉述，原新聞沒打開。
- **CWA（美國）事故資料**：⚪ 這次沒找到公開的 CWA 室內事故統計。搜尋用過 Keenable 的 "CWA incident data" 類查詢，Groundlane、firecrawl、linkup 都無法用。BMC 有線上事故通報系統 incidents.thebmc.co.uk，只看到一筆搜尋結果，🔴 沒有系統性整理。

#### 3. 禮儀與岩館文化

- **台灣**：原岩館規要求新手先學會安全墜落、不坐軟墊；部落格整理了七條禮儀（S36）。「給 Beta 先問一聲」在中英文資料都出現。
- **英文圈的共通點**（Keenable snippets，🟡；S10）：不站在落地區、輪流爬、不 spray beta、耳機音量開小、不穿岩鞋進廁所。
- **beta spraying 與性別**：有評論和部落格把不請自來的 beta 和針對女性的指導連在一起，例如 DU 的〈Unsolicited Advice: The Toxic Effects of Beta-spray〉、Medium 文章。🟡 沒有找到同儕審查的研究。
- **岩館是「第三場所」**：CWA 的評論文用 Oldenburg 框架，說法是休息時的聊天才是關係成形的地方（S12）。學術研究方面，S13（英國年輕女性）發現社交面是讓人留下來的主因。台灣方面，kate4 描述原岩之後岩館從「肅殺」轉向「溫馨與社交」（S28）。
- **性別、平權與包容**：
  - Flash Foxy：2014 年創立，Women's Climbing Festival 第一屆 300 人（S18、S19）。
  - Brown Girls Climb：2016 年秋天創立，2017 年開始辦 meetup（S17）。
  - Black Girls Boulder：2020 年創立；Blk Out Fest（S16）。
  - 岩館多開在富裕社區、費用門檻高（S16）。
  - 英國攀岩者以男性、白人為主，但近期入門者多為女性（S15）。
  - AAC 2019：女性約佔美國室內攀岩者一半（S14 轉引）。
  - 台灣：2022 年小岩館辦「國內首次女性專屬」嘉年華（S42）；路線已較不受性別和身材限制（S29）。

#### 4. 岩館史

- **世界**：
  - 1937 年比利時國王委建的牆、1939 年 Seattle 的 Schurman Rock（S21）。
  - 1964 年 Leeds 大學 Don Robinson 的走廊牆，是現代人工岩壁的起點（S21）。
  - 1983 年 Savigny 發明可移動岩塊，1985 年創立 Entre-Prises（S45、S47）。
  - 1987-05-16 布魯塞爾 Terres Neuves 開幕，被稱為第一間室內攀岩館（S21）。
  - 1987 年 10 月底 Seattle 的 Vertical Club 開幕，是美國第一間商業岩館（S21、S22）。
  - 1991 年 Sheffield 的 Foundry 開幕（S21）。
- **奧運之後**：
  - 北美 2024 年超過 870 間，新開岩館中 73% 是抱石館（S23）；2026 年有 900 間以上（S22）；2025 年新開數下滑、市況轉冷（S24）。
  - 日本約在 2016 年增加到約 500 間（S26）。
  - 東京奧運後關注度和會員數上升（S25，🟡）。
- **Mountain Training 的 CWI**：現在的 Climbing Wall Instructor 前身是 Climbing Wall Award（Keenable snippet，🟡）。⚪ MT 沒有找到專門寫「history of climbing walls」的公開頁面。
- **台灣**：
  - 攀岩由日本引進，早期屬於登山技能（S44）。
  - Y17（台北市青少年育樂中心九樓，12 m）業者自稱「全台第一個室內攀岩場」，但啟用年份不明（S33、S34）。
  - 蘭州街：1997 年中華山協把會館改成訓練中心；1999 年（S30）或 2004 年（S28、S32）開始商業對外營運；2012-04-27 關閉，搬到新莊成為 STONE（S30、S31）；STONE 2018 年底歇業（S31）。
  - 2011 年成大室外岩場完工；2011 年底北醫抱石場關閉（S30、S40）。
  - 2015 年：原岩（8 月，原名頂呱呱攀岩館，在楊梅）、Red Rock 紅石成立（S27、S28、S35）。
  - 2018 年岩究所大稻埕館（S33）、2021 年小岩館內湖（S42）。
  - 數量見 Conflicts。

### Conflicts（衝突，列出不裁決）

1. **原岩成立年份**：任務提示寫「2012?」；原岩官網是「2015 年 8 月」（S27）；kate4 說「2015 年於楊梅開張，原名頂呱呱攀岩館」（S28）。沒有任何來源支持 2012。2012 年是蘭州街熄燈的年份（S28、S31），可能是記混了。
2. **蘭州街開始商業營運的年份**：pixnet 年表說 1999 年改為台北攀登俱樂部對外營運（S30）；kate4 說 2004 年 STONE 團隊接手轉商業（S28）；500輯 說「2004 年成立的蘭州街岩場」，而且「早期全台僅有一間」（S32）。另外，1997 年中華山協改建的說法 S28 和 S30 一致。
3. **台灣第一間室內岩場**：Y17 業者自稱「全台第一」（S33）；500輯 說早期全台只有蘭州街一間（S32）。Y17 的啟用年份不明（S34 頁面沒寫年份），所以無法比對先後。
4. **台灣岩館數量**（定義不同）：
   - 500輯 2021：「約 30 多間」，含公營運動中心（S32）。
   - 運動喵：「62 座攀岩場」，日期不明，資料來自運動部登記的場館（S37）。
   - 七分之二：精選 26 間（Keenable snippet），這是推薦清單，不是普查。
5. **世界第一間攀岩館**：Wikipedia 說是 Terres Neuves 1987-05（S21）；CBJ 說 Vertical Club 是美國第一間商業岩館，並說「歐洲當時已有附屬在大學或健身房的攀岩區」（S22）。兩者時間相差約 5 個月，「第一」的定義也不同（獨立商業館或附屬設施）。
6. **DAV 歷年數字的收錄門檻不同**：2012–13 年是「出動救護車」；2024 年是「出動救護或已知住院」；2025 年是「出動救護或至少中度傷」。2024 年起又加入奧地利。不同年份不能直接比較（S1、S2、S4）。

### Taiwan terminology（台灣用語）

| 用語 | 意思／出處 |
|---|---|
| 繩伴 | climbing partner（上攀時的搭檔），S43、S41 |
| 繩伴關係 | 繩伴之間的互信與互動，S43；英文圈戲稱 belaytionship（S10） |
| 確保／確保者／確保夥伴 | belay／belayer／belay partner，S37、S38 |
| 確保證 | 岩館發的確保資格，例如「原岩確保證」，S38 |
| 持照上攀 | 有確保證才能自己上攀，S33 |
| CBT 攀登確保能力檢測 | 中華山協的全國性確保能力檢測，S39、S40 |
| 岩友 | 攀岩同好，S41、S35 |
| 揪團／揪伴 | 找人組團、找人一起爬，S41 |
| 團練 | 岩館或社群定期的團體練習，S35、S42 |
| 給 Beta／Beta | 爬法提示；「要給 Beta 先問一聲」，S36 |
| 抱石安全墜落 | 原岩館規裡的落地教學，S36 |
| 自動確保器 | auto belay，S1、S35 |
| 上攀／頂繩（Top Rope）／先鋒 | top rope／lead，S27、S38 |
| 準備攀登／確保完成／開始攀登 | 中文的確保口令，S43 |
| old school／new school 路線 | 舊時代、新時代的定線風格，S28 |
| 戰服妹 | 穿運動內衣加緊身褲的女性岩友，屬社群俚語，S28 |
| 鳥蛋杯／鳥蛋盃 | 蘭州街時期的社群比賽，S30、S31 |
| 舊時代岩館／新時代岩館 | S28 |

### Open questions（未解決問題）

- **Y17 攀岩場的啟用年份** ⚪：試過 Keenable 多組關鍵字，也讀了 MCU 報導和 double8 頁面，都沒寫年份。可能需要查台北市青年局的沿革，或寫信問 ✉️ 岩究所或青年局。
- **台灣岩館數量的權威普查** ⚪：只找到 500輯 的「約 30 多間」（2021）和運動喵的 62 座（日期不明）。沒有協會或主管機關的年度統計，試過 Keenable 的「台灣 抱石館 數量」等查詢。
- **台灣岩館事故統計** ⚪：沒找到公開統計，試過 Keenable，Groundlane、firecrawl、linkup 都無法用。圓石空間的事件只有媒體二手轉述。
- **CWA（美國）室內事故統計** ⚪：沒有公開資料。可能 ✉️ 只能寫信問 CWA。
- **Mountain Training 的「history of climbing walls」** ⚪：這次沒找到對應的公開教材頁，CWI 教材可能只發給學員。
- **AAC State of Climbing 2019 原報告**（4.4%、女性約一半）：🟡 目前只有二手轉引，還沒打開原報告，建議補查。
- **Forbes 2021 的會員成長數字**：🟡 只讀到開頭，建議補讀。
- **英國女性攀岩相關報告**（BMC women 頁、Researching Women in Mountaineering 2020）：🔴 還沒打開。
- **台灣 Facebook 攀岩社團**：需要登入才能讀，無法核實名稱和人數。

---

