# 精讀紀錄：order 21 找不到證據的說法（zone 2、單槓懸吊）

寫於 2026-10-25。取得管道：Groundlane `web_fetch`（Europe PMC REST、Springer、機構典藏頁、健康資訊網頁）、Groundlane `web_search`。Semantic Scholar（`paper_search`）兩次都回 RATE_LIMITED，沒有結果。curl 連外被 proxy 403。

## 來源書目與讀取程度

| 來源 | 取得 | 讀了什麼 | 沒讀 |
|---|---|---|---|
| Nuuttila 2026 Scand J Med Sci Sports（PMC12810095，DOI 10.1111/sms.70208） | Europe PMC fullTextXML，85,805 字元，truncated=false | 摘要、引言、4.3 討論、4.4 證據限制、參考文獻 | 方法逐段、結果表、補充資料 |
| Hogan 2026 Med Sci Sports Exerc（PMC13446920，DOI 10.1249/MSS.0000000000004027） | Europe PMC fullTextXML，73,354 字元，truncated=false | 摘要、引言前段、討論後段（含限制與結論） | 方法與結果表 |
| Meixner 2025 Transl Sports Med（PMC11986187，DOI 10.1155/tsm2/2008291） | Europe PMC fullTextXML，截取前 12,000 字元（全文 176,603 bytes） | 摘要、引言、受試者與設計 | 結果、討論（只憑摘要） |
| Sitko 2025 IJSPP（PMID 40010355，DOI 10.1123/ijspp.2024-0303） | 搜尋摘要片段＋EHU 典藏頁（簡介被截斷）；PDF 抓取只得到未解碼二進位 | 簡介的 Background／Purpose／Results 前半 | 全文、共識細節 |
| Storoschuk 2025 Sports Med（PMID 40560504，DOI 10.1007/s40279-025-02261-y） | Europe PMC core 摘要；Springer 頁只回參考文獻（付費），inEPMC=N | 摘要 | 全文 |
| Ovali & Us 2023 Medicine（PMC10727524，DOI 10.1097/md.0000000000036461） | Europe PMC fullTextXML，75,659 bytes，truncated=false | 全文（方法、結果、討論、限制） | 圖表影像 |
| Wegner 2013 Cochrane（PMID 23959683，PMC6823219，DOI 10.1002/14651858.cd003010.pub5） | Europe PMC core 摘要 | 摘要 | 全文（先前掃描 fullTextXML 回 500） |
| HSS 新聞摘要頁、Everyday Health 文章 | web_fetch | HSS：全頁（極短，轉述外部報導）；Everyday Health：全文 | — |

## 可用陳述的逐字引文（已程式比對，Nuuttila／Hogan 全文檔，空白正規化後 `in`）

| 內容 | 原文 |
|---|---|
| zone 2 界線難定 | "a universal definition of such a zone is challenging" |
| 上緣較有效的主張證據有限 | "research evidence supporting this claim remains relatively limited" |
| 作者摘要：無最低強度 | "no minimum intensity for adaptations was detected for most outcomes" |
| 只有一個研究用閾值標準化強度 | "only one standardized the exercise intensity according to LTs or VTs" |
| zone 2 為 LIT 範圍上緣 | "The upper range (i.e., zone 2) of the LIT domain has been suggested to be more effective than the lower range" |
| 沒有研究報告強度分布 | "none reported the training intensity distribution" |
| 證據確定性 | "the certainty of evidence was rated as high for fitness-related outcomes" |
| Hogan 主要結果 | "Fatmax occurred at a significantly lower exercise intensity than LT/GET" |
| Hogan 限制：健康族群 | "the review included only apparently healthy populations" |
| Hogan 限制：群體平均 | "our results reflect average group-level relationships rather than variability at the individual level" |

文章正文**沒有直接引用英文原文**（全部轉述）；上表供審稿者核對。

## 其他事實的來源（摘要層級，未程式比對，轉述）

- Nuuttila 摘要：50 個研究、介入組 824 人；RCT、健康成人 18–65 歲、介入至少 3 週、強度完全在第一乳酸／通氣閾值（VT1）以下，或 ≤60% 心率儲備，或摘要所列的 VO2max 條件，或 ≤75% 最大心率（摘要原文 VO2max 條件的數字寫法有歧義，未採用）；相對最大攝氧量 ES = 0.94（I2 = 0.73）；強度只與 VO2max 的適應有關（p = 0.02）。討論：「higher intensity was associated with greater improvement in VO2max ... lends support to the assumption that specifically the upper range ... (zone 2) may promote fitness-related adaptations」；健康相關變項與強度沒有系統性關聯。文章內寫「最大心率約 75%」是摘要的 ≤75% HRmax 條件之一。"zone 2" 只出現在引言與討論（程式搜尋：位置 7402、40115、57741 是參考文獻標題）。
- Hogan 摘要：N = 42 個研究；"1505 participants" 見限制段；差約 5.78% VO2max 等；"zone 2" 全文 0 次（正規表示式搜尋）。
- Meixner 摘要：50 位自行車手（30 男 20 女），CV 6%–29%，VT1 與 FatMax "strong alignment"，固定 %HRmax 與血乳酸閾值個體差大；受試者"more than three years of regular cycling exercise"。
- Sitko 簡介：14 位專家；"there is no clear consensus among coaches, athletes, and scientists regarding the definition of zone 2 training"；共識為 zone 2 "preferably be performed at intensities located immediately below the first lactate or ventilatory threshold"。
- Storoschuk 摘要：zone 2 定義為 "low-intensity exercise below the lactate threshold"；建議 "largely stem from observational data of elite endurance athletes"；結論 "current evidence does not support Zone 2 training as the optimal intensity"；主張 "prioritizing higher exercise intensities (> Zone 2)"。
- Ovali：33 位 AIS 病人（23 女 10 男，平均 16.9 歲，範圍 11–21），45 個結構性曲線；dead-hang 比人工牽引的柔軟度高（P < .001），與側彎無顯著差；作者自述限制：樣本小、無長期追蹤、標準化問題；作者引用另一份資料估計懸吊的牽引力約體重 51%（文章未引用此數字）。
- Wegner：32 RCT、2,762 人；7 個試驗報告副作用（疼痛增加、神經症狀惡化、後續手術）；"limited-quality evidence"。

## 作者列的限制 vs 設計 vs 我的解讀

- Nuuttila 作者限制：只有 1 個研究以閾值標準化強度；24 個研究沒報告遵從度；大量異質性。→ 文章只寫「定義比 zone 2 寬」，這是我對比後的解讀。
- Hogan 作者限制：只含健康族群；群體平均；單變量模式。
- Ovali 作者限制：樣本小；缺長期追蹤。「沒量疼痛、椎間盤」是我讀過全文後的觀察（結果段只談 Cobb 角柔軟度與術後矯正）。
- Cochrane 作者限制：證據品質有限、樣本小、偏誤風險中高。「不是懸吊」是我的解讀。

## 要小心的

1. Storoschuk 是敘述性回顧、帶立場，且只讀摘要；不當成定論。
2. Nuuttila 的 LIT 定義比 zone 2 寬，且對照多為對照組，不是中高強度；不要寫成「zone 2 有效」。
3. Nuuttila 的強度次分析是關聯；作者自己說樣本小的次組檢定力低。
4. Hogan 與 Meixner 都沒有追蹤訓練成果。
5. 單槓懸吊沒有直接研究是「在我查的範圍內」；Europe PMC 只看前 25／10 筆標題。
6. 兩個健康資訊網頁引述專業人士，不點名。

## 對本篇的影響

縮小成兩個說法；一萬步與局部減脂只連結；不寫「怎麼查證貼文」；不點名任何社群貼文作者或帳號。
