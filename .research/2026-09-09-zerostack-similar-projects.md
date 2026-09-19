# Research: ZeroStack 同類與相鄰 coding-agent 專案地圖

> 盤點日期：2026-09-09。這是一份代表性覆蓋，不宣稱永久窮盡；GitHub 新專案、產品授權與帳號政策都可能快速改變。

## 子問題

1. 大廠有哪些可直接在 terminal 使用、且擁有原生 agent loop 的 coding agent？
2. GitHub 上哪些開源專案已成熟，哪些仍是有潛力但需觀察的早期 harness？
3. 哪些專案最接近 ZeroStack 的輕量、單一執行檔或 Rust 路線？
4. 各專案在 provider、MCP、權限、長任務與產品成熟度上的定位有何差異？
5. 哪些候選其實是 IDE、GUI、orchestrator、sandbox 或 library，不應視為直接同類？

## 母群與選取方式

母群定義：可在 terminal 中直接讀寫 repository、執行工具並維持原生模型工具迴圈的 coding-agent CLI／harness；同時收錄大廠閉源產品作市場基準。純 IDE extension、GUI session manager、orchestrator、sandbox 與通用 agent framework 不進直接同類排名，但保留在相鄰類型，以免遺漏可借鏡的設計。

掃描方法：GitHub Topics 與 repository search、Agent CLI 選型指南系列、coding-agent 清單、候選推薦鏈，以及官方 README／文件與 GitHub repository metadata。

掃到的主要候選：ZeroStack、Claude Code、Codex CLI、GitHub Copilot CLI、Gemini CLI／Antigravity CLI、Kiro CLI、Cursor CLI、Amp、Grok Build、Muse Code、Warp、OpenCode、Goose、Aider、Pi、OMP、Crush、Qwen Code、Mistral Vibe、DeepSeek Harness、VT Code、Octomind、Plandex、Microsoft Amplifier、Forge、tau、Aether、OpenHarness、OpenAgere、OpenDev、Agent Code、CodingBuddy、RA.Aid、SWE-agent、OpenHands、Cline、Roo Code、Continue、Emdash、cmux、Daytona、Browser Use、Firecrawl、Ruflo、oh-my-openagent、OpenClaw、Hermes Agent、DeerFlow。

選入主表：大廠／商業基準 10 項、成熟開源 CLI 10 項、新興潛力 harness 15 項。Cline、Roo Code、Continue 偏 IDE；Emdash、cmux 偏多 session GUI；OpenHands 偏平台／遠端環境；Daytona 偏 sandbox；其餘通用 agent 與 workflow 工具列為相鄰類型。Amplifier 雖可直接作為 coding-agent CLI 使用，但官方將它標為 early-preview research demonstrator；它是中高優先的架構研究對象，不與成熟產品等量齊觀。

## 整理後的四層名單

### A. 大廠／商業 Agent CLI：市場與功能基準

| 專案 | 背後組織 | 開放程度 | 本研究定位 |
| --- | --- | --- | --- |
| Claude Code | Anthropic | 閉源 | 主表；功能、skills、hooks、sub-agent 與權限設計基準 |
| Codex CLI | OpenAI | Apache-2.0 | 主表；大廠產品中同時也是重要開源實作 |
| GitHub Copilot CLI | GitHub／Microsoft | 產品綁 Copilot 方案 | 主表；GitHub workflow 與訂閱整合基準 |
| Antigravity CLI | Google | 閉源 | 主表；Google 個人終端 agent 路線；與 Gemini CLI 分開記錄 |
| Gemini CLI | Google | Apache-2.0 | 保留；個人帳號政策已變動，需標示企業／API 路徑限制 |
| Kiro CLI | AWS | 閉源 | 主表；spec-driven 與 AWS 生態基準 |
| Cursor CLI | Anysphere | 閉源 | 主表；IDE 與 terminal／headless 銜接基準 |
| Amp | Amp Frontier | 閉源商業產品 | 主表；本機、遠端 Orbs 與 agent-to-agent 工作流 |
| Grok Build | xAI | 依官方當期授權 | 觀察；模型商原生 Agent CLI，供應商限制較強 |
| Muse Code | Meta | 閉源 | 觀察；模型商新進產品，成熟度與可用範圍需追蹤 |
| Warp | Warp | 程式碼與產品層次不同 | 相鄰；本體是 agentic terminal／development environment |

### B. 成熟或已有明確社群的開源 Agent CLI

| 專案 | 主要路線 | 收錄理由 |
| --- | --- | --- |
| OpenCode | 完整多 provider TUI | 成熟產品表面、provider onboarding 與 plan/build 模式基準 |
| Pi | 極簡 TypeScript harness | ZeroStack 明示靈感來源，適合研究最小 agent loop |
| OMP／OMP 2 | Pi fork → batteries-included／Rust 重寫 | 觀察極簡核心如何走向完整產品與獨立 runtime |
| Goose | Rust、本機 agent 與 extensions | 多 provider、本機執行及擴充架構 |
| Aider | Python terminal pair programmer | repo map、edit format、git、lint/test feedback loop |
| Qwen Code | 模型廠商主導的開源 CLI | 非西方模型供應商與低摩擦 onboarding 樣本 |
| Mistral Vibe | 模型廠商主導的輕量 CLI | 輕量 terminal agent 與 Mistral 生態樣本 |
| DeepSeek Harness | plugin-first harness | everything-is-a-plugin 的架構極端案例 |
| Plandex | 長任務／計畫導向 | 大型任務、context 與 plan 管理樣本 |
| SWE-agent | 軟體工程研究 Agent | 研究與 benchmark 導向；互動 UX 不是主比較點 |

### C. 新興且有潛力：需驗證後再升級

| 專案 | 暫定等級 | 為什麼值得看 | 升級前要驗證 |
| --- | --- | --- | --- |
| ZeroStack | 核心研究對象 | Rust、輕量、低資源、原生 agent loop | 同條件 benchmark 與長任務可靠性 |
| VT Code | 高 | Rust、多 provider、TUI、MCP、ACP、session 與安全控制 | 實測資源與 permission fail-closed |
| Octomind | 高 | Rust，同一 engine 暴露 CLI／pipe／daemon／WebSocket／ACP | cloud 生態與本機核心的邊界 |
| Microsoft Amplifier | 中高 | 薄核心、module、bundle、多 Agent 委派 | early preview、安全系統與 API 穩定性 |
| Crush | 中 | terminal-native、多模型 coding agent | 社群活性、release 與任務完成度 |
| Forge | 中 | Rust、多模型路由、TUI、headless 與本機 API | 授權、真實使用者與穩定性 |
| tau | 中 | Rust、TUI、headless、JSON-RPC、permissions 與 traces | 規模、bus factor、release 與實測 |
| Aether | 中 | Rust、強調 context 可控性 | repo 活性、工具完整度與實測 |
| OpenHarness | 觀察 | CLI＋SDK、多模型 | 自稱 benchmark 必須獨立重跑 |
| OpenAgere | 觀察 | 原生 coding-agent 候選 | 維護、授權與真實使用者 |
| OpenDev | 觀察 | 原生 terminal agent 候選 | 同上 |
| Agent Code | 觀察 | 輕量 coding CLI 候選 | 同上 |
| CodingBuddy | 觀察 | 多 provider coding assistant 候選 | 是否有完整原生 loop、維護與採用 |
| RA.Aid | 觀察 | repository-level autonomous agent | UX、更新狀態與任務可靠性 |
| Claw Code | 暫緩 | Rust 重寫 Claude Code 的概念接近 | 同名 repo、來源歷史與數據互相衝突 |

`microsoft/amplifier-agent` 不獨立進榜：它是可嵌入 Agent engine，現階段關注度極低，只作為 Amplifier 生態與可能的架構收斂方向註記。

### D. GitHub Topic 首頁常見的相鄰類型

| 類型 | 專案 | 與 ZeroStack 的距離 |
| --- | --- | --- |
| IDE Agent | Cline、Roo Code、Continue | 有完整 agent 能力，但主要入口與 UX 是 IDE |
| Agent 平台／遠端環境 | OpenHands | 可執行軟體工程任務，但產品範圍大於 CLI harness |
| Sandbox／執行基礎設施 | Daytona | Agent 的安全工作環境，不是 agent loop 本身 |
| Session manager／GUI | Emdash、cmux | 管理多個外部 Agent CLI，不自帶或不強調原生 loop |
| Workflow／orchestration | Ruflo、oh-my-openagent | 在既有 agent 之上做編排、路由與工作流 |
| 通用長駐 Agent | OpenClaw、Hermes Agent、DeerFlow | 面向通用工作與通訊管道，不以 repository coding 為唯一核心 |
| Agent 工具層 | Browser Use、Firecrawl | 提供瀏覽、抓取與資料能力，不是完整 coding agent |

## 覆蓋矩陣

| 維度 | 值 | 案例 | 缺口 |
| --- | --- | --- | --- |
| 實作路線 | Rust／single binary | ZeroStack、Goose、VT Code、Octomind | Goose 同時有桌面產品，定位較廣 |
| 實作路線 | TypeScript | OpenCode、Pi、Qwen Code、Gemini CLI | 完整覆蓋 |
| 實作路線 | Python／Go | Aider、Mistral Vibe、Plandex | 完整覆蓋 |
| 產品重心 | 輕量 terminal agent | ZeroStack、Pi、Mistral Vibe | 完整覆蓋 |
| 產品重心 | 完整多 provider TUI | OpenCode、VT Code | 完整覆蓋 |
| 產品重心 | 自動化／daemon／長任務 | Octomind、Plandex、Goose | 完整覆蓋 |
| 產品重心 | 模組化 Agent 平台 | Microsoft Amplifier | early preview，尚未形成成熟產品樣本 |
| 模型策略 | Provider-neutral | ZeroStack、OpenCode、Aider、VT Code、Octomind | 完整覆蓋 |
| 模型策略 | 廠商生態優先 | Gemini CLI、Qwen Code、Mistral Vibe | 完整覆蓋 |
| 生命週期 | 成熟／大社群 | OpenCode、Aider、Gemini CLI | 第三方成熟度只能用公開活動近似 |
| 生命週期 | 新興／快速演進 | VT Code、Octomind、Mistral Vibe | 完整覆蓋 |
| 生命週期 | 研究示範／API 未穩定 | Microsoft Amplifier | 官方警告尚未內建完整安全系統 |

偏誤：GitHub 搜尋與公開 README 偏向英文、公開且擅長自我呈現的專案；星數偏好較早出現或背後有大型組織的工具。沒有實際安裝與 benchmark，因此不能據此判定 agent 解題品質、RAM 或安全性高低。

## 來源清單

- [ZeroStack](https://github.com/gi-dellav/zerostack) — 官方一手；README 全文；訪問日：2026-09-09
- [OpenCode](https://github.com/anomalyco/opencode) — 官方一手；README 全文與 repository metadata；訪問日：2026-09-09
- [Aider](https://github.com/Aider-AI/aider) — 官方一手；README 全文與 repository metadata；訪問日：2026-09-09
- [Goose](https://github.com/block/goose) — 官方一手；repository metadata／既有官方定位，README 讀取失敗；訪問日：2026-09-09
- [Pi](https://github.com/earendil-works/pi) — 官方一手；repository metadata，根 README 讀取失敗；訪問日：2026-09-09
- [Qwen Code](https://github.com/QwenLM/qwen-code) — 官方一手；README 與 repository metadata；訪問日：2026-09-09
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — 官方一手；README 與 repository metadata；訪問日：2026-09-09
- [Mistral Vibe](https://github.com/mistralai/mistral-vibe) — 官方一手；README 與 repository metadata；訪問日：2026-09-09
- [VT Code](https://github.com/vinhnx/VTCode) — 官方一手；README 全文與 repository metadata；訪問日：2026-09-09
- [Octomind](https://github.com/Muvon/octomind) — 官方一手；README 全文與 repository metadata；訪問日：2026-09-09
- [Plandex](https://github.com/plandex-ai/plandex) — 官方一手；repository metadata；訪問日：2026-09-09
- [Microsoft Amplifier](https://github.com/microsoft/amplifier) — 官方一手；README 與 repository metadata；模組化 Agent CLI／平台，官方標示為 early-preview research demonstrator；訪問日：2026-09-09
- [Microsoft Amplifier Agent](https://github.com/microsoft/amplifier-agent) — 官方一手；README 與 repository metadata；獨立的可嵌入 Agent engine，作為 Amplifier 生態關係註記，不列為主要同類；訪問日：2026-09-09

新增分層名單的關鍵官方來源：

- [Claude Code](https://code.claude.com/docs)、[Codex CLI](https://github.com/openai/codex)、[GitHub Copilot CLI](https://github.com/github/copilot-cli)、[Kiro](https://kiro.dev)、[Cursor CLI](https://cursor.com/cli)、[Amp CLI](https://ampcode.com/docs/cli)
- [OMP](https://github.com/can1357/oh-my-pi)、[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)、[SWE-agent](https://github.com/SWE-agent/SWE-agent)
- [tau](https://github.com/nwyin/tau)、[Aether](https://github.com/contextbridge/aether)、[Forge](https://github.com/Adulari/forge)、[OpenHarness](https://github.com/AgentBoardTT/openharness)
- [OpenHands](https://github.com/All-Hands-AI/OpenHands)、[Cline](https://github.com/cline/cline)、[Roo Code](https://github.com/RooCodeInc/Roo-Code)、[Continue](https://github.com/continuedev/continue)、[Daytona](https://github.com/daytonaio/daytona)

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
| --- | --- | --- |
| ZeroStack | ✅ README 與架構文件 | 無 |
| OpenCode | ✅ README 與 metadata | 無 |
| Aider | ✅ README 與 metadata | 無 |
| Qwen Code、Gemini CLI、Mistral Vibe | ✅ README／metadata 的主要定位 | 批次結果部分截斷，不用於細節宣稱 |
| VT Code | ✅ README 與 metadata | 無 |
| Octomind | ✅ README 與 metadata | 無 |
| Goose | 🟡 metadata 與官方既有定位 | repository redirect 導致 connector 未取得 README |
| Pi | 🟡 metadata 與已知 package 定位 | monorepo 根 README 未由 connector 讀取 |
| Plandex | 🟡 metadata | 本輪未讀完整 README |
| Microsoft Amplifier | ✅ README 與 metadata | 官方明示 API、文件與安全機制仍在早期階段 |
| Microsoft Amplifier Agent | ✅ README 與 metadata | 關注度極低，僅用於釐清與主專案的定位差異 |

## 事實交叉表

| 事實 | 官方 README | GitHub metadata | 狀態 |
| --- | --- | --- | --- |
| OpenCode 是開源 terminal coding agent | 明確 | TypeScript repo、近期更新 | ✅ |
| Aider 是 terminal AI pair programmer，支援多模型、repo map、git、lint/test | 明確 | Python repo | ✅ |
| VT Code 是 Rust terminal coding-agent harness | 明確 | Rust repo、近期更新 | ✅ |
| Octomind 是 Rust、MCP-native、支援 interactive／pipe／daemon／WebSocket／ACP | 明確 | Rust repo、近期更新 | ✅ |
| Gemini CLI、Qwen Code、Mistral Vibe 是 vendor-backed terminal agents | 明確／repository description | 對應組織與近期更新 | ✅ |
| Microsoft Amplifier 是可直接使用的模組化 Agent CLI／平台 | 明確，CLI 是參考介面，底層由 core、foundation、modules 與 bundles 組成 | Microsoft 官方 repo、約 3.1k stars／261 forks（2026-09-09） | ✅ |
| Microsoft Amplifier 是成熟或具完整安全防護的產品 | 官方明確稱其為 research demonstrator、非正式產品，且尚未建好安全系統 | early preview、breaking changes 仍可能發生 | ❌ 不成立 |
| `microsoft/amplifier-agent` 可代表 Amplifier 的社群關注度 | 它是另行拆出的可嵌入 engine，不是主要 CLI repo | 約 8 stars／7 forks（2026-09-09） | ❌ 不成立 |
| ZeroStack 比所有候選更省資源 | ZeroStack 有作者 benchmark | 本輪沒有同條件跨專案測試 | ⚠️ 未驗證 |
| 某專案 agent 品質最好 | 各家 benchmark 條件不同 | 無同條件實測 | ⚠️ 不下結論 |

## 我的推論

| 推論 | 依據 | 可能錯在哪 |
| --- | --- | --- |
| VT Code 是目前功能形狀最接近 ZeroStack 的專案 | 同為 Rust terminal harness、多 provider、TUI、MCP、skills、ACP、session 與安全控制 | VT Code 功能更廣，未必同樣輕量 |
| Pi 最適合研究最小 agent loop | 它強調可擴充的 coding-agent 核心，ZeroStack 也明列受 Pi 啟發 | 本輪未完整讀取 monorepo package 文件 |
| Octomind 最值得 Looplane 研究 daemon 與多入口 runtime | 同一 engine 暴露 CLI、pipe、daemon、WebSocket 與 ACP | 其產品同時包含 cloud/tap 生態，複雜度不同 |
| OpenCode 是成熟產品表面與 provider UX 的主要比較基準 | 大型活躍社群、完整 TUI、build/plan agent 與多平台發行 | 社群規模不等於架構或 agent 品質較好 |
| Microsoft Amplifier 適合研究插件化 Agent 架構，但不適合作為成熟度標竿 | 薄核心、bundle、provider、tool、agent、behavior 與 CLI 分層清楚；同時官方明示仍是 research demonstrator | 模組拆分仍在快速變動，文件描述可能很快過期 |

## 草稿骨架

### 第一圈：最像 ZeroStack

VT Code、Octomind、Pi、Goose。前兩者同樣是 Rust agent runtime；Pi 是 ZeroStack 明示的靈感來源；Goose 也是 Rust、多 provider／extension-oriented 的本機 agent，但產品範圍更廣。

### 第二圈：成熟的 terminal coding agent

OpenCode、Aider。OpenCode 適合觀察 TUI、provider onboarding 與 build/plan 模式；Aider 適合研究 repository map、精準 edit format、git integration 與 lint/test feedback loop。

### 第三圈：模型廠商主導的開源 CLI

Gemini CLI、Qwen Code、Mistral Vibe。它們適合研究低摩擦 onboarding、廠商模型整合與發行策略，但 provider-neutral 程度各不相同。

### 第四圈：長任務與大型專案

Plandex、Octomind。它們比 ZeroStack 更強調 headless、長時間執行、計畫／context 管理或 daemon 化。

### 架構研究支線：Microsoft Amplifier

`microsoft/amplifier` 是值得列入的中高優先研究對象：它本身能以 CLI 執行 coding-agent 工作，但真正重點是把 provider、tool、agent、orchestrator 與 behavior 組成 bundle，並讓 CLI 只作為其中一種介面。它適合用來研究薄核心、模組協定、依賴注入、多 Agent 委派與 preset／bundle 設計。

不過 Amplifier 官方明確稱它為 early-preview research demonstrator，而非正式產品，並警告尚未內建完整安全系統。因此它不能用來代表成熟度或生產可靠性。`microsoft/amplifier-agent` 則是另行拆出的可嵌入 engine，現階段關注度很低，只保留為生態與架構關係註記，不另列為 ZeroStack 主要同類。

## 待解問題

- 在相同機器與模型下，ZeroStack、VT Code、Goose、Octomind 的 cold start、idle RSS 和一次 tool loop 成本如何？
- 各專案的 permission model 是否真正 fail-closed？
- Pi package 的最新功能邊界與公開 roadmap 為何？
- Goose repository redirect 後的正式 owner、README 與目前授權狀態需再確認。
- Amplifier 的 `amplifier-core`／`amplifier-foundation`／`amplifier-app-cli` 與新 `amplifier-agent` 是否正在收斂成新的正式架構，需追蹤 roadmap 與後續 release。
