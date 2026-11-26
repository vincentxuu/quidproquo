---
title: "AI Engineer 面試日練 — 2026-11-26：LLM & Agent Engineering"
date: 2026-11-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "星期四主題 LLM & Agent Engineering：從一題 senior AI engineer 面試真題出發，練習當 RAG 檢索回兩份互相矛盾的文件時，agent 該怎麼偵測衝突、打分數，再決定要排序引用、雙源並陳、優雅拒答，還是上報給內容擁有者。"
tldr: "今天的核心是衝突偵測不能只靠 prompt 請模型注意矛盾：Google 的 CONFLICTS benchmark 顯示表現最好的模型在衝突類型分類上只有 65.3% 準確率，MAGIC benchmark 的衝突定位準確率只有 55%，人類是 83.3%。生產系統要把偵測拆成三層明確步驟：claim 比對、metadata 檢查（日期／狀態／地區／權威）、衝突評分，再依分數決定排序引用、雙源並陳、優雅拒答，還是上報內容擁有者修源頭；把 top-k 開大當保險反而是常見誤區，只會讓更多互相矛盾的段落一起擠進 context。"
series:
  name: "AI Engineer 面試日練"
  order: 99
---

> :globe: [English version](/posts/daily/2026-11-26-ai-interview-daily-en)

## 今日主題

星期四固定練 LLM & Agent Engineering。前三週分別練過「有權限控管、該拒答時會拒答的內部文件搜尋 agent」（10/29）、「怎麼把工具呼叫迴圈設計成不失控」（11/05）、「跨 session 恢復工作時怎麼分清哪些假設還有效」（11/19），今天把範圍收到 retrieval 本身一個經常被低估的失敗模式：檢索回來的文件彼此矛盾。這題的陷阱不是背出 RAG pipeline 的標準架構，而是示範你知道矛盾的根源通常在內容結構，不在模型本身，而且知道怎麼在生成之前就把衝突攔下來，不是等答案寫錯了才靠 prompt 補救。

## 核心概念速記

### 檢索文件會互相矛盾，背後通常是四種內容問題

多數團隊遇到的矛盾不是模型的錯，是語料庫沒有讓每個事實只有一個家。最常見的是重複內容：同一條退貨政策同時寫在說明中心、產品頁、PDF 導覽手冊裡，其中一份更新了，其他幾份沒跟上，retriever 抓到兩份相似度相近的段落，沒有理由偏好任何一邊。第二種是版本過期：向量索引的更新管線跟內容來源是分開的，文件被改掉或刪掉後沒有重新嵌入，舊段落還是會因為相似度夠高而留在結果裡。第三種是地區或方案差異：保固在歐盟兩年、在美國一年，企業方案有的功能成長方案沒有，兩段話都是真的，只是適用的對象不同，沒有結構化欄位標明適用範圍時，模型看到的就是兩個互相牴觸的主張。第四種是權威不明：論壇留言、草稿政策、已發布的正式頁面都提到同一個數字，人一看就知道正式頁面說的才算，retriever 沒有這個常識，除非權威與狀態資訊跟著內容一起回來。

### 生成前偵測衝突要靠三層做法，不是靠模型自己發現

第一層是 claim 比對：在檢索之後，讓 agent 或一個輕量模型抽出每段話對同一個主題做的具體主張（一個數字、一個日期、一個是非判斷），直接比對；如果段落 A 說 30 天、段落 D 說 45 天，衝突就浮現了。這一步在主張是結構化數值時很便宜，藏在長篇敘述裡就比較難抓。第二層是 metadata 檢查：兩段話如果生效日期不同，很可能不是矛盾而是新版取代舊版；如果適用地區不同，也不是矛盾而是各自成立；草稿本來就不該跟已發布的文件競爭。這些判斷只有在 metadata 真的跟著每個段落一起回來時才有用。第三層是衝突評分：把偵測結果變成一個決策——這個分歧有沒有碰到使用者真正問的問題？有沒有一邊明顯更權威？賭注（價格、法律條款、安全規範）大不大到值得停下來？三個問題答完，才有一個嚴重度分數可以往下傳。只靠 prompt 請模型「注意矛盾」是不夠的，偵測要做成 pipeline 裡明確的一步，而不是丟給模型自由發揮。

### 分級之後，agent 其實只有四種合理的下一步

嚴重度分數決定走哪一條路，而且同一個答案裡可以同時用到不只一種。第一種是依權威與新鮮度排序：metadata 能解決的衝突就直接選贏家——已發布頁面贏草稿，生效日期較新的贏被取代的舊版，這條路只有在權威被明確記錄時才可靠，留給模型從語氣或排版去猜的團隊通常得到不穩定的結果。第二種是雙源並陳：如果兩段話是因為適用對象不同才看起來矛盾，而 agent 不知道使用者屬於哪一邊，誠實的做法是把兩個來源都列出來，附上引用，再問使用者適用哪一種；這種做法在賭注中等、而且兩個來源都權威時也適用,使用者對「附來源的兩個答案」的接受度,遠高於「一個講得很篤定但答錯的答案」。第三種是優雅拒答：賭注高但 agent 解不開的衝突,誠實說明文件在這一點上不一致,並指引怎麼找到能確認的人,好過硬選一邊。第四種是上報人工：每一個高嚴重度的衝突都該留一筆紀錄——問題、互相矛盾的段落、各自的來源、agent 當時做了什麼;沒有這筆紀錄,agent 會對同一個矛盾服務、迴避或拒答幾千次,文件卻永遠沒人去修。前三種是守住單次對話的安全網,只有第四種才會讓明天的衝突變少。

### 模型辨識衝突的能力還落後人類一截,這不是靠換更大模型就能解決的事

這是這題最容易被問倒的地方——很多人以為把模型換大一點,或者在 prompt 裡講清楚一點,衝突就能被模型自己抓出來。Google 的 DRAGged into Conflicts（Cattan et al., arXiv 2506.08500, 2025 年 6 月）建了 CONFLICTS benchmark 專門測這件事,結果是表現最好的模型（Gemini 2.5 Flash）在衝突類型分類上只拿到 65.3% 的準確率——換句話說,連「這是哪一種衝突」都常常判斷錯,更別說正確回應。EMNLP 2025 Findings 的 MAGIC benchmark 換了一種測法,用知識圖譜系統性產生 1,080 筆跨段落衝突,結果是表現最好的模型在衝突定位上只有 55% 的準確率,人類是 83.3%。這兩組數字合起來說的是同一件事:明確的推理提示能讓模型表現變好,但偵測仍然需要一個模型可以信任的明確步驟,不能只靠「請模型自己多想一下」。

```flow-diagram
{
  "title": "檢索到矛盾文件之後：三層偵測，四個出口",
  "lang": "zh-TW",
  "width": 760,
  "height": 760,
  "nodes": [
    {"id": "retrieve", "label": "Retriever 回傳\ntop-k 候選段落", "x": 380, "y": 50, "w": 260},
    {"id": "claim", "label": "Claim 比對：\n抽出數值／日期／是非主張", "x": 380, "y": 160, "w": 260},
    {"id": "metadata", "label": "Metadata 檢查：\n生效日期／狀態／地區／擁有者", "x": 380, "y": 270, "w": 260},
    {"id": "score", "label": "衝突評分：\n相關性 × 可解性 × 風險", "x": 380, "y": 380, "w": 260, "tone": "accent"},
    {"id": "rank", "label": "排序引用\n（metadata 能解）", "x": 130, "y": 540, "w": 210},
    {"id": "showboth", "label": "雙源並陳\n（地區差異或皆權威）", "x": 380, "y": 540, "w": 220},
    {"id": "decline", "label": "優雅拒答\n（高風險解不開）", "x": 630, "y": 540, "w": 210},
    {"id": "flag", "label": "上報內容擁有者\n留下紀錄，修源頭", "x": 380, "y": 680, "w": 280, "tone": "accent"}
  ],
  "edges": [
    {"from": "retrieve", "to": "claim", "step": 1, "label": "先抓出每段話的具體主張"},
    {"from": "claim", "to": "metadata", "step": 2, "label": "文字比對抓不到的靠 metadata 補"},
    {"from": "metadata", "to": "score", "step": 3, "label": "三個問題：相關、可解、風險"},
    {"from": "score", "to": "rank", "step": 4},
    {"from": "score", "to": "showboth", "step": 4},
    {"from": "score", "to": "decline", "step": 4},
    {"from": "rank", "to": "flag", "step": 5, "label": "高嚴重度都留紀錄"},
    {"from": "showboth", "to": "flag", "step": 5},
    {"from": "decline", "to": "flag", "step": 5}
  ],
  "steps": [
    "Retriever 依相似度回傳一批候選段落，這一步只管像不像，不管對不對。",
    "先做 claim 比對：抽出每段話對同一主題的具體主張，數字、日期、是非判斷，直接對照。",
    "文字比對抓不到或容易誤判的，靠 metadata 補——生效日期、發布狀態、適用地區、內容擁有者。",
    "把偵測結果變成一個分數，再依分數分流：metadata 能解就排序引用；屬於地區或方案差異、或雙邊都權威就雙源並陳；高風險又解不開就優雅拒答。",
    "不管走哪一條，高嚴重度的衝突都要留下紀錄，問題回到文件擁有者手上，才會讓明天的衝突變少。"
  ],
  "caption": "簡化示意：真實系統的 claim 抽取與衝突評分通常用一個獨立的分類器或結構化 LLM 呼叫完成，不是生成答案的同一次呼叫。"
}
```

## 今日練習題

### 題目

Retriever 抓回一份跟使用者原意有矛盾（或跟另一份已檢索段落互相衝突）的文件時，系統應該怎麼處理？

**來源**：dev.to（Manohar Papasani，每日一題 AI 面試系列，2026-11-22 發佈，原題同步轉載自作者 LinkedIn）　**難度**：中等偏難　**環節**：senior AI engineer onsite deep-dive

### 拆解思路

1. **先釐清問題**：面試官說的「矛盾」可能是兩種完全不同的情境——retriever 抓錯了使用者真正想問的語意，或是兩份都抓對了但彼此內容互相衝突。可以先主動問清楚，或直接說明「我會分這兩種情況各講一次」。
2. **建立框架**：把這題定位成 ranking／failure-mode 問題，不是 prompt tuning 問題。Embedding 衡量的是語意像不像，不是對不對，也不是使用者真正想要的那個版本——一份措辭幾乎一樣但已經過期的政策，完全可能比新版排名更高。
3. **深入核心**：講清楚三層偵測（claim 比對、metadata 檢查、衝突評分）怎麼分工，再講分級之後的四個出口（排序、雙源並陳、拒答、上報），並點名一個常見誤區——把 top-k 開大當保險，只會讓更多互相矛盾的段落一起擠進 context，模型要混用錯誤來源的機率反而更高。
4. **收尾**：用一句話收斂成可驗證的做法——建一組「top-k 裡混了誤導文件」的標註資料集，分開追蹤 retrieval precision@k 跟答案忠實度兩個指標，而不是改了一次 prompt、看幾個例子變好就宣稱修好了。

### 範例回答（面試時可以這樣講）

> **先把問題拆成兩層**：如果 retriever 抓錯了使用者的意圖，根因在檢索前——應該做查詢重寫，或在歧義明顯時直接問一句澄清問題，再用澄清後的查詢重新檢索，而不是指望生成階段的模型自己猜對。如果兩份檢索結果本身互相矛盾，那是另一個問題：我會在生成之前加一個明確的偵測步驟，先用 claim 比對抽出每段話對同一主題的具體主張，再補 metadata——生效日期、發布狀態、適用地區、內容擁有者——因為很多「看起來矛盾」其實是新版取代舊版，或是兩個地區各自都對，metadata 一補就不是衝突了。
>
> **真正解不開的衝突才進評分**：我會打一個分數,只問三件事——這個分歧碰到使用者的問題嗎、有沒有一邊明顯更權威、賭注大不大。分數低就直接排序引用;分數中等但屬於地區或方案差異,就把兩個來源都列出來附上引用,讓使用者自己選;分數高又解不開,就誠實說文件在這點不一致,引導去找能確認的人,而不是賭一個答案。不管走哪條路,高嚴重度的衝突都要留一筆紀錄,回報給文件擁有者,這樣明天同一個矛盾才會變少,不是每次都靠 agent 臨場擋。
>
> **我會避開的誤區是把 top-k 開大當保險**：context 裡段落變多,互相矛盾的機率只會更高,模型把兩邊混在一起講的風險也更高。這題我也會提到,Google 的 CONFLICTS benchmark 顯示表現最好的模型在衝突類型分類上也只有 65.3% 準確率，所以偵測必須是 pipeline 裡的明確步驟,不能單靠在 prompt 裡多講一句「請注意矛盾」。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有分清楚「retriever 抓錯意圖」跟「兩份文件本身互相矛盾」是兩個不同問題 | |
| 有講出三層偵測：claim 比對、metadata 檢查、衝突評分，不是只說「讓模型自己判斷」 | |
| 有講出分級後的至少三種出口（排序引用／雙源並陳／優雅拒答），不是只有一種固定做法 | |
| 有指出「加大 top-k 當保險」是常見誤區，並說明為什麼反而更糟 | |
| 有提到離線評估要分開追蹤 retrieval precision@k 跟答案忠實度，不是改了 prompt 看感覺 | |
| 加分：有引用具體 benchmark 數字（如模型衝突分類／定位準確率仍落後人類）支撐論點 | |

## 延伸閱讀

- [Conflicting Sources in RAG: How Agents Should Detect and Handle Contradictions Between Documents](https://www.agent-context.org/guides/conflicting-sources-in-rag-how-agents-should-detect-and-handle-contradictions-between-documents) — 把矛盾拆成四種內容成因、三層偵測、四個決策出口的完整實務指南，今天四個核心概念的主要依據。
- [DRAGged into Conflicts: Detecting and Addressing Conflicting Sources in Search-Augmented LLMs（arXiv 2506.08500）](https://arxiv.org/abs/2506.08500) — Google 團隊提出的衝突分類體系跟 CONFLICTS benchmark，想知道模型在真實衝突類型上表現多差，看這篇最直接。

## 參考資料

- [What happens when the retriever pulls back a document that contradicts what the user actually meant?（dev.to, Manohar Papasani）](https://dev.to/technaom/what-happens-when-the-retriever-pulls-back-a-document-that-contradicts-what-the-user-actually-meant-4eoa) — 本篇 LLM agent 練習題的原始問法與「強答案／常見誤區」來源，一個 senior AI engineer 面試裡實際被問到的題目。
- [Conflicting Sources in RAG: How Agents Should Detect and Handle Contradictions Between Documents](https://www.agent-context.org/guides/conflicting-sources-in-rag-how-agents-should-detect-and-handle-contradictions-between-documents) — 對應核心概念第一、二、三節關於矛盾成因、三層偵測與四個決策出口的說明。
- [DRAGged into Conflicts: Detecting and Addressing Conflicting Sources in Search-Augmented LLMs（arXiv 2506.08500）](https://arxiv.org/abs/2506.08500) — 對應第四節 Gemini 2.5 Flash 在 CONFLICTS benchmark 衝突類型分類上 65.3% 準確率的數字來源。
- [MAGIC: A Multi-Hop and Graph-Based Benchmark for Inter-Context Conflicts in Retrieval-Augmented Generation（EMNLP 2025 Findings）](https://aclanthology.org/2025.findings-emnlp.466/) — 對應第四節衝突定位準確率模型 55%、人類 83.3% 的數字來源。
