# 研究筆記：攀岩賽事與職業攀岩（K 模組）

研究日期：2026-10-18（所有來源存取日期皆為 2026-10-18）。用途：`.work/series-plans/climbing-competitions.md` 的依據。
細節與原文引述在下方附錄 A–D（由四個研究 subagent 產出，主筆已跑過缺口盤點與補查）。原始擷取檔放在 session scratchpad（`k-research/rawA`、`pdfA`、`dl/`），不入庫；寫稿時以本檔的 URL 重新打開。

圖例：✅ 讀過一手或近一手來源全文（附 URL＋原文）｜🟡 只有二手來源｜⚪ 查過確認無公開資料（列出工具）｜✉️ 只能寫信問｜⚠️ 易變事實

## toolDegradation

Groundlane MCP 未連線；Groundlane 直接 HTTP 回 401／403；linkup 404；jina、firecrawl、cloudflare MCP 未連線。實際使用：Keenable keyless（搜尋主力）、Exa `web_fetch_exa`（抓頁）、curl＋pdftotext（World Climbing PDF、la28.org、paralympic.org、ita.sport）、web.archive.org（olympics.com 直連逾時時）。You.com 未用到。

## 核心結論（寫稿前必讀）

1. **IFSC 已更名 World Climbing**：會員大會 2023-10 通過、品牌 2025-12-10 啟用、2026-07-23 臨時大會完成法定更名。IFSC World Cup 自 2026 年由「World Climbing Series」接替（13 站）。文章一律寫「World Climbing（前 IFSC）」。（附錄 A §2a、§6）
2. **現行規則文件**：Competition Rules v3（2026-01，四年一版）、Event Regulations v3（2026-01，兩年一版）、Amendments & Errata（2026-04-01）。（A §1a）
3. **抱石 2025 改制**：完攀 25 分、單一 Zone 10 分，每次失敗嘗試扣 0.1；同分先回溯上一輪、再比嘗試次數。準決賽 24 人、決賽 8 人（2024 年以前 20／6，舊制是 Top→Zone→嘗試次數的字典序）。（A §1b、D §3）
4. **先鋒**：最高控制點計分，往下一點有推進動作加「+」；每條 6 分鐘；資格賽 2 條取名次幾何平均；同分回溯，獎牌位置仍同分比攀爬時間。準決賽 24、決賽 8。（A §1c）
5. **速度**：15.00 m、5° 外傾（容差 4.5–6.5°）標準路線（Speed Licence Rules ✅，D §6）；反應時間 <0.100 秒算犯規；**2026 年四道速度首度上世界系列賽**，資格賽每人 4 跑、決賽 32 人、獎牌戰四人同場。（A §1d）
6. **抱石＋先鋒複合項目 2026 年已不再使用**；巴黎 2024 的複合是每項 100 分（抱石有低／高兩個 Zone：5／10 分，與 2025 世界盃的單一 Zone 不同）。（A §1f、D §1）
7. **奧運**：東京 2020 三項全能、名次相乘、男女各 1 金（López／Coleman／Schubert；Garnbret／野中生萌／野口啓代）；巴黎 2024 速度＋抱石先鋒複合，4 金（Garnbret、Toby Roberts、Mirosław、Veddriq Leonardo）；**LA28 6 金、76 人**，抱石／先鋒男女各至少 12 人、速度男女各 14 人，Long Beach，2028-07-24～29。資格：2027 年各資格賽約 50% 名額（Brno 世錦賽 2027-08-13～22、洲際賽、歐運、泛美運），其餘 2028 OQS。（A §2e、§3、D §1–2）
8. **帕拉攀登確定進 LA28 帕運**（IPC 2024-06-26 核准）：8 個獎牌項目、80 人，2028-08-15～27。現行運動等級 B1–B3、AU2、AU3、AL1、AL2、RP1–RP3。官方文件有矛盾待釐清（見下）。（A §4）
9. **反禁藥**：World Climbing 是 WADA 簽署方，執行委託 ITA；行蹤申報 12 個月內 3 次失誤可禁賽 2 年；ITA 公開清單目前只有一個攀岩案（伊朗 Kolasangian，類固醇，禁賽 4 年）。REDs 健康篩檢對系列賽選手強制。（A §5）
10. **年齡**：2025 年起成人組最低年齡 16→17（以出生年表呈現，明文措辭只在 Climbing NZ）；2026 Open＝2009 年或更早出生；青年世錦賽只辦 U17、U19（U21 只在年齡表）。（A §2d、D §4）
11. **亞運 2026（愛知・名古屋）已辦完**：2026-09-29～10-03，Portmesse Nagoya，六個單項、無複合、速度四道。**中華台北沒有出賽**：姚廷蓁、林嘉翔、范植恩已取得配額，運動部訓輔會 6/26 以未達亞運參賽標準決定不派；姚廷蓁公開說截止後才得知。爭議中，寫要兩面並陳。（附錄 B §1.3）
12. **台灣全運會、全民運、全中運目前都沒有運動攀登**（114 全運規程、113 全民運規程 ✅；115 全民運、114 全中運以官網搜尋判定，屬推測無）。課綱原本寫「全運會」是錯的前提。實際管道：山協主辦、岩館承辦的全國錦標賽（甲組算國手積分）、全國青少年錦標賽（教育部核定運動績優甄試資格）、大專盃、縣市運動會、岩館業餘賽（如原岩火箭盃）。（B §2）
13. **日本**：東京 2 銅銀、巴黎安樂宙斗銀；世界盃年度總冠軍日本男子 14 次、女子 8 次（Wikipedia 彙整，連到官方成績）；三個 Japan Cup 兼國手選拔；葛飾東金町 2022 年列國家訓練中心攀岩據點；岩館數 2019 年 500+、2021 年約 800（二手轉述 JMSCA）。**「為什麼強」只有評論者說法，沒有研究**，文章要寫「誰說的」。（B §3）
14. **World Climbing 以外的比賽**：Rock Master Arco（1986 起，2026 年第 40 屆）；Psicobloc Masters（Park City 2013–2019，現於西班牙 A Coruña 續辦）；Red Bull Creepers、Red Bull Dual Ascent（2022–2024，之後未見）；Melloblocco（2019 停、2023 復辦、2026-05 有辦）；Hueco Rock Rodeo 2024 後 AAC 停辦；**Pro Climbing League** 2026-02 倫敦首辦，2027 年 3 站各 £50k。（附錄 C §1）
15. **職業攀岩**：9c 五條提案、DNA（Bouin）2026-10-10 被 Schubert 重複成為首條確認的 9c；Silence 仍無人重複；無 9c+ 提案。9A 抱石 14 條＋Exodia（2025-11 首條 9A+ 提案）。女性：兩次 9b+（Raboutou 2025、Garnbret 2026），最難抱石 8C+（Katie Lamb），尚無女性 9A（此點證據較弱）。獎金：World Climbing 2026 總獎金 €850k，每個獎牌項目 €20k 分給前八、冠軍 €6,000；贊助多為裝備；**無系統性收入調查** ⚪。（C §2–3）

## 易變事實（發文前必重查）⚠️

- 速度世界紀錄：男 4.54（趙一程，2026-05-10 吳江）；女 5.99（Emma Hunt，2026-07-04 克拉科夫）；接力 9.58（重慶預告寫 9.75，矛盾）。2026 聖地牙哥站 10/23–25 尚未比。
- 2026 系列賽年度總冠軍（季末才確定）。
- 9c／9A／女性最高等級清單，含降級與重複。
- 2027 賽程、LA28 OQS 地點（未定）、帕運賽程細節。
- 台灣全國賽成績（2026 全國抱石錦標賽 10/17–18 剛比完）、全國紀錄（林嘉翔 2022 年 6.183 秒可能已被刷新）。
- 116 年全運會（屏東）35 種競賽種類是否含攀岩：⚪／✉️ 運動部競技運動司或屏東縣府。

## 官方來源互相矛盾（列出不選邊）

- 選手名冊仍有 4 人掛舊等級 AU1（現行等級表沒有 AU1）。
- LA28 帕運賽程寫「女子 B1」，項目列表寫女子 B2。
- 奧運賽程「男子速度決賽」列兩次。
- 速度接力紀錄 9.58 vs 9.75。
- Lead Japan Cup 首屆 1987 vs 1988。
- Rock Master 2026 的三份報導之一，前一年冠軍寫錯（附錄 C）。

## 待解問題

- ⚪ 2027 年規則變更：未見公告。
- ⚪ 2025→2026 Event Regulations 逐條差異：找不到 2025 年版 Event Regulations。
- ⚪ IOC 官方 LA28 資格制度 PDF 未逐條讀（olympics.com 抓取失敗）；數字以 World Climbing 新聞稿為準。
- ⚪ 日本為何強的學術研究：英日文搜尋未見；可再用 J-STAGE 補查。
- ⚪ 攀岩職業選手收入調查：查無。
- ✉️ 中華民國山岳協會《國家代表隊選手遴選實施準則》與巡迴賽積分辦法原文：問山協運動攀登部。
- ✉️ 2021 年 JMSCA 岩館數原始資料：問 JMSCA。

## 修正課綱與任務前提

- 「全運會」沒有攀岩 → 台灣篇改講山協全國賽、青少年賽、大專盃、縣市賽、岩館賽。
- 帕拉攀登在 LA28 帕運（原以為不在）。
- 「Halenke Project Big」是誤記，實為 Schubert〈B.I.G.〉；Rogora 最高為 9b/+；Box Therapy 已降為 8C；查無「USA Climbing Pro」聯賽；「PCA」不是選手工會。
- 不要引用 SEO 站的收入數字（例：「世界盃冠軍 $100k」），也不要引用 Threads 上 Meta AI 的「台灣首面亞青金牌」說法。

---

# 附錄 A：A-rules-olympics

### A — 競技攀登規則、賽事體系、奧運／帕運、反禁藥（研究筆記）

- 研究日期／所有來源存取日期：**2026-10-18**
- 範圍：只做研究，沒有動 repo 檔案。原始擷取放在 `k-research/rawA/`（HTML 轉文字）和 `k-research/pdfA/`（PDF 轉文字）。
- 圖例：✅ 讀過一手來源全文（附 URL＋原文引述）・🟡 只有二手來源（已註明）・⚪ 查過確認沒有公開資料（列出試過的工具）・⚠️ 易變事實（紀錄、賽程）或來源互相矛盾

### toolDegradation（工具降級紀錄）

| 工具 | 結果 |
|---|---|
| Groundlane MCP（`mcp__claude_ai_Groundlane__web_search`） | 已用 ToolSearch 載入；呼叫時回「MCP server … is not connected」 |
| Groundlane 直接 HTTP（POST `/mcp`） | 用 curl 打第一次成功（回了一組搜尋結果），之後都是 HTTP 401 / 403（Python UA 被擋） |
| Keenable keyless API | ✅ 正常，**作為主要搜尋工具** |
| You.com keyless | 沒用到（Keenable 已經夠用） |
| Exa `web_fetch_exa` | olympics.com 回 CRAWL_LIVECRAWL_TIMEOUT |
| jina `read_url` | 「MCP server not connected」 |
| firecrawl `firecrawl_scrape` | 「MCP server not connected」 |
| linkup | 404 server not found |
| curl（瀏覽器 UA）＋ pdftotext ／ python -I 轉 HTML 成文字 | ✅ **作為主要抓取工具**。worldclimbing.com、images.ifsc-climbing.org、paralympic.org、la28.org、ita.sport 都抓得到；ifsc-climbing.org 子網域逾時（改用 worldclimbing.com 同路徑）；olympics.com 逾時（改用 World Climbing 官方的奧運頁） |

---

### 1. 2026 年現行計分與賽制

#### 1a. 現行規則文件 ✅
- **Competition Rules v3（2026 年 1 月）**：https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/jaq7awz9jmqwpddwnbpr.pdf ，23 頁，全文已讀。文件署名「World Climbing 2025 Rules Commission … Authors Tim Hatch」。
  - 原文引述：「World Climbing plans to publish the competition rules in stable form on a quadrennial basis.」
- **Event Regulations v3（2026 年 1 月）**：https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/brsjsyh2ea4fxinl8nsa.pdf ，44 頁。附件 A 是先鋒、B 是個人速度、C 是抱石、D 是團體速度。
  - 原文引述：「World Climbing plans to publish these regulations in stable form on a biennial basis.」
- **Amendments & Errata（2026-04-01）**：https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/colytv4c7oabpqnyepsi.pdf 。內容只是小幅修字：速度附件 B §4.5、附件 D §2.3／§4.6／§6.3，以及 Eligibility Code §3.3 新增 2026 年的豁免條款。

#### 1b. 抱石（2025 年起改為積分制；2026 年規則沿用）✅
- Event Regs 附件 C §5.1 原文：「(A) where the boulder judge has awarded a Zone, as 10 points, with a deduction of 0.1 points for each attempt made before the Zone is awarded, (B) where confirmed by the boulder judge as successfully completed, as 25 points, with a deduction of 0.1 points for each unsuccessful attempt. The final score for a boulder will be the greater of the value calculated under (A) or (B), and 0.0」
- 排名（§7.1）原文：「ranked in descending order of the total number of points … Scoring ties will be broken successively as follow: A) … count-back to the General Ranking after the preceding round … B) in ascending order of the total number of attempts made on those boulders successfully completed. C) in ascending order, the total number of attempts made for the Zone points awarded.」
- 賽制（附件 C 表 1）：
  - 資格賽：5 條、on-sight、每輪固定 5 分鐘、名額「60 (group)」
  - 準決賽：4 條、固定 5 分鐘、取 **24 人**
  - 決賽：4 條、每條「4’ (max)」、取 **8 人**
  - 決賽前有「collective observation period of 2 minutes per boulder」（集體看線，每條 2 分鐘）
- 2025 年改制公告（2025-03-05）✅ https://worldclimbing.com/news/new-rule-changes-take-effect-for-ifsc-world-cup-series-2025
  - 原文：「A points tally will comprise of 25 points for a Top and 10 points for the single zone on each boulder, with 0.1 points deducted for every unsuccessful attempt. As an example, a climber may score 25 points for a flash, but 24.9 points for finishing the boulder on their second attempt.」
  - 原文：「Boulder will now align with the Lead discipline with 24 semi-final places available, and eight for the final round.」
  - 原文：「The previous number of Lead semi-finalists was 26.」
  - 原文：「All changes are a result of years of SWOT analysis which began in 2022.」
- **2024 年以前的舊制**（2024 年 Rules v1.01）✅ https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/z0nsb2xbnd773wnwznnz.pdf §8.19 原文：「1) in descending order, the number of … ("Tops"); 2) in descending order, the number of boulders on which the competitor has … Controlled … the Zone Hold … ("Zone Points"); 3) in ascending order, the total number of attempts to achieve these Tops; 4) in ascending order, the total number of attempts to achieve these Zone Points」
  - 決賽同分的處理（§8.20B）：比第 1 次嘗試完攀的條數、再比第 2 次…，接著用同樣方式比 Zone。
  - 寫文章時可以這樣講：舊制是 T／Z／嘗試次數的字典序排名，2025 年改成單一分數。
- 2024 年前抱石準決賽／決賽的人數（20／6）🟡：2025 年公告只寫「will now align … 24 … eight」，沒寫舊的人數。20／6 是一般常見說法，**本次沒有核實**；舊制 PDF 第 1467–1482 行寫的是依報名人數浮動的名額，沒有直接寫出固定數字。

#### 1c. 先鋒 ✅
- Competition Rules §9.1 原文：「The result of an unsuccessful attempt in lead will be last scoring hold Controlled with the hands to: A) complete an Establishing Movement, or B) make an Advancing Movement. If a hold is Controlled to make an Advancing Movement, the result will be marked with the postfix "+".」
- §9.2 原文：「No postfix "+" may be awarded where an attempt has ended unsuccessfully under §8.2.」§8.2 列的是：clip 錯順序、拆掉快扣、越過最後安全位置。
- §8.3 原文：「An attempt in lead will be ruled successful if a climber clips the final anchor on the route.」
- §6.3：每次嘗試的攀爬時間「should not exceed 6 minutes」。
- 賽制（附件 A 表 1）：
  - 資格賽：2 條、Flash、6 分鐘、名額「80 (group)」
  - 準決賽：1 條、On-Sight、6 分鐘、取 **24 人**
  - 決賽：1 條、On-Sight、6 分鐘、取 **8 人**
- 資格賽計分（§7.2）：兩條路線名次的幾何平均。原文：「QP = ⁿ√∏ Pr … (i.e., lower Qualification Points is better)」
- 準決賽／決賽同分（§7.3）原文：「A) … count-back to the General Ranking after the preceding round … B) in the scheduled medal phase only, breaking podium ties remaining after countback by using actual climbing times, lower times being better.」

#### 1d. 速度 ✅
- 起跑犯規（Competition Rules §7.3）原文：「A start will be judged invalid (i.e., a False Start) if a climber's recorded Reaction Time is less than 0.100s.」
- 犯規的處理（Event Regs 附件 B §5.1）原文：「in a qualification round race, the race will continue without a recall signal and the race result recorded … in a tournament bracket race, the starter will stop the race.」
- 賽制（附件 B 表 1）：
  - 資格賽 2 條或 4 條（Speed 2／Speed 4）、After-Work。原文：「each competitor is scheduled to make one attempt on each lane」
  - 決賽採淘汰賽，取 32／16／8／4 人（32 人只用於 Speed 4）
  - Speed 2 原文：「single elimination tournament … losers of [semi-final] heat will advance to race for 3rd and 4th place (the small final)」
- 資格賽排名（§8.2）：用最佳成績排名；同分時比下一個成績，依序是 Valid Time → Fall → False Start → Not Started。
- 計時（§7.1–7.2）原文：「measured and recorded to the nearest 1/1000s … Official times, including record times, will be rounded down to the nearest 1/100s.」
  - 註解舉例原文：「measured time of 4798ms … Official Time (and World Record) of 4.79s. Breaking this record would require … 4789ms or better.」
- **四道速度（Speed 4）2026 年首次上世界賽** ✅
  - https://worldclimbing.com/news/four-lane-speed-era-begins-in-krakow （2026-07-03）原文：「The expanded format saw each athlete race four times, with all runs counting towards the qualification ranking. It also increased the size of the final bracket, with the top 32 climbers advancing」
  - 克拉科夫賽報原文：「a single medal race that decided all four final positions simultaneously.」
  - 接力與混合接力（附件 D）2026 年在克拉科夫、貴陽、重慶舉行。
- 標準路線 🟡：Event Regs 只寫「specification set out in the World Climbing Speed Licence Rules (Speed Walls)」；2024 年 Rules 寫「time needed to climb a standard route」。
  - 15 m、5° 前傾、1.5 m 見方面板這些數字來自 Wikipedia「Speed climbing wall」，原文：「The wall must overhang continuously with an angle of 5°」。
  - Speed Licence Rules 的 PDF 不在 /resources/competitions 列表裡（已下載並辨識全部 27 份 PDF），docslib 上有舊副本但未讀。**狀態：規格數字只有二手來源**；要一手來源可寫信問 World Climbing Sport Department（office@worldclimbing.com）✉️。

#### 1e. 速度世界紀錄 ⚠️（截至 2026-10-18）
| 項目 | 成績 | 選手 | 日期／地點 | 一手來源 |
|---|---|---|---|---|
| 男子 | **4.54** | 趙一程 Zhao Yicheng（中國，16 歲） | 2026-05-10 吳江世界攀登系列賽，準決賽對 Watson | ✅ https://worldclimbing.com/events/world-climbing-series-wujiang-2026/news/zhao-breaks-world-record-on-way-to-gold 原文：「Zhao clocked a 4.54s to Watson's 4.67s.」2026-09-17 重慶預告仍稱「China's Yicheng Zhao's world best time of 4.54s」 |
| 女子 | **5.99** | Emma Hunt（美國） | 2026-07-04 克拉科夫（四道），八強賽 | ✅ https://worldclimbing.com/events/world-climbing-series-krakow-2026/news/hunt-makes-history-watson-and-kusuma-dewi-take-speed-golds-in-krakow 原文：「Hunt lowered the world record to 5.99 in her quarter-final, becoming the first woman ever to complete the Speed route in under six seconds.」 |
| 男子接力（2 人） | **9.58** | 凌永志／趙一程（中國）；美國隊在重慶追平 | 2026-09-13 貴陽；2026-09 重慶 | ✅ 貴陽原文：「The pair each clocked 4.79 seconds, combining for 9.58 to lower the previous record of 9.75」；重慶原文：「equalled the world record with 9.58」 |

紀錄演進（寫歷史段落用）：
- Watson 4.64（2025-05 峇里）
- 趙一程 4.58（2026-04 亞洲沙灘運動會，三亞）🟡 來自 olympics.com 搜尋摘要
- 趙一程 4.54（2026-05 吳江）
- 女子：Mirosław 6.06（巴黎 2024 資格賽）✅ 原文：「With a world record 6.06s from qualification」→ 6.03（2025 年首爾世錦賽）✅ olympics.com 和 worldclimbing 搜尋摘要；worldclimbing 原頁網址：worldclimbing.com/events_old/…/miroslaw-breaks-world-record… → Hunt 5.99（2026-07）

⚠️ 來源矛盾：重慶預告寫接力紀錄是「9.75s」，但同一網站的貴陽賽報寫 9.58 打破 9.75。**以貴陽賽報為準。**
⚠️ 易變：本季還有聖地牙哥站（10/23–25）可能破紀錄，發文前要重查。

#### 1f. 抱石＋先鋒複合項目
- **巴黎 2024 奧運的賽制**（🟡 Gripped 2024-08-04 https://gripped.com/indoor-climbing/how-is-climbing-scored-at-the-paris-olympics ）：
  - 抱石每條 25 分（low zone 5、high zone 10、top 25，每次失敗扣 0.1）
  - 先鋒 100 分：最後 10 個點每點 4 分、往下 11–20 點每點 3 分、21–30 點每點 2 分、31–40 點每點 1 分，抓到點後往下一點移動算 +0.1
  - 原文：「Climbers compete for up to 100 points in both Boulder and Lead.」
- 一手側證 ✅ Roberts 金牌賽報：「63.1pts from Boulder and his 92.1pts climb in Lead for a total of 155.2pts」
- **2026 年已不再使用**：
  - Event Regulations v3 的附件只有 Lead／Speed／Boulder／Team Speed，沒有 B&L 附件。Competition Rules 只在一段 guidance note 提到「lead stage of the boulder&lead discipline」。
  - 2026 賽程表沒有 B&L 項目。
  - 首爾 2025 世錦賽的獎牌只有 6 項（B／L／S × 男女）。
  - LA28 改成三項分開比。

---

### 2. 賽事類型

#### 2a. 世界盃 → 「World Climbing Series」✅
- https://worldclimbing.com/news/world-climbing-launches-new-global-identity （2025-12-10）原文：「The visual identity will be rolled out throughout the 2026 season, anchored by the launch of the new World Climbing Series, which will succeed the IFSC World Cup.」
- 國家名額（2025-12-16）✅ https://worldclimbing.com/news/world-climbing-series-2026-quotas-confirmed-for-national-federations 原文：「two athletes per medal event as a base allocation … up to a maximum of six per medal event」
- 世界排名積分：Event Regs §7.10–7.12。

#### 2b. 世界錦標賽 ✅
- **首爾 2025**（第 19 屆，2025-09-21～28）
  - 先鋒原文 ✅ https://worldclimbing.com/events/ifsc-climbing-world-championships-seoul-2025/news/lee-and-garnbret-take-lead-world-titles ：「South Korea's Lee Dohyun won his first world title in his hometown of Seoul taking the men's Lead title as Janja Garnbret took her third women's Lead gold.」
  - 抱石原文 ✅ https://worldclimbing.com/events/ifsc-climbing-world-championships-seoul-2025/news/anraku-wins-world-title-in-more-last-gasp-gold-drama ：「The new champion won with a score of 99.2pts, Schalck took silver with 84.5pts, and Lee took bronze with 84.2pts.」
  - 獎牌表 🟡 Wikipedia：
    - 男子先鋒：Lee Dohyun／吉田智音 Yoshida Satone／本間大晴 Homma Taisei
    - 男子抱石：安樂宙斗 Anraku Sorato／Mejdi Schalck／Lee Dohyun
    - 男子速度：龍建國 Long Jianguo／Leander Carmanns／Zach Hammer
    - 女子先鋒：Janja Garnbret／Rosa Rekar／Seo Chae-hyun
    - 女子抱石：Janja Garnbret／Oriane Bertone／Melina Costanza
    - 女子速度：Aleksandra Mirosław（世界紀錄 6.03）／鄧麗娟 Deng Lijuan／周亞菲 Zhou Yafei
- **下一屆**：Brno（捷克），**2027-08-13～22**，第 20 屆，同時是 LA28 資格賽 ✅ https://worldclimbing.com/news/world-climbing-unveils-2027-international-competition-calendar 原文：「The 20th edition of the World Climbing Championship will be the peak of the 2027 season, taking place in Brno, Czechia, from 13 to 22 August. Brno 2027 will also form part of the qualification pathway to LA28.」

#### 2c. 洲際賽事 ✅
- 有 World Climbing Africa／Asia／Europe／Oceania／Pan America 五個洲際總會（出處：品牌重塑新聞）。
- 2027 年洲際奧運資格賽：
  - 南非 10/7–10（B、L、S）
  - 澳洲 10/14–17（B、L）
  - Mount Maunganui（紐西蘭）10/23–24（S）
  - 上海 11/10–14（B、L、S）
  - 原文：「Four further continental qualifiers will take place across October and November in South Africa, Australia, New Zealand and China.」
- 歐洲運動會（伊斯坦堡 6/16–27）與泛美運動會（利馬 7/24–8/8）也是資格賽。

#### 2d. 青年世錦賽與年齡組別 ✅
- Eligibility Code v2（2026 年 1 月）https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/xk9zes4oinpxkfqgsovz.pdf 表 2（青年組）：
  - 2026 年：U17 = 2010、2011 年生；U19 = 2008、2009；U21 = 2006、2007
  - 表 1（成人 Open）：2026 年為「2009 or earlier」（當年滿 17 歲）
- 2026 年阿爾科青年世錦賽只辦 U17 和 U19 ✅ https://worldclimbing.com/events/world-climbing-youth-championship-arco-2026/news/hayashi-nakata-deubler-and-jung-crowned-lead-youth-champions-in-arco 原文：「the Under 17 and Under 19 Lead finals」
- 改制背景 🟡 Climbing Business Journal 2024-05：「shift in the minimum age for World Cups from 16 to 17, effective for the 2025 season … U17, U19, and U21 (the current IFSC age categories are U16/Youth B, U18/Youth A, and U20/Junior)」
- 2027 年青年世錦賽：印度 Jamshedpur，11/21–28 ✅（2027 賽程表）

#### 2e. LA28 奧運資格路徑 ✅
- https://worldclimbing.com/events/olympic-games-la28/news/qualification-system-for-la28-released （2026-02-02）重點原文：
  - 「a total of 76 athletes」
  - 「approximately 50% of the LA28 places, with a single spot available at each」（指 2027 年的資格賽）
  - 「The OQS in 2028 will then allocate the remaining places, a minimum of four for Boulder and Lead and six for Speed.」
  - 「There will be a minimum of 12 men and 12 women competing in Boulder and Lead. Speed will be restricted to 14 spots for each gender.」
  - 「quota limit of two climbers per gender and per discipline」
  - 「one place per gender, per discipline available for the host nation, USA, and one Universality place」
  - 兼項規則：同時取得抱石和先鋒資格的選手，在 76 人總額中只算一個名額；速度固定 14 人。
- 資格賽列表：歐洲運動會、泛美運動會、Brno 2027 世錦賽、非洲／亞洲／大洋洲資格賽、2028 年 OQS（3 站，時間地點未定）。
- IOC 執委會 2026-02-01 核准（World Climbing LA28 頁面）。
- ⚪ IOC 官方三份資格制度 PDF 沒有逐條讀：olympics.com 被 Exa（逾時）和 curl（000）擋住，jina／firecrawl 斷線。World Climbing 的新聞稿已經涵蓋所有數字。

---

### 3. 奧運歷史

#### 東京 2020 ✅
- https://www.worldclimbing.com/olympics/2020-tokyo 原文：「From 3 to 6 August 2021, 40 athletes – 20 women and 20 men – competed at Aomi Urban Sports Park in a Combined format that brought together all three disciplines」
- 頒獎台：
  - 男子：Alberto Ginés López／Nathaniel Coleman／Jakob Schubert
  - 女子：Janja Garnbret／野中生萌 Miho Nonaka／野口啟代 Akiyo Noguchi
- 乘積計分 ✅（IFSC 2021 年新聞，Wayback 副本 https://web.archive.org/web/20220223035542/https://www.ifsc-climbing.org/index.php/news/575-first-ever-sport-climbing-olympic-gold-for-gines-lopez ）原文：「a multiplication of scores from each discipline, with Ginés López obtaining 28.00, Coleman 30.00, and Schubert 35.00 points. With the lowest score being equivalent to the highest result」
- 每個性別只有 1 面金牌（LA28 頁面：「two at Tokyo 2020」）。

#### 巴黎 2024 ✅
- https://www.worldclimbing.com/olympics/2024-paris 原文：「With separate Speed and Boulder & Lead medal events in Paris, the number of Climbing medal events doubled from two at Tokyo 2020 to four at Paris 2024 … rising from 40 in Tokyo to 68 in Paris」
- 得獎者（各篇 worldclimbing 賽報）：
  - 女子 B&L：Garnbret／Brooke Raboutou／Jessica Pilz
  - 男子 B&L：Toby Roberts（155.2 分）／安樂宙斗（145.4 分）／Schubert（139.6 分）
  - 女子速度：Mirosław（決賽 6.10）／鄧麗娟（6.18）／Aleksandra Kałucka。原文：「winning the first ever Speed climbing Olympic gold medal」
  - 男子速度：Veddriq Leonardo（決賽 4.75）／伍鵬 Wu Peng（4.77）／Sam Watson。原文：「the first for Indonesia at Paris 2024」
- ⚠️ Leonardo 賽報寫他準決賽「PB of 4.48s」，跟同段落的 4.75 PB 矛盾，判斷是錯字，**不要引用 4.48**。

#### LA28 ✅
- LA28 新聞稿（2025-04-09）https://la28.org/en/newsroom/los-angeles-2028-medal-event-program-and-athlete-quota.html 原文：「Sport Climbing athletes also gained two medal opportunities by separating the previous combined event, boulder and lead, and creating three distinct medal events: speed, boulder and lead.」
- IOC 引述（World Climbing 2025-04-09 https://www.worldclimbing.com/news/sport-climbing-s-three-disciplines-get-standalone-medals-for-la28 ）原文：「six events for men's and women's Lead, Speed, and Boulder climbing, with a total quota of 76 athletes (38 women and 38 men)」
- 場地與日期（https://www.worldclimbing.com/olympics/2028-los-angeles ）：
  - 奧運會期 2028-07-14～30
  - 場地原文：「Long Beach Climbing Theater, in the Long Beach Sports Park」
  - 攀岩賽程 7/24（一）～7/29（六）：7/24 男子抱石準決賽＋速度資格賽 … 7/29 女子先鋒決賽
  - ⚠️ 頁面把「Men's Speed final」列了兩次，其中一個應該是女子；7/26 的確切項目以 LA28 官方賽程 PDF 為準，本次未讀。
- 「first as a program sport」：LA28 是攀岩第一次以正式計畫項目（program sport）出場，前兩屆是主辦國提案的追加項目。

---

### 4. 帕拉攀登（Para Climbing）

#### 4a. 運動等級（現行）✅
- **Para Climbing Classification Rules（2025 年 3 月）**：https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/hvqnhow69zfxtrnfdgz8.pdf
  - 原文：「all 8 of the IPC's eligible physical impairment types over 7 sport classes for each gender」
  - 肢體障礙的 7 個等級：
    - AU2：「One upper limb has reduced function below the athletes elbow and does not have a functional wrist joint」
    - AU3：「One hand or multiple digits across both hands are absent or have reduced function」
    - AL1：「Bilateral Lower Limb impairment」
    - AL2：「Unilateral Lower Limb impairment or leg length difference」
    - RP1／RP2／RP3：range-power 的重度／中度／輕度
  - 視障的 3 個等級：B1 視力「poorer than LogMAR 2.60」；B2 為 LogMAR 1.50–2.60，或視野半徑小於 10°；B3 為 LogMAR 1.40–1，或視野小於 40°
  - 合計每個性別 10 級，共 20 級。World Climbing 2025-05-13 原文：「In total there can be 20 (10 for men and 10 for women).」
- ⚠️ 2026 年 2 月的選手名冊（https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/owrrkieowhe8syfhspgn.pdf ）還有 4 位選手掛「AU1」，但 2025 年的分級規則已經沒有 AU1。判斷是舊等級殘留，**本次未證實**。
- 比賽方式 ✅：Para Climbing 競賽規程 v2（2026 年 1 月）https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/j4p9tjj4kwngy5qykrsr.pdf 原文：「an annual cup series with up to 8 competitions in the top-rope discipline (the World Climbing Para Series) … a bi-annual championship competition in the top-rope discipline (the World Climbing Para Championship)」
  - 名稱更新：「Para Climbing World Cup」已改名為「World Climbing Para Series」。

#### 4b. 2026–2027 帕拉賽事 ✅
- 2026 Para Series：鹽湖城 5/15–16、因斯布魯克 6/15–16、Laval 8/28–29、群山（韓國）10/30–11/1（出處：中國站確認後的賽程表）。
- 2025 年帕拉世錦賽與首爾世錦賽同場舉行（2025-05-13 新聞）。
- 2027：帕拉世錦賽在 Brno；Para Series 5 站（曼徹斯特、因斯布魯克、洛杉磯、卡塔尼亞、土魯斯）；日內瓦歐洲帕拉錦標賽是帕拉攀登第一次進入綜合型運動會。

#### 4c. 帕運地位：**LA28 帕運會有帕拉攀登**（你原本的假設是錯的）✅
- IPC 2024-06-26 https://www.paralympic.org/news/para-climbing-be-included-la28-paralympic-games 原文：「The International Paralympic Committee (IPC) Governing Board has approved a proposal from the LA28 Organising Committee to include Para climbing into the 2028 Paralympic Sport Programme.」
- IPC 2025-06-03 https://www.paralympic.org/news/la28-paralympic-medal-event-programme-athlete-quotas 原文：「Para climbing … will have eight medal events (four male and four female) and have a maximum of 10 athletes contesting each medal event.」
- World Climbing（2026-08-12）https://worldclimbing.com/news/ipc-releases-qualification-pathway-to-la28 ：
  - 會期原文：「Taking place from 15-27 August 2028」
  - 項目原文：「Women: B2, RP1, AU2, AL2 / Men: B1, RP1, AU2, AL2」
  - 共 80 人；Brno 2027 每項取前 3 名（男女各 12 人）；2028 年 Para Qualifier（男女各 24 人）；地主國保障名額；「Athletes must be born before 1 January 2012.」
- 場地同樣在 Long Beach Climbing Theater（https://www.worldclimbing.com/paralympics/2028-los-angeles ）。
  - ⚠️ 該頁賽程寫「Women's B1 final」，跟項目列表的女子 B2 矛盾。

---

### 5. 反禁藥與健康政策

- 反禁藥規則 ✅ IFSC Anti-Doping Rules https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/i8b7tr8baxkubdg72thk.pdf 原文：「Adopted on 12 November 2020 / Take effect on 1st January 2021 / Updated April 2023」
- WADA Code 簽署方 ✅ https://worldclimbing.com/anti-doping/ad-index 原文：「As a Signatory of the World Anti-Doping Code, IFSC is responsible for implementing an effective and Code-compliant anti-doping program … IFSC has delegated the management of some elements of the clean sport activities to the International Testing Agency (ITA)」
- 行蹤申報（whereabouts）✅ https://worldclimbing.com/anti-doping/ad-rtp
  - 原文：「One daily specific 60-minute time slot between 5:00 and 23:00」
  - 原文：「Three Whereabouts Failures (any combination of a Filing Failure and a Missed Test) occurring within a 12-month period will lead to an Anti-Doping Rule Violation and a potential two-year ban」
  - 原文：退役選手復出需「six months prior written notice」
- 公開禁賽案例 ✅ ITA 制裁清單 https://ita.sport/sanction/international-federation-of-sport-climbing-ifsc
  - Reza Kolasangian（伊朗），「Art. 2.1 - Presence of Stanozolol metabolites」，違規日期 2023-07-08，「Period of Ineligibility of 4 years」，禁賽期 2023-08-15～2027-08-14
  - ITA 清單目前只有這一筆。
  - 搜尋時看到的「Carboni 禁賽 4 年」其實是**自行車選手**，跟攀岩無關。
- 紀律處分案件（非禁藥）✅ https://worldclimbing.com/resources/disciplinary-cases （2026-09-09 更新）：2026 年一位 FRA 案例「Two-year ban, second year suspended」，事由為違反 Code of Conduct／Safeguarding。
- ⚪ 2027 版 WADA Code 生效後 World Climbing 是否有新版反禁藥規則：resources 頁上的版本仍是 2021 年版（2023 年更新）。查過 Keenable（「World Climbing anti-doping rules…」）和 worldclimbing.com/resources/competitions，都沒找到 2027 年版。
- REDs（相對能量不足）政策 ✅
  - 2024-02-07 https://worldclimbing.com/news/new-competition-policy-places-ifsc-at-forefront-of-fight-against-reds 原文：「The IFSC has become the first International Federation to introduce comprehensive regulations related to Relative Energy Deficiency in Sport (REDs)」
  - 為什麼不只用 BMI 篩選，原文：「a simple BMI test does not provide an accurate picture … would also not be legally defensible」
  - 2026 版：REDs Health Screening Rules v2.1（2026-02-16）https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/ggshfid84f4p8xq7gowr.pdf 原文：「The completion of all required Medical Data is strictly compulsory for all athletes wishing to register for World Climbing Series events and World Climbing (Youth) Championship.」
  - 篩檢問卷：LEAF-Q（女）、LEAM-Q（男）、EDE-QS（飲食障礙簡式問卷）
  - 健康專區另有 GLP-1、腦震盪、熱傷害、跨性別／DSD 政策頁面。

---

### 6. 2026 年賽季與治理動態

#### 2026 世界攀登系列賽賽程 ✅⚠️
- 來源 https://worldclimbing.com/news/china-events-confirmed-to-complete-2026-calendar （2026-01-09），共 13 站：

| 日期 | 地點 | 項目 |
|---|---|---|
| 5/1–3 | 柯橋 | 抱石 |
| 5/8–10 | 吳江 | 先鋒、速度 |
| 5/22–24 | 伯恩 | 抱石 |
| 5/28–31 | Alcobendas | 抱石、速度 |
| 6/3–7 | 布拉格 | 抱石、先鋒 |
| 6/17–21 | 因斯布魯克 | 抱石、先鋒 |
| 7/3–5 | 克拉科夫 | 速度（四道首站） |
| 7/10–12 | 夏慕尼 | 先鋒、速度 |
| 9/4–5 | Koper | 先鋒 |
| 9/11–13 | 貴陽 | 速度 |
| 9/18–20 | 重慶 | 速度 |
| 10/16–18 | 鹽湖城 | 抱石（今天進行中） |
| 10/23–25 | 聖地牙哥（智利） | 先鋒、速度（尚未舉行） |

- 原文：「Guiyang on 11-13 September and Chongqing on 18-20 September will both showcase the Speed discipline adding the relay and mixed relay competitions」
- 其他：青年世錦賽阿爾科 7/18–25；亞運愛知・名古屋，攀岩 9/29–10/3（2025-10-31 賽程公告 https://worldclimbing.com/news/ifsc-announces-climbing-and-para-climbing-calendar-2026 ）
- Mirosław 宣布退役：克拉科夫是她最後一場 World Climbing 國際賽，之後還會參加 Laval 歐錦賽（克拉科夫賽報）。

#### 2026 年規則變化 ✅
1. 名稱改為 World Climbing Series。
2. 四道速度與 32 人淘汰賽、資格賽 4 跑全部計入（Event Regs 附件 B Speed 4、附件 D 團體接力）。
3. 4 月的勘誤（見 1a）。
- ⚪ 2025 年版 Event Regulations 沒找到，所以**無法逐條比對 2025→2026 的完整差異**。2025 年 Competition Rules v1.0（https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/w2ggglzziip6zpnpkir4.pdf ）已下載，但它只有通則，沒有各項目附件。需要完整差異表 → ✉️ 寫信問 World Climbing Sport Department（office@worldclimbing.com）。

#### 2027 年規則變化 ⚪
- 目前已公布的只有 2027 賽程，沒有規則變更公告。
- Event Regs 自述為「biennial」（兩年一版），推測下一版在 2028 年 1 月左右（推測）。
- 查過：Keenable（「World Climbing 2027 rule changes…」「Rules Commission new rules…」）、worldclimbing 2027 賽程新聞、resources/competitions 頁。

#### 治理 ✅
- 品牌重塑：2025-12-10 正式啟用 World Climbing 名稱與識別。原文：「The transition to the name World Climbing was formally approved by National Federations in October 2023 and written into the Federation's statutes」
- 法定名稱變更：2026-07-23 臨時大會 ✅ https://worldclimbing.com/news/extraordinary-general-assembly-approves-legal-name-change-and-principles-based-approach-to-national-federation-membership-status
  - 原文：「National Federations first approved the statutory amendments required to formally change the legal name of the International Federation of Sport Climbing to World Climbing.」（需三分之二多數）
  - 同場會議以「principles-based framework」取代對白俄羅斯、俄羅斯、以色列的停權表決；俄、白選手的中立選手政策維持不變。
- 寫文章時可分三個時間點：2023-10 通過更名 → 2025-12 啟用品牌 → 2026-07 完成法定更名。

---

### 來源總表（全部存取於 2026-10-18）

| # | 來源 | 類型 | 讀取狀態 |
|---|---|---|---|
| 1 | Competition Rules v3（2026-01）jaq7awz9… | 一手 PDF | ✅ 全文 |
| 2 | Event Regulations v3（2026-01）brsjsyh2… | 一手 PDF | ✅ 附件 A／B／C 全讀，D 讀了格式 |
| 3 | Amendments & Errata（2026-04-01）colytv4c… | 一手 PDF | ✅ 全文 |
| 4 | 2024 Rules v1.01 z0nsb2xb… | 一手 PDF | ✅ 抱石排名章節 |
| 5 | 2025 Competition Rules v1.0 w2ggglzz… | 一手 PDF | 已下載，只看了封面與目錄 |
| 6 | Eligibility Code v2（2026-01）xk9zes4o… | 一手 PDF | ✅ 年齡表 |
| 7 | Para Classification Rules（2025-03）hvqnhow6… | 一手 PDF | ✅ 等級定義 |
| 8 | Para Competition Regs v2（2026-01）j4p9tjj4… | 一手 PDF | ✅ 總則與合併組別 |
| 9 | Para 選手名冊（2026-02）owrrkieo… | 一手 PDF | ✅ 等級人數統計 |
| 10 | IFSC Anti-Doping Rules（2021，2023 年更新）i8b7tr8b… | 一手 PDF | ✅ 封面＋目錄＋檢索 |
| 11 | REDs Screening Rules v2.1 ggshfid8… | 一手 PDF | ✅ 前言 |
| 12 | worldclimbing：2025 規則變更、品牌重塑、臨時大會、LA28 資格制度、IPC 帕運路徑、LA28／巴黎／東京頁、帕運 LA28 頁、2026 賽程×2、2027 賽程、名額、吳江／克拉科夫／四道／貴陽／重慶×3／大洋洲紀錄、首爾先鋒／抱石、巴黎賽報×4、認識帕拉攀登、分級頁、反禁藥總覽／RTP、紀律案件、REDs×2、阿爾科青年賽 | 一手網頁 | ✅ 全部經 curl 讀取全文 |
| 13 | la28.org 獎牌項目新聞稿 | 一手 | ✅ |
| 14 | paralympic.org 2024-06-26、2025-06-03 | 一手 | ✅ |
| 15 | ita.sport IFSC 制裁清單 | 一手 | ✅ |
| 16 | IFSC 2021 東京新聞稿（Wayback） | 一手（封存） | ✅ |
| 17 | Gripped 巴黎計分說明 | 二手 | 🟡 用於 B&L 計分細節 |
| 18 | Wikipedia：2025 世錦賽獎牌表、速度牆 | 二手 | 🟡 |
| 19 | Climbing Business Journal 年齡組別改制 | 二手 | 🟡 |
| 20 | olympics.com 巴黎成績、IOC 資格制度 PDF | 一手 | ⚪ 抓取失敗：Exa 逾時、curl 回 000、jina／firecrawl 斷線；內容已由 #12 涵蓋 |
| 21 | Speed Licence Rules（速度牆規格） | 一手 | ⚪ resources 頁沒有連結；✉️ office@worldclimbing.com |

# 附錄 B：B-asia-taiwan-japan

### B. 亞洲／台灣／日本 運動攀登競賽研究筆記

- 研究日：2026-10-18（所有引用的存取日均為 2026-10-18）
- 用途：zh-TW 運動攀登競賽系列規劃（台灣讀者）
- 標記：✅ 已讀全文或該段原文，附 URL 與原句｜⚪ 確認查無公開資料（列出試過的工具）｜✉️ 只能寫信問（列出對象）｜⚠️ 易變事實（排名、紀錄、名單、規程）

### toolDegradation（工具降級紀錄）

| 層級 | 工具 | 結果 |
|---|---|---|
| 1 | Groundlane MCP `web_search`/`web_fetch`（已用 ToolSearch 載入） | 失敗：`MCP server "claude.ai Groundlane" is not connected` |
| 2 | Groundlane 直接 HTTP POST `/mcp` | 失敗：HTTP 401 |
| 3 | Keenable keyless search | **可用**，所有搜尋都走這條 |
| 4 | You.com keyless | 沒用到（Keenable 已夠） |
| 5 | Exa `web_fetch_exa` | **可用**，用來讀大部分全文（含 Yahoo、公視、NOWnews、olympics.com） |
| 5 | firecrawl / jina MCP / linkup | 都失敗：not connected / 404 |
| 6 | `r.jina.ai` reader（curl） | 有時可用；遇到 429 速率限制；tw.sports.yahoo.com 回 403（abuse block）→ 改用 Exa |
| 6 | curl + pdftotext | 可用（全運會規程 PDF、亞運合格名單 PDF、World Climbing 成績 API JSON） |

---

### 1. 亞洲

#### 1.1 組織：World Climbing 的亞洲理事會

- ✅ IFSC 已改名為 World Climbing。來源：https://worldclimbing.com/ifsc/index ——「On 10 December 2025, the IFSC was completely rebranded as World Climbing.」
- ✅ 亞洲理事會在賽事文件上的名稱：2026 亞青賽報導寫「世界攀联亚洲理事会」，秘書長是 Rasip Isnin。來源：https://www.sohu.com/a/1066422356_123753 ——「世界攀岩联合会亚洲理事会秘书长Rasip Isnin在致辞中表示……」。中國 CGTN 寫「World Climbing Asia Youth Championships」，asjfnews 寫「vice president of the World Climbing Asian Council」（https://asjfnews.com/world-climbing-asia-youth-series-concludes-in-china-as-asian-talent-makes-its-mark）。
  - 2025–2029 屆理事會名單（主席 DING Xianghua 等）只在搜尋摘要裡看到（ifsc-climbing.org/continental-councils/asian/as-members）；Exa 抓取回 CRAWL_NOT_FOUND，所以**沒讀到全文**。要引用的話，請改用 worldclimbing.com 的新網址重新讀過。
- ✅ 歷史背景：中華奧會說亞洲攀登委員會（A.C.C）在 1990 年成立，台灣是會員。來源：https://www.tpenoc.net/sport/sports-climbing/ ——「亞洲亦於 1990 年成立亞洲攀登委員會（A.C.C），會員國包括韓國、日本、台灣、中國、新加坡、印尼、伊朗等國。」

#### 1.2 洲際賽事體系

- ✅ **亞洲盃（現名 World Climbing Asia Series）**。來源：https://en.wikipedia.org/wiki/World_Climbing_Asia_Series（2026-10-06 版）——「The World Climbing Asia Series, formerly known as the IFSC Climbing Asian Cup, is a series of Asian climbing competitions organized by World Climbing.」表格列出 2026 年那一站是「Gunsan | 31 October - 1 November 2026 | B + S」（⚠️ 尚未舉行）。
  - 台灣選手相關：2019 香港站女子抱石冠軍 Hung Ying Lee（李虹瑩）、亞軍 Hsiu-Ju Lin；2023 利雅德站女子速度冠軍也是 Hung Ying Lee。國籍已用官方成績 API 核對（見 2.5）。
- ✅ **亞洲錦標賽 2026 眉山**，同時是名古屋亞運的最後一場資格賽。來源：http://china.org.cn/2026-04/15/content_118438450.shtml ——「The five-day Asian Climbing Championship concluded on April 12 in Meishan… drawing more than 200 athletes from 15 countries and regions… Japan topped the medal table with three golds, three silvers and four bronzes」。
- ✅ **亞洲青年錦標賽 2026 貴陽**（8/21–25，分 U17/U19 兩組，項目有抱石、先鋒、速度、速度接力）。來源：https://cn.chinadaily.com.cn/a/202608/26/WS6a8eb092e4b09a165c786398.html ——「来自亚洲16个国家和地区的213名运动员……中国队以10金9银3铜位列奖牌榜第一，日本队以3金4银5铜位列奖牌榜第二，韩国队以2金3银3铜……」。台灣在這屆有沒有參賽或得牌：⚪ 用 Keenable 搜「2026 亞洲青年攀岩錦標賽 貴陽 台灣」沒有任何台灣相關結果。要確認的話得逐場查 World Climbing 成績 API（下一步可做）。
- ✅ 2026 年新設 **World Climbing Asia Youth Series**（全南站，U15/U17）。來源：http://global.chinadaily.com.cn/a/202608/13/WS6a7dc629a31073853ec5330e.html ——「A total of 174 athletes and 38 coaches and team officials from eight delegations…」，代表團名單裡沒有台灣。

#### 1.3 2026 愛知・名古屋亞運：運動攀登（已辦完）

- ✅ 日期、場地、規模。來源：https://en.wikipedia.org/wiki/Sport_climbing_at_the_2026_Asian_Games ——「Venue | Nagoya International Exhibition Hall Exhibition Hall 1 | Dates | 29 September–3 October 2026 | Competitors | 75 from 13 nations」。
- ✅ 賽制：**沒有兩項全能**，改成抱石、先鋒、速度三個單項（男女各 3 面金牌，共 6 金）；速度用**四道（four-lane）**賽制。來源：World Climbing Day 1 賽報 https://worldclimbing.com/events/asian-games-aichi-nagoya-2026/news/today-at-the-asian-games-day-1 ——「It was also the first time I have run in the four-lane.」（哈薩克選手 Utesheva 的話）。Day 2 賽報寫「the gold medal race was contested by four very strong climbers」。
- ✅ 獎牌（Wikipedia 獎牌表，再用 World Climbing 每日賽報逐項核對）：

| 項目 | 金 | 銀 | 銅 |
|---|---|---|---|
| 男子抱石 | 安樂宙斗 Sorato Anraku（日） | 李度炫 Lee Do-hyun（韓） | 楢崎智亜 Tomoa Narasaki（日） |
| 男子先鋒 | 鈴木音生 Neo Suzuki（日） | 吉田智音 Satone Yoshida（日） | 李度炫（韓） |
| 男子速度 | 褚首宏 Chu Shouhong（中，4.71） | Reza Alipour（伊朗） | Damir Toktarov（哈薩克） |
| 女子抱石 | 張悅彤 Zhang Yuetong（中，85.0） | 森秋彩 Ai Mori（日，84.8） | 徐彩鉉 Seo Chae-hyun（韓） |
| 女子先鋒 | 徐彩鉉（韓） | 森秋彩（日） | 張悅彤（中） |
| 女子速度 | Desak Made Rita Kusuma Dewi（印尼，6.062） | 鄧麗娟 Deng Lijuan（中，6.064） | 鄭智敏 Jeong Ji-min（韓，6.18） |

  - 獎牌榜：日 2金3銀1銅、中 2-1-1、韓 1-1-3、印尼 1-0-0、伊朗 0-1-0、哈薩克 0-0-1。
  - 原句（Day 5）：「Japan's Neo Suzuki was the man to give the home fans a golden goodbye」；「South Korea's Chaehyun Seo won gold in style to upgrade her Boulder bronze」。
  - 原句（Day 2）：「Made Rita and Deng touched the pad at 6.06s – but the Indonesian was 6.062 and Deng 6.064. Made Rita had gold and a new Asian Games and Asian continental record.」
  - 原句（China Daily）http://global.chinadaily.com.cn/a/202610/02/WS6abf41b4e4b06d4aa0561375.html ——「Chu Shouhong won the men's speed gold medal… clocking 4.71 seconds in the final… reigning Olympic champion Veddriq Leonardo of Indonesia was eliminated in the semifinals.」
  - 韓國首面亞運速度獎牌。來源：https://biz.chosun.com/en/en-sports/2026/10/01/QNDORFGHKVDNBEQT7LQJUXJBEA ——「It was the first time a Korean athlete reached the podium in the men's or women's speed…」
- ✅ **中華台北沒有出賽**。Wikipedia 的參賽國名單共 13 國（中、港、印、印尼、伊朗、日、約旦、哈薩克、科威特、馬來西亞、新加坡、韓、泰），沒有中華台北。原因見下兩點。
- ✅ **官方合格名單：3 名台灣選手有亞運資格。** World Climbing 公告 PDF（As of 15MAY2026）https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/tb6mcf5waazj68ihkj1b.pdf：
  - 女子抱石（眉山亞錦賽配額）：「YAO Ting-Chen (TPE)」
  - 男子抱石（D.2 Host NOC places，透過 2025 世錦賽重分配）：「LIN Chia Hsiang (TPE) *Reallocated」
  - 男子先鋒（眉山亞錦賽配額）：「FAN Chih-En (TPE)」
  - 輔仁大學 2026-04-14 的賀文寫「凌睿秀取得……女子先鋒賽及抱石賽資格」（https://www.fju.edu.tw/awardDetail.jsp?newsID=7970）。但官方 PDF 裡凌睿秀（LING Ruei-Siou）只出現在排名表，沒有 Q（合格）標記。**以官方 PDF 為準**；輔大的說法可能是在重分配之前寫的，屬推測。
- ✅ **運動部決議不派隊。** 自由時報稿（Yahoo 轉載，2026-07-10）https://tw.sports.yahoo.com/news/運動攀登-取得參賽資格仍無法去亞運-運動部說明狀況-225940845.html：
  - 「名古屋亞運的運動攀登項目這次台灣有3名選手范植恩、姚廷蓁、林嘉翔取得參賽門票。不過……考量整體參賽效益，因而決議不組隊參賽。」
  - 「亞運參賽標準為『最近一屆奧運前8名、上屆亞運或最近一屆世大運、世界、亞洲、世青正式錦標賽前4名)』」
  - 「國際運動攀登總會亞洲總會於115年4月14日以電子郵件通知……115年6月26日專案評估參賽會議上……決議不派員參賽。」
  - 公視（2026-07-13）https://news.pts.org.tw/article/817432：「2025年已經改要求選手，先在指定國際賽事中取得參賽席次，才能參加亞運，而且席次綁定個人」（教練團說法）。
  - NOWnews（2026-07-13）https://www.nownews.com/news/6856290：「姚廷蓁今年在2026眉山亞洲錦標賽女子抱石項目取得第8順位……過去兩年沒有企業贊助……累積投入已超過百萬元」。
  - ⚠️ 這是爭議事件，寫進文章時要並陳運動部說法和選手說法。

#### 1.4 2022 杭州亞運（2023 年舉行）

- ✅ 來源：https://en.wikipedia.org/wiki/Sport_climbing_at_the_2022_Asian_Games ——「held at Keqiao Yangshan Sport Climbing Centre, Shaoxing, China, from 3 to 7 October 2023」；「108 from 16 nations」；中華台北派 2 人。
- 項目：速度、速度接力、抱石＋先鋒全能，男女各 3 項，共 6 金。

| 項目 | 金 | 銀 | 銅 |
|---|---|---|---|
| 男子速度 | Reza Alipour（伊朗） | 龍金寶（中） | Veddriq Leonardo（印尼） |
| 男子速度接力 | 中國 | 印尼 | 韓國 |
| 男子全能 | 安樂宙斗（日） | 李度炫（韓） | 潘愚非（中） |
| 女子速度 | Desak Made Rita Kusuma Dewi（印尼） | 鄧麗娟（中） | Rajiah Sallsabillah（印尼） |
| 女子速度接力 | 中國 | 印尼 | 韓國 |
| 女子全能 | 森秋彩（日） | 徐彩鉉（韓） | 張悅彤（中） |

- ✅ World Climbing 賽報 https://worldclimbing.com/events/asian-games-hangzhou-2022/news/speed-champions-attack-and-defend-at-asian-games ——「Iran's Reza Alipour Shenazandifard defended his men's crown」；「Dewi produced a 6.36 to take gold and the new Asian record」。
- ✅ 台灣選手：李虹瑩在全能拿第 9，沒進決賽。來源：https://wowsight.tw/2023/10/07/《亞運》亞洲實力全面提升-李虹瑩運動攀登第9遺憾未進決賽/ ——「最終以總分76.53分，飲恨排名第9名，無緣晉級決賽」；「李虹瑩上屆亞運拿下第6名」。林嘉翔男子速度第 14（World Climbing 官方成績 API，運動員 id 2146：「14 | Asian Games Hangzhou 2022 | speed」）。

---

### 2. 台灣

> 台灣的公開資料偏少屬常態。以下能找到的都附了原文；找不到的標 ⚪ 或 ✉️。

#### 2.1 主管協會：中華民國山岳協會（CTAA）

- ✅ World Climbing 登錄的台灣會員協會是「Chinese Taipei Alpine Association (CTAA)」。來源：官方成績 API https://ifsc.results.info/api/v1/athletes/13895 ——`"federation":{"id":22,"name":"Chinese Taipei Alpine Association","abbreviation":"CTAA"}`。
- ✅ 全國賽由山協主辦、運動部指導，民間岩館承辦。例子：
  - 2026 全國抱石運動攀登錦標賽：https://ctaa.j91.me/race/502 ——「指導單位：運動部、臺中市政府運動局 3. 主辦單位：中華民國山岳協會 4. 承辦單位：臺中市體育總會攀岩委員會、Dapro攀岩館 5. 比賽日期：115年10月17日(六)、115年10月18日(日)」（⚠️ 就在研究日當天比賽，成績還沒查）。
  - 115 學年度全國青少年運動攀登錦標賽：https://ctaa.j91.me/race/503 ——「主辦單位：中華民國山岳協會 4. 承辦單位：原岩攀岩館 5. 比賽日期：115年11月14日(六)、115年11月15日(日)」。
  - 2025 全國先鋒抱石運動攀登錦標賽：https://ctaa.j91.me/race/30（114/5/30–6/1，Dapro）。
  - 大專校院 115 學年度攀登錦標賽：https://www.phr.ntnu.edu.tw/zh_tw/news/…-47303850 ——「主辦單位：中華民國大專院校體育總會 五、承辦單位：中華民國山岳協會」。

#### 2.2 綜合運動會有沒有攀岩

- ✅ **全國運動會（全運會）：114 年（2025，雲林）沒有運動攀登。** 114 年全運會競賽規程 PDF（https://ctba.meetagile.com/files/message/2391/114年全國運動會競賽規程.pdf）第六條：「應辦種類：01、田徑 02、水上運動 03、體操 … 14、霹靂舞 … 30. 棒壘球 選辦種類：01、武術 02、滑輪溜冰 03、空手道 04、軟式網球 05、卡巴迪」。清單裡沒有運動攀登（也沒有滑板、衝浪）。
  - 「全運會哪一年加入攀岩」這題：在 114 年規程看不到攀岩，所以前提不成立。歷屆是否曾列入：⚪（Keenable 搜「全運會 運動攀登 首度 列入」「全國運動會 競賽種類 運動攀登 新增」，結果都是中國大陸的十五運或香港全港運，沒有台灣全運會攀岩的資料）。
  - 116 年（2027，屏東）預告「競賽種類共計35種」（Yahoo/中時轉載屏東縣府稿），但沒有列出明細，所以不知道有沒有攀岩：⚪／✉️ 可問運動部競技運動司或屏東縣府全運籌備處。
  - ⚠️ 注意：中國大陸 2025 年第十五屆全運會**有**攀岩（廣州），寫稿時別混用。
- ✅ **全民運動會：113 年（屏東）沒有攀岩。** 113 年規程 https://sport113.ptc.edu.tw/Module/Pages/Index.php?ID=11 第七條：「第一類：健力、拔河、輕艇水球、水上救生、蹼泳、飛盤、合球、滑輪溜冰、滾球、原野射箭、柔術、沙灘手球、定向越野、運動舞蹈。第二類：傳統體育……劍道、沙灘角力、健美、藤球、舞蹈運動。」
  - 115 年（桃園，10/17–22）共 32 項。官網 https://sport115.tycg.gov.tw/ 的首頁 HTML 用 grep 搜「攀岩」「運動攀登」都是 0 筆。媒體列的項目也沒有攀岩（https://new7.storm.mg/article/5563745 ——「共規劃16項應辦、16項選辦，合計32項競賽項目」）。判定為沒有攀岩，但這是用網頁搜尋判定的，嚴格說是「推測無」。
- ✅ **全國中等學校運動會（全中運）：114 年（台南）官網沒有攀岩。** 用 grep 搜 https://sport114.tainan.gov.tw/ 的首頁項目名，有桌球、自由車、霹靂舞、滑輪溜冰等，「攀岩」「運動攀登」都是 0 筆。
- ✅ 縣市層級有攀岩：例如「114 年度桃園市運動會-市長盃抱石運動攀登錦標賽」（https://yses.tyc.edu.tw/…/596_1_114年桃園市運動會市長盃抱石運動錦標賽競賽規程.pdf）。

#### 2.3 青少年升學管道（台灣青少年參賽的實際誘因）

- ✅ 全國青少年運動攀登錦標賽是教育部核定的「運動成績優良學生甄試資格」賽事。來源：https://ctaa.j91.me/race/367 ——「本賽事經教育部114年6月20日臺教授體字第1140029515號核定為運動成績優良學生甄試資格運動錦標賽。」

#### 2.4 怎麼進國家隊（選拔）

- ✅ 全國賽「甲組」計算國手積分。來源：https://ctaa.j91.me/race/502 ——「只有本會有效團體會員參加甲組比賽之選手才根據『中華民國山岳協會國家代表隊選手遴選實施準則』計算國手積分。」以及「國手積分：只有參加甲組比賽之選手(需符合國手選拔辦法的選手)且具有中華民國山岳協會會員或中華民國山岳協會所屬俱樂部成員身份，才得以根據中華民國山岳協會運動攀登部之巡迴賽積分辦法計算國手積分與排名。」
- ✅ 台中市政府新聞稿（2024 全國抱石錦標賽）：「此次賽事同時可累積我國國手選拔積分」（https://www.taichung.gov.tw/8868/8872/9962/2652701）。
- ✅ 單一賽會的遴選例子：2026 三亞亞洲沙灘運動會用國手測試賽，第一名入選。來源：https://itsrcowebs.com/…/附件一.中華民國山岳協會參加「2026年第6屆三亞亞洲沙灘運動會」代表隊教練及選手遴選.pdf ——「檢測時間：2026 年 1 月 3 日 2、檢測地點：中和原岩攀岩場 3、檢測標準：測試賽事獲得第一名者。男、女各一名。」
- ✅ 法源：《國家代表隊教練與選手選拔培訓及參賽處理辦法》https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=H0120034。綜合賽會（亞運等）的流程是：單項協會遴選、提報國訓中心、訓輔會審議。這次亞運爭議就卡在訓輔會這一關（見 1.3）。
- ✉️ 《中華民國山岳協會國家代表隊選手遴選實施準則》全文和「巡迴賽積分辦法」的積分表：Keenable 搜了 3 次（準則全名、「itsrcowebs 國手積分」、「遴選實施準則 修正 運動攀登部」），都只找到別份文件引用這個名稱，沒找到原文 PDF。**要問：中華民國山岳協會運動攀登部**（比賽系統 ctaa.j91.me；協會文件放在 itsrcowebs.com/Files/archives/article/100015/）。

#### 2.5 民間／岩館賽事

- ✅ 原岩攀岩館辦的業餘賽，例如「2026 原岩火箭盃快閃先鋒賽」。來源：https://tupclimbing.tw/course/zhonghe/581 ——「主辦單位：原岩攀岩館 二、比賽日期時間：2026 / 9 / 8 (二) 19:00-22:00 … 報名費用：每人 350 元＋入場費」。原岩也常承辦山協的全國賽（中和店）。
- 「TUP 盃」「Boulder League」這兩個名稱：⚪（Keenable 搜「原岩攀岩館 抱石賽 年度賽事」「台灣 攀岩館 業餘抱石聯賽 2026」，只找到火箭盃，沒找到用這兩個名稱的固定聯賽）。

#### 2.6 重點台灣選手與最佳國際成績（World Climbing 官方成績 API）

| 選手 | 最佳國際成績（API 原文節錄） | 備註 |
|---|---|---|
| 李虹瑩 LEE Hung Ying（id 2139） | 「1 \| IFSC Climbing Asian Cup Riyadh 2023 \| speed Women」；「3 \| Asian Championships - Bogor (INA) 2019 \| boulder Women」；亞錦賽抱石銅牌：2012 樂業、2016 都勻、2019 Bogor；「4 \| ANOC World Beach Games (B) - Doha (QAT)」 | 杭州亞運第 9、雅加達亞運第 6（媒體）；2026 年 5 月仍出賽三亞亞沙會；現任山協理事（115-05-22 理事會紀錄出席名單有她） |
| 范植恩 FAN Chih-En（id 13895，2007 年生） | 「IFSC Youth Asian Championships Jamshedpur 2024 boulder Youth A Male 1」；「Asian Championships Tai'an 2024 lead Men 7」；2026 眉山亞錦賽先鋒 17、抱石 28 | 國手教練楊東偉在 OUTSiDERS 專訪說：「小將范植恩在亞洲青少年攀岩錦標賽中一舉奪下抱石項目的金牌」（https://www.outsiders.com.tw/post/47417）。⚠️ Threads 上有一則 Meta AI 回覆稱這是「台灣首面亞青運動攀登金牌」，該說法**未查證**，不要引用 |
| 姚廷蓁 YAO Ting-Chen（id 2160） | 最佳是「9 \| IFSC Climbing Asian Cup Hong Kong 2025 \| boulder」；2026 眉山抱石 22（亞運配額排第 8 順位） | 自費參賽，見 1.3 |
| 林嘉翔 LIN Chia Hsiang（id 2146） | 「7 \| IFSC Climbing Asian Cup Riyadh 2023 \| speed Men」；杭州亞運速度 14；速度個人最佳 5.96（API `speed_personal_best`，2024 吳江）；2025 世錦賽抱石 41 | 2022 年以 6.183 秒破全國紀錄（中時 2022-04-20，https://www.chinatimes.com/realtimenews/20220420005301-260403 ——「以6.183秒一舉破全國紀錄」）。⚠️ 這個全國紀錄後來可能已被刷新。API 另有一筆「Moscow 2021 combined 7」，看起來是只有少數人參加的全能統計，不能當成「世錦賽第 7」 |

- ✅ 楊東偉（國家隊教練）的評論，屬評論者觀點：「台灣到現在，連一座符合國際賽標準、可以專門拿來訓練的場地都沒有。」「日本的青少年選手，可能下午三點下課就泡在岩館裡訓練；台灣的孩子只有週三下午沒課……」（https://www.outsiders.com.tw/post/47417，2026-02-05）

---

### 3. 日本為什麼強

#### 3.1 事實層

- ✅ **奧運**
  - 東京 2020 女子全能：野中生萌銀、野口啟代銅。來源：https://www.olympics.com/en/olympic-games/tokyo-2020/results/sport-climbing ——「Women's Combined Gold Janja GARNBRET … Silver Miho NONAKA Bronze Akiyo NOGUCHI」。
  - 巴黎 2024 男子抱石＋先鋒：安樂宙斗銀。來源：https://www.olympics.com/en/news/paris-2024-sport-climbing-results-anraku-sorato-mens-boulder-lead ——「finish ahead of Japan's Anraku Sorato (145.4), the 17-year-old who slipped late on in the Lead to take silver」。
  - 巴黎女子抱石＋先鋒：森秋彩第 4、野中生萌第 9（https://www.olympics.com/en/olympic-games/paris-2024/results/sport-climbing/women-boulder-and-lead）。
- ✅ **世界盃（World Climbing Series）年度總冠軍**（來源：Wikipedia「World Climbing Series」wikitext 的歷年表，每年附 ifsc.results.info 連結，2025 年後更新；屬二手彙整）：
  - 男子 14 座：先鋒 1998、2000 平山裕示，2012、2013 安間佐千，2023 安樂宙斗；抱石 2016、2019 楢崎智亜，2021、2022 緒方良行，2023、2024、2025 安樂宙斗；全能 2017、2019 楢崎智亜。
  - 女子 8 座：抱石 2009、2010、2014、2015 野口啟代，2018 野中生萌；全能 2008、2009、2014 野口啟代。
  - 同頁的「Season podium table」寫「gold_JPN = 14」（男）、「gold_JPN = 8」（女），和上面逐筆數的結果一致。⚠️ 該頁「Medal table」段被標了 {{Dubious}}，但年度冠軍表有附出處。
  - Olympedia 補充安樂宙斗：「the first climber to win both the Lead and Boulder Overall World Cups in his début senior season (2023)」（https://www.olympedia.org/results/2005350）。
- ✅ **2025 世錦賽（首爾）男子抱石金牌：安樂宙斗**（https://en.wikipedia.org/wiki/2025_IFSC_Climbing_World_Championships）。
- ✅ **深度（數量證據）**：2023 年世界盃 Briançon 站男子先鋒決賽有 7 名日本人。來源：https://inside-climbing.com/2025/01/29/why-japan-has-11-fewer-spots-at-2025-ifsc-world-cups ——「In Briançon in 2023, seven Japanese Lead athletes were in the final, and six in 2024.」2025 年配額制度改了，日本少了 11 個名額：「Japan is the country most impacted, losing 11 spots compared to the rules from 2024.」
  - UKC 2017 賽季回顧：「on average, 7.3 Japanese men were among the first 20 at the Bouldering World Cups. For the 2014-2016 seasons, the average is 3.5.」（https://ukclimbing.com/articles/features/2017_ifsc_competition_season_review-9968，只讀到摘要段 ⚠️）。
- ✅ **Japan Cup 體系（JMSCA 主辦）**
  - Wikipedia（https://en.wikipedia.org/wiki/Climbing_Japan_Cup）：「The first Lead Japan Cup was held in 1987. The first Bouldering Japan Cup was held in 2005. The first Combined Japan Cup was held in 2018. The first Speed Japan Cup was held in 2019.」
  - ⚠️ 數字有出入：Wikipedia「Lead Japan Cup 2026」頁寫「the 39th edition」，往回推首屆是 1988，和上面的 1987 差一年。寫稿前要用 JMSCA 歷屆成績頁再核一次。BJC 2026 是「21st edition」，和 2005 首屆吻合。
  - 2026 賽程：「1月31日、2月1日に『ボルダージャパンカップ』を…駒沢…、2月15日に『スピードジャパンカップ』を…九州クライミングベースSAGA…、3月7、8日に『リードジャパンカップ』を…DMG MORIアリーナ」（https://www.climbers-web.jp/news/20251003-1/）。
  - Japan Cup 就是國手選拔賽。JMSCA 2026 選考基準（https://www.jma-climbing.org/article/2026/01/08/selection-criteria-for-international-2026-competitions/）：優先順位 1 是「2025年世界ランキング10位以内の選手」，2 是「アジア競技大会…内定選手」，3 是「【ボルダー、リード】国内選考大会の上位選手…優先順1､2､3を除く男女各8名」。CLIMBERS：「シーズンの国内開幕戦にして日本一決定戦、そして日本代表選考大会を兼ねる一戦だ」（https://www.climbers-web.jp/news/20260129-1/）。
- ✅ **青少年培育管道（JMSCA 官方）**：「JMSCA次世代アスリート育成プロジェクト」（https://www.jma-sangaku.or.jp/sports/nextgenpro/，2024-10-01）——「全国の都道府県連盟（協會）及びクライミング施設と連携し」；JMSCA 自己承認有三個課題：「1. 持続可能な選手育成・強化システムの構築…2. スポーツクライミング指導者の確保。3. クライミング施設の多くはボルダー施設であるため、リード、スピードで世界をリードする施設や拠点の設置。」頁面列出強化據點 10 處（岩手、葛飾、幕張總合高校、倉吉、石鎚等），另有抱石培育據點等。
  - 青少年全國賽：リードユース日本選手権、ボルダリングユース日本選手権、JOC ジュニアオリンピックカップ（https://www.fujisawa-climbing.jp/2018/08/21joc.html ——「日本ユース選手権（リード）、ボルダリングユース日本選手権と並んで…JMSCAが主催するユース世代の全国大会の一つです。」）。
  - 國民體育大會（現稱國民運動會）有山岳競技攀登項目。來源：日文 Wikipedia「スポーツクライミング」——「国民体育大会の競技として山岳競技種目の一環の形でフリークライミングが採用されている」。
- ✅ **國家訓練中心**：葛飾區東金町運動場是攀岩第一個被指定的 NTC 競技別強化據點。東京新聞 2022-06-05（https://www.tokyo-np.co.jp/article/181640，會員限定，只讀到第一段）——「東京都葛飾区の東金町運動場が、スポーツクライミング競技のトップ選手の強化拠点『ナショナルトレーニングセンター』に指定された。同競技での指定は全国で初めて。」⚠️ 指定期間只寫到某年三月底，後半段在付費牆內，沒讀到。
- ✅ **岩館數量**（三個來源，口徑不同）
  - Number Web（森山憲一，2019-06-16）https://number.bunshun.jp/articles/-/839683?page=2 ——「国内のクライミングジムは一貫して増加を続け、現在は500軒を超える。2008年には100軒に満たなかったのだから、10年で5倍以上になっている。」
  - Mickipedia（個人用 Google Map 計數，2020-05）https://micki-pedia.com/number-of-climbing-gym-2020.html ——「2020年5月現在で全国のクライミングジムの件數は 666軒でした」；作者自己也說「数値は正しい保証はなく」；2019 年起「開店数が12軒、閉店数が19軒」，可能已經飽和。
  - CINC Capital 轉述「日本山岳・スポーツクライミング協会が発表した2021年の資料によると…およそ800店舗」（https://cinc-capital.co.jp/column/industry/climbing-gym-ma）。這是二手轉述，JMSCA 2021 原始文件沒找到 ⚪（Keenable 搜「クライミングジム 数 全国 推移」只找到這篇轉述）。✉️ 可問 JMSCA（info@jma-sangaku.or.jp，見 worldclimbing.com/national-federations/nf-jpn/jpn-info）。

#### 3.2 評論者的解釋（不是事實，引用時要寫明是誰說的）

1. **岩館密度高、岩點排得密**：小日向徹（World Climbing 副會長）在 Number 說：「日本では…壁一面にびっしりホールドを付けるジムも少なくありません。さまざまなホールドを組み合わせて多種多樣な動きができる」。同一篇文章也提醒：「クライミングジムの増加は世界的な傾向なので、このことだけでは日本が強くなった説明としては弱い。」
2. **體重輕、適合亞洲人**：Number 把這點列為常見說法，同時反駁：「10年ほど前までは、世界の上位はほぼヨーロッパ勢に独占されていた」。台灣國手教練楊東偉也說「攀岩這項運動其實很適合亞洲人」，屬評論。
3. **爬得多、定線員多元**：楊東偉說：「日本選手很簡單，就是一直爬。透過解決不同定線員設計的難題……」（OUTSiDERS）。
4. **專攻世界盃型路線**：Reddit r/climbharder 的網友看法（「many of the top Japanese climbers have decided to focus on World Cup training」），只能當社群意見。
5. **配額制度放大了深度**：inside-climbing 認為 2024 年以前「named spots」制度讓日本在決賽人數上特別多。屬制度分析，不是在解釋實力本身。
- 學術研究：沒有找到直接分析「日本攀岩為何強」的論文 ⚪（Keenable 搜英日文各 1 次，結果是 Number、Gripped、climbing.com 這類媒體）。可另外用 Groundlane paper_search 或 J-STAGE 補查。

---

### 4. 韓國／中國／印尼（背景）

- ✅ **印尼速度**
  - Veddriq Leonardo 巴黎奧運金牌，4.75 秒。Reuters：「beating China's Wu Peng by two hundredths of a second with a personal best of 4.75 seconds」（https://reuters.com/sports/olympics/climbing-indonesias-leonardo-wins-gold-medal-mens-speed-event-2024-08-08）。
  - 國家政策：AFP 寫「a rigorous national program that designated climbing as a priority sport for Indonesia, alongside badminton and weightlifting」（https://vnexpress.net/news/sports/rapid-indonesian-speed-climbers-push-boundaries-and-smash-records-4660920.html）。
  - 世界盃速度年度冠軍：Leonardo 2021–2023、Kiromal Katibin 2025（Wikipedia 年度冠軍表）。
  - ⚠️ Kompas 報導印尼速度隊有「alleged sexual and physical violence」風波（https://kompas.id/artikel/en-tiket-asian-games-dan-medali-emas-panjat-tebing-menunggang-badai），只讀了摘要，如要引用需讀全文。
- ✅ **中國速度**：趙一程以 4.54 秒創男子世界紀錄（2026-05-10，吳江）。來源 http://china.org.cn/china/Off_the_Wire/2026-05/11/content_118486479.shtml ——「clocking 4.54 seconds in the semifinal… The 16-year-old lowered his previous world record of 4.58 seconds, which he set at last month's Asian Beach Games in Sanya」。亞運官方 PDF 表頭也寫「World Record 4.54 ZHAO Yicheng CHN Wujiang 10 MAY 2026」⚠️（紀錄隨時會被刷新）。
  - 2025 世錦賽男子速度金牌：龍建國（Wikipedia 2025 世錦賽頁）。
- ✅ **韓國**
  - 徐彩鉉：2019 世界盃女子先鋒年度冠軍（Wikipedia 年度表）、2026 亞運女子先鋒金牌。
  - 李度炫：2025 世錦賽男子先鋒金牌。來源 https://bignewsnetwork.com/news/278602786/garnbret-lee-win-lead-golds-at-ifsc-climbing-world-championships ——「Lee Do-hyun lit up the home crowd with the men's gold」。
  - 老一輩的金滋仁 Jain Kim：女子先鋒年度冠軍 2010、2013、2014。

---

### 來源表（讀取狀態）

| # | 來源 | 用在哪裡 | 狀態 |
|---|---|---|---|
| 1 | worldclimbing.com/ifsc/index | 改名日期 | ✅ 全文（Exa） |
| 2 | images.ifsc-climbing.org …tb6mcf5waazj68ihkj1b.pdf（亞運合格名單 15MAY2026） | 台灣 3 個配額 | ✅ 全文（pdftotext） |
| 3 | en.wikipedia.org Sport_climbing_at_the_2026_Asian_Games | 日期、場地、獎牌、參賽國 | ✅ 全文（r.jina.ai） |
| 4 | worldclimbing.com 亞運 Day1–Day5 賽報 | 賽制、獎牌原句 | ✅ 全文 |
| 5 | global.chinadaily.com.cn …WS6abf41b4… | 褚首宏 4.71 | ✅ 搜尋摘要含原句 |
| 6 | biz.chosun.com 鄭智敏 | 韓國首面速度獎牌 | ✅ 摘要原句 |
| 7 | tw.sports.yahoo.com（自由時報）不派隊 | 運動部四點說明 | ✅ 全文（Exa；jina 被 403） |
| 8 | news.pts.org.tw/article/817432 | 席次綁定個人 | ✅ 全文 |
| 9 | nownews.com/news/6856290 | 姚廷蓁自費、第 8 順位 | ✅ 全文 |
| 10 | fju.edu.tw awardDetail 7970 | 凌睿秀說法（和 #2 衝突） | ✅ 全文 |
| 11 | en.wikipedia.org Sport_climbing_at_the_2022_Asian_Games | 杭州獎牌 | ✅ 全文 |
| 12 | worldclimbing.com 杭州速度賽報 | 杭州速度原句 | ✅ 全文 |
| 13 | wowsight.tw 李虹瑩第 9 | 杭州台灣成績 | ✅ 摘要原句 |
| 14 | en.wikipedia.org World_Climbing_Asia_Series | 亞洲盃歷史、2026 群山站 | ✅ 全文 |
| 15 | china.org.cn 眉山亞錦賽 | 亞錦賽 | ✅ 摘要原句 |
| 16 | cn.chinadaily.com.cn 2026 亞青 | 亞青獎牌榜 | ✅ 摘要原句 |
| 17 | ctba.meetagile.com 114 全運會競賽規程 PDF | 全運會沒有攀岩 | ✅ 全文（pdftotext） |
| 18 | sport113.ptc.edu.tw 113 全民運規程 | 全民運沒有攀岩 | ✅ 全文 |
| 19 | sport115.tycg.gov.tw 首頁 | 115 全民運沒有攀岩（grep） | ✅ HTML grep（推測無） |
| 20 | sport114.tainan.gov.tw 首頁 | 全中運沒有攀岩（grep） | ✅ HTML grep（推測無） |
| 21 | ctaa.j91.me/race/502、/503、/367、/30 | 全國賽、國手積分、甄試資格 | ✅ 全文（curl） |
| 22 | itsrcowebs.com 三亞亞沙會遴選辦法 PDF | 遴選例子 | ✅ 搜尋摘要原句 |
| 23 | 山協《國家代表隊選手遴選實施準則》 | 積分規則 | ✉️ 沒找到原文 |
| 24 | ifsc.results.info/api/v1/athletes/{13895,2139,2160,2146} | 台灣選手成績 | ✅ 全文 JSON |
| 25 | outsiders.com.tw/post/47417 | 國手教練評論 | ✅ 全文 |
| 26 | sportclimbingstats.com（李、范） | 交叉核對 | ✅ 全文（二手，以 #24 為準） |
| 27 | tupclimbing.tw/course/zhonghe/581 | 岩館賽 | ✅ 摘要原句 |
| 28 | olympics.com 東京／巴黎成績頁、新聞 | 奧運獎牌 | ✅ 全文 |
| 29 | olympedia.org/results/2005350 | 安樂宙斗 2023 雙冠 | ✅ 摘要原句 |
| 30 | en.wikipedia.org World_Climbing_Series（wikitext） | 年度冠軍統計 | ✅ 全文（二手彙整） |
| 31 | en.wikipedia.org Climbing_Japan_Cup（wikitext） | Japan Cup 起始年 | ✅ 全文（年份待核） |
| 32 | climbers-web.jp 20251003-1、20260129-1 | 2026 Japan Cup 賽程、選拔 | ✅ 摘要原句 |
| 33 | jma-climbing.org 2026 選考基準 | 選拔順位 | ✅ 摘要原句（表格） |
| 34 | jma-sangaku.or.jp/sports/nextgenpro | 育成計畫 | ✅ 全文 |
| 35 | number.bunshun.jp/articles/-/839683?page=2 | 岩館數、小日向說法 | ✅ 第 2 頁全文（第 1、3、4 頁沒讀） |
| 36 | micki-pedia.com number-of-climbing-gym-2020 | 666 間 | ✅ 全文 |
| 37 | cinc-capital.co.jp 轉述 JMSCA 800 間 | 二手 | ✅ 摘要；原始文件 ⚪ |
| 38 | tokyo-np.co.jp/article/181640 | 葛飾 NTC | ✅ 第一段（付費牆） |
| 39 | inside-climbing.com 2025 配額 | 日本深度、配額 | ✅ 全文 |
| 40 | ukclimbing 2017 season review | 日本人進前 20 的平均人數 | ⚠️ 只讀到摘要 |
| 41 | reuters Leonardo / vnexpress（AFP）印尼 | 印尼背景 | ✅ 摘要 / 全文 |
| 42 | china.org.cn 趙一程 4.54 | 中國速度 | ✅ 摘要原句 |
| 43 | bignewsnetwork 李度炫 2025 | 韓國 | ✅ 摘要原句 |
| 44 | ifsc-climbing.org/continental-councils/asian/as-members | 亞洲理事會名單 | ⚠️ Exa CRAWL_NOT_FOUND，只看到摘要 |
| 45 | kompas.id 印尼風波 | 背景 | ⚠️ 只讀到摘要 |

### 易變事實清單 ⚠️

- 世界紀錄（男子速度 4.54 趙一程，2026-05-10）
- 世界盃年度冠軍統計（每季更新；Wikipedia 標記為 2025 季後更新）
- 2026 全國抱石錦標賽（10/17–18）成績：研究日當天還沒公布
- 2026 亞洲盃群山站（10/31–11/1）：還沒舉行
- 116 全運會 35 項明細：還沒查到
- 台灣選手名單、國手積分：每年會變
- Lead Japan Cup 首屆是 1987 還是 1988：兩個來源不一致

# 附錄 C：C-nonifsc-pro

### C. Non-World-Climbing competitions and professional climbing (research notes)

Access date for every source: **2026-10-18**. Scope: zh-TW blog series on comps and pro climbing for Taiwanese readers.
Legend: ✅ = source read in full (or the relevant full section), URL + quote given; ⚪ = confirmed no public data (tools/URLs listed); ✉️ = only by email. ⚠️ = volatile fact, re-check before publishing.

### toolDegradation
- (1) Groundlane MCP `mcp__claude_ai_Groundlane__web_search`: loaded via ToolSearch, then every call returned `MCP server "claude.ai Groundlane" is not connected`.
- (2) Groundlane direct HTTP POST `https://groundlane.vincent-xu-work.workers.dev/mcp`: `HTTP/2 401`, `www-authenticate: Bearer realm="OAuth"` (needs OAuth, so not usable from curl).
- (3) Keenable keyless search: **worked**. Used for every search.
- (4) You.com: not needed, since Keenable worked.
- (5) Cloud fallbacks: Exa `web_fetch_exa` / `web_search_exa` **worked** and was used for UKC, PlanetMountain and Climbing.com pages. Firecrawl MCP: `not connected`. linkup: `404 Server not found`. Jina reader (`r.jina.ai`, keyless) worked but was rate-limited at times, and failed pages were retried through Exa.
- (6) curl with a browser UA: PlanetMountain returned 403 and UKC returned an empty page, so both went through Jina or Exa instead.

---

### Q1. Non-World-Climbing (non-IFSC) competitions

#### 1a. Psicobloc / deep-water-solo comps
- ✅ **Origin, 2013 (Park City, USA).** "Versions of this played out repeatedly at the inaugural Psicobloc Masters Series climbing competition finals held Friday, August 2nd, at the Utah Olympic Park in Park City. The event is the first deep water solo climbing competition in the United States" — https://theactiveexplorer.com/free-to-fall-the-psicobloc-masters-series-climbing-competition
- ✅ **US run ended in 2019.** "The Utah Olympic Park announced Monday that it will not host the Psicobloc Masters deep water solo climbing competition this summer, though the organization did not rule out a future return. The UOP had held Psicobloc for the previous five years." (Park Record, 2019-04-29) — https://parkrecord.com/2019/04/29/utah-olympic-park-wont-host-psicobloc-climbing-competition-this-summer
  - The search snippet for gripped.com (2015) says "The third Psicobloc Masters Series took place on Aug. 7, 2015 … Jimmy Webb and Charlotte Durif took the gold medals." Search snippet only; the page returned just 1.5 KB.
- ✅ **Red Bull Creepers, the Psicobloc spin-off.** The agency's own case page: "In 2014, after a conversation with Bernard Scheiflinger, Global Head of Sport Marketing at Red Bull, the message was clear: 'You have an amazing event (the Psicobloc Master Series), but we're Red Bull… we need to take it further…'" and "After two editions in Spain, the project made the leap to the U.S., holding its third edition in Chattanooga, Tennessee in 2025" — https://b3sportainment.com/portfolio/redbull-creepers
- ✅ "The Red Bull Creepers has taken place twice in recent years in Spain (2014, 2021). Now, Chattanooga will host the event on August 16th. The event will feature 16 of the world's best climbers competing on a course built into the side and underside of the Market Street Bridge." (WTVC, 2025-07-25) — https://foxchattanooga.com/news/local/chattanooga-gears-up-for-red-bull-creepers-a-daring-climbing-competition-over-water
- ✅ ⚠️ **Current status in 2026: the Psicobloc Master Series still runs in Spain.** From the local daily: "Del 18 al 20 de septiembre, el Paseo de la Marina y O Parrote recibirán Graviteo A Coruña Xacobeo … alrededor del psicobloc, la escalada de velocidad, el boulder y el parkour" and "Una de las imágenes más reconocibles será la del Psicobloc Master Series. Dieciséis especialistas internacionales, ocho mujeres y ocho hombres" … "un muro de 16 metros" (La Opinión A Coruña, 2026-08-24) — https://www.laopinioncoruna.es/deportes/2026/08/24/sera-graviteo-coruna-xacobeo-deporte-bc-133630787.html
  - Archysport (an aggregator) says it "returns to Spain" and embeds a "Psico Bloc Master Series | Lead Finals | Greece | 2024" video. That is weak evidence of a 2024 Greek edition. I did not verify the European calendar from 2020 to 2025.
- Not researched: Red Bull Creepers 2026. A Keenable search found no 2026 edition. Treat it as ad hoc and not annual.

#### 1b. Red Bull Dual Ascent (multi-pitch race up the Verzasca Dam, Switzerland)
- ✅ **2022, first edition.** "Nearly 600 feet, six pitches, and two identical routes. With that, eight teams of two … went head-to-head in a first of its kind multipitch competition, the Red Bull Dual Ascent." "The competition took place across three days from October 26 to 29." Winners: "Alberto Ginés López (ESP) and … Luka Potočar (SLO)", final time 51:27 — https://www.climbing.com/competition/red-bull-dual-ascent/
- ✅ **2024, third edition, with mixed teams.** "Austria's Jessica Pilz and Jakob Schubert became the latest Red Bull Dual Ascent champions in its third edition … Among the field were defending champions from Slovenia, the Kruder siblings" (so the Kruders won 2023). "180m of demanding, exposed routes – six gnarly pitches from F6c to F8b" — https://www.climber.co.uk/news/pilz-and-schubert-take-the-win-in-the-red-bull-dual-on-the-verzasca-dam/
- ✅ The official page still shows 2024 as its latest edition: "2 November 2024 … For the 2024 outing, Red Bull Dual Ascent returned to the Verzasca Dam … for the third year running" — https://www.redbull.com/int-en/events/red-bull-dual-ascent
- ⚪ ⚠️ **No 2025 or 2026 edition found.** Keenable searches for "Red Bull Dual Ascent 2025 winners", "Dual Ascent 2026" and "2025 edition cancelled OR returns" only returned 2022–2024 coverage. An Exa search for "… 2025 edition winners" returned only 2024 results and a YouTube upload dated 2025-10-18 with no content. Write it as "held 2022–2024; no announced edition since then (as of 2026-10)."

#### 1c. Rock Master, Arco (Italy)
- ✅ **History.** Official site: "It all began in 1986, at the foot of Mount Colodri, on natural rock with Sport Roccia. In 1987, the event moved beneath the walls of Arco Castle and took the name Rock Master … But it was in 1988, with the creation of the Climbing Stadium, that the competition found its definitive home" and "By the 2000s, Duel Lead and KO Boulder brought adrenaline-pumping rhythm and excitement to the event." — https://rockmaster.com/en/rock-master/rock-master-tale
- ✅ "the longest‑running sport climbing festival in the world" (PlanetMountain, 2025-10-18, Raboutou and Ondra win the 2025 Duel) — https://planetmountain.com/en/news/competitions/brooke-raboutou-adam-ondra-dominate-rock-master-duel-2025.html
- ✅ Format, per Lacrux on the 2025 edition: "a friendly competition steeped in history that kicks off the off-season … Every year, the winners are crowned in the indispensable lead duel and knockout bouldering." — https://lacrux.com/en/klettern/these-are-the-rock-masters-2025
- ✅ ⚠️ **2026 (40th) edition.** "beating Adam Ondra in the final of the 40th Rock Master in Arco … the steep Duel around 8a+ route in 1:07.3, just 1.5 seconds faster than Ondra … In the women's Duel, Jessica Pilz defeated Brooke Raboutou" (Vertical-Life/8a.nu, 2026-10-04) — https://8a.nu/news/filip-schenk-and-jessica-pilz-win-rock-master-lead-duel-fd4p6
  - KO Boulder 2026: "On Saturday night Adam Ondra and Jessica Pilz won the KO Boulder at Rock Master 2026 … celebrating forty years of climbing competitions in Arco" (PlanetMountain, 2026-10-05) — https://planetmountain.com/en/news/competitions/jessica-pilz-adam-ondra-win-2026-arco-rock-master-ko-boulder.html
  - Small error in the 8a.nu story: it calls the 2026 women's Duel "a repeat of last year's final", but PlanetMountain says Raboutou won the 2025 Duel. That only fits if Pilz and Raboutou met in both finals with different winners. Raboutou won 2025 and Pilz won 2026.

#### 1d. Outdoor bouldering festivals
- ✅ **Melloblocco (Val Masino / Val di Mello, Italy).** It went on hiatus in 2019: "Melloblocco, the largest climbing meeting in the world that has taken place for 14 years in Val Masino - Val di Mello before going on tour to Cresciano in Switzerland, will not take place this May" (PlanetMountain, 2019-04-16) — https://planetmountain.com/en/news/climbing/melloblocco-an-end-and-new-beginning.html
- ✅ It returned in 2023 (16th edition, per a PlanetMountain headline in Keenable results). 2025: "The 18th edition of Melloblocco — the world's largest bouldering — came to a close … over 2,300 registered participants and 8,000 attendees" (2025-05-11) — https://planetmountain.com/en/news/events/the-great-beauty-of-melloblocco.html
- ✅ ⚠️ 2026: "From May 6 to 9, 2026, Val Masino hosts the Melloblocco … supported by the brand La Sportiva" — https://www.calendariovaltellinese.com/en/eventi/melloblocco-2026
  - I did not open the PlanetMountain 2023 "16th edition" article itself. Its headline/snippet: "The 16th edition of Melloblocco … 2500 registered climbers."
  - Melloblocco is a gathering, not a ranked competition. Its format is "a meeting" with circuits, masterclasses and prizes.
- ✅ **Hueco Rock Rodeo (Texas, USA).** "The American Alpine Club will no longer host the Craggin' Classic Series or the Hueco Rock Rodeo." (AAC, 2024-11-01) — https://americanalpineclub.org/news/2024/11/1/n64m60v6pfx6iq6unz2d46lbd7o5zy
  - ⚪ ⚠️ No 2025 or 2026 edition is confirmed. Keenable search "Hueco Rock Rodeo 2026" turned up the Wikipedia page, which only says it is "held annually in February" and has no post-2024 edition. KAYA Climb has a "28th annual" results page, but it is undated: https://kayaclimb.com/hueco-rock-rodeo-results (read, no year given). Exa was not tried for this item. Wording to use: "AAC stopped hosting it after 2024; current status unclear."
- ✅ **Rocklands (South Africa).** It is a grassroots "Rocklands Rally", not a pro comp: "Rocklands Rally 2026 Wrap-up … a weekend of sandstone joy … for divas and dirtbags alike" — https://goodbeta.co.za/rocklands-rally-2026-wrap-up. The inaugural rally was 2021 (Quicket listing snippet: "the inaugural Rocklands Rally!").
- ✅ **Magic Wood (Switzerland).** Community and conservation events, not pro comps: "From 12–14 June 2026, Bodhi Camping in the heart of Magic Wood once again became home to climbers…" (3rd Magic Mountain Bouldering Festival) — https://bodhi.ch/post/3-magic-mountain-bouldering-festival

#### 1e. New pro leagues, 2025–2026: Pro Climbing League (PCL)
- ✅ Founders: "the announcement of the Pro Climbing League (PCL) created by Charlie Boscoe and Danaan Markey … Both have commentated at IFSC World Cups." — https://inside-climbing.com/2025/12/28/pro-climbing-league-breaks-cover
- ✅ Format: "Each PCL event will have eight climbers and three rounds, where the winner of each pairing advances … distinct from competition bouldering events organized by World Climbing" — https://en.wikipedia.org/wiki/Pro_Climbing_League
- ✅ Debut event, 2026-02-28, Magazine London: "In front of 2,400 lively fans, Scotland's Max Milne secured a dream home victory, while France's Oriane Bertone narrowly beat two-time Olympic champion Janja Garnbret" and "£10,000 for first, £5,000 for second and £2,500 for third place." — https://www.climber.co.uk/news/max-milne-and-oriane-bertone-win-inaugural-pro-climbing-league-event/
- ✅ ⚠️ 2027 season: "PCL returns in 2027 with an expanded three-event European series … for a £50,000 (€58,000) prize pot at each event. The 2027 season opens on 23 January in Berlin, moves to Paris on 13 February and concludes in London on 20 March." (UKC, 2026-09) — https://ukclimbing.com/news/2026/09/pro_climbing_league_returns_bigger_and_better_in_2027-74211
- Keenable found no "USA Climbing Pro" league. It looks like an invented name, so do not use it.

#### 1f. National series (keep brief)
- ✅ USA Climbing: "its 2026 National Championships schedule, including five events across the Elite, Para Climbing, Collegiate, and Youth Series … National Team athletes receive critical funding and support to represent the United States internationally" — https://usaclimbing.org/news/usa-climbing-announces-2026-national-championships-schedule
- ✅ Japan (JMSCA): "The first Lead Japan Cup was held in 1987. The first Bouldering Japan Cup was held in 2005. The first Combined Japan Cup was held in 2018. The first Speed Japan Cup was held in 2019." — https://en.wikipedia.org/wiki/Climbing_Japan_Cup
  - Search snippet only: Boulder Japan Cup 2026 (21st edition, 2026-01-31 to 02-01, Komazawa) "decides who get to be on the team this year."

---

### Q2. Pro climbing outside competitions: hardest grades (as of 2026-10-18) ⚠️ all volatile

#### 2a. 9c (5.15d) sport routes: five proposed, one confirmed
Climbing-history.org "Hardest" list, marked "Verified reasonably complete", shows 5 climbs: "Silence 9c Flatanger Cave Adam Ondra (3rd Sep 2017) 1 · DNA 9c La Ramirole Seb Bouin (26th Apr 2022) 2 · B.I.G 9c Flatanger Cave Jakob Schubert (20th Sep 2023) 1 · Duality of Man 9c Dry Canyon Sean Bailey (6th Mar 2025) 1 · Café Colombia 9c Margalef Jorge Díaz-Rullo (13th Mar 2026) 1". The last number in each entry is the ascent count. ✅ https://climbing-history.org/hardest?discipline=sport&grade=9c

| Route | FA | Evidence |
|---|---|---|
| Silence, Flatanger NOR | Ondra, 2017-09-03 | ✅ "As of July 2026, Silence remains unrepeated." "Will Bosi managed to repeat the crux in May 2026 describing it as equivalent to a V16 boulder." — https://en.wikipedia.org/wiki/Silence_(climb). Lacrux (2026-10-17): Bosi "intended to dedicate 2026 entirely to 'Silence' … in mid-October, Bosi streamed his first attempts to send it." ⚠️ A repeat could happen any day. |
| DNA, Verdon FRA | Bouin, 2022-04 | ✅ Bouin at the time: "The 9c is my suggestion for DNA, which now needs to be confirmed or adjusted by other climbers." (quoted in Lacrux) — https://lacrux.com/en/klettern/9c-%E2%80%93-these-are-the-hardest-sport-climbing-routes-in-the-world. ✅ **Second ascent by Schubert, 2026-10-10:** "On the afternoon of October 10, Austrian climber Jakob Schubert made the second ascent of DNA (9c/5.15d), a 55-meter route … Since Schubert has aligned with Bouin on his proposed grade, this also makes DNA the world's first confirmed 5.15d route." and "some 180,000 people were watching. He livestreamed" — https://climbing.com/news/dna-repeat |
| B.I.G., Flatanger | Schubert, 2023-09-20 | ✅ From Schubert's own blog: "Jakob Schubert opens the third 9c in the world … reached the final holds of former 'Project Big' on September 20." — https://jakob-schubert.com/en/blog-BIG.html. The Lacrux list (machine-translated) wrongly says "July 23", so do not use that date. |
| Duality of Man, Arizona USA | Bailey, 2025-03-06; announced 2026-01 | ✅ "Sean Bailey has made the first ascent of Duality of Man (5.15d) … the first route outside of Europe of the grade." and "Bailey joins Jakob Schubert and Adam Ondra in a select group of climbers to have climbed both a 9c route and a 9A boulder" — https://ukclimbing.com/news/2026/01/sean_bailey_makes_first_ascent_of_new_9c_route-74094 |
| Café Colombia, Margalef ESP | Díaz-Rullo, 2026-03-13 | ✅ "Café Colombia marks the fifth proposed 5.15d route in the world" — https://climbing.com/news/jorge-diaz-rullo-515d-routes-cafe-colombia (article title "…All Unrepeated" predates the DNA repeat) |

- **The "Sebastian Halenke Project Big 2023" item in the brief is wrong.** Project Big became B.I.G. (Schubert). Halenke appears only for unrelated 9a/8c+ routes in search results.
- ✅ **9c+:** "the algorithm spit out 9c+/5.16a. Currently, no proposed or confirmed 5.16a route yet exists in the world." (Climbing, updated 2026-06-26) — same climbing.com Café Colombia URL. No later 9c+ claim turned up in Keenable ("9c+ first ascent claim").

#### 2b. 9A boulders: 14 at 9A, 1 proposed at 9A+
✅ Climbing-history list ("Verified reasonably complete", 15 climbs), with ascent counts: "1 Exodia 9A+ Rifugio di Barbara Elias Iagnemma (11th Nov 2025) 1 · Burden of Dreams 9A Lappnor Nalle Hukkataival (24th Oct 2016) 7 · Soudain Seul … Simon Lorenzi (8th Feb 2021) 5 · Return of the Sleepwalker … Daniel Woods (31st Mar 2021) 8 · Alphane … Shawn Raboutou (6th Apr 2022) 7 · Megatron … Shawn Raboutou (2022) 3 · Blackflip SDS … Vadim Timonov (17th May 2023) 1 · Spots of Time … Aidan Roberts (Feb 2024) 2 · Shaolin … Sean Bailey (17th Feb 2024) 5 · Arrival of the Birds … Aidan Roberts (Mar 2024) 2 · No One Mourns the Wicked … Nathaniel Coleman (3rd Dec 2024) 4 · The Big Slamm … Elias Iagnemma (12th Jan 2025) 1 · Mount Doom … Nicolai Užnik (1st Mar 2025) 2 · Realm of Tor'ment … Will Bosi (11th May 2025) 1 · Charlatan 9A Franchard Isatis Charles Albert (Mar 2026) 1" — https://climbing-history.org/hardest?discipline=boulder&grade=9A
- ✅ **Exodia (9A+), the first proposed 9A+:** "Elias Iagnemma making the first ascent of 'Exodia' at Rifugio Barbara in Val Pellice, Italy, on 10 November 2025. The 29-year-old has put forward the grade 9A+/V18. If confirmed, it would be the world's first 9A+ boulder." — https://planetmountain.com/en/news/climbing/elias-iagnemma-establishes-exodia-possibile-first-9a-plus-boulder-in-the-world.html. Sources disagree on the date: PlanetMountain says 10 Nov, climbing-history says 11 Nov. Still unrepeated (Wikipedia draft: "As of June 2026, it remains unrepeated").
- Burden of Dreams: Wikipedia snippet gives the FA as 23 Oct 2016, climbing-history says 24 Oct. Use "October 2016".

#### 2c. Downgrade and confirmation culture (good material for the article)
- ✅ The core principle, in a first ascentionist's own words (Bouin, above): a 9c "needs to be confirmed or adjusted by other climbers."
- ✅ **No One Mourns the Wicked, 9A → 8C+?** "Yannick Flohé has made an ascent of Nathaniel Coleman's No One Mourns the Wicked, 9A … He has suggested a downgrade to 8C+." Pull quote: "'I know what other 9As feel like, and therefore I would suggest 8C+'" (UKC, 2026-05-06) — https://ukclimbing.com/news/2026/05/yannick_flohe_climbs_no_one_mourns_the_wicked_9a_suggests_downgrade-74147. Climbing-history still lists it at 9A, so lists lag behind consensus.
- ✅ **Bibliographie, 9c → 9b+.** "originally climbed by Alex Megos in 2020, who suggested a grade of 9c. However, after Stefano Ghisolfi discovered new beta … he suggested a downgrade to 9b+, a grade that was subsequently confirmed by Sean Bailey, Seb Bouin, and Jorge Díaz-Rullo." — https://ukclimbing.com/news/2026/06/janja_garnbret_becomes_second_woman_to_climb_9b+-74166
- ✅ **Box Therapy, 8C+ → 8C** (which changed the "first female 8C+" record). "after Brooke Raboutou repeated the boulder the following October, she suggested a downgrade to 8C, which brother Shawn … agreed with, alongside fellow ascensionists Drew Ruana and Daniel Woods." — https://ukclimbing.com/news/2025/05/katie_lamb_becomes_the_first_woman_to_boulder_v168c+_again-73959
- Search snippet only: UKC 2026-05 says Flohé also suggested 8B+ for Brain Rot (f8C+). Also in the read UKC Flohé article: "Brain Rot (f8C+), for which he suggested a downgrade to 8B+" ✅.

#### 2d. Women's hardest
- ✅ **9b+ sport, two women.** Raboutou: "On April 8 … the American announced success on Excalibur, a brutally steep and powerful 9b+ (5.15c) in Drena, Italy" (Climbing, 2025-04-09) — https://climbing.com/news/brooke-raboutou-becomes-first-woman-climb-5-15c. Garnbret: "Garnbret becomes just the second woman ever - after Brooke Raboutou's ascent of Excalibur - to climb the grade of 9b+, and just the thirteenth person ever to climb the grade." (Bibliographie, Céüse, 2026-06-06; UKC 2026-06-08) — https://ukclimbing.com/news/2026/06/janja_garnbret_becomes_second_woman_to_climb_9b+-74166
- ✅ **Earlier 9b milestones.** Rogora on Erebor, 9b/+ (2021): "This is the first time a woman has climbed a route of this difficulty." and "Along with Angela Eiter and Julia Chanourdie she is currently only one of three women to have climbed 9b" (PlanetMountain, 2021-10-03) — https://planetmountain.com/en/news/climbing/stellar-laura-rogora-makes-first-repeat-9b-slash-plus-erebor-arco-italy.html
- ✅ **Hardest female first ascent of a sport route:** "Madame Ching | 9b | Angela Eiter | 16th Dec 2020" — https://climbing-history.org/list/womens-first-ascents
- ✅ **Boulders.** No woman has climbed 9A as of 2026-10. Hardest is 8C+: Katie Lamb on The Dark Side (Yosemite), "In climbing The Dark Side, Lamb becomes the first woman to make an ascent at Font 8C+." (UKC, 2025-05-01) — URL as in 2c. The "no woman 9A" claim rests on (a) the climbing-history 9A table, which has no female ascents in its counts or FAs, and (b) gearloop.app: "No woman has climbed 9A yet." Gearloop is a low-quality aggregator that contains an error (it treats Dark Side as the first-ever female 8C+). Keenable search "woman climbs 9A boulder first female ascent 2026" found nothing. Hardest female boulder FA is 8C: "Tokyo Drift … 8C … Jana Švecová … 28th Mar 2026" (climbing-history women's list).

---

### Q3. How pros make a living

- ✅ **World Climbing prize money, 2026 (primary source).** "a total net prize money allocation of €850,000 across the 13 events of the World Climbing Series. The gross total is set to exceed €1 million … more than doubles the €374,400 distributed in 2024" and "each individual medal event will offer €20,000 in prize money, a substantial increase from €11,700 in 2024 … distributed among the top eight athletes." Table: "1st place 30% € 6,000 / 2nd 20% € 4,000 / 3rd 14% € 2,800 / 4th 10% € 2,000 / 5th 8% € 1,600 / 6th 7% € 1,400 / 7th 6% € 1,200 / 8th 5% € 1,000." The table was "developed and approved" by the **World Climbing Athletes' Commission**. Also: "€90,000 … across nine Speed Relay events" and "€9,000 … Series Ranking" (2026-04-16) — https://worldclimbing.com/news/world-climbing-allocates-over-1-million-in-record-2026-prize-money
  - Comparison: a World Cup win pays €6,000, while a PCL London win paid £10,000. In 2027 each PCL event has a £50,000 pot (see 1e).
- ✅ **Sponsorship reality (Climbing, 2020).** "The majority of sponsored climbers don't get a paycheck from their sponsors. Instead, they're paid in gear—or discounts on gear—with occasional stipends to travel or compete." "Alex Honnold commands around $50,000 per speaking gig, and in 2018 he estimated his net worth to be around $2 million." "As for that comfortable middle class? There really isn't one. … Chris Sharma is a gym owner … Alex Puccio coaches." "Influencers with big followings can make several hundred dollars per post." — https://climbing.com/membership/ask-a-climbing-writer-how-much-money-do-professional-climbers-make (an older piece; frame it as 2020)
- ✅ **France, 2025 (Grimper, read via Exa highlights).** "certains gagnent 6 000 euros par an. Il y a un gros tabou en France sur l'argent gagné par les athlètes." and "Romain Desgranges confiait gagner entre 1 000 et 1 500 euros par mois" (2016). Caroline Ciavaldini: switching to outdoor/adventure storytelling multiplied her income by 10 ("ses revenus sont multipliés par dix") — https://www.grimper.com/news-metiers-grimpe-grimpeur-professionnel-2
- ✅ **Federation funding (Alannah Yip, Climbing 2024).** "The U.S. has different tiers; the top tier, since 2019, has been fully paid for: flights, accommodations, meals … common in other countries, including Switzerland, Austria, Japan, and Germany." versus Canada: "I've personally paid my own way for nearly every competition" — https://www.climbing.com/culture-climbing/olympian-alannah-yip-profile/
- ✅ **Film as an economic lever.** Free Solo won "Best Documentary Feature at the 91st Academy Awards"; the infobox lists "Budget $2 million" and "Box office $29.4 million" — https://en.wikipedia.org/wiki/Free_Solo. Reel Rock now sells streaming: "Watch 300+ films … $9.99 Per Month | Billed Annually" — https://reelrocktour.com. Reel Rock 20 "returns with four films" — https://gripped.com/news/famed-climbing-film-tour-reel-rock-turns-20. Bailey kept the Duality of Man ascent quiet for about a year for a film premiere: "The decision to sit on the ascent for nearly a year revolved around the premiere of the inaugural Mellow Film Tour" — climbing.com Café Colombia URL. Livestreaming is a newer channel: 180,000 watched Schubert's DNA send (climbing.com/news/dna-repeat).
  - Not opened: The Dawn Wall and The Alpinist. I only know them from general knowledge, so source them before citing.
- **"PCA".** The Professional Climbers Association was an early-2000s US comp organizer, not an athletes' union. ✅ "Rands won editions of the 2001, and the 2002 Professional Climbers Association (PCA) open bouldering competition in Salt Lake City" — https://en.wikipedia.org/wiki/Lisa_Rands (from the search result snippet; the Exa read showed the infobox). Today's athlete-representation body is the World Climbing Athletes' Commission (see the prize source above).
- ⚪ **Systematic income survey of pro or World Cup climbers.** None exists publicly.
  - Keenable queries "professional climbers income survey sponsorship" and "climbing athlete sponsorship salary Instagram brands" returned only opinion pieces plus SEO spam sites with invented figures. Examples: data2.supportflex.nl claims "$100,000 first-place payout at the IFSC Bouldering World Cup", which is false against the €6,000 above; modestotoyota…dealeralchemist.com claims Janja earns "£500,000–£1 million". **Do not cite these.**
  - Exa search for "survey of professional climbers income …" found only an India survey of n=30 competitive climbers: "only less than 10% reported any form of direct financial sponsorship" — https://doi.org/10.46609/ijsser.2025.v10i09.020 (read via Exa highlights). Useful as a small-sample illustration only.
  - Not read: the agent interview podcast (Testpiece #101, Dave Burleson, "what pro's actually earn") at https://podcast.testpiececlimbing.com/101-dave-burleson/. It is audio, so no transcript quote is available.

---

### Q4. Comp-to-rock crossover examples
- ✅ **Adam Ondra.** Retired from comp bouldering, kept lead and rock: "the Prague round of the World Cup will be his final appearance in the boulder discipline … Ondra will continue to focus on lead climbing and outdoor rock projects" (2025) — https://climbingworldcup.cz/lastboulderdance-adama-ondry-2. In winter 2025–26 he flashed four 8C boulders, then returned to lead World Cups: "After a historic few months in which Adam Ondra flashed four V15 boulders … turning his attention back to lead climbing ahead of World Cup Prague 2026" — https://gripped.com/news/adam-ondra-flashes-fourth-v15-will-now-return-to-competitions. In October 2026 he also won the Rock Master KO Boulder (1c).
- ✅ **Janja Garnbret.** First 9a in 2017 at age 18: "has done her first 9a, Seleccio natural in Santa Linya and the 18 year old just needed five tries" — https://8a.nu/news/8c%2B-and-9a-by-janja-garnbret-18. 8C boulder: "Janja Garnbret has become the seventh woman to climb 8C, with her ascent of Bügeleisen Sit (f8C)" (2024) — https://ukclimbing.com/news/2024/05/janja_garnbret_becomes_7th_woman_to_climb_8c-73672. 9b+ Bibliographie in 2026: "Janja first tried the route after the 2024 Paris Olympics, and eventually climbed it on her fifth trip to Céüse." (UKC, 2c)
- ✅ **Toby Roberts.** "15-year-old Toby Roberts has climbed Rainshadow (9a) … becoming the youngest Brit to climb the grade" (2020) — https://ukclimbing.com/news/2020/12/rainshadow_9a_by_15-year-old_toby_roberts-72649. The 8a.nu snippet (not opened) mentions Batman 9a/+ and Hubble (2021). The latest crossover item is a brand/marketing stunt, not rock: an EA Sports FC 27 abseil from the London Eye (2026-09-30, search snippet).
- ✅ **Sorato Anraku.** Rarely climbs outdoors. "Sorato Anraku recently climbed Hōtō V14 (8B+) in Mizugaki, Japan … 'It had been 7 years since the last time in boulder,'" (Gripped, 2025-12-05) — https://gripped.com/news/sorato-anraku-climbs-outside-sends-v14/. Keenable found no outdoor 9a+ or 9b by Anraku.
- ✅ **Yannick Flohé** is the strongest current comp-to-rock bridge: "In August last year, he made the second ascent of The Ratstaman Vibration (9b), before making the fourth ascent of Excalibur (9b+) … In July last year, he became the first person ever to flash an 8C boulder" (UKC 2026-05, 2c URL).
- Also: **Sung Su Lee**, a former IFSC competitor, did the fifth ascent of Burden of Dreams. "On 12 May 2025 Sung Su Lee from South Korea made the fifth ascent" (search snippet; PlanetMountain article not opened). This is relevant for Asian readers.

---

### Errors in the brief, to correct
1. "Sebastian Halenke Project Big 2023": wrong. Schubert did B.I.G. on 2023-09-20.
2. "Laura Rogora 9b+": wrong. Rogora's Erebor is 9b/+. The two 9b+ women are Raboutou (2025) and Garnbret (2026).
3. "Katie Lamb Box Therapy 8C+": Box Therapy was later downgraded to 8C. Lamb's 8C+ now rests on The Dark Side (2025).
4. "USA Climbing Pro" league: not found.
5. "Red Bull Dual Ascent 2025–2026": no edition found after 2024.

### Source table
| # | Source | Used for | Read status |
|---|---|---|---|
| 1 | theactiveexplorer.com Psicobloc 2013 | Psicobloc origin | ✅ Jina |
| 2 | parkrecord.com 2019-04-29 | Psicobloc US end | ✅ Exa |
| 3 | b3sportainment.com Red Bull Creepers | Creepers origin | ✅ Exa |
| 4 | foxchattanooga.com 2025-07-25 | Creepers 2025 | ✅ Exa |
| 5 | laopinioncoruna.es 2026-08-24 | Psicobloc 2026 | ✅ Exa (partial, about 2 KB of the article) |
| 6 | archysport.com 2026-07 | Psicobloc returns | ✅ Exa (aggregator, low weight) |
| 7 | climbing.com Dual Ascent | DA 2022 | ✅ Exa |
| 8 | climber.co.uk DA 2024 | DA 2024 | ✅ Exa highlights |
| 9 | redbull.com DA event page | latest = 2024 | ✅ Exa |
| 10 | rockmaster.com tale | RM history | ✅ curl |
| 11 | planetmountain RM 2025 / RM 2026 KO | RM | ✅ Jina / Exa |
| 12 | lacrux RM 2025 | RM format | ✅ curl |
| 13 | 8a.nu RM Lead Duel 2026 | RM 2026 | ✅ Exa |
| 14 | planetmountain Melloblocco 2019 / 2025 | Melloblocco | ✅ Exa |
| 15 | calendariovaltellinese Melloblocco 2026 | 2026 dates | ✅ Exa |
| 16 | americanalpineclub.org 2024-11-01 | Hueco ends (AAC) | ✅ curl |
| 17 | en.wikipedia Hueco Rock Rodeo / kayaclimb | Hueco status | ✅ Jina (no post-2024 data) |
| 18 | goodbeta.co.za / bodhi.ch | Rocklands / Magic Wood | ✅ curl |
| 19 | inside-climbing.com / wiki PCL / climber.co.uk / UKC 2027 | PCL | ✅ |
| 20 | usaclimbing.org / wiki Japan Cup | national series | ✅ |
| 21 | climbing-history.org 9c, 9A, women's FA lists | grade lists | ✅ curl/Jina |
| 22 | wiki Silence | Silence status | ✅ Jina |
| 23 | lacrux 9c overview (2026-10-17) | 9c context | ✅ Jina (machine translation, one date error) |
| 24 | climbing.com/news/dna-repeat | DNA confirmed | ✅ curl |
| 25 | jakob-schubert.com blog-BIG | B.I.G. date | ✅ curl |
| 26 | UKC Bailey Duality of Man | 9c #4 | ✅ Exa |
| 27 | climbing.com Café Colombia | 9c #5, no 9c+ | ✅ Exa |
| 28 | planetmountain Exodia | 9A+ | ✅ Jina |
| 29 | UKC Flohé NOMTW | downgrade | ✅ Exa |
| 30 | UKC Garnbret Bibliographie | women 9b+, Biblio downgrade | ✅ Exa |
| 31 | climbing.com Raboutou Excalibur | women 9b+ | ✅ Jina |
| 32 | UKC Lamb 2023 / 2025 | women 8C+, Box Therapy downgrade | ✅ Jina |
| 33 | planetmountain Rogora Erebor | women 9b/+ | ✅ Exa |
| 34 | gearloop.app hardest boulders | "no woman 9A" | ✅ curl (low quality, contains an error) |
| 35 | worldclimbing.com prize 2026 | prize money | ✅ Jina |
| 36 | climbing.com ask-a-writer 2020 | income | ✅ Exa |
| 37 | climbinghouse.com | income (blog) | ✅ Exa (low weight) |
| 38 | grimper.com 2025 | France income | ✅ Exa highlights |
| 39 | climbing.com Alannah Yip 2024 | federation funding | ✅ Exa highlights |
| 40 | ijsser India survey | small survey | ✅ Exa highlights |
| 41 | wiki Free Solo / reelrocktour.com / gripped Reel Rock 20 | film | ✅ |
| 42 | wiki Lisa Rands | PCA (2000s) | ✅ Exa |
| 43 | climbingworldcup.cz / gripped Ondra | Ondra crossover | ✅ Exa |
| 44 | 8a.nu Janja 9a / UKC Janja 8C | Janja crossover | ✅ Exa |
| 45 | UKC Toby Rainshadow | Toby | ✅ Exa |
| 46 | gripped Anraku V14 | Anraku | ✅ Exa |
| — | Dawn Wall, The Alpinist, Testpiece podcast, PM Sung Su Lee, PM Melloblocco 2023 | — | not opened (snippets only); fetch before citing |

# 附錄 D：D-gap-closure

### D gap-closure (2026-10-18)

Tool log: Groundlane MCP = "MCP server not connected"; Groundlane HTTP POST = 401; Keenable search = OK (used for all discovery);
olympics.com live: curl hang / Exa 403+timeout / WebFetch 60s timeout / firecrawl, jina, cloudflare MCP = not connected -> used web.archive.org copies via curl (OK).
worldclimbing.com + images.ifsc-climbing.org PDFs: curl OK (ifsc-climbing.org/* redirects to worldclimbing.com; fetch the worldclimbing path directly).
planetmountain.com: curl 403 -> Exa web_fetch_exa OK. Raw texts saved in k-research/dl/.

### 1. Paris 2024 format + medallists — ✅
Source: Official Sport Climbing Results Book v1.0, 10 Aug 2024 (olympics.com PDF, archived)
https://web.archive.org/web/20240817190023/https:/olympics.com/OG2024/pdf/OG2024/CLB/OG2024_CLB_B99_CLB-------------------------------.pdf
- "There are four events in the sport climbing competition at the Olympic Games Paris 2024: women's boulder & lead, men's boulder & lead, women's speed and men's speed."
- "Athletes are ranked in each phase by the sum of the points collected in boulder and the points collected in lead. The maximum score in each stage is 100 points, which gives a maximum score of 200 points in each phase."
- "At the end of the semifinal phase, the eight highest ranked athletes progress to the final phase ... Points are not carried over from the semifinal phase to the final phase." (semis: 20 men + 20 women total field of 40)
- Boulder: 4 boulders on a 4.5m wall; "Scoring Hold / Points: Top 25, High Zone 10, Low Zone 5"; "The point score is reduced by 0.1 for each unsuccessful attempt (to the top or the zones) made prior to the athlete gaining the relevant scoring hold". **Correction: Paris used TWO zones (low 5 / high 10), not a single zone** (single 10-pt zone is the 2025 World Cup system).
- Lead: "The lead stage will be organised on a 15m high structure"; "The highest 40 holds of the lead route will grant points to the athletes." Top 10 holds = 4 pts each, next 10 = 3, next 10 = 2, next 10 = 1 (hold 40 = 100 pts, hold 30 = 60, hold 20 = 30). Plus-on-hold rules in book (not quoted).
- "Changes since the Olympic Games Tokyo 2020: Speed has been added as separate medal events for both men and women. The combined format from the Olympic Games Tokyo 2020 has been changed to include two stages instead of three, with a new scoring system."
- Medallists by Event table: Women's B&L GARNBRET Janja SLO / RABOUTOU Brooke USA / PILZ Jessica AUT; Women's Speed MIROSLAW Aleksandra POL / DENG Lijuan CHN / KALUCKA Aleksandra POL; Men's B&L ROBERTS Toby GBR / ANRAKU Sorato JPN / SCHUBERT Jakob AUT; Men's Speed LEONARDO Veddriq INA / WU Peng CHN / WATSON Sam USA.
Corroborating:
- World Climbing https://worldclimbing.com/news/garnbret-survives-injury-scare-for-second-olympic-gold — "Garnbret made the top step ahead of close friend and silver medallist Brooke Raboutou of the USA and bronze medallist Jessica Pilz of Austria."
- olympics.com (archived) men's B&L: "combined score of 155.2, enough to finish ahead of Japan's Anraku Sorato (145.4) ... ahead of Austria's Jakob Schubert (139.6), who won his second Olympic bronze." https://web.archive.org/web/2024/https://olympics.com/en/news/paris-2024-sport-climbing-results-anraku-sorato-mens-boulder-lead
- olympics.com (archived) men's speed: "Gold: Veddriq Leonardo (Indonesia) Silver: Wu Peng (People's Republic of China) Bronze: Sam Watson (USA)"; Watson WR 4.74 in bronze race; Leonardo 4.75 in final. https://web.archive.org/web/2024/https://olympics.com/en/news/paris-2024-sport-climbing-indonesia-veddriq-leonardo-wins-speed-gold-sam-watson-breaks-world-record-for-bronze
- olympics.com (archived) women's speed: "Gold: Aleksandra Miroslaw, Poland Silver: Deng Lijuan, People's Republic of China Bronze: Aleksandra Kalucka, Poland"; Miroslaw WR 6.06 in qualification. https://web.archive.org/web/2024/https://olympics.com/en/news/paris-2024-sport-climbing-aleksandra-miroslaw-wins-womens-speed-gold

### 2. Tokyo 2020 combined format + medallists — ✅
- olympics.com Tokyo 2020 sport page (archived 2021-07-02) https://web.archive.org/web/20210702085642/https:/olympics.com/tokyo-2020/en/sports/sport-climbing — "At the Games, each climber will compete in all three disciplines, and the final rankings will be determined by multiplying the placement in each discipline, with the athletes achieving the lowest scores winning medals."
- olympics.com (archived) https://web.archive.org/web/2021/https://www.olympics.com/en/news/top-five-things-to-know-about-olympic-sport-climbing-at-tokyo-2020 — "three different disciplines: Speed, Bouldering, and Lead for a single set of medals in a Combined competition ... the medallists will be the ones with the lowest score after the multiplication of the rankings ... an athlete who finishes first, second, and third ... will have a score of six."
- Men: World Climbing https://worldclimbing.com/news/first-ever-sport-climbing-olympic-gold-for-gines-lopez (05 Aug 2021) — "18-year-old Alberto Ginés López of Spain claimed the Olympic gold medal ... The USA's Nathaniel Coleman (24) and Austria's Jakob Schubert (30) won the silver and bronze medals, respectively."
- Women: World Climbing https://worldclimbing.com/news/gold-for-garnbret-in-olympic-games-sport-climbing-combined (06 Aug 2021) — "Japan's Miho Nonaka (24) and her teammate Akiyo Noguchi (32) walked away with silver and bronze medals"; "gold Olympic medal for Garnbret with a sensational score of 5.00 points, with Nonaka taking silver after securing 45.00, and a score of 64.00 putting Noguchi in third".

### 3. Boulder WC semi/final counts pre-2025 — ✅
- IFSC Rules 2024 v1.01 (images.ifsc-climbing.org) https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/z0nsb2xbnd773wnwznnz.pdf §8.6 (Boulder): "Registered competitors >20 → Quota 20"; "B) the quota for the Final round shall be six (6)." (Lead §7.7: semi quota 26.) B&L §11.5: semi 20, final 8.
- 2025 change, World Climbing https://worldclimbing.com/news/new-rule-changes-take-effect-for-ifsc-world-cup-series-2025 — "Boulder will now align with the Lead discipline with 24 semi-final places available, and eight for the final round." / "The previous number of Lead semi-finalists was 26." / "A points tally will comprise of 25 points for a Top and 10 points for the single zone on each boulder, with 0.1 points deducted for every unsuccessful attempt."

### 4. 2025 age categories — ✅ (with correction)
- IFSC Eligibility Code v1.0, Jan 2025 https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/hzf4qdfmb5vng25piqcd.pdf — §4.3 "International competitions may be organised for adult or youth age groups defined relative to the competitors' birth year as set out in Table 1 (Adult) or Table 2 (Youth)." Table 1 Open 2025 = "2008 or earlier" (i.e. turning 17 in the calendar year). Table 2 Youth 2025: U17 = 2009, 2010; U19 = 2007, 2008; U21 = 2005, 2006.
- World Climbing https://worldclimbing.com/news/helsinki-to-host-climbing-youth-world-championships-in-2025 — Helsinki 2025 Youth Worlds "will be the first one featuring competitors divided into two age categories instead of three: under 17 and 19, while in the past they were under 16, 18, and 20." → Youth Worlds = U17/U19 only; U21 exists in the Eligibility Code table (used for other youth/continental events), not at Youth Worlds. Event Regulations Jan 2026 also: "championship competition(s) for youth competitors in the U17 and U19 age groups".
- IFSC GA 2024 news https://worldclimbing.com/news/ifsc-national-federations-gather-in-santiago-for-xxi-general-assembly — agenda included "the proposal to adjust age categories at the Youth World Championships".
- Explicit "16 → 17" wording only found at national-federation level: Climbing NZ https://www.climbing.nz/2024/04/ifsc-changes-to-age-categories-for-2025/ — "previously athletes had to be at least 16 (Youth A) to be able to compete. It has now been announced that athletes will have to be at least 17." (IFSC primary confirms via birth-year table, not a sentence.)

### 5. Zhao Yicheng records — ✅
- 4.58: World Climbing https://worldclimbing.com/news/zhao-sets-new-speed-world-record (28 Apr 2026) — "Chinese teenager Yicheng Zhao has set the new men's Speed record lowering the world's best time to 4.58s ... posting a 4.58s time at the Asian Beach Games taking place in Sanya, China. In just his first senior start, Zhao lowered American Sam Watson's previous record of 4.64s which he set at the IFSC World Cup Bali 2025." Event = Asian Beach Games Sanya 2026 (confirmed).
- 4.54: World Climbing https://worldclimbing.com/events/world-climbing-series-wujiang-2026/news/zhao-breaks-world-record-on-way-to-gold (10 May 2026; event 08-10 May) — "Zhao clocked a 4.54s to Watson's 4.67s." (semi-final vs Watson); final "Zhao clocking 4.61s to Long's 5.63s"; article calls him "16-year-old Zhao".

### 6. Speed wall spec — ✅
- IFSC Speed Licence Rules – Speed Walls, 01/02/2022 https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/urwl7n2hnnyvhiwiq0xg.pdf — §1.1.1 "Heights: 15.00 m"; §1.1.2 "Width: 3.00 m + 3.00 m ... two climbing walls side by side"; §1.1.4 "The climbing walls must overhang regularly 5°" (tolerance "-0.5°/+1.5° (maximum between 4.5° to 6.5°)"); panels 1500×1500 mm; "Appendix I – IFSC Official Speed Route Map"; homologation "refers only to Speed wall 15 m, as the only one used in IFSC competitions."
- Paris results book glossary: "Speed: ... athletes race to the top of a 15-metre, slightly-overhanging wall, and on a standard route, with the support of an auto-belay from above."

### 7. Films / pro items — ✅
- The Dawn Wall: Variety review https://variety.com/2018/film/reviews/the-dawn-wall-review-sxsw-tommy-caldwell-1202727644/ — "Reviewed at SXSW Film Festival (Documentary Spotlight), March 11, 2018 / Running time: 100 MIN / Production: A Red Bull Media House production, in association with Sender Films / Directors: Josh Lowell, Peter Mortimer"; "In January 2015, over the course of 19 days, they scaled the legendary Dawn Wall section of El Capitan". Trento Film Festival 2018 https://trentofestival.it/en/archives/2018/the-dawn-wall — "Peter Mortimer, Josh Lowell United States, Austria / 2017 / 100'". → production year 2017, festival premiere/release 2018.
- The Alpinist: Guardian 23 Sep 2021 https://theguardian.com/film/2021/sep/23/alpinist-terrifying-ice-climbs-marc-andre-leclerc-solo-film — "Leclerc is the subject of The Alpinist, a gripping new documentary by Peter Mortimer and Nick Rosen"; "In March 2018, as filming neared completion ... Leclerc had gone missing while climbing with a local man named Ryan Johnson in Alaska"; "After successfully summiting a new route on the Mendenhall Towers, it seems they were consumed by an avalanche on the descent. Leclerc was 25".
- Reel Rock: official AU/NZ site https://reelrockfilmtour.com/news/reel-rock-20-australia-2026 — "Founded in 2005 by Josh Lowell, Peter Mortimer and Nick Rosen, creators of the iconic feature documentaries Valley Uprising, The Dawn Wall and The Alpinist, Reel Rock has grown into the premier global platform for award-winning climbing films." Reel Rock 20 (2026) tours AU/NZ Nov–Dec 2026; annual touring program of new short climbing films screened in cinemas/community venues ("Reel Rock World Tour").
- Sung Su Lee: PlanetMountain 23 May 2025 https://planetmountain.com/en/news/climbing/sung-su-lee-laps-up-burden-of-dreams.html — "On 12 May 2025 Sung Su Lee from South Korea made the fifth ascent of 'Burden of Dreams', the 9A boulder problem at Lappnor in Finland established in 2016 by Nalle Hukkataival." / "Lee's is the fourth repeat, after Will Bosi in April 2023, Simon Lorenzi in December 2023 and Elias Iagnemma in March 2024." / ~10 sessions; re-sent after t-shirt touched mat on first send.
- Melloblocco 2023: PlanetMountain 13 Mar 2023 https://planetmountain.com/en/news/climbing/melloblocco-returns-to-val-di-mello-val-masino-italy.html — "From 4 to 7 May 2023 Melloblocco, the world's biggest bouldering and climbing meeting, will return to Val di Mello - Val Masino, Italy." / "2023 heralds a new beginning after the enforced stop in 2019." PlanetMountain 5 Apr 2023 https://planetmountain.com/en/news/events/melloblocco-2023-a-return-to-its-roots.html — "Over 2000 climbers have already registered for the 16th edition"; "The first edition that took place in 2004"; "After the four-year stop that began in 2019".
