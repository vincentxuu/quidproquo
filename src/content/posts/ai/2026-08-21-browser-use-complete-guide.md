---
title: "Browser Use 完整介紹：讓 AI Agent 操作瀏覽器的任務迴圈"
date: 2026-08-21
category: ai
type: guide
tags: [browser-use, browser-automation, ai-agent, playwright, python]
lang: zh-TW
tldr: "Browser Use 把瀏覽器狀態、模型決策與 click／type／extract 等動作組成可重複迴圈；開放原始碼版本適合自訂工具與執行策略，Cloud 則代管瀏覽器、profile、proxy 與並行工作。"
description: "從 Browser Use 的 Agent 迴圈、Python 安裝、結構化輸出、登入狀態、自訂工具與安全邊界開始，說明本機與 Cloud 的差異、成本及失敗處理。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-browser-use-complete-guide-en)

[Browser Use](https://github.com/browser-use/browser-use) 是讓語言模型操作瀏覽器的 Python framework。開發者提供任務，agent 反覆讀取頁面狀態、決定下一個動作、執行並檢查結果，直到完成或碰到停止條件。

它不是另一套 CSS selector 函式庫，也不是把 Playwright 包成一句自然語言。Browser Use 負責的是「下一步該做什麼」；selector、CDP、瀏覽器程序與網頁本身仍是底層執行條件。本文依 2026 年 8 月 21 日可讀到的官方 repository、開放原始碼文件與 Cloud API V4 文件撰寫，沒有登入付費 Cloud 或替真實帳號送出表單。

## 核心是觀察、決策、動作與驗證

一個 Browser Use 任務可簡化成這個迴圈：

```text
task
  → 取得頁面狀態與可操作元素
  → LLM 選擇 click / type / scroll / extract / done
  → 瀏覽器執行
  → 新狀態、工具結果或錯誤回到 context
  → 繼續，直到完成或超過限制
```

這跟 [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction) 的責任不同。AgentQL 讓開發者指定要找的元素或資料形狀；Browser Use 讓模型在多步驟流程中選擇下一個動作。若流程固定、selector 穩定、步驟能完整寫死，直接用 Playwright 通常更便宜也更可預測。

## 安裝並執行第一個本機 Agent

目前官方 README 要求 Python 3.11 以上，安裝方式是 `uv add browser-use` 或 `pip install browser-use`。以下範例使用 Browser Use 代管的模型入口；也能依[官方模型清單](https://github.com/browser-use/browser-use/blob/main/browser_use/llm/README.md)改用 OpenAI、Anthropic、Google、Groq、Ollama 等 provider。

```bash
uv init browser-use-demo
cd browser-use-demo
uv add browser-use python-dotenv
```

```bash
export BROWSER_USE_API_KEY="your-key"
```

```python
import asyncio

from browser_use import Agent, Browser, ChatBrowserUse


async def main() -> None:
    browser = Browser(
        headless=True,
        allowed_domains=["docs.browser-use.com"],
    )
    agent = Agent(
        task=(
            "Open the Browser Use documentation and return the titles "
            "of the Agent and Browser quick-start pages. Do not leave the domain."
        ),
        llm=ChatBrowserUse(model="bu-2-0-mini-preview"),
        browser=browser,
    )

    history = await agent.run(max_steps=12)
    print(history.final_result())
    print(history.urls())
    print(history.errors())


if __name__ == "__main__":
    asyncio.run(main())
```

`max_steps` 是成本與失控範圍的第一道上限，`allowed_domains` 則限制瀏覽器能前往的網域。第一次執行應把 `headless` 改成 `False`，觀察模型實際點了什麼；確認流程後再切回無介面模式。

這段程式是依官方 API 形狀整理的最小範例，未在本文環境呼叫外部模型。套件快速變動，上線前應固定版本並用自己的目標網站重跑。

## 不要只讀最後一句：保留執行歷史

`agent.run()` 回傳 `AgentHistoryList`。官方的[輸出文件](https://docs.browser-use.com/open-source/customize/agent/output-format)除了 `final_result()`，也提供造訪 URL、動作名稱、錯誤、截圖、模型輸出、成功狀態與執行時間。

正式流程至少要保存：

- task、模型與套件版本。
- 最後結果與 `is_successful()`。
- 造訪 URL、動作與錯誤摘要。
- step 數、總時間與外部工具呼叫成本。
- 會影響結果的 browser/profile 設定。

「agent 說完成」不等於業務成功。送出表單後要檢查 confirmation ID，下載檔案後要驗證檔案存在，抽取資料後要做 schema validation。

## 用 Pydantic 約束結構化輸出

自由文字適合人讀，不適合直接寫進資料庫。開放原始碼 Agent 可透過 `output_model_schema` 指定 Pydantic model：

```python
from pydantic import BaseModel, HttpUrl


class DocPage(BaseModel):
    title: str
    url: HttpUrl


class DocResult(BaseModel):
    pages: list[DocPage]


agent = Agent(
    task="Return the Agent and Browser quick-start documentation pages.",
    llm=ChatBrowserUse(model="bu-2-0-mini-preview"),
    browser=browser,
    output_model_schema=DocResult,
)

history = await agent.run(max_steps=12)
result = history.structured_output
```

Schema 驗證只保證輸出形狀，不保證網頁內容正確。URL、價格、日期或識別碼仍要回到來源驗證；必要時保留頁面 URL 與擷取時間。

## 登入狀態要當成機密資料

Browser Use 可以連接系統 Chrome、載入 Playwright 格式的 storage state，或在 Cloud 使用持久 profile。官方[驗證文件](https://docs.browser-use.com/open-source/customize/browser/authentication)也提醒，可用 `allowed_domains` 限制導覽範圍，並對敏感頁面停用 vision，避免截圖送到模型。

```python
browser = Browser(
    storage_state="session.json",
    allowed_domains=["portal.example.com", "*.okta.com"],
)

agent = Agent(
    task="Open the account page and report whether the subscription is active.",
    browser=browser,
    llm=ChatBrowserUse(model="bu-2-0-mini-preview"),
    use_vision=False,
    sensitive_data={
        "https://portal.example.com": {
            "account_password": "read-from-secret-manager",
        }
    },
)
```

`session.json` 可能包含 cookie 與 localStorage token，不能 commit。高風險操作還要在 agent 外面加政策：付款、刪除、送出申請或公開發文前停下來，要求人確認具體內容。

## 自訂工具負責瀏覽器以外的動作

Browser Use 的 `Tools` 能把資料庫、內部 API 或人工確認接進任務。工具應小而明確，不要給 agent 一個能執行任意 shell 或任意 SQL 的萬用入口。

```python
from browser_use import Tools

tools = Tools()


@tools.action(description="Save a reviewed documentation URL")
def save_doc_url(title: str, url: str) -> str:
    if not url.startswith("https://docs.browser-use.com/"):
        return "Rejected: URL is outside the documentation domain"
    # Replace with a parameterized database call.
    return f"Queued for review: {title} {url}"
```

工具回傳值會進入後續 context。大型內容應只傳必要摘要，否則每一步都把全文塞回模型，token 與延遲會一起上升。

## 開放原始碼 Agent 與 Cloud 是兩個部署選擇

開放原始碼版本採 [MIT license](https://github.com/browser-use/browser-use/blob/main/LICENSE)，瀏覽器、模型、proxy、監控與並行工作由自己維護。套件預設會送匿名 telemetry；不需要時可依[官方說明](https://docs.browser-use.com/development/monitoring/telemetry)設定 `ANONYMIZED_TELEMETRY=false`。

Cloud API V4 則把每個 run 放進 session，並建立可保存檔案的 workspace。最小呼叫如下：

```python
from browser_use_sdk.v4 import BrowserUse

client = BrowserUse()
run = client.runs.create(
    "Find the current Browser Use open-source quick-start page",
)
run = client.runs.wait_for_completion(run.id)
print(run.result)
```

Cloud 還能使用持久 profile、proxy、live view 與錄影。依目前[公開 pricing](https://browser-use.com/pricing)，Pay As You Go 沒有月租。瀏覽器 session 標示每小時 0.06 美元，proxy 每 GB 10 美元，額度需另外購買。方案與單價會變，上線前要重新查看 Billing。

模型 token、agent／skill 呼叫、browser time、proxy 流量與失敗重跑是不同成本線。不要只用「一個任務多少錢」估算；先對代表任務記錄成功率、step 數、瀏覽器時間與人工接手率。

## 失敗時先判斷是哪一層

| 現象 | 先檢查 | 處理方向 |
|---|---|---|
| 找不到按鈕 | DOM、iframe、頁面是否載入完成 | 加明確等待或改用較穩定的頁面狀態 |
| 重複同一動作 | task 是否含停止條件、工具結果是否清楚 | 降低 step 上限，補完成判準 |
| 登入一直失效 | storage state、profile、SSO 網域 | 重建登入狀態並限制 credential 網域 |
| CAPTCHA／challenge | IP、fingerprint、操作頻率 | 降速、換合法資料來源；不要宣稱一定能繞過 |
| 結果格式正確但內容錯 | schema 只驗形狀 | 保存來源並做業務驗證 |
| 成本突然上升 | step、模型、browser time、重試 | 設 budget、timeout 與任務級監控 |

如果工作只是已知 URL 的正文擷取，先用 Crawl4AI 或普通 HTTP fetch；如果是固定 selector 的 UI 測試，先用 Playwright。Browser Use 最有價值的地方，是頁面路徑會分支、需要跨頁判斷，而且每一步難以預先寫死。

## 整體取捨

Browser Use 把「讓模型看網頁並採取下一步」做成可程式化的 agent 迴圈。代價是結果受到模型、頁面狀態、登入、網路與工具描述共同影響，不能拿 demo 的一次成功當 production SLA。

可靠的起點是：限制網域與步數、用 schema 約束輸出、保留完整 history、把高風險副作用放到人工確認後面。需要自訂控制就用開放原始碼 Agent；不想維護瀏覽器程序、proxy 與大量 session，再評估 Cloud。

## 參考資料

- [Browser Use GitHub repository](https://github.com/browser-use/browser-use)
- [Browser Use Agent output format](https://docs.browser-use.com/open-source/customize/agent/output-format)
- [Browser Use authentication](https://docs.browser-use.com/open-source/customize/browser/authentication)
- [Browser Use Cloud API V4 quick start](https://docs.browser-use.com/cloud/agent/quickstart)
- [Browser Use Cloud profiles](https://docs.browser-use.com/cloud/guides/authentication)
- [Browser Use pricing](https://browser-use.com/pricing)
- [Browser Use telemetry](https://docs.browser-use.com/development/monitoring/telemetry)
