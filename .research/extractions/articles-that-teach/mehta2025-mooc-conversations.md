# 抽取紀錄：Mehta、Srivastava、Liu、Vanacore、Baker 2025，Do MOOC Conversations Matter? Investigating the Role of Social Presence and Course-Relevant Discussion in Career Advancement（L@S '25，pp. 236–240，doi 10.1145/3698205.3733930）

- 作者全名（對過首頁）：Shruti Mehta（UPenn 教育研究所）、Namrata Srivastava（Vanderbilt 資工系）、Xiner Liu（UPenn）、Kirk Vanacore（UPenn）、Ryan S. Baker（UPenn）
- **原文檔（這次重抓）**：`.research/raw/learning-content/q5/mooc-conversations2025-par.pdf`（5 頁），轉文字 `q5/mooc-conversations2025-par.txt`（772 行、31,205 字元，不帶 `-layout`）。行號都指這份 `.txt`。
- 取得網址：NSF Public Access Repository `https://par.nsf.gov/servlets/purl/10648067`（書目頁 `https://par.nsf.gov/biblio/10648067`，頁面標示 Accepted Manuscript），2026-10-14 用 curl 下載，HTTP 200、application/pdf。
- 版本：作者接受稿（PAR 版，PDF 建立日期 2025-11-18）。版面是 ACM 範本，首頁有「© 2025 Copyright held by the owner/author(s)」（L63–70）。
- 清單原列的檔 `q5/mooc-conversations2025.pdf`／`.txt` **沒有用**：那是另一個 Word 匯出的版本（PDF 建立日期 2025-05-28），來源網址沒有紀錄，`.txt` 是 `-layout` 轉的，檔尾停在參考文獻中間。我把兩版正文的所有小數數字逐一比對，完全相同（另外抽查 55,180、748、168、「15 of」等關鍵數字也相同），差別只在排版與作者排列；但因為舊檔來源不明，引用一律以 PAR 版為準。Unpaywall（2026-10-14，email 參數 unpaywall@example.org）對這個 DOI 回 closed，PAR 是這篇唯一查到的合法公開版本。
- 讀取日期：2026-10-14
- 供：order 21（第 5 列）

## 研究設計

- **類型**：既有 MOOC 資料的觀察性相關分析（Spearman 相關、邏輯脊迴歸）。沒有操弄。論壇貼文用 GPT-4o 做質性編碼（L166–384）。
- **課程與資料**：Coursera 上 Big Data in Education MOOC（BDEMOOC）第一輪（2013），經 MORF 平台取得資料；註冊 55,180 人（L168–173）。
- **「職涯進展」的定義**（沿用先前研究 [26] 人工整理的資料）：課後在 EDM 或 LAK 研討會發表論文的 153 人，加上課後兩年內加入國際教育資料探勘學會的 35 人（L173–180）。結果段說這樣的人共 168 位（L388–390）；153 + 35 = 188，差的 20 人推測是兩者重疊，原文沒交代。
- **發文者**：只有 748 人在論壇發過文；168 位職涯進展者裡只有 15 人在論壇發過文（L387–391）。
- **編碼**（L184–334）：
  - 社會臨場感（social presence）沿用 Joksimović 等 2015 [17] 的指標，刪掉兩個（引用功能不存在、明確提及他人訊息太少），剩下情感表達、自我揭露、提問、讚美與致謝、表示同意、稱呼對方名字、用「我們」對群體說話、寒暄、幽默、延續討論串等；每則貼文每個指標 0／1，學習者層級加總。
  - 課程相關關鍵詞：貼文有沒有 EDM 領域用語（0／1），學習者層級加總。
  - 共 3,109 則貼文與留言（不含助教與講師）。先用 GPT-4o 去識別化，兩位人工編碼者各編 100 則，每個代碼 Cohen's κ > 0.70，再協商成一致作為標準答案；之後用 GPT-4o（溫度 0，零樣本或少樣本，挑 κ 最高且三次執行差異不超過五則的提示）對所有指標達到 κ > 0.70 才編全部資料（Table 1 列每個指標的人機 κ：0.70–0.89）。「延續討論串」用 Python 依回覆欄位判定。
- **分析**（L336–384）：
  - RQ1：社會臨場感總分、各指標、關鍵詞總數與期末成績的 Spearman 相關；11 個檢定用 Benjamini-Hochberg 校正。
  - RQ2：三個邏輯脊迴歸預測是否為職涯進展者（Model 1 社會臨場感總分；Model 2 各指標；Model 3 關鍵詞），都把總貼文數當共變項；λ 以十折交叉驗證選；係數、標準誤、信賴區間與 p 值用 bootstrap 估。

## 結果（逐項）

Table 2 與 4.2 的信賴區間都對過 PAR 版 PDF 第 4 頁。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 發文與職涯進展者的人數 | 55,180 人中 748 人發文；168 位職涯進展者中 15 人發文 | — | 4 | L387–391 | 「only 15 of those 168 career advancers had participated in the discussion forums.」 |
| 2 | 社會臨場感總分與期末成績 | ρ = 0.389，p < .001（N = 748 位發文者） | 相關 | 4.1；Table 2 | L395–397 | 「we found a positive correlation between overall social presence and course grades (ρ = 0.389), replicating the findings of [17].」 |
| 3 | 各指標與成績 | 延續討論串 ρ = 0.387；提問 0.339；讚美與致謝 0.328；自我揭露 0.286；情感表達 0.276；稱呼名字 0.269；表示同意 0.224；對群體說話 0.216；幽默 0.161；寒暄 0.125；全部 p < .001 | 相關 | Table 2（PDF 第 4 頁） | L405–501 | Table 2 列 |
| 4 | 課程關鍵詞與成績 | ρ = 0.305，p < .001 | 相關 | 4.1；Table 2 | L401–402、L503–508 | 「a positive correlation was found between the use of course-related keywords and final course grades (ρ=0.305)」 |
| 5 | 社會臨場感預測職涯進展（**無效果**） | 社會臨場感 β = 0.0002，95% CI [−0.0001, 0.0006]，p = 0.512；貼文數 β = 0.0001，CI [−0.0001, 0.0004]，p = 0.630 | 職涯進展者 vs 非進展者，控制貼文數 | 4.2 | L518–523 | 「social presence was not a significant predictor of career advancement.」 |
| 6 | 個別指標預測職涯進展（**無效果**） | 各指標 p > .05；完整結果在 OSF 數位附錄（沒有取） | 同上 | 4.2 | L523–526 | 「Similar results were found with individual indicators of social presence predicting career advancements with p values > .05.」 |
| 7 | 課程關鍵詞預測職涯進展（**無效果**） | β = 0.0001，95% CI [−0.0001, 0.0005]，p = 0.415；貼文數 β = 0.0001，CI [−0.0001, 0.0004]，p = 0.633 | 同上 | 4.2 | L527–532 | 「use of technical keywords … in discussion posts did not predict career advancement.」 |
| 8 | 作者對無效果的解釋 | 職涯受外在因素影響；也可能是進展者太少、進論壇的更少 | — | 5 | L540–548 | 「The lack of significant findings could also be attributed to the small number of advancers compared to non-advancers, and the small proportion of advancers who accessed the discussion forum at all」 |

## 作者自己列的限制

- 全文沒有獨立的限制節。討論裡提到：職涯進展受產業趨勢、個人動機、目標、社會支持等本研究範圍外的因素影響；進展者人數少、兩組不平衡、進展者裡進論壇的比例更小，需要更大樣本；但辨識職涯進展者很費工（L540–563）。
- 方法上自陳刪掉兩個原研究的社會臨場感代碼（L190–195）。

## 與摘要說法不一致的地方

- 摘要寫「social presence and use of course-relevant keywords has a positive relationship with course achievement」與「active engagement in MOOC discussion forums **enhances** academic achievement」（L46–52）。正文只有 Spearman 相關（ρ 0.13–0.39），沒有控制任何變項，也沒有操弄；「enhances」是因果語氣，正文撐不住。討論段也寫「social presence … is a significant predictor of course achievement」（L535–537），這裡的「predictor」其實是相關。
- 摘要寫「no significant relationship was found between career advancement and either social presence or course-related keywords」。正文的檢定只有 15 位職涯進展者有論壇資料（748 人中），作者自己在討論承認樣本少可能是原因；摘要沒提這個統計檢定力的問題。
- 4.1 正文說最強的相關之一是「complimenting or expressing agreement (ρ=0.328)」（L400–401），但 Table 2 把兩者分開：讚美與致謝 0.328、表示同意 0.224。正文把兩個指標合寫成一個。
- Table 2 的「Adj. Alpha」欄（0.018、0.0005、0.036、0.045、0.0041…）看不出是依 BH 程序的排序門檻（11 個檢定的 BH 門檻應是 0.0045 到 0.05 等距遞增，且依 p 值排序指派）；因為所有 p 都 < .001，結論不受影響，但這一欄的數字無法照原文的方法說明重算。
- 職涯進展者人數：153 + 35 = 188，結果段寫 168，沒有說明重疊。
- 注意：`-layout` 與非 layout 轉文字都把信賴區間下限的負號斷到上一行，讀成 [0.0001, …]，看起來像 CI 不含 0 卻 p = 0.512；對 PDF 後確認下限是 −0.0001，沒有矛盾。

## 與清單「要撐的結論」不合的地方

清單：「論壇裡的社會臨場感與課內成就正相關，與修課後的職涯進展無關」。

- 前半撐得住，但要寫成相關（ρ = 0.389，只在 748 位發文者內），不是「論壇互動提高成績」。
- 後半要改寫：原文是「沒有找到顯著關係」，不是「無關」。檢定只有 15 位有論壇資料的職涯進展者，作者自己說可能是樣本太少；而且「職涯進展」的定義很窄（課後在 EDM／LAK 發表論文或加入學會），只適用於這門 EDM 課。比較準確的寫法：「在這門課的資料裡，沒找到論壇互動內容與課後職涯進展的關聯，但能檢驗的進展者只有 15 人」。
- 另一個值得引的數字：168 位職涯進展者裡只有 15 人在論壇發過文。這與作者引的先前研究 [26]「職涯進展者會讀論壇但較少發文」一致（L141–142，二手轉述，原文沒讀）。

## 讀取紀錄

- PAR 版 `.txt` L1–220（標題、作者、摘要、引言、相關研究、方法 3.1–3.2 開頭）
- L220–386（Table 1、編碼程序、分析方法）
- L386–575（結果 4–4.2、Table 2、討論與結論、致謝）
- L575–772（參考文獻與數位附錄書目，只掃過；OSF 數位附錄本身沒有取）
- 合計涵蓋全文。
- 對過 PDF 版面：PAR 版第 4 頁（Table 2、4.2 的係數與信賴區間）。
- 另做：PAR 版與舊檔（`q5/mooc-conversations2025.pdf` 重轉）全部小數數字的比對，兩版一致。
