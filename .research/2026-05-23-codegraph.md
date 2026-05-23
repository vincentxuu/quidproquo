# Research: CodeGraph（colbymchenry/codegraph）— 本地端程式碼知識圖譜 / MCP server

> 研究日期：2026-05-23。狀態：草稿骨架完成，待餵 `post` skill 套 `tech-deep-dive` 模板。

## 子問題

1. 知識圖譜怎麼建？tree-sitter 抽取的 node/edge 模型、reference resolution、SQLite/FTS5 儲存、auto-sync 的實作細節。
2. 9 個 MCP 工具各自做什麼？特別是 `context`/`explore` 這類「重」工具 vs `search`/`callers`/`callees`/`impact`/`node` 這類「輕」工具的分工。
3. Benchmark 方法論可不可信？`claude -p` headless、`--strict-mcp-config`、median of 4、7 repos 的設計與可複現性。
4. 「只在 agent 直接查詢時才省錢」這個反直覺洞察 — 為什麼 delegate 給讀檔 subagent 反而讓 CodeGraph 變 overhead？
5. 跟替代方案怎麼比？原生 grep/Read、LSP（Serena）、Codanna、ctags、其他 code-graph MCP。
6. 限制與已知問題：`database is locked`/WASM fallback、小專案無效益、config 移除、1MB 略過、.gitignore 行為。

## 來源清單

- [GitHub README（rendered, 抓取當下 HEAD）](https://github.com/colbymchenry/codegraph) — 官方一手；訪問日 2026-05-23。權威版本，含**新版** benchmark（7 repos / Opus 4.7 / v2.1.145 / median of 4）。
- [raw README on main（CDN 快取）](https://raw.githubusercontent.com/colbymchenry/codegraph/main/README.md) — 官方一手但**為舊快取**；訪問日 2026-05-23。顯示**舊版** benchmark（6 codebases / Opus 4.6 / single Explore agent / 92% fewer tool calls）。⚠️ 與 rendered 版衝突，見交叉表。
- [repo CLAUDE.md](https://github.com/colbymchenry/codegraph/blob/main/CLAUDE.md) — 官方一手；確認「Extraction is deterministic — derived from AST, not LLM-summarized」「SQLite (FTS5)」「同一 binary 當 installer/indexer/MCP server」。
- [npm @colbymchenry/codegraph](https://www.npmjs.com/package/@colbymchenry/codegraph) — 官方；版本 **0.7.9**，13 小時前發布（極高頻迭代）。npm README 標語仍是舊的「94% fewer tool calls · 77% faster」。
- [作者 Medium：I Cut Claude Code Exploration Time and Costs by 90%](https://medium.com/@me_82386/i-cut-my-claude-code-api-costs-by-40-with-one-tool-12cf4306a1ab) — 一手作者；訪問日 2026-05-23。早期定位（單 Explore agent micro-benchmark，~94% fewer / ~82% faster on VSCode）。讀者首問：「How is this different from an LSP?」
- [Graham Brooks：Building a Code Knowledge Graph for AI Agents（codemap）](https://www.grahambrooks.com/post/building-a-code-knowledge-graph-for-ai-agents) — 高品質二手 / 獨立再實作；codemap 是 codegraph 的 Rust 重寫（17 MCP tools、rmcp、stdio+HTTP），印證概念。
- [Codanna Discussion #30：Differences with Serena?](https://github.com/bartolli/codanna/discussions/30) — 二手 / 競品作者；對比 LSP（Serena）vs precomputed graph + embeddings。
- [jCodeMunch vs Alternatives](https://j.gravelle.us/jCodeMunch/versus.php) — 二手；Serena 的 LSP 安裝負擔、tree-sitter self-contained 的取捨。
- [Project AEGIS — Benchmarking AI Agents (ManoMano)](https://medium.com/manomano-tech/project-aegis-benchmarking-ai-agents-and-why-serena-is-our-new-must-have-311673db35dd) — 二手獨立 benchmark；「快速探索用 vanilla Claude；Serena 在小任務反而貴 4x、慢 60%」→ 跟 CodeGraph「小 repo 邊際變窄」互相印證。
- [HN：persistent code graph that cuts Claude Code token usage / I replaced grep with a knowledge graph](https://news.ycombinator.com/item?id=47314090) — 二手；同類工具（code-review-graph、DeusData 的 Go binary）的 token 節省宣稱（8x–120x），佐證賽道熱度。

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| 架構：tree-sitter → 抽 node(函式/類別/方法)/edge(calls/imports/extends/implements) → SQLite + FTS5 → reference resolution → OS file-event auto-sync（2s debounce） | README How It Works | repo CLAUDE.md（FTS5、AST-deterministic） | ✅ |
| 抽取為**確定性**（純 AST，非 LLM 摘要、**無 vector embedding**） | repo CLAUDE.md「derived from AST, not LLM-summarized」 | README 全文無 embedding/vector 字樣；只有 FTS5 全文 | ✅（「semantic」指結構感知，非向量語意） |
| 9 個 MCP 工具：search / context / callers / callees / impact / node / **explore** / files / status | README MCP Tools 表（含 explore） | commit #226「add codegraph_explore to the MCP Tools table」 | ✅ |
| **新版** benchmark：7 repos、Opus 4.7、Claude Code v2.1.145、`claude -p` headless、`--strict-mcp-config`、median of 4、WITH vs 空 MCP config | README rendered HEAD | 第一次 tavily extract 同段方法論文字 | ✅ |
| 新版平均：**35% cheaper · 59% fewer tokens · 49% faster · 70% fewer tool calls** | README rendered HEAD | （單一權威源） | ✅（官方一手；無第三方獨立複現） |
| 新版 tool-calls 計數**含 sub-agent 內部呼叫**；Cost = `total_cost_usd` | README 方法論段 | — | ✅ |
| **舊版** benchmark：6 codebases、Opus 4.6、v2.1.91、single Explore agent、**92% fewer tool calls · 71% faster**（VSCode 94%/82%） | raw README（舊快取） | 作者 Medium（~94%/~82% on VSCode） | ❌ conflict — 與新版方法論並存於不同抓取；判定為**版本演進**：專案已從「單 Explore agent micro-benchmark」改為「端到端 median-of-4」，標語也從 94%→~35%/~70% |
| 關鍵洞察：「CodeGraph only helps when queried **directly**… delegate exploration to file-reading sub-agents → sub-agent reads files regardless and CodeGraph becomes **overhead**」 | README「Why CodeGraph wins」段（逐字） | 與使用者所述框架一致 | ✅ |
| 安裝後寫入 `~/.claude/CLAUDE.md` 的指令：**NEVER** call `codegraph_explore`/`codegraph_context` 在 main session（會塞爆 context）；**ALWAYS** spawn Explore agent；main session 只准用輕量工具（search/callers/callees/impact/node） | README Global Instructions Reference（逐字） | — | ✅（與上一條的張力即文章核心，見下「待解」） |
| 增益隨 codebase 規模放大；小 repo（Gin ~150 files）原生搜尋已便宜、邊際變窄（Gin 僅 22% cheaper / 19% fewer calls） | README per-repo 表 + 說明 | ManoMano AEGIS：小任務 vanilla Claude 勝過 Serena | ✅（跨工具互相印證） |
| 100% 本地、無 API key、SQLite only、MIT | README + npm | repo CLAUDE.md | ✅ |
| 支援 19+ 語言（TS/JS/Py/Go/Rust/Java/C#/PHP/Ruby/C/C++/Swift/Kotlin/Scala/Dart/Svelte/Vue/Liquid/Pascal…）+ 14 框架路由感知（route node） | README Supported Languages / Framework-aware Routes | — | ✅ |
| `.codegraph/config.json` 與整個 config 介面**已移除**（#283/#285）；改為「副檔名對應到支援語言就索引、.gitignore 為唯一真實來源」；maxFileSize（1MB）改為常數；committed 但非 gitignored 的 vendor/、dist/ 現在會被索引 | README rendered（commit note #285） | raw README 仍顯示舊 config.json（佐證為近期變更） | ✅（current = config 已移除；舊文件殘留於快取） |
| WASM SQLite fallback 比 native（better-sqlite3）慢 5–10x，且 journal mode 讓 writer 擋 reader → 索引時 MCP 查詢可能 `database is locked`；`codegraph status` 看 `Backend:` 行 | README Troubleshooting | — | ✅ |
| 分發改為 **self-contained 原生 binary**（install.sh / install.ps1，「No Node.js required」）；舊版需 Node 18+ | README rendered（badge「Self-contained」、Get Started） | Medium 舊文要求 Node 18+（佐證演進） | ✅ |
| 熱度：GitHub ~18.3k stars / 1k forks；npm 0.7.x 高頻發版 | README rendered（star/fork 數） | npm（13h 前發布） | ✅ |
| 已被獨立再實作：`codemap`（Rust，17 tools） | grahambrooks.com | — | ⚠️ 單源但屬獨立佐證 |

## 草稿骨架

（以下可直接丟給 `post` skill 的 `tech-deep-dive` 模板；category 建議 `ai`，type `deep-dive`）

### 核心概念

AI coding agent（Claude Code、Cursor、Codex、opencode）每次要「理解」一個 codebase，都得用 grep/glob/Read 把檔案掃一遍——每個 tool call 燒 token、每個檔案吃 context window，而且關掉 session 後這些昂貴的「理解」全部蒸發，下次從零再付一次「探索稅」。CodeGraph 把這件事**前置且持久化**：用 tree-sitter 把原始碼解析成 AST，抽出符號（函式/類別/方法）與關係（呼叫/import/繼承/實作）存進專案內的 SQLite（FTS5 全文索引），讓 agent 用一次圖查詢拿到「入口點 + 相關符號 + 程式碼片段 + 關係圖」，而不是檔案層級的盲掃。關鍵字「semantic」這裡指的是**結構感知**（structure-aware），不是向量 embedding——抽取是純 AST、確定性的，沒有 LLM 摘要、沒有 vector DB。

### 關鍵設計決定

- **確定性 AST，而非 embedding**：跟「RAG-on-code」路線（先 chunk、embed、向量檢索）分道揚鑣。好處是查詢結果可重現、零 API 成本、100% 本地；代價是只懂「結構/字面」，不懂「概念相似」（問「找驗證邏輯」不會自動命中沒寫到關鍵字的程式）。
- **重/輕工具二分**：`context`/`explore` 會回傳大量原始碼（適合一次性灌進探索情境），`search`/`callers`/`callees`/`impact`/`node` 是輕量指標查詢。安裝器寫進 `CLAUDE.md` 的規則明確：**main session 只准用輕量工具**做下手前的定點查詢，**任何「X 怎麼運作」的探索一律丟給 Explore subagent**，避免重工具把主對話的 context 塞爆。
- **OS 級 file-event auto-sync**：用 FSEvents/inotify/ReadDirectoryChangesW + 2 秒 debounce 增量同步，圖跟著你寫 code 即時更新，零設定。
- **砍掉設定面**（#283/#285）：移除 `.codegraph/config.json` 整個介面，改成「副檔名對得上支援語言就索引、.gitignore 是唯一真實來源」。這是刻意減少 footgun——少一個會配錯的地方。
- **Self-contained 分發**：從「需要 Node 18+」改成單一原生 binary（install.sh / install.ps1，one command grabs the right build），降低 CI / 容器 / 跨機器的安裝摩擦——這也是被 Rust 重寫（codemap）施壓後的方向。

### 跟替代方案的比較

- **vs 原生 grep/Read（agent 內建）**：CodeGraph 的全部價值主張。大 repo 上 agent 用幾次圖查詢、**零檔案讀取**就答完；原生路線把預算燒在 discovery（find/ls/grep）才開始讀對的檔案。但小 repo（Gin ~150 檔）原生搜尋本來就便宜，CodeGraph 邊際收斂——ManoMano 的 AEGIS benchmark 也得到同方向結論（快速探索用 vanilla Claude，重工具反而貴）。
- **vs LSP（Serena，21k+ stars）**：這是讀者最常問的「跟 LSP 有什麼不同？」。LSP 是**即時、型別感知**的查詢（精準的 rename、跨檔 reference、symbol 編輯），但每個語言要裝對應 language server（安裝負擔重、CI 環境痛），且每次查詢都重新打 LSP、不存關係。CodeGraph 是**預算好、持久化**的 AST 圖 + FTS5：查詢 O(ms)、self-contained、跨語言一張圖，代價是 reference resolution 不如活的 language server 深（別名/繼承/型別收窄）。一句話：要做大規模結構性改寫選 LSP/Serena；要快速探索 + 低成本問答選圖。
- **vs RAG-on-code / embedding 路線（如 Codanna 從 doc comment 生 embedding）**：CodeGraph 不碰向量，換取確定性與零成本，放棄概念相似搜尋。
- **賽道熱度**：同類 MCP（code-review-graph、DeusData Go binary、GitNexus 7k+ stars、code-graph-rag-mcp 26 methods）都在打「token 省 8x–120x」的訴求；CodeGraph 的差異化是「有公開、端到端、可被質疑的 benchmark」+ 高頻迭代 + 多 agent 支援。

### Benchmark 方法論（值得單獨拉一節）

新版方法論相當克制：每個 arm 是 `claude -p`（Opus 4.7、Claude Code v2.1.145）headless 跑，`--strict-mcp-config` 確保 WITH=只開 CodeGraph、WITHOUT=空 MCP config，兩邊都保留內建 Read/Grep/Bash；同一題每 arm 跑 4 次取**中位數**；Cost 直接取 `total_cost_usd`；**tool calls 連 sub-agent 內部呼叫都算進去**。7 repos 跨 7 語言，`--depth 1` clone、用同一個 build 索引。結果：平均 **35% cheaper · 59% fewer tokens · 49% faster · 70% fewer tool calls**，且增益隨 repo 變大而放大（Tokio 52% cheaper、Gin 只有 22%）。

**重點對照**：這是從早期「單一 Explore agent micro-benchmark」（VSCode 94% fewer tool calls / 82% faster、標語 94%/77%）退到更誠實的端到端數字（~35%/~70%）。專案連 README 標語都改了。對讀者的教訓：**micro-benchmark 的「94%」是某個 subagent 的工具呼叫數，不是你帳單上的省錢幅度**；要看 `total_cost_usd` 的 median-of-N 才作數。仍待補：目前只有官方一手數據，沒有第三方獨立複現。

### 「為什麼只在直接查詢時才省錢」（文章核心張力）

README 兩段話表面打架，其實是 context engineering 的精髓：
- 「Why CodeGraph wins」說：CodeGraph **只有被直接查詢時才有用**；如果把探索 delegate 給一個「會讀檔的」subagent，那個 subagent 照樣讀檔，CodeGraph 純粹變成 overhead。
- 但安裝器寫進 `CLAUDE.md` 的規則又說：**絕對不要**在 main session 直接呼叫 `explore`/`context`（會塞爆主 context），**一律 spawn Explore subagent**。

兩者的調和點：重工具（explore/context）回傳大量原始碼 → 該丟進**會用 CodeGraph 的** subagent（subagent prompt 明確要求「以 `codegraph_explore` 為主工具、不要重讀它已回傳的檔案」）；輕量工具（search/callers/impact/node）→ 留在 main session 做下手前定點查。真正的反模式是**把探索丟給一個忽略 CodeGraph、只會 grep/read 的泛用 subagent**——那等於白裝。換句話說：省不省錢不取決於「有沒有裝 CodeGraph」，而取決於「agent 的工具編排有沒有真的走圖」。

### 適合 / 不適合的情境

- **適合**：中大型、多語言、結構複雜的 repo；反覆探索/問答型工作流；在意 API 成本與 token；要 100% 本地、不外送程式碼；想把「affected tests」接進 CI（`codegraph affected` + git diff）。
- **不適合 / 收益低**：小專案（原生 grep 已夠便宜）；需要型別精準的大規模重構（LSP/Serena 更合適）；需要「概念相似」語意搜尋（要 embedding 方案）；工具編排會把探索 delegate 給讀檔 subagent 的設定（CodeGraph 變 overhead）。

### 限制 / 已知問題

- 只有官方一手 benchmark，**無第三方獨立複現**；數字隨版本（0.7.x 高頻迭代）會動。
- `better-sqlite3` 裝不起來時退 WASM fallback，慢 5–10x，且索引中 MCP 查詢可能 `database is locked`（看 `codegraph status` 的 `Backend:` 行；裝 build tools 後 `npm rebuild`）。
- >1MB 檔案略過（現為常數，不可調）；`.gitignore` 是唯一真實來源——committed 的 vendor/、dist/ 會被一起索引（可能膨脹/噪音）。
- reference resolution 是 AST + framework heuristics，深度不如活的 LSP（別名/繼承/動態派發場景可能漏）。
- 「semantic」是行銷詞；實際是結構 + FTS5 字面，無向量語意搜尋。

### 取捨總結

CodeGraph 賭的是「**確定性、本地、預先索引的結構圖**」勝過「即時掃檔」與「向量 RAG」兩條路：用零成本、可重現、跨語言一張圖換取「不懂概念相似、reference 深度不如 LSP」。它最誠實也最有價值的一課其實不在工具本身，而在 benchmark 的演進——把「94% fewer tool calls」這種好看的 micro 數字，主動降級成「~35% cheaper」的端到端中位數，並點破「省錢的前提是 agent 真的直接走圖，而不是把活丟給讀檔 subagent」。這對任何在做 agent 工具/context engineering 的人都是可遷移的心法。

## 待解問題

- 第三方獨立複現新版 benchmark（尤其 `total_cost_usd` 中位數）——目前缺。
- `codegraph affected` 的實際準確率（import 傳遞追蹤的 false negative 率）？
- 跨語言邊界的 reference resolution 到底覆蓋哪些 pattern、哪些會漏？
- 與 quidproquo 自身 stack 的對照點：本站用 Vectorize（embedding）做語意搜尋，CodeGraph 走 FTS5 無 embedding——可在文章收尾做一個「圖 vs 向量」的小對照（feature-flag 心法呼應 CLAUDE.md）。
