# post-verify：balance-and-fall-prevention（zh 與 -en）

查證日 2026-10-25。不修改文章。

## 實際取得的來源
| 來源 | 工具 | 程度 |
|---|---|---|
| Khan 2025（PMC12743702） | Groundlane web_fetch，Europe PMC fullTextXML，extract=full | 輸出被截在 100,000 字元，涵蓋摘要、方法、結果、表 2/3、討論、限制、參考文獻起頭。補充檔未讀，MCID 出處 [84][85] 未讀 |
| Sherrington 2019（PMID 30703272） | Groundlane web_fetch，Europe PMC REST search（resultType=core）的 abstractText，自動下載，不是手貼檔 | 完整摘要。PubMed 頁面回 403 |
| WHO 2020（PMC7719906） | Groundlane web_fetch，fullTextXML | 前 80,000 字元，含摘要、表 3/4、老年人建議、限制 |

## 判定總表
Contradicted：無。Unverifiable：無。

### Confirmed
- Khan：BBS MD 1.78（0.72, 2.83），GRADE 非常低，I² 93.07%；TUG −0.73（−1.12, −0.34），低，I² 93.56%；跌倒 −0.33（−0.63, −0.03），GRADE 中，I² 83.22%，n=6；Table 3 同欄為 −0.30（−0.54, −0.06）。
- Khan：44 研究 2,782 人；排除中風、帕金森氏症、失智症；MCID 門檻 BBS 3、TUG −2.2，原文 "the MD did not meet the MCID threshold"；"we hypothesise a higher MD if the optimal treatment dosage is met"，且 "none of the studies ... met the optimal treatment dosage criteria"；自填跌倒有回憶偏差；限制 (5) 為 ambulatory and independent，不能推到 frail。
- Khan：納入條件 "adults above 60 years of age"，與文章「60 歲以上」一致。
- Cochrane 摘要：108 RCT、23,407 人、25 國、平均 76 歲、77% 女性；納入 60+ 社區居住者，排除特定疾病如中風；結論句與 "high-certainty evidence" 逐字吻合；平衡與功能類 RaR 0.76（0.70, 0.81）、24%、39 研究、7,920 人、高確定性；偏差風險句、不良事件僅一試驗在兩組密切監測、阻力訓練／舞蹈／走路不確定，皆吻合。寫手所用的手貼檔與重取的摘要一致。
- WHO：原文 "High-certainty evidence demonstrates that balance and functional exercises reduce the rate of falls"；建議 "varied multicomponent ... functional balance and strength training at moderate or greater intensity on 3 or more days a week ... to prevent falls"；限制段 "Due to the lack of direct evidence, considerable extrapolation was needed"。

### 跌倒率 vs 平衡測驗分數的區分
忠實。文章把 Cochrane 的跌倒率（高確定性）與 Khan 的 BBS／TUG（非常低／低）分開，也把 Khan 的跌倒次數（中、自填、單位不明）單獨列出，沒有把測驗進步說成跌倒減少。tldr 一致。注意：Khan 摘要自己寫 "reduces fall frequency"，文章只說方向，沒放大，是保守的。

## Misframed（皆為小項，建議改法）

1. 「照護機構不在範圍內」與 Khan 的實際納入不符（zh 第 106 行；en 第 71 行「Older adults in care facilities ... outside what I read」；zh 第 43 行「多半能自己走路」不受影響）。
   Khan 表 2 把 Residential care／Nursing home residents 的試驗納入（例如 Franco 2012、Htut、Rezola-Pardo 2022 養護機構；Reve & de Bruin 2014 residential care，且是 6 個跌倒研究之一）。作者在引言還寫本回顧要探討 "other study settings, such as old-age homes"。
   所以「照護機構的老人不在我讀到的範圍內」對 Cochrane 成立，對 Khan 不成立。
   建議：改成「Cochrane 只含社區居住者；Khan 納入了少數住在照護機構的試驗，但多數是社區老人，我沒有按場所拆開看」，或加限定「Cochrane 這份」。

2. 「這些證據談的是 60 歲以上」對 WHO 不精確（zh 第 43 行、第 95 行；en 對應處）。
   Cochrane 與 Khan 是 60+，WHO 的老年人定義是 65+（"Older adults (aged 65 years and older)"）。
   建議：第 89 行 WHO 段補一句「WHO 的老年人指 65 歲以上」，或把總括句改成「60 歲或 65 歲以上」。

3. 「這份指引談的是一般族群」（zh 第 91 行；en 第 56 行 "the guidelines address the general population"）略偏。
   WHO 老年人建議明寫適用 "including those with chronic conditions and those living with disability"，只是這些族群缺直接證據、靠外推。後半句文章已寫對，前半句容易讓讀者以為指引不含慢性病族群。
   建議：改成「指引的老年人建議也涵蓋慢性病與身心障礙者，但它承認這些族群缺直接證據，很多地方靠外推」。

## 小提醒（不必然要改）
- Cochrane「全文不是開放取用」（zh 第 47 行）：Europe PMC 的 isOpenAccess=N，但同一筆紀錄列出免費全文 HTML／PDF（europepmc.org/articles/PMC6360922）。「只讀摘要」的揭露是誠實的；若想精確，可改成「全文我沒讀」，不要寫「不是開放取用」，避免讀者以為讀不到。
- Khan 第 77 行跌倒的 CI（−0.63 到 −0.03）下限已接近 0，而原文同時標 P<0.001，內部不太一致；Table 3 的 CI 為 −0.54 到 −0.06。文章已說明 −0.33 與 −0.30 的差異，建議再加一句「兩處 CI 也不同」，或維持現狀。屬作者資料的瑕疵，不是文章的錯。
- Khan 第 83 行「6 個研究的跌倒次數都靠參加者自己回報」：原文是「3 篇用跌倒日誌、3 篇沒用」，皆為自填，主張成立。
- 限定語檢查：文章的「沒有／找不到」皆有「我讀到的／我查的」類限定（zh 第 65、83、95、106 行），歸屬標籤不過量，zh 與 en 主張一致。

## 範圍聲明
只檢查文中已提出的宣告。Khan 補充檔（GRADE 表）、MCID 出處文獻、Cochrane 全文與 WHO 後段均未核對。
