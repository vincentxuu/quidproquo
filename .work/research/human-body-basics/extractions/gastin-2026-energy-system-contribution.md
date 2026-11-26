# 精讀紀錄：Gastin & Suppiah 2026（最大強度運動中無氧與有氧能量系統的貢獻）

- 書目：Gastin PB, Suppiah HT. "Anaerobic and Aerobic Energy System Contribution During Maximal Exercise: A Systematic Review." *Sports Med* 56(7):1723–1747, 2026（PMID 41965479，PMC13388521，DOI 10.1007/s40279-026-02414-7）。CC BY 4.0。
- 取得：Europe PMC `fullTextXML` 只回得到前 100,000 字元（摘要、重點、前言、方法前半，`truncated: true`）；其餘（4.x 結果之外的 5 Discussion 全段與 5.2 Limitations）改從 Springer 頁面用 CSS 選擇器抓回。**結果段 3.2 以後與表 5 數值沒讀到**（選擇器只回傳 3.1；表 5 只回標題）。
- 引文核對：前言、方法、摘要的句子已用程式比對 Europe PMC 文字（見下「已比對」）；Discussion／Limitations 的句子取自 Springer 頁面，**沒有程式比對**（文字未存檔）。
- 設計：系統性回顧，7 個資料庫，涵蓋 1984 至 2020 年 1 月；納入 102 項研究、311 個資料點；用非線性迴歸模型估計不同運動時間下的無氧／有氧比例。

## 它在回答什麼，以及邊界

- 回答的是「**單次最大強度運動**，不同持續時間，無氧與有氧各佔多少」。
- 納入限定成人（≥18 歲）、單次最大運動；**排除**間歇運動、重複衝刺、團隊球類、次最大強度運動（"Studies that measured ... intermittent exercise and repeated intervals, intermittent team sport, or involved sub-maximal exercise bouts were excluded."）。
- 受試者（研究樣本組成）：78% 男性、12% 女性、11% 混合（加總 101%，是納入研究的樣本類別，不是人數比例）；運動以腳踏車與跑步居多（post-verify 子代理依表 2–4 計數：106 列中腳踏車 46、跑步 31，非作者結論）。
- **更正（2026-10-24，經 post-verify）：** 我原寫「沒有攀岩」是錯的。納入研究中有 Bertuzzi 等人 2007 的室內攀岩研究（Energy system contributions in indoor rock climbing，Eur J Appl Physiol，N=6，表 3 一列 73.8–83.9 秒，無氧 51.5–58.4%）。回顧沒有單獨分析攀岩，只有這一項、6 人，所以不能據以回答攀岩的能量比例。
- 所以它**不能直接回答攀岩一條路線的能量來源**：攀岩是間歇、非最大強度、上肢為主；回顧只納入一項 6 人的室內攀岩研究。能用的是機制與「兩個系統同時運作、沒有單一系統負責」。

## 可用陳述

| 內容 | 位置 | 原文 |
|---|---|---|
| 肌肉內 ATP 濃度很低，所以需要再生 | 前言 | "As ATP exists in very low concentration in the muscle" |
| 三套系統同時運作，沒有單一系統獨自負責，只是某一套會成為主要來源 | 前言 | "No single system is responsible for the energy delivery for gross motor activity beyond a few contractions, as energy provision relies on simultaneous participation of all three pathways" |
| 把活動標成「無氧」「有氧」是誤導的習慣 | 前言 | "This predominance has historically, although misleadingly, resulted in activities being labeled on the basis of their physiology (e.g., anaerobic or aerobic) rather than their activity" |
| 沒有公認的方法測全身運動的無氧能量釋放 | 前言 | "there is no universally accepted method for the assessment of anaerobic energy release in whole-body exercise" |
| 單次最大強度下，無氧與有氧各半的時間點約 75–80 秒（摘要：78.6 s，95% CI ± 1.1 s） | 摘要、討論 | 摘要："The maximal exercise duration that derived equal contributions from both the anaerobic and aerobic energy systems was 78.6 s" |
| 模型預測誤差約 12–14%，表要謹慎解讀 | 討論 | "These estimates have a 95% CI of ± < 0.1% to 6.0% and a PE of about 12–14%, meaning the table should be interpreted cautiously." |
| 與 2001 年敘述性回顧相比差 0–3% | 討論 | "with differences ranging from 0 to 3% for any given duration" |
| 跑步與腳踏車、訓練狀態沒差；測量方法與配速有小幅顯著影響 | 摘要 | "Comparison of regression curves showed no differences between running and cycling or training status but revealed small significant effects of measurement method and pacing strategy." |
| 短時間最大運動中有氧貢獻比傳統認知大 | 討論 | "the aerobic contribution to the energy supply during maximal exercise of short duration is considerable and appreciably greater than traditionally thought" |
| 研究限制：方法異質、無金標準、結果是平均趨勢不是個別預測、2020 年 1 月之後未納入 | 5.2 | "The derived anaerobic–aerobic contribution estimates therefore represent averaged trends rather than precise predictions for any particular exercise mode, pacing strategy, or athlete population." |

## 已比對（程式，Europe PMC 文字）

前言三句、"there is no universally accepted..."、摘要迴歸比較句、受試者性別比例句、檢索年限句、排除標準兩句、"A total of 102 studies were included, providing 311 individual data points"：全部逐字吻合。未吻合者（因空白或標點差異，已不採用原句）：摘要"predominates ... 75–80 s"、前言"less than 10 s ... 95%"。

## 要小心的

1. **作者自己有立場風險：** 第一作者 Gastin 是 2001 年原敘述性回顧 [14] 的作者，本次納入有 28 項（27%）來自原回顧，且 7 篇是 Gastin 自己（"seven studies by Gastin"）。討論寫"very similar to those published by Gastin in 2001"，估計值相近的一部分原因是同一批資料。
2. 「**交叉點約 75–80 秒**」是單次最大強度、跑步與腳踏車、主要男性的模型平均值。不能說成「攀岩 80 秒後換有氧」。
3. 實務建議段（5.1）是作者推論的訓練處方；本系列不引用。
4. 資料截止 2020 年 1 月；2026 年發表，但沒納入之後的研究。

## 對 order 4 的影響

- 解決了五關第①（有一份讀過的一手系統性回顧）與第③（2026 年）。
- 第④反證：本篇已含「方法異質、無金標準」；另可用的反證是它自己指出的測量困難。
- 文章角度：不寫「爬一條線用哪種能量」的結論，而是寫「兩個系統同時在做事」＋「單次最大強度時的比例如何隨時間改變」＋「這些數字為什麼只能當粗略參考，不能套到攀岩」。
