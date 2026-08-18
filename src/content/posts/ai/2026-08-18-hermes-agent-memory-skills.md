---
title: "Hermes Agent 的記憶與技能：一個會自己改自己的系統，以及你能在哪裡插手"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, memory, skills, self-improvement, agentskills, curator]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 6
tldr: "Hermes 的記憶是硬上限的：MEMORY.md 2,200 字元、USER.md 1,375 字元，寫爆不會自動壓縮而是回錯誤讓 agent 自己騰位子。技能則由 curator 背景維護，預設 7 天跑一次、只在閒置 2 小時後啟動，30 天未用標 stale、90 天封存——但從不刪除。真正該打開的開關是 `memory.write_approval` 與 `skills.write_approval`，它們把背景自我改進的寫入變成待審。"
description: "拆解 Hermes Agent 的記憶與技能系統：字元上限與凍結快照、session search 與記憶的分工、寫入審批與暫存流程、curator 的狀態機與預設值，以及 Skills Hub 與 agentskills.io 標準。"
draft: false
---

系列第 6 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

這是 Hermes 押注最重的一層，也是唯一一個「你不設定就會有東西自己動」的地方。理解它最好的方式是把它拆成三個容器：**小而永遠在場的記憶**、**大而按需載入的技能**、**無限但要主動查的歷史**。

## 記憶：小到你會意外的硬上限

| 檔案 | 用途 | 字元上限 |
|---|---|---|
| `MEMORY.md` | agent 自己的筆記：環境事實、慣例、學到的事 | 2,200 字元（約 800 token） |
| `USER.md` | 使用者輪廓：偏好、溝通風格、期待 | 1,375 字元（約 500 token） |

兩個檔案都在 `~/.hermes/memories/`，加起來約 1,300 token。這個上限是設計，不是限制——官方明講 "Character limits keep memory focused"。

三個行為要記住：

**不會自動壓縮。** 寫入會超過上限時，`memory` 工具直接回錯誤，agent 必須在同一個回合裡自己整併或刪掉舊條目再重試。`replace` 也受同一個限制——把短條目換成長條目照樣會爆。

**是凍結快照。** 記憶在 session 開始時載入並注入 system prompt，**整個 session 都不會變**。agent 中途新增的記憶會立刻寫到磁碟，但要到下一個 session 才會出現在 system prompt 裡。這是刻意的：保住 LLM 的前綴快取（跟[供應商那篇](/posts/ai/2026-08-18-hermes-agent-providers)提的一小時 prompt cache 是同一套算盤）。工具回應則永遠給你即時狀態。

**會被安全掃描擋。** 記憶條目寫入前會掃 prompt injection、憑證外洩、SSH 後門等模式，含隱形 Unicode 字元的內容直接封鎖。理由很硬：這些字串會進 system prompt。

還有一條寫在 caution 裡、實務上很容易犯的錯：**不要讓兩個 agent 行程指向同一個 Hermes home**。記憶寫入是自動的，兩個寫入者會把彼此的條目疊成一份誰都沒寫過的狀態。要多 agent 就給各自的 profile，需要共享記憶則用外部 memory provider。

## 記憶 vs session 檢索：兩種完全不同的成本結構

官方這張對照表值得整張搬過來，因為它解釋了為什麼記憶要這麼小：

| | 持久記憶 | Session 檢索 |
|---|---|---|
| 容量 | 約 1,300 token | 無限（所有 session） |
| 速度 | 即時（已在 system prompt 裡） | FTS5 查詢約 20ms、翻頁約 1ms |
| 成本 | **每次 prompt 都付這些 token** | 免費，不打 LLM |
| 管理 | agent 手動策展 | 自動，全部存起來 |

所有 CLI 與訊息平台的 session 都存在 `~/.hermes/state.db`，用 SQLite FTS5 全文檢索。`session_search` 回傳的是資料庫裡的原始訊息——**沒有 LLM 摘要、沒有截斷**，agent 還能在找到的 session 裡前後捲動。

判準因此很清楚：**「永遠要在場的關鍵事實」放記憶，「上週我們是不是討論過 X」交給檢索**。把後者硬塞進記憶只會擠掉真正重要的東西。

## 技能：按需載入的程序性記憶

技能是 `~/.hermes/skills/` 底下的 SKILL.md 文件，採**漸進揭露**——平常只有名稱與簡述在 context 裡，用到才載入全文。格式相容 [agentskills.io](https://agentskills.io/specification) 開放標準。每個安裝好的技能自動變成 slash command，`/plan`、`/github-pr-workflow` 這樣叫，一則訊息最多可以疊五個。

agent 自己則透過 `skill_manage` 工具管理技能：`create`、`patch`（官方偏好，因為只傳改動文字比較省 token）、`edit`、`delete`、`write_file`、`remove_file`。系統提示會要求它在「解出一個值得重複的多步流程」「踩到錯誤後找到可行路徑」「被使用者糾正」時把過程存成技能。

想要一個乾淨的 profile：安裝時 `bash -s -- --no-skills`，或 `hermes profile create research --no-skills`，或事後 `hermes skills opt-out`。這會寫一個 `.no-bundled-skills` 標記，讓 installer 與每次 `hermes update` 都跳過內建技能播種。`--remove` 只會刪**未經修改**的內建技能，你改過的、從 hub 裝的、自己寫的一律保留。

Skills Hub（`hermes skills browse` / `search` / `inspect` / `install`）可以從線上註冊表、`skills.sh` 與官方選配目錄安裝，**安裝時會跑安全掃描**。

## 兩個你應該認真考慮打開的開關

預設情況下，agent 寫記憶與寫技能都是自由的——**包括每回合結束後跑的背景自我改進審查**。這正是「agent 會自己改自己」的具體位置。

```yaml
memory:
  write_approval: true
skills:
  write_approval: true
```

打開之後行為不同：記憶在互動式 CLI 是**行內詢問**（條目小到可以完整讀完），其他場合（訊息平台、腳本、背景審查）一律**暫存**待審；技能則因為 SKILL.md 太大無法行內閱讀，**一律暫存**，暫存檔在 `~/.hermes/pending/skills/`，重啟不會消失。

審查流程對稱：

```
/memory pending | /memory approve <id> | /memory reject <id>
/skills pending | /skills diff <id> | /skills approve <id> | /skills reject <id>
```

官方對 `memory.write_approval` 的定位講得很直白——這是「agent 記了一件關於我的錯誤假設」的解法。我會加一句：**如果你打算讓 Hermes 常駐並接訊息平台，這兩個開關預設就該是開的**，因為那些情境下沒有人在看行內提示。

另外別把 `skills.guard_agent_created` 跟審批搞混：**那是內容掃描器（危險模式啟發式），不是審批閘門**，兩者獨立。

背景審查的可見度則由 `display.memory_notifications` 控制：`off`（照樣寫，只是不告訴你）、`on`（預設，顯示 `💾 Memory updated`）、`verbose`（附上改了什麼的預覽）。注意 `off` 不等於關掉——**它只關掉通知，寫入照常發生**。

## Curator：技能不會無限長大的原因

自動生技能的必然後果是技能爆炸。Curator 是專治這件事的背景維護：追蹤每個技能被查看／使用／修補的頻率，把長期沒用的推過 `active → stale → archived`，並定期用 auxiliary model 做一次審查提出整併。

觸發條件不是 cron，而是閒置檢查——**距上次執行超過 `interval_hours`（預設 7 天）且 agent 已閒置超過 `min_idle_hours`（預設 2 小時）**才會 fork 一個背景 AIAgent 跑，且跑在自己的 prompt cache 裡，不碰你正在進行的對話。

一次執行分兩段：

1. **確定性轉換（不打 LLM）**：30 天未用標 `stale`、90 天未用移到 `~/.hermes/skills/.archive/`。
2. **LLM 整併**：**預設關閉**。開啟（`curator.consolidate: true`）後會做傘狀合併與改寫，官方直言一次完整整併通常要 50–100 次 API 呼叫。

幾個設計得很細膩的保護，值得抄進自己的系統：

- **從不自動刪除**，最壞情況是封存到 `.archive/`，可還原。
- **被釘選的技能，以及任何 cron job 引用到的技能（含暫停中的），完全跳過**——不然一個暫停中的排程會被它引用的技能從腳下抽走。
- **從未使用過的技能有寬限期**：`use_count == 0` 的技能在滿 `stale_after_days` 天之前不封存。官方的理由一句話說完——「零次使用是證據缺席，不是它可丟的證明」。
- **首次安裝不會立刻跑**：第一次觀察只是把 `last_run_at` 設成現在，把第一次真正執行往後推一整個週期，給你時間先審過技能庫或退出。想預覽就 `hermes curator run --dry-run`。

想看 agent 到底學了什麼，`hermes journey`（或 `/journey`）會把技能與記憶條目按時間排成一條學習時間線，並支援 `list` / `delete` / `edit` ——**刪技能是封存可還原，刪記憶條目是真的移除**。

## 這一層的判斷

自我改進不是一個開關，是四五個各自可調的機制，而它們的預設值全部偏向「自動」。這對個人筆電上的探索性使用是對的預設；一旦這個 agent 開始接訊息平台、跑排程、動你的檔案，**把 `write_approval` 打開、把 curator 的 dry-run 跑一次**，你才知道它一週學了什麼。

下一篇談[工具、MCP 與 plugin](/posts/ai/2026-08-18-hermes-agent-tools-plugins)——包含把 3,300 個 MCP 工具塞進 context 的那個問題怎麼解。

## 參考資料

- [Hermes Agent — Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Hermes Agent — Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Hermes Agent — Memory Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
- [agentskills.io — 技能規格](https://agentskills.io/specification)
- [Honcho](https://honcho.dev/)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
