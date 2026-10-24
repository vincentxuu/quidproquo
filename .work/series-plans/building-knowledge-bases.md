# 系列規劃：知識庫怎麼建（building-knowledge-bases）

使用者確認：2026-10-21

研究筆記：`.work/research/building-knowledge-bases/research-note.md`（母群、覆蓋矩陣、偏誤、來源讀取狀態）。本表「對應來源」只列讀過正文（✅）或明確標示只讀到摘要（🟡）的來源。

## 為什麼寫

站上 RAG 單項技法很多（「RAG 技法大全」約 50 篇、「Ask AI 實戰」4 篇、llm-wiki 2 篇），但都假設讀者手上已有一份乾淨語料。沒有一篇從零講「要收什麼、怎麼整理、怎麼找、誰來維護」。個人知識管理與團隊 wiki 完全沒寫。使用者 2026-10-16 選擇三種都寫，拆成總覽＋三段。

## 目標讀者

- 想開始整理自己的筆記、或筆記越積越多卻找不到東西的人（A 段）。
- 團隊裡被指派「把文件整理一下」、或負責內部 wiki 的工程師／PM（B 段）。
- 要替 RAG／AI 助理準備知識庫的工程師，會寫程式但沒處理過真實企業文件（C 段）。

不需要先懂 embedding 或向量資料庫；C 段用到的技術概念在篇內用一兩段講直覺，細節連回既有文章。

不寫給：要比較向量資料庫效能、調 retrieval 參數的人（那是 RAG 技法大全的範圍）。

## 入口

order 0 是總覽：知識庫是什麼；三種知識庫的差別在「讀者是誰」（未來的自己、同事、模型）；不管哪一種都要回答四件事（收什麼、怎麼整理、怎麼找到、誰來維護）；三段各從哪篇開始、各讀到哪裡。讀完 order 0 可以直接跳段，每段第一篇只假設讀過 order 0。

## 弧線

一個系列分三段，讀者從一個人擴大到一群人，最後換成機器：

```
order 0 總覽
  → A 個人（讀者＝未來的自己）order 1–5
    → B 團隊（讀者＝同事）order 6–10
      → C AI（讀者＝模型）order 11–19
```

骨架是四個問題，三段各走一次，每次加深一層：

| 問題 | A 個人 | B 團隊 | C AI |
|---|---|---|---|
| 收什麼 | 收集者謬誤、收了要處理（1） | 文件類型（6） | 題庫先行、來源盤點（11、12） |
| 怎麼整理 | 放哪裡 vs 怎麼連（2、3） | 資訊架構、寫作規範（7、8） | 解析、安全、metadata、切塊（13–16） |
| 怎麼找到 | 搜尋 vs 導覽的研究（2）、工具（4） | 搜尋紀錄分析（10） | 檢索與權限過濾（16、17） |
| 誰來維護 | 每週回顧（5） | owner、驗證到期、docs-as-code（9） | 增量同步、評估回流（18、19） |

排序原則：

- 動機先於方法：每段第一篇先講「為什麼會壞」。
- 可見先於不可見：A、B 段讀者看得到整頁文件；C 段才講模型只看到被切出來的片段。
- 一篇一個核心概念：「放哪裡」與「怎麼連」分兩篇；解析、安全、metadata、切塊、權限各一篇。
- 作者主張與研究證據分開寫：方法多半出自賣書賣課的作者，實證研究另成一段（見研究筆記「偏誤」）。
- C 段技術篇只講建知識庫時要做的決定，演算法細節連回 RAG 技法大全。

## 篇目總表

| order | 主題 | 聚焦問題 | 狀態 | 對應來源 |
|---|---|---|---|---|
| 0 | 總覽：三種讀者、四個問題 | 知識庫到底是什麼？我該從哪段讀起？ | 待寫 | 維基 PIM 條目（keeping／finding／維護活動模型）；Najork et al. 2024 Searching Personal Collections（個人收藏以找回為主） |
| 1 | 收什麼：收集不等於知識庫 | 為什麼存了一堆還是找不到？什麼值得收？ | 待寫 | zettelkasten.de Collector's Fallacy；維基 PIM（keeping 是訊號偵測）；GTD Weekly Review（收件匣歸零）；Najork 2024（不歸檔者記得更多）；數位囤積 scoping review 2026 |
| 2 | 放哪裡：PARA、Johnny.Decimal，與「到底要不要分類」 | 該建資料夾，還是全部丟著靠搜尋？ | 待寫 | Forte PARA；Johnny.Decimal 官方；Whittaker et al. CHI 2011 全文；Bergman et al. 2010 全文（資料夾深度與大小對找回時間的模型）；Bergman & Whittaker 2016 專書（🟡出版社說明）；Bergman & Dvir 2026（導覽偏好到 2026 仍成立，超級搜尋者例外）；Najork 2024（Lansdale 1988、Whittaker & Sidner 1996 的反面證據） |
| 3 | 怎麼連：Zettelkasten、Evergreen notes、MOC | 怎麼讓筆記長出新想法，而不只是存檔？ | 待寫 | Luhmann〈Communicating with Slip Boxes〉英譯；Luhmann 檔案館；zettelkasten.de 入門與 Ahrens 概念逐頁整理；Matuschak Evergreen notes；LYT MOC 定義；生成效應統合分析（Bertsch 2007）；Urry 2021 重複驗證 |
| 4 | 工具落地：Obsidian 與選型 | 用什麼工具？換工具時資料帶不帶得走？ | 待寫 | Obsidian 官方說明（資料存放、內部連結、反向連結、properties）；Notion 匯出官方說明（私人頁不匯出、callout 轉 HTML）；Ink & Switch local-first 2019（🔎 待讀原文） |
| 5 | 維護：回顧、漸進摘要、刪除，與 LLM 能接手什麼 | 系統怎麼不在三個月後荒廢？ | 待寫 | GTD Weekly Review；Forte Progressive Summarization；Chen et al. 2025（全自動 AI 筆記學得最少）；Microsoft 2025 CHI（越信任 AI 批判思考越少）；Etkin 2025（AI 幫低能力者、傷高能力者）；Melumad & Yun 2025（LLM 摘要學得較淺）；站內 llm-knowledge-vault、llm-knowledge-management-landscape |
| 6 | 團隊知識庫為什麼會爛掉，以及要寫哪幾種文件 | 為什麼公司 wiki 總是過時、找不到、沒人寫？ | 待寫 | Grudin & Poole 2010 全文；Aghajani ICSE 2019 全文；Stack Overflow Developer Survey 2024 與 2025；Stocker & Tochtermann 2011（企業 wiki 成功案例，反證）；Galan 2023（離職知識流失回顧 91 篇）；Diátaxis；GitLab handbook-first |
| 7 | 資訊架構：按讀者的任務組織 | 頁面要怎麼分層、命名，新人才找得到？ | 待寫 | NN/g 卡片分類（2024）；NN/g 樹狀測試（2023）；GitLab handbook 頂層結構 |
| 8 | 寫給同事看：模板、ADR 與「最小可用文件」 | 怎麼讓每個人寫的文件長得差不多、看得懂？ | 待寫 | Nygard ADR 原文；ECSA 2024 ADR 行動研究；Google docguide best practices；Diátaxis 四種文件 |
| 9 | 維護責任：owner、驗證到期、docs-as-code 與刪除 | 文件誰負責？多久檢查？什麼時候刪？ | 待寫 | Grudin & Poole 2010（整理者離開後 wiki 長雜草）；Google docguide（刪死文件）；Write the Docs docs-as-code；Notion 驗證頁面；GitLab handbook-first；KCS v6；Tan, Wagner & Treude 2024（多數專案曾有過時程式引用）；Galan 2023 |
| 10 | 找得到：搜尋紀錄分析與缺口，以及第二種讀者 | 同事搜不到，是沒寫還是寫了找不到？AI 也開始讀團隊文件時要注意什麼？ | 待寫 | NN/g 搜尋紀錄分析；llms.txt v2；AGENTS.md；Agent READMEs 2025（2,303 份 context 檔）；ETH Zurich 2026（context 檔不提高成功率、成本增 20%） |
| 11 | 給 AI 讀的知識庫差在哪：先寫題庫 | 人看得懂的 wiki，AI 為什麼還是答錯？動手前先做什麼？ | 待寫 | Barnett 2024 Seven Failure Points 全文；Azure RAG preparation phase；Azure RAG 設計系列總覽；Kucia et al. CIKM 2026（合成題 vs 真實題）；Anthropic contextual retrieval 2024（<20 萬 token 可直接放 prompt）；Karakurt & Akbulut 2026 企業 RAG 回顧；站內 rag-failure-modes、retriever-silent-failure |
| 12 | 盤點來源：收哪些、信哪個版本 | 一堆共用硬碟和舊版文件，哪些該進知識庫？ | 待寫 | Azure preparation phase（內容分析、代表性內容）；Google RAG Engine 連接器；OWASP LLM08（知識衝突）；Xie et al. ICLR 2024；VersionRAG 2025 |
| 13 | 解析與清洗：PDF、表格、掃描檔 | 文件轉成文字時，哪些內容會悄悄壞掉？ | 待寫 | Santos et al. 2026 From PDF to RAG-Ready（資料準備是決定性因素、表格題差 33 個百分點）；OmniDocBench CVPR 2025（🔎 待讀原文）；OHRBench ICCV 2025；InduOCRBench 2026；Azure chunking phase（版面分析）；Docling；站內 table-serialization-rag、colpali、vision-pdf-parse |
| 14 | 安全：個資與藏在文件裡的指令 | 收進知識庫的文件，會不會洩漏個資或反過來指揮 AI？ | 待寫（新增） | Slack AI 事件（PromptArmor 原文）；EchoLeak 案例研究；ConfusedPilot；OWASP LLM08 情境 1；Azure enrichment phase（內容不可當指令）；NVIDIA FACTS（prompt 守規不可靠）；CaMeL 2025；Pai 2026（防禦效果依模型而異）；Presidio |
| 15 | 結構與 metadata | 除了內文，每份文件還要記錄哪些欄位？ | 待寫 | Azure enrichment phase；AWS `.metadata.json`；OpenAI attributes 與 filters；LinkedIn KG-RAG 2024（結構化工單，解決時間 -28.6%）；Anthropic contextual retrieval 2024；站內 contextual-retrieval |
| 16 | 切塊與索引：要做的三個決定 | 文件要切多大、用什麼搜？怎麼知道選對了？ | 待寫 | Azure chunking phase（半永久選擇）；OpenAI 預設切塊；Qu et al. NAACL 2025 與 Bennani & Moslonka 2026（語意切塊不划算、overlap 無益）；站內 chunking-strategies、hybrid-search、bge-m3 |
| 17 | 權限：誰能查到哪份文件 | 怎麼確保 AI 不會把 A 部門的文件答給 B 部門？ | 待寫 | Azure security filter pattern；OWASP LLM08；Microsoft Copilot 治理藍圖（oversharing）；NVIDIA FACTS（上線前先做機密分級）；Microsoft 2025 participant-aware access control；RAG 安全綜述 2026；Microsoft Graph connectors 與 Amazon Q Business 的 ACL 同步說明；Filtered ANN 2026（過濾後召回） |
| 18 | 更新與刪除：知識庫怎麼不過時 | 文件改了、刪了，知識庫怎麼跟上？ | 待寫 | AWS Bedrock KB sync；Google RAG Engine 去重；OpenAI 刪除最終一致；Microsoft Graph 增量 vs 完整爬取；Stale-document poisoning 2026；VersionRAG 2025；站內 ask-ai-indexing-pipeline |
| 19 | 評估與上線：怎麼知道它好用 | 怎麼證明它答得對？上線後怎麼持續變好？ | 待寫 | Barnett 2024（只能在運作中驗證）；NVIDIA FACTS（測試週期、LLM 評審偏誤）；Azure 設計系列（評估階段）；TREC 2024 RAG LLM 評審（SIGIR 2025）；Kucia et al. 2026；站內 rag-evaluation-frameworks、private-corpus-retrieval-eval、ask-ai-retrieval-evaluation |

## 斷崖處理

| 位置 | 問題 | 處理 |
|---|---|---|
| 0→各段第一篇 | 讀者可能直接跳段 | order 1、6、11 開頭各用一段補上該段的總覽，不假設讀過前一段 |
| 2→3 | 「放哪裡」與「怎麼連」常被當成二選一 | order 3 開頭說明兩者解決不同問題，可以並用（dsebastien 的實際系統就是混用） |
| 2 | 研究結論（歸檔不比搜尋好）與 PARA 作者主張看似矛盾 | 分兩節寫：作者主張什麼、研究量到什麼；說清楚研究對象是 email 與檔案系統，不是筆記軟體 |
| 5→6 | 個人系統直接搬到團隊會壞 | order 5 結尾點出：讀者換成別人，「我知道這是什麼意思」就不成立；order 6 從這裡接 |
| 10→11 | 從給人看跳到給模型看 | order 10 結尾：同事開始改用問的；order 11 開頭說明 B 段寫好的文件正是 AI 知識庫最好的原料 |
| 13→16 | 解析、安全、metadata、切塊、embedding 一起出現，技術密度最高 | 每篇只講一個決定；embedding 在 order 16 用一段直覺說明，細節連回「認識 AI 模型」Embedding 篇 |
| 19 | 評估名詞（recall@k、groundedness）首次出現 | 用 order 11 的題庫實例算一次，公式折疊 |

## 範圍卡

```
Order 0：知識庫怎麼建：三種讀者、四個問題
  聚焦問題：知識庫到底是什麼？我該從哪段讀起？
  邊界：
    - 講：知識庫與收藏的差別；三種讀者；四個問題（對應 PIM 研究的 keeping／finding／維護）；三段地圖與讀法
    - 不講：任何具體方法
  讀完後讀者能：說出自己要建的是哪一種知識庫，並知道從哪篇開始讀
  例子：同一份「年假怎麼請」放在個人筆記、公司 wiki、AI 助理時各會遇到什麼問題
  自我檢查：「把 300 篇網路文章存進 Notion」算不算知識庫？→ 判準：有沒有回答「怎麼整理」與「誰維護」
  前置：無
  連結：llm-knowledge-vault、rag-patterns-complete-guide
```

```
Order 1：收什麼：收集不等於知識庫
  聚焦問題：為什麼存了一堆還是找不到？什麼值得收？
  邊界：
    - 講：收集者謬誤（知道有這個 ≠ 知道這個）；keeping 是訊號偵測，有漏收與多收兩種錯；收件匣與處理頻率（縮短「收集→閱讀→吸收」循環、收件匣歸零）
    - 不講：分類（order 2）、連結（order 3）、工具（order 4）
  讀完後讀者能：用判準決定一則資訊要不要收，並設定收件匣多久清一次
  例子：一週存下的 20 則連結，逐則套判準
  自我檢查：一篇「2026 十大 AI 工具」清單文值得收嗎？→ 看它有沒有你會再用、別處找不到、你有自己看法的內容
  前置：order 0
  連結：—
```

```
Order 2：放哪裡：PARA、Johnny.Decimal，與「到底要不要分類」
  聚焦問題：該建資料夾，還是全部丟著靠搜尋？
  邊界：
    - 講：PARA 依可行動性分四類與搬移時機；Johnny.Decimal 每層不超過 10 個、用編號固定位置；研究證據分兩種情境——email：Whittaker 2011，建很多資料夾的人找回不更成功（兩組都 88%），資料夾主要是在管待辦；檔案：Bergman 2010，資料夾淺（2.86 層）、小（約 12 個檔），越深越大越慢，Bergman & Dvir 2026 確認多數人至今仍偏好導覽；結論：分類要淺、要小，搜尋與導覽並用
    - 不講：筆記之間的連結（order 3）
  讀完後讀者能：判斷自己的資料該用容器分類、編號，還是靠搜尋，並把現有資料夾重分一次
  例子：「日本攀岩旅行」從 Project 到 Archive；同一批檔案用 PARA 與 Johnny.Decimal 的兩種樹
  自我檢查：「Python」該放 Area 還是 Resource？→ 有持續要維持的標準就是 Area，只是參考就是 Resource
  前置：order 1
  連結：—
```

```
Order 3：怎麼連：Zettelkasten、Evergreen notes、MOC
  聚焦問題：怎麼讓筆記長出新想法，而不只是存檔？
  邊界：
    - 講：Luhmann 原文的做法（固定編號、內部分支、連結與反向連結、索引只記少數入口、要好幾年才有臨界量）；原子筆記與用自己的話寫——支持它的是記憶研究的生成效應（統合分析 86 篇，效果量 0.40），不是 Zettelkasten 的直接實驗（目前沒有嚴謹的）；手寫比打字好的說法已被 2021 重複驗證推翻，不引（2024–2026 再搜仍無直接實驗）；Evergreen notes 的五原則；MOC 作為「地圖筆記」
    - 不講：工具操作（order 4）
  讀完後讀者能：把一段讀書摘要改寫成兩三則可互相連結的原子筆記，並建一張 MOC
  例子：讀一篇文章後的文獻筆記 → 兩則永久筆記 → 連到舊筆記 → 加進 MOC
  自我檢查：直接複製原文算永久筆記嗎？→ 不算，判準是用自己的話、脫離原文也讀得懂
  前置：order 1；與 order 2 可並用
  連結：—
```

```
Order 4：工具落地：Obsidian 與選型
  聚焦問題：用什麼工具？換工具時資料帶不帶得走？
  邊界：
    - 講：選型判準（檔案格式可攜、連結、搜尋、同步、離線）；Obsidian 的 vault＝本機 Markdown 資料夾、內部連結兩種格式、改名自動更新連結、反向連結、properties；Obsidian 專屬語法（block reference）在外部失效；Notion 等資料庫型工具的取捨——Notion 官方匯出：Markdown＋CSV，callout 轉 HTML，匯出者沒權限的私人頁不會匯出；local-first 七個理想（Ink & Switch，動筆前讀原文）
    - 不講：外掛大全
  讀完後讀者能：用選型判準評一個筆記工具，並在 Obsidian 實作 order 2、3 的結構
  例子：五個判準逐條比較 Obsidian 與 Notion，以及依官方說明各自匯出會掉什麼（2026-10-22 改：作者沒有 Notion 工作區可實測匯出，不貼實際匯出結果）
  自我檢查：工具停止服務時，你的筆記剩下什麼？→ 依匯出格式與專屬語法判斷
  前置：order 2、3
  連結：—
```

```
Order 5：維護：回顧、漸進摘要、刪除，與 LLM 能接手什麼
  聚焦問題：系統怎麼不在三個月後荒廢？
  邊界：
    - 講：每週回顧（GTD 的 Get Clear／Get Current／Get Creative 改成筆記版）；漸進式摘要只在「本來就要看」時加一層；刪除與封存判準；LLM 能做的（整理收件匣、建議連結、llm-wiki 編譯）與不該交給它的（用自己的話寫、判斷什麼重要）——證據：Chen et al. 2025，AI 全自動產生筆記時學得最少、給摘要片段讓人自己組時學得最多，但受試者最喜歡全自動；Microsoft 2025，越信任 AI 批判思考越少；Melumad & Yun 2025（7 個實驗、上萬人）LLM 摘要學得較淺；反證平衡：Etkin 2025，AI 工具幫低能力者、傷高能力者，不寫成「AI 一律有害」
    - 不講：llm-wiki 開源專案比較（連回既有文章）
  讀完後讀者能：排出一份 30 分鐘的每週回顧，並決定哪一步交給 LLM、哪一步留給自己
  例子：一次每週回顧的實際流程
  自我檢查：LLM 自動替每則筆記加標籤，有什麼風險？→ 標籤失去「我的分類」意義、錯了不易察覺
  前置：order 1–4
  連結：llm-knowledge-vault、llm-knowledge-management-landscape
```

```
Order 6：團隊知識庫為什麼會爛掉，以及要寫哪幾種文件
  聚焦問題：為什麼公司 wiki 總是過時、找不到、沒人寫？
  邊界：
    - 講：調查數字（Stack Overflow 2024：61% 每天花 30 分鐘以上找答案、30% 說知識孤島每週打斷 10 次以上）；三種爛法的研究——沒人用（Grudin & Poole 2010：66% 回覆者的 wiki 半年沒人用）、缺漏與過時（Aghajani 2019：內容問題裡不完整 268、過時 190、寫錯只有 72）、主管與寫的人要的不一樣（Grudin：主管要儀表板、寫的人要 FAQ）；反證：Stocker & Tochtermann 2011 的企業案例有效益，wiki 爛不爛看條件；人員離職造成知識流失有 91 篇實證回顧（Galan 2023）；個人系統搬到團隊為什麼不夠；Diátaxis 四種文件與羅盤；決策紀錄
    - 不講：頁面架構（order 7）、寫作規範（order 8）、維護制度（order 9）
  讀完後讀者能：把團隊現有文件分到四種類型，找出缺哪一類
  例子：一個團隊 wiki 首頁，逐項診斷
  自我檢查：「新人環境設定」該寫成 tutorial 還是 how-to？→ 看讀者是在學習還是在完成任務
  前置：order 0（讀過 A 段更好）
  連結：—
```

```
Order 7：資訊架構：按讀者的任務組織
  聚焦問題：頁面要怎麼分層、命名，新人才找得到？
  邊界：
    - 講：按組織圖 vs 按任務分類；GitLab 的頂層結構（公司／部門／日常）當參考；頁面命名；卡片分類法（開放式、30–50 張卡、至少 15 人）與樹狀測試（NN/g 2023：用文字樹驗證使用者找不找得到）
    - 不講：頁面內文怎麼寫（order 8）
  讀完後讀者能：替團隊 wiki 畫出兩層架構，用卡片分類找出讀者的分法，再用樹狀測試驗證（2026-10-22 改：卡片分類是生成法，驗證用樹狀測試）
  例子：同一批文件按部門分 vs 按任務分的兩種樹
  自我檢查：標題「Q3 會議記錄」好不好找？→ 不好，標題要說出讀者會搜的事
  前置：order 6
  連結：—
```

```
Order 8：寫給同事看：模板、ADR 與「最小可用文件」
  聚焦問題：怎麼讓每個人寫的文件長得差不多、看得懂？
  邊界：
    - 講：Google docguide 的最小可用文件、不重複寫別處有的指南；Diátaxis 各類型的寫法差異；ADR 的五個欄位與 superseded；ECSA 2024 行動研究：ADR 有助文件文化與知識傳承，放在哪裡影響有沒有人看；how-to 模板
    - 不講：誰負責維護（order 9）
  讀完後讀者能：替團隊寫出 how-to 與 ADR 兩份模板
  例子：一份改寫前後的 how-to；一份 ADR
  自我檢查：ADR 被推翻時該刪掉嗎？→ 不刪，標 superseded 並連到新決定
  前置：order 6、7
  連結：—
```

```
Order 9：維護責任：owner、驗證到期、docs-as-code 與刪除
  聚焦問題：文件誰負責？多久檢查？什麼時候刪？
  邊界：
    - 講：為什麼要有專人整理（Grudin 2010：最大的團隊 wiki 在整理者離開後荒廢，主管撤掉維護人力）；每頁一個 owner 與驗證到期（Notion 的做法當例子）；docs-as-code（文件跟程式碼同一個變更、可擋下沒附文件的合併）；GitLab「先寫再宣布、誰都能提案、DRI 核准」；KCS「在需求當下寫、被重用時才改」；Google「先刪確定錯的、預設刪除」；Tan 2024：GitHub 最熱門的 1,000 個專案中八成曾有文件引用已不存在的程式碼、Google 自家專案約三成（2026-10-22 改：原寫「3,000 多個專案多數」，多數只在熱門組成立）——過時是常態
    - 不講：搜尋（order 10）
  讀完後讀者能：替團隊訂一份維護規則表（文件類型 × owner × 驗證週期 × 刪除條件）
  例子：一張維護規則表與一次過期文件清理
  自我檢查：owner 離職了怎麼辦？→ owner 是角色不是人，交接清單要含文件
  前置：order 6–8
  連結：—
```

```
Order 10：找得到：搜尋紀錄分析與缺口，以及第二種讀者
  聚焦問題：同事搜不到，是沒寫還是寫了找不到？AI 也開始讀團隊文件時要注意什麼？
  邊界：
    - 講：拿 3–6 個月搜尋紀錄；前 1000 名查詢、零結果查詢、同一人連續查詢、最長查詢；分成「想要但找不到」「想要但不存在」「詞彙落差」；對策（同義詞、best bets、改標題、補文件）；紀錄含個資的處理（方法出自 NN/g 實務說明，不寫成研究結論）。第二種讀者：團隊開始寫給 AI 看的文件（llms.txt、AGENTS.md）；研究顯示這類檔案越加越亂（2,303 份分析）、整體不提高 agent 成功率且成本增 20% 以上（ETH Zurich 2026），只有具體指令有用——給 AI 的文件一樣要維護、要評估
    - 不講：RAG 知識庫怎麼建（order 11 起）
  讀完後讀者能：從搜尋紀錄找出前十個缺口並分類，並判斷團隊的 AGENTS.md 哪些內容該留
  例子：一份零結果查詢清單的分類
  自我檢查：大家搜「請假」找不到〈休假政策〉，該怎麼修？→ 標題或摘要加大家用的詞、設同義詞，不是先換搜尋引擎
  前置：order 7–9
  連結：hybrid-search-bm25-vector-rrf
```

```
Order 11：給 AI 讀的知識庫差在哪：先寫題庫（發布標題用「測試題」；2026-10-22 研究後修正：題庫是問題、出處段落、答案三欄；「延遲 8 倍」是相對測過最快的設定，同一資料庫內是 1.7 倍；20 題是作者訂的第一輪手寫量，實務常見約 100 題）
  聚焦問題：人看得懂的 wiki，AI 為什麼還是答錯？動手前先做什麼？
  邊界：
    - 講：模型看到的是被切出的片段，看不到導覽與上下文；RAG 的 7 個失敗點（Barnett 2024）與「只能上線後驗證」；C 段流程總圖；題庫＝問題＋出處段落＋答案，含文件答不了的題；題庫和內容分析平行做；合成題要人驗證，並混入真實問題（Kucia 2026：合成題比真實題長一倍多、會挑出延遲 8 倍的架構）；知識庫小於約 20 萬 token 時可以先不做 RAG（Anthropic 2024）
    - 不講：任何一步的實作細節（order 12–19）
  讀完後讀者能：在動手前寫出 20 題附出處與答案的題庫
  例子：一份 wiki 頁被切塊後，模型實際看到的三段文字
  自我檢查：同一個問題人找得到、AI 答錯，可能壞在哪三處？→ 沒收錄、切塊失去上下文、檢索沒排進前幾名
  前置：order 0（讀過 B 段更好）
  連結：rag-failure-modes、retriever-silent-failure、understanding-ai-models-finetuning-vs-rag
```

```
Order 12：盤點來源：收哪些、信哪個版本
  聚焦問題：一堆共用硬碟和舊版文件，哪些該進知識庫？
  邊界：
    - 講：來源清單（系統、格式、量、owner、更新頻率、存取限制）；內容分類與代表性抽樣；重複與多版本（OWASP 的跨來源知識衝突）；版本題 naive RAG 只對 58%（VersionRAG 2025）；連接器的靜默失敗（Google Drive 權限不足時不報錯）
    - 不講：解析（order 13）、權限設計（order 17）
  讀完後讀者能：填出來源盤點表，並決定第一批收錄範圍
  例子：一間公司的來源盤點表
  自我檢查：同一份規章有 2023、2025 兩版，都收嗎？→ 只收現行版；舊版要收就標版本與失效日期
  前置：order 11
  連結：private-corpus-pipeline 系列
```

```
Order 13：解析與清洗：PDF、表格、掃描檔
  聚焦問題：文件轉成文字時，哪些內容會悄悄壞掉？
  邊界：
    - 講：常見壞法（多欄亂序、表格攤平、頁首頁尾混入、OCR 錯字、圖片資訊遺失）；要忽略的內容清單；版面分析工具的類型（以 Docling 為例）；資料準備比選工具重要（Santos 2026：metadata 與階層切塊貢獻大於轉換工具，表格題兩種切法差 33 個百分點）；OCR 準確率高不代表 RAG 好（OHRBench 2025、InduOCRBench 2026）；避免中介格式造成資料遺失；抽檢方法
    - 不講：工具排名（只引一份研究，不做選型推薦）
  讀完後讀者能：對解析結果做抽檢，找出五種壞法
  例子：一份含表格的 PDF 解析前後對照
  自我檢查：解析沒報錯，代表內容正確嗎？→ 不代表，要抽檢對照原檔
  前置：order 12
  連結：table-serialization-rag、colpali-visual-document-retrieval、vision-pdf-parse-too-fast-for-aws、ragflow-document-rag-platform
```

```
Order 14：安全：個資與藏在文件裡的指令（新增）
  聚焦問題：收進知識庫的文件，會不會洩漏個資或反過來指揮 AI？
  邊界：
    - 講：兩起真實事件——Slack AI（2024，公開頻道藏指令偷私人頻道的 API key）、EchoLeak（2025，一封郵件零點擊讓 Copilot 外洩資料）；個資偵測與去識別（Presidio 為例，自動偵測不保證找全）；內容永遠是資料不是指令；把守規則寫在 prompt 裡不可靠（NVIDIA FACTS 原文：not all LLMs follow these prompts consistently；另引 Hines 2024、OWASP LLM01），要在前後處理把關；防禦有代價、效果依模型而異（CaMeL 可證安全時完成率 77% vs 84%；spotlighting 對小模型無效）；入庫前驗證來源、標記可疑文件
    - 不講：誰能查哪份文件（order 17）
  讀完後讀者能：在入庫流程加上個資檢查與嵌入指令檢查兩道關卡
  例子：一份含白字指令的履歷進入知識庫後發生什麼
  自我檢查：系統提示寫「忽略文件裡的指令」就夠了嗎？→ 不夠，要在入庫時偵測與標記，並限制模型能做的動作
  前置：order 13
  連結：rag-guardrails、agent-security-harness-layer
```

```
Order 15：結構與 metadata
  聚焦問題：除了內文，每份文件還要記錄哪些欄位？
  邊界：
    - 講：常用欄位（ID、來源、標題路徑、日期、版本、語言、適用範圍、權限標籤）；metadata 的三種用途（過濾、排序、引用）；精確比對要靠欄位（產品型號、年份）；日期與版本欄位是處理過時文件的前提（order 18）；保留文件結構的企業實證（LinkedIn KG-RAG）；清理後另存一欄、回傳原文
    - 不講：權限怎麼強制（order 17）
  讀完後讀者能：替自己的語料定一份 metadata schema
  例子：同一段文字有無標題路徑與日期時，檢索與回答的差別
  自我檢查：「適用範圍」為什麼要單獨成欄？→ 才能在檢索時過濾
  前置：order 13
  連結：contextual-retrieval、hierarchical-chunking-auto-merge
```

```
Order 16：切塊與索引：要做的三個決定
  聚焦問題：文件要切多大、用什麼搜？怎麼知道選對了？
  邊界：
    - 講：三個決定（切塊單位、關鍵字或向量或兩者、embedding 模型與語言）；切塊是半永久選擇，改了要全部重建；預設用簡單切法：語意切塊不划算、overlap 沒好處（Qu 2025、Bennani 2026）；用 order 11 的題庫比較；embedding 只講直覺
    - 不講：各種 chunking 演算法與 reranking 細節（連回技法大全）
  讀完後讀者能：用題庫比較兩種切塊設定，選出較好的一個
  例子：同一題在固定長度與按標題切兩種設定下的檢索結果
  自我檢查：繁中語料只用向量搜，可能漏掉什麼？→ 專有名詞、編號、代碼
  前置：order 11、15
  連結：chunking-strategies、hybrid-search-bm25-vector-rrf、bge-m3-embedding-model-selection、understanding-ai-models-embedding、zh-tw-embedding-rag-failures
```

```
Order 17：權限：誰能查到哪份文件
  聚焦問題：怎麼確保 AI 不會把 A 部門的文件答給 B 部門？
  邊界：
    - 講：檢索時過濾（文件帶群組 ID、查詢帶使用者群組）而不是生成後再擋；過濾會降低向量搜尋召回，要量過濾後召回（Filtered ANN 2026）；多租戶隔離；AI 不新增權限但會讓過寬權限變得找得到——上線前先整理 oversharing、做機密分級（Microsoft 藍圖、NVIDIA FACTS）；多人互動時內容要所有參與者都有權看（Microsoft 2025）；權限變更要跟著同步（Microsoft 增量爬取只抓新增、Amazon Q 要定期重新同步）
    - 不講：身分驗證系統怎麼建
  讀完後讀者能：說出自己的系統在哪一層過濾權限，並寫一題越權測試放進題庫
  例子：同一個問題，兩個權限不同的使用者應得的結果
  自我檢查：在 prompt 寫「不要回答機密內容」夠嗎？→ 不夠，模型看得到就可能說出來
  前置：order 15、16
  連結：rag-guardrails
```

```
Order 18：更新與刪除：知識庫怎麼不過時
  聚焦問題：文件改了、刪了，知識庫怎麼跟上？
  邊界：
    - 講：全量重建 vs 增量同步；用內容 hash 判斷變更；只改 metadata 時可不重算 embedding；刪除要傳播到所有索引，且可能最終一致；匯入失敗紀錄；同步延遲監控；為什麼要刪：過時文件會翻轉 30–37% 答案，要求「照文件答」時更高（Stale-document poisoning 2026）
    - 不講：特定雲服務的設定步驟
  讀完後讀者能：設計增量同步流程，並列出刪除要清哪幾處
  例子：本站 Ask AI 的增量索引流程
  自我檢查：來源刪了一份文件，向量庫還在，會發生什麼？→ AI 繼續引用已撤下的內容
  前置：order 15、16
  連結：ask-ai-indexing-pipeline
```

```
Order 19：評估與上線：怎麼知道它好用
  聚焦問題：怎麼證明它答得對？上線後怎麼持續變好？
  邊界：
    - 講：分開評檢索與回答；用 order 11 題庫跑檢索評估與答案評估；LLM 當評審有偏誤、人工評估不可省（NVIDIA FACTS；TREC 2024：GPT-4o 與人完全一致 56%，要人工校準）；越權題、答不了的題也要評；上線後失敗案例回流到文件 owner（接回 B 段 order 9）；題庫要定期對照來源更新
    - 不講：評估框架比較（連回既有）
  讀完後讀者能：跑一次檢索評估，並建立失敗案例回流到 owner 的流程
  例子：20 題題庫的一次評估結果與修正
  自我檢查：回答正確率高但檢索命中率低，代表什麼？→ 模型靠自身知識答對，知識庫沒發揮作用，換題就會壞
  前置：order 11–18
  連結：rag-evaluation-frameworks、private-corpus-retrieval-eval、ask-ai-retrieval-evaluation
```

## 寫作與存放

- 系列 slug：`building-knowledge-bases`；中文名「知識庫怎麼建」、英文名「Building Knowledge Bases」。
- 分類：動筆前確認系列頁可跨分類；預設 A、B 段放 `learning`，C 段放 `ai`。
- 每篇中英雙語；審稿紀錄 `.work/reviews/<slug>.md` 含 post-verify、post-review、post-polish。
- 先寫 order 0 與 order 1 給使用者看，每批最多 2 篇。
- 寫每篇前，對該篇「待讀」的來源補讀；🟡 只讀到摘要的研究只能引摘要層級的結論。
- 每篇的關鍵主張至少要有一個 2024 年以後的來源，或寫明「近年研究仍支持」並附來源；舊研究要寫年份與研究對象，讓讀者判斷是否仍適用。

## 研究足夠的判準（每篇動筆前的閘門）

每篇先列出關鍵主張，逐條過五關；任一關沒過就先補，補搜過程寫進研究筆記，不寫進正文。

1. **一手來源**：至少一個讀過正文的一手來源（研究原文、官方文件、方法作者原文）；轉述不算。
2. **證據類型**：方法類主張分清「作者主張」與「實證研究」；找不到實證就寫出試過的管道（資料庫、關鍵字、年份範圍）。
3. **時效**：至少一個 2024 年以後的來源，或近年研究確認舊結論仍成立。
4. **反證**：主動搜反對意見、失敗案例、重複驗證（關鍵字加 replication、criticism、limitations、failed、does not）。
5. **飽和**：換兩三組不同關鍵字（含中文、近義詞、不同學科用語）再搜，結果都是已讀來源才停。

2026-10-20 檢查結果（依抓取紀錄重核；細節見研究筆記「讀取程度」與 `sources.jsonl`）：

**系列層已完成**：三段母群、掃描、覆蓋矩陣、偏誤，以及每篇的候選來源（總表「對應來源」欄）。**篇章層還沒開始**：48 篇論文中只有 Barnett 2024、NVIDIA FACTS 2024 整份讀過，沒有任何一篇有精讀抽取紀錄；範圍卡裡的研究數字都是摘要或部分讀的線索，動筆前要精讀確認，對不上就改範圍卡。

| order | ①一手（✅ 整份讀過的） | 只到 🟡／🔎 的關鍵來源 | ③時效 | ④反證（候選） | 篇章層要做 |
|---|---|---|---|---|---|
| 0 | 方法原文、維基 PIM（部分） | Najork 2024（部分） | 候選有 | 候選有 | 精讀 Najork、維基 PIM 引用的原研究 |
| 1 | Collector's Fallacy、GTD | Najork、囤積回顧（摘要） | 候選有 | 候選有 | 精讀兩篇 |
| 2 | PARA、Johnny.Decimal | Whittaker 2011、Bergman 2010（抽段）、Bergman 2008／2016／Dvir 2026（摘要） | 候選有 | Najork 轉述的 Elsweiler | 從頭精讀 Whittaker、Bergman 2010；回讀 Najork 轉述段 |
| 3 | Luhmann、檔案館、Evergreen、MOC | 生成效應、Urry（摘要）、Malashenko（抽段） | 已確認仍無直接實驗 | Urry 2021 | 精讀 Bertsch、Urry |
| 4 | Obsidian 官方 | Notion 匯出（部分）、Ink & Switch（🔎） | 待讀 | 工具類無研究 | 讀完 Notion 匯出頁與 Ink & Switch 原文 |
| 5 | GTD、Progressive Summarization（部分） | Chen 2025（部分）、Microsoft 2025（部落格）、Etkin、Melumad（摘要） | 候選有 | Etkin 2025 | 精讀四篇 |
| 6 | Diátaxis、SO 2024／2025 | Grudin、Aghajani 2019（抽段）、Stocker、Galan（摘要） | 候選有 | Stocker 2011 | 精讀 Grudin、Aghajani、Stocker |
| 7 | GitLab 頂層結構 | NN/g 卡片分類、樹狀測試（部分） | 2023–2024 | 未找到 | 讀完兩篇；文中標為實務做法 |
| 8 | Nygard ADR、Google docguide、Diátaxis | ECSA 2024（摘要）、ICSA 2026（🔎） | 候選有 | ECSA 限制 | 精讀 ECSA；ICSA 換管道再試 |
| 9 | Google、Write the Docs、Notion、GitLab、KCS | Grudin（抽段）、Tan 2024、Galan（摘要） | 候選有 | 候選有 | 精讀 Tan、Grudin 相關段 |
| 10 | NN/g 搜尋紀錄分析、AGENTS.md、SO 2025 | Agent READMEs、ETH 2026（摘要）、llms.txt（部分） | 候選有 | ETH 2026 | 精讀兩篇研究 |
| 11 | Azure 準備、總覽；Barnett；FACTS | Kucia、企業回顧（摘要）、Anthropic（部分） | 候選有 | Anthropic（小知識庫不必 RAG） | 精讀 Kucia；讀完 Anthropic |
| 12 | Azure、Google、OWASP | Xie 2024、VersionRAG（摘要） | 候選有 | Xie 確認偏誤 | 精讀兩篇 |
| 13 | Azure enrichment、Docling | Santos、OHRBench、InduOCR（摘要）、OmniDocBench（🔎）、Azure chunking（部分） | 候選有 | InduOCR | 精讀 Santos、OHRBench；讀 OmniDocBench |
| 14 | OWASP、Slack AI、Presidio、FACTS | EchoLeak（部分）、CaMeL、Pai、ConfusedPilot、Mu（摘要） | 候選有 | Pai（依模型而異） | 精讀 EchoLeak、CaMeL、Pai |
| 15 | Azure enrichment、AWS | OpenAI（部分）、Anthropic（部分）、LinkedIn（摘要） | 候選有 | LinkedIn 單一公司 | 精讀 LinkedIn |
| 16 | Azure（部分）、OpenAI（部分） | Qu 2025、Bennani 2026（摘要） | 候選有 | Qu 2025 | 精讀兩篇 |
| 17 | Azure、Microsoft、Amazon、OWASP、FACTS | Bhatt（部分）、Filtered ANN、Mu（摘要） | 候選有 | 候選有 | 精讀 Bhatt、Filtered ANN |
| 18 | AWS、Google、OpenAI（部分）、Microsoft Graph | Stale-document、VersionRAG、Xie（摘要） | 候選有 | 候選有 | 精讀 Stale-document |
| 19 | Azure 總覽、Barnett、FACTS | TREC 2024、Kucia、企業回顧（摘要） | 候選有 | TREC（LLM 評審 56%） | 精讀 TREC、Kucia；讀 Azure 評估篇 |

每篇動筆前的流程：從「對應來源」挑 8–12 篇（含至少一篇相反或無效的）給使用者看 → 精讀並交抽取紀錄 → 抽查三個數字 → 對該篇關鍵主張做一輪飽和搜尋 → 五關全過才寫。⑤飽和目前只做過系列層一輪，不算各篇已過。
