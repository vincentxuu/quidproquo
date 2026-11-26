# L8「Agent design V: cost-effective agents」主張查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 L8 投影片（`sources/slides/8_agent_design_5.pdf`，54 頁；頁碼 = PDF 頁序，已用 `pdftotext -f N -l N` 逐頁對過，跟研究筆記一致；投影片頁尾印的號碼從 p28 起比 PDF 頁多 2 以上，不用）與課程筆記 notes/cost-effective-agents。
- 工具：本 session 沒有掛 Groundlane MCP；Groundlane 直接 HTTP 先前回 401；Exa connector 斷線（404）。一手頁面全部用 `curl -sL` 直接抓原頁（Anthropic 文件 `.md`、OpenAI 文件 `.md`、Anthropic Engineering、OpenCode 與 Codex 文件）、arXiv export API、OpenReview API、GitHub API（`gh api`），全部 200，沒有再往下降級。
- 判定：Confirmed（原文支持）｜Outdated（原文成立但現況已變）｜Contradicted（與原文不符）｜Not found（原文查不到該數字或說法）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 34 |
| Confirmed（需加條件） | 2 |
| Outdated | 1 |
| Contradicted | 0 |
| Not found | 2 |
| 未逐項查（正文只寫成投影片說法） | 1 |

共 40 項。

## 課程筆記比對

2026-10-22 重抓 https://cs2680.com/notes/cost-effective-agents ，去除 HTML 後和 2026-10-21 存檔 `sources/pages/notes_cost-effective-agents.txt` 逐句比對：正文相同，只多了目錄列與頁尾版權。頁尾仍寫 "Selected sources from the supplied literature map, reviewed September 27, 2026."

## 查證表

| # | 主張 | 頁 | 來源 URL | 原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | Claude API output 是 base input 的 5× | p21 | https://platform.claude.com/docs/en/about-claude/pricing | 模型表：Opus 5.5 $4 in／$20 out、Sonnet 5.5 $2／$10、Haiku 4.5 $1／$5 等，各模型皆為 5 倍 | Confirmed |
| 2 | 批次 input 0.5× | p21 | 同上 | "The Batch API allows asynchronous processing of large volumes of requests with a 50 percent discount on both input and output tokens." | Confirmed |
| 3 | 命中快取的 input 0.1× | p21 | 同上 | "Cache read (hit) 0.1x base input price (0.025x on Claude Fable 5.1 and Claude Mythos 5.1; 0.05x on Claude Opus 5.5 and Claude Sonnet 5.5)" | Outdated（多數模型仍 0.1×，最新幾款更便宜；正文用表格列出） |
| 4 | 批次＋快取 0.05× | p21 | 同上 | "These multipliers stack with other pricing modifiers, including the Batch API discount and data residency." | Confirmed |
| 5 | 投影片沒列的寫入快取價格 | p21 | 同上 | "5-minute cache write 1.25x base input price"；"1-hour cache write 2x base input price" | Confirmed（正文補上） |
| 6 | 典型價格比 cache read : input : output ＝ 1 : 10 : 50 | p15 | 同上 | 0.1 : 1 : 5，與 #1、#3 一致 | Confirmed（對 0.1× 的模型） |
| 7 | turn 數加倍，重讀量約平方成長；有快取時仍平方成長，只是係數變小 | p9 | 推論（第 k 個 turn 重讀前 k−1 個 turn；快取只改單價，不改讀取量） | — | Confirmed（推論，正文寫明） |
| 8 | 快取依 tools → system → messages 順序比對，改工具定義整份失效 | 橋接段 | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | "Prompt caching references the entire prompt: tools, system, and messages (in that order)"；"Modifying tool definitions (names, descriptions, parameters) invalidates the entire cache" | Confirmed |
| 9 | 時間戳讓快取失效，每次都付寫入卻讀不到 | 橋接段、自我檢查 | 同上 | "a per-request block containing a timestamp and the user message (block 6) … The timestamp differs, so the prefix hash at block 6 differs … You pay for a fresh cache write on every request and never get a read." | Confirmed |
| 10 | OpenAI 建議把時間戳等動態內容放到最後 | 橋接段 | https://developers.openai.com/api/docs/guides/prompt-caching | "If developer instructions or shared material contain timestamps, user-specific content, or other dynamic content, place those at the end rather than the beginning, or move them into later conversation messages." | Confirmed |
| 11 | Anthropic 最短可快取長度 512–4,096 token（依模型） | 橋接段 | Anthropic prompt caching | "512 tokens for Claude Fable 5.1 … 2,048 tokens for … Claude Opus 4.7；4,096 tokens for Claude Opus 4.6 and Claude Opus 4.5；1,024 tokens for … Claude Sonnet 4.6 …；4,096 tokens for Claude Haiku 4.5" | Confirmed |
| 12 | Anthropic 預設 5 分鐘、每次命中重新計時 | 橋接段 | 同上 | "By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used." | Confirmed |
| 13 | OpenAI GPT-5.6 以後最短 1,024 token、預設 30 分鐘 | 橋接段 | OpenAI prompt caching | "The minimum cacheable prompt length is 1,024 tokens for GPT-5.6 and later"；"`\"30m\"` (default) 30 minutes 1.25× the uncached input-token rate" | Confirmed |
| 14 | 筆記：較短的 prompt 不一定較便宜 | 橋接段 | cs2680.com/notes/cost-effective-agents | "a shorter prompt is not necessarily a cheaper prompt if it destroys a valuable cache hit"；"If a provider discounts a stable cached prefix, shortening or reordering it can also remove a discount." | Confirmed |
| 15 | 獨立評測：快取省 41–80% API 費用；整份 context 都快取有時延遲變長 | 橋接段（本站補充） | https://arxiv.org/abs/2601.06007（Lumer et al., 2026-01-09） | "prompt caching reduces API costs by 41-80% and improves time to first token by 13-31% across providers … naive full-context caching, which can paradoxically increase latency"；500+ sessions、三家廠商 | Confirmed |
| 16 | 筆記：$120／80 次 vs $90／75 次，80% 門檻下新版不合格 | 反成本段 | 課程筆記〈Measure the whole episode〉 | "a baseline that costs $120 and succeeds 80 times costs $1.50 per success. A candidate that costs $90 and succeeds 75 times costs $1.20 per success … If the deployment requires at least 80% success, the candidate is ineligible" | Confirmed |
| 17 | 筆記：快 20%、貴 30% 是買了延遲 | 綜合自我檢查 3 | 課程筆記〈Reduce waiting〉 | "A system that is 20% faster but 30% more expensive has purchased latency rather than reduced cost." | Confirmed |
| 18 | 筆記：只讀或冪等的推測動作容易撤銷，寫入要快照與回滾 | 推測執行段 | 同上 | "Read-only or idempotent operations are easier to cancel; writes may require snapshots, validation, and rollback." | Confirmed |
| 19 | ACON 峰值 context 減 26–54% | p17（正文未引用） | https://arxiv.org/abs/2510.00615 | "ACON reduces peak token usage by 26-54% while improving task success"（AppWorld、OfficeBench、Multi-objective QA） | Confirmed |
| 20 | Active Context Compression 減 23% token | p17（正文未引用） | https://arxiv.org/abs/2601.07190 | "Focus achieves 22.7% token reduction … while maintaining identical accuracy (3/5 = 60% for both agents)"；"N=5 context-intensive instances from SWE-bench Lite using Claude Haiku 4.5" | Confirmed（需加條件：只有 5 題、單一模型） |
| 21 | LLMLingua 最多 20× | p17（正文未引用） | https://arxiv.org/abs/2310.05736 | "allows for up to 20x compression with little performance loss" | Confirmed |
| 22 | Code execution with MCP：150K → 2K token | p17（正文未引用） | https://www.anthropic.com/engineering/code-execution-with-mcp（2025-11-04） | "This lets the agent load only the definitions it needs for the current task. This reduces the token usage from 150,000 tokens to 2,000 tokens" | Confirmed（需加條件：數字對應的是按需讀取工具定義的整體做法，投影片寫成 "filter results in code"） |
| 23 | Tool Search 減 85% 工具 token | p17（正文未引用） | https://www.anthropic.com/engineering/advanced-tool-use（2025-11-24） | "This represents an 85% reduction in token usage while maintaining access to your full tool library." | Confirmed |
| 24 | Programmatic Tool Calling 減 37% | p17（正文未引用） | 同上 | "Average usage dropped from 43,588 to 27,297 tokens, a 37% reduction on complex research tasks." | Confirmed |
| 25 | Tool-making agents（2026）減 58% output token | p20（正文未引用） | arXiv API 以 ti:tool-making、abs:output tokens 搜尋 | 查無對應論文 | Not found |
| 26 | Speculative Actions（ICLR 2026）；最多猜中 55%、延遲最多降 20% | p35–36、正文 | https://arxiv.org/abs/2510.04371；OpenReview API | "up to 55% next-action prediction accuracy, translating into up to 20% latency reductions"；OpenReview：ICLR 2026 Oral（題名 "…for Faster AI Agents"） | Confirmed |
| 27 | PASTE（arXiv 2026）：從過去軌跡預測下一個工具 | p37 | https://arxiv.org/abs/2603.18897 | "predicts concrete future tool invocations from recurring agent patterns and executes them speculatively while the LLM is still generating" | Confirmed |
| 28 | SPORK（arXiv 2026）：同一模型分支提早發工具呼叫 | p37 | https://arxiv.org/abs/2607.03333 | "Self-Speculative Forking … training-free" | Confirmed |
| 29 | 八個 harness 的作者與語言 | p46 | GitHub API（2026-10-22） | openai/codex Rust；anomalyco/opencode TypeScript；earendil-works/pi TypeScript；can1357/oh-my-pi TypeScript（"Built by Stencil Labs"）；openclaw/openclaw TypeScript；NousResearch/hermes-agent Python；deepseek-ai/deepseek-harness TypeScript；各 repo 2026-10 仍有 push | Confirmed |
| 30 | Codex：沒有網路的 sandbox，要出 sandbox 才請核准 | p47 | https://developers.openai.com/codex/agent-approvals-security | "Defaults include no network access and write permissions limited to the active workspace"；"Codex asks for approval to edit files outside the workspace or to run commands that require network access." | Confirmed |
| 31 | Codex：patch 格式由 Lark 文法規定 | p47 | codex-rs/core/src/tools/handlers/apply_patch_spec.rs | `const APPLY_PATCH_LARK_GRAMMAR: &str = include_str!("../../../assets/tools/apply_patch.lark");` | Confirmed |
| 32 | DeepSeek Harness：everything is a plugin | p46、p48 | deepseek-ai/deepseek-harness README | "built on an **everything-is-a-plugin** architecture"；"in _developer preview_" | Confirmed |
| 33 | OpenCode：TUI 與其他客戶端共用 OpenAPI 伺服器 | p49 | https://opencode.ai/docs/server | "When you run `opencode` it starts a TUI and a server. Where the TUI is the client that talks to the server. The server exposes an OpenAPI 3.1 spec" | Confirmed |
| 34 | Pi：不內建 subagent | p50 | earendil-works/pi README | "Pi ships with powerful defaults but skips features like sub-agents and plan mode." | Confirmed |
| 35 | Pi：核心四個工具、沒有 MCP 與核准、pi-ai 42 providers、keep-alive 門檻 $0.05 | p50 | — | 未逐項查 | 未逐項查（正文只寫「四個工具、沒有 MCP、subagent 與核准」並標為投影片整理；42、$0.05 不寫） |
| 36 | oh-my-pi：hashline 編輯 | p51 | can1357/oh-my-pi README | "### 11 · Hashline: edit by content hash"；"`edit` — hashline patches with content-hash anchors" | Confirmed |
| 37 | Hermes Agent：context 用到 50% 就壓縮 | p53 | NousResearch/hermes-agent `hermes_cli/setup.py` | `config["compression"]["threshold"] = 0.50`；`Compression threshold (0.5-0.95)` | Confirmed（預設值；可調到 0.95） |
| 38 | OpenClaw：27 個聊天頻道、壓縮前先寫帶日期筆記、fences／taint／sentinels | p52 | openclaw/openclaw README | README 以正規式搜不到頻道數與 pre-compaction 筆記 | Not found（正文不寫 27，只寫壓縮前記筆記並標為投影片整理） |
| 39 | Claude Code 沒有獨立頁 | p46–53 | 逐頁標題 | p47 Codex、p48 DeepSeek、p49 OpenCode、p50 Pi、p51 oh-my-pi、p52 OpenClaw、p53 Hermes | Confirmed |
| 40 | p38 寫「Remember this for your Assignment 4!」；作業 3 要做的就是這套流程 | p38 | 投影片 p38；作業頁（研究筆記 A3 段） | 作業 3：「優化周圍一切、維持 task success 不變，同時壓低 cost 與 latency」 | Confirmed（正文照引原句，再補作業 3 的對應） |

## 反證與補充

- 〈Don't Break the Cache〉（#15）是 2026 年三家廠商的獨立評測，支持「prefix 穩定比 prompt 短更重要」，也補上反面：不加區分地快取整份 context 可能讓延遲變長。
- #20 Active Context Compression 的 23% 只在 5 題、單一模型上量到，若要引用必須附條件；正文沒有引用。
- p17、p20 的 ADVANCED 頁數字正文都沒有引用，只留查證紀錄。
