# 抽取紀錄：Yu、Wu、Liu 2019〈Predicting Learning Outcomes with MOOC Clickstreams〉

## 檔頭

- **書目**：Chen-Hsiang Yu（逢甲大學資訊工程學系，通訊作者）、Jungpin Wu（逢甲大學統計學系）、An-Chi Liu（逢甲大學資訊工程學系）。〈Predicting Learning Outcomes with MOOC Clickstreams〉。Education Sciences 2019, 9(2), 104。DOI 10.3390/educsci9020104。2019-03-06 收稿、2019-05-07 接受、2019-05-14 刊出。CC BY。作者姓名與單位對過 PDF 首頁。
- **原文檔**：
  - 原有的 `.research/raw/learning-content/q6-evaluate/yu2019taiwanmooc.md`（193 行、46,184 字元；MDPI 網頁經 reader 轉出）**不完整**：缺作者姓名、缺整個第 2 節 Related Research、13 張表只剩標題沒有內容、4 張圖沒有內容；字元數有一半以上是參考文獻裡的 Google Scholar 連結。
  - **這次重抓**：ERIC 收錄的出版者版全文 PDF（ERIC 編號 EJ1220384），https://files.eric.ed.gov/fulltext/EJ1220384.pdf 。存成同目錄 `yu2019taiwanmooc_ERIC_EJ1220384.pdf`（15 頁）與 `yu2019taiwanmooc_ERIC_EJ1220384.txt`（`pdftotext -layout`，820 行、63,930 字元）。MDPI 本站的 PDF 與 HTML 用 curl 都回 403。
- **讀取日期**：2026-10-14
- **版本**：刊出版（PDF 頁尾有期刊卷期與 DOI）
- **供哪幾篇用**：order 25
- **讀法**：先把舊的 `.md` 從第 1 行讀到第 193 行，發現缺節缺表；重抓後用 Read 逐頁讀 PDF 第 1–15 頁，以 PDF 為準。

## 研究設計

- **類型**：用平台紀錄訓練分類模型，預測學生「有沒有拿到課程證書」。沒有實驗、沒有介入、沒有另外施測。
- **平台與課程**：OpenEdu（中華開放教育平台，以 edX 開源程式為基礎）。主要分析一門開過至少三次的「foundation course」，**課名、學科、開課學校都沒有寫**。第一次開課 6 週、55 支影片。
- **資料**（p.9，第 4 節）：

  | | 學習紀錄筆數 | 修課人數 | 拿到證書 | 沒拿到 |
  |---|---|---|---|---|
  | 第一次開課 | 532,579 | 590 | 264 | 327 |
  | 第二次開課 | 256,000 | 346 | 137 | 209 |
  | 第三次開課 | 137,348 | 427 | 57 | 370 |
  | 另一門課（9 週、95 支影片） | 447,133 | 977 | 86 | 891 |

  第一次開課的 264 + 327 = 591，和 590 差 1，原文如此。
- **特徵怎麼做**：把影片播放事件（load、play、pause、seek、speed_change、stop）轉成 12 種特徵事件（Table 2），再把同一個連線階段的事件序列切成 4-gram，用含萬用字元的樣式歸成 Sinha 等人（2014）的七種「行為動作」：Rewatch、Skipping、Fast Watching、Slow Watching、Clear Concept、Checkback Reference、Playrate Transition（Table 7）。
- **進模型的 14 個特徵**（Table 8，p.9；從 85 個候選特徵裡用「feature selection function」選出，選法沒有說明）：
  1. unit_num（登入的課程單元數）
  2. video_num（看過的單元影片數）
  3. sess_num（線上看影片的連線階段數）
  4–10. 七種行為動作各自的次數
  11. exam_num（可作答的測驗數）
  12. prom_num（測驗作答數）
  13. all_attempts（測驗嘗試作答的總次數）
  14. **unit_score（課程單元測驗的總分）**
- **被預測的東西**：課程通過（1）或不通過（0）。原文：「the real classification factors are pass (1) and fail (0) of the course」（p.10）。通過的標準（幾分及格、成績怎麼算）**原文沒有寫**。
- **模型**：R 的 KNN、SVM（e1071）、ANN（nnet，隱藏層 1 到 10 個單元）。前兩次開課的資料合併，70%／30% 或 80%／20% 切成訓練與測試；再拿最好的 ANN 去預測第三次開課。
- **第 5 節的延伸**：把 55 支影片分成理論（16 支）、實驗（25 支）、分析（14 支）三類，各類與兩兩組合分別建模，比較準確率（Table 10–13）。

## 結果（逐項）

Table 8–13 都對過 PDF 版面。

| # | 結果 | 數字與條件 | 位置 | 原文 |
|---|---|---|---|---|
| 1 | KNN 準確率 | 0.8624535（前兩次開課，70／30 切分） | p.10 | 「the accuracy is 0.8624535」 |
| 2 | SVM 準確率 | 0.9442379（同上） | p.10 | 「The accuracy of the built model is 0.9442379.」 |
| 3 | ANN 準確率（70／30） | 隱藏層 1 到 5 個單元時最高 0.9516729 | p.10 | 「the highest accuracy of the model was 0.9516729」 |
| 4 | ANN 準確率（80／20，前兩次開課） | Size 1：0.94972067；2：0.955307263；3：0.955307263；4：0.944134078；5：0.94972067；平均 0.950837989 | Table 9 | 「the highest accuracy of the ANN model for the first two classes offered is 0.955307263 when the number of hidden layers is 2 or 3」（表上是隱藏層的單元數 Size，不是層數） |
| 5 | 用前兩次開課的模型預測第三次開課 | Size 1：0.97309417；2：0.986547085；3：0.977578475；4：0.977578475；5：0.97309417；平均 0.977578475 | Table 9 | 「the average prediction accuracy of the third class data (0.977578475) is slightly better than the average model accuracy of the first two classes of data (0.950837989). The result is better than we expected」 |
| 6 | 每週「需要輔導」名單人數 | 第 1 週 313、第 2 週 313、第 3 週 311、第 4 週 305、第 5 週 297 | p.10 | 「There were 313 students who needed tutoring in the first week…」名單準不準、有沒有真的拿去輔導，都沒有報告 |
| 7 | 另一門課 | KNN 0.8787879、SVM 0.9218182、ANN 0.9318182（70／30）；ANN 0.9431818（80／20） | p.10 | 「ANN is still the best.」 |
| 8 | 單元紀錄裡看片與作答脫鉤的情形 | 第一次開課共 3,706 筆單元層級的學習活動紀錄；其中 511 筆沒有做單元測驗；有做測驗的裡面 538 筆在該單元完全沒看影片 | p.9 | 「Therefore, it is necessary to include both the clickstream of the video viewing and unit test score in the feature set.」 |
| 9 | 三類影片與組合的 ANN 準確率（前 13 名） | 全部三類 Size 1：0.960452；理論＋實驗 Size 1：0.954802；…；只用實驗類 Size 1：0.9；全部落在 0.9 到 0.96 | Table 11 | — |
| 10 | 各子集模型與全資料模型的預測一致程度 | 理論＋實驗（Size 3）0.988764045；理論＋分析（Size 3）0.91011236；只用理論 0.904494382；只用分析 0.730337079 到 0.752808989 | Table 12 | 「the prediction accuracy is determined by using the contingency table」 |
| 11 | 作者據此的結論 | 只用理論與實驗兩類影片的資料，就能得到和全資料相近的預測 | p.13 | 「the prediction effect can be achieved by using the clicking records of certain course videos (such as theoretical and experimental ones) instead of the whole data set.」 |

**原文沒有報告的東西**（都會影響這些準確率怎麼讀）：
- **沒有任何基準線**。第三次開課 427 人裡 370 人沒拿到證書（86.7%）；另一門課 977 人裡 891 人沒拿到（91.2%）。全部猜「不通過」在另一門課就有約 0.91 的準確率——那門課的 KNN（0.879）比這個還低，ANN（0.93–0.94）只高一點。這是我用原文的人數算的，原文沒有做這個比較。
- 沒有精確率、召回率、混淆矩陣、AUC。
- **沒有只用影片點擊特徵（不含測驗分數）的模型**，也沒有特徵重要性。所以從這篇看不出準確率有多少來自看片行為、多少來自 unit_score。
- 沒有說明訓練與測試是以「學生」還是「單元紀錄」為單位切的，也沒有說測試集有幾筆。（從小數反推：0.955307263 ≈ 171/179、0.9516729 ≈ 256/269、0.986547085 ≈ 220/223。若反推正確，前兩次開課合併約 895 筆，第三次開課的測試只有 223 筆而不是 427 人；這是我的推算，原文沒有寫，不能當事實引用。）
- 沒有交叉驗證或重複切分；準確率都報到七到九位小數，沒有信賴區間。

## 作者自己列的限制

**原文沒有限制一節，結論裡也沒有任何一句談限制。** 結論最後只列未來工作：分析不同類型的課與其他平台，「It will also be useful to study the effect of improving course completion rates.」（p.13）——也就是提高完課率的效果還沒有研究。

## 與摘要說法不一致的地方

1. **摘要說「predict students' learning outcomes via their learning behaviors」，題目是「with MOOC Clickstreams」**；實際進模型的 14 個特徵裡有 4 個是測驗相關的（可作答測驗數、作答數、嘗試次數、**單元測驗總分**）。被預測的「通過與否」本身就是由成績決定的，單元測驗分數是成績的一部分。摘要完全沒有提特徵包含測驗分數；內文在 p.9 有明講，理由是有人看了影片不作答、有人不看影片就作答。
2. **摘要說「Based on the prediction results, we saw a correlation between video viewing behavior and learning outcomes」**。全文沒有任何一個相關係數、沒有任何一項「哪種看片行為與通過有關」的分析結果；第 5 節只有一句「There were indeed different significant features with respect to learners passing and not passing the course」，沒有數字。結論用的說法也是「to determine the correlation」，同樣沒有數字。
3. **摘要說「This could allow teachers to help students needing extra support successfully pass the course」**。這篇沒有做任何輔導，也沒有驗證每週名單。
4. **摘要說用理論與實驗兩類影片的資料建模「without significant differences in prediction accuracy」**。沒有做顯著性檢定，只有準確率並排（0.960452 對 0.954802）與預測一致程度（0.9888）。
5. 摘要沒有提各次開課的通過人數；第三次開課與另一門課的通過率只有 13% 與 9%。

內文自身的不一致（照實記）：
- Table 13：「Accuracy >= 80%」有 10 項、比例寫 46%；13 項裡 10 項應是 77%。另外兩列（4 項 31%、12 項 92%）對得上 13 這個分母。內文 p.11 也照寫 46%。
- 第一次開課 590 人，通過 264 加不通過 327 是 591。
- 內文說特徵事件有「eight kinds」，Table 2 列了 12 種。Table 2 把 Cf、Cb（一秒內的捲動）對應到 speed_change_video，內文說它們是 seek 事件。停止事件內文叫 Sp、表裡叫 St。
- Table 9 的「Size」內文一處稱「number of hidden layers」、一處稱「units in the hidden layer」。
- p.10 說第三次開課的結果比預期好，「since the two classes were offered in different semesters」，前文是三次開課。
- Figure 4 的圖說開頭誤植為「OpenEdu data architecture.」（那是 Figure 2 的標題）。

## 與清單「要撐的結論」不合的地方

清單那句：「點擊紀錄能預測『通過與否』，被預測的不是獨立量的學習」。

- **後半句撐得住，而且可以說得更重**：被預測的是有沒有拿到課程證書，沒有任何獨立於課程成績的學習測量。題目與摘要用的詞是「learning outcomes」，內文的定義就是 pass／fail。
- **前半句要改寫**：不能寫成「點擊紀錄能預測通過與否」。
  1. 預測用的不只是點擊紀錄，還有單元測驗的作答數、嘗試次數與總分。拿測驗分數去預測由測驗分數決定的通過與否，高準確率有一部分是必然的；原文沒有做去掉測驗特徵的模型，所以「光靠看片行為能預測到多準」這篇沒有回答。
  2. 準確率沒有對照基準線。在通過率 9% 到 13% 的那兩組資料上，全部猜不通過就有 0.87 到 0.91。原文報的 0.93 到 0.99 要和這個比，而不是和 0.5 比。
  3. 沒有報告任何一種看片行為（重看、跳過、變速）與通過之間的關係，方向與大小都沒有。
- **放進 order 25 的方式**：這篇適合當「研究把『通過』叫作『學習成果』」與「預測準確率高不代表行為指標量到了學習」的例子，重點放在特徵裡含測驗分數、沒有基準線。不適合拿它的準確率數字去說「行為紀錄很能預測成績」。
- 這是台灣的資料（OpenEdu、逢甲大學），但課名與學科都沒有交代，寫的時候不能補。

## 讀取紀錄

1. 舊檔 `yu2019taiwanmooc.md`：第 1–193 行一次讀完（L1–32 標題與摘要、L34–46 第 1 節、L48–88 第 3 節、L90–108 第 4 節、L110–124 第 5 節、L126–136 第 6 節、L138–152 作者貢獻等、L154–193 參考文獻）。確認缺第 2 節、缺作者、缺所有表格內容。
2. 重抓的 PDF `yu2019taiwanmooc_ERIC_EJ1220384.pdf`，用 Read 逐頁讀版面（分兩次：第 1–8 頁、第 9–15 頁）：

| PDF 頁 | 內容 |
|---|---|
| 1 | 題目、作者、單位、收稿與刊出日期、摘要、關鍵詞、第 1 節開頭 |
| 2 | 第 1 節後半、第 2 節 Related Research 開頭（OpenEdu 與中華開放教育聯盟） |
| 3 | 第 2 節後半（學習者行為分類的先行研究、N-gram、機器學習方法）、第 3 節開頭 |
| 4 | 第 3 節、Figure 1（研究流程）、Figure 2（資料架構）、Figure 3（追蹤紀錄的 JSON） |
| 5 | Table 1、特徵事件的定義、Figure 4（事件流向圖） |
| 6 | Table 2、行為序列與 N-gram 的說明 |
| 7 | Table 3、Table 4 |
| 8 | Table 5、Table 6、Table 7、特徵合併的說明開頭 |
| 9 | 85 個特徵與 14 個入選特徵、Table 8、第 4 節（三次開課的資料） |
| 10 | KNN、SVM、ANN 的結果、Table 9、每週名單、另一門課 |
| 11 | 第 5 節、Table 10 |
| 12 | Table 11、Table 12、Table 13 |
| 13 | 第 6 節 Conclusions、作者貢獻、經費、致謝、利益衝突、參考文獻開頭 |
| 14–15 | 參考文獻（掃過）、授權聲明 |

全文 15 頁都讀過。對過 PDF 版面的表：Table 1–13 全部（讀的就是 PDF 版面）。Figure 4 是事件流向的網狀圖，線上的編號太小，只讀了圖說與內文引用的那一條（Pl→Sf，4,044 次）。
