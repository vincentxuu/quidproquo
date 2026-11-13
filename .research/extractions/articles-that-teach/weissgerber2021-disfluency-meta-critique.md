# 抽取紀錄：Weissgerber、Brunmair、Rummer 2021，Null and Void? Errors in Meta-analysis on Perceptual Disfluency and Recommendations to Improve Meta-analytical Reproducibility（Educational Psychology Review 33）

- **書目**（作者全名對 PMC XML 的作者欄與文末 Contributor Information 核過）：Sophia C. Weissgerber、Matthias Brunmair、Ralf Rummer (2021). Null and Void? Errors in Meta-analysis on Perceptual Disfluency and Recommendations to Improve Meta-analytical Reproducibility. *Educational Psychology Review*, 33(3), 1221–1247. DOI 10.1007/s10648-020-09579-1。PMC7854329。接受日 2020-10-15，2021 年刊期。單位：Weissgerber 與 Rummer 在 University of Kassel（Institute of Psychology, Department of Cognitive Psychology），Brunmair 在 University of Würzburg（依文末 email 網域對應；XML 單位欄與作者的對應在純文字檔裡看不出上標，屬推定）。
- **合法公開來源**：PMC7854329（https://pmc.ncbi.nlm.nih.gov/articles/PMC7854329/ ），出版者 Springer Nature 以 CC BY 4.0 開放取用（文首授權聲明；經費 Projekt DEAL）。XML 標記 `is-manuscript: no`，即刊出版。
- **版本**：刊出版（PMC 收錄的出版者全文 XML 轉文字）。
- **原文檔**：`.work/teaching-text-research/src/PMC7854329.txt`（199 行、99,036 字元、99,679 位元組），由同目錄 `PMC7854329.xml`（145,982 位元組）轉出。注意：轉文字時引文的年份被丟掉，正文到處是「Xie et al. ()」這種空括號；文末參考文獻是一整行 9,837 字元。下文位置以字元區間標示（「c.」＝字元位置）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 9 篇（提問，`2026-10-13-teaching-text-questions-feedback.md`）第 131、236 行；清單 G 編號 Q-2，批次 V14。
- **利益揭露**：被誤編的兩項研究是作者自己的（Rummer 等 2016、Weissgerber & Reinhard 2017），作者在註 10 自承「the inconsistencies discovered … were driven mainly by the fact that we are ourselves authors of primary studies」。

## 研究設計

- **類型**：方法評論＋對已發表統合分析（Xie、Zhou、Liu 2018，EPR 30(3), 745–771，DOI 10.1007/s10648-018-9442-x）的重製檢查。正文主體是提出「方法可重製性」四層框架；對 Xie 的實際檢查結果主要放在 OSF 附件（https://osf.io/nvhqz/ ），正文只摘要（c.≈67,000 起「Are the Meta-analytical Results of Xie et al. () Null and Void?」一節自述）。
- **被檢查的對象**：Xie 2018 的不流暢字體（perceptual disfluency）統合分析，結論是不流暢對回想（RECALL）與遷移（TRANSFER）的合併效果幾乎為零（c.≈3,500「the pooled effect size for disfluency on RECALL and TRANSFER performance was almost null」）。
- **四層框架**（Table 1，正文唯一的表；c.≈27,000–34,500）：Level 1 計算可重製（同資料同程式是否得出同數字，門檻 95%）；Level 2 計算驗證（資料、程式、流程有無錯誤，檢查 Lakens 等 2016 的四種錯誤來源）；Level 3 分析可重製（換分析方法、多重宇宙／規格曲線）；Level 4 結果可重製（自己重建資料庫再分析）。
- **實際做了什麼**（正文＋限制節 c.≈77,000–85,000）：
  - Level 1：Xie 沒有提供資料與程式，無法照框架做；改做變體——對照 PRISMA 整理 Xie 的報告內容（OSF 附錄 L1），並針對 **RECALL**，策略性挑 Eitel 及／或 Kuehl 的論文重算個別效果量。
  - Level 2：同樣只能做變體；針對 **TRANSFER** 的全部論文，從 Xie Figure 2 反推重建「原始」資料庫再檢查（用 CMA 試用版與 R metafor）。
  - Level 3、4：只對 **TRANSFER** 做，分「相似分析」與「不相似分析」，Level 4 自己重新編碼主要研究。
  - 選 TRANSFER 的理由：研究數少、主觀選擇空間小，作者預期結果會比較有利於 Xie（c.≈68,500–69,500）。
  - 曾 email 聯絡 Xie 等人，未獲回覆（推測與疫情有關）。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | Xie 大致符合 PRISMA 等報告規範，只有小偏離 | 未給完整檢索字串、無流程圖（只有文字敘述）、**沒報告幾位編碼者與編碼者間信度** | 對照 PRISMA #8、#10、#17 | c.≈9,500–11,700 | 「An apparent deviation from these guidelines that we noticed was not providing information on how many coders extracted the effect sizes of the primary studies and what their intercoder reliability was」 |
| 2 | 符號編錯：Rummer 等 2016 實驗 2 | Xie 的 Figure 2 標成支持不流暢，原研究其實是流暢略佳 | — | c.≈11,700–12,500 | 「Experiment 2 by Rummer et al. () was misreported as favoring the disfluency effect. In fact, Rummer's et al.’s () results are rather indicative of the opposite」 |
| 3 | 符號編錯：Weissgerber & Reinhard 2017 延後測 | 兩週後測不流暢明顯較佳，Xie 標成反對不流暢 | — | c.≈12,500–13,100 | 「Weissgerber's and Reinhard’s () delayed condition was misreported as evidence against the disfluency effect, when in fact the results are evidence in favor of disfluency」 |
| 4 | RECALL 個別效果量重算：Eitel & Kuehl 2016 | 與 Xie 相同 | 依 Xie 描述的方法重算 | c.≈17,000–17,800 | 「we obtained the same values for Cohen’s d as those presented by Xie and colleagues in their Figure 2 for RECALL」 |
| 5 | RECALL：Kuehl 等 2014 | Xie：系統控速 −0.302、自控速 −0.52；作者重算 −0.489、−0.072；只有把 RECALL 與 PICTORIAL MATCHING 合併才重現得出 Xie 的數字 | 同上 | c.≈17,800–19,300；註 5 | 「The values that Xie et al. () reported could only be recreated when combining RECALL outcomes with PICTORIAL MATCHING outcomes」 |
| 6 | RECALL：Eitel 等 2014 合併值 | Xie 報 −0.476，重現不出來 | 用 Kuehl 那套合併方式 | c.≈20,700–21,400 | 「we could not reproduce the value of −0.476 that Xie et al. () reported in their Figure 2 for RECALL」 |
| 7 | RECALL：Eitel 等 2014 實驗 4 | −0.108，與 Xie 相同 | 合併 RECALL 與 PICTORIAL RECALL | c.≈22,500–22,900 | 「yielded the same results that Xie et al. () reported: a value of −0.108」 |
| 8 | RECALL：Eitel 等 2014 實驗 2（純文字條件） | Xie 報 −0.639；依 Xie 的方法應為 −0.14 | — | c.≈22,900–23,600 | 「Applying the approach of Xie et al. (), the effect size should be −0.14」 |
| 9 | 調節變項編碼錯 | Weissgerber & Reinhard 被編成「無測驗預期」（立即測其實有預期）；Weltman & Eakin 2014 被編成「無圖」（原文有圖） | — | c.≈23,600–24,700 | 「this misclassification is problematic and decreases the trustworthiness of the moderator analysis」 |
| 10 | 學習時間方向標反 | Xie Figure 2 把學習時間標成「favors disfluent」，應是有利流暢 | — | c.≈24,700–25,600 | 「Xie’s and colleagues’ Figure 2 wrongly presents the learning times as “favors disfluent”」 |
| 11 | TRANSFER 合併方式有疑 | Eitel 等 2014 實驗 1–3 只有共變數調整後的平均，實驗 4 是未調整的，Xie 似乎全部合併 | — | c.≈25,000–25,800 | 「a merging of all four experiments, as was seemingly done in Xie’s and colleagues’ Figure 2 for TRANSFER, is ill advised」 |
| 12 | TRANSFER 只找到一個編碼錯 | Eitel 等 2014 的編碼，修正後該篇 SMD 差 0.18 | Level 2 | c.≈69,600–70,100 | 「we found just one coding error for TRANSFER performance as outcome variable, namely in the coding of Eitel et al. (), albeit producing a difference in SMD of 0.18 when corrected」 |
| 13 | 修正後 TRANSFER 合併效果仍為零 | Xie +0.026 → 修正 −0.008（Δ = 0.034） | Level 3，相似分析、原資料庫 | c.≈70,100–70,500 | 「the coding error produced only a small overall deviation of Δ = 0.034 (Xie et al. : pooled effect size of +0.026; corrected pooled effect size: −0.008)」 |
| 14 | 換成作者偏好的不相似分析 | −0.008 → +0.081（Δ = 0.089），作者稱仍小 | Level 3，不相似分析 | c.≈70,500–70,900 | 「the deviation becomes more pronounced (Δ = 0.089) but it is still small」 |
| 15 | 自建資料庫 | 相似分析 Δ = 0.023（仍為零）；不相似分析 Δ = 0.069、+0.061，「likely not significantly different from zero」 | Level 4 | c.≈70,900–71,700 | 「we found a small deviation of Δ = 0.023 (not affecting the overall null-finding)」 |
| 16 | 所有變化的範圍 | 最大差 Δ = 0.112（最小 −0.031、最大 +0.089），只限作者測過的組合 | Level 3＋4 | c.≈71,700–72,000 | 「The combined effect of flexibility in analytical choices and flexibility in the creation of the database amounted to a maximum difference of Δ = 0.112」 |
| 17 | 共變數調整過的結果異質性較大、平均較負 | 沒給數字（在 OSF 附錄） | 調節分析 | c.≈72,600–73,300 | 「The results of the moderator analysis indeed show greater heterogeneity of covariate-corrected results in primary studies and on average a more negative effect as uncorrected results」 |
| 18 | **RECALL 與其他結果沒有重算合併效果** | — | — | c.≈73,600–74,300；限制節 | 「we cannot say anything reliable about reproducibility with respect to the results for other outcomes in Xie et al. ()… Given the objective errors regarding algebraic sign, coding decisions, and so forth… we remain more skeptical here」 |
| 19 | 總結 | TRANSFER 結果在作者的檢查範圍內看來穩健；但錯誤讓結果的效度存疑，「是否無效」仍未知 | — | c.≈74,300–76,500 | 「All in all, at least with respect to our conducted reproducibility checks, the results of Xie 's et al.’s () appear robust.」；「it is still unknown whether the findings of Xie et al. () are null and void」 |
| 20 | 作者推測 Xie 的零效果可能是錯誤互相抵銷的巧合 | 正向研究被翻成負向（Weissgerber & Reinhard），負向被翻成正向（Eitel 等實驗 3、Rummer 等實驗 2） | — | c.≈74,600–75,500 | 「we suspect this to be the case due to favorable coincidences coming together」 |
| 21 | TRANSFER 的調節變項編碼也有錯，但無影響 | Xie 沒對 TRANSFER 做調節分析 | — | 註 11 | 「These coding errors were inconsequential, because Xie et al. () did not conduct moderator analysis for TRANSFER」 |

### 給期刊與審稿的建議（正文主體，c.≈34,500–66,500）

- 資料與完整分析程式應強制隨稿公開；Level 1 重製比例低於 95% 須作者解釋修正（c.≈41,500–42,000）。
- 期刊至少要有一位統合分析專家審稿；建議頒發可重製性徽章並標明達到哪一層、由誰負責；Level 1、2 應在出版前完成，Level 3、4 可用隨刊評論的形式（c.≈59,500–64,000）。
- 這些建議「NOT to be implemented as a further criterion for rejecting manuscripts」。

## 作者自己列的限制（Limitations and Future Directions，c.≈76,700–84,500）

1. Level 1 無法照框架做（沒有資料與程式），改做的變體只是選擇性重算，不是全部效果量的精確重算；選 RECALL、選 Eitel／Kuehl 的論文都是主觀決定。
2. Level 2 只能從 Xie 的 Figure 2 反推重建資料庫，是近似；沒有重建並檢查 Xie Figure 1、2 與 Table 1–4 的全部數字。
3. Level 3、4 只選了部分不相似分析，只做 TRANSFER；對 RECALL、學習時間等其他結果「cannot say anything reliable」。
4. 沒有事先存放重製計畫或預登錄。
5. 無法和 Xie 等人溝通。

## 與摘要說法不一致的地方

- 摘要：「Applying reproducibility checks to TRANSFER performance … we found Xie’s and colleagues’ results to be (rather) robust. Yet, regarding RECALL performance and the moderator analysis, the identified problems raise doubts about the credibility of the reported results.」正文一致：TRANSFER 做了 Level 3、4 重算；RECALL 只重算了少數個別效果量並發現錯誤，**沒有重算 RECALL 的合併效果**。摘要用詞「raise doubts」準確，沒有誇大成「RECALL 結論被推翻」。
- 正文內部有一處不一致：限制節說要重現「effect sizes that Xie et al. () reported their in Figure 1」，前文一律說個別效果量在 Xie 的 Figure 2（c.≈78,000 附近）；推定是筆誤，不確定。
- 其餘逐項對過，沒有。

## 與清單『要撐的結論』不合的地方

清單 Q-2「文章引用了什麼」：「正式發表的批評：Xie 2018 編碼有錯，重算後遷移結論大致成立、回想有疑問。」

- 「編碼有錯」**撐得住**：兩項符號錯、調節變項兩處誤編、TRANSFER 一處編碼錯、學習時間方向標反（結果 #2、#3、#9、#10、#12）。
- 「重算後遷移結論大致成立」**撐得住**：修正與換分析後合併效果介於 −0.031 到 +0.089，零效果結論不變（#13–#16）。作者用的字眼是「(rather) robust」。
- 「回想有疑問」**撐得住，但「重算後」三個字套到回想上不準確**：回想的疑問來自個別效果量重算失敗與符號錯誤，作者沒有重算回想的合併效果，並明說對回想「cannot say anything reliable」（#4–#8、#18）。另外摘要點名的「調節分析」也有疑問，清單與文章都沒提。

## 已發佈文章引用核對（`2026-10-13-teaching-text-questions-feedback.md`，2026-10-14 實查行號）

清單寫 Q 129、234；檔案現況是第 131、236 行。英文版 `-en.md` 同行號，內容相同。

| 行 | 文章說法 | 與原文是否一致 |
|---|---|---|
| 131 | 「Xie 等人 2018 年的統合分析結論是對回想與遷移都沒有效果。」 | 經 Weissgerber 轉述一致（「the pooled effect size for disfluency on RECALL and TRANSFER performance was almost null」）。Xie 原文沒有合法全文，這句仍是經批評文與摘要得知。 |
| 131 | 「後來有一篇正式發表的批評指出它的編碼有錯」 | **一致**。補充：批評者是被誤編研究的作者本人（註 10 自承），文章若要寫可以一句帶過。 |
| 131 | 「重算後遷移的結論大致成立」 | **一致**（結果 #13–#16）。 |
| 131 | 「回想的結果有疑問」 | 一致，但句型讓人以為回想也重算過。原文是：回想只重算了幾篇的個別效果量，發現符號錯與重現不出的數字，合併效果沒有重算，作者對回想「cannot say anything reliable」而「remain more skeptical」。建議改成類似「回想只抽查了幾篇就發現數字對不上，作者對回想的結論存疑」。另外原文也點名調節分析的可信度有疑問，文章沒提。 |
| 131 | 「這兩篇我都只讀到摘要。」 | 對批評文**不再成立**：PMC 刊出版（CC BY）已精讀。Xie 2018 仍只讀到摘要。 |
| 236 | 「只讀到摘要、沒有列進參考資料的：…Xie 等（2018）的難讀字體及其批評」 | 批評文（Weissgerber 等 2021）可移出這一列、改列進參考資料（PMC 連結合法）；Xie 2018 維持。 |

## 讀取紀錄

用 `python3 -I` 依字元區間印出，首尾相接：

- c.0–25,000：PMC 後設資料、授權聲明、摘要、關鍵詞、Introduction、「Guidelines and Inconsistencies in Xie’s et al.’s () Meta-analysis」前大半（PRISMA 對照、Rummer／Weissgerber 符號錯、Eitel & Kuehl、Kuehl 2014、Eitel 2014 各實驗、調節變項誤編、學習時間方向）
- c.25,000–50,000：上一節收尾（TRANSFER 合併共變數問題、Seufert 組別選擇）、Table 1 全表與註、Recommendations 一節、Methods Reproducibility、Level 1、Level 2 前半
- c.50,000–76,000：Level 2 後半、Level 3、Level 4、Implications、「Are the Meta-analytical Results of Xie et al. () Null and Void?」大半
- c.76,000–99,036：上一節結尾、Limitations and Future Directions、Funding、註 1–11、Contributor Information、References（只掃過）、XML 殘留標籤

表格：全文只有 Table 1（XML 只有一個 `table-wrap`，id Tab1），是文字表，無數字欄，不需對版面。Xie 的 Figure 1／2 與 OSF 附件**沒有讀**；文中 Δ 值與合併效果量都只取自本文正文。
