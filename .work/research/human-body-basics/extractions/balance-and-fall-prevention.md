# 精讀紀錄：平衡與跌倒預防（order 12）

## 來源與讀取程度

| 來源 | 取得管道 | 讀取程度 |
|---|---|---|
| Khan MJ, Fong KNK, Wong TW, Tsang WW, Chen C, Chan WC, Winser SJ. *Effectiveness of dual-task exercise in improving balance and preventing falls among older adults: systematic review with meta-analysis and meta-regression.* Eur Geriatr Med 2025;16(6):2047–2083. doi:10.1007/s41999-025-01328-3。PMID 41152559、PMCID PMC12743702（Europe PMC `EXT_ID:41152559 AND SRC:MED` 核對）。CC BY 4.0 | Europe PMC fullTextXML（Groundlane web_fetch，extract=full，輸出被截在 100,000 字元，但涵蓋摘要、引言、方法、結果、討論與限制；後段的結論與參考文獻未必完整）；討論段另以 Springer 頁面 `section[data-title="Discussion"]` 讀全 | 全文（摘要、方法、結果、討論、限制）。補充檔（Supplementary 1–3，含 GRADE 表）沒讀；MCID 的出處文獻 [84][85] 沒讀 |
| Sherrington C, Fairhall NJ, Wallbank GK, Tiedemann A, Michaleff ZA, Howard K, Clemson L, Hopewell S, Lamb SE. *Exercise for preventing falls in older people living in the community.* Cochrane Database Syst Rev 2019;1:CD012424. doi:10.1002/14651858.CD012424.pub2。PMID 30703272、PMCID PMC6360922（Europe PMC 核對） | Europe PMC search（resultType=core）回傳的 abstractText | **只讀摘要**。全文非開放（isOpenAccess=N），fullTextXML 先前掃描為 HTTP 500，本次未再試 |
| Bull FC 等，WHO 2020 guidelines. BJSM 2020;54:1451–1462. doi:10.1136/bjsports-2020-102955 | 沿用既有精讀紀錄 `who-2020-physical-activity-guidelines.md`（已讀全文並逐句比對） | 本篇只用其中老年人建議（表 4）與「高確定性證據」那句，沿用該紀錄 #8、#9 及限制 1 |

## 可用陳述的逐字引文

Khan 2025（程式比對 khan 全文：通過）
| 內容 | 原文 |
|---|---|
| 納入規模 | "Forty-four studies involving 2782 older adults were included." |
| BBS 合併 | "MD = 1.78; 95%CI: 0.72, 2.83"（n=18，非常低確定性，I²=93.07%） |
| TUG 合併 | "MD =  − 0.73; 95%CI: − 1.12, − 0.34"（n=21，低確定性，I²=93.56%） |
| 跌倒合併 | "MD =  − 0.33; 95%CI: − 0.63, − 0.03"（n=6，中確定性，I²=83.22%）；Table 3 同一格寫 −0.30（−0.54, −0.06） |
| 未達 MCID | "the MD did not meet the MCID threshold"（BBS 3、TUG −2.2，文獻 [84][85]） |
| 作者假設 | "we hypothesise a higher MD if the optimal treatment dosage is met" |
| 自填跌倒 | "The self-reported approach is subject to recall bias" |
| 族群限制 | "Participants in the majority of included studies were ambulatory and independent, limiting the study’s generalisability to frail older adults." |

Sherrington 2019 摘要（程式比對：逐字貼自 Europe PMC 回傳的 abstractText 後比對，通過；因網路限制，比對的基準是我手動貼入檔案的摘要句，不是自動下載檔）
| 內容 | 原文 |
|---|---|
| 結論 | "Exercise programmes reduce the rate of falls and the number of people experiencing falls in older people living in the community (high-certainty evidence)." |
| 平衡與功能類 | "balance and functional exercises reduce the rate of falls by 24%"（RaR 0.76, 95% CI 0.70 to 0.81；7920 人、39 研究；高確定性。同句：一次以上跌倒的人數少 13%，RR 0.87） |
| 偏差風險 | "Most trials had unclear or high risk of bias for one or more items." |
| 不確定 | "We are uncertain of the effects of programmes that are primarily resistance training, or dance or walking programmes on the rate of falls and the number of people who experience falls." |
| 不良事件 | "monitored closely in both exercise and control groups in only one trial" |
| 規模 | 108 RCT、23,407 人、25 國；平均 76 歲、77% 女性；排除特定疾病如中風 |

WHO 2020（沿用既有紀錄的逐句比對）
- "older adults should do varied multicomponent physical activity that emphasises functional balance and strength training at moderate or greater intensity on 3 or more days a week"
- "High-certainty evidence demonstrates that balance and functional exercises reduce the rate of falls"（本篇文章用的是轉述，沒加引號）

## 作者列出的限制（Khan 2025 討論）
1. 各研究異質性近 100%（"nearly 100% heterogeneity"），限制解讀與推廣。
2. 動作-動作、認知-認知型的研究很少（3、2 篇）。
3. 只看 5 個結果指標（BBS、FAB、TUG、dTUG、跌倒），沒有 Mini-BESTest 等。
4. FAB 與跌倒次數因研究太少沒做 meta-regression。
5. 參加者多半能走動、獨立生活，不能推到虛弱老人。
6. 只納入英文與中文；沒納入未發表研究。
7. 跌倒資料全靠自填；基線都是回溯問卷，後測 3 篇用日誌、3 篇沒有。

## 要小心的

- **內部不一致：** 摘要寫「58% 低偏差風險」，結果段寫 54%（24/44）；結果段稱平均 PEDro 6.05「indicating high methodological quality」，但同一份又說 GRADE 為非常低到中；跌倒平均差內文 −0.33、Table 3 −0.30；BBS 表中 "P-value: < 0.001" 與 "0.02" 出現在不合理的位置、動作-動作的 MD 寫成 "−0.22.07"（顯然是排版錯誤）。文章只引用內文主結果，並在文中說明跌倒數字的差異。
- **跌倒的單位不明：** 我讀到的部分沒有說這個 MD 是每人每年、每人整個期間、或比率，所以文章不換算百分比。
- **最佳劑量（4 週、每週 3 次、30 分鐘、95% 出席）：** 來自 meta-regression（跨研究的比較，不是直接把人分到不同劑量），作者自己說沒有任何納入研究達到；作者還說 95% 出席在真實世界難達成。文章刻意不寫劑量。
- **Cochrane 只讀摘要：** 作者結論段與主要結果在摘要裡，但亞組比較（如 P=0.004、I²=71%）、偏差細節要全文。文章沒用它。
- 兩篇的「跌倒」不同：Cochrane 的主要結果是「跌倒率（rate of falls）」，只納入社區居住者；Khan 的跌倒包含社區、照護機構與護理之家。文章把兩者分開寫。
- Khan 研究的是雙重任務訓練，不等於一般平衡訓練，不能把它的測驗結果寫成「平衡訓練無效」或「有效」。

## 對本篇的影響

- 主軸是「兩種結果」：真實跌倒（Cochrane 高確定性；Khan 中確定性、自填）vs. 測驗分數（Khan BBS 非常低、TUG 低、未達作者引用的 MCID）。
- 刻意不寫：最佳劑量、各運動型態比較、課表。
- 範圍縮小：Cochrane 只有摘要，Khan 只涵蓋雙重任務，族群為 60+ 能走動者；不涵蓋照護機構（Dyer 2025 Cochrane 未讀）、太極（Li 2024 未讀）、ESSA 立場聲明（非開放，未讀）。
