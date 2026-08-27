# claude.ai「Customize」設定區實際操作紀錄（2026-08-27）

來源：Playwright 登入 vincent（Max 方案）帳號，開 https://claude.ai/customize，逐一點開各分頁與按鈕。
**只讀不改**：沒有安裝／上傳／刪除任何 skill、connector、plugin，沒有切換任何 memory 開關。

## 入口與結構

- `https://claude.ai/customize` 不是獨立頁面，會轉址到 `https://claude.ai/new#settings/customize-skills`——
  也就是 Settings 對話框（modal）裡的一個分區。側欄 Code 模式的「Customize」連結同樣指到這裡。
- Settings 左側導覽分兩段：General／Account／Privacy／Billing／Usage／Capabilities／Claude Code／Cowork／
  Claude in Chrome，以及 **Customize：Skills／Connectors／Plugins／Memory**（實際是四個，不是三個）。
- hash 對應：`#settings/customize-skills`、`#settings/customize-plugins`、`#settings/memory`；
  點進單一 skill 是 `#settings/customize-skills/<name>`，單一 memory 是 `#settings/memory/mem_…`。
  但**只改 hash 不會切換分頁**，得點左側項目（自動化時要先 goto `/new` 再 goto 帶 hash 的網址）。
- 首次開啟會疊一層「Save preferences／Not now」提示（Fable 5 納入 Max 方案的公告），會擋住底下所有點擊。

## 1. Skills

- 表格欄位：Skill／Last updated／Author。本帳號目前 3 個，皆 Anthropic、8/26/26：
  `import-memory`、`morning`、`skill-creator`。
- 空狀態文案：「Add skills to extend Claude's capabilities.」＋ Add skill／Learn more。
- **Browse** → 開「Directory」對話框（三個 tab：Skills／Connectors／Plugins 共用），Skills tab 有
  Anthropic 篩選、Filter by／Sort by。看到的官方 skill 與安裝數：
  skill-creator 148K、morning 11.1K、import-memory 1.6K、canvas-design 1.9M、web-artifacts-builder 1.2M、
  mcp-builder 1M、learn 985.8K、theme-factory 977K、brand-guidelines 875.3K…（列表繼續往下）。
  每個卡片＝`/名稱`、作者、安裝數、完整 description（即 SKILL.md frontmatter description）。
- **Add** 下拉三項：**Upload skill／Create a skill／Create with Claude**。
- 點單一 skill（例 skill-creator）→ 詳情頁：by Anthropic、description、**SKILL.md 原文可讀**、
  標示「18 files」。skill-creator 的 SKILL.md 內容即 Claude Code 端同名 skill 的內容
  （建 skill → 草稿 → 測試 prompt → eval-viewer → 迭代 → description improver）。

## 2. Connectors

- 上方「Popular」快捷：Slack／Notion／Microsoft 365（依已連狀態變動，第一次看到 Slack／Microsoft 365／Atlassian）。
- 篩選：All／Connected／Not connected。表格欄位：Connector／Type／Status。
- 本帳號 13 個，Type 幾乎都是「Web · Custom」（GitHub Integration 只有 Web）：
  Slack（**Reconnect**，其餘 Connected）、Asana、Cloudflare Developer Platform、GitHub Integration、Gmail、
  Google Calendar、Google Drive、HyperFrames by HeyGen、Mermaid Chart、Notion、PostHog、Sentry、tldraw。
- **Add** 下拉兩項：**Browse connectors／Add custom connector**。
- 這份清單就是 Routines 建立表單預設全掛上的來源（見
  `.research/2026-08-27-claude-code-routines-web-ui-walkthrough.md` 的 connector 時序問題）。

## 3. Plugins

- 本帳號無 plugin。文案：「Give Claude role-level expertise with plugins」＋ Browse plugins。
- **Browse** → Directory 的 Plugins tab，篩選多一個 **Partners**（Skills tab 只有 Anthropic）。
  官方 plugin 與安裝數：Productivity 2.3M、Design 2.2M、Marketing 1.8M、Engineering 1.6M、Data 1.6M、
  Finance 1.5M、Product Management 1.3M、PDF Viewer 1.3M、Sales 1.2M、Operations 1.2M、Legal 1.2M、
  Enterprise Search 799.4K、Small Business 766.4K、Human Resources 701.9K…
  → plugin 是「角色包」（role-level），跟 Claude Code 的 plugin marketplace 概念一致。
- **Add** 下拉三項：**Add marketplace／Upload plugin／Create with Claude**。

## 4. Memory

三個開關（本帳號狀態）：
| 開關 | 說明 | 狀態 |
|---|---|---|
| Search and reference chats | 允許 Claude 搜尋過去對話 | On |
| Generate memory from chats | 從對話產生 memory | On |
| Include sensitive topics in memory | 允許記健康、宗教等敏感資訊 | Off |

- **Import memory from other AI providers**：「We'll provide a prompt you can use to fetch the memory from
  your other account」＋ Start import（對應 `import-memory` skill）。
- 遷移公告：「We've migrated to a new memory system. You have 15 days left if you'd like to export legacy memory.」
- Memory 分兩區，表格欄位 Name／Summary／Last updated／Actions：
  - **You**：Profile（Who Vincent is — affiliation and working language，Jul 18）
  - **Topics**：Languages（Working language preferences）、Recent Work（Recent AI-related exploration…），皆 Jul 18
- 點 Profile → 詳情：Summary＋Details 條列（名字、依 email 網域推斷任職 MaiAgent 並做 AI agent 相關工作、
  部分情境使用繁體中文）＋ **Delete** 鈕。細節是條列句、可整筆刪除，看不到單條編輯。

## 觀察

- Skills／Connectors／Plugins 三者的 Browse 共用同一個 Directory，只是預設 tab 不同；Add 都是下拉而非表單。
- Web 端 skill 與 Claude Code 端 skill 是同一套 SKILL.md 格式，Directory 可直接讀原文，方便抄結構。
- Memory 的可控項只有三個開關＋整筆刪除，沒有手動新增 memory 的入口（要靠 import 或對話產生）。
- Slack 顯示 Reconnect，代表 token 失效——這解釋了本 session 裡 Slack MCP 只剩 authenticate 工具。
