# 抽取紀錄：Kucia & Gawlik (2026) Beyond Benchmark Scores: How Synthetic and Authentic Query Distributions Diverge in RAG Evaluation

read_status=full（arXiv v1 PDF 全文，兩種 pdftotext 版式對照讀完；表格數字以非版式輸出核對）

## 書目

- Filip J. Kucia（Warsaw University of Technology；Sparrows AI sp. z o.o.）、Barbara M. Gawlik（Warsaw University of Technology）。
- CIKM '26（35th ACM International Conference on Information and Knowledge Management），2026-11-07–11，Rome。6 頁 short paper。DOI: 10.1145/3799682.3839970。CC BY 4.0。
- arXiv:2609.14579 v1（2026-09-13），cs.IR。
- 讀取方式與全文檔（scratchpad/fulltext/）：curl https://arxiv.org/pdf/2609.14579（559,267 bytes）→
  - pdftotext -layout → o11-kucia2026.txt（451 行、60,626 bytes），讀 1–230（雙欄版式，到 4.2 節與 Figure 1）。
  - pdftotext（無版式）→ o11-kucia2026-raw.txt（911 行、38,555 bytes），讀 440–790（Figure 1–2 說明、4.2 後半、4.3、Table 3、4.4、§5、§6、致謝、GenAI 揭露）及參考文獻 [7][13][19][26]。兩檔合起來涵蓋全文。

## 研究設計

- 單一案例：MiNIonek，華沙理工數學與資訊科學學院的行政聊天機器人（課表、獎學金、課綱、行政程序）。語料是學院官網頁面與 PDF。
- 合成題：用 Google Gemini Notebook（舊名 NotebookLM）預設介面生成 1,851 題，來自 165 個來源。作者明說這是「實務者常見流程」，不是受控的生成器。
- 真實題：部署前問卷，89 位在學學生，去重後 322 題。
- 標註：兩位熟悉語料的領域專家（同學院學生），每題由其中一人標，跨流程的題目兩人共同檢視。無法對應單一靜態頁面的題目標為「不可直接評估」。
- 檢索設定：bge-m3 嵌入；ChromaDB（dense）、Qdrant（dense）、Qdrant（hybrid＝dense＋BM25）。

## 可引用結果（行號 L＝layout 檔、R＝raw 檔）

1. 題目長度（Table 2；L 行 185–203、R 4.2 節）：合成題平均 15.7 字（中位數 15），真實題平均 6.8 字（中位數 6）。Mann–Whitney U p < 0.001，Cliff's δ = 0.917。→ 15.7 / 6.8 ≈ 2.3 倍。
2. 來源覆蓋（Table 2）：合成題涵蓋 165 個來源，真實題（有來源者 165 題）只涵蓋 53 個；單一最熱門來源（學年行事曆）占真實題 25.3%，前三名占 44.4%；合成題對應數字 5.5%、15.1%。
3. 意圖分布：合成題 Gini 0.37，真實題 0.59；JS divergence 0.203 bits。課表占真實題 27.0%，在合成題只有 8.3%；學年行事曆占真實題 7.5%，合成題 0%。
4. 不可直接評估（§4.4；R 行 600–610）："49% of authentic queries (157 of 322) could not be mapped to a single static source URL."——需要個人資料、需要語料裡沒有的即時資料、或太模糊。最常問的兩類（課表、課綱/選修）只有 47%、30% 能對應單一靜態頁面。作者原句："the benchmark is strongest where demand is weakest."
5. 檢索分數落差（Table 3；R 行 560–650）：Hit@5 從合成到真實下降 29–37 個百分點：
   - ChromaDB dense：0.820 → 0.527，延遲 0.33 s/題
   - Qdrant dense：0.849 → 0.545，1.57 s
   - Qdrant hybrid：0.896 → 0.527（ΔHit@5 = −0.369，95% CI −0.44 到 −0.29），2.70 s
   - 控制類別後仍顯著（CMH p < 0.001）；7 個最大類別中 6 個下降，例外是課表。
6. 「8 倍延遲」的確切意思（R 行 585–595）："within the same backend, hybrid retrieval scores 0.527 on authentic queries against 0.545 for dense alone, at 1.7× the latency (2.70 s versus 1.57 s per query), and 8× that of the fastest configuration."——8 倍是 2.70 s 對 ChromaDB dense 的 0.33 s（不同向量資料庫）；同一個 Qdrant 裡 hybrid 對 dense 是 1.7 倍。
7. 題數不是原因（4.2 "Effect of set size"）：從合成題抽 165 題、重抽 1,000 次，Hit@5 仍是 0.896 ± 0.023、最低 0.824；類別分布與全體合成題的 JS divergence 只有 0.016 bits。165 題已涵蓋 17 類中的 93%。→ 多生成合成題只會多覆蓋文件，不會多出真實使用者的意圖。
8. 只回傳最熱門五頁就能在真實題拿到 Hit@5 0.545（合成題 0.233）——分數有一部分來自題目集中，不是檢索能力。
9. 作者的部署前清單（§5）：(1) 生合成題驗廣度；(2) 向目標使用者或代理人收 50–100 題真實題（不需正式標註）；(3) 比對意圖分布、長度、來源覆蓋、可評估性；(4) 依真實題輪廓定檢索架構；(5) 對答不了的題訂拒答與轉真人規則。

## 可引用原句

- "Our results are not an argument against synthetic evaluation."（§5）
- "Synthetic questions are generated from existing documents and are answerable by definition."（§3）
- "a synthetic-only comparison selects the slower architecture."（§6）

## 作者自列限制（§5 Limitations）

- 問卷題不等於上線後真實流量；題目極短可能部分來自問卷疲勞。
- 322 題來自 89 人，不完全獨立，但檢定當作獨立。
- 合成題只用 Gemini Notebook 預設介面一種流程。
- （本紀錄補充）單一學院、單一語言情境；每題只由一位標註者標，未報告標註者間一致度。

## 與摘要或範圍卡不一致處

1. 範圍卡「合成題比真實題長一倍多」：15.7 vs 6.8 字，2.3 倍，說法成立（「長一倍多」＝超過兩倍，正確）。
2. 範圍卡「會挑出延遲 8 倍的架構」：不精確。8 倍是相對「測過最快的設定」（另一個向量資料庫 ChromaDB 的 dense），不是相對同一系統的替代方案；同一後端內 hybrid 只比 dense 慢 1.7 倍。而且三種設定在真實題的 Hit@5 幾乎一樣（0.527–0.545）。建議改寫為：「只看合成題會選到 hybrid 檢索，它在真實題上沒有比較準，卻比同一資料庫的純向量檢索慢 1.7 倍、比測過最快的設定慢 8 倍」。
3. 摘要說 "costing up to 8× the latency of the fastest configuration we tested"——摘要本身用了 "up to" 與 "fastest configuration"，是轉述時把限定詞丟了。

## 對 order 11 的用法

- 「合成題要人驗證並混入真實問題」的主證據；也是「題庫要含文件答不了的題」的實證：真實題 49% 不能對應單一靜態頁面。
- 可借用作者清單第 2 步「收 50–100 題真實題」當題數參考——這是作者在單一案例後的建議，不是統計推導。
