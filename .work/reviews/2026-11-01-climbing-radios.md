# 審稿紀錄：2026-11-01-climbing-radios（攀岩裝備 order 13）

檔案：`src/content/posts/climbing/2026-11-01-climbing-radios.md`、`-en.md`
日期：2026-11-01
審稿：獨立審稿人（未參與寫稿），依 `.work/climbing-gear-models/review-brief.md`；寫稿規格 `.work/climbing-comms/writer-brief.md`。研究檔 `.work/climbing-comms/R-radio.md`、`tmp-radio/` 只當線索。

工具降級（toolDegradation）：Groundlane `web_fetch` 對 law.moj.gov.tw 與 MIMIT 都 DEADLINE_EXCEEDED → 法規原文改用 curl 直抓全國法規資料庫、行政院公報 PDF、數位部頻率分配表 PDF、CEPT docdb、総務省頁、Brocardi；MIMIT 頁 curl 逾時、firecrawl 代理錯誤 → Exa `web_fetch_exa` 讀到全文；FCC 頁 curl 被擋 → Exa；臺北關、join.gov.tw、鉅亨網 → jina `read_url`。Groundlane `web_search` 可用（LP0002 修正沿革、日本特小頻段、Rocky Talkie 配件）。影片字幕用研究目錄 `tmp-radio/yt/` 的 vtt／txt 與 meta.txt（上傳日）。

## post-verify

### 法規（全部逐條）

| 宣稱 | 一手來源 | 結論 |
|---|---|---|
| 台灣 FRS：14 個頻率 467.5125–467.675 MHz，每 12.5 kHz；機體顯示頻道數 ≤14 | LP0002 第 5.5.1 點（行政院公報 026 卷 132 期 PDF） | ✅ |
| ERP 1 W 以下 | LP0002 5.5.3 | ✅ |
| 可用 CTCSS／CDCSS 靜音碼 | LP0002 5.5.14.1 | ✅ |
| 天線、功率放大器須一同審驗 | LP0002 5.5.10 | ✅ |
| 2024 年修正主要是新增 Wi-Fi 6E | NCC 113-02-06 通傳基礎字第 11365003290 號修正第 5 點（join.gov.tw 預告：配合開放 5.945–6.425 GHz） | ✅ |
| 頻率分配表 460–470 MHz 註「467.5125 - 467.6750 供 1W 以下低功率無線電對講機」 | 數位部頻率分配表（112 年 8 月修正）PDF | ✅ |
| NCC 回覆「FRS係免執照低功率無線電對講機」 | join.gov.tw 業餘辦法預告第 34 則回覆 | ✅ |
| 臺北關把無線對講機列入自用 5 部內免證 | 臺北關 FAQ（2024-06-26） | ✅（該頁引的是舊條號「管理辦法第 18 條、作業管理辦法第 8 條」；文章引現行第 9 條，正確） |
| 法源 K0060146 第 9 條：自行攜帶一次 ≤5 部免證 | 全國法規資料庫（114 年修正） | ✅；條文是「得以切結方式輸入」→ 已補「用切結方式」 |
| 電信管理法第 52 條：頻率應經核配、發給使用證明「始得使用」 | 全國法規資料庫 | ✅ |
| 第 74 條：未經核配擅自使用 50 萬元起 | 第 74 條第 3 項：50 萬–500 萬；干擾合法通信 100 萬–1,000 萬 | ✅ |
| 第 82 條：未領業餘人員執照操作業餘無線電 1–10 萬 | 第 82 條第 1 項第 5 款 | ✅ |
| 業餘辦法第 34 條：145、433 MHz 為「呼叫及緊急救難頻率」 | K0060145 第 34 條 | ✅ |
| 業餘機進口要核准證、6 個月內取得電臺執照，否則退運或監毀 | K0060146 第 8 條（自用行動式業餘電臺 2 部以內）、第 24 條 | ✅ 條文用語是「復運出口或報請主管機關監毀」→ 已改用語並補條號 |
| NCC 2010 談美規 DECT 6.0：販售或使用「將觸犯電信法而受罰」 | 鉅亨網 2010-12-31 | ✅ |
| 美規 FRS 8–12 頻道與台灣 FRS 五個頻率相同 | FCC FRS 頻道表 × LP0002 表（467.5625／.5875／.6125／.6375／.6625 對台灣 5、7、9、11、13 頻道） | ✅ |
| 美規 FRS 大部分頻道在 462 MHz | FCC：1–7、15–22 在 462 MHz | ✅ |
| FCC：licensed-by-rule、22 頻道、不得改裝須經認證、沒有頻道專屬 | FCC FRS 頁 | ✅ |
| GMRS 要 FCC 執照 | FCC GMRS 頁 | ✅ |
| ECC/DEC/(15)05：446.0–446.2 MHz、免個別執照、手持、只能機身天線、ERP ≤500 mW、「shall permit free carriage and use…」 | CEPT docdb PDF（2018-03-02 修正） | ✅ |
| MIMIT：依 DL 76/2020，PMR446 不用行政手續、不用繳費；通訊開放給符合第 145 條要件者 | MIMIT〈Dispositivi di debole potenza〉 | ✅ |
| 第 145 條：14 歲以上 EU／EEA 公民、互惠國公民、住義大利者 | Brocardi（更新至 2026-08-07） | ✅（註：第 145 條標題是 CB；把 PMR446 接到第 145 條的是 MIMIT 那句話，文章寫法沒錯） |
| 総務省 Q&A：FRS／GMRS 在日本使用違反電波法 | 電波利用ポータル 技適マーク Q&A 質問 23 | ✅ |
| 罰則「最重是 1 年以下拘禁刑」 | 同頁：1 年以下拘禁刑或 100 萬日圓以下罰金；妨害公共性高的無線局 5 年以下拘禁刑或 250 萬日圓以下罰金 | ❌ Contradicted → 已改（中英） |
| 日本特小：421／422／440 MHz 附近、10 mW 級 | JEITA 特定小電力無線機器解説集 | ✅ |

### 產品、評測、影片（抽查）

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Rocky Talkie Mountain Radio US$120、6.1 oz、1550 mAh、3–5 天「even in extreme cold」、IP56、Trango 鉤環＋備份繩、2 W | 原廠頁 | ✅ |
| Mountain Radio EU €102、0.5 W、PMR446 | 原廠 EU 頁 | ✅ |
| Expedition US$195、GMRS 5 W、IP67、「not legal for use outside the US」 | 原廠頁 | ✅ |
| Midland XT70 PRO €129（Twin）、IPX4、12 小時 | Midland Europe | ✅ |
| Midland T71 US$99.99／兩台、micro-USB | Midland USA | ✅；乾電池種類原廠 FAQ 寫 3 顆 AA → 已把「買之前看原廠手冊」改成直接引 FAQ |
| 「這個鉤環不是有鎖鉤環，可以另買鎖鉤座」／影片「可以另買 US$15 的鎖鉤座」 | Live That Adventure 字幕 8:12–8:26：US$15 是他替 Expedition 加買的 carabiner loop attachment；Mountain Radio 原廠配件表沒有鎖鉤座 | ❌ Contradicted → 已改（中英兩處） |
| Climbing.com 2024：Helmuth「60 m 內幾乎都能喊得通」、AMGA「put ourselves in voice range」 | Climbing.com 原文 | ✅ |
| Climbing.com 2025：「When using radios, don't chat」與老鷹例子 | Climbing.com 原文 | ✅ |
| Marmot Climbs 1:43／3:53／6:16 | 字幕 | ✅ |
| Live That Adventure 7:55（Trango 段 7:48 起）、9:30 替換電池 | 字幕 | ✅ |
| Outdoor Empire 14:36 不能換電池、17:21「lasts forever」 | 字幕 | ✅ |
| Giovanni Saccarola 4:03／5:11／6:41（175 g） | 字幕 | ✅ |
| Midlifeskier 4:02（100–500 ft）／4:40／5:17 | 字幕 | ✅ |
| TRH8A 0:55 混線／2:02 VOX | 字幕（ja） | ✅ |
| 影片上傳日都在 2024 年以後 | meta.txt：2024-06-24 至 2026-08-23 | ✅ |

合計：Confirmed 38、Outdated 0、Unverifiable 0、Contradicted 2（皆已修）。

## post-review

- frontmatter 齊全；series「攀岩裝備」order 13；tldr 與內文一致（14 頻道、頻段、€102、PMR446／FRS／技適）。
- 上下篇：上一篇 order 12 `2026-11-01-satellite-messengers-plb` 中文已存在、文末指向本篇「第 13 篇」；下一篇 order 14 `2026-10-19-climbing-gear-inspection-retirement` 已在更新紀錄寫明改為第 14 篇。連結格式正確（英文版都加 `-en`）。
- 中英對應：6 支影片 URL 與 start 一致、四張表型號一致、站內連結對應。`pnpm check:references` 通過。
- 結構：判準→型號→影片→口令→情境→檢查→練習題→下一步，符合規格。

## post-polish

register-scan：長句 13 句、但書 8%、數字密集段 8 段（多為頻率與法規，難以避免）。已把業餘無線電段落拆成兩段（「145／433 MHz」與「進口業餘機」分開，中英同步）。其餘不改。

## 直接修改（中英同步）

1. 免證輸入補「用切結方式」（K0060146 第 9 條原文）。
2. 業餘機進口：「退運或監毀」→「復運出口或報請監毀（同一辦法第 24 條）」。
3. 日本罰則：改成 1 年以下拘禁刑或 100 萬日圓以下罰金；干擾公共性高的無線電最重 5 年。
4. 判準 1：刪「可以另買鎖鉤座」，改「靠備份繩防掉」。
5. Live That Adventure 段：US$15 是替 Expedition 加買的有鎖鉤環掛座，註明 Mountain Radio 配件表沒有。
6. Midland T71 乾電池：改引原廠 FAQ「3 顆 AA 鹼性電池」。
7. 中文參考資料 TRH8A 影片標題改成 YouTube 原標題。
8. 業餘無線電段拆成兩段。

## 需要人判斷

1. 第 52／74 條套用到旅客帶進來的美規 FRS 是推論：第 52 條本身有「除本法另有規定外」，台灣 FRS 也不是逐一核配，而是走低功率射頻器材的審驗制度；對未審驗的機器，實際會用哪一條罰則沒有公開案例。文中已寫「法條的字面讀法」，但「50 萬元起跳」的數字仍容易被讀成定論。建議改成「最重可能適用第 74 條（50 萬元起），實際怎麼適用沒有公開案例」，或拿掉金額。
2. `2026-11-01-satellite-messengers-plb-en.md` 還不存在，英文版 3 處連結在它寫好之前會是死連結。
3. AAC 溝通指南（2017）、ANAC（2020）、Rocky Talkie 部落格（2022）早於 2024。它們都不是評測或價格，應該不受「2024 以後」規則限制，請確認。
4. 「登山圈常聽到的 145.00 就是這個」沒有附來源，算寫稿者的說法；研究檔記錄玉山中繼台的現況未確認。

## 主 session 處理（2026-11-01）

- 需要人判斷 #1：罰則語氣改為保留——刪「50 萬元起跳」，改寫為「第 74 條對未經核配使用頻率訂有罰則；第 52 條本身以『除本法另有規定外』開頭，是否／如何套到旅客個人對講機沒有公開解釋或處分案例」（中英同步；第 52 條原文對過 tmp-radio/dl/tml.txt）。
- 需要人判斷 #4：刪「登山圈常聽到的 145.00 就是這個」（無來源）。
- 需要人判斷 #2：satellite-messengers-plb-en 已存在，check:references 0 error。
- 需要人判斷 #3：2024 規則只管評測／影片／價格；AAC 2017、ANAC 2020、Rocky Talkie 2022 是指引與事故報告，保留（待使用者確認）。
