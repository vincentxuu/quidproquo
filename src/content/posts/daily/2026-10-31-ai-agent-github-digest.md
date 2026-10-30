---
title: "AI Agent GitHub Digest — 2026-10-31"
date: 2026-10-31
category: daily
tags: [ai-agent, github, open-source, daily, agent-governance, rust, agent-platform]
lang: zh-TW
description: "Claude Code 把寫入範圍的邊界做進每一種權限模式的同一天，CopilotKit/OpenBot 用沙箱電腦加審批閘門重新定義『可信任的 agent』，HKUDS/nanobot 跟 0xPlaygrounds/rig 則示範另一條把核心做小的路線"
tldr: "**CopilotKit/OpenBot**（⭐ 8,639）把每個 AI 同事配一台自己的沙箱電腦，瀏覽器／檔案／MCP 操作都先過 CEL 政策閘門、寫進稽核紀錄才執行，還能透過 AG-UI 協定直接接 LangGraph、Mastra、CrewAI 等現成 agent；**HKUDS/nanobot**（⭐ 49,682）把個人 agent 做成讀得完的極簡核心，內建長期記憶跟十幾個聊天管道整合；**0xPlaygrounds/rig**（⭐ 9,027）把 Rust LLM library 跟一套可外接 Zed 等編輯器的 coding agent harness 做進同一個 crate。release 這邊 **Claude Code v2.1.314** 新增 `permissions.blockWritesOutsideWorkingDirectories`，讓寫入範圍的邊界在每種權限模式下都強制生效，外加閒置對話自動壓縮等多項修正。"
series:
  name: "AI Agent GitHub Digest"
  order: 77
---

> 🌏 [English version](/posts/daily/2026-10-31-ai-agent-github-digest-en)

## 今日亮點

Claude Code v2.1.314 新增 `permissions.blockWritesOutsideWorkingDirectories`，把「寫入範圍不能超出工作目錄」做成每種權限模式都強制生效的硬邊界；同一天 trending 上的 CopilotKit/OpenBot 走的是同一條路——每個 AI 同事配一台自己的沙箱電腦，任何動作都先過政策閘門判斷、寫進稽核紀錄才真正執行。這跟前兩天 Agno、Mastra、metaharness 陸續把審批閘門當成預設配置的方向一致：收緊邊界、留稽核紀錄，正在從「某個框架的賣點」變成整條 agent 工具鏈從上到下都要補的基本功。另一端則是反向的輕量化路線：HKUDS/nanobot 把個人 agent 的核心做到「讀得完」，0xPlaygrounds/rig 乾脆把 Rust LLM library 跟一套可外接 Zed 等編輯器的 coding agent harness 做進同一個 crate——「重治理」跟「輕核心」兩條路線在同一天一起往前走。

## Trending Repos

### CopilotKit/OpenBot ⭐ 8,639

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **是什麼**：用 Docker Compose 一鍵跑在自己基礎設施上的 agent 平台——每個「Bot」都是設定而非程式碼，預設附兩個同事（General Assistant、Knowledge），範例目錄裡還有十幾個金融情境的現成角色可以直接複製使用。
- **為什麼值得看**：跟一般「加個工具呼叫」的 agent demo 不同，OpenBot 把治理機制做成架構本身——每個人、每個 Bot 都配一台自己的沙箱電腦（獨立容器、獨立瀏覽器 profile），任何瀏覽器／檔案／MCP 操作都要先過 CEL 政策引擎判斷、寫進稽核紀錄,才會真正執行；deny 規則優先於 allow,沒設政策的動作一律不准。而且它不綁自家框架,靠 AG-UI 協定接 LangGraph、Mastra、CrewAI、Pydantic AI、Google ADK 寫的 agent,治理邏輯跟著協定走而不是跟著某個框架走。
- **tech stack**：Next.js/TypeScript + Docker Compose（PostgreSQL 落地）+ AG-UI 協定 + CopilotKit Intelligence 做記憶與 thread
- **上手難度**：中——需要 Docker、Bun、一個 CopilotKit Intelligence 專案（有免費方案）跟一組模型金鑰，`bash scripts/start.sh` 跑起完整一套服務

```diagram
title: CopilotKit/OpenBot 的治理閘道
desc: 使用者的話經 Server 送給 Bot，Bot 想呼叫工具時都要先過 Gateway 的 CEL 政策判斷，決策寫進 PostgreSQL 稽核紀錄，允許才送進該 Bot 專屬的沙箱電腦執行。
caption: 簡化示意：只畫出「允許並執行」這條路徑；政策判斷為拒絕時，Gateway 會附上規則名稱回報給 Bot，不會把動作送進沙箱電腦。
---
<svg viewBox="0 0 800 400">
  <path class="dg-line" d="M132 216 H168" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M296 216 H332" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M448 216 H484" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M636 216 H664" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M560 268 V320" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M232 252 V292 Q232 300 240 300 H322 Q330 300 330 308 V320" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="188" width="112" height="56" rx="6"/>
  <text class="dg-label" x="76" y="216" text-anchor="middle" dominant-baseline="central">使用者</text>

  <rect class="dg-box" x="168" y="180" width="128" height="72" rx="6"/>
  <text class="dg-label" x="232" y="206" text-anchor="middle" dominant-baseline="central">Server</text>
  <text class="dg-sub" x="232" y="228" text-anchor="middle" dominant-baseline="central">送出這輪對話</text>

  <rect class="dg-box" x="332" y="180" width="116" height="72" rx="6"/>
  <text class="dg-label" x="390" y="206" text-anchor="middle" dominant-baseline="central">Bot</text>
  <text class="dg-sub" x="390" y="228" text-anchor="middle" dominant-baseline="central">AG-UI 端點</text>

  <rect class="dg-box dg-box--accent" x="484" y="164" width="152" height="104" rx="6"/>
  <text class="dg-label" x="560" y="204" text-anchor="middle" dominant-baseline="central">Gateway</text>
  <text class="dg-sub" x="560" y="226" text-anchor="middle" dominant-baseline="central">CEL 政策引擎</text>

  <rect class="dg-box" x="664" y="180" width="124" height="72" rx="6"/>
  <text class="dg-label" x="726" y="206" text-anchor="middle" dominant-baseline="central">沙箱電腦</text>
  <text class="dg-sub" x="726" y="228" text-anchor="middle" dominant-baseline="central">瀏覽器／檔案</text>

  <rect class="dg-box dg-box--store" x="480" y="320" width="160" height="56" rx="6"/>
  <text class="dg-label" x="560" y="340" text-anchor="middle" dominant-baseline="central">PostgreSQL</text>
  <text class="dg-sub" x="560" y="358" text-anchor="middle" dominant-baseline="central">稽核紀錄＋決策</text>

  <rect class="dg-box dg-box--store" x="212" y="320" width="236" height="56" rx="6"/>
  <text class="dg-label" x="330" y="340" text-anchor="middle" dominant-baseline="central">CopilotKit Intelligence</text>
  <text class="dg-sub" x="330" y="358" text-anchor="middle" dominant-baseline="central">thread／長期記憶</text>

  <text class="dg-edge" x="466" y="204" text-anchor="middle" dominant-baseline="central">工具呼叫</text>
  <text class="dg-edge" x="650" y="204" text-anchor="middle" dominant-baseline="central">允許時執行</text>
  <text class="dg-edge" x="570" y="294" dominant-baseline="central">寫入稽核</text>
  <text class="dg-edge" x="281" y="288" text-anchor="middle" dominant-baseline="central">thread／記憶</text>
</svg>
```

---

### HKUDS/nanobot ⭐ 49,682

[GitHub](https://github.com/HKUDS/nanobot)　·　Python　·　MIT

- **是什麼**：香港大學資料科學實驗室做的「超輕量、自架」個人 AI agent 框架——瀏覽器、終端機、聊天 app 都能用，Telegram、Discord、Slack、WeChat、Mattermost、Linear 等聊天管道直接內建支援。
- **為什麼值得看**：同一個團隊的 DeepTutor（本站[昨天介紹過](/posts/daily/2026-10-30-ai-agent-github-digest)）走的是「功能做深」路線，nanobot 反過來示範「核心做小」——長期記憶、排程長時程任務、MCP 整合跟多模型 fallback 都內建，但程式碼量刻意控制在讀得完的規模，不追求大平台的大而全。對只想要一個「跟自己慣用聊天管道整合、記得住事情」的個人助理、不想啃一整套企業框架的人,是比較務實的起點。
- **tech stack**：Python 3.11+ 核心 + 內建 WebUI／TUI + MCP client + OpenAI 相容 API
- **上手難度**：低——一行安裝腳本（`curl ... | sh`）就會開瀏覽器帶你設定模型金鑰，連「完全不懂終端機」的使用者都有專門的安裝指南

---

### 0xPlaygrounds/rig ⭐ 9,027

[GitHub](https://github.com/0xPlaygrounds/rig)　·　Rust　·　MIT

- **是什麼**：一個 Rust crate，同時身兼兩個角色——給開發者用的 LLM 應用程式庫（20+ 模型供應商、10+ 向量資料庫統一介面），跟一套可以直接當終端機 coding agent 用的完整 harness。
- **為什麼值得看**：多數工具只選「library」或「coding agent」其中一邊，rig 把兩者疊在一起：底層是 provider-neutral 的 completion／embedding／工具合約，上層用 Bevy 的 ECS 架構做成「一切都是 plugin」的 agent kernel，連登入流程、終端機畫面、工具都能替換或移除。最新一版加了 `rig acp`，讓它可以當 Zed 等支援 ACP（Agent Client Protocol）編輯器的後端 agent 使用，等於一套 Rust 原生實作同時覆蓋「寫 agent 應用」跟「當別人的 agent 後端」兩種用法。
- **tech stack**：Rust + Bevy ECS（agent kernel）+ Tokio async runtime + 可選 WASM 編譯目標
- **上手難度**：中——`cargo install rig` 裝終端機 agent 很快，但要客製 provider／向量資料庫／plugin 需要熟悉 Rust 跟 Bevy ECS 的概念

## Notable Releases

### Claude Code v2.1.314

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.314)

- **重要變更**：新增 `permissions.blockWritesOutsideWorkingDirectories`，讓 Write／Edit／NotebookEdit 在任何權限模式下都拒絕寫到工作目錄以外的路徑；VS Code 與 Claude Desktop 的 Code 分頁加入閒置自動壓縮——200K+ token 的對話閒置一段時間會先摘要起來，下次送出訊息時若 prompt cache 已過期就直接套用摘要；Claude apps gateway 的 Bedrock upstream 新增 `guardrail_trace`，能記錄是哪個 Amazon Bedrock guardrail 規則擋下請求（但不記錄被擋的內容本身）。
- **Breaking Changes**：無明確標示，多是修正既有行為跟新增選配功能。
- **對你的影響**：如果團隊要求「agent 絕對不能寫到專案目錄以外」，`blockWritesOutsideWorkingDirectories` 值得優先打開；常跑長對話把 context 塞滿的人，閒置自動壓縮能省掉手動 `/compact` 的步驟。其餘多是修掉 Bedrock 多圖片對話失敗、Microsoft Foundry 找不到對應模型、MCP 登出沒真的登出等既有 bug，一般升級不需要額外調整程式碼。

## 今日收穫

原本以為「治理即預設」只會出現在新創的 agent 平台上，用來當賣點跟別人的「先求有再求好」做區隔；但看到 Claude Code 本身也把寫入邊界做成跨權限模式的強制規則，才意識到這件事已經從「某個框架的差異化特色」變成「連最底層的單一 CLI 都要補上的基本功」——治理不是某一層的專利，而是整條 agent 工具鏈從最上層的多 agent 平台到最底層的 coding CLI，都在同時往同一個方向收斂。

## 參考資料

- [CopilotKit/OpenBot — GitHub repo](https://github.com/CopilotKit/OpenBot)
- [HKUDS/nanobot — GitHub repo](https://github.com/HKUDS/nanobot)
- [0xPlaygrounds/rig — GitHub repo](https://github.com/0xPlaygrounds/rig)
- [Claude Code v2.1.314 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.314)
- [HKUDS/DeepTutor 介紹（2026-10-30 digest）](/posts/daily/2026-10-30-ai-agent-github-digest)
