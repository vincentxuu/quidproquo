# Harvard CS2680 導讀／Reading Harvard CS2680（Part I）

規劃日期：2026-10-21
使用者確認：2026-10-21（弧線、堂次用投影片編號 1–8、第 3／8 堂篇內分兩半、斷崖橋接）
狀態：Part I order 0–11 全部完成（0–7 已上線；8–11 於 2026-10-23 待 push）；Part II（10/19 起的 serving 堂次）投影片公開後另補規劃
研究筆記：`.work/research/harvard-cs2680/research-note.md`（逐堂拆解見同目錄 `lectures-01-04.md`、`lectures-05-08.md`）

目標讀者：會用 LLM API 或 coding agent（Claude Code、Codex）、想從「用 agent」走到「自己設計並優化 agent」的工程師。不假設修過研究所系統課，碰到分散式系統、資料庫、統計、serving 名詞時文章內補橋接。
讀者問題：一個 coding agent 從我打字到改完檔案之間發生了什麼？我自己寫一個要怎麼設計，怎麼知道它好不好、怎麼讓它便宜又快？
母群：Fall 2026 Part I 講師主講且有公開投影片的 8 堂，加上頁面公開的作業 1–3。學生場次（9/21、10/14）、客座（10/5）沒有素材，只在總覽交代。
弧線：用 agent（看得到的行為）→ 拆開 agent（loop、工具、context）→ 自己寫 → 擴成多 agent → 讓它記得、可靠 → 量它 → 讓它便宜又快。這也是原課順序，原課本身就是由使用者視角往設計者視角走，所以不重排。
入口：order 0 課程總覽（這門課教什麼、Part I 八堂與三份作業各在 agent 系統的哪一層、讀完能做到什麼、閱讀路線）。
讀完後讀者能：說出一個 coding agent 的 loop、工具、context、memory 各管什麼；用 pass@k／pass^k 與 $/成功任務 比較兩個 agent；把一個 agent 的成本拆成六個因子並指出該從哪一個下手。

## 堂次編號

課表沒有堂次編號，只有週次與日期；講師投影片檔名自己編號 1–8（`1_intro` … `8_agent_design_5`），跳過學生與客座場次。本系列標題的「第 N 堂」用投影片編號，每篇導言寫原課日期。作業用原課的「作業 N」。

## 總表

| order | 標題草案（中文） | 原課範圍 | 聚焦問題 | 狀態 | 對應來源 |
|---|---|---|---|---|---|
| 0 | 現代 AI 系統：從用 agent 到優化 agent 的學習路線｜Harvard CS2680 課程總覽 | 全課（Part I 為主） | 這門課教什麼、Part I 每段在 agent 系統的哪一層、怎麼讀 | 待寫 | 首頁、policy、L1 p8–14、p40–44 ✅ |
| 1 | Agent 是系統問題：從單次推論到一串工具呼叫｜Harvard CS2680 第 1 堂 | L1（9/2） | 為什麼 agent 不能用「每秒 token 數」衡量，要看什麼 | 待寫 | L1 deck ✅ |
| 2 | Claude Code 怎麼運作：loop、memory、工具與擴充｜Harvard CS2680 第 2 堂 | L2（9/9） | 我送出一句話後，Claude Code 跑了幾次模型、讀了什麼、記住什麼 | 待寫 | L2 deck、readings 9/9 ✅ |
| 3 | 看見 agent 在做什麼：用 stream-json 畫出執行軌跡｜Harvard CS2680 作業 1 | A1 Mads-Lens | 怎麼從 Claude Code 的事件串流看出每一步 | 待寫 | A1 頁 ✅ |
| 4 | 一個人帶多個 agent：subagent、agent teams 與 Programming 3.0｜Harvard CS2680 第 3 堂 | L3（9/14） | 要平行、要分工、要跑很久時各用什麼；不確定性從哪來 | 待寫 | L3 deck、readings 9/14 ✅；Superpowers、Caveman repo 🟡 |
| 5 | 自己設計 agent：工具設計與 context 工程｜Harvard CS2680 第 4 堂 | L4（9/16） | 自己寫 loop 時，給哪些工具、context 怎麼管 | 待寫 | L4 deck、ReAct、Lewis ✅ |
| 6 | 親手寫一個 coding agent harness｜Harvard CS2680 作業 2 | A2 Mads-Loop | 四個工具加一個 loop，怎麼在 SWE-bench Pro 上跑起來不崩 | 待寫 | A2 頁 ✅ |
| 7 | 多 agent 架構：拓撲、任務切分與 agent 之間的通訊｜Harvard CS2680 第 5 堂 | L5（9/23） | 什麼時候該拆成多 agent、拆了之後誰指揮誰、訊息怎麼傳 | 待寫 | L5 deck、Anthropic multi-agent、Cognition ✅ |
| 8 | Agent 的記憶與可靠度：寫什麼、記多久、錯在哪一層｜Harvard CS2680 第 6 堂 | L6（9/28） | memory 的每個決定點怎麼選；agent 失敗時怎麼歸因 | 待寫 | L6 deck、MemGPT ✅ |
| 9 | 怎麼評估 agent：benchmark、pass@k 與資料洩漏｜Harvard CS2680 第 7 堂 | L7（9/30） | 一個 agent 好不好要怎麼量，數字什麼時候不可信 | 待寫 | L7 deck、eval note ✅ |
| 10 | 讓 agent 便宜又快：成本拆解、關鍵路徑與 harness 架構｜Harvard CS2680 第 8 堂 | L8（10/7） | 成本從哪來、該砍哪一項；延遲卡在哪；harness 怎麼組 | 待寫 | L8 deck、cost note ✅ |
| 11 | 在不掉分的前提下省錢省時間：成本優化競賽｜Harvard CS2680 作業 3 | A3 Mads-Opt | 解題數、成本、時間三個指標怎麼一起排名，該怎麼取捨 | 待寫 | A3 頁、A3 deck、L7 p35 ✅ |

## 斷崖處理

| 位置 | 問題 | 處理 |
|---|---|---|
| order 1 | 第一堂就丟出 prefill/decode、KV cache、TP/PP、NCCL 等 serving 名詞，Part II 才講 | 寫成「地圖」：每個名詞一句話說它在 stack 哪一層，標「Part II 才展開」，延伸連 CMU 11-868 |
| order 1→2 | 原訂的 LLM basics 堂延後，L2 起把 LLM 當黑盒 | order 2 開頭補「一次 API call 長什麼樣」：messages、tool schema、token、context window，一個最小 JSON 例子；想深入連 CS2680 transformers note 與站內 CS146S agent internals |
| order 2 | 「prefix-cache reads 佔大部分成本」一句帶過 | 一段白話：同樣開頭不必重算但仍計費；詳細留給 order 10 |
| order 4 | 一份 deck 四段且跳躍大 | 一堂一篇，用兩個 H2 半場：「擴展你自己：plugin 案例與三個 scaling 軸」「Programming 3.0：不確定性與委派」；導言交代兩半關係（第一半是怎麼放大產出，第二半是放大後輸出變得不確定該怎麼辦） |
| order 4 | Caveman 的 local proxy 需要懂「agent 每一步都是一個 HTTP request」 | 回扣 order 2 補的 API call 例子 |
| order 4→5 | 從「用 Claude Code」跳到「自己寫 loop 的 pseudo-code」 | order 5 開頭把 order 2 的 U M₁ T₁ … 軌跡改寫成 20 行 loop，對照兩者 |
| order 5 | embedding、LSP、AST 各一頁帶過；L4 p42 用到 prefill/decode | 各一句白話＋站內連結；prefill/decode 一句話定義 |
| order 7 | at-most-once、idempotency、partial failure 只點名 | 橋接小節：用「兩個 agent 同時改同一檔案、訊息重送」走一個例子 |
| order 8 | 一次列出 Redis、Postgres、pgvector、Neo4j 等四類儲存 | 一張「四種 store 各擅長回答什麼查詢」小表；前半 memory、後半 reliability 用 L6 p26「把過期筆記當事實」接起來 |
| order 9 | eval note 的 pass@k 不偏估計、paired bootstrap 需要機率與組合數 | 投影片層級用文字定義；估計式放 `<details>`，附手算例；統計背景連站內 CS109 導讀 |
| order 10 | prefix cache／KV cache 機制要到 Part II 才講；前後兩半無轉場 | 橋接段講 cache 命中條件（為何把時間戳放進 prefix 會讓 cache 失效）；兩個 H2 半場「成本與速度」「harness 架構」，用「優化完的 agent 要放進什麼結構」轉場 |
| 跨篇 | 失敗分類三套 | 主線用 order 8 的五層歸因（spec／harness／model／tool／environment）；order 7 的分解失敗當成 harness 層的子類；MAST 放延伸 |

## 範圍卡

Order 0：現代 AI 系統：從用 agent 到優化 agent 的學習路線｜Harvard CS2680 課程總覽
  聚焦問題：這門課教什麼、Part I 每段在學什麼、我該怎麼讀？
  邊界：講課程主線（同一個 agent 系統由上往下）、Part I 八堂與三份作業的一句話機制、Part II 預告、先備與閱讀路線、材料限制（無錄影、Part II 投影片未出、A4/A5 未公開）併進閱讀路線段。不講：配分沿革、選課人數、各堂細節。
  讀完後讀者能：指出自己卡在 agent stack 的哪一層，挑出要先讀的兩三篇。
  原課範圍：全課；Part I 9/2–10/14。
  例子／推導：（2026-10-21 審稿後改）agent 修測試走 5 步、開場 10k、每步 +1k，總共重讀 60k token（最終 context 的四倍多），串起第 2、4、8 堂與 Part II 的 prefix cache。原訂的 stack 定位例改由主線段的分層圖承擔。
  自我檢查與答案／判準：「你的 agent 每次都能跑完但太貴，該先讀哪篇？」答：order 10（成本拆解），作業練習看 order 11。
  前置：無。
  連結：課程地圖相關 → CMU 11-768 總覽（範圍相近，各自講完整）。

Order 1：Agent 是系統問題：從單次推論到一串工具呼叫｜Harvard CS2680 第 1 堂
  聚焦問題：為什麼 agent 不能用每秒 token 數衡量，要看什麼？
  邊界：講 AI systems 與 AI/ML 的分工、agent 定義（plan→act→observe→adapt→deliver）、agent 當新型電腦的類比、agent serving 和一般 serving 的差別、stack 五層、要量 task success 與 $/成功任務、workload 特性對系統問題的十組對照、本課九個問題。不講：serving 名詞的機制（Part II）、浮點非結合律的數值細節（一段帶過）。
  讀完後讀者能：拿一個 agent 任務說出它在哪幾個 workload 特性上會造成系統問題，並用 $/成功任務 比較兩個 agent。
  原課範圍：L1 2026-09-02，p27–45（p1–26 行政與調查不寫）。
  例子／推導：本文教學例子。Agent A 每任務 $0.50、成功率 60% → $0.83／成功；Agent B $0.80、90% → $0.89／成功。A 每任務便宜但每次成功只便宜一點；再加上失敗要人工重來的成本，結論就翻轉。
  自我檢查與答案／判準：「batching 提高 throughput 為什麼可能傷 agent？」判準：答出 agent 每步要等上一步結果（依賴鏈），batch 等湊滿的延遲會疊加到每一步。
  前置：order 0。
  連結：serving 名詞 → CMU 11-868 serving 篇；agent 定義 → CMU 11-768 第 1 堂。

Order 2：Claude Code 怎麼運作：loop、memory、工具與擴充｜Harvard CS2680 第 2 堂
  聚焦問題：我送出一句話後，Claude Code 跑了幾次模型、讀了什麼、記住什麼？
  邊界：講 agentic loop、開場前已有的 context、model proposes／harness executes、一個 turn 多次 inference、permission、compaction；CLAUDE.md 與 auto memory；六類核心工具；skill／MCP／hook／plugin 四種擴充與掛點。不講：MCP gateway 與協定細節（p44–52 optional，只放延伸）。產品行為寫文當天對照官方文件並標查證日期。
  讀完後讀者能：畫出一次「修好這個測試」的 U M₁ T₁ … A 軌跡，並判斷一條規則該寫進 CLAUDE.md、skill 還是 hook。
  原課範圍：L2 2026-09-09，p4–42。
  例子／推導：本文教學例子。「修好 test_login」→ M₁ 發 Grep、T₁ 回 3 個檔案 → M₂ Read → M₃ Edit → M₄ Bash pytest → M₅ 回答：5 次 inference、4 次工具；標出每步 context 增加什麼。
  自我檢查與答案／判準：「每次 commit 前一定要跑 lint」該用哪個機制？答：hook（skill 只是可用，不保證被用；hook 綁事件一定執行）。
  前置：order 1；橋接：一次 API call 的最小 JSON。
  連結：Claude Code 深入介紹〈how it works〉、〈prompt caching〉；CS146S agent internals。

Order 3：看見 agent 在做什麼：用 stream-json 畫出執行軌跡｜Harvard CS2680 作業 1
  聚焦問題：怎麼從 Claude Code 的事件串流讀出每一步做了什麼、花了多少？
  邊界：講 `claude -p --output-format stream-json --verbose` 的事件種類、tool_use 與 tool_result 怎麼配對、subagent 樹、`--resume`、result event 的 cost／duration／turns；作業要求與交件方式。不講：官方解答、網頁框架選型。
  讀完後讀者能：拿一段 stream-json 輸出，重建出 order 2 那種軌跡並算出步數與成本。
  原課範圍：A1，9/2 發、9/20 截止。
  例子／推導：一段五個事件的 stream-json 樣本（本文自擬，欄位照 A1 頁與官方文件），逐行標出對應 order 2 的哪一步。
  自我檢查與答案／判準：「同一個 tool_use_id 出現兩次 tool_result 代表什麼？」判準：能說出要依 id 配對、並指出這不是正常流程要檢查 log。
  前置：order 2。
  連結：Claude Code 深入介紹〈headless mode〉。

Order 4：一個人帶多個 agent：subagent、agent teams 與 Programming 3.0｜Harvard CS2680 第 3 堂
  聚焦問題：要平行、要分工、要跑很久時各用什麼；agent 寫程式的不確定性從哪來？
  邊界：前半講 Superpowers（同模型不同流程、process skill、SessionStart hook）、Caveman（雙向 token 壓縮、為何要 proxy）、三個 scaling 軸、worktree、subagent、agent teams、dynamic workflow、`/goal` 與 `/loop`；後半講講者的 Programming 1.0/2.0/3.0（和 Karpathy 的 Software 3.0 分開）、不確定性四個來源、DEFINE／CONTROL／VERIFY 三組做法、OpenAI 使用數據與 Delegation Ladder。不講：16 agents 寫 C compiler 細節（延伸）、CLI agent 生態圖。
  讀完後讀者能：給一個任務選對 scaling 軸（平行／subagent／長時間），並說出一個 agent 產出結果不穩定的來源在哪一層。
  原課範圍：L3 2026-09-14，p5–68。
  例子／推導：本文教學例子。三個互不相依的 bug 用三個 worktree 平行修，牆鐘時間 ≈ 最慢那個，但 merge 和你審查的時間沒有變少；換成同一個大重構就不能平行。
  自我檢查與答案／判準：「subagent 和 agent teams 差在哪？」判準：答出 teammate 之間能透過共享任務清單與 mailbox 互相溝通，subagent 只回報給主 agent。
  前置：order 2。反證補搜：multi-agent coding productivity criticism / failed。
  連結：Claude Code 深入介紹〈agent teams〉〈multi-agent overview〉。

Order 5：自己設計 agent：工具設計與 context 工程｜Harvard CS2680 第 4 堂
  聚焦問題：自己寫 loop 時，該給哪些工具、context 怎麼管？
  邊界：講 ReAct、loop pseudo-code、harness designer 的工作、三元件；search/read 四法、edit 四法的 token 成本與穩健度、shell 的威力與風險、工具設計原則；prompt→context→harness→goal engineering 的用語演進；prompt 技巧（明說是詞彙與歷史）；context 是有限資源、四種管理手段、五種 context 失敗；Agent = Model × Harness。不講：Reflexion 等 Beyond ReAct（延伸）。
  讀完後讀者能：替一個新 agent 選一組工具並說出理由，並把一個 context 問題歸到五種失敗之一、選對管理手段。
  原課範圍：L4 2026-09-16，p4–53。
  例子／推導：本文教學例子。改 500 行檔案的一行：whole-file 要輸出約整個檔案的 token；search/replace 只輸出新舊兩段，但 old_string 不唯一就失敗，要回一個「教得會」的錯誤訊息。
  自我檢查與答案／判準：「為什麼 `search_orders(customer_id)` 比 `run_sql` 好？」判準：答出可用範圍小、輸出可控、錯誤可預期，且 token 便宜。
  前置：order 2；橋接：把 order 2 的軌跡改寫成 20 行 loop。SWE-agent 消融數字回原論文查，查不到不用。
  連結：CMU 11-768 第 2 堂（tool use）、第 3 堂（context management）；AI Agent 實戰〈context engineering〉。

Order 6：親手寫一個 coding agent harness｜Harvard CS2680 作業 2
  聚焦問題：四個工具加一個 loop，怎麼在 SWE-bench Pro 上跑起來而且不崩？
  邊界：講作業規格（qwen3.6-35b-a3b、`api.cs2680.com`、四個工具、Docker task container、log schema、10 題含不可解）、作業頁「不要照抄 Part 0/1」的意思、要處理的失敗（壞輸出、壞工具、步數上限）、怎麼建自己的評估集。不講：官方解答、完整程式碼。
  讀完後讀者能：列出自己 harness 要處理的五種失敗並各寫一條處理策略。
  原課範圍：A2，9/21 發、10/4 截止。
  例子／推導：本文教學例子。模型回了 JSON 少一個括號的 tool call → harness 不 crash，回一則說明哪裡錯的 tool message，下一步模型重送；對照直接 raise 的後果。
  自我檢查與答案／判準：「10 題裡有題目不可解，怎麼知道自己的 harness 是不是夠好？」判準：答出看失敗原因分類（模型能力 vs harness 處理），而非只看解題數。
  前置：order 5。
  連結：CMU 11-768 作業 1（harness）。

Order 7：多 agent 架構：拓撲、任務切分與 agent 之間的通訊｜Harvard CS2680 第 5 堂
  聚焦問題：什麼時候該拆成多 agent，拆了之後誰指揮誰、訊息怎麼傳？
  邊界：講拆的四個理由、control／task／communication 三張圖、八種架構與混合、任務切分六法與粒度公式、六種切分失敗、通訊四維度、通訊是分散式系統問題、A2A 與 MCP 分工、四條設計原則（第一條「真的需要多 agent 嗎」配 Cognition 反方）。不講：A2A 協定欄位細節。
  讀完後讀者能：用粒度公式判斷一個任務拆不拆，並為選定的拆法指出最可能的通訊失敗。
  原課範圍：L5 2026-09-23，p5–44。
  例子／推導：本文教學例子。單 agent 30 分鐘；拆三個：planning 2＋關鍵路徑 10＋通訊 3＋merge 5＝20 分鐘，划算；若子任務互相依賴、關鍵路徑變 25，總和 35，不划算。
  自我檢查與答案／判準：「worker 回報訊息送了兩次，supervisor 會怎樣？」判準：答出要 idempotent（同一結果重收不重做）或帶 id 去重。
  前置：order 4（使用面）；橋接：分散式系統三種送達語意。
  連結：Multi-Agent 系統實戰〈orchestration patterns〉；Agent 生產線〈MCP、A2A、skills 協定層〉。

Order 8：Agent 的記憶與可靠度：寫什麼、記多久、錯在哪一層｜Harvard CS2680 第 6 堂
  聚焦問題：memory 的每個決定點怎麼選；agent 失敗時怎麼知道錯在哪一層？
  邊界：前半講 memory 六步（寫不寫、怎麼編碼、存哪、何時取、怎麼歸納、更新與遺忘）＋誰擁有、valid time 與 provenance、Mem0／Graphiti／supermemory 比較、八種 memory 失敗、怎麼評估；後半講錯誤複利、五層故障歸因與各層修法、designing for failure。不講：各資料庫的操作細節。
  讀完後讀者能：替一個 agent 寫出 memory 設計 checklist 的答案，並把一個失敗案例歸到五層之一。
  原課範圍：L6 2026-09-28，p5–30。
  例子／推導：每步成功率 0.95、20 步全對的機率 0.95²⁰ ≈ 0.36；把步數砍到 10 步 ≈ 0.60，或把每步提到 0.99 → 20 步 ≈ 0.82。
  自我檢查與答案／判準：「agent 照著三週前的筆記用了已刪除的 API」是哪一層失敗、怎麼修？判準：memory（過期筆記）；修法是 valid time／provenance 或遺忘策略。
  前置：order 2（CLAUDE.md、auto memory）、order 5（compaction）。橋接：四種 store 小表。
  連結：CMU 11-768 第 4 堂（skills、memory）；AI Agent 記憶工程系列。

Order 9：怎麼評估 agent：benchmark、pass@k 與資料洩漏｜Harvard CS2680 第 7 堂
  聚焦問題：一個 agent 好不好要怎麼量，什麼時候數字不可信？
  邊界：講 component 與 end-to-end、五種「成功」定義、指標（pass@k、pass^k、cost、latency）、benchmark loop 三件套、八個代表 benchmark 各量什麼、leakage 四層、single-turn 的盲點、非決定性與副作用、benchmark 飽和；eval note 的不偏估計與 paired bootstrap 放折疊。不講：note 的 48 個 benchmark 目錄、METR logistic 擬合細節。
  讀完後讀者能：拿一組重複試驗結果算 pass@k 與 pass^k，並說出一個 benchmark 分數可能被灌水的方式。
  原課範圍：L7 2026-09-30，p5–34；notes/agent-evaluation。
  例子／推導：5 次試驗成功 3 次：pass@2 ＝ 1 − C(2,2)/C(5,2) ＝ 0.9；pass^2 ＝ C(3,2)/C(5,2) ＝ 0.3；直接用 0.6² ＝ 0.36 會高估。
  自我檢查與答案／判準：「客服 agent 該看 pass@k 還是 pass^k？」答：pass^k，因為每位使用者都要成功，不是試 k 次有一次成功就好。
  前置：order 8；統計背景連 CS109。反證補搜：benchmark contamination agent、SWE-bench criticism。
  連結：CMU 11-768 作業 2（eval）；Stanford CS329A 第 17 堂（long-horizon eval）。

Order 10：讓 agent 便宜又快：成本拆解、關鍵路徑與 harness 架構｜Harvard CS2680 第 8 堂
  聚焦問題：agent 的成本從哪來、該砍哪一項；延遲卡在哪；harness 怎麼組？
  邊界：前半講成本公式六個因子、四個縮減槓桿（turns、steps、tokens、price per token：caching、batching、routing）、每項節省的反成本、預算上限、關鍵路徑、平行與 speculative actions、在 loop 中優化；後半講三種 harness 架構（monolithic／modular／microkernel）與 7 個 harness 的設計取向。不講：Part II 的 serving 技術（只預告）。
  讀完後讀者能：拿一段 agent session 的 token 帳單，指出最大的成本因子並提出一個不掉成功率的改法。
  原課範圍：L8 2026-10-07，p5–53；notes/cost-effective-agents。
  例子／推導：本文教學例子。接續總覽的 60k 重讀帳，用 L8 p21 的價格比（cached input 0.1×、base input 1×、output 5×）算一張帳單：prefix 穩定 vs 每步開頭插入時間戳讓 cache 失效，兩種情況各要付多少；再用成本乘式指出哪個因子最大。（避免與總覽的例子重複，2026-10-21 改）
  自我檢查與答案／判準：「把現在時間寫進 system prompt 開頭有什麼後果？」答：prefix 每次都不同，cache 每次都失效，成本回到完整輸入價。
  前置：order 1（$/成功任務）、order 9（Pareto、cost 指標）。橋接：prefix cache 命中條件。8 個 harness 的現況寫文當天查各 repo。
  連結：Claude Code 深入介紹〈prompt caching〉；CMU 11-868 KV cache 篇；跟成熟 coding agent 學設計系列。

Order 11：在不掉分的前提下省錢省時間：成本優化競賽｜Harvard CS2680 作業 3
  聚焦問題：解題數、成本、時間三個指標怎麼一起排名，該怎麼取捨？
  邊界：講框架（agent container 與 task container 分離、sandbox HTTP API、Expert／Standard／Starter 三模型）、限制（每 run $10、每天 $30、35 分鐘）、Pareto 排名與計分、order 10 每個槓桿在本作業怎麼用。不講：排行榜上的具體解法、官方解答。
  讀完後讀者能：算出一組提交的 Pareto 排名，並列出自己 agent 要先試的三個優化。
  原課範圍：A3，10/5 發、10/20 截止；slides/8_assignment3；L7 p35。
  例子／推導：本文教學例子。A（20 題，$0.30／題，120 秒）、B（18 題，$0.20，100 秒）、C（17 題，$0.35，150 秒）：C 被 A、B 都支配，排名 3；A、B 互不支配，都是第 1。分數 max(81 − r, 50)：A、B 80，C 78。
  自我檢查與答案／判準：「把模型全換成 Starter 成本大降但少解 3 題，排名一定變好嗎？」答：不一定，要看是否仍有人在三個指標都不差於你。
  前置：order 9、order 10。
  連結：order 6（同一個 harness 往下改）。

## 站內前置知識連結

- LLM API／agent loop 基礎 → CS146S agent internals、CMU 11-768 第 1 堂
- serving、KV cache → CMU 11-868 serving 篇
- 機率與組合數 → Stanford CS109 導讀
- Claude Code 產品細節 → Claude Code 深入介紹系列

## 研究足夠的判準

規劃階段五關結果見研究筆記「研究足夠的五關」：一手來源、證據類型、時效、飽和已過；反證在規劃階段只有課程自帶的兩處（Cognition、過期 prompt 技巧），其餘各篇動筆前依範圍卡的關鍵字補搜。每篇動筆前另補：該篇引用的閱讀原文（🟡 → ✅）、產品行為對照官方文件、帶數字的主張回原論文。

## 驗收

每篇：`.work/reviews/<slug>.md` 有 post-verify、post-review、post-polish 三節；獨立審稿；`check-course-titles.mjs` 與 `check-course-guide-layout.mjs` 帶整系列路徑跑；登錄 `src/utils/series.ts`（`harvard-cs2680`）與 `src/data/course-series-titles.json`（officialName：Modern AI Systems: Agents and System Optimizations）；push 前 `pnpm build`。
第一批：order 0＋order 1，交使用者看過再往下。
