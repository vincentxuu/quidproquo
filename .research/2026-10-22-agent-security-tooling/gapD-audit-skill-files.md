# Gap D：逐行精讀補查（第 1 層審計 skill 結論修正）

調查日：2026-10-22。標記：【自述】檔案作者原文；【實測】我讀原文或讀本機 repo 得到的事實；[推論] 我的推測。
遵守事項：未安裝任何 skill、未對任何目標執行審計或掃描、下載檔皆當不受信任資料（只讀、未執行；`collect.py` 只讀未跑）。下載目錄：`/tmp/claude-0/-home-user-quidproquo/294bb94c-7336-5c0f-a4c7-a0ff961e5680/scratchpad/gapD_src/`（`cf/`、`tob/`）。

取得方式：github MCP 與 api.github.com 直連被擋（`GitHub access to this repository is not enabled for this session`），raw.githubusercontent.com 用 `curl` 皆 200；目錄列表改用 Groundlane `web_fetch` 取 GitHub contents API。檔案位元組數與第 1 層紀錄完全相同（SKILL.md 22026、ATTACK-CLASSES.md 15695、CLOUD-AND-DEPLOYMENT.md 8291、semgrep SKILL.md 15678、codeql SKILL.md 18600），表示是同一版內容。

---

## 0. 結論（先看這段）

1. (a) 逐行讀完後結論不變：兩邊都沒有 Workers / D1 / KV / Astro / Vectorize / Workers AI binding 專屬檢查。最接近的段落在 §3 列原文。第 1 層用 grep 得出的結論，逐行讀過後成立。
2. (b) Cloudflare `AI-AND-LLM.md` 比第 1 層寫的具體：明確涵蓋 RAG、間接 prompt injection、embeddings 跨租戶外洩、記憶污染、工具參數注入、輸出渲染。但它把「prompt injection 本身」排除在 finding 之外，要求程式碼層級的邊界失敗。沒有向量資料庫專屬項目（沒有 Vectorize / namespace / metadata filter 字樣）。
3. (c) 沙箱與 needs_validation 對 Astro/Workers 站的影響：沒有 OS 強制沙箱就完全不能執行目標程式；會依賴的 Vectorize、Workers AI、production secrets 與 dashboard 設定都落到 needs_validation，不給嚴重度。實務上雲端 session 多半只剩「讀碼」模式 [推論]。
4. (d) ToB `supply-chain-risk-auditor` 不讀 `pnpm-lock.yaml` 是原文。**新發現**：quidproquo 同時追蹤 `package-lock.json` 與 `pnpm-lock.yaml`，前者是過期的（root 宣告 astro `^6.0.3`、鎖定 6.0.8；package.json 是 `^7.3.2`，pnpm-lock 是 7.3.2）。`collect.py` 會優先讀 package-lock.json，所以審計會拿過期版本去比對公告，而不是「完全沒鎖檔」。
5. (e) 與第 1 層沒有事實性衝突；有 6 處需補充或修正（§6）。其中兩項改變建議：insecure-defaults 沒有 SKILL.md（是 command + Workflow 腳本）；Cloudflare skill 有 `budget`/`quick` profile，成本可控，第 1 層「成本高、無官方數據」要補這點。

---

## 1. 讀取紀錄

方法：每個檔案以 Read 工具一次讀完（Read 回傳含行號的全文，無截斷）；JSON 以 `cat -n` 讀完。行數以 `wc -l` 為準。「讀過區間」即該次回傳的第一行至最後一行。

### 1.1 Cloudflare `skills/security-audit/`（要求的 12 個檔）

| # | 檔案 | 總行數 | 讀過區間 |
|---|---|---|---|
| 1 | HUNTING.md | 251 | 1–251 |
| 2 | RECONNAISSANCE.md | 156 | 1–156 |
| 3 | VALIDATION-AND-REPORTING.md | 186 | 1–186 |
| 4 | AI-AND-LLM.md | 83 | 1–83 |
| 5 | WEB-PROTOCOL-AND-AUTH.md | 105 | 1–105 |
| 6 | CLIENT-SIDE.md | 83 | 1–83 |
| 7 | DATA-ISOLATION-AND-LIFECYCLE.md | 84 | 1–84 |
| 8 | SUPPLY-CHAIN-AND-RELEASE.md | 73 | 1–73 |
| 9 | PROTOCOLS-RPC-AND-MESSAGING.md（repo 內實名） | 81 | 1–81 |
| 10 | RESOURCE-EXHAUSTION-AND-AVAILABILITY.md（實名） | 78 | 1–78 |
| 11 | MEMORY-SAFETY-AND-BINARY.md（實名） | 101 | 1–101 |
| 12 | DESKTOP-MOBILE-AND-LOCAL-IPC.md（實名） | 89 | 1–89 |

額外重讀（為了回答 (c)，第 1 層雖讀過但我再讀一次核對）：SKILL.md 192 行（1–192）、ATTACK-CLASSES.md 130 行（1–130）、CLOUD-AND-DEPLOYMENT.md 86 行（1–86）。
未逐行讀：README.md（106 行，只做 grep 與看到檔案表那段）；`report-schema.json`、兩支 `.cjs` 驗證器（不在要求範圍）。

### 1.2 Trail of Bits（`plugins/` 下）

| 檔案 | 總行數 | 讀過區間 | 備註 |
|---|---|---|---|
| static-analysis/skills/semgrep/SKILL.md | 273 | 1–273 | |
| static-analysis/skills/semgrep/references/rulesets.md | 162 | 1–162 | |
| static-analysis/skills/codeql/SKILL.md | 295 | 1–295 | |
| supply-chain-risk-auditor/skills/supply-chain-risk-auditor/SKILL.md | 122 | 1–122 | |
| differential-review/skills/differential-review/SKILL.md | 225 | 1–225 | |
| fp-check/skills/fp-check/SKILL.md | 112 | 1–112 | |
| agentic-actions-auditor/skills/agentic-actions-auditor/SKILL.md | 325 | 1–325 | |
| insecure-defaults/README.md | 104 | 1–104 | |
| insecure-defaults/commands/audit.md | 35 | 1–35 | |
| insecure-defaults/workflows/audit.js | 713 | 1–713 | |
| insecure-defaults/references/*.md ×6（fallback-secrets 70、default-credentials 76、fail-open-security 70、weak-crypto 71、permissive-access 62、debug-features 75） | 各如左 | 各自 1–末行 | |
| insecure-defaults/references/*.json ×6（11、12、11、13、13、13 行）與 .claude-plugin/plugin.json（10 行） | 各如左 | 各自 1–末行 | |
| supply-chain-risk-auditor/scripts/collect.py | 1568 | **只讀 66–90、232–250、372–392，加 grep** | 非要求項；只為確認鎖檔選擇邏輯。不算「讀完」。 |

### 1.3 要求但無法照字面完成的項目（誠實紀錄）

- **insecure-defaults 沒有 SKILL.md**。GET `plugins/insecure-defaults/skills/insecure-defaults/SKILL.md`、`.../SKILL.md` 皆 404。contents API 顯示目錄只有 `.claude-plugin`、`README.md`、`commands`、`references`、`tests`、`workflows`。所以我讀的是它實際的入口：README、`commands/audit.md`、`workflows/audit.js` 與 12 個 references 檔（references 目錄用 API 列出，確認恰好這 12 個檔）。`commands/` 目錄我沒用 API 列出，只讀了 README 指向的 `audit.md`；`tests/` 沒讀。
- 「static-analysis」的 `references/` 其餘檔（`scan-modes.md`）、codeql 的 `references/`、`workflows/`、`scripts/`，以及 differential-review 的 `methodology.md` 等、fp-check 的 `references/`、agentic-actions-auditor 的 `references/vector-*.md`：**未讀**（要求只到 SKILL.md 與 semgrep 的 rulesets.md）。這些檔案裡可能有 Workers 內容，我沒有證據說沒有。結論 (a) 的範圍是「上列已逐行讀完的檔案」。

讀完後我另做了一次關鍵字掃描作為核對（不作為閱讀替代）：`worker|D1|KV|wrangler|astro|miniflare|vectorize|durable|cloudflare` 在已讀檔中的命中全數列在 §3。

---

## 2. (a) 是否真的完全沒有 Workers/D1/KV/Astro/Vectorize/AI-binding 內容

【實測】逐行讀完後：**沒有**任何一個檔案提到 D1、KV、wrangler、Astro、Miniflare、Vectorize、Workers AI、Durable Objects、R2。`astro` 子字串只出現在 `catastrophic`（RESOURCE-EXHAUSTION 第 22 行）。`Cloudflare` 只出現在 CF README 的來源/聯絡資訊，不是檢查內容。

### 2.1 Cloudflare skill 最接近的段落（原文）

1. CLOUD-AND-DEPLOYMENT.md 第 5 行（適用範圍）：「Reach for this file when the repository defines cloud identity, infrastructure, containers, Kubernetes, service mesh, serverless functions, edge workers, ingress, object storage, managed services, or environment-specific configuration.」
2. 同檔第 22 行（Workload identity overreach）：「A workload, pod, function, edge worker, or node identity can act on tenants, accounts, resources, or APIs beyond its role, and untrusted request or job input selects that target. Review cloud policy conditions, resource patterns, service-account attachment, namespace mapping, and fallback credentials.」
3. 同檔第 69 行（Event-source identity confusion）：「A function or worker trusts event body fields as source identity without validating provider-signed envelope, subscription/topic, account, region, and replay state.」
4. 同檔第 72 行（Edge/runtime boundary mismatch）：「An edge or serverless runtime assumes a secret, API, filesystem, isolation, or tenant policy that differs from the origin runtime, and fallback to origin changes authority or cache behavior. Confirm which configuration selects each path.」
5. 同檔第 12 行（核心紀律）：「Do not infer a live exposure from a manifest alone. Establish which environment consumes it, what defaults or overlays modify it, and whether the source path is active.」這句決定 `wrangler.jsonc` 的 binding 只能算線索。
6. 同檔第 55 行：「Development values, chart defaults, environment variables, command-line flags, feature gates, sidecar injection, or per-region overlays disable authentication, transport security, tenant scoping, or audit policy in a deployed environment. Render the final configuration for each maintained deployment, not just the base file.」（對應 wrangler 的 `env.*` 覆寫，但未點名。）
7. DATA-ISOLATION-AND-LIFECYCLE.md 第 36 行：「A primary record's ACL or lifecycle changes without invalidating a searchable, cached, embedded, thumbnail, RSS, preview, or index copy. Validate filtering at retrieval time as well as document ingestion and invalidation.」這是對 D1 + Vectorize + RSS + 草稿文章最貼近的一條，但是通用寫法。
8. ATTACK-CLASSES.md 第 80 行：「**Preview/draft/staging leakage**: Are preview tokens scoped to one item or do they unlock broader access? Can draft content be discovered through search, RSS feeds, sitemaps, or API listing endpoints? Can cache headers cause a CDN to serve private content publicly?」quidproquo 有 `draft` 欄位、RSS、搜尋與 embed，這條直接可用（通用寫法）。
9. ATTACK-CLASSES.md 第 120 行（Obvious things）：「Are dependencies pinned? Are there known CVEs in the dependency tree? (check lockfiles)」；第 117 行：「Is there a `/debug`, `/admin`, `/test`, `/status`, `/health`, `/metrics`, `/env`, `/.env`, `/config` endpoint that is unprotected?」
10. CLIENT-SIDE.md 第 44 行談 service worker（瀏覽器端 Service Worker，不是 Cloudflare Worker）。RESOURCE-EXHAUSTION 的 `worker` 指工作池（「Worker, pool, and priority starvation」），也不是 Cloudflare Workers。SUPPLY-CHAIN 第 13、63 行的 `worker` 指 build worker。
11. RESOURCE-EXHAUSTION 第 12 行與第 30 行附近：「Require an input-to-cost path, a missing effective bound, and impact on another user, shared service, safety function, or operator-owned spend.」對 Workers AI / Vectorize 呼叫的費用濫用有用（通用寫法）。

### 2.2 Trail of Bits 最接近的段落（原文）

- insecure-defaults `workflows/audit.js` 第 197 行（recon 提示）：「**Deployment manifests that supply env vars in production**: Dockerfile, `docker-compose*.yml`, Kubernetes manifests, Helm values, Terraform, CI workflow files, systemd units, Procfile.」清單**沒有 wrangler.jsonc / wrangler.toml**；recon 是 LLM，可能自行補上，但文件沒要求 [推論]。
- 同檔第 195 行列舉框架設定檔：「Django `settings.py`, Rails `config/environments/*.rb`, Spring `application*.yml`, Express app bootstrap, Go `main.go` flag setup.」沒有 Astro。
- semgrep `rulesets.md` 第 62–63 行：`.js/.jsx` 與 `.ts/.tsx` 的框架 ruleset 是「`p/react`, `p/nodejs`, `p/express`, `p/nextjs`, `p/angular`」；框架偵測表（第 95–108 行）沒有 Astro 與 Workers。第 128 行列 Trail of Bits 自家 `semgrep-rules` 給「Python, Go, Ruby, JS/TS, Terraform, HCL」，並自註 AGPLv3。
- codeql SKILL.md 第 18 行：「Supported languages: Python, JavaScript/TypeScript, Go, Java/Kotlin, C/C++, C#, Ruby, Swift.」沒有 Astro 模板語法。第 26 行：「Django, Spring, and Express projects still wrap database calls, request parsing, and shell execution in project-specific APIs that no shipped model covers.」說明 `env.DB.prepare()` 這類 binding 需要自寫 data extension [推論：文件沒提 Workers]。
- agentic-actions-auditor 只對 GitHub Actions 內的 AI action（第 126–134 行的表：`anthropics/claude-code-action`、`google-github-actions/run-gemini-cli`、`google-gemini/gemini-cli-action`、`openai/codex-action`、`actions/ai-inference`），與 Workers 無關。
- supply-chain-risk-auditor：生態系只有 npm、PyPI、Go（第 121 行）。
- differential-review 的風險詞（第 49 行）：「Auth, crypto, external calls, value transfer, validation removal」；紅旗（第 184–188 行）含 `onlyOwner, internal → external`，偏智慧合約語境。無 Workers。

結論 (a)：**確認沒有**。逐行讀後，唯一補強第 1 層的是：DATA-ISOLATION 的「index/embedded/RSS/preview ACL drift」與 ATTACK-CLASSES 的「Preview/draft/staging leakage」實際上比第 1 層寫的「可能有幫助」更貼近 quidproquo（草稿文章進 Vectorize 與 RSS），雖仍是通用文字。

---

## 3. (b) AI-AND-LLM.md 對 RAG、prompt injection、向量資料庫的具體檢查項目

檔案共 83 行，全讀。結構：適用範圍（第 3–7 行）→ 核心紀律（第 9–18 行）→ 四組攻擊類別 → Universal moves → Validation rules。

### 3.1 適用範圍（【自述】第 5 行）

「Reach for this file when a language model participates in a trust-sensitive decision: chatbots and assistants, RAG pipelines, persistent agent memory, agent/tool-calling loops, MCP servers and clients, code that builds prompts from untrusted input, or code that consumes model output and acts on it. The important data flow is *untrusted content → model or memory → capability, authority, or sink*.」

### 3.2 Prompt injection：明確不當作 finding 的規則（第 12–18 行）

- 「Prompt injection alone is not a finding. Require a code-level boundary failure: content reaches another principal's context, invokes authority the requester lacks, discloses data they cannot read, or drives a sink they cannot reach directly.」
- 「A guardrail prompt is not a security boundary. Count only deterministic checks, resource-scoped authorization, isolation, binding, and constrained credentials.」
- 「Classify every candidate as `confirmed` only after source evidence and bounded local validation establish the boundary and result. Use `needs_validation` when a required provider, deployment, model, renderer, or identity behavior is not observable locally.」

### 3.3 RAG / 向量 / 記憶相關項目（第 20–32 行）

| 項目 | 原文要點 |
|---|---|
| Indirect injection through retrieved or ingested content | 「An attacker can write a RAG document, indexed page, file, email, issue body, tool response, or metadata that enters a different principal's model context. Trace who can write each source, how retrieval scopes it, whose session consumes it, and what capability is enabled there. ... The defect is a missing deterministic control, not persuasive text by itself.」 |
| Cross-session or cross-tenant context bleed | 「Conversation history, embeddings, retrieval results, or prompt caches are keyed too broadly. Verify tenant and ACL filters in the query itself and every cache key. A tenant field stored on an object is not enforcement if an alternate query, shared cache, or batch path omits it.」（唯一出現 `embeddings` 的地方） |
| Persistent memory poisoning | 「Review who may create, update, merge, and delete memory; its provenance and tenant scope; whether low-trust observations become durable instructions or facts...」 |
| Prompt role and provenance confusion | 「Look for string concatenation, untyped history, caller-controlled role fields, and serialization round trips that lose source labels.」 |

### 3.4 工具、MCP、輸出類別（第 34–68 行）

- Tool-argument injection into a downstream sink（第 37 行）：「Model-produced arguments reach SQL, shell, file, URL-fetch, or privileged APIs without handler-side validation. ... Structured output narrows shape; it does not establish authorization, safe paths, safe URLs, or query semantics.」
- Excessive agency and confused-deputy authority（第 40 行）：「A shared credential with enforced per-user query scope is not a defect.」
- Action-confirmation and approval binding、Tool-schema and dispatcher disagreement、Unbounded delegated action loops（第 43–49 行；最後一條：「Do not test by exhausting a service; use code-level accounting and a locally bounded loop.」）
- MCP 三項（第 54–60 行）：sub-agent trust inheritance、server/tool identity confusion、metadata as policy。
- Insecure output rendering（第 65 行）：「Model output reaches an executing HTML, Markdown, template, URL, or command sink without the sink's required encoding and policy. For browser rendering, verify auto-loaded resources and CSP or sanitization in `CLIENT-SIDE.md`; renderer behavior outside the repository makes the candidate `needs_validation`.」
- Sensitive context extraction（第 68 行）：「Disclosure of generic instructions or behavior that does not cross a data boundary is not a finding.」
- Universal moves（第 72–74 行）：先畫四張圖（執行身分、能力、可寫入的上下文/記憶來源、輸出目的地）；「Start at side-effecting tools and work backward through dispatcher, schema, confirmation, model context, retrieval, and ingestion. Start at durable memory reads and trace every writer.」

### 3.5 向量資料庫專屬項目

【實測】沒有。全檔沒有 `vector database`、`Vectorize`、`namespace`、`metadata filter`、`top-k`、`index poisoning`、`embedding inversion` 之類字樣。與向量庫最接近的是「embeddings ... keyed too broadly」（第 26 行）與 DATA-ISOLATION 的「embedded ... index copy」（§2.1 第 7 點）。「寫入向量庫的管線被污染」只能靠「Indirect injection ... Trace who can write each source」推得 [推論]。

### 3.6 對 quidproquo 的對應 [推論]

- 站內有 `src/pages/api/chat.ts`、`embed/`、`deep-research`、`search.ts`、`related-posts.ts`、`glossary/`、`crawl/`、`admin/`、`auth/`。可套用的類別：Indirect injection（誰能寫進被索引的文章或爬取內容）、Tool-argument injection（若 chat/deep-research 有工具呼叫打到 D1 或 fetch）、Unbounded delegated action loops 與 RESOURCE-EXHAUSTION 的「operator-owned spend」（AI binding、Vectorize 費用）。
- 單租戶站使 Cross-tenant bleed 大部分不適用；但「草稿 / 未發佈文章是否被 embed 並被 chat 引用」屬 ACL drift，等同第 36 行。
- 因為「Prompt injection alone is not a finding」，這個 skill 對「文章內容含惡意指示」只有在它能驅動 chat 的有權限動作或讀到讀者看不到的資料時才報。若 quidproquo 的 chat 只讀公開文章並輸出文字，預期結果是少有 confirmed，多為 hardening [推論]。

---

## 4. (c) needs_validation 與沙箱要求實際會怎麼影響審計 Astro/Workers 站

### 4.1 規則原文

- 預設模式（SKILL.md 第 12 行）：「This skill is guidance by default. Loading it does not authorize the complete audit workflow or file creation.」只有明確要求 audit/pen-test/完整審查/報告檔才進 full audit。
- 沙箱（第 33–40 行）：「Run target-controlled builds, tests, processes, browsers, emulators, fuzzers, and fixture processing only inside an OS-enforced sandbox that provides all of these controls: no external network ...; an empty environment populated from an explicit allowlist ...; a read-only target and toolchain, with the target-controlled process able to write only inside its assigned `scratch/` directory; and explicit low CPU, memory, process, file-size, disk, and wall-clock limits.」
- 第 40 行：「Do not install dependencies or let builds fetch them. Use only tools and dependencies already available locally. If every control cannot be enforced, do not execute target code: report the missing sandbox capability as a needs-validation blocker and give a safe validation plan.」
- 第 42 行：「Do not probe deployed endpoints, external services, shared infrastructure, production identities, other users' data, or live control planes. ... spend paid API quota ...」
- needs_validation 定義（第 152 行）：「`needs_validation` means a specific source-grounded boundary hypothesis is blocked, not a low-confidence confirmed vulnerability, and it has no severity.」
- RECONNAISSANCE.md 第 50–51 行（Agent 1d）要列出「Commands that would fetch dependencies, publish artifacts, contact paid/provider APIs, or affect shared state; mark them prohibited for this run.」與「Deployed controls and attachments that source cannot establish and therefore require needs_validation if decisive.」
- HUNTING.md 第 166 行：「Missing any sandbox or promotion capability does not erase a source-grounded candidate; represent the exact blocker in `needs_validation`.」
- 分流（第 111–115 行）：`quick` / `standard` / `deep` 三種 profile；「A scoped or `quick` run must present itself as partial coverage.」預算（第 121 行）：`budget` 是「maximum number of agent invocations across all phases」。

### 4.2 套到 quidproquo 的實際效果 [推論，依上列原文與本 repo 技術棧]

1. **本機執行幾乎只剩 D1/KV 的假資料測試**。允許：離線 build（依賴已在 `node_modules`）、vitest 單元測試、隔離 loopback 的假租戶服務。禁止：`pnpm install`、`pnpm deploy`、`pnpm sync:prod`、任何 production wrangler 指令、需要連 Cloudflare 的呼叫。`pnpm dev` 依 CLAUDE.md 啟動約 37 秒且走 Cloudflare platform proxy；若 platform proxy 需要連遠端 binding，就違反「no external network」。Workers AI 與 Vectorize 在本機通常需要遠端連線或 mock（這是我對 wrangler 行為的背景知識，未在本次來源核實），不能真實呼叫，只能 mock 或標 needs_validation。
2. **沒有 OS 強制沙箱就不執行**。這個雲端 container（claude.ai/code）能否提供「無外網 + 空環境 + 唯讀 target + 資源上限」的 OS 層沙箱，我沒有驗證；若不能，整次審計是純讀碼，所有需要執行才能確認的候選全部成為 needs_validation，沒有嚴重度。
3. **部署事實一律降級**。`wrangler.jsonc` 宣告的 D1/KV/Vectorize/AI binding、secrets（`wrangler secret`）、Cloudflare dashboard 的 WAF/rate limit/Access、cron 觸發、production 環境變數，都不在 source 或不能探測。依 CLOUD-AND-DEPLOYMENT 第 12 行與 `Validation rules` 第 1 點（「Establish the active source path and effective deployment object; otherwise use `needs_validation`」），這類候選只能列在 `NEEDS-VALIDATION.md`，並附「owner 可安全觀察的檢查」（例如請站主看 dashboard）。
4. **輸出**：full audit 產出 `REPORT.md`、`FINDINGS-DETAIL.md`、`NEEDS-VALIDATION.md`、`findings.json`、`coverage-ledger.json`，預設放 `~/security-audit-skill/<repo>/run-N`（第 51 行；放進 repo 內須確認被版本控制忽略）。本 repo 治理：skill 要裝進 `.agents/skills/` 再 `pnpm skills:sync`，CLAUDE.md 規定手改 `.claude/skills/` 是 Tier 3；新 dependency/改權限為 Tier 2。這些我沒有做。
5. **成本可控度比第 1 層寫的高**：SKILL.md 有 `budget`（agent 呼叫數上限）與 `quick` profile（一次 hunter wave + 一次 critic）。但 quidproquo 的 API 路由多（admin/auth/chat/crawl/deep-research/embed/glossary/search…），standard profile 的台帳單位是「surface × boundary × subsystem × attack class」，會是大量 hunter [推論]；預算不夠時單位會被標 `deferred`，報告必須聲明是部分審計。
6. **需要的環境**：`node <skill-dir>/validate-*.cjs`（Node）。多代理流程需要 Task/subagent 能力（RECONNAISSANCE.md 第 7 行 launch several `research` agents in parallel）。

---

## 5. (d) supply-chain-risk-auditor 不讀 pnpm-lock 的限制全文與影響

### 5.1 限制全文（SKILL.md 第 31–37 行，【自述】）

「1. Confirm the target directory has manifests: `package.json`, `pyproject.toml`, `requirements*.txt`, or `go.mod`. If none exist, say so and stop — do not audit an ecosystem this collector does not parse by hand. Lockfiles read for exact versions and the transitive sweep: `package-lock.json`/`npm-shrinkwrap.json`, `uv.lock`, and a go 1.17+ `go.mod`. `yarn.lock`, `pnpm-lock.yaml`, and `poetry.lock` are not read — the report says so when they are present, and versions fall back to pins or the latest release.」

相關原文：
- 第 9–10 行：「Generates a supply-chain risk report for a project's direct dependencies (npm, PyPI, Go), plus an advisory sweep of everything its lockfile resolves.」
- 第 108–109 行（Rationalizations）：「'The version is probably close enough.' A range checked at latest-release and a lockfile-resolved version are different claims; the report labels which one it makes. Keep the label.」
- 第 38–41 行：需要 `gh auth status`；未認證時「expect repository criteria to come back unassessable」。執行用 `uv run {baseDir}/scripts/collect.py ...`，所以需要 `uv`、`gh`、對外網路（registry、OSV、GitHub）。
- 第 118–120 行：「The audit is designed to work from nothing more than the dependency list — manifests and lockfiles — and never installs, builds, or executes anything.」

### 5.2 影響

一般情況（只有 pnpm-lock.yaml）：【自述】報告會說明沒讀；版本退回 `package.json` 的精確 pin 或 registry 最新版，且沒有 transitive 掃描（傳遞相依的公告掃描依賴鎖檔）。

**quidproquo 的實際情況（新發現，【實測】）**：
- `git ls-files` 同時追蹤 `package-lock.json`（324414 bytes，lockfileVersion 3，635 個 package）與 `pnpm-lock.yaml`（410513 bytes，lockfileVersion '9.0'）。
- `package-lock.json` 的 root 宣告 `astro: ^6.0.3`、`@astrojs/cloudflare: ^13.1.0`，鎖定 `astro 6.0.8`、`@astrojs/cloudflare 13.1.3`、`wrangler 4.77.0`。
- `package.json` 是 `astro: ^7.3.2`、`@astrojs/cloudflare: ^14.3.1`、`wrangler: 4.131.2`；`pnpm-lock.yaml` 有 `astro@7.3.2`、`wrangler@4.131.2`。
- 所以 package-lock.json 是過期檔，不代表實際部署的版本。
- 我讀了 `collect.py` 第 69–85 行：`_npm_locked_versions` 依序找 `package-lock.json`、`npm-shrinkwrap.json`，找到就用；第 240 行 `version, source = locked.get(declared), "lockfile"`，鎖檔有值就優先於 manifest pin。[推論] 因此審計會對 astro 6.0.8、wrangler 4.77.0 等過期版本查公告，並把結果標成 `lockfile`（看起來像精確版本比對），與 production 實際版本不符；可能漏掉 7.x 才有的問題，也可能報出已修的公告。報告其他部分（abandoned、publisher concentration、install script）以套件名為主，受影響較小。
- 建議（需站主決定，Tier 2 範圍）：先確認 `package-lock.json` 為何被追蹤；跑此 skill 前至少要知道它會讀這份過期鎖檔。我沒有改任何檔案。
- 第 1 層 §0 第 4 點與 §2.4 的「不讀 pnpm-lock.yaml」敘述正確，但漏了這個交互作用。

---

## 6. (e) 與第 1 層紀錄不一致處

逐項對過。**沒有事實性衝突**（引文、位元組數、行為描述都對得上）。以下是需要補充或修正的 6 處：

1. **insecure-defaults 沒有 SKILL.md**。第 1 層 T9 與 §2.4 把它和其他 plugin 並列，讀者容易以為是 SKILL.md 型 skill。實際是 slash command（`commands/audit.md`）+ 需要 `Workflow` 工具的腳本（`workflows/audit.js`）。README：「**Use the command, not the workflow.** Invoking `insecure-defaults:audit-pipeline` directly stops immediately.」
2. **第 1 層「insecure-defaults 流程 Recon(Sonnet)→6 sweep→Verify(Opus)」成立**，並補：Verify 以 Opus、每批 ≤16 個候選（audit.js 第 427 行 `MAX_FINDINGS_PER_BATCH = 16`），成本隨候選數增加。種子 regex 對 Workers 慣用寫法的覆蓋有缺口：`fallback-secrets.json` 第 7 行只有 `process\.env\.X (||\|??) '...'`，Workers 的 `env.SECRET ?? 'x'`、`locals.runtime.env.X` 不在種子內，要靠 sweep agent 自己「derive patterns」（audit.js 第 275–282 行要求）；`weak-crypto.json` 第 7 行會把 `algorithm: 'HS256'` 當候選，可能有誤報 [推論]。
3. **第 1 層 §4「成本：高，無官方數據」要補**：Cloudflare SKILL.md 有 `budget`（agent 呼叫數上限）、`quick/standard/deep` profile 與 `deferred` 機制（見 §4.2 第 5 點）。「HN 回報 150k~1M tokens」仍是第三方個人回報，不是官方數據。
4. **第 1 層 §2.3 對 DATA-ISOLATION 只說「可能有幫助」**，逐行讀後更具體：第 36 行「searchable, cached, embedded, thumbnail, RSS, preview, or index copy」與 ATTACK-CLASSES 第 80 行「draft content ... search, RSS feeds, sitemaps」直接對應 quidproquo 的草稿與 embed/RSS。仍無 Workers 專屬字樣，所以「無專屬規則」結論不變。
5. **第 1 層 §0 第 4 點（pnpm-lock）的影響描述不完整**：見 §5.2，實際是會讀到過期的 package-lock.json。
6. **ToB semgrep rulesets 補充**（第 1 層只列 JS/TS 框架集）：基線一律含 `p/security-audit`、`p/secrets`（rulesets.md 第 46 行）；基礎設施含 `p/github-actions`（第 118 行）；JS/TS 強制加 Trail of Bits 自家 semgrep-rules（第 128 行，AGPLv3，【自述】）。另外 `static-analysis/README.md` 第 86 行與 semgrep SKILL.md 第 217 行都有「No subagent runs any part of the scan」，第 1 層歸於 T4 正確，semgrep SKILL.md 也有同句。

另外確認（不是不一致）：第 1 層對 CF 沙箱引文、`needs_validation` 無嚴重度、fp-check 的「LLMs are biased toward seeing bugs and overrating severity」（fp-check 第 34 行）、supply-chain 的「Do not estimate maintainer counts ...」（第 19–20 行）、agentic-actions-auditor 向量 A–I（第 234–244 行）、codeql 的「Even Django/Spring apps have custom wrappers ...」（第 179 行）皆與原文一致。

---

## 7. 補充：其餘 ToB 檔案對 quidproquo 的相關度（逐行讀後）

| 檔案 | 與 quidproquo 的相關度 | 原文依據 |
|---|---|---|
| semgrep | 可跑 `p/typescript`、`p/nodejs`、`p/secrets`、`p/security-audit`、`p/github-actions`；`.astro` 檔不在任何偵測表，Semgrep 是否解析 `.astro` 文件沒提（[推論] 不會） | rulesets.md 第 57–64、95–108、118 行 |
| semgrep 必經核准關卡 | 掃描前必須 `AskUserQuestion` 明確同意 | SKILL.md 第 24 行：「The original "scan this codebase" request is NOT approval.」 |
| codeql | JS/TS 可建 DB（interpreted，免 build）；需要 `codeql`、`jq`、`uv` 安裝；Workers binding 需自寫 data extension | SKILL.md 第 139–162 行 |
| fp-check | 只對「已有的疑似 bug」去偽；Standard / Deep 兩條路；「When NOT to Use: Finding or hunting for bugs」 | SKILL.md 第 16–21、59–86 行 |
| differential-review | PR 級；規定一定產生報告檔（第 210 行：「Output report only to chat (file required)」列為 Don't），與 repo 內寫檔政策需配合；紅旗偏合約語境 | SKILL.md 第 181–210 行 |
| agentic-actions-auditor | quidproquo 的 `.github/workflows/` 有 6 個檔（content-index、deploy、preview、quality、seo-observability、visual-baselines），我 grep `claude-code-action` / `anthropics/` 皆無命中，所以預期輸出「No AI action steps found」[推論，依 SKILL.md 第 150 行流程] | SKILL.md 第 126–134、150 行 |

---

## 8. 仍然讀不到或沒做的

| 項目 | 狀態 |
|---|---|
| 各 plugin 的 `references/` 其餘檔（codeql 12 個、fp-check 5 個、agentic vector-a..i 與 foundations 等、differential-review 的 methodology/adversarial/reporting/patterns、semgrep scan-modes 與 workflow） | 未讀（超出要求）；對這些檔不下「無 Workers 內容」的結論 |
| `collect.py` 全文（1568 行） | 只讀 3 段加 grep；鎖檔選擇邏輯已確認，其餘未讀 |
| insecure-defaults `tests/`、`commands/` 目錄完整列表 | 未列出 |
| Cloudflare 沙箱在 claude.ai/code container 是否可用 | 未驗證（不執行任何目標程式碼；也不應在此測試） |
| 「Workflow 工具」在本環境是否存在（insecure-defaults 需要） | 未驗證 |
| CF README.md 逐行 | 只看檔案表與 grep |
