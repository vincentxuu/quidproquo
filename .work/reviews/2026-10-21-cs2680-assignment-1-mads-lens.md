審稿對象：src/content/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens.md，sha256：4452e0e21bfe6e061dc7f58989365413290443bcf7c80321adcd9a578efc3819
審稿者：獨立子代理（未參與撰寫），2026-10-21

範圍：依 `post-verify`、`post-review`、`post-polish` 三個 skill 依序執行，只報告、未改稿。對照 `.agents/skills/post/references/course-guide-contract.md`（作業導讀角色）與 `.work/series-plans/harvard-cs2680.md` Order 3 範圍卡。

使用的來源：
- 本機：`.work/research/harvard-cs2680/sources/pages/assignments_assignment1.txt`（全文）、`assignments_index.txt`、`policy.txt`、`sources/slides/2_agent_use_1.txt`、`l2-claude-code-factcheck.md` 第 37–40 項。
- 官方文件（2026-10-21 以 curl 抓 `.md` 全文）：`code.claude.com/docs/en/headless.md`、`cli-reference.md`、`agent-sdk/typescript.md`（SDKResultMessage／SDKUserMessage／AgentOutput）、`agent-sdk/subagents.md`、`sub-agents.md`、`permissions.md`、`authentication.md`、`tools-reference.md`。
- Groundlane HTTP 在此環境回 401（依指示略過）；curl 全部成功，不需要 Exa／WebFetch。
- 實跑：把文中 Python 區塊抽成 `tree.py`，以 `python3 -I` 跑自製的 events.jsonl（含 subagent、截斷、錯誤 result 等 8 種變體）。未執行任何真實 `claude` agent 任務。

## post-verify

| # | 行 | 宣稱 | 來源 | 判定 | 備註 |
|---|---|---|---|---|---|
| 1 | 28 | 9/2 發、9/20 截止、佔 10% | 作業頁 "Out Wed Sep 2 · due Sun Sep 20 … (10%)"；作業總覽同 | 🟢 Confirmed | |
| 2 | 28 | 名稱 Mads-Lens | 作業總覽 "Mads-Lens 1 : Watch the agent work" | 🟢 Confirmed | 作業頁本身標題是 "Experience a coding agent"，名稱只在總覽頁；第 217 行已兩者並列，可以 |
| 3 | 28 | 刻意做得很小、後面作業不會拿來比較、在自己電腦跑就夠 | 作業頁 "deliberately small … the one assignment nothing later in the course is measured against. Serving it on your own machine is enough." | 🟢 Confirmed | 「不會拿來比較」的中文讀起來像「不跟它比」，見 post-polish |
| 4 | 32 | 任何語言與 web 技術都可以 | 作業頁 "Any language and any web stack are fine." | 🟢 Confirmed | |
| 5 | 38–48 | 三部分、七項功能的內容 | 作業頁 Part 1–3 與七項功能敘述、Grading 表 | 🟢 Confirmed | 七項逐條核對，文意相符 |
| 6 | 50 | 七項只是底線、writeup 第一段列改進 | 作業頁 "Try to improve beyond…"、Writeup "What you built … plus the improvements" | 🟢 Confirmed | |
| 7 | 60、63 | `claude -p … --output-format stream-json --verbose`；作業頁註明要加 `--verbose`；headless 文件範例都帶它 | 作業頁 "(in print mode, this output format also requires --verbose)"；headless.md 的 stream-json 範例（第 190–203 行）皆帶 `--verbose` | 🟢 Confirmed | 文中措辭正確：只說作業頁註明、文件範例帶著，沒有宣稱文件明文規定（fact-check 第 38 項：文件無明文） |
| 8 | 68–74、80–84 | 事件順序 init → assistant/user（tool_use／tool_result）→ result；result 帶 cost／duration／turns／session_id | 作業頁 Part 1；headless.md "The last line of the stream is a result message"；SDK `SDKResultMessage` 有 `duration_ms`、`num_turns`、`total_cost_usd`、`session_id` | 🟢 Confirmed | fact-check 第 37、39 項同 |
| 9 | 72、100、125 | tool_result 帶 `tool_use_id` 與 `is_error` | 作業頁 "the two share the call's id"；SDK 文件 "the `is_error` tool result that follows"（typescript.md 第 2003 行，permission denial 段）；Messages API tool_result 區塊格式 | 🟢 Confirmed | |
| 10 | 72、89 | `pytest` 失敗時 tool_result 帶 `is_error: true` | tools-reference.md 第 175 行：exit 1 只有 grep、rg、diff、test 等少數指令視為正常結果 | 🟢 Confirmed（推論） | pytest 失敗是 exit 1，不在白名單內，所以算指令失敗。文件沒有直接寫 pytest 的例子 |
| 11 | 89 | 工具出錯但 run 正常跑完，result 的 `subtype` 仍是 `success` | `SDKResultMessage` 的錯誤 subtype 只有 `error_max_turns`、`error_during_execution`、`error_max_budget_usd`、`error_max_structured_output_retries` | 🟢 Confirmed（由型別定義推論） | 工具失敗不在 run 錯誤的類別裡。但 success 這一支也有 `is_error` 欄位（可能是 API 錯誤），文中沒提 |
| 12 | 53 | 資料夾不存在或 agent 出錯時「可能根本不會有正常的 result」 | typescript.md 第 1696、1787 行：已知的啟動失敗會寫一個 `error_during_execution` result（數字歸零）；其餘失敗只寫 stderr | 🔵 Misframed | 「沒有 result」只是其中一種情況。更常見的是收到 result 但 subtype 是 `error_*` 或 `is_error: true`。判準只寫前者，而第 126–127 行的程式也不分辨 subtype（見 post-review 必修 1） |
| 13 | 93 | headless 沒人能按允許、需要核准的請求被拒；`--dangerously-skip-permissions`、`--allowedTools "Edit" "Bash(pytest:*)"` | 作業頁原文；headless.md 第 308 行 "a call that needs approval is denied unless something approves it, such as a PermissionRequest hook or a --permission-prompt-tool"；permissions.md 第 187 行 `:*` 等同結尾 ` *` | 🟢 Confirmed | 「直接被拒」是預設行為；文件另有 `--permission-prompt-tool`、PermissionRequest hook 可在 headless 下核准，跟第 202 行的自我檢查有關 |
| 14 | 94 | 不用 Agent SDK 或 API key；`ANTHROPIC_API_KEY` 優先於登入帳號 | 作業頁原文；authentication.md 第 229 行 "In non-interactive mode (-p), the key is always used when present" | 🟢 Confirmed | 兩源一致 |
| 15 | 100–101 | tool_use 的 `id` = tool_result 的 `tool_use_id`；subagent 事件帶 `parent_tool_use_id`，主 agent 為 `null` | 作業頁 feature 4、7；headless.md 第 211 行；typescript.md 第 321 行 | 🟢 Confirmed | |
| 16 | 101 | 「subagent 發出的每個事件都帶 `parent_tool_use_id`」 | headless.md 第 213–216 行 | 🟡 部分不完整 | 預設只轉送 subagent 的 tool_use／tool_result 區塊。文字和 thinking 要加 `--forward-subagent-text`（v2.1.211+）才會出現。另外，subagent 的第一則訊息是帶 prompt 的 `user` 訊息，不是 tool_result |
| 17 | 103、11 | 「30 行 Python」 | 抽出的程式區塊 `wc -l` = 30（含空行） | 🟢 Confirmed | |
| 18 | 140–145 | 含 subagent 的串流輸出 `Read [ok] / Task [ok] / ··Grep [ok] / Bash [error] / $0.21 · 42 s · 5 turns` | 自製 events.jsonl 實跑 | 🟢 Confirmed（實跑） | 輸出逐字相符。但文中沒有附這份輸入串流，讀者無法重現（見 post-review） |
| 19 | 148 | 作業頁示意圖叫 `Task`，第 2 堂投影片工具清單寫 `Agent` | 作業頁示意 "Tasks / Task survey this directory"；`2_agent_use_1.txt` 第 89 行 "TOOLS Read, Edit, Bash, Glob, Grep, Web, Agent"；subagents.md 第 324 行 `name` 是 `"Agent"` | 🟢 Confirmed | 「不要寫死工具名稱」的建議正確 |
| 20 | 150、153 | 中途中止：最後輸出「run 沒有正常結束」，未配對的呼叫停在 pending | 實跑 | 🔴 Contradicted（部分） | 截在行與行之間時成立（`Bash [pending]` + 「run 沒有正常結束」）。截在一行中間時，`json.loads` 丟出 `JSONDecodeError` 整支程式掛掉；檔尾多一個空行也一樣會掛。答案只對其中一種情況 |
| 21 | 143、101 | subagent 在 Task 的 tool_result 之前就跑完 | sub-agents.md 第 908–910 行：沒設定時，主對話派出的 subagent 預設在背景跑；subagents.md 第 165 行：Agent 工具結果先回 `status: "async_launched"`，報告在之後的輪次才到；headless.md 第 77–81 行：`-p` run 會等背景 subagent 結束 | 🟡 Unverifiable（依現行文件推論，未實跑） | 依現行文件，Task／Agent 那一列可能在子事件出現前就被標成 `[ok]`，pending 的語意就和作業頁的描述不一致。另外 `result_index`（typescript.md 第 1695 行）表示一個 process 可以寫出多個 result。要確認得實跑 `claude`，本次規定不跑 |
| 22 | 160、163 | 錄成 events.jsonl、重播模式、另錄一份會派 subagent 的串流、提示 "use a subagent to survey this directory" | 作業頁 "Test efficiently by replaying…" 段、feature 7 段 | 🟢 Confirmed | 「一分鐘以上、花用量」符合 "takes a minute or more and spends real usage" |
| 23 | 165–168 | 只有真跑才測得到：即時渲染、session resume；`claude -p --resume <session-id> "<下一個問題>"` | 作業頁同段；headless.md `--resume`（fact-check 第 40 項） | 🟢 Confirmed | |
| 24 | 170 | 放有測試的小專案、「找出讓 test_parse 失敗的 bug 並修好」 | 作業頁 "Give the agent something to work on" | 🟢 Confirmed | |
| 25 | 179–181 | 評分不需公開網址；雲端要加隨機 token（`openssl rand -hex 16`，不放進 repo）；對練習資料夾 | 作業頁 "Where to run it" | 🟢 Confirmed | |
| 26 | 183 | 不准用 agent 框架、不准重寫 agent loop（作業 2 的事） | 作業頁 "do not use an agent framework or reimplement the agent loop (that is Assignment 2)" | 🟢 Confirmed | |
| 27 | 187–191 | writeup 自己寫，完全由 AI 產生會扣分；三段內容 | 作業頁 Part 3 | 🟢 Confirmed | |
| 28 | 193 | 交程式、writeup、session 檔；每份作業都要附 session 檔 | 作業頁 Deliverables；policy.txt 第 78 行 | 🟢 Confirmed（但不完整） | 漏了**示範影片**（2–3 分鐘，上傳 Canvas）。作業頁寫明七項功能都從影片評分，見 post-review 必修 3 |
| 29 | 197–198 | \$0.58／12 輪 ≈ \$0.048／輪 | 重算：0.58 ÷ 12 = 0.04833 | 🟢 Confirmed | 數字取自作業頁示意 "$0.58 · 42 s · 12 turns"。「後面輪次 context 較長通常較貴」是合理推論；有 prompt caching 時差距會縮小，可加一句 |
| 30 | 202 | 選做項目包含允許／拒絕按鈕 | 作業頁 "If you want more"：stop button、approve or deny buttons、diff view、parallel tabs | 🟢 Confirmed | 判準寫「單靠作業頁這組參數做不到」沒有錯，但文件已有 `--permission-prompt-tool`／PermissionRequest hook 這條路，可以點名 |
| 31 | 26、212 | 課程不錄影 | policy.txt 第 114–115 行 "Will lectures be recorded? No" | 🟢 Confirmed | |
| 32 | 206–208 | 站內連結 | `src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md`、`…/2026-08-26-claude-code-how-it-works.md`、`src/content/posts/ai/2026-10-21-cs2680-course-overview.md` 都存在 | 🟢 Confirmed | 第 24 行的 `-en` 連結指向尚未存在的英文版，依指示忽略 |
| 33 | 外部連結 | 6 個外部 URL | curl 全回 200；`pnpm check:links` 7 個無壞連結 | 🟢 Confirmed | |

實跑紀錄（自製串流，`python3 -I tree.py`）：

| 輸入 | 結果 |
|---|---|
| 完整串流（Read → Task{Grep} → Bash 失敗 → result success） | 與文中第 141–145 行逐字相同 |
| 截在 Bash tool_use 之後（行與行之間） | `Bash [pending]`，最後一行「run 沒有正常結束」，符合第 153 行 |
| 最後一行只寫了一半 | `json.decoder.JSONDecodeError`，程式中止 |
| 檔尾多一個空行 | `JSONDecodeError`，程式中止 |
| result 改成 `subtype: error_during_execution, is_error: true` | 印出 `$0.21 · 42 s · 5 turns`，跟成功的 run 看不出差別 |
| `total_cost_usd: 0.137852`（作業頁的真實值） | 印出 `$0.137852`，沒有四捨五入 |
| subagent 第一則 user 訊息的 content 是字串 | `TypeError: string indices must be integers`（官方文件沒寫這則訊息是字串還是區塊陣列，屬於防禦性問題） |
| `parent_tool_use_id: "forked-command-x"`（headless.md 第 222–228 行） | `KeyError` |

本次只檢查了文中已提出的 33 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。

修正：程式改為判斷 result 的 subtype／is_error、接住 JSONDecodeError、略過空行、金額 .2f；已用文中 events.jsonl、截斷串流與 error_during_execution 串流實跑。--verbose 改寫成「作業頁註明」；補 total_cost_usd 為本機估算、--forward-subagent-text、背景 subagent（標未實跑）。

## post-review

機械檢查：
- `pnpm verify`：5 項紅，全部只跟缺 `-en` 檔或缺本審稿紀錄有關（references／post-quality：第 24 行 `-en` 連結不存在；lang-parity；course-videos：登錄表有 `-en` 但找不到；series-plan：缺審稿紀錄，本檔寫入後即解）。依指示忽略。
- `check-course-titles.mjs`（整個 cs2680 系列）：0 issue。`check-course-guide-layout.mjs`：0 issue。`check:tw`：0 blocking。`check:links`：無壞連結。
- frontmatter：必填齊全，tags 6 個、kebab-case，與同系列一致；`type: guide` 合適；tldr 與 description 分工清楚、不重複。glossary 兩條與正文一致。

作業導讀契約的對照：

| 契約項目 | 文中位置 | 判定 |
|---|---|---|
| 依原任務與閱讀範圍教 | 第 36–48 行七項表、第 55–94 行 Part 1、第 185–193 行 Part 3 | 大致做到；缺交件與評分（必修 3） |
| 先備 | 第 34 行 | 有，但沒連到本系列第 2 堂導讀（建議修 1） |
| 解題思路 | 第 96–150 行配對規則與程式、第 155–170 行錄製重播 | 做到 |
| 檢查方式 | 第 165–168 行真跑驗證兩件事 | 做到；沒有對照評分表的自評清單（建議修 3） |
| 不冒充官方解答 | 第 26、32、103 行 | 做到 |
| 完整例子 | 第 67–74 行事件示意、第 105–146 行程式與輸出 | 輸入不完整（必修 2） |
| 各節自我檢查附答案／判準 | 第 52–53、88–89、152–153、172–173 行，綜合題第 197–202 行 | 大致做到；第 153 行答案部分錯（必修 4），安全、writeup 兩節沒有題目（可選） |

🔴 必修

1. **失敗的 run 在例子和判準裡都分不出來（第 53、126–127、135 行）。** 第 53 行的判準只寫「沒有正常的 result」。依 `SDKResultMessage`，失敗的 run 通常也會收到 result，只是 `subtype` 為 `error_max_turns`／`error_during_execution`／`error_max_budget_usd`，或帶 `is_error: true`。已知的啟動失敗也會寫一個數字歸零的 `error_during_execution` result。實跑時，程式遇到 `error_during_execution` 仍印出跟成功一樣的摘要。功能 4 要求「完成／失敗分得出來」，教學程式卻示範了相反的事。建議：判準補「result 的 subtype 不是 success，或 is_error 為 true」；第 127 行摘要前面加上 `ev["subtype"]`（例如 `success · $0.21 · …`），或把 subtype 不是 success 的 result 印成「失敗：…」。
2. **主要例子的輸入沒附（第 138 行）。** 第 141–145 行的輸出來自「一段含 subagent 的串流」，但文中只附了第 67–74 行那段不含 subagent 的六行示意。讀者拿不到能重現 `Task [ok] / ··Grep [ok]` 的輸入，第 213 行「已用一份自製的串流檔跑過」也無從核對。契約要求完整例子要有輸入。建議：附上約 10 行的含 subagent 串流（Task 的 tool_use → 帶 `parent_tool_use_id` 的 Grep tool_use／tool_result → Task 的 tool_result → Bash 錯誤 → result），可以收在 `<details>` 裡。
3. **交件與評分不完整（第 185–193 行）。** 範圍卡寫明要講「作業要求與交件方式」，作業頁的重點有：
   - 必交**示範影片**（2–3 分鐘，上傳 Canvas），影片要演示全部七項功能，包含一次失敗的 run 和一次派 subagent 的 run；
   - 評分：七項功能共 70%（各 10%，**依影片判定** working／partial／absent）、writeup 20%（第 2 段占大部分）、視覺設計 10%；
   - 程式放在共用私有 repo 的 `assignment1/`，附 README 寫怎麼啟動伺服器；writeup 放在 `assignment1/writeup.md`／`.pdf`。

   文中一項都沒提。影片是評分的依據，這會改變學生怎麼安排開發（例如要先準備好一個會失敗的 run）。建議在「Writeup 要寫什麼」之後補一小節「交什麼、怎麼評分」，用一個小表格交代。
4. **中途中止那題的答案只對一半（第 153 行）。** 實跑結果：串流截在兩行之間時，答案成立；截在一行中間，或檔尾多一個空行時，`json.loads` 會丟出 `JSONDecodeError`，程式直接中止，什麼都不印。把錄到一半的檔案拿來重播時，最後一行很可能就是不完整的。建議：二擇一。一是程式在 `for line` 內先 `line = line.strip(); if not line: continue`，並用 `try/except json.JSONDecodeError` 標記「最後一行不完整」；二是答案改成「如果中止落在兩個事件之間……；如果最後一行只寫了一半，這支程式會在 json.loads 出錯，網頁版要先接住這個例外」。後者剛好也是功能 4「失敗不能讓頁面一直等」的教材。

🟡 建議修

1. **先備沒連到本系列第 2 堂導讀（第 30、34 行）。** 第 30 行只連到投影片 PDF。站內已有 `src/content/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works.md`，範圍卡的前置寫的是「order 2」，而且那篇第 245 行已經反向連到本文。建議第 30 行把「第 2 堂」連到站內導讀，PDF 改放參考資料。
2. **現行 Claude Code 的 subagent 預設在背景跑（第 101、143、148 行）。** 依 sub-agents.md 第 908–910 行與 agent-sdk/subagents.md 第 165 行，主對話派出的 subagent 預設在背景跑，Agent 的 tool_result 可能先回 `status: "async_launched"`，subagent 的事件之後才到；`-p` run 會等它跑完（headless.md 第 77–81 行），而且一個 process 可能寫出多個 result（`result_index`）。這會讓「Task 從 tool_use 到 tool_result 都是 pending」和「run 結束靠最後的 result」兩件事都變得不那麼單純。未實跑，不能斷言實際串流的長相。建議在第 148 行那段加一句版本提醒：「新版 Claude Code 的 subagent 預設在背景執行，Task／Agent 的 tool_result 可能先回 async_launched；pending 要看子事件是否還在進來，run 結束以最後一個 result 為準。」
3. **subagent 的文字預設不會出現在串流裡（第 101 行）。** 第 101 行寫「subagent 發出的每個事件都帶 parent_tool_use_id」，但預設只轉送 subagent 的 tool_use／tool_result，文字和 thinking 要加 `--forward-subagent-text`（cli-reference.md 第 95 行）。作業頁的示意圖在 Task 底下有一句 subagent 的文字摘要，學生做功能 7 時很可能卡在「為什麼看不到 subagent 說的話」。建議補一句並附上這個旗標。
4. **自評清單（第 165–170 行附近）。** 作業頁 Grading 表逐項列出 full credit 的條件（例如「續問要在影片中示範一個只有接上前一輪才合理的問題」、「沒有 subagent 的 run 仍要正確顯示」）。這是最好的「怎麼檢查自己的作業」材料，目前沒有用上。建議跟必修 3 的評分表合併成一張「交件前自評」表。
5. **學習目標與「用 Claude Code 做前端」沒寫（第 28–34 行）。** 作業頁第一個學習目標是 "Use Claude Code to build working software"，並建議 "Build the frontend with Claude Code too"。writeup 的觀察也要錨定在 session 上。文中沒交代這份作業本身就該用 agent 寫，讀者可能手刻前端，交不出有內容的 session 檔。另外作業總覽寫了預估時數 4–6 小時，可以一起放在先備那行。
6. **綜合題 3 可點名正確的機制（第 202 行）。** headless.md 第 308、326 行與 cli-reference.md 第 114 行：`-p` 下可以用 `--permission-prompt-tool`（MCP 工具）或 PermissionRequest hook 來核准。判準目前寫「改用支援互動核准的方式」，太模糊。建議寫成「要嘛事先用 `--allowedTools` 放行，要嘛用 `--permission-prompt-tool` 把核准請求轉給你的伺服器」。
7. **事件示意的結尾不自然（第 72–73 行）。** Bash 失敗後馬上就是 `result success`，中間沒有 assistant 收尾的文字，`num_turns: 3` 也對不上可見的兩次模型提案。讀者會以為工具一失敗 run 就結束。建議在第 72、73 行之間加一行 `{"type":"assistant","message":{"content":[{"type":"text","text":"測試失敗在 parse()，原因是…"}]}}`。
8. **台灣讀者位置（第 94 行）。** 文中的帳號建議只適用 Harvard 學生。本站讀者多半沒有 Harvard 登入，照著做時要用自己的 Claude 訂閱登入，或刻意改用 API key（照用量計費）。建議在第 94 行後補一句：「不是修課生的話，用你自己的 Claude 訂閱登入即可；若環境裡設了 `ANTHROPIC_API_KEY`，`-p` 一律優先用它計費。」並提醒 `total_cost_usd` 是 Claude Code 在本機估算的值，不是帳單（cli-reference.md 第 105 行 "client-side cost estimate"）。

🟢 可選

1. 第 127 行 `total_cost_usd` 直接印浮點數，真實值會印成 `$0.137852`。可改 `{ev["total_cost_usd"]:.2f}`，跟作業頁示意的格式一致。
2. 程式可對 `parent` 不在 `calls` 裡的情況（`forked-command-` 開頭，headless.md 第 226–228 行）退回 `roots`，並對 `message.content` 不是陣列的情況加防護。教學程式不必面面俱到，但可以在第 150 行附一句「真實串流還有其他事件型別與特殊值，網頁版要容錯」。
3. 「要注意的安全問題」「Writeup 要寫什麼」兩節沒有自我檢查。可各加一題，例如：「為什麼放上雲端時 token 不能 commit 進 repo？」
4. 範圍卡原本規劃的自我檢查（同一個 tool_use_id 出現兩次 tool_result）沒有放進來。現有題目更好，也可以把它併進綜合題。
5. 第 93 行的 `Bash(pytest:*)` 是照作業頁原文；現行文件的寫法是 `Bash(pytest *)`，兩者等價（permissions.md 第 187 行），可加括號註明。
6. 主題歸屬：stream-json 的其他旗標已轉給第 206 行的 headless 指南，分界清楚，沒有重講。

修正：必修 1 程式與功能 4 判準改為兩種失敗情況；必修 2 以 <details> 附上完整 11 行 events.jsonl；必修 3 新增「交什麼、怎麼評分」節（repo 位置、README、session 檔、Canvas 影片、70/20/10 配分）與自我檢查；必修 4 自我檢查答案改為兩種中止情況。建議修 1 第 2 堂改連站內導讀；2、3 補背景 subagent 與 --forward-subagent-text（標依文件、未實跑）；4 併入評分節；5 補「前端也用 Claude Code 寫」與 4–6 小時；6 綜合題 3 點名 --permission-prompt-tool；7 示意串流補收尾 assistant 文字；8 補非修課生登入與本機估算。可選 1、3 修；2 以 parent in calls 與 tool_use_id in calls 防護；4、5、6 不改。

## post-polish

掃描結果（`register-scan.sh`、`scan-ledger.sh`）：長句 11 句（約一成，接近門檻）；但書 4%；引述區塊 8 個，但全是自我檢查的框，屬於功能性區塊，不算過量引述；數字密度只有第 28 行單段 7 個；姓名當主詞 1 處；模板化轉折 2 處；台灣中文高風險詞 0。整體語域乾淨，問題集中在幾個長句和兩處「不是…而是」。

| 行 | 指標 | 問題 | 建議改寫 |
|---|---|---|---|
| 28 | 長句（74 字）＋數字密度 7 個 | 括號塞了名稱、兩個日期、配分，主句被推得很遠；「後面所有作業都不會拿來比較的一份」是直譯，意思不清楚 | 「[CS2680](…) 的[作業 1](…) 叫 Mads-Lens，9/2 發、9/20 截止，佔總成績 10%。你要做一個網頁來驅動 Claude Code：在網頁上打一個任務，agent 在你指定的資料夾裡工作，網頁同步顯示它在做什麼。作業頁說這份作業刻意做得很小，後面的作業也不會拿它當基準；在自己電腦上跑起來就夠了。」 |
| 32 | 長句（80 字） | 「這篇要回答的問題是：怎麼從…重建出…、花了多少？」問句太長 | 「這篇要回答一個問題：Claude Code 吐出來的事件，怎麼還原成它每一步做了什麼、花了多少？讀完你應該能拿一段 stream-json 輸出，畫出工具呼叫的順序與巢狀，並算出步數與成本。」 |
| 50 | 長句（64 字） | 三件事串在一句 | 「作業頁也提醒：七項只是底線。agent 寫出的第一版通常剛好達標，不會太好用，所以要自己用、找出不順手的地方再改。writeup 第一段就要列出這些改進。」 |
| 86 | 模板化轉折「這不是…而是…」 | 同篇第二處同骨架（另一處在第 191 行） | 「注意 `tool_result` 放在 `user` 事件裡。這一則不是你打的字：harness 以使用者的身分把工具結果交回模型，對模型來說，工具結果就是下一則輸入。」 |
| 93 | 長句（60 字） | 列點內兩個旗標加一個附帶條件 | 拆成兩句：「作業頁的建議：對著練習用的資料夾時，用 `--dangerously-skip-permissions` 全部放行；或用 `--allowedTools`（例如 …）只放行指定工具。你的伺服器啟動 agent 時，也要帶同一組參數。」 |
| 94 | 長句（67 字） | 理由和結論混在一句 | 「**不要設 API key。** 作業要求用學校帳號登入 Claude Code，不用 Agent SDK，也不用 API key。原因是環境變數裡的 `ANTHROPIC_API_KEY` 會優先於登入帳號，設了就等於悄悄改用你自己的帳號付費。」 |
| 101 | 長句（65 字） | 規則、定義與 null 的說明擠在一句 | 「Claude Code 派出 subagent 時，subagent 的事件都帶 `parent_tool_use_id`，值是派出它的那次工具呼叫的 id。主 agent 的事件，這個欄位是 `null`。」 |
| 148 | 長句（63 字） | 名稱差異與建議放在同一句 | 「派 subagent 的工具，作業頁示意圖叫 `Task`，第 2 堂投影片叫 `Agent`。名稱會隨版本改，所以程式靠 `parent_tool_use_id` 判斷，不要寫死工具名稱。」 |
| 170 | 長句（65 字） | 分號串兩件事 | 「空資料夾什麼都看不到。作業頁建議放一個有幾個檔案、有測試的小專案，再下一個要讀、要跑、要改的具體任務，例如「找出讓 test_parse 失敗的 bug 並修好」。」 |
| 191 | 模板化轉折「不是…而是…」 | 第二次出現同骨架 | 「**想改 Claude Code 的一件事**：改的是 Claude Code 本身，不是你的網頁；並寫出你看到了什麼才想改它。」 |
| 163 | 可執行動作 | 「重播模式」只描述概念，沒有一句做得出來的動作 | 加一句：「最簡單的做法是讓伺服器多一個參數，例如 `--replay events.jsonl`，有它就逐行讀檔、每行之間停 50 毫秒再送給瀏覽器。」停頓也能在重播時多少看出畫面有沒有逐行更新。屬於本站補充，要標明 |
| 開頭三段 | 台灣讀者位置 | 前三段沒有交代非修課讀者怎麼用這份作業 | 在第 34 行先備之後加一句：「不是修課生也能照做：準備一個自己的 Claude 訂閱登入、一個有測試的小專案，預估 4–6 小時（作業總覽的估計）。」 |

建議刪除（待確認）：無。這篇的篇幅與資訊密度相稱，不建議縮減。

修正：28、32、50、86、93、94、101、148、170、191、163（重播動作）與開頭讀者定位依建議改寫。

## 複審

複審對象 sha256：8c61e2690ef82a7c46d5548996cbfb5f528cc79a3eaf180a08d9c9f8f6dd9a34，複審者：獨立子代理（未參與撰寫），2026-10-21

依據：`sources/pages/assignments_assignment1.txt`（L12–21、236–244、262–270、294–350）、`assignments_index.txt` L13、`policy.txt` L78、`computing_claude-code.txt` L75；官方文件 2026-10-21 以 curl 重抓 headless、cli-reference、sub-agents、agent-sdk/subagents、agent-sdk/typescript 的 `.md`。程式實跑：把 L128–167 抽成 `tree.py`、L110–120 抽成 `events.jsonl`（放在不同目錄），一律 `python3 -I` 執行。

實跑結果：

| 輸入 | 輸出 | 與文中相符？ |
|---|---|---|
| 文中 11 行 events.jsonl | `Read [ok]`／`Task [ok]`／`  Grep [ok]`／`Bash [error]`／`finished · $0.21 · 42 s · 5 turns` | ✅ 與 L173–177 逐字相同 |
| 截在第 8 行之後（行與行之間） | `Bash [pending]`＋「run 沒有正常結束」 | ✅ 符合 L187 前半 |
| 第 9 行只寫一半 | `Bash [pending]`＋「最後一行不完整，run 可能被中止」 | ✅ 符合 L187 後半 |
| 檔尾多兩個空行 | 與完整串流相同 | ✅（原審發現的崩潰已修） |
| 最後換成 `error_during_execution`、`is_error: true` 的 result | `failed (error_during_execution) · $0.00 · 0 s · 0 turns` | ✅ 失敗分得出來 |
| 只有一行啟動失敗 result | `failed (error_during_execution) · …` | ✅ |
| `subtype: success` 但 `is_error: true` | `failed (success) · …` | ✅ 判為失敗（標籤字樣略怪，見新問題） |
| L68–74 的 7 行示意 | `Read [ok]`／`Bash [error]`／`… 3 turns` | ✅ 與 L89–90 答案一致 |
| `total_cost_usd: 0.137852` | `$0.14` | ✅ |

程式 40 行（含空行），與 tldr「40 行」相符。

| 原審項目 | 已解決？ | 證據（現行行號） |
|---|---|---|
| 必修 1 失敗的 run 分不出來 | ✅ | L53 判準寫兩種情況；L155–159 依 `subtype`／`is_error` 判 finished／failed；實跑確認 |
| 必修 2 主要例子沒附輸入 | ✅ | L106–123 `<details>` 附 11 行 events.jsonl；實跑輸出逐字相符 |
| 必修 3 交件與評分 | ✅ | L230–244：repo `assignment1/`、README、writeup 路徑、session 檔、Canvas 2–3 分鐘影片、70／20／10、依影片判定；與作業頁 L301–321 一致 |
| 必修 4 中止那題答案只對一半 | ✅ | L134–142 加空行略過與 `JSONDecodeError`；L187 答案分兩種情況；實跑相符 |
| 建議 1 連到站內第 2 堂 | ✅ | L30；檔案存在 |
| 建議 2 背景 subagent | ✅ | L182，標「依官方文件、未實跑」；sub-agents L908–910、agent-sdk/subagents L165 支持 |
| 建議 3 `--forward-subagent-text` | ✅ | L182；cli-reference L95 |
| 建議 4 自評清單 | ✅（併入） | L239–244 |
| 建議 5 用 Claude Code 寫前端、4–6 小時 | ✅ | L28（作業頁 L18–19）、L34（assignments_index L13） |
| 建議 6 點名 `--permission-prompt-tool` | ✅ | L253；cli-reference L114、headless L308 |
| 建議 7 示意串流補收尾文字 | ✅ | L73；`num_turns: 3` 與三則 assistant 一致 |
| 建議 8 非修課生登入、本機估算 | ✅ | L34、L95；cli-reference L105「client-side cost estimate」、headless L121 |
| 可選 1、3 | ✅ | L158 `.2f`；L219–220 安全節自我檢查 |
| polish 各項 | ✅ | L28、L32、L50、L87、L94、L95、L102、L180、L197（重播動作標「本文的建議」）、L204、L228 |

新／改寫段落查證：L28、L34、L182、L197、L213–217、L220、L230–244、L253 皆有來源支持；作業頁沒寫的做法（`--replay` 參數、50 毫秒）已標「本文的建議」。未發現把本文解讀歸給作業頁或投影片的情形。L180「第 2 堂投影片叫 `Agent`」對應投影片 p7 工具列 ✅。

新問題：

- 🟢 L182：「派出它的那次呼叫可能先回一個『已啟動』的結果」的出處是 agent-sdk/subagents 頁（L165 `status: "async_launched"`），文中只掛 sub-agents 與 CLI reference；可補連結。
- 🟢 L157：`subtype` 為 `success` 但 `is_error: true` 時印成 `failed (success)`，讀起來矛盾；教學程式可接受，或改印 `failed (is_error)`。
- 🟢 前景 subagent 的第一則是帶 prompt 的 `user` 訊息（headless L213）；若其 `content` 是字串，L151 的迴圈會 `TypeError`。官方文件沒寫格式，L182 已提醒「網頁版要容錯」，可留。

結論：通過
