# 抽取紀錄：Tullis & Goldstone 2020，Cognitive Research: Principles and Implications

- **書目**：Jonathan G. Tullis, Robert L. Goldstone (2020). Why does peer instruction benefit student learning? *Cognitive Research: Principles and Implications*, 5, 15. doi:10.1186/s41235-020-00218-5。PMC7145884；PMID 32274609。Received 2019-10-08，Accepted 2020-02-25，刊出 2020-04-09。作者全名依 PMC XML 的 contrib 欄位核對：Tullis（University of Arizona 教育心理系，通訊作者）、Goldstone（Indiana University 心理系）。
- **原文檔**：`.research/raw/learning-content/q5-social/tullis-goldstone2020-pi.txt`（124 行、67,619 位元組、66,988 字元）。是 PMC 的 JATS XML（同目錄 `tullis-goldstone2020-pi.html`，實際內容是 XML）轉的純文字；表格由 XML 表格結構轉出，一列一行，不是 PDF 雙欄版面，沒有錯位。以下位置一律用**字元位置**（Python 字串索引）。
- **取得網址與授權**：PMC 文章頁 https://pmc.ncbi.nlm.nih.gov/articles/PMC7145884/ 的 XML（Springer 存入 PMC 的刊出版，`is-manuscript no`）；期刊頁 https://cognitiveresearchjournal.springeropen.com/articles/10.1186/s41235-020-00218-5 。CC BY 4.0（字元約 600–1,360 的授權聲明）。屬出版者合法公開版本。
- **補看的圖**：Fig. 1–4 正文只有圖說，原圖從出版者的 Springer Nature 圖檔主機取得（`https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs41235-020-00218-5/MediaObjects/41235_2020_218_Fig{1-4}_HTML.png`），存本批 scratch，未放回 raw。Fig. 2 的路徑數字都讀出來並和正文對過。
- **PDF 版面**：出版者 PDF 用 curl 取不到（回 HTML）。本檔來源是 XML，表格逐格對過 XML 原檔（`.html`）的表格結構，並用表內數字互相驗算（見讀取紀錄），沒有對 PDF。
- **版本**：刊出版
- **讀取日期**：2026-10-14
- **供 order**：20（同儕討論為什麼有效、是不是只是抄答對的人）
- **資料公開**：OSF https://osf.io/5qc46/（未下載）

## 研究設計

- **類型**：課堂內觀察資料的次級分析，**單組、前後比較**（同一題討論前作答 vs. 討論後作答），**沒有不討論的對照組**。作者明說：「we do not intend to make general claims about all kinds of peer instruction or to evaluate the long-term effectiveness of peer instruction」（字元約 12,500）。
- **受試者**（Method，字元 12,942–13,873；Table 1）：六門課、208 名學生、1,657 筆完整作答、86 題。作者就是這些課的授課教師。

  | 課 | 年 | 層級 | 人數 | 題數 | 學校 |
  |---|---|---|---|---|---|
  | Cognitive Psych | 2015 | 大學中段 | 61 | 4 | Indiana |
  | Cognitive Psych | 2017 | 大學中段 | 60 | 4 | Indiana |
  | Decision Making（教心） | 2016 | 大學高年級 | 24 | 15 | Arizona |
  | Decision Making（教心） | 2017 | 大學高年級 | 37 | 16 | Arizona |
  | Learning Theories（教心） | 2016 | 碩士入門 | 12 | 26 | Arizona |
  | Learning Theories（教心） | 2018 | 碩士入門 | 14 | 21 | Arizona |

- **教材**（字元 13,873–14,485）：授課教師自編的選擇題，測概念理解與應用，不測事實記憶。
- **程序**（字元 14,485–16,347）：讀題 → 個人作答並報信心（1「Not at all confident」到 10「Highly confident」）→ 和**鄰座**配對討論 → 再作答、再報信心 → 教師公布正解並講解。多數題目計參與分、不論對錯（認知心理學兩班各自最後一題計正確分）。差異：認知心理學兩班用按鈕器、要求把自己的答案與信心講給夥伴聽、題目出現在課堂任何時間；其他四班用紙本、不要求說出答案與信心、題目多在課堂開頭。
- **分析**（字元 16,347–19,066）：混合效果模型，題目、班級、學生為隨機截距；連續結果用 t 對常態，二元結果用 Wald z。
- **量了什麼**：每題討論前後的正確與信心、夥伴是否同答案、夥伴信心。**沒有量**延後測驗、遷移題、或下一題的表現。

## 結果（逐項）

1. **討論前後正確率**（字元 19,066–20,127；Table 2）：「the odds of correctness increased by 1.57 times (95% confidence interval (conf) 1.31–1.87) from pre-discussion to post-discussion」。Table 2：截距 β = 0.68（SE 0.19，z = 3.515，p = .0004）；時間點 β = 0.45（SE 0.09，z = 5.102，p < .0001）。exp(0.45) ≈ 1.57，驗算相符。「88% of students showed an increase or no change in accuracy」。
2. **各班前後**（Table 3，字元 20,127–21,000 附近）：

   | 課 | 前 | 後 | 差的 SD | 成對 t | d |
   |---|---|---|---|---|---|
   | Cog Psych 2015 | 0.67 | 0.76 | 0.27 | t(60) = 2.40，p = 0.02 | 0.31 |
   | Cog Psych 2017 | 0.65 | 0.73 | 0.21 | t(59) = 2.75，p = 0.007 | 0.36 |
   | Decision Making 2016 | 0.57 | .66 | 0.13 | t(23) = 3.30，p = 0.003 | 0.69 |
   | Decision Making 2017 | 0.71 | 0.75 | 0.13 | t(36) = 1.92，**p = 0.06** | 0.32 |
   | Learning Theories 2016 | 0.58 | 0.69 | 0.06 | t(11) = 5.76，p < 0.001 | 1.74 |
   | Learning Theories 2018 | 0.57 | 0.61 | 0.09 | t(13) = 2.00，**p = 0.07** | 0.56 |
   | Overall | 0.65 | 0.72 | 0.20 | t(212) = 5.39，p < 0.001 | 0.37 |

   六班中兩班未達 .05。
3. **逐題**（Fig. 1 原圖）：各題點大多在對角線上方，但有少數題目在對角線下方（討論後正確率下降，例如首答約 0.55 的一題討論後約 0.36、約 0.30 的一題降到 0.20、約 0.18 的一題降到約 0.09）。正文寫「The data show a consistent improvement in accuracy from pre-discussion to post-discussion across all levels of initial difficulty」（字元約 19,600），指的是整體趨勢線。
4. **答案流向**（字元 22,420–22,869；Fig. 2 原圖逐格讀出）：
   - 首答錯 36%（603 筆，信心 5.48）：與夥伴不同 57%（343）→ 最後錯 58%（199）、最後對 42%（144）；與夥伴相同 43%（260）→ 最後錯 91%（236）、最後對 9%（24）。
   - 首答對 64%（1,054 筆，信心 6.45）：與夥伴不同 22%（232）→ 最後錯 21%（49）、最後對 79%（183）；與夥伴相同 78%（822）→ 最後錯 1%（5）、最後對 99%（817）。
   - 正文：「only 5% of correct answers were switched to incorrect, while 28% of incorrect answers were switched to correct following discussion」。驗算：(49 + 5)/1,054 = 5.1%；(144 + 24)/603 = 27.9%，相符。
   - 各路徑最後信心：兩人同錯且維持錯 6.60；兩人同對 7.99；由錯改對（不同意組）6.45；由對改錯 6.14。
5. **信心和正確有關**（字元 22,869–23,644）：討論前 gamma 平均 M = 0.40，t(160) = 8.59，p < 0.001，d = 0.68。
6. **只跟信心高的人走？**（字元 25,062–25,535）：「When peers disagreed, students' final answers aligned with the more confident peer only 58% of the time」；若一律選信心較高者，最終正確率會是 69%，顯著低於實際 72%（t(207) = 2.59，p = 0.01，d = 0.18）。
7. **控制信心後，答案對錯仍預測是否堅持**（字元 25,535–29,444；Table 5，只看意見不同的情況）：自己信心每加 1 分，堅持原答案的勝算 × 1.25（1.13–1.38）；夥伴信心每減 1 分 × 1.19（1.08–1.32）；兩者權重無差異（χ² = 0.49，p = 0.48）；「if one's own answer was correct, the odds of keeping one's answer increased 4.48 times (2.92–6.89)」。Table 5：截距 −0.18（SE 0.13，z 1.36，p .17）；自己信心 0.22（0.05，4.16，< .0001）；夥伴信心 −0.18（0.05，3.51，.0005）；自己答對 1.50（0.22，6.73，< .0001）。exp 驗算相符。Fig. 3：各信心差下首答對者堅持的機率大多高於首答錯者，但誤差棒很大、有些點只有一筆資料。
8. **同意時的信心變化**（Table 6，只看意見相同的情況）：時間點 β = 1.08（SE 0.14，t 7.98，p < .0001）；首答對 0.78（0.13，6.05，< .0001）；交互作用 0.33（0.15，2.14，p = .03）。即同意正確答案時信心上升比同意錯誤答案多。**但 Fig. 4 與 Fig. 2 也顯示同意錯誤答案時信心照樣上升**（5.45 → 6.60），只是升得較少。
9. **後設認知解析度**（字元 30,115–31,133；Table 4）：gamma 從討論前到討論後上升，t(139) = 2.98，p = 0.003，d = 0.24。各班：Cog Psych 2015 0.60 → 0.79（p = 0.24）；Cog Psych 2017 0.27 → 0.40（p = 0.02）；DM 2016 0.36 → 0.56（p = 0.004）；DM 2017 0.47 → 0.44（p = 0.81，d = −0.04）；LT 2016 0.18 → 0.28（p = 0.14）；LT 2018 0.43 → 0.37（p = 0.57，d = −0.16）；Overall 0.40 → 0.48。**六班只有兩班顯著，兩班方向相反**。表註：自由度減少，因為許多學生在正確或信心上沒有變異，無法算 gamma。
10. **離最佳還有差距**（字元 33,270 起）：「If students had chosen the correct answer whenever one of the partners initially chose it, the final accuracy would have been significantly higher (M = 0.80 (SD = 0.19)) than in our data (M = 0.72 (SD = 0.24), t (207) = 6.49, p < 0.001, d = 0.45)」。作者不把這叫 process loss，理由是一人選對不代表有說服人的理由；而相對於「一律選信心高者」的 69%，實際 72% 被稱為「process gain」。
11. **同意時幾乎不改**（字元 40,707 起）：同意時改答案「less than 3% of the time」；不同意時 66% 堅持原答案；「Even when their partner was more confident, students only switched to their partner's answer 50% of the time」。驗算：同意組改答 (24 + 5)/1,082 = 2.7%；不同意組堅持 (183 + 199)/575 = 66.4%，相符（假設首答錯且維持錯的 199 筆都是原答案，原文沒有分開報告換到另一個錯答案的筆數）。
12. **鄰座同程度**（字元 41,779 起）：首答對（64%）時 78% 的夥伴同答案；首答錯（36%）時 43% 同答案；作者推論學生坐在程度相近的人旁邊，建議「Peer instruction could potentially benefit from randomly pairing students together」。這是推論，沒有測試隨機配對。
13. **領域條件**（字元 43,798 起）：作者轉述 Koriat 2015——事實或知覺題多數人答錯時，互動可能放大錯誤答案；推理型（intellective）題目才較可能從論證得益。本研究沒有比較題型。

## 作者自己列的限制

本文沒有獨立的限制節。散見的自我設限：
- 只分析一種常見課堂做法的認知歷程，不評估長期效果、不推論到所有 PI（字元約 12,500）。
- 討論中改正的錯誤在之後重測是否維持「remains an open question」；高、低信心錯誤的長期保留、同儕是否也有 hypercorrection 效應都待研究（字元約 42,900–43,800）。
- 效果可能依領域與題型而異（字元 43,798 起）。

我另外看到、作者沒寫的：沒有不討論的對照組（多出來的思考時間、重讀題目也可能帶來進步）；作者兼授課教師；配對不是隨機；各班程序不同（是否說出信心）；只有一題一次，沒有延後或遷移測量。

## 與摘要說法不一致的地方

- Significance 段寫「Students' accuracy consistently improved through discussion with a peer」，Table 3 六班中兩班 p = 0.06、0.07 未達顯著，Fig. 1 也有少數題目討論後下降。整體方向一致，但「consistently」不是每班每題都成立。
- Significance 段寫「the data reveal that peer discussion helped students select the correct answer by prompting them to create new knowledge」。資料只顯示控制信心後答案對錯仍預測堅持與否；「創造新知識」是作者的解釋，沒有直接量（沒有分析討論內容）。
- 討論節寫後設認知解析度上升（整體 d = 0.24），Table 4 六班只兩班顯著、兩班反向。
- 討論節說效果「small to medium-sized」，Table 3 有一班 d = 1.74（n = 12）。
- Table 3 Overall 的自由度 t(212) 對應 213 人，與正文 208 人不一致，原文沒說明。
- 摘要說學生討論後「more accurate and confident」——信心在同意錯誤答案時也上升（Fig. 2：5.45 → 6.60），摘要沒提。

## 與清單「要撐的結論」不合的地方

清單寫：「討論後答對的勝算 1.57 倍；不只是抄答對的人」。

- **1.57 倍撐得住**，但要連著條件寫：是同一題、討論前 vs. 討論後的作答，95% CI 1.31–1.87，六門心理學／教育心理學課、208 人；沒有不討論的對照組，不是學習成效或遷移。換算成正確率是 65% → 72%。
- **「不只是抄答對的人」大致撐得住，但原文比的是「跟信心高的人走」，不是「抄答對的人」**：學生事前不知道誰答對，原文的對立假說是「選信心較高者的答案」。證據是控制雙方信心後首答正確者堅持勝算 × 4.48，以及實際 72% 高於一律跟信心高者的 69%。同時要一起寫：信心本身也有明顯作用（每分 × 1.25、× 1.19），不同意時只有 58% 跟信心高的人走；而且離「只要一人答對就選對」的 80% 還差 8 個百分點。
- 同意錯誤答案的組合 91% 維持錯誤、信心還上升，這是同一篇裡的反向證據，寫「不只是抄」時應一併交代。

## 讀取紀錄

依序讀過的字元區間（首尾相接）：0–14,000（書目、授權、摘要、Significance、前言兩種解釋、Method 受試者、Table 1、教材開頭）；14,000–30,000（教材、程序、分析策略、Table 2–6 與各段結果）；30,000–46,000（後設認知解析度、Discussion 全文、致謝、作者貢獻開頭）；46,000–49,500（作者資訊、經費、資料、倫理、參考文獻開頭）；49,500–66,988 參考文獻掃過（看了結尾 800 字元確認檔尾是 Data Availability）。

表格核對：Table 1–6 是 XML 表格逐列轉出，逐格讀過；以 exp(β) 驗算 Table 2、5 的勝算比，以平均差／SD 驗算 Table 3 的 d（例：DM 2016 0.09/0.13 = 0.69；LT 2016 0.11/0.06 ≈ 1.83，原文 1.74，差異應來自前後平均的四捨五入）。Fig. 1–4 原圖逐張看過，Fig. 2 的十四格數字全部讀出並與正文百分比驗算相符。沒有對 PDF 版面（出版者 PDF 用 curl 取不到；來源是 XML，不受雙欄錯位影響）。
