# 抽取紀錄：Honma、Masaoka、Iizuka、Wada、Kamimura、Yoshikawa、Moriya、Kamijo、Izumizaki 2022，Scientific Reports

- **書目**：Motoyasu Honma, Yuri Masaoka, Natsuko Iizuka, Sayaka Wada, Sawa Kamimura, Akira Yoshikawa, Rika Moriya, Shotaro Kamijo, Masahiko Izumizaki (2022). Reading on a smartphone affects sigh generation, brain activity, and comprehension. *Scientific Reports*, 12, 1589. doi:10.1038/s41598-022-05605-0。作者全名依 PMC 檔頭核過（九位，全部屬昭和大學醫學部生理學講座）。收稿 2021-09-13，接受 2022-01-13，刊出 2022-01-31。
- **原文檔**：`.research/raw/learning-content/q5-social/honma2022-smartphone.txt`，48 行、38,294 字元（`wc -c` 38,593 位元組）。同目錄另有 `honma2022-smartphone.html`（85,192 位元組，同一頁的 HTML）。
- **取得網址與版本**：PMC 刊出版全文 https://pmc.ncbi.nlm.nih.gov/articles/PMC8803971/（檔頭 `PMC8803971`、PMID 35102254、`is-manuscript no`、`is-preprint no`）。CC BY 4.0 開放取用（檔頭授權聲明），出版者經 PMC 合法公開，可用。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 24（清單 F 第 24#11 列）
- **補充材料**：Supplementary Text（兩段小說原文）、Supplementary Fig. 1–5 沒有取得，正文引到時照實標「未讀」。

## 研究設計

- **類型**：探索性的受試者內交叉設計（「repeated-measured (cross-over) design」；作者自稱 exploratory：「this study investigated the involved mechanism in an exploratory manner」「This exploratory study examined…」，字元約 4,700–5,600）。
- **受試者**：34 位日本大學生，全部右利手、無神經或精神病史，20 位女性，平均 20.4 歲（SD 0.8），視力正常或矯正後正常（Materials and methods／Participants）。招募方式、是否有報酬沒寫。
- **條件**：媒介（智慧型手機 vs 紙本）× 文本（小說 A vs 小說 B）共四種組合；**每位受試者只做兩個 trial**，媒介與小說都不重複（例如第一次是手機讀 A，第二次就是紙本讀 B），順序對抗平衡（Experimental design）。所以媒介是受試者內比較，但同一人在兩種媒介下讀的是不同小說。
- **教材**：村上春樹兩部小說的節錄。A：《挪威的森林》（1987）3,060 個日文字；B：《沒有色彩的多崎作和他的巡禮之年》（2013）3,067 個日文字。全部受試者事後都說沒讀過這兩部小說。敘事文，不是說明文。
- **媒介的規格**：手機 5.0 吋、1920×1080，字的大小視角 0.85 度。**紙本的字級與手機相同，紙本的重量（148 g）與外框（高 144 mm、寬 72 mm、厚 8.6 mm）也做成與手機一樣**。也就是說，這裡的「紙本」是手機大小的紙，不是一般書頁。原文沒寫手機上是捲動還是翻頁，也沒寫紙本有幾頁；限制段提到「turning pages」的動作沒有控制。
- **流程**：每個 trial 四段：讀前靜息 2 分鐘 → 閱讀（**不限時**）→ 讀後靜息 2 分鐘 → 閱讀測驗（10 題，與小說內容有關；題型、計分方式原文沒寫）。全程用鼻子呼吸，軀幹與手臂固定；靜息時睜眼看牆。觀看距離由受試者自選，實驗者量測。
- **量了什麼**：(a) 閱讀測驗分數；(b) 閱讀時間、觀看距離；(c) 呼吸六項（潮氣容積、呼吸頻率、吸氣時間、呼氣時間、每分鐘通氣量、嘆息次數）與代謝兩項（耗氧量、呼氣末 CO₂），用 Aeromonitor AE-280；嘆息的定義是潮氣容積至少為該段平均的兩倍；(d) 前額葉活動，用兩通道 NIRS（左、右）量含氧血紅素濃度。
- **統計**：RM-ANOVA 與事後 t 檢定，雙尾，Bonferroni 校正後 P < 0.05；JMP Pro 16.0。路徑分析用 AMOS 27.0，方法段說模型適配用 RMSEA 判定，結果段報的是 GFI（見「與摘要不一致」第 4 條）。
- **何時量**：每個 trial 當下立刻測驗；沒有延宕測驗。

## 結果（逐項）

正文沒有任何數字表；分數的平均與標準誤只在 Fig. 1b 的長條圖裡，文字檔裡沒有，**所以手機與紙本各幾分、差幾分、效果量多大，原文文字都沒給**。以下「字元」是原文檔的字元位置（Python 計數）。

| # | 結果 | 數字 | 對照條件 | 節／圖 | 字元位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 閱讀分數：媒介主效果 | F(1,32) = 26.445，P < 0.0001；平均數、效果量未報告 | 手機 vs 紙本（受試者內，34 人） | Results／Fig. 1b | 約 6,700–7,000 | 「repeated-measured analysis of variance (RM-ANOVA) revealed that reading medium affected reading scores (F 1,32 = 26.445, P < 0.0001), while the main effects of novel did not.」 |
| 2 | 閱讀分數：兩部小說各自的事後比較 | 兩部都是紙本 > 手機，P < 0.05 | 同上，分小說 | Results／Fig. 1b | 同上 | 「Post-hoc tests revealed that scores with the paper medium were higher than those with the smartphone in both novels A and B ( P < 0.05, Fig. 1 b).」 |
| 3 | 小說主效果、交互作用 | 不顯著（未給統計量） | 小說 A vs B | Fig. 1 圖說 | 約 6,300 | 「the main effect of medium was significant, while the main effects in novel and the interaction were not.」 |
| 4 | 閱讀時間 | 媒介、小說、交互作用都沒有效果（未給統計量；平均閱讀時間未報告） | 手機 vs 紙本 | Results／Fig. 1c | 約 7,000 | 「No main or interaction effects of medium or novel were observed for the duration of reading (Fig. 1 c) or viewing distance between participants' eyes and the device (Fig. 1 d).」 |
| 5 | 觀看距離 | 同上，無效果 | 同上 | Fig. 1d | 同上 | 同上 |
| 6 | 潮氣容積、吸氣時間、呼氣時間、呼吸頻率 | 只有「時段」主效果：潮氣容積 F(2,67) = 8.821；吸氣時間 8.639；呼氣時間 6.212；呼吸頻率 5.3622，全部 P < 0.0001。媒介沒有效果 | 讀前／讀中／讀後 × 手機／紙本 | Results／Fig. 2c–f | 約 7,000–8,000 | 「RM-ANOVA revealed that there was an effect of session, but not of medium, and an interaction for the tidal volume」 |
| 7 | 嘆息次數 | 媒介 F(2,67) = 26.623、時段 F(2,67) = 6.530、交互作用 F(2,134) = 9.169，全部 P < 0.0001；平均次數未報告 | 同上 | Results／Fig. 2g | 同上 | 「The number of sighs was greater during reading using a paper medium than during reading while using a smartphone (all P < 0.05).」 |
| 8 | 每分鐘通氣量、耗氧量、呼氣末 CO₂ | 整個過程沒有變化 | 同上 | Supplementary Fig. 2（未讀） | 約 8,000 | 「No changes in minute ventilation, O 2 consumption, or end-tidal CO 2 were observed throughout the sessions」 |
| 9 | 嘆息間隔 | 四個條件之間無顯著差異；只算一個 trial 內有兩次以上嘆息的情形，共 121 個點、來自 40 個 trial | 手機／紙本 × 小說 A／B | Supplementary Fig. 3（未讀） | 約 8,200 | 「The ANOVA indicated no significant differences between conditions」 |
| 10 | 前額葉活動（左通道） | 媒介主效果與交互作用**不顯著**；時段主效果 F(2,67) = 17.119，P < 0.0001。事後比較：左通道手機 > 紙本（P < 0.05） | 同上 | Results／Fig. 3b | 約 9,300–10,000 | 「The RM-ANOVA showed that there was no main effect of medium or interaction in channel 1 (left probe) … Furthermore, on the left probe, the activity when reading from a smartphone was higher than that when reading from a paper medium (all P < 0.05).」 |
| 11 | 前額葉活動（右通道） | 媒介主效果與交互作用不顯著；時段主效果 F(2,67) = 10.430，P < 0.0001 | 同上 | Results／Fig. 3c | 同上 | 「In channel 2 (right probe), there was no main effect of medium or interaction, while there was a significant main effect of session」 |
| 12 | 路徑分析 | 最適模型 GFI = 0.881；左 NIRS 與嘆息次數共變 P = 0.021；NIRS 對閱讀分數的直接路徑 P = 0.003（正文說左通道、圖說說右通道） | 讀中的 10 個生理指標與分數 | Results／Fig. 4 | 約 13,000–14,400 | 「there was a covariate relationship between left NIRS channel activity and the number of sighs ( P = 0.021). Moreover, there was a direct relationship between left NIRS channel activity and its impact on reading scores ( P = 0.003).」 |
| 13 | 作者對路徑分析的詮釋 | 嘆息受抑制與前額葉過度活化的交互關係「造成」理解下降 | — | Discussion | 約 15,500 | 「a path analysis suggests that the interactive relationship between sigh inhibition and overactivity in the prefrontal cortex causes the comprehension decline.」 |
| 14 | 藍光的推測 | 嘆息減少可能是手機藍光所致；本研究沒有量 | — | Discussion | 約 19,000–20,000 | 「One of the possible causes of this is the blue light emitted by smartphones. … Further research is needed」 |
| 15 | 實務建議 | 若手機的負面效果屬實，閱讀時深呼吸可能有益（沒有檢驗） | — | Discussion 末 | 約 22,000 | 「If the negative effects of smartphones are true, it may be beneficial to take deep breaths while reading」 |

## 作者自己列的限制

1. 沒有量主觀認知負荷；認知負荷有差異是從嘆息與腦活動推論的（「our experiment did not entail any measurement of subjective cognitive load」，約 20,800）。
2. 沒有控制翻頁或用手指指著文字等動作，可能影響指標（「we did not control the movements when turning pages or pointing movements」，約 21,200）。
3. 結果是否適用於手機以外的電子裝置尚未確認（「the effect on electronic devices other than smartphones has yet to be confirmed」，約 21,700）。
4. 作者把研究定位為探索性（導言末）。

原文沒有談：樣本數怎麼決定（沒有檢定力分析）、閱讀測驗的信度與題型、為什麼每人只做四個條件中的兩個、紙本做成手機尺寸對外推的影響、只有敘事文、只有日本大學生。

## 與摘要說法不一致的地方

1. **腦活動**：摘要寫「reading on a smartphone … promotes brain overactivity in the prefrontal cortex」。結果段兩個通道的媒介主效果與交互作用都**不顯著**，只有左通道的事後比較顯著（結果第 10、11 列）。主效果不顯著時做的事後比較，原文沒有說明依據。
2. **因果用詞**：摘要寫路徑分析「suggests that the interactive relationship … causes comprehension decline」，討論也用 causes；但研究是探索性、生理指標與分數都是相關，路徑分析的 GFI = 0.881（常見門檻 0.90 以下），作者也沒有操弄嘆息或腦活動。
3. **左右通道不一致**：正文說「direct relationship between left NIRS channel activity and its impact on reading scores ( P = 0.003)」，Fig. 4 圖說說「a direct relationship between the right NIRS channel activity and its impact on reading score ( P = 0.003)」。原文沒有更正，不猜哪個對。
4. **適配指標**：方法段說「The goodness of fit of models was determined with the root-mean square of approximation」，結果只報 GFI = 0.881，沒報 RMSEA 的值。
5. **自由度**：34 人的受試者內設計，閱讀分數報的是 F(1,32)；媒介只有兩個水準，嘆息的媒介主效果卻報 F(2,67)；呼吸與 NIRS 的分母自由度 67、134 也對不上 34 人、每人兩個 trial 的結構。原文沒有解釋，可能有排除或模型設定沒寫，不確定。
6. 摘要的「reduced comprehension」沒有附任何數字；正文文字也沒有，只有 Fig. 1b 的圖。

## 與清單「要撐的結論」不合的地方

清單（24#11）：「34 人讀小說，紙本理解高於手機；與 Delgado『敘事文沒有差距』衝突」。

- 「34 人」「讀小說」「紙本理解高於手機」：撐得住（34 位大學生、村上春樹節錄、媒介主效果 F(1,32) = 26.445）。但要一起寫的條件：**紙本做成手機大小與重量**、不限時、每人只讀兩段各約三千字、測驗 10 題、立即測。原文文字沒有給分數差多少，**不能寫「低多少分」或效果量**。
- 「與 Delgado 衝突」：這是清單自己的對照，Honma 原文沒有引 Delgado 2018，也沒有討論說明文與敘事文的差別（導言只引 Wästlund 2005、Kang 2009 兩篇說電子裝置理解較差）。可以寫成「一篇小樣本的實驗室研究在敘事文上找到差距，與 Delgado 統合分析裡敘事文沒有差距的結果方向不同」，但要同時寫出兩點讓衝突沒那麼直接：(a) Delgado 的「不限時則差距縮小」與這裡的不限時設計，方向上也不一致，原因不明；(b) 這裡的紙本是手機尺寸，比較的是同尺寸下的螢幕與紙，不是一般的手機對書本。
- 文章若要引生理機制（嘆息、前額葉）：只能寫成作者的探索性推論；腦活動的媒介主效果不顯著（見上）。

## 讀取紀錄

用 `python3 -I` 依字元區間印出，首尾相接：

| 順序 | 字元區間 | 內容 |
|---|---|---|
| 1 | 0–1,500 | PMC 檔頭、作者與單位、日期、授權聲明、摘要開頭 |
| 2 | 1,500–13,000 | 摘要後半、檔案狀態列、導言、Results（設計、Fig. 1 閱讀分數、Fig. 2 呼吸、Fig. 3 NIRS）、路徑分析開頭 |
| 3 | 13,000–26,000 | 路徑分析、Fig. 4 圖說、Discussion 全部（含限制兩條）、Materials and methods（Participants、Experimental design、儀器前半） |
| 4 | 26,000–38,294 | 儀器後半、Statistics、致謝、作者貢獻、資料可得性、利益衝突、參考文獻 1–43（書目，掃過）、Data Availability Statement |

沒有表格要對 PDF。Fig. 1–4 只讀圖說文字，圖上的數值沒有讀（文字檔沒有）。Supplementary 材料未取。
