---
title: "把爬蟲腳本做成 MCP Server，讓 Claude 直接用"
date: 2026-03-20
category: tech
tags: [mcp, claude, python, fastmcp, ai-agent]
lang: zh-TW
tldr: "用 FastMCP 把本地 Python 腳本包成 MCP Server，讓 Claude Code 可以直接呼叫，不再需要手動跑 pipeline。"
description: "一步步把 104 職缺爬蟲做成 MCP Server，說明 MCP 是什麼、怎麼實作、怎麼註冊到 Claude Code。"
draft: false
---

我有一個爬 104 和 LinkedIn 職缺的腳本，跑完之後用 LLM 幫我評分、過濾、產報告。流程是這樣：

```
uv run fetch.py → 產生 JSON → uv run filter.py → 產生 Markdown 報告
```

每次要找職缺都要手動跑，還要記參數。後來想到可以做成 MCP Server，讓 Claude 直接呼叫。完整程式碼在 [vincentxuu/offernow](https://github.com/vincentxuu/offernow)。

## MCP 是什麼

MCP（Model Context Protocol）是 Anthropic 定義的協定，讓 Claude 可以呼叫外部工具。你寫一個 server，定義幾個 tool function，Claude 就知道「有這些工具可以用」，並在對話中自己決定什麼時候呼叫。

```
你：幫我找最近的 AI 相關職缺
        ↓
Claude 呼叫 list_local_data → 知道有哪些資料
Claude 呼叫 filter_and_score_jobs → 過濾評分
Claude 整理結果回覆你
```

跟直接跑腳本的差別是：你不需要知道要執行什麼指令，Claude 幫你決定。

## 架構

這個 server 不做爬蟲，爬蟲還是手動跑或排程跑。MCP Server 只負責讀本地 JSON、過濾、評分：

```
uv run fetch.py          ← 定期跑，產生 JSON（慢，幾分鐘）
        ↓
data/104_jobs_search.json

        ↓ MCP 讀這個檔

Claude Code ←→ mcp_server.py（即時）
```

爬蟲慢沒關係，跟 MCP 完全分開。

## 實作

安裝 FastMCP：

```bash
uv add "mcp[cli]"
```

新增 `mcp_server.py`，把現有函數 wrap 成 tool：

```python
from mcp.server.fastmcp import FastMCP
from filter import pre_filter, score_batch_with_llm, build_report, load_jobs

mcp = FastMCP("offernow")

@mcp.tool()
def list_local_data() -> dict:
    """列出本地已有的職缺資料，包含筆數與更新時間。"""
    ...

@mcp.tool()
def filter_and_score_jobs(max_llm: int = 20) -> str:
    """讀本地 JSON → 初篩 → LLM 評分 → 回傳 Markdown 報告。"""
    jobs_104, jobs_linkedin = load_jobs(DATA_DIR)
    filtered = pre_filter(jobs_104, jobs_linkedin)
    ...
    return build_report(scored, unscored, stats)

@mcp.tool()
def search_local_jobs(
    keyword: str,
    source: str = "all",
    limit: int = 50,
    offset: int = 0,
    include_description: bool = False,
) -> dict:
    """在本地資料中搜尋職缺，不發網路請求。"""
    ...
    return {"total": total, "by_source": by_source, "count": len(page), "results": page}

if __name__ == "__main__":
    mcp.run()
```

裝飾器 `@mcp.tool()` 就是全部，FastMCP 會自動從 docstring 和型別提示產生 schema，Claude 靠這個知道每個 tool 做什麼、接受什麼參數。

有幾個細節值得注意：

**控制回傳量**：本地有 1,000+ 筆職缺，全部塞進 tool response 會超出 context。`search_local_jobs` 預設 `include_description=False` 排掉最大的欄位，`limit=50` 控制筆數，需要更多再用 `offset` 分頁取。

**回傳 metadata**：回傳 `dict` 而非 `list`，帶上 `total` 和 `by_source`，讓 Claude 知道總共有幾筆、來自哪個來源，方便它決定要不要繼續查。

## 註冊到 Claude Code

```bash
claude mcp add -s user offernow -- bash -c "uv run mcp_server.py"
```

`claude mcp add` 沒有 `--cwd` 參數，需要直接編輯 `~/.claude.json`，把指令改成帶 cd 的版本：

```json
{
  "mcpServers": {
    "offernow": {
      "type": "stdio",
      "command": "bash",
      "args": ["-c", "cd /path/to/fetch-data && uv run mcp_server.py"]
    }
  }
}
```

確認有沒有載入：

```bash
claude mcp list
# offernow: bash -c cd /... && uv run mcp_server.py - ✓ Connected
```

## 用起來

重開 Claude Code，直接說「幫我看一下現在有哪些職缺資料」，Claude 會呼叫 `list_local_data`，回傳本地有幾筆、幾時更新，然後問你要不要過濾。不需要記任何指令。

## Skill 和 MCP 的差別

這兩個容易混淆。Skill 是給 Claude 看的 Markdown 說明文件，告訴它「遇到 X 要怎麼做」，執行者還是 Claude 自己。MCP tool 是真的程式碼，Claude 呼叫後由 server 執行，有真實的 I/O。

用比喻說：Skill 是 SOP 文件，MCP 是機器。

## 參考資料

- [Model Context Protocol 規格](https://modelcontextprotocol.io/)
- [FastMCP（Python MCP SDK）](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code MCP 設定文件](https://docs.anthropic.com/en/docs/claude-code/tutorials#set-up-model-context-protocol-mcp)
- [uv - Python 套件管理工具](https://docs.astral.sh/uv/)
- [offernow 專案 GitHub](https://github.com/vincentxuu/offernow)
