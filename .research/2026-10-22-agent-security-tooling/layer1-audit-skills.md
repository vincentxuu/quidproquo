# 第1層：程式碼審計 skill（cloudflare/security-audit-skill、trailofbits/skills）

調查日：2026-10-22。標記：【自述】作者/官方自述；【第三方】第三方報導或評論；【實測】我讀原文/API 得到的事實；[推論] 我的推測。
禁止事項遵守：未安裝任何 skill、未對任何目標執行掃描或攻擊；只讀取公開檔案。

## 0. 結論先行

1. cloudflare/security-audit-skill 存在，是官方（cloudflare 組織帳號，部落格與 repo 互相連結）。它是「純 LLM 多代理流程 + 兩支 JSON 驗證腳本」，不呼叫 Semgrep/CodeQL。Cloudflare 自己寫下 Semgrep 接進去後 Hunter 一個月內呼叫 0 次。
2. 它沒有任何 Workers/D1/KV/Astro 專屬檢查。唯一沾邊的是通用的「edge/serverless runtime」、「event-source identity」、「object/signed-URL」類別，對 Workers 只是泛化提示，不含 D1 binding、KV、wrangler.toml、Astro 的規則。
3. trailofbits/skills 是 plugin marketplace（約 50 個 plugin），與審計相關的有：static-analysis（semgrep/codeql/sarif-parsing）、insecure-defaults、fp-check、variant-analysis、differential-review、sharp-edges、audit-context-building、agentic-actions-auditor、supply-chain-risk-auditor、vulnerability-triage-brocards 等。它是「工具驅動（Semgrep/CodeQL 腳本）+ LLM 判斷」的混合，也沒有 Workers/D1/KV/Astro 專屬檢查（讀過的 SKILL.md 與 rulesets.md grep 無命中）。
4. 對 quidproquo（Astro 6 SSR + Workers + D1 + KV + pnpm）的具體缺口：ToB supply-chain-risk-auditor 不讀 pnpm-lock.yaml；Semgrep rulesets 只有 react/nodejs/express/nextjs/angular，無 Astro/Workers 規則集。
5. 公開的精準度/誤報率數據：兩個 repo 都沒有。Cloudflare 自述單次執行只找到多次執行總和約一半的漏洞。第三方批評集中在 token 成本與模型拒答，不是誤報率。

## 1. 來源清單與讀取程度

| # | 來源 | 網址 | 讀取程度 | 備註 |
|---|---|---|---|---|
| S1 | CF repo README | https://github.com/cloudflare/security-audit-skill | read（全文） | Groundlane web_fetch |
| S2 | CF SKILL.md | https://raw.githubusercontent.com/cloudflare/security-audit-skill/main/skills/security-audit/SKILL.md | read（全文，22026 bytes） | |
| S3 | CF ATTACK-CLASSES.md | .../skills/security-audit/ATTACK-CLASSES.md | read（全文，15695 bytes） | |
| S4 | CF CLOUD-AND-DEPLOYMENT.md | .../skills/security-audit/CLOUD-AND-DEPLOYMENT.md | read（全文，8291 bytes） | |
| S5 | CF 其餘 12 個 .md（HUNTING、RECONNAISSANCE、VALIDATION-AND-REPORTING、AI-AND-LLM、WEB-PROTOCOL-AND-AUTH、CLIENT-SIDE、DATA-ISOLATION、SUPPLY-CHAIN、PROTOCOLS-RPC、RESOURCE-EXHAUSTION、MEMORY-SAFETY、DESKTOP-MOBILE） | .../skills/security-audit/*.md | partial（全數下載至本機，只做關鍵字 grep：workers/D1/KV/wrangler/astro/semgrep/codeql/false positive；沒有逐行讀） | 關鍵字 grep 結論僅限這些詞 |
| S6 | CF repo 檔案樹 | https://api.github.com/repos/cloudflare/security-audit-skill/git/trees/main?recursive=1 | read（全文） | 確認無 scripts 之外的工具整合 |
| S7 | CF repo metadata | https://api.github.com/repos/cloudflare/security-audit-skill | read | stars/forks/license/pushed_at |
| S8 | CF commits | https://api.github.com/repos/cloudflare/security-audit-skill/commits?per_page=100 | read（回傳 14 筆即全部歷史） | 經 Groundlane 檔案解析 |
| S9 | CF commit atom | https://github.com/cloudflare/security-audit-skill/commits/main.atom | partial（截斷，讀到 2026-06-29） | 含 Sept 10 大改版 commit 訊息 |
| S10 | CF issues | https://github.com/cloudflare/security-audit-skill/issues、API issues?state=all | partial（標題列表前約 22 筆讀到，回應被截斷；#77 單頁 read） | |
| S11 | Cloudflare 部落格 | https://blog.cloudflare.com/build-your-own-vulnerability-harness | read（全文） | 【自述】 |
| S12 | HN 討論 | https://news.ycombinator.com/item?id=49736466（讀 https://hn.algolia.com/api/v1/items/49736466） | read（全部留言樹） | 【第三方】 |
| S13 | explainx.ai 報導 | https://explainx.ai/blog/cloudflare-security-audit-skill-open-source-agent-vulnerability-hunting-2026 | read（extract=full 後全文；第一次被 Groundlane 抽取器剝掉內文） | 【第三方】 |
| S14 | Plexicus 報導 | https://www.plexicus.ai/ja/blog/application-security/cloudflare-ai-security-audit-skill/ | read（全文） | 【第三方】；文末有自家產品廣告，利益相關 |
| S15 | smartscope / ustc.io / penligent / bicarait 等 | web_search 結果 | snippet | 僅引用 smartscope「README 未載明 FP rate」，其餘未採信 |
| T1 | ToB repo README | https://github.com/trailofbits/skills | read（全文） | |
| T2 | ToB repo metadata | https://api.github.com/repos/trailofbits/skills | read | |
| T3 | ToB commit atom | https://github.com/trailofbits/skills/commits/main.atom | partial（截斷，讀到 2026-10-14 前後約 8 筆） | |
| T4 | ToB static-analysis README | https://raw.githubusercontent.com/trailofbits/skills/main/plugins/static-analysis/README.md | read（全文） | |
| T5 | ToB semgrep SKILL.md | .../plugins/static-analysis/skills/semgrep/SKILL.md | partial（前約 230 行 + 關鍵字 grep；15678 bytes） | |
| T6 | ToB codeql SKILL.md | .../plugins/static-analysis/skills/codeql/SKILL.md | partial（僅 grep 關鍵字，約 18600 bytes） | |
| T7 | ToB semgrep references/rulesets.md | .../skills/semgrep/references/rulesets.md | partial（grep 命中行） | |
| T8 | ToB fp-check、variant-analysis、sharp-edges、differential-review、supply-chain-risk-auditor、audit-context-building、agentic-actions-auditor、vulnerability-triage-brocards 的 SKILL.md | .../plugins/<name>/skills/<name>/SKILL.md | partial（各讀前 40~60 行，約 1/5~1/2；全部另做 Workers/Astro 關鍵字 grep） | |
| T9 | ToB insecure-defaults README + references 3 檔 | https://github.com/trailofbits/skills/tree/main/plugins/insecure-defaults 與 raw 檔 | partial（頁面被截斷；README 全文下載，grep 為主） | |
| T10 | Snyk 文章、mrtechking、brightcoding | web_search 結果 | snippet | 未讀全文，不作主張依據 |

## 2. 事實表

### 2.1 是否存在、是否官方、維護與授權（問題 e）

| 項目 | cloudflare/security-audit-skill | trailofbits/skills | 來源 |
|---|---|---|---|
| 存在 | 是 | 是 | S7、T2 |
| 官方性 | 擁有者為 GitHub 組織 cloudflare（type: Organization）；部落格結尾連回此 repo：「we're releasing the initial skill we used to develop the harness ... github.com/cloudflare/security-audit-skill」；README 留 security-ai-research@cloudflare.com。判定官方【實測+自述】 | 擁有者為組織 trailofbits；README 寫「Made by Trail of Bits」 | S1、S7、S11、T1、T2 |
| 授權 | MIT | CC-BY-SA-4.0（ShareAlike，改作須同授權；對引用/內化到自家 skill 要留意）| S7、T2 |
| Stars / forks | 36,434 / 2,277 | 7,689 / 667 | S7、T2（2026-10-22 當日 API） |
| 建立日 | 2026-06-18 | 2026-01-14 | S7、T2 |
| 最近 push | 2026-09-14（距今 38 天） | 2026-10-21 | S7、T2 |
| commit 頻率 | main 全歷史僅 14 筆（2026-06 4 筆、07 7 筆、09 3 筆；8 月、10 月 0 筆），主要提交者 literally-dan（Dan Jones）【實測】 | 2026-10-14 至 10-21 一週內 atom 可見至少 8 筆，含 dependabot 與外部貢獻者；高頻 | S8、T3 |
| issue 狀態 | open_issues_count 78（含 PR）；2026-09-17 起大量新 issue，多為驗證器/schema 議題（#80 "Completion gate and carried-record handling contradict the phase rules"、#78 "run-metadata.json run-state contract is never validated"）| open_issues_count 131（含 PR） | S7、S10、T2 |
| 維護者背景 | Cloudflare 安全 AI 研究團隊；明年度是否持續維護無承諾 | Trail of Bits 員工與外部貢獻者；有 Codex 自動審 PR、CI 要求 plugin 版本遞增 | S11、T1、T3 |

註：S7 的 stars 36,434 與第三方文章寫的 25.6k（explainx，10 月 7 日）、2.8k（getclaudeskills，7 月）都不同，是時間差；以 API 當日值為準。

### 2.2 Cloudflare security-audit：每個 skill 實際怎麼審（問題 a、b）

這個 repo 只有一個 skill：security-audit。

**作者自述的流程**（S1、S2）：六階段。Phase 1 Reconnaissance 產出 architecture.md 與 coverage-ledger.json；Phase 2 coverage-led hunting；Phase 3 每個候選交給新 verifier「tries to disprove it」；Phase 4 寫 findings.json 並用 `validate-findings.cjs` 驗證；Phase 5 新 agent 獨立驗證記錄；Phase 6 產出 REPORT.md 等。

**S2 原文**：
- 模式：「This skill is guidance by default. Loading it does not authorize the complete audit workflow or file creation.」（預設 guidance mode；只有明確要求 audit/pen-test 或報告檔才走 full audit mode）
- 證據標準：「Static analysis establishes the source path. Sandboxed local tests resolve behavior when all execution controls are available」。這裡的 static analysis 指代理讀碼，不是 Semgrep/CodeQL 工具。
- 沙箱：目標程式的 build/test 必須在「OS-enforced sandbox」內，缺任何控制就「do not execute target code: report the missing sandbox capability as a needs-validation blocker」。
- 反模式：「Defense-in-depth advice with no reachable boundary violation.」
- 嚴重度錨點：critical 例「an unauthenticated actor gains code execution, full data-store access, or takeover of arbitrary accounts」；並規定 needs_validation「has no severity」。

**用什麼工具（b）**：
- 未呼叫 Semgrep/CodeQL。我在 repo 檔案樹（S6）只看到 .md、report-schema.json 與 4 支 .cjs（兩個驗證器與其測試）。
- 兩支 .cjs 驗證器只檢查 JSON 結構與台帳一致性，不檢查漏洞是否為真。Cloudflare 部落格原文：「findings.json is checked mechanically for schema adherence, not correctness」【自述】。
- Cloudflare 自述（S11）：「We plumbed Semgrep all the way through, and the Hunters invoked it zero times in a month of runs. They would rather read and run the code.」所以官方的經驗結論是不要早接靜態分析。注意這是內部 harness 的經驗，不是這個 public skill 的實驗。
- 結論：審計能力來自 LLM 讀碼與在沙箱跑最小重現，屬「純 LLM 提示 + 結構化驗證」。

**審的漏洞類別**（S3、S4 原文標題）：Injection、Access control、Resource and file handling（path traversal、SSRF、zip slip、TOCTOU）、Cryptography and secrets、Business logic、Feature abuse and data leakage（export/import/search oracle、preview/draft leakage、notification/webhook as SSRF）、Chained vulnerabilities、Wildcard、Obvious things（硬編碼密鑰、debug endpoint、CORS `*`、cookie flags、open redirect）。另有 10 個領域附檔（S1 檔案表）：memory safety/binary、AI/LLM、web protocol/auth、client-side、supply chain/release、cloud/deployment、RPC/messaging、resource exhaustion、data isolation/lifecycle、desktop/mobile/local IPC。

### 2.3 Cloudflare：Workers/D1/KV/Astro 相關檢查（問題 c）

- 我對全部 15 個 .md 做了 `workers?|durable object|D1|KV|wrangler|astro|miniflare|R2|cloudflare|edge` 的不分大小寫 grep。命中只有：CLOUD-AND-DEPLOYMENT.md 的泛化文字（"edge workers"、"Edge/runtime boundary mismatch"、"Event-source identity confusion"、"Object and signed-URL policy confusion"）與 CLIENT-SIDE.md 的 service worker。沒有任何命中 D1、KV、wrangler、Astro、Miniflare、Durable Object。【實測，限關鍵字層級】
- S4 原文：「**Edge/runtime boundary mismatch** An edge or serverless runtime assumes a secret, API, filesystem, isolation, or tenant policy that differs from the origin runtime」，這是對 Workers 最接近的一條，仍是通用描述。
- S4 原文：「Do not infer a live exposure from a manifest alone.」所以 wrangler.toml 的 binding 設定若缺部署事實，只會被標 needs_validation，不會 confirmed。
- DATA-ISOLATION-AND-LIFECYCLE.md 涵蓋租戶隔離與快取/搜尋/匯出，對 D1 query 的租戶範圍可能有幫助，但沒有點名 D1。
- 結論：沒有 Workers/D1/KV/Astro 專屬規則。[推論] 對 quidproquo 這類單租戶 Astro SSR 站，大部分價值會落在 Access control、SSRF（Vectorize/AI binding 呼叫）、secrets、Obvious things 與 AI/LLM 類別（RAG、prompt injection）；D1 SQL injection 靠通用 Injection 類別。

### 2.4 Trail of Bits：審計相關 plugin 清單與做法（問題 a、b、c）

**清單**（T1 README「Code Auditing」「Verification」等區）：agentic-actions-auditor、audit-context-building、burpsuite-project-parser、c-review、differential-review、dimensional-analysis、fp-check、insecure-defaults、rust-review、semgrep-rule-creator、semgrep-rule-variant-creator、sharp-edges、static-analysis、supply-chain-risk-auditor、testing-handbook-skills、trailmark、variant-analysis、vulnerability-triage-brocards；Verification 區另有 constant-time-analysis、mutation-testing、patching-bugs、post-patch-validation、property-based-testing、regression-hunt、spec-to-code-compliance、zeroize-audit 等；智慧合約區有 building-secure-contracts、entry-point-analyzer。與 quidproquo 技術棧（JS/TS）直接相關的主要是下列。

| plugin | 實際做法（來源原文） | 工具 vs 純 LLM | Workers/D1/KV/Astro |
|---|---|---|---|
| static-analysis / semgrep | T5：「Always use `--metrics=off`」；「Third-party rulesets are required」；「`scripts/run-scans.sh` generates the commands; do not write them yourself」；Pro 可跨檔 taint：「catches ~250% more true positives」【作者自述，無出處數據】；限制原文「OSS mode cannot track data flow across files」 | 工具為主：真的跑 semgrep CLI，再合併 SARIF。T4：「No subagent runs any part of the scan」 | 無。T7 的 JS/TS 規則集：p/javascript、p/typescript、p/react、p/nodejs、p/express、p/nextjs、p/angular；沒有 Astro/Workers 規則集 |
| static-analysis / codeql | T6：支援 JS/TS 等；「Even Django/Spring apps have custom wrappers that CodeQL does not model. Skipping extensions means missing vulnerabilities.」 | 工具為主：建 CodeQL DB、跑查詢包 | 無（grep 未見）。CodeQL 對 Workers 的 `env.DB.prepare()` 這類 binding 是否建模，ToB 文件沒提 [推論：預設不建模，需自寫 data extension] |
| static-analysis / sarif-parsing | T4：解析、聚合、去重 SARIF | 工具 | 不適用 |
| insecure-defaults | T9：六類（fallback secrets、default credentials、fail-open switches、weak crypto、permissive access、debug leakage）；流程 Recon(Sonnet)→6 個 Discover sweep→Verify(Opus，refuting agents)→Report | LLM 多代理 + seed pattern，非 SAST 工具 | 無點名。permissive-access 有 CORS `*` 範例；會讀 deploy manifests（T9「profile stack + deploy manifests」）但未提 wrangler |
| fp-check | T8 原文：「Systematically verifies suspected security bugs to eliminate false positives」；「LLMs are biased toward seeing bugs and overrating severity」；「When NOT to use: Finding or hunting for bugs」 | 純 LLM 紀律流程 | 無 |
| variant-analysis | 從已知 bug 往外找變體：先寫只匹配原案例的 pattern，再逐步泛化「Stop when more than half the matches are noise」 | CodeQL/Semgrep + LLM | 無 |
| differential-review | PR/commit 差異審查，用 git blame、calculating blast radius；依規模 SMALL/MEDIUM/LARGE 調整深度 | LLM + git | 無 |
| sharp-edges | 審 API/設定的 footgun，非實作 bug：「Implementation bugs (use standard code review)」列為 When NOT | 純 LLM（allowed-tools 僅 Read Grep Glob） | 無 |
| audit-context-building | 先建理解不找洞：「Do not name vulnerabilities, suggest fixes, write proofs-of-concept, or rate severity.」 | LLM 工作流 | 無 |
| agentic-actions-auditor | 審 GitHub Actions 中 AI agent（Claude Code Action、Gemini CLI、Codex）的注入向量 A–I | LLM 讀 YAML | 無；對 quidproquo 的 CI 若用 claude-code-action 才相關 |
| supply-chain-risk-auditor | 跑 `collect.py` 腳本量測，不讓 LLM 估：「Do not estimate maintainer counts, downloads, staleness, or CVE history from gh, web search, or memory」；限制原文：「`yarn.lock`, `pnpm-lock.yaml`, and `poetry.lock` are not read」 | 腳本為主 | 與 quidproquo 的 pnpm 直接衝突 |
| vulnerability-triage-brocards | 7 條 brocards 篩漏洞報告，「primary use case」是過濾 agentic 發現管線的輸出 | 純 LLM 準則 | 無 |

另：ToB 在 README 標示 codeql/semgrep 內容「based on the Trail of Bits Testing Handbook」【自述，T4】。

跨 plugin 的 Workers/D1/KV/Astro 檢查：我對 T8 十三個 SKILL.md 做 `cloudflare|workers|wrangler|astro` grep，唯一命中是 sharp-edges 第 123 行（"One wrong setting creates catastrophic failure"，只是字串 "astro" 出現在 catastrophic 內的誤命中），沒有真正的 Cloudflare/Astro 檢查【實測，關鍵字層級；未覆蓋各 plugin 的 references/ 子檔】。

## 3. 已知限制、誤報、批評與評測（問題 d）

搜尋輪次：Groundlane web_search ×3（"cloudflare security-audit-skill false positives limitations review criticism"、"trailofbits skills security audit Claude Code false positives evaluation limitations"、"Hacker News ... token cost noise"），加 HN 全串、GitHub issues、官方部落格。

### 3.1 Cloudflare skill

| 主張 | 類型 | 來源與原文 |
|---|---|---|
| 單次跑只找到約一半 | 【自述】 | S11：「a single run finds only about half the bugs you'd catch across multiple runs. In our experience the ones it did find skewed toward the simpler and less subtle.」S1 亦有 |
| 不聲稱假陰性率 | 【自述】 | S11：「We don't claim a false-negative rate for our system. There's no labeled set of every real bug in a codebase, so any claimed recall number is entirely speculative.」 |
| 內部 harness 的驗證拒絕率 | 【自述，內部 harness 非 public skill】 | S11：「our initial validation rejection rate dropped from 40% down to 11%」；20,799 raw → 約 12,057 通過驗證。這是偏高的候選量，說明誤報壓力靠「驗證層」處理 |
| 代理會自己改碼讓 exploit 成立、寫套套邏輯的測試 | 【自述】 | S11：「The agent will edit the source code so its own exploit works, then triumphantly report the bug it just created.」 |
| 無公開 precision/FP 數據、無 per-run 成本 | 【第三方】 | S13：「Cloudflare has not published precision or false-positive rates for the open-source skill.」「Token cost per run is unreported」；S15 smartscope snippet 亦同 |
| 公開 skill ≠ 內部系統 | 【第三方】 | S14：「The public project is a single-repository starting point.」；Cloudflare 數字「are company-reported operational results, not an independent benchmark of the public skill」 |
| Token 成本高/不一定有產出 | 【第三方，HN 個人回報，未驗證】 | HN 留言：「I threw 1M tokens for nothing in a medium codebase.」（drchaim）；「At least 150k on my relatively small FastAPI project, but hit my session limit.」（jesse_dot_id）；「These work best on a targeted section of the code, like a PR.」（SkyPuncher） |
| 安全框架觸發模型拒答 | 【第三方，個人回報】 | HN wslh：「audit skills that explicitly frame the task as security research sometimes trigger refusals from the top OpenAI and Anthropic models」；GitHub issue #77（2026-10-13）：「After 2.5 hours, the output is hidden by Codex.」 |
| 文字量大、佔上下文 | 【第三方，個人意見】 | HN decidu0us9034：「they're very huge markdown files」；S13 描述 prodigycorp 的 skill 數量抱怨（針對 cloudflare/skills，不是本 repo） |
| 驗證器/契約仍在修 | 【實測】 | issue #78~#80、#84、#85 為驗證器與狀態契約的邏輯缺口；9 月 10 日 commit 自述「Rework the audit workflow, findings contract, and validators end to end」 |
| 需要 OS 沙箱，否則不執行目標碼、線索降級為 needs_validation | 【自述】 | S1、S2 |

### 3.2 Trail of Bits skills

- 作者自述限制：Semgrep OSS 無法跨檔 taint（T5）；supply-chain 不讀 pnpm-lock（T8）；fp-check 明說「LLMs are biased toward seeing bugs and overrating severity」；vulnerability-triage-brocards 說「most automated runs produce findings that fail one or more brocards」，意即 ToB 自己預期 agentic 管線輸出有大量誤報。
- 第三方批評：我搜了 "trailofbits skills ... false positives evaluation limitations"，結果只有導覽/評介（Snyk 列表、mrtechking、brightcoding、ustc.io），摘要層級無批評；未讀這些文章全文。mrtechking snippet 寫「the results still need a person who understands the code and the threat model to check them」，屬 snippet。
- 評測：未找到 ToB 公開的 precision/recall 或基準評測。plugin 內有零星 evals（例如 audit-context-building/evals/*，案例與 grader 檔），那是 plugin 自己的行為測試，不是漏洞偵測準確度。我只看到檔名，沒讀內容。
- 結論：⚪ 確認無公開的 ToB 技能精準度評測與第三方批評（試過：Groundlane web_search 兩輪、Brave/You 聯合結果、GitHub bug 標籤 issue 查詢回 `[]`；未試 Exa/Tavily，因 Groundlane 回報 tavily/exa/brave 部分 unavailable）。

## 4. 對照表（給 quidproquo 用）

| 面向 | Cloudflare security-audit | ToB 組合 |
|---|---|---|
| 核心方法 | 多代理 LLM 審計 + 對抗驗證 + 台帳/schema | 工具腳本（Semgrep/CodeQL）+ LLM 分流 + 專用 FP 審查 |
| Semgrep/CodeQL | 無，且官方說 Hunter 0 次使用 | 有，含 run-scans.sh、SARIF 合併 |
| Workers/D1/KV/Astro 專屬規則 | 無（通用 edge/serverless 類別） | 無 |
| 成本 | 高（HN 回報 150k~1M tokens），無官方數據 | 工具腳本便宜，LLM 部分按 plugin 而定，無數據 |
| 誤報控管 | 獨立 verifier、needs_validation 不給嚴重度 | fp-check、brocards、insecure-defaults 的 refuting verifier |
| 適合 quidproquo | 全站審計一次當基準，需先設定沙箱或接受降級為 needs_validation | insecure-defaults、fp-check、differential-review（PR 級）較貼近；semgrep 需自選 p/typescript 與 p/nodejs，另補 Astro/Workers 自訂規則 |
| 授權風險 | MIT，可直接內化 | CC-BY-SA-4.0，內化要保持同授權並署名 |

## 5. 讀不到 / 沒做到的項目與狀態

| 項目 | 狀態 | 嘗試與原因 |
|---|---|---|
| 以 github MCP 讀 repo 全文 | 已改走替代 | mcp__github__get_file_contents、search_repositories 外的檔案讀取被擋：「Allowed repositories: vincentxuu/quidproquo」，兩個目標 repo 未在 session 允許清單。curl 取 api.github.com 回 403「GitHub access to this repository is not enabled for this session」。改用 Groundlane web_fetch（github.com、api.github.com、raw）與 `curl` 取 raw.githubusercontent.com，皆 200。未呼叫 add_repo（任務未授權新增 repo，且已有可用替代）。降級紀錄：github MCP → Groundlane/curl raw，未用到 WebFetch/Exa/Tavily/linkup/jina/firecrawl。 |
| explainx 全文 | ✅已關閉 | 第一次 Groundlane 預設抽取剝掉內文；改 extract=full + selector 取得全文 |
| CF 其餘 12 個附檔逐行內容 | 未完成，partial | 已下載，只做關鍵字 grep，未逐行讀。若第2層要引用這些檔案的具體規則，需再讀 |
| CF commit atom 完整歷史、issues 完整標題 | ✅已關閉（以 API 補足 commits）／issues 為 partial | commits 用 API 得全部 14 筆；issues API 回應被截斷，僅讀到約 22 筆標題 |
| ToB 各 plugin 完整 SKILL.md 與 references | 未完成，partial | 只讀前段與 grep；codeql、semgrep references、insecure-defaults 的 corpus 大部分未逐行讀 |
| ToB commit 頻率的長期數字、貢獻者數 | ⚪未取得 | atom 被截斷，API 的 commits 分頁未取；僅知最近一週至少 8 筆 |
| HN 以外的獨立實測（例如有人在真實 repo 上跑出的誤報清單） | ⚪確認目前搜尋無公開資料 | 試過 Groundlane web_search 三輪（含 domains 限定 news.ycombinator.com/reddit.com），只回 HN 主串與一則 reddit 鏡像，reddit 頁未讀全文（snippet）。penligent 文章 snippet 自稱「not ... a head-to-head comparison」，未讀全文 |
| Cloudflare 官方是否將持續維護 | ✉️只能問人 | repo 無維護承諾；可寫信 security-ai-research@cloudflare.com（README 公開）。pushed_at 距今 38 天且 issues 持續進來，是風險訊號 [推論] |

## 6. 給下一層的提醒

- 兩者都不是 Workers/Astro 專用工具；若要檢查 D1 binding 注入、KV session 處理、Astro SSR 的 `Astro.locals`/API route 授權、wrangler.toml 公開 binding，需要自寫 Semgrep 規則（用 ToB 的 semgrep-rule-creator）或在 Cloudflare skill 的 Phase 1 prompt 加站內脈絡 [推論]。
- Cloudflare 的「needs_validation」機制對 Workers 部署事實（secrets、binding 實際值）會大量降級，因為它要求部署事實不在 source 就不能 confirmed（S4 規則 1）。
- 使用前先看治理：本 repo CLAUDE.md 規定新 dependency、改權限、改 CI/hook 為 Tier 2，安裝這類 skill 或接 CI 前要先問。我沒有安裝任何東西。
