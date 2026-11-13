# 抽取紀錄：Larkin & Simon 1987，Why a Diagram is (Sometimes) Worth Ten Thousand Words

- **書目**：Jill H. Larkin、Herbert A. Simon（1987）. Why a Diagram is (Sometimes) Worth Ten Thousand Words. *Cognitive Science*, 11(1), 65–99. DOI 10.1111/j.1551-6708.1987.tb00863.x。作者全名對首頁（txt L5–7：「JILL H. LARKIN／HERBERT A. SIMON／Carnegie-Mellon University」）；卷期頁對首頁頁首（L1「COGNITIVE SCIENCE 11, 65-99 (1987)」）。OpenAlex 記頁碼 65–100（印刷第 100 頁是參考文獻後半），以首頁 65–99 為準。
- **原文檔**：`.work/learning-visualization-research/src/larkin-simon1987-wiley.pdf`（36 頁；PDF 頁 = 印刷頁 − 64）與同名 `.txt`（`pdftotext` 不帶 `-layout`，1,849 行、99,218 字元）。
- **取得網址與合法性**：https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/j.1551-6708.1987.tb00863.x （出版者 Wiley 的免費 PDF；OpenAlex 2026-10-14 查為 bronze、`oa_url` 即此址；Unpaywall 同日回 closed，兩者不一致，但檔案是出版者自己網站直接提供的 PDF，屬出版者公開版本）。curl 被 Cloudflare 擋（403），改用本機 Chrome（playwright-core，新 profile、無登入）開文章頁後以同源 fetch 下載，2026-10-14。每頁頁尾有 Wiley 下載戳記「Downloaded … by Readcube-Labtiva … on [14/10/2026]」。
- **版本**：出版者刊出版（掃描 OCR，文字層有 OCR 錯字，如 L3「Diagmm」、L29「10,OOO」；引句一律對頁面圖）。
- **舊檔**：`larkin-simon1987.txt`（87,300 字元）取自 UCSD 課程網站，不合規，本紀錄沒有使用。
- **讀取日期**：2026-10-14
- **供哪篇使用**：系列第 2 篇（圖表，`src/content/posts/learning/2026-10-13-diagrams-in-teaching-articles.md`）

## 研究設計

- **類型**：理論分析加計算模擬（production system），**沒有受試者**。作者在摘要說明做法：建立「informationally equivalent」的兩種資訊處理系統，一個是語句式（sentential），一個是圖解式（diagrammatic），比較兩者解題的計算效率（L9–15）。
- **只談外部表徵**：「our analysis explicitly concerns external representations」（L51–53）；心像只在 4.4 節做推測。
- **定義**（L158–161）：「A data structure in which elements appear in a single sequence is what we will call a sentential representation. A data structure in which information is indexed by two-dimensional location is what we call a diagrammatic representation.」
- **概念**：informational equivalence 與 computational equivalence（引 Simon 1978，L88–95）；處理分三個部分：search、recognition、inference（L172–182）。
- **例子**：
  1. 第 2 節滑輪題（三個滑輪、兩個重物，求 W2／W1；L309–322）。語句式表徵在簡單線性注意力假設下（L526–532）逐步解，計數「要搜尋的元素」；圖解式表徵以位置索引，注意力只移到相鄰位置。
  2. 第 3 節幾何題（兩條截線截兩平行線、證兩三角形全等；L1014–1018），以 OPS5 實作（L1445–1448）。
  3. 第 4 節「artificial」圖三例：經濟學供需圖（4.1）、物理自由體圖（4.2）、氫原子能階圖（4.3），屬非形式分析，沒有計數。
- **量了什麼**：滑輪題語句式「Total Elements Searched」；幾何題各階段新增元素數與平均搜尋次數。都是作者手算或程式產生的計數，不是人的表現。

## 結果（逐項）

| # | 結果 | 數字／內容 | 對照條件 | 節／表 | 行號（txt）／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 滑輪題語句式總搜尋量 | 共 138 個元素；七步各 25、7、20、19、14、22、31 | 語句式、簡單線性搜尋假設 | Table 2 | L711–722；印刷頁 77（PDF 頁 13，已看頁面圖確認） | 「Total Elements Searched: 138」 |
| 2 | 滑輪題圖解式 | 七步幾乎不需搜尋，錯誤嘗試會立即失敗；沒有給總數，只說大幅節省 | 對 #1 的 138 | 2.3 | L915–919 | 「Compared with the 138 considerations of elements for the sentential representation (see Table 2), the diagrammatic representation provides a large saving.」 |
| 3 | 圖解式免去標籤 | 物件標籤由位置取代 | 語句式需標籤（如 W1、Pa） | 2.3 | L920–923 | 「in addition to cutting search, a diagrammatic representation eliminates the overhead of keeping track of object labels.」 |
| 4 | 同一套程式不能直接搬 | 圖解式另需以位置為基礎的注意力轉移 | — | 2.3 | L924–925 | 「the program used with the sentential data structure is not immediately applicable to the diagrammatic data structure.」 |
| 5 | 滑輪題差異主要在搜尋 | 不在辨識或推論 | — | 2 開頭 | L306–308 | 「the principal differences between the representations derive from the amounts of search they demand, rather than from differences in recognition or inference.」 |
| 6 | 幾何題辨識成本 | Table 5 的 (b) 知覺元素 40 個、(c) 幾何程式只加 5 個；OPS5 版：原始 15 個元素，知覺產生式 41 步加 78 個，幾何產生式 5 步加 10 個 | 知覺加工 vs 幾何推論 | 3.2.3 | L1443–1448 | 「The overt costs of recognition are clearly large.」 |
| 7 | 幾何題語句式搜尋 | 每比對一個條件平均搜 48/2 = 24 個元素；語句式為 N×24（N 為產生式元素數），圖解式為 n×24（n 為位置群數，表 6 約 10 個元素分成一到兩群） | 語句式 vs 圖解式 | 3.2.3、3.3 | L1449–1452、L1489–1504 | 「the number of elements that must be checked to satisfy a production referring to n locations is therefore n*(48/2)」 |
| 8 | 搜尋估計偏保守 | — | — | 3.3 | L1510 | 「These estimates of relative search difficulty are extremely conservative.」 |
| 9 | 幾何題差異主要在辨識 | 圖與視覺系統「近乎零成本」提供知覺推論 | 對 #5 | 3.3、3.4 | L1463–1466、L1516–1524 | 「diagrams and the human visual system provide, at essentially zero cost, all of the inferences we have called "perceptual."」 |
| 10 | **推論沒有差別**（無差異結果） | 兩種表徵都要四個幾何推論 | 語句式 vs 圖解式 | 3.4 | L1535–1544 | 「there are no differences in inference processes. In each case four geometric inferences are required to solve the problem.」；另見第 1 節 L263–268「the differential effects on inference appear to be less strong」 |
| 11 | 推論規則強度與表徵無關 | 更強的規則在兩種表徵都提高效率 | — | 2.4、3.4 | L926–929、L1559–1564 | 「Inference rules can be more or less powerful, whatever the representation (diagrammatic or sentential) on which they operate.」 |
| 12 | 圖只對有對應產生式的人有用 | 學生「不畫圖」的解釋 | — | 1.2 Recognition | L257–261 | 「If the students lack productions for making physics inferences from diagrams, they may not only fail to "appreciate" the value of diagrams, but will find them largely useless.」 |
| 13 | 人工圖也有同樣性質 | 自由體圖：localization、minimal labeling、perceptual enhancement；能階圖：locality、minimizing labeling、perceptual enhancement | — | 4.2、4.3 | L1647–1665、L1695–1723 | 「Information used together is grouped together in the free-body diagrams.」 |
| 14 | 結論三個優勢 | 見右欄 | — | 5 | L1769–1773；印刷頁 98（PDF 頁 34，已看頁面圖） | 「Diagrams can group together all information that is used together, thus avoiding large amounts of search for the elements needed to make a problem-solving inference. / Diagrams typically use location to group information about a single element, avoiding the need to match symbolic labels. / Diagrams automatically support a large number of perceptual inferences, which are extremely easy for humans.」 |
| 15 | 但書一：不是任何圖都有用 | 圖要刻意構造才能發揮 | — | 5 | L1774–1791；頁 98–99 | 「None of these points insure that an arbitrary diagram is worth 10,000 of any set of words. To be useful a diagram must be constructed to take advantage of these features.」（頁面圖為 10,000；txt 是 OCR 的「10,OOO」） |
| 16 | 但書二：只對會用的人有用；還要會畫 | — | — | 5 | L1793–1798 | 「diagrams are useful only to those who know the appropriate computational processes for taking advantage of them. Furthermore, a problem solver often also needs the knowledge of how to construct a "good" diagram」 |
| 17 | 優勢是計算上的，不是資訊量 | — | — | 5 | L1793–1794 | 「diagrams can be better representations not because they contain more information, but because the indexing of this information can support extremely useful and efficient computational processes.」 |

## 作者自己列的限制

- 區分很簡化：「While certainly not the complete story on this important representational issue」（L1766–1767）。
- 只處理外部表徵；心像與外部圖作用類似只是推測：「We have no new evidence to offer」（L1733）、「Until then it must remain a speculation」（L1757–1758）。
- 搜尋計數依賴簡化的線性注意力假設（L526–532）；對圖解式的搜尋估計「extremely conservative」（L1510）。
- 只在「不翻譯成另一種表徵」的前提下比較（L72–75）。
- 第 4 節三例只做非形式檢視，作者稱「consider briefly」（L1575）。

## 與摘要說法不一致的地方

逐項對過，沒有。摘要（L9–27）說差異「Most important…in the efficiency of search for information and in the explicitness of information」，正文兩例分別以搜尋（滑輪）與辨識（幾何）為主，推論沒有差別，與摘要一致。

## 與清單「要撐的結論」不合的地方

清單 D-4 列的引用對象是「三個優勢與英文原句」。原文撐得住：三個優勢與英文原句都在結論節（#14、#15）。需注意兩點：

1. 原文是理論與模擬，沒有任何人類受試者資料；「省掉搜尋」的數字（138 個元素）是作者在單一題目、單一注意力假設下的計數，不是實驗量測。
2. 原文沒有分析樹、階層或任何特定圖型；唯一提到階層的是 L68–69「An outline may reflect hierarchical relations」，而且放在**語句式**表徵的脈絡下。

## 已發佈文章引用核對（`2026-10-13-diagrams-in-teaching-articles.md`，2026-10-14 的行號）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 31 | 表格「階層與樹（搜尋樹、決策樹、語法樹）｜節點連線圖；同一層超過 3 個節點就拆成多張小圖｜Larkin 與 Simon 的分析加上本站的寬度實測」 | 原文沒有談樹或階層圖，也沒有任何關於節點數或拆圖的說法；只有 L68–69 一句把 outline 的階層關係歸在語句式表徵 | **原文撐不住「階層與樹用節點連線圖」這條依據**。頂多能說是從「相鄰群組省搜尋」推出來的作者推論，依據欄應標成推論，不能寫成 Larkin 與 Simon 的分析結果 |
| 118 | 「用電腦模擬同一道題在兩種表徵下的求解過程（一道滑輪題、一道幾何題），不是受試者實驗」 | 兩個主例是滑輪題（第 2 節）與幾何題（第 3 節，OPS5 實作，L1445）；沒有受試者。原文只對幾何題寫明用 OPS5 程式產生（L1445–1448）；滑輪題以半形式記號寫出規則與步驟（L303–305、Table 2），沒有說是否由程式執行；另有第 4 節三個非形式例子 | 大致一致。「用電腦模擬」對滑輪題沒有原文依據，較穩的寫法是「以產生式系統模擬」 |
| 118 | 「圖和文字可以裝一樣的資訊，差別在使用時的計算成本」 | L1793–1794「not because they contain more information, but because the indexing of this information can support … efficient computational processes」；資訊等價的定義 L88–95 | 一致 |
| 120 | 「一起用的資訊放在相鄰的位置，省掉搜尋」 | L1769–1771「group together all information that is used together, thus avoiding large amounts of search」 | 一致（原文用 group together，「相鄰」是轉述，可接受；L1776–1777 也說 same or adjacent locations） |
| 121 | 「同一個元素的資訊聚在同一個位置，不必比對符號標籤」 | L1772 | 一致 |
| 122 | 「支援很多容易的知覺推論」 | L1773「automatically support a large number of perceptual inferences, which are extremely easy for humans」 | 一致（漏了 automatically，不影響意思） |
| 124 | 「他們接著寫了兩個但書，題目裡那個『有時候』就是為此而加」 | 兩個但書確實緊接在後（L1774–1798）。但原文**沒有說明題目「Sometimes」的由來** | 「就是為此而加」是文章的推論，原文沒寫，應改成「（我的理解）」或刪掉因果 |
| 126 | 引句「None of these points insure that an arbitrary diagram is worth 10,000 of any set of words.」 | 印刷頁 98 頁面圖逐字相同（含原文 insure 拼法） | 一致 |
| 128 | 「以及，圖只對知道怎麼用它的人有用」 | L1794–1796「diagrams are useful only to those who know the appropriate computational processes for taking advantage of them」 | 一致。原文同一段還說「也要知道怎麼畫出好圖」（L1796–1798），文章沒提，不算錯 |
| 130 | 「落到選圖（我的推論）：…看讀者是不是要反覆回頭找東西，或同時比對好幾個元素」 | 已標推論；與原文「搜尋」「同一位置群組」方向一致 | 標示正確 |
| 406 | 「以產生式系統模擬，比較語句式與圖解式表徵。我讀了摘要、引言與結論，中間的模擬細節沒有讀」 | 描述正確 | 讀取範圍的自述已過時：本紀錄已讀全文，可改寫 |
| 446 | 參考資料：連結 https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/j.1551-6708.1987.tb00863.x ；「讀了摘要、引言與結論」 | 連結已是 Wiley 出版者免費版（清單「要換連結」一項已處理）；書目與題名正確 | 連結合規；讀取自述同上 |

## 讀取紀錄

- 依序讀 txt：L1–480、L481–1000、L1001–1500、L1501–1850（檔尾），首尾相接涵蓋全文；參考文獻 L1800–1844 掃過。
- 對 PDF 頁面圖：Table 2（PDF 頁 13，印刷頁 77）逐列看過總數 138 與七欄 25／7／20／19／14／22／31；結論節（PDF 頁 34，印刷頁 98）看過三個優勢與「10,000」引句。Table 1、3、4、5、6 是符號式資料結構，沒有被文章引用，只在 txt 讀過。
