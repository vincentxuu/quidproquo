---
title: "Agent Plugins 1.0：OpenAI、Google、AWS 罕見聯手，統一 AI Agent 擴充的封裝標準"
date: 2026-08-21
type: deep-dive
category: ai
tags: [agent-plugins, mcp, agent-skills, open-standard, openai, google, aws, cursor, vercel]
lang: zh-TW
tldr: "Agent Plugins 1.0 是一個封裝格式標準，把 Agent Skills（Markdown 指令）和 MCP server 設定包成一個目錄，讓同一個 plugin 能被 ChatGPT、Cursor、GitHub Copilot、Kiro、VS Code 直接載入。它不是新的協議，是協議之上的包裝紙。Vercel 發起，OpenAI、AWS、Microsoft、Cursor 共同制定，Google 發佈當天加入——Anthropic 不在治理名單上，但 MCP 團隊正面回應。"
description: "Agent Plugins 1.0 的技術規格、plugin.json 與 mcp.json 結構、與 MCP 的分層關係、六家 launch client 的支援範圍，以及這個標準真正解決與沒有解決的問題。"
series:
  name: "AI 時代的技術選擇"
  order: 126
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-agent-plugins-open-standard-en)

你寫了一份 SKILL.md，教 agent 怎麼查公司內部知識庫回答客戶問題。

分享給同事，不管他用 Cursor、Copilot 還是 Claude Code，都能讀——因為 [Agent Skills](https://agentskills.io/) 規格本身就是跨 client 的開放標準，SKILL.md 天生可攜。

但問題來了：這份 skill 要搭一個 MCP server 才能跑，那個 MCP server 接的是內部知識庫的 API。同事拿到 SKILL.md 之後問你：「MCP server 怎麼設定？」你傳了一份文件。他照著設定，發現 Copilot 的 MCP 設定格式跟你在 Cursor 裡用的不一樣。另一個用 ChatGPT 的同事也卡住了。

**Skill 可攜，但 skill 的依賴不可攜。** 這才是問題所在。

---

## 這個標準在做什麼

[Agent Plugins 1.0.0](https://agent-plugins.org/) 解決的就是這個依賴打包的問題。它是一個**封裝格式**（packaging format），不是新協議、不是新 runtime。它定義一個目錄結構，把兩個已經存在的東西——[Agent Skills](https://agentskills.io/)（Markdown 指令集）和 [MCP](https://modelcontextprotocol.io/) server 設定——包成一個可安裝的單位。

裝了 plugin，skill 跟它需要的工具一起到位。

這裡要先釐清一個常見的誤解：**Agent Skills 的可攜性不是 Agent Plugins 帶來的。** SKILL.md 本身遵循的是獨立的 Agent Skills 規格，Cursor、Copilot、Claude Code、Kiro、ChatGPT 本來就都能讀。如果你的 skill 不依賴任何 MCP server，直接分享 SKILL.md 就夠了，不需要 Agent Plugins。

Agent Plugins 加值的地方在於：

| 層級 | 角色 | 可攜性 |
|---|---|---|
| **MCP** | 通訊協議——agent 怎麼呼叫工具 | 協議可攜，但各 client 的設定格式不同 |
| **Agent Skills** | 認知指令——agent 怎麼思考 | **本來就可攜**——SKILL.md 跨 client |
| **Agent Plugins** | 封裝格式——把 skill 跟它需要的 MCP 設定打包 | 解決的是依賴的可攜性 |

用一個具體的例子解釋。這個站的 `.agents/skills/` 裡有幾十個 skill，它們對 Agent Plugins 的需求完全不同：

**`post-review`**（發文前自動審稿）——SKILL.md 裡寫的是：跑 `pnpm verify`、檢查 frontmatter、比對 writing guide、回報問題清單。它依賴的全是本地指令和檔案系統操作，不需要任何 MCP server。

要分享這個 skill？**直接丟 SKILL.md 就好。** 別人的 Cursor、Copilot、Claude Code 都能讀，不需要 Agent Plugin。

**`deep-research`**（多源研究 + 交叉驗證）——SKILL.md 裡寫的是：拆問題、多源蒐集、交叉驗證、萃取成 research note。但它的 `references/mcp-tools.md` 裡列了一整套 MCP 工具映射：Exa 做廣域搜尋、Tavily 做深度爬取、Jina 讀取特定 URL——沒有這些 MCP server，skill 裡寫的「多源蒐集」就是空話。

要分享這個 skill？SKILL.md 可以直接丟，但收到的人裝不了——他不知道要設定哪些 MCP server、設定檔長什麼樣、哪個是必要的哪個是備援。**這才是需要 Agent Plugin 的場景**：把 SKILL.md 跟 `mcp.json`（列出 Exa、Tavily、Jina 的 server 設定）包在一起，裝了就能跑。

```
deep-research-plugin/
  plugin.json
  skills/
    deep-research/
      SKILL.md
      references/mcp-tools.md
  mcp.json              ← Exa + Tavily + Jina 的 server 設定
```

**`post`**（寫文章）——高度綁定這個站的目錄結構、frontmatter schema、分類規則、模板。即使包成 Agent Plugin 也沒人能用，因為 skill 的前提是「`src/content/posts/` 存在且 schema 是這個站的」。這種 repo-specific 的 skill 不適合分發，不管有沒有 Agent Plugins。

三個 skill，三種情況：不需要包裝、需要包裝、不適合分發。判斷標準只有一個：**skill 有沒有外部依賴需要跟著一起打包。**

## 誰在推

[Vercel 發起](https://vercel.com/blog/introducing-agent-plugins)，2026 年 8 月 6 日公開。Technical Steering Committee 的 Core Maintainer：

| 公司 | 身份 | Launch Client |
|---|---|---|
| Vercel | 發起者、Core Maintainer | — |
| OpenAI | Core Maintainer | ChatGPT、Codex |
| AWS | Core Maintainer | Kiro |
| Microsoft | Core Maintainer | GitHub Copilot、VS Code |
| Anysphere（Cursor） | Core Maintainer | Cursor |
| Google | 發佈當天加入 Core Maintainer | Agents CLI、Data Agent Kit |

這個名單的意義在於**罕見的跨陣營合作**。OpenAI 和 Google 在模型層打得你死我活，AWS 和 Microsoft 在雲端互為最大對手，Cursor 正在搶 Copilot 的 IDE 市場——但他們在「plugin 應該長什麼樣」這一題上坐下來了。

**Anthropic 不在 TSC 名單上。** 但 MCP 團隊的 Tobin South 在 X 上正面回應，說 plugins「很可能成為預設的封裝機制」，且 Claude Code 的 plugin 結構已經相容。考慮到 Agent Plugins 把 MCP 當作核心原語之一，Anthropic 是最大的間接受益者。

發佈後也有更多 client 加入支援，包括 Nous Research 的 Hermes Agent、x.ai 的 Grok Bot、OpenClaw、NanoClaw。

## 技術規格

### 目錄結構

一個 plugin 就是一個檔案系統目錄：

```
my-plugin/
  plugin.json              # 清單（必要）
  skills/                  # Agent Skills
    summarize/
      SKILL.md
      references/
  mcp.json                 # MCP server 設定
  com.example.client/      # client 專屬擴充（reverse-domain 命名）
```

沒有壓縮檔格式，沒有 registry，沒有 package manager。用 `ls` 就能看、用 `git` 就能版控。規格書自己寫了設計理由：「Plugins use filesystem directories as the package unit... This keeps plugins inspectable with standard tools.」

### plugin.json

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "knowledge-base",
  "version": "1.0.0",
  "description": "Internal KB search and Q&A",
  "author": { "name": "Acme Corp" },
  "keywords": ["search", "qa"],
  "extensions": {
    "com.cursor": { "shortcut": "kb" }
  }
}
```

只有 `$schema` 和 `name` 是必填。Schema 是 closed 的——未知的頂層欄位會觸發警告但不會讓 plugin 失效，型別不對則直接拒絕。

`name` 的規則很嚴：1–64 字元，只能用小寫字母、數字、`-` 和 `.`，不能連續 `--` 或 `..`，頭尾必須是字母或數字。

`extensions` 是留給各 client 的命名空間，用 reverse-domain 命名，不認識的 client 會忽略它。這是規格裡最聰明的設計之一——它承認不同 client 有不同需求，但把差異關在一個隔間裡，不汙染可移植的部分。

### mcp.json

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "local-tools": {
      "type": "stdio",
      "command": "./bin/server",
      "args": ["--data", "${PLUGIN_DATA}"]
    },
    "remote-api": {
      "type": "streamable-http",
      "url": "https://tools.example.com/mcp"
    }
  }
}
```

三種傳輸方式：`stdio`（本地子行程）、`streamable-http`（目前的 MCP HTTP 傳輸）、`sse`（舊版，optional）。Client 至少要支援 stdio 或 streamable-http 其中一個。

兩個佔位變數：`${PLUGIN_ROOT}`（plugin 目錄的絕對路徑）和 `${PLUGIN_DATA}`（client 管理的持久化目錄，更新時保留，解安裝時可以刪）。展開是單次的，不遞迴。

安全規則：`command` 必須是單一可執行檔 token，不是 shell string；plugin 不能在 `headers` 或 `env` 裡嵌入憑證；v1 沒有定義任何 OAuth 或 credential-reference 欄位——認證完全由 client 管理。

### Skills 探索

`skills/` 目錄下的每個直屬子目錄如果包含 `SKILL.md`，就是一個 skill。不遞迴搜尋。Skill 的格式遵循 [Agent Skills 規格](https://agentskills.io/specification)，本質上就是一個 Markdown 檔案加上可選的 `references/` 和 `scripts/`。

### 容錯模型

這是規格裡最務實的設計：

- 必填欄位的 schema violation → 拒絕整個 plugin
- 單一元件無效（例如某個 skill 的 SKILL.md 語法錯誤）→ 只跳過那個元件，其他照常載入
- 缺少的選填檔案 → 不是錯誤

「A plugin that provides skills and an MCP server should not become entirely unusable because one server is unavailable.」

### Client 合規要求

一個合規的 client 必須：

1. 能從目錄路徑載入 plugin
2. 解析和驗證 `plugin.json`
3. 忽略不認識的 `extensions` 命名空間
4. 在固定位置探索支援的元件類型
5. 至少支援一種元件類型（skills 或 MCP）

增量採用是被允許的：一個只支援 skills 的 client 可以完全不實作 MCP 的部分，仍然算合規。

## 它真正解決的問題

不是 skill 的可攜性——那本來就有。是**依賴打包**。

回到開頭的場景。你有一份 skill，它需要一個 MCP server 才能跑。你想讓三個用不同 client 的同事都能用。

以前：SKILL.md 直接丟給同事就能讀，但 MCP server 的設定各 client 格式不同。你要寫三份設定文件，或者寫一份很長的安裝說明教他們各自怎麼設定。

```
# 給 Cursor 用的人
把 mcp.json 放到 .cursor/mcp.json，格式是 ...

# 給 Copilot 用的人
在 settings.json 裡加 mcpServers，格式是 ...

# 給 ChatGPT 用的人
到 Plugin 設定裡手動填 ...
```

現在：

```
my-plugin/
  plugin.json
  skills/my-skill/SKILL.md
  mcp.json
```

一個目錄，三個 client 都知道怎麼讀。Skill 跟它需要的 MCP server 設定在同一個地方，安裝時一起載入。

換句話說，Agent Plugins 解決的是一個**分發問題**，不是格式問題。Skill 的格式本來就統一了，MCP 的協議也統一了，但「怎麼把一個 skill 連同它依賴的 MCP server 打包成一個東西讓人安裝」——這件事以前沒有標準，每個 client 各做各的。

這是第一次有人坐下來把這件事標準化，而且坐下來的不是一家公司，是六家。

## 它沒有解決的問題

標準的邊界跟標準本身一樣重要。v1 明確不管這些事：

**沒有 registry 或 package manager。** 沒有 `npm install @acme/kb-plugin` 這種東西。怎麼安裝 plugin 完全由各 client 自己決定——Cursor 可能用 UI 按鈕，Copilot 可能用 CLI，ChatGPT 可能用 store。

**沒有認證標準。** v1 不定義 OAuth 流程或 credential reference。如果你的 MCP server 需要 API key，怎麼讓使用者安全地提供這個 key，是 client 的事。

**沒有壓縮檔或傳輸格式。** Plugin 是目錄，不是 `.zip`。怎麼從 A 傳到 B，不在規格範圍內。

**Skill 的解讀仍然因 client 而異。** 同一份 SKILL.md 在不同 client 裡的行為不保證一致——不同的模型、不同的 system prompt 組裝方式、不同的 context window 管理。

**v1 只有兩種元件。** 規格書明確說其他提案——commands、hooks、agents、rules、LSP servers——「too client-specific for a stable portable contract」，留待未來版本。

這些限制是刻意的。Vercel 的公告寫得很直白：「The format is intentionally small and easy to implement.」先把所有人都能同意的最小交集標準化，剩下的讓各 client 自己競爭——這跟 MCP 早期只定義最小可行協定的策略很像。

## 對開發者的意義

如果你的 skill 不依賴 MCP server，直接分享 SKILL.md 就好，不用多包一層。Agent Skills 規格本身就是跨 client 的。

**當你的 skill 依賴特定的 MCP server 時，才值得包成 Agent Plugin。** 加一個 `plugin.json` 和 `mcp.json`，成本極低，但收到的人裝了就能用——不用自己去搞 MCP 設定。

如果你是在選 agent client，這個標準的存在意味著 plugin 生態系統不再是鎖定使用者的護城河。以前你選了 Cursor 就只能用 Cursor 的 plugin 設定方式，現在至少基礎層是通的。選 client 回到它該比的東西：模型能力、UI、回應速度、價格。

如果你是在觀察產業動態，這可能是 2026 年最重要的標準化事件之一。不是因為技術上多創新——一個目錄結構加兩個 JSON schema，就這樣。而是因為**誰坐在桌上**。OpenAI 和 Google 在模型競爭的同時同意共用 plugin 格式，這在一年前是不可想像的。它暗示了一件事：agent 生態系的競爭重心正在從「誰的工具能力更強」移向「誰的 agent 用工具用得更聰明」。工具本身變成公共建設，怎麼用工具才是差異化的戰場。

## 現有生態系

規格發佈兩週，生態系長得比預期快。[agentpluginsdirectory.com](https://agentpluginsdirectory.com/) 從 613 個 GitHub repo 中抓到 2,002 個 manifest，schema 驗證後去重，目前列出 999 個 verified plugin。

### 代表性 plugin

**AWS Agent Toolkit**（[awslabs/agent-plugins](https://github.com/awslabs/agent-plugins)，867 stars）是目前最大的官方 plugin 集合，包含 9 個 plugin：deploy-on-aws、aws-serverless、aws-amplify、databases-on-aws、amazon-location-service、migration-to-aws、sagemaker-ai、aws-transform、codebase-documentor-for-aws。Claude Code、Codex、Cursor 都支援。

**OpenAI** 把 ChatGPT 原本的 App Directory 轉型成 Plugin Directory（2026 年 7 月 9 日），目前有 12 個官方 plugin（GitHub、Gmail、Drive、Slack 等）加上按角色分的 Business plugin（銷售、數據分析、投資銀行等），marketplace 總計 90+ 個整合。

社群面有幾個聚合清單值得關注：[awesome-codex-plugins](https://github.com/hashgraph-online/awesome-codex-plugins) 列了 12 個官方 + 約 20 個社群 plugin，[awesome-codex-cli](https://github.com/RoggeOhta/awesome-codex-cli) 收錄了 150+ 個生態系工具（含 skill pack 和 MCP server），[awesome-ai-plugins](https://github.com/hashgraph-online/awesome-ai-plugins) 則跨 client 整理。

### 安裝方式仍然各做各的

規格不管安裝——這在實作中變成最明顯的碎片化：

| Client | 安裝方式 |
|---|---|
| ChatGPT | 側邊欄 Plugins → 瀏覽 Plugin Directory → 一鍵安裝（Plus/Pro/Team） |
| Codex | `/plugins` 開 marketplace 瀏覽，或 `/plugin install <name>@<marketplace>` |
| Cursor | Customize 頁面 或 內建 Marketplace 側邊欄 |
| Copilot | `copilot plugin install <name>@<marketplace>` CLI，或 VS Code 側邊欄的 Agent Plugins 檢視 |
| Kiro | `/plugin install <name>@<marketplace>`，透過 Kiro Powers 原生支援 |

Plugin 的格式統一了，但使用者「怎麼找到 plugin、怎麼裝 plugin」的體驗完全不同。這正是 v1 留白的設計——讓安裝和發現機制成為各 client 的差異化競爭點。

### 企業治理

Copilot Business/Enterprise 已經可以用 `managed-settings.json` 管理 plugin：

- `enabledPlugins`：替全組織自動安裝指定 plugin
- `strictKnownMarketplaces`：限制只能從核准的 marketplace 安裝，阻擋未知來源
- `extraKnownMarketplaces`：加入額外的核准來源

覆蓋 VS Code、Copilot CLI、JetBrains（2026-08-18 起）和 Copilot 雲端 agent（2026-07-27 起）。其他 client 的企業管理功能還在早期，但方向一致：IT 管理員需要的不是禁止 plugin，而是控制 plugin 從哪裡來。

## 值得追蹤的事

1. **Anthropic 會不會正式加入 TSC。** Claude Code 的 plugin 結構已經相容，但「結構相容」和「正式加入治理」是兩回事。
2. **v1.1 會加什麼。** GitHub 上已有工作草案，社群討論最多的是認證標準化和某種形式的 plugin registry。
3. **Skill 可移植性的實際表現。** 格式統一不等於行為統一，同一份 SKILL.md 在六個 client 裡的表現差異會是生態系成熟度的試金石。

---

## 參考資料

| 資料 | 來源 | 日期 |
|---|---|---|
| Agent Plugins 1.0.0 規格 | [agent-plugins.org/specification](https://agent-plugins.org/specification) | 2026-08-11 |
| Vercel 公告 | [vercel.com/blog/introducing-agent-plugins](https://vercel.com/blog/introducing-agent-plugins) | 2026-08-06 |
| Google 加入 | [developers.googleblog.com](https://developers.googleblog.com/agent-plugins-package-your-skills-tools-and-more/) | 2026-08-06 |
| GitHub 規格庫 | [github.com/agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec) | 截至 2026-08-21，1.1k stars |
| Compatible clients 清單 | [agent-plugins.org](https://agent-plugins.org/) compatible clients 頁面 | 2026-08-21 查 |
| Plugin 目錄（999 verified） | [agentpluginsdirectory.com](https://agentpluginsdirectory.com/) | 2026-08-18 更新 |
| AWS Agent Toolkit | [awslabs/agent-plugins](https://github.com/awslabs/agent-plugins) | 截至 2026-08-21，867 stars |
