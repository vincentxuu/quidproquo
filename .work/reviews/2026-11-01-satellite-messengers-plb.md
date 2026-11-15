# 審稿紀錄：2026-11-01-satellite-messengers-plb（攀岩裝備 order 12）

檔案：`src/content/posts/climbing/2026-11-01-satellite-messengers-plb.md`、`-en.md`
日期：2026-11-01
審稿：獨立審稿人（沒有參與寫稿），照 `.work/climbing-gear-models/review-brief.md`；寫稿規格 `.work/climbing-comms/writer-brief.md`；研究線索 `.work/climbing-comms/R-satellite.md`、`tmp-sat/`（只當線索）。
逐條查證表：`.work/reviews/evidence-2026-11-01-satellite/verify-A.md`（國際、BPL、T-Mobile）、`verify-B.md`／`verify-B-yt.md`（機型規格、Garmin 流程、影片起播時間）。台灣部分由主審親自重開，結果在下表。

工具降級（toolDegradation）：台灣頁面以 curl 直接抓原頁（全國法規資料庫、行政院公報、中華電信、Garmin 台灣、航港局、消防署、各縣市法規系統、宜蘭／新竹消防局、新竹縣府、聯合報、前進新聞網、馬布谷、台灣大）；消防署 Threads 以 jina reader 讀到；ncc.gov.tw 被 Cloudflare 擋：Groundlane web_fetch（challenge_response、無文字）→ Exa（CRAWL_EMPTY_CONTENT）→ jina（只回外框）→ firecrawl（額度用完），整條鏈失敗。子代理：Groundlane 可用；t-mobile.com、coloradosar.org 擋 curl，改 Groundlane render=always；Garmin 支援頁 curl 被擋、Groundlane 串流中斷 → firecrawl 讀到 en-US FAQ，nb-NO 頁只拿到 Keenable 搜尋摘要。

## post-verify

結論統計（三部分合計）：Confirmed 152／Outdated 1／Unverifiable 4／Contradicted 4。

### 台灣（主審逐條核對）

| 宣稱 | 來源（2026-11-01 讀） | 結論 |
|---|---|---|
| 中華電信：雙證件實名拿註冊碼；「電信服務必須落實實名制」；基本服務免費 | cht.com.tw garMINInpromo | ✅ |
| 中華電信：銥衛星在台「並不能提供通話服務」，SBD 簡訊 | 同上 | ✅ |
| Mini 2 NCC 字號列在中華電信頁 | 同上（CCAA22GS0010T4） | ✅ |
| IERCC 通知「陸域為消防署；海域為海巡署」 | 同上 | ✅ |
| Garmin 台灣 Mini 3 NT$14,990 | garmin.com.tw（price=14990） | ✅ |
| 台灣方案四種、啟用費 TWD 1,310、「所有方案皆包含緊急 SOS」、管轄區提醒 | garmin.com.tw 方案頁 | ✅ |
| 射頻器材辦法 §9Ⅰ⑥ 排除行動衛星地球電臺 | law.moj K0060146（114-02-03） | ✅ |
| 同辦法 §16 外國人自用行動衛星地球電臺免核准證、限一部 | 同上（限一部適用免簽／停留簽證者） | ✅ |
| 同辦法 §29 PLB 持有者向航港局登錄 | 同上 | ✅ |
| 航港局規範引文「持有者購買PLB時須先向廠商確認…416國碼…」 | 行政院公報 114-10-09 航安字第1142011997號 | ✅ |
| 七個工作日內送 IBRD | 同上 | ✅ |
| 國內由 TAMCC 接收、國外由鄰近 MCC 接收且 TAMCC 也收；確認非誤發後通報 | 同上 | ✅ |
| 誤觸打 02-2701-3400 | 同上 | ✅ |
| TAMCC 設在民航局、委中華搜救協會維運 | 航港局「未來展望」頁 | ✅（原文是「將委由」，未改；見需要人判斷） |
| 消防署 2025-04 九仙山：先聯繫地面聯絡人，再通報空勤與臺中市消防局；約 20 小時；當年第 4 件 | 消防署 Threads（4/6 13 時通報 → 4/7 9 時接觸） | ✅ |
| 宜蘭安平坑林道 2024-03，搜索 14 小時 | 宜蘭縣消防局（上版 113-03-20） | ✅ |
| 苗栗佳仁山 2025-01，隔天空勤救出 | 前進新聞網轉述消防署（1/7 通報、1/8 上午救出） | ✅（二手，文中已標轉述） |
| 南投栗栖溪 2025-06，「無法撥打112」，2:21 員警抵達、繩索協助 | 新竹縣消防局轉載 | ✅ |
| 品田山 2026-01 約 16.5 小時 | 新竹縣政府（1/6 20:01 → 1/7 12:35） | ✅ |
| 南湖當天找到、奇萊約 1.5 天，沒按 SOS、追蹤中斷後報案 | 聯合報 9670069 | ✅ |
| 6 縣市有搜救收費條文、2016–2018 制定未修、實支含航空器 | 臺中 GL003013（105-11-24）、高雄 GL001547（107-11-05）原頁＋各縣市快取 | ✅ |
| 「上限是保額，例如臺中依路線公告 30 萬或 50 萬」 | 臺中 §14 上限＝§6Ⅳ 保險金額；30／50 萬是市府公告的**最低**保額 | ❌ 已改寫（見下） |
| 高雄只在違規時收 | 高雄 §6 | ✅ |
| 新北等無條例 | 只有中央社 2026-09、監察院「僅 6 縣市」間接佐證；新北法規系統沒查成 | ✅（間接） |
| 消防署輔導 3 家團體租借＋留守平台 | 消防署 113-08-03 新聞 | ✅ |
| 馬布谷每天 50 元（原價 100、消防署補助）、最少 3 天、押金 3,600 | mabuvalley.com | ✅ |
| 警政署入山系統建議攜帶 inReach | nv2.npa.gov.tw（111/10/21 公告） | ✅ |
| 台灣大 2026-03 與 AST SpaceMobile | 台灣大新聞稿（合作備忘錄） | ✅；文中「簽約」改「簽的備忘錄」 |
| NCC 2022「無法全面涵蓋」＋呼籲帶 PLB／衛星電話 | ncc.gov.tw 整條鏈讀不到 | Unverifiable（研究檔有 firecrawl 讀到的引文；引文出自 47094 而非文中連的 47360，已補連結） |
| tldr／判準 3「台灣近年幾起…（常）要 14–20 小時」 | 宜蘭 14、品田 16.5、九仙山 20；南投數小時、苗栗約一天 | 範圍過寬，改「有三起」 |

### 國際、手機衛星 SOS、BPL、T-Mobile（子代理 A，主審抽查 T-Mobile 原頁與 COSPAS-SARSAT 快取）

30 條：27 ✅、1 Outdated、1 Unverifiable、1 Contradicted。

- Apple 支援名單（台灣不在、義大利／日本在；排除購自亞美尼亞、白俄羅斯、中國大陸等）、轉接中心語言、Pixel 名單（義大利有、日韓台無）：✅。「First, try calling the local emergency number」在 Apple 101573，不是 105097（文中沒連結，未改）。
- COSPAS-SARSAT：台灣 Y/Y/Y、日本「Land activations are prohibited and subject to penalty by radio law」、韓國 N、奧地利／瑞士陸上轉警察與「Appropriate SAR action cannot be guaranteed」：✅（主審也在快取核對奧地利、瑞士、日本原句）。
- 義大利「只規定義大利國碼信標向 Bari 登錄」：Unverifiable。COSPAS 頁沒有 Bari；出處是 Cospas-Sarsat Italy 問答，且「只」「對外國旅客沒寫」是推論 → 已改寫成引原文＋標明沒寫，補連結。
- BPL 表格數字（170 次、三環境秒數、深谷失敗率 0/1/4/21/18%）、Globalstar 不互轉的解釋：✅。日期 Outdated：表格 2024-11-15 更新，全文 2025-12-02 → 已改標示。
- **T-Mobile**：一手頁面找到。國家名單（美、加、紐、日）✅，出處是國際漫遊頁而非衛星頁 → 改連結。「要用 T-Mobile 的方案」Contradicted：衛星頁寫「You don't even have to be a T-Mobile member to get it」，出國才需合格方案且住在美國 → 已改寫（主審 Groundlane 親讀衛星頁確認）。5–10 秒是 Backpacker 自己的實測（原文「Under an open sky, T-Sat can deliver messages in a matter of 5 to 10 seconds」），保留並標「實測」；T-Mobile 沒有官方秒數。
- Rega（alarm@rega.ch、只限瑞士與邊境、直升機平均約 4,500 瑞郎）、Bergrettung NÖ/W €612／時、CAI 112／118 與無 SIM 引文、GeoResQ 兩說、DAV SOS EU ALP、Garmin 2025 年報 >3,000 件／>12%、Colorado SAR 約三倍功率、Parks Canada 引文、Ocean Signal「carry both」、Outdoor Life 70 分鐘：✅。
- AAC Papert：引文 ✅；發 iPhone SOS 的是繩伴 Emilie Pellerin → 改「靠繩伴的 iPhone」。
- Backpacker 參考資料日期 2026-06-10 → 2026-08-18。

### 機型、Garmin 流程、影片（子代理 B，主審抽查 Meg 字幕與 Messenger Plus 規格行）

99 條（網頁 39＋影片 60）：95 ✅、2 Contradicted、2 Unverifiable。

- Garmin 美國方案 US$7.99–49.99、啟用費 39.99、FAQ 引文（暫停保留 SOS、派遣、費用自付、不准測試）、手冊「關機也能按」、20 秒倒數、低溫充電、v5.03（2026-02-10）原文：✅。另有第二筆 v5.03（2026-04-01「Fixed potential issue with messages not being delivered」），現行 7.01（2026-08-26）。
- 規格與價格（Mini 3／3 Plus、Messenger Plus、ZOLEO、ResQLink 400／View、PLB1、SPOT X／Gen4、ZOLEO 方案與暫停引文）：✅。
- Messenger Plus「預設模式約 120 小時」Contradicted：120 h 是低耗電、每 2 分鐘；效能模式 10 分鐘是 110 h → 改。Mini 3 Plus「預設模式 95 h」Unverifiable（原廠寫效能模式，沒說是預設）→ 改「效能模式」；表格缺點欄改「同樣效能模式下」。
- 評測（DC Rainmaker、Treeline、Backpacker、Switchback、Alpine Savvy、LA Times）：✅。
- 影片 13 支：URL、標題、頻道、日期（全部 2024 以後）、主起播時間 ✅。修正：Meg 心得版連結 3:24 → 4:21（主審看字幕確認 3:24 是行動電源）；Meg 主片「2:01 起」→ 2:37；HikingGuy 窄峽谷 7:20 → 6:44；Chase the Summit「同一地點」字幕沒講 → 刪；Adventure Otaku 說明欄有聯盟連結，補上；ACR 寫的是「信標登錄」2 年，不是 IBRD 專屬；挪威文版 → nb-NO 頁面（頁面是英文）；救援保險補「含屬地」；判準 5 天線描述限定 Mini 3 Plus。

## post-review

- frontmatter：tags 都在白名單；`check-post-quality` 只警告 `mountaineering` 沒有對應詞（內文講高山攀登，可保留或刪）。series 名稱、order 12 正確；中英 42 個標題對齊、影片區塊數一致，數字集合只差英文多寫的 300,000／500,000（中文寫 30 萬／50 萬）。
- 結構：判準（6 個，各有「今晚就能做的事」）→ 台灣 → 出國 → 型號表 → 影片 → 流程與費用 → 情境 → 檢查 → 練習題 → 下一步，符合規格。
- 系列連結：上一篇 cams 的「下一步」已連到本篇與 order 13；本篇下一步連 `2026-11-01-climbing-radios`（存在）；站內 11 條連結都存在，英文版都用 `-en`。
- `check:tw` 0 blocking（主審改稿時誤寫「用戶」已改「客戶」）；`check-lang-parity` 無問題；`check:references` 0 error。
- **長度**：去掉 code block 與參考資料後中文約 2.06 萬字（含參考資料約 2.4 萬），超過規格 1.5–2 萬。建議刪減（未動手）：
  1. 「實測與心得影片」每支說明 150–200 字，壓到 80 字左右，省約 1,500 字。
  2. 「手機衛星 SOS：不是型號，但要知道它的極限」和判準 2、台灣節、出國節重複；留 T-Mobile 與 Papert 衝突兩條，或併進判準 2，省約 500 字。
  3. 型號表後的「Treeline 品牌標錯」「評選結果不一致」兩條可刪，省約 400 字。
  4. 「備註款與不收的」只留 SPOT X 一句，PLB3、Motorola、ResQLink View 可刪，省約 200 字。
  5. 「依情境怎麼挑」的日韓段和練習題 4 重複，留一個，省約 200 字。
  6. 「要準備回答的問題」與判準 1 的練習重疊，可併，省約 200 字。

## post-polish

- `register-scan.sh`：長句 9 句（61–80 字：Treeline 引述、Alpine Savvy、NCC 三件事、TAMCC、v5.03、Switchback、Papert 衝突、T-Mobile）；但書 12%；引述區塊 1（航港局規範原文，保留）；研究者姓名當主詞 1；模板化轉折 0；英文術語 0。主審改寫 T-Mobile 句後仍偏長，建議拆成「速度」「誰能訂」「哪些國家」三句。
- 數字密集段 8 段（CAI 112、重量說法、Mini 3 Plus 送不出、中文訊息長度、SPOT、DC Rainmaker、HikingGuy 半年）：多是讀者要用的門檻；影片說明段可配合長度刪減一起處理。
- `scan-ledger.sh` 0 命中。

## 直接修改清單（中英同步）

1. tldr「幾起」→「有三起」。
2. 判準 3 同上。
3. 台灣大「簽約」→「簽的備忘錄」（英文原本就寫 memoranda）。
4. 搜救收費：補「公告管制山域、由縣市搜救」條件；30／50 萬改為臺中公告的最低保額。
5. NCC：「無法全面涵蓋」補 2022-02（47094）連結，參考資料加一筆。
6. 判準 2 BPL 日期標「測試表 2024-11 更新」。
7. 參考資料 BPL 日期改 2025-12-02＋測試表 2024-11-15。
8. 參考資料 Backpacker 日期改 2026-08-18。
9. Papert：改成繩伴的 iPhone 衛星 SOS。
10. 義大利 PLB：改引 Cospas-Sarsat Italy 原文、標明沒寫外國信標，參考資料加一筆。
11. T-Mobile：改寫訂閱條件、改連國際漫遊頁、5–10 秒標 Backpacker 實測，參考資料加一筆。
12. Mini 3 Plus 電池「預設模式」→「效能模式、每 10 分鐘一則」。
13. Messenger Plus 電池 120 h → 效能模式 110 h。
14. 表格缺點欄「預設模式」→「同樣效能模式下」。
15. Meg 心得版連結 3:24（t=204）→ 4:21（t=261）。
16. 判準 5 天線「Mini」→「Mini 3 Plus」。
17. HikingGuy 窄峽谷 7:20 → 6:44。
18. Chase the Summit 刪「同一地點」。
19. Meg 主片 2:01 → 2:37。
20. 倒數時間「挪威文版」→「挪威區（nb-NO）頁面」。
21. Garmin 救援保險補「含屬地」。
22. Adventure Otaku 補「說明欄有聯盟連結」。
23. 訂閱表 PLB 列與檢查清單：「IBRD 登錄效期」→「信標登錄效期」（各 1 處）。
24. 「用戶」→「客戶」（主審改稿時寫錯，`check:tw` 抓到）。

## 需要人判斷

- 判準 5「我自己多繩距時會放在身上的口袋，或用短繩加有鎖鉤環接在吊帶後方的裝備環」是第一人稱做法、沒有來源：要確認這是作者本人的習慣，不是就改成中性寫法。
- Meg 在同一支影片 7:04 又說先生是「our emergency contact」，和 4:21「先生沒登記就問不到」互相矛盾；要不要改成保留語氣。
- TAMCC 維運：航港局原文是「將委由」中華搜救協會（未來式），文中寫成現況；要另找現況來源或改語氣。
- 新北市沒有搜救收費條例只有間接佐證（「僅 6 縣市」），法規系統沒查成。
- NCC 兩則新聞稿這次整條鏈讀不到，沿用研究檔的 firecrawl 引文。
- Mini 3 韌體：要不要補第二筆 v5.03（2026-04-01）與現行 7.01。
- 長度：上面 6 項刪減建議要不要做。
- tag `mountaineering` 留或刪。

## 主 session 處理（2026-11-01）

- 第一人稱「我自己多繩距時會放在身上…」無來源且非使用者實際做法 → 改為「本文建議…這是從墜落後還拿得到推出來的，沒找到原廠或嚮導書面建議」；「我的做法是先撥 112」→「本文的建議是」（中英）。radios 篇同類句一併改。
- Meg 影片先生是否登記：改為並列她前後不一致的說法。
- TAMCC：改為航港局原文「將委由」，不寫成已委託。
- 移除 mountaineering tag（內文無對應）。
- 未處理（交使用者）：長度刪減、v5.03 第二次與 7.01 韌體是否提、新北市（法規系統查無＝已有直接查詢證據，維持）。
