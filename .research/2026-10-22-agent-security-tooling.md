# Research: AI agent / skill / MCP 資安工具生態（四層比較）

研究日：2026-10-22。方法：4 個 agent 分層精讀（各層詳細紀錄見 `2026-10-22-agent-security-tooling/` 內四份檔案），我再抽查關鍵數字回原文。全程只讀資料，沒有安裝或執行任何被研究的工具，也沒有掃描任何目標。

**補查（同日第二輪）**：第一輪有幾項標為讀不到，原因是沒走完備援鏈。第二輪改用 Cloudflare 瀏覽器工具、linkup、jina、arXiv HTML 版，補齊 OWASP 六項定義、Strix RCE 原文、兩篇繞過研究全文、三篇論文與審計 skill 附檔。補查的詳細紀錄見資料夾內 `gapA-owasp-reddit.md`、`gapB-bypass-research.md`、`gapC-papers.md`、`gapD-audit-skill-files.md`。本筆記以下已併入補查結果；與第一輪衝突處，以補查為準。

標記：【自述】作者自己說的；【第三方】獨立報導或研究；【實測】讀原始碼確認；[推論] 我的判斷。

## 子問題
1. 每個工具實際做什麼（偵測規則、檢查對象、輸出）？
2. 威脅模型與覆蓋範圍，對照 OWASP Agentic Top 10 到哪裡？
3. 已知限制、誤報漏報、繞過與第三方批評？
4. 成熟度與可信度（維護者、更新、授權）？
5. 四層如何互補、各適合什麼情境？

## 一句話結論
- 四層測的是**不同的東西**，不是同類產品：審計 skill 審「你的程式碼」，掃描器審「你要裝的 skill／MCP」，執行期治理管「agent 執行時做什麼」，紅隊工具則分兩派，一派用 AI 打傳統軟體，一派打 AI 本身。
- **沒有任何一層有中立的準確率數據。** 每個公開數字都來自作者自己或有利益關係的競品。
- **第 2 層掃描器都有被第三方繞過或看不到的紀錄，不能當唯一防線**，但說法要精確：Adversa 在 LLM judge 關閉的條件下測 8 個掃描器，8 個都有惡意 skill 通過，其中 6 個是被繞過，另外 2 個是離線什麼都不查或 judge 被注入；Trail of Bits 只測了 Cisco，沒測 NVIDIA。
- 微軟 toolkit 的「涵蓋 OWASP 10/10」是行銷用語，repo 自己寫的是 **7 Full、3 Partial**，且自稱內部自評。
- **HexStrike-AI 本身是風險**，不是防禦工具（見下）。

## 讀取完整度盤點（彙總）
各層逐項來源表在附檔。彙總規則：只有「整份讀完」才算 ✅；關鍵字搜尋或只讀前段一律 🟡。

| 項目 | 程度 | 說明 |
|---|---|---|
| Cloudflare 部落格全文 | ✅ | 我自己重抓並核對引文 |
| Cloudflare 全部 15 個 .md | ✅ | 補查已從第 1 行讀到最後一行 |
| trailofbits 相關 plugin（semgrep、codeql、insecure-defaults、supply-chain、differential-review、fp-check、agentic-actions-auditor） | ✅ | 補查已逐行讀；各 plugin 的 references/ 其餘檔案未讀 🟡 |
| SkillSpector／Cisco／AgentSeal README | ✅ | 原始碼為片段 🟡；已本機 clone 讀碼 |
| Cisco measured-results.md | 🟡 | 約前 330 行；7.7% 我已回原文核對 |
| Trail of Bits、Adversa、CSA 繞過研究 | ✅ | 補查已讀全文（Adversa 70,161 字元分 5 段）；ToB 隱藏的 .docx、.pyc、bootstrap.sh 本體未讀（GitHub 檔案清單被擋） |
| AGT README、LIMITATIONS、OWASP 對照文件 | ✅ | MCP 規格 §7 之後、ACS 決策引擎本體未讀 🟡 |
| OWASP Agentic Top 10 官方 PDF | ✅ | 補查取得官方 PDF 全文（約 99,868 字元）：Cloudflare 瀏覽器抓資源頁取得下載連結，再用 linkup 抓檔 |
| Strix、PyRIT、HackAgent README 與文件 | ✅ | |
| PyRIT 論文、HackAgent 白皮書、EthiBench 論文 | ✅ | 補查讀 arXiv HTML 版全文；圖內數字讀不到 |
| CSA 對 PyRIT 的評估 | ✅ | 公開頁面全文（85,496 字元）；登入後的 PDF 是否更多無法確認 |
| HexStrike server 原始碼（734KB） | 🟡 | 只做 grep 式閱讀；關鍵行我已自行核對 |
| Reddit r/netsec Strix RCE 貼文與其連結的原文 | ✅ | 貼文只是連結、沒有內文，連到 baldur.dk 的文章；原文我自己用 linkup 重抓核對 |

## 四層總覽

| 層 | 工具 | 做法 | 公開準確率 | 主要限制 |
|---|---|---|---|---|
| 1 審計 skill | cloudflare/security-audit-skill | 純 LLM 六階段多代理＋對抗驗證＋2 支 JSON 驗證腳本，不呼叫 Semgrep／CodeQL | 無；自述單次只找到約一半 | 無 Workers／D1／KV／Astro 專屬檢查；token 成本高 |
| 1 | trailofbits/skills（約 50 個 plugin） | Semgrep／CodeQL 腳本＋LLM 判斷的混合 | 無 | 同樣無 Workers／Astro 檢查；supply-chain 審計器不讀 pnpm-lock |
| 2 安裝前掃描 | NVIDIA/SkillSpector | 規則＋AST＋taint＋YARA，LLM 可選且只升不降 | 無自家評測；有第三方誤報 issue | 被 Adversa 繞過；規則數文件間不一致 |
| 2 | cisco-ai-defense/skill-scanner | 規則極輕，實務靠 LLM judge | 自述：規則單獨 recall 7.7%；加 LLM 後 66.7%／FPR 15.4% | 被 Trail of Bits 與 Adversa 繞過；大檔可逃過語意階段 |
| 2 | getagentseal/agentseal | regex＋去混淆＋嵌入模型 | 無 | `scan-mcp` 會啟動目標 server；FSL 授權；4 個月沒更新 |
| 3 執行期治理 | microsoft/agent-governance-toolkit | 函式庫＋hook；MCP 閘道全是啟發式 | 無獨立稽核 | Public Preview；未載入政策時預設放行；自承同行程邊界 |
| 4 紅隊（打傳統軟體） | usestrix/strix | AI agent 迴圈＋Kali 容器 | 自述 96%（CTF）；Escape 實測 1/20 | 範圍限制靠自然語言；有 prompt injection 反控的研究 |
| 4 | 0x4m4/hexstrike-ai | LLM 經 MCP 呼叫 150+ 工具 | 98.7% 等數字無方法說明 | 伺服器無驗證且可執行任意指令（見下） |
| 4 紅隊（打 AI 本身） | microsoft/PyRIT | 攻擊者模型＋converter＋scorer | 無偵測率 benchmark | 測的是模型回應，不是 agent 實際行為；PyPI 仍標 Alpha |
| 4 | AISecurityLab/hackagent | campaign＋攻擊目錄＋judge 模型 | 無獨立 benchmark | 小專案（528 ⭐）；judge 誤判率無公開數字 |

## 事實交叉表（只放「來源說了什麼」）

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| Cloudflare skill 不用 Semgrep：Hunter 一個月呼叫 0 次 | Cloudflare 部落格原文（我重抓核對） | 檔案樹只有 .md 與 4 支 .cjs | ✅ |
| Cloudflare 單次只找到多次總和約一半，且不聲稱假陰性率 | 部落格原文（核對） | README | ✅ |
| Cloudflare 內部 harness 驗證拒絕率 40%→11%，20,799 候選→約 12,057 存活 | 部落格原文（核對） | — | ✅ 限內部 harness，非公開 skill |
| Cisco 規則單獨 recall 7.7%、FPR 4.0% | Cisco README（我 grep 核對） | measured-results.md | ✅ 作者自述 |
| SkillSpector「從不執行被掃描的 skill」 | README 第 989 行（核對） | docs.nvidia.com | ✅ 自述 |
| AGT 自評 7 Full、3 Partial，且為內部自評 | 對照文件第 45、12 行（核對） | README 徽章 | ✅ |
| AGT 對外宣稱「10/10」 | repo 描述（GitHub API 核對） | 發表文 | ✅ 與上一列並存，是用語差異 |
| HexStrike `/api/command`、`shell=True`、`app.run(host="0.0.0.0")`、範圍為空時預設放行 | 我自行抓原始碼 grep：第 9137、5274、17289、13374 行 | issue #224 | ✅ 讀碼確認，未執行 |
| HexStrike 被地下論壇討論用於攻擊 Citrix 漏洞 | Check Point（措辭為 claimed） | 其他媒體多為轉述 | ⚠️ 只證明「有人討論」，不證明有效 |
| NVIDIA/SkillSpector 歸屬 NVIDIA 官方、20.8k ⭐ | GitHub API、docs.nvidia.com | NVIDIA 官方部落格 | ✅ 歸屬與星數屬實；成長曲線 ⚪ 無法驗證 |
| 微軟 toolkit 套件數 | 發表文與 Socket：7 | repo README 表：9；PyPI：5；目錄：26 | ❌ conflict（層次不同，非單純矛盾） |
| PolicyLayer：微軟 toolkit「完全看不到 MCP」 | PolicyLayer 全文 | repo 有 mcp_gateway.py、mcp_security.py 與 1970 行規格 | ❌ conflict，以 repo 為準；但「是函式庫而非獨立 proxy」部分成立；PolicyLayer 是競品廠商 |
| 第三方繞過研究的範圍 | Trail of Bits：只測 Cisco（Sonnet 4.6 LLM 開啟）與 ClawHub，沒給任何掃描器版本，也沒有成敗矩陣，沒測 NVIDIA | Adversa：測 8 個掃描器、全離線、LLM judge 關閉，8 個都有惡意 skill 通過（6 個被繞過；mondoo 離線不查；skillcop 的 judge 被注入） | ✅ 兩者都沒有廠商回應或重測；Adversa 事前未通知 Cisco 與 NVIDIA |
| Adversa「77 格錯 53 格」 | Adversa 原文 | — | ✅ 這是它自己「讀碼預測」與實測不符的格數，不是掃描器被繞過的比例 |
| Cisco 已在 2026-02-17 合併 Trail of Bits 的 PR #25 | Cisco repo | 早於 ToB 部落格 3.5 個月 | ✅ |
| CSA 彙整的語氣比 ToB 原文重（「Some caught none」、「five distinct products」） | CSA | ToB 原文找不到 | ❌ CSA 加強了語氣 |
| CSA 引用的 SkillSpector「64 patterns／87% precision」 | CSA | 現行 README：71 條、17 類、無 87% | ❌ conflict，「87%」仍找不到一手出處 |
| CSA 對 PyRIT 的「80%／40%」 | CSA 原文「Key Findings from Capability Assessment」 | — | ✅ 是 CSA 對能力覆蓋的評等（80% prompt 層 agentic 測試、40% 系統層 agent 驗證），全文沒說明算法，**不是偵測率或攻擊成功率** |
| PyRIT 論文有無攻擊成功率表 | 論文全文 | — | ✅ 沒有；只有 100+ 次作業、15 類傷害與 Gandalf 破解 |
| EthiBench 的 Strix 數字 | 論文文字沒有 Strix 絕對 precision／recall，主結果在圖裡 | Table 1（n=3）：Claude Code 比 Strix 的 precision 低 14.19%、recall 高 18.83%、F1 高 16.79% | ⚠️ 單位是百分點還是相對值論文沒說；只能說方向（Strix 精準度較高、召回較低） |
| HackAgent 白皮書結論的可信度 | 白皮書：自家工具、作者是實驗室負責人；ASR 分母是 attempts；攻擊者模型兩輪間不同 | 作者自己說只有「方向」可信；排名在不同面板門檻下會反轉 | ⚠️ |
| HackAgent judge 自身誤判率 | 無公開對人工標註的準確率 | 只有 judge 間一致率 81–89%（Gemini 與其他為 53–59%） | ⚪ |

## 補查新增：OWASP Top 10 for Agentic Applications 2026（官方 PDF，2025-12 版）
十項名稱與官方描述重點（描述為我對官方 Description 段的摘要，原文與 PDF 頁碼見 `gapA-owasp-reddit.md`；頁碼：ASI02 p.12、ASI03 p.15、ASI04 p.18、ASI05 p.21、ASI07 p.27、ASI09 p.33）：

| ID | 名稱 | 官方描述重點 |
|---|---|---|
| ASI01 | Agent Goal Hijack | 攻擊者操縱 agent 的目標、任務選擇或決策路徑（第一輪已讀原文） |
| ASI02 | Tool Misuse and Exploitation | agent 在被授權範圍內，因 prompt injection、錯位或模糊指令而不安全地使用合法工具（刪資料、過度呼叫昂貴 API、外洩）；涉及提權歸 ASI03，涉及任意程式碼執行歸 ASI05，工具定義經 MCP 取得時與 ASI04 重疊 |
| ASI03 | Identity and Privilege Abuse | 利用動態信任與委派，操縱委派鏈、角色繼承、快取憑證來提權；根因是以使用者為中心的身分系統與 agent 設計不匹配，agent 沒有自己受管的身分 |
| ASI04 | Agentic Supply Chain Vulnerabilities | 第三方 agent、工具、外掛、模型、MCP、A2A、註冊中心與更新管道被惡意或竄改；與一般供應鏈不同之處是 agent 會在**執行期**動態載入元件，形成「活的供應鏈」 |
| ASI05 | Unexpected Code Execution (RCE) | agent 即時產生並執行程式碼，可繞過傳統控制；prompt injection、工具誤用或不安全反序列化可把文字變成可執行行為，導致主機或容器被攻陷、持久化或逃出沙箱 |
| ASI06 | Memory & Context Poisoning | 污染 agent 的記憶或上下文，使後續推理、規劃或工具使用偏頗或不安全（第一輪已讀原文） |
| ASI07 | Insecure Inter-Agent Communication | agent 之間的訊息缺少認證、完整性或語意驗證，可被攔截、偽造或操縱；涵蓋傳輸、路由、探索與語意層，含旁路通道 |
| ASI08 | Cascading Failures | 單一故障在自主 agent 間傳播並放大（第一輪已讀原文） |
| ASI09 | Human-Agent Trust Exploitation | 利用人對 agent 的過度信任與自動化偏誤，讓人核准有害動作；agent 成為「無法追溯的壞影響」，審計紀錄只看到人做的最後一步 |
| ASI10 | Rogue Agents | 偏離預期功能或授權範圍的惡意或被入侵的 agent（第一輪已讀原文） |

第一輪出現的「ASI16」不在這十項之內，Cisco 與 NVIDIA 用的編號是否為官方版本仍未解（見待解問題）。

## 補查新增：Strix 的 prompt injection → 沙箱內 RCE（我自己重抓原文核對）
- 來源：Kevin Joensen（Baldur Security，丹麥）2026-05-27，baldur.dk/blog/strix-ai-pentester-rce/ 【第三方，獨立研究者；該公司販售 AI 安全審計服務】。
- 設定：LLM 為 `anthropic/claude-sonnet-4-6`；測試日約 2026-05-22。原文**沒寫 Strix 版本號**；agent 依 release 日期推論測試時最新是 v0.8.3（v1.0.0 在 05-26 才發布）[推論]；目前最新 v1.7.0。
- 攻擊鏈：被掃描網站的匿名留言放假的 Stripe key 當誘餌 → 編故事說金鑰已加密、解密腳本在攻擊者伺服器 → agent 抓腳本；直接叫它執行指令會被偵測為 prompt injection，作者把路徑改成看起來安全的名稱後通過 → agent 會先檢視腳本再執行，作者利用 TOCTOU：伺服器第一次回無害內容、第二次回反向 shell → 在沙箱內以 `pentester` 身分拿到 shell，且有 sudo。
- 限制：作者自己強調 Strix 有沙箱、「significantly lowers the impact」；沒有展示容器逃逸；沒有 CVE。
- 維護者回應：原文只有「Strix 的作者視為可接受風險」這句轉述，找不到維護者原話；repo 的 security 頁無 SECURITY.md、無公告；v0.8.3 到 v1.7.0 的 release notes 標題層級沒有對應修補，**但只讀標題、沒逐一讀 PR，不能排除未標明的緩解**。
- 同類研究（agent 只讀到搜尋摘錄，未讀全文）：Aonan Guan 2026-04-03 稱 Strix 的 system prompt 含「NEVER wait for approval」等語句，惡意 README 可誘使執行腳本；Cracken 2026-06-22 紅隊 agentic 紅隊工具的系列文。
- Reddit 貼文本身只是連結貼文，兩則留言都不是維護者。

## 補查新增：對 quidproquo 的具體發現
- **你的 repo 同時追蹤 `package-lock.json` 與 `pnpm-lock.yaml`，前者已過期**：`package-lock.json` 的 astro 是 6.0.8，`package.json` 是 `^7.3.2`（我自己核對）。Trail of Bits 的 supply-chain 審計器優先讀 `package-lock.json`、不讀 `pnpm-lock.yaml`，所以會拿過期版本去比對公告，而不是「沒有鎖檔」。這個不一致本身值得獨立處理。
- 順帶：本 repo 的 CLAUDE.md 寫 Astro 6，`package.json` 已是 7.x；以 `package.json` 為準。
- Cloudflare skill 沒有 OS 強制沙箱就不執行目標程式，Vectorize、Workers AI binding、secrets、dashboard 設定都會落到 `needs_validation`（無嚴重度）。這個雲端容器能否提供沙箱沒有驗證，實務上可能只剩讀碼模式。Cloudflare skill 有 budget／quick profile，成本可控。
- Cloudflare 的 AI-AND-LLM 附檔有 RAG 間接注入、embedding 跨租戶、記憶污染、工具參數注入、輸出渲染等檢查，但明說「prompt injection alone is not a finding」，也沒有 Vectorize 專屬項目。DATA-ISOLATION 與 ATTACK-CLASSES 的「索引副本／草稿／RSS 洩漏」與你的站（草稿文章、搜尋索引）較貼近。
- Trail of Bits 的 insecure-defaults 沒有 SKILL.md，入口是 `commands/audit.md` 加 `workflows/audit.js`（需要 Workflow 工具）；它的 deploy manifest 清單不含 wrangler，種子 regex 只含 `process.env`，不含 Workers 的 `env.X ?? 'x'`。
- 你的 6 個 GitHub Actions workflow 沒有 AI action，agentic-actions-auditor 預期會回「No AI action steps found」[推論]。
- 其他：ToB 的 semgrep 規則為 AGPLv3；semgrep 基線規則集含 `p/github-actions`。

## 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| 「規則存在」不等於「有效偵測」，掃描器只能當輔助篩選 | 兩份獨立繞過研究；Cisco 自承規則 recall 7.7%；Adversa 自己的讀碼預測與實測有 53 格不符（11 類×7 個實跑掃描器共 77 格） | 繞過測試在 LLM 關閉的條件下；ToB 沒給版本；SkillSpector 後來新增了正規化與 bytecode 等規則（改寫與圖片仍是已知限制），沒人重測，同形字修補我沒驗證 |
| Strix 這類「AI 攻擊者」本身也是攻擊面，且是一整類問題 | 至少兩份獨立研究（0.4.0、約 v0.8.x）指向同一類 prompt injection；維護者據轉述視為可接受風險；沒有修補證據 | 只讀 release notes 標題；維護者原話找不到；沙箱確實存在，風險是否外溢到宿主機沒有被證明 |
| Strix 的 96% 與 Escape 的 5% 不能互相推翻 | 題型（CTF vs 多漏洞 API）、模型、版本、單次運氣皆不同 | 可能有我沒看到的第五個變因 |
| 微軟 toolkit 的 OWASP Full 評級在 ASI01／03／05／10 偏樂觀 | 對照它自己的 LIMITATIONS 與證據檔內容 | 我只讀了片段，ACS 決策引擎本體不在 repo 中，未讀 |
| 這四層的星數主要反映話題度，不是成熟度 | Strix 70.8k 與 PyRIT 4.7k 差 15 倍；Cloudflare repo 只有 14 筆 commit 卻有 36.5k ⭐ | 沒取得星數時間序列，不能判斷是否自然成長 |
| 對 quidproquo：審計價值最大的是通用類別（存取控制、SSRF、機密外洩、AI／LLM 類別），不是 Workers 專屬 | 兩個審計 skill 皆無 Workers／D1／KV／Astro 規則 | 只做了關鍵字層級的 grep，沒逐行讀完附檔 |

## 草稿骨架

### 核心概念
這四層分別回答四個問題：我的程式碼有洞嗎？我要裝的 skill 安全嗎？agent 跑起來時誰來管？我的系統打得穿嗎？它們不是同一種工具，也不互相取代。

### 關鍵設計決定
- Cloudflare 放棄靜態分析、改走純 LLM 讀碼，理由是 agent 自己不愛用 Semgrep。Trail of Bits 反過來以工具為主。兩種取向在公開資料中都沒有準確率可比。
- 掃描器的共通取捨：規則便宜但容易被改寫繞過，LLM 判斷較強但會被「說服」、成本高，大檔還可能直接跳過語意階段。
- 微軟 toolkit 選擇做「函式庫＋hook」，而不是獨立 proxy，所以必須嵌進應用程式或 agent 框架。

### 跟替代方案的比較
見「四層總覽」表。

### 適合／不適合
- 審計 skill：適合當一次性基準審計；不適合當每次 PR 的閘門（成本高、Cloudflare 自己也把大掃描當定期作業）。
- 掃描器：適合安裝前篩選；不適合當唯一防線。
- 執行期治理：適合自己開發 agent 產品的團隊；對只是「使用」Claude Code 的個人網站，效益有限。
- 紅隊：只能對自己擁有或有書面授權的目標；HexStrike 不建議使用。

### 限制
所有準確率數據皆為作者自述或競品所測；沒有中立同台評測。

### 取捨總結
把每一層當成「減少風險的一道網」而非保證。最便宜的組合是安裝前掃描加自己審計一次。

## 待解問題（結案狀態）

| 項目 | 狀態 | 說明 |
|---|---|---|
| SkillSpector 星數成長是否自然 | ⚪ 確認無公開資料 | 試過 GitHub MCP、gh、star-history 頁（只有 title）、curl；未用瀏覽器看 star-history 圖 |
| SkillSpector「87% precision」出處 | ✉️ 需問 NVIDIA | README 無；只有 Help Net Security 與 CSA 轉述 |
| OWASP ASI02–05、07、09 的完整定義 | ✅ 已關閉 | 第二輪用 Cloudflare 瀏覽器工具取得下載連結，再用 linkup 抓到官方 PDF 全文 |
| Cisco 與 SkillSpector 的 OWASP 編號（ASI16、LLM 2026 編號）是否官方 | ✉️ 需讀 OWASP 原文 | 與 agent 所知 2025 版不一致，未判對錯 |
| Cloudflare skill 是否持續維護 | ✉️ 只能問人 | 14 筆 commit，最後 push 2026-09-14，issues 持續進來；可寄 README 公開的 security-ai-research@cloudflare.com |
| HexStrike issue #224 為何關閉 | ✉️ 只有擁有者或提報者知道 | 0 留言、無修補 commit |
| Strix 對 prompt injection 反控研究的官方回應與現行版本是否仍受影響 | ✉️ 需問 Strix 團隊 | 只有研究者轉述「視為可接受風險」；原文未寫版本號；沒有實測 v1.7.0 |
| ToB 繞過研究的隱藏檔（.docx、.pyc、bootstrap.sh 本體）、CSA 引用的 Bolha Sec 原文 | ⚪ 未讀 | GitHub 檔案清單被 session 限制擋住；試過 Groundlane、cloudflare |
| CSA 對 PyRIT 評估的登入後 PDF | ⚪ 無法確認 | 只讀到公開頁面全文 |
| EthiBench 圖內的 Strix 絕對數字 | ⚪ 讀不到 | arXiv HTML 版圖內數字無法取得；PDF 在 Groundlane 被截斷或回 OUTPUT_LIMIT |
| 各 plugin 的 references/ 其餘檔案（ToB） | ⚪ 未讀 | 不對其下結論 |
| AGT 7↔9 套件的轉折日期、基金會狀態、SUPPORT.md | ⚪ 淺 clone 追不到／未讀 | |
| AgentSeal 營運者身分與第三方評測 | ⚪ 確認無公開資料 | |
| 使用者給的 Strix 連結是否就是 usestrix/strix | ✉️ 請你確認 | agent 只確認該 repo 存在且名稱吻合 |

## 過程備註（降級與範圍）
- GitHub MCP 被 session 限制在本 repo，各 agent 改走 Groundlane、curl raw 檔案，或 `add_repo` 後淺 clone。第 2、3 層的 agent 用了 `add_repo` 加入掃描器與微軟 toolkit 的 repo（唯讀）。
- Firecrawl 額度在研究中用盡，其餘工具未受影響。
- 本筆記沒有 `sources.jsonl`：各層檔案內有逐來源的讀取程度表，但未轉成 jsonl 格式。
- 附檔（均為各層 agent 的完整原始紀錄）：`2026-10-22-agent-security-tooling/layer1-audit-skills.md`、`layer2-skill-scanners.md`、`layer3-runtime-governance.md`、`layer4-red-team.md`。
