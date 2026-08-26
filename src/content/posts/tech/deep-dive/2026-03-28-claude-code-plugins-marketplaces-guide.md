---
title: "Claude Code Plugins 與 Marketplaces：把 skills、hooks、MCP 打包成一個安裝單位"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, plugins, marketplace, skills, hooks]
lang: zh-TW
tldr: "Plugin 的價值不是新能力，而是分發：把散在 .claude/ 的 skills、agents、hooks、MCP 設定收進一個帶 manifest 的目錄，透過 marketplace 安裝、更新、鎖版本。本文拆解 plugin 目錄結構、最小建立流程、marketplace 發佈與 dependencies 版本約束。"
description: "Claude Code plugin 深入介紹：plugin.json manifest 與目錄結構、${CLAUDE_PLUGIN_ROOT}、--plugin-dir 本地測試、marketplace.json 七種 plugin source、git tag 版本解析，以及何時該做成 plugin 而不是單獨放 skill。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 16
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide-en)

系列寫到[Skills](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)和[Hooks](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide)，都是一次處理一種擴充。但當你想把一組 skill 加上配對的 hook、再綁一個 MCP server，一起交給團隊或社群使用時，逐檔複製就變成災難。Plugin 就是為這一步設計的。

## Plugin 解決的是分發，不是能力

先講清楚增量在哪。Skills、subagents、hooks、MCP server 本來就能在 `.claude/` 目錄個別設定——不用 plugin 也做得到。Plugin 多做的事只有一件：把這些散落的設定收進一個自包含目錄，加上一份 manifest，變成**一個**可版本化、可安裝的單位。

官方文件對兩條路的比較很直接：standalone（`.claude/` 目錄）適合個人工作流、專案客製和快速實驗；plugin 適合分享給隊友、發佈到社群、跨專案重複使用。

安裝之後還有一個差異：命名空間。`my-first-plugin` 裡的 `hello` skill，呼叫名稱是 `/my-first-plugin:hello`。多個 plugin 有同名 skill 不會互相覆蓋——這是 standalone 做不到的。

## 目錄結構

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json     # manifest（唯一放在這裡的東西）
├── skills/             # <name>/SKILL.md
├── commands/           # 平坦式 .md skill（舊格式）
├── agents/             # 自訂 sub-agents
├── hooks/
│   └── hooks.json      # 事件處理器
├── .mcp.json           # MCP server 設定
├── .lsp.json           # LSP server 設定（code intelligence）
├── monitors/           # 背景監看
└── settings.json       # 啟用時套用的預設設定
```

兩個常踩的坑：

1. **只有 `plugin.json` 放在 `.claude-plugin/` 裡**。`skills/`、`agents/`、`hooks/` 全部放 plugin 根目錄，塞進 `.claude-plugin/` 不會被讀。
2. **安裝時 plugin 目錄會被複製到 `~/.claude/plugins/cache`**。所以 skill 或 hook 引用自己附帶的腳本時，不要寫相對路徑去抓 plugin 外的檔案——那些不會跟著被複製。要引用 plugin 內的檔案，用 `${CLAUDE_PLUGIN_ROOT}` 環境變數，它永遠指向 plugin 根目錄。

## 寫第一個 plugin

最小步驟只要三步：

```bash
mkdir my-first-plugin/.claude-plugin
```

寫 manifest：

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

加一個 skill，放在 `skills/hello/SKILL.md`：

```markdown
---
description: Greet the user warmly and ask how you can help them today.
disable-model-invocation: true
---

Greet the user named "$ARGUMENTS" warmly and ask how you can help them today.
```

本地測試不需要 marketplace，直接指目錄：

```bash
claude --plugin-dir ./my-first-plugin
```

進去跑 `/my-first-plugin:hello Alex`，`$ARGUMENTS` 會吃到你打的字。改完檔案跑 `/reload-plugins` 熱載入，不用重開 session。

順帶一提：只出一個 skill 的 plugin 可以把 `SKILL.md` 直接放在 plugin 根目錄，連 `skills/` 都不用建；而 `claude plugin init my-tool` 會在 `~/.claude/skills/` 底下生一個自動載入的 skill 目錄 plugin，連安裝步驟都省了。

## 安裝：從官方 marketplace 到團隊 repo

使用者端的流程是兩步：先加 marketplace（登記目錄），再裝個別 plugin。官方 marketplace `claude-plugins-official` 在第一次互動式啟動時自動註冊，裡面有 LSP code intelligence、GitHub/GitLab 整合、`commit-commands` 這類現成品：

```
/plugin install github@claude-plugins-official
```

`/plugin` 會打開互動面板，四個 tab：Discover（瀏覽）、Installed（管理）、Marketplaces（增刪目錄）、Errors（載入錯誤）。安裝時選 scope：user（自己、跨專案）、project（寫進 `.claude/settings.json`，整個 repo 的協作者都裝）、local（只有自己在這個 repo）。

第三方社群 marketplace `anthropics/claude-plugins-community` 要手動加：

```
/plugin marketplace add anthropics/claude-plugins-community
```

團隊場景則是把 marketplace 寫進專案的 `.claude/settings.json`（`extraKnownMarketplaces`），成員信任 repo 資料夾後自動註冊，再搭配 `enabledPlugins` 指定預設啟用哪些。

## 發佈自己的 marketplace

Marketplace 就是一個 repo，根目錄放 `.claude-plugin/marketplace.json`：

```json
{
  "name": "company-tools",
  "owner": { "name": "DevTools Team" },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0"
    }
  ]
}
```

每個 entry 至少要有 `name` 和 `source`。source 支援七種型態：相對路徑（同 repo 內）、`github`、`url`（任意 git URL）、`git-subdir`（monorepo 子目錄，稀疏 clone）、`npm`、`archive`（HTTPS 下載 zip，可用 sha256 鎖完整性）、`command`（執行本機指令產出 plugin 目錄）。Git 型的 source 都可以再加 `ref` 和 `sha` 釘到特定 commit。

Hosting 的選擇很寬鬆：官方推薦 GitHub（`owner/repo` 格式即可加入），任何 git 服務包括 self-hosted 都行——SSH URL、指定 branch 用 `#v1.0.0` 後綴都可以。私人 repo 也支援，靠你現有的 git credential helper 認證。Team/Enterprise 方案還能走 Organization settings 分發，由 Claude GitHub App 同步，使用者完全不碰 git 憑證。

## Dependencies 版本約束

Plugin 可以在 manifest 裡宣告依賴其他 plugin：

```json
{
  "name": "deploy-kit",
  "version": "3.1.0",
  "dependencies": [
    "audit-logger",
    { "name": "secrets-vault", "version": "~2.1.0" }
  ]
}
```

裸字串代表追最新版；物件形式可以用 semver range（`~2.1.0`、`^2.0`、`=2.1.0`）。沒有約束時，上游一發新版，auto-update 就把所有人的依賴換掉——你的 plugin 可能就此壞掉。

版本的解析靠 git tag，命名規則是 `{plugin-name}--v{version}`。作者端一行指令搞定：

```bash
claude plugin tag --push
```

它會驗證 plugin 內容、確認 manifest 和 marketplace entry 的 version 一致，然後打 tag 推上去。安裝時 Claude Code 列出 repo 上的 tag，抓滿足範圍的最高版本。多個 plugin 同時約束同一個依賴時，Claude Code 取各範圍的交集，解析到同時滿足的最高版；範圍不相交就直接報 `range-conflict`。

跨 marketplace 的依賴預設被擋——防止一個 marketplace 默默拉進你沒審過的來源。要開放得在根 marketplace 的 `marketplace.json` 加 `allowCrossMarketplaceDependenciesOn` 白名單。

還有一個好用的模式：manifest 只寫 `dependencies`、不含任何元件，就是一個「懶人包」——平台團隊發一個 `backend-standard`，工程師一行 `claude plugin install` 裝齊整套標配。

## 何時該做成 plugin

判斷只有一條軸線：**要不要離開你自己的機器**。

- 只在自己的專案用 → standalone `.claude/`，迭代最快。官方也建議先 standalone，等要分享再轉 plugin。
- 要給團隊或社群、需要版本化更新 → plugin + marketplace。
- 單一一個 skill、想跨專案跟著自己走 → `claude plugin init` 的 skills 目錄 plugin 就夠，不必架 marketplace。
- skill 依賴特定 MCP server 才有意義 → 最適合 plugin，因為只有打包才能讓 MCP 設定跟著 skill 一起走。

Skill 該怎麼設計本身是另一門學問，見[Skills 設計主篇](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)；hook 的事件模型則在[Hooks 主篇](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide)。回到系列入口請看[Claude Code 怎麼運作](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)。

最後提醒安全面：plugin 與 marketplace 是高權限元件，能用你的使用者權限執行任意程式碼。官方原話是「Only install plugins and add marketplaces from sources you trust」——裝之前先看 `/plugin` 面板裡的 Will install 清單和 Context cost 估計，知道自己到底裝了什麼。

## 參考資料

- [Create plugins — Claude Code Docs](https://code.claude.com/docs/en/plugins) — plugin 結構、manifest 欄位、`${CLAUDE_PLUGIN_ROOT}`、quickstart 與遷移步驟
- [Discover and install prebuilt plugins — Claude Code Docs](https://code.claude.com/docs/en/discover-plugins) — marketplace 安裝流程、scope、團隊設定與安全警告
- [Create and distribute a plugin marketplace — Claude Code Docs](https://code.claude.com/docs/en/plugin-marketplaces) — `marketplace.json` schema、七種 plugin source、hosting 與版本解析
- [Constrain plugin dependency versions — Claude Code Docs](https://code.claude.com/docs/en/plugin-dependencies) — dependencies 宣告、semver 約束、git tag 解析慣例與跨 marketplace 白名單

## 更新紀錄

- 2026-08-26：初版，依 code.claude.com 官方文件撰寫（含 plugin dependencies 版本約束機制）。
