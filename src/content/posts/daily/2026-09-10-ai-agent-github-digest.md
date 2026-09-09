---
title: "AI Agent GitHub Digest — 2026-09-10"
date: 2026-09-10
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, multi-agent]
lang: zh-TW
description: "superpowers、ECC、teamai-cli 同時衝上 GitHub trending——今天的主題不是新模型，是怎麼把 agent 的 skill 和記憶系統化管理"
tldr: "obra/superpowers 把整套開發方法論固化成可跨 8 種 harness 安裝的 skill；affaan-m/ECC 用 68 個 agent + 286 個 skill 做 agent harness 效能優化系統；cathrynlavery/diagram-design 單日漲 2,286 星，用 39 種編輯風格圖表取代 Mermaid；Tencent teamai-cli 讓團隊統一分發 skill/rule/MCP 設定；Pydantic AI v2.42.0 新增 GitHub Copilot provider"
series:
  name: "AI Agent GitHub Digest"
  order: 26
---

## 今日亮點

今天 GitHub trending 上衝最快的幾個專案，沒有一個是新模型或新框架——superpowers 定義開發方法論、ECC 做效能優化系統、teamai-cli 做團隊分發，連漲最快的 diagram-design 本質上也是一個「skill」。感覺 agent 生態系正在從「裝了幾個 skill」轉向「怎麼把 skill、記憶、流程系統化管理」。

## Trending Repos

### obra/superpowers ⭐ 283,899 (+690)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**：給 coding agent 用的完整軟體開發方法論，建立在一組可組合的 skill 與初始指令之上，讓 agent 主動先問清楚需求、拆解成可讀的規格、寫測試驅動的實作計畫，再進入 subagent 驅動的開發流程。
- **為什麼值得看**：多數 skill 專案解決的是單一任務（寫測試、抓 bug），superpowers 定位是整條開發流程的骨架——從「你到底想做什麼」問到「TDD + YAGNI + DRY」的實作紀律，還支援跨 Claude Code、Codex、Cursor、Gemini CLI 等 8 種以上 agent harness 安裝，不綁死單一工具。
- **tech stack**：Shell + 各 harness 自己的 plugin/skill 機制（Claude plugin marketplace、Codex plugin marketplace、Antigravity session-start hook 等）
- **上手難度**：低——依 harness 跑一行安裝指令即可，但要讓整套方法論真的落地，需要團隊一起配合流程

---

### affaan-m/ECC ⭐ 254,988 (+1,151)

[GitHub](https://github.com/affaan-m/ECC)　·　JavaScript　·　MIT

- **是什麼**：給 agent harness 用的效能優化系統，一次裝進 68 個 agent、286 個 skill、94 個指令捷徑，外加 hook、記憶與安全掃描（AgentShield）。
- **為什麼值得看**：核心賣點是把「plan → test → implement → review → verify → remember → improve」這套流程固化成可重複使用的 skill，不用每次開新 session 就在 prompt 裡重新描述一次；同時支援 Claude Code、Codex、Cursor、OpenCode 等 7 種 harness，用 capability-limited adapter 對齊各家能力差異。
- **tech stack**：JavaScript + npm 套件（`ecc-universal`、`ecc-agentshield`）+ 各 harness 的 plugin/hook 機制
- **上手難度**：低——`npx ecc-universal setup` 跑導引安裝即可，但要用滿 68 個 agent 的分工需要花時間理解架構

---

### cathrynlavery/diagram-design ⭐ 36,362 (+2,286)

[GitHub](https://github.com/cathrynlavery/diagram-design)　·　HTML　·　MIT

- **是什麼**：給 Claude Code / Codex / Pi 用的 skill，內建 39 種編輯風格的圖表類型（架構圖、時序圖、看板、Sankey……），輸出純 HTML + SVG，不需要 Figma 也不依賴 Mermaid。
- **為什麼值得看**：作者的動機很直接——每次叫 agent 畫圖都拿到「通用圓角方框」，跟網站風格不搭，要嘛自己開 Figma 改半小時，要嘛乾脆放棄畫圖。這個 skill 用語意化的版型描述取代硬編碼的圖表類型，還能讀你的網站抓配色，號稱 60 秒內做出符合品牌調性的圖。今天單日漲了 2,286 顆星，是這波候選裡漲最快的。
- **tech stack**：純 HTML + SVG（無 build step、無 JS 相依）+ Claude Code Agent Skills 格式
- **上手難度**：低——裝成 skill 後在對話裡直接叫用，靜態輸出可以直接用瀏覽器打開檢視

---

### Tencent/teamai-cli ⭐ 2,850 (+563)

[GitHub](https://github.com/Tencent/teamai-cli)　·　TypeScript　·　Other

- **是什麼**：讓團隊統一管理 skill、rule、MCP 設定與知識庫，同步套用到 Claude Code、Codex、Cursor、CodeBuddy 等 11 種 AI agent 上的 CLI 工具。
- **為什麼值得看**：團隊導入多個 coding agent 後常見的問題是「每個人的 skill / rule 版本不一樣」，teamai-cli 把這些設定放進共用 git repo，每次 session 自動 pull 最新版本，不用手動同步；還內建角色（role）與標籤（tag）機制，讓不同職能的成員只訂閱自己需要的 skill 子集。
- **tech stack**：TypeScript + npm 套件 `teamai-cli` + git-based 分發（支援 GitHub、GitLab、私有 Git service）
- **上手難度**：中——需要先建立團隊共用 repo 並設定寫入權限，單人使用門檻低，多人協作要先規劃角色與標籤

---

### TauricResearch/TradingAgents ⭐ 103,787 (+367)

[GitHub](https://github.com/TauricResearch/TradingAgents)　·　Python　·　Apache-2.0

- **是什麼**：用多個 LLM agent 模擬真實交易團隊分工的金融交易框架——基本面分析師、情緒分析師、技術分析師各自產出觀點，再交給交易員與風控團隊做最終決策。
- **為什麼值得看**：這是少數把 multi-agent 討論機制真的用在需要嚴謹決策流程的場景（而非單純聊天）的框架，v0.4.0 才剛修掉「look-ahead」問題——避免回測時不小心用到未來才會出現的資料，這對量化研究是會直接動搖結論的正確性 bug，能修到這麼細代表專案已經有一定成熟度。
- **tech stack**：Python + LangGraph（checkpoint resume）+ 多家 LLM / 資料供應商（FRED、Polymarket、Bedrock 等）
- **上手難度**：中——框架本身裝起來不難，但要接對資料源、調整 agent 分工邏輯門檻較高，且官方明白標示是研究用途，非投資建議

## Notable Releases

### Pydantic AI v2.42.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0)

- **重要變更**：新增 `GitHubCopilotProvider`，讓只有 GitHub Copilot 訂閱、沒有另外申請模型 API key 的使用者可以直接透過 Copilot 的 OpenAI 相容 API 呼叫模型；同時修正 `BedrockConverseModel` 的取樣參數處理、code-mode 函式簽章裡巢狀 `$ref` 的解析問題
- **Breaking Changes**：`DeferredToolResults.approvals` 收到不合法的值時，現在會直接被拒絕（reject），不再靜默放行——如果你組裝這個欄位時有邊界情況沒處理好，升級後可能會開始噴錯
- **對你的影響**：只有 GitHub Copilot 訂閱的使用者現在多一條免費接模型的路；有用到 `DeferredToolResults.approvals` 的人，升級前先確認自己傳的值合法，避免被新的驗證擋下來

## 今日收穫

之前以為 agent skill 生態系比的是「誰的 skill 庫比較大」，今天看 superpowers 和 ECC 同時衝上 trending 才意識到，真正拉開差距的是「plan → test → review → remember」這套迴圈有沒有被固化成可重複的流程——skill 數量本身不是護城河，能不能讓 agent 記得自己上次犯過的錯，才是。

## 參考資料

- [obra/superpowers — GitHub](https://github.com/obra/superpowers)
- [affaan-m/ECC — GitHub](https://github.com/affaan-m/ECC)
- [cathrynlavery/diagram-design — GitHub](https://github.com/cathrynlavery/diagram-design)
- [Tencent/teamai-cli — GitHub](https://github.com/Tencent/teamai-cli)
- [TauricResearch/TradingAgents — GitHub](https://github.com/TauricResearch/TradingAgents)
- [Pydantic AI v2.42.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0)
