# Research: AI agent / skill / MCP 資安工具生態（系列研究筆記，最終狀態）

研究日：2026-10-22。本檔是整合三輪研究後的最終狀態（第一輪四層、第二輪補查、第三輪母群盤點與缺層深讀），取代 `.research/2026-10-22-agent-security-tooling.md` 中與本檔衝突的說法。原始紀錄在 `sources/`（本輪）與 `.research/2026-10-22-agent-security-tooling/`（前兩輪的 layer1–4、gapA–D）。

標記：【自述】作者或廠商自己說的；【第三方】獨立來源（附利害關係）；【核對】我本人回原文或原始碼核對過；【agent】子 agent 讀原文並回報，我未逐項抽查；[推論] 判斷，依據寫在旁邊。

全程只讀：沒有安裝或執行任何被研究的工具，沒有掃描任何目標。

---

## 1. 母群定義與選案

**一句話邊界**：面向「使用 coding agent（Claude Code、Codex、Cursor 等）與 MCP 的開發者」的開源資安工具、規則標準與評測框架。納入審計 skill、安裝前掃描、執行期護欄與閘道、沙箱隔離、行為偵測稽核、AI 紅隊與滲透、規則標準、威脅分類、評測。排除純閉源商用產品（只在文中提及）、與 agent 無關的傳統資安工具、純越獄資料集。**此邊界尚待使用者確認。**

**掃描方法**：awesome 清單（systempromptio/awesome-ai-agent-governance、awesome-MLSecOps、Awesome-LLMSecOps）、GitHub 主題標籤（各取星數前 20）、搜尋聚合（含中文）。結果：172 個候選＋OWASP Agentic Top 10，分 9 層（護欄 53、安裝前掃描 32、紅隊 32、沙箱 20、行為偵測 11、評測 10、威脅分類 6、審計 skill 5、規則標準 3）。完整清單與覆蓋矩陣見 `sources/population-scan.md`。

**盤點本身的偏誤**（寫進文章開頭，不藏在文末）：
1. 主題標籤只取前 20 名，傳統資安工具與越獄資料集會擠掉長尾；ARTEX 這類上游已下架、只剩分叉的專案不在榜單內，是事後才發現的漏網（見 §4 F 層）。
2. awesome 清單有作者自薦的新專案。
3. 語言偏英文；中文圈只有騰訊 AI-Infra-Guard 等少數；日韓德法完全沒搜。
4. 172 筆中 74 筆沒有授權欄位、3 筆完全沒資料；層與維護者類型是依名稱與描述人工判定。
5. 第一輪的 11 個樣本星數中位數是母群的約 19 倍，沒有個人或小團隊、停更或封存專案、非英語圈工具；本輪已補。

**深讀樣本**（依覆蓋矩陣補缺口，不是依星數）：
- A 審計 skill：cloudflare/security-audit-skill、trailofbits/skills
- B 安裝前掃描：NVIDIA/SkillSpector、cisco-ai-defense/skill-scanner、getagentseal/agentseal、snyk/agent-scan、cisco mcp-scanner、agentic-radar
- C 護欄閘道：microsoft/agent-governance-toolkit、NeMo Guardrails、pipelock、hol-guard、llm-guard（封存）、rebuff（封存）、一個小專案
- D 沙箱：Claude Code 沙箱／sandbox-runtime、Codex CLI、nono、OpenShell、smolvm、clawk、E2B、k8s agent-sandbox、Daytona（轉閉源）
- E 行為偵測：Uber ADR、Perplexity numbat、Adrian、Cisco DefenseClaw、clawdstrike、failproofai、Prismor
- F 紅隊：Strix、HexStrike、PyRIT、HackAgent、garak、promptfoo、騰訊 AI-Infra-Guard、Shannon、ARTEX
- G/H/I：OWASP Agentic Top 10、OWASP LLM Top 10 2026、Agent-Threat-Rule、AgentDojo 等 benchmark、MalSkillBench

**仍未覆蓋的格子**（矩陣缺口，不是跳過的理由）：學術界維護的工具少；非英語圈只有騰訊一個大型案例；規則標準層沒有大廠或基金會背書的案例；閉源產品只列名稱未深讀。

---

## 2. 跨層主線（系列的論點，皆有 §4 的事實支撐）

1. **沒有任何一層能當唯一防線。** 每層都有已記錄的繞過或自承的限制。
2. **預設值常常是放行。** Claude Code 的 hook 失敗或逾時時預設照常執行動作；numbat、Adrian、NeMo 的偵測器掛掉時也是 fail-open；Claude Code 的沙箱預設是關的。
3. **沙箱回答的是「被攻陷後能走多遠」，不是「會不會被攻陷」。** Strix 的 RCE 發生在沙箱內。
4. **這個領域沒有中立的工具偵測力評測。** 現有 benchmark 評的是模型或 agent 的抗注入力，不是工具；少數評工具的獨立研究顯示，數字換資料集就不成立。每家工具自報的準確率都是自己出題、自己評分。
5. **廠商宣稱要打折讀。** 「涵蓋 OWASP 10/10」其實自評 7 Full、3 Partial；「併入 Microsoft、Cisco」其實是作者自己提的 PR；「87% precision」找不到一手出處；星數與年齡不相稱要看導流來源。
6. **工具自己也是攻擊面，而且開源的雙用途風險已有廠商層級證據。** AI 滲透工具會被注入反控；ARTEX 被多家廠商記錄到用於實際入侵。

---

## 3. 衝突與修正清單

### 3.1 已修正的第一輪說法
| 第一輪說法 | 修正 | 依據 |
|---|---|---|
| 「Adversa 8 個掃描器全被繞過」 | 8 個都有惡意 skill 通過，但 6 個是被繞過，mondoo 離線什麼都不查，skillcop 的 judge 被注入；全程 LLM judge 關閉 | deepBench、gapB 【agent】 |
| 「77 格錯 53 格」是繞過比例 | 是 Adversa 自己讀碼預測與實測不符的格數 | gapB 【agent】 |
| ToB 與 Adversa 都繞過 Cisco 與 NVIDIA | ToB 只測 Cisco（與 ClawHub），沒給版本，沒測 NVIDIA；NVIDIA 只出現在 Adversa | gapB 【agent】 |
| CSA 的 80%／40% 是偵測率 | 是 CSA 對 PyRIT 的能力覆蓋評等，全文沒說明算法 | gapC 【agent】 |
| Cisco「LLM01:2026」編號存疑 | 屬實：OWASP LLM Top 10 2026 v1.0 已於 2026-08 發布 | deepGHI 【agent】 |
| SkillSpector 的「ASI16」可能是官方編號 | 沒有官方依據；OWASP Agentic Top 10 只有 ASI01–ASI10 | deepGHI 【agent】 |
| daytona「封存卻有更新」是矛盾 | 誤判：確已封存、核心轉私有，更新時間被星標與 issue 刷新 | deepV 【agent】 |
| cai「仍活躍」 | 已封存，後繼是商業版 | deepV 【agent】 |
| PyRIT「2026-09 才開源」 | 錯；微軟 2024-02 已發布，Azure/PyRIT 是空殼 | deepV 【agent】 |
| 「ATR 已併入 Microsoft、Cisco」 | PR 皆為 ATR 作者所提；微軟 README 寫不依賴；Cisco 的 712 條規則包是 opt-in 且在核心發布門檻外 | deepGHI 【agent】 |
| 「26.1% skill 有漏洞、5.2% 疑似惡意」是 SkillSpector 的掃描結果 | 出處是 arXiv:2601.10338（SkillScan 分析 31,132 個 skill） | deepV 【agent】 |

### 3.2 仍然衝突或未解
| 項目 | 狀態 |
|---|---|
| 微軟 toolkit 套件數 7／9／5／26 | 層次不同的數字，非單純矛盾（發表文 7、repo README 9、PyPI 5、目錄 26）；轉折日期 ⚪ |
| SkillSpector 規則數 64／68／71 | 文件間不一致；原始碼我數 67 |
| Cisco 自報 recall 7.7%／FPR 4.0% 與獨立重跑 2.5%／1.1% | 同向、數值衝突；原因是輸入（單檔對完整套件）、版本、相依【agent】 |
| MalSkillBench（2606.07131，Adversa 用）與 MaliciousSkillBench（2608.19901，Cisco 用） | 是不同資料集、不同作者群；後者把前者併為 SRC001【agent】 |
| promptfoo 被 OpenAI 收購 | 官方措辭是「同意收購、待成交條件」，README 寫 now part of OpenAI，未找到成交公告 |
| 星數是否自然（cloudflare 37k、iFixAi 32k） | cloudflare 有官方部落格（7/15）與 HN（9/17）導流，無異常訊號；iFixAi 有弱到中等異常訊號，無證據證明刷星；皆無法取得星數時間序列 |

### 3.3 站上既有文章的待修項（只列，不修；修改走 `post-update`，由使用者決定）
1. `daily/2026-08-23-ai-agent-daily.md`（含 en）：SkillSpector 歸因錯誤，應為 arXiv:2601.10338 的研究結果。
2. `daily/2026-09-06` digest：「5.2% 有惡意意圖」比論文的「強烈暗示」說得更肯定。
3. 約 40 篇資安日報仍把 Invariant Labs 當獨立廠商，未提已屬 Snyk（2025-06-24 起）。
4. ARTEX 相關（檔案與行號見 `sources/deepARTEX.md` §7）：10/17 日報把「至少 16 家」歸給 CrowdStrike（16 家是韓國金融當局的數字）；10/08、10/09 把新韓、KB、韓亞直接綁到 CrowdStrike 的結論；10/08「還原完整攻擊鏈」過強；10/12 digest 推薦 ARTEX 鏡像時未提濫用與閉源。
5. 站上 promptfoo 文章與一手公告無矛盾，建議補一句 README 已改口。
6. 本 repo：`package-lock.json` 與 `pnpm-lock.yaml` 並存且前者過期（astro 6.0.8，package.json 是 ^7.3.2）【核對】；CLAUDE.md 仍寫 Astro 6。

---

## 4. 各層結論與事實（每項附驗證狀態）

### A 審計 skill
| 事實 | 驗證 |
|---|---|
| Cloudflare skill 不用 Semgrep：「the Hunters invoked it zero times in a month of runs」；單次只找到多次總和約一半；不聲稱假陰性率；內部 harness 驗證拒絕率 40%→11%，20,799 候選→約 12,057 存活 | 【核對】官方部落格原文（內部 harness 數字，非公開 skill） |
| 15 個 .md 逐行讀完，完全沒有 Workers／D1／KV／Astro／Vectorize／AI-binding 專屬內容；AI-AND-LLM 有 RAG 間接注入、embedding 跨租戶等，但明說「prompt injection alone is not a finding」 | 【agent】逐行 |
| 沒有 OS 強制沙箱就不執行目標程式，Vectorize、Workers AI、secrets 落到 needs_validation（無嚴重度）；本雲端容器能否提供沙箱未驗證 | 【agent】 |
| Trail of Bits：Semgrep／CodeQL 腳本＋LLM 的混合；supply-chain 審計器優先讀 package-lock.json、不讀 pnpm-lock.yaml；semgrep 規則為 AGPLv3；insecure-defaults 的 deploy manifest 清單不含 wrangler，種子 regex 只含 process.env | 【agent】逐行 |
| 兩者皆無公開精準度或誤報率；HN 回報 token 成本 15 萬到 100 萬；有模型拒答（issue #77） | 【agent】【第三方】 |
| 授權：Cloudflare MIT；ToB CC-BY-SA-4.0（內化須同授權） | 【agent】 |
| quidproquo 有 6 個 workflow 沒有 AI action，agentic-actions-auditor 預期回「No AI action steps found」 | [推論] |

### B 安裝前掃描
| 事實 | 驗證 |
|---|---|
| SkillSpector 以規則＋AST＋taint＋YARA 為主，LLM 可選且只升不降；「It never executes the scanned skill」；歸屬 NVIDIA 官方，20.8k★，建立 2026-03-21，Apache-2.0 | 【核對】README 第 989 行、GitHub API |
| Cisco 規則單獨 recall 7.7%、FPR 4.0%；加 LLM judge 後 MEDIUM+ recall 66.7%、FPR 15.4%；大檔可能讓 LLM 讀不到而回 INFO、不擋 | 【核對】README 第 48 行與 measured-results.md；【agent】其餘 |
| AgentSeal 的 `scan-mcp` 會啟動目標 MCP server；授權 FSL-1.1；最後 push 2026-06-11 | 【agent】 |
| 只有 SkillSpector 有專門 rug-pull analyzer；SkillSpector 靜態模式被繞過三項：同形字（部分）、改寫或西班牙文注入、圖中文字；現行版已加正規化、bytecode、嵌套 ZIP 等規則，改寫與圖片仍是已知限制 | 【agent】 |
| Trail of Bits 繞過 Cisco：10 萬換行、.pyc、.docx、說服 LLM；Cisco 在 2026-02-17 已合併 ToB 的 PR #25 | 【agent】 |
| MalSkillBench：野外子集會翻轉排名（VirusTotal recall 21.6%→87.9%、Snyk 28.7%→77.2%）；Cisco LLM recall 92.7% 但 FPR 約 36.6%（agent 自算）；作者無被評廠商隸屬，但無 Limitations 與 COI 章節；第三方指出 13% 惡意樣本是空目錄、`_meta.json` 洩漏標籤（Adversa 為同類廠商） | 【agent】 |
| Cisco 自述 development 與 held-out 落差：規則 recall 31.45% 對 7.99%、judge 88.8% 對 65.8%；文件自承兩次違規用了 frozen test | 【agent】 |
| arXiv 2610.03448 評的是 prompt-injection 分類器，不是 skill 掃描器，只能當「benchmark 分數不類推到部署」的類比；單一作者、發表 20 天 | 【agent】 |
| snyk/agent-scan 需 SNYK_TOKEN，並把設定送 Snyk 遠端 API；Snyk 2025-06-24 收購 Invariant，mcp-scan 轉址 | 【agent】 |
| Cisco mcp-scanner 第三方稽核（單人、33 台 server）誤報約 78%；agentic-radar 不支援 Claude Code 且 11 個月沒 push | 【agent】 |

### C 護欄與閘道
| 事實 | 驗證 |
|---|---|
| 微軟 AGT：自評 7 Full、3 Partial、內部自評非認證；官方稱 Public Preview；MCP 閘道全是啟發式（regex、SHA-256 指紋、Levenshtein≤2）；未載入政策時預設 allow；Claude Code 外掛用 SessionStart／UserPromptSubmit／PreToolUse 三個 hook | 【核對】對照文件第 45、12 行；其餘【agent】讀碼 |
| **Claude Code：「On most events, when a hook fails or times out, Claude Code still carries out the action」**；要擋需 `onFailure: "block"`（v2.1.295 以上）；非 0 或 2 的退出碼、起不來、逾時都算失敗；Windows 沒有 Git Bash 時有例外 | 【核對】官方文件原文（針對此一主張取段，非整頁） |
| NeMo Guardrails：越獄偵測器掛掉時 fail open（官方有警告）；啟發式在官方資料上偵測 31.19%、假陽性 7.44%；授權欄 NOASSERTION 是 LICENSE 檔格式問題，實質 Apache-2.0 | 【agent】 |
| llm-guard 於 2026-07-09 封存，無官方原因、繼任者或遷移指引；Palo Alto Networks 2025-07-22 完成收購，與封存的因果無來源；rebuff 2025-05 封存，README 無通知 | 【agent】 |
| ProtectAI v2 在 AgentDojo 乾淨工具輸出上誤報 30.1%、擋掉 69.1% 任務 | ⚠️ 取自搜尋摘要，未讀全文 |
| pipelock、hol-guard、Docker MCP Gateway、IBM ContextForge 找不到第三方繞過或獨立評測（搜尋無結果，不等於不存在）；`stop-that-shit` 不是資安工具，自報試驗「零改善」 | 【agent】 |

### D 沙箱隔離
| 事實 | 驗證 |
|---|---|
| 這一層實為四種東西：OS 原語（同核）、容器編排、本機 microVM、遠端 microVM；不能放同一張表比強度 | 【agent】 |
| **Claude Code 沙箱預設關閉**，且只包 shell 指令，不包 Read／Edit／WebFetch、MCP server、hooks；Codex CLI 本機預設有沙箱（`workspace-write`，網路關） | 【agent】官方文件 |
| Claude Code 沙箱預設不保護 `~/.ssh`、`~/.aws` 的讀取，需自行設 deny；`allowUnsandboxedCommands: false` 與 `failIfUnavailable: true` 才是嚴格模式 | 【agent】 |
| 2026 逃逸研究幾乎都是繞過邊界旁邊的東西（寫設定檔／hook 由沙箱外元件稍後執行、放行的 socket、設定檔不存在時未保護 CVE-2026-25725），不是打穿核心原語 | 【agent】【第三方，Pillar 賣替代方案】 |
| Daytona：已封存，核心 2026-06 轉私有，公開版凍結在 v0.190.0（AGPL-3.0） | 【agent】 |
| Strix 的 RCE 發生在沙箱內（有 sudo），作者沒有示範逃逸；沙箱只限制波及範圍 | 【核對】baldur.dk 原文 |
| 各家作者自承「不是萬能」：Claude Code「not a complete isolation boundary」；nono「not an escape-proof sandbox」 | 【agent】 |
| 沒有任何對沙箱的獨立量測或重現；Anthropic 內部數據 84% 無方法論 | 【agent】 |

### E 行為偵測與稽核
| 事實 | 驗證 |
|---|---|
| E 層是一條光譜：純事後（Uber ADR）、預設只監控（numbat）、其餘多為「E＋事前閘門」混合 | 【agent】 |
| Uber ADR：「Deployed at Uber」是作者自述（論文＋簡報）；開源版不含 Prevention 與 Explorer，Detection 目錄寫「Not for production use」；ADR-Bench 由 Uber 自己出題自己評，recall 67%（28/42），上線後人工複核警報 49% 是誤報 | 【agent】 |
| Uber 簡報：prompt injection「Surprisingly rare in production」，secret exfiltration 才是大宗，另有 YOLO 模式與批准疲勞 | 【agent】自述，無第三方驗證 |
| 「防竄改」多為自述大於實作邊界：Prismor 與 clawdstrike 簽章金鑰與被稽核 agent 同機同 uid，Prismor 自承「tamper-evident, not tamper-proof」；numbat 只有 SHA-256 manifest | 【agent】 |
| numbat、Adrian 文件化 fail-open；DefenseClaw fresh install 預設 fail-closed 但 Secure Client 預設 open；DefenseClaw 屬 Cisco | 【agent】 |
| 無任何獨立評測；第三方多有利害關係（賣 VPS、賣同類產品） | 【agent】 |

### F 紅隊與滲透
| 事實 | 驗證 |
|---|---|
| 兩類不同的東西：「測 AI 系統」（PyRIT、HackAgent、garak、promptfoo）與「用 AI 打別人」（Strix、HexStrike、Shannon、ARTEX）；騰訊 AI-Infra-Guard 橫跨 | 【agent】 |
| Strix：自報 XBEN 96%（CTF）；Escape.tech（競品）單次 1/20；Ethiack 稱精準度高、召回低；EthiBench 論文文字無 Strix 絕對數字，只有相對差（單位未說明） | 【agent】 |
| Strix 的 prompt injection → 沙箱內 RCE：2026-05 獨立研究，用 TOCTOU 繞過 LLM 的「先檢查再執行」；原文沒寫 Strix 版本號；維護者視為可接受風險僅有轉述；未見修補證據（僅讀 release notes 標題） | 【核對】原文；其餘【agent】 |
| HexStrike：`/api/command` 直接 `shell=True`、無驗證機制、`app.run(host="0.0.0.0")`、範圍為空時預設放行；濫用僅 Check Point 單一來源且措辭為 claimed | 【核對】我自行抓原始碼 grep |
| 工具自身安全問題：Shannon CVE-2026-29023；AI-Infra-Guard 兩個路徑穿越 CVE，並自述修了「經 prompt injection 在掃描主機 RCE」；garak、promptfoo 無公告 | ⚠️ CVE 編號多來自聚合站，未回官方公告 |
| 沒有任何一個做到程式強制的授權閘門；Shannon 的 avoid／focus／ROE 最完整但仍是給 LLM 的指令 | 【agent】 |
| benchmark 全是自述且自出題：AI-Infra-Guard 的 SkillTrustBench 誤報率隨判官落在 1.2%–18.67%；garak 官方 FAQ 自稱「no scientific validity」；Fujitsu 2024 測到判定錯誤約 37%（舊版） | 【agent】 |
| **ARTEX**：據報由 ThreatBook 員工個人專案開源，2026-10 下架後閉源商用版 ARTEX Pro，大量分叉續更；被 CrowdStrike、Genians、Recorded Future、Zscaler、AhnLab 記錄用於韓國金融攻擊（前四家共用同一批攻擊者外流工件，逐家銀行連結偏弱）；微軟 2026-10-21 報告另一個行為者 Storm-0940 用它在 ConnectWise 供應鏈事件中加速，但沒說明如何判定；防濫用設計全是操作者可改的預設值，閉源後濫用沒有被量到下降 | 【agent】讀五家廠商報告與微軟全文；[推論] 部分已標 |
| 勿寫個人歸因：CrowdStrike 自己說無法定論，相關帳號被指涉的人否認 | 寫作紀律，不進文章 |
| 證據強度：ARTEX（多家廠商＋微軟遙測）高於 HexStrike（Check Point 單一來源、claimed） | [推論] |

### G／H／I 標準與評測
| 事實 | 驗證 |
|---|---|
| OWASP Top 10 for Agentic Applications 2026 共 ASI01–ASI10，六項定義（ASI02–05、07、09）已取得官方 PDF 原文 | 【核對】我讀了 gapA 的官方原文段落 |
| OWASP LLM Top 10 2026 v1.0（2026-08）存在，CC BY-SA 4.0，順序與 2025 版不同 | 【agent】 |
| ATR 是單一維護者、工作草案階段、TSC 未成立；自揭封閉測試：garak 92.3% 掉到 65.4%；撤回過先前公布的數字 | 【agent】 |
| AVE 單一維護者；agentbaseline 與 hush 是草案／規格，被放錯層；OWASP AST10 是孵化階段專案 | 【agent】 |
| **AgentDojo、ASB、iFixAi、SkillEvaluator、AgentLeak 評的是 agent 或模型的抗注入能力，不是掃描器或護欄的偵測力**；評工具偵測力的獨立研究只有 MalSkillBench 與 MaliciousSkillBench 兩個資料集，且彼此不同源 | 【agent】摘要層級＋全文（見 §3.2） |
| iFixAi 是商業的 LLM 判官式治理稽核工具，不是掃描器 benchmark | 【agent】 |

---

## 5. 研究足夠的判準（五關檢查結果）

逐層檢查；「部分通過」寫出缺口，動筆前再補（每篇動筆前對該篇重新過關）。

| 層 | ①一手來源 | ②證據類型 | ③2024 後 | ④反證 | ⑤飽和 | 備註 |
|---|---|---|---|---|---|---|
| A 審計 skill | 通過（15 檔＋ToB 相關 plugin 逐行） | 部分：兩者都沒有獨立評測、本研究也沒試跑 | 通過 | 部分：HN 與 issue 層級，無系統性評測 | 通過 | 文章必須寫「未試跑」 |
| B 安裝前掃描 | 通過（原始碼、README、論文全文） | 通過：自述／第三方／獨立論文分開 | 通過 | 通過：ToB、Adversa、MalSkillBench、2608.19901 | 部分：兩個資料集的附錄約 70% 字元未直接讀，圖內數字讀不到 | 要補：2608.19901 附錄 |
| C 護欄閘道 | 通過（官方文件整頁核對 hook 預設） | 部分：除 AGT 外多為自述；多個專案找不到獨立評測 | 通過 | 部分：llm-guard 封存原因無來源；ProtectAI v2 的 30.1% 只有摘要 | 部分：備援鏈只用 Groundlane／GitHub MCP／WebFetch | 要補：ProtectAI v2 論文全文；Microsoft MCP gateway 未查 |
| D 沙箱 | 通過 | **部分：沒有獨立量測**；沒有實測 | 通過 | 部分：對 E2B、smolvm、clawk、forkd 的負面證據搜尋不如 Claude Code／Codex 充分 | 部分 | 文章不下「X 比 Y 安全」的結論 |
| E 行為偵測 | 通過（文件），**沒讀任何原始碼** | 部分：自述居多；自述 vs 實作只到文件邊界 | 通過 | 部分：issue 層級未做完；DefenseClaw、clawdstrike 無獨立批評 | 部分 | 文章用「作者文件揭露的邊界」措辭 |
| F 紅隊 | 通過（含我自行核對 HexStrike 碼與 baldur 原文） | 部分：benchmark 全是自述或競品；CVE 來自聚合站 | 通過 | 通過 | 部分 | 要補：三個 CVE 回官方公告；BSRC 比賽官方公告 |
| G／H／I | 通過（OWASP 官方 PDF 全文） | 通過：明確區分標準、benchmark、被評對象 | 通過 | 通過（ATR 自揭、benchmark 對象錯位） | 部分：OWASP LLM 2026 PDF 只讀約 14%、MAESTRO 約 30%、ASB 約 40% | 引用編號時只引已讀部分 |

**整體判定**：足以排弧線與寫規劃表（資料夠形成每篇的聚焦問題與邊界）；**不足以直接動筆寫任何一篇**，每篇動筆前要先關閉該篇上表標為「部分」的缺口，並重跑 `post-verify`。

---

## 6. 未結項（⚪ 確認無公開資料／✉️ 只能問人）

| 項目 | 狀態 |
|---|---|
| SkillSpector 星數成長是否自然；「87% precision」一手出處 | ⚪／✉️ 問 NVIDIA |
| Cloudflare skill 是否持續維護（14 筆 commit，最後 push 2026-09-14） | ✉️ security-ai-research@cloudflare.com |
| Strix 對 prompt injection 研究的正式回應與 v1.7.0 是否仍受影響 | ✉️ |
| HexStrike issue #224 為何關閉 | ✉️ |
| 微軟如何判定 Storm-0940 用了 ARTEX；ConnectWise 的最初入侵向量；閉源後濫用是否下降 | ⚪ 來源未公布 |
| BSRC 比賽「冠軍」的官方公告 | ⚪ 試過 Groundlane、cloudflare、linkup、jina 皆回空殼；Exa、WebFetch 未試 |
| ToB 繞過研究的隱藏檔（.docx、.pyc、bootstrap.sh 本體） | ⚪ GitHub 檔案清單被 session 限制擋住 |
| CSA 對 PyRIT 評估的登入後 PDF | ⚪ |
| EthiBench 圖內的 Strix 絕對數字 | ⚪ |
| 微軟 toolkit 7↔9 套件的轉折日期、基金會狀態、SUPPORT.md | ⚪ |
| AgentSeal 營運者身分與第三方評測 | ⚪ |
| 各 plugin 的 references/ 其餘檔案（ToB） | ⚪ 不下結論 |

---

## 7. 檔案索引

- `sources/population-scan.md`：172 筆母群盤點與覆蓋矩陣
- `sources/deepD-sandbox.md`、`deepE-detection.md`、`deepC-guardrails.md`、`deepF-redteam.md`、`deepGHI-standards-eval.md`、`deepBench-detector-eval.md`、`deepV-verify.md`、`deepARTEX.md`（涉及個人歸因的幾行已在本 repo 的副本中省略）
- `.research/2026-10-22-agent-security-tooling/`：第一、二輪的 layer1–4、gapA–D
