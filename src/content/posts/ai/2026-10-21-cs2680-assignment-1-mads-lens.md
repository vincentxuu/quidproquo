---
title: "看見 agent 在做什麼：用 stream-json 畫出執行軌跡｜Harvard CS2680 作業 1"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, claude-code, coding-agent, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 3
tldr: "CS2680 作業 1 要你做一個網頁來驅動 Claude Code：送出任務，即時看到 agent 讀了什麼、跑了什麼、結果如何，最後顯示花了多少錢、幾秒、幾輪。關鍵是讀懂 `claude -p --output-format stream-json --verbose` 的事件串流：tool_use 和 tool_result 靠同一個 id 配對，subagent 的事件靠 parent_tool_use_id 掛回呼叫它的那一步。這篇拆解七項要求、示範用 40 行 Python 把事件串成一棵樹並分辨成功與失敗，最後整理交件、評分與開發時最容易卡住的地方。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）作業 1 Mads-Lens 導讀：七項功能要求、stream-json 事件的種類與配對規則、用 Python 重建工具呼叫樹、錄一次重播多次的開發方式、權限與帳號的陷阱、writeup 與評分方式。依據公開作業頁面，不含官方解答。"
draft: false
glossary:
  - term: "headless mode"
    aliases: ["print mode", "claude -p"]
    definition: "Claude Code 不開互動介面、直接執行一個任務的模式；用 -p 參數啟動，跑完就結束，適合被別的程式呼叫。"
    context: "作業 1 的網頁就是在背後用 headless mode 啟動 Claude Code。"
  - term: "stream-json"
    definition: "Claude Code 的一種輸出格式：執行過程中每發生一件事就印出一行 JSON，一行一個事件。"
    context: "作業 1 的網頁本質上就是這個事件串流的渲染器。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens-en)

**影片狀態：課程不錄影。** 本文依公開作業頁面整理，程式範例為本站補充，不是官方解答。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 的[作業 1](https://cs2680.com/assignments/assignment1) 叫 Mads-Lens，9/2 發、9/20 截止，佔總成績 10%。你要做一個網頁來驅動 [Claude Code](https://code.claude.com/docs/en/overview)：在網頁上打一個任務，agent 在你指定的資料夾裡工作，網頁同步顯示它在做什麼。作業頁說這份作業刻意做得很小，後面的作業也不會拿它當基準；在自己電腦上跑起來就夠了。作業頁也建議前端本身就用 Claude Code 來寫：這樣最快，而且看著 agent 寫網頁，你會知道網頁該顯示什麼。

這份作業接在[第 2 堂](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)後面。第 2 堂講 Claude Code 的 loop：模型提出要跑的工具，harness 執行，結果放回 context，一直重複。作業 1 讓你親眼看到這個 loop 一步一步發生。

這篇要回答一個問題：Claude Code 吐出來的事件，怎麼還原成它每一步做了什麼、花了多少？讀完你應該能拿一段 stream-json 輸出，畫出工具呼叫的順序與巢狀，並算出步數與成本。這篇不給官方解答，也不談網頁框架選型；作業頁明說用什麼語言、什麼 web 技術都可以。

先備：會在 terminal 跑指令、看得懂 JSON、寫過一點後端（能啟動子行程、把輸出轉給瀏覽器）。作業總覽估計要 4–6 小時。不是修課生也能照做：用你自己的 Claude 訂閱登入 Claude Code，再準備一個有測試的小專案。

## 作業要你做什麼

作業分三部分：先在 terminal 驅動 Claude Code，再做網頁，最後寫 writeup。網頁要有七項功能，作業頁只規定「要做到什麼」，長相和做法自己決定：

| 功能 | 要做到什麼 |
|---|---|
| 1. 送出任務 | 一個文字框送出請求，在你選的工作資料夾上執行；跑完可以再送下一個 |
| 2. 即時顯示軌跡 | 事件一到就畫出來，不是跑完才一次顯示；agent 的文字通常是 markdown，要渲染成格式 |
| 3. 顯示工具結果 | 每個工具呼叫的結果跟著呼叫顯示，太長的要刻意截短、可展開 |
| 4. 兩層狀態 | 每個工具呼叫：從 tool_use 出現到對應 tool_result 回來之前都是 pending，出錯要看得出來；整個 run：進行中、完成、失敗，失敗不能讓頁面永遠等下去 |
| 5. 接續對話 | 下一個提問接著同一個 session，agent 保留前一輪的 context |
| 6. 顯示數字 | run 結束時顯示花費、經過時間、輪數 |
| 7. 樹狀軌跡 | subagent 的事件巢狀掛在派出它的那個工具呼叫底下，可收合；旁邊再放一個只列工具名稱的大綱 |

作業頁也提醒：七項只是底線。agent 寫出的第一版通常剛好達標，不會太好用，所以要自己用、找出不順手的地方再改。writeup 第一段就要列出這些改進。

> **自我檢查**：功能 4 要求「失敗的 run 要看得出來，不能讓頁面一直等」。哪兩種情況要處理？
> 判準：答出兩種。一是有 result 事件，但 `subtype` 不是 `success` 或帶 `is_error: true`（例如執行中出錯），要顯示成失敗；二是根本沒有 result（例如工作資料夾不存在、子行程直接結束），要看子行程的結束與錯誤碼，否則頁面會卡在「進行中」。

## 第一步：讀懂事件串流

作業頁要你在寫任何網頁程式之前，先在 terminal 跑一次、把事件讀過，因為第二部分的網頁就是這個串流的渲染器：

```bash
claude -p "Say hello in one short sentence." --output-format stream-json --verbose
```

`-p` 讓 Claude Code 不開互動介面直接跑（headless mode），`--output-format stream-json` 讓它每發生一件事就印一行 JSON。作業頁註明在這個模式下還要加 `--verbose`，[headless mode 文件](https://code.claude.com/docs/en/headless)的 stream-json 範例也都帶著它。

一次會用到工具的 run，事件大致是這個順序（以下是本文整理的示意，只留關鍵欄位）：

```json
{"type":"system","subtype":"init","session_id":"s-1","tools":["Read","Bash","Edit"]}
{"type":"assistant","message":{"content":[{"type":"text","text":"先讀測試。"},{"type":"tool_use","id":"t1","name":"Read","input":{"file_path":"tests/test_parse.py"}}]}}
{"type":"user","message":{"content":[{"type":"tool_result","tool_use_id":"t1","content":"def test_parse(): ..."}]}}
{"type":"assistant","message":{"content":[{"type":"tool_use","id":"t2","name":"Bash","input":{"command":"pytest -x"}}]}}
{"type":"user","message":{"content":[{"type":"tool_result","tool_use_id":"t2","content":"FAILED ...","is_error":true}]}}
{"type":"assistant","message":{"content":[{"type":"text","text":"測試失敗在 parse()，原因是缺少結尾換行。"}]}}
{"type":"result","subtype":"success","num_turns":3,"duration_ms":42000,"total_cost_usd":0.21,"session_id":"s-1"}
```

逐行對回第 2 堂的 loop：

| 事件 | 意思 | 對應 loop 的哪一步 |
|---|---|---|
| `system` / `init` | 開場資訊：session id、可用工具、模型 | harness 組好開場 context |
| `assistant` 含 `text` | 模型說的話 | 模型推論 |
| `assistant` 含 `tool_use` | 模型「提出」要跑的工具與參數 | model proposes |
| `user` 含 `tool_result` | harness 跑完工具，把結果送回模型 | harness executes，結果放回 context |
| `result` | 這一輪結束，附花費、時間、輪數、session id | loop 停止 |

注意 `tool_result` 放在 `user` 事件裡。這一則不是你打的字：harness 以使用者的身分把工具結果交回模型，對模型來說，工具結果就是下一則輸入。

> **自我檢查**：上面的範例裡，模型總共提出了幾次工具呼叫？最後一次呼叫成功了嗎？
> 答：兩次（Read 與 Bash）。Bash 那次的 tool_result 帶 `is_error: true`，測試沒過；但在這份示意裡，agent 看完失敗、說明原因後正常結束，所以 run 的 `subtype` 是 `success`。工具失敗和 run 失敗是兩件事，功能 4 要分開顯示。

### 權限與帳號：兩個容易卡住的地方

- **headless 模式沒有人可以按「允許」。** 互動模式下 Claude Code 改檔或跑指令前會先問你；headless 模式沒人可問，需要核准的請求會直接被拒。作業頁的建議：對著練習用的資料夾時，用 `--dangerously-skip-permissions` 全部放行；或用 `--allowedTools`（例如 `--allowedTools "Edit" "Bash(pytest:*)"`）只放行指定工具。你的伺服器啟動 agent 時，也要帶同一組參數。
- **注意是誰在付錢。** 作業要求用學校帳號登入 Claude Code，不用 Agent SDK，也不用 API key。原因是環境變數裡的 `ANTHROPIC_API_KEY` 會優先於登入帳號，設了就等於悄悄改用你自己的帳號付費；不是修課生的話，同樣要留意這一點。另外，result 裡的 `total_cost_usd` 是 Claude Code 在本機估算的值，不是帳單（[CLI reference](https://code.claude.com/docs/en/cli-reference)）。

## 把事件串成一棵樹

功能 4 與 7 的核心是兩個配對規則，都寫在作業頁上：

1. **tool_use 和 tool_result 靠同一個 id 配對**：`tool_use` 的 `id` 等於之後 `tool_result` 的 `tool_use_id`。配對到之前，這個呼叫就是 pending。
2. **subagent 的事件靠 `parent_tool_use_id` 掛回去**：Claude Code 派出 subagent 時，subagent 的事件都帶 `parent_tool_use_id`，值是派出它的那次工具呼叫的 id。主 agent 的事件，這個欄位是 `null`。

先看一段含 subagent 的串流。主 agent 先 Read，再派一個 subagent（它自己跑了一次 Grep），接著跑 Bash 而測試失敗，最後說明原因（本文自製的示意檔）：

<details>
<summary>展開 events.jsonl（11 行）</summary>

```json
{"type":"system","subtype":"init","session_id":"s-1","model":"m","tools":["Read","Bash","Edit","Task"]}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"text","text":"先讀測試。"},{"type":"tool_use","id":"t1","name":"Read","input":{"file_path":"tests/test_parse.py"}}]}}
{"type":"user","parent_tool_use_id":null,"message":{"content":[{"type":"tool_result","tool_use_id":"t1","content":"def test_parse(): ..."}]}}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"tool_use","id":"t2","name":"Task","input":{"description":"survey src"}}]}}
{"type":"assistant","parent_tool_use_id":"t2","message":{"content":[{"type":"tool_use","id":"t3","name":"Grep","input":{"pattern":"TODO"}}]}}
{"type":"user","parent_tool_use_id":"t2","message":{"content":[{"type":"tool_result","tool_use_id":"t3","content":"src/parser.py:12: # TODO"}]}}
{"type":"user","parent_tool_use_id":null,"message":{"content":[{"type":"tool_result","tool_use_id":"t2","content":"parser.py 有一個 TODO。"}]}}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"tool_use","id":"t4","name":"Bash","input":{"command":"pytest -x"}}]}}
{"type":"user","parent_tool_use_id":null,"message":{"content":[{"type":"tool_result","tool_use_id":"t4","content":"FAILED tests/test_parse.py","is_error":true}]}}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"text","text":"測試仍失敗在 parse()，原因是缺少結尾換行。"}]}}
{"type":"result","subtype":"success","num_turns":5,"duration_ms":42000,"total_cost_usd":0.21,"session_id":"s-1"}
```

</details>

下面是本文的教學程式，用 40 行 Python 把它串成一棵樹。它只示範配對邏輯與結束狀態，不是作業解答（作業要的是即時渲染的網頁）：

```python
import json, sys

calls = {}      # tool_use id -> 這次工具呼叫
roots = []      # 主 agent 的呼叫，依出現順序
summary = "run 沒有正常結束"

for line in open(sys.argv[1]):
    line = line.strip()
    if not line:
        continue
    try:
        ev = json.loads(line)
    except json.JSONDecodeError:
        summary = "最後一行不完整，run 可能被中止"
        break
    parent = ev.get("parent_tool_use_id")
    if ev["type"] == "assistant":
        for block in ev["message"]["content"]:
            if block["type"] == "tool_use":
                call = {"name": block["name"], "status": "pending", "children": []}
                calls[block["id"]] = call
                (calls[parent]["children"] if parent in calls else roots).append(call)
    elif ev["type"] == "user":
        for block in ev["message"]["content"]:
            if block["type"] == "tool_result" and block["tool_use_id"] in calls:
                call = calls[block["tool_use_id"]]
                call["status"] = "error" if block.get("is_error") else "ok"
    elif ev["type"] == "result":
        ok = ev["subtype"] == "success" and not ev.get("is_error")
        state = "finished" if ok else f'failed ({ev["subtype"]})'
        summary = (f'{state} · ${ev["total_cost_usd"]:.2f} · '
                   f'{ev["duration_ms"] / 1000:.0f} s · {ev["num_turns"]} turns')

def show(call_list, depth=0):
    for c in call_list:
        print("  " * depth + f'{c["name"]} [{c["status"]}]')
        show(c["children"], depth + 1)

show(roots)
print(summary)
```

餵它上面那份 `events.jsonl`，輸出是：

```text
Read [ok]
Task [ok]
  Grep [ok]
Bash [error]
finished · $0.21 · 42 s · 5 turns
```

Grep 縮排在 Task 底下，因為它的事件帶著 `parent_tool_use_id` 指向 Task 那次呼叫。派 subagent 的工具，作業頁示意圖叫 `Task`，第 2 堂投影片叫 `Agent`。名稱會隨版本改，所以程式靠 `parent_tool_use_id` 判斷，不要寫死工具名稱。

真實串流比這份示意複雜，網頁版要容錯。兩個和 subagent 有關的地方值得先知道（依 2026-10 的官方文件，本文沒有實跑驗證）：新版 Claude Code 的 subagent 預設在背景執行，派出它的那次呼叫可能先回一個「已啟動」的結果，subagent 的事件之後才陸續到；subagent 自己說的文字預設不轉送，要加 `--forward-subagent-text` 才會出現在串流裡（[sub-agents](https://code.claude.com/docs/en/sub-agents)、[CLI reference](https://code.claude.com/docs/en/cli-reference)）。

網頁版要多做的，就是把這段邏輯改成「每讀到一行就更新畫面」：事件一到就插入節點，tool_result 一到就把 pending 改成完成或錯誤，result 一到就顯示完成或失敗。

> **自我檢查**：如果 run 跑到一半被你中止，上面的程式會輸出什麼？
> 答：看中止在哪裡。剛好停在兩個事件之間，最後一行是「run 沒有正常結束」，還沒收到 tool_result 的呼叫停在 pending；最後一行只寫了一半，程式接住 `JSONDecodeError`，印出「最後一行不完整」。沒有那個 `try`，程式會直接當掉、什麼都不印。網頁版兩種都要顯示成中止，不能一直轉圈。

## 開發方式：錄一次，重播很多次

作業頁給了一個很實用的建議：先存一份完整的串流，

```bash
claude -p "<任務>" --output-format stream-json --verbose > events.jsonl
```

再讓你的伺服器多一個「重播模式」：讀這個檔案代替真的啟動 agent。最簡單的做法（本文的建議）是加一個參數，例如 `--replay events.jsonl`，有它就逐行讀檔，每行之間停 50 毫秒再送給瀏覽器，這樣重播時也看得出畫面有沒有逐行更新。真的跑一次要一分鐘以上、還會花用量；重播是即時而且免費的，改一行程式就能馬上看結果。樹狀圖要另外錄一份會派 subagent 的串流（作業頁建議用「use a subagent to survey this directory」這種提示）。

但有兩件事只有真的跑才測得到，最後一定要用真實 run 驗一次：

- **事件是不是一到就畫出來。** 重播一口氣讀完檔案，看不出你的伺服器或瀏覽器有沒有把輸出暫存起來、等到最後才送。
- **session 能不能接續。** `--resume` 需要真的 session id：把 result 事件裡的 `session_id` 存起來，下一次用 `claude -p --resume <session-id> "<下一個問題>" …` 啟動，agent 就保有前一輪的 context。

給 agent 一個值得看的任務也很重要。空資料夾什麼都看不到。作業頁建議放一個有幾個檔案、有測試的小專案，再下一個要讀、要跑、要改的具體任務，例如「找出讓 test_parse 失敗的 bug 並修好」。

> **自我檢查**：你的頁面重播時一切正常，真的跑時卻要等到最後才一次出現所有事件。最可能是哪一段出問題？
> 判準：答出輸出被暫存（buffering）了，例如子行程的輸出沒有逐行讀、伺服器沒有逐行轉送（SSE 或 WebSocket），或回應被整包送出；重播測不出來，因為檔案本來就是一次讀完。

## 要注意的安全問題

這個網頁本質上是一個「遠端遙控器」：它會啟動一個能讀檔、能跑指令的程式。作業頁的提醒是：

- 在自己電腦上跑就夠了，評分不需要公開網址。
- 真的要放到雲端機器上給別的裝置連，前面要加一組隨機 token（例如 `openssl rand -hex 16`，不要放進 repo），沒有 token 的請求一律拒絕。
- 讓 agent 對著練習用的資料夾工作，不要對著家目錄；你的頁面、截圖和 demo 會顯示它讀到的所有東西。

作業頁也明說，不要用 agent 框架或自己重寫 agent loop，那是[作業 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop)的事。

> **自我檢查**：放上雲端時，為什麼 token 不能 commit 進 repo？
> 答：repo 會分享給助教，也可能被推到別處；token 一外流，任何人都能用你的頁面在那台機器上讀檔、跑指令。

## Writeup 要寫什麼

writeup 要自己寫，作業頁說完全由 AI 產生的 writeup 會被扣分。三段：

1. **你做了什麼**：一段話加一張截圖，列出七項以外的改進。
2. **你學到什麼**：三個觀察，每個都要對應到某次 session 的具體時刻。(1) agent 怎麼工作：它在哪裡花了比你預期多的時間、讀了什麼你不會讀的東西；(2) 一個坑：哪裡出錯或讓你意外、你怎麼發現的；(3) 一個教訓：下次用 agent 你會怎麼下提示、怎麼切範圍、怎麼監督。
3. **想改 Claude Code 的一件事**：改的是 Claude Code 本身，不是你的網頁；並寫出你看到了什麼才想改它。

## 交什麼、怎麼評分

| 交什麼 | 放哪裡 |
|---|---|
| 程式，附 README 說明怎麼啟動伺服器 | 課程共用私有 repo 的 `assignment1/` |
| writeup | `assignment1/writeup.md` 或 `.pdf` |
| Claude Code 的 session 檔 | 同一個 repo（每份作業都要附） |
| 2–3 分鐘的 demo 影片 | 上傳 Canvas |

影片是評分的主要依據：它要用一個真實的多輪任務，演示全部七項功能，包含一次失敗的 run 和一次派 subagent 的 run。配分是七項功能共 70%（每項 10%，依影片判定完整、部分或沒有），writeup 20%（大部分在第 2 段，要對應到具體 session 的觀察），視覺設計 10%。

所以開發時要先準備好兩份錄好的串流：一份會失敗的、一份會派 subagent 的；錄影前也要確認續問的那一題，只有接上前一輪才說得通。

> **自我檢查**：你的頁面七項都做了，但錄影時只示範了一次成功的 run。功能 4 會拿到幾分？
> 判準：答出只拿部分或拿不到分。功能依影片判定，沒演示失敗的 run，「失敗看得出來」這半就等於沒有證據。

## 綜合自我檢查

1. 一個 run 的 result 事件寫 `num_turns: 12`、`total_cost_usd: 0.58`。如果你想知道「平均每輪多少錢」，可以直接相除嗎？要注意什麼？
   答：可以算出約 \$0.048／輪，但它只是平均。依第 2 堂的 loop，後面的輪次 context 比較長，通常比前面貴；想看每輪實際花費，要看每次模型呼叫的 token 用量，而不是 result 的總數。
2. 為什麼作業要你「事件一到就畫」，而不是跑完再整理成漂亮的報告？
   判準：答出這份作業的學習目標之一是看著軌跡發生，看見 agent 在哪裡停下來等工具、在哪裡繞路；跑完才看，就只剩結果，看不到過程。
3. 你想加一個「允許／拒絕」按鈕，讓 agent 每次跑指令前先問你。用現在的 headless 指令做得到嗎？
   判準：答出單靠作業頁這組參數做不到：headless 模式沒有人可問，需要核准的請求直接被拒。要嘛事先用 `--allowedTools` 放行，要嘛用 `--permission-prompt-tool` 把核准請求轉給你的伺服器，讓網頁顯示按鈕（[CLI reference](https://code.claude.com/docs/en/cli-reference)）。作業頁把這個列為選做項目之一。

## 延伸閱讀

- [Claude Code headless 模式指南](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide)：`-p` 的其他參數與在 CI 裡的用法。
- [Claude Code 是怎麼運作的](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)：事件背後的 loop。
- [課程總覽](/posts/ai/2026-10-21-cs2680-course-overview)：作業 1 在整門課的位置。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。作業沒有錄影可對照。
- 底本：[作業 1 頁面](https://cs2680.com/assignments/assignment1)與[作業總覽](https://cs2680.com/assignments/)，2026-10-21 讀取。文中的事件示意與 Python 程式是本站補充，欄位依作業頁與 [headless mode 文件](https://code.claude.com/docs/en/headless)整理；程式已用文中的 `events.jsonl`、一份截斷的串流與一份 `error_during_execution` 結尾的串流跑過。

## 更新紀錄

- 2026-10-22：補上作業 2 的站內連結。

## 參考資料

- [CS2680 作業 1：Experience a coding agent（Mads-Lens）](https://cs2680.com/assignments/assignment1)
- [CS2680 作業總覽](https://cs2680.com/assignments/)
- [CS2680 第 2 堂投影片：How Claude Code works](https://cs2680.com/slides/2_agent_use_1.pdf)
- [Claude Code 文件：Run Claude Code programmatically（headless mode）](https://code.claude.com/docs/en/headless)
- [Claude Code 文件：CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code 文件：Subagents](https://code.claude.com/docs/en/sub-agents)
- [CS2680 課程政策](https://cs2680.com/policy)
