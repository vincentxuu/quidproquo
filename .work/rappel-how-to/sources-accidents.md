# 垂降文：事故資料與失敗模式（來源證據）

研究日期：2026-10-24。範圍：專業／一手來源的垂降事故統計與案例。
工具鏈紀錄（toolDegradation）：Groundlane MCP 需要 OAuth（`mcp__claude_ai_groundlane__authenticate`，沒有授權）；Groundlane 直接 HTTP POST 回 401（Bearer OAuth）→ 改用 Keenable keyless 搜尋＋`curl` 抓頁面／PDF（全部成功，下面的頁面都有打開）。

---

## A. 量化資料（有數字）

| # | 數字 | 量的是什麼 | 時間範圍 | 來源／作者／日期 | URL | 已開 |
|---|---|---|---|---|---|---|
| A1 | **251 件 rappel error，其中 76 件致死（近 30%）**；所有事故的致死比例約 20%（我用原始資料重算：2,724 件攀登事故中 563 件致死） | AAC 事故報告用 NLP＋人工標記（非 AAC 官方分類） | ANAC 出版年 1990–2019（多為 1989–2018 年的事故） | Eliot Caroom，Rock & Ice #265（2020-09）；Climbing.com 重刊 2022-02-14 | https://rockandice.com/climbing-accidents/30-years-of-climbing-accident-data-an-investigative-report ；資料集 https://github.com/ecaroom/climbing-accidents （CC BY 4.0） | 是（文章＋下載 xlsx 自己重算） |
| A2 | 下撤事故 865/2,724 件 ≈ **32%**；**rappel error 是下撤事故中最常見的因素，佔 29%**；下撤事故中 Stranded 14%、Visibility 14%、No backup or end knot 12% | 同上資料集 | 同上 | 同上 | 同上 | 是 |
| A3 | 我用資料集重算：rappel error 佔全部攀登事故 **9.2%**（251/2,724）；致死事故中 **13.8%** 帶有 rappel error 標籤；rappel error 的共同標籤：**No Backup or End Knot 67 件（27%）**、**Anchor Failure/Error 66 件（26%）**、Stranded 46、Late in Day 31、Knot & Tie-in Error 26 | 我的重算（Caroom 標籤），不是作者原文的數字 | 1990–2019 出版年 | 自行計算，腳本在 scratchpad | 同上 xlsx | 是 |
| A4 | 對照：lowering error 79 件，致死 7.6%；rappel error 致死 29.9% | 同上重算 | 同上 | 自行計算 | 同上 | 是 |
| A5 | ANAC Table III「Rappel Failure / Error」當作直接原因：**美國 1951–2016 累計 414 件**（同期美國事故總數約 6,056 件 → 約 6.8%）；加拿大 1959–2016 共 55 件；**2017 年美國 15 件、加拿大 3 件**。註腳：這類包括「inadequate anchors, uneven ropes, no knots in rope ends, simul-rappelling errors, pendulum swings, and attaching device incorrectly」；Lowering Error 2016 年才分出來，之前的年份可能混入下放事故 | AAC 官方年度資料表 | 1951–2017 | AAC，*Accidents in North American Climbing 2018*（資料表 p.123–125） | https://aac-publications.s3.amazonaws.com/publications_2018/AAC_Accidents2018.pdf | 是（PDF 有抽出表格） |
| A6 | 同一張表：1951–2016 美國下撤事故 1,413 件、上攀 4,295 件 | 上攀／下撤分類 | 1951–2016 | 同上 | 同上 | 是 |
| A7 | **2023 年版 ANAC（多為 2022 年的事故）收錄 14 件垂降事故，其中 8 件致死**；**2025 年版 ANAC 的資料表：15 件垂降事故、23 名攀登者、5 人死亡**；「趨勢沒有減緩的跡象」 | AAC 編輯部整理的垂降事故數 | 2023 年版、2025 年版 ANAC | AAC〈The Prescription—Rappel Fatalities〉，2025-06-25（Pete Takeda 等） | https://americanalpineclub.org/news/2025/6/25/the-prescriptionrappel-fatalities | 是 |
| A8 | 2022 年有 **2 起**致死事故是因為垂降固定點的扁帶斷掉（其中一起是 Tahquitz：日曬褪色的單條扁帶，RMRU 拉力測試斷在 **2.54 / 3.56 / 3.2 kN**） | 案例＋測試數據 | 2022 | 同上（引 Riverside Mountain Rescue Unit 報告） | 同上 | 是 |
| A9 | 2024 年北美 210 件事故中，上攀時 100 件、**下撤時 46 件**（46 件不明、11 件都不算）；ANAC 認為「垂降的名聲比實際更差」，這個比例和歷史資料差不多 | ANAC 2025 資料表（二手報導） | 2024 | Climbing.com〈9 Interesting Stats From 210 Climbing Accidents Last Year〉（2025） | https://www.climbing.com/news/9-takeaways-climbing-accidents-2024/ | 是（二手：雜誌轉述 ANAC 資料） |
| A10 | 「垂降失誤、下攀找錯路、在暴露地形滑倒，**某些年份合計約佔嚴重事故 30%**」（作者註：用 1951–2023 ANAC 歷史資料計算） | 合計三種下撤問題，不是只算垂降 | 1951–2023 | Dr. Valerie Karr，〈Know the Ropes: Human Factors Behind Climbing Accidents〉，ANAC 2025 | https://publications.americanalpineclub.org/articles/13201217363 | 是 |
| A11 | 1996 年版 ANAM：美國「Rappel Failure/Error」**過去十年平均每年 5 件**，前一年 12 件，當年 15 件；至少一半發生在 top-rope 岩場 | 年度件數 | 約 1985–1995 | AAC／ACC Safety Committee，*ANAM* 第 49 期（1996） | http://publications.americanalpineclub.org/articles/13199600100/ | 是 |
| A12 | **奧地利：9 件垂降事故，4 人死亡**；作者說「事故數和死亡數的比例非常不利」 | 奧地利 Kuratorium für alpine Sicherheit 的 Alpinunfalldatenbank（只有通報的事故） | 2012-11-01 – 2014-08-25 | Walter Würtl、Andreas Würtele，〈Kletterunfälle im Klartext〉，bergundsteigen 3/14 | https://assets.bergundsteigen.com/2021/08/36-40kletterunfaelle-im-klartext.pdf | 是 |
| A13 | 德國 DAV 會員事故，**運動攀登**：繩索與確保技術錯誤佔 21%，其中 **6.1% 在垂降**、4.1% 在下放、8.2% 夥伴確保錯誤；作者原文說「約一半發生在垂降與下放」。**高山攀登**：「Blockierung（受困）」類別下 **2.1% 在垂降時**（照版面看是受困類，不是墜落；樣本數沒寫，從百分比推算大約 n≈97 和 n≈49，屬於推測） | DAV 會員通報的意外與緊急事件 | 2020–2021 | DAV〈Bergunfallstatistik 2020/2021〉，作者 Peter Randelzhofer，2022-09 | https://www.alpenverein.de/files/2209_unfallstatistik-2020-21-final_ol.pdf | 是 |
| A14 | 「攀登事故中垂降事故佔 **2–3%**——不常見，但完全沒必要」 | 作者的概估，文中沒附來源表 | 未說明 | Chris Semmel（山岳嚮導、安全研究者、鑑定人），〈Die heikle Phase der Umkehr: Unfälle beim Abseilen〉，bergundsteigen（網路版 2026-09-17） | https://www.bergundsteigen.com/artikel/die-heikle-phase-der-umkehr-unfaelle-beim-abseilen/ | 是 |
| A15 | Devils Tower 國家紀念地（NPS 原話，ANAC 引用）：百多年攀登史只有 **7 起攀登死亡**，「多數攀登事故和死亡發生在垂降」 | 公園官方說法 | 約 1893–2024 | ANAC 2025〈Fatal Rappel Fall〉 | https://publications.americanalpineclub.org/articles/13201217342 | 是 |
| A16 | 瑞士 SAC Bergnotfallstatistik 2025：攀登緊急事件中，**「Blockierung」（受困）是最常見原因，第二是墜落**；文字版**沒有拆出垂降**（圖表是圖片，沒有抽出） | 救援出勤 | 2025 | SAC，2026 | https://www.sac-cas.ch/fileadmin/Ausbildung_und_Sicherheit/Sicher_unterwegs/Bergnotfallstatistik/2025/Bergnotfallstatistik_2025.pdf | 是（文字層；沒有垂降數字） |
| A17 | HowNOT2 測得要用 **6 kN** 才能把繩尾結拉過 ATC（所以繩尾結不是萬無一失，結要留長尾） | 測試值（二手引用） | — | John Godino，〈Know the Ropes: Crafty Rappel Techniques〉，ANAC 2025 | https://publications.americanalpineclub.org/articles/13201217362 | 是（HowNOT2 原始影片沒開） |

### 量化資料的限制（寫文章時要講清楚）
- ANAC 是自願通報，**算的是件數不是發生率**；Climbing.com 和 ANAC 自己也這樣提醒。
- 分類不一致：AAC 的「Rappel Failure/Error」把固定點、繩長不一、繩尾沒打結、simul-rappel、鐘擺、器材掛錯都放在同一類；Caroom 的「Rappel Error」也很寬（包括沒備份、垂降太快、架設時墜落、固定點失效）。**沒有任何來源把每種失敗模式各自算出比例**，Caroom 的共同標籤（A3）是最接近的。
- 下撤佔比：2012 KTR 說約 30%，Caroom 32%，ANAC 1951–2016 表格算出 1,413/6,056 ≈ 23%（Caroom 寫 ANAC 是「26%」，取樣年份不同）。

---

## B. 失敗模式分類

依據：1996 ANAM 編者分析（A11）、2012 KTR（舊文已引）、Caroom 標籤（A3）、Karr 2025、bergundsteigen／DAV／BMC 的案例，以及 2023–2026 年 ANAC 的垂降案例（第 C 節）。

| 失敗模式 | 頻率證據 | 致死證據 | 證據類型 |
|---|---|---|---|
| **1. 垂降出繩尾**（沒打繩尾結／繩長不一／中點標記錯／繩子剪短過） | 2012 KTR 三大主因之一；Caroom「No Backup or End Knot」在 rappel error 中有 67/251；Karr：繩尾結「仍是事故報告最常提到的技術疏漏之一」；Semmel：繩長不一或中點標記錯「已經多次造成這類事故」 | 高：2024 Devils Tower（剪短的繩子沒有中點標記，致死）、2025 El Cap Balin Miller（墜落 2,400 ft，致死）、2025 Officer's Gulch 嚮導（自我下放，沒打繩尾結，致死）、2024 ANAC 2025 雙繩長度算錯（致死）；奧地利 Wilder Kaiser（80 m，致死） | 統計＋案例 |
| **2. 固定點失效**（舊扁帶、單一岩釘、繞樹扁帶、girth hitch 翻掉） | 2012 KTR 三大主因之一；Caroom Anchor Failure 66/251；1996 ANAM 說這是早年兩大錯誤之一 | **最致命的一群**：2022 Tahquitz 單條褪色扁帶（2 死）、2022 年另一起扁帶斷裂致死、2025 North Early Winter Spire 單根岩釘拔出（**3 死**）、2024 Middle Teton 舊扁帶（重傷）、2024 Cutthroat Peak 垂降環 girth hitch 翻脫（墜落 400 ft，倖存） | 統計＋案例 |
| **3. 沒有備份**（沒 prusik／autoblock／消防員確保）→ 失控 | 2012 KTR 三大主因之一；Caroom 67 件（與繩尾結合併計算）；Semmel 案例：只扣了一股繩又沒 prusik，造成 16 處骨折 | 中到高：2016 Bat Caves（繩子太細配上器材，沒備份，致死）；2024 Crow Hill（失控 120 ft，致死；也有只穿一股的問題） | 統計＋案例 |
| **4. 器材穿錯／只扣一股／扣到拉繩那股**（含 Reepschnur 掛錯股、Grigri 單繩系統） | 1996 ANAM 列為主要原因之一（「incorrect threading」）；AAC 表格註腳把「attaching device incorrectly」放進這類；**2024–2025 年 ANAC 案例特別集中** | 高：2024 Stanley Headwall（只有藍繩穿過 ATC，致死）、2024 Crow Hill（只穿一股，致死）、2025 Red Rock Reepschnur（Grigri 掛在拉繩那股，致死）、2025 Psycho Tower（繞錯股，險些致死）、2023 Vermont（器材掛在八字結長尾上，滑墜 100 ft）、2024 Palisades（單股沒固定，11 歲孩子墜地） | 案例（沒有獨立統計） |
| **5. 轉換時出錯**（離開固定點、在固定點解開或沒扣好、拆掉固定點） | Karr：轉換時刻「造成許多重傷與死亡」，最常見的是溝通錯誤、器材用錯、系統太複雜、結打錯、沒維持封閉系統；1996 ANAM：「架設垂降時沒有自我固定」 | 案例：2023 Smith Rock（孩子拆掉固定點，墜落 40 ft）；Semmel：吊帶扣錯位置，致死 | 主題分析＋案例 |
| **6. 繩子卡住／受困** | Caroom：Stranded 佔下撤事故 14%；DAV 高山攀登：垂降時受困 2.1%；SAC：受困是攀登救援最常見的原因（沒有拆出垂降） | 通常不致死，但會引出二次風險（天黑、再爬上去）；BMC：不要用 prusik 只爬單股繩上去 | 統計（間接）＋指引 |
| **7. 落石／割繩** | Caroom 有標落石；BMC 的器材失效調查包括「abseil ropes cut through」；ANAC 2025「垂降時踢落石頭」險些出事；2023 Brogan Spire 鐘擺時繩子刮過岩角 | 有案例，沒有比例 | 案例 |
| **8. 連接兩條繩的結失效**（扁平單結／EDK 翻滾） | **2023–2026 年 ANAC 沒找到確認的案例**；2024 Stanley Headwall 的夥伴一開始懷疑是結，後來確認**不是結的問題** | 沒有證據顯示是常見死因 | 文章要寫「沒有證據」，不要誇大 |
| **9. 頭髮或衣服捲進器材** | 1996 ANAM：「少數案例」；BMC 列為危害之一 | 低 | 案例層級 |
| **10. 器材脫開**（Munter 把鎖扣轉開、八字環橫擋撬開扣門） | BMC：八字環橫擋撬開鎖好的扣環，「至少一起死亡和多起重傷」；ANAC 2025 Munter 把鎖扣轉開（自由墜落 80 ft，倖存） | 少見但致命 | 案例 |
| **11. 繩子不夠長／垂降路線錯** | 2012 KTR「較少見的原因」；1996 ANAM | 多半是受困 | 案例 |
| **背景因素：趕時間、天黑、疲勞、離路邊很近、人多分心、團隊壓力** | 1996 ANAM（分心、趕時間、「離路邊很近」）；Karr（疲勞、下撤）；Semmel（多組人一起垂降的壓力、Eile）；Caroom：rappel error 中 Late in Day 31、Visibility 23、Fatigue 19 | 幾乎每起致死案例都有 | 主題分析 |

**排序（只用有數字的來源，Caroom＋2012 KTR）**：
1. 沒備份或沒打繩尾結（67）≈ 固定點失效（66）→ 這兩類最常見；
2. 下撤時受困（46，大多是結果而不是原因）；
3. 器材穿錯／只扣一股：**沒有獨立統計**，但 2024–2025 年 ANAC 的致死案例中佔最多（Stanley Headwall、Crow Hill、Red Rock，加上 Psycho Tower、Palisades 兩起險些致死）——只能說「近年案例集中」，不能說「最常見」。

**最致命**：固定點失效（一次帶走整組人：Tahquitz 2 人、Early Winter 3 人）；出繩尾和只扣一股是單人致死最常見的情境。

---

## C. 近年 ANAC 垂降案例清單（2024–2026 年版，全部有開）

| ANAC 版本／事故年 | 標題 | 失敗模式 | 結果 | URL |
|---|---|---|---|---|
| 2024/2023 | Fall on Rock — Rappel Error（Brogan Spire） | 鐘擺、繩子刮過岩角 | 重傷 | https://publications.americanalpineclub.org/articles/13201217124 |
| 2024/2023 | Ground Fall — Removed Anchor before Rappel（Smith Rock） | 轉換：孩子拆掉固定點 | 墜落 40 ft | https://publications.americanalpineclub.org/articles/13201217126 |
| 2024/2023 | Rappelled Off Wrong End of Fixed Rope（Vermont） | 器材掛在結的長尾上 | 滑墜 100 ft | https://publications.americanalpineclub.org/articles/13201217172 |
| 2025/2024 | Rappel Failure — Munter Hitch Unscrewed a Locking Carabiner | 器材脫開，沒用 prusik | 自由墜落 80 ft，倖存 | https://publications.americanalpineclub.org/articles/13201217271 |
| 2025/2024 | Fatal Fall on Rappel — Lost Control of Rope（Crow Hill, MA） | 只穿一股，新學的 prusik 還不熟 | 致死 | https://publications.americanalpineclub.org/articles/13201217277 |
| 2025/2024 | Fall From Anchor — Rappel Ring Detached from Slings（Cutthroat Peak） | 固定點：girth hitch 翻脫 | 墜落 400 ft，倖存 | https://publications.americanalpineclub.org/articles/13201217330 |
| 2025/2024 | Rappel Anchor Failure — Old Webbing（Middle Teton） | 舊扁帶，後援 cam 先拆掉了 | 重傷 | http://publications.americanalpineclub.org/articles/13201217339 |
| 2025/2024 | Fatal Rappel Fall（Devils Tower） | 繩子剪短、沒中點標記、繩長不一 | 致死 | https://publications.americanalpineclub.org/articles/13201217342 |
| 2025/2024 | Rappel Fatality — Rappel Device Improperly Rigged（Stanley Headwall） | 只有一股穿過 ATC／prusik，天黑、分心 | 致死 | https://publications.americanalpineclub.org/articles/13201217348 |
| 2026/2024 | Ground Fall From Anchor — Rappel Rope Not Properly Attached（Palisades） | 單股沒固定，系統太複雜，沒測試 | 11 歲孩子墜地 | https://publications.americanalpineclub.org/articles/13201217622 |
| 2026/2025 | Fatal Fall — Rappel Off End of Rope（El Cap，Balin Miller） | 出繩尾 | 致死 | https://publications.americanalpineclub.org/articles/13201217636 |
| 2026/2025 | Rappel Error — Complacency（Psycho Tower） | 繞錯股（carabiner block） | 險些致死 | https://publications.americanalpineclub.org/articles/13201217645 |
| 2026/2025 | Fatal Rappelling Fall — Rope Too Short, No Stopper Knot（Officer's Gulch） | 嚮導自我下放，沒打繩尾結 | 致死 | https://publications.americanalpineclub.org/articles/13201217648 |
| 2026/2025 | Rappel Error — Dehydration, Darkness, Stuck Rope（Red Rock） | 繩子卡住、天黑 | 受困 | https://publications.americanalpineclub.org/articles/13201217658 |
| 2026/2025 | Rappel Fatality — Device Attached to Wrong Strand（Red Rock，Reepschnur） | Grigri 掛在拉繩那股 | 致死 | https://publications.americanalpineclub.org/articles/13201217659 |
| 2026/2025 | Stranded — Climber Stuck Mid-Rappel（Gunks） | 繩子纏住卡進器材 | 受困 | https://publications.americanalpineclub.org/articles/13201217670 |
| 2026/2025 | Triple Fatality — Single Fixed Piton Pulled（North Early Winter Spire） | 固定點：單根舊岩釘，4 人共用 | 3 死 | https://publications.americanalpineclub.org/articles/13201217683 |

另外：〈The Prescription—The Stacked Rappel〉（AAC，2026-01-20）重述 Stanley Headwall 案例，結論是「器材穿錯 → 解法是夥伴檢查或 stacked rappel」：https://americanalpineclub.org/news/2026/1/20/the-prescriptionthe-stacked-rappel （已開）。

方法說明：我爬了 publications.americanalpineclub.org 文章 ID 13201217100–13201217700 的標題（出版年 2024–2026），只列標題有 rappel 的文章；**網站不一定放上整本 ANAC 的所有報告**，所以這份清單不是完整統計。

---

## D. 歐洲／其他

- **BMC**〈Abseiling: not the quickest way to reach the ground〉（沒有日期、沒有作者；BMC 技術頁）：BMC 的器材失效調查包括「abseil ropes cut through, failed anchors, detached karabiners, and abseil devices that 'mysteriously' did not control the speed of descent」，再加上頭髮／衣服捲進去、翻倒和擺盪、意外到了繩尾、卡繩、銳角、落石。八字環橫擋撬開扣門：「at least one fatality and a number of serious injuries」。**沒有統計**。 https://services.thebmc.co.uk/abseiling-not-the-quickest-way-to-reach-the-ground ；同文新版 https://www.thebmc.co.uk/en/abseiling-do-you-know-the-risks （兩個都已開）
- **BMC incident reports**（incidents.thebmc.co.uk）：只有個別通報，沒有彙整統計；沒有逐筆篩出垂降的通報（可選：之後再補）。
- **bergundsteigen〈Fehler beim Abseilen: 20 Tipps〉**、**DAV〈Sicherheitsrelevantes zum Abseilen〉**：已開，是技術建議，沒有事故統計（`https://bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps`、`https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d`）。
- **Semmel（bergundsteigen 2026）案例**：多瑙河谷 50 m＋60 m 兩條繩接在一起、繩子剪短但中點標記沒改、多洛米蒂撤退時沒打繩尾結（重傷）、只扣一股又沒 prusik（16 處骨折）、吊帶扣錯位置（致死）、Wilder Kaiser 多組人一起垂降沒打繩尾結、繩長不一（墜落 80 m 致死，奧地利 Alpinpolizei 報告）。
- **ACC（Alpine Club of Canada）**：〈ACC Safety Bulletin: The Power of Incident Reporting〉已開，沒有垂降數字；加拿大事故資料併在 ANAC 裡（A5：1959–2016 年 55 件）。
- **紐西蘭**：NZ Mountain Safety Council 沒找到垂降統計；搜到一份 2008 年驗屍官報告（MacDonald [2008] NZCorC 29），抓下來後文字中**沒有** abseil／rappel 字樣，不採用。
- **同儕審查研究**：Bowie et al.〈Rock-climbing injuries in Yosemite National Park〉（West J Med 1988，PMC1026367）已開：220 名傷者、13 人死亡，66% 在先鋒時墜落；摘要**沒有拆出垂降**，不採用。沒找到專門研究垂降死亡的同儕審查文章；Caroom 的資料集是最接近的量化分析（不是同儕審查）。

## E. 台灣

- 沒找到可信的台灣垂降事故報告。2026 年龍洞死亡事故（聯合報 https://udn.com/news/story/7320/9477797 ，已開）：44 歲女性墜落約 10 m 死亡，後續報導寫「疑確保繩過長」——**是確保或墜落事故，不是垂降**，原因還在調查。TOCC〈2024 Tuolumne Accident〉是美國 Cathedral Peak 的事故（已開），也不是垂降失誤。
- 依照 memory 中「台灣資料少是常態」的原則，不列為研究缺口。

## F. 和舊文〈下放還是垂降〉（2026-10-17-lower-or-rappel.md）比較

舊文已引：2012 KTR Rappelling 的三大主因（固定點、備份、出繩尾）；2012 KTR 轉引的「約 30% 事故發生在下撤」；Poborsky〈Lowering〉；AAC 2021〈Cleaning Sport Routes〉；TOCC。

**新的**：A1–A4（Caroom：251 件中 76 件致死，約 30%，是所有事故平均致死率的 1.5 倍）、A5（ANAC 1951–2016 累計 414 件，以及分類註腳）、A7（2023 年版 14 件／8 死；2025 年版 15 件／23 人／5 死）、A8（扁帶斷裂的拉力測試）、A9（2024 年下撤 46 件 vs 上攀 100 件）、A10–A11、德奧資料（A12–A14）、BMC 八字環撬開扣門、第 C 節近年案例（特別是「只扣一股／掛錯股」的集中趨勢和 stacked rappel 解法），以及「連接繩結翻滾沒有近年致死證據」這個反面發現。
