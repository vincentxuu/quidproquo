# 深讀 C 層補充（執行期護欄與 MCP 閘道）與 B 層補充（安裝前掃描）

調查日：2026-10-22。標記：【自述】作者／廠商自己說的；【第三方】外部文章、論文；【實測】我讀到的原始檔或 API 回應；[推論] 我的判斷。
全程唯讀，沒有安裝、執行任何被研究的工具。下載內容視為不受信任資料，只用 `python3 -I` 讀。

---

## 0. 讀取紀錄與降級（先講缺口）

### 0.1 沒達成的要求（誠實揭露）
- 「每個來源從頭讀到尾」：多數 README、doc 是全文讀完（見來源表「全文」）。以下是 **partial**：
  - Claude Code hooks 參考頁（約 100,000 字元被截斷；讀 0–1,400、58,353–64,763、69,774–73,300，其餘未讀）。
  - arXiv 2610.03448（80,918 字元；讀 0–15,500、47,900–52,500，加搜尋摘要；表 2 數字取自搜尋摘要，未逐格讀）。
  - appsecsanta MCP 稽核文（頁面 185 KB，工具回傳截在 40,000 字元，讀到 Methodology 段開頭，後半未讀）。
  - GitHub issue 列表只讀「標題／狀態／日期」，沒讀內文（cc-safety-net 15 筆、pipelock 10 筆）。
  - GitHub repo API 回應我只用了 `search_repositories` 的完整輸出（讀全）；`api.github.com` 直連取回的 JSON 被我截在 4,800 字元，只用到 `pushed_at`。
- 「完整 fallback 鏈」：實際只用了 Groundlane `web_fetch`／`web_search`、`mcp__github__search_*`、WebFetch（PyPI 兩次成功、arXiv 一次失敗）。**沒有試** cloudflare `get_url_markdown`、linkup、jina `read_url`、Exa、firecrawl。理由：Groundlane 對需要的頁面幾乎都成功；失敗的兩項（見下）改用同題材的替代來源補上，但這不等於鏈試完，所以下面「讀不到」的宣稱都限定在「我用過的工具」。
- 沒讀的重要東西（待補）：`NVIDIA-NeMo/Guardrails` 的 LICENSE 以外檔案（是否有 LICENSE-3rd-party）、`hol-guard` 的 `docs/guard/architecture.md`、`pipelock` 的 `docs/comparison.md`、`IBM/mcp-context-forge` 的 plugins 官方文件站、Cisco mcp-scanner 的 `docs/architecture.md`、Snyk `docs/risks.md`。

### 0.2 失敗與降級清單
| 嘗試 | 工具 | 網址 | 結果 |
|---|---|---|---|
| 讀 protectai/llm-guard、rebuff 的 commits、issue 留言 | `mcp__github__list_commits`／`issue_read` | protectai/llm-guard、protectai/rebuff | `Access denied: repository ... is not configured for this session. Allowed repositories: vincentxuu/quidproquo` |
| 查 repo 欄位 | Bash `curl` | api.github.com/repos/* | 13 個全部 HTTP 403（終端機網域未放行） |
| 讀 NeMo releases | `mcp__github__list_releases` | NVIDIA-NeMo/Guardrails | 同上 Access denied；改用 `github.com/.../releases.atom`（Groundlane，成功） |
| 讀 cc-safety-net issues | `mcp__github__list_issues` | kenryu42/cc-safety-net | Access denied；改 `search_issues`（成功） |
| 讀 Senthex 文章 | Groundlane `web_fetch` | senthex.com/en/llm-guard-alternatives/ | HTTP 404（搜尋摘要仍可見該文，但頁面已不存在或改址）；改讀 StationX 全文 |
| 讀 NeMo 安全指引 | Groundlane | docs.nvidia.com/nemo/guardrails/security/guidelines.html | Page Not Found，改 `.../resources/guidelines.md`（成功） |
| 讀 arXiv 2510.09023 HTML | WebFetch | arxiv.org/html/2510.09023v1 | `getaddrinfo ENOTFOUND arxiv.org`（WebFetch 無法連 arxiv）；改讀 abs 頁（Groundlane 成功，只有摘要） |
| 讀 Claude Code hooks 頁 | Groundlane | code.claude.com/docs/en/hooks | `OUTPUT_LIMIT`；改 `hooks.md` 加 `maxBytes`（成功但截斷） |
| 讀 PANW 收購完成新聞稿 | Groundlane | prnewswire.com/...302510757 | 成功但被導覽列吃掉內文；改用搜尋結果摘要（含 2025-07-22 日期與句子） |
| Groundlane 搜尋 | brave／tavily／exa | — | 常回報 `unavailable`，僅 you 或 brave 有結果，供應商單一的偏誤沒排除 |

---

## 1. 來源表

類型：1=一手（作者／官方）；2=第三方；3=第三方低可信（內容農場、廠商行銷）。

| ID | 來源 | 網址 | 類型 | 讀取程度 |
|---|---|---|---|---|
| S1 | llm-guard README | raw.githubusercontent.com/protectai/llm-guard/main/README.md | 1 | 全文 7,064 bytes |
| S2 | rebuff README（raw，含 disclaimer） | raw.githubusercontent.com/protectai/rebuff/main/README.md | 1 | 全文 5,775 bytes |
| S3 | rebuff 倉庫頁（archived 橫幅、★／fork） | github.com/protectai/rebuff | 1 | 全頁（內文 325 KB 含導覽），讀有效段 |
| S4 | llm-guard issue #232（2025-04 問下一版；maintainer 2025-05-16 回覆；2025-11-17 closed as not planned） | github.com/protectai/llm-guard/issues/232 | 1 | 全部留言（4 則） |
| S5 | llm-guard issue #324 "Is this repo maintained?" | github.com/protectai/llm-guard/issues/324 | 1 | 全部（1 則留言，非 maintainer） |
| S6 | llm-guard PR #355 "Archiving Project"（metadata） | api.github.com/repos/protectai/llm-guard/pulls/355 | 1 | 前約 6,000 字元（含 repo 欄位、body=null、merged_at） |
| S7 | llm-guard commits atom | github.com/protectai/llm-guard/commits/main.atom | 1 | 前 6,000 字元（最近 8 筆） |
| S8 | rebuff commits atom；issue #32 留言 | github.com/protectai/rebuff/commits/main.atom；api…/rebuff/issues/32/comments | 1 | atom 前 5,000 字元；留言 4 則全文 |
| S9 | llm-guard 搜尋出 issue（#340、#342、#319） | mcp__github__search_issues | 1 | 內文全（search 回傳） |
| S10 | PyPI llm-guard／rebuff 發版歷史 | pypi.org/project/llm-guard、/rebuff | 1 | WebFetch 摘要表（全表） |
| S11 | CSO Online：Protect AI 收購 Laiyer AI | csoonline.com/article/1303232/... | 2 | 全文 |
| S12 | PANW 宣布（2025-04-28）／完成（2025-07-22） | paloaltonetworks.com/company/press/2025/... | 1 | 僅搜尋摘要（含日期、句子） |
| S13 | StationX 〈LLM Guard Review〉（2026-08） | app.stationx.net/articles/llm-guard | 2 | 全文 |
| S14 | promptinjection.report 〈Rebuff…〉 | promptinjection.report/posts/rebuff-defense-review-failure-modes/ | 3 | 全文 |
| S15 | NeMo Guardrails README（develop） | raw…/NVIDIA-NeMo/Guardrails/develop/README.md | 1 | 全文 22,374 bytes |
| S16 | NeMo LICENSE.md；pyproject.toml | raw…/develop/LICENSE.md、pyproject.toml | 1 | LICENSE 全文 654 bytes；pyproject 前 7,156 bytes（截斷於 `[tool.ty.analysis]`） |
| S17 | NeMo 〈Jailbreak Protection〉文件 | docs.nvidia.com/nemo/guardrails/configure-guardrails/guardrail-catalog/jailbreak-protection | 1 | 全文 8,892 bytes |
| S18 | NeMo 〈Security Guidelines〉 | docs.nvidia.com/nemo/guardrails/resources/guidelines.md | 1 | 全文 13,223 bytes |
| S19 | NeMo releases atom | github.com/NVIDIA-NeMo/Guardrails/releases.atom | 1 | 前 6,000 字元（v0.24.1、v0.24.0） |
| S20 | pipelock README | raw…/pipelab-org/pipelock/HEAD/README.md | 1 | 全文 65,169 字元（存檔後分段讀完） |
| S21 | pipelock `docs/bypass-resistance.md` | raw…/docs/bypass-resistance.md | 1 | 全文 25,908 bytes |
| S22 | pipelock `docs/guides/claude-code.md` | raw…/docs/guides/claude-code.md | 1 | 全文 13,441 bytes |
| S23 | pipelock Gauntlet 結果頁 | pipelab.org/gauntlet/results/ | 1 | 靜態部分（結果表是 JS 載入，沒取到） |
| S24 | hol-guard README | raw…/hashgraph-online/hol-guard/HEAD/README.md | 1 | 全文 33,835 bytes |
| S25 | hol-guard `docs/guard/harness-support.md` | raw…/docs/guard/harness-support.md | 1 | 全文 28,683 bytes |
| S26 | guardrails-ai README | raw…/guardrails-ai/guardrails/HEAD/README.md | 1 | 全文 9,744 bytes |
| S27 | guardrails-ai issue #1560（sunset 公告，zsimjee，2026-07-06） | github.com/guardrails-ai/guardrails/issues/1560 | 1 | 抽取後全文（頁面 320 KB 含噪音） |
| S28 | IBM mcp-context-forge README | raw…/IBM/mcp-context-forge/HEAD/README.md | 1 | 全文 41,356 bytes |
| S29 | IBM `plugins/README.md` | raw…/plugins/README.md | 1 | 全文 21,992 bytes |
| S30 | IBM 支援選項（搜尋摘要：issue #2504、developer.ibm.com 部落格 2025-12-16） | github.com/IBM/mcp-context-forge/issues/2504 | 1 | 僅搜尋摘要 |
| S31 | docker/mcp-gateway README、`docs/mcp-gateway.md`、`docs/security.md`、`mcp_gateway_run.md` | raw…/docker/mcp-gateway/HEAD/ | 1 | 四份全文（11,813／2,844／9,752／7,552 bytes） |
| S32 | lennney/stop-that-shit README、EVIDENCE.md | raw…/lennney/stop-that-shit/HEAD/ | 1 | 兩份全文（14,168／29,723 bytes） |
| S33 | kenryu42/cc-safety-net README | raw…/kenryu42/cc-safety-net/HEAD/README.md | 1 | 全文 8,778 bytes |
| S34 | cc-safety-net／pipelock issue 標題列表 | mcp__github__search_issues | 1 | 標題、日期、狀態；內文未讀 |
| S35 | snyk/agent-scan README、LICENSE、TERMS.md | raw…/snyk/agent-scan/HEAD/ | 1 | README 全文 25,272 bytes；TERMS 全文 18,116 bytes；LICENSE 前 6,000 字元（Apache-2.0 全文，截斷） |
| S36 | Snyk 收購 Invariant Labs 新聞稿（2025-06-24） | snyk.io/news/snyk-acquires-invariant-labs-... | 1 | 全文 |
| S37 | Snyk Labs 部落格（Manoj Nair，2025-06-24） | labs.snyk.io/resources/snyk-labs-invariant-labs/ | 1 | 全文 |
| S38 | `github.com/invariantlabs-ai/mcp-scan` 重導向 | 同左 | 1 | `finalUrl` = github.com/snyk/agent-scan（重導向事實） |
| S39 | cisco-ai-defense/mcp-scanner README；`docs/mcp-2-threat-coverage.md` | raw…/cisco-ai-defense/mcp-scanner/HEAD/ | 1 | 兩份全文（36,814／3,798 bytes） |
| S40 | splx-ai/agentic-radar README | raw…/splx-ai/agentic-radar/HEAD/README.md | 1 | 全文 14,164 bytes |
| S41 | repo 欄位（stars／forks／license／pushed_at／archived） | mcp__github__search_repositories（minimal_output=false，兩批共 10 repo）；docker、guardrails 等另有 api 前 4,800 字元 | 1 | 全文 |
| S42 | appsecsanta 〈MCP Server Security Audit 2026〉（2026-04） | appsecsanta.com/research/mcp-server-security-audit-2026 | 2 | partial（讀到 Methodology 開頭；作者揭露 mcp-audit 由 Nucleus Security 主管投稿） |
| S43 | decryptiondigest 〈MCP scanners 2026〉 | decryptiondigest.com/blog/... | 3 | 僅搜尋摘要 |
| S44 | Mindgard／arXiv 2504.11168 〈Bypassing Prompt Injection and Jailbreak Detection in LLM Guardrails〉 | arxiv.org/html/2504.11168 | 2（學術預印本，Mindgard 團隊） | 僅搜尋摘要（ASR 數字） |
| S45 | arXiv 2510.09023 〈The Attacker Moves Second〉（Nasr, Carlini, Tramèr 等 14 人，2025-10-10） | arxiv.org/abs/2510.09023 | 2 | 摘要頁全文；內文只有搜尋摘要 |
| S46 | arXiv 2610.03448 〈Passing the Test You Trained On〉（JAIST，2026-10-02） | arxiv.org/html/2610.03448v1 | 2 | partial（見 0.1） |
| S47 | Claude Code hooks 參考 | code.claude.com/docs/en/hooks.md | 1（Anthropic 官方） | partial |
| S48 | 搜尋結果摘要：Guardrails AI 融資（Finsmes 2024-03）、LLMTools／Grepture 對 llm-guard 封存日期 | — | 2–3 | 僅摘要 |

---

## 2. 事實表（逐專案）

數字一律來自 S41 的 2026-10-22 取值；「fork 比」=forks/stars。

| 專案 | 維護者／類型 | 授權（讀原文） | ★／forks／fork 比 | 建立 | 最後 push | 狀態 |
|---|---|---|---|---|---|---|
| NVIDIA-NeMo/Guardrails | NVIDIA（org 帳號 NVIDIA-NeMo；`authors = NVIDIA`） | pyproject `license = "Apache-2.0"`；README 徽章 Apache 2.0；GitHub API = NOASSERTION（見 §4.6） | 7,341／878／12% ；270 open issues | 2023-04-18 | 2026-10-22 | 活躍。最新 release v0.24.1（2026-09-16），v0.24.0（2026-08-26）；develop 為 0.25.0.dev0。pyproject 分類 `Development Status :: 4 - Beta` |
| guardrails-ai/guardrails | Guardrails AI, Inc.（新創；搜尋摘要稱 2024 種子輪 750 萬美元，Zetta 領投）【第三方】 | Apache-2.0（API 與 README 徽章一致） | 7,553／729／9.7%；74 open | 2023-01-29 | 2026-10-21 | 活躍；但 2026-07-06 宣布 2026-08-25 關閉 hosted inference 與 Hub（§5.3） |
| hashgraph-online/hol-guard | Hashgraph Online（HOL，Hedera 生態系組織；「Maintained by Hashgraph Online」）；Vercel OSS 計畫徽章 | Apache-2.0 | 963／196／20%；106 open | 2026-03-28 | 2026-10-22 | 極活躍；repo size 550,729 KB（異常大，原因未查）；`web_commit_signoff_required=true` |
| pipelab-org/pipelock | 新創／單一作者（README 版權行：Copyright 2026 Joshua Waldrep；程式碼仍引用 `luckyPipewrench/...`，即作者個人帳號搬到 org） | 核心 Apache-2.0；`enterprise/` 目錄 Elastic License 2.0（ELv2）；官方 release 二進位內含付費層程式碼，需 license key 啟用 | 951／112／11.8%；6 open | 2026-02-08 | 2026-10-22 | 極活躍（v3.7.0）；open-core |
| IBM/mcp-context-forge（ContextForge） | IBM（org） | Apache-2.0 | 4,676／938／20%；**977 open issues** | 2025-05-08 | 2026-10-21 | 活躍；README 範例仍用 `1.0.0-RC-3`；IBM 提供付費支援（IBM Elite Support，24x7、2 小時 SLA）【自述，S30 摘要】 |
| docker/mcp-gateway | Docker（org） | MIT | 1,612／289／18%；169 open | 2025-04-22 | 2026-10-21 | 活躍；需 Docker Desktop 4.59+ |
| protectai/llm-guard | Protect AI → Palo Alto Networks | MIT | 3,217／468／14.5%；38 open（封存） | 2023-07-27（原 laiyer-ai） | 2026-07-08 23:58Z（封存 commit） | **archived，2026-07-09** |
| protectai/rebuff | Protect AI（原作者個人→Protect AI） | Apache-2.0 | ~1.5k／150／~10%；26 issues | 2023-04-24 | main 最後 commit 2024-01-25（atom 頂端）；母群盤點寫 2024-08-07 | **archived，2025-05-16** |
| lennney/stop-that-shit | 個人（User 帳號），中文圈 | MIT | 2,952／60／**2.0%**；6 open；size 957 KB | 2026-08-11（72 天，約 41★／天） | 2026-10-19 | 活躍（0.2.5，2026-10-15） |
| kenryu42/cc-safety-net | 個人（User 帳號） | MIT | 1,739／88／5.1%；2 open；`pull_request_creation_policy=collaborators_only` | 2025-12-25（301 天，約 5.8★／天） | 2026-10-21 | 活躍；issue 近 3 週 15 筆內多數已關閉 |
| snyk/agent-scan（前 invariantlabs-ai/mcp-scan） | Snyk（上市前資安廠商）；PR 僅限 collaborators | Apache-2.0（LICENSE 全文）；但分析 API 受 TERMS.md 約束（見下） | 3,161／293／9.3%；22 open | 2025-04-07 | 2026-10-21 | 活躍 |
| cisco-ai-defense/mcp-scanner | Cisco AI Defense | Apache-2.0 | 1,096／149／13.6%；70 open | 2025-09-24 | 2026-10-21 | 活躍；appsecsanta 測 v4.3.0（2026-04） |
| splx-ai/agentic-radar | SplxAI（新創）；2025 年由 Zscaler 收購（我沒查，標 [推論]，請勿引用） | Apache-2.0 | 1,058／152／14.4%；14 open | 2025-02-12 | **2025-11-27**（距今 11 個月無 push） | 沒封存但停滯 |

---

## 3. 比較表（機制、攔截位置、對 Claude Code 的整合）

| 專案 | 機制 | 攔截位置 | 對 Claude Code | 摩擦／失效模式 |
|---|---|---|---|---|
| NeMo Guardrails | 混合：Colang 對話流程（規則）＋ LLM 自我檢查（LLM judge）＋ NVIDIA 安全模型／分類器 ＋ 越獄啟發式（GPT-2 perplexity 閾值）＋ 第三方 API 整合 | SDK：包在應用與 LLM 之間（`LLMRails.generate`）；或獨立 server 提供 OpenAI Chat Completions 形式端點 | **不適用**：它是給「自己寫的對話應用」用的。Claude Code 不會呼叫 `LLMRails`；README 只說 LLM-based conversational applications [S15]。要擋 Claude Code 得把 Claude Code 的 API 流量導向它，但它暴露的是 OpenAI 格式端點 [推論：與 Claude Code 走 Anthropic Messages API 不合，未實測] | 偵測器掛掉時 **fail open**（官方警告原文，見 §4.1）；自我檢查 rail 每則訊息多一次 LLM 呼叫 |
| Guardrails AI | 驗證器（regex／分類器／LLM）＋結構化輸出約束 | SDK：`Guard().use(...)` 包住 LLM 呼叫；也可起 Flask server | 不適用（同上，無 hook／MCP 整合） | 2026-07 起 Hub 與 hosted inference 關閉，驗證器改 `pip install guardrails-ai-<name>`、模型須自己跑（§5.3） |
| pipelock | **規則**：65 組 DLP regex、34 組注入 pattern、熵分析、6 輪正規化（零寬字元、同形字、leetspeak、base64／hex）；MCP 工具政策 30 條、工具鏈 10 條。**無分類模型、無 LLM judge** | 三處：(1) HTTP 代理（`HTTPS_PROXY`；可選 TLS MITM）；(2) MCP stdio／HTTP 代理（包住 MCP server）；(3) Claude Code `PreToolUse` hook（`pipelock claude setup`，覆蓋 Bash、WebFetch、Write、Edit、Read、Grep、NotebookEdit、`mcp__.*`）；另可 `pipelock exec -- claude` 設環境變數、`pipelock contain` 用 netns＋nftables | **有專屬指南與 `claude-code` preset**；三條路徑可疊 | 非合作程式忽略 proxy 環境變數即繞過（自述）；Claude Code hook 預設失敗放行（§4.4）；MITM 要裝自簽 CA |
| hol-guard | 規則與目錄（Rust 編譯的指令規則、供應鏈情資、prompt／tool-result 篩查）；本機決策、可選 Cloud | **Claude Code 原生 hook**（`PreToolUse`、`PermissionRequest`；SessionStart）＋ managed MCP proxy ＋ 包裝啟動 | 有專屬 adapter；事件面：shell、mcp_tool、file_read、tool_result；**不裝 `UserPromptSubmit`**，所以使用者 prompt 不攔 | 其他 harness（Kimi、Grok、ZCode）hook 當掉時 fail open；Claude Code 該列未註明（取決於 Claude Code 預設，§4.4）；106 open issues |
| IBM ContextForge | 閘道＋外掛：內建 PII filter、regex／deny list、resource filter；外掛可串外部 LlamaGuard、OpenAI Moderation | MCP／A2A／REST 閘道（Claude Code 把它當一個 MCP server 連）；`tool_pre_invoke` 等 8 種 hook | 只管經過閘道的 MCP 工具，**看不到 Claude Code 內建的 Bash／Edit／Write** [推論：由架構判斷] | 要部署服務（Postgres／Redis 或 SQLite）；`mode: transform` 只記錄不阻擋；`fail_on_plugin_error: false` 為範例預設；977 open issues |
| Docker MCP Gateway | 隔離為主：每個 MCP server 跑容器（`no-new-privileges`、CPU 1／記憶體 2Gb 預設）；`--block-secrets`（預設開，掃描參數與回應中的 secret 樣式）；簽章驗證；工具白名單；`--interceptor` 外部程式 | MCP 閘道（Claude Code 以 `docker mcp client connect claude-code` 接入，寫入 `.claude.json`） | 官方支援；同樣只管 MCP | 預設**不封鎖外連**（`--block-network` 才擋）；明列不防 prompt injection（§4.2）；需 Docker Desktop |
| stop-that-shit | 規則（指令解析＋任務合約），Skill 搭配 hook | Claude Code plugin（PreToolUse）；Codex、OpenCode、Pi 等 | 有 | **本質不是資安工具**：目標是擋範圍膨脹與無用 hash／checksum（§4.5） |
| cc-safety-net | 規則：解析 shell 指令語意（旗標順序、`bash -c`、`python -c` 內層）；secret 路徑黑名單 | Claude Code `PreToolUse` hook（plugin，`npx cc-safety-net install`） | 有；README 自稱「不是 sandbox」 | 活躍 issue 顯示假陽性與漏擋並存（§4.5） |
| snyk/agent-scan | 本地發現設定＋**遠端 Snyk Analysis API**（LLM／規則，閉源）；v0.6 起輸出「風險指標分數」 | 安裝前／事後掃描（CLI，非攔截）；也有背景（MDM）模式回報 Snyk Evo | 自動發現 `~/.claude` 的 skills、`.mcp.json`、plugin | **需 `SNYK_TOKEN`**；設定與工具描述、skill 內容會送到 Snyk（secret 先遮蔽）；掃描會**啟動 stdio MCP server**（有 consent 提示）；「closed to contributions」；輸出格式「experimental」 |
| cisco mcp-scanner | 三引擎：YARA 規則＋LLM-as-judge＋Cisco AI Defense inspect API（付費訂閱，選用）；另有行為式原始碼分析、VirusTotal、pypi／npm 沙箱掃描 | CLI／REST／SDK，安裝前掃 MCP server（工具、prompt、resource、instructions） | 可讀 known client configs（含 Claude）；非攔截 | YARA 對 MCP 描述的假陽性很高（§4.5）；LLM 引擎要自帶金鑰 |
| agentic-radar | 靜態分析 agent 程式碼 → 工作流圖、工具、MCP server 偵測、漏洞對照 OWASP；`test` 模式用 LLM oracle 跑對抗輸入（需 `OPENAI_API_KEY`） | 掃**你寫的 agent 專案**（LangGraph、CrewAI、n8n、OpenAI Agents、AutoGen） | **不適用**：支援清單沒有 Claude Code／Claude Agent SDK | 最後 push 2025-11-27 |

---

## 4. 回答 (a)–(f)

### 4.1 NVIDIA NeMo Guardrails
- (a) 機制：規則（Colang 流程）＋LLM judge（`self check input/output`）＋分類模型（NVIDIA content safety／topic safety、jailbreak 隨機森林）＋啟發式。位置：SDK 包裝層或 server。引文【自述，S15】：「enables developers building LLM-based applications to add **programmable guardrails** between the application code and the LLM.」五種 rail：input、dialog、retrieval、execution、output。
- (b) 防什麼／不防什麼：【自述，S18】「They are not perfect」；列出三個坑：over-aggressive moderation、canonical form 過度泛化、nondeterminism。越獄啟發式的實測數字【自述，S17】：「Using the mean value of `89.79` yields 31.19% of jailbreaks being detected with a false positive rate of 7.44% on the dataset.」；且「intended only for English… significantly more false positives on non-English text, including code」——對 coding agent 的輸入（程式碼）是已知弱點。**fail open**【自述，S17】原文：「Jailbreak detection fails open. When a configured detector cannot be reached, the rail allows the request instead of blocking it.」「a detector outage removes this protection without a visible signal.」README 的內建護欄附註：「The built-in guardrails may or may not be suitable for a given production use case.」
- (c) Claude Code：無整合（見比較表）。
- (e) 評測：Mindgard 等人 2025 年預印本【第三方，S44，僅摘要】測 6 個護欄；「NeMo Guard Jailbreak Detect exhibited the highest susceptibility to jailbreak evasion with an average ASR of 65.22%」（AML 逃逸），字元注入下 jailbreak ASR 72.54%。Nasr 等【S45】用 BERT 類偵測器同一配方的 Protect AI、PromptGuard、PIGuard、Model Armor 做適應性攻擊，搜尋摘要稱對 Protect AI／PromptGuard／Model Armor ASR >90%（內文未讀）。
- (f) 授權：見 §4.6。更新頻率：3 個月內 2 次 release（8/26、9/16），push 當日。

### 4.2 Docker MCP Gateway（Microsoft MCP gateway 未查，擇一）
- (a) 機制：隔離與政策，不是內容判斷。容器隔離＋簽章＋工具白名單＋secret 掃描（`--block-secrets` 預設 true）。【自述，S31 security.md】「Docker MCP Gateway is a security boundary between MCP clients and the MCP servers」。位置：MCP 閘道。
- (b) 明確不防：【自述】「Prompt injection, tool-description poisoning, or malicious content from a tool, README, remote service, or upstream API, unless it bypasses a gateway boundary described in this document」列為 out-of-scope；「A malicious enabled MCP server abuses access that was intentionally granted to it」也 out-of-scope；「Network egress is not globally denied by default.」
- (c) 與 Claude Code：只覆蓋 MCP；`CLAUDE_CONFIG_DIR` 環境變數文件化。摩擦：Docker Desktop 4.59+；非 Desktop 要設 `DOCKER_MCP_IN_CONTAINER=1`。
- (e) 公開評測／繞過：沒找到（只查了搜尋摘要層級，未做專門搜尋）。
- (f) MIT、活躍、1,612★。

### 4.3 IBM ContextForge
- (a) 外掛 hook（`prompt_pre_fetch`、`tool_pre_invoke`、`tool_post_invoke`、`resource_post_fetch`、`agent_*` 等）；內建外掛皆規則類（PII filter、regex、deny list）；外部服務外掛（LlamaGuard、OpenAI Moderation）屬分類／LLM。【自述】「Self-contained plugins… Sub-millisecond latency」「External Service Plugins… 10-100ms」。
- (b) 不防：README 安全註記【自述】「Never run untrusted MCP servers directly on your local filesystem. Always use a sandbox」；外掛錯誤處理表：`transform` 模式「execution is allowed to proceed whether there are errors or violations」。
- (c) Claude Code：僅 MCP 一條路；要先部署閘道。
- (f) Apache-2.0；IBM 付費支援與社群並行；977 open issues 顯示維護量跟不上 issue 量（數字為事實，歸因為 [推論]）。

### 4.4 pipelock 與 hol-guard（Claude Code 原生整合的兩個）
- pipelock (a)：全部是規則。作者自承【自述，S21】「Regex-based injection detection: Injection patterns are syntactic, not semantic. An LLM-crafted injection that doesn't match known patterns will pass.」位置：網路邊界＋MCP＋hook。
- pipelock (b)：【自述 S21 Known Limitations】「Process-level attacks… Pipelock is a network proxy, not a sandbox. If the agent can exec arbitrary processes, those processes can bypass the proxy.」「Non-HTTP exfiltration」「Model compromise」；covert channel（時間、header 排序、HTTP/2 flag）「Not covered」；「Very slow exfiltration… 1 byte per hour」殘餘風險；「HITL approval flooding」。README 另寫 balanced 模式「raises the bar from 'one curl command' to 'sophisticated pre-planned attack.'」並說明 audit 模式只記錄（核心 floor 仍可擋）。
- pipelock (e)：自家公開基準 agent-egress-bench（268 案、18 類）與 Gauntlet；頁面自述「Every entry is a self-run, self-reported claim… not a ranking」且結果表是歷史版本（v3.6.0，而當前 v3.7.0）。第三方評測：**沒找到**。issue 側：#1675「request_body_scanning blocks (403) under mode: audit / enforce: false / action: warn」顯示模式語意讓使用者困惑（標題；內文未讀）；#1898 MCP taint classifier 把含 request 字樣的唯讀 GitHub PR 工具當 publish（假陽性類）。
- hol-guard (a)：規則＋供應鏈情資＋policy；Rust 為權威（「Every supported harness routes security semantics through the bundled, version-matched Rust runtime」）。位置：hook／managed proxy／包裝啟動。
- hol-guard (b)：【自述 S25】「`PostToolUse` reports a policy violation; it cannot undo an executed tool.」Claude Code 不攔使用者 prompt（「Guard does not install `UserPromptSubmit`」）；Copilot VS Code 擴充「Guard does not claim… interception」；「A VS Code Copilot inline tool prompt by itself is not proof that Guard blocked the action」。
- **對兩者共同的 Claude Code 事實（一手，S47）**：hook 預設失敗放行。原文：「**On most events, when a hook fails or times out, Claude Code still carries out the action. A policy hook with a wrong path or a crashing script then lets everything through.** To block the action instead, set `"onFailure": "block"`… Requires Claude Code v2.1.295 or later.」且「Non-blocking error: your hook exits with any other code, or fails in some other way… The action goes ahead」。換言之，所有 hook 型護欄（pipelock claude hook、hol-guard、cc-safety-net）是否 fail closed，取決於安裝時有沒有設 `onFailure: "block"`；pipelock 文件稱自己 hook「fails closed (denies)」是指它**自己判斷不了時**回 deny，不涵蓋 hook 進程根本沒啟動的情況 [推論，未實測；兩家安裝器是否自動寫 onFailure 我沒讀]。

### 4.5 個人小專案代表
- **stop-that-shit 不是資安護欄**。【自述 S32】「Skill + Guard，帮 AI coding agent 停止无用防御和任务越界」；攔的是 hash／checksum、範圍膨脹、subagent 數量、dependency。盤點把它歸 C 層是因為 GitHub topic 掛了 `guardrails`（S41 topics 欄），我建議從 C 層移出或改標「行為約束」。EVIDENCE.md 誠實到少見：「It may reduce some forms of execution drift, but it does not guarantee an effect on stochastic model behavior」；實測 pilot：「the plugin showed no task-level improvement… The paired result was two unchanged, zero improved, and zero regressed」；「Do not claim that Stop That Shit solves overengineering across coding agents」；Claude Code 防繞過：僅涵蓋標準 hook 路徑，「specialized tool paths that may bypass normal Hook coverage」列在 Not yet verified。
- **星數異常核對**：盤點寫「2950★／60 forks，forks 僅 2%」——屬實（2,952／60）。對照：同類個人專案 cc-safety-net 5.1%，其他組織專案 9.7–20%。issue 只有 6 筆、repo 957 KB、建立 72 天約 41★／天。README 內有中文社群導流（LINUX DO）。結論：**數字偏離常態，但我沒有取得星標時間序列，無法判斷刷星或單一社群爆紅**；[推論] 中文論壇單點導流足以解釋低 fork 比。不能拿它的 star 當成熟度證據。
- **cc-safety-net**（可當真正的 Claude Code hook 代表）：【自述】「It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.」「A broken config file never blocks anything.」（即設定壞掉時放行）。活躍 issue（標題，S34）同時出現假陽性與漏擋：#275「secret.ext-pattern.key blocked `NSAttributedString.Key`」、#238「secret-path false positives on PowerShell member access」、#223「rm -rf inside the cwd is denied after cd /d/...」；漏擋：#271「rsync --delete/--del destination is unanalyzed: root and unguarded-variable destinations are allowed」、#236「diskutil erase, wipefs, sgdisk, parted and redirects to a disk device are allowed」、#187「`caffeinate` is not unwrapped like `timeout` and `nohup`」。這些都在近三週被回報並多已關閉——說明黑名單式規則持續有洞、也持續被補。

### 4.6 NeMo 授權欄 NOASSERTION 是什麼意思（已弄清楚）
- GitHub API：`license: {key: other, spdx_id: NOASSERTION}`。
- 實際 `LICENSE.md` 只有 654 bytes：兩行 SPDX 標頭（`SPDX-License-Identifier: Apache-2.0`）加 Apache 2.0 的簡短 notice，**沒有完整 Apache 2.0 條文**。`pyproject.toml`：`license = "Apache-2.0"`；README：「licensed under the Apache License, Version 2.0」。
- [推論] GitHub 的授權偵測器需要比對完整條文，所以回 NOASSERTION；這是檔案格式問題，不是授權不明。實務上可視為 Apache-2.0，但企業合規若只看 GitHub 欄位會誤判。其餘倉庫（含 agent-scan）API 欄位與 LICENSE 一致。

### 4.7 B 層補充
- **snyk/agent-scan 被收購說法一手出處**：Snyk 新聞稿（2025-06-24，S36）「Snyk… today announced the acquisition of Invariant Labs」；Snyk Labs 部落格（Manoj Nair，S37）列出被收購的產品含「Invariant MCP-scan」。重導向事實：fetch `github.com/invariantlabs-ai/mcp-scan` 的 `finalUrl` 為 `github.com/snyk/agent-scan`（S38）。repo 建立日 2025-04-07 早於收購日，與「repo 由 Invariant 建立、後移轉 Snyk」一致，不矛盾；**repo 轉移的確切日期與改名 commit 我沒查**（無法讀 commits）。收購金額未見公開。細節：TERMS.md 仍署名「Invariant Labs AG, c/o Westhive AG, Zurich」，更新日 2025-01-12——條款沒隨收購更新（觀察，非指控）。
- agent-scan (a)(b)：本地發現＋遠端分析，README 警告【自述】「Scanning MCP configurations can execute commands or make outbound network requests.」；「DNS is validated before each request, but resolution again at connection time leaves a DNS-rebinding window.」輸出非穩定契約：「The raw output of this CLI… is experimental and may change without notice」。(c) 需 Snyk token；(e) 第三方 appsecsanta（mcp-scan v0.4.3，33 台 server）：37 個 finding，其中 33 筆是「server mutation」，「After review, all 33 mutations look benign」——訊號多但可行動性低。(d) 授權 Apache-2.0，但核心分析在 Snyk 的遠端 API，使用大量掃描會被封：「Using the standard Agent Scan API for large scale scanning is considered abuse and will result in your account being blocked.」
- cisco mcp-scanner (a)：YARA＋LLM＋API 三引擎。(b)【自述 S39】「A finding about an advertised risk does not prove exploitation. The scanner never dereferences schema URLs or invokes tools」，且明列哪些需「observed client/server exchange」才能判斷（Tasks 重放、Elicitation、MCP Apps 沙箱、shared-cache poisoning 等「No passive verdict」）。(e) 第三方 appsecsanta：Cisco v4.3.0 對 33 台 server 做了 27 筆偵測，作者人工複核認定 6 筆真，**假陽性約 78%**；例：`coercive_injection_generic` 把 context7 的「You MUST call this function first」當注入。作者利益揭露：該文也推薦由投稿者（Nucleus Security 主管）維護的 mcp-audit；我只讀到 Methodology 開頭，未讀完整回應策略。
- agentic-radar：對 Claude Code 使用者不適用（框架清單）。靜態分析的主體在本機（README FAQ：「static workflow analysis… run completely locally」），`test` 與 prompt hardening 會送 OpenAI。停止更新 11 個月。

---

## 5. (d) 已封存專案：生命週期失敗案例

### 5.1 protectai/llm-guard（封存日 2026-07-09）
時間線（均為我讀到的一手資料，另標第三方）：
| 日期 | 事件 | 來源 |
|---|---|---|
| 2023-07-27 | 倉庫建立（原 laiyer-ai） | S6 |
| 2024-01/02 | Protect AI 收購 Laiyer AI，並表示「We remain committed to open source and permissive use licensing」，同時說明「There will be a commercial version of Laiyer AI's open source LLM Guard product」 | S11（CSO，2024-02-01） |
| 2025-04-17 | 使用者在 #232 詢問下一版何時出；changelog 最新 0.3.15（2024-08-22） | S4 |
| 2025-04-28 | PANW 宣布收購 Protect AI | S12 |
| 2025-05-16 | maintainer asofter 回覆：「We acknowledge that this project hasn't been actively maintained recently. The reality is that, due to limited time and resources, along with the pace of change and competition in this space, it's been challenging to keep things as up-to-date as we'd like.」並說計畫處理 issues、歡迎 PR | S4 |
| 2025-05-19 | 最後一版 0.3.16 上 PyPI；**PyPI 無棄用或 yank 標記** | S10 |
| 2025-07-22 | PANW 宣布完成收購 | S12 |
| 2025-09-03 | main 最後一筆實質 commit（社群貢獻者） | S7 |
| 2025-11-17 | #232 被 `linear` 機器人以「not planned」關閉（關閉者為整合機器人，而非人） | S4 |
| 2026-02-27 | #324「Is this repo maintained?」，至今只有 1 則非 maintainer 的留言，推測 PANW 商業化 | S5 |
| 2026-07-08 | PR #355「Archiving Project」，作者 badarahmed，body 為 null，同日合併；README 加橫幅 | S6、S7 |
| 2026-07-09 | repo 設為 archived | S5 頁面橫幅 |

- 原文通知【自述 S1】：「THIS PROJECT HAS BEEN ARCHIVED. This project and its associated models on Hugging Face are no longer under active development or maintained.」**沒有原因、沒有繼任者、沒有遷移指引。**
- 為何封存：**沒有任何官方說明**。StationX（第三方）也明說「No reason was ever given」。可證實的只有兩點：維護者 2025-05 自述缺人力資源；封存發生在被 PANW 收購約一年後。兩者之間的因果【無來源證實】，只能算相鄰事件，不能寫成「因為被收購所以封存」。
- 使用者該怎麼辦（第三方建議＋我的整理）：(1) 查依賴樹；(2) 注意 **HuggingFace 模型也一併不再維護**（含 `protectai/deberta-v3-base-prompt-injection-v2`），代碼凍結與偵測器凍結是兩件事；(3) 未合併 PR 含安全修補，transitive 依賴 CVE（#342 `presidio-anonymizer` pin 擋住 `cryptography` 升級）永遠不會被修；(4) 遷移選項各家文章列 NeMo Guardrails 或雲端原生（Bedrock Guardrails、Azure Prompt Shields、Model Armor）。代價【StationX 實測】：llm-guard 本地 DeBERTa CPU 約 1 秒、免費；NeMo self-check 每則訊息多一次 LLM 呼叫。
- 教訓重點（與系列相關）：**「裝得起來、掃得出來」≠ 有人維護**——StationX 實測 4/4 攻擊提示被攔下，而且 PyPI 沒有任何警示；偵測模型會對新攻擊無聲退化。
- 證據層級提醒：StationX 的「28 個 PR 未合併」「已開 issue 含 path traversal 修補」我只在該文看到，沒有自己數 PR。Grepture、LLMTools 等站僅摘要，且為競品行銷文（S48）。

### 5.2 protectai/rebuff（封存日 2025-05-16）
- 創立背景（一手，S8）：2023-07-22 issue #32「Discord down, no further activity. Is this project abandoned?」。回覆者 woop（author_association = CONTRIBUTOR）：「We're definitely planning to invest a lot of effort into the project. Right now we've been focusing on moving the project and assets over to Protect AI, who will be shepherding the project going forward!」——專案從個人／小團隊移交給 Protect AI。
- 最後活動：main 的 atom 頂端 commit 為 2024-01-25；PyPI 最後一版 0.1.1（2024-01-20）；之後 16 個月無發版，2025-05-16 封存。
- README **沒有任何封存通知**（S2 為 main 的原文；S3 只有 GitHub 橫幅）。沒有原因說明。封存日與 llm-guard #232 的 maintainer 回覆同一天（2025-05-16）——觀察到的巧合，不推因果。
- README 本身的 disclaimer【自述】：「Rebuff is still a prototype and **cannot provide 100% protection** against prompt injection attacks!」roadmap 仍有未勾項（Python SDK parity、local-only mode、user-defined detection strategies、adversarial suffixes heuristics）。
- 技術弱點（第三方 S14，低可信但內容與架構一致）：偵測只掃使用者輸入，不掃檢索文件／工具輸出；canary 抓不到工具呼叫式外洩。S14 另稱「its own README calls it a prototype」可由 S2 證實。S14 引用的 Simon Willison 2022 文章（偵測器本身可被注入）我沒開原文。
- 使用者該怎麼辦：只有第三方建議（把它當參考架構、不要當依賴；SDK 釘 `langchain ^0.1.1`、`pinecone-client ^3.0.0`、`openai ^1.8.0`——我未驗證 pyproject）。

### 5.3 其他生命週期事件（可補進系列）
- **Guardrails AI（未封存但收縮）**：issue #1560「SUNSET REMOTE INFERENCING AND HUB on 8/25」，作者 zsimjee，2026-07-06。原文理由：「hosted remote inferencing has been offered for free since 2024, and the cost of running it is high.」「guardrails validators do not install cleanly via `pip` or `uv`」；hard cutoff 2026-08-25（內文另寫 hosted inference 8/6 先關，兩個日期並存）。「50 of the 64 validators are available on PyPI today」。這是「免費託管推論成本太高」型的緩慢失敗。
- **agentic-radar**：沒封存，但 11 個月沒有 push。
- **LLM 護欄類在 NeMo 自身也有 fail-open 與引擎覆蓋缺口**：jailbreak heuristics 在 IORails 引擎「✗」（issue #2285）。

---

## 6. (e) 評測、誤報、繞過——彙整與反證

| 發現 | 來源 | 涉及工具 | 讀取程度 |
|---|---|---|---|
| 適應性攻擊對 12 種防禦（含 BERT 類偵測器）ASR 多 >90%，而多數原本報近零 | Nasr 等，arXiv 2510.09023（摘要頁全文） | llm-guard 的分類器同屬 ProtectAI 系列（論文用 "Protect AI Detector"） | 摘要全文；內文僅搜尋摘要 |
| 字元注入／AML 逃逸：NeMo Guard Jailbreak Detect 平均 ASR 65.22%；Protect AI v2 對提示注入 ASR 20.26%（v1 為 77.32%） | arXiv 2504.11168（搜尋摘要） | NeMo、llm-guard 背後模型 | 僅摘要 |
| **Protect AI v2（llm-guard 預設分類器）在 AgentDojo 乾淨工具輸出上誤報 30.1%，會擋掉 69.1% 的任務**；PIGuard 29.5%／59.8%；最佳偵測器在 BIPIA 外的 AgentDojo 只抓 2%（1% FPR）；排名跨 benchmark 的 Kendall τ=0.01 | arXiv 2610.03448（2026-10-02，JAIST） | llm-guard、任何「工具輸出篩查」 | partial；數字取自搜尋摘要，已讀摘要與討論／限制段 |
| 該論文自述限制：兩個 benchmark 都是模擬環境（YAML／JSON 合成資料），「absolute numbers will differ in deployment」；攻擊皆為靜態模板，偵測率是「upper bounds」；商用 API 偵測器未納入 | 同上 §6 | — | 全讀 §6 |
| MCP 掃描器 YARA 規則假陽性約 78%（27 筆中 6 筆真） | appsecsanta（單人，33 台 server，2026-04） | Cisco mcp-scanner v4.3.0 | partial |
| NeMo 啟發式：31.19% 偵測、7.44% 假陽性（官方自報） | NeMo 文件 | NeMo | 全文 |
| pipelock 自報基準 | agent-egress-bench（自家） | pipelock | 僅靜態頁 |
| 反證（工具有用的一面）：Nasr 等承認「detectors are relatively easy to deploy and can still provide practical value by blocking some unsophisticated or opportunistic attacks」（搜尋摘要） | arXiv 2510.09023 | — | 僅摘要 |
| 反證：StationX 對凍結的 llm-guard 實測 4/4 攻擊被擋、CPU 次秒級 | StationX | llm-guard | 全文（但僅 4 個提示，作者自述「a smoke test, not a benchmark」） |
| 反證：2610.03448 發現部分偵測器（Horizon-Labs、Wolf Defender、Prompt Guard 2）在兩個 agent benchmark 上誤報近 0 且抓 >50% 注入 | 同上 §6 | — | 全讀 |
| 反證：Docker 閘道、cc-safety-net 屬確定性邊界，不靠分類模型；其 issue 顯示漏洞被持續回報修補 | S31、S34 | — | — |

**一輪反證搜尋做了什麼**：搜了 "bypass／limitations／false positive／evaluation" 對 NeMo、cc-safety-net、MCP scanner、Rebuff；找到上列。**沒找到**：pipelock、hol-guard、Docker MCP Gateway、IBM ContextForge 的第三方繞過研究或獨立評測（搜尋與 `search_issues` 皆無結果；`search_issues` 帶引號關鍵字時對這幾個 repo 回傳 0，可能是搜尋語法限制，不等於不存在）。至少一個 2024 年後來源：全部來源均為 2024 年後（多為 2025–2026）。

---

## 7. (f) star 合理性小結
- 母群對照：fork 比 5–20% 是常態區間（agent-scan 9.3%、pipelock 11.8%、NeMo 12%、cisco 13.6%、radar 14.4%、docker 18%、IBM／hol-guard 20%）。
- 異常：stop-that-shit 2.0%（見 §4.5）；cc-safety-net 5.1% 偏低但非極端（Claude Code 用戶多為使用者不 fork）。
- hol-guard 20% fork 比與 106 open issues 可能來自其「貢獻擴充要先 fork 再開 draft PR」流程 [推論]。
- IBM 977 open issues／938 forks 與 4,676★ 一致，屬大型企業內部＋社群關注，非刷星特徵 [推論]。
- 星數無法驗證成熟度：llm-guard 3,217★ 仍被封存；NeMo 7,341★ 是活躍；兩者星數量級相近，結局不同。

---

## 8. 給系列的整合結論（只列有證據的）
1. 護欄機制光譜：規則（pipelock、cc-safety-net、hol-guard、Docker block-secrets、IBM 內建外掛）／分類模型（llm-guard、NeMo 的 jailbreak 模型）／LLM judge（NeMo self-check、Cisco LLM 引擎、Snyk 遠端分析、Rebuff 層 2）。規則類假陽性可讀、可調；分類模型類假陽性在工具輸出上高（2610.03448）；LLM judge 增加成本與可被注入。
2. 位置光譜：SDK（NeMo、Guardrails AI、llm-guard）對 Claude Code 無法用；hook（pipelock claude、hol-guard、cc-safety-net）與 MCP 閘道（Docker、IBM、pipelock mcp proxy）才有接點。
3. **Claude Code hook 預設失敗放行**（官方文件原文），這是所有 hook 型護欄共同的前提風險；要 fail closed 需 `onFailure: "block"`（v2.1.295+）。
4. 「安裝前掃描」類（agent-scan、Cisco）是事前、清單式，不是執行期攔截；假陽性高且輸出不穩定；agent-scan 要把設定送到 Snyk。
5. 凍結的偵測器（llm-guard）比凍結的規則更危險：沒有任何執行期訊號。

---

## 9. 五關自評
（假設「五關」＝來源一手性、讀取完整性、交叉驗證、反證、時效；如定義不同請告知）

| 關 | 自評 | 說明 |
|---|---|---|
| 1 一手來源 | 通過（多數） | README、LICENSE、security docs、issue 原文、官方新聞稿多為一手；PANW 新聞稿與 Nasr 論文內文只有摘要 |
| 2 讀取完整 | **未全通過** | 見 §0.1；hooks 頁、arXiv 2610.03448、appsecsanta 為 partial；issue 只讀標題 |
| 3 交叉驗證 | 部分 | 封存日（頁面橫幅、PR metadata、StationX、LLMTools 一致 2026-07-09）、PyPI 日期、NOASSERTION 成因（LICENSE＋pyproject 雙證）已交叉；Snyk 收購（新聞稿＋部落格＋重導向）已交叉；星數取自單一 API 快照 |
| 4 反證 | 通過但窄 | 做了一輪；pipelock、hol-guard、Docker、IBM 找不到第三方評測，結論限定為「我沒找到」 |
| 5 時效 | 通過 | 所有數字當日取值（2026-10-22）；Gauntlet 結果為 v3.6.0 歷史資料已註明 |

## 10. 待補清單
1. 讀完 hooks 頁 5 萬字元之後的部分，確認 `PermissionRequest`／plugin hook 的失敗語意。
2. 確認 pipelock、hol-guard、cc-safety-net 的安裝器是否預設寫 `onFailure: "block"`（讀安裝器原始碼；需 add_repo＋clone）。
3. 讀 arXiv 2610.03448 全文表 2（FP、TPR@1%FPR）與 Nasr 論文對 Protect AI 的確切 ASR 表。
4. Microsoft MCP gateway（`microsoft/mcp-gateway`，890★）未查；agentic-radar 是否被收購未查。
5. stop-that-shit 星標時間序列（star-history）未取得。
6. 試完 fallback 鏈（cloudflare、linkup、jina、Exa、firecrawl）對 Senthex 404 頁與 PANW 新聞稿全文。
