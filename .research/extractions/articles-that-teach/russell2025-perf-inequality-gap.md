# 抽取紀錄：Alex Russell 2025，The Performance Inequality Gap, 2026（部落格 Infrequently Noted）

- **書目**：Alex Russell. *The Performance Inequality Gap, 2026*. Infrequently Noted（作者個人部落格），2025-11-24 發表，2025-11-28 更新。系列「The Performance Inequality Gap」第八篇（L70–75）。作者名依頁尾「© 2001-2026, Alex Russell , infrequently.org」（L781）。不是同儕審查文獻；是作者個人的年度估計與評論。
- **取得網址與版本**：https://infrequently.org/2025/11/performance-inequality-gap-2026/ ，作者本人網站的公開網頁，合法公開，可用。抓取版本是 2025-11-28 更新後的版本（L72）。
- **原文檔**：`.research/raw/learning-content/q5-social/russell2026-perf-gap.txt`，782 行（`wc -l`）、47,466 位元組。同目錄 `russell2026-perf-gap.html`（143,466 位元組）是同頁的 HTML，只用來查正文超連結指向哪裡。
- **文字檔的缺漏**：頁面上的互動圖表（Core Web Vitals 通過率、手機出貨量、平均售價、Geekbench 分數、快取、製程、頻寬與延遲趨勢、RUM Archive 等）在文字檔裡只剩標題與資料來源行，**圖上的數值沒有讀到**。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 24（清單 F 第 24#12 列）

## 研究設計

- **類型**：個人評論加年度估計。不是實驗、不是調查研究；沒有方法節。數字來自作者整理的第三方資料（下列），再代入作者自己的「budget calculator」推出頁面重量預算。
- **資料來源（作者自述）**：
  - 頻寬與延遲：Cloudflare Radar（「Internet Quality Index」資料集）；上下行比例改查 Cloudflare 測速 API（L438、L600–602）
  - 頁面重量：正文沒寫來源，HTML 的超連結指向 HTTP Archive 的 page-weight 報告（https://httparchive.org/reports/page-weight）
  - Core Web Vitals：Chrome User Experience Report（CrUX），經 BigQuery（L138）
  - 手機出貨量與平均售價：IDC、Statista、Counterpoint Research（L209、L219）
  - CPU：GSMArena、Geekbench（L250 等）
  - 裝置分級：Microsoft Edge 使用者群的資料（L376–378；作者沒說明怎麼取得，原文只寫「Edge's population-level data」）
  - SPA 軟導覽：RUM Archive（Akamai mPulse）、Michal Mocny 的私下通訊（L536）
- **目標**：模擬「第 75 百分位」的使用者體驗，也就是四分之一的裝置與網路比這個基準更差（L87）。
- **沒有任何學習或閱讀理解的量測**：全文談的是網頁效能、裝置與網路，沒有一句連到學習成效。

## 結果（逐項）

| # | 結果 | 數字 | 條件／定義 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 2026 年的網路測試參數 | 下行 9 Mbps、上行 3 Mbps、RTT 100 ms | 模擬第 75 百分位 | L79–85、L418 | 「Updated network test parameters for 2026 are: 9 Mbps downlink 3 mbps uplink 100 millisecond RTT」 |
| 2 | 建議的測試裝置 | 手機 Samsung Galaxy A24 4G（或同級，MediaTek Helio G99／Exynos 1330 皆可）；筆電 HP 14（Celeron N4500，新品不超過 250 美元） | 同上 | L87、L177–195 | 「my updated recommendations are the Samsung Galaxy A24 4G (or equivalent) and the HP 14 . The goal of these recommendations is to emulate a 75th percentile user experience, meaning a full quarter of devices and networks will perform worse than this baseline.」 |
| 3 | 關鍵路徑資源預算（表） | 3 秒：JS-light 總 2.0 MiB（JS 0.3、其他 1.7）；JS-heavy 總 1.2（JS 0.62、其他 0.62）。5 秒：JS-light 3.7（0.57、3.2）；JS-heavy 2.3（1.15、1.15） | JS-light＝JS 佔 15%；JS-heavy＝佔 50%；以兩條 TLS 連線計 | L89–118 | 「Note: Budgets account for two TLS connections.」 |
| 4 | 開四條連線時的預算 | 3 秒預算減 350 KiB，變成 1.5 MiB／935 KiB；5 秒少將近半 MB，變成 3.2／1.9 MiB | 同上 | L120 | 「Using four connections cuts the three-second budget by 350 KiB , to 1.5 MiB / 935 KiB .」（見「不一致」第 1 條） |
| 5 | 作者對預算的評價 | 「極為寬鬆」 | — | L124 | 「These budgets are extremely generous. Even the target of three seconds is lavish」 |
| 6 | 行動版頁面重量中位數 | 2.6 MiB；P75 大於兩份 DOOM（2.48 MiB）；P90 以上大於 4.5 倍；十年來各百分位都翻倍 | 行動版網頁，來源依超連結為 HTTP Archive | L126 | 「The median mobile page is now 2.6 MiB , blowing past the size of DOOM (2.48 MiB ) in April. The 75th percentile site is now larger than two copies of DOOM.」 |
| 7 | 頁面重量的十年變化 | 中位數是十年前的 2.5 倍以上；P75 是 2015 年的 4 倍 | 行動版 | L128、L494 | 「Median page weights are more than 2.5x larger for mobile sites than a decade ago, and sites at the 75th percentile are now 4x their 2015 weight.」 |
| 8 | 行動版 JavaScript 量 | P50 680 KiB、P75 1.3 MiB；2015 年以來翻倍以上 | 行動版 | L130 | 「Mobile JavaScript payloads have more than doubled since 2015, reaching 680 KiB and 1.3 MiB at P50 and P75 (respectively).」 |
| 9 | Core Web Vitals | 行動版通過的 origin 不到一半；桌機仍有 40% 以上表現差；進步趨緩（圖的數值沒讀到） | CrUX | L134–138 | 「the latest CrUX data shows not even half of origins have passing Core Web Vitals scores for mobile users. More than 40% of sites still perform poorly for desktop users」 |
| 10 | 預算比 2024 年初的估計多 | 3 秒多 600+ KiB；5 秒多 1 MB | — | L148 | 「we're seeing budget growth of 600+ KiB for three seconds, and a full megabyte of extra headroom at five seconds.」 |
| 11 | 手機汰換 | 中位數手機用超過兩年；P75 裝置可能將近三年；TechInsights 估年汰換率 23.7% | — | L175 | 「the median smartphone now living longer than two years. P75 devices may be nearly 3 years old, and TechInsights estimates a 23.7% annual replacement rate.」 |
| 12 | iOS 出貨占比 | 過去十二年從未超過新機出貨的 20%（新機發表季可到 25%） | IDC 等 | L211 | 「At no point in the past dozen years has iOS accounted for more than 20% of new-device shipments.」 |
| 13 | 單核效能差距 | 低階 Android 比同期 iPhone 慢 9 倍；中階慢 3.5 倍以上 | Geekbench 6 | L279 | 「low-end single core performance is still 9x slower than contemporary iPhones, and mid-tier devices remain more than 3.5x slower」 |
| 14 | 低階 CPU 停滯 | 2022 年以來沒有實質進步（註 2 說 2020 年以來） | — | L254、L588 | 「budget device CPUs have not meaningfully improved since 2022.」 |
| 15 | 高階與低階銷量 | 低階機銷量是高階的 3 倍以上；低階新機跌破 100 美元 | — | L338 | 「high-end devices continue to be outsold more than 3:1 by low-end phones that aren't getting faster.」 |
| 16 | Wikimedia 的 iOS 占比 | 行動版造訪超過 40% 來自 iOS，但全球銷售比例從未超過 20% | Wikimedia 報告（原文沒附出處細節） | L352 | 「Wikimedia reports more than 40% of mobile site visits come from iOS devices over the past decade」 |
| 17 | 桌機 | 80% 的「桌機」是筆電、平板等電池供電裝置；只有 20% 完全有線；桌機（含筆電）只佔可上網裝置銷量 15–18% | IDC | L360、L368–372 | 「Desktops (including laptops) are only 15-18% of web-capable device sales」 |
| 18 | Edge 使用者裝置分級 | 低階 30%（≤4 核或 ≤4GB RAM）、中階 60%、高階 10%；低階從 2024 年初約 45% 降到約 30%（相對比例） | Edge 使用者群，2025 年底 | L380–410 | 「Low-end devices have fallen from ~45% to ~30% of the fleet.」 |
| 19 | 網路的變化 | 9/3/100 比 2024/2025 的 7.2/1.4/94 提高；作者說 2024 年的延遲估計大概低估約 15%，應是約 110 ms | Cloudflare Radar | L420 | 「2024's estimate for latency was probably off by ~15%, and should have been set closer to 110ms.」 |
| 20 | 要服務全球的團隊 | 應以比 9/3/100 更慢的網路設計，例如 5/1/100；應以 P95+ 使用者為準 | — | L422；註 2 L592 說應錨定 P90 或 P95 | 「the way to remain in user's good graces digitally is to build for the P95+ user.」 |
| 21 | 5G 覆蓋 | GSMA 2025 報告：名目 5G 覆蓋剛過 50%；覆蓋不等於服務 | — | L432 | 「nominal 5G penetration coverage just crossed the 50% mark in 2025」 |
| 22 | 下行頻寬 | 2024–2025 年停滯；最慢四分之一在 2023–2024 年從約 6 升到約 9 Mbps，中位數約 12 到約 17 Mbps | Cloudflare Radar | L440–444 | 「Connections representing the slowest quartile improved from ~6 to ~9 Mbps over the year, while median downlinks improved from ~12 to ~17 Mbps. They have not moved since.」 |
| 23 | 頻寬差距擴大 | P25 與 P75 的差距從 2024 年初 15 Mbps 擴大到 2025 年底 21 Mbps（+40%）；最底四分之一只快了 28%（約 7 到 9 Mbps） | 同上 | L446–448 | 「The performance inequality gap is growing at the network layer too.」 |
| 24 | 延遲 | P75 一年內從約 110 ms 降到約 100 ms；預測 2027 年約 95 ms | 同上 | L452–460 | 「a nearly 10% decrease at P75 over the past year, from ~110ms to ~100ms.」 |
| 25 | 一個網站的案例 | 某高成長網站 1–6 月每月多加近 100 KiB 關鍵路徑 JS，桌機造訪占比上升、行動版使用者比例每月下降；清掉後行動使用者回來 | 作者顧問案例，網站未具名 | L486–490 | 「A growing share of visits from desktop devices, and proportionally fewer mobile users every month. Once we began to fumigate for dead code and overeager preloading, mobile users returned.」 |
| 26 | SPA 的軟導覽 | RUM Archive：每次完整載入平均只有一次軟導覽；Chrome 的 Origin Trial 前一萬大 origin 的 N 在 1.6–2.2 | 自願參加量測的 SPA 網站；Chrome 資料是私下通訊的初步分析 | L502–536 | 「sites that are explicitly designed as SPAs … are seeing one (1) soft-navigation for every full page load on average.」 |
| 27 | 註 3：上下行比例 | 依 Cloudflare 測速資料，作者選 3:1；作者說 4:1 或 5:1 可能更合理，3:1 是「judgement call」 | 測速是使用者自己跑，偏向最佳情況 | L600–673 | 「Lacking better data, going with 3:1 is a judgement call, and I welcome feedback on the choice.」 |
| 28 | 註 4：各國 P75 | 英國 21/7/34；美國 17/5.5/47；巴西 12/4/60；全球 9/3/100；印尼 6.4/2.1/75；印度 6.2/2.1/85；巴基斯坦 4/1.3/130；奈及利亞 3.1/1/190（下行／上行 Mbps／RTT ms） | Cloudflare 國家層級資料 | L689–740 | 表列。作者另說資料可能偏向富裕使用者，理論上該用 P90，但今年仍用 P75（L679–685） |

## 作者自己列的限制

1. Cloudflare 的資料可能偏樂觀：富裕使用者連線較好、使用量較大，資料偏向他們；作者認為理論上應取 P90 而非 P75，仍用 P75 的理由是沿襲過去的做法、缺乏可三角驗證的資料（L679–685）。
2. 上下行比例 3:1 是判斷，不是量出來的（L673）。
3. 測速資料是使用者主動跑的，偏向最佳情況，且報的是峰值（L602）。
4. Android 晶片的快取大小有些是估計（L264）。
5. 全年 2025 平均售價是從前幾季外推，可能上修（L220）。
6. Edge 資料看不到更舊更慢的裝置，也不含 Chromebook（L412）。
7. SPA 軟導覽的結論是「surprising and tentative」（L580），註 6 列出一串未解問題（分布、其他資料源是否一致、無限捲動怎麼算等，L754–772）。

## 與摘要說法不一致的地方

這是部落格文，沒有摘要；拿開頭的「The Budget, 2026 Edition」節當摘要對照正文，數字一致（9/3/100、裝置、預算表）。正文內部有幾處算不攏或前後不一，照實記錄、不猜哪個對：

1. **四條連線的預算**（L120）：2.0 MiB 減 350 KiB 約 1.66 MiB，原文寫 1.5 MiB；1.2 MiB 減 350 KiB 約 878 KiB，原文寫 935 KiB。可能作者的計算不是單純相減，原文沒說明。
2. **最慢四分之一的頻寬起點**：L444 寫「from ~6 to ~9 Mbps」，L446 寫「improving from ~7 to 9 Mbps」，期間也不同（前者是 2023-11 到 2024-11 一年，後者是 2024 年初到 2025 年底）。
3. **低階 CPU 停滯的起點**：L254 寫「since 2022」，註 2（L588）寫「since 2020」，註 4（L596）寫低階製程「stuck since 2021 at 12 nm」。
4. **註 3 的上下行表**（L606–659）：30th 列下行 10、上行 30，40th 列下行 20、上行 50，上行大於下行而比例欄寫 3 與 2.5；25th 列下行 25 大於 30th 的 10。文字檔可能把欄位轉錯，也可能原頁就這樣；沒對過原頁版面，不確定。
5. **錨定百分位**：開頭以 P75 為準（L87），L422 說要「build for the P95+ user」，註 2 說應錨定 P90 或 P95（L592）。這是作者有意的分層建議（一般基準 vs 想服務全球的團隊），不是錯誤，但引用時要說清楚是哪一層。

## 與清單「要撐的結論」不合的地方

清單（24#12）：「第 75 百分位的測試條件；行動版頁面重量」。

- **第 75 百分位的測試條件**：撐得住。9 Mbps／3 Mbps／100 ms、Galaxy A24 4G、HP 14（L79–87）。要一起寫：作者自己說這組數字可能偏樂觀，認為理論上該用 P90（L681）；全球型服務應以 P90／P95 為準（L592）。
- **行動版頁面重量**：撐得住，中位數 2.6 MiB、JS 中位數 680 KiB（L126、L130）。但這兩個數字是作者轉述 HTTP Archive，正文沒寫資料月份（只說 DOOM 的比較是「in April」）；引用時寫成「Russell 引 HTTP Archive」，要更準就回到 HTTP Archive 或已列為備選的 Web Almanac 2025。
- 清單「沒有可精讀的來源」一節說「頁面載入慢或頻寬低對學習成效：沒找到研究；只能寫頁面重量與裝置條件的量測，不能接到學習」——這篇原文確實完全沒有談學習或閱讀，只能用在「讀者的裝置與網路是什麼樣子」那一層。L486–490 的網站案例談的是行動使用者流失，不是學習，而且網站未具名、沒有數字，不宜引用為證據。
- 作者用語強烈（「ethical crisis」「privilege bubble」「malpractice」，L140、L374、L414），是評論立場；文章若引用要標成作者的主張。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–76 | 站台頁首、導覽、系列與熱門文章清單（雜訊）、題目、日期、系列說明 |
| 2 | L77–168 | The Budget, 2026 Edition：網路參數、裝置、預算表、連線數、頁面重量、JS、CWV、作者評論、目錄 |
| 3 | L169–225 | Recommended Test Devices and Settings、The Big Story Is Still Low-End Android |
| 4 | L226–355 | The Landscape／Mobile、Market Trends、Rise of the Refurbs |
| 5 | L356–415 | Desktop、Evidence From the Edge User Base（裝置分級表） |
| 6 | L416–475 | Networks、Bandwidth、Latency、Looking Forward |
| 7 | L476–543 | Content Trends、Are SPAs Working?（含平均延遲公式） |
| 8 | L544–583 | Analysis and Conclusions、致謝 |
| 9 | L584–782 | 註 1–6（含上下行比例表、各國 P75 表、SPA 未解問題）、上下篇連結、版權頁尾 |

一次讀完 L1–782。另用 `python3 -I` 在 HTML 檔查頁面重量、預算計算器、Throttly、RUM Archive 附近的超連結，確認頁面重量指向 HTTP Archive。圖表數值沒有讀（文字檔沒有）。
