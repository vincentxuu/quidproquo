# Research: Antigravity CLI（Google Antigravity CLI / `agy`）

## 子問題
1. Antigravity CLI 是什麼？獨立 CLI 還是平台的一部分？官方定位。
2. 核心架構與功能：agent harness、subagents、sandbox、slash 指令、模型。
3. 安裝與使用：怎麼裝、平台、登入授權、設定檔。
4. 跟 Gemini CLI、Antigravity 2.0 / IDE 的關係。
5. 與競品（Claude Code、Gemini CLI、Codex CLI）的差異。
6. 限制／已知問題／定價／供應狀況。

## 來源清單
- [An important update: Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) — 官方 Google Developers Blog；2026-05-19。訪問日：2026-05-21
- [Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli) — 官方產品 blog；2026-05-19
- [Antigravity CLI Overview](https://antigravity.google/docs/cli-overview) — 官方文件
- [Getting Started with Antigravity CLI](https://antigravity.google/docs/cli-getting-started) — 官方文件（安裝/認證）
- [Using AGY CLI](https://antigravity.google/docs/cli-using) — 官方文件（設定/快捷鍵）
- [Antigravity CLI Features](https://antigravity.google/docs/cli-features) — 官方文件（plugins / sandbox / subagents / slash 指令）
- [Google Antigravity Documentation home](https://antigravity.google/docs/home) — 官方四介面總覽
- [Antigravity CLI Deep Dive (agentpedia.codes / 原 antigravity.codes)](https://antigravity.codes/blog/antigravity-cli-deep-dive) — 高品質二手；交叉驗證
- [Getting Started with Google Antigravity (codelab)](https://codelabs.developers.google.com/getting-started-google-antigravity) — 官方 codelab
- [Augment: Google Antigravity vs Gemini CLI](https://www.augmentcode.com/tools/google-antigravity-vs-gemini-cli) — 二手比較

## 事實交叉表
| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 2026-05-19 在 Google I/O 2026 發表 | 官方 dev blog | agentpedia deep-dive / YouTube | ✅ |
| 用 Go 寫（Gemini CLI 是 Node） | 官方 dev blog | agentpedia deep-dive | ✅ |
| 二進位檔名 `agy` | 官方 codelab | agentpedia / YouTube | ✅ |
| 與 Antigravity 2.0 共用同一 agent harness | 官方 cli blog / overview | agentpedia | ✅ |
| 四介面平台：2.0 / CLI / SDK / IDE | 官方 docs home | DeepMind 推文 / agentpedia | ✅ |
| Gemini CLI 個人層 2026-06-18 停止服務 | 官方 dev blog | agentpedia | ✅ |
| 企業（Code Assist Standard/Enterprise、付費 API key）Gemini CLI 不受影響 | 官方 dev blog | agentpedia | ✅ |
| 安裝：curl\|bash / PowerShell irm / CMD | 官方 getting-started | agentpedia | ✅ |
| 認證：系統 keyring + Google 登入 fallback；SSH-aware；`/logout` | 官方 getting-started | agentpedia | ✅ |
| 設定檔 `~/.gemini/antigravity-cli/settings.json` | 官方 cli-using | 官方 features | ✅ |
| Terminal Sandbox：nsjail / sandbox-exec / AppContainer，預設 false | 官方 features | （單源） | ⚠️ 細節單源（官方） |
| 非同步 subagents、背景平行任務、`/agents` 面板、fast-path `ctrl+k` | 官方 features | agentpedia | ✅ |
| plugins（原 extensions）；`agy plugin import gemini` 遷移 | 官方 features | agentpedia | ✅ |
| 支援 skills / hooks / MCP（remote 用 `serverUrl`） | 官方 features | agentpedia | ✅ |
| context 檔 `GEMINI.md` / `AGENTS.md` 沿用 | agentpedia（引官方 docs） | （單源） | ⚠️ unverified |
| 模型用 Gemini 3.x 系列、`/model` 可選 reasoning model | 官方 features（/model）/ Augment | agentpedia（Gemini 3.5 Flash） | ⚠️ 具體型號不一，CLI 不宣稱 Claude |
| 公開 repo `github.com/google-antigravity/antigravity-cli` | 官方 dev blog（forum 連結） | agentpedia | ✅ |

## 草稿骨架

### 核心概念
Antigravity CLI 是 Google Antigravity「四介面平台」(Antigravity 2.0 桌面 app / CLI / SDK / IDE) 的終端機 (TUI) 介面。它不是新的 model 或精簡 agent——跑的是和 Antigravity 2.0「同一套 agent harness」,只是換成 keyboard-first、低開銷的終端呈現。定位：給 SSH/remote、tmux、討厭 GUI 的人。它同時是 Gemini CLI 的「接班人」(個人層),不是升級而是平行新產品。

### 關鍵設計決定
- 統一 harness：改善一次、四介面同步拿到，不用各自 backport。
- Go 重寫(Gemini CLI 是 Node):啟動快、記憶體低。
- SSH 一等公民:偵測 SSH session、印授權 URL。
- 非同步 subagents:大型 refactor / 多主題研究丟背景跑,不卡 shell。
- 設定/權限與 2.0 雙向同步;對話可匯出到 2.0。

### 跟替代方案的比較
- vs Gemini CLI:同源接班,但 binary(`agy`)、檔案結構、指令面重做;個人層 6/18 sunset。
- vs Claude Code / Codex CLI:差異化在「TUI 是大平台的一個 surface、共用 harness、原生非同步 subagents、SSH-first」。(避免對競品內部過度斷言)

### 適合 / 不適合
- 適合:Gemini CLI 個人層用戶、remote/tmux、要 subagents 平行、要跨 surface 帶 MCP/skill/hook。
- 不適合:Code Assist Standard/Enterprise、付費 API key(Gemini CLI 續用)、靠 artifact 預覽/視覺 diff/語音(用 2.0)、依賴尚未移植的 Gemini CLI 週邊功能。

### 限制 / 已知問題
- 非 1:1 功能對等(官方明說);custom theme 不遷移;沒有 `skills` 終端管理指令。
- AI agent 安全風險(自動執行/資料外洩/prompt injection/供應鏈);消費層預設收集互動資料、可關。
- 早期 Antigravity(IDE)有配額鎖、崩潰回報(二手)。

### 取捨總結
用一個共用 harness 換速度與一致性;CLI 故意「不當 GUI」。Gemini CLI 個人層用戶基本上被推著遷移。

## 待解問題
- CLI 端確切支援哪些模型(Claude 是否可選,還是僅 IDE)?官方 CLI 文件未明列。
- `GEMINI.md`/`AGENTS.md` context 檔沿用僅二手確認。
