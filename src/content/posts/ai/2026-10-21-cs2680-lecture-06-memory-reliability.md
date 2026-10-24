---
title: "Agent 的記憶與可靠度：寫什麼、記多久、錯在哪一層｜Harvard CS2680 第 6 堂"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, agent-memory, agent-reliability, agent-harness, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 8
tldr: "CS2680 第 6 堂（2026-09-28）前半講 agent 的記憶：把一件事留下來，要依序決定寫不寫、存成什麼樣子、存在哪裡、什麼時候取回、要不要歸納成通則、還算不算數，另外還有記憶歸誰管。過期的事實不要直接刪，要記下它什麼時候成立、從哪裡來。後半講可靠度：每步 95% 成功，20 步全對只剩約 36%；失敗可以歸到任務規格、harness、模型、工具、環境五層，每層各有修法。兩半的接點是一個 harness 層的失敗：把過期的筆記當成事實。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）第 6 堂導讀：記憶的六個設計決定與歸屬、四種表示與四種儲存、valid time 與 provenance、Mem0／Graphiti／supermemory、八種記憶失敗與記憶 benchmark 的陷阱，以及錯誤複利、五層故障歸因與 designing for failure。依據公開投影片，產品行為對照官方文件，數字回原論文核對。"
draft: false
glossary:
  - term: "valid time"
    aliases: ["有效時間", "validity window"]
    definition: "一個事實在真實世界成立的時間區間。事實改變時，舊事實不刪除，而是標上結束時間、標成被取代，查詢時就能分辨「現在是什麼」和「當時是什麼」。"
    context: "第 6 堂用「4 月用 vLLM、6 月改用 SGLang」示範。"
  - term: "provenance"
    aliases: ["來源", "出處"]
    definition: "一筆記憶從哪裡來：哪一段對話、哪一份文件、可信度多少。有了出處，記憶互相矛盾時才能回頭查證，也能找出被寫進來的不可信內容。"
    context: "第 6 堂把它和 valid time 並列為記憶必備的兩個欄位。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-lecture-06-memory-reliability-en)

**影片狀態：課程不錄影。** 本文依公開投影片整理，數值例子為本站補充。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 第 6 堂在 2026 年 9 月 28 日上課，題目是〈Agent design III: memory and reliability〉（[投影片](https://cs2680.com/slides/6_agent_design_3.pdf)）。[第 5 堂](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture)講多個 agent 怎麼組起來；這堂回到單一 agent，問兩件事：它怎麼記得上次學到的東西，以及它出錯時，錯在哪裡。

這堂要回答兩個問題：記憶的每個決定點該怎麼選？agent 失敗時，怎麼知道是哪一層出錯？讀完之後，你應該能替一個 agent 回答一份記憶設計清單。你也應該能把一個失敗案例歸到五層之一，說出對應的修法。

投影片分兩段：記憶（p5–21）與可靠度（p22–30）。p3 的大綱說要接著講第 5 堂的多 agent，但投影片 p4 是空白頁，沒有這段內容。前置知識來自前面兩堂：[第 2 堂的 CLAUDE.md 與 auto memory](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works#claudemd-與-auto-memory)，以及[第 4 堂的 context 管理手段](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering#四種管理手段)。

## 記憶：把一件事留下來要做的六個決定

### context window 不是記憶

投影片先分清兩樣東西（p5）：

- **context window** 是暫時的工作狀態。這次對話結束，或被壓縮掉，裡面的東西就沒了。
- **memory store** 是跨互動保留下來的狀態。harness 把它存在 context 之外，需要時再拿回來。

第 2 堂說過，context 是一種會消失的記憶；第 4 堂的 offloading 是把東西先放到 context 外面，用到再讀。這堂把「放到外面、再拿回來」整理成一條流程，每一步都是一個要你決定的政策。

### 六個決定，外加一個歸屬問題

投影片用六個問題串起一筆記憶的一生（p6）：

| 階段 | 要問的問題 |
|---|---|
| 寫不寫（write or skip） | 值得留下來嗎？ |
| 編碼與組織（encode / organize） | 要存成什麼樣子？ |
| 儲存（store） | 存在哪裡？ |
| 取回（retrieve） | 這個任務需要它嗎？ |
| 歸納（reflect / generalize） | 能得出更廣的通則嗎？ |
| 保留、更新、刪除（keep / update / delete） | 現在還成立嗎？ |

六個問題之外還有一個：記憶歸誰管？是 agent 自己存檔，還是交給專門的記憶服務。投影片 p17 把這六步收成一份設計清單，提醒每一步都是一個政策決定；本文最後的綜合題會用它來練習。

接下來用投影片從頭用到尾的同一句話走一遍：使用者在第 28 段對話裡說「我們把 serving 從 vLLM 換成 SGLang 了」。

### 寫不寫：召回與雜訊的取捨

每次互動都寫，比較不會漏，但雜訊也多；挑著寫，存下來的比較準，但可能漏掉有用的事（p7）。投影片列了四種觸發寫入的方式：

- 使用者明講「記住這件事」。
- 固定規則，例如偵測到「我們改用…」這類句型。
- 一個小分類器判斷值不值得存。
- 定期讓 LLM 回顧一批對話，挑出值得留的。

[Claude Code 的 auto memory](https://code.claude.com/docs/en/memory#auto-memory) 是一個實例。它不是每次都寫，會先判斷「下次對話用不用得到」；能從程式碼或 git 歷史推出來的東西，它不存。你明講「記住要用 pnpm」，它也會存。

### 存成什麼樣子

同一句話可以存成四種樣子（p8）：

| 表示 | 例子 | 取捨 |
|---|---|---|
| 原始事件 | 「我們把 serving 從 vLLM 換成 SGLang 了。」 | 最完整，但又大又重複 |
| 摘要 | 「用 SGLang 做模型 serving。」 | 精簡，但可能丟掉脈絡（換掉了誰？） |
| 結構化狀態 | `{"serving_engine": "SGLang"}` | 可以查詢，但欄位得事先定好 |
| 知識圖 | 專案 → 使用 → SGLang | 能連起實體，也能記錄關係怎麼隨時間改變 |

注意摘要那一列：「從 vLLM 換過來」這個資訊消失了。如果之後有人問「我們以前用什麼」，只存摘要的系統就答不出來。

### 存在哪裡：四種儲存各擅長什麼查詢

投影片一頁列了四類儲存與十個產品名（p9）。不熟資料庫的讀者可以先抓一件事：**每種儲存擅長回答的問題不一樣**。下表的「能回答的問題」一欄是本文補的對照：

| 儲存 | 投影片的例子 | 擅長 | 對 SGLang 這筆記憶，能回答的問題 |
|---|---|---|---|
| 純文字檔 | CLAUDE.md、scratchpad | 人看得懂，能 diff、能 grep | 「筆記裡有沒有寫到 SGLang？」（關鍵字搜尋） |
| key-value 或關聯式資料庫 | Redis、SQLite、Postgres JSONB | 精確查找、過濾、交易（幾筆寫入要嘛全部成功、要嘛全部不算） | 「專案 A 的 serving_engine 欄位現在是什麼？」 |
| 向量資料庫 | pgvector、Chroma、Pinecone | 找意思相近的內容 | 「我們用什麼推論引擎？」——問句裡沒有 SGLang 這個字，也找得到 |
| 圖資料庫 | Neo4j、FalkorDB（Graphiti 用） | 沿著關係走好幾步 | 「哪些專案和專案 A 用同一套 serving？」 |

向量資料庫靠 embedding：把一段文字轉成一串數字，意思相近的文字，數字也相近，所以能用「距離」找相關內容（[第 4 堂](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering#找程式碼四種方法)講語意搜尋時介紹過）。圖資料庫把「專案」「SGLang」存成節點、「使用」存成邊，適合問「A 連到 B，B 又連到誰」這種多跳的問題。

### 什麼時候讀、什麼時候寫

讀寫的時機有三種（p10）：

- **自動**：每一輪都先搜尋記憶、再呼叫模型、最後寫回。簡單、可預期，但每輪都多一次延遲，也常塞進不相關的記憶。
- **由 runtime 控制**：harness 用規則或分類器決定這輪要不要搜、要不要存。比較省，但規則要有人寫。
- **由模型控制**：把 `search_memory`、`add_memory` 這類工具交給模型，讓它自己決定。最彈性，但模型可能該讀的沒讀、該存的沒存。

投影片提醒，很多系統是混合的，而且讀和寫可以用不同的政策。Claude Code 就是混合的。`MEMORY.md` 這份索引在每次對話開頭自動載入，上限是前 200 行或前 25KB。細節放在各個主題檔，模型需要時才用檔案工具去讀（[官方文件](https://code.claude.com/docs/en/memory#how-it-works)）。

### 怎麼取回：語意相近只是其中一個訊號

最基本的取回流程是：拿查詢去做向量搜尋，取最像的前 k 筆，放進 prompt（p11）。這就是閱讀清單上 [RAG](https://arxiv.org/abs/2005.11401)（2020）的做法：把知識從模型權重搬到一個可以改的外部索引。投影片指出，語意相近只是五個訊號之一：

- **語意**：意思和查詢相近。
- **範圍**：同一個使用者、同一個專案、同一個實體、同一個任務。
- **重要性**：漏掉它或多放它，代價各有多大。
- **有效性**：在這個時間點，對這個任務還成立嗎。
- **出處**：從哪裡來、可信度多少、有沒有證據。

只看語意會出事。「我們用 vLLM」和「我們用 SGLang」在語意上一樣像查詢，只有「有效性」能告訴你哪一筆已經過時。

### 歸納：從幾件事推出一條通則

使用者先後問了 vLLM、SGLang、TRT-LLM、LLM 排程，系統可以歸納出一條假設：「這個人持續關心 LLM 推論系統」，信心中等（p12）。投影片建議在兩種時候做歸納：累積了夠多新事件（例如每 N 件，或 context 快滿時），或事實互相矛盾、重複出現時。歸納盡量放到背景工作裡做，不要卡住主流程。

歸納的結論要標信心，因為一次事件就推出長期偏好，正是後面「過度歸納」這種失敗。

### 遺忘，以及「什麼時候成立、從哪裡來」

投影片說遺忘是一級操作，和寫入一樣要設計（p13）。要忘的理由有四個：資訊過期、資訊錯誤或互相矛盾、隱私與安全、儲存與檢索的成本。手段也有四種：標成無效、永久刪除、設存活時間（TTL）到期自動失效、分層並把東西移出常用層。

標成無效和永久刪除差很多。p14 用 SGLang 的例子說明，記憶要帶兩個欄位：

- **valid time（有效時間）**：這個事實在什麼時間成立。2026 年 4 月「專案用 vLLM」，標成已被取代；6 月起「專案用 SGLang」，標成目前有效。
- **provenance（出處）**：這個事實從哪裡來。「專案 → 用來 serving → SGLang」這條關係，來源是第 28 段對話的原話。

舊事實留著、只標上時間，才能同時回答「現在用什麼」和「4 月時用什麼」。實際產品也這樣做：[Graphiti](https://github.com/getzep/graphiti) 的說明寫明，資訊改變時舊事實「被標成失效，不刪除」，每個事實都能追回產生它的原始對話。Claude Code 的做法輕得多，但方向相同。記憶檔開頭有 frontmatter 時，它會記下寫入時間，人和模型讀回來時都知道這筆有多新。索引快滿時，它會被提醒合併或刪掉過期的條目（[官方文件](https://code.claude.com/docs/en/memory#how-it-works)）。

### 記憶歸誰管

最後一個問題是歸屬（p15）：

- **agent 自己管**：記憶是 harness 裡的檔案，例如 CLAUDE.md、scratchpad、任務筆記，由 harness 寫到磁碟。
- **交給專門的記憶系統**：記憶是一組 API，可以在多個 agent、多個 session 之間共用。

投影片比較了三個專門系統（p16）。「現況」一欄是本文對照官方文件補的：

| 系統 | 投影片的描述 | 現況（2026-10） |
|---|---|---|
| [Mem0](https://docs.mem0.ai/core-concepts/memory-types) | 以事實為中心；依使用者、agent 或執行範圍分開；向量搜尋加過濾，可選圖記憶 | 平台版改成語意、關鍵字、實體、時間四種訊號一起排序，圖記憶自動開啟、不再接外部圖資料庫；2026 年 4 月的新演算法寫入只新增、不覆寫舊記憶 |
| [Graphiti](https://github.com/getzep/graphiti) | 時序知識圖；從對話抽出實體與有時間的事實；語意、關鍵字、圖三種搜尋混合 | 和投影片一致；它是 [Zep](https://arxiv.org/abs/2501.13956) 記憶服務的核心元件 |
| [supermemory](https://github.com/supermemoryai/supermemory) | 維護使用者 profile，加上記憶與文件搜尋 | 和投影片一致；另外宣稱會處理矛盾、讓過期資訊自動失效 |

Mem0 的改動可以拿來對照前面的遺忘一節。它的自動寫入不再覆寫舊事實，「我搬到西雅圖了」會和「我住奧斯汀」並存，取回時再靠時間訊號分辨誰比較新。真的要改或刪，得由應用程式明確呼叫 update 或 delete（[Mem0 文件](https://docs.mem0.ai/core-concepts/memory-types)）。

p21 把兩種歸屬畫成兩疊架構：左邊記憶獨立成一層，底下接向量、SQL、圖等各種儲存；右邊記憶管理做在 runtime 裡，儲存就是 markdown 檔。兩欄中間畫了一個問號，投影片沒有說哪邊比較好。兩疊的最上層都列了 Claude Code、Letta、Codex，表示同一個 agent 兩種接法都可以。依官方文件，Claude Code 目前用右邊那種。

閱讀清單上的 [MemGPT](https://arxiv.org/abs/2310.08560) 是另一條線的起點：讓模型自己管記憶。它把 context window 當成作業系統的主記憶體，外部儲存當成磁碟。context 快滿時，它發出警告，讓模型自己用函式呼叫把資料搬進搬出。MemGPT 的團隊後來做成了 [Letta](https://github.com/letta-ai/letta)，投影片把 Letta 的內建記憶放在左邊那疊的記憶管理層。

### 八種記憶失敗

投影片列了八種記憶出錯的樣子（p18）。「對應的決定」一欄是本文補的，指出該回頭檢查哪一個設計決定：

| 失敗 | 投影片的說明 | 對應的決定 |
|---|---|---|
| 取回落空 | 相關的記憶存在，但沒被找到 | 取回 |
| context 汙染 | 太多不相關的記憶進了 context | 取回、讀寫時機 |
| 記憶幻覺 | 推論被當成事實存下來：「在哈佛念書」變成「哈佛的訪問學生」 | 編碼、出處 |
| 過期 | 舊事實蓋過新資訊 | 保留／更新／刪除、有效時間 |
| 隔離失敗 | 記憶跨過了使用者的邊界 | 取回的「範圍」、歸屬 |
| 過度歸納 | 一次事件變成長期偏好 | 歸納 |
| 持續性 prompt injection | 不可信的內容被存下來，之後被當成指令取回 | 寫不寫、出處 |
| 無限成長 | 大小隨時間一直長，取回變慢、變差 | 遺忘 |

持續性 prompt injection 不是紙上談兵。[MINJA](https://arxiv.org/abs/2503.03704) 這篇研究示範，攻擊者不用碰到記憶庫，只靠一般查詢與 agent 互動，就能讓 agent 自己把惡意紀錄寫進記憶。之後別的使用者查詢時，就會把它取回來。

### 怎麼評估記憶

投影片把記憶的指標分成四組（p19）：

- **取回**：precision 與 recall，取回的記憶有多少是對的、該取回的有多少被取回。
- **寫入與更新**：precision、recall，加上過期記憶的比例。
- **治理**：要求刪除的有沒有真的刪掉，範圍隔離有沒有守住。
- **系統**：延遲、額外的 token、儲存成長速度。

整個記憶元件則常用三個 benchmark 測（p20），它們主要測 agent 能不能記住並推理一長串使用者與助理的對話：

| Benchmark | 規模 |
|---|---|
| [LoCoMo](https://aclanthology.org/2024.acl-long.747/)（ACL 2024） | 10 段長對話，常用的 1,540 題 |
| [LongMemEval](https://arxiv.org/abs/2410.10813)（ICLR 2025） | 500 題，考 5 種記憶能力 |
| [BEAM](https://arxiv.org/abs/2510.27246)（ICLR 2026） | 100 段對話、2,000 題，對話最長 1,000 萬 token |

讀這些分數要小心三件事：

- **1,540 不是全部的題目。** LoCoMo 公開的 10 段對話共有 1,986 題，常見的 1,540 是扣掉 446 題 adversarial 題後的數字。這類題目考的是「不知道就說不知道」。
- **judge 可能太寬。** 投影片 p20 角落列的 LoCoMo-Refined，是第三方重新整理的版本。整理的人發現原本的評分方式會把「主題對、細節錯」的答案算對，於是修訂了 337 題，並換了更嚴的 LLM 評分模型（[說明](https://github.com/mem-eval-suite/LoCoMo_refined)）。
- **要看 full-context 基準線。** 一份獨立稽核把整段對話直接塞給模型，分數 92.62%，比號稱最好的 EverMemOS（92.32%）還高。稽核者認為，差距來自回答用的 prompt，不是記憶系統（[locomo-audit](https://github.com/dial481/locomo-audit)）。這份稽核不是同儕審查的論文，但它提醒你：記憶系統要比「全部塞進去」好，才算真的有用。

[Mem0](https://github.com/mem0ai/mem0) 與 [supermemory](https://github.com/supermemoryai/supermemory) 的 README 都宣稱自己在這些 benchmark 上領先，例如 Mem0 寫 LoCoMo 92.5 分，數字都是自家測的。

> **自我檢查**：使用者三週前在對話裡說「部署前要先跑 `make check`」，昨天團隊把這個指令改名成 `make verify`，並在對話裡提過一次。兩句話都已經存進記憶。現在 agent 又在部署前跑 `make check`。這是八種失敗裡的哪一種？要改六個決定裡的哪幾個？
> 答：過期，舊事實蓋過了新資訊。要改兩處。一是「保留／更新／刪除」：昨天那句話進來時，要把舊規則標成被取代，而不是只多存一筆新的。二是「取回」：要把有效時間當成排序訊號，兩筆都取回時，以目前有效的那筆為準。

## 可靠度：錯在哪一層

### 接點：把過期的筆記當成事實

前半和後半的接點在 p26。harness 層的失敗表裡有一列叫「記憶錯誤」：harness 把一則過期的筆記當成事實取回，agent 就去改一個已經搬走的檔案。修法是記憶要帶日期、使用前再查一次。前半講的是怎麼把記憶設計好，後半退一步問：記憶只是 agent 會出錯的地方之一，其他地方呢？

> **自我檢查**：agent 照著三週前存下的筆記，呼叫了一個上週已經刪掉的 API。這是哪一層的失敗？怎麼修？
> 答：照投影片的分類，是 harness 層的「記憶錯誤」：harness 把一則過期的筆記當成事實取回（p26）。修法是記憶要帶日期、使用前再查一次；用前半的話說，就是記憶要有 valid time 與出處，API 刪除時要把舊筆記標成失效，或設遺忘政策讓它過期。模型照著 context 裡的資訊做事，問題不在模型層。

### 錯誤會複利

可靠度為什麼難？投影片用一個簡單的模型說明（p22）：假設每一步各自獨立，有 95% 的機會做對，一次執行要每一步都對才算成功。

| 步數 | 全部做對的機率 |
|---|---|
| 1 | 95% |
| 5 | 77% |
| 10 | 60% |
| 20 | 36% |
| 50 | 8% |

50 步的任務，大約 13 次只有 1 次完全沒出錯。

這個數字告訴你可以往哪兩個方向改，下面是本文補的算術。20 步、每步 0.95，成功率 0.95²⁰ ≈ 0.36：

- **把步數砍半**：10 步，0.95¹⁰ ≈ 0.60。
- **把每步提到 0.99**：20 步，0.99²⁰ ≈ 0.82。

每步只多 4 個百分點，整體成功率從約三分之一變成五分之四以上。這也是後面各層修法的共同目標：讓每一步更可靠，或讓步數少一點。

```diagram
title: 每步成功率 0.95 與 0.99，步數越多差距越大
desc: 每步成功率 0.95 時，全部做對的機率在 20 步降到約 36%、50 步約 8%；每步 0.99 時，20 步仍有約 82%、50 步約 61%。
caption: 依「每步獨立、全部做對才算成功」計算（p22 的假設）。換算：y = 300 − 機率(%) × 2.4，x = 80 + 8.4 × 步數，縱軸從 0 起。0.95 那條線的數字與 p22 一致，0.99 那條是本文補算。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">全部做對的機率（%）</text>
  <line class="dg-grid" x1="72" y1="60" x2="508" y2="60"/>
  <line class="dg-grid" x1="72" y1="120" x2="508" y2="120"/>
  <line class="dg-grid" x1="72" y1="180" x2="508" y2="180"/>
  <line class="dg-grid" x1="72" y1="240" x2="508" y2="240"/>
  <line class="dg-grid" x1="248" y1="60" x2="248" y2="300"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="120" text-anchor="end" dominant-baseline="central">75</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="240" text-anchor="end" dominant-baseline="central">25</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <line class="dg-axis" x1="72" y1="300" x2="508" y2="300"/>

  <g class="dg-c-s1">
    <polyline class="dg-plot-line dg-plot-line--thin" points="80,60.0 122,71.8 164,82.9 206,93.6 248,103.7 290,113.3 332,122.5 374,131.2 416,139.4 458,147.3 500,154.8"/>
    <text class="dg-sub dg-text--series" x="512" y="154.8" dominant-baseline="central">每步 0.99：61%</text>
    <text class="dg-sub dg-text--series" x="256" y="88" dominant-baseline="central">20 步 82%</text>
  </g>
  <g class="dg-c-accent">
    <polyline class="dg-plot-line" points="80,60.0 122,114.3 164,156.3 206,188.8 248,214.0 290,233.4 332,248.5 374,260.1 416,269.2 458,276.1 500,281.5"/>
    <circle class="dg-point" cx="80" cy="60.0" r="4"/>
    <circle class="dg-point" cx="122" cy="114.3" r="4"/>
    <circle class="dg-point" cx="164" cy="156.3" r="4"/>
    <circle class="dg-point" cx="206" cy="188.8" r="4"/>
    <circle class="dg-point" cx="248" cy="214.0" r="4"/>
    <circle class="dg-point" cx="290" cy="233.4" r="4"/>
    <circle class="dg-point" cx="332" cy="248.5" r="4"/>
    <circle class="dg-point" cx="374" cy="260.1" r="4"/>
    <circle class="dg-point" cx="416" cy="269.2" r="4"/>
    <circle class="dg-point" cx="458" cy="276.1" r="4"/>
    <circle class="dg-point" cx="500" cy="281.5" r="4"/>
    <text class="dg-label dg-text--series" x="512" y="281.5" dominant-baseline="central">每步 0.95：8%</text>
    <text class="dg-label dg-text--series" x="256" y="196" dominant-baseline="central">20 步 36%</text>
  </g>

  <text class="dg-small" x="80" y="320" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-small" x="164" y="320" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="248" y="320" text-anchor="middle" dominant-baseline="central">20</text>
  <text class="dg-small" x="332" y="320" text-anchor="middle" dominant-baseline="central">30</text>
  <text class="dg-small" x="416" y="320" text-anchor="middle" dominant-baseline="central">40</text>
  <text class="dg-small" x="500" y="320" text-anchor="middle" dominant-baseline="central">50 步</text>
</svg>
```

投影片自己註明這是「每步獨立」的假設，還說真實情況更糟，因為錯誤會傳播。後來的研究支持這一點：[Sinha 等人（2025）](https://arxiv.org/abs/2509.09677)發現，context 裡有模型自己先前的錯誤時，它下一步更容易再錯，所以每步的正確率會隨步數下降。另一方面，[Toby Ord（2025）](https://arxiv.org/abs/2505.05115)拿 METR 的研究工程題組來擬合，發現一個指數模型解釋得很好：人類做這題每多花一分鐘，agent 就多一份固定的失敗機率。但他也說，換一組任務還成不成立，目前不知道。

> **自我檢查**：一個 agent 要 30 步完成任務，每步成功率 0.97，失敗了要重跑。你可以二選一：把每步提到 0.99，或把任務拆成兩段各 15 步、每段做完由人確認一次（假設錯誤在段尾被抓到，只重做那一段）。兩個方案各自一次跑完整個任務的機率是多少？平均要跑幾步才完成？
> 答：原本 0.97³⁰ ≈ 0.40，失敗就整段重來，平均約 30 ÷ 0.40 ≈ 75 步。提到 0.99：0.99³⁰ ≈ 0.74，平均約 41 步。拆兩段：每段 0.97¹⁵ ≈ 0.63，整個任務一次全對仍是 0.63² ≈ 0.40，但錯了只重做該段，平均約 2 × 15 ÷ 0.63 ≈ 47 步。拆段沒有讓「一次全對」變高，省的是重做；提升每步可靠度兩者都改善。兩種做法可以一起用。

### 故障的五個來源

投影片把故障的來源分成五層（p24），每層問一個問題：

| 層 | 要問的問題 | 失敗叫做 |
|---|---|---|
| 使用者與任務規格 | 目標說清楚了嗎？ | 規格失敗 |
| agent harness | context、loop、排程有沒有出錯？ | harness 失敗 |
| LLM | 推理與規劃有沒有出錯？ | 模型失敗 |
| 工具層 | shell、瀏覽器、API 有沒有出錯？ | 工具失敗 |
| 環境 | repo、作業系統、網頁、外部服務有沒有出錯？ | 環境失敗 |

本系列把失敗統一歸到這五層。[第 5 堂](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture)的六種切分失敗，在這裡算 harness 層，因為工作怎麼切是 harness 決定的。[作業 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop) 的五種失敗分散在模型、harness、工具、環境四層，但修法都寫在 harness 裡。可見出錯的層和修的地方不一定是同一層。

接下來五張表摘自 p25–29，每列是投影片的一個案例。

**任務規格**（p25）：

| 失敗 | 規格怎麼寫 | agent 做了什麼 | 修法 |
|---|---|---|---|
| 目標模糊 | 「修好登入的 bug」 | 有三個可能的 bug，修到不是使用者指的那一個 | 寫出檔案、症狀與重現步驟 |
| 代理目標 | 「讓測試通過」 | 把失敗的測試刪了 | 禁止改測試，審查 diff |
| 沒說出口的限制 | 「讓搜尋變快」 | 改壞了公開 API | 寫出哪些東西不能動 |
| 沒定義什麼叫做完 | 「整理一下 parser」 | 重構停不下來 | 給一個結束的測試與停止條件 |
| 目標互相衝突 | 「diff 越小越好，所有邊界情況都要處理」 | 默默放掉邊界情況 | 明講目標的優先順序 |

**agent harness**（p26）：

| 失敗 | harness 做了什麼 | 結果 | 修法 |
|---|---|---|---|
| context 截斷 | 把最舊的幾輪剪掉 | 忘了「API 不能改」這條規則 | 關鍵規則釘在 context 之外，每次都放回去 |
| 記憶錯誤 | 把過期的筆記當事實取回 | 改了一個已經搬走的檔案 | 記憶帶日期，使用前再查一次 |
| 狀態損壞 | 留著改到一半的檔案 | 後面的步驟建在壞掉的檔案上 | 設 checkpoint，失敗就回滾 |
| 控制迴圈出錯 | 沒設步數或花費上限 | 跑了 200 步沒進展 | 限制步數、花費與時間 |
| fan-out（同時派出多個 sub-agent）卡住 | 每個 sub-agent 都要等 | 一個慢的拖住整個執行 | 設逾時，拿部分結果繼續 |

**模型**（p27）：

| 失敗 | 模型怎麼想 | agent 做了什麼 | 修法 |
|---|---|---|---|
| 幻覺 | 「`requests.fetch()` 存在」 | 呼叫不存在的函式 | 對照真的文件檢查呼叫 |
| 違反指示 | 「速度比 API 重要」 | 改了被要求保留的函式簽名 | 重申限制，檢查 diff |
| 推理錯誤 | 「逾時代表網路斷了」 | 對一個 deadlock 加重試 | 動手修之前先驗證假設 |
| 說的和做的不一致 | 「我只動 parser.py」 | 改寫了另外三個檔案 | 每個動作對照計畫 |
| 沒驗證就宣稱成功 | 「測試應該過了」 | 宣布完成，什麼都沒跑 | 要求附上測試輸出當證據 |
| 長時程退化 | 「config 還要修」 | 把自己第 12 步的修正改回去 | 重讀狀態，拆成短任務 |

**工具**（p28）：

| 失敗 | 工具回了什麼 | agent 做了什麼 | 修法 |
|---|---|---|---|
| 輸出被截斷 | log 的前 100 行 | 沒看到第 4,000 行的錯誤 | 錯誤放最前面，允許分頁 |
| 靜默失敗 | exit code 0、結果是空的 | 以為沒有符合的項目 | 分開「空的」和「失敗」 |
| schema 有歧義 | 一個沒有時區的日期 | 排程差了 8 小時 | 用型別明確的 schema |
| 偶發失敗 | 第一次呼叫逾時 | 宣布服務掛了 | 先退避重試再下判斷 |
| 誤導的錯誤訊息 | 打錯字卻回「Permission denied」 | 改用 sudo 重試 | 回精確、能據以行動的錯誤 |

**環境**（p29）：

| 失敗 | 環境裡有什麼 | agent 做了什麼 | 修法 |
|---|---|---|---|
| 狀態過期 | 昨天的 build 快取 | 在舊程式碼上通過了測試 | 用乾淨的快取重新 build |
| 版本不符 | Python 3.8，不是 3.12 | 交出會當掉的程式 | 用 lockfile 釘住版本 |
| 隨機失敗 | 結果取決於環境 | 碰到閏年就失敗 | 失敗就重跑，把不穩定的測試隔離 |
| 網頁改版 | 結帳頁重新設計過 | 點錯按鈕 | 動作前重讀頁面 |
| 頻率限制 | 50 次呼叫後回 HTTP 429 | 資料搬移做到一半停住 | 限速，長工作設 checkpoint |

讀這五張表時，留意同一個症狀可能來自不同層。「agent 說服務掛了」可能是工具層的偶發逾時，也可能是模型層把逾時誤判成網路問題。要分辨，得回頭看執行軌跡。閱讀清單上的 [Where LLM Agents Fail](https://arxiv.org/abs/2509.25370) 正好講這件事：一個根源錯誤會一路傳下去。最後看起來錯的那一步，往往不是真正出錯的那一步，所以要找的是**第一個**出錯的步驟。這也是[作業 1](/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens) 要你把軌跡畫出來的原因。

找到第一個出錯的步驟之後，可以照這個順序往回問（本文整理的判斷順序，投影片沒有給）：

1. 任務規格有沒有說清楚？
2. 工具有沒有正確處理並回報？例如暫時性的失敗，該不該先重試再回報。
3. harness 有沒有把該給的資訊放進 context？
4. 環境是不是和預期的一樣？
5. 前面都沒問題，模型還是做錯，才是模型層。

以「服務掛了」為例。逾時只是偶發的，重試就會成功；工具沒先退避重試，就把這次逾時交給 agent，是工具層的偶發失敗（p28）。工具回的訊息正確，agent 卻把逾時推論成網路斷線（實際是 deadlock），是模型層的推理錯誤（p27）。

> **自我檢查**：agent 用 `grep` 找某個函式的呼叫處，拿到空的結果，就回報「沒有任何地方呼叫它」，然後把函式刪了。事後發現 `grep` 的路徑打錯，exit code 是 2。這是哪一層的失敗？怎麼修？
> 答：第一個出錯的步驟是工具回傳：它把「失敗」包成「空的結果」交給 agent，是工具層的靜默失敗（p28）。修法是讓工具把「空的」和「失敗」分開回報，例如附上 exit code 與 stderr。模型接著把空結果當成證據，也可以要求它刪除前先用第二種方法確認，但根源在工具層。

### 為失敗而設計

投影片最後把每層的修法收成一張表（p30）：

| 層 | 原則 | 做法 |
|---|---|---|
| 任務規格 | 把「完成」寫成測試 | 事先給驗收測試，列出哪些東西不能改 |
| harness | 每次執行都要有上限 | 限制步數、花費與時間；設 checkpoint 與回滾 |
| 模型 | 要求證據 | 每個宣稱都要附證明；驗證；必要時換更強的模型 |
| 工具 | 失敗要大聲 | 型別明確的 schema；「錯誤」和「空的結果」分開 |
| 環境 | 釘住並隔離 | 全新、版本固定的 sandbox；偶發失敗先重試再下判斷 |

投影片最後一句話是：我們還不了解大規模的 agent，正式的最佳實務也還很少。閱讀清單上的 [Beyond the Leaderboard](https://arxiv.org/abs/2607.05775) 綜合了 27 篇論文，結論之一是：多加外圍的輔助機制（scaffolding）不一定讓 agent 更可靠。上面這些修法是起點，要不要用、有沒有用，得用下一堂的評估方法去量。

## 綜合自我檢查

1. 你要替一個 coding agent 設計「記住這個 repo 的慣例」的記憶。用前面的六個決定加上歸屬逐項回答：什麼值得記、存成什麼樣子、存在哪裡、什麼時候取回、何時歸納、何時遺忘、歸誰管。
   判準：至少答出以下幾點，每項都要附理由。
   - 寫不寫：只記從程式碼推不出來的事，例如團隊偏好、踩過的坑，並用明確的寫入條件，例如使用者糾正時才寫。
   - 表示與儲存：存成一條一條的純文字或結構化條目，放在 repo 旁的檔案，可以 diff、可以審。
   - 取回時機：開場只載入一份短索引，細節在任務需要時才讀。
   - 歸納：同一個糾正出現兩三次才升格成慣例，並標上信心；一次就寫成長期規則是過度歸納。
   - 遺忘：每筆記下寫入日期與出處，慣例改了就把舊條目標成被取代。
   - 歸屬：由 agent 自己管，不必另接記憶服務，因為只有這個 repo 用得到。
2. 一個 agent 在 CI 上修 bug，回報「完成」，但 PR 的測試是紅的。查軌跡發現：它跑了 `pytest`，輸出被工具截在前 100 行，錯誤在第 4,000 行；它看到前面都是 PASSED，就宣布完成。這是哪一層的失敗？
   判準：答出至少兩層。「輸出被截斷」發生在工具就算工具層，發生在 harness 放回歷史時就算 harness 層。修法都是錯誤放最前面、允許分頁；模型層是「沒驗證就宣稱成功」，修法是要求附上完整的測試結果，例如結束碼或摘要行。第一個出錯的步驟是截斷那一步。
3. 一個 50 步的任務，每步成功率 0.95，一次跑成功的機率約多少？如果透過更好的工具設計把步數減到 25 步，每步成功率不變呢？
   判準：0.95⁵⁰ ≈ 0.08；0.95²⁵ ≈ 0.28，約三倍半。並說出「每步獨立」的假設會高估真實的成功率，因為錯誤會傳播。

## 延伸閱讀

- [第 2 堂：Claude Code 怎麼運作](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)：CLAUDE.md 與 auto memory 的使用面。
- [CMU 11-768 第 4 堂：skill 與記憶](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory)：另一門課對同一組概念的講法。
- [系列導讀：AI Agent 記憶工程](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)：本站記憶系列的入口，各種記憶系統的設計空間。
- [Letta／MemGPT 完整介紹](/posts/ai/2026-08-22-letta-memgpt-agent-memory)、[Mem0 完整介紹](/posts/ai/2026-08-22-mem0-agent-memory)、[Zep 完整介紹](/posts/ai/2026-08-22-zep-agent-memory)：本堂提到的三個系統各自怎麼做。
- [Agent 記憶的攻擊面](/posts/ai/2026-09-19-agent-memory-attack-surface)：持續性 prompt injection 的更多例子與防法。
- [Cemri et al., Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657)：閱讀清單上的 MAST，把多 agent 的失敗分成 14 種。
- [Cuadron et al., The Danger of Overthinking](https://arxiv.org/abs/2502.08235)：模型想太多、動手太少的失敗，閱讀清單上的另一篇。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。
- 底本：[第 6 堂投影片](https://cs2680.com/slides/6_agent_design_3.pdf)（PDF 頁序 p5–30）與 [9/28 閱讀頁](https://cs2680.com/readings/sep-28)，2026-10-22 讀取。頁碼一律用 PDF 頁序；投影片角落印的頁碼從 p19 起比 PDF 頁序多 1。
- 產品描述對照 2026-10 的官方文件與 README：Claude Code memory 文件、Mem0 文件、Graphiti 與 supermemory 的 README；與投影片不同之處已在正文標出。benchmark 數字回原論文與 LoCoMo 公開資料核對；LoCoMo-Refined、locomo-audit、Sinha 等人、Ord、MINJA 是本站補充的來源。
- SGLang 例子沿用投影片；「make check」與 CI 的例子、錯誤複利的延伸算術、各表的「能回答的問題」「對應的決定」兩欄，以及各自我檢查的答案，是本站補充，不是課堂內容。

## 參考資料

- [CS2680 第 6 堂投影片：Agent design III: memory and reliability](https://cs2680.com/slides/6_agent_design_3.pdf)
- [CS2680 閱讀：9/28](https://cs2680.com/readings/sep-28)
- [Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Packer et al., MemGPT: Towards LLMs as Operating Systems (2023)](https://arxiv.org/abs/2310.08560)
- [Zhu et al., Where LLM Agents Fail and How They can Learn From Failures (2025)](https://arxiv.org/abs/2509.25370)
- [Beyond the Leaderboard: A Synthesis of Tool-Use, Planning, and Reasoning Failures in Large Language Model Agents (2026)](https://arxiv.org/abs/2607.05775)
- [Claude Code 文件：How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Mem0 文件：How Mem0 Works](https://docs.mem0.ai/core-concepts/memory-types)
- [Graphiti（GitHub）](https://github.com/getzep/graphiti)
- [Rasmussen et al., Zep: A Temporal Knowledge Graph Architecture for Agent Memory (2025)](https://arxiv.org/abs/2501.13956)
- [supermemory（GitHub）](https://github.com/supermemoryai/supermemory)
- [Maharana et al., Evaluating Very Long-Term Conversational Memory of LLM Agents (ACL 2024)](https://aclanthology.org/2024.acl-long.747/)
- [Wu et al., LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory (ICLR 2025)](https://arxiv.org/abs/2410.10813)
- [Tavakoli et al., Beyond a Million Tokens: Benchmarking and Enhancing Long-Term Memory in LLMs (ICLR 2026)](https://arxiv.org/abs/2510.27246)
- [LoCoMo-Refined（GitHub）](https://github.com/mem-eval-suite/LoCoMo_refined)
- [locomo-audit（GitHub）](https://github.com/dial481/locomo-audit)
- [Dong et al., Memory Injection Attacks on LLM Agents via Query-Only Interaction (2025)](https://arxiv.org/abs/2503.03704)
- [Sinha et al., The Illusion of Diminishing Returns: Measuring Long Horizon Execution in LLMs (2025)](https://arxiv.org/abs/2509.09677)
- [Toby Ord, Is there a half-life for the success rates of AI agents? (2025)](https://arxiv.org/abs/2505.05115)
