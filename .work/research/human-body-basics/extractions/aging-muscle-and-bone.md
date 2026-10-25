# 精讀紀錄：老化的肌肉與骨（order 17）

日期：2026-10-25。全部經 Groundlane `web_fetch` 取 Europe PMC `fullTextXML`（format=text；Mohebbi 與 Shur 用 `extract=full`），存檔後以 `python3 -I` 比對。

## 來源書目與讀取程度

| 來源 | PMID / PMCID | 授權 | 讀取程度 |
|---|---|---|---|
| Yan R et al. 2025, Aging Clin Exp Res 37:320. doi:10.1007/s40520-025-03235-w | 41212331 / PMC12602684 | CC BY-NC-ND | 全文（約 7.7 萬字元，`truncated:false`），讀了摘要、方法、結果、討論、臨床意涵、限制；未讀補充材料（Supplementary 1–6） |
| Ran J et al. 2025, BMC Geriatr 25:849. doi:10.1186/s12877-025-06559-4 | 41194011 / PMC12590801 | CC BY | 全文（約 7.3 萬字元），讀了摘要、前言開頭、結果、討論、限制、結論；方法段與前言後半只掃過；未讀補充材料 |
| Shur NF et al. 2021, Ageing Res Rev 68:101344. doi:10.1016/j.arr.2021.101344 | 33872778 / PMC8140403 | CC BY-NC-ND | 全文（約 5.5 萬字元）；讀了亮點、前言、第 2、3 節、結論；第 4 節之後（逆轉、介入）未細讀 |
| Mohebbi R et al. 2023, Osteoporos Int 34:1145–1178. doi:10.1007/s00198-023-06682-1 | 36749350 / PMC10282053 | CC BY-NC | 全文（約 9.5 萬字元）；讀了摘要、前言、方法開頭、結果（LS/FN/TH）、討論的限制段與結語；表 1、2 掃過；各子群分析與討論前半只讀了摘要層級 |
| Lu C et al. 2026, BMJ 394:e100561. doi:10.1136/bmj-2026-100561 | 42716561 / 無 | 非開放 | **只讀 Europe PMC 的摘要**（isOpenAccess=N、inEPMC=N）。全文與補充未讀 |
| Bull FC et al. 2020 WHO guidelines, Br J Sports Med 54:1451. doi:10.1136/bjsports-2020-102955 | 33239350 / PMC7719906 | CC BY | 沿用 `who-2020-physical-activity-guidelines.md` 的精讀紀錄（該紀錄已逐字比對）；本篇只用第 9 項（平衡與功能運動降低跌倒率為高確定性） |

PMID／PMCID／DOI 以 Europe PMC `EXT_ID:<PMID>` 查詢核對過（Yan、Ran、Mohebbi、Shur、WHO 為 lite 查詢；Lu 為 core 查詢）。

## 可用陳述的逐字引文（已程式比對：空白正規化後在全文中逐字存在）

| # | 來源 | 用途 | 原文 |
|---|---|---|---|
| 1 | Yan | 結論 | "Resistance training probably improves muscle strength and physical function in older adults with sarcopenia." |
| 2 | Yan | 結論 | "improvements in grip strength, gait speed, TUG, 5STS, and SPPB did not exceed their MID thresholds, indicating little to no clinical benefit" |
| 3 | Yan | 臨床意涵 | "additional clinically perceptible benefits over usual care are uncertain" |
| 4 | Yan | 摘要 | "no significant improvements were observed in the short physical performance battery (SPPB), appendicular skeletal muscle mass index and appendicular skeletal muscle mass" |
| 5 | Yan | GRADE | "Overall, the certainty of evidence for most outcomes ranged from moderate to high." |
| 6 | Yan | 限制 | "duration ≤ 26 weeks, frequency 2–3 sessions per week, and session duration mainly 50–60 min" |
| 7 | Yan | 未來研究 | "include participant-centred outcomes, such as fall incidence and health-related quality of life" |
| 8 | Yan | 納入 | "adults aged ≥ 60 years diagnosed with sarcopenia"；排除 "Participants with sarcopenia secondary to specific health conditions such as cancer, diabetes, stroke"；對照 "health education, usual care, or no intervention" |
| 9 | Yan | 偏差風險 | "8 studies (33.3%) were classified as low risk of bias, 12 studies (50.0%) as having unclear risk, and 4 studies (16.7%) as high risk" |
| 10 | Yan | 不良事件 | "Four included studies reported adverse events related to resistance training, all of which were mild, reversible, and did not result in study withdrawal." |
| 11 | Ran | 限制 | "The overall low quality of evidence as assessed by the GRADE framework further necessitates a cautious interpretation of our results." |
| 12 | Ran | 範圍 | "Our review was restricted to studies of RT alone" |
| 13 | Ran | 外推 | "our pooled results are likely to mirror the response profile of Western rather than Asian individuals" |
| 14 | Ran | 頻率 | "a higher frequency (three times per week) did not yield additional benefits" |
| 15 | Shur | 下降速度 | "there is little agreement on the rate of decline of muscle mass according to age, due to a paucity of longitudinal studies" |
| 16 | Shur | 年紀 vs 活動 | "we are not aware of any studies that have measured baseline levels of habitual physical activity in a precise quantifiable manner"；"without accurate measurements of habitual physical activity levels it is difficult to conclude these differences are definitively due to ageing processes" |
| 17 | Shur | 可逆 | "Muscle ageing caused by lifestyle factors may be at least partly reversible."（亮點，作者推測） |
| 18 | Shur | 強度 vs 肌肉量 | "The magnitude of strength loss seen in ageing is consistently greater than the degree of muscle mass loss" |
| 19 | Shur | 資深運動員 | "variation in muscle cross sectional area, lean mass and strength did not appear to be age related" |
| 20 | Mohebbi | 效果大小 | "the average SMD for BMD effects on LS, FN, and TH can be classified as moderate at best" |
| 21 | Mohebbi | 實用性 | "their practical application for deriving dedicated and reliable exercise recommendations is rather limited"；"rapid (but rough) overview" |
| 22 | Lu（摘要） | 結論 | "Given the overall low to moderate confidence in several estimates, these findings provide cautious support" |

比對方式：Yan／Ran／Shur／Mohebbi 以存下的全文檔；Lu 的摘要段落是我從 Europe PMC core 回傳的摘要手動轉貼成一個檔再比對（不是直接存檔的原始回傳）。WHO 引文沿用既有精讀紀錄的比對，本次未重跑。

## 數字（文章用到的）

- Yan：24 項 RCT、951 人、平均年齡 73.45 歲、男性 19.9%；握力 MD 2.30 kg（CI 1.33–3.28），MID 5.0 kg；步行速度 MD 0.08 m/s（CI 0.03–0.14），MID 0.1 m/s；ASMI MD 0.26（CI −0.03 至 0.66）、ASM MD 0.02（CI −0.10 至 0.15）、SPPB MD 0.16（CI −0.38 至 0.70）皆不顯著。子群：握力每週 3 次 MD 3.18 kg，2 次 1.42 kg（子群差異 p = 0.03）。
- Ran：12 項 RCT、538 人；握力 SMD 0.63（CI 0.43–0.83）、SPPB SMD 0.56（CI 0.18–0.94）、SMI SMD 0.24（CI −0.05–0.53）。12 項中 2 項亞洲、其餘西方。
- Mohebbi：80 項、5,581 人；SMD 腰椎 0.29、股骨頸 0.27、全髖 0.41。
- Lu 摘要：124 項、18,429 人；骨折分析 26 項、11,132 人；混合有氧 OR 0.29（95% CrI 0.11–0.78，低確定性）、身心運動 OR 0.58（0.36–0.93，低確定性）。文章只寫「可能降低、確定性低」，未放 OR。

## 作者列的限制（歸屬）

- Yan：肌肉量研究篇數少；部分試驗沒報告負荷、反覆次數、休息間隔、動作幅度、節奏；訓練參數同質（≤26 週、每週 2–3 次、每次 50–60 分鐘）限制劑量反應的外推；結果指標有部分在同儕審查後才加入、未在註冊時預先指定；未做分型分層。
- Ran：只含英文與中文文獻；試驗少、統計力不足；無法探討休息間隔、時間張力、節奏、動作選擇；肌少症合併肥胖的子群樣本小；整體 GRADE 低；族群偏西方。
- Shur：敘事回顧，無搜尋方法說明（我讀到的內文）；作者自述缺乏長期縱向與活動量配對研究。
- Mohebbi：運動型態異質；納入標準（≥6 個月、藥物使用比例）可商榷；部分標準差需插補，結果隨插補策略而變動；DXA 精確度資料少；未探討基礎活動量與運動部位專一性。

## 要小心的

1. Yan 內部有兩種說法並存：討論稱 "robust evidence ... probably improves"，摘要與臨床意涵稱多項結果未超過 MID、"little to no clinical benefit"。文章並列兩者，不挑一邊。
2. Yan 摘要稱「最佳劑量 1220 MET-min/週」「600 MET-min/週」，本篇依規則（老年篇不給目標數字）**刻意不寫**。
3. Yan 與 Ran 在頻率上相反（Yan 子群與迴歸偏向每週 3 次，Ran 認為 2 次足夠）；兩者皆為跨試驗比較，不寫成建議。
4. Yan 的 GRADE 自評「多數中到高」，但同段又說握力、膝伸肌力、TUG、5STS、SPPB、ASM 因偏差風險降級；Ran 整體為低。兩篇評級差異的原因我沒有逐項比對。
5. Ran 對肌肉量沒有進步的解釋（只納入單純阻力訓練、營養可能是關鍵）是作者推測；文章只轉述並標明是推測，不談營養。
6. Ran 的 SPPB 結果：剔除 Tieland 研究後 SMD 降為 0.36、異質性消失；文章沒有放這個敏感度分析，只放主要結果。
7. Ran 的摘要結論把 "twice a week moderate-intensity" 當作 "promising strategy"；這是作者建議，文章不引用。
8. Mohebbi 作者之一（Kemmler）所屬團隊另有德國運動與骨折預防指引；致謝說本研究是該指引的一部分。這不影響數字，但是來源的組織背景，文章未提。
9. Lu 2026 摘要沒有說明「其他運動型態」包含哪些，文章因此說「無法確認是否包含單純阻力訓練」。
10. OpenStax A&P 2e §10.6 的「年齡造成的肌萎縮不可逆」與 Yan／Ran／Shur 衝突，**文章完全不引用 OpenStax**，也沒有拿它當對照（避免引入另一個要核對的來源）。

## 對本篇的影響

- 範圍縮到：肌少症診斷者的阻力訓練隨機試驗合併結果；老化與不活動難分（敘事回顧）；停經後女性骨密度（可讀）與 40 歲以上骨健康（僅摘要）。
- 不寫：健康老人預防肌少症、男性骨質、老化的骨怎麼變（沒有可讀來源）、補充劑／蛋白質、劑量、課表。
- 證據確定性：肌少症阻力訓練→肌力／體能：Yan 自評中到高、Ran 自評低；骨密度：Mohebbi 作者稱效果最多中等；Lu 摘要稱低到中。文章只轉述作者的評級，未自行評級。
