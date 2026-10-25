# 精讀紀錄：核心、伸展、滾筒（order 16）

取得管道：Europe PMC `fullTextXML`（Groundlane `web_fetch`），全文存檔後以 `python3 -I` 搜尋與逐字比對（比對前正規化空白、細空白、引號、減號）。PMCID／PMID／DOI 以 Europe PMC `EXT_ID` 查詢回傳值核對。

## 來源書目與讀取程度

| 簡稱 | 書目 | PMID / PMCID / DOI | 讀取 |
|---|---|---|---|
| Guo 2025 | Guo XB, Lan Q, Ding J, Tang L, Yang M. Front Physiol 16:1672010 | 41178988 / PMC12571568 / 10.3389/fphys.2025.1672010 | 全文（含結果、討論、限制；表格細項只讀文字部分） |
| Konrad 2024 | Konrad A 等. J Sport Health Sci 13(2):186-194 | 37301370 / PMC10980866 / 10.1016/j.jshs.2023.06.002 | 全文 |
| Warneke 2024（急性） | Warneke K 等. J Sport Health Sci 13(4):509-520 | 38244921 / PMC11184403 / 10.1016/j.jshs.2024.01.006 | 全文 |
| Warneke 2024（長期伸展） | Warneke K 等. Sports Med Open 10:45 | 38637473 / PMC11026323 / 10.1186/s40798-024-00706-8 | 摘要、方法、部分結果（PEDro、GRADE、肌力與肌肥大主結果）、重點；討論只掃過，**未逐段精讀** |
| Konrad 2022 | Konrad A 等. Sports Med 52(10):2523-2535 | 35616852 / PMC9474417 / 10.1007/s40279-022-01699-8 | 摘要、前言、討論後段、結論；方法與結果表格**未逐段讀** |
| Wiewelhove 2019 | Wiewelhove T 等. Front Physiol 10:376 | 31024339 / PMC6465761 / 10.3389/fphys.2019.00376 | 摘要、討論（機制段）、結論；方法與結果細節**未逐段讀**；2024 年以前 |
| Santos 2024 | Santos IS 等. BMC Musculoskelet Disord 25:172 | 38402150 / PMC10893730 / 10.1186/s12891-024-07276-6 | 摘要、結果表（含下背痛試驗）、討論、結論 |
| Konrad 2024 Sports Med（靜態伸展 vs 滾筒訓練） | PMID 38760635 / PMC11393112 | | 只讀摘要與重點（全文被截斷在 25,000 字元，未讀討論）；**文章未引用** |

## 可用陳述與逐字引文（皆程式比對通過）

- Guo：`the statistical comparison did not reach significance (P = 0.24)`（摘要）；`Control groups included no exercise intervention, standard medical care, or other forms of non-specific physical activity`；`most studies had relatively short intervention periods (≤12 weeks), limiting long-term effect evaluation`；`Pilates training demonstrates superior effectiveness for pain relief`（結論）；`The underlying mechanisms may involve muscle hypertrophy, increased tendon strength, and improvements in neural pain inhibitory pathways`（討論，作者推測，文章不採用）。
- 數字（取自正文）：57 RCT、7,705 人、年齡納入 18–65；疼痛 30 項研究，整體 SMD 1.03（I2=87%）→排除 10 項後 SMD 0.70（I2=47%）；三類疼痛 Pilates 0.75／阻力 0.68／穩定 0.53，組間 P=0.24；ODI 29 項，排除 8 項後 SMD 0.71；RoB 低 18（31.6%）、有些疑慮 31（54.4%）、高 8（14.0%）；SF-36 PCS 排除 4 項後不再顯著（P=0.22）。
- Konrad 2024：77 研究、186 效應量、3,870 人；總效應 ES=-1.002（負號代表有利伸展）、I2=74.97；Egger 截距 -3.96，作者稱有報告偏差；靜態、PNF 優於動態／彈震；強度、總時間、頻率無顯著關係；女性大於男性（p=0.036）；`neither volume, intensity, nor frequency of stretching were found to play a significant role in ROM yields`；`The studies in our meta-analysis tended to recruit recreationally active or trained subjects`。排除合併其他治療、急性、以其他處理（如滾筒）當對照的研究。無利益衝突聲明。
- Warneke 2024 急性：38 研究、1,134 人、140 效應量；ROM 無顯著差異；GRADE：ROM 中，硬度與被動扭力非常低；PEDro 平均 4.62（內文）；`we are not suggesting exclusion of stretching or foam rolling from training routines`；`we did not perform analyses regarding acute or chronic effects on back pain or other benefits`；`literature relating changes in temperature to ROM increases is scarce`；`we hypothesize that any activity that warms the muscle may enhance flexibility`。無利益衝突聲明。
- Warneke 2024 長期伸展：42 研究、1,318 人；最大肌力 d=0.30（95% CI 0.14–0.46），肌肥大 d=0.20；對照為不活動組；PEDro 4.17；作者結論偏好重量訓練（`suggesting a preference for the more efficient strength training if applicable`）。
- Konrad 2022：11 研究、46 效應量、290 人、平均 23.9 歲；ES=0.823（I2=72.76）；>4 週 vs ≤4 週 p=0.049；小腿（triceps surae）無踝背屈增加；LeGal 等一項 ES 5.7，拿掉後 ES=0.606、I2=0；`evidence on the training effects of foam rolling on joint ROM is limited and inconsistent`。
- Wiewelhove 2019：21 研究（14 滾前、7 滾後）；滾前：衝刺 g=0.28、柔軟度 g=0.34、跳躍 g=0.09、肌力 g=0.12；滾後：衝刺 g=0.34、肌力 g=0.21、肌肉痛感 g=0.47；`rather minor and partly negligible`；`there is no concrete evidence proving that the release of trigger-points makes FR effective`；另引文獻（Schleip 2003）說變形筋膜所需壓力大於滾筒通常範圍。
- Santos 2024：6 篇、無法統合；僅 2 篇 RCT 看到加滾筒有疼痛改善（髕股疼痛、慢性頸痛）；下背痛試驗 Ozsoy 2019，42 人、平均 68.09 歲，核心穩定＋熱敷＋TENS 加滾筒，組間無顯著差異；`the results of this systematic review do not elucidate or reinforce the clinical use of FR in pain intensity ...`。

## 作者列的限制 vs 設計 vs 我的解讀

- 作者列：Guo（評估工具與介入細節異質、多數 ≤12 週、心理面向有限、術語不一）；Konrad 2024（異質性高、報告偏差）；Warneke 2024 急性（比較活動不同質、先前熱身干擾、小研究數、硬度與被動扭力結果「not interpretable」）；Wiewelhove（研究設計異質、高品質研究不足）；Santos（研究少、資料庫不全）。
- 研究設計：Konrad 2024 只含連續 ≥2 週的對照試驗；Warneke 2024 急性是「與其他活動比較」，不是「與不做比較」，因此不能讀成「伸展無效」。
- 我的解讀（文章中標明）：同一批作者（Behm）重複出現，獨立重複驗證似乎少。

## 要小心的

- Guo 摘要寫 Pilates「最佳」，但組間差異不顯著；整體 SMD 0.70 是排除 10 項後的值（排除前 1.03）；「safe」結論，正文我搜尋 adverse／harm／side effect 沒找到不良事件分析；也沒有 GRADE 與發表偏差分析（搜尋 GRADE、funnel、Egger、publication bias 皆無）。
- Guo 的對照組混合（不運動／一般照護／非特定活動），無法回答核心訓練是否優於一般運動。劑量（每週 3–4 次等）來自 meta-regression 子集（k=10、17），作者自稱「optimal」，文章不採。
- Warneke 2024 急性：摘要與內文數字不一致（摘要 ROM ES=0.01、p=0.88、PEDro 4.58、「low to moderate certainty」；內文 ES=0.05、p=0.51、PEDro 4.62、ROM 中等）。文章只寫「無顯著差異」與內文的確定性。Fig. 2 圖說 ES=-0.374、p=0.031 與內文也不一致；未引用。
- Warneke 作者群與長期伸展研究：第一作者同為 Warneke，且 Behm 為多篇共同作者；各篇皆聲明無利益衝突。我只讀到這些，沒有查他們的資金或其他立場。
- Wiewelhove 摘要重點（支持作為暖身而非恢復工具）與結論（強調滾後可緩痠痛）略有不同；文章只引用結果，不取任何一邊的實務建議。
- Konrad 2024 對機制的描述（忍受度）出自討論，原文用 “thought to be”，文章已標為「推測」。

## 對本篇的影響

- 傷害預防三法皆無可讀證據：Thacker 2004（15076777）、Herbert 2011（21735398）、Lewis 2014（25401202）在 Europe PMC 標示非開放、無全文，未讀。
- 核心訓練只涵蓋慢性非特異性腰痛的疼痛與功能；不寫表現與傷害預防。
- 不寫任何訓練劑量、課表。
