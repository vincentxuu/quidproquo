# 抽取紀錄：Gillani、Yasseri、Eynon、Hjorth 2014，Scientific Reports

- **書目**：Nabeel Gillani、Taha Yasseri、Rebecca Eynon（通訊作者）、Isis Hjorth（作者全名對 PDF 首頁核過）。2014。Structural limitations of learning in a crowd: communication vulnerability and information diffusion in MOOCs。*Scientific Reports* 4:6447。DOI 10.1038/srep06447。收稿 2014-04-29、接受 2014-08-29、刊出 2014-09-23。Gillani 屬 Oxford 工程科學系，其他三位屬 Oxford Internet Institute。PMID 25244925，PMCID PMC5388276。
- **原文檔**：`.research/raw/learning-content/q5-social/mooc-structural-limits.txt`，127 行、37,138 字元（37,320 位元組）。PMC 的 XML 轉文字，一段一行，表格每列一行。另有預印本 `structural-limits-arxiv.txt`（50,284 位元組），**本批沒有讀**。
- **對照用 PDF**：出版者 PDF，取自 `https://www.nature.com/articles/srep06447.pdf`，存在 scratch（`…/scratchpad/f21b/gillani/srep06447.pdf`，7 頁）。
- **版本與合法性**：刊出版。檔頭 L7 與 PDF 第 7 頁皆標 CC BY-NC-SA 4.0；PMC 與 Nature 都是公開取用。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 21（留言區、論壇與社群）
- **補充資訊**（Fig. S1–S6、模擬影片、顯著網路的推導細節）沒有取得，正文多處把細節推給它。

## 研究設計

- **類型**：觀察性資料的社會網路分析加模擬。沒有介入、沒有對照組、沒有量學習成效。
- **資料**：Coursera 上同一門商業策略 MOOC 的兩期（FOBS-1 2013 春、FOBS-2 2013 秋），各六週（L17、L72）。註冊：FOBS-1 近 90,000、FOBS-2 逾 77,000。在論壇發文的人：FOBS-1 約 4,500 人、逾 15,000 則；FOBS-2 約 3,300 人、逾 14,000 則。看過至少一個討論串的人：逾 15,000 與 11,500（L17）。
- **兩期的差別**（L47、L72）：FOBS-2 把期末分數的 8% 依論壇貼文獲得的「upvotes」計算；FOBS-1 論壇不計分。
- **分析單位**：依課程人員事先切好的八個子論壇分開分析（Technical Feedback、Course Material Feedback、Study Groups、Readings、Lectures、Questions for Professor、Final Project、Cases；L73）。理由是子論壇之間的人重疊少於 10%，多數低於 3%（L18）。
- **網路定義**（L30、L74）：節點是至少發一則文或留言的人；兩人共同參與同一討論串就連一條邊。只看發文，不含潛水閱讀（L74 作者自己點出這點）。
- **顯著互動網路**（L30、L75）：把觀察到的網路當成含雜訊的「真」網路，產生 K 個樣本圖，單尾 z 檢定 p < 0.001 留下顯著邊。細節在補充資訊。
- **脆弱度**（L44–46）：依中介中心性由高到低逐一移除節點，看最大連通元件佔全部節點的比例多快崩落；與隨機移除比較。
- **資訊擴散**（L52–56、L76）：在顯著網路上跑 SI 傳染模型（p = 0.01，400 次不同起點取平均），跟保留度數的隨機重連網路（configuration model）比。效率 e = T_half(隨機) / T_half(原始)，e < 1 表示實際結構讓擴散變慢。
- **模組度**（L58）：Louvain 法，resolution 1；標準化模組度 = 原始 ÷ 重連後。

## 結果（逐項）

1. **子論壇參與規模**（Table 1，L20–29，PDF 第 2 頁對過）：FOBS-1 參與人數最多的是 Study Groups 1,387 人、Cases 1,222、Readings 1,120、Final Project 1,078；每人平均發文 1.73 到 3.82 則（Cases 最高 3.82，SD 5.6）。FOBS-2 Study Groups 2,022 人、Cases 987；Readings 只剩 137 人（FOBS-1 是 1,120，正文沒有解釋這個落差）。
2. **發文與觀看集中在開課初與里程碑**（L19）：「Both posting and viewing in each sub-forum tended to occur in bursts, with most activity happening at the beginning of the course」。圖在補充資訊，沒看到。
3. **多數人只在少數子論壇偶爾參與**（L18）：「most students participated infrequently in only a few sub-forums.」
4. **顯著邊的比例**（Table 2，L33–42，PDF 第 3 頁對過）：被濾掉的邊，Technical Feedback 兩期都是 89%；Cases 最少，FOBS-1 44%、FOBS-2 39%；Study Groups 72% 與 71%；Final Project 46% 與 52%。FOBS-2 Readings 濾掉 93%。
5. **Study Groups 子論壇多半只是報到處**（L43）：「more than 2 out of 3 connections in the study groups sub-forum were considered "insignificant" in both instances of the course. Informal content analysis of this sub-forum revealed that most learners posted to introduce themselves early on … then opting to move their discussions to other online platforms (e.g. Facebook).」注意「informal content analysis」，沒有編碼程序。
6. **過濾後模組度上升**（Figure 1 圖說，L31，PDF 第 3 頁）：Study Groups 的觀察網路模組度 0.62，顯著網路 0.80。
7. **脆弱度**（L47，Figure 2、3，PDF 第 4 頁看過）：Cases 與 Final Project 兩期都是最不脆弱的子論壇，要移除較高比例的節點最大連通元件才會崩；Study Groups 屬最脆弱之一。從 Figure 2 目視（FOBS-1）：Study Groups 移除約 5% 到 10% 的高中介節點後最大連通元件就接近零；Cases 要到約 35% 到 40%。Figure 3：Cases 依中心性移除約 40% 就崩到接近零，隨機移除要到約 80%。這些是我從圖上讀的近似值，文中沒有列數字。
8. **FOBS-2 的 Cases 與 Final Project 較不脆弱，作者推測與 upvote 計分有關**（L47）：「This may have been the result of an additional evaluation criteria in FOBS-2, where 8% of students' final scores was computed as a function of the total number of "upvotes" …」。只有兩期比較，作者用「may」。FOBS-2 的圖在補充資訊 Fig. S5，沒看到。
9. **所有子論壇的資訊擴散都比隨機重連網路慢**（L57）：「Across all sub-forums, information spreads more slowly in the original networks compared to the randomized benchmarks.」Figure 4(b)（PDF 第 5 頁，FOBS-1）的 e 值全部小於 1，目視約 0.63（Study Groups，最低）到 0.87（Questions for Professor，最高）。文中只寫排序，沒有列數值。
10. **模組度越高，擴散效率越低（只做目視比對，不報相關係數）**（L58）：「the most modular sub-forums also tended to have the lowest diffusion efficiency (e.g. Readings and Study Groups) and vice versa (e.g. Questions for Professor and Course Material Feedback).」例外是 Technical Feedback 模組度與擴散效率都低。作者明講：「Given the limited number of sub-forums over both MOOC instances, we refrain from reporting a Pearson r-value」。
11. **標準化模組度**（Table 3，L59–68，PDF 第 6 頁對過）：FOBS-1 Study Groups 4.21、Readings 4.11、Final Project 3.87、Lectures 2.77、Cases 2.70、Course Material Feedback 1.83、Questions for Professor 1.81、Technical Feedback 1.42。FOBS-2 Study Groups 5.92 最高、Cases 3.40、Readings 2.87、Final Project 2.80、Lectures 2.32、Questions for Professor 1.94、Course Material Feedback 1.81、Technical Feedback 1.19。逐格驗算原始 ÷ 重連，數字一致。
12. **結論句**（L69）：「there is simply too many discussion topics and too pronounced heterogeneity characterizing participation to realize truly global-scale discussion. Instead, most information exchange, and by extension, any knowledge construction in the discussion forums occurs in small, short-lived groups.」
13. **討論**（L70）：「modularity in MOOC forum networks appears to "trap" information in small learner groups.」
14. **同一資料的另一篇研究**（L71，引文 25 = Gillani et al. 2014 arXiv:1403.4640）：Cases 與 Final Project 中依貼文內容推出的社群，在地理、先前學歷、期末成績、論壇投入上有顯著差異。這是轉述另一篇，本文沒有數字。

## 作者自己列的限制

- 只看發文，沒看潛水閱讀（L74）：「the prominence of lurking suggests the need for more robust network models that depict both viewing and posting trends.」
- SI 模型很簡化，不含興趣衰退、同儕影響等機制，只能給出依拓樸算出的擴散上限（L53）。
- 子論壇數量少，不報模組度與擴散效率的相關係數，留待後續期次驗證（L58）。
- 沒有明列「限制」一節；以上是散在正文的自承。

## 與摘要說法不一致的地方

1. 摘要（L9）說不同主題與教學做法造成不同程度的「modularity, which impacts information diffusion to prevent a truly "global" exchange of knowledge and learning」。正文對模組度與擴散的關係只做目視比對、刻意不報相關係數（L58），而且有 Technical Feedback 這個例外。摘要的因果語氣（impacts、prevent）強過正文。
2. 摘要寫「exchange of knowledge and learning」，但全文沒有量任何學習成果；「knowledge construction」是作者從互動結構推論的（L69 用「by extension」）。
3. 摘要說「different … pedagogical practices promote varying levels of」參與，正文對教學做法的唯一比較是 FOBS-1 與 FOBS-2 的 upvote 計分，兩期之間還有其他差異（例如 Readings 子論壇人數從 1,120 掉到 137），作者也只用「may」。
4. Figure 4 的圖例與橫軸出現「Org Seek Analys」這個子論壇，Table 1–3 與方法都沒有它（PDF 第 5 頁）。

## 與清單「要撐的結論」不合的地方

清單原句：「論壇互動網路是模組化的，資訊擴散受限」。

- 撐得住，但要附條件：(1)「擴散受限」是**模擬結果**（SI 模型跑在推導出的顯著網路上，跟隨機重連比），不是觀察到的資訊傳播；(2) 量的是發文者之間的共同參與，**不含只讀不發的人**，而看討論串的人數（11,500 到 15,000）是發文人數（3,300 到 4,500）的三倍以上；(3) 只有一門課兩期；(4) 模組度與擴散的關係作者自己沒有做統計檢定。
- 不能延伸成「論壇對學習沒用」：本文沒有量學習。也不能說「全部子論壇都一樣」：Cases 與 Final Project 這種有教師出題、反覆討論的子論壇最不脆弱、被濾掉的邊最少。對寫文章較有用的一點是**子論壇的設計（教師出開放題、計分）與互動結構有關**，但那也是兩期的相關比較。

## 讀取紀錄

- L1–10：期刊資訊、題名、作者單位、日期、授權、摘要、PMC 狀態行
- L11–16：引言
- L17–29：Results 開頭、Table 1
- L30–43：Significant interaction networks、Figure 1 圖說、Table 2 與其後段落
- L44–50：Communication vulnerability、Figure 2、3 圖說
- L51–69：Information diffusion、Figure 4 圖說、Table 3、結果總結段
- L70–71：Discussion
- L72–76：Methods（課程、子論壇、網路定義、顯著網路推導、擴散模擬）
- L77–80：補充資料、致謝、利益衝突、作者貢獻
- L81–127：參考文獻 30 條，掃過
- PDF 全 7 頁都看過頁面影像：Table 1（第 2 頁）、Table 2 與 Figure 1（第 3 頁）、Figure 2、3（第 4 頁）、Figure 4（第 5 頁）、Table 3（第 6 頁）逐格對過，與 PMC 文字一致（Table 1 FOBS-2 Course Material Feedback 的「1,86(2.5)」逗號在 PDF 也是如此，原文排版錯字）。
