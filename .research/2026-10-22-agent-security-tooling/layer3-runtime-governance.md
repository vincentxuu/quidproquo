# 第3層：執行期治理——microsoft/agent-governance-toolkit（AGT）與 OWASP Agentic Top 10

調查日：2026-10-22。repo 一手來源 = 本機 `git clone --depth 200`（`/home/user/microsoft/agent-governance-toolkit`，HEAD `9c85646` 2026-10-22）。淺 clone 只含 2026-09-23 之後的歷史，更早的 commit 沒讀。

標記：【自述】= 作者/廠商自己說的；【第三方】= 外部報導；【實測】= 我讀原始碼確認；[推論] = 我的推測。

---

## 0. 降級紀錄（toolDegradation）

| 步驟 | 工具 | 結果 | 處置 |
|---|---|---|---|
| 讀 repo | `mcp__github__get_file_contents` / `list_commits` / `list_releases` | 失敗：`Access denied: repository "microsoft/agent-governance-toolkit" is not configured for this session. Allowed repositories: vincentxuu/quidproquo` | 改 `mcp__claude-code-remote__add_repo`（read，公開 repo，無需附加憑證）+ `git clone --depth 200`。讀全文用本機檔案。 |
| GitHub releases API | `curl api.github.com/.../releases` | 失敗：`GitHub access to this repository is not enabled for this session` | 改用 `CHANGELOG.md`、PyPI JSON、Groundlane 取 `api.github.com/repos/...`（成功） |
| OWASP 官方資源頁 | Groundlane `web_fetch` genai.owasp.org/resource/... | HTTP 403 challenge，只拿到 About 段 | 見下一列 |
| OWASP 官方資源頁 | jina `read_url` | 401 bad IP reputation | 換下一個 |
| OWASP 官方資源頁 | Exa `web_fetch_exa` | 成功但只回 About 段（頁面清單在 PDF 內） | 換 PDF |
| OWASP 官方 PDF | Groundlane 直連 `/wp-content/uploads/2025/12/OWASP-Top-10-for-Agentic-Applications-2026.pdf` | 403 challenge / 404 | 改用 SlideShare 上傳的同一份 PDF（頁首標 `genai.owasp.org`、`Version 2026 December 2025`） |
| OWASP 官方 PDF 鏡像 | Groundlane `web_fetch` slideshare（extract=full） | 成功，但內容被截在 100000 字元 | 取得 TOC、At-a-glance、ASI01/06/08/10 全段 |
| OWASP 宣告文 | Groundlane `web_fetch` genai.owasp.org/2025/12/09/... | 403 標記但內文完整回傳（browser engine） | 當作 read |
| OWASP 資源頁 | firecrawl_scrape | 失敗：`Insufficient credits` | 不重試 |
| 搜尋 | Groundlane `web_search`（tavily/exa/brave 部分 `unavailable`，you/brave 有回） | 部分成功 | 照用 |
| Tavily / linkup / WebFetch | 未動用 | 鏈中前段已足夠 | n/a |

---

## 1. 來源清單與讀取程度

| # | 來源 | 網址 | 讀取程度 | 類型 |
|---|---|---|---|---|
| S1 | AGT README | https://raw.githubusercontent.com/microsoft/agent-governance-toolkit/main/README.md ；本機 `README.md` | read（全文，26,939 bytes） | 一手/自述 |
| S2 | OWASP 對照文件 | repo `docs/compliance/owasp-agentic-top10-architecture.md`（last_reviewed 2026-08-10，v1.1） | read（全文） | 一手/自述 |
| S3 | 已知限制 | repo `docs/LIMITATIONS.md`（last_reviewed 2026-08-16） | read（全文，408 行） | 一手/自述 |
| S4 | MCP Security Gateway 規格 | repo `docs/specs/MCP-SECURITY-GATEWAY-1.0.md`（1970 行） | partial（讀到 §1–§6.11，約 550 行；§7 之後未讀） | 一手/自述 |
| S5 | MCP 掃描器原始碼 | repo `agent-governance-python/agent-os/src/agent_os/mcp_security.py`（1049 行） | partial（regex 表、`check_rug_pull`、`_check_cross_server`、`_is_typosquat` 讀全；其他 `_check_*` 只看簽章） | 一手/實測 |
| S6 | Claude Code 外掛 | repo `agent-governance-claude-code/`（`README.md`、`hooks/hooks.json`、`hooks/pre-tool-use.mjs`、`lib/policy.mjs` 約 60 行片段、`lib/poisoning.mjs`） | partial（hooks.json/README/pre-tool-use 全讀；policy.mjs 1170 行只讀 mcp 相關段） | 一手/實測 |
| S7 | 語意政策引擎 | repo `agent-os/src/agent_os/semantic_policy.py`、`prompt_injection_embedding.py` | partial（各讀前 25–30 行 docstring） | 一手/實測 |
| S8 | 身分/信任/沙箱/稽核/環 | repo `agent-mesh/.../identity/agent_id.py`、`trust/levels.py`、`constants.py`、`reward/scoring.py`、`governance/audit.py`、`agent-sandbox/README.md`、`agent-hypervisor/.../models.py` | partial（各讀前 40–140 行或 grep） | 一手/實測 |
| S9 | ACS 政策引擎說明 | repo `policy-engine/README.md` | partial（前 25 行 + grep） | 一手/自述 |
| S10 | MAINTAINERS / VERSION / CHANGELOG / ADOPTERS | repo 根目錄 | partial（MAINTAINERS 前 40 行；CHANGELOG 標題與前段；ADOPTERS 前 30 行） | 一手 |
| S11 | Microsoft 發表文 | https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/ | read（全文） | 自述（作者 Imran Siddique） |
| S12 | PolicyLayer 文章 | https://policylayer.com/blog/microsoft-agent-governance-toolkit （dev.to 轉載 https://dev.to/policylayer/microsofts-agent-governance-toolkit-9-packages-mcp-blind-2dnj 只讀 snippet） | read（policylayer.com 全文） | 第三方（廠商，競品） |
| S13 | Socket | https://socket.dev/blog/microsoft-open-source-toolkit-for-ai-agent-runtime-security | read（全文） | 第三方報導 |
| S14 | InfoWorld（Simon Bisson，2026-05-28） | https://www.infoworld.com/article/4175859/microsofts-open-source-toolkit-for-controlling-out-of-control-ai-agents.html | read（全文） | 第三方報導 |
| S15 | InfoWorld（2026-04-08 首報） | https://www.infoworld.com/article/4155591/microsofts-new-agent-governance-toolkit-targets-top-owasp-risks-for-ai-agents.html | snippet（只有搜尋摘要） | 第三方報導 |
| S16 | ChatForest | https://chatforest.com/guides/microsoft-agent-governance-toolkit/ | read（全文；站方自述「由 AI 撰寫、不實測」） | 第三方（低可信） |
| S17 | Periculo 紅隊文 | https://www.periculo.co.uk/cyber-security-blog/red-teaming-the-microsoft-agent-governance-toolkit-15-bypass-vectors | read（全文） | 第三方（單人自述，未附 PoC） |
| S18 | OWASP 宣告文 | https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/ | read（全文） | OWASP 官方 |
| S19 | OWASP 資源頁 | https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ | partial（只拿到 About 段；清單在 PDF） | OWASP 官方 |
| S20 | OWASP 官方 PDF（SlideShare 鏡像） | https://www.slideshare.net/slideshow/owasp-top-10-for-agentic-applications-2026-pdf/284650268 | partial（前 100,000 字元：TOC、At-a-glance、ASI01 全段、ASI06/08/10 描述段；ASI02–05、07、09 描述段未取得） | OWASP 官方內容，第三方託管 |
| S21 | PyPI JSON | https://pypi.org/pypi/agent-governance-toolkit/json | partial（解析 version/upload_time） | 一手 |
| S22 | GitHub repo API | https://api.github.com/repos/microsoft/agent-governance-toolkit | partial（前 6000 字元） | 一手 |
| S23 | Microsoft dotnet 部落格 | https://devblogs.microsoft.com/dotnet/governing-mcp-tool-calls-in-dotnet-with-the-agent-governance-toolkit/ | snippet | 自述 |
| S24 | Microsoft Developer 部落格 | https://developer.microsoft.com/blog/securing-mcp-a-control-plane-for-agent-tool-execution/ | snippet | 自述 |

blocked：無（OWASP 資源頁與官方 PDF 直連被擋，已用鏡像補，標在 S19/S20）。

---

## 2. 結論摘要（對應題目 a–h）

| 題 | 結論 | 證據 |
|---|---|---|
| (a) 套件數 | 沒有單一數字。官方文件有三種數：7、9、5（PyPI 發行物）；repo 目前 Python 目錄 26 個。 | §3、§9 |
| (b) 五大機制 | 見 §4。政策=ACS（Rust 核心，來自上游 repo）+ 舊 YAML/OPA/Cedar；身分=Ed25519 + `did:mesh`；沙箱=5 種 provider + 四級 ring；稽核=SHA-256 hash chain；信任=0–1000 分五級。 | §4 |
| (c) MCP 閘道 | 全是啟發式（regex + SHA-256 指紋 + Levenshtein ≤2），掃描器裡沒有 LLM。 | §5 |
| (d) OWASP 10/10 | 「10/10」是行銷標語；repo 自己的文件寫 7 Full、3 Partial，並聲明是「internal self-assessment, NOT a validated certification」。 | §6 |
| (e) Claude Code | hook：SessionStart、UserPromptSubmit、PreToolUse 三個 command hook（Node），外加內建 MCP server 兩個工具。沒有 PostToolUse。 | §7 |
| (f) 批評 | PolicyLayer 說「完全看不到 MCP」；與 repo 不符。Periculo 的 15 項有些可在 repo 側印證，多數未驗證。 | §8 |
| (g) 成熟度 | 官方稱 Public Preview；repo VERSION 5.0.0；PyPI 主套件最新 4.1.0；2026-03-02 建立；一天內多筆 commit。 | §9 |
| (h) OWASP 10 項 | 見 §10。 | §10 |

---

## 3. (a) 套件組成與數字衝突

### 事實表

| 來源 | 數字 | 原文 | 日期/狀態 |
|---|---|---|---|
| Microsoft 發表文 S11 | 7 | "structured as a monorepo with seven independently installable packages" | 2026-04-02 |
| Socket S13 | 7 | "structured as seven independently installable packages" | 2026-04-07，沿用 S11 |
| ChatForest S16 | 7 | "a seven-package, MIT-licensed system" | 2026-04-06，沿用 S11 |
| repo 子套件 README（agent-os、agent-runtime、agent-marketplace、agent-lightning） | 7 | "Agent OS is part of a suite of seven packages" / "one of 7 packages in the Agent Governance Toolkit" | 舊文字未更新 |
| PolicyLayer S12 | 9 | "nine packages covering policy enforcement, cryptographic identity..." | 2026-04-13（dev.to 轉載 2026-06-16） |
| repo 根 README S1「Packages」表 | 9 列 | Agent OS、Agent Control Specification、Agent Mesh、Agent Runtime、Agent SRE、Agent Compliance、Agent Marketplace、Agent Lightning、Agent Hypervisor | HEAD |
| repo 根 README「Python distributions (v4.1.0 — consolidated)」 | 5 | "As of v4.1.0, 45 packages have been consolidated into 5 top-level distributions" | HEAD |
| repo `agent-governance-python/` 目錄 | 26 個子目錄 | `ls` 計數（含 agent-os、agent-mesh、agent-runtime、agent-sre、agent-compliance、agent-marketplace、agent-lightning、agent-hypervisor、agent-sandbox、agent-mcp-governance、agent-rag-governance、agent-learning、agent-discovery、agt-policies 等） | HEAD |
| repo CHANGELOG | 7 與 9 都出現 | "all 7 packages"（Python）、"all 9 packages"（npm） | 舊條目 |

### 判定

- 「7」是 2026-04 發表時的數字，Hypervisor 與 ACS 當時不在清單內。 [推論]：9 是後來加入 Hypervisor 與 ACS 的結果，因為 S1 的 9 列剛好比 S11 的 7 個多這兩個。
- PolicyLayer 說 9 的日期（2026-04-13）與 Microsoft 發表文說 7 的日期（2026-04-02）只差 11 天。我沒能從淺 clone 驗證那段期間 repo 是 7 還是 9；**這個差異沒有結案**。
- 現在以 repo 為準：根 README 列 9 個元件，但 PyPI 發行物已合併成 5 個，Python 目錄有 26 個。三個數字描述不同層次，沒有一個是「套件總數」。
- 語言 SDK 另計：Python、TypeScript、.NET、Rust、Go；外加 Copilot CLI、Claude Code、Codex CLI、OpenCode、Antigravity CLI 等外掛目錄（repo 根目錄 `agent-governance-*`）。

---

## 4. (b) 五大機制的實作

### 4.1 政策引擎

- 【自述】README：「Policy engine host code uses the ACS SDK」；ACS（Agent Control Specification）上游是 `responsibleai/agent-control-spec`，"AGT retains the `AgentControl` host APIs and framework adapters in `policy-engine/`, not a second decision engine."（S1）
- 【實測】`policy-engine/README.md`："This directory contains AGT's compatibility shim, host SDKs, adapters, policy tooling and examples. It does not contain the upstream decision engine."——**決策引擎本體不在這個 repo**，我沒讀到。
- 【自述】README 流程圖寫 `Policy Engine (YAML/OPA/Cedar)`。`govern(my_tool, policy="policy.yaml")` 可做 `deny` / `require_approval`。
- 【實測】ACS 註解宣告 annotator 類型 `classifier`、`llm`、`endpoint`（`policy-engine/README.md:121`）。**所以政策層可選接 LLM judge**，但這是上游 ACS 的選配，不是預設。
- 【實測】「語意意圖分類器」（`semantic_policy.py`）原文："This is a heuristic classifier (no ML dependency). It can be upgraded to a fine-tuned model later while keeping the same API."——是 regex 啟發式。
- 【實測】`prompt_injection_embedding.py`："**Disabled by default**"、"**Evidence-only**... `EmbeddingEvidence.blocks` is always `False`"。
- 【自述】LIMITATIONS §9："If the policy evaluator has **no policies loaded**, the default action is `allow`"；"On **runtime errors** during policy evaluation, AGT fails closed"。
- 重要對比：Microsoft 發表文把「Goal hijacking」對應到 "Semantic intent classifier in the policy engine"（S11），而 repo 裡這個分類器是 regex 表（S7）。Socket 也寫 "Microsoft hasn't published independent validation of how the classifier performs"（S13）。

### 4.2 零信任身分

- 【實測】`agentmesh/identity/agent_id.py`：`AgentDID` 格式 `did:mesh:<unique-id>`；`AgentIdentity.public_key` 為 "Ed25519 public key (base64)"；用 `ed25519.Ed25519PrivateKey.generate()` 產金鑰，`sign(data)` 簽章；有 `parent_did`（委派）。
- 【實測】同目錄另有 `spiffe.py`、`mtls.py`、`entra*.py`、`delegation.py`、`revocation.py`、`rotation.py`、`attestation*.py`、`tee_keystore.py`。我只看到檔名，沒讀內容。
- 【實測】握手 `trust/handshake.py` docstring 列：challenge-response、registry、trust score threshold（第 185 行「3. Trust score (threshold check)」）。
- 【自述】LIMITATIONS §12：DID 前綴不一致，Python/.NET 用 `did:mesh:*`，TypeScript/Rust/Go 用 `did:agentmesh:*`；策略以前綴比對時會對不上。

### 4.3 沙箱

- 【實測】`agent-sandbox/README.md` 列五個 provider：`DockerSandboxProvider`（"capabilities dropped, no privilege escalation, a read-only root filesystem, a non-root user, and no network by default"）、`HyperLightSandboxProvider`（micro-VM）、`ACASandboxProvider`（Azure Container Apps）、`MxcSandboxProvider`、`NonoSandboxProvider`（Landlock/Seatbelt，僅 Linux/macOS）。
- 【實測】`agent-hypervisor/src/hypervisor/models.py`：`ExecutionRing` 四級 `RING_0_ROOT`、`RING_1_PRIVILEGED`、`RING_2_STANDARD`、`RING_3_SANDBOX`，依有效信任分數與 consensus 決定。
- 【自述】README Security 段（原文）："AGT enforces governance at the application middleware layer, not at the OS kernel level. The policy engine and agents share the same process boundary. **Production recommendation:** Run each agent in a separate container for OS-level isolation."
- 【實測】CHANGELOG [Unreleased] 有四條連續修 `RingEnforcer.check_command` 命令 denylist 繞過（無空白、路徑/引號、變數賦值/wrapper、`sudo`/`doas`/`xargs`）。——denylist 型控制仍在補洞，**ring 的命令檢查是字串解析，不是核心隔離**。

### 4.4 稽核

- 【實測】`agentmesh/governance/audit.py`：`previous_hash`、`entry_hash`，`compute_hash()` 用 SHA-256 對 canonical 欄位。註解寫某些欄位 "NOT part of the canonical entry hash in spec v1.0"。
- 【實測】`audit_backends.py`：file-based append-only JSON-lines sink，支援輪替、`HashChainVerifier.verify_file`。
- 【自述】LIMITATIONS §2："AGT's audit trail records **what the agent attempted**... It does **not** verify whether the action actually succeeded."
- Periculo 說 hash chain 預設存在記憶體（S17 V6）。repo 側：有 file sink，但我沒查「預設」用哪一個。**未驗證**。

### 4.5 信任評分

- 【實測】`reward/scoring.py`：`TrustScore.total_score` 0–1000；`TRUST_SCORE_DEFAULT = 500`；維度含 `policy_compliance`、`security_posture`、`collaboration_health`（`constants.py`、`scoring.py:29-33`）。
- 【實測】`constants.py`：`TIER_VERIFIED_PARTNER_THRESHOLD=900`、`TRUSTED=700`、`STANDARD=500`、`PROBATIONARY=300`；`TRUST_REVOCATION_THRESHOLD=300`。
- 【實測】`reward/trust_decay.py`：`NetworkTrustEngine`，"Per-hour decay applied when an agent has no positive signals"，預設 `decay_rate=2.0`；另有 trust contagion（A 信任 B，B 失敗則 A 分數下降）。
- 【實測】`levels.py` 的 `trust_level_for_score` 是純門檻比較，沒有 ML。

---

## 5. (c) MCP Security Gateway

### 事實表

| 威脅 | 偵測方法 | 證據 | 是否 LLM |
|---|---|---|---|
| 隱藏指令 | 不可見 Unicode regex（`​-‍﻿`、`‪-‮`、`⁦-⁩`、`­`、`⁠᠎`）；HTML/Markdown 註解 regex；長 base64（`[A-Za-z0-9+/]{40,}`）與 hex 序列；`\n{5,}.+` 過量空白 | `mcp_security.py:127-196` | 否 |
| Tool poisoning / 描述注入 | 片語 regex：`ignore\s+(all\s+)?previous`、`system\s*:`、`you\s+must`、`always\s+call`、`mandatory` 等；外洩 regex：`curl`、`wget`、`https?://`、`send\s+email`；提權：`sudo`、`exec(`、`eval(` | `mcp_security.py:144-192` | 否 |
| Schema 濫用 | 欄位名稱、參數數量、欄位描述中的指令 | `_check_schema_abuse`（`mcp_security.py:819`，內容只看簽章） | 否 [推論：同樣是規則] |
| Rug-pull | `register_tool` 時存 SHA-256(description) 與 SHA-256(canonical JSON schema)；`check_rug_pull` 比對，不同則回 `RUG_PULL` / `CRITICAL` | `mcp_security.py:584-625` | 否 |
| Typosquatting | 工具名稱（不是套件名稱）與**其他 server** 已註冊工具名稱的 Levenshtein 距離 1–2 且最短長度 ≥4 → `CROSS_SERVER_ATTACK`、`WARNING`；同名跨 server → `CRITICAL`（impersonation） | `mcp_security.py:912-998`；規格 §6.9 | 否 |
| 回應內容掃描 | `mcp_response_scanner.py`、`mcp_gateway.py`（注入、憑證洩漏、PII、外洩 URL） | 規格 §5；程式碼只看檔案大小/fail-closed 註解 | 未驗證（目測無 LLM） |

### 限制（實測）

1. 掃描器用的是**行程內記憶體登錄表**：`self._tool_registry: dict[str, ToolFingerprint] = {}`（`mcp_security.py:371`）。程式碼沒顯示持久化；重啟後 rug-pull 基準消失 [推論，我沒追蹤是否有外部持久化層]。
2. Rug-pull 只比對「第一次登錄」之後的變化。第一次登錄時已經被投毒的工具不會被這項偵測抓到。
3. Typosquat 只在「已登錄的別台 server 的工具名稱」之間比。它**不**偵測 npm/PyPI 套件名稱 typosquat（那是 `agent-compliance/supply_chain.py` 的 `SupplyChainGuard.check_typosquatting`，且 Periculo 批評它依賴硬編碼的熱門套件清單）。
4. 片語 regex 對改寫、非英文、同形字很弱。repo 自己也在補：HEAD 前 5 筆 commit 之一是 `fix(agent-os): prevent invisible-character evasion in conversation guardian (#4124)`，且 `normalize.py` 內有 Cyrillic/Greek 同形字折疊註解。Periculo 的 homoglyph 繞過在 `memory_guard.py` 有混合文字偵測，但在 MCP 掃描器路徑是否套用 normalize 我**沒驗證**。
5. 規格狀態："**Status:** Draft · **Date:** 2025-07-28"（S4 檔頭），但同時寫 "All SDK implementations MUST conform"。

---

## 6. (d) OWASP Agentic「10/10」逐項核對

repo 自己的結論（S2）："**Official ASI coverage: 7/10 Full, 3/10 Partial, 0 Gaps.**"；README 徽章 `OWASP_Agentic_Top_10-7_Full,_3_Partial`。GitHub repo 描述、Microsoft 發表文用的是 "Covers 10/10" / "the first toolkit to address all 10 OWASP agentic AI risks"。——**「10/10」指有對應，不等於 10 項都達到 Full**。

核對方法：檔案存在 = `ls`/`wc`；功能 = 讀 docstring/片段；未讀的標明。

| ASI | OWASP 名稱 | repo 自評 | repo 證據路徑存在？ | 我的核對 | 判定 |
|---|---|---|---|---|---|
| ASI01 | Agent Goal Hijack | ✅ Full | `policy-engine/spec/SPECIFICATION.md`、`sdk/node/src/index.ts`、`reviewer.ts` rule `no-prompt-injection-guards`（第 209 行）存在 | 主要機制是 ACS 上游引擎的 `input` 介入點（引擎不在 repo）。repo 內的「語意分類」是 regex（S7）；embedding 訊號預設關閉且只供證據。LIMITATIONS §1 自承 "AGT does **not** detect indirect prompt injection that corrupts the agent's reasoning"。 | 有程式碼，但 Full 偏樂觀。 [推論] 較接近 Partial |
| ASI02 | Tool Misuse and Exploitation | ✅ Full | 存在 | `AgentControl.runTool`、tool catalog、MCP gateway allow/deny、rate limiter 都有程式碼。LIMITATIONS §1：不關聯「個別允許、合起來惡意」的動作序列。 | 有程式碼；序列攻擊是已知缺口 |
| ASI03 | Identity and Privilege Abuse | ✅ Full | `rbac.py`（96 行）、`handshake.py`（593 行）存在 | Ed25519 DID、委派 `parent_did`、信任天花板有程式碼。LIMITATIONS §8 自承不追蹤 agent 持有的憑證、不會在任務邊界撤銷。Socket 同樣批評（S13）。 | 身分有；憑證生命週期沒有。Full 偏樂觀 |
| ASI04 | Agentic Supply Chain Vulnerabilities | ⚠️ Partial | 存在 | 自承 "No SBOM generation or dependency vulnerability scanning is built into AGT"（但同文件後段說 AGT 自己的 release 有 `.github/workflows/sbom.yml`）。Marketplace 的 Ed25519 簽章是發表文主張，我未讀其程式碼。 | 與自評一致 |
| ASI05 | Unexpected Code Execution (RCE) | ✅ Full | `reviewer.ts` rule `unsafe-deserialization`（第 299 行）存在 | 文件的證據只有**靜態程式碼審查規則**（偵測 `pickle.loads`、`eval`），那是對開發者程式碼的 lint，不是執行期阻擋。真正的隔離在 `agent-sandbox`（5 個 provider，S8），但 S2 的 ASI05 段沒有引用它。README 自述：同行程邊界、建議另用容器。 | 證據與主張不對稱。 [推論] 不該標 Full |
| ASI06 | Memory and Context Poisoning | ⚠️ Partial | `memory_guard.py`（554 行）存在 | MemoryGuard 有注入、危險程式碼、Unicode/同形字偵測、SHA-256 完整性；自承 "opt-in"。**與發表文衝突**：S11/S16 說用 "Cross-Model Verification Kernel (CMVK) with majority voting"，repo 的 S2 改用 MemoryGuard；CMVK 模組在 `agent-os/modules/cmvk/` 存在但 S2 沒引用。 | 與自評一致；對外說法與文件不同 |
| ASI07 | Insecure Inter-Agent Communication | ✅ Full | **S2 引用的 `agent-os/src/agent_os/trust/gate.py` 不存在**。其他 trust gate 在 `agentmesh-integrations/a2a-protocol/a2a_agentmesh/trust_gate.py`、`haystack-agentmesh/.../trust_gate.py`、`langgraph-trust/.../gate.py`、`flowise-agentmesh/.../trust_gate_node.py` | 機制確實存在（DID 握手 + trust gate），但文件指向的檔案是壞連結。握手 TTL 重放為 Periculo V10，未驗證。 | 有程式碼；文件證據路徑有誤 |
| ASI08 | Cascading Failures | ✅ Full | `_circuit_breaker_impl.py`（255）、`rate_limiter.py`（123）存在 | 有實作；CHANGELOG 顯示 circuit breaker 近期修過 "HALF_OPEN forever after a cancelled probe"。 | 有程式碼 |
| ASI09 | Human-Agent Trust Exploitation | ⚠️ Partial | `escalation.py`（438）、`mcp_gateway.py` 存在；`docs/adr/0030-action-bound-approval-protocol.md` 未查 | 提供核准協定與後端，自承無通用 UI。這項本質上是人機介面問題，程式庫無法保證。 | 與自評一致 |
| ASI10 | Rogue Agents | ✅ Full | `behavior_monitor.py`（180，有 quarantine）、`kill_switch.py`（256）存在 | LIMITATIONS §13：Python kill switch 若沒註冊 callback，`terminated` 為 `False`；Go 版 "cooperative"，"Stops non-cooperating execution: No"。 | 有程式碼；kill switch 語意被官方自己限縮。Full 偏樂觀 |

### 小結

- 檔案層面：我檢查的 11 個證據路徑中 10 個存在，1 個不存在（ASI07 的 `trust/gate.py`）。
- 宣稱層面：repo 自稱 7 Full，其中至少 ASI01、ASI03、ASI05、ASI10 與 repo 自己的 LIMITATIONS 或證據內容有落差。[推論]（我的判斷，不是 repo 的）
- S2 開頭："This document is an internal self-assessment mapping, NOT a validated certification or third-party audit."；Socket："no third-party audits exist yet"（S13，2026-04）。我沒找到之後出現的第三方稽核。
- 我沒有執行 `agt verify`，所以沒驗證「OWASP 驗證 CLI」實際輸出什麼。

---

## 7. (e) Claude Code 整合

- 【實測】`agent-governance-claude-code/hooks/hooks.json` 宣告三個 hook，皆 `"type": "command"`、`"command": "node"`、`timeout: 30`：`SessionStart` → `session-start.mjs`、`UserPromptSubmit` → `user-prompt-submit.mjs`、`PreToolUse` → `pre-tool-use.mjs`。
- 【實測】`pre-tool-use.mjs`：任何例外時 `process.exit(2)`，stderr 訊息 "AGT governance denied the tool call because policy evaluation failed closed"。
- 【實測】`lib/policy.mjs` 建立 `McpSecurityScanner`（TypeScript SDK 版），註冊 backend `agt-mcp-scan`；命中時 reason 為 `MCP/tool scan flagged N threat(s) for <tool>`。CHANGELOG：deny 理由現在會帶出命中的文字（例如 `tool_poisoning (critical) matched "override"`）。
- 【自述】README（原文）："`PostToolUse` in Claude cannot reliably redact tool output after the tool has already executed, so this package does not claim Copilot-style output suppression parity."；"Hook execution is out-of-process."
- 【自述】另提供 MCP server 工具 `agt_policy_status`、`agt_policy_check_text`，以及 slash command `/agt-governance:agt-status`、`/agt-governance:agt-check`。
- 安裝（README）：
  - `/plugin marketplace add microsoft/agent-governance-toolkit` 然後 `/plugin install agt-governance@agent-governance-toolkit`
  - 或 `claude --plugin-dir ./agent-governance-claude-code`
- 【自述】「an experimental parity layer for the existing Copilot CLI governance work」同時寫 "production package surface"——同一份 README 兩種定位並存。
- Bash 規則 `recursive-delete` 為有界的 tokenizer，README 明列不處理：大括號/變數展開、`eval`/`sh -c`、`find`/`xargs` 間接刪除、遠端/容器執行。
- Copilot CLI：`npx @microsoft/agent-governance-copilot-cli install`（S1 安裝表）。Copilot 版的細節我沒讀。

---

## 8. (f) 第三方批評與限制

### 8.1 PolicyLayer「MCP-Blind」（讀全文）

文章 S12 的論點（原文引用）：

1. "The toolkit is comprehensive. It's also completely blind to MCP."
2. 機制：「The toolkit enforces policies by hooking into agent framework SDKs... the agent code must be instrumented with the toolkit's adapters... It doesn't work for MCP.」——以 Claude Desktop、Cursor、Windsurf 為例，說它們不會整合 Microsoft 的 SDK。
3. 列出缺的四項：transport-layer interception、tool visibility control（`tools/list` 隱藏工具）、protocol-native rate limiting、跨 session 的狀態計數器。
4. "semantic classification is probabilistic."——主張 deterministic 規則更可靠。
5. 結尾推銷 PolicyLayer（"Get early access"）。作者是競品廠商，利益相關。

**對照 repo（反證）：**

- 文章說 "completely blind to MCP"，但 repo 有 `mcp_gateway.py`（598 行）、`mcp_security.py`（1049 行）、`mcp_session_auth.py`、`mcp_sliding_rate_limiter.py`、`mcp_response_scanner.py`、`mcp_message_signer.py`、`mcp_cve_feed.py`、`mcp_auth_enforcement.py`，以及 1970 行的 `MCP-SECURITY-GATEWAY-1.0.md`，另有 `agent-mcp-governance/` 目錄與 .NET `Extensions.ModelContextProtocol`。所以「完全看不到 MCP」**與 repo 不符**。S13/S16/S11 同時報導了 MCP gateway。
- 但 PolicyLayer 的核心論點有一部分成立：AGT 的 MCP 閘道是**函式庫**（`MCPGateway` 要由應用程式呼叫，.NET 版是 MCP server 的 `WithGovernance`），不是獨立 proxy。我沒找到「獨立的 stdio/HTTP MCP proxy」可套在任意 MCP client 與 server 之間的證據 [推論，可能是我沒讀到]。對 Claude Code 的做法是用 hook 看 `PreToolUse`，這是**用戶端側**，不是 transport proxy。
- 該文把 repo 連到 `github.com/Azure-Samples/agent-governance`，不是 `microsoft/agent-governance-toolkit`。[注意] 文章 4/13 發表，可能當時有別的倉庫；我沒查。
- 該文說 "Ring 0 (trust score ≥900)"、"Ring 3 (<400)"。repo 的 ring 是用 `RING_1_TRUST_THRESHOLD`、`RING_2_TRUST_THRESHOLD` 與 consensus 決定（`models.py:46-69`），我沒有看到 900/400 的對應常數，**此數字未能在 repo 驗證**。

### 8.2 其他第三方

| 來源 | 批評/限制 | 原文 | 備註 |
|---|---|---|---|
| Socket S13 | 語意分類器沒有獨立驗證 | "Microsoft hasn't published independent validation of how the classifier performs against real attack scenarios, and no third-party audits exist yet." | 2026-04-07 |
| Socket S13 | 憑證層 | "It is not clear from the current documentation how tightly permissions are scoped to individual tasks or how consistently they are revoked after execution." | repo 後來在 LIMITATIONS §8 承認 |
| Socket S13 | 利益衝突/治理 | "Microsoft has significant commercial stakes... The announcement says the project will move to a foundation, but Microsoft will be steering that process." | repo `docs/CHARTER.md` 稱 "LF Projects format"；我沒查它是否已加入基金會 |
| InfoWorld S14 | 要搭配傳統過濾 | "in practice it's a good idea to run a capability tool like Agent Governance Toolkit alongside traditional filters to trap user errors and prompt-based attacks." | 偏正面報導；"more than 13,000 tests" |
| ChatForest S16 | 未知項 | "No public case studies of production deployments exist."（4/6，發表五天後） | 站方自述不實測、由 AI 撰寫；其 OWASP 對照表直接抄 S11 |
| Periculo S17 | 15 個繞過向量 | 見下表 | 單人自述；文中沒附 PoC 或 commit；內文日期 "September 18, 2026"，但頁面 metadata 為 2026-04-14，兩者不一致 |
| Mojar AI（經 repo LIMITATIONS §7 引述） | 知識治理缺口 | repo 引述 https://www.mojar.ai/blog/industry-news/microsoft-agent-governance-toolkit-missing-knowledge-layer | 我沒直接讀該文；只讀 repo 的轉述 |
| Dai et al.（經 LIMITATIONS §1 引述） | 跨 session 攻擊 | https://arxiv.org/abs/2605.06158 | 我沒讀該 preprint；只讀 repo 的轉述 |

### 8.3 Periculo 15 項與 repo 的交叉

| 向量 | Periculo 說法 | repo 側核對 |
|---|---|---|
| V1 import-only 假「Governed」 | 沒設政策也顯示 governed | LIMITATIONS §9 自承：沒載入政策時預設 `allow`；dashboard 顯示 "governed" 但沒規則 → **repo 印證**（並註明出處為 Periculo） |
| V2 fail-open | policy engine 不可達時預設放行 | LIMITATIONS §9 與 `mcp_gateway.py`、`pre-tool-use.mjs` 都寫 fail closed。我沒找到 `agent-sre` 內 fail-open 的程式碼（grep 無結果）→ **未印證，與 repo 文件相反** |
| V3 VSCode 偽隨機分數 | 早期預覽版 | 未驗證 |
| V4 CMVK 外洩 PII | 把 context 送「更強」LLM | CMVK 模組存在於 `agent-os/modules/cmvk/`；我沒讀內容 → **未驗證** |
| V5 同形字繞過 regex | | HEAD 附近有 "prevent invisible-character evasion" 修補，`normalize.py` 有同形字折疊；MCP 掃描器是否經過 normalize 未驗證 → **部分印證（方向正確，修補中）** |
| V6 記憶體內稽核鏈 | | file sink 存在；預設值未查 → **未驗證** |
| V7 SupplyChainGuard 硬編碼清單 | | `supply_chain.py` 存在；CHANGELOG 有 typosquat 修補，表示邏輯仍在動 → **部分印證**，清單來源未讀 |
| V8–V15 | DID registry 單點、.NET 對稱金鑰、握手重放、bytecode hash、reward hacking、metrics 未驗證、loopback、batch/runtime 分裂 | 皆**未驗證** |

⚪ 說明：V3、V4、V6、V8–V15 無法僅憑 Periculo 單方文章認定為真；我沒有時間逐項重現。

### 8.4 官方自承的限制（一手，LIMITATIONS.md）

動作治理而非推理治理（§1）、稽核只記錄嘗試（§2）、延遲數字只含政策引擎（§3）、未載入政策即放行（§9）、無物理 AI 安全（§10）、不管串流資料（§11）、DID 方法不一致（§12）、kill switch 語意跨 SDK 不同（§13）。README 同時說明程序邊界：同行程、建議容器隔離。

---

## 9. (g) 成熟度

| 項目 | 事實 | 來源/讀取 |
|---|---|---|
| 狀態 | "**Public Preview** -- production-quality public preview releases. May have breaking changes before GA." | S1、CHANGELOG 檔頭 |
| PyPI 分類 | `Development Status :: 4 - Beta` | S21 |
| repo 版本 | `VERSION` = `5.0.0`；CHANGELOG `[5.0.0] - 2026-06-25` | 本機 |
| PyPI 最新 | `agent-governance-toolkit` **4.1.0**（2026-06-11 上傳）；共 16 個版本，最早 2.1.0（2026-03-15） | S21 |
| 版本衝突 | repo 5.0.0 與 PyPI 主套件 4.1.0 不一致。CHANGELOG 稱 5.0.0 "Bumped all first-party Python, TypeScript, .NET, and Rust packages"，且 "lockfiles regenerate at publish time"。[推論] 5.0.0 尚未發佈到主套件（或在別的發行名下）。我沒查 npm/NuGet 實際版本 | 本機 + S21 |
| 建立 | repo `created_at` 2026-03-02；發表文 2026-04-02 | S22、S11 |
| 規模 | 6,454 stars、1,104 forks、108 open issues（2026-10-21 資料） | S22 |
| 更新頻率 | 淺 clone 內 200 筆 commit 跨 2026-09-23 至 2026-10-22；2026-10 當月 138 筆；10-20 單日 26 筆；最新 commit 就是調查當天 | 本機 `git log` |
| 提交者 | 200 筆中 dependabot 90、Shivam Sharma 31、Ricky Gummadi 14、Naveen Chatlapalli 9、MohammadHaroonAbuomar 8 | 本機 |
| 維護者 | 專案負責人 Mohammad Abuomar（Microsoft，2026-06 起）；核心維護者 Liam Crumm、Prayag Upadhyay；維護者 Ricky Gummadi（均標 Microsoft）。發表文作者 Imran Siddique 仍出現在 ADOPTERS 聯絡人，但不在 MAINTAINERS 前 40 行 | 本機 MAINTAINERS.md、S11 |
| 授權 | MIT | S1、S22 |
| 官方支援 | 沒有 SLA、沒有 Microsoft 產品支援聲明。`SUPPORT.md` 存在但我沒讀。 | ⚪ 未讀 `SUPPORT.md`：這項標 partial |
| 採用 | ADOPTERS 的 Production 欄：Microsoft 內部兩項、Dayos、CogNEXUS Labs；其餘是 Evaluation。皆為自願 PR 登記，無獨立驗證 | 本機 partial |
| 基金會 | 發表文：「aspiration is to move it into a foundation home」。repo 有 `CHARTER.md`（LF Projects format）。是否已正式加入基金會：未查到 ⚪ | S11、S1 |
| 測試數字不一致 | 發表文 9,500+（S11）；InfoWorld 13,000+（S14）；README 992 個規格一致性測試；agent-os README "4,310+ tests across 17 modules" | 自述數字彼此不同，**我沒有重跑** |
| Breaking changes | 有 `BREAKING_CHANGES.md`；README：舊 `agent_os.policies` 規則模型「is gone」，v4 → v5 需用 `agt-policies` 遷移 | S1 |

---

## 10. (h) OWASP Top 10 for Agentic Applications 2026（完整清單）

來源：OWASP GenAI Security Project，2025-12-09 發布（資源頁日期 "December 9, 2025"，PDF 檔頭 "Version 2026 December 2025"），授權 CC BY-SA 4.0。名稱取自官方 PDF 的 "Agentic Top 10 At A Glance" 頁與目錄（S20）與官方宣告文（S18）。

| ID | 正式名稱 | 官方定義/重點（原文） | 取得程度 |
|---|---|---|---|
| ASI01 | Agent Goal Hijack | "attackers can manipulate an agent's objectives, task selection, or decision pathways through a variety of techniques - including... prompt-based manipulation, deceptive tool outputs, malicious artefacts, forged agent-to-agent messages, or poisoned external data." | PDF 描述段 read |
| ASI02 | Tool Misuse and Exploitation | 描述段未取得。宣告文："Agents bent legitimate tools into destructive outputs (ASI02 – Tool Misuse, e.g Amazon Q)" | 名稱 read；定義僅宣告文一句 |
| ASI03 | Identity and Privilege Abuse | 描述段未取得。搜尋摘要（SlideShare 頁，PDF 第 15 頁）："exploits dynamic trust and delegation in agents to escalate access and bypass controls by manipulating delegation chains, role inheritance, control flows, and agent context" | snippet |
| ASI04 | Agentic Supply Chain Vulnerabilities | 描述段未取得。宣告文："Dynamic MCP and A2A ecosystems revealed how easily runtime components could be poisoned (ASI04... e.g. GitHub MCP exploit)" | 名稱 read；定義僅宣告文一句 |
| ASI05 | Unexpected Code Execution (RCE) | 描述段未取得。宣告文："natural-language execution paths unlocked dangerous new avenues for remote code execution (ASI05..., e.g AutoGPT RCE)" | 名稱 read；定義僅宣告文一句 |
| ASI06 | Memory & Context Poisoning | "adversaries corrupt or seed this context with malicious or misleading data, causing future reasoning, planning, or tool use to become biased, unsafe, or aid exfiltration." | PDF 描述段 read |
| ASI07 | Insecure Inter-Agent Communication | 描述段未取得。宣告文："Spoofed inter-agent messages misdirected entire clusters" | 名稱 read；定義僅宣告文一句 |
| ASI08 | Cascading Failures | "a single fault (hallucination, malicious input, corrupted tool, or poisoned memory) propagates across autonomous agents, compounding into system-wide harm." | PDF 描述段 read |
| ASI09 | Human-Agent Trust Exploitation | 描述段未取得。宣告文："Confident, polished explanations misled human operators into approving harmful actions" | 名稱 read；定義僅宣告文一句 |
| ASI10 | Rogue Agents | "malicious or compromised AI Agents that deviate from their intended function or authorized scope, acting harmfully, deceptively, or parasitically within multi-agent or human-agent ecosystems." | PDF 描述段 read |

名稱用字注意：宣告文與目錄的完整名稱是 "Tool Misuse and Exploitation"、"Identity and Privilege Abuse"（宣告文內文縮寫為 "Tool Misuse"、"Identity & Privilege Abuse"）；ASI08 在 PDF 目錄與描述標題是 "Cascading Failures"，但 AGT 的 S2 與 Microsoft 發表文用 "Cascading Agent Failures" / "Cascading failures"（S2 表格標題為 "Cascading Agent Failures"），兩者措辭不同。

⚪ ASI02–05、07、09 的完整描述段：官方 PDF 與資源頁直連被 403 擋（Groundlane 兩次、Exa 一次、jina 401），SlideShare 鏡像在 100,000 字元處被截斷，該段落落在截斷範圍之外。已試：Groundlane `web_fetch`（resource 頁、PDF 直連、宣告文）、jina `read_url`、Exa `web_fetch_exa`（資源頁、SlideShare）、firecrawl_scrape（額度用盡）。要補需另開 chunk 再取 SlideShare 後半，或使用者在可通網路下載 PDF；本次未做。

---

## 11. 衝突清單

| # | 衝突 | A 說 | B 說 | 我的判定 |
|---|---|---|---|---|
| C1 | 套件數 | Microsoft/Socket/ChatForest：7 | PolicyLayer：9；repo README 表：9；PyPI：5 | 時間不同（見 §3）。以 repo HEAD 為準：9 個元件、5 個 PyPI 發行物 |
| C2 | OWASP 覆蓋 | repo 描述、發表文、ChatForest：10/10 | repo S2/徽章：7 Full + 3 Partial | repo 自己的精確版較準；「10/10」是有對應不是全滿 |
| C3 | MCP 支援 | PolicyLayer：completely blind to MCP | repo、Socket、ChatForest、Microsoft：有 MCP Security Gateway | PolicyLayer 說法不符；但「函式庫而非獨立 proxy」的子論點部分成立 |
| C4 | 語意分類器 | 發表文：Semantic intent classifier（goal hijack 對策）；PolicyLayer：semantic classification is probabilistic | repo `semantic_policy.py`：heuristic classifier (no ML dependency) | 實作是 regex 啟發式，不是機率模型；PolicyLayer 的「機率性」批評對它不適用，Socket 的「沒有獨立驗證」仍適用 |
| C5 | 記憶投毒對策 | 發表文/ChatForest：CMVK 多數決 | repo S2：MemoryGuard | repo 文件已改為 MemoryGuard；CMVK 在模組內但 S2 未引用 |
| C6 | 版本 | repo VERSION/CHANGELOG：5.0.0（2026-06-25） | PyPI：4.1.0（2026-06-11） | 未結案；[推論] 主套件尚未發佈 5.0.0 |
| C7 | 測試數 | 9,500+、13,000+、4,310+、992 | — | 各自範圍不同，未重跑 |
| C8 | 失敗行為 | Periculo：fail-open | repo：fail closed（gateway、hook、LIMITATIONS） | 以 repo 程式碼為準，但「未載入政策 → allow」是真的（官方自承） |
| C9 | Claude Code 外掛定位 | README："production package surface" | 同份 README："an experimental parity layer" | 同文件內矛盾，視為預覽品質 |
| C10 | Periculo 日期 | 頁面 metadata：2026-04-14 | 內文："September 18, 2026" | 未解 |
| C11 | OWASP ASI08 名稱 | PDF：Cascading Failures | repo S2：Cascading Agent Failures | 以 OWASP 官方為準 |
| C12 | ASI07 證據檔 | S2：`agent_os/trust/gate.py` | 檔案不存在 | 文件指向有誤；機制在 integrations 目錄 |

---

## 12. 限制與反證（我自己的）

1. 沒有執行任何 AGT 程式碼（無 `pip install`、無 `agt verify`、無對惡意工具描述的實測）。偵測行為是讀 regex 與函式推得，不是跑出來的。
2. ACS 決策引擎（上游 `responsibleai/agent-control-spec`）沒讀；政策引擎的核心行為結論只依 repo 內的 README/規格/shim。
3. MCP 規格 §7 之後（簽章、session、rate limit、CVE feed、trust-gated MCP、drift 嚴重度分級、failure semantics）沒讀。
4. 沒讀 `agent-mcp-governance/`、`agent-rag-governance/`、`agent-sandbox` 的原始碼，只讀 README。
5. 淺 clone 只涵蓋 2026-09-23 之後，所以「更新頻率」只對最近一個月有把握；沒查整年的 release 節奏。
6. 4.4 的稽核預設儲存、4.1 的 ring 門檻（900/400）、Periculo 多數向量，均未驗證。
7. 第三方報導的測試數、延遲數（<0.1ms p99）皆沿用 Microsoft 自述，彼此一致不代表正確；我只在 repo 找到 `docs/LIMITATIONS.md` §3 對延遲的範圍限縮。
8. 這是 2026-10-22 當日 HEAD；repo 一天內有多筆 commit，內容會變。
9. 沒讀 `SUPPORT.md`，所以「是否為正式產品支援」只能回答：文件稱 Public Preview、無 SLA 聲明，其餘為 ⚪。

## 13. ✅ / ⚪ / ✉️ 結案狀態

| 項目 | 狀態 |
|---|---|
| (a) 套件數 | ✅ 已關閉（三個數字都有出處與時間；7↔9 的轉折日期 ⚪ 淺 clone 無法追） |
| (b) 五機制 | ✅ 已關閉（細節為 partial，見 §1） |
| (c) 啟發式 vs LLM | ✅ 已關閉（掃描器：啟發式；ACS 另有選配 `llm` annotator） |
| (d) OWASP 對照 | ✅ 已關閉（檔案存在性已核；行為未執行） |
| (e) Claude Code | ✅ 已關閉 |
| (f) 批評 | ✅ PolicyLayer、Socket、InfoWorld、ChatForest、Periculo 已讀全文；⚪ Mojar、Dai et al. 只讀 repo 轉述 |
| (g) 成熟度 | ✅ 版本/頻率/維護者；⚪ 基金會與 SUPPORT.md 未查到 |
| (h) OWASP 清單 | ✅ 10 項名稱；⚪ ASI02–05、07、09 完整定義見 §10 說明 |
