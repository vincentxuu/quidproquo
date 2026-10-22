---
title: "親手寫一個 coding agent harness：四個工具加一個 loop｜Harvard CS2680 作業 2"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, coding-agent, agent-harness, swe-bench, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 6
tldr: "CS2680 作業 2（Mads-Loop）要你自己寫一個 coding agent harness：用指定的小模型 qwen3.6-35b-a3b，在 Docker 容器裡修 SWE-bench Pro 的真實 issue，並照規定格式記下每一步。作業頁明說它給的設計不要照單全收，10 題裡也有解不了的題。這篇整理規格、作業頁值得懷疑的幾處、harness 最常壞的五個地方與各自的處理方式（附一段實跑過的片段），以及怎麼自建四題評估集、怎麼判斷一題是不是真的解不了。不含官方解答。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）作業 2 Mads-Loop 導讀：模型與端點、Docker 任務容器、JSONL log schema、四個工具與 agent loop、作業頁要你懷疑的設計、五種 harness 失敗與處理策略、壞掉的 tool call 怎麼回、SWE-bench Pro 官方評估、自建 mytest 評估集、評分方式。依據公開作業頁面與 starter 檔，不含官方解答。"
draft: false
glossary:
  - term: "fail_to_pass／pass_to_pass"
    aliases: ["fail_to_pass", "pass_to_pass", "FAIL_TO_PASS", "PASS_TO_PASS"]
    definition: "SWE-bench 類題庫判定一題解出的兩組測試：fail_to_pass 在修好前失敗、修好後要通過；pass_to_pass 在修好前後都要通過，用來抓「修好一處、弄壞別處」的 patch。"
    context: "作業 2 的官方評估與自建題目都用這兩組測試判定 RESOLVED。"
  - term: "SWE-Bench Pro"
    definition: "Scale AI 2025 年發表的 coding agent 題庫：1,865 題、41 個 repo，題目比 SWE-bench 更長、更常跨多個檔案；每題除了 issue 原文，還附人工補寫的 requirements 與 interface。"
    context: "作業 2 的 10 題與 hidden tasks 都來自這份題庫。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en)

**影片狀態：課程不錄影。** 本文依公開作業頁面與 starter 檔整理，程式片段為本站補充，不是官方解答。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 的[作業 2](https://cs2680.com/assignments/assignment2) 叫 Mads-Loop，9/21 發、10/4 截止，佔總成績 10%。作業 1 是看著 Claude Code 工作；這份作業要你自己寫一個：給一個模型、幾個工具、一個 loop，讓它在真實的開源 repo 裡修 issue。

它接在[第 4 堂](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering)後面。第 4 堂把 agent 寫成[一段 20 多行的 loop](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering#第-2-堂的軌跡寫成-20-多行程式)，用的是照劇本回覆的假模型。作業 2 把假模型換成真模型、把假工具換成真的 shell 與檔案，題目換成 [SWE-Bench Pro](https://arxiv.org/abs/2509.16941) 的真實 issue。loop 還是那段 loop，難的是它周圍的事：模型回了壞掉的指令怎麼辦、指令跑不完怎麼辦、輸出太長怎麼辦。

這篇要回答的問題是：四個工具加一個 loop，怎麼在 SWE-bench Pro 上跑起來而且不崩？讀完你應該能列出自己的 harness 要處理的五種失敗，並各寫出一條處理策略。

先備：讀過第 4 堂（loop、工具設計、context 管理）；會用 Docker 和 git；看得懂 Python。不是修課生也能照做大部分內容：題目來自公開的 SWE-Bench Pro，模型 [Qwen3.6-35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) 是開放權重，換成你自己的 OpenAI 相容端點即可。

## 作業要你做什麼

你要寫一個叫 `madsLoop` 的程式，介面是：

```bash
python madsLoop.py -p "<problem statement>" [--log] <workdir>
```

`-p` 是題目的 issue 文字，`<workdir>` 是 repo 的位置。agent 只能在這個資料夾裡讀、搜尋、改檔、跑指令；跑完時，修好的內容以未暫存的改動留在資料夾裡，評分程式再用 `git diff` 取出 patch。規格整理如下：

| 項目 | 作業頁的規定 |
|---|---|
| 模型 | `qwen3.6-35b-a3b`，所有評估都要用它 |
| 端點 | 課程 proxy `https://api.cs2680.com/v1`，OpenAI 相容；金鑰放環境變數 `CS2680_API_KEY`，不能寫進程式或 commit |
| 執行環境 | 每題一個預建的 Docker image（約 1.6–1.8 GB），repo 停在出題時的那個 commit（base commit）、依賴都裝好；agent 在容器裡跑 |
| 建議工具 | `bash(command)`、`read_file(path)`、`edit_file(path, old_string, new_string)`、`done(summary)`，可以自己改 |
| 題目 | 10 題，有些即使 harness 完美也解不了 |
| agent 能用的資料 | 只有 `agent_task_input.json` 的題目內容；評分用的 `task_test.json`、自建題的 `gold.diff` 都不能讓 agent 看到 |
| log | 加 `--log` 時寫 JSONL 到 `madsLoop_logs/`，欄位照規定 |

這個模型是 MoE（混合專家）架構，總參數 35B，每個 token 只啟用 3B，原生 context 262,144 token，預設開著 thinking mode（[模型卡](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)）。課程 proxy 上的 context 上限作業頁沒寫，要自己量。

在 x86-64 的 Linux 上最省事。Apple Silicon 的 Mac 要用模擬執行，作業頁要你設 `PLATFORM_FLAG="--platform linux/amd64"`，會比較慢；也可以用課程的 cluster。

### 硬性要求只有三條

作業頁開頭有一段警語：Part 0 和 Part 1 描述的是一種設計選擇，不是答案，「DO NOT TRUST IT」。真正不能改的只有三條：

1. 模型用 `qwen3.6-35b-a3b`。
2. 評分程式能呼叫 `run_task.sh`，產出可以評估的 patch 和 agent log。
3. log 符合規定的 schema。

工具組、system prompt、loop 的停止條件、context 怎麼管，都是你可以改的。writeup 有一段就是要你寫「哪裡跟作業頁不一樣、為什麼」。

### log 的格式

log 一行一個事件，每行都有 `timestamp`（ISO-8601）與 `event`，其餘欄位依事件而定：

| event | 必填欄位 |
|---|---|
| `run_start` | `model_id`、`workdir` |
| `api_request` | `iteration`、`prompt_tokens`、`completion_tokens`、`total_tokens`（直接取自 `response.usage`） |
| `api_retry` | `iteration`、`error`、`backoff_s` |
| `tool_call` | `iteration`、`tool_name`、`arguments` |
| `tool_result` | `iteration`、`tool_name`、`result`、`is_error` |
| `run_end` | `reason`（`done`／`no_tool_calls`／`error`／自訂的上限）、`num_iterations` |

兩個細節容易漏。第一，`tool_result` 的 `result` 要記「截斷後、實際餵給模型的那個版本」，不是原始輸出，這樣看 log 的人才看得到模型當時看到了什麼。第二，作業頁要你「剛好用這些欄位」；除錯訊息請印到 stderr，不要混進 log。

這份 log 跟作業 1 讀的 [stream-json](/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens) 是同一類東西：作業 1 你是讀別人的 agent 吐出的事件，這次換你自己吐。另外還要交 `developer_logs/`，也就是你用 coding agent 開發 `madsLoop` 時的 session 記錄。

> **自我檢查**：你的 agent 跑到第 9 步，模型回了一段文字、沒有任何 tool call，loop 就結束了。`run_end` 的 `reason` 該填什麼？這算成功嗎？
> 答：填 `no_tool_calls`。不一定算成功：模型沒呼叫 `done` 就停，可能是它以為修好了，也可能是它放棄了。要看 `git diff` 有沒有內容、測試有沒有過；這也是後面「不收斂」那一類失敗要處理的情況。

## 作業頁要你懷疑的地方

「不要照抄」不是客套話。照作業頁原文讀下去，有幾處值得停下來想。這裡只描述看得到的事實，怎麼處理是你的設計決定。

**題目給了三欄，預設只傳一欄。** starter 裡的題目檔 `agent_task_input.json` 每題有 `problem_statement`、`requirements`、`interface` 三欄，但 starter 的 `run_task.sh` 只把 `problem_statement` 傳給 agent。SWE-Bench Pro 論文報告的分數，是三欄都給的設定。論文另外比較過只給 issue 原文的情況：GPT-5 的解題率從 25.9% 掉到 8.4%，降到原本的三分之一左右（[論文](https://arxiv.org/html/2509.16941)表 3，每題 50 輪、\$2 上限）。

**system prompt 範例提到一個不存在的工具。** 作業頁 1.3 節的 system prompt 範例說，改檔前先在 `/tmp` 寫重現檢查，「register each with `repro_check`」，句子到這裡就斷了；但 1.1 節的工具表裡沒有 `repro_check`。照抄這句，模型會去呼叫一個你沒定義的工具。

**最小工具組只是起點。** 四個工具夠不夠，第 4 堂留下的問題正好在這裡驗。[mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) 只用 bash；另一個方向是加專用工具，例如搜尋、跑特定測試。要不要改，看你的 log 裡模型把步數花在哪裡。

**模型預設會先想再答。** [模型卡](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)寫 Qwen3.6 預設開 thinking mode，每次回覆前先產生一段推理，這會吃掉輸出 token 和時間。模型卡提供兩個開關：`enable_thinking` 關掉推理，`preserve_thinking` 把歷史訊息裡的推理也送回模型。課程 proxy 接不接受這兩個參數、推理放在 response 的哪個欄位，作業頁都沒寫；第一次接上時先印出完整的 response 看一次。

> **自我檢查**：作業頁說「改 Part 0 和 Part 1 就能解的題，算可解」。這句話對你判斷哪幾題不可解有什麼影響？
> 判準：答出「我的 agent 沒解出來」不能當成不可解的證據。只有排除掉 harness 與 prompt 的問題之後，還能指出題目本身的問題（例如測試要求的行為在 issue 和 requirements 裡都找不到依據），才算不可解。

## Harness 會在哪裡壞：五種失敗

第 4 堂說 Agent = Model × Harness。作業 2 的模型固定，而且是個小模型，所以 harness 能不能接住模型的失誤，會直接反映在分數上。SWE-Bench Pro [論文](https://arxiv.org/html/2509.16941)分析失敗軌跡時，開放權重的 Qwen3 32B 有 42% 的失敗歸在「工具使用錯誤」，是分析的幾個模型裡最高的。那是不同的模型和外層框架（scaffold，也就是包住模型的 harness），但提醒的事一樣：模型叫錯工具很常見，harness 要接得住。

### 教學例子：一個壞掉的 tool call

OpenAI 相容的 API 回傳 tool call 時，參數放在 `function.arguments`，型別是字串，內容應該是 JSON。官方 SDK 的說明寫得很直接：模型不一定產生合法的 JSON，也可能多出 schema 沒定義的參數，呼叫前要自己驗證（[openai-python](https://github.com/openai/openai-python/blob/main/src/openai/types/chat/chat_completion_message_function_tool_call.py)）。

假設模型這一步回了：

```json
{"id": "call_7", "type": "function",
 "function": {"name": "read_file", "arguments": "{\"path\": \"src/auth.py\""}}
```

結尾少了一個 `}`。最直覺的寫法是 `json.loads(arguments)`，然後它丟出 `JSONDecodeError`，整個程式停掉。後果有三個：

- 這題前面跑的步數全部白費。
- `git diff` 可能停在改到一半的狀態。
- 這個 tool call 沒有配對的結果訊息。就算你接住例外繼續跑，下一次 API 呼叫也會因為「有 call 沒有 result」被拒（作業頁 1.3 節）。

另一種寫法是：不管哪裡出錯，都回一則 tool message，告訴模型錯在哪、該怎麼改，讓它下一步重送。下面這個片段處理三種壞輸出（JSON 壞掉、工具名稱不存在、參數名稱不對），也接住工具本身丟出的例外，例如讀一個不存在的檔案。

```python
import json

def run_tool_call(call, tools):
    """執行一個 tool call，一定回一則 tool message，不讓例外中斷 loop。"""
    try:
        name = call["function"]["name"]
        raw = call["function"]["arguments"]      # 一個字串，不保證是合法 JSON
    except (KeyError, TypeError):
        return {"role": "tool", "tool_call_id": call.get("id", ""),
                "content": "Error: malformed tool call (missing function name or arguments)."}, True
    try:
        args = json.loads(raw)
    except json.JSONDecodeError as e:
        content, is_error = (f"Error: arguments for {name} are not valid JSON "
                             f"({e.msg} at char {e.pos}). Resend the call with a "
                             f"complete JSON object."), True
    else:
        if name not in tools:
            content, is_error = f"Error: unknown tool {name}. Available: {', '.join(tools)}", True
        else:
            try:
                content, is_error = str(tools[name](**args)), False
            except TypeError as e:               # 少參數、多參數（也可能是工具內部的 TypeError）
                content, is_error = f"Error: bad arguments for {name}: {e}", True
            except Exception as e:               # 工具本身出錯：檔案不存在、找不到字串……
                content, is_error = f"Error: {name} failed: {type(e).__name__}: {e}", True
    return {"role": "tool", "tool_call_id": call["id"], "content": content}, is_error
```

拿上面那個壞掉的 call 跑，得到：

```text
{"role": "tool", "tool_call_id": "call_7", "content": "Error: arguments for read_file are not valid JSON (Expecting ',' delimiter at char 22). Resend the call with a complete JSON object."}
is_error: True
```

這則訊息帶著原本的 `tool_call_id`，所以配對沒有斷；模型下一步看到錯誤說明，通常會重送一個完整的呼叫。`is_error` 直接寫進 log 的 `tool_result`，事後你可以數一題裡有幾次壞輸出，判斷該改 prompt 還是改工具說明。

同一個片段遇到讀不存在的檔案，回的是 `Error: read_file failed: FileNotFoundError: …`，loop 一樣繼續。

這只是片段：`TypeError` 同時代表參數不對和工具內部出錯，這裡會把後者誤報成參數錯誤。你的版本要先用 schema 或 `inspect.signature` 驗參數，再執行工具。

### 五種失敗與處理策略

| 失敗 | 長什麼樣 | 一條處理策略 | 在 log 裡看哪裡 |
|---|---|---|---|
| 1. 壞的 tool call | 參數不是合法 JSON、工具名稱不存在、參數名稱或型別不對 | 驗證失敗就回一則說明錯誤的 tool message，保持 call 與 result 配對，讓模型重送 | `tool_result` 的 `is_error` |
| 2. 工具執行失敗或卡住 | 指令回非零的 exit code、跑測試跑到不會結束、指令在等互動輸入 | stdin 接到 `/dev/null`，每個 bash 指令設 timeout，超時就殺掉整個 process group（只殺 shell 殺不到它開的子行程），回「逾時、已終止」；exit code 和 stderr 一起回給模型 | `tool_result` 的 `result` |
| 3. API 呼叫失敗 | proxy 回 429、5xx、連線逾時 | 有上限的重試加指數退避；超過上限就以 `error` 結束，不要無限重試 | `api_retry` 的 `error`、`backoff_s` |
| 4. context 膨脹 | 一次 `cat` 整個大檔、測試輸出幾萬行，幾步之後超過 context 上限 | 放回歷史前先截斷，保留開頭與結尾，中間換成一行說明 | `api_request` 的 `prompt_tokens` 一路上升 |
| 5. 不收斂 | 反覆讀同一批檔案、改了又改回去、沒呼叫 `done` 就停 | 設步數或 token 上限並記成自訂的 `reason`；偵測重複的呼叫，提醒模型換做法 | `run_end` 的 `reason` 與 `num_iterations` |

第 5 種在 [SWE-Bench Pro 論文](https://arxiv.org/html/2509.16941)裡有個名字，叫 endless file reading：agent 一直讀檔、搜尋，資訊蒐集夠了卻遲遲不動手改，最後逾時。第 4 種是第 4 堂「context 是有限資源」的直接後果；作業頁也明說，至少要把太大的輸出截斷再放回去。

<details>
<summary>截斷為什麼要留結尾：一個實跑的例子</summary>

```python
def truncate(text, limit=4000):
    """保留開頭和結尾，中間換成一行說明；log 的 result 要記這個版本。"""
    if len(text) <= limit:
        return text
    half = limit // 2
    cut = len(text) - 2 * half
    return (text[:half]
            + f"\n... [{cut} characters omitted; rerun with grep/head/tail to see them] ...\n"
            + text[-half:])
```

拿一份 2,000 行、最後一行才是 `FAILED tests/test_utils.py::test_version_check` 的測試輸出（32,936 字元）去截，結果是 4,075 字元，最後一行仍然是那行 FAILED。只留開頭的截法會把它切掉，模型就看不到哪個測試失敗。測試框架、編譯器多半把摘要印在最後，所以結尾通常比中間重要。

</details>

> **自我檢查**：你的 agent 某題跑了 40 步，log 裡 `api_request` 的 `prompt_tokens` 從 3,000 一路漲到 120,000，最後 `run_end` 是 `error`。最可能是哪一種失敗？先查什麼？
> 答：第 4 種，context 膨脹，最後很可能是超過上限或 proxy 拒絕請求。先找 `prompt_tokens` 跳最大的那幾步，看前一個 `tool_result` 是哪個指令、`result` 有多長，通常是某次讀了整個大檔或跑了輸出很多的測試。

## 在容器裡跑，以官方評估為準

作業頁的 Part 2 寫著「這部分可以相信」。下圖是一題從啟動到評分的流程，捲到圖上會自動逐步播放，也可以用按鈕停在任一步。

```flow-diagram
{
  "title": "作業 2 一題的流程：從啟動容器到官方評估",
  "lang": "zh-TW",
  "width": 660,
  "height": 430,
  "nodes": [
    {
      "id": "box",
      "label": "任務容器",
      "x": 385,
      "y": 165,
      "w": 210,
      "h": 270,
      "shape": "group"
    },
    {
      "id": "host",
      "label": "run_task.sh\n（主機）",
      "x": 100,
      "y": 90,
      "w": 140
    },
    {
      "id": "agent",
      "label": "madsLoop.py",
      "x": 385,
      "y": 90,
      "w": 140,
      "tone": "accent"
    },
    {
      "id": "repo",
      "label": "repo（/app）",
      "x": 385,
      "y": 240,
      "w": 140
    },
    {
      "id": "proxy",
      "label": "課程 proxy\nqwen3.6",
      "x": 605,
      "y": 90,
      "w": 100,
      "shape": "chip"
    },
    {
      "id": "eval",
      "label": "官方評估\n隱藏測試",
      "x": 100,
      "y": 240,
      "w": 140
    },
    {
      "id": "res",
      "label": "eval_results\n.json",
      "x": 100,
      "y": 365,
      "w": 110,
      "shape": "db"
    }
  ],
  "edges": [
    {
      "from": "host",
      "to": "agent",
      "step": 1,
      "label": "啟動容器",
      "labelAt": [
        188,
        72
      ]
    },
    {
      "from": "agent",
      "to": "proxy",
      "step": 2,
      "label": "請求",
      "offset": 16,
      "labelAt": [
        502,
        124
      ]
    },
    {
      "from": "proxy",
      "to": "agent",
      "step": 3,
      "label": "回應",
      "offset": 16,
      "labelAt": [
        502,
        50
      ]
    },
    {
      "from": "agent",
      "to": "repo",
      "step": 4,
      "label": "執行工具",
      "labelAt": [
        373,
        168
      ],
      "labelSide": "left"
    },
    {
      "from": "repo",
      "to": "eval",
      "step": 5,
      "label": "git diff",
      "labelAt": [
        184,
        222
      ]
    },
    {
      "from": "eval",
      "to": "res",
      "step": 6,
      "label": "每題 true／false",
      "labelAt": [
        112,
        302
      ]
    }
  ],
  "steps": [
    "run_task.sh 在主機上拉該題的 image、啟動任務容器，掛進你的程式並跑 docker_env.sh 裝依賴",
    "madsLoop.py 把整段 messages 當成請求，送到課程 proxy 上的 qwen3.6-35b-a3b",
    "模型的回應帶著 tool calls 回來",
    "madsLoop.py 在容器裡的 repo 執行工具、改檔，結果放回 messages，回到第 2 步，直到結束",
    "跑完後取出 git diff 當成 patch，交給官方 SWE-Bench Pro 評估：套到乾淨的 checkout、還原測試、跑隱藏測試",
    "評估結果寫進 eval_results.json，每題 true 或 false"
  ]
}
```

圖上的第 5 步省略了一段：`run_task.sh` 先把 diff 存成每題的 patch 檔，再由 `make_patches.py` 打包成 `patches.json`，交給 `evaluate.sh` 跑官方評估。

容器裡預設沒有 `openai` 套件，所以 `run_task.sh` 會先跑你的 `docker_env.sh` 安裝依賴，再執行 `madsLoop.py`。取 diff 前，它會把 agent 新增的檔案也加進去，所以 agent 寫的重現腳本要放 `/tmp`，不要留在 repo 裡。starter 版的 `run_task.sh` 還處理了幾個 image 的怪問題。例如有的 image 預設 Python 太舊，它會另外找一個 3.10 以上的直譯器來跑你的 harness。agent 的 bash 工具則照樣用 image 原本的環境，所以跑測試的條件跟評分時一樣。

判斷一題有沒有解出來，要用官方的 SWE-Bench Pro 評估腳本（[scaleapi/SWE-bench_Pro-os](https://github.com/scaleapi/SWE-bench_Pro-os)），也就是評分用的同一套。它把你的 patch 套到一份乾淨的 checkout，還原被保留起來的測試檔，再跑隱藏測試。所以 agent 改測試檔沒有用，改過的會被蓋掉。結果寫在 `pro_eval/eval_results.json`，每題 true 或 false，旁邊有每題的測試 log。

這是你調 harness 時唯一可靠的回饋。模型呼叫了 `done`、說「已修好」，不代表測試會過；agent 自己在容器裡跑的測試，也不一定是評分時跑的那幾個。

## 建自己的評估集

只拿 10 題調 harness，很容易調成只會解這 10 題。作業要你另外做 4 題，不能取自 SWE-Bench Pro 或任何 agent benchmark。來源只能是兩種：開源 repo 的真實 issue（連同關掉它的 commit 或 PR），或是你自己以前真的修過的 bug、加過的功能。

每一題要做三件東西：

1. **一段描述**：agent 只看得到這段。寫出哪裡壞了、怎麼出現、怎樣算完成。只寫一段，放在 `problem_statement` 欄；`requirements`、`interface` 兩個 key 保留、值給空字串，格式才跟給定的題目一樣。
2. **證明修好的測試**：`fail_to_pass` 至少一個，在 base commit 失敗、修好後通過；`pass_to_pass` 是修好前後都要通過的測試，用來抓「修好這裡、弄壞那裡」的 patch。
3. **一個容器**：Dockerfile 建出一個 image，repo 停在 base commit、依賴都裝好，沒有網路也能跑測試。旁邊附 `gold.diff`，也就是真正的修法；套上它，`fail_to_pass` 必須全部通過，否則你的測試本身就不可信。

官方評估只認得 SWE-Bench Pro 的題目，所以你要自己寫 `verify.sh`：開一個新容器、重設 checkout、套 patch、跑測試，只有 `fail_to_pass` 全過且 `pass_to_pass` 沒有退步時才印 `RESOLVED`。不帶 patch 跑一次，就是 base commit 的基準。

四題分成兩組：兩題放 `solved_after_change.json`，一開始解不了、改了 agent 之後解得了；兩題放 `unsolved.json`，交件時還是解不了。第一組要你說清楚「改了什麼、為什麼這個改動讓它從失敗變成功」，這等於逼你做一次對照實驗。第二組則讓你誠實面對 harness 的極限。

> **自我檢查**：你從自己的舊專案挑了一個 bug，寫好 `fail_to_pass` 測試，但套上 `gold.diff` 之後那個測試還是失敗。問題在哪？
> 答：測試或 `gold.diff` 有一邊不對，這題現在不能用。可能是測試寫的行為跟當時的修法不一致，也可能是 Dockerfile 的依賴版本跟當時不同。要先修到 `gold.diff` 能讓測試通過，這題才能拿來評估 agent。

## 交什麼、怎麼評分

| 交什麼 | 放哪裡 |
|---|---|
| `madsLoop.py`、`src/` 下的模組、`docker_env.sh` | 課程共用私有 repo 的 `assignment2/` |
| `developer_logs/`（開發時的 coding agent session，jsonl） | 同上 |
| `mytest/`（`solved_after_change.json`、`unsolved.json`、`task_test.json`，每題的 Dockerfile 與 `gold.diff`，`verify.sh`，8 份前後 log） | 同上 |
| 一頁 writeup（`writeup.pdf`） | 同上 |
| 3 分鐘影片 | 上傳 Canvas |

評分方式：

- **Hidden tasks 40%**：用你的 `run_task.sh` 跑給定的題目加上一批隱藏的 SWE-Bench Pro 題目，以官方評估判定。分數是「可解題目中解出的比例」；隱藏題全部可解。作業頁另寫「在不可解的題目上拿到 PASS 會扣分」，怎麼判定沒有進一步說明。
- **Writeup 40%**：20% 是你判斷哪幾題不可解、理由與證據；10% 是你跟作業頁設計的差異；10% 是 `mytest/` 的四題。writeup 硬上限一頁，作業頁要求完全由自己寫，不能用 AI 產生的文字。
- **影片 20%**：先帶過程式的入口、工具、loop 與對話狀態怎麼維護，再說明哪個改動讓 `solved_after_change.json` 的兩題從失敗變成功。

評分是 clone 你的 repo、在 `assignment2/` 下跑 `run_all.sh`。這支和 `evaluate.sh`、`make_patches.py` 會用課程自己的版本，你改了也沒用；`run_task.sh` 可以改，但要確保 `run_all.sh` 叫得動它。

> **自我檢查**：10 題裡有題目不可解。你的 agent 解出 6 題，怎麼知道自己的 harness 夠不夠好？
> 判準：答出要看沒解出的 4 題各自失敗在哪一層，不能只看 6/10 這個數字。逐題讀 log 分類：是 harness 沒接住（壞輸出、逾時、context 爆掉、不收斂），是模型能力不夠（看到了該看的、改的方向卻不對），還是題目本身有問題。前兩類是你還能改進的地方，第三類才是 writeup 要寫的不可解題。

## 綜合自我檢查

1. 你把 bash 的 timeout 設成 30 秒，結果某題的完整測試要跑 2 分鐘，agent 每次跑測試都收到「逾時」。該把 timeout 調大，還是改別的地方？
   判準：答出兩邊都可以，但要從 log 判斷。只是測試慢，就調大 timeout 或在工具說明裡教模型只跑相關的測試檔；如果是指令在等輸入或進了無窮迴圈，調大只會浪費更多時間。
2. 為什麼 `tool_result` 的 `result` 要記截斷後的版本，而不是原始輸出？
   判準：答出 log 的目的是還原模型當時看到了什麼。記原始輸出，你會以為模型看到了某行錯誤訊息，其實那行已經被截掉了。
3. 作業頁給的最小 loop 是「有 tool call 就執行，沒有就結束」。這個停止條件會漏掉什麼情況？
   判準：答出至少一種：模型沒呼叫 `done` 就以一段文字收尾（可能根本沒修）；模型一直有 tool call、永遠不停（要有步數或 token 上限）；模型呼叫了 `done`，但改動沒有通過測試。

## 延伸閱讀

- [CMU 11-768 作業 1：親手寫一個 agent harness](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness)：另一門課的同類作業，同一個 ReAct 迴圈換三種任務。
- [CMU 11-768 第 6 堂：Coding Agents](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents)：SWE-bench 系列題庫與 coding agent 的演進。
- [第 4 堂：工具設計與 context 工程](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering)：這份作業的設計依據。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。作業沒有錄影可對照。
- 底本：[作業 2 頁面](https://cs2680.com/assignments/assignment2)與其 starter 檔 `assignment2.tar.gz`（題目清單、`run_task.sh`、`run_all.sh`、`evaluate.sh`），2026-10-22 讀取。文中的 Python 片段與截斷例子是本站補充，已實際執行，輸出與文中一致。

## 參考資料

- [CS2680 作業 2：Build an agent harness（Mads-Loop）](https://cs2680.com/assignments/assignment2)
- [CS2680 課程首頁與配分](https://cs2680.com/)
- [Deng et al., SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?（arXiv 2509.16941）](https://arxiv.org/abs/2509.16941)
- [scaleapi/SWE-bench_Pro-os：官方評估腳本](https://github.com/scaleapi/SWE-bench_Pro-os)
- [Qwen3.6-35B-A3B 模型卡（Hugging Face）](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [OpenAI：Function calling 指南](https://platform.openai.com/docs/guides/function-calling)
- [openai-python：tool call 型別定義與 arguments 說明](https://github.com/openai/openai-python/blob/main/src/openai/types/chat/chat_completion_message_function_tool_call.py)
- [SWE-agent/mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)
- [CS2680 第 4 堂投影片：Agent Design I](https://cs2680.com/slides/4_agent_design_1.pdf)
- [CS2680 課程政策](https://cs2680.com/policy)
