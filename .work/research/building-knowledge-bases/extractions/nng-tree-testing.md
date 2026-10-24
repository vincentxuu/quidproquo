# NN/g — Tree Testing（Part 1, 2023/2026 複審）＋ Tree Testing Part 2: Interpreting the Results（2024）

read_status=read（兩篇正文從標題讀到參考文獻）

## 來源與讀取版本

- A. Laubheimer, P. (2023-08-06; 頁面標「Last reviewed Aug. 19, 2026」). *Tree Testing: Evaluate Menu Labels and Categories*（搜尋結果舊標題：Fast, Iterative Evaluation of Menu Labels and Categories）. https://www.nngroup.com/articles/tree-testing/
  - curl（200, 142,551 bytes）→ 擷取 article → pandoc → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/nng-tree-testing.txt`（243 行，23,948 bytes），讀完 L1–243。
- B. Laubheimer, P. (2024-01-19). *Tree Testing Part 2: Interpreting the Results*. https://www.nngroup.com/articles/interpreting-tree-test-results/
  - curl（200, 136,875 bytes）→ `.../fulltext/nng-interpreting-tree-test-results.txt`（224 行，17,227 bytes），讀完 L1–224。
- 讀取日期：2026-10-22。

## 主張／發現

皆為**作者建議**；B 引用 Albert & Tullis（*Measuring the User Experience* 3rd ed., 2023）對 98 個 tree test 的彙整，這是唯一一處二手實證數字。

### 怎麼做（A）

1. **定義**（A L38）：「Tree test: An evaluation of a hierarchical category structure, or tree, by having users find the locations in the tree where specific resources or features can be found.」只需準備樹與任務，不需版面或內容（A L42–45）。
2. **樹要建到最底層**（A L57）：「define your tree down to the lowest level of subcategories that will contain the resources you will ask study participants to find.」
3. **任務類型**（A L77–81）：關鍵資源任務、「sleight-of-hand」任務（找不常用但能測父類別資訊氣味的東西；例：intranet 中找捐款配對計畫，以比較 HR 類別名 People／HR／Policies and Procedures）、潛在問題區（含卡片分類中分歧大的類別）、標籤／位置比較、暖身任務（也用來篩掉亂答者）。
4. **每題要先定正確答案**（A L83），工具據此算成功率。
5. **措辭**（A L89 與 L93–107 表格）：不要用標籤原字（「Find information about starting a business」會洩題）；也不要寫成長故事（使用者不細讀）；範例好題：「You are considering opening a lawn-care service. See if there are any resources on this site that can help you begin the process.」
6. **多棵樹要 between-subjects**（A L115）；只比較同一標籤放哪裡（番茄放 Fruits 或 Vegetables）不需要兩棵樹，看點擊分布即可（A L113）。
7. **質化 vs 量化**（A L127–140）：質化只需少數人、通常有主持、不適合算統計；量化需要較大樣本；量化前先做小規模質化試跑。
8. **與卡片分類分工**（A L150–152）：卡片分類是生成法，tree test 只用來評估。卡片分類常出現「其他」類，但放進選單使用者會「avoid it like the plague」。
9. **建議流程**（A L162–166）：既有網站易用性測試 → 卡片分類生出選項 → tree test 決定骨架。「you should always test the hierarchy that emerged from a card-sorting study」（A L159）。
10. **限制**（A L179–201）：無主持時沒有脈絡（建議先做幾場有主持的 pilot；例：pilot 中發現使用者因某標籤太廣怕內容太多而避開，量化結果因任務順序隨機化看不出來，L187）；**正確答案只能是葉節點，不能是有自己頁面的分支**（L191–199）；沒有搜尋、沒有視覺設計，mega menu 情境差異大（L205–207）。

### 量什麼、怎麼判讀（B）

1. **指標**（B L41–49）：成功率、直達率（directness，沒有回頭）、耗時；以及各類別點選頻率、first click、最終落點。
2. **成功率基準**（B L67–73，二手實證）：「Bill Albert and Tom Tullis reviewed 98 tree-testing studies. They found that the median success rate for tasks was 62%, with the interquartile range from 37% – 83%.」分級：<40% 差、41–60% 普通、61–80% 好、80–90% 很好、>90% 優秀。
3. **最好的參照是自己過去的資料**（B L75）；關鍵任務應 >90%（B L77）。
4. **tree test 成功率常低於成品**（B L83，作者判斷）：「A 67% success rate on a tree test could easily become a 90% success rate on the final design.」前提是其他設計做得好；爛搜尋或爛選單也可能更低。
5. **深度不同的任務不要直接比**（B L90–101）：找州立圖書館（4 層）67% vs 找食物券規定（7 層）43%。
6. **直達失敗最糟**（B L120）：「they could confidently go to the wrong place, with no backtracking」。
7. **first click 很關鍵**（B L132）：「The first click is critical because it often predicts whether a user will be successful」；例：正確頂層 Directory 只拿到 14% first click，該題成功率 20%（B L138）。
8. **多重歸類（polyhierarchy）只在資料支持時用**（B L157–159）：例如 30% 找 Fruit、30% 找 Vegetables 才兩邊都放。
9. **比較多棵樹的樣本數**（B L171）：「Typically, 50+ participants per tree are needed for a quantitative study to achieve reasonably narrow confidence intervals」；工具通常不幫你做顯著性檢定（B L175–177：二元指標用 N−1 two-proportion test，時間用 t test，三棵以上 ANOVA）。
10. **行動對應**（B L185–186）：first click 分散 → 多處列出，若很多題都如此就換組織方式；first click 對但成功率低 → 子類別標籤要更有區隔。

## 可引用結果與原句

- A L38 定義；A L150「Tree testing, on the other hand, is a method solely used for evaluating a potential navigation hierarchy」。
- B L67 Albert & Tullis 98 個研究中位數 62%、IQR 37–83%。
- B L171 「50+ participants per tree」。
- B L132 first click 預測成功。

## 限制

- 兩篇都沒有給**單一棵樹**量化 tree test 的人數建議；只有「質化少數人」與「比較多棵樹每棵 50+」。
- 98 個研究的彙整出自 Albert & Tullis 的書，NN/g 沒有說明研究來源與任務難度分布；我沒有讀那本書。
- A 的 sleight-of-hand 例子與 pilot 例子都是作者個人專案軼事。

## 與常見轉述不一致處

1. **「NN/g 建議 tree test 用 50 人」**（例：UserTesting 部落格說「the Nielsen Norman Group recommends 50 participants per tree test」）：NN/g 原文的 50+ 是**比較多棵樹、要做顯著性檢定時每棵樹**的數字（B L171），不是所有 tree test 的通用門檻；A 對質化 tree test 只說「only a few participants」（A L131）。
2. **「tree test 成功率 = 成品成功率」**：NN/g 自己說 tree test 去掉搜尋、相關連結和視覺線索，成功率通常偏低（B L79–83）；MeasuringU 2013 的初步實驗（Target、Ikea，20 題中 17 題 tree test 較高）卻是相反方向——兩邊的說法並不一致，引用時要並陳。
3. **「tree test 結果跟用什麼工具無關」**：Kuric et al. 2025 發現不同工具的介面變體會顯著改變回頭行為與部分題目的成功率（見 `kuric-2025-tree-testing-variants.md`）；NN/g 兩篇沒有談這點。
4. Kuric 2025 的參考文獻把 Part 2 標為「Whitenton (2017)」，但目前頁面作者是 Laubheimer、日期 2024-01-19；可能是舊版改寫，引用時以現行頁面為準並註明日期。

## 讀取紀錄

- 2026-10-22 curl A、B → pandoc；Read A L1–243、B L1–224。exa 搜尋另讀到 NN/g Cardello 2014〈Low Findability and Discoverability〉的摘錄（direct／indirect success、first click），僅搜尋摘錄，未讀全文，不列入。
