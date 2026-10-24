---
title: "一個人帶多個 agent：subagent、agent teams 與 Programming 3.0｜Harvard CS2680 第 3 堂"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, claude-code, coding-agent, multi-agent, subagent, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 4
tldr: "CS2680 第 3 堂（2026-09-14）前半講怎麼把自己放大：先用 Superpowers 與 Caveman 兩個 plugin 看 skill、hook、proxy 怎麼搭，再講三種擴充方向：平行開多個 agent 買牆鐘時間、派 subagent 買專注、讓 agent 跑很久買範圍。後半講放大之後的代價：用自然語言叫 agent 寫程式，不確定性會從語意、context、模型取樣、工具環境四層滲進來，對策是先講清楚、提案與執行分開、緊縮驗證。本文用「三個 bug 開三個 worktree」算一次平行到底省了什麼。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）第 3 堂導讀：Superpowers 的流程 skill 與 SessionStart hook、Caveman 的雙向壓縮與 proxy、三個 scaling 軸、git worktree、subagent、agent teams、dynamic workflow、/goal 與 /loop，以及講者的 Programming 3.0、不確定性四層來源與 OpenAI 的使用數據。依據公開投影片，產品行為對照 2026-10 的 Claude Code 官方文件。"
draft: false
glossary:
  - term: "git worktree"
    aliases: ["worktree"]
    definition: "同一個 git repo 底下的另一個工作目錄，各自 checkout 一個分支，共用同一份歷史。兩個 agent 各在一個 worktree 改檔，就不會踩到對方的檔案。"
    context: "第 3 堂用它做手動平行：一個任務一個 session、一個 worktree。"
  - term: "agent teams"
    aliases: ["agent team"]
    definition: "Claude Code 的實驗功能：一個 lead session 開出幾個 teammate，大家共用一份任務清單，teammate 之間可以直接傳訊息。預設關閉。"
    context: "第 3 堂拿它和 subagent 對照：subagent 只把結果交回給呼叫它的 agent。"
  - term: "proxy"
    aliases: ["reverse proxy", "本機 proxy"]
    definition: "夾在 agent 和模型服務之間的一個小伺服器。agent 把 API 位址指向它，它收到每一次請求後可以改寫內容，再轉給真正的模型服務。"
    context: "第 3 堂的 Caveman 用它在模型讀到工具輸出之前先壓縮。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent-en)

**影片狀態：課程不錄影。** 本文依公開投影片整理，數值例子為本站補充。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 第 3 堂在 2026 年 9 月 14 日上課，投影片標題是〈Agent From a User's Perspective II: Multi-agent and Best Practice〉（[投影片](https://cs2680.com/slides/3_agent_use_2.pdf)）。[第 2 堂](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)拆開了一個 agent 的 loop、記憶和四種擴充；這堂還是站在使用者這一側，問的是一個人能不能同時帶好幾個 agent。

這堂分成兩半。前半講怎麼放大產出：先看兩個 plugin 怎麼用 skill、hook 和 proxy 改變 agent 的行為，再看三種擴充方向，以及 Claude Code 為每一種準備的工具。後半講放大之後的問題：用自然語言叫 agent 寫程式，同一句話每次跑出來的結果不一定一樣，這份不確定要怎麼管。

讀完之後，你應該能替一個任務選對擴充方向（平行、subagent、跑很久），也能在一個 agent 的結果忽好忽壞時，說出問題可能出在哪一層。

投影片的頁碼一律用 PDF 頁序。p47–50 的 C compiler 案例和 p70 之後的 CLI agent 生態圖是選讀，本文只簡短交代前者。投影片裡有不少 Claude Code 的產品細節，本文以 2026 年 10 月的官方文件為準，不同處直接標出。

## 前半：把自己放大

### Superpowers：同一個模型，換一套流程

第一個案例是 [Superpowers](https://github.com/obra/superpowers)，一個軟體開發用的 plugin（p5）。它想解決的是：agent 拿到「幫我加登入功能」，通常直接開始寫，寫錯了再一輪一輪修。Superpowers 把這條路改成先釐清需求、等你核准設計、寫出細部計畫、用測試驅動開發、審查與驗證，最後才收尾合併分支（p6）。投影片下面那一行是這個案例的重點：兩個 agent 用同一個模型、同一組工具，只有指示不一樣。

這些指示寫成一個個 skill。投影片列了九個（p7）；到 2026 年 10 月，repo 裡已經有 15 個，多了派 subagent 執行計畫、平行派工、寫 skill 等幾個。它們是「流程 skill」：除了做法，還寫明什麼時候進來、必須做什麼、禁止做什麼、哪裡要等人核准、交差前要拿出什麼證據，以及做完之後該接哪一個 skill（p10）。例如 brainstorming 的最後一步就是「呼叫 writing-plans」（p9）。

問題是，裝了 skill 不等於 agent 會去用。投影片的說法是：裝好只代表可用，不保證 agent 會去查（p11）。[第 2 堂](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)講過原因：skill 開場只放描述，要不要載入是模型自己判斷。Superpowers 的做法是掛一個 SessionStart hook，matcher 設成 `startup|clear|compact`：新 session 開始、你下 `/clear`、context 壓縮之後，都會重跑一次（p11）。hook 執行的腳本讀出「using-superpowers」這個引導 skill 的全文，用 `hookSpecificOutput.additionalContext` 交給 Claude Code，Claude Code 把它放進 context（p12）。這個引導 skill 告訴 agent：動手之前先查有沒有適用的 skill。

所以分工是這樣：skill 提供行為，hook 保證行為的入口一定在 context 裡，plugin 負責打包和安裝（p8、p14）。這正是第 2 堂說的「skill 是可用、hook 是保證」。

> **自我檢查**：如果 Superpowers 的 hook 只在 `startup` 時執行，一個跑很久、中途自動壓縮過的 session 會出什麼事？
> 答：壓縮會把舊對話摘要掉，開場注入的引導 skill 可能被壓成一句話或消失，之後 agent 可能不再先查 skill，直接開始寫。matcher 加上 `compact`，就是要在壓縮後把它重新放回 context。

### Caveman：同時壓模型寫的和模型讀的

第二個案例 [Caveman](https://github.com/JuliusBrussee/caveman) 處理的是 token（p15）。投影片的例子是一次 `npm test` 印出 786 行，真正有用的只有一句「3 個測試失敗，client.ts:88 連線逾時」（p16）。這 786 行進了 context 之後，後面每一次模型呼叫都要再讀一次，壓縮時又可能把真正重要的細節擠掉。

Caveman 從兩個方向壓（p17）：

- **模型寫的（output）**：一個回應風格的 skill，要模型省掉客套、重複和含糊的修飾，但技術名詞、指令、路徑、程式碼、錯誤訊息、數字和否定詞一律保留（p20）。
- **模型讀的（input）**：一個本機 proxy，在工具輸出送到模型之前先壓縮。不同類型保留不同部分，例如 log 留錯誤、stack trace 和頭尾，diff 留檔名、hunk 標頭（diff 裡標出改動位置的 `@@` 行）和改動的行（p24）。原文留在本機，模型需要時可以透過 MCP 工具 `caveman_retrieve` 原樣取回（p23）。

為什麼 input 這一側要用 proxy？回想第 2 堂[補的那一塊](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works#先補一塊一次模型呼叫長什麼樣)：agent 的每一步都是一次完整的 API 請求，把 system prompt、工具定義和整段 `messages` 送給模型服務。proxy 就站在這條線上：你把 agent 的 API 位址指到本機的 proxy，它收到每一次請求、改寫內容，再轉給真正的模型服務（[proxy README](https://github.com/JuliusBrussee/caveman/blob/main/proxy/README.md)）。MCP 工具只有在模型呼叫它時才會執行，改不到模型下一次讀到什麼（p24）。

投影片說 hook 沒辦法透明改寫送給模型的請求，所以需要 proxy（p24）。現行的 [hook 文件](https://code.claude.com/docs/en/hooks)已經多了一條路：PostToolUse hook 可以用 `updatedToolOutput` 把單一工具的結果換掉，再交給 Claude。不過 hook 還是改不到整個請求，例如已經在對話裡的舊工具輸出；要重寫整段請求，仍然得站在 agent 和模型服務之間。投影片也補了一句：自己寫 harness 的話，這些都可以直接在 loop 裡做。

省多少？投影片引用的是「output token 少 65%」，同時提醒 skill 本身會增加 input token，所以整個 session 省得比較少（p17）。之後的量測把這個數字拉低了很多。[JetBrains](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) 專門測了這個 65%：在 SkillsBench 的 86 個任務上配對比較，output 只少 8.5%，分數沒有可量測的差別。他們的解釋是：agent 的輸出大多是程式碼、diff 和工具呼叫，這些 Caveman 本來就原樣保留，能壓的只有工具呼叫之間的說明文字。所以拿這類數字之前，先看比較的基準是什麼。

<details>
<summary>Caveman README 自己的量測：基準換成「請簡潔回答」</summary>

Caveman 的 [README](https://github.com/JuliusBrussee/caveman) 用 Opus 5.5 回答十個開發問題，分四種指示量 output token（十題合計）：

| 指示 | output token |
|---|---:|
| 不加任何指示 | 6,983 |
| 「Answer concisely.」 | 4,334 |
| `/caveman` | 4,119 |
| `/ultracave` | 2,693 |

光是一句「請簡潔回答」就少了約 38%，`/caveman` 的節省幾乎都來自這一句。README 的結論是：以逐題中位數計，`/caveman` 比這句話只再少 3%（表中是合計，算出來約 5%）。這份規則本身還要佔約 1,160 個 input token。

</details>

Caveman 用齊了第 2 堂的五種機制再加一個 proxy（p25）：

| 機制 | 在 Caveman 裡做什麼 |
|---|---|
| skill | 簡潔的回應風格、寫 commit 訊息與 review 的專用流程 |
| command | `/caveman ultra`、`/caveman off` 這類由你明確切換的開關 |
| hook | SessionStart 決定這個 session 的模式，UserPromptSubmit 偵測你中途說「改回正常模式」 |
| MCP | 壓縮、取回原文、統計、JSON 與 [TOON](https://github.com/toon-format/toon)（一種給 LLM 讀、比 JSON 省 token 的格式）互轉 |
| plugin | 把以上全部打包成一次安裝 |
| proxy | 攔下每一次送往模型服務的請求，壓縮工具輸出 |

> **自我檢查**：Caveman 為什麼不只做一個 MCP 工具，讓模型自己決定要不要壓縮 log？
> 答：MCP 工具要模型主動呼叫才會執行，而 786 行的 log 在模型決定呼叫之前就已經進了 context，之後每一步都要再讀。要在模型讀到之前就壓掉，得攔在工具輸出進 context 的路上：現行 Claude Code 的 PostToolUse hook 能換掉這一筆新結果；要連已經在對話裡的舊輸出一起壓，或用在不支援這個欄位的 agent 上，就要 proxy。

### 三個擴充方向

講完兩個 plugin，投影片轉到「怎麼用多個 agent 把自己變成 100 倍工程師」，封面那一頁寫著：agent 平行展開，帳單也一起展開（p26）。講者把擴充分成三個方向（p27）：

| 方向 | 做法 | 買到的 | 買不到的 |
|---|---|---|---|
| 平行（廣度） | 好幾個互不相依的任務同時跑，各在一個獨立的工作目錄 | 牆鐘時間（從開始到結束實際經過的時間） | 答案品質 |
| subagent（廣度加深度） | 把一件邊界清楚的事交給一個全新的 context，只拿回摘要 | 時間，加上主對話的專注：主 agent 看不到中間的雜亂過程 | 主對話的來回討論 |
| 跑很久（時間長度） | 讓一個 agent 跨很多步做完一件大工作 | 範圍：同樣的介入次數做更多事 | 每一步都有人看 |

Agent teams 和 dynamic workflow 是把這幾個方向組合起來（p27）。下面依序看。

### 手動平行：一個任務一個 worktree

最簡單的平行是自己開好幾個終端機，一個任務一個 Claude Code session。每個 session 待在自己的 [git worktree](https://code.claude.com/docs/en/worktrees)，也就是同一個 repo 的另一個工作目錄：有自己的分支，共用同一份歷史（p28–29）。`claude -w bugfix-auth` 會在 `.claude/worktrees/bugfix-auth/` 建一個 worktree、開一個新分支，再在裡面啟動 Claude。這樣不用 stash，也不用再 clone 一份，一個 session 改的檔案碰不到另一個。

投影片說桌面版的每個新 session 都會自動拿到 worktree（p28）。現行的[桌面版文件](https://code.claude.com/docs/en/desktop)寫的是預設關閉，要在開 session 之前自己打開 Worktree 開關。

平行到底省了什麼？下面是本文的教學例子，數字是假設的。你手上有三個互不相關的 bug，各自交給 agent 處理的時間是 20、35、50 分鐘，每份改動你審查要 10 分鐘。

| | agent 全部跑完 | 你審查的總時間 | 到三份都審完 |
|---|---|---|---|
| 一個 session 依序做，每份一完成就審 | 20 + 35 + 50 = 105 分鐘 | 3 × 10 = 30 分鐘 | 105 + 10 = 115 分鐘 |
| 三個 worktree 同時做，每份一完成就審 | 最慢那個，50 分鐘 | 還是 30 分鐘 | 50 + 10 = 60 分鐘 |
| 三個 worktree，剛好同時完成（例如三個都要 50 分鐘） | 50 分鐘 | 還是 30 分鐘 | 50 + 30 = 80 分鐘 |

牆鐘時間由最慢的那個決定，agent 那一段從 105 分鐘降到 50 分鐘。依序做時，你審前一份的同時 agent 已經在做下一份，所以只有最後一份要多等 10 分鐘。平行做時，三份如果剛好同時完成，三次審查就要排隊；agent 開得越多，越容易撞在一起，你的審查就成了排隊的地方。你審查的總時間一分鐘都沒有少，三個分支還要你決定合併順序。換成一個要改動全 repo 的大重構，就沒辦法這樣拆：三個 session 會改到同一批檔案，合併時衝突全落在你身上。

這也是手動平行的上限（p30）：計畫只存在你腦中、session 之間看不到彼此的發現、分支要你自己合、整個過程沒有記錄所以沒辦法重跑。投影片的說法是三個 session 你還顧得來，二十個就需要一個你的分身。

> **自我檢查**：上面的例子如果改成三個 bug 都在同一個檔案的同一個函式裡，還適合開三個 worktree 嗎？
> 答：不適合。三份改動會在同一段程式碼衝突，合併的成本可能比平行省下的時間還多；這種情況用一個 session 依序修，或讓一個 agent 一次處理。

### Subagent：把雜事交出去，只拿回摘要

[Subagent](https://code.claude.com/docs/en/sub-agents) 是一個有自己 context window、工具和權限的專門助手（p31）。它有五個好處（p31）：

- 搜尋結果和 log 這類大量輸出留在 subagent 那邊，不進主對話。
- 可以限制它能用哪些工具、跑哪個模型。
- 同一份定義可以在不同專案重用。
- 互不相依的子任務可以同時跑。
- 簡單的事可以交給 Haiku 這類便宜快速的模型。

Claude Code 內建三個 subagent（p32）。Explore 做唯讀的程式碼搜尋，每次呼叫時指定要搜多徹底。Plan 在 plan mode 裡做研究。General-purpose 處理需要邊探索邊動手的多步驟工作。Explore 和 Plan 開場不載入 CLAUDE.md 和 git 狀態，為的是快和便宜（p32）。

自己定義一個 subagent，就是寫一個 Markdown 檔，YAML frontmatter 寫名字、描述、工具和模型，正文成為它的 system prompt（p33）：

```markdown
---
name: code-reviewer
description: Reviews code for quality
tools: Read, Glob, Grep
model: sonnet
---
You are a code reviewer. Analyze the code and give actionable feedback.
```

放在專案的 `.claude/agents/` 就跟著版控給整個團隊用，放在 `~/.claude/agents/` 就只有你自己、但每個專案都能用。官方文件補了一點：subagent 只收到這段 system prompt 和工作目錄這類基本環境資訊，不會收到 Claude Code 本身的 system prompt。

subagent 也可以再派自己的 subagent，前提是它的 `tools` 裡有 `Agent`（p34）。投影片寫最多五層、兩到三層最好；現行文件寫的是預設最多往下三層，可以用 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 調整。常見的分法是主 agent 擁有計畫，第一層分實作、除錯、審查三個 subagent。實作底下再分出寫測試的，審查底下再分出驗證的。每一層都從乾淨的 context 開始，只往上交摘要（p35）。

要它出場有三種方式，控制力一層比一層強（p36）：

1. 在提示裡用自然語言點名，由 Claude 決定要不要派。
2. 用 `@agent-code-reviewer` 指定，這一次一定會派。
3. 用 `claude --agent code-reviewer` 啟動，整個 session 都套用它的 prompt、工具和模型。

不是什麼都該派出去（p37）。subagent 從零開始，看不到之前的對話，還要花時間重新收集 context。留在主對話的：需要來回討論、前後階段共用很多 context、改一行就好、很在意等待時間的事。派出去的：會產生大量用不到的輸出、需要限制工具或權限、做完只要交一份摘要、可以平行的事。如果你要的是一套能重複使用、但想留在主對話裡跑的流程，該寫的是 skill。

### Agent teams：讓幾個 session 互相討論

[Agent teams](https://code.claude.com/docs/en/agent-teams) 是幾個 Claude Code session 一起工作：一個 lead、幾個 teammate（p38）。它由四個部分組成（p39）：

- **Lead**：你原本的那個 session，負責開出 teammate、分配工作、整合結果。
- **Teammate**：各自獨立的 Claude Code 實例，各有自己的 context window。
- **任務清單**：共用的工作項目，teammate 自己認領、做完標記完成。官方文件補充：任務有待辦、進行中、完成三種狀態，也可以設依賴，前面的任務沒完成，後面的不能認領。
- **Mailbox**：每個 agent 一個收件匣，是一個 JSON 檔，teammate 之間靠它直接傳訊息。

Teammate 不繼承 lead 的對話。它們開場會自動載入 CLAUDE.md 和 skill（官方文件另外列了 MCP server），任務細節要寫在 lead 開出它們時給的那段 prompt 裡（p39）。

它適合四種工作（p38）：

- 幾個 teammate 從不同角度審同一份程式，再互相挑戰對方的發現。
- 每人負責一個獨立模組。
- 平行驗證幾個互相競爭的除錯假設。
- 前端、後端、測試各由一人負責。

代價是協調成本和 token 都跟著人數長，所以循序的工作、會改到同一個檔案的工作、依賴很多的工作，還是用一個 session 或 subagent。這個功能目前是實驗性的，預設關閉（p38）；依官方文件，要設 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 才會打開。

和 subagent 比（p40–42）：

| | Subagent | Agent teams |
|---|---|---|
| Context | 自己一個 window，結果交回給呼叫者 | 自己一個 window，各自獨立 |
| 溝通 | 只回報給呼叫者 | teammate 之間直接傳訊息 |
| 協調 | 主 agent 管所有工作 | 共用任務清單 |
| 適合 | 只要結果的任務 | 需要討論的工作 |
| Token 成本 | 較低 | 較高 |

投影片的比較是「subagent 只回報給呼叫者」。現行文件多了一個例外：Claude 派出時有命名的 subagent，彼此也能互傳訊息。分界還在，只是沒有投影片畫得那麼乾淨。

> **自我檢查**：subagent 和 agent teams 差在哪？
> 判準：答出 teammate 之間能透過共用的任務清單和 mailbox 互相溝通、自己認領工作；subagent 做完把結果交回給派它的 agent，由主 agent 管所有工作。答到 token 成本較高、需要討論的工作才值得用 teams，算加分。

### Dynamic workflow、/goal 與 /loop

前面幾種方式，下一步做什麼都是 Claude 在對話裡一輪一輪決定。[Dynamic workflow](https://code.claude.com/docs/en/workflows) 換了一個做法：Claude 寫一支 JavaScript 腳本，由執行環境在背景跑，腳本負責開出很多 subagent、決定順序和分支（p43）。官方文件補充：中間結果存在腳本的變數裡，Claude 的 context 只收到最後的答案。所以它適合單一對話協調不來的規模，例如整個 codebase 掃 bug、遷移 500 個檔案、交叉查證的研究。啟動方式有兩種：在提示裡寫 `ultracode`，這一次就用 workflow 做；或設 `/effort ultracode`，讓 Claude 對這個 session 每件夠大的事都規劃 workflow（p43）。

另一個方向是讓一個 agent 跑久一點。投影片介紹兩個指令：

- **[`/goal`](https://code.claude.com/docs/en/goal)**：給一個可以驗證的終點，例如 `/goal "npm run lint exits with zero errors"`（p44）。每一輪結束後，另一個模型檢查條件是否成立，沒成立就讓 Claude 繼續做。「所有整合測試通過」可以當條件，「重構這段程式」不行，因為沒有東西能證明它做完了。現行文件補了兩點。第一，檢查用的是設定裡的小型快速模型，它只看對話內容，不自己跑指令或讀檔，所以條件要寫成 Claude 的輸出能證明的事。第二，投影片提到的 `--max-tries` 旗標文件裡沒有；要限制輪數，就把它寫進條件，例如「或在 20 輪後停止」。
- **[`/loop`](https://code.claude.com/docs/en/scheduled-tasks)**：照固定間隔重跑同一個提示，例如 `/loop 5m "check CI, fix whatever broke"`，直到你在等待期間按 Esc 停下（p45）。不給提示時跑內建的維護提示；你可以在 `.claude/loop.md` 換成自己的預設提示。不給間隔時，現行版本由 Claude 每次自己挑一分鐘到一小時之間的等待時間；排程七天後到期。

兩者的差別是投影片那一句：`/goal` 在條件成立時停，`/loop` 在你叫它停時停（p45）。

> **自我檢查**：下面三件事各用什麼？(1) 把 200 個測試檔從 Jest 遷到 Vitest；(2) 每 10 分鐘看一次部署狀態，失敗就回報；(3) 讓 agent 一直修到 `pnpm build` 成功。
> 答：(1) 檔案多、彼此獨立、要可重跑，用 dynamic workflow（或規模小一點時派多個 subagent）；(2) 是定時觸發，用 `/loop 10m`；(3) 有可驗證的終點，用 `/goal`。

### 選讀：16 個 agent 寫一個 C compiler

投影片附了一個大案例（p47–50），出自 Anthropic 自家的實驗：16 個 agent 平行寫一個 C compiler。這裡只留結論：互不相依的任務才能平行；大家卡在同一處時，先想辦法把它拆開，拆不開就別多開 agent。過程和數字收在下面。

<details>
<summary>選讀：16 個 agent 寫 C compiler，平行在哪裡失靈、怎麼救回來</summary>

Anthropic 的 Nicholas Carlini 讓 16 個 Claude 平行工作兩週，用了將近 2,000 個 session、略低於兩萬美元的 API 費用，從零寫出一個約 10 萬行的 Rust C compiler，能編譯可開機的 Linux 6.9（p47，[原文](https://www.anthropic.com/engineering/building-c-compiler)）。

協調方式很陽春（p48–49）。它用的是作者自己搭的 harness：每個 agent 一個 Docker 容器，在無窮迴圈裡跑 Claude Code。agent 在 `current_tasks/` 寫一個文字檔來認領任務，用 git 合併與推送；同一個任務被兩個 agent 認領時，git 的同步會讓第二個改做別的。沒有聊天，也沒有負責指揮的 agent。

它也沒有全部成功（p50）：

- 合併衝突很頻繁。
- 開始編譯 Linux kernel 之後，16 個 agent 撞上同一個 bug，各自修、互相覆蓋，平行完全沒有幫助。
- 16-bit x86 的部分還是叫 GCC 來做。
- 產出的程式比 GCC 慢。

第二點後來救回來了，投影片沒講這段，原文有。作者改了測試方式，用 GCC 當一個確定正確的對照組。每次隨機挑大部分 kernel 檔案用 GCC 編，只把剩下的一部分交給新的 compiler。kernel 能跑，就代表問題不在這一批；壞了，再把其中一些檔案換回 GCC 縮小範圍。這樣一個大任務被拆成很多個「這幾個檔案哪裡錯」的小任務，16 個 agent 才又能各修各的。前面手動平行的那個例子，在這裡換成了真實的規模。

</details>

## 後半：Programming 3.0、不確定性與委派

### 講者的 Programming 3.0

前半的工具讓產出變多，後半問這些產出能不能信。講者先自己定義了一組詞（p52）：

- **Programming 1.0**：人直接寫機器指令或組合語言給硬體。
- **Programming 2.0**：人寫程式語言，compiler 翻成機器指令。
- **Programming 3.0**：人用自然語言表達目標，agent 寫出程式，再由 compiler 翻成機器指令。

每往上一層，生產力變高，不確定性也變多（p52）。

講者特別說明，這和 Andrej Karpathy 的 Software 1.0／2.0／3.0 不是同一件事（p53）。Karpathy 分的是「程式是什麼」：1.0 是原始碼，[2.0 是神經網路的權重](https://karpathy.medium.com/software-2-0-a64152b37c35)，靠收集資料和最佳化做出來；3.0 是 LLM 的提示，用自然語言寫（[演講](https://www.youtube.com/watch?v=LCEmiRjPEtQ)）。講者分的是「人怎麼把意圖交給機器」，3.0 的產物最後還是一般的程式碼。投影片最後補了一句：知道一件事該用 1.0、2.0 還是 3.0 來做，是重要的工程能力（p53）。

### 不確定性不是新問題

同一份原始碼跑出不同結果，本來就有（p55）。2.0 時代已經處理過三種：

| 來源 | 2.0 的例子 | 2.0 怎麼處理 | 3.0 多了什麼 |
|---|---|---|---|
| 硬體 | 32／64 位元、位元組順序 | 固定寬度的型別、交叉編譯、虛擬化 | GPU 運算的非決定性、浮點誤差 |
| 環境 | 並行、不可靠的網路 | 記憶體一致性模型（規定多執行緒看到寫入的先後）、可重送也不會重複生效的 API | agent 寫程式的同時就在操作環境 |
| 軟體 | compiler 版本、依賴版本漂移 | 升級前完整測試 | 模型本身、不同的 GPU kernel 實作、取樣 |

3.0 還多了一段（p56）。以前從需求到程式，中間隔著 PM 和工程師；現在常常只有一句提示，輸入本身就是模糊的。投影片在這裡標了「需要更多研究」。

### 不確定性從哪四層進來

講者把 3.0 的不確定性拆成四層，再加上最後的產物（p57）：

| 層 | 不確定性 | 例子 |
|---|---|---|
| 自然語言 | 語意 | 「把登入改快一點」是指頁面載入還是驗證流程？ |
| 檢索與 context | 檢索漂移 | 索引更新、切塊方式不同、context 被截斷 |
| 模型生成 | 機率性 | 取樣本身就有隨機性，加上軟硬體的非決定性 |
| agent 與工具的 loop | 軌跡與環境的非決定性 | 工具失敗、環境在兩次執行之間變了 |
| 產出的程式 | 通常是決定性的 | 除非它在執行時又去呼叫模型或工具 |

最後一列是好消息：不確定性主要在「生成」的過程，生成出來的程式碼本身通常每次執行都一樣，所以可以用測試把它固定下來。

### 三組做法

對應的做法分成三組（p58）：

- **先講清楚（DEFINE）**：一開始就把假設講明，讓模型在動手前先確認模糊的地方；給需求、不變量、限制和驗收測試，而不是只給一句提示。
- **控制（CONTROL）**：提案和執行分開，agent 先提計畫，驗證過才落地；明確管理 context，自己掌握記憶的內容、來源和檢索方式，過期的資訊要清掉。
- **驗證與治理（VERIFY & GOVERN）**：把「生成、驗證」這個循環縮短，頻繁的便宜檢查勝過最後一次昂貴的審查；量測往下多挖一層，寫測試、看多個指標、用你能推理的合成工作負載（自己造、結果可預期的測試輸入）。

對照前半的工具：Superpowers 的設計核准和計畫是「先講清楚」與「提案和執行分開」，`/goal` 要你給可驗證的終點，Caveman 的取回原文和第 2 堂的記憶管理是在管 context。

投影片的結論是兩句話（p59）：不要期待 agent 是決定性的，讓周圍的系統可靠；自主程度要和風險相稱，給得越多，不確定性和風險也越大。

> **自我檢查**：同一個提示「幫這個函式加上快取」跑兩次，一次用了 Redis、一次用了記憶體 dict。不確定性主要來自哪一層？怎麼減少？
> 答：主要是自然語言的語意層，提示沒說要哪種快取，模型取樣時兩種都合理。減少的方法是在提示或 CLAUDE.md 裡寫清楚限制與驗收條件（例如「只能用標準函式庫」「需附測試」），也就是「先講清楚」那一組。

### 業界數據：OpenAI 的兩份報告

最後一段拿 OpenAI 公開的兩份報告，看「一個人帶多個 agent」在現場是什麼樣子（p60–67）。這兩份都是 OpenAI 用自家產品、自家員工的資料寫的，論文也自己承認 OpenAI 是對 agent 特別有利的環境：員工熟悉前沿模型、邊際使用成本低、組織全力支持（[論文](https://arxiv.org/abs/2606.26959)）。讀的時候當成「前沿的人在做什麼」，不要當成一般團隊的預期。

第一份是 2026 年 6 月的 Codex 使用研究（[The Shift to Agentic AI: Evidence from Codex](https://arxiv.org/abs/2606.26959)）：

- **用的人還不多**：最近 28 天內，個人帳號的活躍使用者用過 Codex 的不到 1%，組織帳號是 17.3%，OpenAI 員工幾乎全員都用（p61）。
- **交出去的工作變大了**：2025 年 12 月，35.4% 的個人使用者至少送過一次「有經驗的人要做一小時以上」的請求，2026 年 5 月是 70.2%（p62）。要做八小時以上的，從 2.1% 升到 25.6%。注意這是「使用者比例」，請求要花人多少時間也是模型估的。
- **一個人同時帶好幾個**：約 28.6% 的 OpenAI 使用者在某一週內同時管過五個以上的 agent；中位數員工一天的 agent 執行時間是 2.5 小時（p63）。

第二份是 2026 年 9 月的〈[Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/)〉。到 8 月中，OpenAI 研究組織每一個人類工作天，對應 3.1 個 agent 工作天（p64；投影片圖上寫 3.14 倍）；中位數研究員一天用掉超過 600 美元的推論費用（p67）。投影片 p66 的圖，把前面那句「自主程度要和風險相稱」（p59）落到數字上。它依「人類要花多久」把任務分組：不到 15 分鐘的任務有 86% 不需要人介入就成功。64 到 128 小時的任務，不需介入就成功的只剩 16%，51% 要人介入至少一次，26% 失敗。任務越大，人越不能離開。

投影片最後把這些整理成一把「委派梯子」（p68）：

1. 聊天機器人：AI 回答，人做事。
2. 助手：人和 AI 一起做。
3. Agent：人把一整件工作交出去。
4. 多 agent 工作者：人協調好幾個 agent。
5. 系統化的工作流：skill 和 agent 自己跑流程。

投影片說 OpenAI 的員工落在圖的下方，版面上最下方是第 4、5 級，也就是這堂課前半在教的那兩級。

### 反面的證據

廠商數據之外，也有讓人冷靜的研究。[METR](https://metr.org/blog/2025-07-10-early-2025-AI-experienced-os-dev-study) 在 2025 年找了 16 位資深開源開發者，在自己熟悉的大型 repo 上做 246 個真實 issue，隨機分成可用 AI 和不可用 AI：可用 AI 的那組多花了 19% 的時間，但開發者事後仍覺得自己變快了。METR [2026 年的追蹤](https://metr.substack.com/p/2026-02-24-uplift-update)估計現在可能已經變快，但最想用 AI 的人不願意參加「不能用 AI」的那一組，資料偏得太厲害，他們決定改實驗設計。這兩份研究告訴你的是：「覺得變快」和「量到變快」要分開看。

多 agent 本身也有反對的聲音。[Cognition](https://cognition.ai/blog/dont-build-multi-agents) 在 2025 年主張不要做多 agent，理由是每個動手的 agent 都帶著隱含的決定（風格、邊界情況怎麼處理），平行寫的 agent 互相衝突。2026 年他們的[後續文章](https://cognition.ai/blog/multi-agents-working)說，原來的觀察對「多個 agent 一起寫」仍然成立，現在真正有用的是一類比較窄的做法：好幾個 agent 貢獻想法，但寫入只由一個來做，例如一個寫、一個用乾淨 context 審。這和投影片的 agent teams 建議一致：審查、驗證假設這類「讀」的工作最適合分出去，會改到同一個檔案的工作留給一個 agent。

## 綜合自我檢查

1. 你要同時做三件事：查 50 個依賴套件有沒有已知漏洞、修一個只在 CI 出現的不穩定測試、寫一份新 API 的設計文件。各用哪種擴充方式？
   判準：查依賴是大量、獨立、只要結果的工作，派 subagent（或多個平行 subagent）；不穩定測試可能要好幾輪嘗試，給它一個 worktree 跑 `/goal`，終點是「連續跑十次都通過」；設計文件需要和你來回討論，留在主對話。
2. 主管說「我們也來開 20 個 agent 平行做，產出就是 20 倍」。用這堂的內容指出至少兩個問題。
   判準：答出任兩點以上即可。平行只買牆鐘時間、不買品質；審查和合併仍然落在人身上，隨 agent 數量增加；任務若有依賴或改同一批檔案，平行會變成衝突（C compiler 撞同一個 kernel bug）；token 成本跟著 agent 數量長；METR 的研究提醒「覺得變快」不等於量到變快。
3. 為什麼講者說「不要期待 agent 是決定性的，讓周圍的系統可靠」？給一個具體做法。
   判準：答出不確定性來自語意、檢索、取樣與環境，沒辦法在模型這一層消除；但生成出來的程式通常是決定性的，可以用測試、型別檢查、CI 或 `/goal` 的可驗證終點把結果固定下來。

## 延伸閱讀

- [Claude Code 多 agent 總覽](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview)：subagent、agent teams、workflow 從產品面怎麼選。
- [Claude Code agent teams 指南](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide)：實際開一個 team 的設定與操作。
- [Claude Code dynamic workflows](/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows)：workflow 腳本長什麼樣。
- [Subagent 與 worktree 隔離](/posts/ai/2026-08-30-coding-agent-subagent-worktree-isolation)：自己寫 harness 時怎麼做同樣的隔離，作業 2 前值得先讀。
- [Skill 與 subagent 比較](/posts/ai/2026-03-30-skill-vs-subagent-comparison)：「留在主對話用 skill，還是派出去」的另一種講法。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。
- 底本：[第 3 堂投影片](https://cs2680.com/slides/3_agent_use_2.pdf)（PDF 頁序 p5–68，p47–50 為選讀），2026-10-22 讀取。頁碼一律用 PDF 頁序，投影片頁尾印的號碼和 PDF 頁序不同。
- 產品行為依 2026-10-22 的 Claude Code 官方文件核對；Superpowers 與 Caveman 依 2026-10-22 的 GitHub repo 核對。與投影片不同之處已在正文標出。
- 「三個 bug 開三個 worktree」的時間是本站補充的教學例子，不是課堂內容。

## 參考資料

- [CS2680 第 3 堂投影片：Agent From a User's Perspective II](https://cs2680.com/slides/3_agent_use_2.pdf)
- [obra/superpowers（GitHub）](https://github.com/obra/superpowers)
- [JuliusBrussee/caveman（GitHub）](https://github.com/JuliusBrussee/caveman)
- [JetBrains：Speaking to AI Agents like Cavemen Saves 65% of Tokens. We Test.](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)
- [Claude Code 文件：Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code 文件：Worktrees](https://code.claude.com/docs/en/worktrees)
- [Claude Code 文件：Desktop](https://code.claude.com/docs/en/desktop)
- [Claude Code 文件：Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code 文件：Agent teams](https://code.claude.com/docs/en/agent-teams)
- [Claude Code 文件：Dynamic workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code 文件：/goal](https://code.claude.com/docs/en/goal)
- [Claude Code 文件：Scheduled tasks 與 /loop](https://code.claude.com/docs/en/scheduled-tasks)
- [Nicholas Carlini：Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [Andrej Karpathy：Software 2.0](https://karpathy.medium.com/software-2-0-a64152b37c35)
- [Andrej Karpathy：Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ)
- [The Shift to Agentic AI: Evidence from Codex（arXiv 2606.26959）](https://arxiv.org/abs/2606.26959)
- [OpenAI：Research acceleration: The view inside OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/)
- [METR：Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-AI-experienced-os-dev-study)
- [METR：We are Changing our Developer Productivity Experiment Design](https://metr.substack.com/p/2026-02-24-uplift-update)
- [Cognition：Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents)
- [Cognition：Multi-Agents: What's Actually Working](https://cognition.ai/blog/multi-agents-working)
