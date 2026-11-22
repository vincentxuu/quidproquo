# 抽取紀錄：Gao、Xu、Yang & Hu 2022，The double-edged sword effect of argumentative scaffolding on group discussion in an adaptive discussion system

- **書目**：Hongli Gao（新鄉醫學院心理學院，通訊作者）、Sheng Xu（華中師範大學心理學院）、Lei Yang（河南師範大學心理學院）、Xiangen Hu（華中師範大學心理學院）。Gao 與 Xu 共同第一作者。Frontiers in Psychology, 13, 997522。2022-07-19 收稿、2022-10-25 接受、2022-11-10 刊出。DOI 10.3389/fpsyg.2022.997522。作者全名與順序對 PDF 首頁題名區與 Crossref 核過；注意 PDF 首頁的「CITATION」框寫成「Gao H, Yang L, Xu S and Hu X」，與題名區及 Crossref 的順序（Gao、Xu、Yang、Hu）不同，引用以題名區與 Crossref 為準。
- **版本**：出版者刊出版，CC BY 開放取用。
- **原文檔**：`.research/raw/learning-content/q5/gao2022-argument-scaffold.pdf`（11 頁）與 `.txt`（1,317 行、51,469 字元）。PDF 來源網址 https://www.frontiersin.org/articles/10.3389/fpsyg.2022.997522/pdf （F 清單檔頭記載，Frontiers 開放取用）。精讀時另用不帶 `-layout` 的 `pdftotext` 重轉到 scratch（同樣 1,317 行），表格與圖直接看 PDF 第 6、7 頁。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 20 第 11 列（F 清單）

## 研究設計

- **類型**：實驗室隨機分派實驗，兩組，組間設計，單次。
- **受試者**：64 名大學部學生（男 9、女 55），兩人一組共 32 組，每組另有一個電腦代理人「GX07」；實驗組 16 組、控制組 16 組。互相認識的人分到不同組。地點未寫明城市，作者機構在中國河南、湖北。有小額報酬。倫理審查：作者寫依當地法規不需要（Ethics statement）。
- **任務**：線上文字討論 25 分鐘，題目「人工智慧會怎樣影響人類？」。
- **代理人**：用關鍵詞比對自動判斷受試者目前發言屬於八類觀點中的哪一類（便利、失業、依賴、管控、進步、合理使用、趨勢等，Table 1），然後丟出一個不同類別的典型觀點。兩位研究者之間的分類一致率 0.72，電腦與人工 0.79（Adaptive discussion system 節，p. 4）。
- **比較對象**：
  - 控制組：代理人只給不同類別的觀點（內容特定鷹架）。
  - 實驗組：給完觀點後再問兩句「do you agree with me?」與「could you give the reasons to support your viewpoint?」（內容無關的論證鷹架），並進入「論證模式」；受試者給出有效觀點時有 50% 機率得到肯定回應；1 分鐘沒人說話會鼓勵發言；連續離題 5 次或 2 分鐘沒人說話則強制退出論證模式（Procedure，p. 4）。控制組沒有鼓勵發言的提示——所以兩組差的不只是兩句論證提問。
- **量了什麼**（Dependent variables，p. 4–5）：
  1. 互動品質：以 Gunawardena 等 1997 的 IAM 改編，兩階段（分享比較資訊；發現與探索不一致）各五類，兩位研究者編碼，一致率「above 0.8」；只計代理人發言之後受試者說的話；兩人合計為組指標。
  2. 網路中心性：以代理人觀點的關鍵詞為節點，共現為連結，算度中心性。
  3. 討論廣度與深度：電腦分類每句；廣度 = 類別數，深度 = 每類觀點數，另算有效觀點比例。組層級。
  4. 自評討論效果：後測問卷（附錄 8 題，五點量表），個人層級。
  5. 前後變化：前後測各以錄音回答開放題，轉文字後由電腦數涉及幾類；另算深度、廣度自評的增量。
- **何時量**：討論前（前測問卷與錄音）、討論中（聊天紀錄）、討論後立刻（後測問卷與錄音）。沒有延後測。

## 結果（逐項）

表格數字對過 PDF 第 6、7 頁版面。組層級比較 df = 30（n = 16 組 vs 16 組），自評是個人層級 df = 62。

| # | 結果 | 數字 | 對照條件 | 節／表 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 陳述觀點次數 | 實驗 3.13 ± 1.89 vs 控制 6.88 ± 3.65，t(30) = −3.65，p < .01，d = −1.29 | 論證鷹架 vs 只給觀點 | Results／Table 2，p. 5–6 | 「for the statement of opinion, the experimental group (M = 3.13) was significantly lower than that of the control group (M = 6.88)」 |
| 2 | 第一階段問答次數 | 3.31 ± 4.45 vs 8.00 ± 6.54，t(30) = −2.37，p < .05，d = −0.84 | 同上 | Table 2 | 「In terms of questions and answers in stage 1, the experimental group (M = 3.31) was significantly lower than the control group (M = 8.00)」 |
| 3 | 其他互動類別都不顯著 | 無關 7.50 vs 18.81（t = −1.14）；同意 6.69 vs 6.44（0.18）；證據 3.94 vs 4.00（−0.06）；修正 11.75 vs 14.25（−0.90）；**表達不同意 0.13 vs 0.13（0.00）**；不同類別觀點 1.81 vs 1.56（0.45）；第二階段證據 0.19 vs 0.13（0.47）；第二階段問答 0.13 vs 0.06（0.59）；第二階段修正 1.75 vs 0.69（1.57） | 同上 | Table 2，p. 6 | 「In other indicators, there was no significant difference between the two conditions」 |
| 4 | 論證提問沒有引出更多辯論 | 不同意與提供證據兩組無差異 | 同上 | Discussion，p. 7 | 「the content-independent scaffolding in the experimental condition did not provoke more debates」 |
| 5 | 代理人關鍵詞的度中心性 | 0.12 vs 0.09，t(30) = 2.35，p < .05，d = 0.85 | 同上 | Results／Figure 1，p. 5–6 | 「the degree centrality (M = 0.12) of the key words provided by the virtual agent under the experimental condition was significantly higher than that under the control condition (M = 0.09)」 |
| 6 | 有效觀點比例 | 0.70 ± 0.17 vs 0.57 ± 0.16，t(30) = 2.22，p < .05，d = 0.79 | 同上 | Table 3，p. 7 | 「in terms of the proportion of effective viewpoints, the experimental group (M = 0.7) was significantly higher than the control group (M = 0.57)」 |
| 7 | 廣度、深度、觀點數、句數都不顯著 | 類別數 7.06 vs 7.31（t = −0.96）；觀點數 27.75 vs 34.31（−1.59）；句數 44.38 vs 67.81（−2.00，未標顯著）；每類觀點數（深度）3.90 vs 4.61（−1.48） | 同上 | Table 3，p. 7 | 「In other indicators, there was no significant difference between the two groups (see Table 3)」 |
| 8 | 深度沒有如假設提高 | 每類觀點數無差異 | 同上 | Discussion，p. 8 | 「there was no significant difference in the depth of discussion between the experimental condition and the control condition, which was inconsistent with the expected assumption」 |
| 9 | 自評「更全面理解題目」 | 4.13 vs 3.84，t(62) = 2.10，p < .05，d = 0.54 | 同上（個人層級） | Results／Figure 2，p. 6–7 | 「in terms of the comprehensive understanding of the topic, the experimental group (M = 4.13) was significantly higher than the control group (M = 3.84)」 |
| 10 | 其他自評題不顯著 | 他人觀點有幫助、整體討論效果、願意再討論等無差異；數字沒報，Figure 2 只畫了「comprehensiveness」一項 | 同上 | p. 6 | 「On the other items, there were no significant differences (see Figure 2)」 |
| 11 | 前測無差異 | 數字沒報 | 兩組前測 | p. 6 | 「the results showed that there was no significant difference」 |
| 12 | 討論前後的變化 | 兩組無差異；數字沒報 | 前後測錄音的類別增量、自評深度廣度增量 | Comparison of the degree of change，p. 6 | 「there was no significant difference between the two conditions」 |
| 13 | 作者的結論 | 時間有限時廣度與深度互相衝突；要多元觀點就只給觀點，要深化就加論證鷹架 | — | Conclusion，p. 9 | 「in the case of limited discussion time, depth and breadth of discussion are contradictory」 |

## 作者自己列的限制（Limitations and future directions，p. 8–9）

1. 前後測的開放題（自由回答、關鍵詞、文字、錄音）都沒有反映出自變項不同水準的差異；八類觀點的深度、廣度自評也沒有。作者推測是短時間內難以敏感測到變化，建議改用類似任務的表現當遷移指標。
2. 代理人語料是先前討論中整理出的常見觀點，受試者普遍同意，不太會引發爭論；未來應加入有爭議的觀點。
3. 自動分類限於八個預設類別；未來可改用語意相似度。
4. 代理人沒有自我改進機制。

我另外注意到（不是作者列的）：每組 16 組、組層級 df = 30，樣本小；沒有任何學習成效測驗（只有聊天紀錄計數與自評）；實驗組另有鼓勵發言與 50% 肯定回應，控制組沒有，所以處理不只是兩句論證提問；做了十幾個 t 檢定沒有多重比較校正；男女比 9:55。

## 與摘要說法不一致的地方

- 摘要說實驗組「surveyed less ideas and interactions during the discussion」。原文顯著的只有兩類互動次數（陳述觀點、第一階段問答）；**觀點數（27.75 vs 34.31，t = −1.59）與句數（44.38 vs 67.81，t = −2.00）都沒有標顯著**（Table 3）。「ideas 較少」在統計上沒有成立；Discussion 的對應句改寫成「surveyed less view statements, questions and answers」比較貼近資料。
- 摘要說實驗組「reported more comprehensive understanding」——這是後測問卷八題中唯一顯著的一題，其他自評題不顯著，前後變化也不顯著；摘要沒提這些無效果結果。
- 自評量表方向不確定：附錄問卷的選項編號是 (1) Strongly agree 到 (5) Strongly disagree，原文沒說有沒有反向計分。如果照編號計分，4.13 > 3.84 代表實驗組**較不同意**「更全面理解」。原文把它解讀為實驗組較高，我無法從原文確認哪個對，標為不確定。
- 摘要列的依變項包括「the degree of change before and after the discussion」，但沒說這一項無差異。

## 與清單「要撐的結論」不合的地方

清單寫「論證鷹架的效果不一致；結果句的後半掃描時沒讀到」。

- 「效果不一致」是這篇在 Introduction 引述前人（Wecker & Fischer 2014；Noroozi 等 2017；Vogel 等 2017）時的說法，不是本研究的結果。本研究自己的結果是：論證提問讓兩人組更圍繞代理人的關鍵詞、離題比例較低、自評較全面（有方向疑問），但陳述觀點與問答次數較少；**沒有增加辯論（不同意次數兩組都是 0.13）、沒有提高深度、沒有改變前後測的理解**。
- 摘要結果句的後半是「but surveyed less ideas and interactions」，但如上所述「ideas 較少」不顯著，只有兩類互動次數較少。
- 這篇不能拿來撐「論證鷹架對學習有／無效」：沒有學習成效測驗，作者自己承認前後測測不出差異。比較適合當「加了論證提問，討論會變窄、變聚焦，但沒變深」的小樣本例子，並註明 32 組、單次 25 分鐘、實驗室、沒有學習測驗。

## 讀取紀錄

- 不帶 `-layout` 重轉的 scratch 檔依序讀：第 1–400 行（版權框、摘要、Introduction、Materials and methods、Table 1、Procedure 前半）→ 第 400–820 行（Procedure 後半、Adaptive discussion system、Dependent variables、Results 全部、Table 2、Table 3、Discussion 開頭）→ 第 820–1,317 行（Discussion、正負效果兩節、Limitations、Conclusion、Ethics、Author contributions、Funding、參考文獻掃過、附錄前後測問卷全文）。三段首尾相接，涵蓋全檔。
- Table 2、Table 3、Figure 1、Figure 2 直接看 PDF 第 6、7 頁圖像核對；txt 中 Table 2 的 d 欄被拆到表尾，以 PDF 為準。
- 原目錄的 `gao2022-argument-scaffold.txt` 與重轉版行數、字元數相同（1,317 行、51,469 字元），未另存新檔。
