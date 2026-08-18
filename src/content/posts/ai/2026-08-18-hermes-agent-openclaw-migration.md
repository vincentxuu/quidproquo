---
title: "從 OpenClaw 搬到 Hermes Agent：搬得動的、搬不動的、還有那份封存目錄"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, openclaw, migration, claude-code, codex]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 10
tldr: "`hermes claw migrate` 會把 OpenClaw 的 persona、記憶、四個來源的技能、模型與供應商設定、平台 token 與審批白名單搬進 Hermes——但金鑰永遠不會靜默搬過去，連 `--preset full` 都要另外加 `--migrate-secrets`。搬不動的東西（cron、plugin、hook、多 agent 清單、複雜頻道設定）不會消失，而是丟進 `~/.hermes/migration/openclaw/<timestamp>/archive/` 等你手動處理。從 Claude Code 或 Codex 過來則是另一個指令 `hermes import-agent`。"
description: "OpenClaw 遷移到 Hermes Agent 的完整對照：設定鍵位映射、四個技能來源、API key 的四層解析、SecretRef 的三種格式、封存清單與遷移後的八步驗證。"
draft: false
---

系列第 10 篇，也是最後一篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

先重申[導讀](/posts/ai/2026-08-18-hermes-agent-intro)修正過的一件事：**Hermes 不是 OpenClaw 的繼承者**，兩者是不同團隊的專案，OpenClaw 仍在走自己的路。`hermes claw migrate` 是一條單向的搬家路徑，不是官方合併。想看 OpenClaw 本身，站內有[OpenClaw 文件導讀系列](/posts/ai/2026-03-28-openclaw-overview)。

## 三個指令，一個原則

```bash
hermes claw migrate                              # 一律先預覽，確認才動手
hermes claw migrate --dry-run                    # 只看不做
hermes claw migrate --preset full --migrate-secrets --yes   # 含金鑰、跳過確認
```

來源預設是 `~/.openclaw/`，而且會自動偵測舊名目錄 `~/.clawdbot/` 與 `~/.moltbot/`（含舊檔名 `clawdbot.json`、`moltbot.json`）。

貫穿整個流程的原則是**預覽優先**：任何寫入之前先印出完整計畫。同精神的還有預設會在 `~/.hermes/backups/pre-migration-*.zip` 寫一份還原點（`--no-backup` 可關），可以用 `hermes import` 還原。衝突預設是**拒絕套用**而不是覆蓋，要覆蓋得明確 `--overwrite`；技能衝突另有 `--skill-conflict skip|overwrite|rename`。

最該記住的一條：**沒有任何 preset 會靜默匯入祕密**。`--preset full` 也不會——要金鑰就得明確加 `--migrate-secrets`。這個設計對的地方在於，「全部搬過來」與「把我的 API key 複製到另一個工具的 .env」是兩個不同性質的決定，不該綁在同一個旗標上。

## 搬得動的

**Persona 與記憶**：`SOUL.md` 直接複製；`MEMORY.md` 與 `USER.md` 會被**解析成條目、與既有內容合併並去重**（用 `§` 分隔符），不是覆蓋；`workspace/memory/*.md` 的每日記憶檔全部併進主記憶。`AGENTS.md` 要指定 `--workspace-target` 才會落地。

工作區路徑會 fallback 找 `workspace.default/` 與 `workspace-main/`——因為 OpenClaw 近期把 `workspace/` 改名成 `workspace-main/`，多 agent 設定則是 `workspace-{agentId}`。

**技能有四個來源**，全部收進 `~/.hermes/skills/openclaw-imports/`：workspace 技能、`~/.openclaw/skills/` 的共享技能、`~/.agents/skills/` 的跨專案個人技能、`workspace/.agents/skills/` 的專案共享技能。**四個都會掃**，這點比多數遷移工具細。

**設定鍵位映射**是這份文件最有價值的部分，因為它等於一份兩個系統的概念對照表。幾條有趣的：

| OpenClaw | Hermes | 轉換 |
|---|---|---|
| `agents.defaults.timeoutSeconds` | `agent.max_turns` | **`timeoutSeconds / 10`，上限 200** |
| `agents.defaults.thinkingDefault` | `agent.reasoning_effort` | always／high／xhigh → high；auto／medium／adaptive → medium；off／low／none/minimal → low |
| `agents.defaults.compaction.mode` | `compression.enabled` | off → false，其餘 → true |
| `approvals.exec.mode` | `approvals.mode` | **auto → off**、always → manual、smart → smart |
| `exec-approvals.json` | `command_allowlist` | 樣式合併去重 |

第一列那個 `timeoutSeconds / 10` 特別值得留意：**兩個系統的資源模型根本不同**（一個以秒計時、一個以回合計數），這個換算是估算而非等價。遷移完該自己確認 `agent.max_turns` 是不是你要的值。

最後一列的 `auto → off` 也要看清楚：OpenClaw 的「自動」在 Hermes 語意下等於**關掉審批**。搬完之後如果你以為還有審批在保護你，那就錯了——建議照[安全那篇](/posts/ai/2026-08-18-hermes-agent-security)重設成 `smart`。

MCP server（含 `tools.include`／`exclude` 過濾）、TTS 設定（會從三個可能位置依優先序找）、瀏覽器 CDP 設定、session reset 政策、時區、human delay 也都有對應。

**平台 token 與白名單**會寫進 `~/.hermes/.env`：Telegram、Discord、Slack、Signal、Matrix、Mattermost 都支援 flat 與 accounts 兩種佈局；`allowFrom[]` 陣列會被逗號串成 `*_ALLOWED_USERS`。**WhatsApp 是例外**——它用 Baileys QR 配對而非 token，搬完必須重新 `hermes whatsapp` 配一次。

## 金鑰解析與 SecretRef

`--migrate-secrets` 開啟時，金鑰依序從四個來源收集：`openclaw.json` 的 `models.providers.*.apiKey` → `~/.openclaw/.env` → `openclaw.json` 的 `env` 子物件 → `agents/main/agent/auth-profiles.json`。前者優先，後者補洞。

而且**目標鍵有白名單**：`OPENROUTER_API_KEY`、`OPENAI_API_KEY`、`ANTHROPIC_API_KEY`、`DEEPSEEK_API_KEY`、`GEMINI_API_KEY`、`ZAI_API_KEY`、`MINIMAX_API_KEY`、`ELEVENLABS_API_KEY`、`TELEGRAM_BOT_TOKEN`、`VOICE_TOOLS_OPENAI_KEY`。**不在清單上的金鑰永遠不會被複製**——這比「全部搬過去」保守，也是對的方向。

OpenClaw 的 token 有三種寫法：純字串、環境變數模板 `${TELEGRAM_BOT_TOKEN}`、SecretRef 物件。前兩種與 `source: "env"` 的 SecretRef 解得開；**`source: "file"` 或 `source: "exec"` 的解不開**，遷移只會警告，要自己 `hermes config set` 補。這類東西最容易在搬完之後才發現壞掉。

## 搬不動的：全部進封存目錄

沒有直接對應的東西不會被丟掉，而是存到 `~/.hermes/migration/openclaw/<timestamp>/archive/` 等你手動處理：

| 東西 | 在 Hermes 怎麼重建 |
|---|---|
| `IDENTITY.md` | 併進 `SOUL.md` |
| `TOOLS.md` | Hermes 有內建的工具說明，不需要 |
| `HEARTBEAT.md` | 改用 cron job |
| `BOOTSTRAP.md` | 改用 context 檔案或技能 |
| **Cron job** | `hermes cron create` 重建 |
| **Plugin / hook / webhook** | 用 Hermes 的 plugin 與 gateway hook 重寫 |
| 記憶後端設定 | `hermes honcho` |
| **多 agent 清單** | 改用 Hermes profiles |
| 頻道綁定與複雜頻道設定 | 各平台手動設定 |

粗體那幾項是實務上工作量最大的。特別是 **cron job 不會自動搬**——如果你的 OpenClaw 上有一整套排程在跑，這是遷移的主要成本，而且它們在你重建之前是不會執行的（靜默地不執行）。多 agent 設定要改成 profile 也是概念上的重構而非搬運。

## 遷移後的八步驗證

官方列了清單，值得照著跑一次：

1. 看遷移報告（搬了幾項、跳過幾項、衝突幾項）
2. 檢查封存目錄——那裡的東西都需要人處理
3. **開一個新 session**——匯入的技能與記憶在當前 session 不生效
4. `hermes status` 確認供應商認證
5. 搬了平台 token 就重啟 gateway
6. `hermes config show` 確認 `session_reset` 符合預期
7. `hermes whatsapp` 重新配對
8. 全部確認沒問題後跑 `hermes claw cleanup`，把殘留的 OpenClaw 目錄改名成 `.pre-migration/`，**避免兩套狀態並存造成混淆**

第 8 步是我認為最容易被跳過、後果卻最煩的一步：兩個 agent 系統同時指著相似的狀態目錄，出問題時很難分辨是誰寫的。

## 從 Claude Code 或 Codex 過來是另一個指令

不是 `claw migrate`，是 `hermes import-agent`（會自動偵測 `~/.claude` 或 `~/.codex`）：

| Claude Code | Hermes |
|---|---|
| `CLAUDE.md` | 拆成 `MEMORY.md` 的記憶條目 |
| `settings.json` 的 `permissions.allow`（`Bash(...)`） | `command_allowlist` |
| `settings.json` 的 `permissions.deny`（`Bash(...)`） | **`approvals.deny`** |
| `~/.claude.json` 的 `mcpServers` | `mcp_servers` |
| `skills/<name>/` | `~/.hermes/skills/claude-code-imports/` |
| `commands/*.md` | **跳過**，附註建議你改寫成技能 |

`Bash(npm run test:*)` 這種前綴規則會轉成 `npm run test*` glob；非 `Bash` 的權限規則（`Read(...)`、`WebFetch`…）因為管的是 Claude 專屬工具，會被列為未映射而不是硬轉。

Codex 那邊則是 `AGENTS.md` 與 `memories/*.md` 進記憶、`config.toml` 的 `[mcp_servers.*]` 進 `mcp_servers`、技能進 `codex-imports/`。

兩者共通的一條規則值得記：**憑證永遠不匯入**。`~/.claude/.credentials.json` 與 `~/.codex/auth.json` 根本不會被讀取，MCP server 設定裡名字看起來像祕密的環境變數與 header（`*_TOKEN`、`*_API_KEY`、`Authorization`…）會被剝掉並列在報告裡，讓你自己決定要不要重新加。

## 系列到這裡

十篇走完，如果要把整個系列壓成三句話：

1. **Hermes 的差異化在學習迴路，而學習迴路的代價是不可重現性**——`write_approval` 是你買回可預測性的地方。
2. **它的預設值大多站在保守側**（gateway 全拒、cron 壞掉就停、plugin 不點名不跑、hardline 封鎖清單拿不掉），這是它敢讓 agent 常駐的基礎。
3. **會腐爛的是清單，不是判斷**——供應商、工具數、模型 ID 每個月都在變，該記住的是「訂閱扣哪一筆」「沙箱裡的檔案不會自己回來」「換到隔離後端就沒有人工審批」這類結構性的事。

本系列所有事實對照的是 2026 年 8 月的上游文件。要精確、當下的資訊，請以[官方文件站](https://hermes-agent.nousresearch.com/docs/)為準。

## 參考資料

- [Hermes Agent — Migrate from OpenClaw](https://hermes-agent.nousresearch.com/docs/guides/migrate-from-openclaw)
- [Hermes Agent — Import from Other Agents](https://hermes-agent.nousresearch.com/docs/user-guide/import-from-other-agents)
- [Hermes Agent 官方文件站](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [站內：OpenClaw 文件導讀系列](/posts/ai/2026-03-28-openclaw-overview)
