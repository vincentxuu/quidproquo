---
title: "Browser Use 完整介紹：讓 AI Agent 操作瀏覽器的任務迴圈"
date: 2026-08-21
category: ai
type: guide
tags: [browser-use, browser-automation, ai-agent, playwright, python]
lang: zh-TW
tldr: "Browser Use 是讓模型自己決定每一步、操作真實瀏覽器的 Python 函式庫。1.0（2026-11-10）換掉了引擎：模型不再從 DOM 清單挑 click、type，而是在常駐的 Python REPL 裡寫程式碼、直接打 CDP。預設模型與瀏覽器都改成 Browser Use 的雲端服務，本機要寫 Browser('chromium')；執行歷史的逐步動作、storage_state 與錄製重播都拿掉了，執行時要特別注意模型寫的 Python 是以你的身分執行。"
description: "Browser Use 1.0 介紹：每一步模型寫一段 Python 的 agent 迴圈、安裝與釘版本、本機與雲端瀏覽器、執行結果與 judge、結構化輸出、登入與機密資料、自訂工具、安全邊界、Cloud 成本，以及失敗時怎麼診斷；附 0.x 升級時最常踩到的變動。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 14
---

> 🌏 [English version](/posts/ai/2026-08-21-browser-use-complete-guide-en)

> **2026-11-19 更新：** 本文原本依 0.x 撰寫。Browser Use 1.0（2026-11-10）換掉了引擎，範例與說明已全部改成 1.0.6 的寫法；0.x 到 1.0 改了什麼，見文末「從 0.x 升級要注意什麼」。還要用 0.x 的話，安裝時釘 `browser-use<1`。

[Browser Use](https://github.com/browser-use/browser-use) 是讓語言模型操作瀏覽器的 Python 函式庫。開發者提供任務，agent 自己決定每一步做什麼、檢查結果，直到完成或碰到停止條件。

它不是另一套 CSS selector 函式庫，也不是把 Playwright 包成一句自然語言。Browser Use 負責的是「下一步該做什麼」；網頁本身、瀏覽器程序與網路仍是底層的執行條件。本文依官方 repository 的 README 與 [MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)（1.0.6）撰寫，沒有登入付費 Cloud 或替真實帳號送出表單。

## 核心是模型寫程式、執行、再看結果

1.0 的一個任務可簡化成這個迴圈：

```text
task
  → 模型在常駐的 Python REPL 寫一段程式碼（可以直接打 CDP、需要時自己截圖）
  → 執行，輸出或錯誤回到 context
  → 繼續，直到模型呼叫 finish(result)，或超過步數、時間上限
```

官方的說法是「The model, a REPL and CDP. That's the whole agent.」0.x 的做法是框架先整理出頁面上可點的元素，模型每一步從 click、type、scroll 裡挑一個；1.0 讓模型自己決定要看什麼、怎麼操作。為什麼這樣改，見[agent 迴圈怎麼了](/posts/ai/2026-11-19-browser-agent-loop-to-code-mode)。

這跟 [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction) 的責任不同。AgentQL 讓開發者指定要找的元素或資料形狀；Browser Use 讓模型在多步驟流程中自己決定下一步。若流程固定、selector 穩定、步驟能完整寫死，直接用 Playwright 通常更便宜也更可預測。

## 安裝並執行第一個本機 Agent

官方要求 Python 3.11 以上，並且要**精確釘版本**（README 的說法是「never `>=`」，因為版本變動很快、可能改壞 API）：

```bash
uv init --python 3.12 browser-use-demo
cd browser-use-demo
uv add 'browser-use==1.0.6'
```

1.0 有兩個預設值要先知道：

- **不指定 `llm` 時，用 Browser Use 閘道上的 `bu-4.0` 模型**，需要 `BROWSER_USE_API_KEY`（或用 `browser-use login` 登入）。也能改用內建的 `ChatOpenAI`、`ChatAnthropic`、`ChatGoogle`，或 Pydantic AI 的模型字串（例如 `'groq:<model>'`）。LangChain 的 chat model 不再支援。
- **`Browser()` 是 Browser Use Cloud 的雲端瀏覽器。** 本機要寫 `Browser('chromium')`，雲端瀏覽器連不到 localhost 和內網位址。

```python
import asyncio

from browser_use import Agent, Browser, ChatOpenAI


async def main() -> None:
    browser = Browser(
        "chromium",
        headless=True,
        allowed_domains=["docs.browser-use.com"],
    )
    agent = Agent(
        task=(
            "Open the Browser Use documentation and return the titles "
            "of the Agent and Browser quick-start pages. Do not leave the domain."
        ),
        llm=ChatOpenAI("gpt-6-luna"),  # 需要 OPENAI_API_KEY；省略 llm 則用 bu-4.0
        browser=browser,
    )

    result = await agent.run(max_steps=12)
    print(result.status, result.final_result())
    print(result.cost_usd)


if __name__ == "__main__":
    asyncio.run(main())
```

`max_steps` 是成本與失控範圍的第一道上限。1.0 的一步是一次模型請求、一段 Python，預設上限從 0.x 的 500 改成 100，另有預設 1,700 秒的 `timeout`。`allowed_domains` 限制瀏覽器能前往的網域。第一次執行可以先把 `headless` 改成 `False`，觀察模型實際做了什麼。

這段程式是依官方 API 整理的最小範例，未在本文環境呼叫外部模型。上線前應用自己的目標網站重跑。

## 不要只讀最後一句：保留執行結果

`agent.run()` 回傳的結果物件在 1.0 改了很多。0.x 的 `urls()`、`action_names()`、`screenshots()` 這類逐步動作的方法都拿掉了，因為 1.0 沒有「每一步一個動作」。現在要看的是：

- `result.status`：`completed`、`max_steps`、`timeout` 或 `error`。設定錯誤會在瀏覽器啟動前就報錯，之後的失敗則回傳 `status='error'`，不會丟例外。
- `result.final_result()`、`result.success`：注意 `is_successful()` 是「the agent's own claim」，是模型自己說的。
- `result.judgement`：1.0 預設在每次執行後多送一次請求，讓同一個模型評估這次執行，內容包括有沒有偵測到 prompt injection、有沒有被機器人驗證擋住。它的 token 會算進成本，不需要時用 `judge=False` 關掉。
- `result.messages`、`result.usage`、`result.cost_usd`，以及 `agent.workspace` 資料夾。workspace 預設在暫存目錄，執行結束後會保留，裡面有頁面文字、截圖和每一段程式的輸出，用完要記得刪。

正式流程至少要保存：task、模型與套件版本、`status` 與最後結果、judge 的結論、step 數與總時間、成本，以及會影響結果的瀏覽器設定。

「agent 說完成」不等於業務成功。送出表單後要檢查 confirmation ID，下載檔案後要驗證檔案存在，抽取資料後要做 schema validation。

## 用 Pydantic 約束結構化輸出

自由文字適合人讀，不適合直接寫進資料庫。`output_model_schema` 在 1.0 保留：

```python
from pydantic import BaseModel, HttpUrl


class DocPage(BaseModel):
    title: str
    url: HttpUrl


class DocResult(BaseModel):
    pages: list[DocPage]


agent = Agent(
    task="Return the Agent and Browser quick-start documentation pages.",
    browser=browser,
    output_model_schema=DocResult,
)

result = await agent.run(max_steps=12)
pages = result.structured_output
```

Schema 驗證只保證輸出形狀，不保證網頁內容正確。URL、價格、日期或識別碼仍要回到來源驗證；必要時保留頁面 URL 與擷取時間。

## 登入狀態要當成機密資料

1.0 拿掉了 `storage_state`。登入狀態改成這幾種方式保存：

| 寫法 | 用的是哪個瀏覽器 |
|---|---|
| `Browser('chrome')` | 你正在開的 Chrome，帶著你的登入（要先在 `chrome://inspect/#remote-debugging` 開啟一次） |
| `Browser('chrome', profile='Work')` | 新開一個 Chrome，用你的 `Work` profile 的暫時複本，不會寫回原本的 profile |
| `Browser('chromium', user_data_dir=...)` | 一個專用、跨次保留的 profile 資料夾 |
| `Browser(cloud_profile_id=...)` | Browser Use Cloud 上的持久 profile |

```python
browser = Browser(
    "chromium",
    user_data_dir="./profiles/portal",
    allowed_domains=["portal.example.com", "*.okta.com"],
)

agent = Agent(
    task="Open the account page and report whether the subscription is active.",
    browser=browser,
    use_vision=False,
    sensitive_data={
        "https://portal.example.com": {
            "account_password": "read-from-secret-manager",
        }
    },
)
```

`use_vision=False` 表示截圖不會送進模型。`sensitive_data` 裡的值由模型呼叫 `type_secret('account_password')` 輸入，加了網域的值只會在符合的頁面上輸入；所有值都會在程式輸出、checkpoint、工具結果和最後結果裡遮成 `<secret:account_password>`。但 README 寫得很清楚：「Not a sandbox: model-written Python can read the value」，截圖和頁面上的 JavaScript 也可能看到它。

`user_data_dir` 的資料夾裡有 cookie 與 token，不能 commit。`Browser('chromium')` 和 `Browser('chrome', profile=...)` 開的除錯埠沒有驗證，在多人共用的機器上，其他使用者可以連進去拿到它的登入狀態，這種環境要用容器或 Cloud。高風險操作還要在 agent 外面加政策：付款、刪除、送出申請或公開發文前停下來，要求人確認具體內容。

## 自訂工具負責瀏覽器以外的動作

1.0 的瀏覽器動作由模型自己寫程式碼完成，`Tools` 留給資料庫、內部 API 或人工確認這類瀏覽器以外的事。工具應小而明確，不要給 agent 一個能執行任意 shell 或任意 SQL 的萬用入口。

```python
from browser_use import Tools

tools = Tools()


@tools.action("Save a reviewed documentation URL")
def save_doc_url(title: str, url: str) -> str:
    if not url.startswith("https://docs.browser-use.com/"):
        return "Rejected: URL is outside the documentation domain"
    # Replace with a parameterized database call.
    return f"Queued for review: {title} {url}"
```

用 `Agent(task=..., tools=tools)` 把工具接上。0.x 會注入給工具的參數（`browser_session`、`page_url` 等）都拿掉了，工具只拿得到模型傳進來的值。工具回傳值會進入後續 context，大型內容只傳必要摘要。

## 安全邊界：模型寫的程式以你的身分執行

這是 1.0 最需要注意的改變。REPL 以你的使用者身分執行模型寫的 Python，[MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) 明說「This is not a sandbox」：模型可以讀、上傳你的使用者讀得到的任何檔案。`allowed_domains` 也只是「a guard for an aligned model, not a sandbox」，允許的頁面向其他主機發出的請求不會被過濾。官方建議不受信任的任務放進容器或 VM 執行。

## 開放原始碼 Agent 與 Cloud 是兩個部署選擇

開放原始碼版本採 [MIT license](https://github.com/browser-use/browser-use/blob/main/LICENSE)，瀏覽器、模型、proxy、監控與並行工作由自己維護。套件預設會送匿名 telemetry；不需要時設定 `ANONYMIZED_TELEMETRY=false`。

Browser Use 現在有三條路：全託管的 Cloud agent、給 Claude Code 或 Codex 用的 CLI（`browser-use skill install` 裝成 skill），以及本文介紹的 Python 函式庫。Cloud API V4 要另外安裝 `browser-use-sdk`，最小呼叫如下：

```python
from browser_use_sdk.v4 import BrowserUse

client = BrowserUse()
run = client.runs.create(
    "Find the current Browser Use open-source quick-start page",
)
run = client.runs.wait_for_completion(run.id)
print(run.result)
```

依 README，Cloud 瀏覽器是每小時 0.06 美元。`result.cost_usd` 只包含模型、judge 和網頁搜尋的費用，雲端瀏覽器和 proxy 另外計費。方案與單價會變，上線前要重新查看 [pricing](https://browser-use.com/pricing) 與 Billing。

模型 token、judge 請求、browser time、proxy 流量與失敗重跑是不同成本線。不要只用「一個任務多少錢」估算；先對代表任務記錄成功率、step 數、瀏覽器時間與人工接手率。

## 失敗時先判斷是哪一層

| 現象 | 先檢查 | 處理方向 |
|---|---|---|
| `status='error'` | `result.error`：金鑰、模型名稱、瀏覽器啟動失敗 | 多半是設定問題，照錯誤訊息修 |
| `status='max_steps'` 或 `timeout` | task 是否含停止條件、`result.partial` 有沒有中間結果 | 補完成判準；要中間結果就在 task 裡要求模型用 `checkpoint(..., partial=True)` 存下來 |
| 連不到 localhost 或內網 | 是不是用了預設的雲端瀏覽器 | 改用 `Browser('chromium')` |
| 登入一直失效 | profile、SSO 網域 | 重建登入狀態並限制 credential 網域 |
| CAPTCHA／challenge | `result.judgement` 有沒有標出被機器人驗證擋住；IP、操作頻率 | 降速、換合法資料來源；不要宣稱一定能繞過 |
| 結果格式正確但內容錯 | schema 只驗形狀 | 保存來源並做業務驗證 |
| 成本突然上升 | step、模型、judge、browser time | 設 budget、timeout 與任務級監控 |

如果工作只是已知 URL 的正文擷取，先用 Crawl4AI 或普通 HTTP fetch；如果是固定 selector 的 UI 測試，先用 Playwright。Browser Use 最有價值的地方，是頁面路徑會分支、需要跨頁判斷，而且每一步難以預先寫死。1.0 拿掉了 0.x 的錄製重播（`rerun_history()`、`save_as_playwright_script()`），需要每次都一樣的流程，就自己寫成腳本。

## 從 0.x 升級要注意什麼

[MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) 列得很完整，最常踩到的幾項：

- `Agent`、`Browser`、`Tools`、`run()`、`final_result()` 還在；大部分 1.0 做不到的設定會在瀏覽器啟動前直接報錯，少數 0.x 的調校參數（例如 `flash_mode`）則警告一次後忽略。
- `Browser()` 從本機 Chromium 改成雲端瀏覽器；`Browser(headless=True)` 這類只適用本機的參數，用在雲端瀏覽器會丟 `ValueError`。
- 0.x 閘道的 `bu-2-0`、`bu-2-0-mini-preview`、`bu-1-0`、`bu-latest` 模型會被拒絕。
- `storage_state`、逐步動作的結果方法、錄製重播、step callback、planner 與 loop detection 相關設定都移除了。
- 舊的 `browser-use --mcp` 工具（`browser_click` 等）跟著舊引擎一起退場，改成 `--cli-mcp` 的 `browser_exec`、`browser_screenshot`。

## 整體取捨

Browser Use 把「讓模型看網頁並採取下一步」做成可程式化的 agent 迴圈，1.0 更進一步，連觀察和動作的方式都交給模型。代價是結果受到模型、頁面、登入、網路共同影響，不能拿 demo 的一次成功當 production SLA；而且模型寫的程式直接在你的機器上跑。

可靠的起點是：釘版本、限制網域與步數、用 schema 約束輸出、保存 `status` 與 judge 的結論、把高風險副作用放到人工確認後面，不受信任的任務放進容器。需要自訂控制就用開放原始碼 Agent；不想維護瀏覽器程序、proxy 與大量 session，再評估 Cloud。

## 更新紀錄

- 2026-11-19：依 Browser Use 1.0.6 全面改寫：迴圈改成模型寫 Python、範例改用 `Browser('chromium')` 與 1.0 的結果物件、登入改用 profile、新增安全邊界與 0.x 升級注意事項；移除已失效的模型清單與文件連結。

## 參考資料

- [Browser Use GitHub repository](https://github.com/browser-use/browser-use)
- [Browser Use：MIGRATING.md（0.x → 1.0）](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)
- [Browser Use Cloud API V4 quick start](https://docs.browser-use.com/cloud/agent/quickstart)
- [Browser Use pricing](https://browser-use.com/pricing)
- [Browser Use：The Bitter Lesson of Browser Agents](https://browser-use.com/posts/bitter-lesson-browser-agents)
