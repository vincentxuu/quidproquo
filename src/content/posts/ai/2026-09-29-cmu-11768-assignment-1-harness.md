---
title: "CMU 11-768 導讀 A1：親手寫一個 agent harness——同一個 ReAct 迴圈，修 bug、壓上下文、下西洋棋"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, agent-harness, compaction, agent-skills]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 7
tldr: "CMU 11-768 第一份作業要你從空白的 ReAct 迴圈做起：先讓 CodeAgent 用 bash 修好一個西洋棋 app 的 bug，再加上下文壓縮去修一題 SWE-bench，最後讓同一個迴圈變成下棋的 ChessAgent，並用 simulate_move、run_python 與 skill 做兩步搜尋；100 分全部靠離線重播 patch 與軌跡評分。"
description: "導讀 CMU 11-768 Assignment 1（Build an Agent Harness）：三個部分的要求與關係、Modal 沙箱與模型設定、每個 TODO 在考什麼、100 分評分表、設計取捨，以及它如何對應 L1–L6 的工具使用、上下文管理、skills、規劃與 coding agent 概念。不含解答。"
draft: false
glossary:
  - term: "ReAct"
    aliases: ["Reason + Act"]
    definition: "讓模型在同一段上下文裡交錯寫出推理、動作，並讀回動作結果的 agent 迴圈。"
    advanced: "Yao 等人 2022 年提出；現代 tool calling API 把「動作」結構化成 tool call、把「觀察」結構化成 tool 訊息。"
    context: "A1 的三個 agent 共用同一個 ReAct 迴圈。"
  - term: "progressive disclosure"
    aliases: ["漸進揭露"]
    definition: "先只給 agent 每個 skill 的名稱與簡介，需要時才載入完整內容。"
    advanced: "讓 agent 能擁有很多 skill 而不塞爆上下文；Agent Skills 規格以 SKILL.md 的 YAML frontmatter 當目錄。"
    context: "A1 Part 1 要把 skill 目錄放進 system prompt，完整內容透過 invoke_skill 取得。"
  - term: "programmatic tool calling"
    aliases: ["程式化工具呼叫", "code mode"]
    definition: "讓模型寫一段程式，在程式裡直接呼叫工具，而不是每次只發一個工具呼叫。"
    advanced: "迴圈、分支與中間結果都留在沙箱裡，只有最後輸出回到上下文。"
    context: "A1 Part 3 的 run_python 讓棋局搜尋可以一次跑完數百次 simulate_move。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) （[系列總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)）的第一份作業叫 **Build an Agent Harness**，[starter code 在 GitHub](https://github.com/cmu-agents/assignment-1)，截止日是 2026 年 9 月 14 日（週一，依[課程官網 Assignments 頁](https://www.cmu-agents.com/#/assignments)），由助教 Weiwei Sun 與 Saujas Vaduguru 設計。作業文件開頭給的定義很精準：harness 是讓一個「只會產生機率上合理字串的語言模型」能夠**觀察並作用於環境**的介面。你要在 [ReAct](https://arxiv.org/abs/2210.03629) 框架裡從零寫出這層介面。

這份作業最有意思的地方在於它的結構：只有一個 `Agent` 基底類別、一個 ReAct 迴圈，卻要撐起三種完全不同的 agent。你會親眼看到，harness 的骨架是通用的，隨領域改變的只有 prompt、工具和觀察格式。這正好是 [L6 Coding Agents](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents) 投影片上那條定義：Harness = prompts + tools + agent loop + context management。

本篇只講要求、架構、評分與設計取捨，並把每個 TODO 對回 L1–L6 的概念。**不給解答**，也不會貼任何 TODO 的實作。

## 三個部分怎麼串起來

```text
                SWE-Bench issue
                      |
                      v
buggy chess app -> CodeAgent -> fix.patch -> repaired chess server
                                              ^
                                              |
                                    ChessAgent tools
```

- **Part 1**：寫出共用的 ReAct 迴圈，實例化成在終端機裡作業的 `CodeAgent`，讓它修好一個西洋棋 app 的 bug。
- **Part 2**：幫迴圈加上**上下文壓縮**，拿去修一題更長的 SWE-bench 題目。
- **Part 3**：同一個迴圈實例化成 `ChessAgent`，在 Part 1 修好的 app 上對規則型 bot 下棋，逐步加上模擬、程式化工具呼叫與 skill。

三部分是一條因果鏈：Part 1 的 patch 修不好，Part 3 的棋局伺服器就跑不起來。

## 環境與規則

- **套件**：用 [uv](https://docs.astral.sh/uv/) 管理，`make setup` 一鍵安裝，並檢查被測試的 `chess_app` 子模組是否在正確的 commit。
- **沙箱**：agent 產生的指令全部在 [Modal](https://modal.com/) 的遠端沙箱執行，不在你的機器上跑。作業特別提醒：環境沒正常關掉時沙箱會繼續計費，要用 `modal container list` 檢查。
- **模型**：走 OpenAI 相容的 endpoint，預設是 `deepseek/deepseek-v4-flash-0731`，Part 3 的實驗另外要用 `openai/gpt-oss-120b`。修課學生會拿到模型與 Modal 的額度。
- **花錢前先檢查**：任何會用到額度的動作作業都稱為 billable；`make doctor` 會在不開沙箱、不產生 token 的前提下驗證子模組、Modal 登入和模型 endpoint。
- **公開測試不等於正確**：`make test` 離線、免費，但 starter 故意讓 TODO 相關測試失敗。私有測試還會檢查失敗時的清理、重複或格式錯誤的 skill、平行棋步呼叫、傳輸錯誤、artifact 一致性、patch 重播與真實的 Modal 整合。

規則有五條：不准改 `tests/`、`tasks/`、`chess_app/`；不准改提供的 logging 與清理邏輯，也不准在子類別裡複製一份 ReAct 迴圈；不准把答案寫死；絕不外洩 API key；每個階段只能用該 agent 被指定的工具。第二條是整份作業的精神：**迴圈只能有一份**。

## Part 1：共用迴圈與 CodeAgent（30 分）

### 1.1 組 prompt

`Agent.build_prompt` 要把 system prompt、任務 prompt 和先前的互動組成一串訊息，餵給已經寫好的 `query_language_model`。作業把 OpenAI Chat Completions 的訊息規則講得很清楚：

- 開頭恰好一則 `system`（常駐指示：領域、環境、規則、通用策略），接著一則 `user`（任務本身）。
- 每則 `assistant` 之後，只能接 `tool` 訊息（工具結果）或 `user` 訊息。
- 一則 assistant 回應可能同時發出多個 tool call，每個都要有一則對應的 tool 訊息。

另外有兩個硬規定。`CodeAgent` 的 system prompt 必須逐字包含一個 `<system_information>` 區塊，填入沙箱回報的 machine、release、system、version。而且 `build_prompt` 必須**與領域無關**，因為 Part 3 的 `ChessAgent` 會原封不動沿用它。

作業還埋了一個細節在註腳裡：有些模型供應商會重複使用 `call_0` 這種 tool call ID，所以不能假設 ID 在整條軌跡裡唯一，要在同一則 assistant 動作的範圍內配對。

### 1.2 跑迴圈

`Agent.run` 的內容就是 [L1](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent) 講的 agent 定義落地：請模型產生推理與動作、抽出 tool call、執行、把觀察接回去，重複到完成。完成的判斷要設定 `Agent.finished`；超過 `step_limit`（CodeAgent 預設 100 步、ChessAgent 200 步）要丟出 `StepLimitError`。評分表裡這一列還寫著「text-only recovery」：模型只回文字、沒發工具呼叫時，迴圈不能就此卡死或崩潰，你得決定怎麼把它拉回來。

### 1.3 執行工具

`CodeAgent` 只有兩個工具：`execute`（跑一個 bash 指令）和 `send_message`（向使用者回報，同時代表提交）。這就是 L6 說的 bash-only 工具組，跟 [mini-SWE-agent](https://mini-swe-agent.com/latest/) 同一個思路。值得讀一下 starter 附的 `execute` 工具描述，它把 L6 講的問題直接寫進給模型的說明裡：每個指令都在新的 subshell 執行、`cd` 不會延續；讀檔用 `head`、`tail`、`sed -n` 不要整份印出；改檔可以用 `sed -i` 或 heredoc。

硬要求是：**格式錯誤的 JSON 和未知工具都要變成 agent 看得到、可以自己修正的觀察，不能變成例外**。這是 [L2 Tool Use](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use) 的核心觀念：錯誤訊息也是給模型的回饋。

starter 已經幫你做好一件事：工具輸出超過 10,000 字元時，保留頭尾各 4,900 字元，中間換成「省略了 N 字元，請讀更小的範圍」。這是 [L3](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management) 講的觀察截斷，而且提示語本身會引導 agent 改變下一步行為。

### 1.4 載入 skill

修好 bug 還不夠，agent 得知道怎麼提交。作業用一個 [Agent Skills](https://agentskills.io/home) 格式的 `submit-task` skill 教它：把修改寫成 `git diff` 存到 `patch.txt`、檢查 diff 只含原始碼修改、再呼叫 `send_message`，三步要分開做。

你要實作的是**漸進揭露**的最簡版本：

- 掃描 `skills_path` 下每個子目錄的 `SKILL.md`，解析 YAML frontmatter，以 `name` 當 key。
- 每個 skill 產出兩份東西：簡短的 `metadata`（放進 system prompt 當目錄）和完整的 `content`（agent 呼叫 `invoke_skill` 時才給）。
- 名稱重複、frontmatter 缺漏或格式錯誤，要丟出清楚的 `ValueError`。
- 反向要求：**沒有 skill 時，prompt 裡不能出現 `patch.txt` 或任何提交說明**。

這一節直接對應 [L4 Skills and Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory)。反向要求是個好設計：它逼你把「提交協議」完全封裝在 skill 裡，而不是偷偷寫死在 system prompt。

### 1.5 修 bug

任務是 `chess-terminal-move`：白方走出一步合法、而且直接結束棋局的棋（例如將死），`POST /api/move` 卻回 HTTP 500。題目要求終局的一步正常回傳最終狀態、標出結果、不帶引擎回應；非終局的棋仍要有確定性的引擎回應。agent 在 `/testbed` 裡作業，必須重現、修復、驗證——正是 L6 的 localize–edit–verify。

跑 `make run-code-agent` 會產出 `artifacts/fix.patch` 與軌跡檔；`make check-part1` 把 patch 套到**全新的** testbed 上跑回歸測試和 app 的測試組。不准直接改 `chess_app/`。

## Part 2：上下文壓縮（28 分）

長的 ReAct 對話會拉高成本，最後擠掉有用的上下文，甚至撞上模型的 context window。Part 2 要你在共用的 `Agent` 裡實作**由模型產生的工作記憶**，而且明確禁止使用供應商提供的 compaction endpoint。

`compact_context` 的要求很具體：

- 壓縮用的 system prompt 要請模型產出**簡潔、只記事實**的工作記憶，保留目標、限制、檔案、指令、修改、具體結果、失敗過的做法、測試、卡點與下一步。
- 只摘要**舊的前綴**；原本的 system 與 task 訊息要逐字保留；最新一則完整的 assistant 動作連同它所有的 tool 觀察要留著。
- 壓縮後 `build_prompt` 的輸出要真的改變、真的變短。
- 不准碰 `api_prompt` 與 `api_responses`，那是給評分用的帳本。

觸發邏輯 `maybe_compact_context` 已經寫好（估算 token、檢查門檻、記錄壓縮事件），你只要在每次請求新動作前呼叫它。token 估算用的是「JSON 字元數除以 4」的粗估，不依賴特定 tokenizer。

測試題目是 SWE-bench 的 `django__django-15368`：`bulk_update()` 遇到單純的 `F('...')` 表達式時，會把字串 `'F(name)'` 寫進資料庫，而不是解析成欄位。你要用 6,000 token 門檻跑一次（至少觸發一次壓縮、patch 要通過 FAIL_TO_PASS 與 PASS_TO_PASS），再用 `COMPACT_THRESHOLD=0` 跑一次完整上下文的 baseline，比較兩者的 token 用量，寫成 `token-usage-analysis.md`。作業特別說明：生成是隨機的，壓縮版不必比每一次 baseline 都少步數。

這一節對應 L3 Context Management。要想清楚的取捨是：每次壓縮本身也要花一次模型呼叫；摘要越短省越多，但丟掉「失敗過的做法」就可能重蹈覆轍；而切點落在哪裡，決定了訊息序列還合不合 API 的規則。

## Part 3：ChessAgent（40 分）

`ChessAgent` 完全沿用前兩部分的迴圈，執白棋，伺服器上的確定性 bot 執黑棋，白方每走一步它就自動回應。

### 3.1 `play_move`

先依 [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling) 規格定義工具：只接受一個必填字串參數 `move`，說明使用 [UCI 記法](https://en.wikipedia.org/wiki/Universal_Chess_Interface)（例如 `e2e4`、升變 `e7e8q`），拒絕多餘參數。實作端要 POST 到 `/api/move`，成功就格式化狀態、更新 `last_state`、依 `game_over` 設定 `finished`。

錯誤處理列得很完整：JSON 格式錯誤、參數不是物件、型別不對、伺服器拒絕的棋步、網路失敗，全部要包成 `<chess_error>...</chess_error>` 觀察讓 agent 自己處理。還有一條很實際的規則：**模型一次發出多個平行 `play_move` 時，只能執行一個**，其餘要可恢復地拒絕，因為第一步走完，棋盤就變了。

### 3.2 觀察格式的 A/B 實驗

這是整份作業最像研究的一段。你要比較兩種觀察：只有棋盤，以及棋盤加上所有合法棋步；再乘上兩個模型（DeepSeek-V4-Flash 與 gpt-oss-120b），共四次執行。每次記錄 `play_move` 呼叫總數、被判非法的次數、非法率、是否走到終局，寫成 `observation-experiment.md`。評分看實驗與證據，**不看贏不贏**。

這一節對應 L2 的觀察設計：工具回傳什麼，直接決定 agent 犯哪種錯。

### 3.3 `simulate_move`

加一個**不改變真實棋盤**的模擬工具：給完整的六欄位 [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)，回傳該局面與合法棋步；再多給一個 UCI 棋步，就回傳走一步（雙方皆可）之後的局面。這是 [L5 Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning) 裡「先在模型或模擬器裡推演，再決定」的最小版本，也呼應 L6 最後一段的世界模型——只是這裡的模擬器是精確的。

### 3.4 `run_python`

最後是**程式化工具呼叫**：模型寫一段 Python，裡面可以把 `simulate_move` 和 `play_move` 當成一般的同步函式呼叫。程式碼以 base64 編碼後，透過 `env.execute` 交給沙箱裡的 `/opt/assignment/sandbox_python.py` 執行，**不准在本機的 agent 行程裡跑模型寫的程式**。

錯誤要分清楚兩層：沙箱指令本身失敗（非零 return code）是 `<chess_error>`；模型的程式丟出 Python 例外則算正常執行，放在回傳 JSON 的 `error` 欄位。每段程式跑完都要重新讀一次真實棋盤，把狀態附在觀察後面，否則模型可能重送一步程式裡已經走過的棋。

### 3.5 棋局 skill

有了 `run_python`，模型不一定會主動用它。作業再給一個 `select-move` skill：開局照固定偏好走，之後用 Python 對每個候選棋步做「我走一步、黑方回一步、評估」的兩層 minimax，候選依 UCI 字串排序來打破平手，最後才用一次 `play_move` 提交。你要讓 `ChessAgent` 也支援 `invoke_skill`（因為工具執行機制不同，要另外實作），而且只在有載入 skill 時才註冊這個工具。

交出的軌跡必須看得到 `invoke_skill`，接著是呼叫 `simulate_move` 搜尋、只用一次 `play_move` 提交的 `run_python`。只讀了 skill 然後每回合直接 `play_move`，不算數。

## 評分方式

總分 100，每一列獨立給分，某次隨機的模型執行失敗，不會連帶扣掉不相關的實作分。

| 部分 | 評什麼 | 分數 | 證據 |
|---|---|---|---|
| Part 1 | prompt 組裝；ReAct 生命週期、純文字回應恢復、步數上限、清理、軌跡；工具分派與可恢復錯誤；skill 載入與 `invoke_skill` | 22 | 私有單元測試 |
| Part 1 | 西洋棋 patch 能套上並通過私有與回歸測試 | 8 | 在全新 testbed 重播 patch |
| Part 2 | 壓縮觸發與模型產生的摘要；原始指令與最近一步完整保留；壓縮真的減少上下文 | 16 | 私有測試、軌跡與壓縮事件 |
| Part 2 | token 用量分析報告 | 4 | 報告 |
| Part 2 | SWE-bench patch 通過 FAIL_TO_PASS 與 PASS_TO_PASS | 8 | 重播 patch |
| Part 3 | `play_move` schema、狀態更新與錯誤；`simulate_move`；`run_python` | 22 | 私有單元／整合測試 |
| Part 3 | 基本棋局走到終局；四次 A/B 執行齊全；A/B 報告 | 12 | 軌跡、結果、報告 |
| Part 3 | skill、程式化搜尋與實際走棋結合的軌跡 | 6 | 重播軌跡 |
| — | 提交檔完整、可解析、符合規則 | 2 | 壓縮檔驗證 |

評分的關鍵設計是：**評分器只重播你交的 patch 和軌跡，不會再呼叫任何 LLM**。所以軌跡本身就是證據，缺漏或前後不一致只扣該列的分。提交物是一個 ZIP，含修改過的 `src/assignment/agent/`、十七個 artifact，以及一份 `AI_USAGE.md` 說明用了哪些 AI 工具。後者不計分，但課程會用小考確認你看得懂自己交出的程式。

## 設計取捨：這份作業真正在考什麼

讀完規格，可以看出作業把 harness 的幾個核心判斷都攤開來了：

- **狀態放哪裡**。`build_prompt` 每一步都重新組 prompt，你得自己決定 agent 要記哪些東西；同時又不能動評分用的 `api_prompt`。這就是 L3 講的「給模型看的上下文」和「真正發生過的紀錄」是兩回事。
- **錯誤是例外還是觀察**。整份作業反覆要求把錯誤變成觀察：壞 JSON、未知工具、非法棋步、網路失敗、Python 例外。harness 的強健性，很大一部分就是把失敗翻譯成模型能讀懂的回饋。
- **工具的粒度**。CodeAgent 只給 bash，ChessAgent 從單一 `play_move` 一路加到 `run_python`。對照 L6 的討論：工具越少越通用，但模型得自己組合；把常用動作包成專用工具，模型就少犯錯。
- **觀察要給多少**。合法棋步清單能大幅減少非法棋步，但也佔上下文。A/B 實驗讓你用數字回答，而不是憑直覺。
- **知識放 prompt 還是 skill**。提交協議與下棋策略都放在 skill，system prompt 只放目錄。skill 一多，這個選擇的差別就很明顯。

## 對應 L1–L6

| 作業段落 | 對應講次 | 概念 |
|---|---|---|
| 1.1 組 prompt、1.2 ReAct 迴圈 | L1 What Is an Agent? | agent = 在環境中觀察與行動的迴圈 |
| 1.3 工具分派與錯誤、3.1 `play_move` schema | L2 Tool Use | tool schema、錯誤當回饋、平行工具呼叫 |
| starter 的觀察截斷、Part 2 壓縮 | L3 Context Management | 截斷、摘要、長任務的成本 |
| 1.4 與 3.5 的 skill | L4 Skills and Memory | 漸進揭露、可重用的工作流程 |
| 3.3 `simulate_move`、3.5 兩層搜尋 | L5 Planning | 先推演再行動、搜尋 |
| 1.5 修 bug、Part 2 的 SWE-bench | L6 Coding Agents | localize–edit–verify、bash-only 工具組、SWE-bench 評分 |

## 怎麼做：沒修課也能練的三件事

作業仰賴 Modal 與課程提供的模型額度，沒修課的人要自己準備沙箱與 OpenAI 相容 endpoint，成本自理。就算不跑完整作業，下面三件事也能在自己的 agent 上做：

1. **把工具錯誤全部改成觀察**：找出你的 agent 裡所有會讓迴圈崩潰的例外路徑（壞 JSON、未知工具、網路逾時），改成回傳一則說明錯誤的 tool 訊息，再看模型能不能自己修正。
2. **做一次觀察格式 A/B**：挑一個工具，比較「只回結果」和「回結果加上下一步可用選項」兩種觀察，記錄呼叫數與錯誤率。
3. **量一次壓縮前後的 token**：用和作業相同的粗估法（JSON 字元數除以 4），替你最長的一條軌跡算出每一步的上下文長度，看壓縮能省下多少、又丟了什麼。

## 延伸閱讀

- 系列前一篇：[L6 Coding Agents](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents)
- 站內：[Stanford CS329Z Week 4：ReAct 與記憶](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory)（ReAct 原論文與 MemGPT 導讀）
- 站內：[Coding agent 的上下文壓縮](/posts/ai/2026-08-25-coding-agent-context-compaction)
- 站內：[Coding agent 的 code mode](/posts/ai/2026-08-25-coding-agent-code-mode)（程式化工具呼叫的設計取捨）
- 站內：[Coding agent 的 hooks、skills 與 plugins](/posts/ai/2026-08-25-coding-agent-hooks-skills-plugins)

## 參考資料

- 課程：[CMU 11-768 AI Agents 官網 Assignments 頁（A1 截止日）](https://www.cmu-agents.com/#/assignments)、[Course Staff 頁（助教名單）](https://www.cmu-agents.com/#/staff)
- 作業：[cmu-agents/assignment-1（GitHub，本文依 2026-09-11 的 commit 67498d8 核對 ASSIGNMENT.md、README 與 starter code）](https://github.com/cmu-agents/assignment-1)
- 論文：[Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)（作者與 2022 年發表日）
- 規格：[Agent Skills specification](https://agentskills.io/specification)（SKILL.md 的 YAML frontmatter 與 progressive disclosure）
- 題目：[SWE-bench](https://arxiv.org/abs/2310.06770)、[mini-SWE-agent](https://mini-swe-agent.com/latest/)
- 規格：[OpenAI function calling guide](https://developers.openai.com/api/docs/guides/function-calling)（以 JSON schema 定義 `parameters`、`required`，strict mode 要求 `additionalProperties: false`）
- 工具：[uv](https://docs.astral.sh/uv/)（Python 套件與專案管理工具）、[Modal](https://modal.com/)（[Sandboxes 指南](https://modal.com/docs/guide/sandbox)：用來執行 LLM 產生的不受信任程式碼；[`modal container list`](https://modal.com/docs/reference/cli/container) 列出目前執行中的容器）
- 棋局記法：[Universal Chess Interface](https://en.wikipedia.org/wiki/Universal_Chess_Interface)（UCI 棋步用長代數記法變體，範例 `e2e4`、升變 `e7e8q`）、[Forsyth–Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)（FEN 記錄有六個以空白分隔的欄位）
