---
title: "工具推薦｜symfony/ai-mcp-tool — 讓 Symfony AI Agent 直接掛上遠端 MCP 工具伺服器"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, tool, daily, framework-plugin]
lang: zh-TW
description: "Symfony AI 官方推出的 MCP client bridge，把遠端 MCP server 的工具轉成 Agent 認得的 Tool 物件，自動加前綴避免多伺服器工具名稱衝突，PHP Agent 開發不用再手寫轉接層"
tldr: "symfony/ai-mcp-tool 是 Symfony AI 官方推出的 MCP client bridge，讓 Symfony Agent 直接掛上任何遠端 MCP server 提供的工具。安裝：composer require symfony/ai-mcp-tool。解決了 PHP Agent 開發者得手寫「MCP tool schema 轉框架 Tool 物件」轉接層、以及多伺服器工具名稱衝突的問題。"
series:
  name: "AI Tool of the Day"
  order: 32
---

> 🌏 [English version](/en/posts/daily/2026-09-17-tool-symfony-ai-mcp-tool-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | symfony/ai-mcp-tool |
| 類型 | Framework plugin（Symfony AI 的 MCP client bridge） |
| GitHub | [symfony/ai-mcp-tool](https://github.com/symfony/ai-mcp-tool) |
| Stars | 2 |
| 語言 | PHP |
| 授權 | MIT |
| 安裝 | `composer require symfony/ai-mcp-tool` |

## 解決什麼問題

用 PHP 寫 Agent 的人現在多半會選 Symfony AI——官方一套涵蓋 Platform（多家模型統一介面）、Agent（工具呼叫迴圈）、Store（向量資料庫）的元件。但如果 Agent 想動用外部 MCP server 提供的工具，例如官方 filesystem server 或社群的資料庫查詢 server，得自己寫轉接層：呼叫 `tools/list` 拿到的是一份 JSON Schema，要手動轉成 Symfony AI 認得的 `Tool` 物件；如果同一個 Agent 想同時掛兩個 server，還要自己處理兩邊都叫 `read_file` 的命名衝突。

symfony/ai-mcp-tool 把這層轉接寫成一個 `McpToolbox`：包一個或多個 `ClientToolset`（每個對應一條 MCP 連線，stdio 或遠端都可以），呼叫時把遠端工具清單轉成 `Symfony\AI\Platform\Tool\Tool` 定義，並在名稱前自動加上該 server 的短名稱前綴（`filesystem` server 上的 `read_file` 變成 `filesystem_read_file`），多個 server 掛同一個 Agent 也不會撞名。它刻意只做「工具提供者」這一件事——不處理 MCP 的 prompts、resources，也不假裝自己是完整的 MCP client，邊界畫得很窄。

適合已經在用 Symfony AI 寫 Agent、想直接接上現成 MCP server 生態、不想為每個 server 手寫一份轉接程式碼的 PHP 開發者。在完整的 Symfony 應用裡，這層轉接可以再省一步：透過 MCP Bundle 的 `clients:` 設定描述好連線，AI Bundle 的 agent 設定裡用 `mcp_server:` 工具條目指向它，完全不用碰這支 bridge 的程式碼——它只在你自己組裝 `Agent` 物件（standalone script、非 Symfony 框架應用內、或測試）時才需要手動 `use`。

## 快速上手

### 安裝

```bash
composer require symfony/ai-mcp-tool
# 需要 PHP >= 8.2，且用到官方 mcp/sdk 和 symfony/ai-agent
```

### 基本用法

掛一個 stdio 型 MCP server（官方 filesystem server），組成一個可以被 Agent 呼叫的工具箱：

```php
use Mcp\Client;
use Mcp\Client\Transport\StdioTransport;
use Symfony\AI\Agent\Agent;
use Symfony\AI\Agent\Bridge\Mcp\ClientToolset;
use Symfony\AI\Agent\Bridge\Mcp\McpToolbox;

$toolset = new ClientToolset(
    'filesystem',
    Client::builder()->build(),
    new StdioTransport('npx', ['-y', '@modelcontextprotocol/server-filesystem', __DIR__]),
);

$agent = new Agent($platform, 'gpt-4o-mini', toolbox: new McpToolbox($toolset));
```

Agent 呼叫時看到的工具名稱會是 `filesystem_read_file`、`filesystem_list_directory` 之類，而不是原始的 `read_file`。

### 進階用法

同一個 Agent 掛多個 server，用 `ChainToolbox` 串起來，並用事件監聽器擋掉不該執行的工具呼叫（例如 Agent 想寫入檔案，但這次對話應該是唯讀）：

```php
use Symfony\AI\Agent\Bridge\Mcp\McpToolbox;
use Symfony\AI\Agent\Toolbox\ChainToolbox;
use Symfony\AI\Agent\Toolbox\Event\ToolCallRequested;

$toolbox = new ChainToolbox([
    new McpToolbox($filesystemToolset, retryAfter: 60),
    new McpToolbox($githubToolset, retryAfter: 60),
]);

$eventDispatcher->addListener(ToolCallRequested::class, function (ToolCallRequested $event): void {
    if (str_contains($event->getDefinition()->getName(), '_write_')) {
        $event->deny('write operations are disabled in this session');
    }
});
```

`retryAfter` 是內建的斷路器：某個 MCP server 連不上時，`getTools()` 回傳空陣列而不是整個請求失敗，且接下來 N 秒內不會再重試連線——一個掛掉的 server 不會拖垮 Agent 對其他 server 的呼叫，也不會每次工具列舉都重新嘗試一次會失敗的連線。

## 與現有工具的比較

| | symfony/ai-mcp-tool | 自己手寫轉接層 | LangChain `langchain-mcp-adapters`（Python） |
|---|---|---|---|
| 官方維護、跟框架版本同步 | ✅ | — | ✅（LangChain 官方） |
| 多 server 自動前綴防撞名 | ✅ | 需自行實作 | ✅ |
| 連線失敗斷路器（避免每次重試） | ✅（`retryAfter`） | 需自行實作 | 需視底層 client 而定 |
| 工具呼叫可攔截/拒絕（權限閘） | ✅（事件系統） | 需自行實作 | 需自行包裝 |
| PHP 生態 | ✅ | ✅ | ❌（Python） |

## 注意事項

- **仍是 0.x、`minimum-stability: dev`**：跟著 `symfony/ai` monorepo（目前 0.13 版）走，API 還可能調整，正式導入前留意 changelog。
- **只覆蓋工具，不覆蓋 prompts/resources**：README 明講這是刻意的邊界——如果你的 MCP server 主要靠 prompts 或 resources 提供資訊，這支 bridge 不會幫你轉接那部分，還是得自己處理。
- **stdio transport 每次連線會起一個子行程**：文件特別提到在 Messenger worker 這類長駐流程裡，每次處理訊息都會是全新子行程，不會沿用前一次的連線，設計 stdio server 時要留意啟動成本。

## 今日收穫

多數 MCP 語言 SDK 停在「幫你發得出 `tools/list`、`tools/call` 請求」這一層，剩下「怎麼接進我這個框架的 Agent 迴圈」還是每個框架自己補。symfony/ai-mcp-tool 補的正是這一段——而且補得夠窄：只認工具，前綴防撞名，斷路器防止死掉的 server 拖垮整體。一個框架級 MCP bridge 的價值，看的常常不是包了多少功能，而是它敢明講「這些我不管」的那條線畫在哪裡。

## 參考資料

- [symfony/ai-mcp-tool GitHub repo](https://github.com/symfony/ai-mcp-tool)：README 全文與 composer.json，本文安裝指令與核心說明的出處。
- GitHub API repo metadata（`symfony/ai-mcp-tool`）：Stars（2）、語言（PHP）、授權（MIT）、建立時間（2026-09-16）取自 GitHub REST API。
- [symfony/ai-mcp-tool 原始碼 — `ClientToolset.php` / `Tests/McpToolboxTest.php`](https://github.com/symfony/ai-mcp-tool)：`retryAfter` 斷路器行為、`ChainToolbox` 串接多 server、`ToolCallRequested` 事件攔截，均直接讀自原始碼與測試案例確認。
- [MCP Bundle — Symfony Docs](https://symfony.com/doc/current/ai/bundles/mcp-bundle.html)：Symfony 應用內如何用 MCP Bundle 的 `clients:` 設定描述連線，供本文「在完整 Symfony 應用裡可再省一步」的說法佐證。
- [Symfony AI 官網](https://ai.symfony.com/)：symfony/ai 專案整體定位（Platform / Agent / Store 元件）背景說明。
