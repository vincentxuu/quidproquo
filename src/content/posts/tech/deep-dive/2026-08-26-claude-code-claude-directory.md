---
title: "Claude Code 的 .claude 目錄導覽：settings、rules、skills 到 auto memory 各檔職責"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, claude-directory, settings-json, auto-memory, anthropic]
lang: zh-TW
tldr: "Claude Code 的設定分散在專案 `.claude/` 與家目錄 `~/.claude/` 兩層，共 20 多個檔案位置。關鍵分野只有兩條：settings 是跨層合併的強制設定，CLAUDE.md 和 rules 是串接進 context 的指引；committed、gitignored、Claude 自寫三種身分各不相同。"
description: "逐檔導覽 Claude Code 專案與全域兩層目錄：CLAUDE.md、settings.json、rules、skills、commands、agents、workflows、auto memory 的職責與優先序。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 2
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en)

用 Claude Code 用到第二週，你會發現專案根目錄和家目錄都長出了奇怪的東西：`.claude/settings.local.json`、`~/.claude.json`、`~/.claude/projects/` 底下一堆不記得誰寫的 markdown。這篇把 Anthropic 官方文件裡最常需要理解的兩層目錄講清楚——每個檔是誰寫的、該不該 commit、跟其他檔誰覆蓋誰；plugin cache、transcript、snapshot、debug log 這類應用程式資料只點到為止。這是[上一篇 agentic loop](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) 之後最值得先搞懂的一篇，因為系列後面所有擴充機制的檔案都落在這張地圖上。

## 先記住兩條心智模型

整個目錄體系只有兩條規則在運作：

**第一條：強制設定和指引是兩種東西。** `settings.json` 裡的 permissions、hooks 是**強制**（enforced）——不管 Claude 讀懂讀不懂都會被執行。CLAUDE.md 和 rules 是**指引**（guidance）——串接進 context 給模型看，模型可能照做也可能沒照做。想要保證發生的行為，放 settings 或 hooks；想要 Claude 有背景知識，放 CLAUDE.md。

**第二條：settings 靠優先序與合併，CLAUDE.md 靠串接。** 常見 settings file 的優先序是 managed、命令列、project local、project shared、user；清單型 key（如 `permissions.allow`）通常跨層級合併，純值型 key（如 `model`）通常由較高優先序勝出。但環境變數是逐 key 判斷，有些 model 清單也不照普通 array 合併。CLAUDE.md 則是每一層**全部載入進 context**——不是繼承覆蓋，全域和專案的內容會同時在場，衝突時靠指示寫清楚優先序。

## 專案這一層

### 根目錄三個檔

- **`CLAUDE.md`／`.claude/CLAUDE.md`**（committed）：專案指示，每個 session 開頭載入。官方建議抓在 200 行以內——超長還是會完整載入，但遵循度會掉。只對特定任務重要的內容，移去 skill 或 path-scoped rule。session 內用 `/memory` 就能編輯。
- **`CLAUDE.local.md`**（gitignored）：你個人在這個專案的私有指示，和 CLAUDE.md 一起載入；適合 sandbox URL、偏好測試資料這類不該 commit 的內容。
- **`.mcp.json`**（committed，放在根目錄而非 `.claude/` 裡）：團隊共用的 MCP servers。secret 用 `${ENV_VAR}` 引用環境變數，token 不會落進檔案。
- **`.worktreeinclude`**：Claude 開 git worktree 時要複製過去的 gitignored 檔案清單（典型是 `.env`），語法同 `.gitignore`。

### `.claude/` 資料夾

| 檔／資料夾 | 身分 | 職責 |
|---|---|---|
| `settings.json` | committed | 強制設定：permissions、hooks、statusLine、model、env |
| `settings.local.json` | gitignored | 你個人在這個專案的覆蓋值；user-editable 層級裡最高 |
| `rules/` | committed | 主題拆分的指示檔，frontmatter 寫 `paths:` 就只在碰到符合的檔案時載入 |
| `skills/` | committed | 一個資料夾一份 SKILL.md，可附帶參考文件與腳本 |
| `commands/` | committed | 單檔 prompt；現在和 skills 同機制，同名時 skill 優先 |
| `agents/` | committed | subagent 定義，各自的 context window 與 `tools:` 白名單 |
| `workflows/` | committed | dynamic workflow 腳本，從 `/workflows` 存下來的 |
| `agent-memory/` | committed | 設了 `memory: project` 的 subagent 自己的 MEMORY.md |

幾個容易誤解的地方：

- **`settings.local.json` 不是手動加進 `.gitignore` 的**——Claude Code 第一次存設定到這個檔時，會自動把它加進你的全域 git excludes。要讓隊友也忽略它，還是要另外寫進專案 `.gitignore`。
- **rules 的價值在條件載入**。沒有 `paths:` 的 rule 跟 CLAUDE.md 一樣每個 session 都載；有 `paths:` 的只在 Claude 讀到符合 glob 的檔案時才進 context。測試慣例只對測試檔有意義，就別讓它佔用每個 session。CLAUDE.md 接近 200 行時，官方建議開始往 rules 拆。
- **新需求一律寫 skill 不寫 command**。command 還支援，但 skill 能打包輔助檔案，Claude 也知道 skill 目錄路徑，可以按需讀取附帶的 checklist 和腳本。
- `agent-memory/` 只為設了 `memory:` frontmatter 的 subagent 建立；`memory: local` 會改寫到 `.claude/agent-memory-local/`（不入版控），跨專案則寫到 `~/.claude/agent-memory/`。

## 家目錄這一層

家目錄有兩個容易搞混的入口：`~/.claude.json`（單一檔案）和 `~/.claude/`（資料夾）。

**`~/.claude.json` 是應用程式狀態，不是設定檔。** 主題偏好、OAuth session、每個專案的 trust 決定、你個人的 MCP servers、IDE 開關都在這裡，大部分透過 `/config` 管理，不需要直接編輯。注意 MCP server 三種 scope 的分流：團隊共用放專案 `.mcp.json`，個人跨專案放這裡（`claude mcp add --scope user`）。

**`~/.claude/` 才是你個人的全域設定資料夾**，結構幾乎是專案 `.claude/` 的鏡像，差在全部不入版控：

| 檔／資料夾 | 職責 |
|---|---|
| `CLAUDE.md` | 個人偏好，與專案 CLAUDE.md 同時載入；專案指示讀得較晚，但衝突時仍要明寫優先序 |
| `settings.json` | 所有專案的預設值；key 撞在一起時專案層覆蓋 |
| `keybindings.json` | 自訂快捷鍵，存檔即熱載入；Ctrl+C/Ctrl+D/Ctrl+M/Caps Lock 保留不可綁 |
| `themes/` | `/theme` 建的自訂配色 |
| `projects/<project>/memory/` | **auto memory**，下面細講 |
| 其餘 `rules/`、`skills/`、`commands/`、`output-styles/`、`agents/`、`workflows/` | 全域版，任何專案都能用 |

### Auto memory：Claude 寫給自己的筆記

`~/.claude/projects/<project>/memory/` 是一區「你不一定要寫、Claude 會自己維護」的內容。它適合記下你反覆修正過的偏好、你確認過的做法、程式碼或 git history 推不出來的專案決策，以及 issue tracker、dashboard 這類外部參考在哪裡。相反地，官方文件明說它會跳過能從 codebase 推出的資訊，例如架構、檔案路徑和 debug fix。`MEMORY.md` 是索引，每個 session 開頭載入前 200 行或 25KB；太長的主題會拆成 topic 檔，任務相關時才讀。預設開啟，`/memory` 可切換。這些就是純文字 markdown，你可以改可以刪，但 Claude 之後還是會繼續更新它。

## 快速診斷

設定了卻沒生效，先跑三個指令：`/memory` 看 CLAUDE.md 載了什麼、`/doctor` 做整套健檢、`/context` 看什麼吃掉了空間。troubleshooting 的完整流程之後歸 H 叢集。

## 學到的事

判斷「某個東西該放哪」只需要問三個問題：要**保證**生效還是給**背景**？（settings/hooks vs CLAUDE.md/rules）要**分享**給團隊還是自己用？（committed 檔 vs `local`/家目錄）要**每次載入**還是**用到才載**？（CLAUDE.md vs rules/skills）。20 多個落點，其實是三個二選一的組合。

## 參考資料

- [Explore the .claude directory — Claude Code Docs](https://code.claude.com/docs/en/claude-directory) — 官方逐檔導覽，本文兩層目錄結構、badge 分類與合併規則的主要依據
- [Memory — Claude Code Docs](https://code.claude.com/docs/en/memory) — CLAUDE.md、`.claude/CLAUDE.md`、`CLAUDE.local.md`、rules 與 auto memory 的官方說明
- [Settings — Claude Code Docs](https://code.claude.com/docs/en/settings) — settings file scope、優先序、環境變數與 list merge caveat
- [Skills — Claude Code Docs](https://code.claude.com/docs/en/skills) — skills 與 commands 的位置、命名衝突和按需載入
- [Worktrees — Claude Code Docs](https://code.claude.com/docs/en/worktrees) — `.worktreeinclude` 與 worktree 隔離的官方說明
- [Debug your configuration — Claude Code Docs](https://code.claude.com/docs/en/debug-your-config) — `/doctor`、`/hooks`、`/mcp` 等診斷指令的官方說明

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（commands 已與 skills 合併為同一機制）。
