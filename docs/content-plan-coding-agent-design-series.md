# Content Plan：coding-agent-design 系列（對照學習主軸）

> 定案：2026-08-25，使用者確認「兩部曲 38 篇、雙語、直接全寫」。
> 舊 M1–M10 十篇（`2026-08-2*-python-coding-agent-*.md`）已標 `draft: true`，內容拆解重寫進本系列。

## 系列定位

每篇固定結構：**設計問題 → 五個參考專案怎麼做（原始碼證據）→ rivumi 的選擇與為什麼不同 → 論文／技術報告印證 → 還能改善什麼**。

五個參考專案（本地 shallow clone 在 `~/Projects/coding-agent-reference/`，證據格式 `repo/path/file.ext#symbolName`，禁止只給行號或編造）：
pi（badlogic/pi-mono）、omp（can1357/oh-my-pi，pi 的 fork）、opencode（sst/opencode）、codex（openai/codex）、claude-code（anthropics/claude-code decompiled v2.1.88）。
問題→查哪裡的路由表：`~/.claude/skills/coding-agent-reference/SKILL.md`。

rivumi 實作載體：`~/Projects/rivumi/`（stage docs 在 `docs/stages/`，研究筆記在 `.research/`，progress 在 `docs/progress.md`）。專案已從 coding_agent/PCA 改名 rivumi；M11 已移除 Ask/Agent 分離、改長駐外部 session；M12 啟動效能；M13 外部 CLI runtime 泛化（OpenCode/Pi/OMP adapter）；另有 NVIDIA NIM retry 強化與 OpenAI Responses API adapter（commit 32de79a）。

## 檔案規範

- 路徑：`src/content/posts/ai/YYYY-MM-DD-coding-agent-<slug>.md` 與 `-en.md`，date 用實際產出日
- frontmatter：category `ai`、type `deep-dive`、series name `"跟成熟 coding agent 學設計"`（en 版同名），order 見下表
- frontmatter 後跨語言連結行：zh 版 `> 🌏 [English version](/posts/ai/<slug>-en)`；en 版反向
- 文末必備 `## 參考資料`／`## References`，含真實連結（論文用 arxiv abs 頁；五專案用 GitHub repo 目錄連結）
- 學術依據對應到具體論文（ReAct、SWE-agent、Reflexion 等），第一次出現就要 inline 連結
- 台灣用語；正文每主張最多一個數字；引述克制

## 第一部「已實作的設計對照」（order 1–25）

| # | slug | 主題 | 吸收舊篇 | 主要 stage doc |
|---|------|------|---------|----------------|
| 1 | agent-loop-shapes | Agent loop 的形狀：事件流、checkpoint、resume | M1 | m1 |
| 2 | workspace-isolation | Workspace 隔離與 path policy | M1 | m1 |
| 3 | approval-grading | Approval 分級與 audit trail | M1/M2 | m1/m2 |
| 4 | verification-gate | Verification gate：驗過才算成功 | M1/M3 | m3 |
| 5 | model-provider-abstraction | ModelProvider 抽象 | M2/M4 | m2/m4 |
| 6 | provider-retry-policy | Retry policy 與錯誤分類 | — | progress nvidia-nim 節 |
| 7 | subscription-boundaries | 訂閱的正道與邪路（OAuth） | M4/M5 | m4/m5 |
| 8 | external-cli-backend | 外部 CLI 當 backend | M5/M10 | m5/m10 |
| 9 | edit-tool-tradeoffs | 編輯工具取捨（diff vs exact edit vs hashline） | M3 | m3 |
| 10 | sandbox-remote-execution | 沙箱與遠端執行（Cloudflare Sandbox） | M6 | m6 |
| 11 | small-model-coding | 小模型能寫程式嗎 | M3 | m3 |
| 12 | cli-ergonomics | CLI 人體工學 | M7 | m7 |
| 13 | onboarding-design | Onboarding 設計 | M8 | m8 + m12-onboarding |
| 14 | tui-to-transcript | 全螢幕 TUI 到 semantic transcript | M9/M10/M11 | m9/m10/m11 |
| 15 | runtime-capability-handshake | Runtime 抽象與 capability handshake | M13 | m13 |
| 16 | startup-performance-discipline | 啟動效能與工程紀律 | M12 | startup-performance-playbook |
| 17 | toolset-design-philosophy | 工具集設計哲學 | — | m1/m3 |
| 18 | session-persistence-crash-recovery | Session 持久化與 crash recovery | M2 | m2 |
| 19 | run-artifacts-contract | Run artifacts 契約 | M1 | m1 |
| 20 | headless-ci-mode | Headless 模式與 CI 使用 | — | m2 |
| 21 | gateway-pattern | Gateway 模式（OpenAI 相容轉譯） | M2 | m2 |
| 22 | why-python | 為什麼 Python（vs Rust/TS/Go） | — | — |
| 23 | testing-a-moving-agent | 測試一個會動的 agent | M13 | m13 tests |
| 24 | prompt-versioning | Prompt 版本控制 | M3 | m3 |

## 第二部「尚未實作——改善路線圖」（order 26–38）

每篇＝五家都有、rivumi 還沒有的能力。五家做法（file#symbol 證據）→ 學術依據 → rivumi 設計草案。

| # | slug | 主題 | 五家參考位置（routing table） |
|---|------|------|------------------------------|
| 26 | context-compaction | Context 壓縮與 compaction | omp snapcompact、codex core compact、cc src/context+services/compact |
| 27 | cross-session-memory | 跨 session 記憶 | omp mnemopi、cc src/memdir+SessionMemory |
| 28 | dangerous-command-interception | 危險指令攔截與 shell escalation | codex shell-escalation、execpolicy |
| 29 | os-level-sandboxing | OS 級沙箱 | codex sandboxing（landlock/seatbelt）、opencode containers |
| 30 | mcp-integration | MCP 整合 | codex codex-mcp、cc services/mcp、opencode mcp |
| 31 | hooks-skills-plugins | Hooks／Skills／Plugins 擴展機制 | cc src/hooks+skills+plugins、codex hooks/skills/plugin |
| 32 | subagent-worktree-isolation | Subagent 與 worktree 隔離 | omp subagent、cc src/tasks Task tool |
| 33 | session-recording-replay | Session 錄製與 replay | codex rollout/rollout-trace/thread-store |
| 34 | telemetry-cost-tracking | Telemetry 與成本追蹤 | pi telemetry、codex otel、cc cost-tracker |
| 35 | model-catalog-routing | Model catalog 與 per-role 路由 | omp catalog、40+ providers routing |
| 36 | lsp-integration | LSP 整合 | omp crates lsp/dap、cc services/lsp |
| 37 | code-mode | Code mode：工具呼叫編譯成程式批次執行 | codex code-mode-*、opencode codemode |

## 執行狀態

- [x] 舊 10 篇標 draft
- [x] 本計畫檔
- [x] Wave 1–4：37 篇雙語（74 檔）全部產出，series order 1–37 無缺號
- [x] pnpm check:references：0 error（14 條關鍵詞重疊 WARN，屬系列格式已知誤報）
- [x] pnpm lint：0 error；check:tw：37 篇 zh 全數 0 blocking
- [x] astro check：內容檔 0 error（src/server/agent-flow-workflow.ts 9 個 + src/lib/rag/model.ts 1 個為既有錯誤）
- [ ] 使用者 review＋抽樣事實複查（各 agent 回報的待複查主張清單見 session 紀錄）
- [ ] commit（等使用者點頭）

## 已知待複查重點（發佈前抽樣）

- claude-code 引用全部來自 decompiled v2.1.88，symbol 名可能與原版有出入（多篇文章已標註免責）
- rivumi 數字類主張未重跑驗證：M3 eval 5/5、511 tests、啟動 baseline 701ms/247ms
- 外部連結未逐一線上驗證：Agent SDK 文件新路徑、opencode repo org 是否搬遷（anomalyco vs sst）、Cloudflare Sandbox 文件
- 負向主張（「X 家沒有 Y」）基於 shallow clone 快照，上游可能已變

## 教訓（沿用 progress.txt）

- 平行寫稿要雙向查證：agent 抓錯我兩次、我抓錯 agent 兩次——數字與 file#symbol 引用抽樣複查
- 計數用字界比對（`grep -i exa` 會命中 example）
- M12 編號在 stage doc 與 progress.md 定義不一致（onboarding-credential-verification vs startup-performance）：引用時用功能名稱而非編號
