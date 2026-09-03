---
title: "AI Agent GitHub Digest — 2026-09-02"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, mcp, agent-security, personal-agent, rag]
lang: zh-TW
description: "個人 Agent 生態持續擴張的同時，官方等級的 skill 安全掃描器也上線——OpenClaw 破 38 萬星，NVIDIA SkillSpector 補上供應鏈防線"
tldr: "openclaw/openclaw 這款自架個人助理已經衝上 38 萬星，用單一 Gateway 串起 WhatsApp／Telegram／Slack 等聊天管道；同一週 NVIDIA 端出 SkillSpector，專門掃描 Claude Code／Codex／MCP skill 裡的 71 種漏洞模式，研究指出 26.1% 的 skill 有漏洞、5.2% 疑似惡意。另外 stablyai/orca 把多 agent 平行開發做成完整 IDE，VectifyAI/PageIndex 則用推理式樹狀索引挑戰「RAG 一定要向量資料庫」的預設。claude-code v2.1.257 新增 Containment Escape 安全規則，agno v3.0.5 把 embedding 失敗從默默吞掉改成如實回報。"
series:
  name: "AI Agent GitHub Digest"
  order: 18
---

> 🌏 [English version](/en/posts/daily/2026-09-02-ai-agent-github-digest-en)

## 今日亮點

個人 Agent 生態擴張與供應鏈風險，今天在 GitHub Trending 上同時出現——OpenClaw 這個自架個人助理已經滾到 38 萬星的規模，而 NVIDIA 幾乎同時端出 SkillSpector，專門掃描 Claude Code／Codex／MCP 生態的 agent skill 有沒有惡意程式碼。生態越大，「先掃描再安裝」就越不是選配。

## Trending Repos

### openclaw/openclaw ⭐ 388,497

[GitHub](https://github.com/openclaw/openclaw)　·　TypeScript　·　MIT（部分檔案除外）

- **是什麼**：一個自架的個人 AI 助理，用單一 Gateway 把模型、工具和聊天管道（WhatsApp、Telegram、Slack、Discord、Signal、iMessage 等）串在一起，同一套架構可以是一人用的個人助理，也可以是團隊共用部署，差別只在設定。
- **為什麼值得看**：延續這兩天「自架個人 Agent」的路線（昨天是 nanobot、CowAgent），但 OpenClaw 走得更完整——「trusted gateway, untrusted execution, deterministic policy」的架構把安全邊界講清楚：工具預設在 host 上跑，要接其他使用者或對外開放前得自己配置沙箱。
- **Tech Stack**：TypeScript／Node.js，Gateway 控制平面 + 多聊天管道 connector + skill/plugin 系統
- **上手難度**：低——一行安裝腳本或 `npm install -g openclaw` 即可，接上多個聊天平台的 API/Webhook 需要額外設定

---

### NVIDIA/SkillSpector ⭐ 15,531

[GitHub](https://github.com/NVIDIA/SkillSpector)　·　Python　·　Apache-2.0

- **是什麼**：NVIDIA 推出的 agent skill 安全掃描器，在你安裝一個 Claude Code／Codex／MCP skill 之前先掃一遍，找 prompt injection、資料外洩、supply-chain 風險等問題。
- **為什麼值得看**：README 直接引用研究數據——26.1% 的 skill 含有漏洞，5.2% 疑似帶惡意意圖。SkillSpector 用 71 種漏洞偵測規則涵蓋 17 個類別（prompt injection、記憶體污染、MCP 工具投毒等），跑兩階段分析（靜態規則 + 選用的 LLM 語意判讀），也是 NVIDIA Verified Skills pipeline 的一環。對照 OpenClaw 這類 skill 市集快速擴張，這類掃描器的急迫性只會更高。
- **Tech Stack**：Python，靜態規則 + AST/taint 分析 + YARA signature + 可選 LLM 語意評估，另串接 OSV.dev 查即時 CVE
- **上手難度**：低——`skillspector scan ./my-skill/` 就能跑，也有 Docker 版本免裝 Python

---

### stablyai/orca ⭐ 59,083

[GitHub](https://github.com/stablyai/orca)　·　TypeScript　·　MIT

- **是什麼**：YC 背景團隊做的 Agent 開發環境（ADE），讓你同時管理一整批平行跑的 coding agent（Claude Code、Codex、Cursor、OpenCode 等），桌面／手機／VPS 都能用。
- **為什麼值得看**：核心賣點是「Parallel Worktrees」——把同一個 prompt 同時發給五個 agent，每個都在自己獨立的 git worktree 裡跑，跑完直接比較結果、挑贏家合併。過去這類多 agent 平行開發多半停留在終端機或腳本層級，orca 把它做成完整 IDE 體驗，還有手機端可以看進度、送 follow-up。
- **Tech Stack**：TypeScript + Electron 桌面殼 + git worktrees 隔離 + 多 coding agent CLI 整合
- **上手難度**：中——桌面版下載即用，但要真正發揮平行開發的價值，得同時接上多個 agent 的訂閱或 API key

---

### VectifyAI/PageIndex ⭐ 35,476

[GitHub](https://github.com/VectifyAI/PageIndex)　·　Python　·　MIT

- **是什麼**：一種不用向量資料庫的文件檢索方法，把文件轉成樹狀目錄索引，讓 LLM 用推理在樹裡找到對的段落，而不是靠 embedding 相似度。
- **為什麼值得看**：主流 RAG 幾乎預設「向量資料庫 + chunking」，PageIndex 直接點名這個預設的問題——相似（similarity）不等於相關（relevance）。它在 FinanceBench 財報問答基準上跑出 98.7% 準確率，並宣稱在 420 頁文件上比直接餵原始 PDF 給模型便宜 16.6 倍。對長篇、結構清楚的專業文件（財報、法規、技術手冊）是個值得評估的另一條路。
- **Tech Stack**：Python，LLM 推理式樹狀索引（無向量資料庫、無 chunking），可搭配 OpenAI Agents SDK / Claude Agent SDK
- **上手難度**：中——`pip install pageindex` 概念上手快，但要判斷這種索引結構適不適合自己的文件類型，需要實際跑一輪評估

## Notable Releases

### Claude Code v2.1.257

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.257)

- **重要變更**：新增 Containment Escape 規則——auto mode 下，雲端 metadata credential 擷取、egress evasion、跨租戶存取這類行為不再自動放行，除非環境明確標記為預期行為；新增 Claude Fable 5.1 為預設 Fable 模型；新增 `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` 可強制所有 subagent 套用同一個模型設定。
- **Breaking Changes**：無重大 API 變更，但 `defaultMode: "bypassPermissions"` 若寫在 project／local `settings.json` 會被忽略，得改放到 user 或 managed settings，或改用 `--permission-mode`。
- **對你的影響**：如果你讓 agent 在 auto mode 下碰雲端環境，這次更新多一層防護，但也代表某些過去會自動放行的操作現在會先被擋下來要求確認，需要視情況把該操作標記為環境預期行為。

---

### agno v3.0.5

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.5)

- **重要變更**：embedding 失敗現在會如實回報，而不是被默默吞掉——ingestion 遇到失敗會標成 `failed`／`partial`，不會再謊稱 `completed`；新增 `partial` content status；新增 GandrTools 文字轉語音工具包。
- **Breaking Changes**：embedder 失敗時改成 raise `EmbeddingError`，不再回傳空陣列；AWS Bedrock embedding 失敗改丟 `EmbeddingError` 而非 `ModelProviderError`；`skip_if_exists=True` 不再跳過標記為 `failed`／`partial` 的內容，會重新嵌入。
- **對你的影響**：如果程式碼裡有 `except ModelProviderError` 包住 Bedrock embedding 呼叫，升級後就抓不到錯誤了，要改成 `except EmbeddingError`；另外你的知識庫裡過去顯示「completed」的內容，這次升級後可能被重新標記為 `failed`／`partial`——代表這些資料過去其實沒有真的完整索引過。這是昨天 `ingest_path` 預設關閉之後，agno 這週第二個把「失敗被默默蓋過去」改成「失敗要老實講」的修正。

## 今日收穫

OpenClaw 破 38 萬星和 NVIDIA 同週推出 skill 掃描器，看起來是兩件事，其實是同一件事的兩面：個人 Agent 的採用規模一旦跨過某個門檻，「skill 市集裡有多少東西沒人仔細看過」就從理論風險變成算得出比例的現實問題（26.1% 有漏洞、5.2% 疑似惡意）。生態擴張的速度，決定了安全工具鏈追趕的急迫程度。

## 參考資料

- [openclaw/openclaw](https://github.com/openclaw/openclaw)
- [OpenClaw README](https://raw.githubusercontent.com/openclaw/openclaw/main/README.md)
- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)
- [SkillSpector README](https://raw.githubusercontent.com/NVIDIA/SkillSpector/main/README.md)
- [stablyai/orca](https://github.com/stablyai/orca)
- [orca README](https://raw.githubusercontent.com/stablyai/orca/main/README.md)
- [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)
- [PageIndex README](https://raw.githubusercontent.com/VectifyAI/PageIndex/main/README.md)
- [Claude Code v2.1.257 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.257)
- [agno v3.0.5 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.5)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
