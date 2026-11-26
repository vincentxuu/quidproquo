# 第4層：主動攻擊 / AI 滲透測試 / red team（Strix、PyRIT、HexStrike-AI、HackAgent）

研究日期：2026-10-22。範圍：只做文獻與原始碼閱讀，未安裝、未執行任何工具，未對任何目標掃描。
標記規則：【自述】作者/廠商自己說的；【第三方】獨立報導或研究；【推論】我的判斷。

## 0. 降級紀錄（toolDegradation）

- `mcp__github__*`（get_file_contents / list_commits / search_issues / search_code）：全部被 session 擋下。原因：「Allowed repositories: vincentxuu/quidproquo」，目標 repo 未加入 session。我沒有呼叫 add_repo（使用者沒要求附加憑證的 repo，且公開檔案有別的路可讀）。
- 降級為 Groundlane `web_fetch`，讀 `raw.githubusercontent.com` 全文與 `api.github.com` JSON：成功。
- Bash `curl` 讀 raw.githubusercontent.com 成功（用來對 hexstrike_server.py 做 grep，只讀不執行）；curl 打 api.github.com 被 session 擋（回「GitHub access … not enabled」）。
- Groundlane `web_search`：tavily、exa 子 provider 曾 unavailable，由 brave、you 補上，仍可用。
- Reddit netsec 貼文：Groundlane（JS 驗證頁）、jina（blocked by network security）、Exa（SOURCE_NOT_AVAILABLE）、firecrawl（credits 用完）全失敗，見 §6。
- Medium 文章：Groundlane 回「upstream closed the stream」，改用 Exa 成功（partial）。
- 未走到：Tavily、linkup（Reddit 以外沒有需要）。

## 1. 來源清單與讀取程度

| # | 來源 | 網址 | 讀取程度 |
|---|---|---|---|
| S1 | Strix README | https://raw.githubusercontent.com/usestrix/strix/main/README.md | read（全文 17.9KB） |
| S2 | Strix repo metadata（API） | https://api.github.com/repos/usestrix/strix | partial（前 6.4KB，stars/license/dates 都在內） |
| S3 | Strix releases | https://api.github.com/repos/usestrix/strix/releases?per_page=3 | partial（最新一筆 v1.7.0 的標頭） |
| S4 | Strix CLI 文件 | https://docs.strix.ai/usage/cli.md | read |
| S5 | Strix Sandbox Tools 文件 | https://docs.strix.ai/tools/sandbox.md | read |
| S6 | Strix 自訂指令文件 | https://docs.strix.ai/usage/instructions.md | read |
| S7 | Strix XBEN benchmark README | https://raw.githubusercontent.com/usestrix/benchmarks/main/XBEN/README.md | read |
| S8 | Escape.tech 基準比較 | https://escape.tech/blog/benchmarking-agentic-ai-pentesting-tools/ | partial（方法、結果、限制讀完；尾段行銷截斷） |
| S9 | Ethiack EthiBench 文章 | https://ethiack.com/info-hub/research/ai-pentesting-benchmarks-are-so-bad-we-made-a-new-one | read |
| S10 | Wavect Strix 試點指南 | https://wavect.io/blog/strix-ai-pentesting-pilot-guide-2026/ | partial（約前 2/3，FAQ 截斷） |
| S11 | Furqan Khan，Medium「Reverse UNO」 | https://medium.com/@furqankhan08/reverse-uno-how-githubs-1-agentic-ai-powered-pentesting-framework-can-be-turned-against-its-1d99dc0aae04 | partial（Exa 取 9000 字，到 2.1 Infrastructure 為止） |
| S12 | North Denver Tribune（Novel Cognition） | https://northdenvertribune.com/news-2/strix-open-source-ai-pentester-four-agent-swarm-claim-checked-against-source/ | read |
| S13 | Reddit r/netsec Strix sandbox RCE | https://www.reddit.com/r/netsec/comments/1tozkke/rce_in_strix_agentsandbox_a_practical_guide_to/ | snippet（只有搜尋摘要）/ blocked |
| S14 | PyRIT README | https://raw.githubusercontent.com/microsoft/PyRIT/main/README.md | read（全文） |
| S15 | PyRIT repo metadata | https://api.github.com/repos/microsoft/PyRIT | partial |
| S16 | PyRIT releases | https://api.github.com/repos/microsoft/PyRIT/releases?per_page=3 | partial（v1.1.0 release notes 讀到「Full list of changes」開頭） |
| S17 | PyRIT PyPI JSON | https://pypi.org/pypi/pyrit/json | partial（前 1.5KB：作者、classifier） |
| S18 | PyRIT 文件首頁（跳轉 1.1.0） | https://microsoft.github.io/PyRIT/ 與 /1.1.0/ | read |
| S19 | PyRIT Framework 架構頁 | https://microsoft.github.io/PyRIT/1.1.0/code/framework | partial（約前 9000 字） |
| S20 | PyRIT 論文 arXiv | https://arxiv.org/abs/2410.02828 | abstract（摘要頁，未讀 PDF 全文） |
| S21 | CSA/OWASP：Evaluating PyRIT for Agentic AI Red Teaming | https://cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming | partial（前 6000 字；後段 80%/40% 比例引自搜尋摘要 snippet） |
| S22 | HexStrike README | https://raw.githubusercontent.com/0x4m4/hexstrike-ai/master/README.md | read（全文 31KB） |
| S23 | HexStrike repo metadata | https://api.github.com/repos/0x4m4/hexstrike-ai | read（5.7KB 完整） |
| S24 | HexStrike releases | https://api.github.com/repos/0x4m4/hexstrike-ai/releases?per_page=3 | read（回傳 `[]`） |
| S25 | HexStrike commits | https://api.github.com/repos/0x4m4/hexstrike-ai/commits?per_page=6 | partial（最新一筆） |
| S26 | hexstrike_server.py 原始碼 | https://raw.githubusercontent.com/0x4m4/hexstrike-ai/master/hexstrike_server.py | partial（734KB 全部下載後做 grep，讀了 /api/command、execute、scope、app.run 等段；沒有逐行讀完） |
| S27 | HexStrike issue #224 | https://api.github.com/repos/0x4m4/hexstrike-ai/issues/224 | partial（約前 9000 字，含漏洞描述與 PoC；結尾 Impact/Remediation 與最後一個 Remediation 行引自搜尋 snippet） |
| S28 | Check Point 部落格 | https://blog.checkpoint.com/executive-insights/hexstrike-ai-when-llms-meet-zero-day-exploitation/ | read |
| S29 | 搜尋結果：SC Media / The Hacker News / SecurityAffairs / Infosecurity | scworld.com、thehackernews.com/2025/09/threat-actors-weaponize-hexstrike-ai-to.html 等 | snippet（只看搜尋摘要，未點開） |
| S30 | DailyCVE「HexStrike AI RCE CVE-2021-44228」 | https://dailycve.com/hexstrike-ai-remote-code-execution-cve-2021-44228-critical-dc-oct2026-3204/ | partial（前段） |
| S31 | HackAgent README | https://raw.githubusercontent.com/AISecurityLab/hackagent/main/README.md | read（全文） |
| S32 | HackAgent repo metadata | https://api.github.com/repos/AISecurityLab/hackagent | partial |
| S33 | HackAgent releases | https://api.github.com/repos/AISecurityLab/hackagent/releases?per_page=3 | partial（v0.16.0） |
| S34 | HackAgent 文件：Concepts、How a run works、Attacks、Responsible disclosure | https://docs.hackagent.dev/concepts 、/concepts/how-a-run-works 、/reference/attacks 、/security/responsible-disclosure | read |
| S35 | arXiv 2606.18193「A Red-Team Study of Anthropic Fable 5 & Opus 4.8 Models」 | https://arxiv.org/abs/2606.18193 | abstract（摘要頁；作者是 AI4I，用 HackAgent） |

## 2. 先確認：repo 存在與歸屬

- **usestrix/strix 存在**。GitHub 帳號 `usestrix` 是 Organization，repo 建立於 2025-08-05，描述「Open-source AI penetration testing tool to find and fix your app's vulnerabilities.」（S2）。使用者給的連結是否就是這個網址，我沒看到原連結，只能確認這個 repo 存在且名稱吻合；若使用者的連結是別的 fork 或 `strix.ai` 子頁，需對照。 [推論]
- 注意同名混淆：Strix 的 PyPI 套件叫 `strix-agent`（S1 的 PyPI badge）。
- **microsoft/PyRIT、0x4m4/hexstrike-ai、AISecurityLab/hackagent 皆存在**（S15、S23、S32）。
- HexStrike 的 owner 是個人帳號 `0x4m4`（type: User，S23），但 README 自稱「Owned & developed by OTT Cybersecurity LLC」（S22，作者自述）。另有社群 fork `netcuter/Hexstrike-AI`（搜尋 snippet，未讀）。

## 3. (a) 測試對象：根本差異

| 工具 | 被測對象 | 一手依據 |
|---|---|---|
| Strix | 一般應用程式：web app、API、原始碼 repo、IP/網域 | README：「autonomous AI penetration testing agents … run your code dynamically, find vulnerabilities, and validate them through actual proofs-of-concept」（S1）；`--target` 接 URL、repo、本機目錄、IP、OpenAPI/Postman（S4） |
| HexStrike-AI | 一般網路與 web 目標、雲端、二進位、CTF；它是「讓 LLM 驅動 150+ 工具」的 MCP 伺服器 | 描述：「lets AI agents (Claude, GPT, Copilot, etc.) autonomously run 150+ cybersecurity tools」（S23） |
| PyRIT | AI 系統本身：生成式 AI 模型與應用 | 「an open source framework built to empower security professionals and engineers to proactively identify risks in generative AI systems」（S14） |
| HackAgent | AI 模型與 agent 本身：jailbreak、prompt injection、tool misuse | 「attacks your AI model or agent with research-backed techniques — jailbreaks, prompt injection, tool misuse — and has judge models score every reply」（S31） |

結論：Strix / HexStrike 是「用 AI 當攻擊者，打傳統軟體」；PyRIT / HackAgent 是「用（常是 AI 的）攻擊程式，打 AI 當被測物」。這個劃分有兩個細節要補：

1. Strix 本身也帶了攻擊 AI 的 skill（`agentic_system_security`、`llm_prompt_injection`，S12 第三方讀 repo 所得），但主戰場仍是傳統 web。
2. PyRIT 測的是「模型的文字回應」，不是 agent 的實際行為。CSA/OWASP 評估：「PyRIT is designed to test model-mediated behaviors, not to execute or control real autonomous agents. While PyRIT does not provide native agent execution, tool invocation, or system-level enforcement validation…」（S21，第三方）。HackAgent 有 Tool-output IPI（工具觀察值注入）與 RAG poisoning 攻擊（S34），更靠近 agent，但仍屬 prompt 層攻擊。

## 4. (b) 架構與攻擊流程

### Strix
- **Agent 迴圈**：一個 agent 模板加執行期自建的 agent 圖。S12（第三方，讀 repo main）：「one agent template … plus six tools the agent uses to build a graph of child agents while it is running: `create_agent`, `send_message_to_agent`, `wait_for_agents`, `view_agent_graph`, `stop_agent` and `agent_finish`」；固定角色只有一個 Validation Agent。README 自述是「Graph of Agents … Specialized AI agents for recon, exploitation, and post-exploitation」（S1）。兩者說法不同，README 的「specialized agents」措辭容易讓人以為有固定的四階段流程，S12 指出原始碼沒有。我沒有自己讀 `strix/agents/factory.py`，此點引用 S12。
- **底層工具**：Kali 為基底的 Docker 容器。S5：「Strix runs inside a Kali Linux-based Docker container」，內含 Nuclei、SQLMap、ZAP、Nmap、ffuf、Katana、Semgrep、TruffleHog、Caido（HTTP proxy）、Playwright 等。README 致謝提到 LiteLLM、Caido、Nuclei、Playwright（S1）。**沒有 Burp**，用的是 Caido。
- **是否需要沙箱容器**：需要。README Prerequisites：「Docker (running)」（S1）。
- **重要細節**：本機目錄「is mounted into the sandbox live and **writable**, so the agent edits your real files」（S4）。
- **預算與步數控制**：`--max-budget`（USD，事後檢查、可能超支）、`--max-turns`（預設 500）（S4）。
- **LLM**：自備 API key，經 LiteLLM 支援多供應商（S1）。

### HexStrike-AI
- **架構**：兩支腳本。`hexstrike_server.py`（Flask API，執行工具）加 `hexstrike_mcp.py`（FastMCP 客戶端橋接 LLM）（S26 檔頭：「Architecture: Two-script system」）。LLM 本身在外部（Claude Desktop、Cursor、VS Code Copilot 等，S22）。
- **「12+ autonomous AI agents」**：S22 列了 IntelligentDecisionEngine 等類別名稱；Check Point 說它「provides threat actors with an orchestration 'brain' that can direct more than 150 specialized AI agents」（S28）。[推論] 這些「agent」多半是 Python 類別與規則式選擇邏輯，不是各自跑 LLM 迴圈的 agent；真正決策的 LLM 在 MCP 客戶端那一側。這點我只看到類別與函式名稱，沒有逐一讀實作，屬推論。
- **底層工具**：Nmap、Nuclei、SQLMap、Hydra、Hashcat、Gobuster、ffuf、Ghidra、radare2、Metasploit/MSFVenom、Prowler 等（S22），另有 Burp 與 ZAP 整合與 Selenium 瀏覽器代理。需自行安裝，README 要求「Run in isolated environments or dedicated security testing VMs」。
- **沙箱**：沒有。README 的 v7 預告才提到「Docker Container Support」（S22，且是「Coming Soon」）。
- **執行路徑**：`/api/command` 直接收 `command` 字串並執行（S26 line 9137-9150）；底層 `subprocess.Popen(command, shell=True, ...)`（S26 line 5274）。

### PyRIT
- **架構**：Scenarios → Attack Techniques → Executors/Attacks → Converters / Targets / Scorers，底層有 memory、registry。S19：「entry points run scenarios, which package datasets with attack techniques; each technique drives an attack/executor that orchestrates converters, targets, and scorers」。
- **攻擊流程**：資料集提供攻擊目標 → converter 轉換提示（編碼、混淆）→ 送到 target → scorer（含 LLM-as-judge）判斷 → 多輪攻擊依分數分支（Crescendo、TAP、Skeleton Key 等）。
- **模式**：Scanner（`pyrit_scan`）、GUI（CoPyRIT）、Framework（S18、S16）。
- **沙箱**：不需要攻擊用容器；它不執行任何系統層攻擊，只對 AI endpoint 發請求。
- **底層**：不用 nuclei/sqlmap/Burp/Kali。

### HackAgent
- **架構**：campaign（YAML）把 goals 經過 attacks 送到 target，由 judges 判定 jailbreak（S34：「A campaign sends goals through one or more attacks to a target, and judges decide which replies were jailbreaks」）。
- **攻擊目錄**（S34）：靜態（Baseline、CipherChat、FlipAttack、h4rm3l、Static Template、FC/tFC/MML）、自適應（AdvPrefix、AutoDAN-Turbo、BoN、PAIR、PAP、TAP、Tool-output IPI）、多輪（Crescendo）、RAG poisoning。自適應攻擊需要自己的 attacker 模型。
- **沙箱**：不需要。結果預設寫入本機資料庫與 `./logs/runs/<run id>/`（S34）。
- **底層**：不用傳統滲透工具。

## 5. (c) 安全與授權風險

### 5.1 範圍控制比較

| 工具 | 預設範圍限制 | 一手依據 |
|---|---|---|
| Strix | 軟性：API spec 目標會把 spec 內 base URL「authorizes … as in-scope hosts」（S4）；排除項只能用自然語言寫進 `--instruction`，例如「Do not test /admin or /internal endpoints」（S6）。我沒有在已讀文件中找到由程式強制的 allow/deny 網路清單。 | S4、S6；強制性的缺口屬 [推論]，僅限已讀頁面 |
| HexStrike | 幾乎沒有。HTTP 框架內有 `_in_scope()`，但 `if not self.scope: return True`，且 hostname 解析失敗也 `return True`（S26 line 13373-13390）。其他 90+ 工具端點沒有目標白名單。 | S26 |
| PyRIT | 目標由使用者設定的 endpoint 決定，攻擊面限於送文字給指定模型；沒有掃描網路的能力。 | S18、S19 |
| HackAgent | 目標由 campaign YAML 指定；文件要求「Agree on the scope in advance: which endpoints, which attacks, for how long」（S34），屬流程要求，非程式強制。 | S34 |

### 5.2 授權聲明（作者自述）
- Strix：「Authorized use only … only run it against systems you own or have explicit, written permission to test」（S1）。
- HexStrike：列出「Unauthorized Testing — Never test systems without permission」，同時在使用範例寫：「you generally can't start with just a simple 'i want you to penetration test site X.com' as the LLM's are generally setup with some level of ethics. You therefore need to begin with describing your role…」（S22）。這是教使用者用角色說明繞過 LLM 拒絕機制的文字，屬作者自述，值得標記。
- HackAgent：「HackAgent is for authorized security testing only」，並附負責任揭露流程（S31、S34）。
- PyRIT：README 只講 security policy 與商標，未見授權使用條款（S14）；文件其他頁未全讀。

### 5.3 HexStrike 的濫用事件與自身漏洞
1. **被威脅行為者濫用（第三方）**。Check Point：「Within hours of its release, dark web chatter shows threat actors attempting to use HexStrike-AI to go after a recent zero day CVEs」；「we have observed threat actors discussing the use of Hexstrike-AI to scan for and exploit vulnerable NetScaler instances」；對象是 Citrix 在 2025-08-26 揭露的 CVE-2025-7775（未驗證 RCE，已被實際利用）、CVE-2025-7776、CVE-2025-8424（S28，read）。
   - 證據強度：Check Point 的措辭是「claimed」「discussing」「seemingly」，來源是地下論壇貼文截圖，不是遙測或事件調查。其文中也寫「a tool designed to strengthen defenses has been claimed to be rapidly repurposed」。我沒有找到獨立驗證「HexStrike 真的完成了這些入侵」的一手資料。SC Media、The Hacker News、Security Affairs、Infosecurity Magazine 等多篇報導（S29）看起來都在轉述 Check Point，僅讀到搜尋摘要，所以不算獨立來源。
2. **自身有未驗證 RCE（第三方報告，GitHub issue）**。Issue #224（2026-08-04 開，2026-09-15 關閉，0 留言，作者 ez-lbz）：「The server requires no authentication and binds to 0.0.0.0. An attacker can inject arbitrary shell commands by appending shell metacharacters」，並貼出 `subprocess.Popen(..., shell=True)` 與 `app.run(host="0.0.0.0", ...)` 的行號（S27）。
   - **我自己對 master 原始碼的核對（S26）**：line 17289 確為 `app.run(host="0.0.0.0", port=API_PORT, debug=DEBUG_MODE)`，line 5274 確為 `shell=True`，line 9137-9150 的 `/api/command` 直接執行 `command`，grep 找不到 `before_request`、`auth_required`、API key 檢查。要注意：檔案前面有 `API_HOST = os.environ.get('HEXSTRIKE_HOST', '127.0.0.1')`（預設 127.0.0.1），但我讀到的 `app.run` 是寫死 `0.0.0.0`，沒有用 `API_HOST`，也就是環境變數看起來不會生效。這是我讀兩處程式碼後的觀察，沒有執行驗證 [推論]。
   - 該 issue 關閉但留言為 0，我沒有看到對應的修補 commit；master 最新 commit 是 2026-08-03「readme update」（早於 issue 開立），所以我讀到的程式碼就是 issue 描述的版本（S25、S26）。issue 為何被關閉，我讀不到（可能是作者關閉、機器人或提報者自行關閉）。
3. **沒有 CVE 編號**。我沒有找到 HexStrike 自身被指派 CVE 的一手紀錄。唯一搜到的 DailyCVE 頁面（S30）標題掛「CVE-2021-44228」（那是 Log4Shell），內文是通用 Log4j 文字加上 Metasploit/EPSS 工具拼貼，並稱「Version: v1.2.0 release」，而 HexStrike repo 沒有 release（S24 為 `[]`），README 版本是 v6.0。**判定該頁不可信，不採用。**
4. 作者自己承認風險：「This tool provides AI agents with powerful system access … AI agents can execute arbitrary security tools - ensure proper oversight … Consider implementing authentication for production deployments」（S22）。

### 5.4 Strix 的反向風險（prompt injection 打穿代理）
- Furqan Khan（獨立研究者，Medium，2025-11-28，針對 strix-agent 0.4.0，S11 partial）：「Malicious content inside a web application … is read by [Strix], passed to the LLM as 'Tool Results', and interpreted as instructions. The LLM then generates real tool calls (e.g., shell execution) which the platform executes, leading to RCE inside the … sandbox. The same path also enables DDoS / scope diversion, where agents are tricked into attacking third-party targets.」
- 同文轉述維護者回應：「Their initial position was that none of the behaviors I reported constitute vulnerabilities, on the basis that all execution occurs inside an isolated Docker container」。這是該研究者轉述，我沒有找到 Strix 方的對應回覆。
- 搜尋結果顯示 2026-05-27 的 r/netsec 貼文「RCE in Strix Agent(Sandbox): A practical guide to prompt injections with impact」（S13，只有 snippet，內文全被擋）。可說明同類問題後來又被討論，但我無法確認內容。
- [推論] 這類風險與 HexStrike 的差別在於：Strix 把工具鎖在容器裡，風險是「被測目標用 prompt injection 反控代理，並拿容器所在網路位置當跳板」；HexStrike 則是伺服器本身未驗證且可直接執行任意指令。這是我對兩份材料的整理。

### 5.5 PyRIT / HackAgent 的濫用面
- 兩者的「攻擊」是產生 jailbreak 提示並自動化迭代，濫用情境是用來批量繞過第三方模型的安全防護。證據：HackAgent 白皮書（S35）自述「found automatically and cheaply, usually within one or two refinement steps, by an attacker model with no human expert in the loop」，一份對 Anthropic 模型的紅隊研究。這是作者描述自動化 jailbreak 很容易，並非濫用事件紀錄。
- 我沒有找到 PyRIT 或 HackAgent 的濫用事件、CVE、或自身漏洞報告（有限的搜尋）。PyRIT v1.1.0 release notes 自述「Constrained HTTPXAPITarget upload paths」與「No known high-priority security issues」（S16），屬作者自述。

## 6. (d) 實測成效

### Strix（最多資料）
| 來源 | 結果 | 性質 |
|---|---|---|
| Strix 自己的 XBOW benchmark（S7） | v0.4.0 + gemini-3-pro-preview，黑箱，100/104 題（96%）；平均約 19 分鐘、每題約 $3.37；未解 4 題。 | 【自述】；CTF 型（取得 flag），題目為自包含 Docker 靶機 |
| Escape.tech（S8） | 在 Duck Store（20 個漏洞，含商業邏輯）用 DeepSeek v3.2：Strix 只找到 1/20（5%），費時 2 小時，誤報率 0%；Shannon 6/20，PentAGI 9/20，Escape 15/20（自家商業產品）。灰箱（給 URL、OpenAPI、帳密）。 | 【第三方，但廠商是競品】；單次執行、非平均；作者自述限制「Each tool was run once per target」 |
| Ethiack EthiBench（S9） | 三次平均、108 個專家標註漏洞：「Strix achieves high precision, close to perfect in some configurations, but at the cost of a significantly lower share of valid findings reported」；Strix-Sonnet 聚合三次後 F1 明顯上升。 | 【第三方，但作者 Ethiack 也有自家產品 Hackian 參賽】；論文在 arXiv 2605.10834（我只讀部落格，未讀論文） |
| Wavect（S10） | 認為 96% XBEN「vendor-run … not a guarantee」，且「does not establish the false-negative rate on an unknown application」。 | 【第三方，Wavect 自述是服務商，有商業利益】 |

- **誤報率**：沒有可信的獨立數字。Escape 的 0% 是在只找到 1 個發現的前提下，統計上沒有意義 [推論]；Strix 官方宣稱「validated through actual proofs-of-concept」「very low false-positive rates」是行銷自述。Ethiack 指出 Strix 精準度高但召回低（S9）。
- **矛盾點**：Strix 在自己的 CTF 基準 96%，在 Escape 的現實型靶機上只有 5%；兩者差異來自題型（CTF 單一 flag vs 多漏洞認證 API）、模型（Gemini 3 Pro vs DeepSeek v3.2）、版本（v0.4.0 vs 2026-04 當時版本）與單次運氣，不能直接下「誰對」的結論。 [推論]
- 注意：S12 稱「Nobody has published a detection rate」，這句與 S7/S8/S9 矛盾，應視為該文沒查到而不是事實（該文本身還是內容農場式聯播站，可信度低）。

### HexStrike
- README 的數字全是作者自述且沒有方法：「Vulnerability Detection Rate: 98.7% (vs 85% manual testing)」「False Positive Rate: 2.1% (vs 15% traditional scanners)」「CTF Success Rate: 89%」「99.9% Uptime」（S22）。我沒有在 README 與搜尋結果裡找到對應的測試集、樣本數或復現腳本。
- **獨立評測**：沒有找到。 ⚪確認無公開資料（試過：GitHub README、Groundlane 搜尋「HexStrike benchmark」類關鍵字 [搜尋詞：HexStrike AI exploited…、…unauthenticated command injection…、…github issues security…]，只得到濫用與漏洞報導；未對 arXiv 單獨搜尋，這一項標為「有限搜尋下未發現」，不是已窮盡）。

### PyRIT
- 沒有「偵測率」式的 benchmark。PyRIT 是框架，成效取決於使用者選的攻擊、資料集、scorer。
- 論文（S20，只讀摘要）自述「battle-tested」層級的說法來自第三方轉述：「battle-tested on 100+ products including Copilot」出現在 Microsoft Tech Community 文章摘要（搜尋 snippet，未點開）。
- 限制（第三方）：LLM-as-judge 會誤判：「The self-ask scorers … are themselves LLM judges and occasionally misjudge a borderline response」（qaskills.sh snippet）；評分增加成本（aisecbench.com snippet，「2–4× the raw inference cost」，無原始依據）；CSA 測得對 agent 的系統層驗證只有部分支援（snippet 中的 80% / 40% 是 CSA 自訂評分，非實測偵測率）。
- v1.1.0 release notes 本身承認評分有缺陷：新增「Scores can now be undetermined」，並修復聚合與 metadata 問題（S16，作者自述）。

### HackAgent
- 沒有獨立 benchmark。有一份由開發團隊 AI4I 自己用 HackAgent 做的紅隊白皮書（S35，只讀摘要）：對 Opus 4.8 / Fable 5 / Fable 5.1 跑 7,826 個有害意圖，「every apparent success was independently re-adjudicated by the same panel of five frontier judge models (≥4/5 agreement)」；TAP+PAP 成功率 Fable 5 為 2.72%、Opus 4.8 為 5.76%、Fable 5.1 為 8.19%。這是用 HackAgent 評估別的模型，不是評估 HackAgent 自己的準確度。
- HackAgent 自身的 judge 誤判率：文件有「judge audit」功能（S34），但我沒有讀到實測誤判數字。 ⚪未發現公開數字（試過：README、concepts、how-a-run-works、arXiv 2606.18193 摘要；未讀 PDF 全文，建議之後補讀）。

## 7. (e) 維護者、授權、更新頻率、star

| 項目 | Strix | PyRIT | HexStrike-AI | HackAgent |
|---|---|---|---|---|
| 維護者 | `usestrix` 組織（S2）；官方產品 strix.ai；release 由 github-actions / devin-ai-integration 機器人發布（S3、搜尋 snippet） | `microsoft` 組織；PyPI 作者「Microsoft AI Red Team」（S15、S17） | 個人帳號 `0x4m4`；README 自稱 OTT Cybersecurity LLC 擁有（S22、S23） | `AISecurityLab`，即義大利 AI4I 的 AI Security Lab；聯絡 ais@ai4i.it（S31、S35） |
| 授權 | Apache-2.0（S2） | MIT（S15） | MIT（S23） | Apache-2.0（S32） |
| Stars（2026-10-22） | 70,804 | 4,668 | 13,000（整數，可能為四捨五入或 API 快取，未驗） | 528 |
| Forks | 7,850 | 973 | 2,642 | 110 |
| Open issues | 494 | 163 | 125 | 17 |
| 建立日 | 2025-08-05 | 2023-12-12 | 2025-07-10 | 2025-05-14 |
| 最後 push | 2026-10-22 | 2026-10-21 | **2026-08-03**（最新 commit「readme update」） | 2026-10-21 |
| 最新版本 | v1.7.0（2026-10-05） | v1.1.0（2026-09-04） | **無 release**（releases 為空）；README 版本 v6.0，並預告 v7 | v0.16.0（2026-10-20） |
| 商業化 | Strix Cloud、Enterprise（S1） | 無（Microsoft 內部另有 AI Red Team） | hexstrike.com 桌面客戶端預告、LeaksAPI 贊助（S22） | app.hackagent.dev 託管版（S31） |

- Stars 差距很大，Strix 70.8k 是 PyRIT 的約 15 倍。 [推論] 星數主要反映話題度（Strix 在 2025-11 曾登 GitHub trending #1，見 S11），不等於成熟度或品質；S12 說得更直白：多數介紹文章描述的架構不在原始碼裡。
- HexStrike 更新頻率最低：最後 commit 是 2026-08-03 且是改 README，漏洞 issue（2026-08-04）後兩個多月沒有程式碼層面回應。

## 8. (f) PyRIT 是否微軟官方、最新版本與定位

- **官方**：是。repo 在 `microsoft` 組織下（S15 owner `microsoft`，type Organization）；PyPI 作者欄「Microsoft AI Red Team <airedteam@microsoft.com>」（S17）；README：「Review our security policy to report vulnerabilities privately through the Microsoft Security Response Center」（S14）；文件站在 microsoft.github.io，頁面作者「Microsoft AI Red Team」（S19）。原文引用「PyRIT: Democratizing AI Red Teaming Through Open-Source Tooling」為引用論文（S14，白皮書 PDF 網址我未讀）。
- **最新版本**：v1.1.0，2026-09-04 發布，Python `>=3.10, <3.15`（S16）。我只看了 releases 前 3 筆中的第一筆；文件站首頁導向 1.1.0（S18），PyPI README 也指向 `releases/v1.1.0`（S17），三處一致。PyPI classifier 仍標「Development Status :: 3 - Alpha」（S17），這點與版號 1.x 並存，值得提醒使用者 API 仍可能變動；v1.1.0 就包含「Breaking changes」（S16）。
- **定位**：「open source framework … to proactively identify risks in generative AI systems」（S14），是建構 AI red team 的元件庫（targets / converters / scorers / attacks），不是一鍵掃描器；另有 `pyrit_scan` 與 GUI（CoPyRIT）降低門檻（S16、S18）。對 agent 的覆蓋有限（S21）。

## 9. 四者比較表

| 面向 | Strix | HexStrike-AI | PyRIT | HackAgent |
|---|---|---|---|---|
| 被測對象 | 一般 web app / API / 程式碼 | 一般網路 / web / 雲 / 二進位 | 生成式 AI 模型與應用 | AI 模型與 agent |
| AI 的角色 | 攻擊者（自帶 agent 迴圈） | 外部 LLM 經 MCP 呼叫工具；伺服器只負責執行 | 攻擊者模型 + 評分模型 | 攻擊者模型 + 評審模型 |
| 底層工具 | Kali 容器內 Nuclei、SQLMap、ZAP、Caido、Playwright 等 | 150+ 外部工具（Nmap、Hydra、Metasploit、Burp/ZAP…）需自裝 | 無傳統滲透工具 | 無傳統滲透工具 |
| 需要沙箱 | 需要 Docker | 沒有，README 要求自行用隔離 VM | 不需要 | 不需要 |
| 範圍控制 | 軟性（指令文字 + spec 主機） | 實質無（`_in_scope` 空範圍預設放行） | 由 endpoint 設定決定 | YAML 目標 + 流程要求 |
| 已知安全問題 | 研究者 PoC：目標內容 prompt injection → 沙箱內 RCE、範圍偏移（第三方） | 未驗證 shell 注入 RCE（issue #224）；被地下論壇討論用於 Citrix 攻擊（Check Point） | 未發現 | 未發現 |
| 公開評測 | 自家 XBEN 96%；第三方 5%（Escape）/ 高精準低召回（Ethiack） | 僅作者自述數字，無方法 | 無偵測率 benchmark；CSA 能力評估 | 僅別人模型的紅隊報告 |
| 維護者 | usestrix 公司 | 個人 / OTT Cybersecurity LLC | Microsoft AI Red Team | AI4I AI Security Lab |
| 授權 | Apache-2.0 | MIT | MIT | Apache-2.0 |
| Stars | 70.8k | 13k | 4.7k | 528 |
| 最近更新 | 2026-10-22，v1.7.0 | 2026-08-03，無 release | 2026-10-21，v1.1.0 | 2026-10-21，v0.16.0 |

## 10. 限制與反證

1. **GitHub MCP 無法使用**，所有 repo 資料來自 raw.githubusercontent / api.github.com 的 HTTP 讀取。star 數是 2026-10-22 當下 API 值；HexStrike 的 13000 是整數，可能被快取或四捨五入。
2. **HexStrike 原始碼只做了 grep 式閱讀**（734KB），不是逐行讀完。「無驗證」的結論來自搜尋 `before_request / auth / API_KEY / Authorization` 等關鍵字找不到防護，以及 issue #224 的獨立描述；兩者互相印證，但不是窮盡。 `API_HOST` 預設 127.0.0.1 與 `app.run(host="0.0.0.0")` 並存，我推論環境變數不會生效，未執行驗證。
3. **Citrix 濫用事件的證據層級偏低**：全部源於 Check Point 看到的地下論壇貼文，且其措辭是「claimed」。沒有找到受害方確認、遙測或 CISA 之類的獨立事件通報；其他媒體看似都轉載 Check Point（只讀 snippet）。它證明「有人討論拿它打」，不證明「它真的有效或被大規模使用」。
4. **反證／平衡**：HexStrike 的 README 在 Legal 區明列禁止未授權測試；Check Point 本身也說該工具「was designed to be a defender-oriented framework」。濫用是否算工具責任、或只是雙用途工具的通病，是判斷題。
5. **Strix 的 benchmark 互相矛盾**（見 §6）。Escape 與 Ethiack 皆為競爭產品廠商，Wavect 自述為服務商；沒有完全中立的第三方。Strix 的 96% 在 XBOW 型 CTF 題目上取得，不能外推到真實應用。
6. **S11（Medium）只讀到 2.1 節**，兩個漏洞的完整 PoC 與修補建議未讀；測試版本是 0.4.0，當前版本是 v1.7.0，這份弱點是否仍存在我無法確認。維護者的回應是研究者轉述。
7. **S12（North Denver Tribune）可信度低**：同文轉載於多個網站，且稱「Nobody has published a detection rate」與已讀的 S7/S8/S9 矛盾；僅用於「agent 架構與 repo 實際內容」這類可被原始碼驗證的描述，且標為第三方、未經我獨立核對 `strix/agents/factory.py`。
8. **PyRIT 論文（S20）只讀摘要**；PyRIT 的 Microsoft Tech Community 文章與 aisecbench / qaskills 等都只看到搜尋 snippet，只能當輔助，不構成結論依據。
9. **DailyCVE 頁面（S30）已判不可信**，內容把 CVE-2021-44228 與 HexStrike 拼在一起，且版本號與 repo 不符；不要把它當作 HexStrike 有 CVE 的證據。
10. **Reddit netsec（S13）讀不到**，見下 §11。

## 11. 讀不到項目的處理

- ⚪ **HexStrike 的獨立 benchmark／誤報率**：確認在有限搜尋下無公開資料。試過：S22（README，僅作者自述數字）、Groundlane web_search 三組 HexStrike 關鍵字（濫用、命令注入、issues），皆只回傳濫用報導與漏洞 issue；GitHub issues 搜尋走 api.github.com 的 `search/issues` 因結果過大（107KB）轉存檔，且我後續解析失敗（JSON 被截斷），未再重試。
- ⚪ **HackAgent judge 自身誤判率**：試過 S31、S34（concepts、how-a-run-works）、S35 摘要；未找到數字，未讀 arXiv PDF 與 judges 頁（https://docs.hackagent.dev/concepts/judges），後續可補讀。
- ✅已關閉（有結論）：repo 歸屬、授權、star、版本、PyRIT 官方性。
- ✉️ **只能問人**：
  1. 使用者給的 Strix 連結到底是 `github.com/usestrix/strix` 還是別的頁面（我只看到名稱，沒看到原連結）。
  2. HexStrike issue #224 為何被關閉：留言 0 筆、無修補 commit，只有 repo 擁有者或提報者能回答。
  3. Strix 對 Furqan Khan 回報的正式立場：只有研究者轉述，需向 Strix 團隊詢問。
- ⚠️ **Reddit r/netsec「RCE in Strix Agent(Sandbox)」**：標記為 blocked（試過：Groundlane web_fetch → 回傳 JS 驗證頁「Prove your humanity」；jina read_url → 「blocked by network security」；Exa web_fetch_exa → SOURCE_NOT_AVAILABLE；firecrawl_scrape → 帳號 credits 用完；Tavily、linkup 未試）。因此只引用其標題與搜尋 snippet，不作為任何結論的依據。

