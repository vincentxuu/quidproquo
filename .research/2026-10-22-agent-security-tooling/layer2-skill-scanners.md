# 第2層：安裝前 skill / MCP 掃描器研究（NVIDIA SkillSpector／Cisco skill-scanner／AgentSeal）

調查日：2026-10-22。方法：三個 repo 以 `git clone --depth 1`（唯讀，經 add_repo 回報 read_available）後讀原始碼；**未安裝、未執行任何掃描器，也未對外部目標掃描**。GitHub 後設資料用 github MCP `search_repositories`（真 API 回傳）。網頁用 Groundlane web_fetch / web_search。

標記說明：【自述】= 作者/廠商自己的文件或程式碼；【第三方】= 獨立報導或研究；【推論】= 我的推測。
讀取程度：read（全文）/ partial（讀一部分，註明）/ snippet / blocked。

---

## 0. 先講結論

1. **NVIDIA/SkillSpector 是官方 NVIDIA 組織的 repo，歸屬屬實。** 星數 20,823 是真的（API 回傳），但「20.8k 對一個 2026-03 建立、約 2026-05 才公開宣傳的專案是否合理」只能做到「不能排除，也無法證實」，見 §1。
2. 三者其實不是同類：SkillSpector 與 Cisco 是「靜態規則＋可選 LLM」的 skill 掃描器；AgentSeal 是「本機 config／MCP 掃描＋system prompt 紅隊測試」工具包，而且 `scan-mcp` 會**啟動**目標 MCP server（執行目標程式碼）。
3. 第三方（Trail of Bits、Adversa）都實測繞過了 Cisco 與 NVIDIA；Cisco 自己的文件也承認規則單獨只抓到 7.7% 惡意樣本。**沒有任何中立的三者同台評測**。Cisco 的對比數據是 Cisco 作者自己跑的。
4. AgentSeal 沒有找到任何第三方評測，規則數也很少（見 §3）。維護上最後一次 push 是 2026-06-11（距今約 4.4 個月），授權是 FSL-1.1-Apache-2.0（非 OSI 開源）。

---

## 1. NVIDIA/SkillSpector 歸屬與星數核對

| 項目 | 結果 | 來源（讀取程度） |
|---|---|---|
| 擁有者 | `NVIDIA`，type = `Organization`，id 1728152（舊的低編號組織） | GitHub API 回傳，github MCP `search_repositories repo:NVIDIA/SkillSpector`（read，結構化 JSON） |
| 星／fork／issue | stars 20,823；forks 1,825；open issues 169；license Apache-2.0；created 2026-03-21T00:28:43Z；pushed 2026-10-21T08:58:21Z | 同上 |
| NVIDIA 官方承認 | NVIDIA Technical Blog（2026-05-19）寫「Verified means cataloged, scanned, signed, and documented with a skill card」；SkillSpector 為其發佈流程中的 scan 步驟 | https://developer.nvidia.com/blog/nvidia-verified-agent-skills-provide-capability-governance-for-ai-agents/ （partial，讀前 5000 字） |
| 官方文件 | docs.nvidia.com 有專頁：「SkillSpector is also the security tier inside SkillEvaluator」 | https://docs.nvidia.com/skills/scanning-agent-skills （read 全文） |
| 程式碼歸屬 | 檔頭 `SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES`；`SECURITY.md` 指向 psirt@nvidia.com | repo 原始碼 `src/skillspector/nodes/analyzers/mcp_rug_pull.py`、`SECURITY.md`（read） |
| 星數第二來源 | star-history 頁面標題「NVIDIA/SkillSpector - 20.8k Stars · Global Rank #2184…104 contributors, This week: +625 stars, 27 pushes」 | https://www.star-history.com/nvidia/skillspector/ （snippet：只有 title/description，未取得時間序列） |

**合理性分析**
- 【自述】README 稱此工具是「NVIDIA Verified Skills pipeline」的一部分，這是官方背書的產品線，不是掛名 fork。
- 同組織旗艦目錄 `NVIDIA/skills`（建立 2026-02-25）只有 3,683 star（github MCP 回傳）。SkillSpector 星數是它的 5.6 倍。【推論】工具型 repo 因被轉貼、被 agent 生態大量引用而星數高於內容 repo，並不罕見，但這個差距仍屬偏高。
- 第三方快照互相不一致：explainx 文章稱「v2.0.0 with 5.5k GitHub stars」（搜尋結果時間標「3 weeks ago」，文章原日期未確認）；skillsllm 頁面標 20.4k（搜尋標註 2026-08-05）；vibecodes 標 20k 且「+640 this week」；star-history 標 20.8k 且「+625 this week」。若每週真的約 +600，則 2026-08-05 的 20.4k 到今天的 20.8k 就對不上。【推論】這些爬蟲頁的更新時間不可靠；我**沒有取得可信的星數時間序列**，因此「增長曲線是否自然」無法判定，不能排除或證實刷星。
- 活躍度支持是真實專案：淺 clone 往回抓得 1,630 筆 commit，其中 576 筆是 `github-actions[bot]`；人類作者 Narendran Raghavan 250、yashrajbasav 149 等；star-history 稱 104 contributors。release tag 最新到 v2.13.0。
- 狀態：**歸屬 ✅ 已確認；星數數值 ✅ 已確認（20,823，GitHub API）；星數成長是否異常 ⚪ 確認無公開資料**（試過：github MCP 無 stargazers 時間戳端點；`gh api repos/NVIDIA/SkillSpector` 回 403 未授權；star-history 頁僅回 title；curl 被 proxy 403）。要查需用 GitHub stargazers API 帶時間戳，或請人用 star-history 圖 ✉️。

---

## 2. (a) 偵測引擎怎麼運作

### 2.1 NVIDIA SkillSpector（Python，LangGraph 工作流）
- **兩階段**：【自述】「Stage 1: Static Analysis — Fast regex-based pattern matching across 11 static analyzers」＋AST＋OSV.dev 查詢；「Stage 2: LLM Semantic Analysis (Optional)」。（README `## How It Works`，read）
- **LLM 只能加分不能減分**：「Every deterministic finding stays in the report whether the model confirms it, disputes it, or does not address it」。未獲確認的標 `llm-unconfirmed`。（README，read）
- **有三個 LLM 發現型 analyzer**（不只是過濾）：`semantic_security_discovery.py`、`semantic_developer_intent.py`、`semantic_quality_policy.py`，加 `meta_analyzer.py` 過濾。【第三方】Towards Data Science 作者描述「three separate LLM analyzers… They discover」。（TDS 文章 partial：讀前 9000 字）
- **是否執行目標程式碼：否**。【自述】「It never executes the scanned skill. All analysis is static (regex, Python AST, YARA) plus optional LLM evaluation of file contents」。（README `## Trust model and data egress`，read）
- **資料外送**：LLM 預設啟用（預設 provider 設定存在），會把檔案內容送到所設 provider；`--no-llm` 才留在本機；SC4 一律送依賴名稱與版本給 api.osv.dev。（同上，read）
- 規則實作：`src/skillspector/nodes/analyzers/` 內 36 個 .py 檔，合計約 39.7k 行；YARA 規則檔在 `src/skillspector/yara_rules/`（`agent_skills.yar` 5 條、`cryptominers.yar` 4、`hacktools.yar` 5、`webshells.yar` 6，另有 base64 封裝的 `malware.yar.b64`）。（Bash 計數，read 目錄＋grep）
- 範例規則（`static_patterns_prompt_injection.py`）：`(r"ignore\s+(?:all\s+)?previous\s+instructions?", 0.8)`、`(r"you\s+are\s+now\s+(?:in\s+)?(?:jailbreak|unrestricted|unfiltered)\s+mode", 0.95)`；Unicode：`_BIDI_CONTROL_PATTERN = r"[‪-‮⁦-⁩]"`。（read 該檔 66–115 行）
- LLM 防注入：「The LLM prompt includes anti-jailbreak protections」（README，read）。

### 2.2 Cisco skill-scanner（Python；另有 Go CEL helper）
- 【自述】「combines pattern-based detection (YAML + YARA-X), AST and dataflow analysis, an optional LLM-as-a-judge, and a bounded CEL decision layer」。（README 開頭，read 前約 400 行）
- 分析器表（README `Security Analyzers`）：Static（YAML+YARA）、Bytecode（.pyc 完整性）、Pipeline（shell 管線 taint）、Correlation、Behavioral（Python AST dataflow）、LLM、Meta（預設關）、VirusTotal、AI Defense（雲端）。
- **是否執行目標程式碼：未找到明文聲明**。Behavioral analyzer 文件寫「uses static code analysis with AST parsing and dataflow tracking」（`docs/architecture/analyzers/behavioral-analyzer.md`，partial 前 20 行），未見 sandbox 執行。【推論】屬純靜態＋遠端服務，但官方沒有寫「never executes」這句，我不把它當作承諾。
- **規則檔**：`skill_scanner/data/packs/core/`：`signatures/*.yaml`（9 個檔，約 46 條簽章 id）、`yara/*.yara`（16 檔，約 31 條 rule）、`python/*_checks.py`（17 個檢查模組）、`pack.yaml` 內登錄約 167 條規則（grep 計數）。可選 `atr` 包（「712 signatures across 10 signature files」，來自第三方 Agent Threat Rules 專案、MIT）與 `promptguard` 包。（Bash 計數＋README of atr，partial）
- 範例規則：`PROMPT_INJECTION_IGNORE_INSTRUCTIONS` → `"(?i)ignore\\s+(all\\s+)?(previous|prior|earlier)\\s+(instructions|rules|prompts|guidelines)"`；`ASCII_SMUGGLING_TAG_BLOCK`（Unicode Tag Block U+E0000–E007F）。（`data/packs/core/signatures/prompt_injection.yaml`、`core/python/ascii_smuggling_checks.py`，partial 前 30–40 行）
- **LLM 在實務上是主力**：【自述】「Every recommended setup runs the LLM judge (`--use-llm`): rules alone catch only about 8% of held-out malicious skills.」（README，read）
- 已知設計缺陷（自述）：LLM 因 context 預算讀不到的 skill 只回 INFO，「INFO does not gate. So a skill can evade the semantic stage simply by being large enough」（`docs/reference/measured-results.md`，read 前約 330 行）。

### 2.3 AgentSeal（Python＋TypeScript 雙實作）
- 【自述】`guard` 六階段：Pattern signatures → Deobfuscation（Unicode tags、Base64、BiDi、zero-width、TR39 confusables）→ Semantic（MiniLM-L6-v2 embedding）→ Baseline（SHA-256，稱 rug-pull detection）→ Registry 查詢 → Custom rules。（README `## Guard`，read）
- 注意【自述】README 寫 guard「No API key, no network calls - everything runs locally」，但同一份 README 也列 Registry enrichment（live trust scores from agentseal.org）。**兩者在同一頁自相矛盾**，我未實測哪個為準。
- **執行目標程式碼：`scan-mcp` 會**。README：「Connects to a live MCP server over stdio or SSE」；`mcp_runtime.py` 寫「Spawns the server as a subprocess, performs the MCP handshake」（read 該檔 610–615 行附近）。它有清理環境變數的 `_safe_env`（`mcp_runtime.py:327`），但這仍是**執行未信任的 server**，與「安裝前不執行」的原則衝突。`guard` 與 skill 檔掃描不執行。
- `scan`（prompt 紅隊）是另一件事：225 個 probe，以 canary 字串判斷洩漏，無 LLM judge（README `## Scan`），但需要把 system prompt 送給被測模型。
- Skill 規則：`detection/skill_detector.py` 內 SKILL-001…009（Credential access、Data exfiltration、Remote payload execution、Reverse shell / backdoor、Code obfuscation、Prompt injection、Suspicious URLs、Hardcoded secrets、System modification）＋ SKILL-011（Invisible characters）；`mcp_checker.py` 有 MCP-001…012。（Bash grep，read 關鍵段落）

---

## 3. (b) 偵測類別與規則數

| 類別 | NVIDIA SkillSpector | Cisco skill-scanner | AgentSeal |
|---|---|---|---|
| 規則數（自述） | README 寫「71 vulnerability patterns across 17 categories」；官方文件頁寫 68；Help Net Security／CSA／explainx 寫 64（16 類） | README 未給總數；core pack.yaml 約 167 條登錄規則；taxonomy 130 個 AISubtech 代碼；可選 ATR 包 712 簽章 | README 稱「225+ tests」（那是 prompt 紅隊 probe，不是掃描規則）；skill 規則只有 10 條類別 |
| 規則數（我數的） | 原始碼中 `rule_id="…"` 去重得 67 個（Bash grep），介於 64–71 之間；**同一產品三個數字 64／68／71 版本不同步** | 簽章 yaml 約 46、YARA 約 31、python 檢查 17 模組 | SKILL-0xx 10 條、MCP-0xx 12 條、blocklist／embedding 另計 |
| Prompt injection | P1 Instruction Override、P2 Hidden Instructions、P9 Whitespace Padding 等；AR1–3 anti-refusal | `PROMPT_INJECTION_*` 簽章、`prompt_injection_generic.yara`、`indirect_prompt_injection_generic.yara`、`jailbreak_generic.yara` | SKILL-006；MCP 工具描述的 `<IMPORTANT>` 等標籤與 `ignore previous`（`mcp_tool_analyzer.py:54–107`） |
| Tool poisoning | TP1 Hidden Instructions、TP2 Unicode Deception、TP3 Parameter Description Injection、TP4 Description-Behavior Mismatch（LLM） | **靜態層幾乎沒有**：【自述】「The static layer has no MCP-specific analyzer and catches less than half」，25 組配對資料集 recall 40%；LLM 判斷 100% | `scan-mcp` 連線讀取工具描述做 pattern＋embedding＋可選 LLM |
| Exfiltration | E1–E5、TT1–TT5 taint、YARA webhook（discord/telegram/webhook.site） | `data_exfiltration.yaml`（9 條）、`credential_harvesting_generic.yara`、`undeclared_destination_checks.py` | SKILL-001/002、toxic_flows.py（跨 server 的毒性資料流組合） |
| 供應鏈 | SC1–SC10（typosquatting、unpinned、OSV 即時查詢、bytecode、source redirection） | `supply_chain.yaml`、`registry_redirect_checks.py`、`--use-osv` 選項、VirusTotal | MCP-007（unpinned npx/uvx/pip/docker 等）＋寫死的 CVE 檢查（CVE-2025-53110 等） |
| **Rug-pull** | RP1（未鎖版本的 MCP/外部參照）、RP2（manifest 權限預埋）、RP3（manifest 變動）— **有專門 analyzer** `mcp_rug_pull.py`，標 ASI16。（注意：RP 規則 id 在 README 表格未列出） | 無專門 analyzer；僅 taxonomy 有 `AISubtech-9.3.3 Dependency Replacement / Rug Pull` 定義；grep 實作只在 ATR 包與 taxonomy | `baselines.py`：對 MCP 設定做 SHA-256 指紋（Level 1 config hash、Level 2 binary hash；Level 3 tool signature 標「deferred」），因此只抓「本機設定檔變動」，抓不到遠端 server 悄悄改工具描述；「rug-pull 探針 +45」要 Pro 才有（README） |
| 隱藏 Unicode | P2、TP1/TP2（zero-width、bidi、homoglyph）；`unicode_confusables.py`；P9 whitespace | `ASCII_SMUGGLING_TAG_BLOCK`、`prompt_injection_unicode_steganography.yara` | `deobfuscate.py`：zero-width、Tag chars、variation selectors、BiDi、TR39；SKILL-011 |
| 其他 | Excessive agency、memory poisoning、output handling、system prompt leakage、trigger abuse、rogue agent、YARA 惡意程式、MCP least privilege（LP1–LP4） | 資源濫用、社交工程、硬編碼密鑰、harmful content、命令注入、trigger 特異性 | 硬編碼密鑰、context oversharing、shell 作為 server、未簽章 binary |

---

## 4. (c) 對照 OWASP

| | 做法 | 覆蓋與缺口 |
|---|---|---|
| SkillSpector | 在各 analyzer 檔頭 docstring 與 `_TAGS` 標 framework：`static_patterns_output_handling.py`「Framework: LLM05」、`excessive_agency`「LLM06, ASI02」、`system_prompt_leakage`「LLM07」、`memory_poisoning`「ASI06, AML.T0080」、`mcp_least_privilege`/`tool_poisoning`「ASI02」、`mcp_rug_pull`「ASI16」。 | 【自述】只有部分 analyzer 有標，**沒有一份對照 OWASP Agentic Top 10 的完整覆蓋表**。ASI16 這個編號在我所知的 OWASP Agentic Top 10（ASI01–ASI10）之外，【推論】可能是 NVIDIA 內部自編或更新版本的編號，我沒有讀到對應的一手 OWASP 文件，所以不能確認；不宣稱它是 OWASP 官方編號。 |
| Cisco | `skill_scanner/data/taxonomy/cisco_ai_taxonomy.json` 把 130 個 AISubtech 代碼各自映射到「OWASP: LLM01:2026…」與「OWASP: ASI01…ASI10」。出現次數：LLM01 Prompt Injection 52、LLM02 Sensitive Info Disclosure 47、ASI04 Agentic Supply Chain 19、ASI07 15、ASI06 15、ASI01 15、ASI02 14、ASI05 13、ASI10 11、ASI03 10、ASI08 9、ASI09 7。 | ASI01–ASI10 十項在 taxonomy 都有被映射到（grep 計數）。**這是分類標籤，不是各項實際偵測能力**；例如 ASI09 Human-Agent Trust Exploitation 的映射只代表某些規則被這樣歸類。另外 taxonomy 中 LLM 編號與名稱的對應（例如「LLM03:2026: Excessive Agency」「LLM05:2026: Data and Model Poisoning」）與我所知的 OWASP LLM Top 10 2025 編號（LLM06 Excessive Agency、LLM04 Data and Model Poisoning）不一致。【推論】這可能是 Cisco 自訂的 2026 編號，或我記憶中的版本過時；未讀到 OWASP 2026 一手文件，故不判定對錯，只註明需要查證。 |
| AgentSeal | README 與 PROBES.md 未見 OWASP 對照；程式碼只在 `mcp_checker.py` 註解寫「OWASP MCP Top 10 checks」「(OWASP MCP10)」。 | 不能宣稱有 OWASP Agentic／LLM Top 10 覆蓋。 |

OWASP 官方 Top 10 文件本身我**沒有讀**（本題以三個 repo 的自述為對象）。所有「覆蓋」字句只能算自述，不是官方認證。

---

## 5. (d) 輸出格式與 CI 整合

| | 輸出 | CI／整合 |
|---|---|---|
| SkillSpector | terminal、JSON、Markdown、SARIF 2.1.0；風險分數 0–100（CRITICAL +50、HIGH +25、MEDIUM +10、LOW +5，可執行腳本 ×1.3；>50 即 DO_NOT_INSTALL） | exit code：0（score ≤50）／1（score>50 或 `--fail-on-findings`／`--fail-on-incomplete`／`--min-coverage`）／2（錯誤）；baseline 抑制檔 `.skillspector-baseline.yaml`；Docker；MCP server 模式；Pi 與 OpenCode extension；批次 `contrib/batch_scan` |
| Cisco | summary、json、markdown、table、sarif、html | 官方可重用 GitHub Actions workflow（`.github/workflows/scan-skills.yml@2.3.0`）＋SARIF 到 Code Scanning；pre-commit hook；`--fail-on-severity`；REST API server；Homebrew／PyPI；`.skill_scannerrc` |
| AgentSeal | `--output sarif`／`json`／terminal；信任分數 0–100 | `agentseal scan … --min-score 75` 低於門檻 exit 1；`guard` 輸出 SARIF；`shield` 檔案監控（桌面通知、隔離檔案）；PyPI＋npm |

來源：各 repo README（read 或 partial，見讀取程度表）。

---

## 6. (e) 限制、誤報漏報、繞過、評測、第三方批評

### 6.1 繞過（第三方）
- **Trail of Bits（2026-06-03）**【第三方，一手研究】：「We recently bypassed ClawHub's malicious skill detector, Cisco's agent skill scanner, and all three of the scanners integrated into skills.sh.」手法：10 萬個換行把惡意碼擠出 context、`.pyc` bytecode 下毒（「skill-scanner's static analyzers did not investigate the `.pyc` bytecode」）、`.docx`（ZIP）間接執行、用「企業合規政策」語氣說服 LLM 掃描器。連結 repo `trailofbits/overtly-malicious-skills`。**他們實測的是 Cisco，沒有實測 SkillSpector 與 AgentSeal。**（https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/ ，partial：讀到約 12k 字元處被截斷，最後一個 prompt-injection 案例的細節未讀完）
  - 補充：SkillSpector 後來有 SC8（Shipped Python Bytecode）、SC9（Concealed Executable Artifact）規則（README 規則表，read），【推論】可能是對此類手法的回應，未驗證因果。
- **Adversa AI（2026-07-30）**【第三方，廠商部落格】：八個開源掃描器全被繞過，含 Cisco 與 NVIDIA。重點句：「every scanner matches the bytes in the file, not the bytes that execute」；Cisco：「paraphrased injection walks past it; also blind to the prose `curl` | `sh` family by construction」；NVIDIA：「homoglyph, paraphrase and text-in-image each pass」；「Cisco's own run over MalSkillBench… its prompt injection rules fired on **zero** malicious samples and only on benign ones」；NVIDIA 對 `echo 'hello world' | sh` 也會觸發。作者坦承「our first pass predictions from reading source were wrong in 53 of 77 comparable cells」。測試條件：LLM judge 關閉（離線）。**限制**：NVIDIA 是「repaired from its own `__pycache__` bytecode」，作者自己說驗證較弱；Adversa 是賣 AI 安全服務的廠商；未測 AgentSeal。（https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/ ，partial：讀到約 16k 字元處截斷，附錄與負面結果章節未讀）
- **CSA Lab Space 整理（2026-06-10）**【第三方彙整，非原創實測】：複述 ToB，並指出 SkillSpector「explicitly acknowledges it cannot analyze text within images or encrypted and binary code」。（https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-skill-scanner-bypass-20260610-csa/ ，partial：讀到「Recommendations」開頭前）

### 6.2 誤報
- **SkillSpector issue #644**（2026-09-26，外部使用者 jwcastillo，v2.12.0 `--no-llm`）：「every finding in a handful of rule families turned out to be a false positive」；列出 P2 對 UTF-8 BOM 報隱藏指令、RA2 的 `plist` 匹配 `relationshipList`、EA3 對 OFL 授權文字報 scope creep、AE1 `static_parse_limit` 被評為 HIGH 且逐行重複：「the single largest score driver (scores of 50 to 100, DO_NOT_INSTALL on skills with no real finding)」。其中 A1–A3 有 PR 修正，B1–B8 為設計議題未改。（https://github.com/NVIDIA/SkillSpector/issues/644 ，read 全文）
- **Towards Data Science（2026-07-22）**【第三方，個人實測】：靜態層對一個合法 GitHub 自動化 skill 報 20 個 finding，其中 16 個是 skill 本職功能（「roughly an 80 percent false-positive rate」）；對刻意植入的 honeypot 給 100/100，判斷正確。樣本只有 3 個 skill。（partial：讀約前 9000 字元）
- **Cisco 自述**：規則 only 在 MaliciousSkillBench held-out 上 HIGH+ recall 7.7%、FPR 4.0%；加 LLM judge（Gemma 4 26B，balanced）MEDIUM+ recall 66.7%／FPR 15.4%；「The judge failed on 116 of 1,000 records (11.6%)」；「Un-analysed skills pass the gate」51 筆。（`docs/reference/measured-results.md`，partial：讀前約 330 行）
- **Cisco vs SkillSpector 同台數字（Cisco 自己的作者跑的，利益相關）**：12,498 筆真實 skill 的 flag 率，Cisco MEDIUM+ 3.76%，SkillSpector（4,379 筆子集，僅靜態）MEDIUM+ 26.42%、HIGH+ 12.90%。同文件註明 Cisco 規則包「were tuned against MaliciousSkillBench during development」，且 Cisco 的 spaces 由 Cisco 作者 Vineethsain 發布（commit 作者 Vineeth Sai Narajala 為 Cisco repo 最多 commit 者，推論同一人但未驗證身分）。flag 率不是誤報率，文件自己也這樣寫。HF Space 頁面本體只取回 shell（Running…Refreshing，blocked 於內容），**表格數據我讀不到原始頁，只讀到 repo 內 measured-results.md 的引用**。

### 6.3 各自的官方限制聲明
- SkillSpector README `## Limitations`：「Non-English content: May miss patterns in other languages」「Image-based attacks」「Encrypted/binary code」「Runtime behavior: Static analysis only」；`docs/B.3.2-mcp-tool-poisoning.md`：「TP1-TP3 are pattern-based: Sophisticated obfuscation… may evade detection. The analyzer trades recall for precision」。「87% precision」這個數字出現在 Help Net Security／CSA 轉述（「the project puts at roughly 87% precision」），我在 README 內**沒找到**這個數字的出處與評測集，視為未驗證。
- Cisco README：「A scan that returns 'No findings' indicates that no known threat patterns were detected. It does not guarantee that a skill is secure」。
- AgentSeal：README 只說「Found a detection gap, a false positive… open an issue」，**無限制章節、無評測數據、無誤報率**。

### 6.4 搜尋紀錄（至少一輪 limitations／bypass／false positive／evasion）
查詢：`skill scanner false positives evasion bypass limitations Cisco skill-scanner OR SkillSpector OR AgentSeal`、`NVIDIA SkillSpector false positives noisy limitations criticism`、`AgentSeal getagentseal review OR criticism OR false positives MCP scanner`、`"agentseal" guard skill scanner MCP poisoning comparison benchmark`、GitHub issue 搜尋 `bypass evasion homoglyph paraphrase false negative`（NVIDIA/SkillSpector，0 筆）。**AgentSeal 沒找到任何獨立評測、批評或繞過報告**（結果只有 agentseal.org 官網、MCP registry 頁面、一個 mcpmarket 目錄頁、一篇 skillshield.dev 的七工具比較文，後者列表不含 AgentSeal）。狀態：⚪ 確認無公開資料（試過 Groundlane web_search ×3、GitHub issues 搜尋；未試 Exa/Tavily 因 Groundlane 搜尋已聯集 brave+you，Groundlane 回報 tavily/exa unavailable）。

---

## 7. (f) 維護者、授權、更新頻率、星數

| 項目 | SkillSpector | Cisco skill-scanner | AgentSeal |
|---|---|---|---|
| 組織／維護者 | NVIDIA（官方組織）；人類 commit 最多 Narendran Raghavan、yashrajbasav；104 contributors（star-history 自述） | cisco-ai-defense（官方組織）；commit 作者 Vineeth Sai Narajala 約 50／146 | getagentseal（組織 id 277308000，新）；網站 agentseal.org；commit 作者顯示 "AgentSeal" 120、Miles-dev-29 22、Toruk_Studio 15——**公司背景與人員無法從 repo 驗證** ✉️ |
| 授權 | Apache-2.0（LICENSE read） | LICENSE 檔頭 Apache 2.0、README 寫 Apache 2.0；但 GitHub API 顯示 `license: other / NOASSERTION`（【推論】LICENSE 檔格式使 GitHub 無法辨識，非授權不同） | FSL-1.1-Apache-2.0（Functional Source License，兩年後轉 Apache；非 OSI 開源）；GitHub 顯示 NOASSERTION |
| 建立日 | 2026-03-21 | 2026-01-29 | 2026-03-03 |
| 最後 push | 2026-10-21 | 2026-10-21 | **2026-06-11**（約 4.4 個月前；最近一次是 release 0.10.0） |
| 版本 | v2.13.0（pyproject 2.12.0 開發中） | 2.3.1（tag 2.3.1） | 0.10.0 |
| star／fork | 20,823／1,825 | 2,619／336 | 380／66 |
| open issues | 169 | 5 | 9 |
| 更新頻率 | 極高：淺 fetch 1,630 筆 commit，其中約 35% 為 bot；單單 2026-10-20 就有多個 PR 合併 | 淺 fetch 146 筆，近 30 天 42 筆；28 個 tag | 淺 fetch 170 筆；近期停滯 |

資料來源：github MCP `search_repositories`（metadata）、`git log`／`git ls-remote`（我 clone 後在本機讀，read）。

---

## 8. (g) 三者比較

| 面向 | NVIDIA SkillSpector | Cisco skill-scanner | AgentSeal |
|---|---|---|---|
| 定位 | 安裝前 skill/MCP 靜態掃描，NVIDIA Verified Skills 發佈流程的 scan 步驟 | 安裝前 skill 掃描，多引擎＋LLM judge＋CEL 決策層 | 本機 agent 設定／skill／MCP 設定守衛＋prompt 紅隊＋即時 MCP 稽核 |
| 偵測核心 | 規則＋AST＋taint＋YARA 為主，LLM 為可選且只升不降 | 規則極輕（自述 7.7% recall），實務依賴 LLM judge | regex＋去混淆＋MiniLM embedding；LLM 可選 |
| 執行目標程式碼 | 否（自述） | 靜態分析；未見聲明但文件為 AST | `guard` 否；`scan-mcp` **會啟動 server** |
| Rug-pull | 有專門 RP1–RP3 | 無專門偵測 | 本機設定 hash 比對；遠端工具變動未涵蓋（Level 3 deferred） |
| MCP tool poisoning | TP1–TP4 規則 | 靜態弱（recall 40%），靠 LLM | 連線抓工具描述分析 |
| OWASP 標註 | 部分 analyzer 標 LLM/ASI | 完整 taxonomy 映射 LLM01–、ASI01–ASI10 | 幾乎無 |
| 輸出 | terminal/JSON/MD/SARIF | summary/JSON/MD/table/SARIF/HTML | JSON/SARIF/terminal |
| 公開評測 | 無自家評測；第三方 87% precision 轉述未見一手；有第三方誤報 issue | 自家 measured-results 詳盡（含負面結果）；第三方 ToB、Adversa 繞過 | 無 |
| 授權 | Apache-2.0 | Apache-2.0 | FSL-1.1-Apache-2.0 |
| 活躍度（2026-10） | 非常高 | 高 | 低（4+ 月無 push） |
| 星數 | 20.8k | 2.6k | 380 |

選用建議（【推論】，基於上述證據，非實測）：兩個大廠工具都應當作「輔助篩選」，不是閘門；三者都沒有中立評測支持「可作唯一防線」。若要在 CI 上擋東西，SkillSpector 的 `--fail-on-incomplete` 概念（覆蓋不完整就失敗）與 Cisco 文件自承的 fail-open 缺口剛好互補，值得在自己的政策中採用。

---

## 9. 限制與反證（我自己的）

1. **沒有實跑任何掃描器**（依指示），因此所有偵測能力都來自讀碼與他人實測；Adversa 本人說讀碼預測在 77 格中錯了 53 格，所以本文「規則存在 ≠ 有效偵測」。
2. 規則數量三個版本不一致（SkillSpector 64/68/71，我數 67），Cisco 與 AgentSeal 的我只做 grep 估算，不是官方總數。
3. 我用的是淺 clone 的最新 commit（SkillSpector `11c8b48`，2026-10-20；Cisco `c615acb`，2026-10-21；AgentSeal `7c2a228`，2026-06-11），與第三方測試時的版本不同（TDS 測 2.3.1，Adversa/ToB 測更早版本）；SkillSpector 已新增 SC8/SC9/AE 系列規則，舊批評未必適用現在，但也**沒有人重測**。
4. 星數成長曲線無法驗證；不能用本研究為「無刷星」背書。
5. Cisco 對 SkillSpector 的比較由 Cisco 作者發布，利益相關。
6. 沒有讀 OWASP 官方 Top 10 文件，編號對照無法交叉驗證。

---

## 10. 來源清單與讀取程度

| # | 來源 | 類型 | 讀取程度 |
|---|---|---|---|
| 1 | NVIDIA/SkillSpector repo（clone 於 /home/user/NVIDIA/skillspector；README、docs/B.3.2、CHANGELOG、mcp_rug_pull.py、static_patterns_prompt_injection.py、agent_skills.yar、SECURITY.md、LICENSE） | 自述 | read（README 全文、其餘檔案為 partial 段落） |
| 2 | cisco-ai-defense/skill-scanner repo（README、docs/reference/measured-results.md、data/packs/*、taxonomy json、behavioral-analyzer.md、ascii_smuggling_checks.py） | 自述 | README read 前約 480 行；measured-results.md partial（約 330 行）；其餘 partial |
| 3 | getagentseal/agentseal repo（README、python/agentseal/{skill_scanner,detection/skill_detector,deobfuscate,baselines,mcp_checker,mcp_runtime,mcp_tool_analyzer}.py、CHANGELOG、LICENSE、SECURITY.md） | 自述 | README read 全文；原始碼 partial（片段） |
| 4 | github MCP `search_repositories` 三個 repo + NVIDIA/skills | GitHub API | read（結構化 JSON） |
| 5 | https://docs.nvidia.com/skills/scanning-agent-skills | 自述 | read 全文 |
| 6 | https://developer.nvidia.com/blog/nvidia-verified-agent-skills-provide-capability-governance-for-ai-agents/ | 自述 | partial（前 5000 字） |
| 7 | https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/ | 第三方一手研究 | partial（前 12k 字） |
| 8 | https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/ | 第三方（廠商） | partial（前 16k 字，附錄未讀） |
| 9 | https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-skill-scanner-bypass-20260610-csa/ | 第三方彙整 | partial（約 14k 字，Recommendations 前） |
| 10 | https://www.helpnetsecurity.com/2026/08/03/skillspector-open-source-agent-skill-security-scanner/ | 第三方報導 | read 全文 |
| 11 | https://towardsdatascience.com/from-green-checkmark-to-real-judgment-auditing-ai-agent-skills-with-skillspector/ | 第三方個人實測 | partial（前 9000 字） |
| 12 | https://github.com/NVIDIA/SkillSpector/issues/644 | 第三方（使用者 issue） | read 全文 |
| 13 | https://www.star-history.com/nvidia/skillspector/ | 第三方統計 | snippet（title/description） |
| 14 | https://huggingface.co/spaces/Vineethsain/skill-scanner-vs-skillspector | Cisco 作者 | blocked（僅取到頁殼，內容為動態 App） |
| 15 | explainx、skillsllm、vibecodes、dev.to、agentseal.org、mcpmarket、skillshield.dev | 目錄／部落格／官網 | snippet（僅搜尋結果摘要） |

---

## 11. 降級與未結項目

**工具降級紀錄**
- github MCP `get_file_contents`／`list_releases`／`search_issues`（部分）對這三個 repo 回「not configured for this session」（只允許 vincentxuu/quidproquo）。降級：改用 add_repo（回 read_available）＋`git clone --depth 1` 讀本機檔案；metadata 用 `search_repositories`（可用）。`gh api` 同樣 403。
- `curl` 抓 adversa／trailofbits 被 proxy 403 → 改 Groundlane web_fetch，成功。
- Groundlane web_search 曾回「upstream closed the stream」兩次 → 重試後成功；搜尋回報 tavily／exa unavailable，只有 brave＋you。因 Groundlane 已成功，未再依序落到 WebFetch／Exa／Tavily／linkup／jina／firecrawl。
- 以下列為未結，理由：

| 項目 | 狀態 | 試過 |
|---|---|---|
| SkillSpector 星數成長時間序列／是否刷星 | ⚪ 確認無公開資料（未能取得） | github MCP（無 stargazers 時間戳）、`gh api`（403）、star-history 頁（只有 title）、curl（403）；未試 Exa/Tavily/linkup/jina/firecrawl 抓 star-history 圖 |
| HF Space 內的 Cisco vs SkillSpector 完整表格 | ⚪ 僅取到頁殼（動態 App） | Groundlane web_fetch；measured-results.md 為其摘要 |
| "87% precision" 出處 | ✉️ 需問 NVIDIA 或找原始文件 | README grep 無；僅 Help Net／CSA 轉述 |
| OWASP Agentic ASI16 與 Cisco 的 LLM 編號是否為官方 | ✉️ 需讀 OWASP 官方文件 | 本題未讀 OWASP 原文 |
| AgentSeal 營運者身分、第三方評測 | ⚪ 確認無公開資料 / ✉️ | 見 §6.4 |
| Cisco 是否「從不執行」目標碼 | ⚪ 官方文件未明說 | grep README 與 behavioral-analyzer.md |
