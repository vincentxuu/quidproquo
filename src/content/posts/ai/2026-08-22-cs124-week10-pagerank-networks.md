---
title: "CS124 Week 10 PageRank and Social Networks：從 anchor text、圖中心性到課程收束"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, pagerank, social-network, graph]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 11 }
tldr: "Week 10 以 anchor text、PageRank 與 centrality 分析 Web graph；post-training、多語與 speech 只歸於檔名及內容標示 2025 的公開 final deck outline，不歸為 2026 現場內容。"
description: "Stanford CS124 Winter 2026 Week 10：web graph、anchor text、PageRank、centrality、clustering、power laws，以及 final lecture 的公開 agenda。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week10-pagerank-networks-en)

CS124 最後一週離開單篇文件與單一使用者，把 Web 和社會關係看成圖。[官方課表](https://web.stanford.edu/class/cs124/lec/)列出 Web graphs、links、PageRank、social networks 與 3 月 10 日 required live final lecture。另有一份[標示 2025 的公開 final deck](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf)，它只能支持該 deck 的 post-training、多語與 speech outline，不能替代未錄的 2026 現場內容。

**版本：** Winter 2026。**單元：** Week 10，2026-03-10、03-12。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[Web and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf)、[Social Networks slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf)、[final lecture slides](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf)、[Easley–Kleinberg Networks book](https://www.cs.cornell.edu/home/kleinber/networks-book/)。**缺口：** final lecture 未錄影；final deck 檔名是 2025，不能證明 2026 現場逐頁相同；指定 information-retrieval reading 的 ebrary 連結需要權限。因此本文分開處理公開預錄 agenda 與只能確認 outline 的 final lecture。

## Web 不只是文件集合，也是 directed graph

把 webpages 當 nodes、hyperlinks 當 directed edges，就能使用文字以外的訊號。公開 [Web and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf) 提出兩個工作假設：連結代表作者認為目標頁相關，anchor text 描述 target page。這些是假設，不是自然定律；spam、navigation templates 與商業操作都可能破壞它們。

anchor text 特別有用，因為 target page 可能是圖像首頁，自己很少出現辨識詞；其他頁指向它的文字卻可能反覆寫出品牌或功能。索引文件 `D` 時加入 incoming links 的 anchor text，就把外部描述納入 retrieval representation。

## PageRank 用遞迴重要性排序 nodes

只數 in-degree 會把每條 incoming link 視為相同。PageRank 的直覺是：被重要頁面連結更重要，而重要頁面本身由其他重要連結定義。random-surfer model 把 rank 寫成在 graph 上的 stationary probability。

轉移矩陣要處理 dangling nodes 與封閉子圖。teleportation 以某個機率跳到任意頁，讓 Markov chain 可達並避免 rank 永遠困在一群頁面。實作以 power iteration 反覆更新 rank vector，直到變化小於門檻。

這個分數衡量 link structure 中的 centrality，不等於內容正確、品質或道德價值。把 ranking signal 用到真實搜尋，還需與文字 relevance、freshness、spam defenses 等訊號結合。

## Social network 需要先說清楚 edge 是什麼

公開 [Social Networks slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf) 定義 graph `G(V,E)`：people 是 vertices，relationships 或 interactions 是 edges。friendship、citation、follow、conversation 可形成 directed 或 undirected graphs。若 edge 定義不同，同一批人會形成不同網路，也會得到不同 centrality。

degree 衡量直接連結數；directed graph 再分 in-degree 與 out-degree。betweenness 看一個 node 位於多少 shortest paths 上，對橋接群體的角色敏感。clustering coefficient 看鄰居彼此也相連的程度，描述局部群聚。

[Social Networks slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf) 也進入 power-law degree distributions：少數 nodes 有很高 degree，多數 nodes 很低。但在有限、抽樣或平台介入的資料上，看起來有長尾不等於已證明 power law。課堂主題能支持檢查 degree distribution，不能讓文章跳過模型檢驗就替任何平台下結論。

## Final lecture 的公開 outline

[檔名與內容標示 2025 的 final slides](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf) 首頁列出 post-training、instruction tuning、preference alignment、multilinguality、speech processing 與「What to do after CS124」。這足以確認收束範圍。由於 lecture 未錄影且 deck filename 指向 2025，本文不把 timeline 裡的每個模型或比較歸為 Winter 2026 現場明確講述。

這個 outline 和 Week 1 地圖形成對稱。第一週從元件列出整季路線，最後一週指出 pretrained next-token model 之外還有 post-training 與 alignment，並把學生導向後續專門課。CS124 的終點不是宣稱已完整掌握 LLM，而是能說出下一層問題屬於 speech、graphs、NLP deep learning、retrieval 或 language-model training 的哪一門課。

## 本週的完成線

用一個五-node directed graph 手算兩輪 PageRank，明示 teleportation 與 dangling node 做法。再替同一 graph 算 degree 與一個 node 的 clustering coefficient，說明兩種分數回答不同問題。最後回看 Week 1 component map，為十個 weeks 各寫一個可執行 artifact，而不是只列名詞。

## Graph representation 先固定方向與權重

同一組 nodes 可用 adjacency list 或 adjacency matrix 表示。sparse Web graph 適合 adjacency lists；小型手算用 matrix 較直觀。對 directed edge `A→B`，row／column convention 必須先寫清楚，否則 PageRank transition matrix 很容易轉置。

multi-edge、self-loop 與 edge weights 也要有規則。兩頁間多個 hyperlinks 是否算一次？社群互動次數是否成為 weight？slides 的概念圖不替每個 dataset 決定 preprocessing；實際分析需把 raw events 到 graph edges 的 mapping 寫進資料說明。

圖的時間窗同樣重要。十年累積 follow graph 與一天 conversation graph 回答不同問題。若將不同時期 edges 混在一起，centrality 可能只反映存活時間較長。版本化 node／edge list，才可能重跑 Week 10 metrics。

## Anchor text 建索引的手算例

假設 target page 只有圖像與品牌 logo，本頁 term frequency 幾乎沒有品牌描述；十個外部 pages 的 anchors 都寫出產品名稱。將 incoming anchor text 加入 target 的 index representation，query 才能找到它。

但 anchor 也可被操控。大量相同 anchors 可能是正常共同描述，也可能是 link spam。索引可保存 anchor source page、count 與 diversity，而不是將所有文字無差別複製。source quality 與 link graph signal 可在 ranking 階段另處理。

這和 Week 4 的 inverted index 直接相連：新增的不是另一套搜尋系統，而是 document terms 的外部來源。term-level score breakdown 應標示 self text 與 anchor text contributions，才能查明某結果為何上升。

## PageRank equation 與 transition matrix

令 `P` 為 column-stochastic transition matrix，`P_ij` 表示從 page `j` 到 page `i` 的機率。沒有權重時，page `j` 的 outgoing probability 平分給 outlinks。rank vector 更新可寫成 `r_{t+1}=αPr_t+(1-α)v`，其中 `v` 是 teleport distribution。

若採 row-stochastic convention，vector 乘法方向會改變；兩者都可行，但不能混用。每輪更新後 rank sum 應接近一，所有 entries 非負，這是最基本 sanity checks。

dangling node 沒有 outlinks，原 column 全零會讓 probability mass 消失。常見處理是把它視為依 `v` 分散到所有 nodes。teleportation 同時處理 spider traps 與 irreducibility，使 iteration 收斂到唯一 stationary distribution 的條件更穩定。

五-node 手算應列初始 uniform `r_0`、每輪 link contribution、teleport term 與 L1 difference。只列最後 scores 看不見 transition convention 或 dangling handling 是否正確。

## Power iteration 的停止與測試

每輪計算新 `r`，直到 `||r_{t+1}-r_t||` 小於 tolerance 或達 maximum iterations。tolerance 太鬆會提早停，太嚴增加成本；報 PageRank 時應記 `α`、initialization、tolerance 與 iteration count。

unit tests 可用三種小圖：所有 nodes 對稱的 cycle 應得 uniform rank；一個 central sink 加 teleportation 應有較高但非全部 rank；含 dangling node 的圖仍應保持總和一。這些 invariants 比拿大型 Web 結果肉眼判斷有效。

PageRank 可 personalize，將 `v` 改成偏向某些 nodes；這是原 equation 的直接延伸，但若課程 reading 只要求標準版本，文章應把 personalized PageRank 標為延伸，不當作 live lecture 內容。

## Degree、betweenness、clustering 各回答什麼

degree 是局部連結數。directed graph 的 in-degree 可表示收到多少 links，out-degree 表示指向多少 nodes。degree 高的 node 不一定是群體間橋樑。

betweenness 計算經過某 node 的 shortest paths 比例。位於兩個 dense clusters 中間、degree 不高的 node 仍可能有高 betweenness。計算時要說 graph 是否 directed、weighted，以及多條同長 shortest paths 如何分配 credit。

local clustering coefficient 對 undirected node 比較鄰居間實際 edges 與可能 edges。degree 小於二時 denominator 為零，需要約定輸出零或 undefined。directed／weighted clustering 有不同定義，不可和基本公式混報。

用同一圖並排列出三個 measures，能看到「popular」「bridge」「embedded in clique」不是同一性質。把 centrality 寫成單一排名會丟掉這個差別。

## Power law claim 需要比 log-log 直線更多

degree histogram 在普通座標可能有長尾，在 log-log 圖上看似直線。但 binning、有限樣本與 minimum degree 都會影響形狀。slides 引入 power laws，並不等於每個社群網路都已證明符合。

較負責任的流程是報 node/edge count、sampling 方法、degree range，估計候選 tail 的 exponent，再和 log-normal 或其他 heavy-tail alternatives 比較。本文不新增特定平台數值，只說明要支持 power-law claim 需要哪些 evidence。

抽樣偏差尤其危險。由少數 seed 做 network crawl，容易漏掉遠端低-degree nodes；API 限制也可能截斷 high-degree neighbor lists。觀察到的 distribution 同時是社會結構與蒐集方法的產物。

## Final lecture deck 的逐項邊界

[公開 final-deck outline](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf) 支持六個 labels：post-training、instruction tuning、preference alignment、multilinguality、speech processing、後續課程。timeline pages 列許多模型名稱，但 filename 與內容標示 2025；沒有錄影，不能確認 2026 現場選了哪些 examples 或下了什麼比較結論。

可以安全說明概念關係：pretraining 後仍需讓模型遵循指令與偏好；multilingual 與 speech 擴大輸入輸出範圍。不能安全寫「Jurafsky 在 Winter 2026 認為某方法勝過另一方法」，除非 slide 明文且版本一致。

[final deck](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf) 還提醒 PA7 submission 與後續課程。這使 Week 10 同時是 graph unit 與 course handoff。文章將兩者分節，避免拿 wrap-up LLM timeline 取代 PageRank／networks 的正式預錄 agenda。

## 十週 artifact audit

Week 1 environment record；Week 2 tokenizer merges、edit alignment、n-gram table；Week 3 classifier weights／errors；Week 4 index／rankings；Week 5 embedding probes；Week 6 curves／gradients；Week 7 attention tests／samples；Week 8 audio／transcript error table；Week 9 recommender／tool traces；Week 10 graph／PageRank calculations。

每個 artifact 都要含 input、version、parameters、output 與 failure。這份 audit 不替代 formal quizzes 或 autograders，卻能機械確認逐週系列真的涵蓋十個官方 units，而不是只有十篇概念摘要。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Web and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf)
- [Social Networks and Power Laws slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf)
- [CS124 final lecture slides](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf)
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/)
