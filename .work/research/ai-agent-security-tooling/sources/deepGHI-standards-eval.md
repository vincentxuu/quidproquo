# G/H/I 層深讀：偵測規則標準、威脅分類、評測 benchmark

查詢日 2026-10-22。標記：【自述】作者自己寫的；【第三方】非作者；【一手】我直接讀到的原始檔或 API；[推論] 我的判斷。
全程唯讀，沒有安裝或執行任何工具。clone 都放在 /tmp/claude-0/clones/（agt、skill-scanner、sage、common-cloud-controls、agent-threat-rules、ast10、ave、ifixai、skilleval）。

## 0. 結論先行

1. ATR「已併入 Microsoft、Cisco、Gen Digital、MISP、FINOS」：**PR 都真的合併了，但全部是 ATR 作者本人（GitHub 帳號 eeee2345，即 Adam Lin）自己提的 PR，被對方開源 repo 的維護者合併。** 不是各公司的產品採用或官方背書。Microsoft 只是 AGT 的 `examples/`，且 AGT 自己寫「AGT takes no runtime dependency on it」。FINOS 只是一份 mapping YAML（relationship: relates-to）。Cisco 是真的把 712 條規則放進 skill-scanner 的可選包，但預設不啟用、不在 release gate。
2. 「像 Sigma」是願景不是現況：ATR 自己寫 Working Draft、單一維護者（BDFL）、9 席 TSC「has not been formed」、OASIS 送件「proposal-stage」，無第二個引擎實作。
3. OWASP 編號：**OWASP 確實在 2026-08-03/04 發布了 LLM Top 10 2026 v1.0**，所以 Cisco taxonomy 的 `LLM01:2026` 等編號是對的（10 項編號與 Cisco 檔案逐項吻合）。**官方沒有 ASI11 以上**；ASI 只有 ASI01–ASI10。NVIDIA SkillSpector 的 `ASI16` 在官方文件裡不存在，是自創或誤植。ASI02 在 NVIDIA 文件被描述為「Tool/Plugin Vulnerabilities」，與官方「Tool Misuse & Exploitation」也不同，[推論] 沿用早期 ASI 草稿用語。
4. **關鍵問題：現有 benchmark 絕大多數評的是模型／agent 抗注入能力，不是掃描器／護欄的偵測力。** 但有兩個獨立學術例外（2026 年 6 月與 10 月），都得到同一結論：偵測力數字不可跨資料集移轉。見 §5。
5. iFixAi（32k★）是真實存在的商業公司（ime.life）開源引擎，評的是 agent 治理／對齊，用 LLM 當裁判；不是掃描器 benchmark。★ 數字與建立天數吻合，但成長曲線異常陡，見 §4.5。

## 1. 來源表（讀取紀錄）

| # | 來源 | URL | 取得工具 | 總長度 | 讀過區間 | 完整? |
|---|---|---|---|---|---|---|
| 1 | ATR README | raw.githubusercontent.com/Agent-Threat-Rule/agent-threat-rules/main/README.md | Groundlane web_fetch full | 74,720 字元 | 0–74,720 | 全文 |
| 2 | ATR GitHub API repo 中繼資料 | api.github.com/repos/Agent-Threat-Rule/agent-threat-rules | Groundlane | 7,607 bytes | 全部 | 全文 |
| 3 | ATR LIMITATIONS.md | clone | Bash | 25,755 B | 前約 60 行 | **部分** |
| 4 | Cisco PR #79、#99 | api.github.com/repos/cisco-ai-defense/skill-scanner/pulls/79、99 | Groundlane | 20,236 / 23,156 B | 全部 | 全文 |
| 5 | Cisco skill-scanner HEAD（README 3 處、packs/atr/README.md、pack.yaml 頭） | clone c615acb（2026-10-21） | Bash | 4,427 B（pack README） | pack README 前 60 行 | 部分 |
| 6 | AGT PR #3025、#3451、#3025 留言 | api.github.com/repos/microsoft/agent-governance-toolkit | Groundlane | 23,087 / 25,708 B | PR 內文全部；留言前 12k | 部分 |
| 7 | AGT HEAD（9c85646，2026-10-21）examples/atr-*、workflow、README 範例表 | clone | Bash | — | atr-community-rules README 全、atr-import README 全、acs-atr-annotator README 前 30 行、workflow 前 40 行 | 部分 |
| 8 | Gen Digital Sage HEAD（8817dce v0.14.0） | clone | Bash grep | — | CHANGELOG 該條、agent-layer.yaml 檔頭 | 部分 |
| 9 | FINOS CCC mapping YAML、metadata.yaml | clone | Bash | — | mapping 前 40 行、metadata 相關段 | 部分 |
| 10 | MISP taxonomies #323、galaxy #1207 | github.com/MISP/... | WebFetch（小模型摘要，非原文） | — | — | 第二手摘要；另用 curl 讀 raw machinetag.json 前 700 字 |
| 11 | Help Net Security 2026-06-03 | helpnetsecurity.com/2026/06/03/agent-threat-rules-ai-detection/ | Groundlane | 86,500 B（含導覽） | 文章本文全 | 全文 |
| 12 | agentbaseline README | raw.githubusercontent.com/agentbaseline/agentbaseline/main/README.md | Groundlane | 9,405 B | 全部 | 全文 |
| 13 | hush (HushSpec) README | raw.githubusercontent.com/backbay-labs/hush/main/README.md | Groundlane | 18,317 B | 全部 | 全文 |
| 14 | OWASP LLM Top 10 2025 列表頁 | genai.owasp.org/llm-top-10/ | cloudflare get_url_markdown | — | 全部 | 全文（列表頁） |
| 15 | OWASP LLM Top 10 2026 資源頁 | genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ | cloudflare | — | 全部 | 全文 |
| 16 | **OWASP LLM Top 10 2026 PDF** | genai.owasp.org/download/56857/?tmstv=1785822482 | linkup-fetch（成功） | 226,256 字元 | 0–22,000；112,000–121,000（附錄 A 與 ASI 對照）；222,500–224,300（致謝） | **部分（約 14%）；LLM02–LLM10 各項本文未讀** |
| 17 | OWASP Agentic Skills Top 10 repo（index.md 全、top10.md 全、ast08.md 全） | github.com/OWASP/www-project-agentic-skills-top-10（clone d6f7d7d，2026-08-12） | Bash | index 30,877 字元（去 HTML）；top10 14,793 B；ast08 8,199 B | 各檔全文 | **ast01–07、ast09–10、README.md(41k)、mappings.md、checklist 等未讀**；僅讀 index/top10/ast08 |
| 18 | owasp.org AST10 專案頁 | owasp.org/www-project-agentic-skills-top-10/ | cloudflare | — | 全部 | 全文 |
| 19 | CSA MAESTRO blog | cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro | Groundlane | 工具截斷於 60,000 字元（去 base64 後 58,791） | 約 10,264–26,264 與 3.2 節開頭 | **部分（約 30%）**；七層細節未讀 |
| 20 | CSA MAESTRO repo README | raw.../cloudsecurityalliance/maestro/main/README.md | Groundlane | 6,110 B | 全部 | 全文 |
| 21 | AVE README | raw.../aveproject/ave/main/README.md | Groundlane | 30,193 B | 全部 | 全文；另讀 GOVERNANCE.md 片段、CONTRIBUTORS.md 前 40 行、skillspector-to-ave.json 前 1.5k |
| 22 | AgentDojo 論文 arXiv 2406.13352v3 HTML | arxiv.org/html/2406.13352 | Groundlane | 97,216 字元（去連結後） | 摘要、1–5 節全、參考文獻前段 | 本文全；**附錄 A–F（含 data card）未讀** |
| 23 | AgentDojo README | raw.../ethz-spylab/agentdojo/main/README.md | Groundlane | 3,184 B | 全部 | 全文 |
| 24 | NIST/CAISI 技術部落格 2025-01-17 | nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations | Groundlane | 97,798 B（含導覽） | 文章全 | 全文 |
| 25 | ASB 論文 arXiv 2410.02644v4 HTML | arxiv.org/html/2410.02644 | Groundlane | 83,912 字元 | 摘要＋1–3.2（約 8.4k–22.4k）、表 2–3（43.6k–46k）、表 4–6（47.8k–56.8k） | **部分（約 40%）**；防禦詳細結果、附錄未讀 |
| 26 | iFixAi API、README | api.github.com/repos/ifixai-ai/iFixAi；raw README | Groundlane | 6,645 B；27,624 B | 全部 | 全文；contributors API 只讀前 3 筆 |
| 27 | NVIDIA SkillEvaluator README | clone（2026-10-21） | Bash | 10,024 B | 前 7,000 字元 | **部分（約 70%）**；論文 arXiv 2608.20614 **未讀** |
| 28 | AgentLeak README | raw.../Privatris/AgentLeak/main/README.md | Groundlane | 6,089 B | 前 4,500 字元（工具截斷） | **部分**；論文 2602.11510 未讀 |
| 29 | circle-guard-bench README | raw.../whitecircle/circle-guard-bench/main/README.md | Groundlane | 11,197 B | 前 7,000 字元 | 部分 |
| 30 | MalSkillBench arXiv 2606.07131v3 | arxiv.org/abs/2606.07131 | Groundlane | 44,787 B（含頁面） | **只讀摘要**（HTML 全文未讀） | **僅摘要** |
| 31 | 偵測器重評論文 arXiv 2610.03448v1 | arxiv.org/abs/2610.03448v1 | Groundlane | 42,716 B | **只讀摘要** | **僅摘要** |
| 32 | Trendshift iFixAi 頁 | trendshift.io/repositories/29638 | Groundlane | 337,521 B | 抽不出內容（只剩頁尾） | 失敗 |

讀不到／失敗項：
- `api.github.com` 用 curl 回 403（代理規則）；改用 Groundlane web_fetch 成功。raw.githubusercontent.com 與 `git clone` 皆可用。
- MISP PR 頁只能經 WebFetch 小模型摘要，未取得原文；已用 raw machinetag.json／galaxy JSON 檔頭交叉確認檔案存在。
- Trendshift：內容抽取失敗，無法取得 iFixAi 星數時間序列。
- 未試 Exa／jina／firecrawl（Groundlane、cloudflare、linkup 已足夠）。
- AGT PR #3025 的 bot 留言被工具截斷（34,631 B 只回前段）。

## 2. G 層：偵測規則標準

### 2.1 ATR（Agent-Threat-Rule/agent-threat-rules）

事實表

| 項目 | 內容 | 來源／標記 |
|---|---|---|
| 解決什麼 | YAML 規則格式＋參考引擎（TypeScript／pyATR），規則含 test_cases，偵測 prompt injection、tool poisoning、skill 內容等 | README 【自述】 |
| 維護者 | 單一維護者 Adam Lin（林冠辛，台灣），「BDFL」；組織帳號 Agent-Threat-Rule | README §9、§14【自述】 |
| 版本 | 4.1.5；README 稱規則格式「Working Draft」 | README【自述】 |
| 規模 | ★421、forks 63、open issues 40、建立 2026-03-09 | GitHub API【一手】 |
| 規則數 | 徽章 843；README 內文「823 live rules」「830 rule files」「683 tagged」；Cisco 包 712、MISP 713／330／336 | 不同時點、不同口徑；README 自己警告 grep 計數會錯 |
| 授權 | MIT | API【一手】 |
| 治理 | 「TSC 尚未成立」「trust marks are not registered」「ATR-Certified 提案」；OASIS 送件為 proposal-stage | README「Standardization Status」【自述】 |
| 引用 | 論文為 Zenodo DOI 10.5281/zenodo.19178002（非同儕審查） | README【自述】；[推論] Zenodo 不是審稿 |
| 商業 | Open Collective 募資，$2,000/月是「keep the lights on」 | README §15【自述】 |

**「已併入」逐一核對（一手證據）**

| 宣稱 | 實況 | 證據 |
|---|---|---|
| Microsoft | 兩個 PR 合併：#2308（atr-import 範例，2026-05-18）、#3025（acs-atr-annotator 範例，2026-06-15，作者 eeee2345、合併者 imran-siddique）。PR 帶 `needs-review:HIGH`（貢獻者信譽檢查標 HIGH）標籤。AGT HEAD 只剩 `examples/atr-community-rules`、`atr-import`、`acs-atr-annotator` 三個範例與每週同步 workflow。AGT 範例 README 原文：「ATR remains an external community project and AGT takes no runtime dependency on it.」ATR README 自承規則包 YAML 已在 2026-07-30 的 AGT PR #3451 被移除（#3451 是 547 檔、刪 95,762 行的大型 v4 移除重構，作者 liamcrumm；我讀過 PR 內文與統計，**沒有逐檔確認 ATR YAML 被刪**，只確認 HEAD 現況沒有 YAML 規則檔）。Microsoft Copilot SWE Agent 的故事：ATR README 說是 Copilot 在 AGT 內開 PR，「not an MSRC endorsement」。 | AGT 一手：PR API、clone、README；ATR README §6 |
| Cisco | **屬實但有限定**：PR #79（34 條，2026-04-03）、#99（314 條，2026-04-22）都是 eeee2345 提、Cisco 員工 vineethsai7（GitHub profile company: Cisco）合併。#99 從提出到合併約 23 小時。HEAD 現況：`skill_scanner/data/packs/atr/` 版本 3.5.6、712 條，**可選**（`--rule-packs atr`），README 寫「not part of the current core + CEL release gate」。Cisco 的 pack README 自己複製 ATR 的警語（PINT 非官方、SKILL.md enforce 為 0）。ATR README 也自己寫「a merge into that repository, not a statement about any vendor product」。與 layer2 紀錄一致。 | Cisco 一手：PR API、clone |
| Gen Digital | 屬實：Sage 的 CHANGELOG「Add 13 threat rules from ATR … under MIT」；`threats/agent-layer.yaml` 9 條、`prompt-injection.yaml` 4 條帶 ATR 標示，檔頭寫「per explicit agreement in issue #30」。是 **13 條改寫規則**，ATR README 的「Rule pack merged」說法偏大。 | Sage clone【一手】 |
| MISP/CIRCL | 屬實：taxonomies #323、galaxy #1207，2026-05-10，adulau（MISP 核心成員）合併；galaxy 336 個 cluster。分類 #323 一度錯寫「Apache 2.0」，#343（2026-08-18）更正為 MIT。 | WebFetch 摘要【第二手】＋raw 檔【一手】 |
| FINOS | 只是 CCC 的 `mappings/threats-agent-threat-rules.yaml`，關係為 `relates-to`；metadata 寫「reference detection coverage that is adjacent to a control's intent, not control equivalents」。不是偵測整合。 | FINOS clone【一手】 |
| OWASP A-S-R-H、PyRIT、SigmaHQ、rulezet、AMD GAIA | **未核對**（超出範圍）；SigmaHQ 只是「tools directory 交叉列名」 | ATR README【自述，未驗】 |

[推論] 所有被引用的 PR 都出自 ATR 作者本人。這些是真實的開源 repo 合併，但證明的是「作者積極投稿、對方維護者接受」，不是「該組織把 ATR 當標準」。第三方文章 Help Net Security（2026-06-03）內容幾乎全是維護者提供的資料，含維護者的直接引言，不算獨立驗證；它寫的「AGT 規則包每週自動同步」在 07-30 之後已過時。

限制與反證（ATR 自己寫的，非我挑的）
- 「regex 抓不到改寫過的攻擊」；AdvBench 5.6%、HarmBench 6.0%、JailbreakBench 3.0%（但這些語料測的是對齊不是注入）。
- `enforce` 車道（可封鎖時該用的）只載 103／823 條 stable 規則；SKILL.md 基準 hunt 100%／enforce **0.0%**，因為 39 條 `scan_target: skill` 規則全是 `maturity: test`。
- garak in-the-wild 92.3% 是「partly closed-book」：130 條規則由該語料寫成，移除後 65.4%；PromptInject 100% 移除 5 條自該語料寫的規則後 9.7%；hackaprompt 83.1% 移除 20 條後 28.7%。
- 曾公布的 FP 率（0.24%／9%）與 91.5%／56.9% 兩組數字已被作者撤回；曾有 runner 根本沒呼叫引擎（hh-rlhf 99.1% 其實是「含字母 e」）。**這是誠實，也證明 benchmark 由規則作者自己評、自己修，沒有獨立驗證。**
- 沒有 benign gate 的 precision 數字（已撤回，待重測）。SKILL.md 基準 498 筆是內部語料。
- 上述全為【自述】，我沒有重跑。

### 2.2 agentbaseline（agentbaseline/agentbaseline）

- **它不是偵測規則標準**，母群歸類有誤。README：「Six security outcomes … and the 35 controls」，狀態「v1.0-draft — not a standard, no conformance programme」，意見徵求 2026-09-30 截止。【一手】
- 召集者：Docker、Keycard、Snyk，「all of which sell into the area this document describes」，PROVENANCE.md 揭露商業利益。授權：文字 CC BY 4.0、schema Apache-2.0。
- 要把它從 G 層移到「治理／控制框架」。

### 2.3 hush（backbay-labs/hush，HushSpec）

- 也**不是偵測規則標準**：是「agent 動作邊界的政策規格」（forbidden_paths、egress、tool_access…），輸出 allow/warn/deny 與簽章 receipt。【一手】
- Spec 1.0.0 宣稱 stable，但「The 1.0 SDK release is not yet published」，Go adapter 是「first-party bring-up」，trusted invocation 是「scoped first-party demonstration, not external adoption」。Apache-2.0，Backbay Labs（新創）。
- 其中 `heuristic_injection@1` 偵測器只是參考實作。

G 層小結：三筆裡只有 ATR 是真正的偵測規則標準，而且是單人專案、Working Draft、無第二引擎。母群的「G 層」本質上是 1 + 2 個鄰近類別。

## 3. H 層：威脅分類

### 3.1 OWASP Top 10 for LLM Applications：2025 與 2026

- 官方 2025 列表（LLM01–LLM10:2025）：Prompt Injection／Sensitive Information Disclosure／Supply Chain／Data and Model Poisoning／Improper Output Handling／Excessive Agency／System Prompt Leakage／Vector and Embedding Weaknesses／Misinformation／Unbounded Consumption。【一手，cloudflare 讀 genai.owasp.org/llm-top-10/】
- **2026 版真實存在**：資源頁日期 2026-08-03，標 v1.0；新聞稿 PRNewswire 2026-09-02 發布（搜尋結果頁），第三方（Help Net Security 2026-08-06、Cycode、HackerDNA）報導 2026-08-04 發布。PDF 版本史：「2023-08-01 v1.0、2023-10-16 v1.1、2024-11-18 Version 2025、[2026 release date] Version 2026」。PDF 內仍有「[Publication date to be set]」占位字。
- 2026 編號（PDF 目錄原文）：LLM01 Prompt Injection、LLM02 Sensitive Information Disclosure、LLM03 Excessive Agency、LLM04 Supply Chain、LLM05 Data and Model Poisoning、LLM06 Unbounded Consumption、LLM07 Misinformation、LLM08 Hidden Context Exposure（由 System Prompt Leakage 改名擴大）、LLM09 Vector and Embedding Weaknesses、LLM10 Improper Output Handling。
- **這個順序與 Cisco skill-scanner 的 `cisco_ai_taxonomy.json` 完全相同**（我統計出現的 LLM01–LLM10:2026 名稱逐項一致）。所以 Cisco 的「LLM01:2026」不是筆誤，而是跟 2026 版；**舊文章／工具若仍用 2025 編號，同一個 ID 會指向不同風險**（例如 LLM03 在 2025 是 Supply Chain，在 2026 是 Excessive Agency；LLM06 在 2025 是 Excessive Agency，在 2026 是 Unbounded Consumption）。ATR 規則的 `owasp_llm: LLM01:2025`、NVIDIA 等引用必須帶年份。
- 方法學新點：社群投票佔 3/4、事件資料佔 1/4；從公開漏洞庫與 AI 危害庫蒐集 7,714 件事件，6,639 件可分類。原文：「Practitioners rank it the number one risk. Rank the categories by the raw incident record instead, and it falls out of the top 10 entirely.」【一手】
- 與 Agentic 版的邊界（原文）：「This list owns the risk when the model is a component inside your application. The moment that model becomes an actor … the risk moves to the OWASP Agentic Top 10.」
- 授權：「This document is licensed under Creative Commons, CC BY-SA 4.0」【一手】；站台通用頁尾亦寫 CC BY-SA 4.0。
- 利益揭露：PDF 稱「vendor neutral and unbiased」；共同專案負責人 Rock Lambros 的職稱為 Zenity 的 Director of AI Standards and Governance（Zenity 為廠商）。我讀到的 Sponsors 清單只到開頭，**未讀完**。
- 附錄 A 的 ASI 對照只出現 ASI01–ASI10。

### 3.2 OWASP Top 10 for Agentic Applications 2026（ASI）

- 先前 gapA 已讀全文；本次僅確認：官方只有 ASI01–ASI10，發布 2025-12-09／10（LLM 2026 PDF 寫「announced 2025-12-09」，官方頁日期 2025-12-10）。LLM 2026 PDF 附錄的 ASI 名稱：ASI01 Agent Goal Hijack、ASI02 Tool Misuse & Exploitation、ASI03 Identity & Privilege Abuse、ASI04 Agentic Supply Chain Vulnerabilities、ASI05 Unexpected Code Execution (RCE)、ASI06 Memory & Context Poisoning、ASI07 Insecure Inter-Agent Communication、ASI08 Cascading Failures、ASI09 Human-Agent Trust Exploitation、ASI10 Rogue Agents。【一手】
- 我用網路搜尋找 ASI11／ASI12／ASI16 找不到任何官方來源（搜尋結果全是 ASI01–ASI10 的第三方說明）。**NVIDIA skillspector 的 `_TAGS = ["ASI16"]`（mcp_rug_pull.py）無官方依據**；該專案其他分析器用 ASI02，文件把它定義成「OWASP Agent Security Initiative -- Tool/Plugin Vulnerabilities」，與官方 ASI02 名稱不同。layer2 說 Cisco 的 rug-pull 也標 ASI16，我這次在 Cisco clone 的 taxonomy 與其他檔裡 grep 到的 ASI 只有 ASI01–ASI10，**沒有找到 ASI16**；該說法我無法在 Cisco 檔案重現。
- 相關但不同編號體系：ATR 的 ATD 技術目錄（80 技術）、AVE 的 `owasp_asi` 欄（ASI01–ASI10）、AST10 的 AST01–AST10。三者名字相近，**容易被誤當同一套 OWASP 編號**。

### 3.3 OWASP Agentic Skills Top 10（AST10）

- 官方 owasp.org 頁：「Incubator Project」、Classification: Documentation、Latest Version 1.0-2026、23 contributors、332★、Downloads 0。專案負責人 Ken Huang（OWASP AIVSS Lead）；共同負責人／主要貢獻者含 Aonan Guan、Niv Hoffman（email 網域 air.security）、Iftach Orr（alice.io）等。【一手】
- repo 自述狀態：「New Project Proposal — active development」，版本「1.0 (2026 Edition)」，CC BY-SA 4.0，最後更新 2026-03（index）／2026-06（ast08）。公開審查走 Google Doc。Q4 2026 目標「OWASP flagship project submission」。repo 只有 1 個 commit（git 作者 DistributedApps.AI，Ken Huang 的公司）。
- 內容：AST01 Malicious Skills、AST02 Supply Chain Compromise、AST03 Over-Privileged Skills、AST04 Insecure Metadata、AST05 Untrusted External Instructions、AST06 Weak Isolation、AST07 Update Drift、AST08 Poor Scanning、AST09 No Governance、AST10 Cross-Platform Reuse；嚴重度 Critical／High／Medium 由作者標示，未見評分方法（我只讀 index/top10/ast08）。
- **AST08「Poor Scanning」是本系列的直接背書**，原文（【自述】，引用他人研究）：「Security scanning tools designed for traditional code are ineffective against agent skills … The enemy of AI security is the infinite variability of language.」並整理 Trail of Bits（2026-06-03）「bypassed every scanner tested … each in under an hour」、Air Security（2026-06-22）「vetted as safe by every scanner tested — Cisco's, NVIDIA's, and all of skills.sh's」。建議：「Treat scanner skill results as advisory only; never use a skill-based scanner as the sole gate」「Treat the scanner's own LLM as an injectable, attackable component」。
- 限制：所列證據大多是廠商自己的部落格（Snyk、Air Security、Alice）；而 Air Security（Niv Hoffman）、Alice（Iftach Orr）的人是專案共同負責人／貢獻者 [推論：存在自我引用的利益關係，未必不當但應揭露]。同頁也把 NVIDIA SkillSpector 列為建議做法（附「26.1% 含漏洞、5.2% 疑似惡意」的 NVIDIA 自述數字）。OWASP 對應標 LLM02（Sensitive Information Disclosure）與 CWE-693，這個對應對「掃描失效」來說很牽強 [推論]。

### 3.4 CSA MAESTRO

- 來源是 CSA 部落格文章（2025-02-06），作者 Ken Huang（DistributedApps.ai）：七層參考架構的 agentic AI 威脅建模框架（Layer 1 Foundation Models 到 Layer 7 Agent Ecosystem；AST10 repo 內的 mermaid 圖亦如此）。【一手】
- CSA 官方 repo `cloudsecurityalliance/maestro` 其實是「MAESTRO Threat Analyzer」LLM 示範工具，MIT 授權，版權 2024 Distributed Apps，明寫「educational and demonstration purposes only」。母群列為「威脅分類」，但它是方法論＋示範程式，**沒有編號的威脅清單可引用**。
- 我只讀了部落格的比較 STRIDE／PASTA 等部分，七層細節沒讀完（部分）。

### 3.5 AVE（aveproject/ave）

- 87 筆記錄、schema 1.1.0、Apache-2.0；用 OWASP AIVSS v0.8 計分（`((CVSS_Base + AARS)/2) × ThM × Mitigation`，ThM 0.75／0.90／1.0）。ID 格式 AVE-2026-NNNNN，承諾不重編號。【一手】
- 治理（GOVERNANCE.md）：「Saray CHAK (chaksaray), founder of Bawbel. Sole maintainer as of v1.1.0.」；參考實作是 Bawbel 自己的掃描器；「moving toward neutral governance … No timeline is committed.」
- **「獨立驗證」自述不成立的部分**：README 說 8 個工具「built crosswalks against AVE's records on their own initiative, unprompted」，含 NVIDIA SkillSpector。但 `crosswalks/skillspector-to-ave.json` 的註記寫：該 repo「does not have live access to」SkillSpector 的目錄，對照依 SkillSpector 的文件做成、停在 51 筆時代的記錄；且我在 NVIDIA SkillSpector 的本機 clone 裡 grep 不到任何 AVE 字樣。[推論] 至少這一份是 AVE 側（或第三人）依公開文件製作，不是 NVIDIA 自己的整合。其他 7 份我沒查作者。AIVSS v0.8 也只是 OWASP 的草案分數。
- 與 ASI/MCP Top 10 的關係：AVE README 自承「still-unratified OWASP MCP Top 10」兩種草稿編號不一致。

H 層小結：真正有官方版本史的只有 OWASP 兩份 Top 10；AST10 是 Incubator 提案階段；MAESTRO 是個人署名部落格；AVE 是單一廠商維護。

## 4. I 層：評測 benchmark

### 4.1 AgentDojo（ethz-spylab/agentdojo）

- 論文：Debenedetti 等，ETH Zurich＋Invariant Labs，NeurIPS 2024 Datasets & Benchmarks；arXiv 2406.13352v3（2024-11-24）。MIT 授權（repo）。
- 規模（原文）：「97 realistic tasks, 629 security test cases」，四環境 Workspace／Slack／Travel／Banking；使用者任務 40/21/20/16；注入任務 6/5/7/9（27 個注入目標）；工具數論文內文寫 74、表 1 標題寫 70（論文自相矛盾，我只是記錄）。
- 指標（3.4 節原文）：Benign Utility（無攻擊時完成任務比例）；Utility Under Attack（有攻擊且無副作用完成任務）；Targeted ASR（攻擊者目標達成比例）。判定用狀態檢查函式，不用 LLM 當裁判。
- 評的是什麼：**「the adversarial robustness of AI agents」，即 agent（模型＋管線）的抗注入能力。** 防禦（資料分隔符、BERT 偵測器、sandwich、tool filter）是被當作「agent 管線的零件」放進去比：偵測器使 ASR 降到約 8%，但「has too many false positives … significantly degrades utility」；tool filter 降到 7.5%，但 17% 案例失效。偵測器的好壞只間接透過 ASR 與 utility 呈現，**沒有獨立的偵測 recall/precision。**
- 採用（一手）：美國 NIST CAISI 2025-01-17 部落格，說 AgentDojo 是「a leading open-source framework」，把它擴充成 agentdojo-inspect（加 RCE、資料外洩、釣魚三類注入任務）。Microsoft AGT 的 dependency-confusion 白名單列 agentdojo（僅旁證）。
- 批評（CAISI，一手）：靜態攻擊會低估；針對新版 Claude 3.5 Sonnet 設計攻擊後 ASR 由 11% 升到 81%；單次嘗試 vs 25 次重試，平均 ASR 57%→80%。原論文自己也寫攻擊是「generic」，需要 adaptive attack。
- 我沒讀論文附錄與 data card；排行榜頁（agentdojo.spylab.ai/results）未讀。

### 4.2 Agent Security Bench（agiresearch/ASB）

- 論文 arXiv 2410.02644（v4），repo 授權欄 GitHub API 未取得（母群也是「未取得」，未驗證，勿寫）。
- 規模（表 3，原文）：10 情境、10 agents、50 agent tasks、20 normal tools、400 attack tools、400 attack tasks、13 攻擊方法、11 防禦；13 個 LLM 骨幹；摘要寫「over 400 tools … 27 different types of attack/defense methods, and 7 evaluation metrics」。
- 7 指標（表 4）：ASR、RR（拒絕率）、PNA（無攻擊表現）、BP（後門下良性表現）、FNR、FPR、NRP（= PNA × (1−ASR)）。
- 重要：**ASB 是少數含 FNR／FPR 的 agent benchmark，但那只用在 2 個偵測型防禦（PPL detection、LLM-based detection），且只針對 memory poisoning。** 其他 9 個防禦是預防型提示改寫。最高平均 ASR 84.30%（Mixed Attack）。
- 批評 [推論]：ASB 的「成功」定義是「agent 用到攻擊專用工具」，是行為指標；工具與任務由作者合成。我只讀約 40%。

### 4.3 AgentLeak

- 評隱私洩漏（多 agent 內部通道），不評注入防禦或掃描器。論文 IEEE Access 2026；README 自己警告 repo 的 5,694 traces 與論文的 4,979 traces「not been reconciled」。【一手，部分】已不是本系列重點。

### 4.4 NVIDIA SkillEvaluator

- 評的是 **skill 品質與增益**：三層（Tier1 驗證、Tier2 去重、Tier3 有／無 skill 的 live 評測，論文 arXiv 2608.20614 的 Skill Lift）。Tier1 的安全掃描直接呼叫 SkillSpector（NVIDIA 自家掃描器）、Semgrep、Gitleaks。Apache-2.0；是 NVIDIA Verified Skills 流程的一關。【一手，README 前 70%】
- 它是「NVIDIA 用自家掃描器把關自家目錄」，不是評掃描器的 benchmark。論文未讀。

### 4.5 iFixAi（ifixai-ai/iFixAi）

- 事實（GitHub API，一手）：★32,107、forks 1,618、watchers 420、建立 2026-04-27（至 2026-10-22 共 178 天，與盤點相符）、Apache-2.0、Python、組織帳號；聯絡信箱 info@ime.life；有付費層「iFixAi Pro」（up to 400 inspections、「Audited by iFixAi」徽章）。
- 它是什麼：開源診斷引擎，61 項檢查（預設 10 項），五個核心面向（Fabrication、Manipulation、Deception、Unpredictability、Opacity）給 A–F，「Manipulation 0.35、Fabrication 0.20」等權重由作者定；**由 LLM 裁判打分**（建議 Sonnet 或兩個異廠模型），一次完整評測約 $10–18。其中 B12「resists prompt injection」只是 61 項之一。評的是 agent 的行為／治理，**不是掃描器偵測力**。
- 數字合理性：★/forks 比約 5%，watchers 420 對 32k★ 偏低（一般大型專案約 1–3%，此處 1.3%），可能是病毒式傳播（README 掛 Product Hunt、Trendshift 徽章）。**但成長極陡**：搜尋結果顯示 2026-10-02 的 Reddit 貼文寫 17,900★，10-22 為 32,107★，約 20 天加 14k（~700/天）；另有一則中文貼文寫「今天一天涨了 2000+ star」。我無法取得星標時間序列（Trendshift 抽取失敗、GitHub stargazers 未查），所以**無法判定是自然爆紅或灌水**。[推論] 把它當作「聲量高、證據弱」：第三方只有行銷／聚合性質的頁面；頂尖貢獻者 rudycelekli 197 次、其餘 42、37 次。在系列裡建議把 ★ 當作一個需要註記的異常值，不要當品質依據。

### 4.6 其他 I 層項目（只讀 README，部分）

- circle-guard-bench（White Circle，新創）：評 **內容審核 guard 模型**（17 類有害內容、jailbreak、FP、延遲）。是「護欄模型」benchmark，但針對有害內容審核，不是 agent 注入或 skill 惡意。
- PINT（Lakera）：ATR README 說其語料「private」。ATR 的「PINT-format」是自建 850 筆，非官方 PINT。

## 5. 關鍵問題：有沒有評「掃描器／護欄偵測力」的 benchmark？

**回答：主流 benchmark（AgentDojo、ASB、InjecAgent、iFixAi、SkillEvaluator、AgentLeak）評的是模型或 agent 的抗注入／行為，不是掃描器的偵測力。** 偵測型工具最多被當成管線零件，只間接影響 ASR 或 utility。

**兩個 2026 年的獨立例外（僅讀摘要，全文未讀；結論來自作者摘要，標【第三方，部分】）：**

1. **MalSkillBench**（arXiv 2606.07131，2026-06-05，v3 06-19；作者聯絡人 Wenbo Guo）：3,944 個惡意 skill（3,214 個在 Docker 沙箱內由系統呼叫監控＋LLM 裁判驗證會觸發）、703 個野外樣本、4,000 個配對良性樣本；評 12 個學術與業界工具。摘要原文：「Detection tools have never been measured against verified ground truth spanning this hybrid space, leaving their effectiveness unknown and wild-only evaluations biased.」「the strongest skill-specific detector reaches 98.4% recall on code injection yet collapses on prompt-injection and agent-control attacks, and wild-only scoring swings the ranking by up to 66 recall points; supply-chain scanners and prompt-injection defenses each see only half of a skill」。另一個二手摘要頁（emergentmind，搜尋片段）稱最佳設定「Sentry Full」F1 88.6%、召回 98.4%、4,000 良性中 937 筆誤報（約 23.4% 誤報率）[僅搜尋片段，未對照論文全文]。
2. **「Passing the Test You Trained On」**（arXiv 2610.03448，2026-10-02）：重放 AgentDojo 與 tau-bench 取得「by construction 良性」的工具輸出，評 15 個注入偵測器（含 Meta Prompt Guard 2）與 2 個 LLM 裁判。摘要原文：「Detection rankings transfer poorly between benchmarks: the best detector on BIPIA catches 2% of AgentDojo injections at a 1% false-positive rate, and a detector that catches 72% of AgentDojo injections catches 15% on tau-bench. False-positive rates on tool outputs, which range from none to over 90%…」。結論：「Evaluations meant to inform deployment should use the agent's own tool outputs, report detection at a low false-positive rate, and audit what the detector was trained on.」

另有廠商自跑的偵測器 benchmark（promptguard.co 2,369 樣本、bastion-soft/pi-detector-bench），我只看到搜尋片段，未讀，視為廠商自述。

**為什麼這個領域沒有中立的工具評測（我的歸納，標 [推論]，有證據支撐的部分已標來源）**
- 規則／工具作者自己出題自己評分：ATR 的 garak 92.3% 其中 130 條規則由該語料寫成，移除後 65.4%（ATR 自述）；曾有 runner 根本沒呼叫引擎。
- 公開資料集一旦成為訓練／寫規則來源就失效（2610.03448：「The BIPIA leader was trained on full BIPIA inputs」）。
- 偵測力要同時報 recall 與低 FPR，且要用「agent 自己的工具輸出」（2610.03448）；多數 benchmark 只有惡意樣本，precision/FP 無法算（ATR README 自己承認：100% 對抗語料「precision 和 fp_rate cannot be computed」）。
- 攻擊面是混合體：skill = 程式碼＋自然語言（MalSkillBench；AST08）。
- 對手是適應性的：CAISI 把 ASR 從 11% 打到 81%；Trail of Bits 對所有公開 skill 掃描器一小時內繞過（AST10 引述，**我沒有直接重讀 ToB 原文**，gapB 已讀）。
- 利益結構：維護標準的人也賣掃描器（AVE→Bawbel；agentbaseline→Docker／Keycard／Snyk；iFixAi→Pro 稽核；SkillEvaluator→SkillSpector）。

## 6. 授權／版本／編號速查

| 項目 | 版本 | 授權 | 備註 |
|---|---|---|---|
| OWASP LLM Top 10 2026 | v1.0（2026-08-03/04） | CC BY-SA 4.0 | 編號 LLM01–LLM10:2026，與 2025 順序不同 |
| OWASP LLM Top 10 2025 | 2025 | CC BY-SA（站台頁尾） | |
| OWASP Agentic Top 10 | 2026（2025-12-09/10） | 未重驗 | 僅 ASI01–ASI10 |
| OWASP AST10 | 1.0-2026，Incubator | CC BY-SA 4.0 | AST01–AST10 |
| ATR | 4.1.5 | MIT | 單一維護者，Working Draft |
| AVE | schema 1.1.0，87 筆 | Apache-2.0 | 單一維護者 |
| agentbaseline | v1.0-draft | CC BY 4.0（文）＋Apache-2.0（schema） | 非標準 |
| HushSpec | 1.0.0 | Apache-2.0 | SDK 尚未發布 |
| MAESTRO | 部落格 2025-02-06；repo 示範工具 | repo MIT | |
| AgentDojo | 論文 v3，benchmark v1.2 | MIT（repo） | |
| iFixAi | — | Apache-2.0 | |
| SkillEvaluator | — | Apache-2.0 | |

## 7. 反證搜尋紀錄（2024 年後來源）

- 搜「ATR review OR criticism OR independent」：只找到 Help Net Security（維護者提供內容）、Panguard 部落格（ATR 相關廠商頁，標「113 YAML rules」過時）、GitHub／npm 頁；**沒有找到獨立第三方對 ATR 的批評或獨立效能評測**。
- 搜「OWASP LLM 2026」：證實存在，推翻我「可能不存在」的懷疑。
- 搜「ASI11/ASI12/ASI16」：無官方來源。
- 搜「detector benchmark」：找到 MalSkillBench 與 2610.03448，推翻「完全沒有偵測力評測」的強說法，要改寫成「非常少且很新，且彼此都說現有評估不可靠」。
- 搜 iFixAi：只找到行銷／聚合頁與 Reddit，沒有獨立技術評論。
- 搜 AgentDojo 批評：找到 NIST CAISI（正面採用但指出評估限制）。

## 8. 五關自評

1. 來源一手性：ATR 併入宣稱逐項用 PR API／clone 的原檔核對（Cisco、Microsoft、Sage、FINOS 為一手；MISP 為小模型摘要，已標註）。OWASP 兩份取得官方原檔。MalSkillBench 與 2610.03448 只讀摘要。
2. 完整閱讀：ATR README、agentbaseline、hush、AgentDojo 本文、NIST 部落格、AVE README、iFixAi README 為全文。OWASP LLM 2026 PDF 只讀約 14%、AST10 只讀 3 檔、MAESTRO 約 30%、ASB 約 40%、SkillEvaluator 70%、AgentLeak 與 circle-guard-bench 部分、MalSkillBench／2610.03448 僅摘要。這些都在 §1 標明。**這與「全文閱讀」的要求有落差。**
3. 區分自述／第三方／推論：已標；ATR 的效能數字全是自述，我未重跑。
4. 反證：做了一輪（§7），並實際推翻兩個先入為主的看法（OWASP 2026 存在、有偵測力評測）。仍缺：ATR 的獨立第三方評測（沒找到，非沒找過）；iFixAi 星標時間序列（工具失敗）。
5. 風險：本報告未驗證 OWASP A-S-R-H、PyRIT、SigmaHQ、rulezet、AMD GAIA 的 ATR 併入；Cisco rug-pull 標 ASI16 的 layer2 說法在本次 grep 找不到；#3451 是否逐檔刪除 ATR YAML 只驗到結果。

## 9. 對系列的建議

- 寫 ATR 時用「作者投稿並被合併」與「可選包／範例／mapping」的精準措辭，不要寫「Microsoft／Cisco 採用」。
- 引用 OWASP LLM 編號一律帶年份；ASI16 不要引用。
- 「沒有中立的工具評測」改為「獨立評測剛出現（2026-06、2026-10），且結論是現有數字不可信」，並以 MalSkillBench 與 2610.03448 為主線；寫之前需要補讀這兩篇全文。
- 母群修正：agentbaseline、hush 移出 G 層；MAESTRO 標註為方法論。
