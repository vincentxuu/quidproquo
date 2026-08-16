---
title: "microsoft/AI-Engineering-Coach 的 45 條規則：一份把 agentic 工程意見寫成可執行門檻的清單"
date: 2026-08-16
category: ai
type: deep-dive
tags: [agentic-coding, context-engineering, claude-code, codex, open-source, harness-engineering]
lang: zh-TW
tldr: "微軟員工開源的 VS Code extension，讀本機 Claude Code / Codex / OpenCode 的 session log。真正的內容物是 45 條 Markdown 規則：prompt 短於 30 字元、收到 20 行 AI 程式碼後 15 秒內就送下一則、instructions 檔超過 4000 bytes——把「context engineering」翻成可以爭論的數字。"
description: "拆解 microsoft/AI-Engineering-Coach 的 45 條反模式規則：它主張什麼叫好的 agentic 工程、規則即 Markdown 的架構與信任閘門，以及哪些門檻其實是把價值判斷偽裝成量測。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-ai-engineering-coach-rules-en)

[AI Engineer Coach](https://github.com/microsoft/AI-Engineering-Coach) 是一個讀你本機 AI coding session log、然後告訴你哪裡用得不好的 VS Code extension。它有 3,548 顆星、MIT 授權、約 59,000 行 TypeScript，README 結尾寫明「這是微軟員工的開源社群專案，**不是** Microsoft 官方產品」。

但真正值得讀的不是那個儀表板，是 `src/core/rules/` 這個資料夾。45 個 Markdown 檔，每個定義一種「用 AI 寫程式的壞習慣」，附帶具體的觸發門檻。那是我看過把「怎樣算會用 AI 寫程式」講得最具體的一份文件——具體到可以吵架。

## 先講它是什麼

形態是 VS Code extension，同一份 webview 也能當 GitHub Copilot app 的 canvas 跑。核心功能：把本機的 AI coding log 解析出來，算成分數和圖表。全程唯讀、不改你的 log、零遙測、不外傳。

跨 harness 是它最實際的價值。一個儀表板同時吃五種來源：

| Harness | 日誌位置 |
|---|---|
| [Claude Code](https://code.claude.com/docs/en/overview) | `~/.claude/projects/<encoded-path>/<uuid>.jsonl` |
| [Codex CLI](https://github.com/openai/codex) | `~/.codex/sessions`（含 `archived_sessions`） |
| [OpenCode](https://github.com/sst/opencode) | `findOpenCodeDirs()` 探測 |
| VS Code Copilot | `.../User/workspaceStorage` |
| Copilot App / CLI | canvas 模式內解析 |

各家 harness 的用量資料現在都鎖在自己的格式裡，沒有工具在做橫向比較。這件事本身有價值。

裝起來麻煩：沒發到 Marketplace 也沒有 Releases 頁，得自己 clone 後跑 `npm ci && npm run package` 建 `.vsix`。

## 45 條規則主張什麼

這是這個 repo 真正的內容物。四組，共 45 條（prompt-quality 16、tool-mastery 12、session-hygiene 9、code-review 8）。挑有代表性的，附它實際設的數字。

### Prompt 品質

- **`lazy-prompting`**：prompt 短於 30 字元，且這類請求佔比超過 30%。
- **`low-constraint-usage`**：帶約束詞的 prompt 少於 8%。它的約束詞清單是一條 regex：`do not|don't|must not|never|without|avoid|only|strictly|limit to|at most|at least|no more than|require|restrict|exclude|ensure|must|shall`。論點是「約束會收斂輸出、降低幻覺」。
- **[`no-spec-driven-development`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/no-spec-driven-development.md)**：少於 20% 的 session 以規格、計畫或結構化需求開場。規則描述直接寫著「Spec-first development consistently beats vibe-coding」。
- **[`instruction-bloat`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/instruction-bloat.md)**：`copilot-instructions.md` 之類的檔案超過 4,000 bytes。理由很硬——這種檔案「are prepended to **every** request's system prompt」，改進建議是「Keep the always-on payload under ~4 KB」。

### Code review

- **[`speed-accept`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/speed-accept.md)**：收到 20 行以上 AI 程式碼後，15 秒內就送出下一則訊息，累積 5 次以上。它的建議只有一句話值得抄：「A quick glance is not a review.」
- **[`vibe-coding`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/vibe-coding.md)**：單一 session 產出 100 行以上 AI 程式碼，但使用者訊息不超過 5 則，且開場訊息沒有清單、編號、標題或規格關鍵字。它的用語是「velocity without understanding creates knowledge debt」。

### Session 衛生

`mega-sessions` 抓單 session 超過 50 則訊息；`session-drift` 抓一個 session 混了 4 種以上任務類型；`runaway-agent-loops` 抓單一 agentic 請求用掉 15 個以上工具——那是 agent 在鬼打牆的訊號。

### 工具熟練度

這組最務實，幾乎都在講錢。

- **[`reasoning-effort-overuse`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/reasoning-effort-overuse.md)**：超過一半的請求跑 high 或 max reasoning effort。它宣稱「every `-high` or `-xhigh` request typically costs 2–4× more output tokens than `-medium` or default for the same answer」——這是它自己的估計，不是廠商數字，但方向沒錯：effort 控制的是思考深度與整體 token 花費。
- **[`cache-hit-starvation`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/cache-hit-starvation.md)**：prompt 超過 5,000 token 但 cache 命中率低於 10%。它把原因歸給「churning instructions, frequent compaction, or unstable system prompts」。這條的診斷完全正確——[prompt caching 是前綴比對](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)，前綴任何一個 byte 變動都會讓後面全部失效，所以「指令一直改」確實會直接殺掉快取。
- **[`mcp-tool-bloat`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/mcp-tool-bloat.md)**：單 session 用超過 40 個不同工具。理由是每註冊一個工具都在為每次請求加 token，不管有沒有用到。
- **`excessive-file-context`**：一次塞 30 個以上檔案進 prompt。

看得出來這四組不是同一種東西。前兩組是行為主張，第四組是成本工程——後者的門檻比較站得住腳，因為它們對應的是可驗證的機制。

## 規則即 Markdown

架構上最聰明的決定：45 條規則不是寫死的 TypeScript，是 45 個 `.md` 檔。YAML frontmatter 放門檻，加一段小 DSL：

```yaml
---
id: vibe-coding
group: code-review
severity: high
scope: sessions
thresholds:
  minAiLoc: 100
  maxUserPrompts: 5
  minSessions: 3
---
```

````
```detect
scan: sessions
match: flatSumField(requests, "aiCode", "loc") >= thresholds.minAiLoc AND \
  requestCount <= thresholds.maxUserPrompts
aggregate: count
check: count >= thresholds.minSessions
```
````

管線是 `scan → match → aggregate → reduce → check → severity → examples`。三個設計亮點：

1. **`severity` 可以是運算式**，不只是靜態的 high/medium/low。例如 `broken-flow-state` 寫的是 `severity: flow.lowScoreRate > 0.8`——嚴重程度由資料決定。
2. **三層規則疊加**：內建規則、個人規則（`~/.ai-engineer-coach/`）、專案規則（`<workspace>/.ai-engineer-coach/`）。團隊可以把自己的規範塞進 repo 跟著版控走。
3. UI 附 Rule Editor 和一個 REPL 式的 Rule Playground，可以拿自己的資料即時測規則。

擴充規則不需要改任何程式碼，這讓「我們團隊認為 X 是壞習慣」變成一個可以送 PR 的東西。撰寫格式寫在 [`docs/AUTHORING_RULES.md`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/docs/AUTHORING_RULES.md)。

## 信任閘門：他們想過威脅模型

規則可以從專案目錄載入，代表惡意 repo 可以塞規則給你執行。[`rule-trust.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rule-trust.ts) 的檔頭註解直接把這件事寫出來：

> Personal and project files are NOT trusted by default: a malicious repository could drop a `.ai-engineer-coach/rules/` directory whose DSL executes the moment the dashboard is opened.

解法是 trust-on-first-use：每個本地規則檔的內容做 SHA-256 雜湊，使用者明示核可後才記錄下來；之後每次載入都要比對雜湊，改一個字就作廢重審。沒過的檔案跳過不執行，排進待審清單給 UI 顯示。

搭配 `safe-regex.ts` 擋 ReDoS——pattern 長度上限 1,000 字元、測試輸入上限 100,000 字元、被拒絕的 pattern 進黑名單避免重複警告。以一個「看圖表」的工具來說，這個安全意識超出平均水準，值得抄。

## 哪些門檻是量測，哪些是價值判斷

這是我對它最大的保留。

**同一張畫面上有兩套計分。** 五張 practice score 卡片走的是 `100 − 每條命中規則的懲罰`（high 扣 12、medium 扣 7、low 扣 3），由那 45 條規則驅動。但旁邊的週趨勢線走的是 [`detectors/scoring.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/detectors/scoring.ts) 裡另一套寫死的懲罰函式，只看七個粗糙訊號：訊息短於 30 字、沒引用檔案、取消、凌晨 5 點前、週末、5 秒內接受程式碼、沒用工具。卡片數字和它旁邊的趨勢線不是同一個東西，UI 沒有說明這件事。

**「週末」和「凌晨」被算進工程分數。** 那套週趨勢函式裡，凌晨 5 點前的請求 +0.3 懲罰、週末 +0.2，直接進 session-hygiene 分數。這是價值判斷不是量測——不同時區、輪班工作、下班後的副業專案，都會被無差別扣分。它量到的是「你什麼時候工作」，然後把它叫做「衛生」。

**五組裡有一組不走規則引擎。** README 說 45 條規則涵蓋五個面向、包含 context management，但 `context-management` 這一組在 Markdown 規則裡是 0 條，由 `analyzer-context.ts` 用 TypeScript 硬寫四項檢查（Context Bloat、Compaction Storm、Context Amnesia Risk、Runaway Context Growth）。最新潮的那一組，恰好是最不可延伸的那一組。

**Claude / Codex 使用者是二等公民。** 不少規則標了 `requiresIdeContext: true`，非 VS Code 的 harness 直接跳過；Skill Finder、Learning Center、Context Health 的 AI 審查都依賴 VS Code 內建的語言模型 API，canvas 模式下整組隱藏。

分界線其實蠻清楚的：**對應可驗證機制的門檻站得住腳**（prompt cache 前綴失效、instructions 檔進每次 system prompt、工具數量佔 token），**對應人類行為偏好的門檻是意見**（週末、凌晨、15 秒、5 則訊息）。兩者混在同一個分數裡，就沒辦法分開反駁了。

順帶一提，我把 45 條規則的 205 條 DSL 運算式全掃過一遍（用它自己的 `validateExpression`），有 1 條編譯不過：`no-plan-mode.md` 第 36 行有一段字串被編輯失手接壞。實測結果是那條規則永遠不會觸發，宣稱的 45 條實際只有 44 條在動。這只是小瑕疵，但也對上另一個訊號：最近的提交幾乎全是 dependabot 的版本升級，README 自承 Burndown 頁「暫時停用」、Output 頁的 token 明細「暫時隱藏」。

## 整體來說

**值得讀，不一定值得裝。** 花三十分鐘讀完 `src/core/rules/` 這個資料夾的收穫，大於實際把 extension 跑起來看圖表。那 45 條規則是一份難得的東西：它把「context engineering」這種模糊的話，翻譯成一組有數字、可爭論、可反駁的門檻。你可以不同意 4,000 bytes 或 15 秒，但它至少把話講到可以被檢驗的程度——而這正是多數談 agentic 工程的文章做不到的。

軟體本身架構乾淨，「規則即 Markdown + 三層疊加 + 信任閘門」這組合很值得借鑑。但計分模型比它的表現形式粗糙，安裝門檻高，而且看起來已經進入維護模式。

如果你想從中拿走一樣東西：拿那份規則清單，逐條問「我同意這個門檻嗎」。同意的抄進團隊規範，不同意的想清楚為什麼——那個「為什麼」通常比規則本身更有用。

## 參考資料

- [microsoft/AI-Engineering-Coach](https://github.com/microsoft/AI-Engineering-Coach) — 專案 repo（MIT）
- [`src/core/rules/`](https://github.com/microsoft/AI-Engineering-Coach/tree/main/src/core/rules) — 45 條規則的原始檔
- [`docs/AUTHORING_RULES.md`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/docs/AUTHORING_RULES.md) — 規則與 metric 撰寫格式
- [`src/core/rule-trust.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rule-trust.ts) — trust-on-first-use 信任閘門
- [`src/core/detectors/scoring.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/detectors/scoring.ts) — 週趨勢的懲罰函式
- [Anthropic — Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — 前綴比對與快取失效機制
- [Claude Code 文件](https://code.claude.com/docs/en/overview)
- [openai/codex](https://github.com/openai/codex)、[sst/opencode](https://github.com/sst/opencode)
- 站內延伸：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
- 站內延伸：[context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
- 站內延伸：[安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
