# F 層補充深讀：garak／promptfoo／Tencent AI-Infra-Guard／Shannon

研究日：2026-10-22。唯讀：沒有安裝、執行任何工具，沒有對任何目標掃描。下載內容視為不受信任資料，只讀不跑。
標記：【自述】作者／廠商自己說的；【第三方】獨立或半獨立來源；【推論】我的判斷。

## 0. 降級紀錄與讀取方式

- GitHub MCP 未使用（先前已知被限制）。raw README/SECURITY/docs 用 Bash `curl` 下載到 `scratchpad/dlF/`（只讀，未執行），再用 Read 逐行讀；GitHub API、arXiv、網頁用 Groundlane `web_fetch`。這與指示「用 Groundlane 讀 raw」略有出入，原因是 curl 能取得精確位元組數，方便記錄讀取區間。
- `curl` 打 arxiv.org 被代理擋（403 connect_rejected，host 不在白名單），改走 Groundlane，成功。
- Groundlane 失敗：vulners.com（browser-challenge 無法通過）；radar.offseq.com 某 CVE 頁（404）；Doyensec PDF（OUTPUT_LIMIT，位元組超限）。
- Doyensec PDF 改用 jina `read_url`：回傳全文（59KB，但「question 模式需要 API key，已回傳全文」），我只用 python 關鍵字抓了「Limitations of the Study」等段，沒有逐頁讀完，標 partial。
- Groundlane `web_search` 的 tavily／exa／brave 偶爾 unavailable，由 you／brave／keenable 補上。
- 未用 add_repo／git clone：README、文件、API 已足夠，沒有逐行讀原始碼。因此本報告所有「機制」描述來自 README／文件／論文，不是原始碼驗證。
- 未走到的工具：mcp__cloudflare、mcp__linkup（Groundlane 與 curl 都成功，無需降級）。

## 1. 來源表與讀取程度

| # | 來源 | 網址 | 讀取程度 |
|---|---|---|---|
| G1 | garak README | https://raw.githubusercontent.com/NVIDIA/garak/main/README.md | 全文（20,146 B，329 行） |
| G2 | garak FAQ | https://raw.githubusercontent.com/NVIDIA/garak/main/FAQ.md | 全文（12,045 B，158 行） |
| G3 | garak SECURITY.md | .../NVIDIA/garak/main/SECURITY.md | 全文（1,705 B） |
| G4 | garak repo API | https://api.github.com/repos/NVIDIA/garak | 全文（6,019 B） |
| G5 | garak releases API | .../releases?per_page=5 | partial：前 12,000 字（共 40,059 B），讀到 v0.17.1 全文與 v0.17.0 大半 |
| G6 | garak 論文 arXiv 2406.11036 | https://arxiv.org/abs/2406.11036 、/html/2406.11036v1 | 摘要頁全文；HTML 全文 78,305 字，讀第 63–162 行（摘要、緒論、背景、框架）與 240–346 行（Detectors、Buffs、Reporting、Attack Generation、Discussion、Limitations、Ethics、Conclusion）；跳過 162–240（逐項 probe 說明）與附錄 A–D |
| G7 | garak GitHub Security Advisories 頁 | https://github.com/NVIDIA/garak/security/advisories | 全文：「There aren't any published security advisories」 |
| G8 | garak 議題搜尋（PR #2234、issue #2226） | api.github.com/search/issues?q=repo:NVIDIA/garak+... | partial：前 3 筆（共 59 筆命中） |
| G9 | aisecreviews 評測 | https://aisecreviews.com/posts/garak-llm-scanner-review/ | 全文（47,959 B） |
| G10 | Fujitsu Research 比較論文 arXiv 2410.16527v2 | https://arxiv.org/html/2410.16527v2 | 77,785 字；讀摘要、緒論、V 節開頭（254–313）、VI 節全文（514–572）、VII 節全文（573–598）、Table III 數字抽取；跳過 II–IV 與附錄 |
| P1 | promptfoo README | raw .../promptfoo/promptfoo/main/README.md | 全文（4,596 B） |
| P2 | promptfoo SECURITY.md | raw .../promptfoo/main/SECURITY.md | 全文（43,427 B，320 行，分兩次讀完） |
| P3 | promptfoo repo API／releases | api.github.com/repos/promptfoo/promptfoo 、/releases?per_page=3 | repo 全文；releases partial（第一筆 0.124.1 前段） |
| P4 | OpenAI 公告 | https://openai.com/index/openai-to-acquire-promptfoo/ | 全文（內文完整，含頁尾導覽） |
| P5 | Promptfoo 公司公告 | https://www.promptfoo.dev/blog/promptfoo-joining-openai/ | 全文（28,300 B） |
| P6 | promptfoo 紅隊總覽文件 | https://www.promptfoo.dev/docs/red-team/ | partial：前 20,000 字（共 71,227 B），到「Generation of Unwanted…」前 |
| P7 | promptfoo False Positives 文件 | .../red-team/troubleshooting/false-positives/ | 全文 |
| P8 | promptfoo Data handling 文件 | .../red-team/troubleshooting/data-handling/ | 全文（article 抽取） |
| P9 | promptfoo GH Security Advisories 頁 | https://github.com/promptfoo/promptfoo/security/advisories | 全文：無已發布 advisory |
| P10 | 站內既有文章 | /home/user/quidproquo/src/content/posts/ai/2026-08-22-promptfoo-llm-evaluation.md | 全文（133 行） |
| P11 | 第三方：搜尋摘要（CNBC、TNW、GIGAZINE、Repello、Giskard、genai.qa 等） | 見 §6 | 僅搜尋摘要 snippet，未點開 |
| A1 | AI-Infra-Guard README | raw .../Tencent/AI-Infra-Guard/main/README.md | 54,771 B／1,067 行：第 1–560 行逐行讀；第 560–1067 行去掉 HTML 貢獻者表格後讀（含社群、引用、研究、授權），被濾掉的只有頭像表格 |
| A2 | AI-Infra-Guard SECURITY.md | raw .../main/SECURITY.md | 全文（8,101 B） |
| A3 | AI-Infra-Guard CHANGELOG.md | raw .../main/CHANGELOG.md | partial：下載 46,750 B，讀前 ~6,000 B（v4.6.3–v4.6.7）+ 關鍵字行 |
| A4 | repo API／releases | api.github.com/repos/Tencent/AI-Infra-Guard 、releases | repo 全文；releases 前 1 筆 partial；v4.5.2 release 全文 |
| A5 | 技術報告 arXiv 2606.31227 | https://arxiv.org/html/2606.31227v1 | 抓取上限 100,000 字（原 408 KB HTML）；讀 §1 全文、§5.4–§6.9、§7.5–§7.6、§8（用 selector 取得全節）、§9 全節、§11 全節；未讀 §2–§4、§5.1–5.3、§7.1–7.4、§10、§12、附錄 |
| A6 | CVE-2026-101080（OSV）、CVE-2026-5585（cyberstrike.io） | https://osv.dev/vulnerability/CVE-2026-101080 等 | OSV partial（20,903 B 取前段）；cyberstrike partial |
| A7 | Help Net Security 報導 | https://www.helpnetsecurity.com/2026/09/09/ai-infra-guard-open-source-security-scanner-ai-systems/ | 全文（article 抽取） |
| A8 | 其他：搜尋摘要（qingkeai、techjack、augmentcode） | 見 §6 | 僅 snippet |
| S1 | Shannon README | raw .../KeygraphHQ/shannon/main/README.md | 全文（26,590 B，404 行） |
| S2 | Shannon docs/safety.md | raw .../main/docs/safety.md | 全文（2,463 B） |
| S3 | Shannon docs/configuration.md | raw .../main/docs/configuration.md | 全文（7,083 B） |
| S4 | Shannon docs/coverage-roadmap.md | raw .../main/docs/coverage-roadmap.md | 全文（1,057 B） |
| S5 | Shannon docs/shannon-xbow-aikido-benchmark.md | raw .../main/docs/shannon-xbow-aikido-benchmark.md | 全文（11,542 B） |
| S6 | Shannon repo API／releases／contents | api.github.com/repos/KeygraphHQ/shannon... | repo 全文；releases partial（v3.4.0 全、v3.3.0 截斷）；contents 只用來確認目錄 |
| S7 | CVE-2026-29023 GHSA-qrvr-jqxg-65rv | https://api.github.com/advisories/GHSA-qrvr-jqxg-65rv | 全文（2,215 B）；網頁版 GHSA 頁只抓到 CVSS 說明樣板 |
| S8 | Escape.tech 基準 | https://escape.tech/blog/benchmarking-agentic-ai-pentesting-tools/ | 全文（101,696 B，含頁尾） |
| S9 | Doyensec 研究 PDF | https://doyensec.com/resources/ComparingAIApplicationSecurityTestingPlatforms_Doyensec.pdf | partial：只用關鍵字讀 Limitations 段，沒讀完整份 |
| S10 | 搜尋摘要（96.15% XBOW 宣稱、agentconn、aiagentslist 等） | 見 §6 | 僅 snippet |
| X1 | 母群盤點、先前 layer4 研究 | scratchpad/population-scan.md；.research/.../layer4-red-team.md | 讀 F 層表、C.3 表、偏誤節；layer4 讀 Strix／比較節 |

## 2. 事實表

### 2.1 基本資料（2026-10-22 查，GitHub API）

| 項目 | garak | promptfoo | AI-Infra-Guard | Shannon | （對照）Strix |
|---|---|---|---|---|---|
| 組織 | NVIDIA（Organization） | promptfoo（Organization；公司被 OpenAI 收購中／已併入，見 §5） | Tencent（Organization）；團隊 Tencent Zhuque Lab | KeygraphHQ（Organization，公司 Keygraph） | usestrix |
| 授權 | Apache-2.0 | MIT | Apache-2.0＋README 加註署名要求（見 §4.5） | AGPL-3.0（另售商業授權） | Apache-2.0 |
| Stars | 9,636 | 26,252 | 6,933 | 49,197 | 70,804 |
| Forks | 1,392（14.4%） | 2,534（9.7%） | 670（9.7%） | 5,632（11.4%） | 7,850（11.1%） |
| Open issues（含 PR） | 505 | 826 | 22 | 26 | 494 |
| 建立日 | 2023-05-10 | 2023-04-28 | 2024-12-25 | 2025-09-27 | 2025-08-05 |
| 最後 push | 2026-10-21 | 2026-10-22 | 2026-10-22 | 2026-10-15 | 2026-10-22 |
| 最新版 | v0.17.1（2026-10-16；前一版 v0.17.0 2026-09-09） | 0.124.1（2026-10-08） | v4.6.7（2026-10-22；v4.6.2→4.6.7 約每週一版） | v3.4.0（2026-10-06） | v1.7.0（2026-10-05） |
| 語言 | Python | TypeScript | Python＋Go（DeepWiki 摘要稱 Go 協調層＋Python 掃描引擎，屬第三方） | TypeScript | — |
| 外部貢獻 | 開放，v0.17.1 列 13 位新貢獻者 | 開放（有 contributing guide） | 開放，release 列多位外部貢獻者 | 不接受外部程式碼貢獻，只收 issue（S1） | — |

星與 fork 比：四者 fork 比 9.7%–14.4%，落在一般開源專案常見區間，沒有明顯灌水特徵 [推論；我沒有逐一查 stargazer 時間分布，也沒有比對基準線資料]。Shannon 49k★ 建立僅 390 天，與 Strix 同為「話題型」暴增；前一輪已指出星數不等於成熟度。

### 2.2 它們是什麼、打什麼

| 工具 | 一句話定位 | 原文 | 測試對象 | 機制 |
|---|---|---|---|---|
| garak | 對 LLM／對話系統做「漏洞掃描」（nmap／Metasploit 類比） | 「garak checks if an LLM can be made to fail in a way we don't want. garak probes for hallucination, data leakage, prompt injection, misinformation, toxicity generation, jailbreaks」「If you know nmap or msf…, garak does somewhat similar things to them, but for LLMs」（G1） | LLM 模型與對話端點（HF、OpenAI、Bedrock、NIM、REST 等）；不是傳統 web app | probe（送 prompt）→ generator（目標）→ detector（判定）→ evaluator；另有 buffs（改寫 prompt）；多數 probe 靜態，也有 assembled／dynamic／reactive（atkgen、tap、suffix）（G1、G2、G6） |
| promptfoo | LLM eval＋紅隊 CLI／library | 「a CLI and library for evaluating and red-teaming LLM-based apps」（P1） | 你設定的 prompt／provider／RAG／agent／HTTP endpoint；另有 code scanning 與 model file 掃描（ModelAudit，公司公告頁導覽列可見，P5） | YAML 設定；紅隊以 plugins（風險類型）＋strategies（攻擊包裝）產生攻擊，grader 模型（預設 gpt-5，P7）判 pass／fail |
| AI-Infra-Guard（A.I.G） | 「全端」AI 紅隊平台 | 「integrates capabilities such as ClawScan, Agent Scan, AI infra vulnerability scan, MCP Server & Agent Skills scan, and Jailbreak Evaluation」（A1） | 五類：①AI 基礎設施服務（Ollama、vLLM、ComfyUI、n8n 等，連到執行中服務做指紋＋CVE 比對）②MCP server＋Agent Skills（原始碼或 URL，靜態＋動態）③部署中的 agent（Dify、Coze、HTTP、WebSocket，對話式黑箱）④LLM 越獄評測⑤Model/API relay 檢查（A1） | ①確定性規則：「over 100 AI framework components … more than 2000 known CVE」（A1）；②LLM agentic harness，「Prompt-as-Rule」；③多輪對話攻擊＋canary token；④攻擊運算子＋LLM 判官（A5） |
| Shannon | 對 web app／API 的自主 AI 滲透測試 | 「autonomous AI pentester for web applications and APIs … analyzes your source code, identifies attack paths, and executes real exploits … No exploit, no report」（S1） | 傳統 web app 與 API；需要原始碼（開源版「against an application whose source code you have」）；黑箱需買 Pro／Enterprise（S1 Editions） | 原始碼分析＋動態偵察→漏洞候選→合併去重→利用代理實際打→驗證不了就丟→PDF／MD／JSON／SARIF 報告；固定五類：Injection、XSS、SSRF、Auth、Authz（S1、S3） |

核對題目指定項目：AIG 做哪些——Agent Scan、Skills Scan、MCP scan、AI Infra scan、越獄評測全部屬實（A1 表格；A5 §5–§9 技術報告逐層描述），另加 ClawScan（OpenClaw）與 Model/API Relay Checker（A1）。**歸屬**：README 明寫「This project is led and developed by Tencent Zhuque Lab, part of the Tencent Security Platform Department. Founded in 2019」（A1 About the Team），技術報告署名「Tencent Zhuque Lab」（A5），repo 在 `Tencent` 組織下，SECURITY.md 稱「Security reports are handled by the Tencent Zhuque Lab team」（A2）。所以「騰訊朱雀實驗室」的歸屬有一手證據，盤點中「依 description 判斷」的保留可以解除。

### 2.3 授權與範圍控制設計

| 工具 | 授權／濫用聲明（原文） | 程式層範圍控制 | 評語 |
|---|---|---|---|
| garak | 論文：「garak, like Metasploit, is a tool that can have an impact on production systems and should thus, be used only with proper authorization」（G6 §8）。README／FAQ 未見授權使用警語（G1、G2 全文已讀） | 目標由 `--target_type/--target_name` 指定；預設「runs all the probes」（G1）；無網路範圍清單。攻擊面只限送文字給你指定的模型端點 | 範圍天然受限（只對你給的 endpoint 說話），但沒有「確認你有授權」的流程控制；風險是成本（`--probes all` 可能數小時～數天，G9）與對第三方 API 的條款問題 [推論] |
| promptfoo | 紅隊文件與公司文件未見「僅限授權目標」的強制條款；safe harbor 條款只適用於研究 promptfoo 自己（P2：「Limit testing to Promptfoo-owned assets, or systems … you own or are explicitly authorized」）。既有站內文章寫「不能在未獲授權的第三方目標上進行測試」是文章作者的建議 | 目標由 config 指定；提供 `purpose` 讓攻擊生成與 grader 有脈絡（P7）；有「consent tracking for harmful plugins」的網域 api.promptfoo.dev（P8） | 無程式強制的範圍白名單；有同意追蹤。需注意：部分 plugin 為 remote-only（P8），攻擊生成在 Promptfoo 伺服器（見 §4） |
| AIG | README 全文**找不到**「僅限授權使用」類聲明（我 grep 了 authoriz／disclaimer／legal／permission／consent，只命中分類表與研究段落）；唯一的限制是部署：「positioned as an AI red teaming platform for internal use … currently lacks an authentication mechanism and should not be deployed on public networks」（A1） | AI Infra Scan 接受 CIDR 與 IP 範圍（`192.168.1.0/24`、`10.0.0.1-10.0.0.20`，A1）；Agent Scan 並行上限＋「at most one light probe」能力感知＋stop rule（A5 §8.3–8.4）；MCP dynamic 模式 2026-08 才加工具白名單防 RCE（A4 v4.5.2） | 範圍控制偏「成本與速率」而非「授權邊界」；單操作者、無登入；SECURITY.md 明講「AIG has no multi-user system」，WebUI 預設綁 127.0.0.1:8088（A2）。README 與 SECURITY.md 對預設綁定的描述不完全一致：README 說 Docker 啟動後可在 `http://localhost:8088` 存取，SECURITY.md 說 Docker 模式「exposes port 8088. Use firewall rules…」，需自行加防護（A1、A2） |
| Shannon | 最明確：「Run it only against applications and environments you own or have explicit written authorization to test. Do not run Shannon against production systems」（S1 WARNING）；「Unauthorized scanning … is illegal. Keygraph is not responsible for misuse」（S2） | 設定檔 `rules.avoid / rules.focus`（url_path、subdomain、domain、method、header、parameter、code_path）＋自由文字 `rules_of_engagement`（例：速率上限 5 req/s、不得暴力破解）（S3）；`--validate-auth` 只驗證登入就停；repo 以唯讀掛載進一次性容器（S1） | 結構化 scope 是四者最完整的；但 avoid／focus 仍是給 LLM 的指令，不是網路層強制 [推論：文件沒描述 egress 過濾；Escape 文章說 Shannon 的 YAML 層「gives practitioners fine-grained control over what the agent explores」，屬指引不是封鎖，S8]。承認會「create users, submit forms, mutate application state」（S1） |

### 2.4 對照先前四個工具的範圍控制（來自 layer4 研究）

Strix：軟性，排除項寫在自然語言 `--instruction`；HexStrike：幾乎沒有（`if not self.scope: return True`）；PyRIT：由 endpoint 決定；HackAgent：流程要求。→ 結論：這一批新工具同樣沒有一個做到「程式強制的授權閘門」；Shannon 的結構化規則最接近，garak／PyRIT／promptfoo 靠「只對你給的模型說話」天然受限，AIG 因為包含網段掃描而風險面最像傳統掃描器。

## 3. 自述 benchmark 與第三方評測（區分）

| 工具 | 自述 | 第三方／獨立 | 判讀 |
|---|---|---|---|
| garak | FAQ：「Do these results have scientific validity? No. The scores from any probe don't operate on any kind of normalised scale…」；「garak isn't a benchmark」；建議不要依賴超過六個月的分數；以 bag of SOTA 模型校準出 Z-score（G2）。論文：「It would be pointless to attempt to treat garak results as a benchmark」（G6 §6） | Fujitsu Research（arXiv 2410.16527v2，測 garak v0.9.0.14.post1，4 個目標模型，人工標註逾千筆回應）：garak「attacks are of the highest quality」「most extensive variety」，但「Garak shows a maximum MOE of 26%, corresponding to a 37% error rate in detecting successful attacks」；靜態 evaluator 例：回應含「unethical」就被判成有效（G10）。aisecreviews（編輯部評論，無原創實測，自稱「drawn from garak's own repository and documentation」）：命中≠已確認漏洞，關鍵字 detector 會誤判拒絕語句（G9） | 作者自己承認不是 benchmark；獨立研究證實 detector 誤差大，但版本是 2024 年的 v0.9，現在是 v0.17，detector 已修很多（v0.17.1 release 光是 detector 修正就列 6 條，G5），**舊論文數字不能直接套到今天** |
| promptfoo | 「Powers LLM apps serving 10M+ users」「Battle-tested」（P1，無出處）；公司公告：35 萬開發者、13 萬月活、>25% Fortune 500（P5）；repo description「Used by OpenAI and Anthropic」（P3，無出處）。OpenAI 公告只重述「trusted by over 25 percent of Fortune 500」（P4）。無自述偵測率 benchmark | 沒找到獨立的 red team 準確度評測。TNW 報導寫「125,000 developers and 30-plus Fortune 500」（搜尋摘要）與公司數字不一致；Reddit 貼文稱成交價 $86M（無來源，可信度低，不採用） | 規模數字全是公司自報；grader 準確度依賴使用者寫的 `purpose`，官方文件直說「the quality of your configuration directly determines the accuracy of your grading results」（P7）＝把誤報責任部分轉給使用者 |
| AIG | SkillTrustBench：5,520 筆評測案例取自 62,652 個 skill；同一個 skill scanner 搭不同模型，Claude Opus 4.6 loose F1 0.9848（Precision 0.9725／Recall 0.9974／FPR 0.0663），Gemini 3.5 Flash FPR 0.0120，GPT 5.5 FPR 0.1867（A1、A5 Table 3） | Help Net Security（記者訪談團隊）：「False positive rates there run from 1.20 percent to 18.67 percent, depending on which model does the judging」；團隊自承 prompt injection 防護「it's a mitigation, not a formal guarantee」（A7）。techjack 摘要提出「是否有獨立驗證」的疑問（snippet） | **基準與工具同源**：SkillTrustBench 由 Zhuque Lab 與香港中文大學（深圳）發布（資料集在 `cuhk-zhuque`），排行榜只跑 AIG 自己的 scanner，用「loose F1」（非標準 F1）；Tencent 自家模型 Hy3 Preview 也在榜上（A5）。因此這是自述且非獨立。技術報告對確定性層另聲稱「near-zero false positives on encoded signatures」，但同報告承認 87 條規則無版本條件、「favors recall」，會以 inferred 層級回報（A5 §5.4–5.6）——零誤報是對「已驗證層」說的，不是整體 [推論] |
| Shannon | 現行 README 無偵測率數字；自家 Photoview 比較：Opus 5 報 24 筆、23 TP、1 FP，成本 $115；DeepSeek v4 Flash 18/18 TP，$6.10；對照 Doyensec 研究中 Aikido 32、XBOW 7，各 $4,000（S5）。舊版宣稱「96.15%（100/104）hint-free、source-aware XBOW benchmark」只在搜尋摘要與二手文章、fork 描述中看到（S10），現行 README 已無此句 | **Escape.tech**（競品廠商，單次執行、DeepSeek v3.2、灰箱、目標 Duck Store 20 個漏洞）：Shannon 6/20（30%）、6 小時、**FP rate 25%**；Strix 1/20；PentAGI 9/20；Escape 自家 15/20；Shannon 沒找到另三個工具都找到的 SQL injection（S8）。Doyensec 研究：由 Aikido 贊助（此點來自 Keygraph 文件「an Aikido-sponsored study」，S5），人工驗證每筆發現；我只讀到其 Limitations 段（僅 2 個應用、單一設定，S9） | Keygraph 的比較是**自己跑 Shannon**、拿別人研究裡「別的工具」的數字並排，並非同一輪、同一條件（文件自己說「These aren't like-for-like scanner runtimes」）；Photoview 只是 1 個應用；且有後見偏誤風險（他們選擇有後續修補紀錄的版本當部分 ground truth，召回只對 7 個已修漏洞）。Escape 與 Keygraph 結果差很大（30% vs. Photoview 上 18 個 TP），差異來源包括模型、目標、是否商業邏輯，無法判斷誰對 [推論] |

## 4. 工具自身的安全問題與濫用事件

### 4.1 Shannon（有已公開 CVE）
- **CVE-2026-29023／GHSA-qrvr-jqxg-65rv**（2026-03-09 公開，CWE-798，CVSS 3.1 7.3，GitHub 標 medium，未經 GitHub 審核）：router 設定內建硬編碼 API key，router 元件啟用且暴露時，網路攻擊者可借用受害者設定的上游模型憑證；已由 commit 023cc95 緩解（S7，描述文字轉自 NVD／VulnCheck，我沒有讀 VulnCheck 原頁）。
- 自述的 prompt injection 風險：「Do not point Shannon at untrusted or adversarial codebases. AI-powered tools that read source code can be influenced by malicious repository content」（S1、S2）。
- 第三方資料裡沒找到針對 Shannon 的 prompt injection 實測利用報告 [搜尋範圍有限]。先前對 Strix 有 Medium 研究與 r/netsec 貼文（layer4），Shannon 沒有同類公開報告，不代表沒有。
- 模型供應商限制：README 要求先完成 Anthropic／OpenAI 的 cyber 驗證計畫，否則掃描會被中途打斷（S1）——這是濫用防護由模型廠商而非工具提供的實例。

### 4.2 AI-Infra-Guard（有已公開 CVE，並有「針對測試者的 prompt injection」自述修補）
- **CVE-2026-5585**（4.0，Task Detail Endpoint `common/websocket/task_manager.go`，資訊洩漏，CVSS 3.1 5.3 MEDIUM，2026-04-05 公布，無需認證可遠端觸發）——來源 cyberstrike.io／vulners 搜尋摘要，partial（A6）。
- **CVE-2026-101080**（up to 4.5.2／4.6.2，`skill_scan/tools/dir/dir_actions.py` 的 `startsWith` 路徑穿越，CWE-22，本機攻擊，CVSS v4 0.9 Low；VulDB 指派；4.6.0 修補，commit ac0384ed）（A6，OSV）。諷刺點：技術報告 §6.3 特別稱讚 `read_file` 的「path sandbox … is not incidental hygiene but a security boundary」，而這個 CVE 正是掃描器自己的路徑邊界檢查失敗 [推論：兩者不是同一個函式，不能說報告說謊，只能說這類邊界確實難做對]。
- **無認證設計**：「AIG has no user accounts, no login/authentication for the WebUI」；Help Net Security 標題直接寫「the open-source build ships with no login layer at all」；團隊建議外加 nginx Basic Auth 或 IP 白名單（A2、A7）。掃描器保存所有被評測模型的 API key，被連到就等於交出金鑰（A7 原文）。
- **針對測試者的 prompt injection**：技術報告 §6.7 把「the scanner as a target」列為一級威脅；v4.1.9 加固，v4.5.2 修「Prevent RCE via prompt injection in dynamic scan mode」（改用工具白名單）、「Prevent charset content smuggling」、「Stop hiding compiled bytecode from audit surface」（A4、A5、A7）。這是**廠商自己承認曾存在**的「攻擊者控制的 MCP server 經 prompt injection 在掃描主機上 RCE」類問題；SECURITY.md 又把「Prompt-injection-only chains … out of scope unless it crosses an OS/network/filesystem boundary」列為預期行為（A2）。
- SECURITY.md 規定：維護者 5 個工作天內確認；Critical／High 14 天內處理（A2）。

### 4.3 garak
- GitHub 無已發布 advisory（G7）；搜尋沒找到 garak 本身的 CVE（搜到的 NVIDIA CVE 都是 Container Toolkit 等其他產品，已排除）。這是「沒找到」，不是「不存在」。
- 設計層風險：PR #2234 描述指出 `buffs.paraphrase.Fast` 依賴外部 `transformers-community/group-beam-search` 並使用 `trust_remote_code`（該 PR 為外部貢獻者，仍 open，G8；屬第三方對現況的描述，我未讀原始碼驗證）。若屬實，跑這個 buff 會執行從 Hugging Face 拉下來的程式碼。
- 資源風險：FAQ 估計相依套件約 9GB、單次記錄可達 60MB（G2）；`--probes all` 可能數小時到數天（G9）。
- 另一個可靠性問題（非安全）：issue #2226 稱 transformers 5.x 下 `hf_args` 的 `torch_dtype`、`quantization_config` 被無聲丟棄，量化模型無法掃（G8，使用者回報，未驗證）。
- 目標端風險：atkgen 會誘導毒性內容；論文：「Cohere's API rejected the high level of toxicity in the prompts generated by atkgen」（G6 §5）——對商用 API 可能觸發帳號政策 [推論]。

### 4.4 promptfoo
- GitHub 無已發布 advisory（P9）；issue 搜尋 `GHSA`／`CVE-` 命中 0 筆（P3 後續搜尋）。
- 官方安全模型很直白：「Promptfoo OSS is a local eval runner, not a sandbox for adversarial eval content」；自訂 assertion、provider、transform、hook 以使用者權限執行，不沙箱（P2）。**對抗性模型輸出流入 grader 模板、`storeOutputAs` 回饋迴圈、`_conversation` 歷史**都被列為「out of scope／預期行為」，也「generally do not request a CVE」（P2）。意思是：被測的模型或內容可能影響 grader 這種「對測試者的注入」，官方立場是「用隔離環境跑」，不視為漏洞。
- 資料流：沒有自備 API key 時，生成與評分走 `api.promptfoo.app`，並可能含 `purpose`、使用者 email、target 回應等；`redteam poison` 一律走託管；harmful、bola、ssrf、indirect-prompt-injection 等 plugin 是 remote-only（P8）。→ README 「LLM evals run 100% locally - your prompts never leave your machine」只對一般 eval 成立，對紅隊不成立（P1 vs. P8）；站內文章已正確處理這點。
- 本機 web UI／MCP server 無認證，設計為單人開發工具（P2）。

### 4.5 授權條款補充（AIG）
README 在 Apache-2.0 之外加了署名要求（整合核心程式碼須在文件／About 頁聲明；「Repackaging this project as an original product without disclosing its origin is strictly prohibited」）（A1）。Apache-2.0 本身已有 NOTICE 要求，額外的產品文件聲明義務是否與 Apache-2.0 相容，我沒有法律判斷，只標記需要採用者自行檢視 [推論]。

## 5. 核對：「promptfoo 被 OpenAI 收購」的一手出處

| 說法 | 一手證據 | 結論 |
|---|---|---|
| OpenAI 宣布收購 | OpenAI 官方公告，2026-03-09：「We're acquiring Promptfoo」「Once the acquisition is finalized we will integrate Promptfoo's technology directly into OpenAI Frontier」「The closing of the acquisition is subject to customary closing conditions」（P4）。Promptfoo 公司公告同日：「Promptfoo has agreed to be acquired by OpenAI」「Promptfoo will remain open source」（P5） | **屬實**，但措辭是「同意收購／交易待成交」，不是「已完成」 |
| 已完成併入 | repo README 現行文字：「Promptfoo is now part of OpenAI. Promptfoo remains open source and MIT licensed」（P1）；docs 橫幅同句，最早見於 commit 時間 2026-04-25 的搜尋摘要；npm 頁面 2026-07 起顯示同句（搜尋摘要）。**我沒有找到 OpenAI 或 Promptfoo 發表「交易已成交」的獨立公告**，也沒有找到成交價（OpenAI 與 Promptfoo 公告都沒寫；TNW 與 GIGAZINE 說「terms not disclosed」）。Reddit 的「$86M」無來源 | 「已併入」的證據是 Promptfoo 自己的 README／橫幅措辭，屬自述；是否法律上已成交，**未驗證** |
| 其他疑點 | Giskard 比較頁（2026-08）寫「OpenAI acquired Promptfoo in 2025」（搜尋摘要），與一手日期 2026-03 矛盾，屬第三方筆誤；公司公告寫「We founded Promptfoo in 2024」，但 repo 建立於 2023-04-28（P3、P5），可能是公司設立與 repo 建立的差異 [推論]；data-handling 文件現在提到 Codex／ChatGPT 登入可替代 API key、預設 grader 為 gpt-5（P7、P8），與 OpenAI 擁有的關係一致但屬 [推論] | 注意第三方文章品質不一 |

與站內既有文章（P10）的一致性：文章寫「2026 年 3 月，OpenAI 宣布同意收購 Promptfoo，交易完成仍待一般成交條件；雙方承諾繼續維護開放原始碼」——與一手公告**一致**。「35 萬名開發者、每月 13 萬名活躍使用者、超過四分之一 Fortune 500」對得上 P5；「OpenAI 公告只直接重述最後一項」也正確（P4）。文章寫 MIT 授權正確（P3）。沒有發現矛盾。**可更新處**：文章寫成「交易完成仍待」，但 README 與橫幅自 2026-04 起已寫「is now part of OpenAI」；建議在更新紀錄補一句「截至 2026-10-22，README 已改稱『已成為 OpenAI 的一部分』，但我未找到成交公告」，並補上「廠商中立性」的疑慮（Repello、Giskard、genai.qa 與 Reddit 討論皆提出「被測的模型廠商擁有測試工具」的利益衝突，屬第三方競品與社群意見；該疑慮是推論性質，官方承諾「support a diverse range of providers」）。本任務不修改文章，僅列為待辦（Tier 0 可做，但需 post-update skill 與核對）。

## 6. 比較表：與先前四個工具的定位差異

軸線：「測 AI 系統」（被測物是 AI）vs.「用 AI 測別人」（AI 是攻擊者，被測物是傳統軟體）。

| 工具 | 被測物 | AI 的角色 | 軸線位置 | 授權／範圍 | 判官／證據 | 星數 |
|---|---|---|---|---|---|---|
| garak | LLM／對話端點 | 被測物；攻擊靠靜態 probe，少量用小型攻擊模型（atkgen） | 純「測 AI」 | 論文要求授權；無程式閘門 | 關鍵字＋小型分類器；FAQ 自稱無科學效度 | 9.6k |
| promptfoo | LLM app／RAG／agent（含 HTTP endpoint） | 被測物；攻擊生成與 grader 用 LLM | 「測 AI」為主，附 code scanning（掃 PR 的 LLM 風險）與 model file 掃描 | 無強制；部分託管生成 | LLM grader（預設 gpt-5），準確度依 `purpose` | 26.3k |
| PyRIT（先前） | 生成式 AI 系統 | 被測物，攻擊者可為 LLM | 「測 AI」 | 由 endpoint 決定 | scorer（LLM／規則） | 4.7k |
| HackAgent（先前） | AI model／agent | 被測物 | 「測 AI」，較靠近 agent | campaign YAML | judge 模型 | 528 |
| AI-Infra-Guard | **混合**：AI 基礎設施（傳統網路服務指紋）、MCP／skill 原始碼、部署中的 agent、LLM 本身 | 部分層是規則（無 LLM）；MCP／skill／agent 層 LLM 是審計者；越獄層 LLM 是攻擊者與判官 | 橫跨：4 層裡 3 層偏「用 AI 審 AI 的周邊（供應鏈）」，第 4 層測 AI 本身；基礎設施層其實是傳統漏洞掃描（打 AI 元件這個傳統軟體） | 單操作者、無登入；範圍控制偏成本 | 分層證據（verified／version-based／inferred）＋canary token＋LLM 判官 | 6.9k |
| Strix（先前） | 一般 app（web、API、repo、IP） | 攻擊者 | 純「用 AI 測別人」 | 軟性 | PoC；自家 XBOW 96%；第三方 5%（Escape） | 70.8k |
| Shannon | web app／API，需原始碼 | 攻擊者 | 純「用 AI 測別人」（白箱） | 結構化 avoid／focus＋ROE；明確「勿用於 production」 | 「No exploit, no report」；Escape 實測 FP 25% | 49.2k |
| HexStrike-AI（先前） | 通用資安目標 | 攻擊者（MCP 讓 LLM 驅動 150+ 工具） | 「用 AI 測別人」 | 幾乎無 | — | 13.0k |

### Shannon vs. Strix（題目要求核對）
- 相同：Docker 容器內跑、LLM 驅動、要求實際 PoC 才算發現、同樣自述「不取代人類」。
- 不同：①Shannon **必須有原始碼**（`-r repo`），Strix 可純黑箱（README 目標含 URL、IP）；Shannon 黑箱要買 Pro。②Shannon 範圍固定五類（Injection／XSS／SSRF／Auth／Authz），Strix 自帶較多 skill（含攻擊 AI 的 skill，layer4）。③授權：Shannon AGPL-3.0（需商業授權才能做託管服務），Strix Apache-2.0。④Shannon 結構化 YAML（登入流程、TOTP、avoid／focus）vs. Strix 自由文字 `--instruction`。⑤Shannon 不收外部 PR。⑥自家 benchmark：Shannon 目前只在自家 Photoview 比較文件（1 個應用，成本與數量對比）；Strix 有自家 XBEN 96%（100/104，v0.4.0）。⑦同一份 Escape 評測裡 Shannon 6/20、Strix 1/20，且兩者用同一個模型（DeepSeek v3.2）——Escape 的結論是「evaluate the orchestration layer first」。

## 7. 限制與反證

反證搜尋輪次（至少一輪，實際每工具各一輪以上）：
- garak：搜 limitations／false positives／critique → 找到 Fujitsu 論文（其誤差 37% 的結論是對 garak 的反證，但版本老）、aisecreviews。搜 CVE／pickle／RCE → 無 garak 本身 CVE。
- promptfoo：搜 conflict of interest／independence → 社群與競品（Repello、Giskard、genai.qa）提出利益衝突，**但這些來源多是競品行銷**，不是獨立審計；搜 CVE／GHSA／supply chain → 無。搜 false positives → 只有官方文件。
- AIG：搜誤報／獨立評測（中英文）→ 只有 Help Net Security 有獨立訪談；多數中文文章是轉述 README／技術報告（qingkeai、騰訊新聞等為同源改寫，不算獨立）。搜 CVE → 找到 CVE-2026-5585 與 CVE-2026-101080。
- Shannon：搜 benchmark／XBOW／review → 多為轉述；Escape 評測是唯一有數字的第三方，但它是競品；搜 CVE → 找到 CVE-2026-29023。
- 2024 年後來源：Fujitsu（2024-11）、全部 2026 來源皆滿足。

限制：
1. 沒有讀任何原始碼；「機制」「範圍控制是否程式強制」皆來自文件，標為 [推論] 的地方不可當事實。
2. 沒有找到任何一份對 promptfoo red team 或 AIG 的**獨立定量評測**；AIG 只有 Help Net Security 的訪談式報導。
3. 技術報告（A5）只讀到上限 100,000 字，§2–§4、§10、§12 與附錄未讀。
4. Doyensec PDF 與 CHANGELOG 只局部讀。
5. CVE 資訊多為聚合站（OSV、cyberstrike、搜尋摘要）轉述，沒有直接讀 NVD／VulDB 原頁；CVSS 數字依聚合站。
6. 星數／fork 為單一時間點快照，沒有歷史增長曲線，無法檢驗灌星。
7. Escape.tech 是競品廠商，單次執行；Keygraph、Zhuque Lab、Promptfoo 的 benchmark 都是自己出題自己跑。
8. 站內既有 promptfoo 文章只核對了與本研究相關的事實（收購、授權、使用者數字、資料外送），其他段落沒有逐句事實查核。

## 8. 對母群盤點的修正建議

- AIG：歸屬 Zhuque Lab 已證實；盤點中的「大廠」分類成立。周更版本頻繁（v4.6.2→v4.6.7 約每週一版）、已有 2 個 CVE、無登入設計；「來源 7」屬性是話題與多 topic 命中，不代表品質。
- promptfoo：盤點「授權：未取得」可補 MIT；維護者類型「新創」需改註「2026-03 起 OpenAI 收購案（README 稱已併入，成交未驗證）」。
- Shannon：盤點只有 1 個來源（topic:owasp）但 49k★，屬「話題型」；應補 CVE-2026-29023 與 AGPL。
- 星數／來源數是不同訊號：Shannon 與 Strix 星數高、來源數低；garak／AIG 來源數高、星數中等。選案若以「被多清單提及」為準，garak、promptfoo、AIG 優先；若以「社群話題度」為準，Strix、Shannon 優先。兩者都要有，這也是原樣本偏 agent 型滲透工具的原因。

## 9. 五關自評

1. **來源可信度**：garak、AIG、Shannon、promptfoo 的主要事實皆有一手（README／SECURITY／API／論文／官方公告）；benchmark 與評測一律分自述與第三方；Doyensec／Escape 是半獨立（贊助／競品）。達標，但獨立定量評測偏少。
2. **完整讀取**：多數 README、SECURITY、FAQ、docs 為全文；論文、技術報告、CHANGELOG、Doyensec、release notes 為局部，已逐一標註區間與跳過處。部分達標。
3. **反證**：每個工具至少一輪反證搜尋；找到 CVE（Shannon、AIG）、detector 誤差（garak）、利益衝突（promptfoo）。達標，但 promptfoo 的利益衝突來源多為競品行銷。
4. **推論標註**：原始碼未讀導致的機制與範圍判斷、fork 比合理性、法律相容性皆標 [推論]。達標。
5. **可用性／缺口**：給出 12 項定位對照與站內文章更新建議。缺口：沒有原始碼驗證、沒有 promptfoo 成交公告、CVE 原頁、AIG 技術報告後半與 Doyensec 全文——這些列為後續（若人要拍板「是否採用」才有必要）。部分達標。
