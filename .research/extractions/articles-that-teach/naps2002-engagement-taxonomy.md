# 抽取紀錄：Naps 等 2002，Exploring the Role of Visualization and Engagement in Computer Science Education（ITiCSE 工作小組報告）

- **書目**：Thomas L. Naps（co-chair）, Guido Rößling（co-chair）, Vicki Almstrum, Wanda Dann, Rudolf Fleischer, Chris Hundhausen, Ari Korhonen, Lauri Malmi, Myles McNally, Susan Rodger, J. Ángel Velázquez-Iturbide (2002). Exploring the Role of Visualization and Engagement in Computer Science Education. Report of the Working Group on "Improving the Educational Impact of Algorithm Visualization". *ITiCSE-WGR '02: Working Group Reports from ITiCSE on Innovation and Technology in Computer Science Education*, pp. 131–152. DOI 10.1145/782941.782998。作者名單依 PDF 首頁（txt L5–47）排列，首頁為兩欄排版，作者順序以版面左右欄交錯，上面依共同主持人在前、其餘依姓氏字母排。
- **原文檔**：`.work/learning-visualization-research/src/naps2002.txt`（`pdftotext` 不帶 `-layout`，2,757 行、121,346 位元組）；PDF：同目錄 `naps2002.pdf`（22 頁，印刷頁 131–152）。
- **取得網址**：https://users.cs.duke.edu/~rodger/jflappapers/Naps2002.pdf（共同作者 Susan Rodger 在 Duke 的個人網頁；ACM DL 亦開放）。合法：作者個人頁公開版本。
- **版本**：出版者排版（頁碼 131–152 與 ACM 論文集一致）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 2 篇（圖表）「演算法的圖」一節 L165 與附錄 L412、參考資料 L449。
- **原文本身的瑕疵**：印刷頁 134 下半到 135 有一大段（機構規模、主修人數、教師人數、教室配置）重複印了兩次（txt L441–585 與 L601–693；PDF 第 4–5 頁對過，確實是原刊重複，不是轉檔錯誤）。Table 1 的調查日期把 2002 年的事前調查寫成「April–June 2000」、索引卡調查寫成「June 2000」（PDF 第 4 頁），應為原刊筆誤。

## 研究設計

- **類型**：工作小組報告，不是實驗。內容有四塊：(1) 演算法視覺化「最佳實務」11 條（2.1）；(2) 三份教師問卷（2.2）；(3) 轉述 Hundhausen 的統合研究（2.3）；(4) 提出投入方式分類（3）、以 Bloom 分類定義成效指標（4）、實驗框架與六個假設（5）。
- **問卷**（2.2.1–2.2.2，Table 1，PDF p.4）：Grissom 在 ITiCSE 2000 的紙本問卷 91 人、21 國；工作小組的線上事前問卷 29 人、11 國（平均教學 14 年）；ITiCSE 2002 會場索引卡問卷 66 人（Table 1）。
- **沒有自己的學習成效資料**；第 2.3 節的實驗數字全部轉述 Hundhausen、Douglas、Stasko 的 meta-study（文獻 [28]，當時「in print」）。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／圖 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 核心主張 | — | — | 摘要、1 | L99–102、L213–216 | 「We argue that such technology, no matter how well it is designed, is of little educational value unless it engages learners in an active learning activity.」 |
| 2 | 轉述 Hundhausen：21 個實驗裡 13 個顯著 | 13／21 | 視覺化或其教學應用 vs 對照 | 2.3 | L1403–1409 | 「Indeed only 13 of those experiments ... showed that some aspect of visualization technology or its pedagogical application significantly impacted learning outcomes.」 |
| 3 | 依自變項分兩類 | 操弄學習者投入：12 個裡 10 個顯著（83%）；操弄表徵：9 個裡 3 個（33%） | 投入 vs 表徵 | 2.3／Figure 1 | L1436–1445；PDF p.12 | 「ten out of twelve (83%) experiments using learner engagement produced a significant result. Out of nine experiments that manipulated representations, only three (33%) showed a significant result.」 |
| 4 | 由此推論 | — | — | 2.3 | L1442–1445 | 「This suggests that what learners do, not what they see, may have the greatest impact on learning」 |
| 5 | 六類投入方式 | No viewing、Viewing、Responding、Changing、Constructing、Presenting | — | 3 | L1451–1461 | 列表 |
| 6 | 不是順序量表 | 後四類都包含 Viewing，彼此可重疊（Venn 圖） | — | 3／Figure 2 | L1462–1471、L1496–1499；PDF p.12 | 「we do not consider this to be an ordinal scale.」 |
| 7 | Responding 的定義 | 回答關於視覺化的問題，例：預測下一格、對應原始碼、效率分析、除錯 | — | 3.2 | L1519–1541 | 「The key activity in this category is answering questions concerning the visualization presented by the system.」 |
| 8 | Changing 的定義 | 最常見是改演算法的輸入 | — | 3.3 | L1579–1590 | 「The most common example of such modification is allowing the learner to change the input of the algorithm」 |
| 9 | Constructing 的定義 | 直接生成或手工建構；不一定要寫程式 | — | 3.4 | L1606–1629、L1543–1564 | 「the “Constructing” form of engagement does not necessarily entail coding the algorithm.」 |
| 10 | Presenting 的定義 | 向觀眾展示視覺化以取得回饋與討論 | — | 3.5 | L1565–1575 | |
| 11 | 假設 I | 只觀看與不看學習成果相當；作者說已有研究顯示被動觀看沒有顯著改善，但樣本都小，本研究可用較大樣本驗證 | Viewing vs No viewing | 5.1 | L2141–2148 | 「Viewing results in equivalent learning outcomes to no visualization (and thus no viewing). Several studies [1, 11, 40]have shown that mere passive viewing provides no significant improvement over no visualization, but these studies were based on small sample populations. Our study may be able to verify this with larger numbers.」 |
| 12 | 假設 II–V | Responding > Viewing；Changing > Responding；Constructing > Changing；Presenting > Constructing（後者沒有附文獻） | 相鄰兩類 | 5.1 | L2149–2179 | 「Responding results in significantly better learning outcomes than viewing」 |
| 13 | 假設 VI | 「More is better」 | 多種投入的組合 | 5.1 | L2180–2188 | 「This sixth hypothesis merely states “More is better.”」 |
| 14 | 教師相信視覺化有用 | 事前問卷 29 人全部同意（強烈同意 59%、同意 41%）；索引卡 67 人中 43% 強烈同意、49% 同意、8% 中立 | — | 2.2.3 | L773–789 | 「none disagreed at all with the premise that visualizations can help students as they learn computing concepts.」 |
| 15 | 阻礙 | 最常見的阻礙是時間：找範例 93%、學新工具 90%、開發視覺化 90% | — | 2.2.3 | L1139–1160 | |
| 16 | 評估多屬非正式 | 課堂內外非正式回饋各 83% | — | 2.2.3–2.2.4 | L1255–1265、L1383–1389 | 「the evidence these respondents have collected is primarily anecdotal.」 |
| 17 | 兩位受訪者對連續動畫的評論 | 一位心理學家說沒有控制良好的研究顯示動畫比靜態圖好 | — | 2.2.4 | L1192–1218 | 「there are no well-controlled studies showing any advantages of animated over still graphics in teaching.」（受訪者自由回答，不是報告的研究結論） |

## 作者自己列的限制

- 事前問卷可能偏向原本就支持視覺化的人，所以另做索引卡問卷（L1183–1191）。
- 假設 I 所依據的研究樣本都小（L2146–2148）。
- 實驗框架承認隨機分組常常做不到，提了分班、分學期等替代（L2198–2222）；前後測同題會讓學生事先練習（L2278–2280）。
- 不處理教師負擔這個第二大障礙（L220–222、L1380–1382）。

## 與摘要說法不一致的地方

- 摘要說「Drawing on a review of experimental studies」，實際是轉述 Hundhausen 等人的 meta-study，本報告沒有自己的回顧方法。
- 內文數字自相不一致：索引卡問卷人數 Table 1 寫 66、2.2.3 寫 67（L779），回答頻率題的是 64 人（L830–831）；2.2.3 說「93 位」教育者回答（L783），2.2.4 說「98 位」中只有 5 位中立（L1177–1179）。原文沒有說明。

## 與清單「要撐的結論」不合的地方

清單 D-8 寫「六類投入方式與第一個假設」。原文撐得住：六類（L1451–1461）與假設 I（L2141–2143）都照原文。

## 已發佈文章引用核對（第 2 篇 `2026-10-13-diagrams-in-teaching-articles.md`，2026-10-14 實查行號）

| 文章行 | 文章說法 | 原文是否一致 |
|---|---|---|
| L165 | 「把學習者的投入方式分成六類：不看、觀看、回應（回答關於圖的問題）、改變（自己給輸入）、建構（自己做圖）、發表。」 | **一致**（L1451–1461；回應、改變、建構的說明對 3.2–3.4）。小差：建構不限「自己做圖」的手工方式，也包含把程式對應到視覺化的直接生成（L1613–1629），但「自己做圖」作簡稱可接受 |
| L165 | 「報告列的第一個假設就是：只觀看和完全不看，學習成果相當。」 | **一致**（L2141–2143） |
| L165 | 「報告自己帶著保留：支持這個假設的幾個研究樣本都小，所以才列為待驗證的假設。」 | **大致一致，但「所以才列為待驗證的假設」是推論**。原文說的是「these studies were based on small sample populations. Our study may be able to verify this with larger numbers」（L2146–2148）；六條假設全都是為了將來的實驗而列，不是因為樣本小才把第一條列成假設。建議改成「報告說支持它的幾個研究樣本都小，打算用較大的樣本驗證」 |
| L412（附錄） | 「作者說明六類投入方式不是嚴格的順序量表，後四類都包含『觀看』而且彼此可以重疊。」 | **一致**（L1462–1471、L1496–1499） |
| L412、L449 | 「我讀了摘要、第 3 節開頭與 5.1 節。」 | 已讀完全文，這句要更新 |
| （相關，L150–157 引的 Hundhausen 2002） | 文章依 Hundhausen 期刊版寫 24 個實驗、投入類 71%（14 個裡 10 個）、表徵類 30% | Naps 2.3 轉述的是同一研究較早的版本：21 個實驗、13 個顯著，投入類 12 個裡 10 個（83%）、表徵類 9 個裡 3 個（33%）（L1403–1445）。分類與數字都和期刊版不同，**不要混用**；文章目前沒有混用 |

## 讀取紀錄

- txt L1–700、L700–1399、L1400–2099、L2100–2757 依序讀完（參考文獻 L2458–2757 掃過），四段首尾相接，涵蓋全文。
- 對 PDF：第 4–5 頁（Table 1、重複段落）、第 12 頁（Figure 1 的 33%／83% 與長條長度、Figure 2 Venn 圖）。其餘表（Table 2–5）文章沒有引用，只讀 txt。
