# 抽取紀錄：Vickrey、Rosploch、Rahmanian、Pilarz、Stains 2015，CBE—Life Sciences Education

- **書目**：Trisha Vickrey, Kaitlyn Rosploch, Reihaneh Rahmanian, Matthew Pilarz, Marilyne Stains (2015). Research-Based Implementation of Peer Instruction: A Literature Review. *CBE—Life Sciences Education*, 14(1), es3. doi:10.1187/cbe.14-11-0198。PMC4353089。2015-03-02 刊出（Received 2014-11-06，Accepted 2014-12-10）。作者全名依 PMC XML 的 contrib 欄位核對，全部屬 University of Nebraska–Lincoln 化學系。文章類型是 essay（XML `article-type="other"`，頁碼 es3）。
- **原文檔**：`.research/raw/learning-content/q5-social/vickrey2015-pi-review.txt`（95 行、71,245 位元組、70,929 字元）。是 PMC 的 JATS XML（同目錄 `vickrey2015-pi-review.html`，實際內容是 XML）轉的純文字，不是 PDF 版面轉檔，沒有雙欄錯位問題。檔中行很長，以下位置一律用**字元位置**（Python 字串索引）。
- **取得網址與授權**：PMC 文章頁 https://pmc.ncbi.nlm.nih.gov/articles/PMC4353089/ 的 XML（出版者 ASCB 存入 PMC 的刊出版，`is-manuscript no`）。授權 CC BY-NC-SA 3.0（原文 1,000–1,400 字元附近的授權聲明）。屬出版者合法公開版本。
- **補讀的檔**：Figure 1（流程圖，正文只有圖說）與 Supplemental Table 1（7 頁），從 Europe PMC REST `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4353089/supplementaryFiles` 取得（出版者存入 PMC 的補充材料），存在本批 scratch 目錄，未放回 raw（清單原標「補充材料未取」，未改動原目錄）。
- **版本**：刊出版（出版者存入 PMC）。
- **讀取日期**：2026-10-14
- **供 order**：20（Peer Instruction 的流程與首答正確率門檻）

## 研究設計

- **類型**：敘述性文獻回顧（literature review／essay），**不是統合分析，也不是系統性回顧**：沒有合併效果量、沒有列出檢索日期、沒有篩選流程圖、沒有報告納入篇數（只說「The studies that met the criteria for this literature review are included in Supplemental Table 1」，字元 7,836 附近）。
- **檢索與納入**（METHOD，字元 6,840–7,930）：四條納入條件——(1) 大學層級、STEM 課程；(2) 結果只能歸因於 PI；(3) PI 和其他實證教學法綁在一起、只報整組結果的不收；(4) PI 必須照 Mazur (1997) 的步驟做。關鍵字 PI 搭配 learning gains、retention、flash cards、clickers、personal response system、problem solving、concept inventory、concept test、voting、histogram、peer discussion，搜 ERIC、Web of Science、Google Scholar。
- **Supplemental Table 1**：我數到約 55 筆研究條目，學科有物理、生物、地科、化學、資工、微積分、經濟、教育心理、工程、昆蟲學、哲學、醫學／獸醫生理學、天文。其中也收了 Beatty 2006、Crouch & Watkins 2007 這類非實證或手冊型文獻。
- **作者自己統計的情境**（字元 21,432–22,514）：「Of the research articles cited in this paper, 84% used PI in lower-level courses, 12% ... upper-level undergraduate courses, and 4% ... medical/veterinary school courses. Furthermore, 25% used PI in small classes (< 50 students), while 75% used it in large classes.」
- **Mazur 的 PI 七步**（字元 22,514–23,252）：出題 → 給時間想 → 個人作答 → 說服旁邊同學（同儕討論）→ 再作答 → 回饋教師（答案分布）→ 教師講解正解。
- **受試者／教材／量測**：本篇不自己收資料；以下結果都是作者轉述原始研究，數字一律是二手。

## 結果（逐項，全為作者轉述的原始研究）

### 一、PI 的整體成效（IMPACT OF PI，字元 7,930–16,104）

1. **Crouch & Mazur 2001（Harvard，十年）**：FCI 標準化增益「regularly twice as large as those observed with traditional lecture, even when implementing PI alone」（字元約 10,000）。對照是傳統講授；這是縱貫比較，不是隨機分派。
2. **Fagen 等 2002 教師問卷**：寄給 2,700 多位教師，找到 384 位 PI 使用者，拿到 108 位教師、11 所機構、30 門課的配對前後測 FCI；「In 90% of these courses, they found medium normalized learning gains (medium g ranges from 0.30 to 0.70) with only three courses falling below that range」（字元約 10,800）。注意：這個 g 是 Hake 的標準化增益，不是效果量；沒有同機構的對照組。
3. **Lasry 等 2008**：Harvard g = 0.50、兩年制學院 g = 0.49（準實驗）。
4. **其他學科**：地科 GCI 增益較大（McConnell 2006；Mora 2010）；資工入門課期末考高半個等第（Simon 2013b）；微積分兩篇期末考進步（Miller 2006；Pilzer 2001）。
5. **無效果結果**：Zingaro 2014 資工課「PI was associated with a 4.4% average increase on the final examination, but this finding was not significant ( p = 0.10)」（字元約 11,950–12,050）。
6. **解題與遷移**：Cortright 2005 隨機分派到 PI 組與「同樣的題目但個人作答、不討論」組，PI 組掌握度題目進步顯著（p = 0.02），新問題（遷移）表現也顯著較好；Giuliodori 2006 獸醫生理學討論後答對人數顯著增加；Jones 2012 昆蟲學近遷移較好（p < 0.05）；Crouch & Mazur 2001 全計算題期末考 PI 班平均顯著較高（字元 12,440–14,886）。
7. **退選**：Lasry 2008 兩年制學院退選率從講授班 20.5% 降到 PI 班 5%（原文寫「decreased by 15.5%」，是百分點）；Harvard 退選率減半以上、持續 < 5%；Porter 2013 回溯 10,000 多名資工學生，留存較高、不及格率較低（字元 14,886–16,104）。

### 二、師生看法（字元 16,104–21,432）

8. Crouch & Mazur 2001：導入 PI 前後課程評鑑**沒有差異**。
9. Fagen 2003（384 位教師）：70% 回報 PI 班評鑑較高；17% 學生反應混合；5% 負面；4% 起初負面後轉正面。
10. Crossgrove & Curran 2008：11 題問卷中 9 題主修與非主修沒有顯著差異；非主修較認為 PI 提升考試表現（p < 0.001）、較希望繼續用（p < 0.05）。
11. 自我效能：Zingaro 2014 PI 班自我效能增益顯著（p = 0.015）；Gok 2012 物理（p = 0.041）。
12. 作者結論句：「Overall, students have neutral to positive views on PI」（字元約 20,200）。
13. 教師：Fagen 2002 有 90% 正面經驗、79% 會繼續用、8% 可能再用。作者自己說「most research has focused on student perception and learning rather than faculty experience」。

### 三、各步驟的證據（EVIDENCE-BASED IMPLEMENTATION，字元 22,514–50,482）

14. **題目類型（步驟 1）**：Turpen & Finkelstein 2009 六位物理教師的題目中概念題 64–85%、記憶題 4–24%、演算題 0–11%。Rao & DiCarlo 2000：綜合評鑑題從 73.1 ± 11.6% 進步到 99.8 ± 0.24%，記憶題 94.3 ± 1.8% → 99.4 ± 0.4%，智能題 82.5 ± 6.0% → 99.1 ± 0.9%。作者自己挑毛病：「the percent of students arriving at the correct answer for each type of question before peer discussion was already large, calling into question the actual difficulty level of the questions asked」（字元約 25,500）。Smith 2009、Porter 2011b、Knight 2013 都指向難題收穫較大。
15. **先個人想、先投票（步驟 2、3）**：Nicol & Boyle 2003 有 82% 學生偏好先個人作答；90% 同意「a group discussion after an individual response leads to deeper thinking」；直接討論容易被動接受較有自信同學的答案。Nielsen 2014（四班 n = 279；焦點團體 n = 16；問卷 n = 109）：完整 PI 的討論時間顯著較長，論證時間中位數增加 90%。**作者自己的保留**：「the studies discussed in this section do not report learning gains for individual thinking ... more research is needed to confirm the importance of individual voting」（字元約 30,000）。
16. **按鈕器 vs. 字卡**：Lasry 2008 兩班 FCI 與考試增益「no statistical differences」；Brady 2013 字卡（paddles）組後設認知較高、按鈕器組成績較高。作者結論：低科技工具也可以。
17. **第一次投票後要不要秀分布**：Perez 2010（八班 629 人，交叉設計）——看到長條圖的學生「were 30% more likely to change their answer to the most common one」，難題更明顯，「appeared to account for 5% of the learning gains observed between the first and second vote」（字元 33,165 起）。Nielsen 2012 訪談：學生認為最多人選的就是對的。**反向**：Brooks & Koretsky 2011（n = 128，化學）沒看到偏向共識答案，解釋品質沒差，但看到分布的學生在答案與共識一致時更有自信，即使共識是錯的。作者建議：討論後再秀第一、二次投票的分布差異。
18. **首答正確率門檻（步驟 4）**（字元 35,397–36,944，本清單要核的句子）：原文是「Crouch and Mazur (2001) found that the largest improvement in moving toward the correct answer on a revote occurred when the initial individual answer was correct for ∼50% of the class. Nevertheless, there were still substantial learning gains when the initial percent of correct responses was between 35 and 70%.」接著作者據此推薦「students should be engaged in peer discussion when the percent of correct answers on the individual vote falls between 35 and 70%. Below 35%, the concept may need to be further described or a salient hint provided. ... Above 70%, the instructor should skip to the explanation of the answer.」但同段也寫「Subsequent studies suggest that students may still benefit from talking to one another, even when only a small proportion (< 35%) of the class obtained the correct response ( Simon et al. , 2010 ; Smith et al. , 2009 )」，段末「More research is needed to optimize guidelines for step 4. Regardless of the proportion of correct answers on the initial vote, students seem to benefit from peer discussion.」
19. **同儕討論本身（步驟 4、5）**：Smith 2009（遺傳學 n = 350，16 組同構題）：Q1 錯、Q1ad 對的學生有 77% 接著答對 Q2；有些答對 Q2 的學生所在小組沒有人原本會。Porter 2011b（資工 n = 96）：同儕討論讓 13–20% 學生有收穫。Lasry 2009（n = 88，交叉設計，討論／安靜反思／看漫畫分心）：討論組增益最高。Brooks & Koretsky 2011：兩次都答對的學生解釋品質在討論後提升。**反向**：James & Willoughby 2011 錄了 361 段討論，「26% of the time student responses implied understanding, while the quality of conversations suggested otherwise」，「in 62% of the recorded conversations, student discussions included incorrect ideas or ideas that were unanticipated」（字元 40,908 起）。作者結論：「the improvements observed between the first and second vote may overestimate student understanding」（字元約 41,250）。
20. **作答時間**：Turpen & Finkelstein 2009 六位教師平均給 100 ± 5 秒到 153 ± 10 秒，兩位 SD 超過 100 秒。作者只找到一篇（Miller 2014）：約 80% 學生作答後，答對與答錯的比例開始下降；建議 80% 作答後倒數。
21. **教師講解（步驟 6）**：Smith 2011（主修 n = 150、非主修 n = 62，三條件）：同儕討論加教師講解的增益顯著大於只討論或只講解（p < 0.05），各能力層都一樣。Zingaro & Porter 2014a（資工 n = 126）：Q2 答對率討論加講解 81% vs. 只討論 69%；難題講解的收穫最大。Knight 2013：要求「討論理由」比「討論答案」的推理品質顯著較高（p < 0.01）。
22. **計分方式**：James 2006 高風險計分（答對全分、答錯三分之一分）的班級，對話偏重一方的程度顯著較高（p = 0.008）；James 2008 同一教師從高風險改低風險，偏重程度下降（idea count p = 0.025；word count p = 0.044）。作者自己指出這兩篇的分析單位是學生而不是班級，「likely confounding these results」；也說「more research is needed to link this improvement directly to learning gains」。

### 四、Figure 1（作者提出的實證版 PI 流程，從補充檔的圖讀出）

呈現內容 → 出高層次、智能型題目 → 學生用按鈕器或字卡個人作答 → 分析答案分布 → 三條路：>70% 答對「Provide brief explanation」；35%–70% 答對「Ask students to explain their reasoning to peer(s)」→ 再作答 → 講解；<35% 答對「Provide hint」後進同儕討論，**或**「Provide detailed explanation」後回到個人作答。

## 作者自己列的限制（LIMITATIONS，字元 50,482–55,833）

1. 實施細節仍不確定：高風險計分的影響、討論前秀投票結果的後果、首答正確率要多少才進同儕討論，都還不清楚。
2. 對學生個別特徵與先備知識的關係所知很少：Steer 2009（4,700 人）弱勢女性學生從錯改對較多，但作者指出原始分數變化沒考慮起點低本來就能進步較多；Miller 2014 控制先備知識與自我效能後性別差異不顯著；Gray 2011（1,236 人）ACT 分數預測 PI 題答對數；Simon 2013b 高中多數同學沒上大學的學生，PI 對他們有「a slight negative, but insignificant, effect」。
3. 分析單位錯誤：多數研究用個別學生而非班級當單位，提高型一錯誤；改用班級又會檢定力不足。
4. 研究多用按鈕器，自帶裝置（BYOD）的效果未知，可能增加分心。

## 與摘要說法不一致的地方

- 摘要寫「Extensive research has been conducted ... to evaluate the effectiveness of this practice」，結論寫「this pedagogy overwhelmingly improves students' ability to solve conceptual and quantitative problems」（字元約 56,000）。正文裡其實有 Zingaro 2014 不顯著（p = 0.10）、Simon 2013b 對某些學生小幅負向（不顯著）、Crouch & Mazur 2001 課程評鑑沒差，以及 James & Willoughby 2011 顯示投票進步會高估理解。「overwhelmingly」比正文證據強。
- 結論寫學生「are more likely to persist in courses utilizing it」，正文證據是 Lasry 2008 與 Porter 2013 的非隨機比較與 Fagen 教師自陳，沒有控制學生特徵；限制節自己說要控制學生特徵才能看出真正效果。
- 摘要說要提供「research-based model」，但正文對步驟 2–3（個人先想）明說沒有學習增益證據、步驟 4 的門檻「more research is needed」。

## 與清單「要撐的結論」不合的地方

清單寫：「Peer Instruction 的流程；首答正確率 35–70% 時收穫最大（轉述 Crouch & Mazur）」。

- **「35–70% 時收穫最大」撐不住原句**：原文說收穫最大是在首答正確率**約 50%**；35–70% 是「仍有可觀增益」的區間，是作者據此**推薦**的進入同儕討論範圍。應改寫成「約 50% 時改進最大，35–70% 仍有可觀增益，作者據此建議 35–70% 進討論」。
- 這裡的「收穫」是同一題第一次投票到再投票的答對率變化，不是後測或遷移；同篇作者自己說這種變化「may overestimate student understanding」。
- 同段作者也寫 <35% 時學生仍可能從討論受益（Smith 2009、Simon 2010），並說門檻需要更多研究。不能把 35–70% 寫成有實證的硬門檻。
- 這是二手轉述，Crouch & Mazur 2001 原文沒讀；若要引數字，應回原始研究（批次表列 Crouch & Mazur 2001 為第三方轉載，不能用）。
- 「流程」部分撐得住：Mazur 七步與作者的 Figure 1 修訂流程都在原文。

## 讀取紀錄

依序讀過的字元區間（首尾相接）：0–12,000（書目、摘要、前言、方法、整體成效前半）；12,000–26,000（整體成效後半、解題、退選、師生看法、情境、七步、題目類型前半）；26,000–41,000（題目類型後半、個人思考、按鈕器、分布顯示、門檻、同儕討論）；41,000–56,000（討論品質結尾、作答時間、教師角色、計分、限制、結論開頭）；56,000–61,000（結論、Figure 1 圖說、致謝、參考文獻開頭）；61,000–70,929 參考文獻掃過。另讀 Figure 1 原圖（es3fig1.jpg）與 Supplemental Table 1 全 7 頁（`pdftotext -layout` 轉出逐頁看過）。本篇沒有數字表格；來源是 XML 轉文字，不需對 PDF 版面。
