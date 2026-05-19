---
title: "Open Design：11 天 fork 出來的 Claude Design 開源替代品"
date: 2026-05-19
type: deep-dive
category: ai
tags: [open-design, claude-design, anthropic, agent-cli, claude-code, mcp, open-source]
lang: zh-TW
tldr: "Anthropic 2026-04-17 發 Claude Design，4-28 nexu-io/open-design 公開，同樣的 artifact-first loop、Apache-2.0、跑在你已經有的 16 個 coding-agent CLI 上。兩週從 0.1 到 0.7、40k+ stars。把 AI 設計工具從 vertical SaaS 攤平成 skill bundle 的範式轉移。"
description: "Open Design (nexu-io) 介紹：跟 Claude Design 的比較、Skill/DESIGN.md 架構、daemon + MCP 設計、217 skills × 149 design systems、適合與不適合誰用。"
draft: false
---

2026-04-17 Anthropic 發 Claude Design：Opus 4.7 驅動，prompt 進去吐 prototype / deck / one-pager，研究預覽接 Claude Pro 以上方案。十一天後（2026-04-28），nexu-io 團隊把 `open-design` 推上 GitHub —— 同樣的 artifact-first loop、Apache-2.0、本地優先、跑在你已經有的 16 個 coding-agent CLI 上。兩週內從 v0.1.0 衝到 v0.7.0，40,000+ stars（依 TechTimes 2026-05-17 報導），是今年動得最快的開發者工具之一。

這篇拆它的設計取捨、跟 Claude Design 的差異、以及「AI 設計工具」這個類別在這 11 天裡到底發生了什麼結構性的事。

> ⚠️ 命名歧義先講清楚：本文寫的是 **nexu-io/open-design**（網域 opendesigner.io）。不要跟 `opendesign.dev`（Avocode/Ceros 的設計檔解析 SaaS，已於 2023-10-01 sunset）、`opendesigndev/open-design-engine`（前 Avocode 留下的 C++ rendering 引擎）、或 Open Design Alliance（CAD 互通聯盟）搞混。

## 它在解什麼問題

把「prompt → design artifact」這條流程，**從專屬 SaaS 拆下來、攤平成可組合的檔案**。

Claude Design 證明了「LLM 不寫文字、直接吐 design artifact」這條路可行，但 closed-source、cloud-only、綁 Anthropic 模型、綁 Anthropic 訂閱（Pro 每月 20 美元起）。OD（Open Design）十一天後做出同樣的 loop —— 但每一層都是檔案、跑在你已經有的 coding-agent CLI 上、本地優先。

官方原話：「Same loop. Same artifact-first mental model. None of the lock-in.」

## 關鍵設計決定

### 1. 不 bundle agent，靠 PATH 偵測 16 種 CLI

OD 開機時掃 PATH，把 Claude Code、Codex CLI、Cursor Agent、Gemini CLI、OpenCode、Qwen Code、Qoder CLI、GitHub Copilot CLI、Devin Terminal、Hermes、Kimi、Kiro、Kilo、Mistral Vibe、DeepSeek TUI、Pi 全變成候選 design engine。

沒有 CLI 也行：`POST /api/proxy/stream` 接任何 OpenAI / Azure / Google 相容 endpoint（DeepSeek、Groq、OpenRouter、自託管 vLLM 都通）。

設計取捨很直白 —— 使用者通常已經付過 Claude Code Max 或 Cursor 的訂閱，token 預算本來就有頭，等於 design 生成是「順手」加上去的，沒有額外帳單。**代價**是非工程使用者進不來：連 `pnpm dev` 都嫌煩的 founder/PM 你別來找 OD。

### 2. Skill = 資料夾，不是 plugin

每個 skill 就是 `SKILL.md` + `assets/` + `references/`，跟 Claude Code 的 skill 格式 [完全一致](/posts/ai/2026-05-08-anthropic-claude-skills-guide)。丟一個資料夾進 `skills/`、重啟 daemon、它就出現在 picker 上。

OD 把這條規則貫徹到底 —— 上游 op7418 的 `guizang-ppt-skill` 是**逐字 bundle**進 `skills/guizang-ppt/`、原 LICENSE 完整保留。一個 deck 引擎就是 36 個 theme、31 個 layout、47 個動畫、14 個範本，全部都是檔案。

對比 Lovable、v0、Bolt 那些「skill 是 vendor 內部 prompt 模板」的設計：OD 把 skill 攤到檔案系統上，作者可改可 fork，使用者可以 audit。

### 3. Design System = 9 段式 Markdown

不是 theme JSON、不是 design token tooling。`DESIGN.md` 是九段固定結構：color、typography、spacing、layout、components、motion、voice、brand、anti-patterns。預設出貨 149 個（Linear、Stripe、Vercel、Apple、Notion、Tesla、Airbnb、Cursor、Supabase、Figma、Spotify...）。

切 design system 就是 daemon 換注入哪份 `DESIGN.md` 到 prompt stack，artifact 立刻用新 token 渲染。

**沒做的取捨**：沒有 strict schema 驗證、沒有 token tooling 那種型別化，design system 的一致性靠 reviewer 把關。

### 4. Turn-1 強制 question form

依官方 `apps/daemon/src/prompts/discovery.ts` 的設計，OD 第一輪不讓模型自由發揮 —— 它先丟一個 `<question-form>`，要求使用者選 surface（landing / dashboard / mobile？）、audience、tone、brand、scale 五個維度。

用六個維度的勾選阻擋「模型瞎畫一張卡通插圖、使用者再 redirect」的浪費。沒 brand spec 時還有 5 個 visual direction picker 兜底（每個 direction 是 deterministic OKLch 色板 + 字體 stack）。

### 5. Anti-AI-slop machinery

OD 的反 slop 機制借自上游 `huashu-design` 專案：5-dim 自我批判、P0/P1/P2 checklist、`anti-ai-slop.md` craft 反射。每個 skill 都在 emit artifact 前先過 5 個維度的自評，沒過門檻就自己 revise。

prompt stack 裡寫死的禁區：紫漸層、generic emoji icons、把 Inter 當 display 用 —— 這些是 LLM 設計師最愛犯的三條罪。

### 6. 真正的檔案系統 + MCP

OD 的本地 daemon 給 agent 開的是真的 `Read` / `Write` / `Bash` / `WebFetch`，artifact 直接落地成 `.html` / `.png` / `.mp4`，SQLite 存 project / conversation。

更聰明的是 `od mcp`：v0.4.0 起 OD 暴露一個 read-only MCP server，Cursor / Zed / Windsurf / Claude Code 都能直接讀你的 OD 專案。等於 OD 不是個資訊孤島，反而是你其他 agent 的 design context source。

> 安全模型一句話：daemon 預設 bind `127.0.0.1`，LAN 暴露要 `OD_BIND_HOST` 明確 opt-in；MCP server 只讀不寫；prompts 與 generated content 會走到你選的 LLM provider（Anthropic / OpenAI 自己的政策仍適用），OD 本身不收 telemetry。

## 跟 Claude Design 的對照

依 WotAI 2026-04-29 的評測整理：

| 維度 | Claude Design | Open Design |
|---|---|---|
| License | Closed | Apache-2.0 |
| Form factor | Hosted (claude.ai) | Web + 本地 daemon（可 Vercel 部署） |
| Runtime | Opus 4.7 鎖死 | 16 CLI adapter + OpenAI-compat BYOK proxy |
| Pricing | Pro $20 / Max $100-200 / Team / Ent | Free，你 CLI 的 tokens |
| Design 來源 | 讀你的 codebase + design files | 149 個預製 `DESIGN.md` |
| Export | PDF / URL / PPTX / Canva | HTML / PDF / PPTX / MP4 / ZIP |

兩個結構性差異：
1. **Claude Design**：吃你的 codebase 自動套設計風格 ✅；**OD**：靠預製 design system 當起點 ⚠️
2. **OD**：模型可換、檔案在本地、能用 MCP 串到別的 agent ✅；**Claude Design**：hosted 簡單但你不能換 ❌

## 適合與不適合誰

**適合：**
- 已付 Claude Code Max / Cursor / Codex 訂閱、想把 token 預算順手挪一點來生 deck / landing 的工程師
- 接 client 案有 NDA，artifact 必須留在本機
- 想用 Linear / Stripe / Vercel / Notion / Apple 風的預製 design system 當起點
- 要客製 skill（行業專屬 design 類型）丟回 `skills/`
- 要把 design 生成串進 Cursor / Zed / Windsurf —— `od mcp` 是這個用法的最短路徑

**不適合：**
- 非工程 founder / PM，連 `pnpm dev` 都會卡 → 直接買 Claude Design Pro
- 客戶要保證 design fidelity 「跟我們公司既有 component 完全一致」 → Claude Design 讀 codebase 那條路目前更強
- 需要 Canva 一鍵 handoff → Claude Design 有，OD 沒
- production-grade SLA → 0.x 還在每兩三天一個 minor，太早

## 怎麼用

```bash
git clone https://github.com/nexu-io/open-design.git
cd open-design && pnpm install
pnpm tools-dev run web
```

需要 Node ~24、pnpm 10.33.x。第一次跑起來會在當前資料夾建立 `.od/`（SQLite + per-project artifact）。沒有 init 步驟。

匯入既有 Claude Design 專案：把 ZIP 拖進 welcome dialog，`POST /api/import/claude-design` 會解開成本地 project，agent 接手繼續編。

桌面端有 `open-design-0.7.0-mac-arm64.dmg`、`open-design-0.7.0-win-x64-setup.exe`（unsigned）、Linux AppImage。

## 限制 / 已知問題

- **還是 0.x**：兩週七個 release，breaking changes 預期會多；v0.4.0 還曾因 daemon crash 過 DB migration（後續 0.4.1 修掉）
- **catalog 雖大但無 strict schema**：149 個 `DESIGN.md` 一致性靠人工 review
- **隱私不是「fully local」**：prompts 跟 generated content 會路由到你選的 LLM provider；OD 本身不收 telemetry，但 Anthropic / OpenAI / 你的 vLLM 的政策仍適用，官方明寫了這個取捨
- **Windows build unsigned**，企業環境可能會擋
- design fidelity 對「自家既有 component」自動吸取還沒贏 Claude Design

## 整體來說：vertical SaaS → skill bundle 的範式轉移

這 11 天最有趣的不是 OD 本身、也不是 40k stars，而是「AI 設計工具」這個類別**在 11 天內被 commoditize 成一個 skill bundle**。

幾年前 design tool 是個有護城河的類別（canvas、component library、團隊協作、檔案格式）。Claude Design 把這條延伸到 AI native。OD 在 11 天後示範：AI native 版本的 design tool 不是個類別，是個 skill bundle，可以直接 drop 進你已經在付錢的 agent runtime。

這個 pattern 跟 workflow automation、code review、content generation 過去兩年走的路一樣 —— vertical SaaS 先定義形狀，OSS 等價物比所有人預期都快出現，把「underlying capability 本來就 portable」這件事證明出來。Hosted product 還能活的條件是它有 OSS 替代品做不到的整合深度或 UX —— Claude Design 的「讀你 codebase」就是這種 moat，但不是整個類別的 moat。

實務面對工程師的影響：如果你已經付 agent CLI 訂閱，預設假設應從「我需要另一個 design 工具」改成「我的 CLI 需要哪個 skill bundle 才能 design？」有時候答案還是「買 hosted product」，但 default 翻了。

## 參考資料

- [nexu-io/open-design GitHub repository](https://github.com/nexu-io/open-design)
- [Open Design 官網（opendesigner.io）](https://opendesigner.io/)
- [Open Design v0.7.0 release notes（newreleases.io）](https://newreleases.io/project/github/nexu-io/open-design/release/open-design-v0.7.0)
- [Anthropic Claude Design 公告（Anthropic Labs）](https://www.anthropic.com/news/claude-design-anthropic-labs)
- [Claude Design vs Open Design（WotAI 2026-04-29 評測）](https://wotai.co/blog/claude-design-vs-open-design)
- [Open-Design 40k stars 報導（TechTimes 2026-05-17）](https://www.techtimes.com/articles/316749/20260517/open-design-free-local-alternative-claude-design-20-plan-runs-16-ai-agents.htm)
- [Open Design Explained: Turning Claude Code and Codex into AI Design Tools（knightli.com）](https://www.knightli.com/en/2026/05/18/open-design-open-source-claude-design-alternative/)
- [Anthropic Claude Skills 官方指南（站內）](/posts/ai/2026-05-08-anthropic-claude-skills-guide)
