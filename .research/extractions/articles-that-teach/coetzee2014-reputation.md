# 抽取紀錄：Coetzee、Fox、Hearst、Hartmann 2014，Should Your MOOC Forum Use a Reputation System?（CSCW '14，pp. 1176–1187，doi 10.1145/2531602.2531657）

- 作者全名（對過首頁）：Derrick Coetzee、Armando Fox、Marti A. Hearst、Björn Hartmann（UC Berkeley 資訊科學系與資訊學院）
- 原文檔：`.research/raw/learning-content/q5-social/coetzee2014-reputation.pdf`（12 頁）。清單列的 `coetzee2014-reputation.txt`（88,077 字元）是 `-layout` 雙欄轉文字，**沒有用**；改用不帶 `-layout` 的 `pdftotext` 重轉到 scratch（`coetzee.txt`，1,417 行、62,515 字元），行號都指這份重轉檔。
- 版本與取得：刊出版面（CSCW'14 會議論文，首頁註明作者以 CC BY 3.0 釋出，L50–53「The authors have released this work under the Creative Commons Attribution License 3.0」）。清單記載掃描者從共同作者 Hearst 的 Berkeley 個人頁下載；我試 `people.ischool.berkeley.edu/~hearst/papers/coetzee_cscw14.pdf` 回 404，原下載網址沒有留紀錄。出版者端：Unpaywall（2026-10-14 查）列 bronze，`https://dl.acm.org/doi/pdf/10.1145/2531602.2531657`。因為論文本身是 CC BY 3.0，版本合法性沒有疑慮。
- 讀取日期：2026-10-14
- 供：order 21（第 1 列）

## 研究設計

- **類型**：單一課程內的受試者間田野實驗（between-subjects field experiment），加上論壇使用者對非使用者的相關分析（L94、L192–194）。
- **課程**：edX 的 CS169.1x: Software as a Service（UC Berkeley），七週、開放註冊，2013 年 3 月那一輪（L192–194、L251）。11 段講課影片、4 份作業、4 份小考（L197）。論壇由學生與社群助教自管，講師不進論壇（L211–213）。
- **受試者**：註冊 5,985 人、通過 532 人（Table 1，L251–300）。1,101 人同意參加論壇實驗：完整版論壇 548 人、基本版 553 人；471 人選擇退出、改用原本的 edX 論壇（L375–377）。3,391 人（68%）看過至少一段課程內容卻從沒進過任何論壇（L377–378）。另有 216 人簽了較寬的同意書，允許把論壇活動與 edX 成績連起來（L387–389）。
- **分派**：第一次進論壇時依使用者名稱的雜湊隨機分到兩個論壇之一，無法進另一個；兩個論壇內容不共用（L217–221）。
- **處理**：兩個論壇都用開源 OSQA（類 Stack Overflow，討論串深度最多三層）。基本版：可發問、回答、留言、標籤與全文搜尋、追蹤與私訊。完整版另加聲望系統：上下票（票多的答案排前面）、依得票累積聲望分數並逐步解鎖管理權限、發問者可選最佳答案（L222–237）。兩版都在作業與講課頁放了連到相關標籤討論的連結（L238–241）。用 OSQA 的「bootstrap mode」，賺權限所需分數較少（L1253–1254）。
- **量了什麼**：期末成績（0–100，50 分通過）、留存（從開課到最後一次存取課程網頁的天數）、各次作業與小考分數（只算有完成該次的人）、回覆數、首次回覆時間、Rovai 課堂社群量表（20 題五點量表，0–80 分）、求助語句、課後問卷（L471–516）。
- **何時量**：成績與點擊流是整門課；社群量表與問卷在課程結束後寄出（L242–246、L468–469）。

## 結果（逐項）

PDF 第 7 頁 Table 3 是全文的假設總表，下面每一列都對過 PDF 版面。

### A. 論壇使用者對非使用者（相關，不是實驗結果）

定義：論壇使用者＝進過實驗論壇或 edX 論壇的人（1,572 人）；非使用者＝不是論壇使用者但看過至少一段講課、作業或小考的人（3,221 人）（L597–601）。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 期末成績零分比例 | 非使用者 78% 零分，使用者 26%；中位數 22% 對 0% | 進過論壇 vs 沒進過 | Forum Use Correlated With Higher Grades and Retention；Figure 4 | L602–605 | 「78% of those who don't visit the forum receive zeros as final grades, as compared to only 26% of those who visit the forum, and the median score is 22% as opposed to 0%」 |
| 2 | 成績差異檢定 | Mann-Whitney U = 701305.5，n1 = 1,321，n2 = 2,622，p < 0.001（H1 成立）；只取非使用者成績最高的 1,321 人比仍顯著（U = 480786.0，p < 0.001） | 同上 | 同上；Table 3 H1 | L606–608 | 「This difference is significant (Mann-Whitney U = 701305.5, n1 = 1321, n2 = 2622, p < 0.001), and hypothesis H1 is supported.」 |
| 3 | 留存 | 中位數 39／42 天 vs 19／42 天；Table 3：U = 1722209，n1 = 1,528，n2 = 4,634，p < 0.001 | 同上 | 同上；Figure 5；Table 3 H2 | L609–612；Table 3 | 「lasting for a median of 39 out of 42 days as opposed to 19 of 42 days for students who don't visit the forum」 |
| 4 | 個別作業／小考（只算有交的人） | HW1：論壇 737 人中位 700 vs 非論壇 216 人中位 610，U = 60099，p < 0.001；HW2：471 人 300 vs 85 人 300，U = 17308，p < 0.02；HW3：350 人 500 vs 56 人 500，U = 9110，p > 0.1；HW4：259 人 500 vs 47 人 500，U = 5658，p > 0.2；Quiz 1：703 人 8 vs 290 人 7，U = 84436，p < 0.001；Quiz 2：476 人 11 vs 164 人 10，U = 31025，p < 0.001；Quiz 3：401 人 8 vs 290 人 8，U = 19839，p < 0.008 | 同上，限有完成該次評量的人 | Table 4（PDF 第 6 頁，已對版面） | L641–687、L699–705 | 「forum participation was associated with significantly better scores on all assessments except for the last two homeworks, where no difference could be shown.」 |
| 5 | 作者對相關的定性 | 只是相關 | — | 同上 | L690–691 | 「Note that because forum users were self-selected, both these results are solely correlational.」 |

### B. 聲望系統的實驗結果（完整版 vs 基本版論壇，隨機分派）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 6 | 被動參與（看幾串） | 七成以上的人看 10 串以下；兩組沒差：U = 150996，n1 = 546，n2 = 555，p > 0.4 | 完整版 vs 基本版 | Reputation Features Improve Forum Response Metrics；Figure 6 | L827–830 | 「we could show no significant difference in the number of threads users of each forum viewed」 |
| 7 | 每題回覆數 | 平均 3.5 vs 2.4（Table 3 寫 2.3）；U = 5609，n1 = 115，n2 = 144，p < 0.001；沒人回的題目基本版 21 題（15%）、完整版 1 題 | 同上 | 同上；Figure 7；Table 3 H3 | L831–834、L862–864 | 「Questions received a mean of 3.5 responses as opposed to 2.4 in the basic forum, and this difference was significant.」 |
| 8 | 首次回覆時間（只算有人回的題） | 中位數 59 分鐘 vs 2 小時 20 分（Table 3 寫 2 hr 21 min）；U = 4626，n1 = 110，n2 = 120，p < 0.001；一小時內有回覆的：49 題（50%）vs 35 題（30%） | 同上 | 同上；Figure 8；Table 3 H3 | L837–839、L951–954 | 「Median time to first response was 59 minutes as opposed to 2 hours and 20 minutes in the basic forum, and this was also significant」 |
| 9 | 發文行為 | 完整版的使用者較不會發文（Fisher p ≈ 0.036）；基本版的貼文較可能是提問（p ≈ 10⁻⁶）；回答意願沒差（p > 0.5） | 同上 | Results 開頭 | L518–526 | 「users on the full-featured forum are less likely to post (p ≈ 0.036)—it has more posts overall but less users posting questions and answers.」 |
| 10 | 貼文集中度 | 前 10 名貼了 54%（完整版）與 32%（基本版）；完整版前兩名分別佔 23% 與 9% | 同上 | 同上；Figure 3 | L527–531 | 「The top 10 posters in each forum contribute a substantial portion of overall posts: 54% and 32% in the full-featured and basic forums, respectively.」 |
| 11 | 期末成績（H4，**無效果**） | 中位數 73 vs 71；U = 4235.5，n1 = 89，n2 = 97，p > 0.4 | 同上，只限簽了寬同意書的人 | No Significant Effect of Reputation System on Student Outcomes；Figure 9 | L869–871 | 「No significant difference was found (Mann-Whitney U = 4235.5, n1 = 89, n2 = 97, p > 0.4), and H4 was not supported.」 |
| 12 | 課程留存（H5，**資料不足**） | 簽寬同意書的子樣本八成五以上都留到最後，無法判斷 | 同上 | 同上 | L876–880 | 「providing insufficient data to confirm or reject H5」 |
| 13 | 論壇留存（H5 的替代量法，**無效果**） | 最後一次進論壇的中位數 24.5 天 vs 26.1 天；U = 147315，n1 = 546，n2 = 555，p > 0.2 | 同上，全部實驗參與者 | 同上；Figure 10 | L915–922 | 「no significant difference was shown (Mann-Whitney U = 147315, n1 = 546, n2 = 555, p > 0.2), providing no evidence for H5.」 |
| 14 | 社群感（H6，**無效果**） | Rovai 量表平均 48.5 vs 49.8（滿分 80）；回覆 43 vs 40 人；t(81) = −0.35，p > 0.7 | 同上，課後問卷回覆者 | No Significant Effect of Reputation System on Sense of Community；Figure 11 | L926–934 | 「No significant difference between forums was found (t(81) = −0.35, p > 0.7), and H6 is not supported.」 |
| 15 | 求助語句（H7） | 完整版 24／819 篇（2.9%，19／546 人）vs 基本版 43／587 篇（7.3%，31／555 人）；Fisher p ≈ 0.0002；三位評分者盲評，κ = 0.80 | 同上 | Reputation Features Decrease Appeals for Help | L982–990 | 「This is a significant difference (Fisher's exact test, p ≈ 0.0002), and H7 is supported.」作者另加但書 L991–993：可能只是抱怨，不一定是想說服人幫忙 |
| 16 | 自評論壇有用程度 | 0–4 分中位數都是 2.0（U = 629.0，n1 = 37，n2 = 39，p > 0.1）；找到答案的頻率中位數 2.5 vs 3.0（U = 665.5，p > 0.3） | 同上，問卷 | No Significant Difference in Usefulness | L1002–1004、L1028–1030 | 「the median rating of usefulness of both forums was 2.0, and we found no significant difference」 |
| 17 | 聲望功能的評價（只問完整版） | 上票與選最佳答案的有用程度中位數 2.0（0–3），60% 說「總是」或「通常」有用；62% 認為聲望系統公平 | 無對照 | Reputation Features Moderately Useful | L1033–1039 | 「60% of students rating them "always" or "usually" useful」 |
| 18 | 動機 | 89% 說提高聲望「不重要」或「有點重要」；主要理由是幫助別人；40% 說若分數能帶到其他 edX 課會更有動機 | 無對照，問卷 | Motivating…；Motivated By Altruism；Figure 12 | L1042–1054 | 「89% of students reported it was "unimportant" or only "a little important" to increase their reputation score.」作者也提醒問卷不匿名、可能低報（L1055–1060） |

### C. 討論裡的定性結論

- 聲望系統的益處「具體但有限」：回覆更快更多，但成績與社群感沒差（L1089–1095）。
- 論壇使用與成績、留存的強相關「難以解讀」（L1102–1103「The strong correlation between forum usage and student outcomes like retention and grades is difficult to interpret due to a range of possible confounding factors」）；作者列了三個替代解釋（L1164–1173）：更認真的學生較會遇到要求助的難題；很早就退的人根本沒用到論壇的機會；英語或技術能力不足的人用不了論壇，也念不好課。
- 結論說要提升整體成效，得找能觸及「66% 從沒進過論壇」的學生的介入（L1264–1266）。

## 作者自己列的限制（L1122–1184）

1. 單一課程單一輪；軟體工程學生熟悉論壇（18%「常用」、21%「每天用」）；最熱門的 MOOC 人數多一個數量級。
2. 少數極活躍使用者：完整版前 5 名貼了 43%、基本版前 5 名 21%；無法把他們從整體論壇效果裡分開。
3. 自我選擇：只有 67% 的論壇訪客同意參加；參加者中只有 20% 同意連成績、8% 回問卷；這兩項在課程後段做，可能高估社群感。
4. 相關不是因果（見上 C）。
5. 外部效度與污染：實驗論壇在另一個網域、要重新登入與簽同意書；學生可能在 edX 原論壇、Facebook、Skype 讀書會交流，兩組資訊互通。
6. 結論段另補（L1252–1259）：只測了一種論壇設計（問答式、不是長討論），用的是 bootstrap mode 的計分。

## 與摘要說法不一致的地方

- 摘要說聲望系統對「grades, retention」都沒有顯著影響（L27–28）。正文的成績比較只有 89 對 97 人（簽寬同意書的子樣本）；課程留存其實是「資料不足、無法判斷」（L880），改量的是「論壇留存」（最後一次進論壇），不是課程留存。摘要寫成「no significant impact on … retention」比正文說得滿。
- 零分比例：正文兩處寫 78%（L603、L695），Table 3 寫 88%（PDF 第 7 頁已對）。
- 基本版每題平均回覆數：正文 2.4（L833），Table 3 寫 2.3。首次回覆時間：正文 2 小時 20 分，Table 3 寫 2 hr 21 min。
- H2（留存）的檢定：正文 L689 寫「Mann-Whitney U = 5609, n1 = 115, n2 = 144」，這組數字在 Table 3 屬於 H3（回覆數；115 與 144 正好是兩個論壇的提問數，Table 2）；Table 3 給 H2 的是 U = 1722209，n1 = 1,528，n2 = 4,634。正文應是貼錯數字。兩處 n 也都與正文定義的 1,572 對 3,221 人對不上（H1 的 n 是 1,321 對 2,622，原文沒解釋差額）。
- 兩個論壇的人數：L375–376 寫 548 與 553；Results 開頭寫「562 vs. 578」（L481–482）；Table 2 與後面的檢定用 546 與 555。原文沒解釋。
- 沒進過論壇的比例：L378 寫 68%，結論 L1266 寫 66%。同意參加比例 67%（L1151），用 1,101／1,572 算是 70%。
- 以上都不影響「回覆數與速度有差、成績與社群感沒差」的方向，但引數字時要註明出處是正文還是 Table 3。

## 與清單「要撐的結論」不合的地方

清單：「聲望制度讓回覆變多變快，成績、留存、社群感沒變；論壇與成績的相關『難以解讀』」。

- 回覆變多變快：撐得住（3.5 vs 2.4，59 分鐘 vs 2 小時 20 分）。但要一起寫：完整版的發文人數反而較少（p ≈ 0.036），前兩名使用者貼了 32% 的文，作者自己說無法排除這幾個人的影響。
- 成績沒變：撐得住，但只有 89 對 97 人。
- 留存沒變：要改寫成「論壇留存沒差；課程留存因樣本留存率太高無法判斷」。
- 社群感沒變：撐得住，但只有 43 對 40 份課後問卷（回覆率 8%），作者說可能高估。
- 「難以解讀」：原文確有此語（L1102–1103），而且附了三個替代解釋，可直接引。
- 另一個要注意：聲望系統比的是「有沒有上下票與聲望分數」，兩組都有論壇；這篇不能拿來回答「有沒有論壇」的因果效果。

## 讀取紀錄

- 重轉檔 L1–500（標題、摘要、引言、相關研究、方法、受試者、假設、依變項、結果開頭）
- L500–1000（論壇參與、使用者對非使用者、聲望效果、成績、留存、社群感、求助語句、質性結果開頭）
- L1000–1418（質性結果、討論、限制、給研究者與平台的建議、結論、致謝、參考文獻；參考文獻只掃過）
- 合計涵蓋全文。
- 對過 PDF 版面：第 5 頁（Table 2）、第 6 頁（Table 4、Figure 3–5）、第 7 頁（Table 3、Figure 6–7）。非 layout 轉文字把 Table 3 拆散，H2／H3 的檢定欄是在 PDF 上對齊確認的。
