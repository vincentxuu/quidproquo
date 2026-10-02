---
title: "工具推薦｜skillmem — 讓 Agent 學到的「做法」會強化、也會遺忘"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "skillmem 是一個本機優先的 MCP 記憶體伺服器，但存的不是事實而是「做法」：agent 學到的技能會依實測證據增強、依 Ebbinghaus 曲線遺忘，且對匯入的記憶內建 prompt injection 防線"
tldr: "skillmem 是一個 MCP server，讓 Claude Code / Codex 等 coding agent 擁有本機、可增強也會遺忘的「技能記憶」。安裝：`pip install 'skillmem[semantic]'` 後 `skillmem init --claude-code`。解決了現有記憶體工具「什麼都往裡存、agent 自己說有用就採信」的問題——skillmem 只有外部證據（測試通過、diff 被接受）才能提升技能強度，未經你核可的記憶會被標記為「資料而非指令」。"
series:
  name: "AI Tool of the Day"
  order: 40
---

> 🌏 [English version](/en/posts/daily/2026-09-30-tool-skillmem-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | skillmem |
| 類型 | MCP server（另附 CLI） |
| GitHub | [liza-studio/skillmem](https://github.com/liza-studio/skillmem) |
| Stars | 6（2026-08-30 建立，仍是早期專案） |
| 語言 | Python |
| 授權 | Apache-2.0 |
| 安裝 | `pip install 'skillmem[semantic]'` |

## 解決什麼問題

quidproquo 過去一個月已經推薦過三個「本機、免 API key」的 agent 記憶體工具——mcp-memory（OKF Markdown 格式）、localmem-mcp（recall 完全不叫 LLM）、okf-agent-memory（Git-native、可 code review）。它們解決的都是同一層問題：記憶存在哪裡、用什麼格式索引。

skillmem 打的是不同的層：**存什麼、什麼時候該信、什麼時候該忘**。它存的不是「使用者偏好」這類事實，而是「trigger → steps → outcome → lessons」這種可重複使用的做法。更關鍵的是強化機制——agent 自己說「這個技能幫上忙了」不會提升強度，只有測試通過、diff 被接受、你親口確認這類「agent 自己判斷之外的證據」才算數。久未被用到的技能會依 Ebbinghaus 遺忘曲線衰退、被封存（不是刪除，會備份），逼近人類記憶的運作方式。

第三個差異是它把「記憶」和「規則」分開看待：每筆記憶都標記來源（owner / agent / imported / derived），只有你本人在終端機執行 `skillmem trust` 才能把一筆記憶升格成規則；沒被核可的一律用明確標記包起來，告訴 agent「這是資料，不是指令」——這是直接針對「文件把 agent 騙去存一條規則、下次又被當成你的話讀出來」這種注入路徑設計的防線,而不是三個月前那幾篇記憶體文章沒處理過的角度。

適合場景：長期用同一個 coding agent 跑重複性高的維運/除錯任務，想讓「上次怎麼修好的」自動被下次任務用上，同時不想要一個信任邊界模糊、什麼都照單全收的記憶體。

## 快速上手

### 安裝

```bash
# macOS / Linux
pip install 'skillmem[semantic]'   # 或 uv tool install 'skillmem[semantic]'
skillmem doctor                     # 首次執行下載本機 embedding 模型（約 220 MB）
skillmem init --claude-code         # 把 MCP server 和 hooks 接進 Claude Code
```

Windows 用 PowerShell 跑 `install.ps1`；也支援 `--codex`、`--cursor`、`--windsurf`、`--gemini`、`--opencode`，多個 flag 可以一次下，讓多個 agent 共用同一份資料庫。

### 基本用法

安裝後 Claude Code 會自動掛上 9 個 `mem_*` MCP 工具，agent 通常自己會用：

```bash
# agent 在完成一個花了力氣除錯的任務後會呼叫：
skillmem learn fix-flaky-ci -t "CI 間歇性失敗" \
  --trigger "pytest 在 CI 上偶發 timeout" \
  --steps "加大 fixture 的 timeout，確認是 DB 連線池耗盡" \
  --outcome success

# 下一次遇到類似任務前，agent（或你）用 recall 找出相關做法：
skillmem recall "CI 測試偶爾 timeout 怎麼修"
```

### 進階用法

```bash
# 只有「外部證據」能提升技能強度——例如測試真的通過了
skillmem reinforce fix-flaky-ci --outcome success

# 把一筆記憶升格成你信任的規則（只能在終端機跑，agent 從 Bash 呼叫會被拒絕）
skillmem trust fix-flaky-ci

# 匯入別人分享的技能包，但它們預設不被信任，來源會全程留痕
skillmem skills add DietrichGebert/ponytail
skillmem skills ls   # 看每個技能的強度、確認次數、失敗次數
```

## 與現有工具的比較

| | skillmem | mcp-memory / okf-agent-memory | localmem-mcp |
|---|---|---|---|
| 存的是什麼 | 做法（procedure） | 事實 / 決策記錄 | 事實 |
| 強度會因誰的話而變 | 只有外部證據（測試、diff、你的確認） | 無強化機制 | 無強化機制 |
| 主動遺忘 | 有（Ebbinghaus 排程，可封存還原） | 無 | 無 |
| 對匯入內容的信任邊界 | 明確分級（owner/agent/imported/derived），未核可內容標記為資料 | 無區分 | 無區分 |
| 竄改偵測 | SHA256 hash-chain，`skillmem verify` | 無 | 無 |
| 多 agent 共用一份記憶 | 支援（Claude Code + Codex + 4 種其他 agent） | 部分支援 | 部分支援 |

## 注意事項

- **專案還很新**：2026-08-30 才建立，GitHub 只有 6 顆星，issue 也才 2 個——本質上是個人專案的早期版本，能用但還沒有大規模生產環境驗證。
- **owner-only 指令不是真的牆**：README 自己寫得很清楚，`trust`、`rm` 這類指令雖然檢查是否在終端機執行，但用 `script` 偽造一個 TTY 就能繞過；deny rule 也只是字串比對，指令裡塞個反引號或改個大小寫組合就可能繞過。如果你讓 agent 無人值守跑 Bash，不要依賴這層防護。
- **semantic 功能要下載 220MB 模型**：只裝 BM25 全文搜尋可以跳過這步，但跨語言（例如中文查詢找到英文技能）的能力就沒了。
- **`session-recap` hook 呼叫 `claude -p`**：即使限制了呼叫頻率（預設 600 秒一次）跟拿掉所有工具，這仍然是每個 session 結束時多一次 LLM 呼叫，有相應的延遲和 token 成本。

## 今日收穫

過去看到的 agent 記憶體工具幾乎都在比拼「存取速度」和「格式相不相容」，skillmem 提醒了一件更基本的事：記憶體工具的風險不是存不下東西，而是**存錯東西又被無條件採信**——一份被注入的文件讓 agent 自己「學會」一條假規則，下次就會被當成你说的話執行。把「這是誰說的」和「這值不值得信」拆成兩個獨立的欄位，比任何檢索演算法都更決定這類工具到底安不安全。

## 參考資料

- [liza-studio/skillmem — GitHub](https://github.com/liza-studio/skillmem)
- [skillmem CHANGELOG（0.9.0–0.10.0 的變更與已知問題）](https://github.com/liza-studio/skillmem/blob/main/CHANGELOG.md)
- [skillmem INVARIANTS（16 條測試中的不變量規格）](https://github.com/liza-studio/skillmem/blob/main/docs/INVARIANTS.md)
- [We wrote down 16 promises our MCP server makes, then two models spent ten days trying to break them — DEV Community](https://dev.to/sergey_petrukovich_c94a17/we-wrote-down-16-promises-our-mcp-server-makes-then-two-models-spent-ten-days-trying-to-break-them-42f9)
- [GitHub API：liza-studio/skillmem repository metadata](https://api.github.com/repos/liza-studio/skillmem)
